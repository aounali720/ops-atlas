import { describe,expect,it } from 'vitest';
import { curriculum, lessons, worlds, emptyProgress, sanitizeProgress, questionsFor, buildExam,
  labAccepts, missionUnlocked, totalXP, playerLevel, dueCards, updateReview, completionRate } from './game';

describe('curriculum integrity',()=>{
  it('contains eight distinct worlds and forty playable missions',()=>{
    expect(curriculum.version).toBe(1);
    expect(worlds).toHaveLength(8);
    expect(lessons).toHaveLength(40);
    expect(new Set(lessons.map(l=>l.id)).size).toBe(40);
    expect(lessons.every((l,i)=>l.order===i+1)).toBe(true);
  });
  it('contains valid, original questions, cards and runnable-text labs',()=>{
    for(const l of lessons){
      expect(l.concepts).toHaveLength(3);
      expect(l.lab.answer.length).toBeGreaterThan(3);
      expect(l.sources[0]).toMatch(/^https:\/\//);
      const qs=questionsFor(l);
      expect(qs).toHaveLength(3);
      qs.forEach(q=>{
        expect(q.options).toHaveLength(4);
        expect(new Set(q.options).size).toBe(4);
        expect(q.options[q.correct]).toBeTruthy();
        expect(q.explanation.length).toBeGreaterThan(10);
      });
    }
  });
  it('produces an exam from a domain or all domains',()=>{
    expect(buildExam('all')).toHaveLength(15);
    expect(buildExam('git')).toHaveLength(15);
    expect(buildExam('git',100)).toHaveLength(15);
  });
});
describe('game safety and progress',()=>{
  it('unlocks missions sequentially',()=>{
    const p=emptyProgress();
    expect(missionUnlocked(lessons[0],p)).toBe(true);
    expect(missionUnlocked(lessons[1],p)).toBe(false);
    p.completed=[lessons[0].id];
    expect(missionUnlocked(lessons[1],p)).toBe(true);
    expect(totalXP(p)).toBe(100);
    expect(playerLevel(p)).toBe(1);
    expect(completionRate(p)).toBe(3);
  });
  it('checks simulated commands exactly after whitespace normalization',()=>{
    expect(labAccepts('docker image ls',' docker   image ls ')).toBe(true);
    expect(labAccepts('docker image ls','docker image rm')).toBe(false);
  });
  it('rejects wrong imported versions, unknown ids, and malformed fields',()=>{
    expect(sanitizeProgress({version:999}).completed).toEqual([]);
    const p=sanitizeProgress({version:1,completed:['made-up',lessons[0].id,lessons[0].id],
      examBest:200,review:{'not-a-card':{due:0,reps:0,interval:0}}});
    expect(p.completed).toEqual([lessons[0].id]);
    expect(p.examBest).toBe(100);
    expect(p.review).toEqual({});
  });
  it('schedules reviews and only includes due flashcards',()=>{
    const p=emptyProgress(), now=1000000;
    expect(dueCards(p)).toHaveLength(120);
    const key=lessons[0].id+':0';
    p.review[key]=updateReview(undefined,true,now);
    expect(p.review[key].due).toBeGreaterThan(now);
    expect(dueCards(p,'all',now)).toHaveLength(119);
    expect(updateReview(p.review[key],false,now).reps).toBe(0);
  });
});
