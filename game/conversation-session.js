/**
 * Backward-compatible entry point for older KitCity code.
 * New integrations should import ConversationEngine directly.
 */
export { ConversationEngine, createDialogueState, validateDialogueContent } from "./conversation-engine.js";
import { ConversationEngine } from "./conversation-engine.js";

export class ConversationSession extends ConversationEngine {
  constructor(encounter, npc, state, context = {}) {
    super({ content: encounter, state, context });
    this.npc = npc || null;
  }

  opening() {
    return this.start().node;
  }
}
