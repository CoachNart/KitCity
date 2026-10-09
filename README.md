# KitCity

KitCity is a mobile-first Nigerian open-world adventure built with Next.js, React and Three.js.

## Exploration-first architecture

The active game entry point is free roam. Encounters are optional and contextual; dialogue and rewards do not force a linear lesson sequence. Rendering, movement, collision resolution, traffic, pedestrians and city generation remain in the existing Three.js engine.

### Educational content framework

- `game/educational-content.js`: structured, offline-first library of 15 Web3 concepts and 15 playable story missions spanning digital ownership, education, agriculture, commerce, healthcare, law and public records, employment, creative industries, governance, identity/privacy, decentralized infrastructure, real-world asset tokenization, AI provenance, security, and open internet protocols.
- Each concept includes a plain-language explanation, sectors, suitable NPC profiles, scenario, complexity, prerequisites, example application, limitations and a practical takeaway. Each mission is an interactive branching dialogue that moves from a character's problem to a possible application, a skeptical question, a limitation and a useful discovery.
- Educational encounters are registered with the shared dialogue resolver and spawned as optional NPCs in free roam. Prerequisites gate advanced missions; completing a lesson persists its concept knowledge and mission state. The authored content is available offline and avoids presenting proposed use cases as universal deployments.

### Nigerian world and mission distribution

- `game/world-registry.js` registers all **36 states individually** and the **Federal Capital Territory (Abuja) separately**. Every jurisdiction has typed slots for locations, environment profiles, NPCs, occupations, communities, main/side missions, environmental encounters, educational concepts, story arcs and unlock requirements.
- A jurisdiction record is not a playable map. Only locations explicitly marked `playable` and linked to an existing environment asset can be entered. At present, the registry marks only the existing KitCity free-roam environment as playable. Each of the 37 jurisdictions also has a non-playable administrative-capital reference record with no engine city, asset or invented environment; it stays research-pending until a real environment is available.
- `game/mission-distribution.js` registers the 21 requested sectors, location-aware educational mission eligibility, NPC perspective metadata, dialogue associations, simulated rewards, environmental events and story arcs. Selection checks the active location's supported environment profiles and saved concept/mission knowledge, avoids unnecessary repeats, and lets a known concept return through a different authored context when it deepens learning.
- NPC profiles record age range, economic circumstances, technical fluency and stance rather than treating residents as interchangeable or making the protagonist the only expert. Regional content remains marked for research until grounded in location-specific sources.
- Run `npm run report:world` for a machine-checked development report. It shows the number of states, territories, registered/playable locations, sectors, NPC profiles, educational concepts/missions, dialogue trees, rewards, events and missions still awaiting suitable environments.

### Conversation engine

- `game/conversation-engine.js`: reusable, data-only conversation state machine. Supports branching nodes, conditional choices, mission requirements, optional follow-ups, state changes, trust and knowledge flags, mission completion, natural exit, and persistent state snapshots.
- `game/dialogue-content.js`: authored conversation pack. NPCs have distinct professions, concerns, knowledge levels, communication styles and response branches. Add another profession, community, location or educational mission by registering a content tree; no rendering or engine changes are needed.
- `game/kitcity-engine.js`: adapts engine state to compact dialogue bubbles, mobile choice buttons, game rewards and mission progress. Dialogue state is persisted through the game's existing storage wrapper.
- `game/world-registry.js`: source-of-truth registry for Nigeria's 36 states plus a separately represented FCT, geopolitical-zone metadata, environment profiles, sector registry, location content slots, and settlement records for each administrative capital. The 37 capital records are explicitly `planned` / `registry-only`; only the existing Lagos free-roam scene is marked playable and linked to an engine environment asset.
- `game/mission-distribution.js`: location-aware educational mission distribution, NPC/dialogue/reward/event/story registries, context matching, prerequisite checks, repetition avoidance, cross-registry validation, and a structured development report. Missions can be authored before a suitable environment exists, but are not offered by unbuilt locations.
- `game/adventure-data.js`: NPC profiles, social encounters, concepts and free-roam activities, with content kept separate from movement and rendering logic.
- `game/adventure-director.js`: exploration-first encounter pacing and eligibility rules.
- `scripts/report-world.mjs`: emits the full registry-validation and world-development report as JSON with jurisdiction-by-jurisdiction playable/registry-only coverage. Run `npm run report:world`; run `npm run test:dialogue` for regression validation.

Dialogue is authored locally. No external AI API or paid runtime service is needed. Choice effects, knowledge flags, relationship trust, completed missions and unlocked follow-ups are stored in dialogue state. NPCs can recognize returning players. Every node offers a safe way to leave without falsely completing a mission.

## Verification

Run `npm run test` to validate the social dialogue registry, all 15 educational concepts and mission trees, prerequisite locks/unlocks, saved knowledge/relationship state, mission completion, early exit, returning-NPC dialogue, the 36-state/FCT split, playable-location gating, sector/NPC/reward/event references and mission-distribution coverage. `npm run report:world` prints the current development report and fails if registry validation detects errors. The GitHub Actions workflow also runs the production build.

The game’s digital asset, wallet and blockchain scenarios are fictional simulations unless a future integration is explicitly implemented and disclosed.
