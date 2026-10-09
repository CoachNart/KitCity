# KitCity

KitCity is a mobile-first Nigerian open-world adventure built with Next.js, React and Three.js.

## Exploration-first architecture

The active game entry point is free roam. Encounters are optional and contextual; dialogue and rewards do not force a linear lesson sequence. Rendering, movement, collision resolution, traffic, pedestrians and city generation remain in the existing Three.js engine.

### Educational content framework

- `game/educational-content.js`: structured, offline-first library of 15 Web3 concepts and 16 authored story mission trees (15 introductions plus a separate agriculture deepening case) spanning digital ownership, education, agriculture, commerce, healthcare, law and public records, employment, creative industries, governance, identity/privacy, decentralized infrastructure, real-world asset tokenization, AI provenance, security, and open internet protocols.
- Each concept includes a plain-language explanation, sectors, suitable NPC profiles, scenario, complexity, prerequisites, example application, limitations and a practical takeaway. Only missions matched to a playable environment are offered in-game; authored missions without matching environment assets remain registered but unavailable. Each mission is an interactive branching dialogue that moves from a character's problem to a possible application, a skeptical question, a limitation and a useful discovery.
- Educational encounters are registered with the shared dialogue resolver and spawned as optional NPCs in free roam. Prerequisites gate advanced missions; completing a lesson persists its concept knowledge and mission state. The authored content is available offline and avoids presenting proposed use cases as universal deployments.

### Nigerian world and mission distribution

- `game/world-registry.js` registers all **36 states individually** and the **Federal Capital Territory (Abuja) separately**. Every jurisdiction has typed slots for locations, environment profiles, NPCs, occupations, communities, main/side missions, environmental encounters, educational concepts, story arcs and unlock requirements.
- A jurisdiction record is not a playable map. Only locations explicitly marked `playable` and linked to an existing environment asset can be entered. At present, the registry marks only the existing KitCity free-roam environment as playable. Each of the 37 jurisdictions also has a non-playable administrative-capital reference record with no engine city, asset or invented environment; it stays research-pending until a real environment is available.
- `game/mission-distribution.js` registers the 21 requested sectors, location-aware educational mission eligibility, NPC perspective metadata, dialogue associations, simulated rewards, environmental events and story arcs. Selection checks the active location's supported environment profiles and saved concept/mission knowledge, avoids unnecessary repeats, and allows a known concept to return only through a distinct authored mission in a different supported location context; the same lesson is not replayed just because the player moved.
- NPC profiles record age range, economic circumstances, technical fluency and stance rather than treating residents as interchangeable or making the protagonist the only expert. Regional content remains marked for research until grounded in location-specific sources.
- Run `npm run report:world` for a machine-checked development report. It shows the number of states, territories, registered/playable locations, sectors, NPC profiles, educational concepts/missions, dialogue trees, rewards, events and missions still awaiting suitable environments.

### First eight interactive prototype missions

- `game/prototype-missions.js` authors eight complete branching mission trees: market payment records, student portfolio evidence, agricultural batch traceability, legal review of a smart contract, music collaboration rights, clinic appointment privacy, community budget governance, and a Web3 architecture reality check.
- Each mission has a distinct NPC perspective, natural opening branches, a practical task briefing, in-world objective markers with meaningful decisions, a return/debrief stage, concept knowledge, completion flags, an in-game reward, and returning-NPC dialogue.
- Objective progress is saved under the adventure dialogue state. Multi-check activities require all evidence markers to be inspected before the debrief can complete the mission. The final reward path is protected from dialogue-only completion and duplicate rewards.
- The eight NPCs and their objective markers are encounter overlays in the **existing Lagos free-roam environment**. The student, farm, law, studio, clinic, community and meetup scenarios are not claims that separate campus/farm/office/clinic maps have been built. Their dedicated environments remain future content.
- Missions are optional and can be tackled in any order. Starting a mission returns control to free roam; players travel to objective markers and then return to the NPC rather than sitting through eight consecutive lectures.

### Optional street life and discoveries

- `game/kitcity-engine.js` already drives pedestrian walkers, pairs who stop for background conversations, road-crossing pedestrians, hawkers, traffic, ambient barks, footsteps and collision feedback. These remain separate from mission dialogue.
- `game/exploration-life.js` adds four optional non-educational discoveries to the existing Lagos scene: a buka stop, an old cinema mural, a street-football circle and a neighbourhood noticeboard. They are lightweight in-world markers, not separate map claims.
- Discoveries give a small one-time XP/reward, persist in the adventure save and change to a remembered state on return. They can be revisited without paying the reward again; no Web3 lesson is required.
- Mobile rendering now caps device pixel ratio more conservatively, disables antialiasing on narrow screens and uses a smaller shadow map on mobile. The existing Low graphics setting remains available.
- The first free-roam prompt names the movement, sprint and nearby Talk/Look controls. POIs use a distinct **Look** interaction label.

### Conversation engine

- `game/conversation-engine.js`: reusable, data-only conversation state machine. Supports branching nodes, conditional choices, mission requirements, optional follow-ups, state changes, trust and knowledge flags, mission completion, natural exit, and persistent state snapshots.
- `game/dialogue-content.js`: authored conversation pack. NPCs have distinct professions, concerns, knowledge levels, communication styles and response branches. Add another profession, community, location or educational mission by registering a content tree; no rendering or engine changes are needed.
- `game/kitcity-engine.js`: adapts the location-agnostic conversation engine to compact mobile dialogue, rewards and persisted mission progress. It uses location-registry NPC spawn points when configured and preserves existing spawn positions as a fallback for the current scene.
- `game/adventure-data.js`: NPC profiles, social encounters, concepts and free-roam activities, with content kept separate from movement and rendering logic.
- `game/adventure-director.js`: exploration-first encounter pacing and eligibility rules.
- `scripts/registry-loader.mjs`: loads ESM registries through ordinary relative imports for reliable Node tests and reports.

Dialogue is authored locally. No external AI API or paid runtime service is needed. Choice effects, knowledge flags, relationship trust, completed missions and unlocked follow-ups are stored in dialogue state. NPCs can recognize returning players. Every node offers a safe way to leave without falsely completing a mission.

## Verification

Run `npm run test` to validate the social dialogue registry, all 15 educational concepts and 16 authored mission trees, prerequisite locks/unlocks, saved knowledge/relationship state, mission completion, early exit, returning-NPC dialogue, the 36-state/FCT split, playable-location gating, sector/NPC/reward/event references and mission-distribution coverage. `npm run report:world` prints the current development report and fails if registry validation detects errors. The GitHub Actions workflow also runs the production build.

The current world registry contains 38 location records: one playable environment and 37 registry-only administrative-capital references. No new state or FCT environment is claimed to be playable until a real environment asset is registered and linked.

The game’s digital asset, wallet and blockchain scenarios are fictional simulations unless a future integration is explicitly implemented and disclosed.
