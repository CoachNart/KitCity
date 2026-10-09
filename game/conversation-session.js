/** Small, branching conversations. No forced linear lesson sequence. */
export class ConversationSession {
  constructor(encounter, npc) {
    this.encounter = encounter;
    this.npc = npc;
    this.stage = "opening";
    this.choiceHistory = [];
    this.followUpIndex = 0;
    this.closed = false;
  }

  opening() {
    return { speaker: this.npc.name, text: this.encounter.opening.text, choices: this.encounter.choices.map(({id,label})=>({id,label})) };
  }

  choose(choiceId) {
    if (this.closed || this.stage !== "opening") return null;
    const choice = this.encounter.choices.find(item => item.id === choiceId);
    if (!choice) return null;
    this.choiceHistory.push({choiceId, effect: choice.effect || {}});
    this.stage = "reply";
    return {
      speaker: this.npc.name,
      text: choice.reply,
      conceptHint: choice.conceptHint || null,
      choices: [
        ...(this.encounter.followUps || []).map(({id,label})=>({id,label,kind:"follow-up"})),
        {id:"end-conversation",label:"Alright, I’ll let you get back to it",kind:"end"}
      ]
    };
  }

  followUp(id) {
    if (this.closed || this.stage !== "reply") return null;
    if (id === "end-conversation") { this.closed = true; this.stage = "closed"; return {ended:true, text:this.encounter.ending, reward:this.encounter.reward}; }
    const follow = (this.encounter.followUps || []).find(item => item.id === id);
    if (!follow) return null;
    this.followUpIndex++;
    return {speaker:this.npc.name, text:follow.text, choices:[{id:"end-conversation",label:"Got it. Let’s move",kind:"end"}]};
  }
}
