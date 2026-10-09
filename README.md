# KitCity

KitCity is a mobile-first Nigerian open-world adventure built with Next.js, React and Three.js.

## Exploration-first architecture

The active game entry point is free roam. Encounters are optional and contextual; dialogue and rewards do not force a linear lesson sequence. Rendering, movement, collision resolution, traffic, pedestrians and city generation remain in the existing Three.js engine.

### Conversation engine

- `game/conversation-engine.js`: reusable, data-only conversation state machine. Supports branching nodes, conditional choices, node/conversation mission requirements, optional follow-ups, state changes, trust and knowledge flags, mission completion, natural exit, and persistence snapshots.
- `game/dialogue-content.js`: authored conversation pack. Each NPC has a distinct profession, concern, knowledge level, communication style and response branches. Add another profession, community, location or educational mission by registering a content tree; no rendering or engine changes are needed.
- `game/kitcity-engine.js`: adapts engine state to compact dialogue bubbles, mobile choice buttons, game rewards and existing mission progress. It persists dialogue state through the game's existing storage wrapper.
- `game/adventure-data.js`: registry for Nigeria's 36 states and FCT, NPC profiles, concepts and free-roam activities.
- `game/adventure-director.js`: exploration-first encounter pacing and eligibility rules.

Dialogue is authored locally. No external AI API or paid runtime service is needed. Choice effects, knowledge flags, relationship trust, completed missions and unlocked follow-ups are stored in the dialogue state. NPCs can recognize returning players. Every node offers a safe way to leave without falsely completing a mission.

## Verification

Run `npm run test:dialogue` to validate the dialogue registry and exercise branching paths, mission completion, saved knowledge/relationship state, mission requirements, early exit and returning-NPC dialogue. The GitHub Actions workflow also runs the production build.

The game’s digital asset, wallet and blockchain scenarios are fictional simulations unless a future integration is explicitly implemented and disclosed.
