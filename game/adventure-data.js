/**
 * KitCity open-world content registry.
 * Content lives here instead of being embedded in engine control flow.
 * City/location content can be added without changing movement or rendering.
 */
import { NIGERIAN_STATES, NIGERIAN_TERRITORIES, getState, getTerritory } from "./world-registry.js";
export { NIGERIAN_STATES, NIGERIAN_TERRITORIES, getState, getTerritory };


export const SOCIAL_ADVENTURE_NPCS = [
 {id:"trader-spill",npcProfileId:"mama-kemi",dialogueId:"trader-spill",name:"Mama Kemi",role:"Market trader",color:"#C7457E",look:"woman",spot:"a",sign:"Help pick up the oranges",kind:"activity",major:false,reward:{xp:8,ngn:35,item:"market-kindness"},ageRange:"40s-60s",economicContext:"independent market trader; daily sales and stock at risk",technicalFluency:"mobile user, time-constrained",stance:"practical and skeptical"},
 {id:"driver-directions",npcProfileId:"bode-driver",dialogueId:"driver-directions",name:"Bode",role:"Commercial driver",color:"#2D6FB3",look:"guy",spot:"c",sign:"Driver needs directions",kind:"activity",major:false,reward:{xp:10,ngn:25,item:"helpful-neighbour"},ageRange:"30s-50s",economicContext:"commercial transport and daily route income",technicalFluency:"practical phone user",stance:"direct and community-minded"},
 {id:"student-directions",npcProfileId:"tomi-student",dialogueId:"student-directions",name:"Tomi",role:"Student and aspiring designer",color:"#0B7A43",look:"woman",spot:"e",sign:"Student looking for campus",kind:"activity",major:false,reward:{xp:8,ngn:20,item:"campus-helper"},ageRange:"late teens-20s",economicContext:"student with early-career ambitions",technicalFluency:"digitally curious",stance:"curious and ambitious"},
 {id:"wrong-delivery",npcProfileId:"sani-rider",dialogueId:"wrong-delivery",name:"Sani",role:"Delivery rider",color:"#E4572E",look:"man",spot:"g",sign:"Delivery at the wrong address",kind:"activity",major:false,reward:{xp:12,ngn:30,item:"trusted-runner"},ageRange:"20s-40s",economicContext:"delivery work with time and fuel pressure",technicalFluency:"mobile-first",stance:"resourceful and alert"},
 {id:"lost-keys",npcProfileId:"aunty-bose",dialogueId:"lost-keys",name:"Aunty Bose",role:"Retired seamstress and resident",color:"#8C6AC8",look:"elder",spot:"i",sign:"Lost keys nearby",kind:"activity",major:false,reward:{xp:10,ngn:20,item:"found-keys"},ageRange:"60s-70s",economicContext:"retired craft worker and neighborhood resident",technicalFluency:"varies; prefers clear practical help",stance:"warm but independent"},
 {id:"street-challenge",npcProfileId:"kunle-fan",dialogueId:"street-challenge",name:"Kunle",role:"Local football fan",color:"#D28A20",look:"guy",spot:"j",sign:"Quick street challenge",kind:"challenge",major:false,reward:{xp:6,ngn:15,item:"street-challenge"},ageRange:"20s-30s",economicContext:"local resident and sports enthusiast",technicalFluency:"not assumed",stance:"playful and competitive"},
 {id:"coop-record",npcProfileId:"musa-farmer",dialogueId:"coop-record",name:"Musa",role:"Smallholder farmer",color:"#0B7A43",look:"man",spot:"b",sign:"Farmer has a question",kind:"education",major:true,reward:{xp:15,ngn:30,item:"supply-chain-note"},ageRange:"30s-50s",economicContext:"smallholder livelihood and cooperative trade",technicalFluency:"practical; values local evidence",stance:"skeptical of costly promises"}
];

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

export function getNpc(id) { return NPC_PROFILES[id] || null; }
export function getEncounter(id) { return STARTER_ENCOUNTERS.find(e => e.id === id) || null; }
