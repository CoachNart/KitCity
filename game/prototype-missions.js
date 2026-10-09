/**
 * Eight playable prototype missions for the existing Lagos free-roam scene.
 * The NPCs and activity props are encounter overlays, not claims that separate
 * campus, farm, clinic, studio or office maps have been built.
 */
const flag = (kind, id) => "prototype:" + kind + ":" + id;

const missionRows = [
  {
    id:"kitcity-market-ledger", conceptId:"commerce-payments", title:"The Market Woman",
    npcId:"amaka-market-trader", npcName:"Amaka", role:"Market trader",
    personality:"Fast-thinking, practical, dry humour",
    ageRange:"30s-40s", economicContext:"independent produce trader managing stock and daily cash flow",
    technicalFluency:"comfortable with transfers, impatient with complicated apps",
    stance:"pragmatic; asks who pays and what happens when the network fails",
    spot:"d", color:"#C7457E", look:"woman", sign:"Market records · Talk",
    reward:{xp:35,ngn:180,item:"supplier-receipt-collectible"},
    opening:"My brother, make you shift small. You wan buy something or na just sightseeing you come do?",
    branches:[
      {id:"records",label:"Ask how she tracks payments",text:"Cash, transfers, supplier credit — I check alerts, then write some things for my book. When two orders look alike, wahala fit start."},
      {id:"record-example",label:"Explain a simple traceable record",text:"If each delivery has an order number, receipt and a clear record of who confirmed it, we fit trace the story. But person still has to enter correct details."},
      {id:"honest",label:"Admit a blockchain app may not help",text:"I like that answer. If normal notebook or bank statement does the job cheaper, why give me extra stress? Any tool must be easy and work for my customers."}
    ],
    brief:"A supplier says one delivery receipt went missing. Help me find it and match the order number before we start talking big technology.",
    progress:"I need the supplier receipt with the matching order number. Check the marked spot away from the stall, then come tell me what you found.",
    reminder:"Look for the supplier delivery receipt. A matching order number helps connect the paper to the right delivery; it does not prove every claim is true.",
    returnText:"You found the paper? Make we check whether the supplier name and order number agree.",
    debrief:"Good. A record can make a transaction easier to trace when people enter accurate details and can actually use the system.",
    limitation:"And remember: no record system automatically prevents fraud, replaces a bank, or fixes a false entry at the source.",
    wrapText:"That is fair. I can use a clear receipt and reconciliation process; blockchain is only worth considering if several parties need a shared record.",
    objectives:[
      {id:"receipt",label:"Supplier delivery receipt",instruction:"Inspect the misplaced receipt and choose how to verify it.",position:{x:28,z:-62},color:"#F6B21A",shape:"paper",choices:[
        {id:"match-order",label:"Match the order number",feedback:"You match the receipt to the order reference before accepting it."},
        {id:"trust-name",label:"Trust the supplier name alone",feedback:"A name alone is weak evidence. You note that the order reference still needs checking."}
      ]}
    ]
  },
  {
    id:"kitcity-student-portfolio", conceptId:"portable-credentials", title:"The University Student",
    npcId:"tomi-final-year-student", npcName:"Tomi", role:"Final-year student and aspiring developer",
    personality:"Ambitious, tired of gatekeeping, quick to challenge empty promises",
    ageRange:"early 20s", economicContext:"final-year student with limited time and money",
    technicalFluency:"comfortable with online portfolios; learning Web3",
    stance:"hopeful but wary of closed networks and fake opportunities",
    spot:"f", color:"#0B7A43", look:"woman", sign:"Student portfolio · Talk",
    reward:{xp:40,ngn:160,item:"verified-portfolio-badge"},
    opening:"Guy, I don send CV tire. Every application na experience, experience. How person wan get experience when nobody wan give am work?",
    branches:[
      {id:"contributions",label:"Suggest showing real project work",text:"A small working project, readable code and public contributions can show how you solve problems. But reviewers still need to inspect the work, not just count commits."},
      {id:"credentials",label:"Explain verifiable credentials",text:"A school or trusted issuer can give a credential that an employer can check. It helps confirm a claim; it doesn't prove you can do every job."},
      {id:"challenge",label:"Take her challenge seriously",text:"Abeg, all these Web3 opportunities, na who you know before you fit enter? Some spaces are open, some are not. A public profile helps, but it cannot remove unfair hiring or bad actors."}
    ],
    brief:"I saved a small project file before my laptop started acting up. Help me recover the portfolio sample; then we can decide how to present it honestly.",
    progress:"Find my project-file marker. Don't claim the project is finished just because the file exists — the work still has to run and be understood.",
    reminder:"Recover the project file and bring it back here. A portfolio is evidence of work, not a guarantee of employment.",
    returnText:"You got the file? Nice. Now let's talk about what it can actually prove.",
    debrief:"Show the working result, explain your contribution, and let a reviewer inspect it. A credential can verify who issued a qualification, while a project demonstrates applied skill.",
    limitation:"Neither a token nor a public profile guarantees a fair opportunity, a real employer, or competence. Check organizations and protect your personal data.",
    wrapText:"I can build a small demo, document my contribution and verify the issuer. At least I can show something concrete while I keep applying.",
    objectives:[
      {id:"project-file",label:"Recovered project file",instruction:"Inspect the project file and decide what evidence to check next.",position:{x:-40,z:-78},color:"#00A878",shape:"usb",choices:[
        {id:"run-and-document",label:"Run it and document your part",feedback:"You record a reproducible result and explain which parts you built."},
        {id:"claim-all",label:"Claim the whole project",feedback:"That would misrepresent the work. You mark authorship as something to verify before publishing."}
      ]}
    ]
  },
  {
    id:"kitcity-farm-trace", conceptId:"agriculture-traceability", title:"The Farmer's Problem",
    npcId:"musa-cooperative-farmer", npcName:"Musa", role:"Farmer and cooperative member",
    personality:"Observant, patient, evidence-first",
    ageRange:"40s-50s", economicContext:"smallholder farmer facing seasonal risk and buyer disputes",
    technicalFluency:"practical user of phones, paper logs and cooperative witnesses",
    stance:"open to useful records but suspicious of expensive promises",
    spot:"h", color:"#D28A20", look:"man", sign:"Trace the delivery · Talk",
    reward:{xp:45,ngn:200,item:"supply-chain-traceability"},
    opening:"Buyer say this produce no come from our cooperative. We know when we harvest am, but how we go show the journey clearly?",
    branches:[
      {id:"trace",label:"Suggest recording checkpoints",text:"Record who received the produce, when, its batch reference and the condition at each hand-off. If everyone agrees on the process, the trail is more useful."},
      {id:"ask-current",label:"Ask what evidence already exists",text:"We get cooperative book, scale ticket and driver note. Better to connect evidence we already trust than buy a shiny system first."},
      {id:"challenge",label:"Ask what happens if the first entry is false",text:"Good question. If person put wrong information for the record from the beginning, wetin blockchain wan do? It cannot inspect the farm by itself. We need witnesses, checks and a way to correct mistakes honestly."}
    ],
    brief:"Help trace this batch through three hand-off checkpoints. Compare the batch code with the local log and the receiving record at each stop.",
    progress:"Three checkpoints are still marked on the route. Inspect each one and choose which evidence to rely on before returning.",
    reminder:"Visit all three batch checkpoints. A trace is only as reliable as the people, measurements and controls behind its entries.",
    returnText:"How the batch journey go? We need the checkpoints, not just one nice-looking label.",
    debrief:"You connected the batch reference across three hand-offs. That helps locate gaps and disputes when the records are accurate and people follow the process.",
    limitation:"An immutable record can preserve a false claim too. Independent checks, physical inspections and accountability still matter.",
    wrapText:"Make we keep the cooperative log and witness checks. We can consider shared digital records only if buyers and growers can maintain them together.",
    objectives:[
      {id:"checkpoint-collection",label:"Collection checkpoint",instruction:"Check the batch code against the cooperative collection log.",position:{x:-28,z:-192},color:"#E9A23B",shape:"checkpoint",choices:[
        {id:"cooperative-log",label:"Compare the cooperative log",feedback:"The batch code matches the collection log; the record still depends on the log being accurate."},
        {id:"accept-label",label:"Accept the label without checking",feedback:"The label alone is not enough. You flag this checkpoint for verification."}
      ]},
      {id:"checkpoint-transit",label:"Transit checkpoint",instruction:"Review the hand-off record from the transporter.",position:{x:108,z:-142},color:"#E9A23B",shape:"checkpoint",choices:[
        {id:"driver-note",label:"Compare driver note and time",feedback:"The hand-off time and batch reference are compared rather than assumed."},
        {id:"skip-check",label:"Skip the hand-off check",feedback:"You note a missing evidence link that could complicate a buyer dispute."}
      ]},
      {id:"checkpoint-receipt",label:"Buyer receiving checkpoint",instruction:"Check the buyer's receiving note for the same batch.",position:{x:-118,z:20},color:"#E9A23B",shape:"checkpoint",choices:[
        {id:"receiving-note",label:"Match the receiving note",feedback:"The final note closes the trail for this prototype batch."},
        {id:"trust-memory",label:"Rely on memory alone",feedback:"Memory may help, but the receiving note should be checked and retained."}
      ]}
    ]
  },
  {
    id:"kitcity-lawyer-review", conceptId:"smart-contracts", title:"The Lawyer Who Isn't Convinced",
    npcId:"eze-contract-lawyer", npcName:"Barrister Eze", role:"Commercial lawyer",
    personality:"Skeptical, precise, dryly funny",
    ageRange:"40s-50s", economicContext:"small-practice lawyer advising clients who cannot absorb avoidable disputes",
    technicalFluency:"comfortable with digital signatures and evidence; not a protocol evangelist",
    stance:"distinguishes technical execution from legal validity and fairness",
    spot:"k", color:"#8C6AC8", look:"elder", sign:"Contract review · Talk",
    reward:{xp:45,ngn:190,item:"professional-insight"},
    opening:"People keep telling my clients, 'The smart contract handled it.' Fine. Who checked whether the agreement was lawful, fair, or even understood?",
    branches:[
      {id:"execution",label:"Separate code execution from legal enforceability",text:"Code can execute a programmed condition. Whether the agreement is enforceable still depends on facts, consent, applicable law and jurisdiction."},
      {id:"signatures",label:"Ask about digital signatures",text:"A valid digital signature may help establish who approved a document, depending on the method and law. It doesn't make every clause fair or lawful."},
      {id:"challenge",label:"Admit code can execute an unfair deal",text:"Exactly. So if the code executes exactly as written but the agreement itself is unfair, are you telling me the code has solved the problem? No. The code did what it was told; people still owe each other accountability."}
    ],
    brief:"Review three parts of this fictional agreement: the signature evidence, the automated payment rule and the dispute clause. Flag what needs human or legal review.",
    progress:"Inspect all three contract review cards. This is a learning scenario, not legal advice for a real dispute.",
    reminder:"Check the signature record, the payment rule and the dispute clause. Technical proof and legal judgment answer different questions.",
    returnText:"Have you separated what the code did from what the agreement actually means?",
    debrief:"You flagged identity/consent evidence, the programmed trigger and the dispute process. Those checks belong to different layers of a real agreement.",
    limitation:"A digital signature does not prove every fact, automated execution does not establish legal enforceability, and immutable records cannot make an unfair agreement fair.",
    wrapText:"Precisely. Technical execution, evidence, jurisdiction and human accountability must be reviewed separately.",
    objectives:[
      {id:"signature-evidence",label:"Signature evidence",instruction:"Inspect how the fictional agreement records consent.",position:{x:-178,z:-72},color:"#9B83D4",shape:"document",choices:[
        {id:"verify-identity",label:"Check identity and consent process",feedback:"You flag the signing method, identity assurance and evidence of consent for review."},
        {id:"signature-equals-valid",label:"Assume signature means enforceable",feedback:"A signature is not the whole legal analysis. You flag enforceability for human review."}
      ]},
      {id:"payment-rule",label:"Automated payment rule",instruction:"Inspect the condition that triggers payment.",position:{x:-92,z:-32},color:"#9B83D4",shape:"document",choices:[
        {id:"test-trigger",label:"Test the trigger and edge cases",feedback:"You check the condition, failure paths and who can intervene if facts are wrong."},
        {id:"trust-code",label:"Assume code is always fair",feedback:"Correct execution cannot guarantee fair terms. You flag the rule for review."}
      ]},
      {id:"dispute-clause",label:"Dispute and jurisdiction clause",instruction:"Inspect what happens if the parties disagree.",position:{x:-158,z:38},color:"#9B83D4",shape:"document",choices:[
        {id:"review-jurisdiction",label:"Check jurisdiction and remedy",feedback:"You identify the governing law, remedy and dispute process as human/legal questions."},
        {id:"ignore-disputes",label:"Assume the code settles disputes",feedback:"The code cannot decide every legal or factual dispute. You flag the missing process."}
      ]}
    ]
  },
  {
    id:"kitcity-music-rights", conceptId:"creative-rights", title:"The Music Producer",
    npcId:"tayo-independent-producer", npcName:"Tayo", role:"Independent music producer",
    personality:"Creative, collaborative, protective of attribution",
    ageRange:"late 20s-30s", economicContext:"independent producer balancing studio costs, collaborators and uncertain royalties",
    technicalFluency:"comfortable with digital audio tools; learning licensing infrastructure",
    stance:"wants practical credit and permission records, not speculative promises",
    spot:"l", color:"#2D6FB3", look:"guy", sign:"Studio project files · Talk",
    reward:{xp:40,ngn:180,item:"producer-session-stem"},
    opening:"This beat don pass through three hands. Everybody remembers who sent what, until revenue show up and the story change.",
    branches:[
      {id:"provenance",label:"Explain provenance and permission records",text:"We can keep a clear history of who contributed which file and what permission each person gave. That helps coordination, but the record is not the same as a legal ruling on ownership."},
      {id:"licensing",label:"Ask about the actual license",text:"Correct question. Who owns the composition, the recording, the samples? What can each collaborator authorize? We need that agreement before automating shares."},
      {id:"challenge",label:"Answer the unauthorized mint question",text:"If person mint my song wey I no authorize, the blockchain go know say na thief? No. It can show a token was issued, not independently prove the minter had rights."}
    ],
    brief:"Two session stems are missing from the collaboration folder. Recover the stems and note which collaborator supplied each one before discussing revenue splits.",
    progress:"Find both project-stem markers. The task is to reconnect the session files with their contributor notes, not to decide ownership from a token alone.",
    reminder:"Recover both stems and match them to the contributor notes. Keep composition, recording, samples and license permissions distinct.",
    returnText:"You recover the session files? Make sure we know who sent each stem and under what permission.",
    debrief:"The collaboration record is more useful when files, contributor claims and permissions are connected and reviewable.",
    limitation:"A blockchain entry cannot independently prove authorship or grant rights. Licensing, contracts, platform terms and applicable law still matter.",
    wrapText:"Let's agree credits and permissions first, then automate only the parts everyone understands and accepts.",
    objectives:[
      {id:"drum-stem",label:"Drum stem + contributor note",instruction:"Recover the drum stem and choose how to attribute it.",position:{x:-188,z:-164},color:"#42A5F5",shape:"audio",choices:[
        {id:"match-session-note",label:"Match the session note",feedback:"You connect the stem to its supplied contributor note and preserve the source file."},
        {id:"guess-credit",label:"Guess the contributor",feedback:"Guessing can create a rights dispute. You flag attribution as unconfirmed."}
      ]},
      {id:"vocal-stem",label:"Vocal stem + permission note",instruction:"Recover the vocal stem and inspect its permission record.",position:{x:-38,z:154},color:"#42A5F5",shape:"audio",choices:[
        {id:"check-permission",label:"Check the permission note",feedback:"You separate the file's source from permission to use the performance."},
        {id:"mint-first",label:"Publish before asking",feedback:"Publishing first can violate someone's rights. You flag permission as unresolved."}
      ]}
    ]
  },
  {
    id:"kitcity-clinic-schedule", conceptId:"health-data-rights", title:"The Clinic Records Officer",
    npcId:"halima-clinic-records", npcName:"Halima", role:"Clinic records officer",
    personality:"Calm, organized, privacy-first",
    ageRange:"30s-40s", economicContext:"busy clinic team with limited staff and a need to coordinate appointments",
    technicalFluency:"experienced in care workflows; careful with information access",
    stance:"supports useful verification but refuses unnecessary exposure of patient information",
    spot:"m", color:"#008C95", look:"woman", sign:"Clinic schedule · Talk",
    reward:{xp:45,ngn:190,item:"health-infrastructure-badge"},
    opening:"Our appointment book needs tidying, but I will not solve it by letting everybody see patient records. Who needs which information, and why?",
    branches:[
      {id:"controlled-access",label:"Explain controlled access and verification",text:"A system can verify a credential or share a minimum necessary status with permission. That is different from publishing a patient's medical history."},
      {id:"ask-consent",label:"Ask how patients consent",text:"Patients should understand what is shared, with whom and for what purpose. Access needs clear permissions, safeguards and a way to handle mistakes."},
      {id:"challenge",label:"Reject public medical data",text:"You want make everybody see patient record because e dey blockchain? Absolutely not. Sensitive health data should not be posted openly just because a ledger is hard to change."}
    ],
    brief:"Help sort three fictional appointment cards by time and service code. The cards contain no real patient names or diagnoses; do not add identifying details.",
    progress:"Organize all three fictional appointment slots by time. Keep the schedule minimal: no patient names, diagnoses or personal identifiers are needed for this task.",
    reminder:"Check the time and service code on each fictional card. Don't copy private information into a public record.",
    returnText:"Did you sort the slots without exposing anything the next person does not need to know?",
    debrief:"You coordinated the schedule using minimal fictional details. Verification can confirm a narrow claim without disclosing an entire medical record.",
    limitation:"Consent alone is not a complete security plan. Systems still need access control, secure storage, retention rules, breach response and lawful handling.",
    wrapText:"Good. Keep sensitive clinical data in properly secured systems; share only the minimum information authorized for a specific purpose.",
    objectives:[
      {id:"slot-morning",label:"Morning appointment slot",instruction:"Sort the fictional slot by time and service code only.",position:{x:126,z:64},color:"#19A7A1",shape:"schedule",choices:[
        {id:"minimum-data",label:"Use time and service code only",feedback:"You keep only the information needed to organize the appointment."},
        {id:"copy-identifiers",label:"Copy extra patient details",feedback:"Extra identifiers are unnecessary for this task. You remove them from the working schedule."}
      ]},
      {id:"slot-midday",label:"Midday appointment slot",instruction:"Place the fictional slot in the correct time order.",position:{x:38,z:119},color:"#19A7A1",shape:"schedule",choices:[
        {id:"sort-by-time",label:"Sort by time",feedback:"The appointment is placed by time without exposing a medical history."},
        {id:"share-everything",label:"Share the full record",feedback:"A schedule does not require the full record. You restrict the shared view."}
      ]},
      {id:"slot-afternoon",label:"Afternoon appointment slot",instruction:"Check the service code and leave private fields hidden.",position:{x:-168,z:-22},color:"#19A7A1",shape:"schedule",choices:[
        {id:"hide-private-fields",label:"Keep private fields hidden",feedback:"The slot is organized with private fields excluded."},
        {id:"publish-record",label:"Publish the record openly",feedback:"Public disclosure is not needed. You keep the record in the authorized care system."}
      ]}
    ]
  },
  {
    id:"kitcity-community-budget", conceptId:"community-governance", title:"The Community Leader",
    npcId:"aisha-community-organizer", npcName:"Aisha", role:"Community project organizer",
    personality:"Facilitates disagreement, asks for evidence, values accountability",
    ageRange:"30s-50s", economicContext:"volunteer organizer coordinating limited funds and competing local needs",
    technicalFluency:"practical organizer, not a protocol specialist",
    stance:"wants decisions people can understand and challenge",
    spot:"n", color:"#B66C2E", look:"woman", sign:"Community proposals · Talk",
    reward:{xp:45,ngn:200,item:"community-accountability-badge"},
    opening:"We have one small budget and three good ideas. People disagree about who benefits first. I need a process we can explain after the meeting too.",
    branches:[
      {id:"compare",label:"Compare costs, reach and maintenance",text:"Let's score the proposals against the same criteria: cost, who benefits, urgency, maintenance and how we report spending. The reasons should be public, not just the final vote."},
      {id:"governance",label:"Explain transparent decision-making",text:"A recorded vote can help show what people chose, but people still need a fair process, accessible information, accountability and a way to question the result."},
      {id:"challenge",label:"Address token-weighted voting",text:"If na the people wey get the most tokens go decide everything, where democracy come enter? It can concentrate power. One-person-one-vote, delegated, or mixed models each have trade-offs."}
    ],
    brief:"Review three fictional community proposals. Compare the trade-offs and choose what to prioritize for each one before we decide how to report the budget.",
    progress:"Visit all three proposal boards. Consider cost, how many people benefit, maintenance and accountability; there is no perfect option for every community.",
    reminder:"Inspect all three proposals and record a trade-off for each. A transparent vote still needs a fair process and follow-through.",
    returnText:"Which trade-offs did the group see? We need reasons people can challenge, not just a number on a screen.",
    debrief:"You compared options using explicit criteria. Recording decisions can help accountability when people can inspect the process and the spending afterward.",
    limitation:"Token-weighted voting can give wealth more influence. A ledger does not by itself make participation fair or prevent collusion and coercion.",
    wrapText:"Let's publish the criteria, disclose the budget, invite questions and choose a voting process the affected community can genuinely participate in.",
    objectives:[
      {id:"proposal-water",label:"Water-point repair proposal",instruction:"Choose the main trade-off to report for this proposal.",position:{x:-132,z:126},color:"#C18442",shape:"board",choices:[
        {id:"priority-cost",label:"Prioritize immediate cost",feedback:"Lower immediate cost matters, but the group should also check durability and who can access the water point."},
        {id:"priority-reach",label:"Prioritize people served",feedback:"Reach matters; the group should estimate who benefits and whether maintenance is funded."},
        {id:"priority-maintenance",label:"Prioritize long-term upkeep",feedback:"Maintenance protects the investment, though it may delay another urgent need."}
      ]},
      {id:"proposal-market",label:"Market waste collection proposal",instruction:"Choose the main trade-off to report for this proposal.",position:{x:155,z:18},color:"#C18442",shape:"board",choices:[
        {id:"priority-cost",label:"Prioritize immediate cost",feedback:"The low-cost option needs a realistic check on collection frequency and reliability."},
        {id:"priority-reach",label:"Prioritize people served",feedback:"Coverage matters; note which streets and traders would be left out."},
        {id:"priority-maintenance",label:"Prioritize long-term upkeep",feedback:"Reliable collection depends on who maintains it and how recurring costs are paid."}
      ]},
      {id:"proposal-learning",label:"Community learning space proposal",instruction:"Choose the main trade-off to report for this proposal.",position:{x:0,z:-194},color:"#C18442",shape:"board",choices:[
        {id:"priority-cost",label:"Prioritize immediate cost",feedback:"A cheap start helps, but check whether equipment and staffing can be sustained."},
        {id:"priority-reach",label:"Prioritize people served",feedback:"Access matters; ask whose schedule, disability or travel needs are not represented."},
        {id:"priority-maintenance",label:"Prioritize long-term upkeep",feedback:"Upkeep protects the space, but the community should compare this with urgent competing needs."}
      ]}
    ]
  },
  {
    id:"kitcity-web3-reality-check", conceptId:"security-and-limits", title:"The Web3 Maximalist",
    npcId:"dayo-web3-builder", npcName:"Dayo", role:"Experienced Web3 builder",
    personality:"Fast, confident, technically curious; capable of revising a position",
    ageRange:"late 20s-30s", economicContext:"builder working with early-stage products and limited engineering budgets",
    technicalFluency:"high; familiar with smart contracts and distributed systems",
    stance:"initially favors on-chain systems but respects strong counterarguments",
    spot:"o", color:"#00A8C7", look:"guy", sign:"Design review · Talk",
    reward:{xp:50,ngn:220,item:"builder-judgment-achievement"},
    opening:"I think most digital services should move on-chain. Shared state, composability, open access — why keep rebuilding the same closed databases?",
    branches:[
      {id:"tradeoffs",label:"Ask what trust problem the chain solves",text:"Who needs to verify the result independently? Who can change the data? What happens if keys are lost, fees rise or private data leaks? Start with the trust model, not the trend."},
      {id:"centralized",label:"Defend a normal database where it fits",text:"If one accountable operator is trusted and users need fast private edits, a normal database can be cheaper and easier to govern. Decentralization has costs."},
      {id:"challenge",label:"Challenge the maximalist assumption",text:"If ordinary database fit solve the problem cheaper and better, why blockchain? Exactly. Tell me the independent parties and shared rules that make the extra complexity worth it."}
    ],
    brief:"Evaluate three fictional product designs. Choose the architecture that best fits each trust, privacy, cost and performance requirement — including a normal database when it fits better.",
    progress:"Review all three design cards. There is no score for choosing blockchain; the goal is to match the architecture to the actual problem.",
    reminder:"Inspect all three designs. Ask who must trust whom, whether data is sensitive, how often it changes and what the system costs to operate.",
    returnText:"So which design actually needs a shared ledger, and which one is just chasing a trend?",
    debrief:"You compared the trust assumptions instead of assuming every product needs a blockchain. A good architecture can be on-chain, off-chain or hybrid depending on the real requirements.",
    limitation:"Public chains add costs and metadata exposure; private databases introduce operator trust. Neither design removes the need for security, governance or responsible people.",
    wrapText:"That is a better design review than 'put it all on-chain'. Let's document the assumptions, compare total costs and use the simplest architecture that meets the need.",
    objectives:[
      {id:"design-provenance",label:"Multi-party provenance registry",instruction:"Choose an architecture for independent organizations that need to reconcile a shared public batch history.",position:{x:178,z:-130},color:"#00CFE8",shape:"design",choices:[
        {id:"shared-ledger",label:"Consider a shared ledger",feedback:"A shared ledger may help when independent parties need common auditability and accept the cost, governance and data constraints."},
        {id:"single-database",label:"Use one operator database",feedback:"A single database may still work if parties trust the operator and agree on audit access; document that trust assumption."},
        {id:"hybrid",label:"Use a hybrid design",feedback:"A hybrid can keep sensitive details off-chain while anchoring selected proofs, but adds integration and operational complexity."}
      ]},
      {id:"design-clinic",label:"Private appointment scheduler",instruction:"Choose an architecture for a clinic that needs confidential records, rapid edits and controlled staff access.",position:{x:-184,z:-142},color:"#00CFE8",shape:"design",choices:[
        {id:"shared-ledger",label:"Put patient records on-chain",feedback:"Public patient records are inappropriate. Even a permissioned ledger needs strict access controls and careful privacy analysis."},
        {id:"single-database",label:"Use an access-controlled database",feedback:"A properly secured database is likely the simpler fit for confidential, frequently edited appointment data."},
        {id:"hybrid",label:"Use a minimal hybrid proof",feedback:"A hybrid may verify a narrow credential, but clinical data should remain in properly secured systems."}
      ]},
      {id:"design-local-coop",label:"Cooperative delivery reconciliation",instruction:"Choose an architecture for several cooperatives and buyers who do not fully trust one another but need shared batch reconciliation.",position:{x:52,z:190},color:"#00CFE8",shape:"design",choices:[
        {id:"shared-ledger",label:"Consider a shared ledger",feedback:"This may fit if independent parties need a common append-only history and agree on governance, corrections and costs."},
        {id:"single-database",label:"Use one trusted coordinator",feedback:"A central service may be cheaper and simpler if participants accept the coordinator and have audit rights."},
        {id:"hybrid",label:"Use a hybrid design",feedback:"A hybrid may balance shared proofs and private business data, provided the extra complexity solves a real problem."}
      ]}
    ]
  }
];

function makeDialogue(mission) {
  const startedFlag = flag("started", mission.id);
  const completeFlag = flag("objective-complete", mission.id);
  const doneFlag = flag("completed", mission.id);
  const nodes = {
    opening: {
      requires:{not:{flag:startedFlag}}, fallback:"objectiveProgress",
      text:mission.opening,
      choices:mission.branches.map((branch,index)=>({id:branch.id,label:branch.label,next:"branch"+index,effects:{trust:index===0?1:0}}))
    },
    taskBrief: {
      text:mission.brief,
      choices:[
        {id:"begin-activity",label:"Let's do it",end:true,effects:{flags:{[startedFlag]:true}}},
        {id:"start-later",label:"Give me a moment",end:true}
      ]
    },
    objectiveProgress: {
      requires:{not:{flag:completeFlag}}, fallback:"return",
      text:mission.progress,
      choices:[
        {id:"objective-reminder",label:"Remind me what to check",next:"reminder"},
        {id:"back-to-task",label:"I'll get it done",end:true}
      ]
    },
    reminder: {
      text:mission.reminder,
      choices:[{id:"back-to-objective",label:"Got it",next:"objectiveProgress"}]
    },
    return: {
      requires:{not:{flag:doneFlag}}, fallback:"afterComplete",
      text:mission.returnText,
      choices:[
        {id:"share-findings",label:"Share what I found",next:"debrief"},
        {id:"talk-limits",label:"Discuss the limitation",next:"limitation"},
        {id:"leave-for-now",label:"I'll leave you to it",end:true}
      ]
    },
    debrief: {
      text:mission.debrief,
      choices:[
        {id:"complete-mission",label:"Complete the task",end:true,completeConversation:true,completeMission:mission.id,effects:{knowledge:[mission.conceptId],flags:{[doneFlag]:true}}}
      ]
    },
    limitation: {
      text:mission.limitation,
      choices:[
        {id:"complete-with-context",label:"Keep the caveat in mind",end:true,completeConversation:true,completeMission:mission.id,effects:{knowledge:[mission.conceptId],flags:{[doneFlag]:true}}},
        {id:"think-more",label:"I want to think about that",end:true}
      ]
    },
    afterComplete: {
      text:"Good to see you again. The practical task is done, but the problem may still change as the community uses the solution.",
      choices:[
        {id:"revisit-lesson",label:"Revisit the key idea",next:"afterCompleteLesson"},
        {id:"goodbye",label:"I'll keep exploring",end:true}
      ]
    },
    afterCompleteLesson: {
      text:mission.limitation,
      choices:[{id:"return-to-streets",label:"Thanks for the reminder",end:true}]
    }
  };
  mission.branches.forEach((branch,index)=>{
    nodes["branch"+index]={
      text:branch.text,
      choices:[
        {id:"continue-to-task-"+index,label:index===0?"Let's check the evidence":index===1?"That makes sense":"Let's be honest about the limits",next:"taskBrief"},
        {id:"pause-before-task-"+index,label:"I'll come back shortly",end:true}
      ]
    };
  });
  return {
    id:mission.id,missionId:mission.id,npcId:mission.npcId,npcName:mission.npcName,role:mission.role,
    title:mission.title,start:"opening",nodes,conceptId:mission.conceptId,
    conceptTags:[mission.conceptId,"kitcity-prototype-missions"],exitLabel:"Back to exploring"
  };
}

export const PROTOTYPE_MISSIONS = missionRows.map(mission=>({
  ...mission, dialogue:makeDialogue(mission),
  locationIds:["lagos-free-roam"],
  status:"prototype-playable",
  prerequisites:[],
  objectiveCompleteFlag:flag("objective-complete",mission.id),
  startedFlag:flag("started",mission.id),
  completedFlag:flag("completed",mission.id)
}));

export const PROTOTYPE_MISSION_NPCS = PROTOTYPE_MISSIONS.map(mission=>({
  id:mission.id,dialogueId:mission.id,missionId:mission.id,conceptId:mission.conceptId,
  npcProfileId:mission.npcId,name:mission.npcName,role:mission.role,color:mission.color,
  look:mission.look,spot:mission.spot,sign:mission.sign,kind:"prototype-mission",major:true,
  reward:mission.reward,ageRange:mission.ageRange,economicContext:mission.economicContext,
  technicalFluency:mission.technicalFluency,stance:mission.stance,personality:mission.personality
}));

export const PROTOTYPE_OBJECTIVES = PROTOTYPE_MISSIONS.flatMap(mission=>mission.objectives.map(objective=>({
  ...objective,missionId:mission.id,npcName:mission.npcName,missionTitle:mission.title
})));

export function getPrototypeMission(id){return PROTOTYPE_MISSIONS.find(mission=>mission.id===id)||null;}
export function getPrototypeDialogue(id){return getPrototypeMission(id)?.dialogue||null;}

export function validatePrototypeMissionPack(){
  const errors=[];
  const ids=new Set(),npcIds=new Set(),dialogueIds=new Set(),objectiveIds=new Set();
  for(const mission of PROTOTYPE_MISSIONS){
    if(ids.has(mission.id))errors.push("duplicate prototype mission id: "+mission.id);ids.add(mission.id);
    if(npcIds.has(mission.npcId))errors.push("duplicate prototype NPC id: "+mission.npcId);npcIds.add(mission.npcId);
    if(dialogueIds.has(mission.dialogue.id))errors.push("duplicate prototype dialogue id: "+mission.dialogue.id);dialogueIds.add(mission.dialogue.id);
    if(!mission.title||!mission.npcName||!mission.opening||!mission.brief)errors.push(mission.id+": missing core mission content");
    if(!mission.locationIds.length||mission.locationIds.some(id=>id!=="lagos-free-roam"))errors.push(mission.id+": prototype location must be an explicit registered location");
    if(!mission.objectives.length)errors.push(mission.id+": missing practical objective");
    if(!mission.reward||!mission.reward.item||!(mission.reward.xp>0))errors.push(mission.id+": missing reward");
    if(!mission.conceptId)errors.push(mission.id+": missing educational concept");
    const nodes=mission.dialogue.nodes,seen=new Set(),pending=[mission.dialogue.start];
    while(pending.length){
      const id=pending.pop();if(seen.has(id))continue;seen.add(id);
      const node=nodes[id];if(!node){errors.push(mission.id+": unreachable dialogue reference "+id);continue;}
      for(const choice of node.choices||[]){
        if(choice.end)continue;
        if(!choice.next||!nodes[choice.next])errors.push(mission.id+"/"+id+": invalid next node "+choice.next);
        else pending.push(choice.next);
      }
    }
    for(const id of Object.keys(nodes))if(!seen.has(id))errors.push(mission.id+": unreachable dialogue node "+id);
    if(!["debrief","limitation"].some(id=>nodes[id].choices.some(choice=>choice.completeMission===mission.id&&choice.completeConversation)))errors.push(mission.id+": no mission completion path");
    if(!nodes.opening.requires||!nodes.objectiveProgress.requires||!nodes.return.requires)errors.push(mission.id+": objective progression is not gated");
    for(const objective of mission.objectives){
      const key=mission.id+":"+objective.id;
      if(objectiveIds.has(key))errors.push("duplicate objective id: "+key);objectiveIds.add(key);
      if(!objective.label||!objective.instruction||!objective.position||!objective.choices?.length)errors.push(key+": incomplete playable objective");
      if(objective.choices.length>3)errors.push(key+": too many objective choices");
    }
  }
  if(PROTOTYPE_MISSIONS.length!==8)errors.push("expected exactly eight prototype missions");
  return errors;
}
