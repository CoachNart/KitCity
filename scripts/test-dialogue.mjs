import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadKitCityModules } from "./registry-loader.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { engine, world, distribution, content, education, prototypeMissions, explorationLife, cleanup } = await loadKitCityModules();
const engineSource = await readFile(path.join(root, "game/kitcity-engine.js"), "utf8");
assert.deepEqual(explorationLife.validateExplorationDiscoveries(), [], "optional street discoveries have valid unique IDs, locations, copy and rewards");
assert.equal(explorationLife.EXPLORATION_DISCOVERIES.length, 4, "the free-roam scene offers four non-educational discovery points");
assert.equal(new Set(explorationLife.EXPLORATION_DISCOVERIES.map(item=>item.id)).size, 4, "discovery IDs remain unique");
const discoveryState = { activityCount: 0, exploreScore: 0, discoveries: {} };
for (const discovery of explorationLife.EXPLORATION_DISCOVERIES) {
  const firstVisit = explorationLife.recordExplorationDiscovery(discoveryState, discovery.id);
  assert.equal(firstVisit.error, undefined, discovery.id + " can be discovered");
  assert.equal(firstVisit.reward.xp, discovery.reward.xp, discovery.id + " returns its authored reward");
  assert.equal(discoveryState.discoveries[discovery.id], true, discovery.id + " persists completion");
  assert.equal(explorationLife.recordExplorationDiscovery(discoveryState, discovery.id).error, "already-discovered", discovery.id + " cannot pay a duplicate reward");
}
assert.equal(discoveryState.activityCount, 4, "only first-time discoveries increment activity");
assert.equal(discoveryState.exploreScore, 56, "discoveries reward free exploration, independently of lessons");
assert.match(engineSource, /refreshExplorationDiscoveries\(\)/, "the actual free-roam engine creates in-world discovery markers");
assert.match(engineSource, /recordExplorationDiscovery\(adventure,discovery\.id\)/, "the live interaction uses the tested persistent discovery helper");
assert.match(engineSource, /nearEnt\.kind==='discovery'\?'Look':'Talk'/, "mobile interaction feedback distinguishes looking at places from talking to people");
assert.match(engineSource, /mobile\?1\.25:1\.5/, "render pixel ratio is capped more conservatively on mobile and low-memory devices");
assert.match(engineSource, /window\.innerWidth<760\?768:1536/, "mobile shadow maps are smaller to reduce GPU cost");
assert.match(engineSource, /mobileCrowd\?12:20/, "mobile builds fewer ambient walkers than desktop");
assert.match(engineSource, /mobileCrowd\?3:6/, "mobile builds fewer pedestrian pairs");
assert.match(engineSource, /made<\(mobileCrowd\?4:10\)/, "mobile builds fewer road-crossing pedestrians");
assert.match(engineSource, /window\.innerWidth<760\?\(\(k===0\|\|k===-1\)\?1:/, "mobile traffic generation is reduced");
assert.match(engineSource, /if\(joy\.active\)\{ x=joy\.x; z=joy\.y; \}/, "touch joystick vertical direction matches WASD and forward movement");
assert.match(engineSource, /adventure\.playerPosition=\{x:Number\(player\.position\.x\.toFixed\(2\)\),z:Number\(player\.position\.z\.toFixed\(2\)\)\}/, "free-roam checkpoint stores a bounded-precision player position");
assert.match(engineSource, /window\.addEventListener\('pagehide',\(\)=>\{saveAdventureCheckpoint\(\);save\(\);\}\)/, "leaving the page saves the current free-roam checkpoint");
assert.match(engineSource, /const checkpoint=adventure\.playerPosition[\s\S]*?camera\.position\.set\(player\.position\.x,35,player\.position\.z\+20\)/, "the free-roam checkpoint restores player and camera on re-entry");
assert.match(engineSource, /first=!adventure\.completed\.includes\(d\.id\)/, "mission rewards are only granted on first completion");


assert.match(engineSource, /new ConversationEngine\(\{content,state:createDialogueState\(adventure\.dialogueState\)/, "NPC interactions must use the reusable engine");
assert.match(engineSource, /adventureComplete\(mapped,choiceIndex\)/, "mission-ending dialogue must reach the existing reward/mission handler");
assert.match(engineSource, /adventureSave\(\);adventureAfterActivity\(\);/, "a non-mission exit must return to free roam");
assert.match(engineSource, /function adventureAfterActivity\(\)[\s\S]*?freeRoam:true/, "return-to-gameplay restores the free-roam state");
assert.doesNotMatch(engineSource, /function adventureConversation\(/, "the old hardcoded linear dialogue handler must stay removed");
assert.match(engineSource, /getWorldLocation\('lagos-free-roam'\)/, "invalid/unbuilt persisted locations fall back to the known playable scene");
assert.match(engineSource, /activeLocation\.status!=='playable'/, "the runtime does not spawn encounters in a registry-only settlement");


const worldErrors = distribution.validateWorldSystem();
assert.deepEqual(worldErrors, [], "the Nigerian world, NPC, dialogue, mission, sector, reward and event registries validate");
assert.equal(world.NIGERIAN_STATES.length, 36, "all 36 states are registered individually");
assert.equal(world.NIGERIAN_STATES.some(item => item.id === "fct"), false, "FCT is not incorrectly counted as a state");
assert.equal(world.NIGERIAN_TERRITORIES.length, 1);
assert.equal(world.NIGERIAN_TERRITORIES[0].id, "fct");
assert.equal(world.NIGERIAN_TERRITORIES[0].administrativeCapital, "Abuja");
assert.equal(world.NIGERIAN_JURISDICTIONS.length, 37);
assert.ok(world.NIGERIAN_JURISDICTIONS.every(jurisdiction =>
  Array.isArray(jurisdiction.content.locationIds) &&
  Array.isArray(jurisdiction.content.environmentProfileIds) &&
  jurisdiction.content.environmentSettings && typeof jurisdiction.content.environmentSettings === "object" &&
  Array.isArray(jurisdiction.content.sectorIds) &&
  Array.isArray(jurisdiction.content.npcProfileIds) &&
  Array.isArray(jurisdiction.content.npcSpawnPoints) &&
  Array.isArray(jurisdiction.content.occupationTags) &&
  Array.isArray(jurisdiction.content.communityTags) &&
  Array.isArray(jurisdiction.content.mainMissionIds) &&
  Array.isArray(jurisdiction.content.sideMissionIds) &&
  Array.isArray(jurisdiction.content.environmentalEncounterIds) &&
  Array.isArray(jurisdiction.content.educationalConceptIds) &&
  jurisdiction.regionalContext?.researchStatus
), "every state and FCT supports the complete location/content schema");
assert.ok(world.WORLD_LOCATIONS.every(location => location.regionalContext?.researchStatus && Array.isArray(location.npcSpawnPoints) && location.environmentSettings && typeof location.environmentSettings === "object"), "each location has regional research metadata, environment settings and NPC spawn slots");
assert.equal(world.ENVIRONMENT_ASSET_REGISTRY.length, 1, "only the existing environment asset is registered");
assert.equal(world.ENVIRONMENT_ASSET_REGISTRY[0].id, "kitcity-current-free-roam");
assert.equal(world.PLANNED_SETTLEMENT_LOCATIONS.length, 37, "each state and FCT has an administrative-capital settlement record");
assert.equal(world.WORLD_LOCATIONS.length, 38, "the one existing scene plus 37 registry-only settlements are represented");
assert.equal(world.WORLD_LOCATIONS.filter(item => item.status === "playable").length, 1, "only the existing free-roam environment is marked playable");
assert.equal(world.WORLD_LOCATIONS.filter(item => item.status === "planned").length, 37, "each jurisdiction has a non-playable capital reference record");
assert.ok(world.WORLD_LOCATIONS.filter(item => item.status === "planned").every(item => item.environmentAssetId === null && item.engineCityId === null && item.environmentProfileIds.length === 0), "planned capital records do not pretend to have world assets");
assert.equal(world.WORLD_LOCATIONS.filter(item => item.status === "planned").length, 37, "unbuilt settlements are registry-only, never presented as playable");
assert.ok(world.NIGERIAN_JURISDICTIONS.every(jurisdiction => world.WORLD_LOCATIONS.some(location => location.jurisdictionId === jurisdiction.id && location.status === "planned")), "every jurisdiction has a planned settlement record");
assert.ok(world.PLANNED_SETTLEMENT_LOCATIONS.every(location => !location.environmentAssetId && !location.engineCityId && location.contentStatus === "registry-only"), "registry-only settlements do not claim nonexistent map assets");
assert.ok(world.NIGERIAN_STATES.filter(item => item.id !== "lagos").every(item => !world.WORLD_LOCATIONS.some(location => location.jurisdictionId === item.id && location.status === "playable")), "states without map assets are registered without fabricated playable worlds");
assert.ok(world.SECTOR_REGISTRY.length >= 21, "the sector registry covers all requested sectors");
assert.ok(distribution.NPC_REGISTRY.length >= 22, "social and educational NPCs share a structured registry");
assert.equal(distribution.MISSION_REWARD_REGISTRY.length, 24, "the reward registry includes the legacy lessons and eight prototype missions");
assert.equal(distribution.LOCATION_EVENT_REGISTRY.some(item => item.id === "pothole-awareness"), true);
const developmentReport = distribution.getDevelopmentReport();
assert.equal(developmentReport.states, 36);
assert.equal(developmentReport.territories, 1);
assert.equal(developmentReport.jurisdictions, 37);
assert.equal(developmentReport.configuredLocations, 38);
assert.equal(developmentReport.settlementRecords, 37);
assert.equal(developmentReport.registryOnlyLocations, 37);
assert.equal(developmentReport.playableLocations, 1);
assert.equal(developmentReport.configuredLocations, 38);
assert.equal(developmentReport.plannedLocations, 37);
assert.equal(developmentReport.jurisdictionsWithLocationRecords, 37);
assert.equal(developmentReport.jurisdictionsWithPlayableLocations, 1);
assert.equal(developmentReport.jurisdictionsAwaitingPlayableEnvironment, 36);
assert.equal(developmentReport.educationalMissions, 16);
assert.equal(developmentReport.environmentAssets, 1);
assert.equal(developmentReport.availableEnvironmentAssets, 1);
assert.equal(developmentReport.npcSpawnPoints, 0);
assert.equal(developmentReport.prototypeMissions, 8);
assert.equal(developmentReport.prototypeObjectives, 19);
assert.ok(developmentReport.missionsWithPlayableLocation > 0 && developmentReport.missionsWithPlayableLocation < developmentReport.educationalMissions + developmentReport.prototypeMissions, "the report distinguishes assigned content from content awaiting suitable environments");
const distributed = distribution.selectEducationalMissions({locationId:"lagos-free-roam",dialogueState:{},limit:6,allowDeepening:true});
assert.ok(distributed.length > 0 && distributed.length <= 6);
const invalidLocation = {
  id:"__invalid-test-location", jurisdictionId:"missing-jurisdiction", settlementName:"Test",
  locationType:"test", status:"planned", environmentAssetId:null, engineCityId:null,
  environmentProfileIds:["missing-environment"], sectorIds:["missing-sector"], npcProfileIds:["missing-npc"], npcSpawnPoints:[],
  environmentSettings:{}, occupationTags:[], communityTags:[], mainMissionIds:["missing-mission"], sideMissionIds:[],
  environmentalEncounterIds:[], educationalConceptIds:["missing-concept"], storyArcId:"missing-arc",
  unlockRequirement:null, contentStatus:"registry-only"
};
const invalidAssetLocation = {
  id:"__invalid-test-asset-location", jurisdictionId:"lagos", settlementName:"Test Asset",
  locationType:"city-environment", status:"playable", environmentAssetId:"missing-asset", engineCityId:"missing-city",
  environmentProfileIds:[], sectorIds:[], npcProfileIds:[], npcSpawnPoints:[], environmentSettings:{},
  occupationTags:[], communityTags:[], mainMissionIds:[], sideMissionIds:[], environmentalEncounterIds:[],
  educationalConceptIds:[], storyArcId:null, unlockRequirement:null, contentStatus:"test",
  regionalContext:{geopoliticalZone:"South West",researchStatus:"not-yet-researched",evidenceRefs:[],contextNotes:[]}
};
const invalidRegistryErrors = distribution.validateWorldSystem({additionalLocations:[invalidLocation,invalidAssetLocation]});
assert.ok(invalidRegistryErrors.some(error => error.includes("missing-jurisdiction")), "validator catches missing jurisdiction references");
assert.ok(invalidRegistryErrors.some(error => error.includes("missing-environment")), "validator catches missing environment references");
assert.ok(invalidRegistryErrors.some(error => error.includes("missing-mission")), "validator catches missing mission references");
assert.ok(invalidRegistryErrors.some(error => error.includes("not registered as available")), "validator rejects playable locations without a registered environment asset");
assert.equal(new Set(distributed.map(item => item.conceptId)).size, distributed.length, "initial mission distribution avoids repeated concepts");
assert.ok(distributed.every(item => distribution.MISSION_DISTRIBUTION.some(entry => entry.missionId === item.id && entry.locationIds.includes("lagos-free-roam"))), "only missions matched to the current playable environment are selected");
const doneState = {completedMissions:Object.fromEntries(distributed.map(item => [item.missionId,true])),knowledge:Object.fromEntries(distributed.map(item => [item.conceptId,true]))};
const nextBatch = distribution.selectEducationalMissions({locationId:"lagos-free-roam",dialogueState:doneState,limit:6,allowDeepening:true});
assert.ok(nextBatch.every(item => !doneState.completedMissions[item.missionId]), "completed missions do not repeat unnecessarily");
const sameContextKnowledge = {knowledge:{"digital-ownership":true},conceptHistory:{"digital-ownership":[{missionId:"learn-digital-ownership",locationId:"lagos-free-roam"}]}};
assert.ok(!distribution.selectEducationalMissions({locationId:"lagos-free-roam",dialogueState:sameContextKnowledge,limit:15,allowDeepening:true}).some(item=>item.conceptId==="digital-ownership"), "a known concept is not repeated in the same context");
const newContextKnowledge = {knowledge:{"digital-ownership":true},conceptHistory:{"digital-ownership":[{missionId:"learn-digital-ownership",locationId:"another-playable-location"}]}};
assert.ok(!distribution.selectEducationalMissions({locationId:"lagos-free-roam",dialogueState:newContextKnowledge,limit:15,allowDeepening:true}).some(item=>item.id==="learn-digital-ownership"), "a location change alone must not repeat the same lesson");

assert.deepEqual(distribution.selectEducationalMissions({locationId:"unbuilt-city",dialogueState:{},limit:6}), [], "unbuilt environments do not receive fabricated missions");

const educationErrors = education.validateEducationalLibrary();
assert.deepEqual(educationErrors, [], "all educational concepts and mission trees must validate");
assert.equal(education.EDUCATIONAL_CONCEPTS.length, 15, "the education library covers all 15 required domains");
assert.equal(education.EDUCATIONAL_MISSIONS.length, 16, "the library includes 15 concept introductions and a separate contextual deepening mission");
const agricultureDeepening = education.getEducationalMission("learn-agriculture-cooperative-audit");
assert.ok(agricultureDeepening && agricultureDeepening.conceptId === "agriculture-traceability", "a separate mission can deepen an already introduced concept");
assert.ok(!education.getAvailableEducationalMissions({}).some(item => item.id === agricultureDeepening.id), "contextual deepening is gated until its base concept is known");
assert.ok(education.getAvailableEducationalMissions({knowledge:{"agriculture-traceability":true}}).some(item => item.id === agricultureDeepening.id), "learning the base concept unlocks the deeper mission");
const agricultureDeepeningDistribution = distribution.MISSION_DISTRIBUTION.find(item => item.missionId === agricultureDeepening.id);
assert.equal(agricultureDeepeningDistribution.status, "authored-awaiting-environment", "the cooperative deepening mission waits for a real farm/cooperative environment");
assert.deepEqual(agricultureDeepeningDistribution.locationIds, [], "no unbuilt location is treated as playable for the contextual mission");
for (const mission of education.EDUCATIONAL_MISSIONS) {
  assert.equal(content.getDialogue(mission.id).id, mission.id, mission.id + " is registered in the game dialogue resolver");
  assert.ok(mission.scenario && mission.explanation && mission.application && mission.limitations && mission.takeaway, mission.id + " has a story, plain-language explanation, application, limitation and takeaway");
  const state = engine.createDialogueState({ knowledge: Object.fromEntries(mission.prerequisites.map(id => [id, true])) });
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
assert.equal(advancedSession.start().node.id, "opening");
assert.equal(advancedSession.choose("challenge-hype").node.id, "compare");
assert.equal(advancedSession.choose("compare-cost").node.id, "explain");
assert.equal(advancedSession.choose("real-world").node.id, "trial");
assert.equal(advancedSession.choose("ask-limits").node.id, "limitation");
assert.equal(advancedSession.choose("accept-tradeoff").node.id, "takeaway");
assert.equal(advancedSession.choose("finish").missionCompleted, true);
const lockedCredentials = education.getEducationalMission("learn-professional-credentials");
const lockedSession = new engine.ConversationEngine({ content: lockedCredentials, state: engine.createDialogueState() });
assert.equal(lockedSession.start().unavailable, true, "advanced professional credentials require portable-credential knowledge");
const unlockedState = engine.createDialogueState({ knowledge: { "portable-credentials": true } });
const unlockedSession = new engine.ConversationEngine({ content: lockedCredentials, state: unlockedState });
assert.equal(unlockedSession.start().unavailable, undefined, "learning a prerequisite unlocks the advanced mission");
const eligibleWithoutPrerequisite = education.getAvailableEducationalMissions({});
assert.ok(!eligibleWithoutPrerequisite.some(item => item.conceptId === "professional-credentials"), "locked missions are excluded from available content");
const eligible = education.getAvailableEducationalMissions({ knowledge: { "portable-credentials": true } });
assert.ok(eligible.some(item => item.conceptId === "professional-credentials"), "prerequisite concepts unlock advanced missions");
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

const prototypePack = prototypeMissions.PROTOTYPE_MISSIONS;
assert.equal(prototypePack.length, 8, "the prototype pack contains exactly eight missions");
assert.deepEqual(prototypeMissions.validatePrototypeMissionPack(), [], "prototype missions have valid branching paths, activity objectives and rewards");
assert.equal(distribution.MISSION_DISTRIBUTION.filter(item=>item.status==="prototype-playable-overlay").length, 8, "all eight prototype missions are in the location distribution registry");
assert.equal(new Set(prototypeMissions.PROTOTYPE_MISSION_NPCS.map(npc=>npc.spot)).size, 8, "the eight mission NPCs use distinct encounter spots");
assert.ok(prototypeMissions.PROTOTYPE_MISSION_NPCS.every(npc=>content.getDialogue(npc.dialogueId)?.id===npc.id), "each prototype NPC resolves through the existing dialogue API");
assert.ok(prototypePack.every(mission=>mission.locationIds.length===1&&mission.locationIds[0]==="lagos-free-roam"), "the prototype uses only the currently playable environment and does not invent other maps");
assert.ok(prototypePack.every(mission=>mission.objectives.every(objective=>objective.choices.length>=2)), "every practical activity contains meaningful player choices");
const engineSourceForMissions = await readFile(path.join(root, "game/kitcity-engine.js"), "utf8");
assert.match(engineSourceForMissions, /PROTOTYPE_MISSION_NPCS/, "prototype NPCs are wired into the actual free-roam encounter spawn");
assert.match(engineSourceForMissions, /refreshPrototypeObjectives\(\)/, "accepted missions spawn and refresh in-world activity objects");
assert.match(engineSourceForMissions, /collectPrototypeObjective\(objective,choice\)/, "activity choices record progress in the live game");
assert.match(engineSourceForMissions, /recordPrototypeObjectiveChoice\(adventure,objective\.missionId,objective\.id,choice\.id\)/, "the live game uses the tested objective progress function");
assert.match(engineSourceForMissions, /recordPrototypeObjectiveChoice/, "live field activity delegates persistence to the tested mission helper");
for (const mission of prototypePack) {
  const notStartedState = { dialogueState: engine.createDialogueState() };
  assert.equal(prototypeMissions.recordPrototypeObjectiveChoice(notStartedState,mission.id,mission.objectives[0].id,mission.objectives[0].choices[0].id).error,"mission-not-started",mission.id+" cannot progress an activity before accepting it");
  assert.ok(mission.objectives.every(objective=>Math.abs(objective.position.x)<=205&&Math.abs(objective.position.z)<=205),mission.id+" activity markers remain within the bounded playable city");

  const state = engine.createDialogueState();
  const session = new engine.ConversationEngine({content:mission.dialogue,state});
  let step = session.start();
  assert.equal(step.node.id,"opening",mission.id+" opens with NPC dialogue");
  const branchChoice = step.node.choices[0];
  step = session.choose(branchChoice.id);
  assert.equal(step.node.id,"branch0",mission.id+" offers a meaningful opening branch");
  step = session.choose(step.node.choices[0].id);
  assert.equal(step.node.id,"taskBrief",mission.id+" transitions from conversation into a practical task");
  const started = session.choose("begin-activity");
  assert.equal(started.ended,true,mission.id+" returns control to exploration when task begins");
  assert.equal(started.missionCompleted,false,mission.id+" cannot be completed by dialogue alone");
  assert.equal(started.state.flags[mission.startedFlag],true,mission.id+" persists its started state");
  const activityState = {dialogueState:started.state};
  for (const [objectiveIndex,objective] of mission.objectives.entries()) {
    const recorded = prototypeMissions.recordPrototypeObjectiveChoice(activityState,mission.id,objective.id,objective.choices[0].id);
    assert.equal(recorded.error,undefined,mission.id+"/"+objective.id+" records a valid field decision");
    assert.equal(recorded.allDone,objectiveIndex===mission.objectives.length-1,mission.id+" cannot unlock debrief before every activity step is inspected");
  }
  const duplicate = prototypeMissions.recordPrototypeObjectiveChoice(activityState,mission.id,mission.objectives[0].id,mission.objectives[0].choices[0].id);
  assert.equal(duplicate.error,"already-recorded",mission.id+" cannot record the same objective twice");
  assert.equal(activityState.prototypeDecisions[mission.id][mission.objectives[0].id].choiceId,mission.objectives[0].choices[0].id,mission.id+" persists the player's objective decision");
  const returnSession = new engine.ConversationEngine({content:mission.dialogue,state:started.state});
  step = returnSession.start();
  assert.equal(step.node.id,"return",mission.id+" requires the player to finish its practical task before debrief");
  step = returnSession.choose("share-findings");
  assert.equal(step.node.id,"debrief",mission.id+" supports a post-activity debrief");
  const completed = returnSession.choose("complete-mission");
  assert.equal(completed.missionCompleted,true,mission.id+" completes through the real conversation engine");
  assert.equal(completed.state.completedMissions[mission.id],true,mission.id+" records mission completion");
  assert.equal(completed.state.knowledge[mission.conceptId],true,mission.id+" records concept knowledge");
  const revisit = new engine.ConversationEngine({content:mission.dialogue,state:completed.state});
  assert.equal(revisit.start().node.id,"afterComplete",mission.id+" has contextual returning dialogue without repeating the reward path");
}
assert.ok(prototypePack.some(mission=>mission.objectives.length===3), "several missions require multi-check practical activities");
for (const mission of prototypePack) {
  const completedState = {dialogueState:engine.createDialogueState({flags:{[mission.startedFlag]:true,[mission.completedFlag]:true}})};
  assert.equal(prototypeMissions.recordPrototypeObjectiveChoice(completedState,mission.id,mission.objectives[0].id,mission.objectives[0].choices[0].id).error,"mission-complete",mission.id+" rejects objective progress after completion");
}

assert.ok(prototypePack.some(mission=>mission.branches.some(branch=>/database|blockchain|code|law|privacy/i.test(branch.text))), "the pack includes skeptical and limitation-aware dialogue");
console.log("PASS: Nigerian world registry (36 states + separate FCT), registry-only settlements, real asset gating, 21+ sectors, NPC/location schema, 15 concepts, 16 legacy educational mission trees plus 8 interactive prototype missions, contextual deepening, prerequisites, repetition avoidance and dialogue progression validate.");
await cleanup();
