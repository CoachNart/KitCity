import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
async function importSource(relativePath) {
  const source = await readFile(path.join(root, relativePath), "utf8");
  return import("data:text/javascript;base64," + Buffer.from(source).toString("base64"));
}
const engine = await importSource("game/conversation-engine.js");
const content = await importSource("game/dialogue-content.js");
const education = await importSource("game/educational-content.js");
const engineSource = await readFile(path.join(root, "game/kitcity-engine.js"), "utf8");
assert.match(engineSource, /new ConversationEngine\(\{content,state:createDialogueState\(adventure\.dialogueState\)/, "NPC interactions must use the reusable engine");
assert.match(engineSource, /adventureComplete\(mapped,choiceIndex\)/, "mission-ending dialogue must reach the existing reward/mission handler");
assert.match(engineSource, /adventureSave\(\);adventureAfterActivity\(\);/, "a non-mission exit must return to free roam");
assert.match(engineSource, /function adventureAfterActivity\(\)[\s\S]*?freeRoam:true/, "return-to-gameplay restores the free-roam state");
assert.doesNotMatch(engineSource, /function adventureConversation\(/, "the old hardcoded linear dialogue handler must stay removed");


const educationErrors = education.validateEducationalLibrary();
assert.deepEqual(educationErrors, [], "all educational concepts and mission trees must validate");
assert.equal(education.EDUCATIONAL_CONCEPTS.length, 15, "the education library covers all 15 required domains");
assert.equal(education.EDUCATIONAL_MISSIONS.length, 15, "each educational domain has a playable story mission");
for (const mission of education.EDUCATIONAL_MISSIONS) {
  assert.equal(content.getDialogue(mission.id).id, mission.id, mission.id + " is registered in the game dialogue resolver");
  assert.ok(mission.scenario && mission.explanation && mission.application && mission.limitations && mission.takeaway, mission.id + " has a story, plain-language explanation, application, limitation and takeaway");
  const state = engine.createDialogueState();
  const lesson = new engine.ConversationEngine({ content: mission, state });
  assert.equal(lesson.start().node.id, "opening");
  assert.equal(lesson.choose("ask-practical").node.id, "application");
  assert.equal(lesson.choose("who-benefits").node.id, "limitation");
  assert.equal(lesson.choose("design-around").node.id, "trial");
  assert.equal(lesson.choose("takeaway").node.id, "takeaway");
  const done = lesson.choose("finish");
  assert.equal(done.ended, true, mission.id + " ends naturally");
  assert.equal(done.missionCompleted, true, mission.id + " marks mission completion");
  assert.equal(done.state.completedMissions[mission.missionId], true, mission.id + " persists completion");
  assert.equal(done.state.knowledge[mission.conceptId], true, mission.id + " records the learned concept");
}
const advanced = education.getEducationalMission("learn-smart-contracts");
const advancedSession = new engine.ConversationEngine({ content: advanced, state: engine.createDialogueState() });
assert.equal(advancedSession.choose("challenge-hype").error, "closed", "choices cannot be selected before the conversation starts");
assert.equal(advancedSession.start().node.id, "opening");
assert.equal(advancedSession.choose("challenge-hype").node.id, "compare");
assert.equal(advancedSession.choose("compare-cost").node.id, "explain");
assert.equal(advancedSession.choose("real-world").node.id, "trial");
assert.equal(advancedSession.choose("ask-limits").node.id, "limitation");
assert.equal(advancedSession.choose("accept-tradeoff").node.id, "takeaway");
assert.equal(advancedSession.choose("finish").missionCompleted, true);
const eligible = education.getAvailableEducationalMissions({ knowledge: { "portable-credentials": true } });
assert.ok(!eligible.some(item => item.conceptId === "professional-credentials"), "prerequisite concepts gate advanced missions");
assert.ok(eligible.some(item => item.conceptId === "digital-ownership"), "missions without prerequisites remain available");

const errors = engine.validateDialogueContent(content.KITCITY_DIALOGUES);
assert.deepEqual(errors, [], "all authored dialogue trees should validate");
assert.equal(content.KITCITY_DIALOGUES.length, 7, "all seven open-world NPC conversations are registered");

const farmer = content.getDialogue("coop-record");
const session = new engine.ConversationEngine({ content: farmer, state: engine.createDialogueState(), context: { exploreScore: 200, travelMeters: 400 } });
const opening = session.start();
assert.match(opening.node.text, /produce to buyers/i);
assert.equal(opening.node.choices.length, 4, "dialogue always offers a natural exit alongside authored responses");
assert.equal(session.choose("ask-process").node.id, "current-process");
assert.equal(session.choose("combine-evidence").node.id, "reaction");
assert.equal(session.choose("who-sees").node.id, "access");
assert.equal(session.choose("minimum-data").node.id, "access-end");
const finish = session.choose("finish");
assert.equal(finish.ended, true);
assert.equal(finish.completed, true);
assert.equal(finish.missionCompleted, true);
assert.equal(finish.missionId, "supply-chain-note");
assert.equal(finish.state.knowledge["agriculture-traceability"], true);
assert.equal(finish.state.knowledge["privacy-by-design"], true);
assert.equal(finish.state.completedMissions["supply-chain-note"], true);
assert.ok(finish.state.relationships["musa-farmer"].trust >= 0);

// A different NPC branch exercises objection, recovery and natural exit.
const trader = content.getDialogue("trader-spill");
const traderSession = new engine.ConversationEngine({ content: trader, state: engine.createDialogueState() });
assert.equal(traderSession.start().node.id, "opening");
assert.equal(traderSession.choose("ask-source").node.id, "busy-trader");
assert.equal(traderSession.choose("push-for-proof").node.id, "skeptical");
assert.equal(traderSession.choose("acknowledge-limit").node.id, "sales-end");
assert.equal(traderSession.choose("finish").missionCompleted, true);

// Persisted state makes a return visit acknowledge the previous meeting.
const returningSession = new engine.ConversationEngine({ content: farmer, state: finish.state });
const returning = returningSession.start();
assert.equal(returning.returning, true);
assert.match(returning.node.text, /you’re back/i);
assert.equal(returning.state.relationships["musa-farmer"].meetings, 2);

const gatedContent = { ...farmer, id: "gated-test", requires: { completedMission: "starter" } };
const gated = new engine.ConversationEngine({ content: gatedContent, state: engine.createDialogueState() });
assert.equal(gated.start().unavailable, true, "mission prerequisites gate conversations");

const leaveSession = new engine.ConversationEngine({ content: farmer, state: engine.createDialogueState() });
assert.equal(leaveSession.start().node.choices.at(-1).id, "__leave_conversation");
const left = leaveSession.choose("__leave_conversation");
assert.equal(left.ended, true);
assert.equal(left.missionCompleted, false, "leaving early must not complete the mission");

console.log("PASS: 7 social dialogue trees and 15 educational missions validate; story-led branches, experienced-user challenges, prerequisite gating, mission completion, persistent knowledge, and return visits work.");
