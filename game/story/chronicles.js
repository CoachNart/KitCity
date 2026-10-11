/**
 * Canonical narrative registry for KitCity: The T3Kit Chronicles.
 * Story content lives here; the engine should consume stable IDs, never infer
 * progression from display names. This registry is narrative data, not a claim
 * that all 31 missions or all 36 state environments are already playable.
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
    "location": "Lagos story district",
    "npcIds": [
      "softstorm",
      "iamabdul"
    ],
    "npcs": [
      "Softstorm",
      "IamAbdul"
    ],
    "narrativePurpose": "The player overhears two neighbours debating an unfamiliar digital world. A strange contact card turns curiosity into a journey.",
    "openingPanels": [
      {
        "id": "m01-panel-1",
        "type": "establishing",
        "caption": "The player overhears two neighbours debating an unfamiliar digital world. A strange contact card turns curiosity into a journey."
      },
      {
        "id": "m01-panel-2",
        "type": "dialogue",
        "speaker": "Softstorm",
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m01-dialogue-1",
        "speaker": "Softstorm",
        "text": "The player overhears two neighbours debating an unfamiliar digital world. A strange contact card turns curiosity into a journey."
      },
      {
        "id": "m01-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
      }
    ],
    "learningObjectives": [
      "Web3 fundamentals",
      "digital opportunity literacy"
    ],
    "prerequisites": [],
    "objectives": [
      {
        "id": "m01-obj-1",
        "label": "Explore the neighbourhood",
        "interactionTarget": "story:m01:objective:1",
        "required": true
      },
      {
        "id": "m01-obj-2",
        "label": "speak with Softstorm and IamAbdul",
        "interactionTarget": "story:m01:objective:2",
        "required": true
      },
      {
        "id": "m01-obj-3",
        "label": "investigate three digital-opportunity spots",
        "interactionTarget": "story:m01:objective:3",
        "required": true
      },
      {
        "id": "m01-obj-4",
        "label": "return and explain one thing learned.",
        "interactionTarget": "story:m01:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "Web3 basics opportunity literacy",
      "The player reviews the evidence or feedback"
    ],
    "failureAndRetry": {
      "onFailure": "If the player leaves without a clue, the mentors point back to the three nearby places. Completed discoveries stay saved.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 100,
      "skillBadges": [
        "Discovery"
      ],
      "portfolioArtifacts": [
        "The Player Mistakes A Buzzword For A Shortcut"
      ]
    },
    "storyFlags": [
      "web3_basics_opportunity_literacy"
    ],
    "nextMissionId": "m02",
    "ending": "Web3 basics opportunity literacy",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
    "safeSimulationRequired": true
  },
  {
    "id": "m02",
    "chapterId": "ch01",
    "title": "The Name That Keeps Appearing",
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
    "narrativePurpose": "A T3Kit mark appears inside a small technology workspace, where the player learns that the internet has changed in layers.",
    "openingPanels": [
      {
        "id": "m02-panel-1",
        "type": "establishing",
        "caption": "A T3Kit mark appears inside a small technology workspace, where the player learns that the internet has changed in layers."
      },
      {
        "id": "m02-panel-2",
        "type": "dialogue",
        "speaker": "Joe_Sef",
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m02-dialogue-1",
        "speaker": "Joe_Sef",
        "text": "A T3Kit mark appears inside a small technology workspace, where the player learns that the internet has changed in layers."
      },
      {
        "id": "m02-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Internet history centralization decentralization",
      "The player reviews the evidence or feedback"
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
        "Misclassifications Return To The Exhibit With A Hint "
      ]
    },
    "storyFlags": [
      "internet_history_centralization_decentralization"
    ],
    "nextMissionId": "m03",
    "ending": "Internet history centralization decentralization",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m03-dialogue-1",
        "speaker": "Unique",
        "text": "A wallet demo becomes a security lesson when a fake helper offers to double the player's test tokens."
      },
      {
        "id": "m03-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Wallets keys addresses approvals scam recognition",
      "The player reviews the evidence or feedback"
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
        "The Scam Attempt Resets Safely"
      ]
    },
    "storyFlags": [
      "wallets_keys_addresses_approvals_scam_recognition"
    ],
    "nextMissionId": "m04",
    "ending": "Wallets keys addresses approvals scam recognition",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m04-dialogue-1",
        "speaker": "Goodness",
        "text": "Two records disagree. The player traces a transaction and investigates what makes a shared ledger difficult to rewrite."
      },
      {
        "id": "m04-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Blocks transactions nodes consensus explorers",
      "The player reviews the evidence or feedback"
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
        "Incorrect Traces Can Be Retried With Highlighted Clues "
      ]
    },
    "storyFlags": [
      "blocks_transactions_nodes_consensus_explorers"
    ],
    "nextMissionId": "m05",
    "ending": "Blocks transactions nodes consensus explorers",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m05-dialogue-1",
        "speaker": "Blockqueen",
        "text": "A hyped application is failing because its team built features before understanding its users."
      },
      {
        "id": "m05-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Dapps frontend/backend APIs user research",
      "The player reviews the evidence or feedback"
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
        "Players Can Repeat User Interviews If The Diagnosis Is Weak "
      ]
    },
    "storyFlags": [
      "dapps_frontend_backend_apis_user_research"
    ],
    "nextMissionId": "m06",
    "ending": "Dapps frontend/backend APIs user research",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m06-dialogue-1",
        "speaker": "Laloba",
        "text": "A fictional contract has a bug before launch. Pressure to ship collides with the duty to protect users."
      },
      {
        "id": "m06-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Smart contracts conditions state testing security",
      "The player reviews the evidence or feedback"
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
        "The Launch Remains Paused"
      ]
    },
    "storyFlags": [
      "smart_contracts_conditions_state_testing_security"
    ],
    "nextMissionId": "m07",
    "ending": "Smart contracts conditions state testing security",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m07-dialogue-1",
        "speaker": "LunaX",
        "text": "A swap returns less than expected. The player investigates liquidity and the hidden costs behind a displayed price."
      },
      {
        "id": "m07-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "DEXs pools AMMs slippage gas approvals",
      "The player reviews the evidence or feedback"
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
        "Retry With A Smaller Simulated Trade And A Fee Breakdown "
      ]
    },
    "storyFlags": [
      "dexs_pools_amms_slippage_gas_approvals"
    ],
    "nextMissionId": "m08",
    "ending": "DEXs pools AMMs slippage gas approvals",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m08-dialogue-1",
        "speaker": "Moon",
        "text": "A withdrawal pause triggers rumours. The player must understand exchange mechanics and communicate only verified facts."
      },
      {
        "id": "m08-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "CEXs order books custody deposits withdrawals incident communication",
      "The player reviews the evidence or feedback"
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
        "Unverified Claims Are Flagged And Rewritten Before Submission "
      ]
    },
    "storyFlags": [
      "cexs_order_books_custody_deposits_withdrawals_incident_communication"
    ],
    "nextMissionId": "m09",
    "ending": "CEXs order books custody deposits withdrawals incident communication",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m09-dialogue-1",
        "speaker": "Joseph Nnadi",
        "text": "A planned spot trade loses. The real test is whether the player reviews the process instead of chasing the loss."
      },
      {
        "id": "m09-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Spot trading market structure position sizing risk journaling",
      "The player reviews the evidence or feedback"
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
        "A Revenge Trade Choice Triggers A Review And Retry Not A Real Loss "
      ]
    },
    "storyFlags": [
      "spot_trading_market_structure_position_sizing_risk_journaling"
    ],
    "nextMissionId": "m10",
    "ending": "Spot trading market structure position sizing risk journaling",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m10-dialogue-1",
        "speaker": "Praise",
        "text": "A leveraged position moves against Toza. Craftore helps the player model the risk before the situation escalates."
      },
      {
        "id": "m10-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Futures long/short leverage margin liquidation funding",
      "The player reviews the evidence or feedback"
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
        "Retry With Lower Exposure And Clear Invalidation Rules "
      ]
    },
    "storyFlags": [
      "futures_long_short_leverage_margin_liquidation_funding"
    ],
    "nextMissionId": "m11",
    "ending": "Futures long/short leverage margin liquidation funding",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m11-dialogue-1",
        "speaker": "Kodavic",
        "text": "A project has thousands of followers but few active users. A giveaway will not fix an onboarding problem."
      },
      {
        "id": "m11-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Community strategy onboarding engagement retention feedback",
      "The player reviews the evidence or feedback"
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
        "Try Another Onboarding Flow If Newcomers Still Get Stuck "
      ]
    },
    "storyFlags": [
      "community_strategy_onboarding_engagement_retention_feedback"
    ],
    "nextMissionId": "m12",
    "ending": "Community strategy onboarding engagement retention feedback",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m12-dialogue-1",
        "speaker": "Reina",
        "text": "An impersonator sends malicious links while the community turns on itself. The player joins the response team."
      },
      {
        "id": "m12-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Moderation security conflict resolution escalation",
      "The player reviews the evidence or feedback"
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
        "A Safety Checklist Helps The Player Retry The Response "
      ]
    },
    "storyFlags": [
      "moderation_security_conflict_resolution_escalation"
    ],
    "nextMissionId": "m13",
    "ending": "Moderation security conflict resolution escalation",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m13-dialogue-1",
        "speaker": "Leemah",
        "text": "A live host cancels. The player must turn a last-minute crisis into a useful discussion."
      },
      {
        "id": "m13-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Live hosting interviewing coordination event promotion",
      "The player reviews the evidence or feedback"
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
        "The Player Can Revise Weak Questions And Host Again "
      ]
    },
    "storyFlags": [
      "live_hosting_interviewing_coordination_event_promotion"
    ],
    "nextMissionId": "m14",
    "ending": "Live hosting interviewing coordination event promotion",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m14-dialogue-1",
        "speaker": "Kore",
        "text": "A useful product is being misunderstood. The player joins its communications team and turns technical claims into clear language."
      },
      {
        "id": "m14-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Content writing technical communication research positioning",
      "The player reviews the evidence or feedback"
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
        "Claims That Cannot Be Verified Must Be Removed Or Qualified "
      ]
    },
    "storyFlags": [
      "content_writing_technical_communication_research_positioning"
    ],
    "nextMissionId": "m15",
    "ending": "Content writing technical communication research positioning",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m15-dialogue-1",
        "speaker": "Web3_Esta",
        "text": "The player wants an opportunity but their profile is scattered and full of claims unsupported by work."
      },
      {
        "id": "m15-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Personal branding positioning portfolio networking building in public",
      "The player reviews the evidence or feedback"
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
        "The Reviewer Highlights Unsupported Claims For Revision "
      ]
    },
    "storyFlags": [
      "personal_branding_positioning_portfolio_networking_building_in_public"
    ],
    "nextMissionId": "m16",
    "ending": "Personal branding positioning portfolio networking building in public",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m16-dialogue-1",
        "speaker": "J.Jonathan",
        "text": "A small startup needs help researching its audience. The player applies with a practical sample instead of empty promises."
      },
      {
        "id": "m16-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Applications recruitment communication interviews job-scam awareness",
      "The player reviews the evidence or feedback"
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
        "Feedback Identifies What To Improve Before Resubmission "
      ]
    },
    "storyFlags": [
      "applications_recruitment_communication_interviews_job_scam_awareness"
    ],
    "nextMissionId": "m17",
    "ending": "Applications recruitment communication interviews job-scam awareness",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m17-dialogue-1",
        "speaker": "White Coach",
        "text": "A startup has too many features and one unresolved user problem. The player helps the team simplify the product."
      },
      {
        "id": "m17-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Product management UX prioritization usability product-market fit",
      "The player reviews the evidence or feedback"
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
        "A Second Test Round Reveals Whether The Fix Worked "
      ]
    },
    "storyFlags": [
      "product_management_ux_prioritization_usability_product_market_fit"
    ],
    "nextMissionId": "m18",
    "ending": "Product management UX prioritization usability product-market fit",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m18-dialogue-1",
        "speaker": "David",
        "text": "A startup wants a costly campaign before understanding its audience. The player designs a smaller experiment."
      },
      {
        "id": "m18-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Growth funnels partnerships acquisition retention analytics",
      "The player reviews the evidence or feedback"
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
        "If Metrics Are Vanity Only Revise The Experiment "
      ]
    },
    "storyFlags": [
      "growth_funnels_partnerships_acquisition_retention_analytics"
    ],
    "nextMissionId": "m19",
    "ending": "Growth funnels partnerships acquisition retention analytics",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m19-dialogue-1",
        "speaker": "Mcbond",
        "text": "A startup compares grants, investors and token-based funding while balancing runway, obligations and control."
      },
      {
        "id": "m19-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Startup finance grants venture capital tokenomics fundraising",
      "The player reviews the evidence or feedback"
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
        "A Comparison Worksheet Exposes Missing Assumptions "
      ]
    },
    "storyFlags": [
      "startup_finance_grants_venture_capital_tokenomics_fundraising"
    ],
    "nextMissionId": "m20",
    "ending": "Startup finance grants venture capital tokenomics fundraising",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m20-dialogue-1",
        "speaker": "BigWealth",
        "text": "A project claims to tokenize property, but its legal rights, custody and redemption promises are unclear."
      },
      {
        "id": "m20-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "RWA tokenization custody verification redemption legal and operational risk",
      "The player reviews the evidence or feedback"
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
        "Missing Evidence Remains An Explicit Blocker Never Guessed "
      ]
    },
    "storyFlags": [
      "rwa_tokenization_custody_verification_redemption_legal_and_operational_risk"
    ],
    "nextMissionId": "m21",
    "ending": "RWA tokenization custody verification redemption legal and operational risk",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m21-dialogue-1",
        "speaker": "Blessing",
        "text": "An AI report sounds certain but contains incorrect blockchain analysis. The player checks its claims against the source data."
      },
      {
        "id": "m21-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "AI in Web3 automation on-chain analysis verification human oversight",
      "The player reviews the evidence or feedback"
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
        "The Player Retries With A Source Check Checklist "
      ]
    },
    "storyFlags": [
      "ai_in_web3_automation_on_chain_analysis_verification_human_oversight"
    ],
    "nextMissionId": "m22",
    "ending": "AI in Web3 automation on-chain analysis verification human oversight",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m22-dialogue-1",
        "speaker": "Princess",
        "text": "A dapp needs to interact with another network. The player investigates a bridge and its dependencies."
      },
      {
        "id": "m22-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "L1/L2 interoperability bridges cross-chain transfers fees security",
      "The player reviews the evidence or feedback"
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
        "A Suspicious Interface Is Safely Rejected "
      ]
    },
    "storyFlags": [
      "l1_l2_interoperability_bridges_cross_chain_transfers_fees_security"
    ],
    "nextMissionId": "m23",
    "ending": "L1/L2 interoperability bridges cross-chain transfers fees security",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m23-dialogue-1",
        "speaker": "Seun",
        "text": "A DAO must choose how to use its treasury, but inactivity and unclear proposals undermine trust."
      },
      {
        "id": "m23-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "DAOs governance voting proposals treasury management",
      "The player reviews the evidence or feedback"
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
        "A Proposal Comparison Guide Supports A Second Attempt "
      ]
    },
    "storyFlags": [
      "daos_governance_voting_proposals_treasury_management"
    ],
    "nextMissionId": "m24",
    "ending": "DAOs governance voting proposals treasury management",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m24-dialogue-1",
        "speaker": "Joe",
        "text": "A serious vulnerability appears before launch. The player helps the team prioritize remediation and communicate responsibly."
      },
      {
        "id": "m24-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Threat modeling testing audits disclosure incident response",
      "The player reviews the evidence or feedback"
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
        "The Launch Stays Blocked Until The Test Passes "
      ]
    },
    "storyFlags": [
      "threat_modeling_testing_audits_disclosure_incident_response"
    ],
    "nextMissionId": "m25",
    "ending": "Threat modeling testing audits disclosure incident response",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m25-dialogue-1",
        "speaker": "Gbemi",
        "text": "Creators disagree about what an NFT buyer actually owns. The player examines terms before recommending a model."
      },
      {
        "id": "m25-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "NFTs copyright licensing creator economy gated access publishing",
      "The player reviews the evidence or feedback"
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
        "Ambiguous Ownership Language Must Be Clarified "
      ]
    },
    "storyFlags": [
      "nfts_copyright_licensing_creator_economy_gated_access_publishing"
    ],
    "nextMissionId": "m26",
    "ending": "NFTs copyright licensing creator economy gated access publishing",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m26-dialogue-1",
        "speaker": "Softstorm",
        "text": "The player reunites with the first mentors to inspect an abandoned repository whose code survives but whose collaboration has stalled."
      },
      {
        "id": "m26-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Git issues pull requests documentation open-source collaboration",
      "The player reviews the evidence or feedback"
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
        "A Contribution Checklist Helps The Player Revise "
      ]
    },
    "storyFlags": [
      "git_issues_pull_requests_documentation_open_source_collaboration"
    ],
    "nextMissionId": "m27",
    "ending": "Git issues pull requests documentation open-source collaboration",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m27-dialogue-1",
        "speaker": "Joe_Sef",
        "text": "The player returns to the workspace and reconstructs an incomplete archive from evidence gathered across the journey."
      },
      {
        "id": "m27-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Research synthesis evidence evaluation ecosystem coordination",
      "The player reviews the evidence or feedback"
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
        "Contradictions Must Be Supported By Evidence Or Left Unresolved "
      ]
    },
    "storyFlags": [
      "research_synthesis_evidence_evaluation_ecosystem_coordination"
    ],
    "nextMissionId": "m28",
    "ending": "Research synthesis evidence evaluation ecosystem coordination",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m28-dialogue-1",
        "speaker": "Unique",
        "text": "Before the final road, the player solves a combined problem involving technology, users, product choices and communication."
      },
      {
        "id": "m28-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Systems thinking teamwork practical judgment",
      "The player reviews the evidence or feedback"
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
        "The Assessment Points To Gaps And Can Be Retried "
      ]
    },
    "storyFlags": [
      "systems_thinking_teamwork_practical_judgment"
    ],
    "nextMissionId": "m29",
    "ending": "Systems thinking teamwork practical judgment",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m29-dialogue-1",
        "speaker": "Softstorm",
        "text": "The player arrives in KitCity and sees builders, educators, researchers, traders and creators working side by side."
      },
      {
        "id": "m29-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Career exploration ecosystem literacy",
      "The player reviews the evidence or feedback"
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
        "The Player May Explore And Return To The Assessment Later "
      ]
    },
    "storyFlags": [
      "career_exploration_ecosystem_literacy"
    ],
    "nextMissionId": "m30",
    "ending": "Career exploration ecosystem literacy",
    "cliffhanger": "The gates open; the practical assessment awaits.",
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
      "smrt-huntr",
      "goodness",
      "semi",
      "blockqueen",
      "christol",
      "laloba",
      "bigsam",
      "lunax",
      "oxnight",
      "moon",
      "the-cryptonian",
      "joseph-nnadi",
      "the-don",
      "praise",
      "toza",
      "craftore",
      "kodavic",
      "cybersage",
      "reina",
      "cclya",
      "leemah",
      "kenny",
      "kore",
      "veedima",
      "web3-esta",
      "love",
      "j-jonathan",
      "essa",
      "white-coach",
      "abdul",
      "david",
      "kanyin",
      "mcbond",
      "alpha-rwa",
      "bigwealth",
      "blessing",
      "odion",
      "princess",
      "racheal",
      "seun",
      "dorcas",
      "joe",
      "mike",
      "gbemi",
      "femiy"
    ],
    "npcs": [
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
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m30-dialogue-1",
        "speaker": "Softstorm",
        "text": "A practical assessment adapts to the specialization chosen by the player; it tests demonstrated skill rather than requiring mastery of every path."
      },
      {
        "id": "m30-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Practical execution problem-solving security communication collaboration",
      "The player reviews the evidence or feedback"
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
        "Every Path Includes Feedback And A Retry Route "
      ]
    },
    "storyFlags": [
      "practical_execution_problem_solving_security_communication_collaboration"
    ],
    "nextMissionId": "m31",
    "ending": "Practical execution problem-solving security communication collaboration",
    "cliffhanger": "A new piece of evidence points toward the next chapter.",
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
    "narrativePurpose": "The returning mentors reveal how their clues, work and relationships connected to the T3Kit archive.",
    "openingPanels": [
      {
        "id": "m31-panel-1",
        "type": "establishing",
        "caption": "The returning mentors reveal how their clues, work and relationships connected to the T3Kit archive."
      },
      {
        "id": "m31-panel-2",
        "type": "dialogue",
        "speaker": "Softstorm",
        "text": "Let's look at what happened before we decide what to do next."
      }
    ],
    "dialogue": [
      {
        "id": "m31-dialogue-1",
        "speaker": "Softstorm",
        "text": "The returning mentors reveal how their clues, work and relationships connected to the T3Kit archive."
      },
      {
        "id": "m31-dialogue-2",
        "speaker": "PLAYER",
        "text": "Show me what I should check first."
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
      "Reflection synthesis career planning",
      "The player reviews the evidence or feedback"
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
        "The Player Can Revisit The Reveal And Journal At Any Time "
      ]
    },
    "storyFlags": [
      "reflection_synthesis_career_planning"
    ],
    "nextMissionId": null,
    "ending": "Reflection synthesis career planning",
    "cliffhanger": "A new message appears: “We've got something new to build.”",
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


export const STATE_ROUTE = NIGERIAN_STATES.map((state, index) => {
  const mission = MISSIONS.find((item) => item.state === state);
  return Object.freeze({
    state,
    routeIndex: index + 1,
    routeStatus: mission ? "mission-stop" : "planned-story-stop",
    missionId: mission ? mission.id : null,
    note: mission ? "Main-story mission stop." : "Planned narrative stop to be connected to the journey; no FCT detour."
  });
});

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
  if (NIGERIAN_STATES.length !== 36 || NIGERIAN_STATES.includes("Federal Capital Territory")) errors.push("State route must contain all 36 states and no FCT.");
  const covered = new Set(MISSIONS.map((mission) => mission.state));
  const plannedStateCoverage = STATE_ROUTE.map((stop) => ({ ...stop, coveredByMission: covered.has(stop.state) }));
  return { valid: errors.length === 0, errors, missionCount: MISSIONS.length, characterCount: CHARACTER_ORDER.length, plannedStateCoverage };
}
