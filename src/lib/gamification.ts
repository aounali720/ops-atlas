import type { DailyProgress, Progress } from '../data/types';

export const todayKey = (date = new Date()): string =>
  `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

export const emptyDaily = (day: string): DailyProgress => ({
  day, missionIds: [], cardIds: [], arenaRuns: 0, arenaWins: 0, claimed: [],
});

export const COSMETICS = [
  { id: 'rookie', name: 'Trailblazer', symbol: '⚡', title: 'Stack Explorer', price: 0, flavor: 'The first spark of an adventure.' },
  { id: 'orbit', name: 'Orbit Ranger', symbol: '🪐', title: 'Cloud Navigator', price: 80, flavor: 'Chart a path through the clouds.' },
  { id: 'guardian', name: 'Stack Guardian', symbol: '🛡️', title: 'Infra Guardian', price: 180, flavor: 'Keep production safe and steady.' },
  { id: 'dragon', name: 'Neon Dragon', symbol: '🐉', title: 'Legendary Operator', price: 320, flavor: 'Earned through dedication, not luck.' },
] as const;

export type CosmeticId = (typeof COSMETICS)[number]['id'];
export const QUESTS = [
  { id: 'recall', title: 'Memory Spark', summary: 'Review 5 distinct flashcards', goal: 5, xp: 40, coins: 25 },
  { id: 'operator', title: 'Operator Shift', summary: 'Clear a new mission or finish an arena exam', goal: 1, xp: 60, coins: 35 },
  { id: 'arena', title: 'Arena Challenger', summary: 'Score at least 80% in an arena exam', goal: 1, xp: 80, coins: 50 },
] as const;
export type QuestId = (typeof QUESTS)[number]['id'];

export const dailyFor = (p: Progress, day = todayKey()): DailyProgress =>
  p.daily.day === day ? p.daily : emptyDaily(day);

const utcDay = (day: string): number => Date.parse(day+'T00:00:00Z') / 86400000;

/** Streak is based on real learning activity, not opening the page or purchasing cosmetics. */
export function streakDays(p: Progress, today = todayKey()): number {
  const days = new Set(p.activityDays);
  let cursor = utcDay(today);
  if (!days.has(today)) cursor -= 1; // A streak remains alive until the end of today.
  let count = 0;
  while (count < 400 && days.has(new Date(cursor*86400000).toISOString().slice(0,10))) { count++; cursor--; }
  return count;
}

export function recordActivity(p: Progress, day = todayKey()): Progress {
  if (p.activityDays.includes(day)) return p;
  const activityDays = [...p.activityDays, day].sort().slice(-400);
  const draft = { ...p, activityDays };
  return { ...draft, bestStreak: Math.max(p.bestStreak, streakDays(draft,day)) };
}

export function recordCardReview(p: Progress, id: string, day = todayKey()): Progress {
  const daily = dailyFor(p,day);
  const cardIds = daily.cardIds.includes(id) ? daily.cardIds : [...daily.cardIds,id].slice(0,120);
  return recordActivity({ ...p, daily: { ...daily, cardIds } },day);
}

export function recordMission(p: Progress, id: string, isBoss: boolean, day = todayKey()): Progress {
  if (p.completed.includes(id)) return p;
  const daily = dailyFor(p,day);
  return recordActivity({ ...p, completed:[...p.completed,id],
    coins:p.coins + (isBoss ? 45 : 15),
    daily:{ ...daily, missionIds:[...daily.missionIds,id] } },day);
}

export function recordArena(p: Progress, score: number, day = todayKey()): Progress {
  const daily = dailyFor(p,day);
  return recordActivity({ ...p, examBest: Math.max(p.examBest,score), examAttempts:p.examAttempts+1,
    daily:{ ...daily, arenaRuns:Math.min(100,daily.arenaRuns+1),
      arenaWins:Math.min(100,daily.arenaWins+(score>=80?1:0)) } },day);
}

export function questStatus(p: Progress, day = todayKey()) {
  const daily = dailyFor(p,day);
  return QUESTS.map(q=>{
    const count = q.id==='recall' ? daily.cardIds.length :
      q.id==='operator' ? (daily.missionIds.length>0 || daily.arenaRuns>0 ? 1 : 0) :
        (daily.arenaWins>0 ? 1 : 0);
    return { ...q, count: Math.min(q.goal,count),
      ready:count>=q.goal, claimed:daily.claimed.includes(q.id) };
  });
}

export function claimQuest(p: Progress, id: string, day = todayKey()): Progress {
  const status = questStatus(p,day).find(q=>q.id===id);
  if (!status || !status.ready || status.claimed) return p;
  return { ...p, coins:p.coins+status.coins, bonusXp:p.bonusXp+status.xp,
    daily:{...dailyFor(p,day),claimed:[...dailyFor(p,day).claimed,id]} };
}

export function buyCosmetic(p: Progress, id: string): Progress {
  const item = COSMETICS.find(c=>c.id===id);
  if (!item || p.unlockedCosmetics.includes(id) || p.coins<item.price) return p;
  return { ...p,coins:p.coins-item.price,unlockedCosmetics:[...p.unlockedCosmetics,id] };
}

export function equipCosmetic(p: Progress, id: string): Progress {
  return p.unlockedCosmetics.includes(id) && COSMETICS.some(c=>c.id===id)
    ? { ...p,equippedCosmetic:id } : p;
}

export function chosenCosmetic(p: Progress) {
  return COSMETICS.find(c=>c.id===p.equippedCosmetic) ?? COSMETICS[0];
}
