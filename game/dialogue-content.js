import { PROTOTYPE_MISSIONS } from "./prototype-missions.js";
import { EDUCATIONAL_MISSIONS } from "./educational-content.js";

/**
 * Authored dialogue pack. Keep each NPC turn compact and specific to their work,
 * priorities, personality and existing understanding. No network or AI service required.
 * Add professions, locations and educational missions by registering more trees here.
 */
export const KITCITY_DIALOGUES = [
  {
    id:"trader-spill", npcId:"mama-kemi", npcName:"Mama Kemi", role:"Market trader", missionId:"market-kindness",
    conceptTags:["community-care","commerce-payments"], start:"opening", ending:"Mama Kemi remembers you helped her.",
    nodes:{
      opening:{text:"Ah, see my oranges! Basket don turn over. Help me gather them before danfo scatter everything.",returningText:"My helpful person don return! Market still dey lively. Wetin bring you around?",choices:[
        {id:"help",label:"Help her gather the oranges",next:"thanks",effects:{trust:1,flags:{helpedMarketTrader:true}}},
        {id:"ask-source",label:"Ask where she bought them",next:"busy-trader",effects:{flags:{askedAboutProduce:true}}},
        {id:"offer-practical-tip",label:"Move the basket away from traffic first",next:"practical",effects:{trust:1}}
      ]},
      thanks:{text:"You try, my child. For this market, small help fit save person a whole day’s profit.",choices:[
        {id:"ask-business",label:"How hard is it to keep track of sales?",next:"sales",effects:{knowledge:["small-business-records"]}},
        {id:"end",label:"No wahala. I’ll let you work",end:true,completeConversation:true,completeMission:"market-kindness",effects:{trust:1}}
      ]},
      "busy-trader":{text:"Na my supplier bring them. I need finish sorting this mess first; customers no dey wait.",choices:[
        {id:"help-anyway",label:"Fair. Let’s clear the road first",next:"thanks",effects:{trust:1}},
        {id:"push-for-proof",label:"A supplier claim should have evidence",next:"skeptical",effects:{trust:-1}}
      ]},
      practical:{text:"Correct thinking. If danfo crush these, na my money go disappear. Help me shift the basket small.",choices:[
        {id:"help",label:"Help her move it",next:"thanks",effects:{trust:1}},
        {id:"ask-records",label:"Could a digital record help your business?",next:"sales"}
      ]},
      sales:{text:"Maybe for orders and payments. But if network disappear or the app too hard, I no fit use am during rush hour.",choices:[
        {id:"offline-first",label:"It should work simply and handle weak network",next:"sales-end",effects:{knowledge:["offline-first-design"]}},
        {id:"promise-everything",label:"Technology will solve all of that",next:"skeptical",effects:{trust:-1}}
      ]},
      skeptical:{text:"No sell me dream, abeg. Show me something that works when customers are waiting.",choices:[
        {id:"acknowledge-limit",label:"You’re right; test it during a busy market day",next:"sales-end",effects:{trust:1}},
        {id:"leave",label:"Fair enough. I’ll leave you to it",end:true,completeConversation:true,completeMission:"market-kindness"}
      ]},
      "sales-end":{text:"That one I fit consider. Useful thing must fit real market life, not just look fine on phone.",choices:[
        {id:"finish",label:"I’ll keep that in mind",end:true,completeConversation:true,completeMission:"market-kindness",effects:{trust:1}},
        {id:"followup",label:"Let’s explore a simple sales-record idea",next:"followup",unlockFollowUps:["market-records"] ,effects:{flags:{marketRecordsFollowUp:true}}}
      ]},
      followup:{text:"Bring me a simple example next time—one order, who paid, and what we still need to verify.",choices:[
        {id:"complete-followup",label:"I’ll come back with an example",end:true,completeConversation:true,completeMission:"market-kindness",unlockFollowUps:["market-records"]}
      ]}
    }
  },
  {
    id:"driver-directions", npcId:"bode-driver", npcName:"Bode", role:"Commercial driver", missionId:"helpful-neighbour",
    conceptTags:["navigation","community-care"], start:"opening",
    nodes:{
      opening:{text:"Oga, I dey find the community clinic. This junction don confuse me twice. You sabi the way?",returningText:"My navigator don show! You remember that clinic road?",choices:[
        {id:"ask-landmark",label:"Ask what landmark he last saw",next:"landmark",effects:{trust:1}},
        {id:"give-quick-directions",label:"Point him toward the clinic road",next:"directions"},
        {id:"check-sign",label:"Suggest checking the street sign together",next:"sign"}
      ]},
      landmark:{text:"I pass one blue kiosk and hear the bus park horn. That help?",choices:[
        {id:"walk-with-him",label:"Walk with him to the next junction",next:"thanks",effects:{trust:1}},
        {id:"use-landmarks",label:"Use the kiosk as the turning point",next:"directions"}
      ]},
      directions:{text:"I fit try that road. But clinic entrances sometimes hide behind shops—what landmark should I watch for?",choices:[
        {id:"clinic-sign",label:"Look for the clinic sign and ask at the gate",next:"thanks"},
        {id:"pretend-sure",label:"Tell him you’re certain without checking",next:"challenge",effects:{trust:-1}}
      ]},
      sign:{text:"Good. Signboard no always clear, but at least we fit compare it with what people say.",choices:[
        {id:"verify",label:"Confirm the road with a nearby shopkeeper",next:"thanks",effects:{knowledge:["verify-directions"]}},
        {id:"rush",label:"Just pick the first road",next:"challenge",effects:{trust:-1}}
      ]},
      challenge:{text:"You sure? Wrong turn go cost fuel and passenger time. Better make we verify before I move.",choices:[
        {id:"admit",label:"You’re right; let’s verify first",next:"thanks",effects:{trust:1}},
        {id:"leave",label:"I’ll let you decide",end:true,completeConversation:true,completeMission:"helpful-neighbour"}
      ]},
      thanks:{text:"Sharp. Directions make more sense when you check landmarks instead of guessing. Safe journey to both of us.",choices:[
        {id:"finish",label:"Safe driving, Bode",end:true,completeConversation:true,completeMission:"helpful-neighbour",effects:{trust:1}},
        {id:"ask-more",label:"How do drivers share road updates?",next:"followup",unlockFollowUps:["driver-route-sharing"]}
      ]},
      followup:{text:"Drivers share warnings by calls and park talk. A digital map helps only if updates are fresh and people can trust the source.",choices:[
        {id:"end",label:"Good point. I’ll keep exploring",end:true,completeConversation:true,completeMission:"helpful-neighbour",unlockFollowUps:["driver-route-sharing"]}
      ]}
    }
  },
  {
    id:"student-directions", npcId:"tomi-student", npcName:"Tomi", role:"Student and aspiring designer", missionId:"campus-helper",
    conceptTags:["portable-credentials","digital-ownership"], start:"opening",
    nodes:{
      opening:{text:"Please, I’m looking for the school gate. First week here and I’ve passed this junction twice.",returningText:"Hey, you helped me find campus last time. I’m settling in now!",choices:[
        {id:"walk",label:"Walk with her and look for the sign",next:"thanks",effects:{trust:1}},
        {id:"clear-directions",label:"Give clear directions using landmarks",next:"landmark"},
        {id:"ask-her-map",label:"Ask what she has tried already",next:"tried"}
      ]},
      tried:{text:"I followed a pin on my phone, but the gate moved to the other side after roadworks.",choices:[
        {id:"verify-local",label:"Compare the pin with a current local sign",next:"thanks",effects:{knowledge:["verify-location-data"]}},
        {id:"trust-pin",label:"The map pin must be right",next:"challenge",effects:{trust:-1}}
      ]},
      landmark:{text:"A blue kiosk and the mural? I can remember those. Is the gate before or after them?",choices:[
        {id:"before",label:"After the mural, then turn by the kiosk",next:"thanks"},
        {id:"confirm",label:"Let’s check the sign to be sure",next:"thanks",effects:{trust:1}}
      ]},
      challenge:{text:"Maps can be outdated too. I don’t want to miss my first lecture because an app looked confident.",choices:[
        {id:"acknowledge",label:"You’re right; verify important details",next:"thanks",effects:{trust:1}},
        {id:"finish",label:"Fair. Ask at the gate if unsure",end:true,completeConversation:true,completeMission:"campus-helper"}
      ]},
      thanks:{text:"Thanks! I’ll save the landmark, but I’ll still check signs when the route might have changed.",choices:[
        {id:"finish",label:"Good luck with your first week",end:true,completeConversation:true,completeMission:"campus-helper",effects:{trust:1}},
        {id:"ask-portfolio",label:"How will you prove your design skills?",next:"portfolio",unlockFollowUps:["student-portfolio"]}
      ]},
      portfolio:{text:"A portfolio helps, but I also need proof of which work is mine and what I actually contributed.",choices:[
        {id:"verifiable-proof",label:"Keep dated work samples and clear contribution notes",next:"portfolio-end",effects:{knowledge:["portable-credentials"]}},
        {id:"public-record",label:"Put every personal detail online",next:"privacy",effects:{trust:-1}}
      ]},
      privacy:{text:"I want employers to verify my work, not get my private messages or every detail of my life.",choices:[
        {id:"respect-privacy",label:"Share only evidence relevant to the job",next:"portfolio-end",effects:{trust:1,knowledge:["privacy-by-design"]}}
      ]},
      "portfolio-end":{text:"That feels more useful than a flashy badge. I’ll build a portfolio with evidence people can actually review.",choices:[
        {id:"finish",label:"You’ve got a plan now",end:true,completeConversation:true,completeMission:"campus-helper",unlockFollowUps:["student-portfolio"]}
      ]}
    }
  },
  {
    id:"wrong-delivery", npcId:"sani-rider", npcName:"Sani", role:"Delivery rider", missionId:"trusted-runner",
    conceptTags:["decentralized-identity","verifiable-records"], start:"opening",
    nodes:{
      opening:{text:"This parcel address no match the shop. Customer dey call, but I no wan hand am to the wrong person.",returningText:"I’ve got another delivery today. Let’s confirm this address before I drop it.",choices:[
        {id:"read-signs",label:"Read the street signs together",next:"signs",effects:{trust:1}},
        {id:"call-customer",label:"Call the customer to verify",next:"verify"},
        {id:"leave-parcel",label:"Leave it with whoever is nearby",next:"objection",effects:{trust:-2}}
      ]},
      signs:{text:"This street name close, but the house number no match. Small difference fit send me to another compound.",choices:[
        {id:"call",label:"Confirm the house number with the customer",next:"verify",effects:{knowledge:["identity-verification"]}},
        {id:"guess",label:"Guess which building looks right",next:"objection",effects:{trust:-1}}
      ]},
      verify:{text:"Customer confirms the blue gate and number 14. I’ll check both before handing over. That protects them and me.",choices:[
        {id:"finish",label:"Good call—verify before handing over",end:true,completeConversation:true,completeMission:"trusted-runner",effects:{trust:1}},
        {id:"ask-record",label:"Could a delivery record help if there’s a dispute?",next:"record",unlockFollowUps:["delivery-proof"]}
      ]},
      objection:{text:"If I leave this with a stranger, the real customer may lose the parcel. Fast no mean correct.",choices:[
        {id:"correct-course",label:"You’re right; let’s verify the address",next:"verify",effects:{trust:1}},
        {id:"end",label:"I’ll leave you to decide",end:true,completeConversation:true,completeMission:"trusted-runner"}
      ]},
      record:{text:"A delivery receipt can show when it was handed over, but it should not expose the customer’s phone or address to everyone.",choices:[
        {id:"privacy",label:"Keep proof private and share it only when needed",next:"record-end",effects:{knowledge:["privacy-by-design","verifiable-records"]}},
        {id:"public",label:"Put all customer details on a public ledger",next:"privacy-objection",effects:{trust:-1}}
      ]},
      "privacy-objection":{text:"That would put customers at risk. Proof should help resolve a dispute, not publish their private details.",choices:[
        {id:"agree",label:"Agreed. Only share what is necessary",next:"record-end",effects:{trust:1}}
      ]},
      "record-end":{text:"That’s sensible. I’ll keep a clear handover record and protect the customer’s details.",choices:[
        {id:"finish",label:"Safe deliveries, Sani",end:true,completeConversation:true,completeMission:"trusted-runner",unlockFollowUps:["delivery-proof"]}
      ]}
    }
  },
  {
    id:"lost-keys", npcId:"aunty-bose", npcName:"Aunty Bose", role:"Retired seamstress and resident", missionId:"found-keys",
    conceptTags:["community-care"], start:"opening",
    nodes:{
      opening:{text:"My keys fall between the bus stop and this kiosk. I don check my bag tire. You fit help me remember where I stop?",returningText:"My dear, you came back! I found my spare key, but the missing one still dey worry me.",choices:[
        {id:"retrace",label:"Help her retrace the route",next:"memory",effects:{trust:1}},
        {id:"search",label:"Search the path together",next:"search"},
        {id:"dismiss",label:"Maybe someone will find them",next:"concern",effects:{trust:-1}}
      ]},
      memory:{text:"I stopped near the blue kiosk to greet my neighbour. Let’s check there first.",choices:[
        {id:"search-kiosk",label:"Check around the kiosk",next:"found",effects:{flags:{helpedFindKeys:true}}},
        {id:"ask-neighbour",label:"Ask the neighbour if they saw them",next:"neighbour"}
      ]},
      search:{text:"Let’s search the path in small sections so we don’t walk past them.",choices:[
        {id:"kiosk",label:"Start at the kiosk",next:"found",effects:{flags:{helpedFindKeys:true}}},
        {id:"retrace",label:"First remember every place she stopped",next:"memory"}
      ]},
      concern:{text:"Those keys open my room. I no want them to enter wrong hand. Make we at least search the likely places.",choices:[
        {id:"help",label:"You’re right. Let’s search together",next:"search",effects:{trust:1}},
        {id:"leave",label:"I’m sorry, I have to go",end:true,completeConversation:true}
      ]},
      neighbour:{text:"My neighbour saw something shine beside the kiosk. We should check there, then I’ll decide whether to change the lock.",choices:[
        {id:"check",label:"Let’s check beside the kiosk",next:"found",effects:{flags:{helpedFindKeys:true}}}
      ]},
      found:{text:"Ehen! Na here the keys dey. Thank you for not passing me by. I’ll keep them in a safer pocket next time.",choices:[
        {id:"finish",label:"Glad we found them",end:true,completeConversation:true,completeMission:"found-keys",effects:{trust:1}},
        {id:"safety",label:"A spare key with a trusted neighbour can help",next:"safety"}
      ]},
      safety:{text:"Maybe, but only somebody I trust. Convenience no worth making my home less safe.",choices:[
        {id:"finish",label:"That makes sense",end:true,completeConversation:true,completeMission:"found-keys",effects:{knowledge:["personal-security"],trust:1}}
      ]}
    }
  },
  {
    id:"street-challenge", npcId:"kunle-fan", npcName:"Kunle", role:"Local football fan", missionId:"street-challenge",
    conceptTags:["street-safety"], start:"opening",
    nodes:{
      opening:{text:"Small challenge? Reach that painted junction marker and come back. No need to run into traffic o!",returningText:"You ready for another challenge, or you dey explore today?",choices:[
        {id:"accept",label:"I’m in—careful movement only",next:"win",effects:{trust:1}},
        {id:"decline",label:"I’ll pass and keep exploring",next:"respect"},
        {id:"ask-rule",label:"What counts as a safe route?",next:"rules"}
      ]},
      win:{text:"You do am! Sharp movement, but you watched the road. Respect.",choices:[
        {id:"finish",label:"That was fun",end:true,completeConversation:true,completeMission:"street-challenge",effects:{trust:1}},
        {id:"again",label:"I’ll try another route later",end:true,completeConversation:true,completeMission:"street-challenge",unlockFollowUps:["street-challenge-2"]}
      ]},
      respect:{text:"No wahala. City no be race. You fit enjoy the streets without proving anything to me.",choices:[
        {id:"finish",label:"I’ll keep exploring",end:true,completeConversation:true,completeMission:"street-challenge"}
      ]},
      rules:{text:"Use the pavement, check both directions, and don’t dash between moving cars just to beat a timer.",choices:[
        {id:"accept",label:"Got it. I’ll take the safe route",next:"win",effects:{knowledge:["street-safety"]}},
        {id:"decline",label:"I’ll skip the challenge",next:"respect"}
      ]}
    }
  },
  {
    id:"coop-record", npcId:"musa-farmer", npcName:"Musa", role:"Smallholder farmer", missionId:"supply-chain-note",
    conceptTags:["agriculture-traceability","verifiable-records","privacy-and-sovereignty"], start:"opening",
    nodes:{
      opening:{text:"I sell produce to buyers in different towns. Sometimes dem argue about where a bag came from. How person fit keep a record both sides can check?",returningText:"You’re back. I spoke with the cooperative about recording where each bag comes from, but we still have questions.",choices:[
        {id:"shared-record",label:"Keep a shared record with evidence",next:"reaction",effects:{trust:1,knowledge:["verifiable-records"]}},
        {id:"blockchain-guarantee",label:"A blockchain guarantees the information is true",next:"challenge",effects:{trust:-1}},
        {id:"ask-process",label:"How do you record produce today?",next:"current-process"}
      ]},
      reaction:{text:"That could help track who entered each update. But the first person still has to give honest information.",choices:[
        {id:"who-sees",label:"Ask who should be allowed to see it",next:"access"},
        {id:"wrong-entry",label:"Ask what happens if the first entry is wrong",next:"correction"},
        {id:"finish",label:"Let’s keep the idea practical for the cooperative",end:true,completeConversation:true,completeMission:"supply-chain-note",effects:{trust:1}}
      ]},
      challenge:{text:"I no sure say technology fit stop a person from lying at the beginning. Who checks the produce before the record is made?",choices:[
        {id:"acknowledge",label:"You’re right; physical checks still matter",next:"current-process",effects:{trust:1,knowledge:["oracle-problem"]}},
        {id:"double-down",label:"The technology makes every claim true",next:"skeptical",effects:{trust:-1}}
      ]},
      skeptical:{text:"If the system records a lie neatly, na still lie. We need a person or process to verify the crop and supplier.",choices:[
        {id:"admit-limit",label:"Agreed. Records need trusted checks too",next:"current-process",effects:{trust:1,knowledge:["oracle-problem"]}},
        {id:"end",label:"I’ll think about it and let you work",end:true,completeConversation:true,completeMission:"supply-chain-note"}
      ]},
      "current-process":{text:"We write the harvest date in a notebook. The buyer sometimes wants a cooperative stamp, and transport details go missing.",choices:[
        {id:"combine-evidence",label:"Keep the notebook and add checked transport records",next:"reaction",effects:{knowledge:["agriculture-traceability"]}},
        {id:"replace-everything",label:"Throw away the old process and use an app only",next:"practical-objection",effects:{trust:-1}}
      ]},
      "practical-objection":{text:"What if the network goes down or an older farmer cannot use the app? We cannot lose the harvest record.",choices:[
        {id:"offline-first",label:"Keep an offline option and sync when possible",next:"reaction",effects:{trust:1,knowledge:["offline-first-design"]}},
        {id:"listen",label:"You’re right. Let’s design around the cooperative",next:"reaction",effects:{trust:1}}
      ]},
      access:{text:"Buyers need origin and handling details. They do not need every farmer’s phone number or family information.",choices:[
        {id:"minimum-data",label:"Share only the details needed to verify the crop",next:"access-end",effects:{knowledge:["privacy-by-design"]}},
        {id:"public-all",label:"Put all farmer information in public",next:"privacy-objection",effects:{trust:-1}}
      ]},
      "privacy-objection":{text:"No. A crop record should not expose a farmer’s private details to strangers.",choices:[
        {id:"agree",label:"Agreed—keep personal data private",next:"access-end",effects:{trust:1,knowledge:["privacy-by-design"]}}
      ]},
      "access-end":{text:"That sounds fair. The buyer can check the crop trail without seeing everything about the farmer.",choices:[
        {id:"finish",label:"Let’s keep that as a design rule",end:true,completeConversation:true,completeMission:"supply-chain-note",effects:{trust:1}}
      ]},
      correction:{text:"A wrong entry needs a correction trail: keep the history, explain the fix, and let people challenge it.",choices:[
        {id:"agree",label:"Make corrections visible and accountable",next:"reaction",effects:{knowledge:["verifiable-records"]}},
        {id:"erase",label:"Secretly delete any disputed record",next:"correction-objection",effects:{trust:-1}}
      ]},
      "correction-objection":{text:"If someone quietly changes the record, buyers cannot tell what happened. The correction should be visible and explained.",choices:[
        {id:"finish",label:"That’s a useful safeguard",end:true,completeConversation:true,completeMission:"supply-chain-note",effects:{trust:1}}
      ]}
    }
  }
];

export const DIALOGUE_FOLLOW_UPS = {
  "market-records": { title:"Sketch a simple market sales record", requires:["market-kindness"], conceptTags:["commerce-payments"] },
  "driver-route-sharing": { title:"Explore trusted road updates", requires:["helpful-neighbour"], conceptTags:["community-information"] },
  "student-portfolio": { title:"Build a verifiable portfolio", requires:["campus-helper"], conceptTags:["portable-credentials"] },
  "delivery-proof": { title:"Design a privacy-aware delivery receipt", requires:["trusted-runner"], conceptTags:["verifiable-records","privacy-and-sovereignty"] },
  "street-challenge-2": { title:"Try another safe route", requires:["street-challenge"], conceptTags:["street-safety"] }
};

export function getDialogue(id) {
  return KITCITY_DIALOGUES.find(dialogue => dialogue.id === id) ||
    EDUCATIONAL_MISSIONS.find(dialogue => dialogue.id === id) || null;
}
