/**
 * KitCity open-world content registry.
 * Content lives here instead of being embedded in engine control flow.
 * City/location content can be added without changing movement or rendering.
 */
export const NIGERIAN_STATES = [
  ["abia","Abia","Umuahia","South East"],["adamawa","Adamawa","Yola","North East"],
  ["akwa-ibom","Akwa Ibom","Uyo","South South"],["anambra","Anambra","Awka","South East"],
  ["bauchi","Bauchi","Bauchi","North East"],["bayelsa","Bayelsa","Yenagoa","South South"],
  ["benue","Benue","Makurdi","North Central"],["borno","Borno","Maiduguri","North East"],
  ["cross-river","Cross River","Calabar","South South"],["delta","Delta","Asaba","South South"],
  ["ebonyi","Ebonyi","Abakaliki","South East"],["edo","Edo","Benin City","South South"],
  ["ekiti","Ekiti","Ado-Ekiti","South West"],["enugu","Enugu","Enugu","South East"],
  ["gombe","Gombe","Gombe","North East"],["imo","Imo","Owerri","South East"],
  ["jigawa","Jigawa","Dutse","North West"],["kaduna","Kaduna","Kaduna","North West"],
  ["kano","Kano","Kano","North West"],["katsina","Katsina","Katsina","North West"],
  ["kebbi","Kebbi","Birnin Kebbi","North West"],["kogi","Kogi","Lokoja","North Central"],
  ["kwara","Kwara","Ilorin","North Central"],["lagos","Lagos","Lagos","South West"],
  ["nasarawa","Nasarawa","Lafia","North Central"],["niger","Niger","Minna","North Central"],
  ["ogun","Ogun","Abeokuta","South West"],["ondo","Ondo","Akure","South West"],
  ["osun","Osun","Osogbo","South West"],["oyo","Oyo","Ibadan","South West"],
  ["plateau","Plateau","Jos","North Central"],["rivers","Rivers","Port Harcourt","South South"],
  ["sokoto","Sokoto","Sokoto","North West"],["taraba","Taraba","Jalingo","North East"],
  ["yobe","Yobe","Damaturu","North East"],["zamfara","Zamfara","Gusau","North West"],
  ["fct","Federal Capital Territory","Abuja","North Central"]
].map(([id,name,capital,region])=>({id,name,capital,region,locations:[]}));

export const WEB3_CONCEPTS = [
  "digital-ownership","verifiable-records","decentralized-identity","portable-credentials",
  "agriculture-traceability","commerce-payments","health-data-rights","smart-contracts",
  "public-records","financial-inclusion","creative-rights","professional-credentials",
  "community-governance","open-source-infrastructure","privacy-and-sovereignty",
  "decentralized-physical-infrastructure","tokenization","verifiable-ai","security-and-limits"
];

export const NPC_PROFILES = {
  amaka: { id:"amaka", name:"Amaka", role:"market trader", personality:["practical","witty","skeptical"], voice:"pcm", wants:["prove where her shea butter came from","avoid fake supplier claims"], beliefs:["trust is earned face to face"], interests:["trade","family","reputation"] },
  musa: { id:"musa", name:"Musa", role:"smallholder farmer", personality:["patient","observant","resourceful"], voice:"pcm", wants:["show buyers his produce history","get paid fairly"], beliefs:["paperwork should not cost more than the crop"], interests:["farming","weather","cooperatives"] },
  zainab: { id:"zainab", name:"Zainab", role:"student and designer", personality:["curious","ambitious","direct"], voice:"en", wants:["prove her skills to employers","protect her creative work"], beliefs:["talent should travel beyond one city"], interests:["design","school","music"] },
  chidi: { id:"chidi", name:"Chidi", role:"motor-park mechanic", personality:["funny","resourceful","distrustful of hype"], voice:"pcm", wants:["keep a reliable repair history","find more customers"], beliefs:["if e no solve real problem, na noise"], interests:["cars","football","business"] },
  halima: { id:"halima", name:"Halima", role:"community health worker", personality:["calm","careful","empathetic"], voice:"en", wants:["help patients carry records between clinics safely"], beliefs:["privacy matters as much as access"], interests:["care","community","education"] },
  tayo: { id:"tayo", name:"Tayo", role:"independent musician", personality:["expressive","proud","skeptical"], voice:"pcm", wants:["get credited when his music is reused"], beliefs:["exposure no be payment"], interests:["music","ownership","collaboration"] }
};

export const STARTER_ENCOUNTERS = [
  {
    id:"market-origin-check", kind:"social", locationTags:["market","stall"], npcId:"amaka",
    title:"The supplier nobody can verify", concept:"agriculture-traceability", weight:5,
    prerequisites:{ minExploreScore:35, minTravelMeters:100, completedAny:[] },
    opening:{ speaker:"amaka", text:"This supplier says the shea butter came straight from a women’s cooperative. Fine story. But how I go check am?" },
    choices:[
      { id:"ask-evidence", label:"Ask what proof the cooperative can share", reply:"Exactly. A record that buyers and the cooperative can both check would help. But somebody still has to enter honest information.", effect:{ curiosity:1 } },
      { id:"trust-label", label:"If the label looks official, trust it", reply:"That one fit fool person. A fancy label no prove where anything came from.", effect:{ trust: -1 } },
      { id:"explain-records", label:"Suggest a shared, verifiable supply record", reply:"That could make changes easier to spot. Still, it cannot magically prove the first person told the truth.", conceptHint:"verifiable-records", effect:{ curiosity:1 } }
    ],
    followUps:[
      { id:"who-enters-data", label:"Who puts the information there?", text:"The cooperative, transporter or inspector could submit records. The system needs checks and consequences for lies." },
      { id:"what-if-wrong", label:"What if the record starts wrong?", text:"A blockchain can make later edits visible; it cannot guarantee the original entry was honest." }
    ],
    ending:"Amaka asks you to help carry a sample to the cooperative office. The road is busy, and the market is still open.",
    reward:{ reputation:8, kit:12, item:"sealed-shea-sample" },
    nextActivity:["deliver-item","explore-market","avoid-traffic","meet-neighbor"]
  },
  {
    id:"mechanic-repair-history", kind:"side", locationTags:["motor-park","workshop"], npcId:"chidi",
    title:"The repair that disappeared", concept:"portable-credentials", weight:4,
    prerequisites:{ minExploreScore:55, minTravelMeters:180, completedAny:[] },
    opening:{ speaker:"chidi", text:"Customer says I never fixed his engine. I get the parts receipt, but the old workshop book don soak. How I fit prove the work?" },
    choices:[
      { id:"digital-copy", label:"Keep a digital copy and share it with permission", reply:"Better than one soggy book. I still need the customer to trust the person who wrote it.", effect:{ curiosity:1 } },
      { id:"public-everything", label:"Put every customer detail on a public chain", reply:"Ah ah. Customer phone number and repair history no be everybody business. Privacy still matter.", effect:{ trust:-1 } },
      { id:"signed-receipt", label:"Use a verifiable receipt with only necessary details", reply:"That sounds more useful. I can prove the job happened without exposing everything about the customer.", conceptHint:"verifiable-records", effect:{ curiosity:1 } }
    ],
    followUps:[{id:"offline",label:"What if the customer has no internet?",text:"The record should have an offline-friendly way to verify later. A good system has to fit the place it serves."}],
    ending:"Chidi asks you to collect a spare part from the other side of the park.",
    reward:{ reputation:6, kit:10, item:"repair-part" },
    nextActivity:["deliver-item","walk-neighborhood","help-stranded-person"]
  },
  {
    id:"music-credit", kind:"ambient", locationTags:["music-shop","junction"], npcId:"tayo",
    title:"Whose beat is it?", concept:"creative-rights", weight:3,
    prerequisites:{ minExploreScore:80, minTravelMeters:260, completedAny:[] },
    opening:{ speaker:"tayo", text:"I hear my beat for another artist’s advert. My name no dey anywhere. If a file get a record, does that mean the record can prove who created it?" },
    choices:[
      { id:"hash-is-proof", label:"A blockchain record proves the creator automatically", reply:"Not automatically. A timestamp can support a claim, but it cannot settle every ownership dispute by itself.", effect:{ trust:-1 } },
      { id:"evidence-trail", label:"It can preserve a timestamped claim and evidence trail", reply:"That’s more honest. Agreements, local law and the actual evidence still matter.", conceptHint:"creative-rights", effect:{ curiosity:1 } },
      { id:"ignore", label:"Tell him to forget it and make another song", reply:"Easy to say when it’s not your work being used.", effect:{ trust:-1 } }
    ],
    followUps:[{id:"royalties",label:"Can smart contracts split royalties?",text:"They can automate agreed splits when the right inputs and agreements exist. They cannot resolve every dispute or guarantee someone pays."}],
    ending:"Tayo invites you to follow him to a small rehearsal spot—unless you have somewhere else to explore.",
    reward:{ reputation:5, kit:8 },
    nextActivity:["explore-junction","find-rehearsal","free-roam"]
  }
];

export const FREE_ROAM_ACTIVITIES = [
  {id:"deliver-item",label:"Make a delivery",type:"errand",minutes:2, reward:{kit:8}},
  {id:"explore-market",label:"Explore the market",type:"exploration",meters:80,reward:{reputation:2}},
  {id:"avoid-traffic",label:"Cross the busy road safely",type:"hazard",reward:{kit:5}},
  {id:"meet-neighbor",label:"Meet someone on the street",type:"social",reward:{reputation:2}},
  {id:"walk-neighborhood",label:"Discover a new street",type:"exploration",meters:120,reward:{reputation:3}},
  {id:"help-stranded-person",label:"Help a stranded resident",type:"event",reward:{kit:7,reputation:3}},
  {id:"find-rehearsal",label:"Find the rehearsal spot",type:"discovery",reward:{reputation:3}},
  {id:"free-roam",label:"Keep exploring",type:"free-roam",reward:{}}
];

export function getState(id) { return NIGERIAN_STATES.find(s => s.id === id) || null; }
export function getNpc(id) { return NPC_PROFILES[id] || null; }
export function getEncounter(id) { return STARTER_ENCOUNTERS.find(e => e.id === id) || null; }
