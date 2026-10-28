export interface Concept { term: string; definition: string }
export interface Scenario { question: string; options: string[]; correct: number; explanation: string }
export interface Lesson {
  id: string; world: string; order: number; number: number; title: string; summary: string;
  example: string; objective: string; tip: string; questStory: string; takeaways: string[];
  lab: { prompt: string; answer: string; hint: string }; concepts: Concept[];
  scenario: Scenario; xp: number; minutes: number; isBoss: boolean; sources: string[];
}
export interface World {
  id: string; number: string; title: string; place: string; icon: string;
  difficulty: string; accent: string; source: string; description: string;
}
export interface Curriculum { version: number; lessons: Lesson[]; worlds: World[] }
export interface QuizQuestion { id: string; question: string; options: string[]; correct: number; explanation: string }
export interface ReviewState { interval: number; due: number; reps: number }
export interface DailyProgress {
  day: string; missionIds: string[]; cardIds: string[]; arenaRuns: number;
  arenaWins: number; claimed: string[];
}
export interface Progress {
  version: 1; completed: string[]; labs: string[]; passedQuizzes: string[];
  review: Record<string, ReviewState>; examBest: number; examAttempts: number;
  bookmarks: string[]; lastLesson: string | null;
  bonusXp: number; coins: number; daily: DailyProgress; activityDays: string[];
  bestStreak: number; unlockedCosmetics: string[]; equippedCosmetic: string;
}
export type Screen = 'dashboard'|'world'|'lesson'|'flashcards'|'arena'|'achievements'|'resources'|'quests'|'vault';
