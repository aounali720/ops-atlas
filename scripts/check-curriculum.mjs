import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const data = JSON.parse(readFileSync(new URL('../src/data/curriculum.json', import.meta.url), 'utf8'));
assert.equal(data.version, 1);
assert.equal(data.worlds.length, 8, 'expected eight worlds');
assert.equal(data.lessons.length, 40, 'expected forty missions');
const ids = new Set();
for (const world of data.worlds) {
  assert.equal(data.lessons.filter(l => l.world === world.id).length, 5, `${world.id}: expected five levels`);
  assert.match(world.source, /^https:\/\//);
}
for (const [index, lesson] of data.lessons.entries()) {
  assert(!ids.has(lesson.id), `duplicate lesson ID ${lesson.id}`);
  ids.add(lesson.id);
  assert.equal(lesson.order, index+1, `${lesson.id}: invalid mission order`);
  assert(lesson.number >= 1 && lesson.number <= 5);
  assert.equal(lesson.isBoss, lesson.number === 5);
  assert(data.worlds.some(w => w.id === lesson.world));
  for (const key of ['title','summary','example','objective','tip','questStory']) assert(lesson[key]?.length > 4, `${lesson.id}: ${key} empty`);
  assert.equal(lesson.concepts.length, 3);
  assert.equal(new Set(lesson.concepts.map(c => c.term)).size, 3);
  for (const c of lesson.concepts) assert(c.term.length>1 && c.definition.length>20);
  assert.equal(lesson.scenario.options.length,4);
  assert.equal(new Set(lesson.scenario.options).size,4);
  assert(Number.isInteger(lesson.scenario.correct) && lesson.scenario.correct>=0 && lesson.scenario.correct<4);
  assert(lesson.scenario.question.length>10 && lesson.scenario.explanation.length>15);
  for (const key of ['prompt','answer','hint']) assert(lesson.lab[key]?.length>5,`${lesson.id}: invalid lab ${key}`);
  assert.equal(lesson.takeaways.length,3);
  assert.equal(lesson.sources.length>=1,true);
  assert(lesson.sources.every(s=>s.startsWith('https://')));
  assert.equal(lesson.xp, lesson.isBoss ? 180 : 100);
}

const fieldNotes = JSON.parse(readFileSync(new URL('../src/data/field-notes.json', import.meta.url), 'utf8'));
const playbooks = JSON.parse(readFileSync(new URL('../src/data/playbooks.json', import.meta.url), 'utf8'));
assert.deepEqual(Object.keys(fieldNotes).sort(), data.lessons.map(l => l.id).sort(), 'Each mission must have one field note');
for (const [id, note] of Object.entries(fieldNotes)) {
  for (const key of ['mentalModel','verify','watch']) assert(typeof note[key]==='string' && note[key].length>55, id+': missing '+key);
}
assert.deepEqual(playbooks.map(p=>p.id),data.worlds.map(w=>w.id),'Runbooks must follow the campaign worlds');
for (const guide of playbooks) {
  assert(guide.title.length>10 && guide.situation.length>60);
  assert.equal(guide.steps.length,4);
  assert.equal(guide.signals.length,3);
  assert.equal(guide.question.options.length,4);
  assert.equal(new Set(guide.question.options).size,4);
  assert(Number.isInteger(guide.question.correct) && guide.question.correct>=0 && guide.question.correct<4);
  assert(guide.question.why.length>25);
  for(const item of guide.steps) assert(item.label.length>5 && item.command.length>10 && item.reason.length>40);
  for(const item of guide.signals) assert(item.symptom.length>8 && item.inspect.length>10 && item.next.length>25);
  assert(guide.sources.every(url=>url.startsWith('https://')));
}
console.log('VALIDATED: 40 mission field notes, 8 runbooks, 32 investigation steps, 24 diagnostics, 8 decision questions.');
console.log(`VALIDATED: ${data.worlds.length} worlds, ${data.lessons.length} missions, ${data.lessons.length*3} MCQs, ${data.lessons.length*3} flashcards, ${data.lessons.length} command labs, ${data.worlds.length} boss missions.`);
