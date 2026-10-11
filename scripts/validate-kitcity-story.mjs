import fs from "node:fs";
import assert from "node:assert/strict";

const source = fs.readFileSync(new URL("../game/kitcity-story.js", import.meta.url), "utf8");
const engine = fs.readFileSync(new URL("../game/kitcity-engine.js", import.meta.url), "utf8");
const section = (start, end) => {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);
  assert.notEqual(a, -1, `Missing section: ${start}`);
  assert.notEqual(b, -1, `Missing section end: ${end}`);
  return source.slice(a, b);
};

const missionLines = section("  missions: [", "  postStory:");
const missions = [...missionLines.matchAll(/^\s*\{id:"(tc-\d+)"[^\n]*$/gm)].map(m => m[0]);
const ids = [...missionLines.matchAll(/\{id:"(tc-\d+)"/g)].map(m => m[1]);
assert.equal(ids.length, 31, "The main story must contain 31 missions");
assert.equal(new Set(ids).size, ids.length, "Mission IDs must be unique");
assert.deepEqual(ids, Array.from({ length: 31 }, (_, i) => "tc-" + String(i + 1).padStart(2, "0")));

const requiredFields = [
  "chapterId:", "title:", "state:", "cityKey:", "characters:", "category:",
  "purpose:", "panels:", "dialogue:", "learningObjectives:", "prerequisites:",
  "objectives:", "success:", "failure:", "rewards:", "storyFlags:", "nextMission:", "cliffhanger:"
];
for (const line of missions) {
  const id = line.match(/\{id:"(tc-\d+)"/)[1];
  for (const field of requiredFields) assert.ok(line.includes(field), `${id} is missing ${field}`);
}

const stateBlock = section("  stateJourney: [", "  ].map(([state, cityKey]");
const states = [...stateBlock.matchAll(/\["([^"]+)","([^"]+)"\]/g)].map(m => m[1]);
assert.equal(states.length, 36, "The route must cover all 36 Nigerian states");
assert.equal(new Set(states).size, 36, "State route must not duplicate states");
assert.ok(!states.includes("Federal Capital Territory"), "FCT must not be a required destination");

const rosterBlock = section("  characterOrder: [", "  ],\n  chapters:");
const roster = [...rosterBlock.matchAll(/"([^"]+)"/g)].map(m => m[1]);
assert.equal(roster.length, 50, "The supplied character sequence has 50 names");
const firstAppearances = [];
for (const match of missionLines.matchAll(/characters:\[([^\]]+)\]/g)) {
  for (const name of match[1].matchAll(/"([^"]+)"/g)) {
    if (!firstAppearances.includes(name[1])) firstAppearances.push(name[1]);
  }
}
assert.deepEqual(firstAppearances, roster, "Characters must first appear in the required order");

for (let i = 0; i < ids.length; i++) {
  const id = ids[i];
  const line = missions[i];
  const prereqText = line.match(/prerequisites:\[([^\]]*)\]/)?.[1] || "";
  const prereqs = [...prereqText.matchAll(/"(tc-\d+)"/g)].map(m => m[1]);
  for (const prereq of prereqs) {
    assert.ok(ids.indexOf(prereq) < i, `${id} has a prerequisite that does not precede it: ${prereq}`);
  }
  const next = line.match(/nextMission:(null|"tc-\d+")/)?.[1];
  assert.equal(next, i === ids.length - 1 ? "null" : `"${ids[i + 1]}"`, `${id} must link to the next story mission`);
}

assert.ok(source.includes('finalDestination: "KitCity"'), "KitCity must be the final destination");
assert.ok(source.includes('revealMissionId: "tc-31"'), "The T3Kit mystery must resolve in the final mission");
assert.ok(source.includes("realFundsRequired:false"), "The story must not require real funds");
assert.ok(source.includes("realBlockchainTransactionsRequired:false"), "The story must not require real transactions");

/* A story script is a playable sequence, not a paragraph attached to one NPC. */
assert.ok(engine.includes("if(Array.isArray(o.sceneDialogue)&&o.sceneDialogue.length)"), "Story dialogue must be played line by line");
assert.ok(engine.includes("const sceneCast=Array.isArray(o.sceneCast)?o.sceneCast:[]"), "Scene dialogue must resolve its speaker cast");
assert.ok(engine.includes("if(Array.isArray(st.sceneCast))"), "Every listed scene character must be placed in the 3D world");
assert.ok(engine.includes("SCRIPT · '+scriptLine+' / '+scriptTotal"), "Each bubble must show its script speaker and position");
const opening = missions[0];
assert.ok(opening.includes('characters:["Softstorm","IamAbdul"]'), "Opening scene must cast both Softstorm and IamAbdul");
assert.ok(opening.includes('speaker:"Softstorm"') && opening.includes('speaker:"IamAbdul"'), "Both opening characters must actually speak in dialogue bubbles");
for (const line of missions) {
  const id = line.match(/\\{id:"(tc-\\d+)"\\}/)[1];
  assert.ok(line.includes("dialogue:[{speaker:"), `${id} must contain actual spoken dialogue`);
  assert.ok(line.includes("panels:["), `${id} must contain comic scene panels`);
}

console.log("T3Kit Chronicles validation passed: 31 missions, 36 states, 50 characters, ordered progression, playable speaker-by-speaker scripts, and sandbox-only finance.");
