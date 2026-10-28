import { describe, expect, it } from 'vitest';
import { emptyProgress, lessons, sanitizeProgress, totalXP } from './game';
import { buyCosmetic, claimQuest, chosenCosmetic, dailyFor, equipCosmetic, questStatus,
  recordActivity, recordArena, recordCardReview, recordMission, streakDays, todayKey } from './gamification';

const day = '2026-10-28';
const first = lessons[0];

describe('Ops Atlas arcade progression', () => {
  it('migrates version-one saves without losing existing campaign results', () => {
    const old = sanitizeProgress({ version:1, completed:[first.id], labs:[first.id],
      passedQuizzes:[first.id], review:{}, examBest:90, examAttempts:2 });
    expect(old.completed).toEqual([first.id]);
    expect(old.coins).toBe(15);
    expect(old.bonusXp).toBe(0);
    expect(old.unlockedCosmetics).toContain('rookie');
    expect(old.equippedCosmetic).toBe('rookie');
    expect(totalXP(old)).toBe(first.xp);
  });

  it('awards mission credits only once even if the mission is revisited', () => {
    const cleared = recordMission(emptyProgress(), first.id, false,day);
    expect(cleared.completed).toEqual([first.id]);
    expect(cleared.coins).toBe(15);
    expect(recordMission(cleared,first.id,false,day)).toEqual(cleared);
    expect(questStatus(cleared,day).find(q=>q.id==='operator')?.ready).toBe(true);
  });

  it('uses unique flashcards; reviewing one five times does not farm the quest', () => {
    const key = first.id+':0';
    let p=emptyProgress();
    for(let i=0;i<5;i++) p=recordCardReview(p,key,day);
    expect(questStatus(p,day)[0].count).toBe(1);
    for(let i=0;i<5;i++)p=recordCardReview(p,first.id+':'+(i%3),day);
    expect(questStatus(p,day)[0].ready).toBe(false);
    p=recordCardReview(p,lessons[1].id+':0',day);
    p=recordCardReview(p,lessons[1].id+':1',day);
    expect(questStatus(p,day)[0].ready).toBe(true);
  });

  it('awards earned quests once per calendar day and refreshes on the next day', () => {
    let p=recordArena(emptyProgress(),92,day);
    const operator=questStatus(p,day).find(q=>q.id==='operator');
    expect(operator?.ready).toBe(true);
    p=claimQuest(p,'operator',day);
    expect(p.coins).toBe(35);
    expect(p.bonusXp).toBe(60);
    expect(claimQuest(p,'operator',day)).toEqual(p);
    p=claimQuest(p,'arena',day);
    expect(p.coins).toBe(85);
    expect(p.bonusXp).toBe(140);
    expect(dailyFor(p,'2026-10-29').claimed).toEqual([]);
    expect(questStatus(p,'2026-10-29')[1].ready).toBe(false);
    expect(claimQuest(p,'operator','2026-10-29')).toEqual(p);
  });

  it('tracks consecutive real learning days and holds yesterday streak through today', () => {
    let p=emptyProgress();
    p=recordActivity(p,'2026-10-25');
    p=recordActivity(p,'2026-10-26');
    p=recordActivity(p,'2026-10-27');
    expect(streakDays(p,'2026-10-28')).toBe(3);
    expect(p.bestStreak).toBe(3);
    expect(streakDays(p,'2026-10-29')).toBe(0);
    p=recordActivity(p,'2026-10-28');
    expect(streakDays(p,'2026-10-28')).toBe(4);
    expect(p.bestStreak).toBe(4);
  });

  it('makes cosmetics purchasable once and only equips owned items', () => {
    const rookie=emptyProgress();
    expect(equipCosmetic(rookie,'dragon')).toEqual(rookie);
    expect(buyCosmetic(rookie,'dragon')).toEqual(rookie);
    const wealthy={...rookie,coins:250};
    const purchased=buyCosmetic(wealthy,'guardian');
    expect(purchased.coins).toBe(70);
    expect(purchased.unlockedCosmetics).toContain('guardian');
    expect(buyCosmetic(purchased,'guardian').coins).toBe(70);
    const equipped=equipCosmetic(purchased,'guardian');
    expect(chosenCosmetic(equipped).title).toBe('Infra Guardian');
  });

  it('sanitizes imported arcade values and never trusts injected ids', () => {
    const v=sanitizeProgress({version:1,coins:Infinity,bonusXp:-30,bestStreak:99999,
      equippedCosmetic:'dragon',unlockedCosmetics:['dragon','made-up'],
      activityDays:['nonsense','2026-10-27'],
      daily:{ day, missionIds:['fake'],cardIds:['fake'],claimed:['invalid'],
        arenaRuns:Infinity,arenaWins:55 }});
    expect(v.coins).toBe(0);
    expect(v.bonusXp).toBe(0);
    expect(v.bestStreak).toBe(400);
    expect(v.unlockedCosmetics).toEqual(['rookie','dragon']);
    expect(v.equippedCosmetic).toBe('dragon');
    expect(v.daily.missionIds).toEqual([]);
    expect(v.daily.cardIds).toEqual([]);
    expect(v.daily.arenaRuns).toBe(0);
    expect(v.daily.arenaWins).toBe(0);
    expect(v.daily.claimed).toEqual([]);
    expect(v.activityDays).toEqual(['2026-10-27']);
  });

  it('formats local dates consistently', () => {
    expect(todayKey(new Date(2026,9,28,23,55))).toBe(day);
  });
});
