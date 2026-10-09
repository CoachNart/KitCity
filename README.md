# KitCity

KitCity is a mobile-first Nigerian open-world adventure built with Next.js, React and Three.js.

## Rebuild direction: exploration-first adventure

The new experience is organized around exploration, free-roam activities, contextual encounters, branching conversations, and optional rewards—not consecutive educational lessons.

### Architecture modules

- `game/adventure-data.js`: data-only registry for Nigeria's 36 states and FCT, NPC profiles, Web3 concept tags, sample encounters and free-roam activities.
- `game/adventure-director.js`: pacing and eligibility logic. It accumulates travel and activity, gates substantial encounters, and never interrupts the player to start a conversation.
- `game/conversation-session.js`: short branching conversation state with player choices, optional follow-ups and a natural exit.

These modules are the first foundation stage. Existing Three.js rendering, player movement, collision resolution, camera behavior, pedestrians, and city generation remain separate from content data so the experience can be replaced incrementally without a risky engine rewrite.

## Implementation sequence

1. Audit the current engine and isolate legacy progression/UI from rendering and movement.
2. Introduce the data-driven world, encounter director, conversation sessions and persistence.
3. Replace the linear mission hub and forced step flow with free roam, contextual encounters and side activities.
4. Connect rewards and progress to player choices, exploration and completed activities.
5. Expand state/city definitions and content packs; tune mobile performance and test build/runtime behavior.

The game’s digital asset, wallet, and blockchain scenarios are fictional simulations unless a future integration is explicitly implemented and disclosed.
