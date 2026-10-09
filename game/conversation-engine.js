/**
 * Reusable, offline-first dialogue runtime for KitCity.
 * Dialogue data is declarative; this class contains no DOM or Three.js code.
 */
const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));

function matchesCondition(condition, state, context = {}) {
  if (!condition) return true;
  if (Array.isArray(condition)) return condition.every(c => matchesCondition(c, state, context));
  if (condition.all) return condition.all.every(c => matchesCondition(c, state, context));
  if (condition.any) return condition.any.some(c => matchesCondition(c, state, context));
  if (condition.not) return !matchesCondition(condition.not, state, context);
  if (condition.flag) return Boolean(state.flags[condition.flag]) === (condition.equals !== false);
  if (condition.metNpc) return Boolean(state.metNpcs[condition.metNpc]);
  if (condition.completedMission) return Boolean(state.completedMissions[condition.completedMission]);
  if (condition.unlockedFollowUp) return Boolean(state.unlockedFollowUps[condition.unlockedFollowUp]);
  if (condition.knowledge) return Boolean(state.knowledge[condition.knowledge]);
  if (condition.trustAtLeast != null) return (state.relationships[context.npcId]?.trust || 0) >= condition.trustAtLeast;
  if (condition.minExploreScore != null) return (context.exploreScore || 0) >= condition.minExploreScore;
  if (condition.minTravelMeters != null) return (context.travelMeters || 0) >= condition.minTravelMeters;
  return true;
}

function applyEffects(effects, state, context = {}) {
  if (!effects) return;
  for (const [key, value] of Object.entries(effects)) {
    if (key === "trust" && context.npcId) {
      const rel = state.relationships[context.npcId] ||= { trust: 0, meetings: 0 };
      rel.trust = Math.max(-5, Math.min(5, rel.trust + Number(value || 0)));
    } else if (key === "knowledge") {
      for (const item of Array.isArray(value) ? value : [value]) if (item) state.knowledge[item] = true;
    } else if (key === "flags") {
      for (const [flag, enabled] of Object.entries(value || {})) state.flags[flag] = enabled;
    } else if (key === "unlockFollowUps") {
      for (const id of Array.isArray(value) ? value : [value]) if (id) state.unlockedFollowUps[id] = true;
    } else if (key === "completeMissions") {
      for (const id of Array.isArray(value) ? value : [value]) if (id) state.completedMissions[id] = true;
    } else if (key === "set") {
      for (const [field, next] of Object.entries(value || {})) state.flags[field] = next;
    } else if (key === "trustDelta" && context.npcId) {
      const rel = state.relationships[context.npcId] ||= { trust: 0, meetings: 0 };
      rel.trust = Math.max(-5, Math.min(5, rel.trust + Number(value || 0)));
    }
  }
}

export function createDialogueState(saved = {}) {
  return Object.assign({
    metNpcs: {}, relationships: {}, choices: {}, knowledge: {}, conceptHistory: {}, flags: {},
    completedMissions: {}, unlockedFollowUps: {}, completedConversations: {}
  }, clone(saved) || {});
}

export class ConversationEngine {
  constructor({ content, state, context = {} }) {
    if (!content || !content.id || !content.nodes || !content.start) throw new Error("Invalid dialogue content: id, start and nodes are required.");
    this.content = content;
    this.state = createDialogueState(state);
    this.context = context;
    this.npcId = content.npcId || content.id;
    this.nodeId = content.start;
    this.history = [];
    this.closed = false;
    this.completed = false;
    this.missionCompleted = false;
    this.lastChoiceIndex = -1;
  }

  start() {
    if (this.content.requires && !matchesCondition(this.content.requires, this.state, { ...this.context, npcId: this.npcId })) {
      return { unavailable: true, reason: this.content.unavailableText || "You have not met the requirements for this conversation yet.", state: this.state };
    }
    const rel = this.state.relationships[this.npcId] ||= { trust: 0, meetings: 0 };
    const returning = Boolean(this.state.metNpcs[this.npcId]);
    this.state.metNpcs[this.npcId] = true;
    rel.meetings = (rel.meetings || 0) + 1;
    const startNode = this.content.nodes[this.nodeId];
    if (returning && startNode) this._openingOverride = startNode.returningText || (this.content.conceptId ? "You came back. Last time we explored " + this.content.title + ". What part should we look at now?" : null);
    return { node: this.currentNode(), returning, state: this.state };
  }

  currentNode() {
    if (this.closed) return null;
    const node = this.content.nodes[this.nodeId];
    if (!node) throw new Error("Unknown dialogue node: " + this.nodeId);
    if (node.requires && !matchesCondition(node.requires, this.state, { ...this.context, npcId: this.npcId })) {
      const fallback = node.fallback || this.content.fallback;
      if (fallback && fallback !== this.nodeId && this.content.nodes[fallback]) {
        this.nodeId = fallback;
        return this.currentNode();
      }
      return { id: node.id || this.nodeId, speaker: node.speaker || this.content.npcName || "Resident", role: node.role || this.content.role || "", text: node.lockedText || this.content.unavailableText || "Let’s come back to this another time.", portrait: node.portrait || this.content.portrait || null, conceptTags: node.conceptTags || this.content.conceptTags || [], choices: [{ id: "__leave_conversation", label: this.content.exitLabel || "I’ll let you get back to it", style: "quiet" }] };
    }
    const text = this._openingOverride || node.text;
    this._openingOverride = null;
    const choices = (node.choices || []).filter(choice =>
      matchesCondition(choice.requires, this.state, { ...this.context, npcId: this.npcId }) &&
      (!choice.optional || this.state.unlockedFollowUps[choice.id] || choice.alwaysAvailable)
    ).slice(0, node.allowExit === false ? 4 : 3).map(({ id, label, style }) => ({ id, label, style: style || "normal" }));
    if (node.allowExit !== false && choices.length < 4) choices.push({ id: "__leave_conversation", label: this.content.exitLabel || "I’ll let you get back to it", style: "quiet" });
    return { id: node.id || this.nodeId, speaker: node.speaker || this.content.npcName || "Resident", role: node.role || this.content.role || "", text: text || "", portrait: node.portrait || this.content.portrait || null, conceptTags: node.conceptTags || this.content.conceptTags || [], choices };
  }

  choose(choiceId) {
    if (this.closed) return { error: "closed" };
    if (choiceId === "__leave_conversation") {
      this.state.choices[this.npcId] ||= [];
      this.state.choices[this.npcId].push({ nodeId: this.nodeId, choiceId, at: Date.now() });
      this.closed = true;
      return { ended: true, completed: false, missionCompleted: false, missionId: null, choiceIndex: -1, state: this.state, ending: "" };
    }
    const node = this.content.nodes[this.nodeId];
    const available = (node.choices || []).filter(choice => matchesCondition(choice.requires, this.state, { ...this.context, npcId: this.npcId }));
    const index = available.findIndex(choice => choice.id === choiceId);
    if (index < 0) return { error: "invalid-choice" };
    const choice = available[index];
    this.lastChoiceIndex = index;
    this.state.choices[this.npcId] ||= [];
    this.state.choices[this.npcId].push({ nodeId: this.nodeId, choiceId, at: Date.now() });
    applyEffects(choice.effects, this.state, { ...this.context, npcId: this.npcId });
    this.history.push({ speaker: "You", role: "You", text: choice.label, kind: "player" });

    if (choice.completeMission) {
      this.state.completedMissions[choice.completeMission] = true;
      this.missionCompleted = true;
    }
    if (choice.unlockFollowUps) {
      for (const id of Array.isArray(choice.unlockFollowUps) ? choice.unlockFollowUps : [choice.unlockFollowUps]) this.state.unlockedFollowUps[id] = true;
    }
    if (choice.end) {
      this.closed = true;
      this.completed = Boolean(choice.completeConversation);
      if (this.completed) this.state.completedConversations[this.content.id] = true;
      const result = { ended: true, completed: this.completed, missionCompleted: this.missionCompleted, missionId: choice.completeMission || this.content.missionId || null, choiceIndex: index, effects: clone(choice.effects || {}), state: this.state, ending: choice.ending || this.content.ending || "" };
      if (choice.completeConversation && this.content.missionId) this.state.completedMissions[this.content.missionId] = true;
      return result;
    }

    const next = typeof choice.next === "string" ? choice.next : this._resolveBranch(choice.next);
    if (!next || !this.content.nodes[next]) return { error: "invalid-next-node" };
    this.nodeId = next;
    const response = this.currentNode();
    this.history.push({ speaker: response.speaker, role: response.role, text: response.text, kind: "npc" });
    return { node: response, choice: clone(choice), state: this.state };
  }

  _resolveBranch(branch) {
    if (!branch) return null;
    if (typeof branch === "string") return branch;
    if (branch.when && matchesCondition(branch.when, this.state, { ...this.context, npcId: this.npcId })) return branch.then;
    return branch.else || null;
  }

  snapshot() {
    return { nodeId: this.nodeId, history: clone(this.history), closed: this.closed, completed: this.completed, missionCompleted: this.missionCompleted, lastChoiceIndex: this.lastChoiceIndex };
  }
}

export function validateDialogueContent(contents) {
  const errors = [];
  for (const content of contents || []) {
    if (!content.id || !content.start || !content.nodes?.[content.start]) errors.push(content.id + ": missing id/start node");
    for (const [id, node] of Object.entries(content.nodes || {})) {
      if (!node.text) errors.push(content.id + "/" + id + ": missing dialogue text");
      if ((node.choices || []).length > 4) errors.push(content.id + "/" + id + ": more than four choices");
      for (const choice of node.choices || []) {
        const next = typeof choice.next === "string" ? choice.next : choice.next?.then || choice.next?.else;
        if (!choice.end && next && !content.nodes[next]) errors.push(content.id + "/" + id + ": unknown next node " + next);
      }
    }
  }
  return errors;
}
