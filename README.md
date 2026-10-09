# KitCity

KitCity is a mobile-first Nigerian open-world adventure built with Next.js, React and Three.js.

## Exploration-first architecture

The active game entry point is free roam. Encounters are optional and contextual; dialogue and rewards do not force a linear lesson sequence. Rendering, movement, collision resolution, traffic, pedestrians and city generation remain in the existing Three.js engine.

### Educational content framework

- `game/educational-content.js`: structured, offline-first library of 15 Web3 concepts and 15 playable story missions spanning digital ownership, education, agriculture, commerce, healthcare, law and public records, employment, creative industries, governance, identity/privacy, decentralized infrastructure, real-world asset tokenization, AI provenance, security, and open internet protocols.
- Each concept includes a plain-language explanation, sectors, suitable NPC profiles, scenario, complexity, prerequisites, example application, limitations and a practical takeaway. Each mission is an interactive branching dialogue that moves from a character's problem to a possible application, a skeptical question, a limitation and a useful discovery.
- Educational encounters are registered with the shared dialogue resolver and spawned as optional NPCs in free roam. Prerequisites gate advanced missions; completing a lesson persists its concept knowledge and mission state. The authored content is available offline and avoids presenting proposed use cases as universal deployments.

### Conversation engine

- `game/conversation-engine.js`: reusable, data-only conversation state machine. Supports branching nodes, conditional choices, mission requirements, optional follow-ups, state changes, trust and knowledge flags, mission completion, natural exit, and persistent state snapshots.
- `game/dialogue-content.js`: authored conversation pack. NPCs have distinct professions, concerns, knowledge levels, communication styles and response branches. Add another profession, community, location or educational mission by registering a content tree; no rendering or engine changes are needed.
- `game/kitcity-engine.js`: adapts engine state to compact dialogue bubbles, mobile choice buttons, game rewards and mission progress. Dialogue state is persisted through the game's existing storage wrapper.
- `game/adventure-data.js`: registry for Nigeria's 36 states and FCT, NPC profiles, concepts and free-roam activities.
- `game/adventure-director.js`: exploration-first encounter pacing and eligibility rules.

Dialogue is authored locally. No external AI API or paid runtime service is needed. Choice effects, knowledge flags, relationship trust, completed missions and unlocked follow-ups are stored in dialogue state. NPCs can recognize returning players. Every node offers a safe way to leave without falsely completing a mission.

## Verification

Run `npm run test:dialogue` to validate the social dialogue registry, all 15 educational concepts and mission trees, a complete path through every lesson, prerequisite locks/unlocks, saved knowledge/relationship state, mission completion, early exit and returning-NPC dialogue. The GitHub Actions workflow also runs the production build.

The game’s digital asset, wallet and blockchain scenarios are fictional simulations unless a future integration is explicitly implemented and disclosed.
