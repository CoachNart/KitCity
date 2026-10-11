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
      "Explore the neighbourhood",
      "speak with Softstorm and IamAbdul",
      "investigate three digital-opportunity spots",
      "return and explain one thing learned."
    ],
    "prerequisites": [],
    "objectives": [
      {
        "id": "m01-obj-1",
        "label": "Web3 basics",
        "interactionTarget": "story:m01:objective:1",
        "required": true
      },
      {
        "id": "m01-obj-2",
        "label": "opportunity literacy",
        "interactionTarget": "story:m01:objective:2",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 100,
      "skillBadges": [
        "Receive the T3Kit contact card."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "the_player_mistakes_a_buzzword_for_a_shortcut"
    ],
    "nextMissionId": "m02",
    "ending": "The player mistakes a buzzword for a shortcut; retry by asking questions and checking evidence.",
    "cliffhanger": "The player mistakes a buzzword for a shortcut; retry by asking questions and checking evidence.",
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
      "Explore the internet-history exhibit",
      "classify Web1, Web2 and Web3 examples",
      "compare platform control with blockchain-based systems",
      "ask about the mark."
    ],
    "prerequisites": [
      "m01"
    ],
    "objectives": [
      {
        "id": "m02-obj-1",
        "label": "Internet history",
        "interactionTarget": "story:m02:objective:1",
        "required": true
      },
      {
        "id": "m02-obj-2",
        "label": "centralization",
        "interactionTarget": "story:m02:objective:2",
        "required": true
      },
      {
        "id": "m02-obj-3",
        "label": "decentralization",
        "interactionTarget": "story:m02:objective:3",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 110,
      "skillBadges": [
        "The wallet becomes the next lead."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "misclassifications_return_to_the_exhibit_with_a_hint_"
    ],
    "nextMissionId": "m03",
    "ending": "Misclassifications return to the exhibit with a hint.",
    "cliffhanger": "Misclassifications return to the exhibit with a hint.",
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
      "Create a sandbox wallet",
      "receive test tokens",
      "send a simulated transaction",
      "reject a malicious request",
      "explain recovery-phrase secrecy."
    ],
    "prerequisites": [
      "m02"
    ],
    "objectives": [
      {
        "id": "m03-obj-1",
        "label": "Wallets",
        "interactionTarget": "story:m03:objective:1",
        "required": true
      },
      {
        "id": "m03-obj-2",
        "label": "keys",
        "interactionTarget": "story:m03:objective:2",
        "required": true
      },
      {
        "id": "m03-obj-3",
        "label": "addresses",
        "interactionTarget": "story:m03:objective:3",
        "required": true
      },
      {
        "id": "m03-obj-4",
        "label": "approvals",
        "interactionTarget": "story:m03:objective:4",
        "required": true
      },
      {
        "id": "m03-obj-5",
        "label": "scam recognition",
        "interactionTarget": "story:m03:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 120,
      "skillBadges": [
        "A note points toward the shared ledger."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "the_scam_attempt_resets_safely"
    ],
    "nextMissionId": "m04",
    "ending": "The scam attempt resets safely; no real funds are used.",
    "cliffhanger": "The scam attempt resets safely; no real funds are used.",
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
      "Inspect a simulated explorer",
      "trace a transaction",
      "identify its block",
      "investigate a proposed record change",
      "explain consensus."
    ],
    "prerequisites": [
      "m03"
    ],
    "objectives": [
      {
        "id": "m04-obj-1",
        "label": "Blocks",
        "interactionTarget": "story:m04:objective:1",
        "required": true
      },
      {
        "id": "m04-obj-2",
        "label": "transactions",
        "interactionTarget": "story:m04:objective:2",
        "required": true
      },
      {
        "id": "m04-obj-3",
        "label": "nodes",
        "interactionTarget": "story:m04:objective:3",
        "required": true
      },
      {
        "id": "m04-obj-4",
        "label": "consensus",
        "interactionTarget": "story:m04:objective:4",
        "required": true
      },
      {
        "id": "m04-obj-5",
        "label": "explorers",
        "interactionTarget": "story:m04:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 130,
      "skillBadges": [
        "An old transaction references T3Kit."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "incorrect_traces_can_be_retried_with_highlighted_clues_"
    ],
    "nextMissionId": "m05",
    "ending": "Incorrect traces can be retried with highlighted clues.",
    "cliffhanger": "Incorrect traces can be retried with highlighted clues.",
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
      "Interview two simulated users",
      "test the core flow",
      "isolate the biggest failure",
      "recommend a fix",
      "present evidence."
    ],
    "prerequisites": [
      "m04"
    ],
    "objectives": [
      {
        "id": "m05-obj-1",
        "label": "Dapps",
        "interactionTarget": "story:m05:objective:1",
        "required": true
      },
      {
        "id": "m05-obj-2",
        "label": "frontend/backend",
        "interactionTarget": "story:m05:objective:2",
        "required": true
      },
      {
        "id": "m05-obj-3",
        "label": "APIs",
        "interactionTarget": "story:m05:objective:3",
        "required": true
      },
      {
        "id": "m05-obj-4",
        "label": "user research",
        "interactionTarget": "story:m05:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 140,
      "skillBadges": [
        "The team needs a smart-contract review."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "players_can_repeat_user_interviews_if_the_diagnosis_is_weak_"
    ],
    "nextMissionId": "m06",
    "ending": "Players can repeat user interviews if the diagnosis is weak.",
    "cliffhanger": "Players can repeat user interviews if the diagnosis is weak.",
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
      "Inspect a sandbox contract",
      "reproduce the bug",
      "identify the faulty assumption",
      "propose a fix",
      "describe tests needed before deployment."
    ],
    "prerequisites": [
      "m05"
    ],
    "objectives": [
      {
        "id": "m06-obj-1",
        "label": "Smart contracts",
        "interactionTarget": "story:m06:objective:1",
        "required": true
      },
      {
        "id": "m06-obj-2",
        "label": "conditions",
        "interactionTarget": "story:m06:objective:2",
        "required": true
      },
      {
        "id": "m06-obj-3",
        "label": "state",
        "interactionTarget": "story:m06:objective:3",
        "required": true
      },
      {
        "id": "m06-obj-4",
        "label": "testing",
        "interactionTarget": "story:m06:objective:4",
        "required": true
      },
      {
        "id": "m06-obj-5",
        "label": "security",
        "interactionTarget": "story:m06:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 150,
      "skillBadges": [
        "The player earns an introduction to contract security."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "the_launch_remains_paused"
    ],
    "nextMissionId": "m07",
    "ending": "The launch remains paused; player retries the test case safely.",
    "cliffhanger": "The launch remains paused; player retries the test case safely.",
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
      "Compare simulated pools",
      "estimate price impact",
      "execute a test swap",
      "inspect token approval",
      "explain liquidity and slippage."
    ],
    "prerequisites": [
      "m06"
    ],
    "objectives": [
      {
        "id": "m07-obj-1",
        "label": "DEXs",
        "interactionTarget": "story:m07:objective:1",
        "required": true
      },
      {
        "id": "m07-obj-2",
        "label": "pools",
        "interactionTarget": "story:m07:objective:2",
        "required": true
      },
      {
        "id": "m07-obj-3",
        "label": "AMMs",
        "interactionTarget": "story:m07:objective:3",
        "required": true
      },
      {
        "id": "m07-obj-4",
        "label": "slippage",
        "interactionTarget": "story:m07:objective:4",
        "required": true
      },
      {
        "id": "m07-obj-5",
        "label": "gas",
        "interactionTarget": "story:m07:objective:5",
        "required": true
      },
      {
        "id": "m07-obj-6",
        "label": "approvals",
        "interactionTarget": "story:m07:objective:6",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 160,
      "skillBadges": [
        "An invitation leads to a centralized exchange."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "retry_with_a_smaller_simulated_trade_and_a_fee_breakdown_"
    ],
    "nextMissionId": "m08",
    "ending": "Retry with a smaller simulated trade and a fee breakdown.",
    "cliffhanger": "Retry with a smaller simulated trade and a fee breakdown.",
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
      "Place simulated market and limit orders",
      "compare bid/ask",
      "inspect a fictional withdrawal incident",
      "draft a verified status update",
      "compare custody models."
    ],
    "prerequisites": [
      "m07"
    ],
    "objectives": [
      {
        "id": "m08-obj-1",
        "label": "CEXs",
        "interactionTarget": "story:m08:objective:1",
        "required": true
      },
      {
        "id": "m08-obj-2",
        "label": "order books",
        "interactionTarget": "story:m08:objective:2",
        "required": true
      },
      {
        "id": "m08-obj-3",
        "label": "custody",
        "interactionTarget": "story:m08:objective:3",
        "required": true
      },
      {
        "id": "m08-obj-4",
        "label": "deposits",
        "interactionTarget": "story:m08:objective:4",
        "required": true
      },
      {
        "id": "m08-obj-5",
        "label": "withdrawals",
        "interactionTarget": "story:m08:objective:5",
        "required": true
      },
      {
        "id": "m08-obj-6",
        "label": "incident communication",
        "interactionTarget": "story:m08:objective:6",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 170,
      "skillBadges": [
        "The player learns that account access is not control of the exchange."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "unverified_claims_are_flagged_and_rewritten_before_submission_"
    ],
    "nextMissionId": "m09",
    "ending": "Unverified claims are flagged and rewritten before submission.",
    "cliffhanger": "Unverified claims are flagged and rewritten before submission.",
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
      "Read a simulated chart",
      "mark a possible entry and invalidation",
      "calculate risk",
      "execute a paper trade",
      "record the outcome."
    ],
    "prerequisites": [
      "m08"
    ],
    "objectives": [
      {
        "id": "m09-obj-1",
        "label": "Spot trading",
        "interactionTarget": "story:m09:objective:1",
        "required": true
      },
      {
        "id": "m09-obj-2",
        "label": "market structure",
        "interactionTarget": "story:m09:objective:2",
        "required": true
      },
      {
        "id": "m09-obj-3",
        "label": "position sizing",
        "interactionTarget": "story:m09:objective:3",
        "required": true
      },
      {
        "id": "m09-obj-4",
        "label": "risk",
        "interactionTarget": "story:m09:objective:4",
        "required": true
      },
      {
        "id": "m09-obj-5",
        "label": "journaling",
        "interactionTarget": "story:m09:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 180,
      "skillBadges": [
        "The player unlocks a paper-trading journal."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "a_revenge_trade_choice_triggers_a_review_and_retry_not_a_real_loss_"
    ],
    "nextMissionId": "m10",
    "ending": "A revenge-trade choice triggers a review and retry, not a real loss.",
    "cliffhanger": "A revenge-trade choice triggers a review and retry, not a real loss.",
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
      "Open a simulated futures position",
      "compare leverage",
      "estimate margin",
      "identify liquidation risk",
      "review the loss and close plan."
    ],
    "prerequisites": [
      "m09"
    ],
    "objectives": [
      {
        "id": "m10-obj-1",
        "label": "Futures",
        "interactionTarget": "story:m10:objective:1",
        "required": true
      },
      {
        "id": "m10-obj-2",
        "label": "long/short",
        "interactionTarget": "story:m10:objective:2",
        "required": true
      },
      {
        "id": "m10-obj-3",
        "label": "leverage",
        "interactionTarget": "story:m10:objective:3",
        "required": true
      },
      {
        "id": "m10-obj-4",
        "label": "margin",
        "interactionTarget": "story:m10:objective:4",
        "required": true
      },
      {
        "id": "m10-obj-5",
        "label": "liquidation",
        "interactionTarget": "story:m10:objective:5",
        "required": true
      },
      {
        "id": "m10-obj-6",
        "label": "funding",
        "interactionTarget": "story:m10:objective:6",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 190,
      "skillBadges": [
        "The player understands why confidence cannot replace risk limits."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "retry_with_lower_exposure_and_clear_invalidation_rules_"
    ],
    "nextMissionId": "m11",
    "ending": "Retry with lower exposure and clear invalidation rules.",
    "cliffhanger": "Retry with lower exposure and clear invalidation rules.",
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
      "Inspect onboarding",
      "interview members",
      "locate the drop-off",
      "redesign the first session",
      "choose a meaningful retention metric."
    ],
    "prerequisites": [
      "m10"
    ],
    "objectives": [
      {
        "id": "m11-obj-1",
        "label": "Community strategy",
        "interactionTarget": "story:m11:objective:1",
        "required": true
      },
      {
        "id": "m11-obj-2",
        "label": "onboarding",
        "interactionTarget": "story:m11:objective:2",
        "required": true
      },
      {
        "id": "m11-obj-3",
        "label": "engagement",
        "interactionTarget": "story:m11:objective:3",
        "required": true
      },
      {
        "id": "m11-obj-4",
        "label": "retention",
        "interactionTarget": "story:m11:objective:4",
        "required": true
      },
      {
        "id": "m11-obj-5",
        "label": "feedback",
        "interactionTarget": "story:m11:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 200,
      "skillBadges": [
        "The project sees a path to healthier participation."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "try_another_onboarding_flow_if_newcomers_still_get_stuck_"
    ],
    "nextMissionId": "m12",
    "ending": "Try another onboarding flow if newcomers still get stuck.",
    "cliffhanger": "Try another onboarding flow if newcomers still get stuck.",
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
      "Identify impersonation",
      "contain a dangerous message",
      "guide a user to secure an account",
      "de-escalate a dispute",
      "publish a clear notice."
    ],
    "prerequisites": [
      "m11"
    ],
    "objectives": [
      {
        "id": "m12-obj-1",
        "label": "Moderation",
        "interactionTarget": "story:m12:objective:1",
        "required": true
      },
      {
        "id": "m12-obj-2",
        "label": "security",
        "interactionTarget": "story:m12:objective:2",
        "required": true
      },
      {
        "id": "m12-obj-3",
        "label": "conflict resolution",
        "interactionTarget": "story:m12:objective:3",
        "required": true
      },
      {
        "id": "m12-obj-4",
        "label": "escalation",
        "interactionTarget": "story:m12:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 210,
      "skillBadges": [
        "The attack is contained without blaming innocent members."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "a_safety_checklist_helps_the_player_retry_the_response_"
    ],
    "nextMissionId": "m13",
    "ending": "A safety checklist helps the player retry the response.",
    "cliffhanger": "A safety checklist helps the player retry the response.",
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
      "Research the topic",
      "prepare an opening",
      "arrange questions",
      "host a simulated space",
      "handle a difficult question",
      "write a recap."
    ],
    "prerequisites": [
      "m12"
    ],
    "objectives": [
      {
        "id": "m13-obj-1",
        "label": "Live hosting",
        "interactionTarget": "story:m13:objective:1",
        "required": true
      },
      {
        "id": "m13-obj-2",
        "label": "interviewing",
        "interactionTarget": "story:m13:objective:2",
        "required": true
      },
      {
        "id": "m13-obj-3",
        "label": "coordination",
        "interactionTarget": "story:m13:objective:3",
        "required": true
      },
      {
        "id": "m13-obj-4",
        "label": "event promotion",
        "interactionTarget": "story:m13:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 220,
      "skillBadges": [
        "An old event poster carries the T3Kit symbol."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "the_player_can_revise_weak_questions_and_host_again_"
    ],
    "nextMissionId": "m14",
    "ending": "The player can revise weak questions and host again.",
    "cliffhanger": "The player can revise weak questions and host again.",
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
      "Research the product",
      "identify the audience",
      "rewrite an announcement",
      "create an educational post",
      "verify each claim."
    ],
    "prerequisites": [
      "m13"
    ],
    "objectives": [
      {
        "id": "m14-obj-1",
        "label": "Content writing",
        "interactionTarget": "story:m14:objective:1",
        "required": true
      },
      {
        "id": "m14-obj-2",
        "label": "technical communication",
        "interactionTarget": "story:m14:objective:2",
        "required": true
      },
      {
        "id": "m14-obj-3",
        "label": "research",
        "interactionTarget": "story:m14:objective:3",
        "required": true
      },
      {
        "id": "m14-obj-4",
        "label": "positioning",
        "interactionTarget": "story:m14:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 230,
      "skillBadges": [
        "The team asks the player to show evidence of the work."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "claims_that_cannot_be_verified_must_be_removed_or_qualified_"
    ],
    "nextMissionId": "m15",
    "ending": "Claims that cannot be verified must be removed or qualified.",
    "cliffhanger": "Claims that cannot be verified must be removed or qualified.",
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
      "Choose a direction",
      "write a bio",
      "organize work samples",
      "assemble a portfolio",
      "identify missing evidence."
    ],
    "prerequisites": [
      "m14"
    ],
    "objectives": [
      {
        "id": "m15-obj-1",
        "label": "Personal branding",
        "interactionTarget": "story:m15:objective:1",
        "required": true
      },
      {
        "id": "m15-obj-2",
        "label": "positioning",
        "interactionTarget": "story:m15:objective:2",
        "required": true
      },
      {
        "id": "m15-obj-3",
        "label": "portfolio",
        "interactionTarget": "story:m15:objective:3",
        "required": true
      },
      {
        "id": "m15-obj-4",
        "label": "networking",
        "interactionTarget": "story:m15:objective:4",
        "required": true
      },
      {
        "id": "m15-obj-5",
        "label": "building in public",
        "interactionTarget": "story:m15:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 240,
      "skillBadges": [
        "A credible portfolio unlocks the next application."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "the_reviewer_highlights_unsupported_claims_for_revision_"
    ],
    "nextMissionId": "m16",
    "ending": "The reviewer highlights unsupported claims for revision.",
    "cliffhanger": "The reviewer highlights unsupported claims for revision.",
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
      "Review a role",
      "map required skills",
      "complete a work sample",
      "submit an application",
      "respond to feedback."
    ],
    "prerequisites": [
      "m15"
    ],
    "objectives": [
      {
        "id": "m16-obj-1",
        "label": "Applications",
        "interactionTarget": "story:m16:objective:1",
        "required": true
      },
      {
        "id": "m16-obj-2",
        "label": "recruitment",
        "interactionTarget": "story:m16:objective:2",
        "required": true
      },
      {
        "id": "m16-obj-3",
        "label": "communication",
        "interactionTarget": "story:m16:objective:3",
        "required": true
      },
      {
        "id": "m16-obj-4",
        "label": "interviews",
        "interactionTarget": "story:m16:objective:4",
        "required": true
      },
      {
        "id": "m16-obj-5",
        "label": "job-scam awareness",
        "interactionTarget": "story:m16:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 250,
      "skillBadges": [
        "The player gets a first chance to contribute."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "feedback_identifies_what_to_improve_before_resubmission_"
    ],
    "nextMissionId": "m17",
    "ending": "Feedback identifies what to improve before resubmission.",
    "cliffhanger": "Feedback identifies what to improve before resubmission.",
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
      "Interview users",
      "map their journey",
      "find the main friction",
      "prioritize one fix",
      "test the revised flow."
    ],
    "prerequisites": [
      "m16"
    ],
    "objectives": [
      {
        "id": "m17-obj-1",
        "label": "Product management",
        "interactionTarget": "story:m17:objective:1",
        "required": true
      },
      {
        "id": "m17-obj-2",
        "label": "UX",
        "interactionTarget": "story:m17:objective:2",
        "required": true
      },
      {
        "id": "m17-obj-3",
        "label": "prioritization",
        "interactionTarget": "story:m17:objective:3",
        "required": true
      },
      {
        "id": "m17-obj-4",
        "label": "usability",
        "interactionTarget": "story:m17:objective:4",
        "required": true
      },
      {
        "id": "m17-obj-5",
        "label": "product-market fit",
        "interactionTarget": "story:m17:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 260,
      "skillBadges": [
        "The product becomes easier to use."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "a_second_test_round_reveals_whether_the_fix_worked_"
    ],
    "nextMissionId": "m18",
    "ending": "A second test round reveals whether the fix worked.",
    "cliffhanger": "A second test round reveals whether the fix worked.",
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
      "Define target users",
      "form a hypothesis",
      "prepare a campaign brief",
      "choose success metrics",
      "interpret results",
      "assess a suspicious growth offer."
    ],
    "prerequisites": [
      "m17"
    ],
    "objectives": [
      {
        "id": "m18-obj-1",
        "label": "Growth",
        "interactionTarget": "story:m18:objective:1",
        "required": true
      },
      {
        "id": "m18-obj-2",
        "label": "funnels",
        "interactionTarget": "story:m18:objective:2",
        "required": true
      },
      {
        "id": "m18-obj-3",
        "label": "partnerships",
        "interactionTarget": "story:m18:objective:3",
        "required": true
      },
      {
        "id": "m18-obj-4",
        "label": "acquisition",
        "interactionTarget": "story:m18:objective:4",
        "required": true
      },
      {
        "id": "m18-obj-5",
        "label": "retention",
        "interactionTarget": "story:m18:objective:5",
        "required": true
      },
      {
        "id": "m18-obj-6",
        "label": "analytics",
        "interactionTarget": "story:m18:objective:6",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 270,
      "skillBadges": [
        "The team rejects a suspicious promise of instant users."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "if_metrics_are_vanity_only_revise_the_experiment_"
    ],
    "nextMissionId": "m19",
    "ending": "If metrics are vanity-only, revise the experiment.",
    "cliffhanger": "If metrics are vanity-only, revise the experiment.",
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
      "Review a fictional budget",
      "compare proposals",
      "inspect allocation and vesting",
      "flag conflicts",
      "recommend a responsible option."
    ],
    "prerequisites": [
      "m18"
    ],
    "objectives": [
      {
        "id": "m19-obj-1",
        "label": "Startup finance",
        "interactionTarget": "story:m19:objective:1",
        "required": true
      },
      {
        "id": "m19-obj-2",
        "label": "grants",
        "interactionTarget": "story:m19:objective:2",
        "required": true
      },
      {
        "id": "m19-obj-3",
        "label": "venture capital",
        "interactionTarget": "story:m19:objective:3",
        "required": true
      },
      {
        "id": "m19-obj-4",
        "label": "tokenomics",
        "interactionTarget": "story:m19:objective:4",
        "required": true
      },
      {
        "id": "m19-obj-5",
        "label": "fundraising",
        "interactionTarget": "story:m19:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 280,
      "skillBadges": [
        "The founders choose a funding route that fits their obligations."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "a_comparison_worksheet_exposes_missing_assumptions_"
    ],
    "nextMissionId": "m20",
    "ending": "A comparison worksheet exposes missing assumptions.",
    "cliffhanger": "A comparison worksheet exposes missing assumptions.",
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
      "Review documentation",
      "find missing ownership evidence",
      "inspect custody/redemption",
      "test claims against evidence",
      "write questions required before launch."
    ],
    "prerequisites": [
      "m19"
    ],
    "objectives": [
      {
        "id": "m20-obj-1",
        "label": "RWA tokenization",
        "interactionTarget": "story:m20:objective:1",
        "required": true
      },
      {
        "id": "m20-obj-2",
        "label": "custody",
        "interactionTarget": "story:m20:objective:2",
        "required": true
      },
      {
        "id": "m20-obj-3",
        "label": "verification",
        "interactionTarget": "story:m20:objective:3",
        "required": true
      },
      {
        "id": "m20-obj-4",
        "label": "redemption",
        "interactionTarget": "story:m20:objective:4",
        "required": true
      },
      {
        "id": "m20-obj-5",
        "label": "legal and operational risk",
        "interactionTarget": "story:m20:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 290,
      "skillBadges": [
        "The announcement is paused until claims are supported."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "missing_evidence_remains_an_explicit_blocker_never_guessed_"
    ],
    "nextMissionId": "m21",
    "ending": "Missing evidence remains an explicit blocker, never guessed.",
    "cliffhanger": "Missing evidence remains an explicit blocker, never guessed.",
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
      "Inspect report",
      "verify on-chain claims in a simulator",
      "find false assumptions",
      "improve instructions",
      "retest output."
    ],
    "prerequisites": [
      "m20"
    ],
    "objectives": [
      {
        "id": "m21-obj-1",
        "label": "AI in Web3",
        "interactionTarget": "story:m21:objective:1",
        "required": true
      },
      {
        "id": "m21-obj-2",
        "label": "automation",
        "interactionTarget": "story:m21:objective:2",
        "required": true
      },
      {
        "id": "m21-obj-3",
        "label": "on-chain analysis",
        "interactionTarget": "story:m21:objective:3",
        "required": true
      },
      {
        "id": "m21-obj-4",
        "label": "verification",
        "interactionTarget": "story:m21:objective:4",
        "required": true
      },
      {
        "id": "m21-obj-5",
        "label": "human oversight",
        "interactionTarget": "story:m21:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 300,
      "skillBadges": [
        "The tool improves while high-impact decisions remain reviewed by people."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "the_player_retries_with_a_source_check_checklist_"
    ],
    "nextMissionId": "m22",
    "ending": "The player retries with a source-check checklist.",
    "cliffhanger": "The player retries with a source-check checklist.",
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
      "Compare simulated networks",
      "trace a transfer",
      "inspect the bridge role",
      "identify a fake interface",
      "explain risks and fees."
    ],
    "prerequisites": [
      "m21"
    ],
    "objectives": [
      {
        "id": "m22-obj-1",
        "label": "L1/L2",
        "interactionTarget": "story:m22:objective:1",
        "required": true
      },
      {
        "id": "m22-obj-2",
        "label": "interoperability",
        "interactionTarget": "story:m22:objective:2",
        "required": true
      },
      {
        "id": "m22-obj-3",
        "label": "bridges",
        "interactionTarget": "story:m22:objective:3",
        "required": true
      },
      {
        "id": "m22-obj-4",
        "label": "cross-chain transfers",
        "interactionTarget": "story:m22:objective:4",
        "required": true
      },
      {
        "id": "m22-obj-5",
        "label": "fees",
        "interactionTarget": "story:m22:objective:5",
        "required": true
      },
      {
        "id": "m22-obj-6",
        "label": "security",
        "interactionTarget": "story:m22:objective:6",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 310,
      "skillBadges": [
        "The archive reveals T3Kit connects people across different disciplines."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "a_suspicious_interface_is_safely_rejected_"
    ],
    "nextMissionId": "m23",
    "ending": "A suspicious interface is safely rejected.",
    "cliffhanger": "A suspicious interface is safely rejected.",
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
      "Read proposals",
      "compare trade-offs",
      "inspect a simulated treasury",
      "cast a test vote",
      "explain the outcome and participation limits."
    ],
    "prerequisites": [
      "m22"
    ],
    "objectives": [
      {
        "id": "m23-obj-1",
        "label": "DAOs",
        "interactionTarget": "story:m23:objective:1",
        "required": true
      },
      {
        "id": "m23-obj-2",
        "label": "governance",
        "interactionTarget": "story:m23:objective:2",
        "required": true
      },
      {
        "id": "m23-obj-3",
        "label": "voting",
        "interactionTarget": "story:m23:objective:3",
        "required": true
      },
      {
        "id": "m23-obj-4",
        "label": "proposals",
        "interactionTarget": "story:m23:objective:4",
        "required": true
      },
      {
        "id": "m23-obj-5",
        "label": "treasury management",
        "interactionTarget": "story:m23:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 320,
      "skillBadges": [
        "Members must decide how to restore accountability."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "a_proposal_comparison_guide_supports_a_second_attempt_"
    ],
    "nextMissionId": "m24",
    "ending": "A proposal comparison guide supports a second attempt.",
    "cliffhanger": "A proposal comparison guide supports a second attempt.",
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
      "Read a simulated finding",
      "estimate impact",
      "prioritize a fix",
      "prepare disclosure",
      "verify the patch in a test environment."
    ],
    "prerequisites": [
      "m23"
    ],
    "objectives": [
      {
        "id": "m24-obj-1",
        "label": "Threat modeling",
        "interactionTarget": "story:m24:objective:1",
        "required": true
      },
      {
        "id": "m24-obj-2",
        "label": "testing",
        "interactionTarget": "story:m24:objective:2",
        "required": true
      },
      {
        "id": "m24-obj-3",
        "label": "audits",
        "interactionTarget": "story:m24:objective:3",
        "required": true
      },
      {
        "id": "m24-obj-4",
        "label": "disclosure",
        "interactionTarget": "story:m24:objective:4",
        "required": true
      },
      {
        "id": "m24-obj-5",
        "label": "incident response",
        "interactionTarget": "story:m24:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 330,
      "skillBadges": [
        "The vulnerability pattern matches earlier T3Kit archive records."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "the_launch_stays_blocked_until_the_test_passes_"
    ],
    "nextMissionId": "m25",
    "ending": "The launch stays blocked until the test passes.",
    "cliffhanger": "The launch stays blocked until the test passes.",
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
      "Inspect a fictional collectible",
      "read license terms",
      "identify buyer rights",
      "compare creator revenue models",
      "rewrite unclear terms."
    ],
    "prerequisites": [
      "m24"
    ],
    "objectives": [
      {
        "id": "m25-obj-1",
        "label": "NFTs",
        "interactionTarget": "story:m25:objective:1",
        "required": true
      },
      {
        "id": "m25-obj-2",
        "label": "copyright",
        "interactionTarget": "story:m25:objective:2",
        "required": true
      },
      {
        "id": "m25-obj-3",
        "label": "licensing",
        "interactionTarget": "story:m25:objective:3",
        "required": true
      },
      {
        "id": "m25-obj-4",
        "label": "creator economy",
        "interactionTarget": "story:m25:objective:4",
        "required": true
      },
      {
        "id": "m25-obj-5",
        "label": "gated access",
        "interactionTarget": "story:m25:objective:5",
        "required": true
      },
      {
        "id": "m25-obj-6",
        "label": "publishing",
        "interactionTarget": "story:m25:objective:6",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 340,
      "skillBadges": [
        "The player sees that Web3 extends beyond trading."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "ambiguous_ownership_language_must_be_clarified_"
    ],
    "nextMissionId": "m26",
    "ending": "Ambiguous ownership language must be clarified.",
    "cliffhanger": "Ambiguous ownership language must be clarified.",
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
      "Explore a simulated repository",
      "find an issue",
      "improve documentation",
      "propose a contribution",
      "explain version control and review."
    ],
    "prerequisites": [
      "m25"
    ],
    "objectives": [
      {
        "id": "m26-obj-1",
        "label": "Git",
        "interactionTarget": "story:m26:objective:1",
        "required": true
      },
      {
        "id": "m26-obj-2",
        "label": "issues",
        "interactionTarget": "story:m26:objective:2",
        "required": true
      },
      {
        "id": "m26-obj-3",
        "label": "pull requests",
        "interactionTarget": "story:m26:objective:3",
        "required": true
      },
      {
        "id": "m26-obj-4",
        "label": "documentation",
        "interactionTarget": "story:m26:objective:4",
        "required": true
      },
      {
        "id": "m26-obj-5",
        "label": "open-source collaboration",
        "interactionTarget": "story:m26:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 350,
      "skillBadges": [
        "An early design document explains T3Kit as an ecosystem, not a single product."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "a_contribution_checklist_helps_the_player_revise_"
    ],
    "nextMissionId": "m27",
    "ending": "A contribution checklist helps the player revise.",
    "cliffhanger": "A contribution checklist helps the player revise.",
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
      "Review saved evidence",
      "connect clues",
      "identify contradictions",
      "map professional roles",
      "submit a reconstruction."
    ],
    "prerequisites": [
      "m26"
    ],
    "objectives": [
      {
        "id": "m27-obj-1",
        "label": "Research synthesis",
        "interactionTarget": "story:m27:objective:1",
        "required": true
      },
      {
        "id": "m27-obj-2",
        "label": "evidence evaluation",
        "interactionTarget": "story:m27:objective:2",
        "required": true
      },
      {
        "id": "m27-obj-3",
        "label": "ecosystem coordination",
        "interactionTarget": "story:m27:objective:3",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 360,
      "skillBadges": [
        "The archive unlocks KitCity as the destination."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "contradictions_must_be_supported_by_evidence_or_left_unresolved_"
    ],
    "nextMissionId": "m28",
    "ending": "Contradictions must be supported by evidence or left unresolved.",
    "cliffhanger": "Contradictions must be supported by evidence or left unresolved.",
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
      "Identify the problem",
      "choose relevant skills",
      "coordinate a simulated team",
      "build a safe prototype",
      "present the result."
    ],
    "prerequisites": [
      "m27"
    ],
    "objectives": [
      {
        "id": "m28-obj-1",
        "label": "Systems thinking",
        "interactionTarget": "story:m28:objective:1",
        "required": true
      },
      {
        "id": "m28-obj-2",
        "label": "teamwork",
        "interactionTarget": "story:m28:objective:2",
        "required": true
      },
      {
        "id": "m28-obj-3",
        "label": "practical judgment",
        "interactionTarget": "story:m28:objective:3",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 370,
      "skillBadges": [
        "Christol hands the player the final map to KitCity."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "the_assessment_points_to_gaps_and_can_be_retried_"
    ],
    "nextMissionId": "m29",
    "ending": "The assessment points to gaps and can be retried.",
    "cliffhanger": "The assessment points to gaps and can be retried.",
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
      "Explore the central district",
      "meet representatives",
      "choose a specialization",
      "register for a practical assessment."
    ],
    "prerequisites": [
      "m28"
    ],
    "objectives": [
      {
        "id": "m29-obj-1",
        "label": "Career exploration",
        "interactionTarget": "story:m29:objective:1",
        "required": true
      },
      {
        "id": "m29-obj-2",
        "label": "ecosystem literacy",
        "interactionTarget": "story:m29:objective:2",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 380,
      "skillBadges": [
        "The gates open and the player receives the Prove Yourself challenge."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "the_player_may_explore_and_return_to_the_assessment_later_"
    ],
    "nextMissionId": "m30",
    "ending": "The player may explore and return to the assessment later.",
    "cliffhanger": "The player may explore and return to the assessment later.",
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
      "Select a specialization",
      "complete its safe practical challenge",
      "review feedback",
      "submit the result",
      "retry if needed."
    ],
    "prerequisites": [
      "m29"
    ],
    "objectives": [
      {
        "id": "m30-obj-1",
        "label": "Practical execution",
        "interactionTarget": "story:m30:objective:1",
        "required": true
      },
      {
        "id": "m30-obj-2",
        "label": "problem-solving",
        "interactionTarget": "story:m30:objective:2",
        "required": true
      },
      {
        "id": "m30-obj-3",
        "label": "security",
        "interactionTarget": "story:m30:objective:3",
        "required": true
      },
      {
        "id": "m30-obj-4",
        "label": "communication",
        "interactionTarget": "story:m30:objective:4",
        "required": true
      },
      {
        "id": "m30-obj-5",
        "label": "collaboration",
        "interactionTarget": "story:m30:objective:5",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 390,
      "skillBadges": [
        "A Practitioner Profile records demonstrated work, not an externally accredited qualification."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "every_path_includes_feedback_and_a_retry_route_"
    ],
    "nextMissionId": "m31",
    "ending": "Every path includes feedback and a retry route.",
    "cliffhanger": "Every path includes feedback and a retry route.",
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
      "Review the journey",
      "choose what Web3 means to the player now",
      "select a future direction",
      "receive the practitioner record."
    ],
    "prerequisites": [
      "m30"
    ],
    "objectives": [
      {
        "id": "m31-obj-1",
        "label": "Reflection",
        "interactionTarget": "story:m31:objective:1",
        "required": true
      },
      {
        "id": "m31-obj-2",
        "label": "synthesis",
        "interactionTarget": "story:m31:objective:2",
        "required": true
      },
      {
        "id": "m31-obj-3",
        "label": "career planning",
        "interactionTarget": "story:m31:objective:3",
        "required": true
      }
    ],
    "successConditions": [
      "All required objectives are complete",
      "The player reviews the mission evidence"
    ],
    "failureAndRetry": {
      "onFailure": "Show a short in-world hint tied to the failed objective.",
      "retry": "Retry the current objective without losing completed objectives or saved story flags."
    },
    "rewards": {
      "xp": 400,
      "skillBadges": [
        "The player is welcomed as a KitCity Web3 Practitioner and the open world remains explorable."
      ],
      "portfolioArtifacts": []
    },
    "storyFlags": [
      "the_player_can_revisit_the_reveal_and_journal_at_any_time_"
    ],
    "nextMissionId": null,
    "ending": "The player can revisit the reveal and journal at any time.",
    "cliffhanger": "A new message arrives: We've got something new to build.",
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
  const plannedStateCoverage = NIGERIAN_STATES.map((state) => ({ state, coveredByMission: covered.has(state), routeStatus: covered.has(state) ? "mission-state" : "planned-travel-stop" }));
  return { valid: errors.length === 0, errors, missionCount: MISSIONS.length, characterCount: CHARACTER_ORDER.length, plannedStateCoverage };
}
