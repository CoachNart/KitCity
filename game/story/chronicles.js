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
    "narrativePurpose": "The player gets pulled into a dispute after a buyer claims to have paid for a laptop with crypto. The shop has no matching payment, and the player must help verify what really happened before the laptop is handed over.",
    "openingPanels": [
      {
        "id": "m01-panel-1",
        "type": "establishing",
        "caption": "8:17 AM in Lagos. Danfo horns, roadside vendors, and a normal morning—until an argument about a missing crypto payment catches your attention."
      },
      {
        "id": "m01-panel-2",
        "type": "dialogue",
        "speaker": "Softstorm",
        "text": "The buyer says he sent 120 USDC. All I have is a screenshot, and the money hasn't arrived."
      },
      {
        "id": "m01-panel-3",
        "type": "dialogue",
        "speaker": "IamAbdul",
        "text": "Then don't release the laptop yet. Let's check the transaction instead of guessing."
      }
    ],
    "dialogue": [
      {
        "id": "m01-dialogue-1",
        "speaker": "Softstorm",
        "text": "If the payment is fake, na me go explain why the laptop is gone."
      },
      {
        "id": "m01-dialogue-2",
        "speaker": "IamAbdul",
        "text": "A confirmed transaction can still go to the wrong address. We need to check the details."
      },
      {
        "id": "m01-dialogue-player",
        "speaker": "PLAYER",
        "text": "Abeg, wetin una dey argue about? Let me see what happened."
      }
    ],
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
      "The player checks the shop's payment records and the simulated public transaction record",
      "The player identifies that the recipient address does not match the shop's expected address",
      "The player decides not to release the laptop until the correct payment arrives"
    ],
    "failureAndRetry": {
      "onFailure": "If the player trusts the screenshot or misreads the confirmed transaction, Softstorm and IamAbdul challenge the assumption and let the player compare the evidence again.",
      "retry": "Retry the current decision without losing completed investigation steps. All transaction details are simulated."
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
    "ending": "The player helps Softstorm discover that the confirmed transaction went to a different address. The laptop stays in the shop until the correct payment arrives.",
    "cliffhanger": "The buyer's mistake raises a bigger question: how do people read blockchain records, manage addresses, and avoid making the same mistake themselves?",
    "safeSimulationRequired": true
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
    "narrativePurpose": "The wrong-address payment sends the player to a small technology workspace, where Joe_Sef and Larai help trace how wallets, blockchain records and online platforms fit together.",
    "openingPanels": [
      {
        "id": "m02-panel-1",
        "type": "establishing",
        "caption": "The wrong-address payment sends the player to a small technology workspace, where Joe_Sef and Larai help trace how wallets, blockchain records and online platforms fit together."
      },
      {
        "id": "m02-panel-2",
        "type": "dialogue",
        "speaker": "Joe_Sef",
        "text": "You’re the person from the laptop shop, right? That payment trail brought you here. Before we chase another screenshot, let’s understand who gets to keep records and who gets to change the rules."
      },
      {
        "id": "m02-panel-3",
        "type": "dialogue",
        "speaker": "Larai",
        "text": "And no, Web3 is not just a new app with a coin attached. Look at these examples: who owns the account, who controls the platform, and what happens if the platform shuts its door?"
      }
    ],
    "dialogue": [
      {
        "id": "m02-dialogue-1",
        "speaker": "Joe_Sef",
        "text": "You’re the person from the laptop shop, right? That payment trail brought you here. Before we chase another screenshot, let’s understand who gets to keep records and who gets to change the rules."
      },
      {
        "id": "m02-dialogue-2",
        "speaker": "Larai",
        "text": "And no, Web3 is not just a new app with a coin attached. Look at these examples: who owns the account, who controls the platform, and what happens if the platform shuts its door?"
      },
      {
        "id": "m02-dialogue-3",
        "speaker": "PLAYER",
        "text": "So I shouldn't just memorise the names. I should look at who has control—and what the system lets people do."
      }
    ],
    "learningObjectives": [
      "internet history",
      "centralized platforms",
      "blockchain-based systems"
    ],
    "prerequisites": [
      "m01"
    ],
    "objectives": [
      {
        "id": "m02-obj-1",
        "label": "Explore the internet-history exhibit",
        "interactionTarget": "story:m02:objective:1",
        "required": true
      },
      {
        "id": "m02-obj-2",
        "label": "classify Web1, Web2 and Web3 examples",
        "interactionTarget": "story:m02:objective:2",
        "required": true
      },
      {
        "id": "m02-obj-3",
        "label": "compare platform control with blockchain-based systems",
        "interactionTarget": "story:m02:objective:3",
        "required": true
      },
      {
        "id": "m02-obj-4",
        "label": "ask about the mark.",
        "interactionTarget": "story:m02:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "All required mission objectives are completed",
      "The player submits or reviews the relevant evidence",
      "The mission's completion narrative is triggered"
    ],
    "failureAndRetry": {
      "onFailure": "Incorrect classifications return the player to the exhibit with a visual hint.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 110,
      "skillBadges": [
        "Internet History"
      ],
      "portfolioArtifacts": [
        "Internet evolution comparison"
      ]
    },
    "storyFlags": [
      "m02_complete"
    ],
    "nextMissionId": "m03",
    "ending": "Joe_Sef connects the payment trail to the wider question of who controls online services. Larai helps the player compare the trade-offs instead of treating Web3 as magic.",
    "cliffhanger": "A wallet demo nearby is attracting a crowd. Someone is promising to double people's test tokens if they hand over a recovery phrase.",
    "safeSimulationRequired": true
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
    "narrativePurpose": "A wallet demo becomes a security lesson when a fake helper offers to double the player's test tokens.",
    "openingPanels": [
      {
        "id": "m03-panel-1",
        "type": "establishing",
        "caption": "A wallet demo becomes a security lesson when a fake helper offers to double the player's test tokens."
      },
      {
        "id": "m03-panel-2",
        "type": "dialogue",
        "speaker": "Unique",
        "text": "Wallet ready. Now, before you celebrate, remember: a wallet is a key to your assets, not a bank that can reverse every mistake."
      },
      {
        "id": "m03-panel-3",
        "type": "dialogue",
        "speaker": "Smrt huntr",
        "text": "Hold on—this fellow says he can double the player's test tokens. His price? The recovery phrase. That's not a deal; that's somebody asking for the keys to your house."
      }
    ],
    "dialogue": [
      {
        "id": "m03-dialogue-1",
        "speaker": "Unique",
        "text": "Wallet ready. Now, before you celebrate, remember: a wallet is a key to your assets, not a bank that can reverse every mistake."
      },
      {
        "id": "m03-dialogue-2",
        "speaker": "Smrt huntr",
        "text": "Hold on—this fellow says he can double the player's test tokens. His price? The recovery phrase. That's not a deal; that's somebody asking for the keys to your house."
      },
      {
        "id": "m03-dialogue-3",
        "speaker": "PLAYER",
        "text": "If the phrase gives control, why would I hand it to the person claiming to help me? No be so."
      }
    ],
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
        "label": "Create a sandbox wallet",
        "interactionTarget": "story:m03:objective:1",
        "required": true
      },
      {
        "id": "m03-obj-2",
        "label": "receive test tokens",
        "interactionTarget": "story:m03:objective:2",
        "required": true
      },
      {
        "id": "m03-obj-3",
        "label": "send a simulated transaction",
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
      "onFailure": "The fake request is safely reset; the player can retry without real funds.",
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
    "ending": "The player creates a sandbox wallet, receives test tokens and rejects the fake helper. Unique praises the decision; Smrt huntr points out that security often means refusing a tempting shortcut.",
    "cliffhanger": "One test transfer has appeared in two different records. Goodness wants to know which details can be checked independently.",
    "safeSimulationRequired": true
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
    "narrativePurpose": "Two records disagree. The player traces a transaction and investigates what makes a shared ledger difficult to rewrite.",
    "openingPanels": [
      {
        "id": "m04-panel-1",
        "type": "establishing",
        "caption": "Two records disagree. The player traces a transaction and investigates what makes a shared ledger difficult to rewrite."
      },
      {
        "id": "m04-panel-2",
        "type": "dialogue",
        "speaker": "Goodness",
        "text": "Two screenshots, two stories, one transaction. I don't want guesses; I want the record we can trace."
      },
      {
        "id": "m04-panel-3",
        "type": "dialogue",
        "speaker": "Semi",
        "text": "Follow the transaction into its block, then look at the history around it. If someone proposes changing an accepted record, ask what proof and network rules would allow that."
      }
    ],
    "dialogue": [
      {
        "id": "m04-dialogue-1",
        "speaker": "Goodness",
        "text": "Two screenshots, two stories, one transaction. I don't want guesses; I want the record we can trace."
      },
      {
        "id": "m04-dialogue-2",
        "speaker": "Semi",
        "text": "Follow the transaction into its block, then look at the history around it. If someone proposes changing an accepted record, ask what proof and network rules would allow that."
      },
      {
        "id": "m04-dialogue-3",
        "speaker": "PLAYER",
        "text": "So we're not trusting the neatest-looking record. We're checking where it came from and whether the history supports it."
      }
    ],
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
        "label": "Inspect a simulated explorer",
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
        "Simulated transaction trace"
      ]
    },
    "storyFlags": [
      "m04_complete",
      "web3_ledger_record"
    ],
    "nextMissionId": "m05",
    "ending": "The player traces a simulated transaction to its block and challenges an unsupported edit. Semi saves the trace as evidence instead of relying on memory.",
    "cliffhanger": "The trail leads to a product team whose app keeps failing. The team has opinions about the design, but nobody has asked the users.",
    "safeSimulationRequired": true
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
    "narrativePurpose": "A hyped application is failing because its team built features before understanding its users.",
    "openingPanels": [
      {
        "id": "m05-panel-1",
        "type": "establishing",
        "caption": "A hyped application is failing because its team built features before understanding its users."
      },
      {
        "id": "m05-panel-2",
        "type": "dialogue",
        "speaker": "Blockqueen",
        "text": "Three redesigns, twelve new features, and people still can't finish the first task. Please tell me we're not about to add another button."
      },
      {
        "id": "m05-panel-3",
        "type": "dialogue",
        "speaker": "Christol",
        "text": "I can fix the code, but I need to know where the flow breaks. Give me a reproducible failure—not 'it feels buggy'."
      }
    ],
    "dialogue": [
      {
        "id": "m05-dialogue-1",
        "speaker": "Blockqueen",
        "text": "Three redesigns, twelve new features, and people still can't finish the first task. Please tell me we're not about to add another button."
      },
      {
        "id": "m05-dialogue-2",
        "speaker": "Christol",
        "text": "I can fix the code, but I need to know where the flow breaks. Give me a reproducible failure—not 'it feels buggy'."
      },
      {
        "id": "m05-dialogue-3",
        "speaker": "PLAYER",
        "text": "Let's watch two people try it. If they get stuck at the same point, we'll have something real to work with."
      }
    ],
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
        "label": "Interview two simulated users",
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
    "ending": "The team stops arguing over taste and tests the core journey with users. The player identifies the biggest failure and recommends a focused fix backed by evidence.",
    "cliffhanger": "The app's repair exposes another risk: a fictional smart contract is about to launch with a bug nobody has reproduced properly.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "A fictional contract has a bug before launch. Pressure to ship collides with the duty to protect users.",
    "openingPanels": [
      {
        "id": "m06-panel-1",
        "type": "establishing",
        "caption": "A fictional contract has a bug before launch. Pressure to ship collides with the duty to protect users."
      },
      {
        "id": "m06-panel-2",
        "type": "dialogue",
        "speaker": "Laloba",
        "text": "The launch countdown is loud. The permission check is missing. Guess which one can cost users more?"
      },
      {
        "id": "m06-panel-3",
        "type": "dialogue",
        "speaker": "BigSam",
        "text": "We promised a date, and the team is tired. But if the bug lets the wrong caller move funds, shipping it just transfers our deadline pressure to users."
      }
    ],
    "dialogue": [
      {
        "id": "m06-dialogue-1",
        "speaker": "Laloba",
        "text": "The launch countdown is loud. The permission check is missing. Guess which one can cost users more?"
      },
      {
        "id": "m06-dialogue-2",
        "speaker": "BigSam",
        "text": "We promised a date, and the team is tired. But if the bug lets the wrong caller move funds, shipping it just transfers our deadline pressure to users."
      },
      {
        "id": "m06-dialogue-3",
        "speaker": "PLAYER",
        "text": "Let's reproduce it in the sandbox, fix the rule, and test the normal path and the bad path before anyone launches."
      }
    ],
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
        "label": "Inspect a sandbox contract",
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
    "ending": "The player reproduces the contract bug in a sandbox and proposes a fix with tests. BigSam delays launch until the change is reviewed; Laloba records why the delay was necessary.",
    "cliffhanger": "A trader says a swap returned less than the screen promised. The quote looked good; the pool tells a different story.",
    "safeSimulationRequired": true
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
    "narrativePurpose": "A swap returns less than expected. The player investigates liquidity and the hidden costs behind a displayed price.",
    "openingPanels": [
      {
        "id": "m07-panel-1",
        "type": "establishing",
        "caption": "A swap returns less than expected. The player investigates liquidity and the hidden costs behind a displayed price."
      },
      {
        "id": "m07-panel-2",
        "type": "dialogue",
        "speaker": "LunaX",
        "text": "The quote showed a nice number. The final amount didn't. People blame the app, but first we need to inspect the pool and the trade size."
      },
      {
        "id": "m07-panel-3",
        "type": "dialogue",
        "speaker": "OxNight",
        "text": "And please don't tell me the token's logo looked familiar. Check the token address, liquidity, fee and price impact before pressing confirm."
      }
    ],
    "dialogue": [
      {
        "id": "m07-dialogue-1",
        "speaker": "LunaX",
        "text": "The quote showed a nice number. The final amount didn't. People blame the app, but first we need to inspect the pool and the trade size."
      },
      {
        "id": "m07-dialogue-2",
        "speaker": "OxNight",
        "text": "And please don't tell me the token's logo looked familiar. Check the token address, liquidity, fee and price impact before pressing confirm."
      },
      {
        "id": "m07-dialogue-3",
        "speaker": "PLAYER",
        "text": "Let's compare both simulated pools first. If the cheaper-looking quote moves the price more, it wasn't cheaper after all."
      }
    ],
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
        "label": "Compare simulated pools",
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
        "label": "execute a test swap",
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
      "onFailure": "The player retries with a smaller simulated swap and a fee breakdown.",
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
    "ending": "The player compares pool depth, estimates price impact, performs a test swap and checks the token approval. LunaX explains the difference between a displayed quote and actual execution.",
    "cliffhanger": "The next stop is an exchange where withdrawals are paused. Rumours are already travelling faster than the official update.",
    "safeSimulationRequired": true
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
    "narrativePurpose": "A withdrawal pause triggers rumours. The player must understand exchange mechanics and communicate only verified facts.",
    "openingPanels": [
      {
        "id": "m08-panel-1",
        "type": "establishing",
        "caption": "A withdrawal pause triggers rumours. The player must understand exchange mechanics and communicate only verified facts."
      },
      {
        "id": "m08-panel-2",
        "type": "dialogue",
        "speaker": "Moon",
        "text": "Withdrawals are delayed, and the group chat has already invented four explanations. We have one confirmed status and several unanswered questions."
      },
      {
        "id": "m08-panel-3",
        "type": "dialogue",
        "speaker": "The Cryptonian",
        "text": "We can explain what is known, when we will update people, and how custody works. We cannot promise a cause or a deadline nobody has verified."
      }
    ],
    "dialogue": [
      {
        "id": "m08-dialogue-1",
        "speaker": "Moon",
        "text": "Withdrawals are delayed, and the group chat has already invented four explanations. We have one confirmed status and several unanswered questions."
      },
      {
        "id": "m08-dialogue-2",
        "speaker": "The Cryptonian",
        "text": "We can explain what is known, when we will update people, and how custody works. We cannot promise a cause or a deadline nobody has verified."
      },
      {
        "id": "m08-dialogue-3",
        "speaker": "PLAYER",
        "text": "I'll separate confirmed facts from rumours, then write an update that tells users what to do next."
      }
    ],
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
        "label": "Place simulated market and limit orders",
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
        "label": "inspect a fictional withdrawal incident",
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
    "ending": "The player distinguishes market and limit orders, examines a fictional withdrawal incident and drafts a verified status update. The team communicates clearly without pretending to know more than it does.",
    "cliffhanger": "A spot trader nearby has taken a loss. The next decision is whether to review the plan—or try to win it back immediately.",
    "safeSimulationRequired": true
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
    "narrativePurpose": "A planned spot trade loses. The real test is whether the player reviews the process instead of chasing the loss.",
    "openingPanels": [
      {
        "id": "m09-panel-1",
        "type": "establishing",
        "caption": "A planned spot trade loses. The real test is whether the player reviews the process instead of chasing the loss."
      },
      {
        "id": "m09-panel-2",
        "type": "dialogue",
        "speaker": "Joseph Nnadi",
        "text": "The trade hit my invalidation. I know the rule. What I don't know is why my first thought was to enter again twice as big."
      },
      {
        "id": "m09-panel-3",
        "type": "dialogue",
        "speaker": "The Don",
        "text": "Because a loss can make a bad idea feel urgent. Show me the plan you wrote before the trade—not the story you're telling yourself now."
      }
    ],
    "dialogue": [
      {
        "id": "m09-dialogue-1",
        "speaker": "Joseph Nnadi",
        "text": "The trade hit my invalidation. I know the rule. What I don't know is why my first thought was to enter again twice as big."
      },
      {
        "id": "m09-dialogue-2",
        "speaker": "The Don",
        "text": "Because a loss can make a bad idea feel urgent. Show me the plan you wrote before the trade—not the story you're telling yourself now."
      },
      {
        "id": "m09-dialogue-3",
        "speaker": "PLAYER",
        "text": "We'll mark the setup, risk and invalidation, then record the result honestly. One loss doesn't give us permission to abandon the plan."
      }
    ],
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
        "label": "Read a simulated chart",
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
    "ending": "The simulated spot trade loses, but the player records the original setup, defined risk and outcome without revenge trading. Joseph Nnadi leaves with a reviewable process instead of a recovery fantasy.",
    "cliffhanger": "Praise calls from the next block: Toza has opened a leveraged position, and the margin number is shrinking.",
    "safeSimulationRequired": true
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
    "narrativePurpose": "A leveraged position moves against Toza. Craftore helps the player model the risk before the situation escalates.",
    "openingPanels": [
      {
        "id": "m10-panel-1",
        "type": "establishing",
        "caption": "A leveraged position moves against Toza. Craftore helps the player model the risk before the situation escalates."
      },
      {
        "id": "m10-panel-2",
        "type": "dialogue",
        "speaker": "Praise",
        "text": "Toza keeps saying the position only needs one bounce. The liquidation estimate says otherwise. Can you walk through the risk before this turns into a bigger problem?"
      },
      {
        "id": "m10-panel-3",
        "type": "dialogue",
        "speaker": "Toza",
        "text": "I saw the leverage multiplier and thought it meant I could do more with less. Nobody puts the scary part in the big font."
      }
    ],
    "dialogue": [
      {
        "id": "m10-dialogue-1",
        "speaker": "Praise",
        "text": "Toza keeps saying the position only needs one bounce. The liquidation estimate says otherwise. Can you walk through the risk before this turns into a bigger problem?"
      },
      {
        "id": "m10-dialogue-2",
        "speaker": "Toza",
        "text": "I saw the leverage multiplier and thought it meant I could do more with less. Nobody puts the scary part in the big font."
      },
      {
        "id": "m10-dialogue-3",
        "speaker": "Craftore",
        "text": "The scary part is exactly what we calculate: exposure, margin, adverse movement and a close plan. This is a simulator; use it to understand the mechanics, not to chase a win."
      },
      {
        "id": "m10-dialogue-4",
        "speaker": "PLAYER",
        "text": "Let's compare the exposure first, then decide what the plan says to do if the idea fails."
      }
    ],
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
        "label": "Open a simulated futures position",
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
    "ending": "The player models a simulated futures position and spots how leverage compresses the room for an adverse move. Toza follows the close plan before the loss grows.",
    "cliffhanger": "The trading room is full of people, but a community project with thousands of followers has almost nobody completing its first useful task.",
    "safeSimulationRequired": true
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
    "narrativePurpose": "A project has thousands of followers but few active users. A giveaway will not fix an onboarding problem.",
    "openingPanels": [
      {
        "id": "m11-panel-1",
        "type": "establishing",
        "caption": "A project has thousands of followers but few active users. A giveaway will not fix an onboarding problem."
      },
      {
        "id": "m11-panel-2",
        "type": "dialogue",
        "speaker": "Kodavic",
        "text": "Our follower count looks beautiful in a pitch deck. Our onboarding chat is quiet enough to hear a pin drop."
      },
      {
        "id": "m11-panel-3",
        "type": "dialogue",
        "speaker": "Cybersage",
        "text": "We keep celebrating joins, but we haven't asked where new members get confused or what makes them return. Let's find the drop-off before we buy another giveaway."
      }
    ],
    "dialogue": [
      {
        "id": "m11-dialogue-1",
        "speaker": "Kodavic",
        "text": "Our follower count looks beautiful in a pitch deck. Our onboarding chat is quiet enough to hear a pin drop."
      },
      {
        "id": "m11-dialogue-2",
        "speaker": "Cybersage",
        "text": "We keep celebrating joins, but we haven't asked where new members get confused or what makes them return. Let's find the drop-off before we buy another giveaway."
      },
      {
        "id": "m11-dialogue-3",
        "speaker": "PLAYER",
        "text": "Let's watch a newcomer go through the first session and ask where they get stuck. The metric should tell us whether they found value—not just whether they arrived."
      }
    ],
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
    "ending": "The player maps the first session, interviews members and redesigns the first useful action. The team begins measuring meaningful participation and return visits instead of raw follower count.",
    "cliffhanger": "A new member has received a message from someone pretending to be a moderator. The community needs a calm response before more people click.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "An impersonator sends malicious links while the community turns on itself. The player joins the response team.",
    "openingPanels": [
      {
        "id": "m12-panel-1",
        "type": "establishing",
        "caption": "An impersonator sends malicious links while the community turns on itself. The player joins the response team."
      },
      {
        "id": "m12-panel-2",
        "type": "dialogue",
        "speaker": "Reina",
        "text": "A member nearly gave a stranger access because the account had my display name and profile picture. They're embarrassed. Please don't turn this into a public pile-on."
      },
      {
        "id": "m12-panel-3",
        "type": "dialogue",
        "speaker": "Cclya",
        "text": "I've preserved the message and blocked the link. Now we need to guide the affected user through account security and tell everyone how to verify staff."
      }
    ],
    "dialogue": [
      {
        "id": "m12-dialogue-1",
        "speaker": "Reina",
        "text": "A member nearly gave a stranger access because the account had my display name and profile picture. They're embarrassed. Please don't turn this into a public pile-on."
      },
      {
        "id": "m12-dialogue-2",
        "speaker": "Cclya",
        "text": "I've preserved the message and blocked the link. Now we need to guide the affected user through account security and tell everyone how to verify staff."
      },
      {
        "id": "m12-dialogue-3",
        "speaker": "PLAYER",
        "text": "We'll warn people, protect the member's privacy and publish what we know. No naming-and-shaming guesses; we deal with the impersonator and the risk."
      }
    ],
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
    "ending": "The player helps contain the impersonation attempt, guides a member to secure their account and publishes a factual notice. The community protects people without spreading private information or blame.",
    "cliffhanger": "The incident is under control, but the group needs a public event to explain what happened and rebuild trust. The scheduled host has just cancelled.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "A live host cancels. The player must turn a last-minute crisis into a useful discussion.",
    "openingPanels": [
      {
        "id": "m13-panel-1",
        "type": "establishing",
        "caption": "A live host cancels. The player must turn a last-minute crisis into a useful discussion."
      },
      {
        "id": "m13-panel-2",
        "type": "dialogue",
        "speaker": "Leemah",
        "text": "The host has cancelled twenty minutes before we go live. The speakers are ready, the audience is waiting, and my backup plan is a cup of tea."
      },
      {
        "id": "m13-panel-3",
        "type": "dialogue",
        "speaker": "Kenny",
        "text": "You can take the mic. You don't need to know everything; you need a clear opening, good questions and the honesty to say when you need to check something."
      }
    ],
    "dialogue": [
      {
        "id": "m13-dialogue-1",
        "speaker": "Leemah",
        "text": "The host has cancelled twenty minutes before we go live. The speakers are ready, the audience is waiting, and my backup plan is a cup of tea."
      },
      {
        "id": "m13-dialogue-2",
        "speaker": "Kenny",
        "text": "You can take the mic. You don't need to know everything; you need a clear opening, good questions and the honesty to say when you need to check something."
      },
      {
        "id": "m13-dialogue-3",
        "speaker": "PLAYER",
        "text": "Okay. Give me the topic, the audience and the three questions people actually need answered. We'll make this useful."
      }
    ],
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
        "label": "host a simulated space",
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
      "onFailure": "The player can revise weak questions and host the simulation again.",
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
    "ending": "The player hosts a simulated live session with a clear opening, thoughtful questions and a calm response to a difficult question. The recap gives people useful next steps.",
    "cliffhanger": "After the session, a founder asks for help explaining a good product without drowning the audience in technical language.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "A useful product is being misunderstood. The player joins its communications team and turns technical claims into clear language.",
    "openingPanels": [
      {
        "id": "m14-panel-1",
        "type": "establishing",
        "caption": "A useful product is being misunderstood. The player joins its communications team and turns technical claims into clear language."
      },
      {
        "id": "m14-panel-2",
        "type": "dialogue",
        "speaker": "Kore",
        "text": "The product works, but our announcement reads like it was written for a server room with no windows. Who is this supposed to help?"
      },
      {
        "id": "m14-panel-3",
        "type": "dialogue",
        "speaker": "Veedima",
        "text": "A good message starts with the person's problem, says what the product can honestly do, and gives them one clear next step. No miracle claims."
      }
    ],
    "dialogue": [
      {
        "id": "m14-dialogue-1",
        "speaker": "Kore",
        "text": "The product works, but our announcement reads like it was written for a server room with no windows. Who is this supposed to help?"
      },
      {
        "id": "m14-dialogue-2",
        "speaker": "Veedima",
        "text": "A good message starts with the person's problem, says what the product can honestly do, and gives them one clear next step. No miracle claims."
      },
      {
        "id": "m14-dialogue-3",
        "speaker": "PLAYER",
        "text": "Let's pick the audience first, then rewrite the announcement and check every claim before it goes out."
      }
    ],
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
    "ending": "The player turns a confusing product announcement into clear, audience-specific communication with verifiable claims and a useful next step.",
    "cliffhanger": "A contact asks whether the player can help with a professional opportunity. The first thing they want to see is work—not another impressive bio.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "The player wants an opportunity but their profile is scattered and full of claims unsupported by work.",
    "openingPanels": [
      {
        "id": "m15-panel-1",
        "type": "establishing",
        "caption": "The player wants an opportunity but their profile is scattered and full of claims unsupported by work."
      },
      {
        "id": "m15-panel-2",
        "type": "dialogue",
        "speaker": "Web3_Esta",
        "text": "Your bio says you can do everything from growth to engineering to research. Which one can you show me today?"
      },
      {
        "id": "m15-panel-3",
        "type": "dialogue",
        "speaker": "Love",
        "text": "You don't need to pretend to be senior. Pick a direction, show two honest samples, explain your part and tell me what you're still learning."
      }
    ],
    "dialogue": [
      {
        "id": "m15-dialogue-1",
        "speaker": "Web3_Esta",
        "text": "Your bio says you can do everything from growth to engineering to research. Which one can you show me today?"
      },
      {
        "id": "m15-dialogue-2",
        "speaker": "Love",
        "text": "You don't need to pretend to be senior. Pick a direction, show two honest samples, explain your part and tell me what you're still learning."
      },
      {
        "id": "m15-dialogue-3",
        "speaker": "PLAYER",
        "text": "I'll choose the work I can actually demonstrate, make the evidence easy to review, and be clear about the gaps."
      }
    ],
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
    "ending": "The player shapes a focused profile and portfolio around verifiable work. Love identifies the strongest sample and gives a concrete next step instead of promising instant success.",
    "cliffhanger": "The portfolio earns a reply. J.Jonathan has a small task available—but the brief, terms and recruiter still need checking.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "A small startup needs help researching its audience. The player applies with a practical sample instead of empty promises.",
    "openingPanels": [
      {
        "id": "m16-panel-1",
        "type": "establishing",
        "caption": "A small startup needs help researching its audience. The player applies with a practical sample instead of empty promises."
      },
      {
        "id": "m16-panel-2",
        "type": "dialogue",
        "speaker": "J.Jonathan",
        "text": "I don't need a perfect CV. I need to see whether you can understand a brief, do the work and explain your choices."
      },
      {
        "id": "m16-panel-3",
        "type": "dialogue",
        "speaker": "Essa",
        "text": "And before you get excited: verify the role and its terms. If anyone asks you to pay an upfront fee to unlock the opportunity, stop and check."
      }
    ],
    "dialogue": [
      {
        "id": "m16-dialogue-1",
        "speaker": "J.Jonathan",
        "text": "I don't need a perfect CV. I need to see whether you can understand a brief, do the work and explain your choices."
      },
      {
        "id": "m16-dialogue-2",
        "speaker": "Essa",
        "text": "And before you get excited: verify the role and its terms. If anyone asks you to pay an upfront fee to unlock the opportunity, stop and check."
      },
      {
        "id": "m16-dialogue-3",
        "speaker": "PLAYER",
        "text": "I'll complete a small sample tied to the role, submit it with context, and use the feedback to improve the next attempt."
      }
    ],
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
    "ending": "The player completes a practical work sample, submits a clear application and turns feedback into a targeted revision. The opportunity is a chance to contribute—not a guarantee of a job.",
    "cliffhanger": "That small assignment points to a startup in Kano. The team has built a long list of features but still cannot explain the user's main problem.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "A startup has too many features and one unresolved user problem. The player helps the team simplify the product.",
    "openingPanels": [
      {
        "id": "m17-panel-1",
        "type": "establishing",
        "caption": "A startup has too many features and one unresolved user problem. The player helps the team simplify the product."
      },
      {
        "id": "m17-panel-2",
        "type": "dialogue",
        "speaker": "White Coach",
        "text": "The team wants a dashboard, a marketplace, a chatbot and a token page. I asked what the user came to do. They sent me the feature list again."
      },
      {
        "id": "m17-panel-3",
        "type": "dialogue",
        "speaker": "Abdul",
        "text": "Let's map the actual journey. Where does the user arrive, what are they trying to finish, and at which step do they give up?"
      }
    ],
    "dialogue": [
      {
        "id": "m17-dialogue-1",
        "speaker": "White Coach",
        "text": "The team wants a dashboard, a marketplace, a chatbot and a token page. I asked what the user came to do. They sent me the feature list again."
      },
      {
        "id": "m17-dialogue-2",
        "speaker": "Abdul",
        "text": "Let's map the actual journey. Where does the user arrive, what are they trying to finish, and at which step do they give up?"
      },
      {
        "id": "m17-dialogue-3",
        "speaker": "PLAYER",
        "text": "We'll interview users, find the biggest friction and test one focused fix before adding anything else."
      }
    ],
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
    "ending": "The player maps the user journey and helps the team simplify the main flow. The revised version is tested against the original problem instead of judged by how many features it contains.",
    "cliffhanger": "The product is easier to use. Now the growth team wants a big campaign—but nobody can show whether the audience is right.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "A startup wants a costly campaign before understanding its audience. The player designs a smaller experiment.",
    "openingPanels": [
      {
        "id": "m18-panel-1",
        "type": "establishing",
        "caption": "A startup wants a costly campaign before understanding its audience. The player designs a smaller experiment."
      },
      {
        "id": "m18-panel-2",
        "type": "dialogue",
        "speaker": "David",
        "text": "The agency says they can bring ten thousand users by Friday. They won't explain where those users come from, but they want the full budget today."
      },
      {
        "id": "m18-panel-3",
        "type": "dialogue",
        "speaker": "Kanyin",
        "text": "Let's run a smaller experiment first. We need a hypothesis, a real audience and a metric tied to useful behaviour. Otherwise we are paying for a number."
      }
    ],
    "dialogue": [
      {
        "id": "m18-dialogue-1",
        "speaker": "David",
        "text": "The agency says they can bring ten thousand users by Friday. They won't explain where those users come from, but they want the full budget today."
      },
      {
        "id": "m18-dialogue-2",
        "speaker": "Kanyin",
        "text": "Let's run a smaller experiment first. We need a hypothesis, a real audience and a metric tied to useful behaviour. Otherwise we are paying for a number."
      },
      {
        "id": "m18-dialogue-3",
        "speaker": "PLAYER",
        "text": "Let's define what success means before launch. If the offer can't explain its source or prove quality, we don't use it."
      }
    ],
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
    "ending": "The player designs a measurable growth experiment and rejects an offer that cannot explain its source or prove genuine users. The team learns more from a small honest test than a large vanity number.",
    "cliffhanger": "The experiment gets attention from an investor. The offer looks generous, but the terms could change who controls the project.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "A startup compares grants, investors and token-based funding while balancing runway, obligations and control.",
    "openingPanels": [
      {
        "id": "m19-panel-1",
        "type": "establishing",
        "caption": "A startup compares grants, investors and token-based funding while balancing runway, obligations and control."
      },
      {
        "id": "m19-panel-2",
        "type": "dialogue",
        "speaker": "Mcbond",
        "text": "I can put money into this, but funding comes with terms. The headline amount is not the whole deal."
      },
      {
        "id": "m19-panel-3",
        "type": "dialogue",
        "speaker": "Alpha.RWA",
        "text": "Compare the runway, milestones, allocation, vesting and control. Also disclose who benefits from each option. A big cheque can still be the wrong fit."
      }
    ],
    "dialogue": [
      {
        "id": "m19-dialogue-1",
        "speaker": "Mcbond",
        "text": "I can put money into this, but funding comes with terms. The headline amount is not the whole deal."
      },
      {
        "id": "m19-dialogue-2",
        "speaker": "Alpha.RWA",
        "text": "Compare the runway, milestones, allocation, vesting and control. Also disclose who benefits from each option. A big cheque can still be the wrong fit."
      },
      {
        "id": "m19-dialogue-3",
        "speaker": "PLAYER",
        "text": "I'll compare the full proposals and explain the trade-offs, not pick the biggest number just because it looks good."
      }
    ],
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
        "label": "Review a fictional budget",
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
    "ending": "The player reviews the fictional budget and compares funding proposals, vesting and conflicts of interest. The founders choose a route that fits their obligations and runway.",
    "cliffhanger": "One pitch deck lists a tokenized property as fully backed. The team has shown a token page—but not the evidence behind the asset.",
    "safeSimulationRequired": true
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
    "narrativePurpose": "A project claims to tokenize property, but its legal rights, custody and redemption promises are unclear.",
    "openingPanels": [
      {
        "id": "m20-panel-1",
        "type": "establishing",
        "caption": "A project claims to tokenize property, but its legal rights, custody and redemption promises are unclear."
      },
      {
        "id": "m20-panel-2",
        "type": "dialogue",
        "speaker": "BigWealth",
        "text": "The property is in the deck, the token is on the mock-up, and the announcement is ready. Surely we can launch while legal finishes the paperwork?"
      },
      {
        "id": "m20-panel-3",
        "type": "dialogue",
        "speaker": "BigSam",
        "text": "No. A token doesn't create legal ownership by itself. Who owns the property, who holds the documents, and what exactly can a holder redeem?"
      }
    ],
    "dialogue": [
      {
        "id": "m20-dialogue-1",
        "speaker": "BigWealth",
        "text": "The property is in the deck, the token is on the mock-up, and the announcement is ready. Surely we can launch while legal finishes the paperwork?"
      },
      {
        "id": "m20-dialogue-2",
        "speaker": "BigSam",
        "text": "No. A token doesn't create legal ownership by itself. Who owns the property, who holds the documents, and what exactly can a holder redeem?"
      },
      {
        "id": "m20-dialogue-3",
        "speaker": "PLAYER",
        "text": "We'll list the claims, match each one to evidence and pause anything we cannot verify before launch."
      }
    ],
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
    "ending": "The player finds missing ownership, custody and redemption evidence and drafts the questions the issuer must answer. The team pauses its announcement rather than making a claim it cannot support.",
    "cliffhanger": "While the asset team checks its records, an AI report confidently flags a transaction that does not match the source data.",
    "safeSimulationRequired": true
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
    "narrativePurpose": "An AI report sounds certain but contains incorrect blockchain analysis. The player checks its claims against the source data.",
    "openingPanels": [
      {
        "id": "m21-panel-1",
        "type": "establishing",
        "caption": "An AI report sounds certain but contains incorrect blockchain analysis. The player checks its claims against the source data."
      },
      {
        "id": "m21-panel-2",
        "type": "dialogue",
        "speaker": "Blessing",
        "text": "The assistant says this wallet drained the funds. It gives a confident summary, but the transaction reference points to something else."
      },
      {
        "id": "m21-panel-3",
        "type": "dialogue",
        "speaker": "Odion",
        "text": "A polished answer is still just an answer. We'll check the source record, identify which assumption failed, and retest the instructions with known cases."
      }
    ],
    "dialogue": [
      {
        "id": "m21-dialogue-1",
        "speaker": "Blessing",
        "text": "The assistant says this wallet drained the funds. It gives a confident summary, but the transaction reference points to something else."
      },
      {
        "id": "m21-dialogue-2",
        "speaker": "Odion",
        "text": "A polished answer is still just an answer. We'll check the source record, identify which assumption failed, and retest the instructions with known cases."
      },
      {
        "id": "m21-dialogue-3",
        "speaker": "PLAYER",
        "text": "Let's separate what the AI says from what the evidence shows. If it can't support a claim, it doesn't belong in the report."
      }
    ],
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
        "label": "verify on-chain claims in a simulator",
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
    "ending": "The player checks AI-generated claims against simulated source data, corrects a false assumption and retests the workflow. The team keeps human review for decisions that can affect people or funds.",
    "cliffhanger": "The corrected report mentions a transfer between networks. Princess wants to trace it without assuming both chains work the same way.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "A dapp needs to interact with another network. The player investigates a bridge and its dependencies.",
    "openingPanels": [
      {
        "id": "m22-panel-1",
        "type": "establishing",
        "caption": "A dapp needs to interact with another network. The player investigates a bridge and its dependencies."
      },
      {
        "id": "m22-panel-2",
        "type": "dialogue",
        "speaker": "Princess",
        "text": "The transfer left the source network, but that doesn't automatically mean the destination asset is ready. We need to follow the records on both sides."
      },
      {
        "id": "m22-panel-3",
        "type": "dialogue",
        "speaker": "Racheal",
        "text": "And look carefully at the bridge interface. Fake pages copy the real design and ask people to approve things they don't understand."
      }
    ],
    "dialogue": [
      {
        "id": "m22-dialogue-1",
        "speaker": "Princess",
        "text": "The transfer left the source network, but that doesn't automatically mean the destination asset is ready. We need to follow the records on both sides."
      },
      {
        "id": "m22-dialogue-2",
        "speaker": "Racheal",
        "text": "And look carefully at the bridge interface. Fake pages copy the real design and ask people to approve things they don't understand."
      },
      {
        "id": "m22-dialogue-3",
        "speaker": "PLAYER",
        "text": "We'll verify the source and destination networks, the transaction references, the supported asset and the fees before calling it complete."
      }
    ],
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
        "label": "Compare simulated networks",
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
    "ending": "The player traces a simulated cross-network transfer, checks the bridge's role and identifies a fake interface. The team records both what worked and the extra trust assumptions the bridge introduced.",
    "cliffhanger": "The networks disagree on some details, but the bigger decision belongs to the people funding the next upgrade. The DAO has called a vote.",
    "safeSimulationRequired": true
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
    "narrativePurpose": "A DAO must choose how to use its treasury, but inactivity and unclear proposals undermine trust.",
    "openingPanels": [
      {
        "id": "m23-panel-1",
        "type": "establishing",
        "caption": "A DAO must choose how to use its treasury, but inactivity and unclear proposals undermine trust."
      },
      {
        "id": "m23-panel-2",
        "type": "dialogue",
        "speaker": "Seun",
        "text": "The proposal says 'improve the ecosystem'. That sounds lovely. It still doesn't tell members how much it costs or who will deliver the work."
      },
      {
        "id": "m23-panel-3",
        "type": "dialogue",
        "speaker": "Dorcas",
        "text": "Read the budget, the execution steps and the limits. A vote can pass and still fail if nobody checks whether the rules were followed."
      }
    ],
    "dialogue": [
      {
        "id": "m23-dialogue-1",
        "speaker": "Seun",
        "text": "The proposal says 'improve the ecosystem'. That sounds lovely. It still doesn't tell members how much it costs or who will deliver the work."
      },
      {
        "id": "m23-dialogue-2",
        "speaker": "Dorcas",
        "text": "Read the budget, the execution steps and the limits. A vote can pass and still fail if nobody checks whether the rules were followed."
      },
      {
        "id": "m23-dialogue-3",
        "speaker": "PLAYER",
        "text": "I'll compare the trade-offs and who benefits, then cast a test vote based on the proposal—not pressure from the loudest person."
      }
    ],
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
        "label": "inspect a simulated treasury",
        "interactionTarget": "story:m23:objective:3",
        "required": true
      },
      {
        "id": "m23-obj-4",
        "label": "cast a test vote",
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
    "ending": "The player reviews the treasury and proposal, casts a simulated vote and explains the outcome alongside participation and execution limits. The group sees that accountability does not end when voting closes.",
    "cliffhanger": "Before the approved work ships, Joe and Mike find a serious vulnerability in the release candidate. The team wants to launch anyway.",
    "safeSimulationRequired": true
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
    "narrativePurpose": "A serious vulnerability appears before launch. The player helps the team prioritize remediation and communicate responsibly.",
    "openingPanels": [
      {
        "id": "m24-panel-1",
        "type": "establishing",
        "caption": "A serious vulnerability appears before launch. The player helps the team prioritize remediation and communicate responsibly."
      },
      {
        "id": "m24-panel-2",
        "type": "dialogue",
        "speaker": "Joe",
        "text": "I reproduced the vulnerability twice. It is not a cosmetic warning, and the evidence is clear enough that we need to stop the release."
      },
      {
        "id": "m24-panel-3",
        "type": "dialogue",
        "speaker": "Mike",
        "text": "Then write it so another engineer can reproduce it, assess who could be affected, and prepare a responsible disclosure. Don't publish an exploit that puts users at risk."
      }
    ],
    "dialogue": [
      {
        "id": "m24-dialogue-1",
        "speaker": "Joe",
        "text": "I reproduced the vulnerability twice. It is not a cosmetic warning, and the evidence is clear enough that we need to stop the release."
      },
      {
        "id": "m24-dialogue-2",
        "speaker": "Mike",
        "text": "Then write it so another engineer can reproduce it, assess who could be affected, and prepare a responsible disclosure. Don't publish an exploit that puts users at risk."
      },
      {
        "id": "m24-dialogue-3",
        "speaker": "PLAYER",
        "text": "We'll document the impact, agree on a safe fix and retest the exact failure before anyone calls the release ready."
      }
    ],
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
        "label": "Read a simulated finding",
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
        "label": "verify the patch in a test environment.",
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
    "ending": "The player prioritizes a simulated vulnerability, prepares a responsible disclosure and verifies the patch in a test environment. The launch waits until the evidence supports a safe release.",
    "cliffhanger": "During the review, a creator asks a deceptively simple question: if someone buys a digital collectible, what rights did they actually buy?",
    "safeSimulationRequired": false
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
    "narrativePurpose": "Creators disagree about what an NFT buyer actually owns. The player examines terms before recommending a model.",
    "openingPanels": [
      {
        "id": "m25-panel-1",
        "type": "establishing",
        "caption": "Creators disagree about what an NFT buyer actually owns. The player examines terms before recommending a model."
      },
      {
        "id": "m25-panel-2",
        "type": "dialogue",
        "speaker": "Gbemi",
        "text": "Someone bought my collectible and now says they own the art, the commercial rights and every future version. That's not what I meant to sell."
      },
      {
        "id": "m25-panel-3",
        "type": "dialogue",
        "speaker": "FemiY",
        "text": "Then the terms need to say exactly what the buyer receives, what stays with you, and how resale or royalties work. A token can't silently rewrite a licence."
      }
    ],
    "dialogue": [
      {
        "id": "m25-dialogue-1",
        "speaker": "Gbemi",
        "text": "Someone bought my collectible and now says they own the art, the commercial rights and every future version. That's not what I meant to sell."
      },
      {
        "id": "m25-dialogue-2",
        "speaker": "FemiY",
        "text": "Then the terms need to say exactly what the buyer receives, what stays with you, and how resale or royalties work. A token can't silently rewrite a licence."
      },
      {
        "id": "m25-dialogue-3",
        "speaker": "PLAYER",
        "text": "Let's read the actual terms, list the rights and rewrite the unclear parts before another buyer makes the same assumption."
      }
    ],
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
        "label": "Inspect a fictional collectible",
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
    "ending": "The player checks the fictional collectible's licence, identifies the rights it grants and clarifies creator revenue limitations. The creators publish terms that say what buyers receive without promising rights the token cannot provide.",
    "cliffhanger": "The corrected terms are added to the archive. An old repository nearby contains the code behind one of the clues—and its contributors have stopped talking.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "The player reunites with the first mentors to inspect an abandoned repository whose code survives but whose collaboration has stalled.",
    "openingPanels": [
      {
        "id": "m26-panel-1",
        "type": "establishing",
        "caption": "The player reunites with the first mentors to inspect an abandoned repository whose code survives but whose collaboration has stalled."
      },
      {
        "id": "m26-panel-2",
        "type": "dialogue",
        "speaker": "Softstorm",
        "text": "Look at this repository. The code is still here, but the last issue has been sitting unanswered for months. People say they want open source; then nobody wants to review a small fix."
      },
      {
        "id": "m26-panel-3",
        "type": "dialogue",
        "speaker": "IamAbdul",
        "text": "Open source isn't 'take whatever you want'. Check the licence, read the contribution guide, make a focused change and let people review it. Credit matters."
      }
    ],
    "dialogue": [
      {
        "id": "m26-dialogue-1",
        "speaker": "Softstorm",
        "text": "Look at this repository. The code is still here, but the last issue has been sitting unanswered for months. People say they want open source; then nobody wants to review a small fix."
      },
      {
        "id": "m26-dialogue-2",
        "speaker": "IamAbdul",
        "text": "Open source isn't 'take whatever you want'. Check the licence, read the contribution guide, make a focused change and let people review it. Credit matters."
      },
      {
        "id": "m26-dialogue-3",
        "speaker": "PLAYER",
        "text": "I'll pick a small issue, document the change and invite review. Better one useful contribution than a giant promise nobody can check."
      }
    ],
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
        "label": "Explore a simulated repository",
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
    "ending": "The player finds a scoped issue, improves documentation and proposes a reviewable contribution. Softstorm and IamAbdul show how shared work depends on clear licences, credit and collaboration.",
    "cliffhanger": "The repository history contains a reference to the same archive. Joe_Sef and Larai may be able to connect it with the evidence collected across the journey.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "The player returns to the workspace and reconstructs an incomplete archive from evidence gathered across the journey.",
    "openingPanels": [
      {
        "id": "m27-panel-1",
        "type": "establishing",
        "caption": "The player returns to the workspace and reconstructs an incomplete archive from evidence gathered across the journey."
      },
      {
        "id": "m27-panel-2",
        "type": "dialogue",
        "speaker": "Joe_Sef",
        "text": "We've got the screenshots, transaction traces, product notes and repository history. Don't force them into one story just because you want to finish."
      },
      {
        "id": "m27-panel-3",
        "type": "dialogue",
        "speaker": "Larai",
        "text": "Build the timeline. Mark what each source proves, where records disagree, and what remains uncertain. Then connect the people and skills behind each piece."
      }
    ],
    "dialogue": [
      {
        "id": "m27-dialogue-1",
        "speaker": "Joe_Sef",
        "text": "We've got the screenshots, transaction traces, product notes and repository history. Don't force them into one story just because you want to finish."
      },
      {
        "id": "m27-dialogue-2",
        "speaker": "Larai",
        "text": "Build the timeline. Mark what each source proves, where records disagree, and what remains uncertain. Then connect the people and skills behind each piece."
      },
      {
        "id": "m27-dialogue-3",
        "speaker": "PLAYER",
        "text": "I'll reconstruct the archive from the evidence we have—not from what I hope the answer will be."
      }
    ],
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
    "ending": "The player assembles a timeline, resolves contradictions where the evidence allows and maps the roles represented across the journey. The archive reveals a route to KitCity.",
    "cliffhanger": "The map points to a final field challenge in Kogi. The player must combine several skills instead of solving one isolated quiz.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "Before the final road, the player solves a combined problem involving technology, users, product choices and communication.",
    "openingPanels": [
      {
        "id": "m28-panel-1",
        "type": "establishing",
        "caption": "Before the final road, the player solves a combined problem involving technology, users, product choices and communication."
      },
      {
        "id": "m28-panel-2",
        "type": "dialogue",
        "speaker": "Unique",
        "text": "The challenge looks complicated because you're trying to solve it all at once. First tell us what problem the people actually have."
      },
      {
        "id": "m28-panel-3",
        "type": "dialogue",
        "speaker": "Christol",
        "text": "Then choose the smallest safe prototype that tests your idea. Give each teammate a clear job, check the hand-off and show what the test proved."
      }
    ],
    "dialogue": [
      {
        "id": "m28-dialogue-1",
        "speaker": "Unique",
        "text": "The challenge looks complicated because you're trying to solve it all at once. First tell us what problem the people actually have."
      },
      {
        "id": "m28-dialogue-2",
        "speaker": "Christol",
        "text": "Then choose the smallest safe prototype that tests your idea. Give each teammate a clear job, check the hand-off and show what the test proved."
      },
      {
        "id": "m28-dialogue-3",
        "speaker": "PLAYER",
        "text": "I'll start with the problem, match the work to the right skills and build only enough to test the idea."
      }
    ],
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
        "label": "coordinate a simulated team",
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
    "ending": "The player coordinates a simulated team, builds a small safe prototype and presents the evidence. Unique and Christol hand over the final route because the player has learned to connect skills to a real problem.",
    "cliffhanger": "The road ends at KitCity's gate. The people inside have seen plenty of visitors arrive with claims; Craftore wants to see what this player can actually do.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "The player arrives in KitCity and sees builders, educators, researchers, traders and creators working side by side.",
    "openingPanels": [
      {
        "id": "m29-panel-1",
        "type": "establishing",
        "caption": "The player arrives in KitCity and sees builders, educators, researchers, traders and creators working side by side."
      },
      {
        "id": "m29-panel-2",
        "type": "dialogue",
        "speaker": "Softstorm",
        "text": "You made it. The city is full of people building, researching, trading, creating and teaching. Don't walk in thinking one job or one token explains the whole place."
      },
      {
        "id": "m29-panel-3",
        "type": "dialogue",
        "speaker": "White Coach",
        "text": "Before we give you a desk, find out where you can contribute. You can explore the districts, talk to the people doing the work and choose a path worth practising."
      }
    ],
    "dialogue": [
      {
        "id": "m29-dialogue-1",
        "speaker": "Softstorm",
        "text": "You made it. The city is full of people building, researching, trading, creating and teaching. Don't walk in thinking one job or one token explains the whole place."
      },
      {
        "id": "m29-dialogue-2",
        "speaker": "White Coach",
        "text": "Before we give you a desk, find out where you can contribute. You can explore the districts, talk to the people doing the work and choose a path worth practising."
      },
      {
        "id": "m29-dialogue-3",
        "speaker": "Craftore",
        "text": "And don't worry about impressing me with big words. Show me what you've learned, what you can do, and what you still need to work on."
      },
      {
        "id": "m29-dialogue-4",
        "speaker": "PLAYER",
        "text": "I came here looking for answers. I want to find the work I can contribute to—and earn my place by doing it."
      }
    ],
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
    "ending": "Softstorm welcomes the player to KitCity, while White Coach introduces the city's different disciplines and Craftore asks the player to choose a practical direction.",
    "cliffhanger": "Craftore opens the assessment hall. The challenge will adapt to the player's chosen specialization, and the evidence must come from their own work.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "A practical assessment adapts to the specialization chosen by the player; it tests demonstrated skill rather than requiring mastery of every path.",
    "openingPanels": [
      {
        "id": "m30-panel-1",
        "type": "establishing",
        "caption": "A practical assessment adapts to the specialization chosen by the player; it tests demonstrated skill rather than requiring mastery of every path."
      },
      {
        "id": "m30-panel-2",
        "type": "dialogue",
        "speaker": "Softstorm",
        "text": "You have seen how these skills connect. Now pick one path and do the work. You are allowed to ask questions; you are not allowed to pretend you did something you didn't."
      },
      {
        "id": "m30-panel-3",
        "type": "dialogue",
        "speaker": "IamAbdul",
        "text": "Read the brief, check the criteria, build or analyse safely, and show your evidence. If it fails, the feedback is part of the task—not a reason to hide the result."
      }
    ],
    "dialogue": [
      {
        "id": "m30-dialogue-1",
        "speaker": "Softstorm",
        "text": "You have seen how these skills connect. Now pick one path and do the work. You are allowed to ask questions; you are not allowed to pretend you did something you didn't."
      },
      {
        "id": "m30-dialogue-2",
        "speaker": "IamAbdul",
        "text": "Read the brief, check the criteria, build or analyse safely, and show your evidence. If it fails, the feedback is part of the task—not a reason to hide the result."
      },
      {
        "id": "m30-dialogue-3",
        "speaker": "Joe_Sef",
        "text": "I will check whether the reasoning matches the evidence. A confident explanation cannot rescue a result that doesn't work."
      },
      {
        "id": "m30-dialogue-4",
        "speaker": "Larai",
        "text": "And explain it so another person can follow your thinking. Clear communication is part of doing the work well."
      },
      {
        "id": "m30-dialogue-5",
        "speaker": "Unique",
        "text": "If your path involves wallets or assets, keep it in the sandbox and protect private information."
      },
      {
        "id": "m30-dialogue-6",
        "speaker": "Christol",
        "text": "Make the smallest change that tests the idea, then run the test again. Don't confuse more code with a better result."
      },
      {
        "id": "m30-dialogue-7",
        "speaker": "Craftore",
        "text": "No perfect-person test here. Show the work, take the feedback and improve it."
      },
      {
        "id": "m30-dialogue-8",
        "speaker": "PLAYER",
        "text": "I'll choose a direction, complete the practical task and let the evidence speak. If I miss something, I'll fix it."
      }
    ],
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
        "label": "complete its safe practical challenge",
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
    "ending": "The player completes a specialization-based practical assessment, reviews feedback and retries when needed. The practitioner record reflects demonstrated work and improvement—not a job offer or external accreditation.",
    "cliffhanger": "The mentors gather for one last conversation. They have watched the player change; now the player must decide what to carry forward.",
    "safeSimulationRequired": false
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
    "narrativePurpose": "The returning mentors reveal how their clues, work and relationships connected to the Web3 archive.",
    "openingPanels": [
      {
        "id": "m31-panel-1",
        "type": "establishing",
        "caption": "The returning mentors reveal how their clues, work and relationships connected to the Web3 archive."
      },
      {
        "id": "m31-panel-2",
        "type": "dialogue",
        "speaker": "Softstorm",
        "text": "Remember that morning in Lagos? A screenshot nearly settled an argument until you learned to ask where the money actually went."
      },
      {
        "id": "m31-panel-3",
        "type": "dialogue",
        "speaker": "IamAbdul",
        "text": "Then you learned to check a wallet, trace records, test code and protect people. None of those skills worked alone; each needed someone willing to ask a better question."
      }
    ],
    "dialogue": [
      {
        "id": "m31-dialogue-1",
        "speaker": "Softstorm",
        "text": "Remember that morning in Lagos? A screenshot nearly settled an argument until you learned to ask where the money actually went."
      },
      {
        "id": "m31-dialogue-2",
        "speaker": "IamAbdul",
        "text": "Then you learned to check a wallet, trace records, test code and protect people. None of those skills worked alone; each needed someone willing to ask a better question."
      },
      {
        "id": "m31-dialogue-3",
        "speaker": "Joe_Sef",
        "text": "The archive was never a secret shortcut. It was evidence of people solving different problems and leaving work others could inspect."
      },
      {
        "id": "m31-dialogue-4",
        "speaker": "Larai",
        "text": "The important part is what you do with that knowledge now. You can keep learning, build something useful, teach someone else or help a team work better."
      },
      {
        "id": "m31-dialogue-5",
        "speaker": "Unique",
        "text": "And stay curious. Knowing how to check something is more valuable than pretending you already know everything."
      },
      {
        "id": "m31-dialogue-6",
        "speaker": "Christol",
        "text": "Keep the work reviewable. Build, test, learn and leave the next person a clearer starting point."
      },
      {
        "id": "m31-dialogue-7",
        "speaker": "Craftore",
        "text": "KitCity stays open. The story ends here, but your contribution doesn't have to."
      },
      {
        "id": "m31-dialogue-8",
        "speaker": "PLAYER",
        "text": "I came in not knowing much. Now I know how to ask questions, check evidence and choose what I want to build next."
      }
    ],
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
    "ending": "The mentors connect the clues from the entire journey: Web3 is not one app or one career, but a network of people, products, skills and responsibilities. The player receives a practitioner record and can continue exploring KitCity.",
    "cliffhanger": "A new message appears on the city board: “We've got something new to build.” The next adventure is yours to choose.",
    "safeSimulationRequired": false
  }
];

export const MISSIONS = RAW_MISSIONS.map((mission) => Object.freeze({
  ...mission,
  npcIds: Object.freeze(mission.npcIds),
  npcs: Object.freeze(mission.npcs),
  openingPanels: Object.freeze(mission.openingPanels),
  dialogue: Object.freeze(mission.dialogue),
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
