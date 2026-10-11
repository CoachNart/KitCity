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
    "title": "The Address Nobody Checked",
    "state": "Lagos",
    "location": "Lagos Island market, cybercafé and electronics shop",
    "npcIds": [
      "joe-sef",
      "larai"
    ],
    "npcs": [
      "Joe_Sef",
      "Larai"
    ],
    "narrativePurpose": "The laptop dispute is settled, but the buyer's copied address came from a page he trusted. Follow the route from the shop counter to the cybercafé where he copied it, then to Larai's records desk. The page was real; the address had been swapped. Find out how without accusing the wrong person.",
    "learningObjectives": [
      "How transaction hashes, networks and recipient addresses fit together",
      "How to preserve evidence before confronting someone",
      "Why an account display name cannot prove who controls an address"
    ],
    "prerequisites": [
      "m01"
    ],
    "objectives": [
      {
        "id": "m02-obj-1",
        "label": "Confirm the transaction explorer record with Joe_Sef",
        "interactionTarget": "story:m02:objective:1",
        "required": true
      },
      {
        "id": "m02-obj-2",
        "label": "Trace a transaction and compare the recipient address",
        "interactionTarget": "story:m02:objective:2",
        "required": true
      },
      {
        "id": "m02-obj-3",
        "label": "Identify the source of the copied address",
        "interactionTarget": "story:m02:objective:3",
        "required": true
      },
      {
        "id": "m02-obj-4",
        "label": "Record the address mismatch in an incident report",
        "interactionTarget": "story:m02:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player locates the public record using its hash and network",
      "The player verifies the recipient mismatch and preserves the copied-page evidence",
      "The player writes a factual report without claiming to know intent"
    ],
    "failureAndRetry": {
      "onFailure": "If the player accuses the buyer or treats the display name as proof, Larai asks them to separate observation from assumption and revisit the page history.",
      "retry": "Retry the current evidence interaction; preserve completed checks and the report draft."
    },
    "rewards": {
      "xp": 115,
      "skillBadges": [
        "Transaction Forensics"
      ],
      "portfolioArtifacts": [
        "Lagos address-mismatch case file"
      ]
    },
    "storyFlags": [
      "m02_complete",
      "payment_recipient_mismatch_confirmed",
      "copied_address_source_preserved"
    ],
    "nextMissionId": "m03",
    "ending": "The record proves where the funds went, not why. The buyer recognises the page but cannot explain the altered address. Joe_Sef saves the URL and timestamp before the page disappears.",
    "cliffhanger": "A nearby student says the same page offered to 'restore' a wallet if users entered twelve secret words. You leave Lagos with a second case: someone is targeting newcomers.",
    "sceneLines": [
      "The transaction went through, but not to the shop. I want the page history before we decide whether it was a mistake or something worse.",
      "The page used the shop's name, but the recipient address was different. I saved the URL and timestamp before it changed."
    ]
  },
  {
    "id": "m03",
    "chapterId": "ch02",
    "title": "Twelve Words Too Many",
    "state": "Oyo",
    "location": "Oyo bus park, phone-repair kiosk and student courtyard",
    "npcIds": [
      "unique",
      "smrt-huntr"
    ],
    "npcs": [
      "Unique",
      "Smrt huntr"
    ],
    "narrativePurpose": "In Oyo, a student named Timi is locked out of a wallet after a stranger promises to recover it. Follow the student from the bus park to a repair kiosk and then to Unique's courtyard. The recovery page asks for secret words; the student has not submitted them yet.",
    "learningObjectives": [
      "What a wallet address does and what a recovery phrase controls",
      "How to recognise a fake recovery flow",
      "How to protect someone without shaming them"
    ],
    "prerequisites": [
      "m02"
    ],
    "objectives": [
      {
        "id": "m03-obj-1",
        "label": "Interview two users about the recovery message",
        "interactionTarget": "story:m03:objective:1",
        "required": true
      },
      {
        "id": "m03-obj-2",
        "label": "Create a wallet at the practice kiosk",
        "interactionTarget": "story:m03:objective:2",
        "required": true
      },
      {
        "id": "m03-obj-3",
        "label": "Identify the fake recovery interface",
        "interactionTarget": "story:m03:objective:3",
        "required": true
      },
      {
        "id": "m03-obj-4",
        "label": "Reject a malicious request and help secure the account",
        "interactionTarget": "story:m03:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player identifies the secret-phrase request as unsafe",
      "The player creates a practice wallet without exposing recovery details",
      "The student leaves the fake recovery page and receives a calm safety checklist"
    ],
    "failureAndRetry": {
      "onFailure": "If the player enters or shares the phrase in the decision, Unique stops the exercise and explains the consequence before allowing a safe retry.",
      "retry": "Restart the unsafe choice, not the whole mission; keep the user's safety checklist."
    },
    "rewards": {
      "xp": 125,
      "skillBadges": [
        "Wallet Safety"
      ],
      "portfolioArtifacts": [
        "Newcomer wallet-safety checklist"
      ]
    },
    "storyFlags": [
      "m03_complete",
      "recovery_scam_identified"
    ],
    "nextMissionId": "m04",
    "ending": "Timi closes the page before entering the words. Smrt huntr helps the student verify the official support route, and Unique turns the incident into a warning that does not expose the victim.",
    "cliffhanger": "A forwarded screenshot now claims the wallet was drained anyway. Goodness and Semi want you to prove what happened before the group chat blames the wrong person.",
    "sceneLines": [
      "Timi is scared they'll lose everything if they close the page. We need to show them that stopping is safer than giving away the recovery words.",
      "I checked the recovery flow. A real support route should never need the secret phrase itself."
    ]
  },
  {
    "id": "m04",
    "chapterId": "ch02",
    "title": "The Screenshot Trial",
    "state": "Oyo",
    "location": "Oyo student courtyard, roadside print shop and community hall",
    "npcIds": [
      "goodness",
      "semi"
    ],
    "npcs": [
      "Goodness",
      "Semi"
    ],
    "narrativePurpose": "Two screenshots tell different stories about Timi's wallet. Follow the trail from the student courtyard to a print shop where the images were edited, then to the community hall where the group is ready to publish accusations. Determine what the records actually establish.",
    "learningObjectives": [
      "How public records differ from screenshots",
      "What blocks and confirmations can tell you",
      "How to correct misinformation without overstating certainty"
    ],
    "prerequisites": [
      "m03"
    ],
    "objectives": [
      {
        "id": "m04-obj-1",
        "label": "Inspect the transaction explorer record",
        "interactionTarget": "story:m04:objective:1",
        "required": true
      },
      {
        "id": "m04-obj-2",
        "label": "Identify its block and confirmation details",
        "interactionTarget": "story:m04:objective:2",
        "required": true
      },
      {
        "id": "m04-obj-3",
        "label": "Investigate the proposed record change",
        "interactionTarget": "story:m04:objective:3",
        "required": true
      },
      {
        "id": "m04-obj-4",
        "label": "Explain consensus using the evidence",
        "interactionTarget": "story:m04:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player finds the matching transaction record",
      "The original evidence is preserved and the edited images are labelled as unverified",
      "The public correction distinguishes known facts from unknown intent"
    ],
    "failureAndRetry": {
      "onFailure": "If the player edits or deletes the original evidence, Semi restores the saved copy and asks the player to document the change transparently.",
      "retry": "Retry the disputed evidence step with the original record preserved."
    },
    "rewards": {
      "xp": 135,
      "skillBadges": [
        "Evidence Handling"
      ],
      "portfolioArtifacts": [
        "Public-record verification note"
      ]
    },
    "storyFlags": [
      "m04_complete",
      "edited_screenshot_detected",
      "original_evidence_preserved"
    ],
    "nextMissionId": "m05",
    "ending": "The transaction record does not support the rumour that Timi's wallet was drained. The group posts a correction, and the edited screenshots are retained as evidence rather than passed around as proof.",
    "cliffhanger": "Goodness's correction gets shared by a small team building a payment app for local traders. In Osun, Blockqueen and Christol are arguing over why customers abandon it halfway through checkout.",
    "sceneLines": [
      "The screenshot was cropped before it reached the group. Let's keep the original and compare it with the public record.",
      "The block reference matches the transfer, but it doesn't tell us who edited the picture. We should correct the claim, not invent a culprit."
    ]
  },
  {
    "id": "m05",
    "chapterId": "ch03",
    "title": "The Queue That Never Ends",
    "state": "Osun",
    "location": "Osun market entrance, trader stalls and a small product studio",
    "npcIds": [
      "blockqueen",
      "christol"
    ],
    "npcs": [
      "Blockqueen",
      "Christol"
    ],
    "narrativePurpose": "A market-trader payment app looks polished but customers keep abandoning checkout. Walk the market queue, watch two traders attempt the flow, then carry their feedback to the studio. The team suspects users do not understand crypto; the evidence points to a confusing network-selection screen.",
    "learningObjectives": [
      "How to interview users without leading them",
      "How to observe a real product failure",
      "How to choose a small fix and test it"
    ],
    "prerequisites": [
      "m04"
    ],
    "objectives": [
      {
        "id": "m05-obj-1",
        "label": "Interview two users at the market queue",
        "interactionTarget": "story:m05:objective:1",
        "required": true
      },
      {
        "id": "m05-obj-2",
        "label": "Test the core flow on a trader's phone",
        "interactionTarget": "story:m05:objective:2",
        "required": true
      },
      {
        "id": "m05-obj-3",
        "label": "Isolate the biggest failure in the checkout",
        "interactionTarget": "story:m05:objective:3",
        "required": true
      },
      {
        "id": "m05-obj-4",
        "label": "Prioritize one fix and test the revised flow",
        "interactionTarget": "story:m05:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "Two user observations identify the same checkout confusion",
      "The team reproduces the failure before changing the interface",
      "A focused fix is tested with traders before release"
    ],
    "failureAndRetry": {
      "onFailure": "If the player proposes features without evidence, Blockqueen sends them back to observe one more checkout attempt.",
      "retry": "Repeat the affected user test while retaining previous interview notes."
    },
    "rewards": {
      "xp": 145,
      "skillBadges": [
        "Product Discovery"
      ],
      "portfolioArtifacts": [
        "Market checkout test report"
      ]
    },
    "storyFlags": [
      "m05_complete",
      "checkout_friction_confirmed"
    ],
    "nextMissionId": "m06",
    "ending": "The clearer network labels reduce confusion in the retest. Christol postpones the dashboard and asks the team to measure completed payments instead of celebrating a prettier demo.",
    "cliffhanger": "During the retest, a payment succeeds twice when a customer taps the button again. Laloba and BigSam are preparing the contract release and need someone to stop a costly mistake.",
    "sceneLines": [
      "I thought traders needed more features. Watching them use checkout showed me the network screen is where they get stuck.",
      "Both traders hesitated at the same step. Let's test a clearer label before we spend another week on the dashboard."
    ]
  },
  {
    "id": "m06",
    "chapterId": "ch03",
    "title": "The Second Tap",
    "state": "Osun",
    "location": "Product studio, test kiosk and launch courtyard",
    "npcIds": [
      "laloba",
      "bigsam"
    ],
    "npcs": [
      "Laloba",
      "BigSam"
    ],
    "narrativePurpose": "The checkout fix exposes a deeper bug: two rapid taps create duplicate payment instructions. Move from the studio to a test kiosk, reproduce the fault, and take the evidence to the launch courtyard before the team ships code that could charge customers twice.",
    "learningObjectives": [
      "Why smart contracts need explicit rules and permissions",
      "How to reproduce an edge case",
      "Why a demo passing once is not a security review"
    ],
    "prerequisites": [
      "m05"
    ],
    "objectives": [
      {
        "id": "m06-obj-1",
        "label": "Inspect the contract workspace and permissions",
        "interactionTarget": "story:m06:objective:1",
        "required": true
      },
      {
        "id": "m06-obj-2",
        "label": "Reproduce the payment bug with a test case",
        "interactionTarget": "story:m06:objective:2",
        "required": true
      },
      {
        "id": "m06-obj-3",
        "label": "Propose a fix for the duplicate-payment path",
        "interactionTarget": "story:m06:objective:3",
        "required": true
      },
      {
        "id": "m06-obj-4",
        "label": "Run tests needed before deployment",
        "interactionTarget": "story:m06:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player reproduces the double-processing bug",
      "The proposed fix addresses state and duplicate execution",
      "Release stays paused until regression checks pass"
    ],
    "failureAndRetry": {
      "onFailure": "If the player approves launch after only a happy-path demo, Laloba replays the duplicate charge and requests the missing test.",
      "retry": "Retry the failed test or release decision without losing the reproduction notes."
    },
    "rewards": {
      "xp": 155,
      "skillBadges": [
        "Contract Testing"
      ],
      "portfolioArtifacts": [
        "Duplicate-payment test report"
      ]
    },
    "storyFlags": [
      "m06_complete",
      "duplicate_payment_bug_blocked"
    ],
    "nextMissionId": "m07",
    "ending": "The duplicate-processing path is fixed in the test build, and the team refuses to treat a successful demo as proof of safety. BigSam postpones launch until the full test suite passes.",
    "cliffhanger": "A trader who watched the test asks why a swap still returned less than its quote. In Ekiti, LunaX and OxNight are investigating a pool that looks deep until the actual trade lands.",
    "sceneLines": [
      "The duplicate payment is not a button problem. The contract must reject the second processing attempt too.",
      "I reproduced it three times. Until the regression test passes, the launch date is just a date."
    ]
  },
  {
    "id": "m07",
    "chapterId": "ch04",
    "title": "The Price on the Screen",
    "state": "Ekiti",
    "location": "Ekiti market stall, swap kiosk and pool-liquidity board",
    "npcIds": [
      "lunax",
      "oxnight"
    ],
    "npcs": [
      "LunaX",
      "OxNight"
    ],
    "narrativePurpose": "A trader says a swap returned less than the quoted amount. Follow the trade from the market stall to a swap kiosk and compare two liquidity pools. The issue may be price impact, fees or a token with a misleading symbol; do not blame the market until the evidence is checked.",
    "learningObjectives": [
      "How liquidity and price impact affect execution",
      "Why token addresses matter more than symbols",
      "How to inspect approvals before a swap"
    ],
    "prerequisites": [
      "m06"
    ],
    "objectives": [
      {
        "id": "m07-obj-1",
        "label": "Compare liquidity pools for the trader's swap",
        "interactionTarget": "story:m07:objective:1",
        "required": true
      },
      {
        "id": "m07-obj-2",
        "label": "Estimate price impact before confirming",
        "interactionTarget": "story:m07:objective:2",
        "required": true
      },
      {
        "id": "m07-obj-3",
        "label": "Execute a small practice swap after reviewing the quote",
        "interactionTarget": "story:m07:objective:3",
        "required": true
      },
      {
        "id": "m07-obj-4",
        "label": "Inspect token approval and explain slippage",
        "interactionTarget": "story:m07:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player identifies the route's price-impact and fee differences",
      "The practice swap uses a verified token and reviewed quote",
      "The approval is limited to what the task requires"
    ],
    "failureAndRetry": {
      "onFailure": "If the player trusts a symbol or approves unlimited spending automatically, OxNight asks them to inspect the token address and permission screen again.",
      "retry": "Repeat the quote and approval review without resetting the pool comparison."
    },
    "rewards": {
      "xp": 165,
      "skillBadges": [
        "Swap Literacy"
      ],
      "portfolioArtifacts": [
        "Swap route comparison"
      ]
    },
    "storyFlags": [
      "m07_complete",
      "swap_route_reviewed"
    ],
    "nextMissionId": "m08",
    "ending": "The trader learns that the quote was an estimate, not a promise. LunaX flags the suspicious token listing and updates the team's checklist before anyone makes another swap.",
    "cliffhanger": "The group now relies on a centralized exchange for cash-outs, but withdrawals have paused. Moon and The Cryptonian are at the branch office where customers are demanding answers.",
    "sceneLines": [
      "The token symbol looked right, but the address and pool depth told a different story. Check those before touching the approval.",
      "The quote changed because the trade was large for that pool. We still need to check fees and permissions separately."
    ]
  },
  {
    "id": "m08",
    "chapterId": "ch04",
    "title": "The Withdrawal Queue",
    "state": "Ekiti",
    "location": "Exchange branch, public notice board and customer waiting area",
    "npcIds": [
      "moon",
      "the-cryptonian"
    ],
    "npcs": [
      "Moon",
      "The Cryptonian"
    ],
    "narrativePurpose": "Withdrawals are paused and customers are sharing rumours that the exchange has vanished. Walk the waiting area, read the official notice and compare it with support responses before drafting an update. You must give people useful next steps without inventing a cause.",
    "learningObjectives": [
      "How market and limit orders differ",
      "What custodial platforms control",
      "How to communicate an incident using verified facts"
    ],
    "prerequisites": [
      "m07"
    ],
    "objectives": [
      {
        "id": "m08-obj-1",
        "label": "Compare market and limit orders using the order book",
        "interactionTarget": "story:m08:objective:1",
        "required": true
      },
      {
        "id": "m08-obj-2",
        "label": "Inspect the withdrawal incident notice",
        "interactionTarget": "story:m08:objective:2",
        "required": true
      },
      {
        "id": "m08-obj-3",
        "label": "Compare custody models with a customer",
        "interactionTarget": "story:m08:objective:3",
        "required": true
      },
      {
        "id": "m08-obj-4",
        "label": "Publish a verified status update",
        "interactionTarget": "story:m08:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player separates confirmed information from rumours",
      "The customer receives a clear explanation of custody",
      "The status update includes an official source and next update"
    ],
    "failureAndRetry": {
      "onFailure": "If the player publishes a guessed cause or guarantee, Moon rejects the draft and asks for the official notice.",
      "retry": "Edit the update and submit again; preserve the evidence already gathered."
    },
    "rewards": {
      "xp": 175,
      "skillBadges": [
        "Incident Communication"
      ],
      "portfolioArtifacts": [
        "Verified withdrawal-status notice"
      ]
    },
    "storyFlags": [
      "m08_complete",
      "withdrawal_incident_reported"
    ],
    "nextMissionId": "m09",
    "ending": "The update does not promise a timeline the team cannot support. Customers still have questions, but they know where to check official updates and what not to share with fake support accounts.",
    "cliffhanger": "One customer has been trading through the night trying to recover a loss. In Delta, Joseph Nnadi and The Don are asking whether a trade plan can survive the trader's emotions.",
    "sceneLines": [
      "Customers keep asking if their funds are gone. The notice only confirms that withdrawals are paused, so we must not promise more.",
      "I want the update to give people a safe next step, not another rumour to forward."
    ]
  },
  {
    "id": "m09",
    "chapterId": "ch05",
    "title": "The Trade After the Loss",
    "state": "Delta",
    "location": "Delta roadside café, chart desk and journal bench",
    "npcIds": [
      "joseph-nnadi",
      "the-don"
    ],
    "npcs": [
      "Joseph Nnadi",
      "The Don"
    ],
    "narrativePurpose": "A trader loses money and wants to enter again before the next candle closes. Walk from the café where the argument starts to the chart desk and then the journal bench. Reconstruct the original plan before deciding whether another trade is justified.",
    "learningObjectives": [
      "How entry, invalidation and position size fit together",
      "Why a losing trade is not automatically a bad process",
      "How to journal a decision without rewriting history"
    ],
    "prerequisites": [
      "m08"
    ],
    "objectives": [
      {
        "id": "m09-obj-1",
        "label": "Read the market chart and mark the setup",
        "interactionTarget": "story:m09:objective:1",
        "required": true
      },
      {
        "id": "m09-obj-2",
        "label": "Calculate risk before changing position size",
        "interactionTarget": "story:m09:objective:2",
        "required": true
      },
      {
        "id": "m09-obj-3",
        "label": "Paper trade the revised setup",
        "interactionTarget": "story:m09:objective:3",
        "required": true
      },
      {
        "id": "m09-obj-4",
        "label": "Record the outcome in the trading journal",
        "interactionTarget": "story:m09:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player reconstructs the original plan and invalidation",
      "Risk is calculated before any new position",
      "The paper-trade result is recorded honestly"
    ],
    "failureAndRetry": {
      "onFailure": "If the player chooses revenge sizing, Joseph asks them to compare the risk with the plan they agreed before the loss.",
      "retry": "Repeat the sizing decision and paper-trade review; keep the original journal entry."
    },
    "rewards": {
      "xp": 185,
      "skillBadges": [
        "Trade Process"
      ],
      "portfolioArtifacts": [
        "Post-trade review journal"
      ]
    },
    "storyFlags": [
      "m09_complete",
      "revenge_trade_avoided"
    ],
    "nextMissionId": "m10",
    "ending": "The trader decides not to force a new entry. The journal records the loss without rewriting the rules, and The Don admits that following a plan can mean sitting out.",
    "cliffhanger": "Toza has been telling everyone that more leverage would have made the recovery faster. Praise calls you over when the margin buffer on his open position starts shrinking.",
    "sceneLines": [
      "The loss hurts, but the original plan was clear. Let's review where it failed before deciding whether another trade even exists.",
      "If you change the rules after every loss, the journal becomes fiction. Record the plan you actually followed."
    ]
  },
  {
    "id": "m10",
    "chapterId": "ch05",
    "title": "The Margin Call",
    "state": "Delta",
    "location": "Delta trading lounge, risk desk and quiet courtyard",
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
    "narrativePurpose": "Toza's leveraged position is moving against him, and he wants to add more margin without checking his exposure. Follow him from the trading lounge to Craftore's risk desk, then to a quiet courtyard where the decision must be made before the next price update.",
    "learningObjectives": [
      "How leverage changes exposure",
      "How margin and liquidation risk interact",
      "Why a pre-agreed close plan matters more than a rescue prediction"
    ],
    "prerequisites": [
      "m09"
    ],
    "objectives": [
      {
        "id": "m10-obj-1",
        "label": "Open a futures position in the practice terminal",
        "interactionTarget": "story:m10:objective:1",
        "required": true
      },
      {
        "id": "m10-obj-2",
        "label": "Compare leverage and estimate margin",
        "interactionTarget": "story:m10:objective:2",
        "required": true
      },
      {
        "id": "m10-obj-3",
        "label": "Identify liquidation risk from the position details",
        "interactionTarget": "story:m10:objective:3",
        "required": true
      },
      {
        "id": "m10-obj-4",
        "label": "Review the loss and close plan",
        "interactionTarget": "story:m10:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player calculates exposure and margin",
      "The liquidation threshold is understood",
      "Toza follows the previously agreed risk plan"
    ],
    "failureAndRetry": {
      "onFailure": "If the player recommends adding leverage without a new risk calculation, Craftore shows how the liquidation buffer changes and reopens the decision.",
      "retry": "Retry the current risk decision; preserve the original position data."
    },
    "rewards": {
      "xp": 195,
      "skillBadges": [
        "Leverage Risk"
      ],
      "portfolioArtifacts": [
        "Leveraged-position risk review"
      ]
    },
    "storyFlags": [
      "m10_complete",
      "leverage_risk_reviewed"
    ],
    "nextMissionId": "m11",
    "ending": "Toza closes the position according to the plan. It is not the outcome he wanted, but the loss is bounded and the team has a record of what happened.",
    "cliffhanger": "Craftore shares the case with a project that has thousands of online followers but few people doing useful work. In Anambra, Kodavic and Cybersage want to know where newcomers disappear.",
    "sceneLines": [
      "Toza keeps watching the price instead of the margin buffer. We need to show him what the position can lose.",
      "Adding leverage won't repair a broken idea. Let's follow the limit he set before entering."
    ]
  },
  {
    "id": "m11",
    "chapterId": "ch06",
    "title": "The Empty Community Hall",
    "state": "Anambra",
    "location": "Anambra community hall, street food stall and onboarding desk",
    "npcIds": [
      "kodavic",
      "cybersage"
    ],
    "npcs": [
      "Kodavic",
      "Cybersage"
    ],
    "narrativePurpose": "The project celebrates its follower count, but its weekly hall is nearly empty and new members never complete their first task. Walk the hall, talk to people who left early, and rebuild the first session around a real outcome rather than another giveaway.",
    "learningObjectives": [
      "How onboarding shapes participation",
      "How to use member interviews and drop-off evidence",
      "Why completed tasks and return visits matter more than raw membership"
    ],
    "prerequisites": [
      "m10"
    ],
    "objectives": [
      {
        "id": "m11-obj-1",
        "label": "Inspect onboarding at the community entrance",
        "interactionTarget": "story:m11:objective:1",
        "required": true
      },
      {
        "id": "m11-obj-2",
        "label": "Interview members who stopped attending",
        "interactionTarget": "story:m11:objective:2",
        "required": true
      },
      {
        "id": "m11-obj-3",
        "label": "Locate the drop-off in the first-task journey",
        "interactionTarget": "story:m11:objective:3",
        "required": true
      },
      {
        "id": "m11-obj-4",
        "label": "Redesign the first session and choose a retention metric",
        "interactionTarget": "story:m11:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player finds a documented onboarding obstacle",
      "The first task is redesigned around a clear outcome",
      "The team agrees to track completion and return visits"
    ],
    "failureAndRetry": {
      "onFailure": "If the player recommends a giveaway before fixing the first task, Cybersage asks for evidence that rewards solve the actual drop-off.",
      "retry": "Revise the onboarding plan using the interview notes already collected."
    },
    "rewards": {
      "xp": 205,
      "skillBadges": [
        "Community Design"
      ],
      "portfolioArtifacts": [
        "Newcomer onboarding plan"
      ]
    },
    "storyFlags": [
      "m11_complete",
      "community_onboarding_rebuilt"
    ],
    "nextMissionId": "m12",
    "ending": "The next session starts with one practical task, a short explanation and a clear next step. More people finish it, and the team finally has a useful baseline.",
    "cliffhanger": "A newcomer who returned receives a direct message from someone impersonating a moderator. Reina and Cclya are already moving through the hall to contain it.",
    "sceneLines": [
      "People joined because the campaign promised rewards, then left when they couldn't see what to do. The first task has to make sense.",
      "Let's stop counting joins for a moment. I want to know who finished the task and came back."
    ]
  },
  {
    "id": "m12",
    "chapterId": "ch06",
    "title": "The Moderator Who Wasn't",
    "state": "Anambra",
    "location": "Community hall, message kiosk and account-support desk",
    "npcIds": [
      "reina",
      "cclya"
    ],
    "npcs": [
      "Reina",
      "Cclya"
    ],
    "narrativePurpose": "A fake moderator sends direct messages asking members to verify wallets. Move from the hall to the message kiosk to preserve the evidence, then to the support desk to help the affected newcomer secure their account. The response must stop the scam without spreading the link or exposing the victim.",
    "learningObjectives": [
      "How to verify moderator identity",
      "How to contain a malicious message",
      "How to communicate a safety incident without shaming users"
    ],
    "prerequisites": [
      "m11"
    ],
    "objectives": [
      {
        "id": "m12-obj-1",
        "label": "Identify impersonation by checking the account",
        "interactionTarget": "story:m12:objective:1",
        "required": true
      },
      {
        "id": "m12-obj-2",
        "label": "Contain a dangerous message and preserve evidence",
        "interactionTarget": "story:m12:objective:2",
        "required": true
      },
      {
        "id": "m12-obj-3",
        "label": "Secure the affected user's account",
        "interactionTarget": "story:m12:objective:3",
        "required": true
      },
      {
        "id": "m12-obj-4",
        "label": "Publish a clear incident notice",
        "interactionTarget": "story:m12:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The account is verified as an impersonator",
      "Evidence is preserved and the message is contained",
      "The affected member receives safe next steps and the community receives a factual notice"
    ],
    "failureAndRetry": {
      "onFailure": "If the player reposts the scam link or exposes the victim, Cclya pauses the notice and asks them to remove harmful details.",
      "retry": "Retry the containment or notice step while preserving the incident record."
    },
    "rewards": {
      "xp": 215,
      "skillBadges": [
        "Community Safety"
      ],
      "portfolioArtifacts": [
        "Moderator incident response plan"
      ]
    },
    "storyFlags": [
      "m12_complete",
      "impersonator_contained"
    ],
    "nextMissionId": "m13",
    "ending": "The fake account is reported and the community gets a clear warning without the victim becoming the story. The group asks for a live session to explain what happened.",
    "cliffhanger": "The scheduled host cancels minutes before the session. Leemah and Kenny hand you the mic, a stack of questions and a room full of people who want honest answers.",
    "sceneLines": [
      "The fake moderator copied our profile picture. The official list and message history are better evidence than appearance.",
      "Please don't repost the scam link. We can warn people without sending more of them into the trap."
    ]
  },
  {
    "id": "m13",
    "chapterId": "ch07",
    "title": "The Mic Is Live",
    "state": "Enugu",
    "location": "Enugu event foyer, sound desk and live-session stage",
    "npcIds": [
      "leemah",
      "kenny"
    ],
    "npcs": [
      "Leemah",
      "Kenny"
    ],
    "narrativePurpose": "The safety session is about to start without its host. Move from the foyer to the sound desk to prepare, then take the stage and handle a difficult question about whether a wallet can ever be completely safe. The audience needs useful steps, not a promise of perfect security.",
    "learningObjectives": [
      "How to structure a useful live session",
      "How to ask and moderate questions",
      "How to answer honestly when evidence is incomplete"
    ],
    "prerequisites": [
      "m12"
    ],
    "objectives": [
      {
        "id": "m13-obj-1",
        "label": "Research the topic and verify the core facts",
        "interactionTarget": "story:m13:objective:1",
        "required": true
      },
      {
        "id": "m13-obj-2",
        "label": "Prepare an opening and arrange audience questions",
        "interactionTarget": "story:m13:objective:2",
        "required": true
      },
      {
        "id": "m13-obj-3",
        "label": "Host a live session with clear moderation",
        "interactionTarget": "story:m13:objective:3",
        "required": true
      },
      {
        "id": "m13-obj-4",
        "label": "Handle a difficult question and write a recap",
        "interactionTarget": "story:m13:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The session opens with clear expectations",
      "The player handles disagreement without suppressing questions",
      "The recap includes verified facts and actionable safety steps"
    ],
    "failureAndRetry": {
      "onFailure": "If the player guesses or blames the victim, Leemah asks them to restate the answer using only the evidence.",
      "retry": "Repeat the response and recap step without restarting the event."
    },
    "rewards": {
      "xp": 225,
      "skillBadges": [
        "Live Communication"
      ],
      "portfolioArtifacts": [
        "Safety-session recap"
      ]
    },
    "storyFlags": [
      "m13_complete",
      "community_safety_session_delivered"
    ],
    "nextMissionId": "m14",
    "ending": "The audience leaves with a checklist and a reporting route. Kenny clips the practical section, not the argument, and sends the recap to the people who missed the session.",
    "cliffhanger": "A founder asks why the recap reached people but their product announcement never does. Kore and Veedima are waiting at the next street corner with a message nobody understands.",
    "sceneLines": [
      "People want a straight answer, even when the answer is that we don't know yet. Keep the session useful and honest.",
      "I have the questions sorted by what we can verify. If one goes beyond the evidence, say so and give a follow-up route."
    ]
  },
  {
    "id": "m14",
    "chapterId": "ch07",
    "title": "What Does This Product Do?",
    "state": "Enugu",
    "location": "Enugu street corner, founder's workspace and print kiosk",
    "npcIds": [
      "kore",
      "veedima"
    ],
    "npcs": [
      "Kore",
      "Veedima"
    ],
    "narrativePurpose": "A founder's announcement is full of big technical claims but never explains the problem the product solves. Walk the street corner to ask intended users what they need, return to the workspace to check the product, and take a plain-language version to the print kiosk for a final claim check.",
    "learningObjectives": [
      "How to match a message to an audience",
      "How to explain a technical product in plain language",
      "How to remove claims the team cannot substantiate"
    ],
    "prerequisites": [
      "m13"
    ],
    "objectives": [
      {
        "id": "m14-obj-1",
        "label": "Identify the audience for the product message",
        "interactionTarget": "story:m14:objective:1",
        "required": true
      },
      {
        "id": "m14-obj-2",
        "label": "Research the product and verify each claim",
        "interactionTarget": "story:m14:objective:2",
        "required": true
      },
      {
        "id": "m14-obj-3",
        "label": "Rewrite an announcement in plain language",
        "interactionTarget": "story:m14:objective:3",
        "required": true
      },
      {
        "id": "m14-obj-4",
        "label": "Create an educational post with a useful next step",
        "interactionTarget": "story:m14:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The audience is defined",
      "Every product claim is checked against current evidence",
      "The revised message is understandable and includes a useful next step"
    ],
    "failureAndRetry": {
      "onFailure": "If the player leaves an unsupported claim in the draft, Veedima asks for the proof or removes the claim.",
      "retry": "Edit the draft and run the claim check again."
    },
    "rewards": {
      "xp": 235,
      "skillBadges": [
        "Technical Communication"
      ],
      "portfolioArtifacts": [
        "Verified product announcement"
      ]
    },
    "storyFlags": [
      "m14_complete",
      "product_message_verified"
    ],
    "nextMissionId": "m15",
    "ending": "The founder approves a shorter announcement that explains what the product does now and what it does not do yet. It is less dramatic and far more useful.",
    "cliffhanger": "Someone who read the post offers you a chance to apply for a Web3 role. Web3_Esta and Love say the next step is not another impressive bio; it is evidence of work.",
    "sceneLines": [
      "The announcement says 'revolutionary infrastructure' three times and never tells a trader what the product does.",
      "I checked the feature myself. Let's explain what works today and leave the roadmap out of the claim."
    ]
  },
  {
    "id": "m15",
    "chapterId": "ch08",
    "title": "Show the Work",
    "state": "Plateau",
    "location": "Plateau co-working entrance, portfolio wall and skills desk",
    "npcIds": [
      "web3-esta",
      "love"
    ],
    "npcs": [
      "Web3_Esta",
      "Love"
    ],
    "narrativePurpose": "A hiring lead asks what you have actually contributed. Move from the co-working entrance to the portfolio wall and then to the skills desk. Turn your work from the payment investigation, product test and safety session into evidence someone else can verify.",
    "learningObjectives": [
      "How to present work samples with context",
      "How to distinguish contribution from association",
      "How to identify the next skill gap"
    ],
    "prerequisites": [
      "m14"
    ],
    "objectives": [
      {
        "id": "m15-obj-1",
        "label": "Choose a specialization that matches your work",
        "interactionTarget": "story:m15:objective:1",
        "required": true
      },
      {
        "id": "m15-obj-2",
        "label": "Organize work samples into a portfolio",
        "interactionTarget": "story:m15:objective:2",
        "required": true
      },
      {
        "id": "m15-obj-3",
        "label": "Identify missing evidence in your portfolio",
        "interactionTarget": "story:m15:objective:3",
        "required": true
      },
      {
        "id": "m15-obj-4",
        "label": "Write a bio that points to real work",
        "interactionTarget": "story:m15:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player chooses a coherent professional direction",
      "At least two real work samples include contribution and evidence",
      "The bio does not claim work the player did not do"
    ],
    "failureAndRetry": {
      "onFailure": "If the player claims credit for the whole team, Love asks them to separate their own work from the shared outcome.",
      "retry": "Revise the portfolio sample while preserving the evidence already collected."
    },
    "rewards": {
      "xp": 245,
      "skillBadges": [
        "Portfolio Building"
      ],
      "portfolioArtifacts": [
        "Evidence-backed Web3 portfolio"
      ]
    },
    "storyFlags": [
      "m15_complete",
      "portfolio_evidence_compiled"
    ],
    "nextMissionId": "m16",
    "ending": "The hiring lead can now inspect the case files and understand your contribution without taking your word for it. You are invited to complete a small paid-work screening task.",
    "cliffhanger": "The screening task comes with an unusual condition: pay an upfront 'activation fee' before the recruiter reveals the work. J.Jonathan and Essa ask you to investigate the offer.",
    "sceneLines": [
      "The hiring lead doesn't need another list of titles. They need to see what you made, what you did and what changed.",
      "Your sample is strong, but this claim has no evidence attached. Add the notes or narrow the wording."
    ]
  },
  {
    "id": "m16",
    "chapterId": "ch08",
    "title": "The Job That Costs Money",
    "state": "Plateau",
    "location": "Plateau hiring foyer, interview bench and application terminal",
    "npcIds": [
      "j-jonathan",
      "essa"
    ],
    "npcs": [
      "J.Jonathan",
      "Essa"
    ],
    "narrativePurpose": "The recruiter offers a Web3 role but demands an activation fee and private wallet details before showing the job description. Follow the offer from the hiring foyer to the interview bench, verify the company and submit a professional response without giving away money or secrets.",
    "learningObjectives": [
      "How to verify a job opportunity",
      "How to read role requirements and plan a skill gap",
      "How to submit a focused application using work samples"
    ],
    "prerequisites": [
      "m15"
    ],
    "objectives": [
      {
        "id": "m16-obj-1",
        "label": "Review the role and verify the hiring source",
        "interactionTarget": "story:m16:objective:1",
        "required": true
      },
      {
        "id": "m16-obj-2",
        "label": "Map required skills against your portfolio",
        "interactionTarget": "story:m16:objective:2",
        "required": true
      },
      {
        "id": "m16-obj-3",
        "label": "Complete a relevant work sample",
        "interactionTarget": "story:m16:objective:3",
        "required": true
      },
      {
        "id": "m16-obj-4",
        "label": "Submit an application and respond to the fee demand",
        "interactionTarget": "story:m16:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The recruiter and role are independently checked",
      "The player submits a relevant work sample",
      "No upfront payment or wallet secret is shared"
    ],
    "failureAndRetry": {
      "onFailure": "If the player pays or shares secrets in the choice, Essa stops the action before it is committed and asks for an independent verification step.",
      "retry": "Retry the decision; keep the role research and sample."
    },
    "rewards": {
      "xp": 255,
      "skillBadges": [
        "Opportunity Screening"
      ],
      "portfolioArtifacts": [
        "Verified job-application pack"
      ]
    },
    "storyFlags": [
      "m16_complete",
      "job_offer_screened"
    ],
    "nextMissionId": "m17",
    "ending": "The fee demand fails the verification check. You submit the work sample through the company's official channel and report the suspicious contact without making public accusations you cannot prove.",
    "cliffhanger": "The role's product team needs help with a real user problem in Kano. White Coach and Abdul are testing a service that could help small traders reconcile payments.",
    "sceneLines": [
      "The recruiter keeps pushing the fee and avoiding the company email. Let's verify the role without handing over money or private details.",
      "A real application can be assessed through your work. An upfront payment doesn't prove you deserve the job."
    ]
  },
  {
    "id": "m17",
    "chapterId": "ch09",
    "title": "The Trader's Missing Record",
    "state": "Kano",
    "location": "Kano market stall, transport depot and product workshop",
    "npcIds": [
      "white-coach",
      "abdul"
    ],
    "npcs": [
      "White Coach",
      "Abdul"
    ],
    "narrativePurpose": "A small trader's sales records do not match the payments shown on a phone. Walk between the stall, transport depot and workshop to understand the daily workflow before choosing what the product should solve. The trader does not need another dashboard; they need a dependable way to reconcile orders and payments.",
    "learningObjectives": [
      "How to define a product problem from a real workflow",
      "How to map user journeys and friction",
      "How to prioritize a testable fix"
    ],
    "prerequisites": [
      "m16"
    ],
    "objectives": [
      {
        "id": "m17-obj-1",
        "label": "Define target users through a market interview",
        "interactionTarget": "story:m17:objective:1",
        "required": true
      },
      {
        "id": "m17-obj-2",
        "label": "Map the trader's journey from order to collection",
        "interactionTarget": "story:m17:objective:2",
        "required": true
      },
      {
        "id": "m17-obj-3",
        "label": "Find the main friction and prioritize one fix",
        "interactionTarget": "story:m17:objective:3",
        "required": true
      },
      {
        "id": "m17-obj-4",
        "label": "Test the revised flow with the trader",
        "interactionTarget": "story:m17:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player's map captures the trader's actual workflow",
      "The proposed prototype addresses the identified hand-off",
      "A trader completes the revised flow and gives feedback"
    ],
    "failureAndRetry": {
      "onFailure": "If the player jumps straight to a feature list, White Coach sends them back to the stall to observe the workflow.",
      "retry": "Repeat the user test with the same sample transaction."
    },
    "rewards": {
      "xp": 265,
      "skillBadges": [
        "User-Centred Product Design"
      ],
      "portfolioArtifacts": [
        "Trader payment-reconciliation prototype brief"
      ]
    },
    "storyFlags": [
      "m17_complete",
      "trader_problem_validated"
    ],
    "nextMissionId": "m18",
    "ending": "The trader can reconcile the sample sale without switching between three screens. Abdul records the remaining edge cases instead of claiming the product is finished.",
    "cliffhanger": "David sees the test and offers to help the team grow it. Kanyin warns that the last campaign brought thousands of clicks and almost no completed tasks.",
    "sceneLines": [
      "The trader records the order in one place and the payment in another. The gap between those records is the real problem.",
      "Let's test the simplest reconciliation flow with an actual sale before we promise it solves every case."
    ]
  },
  {
    "id": "m18",
    "chapterId": "ch09",
    "title": "Clicks Don't Pay the Bills",
    "state": "Kano",
    "location": "Kano campaign board, market entrance and analytics desk",
    "npcIds": [
      "david",
      "kanyin"
    ],
    "npcs": [
      "David",
      "Kanyin"
    ],
    "narrativePurpose": "A campaign brought traffic but barely any traders finished onboarding. Follow the numbers from the campaign board to the market entrance, where you can speak with people who clicked but left. Design a small experiment that tests one explanation rather than buying more reach.",
    "learningObjectives": [
      "How to form a testable growth hypothesis",
      "How to choose meaningful activation metrics",
      "How to interpret results without inflating them"
    ],
    "prerequisites": [
      "m17"
    ],
    "objectives": [
      {
        "id": "m18-obj-1",
        "label": "Form a hypothesis about the onboarding drop-off",
        "interactionTarget": "story:m18:objective:1",
        "required": true
      },
      {
        "id": "m18-obj-2",
        "label": "Prepare a campaign brief for a focused experiment",
        "interactionTarget": "story:m18:objective:2",
        "required": true
      },
      {
        "id": "m18-obj-3",
        "label": "Choose success metrics for the experiment",
        "interactionTarget": "story:m18:objective:3",
        "required": true
      },
      {
        "id": "m18-obj-4",
        "label": "Interpret results and reject suspicious growth offers",
        "interactionTarget": "story:m18:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The hypothesis predicts a measurable behaviour",
      "The campaign has a defined audience and success metric",
      "The team evaluates completed tasks rather than vanity numbers"
    ],
    "failureAndRetry": {
      "onFailure": "If the player selects impressions as the only success metric, Kanyin asks what behaviour would show that the product helped a trader.",
      "retry": "Revise the hypothesis or metric and rerun the experiment plan."
    },
    "rewards": {
      "xp": 275,
      "skillBadges": [
        "Growth Experiments"
      ],
      "portfolioArtifacts": [
        "Product activation experiment brief"
      ]
    },
    "storyFlags": [
      "m18_complete",
      "growth_experiment_defined"
    ],
    "nextMissionId": "m19",
    "ending": "The team pauses the paid-user offer and runs a smaller experiment with real traders. The results show where onboarding needs work instead of hiding the drop-off behind traffic numbers.",
    "cliffhanger": "A founder offers to fund the next stage, but the proposed terms promise fixed returns and skip milestone reporting. In Edo, Mcbond and Alpha.RWA need you to inspect the deal.",
    "sceneLines": [
      "Our last campaign bought attention, not completed work. This time we need one hypothesis and a metric tied to the product.",
      "The seller's user numbers cannot be independently checked. I'd rather have twenty traders finish the task than ten thousand fake joins."
    ]
  },
  {
    "id": "m19",
    "chapterId": "ch10",
    "title": "The Money With Conditions",
    "state": "Edo",
    "location": "Edo co-working lobby, proposal room and project budget desk",
    "npcIds": [
      "mcbond",
      "alpha-rwa"
    ],
    "npcs": [
      "Mcbond",
      "Alpha.RWA"
    ],
    "narrativePurpose": "A founder is ready to accept funding that promises fixed returns but gives the investor no clear reporting obligations. Walk from the lobby to the proposal room, compare the terms and build a budget before recommending whether the team should proceed.",
    "learningObjectives": [
      "How to read funding terms and milestones",
      "How to identify conflicts of interest",
      "How to connect budgets with accountable delivery"
    ],
    "prerequisites": [
      "m18"
    ],
    "objectives": [
      {
        "id": "m19-obj-1",
        "label": "Compare funding proposals by their milestones",
        "interactionTarget": "story:m19:objective:1",
        "required": true
      },
      {
        "id": "m19-obj-2",
        "label": "Review the project budget against the delivery plan",
        "interactionTarget": "story:m19:objective:2",
        "required": true
      },
      {
        "id": "m19-obj-3",
        "label": "Allocate and vest the proposed token share",
        "interactionTarget": "story:m19:objective:3",
        "required": true
      },
      {
        "id": "m19-obj-4",
        "label": "Flag conflicts and recommend a responsible option",
        "interactionTarget": "story:m19:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player identifies unsupported return promises",
      "The budget ties costs to milestones",
      "Conflicts are disclosed and the recommendation explains trade-offs"
    ],
    "failureAndRetry": {
      "onFailure": "If the player recommends a deal based only on the headline amount, Mcbond asks them to compare the obligations and risks.",
      "retry": "Revisit the proposal and resubmit a reasoned recommendation."
    },
    "rewards": {
      "xp": 285,
      "skillBadges": [
        "Funding Literacy"
      ],
      "portfolioArtifacts": [
        "Funding-term comparison and budget"
      ]
    },
    "storyFlags": [
      "m19_complete",
      "funding_terms_reviewed"
    ],
    "nextMissionId": "m20",
    "ending": "The team asks for written milestones, reporting duties and clear risk disclosures before considering the offer. The founder is disappointed by the delay but no longer has to guess what the deal requires.",
    "cliffhanger": "Alpha.RWA takes you to a project claiming its token represents a warehouse full of goods. BigWealth and Blessing say the photos look convincing, but the ownership file is missing.",
    "sceneLines": [
      "The headline amount looks attractive, but the reporting terms are missing. We need to know what happens after the money arrives.",
      "I want every cost tied to a milestone. If someone benefits from the decision, disclose it before the vote."
    ]
  },
  {
    "id": "m20",
    "chapterId": "ch10",
    "title": "The Warehouse Behind the Token",
    "state": "Edo",
    "location": "Edo warehouse gate, records office and inspection bay",
    "npcIds": [
      "bigwealth",
      "blessing"
    ],
    "npcs": [
      "BigWealth",
      "Blessing"
    ],
    "narrativePurpose": "A token is being marketed as a claim on a warehouse inventory, but the supporting ownership file is incomplete. Visit the warehouse gate, compare the records office documents and inspect the goods before deciding what the token actually entitles its holder to.",
    "learningObjectives": [
      "Why a token does not automatically prove legal ownership",
      "How to inspect custody and redemption terms",
      "How to distinguish an asset's existence from rights to that asset"
    ],
    "prerequisites": [
      "m19"
    ],
    "objectives": [
      {
        "id": "m20-obj-1",
        "label": "Inspect the missing ownership evidence",
        "interactionTarget": "story:m20:objective:1",
        "required": true
      },
      {
        "id": "m20-obj-2",
        "label": "Test the asset claim against independent records",
        "interactionTarget": "story:m20:objective:2",
        "required": true
      },
      {
        "id": "m20-obj-3",
        "label": "Review custody and redemption terms",
        "interactionTarget": "story:m20:objective:3",
        "required": true
      },
      {
        "id": "m20-obj-4",
        "label": "Write questions required before launch",
        "interactionTarget": "story:m20:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player distinguishes a real warehouse from proof of title",
      "Missing inventory and legal documents are recorded",
      "Launch is held until the rights and redemption terms are verified"
    ],
    "failureAndRetry": {
      "onFailure": "If the player treats the token or photos as proof, Blessing asks for the underlying record and the rights it establishes.",
      "retry": "Repeat the ownership check using the documents already collected."
    },
    "rewards": {
      "xp": 295,
      "skillBadges": [
        "Real-World Asset Due Diligence"
      ],
      "portfolioArtifacts": [
        "Asset-claim due-diligence report"
      ]
    },
    "storyFlags": [
      "m20_complete",
      "asset_claim_verification_required"
    ],
    "nextMissionId": "m21",
    "ending": "The warehouse exists, but the evidence does not yet support the advertised ownership claim. BigWealth pauses the promotion until the issuer can prove the rights and explain redemption.",
    "cliffhanger": "The missing file includes a machine-generated summary that confidently names a different owner. In Cross River, Odion and Princess are testing an AI tool that helped create it.",
    "sceneLines": [
      "The warehouse is real; the rights behind this token are still unproven. Those are two different questions.",
      "I cannot show you a signed inventory record yet. We should pause the claim instead of asking buyers to trust the photos."
    ]
  },
  {
    "id": "m21",
    "chapterId": "ch11",
    "title": "The Confident Machine",
    "state": "Cross River",
    "location": "Cross River records room, AI workstation and field office",
    "npcIds": [
      "odion",
      "princess"
    ],
    "npcs": [
      "Odion",
      "Princess"
    ],
    "narrativePurpose": "An AI-generated summary confidently identifies the wrong owner of the warehouse. Move from the records room to the AI workstation and back to the field office to trace the source, correct the workflow and make sure a human verifies claims that can affect someone's rights.",
    "learningObjectives": [
      "Why AI outputs need verification",
      "How to improve instructions and test changed workflows",
      "How to preserve sources and human accountability"
    ],
    "prerequisites": [
      "m20"
    ],
    "objectives": [
      {
        "id": "m21-obj-1",
        "label": "Find false assumptions in the AI-generated report",
        "interactionTarget": "story:m21:objective:1",
        "required": true
      },
      {
        "id": "m21-obj-2",
        "label": "Improve instructions for the AI workflow",
        "interactionTarget": "story:m21:objective:2",
        "required": true
      },
      {
        "id": "m21-obj-3",
        "label": "Retest output against the source documents",
        "interactionTarget": "story:m21:objective:3",
        "required": true
      },
      {
        "id": "m21-obj-4",
        "label": "Verify the corrected ownership claim before sharing",
        "interactionTarget": "story:m21:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The unsupported ownership claim is traced to its source",
      "The workflow marks missing evidence instead of inventing details",
      "The corrected report is reviewed against original records"
    ],
    "failureAndRetry": {
      "onFailure": "If the player asks the model to confirm its own claim, Odion returns the source file and asks for independent verification.",
      "retry": "Repeat the source check and rerun the revised workflow."
    },
    "rewards": {
      "xp": 305,
      "skillBadges": [
        "AI Verification"
      ],
      "portfolioArtifacts": [
        "AI-output verification protocol"
      ]
    },
    "storyFlags": [
      "m21_complete",
      "ai_claim_source_checked"
    ],
    "nextMissionId": "m22",
    "ending": "The corrected report marks the ownership field as unresolved rather than inventing a new owner. Princess adds a human review gate for any output that could affect legal or financial decisions.",
    "cliffhanger": "The records were sent across two blockchain networks, and one copy appears to be missing. Racheal and Seun are tracing the transfer route before anyone retries it.",
    "sceneLines": [
      "The summary invented certainty where the source file had a blank. We need the workflow to show its work or admit it doesn't know.",
      "The revised prompt helps, but the output still needs a human checking the original records before it is shared."
    ]
  },
  {
    "id": "m22",
    "chapterId": "ch11",
    "title": "The Transfer Across the Water",
    "state": "Cross River",
    "location": "Cross River network kiosk, bridge operations room and receiving desk",
    "npcIds": [
      "racheal",
      "seun"
    ],
    "npcs": [
      "Racheal",
      "Seun"
    ],
    "narrativePurpose": "A record was sent between two networks and the receiving side has not updated. Follow the transfer from the network kiosk to the bridge operations room and then the receiving desk. Check the route, asset support and final status before anyone sends the funds a second time.",
    "learningObjectives": [
      "How networks differ",
      "What bridges do and why they introduce risk",
      "How to verify a transfer before retrying it"
    ],
    "prerequisites": [
      "m21"
    ],
    "objectives": [
      {
        "id": "m22-obj-1",
        "label": "Compare blockchain networks for the transfer",
        "interactionTarget": "story:m22:objective:1",
        "required": true
      },
      {
        "id": "m22-obj-2",
        "label": "Inspect the bridge role and transfer status",
        "interactionTarget": "story:m22:objective:2",
        "required": true
      },
      {
        "id": "m22-obj-3",
        "label": "Identify a fake bridge interface",
        "interactionTarget": "story:m22:objective:3",
        "required": true
      },
      {
        "id": "m22-obj-4",
        "label": "Explain bridge risks and fees to the sender",
        "interactionTarget": "story:m22:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player traces the source transaction and destination status",
      "The fake interface is rejected",
      "The sender receives a clear update and does not duplicate the transfer"
    ],
    "failureAndRetry": {
      "onFailure": "If the player retries blindly, Seun shows the confirmed source record and asks them to check the bridge's state first.",
      "retry": "Repeat the status trace without sending a duplicate transaction."
    },
    "rewards": {
      "xp": 315,
      "skillBadges": [
        "Cross-Network Safety"
      ],
      "portfolioArtifacts": [
        "Cross-network transfer trace"
      ]
    },
    "storyFlags": [
      "m22_complete",
      "bridge_status_verified"
    ],
    "nextMissionId": "m23",
    "ending": "The receiving network is delayed, not missing. The sender waits for the official status update instead of creating a second transfer, and the fake recovery page is reported.",
    "cliffhanger": "The transfer's project treasury now wants community approval for a new route. In Bauchi, Dorcas and Joe say the proposal is already being shared before its costs have been explained.",
    "sceneLines": [
      "The source transaction is confirmed. That doesn't mean the destination side has finished processing it.",
      "Don't send it twice. Let's check the official bridge status and receiving record before we touch anything else."
    ]
  },
  {
    "id": "m23",
    "chapterId": "ch12",
    "title": "The Vote Before the Facts",
    "state": "Bauchi",
    "location": "Bauchi meeting hall, public proposal board and treasury desk",
    "npcIds": [
      "dorcas",
      "joe"
    ],
    "npcs": [
      "Dorcas",
      "Joe"
    ],
    "narrativePurpose": "A community vote is scheduled for a proposal to fund a new cross-network route. Walk from the meeting hall to the proposal board and treasury desk. Supporters are counting votes, but the budget, beneficiaries and risks have not been explained clearly.",
    "learningObjectives": [
      "How to read a governance proposal",
      "How to inspect treasury spending and conflicts",
      "How to communicate trade-offs after a vote"
    ],
    "prerequisites": [
      "m22"
    ],
    "objectives": [
      {
        "id": "m23-obj-1",
        "label": "Read proposals and compare their trade-offs",
        "interactionTarget": "story:m23:objective:1",
        "required": true
      },
      {
        "id": "m23-obj-2",
        "label": "Inspect the treasury and milestone plan",
        "interactionTarget": "story:m23:objective:2",
        "required": true
      },
      {
        "id": "m23-obj-3",
        "label": "Cast a governance vote based on the evidence",
        "interactionTarget": "story:m23:objective:3",
        "required": true
      },
      {
        "id": "m23-obj-4",
        "label": "Explain the outcome and participation limits",
        "interactionTarget": "story:m23:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The proposal's cost and beneficiaries are understood",
      "The player makes a reasoned decision rather than following popularity",
      "The outcome summary records the result and unresolved risks"
    ],
    "failureAndRetry": {
      "onFailure": "If the player votes without reading the proposal, Dorcas asks them to review the budget and identify who benefits.",
      "retry": "Reopen the proposal and revise the decision before the result is finalised."
    },
    "rewards": {
      "xp": 325,
      "skillBadges": [
        "Governance Literacy"
      ],
      "portfolioArtifacts": [
        "Governance decision record"
      ]
    },
    "storyFlags": [
      "m23_complete",
      "governance_vote_documented"
    ],
    "nextMissionId": "m24",
    "ending": "The vote is delayed until the treasury costs and delivery owner are published. Some members are annoyed, but the group now knows exactly what information is missing.",
    "cliffhanger": "During the review, Mike finds a critical permission in the route contract that nobody listed in the proposal. The audit was scheduled for next week; the launch is tomorrow.",
    "sceneLines": [
      "The proposal asks for treasury money but doesn't name who owns delivery. The vote can wait until the terms are clear.",
      "I don't mind a difficult vote. I mind asking people to vote without showing them the cost and the trade-offs."
    ]
  },
  {
    "id": "m24",
    "chapterId": "ch12",
    "title": "The Finding in the Footnote",
    "state": "Bauchi",
    "location": "Bauchi code review room, test bench and disclosure office",
    "npcIds": [
      "mike",
      "gbemi"
    ],
    "npcs": [
      "Mike",
      "Gbemi"
    ],
    "narrativePurpose": "A reviewer finds that one privileged contract role can redirect funds, but the launch team wants to hide the finding until after the vote. Move from the code review room to the test bench, reproduce the risk, and prepare a responsible disclosure and patch-verification plan.",
    "learningObjectives": [
      "How to prioritize a security finding",
      "How to disclose a vulnerability responsibly",
      "Why a patch needs independent verification"
    ],
    "prerequisites": [
      "m23"
    ],
    "objectives": [
      {
        "id": "m24-obj-1",
        "label": "Estimate the impact of the privileged permission",
        "interactionTarget": "story:m24:objective:1",
        "required": true
      },
      {
        "id": "m24-obj-2",
        "label": "Prepare a responsible vulnerability disclosure",
        "interactionTarget": "story:m24:objective:2",
        "required": true
      },
      {
        "id": "m24-obj-3",
        "label": "Verify the patch with regression tests",
        "interactionTarget": "story:m24:objective:3",
        "required": true
      },
      {
        "id": "m24-obj-4",
        "label": "Recommend whether launch can proceed",
        "interactionTarget": "story:m24:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player documents the finding and its impact",
      "The patch is tested against the original reproduction",
      "The launch decision reflects the verification status"
    ],
    "failureAndRetry": {
      "onFailure": "If the player hides the finding or accepts an untested patch, Mike reruns the reproduction and reopens the release decision.",
      "retry": "Repeat the patch check while preserving the disclosure report."
    },
    "rewards": {
      "xp": 335,
      "skillBadges": [
        "Security Review"
      ],
      "portfolioArtifacts": [
        "Responsible disclosure and regression report"
      ]
    },
    "storyFlags": [
      "m24_complete",
      "critical_permission_reported"
    ],
    "nextMissionId": "m25",
    "ending": "The launch is held until the constrained permission passes review. The team discloses the risk through the agreed channel and keeps the evidence available for an independent reviewer.",
    "cliffhanger": "A creator who helped explain the finding wants to sell a digital collectible tied to the project. In Abia, Gbemi's colleague FemiY is checking whether the creator really owns the work.",
    "sceneLines": [
      "This permission can redirect funds. The launch team needs the reproduction steps, not a softened summary.",
      "We can disclose this through the agreed channel and verify the patch without publishing a live exploit."
    ]
  },
  {
    "id": "m25",
    "chapterId": "ch13",
    "title": "The Art With Two Owners",
    "state": "Abia",
    "location": "Abia creator studio, print market and licensing desk",
    "npcIds": [
      "femiy"
    ],
    "npcs": [
      "FemiY"
    ],
    "narrativePurpose": "A digital artwork is about to be sold as an exclusive collectible, but the creator cannot show the licence and another artist claims the original. Follow the work from the studio to the print market and licensing desk. The question is not whether the token exists; it is what rights the seller can actually grant.",
    "learningObjectives": [
      "How licences define permitted use",
      "Why token ownership and copyright are different",
      "How creators can explain revenue and resale terms"
    ],
    "prerequisites": [
      "m24"
    ],
    "objectives": [
      {
        "id": "m25-obj-1",
        "label": "Read licence terms before listing the collectible",
        "interactionTarget": "story:m25:objective:1",
        "required": true
      },
      {
        "id": "m25-obj-2",
        "label": "Identify the buyer's rights from the listing",
        "interactionTarget": "story:m25:objective:2",
        "required": true
      },
      {
        "id": "m25-obj-3",
        "label": "Review creator revenue models and resale terms",
        "interactionTarget": "story:m25:objective:3",
        "required": true
      },
      {
        "id": "m25-obj-4",
        "label": "Rewrite unclear ownership terms before launch",
        "interactionTarget": "story:m25:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player distinguishes token possession from copyright",
      "Licence and authorship evidence are checked",
      "The listing is paused until the rights are clear"
    ],
    "failureAndRetry": {
      "onFailure": "If the player treats the mint as proof of authorship, FemiY asks for the original files and licence trail.",
      "retry": "Reopen the rights checklist and submit a corrected listing draft."
    },
    "rewards": {
      "xp": 345,
      "skillBadges": [
        "Creator Rights"
      ],
      "portfolioArtifacts": [
        "Digital collectible rights checklist"
      ]
    },
    "storyFlags": [
      "m25_complete",
      "creator_rights_reviewed"
    ],
    "nextMissionId": "m26",
    "ending": "The listing is paused until both artists' claims are reviewed. FemiY replaces the word 'exclusive' with a precise statement of the rights that can be proven.",
    "cliffhanger": "The disputed listing was built from an open-source component whose licence was copied incorrectly. Softstorm and IamAbdul ask you to trace the contribution before the same mistake reaches another project.",
    "sceneLines": [
      "Owning the token and owning the copyright are not the same thing. We need to read the licence before promising exclusivity.",
      "The creator's claim is disputed. I won't publish the listing until we know what rights can actually be granted."
    ]
  },
  {
    "id": "m26",
    "chapterId": "ch14",
    "title": "Who Wrote This Code?",
    "state": "Niger",
    "location": "Niger workshop, repository terminal and maintainer's bench",
    "npcIds": [
      "softstorm",
      "iamabdul"
    ],
    "npcs": [
      "Softstorm",
      "IamAbdul"
    ],
    "narrativePurpose": "A project copied an open-source component, removed the author's notice and shipped it under a licence that does not match the repository. Travel from the workshop to the repository terminal and then meet the maintainer. Preserve the code history, identify the licence and propose a clean contribution path.",
    "learningObjectives": [
      "How to inspect repository history",
      "How licences and attribution shape reuse",
      "How to make a reviewable contribution"
    ],
    "prerequisites": [
      "m25"
    ],
    "objectives": [
      {
        "id": "m26-obj-1",
        "label": "Explore the repository and its contribution history",
        "interactionTarget": "story:m26:objective:1",
        "required": true
      },
      {
        "id": "m26-obj-2",
        "label": "Read licence terms for the copied component",
        "interactionTarget": "story:m26:objective:2",
        "required": true
      },
      {
        "id": "m26-obj-3",
        "label": "Propose a contribution that fixes attribution",
        "interactionTarget": "story:m26:objective:3",
        "required": true
      },
      {
        "id": "m26-obj-4",
        "label": "Use version control and review before merging",
        "interactionTarget": "story:m26:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The original source and licence are identified",
      "Attribution is restored and the change is reviewable",
      "The maintainer approves only after the licence path is clear"
    ],
    "failureAndRetry": {
      "onFailure": "If the player removes the history or guesses at the licence, IamAbdul asks them to inspect the repository's actual terms.",
      "retry": "Revise the contribution while preserving the source trail."
    },
    "rewards": {
      "xp": 355,
      "skillBadges": [
        "Open-Source Practice"
      ],
      "portfolioArtifacts": [
        "Licence-aware contribution proposal"
      ]
    },
    "storyFlags": [
      "m26_complete",
      "source_attribution_restored"
    ],
    "nextMissionId": "m27",
    "ending": "The project restores attribution and opens a focused change for review. The maintainer contacts the original author rather than pretending the code appeared from nowhere.",
    "cliffhanger": "The author replies with a question: who is accountable when a product combines code, wallets, AI and community promises? Joe_Sef and Larai have been tracking the same cyan mark across the cases.",
    "sceneLines": [
      "The component's history shows where it came from. We should restore that trail instead of pretending the project wrote it.",
      "A clean patch needs the correct licence, attribution and a review that another maintainer can follow."
    ]
  },
  {
    "id": "m27",
    "chapterId": "ch14",
    "title": "The Mark in Every Case",
    "state": "Niger",
    "location": "Niger archive room, roadside notice wall and records desk",
    "npcIds": [
      "joe-sef",
      "larai"
    ],
    "npcs": [
      "Joe_Sef",
      "Larai"
    ],
    "narrativePurpose": "The same small cyan mark appears on the copied address page, the fake recovery interface, the payment prototype and the disputed repository. Follow the mark across saved screenshots and project records. It is not proof of one culprit; it is a lead connecting several tools and teams.",
    "learningObjectives": [
      "How to connect evidence across separate incidents",
      "How to avoid confirmation bias",
      "How to distinguish a recurring symbol from proof of shared ownership"
    ],
    "prerequisites": [
      "m26"
    ],
    "objectives": [
      {
        "id": "m27-obj-1",
        "label": "Review saved evidence from the earlier cases",
        "interactionTarget": "story:m27:objective:1",
        "required": true
      },
      {
        "id": "m27-obj-2",
        "label": "Identify contradictions across the records",
        "interactionTarget": "story:m27:objective:2",
        "required": true
      },
      {
        "id": "m27-obj-3",
        "label": "Connect clues and test competing explanations",
        "interactionTarget": "story:m27:objective:3",
        "required": true
      },
      {
        "id": "m27-obj-4",
        "label": "Present an evidence summary to Joe_Sef and Larai",
        "interactionTarget": "story:m27:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player builds a source-by-source timeline",
      "Contradictory records are retained",
      "The conclusion identifies the mark as a lead, not proof"
    ],
    "failureAndRetry": {
      "onFailure": "If the player names a culprit from the symbol alone, Larai asks which record proves control of the page.",
      "retry": "Revise the timeline without discarding contradictory evidence."
    },
    "rewards": {
      "xp": 365,
      "skillBadges": [
        "Evidence Synthesis"
      ],
      "portfolioArtifacts": [
        "Cross-case evidence timeline"
      ]
    },
    "storyFlags": [
      "m27_complete",
      "cyan_mark_pattern_documented"
    ],
    "nextMissionId": "m28",
    "ending": "The evidence shows a shared visual mark across several tools, but not a proven common operator. Joe_Sef finds a deployment note referencing a public build route that leads north toward Kogi.",
    "cliffhanger": "The route's integration notes are incomplete. Unique and Christol have been asked to test whether the separate tools can hand a user from one step to the next without losing context or safety.",
    "sceneLines": [
      "The mark repeats, but the publishers don't all match. Let's keep both facts in the timeline.",
      "The evidence gives us a lead, not a name. I want a source for every conclusion before we take it to KitCity."
    ]
  },
  {
    "id": "m28",
    "chapterId": "ch15",
    "title": "The Broken Handoff",
    "state": "Kogi",
    "location": "Kogi roadside station, integration workshop and field-test lane",
    "npcIds": [
      "unique",
      "christol"
    ],
    "npcs": [
      "Unique",
      "Christol"
    ],
    "narrativePurpose": "A user completes a verification task in one tool, moves to another and loses the evidence they just collected. Walk the route from the roadside station to the integration workshop and run a full hand-off test. The systems share a mark and design language, but do they share clear rules?",
    "learningObjectives": [
      "How product integrations and interfaces work",
      "How to preserve user context across systems",
      "How to test end-to-end journeys rather than isolated screens"
    ],
    "prerequisites": [
      "m27"
    ],
    "objectives": [
      {
        "id": "m28-obj-1",
        "label": "Map how the connected tools hand off a user",
        "interactionTarget": "story:m28:objective:1",
        "required": true
      },
      {
        "id": "m28-obj-2",
        "label": "Improve documentation for the shared interface",
        "interactionTarget": "story:m28:objective:2",
        "required": true
      },
      {
        "id": "m28-obj-3",
        "label": "Build a safe prototype of the end-to-end journey",
        "interactionTarget": "story:m28:objective:3",
        "required": true
      },
      {
        "id": "m28-obj-4",
        "label": "Test the revised flow and review feedback",
        "interactionTarget": "story:m28:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player maps the current hand-off",
      "The prototype preserves required evidence without leaking secrets",
      "The complete route passes a repeatable test"
    ],
    "failureAndRetry": {
      "onFailure": "If the player approves isolated screen tests as sufficient, Christol reruns the full journey and points to the missing reference.",
      "retry": "Repeat the failed hand-off step and rerun the journey."
    },
    "rewards": {
      "xp": 375,
      "skillBadges": [
        "Integration Thinking"
      ],
      "portfolioArtifacts": [
        "End-to-end integration test report"
      ]
    },
    "storyFlags": [
      "m28_complete",
      "handoff_integrity_verified"
    ],
    "nextMissionId": "m29",
    "ending": "The connected flow now carries forward the evidence needed for the next step without copying private data. The deployment note points to a final destination called KitCity.",
    "cliffhanger": "KitCity is not another ordinary stop. Softstorm is waiting at its gate, and the cyan mark is etched into the entry panel. He says the city will open only when you can explain the journey with evidence.",
    "sceneLines": [
      "Each screen works alone, but the source reference disappears at the hand-off. That's the failure users experience.",
      "Let's run the entire journey from the first record to the final screen. Passing isolated screens is not enough."
    ]
  },
  {
    "id": "m29",
    "chapterId": "final",
    "title": "The Gate That Asks Questions",
    "state": "KitCity",
    "location": "KitCity outer gate, inspection arch and public records wall",
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
    "narrativePurpose": "You reach KitCity and find the recurring cyan mark carved into the gate. Softstorm will not explain it yet. Move between the inspection arch and public records wall, connect the evidence from earlier cases, and show that you can distinguish a strong lead from an unsupported accusation.",
    "learningObjectives": [
      "How to reconstruct an investigation",
      "How to choose a relevant skill for a practical challenge",
      "How to communicate evidence and its limits"
    ],
    "prerequisites": [
      "m28"
    ],
    "objectives": [
      {
        "id": "m29-obj-1",
        "label": "Connect clues from different cities into a timeline",
        "interactionTarget": "story:m29:objective:1",
        "required": true
      },
      {
        "id": "m29-obj-2",
        "label": "Choose relevant skills for the KitCity challenge",
        "interactionTarget": "story:m29:objective:2",
        "required": true
      },
      {
        "id": "m29-obj-3",
        "label": "Coordinate a team to review the case file",
        "interactionTarget": "story:m29:objective:3",
        "required": true
      },
      {
        "id": "m29-obj-4",
        "label": "Submit a reconstruction to the gatekeeper",
        "interactionTarget": "story:m29:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player links earlier clues to their sources",
      "Contradictions and uncertainties remain visible",
      "The reconstruction is accepted for practical assessment"
    ],
    "failureAndRetry": {
      "onFailure": "If the player overstates what the mark proves, White Coach asks them to identify the exact source for that claim.",
      "retry": "Revise the case file and resubmit without losing the collected evidence."
    },
    "rewards": {
      "xp": 390,
      "skillBadges": [
        "Investigation Synthesis"
      ],
      "portfolioArtifacts": [
        "KitCity case reconstruction"
      ]
    },
    "storyFlags": [
      "m29_complete",
      "kitcity_gate_evidence_accepted"
    ],
    "nextMissionId": "m30",
    "ending": "The gate opens after the evidence is checked, not because you guessed the right answer. Craftore says the next test will ask you to do the work, not just explain it.",
    "cliffhanger": "Inside the gate, three teams are waiting with a live problem. Softstorm says you can choose where to start, but every team must be able to review what you deliver.",
    "sceneLines": [
      "The mark on the gate matches the earlier cases, but that alone cannot open it. Show me how you traced it.",
      "I will review your reasoning, including the contradictions. A case file that admits uncertainty is stronger than a confident guess."
    ]
  },
  {
    "id": "m30",
    "chapterId": "final",
    "title": "Build Something That Holds Up",
    "state": "KitCity",
    "location": "KitCity workshop, field-test square and review chamber",
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
    "narrativePurpose": "KitCity's teams have one afternoon to investigate a suspicious payment flow, protect a newcomer and repair a broken hand-off between two tools. Move between the workshop, field-test square and review chamber. Use the evidence, test the fix and leave a record another person can verify.",
    "learningObjectives": [
      "How verification, safety and product testing combine in practice",
      "How to divide work without losing accountability",
      "How to present a tested result"
    ],
    "prerequisites": [
      "m29"
    ],
    "objectives": [
      {
        "id": "m30-obj-1",
        "label": "Review saved evidence from the earlier cases",
        "interactionTarget": "story:m30:objective:1",
        "required": true
      },
      {
        "id": "m30-obj-2",
        "label": "Identify a fake interface and secure the practice wallet",
        "interactionTarget": "story:m30:objective:2",
        "required": true
      },
      {
        "id": "m30-obj-3",
        "label": "Build and test a safe prototype for the broken hand-off",
        "interactionTarget": "story:m30:objective:3",
        "required": true
      },
      {
        "id": "m30-obj-4",
        "label": "Present the result with evidence and limitations",
        "interactionTarget": "story:m30:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The payment evidence is correctly interpreted",
      "The recovery-phrase request is rejected",
      "The hand-off test passes and the result is documented with limits"
    ],
    "failureAndRetry": {
      "onFailure": "If the player skips a safety check or reports an untested fix as complete, the relevant team sends the player back to that stage.",
      "retry": "Retry only the failed stage; previously accepted evidence and completed tests remain saved."
    },
    "rewards": {
      "xp": 410,
      "skillBadges": [
        "Practical Builder"
      ],
      "portfolioArtifacts": [
        "KitCity end-to-end test dossier"
      ]
    },
    "storyFlags": [
      "m30_complete",
      "kitcity_practical_passed"
    ],
    "nextMissionId": "m31",
    "ending": "The three teams sign off on the evidence, the safety response and the repeatable test. The review chamber marks the work complete but leaves one question unanswered: who commissioned the connected tools?",
    "cliffhanger": "The deployment trail is unlocked. Softstorm takes you to the central records room, where the cyan mark finally appears beside a name: T3Kit.",
    "sceneLines": [
      "We have one afternoon. Split the checks, keep the evidence linked and make sure somebody else can repeat the test.",
      "I will not sign off on a screenshot. Show the test steps, the result and the limits we still know about."
    ]
  },
  {
    "id": "m31",
    "chapterId": "final",
    "title": "What the Mark Was For",
    "state": "KitCity",
    "location": "KitCity central records room, signal tower and city square",
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
    "narrativePurpose": "The records reveal that T3Kit commissioned the connected tools as a pathway for people to learn, build, verify and contribute—not as a shortcut to guaranteed money. Visit the records room, trace the signal to the tower and return to the square to decide what the city should build next. The mystery resolves through the evidence you collected and the work you proved.",
    "learningObjectives": [
      "How a connected ecosystem can support many roles beyond trading",
      "How to separate a project's stated purpose from claims that still need proof",
      "How to choose a direction and commit to a practical next step"
    ],
    "prerequisites": [
      "m30"
    ],
    "objectives": [
      {
        "id": "m31-obj-1",
        "label": "Review the deployment records and verify the T3Kit link",
        "interactionTarget": "story:m31:objective:1",
        "required": true
      },
      {
        "id": "m31-obj-2",
        "label": "Map professional roles across the connected tools",
        "interactionTarget": "story:m31:objective:2",
        "required": true
      },
      {
        "id": "m31-obj-3",
        "label": "Choose a specialization and practical next step",
        "interactionTarget": "story:m31:objective:3",
        "required": true
      },
      {
        "id": "m31-obj-4",
        "label": "Present the result and record your future direction",
        "interactionTarget": "story:m31:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player verifies the T3Kit connection using records, not the mark alone",
      "The player recognises multiple Web3 career and contribution paths",
      "The player records a practical next step based on the journey"
    ],
    "failureAndRetry": {
      "onFailure": "If the player claims T3Kit is proven by the symbol alone or expects a guaranteed outcome, Softstorm asks them to revisit the records and state what they can support.",
      "retry": "Review the evidence and update the final direction before submitting."
    },
    "rewards": {
      "xp": 500,
      "skillBadges": [
        "KitCity Practitioner"
      ],
      "portfolioArtifacts": [
        "Personal Web3 contribution roadmap"
      ]
    },
    "storyFlags": [
      "m31_complete",
      "t3kit_signal_resolved",
      "kitcity_journey_complete"
    ],
    "nextMissionId": null,
    "ending": "The signal was never a promise of easy money. T3Kit's trail connects the people, tools and lessons you encountered; the city opens because you can verify, build, communicate and contribute. You leave with a portfolio of work and a direction you chose yourself.",
    "cliffhanger": "The city square fills with new teams looking for people who can do the work. Your next chapter begins outside the mission list—with the skill and evidence you carry forward.",
    "sceneLines": [
      "The deployment record names T3Kit. The cyan mark was the breadcrumb; the signed record is the proof.",
      "The point was never to promise easy money. It was to connect people to useful work they can learn, test and contribute."
    ]
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
