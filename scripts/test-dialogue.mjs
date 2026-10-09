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
const errors = engine.validateDialogueContent(content.KITCITY_DIALOGUES);
assert.deepEqual(errors, [], "all authored dialogue trees should validate");
assert.equal(content.KITCITY_DIALOGUES.length, 7, "all seven open-world NPC conversations are registered");

const farmer = content.getDialogue("coop-record");
const session = new engine.ConversationEngine({ content: farmer, state: engine.createDialogueState(), context: { exploreScore: 200, travelMeters: 400 } });
const opening = session.start();
assert.match(opening.node.text, /produce to buyers/i);
assert.equal(opening.node.choices.length, 3);
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

console.log("PASS: 7 dialogue trees validate; branching, multi-turn follow-ups, mission completion, knowledge/trust state, and returning-NPC dialogue all work.");
