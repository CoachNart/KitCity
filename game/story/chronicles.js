/**
 * Canonical narrative registry for KitCity's connected story missions.
 * The runtime consumes stable mission IDs, character order and objective data.
 * All 31 story missions are wired to the game loop; the 36-state route is a
 * coverage plan, and not every state yet has its own dedicated mission or world.
 */
export const CHARACTER_ORDER = [
  "Softstorm",
  "IamAbdul",
  "Joe_Sef",
  "Larai",
  "Unique",
  "Smrt huntr",
  "Goodness",
  "Semi",
  "Blockqueen",
  "Christol",
  "Laloba",
  "BigSam",
  "LunaX",
  "OxNight",
  "Moon",
  "The Cryptonian",
  "Joseph Nnadi",
  "The Don",
  "Praise",
  "Toza",
  "Craftore",
  "Kodavic",
  "Cybersage",
  "Reina",
  "Cclya",
  "Leemah",
  "Kenny",
  "Kore",
  "Veedima",
  "Web3_Esta",
  "Love",
  "J.Jonathan",
  "Essa",
  "White Coach",
  "Abdul",
  "David",
  "Kanyin",
  "Mcbond",
  "Alpha.RWA",
  "BigWealth",
  "Blessing",
  "Odion",
  "Princess",
  "Racheal",
  "Seun",
  "Dorcas",
  "Joe",
  "Mike",
  "Gbemi",
  "FemiY"
];

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara"
];

export const CHAPTERS = [
  { id:"ch01", title:"The World I Didn't Know", state:"Lagos", missionIds:["m01","m02"] },
  { id:"ch02", title:"Learning to Trust", state:"Oyo", missionIds:["m03","m04"] },
  { id:"ch03", title:"Builders and Inventors", state:"Osun", missionIds:["m05","m06"] },
  { id:"ch04", title:"Two Sides of the Market", state:"Ekiti", missionIds:["m07","m08"] },
  { id:"ch05", title:"The Price of a Decision", state:"Delta", missionIds:["m09","m10"] },
  { id:"ch06", title:"The People Who Build the Industry", state:"Anambra", missionIds:["m11","m12"] },
  { id:"ch07", title:"The Voice of the Ecosystem", state:"Enugu", missionIds:["m13","m14"] },
  { id:"ch08", title:"The Professional Journey", state:"Plateau", missionIds:["m15","m16"] },
  { id:"ch09", title:"Beyond the Screen", state:"Kano", missionIds:["m17","m18"] },
  { id:"ch10", title:"Following the Money", state:"Edo", missionIds:["m19","m20"] },
  { id:"ch11", title:"The New Frontier", state:"Cross River", missionIds:["m21","m22"] },
  { id:"ch12", title:"The Systems Behind the Scenes", state:"Bauchi", missionIds:["m23","m24"] },
  { id:"ch13", title:"The Creator Economy", state:"Abia", missionIds:["m25"] },
  { id:"ch14", title:"The Missing Piece", state:"Niger", missionIds:["m26","m27"] },
  { id:"ch15", title:"The Road to KitCity", state:"Kogi", missionIds:["m28"] },
  { id:"final", title:"KitCity", state:"KitCity", missionIds:["m29","m30","m31"] }
];

const RAW_MISSIONS = [
  {
    "id": "m01",
    "chapterId": "ch01",
    "title": "Just Another Day",
    "state": "Lagos",
    "location": "Lagos roadside electronics shop",
    "npcIds": [
      "softstorm",
      "iamabdul"
    ],
    "npcs": [
      "Softstorm",
      "IamAbdul"
    ],
    "narrativePurpose": "At a Lagos electronics shop, a buyer insists he paid 120 USDC for a laptop. Softstorm cannot find the payment. You help him and IamAbdul check the screenshot, shop records, transaction hash and recipient address before anyone releases the laptop.",
    "learningObjectives": [
      "Verify a blockchain transaction",
      "Compare recipient addresses",
      "Avoid treating screenshots as proof of payment"
    ],
    "prerequisites": [],
    "objectives": [
      {
        "id": "m01-obj-1",
        "label": "Find out why Softstorm is worried about the laptop",
        "interactionTarget": "story:m01:join-dispute",
        "required": true
      },
      {
        "id": "m01-obj-2",
        "label": "Ask IamAbdul how to verify a crypto payment",
        "interactionTarget": "story:m01:verification",
        "required": true
      },
      {
        "id": "m01-obj-3",
        "label": "Inspect the buyer's payment screenshot",
        "interactionTarget": "story:m01:screenshot",
        "required": true
      },
      {
        "id": "m01-obj-4",
        "label": "Check the shop's own payment records",
        "interactionTarget": "story:m01:shop-records",
        "required": true
      },
      {
        "id": "m01-obj-5",
        "label": "Ask the buyer for transaction details",
        "interactionTarget": "story:m01:buyer",
        "required": true
      },
      {
        "id": "m01-obj-6",
        "label": "Compare the transaction recipient with the shop's address",
        "interactionTarget": "story:m01:ledger",
        "required": true
      },
      {
        "id": "m01-obj-7",
        "label": "Tell Softstorm what the evidence means",
        "interactionTarget": "story:m01:resolution",
        "required": true
      }
    ],
    "successConditions": [
      "The player checks the shop's payment records and the public transaction record",
      "The player identifies that the recipient address does not match the shop's expected address",
      "The player decides not to release the laptop until the correct payment arrives"
    ],
    "failureAndRetry": {
      "onFailure": "If the player trusts the screenshot or misreads the confirmed transaction, Softstorm and IamAbdul challenge the assumption and let the player compare the evidence again.",
      "retry": "Retry the current decision without losing completed investigation steps. "
    },
    "rewards": {
      "xp": 100,
      "skillBadges": [
        "Verification"
      ],
      "portfolioArtifacts": [
        "Lagos payment-dispute incident report"
      ]
    },
    "storyFlags": [
      "m01_complete",
      "payment_dispute_resolved",
      "web3_first_lesson"
    ],
    "nextMissionId": "m02",
    "ending": "You confirm that the transaction succeeded but went to an address the shop does not control. Softstorm keeps the laptop until the correct payment arrives; the evidence settles the argument without accusing anyone of lying.",
    "cliffhanger": "The buyer says he copied the address from an online account page. Softstorm sends you to Joe_Sef and Larai to find out how that page, the wallet and the public transaction record got mixed up."
  },
  {
    "id": "m02",
    "chapterId": "ch01",
    "title": "The Name on the Ledger",
    "state": "Lagos",
    "location": "Lagos story district",
    "npcIds": [
      "joe-sef",
      "larai"
    ],
    "npcs": [
      "Joe_Sef",
      "Larai"
    ],
    "narrativePurpose": "You follow the laptop-payment trail to Joe_Sef and Larai's workspace. They help you trace the buyer's actual transaction, compare the destination with the shop's address, and work out why an online display name is not proof of who received the funds.",
    "learningObjectives": [
      "transaction hashes and networks",
      "recipient-address verification",
      "the difference between platform identities and wallet addresses"
    ],
    "prerequisites": [
      "m01"
    ],
    "objectives": [
      {
        "id": "m02-obj-1",
        "label": "Ask Joe_Sef for the buyer's transaction hash and network",
        "interactionTarget": "story:m02:objective:1",
        "required": true
      },
      {
        "id": "m02-obj-2",
        "label": "Inspect the transaction explorer record",
        "interactionTarget": "story:m02:objective:2",
        "required": true
      },
      {
        "id": "m02-obj-3",
        "label": "Trace a transaction and compare the recipient address",
        "interactionTarget": "story:m02:objective:3",
        "required": true
      },
      {
        "id": "m02-obj-4",
        "label": "Record the address mismatch for Softstorm",
        "interactionTarget": "story:m02:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player matches the supplied transaction hash and network to the public transaction record",
      "The player confirms that the recipient address differs from the shop's expected address",
      "The player records the finding without treating a display name or screenshot as proof"
    ],
    "failureAndRetry": {
      "onFailure": "If the player trusts the display name, checks the wrong network or skips the recipient, Larai points to the missing evidence and lets the player inspect the record again.",
      "retry": "Retry the current evidence check without losing completed investigation steps."
    },
    "rewards": {
      "xp": 110,
      "skillBadges": [
        "Transaction Verification"
      ],
      "portfolioArtifacts": [
        "Verified transaction trace and recipient-mismatch report"
      ]
    },
    "storyFlags": [
      "m02_complete",
      "payment_recipient_mismatch_confirmed"
    ],
    "nextMissionId": "m03",
    "ending": "You match the transaction hash to the public record and confirm the destination mismatch. Joe_Sef saves the evidence for Softstorm; Larai shows how a familiar platform screen can still leave users responsible for checking the address and network.",
    "cliffhanger": "While you are leaving, a crowd gathers around a stranger promising to double their tokens. He says the only thing he needs is their wallet recovery phrase."
  },
  {
    "id": "m03",
    "chapterId": "ch02",
    "title": "Your First Wallet",
    "state": "Oyo",
    "location": "Oyo story district",
    "npcIds": [
      "unique",
      "smrt-huntr"
    ],
    "npcs": [
      "Unique",
      "Smrt huntr"
    ],
    "narrativePurpose": "In Oyo, a wallet setup session turns urgent when a stranger offers to double the tokens in your new wallet in exchange for its recovery phrase. Unique and Smrt huntr ask you to inspect the request before you risk your funds.",
    "learningObjectives": [
      "wallet addresses",
      "private keys",
      "recovery phrases",
      "transaction approvals"
    ],
    "prerequisites": [
      "m02"
    ],
    "objectives": [
      {
        "id": "m03-obj-1",
        "label": "Create a wallet",
        "interactionTarget": "story:m03:objective:1",
        "required": true
      },
      {
        "id": "m03-obj-2",
        "label": "receive tokens",
        "interactionTarget": "story:m03:objective:2",
        "required": true
      },
      {
        "id": "m03-obj-3",
        "label": "send a transaction",
        "interactionTarget": "story:m03:objective:3",
        "required": true
      },
      {
        "id": "m03-obj-4",
        "label": "reject a malicious request",
        "interactionTarget": "story:m03:objective:4",
        "required": true
      },
      {
        "id": "m03-obj-5",
        "label": "explain recovery-phrase secrecy.",
        "interactionTarget": "story:m03:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "The fake request is safely reset; the player can retry from the current decision.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 120,
      "skillBadges": [
        "Wallet Safety"
      ],
      "portfolioArtifacts": [
        "Wallet safety checklist"
      ]
    },
    "storyFlags": [
      "m03_complete"
    ],
    "nextMissionId": "m04",
    "ending": "You set up a practice wallet, receive a small test amount and reject the request for your recovery phrase. Unique records the suspicious approach so the others can warn the group.",
    "cliffhanger": "The test transfer appears in a message and an explorer record, but one person says the records can be edited. Goodness and Semi want you to trace it before the rumour spreads."
  },
  {
    "id": "m04",
    "chapterId": "ch02",
    "title": "The Ledger That Remembers",
    "state": "Oyo",
    "location": "Oyo story district",
    "npcIds": [
      "goodness",
      "semi"
    ],
    "npcs": [
      "Goodness",
      "Semi"
    ],
    "narrativePurpose": "Goodness and Semi bring you two conflicting accounts of the same test transfer. You trace its hash, block and confirmation details, then decide whether the proposed correction is supported by evidence or just someone's claim.",
    "learningObjectives": [
      "blocks",
      "transactions",
      "distributed ledgers",
      "consensus"
    ],
    "prerequisites": [
      "m03"
    ],
    "objectives": [
      {
        "id": "m04-obj-1",
        "label": "Inspect a transaction explorer",
        "interactionTarget": "story:m04:objective:1",
        "required": true
      },
      {
        "id": "m04-obj-2",
        "label": "trace a transaction",
        "interactionTarget": "story:m04:objective:2",
        "required": true
      },
      {
        "id": "m04-obj-3",
        "label": "identify its block",
        "interactionTarget": "story:m04:objective:3",
        "required": true
      },
      {
        "id": "m04-obj-4",
        "label": "investigate a proposed record change",
        "interactionTarget": "story:m04:objective:4",
        "required": true
      },
      {
        "id": "m04-obj-5",
        "label": "explain consensus.",
        "interactionTarget": "story:m04:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "The explorer highlights the transaction path after an incorrect trace.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 130,
      "skillBadges": [
        "Ledger Explorer"
      ],
      "portfolioArtifacts": [
        "transaction trace"
      ]
    },
    "storyFlags": [
      "m04_complete",
      "web3_ledger_record"
    ],
    "nextMissionId": "m05",
    "ending": "You locate the transaction in the chain and record the details that can be independently checked. Semi uses your trace to correct the group chat without claiming that a confirmed record makes every surrounding story true.",
    "cliffhanger": "One person who saw your evidence asks for help with a failing app used by the same group. Blockqueen and Christol need someone to find the real user problem before the next release."
  },
  {
    "id": "m05",
    "chapterId": "ch03",
    "title": "The Broken Application",
    "state": "Osun",
    "location": "Osun story district",
    "npcIds": [
      "blockqueen",
      "christol"
    ],
    "npcs": [
      "Blockqueen",
      "Christol"
    ],
    "narrativePurpose": "Blockqueen and Christol's app keeps failing for new users, and the team is blaming the wrong things. You watch real users try the main flow, identify where they get stuck and recommend a fix based on what you observed.",
    "learningObjectives": [
      "dapps",
      "frontend/backend",
      "APIs",
      "user research"
    ],
    "prerequisites": [
      "m04"
    ],
    "objectives": [
      {
        "id": "m05-obj-1",
        "label": "Interview two users",
        "interactionTarget": "story:m05:objective:1",
        "required": true
      },
      {
        "id": "m05-obj-2",
        "label": "test the core flow",
        "interactionTarget": "story:m05:objective:2",
        "required": true
      },
      {
        "id": "m05-obj-3",
        "label": "isolate the biggest failure",
        "interactionTarget": "story:m05:objective:3",
        "required": true
      },
      {
        "id": "m05-obj-4",
        "label": "recommend a fix",
        "interactionTarget": "story:m05:objective:4",
        "required": true
      },
      {
        "id": "m05-obj-5",
        "label": "present evidence.",
        "interactionTarget": "story:m05:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "The team asks for user evidence again if the recommendation is feature-first.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 140,
      "skillBadges": [
        "Product Thinking"
      ],
      "portfolioArtifacts": [
        "User interview summary"
      ]
    },
    "storyFlags": [
      "m05_complete"
    ],
    "nextMissionId": "m06",
    "ending": "You identify the step where users repeatedly get stuck and propose a focused change. The team agrees to test it with users before adding more features.",
    "cliffhanger": "During the retest, the app's payment feature exposes a separate problem: its smart contract behaves incorrectly under a condition the team never tested. Laloba and BigSam are preparing to launch."
  },
  {
    "id": "m06",
    "chapterId": "ch03",
    "title": "Code That Controls Money",
    "state": "Osun",
    "location": "Osun story district",
    "npcIds": [
      "laloba",
      "bigsam"
    ],
    "npcs": [
      "Laloba",
      "BigSam"
    ],
    "narrativePurpose": "Laloba and BigSam are under pressure to launch a contract that handles user funds, but the payment bug still reproduces. You isolate the condition, propose a correction and choose the tests needed before the team can safely release it.",
    "learningObjectives": [
      "smart contracts",
      "conditions",
      "testing",
      "security"
    ],
    "prerequisites": [
      "m05"
    ],
    "objectives": [
      {
        "id": "m06-obj-1",
        "label": "Inspect a contract workspace",
        "interactionTarget": "story:m06:objective:1",
        "required": true
      },
      {
        "id": "m06-obj-2",
        "label": "reproduce the bug",
        "interactionTarget": "story:m06:objective:2",
        "required": true
      },
      {
        "id": "m06-obj-3",
        "label": "identify the faulty assumption",
        "interactionTarget": "story:m06:objective:3",
        "required": true
      },
      {
        "id": "m06-obj-4",
        "label": "propose a fix",
        "interactionTarget": "story:m06:objective:4",
        "required": true
      },
      {
        "id": "m06-obj-5",
        "label": "describe tests needed before deployment.",
        "interactionTarget": "story:m06:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "Deployment remains paused until the test passes; the player can revise the fix.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 150,
      "skillBadges": [
        "Contract Safety"
      ],
      "portfolioArtifacts": [
        "Contract test report"
      ]
    },
    "storyFlags": [
      "m06_complete"
    ],
    "nextMissionId": "m07",
    "ending": "You reproduce the bug, document the failing condition and propose a fix with tests. BigSam pauses the release until the patch passes review, while Laloba records the evidence for the team.",
    "cliffhanger": "A trader says a token swap returned less than the quote shown on screen. LunaX and OxNight ask you to inspect the pool and transaction before deciding whether the app or the market caused it."
  },
  {
    "id": "m07",
    "chapterId": "ch04",
    "title": "The Exchange Without a Shopkeeper",
    "state": "Ekiti",
    "location": "Ekiti story district",
    "npcIds": [
      "lunax",
      "oxnight"
    ],
    "npcs": [
      "LunaX",
      "OxNight"
    ],
    "narrativePurpose": "LunaX and OxNight investigate a swap that returned less than the displayed quote. You compare pool liquidity, fees, price impact and token approvals, then explain which costs were visible and which risks needed closer inspection.",
    "learningObjectives": [
      "DEXs",
      "liquidity pools",
      "slippage",
      "approvals"
    ],
    "prerequisites": [
      "m06"
    ],
    "objectives": [
      {
        "id": "m07-obj-1",
        "label": "Compare liquidity pools",
        "interactionTarget": "story:m07:objective:1",
        "required": true
      },
      {
        "id": "m07-obj-2",
        "label": "estimate price impact",
        "interactionTarget": "story:m07:objective:2",
        "required": true
      },
      {
        "id": "m07-obj-3",
        "label": "execute a swap",
        "interactionTarget": "story:m07:objective:3",
        "required": true
      },
      {
        "id": "m07-obj-4",
        "label": "inspect token approval",
        "interactionTarget": "story:m07:objective:4",
        "required": true
      },
      {
        "id": "m07-obj-5",
        "label": "explain liquidity and slippage.",
        "interactionTarget": "story:m07:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "The player retries with a smaller swap and a fee breakdown.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 160,
      "skillBadges": [
        "DEX Literacy"
      ],
      "portfolioArtifacts": [
        "Swap price-impact worksheet"
      ]
    },
    "storyFlags": [
      "m07_complete"
    ],
    "nextMissionId": "m08",
    "ending": "You compare the available pools, identify the main causes of the execution difference and review the approval before confirming the practice swap. The team updates its guidance instead of promising that a quote is a guaranteed price.",
    "cliffhanger": "The same group now uses a centralized exchange, where withdrawals have suddenly paused. Moon and The Cryptonian need a clear update that separates confirmed facts from chat-room rumours."
  },
  {
    "id": "m08",
    "chapterId": "ch04",
    "title": "Inside the Exchange",
    "state": "Ekiti",
    "location": "Ekiti story district",
    "npcIds": [
      "moon",
      "the-cryptonian"
    ],
    "npcs": [
      "Moon",
      "The Cryptonian"
    ],
    "narrativePurpose": "Withdrawals have paused at an exchange used by the group, and rumours are spreading faster than the official notice. Moon and The Cryptonian ask you to inspect the available information, understand the order types involved and draft a factual update without guessing at the cause.",
    "learningObjectives": [
      "CEXs",
      "order books",
      "custody",
      "incident communication"
    ],
    "prerequisites": [
      "m07"
    ],
    "objectives": [
      {
        "id": "m08-obj-1",
        "label": "Place market and limit orders",
        "interactionTarget": "story:m08:objective:1",
        "required": true
      },
      {
        "id": "m08-obj-2",
        "label": "compare bid/ask",
        "interactionTarget": "story:m08:objective:2",
        "required": true
      },
      {
        "id": "m08-obj-3",
        "label": "inspect a withdrawal incident",
        "interactionTarget": "story:m08:objective:3",
        "required": true
      },
      {
        "id": "m08-obj-4",
        "label": "draft a verified status update",
        "interactionTarget": "story:m08:objective:4",
        "required": true
      },
      {
        "id": "m08-obj-5",
        "label": "compare custody models.",
        "interactionTarget": "story:m08:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "Unverified claims are rejected and rewritten before the player can submit.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 170,
      "skillBadges": [
        "Exchange Literacy"
      ],
      "portfolioArtifacts": [
        "Verified incident update"
      ]
    },
    "storyFlags": [
      "m08_complete"
    ],
    "nextMissionId": "m09",
    "ending": "You distinguish market orders from limit orders, record what the withdrawal notice does and does not confirm, and publish a cautious update that gives users a useful next step.",
    "cliffhanger": "A trader in the same group has just taken a loss and wants to enter another position immediately. Joseph Nnadi asks you to review the plan before frustration becomes another trade."
  },
  {
    "id": "m09",
    "chapterId": "ch05",
    "title": "The Spot Trader",
    "state": "Delta",
    "location": "Delta story district",
    "npcIds": [
      "joseph-nnadi",
      "the-don"
    ],
    "npcs": [
      "Joseph Nnadi",
      "The Don"
    ],
    "narrativePurpose": "Joseph Nnadi is helping a spot trader review a losing position. You reconstruct the original setup, entry, invalidation and risk, then decide whether the evidence supports a new trade or a pause.",
    "learningObjectives": [
      "spot trading",
      "position sizing",
      "risk",
      "trading journals"
    ],
    "prerequisites": [
      "m08"
    ],
    "objectives": [
      {
        "id": "m09-obj-1",
        "label": "Read a market chart",
        "interactionTarget": "story:m09:objective:1",
        "required": true
      },
      {
        "id": "m09-obj-2",
        "label": "mark a possible entry and invalidation",
        "interactionTarget": "story:m09:objective:2",
        "required": true
      },
      {
        "id": "m09-obj-3",
        "label": "calculate risk",
        "interactionTarget": "story:m09:objective:3",
        "required": true
      },
      {
        "id": "m09-obj-4",
        "label": "execute a paper trade",
        "interactionTarget": "story:m09:objective:4",
        "required": true
      },
      {
        "id": "m09-obj-5",
        "label": "record the outcome.",
        "interactionTarget": "story:m09:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "A revenge-trade choice opens a review; no real funds are involved.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 180,
      "skillBadges": [
        "Risk Management"
      ],
      "portfolioArtifacts": [
        "Paper-trading journal"
      ]
    },
    "storyFlags": [
      "m09_complete"
    ],
    "nextMissionId": "m10",
    "ending": "You record the original plan and the loss without changing the rules after the fact. Joseph uses the review to show what can be learned from a losing trade without chasing the money back.",
    "cliffhanger": "Toza has watched the group discuss risk and opened a leveraged position anyway. Praise calls you over as the margin buffer begins to shrink; Craftore wants the numbers checked now."
  },
  {
    "id": "m10",
    "chapterId": "ch05",
    "title": "Leverage Has Teeth",
    "state": "Delta",
    "location": "Delta story district",
    "npcIds": [
      "praise",
      "toza",
      "craftore"
    ],
    "npcs": [
      "Praise",
      "Toza",
      "Craftore"
    ],
    "narrativePurpose": "Toza's leveraged position is moving against him, and the margin buffer is shrinking. With Praise and Craftore, you calculate the exposure, compare leverage choices and follow a pre-agreed risk plan rather than trying to predict a rescue.",
    "learningObjectives": [
      "futures",
      "leverage",
      "margin",
      "liquidation"
    ],
    "prerequisites": [
      "m09"
    ],
    "objectives": [
      {
        "id": "m10-obj-1",
        "label": "Open a futures position",
        "interactionTarget": "story:m10:objective:1",
        "required": true
      },
      {
        "id": "m10-obj-2",
        "label": "compare leverage",
        "interactionTarget": "story:m10:objective:2",
        "required": true
      },
      {
        "id": "m10-obj-3",
        "label": "estimate margin",
        "interactionTarget": "story:m10:objective:3",
        "required": true
      },
      {
        "id": "m10-obj-4",
        "label": "identify liquidation risk",
        "interactionTarget": "story:m10:objective:4",
        "required": true
      },
      {
        "id": "m10-obj-5",
        "label": "review the loss and close plan.",
        "interactionTarget": "story:m10:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "The player can retry with lower exposure and a clear invalidation rule.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 190,
      "skillBadges": [
        "Leverage Safety"
      ],
      "portfolioArtifacts": [
        "Leverage risk review"
      ]
    },
    "storyFlags": [
      "m10_complete"
    ],
    "nextMissionId": "m11",
    "ending": "You calculate how leverage changes the position's exposure and identify the point at which the trade no longer fits the plan. Toza follows the agreed close plan before the loss grows.",
    "cliffhanger": "Craftore introduces you to a project with thousands of followers but very few people completing its first useful task. Kodavic and Cybersage want to know where participation breaks down."
  },
  {
    "id": "m11",
    "chapterId": "ch06",
    "title": "A Community Is Not a Crowd",
    "state": "Anambra",
    "location": "Anambra story district",
    "npcIds": [
      "kodavic",
      "cybersage"
    ],
    "npcs": [
      "Kodavic",
      "Cybersage"
    ],
    "narrativePurpose": "Kodavic and Cybersage have a large audience but almost nobody completes the project's first useful task. You trace the onboarding journey, speak with members and redesign the first session around one meaningful action instead of another giveaway.",
    "learningObjectives": [
      "community onboarding",
      "retention",
      "feedback"
    ],
    "prerequisites": [
      "m10"
    ],
    "objectives": [
      {
        "id": "m11-obj-1",
        "label": "Inspect onboarding",
        "interactionTarget": "story:m11:objective:1",
        "required": true
      },
      {
        "id": "m11-obj-2",
        "label": "interview members",
        "interactionTarget": "story:m11:objective:2",
        "required": true
      },
      {
        "id": "m11-obj-3",
        "label": "locate the drop-off",
        "interactionTarget": "story:m11:objective:3",
        "required": true
      },
      {
        "id": "m11-obj-4",
        "label": "redesign the first session",
        "interactionTarget": "story:m11:objective:4",
        "required": true
      },
      {
        "id": "m11-obj-5",
        "label": "choose a meaningful retention metric.",
        "interactionTarget": "story:m11:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "The player tests another onboarding flow if newcomers still get stuck.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 200,
      "skillBadges": [
        "Community Design"
      ],
      "portfolioArtifacts": [
        "Community onboarding plan"
      ]
    },
    "storyFlags": [
      "m11_complete"
    ],
    "nextMissionId": "m12",
    "ending": "You find the point where newcomers give up and recommend a simpler first task with a clear result. The team begins measuring completed work and return visits rather than celebrating member counts alone.",
    "cliffhanger": "As the team invites new members back, one receives a message from an account impersonating a moderator and asking for wallet access. Reina and Cclya need help containing it."
  },
  {
    "id": "m12",
    "chapterId": "ch06",
    "title": "The Guardians of the Server",
    "state": "Anambra",
    "location": "Anambra story district",
    "npcIds": [
      "reina",
      "cclya"
    ],
    "npcs": [
      "Reina",
      "Cclya"
    ],
    "narrativePurpose": "A fake moderator is messaging members and asking them to connect wallets or reveal recovery phrases. Reina and Cclya ask you to preserve the evidence, contain the message, help the affected member secure their account and communicate without exposing private details.",
    "learningObjectives": [
      "moderation",
      "scam response",
      "conflict resolution"
    ],
    "prerequisites": [
      "m11"
    ],
    "objectives": [
      {
        "id": "m12-obj-1",
        "label": "Identify impersonation",
        "interactionTarget": "story:m12:objective:1",
        "required": true
      },
      {
        "id": "m12-obj-2",
        "label": "contain a dangerous message",
        "interactionTarget": "story:m12:objective:2",
        "required": true
      },
      {
        "id": "m12-obj-3",
        "label": "guide a user to secure an account",
        "interactionTarget": "story:m12:objective:3",
        "required": true
      },
      {
        "id": "m12-obj-4",
        "label": "de-escalate a dispute",
        "interactionTarget": "story:m12:objective:4",
        "required": true
      },
      {
        "id": "m12-obj-5",
        "label": "publish a clear notice.",
        "interactionTarget": "story:m12:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "A safety checklist helps the player retry the response.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 210,
      "skillBadges": [
        "Community Safety"
      ],
      "portfolioArtifacts": [
        "Moderation incident response"
      ]
    },
    "storyFlags": [
      "m12_complete"
    ],
    "nextMissionId": "m13",
    "ending": "You help the member secure their account, report the impersonator and publish a calm notice using verified facts. The team removes the dangerous message without reposting its link or blaming the victim.",
    "cliffhanger": "The incident is under control, but members have questions and the scheduled host has cancelled. Leemah and Kenny need you to lead a useful live session at short notice."
  },
  {
    "id": "m13",
    "chapterId": "ch07",
    "title": "You Have the Mic",
    "state": "Enugu",
    "location": "Enugu story district",
    "npcIds": [
      "leemah",
      "kenny"
    ],
    "npcs": [
      "Leemah",
      "Kenny"
    ],
    "narrativePurpose": "After the impersonation incident, the community wants answers and practical safety steps. With Leemah and Kenny, you prepare and host a live session, handle a difficult question honestly and publish a recap with actions members can take.",
    "learningObjectives": [
      "live hosting",
      "interviewing",
      "event coordination"
    ],
    "prerequisites": [
      "m12"
    ],
    "objectives": [
      {
        "id": "m13-obj-1",
        "label": "Research the topic",
        "interactionTarget": "story:m13:objective:1",
        "required": true
      },
      {
        "id": "m13-obj-2",
        "label": "prepare an opening",
        "interactionTarget": "story:m13:objective:2",
        "required": true
      },
      {
        "id": "m13-obj-3",
        "label": "arrange questions",
        "interactionTarget": "story:m13:objective:3",
        "required": true
      },
      {
        "id": "m13-obj-4",
        "label": "host a live session",
        "interactionTarget": "story:m13:objective:4",
        "required": true
      },
      {
        "id": "m13-obj-5",
        "label": "handle a difficult question",
        "interactionTarget": "story:m13:objective:5",
        "required": true
      },
      {
        "id": "m13-obj-6",
        "label": "write a recap.",
        "interactionTarget": "story:m13:objective:6",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "The player can revise weak questions and host the exercise again.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 220,
      "skillBadges": [
        "Live Hosting"
      ],
      "portfolioArtifacts": [
        "Live event recap"
      ]
    },
    "storyFlags": [
      "m13_complete"
    ],
    "nextMissionId": "m14",
    "ending": "You host the session, separate confirmed facts from unanswered questions and publish a recap with clear next steps. The community leaves with guidance rather than promises that the problem can never happen again.",
    "cliffhanger": "A founder who attended the session asks for help explaining a useful product. Kore and Veedima say the current announcement sounds impressive but leaves readers unsure what the product does."
  },
  {
    "id": "m14",
    "chapterId": "ch07",
    "title": "Words That Open Doors",
    "state": "Enugu",
    "location": "Enugu story district",
    "npcIds": [
      "kore",
      "veedima"
    ],
    "npcs": [
      "Kore",
      "Veedima"
    ],
    "narrativePurpose": "Kore and Veedima's product announcement is full of technical claims but does not tell its intended audience what the product does. You check the evidence, rewrite the message for a real audience and remove claims the team cannot support.",
    "learningObjectives": [
      "content writing",
      "technical communication",
      "fact checking"
    ],
    "prerequisites": [
      "m13"
    ],
    "objectives": [
      {
        "id": "m14-obj-1",
        "label": "Research the product",
        "interactionTarget": "story:m14:objective:1",
        "required": true
      },
      {
        "id": "m14-obj-2",
        "label": "identify the audience",
        "interactionTarget": "story:m14:objective:2",
        "required": true
      },
      {
        "id": "m14-obj-3",
        "label": "rewrite an announcement",
        "interactionTarget": "story:m14:objective:3",
        "required": true
      },
      {
        "id": "m14-obj-4",
        "label": "create an educational post",
        "interactionTarget": "story:m14:objective:4",
        "required": true
      },
      {
        "id": "m14-obj-5",
        "label": "verify each claim.",
        "interactionTarget": "story:m14:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "Unverified claims must be removed or clearly qualified.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 230,
      "skillBadges": [
        "Technical Communication"
      ],
      "portfolioArtifacts": [
        "Educational product post"
      ]
    },
    "storyFlags": [
      "m14_complete"
    ],
    "nextMissionId": "m15",
    "ending": "You produce a clear announcement that explains the problem, what the product can do today and what readers should do next. Every claim is tied to evidence the team can stand behind.",
    "cliffhanger": "Your rewrite gets shared by someone hiring for a Web3 role. Web3_Esta and Love ask you to prepare examples of real work before replying with a list of skills."
  },
  {
    "id": "m15",
    "chapterId": "ch08",
    "title": "The Profile That Opens Doors",
    "state": "Plateau",
    "location": "Plateau story district",
    "npcIds": [
      "web3-esta",
      "love"
    ],
    "npcs": [
      "Web3_Esta",
      "Love"
    ],
    "narrativePurpose": "Web3_Esta and Love help you turn the work you have done so far into a credible portfolio. You choose a direction, show your actual contribution, organise evidence and identify the skill gap that could block your next opportunity.",
    "learningObjectives": [
      "professional positioning",
      "portfolios",
      "networking"
    ],
    "prerequisites": [
      "m14"
    ],
    "objectives": [
      {
        "id": "m15-obj-1",
        "label": "Choose a direction",
        "interactionTarget": "story:m15:objective:1",
        "required": true
      },
      {
        "id": "m15-obj-2",
        "label": "write a bio",
        "interactionTarget": "story:m15:objective:2",
        "required": true
      },
      {
        "id": "m15-obj-3",
        "label": "organize work samples",
        "interactionTarget": "story:m15:objective:3",
        "required": true
      },
      {
        "id": "m15-obj-4",
        "label": "assemble a portfolio",
        "interactionTarget": "story:m15:objective:4",
        "required": true
      },
      {
        "id": "m15-obj-5",
        "label": "identify missing evidence.",
        "interactionTarget": "story:m15:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "The reviewer highlights unsupported claims for revision.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 240,
      "skillBadges": [
        "Portfolio Building"
      ],
      "portfolioArtifacts": [
        "Professional portfolio"
      ]
    },
    "storyFlags": [
      "m15_complete"
    ],
    "nextMissionId": "m16",
    "ending": "You assemble a focused portfolio with clear samples, context and an honest account of your contribution. Love points out one missing proof point to work on next instead of promising that a polished profile guarantees a job.",
    "cliffhanger": "A small opportunity arrives from J.Jonathan, but the recruiter wants an upfront fee before sharing the full brief. Essa asks you to verify the offer before sending anything."
  },
  {
    "id": "m16",
    "chapterId": "ch08",
    "title": "The First Opportunity",
    "state": "Plateau",
    "location": "Plateau story district",
    "npcIds": [
      "j-jonathan",
      "essa"
    ],
    "npcs": [
      "J.Jonathan",
      "Essa"
    ],
    "narrativePurpose": "J.Jonathan has a small research task that could become useful experience, but the recruiter attached to it asks for an upfront fee and vague personal details. With Essa, you inspect the brief, verify the contact and submit a practical sample only when the terms make sense.",
    "learningObjectives": [
      "applications",
      "work samples",
      "interviews"
    ],
    "prerequisites": [
      "m15"
    ],
    "objectives": [
      {
        "id": "m16-obj-1",
        "label": "Review a role",
        "interactionTarget": "story:m16:objective:1",
        "required": true
      },
      {
        "id": "m16-obj-2",
        "label": "map required skills",
        "interactionTarget": "story:m16:objective:2",
        "required": true
      },
      {
        "id": "m16-obj-3",
        "label": "complete a work sample",
        "interactionTarget": "story:m16:objective:3",
        "required": true
      },
      {
        "id": "m16-obj-4",
        "label": "submit an application",
        "interactionTarget": "story:m16:objective:4",
        "required": true
      },
      {
        "id": "m16-obj-5",
        "label": "respond to feedback.",
        "interactionTarget": "story:m16:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "Feedback identifies what to improve before the application is resubmitted.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 250,
      "skillBadges": [
        "First Contribution"
      ],
      "portfolioArtifacts": [
        "Practical work sample"
      ]
    },
    "storyFlags": [
      "m16_complete"
    ],
    "nextMissionId": "m17",
    "ending": "You identify the warning signs, refuse the suspicious fee and complete a safe work sample for the verifiable part of the opportunity. The feedback gives you a concrete revision to make, not a guaranteed job.",
    "cliffhanger": "The sample reaches a startup in Kano. White Coach and Abdul say the team is about to build another feature, even though it still cannot explain why users leave."
  },
  {
    "id": "m17",
    "chapterId": "ch09",
    "title": "The Product People Need",
    "state": "Kano",
    "location": "Kano story district",
    "npcIds": [
      "white-coach",
      "abdul"
    ],
    "npcs": [
      "White Coach",
      "Abdul"
    ],
    "narrativePurpose": "White Coach and Abdul have inherited a startup with too many features and a leaky user journey. You interview users, find the main point of friction and test a smaller change against the problem they actually reported.",
    "learningObjectives": [
      "product management",
      "UX",
      "prioritization"
    ],
    "prerequisites": [
      "m16"
    ],
    "objectives": [
      {
        "id": "m17-obj-1",
        "label": "Interview users",
        "interactionTarget": "story:m17:objective:1",
        "required": true
      },
      {
        "id": "m17-obj-2",
        "label": "map their journey",
        "interactionTarget": "story:m17:objective:2",
        "required": true
      },
      {
        "id": "m17-obj-3",
        "label": "find the main friction",
        "interactionTarget": "story:m17:objective:3",
        "required": true
      },
      {
        "id": "m17-obj-4",
        "label": "prioritize one fix",
        "interactionTarget": "story:m17:objective:4",
        "required": true
      },
      {
        "id": "m17-obj-5",
        "label": "test the revised flow.",
        "interactionTarget": "story:m17:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "A second user test checks whether the chosen fix worked.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 260,
      "skillBadges": [
        "Product Management"
      ],
      "portfolioArtifacts": [
        "User journey improvement"
      ]
    },
    "storyFlags": [
      "m17_complete"
    ],
    "nextMissionId": "m18",
    "ending": "You map the user journey and test a simpler core flow. The team keeps the change that addresses the observed problem and moves the rest of the feature list out of the way.",
    "cliffhanger": "The improved flow is ready for more users, but David and Kanyin want to spend the whole campaign budget before defining what success should look like."
  },
  {
    "id": "m18",
    "chapterId": "ch09",
    "title": "The Growth Experiment",
    "state": "Kano",
    "location": "Kano story district",
    "npcIds": [
      "david",
      "kanyin"
    ],
    "npcs": [
      "David",
      "Kanyin"
    ],
    "narrativePurpose": "David and Kanyin want to launch a costly campaign for the revised product. You define the audience, make a testable prediction, choose meaningful measures and examine a growth offer that promises users without explaining where they come from.",
    "learningObjectives": [
      "growth experiments",
      "funnels",
      "metrics"
    ],
    "prerequisites": [
      "m17"
    ],
    "objectives": [
      {
        "id": "m18-obj-1",
        "label": "Define target users",
        "interactionTarget": "story:m18:objective:1",
        "required": true
      },
      {
        "id": "m18-obj-2",
        "label": "form a hypothesis",
        "interactionTarget": "story:m18:objective:2",
        "required": true
      },
      {
        "id": "m18-obj-3",
        "label": "prepare a campaign brief",
        "interactionTarget": "story:m18:objective:3",
        "required": true
      },
      {
        "id": "m18-obj-4",
        "label": "choose success metrics",
        "interactionTarget": "story:m18:objective:4",
        "required": true
      },
      {
        "id": "m18-obj-5",
        "label": "interpret results",
        "interactionTarget": "story:m18:objective:5",
        "required": true
      },
      {
        "id": "m18-obj-6",
        "label": "assess a suspicious growth offer.",
        "interactionTarget": "story:m18:objective:6",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "If the metrics are vanity-only, the player revises the experiment.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 270,
      "skillBadges": [
        "Growth Strategy"
      ],
      "portfolioArtifacts": [
        "Growth experiment brief"
      ]
    },
    "storyFlags": [
      "m18_complete"
    ],
    "nextMissionId": "m19",
    "ending": "You design a small measurable campaign, define what evidence would count as success and reject the unverifiable growth offer. The team learns from the test before committing the full budget.",
    "cliffhanger": "The experiment attracts an investor. Mcbond and Alpha.RWA want your help comparing the offer with the startup's runway, control and obligations before anyone signs."
  },
  {
    "id": "m19",
    "chapterId": "ch10",
    "title": "The Funding Decision",
    "state": "Edo",
    "location": "Edo story district",
    "npcIds": [
      "mcbond",
      "alpha-rwa"
    ],
    "npcs": [
      "Mcbond",
      "Alpha.RWA"
    ],
    "narrativePurpose": "An investor offers the startup a large headline valuation, but the terms include milestones, allocation and control conditions. Mcbond and Alpha.RWA ask you to compare the proposal with the budget and identify obligations the founders could be overlooking.",
    "learningObjectives": [
      "grants",
      "venture capital",
      "tokenomics"
    ],
    "prerequisites": [
      "m18"
    ],
    "objectives": [
      {
        "id": "m19-obj-1",
        "label": "Review a budget",
        "interactionTarget": "story:m19:objective:1",
        "required": true
      },
      {
        "id": "m19-obj-2",
        "label": "compare proposals",
        "interactionTarget": "story:m19:objective:2",
        "required": true
      },
      {
        "id": "m19-obj-3",
        "label": "inspect allocation and vesting",
        "interactionTarget": "story:m19:objective:3",
        "required": true
      },
      {
        "id": "m19-obj-4",
        "label": "flag conflicts",
        "interactionTarget": "story:m19:objective:4",
        "required": true
      },
      {
        "id": "m19-obj-5",
        "label": "recommend a responsible option.",
        "interactionTarget": "story:m19:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "A comparison worksheet exposes missing assumptions.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 280,
      "skillBadges": [
        "Funding Analysis"
      ],
      "portfolioArtifacts": [
        "Funding comparison memo"
      ]
    },
    "storyFlags": [
      "m19_complete"
    ],
    "nextMissionId": "m20",
    "ending": "You compare the proposals against runway, milestones, vesting and control rights. The founders choose the option they can responsibly deliver on rather than the one with the largest headline number.",
    "cliffhanger": "The investor's deck also promotes a tokenized property as fully backed. BigWealth asks you to find the legal and operational evidence behind that claim before it reaches the public."
  },
  {
    "id": "m20",
    "chapterId": "ch10",
    "title": "The Asset That Exists on Paper",
    "state": "Edo",
    "location": "Edo story district",
    "npcIds": [
      "bigwealth",
      "bigsam"
    ],
    "npcs": [
      "BigWealth",
      "BigSam"
    ],
    "narrativePurpose": "BigWealth's property-token pitch claims that every token is fully backed, but the deck does not show enough proof of ownership, custody or redemption. You examine the documents and prepare the questions the issuer must answer before marketing the asset.",
    "learningObjectives": [
      "tokenization",
      "custody",
      "redemption",
      "due diligence"
    ],
    "prerequisites": [
      "m19"
    ],
    "objectives": [
      {
        "id": "m20-obj-1",
        "label": "Review documentation",
        "interactionTarget": "story:m20:objective:1",
        "required": true
      },
      {
        "id": "m20-obj-2",
        "label": "find missing ownership evidence",
        "interactionTarget": "story:m20:objective:2",
        "required": true
      },
      {
        "id": "m20-obj-3",
        "label": "inspect custody/redemption",
        "interactionTarget": "story:m20:objective:3",
        "required": true
      },
      {
        "id": "m20-obj-4",
        "label": "test claims against evidence",
        "interactionTarget": "story:m20:objective:4",
        "required": true
      },
      {
        "id": "m20-obj-5",
        "label": "write questions required before launch.",
        "interactionTarget": "story:m20:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "Missing evidence stays an explicit blocker; the game never invents legal proof.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 290,
      "skillBadges": [
        "Due Diligence"
      ],
      "portfolioArtifacts": [
        "RWA due-diligence report"
      ]
    },
    "storyFlags": [
      "m20_complete"
    ],
    "nextMissionId": "m21",
    "ending": "You identify the missing evidence around ownership, custody and redemption and write a clear due-diligence list. The team pauses the claim until the issuer can support it.",
    "cliffhanger": "During the review, an AI-generated risk report flags a transaction that does not match the source records. Blessing and Odion need you to find out whether the report or the data is wrong."
  },
  {
    "id": "m21",
    "chapterId": "ch11",
    "title": "The Machine That Thinks",
    "state": "Cross River",
    "location": "Cross River story district",
    "npcIds": [
      "blessing",
      "odion"
    ],
    "npcs": [
      "Blessing",
      "Odion"
    ],
    "narrativePurpose": "Blessing and Odion receive an AI report that confidently accuses a wallet of suspicious activity, but one claim conflicts with the source record. You trace the claim, identify the unsupported assumption and retest the analysis before it affects a real person.",
    "learningObjectives": [
      "AI verification",
      "on-chain analysis",
      "human oversight"
    ],
    "prerequisites": [
      "m20"
    ],
    "objectives": [
      {
        "id": "m21-obj-1",
        "label": "Inspect report",
        "interactionTarget": "story:m21:objective:1",
        "required": true
      },
      {
        "id": "m21-obj-2",
        "label": "verify on-chain claims using source records",
        "interactionTarget": "story:m21:objective:2",
        "required": true
      },
      {
        "id": "m21-obj-3",
        "label": "find false assumptions",
        "interactionTarget": "story:m21:objective:3",
        "required": true
      },
      {
        "id": "m21-obj-4",
        "label": "improve instructions",
        "interactionTarget": "story:m21:objective:4",
        "required": true
      },
      {
        "id": "m21-obj-5",
        "label": "retest output.",
        "interactionTarget": "story:m21:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "A source-check checklist helps the player correct the AI report.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 300,
      "skillBadges": [
        "AI Verification"
      ],
      "portfolioArtifacts": [
        "Verified AI analysis"
      ]
    },
    "storyFlags": [
      "m21_complete"
    ],
    "nextMissionId": "m22",
    "ending": "You find the mismatch between the AI report and the source record, correct the prompt or input and rerun the check. The team keeps human review in place for conclusions that could affect people or funds.",
    "cliffhanger": "The corrected report reveals a transfer between two networks. Princess and Racheal want you to trace the route without assuming that a bridge works like either chain."
  },
  {
    "id": "m22",
    "chapterId": "ch11",
    "title": "Beyond One Blockchain",
    "state": "Cross River",
    "location": "Cross River story district",
    "npcIds": [
      "princess",
      "racheal"
    ],
    "npcs": [
      "Princess",
      "Racheal"
    ],
    "narrativePurpose": "Princess and Racheal are tracing a transfer across networks after the AI report exposed a gap in the team's records. You check the network, bridge role, destination and fees, and distinguish a real interface from a fake one before recommending the next step.",
    "learningObjectives": [
      "layer-one/two networks",
      "bridges",
      "cross-chain risk"
    ],
    "prerequisites": [
      "m21"
    ],
    "objectives": [
      {
        "id": "m22-obj-1",
        "label": "Compare blockchain networks",
        "interactionTarget": "story:m22:objective:1",
        "required": true
      },
      {
        "id": "m22-obj-2",
        "label": "trace a transfer",
        "interactionTarget": "story:m22:objective:2",
        "required": true
      },
      {
        "id": "m22-obj-3",
        "label": "inspect the bridge role",
        "interactionTarget": "story:m22:objective:3",
        "required": true
      },
      {
        "id": "m22-obj-4",
        "label": "identify a fake interface",
        "interactionTarget": "story:m22:objective:4",
        "required": true
      },
      {
        "id": "m22-obj-5",
        "label": "explain risks and fees.",
        "interactionTarget": "story:m22:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "A suspicious bridge interface is safely rejected.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 310,
      "skillBadges": [
        "Interoperability"
      ],
      "portfolioArtifacts": [
        "Cross-chain risk checklist"
      ]
    },
    "storyFlags": [
      "m22_complete"
    ],
    "nextMissionId": "m23",
    "ending": "You reconstruct the cross-network transfer and document the bridge's dependencies, fees and remaining uncertainties. The team records what the evidence proves instead of treating a successful transfer as proof that every bridge is safe.",
    "cliffhanger": "The team needs funding for a safer integration, and the DAO must decide how to use its treasury. Seun and Dorcas want you to read the proposal beyond its headline."
  },
  {
    "id": "m23",
    "chapterId": "ch12",
    "title": "The Vote That Changed Everything",
    "state": "Bauchi",
    "location": "Bauchi story district",
    "npcIds": [
      "seun",
      "dorcas"
    ],
    "npcs": [
      "Seun",
      "Dorcas"
    ],
    "narrativePurpose": "The DAO is voting on a treasury proposal that would fund the next integration. Seun and Dorcas ask you to compare costs, beneficiaries and execution limits, inspect the treasury and cast an informed vote rather than following the loudest member.",
    "learningObjectives": [
      "DAOs",
      "governance",
      "treasury management"
    ],
    "prerequisites": [
      "m22"
    ],
    "objectives": [
      {
        "id": "m23-obj-1",
        "label": "Read proposals",
        "interactionTarget": "story:m23:objective:1",
        "required": true
      },
      {
        "id": "m23-obj-2",
        "label": "compare trade-offs",
        "interactionTarget": "story:m23:objective:2",
        "required": true
      },
      {
        "id": "m23-obj-3",
        "label": "inspect a treasury",
        "interactionTarget": "story:m23:objective:3",
        "required": true
      },
      {
        "id": "m23-obj-4",
        "label": "cast a governance vote",
        "interactionTarget": "story:m23:objective:4",
        "required": true
      },
      {
        "id": "m23-obj-5",
        "label": "explain the outcome and participation limits.",
        "interactionTarget": "story:m23:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "A proposal comparison guide supports a second attempt.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 320,
      "skillBadges": [
        "Governance"
      ],
      "portfolioArtifacts": [
        "Governance decision record"
      ]
    },
    "storyFlags": [
      "m23_complete"
    ],
    "nextMissionId": "m24",
    "ending": "You compare the proposal with the treasury, cast your vote and explain both the result and its limits. The group records who is responsible for carrying the decision out after voting closes.",
    "cliffhanger": "Before the approved integration can ship, Joe and Mike find a serious vulnerability in the release candidate. The launch team wants to keep the date; the evidence says stop."
  },
  {
    "id": "m24",
    "chapterId": "ch12",
    "title": "The Audit Nobody Wanted",
    "state": "Bauchi",
    "location": "Bauchi story district",
    "npcIds": [
      "joe",
      "mike"
    ],
    "npcs": [
      "Joe",
      "Mike"
    ],
    "narrativePurpose": "Joe and Mike discover a vulnerability in the integration approved by the DAO. You assess its likely impact, reproduce the failure in a review environment, document a responsible disclosure and verify the patch before the team resumes release planning.",
    "learningObjectives": [
      "audits",
      "threat modeling",
      "disclosure"
    ],
    "prerequisites": [
      "m23"
    ],
    "objectives": [
      {
        "id": "m24-obj-1",
        "label": "Read a finding",
        "interactionTarget": "story:m24:objective:1",
        "required": true
      },
      {
        "id": "m24-obj-2",
        "label": "estimate impact",
        "interactionTarget": "story:m24:objective:2",
        "required": true
      },
      {
        "id": "m24-obj-3",
        "label": "prioritize a fix",
        "interactionTarget": "story:m24:objective:3",
        "required": true
      },
      {
        "id": "m24-obj-4",
        "label": "prepare disclosure",
        "interactionTarget": "story:m24:objective:4",
        "required": true
      },
      {
        "id": "m24-obj-5",
        "label": "verify the patch in a review environment.",
        "interactionTarget": "story:m24:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "The launch remains blocked until the remediation test passes.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 330,
      "skillBadges": [
        "Security Review"
      ],
      "portfolioArtifacts": [
        "Security remediation report"
      ]
    },
    "storyFlags": [
      "m24_complete"
    ],
    "nextMissionId": "m25",
    "ending": "You document the vulnerability, verify the correction in a review environment and give the team evidence for a safer release decision. The launch remains paused until the fix has been reviewed.",
    "cliffhanger": "While the team prepares the corrected release, Gbemi and FemiY ask what buyers really receive when they purchase a digital collectible promoted by the project."
  },
  {
    "id": "m25",
    "chapterId": "ch13",
    "title": "Ownership Is Not a Screenshot",
    "state": "Abia",
    "location": "Abia story district",
    "npcIds": [
      "gbemi",
      "femiy"
    ],
    "npcs": [
      "Gbemi",
      "FemiY"
    ],
    "narrativePurpose": "Gbemi and FemiY are preparing a digital collectible release, but the sales page promises ownership and commercial rights that the licence may not grant. You compare the token, the written terms and the creator's actual obligations before rewriting the offer.",
    "learningObjectives": [
      "NFTs",
      "copyright",
      "licensing",
      "creator economies"
    ],
    "prerequisites": [
      "m24"
    ],
    "objectives": [
      {
        "id": "m25-obj-1",
        "label": "Inspect a collectible",
        "interactionTarget": "story:m25:objective:1",
        "required": true
      },
      {
        "id": "m25-obj-2",
        "label": "read license terms",
        "interactionTarget": "story:m25:objective:2",
        "required": true
      },
      {
        "id": "m25-obj-3",
        "label": "identify buyer rights",
        "interactionTarget": "story:m25:objective:3",
        "required": true
      },
      {
        "id": "m25-obj-4",
        "label": "compare creator revenue models",
        "interactionTarget": "story:m25:objective:4",
        "required": true
      },
      {
        "id": "m25-obj-5",
        "label": "rewrite unclear terms.",
        "interactionTarget": "story:m25:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "Ambiguous ownership language must be clarified before publishing.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 340,
      "skillBadges": [
        "Creator Rights"
      ],
      "portfolioArtifacts": [
        "Creator licensing explainer"
      ]
    },
    "storyFlags": [
      "m25_complete"
    ],
    "nextMissionId": "m26",
    "ending": "You identify the rights the licence actually grants and remove unsupported promises from the sales copy. The creators publish clearer terms so buyers can understand what they are and are not receiving.",
    "cliffhanger": "The corrected release links to an old public repository containing part of the project's history. Softstorm and IamAbdul recognise a contributor dispute in its commit history and ask you to help reopen the work responsibly."
  },
  {
    "id": "m26",
    "chapterId": "ch14",
    "title": "The Open-Source Promise",
    "state": "Niger",
    "location": "Niger story district",
    "npcIds": [
      "softstorm",
      "iamabdul"
    ],
    "npcs": [
      "Softstorm",
      "IamAbdul"
    ],
    "narrativePurpose": "Softstorm and IamAbdul reconnect with you over an abandoned repository linked to the collectible project's history. You inspect the issues and contribution rules, choose a small fix, improve the documentation and prepare a change that others can review.",
    "learningObjectives": [
      "Git",
      "documentation",
      "pull requests",
      "collaboration"
    ],
    "prerequisites": [
      "m25"
    ],
    "objectives": [
      {
        "id": "m26-obj-1",
        "label": "Explore a repository",
        "interactionTarget": "story:m26:objective:1",
        "required": true
      },
      {
        "id": "m26-obj-2",
        "label": "find an issue",
        "interactionTarget": "story:m26:objective:2",
        "required": true
      },
      {
        "id": "m26-obj-3",
        "label": "improve documentation",
        "interactionTarget": "story:m26:objective:3",
        "required": true
      },
      {
        "id": "m26-obj-4",
        "label": "propose a contribution",
        "interactionTarget": "story:m26:objective:4",
        "required": true
      },
      {
        "id": "m26-obj-5",
        "label": "explain version control and review.",
        "interactionTarget": "story:m26:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "A contribution checklist helps the player revise the proposed change.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 350,
      "skillBadges": [
        "Open Source"
      ],
      "portfolioArtifacts": [
        "Open-source contribution proposal"
      ]
    },
    "storyFlags": [
      "m26_complete",
      "web3_archive_fragment"
    ],
    "nextMissionId": "m27",
    "ending": "You submit a focused contribution with clear documentation and a reviewable change. Softstorm and IamAbdul use the example to restart the conversation around credit, licences and how to disagree without losing the work.",
    "cliffhanger": "The repository references the same archive Joe_Sef and Larai helped you investigate in Lagos. They ask you to assemble the evidence from the journey and distinguish proven facts from assumptions."
  },
  {
    "id": "m27",
    "chapterId": "ch14",
    "title": "The Economy of Trust",
    "state": "Niger",
    "location": "Niger story district",
    "npcIds": [
      "joe-sef",
      "larai"
    ],
    "npcs": [
      "Joe_Sef",
      "Larai"
    ],
    "narrativePurpose": "Joe_Sef and Larai ask you to reconstruct an archive that connects the Lagos payment dispute, the product teams and the later investigations. You compare saved evidence, resolve contradictions where possible and map the different skills and people involved.",
    "learningObjectives": [
      "evidence evaluation",
      "ecosystem roles",
      "research synthesis"
    ],
    "prerequisites": [
      "m26"
    ],
    "objectives": [
      {
        "id": "m27-obj-1",
        "label": "Review saved evidence",
        "interactionTarget": "story:m27:objective:1",
        "required": true
      },
      {
        "id": "m27-obj-2",
        "label": "connect clues",
        "interactionTarget": "story:m27:objective:2",
        "required": true
      },
      {
        "id": "m27-obj-3",
        "label": "identify contradictions",
        "interactionTarget": "story:m27:objective:3",
        "required": true
      },
      {
        "id": "m27-obj-4",
        "label": "map professional roles",
        "interactionTarget": "story:m27:objective:4",
        "required": true
      },
      {
        "id": "m27-obj-5",
        "label": "submit a reconstruction.",
        "interactionTarget": "story:m27:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "Contradictions must be supported by evidence or left unresolved.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 360,
      "skillBadges": [
        "Evidence Synthesis"
      ],
      "portfolioArtifacts": [
        "Web3 archive reconstruction"
      ]
    },
    "storyFlags": [
      "m27_complete",
      "kitcity_destination_unlocked"
    ],
    "nextMissionId": "m28",
    "ending": "You assemble a timeline, label what is verified and leave unresolved claims clearly marked. The combined evidence reveals a route to KitCity and explains why the earlier incidents were connected by the people and work around them.",
    "cliffhanger": "The archive's final clue points to a field challenge in Kogi. Unique and Christol want you to combine the skills you have practised on one problem with real constraints."
  },
  {
    "id": "m28",
    "chapterId": "ch15",
    "title": "Every Piece Matters",
    "state": "Kogi",
    "location": "Kogi story district",
    "npcIds": [
      "unique",
      "christol"
    ],
    "npcs": [
      "Unique",
      "Christol"
    ],
    "narrativePurpose": "Unique and Christol give you a field challenge that combines a user problem, a product decision, a security concern and a public explanation. You coordinate the right people, build a small safe prototype and defend the result with evidence.",
    "learningObjectives": [
      "systems thinking",
      "teamwork",
      "practical judgment"
    ],
    "prerequisites": [
      "m27"
    ],
    "objectives": [
      {
        "id": "m28-obj-1",
        "label": "Identify the problem",
        "interactionTarget": "story:m28:objective:1",
        "required": true
      },
      {
        "id": "m28-obj-2",
        "label": "choose relevant skills",
        "interactionTarget": "story:m28:objective:2",
        "required": true
      },
      {
        "id": "m28-obj-3",
        "label": "coordinate a team",
        "interactionTarget": "story:m28:objective:3",
        "required": true
      },
      {
        "id": "m28-obj-4",
        "label": "build a safe prototype",
        "interactionTarget": "story:m28:objective:4",
        "required": true
      },
      {
        "id": "m28-obj-5",
        "label": "present the result.",
        "interactionTarget": "story:m28:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "The assessment gives targeted feedback and can be retried.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 370,
      "skillBadges": [
        "Systems Thinking"
      ],
      "portfolioArtifacts": [
        "Integrated team solution"
      ]
    },
    "storyFlags": [
      "m28_complete"
    ],
    "nextMissionId": "m29",
    "ending": "You deliver a small prototype, explain the trade-offs and show which evidence supports the result. The team signs off the route because you can connect technical choices with the people affected by them.",
    "cliffhanger": "The route ends at KitCity's gate. Softstorm, White Coach and Craftore have heard the story of your work; now they want to see how you handle a new problem without a scripted answer."
  },
  {
    "id": "m29",
    "chapterId": "final",
    "title": "The Gatekeeper",
    "state": "KitCity",
    "location": "KitCity central district",
    "npcIds": [
      "softstorm",
      "white-coach",
      "craftore"
    ],
    "npcs": [
      "Softstorm",
      "White Coach",
      "Craftore"
    ],
    "narrativePurpose": "You arrive in KitCity, where builders, educators, researchers, traders and creators work side by side. Softstorm welcomes you, White Coach shows the available paths and Craftore asks you to choose the kind of practical challenge you want to attempt.",
    "learningObjectives": [
      "career exploration",
      "specialization"
    ],
    "prerequisites": [
      "m28"
    ],
    "objectives": [
      {
        "id": "m29-obj-1",
        "label": "Explore the central district",
        "interactionTarget": "story:m29:objective:1",
        "required": true
      },
      {
        "id": "m29-obj-2",
        "label": "meet representatives",
        "interactionTarget": "story:m29:objective:2",
        "required": true
      },
      {
        "id": "m29-obj-3",
        "label": "choose a specialization",
        "interactionTarget": "story:m29:objective:3",
        "required": true
      },
      {
        "id": "m29-obj-4",
        "label": "register for a practical assessment.",
        "interactionTarget": "story:m29:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "The player can explore KitCity and return to the assessment later.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 380,
      "skillBadges": [
        "KitCity Explorer"
      ],
      "portfolioArtifacts": [
        "KitCity specialization plan"
      ]
    },
    "storyFlags": [
      "m29_complete"
    ],
    "nextMissionId": "m30",
    "ending": "You meet the people who run KitCity's different workspaces and choose a specialization for the assessment. Craftore makes it clear that the city values demonstrated work, honest limits and the ability to ask for help.",
    "cliffhanger": "The assessment hall is ready. Your challenge will follow the path you chose, and the result must show your own decisions rather than memorised answers."
  },
  {
    "id": "m30",
    "chapterId": "final",
    "title": "Prove Yourself",
    "state": "KitCity",
    "location": "KitCity central district",
    "npcIds": [
      "softstorm",
      "iamabdul",
      "joe-sef",
      "larai",
      "unique",
      "christol",
      "craftore"
    ],
    "npcs": [
      "Softstorm",
      "IamAbdul",
      "Joe_Sef",
      "Larai",
      "Unique",
      "Christol",
      "Craftore"
    ],
    "narrativePurpose": "Your KitCity assessment follows the specialization you selected. With the mentors available as collaborators, you work through a hands-on challenge, review feedback and improve the result before submitting evidence of what you can do.",
    "learningObjectives": [
      "practical execution",
      "professional judgment"
    ],
    "prerequisites": [
      "m29"
    ],
    "objectives": [
      {
        "id": "m30-obj-1",
        "label": "Select a specialization",
        "interactionTarget": "story:m30:objective:1",
        "required": true
      },
      {
        "id": "m30-obj-2",
        "label": "complete the hands-on challenge",
        "interactionTarget": "story:m30:objective:2",
        "required": true
      },
      {
        "id": "m30-obj-3",
        "label": "review feedback",
        "interactionTarget": "story:m30:objective:3",
        "required": true
      },
      {
        "id": "m30-obj-4",
        "label": "submit the result",
        "interactionTarget": "story:m30:objective:4",
        "required": true
      },
      {
        "id": "m30-obj-5",
        "label": "retry if needed.",
        "interactionTarget": "story:m30:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "Every specialization includes feedback and a retry route.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 390,
      "skillBadges": [
        "Practitioner Assessment"
      ],
      "portfolioArtifacts": [
        "Practical assessment evidence"
      ]
    },
    "storyFlags": [
      "m30_complete"
    ],
    "nextMissionId": "m31",
    "ending": "You complete the practical task, review the feedback and make a targeted improvement before submitting your work. Your practitioner record reflects demonstrated skills and progress, not a promise of employment or external accreditation.",
    "cliffhanger": "The mentors gather to discuss the choices you made throughout the journey. They want to hear which problems you now feel ready to take on and what you intend to build next."
  },
  {
    "id": "m31",
    "chapterId": "final",
    "title": "The Reveal",
    "state": "KitCity",
    "location": "KitCity central district",
    "npcIds": [
      "softstorm",
      "iamabdul",
      "joe-sef",
      "larai",
      "unique",
      "christol",
      "craftore"
    ],
    "npcs": [
      "Softstorm",
      "IamAbdul",
      "Joe_Sef",
      "Larai",
      "Unique",
      "Christol",
      "Craftore"
    ],
    "narrativePurpose": "The mentors revisit the clues and decisions from your journey, from the Lagos payment dispute to the KitCity assessment. You choose what Web3 means to you now, select a direction and receive a record of the work you demonstrated.",
    "learningObjectives": [
      "reflection",
      "career planning"
    ],
    "prerequisites": [
      "m30"
    ],
    "objectives": [
      {
        "id": "m31-obj-1",
        "label": "Review the journey",
        "interactionTarget": "story:m31:objective:1",
        "required": true
      },
      {
        "id": "m31-obj-2",
        "label": "choose what Web3 means to the player now",
        "interactionTarget": "story:m31:objective:2",
        "required": true
      },
      {
        "id": "m31-obj-3",
        "label": "select a future direction",
        "interactionTarget": "story:m31:objective:3",
        "required": true
      },
      {
        "id": "m31-obj-4",
        "label": "receive the practitioner record.",
        "interactionTarget": "story:m31:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "The player can revisit the reveal and journal at any time.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 400,
      "skillBadges": [
        "Ecosystem Practitioner"
      ],
      "portfolioArtifacts": [
        "Practitioner journey record"
      ]
    },
    "storyFlags": [
      "m31_complete",
      "main_story_complete"
    ],
    "nextMissionId": null,
    "ending": "You connect the journey's incidents to the people, products and responsibilities behind them, then choose a direction for your next project. Your practitioner record captures the work you completed and the skills you demonstrated.",
    "cliffhanger": "A new request appears on KitCity's board: someone has a problem that needs a team. This time, you get to choose how to begin."
  }
];

export const MISSIONS = RAW_MISSIONS.map((mission) => Object.freeze({
  ...mission,
  npcIds: Object.freeze(mission.npcIds),
  npcs: Object.freeze(mission.npcs),
  learningObjectives: Object.freeze(mission.learningObjectives),
  prerequisites: Object.freeze(mission.prerequisites),
  objectives: Object.freeze(mission.objectives.map((objective) => Object.freeze(objective))),
  storyFlags: Object.freeze(mission.storyFlags),
  rewards: Object.freeze({ ...mission.rewards, skillBadges: Object.freeze(mission.rewards.skillBadges), portfolioArtifacts: Object.freeze(mission.rewards.portfolioArtifacts) }),
  failureAndRetry: Object.freeze({ ...mission.failureAndRetry })
}));


export const STORY_ROUTE_ORDER = [
  "Lagos","Ogun","Oyo","Osun","Ekiti","Ondo","Delta","Bayelsa","Rivers",
  "Akwa Ibom","Anambra","Enugu","Ebonyi","Abia","Imo","Plateau","Nasarawa",
  "Benue","Kano","Jigawa","Bauchi","Gombe","Yobe","Borno","Adamawa","Taraba",
  "Kaduna","Katsina","Zamfara","Sokoto","Kebbi","Edo","Cross River","Niger",
  "Kogi","Kwara"
];

export const STATE_ROUTE = STORY_ROUTE_ORDER.map((state, index) => {
  const mission = MISSIONS.find((item) => item.state === state);
  return Object.freeze({
    state,
    routeIndex: index + 1,
    routeStatus: mission ? "mission-stop" : "planned-story-stop",
    missionId: mission ? mission.id : null,
    note: mission ? "Main-story mission stop." : "Planned narrative stop to be connected to the journey; no FCT detour."
  });
});

export const FIRST_ENCOUNTER_ORDER = Object.freeze((() => {
  const seen = new Set();
  const ordered = [];
  MISSIONS.forEach((mission) => mission.npcs.forEach((name) => {
    if (!seen.has(name)) { seen.add(name); ordered.push(name); }
  }));
  return ordered;
})());

export const MISSION_BY_ID = Object.freeze(Object.fromEntries(MISSIONS.map((mission) => [mission.id, mission])));

export function getNextMission(completedIds = []) {
  const completed = new Set(completedIds);
  return MISSIONS.find((mission) => !completed.has(mission.id) && mission.prerequisites.every((id) => completed.has(id))) || null;
}

export function validateChronicles() {
  const errors = [];
  const ids = new Set();
  MISSIONS.forEach((mission) => {
    if (ids.has(mission.id)) errors.push("Duplicate mission id: " + mission.id);
    ids.add(mission.id);
    if (!mission.title || !mission.chapterId || !mission.state || !mission.npcs.length) errors.push("Missing core metadata: " + mission.id);
    if (!Array.isArray(mission.objectives) || !mission.objectives.length) errors.push("No objectives: " + mission.id);
    if (mission.nextMissionId && !MISSIONS.some((candidate) => candidate.id === mission.nextMissionId)) errors.push("Unknown next mission: " + mission.id);
    mission.prerequisites.forEach((id) => { if (!MISSIONS.some((candidate) => candidate.id === id)) errors.push("Unknown prerequisite " + id + " for " + mission.id); });
  });
  const names = new Set(CHARACTER_ORDER);
  if (names.size !== 50) errors.push("Expected 50 unique supplied character names.");
  if (FIRST_ENCOUNTER_ORDER.length !== CHARACTER_ORDER.length || FIRST_ENCOUNTER_ORDER.some((name, index) => name !== CHARACTER_ORDER[index])) errors.push("First story encounters must follow the supplied 50-character order.");
  if (NIGERIAN_STATES.length !== 36 || NIGERIAN_STATES.includes("Federal Capital Territory") || STORY_ROUTE_ORDER.length !== 36 || new Set(STORY_ROUTE_ORDER).size !== 36 || STORY_ROUTE_ORDER.some((state) => !NIGERIAN_STATES.includes(state))) errors.push("State route must cover all 36 states exactly once and exclude FCT.");
  const covered = new Set(MISSIONS.map((mission) => mission.state));
  const plannedStateCoverage = STATE_ROUTE.map((stop) => ({ ...stop, coveredByMission: covered.has(stop.state) }));
  return { valid: errors.length === 0, errors, missionCount: MISSIONS.length, characterCount: CHARACTER_ORDER.length, plannedStateCoverage };
}
