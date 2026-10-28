import raw from '../data/curriculum.json';
import type { Curriculum, Lesson, Progress, QuizQuestion, ReviewState } from '../data/types';
import { COSMETICS, QUESTS, emptyDaily } from './gamification';

export const curriculum = raw as Curriculum;
export const lessons = curriculum.lessons;
export const worlds = curriculum.worlds;
export const PROGRESS_KEY = 'stackbound-progress-v1';
export const emptyProgress = (): Progress => ({
  version: 1, completed: [], labs: [], passedQuizzes: [], review: {},
  examBest: 0, examAttempts: 0, bookmarks: [], lastLesson: null,
  bonusXp: 0, coins: 0, daily: emptyDaily(''), activityDays: [], bestStreak: 0,
  unlockedCosmetics: ['rookie'], equippedCosmetic: 'rookie',
});
const lessonIds = new Set(lessons.map(x => x.id));
const cardIds = new Set(lessons.flatMap(l => l.concepts.map((_,i)=>l.id+':'+i))); 
const dates = (value: unknown): string[] => Array.isArray(value) ?
  [...new Set(value.filter((d): d is string =>
    typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)
    && Number.isFinite(Date.parse(d+'T00:00:00Z'))))].sort().slice(-400) : [];
const bounded = (n: unknown, max: number) => typeof n === 'number' && Number.isFinite(n)
  ? Math.max(0, Math.min(max, Math.floor(n))) : 0;
const uniq = (value: unknown): string[] =>
  Array.isArray(value) ? [...new Set(value.filter((x): x is string => typeof x === 'string' && lessonIds.has(x)))] : [];

// Only documented progress fields cross the import boundary; never trust arbitrary JSON.
export function sanitizeProgress(value: unknown): Progress {
  const blank = emptyProgress();
  if (!value || typeof value !== 'object' || Array.isArray(value)) return blank;
  const v = value as Partial<Progress>;
  if (v.version !== 1) return blank;
  const review: Record<string, ReviewState> = {};
  if (v.review && typeof v.review === 'object' && !Array.isArray(v.review)) {
    for (const [key, item] of Object.entries(v.review)) {
      if (Object.hasOwn(v.review, key) && cardIds.has(key)
        && item && typeof item === 'object'
        && Number.isFinite(item.interval) && Number.isFinite(item.due) && Number.isFinite(item.reps)) {
        review[key] = { interval: Math.max(0, Math.min(365, item.interval)),
          due: Math.max(0, item.due), reps: Math.max(0, Math.min(500, item.reps)) };
      }
    }
  }
  const completed = uniq(v.completed);
  const dailyInput = v.daily && typeof v.daily==='object' && !Array.isArray(v.daily) ? v.daily : null;
  const date = typeof dailyInput?.day==='string' && dates([dailyInput.day]).length===1 ? dailyInput.day : '';
  const daily = emptyDaily(date);
  if (date && dailyInput) {
    daily.missionIds = uniq(dailyInput.missionIds).slice(0,40);
    daily.cardIds = Array.isArray(dailyInput.cardIds)
      ? [...new Set(dailyInput.cardIds.filter((id): id is string => typeof id==='string' && cardIds.has(id)))].slice(0,120) : [];
    daily.arenaRuns = bounded(dailyInput.arenaRuns,100);
    daily.arenaWins = Math.min(daily.arenaRuns,bounded(dailyInput.arenaWins,100));
    daily.claimed = Array.isArray(dailyInput.claimed)
      ? [...new Set(dailyInput.claimed.filter((id): id is string =>
        typeof id==='string' && QUESTS.some(q=>q.id===id)))].slice(0,QUESTS.length) : [];
  }
  const available = ['rookie',...(Array.isArray(v.unlockedCosmetics) ? v.unlockedCosmetics.filter((id): id is string =>
    typeof id==='string' && COSMETICS.some(c=>c.id===id)) : [])];
  const unlockedCosmetics = [...new Set(available)];
  const equippedCosmetic = typeof v.equippedCosmetic==='string' && unlockedCosmetics.includes(v.equippedCosmetic)
    ? v.equippedCosmetic : 'rookie';
  return { version: 1, completed, labs: uniq(v.labs),
    passedQuizzes: uniq(v.passedQuizzes), review,
    examBest: bounded(v.examBest,100), examAttempts: bounded(v.examAttempts,10000),
    bookmarks: uniq(v.bookmarks),
    lastLesson: typeof v.lastLesson === 'string' && lessonIds.has(v.lastLesson) ? v.lastLesson : null,
    bonusXp: bounded(v.bonusXp,1000000),
    // Players upgrading from the original release keep the credits their missions would have earned.
    coins: typeof v.coins==='number' && Number.isFinite(v.coins) ? bounded(v.coins,1000000)
      : completed.reduce((sum,id)=>sum+(lessons.find(l=>l.id===id)?.isBoss?45:15),0),
    daily, activityDays: dates(v.activityDays), bestStreak: bounded(v.bestStreak,400),
    unlockedCosmetics, equippedCosmetic };

}
export function readProgress(): Progress {
  try { return sanitizeProgress(JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? 'null')); }
  catch { return emptyProgress(); }
}
export const totalXP = (p: Progress) => lessons.filter(l => p.completed.includes(l.id)).reduce((n,l) => n+l.xp,0) + p.bonusXp;
export const playerLevel = (p: Progress) => Math.floor(totalXP(p)/400)+1;
export const missionUnlocked = (l: Lesson, p: Progress) => l.order === 1 || p.completed.includes(lessons[l.order-2].id);
export const nextLesson = (p: Progress) => lessons.find(l => !p.completed.includes(l.id)) ?? lessons[lessons.length-1];
export const completionRate = (p: Progress) => Math.round(100*p.completed.length/lessons.length);
export const normalizeCommand = (v: string) => v.replace(/\s+/g, ' ').trim();
export const labAccepts = (answer: string, input: string) => normalizeCommand(answer) === normalizeCommand(input);
function hash(s: string): number { let n=2166136261; for(let i=0;i<s.length;i++) n=Math.imul(n^s.charCodeAt(i),16777619); return n>>>0; }
function shuffled<T>(arr: T[], seed: string): T[] {
  return arr.map((v,i)=>({v,k:hash(seed+'-'+i)})).sort((a,b)=>a.k-b.k).map(x=>x.v);
}
export function questionsFor(lesson: Lesson): QuizQuestion[] {
  const pool = lessons.filter(l => l.world===lesson.world).flatMap(l=>l.concepts);
  const conceptQuestions: QuizQuestion[] = lesson.concepts.slice(0,2).map((concept,index) => {
    const distractors = shuffled(pool.filter(c => c.term!==concept.term && c.definition!==concept.definition),lesson.id+'-'+index)
      .slice(0,3).map(c => c.definition);
    const options = shuffled([concept.definition,...distractors],lesson.id+'-answers-'+index);
    return { id:lesson.id+'-term-'+index,question:`Which description best matches “${concept.term}”?`,
      options,correct:options.indexOf(concept.definition),explanation:concept.definition };
  });
  return [...conceptQuestions, { id:lesson.id+'-scenario',...lesson.scenario }];
}
export function buildExam(worldFilter: string, length=15, attemptSeed=0): QuizQuestion[] {
  const pool = lessons.filter(l => worldFilter==='all' || l.world===worldFilter);
  const items = pool.flatMap(questionsFor);
  return shuffled(items,'exam-'+worldFilter+'-'+attemptSeed).slice(0,Math.min(length,items.length));
}
export function updateReview(previous: ReviewState | undefined, remembered: boolean, now=Date.now()): ReviewState {
  if (!remembered) return {interval:1, reps:0, due:now + 24*60*60*1000};
  const reps = Math.min(500,(previous?.reps ?? 0)+1);
  const interval = reps===1 ? 1 : reps===2 ? 3 : Math.min(365,Math.ceil((previous?.interval ?? 3)*2.2));
  return {interval,reps,due:now+interval*24*60*60*1000};
}
export function dueCards(p: Progress, worldFilter='all', now=Date.now()) {
  return lessons.filter(l=>worldFilter==='all'||l.world===worldFilter).flatMap(l=>l.concepts.map((c,i)=>({
    ...c, id:l.id+':'+i, lesson:l.title, world:l.world,
  }))).filter(c=>!p.review[c.id] || p.review[c.id].due<=now);
}
export function achievementStats(p: Progress) {
  return [
    { id:'first', icon:'sparkles', name:'First Commit', detail:'Complete your first mission', earned:p.completed.length>=1 },
    { id:'git', icon:'git-branch', name:'Git Whisperer', detail:'Complete the Git Foundations world', earned:lessons.filter(l=>l.world==='git').every(l=>p.completed.includes(l.id)) },
    { id:'docker', icon:'container', name:'Container Captain', detail:'Finish all Docker Essentials missions', earned:lessons.filter(l=>l.world==='docker').every(l=>p.completed.includes(l.id)) },
    { id:'half', icon:'trophy', name:'Halfway Hero', detail:'Complete 20 missions', earned:p.completed.length>=20 },
    { id:'scholar', icon:'layers', name:'Memory Architect', detail:'Review 25 different flashcards', earned:Object.keys(p.review).length>=25 },
    { id:'exam', icon:'graduation-cap', name:'Exam Slayer', detail:'Score 80% or better on a mock exam', earned:p.examBest>=80 },
    { id:'boss', icon:'shield', name:'Boss Hunter', detail:'Complete every world boss', earned:lessons.filter(l=>l.isBoss).every(l=>p.completed.includes(l.id)) },
    { id:'master', icon:'crown', name:'Ops Atlas Legend', detail:'Complete all 40 missions', earned:p.completed.length===lessons.length },
  ];
}
