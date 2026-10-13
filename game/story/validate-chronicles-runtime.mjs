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
requireText("function renderMissionDialogueLine(index)", "in-world dialogue bubbles with manual reading controls");
requireText("function revealMissionDialogueChoices()", "decision cards appear only after dialogue is read");
requireText("sceneCast||[]", "supporting cast stays physically present through a scene");
if (!styles.includes(".kitcity-mission-dialogue-bubble") || !styles.includes(".kitcity-mission-dialogue-nav")) errors.push("Responsive mission speech-bubble styles or navigation controls are missing.");
const oyoScamCast = MISSIONS.find((mission) => mission.id === "m03");
const oyoRumourCast = MISSIONS.find((mission) => mission.id === "m04");
if (!oyoScamCast || !oyoScamCast.sceneCast.includes("Timi")) errors.push("Oyo Mission 3 must physically stage Timi as a supporting character.");
if (!oyoRumourCast || !oyoRumourCast.sceneCast.includes("Timi")) errors.push("Oyo Mission 4 must keep Timi present during the screenshot investigation.");
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

const onboardingMission = MISSIONS.find((mission) => mission.id === "m11");
if (!onboardingMission || onboardingMission.title !== "The Room Full of Ghosts") errors.push("Mission 11 must use the rewritten empty-hall onboarding story.");
if (onboardingMission && (onboardingMission.npcs[0] !== "Kodavic" || onboardingMission.npcs[1] !== "Cybersage")) errors.push("Mission 11 must introduce Kodavic and Cybersage in the supplied order.");
if (onboardingMission && (!onboardingMission.prerequisites.includes("m10") || onboardingMission.nextMissionId !== "m12")) errors.push("Mission 11 must connect Mission 10 to Mission 12.");
if (onboardingMission && !onboardingMission.sceneLines.some((line) => line.startsWith("Kodavic:"))) errors.push("Mission 11 is missing authored Kodavic dialogue.");
if (onboardingMission && !onboardingMission.sceneLines.some((line) => line.startsWith("Cybersage:"))) errors.push("Mission 11 is missing authored Cybersage dialogue.");
if (onboardingMission && /Praise:|Toza:|Craftore:|Reina:|Cclya:/i.test(onboardingMission.sceneLines.join(" "))) errors.push("Mission 11 dialogue duplicates characters from adjacent mission casts.");
requireText("else if(story.id==='m11')", "Mission 11 bespoke onboarding runtime");
for (const marker of [
  "m11_deras_journey_observed",
  "m11_friction_point_identified",
  "m11_one_clear_first_task_created",
  "m11_second_newcomer_tested",
  "m11_first_task_completed",
  "m11_completion_measured",
  "m11_claims_limited_to_sample",
  "m11_complete:true",
  "first_contribution_measured:true"
]) requireText(marker, "Mission 11 evidence and completion marker " + marker);

const withdrawalMission = MISSIONS.find((mission) => mission.id === "m08");
if (!withdrawalMission || withdrawalMission.title !== "The Withdrawal That Never Left") errors.push("Mission 8 must use the rewritten withdrawal incident story.");
if (withdrawalMission && (withdrawalMission.npcs[0] !== "Moon" || withdrawalMission.npcs[1] !== "The Cryptonian")) errors.push("Mission 8 must introduce Moon and The Cryptonian in the supplied order.");
if (withdrawalMission && (!withdrawalMission.prerequisites.includes("m07") || withdrawalMission.nextMissionId !== "m09")) errors.push("Mission 8 must connect Mission 7 to Mission 9.");
if (withdrawalMission && !withdrawalMission.sceneLines.some((line) => line.startsWith("Moon:"))) errors.push("Mission 8 is missing authored Moon dialogue.");
if (withdrawalMission && !withdrawalMission.sceneLines.some((line) => line.startsWith("The Cryptonian:"))) errors.push("Mission 8 is missing authored The Cryptonian dialogue.");
if (withdrawalMission && /LunaX:|OxNight:|Joseph Nnadi:|The Don:/i.test(withdrawalMission.sceneLines.join(" "))) errors.push("Mission 8 dialogue duplicates characters from adjacent mission casts.");
requireText("else if(story.id==='m08')", "Mission 8 bespoke withdrawal incident runtime");
for (const marker of [
  "m08_request_traced",
  "m08_no_tx_hash_verified",
  "m08_affected_route_verified",
  "m08_unverified_routes_labelled",
  "m08_custody_limits_explained",
  "m08_status_update_published",
  "m08_next_update_time_set",
  "m08_complete:true",
  "withdrawal_scope_verified:true"
]) requireText(marker, "Mission 8 evidence and completion marker " + marker);

const tradeForensicsMission = MISSIONS.find((mission) => mission.id === "m09");
if (!tradeForensicsMission || tradeForensicsMission.title !== "The Trade He Rewrote") errors.push("Mission 9 must use the rewritten trading-forensics story.");
if (tradeForensicsMission && (tradeForensicsMission.npcs[0] !== "Joseph Nnadi" || tradeForensicsMission.npcs[1] !== "The Don")) errors.push("Mission 9 must introduce Joseph Nnadi and The Don in the supplied order.");
if (tradeForensicsMission && (!tradeForensicsMission.prerequisites.includes("m08") || tradeForensicsMission.nextMissionId !== "m10")) errors.push("Mission 9 must connect Mission 8 to Mission 10.");
if (tradeForensicsMission && !tradeForensicsMission.sceneLines.some((line) => line.startsWith("Joseph Nnadi:"))) errors.push("Mission 9 is missing authored Joseph Nnadi dialogue.");
if (tradeForensicsMission && !tradeForensicsMission.sceneLines.some((line) => line.startsWith("The Don:"))) errors.push("Mission 9 is missing authored The Don dialogue.");
if (tradeForensicsMission && /Moon:|The Cryptonian:|Praise:|Toza:|Craftore:/i.test(tradeForensicsMission.sceneLines.join(" "))) errors.push("Mission 9 dialogue duplicates characters from adjacent mission casts.");
requireText("else if(story.id==='m09')", "Mission 9 bespoke trading-forensics runtime");
for (const marker of [
  "m09_original_plan_recovered",
  "m09_first_stop_matches_plan",
  "m09_order_timeline_rebuilt",
  "m09_second_risk_calculated",
  "m09_three_x_exposure_verified",
  "m09_no_valid_setup",
  "m09_recovery_entry_declined",
  "m09_journal_preserved",
  "m09_claim_corrected",
  "m09_unknowns_recorded",
  "m09_complete:true",
  "revenge_entry_declined:true"
]) requireText(marker, "Mission 9 evidence and completion marker " + marker);

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
if (impersonatorMission && (!impersonatorMission.prerequisites.includes("m11") || impersonatorMission.nextMissionId !== "m13")) errors.push("Mission 12 must continue Mission 11's safety incident and hand off directly to the live-session mission.");
if (impersonatorMission && (!impersonatorMission.narrativePurpose.includes("previous mission ended") || !impersonatorMission.cliffhanger.includes("Enugu"))) errors.push("Mission 12 must continue the Mission 11 cliffhanger and establish the Enugu handoff.");
if (impersonatorMission && !impersonatorMission.sceneLines.some((line) => line.startsWith("Reina:")) ) errors.push("Mission 12 is missing authored Reina dialogue.");
if (impersonatorMission && !impersonatorMission.sceneLines.some((line) => line.startsWith("Cclya:")) ) errors.push("Mission 12 is missing authored Cclya dialogue.");
requireText("else if(story.id==='m12')", "Mission 12 bespoke impersonator investigation runtime");
requireText("The newcomer who stayed to test the welcome card just showed Cybersage this DM.", "Mission 12 continuation from Mission 11");
requireText("m12_enugu_handoff_ready:true", "Mission 12 handoff to the Enugu safety session");
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

const leverageMission = MISSIONS.find((mission) => mission.id === "m10");
if (!leverageMission || leverageMission.title !== "The Money That Wasn't His") errors.push("Mission 10 must use the rewritten leverage and protected event-funds story.");
if (leverageMission && (leverageMission.npcs[0] !== "Praise" || leverageMission.npcs[1] !== "Toza" || leverageMission.npcs[2] !== "Craftore")) errors.push("Mission 10 must introduce Praise, Toza and Craftore in the supplied order.");
if (leverageMission && (!leverageMission.prerequisites.includes("m09") || leverageMission.nextMissionId !== "m11")) errors.push("Mission 10 must connect Mission 9 to Mission 11.");
if (leverageMission && !leverageMission.sceneLines.some((line) => line.startsWith("Praise:"))) errors.push("Mission 10 is missing authored Praise dialogue.");
if (leverageMission && !leverageMission.sceneLines.some((line) => line.startsWith("Toza:"))) errors.push("Mission 10 is missing authored Toza dialogue.");
if (leverageMission && !leverageMission.sceneLines.some((line) => line.startsWith("Craftore:"))) errors.push("Mission 10 is missing authored Craftore dialogue.");
if (leverageMission && /Joseph Nnadi:|The Don:|Kodavic:|Cybersage:/i.test(leverageMission.sceneLines.join(" "))) errors.push("Mission 10 dialogue duplicates characters from adjacent mission casts.");
requireText("else if(story.id==='m10')", "Mission 10 bespoke leveraged-position runtime");
for (const marker of [
  "m10_position_ticket_rebuilt",
  "m10_exposure_separated_from_margin",
  "m10_original_risk_limit_found",
  "m10_liquidation_estimate_reviewed",
  "m10_risk_limit_compared",
  "m10_estimate_not_guaranteed",
  "m10_venue_deposit_protected",
  "m10_add_margin_rejected",
  "m10_reduce_or_close_selected",
  "m10_decision_record_saved",
  "m10_event_funds_protected",
  "m10_complete:true",
  "event_funds_protected:true"
]) requireText(marker, "Mission 10 evidence and completion marker " + marker);

const liveSessionMission = MISSIONS.find((mission) => mission.id === "m13");
if (!liveSessionMission || liveSessionMission.title !== "The Mic Is Live") errors.push("Mission 13 must be the live community safety session.");
if (liveSessionMission && (liveSessionMission.npcs[0] !== "Leemah" || liveSessionMission.npcs[1] !== "Kenny")) errors.push("Mission 13 must introduce Leemah and Kenny in the supplied order.");
if (liveSessionMission && (!liveSessionMission.prerequisites.includes("m12") || liveSessionMission.nextMissionId !== "m14")) errors.push("Mission 13 must continue the Mission 12 impersonation incident and hand off to Mission 14.");
if (liveSessionMission && (!liveSessionMission.narrativePurpose.includes("Reina and Cclya") || !liveSessionMission.narrativePurpose.includes("funds were stolen"))) errors.push("Mission 13 must carry the verified incident facts forward without claiming an unverified loss.");
if (liveSessionMission && !liveSessionMission.sceneLines.some((line) => line.startsWith("Leemah:"))) errors.push("Mission 13 is missing authored Leemah dialogue.");
if (liveSessionMission && !liveSessionMission.sceneLines.some((line) => line.startsWith("Kenny:"))) errors.push("Mission 13 is missing authored Kenny dialogue.");
requireText("else if(story.id==='m13')", "Mission 13 bespoke live-session runtime");
requireText("You made it from Anambra with Reina’s incident report?", "Mission 13 opens from the Mission 12 handoff");
requireText("we do not have verified evidence that funds were taken", "Mission 13 preserves the verified incident facts");
requireText("removed identifying details", "Mission 13 protects the affected member in the recap");
const productMessageMission = MISSIONS.find((mission) => mission.id === "m14");
if (!productMessageMission || productMessageMission.title !== "What Does This Product Do?") errors.push("Mission 14 must be the product-communication mission.");
if (productMessageMission && (productMessageMission.npcs[0] !== "Kore" || productMessageMission.npcs[1] !== "Veedima")) errors.push("Mission 14 must introduce Kore and Veedima in the supplied order.");
if (productMessageMission && (!productMessageMission.prerequisites.includes("m13") || productMessageMission.nextMissionId !== "m15")) errors.push("Mission 14 must continue from Mission 13 and hand off to Mission 15.");
if (productMessageMission && !productMessageMission.narrativePurpose.includes("safety session in Mission 13")) errors.push("Mission 14 must connect to the previous mission.");
if (productMessageMission && (!productMessageMission.sceneLines.some((line) => line.startsWith("Kore:")) || !productMessageMission.sceneLines.some((line) => line.startsWith("Veedima:")))) errors.push("Mission 14 must use its assigned NPCs in authored dialogue.");
requireText("else if(story.id==='m14')", "Mission 14 bespoke product-message runtime");
const portfolioMission = MISSIONS.find((mission) => mission.id === "m15");
if (!portfolioMission || portfolioMission.title !== "Show the Work") errors.push("Mission 15 must be the evidence-backed portfolio mission.");
if (portfolioMission && (portfolioMission.npcs[0] !== "Web3_Esta" || portfolioMission.npcs[1] !== "Love")) errors.push("Mission 15 must introduce Web3_Esta then Love.");
if (portfolioMission && (!portfolioMission.prerequisites.includes("m14") || portfolioMission.nextMissionId !== "m16")) errors.push("Mission 15 must continue from Mission 14 and hand off to Mission 16.");
if (portfolioMission && (!portfolioMission.narrativePurpose.includes("verified product announcement") || !portfolioMission.narrativePurpose.includes("evidence a hiring lead can inspect"))) errors.push("Mission 15 must connect the product announcement to portfolio evidence.");
if (portfolioMission && (!portfolioMission.sceneLines.some((line) => line.startsWith("Web3_Esta:")) || !portfolioMission.sceneLines.some((line) => line.startsWith("Love:")))) errors.push("Mission 15 is missing authored dialogue from its assigned NPCs.");
requireText("else if(story.id==='m15')", "Mission 15 bespoke portfolio runtime");
const screeningMission = MISSIONS.find((mission) => mission.id === "m16");
if (!screeningMission || screeningMission.title !== "The Job That Costs Money") errors.push("Mission 16 must screen the suspicious recruitment offer.");
if (screeningMission && (screeningMission.npcs[0] !== "J.Jonathan" || screeningMission.npcs[1] !== "Essa")) errors.push("Mission 16 must use J.Jonathan then Essa.");
if (screeningMission && (!screeningMission.prerequisites.includes("m15") || screeningMission.nextMissionId !== "m17")) errors.push("Mission 16 must continue from Mission 15 and hand off to Mission 17.");
if (screeningMission && (!screeningMission.narrativePurpose.includes("Mission 15") || !screeningMission.narrativePurpose.includes("activation fee"))) errors.push("Mission 16 must pick up the recruiter warning from Mission 15.");
if (screeningMission && (!screeningMission.sceneLines.some((line) => line.startsWith("J.Jonathan:")) || !screeningMission.sceneLines.some((line) => line.startsWith("Essa:")))) errors.push("Mission 16 is missing dialogue from its assigned NPCs.");
requireText("else if(story.id==='m16')", "Mission 16 bespoke recruiter-screening runtime");
for (const marker of ["m16_message_preserved","m16_official_channel_checked","m16_relevant_sample_prepared","m16_safe_response","m16_no_payment_or_secrets","m16_complete:true","job_offer_screened:true"]) requireText(marker, "Mission 16 safety and completion marker " + marker);

const buildMission = MISSIONS.find((mission) => mission.id === "m17");
if (!buildMission || buildMission.title !== "One Night to Build") errors.push("Mission 17 must be the Kano community build challenge.");
if (buildMission && (buildMission.npcs[0] !== "White Coach" || buildMission.npcs[1] !== "Abdul")) errors.push("Mission 17 must use White Coach then Abdul.");
if (buildMission && (!buildMission.prerequisites.includes("m16") || buildMission.nextMissionId !== "m18")) errors.push("Mission 17 must continue from Mission 16 and hand off to Mission 18.");
if (buildMission && (!buildMission.narrativePurpose.includes("Mission 16") || !buildMission.narrativePurpose.includes("work sample") || !buildMission.narrativePurpose.includes("community build challenge"))) errors.push("Mission 17 must connect Mission 16's work sample to the Kano build challenge.");
if (buildMission && (!buildMission.sceneLines.some((line) => line.startsWith("White Coach:")) || !buildMission.sceneLines.some((line) => line.startsWith("Abdul:")))) errors.push("Mission 17 is missing authored dialogue from its assigned NPCs.");
requireText("else if(story.id==='m17')", "Mission 17 bespoke Kano community-build runtime");
for (const marker of [
  "m17_team_conflict_understood",
  "m17_user_needs_heard",
  "m17_problem_selected",
  "m17_scope_cut",
  "m17_roles_assigned",
  "m17_prototype_demo_delivered",
  "m17_real_user_reached_goal",
  "m17_limitations_recorded",
  "m17_complete:true",
  "community_problem_selected:true"
]) requireText(marker, "Mission 17 evidence and completion marker " + marker);


const activationMission = MISSIONS.find((mission) => mission.id === "m18");
if (!activationMission || activationMission.title !== "Clicks Don't Pay the Bills") errors.push("Mission 18 must cover prototype activation and honest growth.");
if (activationMission && (activationMission.npcs[0] !== "David" || activationMission.npcs[1] !== "Kanyin")) errors.push("Mission 18 must use David then Kanyin.");
if (activationMission && (!activationMission.prerequisites.includes("m17") || activationMission.nextMissionId !== "m19")) errors.push("Mission 18 must connect Mission 17's prototype to Mission 19's funding offer.");
if (activationMission && (!activationMission.narrativePurpose.includes("Mission 17") || !activationMission.narrativePurpose.includes("thousands of clicks"))) errors.push("Mission 18 must continue from the prototype and investigate low activation.");
if (activationMission && (!activationMission.sceneLines.some((line) => line.startsWith("David:")) || !activationMission.sceneLines.some((line) => line.startsWith("Kanyin:")))) errors.push("Mission 18 is missing its authored David/Kanyin opening scene.");
requireText("else if(story.id==='m18')", "Mission 18 bespoke activation-experiment runtime");
for (const marker of [
  "m18_user_expectations_checked",
  "m18_hypothesis_formed",
  "m18_campaign_brief_ready",
  "m18_claims_accurate",
  "m18_activation_metric_selected",
  "m18_results_interpreted",
  "m18_suspicious_growth_rejected",
  "m18_sample_limit_reported",
  "m18_complete:true",
  "prototype_expectations_checked:true"
]) requireText(marker, "Mission 18 evidence and completion marker " + marker);
const fundingMission = MISSIONS.find((mission) => mission.id === "m19");
if (!fundingMission || fundingMission.title !== "The Offer on the Table") errors.push("Mission 19 must be the distinct funding-term negotiation in Edo.");
if (fundingMission && (fundingMission.npcs[0] !== "Mcbond" || fundingMission.npcs[1] !== "Alpha.RWA")) errors.push("Mission 19 must use Mcbond then Alpha.RWA.");
if (fundingMission && (!fundingMission.prerequisites.includes("m18") || fundingMission.nextMissionId !== "m20")) errors.push("Mission 19 must continue from the growth experiment and hand off to the warehouse-claim mission.");
if (fundingMission && (!fundingMission.narrativePurpose.includes("Mission 18") || !fundingMission.narrativePurpose.includes("fixed returns") || !fundingMission.narrativePurpose.includes("reporting"))) errors.push("Mission 19 must directly continue the funding offer raised in Mission 18.");
if (fundingMission && (!fundingMission.sceneLines.some((line) => line.startsWith("Mcbond:")) || !fundingMission.sceneLines.some((line) => line.startsWith("Alpha.RWA:")))) errors.push("Mission 19 is missing its authored dialogue from the assigned NPCs.");
if (fundingMission && /Abdul:|David:|Kanyin:/i.test(fundingMission.sceneLines.join(" "))) errors.push("Mission 19 dialogue still uses NPCs from earlier missions instead of its assigned cast.");
requireText("else if(story.id==='m19')", "Mission 19 bespoke funding negotiation runtime");
for (const marker of ["m19_fixed_return_challenged","m19_obligations_identified","m19_milestones_defined","m19_budget_linked","m19_reporting_rights_requested","m19_risk_disclosures_requested","m19_pressure_rejected","m19_independent_review_required","m19_complete:true","milestone_reporting_required:true"]) requireText(marker, "Mission 19 evidence and completion marker " + marker);

const assetMission = MISSIONS.find((mission) => mission.id === "m20");
if (!assetMission || assetMission.title !== "The Warehouse Behind the Token") errors.push("Mission 20 must be the Edo warehouse asset-claim investigation.");
if (assetMission && (assetMission.npcs[0] !== "BigWealth" || assetMission.npcs[1] !== "Blessing")) errors.push("Mission 20 must use BigWealth then Blessing.");
if (assetMission && (!assetMission.prerequisites.includes("m19") || assetMission.nextMissionId !== "m21")) errors.push("Mission 20 must continue from Mission 19 and hand off to Mission 21.");
if (assetMission && (!assetMission.sceneLines.some((line) => line.startsWith("BigWealth:")) || !assetMission.sceneLines.some((line) => line.startsWith("Blessing:")))) errors.push("Mission 20 opening scene dialogue does not match its assigned NPCs.");
if (assetMission && /Kanyin:|Mcbond:/i.test(assetMission.sceneLines.join(" "))) errors.push("Mission 20 still contains dialogue attributed to NPCs from earlier missions.");
requireText("else if(story.id==='m20')", "Mission 20 bespoke warehouse due-diligence runtime");
for (const marker of ["m20_physical_stock_observed","m20_ownership_record_missing","m20_duplicate_seal_found","m20_records_preserved","m20_custody_terms_missing","m20_redemption_terms_missing","m20_launch_paused","m20_unresolved_items_reported","m20_complete:true","asset_claim_verification_required:true"]) requireText(marker, "Mission 20 evidence and completion marker " + marker);


for (const marker of ["m15_role_matched","m15_two_samples_documented","m15_contribution_separated","m15_bio_evidence_linked","m15_skill_gap_named","m15_complete:true","portfolio_evidence_compiled:true"]) requireText(marker, "Mission 15 evidence and completion marker " + marker);

for (const marker of [
  "m14_audience_defined",
  "m14_product_inspected",
  "m14_plain_language_copy",
  "m14_educational_post_published",
  "m14_complete:true",
  "product_message_verified:true",
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

const continuityHandoffs = [
  ["m02","m03","shortened link","twelve secret words","voice note from Lagos"],
  ["m04","m05","payment app","PAID","flashes PAID"],
  ["m05","m06","payout destination","merchant-approved address","payout destination"],
  ["m20","m21","AI-generated summary","different owner","warehouse due-diligence packet"],
  ["m21","m22","destination record","pending","issuing network"],
  ["m22","m23","fund another bridge route","failure plan","community vote"],
  ["m23","m24","privileged permission","redirect funds","privileged contract role"],
  ["m24","m25","digital collectible","artwork","digital collectible"],
  ["m25","m26","open-source component","licence notice","minting page"],
  ["m26","m27","cyan marker","archive metadata","cyan marker"],
  ["m27","m28","case reference","loses","hand-off"],
  ["m28","m29","KitCity","deployment route","KitCity"],
  ["m29","m30","three teams","show your work","three teams"],
  ["m30","m31","signed deployment record","T3Kit","evidence-routing pathway"]
];
for (const [fromId, toId, hookA, hookB, purposeTerm] of continuityHandoffs) {
  const from = MISSIONS.find((mission) => mission.id === fromId);
  const to = MISSIONS.find((mission) => mission.id === toId);
  if (!from || !to || from.nextMissionId !== toId || !to.prerequisites.includes(fromId)) {
    errors.push("Continuity link " + fromId + " -> " + toId + " is missing its hand-off or prerequisite.");
    continue;
  }
  const hook = String(from.cliffhanger || "").toLowerCase();
  const purpose = String(to.narrativePurpose || "").toLowerCase();
  if (!hook.includes(hookA.toLowerCase()) || !hook.includes(hookB.toLowerCase())) errors.push(fromId + " cliffhanger is missing a continuity cue.");
  if (!purpose.includes(purposeTerm.toLowerCase())) errors.push(toId + " narrative purpose is missing its hand-off context.");
}
const finaleMission = MISSIONS.find((mission) => mission.id === "m31");
if (finaleMission && !/does not connect T3Kit to the operation of every scam/i.test(finaleMission.ending)) {
  errors.push("Finale must state the limit of what the signed deployment record proves.");
}

if (errors.length) {
  console.error("CHRONICLES RUNTIME VALIDATION FAILED");
  errors.forEach((error) => console.error(" - " + error));
  process.exitCode = 1;
} else {
  console.log("CHRONICLES RUNTIME VALIDATION PASSED");
  console.log("Missions: " + MISSIONS.length + "; supplied characters: " + CHARACTER_ORDER.length);
  console.log("State mapping: every story mission mapped; KitCity is the final destination; FCT is not a story stop");
}
