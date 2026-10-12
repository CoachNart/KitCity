import { readFile } from "node:fs/promises";
import { CHARACTER_ORDER, FIRST_ENCOUNTER_ORDER, MISSIONS, validateChronicles } from "./chronicles.js";

const engine = await readFile(new URL("../kitcity-engine.js", import.meta.url), "utf8");
const sceneDirector = await readFile(new URL("../story-scene-director.js", import.meta.url), "utf8");
const styles = await readFile(new URL("../../app/globals.css", import.meta.url), "utf8");
const pageMarkup = await readFile(new URL("../../app/page.tsx", import.meta.url), "utf8");
const errors = [...validateChronicles().errors];
const requireText = (text, label) => {
  if (!engine.includes(text)) errors.push("Runtime integration missing: " + label);
};

requireText("MISSIONS as CHRONICLE_MISSIONS, CHARACTER_ORDER", "canonical registry import");
requireText("const MISSIONS=CHRONICLE_MISSIONS.map", "runtime mission adapter");
requireText("toast('Look around. Walk up to someone and press Talk when you are ready.'", "player-led mission start");
requireText("if(m.id==='m01'&&P.chroniclesPrologueVersion!==2)", "first-time opening cinematic gate");
requireText("storyDirector.playOpening(()=>{", "intro cinematic completion callback");
requireText("storyDirector.update(dt,time);", "speech bubbles update during free movement");
if (!sceneDirector.includes("const OPENING_LINES = [")) errors.push("Automatic Lagos opening dialogue is missing");
if (!sceneDirector.includes("kitcity-speech-bubble")) errors.push("World-anchored speech bubbles are missing");
requireText("Your turn. Walk up to someone and press Talk when you are ready.", "player-led interaction after intro");
requireText("const STORY_BRIDGES={", "connected story transitions");
requireText("function chronicleNpcStep(m,name,index)", "contextual character conversations");
const missionRegistryText = await readFile(new URL("./chronicles.js", import.meta.url), "utf8");
const authoredSceneCount = [...missionRegistryText.matchAll(/"sceneLines": \[/g)].length;
if (authoredSceneCount !== 30) errors.push("Every mission after Lagos Mission 1 must provide authored scene dialogue.");
if (!engine.includes("const authoredLine=Array.isArray(m.sceneLines)?m.sceneLines[index]:null;")) errors.push("Authored mission scene dialogue is not connected to the runtime.");
requireText("Confirm the hash and network", "branching Lagos investigation dialogue");
requireText("Trust the screenshot and release the laptop", "Lagos dialogue responds to a mistaken assumption");
requireText("const STORY_PLAYER_CHOICES={", "player-owned, mission-specific dialogue choices");
requireText("function chronicleClueStep(m,obj,index,spot)", "conversation-led mission clue interactions");
requireText("const STORY_PLAYER_REACTIONS={", "player dialogue reacts to each mission situation");
requireText("function chronicleChallengeStep(m,obj,index,spot)", "conversation-led mission decisions");
for (const staleDialogue of [
  "What should we check first, and who else has seen this?",
  "Show me the evidence that matters.",
  "Hear the other person’s side first",
  "Let me check before I decide.",
  "Fair. Let me look again.",
  "Good call."
]) {
  if (engine.includes(staleDialogue)) errors.push("Retired generic dialogue remains: " + staleDialogue);
}
requireText("const STORY_NPC_FOLLOWUPS={", "mission-specific NPC reactions to player choices");

requireText("The consequences belong to this case.", "player-owned mission decision dialogue");
if (engine.includes("escapeStoryHtml(story.ending)") || engine.includes("escapeStoryHtml(story.cliffhanger)")) errors.push("Narrator-style mission wrap-up is still rendered on a conversation card.");
requireText("function updateLivesHUD()", "three-heart life display");
requireText("G.lives=Math.max(0", "hazard life loss");
requireText("startMission(missionId,true)", "mission restart after three hazards");
requireText("P.storyProgress[G.m.id]", "per-mission progress save");
requireText("const CHRONICLE_ACTIVITY_RULES=[", "objective activity bank");
requireText("function applyChronicleActivityEffect", "safe simulated activity effects");
requireText("effect==='payment-dispute-trace'", "persisted transaction evidence from the Lagos follow-up");
requireText("effect==='payment-dispute-report'", "saved recipient-mismatch incident report");
requireText("The cybercafé session is about to clear, and the copied payment page may disappear. What do you save first?", "new mission-specific Lagos follow-up decision");
requireText("The record is confirmed on Base for 120 USDC in block 1842031.", "Lagos transaction evidence has a concrete amount, network and block");
requireText("function placeExecutionCenter", "physical execution centre and task workbench");
requireText("const objectiveSpots=['ledger','screenshot','shopdesk','buyer','b','c','d','e','f','g','h','i','j','k','l','m','n','o'];", "mission objectives use a route of distinct world locations");
requireText("if(st.kind==='character'){", "NPC conversations are placed at their own world locations");
requireText("else if(st.kind==='clue'||st.kind==='challenge'){", "investigation tasks are placed at their own world locations");
requireText("if(m.id==='m01'&&st.kind==='character'&&G.i<m.characterStepCount)", "Lagos Mission 1's bespoke flow remains intact");
requireText("placeMissionEvidence(st,m,SPOTS[st.spot]||SPOTS.execution)", "objective-specific physical props instead of one repeated board");
requireText("function placeMissionEvidence(def,mission,spot)", "mission-specific world evidence props");
requireText("document.createTreeWalker(hubBody,NodeFilter.SHOW_TEXT)", "retired Web3 focus text cleanup");
requireText("if(hubTab==='missions') hubBody.querySelectorAll('.card:not(.mission-card),article:not(.mission-card)')", "state mission lists remove every non-canonical legacy card");
if (/sandbox|simulated|simulation|simulator|fictional practice record/i.test(engine)) errors.push("Player-facing sandbox/simulation disclaimer remains in the mission runtime.");
if (/sandbox|simulated|simulation|simulator|fictional/i.test(JSON.stringify(MISSIONS))) errors.push("Player-facing sandbox/simulation disclaimer remains in mission dialogue or objective copy.");
requireText("P.storyFlags.future_direction=options[choice]", "player-owned ending choice");
if (!engine.includes("if(m.id==='m01'&&P.chroniclesPrologueVersion!==2)")) errors.push("First-time intro cinematic gate is missing");
const lagosFollowUp = MISSIONS.find((mission) => mission.id === "m02");
if (!lagosFollowUp || !/wrong-address payment|transaction hash|recipient address/i.test(lagosFollowUp.narrativePurpose)) errors.push("Lagos Mission 2 must directly continue the wrong-address payment investigation.");
if (lagosFollowUp && /internet-history exhibit|classify Web1|Web1, Web2 and Web3/i.test(JSON.stringify(lagosFollowUp))) errors.push("Disconnected generic internet-history objectives remain in Lagos Mission 2.");
if (lagosFollowUp && !lagosFollowUp.objectives.some((objective) => /save the copied payment page/i.test(objective.label))) errors.push("Lagos Mission 2 must preserve the copied page before investigating how the link spread.");

const oyoFollowUp = MISSIONS.find((mission) => mission.id === "m03");
if (!oyoFollowUp || !/Timi|twelve secret words|recovery/i.test(oyoFollowUp.narrativePurpose)) errors.push("Oyo Mission 3 must continue directly from the recovery-scam voice note.");
if (oyoFollowUp && !/stop timi before the recovery countdown ends/i.test(oyoFollowUp.objectives.map((objective) => objective.label).join(" "))) errors.push("Mission 3 must open with a player action that interrupts the recovery scam.");
if (oyoFollowUp && /create a wallet at the practice kiosk|interview two users/i.test(JSON.stringify(oyoFollowUp))) errors.push("Mission 3 still contains detached classroom-style activities.");
requireText("m03-obj-1", "Mission 3's bespoke runtime steps");
requireText("Timi's thumb is hovering over 'Restore now'. What do you do?", "Mission 3's situation-specific activity rule");
requireText("if(story.id==='m03')", "Mission 3 has its own authored runtime sequence");
requireText("if(story.id==='m04')", "Mission 4 has its own authored runtime sequence");
requireText("if(story.id==='m05')", "Mission 5 has its own authored runtime sequence");
requireText("if(story.id==='m06')", "Mission 6 has its own authored runtime sequence");
const osunCheckoutMission = MISSIONS.find((mission) => mission.id === "m05");
const payoutControlMission = MISSIONS.find((mission) => mission.id === "m06");
if (!osunCheckoutMission || osunCheckoutMission.title !== "The Broken Application") errors.push("Mission 5 must use the rewritten Broken Application story.");
if (osunCheckoutMission && !/market|checkout|payment/i.test(osunCheckoutMission.narrativePurpose)) errors.push("Mission 5 must remain grounded in the Osun market payment problem.");
if (osunCheckoutMission && !/why the merchant no longer trusts the payment screen/i.test(osunCheckoutMission.objectives.map((objective) => objective.label).join(" "))) errors.push("Mission 5 must begin with the merchant's trust problem.");
if (osunCheckoutMission && /network-selection|repeat pattern|second buyer/i.test(JSON.stringify(osunCheckoutMission))) errors.push("Mission 5 still contains retired repetitive checkout story elements.");
if (!payoutControlMission || payoutControlMission.title !== "Code That Controls Money") errors.push("Mission 6 must use the rewritten smart-contract payout-control story.");
if (payoutControlMission && !/payout destination|contract/i.test(payoutControlMission.narrativePurpose)) errors.push("Mission 6 must investigate the payout-control mismatch from Mission 5.");
if (osunCheckoutMission && payoutControlMission && osunCheckoutMission.npcs.some((name) => payoutControlMission.npcs.includes(name))) errors.push("Mission 5 and Mission 6 must have distinct character casts.");
if (osunCheckoutMission && (osunCheckoutMission.npcs.join("|") !== "Blockqueen|Christol")) errors.push("Mission 5 cast order must be Blockqueen then Christol.");
if (payoutControlMission && (payoutControlMission.npcs.join("|") !== "Laloba|BigSam")) errors.push("Mission 6 cast order must be Laloba then BigSam.");
requireText("m05_status_bug_reproduced", "Mission 5 preserves evidence of the premature PAID state");
requireText("m05_status_logic_corrected", "Mission 5 fixes the status transition");
requireText("m05_payout_address_mismatch", "Mission 5 records the payout-address mismatch");
requireText("m06_privileged_setter_found", "Mission 6 traces the privileged destination setter");
requireText("m06_test_redirect_reproduced", "Mission 6 reproduces the redirect in a test deployment");
requireText("m06_release_gate_verified", "Mission 6 establishes a release gate");
if (engine.includes("spot:'buyer2'")) errors.push("Mission 5 uses an unsupported interaction anchor.");
const sixMissionArc = [
  ["m06", "m05", "m07", ["Laloba", "BigSam"]],
  ["m07", "m06", "m08", ["LunaX", "OxNight"]],
  ["m08", "m07", "m09", ["Moon", "The Cryptonian"]],
  ["m09", "m08", "m10", ["Joseph Nnadi", "The Don"]],
  ["m10", "m09", "m11", ["Praise", "Toza", "Craftore"]],
  ["m11", "m10", "m12", ["Kodavic", "Cybersage"]]
];
for (const [id, prerequisite, nextId, cast] of sixMissionArc) {
  const mission = MISSIONS.find((item) => item.id === id);
  if (!mission) {
    errors.push(id + " is missing from the canonical story registry.");
    continue;
  }
  if (!mission.prerequisites.includes(prerequisite) || mission.nextMissionId !== nextId) {
    errors.push(id + " has a broken prerequisite or next-mission handoff.");
  }
  if (cast.some((name) => !mission.npcs.includes(name))) errors.push(id + " is missing its intended cast.");
  if (!Array.isArray(mission.sceneLines) || mission.sceneLines.length < mission.npcs.length) {
    errors.push(id + " is missing authored dialogue for its full cast.");
  } else {
    for (const name of mission.npcs) {
      if (!mission.sceneLines.some((line) => line.startsWith(name + ":"))) {
        errors.push(id + " is missing a dialogue line for " + name + ".");
      }
    }
  }
}

const swapMission = MISSIONS.find((mission) => mission.id === "m07");
if (!swapMission || swapMission.title !== "The Swap That Changed Its Face") errors.push("Mission 7 must use the rewritten swap-investigation story.");
if (swapMission && (swapMission.npcs[0] !== "LunaX" || swapMission.npcs[1] !== "OxNight")) errors.push("Mission 7 must introduce LunaX and OxNight in the supplied order.");
if (swapMission && (!swapMission.prerequisites.includes("m06") || swapMission.nextMissionId !== "m08")) errors.push("Mission 7 must connect Mission 6 to Mission 8.");
if (swapMission && swapMission.sceneLines.some((line) => /Laloba:|BigSam:|Moon:/i.test(line))) errors.push("Mission 7 dialogue must not duplicate characters from adjacent mission casts.");
if (swapMission && !swapMission.sceneLines.some((line) => line.startsWith("LunaX:"))) errors.push("Mission 7 is missing authored LunaX dialogue.");
if (swapMission && !swapMission.sceneLines.some((line) => line.startsWith("OxNight:"))) errors.push("Mission 7 is missing authored OxNight dialogue.");
requireText("else if(story.id==='m07')", "Mission 7 bespoke swap-investigation runtime");
for (const marker of [
  "m07_token_contract_compared",
  "m07_lookalike_asset_detected",
  "m07_like_for_like_routes_compared",
  "m07_execution_record_checked",
  "m07_spender_checked",
  "m07_unsafe_approval_rejected",
  "m07_retry_blocked",
  "m07_complete:true"
]) requireText(marker, "Mission 7 evidence and completion marker " + marker);

const impersonatorMission = MISSIONS.find((mission) => mission.id === "m12");
if (!impersonatorMission || impersonatorMission.title !== "The Moderator Who Wasn't") errors.push("Mission 12 must be the fake moderator impersonation mission.");
if (impersonatorMission && (impersonatorMission.npcs[0] !== "Reina" || impersonatorMission.npcs[1] !== "Cclya")) errors.push("Mission 12 must introduce Reina and Cclya in the supplied order.");
if (impersonatorMission && impersonatorMission.nextMissionId !== "m13") errors.push("Mission 12 must hand off directly to the live-session mission.");
if (impersonatorMission && !impersonatorMission.sceneLines.some((line) => line.startsWith("Reina:")) ) errors.push("Mission 12 is missing authored Reina dialogue.");
if (impersonatorMission && !impersonatorMission.sceneLines.some((line) => line.startsWith("Cclya:")) ) errors.push("Mission 12 is missing authored Cclya dialogue.");
requireText("else if(story.id==='m12')", "Mission 12 bespoke impersonator investigation runtime");
for (const marker of [
  "m12_identity_verified",
  "m12_evidence_preserved",
  "m12_safe_account_steps_given",
  "m12_no_secrets_requested",
  "m12_victim_privacy_protected",
  "m12_notice_published",
  "m12_complete:true",
  "impersonator_contained:true"
]) requireText(marker, "Mission 12 evidence and completion marker " + marker);
if (engine.includes("m12_victim_privacy_protected=true;finishStep();}}])")) {
  // The privacy flag is only set on the corrected, safe notice path; the unsafe option must redirect first.
}

const liveSessionMission = MISSIONS.find((mission) => mission.id === "m13");
if (!liveSessionMission || liveSessionMission.title !== "The Mic Is Live") errors.push("Mission 13 must be the live community safety session.");
if (liveSessionMission && (liveSessionMission.npcs[0] !== "Leemah" || liveSessionMission.npcs[1] !== "Kenny")) errors.push("Mission 13 must introduce Leemah and Kenny in the supplied order.");
if (liveSessionMission && liveSessionMission.nextMissionId !== "m14") errors.push("Mission 13 must hand off to Mission 14.");
if (liveSessionMission && !liveSessionMission.sceneLines.some((line) => line.startsWith("Leemah:"))) errors.push("Mission 13 is missing authored Leemah dialogue.");
if (liveSessionMission && !liveSessionMission.sceneLines.some((line) => line.startsWith("Kenny:"))) errors.push("Mission 13 is missing authored Kenny dialogue.");
requireText("else if(story.id==='m13')", "Mission 13 bespoke live-session runtime");
for (const marker of [
  "m13_facts_verified",
  "m13_opening_prepared",
  "m13_session_moderated",
  "m13_hard_question_answered",
  "m13_recap_published",
  "m13_complete:true",
  "community_safety_session_delivered:true"
]) requireText(marker, "Mission 13 evidence and completion marker " + marker);
const oyoScreenshotFollowUp = MISSIONS.find((mission) => mission.id === "m04");
if (!oyoScreenshotFollowUp || !/Timi|screenshot|wallet activity/i.test(oyoScreenshotFollowUp.narrativePurpose)) errors.push("Mission 4 must continue directly from the screenshot claim about Timi.");
if (oyoScreenshotFollowUp && !/stop the group from naming timi/i.test(oyoScreenshotFollowUp.objectives.map((objective) => objective.label).join(" "))) errors.push("Mission 4 must begin by stopping the accusation before verifying the screenshot.");
if (oyoScreenshotFollowUp && /explain consensus|identify its block|proposed record change/i.test(JSON.stringify(oyoScreenshotFollowUp))) errors.push("Mission 4 still contains detached generic blockchain objectives.");
requireText("m04-obj-1", "Mission 4's bespoke runtime steps");
requireText("m04_claimed_transfer_not_found", "Mission 4 checks the claimed transfer against the relevant wallet activity");
requireText("m04_timi_privacy_protected", "Mission 4 corrects the claim without exposing Timi's private details");

const lagosOpening = MISSIONS.find((mission) => mission.id === "m01");
if (!lagosOpening || !/payment|transaction/i.test(lagosOpening.narrativePurpose)) errors.push("Lagos opening is not driven by a player-relevant payment dispute");
if (lagosOpening && /T3Kit|t3kit/i.test(JSON.stringify(lagosOpening))) errors.push("Lagos opening still uses T3Kit as a plot device");
if (engine.includes("escapeStoryHtml(m.narrativePurpose)+'</p><p><b>'+escapeStoryHtml(activity.q)")) errors.push("Generic mission exposition remains above activity dialogue");
if (engine.includes("THE T3KIT CHRONICLES") || engine.includes("T3Kit Chronicles")) errors.push("Retired story branding remains in the runtime UI");
if (engine.includes("No USDC left — mission restarting!")) errors.push("Legacy collision reset remains");
if (engine.includes("const MISSIONS=[")) errors.push("Legacy hard-coded mission array still exists");
for (const stale of ["function askStep(o)", "function taskStep(o)", "function confirmTx(def,o)", "function needFunds(n)", "QUESTION_PENALTY"]) {
  if (engine.includes(stale)) errors.push("Legacy mission mechanic remains: " + stale);
}

const cityBlock = engine.match(/const STORY_CITY_BY_STATE=\{([\s\S]*?)\};/);
if (!cityBlock) {
  errors.push("Story state-to-city mapping is missing");
} else {
  const mapping = Object.fromEntries([...cityBlock[1].matchAll(/'([^']+)':'([^']+)'/g)].map((m) => [m[1], m[2]]));
  const cityKeys = new Set([...engine.matchAll(/^\s{2}([a-z][a-z0-9-]*):\{name:/gm)].map((m) => m[1]));
  cityKeys.add("kitcity");
  for (const mission of MISSIONS) {
    const city = mapping[mission.state];
    if (!city) errors.push(mission.id + " has no city mapping for " + mission.state);
    else if (!cityKeys.has(city)) errors.push(mission.id + " maps to unknown city " + city);
  }
}

const challengeStart = engine.indexOf("const CHRONICLE_CHALLENGES={");
const challengeEnd = engine.indexOf("\n};\nfunction escapeStoryHtml", challengeStart);
if (challengeStart < 0 || challengeEnd < 0) {
  errors.push("Mission challenge registry cannot be found");
} else {
  const keys = new Set([...engine.slice(challengeStart, challengeEnd).matchAll(/^\s*(m\d+):\{/gm)].map((m) => m[1]));
  for (const mission of MISSIONS.filter((m) => m.id !== "m01")) {
    if (!keys.has(mission.id)) errors.push(mission.id + " has no core mission challenge");
  }
}

const activityStart = engine.indexOf("const CHRONICLE_ACTIVITY_RULES=[");
const activityEnd = engine.indexOf("\n];\nfunction chronicleActivityFor", activityStart);
if (activityStart < 0 || activityEnd < 0) {
  errors.push("Mission activity rules cannot be found");
} else {
  try {
    const rules = new Function(engine.slice(activityStart, activityEnd + 3) + "\nreturn CHRONICLE_ACTIVITY_RULES;")();
    let checked = 0;
    for (const mission of MISSIONS.filter((m) => m.id !== "m01")) {
      for (const objective of mission.objectives.slice(1)) {
        checked++;
        if (!rules.some((rule) => rule.r.test(objective.label))) {
          errors.push(mission.id + " objective has no contextual activity: " + objective.label);
        }
      }
    }
    const minimumCoverageChecks = MISSIONS.filter((mission) => mission.id !== "m01").length * 3;
    if (checked < minimumCoverageChecks) errors.push("Expected at least three contextual objective activity coverage checks per follow-up mission.");
    if (!errors.length) console.log("Runtime objective activities: " + checked + " covered by " + rules.length + " activity rules");
  } catch (error) {
    errors.push("Could not evaluate activity rules: " + error.message);
  }
}

for (const mission of MISSIONS.filter((item) => item.id !== "m01")) {
  if (!Array.isArray(mission.sceneLines) || mission.sceneLines.length < mission.npcs.length) errors.push(mission.id + " is missing authored dialogue for one or more cast members.");
}
if (CHARACTER_ORDER.length !== 50) errors.push("Expected all 50 supplied character names");
const firstEncounterSet = new Set();
const runtimeFirstEncounters = [];
for (const mission of MISSIONS) {
  for (const name of mission.npcs) {
    if (!firstEncounterSet.has(name)) {
      firstEncounterSet.add(name);
      runtimeFirstEncounters.push(name);
    }
  }
}
if (runtimeFirstEncounters.length !== CHARACTER_ORDER.length ||
    runtimeFirstEncounters.some((name, index) => name !== CHARACTER_ORDER[index]) ||
    FIRST_ENCOUNTER_ORDER.some((name, index) => name !== CHARACTER_ORDER[index])) {
  errors.push("Runtime NPC first encounters must use all 50 supplied names in the exact provided order.");
}
const runtimeNames = new Set(MISSIONS.flatMap((mission) => mission.npcs));
for (const name of CHARACTER_ORDER) {
  if (!runtimeNames.has(name)) errors.push("Supplied NPC is missing from all mission casts: " + name);
}
// Keep one canonical source for the mission cards shown beneath each selected state.
const missionCardRenderers = [...engine.matchAll(/function missionCard\(m\)\{/g)].length;
const missionCardMounts = [...engine.matchAll(/cityMissions\(hubCity\)\.map\(m=>missionCard\(m\)\)\.join\(''\)/g)].length;
const missionCardTemplates = [...engine.matchAll(/data-mission-id=/g)].length;
if (missionCardRenderers !== 1) errors.push("Expected exactly one canonical mission-card renderer; found " + missionCardRenderers + ".");
if (missionCardMounts !== 1) errors.push("Expected exactly one state mission-card mount point; found " + missionCardMounts + ".");
if (missionCardTemplates !== 1) errors.push("Duplicate or legacy mission-card HTML templates remain; expected one canonical template.");
if (!engine.includes("personalize('Mission '+m.n+': '+m.title,null)") || !engine.includes("personalize(m.goal,null)")) {
  errors.push("Current mission cards must use canonical registry titles and goals, not stale hard-coded copy.");
}
if (pageMarkup.includes("data-mission-id=") || pageMarkup.includes('class="card mission-card')) {
  errors.push("Static mission cards remain in page markup outside the canonical runtime renderer.");
}
if (engine.includes("else if(hubTab==='cityhub')") || engine.includes("else if(hubTab==='kitlab')")) {
  errors.push("Duplicate legacy cityhub/kitlab mission-card renderer remains.");
}
if (styles.includes(".comic-scene{") || styles.includes("#sheet.chronicle-briefing{")) {
  errors.push("Retired comic/briefing UI styles remain beside the current mission implementation.");
}
if (engine.includes("WEB3 FOCUS") || engine.includes("web3-focus") || styles.includes(".web3-focus")) {
  errors.push("Retired Web3 focus labels or styles remain in the mission UI.");
}
if (!engine.includes("discard any orphaned or duplicate legacy cards")) {
  errors.push("Mission hub must remove orphaned and duplicate legacy cards after rendering.");
}
for (const responsiveRule of [
  "#hubBody .mission-card .ch b",
  "#hubBody .mission-card .ch small",
  "#hubBody .mission-card .cf",
  "overflow-wrap:anywhere",
  "flex-wrap:wrap"
]) {
  if (!styles.includes(responsiveRule)) errors.push("Mission-card responsive rule is missing: " + responsiveRule);
}
const missionIds = MISSIONS.map((mission) => mission.id);
if (new Set(missionIds).size !== missionIds.length) errors.push("Duplicate mission IDs would create repeated cards or overwrite progress.");
if (MISSIONS.length !== 31) errors.push("Expected the complete 31-mission canonical story registry.");
if (errors.length) {
  console.error("CHRONICLES RUNTIME VALIDATION FAILED");
  errors.forEach((error) => console.error(" - " + error));
  process.exitCode = 1;
} else {
  console.log("CHRONICLES RUNTIME VALIDATION PASSED");
  console.log("Missions: " + MISSIONS.length + "; supplied characters: " + CHARACTER_ORDER.length);
  console.log("State mapping: every story mission mapped; KitCity is the final destination; FCT is not a story stop");
}
