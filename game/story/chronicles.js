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
  "FemiY",
  "Timi"
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
  { id:"ch02", title:"Proof Before Blame", state:"Oyo", missionIds:["m03","m04"] },
  { id:"ch03", title:"Build It Right", state:"Osun", missionIds:["m05","m06"] },
  { id:"ch04", title:"The Cost of Trust", state:"Ekiti", missionIds:["m07","m08"] },
  { id:"ch05", title:"Risk Has Consequences", state:"Delta", missionIds:["m09","m10"] },
  { id:"ch06", title:"People Before Numbers", state:"Anambra", missionIds:["m11","m12"] },
  { id:"ch07", title:"Say What You Can Prove", state:"Enugu", missionIds:["m13","m14"] },
  { id:"ch08", title:"Work Speaks", state:"Plateau", missionIds:["m15","m16"] },
  { id:"ch09", title:"Build for Real People", state:"Kano", missionIds:["m17","m18"] },
  { id:"ch10", title:"What the Money Means", state:"Edo", missionIds:["m19","m20"] },
  { id:"ch11", title:"Trust the Source", state:"Cross River", missionIds:["m21","m22"] },
  { id:"ch12", title:"Accountability Is a Feature", state:"Bauchi", missionIds:["m23","m24"] },
  { id:"ch13", title:"Rights Behind the Token", state:"Abia", missionIds:["m25"] },
  { id:"ch14", title:"Follow the Mark", state:"Niger", missionIds:["m26","m27"] },
  { id:"ch15", title:"The Broken Handoff", state:"Kogi", missionIds:["m28"] },
  { id:"final", title:"The T3Kit Signal", state:"KitCity", missionIds:["m29","m30","m31"] }
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
    "title": "The Link Behind the Payment",
    "state": "Lagos",
    "location": "Lagos Island cybercafé and market records desk",
    "npcIds": [
      "joe-sef",
      "larai"
    ],
    "npcs": [
      "Joe_Sef",
      "Larai"
    ],
    "narrativePurpose": "The wrong-address payment is already confirmed from the previous mission. Now follow the buyer's trail: he copied the payment link from a lookalike page shared in a market chat. Work with Joe_Sef to preserve the page before it disappears, then join Larai to trace how the link spread and document what is known without blaming someone the evidence cannot identify.",
    "learningObjectives": [
      "Preserve a suspicious page, its URL and timestamp before it changes",
      "Spot the difference between a genuine payment link and a lookalike",
      "Trace how a message spread without treating a display name as proof of identity"
    ],
    "prerequisites": [
      "m01"
    ],
    "objectives": [
      {
        "id": "m02-obj-1",
        "label": "Save the copied payment page before it disappears",
        "interactionTarget": "story:m02:objective:1",
        "required": true
      },
      {
        "id": "m02-obj-2",
        "label": "Compare the copied link with Softstorm's real shop page",
        "interactionTarget": "story:m02:objective:2",
        "required": true
      },
      {
        "id": "m02-obj-3",
        "label": "Trace how the altered link reached the buyer",
        "interactionTarget": "story:m02:objective:3",
        "required": true
      },
      {
        "id": "m02-obj-4",
        "label": "Write an incident report that separates facts from guesses",
        "interactionTarget": "story:m02:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player preserves the copied page and its source details before the session clears",
      "The player identifies the lookalike link without relying on the copied logo",
      "The player records the message trail and distinguishes evidence from assumptions"
    ],
    "failureAndRetry": {
      "onFailure": "If the player refreshes the page before preserving it or publicly accuses the sender, Joe_Sef and Larai redirect them to the evidence that is still available.",
      "retry": "Retry the current interaction; keep any page capture and timestamps already saved."
    },
    "rewards": {
      "xp": 115,
      "skillBadges": [
        "Digital Forensics"
      ],
      "portfolioArtifacts": [
        "Lagos lookalike-link incident report"
      ]
    },
    "storyFlags": [
      "m02_complete",
      "payment_recipient_mismatch_confirmed",
      "copied_address_source_preserved"
    ],
    "nextMissionId": "m03",
    "ending": "The copied page used Softstorm's name and logo, but its link was different from the real shop page. The market chat shows when the altered link spread; it does not prove who created it or who controlled the account that forwarded it.",
    "cliffhanger": "As Joe saves the final capture, Larai receives a voice note from Timi, a student in Oyo. The same link is now offering to recover wallets—if people type in twelve secret words. Timi has not submitted them yet.",
    "sceneLines": [
      "Joe_Sef: \"You came from Softstorm? Good. The buyer says he copied the payment link from a market chat, and I found the page still open on this machine. The café clears sessions when people log out. If we want to know what he saw, we save it before it vanishes.\"",
      "Larai: \"I sent the real shop link to the market group this morning. A different one appeared later under a familiar display name. That gives us a trail to follow, not permission to accuse the account owner. Keep the times and the original message intact.\""
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
    "narrativePurpose": "The voice note from Lagos leads you to Timi at an Oyo bus park. A stranger's wallet-recovery page is counting down and demanding twelve secret words. Timi has not submitted them. Stop the rushed decision, find out what the page is really asking for, and help Timi get out safely before the message spreads.",
    "learningObjectives": [
      "Recognise when a recovery offer is trying to take control of a wallet",
      "Verify support through a route you find independently",
      "Help someone respond safely without shaming them or exposing private details"
    ],
    "prerequisites": [
      "m02"
    ],
    "objectives": [
      {
        "id": "m03-obj-1",
        "label": "Stop Timi before the recovery countdown ends",
        "interactionTarget": "story:m03:objective:1",
        "required": true
      },
      {
        "id": "m03-obj-2",
        "label": "Inspect the recovery page and spot the trap",
        "interactionTarget": "story:m03:objective:2",
        "required": true
      },
      {
        "id": "m03-obj-3",
        "label": "Verify the support route without sharing wallet secrets",
        "interactionTarget": "story:m03:objective:3",
        "required": true
      },
      {
        "id": "m03-obj-4",
        "label": "Report the fake page and get Timi out safely",
        "interactionTarget": "story:m03:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "Timi closes the recovery page without entering or sending secret words",
      "The player identifies the recovery phrase request and checks support independently",
      "The suspicious page is reported without exposing Timi's private messages or claiming the wallet was drained"
    ],
    "failureAndRetry": {
      "onFailure": "If the player urges Timi to submit the words or trusts the contact embedded in the page, Unique interrupts before the secret is sent and challenges that choice.",
      "retry": "Retry from the current decision. Timi's recovery phrase is never entered or displayed."
    },
    "rewards": {
      "xp": 125,
      "skillBadges": [
        "Wallet Safety"
      ],
      "portfolioArtifacts": [
        "Oyo recovery-scam response record"
      ]
    },
    "storyFlags": [
      "m03_complete",
      "recovery_scam_identified",
      "timi_phrase_not_shared",
      "fake_recovery_page_reported"
    ],
    "nextMissionId": "m04",
    "ending": "Timi closes the page without entering the twelve words. Smrt huntr finds the support route independently, and the fake page is reported. No evidence yet shows that Timi's wallet was accessed.",
    "cliffhanger": "Before you leave, a message hits the student group: a screenshot claims Timi's wallet has already been drained. Timi swears the words were never entered. Goodness and Semi are on their way—and the group chat is already picking a culprit.",
    "sceneLines": [
      "Unique: \"You must be Timi. Oya, show me the screen—wait, don't tap that button. This thing says your wallet will disappear in sixty seconds? Since when does a wallet need a countdown to be recovered?\"",
      "Smrt huntr: \"I checked the address they sent. It's not the support page. Timi, you haven't typed the words, right? Good. Keep it that way. We'll find the real support route ourselves.\""
    ]
  },
  {
    "id": "m04",
    "chapterId": "ch02",
    "title": "The Screenshot That Lied",
    "state": "Oyo",
    "location": "Oyo student courtyard, roadside print kiosk and community hall",
    "npcIds": [
      "goodness",
      "semi"
    ],
    "npcs": [
      "Goodness",
      "Semi"
    ],
    "narrativePurpose": "The student group is turning Timi's screenshot into a public accusation. Goodness wants the rumour stopped; Semi has found the uncropped message and the wallet's public transaction history. Follow the mismatch, find what the screenshot leaves out, and help Timi face the group without exposing private details or accusing an unproven editor.",
    "learningObjectives": [
      "Compare a claim with the original record it refers to",
      "Check transaction details without asking for wallet secrets",
      "Correct a rumour while being honest about what remains unknown"
    ],
    "prerequisites": [
      "m03"
    ],
    "objectives": [
      {
        "id": "m04-obj-1",
        "label": "Stop the group from naming Timi before the claim is checked",
        "interactionTarget": "story:m04:objective:1",
        "required": true
      },
      {
        "id": "m04-obj-2",
        "label": "Compare the viral screenshot with the original message",
        "interactionTarget": "story:m04:objective:2",
        "required": true
      },
      {
        "id": "m04-obj-3",
        "label": "Check the wallet activity against the screenshot's claim",
        "interactionTarget": "story:m04:objective:3",
        "required": true
      },
      {
        "id": "m04-obj-4",
        "label": "Correct the group without exposing Timi or guessing who edited it",
        "interactionTarget": "story:m04:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The original message and screenshot are preserved before anyone alters or deletes them",
      "The screenshot's claim is compared against the relevant wallet activity and source context",
      "The correction states what the records show and leaves the editor's identity unresolved"
    ],
    "failureAndRetry": {
      "onFailure": "If the player repeats the accusation or posts Timi's private details, Goodness stops the post and Semi brings the original evidence back into view.",
      "retry": "Retry the current decision with the source message and wallet activity preserved."
    },
    "rewards": {
      "xp": 135,
      "skillBadges": [
        "Evidence Handling"
      ],
      "portfolioArtifacts": [
        "Oyo screenshot-claim verification note"
      ]
    },
    "storyFlags": [
      "m04_complete",
      "screenshot_claim_checked",
      "original_message_preserved"
    ],
    "nextMissionId": "m05",
    "ending": "The screenshot does not prove that Timi's wallet was drained. The source message and relevant wallet activity contradict the viral claim, but the available evidence still does not identify who altered or circulated the image. Goodness posts a correction and removes Timi's private details.",
    "cliffhanger": "The correction reaches a small team building a payment app for market traders in Osun. Blockqueen is calling the checkout a success; Christol points at the queue of customers who gave up halfway through.",
    "sceneLines": [
      "Goodness: \"Abeg, look at what they've done. They put Timi's name beside 'thief' and now people are forwarding it like they watched the wallet get emptied. Nobody has checked the record. Help me stop this before the whole campus joins in. \"",
      "Semi: \"Wait first. I found the message before it was cropped. The screenshot leaves out the transaction details, and the time on it doesn't line up with the story in the chat. That is a reason to check—not proof of who edited it. Let's open the source and compare properly. \""
    ]
  },
  {
    "id": "m05",
    "chapterId": "ch03",
    "title": "The Broken Application",
    "state": "Osun",
    "location": "Osun market payment stall, product workshop and merchant test counter",
    "npcIds": [
      "blockqueen",
      "christol"
    ],
    "npcs": [
      "Blockqueen",
      "Christol"
    ],
    "narrativePurpose": "At a busy market demo, a merchant's app flashes PAID before the payment is confirmed. Christol wants to ship a flashy loyalty dashboard to rescue the launch; Blockqueen says sellers have stopped trusting the receipt. Follow the actual checkout, compare the app's status with the transaction record, then help the team fix and retest the status flow. The retest exposes a payout destination that does not match the merchant's agreed address.",
    "learningObjectives": [
      "Observe a real user problem before proposing features",
      "Distinguish a submitted request from a confirmed payment",
      "Test a focused product fix against the underlying record"
    ],
    "prerequisites": [
      "m04"
    ],
    "objectives": [
      {
        "id": "m05-obj-1",
        "label": "Find out why the merchant no longer trusts the payment screen",
        "interactionTarget": "story:m05:objective:1",
        "required": true
      },
      {
        "id": "m05-obj-2",
        "label": "Compare the green PAID badge with the transaction status",
        "interactionTarget": "story:m05:objective:2",
        "required": true
      },
      {
        "id": "m05-obj-3",
        "label": "Replace the premature success state with a verified payment state",
        "interactionTarget": "story:m05:objective:3",
        "required": true
      },
      {
        "id": "m05-obj-4",
        "label": "Retest the checkout and inspect the merchant payout destination",
        "interactionTarget": "story:m05:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player identifies that the app shows success before confirmation",
      "The team changes the status flow instead of distracting from it with an unrelated feature",
      "The retest confirms the status behaviour and flags the payout-address mismatch for investigation"
    ],
    "failureAndRetry": {
      "onFailure": "If the player approves the dashboard or trusts the green badge, Blockqueen asks them to compare the screen with the underlying transaction record.",
      "retry": "Return to the checkout record, compare the actual status and continue from the evidence already collected."
    },
    "rewards": {
      "xp": 150,
      "skillBadges": [
        "Product Discovery"
      ],
      "portfolioArtifacts": [
        "Payment-status bug report and verified retest"
      ]
    },
    "storyFlags": [
      "m05_complete",
      "payment_status_flow_verified",
      "payout_destination_mismatch_found"
    ],
    "nextMissionId": "m06",
    "ending": "The app now says pending until the payment is confirmed, and the merchant can see the real outcome instead of a false green badge. But the payout address in the release configuration does not match the address the merchant approved.",
    "cliffhanger": "Blockqueen freezes the rollout. Laloba and BigSam are already at the workshop, checking the contract that decides where the money goes.",
    "sceneLines": [
      "Blockqueen: \"The seller nearly handed over the goods because this screen said PAID. The explorer still said pending. Christol wants to launch a loyalty dashboard, but nobody will care about points if the receipt lies. Help me prove exactly where the status goes wrong.\"",
      "Christol: \"I thought the dashboard would save the launch. I pulled the event log instead: the app marks success as soon as the wallet request returns. We can change that—but look at this payout setting. It isn't the address the merchant signed off on.\""
    ]
  },
  {
    "id": "m06",
    "chapterId": "ch03",
    "title": "Code That Controls Money",
    "state": "Osun",
    "location": "Osun product workshop, contract review terminal and merchant payout test bench",
    "npcIds": [
      "laloba",
      "bigsam"
    ],
    "npcs": [
      "Laloba",
      "BigSam"
    ],
    "narrativePurpose": "The checkout status is fixed, but its payout destination differs from the merchant-approved address. Laloba suspects the release contract gives one administrator quiet control over where every payout lands; BigSam says the team cannot accuse the contract without reproducing the path. Inspect the access role and destination-change function, reproduce the change in a test deployment, then agree on controls that prevent a silent unilateral redirect before release.",
    "learningObjectives": [
      "Trace a privileged contract action to its actual permissions",
      "Reproduce a payout-destination change in a test deployment",
      "Use access controls, transparent events and review gates to reduce payout risk"
    ],
    "prerequisites": [
      "m05"
    ],
    "objectives": [
      {
        "id": "m06-obj-1",
        "label": "Compare the merchant-approved payout address with the release configuration",
        "interactionTarget": "story:m06:objective:1",
        "required": true
      },
      {
        "id": "m06-obj-2",
        "label": "Inspect who can change the payout destination and how the change is recorded",
        "interactionTarget": "story:m06:objective:2",
        "required": true
      },
      {
        "id": "m06-obj-3",
        "label": "Reproduce an administrator redirect in the test deployment",
        "interactionTarget": "story:m06:objective:3",
        "required": true
      },
      {
        "id": "m06-obj-4",
        "label": "Choose and verify controls that block a silent payout redirect",
        "interactionTarget": "story:m06:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The mismatch is documented without claiming theft before evidence supports it",
      "The test demonstrates the privileged destination-change path and its consequences",
      "The team blocks release until destination changes have appropriate authorization, delay or review, and visible records"
    ],
    "failureAndRetry": {
      "onFailure": "If the player treats an administrator label as proof of safety or approves release after reading only the function name, Laloba asks them to reproduce the permission path and inspect the resulting payout.",
      "retry": "Repeat the address comparison or test-deployment trace; keep the evidence and do not touch a live contract."
    },
    "rewards": {
      "xp": 165,
      "skillBadges": [
        "Smart-Contract Review"
      ],
      "portfolioArtifacts": [
        "Payout-control finding and release-gate checklist"
      ]
    },
    "storyFlags": [
      "m06_complete",
      "payout_redirect_path_reproduced",
      "contract_release_held"
    ],
    "nextMissionId": "m07",
    "ending": "The test proves an administrator can change the payout destination without a delay or a clear public change record. The team documents the finding, adds an independently reviewed authorization path and visible change events, and keeps the release blocked until the fix passes regression tests.",
    "cliffhanger": "A trader waiting outside the workshop shows a different kind of mismatch: the swap quote promised one amount, but the completed trade returned less. LunaX and OxNight are checking the route in Ekiti.",
    "sceneLines": [
      "Laloba: \"The merchant-approved address and the release configuration disagree. That is a finding, not yet proof anyone stole anything. Show me which role can change the destination and whether the change leaves a record we can verify.\"",
      "BigSam: \"Don't test this against a live deployment. I've opened the test build. If one admin can redirect a merchant payout with one call and no delay, we'll reproduce it, document the impact and block release until the control is fixed.\""
    ]
  },
  {
    "id": "m07",
    "chapterId": "ch04",
    "title": "The Swap That Changed Its Face",
    "state": "Ekiti",
    "location": "Ekiti night market, swap kiosk and trader's workbench",
    "npcIds": [
      "lunax",
      "oxnight"
    ],
    "npcs": [
      "LunaX",
      "OxNight"
    ],
    "narrativePurpose": "A trader named LunaX swaps tokens to settle a time-sensitive parts order, but the wallet shows a smaller amount of an asset than she expected. The seller is packing up, the quote screenshot is spreading through the market chat, and someone urges her to approve the swap again. OxNight helps trace the exact token contract and execution record, separating a lookalike asset from ordinary quote movement, pool liquidity, fees and price impact. The player must preserve evidence, explain what the transaction actually did and stop a risky retry.",
    "learningObjectives": [
      "Verify a token by its contract address, not its ticker or logo",
      "Compare like-for-like swap routes, liquidity, fees and price impact",
      "Compare the quote, minimum received and final execution record",
      "Inspect the token approval and spender before any retry"
    ],
    "prerequisites": [
      "m06"
    ],
    "objectives": [
      {
        "id": "m07-obj-1",
        "label": "Identify the exact asset LunaX received",
        "interactionTarget": "story:m07:objective:1",
        "required": true
      },
      {
        "id": "m07-obj-2",
        "label": "Compare route liquidity, fees and price impact for the same trade size",
        "interactionTarget": "story:m07:objective:2",
        "required": true
      },
      {
        "id": "m07-obj-3",
        "label": "Check minimum received and the difference between quote and execution",
        "interactionTarget": "story:m07:objective:3",
        "required": true
      },
      {
        "id": "m07-obj-4",
        "label": "Review the token approval before the trader retries",
        "interactionTarget": "story:m07:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The received asset is identified by its exact contract address",
      "Route costs and execution differences are distinguished from a wrong-asset problem",
      "The trader does not retry until the asset and approval are independently verified"
    ],
    "failureAndRetry": {
      "onFailure": "If the player trusts a ticker, treats a quote as a guarantee or approves an unknown spender, OxNight pauses the retry and asks them to compare the original transaction record and approval details.",
      "retry": "Return to the receipt, route panel or approval screen and finish the investigation without submitting another swap."
    },
    "rewards": {
      "xp": 220,
      "skillBadges": [
        "Onchain Trade Verification"
      ],
      "portfolioArtifacts": [
        "Swap incident review"
      ]
    },
    "storyFlags": [
      "m07_complete",
      "swap_asset_verified",
      "unsafe_retry_prevented"
    ],
    "nextMissionId": "m08",
    "ending": "The transaction record shows LunaX received a different contract from the asset she intended to buy. The shallow route and fees also affected the estimate, but they do not explain away the contract mismatch. She cancels the retry, saves the transaction details and checks the spender before making any new approval.",
    "cliffhanger": "At the exchange counter, withdrawals have suddenly been paused. People are shouting that the exchange has lost everyone's money, and a fake support account is promising instant withdrawals. Moon needs help separating confirmed facts from rumours.",
    "sceneLines": [
      "LunaX: \"I needed that swap to settle a parts order before the supplier closed. The quote looked fine, then the wallet showed less than I expected—and this token's name looks right. Someone in the chat says I should just approve it again. I'm not touching anything until we know what I actually received.\"",
      "OxNight: \"Good. A ticker and logo can be copied. We'll compare the contract address first, then check the route and execution record separately. If the asset is wrong, slippage isn't an explanation. And no second approval until we know exactly which spender is asking.\""
    ]
  },
  {
    "id": "m08",
    "chapterId": "ch04",
    "title": "The Withdrawal That Never Left",
    "state": "Ekiti",
    "location": "Exchange service counter, incident desk and public status board",
    "npcIds": [
      "moon",
      "the-cryptonian"
    ],
    "npcs": [
      "Moon",
      "The Cryptonian"
    ],
    "narrativePurpose": "A withdrawal freeze turns a busy exchange counter into a rumour mill. Moon has a customer request marked 'processing' but no transaction hash; a cropped screenshot of the exchange's hot wallet is being passed around as proof that every customer balance is gone. The Cryptonian brings the incident log and public-chain records. Trace the specific request, establish which route is confirmed paused, separate internal customer balances from on-chain wallet movements, and publish an update that says what is known, what is not, and when the next update will arrive. A loud countdown on the status board is about to hit zero—but nobody has verified that it came from the exchange.",
    "learningObjectives": [
      "Trace a withdrawal request from internal status to transaction broadcast",
      "Identify the exact scope of a confirmed service interruption",
      "Explain what public wallet activity can and cannot prove about a custodial exchange",
      "Publish a useful status update without inventing a cause or restoration time"
    ],
    "prerequisites": [
      "m07"
    ],
    "objectives": [
      {
        "id": "m08-obj-1",
        "label": "Trace the waiting withdrawal from request ID to its actual transaction status",
        "interactionTarget": "story:m08:objective:1",
        "required": true
      },
      {
        "id": "m08-obj-2",
        "label": "Confirm which withdrawal route is paused and which routes remain unverified",
        "interactionTarget": "story:m08:objective:2",
        "required": true
      },
      {
        "id": "m08-obj-3",
        "label": "Compare the hot-wallet screenshot with the limits of public-chain evidence",
        "interactionTarget": "story:m08:objective:3",
        "required": true
      },
      {
        "id": "m08-obj-4",
        "label": "Publish an incident update with verified facts and a clear next update time",
        "interactionTarget": "story:m08:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The customer's request is correctly classified as not yet broadcast, rather than falsely described as a failed on-chain transfer",
      "The notice states the confirmed route impact and labels unknowns honestly",
      "The public update avoids unsupported insolvency claims and gives customers a verified update route and next update time"
    ],
    "failureAndRetry": {
      "onFailure": "If the player calls the exchange insolvent from a cropped wallet screenshot or promises a restoration time, Moon asks them to separate the evidence from the conclusion before publishing.",
      "retry": "Recheck the request record, incident notice and chain evidence, then revise the public update."
    },
    "rewards": {
      "xp": 205,
      "skillBadges": [
        "Incident Analysis"
      ],
      "portfolioArtifacts": [
        "Customer withdrawal incident update"
      ]
    },
    "storyFlags": [
      "m08_complete",
      "withdrawal_scope_verified",
      "status_update_published"
    ],
    "nextMissionId": "m09",
    "ending": "The queue is still waiting, but the update now gives customers a verified route to check progress and a time for the next report. The countdown reaches zero. The board flashes a message: 'WITHDRAWALS RESTORED'—but the official status page still says paused.",
    "cliffhanger": "Someone wants the room to celebrate. Moon refuses to announce a recovery until a real withdrawal is confirmed. The next customer at the counter is not asking about an exchange at all; they're trying to recover a trading loss with borrowed leverage.",
    "sceneLines": [
      "Moon: \"This customer has refreshed the page forty times. Their request says processing, but there is no transaction hash. Now a screenshot of our hot wallet is going around with the caption 'everyone's money is gone'. I need to tell the queue what we can prove before that countdown hits zero.\"",
      "The Cryptonian: \"The incident log confirms one withdrawal route is paused. It does not confirm insolvency, and a hot-wallet screenshot cannot show the full internal customer ledger. Let's trace this request, check the official notice and write only what the records support.\""
    ]
  },
  {
    "id": "m09",
    "chapterId": "ch05",
    "title": "The Trade He Rewrote",
    "state": "Delta",
    "location": "Delta roadside café, order-history terminal and chart desk",
    "npcIds": [
      "joseph-nnadi",
      "the-don"
    ],
    "npcs": [
      "Joseph Nnadi",
      "The Don"
    ],
    "narrativePurpose": "A trader's clipped screenshot is spreading through the café with the caption 'the exchange moved my stop'. He wants the group to back him and is already lining up another entry to win back the loss. Joseph Nnadi has the plan the trader wrote before the session; The Don pulls up the original order history. Rebuild the timeline, calculate how the second position changed the risk, and separate what the records prove from what the screenshot merely suggests.",
    "learningObjectives": [
      "Reconstruct a trading dispute from the original plan and order history",
      "Calculate how size and stop distance change exposure",
      "Recognise revenge trading and preserve an honest decision record"
    ],
    "prerequisites": [
      "m08"
    ],
    "objectives": [
      {
        "id": "m09-obj-1",
        "label": "Recover the original setup and compare it with the cropped stop-loss screenshot",
        "interactionTarget": "story:m09:objective:1",
        "required": true
      },
      {
        "id": "m09-obj-2",
        "label": "Rebuild the order timeline and calculate the second trade's actual risk",
        "interactionTarget": "story:m09:objective:2",
        "required": true
      },
      {
        "id": "m09-obj-3",
        "label": "Check whether the proposed recovery entry has a valid setup",
        "interactionTarget": "story:m09:objective:3",
        "required": true
      },
      {
        "id": "m09-obj-4",
        "label": "Write a transparent incident journal without claiming more than the records prove",
        "interactionTarget": "story:m09:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player compares the original plan with the full order record rather than trusting a cropped screenshot",
      "The second trade's planned exposure is correctly shown as three times the original risk",
      "The player rejects a recovery entry without a valid setup and preserves an honest timeline"
    ],
    "failureAndRetry": {
      "onFailure": "If the player accuses the exchange from the cropped image or backs the recovery trade, Joseph asks them to reopen the timestamps and show which record supports that conclusion.",
      "retry": "Return to the original setup, compare both order tickets and correct the journal before closing the case."
    },
    "rewards": {
      "xp": 190,
      "skillBadges": [
        "Trading Forensics"
      ],
      "portfolioArtifacts": [
        "Trade incident reconstruction and risk journal"
      ]
    },
    "storyFlags": [
      "m09_complete",
      "trade_timeline_reconstructed",
      "revenge_entry_declined"
    ],
    "nextMissionId": "m10",
    "ending": "The complete order history shows the first stop matched the written plan. Three minutes later, the trader opened a second position at twice the size and widened the stop, taking planned exposure from $10 to $30. The records don't prove the exchange moved the stop. The trader deletes the accusation, keeps the correction visible and steps away from the recovery entry.",
    "cliffhanger": "Toza leans over the chart and says leverage could have made that $30 risk feel smaller. Before anyone can answer, Praise's margin warning starts flashing on a phone. Craftore asks you to check the liquidation figures before Praise adds another dollar.",
    "sceneLines": [
      "Joseph Nnadi: \"He says the exchange moved his stop. But his own plan is here, written before the session. The screenshot he's sharing cuts off the order time and the stop edit history. Don't defend him or accuse the platform yet—rebuild what happened.\"",
      "The Don: \"Found both order tickets. First position risked ten dollars. Three minutes after it closed, he opened twice the size and gave the new trade a wider stop: thirty dollars of planned exposure. The records show the change; they don't tell us what the exchange intended. Now he's asking for one more entry.\""
    ]
  },
  {
    "id": "m10",
    "chapterId": "ch05",
    "title": "The Money That Wasn't His",
    "state": "Delta",
    "location": "Delta trading lounge, event office and risk desk",
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
    "narrativePurpose": "An urgent margin alert hits while Toza is preparing a payment for a community event venue. His leveraged trade is moving against him, and he wants to top up the position using money already set aside for the venue deposit. Praise refuses to let panic turn shared funds into trading collateral. Craftore brings the original order ticket, current exposure and a conditional liquidation estimate. Reconstruct the real risk, test the options against Toza's written limit and help him make a decision without pretending to know the next candle.",
    "learningObjectives": [
      "Separate position exposure from the margin supporting it",
      "Understand that liquidation estimates depend on position and venue rules",
      "Keep reserved or shared funds outside an improvised trade-rescue plan"
    ],
    "prerequisites": [
      "m09"
    ],
    "objectives": [
      {
        "id": "m10-obj-1",
        "label": "Rebuild Toza's position from the original order ticket",
        "interactionTarget": "story:m10:objective:1",
        "required": true
      },
      {
        "id": "m10-obj-2",
        "label": "Check the liquidation estimate against the risk limit he agreed to",
        "interactionTarget": "story:m10:objective:2",
        "required": true
      },
      {
        "id": "m10-obj-3",
        "label": "Compare adding the venue deposit with reducing or closing the position",
        "interactionTarget": "story:m10:objective:3",
        "required": true
      },
      {
        "id": "m10-obj-4",
        "label": "Record the decision and protect the event funds",
        "interactionTarget": "story:m10:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player calculates exposure separately from posted margin",
      "The liquidation estimate is treated as conditional rather than guaranteed",
      "Funds reserved for the event are not used to rescue the leveraged trade",
      "The decision follows the documented risk limit rather than a prediction"
    ],
    "failureAndRetry": {
      "onFailure": "If the player recommends using the venue deposit as margin, Praise asks who authorised the funds to be risked and Craftore recalculates the position under the original limit.",
      "retry": "Return to the order ticket, compare exposure and margin, then assess the options against the written plan."
    },
    "rewards": {
      "xp": 195,
      "skillBadges": [
        "Leverage and Margin Risk"
      ],
      "portfolioArtifacts": [
        "Position-risk decision record"
      ]
    },
    "storyFlags": [
      "m10_complete",
      "leverage_risk_reviewed",
      "risk_limit_recorded",
      "event_funds_protected"
    ],
    "nextMissionId": "m11",
    "ending": "Toza stops treating the venue deposit as emergency collateral. The position is reduced or closed in line with his documented risk limit, and the decision record separates the amount at risk from the margin posted. Nobody claims the market was certain to reverse; the event deposit remains available for its actual purpose.",
    "cliffhanger": "With the venue deposit safe, Craftore heads to Anambra for the event's Web3 community partner. The project has thousands of followers, but when the doors open, almost nobody knows what to do next. Kodavic and Cybersage need someone to find the point where newcomers disappear.",
    "sceneLines": [
      "Praise: \"That alert came in while the venue manager was asking for the deposit. You said that money was for the event—not your position. Before you touch anything, let's see what the order actually risks.\"",
      "Toza: \"I kept telling myself one bounce would save it. Now I'm staring at the margin warning and thinking of using the venue money to buy more time. I know that's a bad sign. Help me read the ticket before panic makes the decision for me.\"",
      "Craftore: \"I've got the original order, current size, posted margin and the venue's liquidation estimate. The estimate can change with price, fees and exchange rules; it isn't a guaranteed exit. We'll compare the position with the loss limit Toza wrote down before entering.\""
    ]
  },
{
    "id": "m11",
    "chapterId": "ch06",
    "title": "The Room Full of Ghosts",
    "state": "Anambra",
    "location": "Anambra community hall, registration table and demo corner",
    "npcIds": [
      "kodavic",
      "cybersage"
    ],
    "npcs": [
      "Kodavic",
      "Cybersage"
    ],
    "narrativePurpose": "The team posts a triumphant '1,000 members' banner, but the hall booked for its first builder meetup is almost empty. Kodavic wants to announce a prize to pull people in. Cybersage shows you the signup path: six channels, a wall of rules, and a request for newcomers to explain their whole Web3 identity before doing anything. A newcomer called Dera has arrived in person and is ready to leave. Find the exact moment the welcome flow loses her, replace it with one useful first action, and test whether a second newcomer can finish it without needing a wallet connection or a giveaway.",
    "learningObjectives": [
      "Observe what a newcomer actually does before changing the funnel",
      "Remove friction by giving people one clear first action",
      "Measure a completed first contribution instead of sign-ups or attendance"
    ],
    "prerequisites": [
      "m10"
    ],
    "objectives": [
      {
        "id": "m11-obj-1",
        "label": "Catch Dera before she walks out and follow her first attempt",
        "interactionTarget": "story:m11:objective:1",
        "required": true
      },
      {
        "id": "m11-obj-2",
        "label": "Find the exact point where the welcome flow loses Dera",
        "interactionTarget": "story:m11:objective:2",
        "required": true
      },
      {
        "id": "m11-obj-3",
        "label": "Replace the six-channel maze with one useful first action",
        "interactionTarget": "story:m11:objective:3",
        "required": true
      },
      {
        "id": "m11-obj-4",
        "label": "Test the new welcome path with a second newcomer and record completion",
        "interactionTarget": "story:m11:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player observes the actual newcomer journey instead of guessing from follower counts",
      "The welcome flow gives one safe, useful action without requiring a wallet connection or personal details",
      "A second newcomer completes the task and the team records completion rather than sign-ups"
    ],
    "failureAndRetry": {
      "onFailure": "If the player proposes a giveaway or more channels before observing Dera, Cybersage asks them to show where Dera got stuck using the actual signup path.",
      "retry": "Return to the registration table, preserve the observed friction point and test one clear first action."
    },
    "rewards": {
      "xp": 205,
      "skillBadges": [
        "Community Onboarding"
      ],
      "portfolioArtifacts": [
        "Newcomer friction audit and first-task test"
      ]
    },
    "storyFlags": [
      "m11_complete",
      "newcomer_friction_confirmed",
      "first_task_flow_tested",
      "first_contribution_measured"
    ],
    "nextMissionId": "m12",
    "ending": "Dera does not need another giveaway. She needs to know what the community is for and what she can do in the next three minutes. The revised welcome card gives her one choice, one task and a person to ask. A second newcomer completes it too; for the first time, the team has evidence that the welcome path works beyond the signup screen.",
    "cliffhanger": "As Kodavic pins the new welcome card, a newcomer shows Cybersage a private message from an account using a moderator's name. It threatens to restrict their wallet unless they verify through a link. Three people have received the same DM. The meetup's onboarding problem has just become a safety incident.",
    "sceneLines": [
      "Kodavic: \"The dashboard says one thousand members. I booked this hall for a proper builder meetup and look at the empty chairs. I'm about to announce a prize. Give me one good reason not to.\"",
      "Cybersage: \"Because Dera came through the door ready to try, and the signup page asked her to read six channels and introduce her entire Web3 life before she could do one useful thing. She's at the exit now. Watch what she does; don't guess for her.\""
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
    "narrativePurpose": "The incident starts exactly where the previous mission ended: the newcomer who stayed to test the new welcome card shows Cybersage a DM from an account using Reina's name and photo. Three attendees received the same threat that their wallets will be restricted unless they verify immediately; one opened the link. Reina and Cclya lead the player from the hall to the message kiosk to compare the sender against the real moderator roster, preserve and report the evidence without spreading the link, then help the affected member check their wallet safely. The team must protect the member, avoid guessing who runs the fake account, and publish a useful warning before the scheduled safety session in Enugu.",
    "learningObjectives": [
      "Verify a moderator by exact handle and an independently published roster, not by name or profile photo",
      "Contain and report a phishing attempt while preserving private evidence",
      "Give the affected member safe account-check steps without asking for recovery phrases",
      "Publish a factual warning that protects the community without exposing the victim"
    ],
    "prerequisites": [
      "m11"
    ],
    "objectives": [
      {
        "id": "m12-obj-1",
        "label": "Compare the sender's exact handle with the official moderator roster",
        "interactionTarget": "story:m12:objective:1",
        "required": true
      },
      {
        "id": "m12-obj-2",
        "label": "Preserve the original DM privately, report the fake account and contain the link",
        "interactionTarget": "story:m12:objective:2",
        "required": true
      },
      {
        "id": "m12-obj-3",
        "label": "Help the affected newcomer check wallet connections and approvals safely",
        "interactionTarget": "story:m12:objective:3",
        "required": true
      },
      {
        "id": "m12-obj-4",
        "label": "Publish a factual warning without the victim's identity or malicious URL",
        "interactionTarget": "story:m12:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The exact sender handle is confirmed as absent from the independently published moderator roster; the person behind the account is not guessed at",
      "The original message, timestamp and destination are preserved privately, the account is reported, and the malicious URL is not amplified",
      "The affected newcomer receives safe account-check steps without sharing recovery words or private details",
      "The public notice names the fake handle and official verification route without identifying the victim, and the handoff to the Enugu safety session is ready"
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
    "ending": "The fake account is reported, the original DM is preserved privately, and the pinned warning gives members a safe way to verify moderators. The newcomer who helped test the welcome card is no longer being treated as the problem; the team has a documented response and a clear account-safety checklist.",
    "cliffhanger": "The team is due to explain the incident at a safety session in Enugu. Minutes before it starts, the host cancels. Reina forwards the incident summary to Leemah and Kenny, who are at the venue with a room full of questions. The player must carry the verified facts into the next mission—not rumours or promises that wallets are perfectly safe.",
    "sceneLines": [
      "Reina: \"The newcomer who stayed to test the welcome card just showed Cybersage this DM. Same fake moderator name, same threat, and three people received it. One person opened the link. The chat is already asking who got fooled. We need to protect them, not turn them into the story.\"",
      "Cclya: \"The sender's handle is not on our published moderator roster, and the link opens a wallet-connection prompt. That is enough to report the account as an impersonator; it is not proof of who runs it or that funds were taken. Preserve the message privately, help the member check safely, and warn everyone without reposting the link.\""
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
    "narrativePurpose": "You arrive in Enugu carrying Reina and Cclya’s verified report about the fake moderator DM from the last mission. The host cancels minutes before the session, but the room is already full—and one attendee says their friend connected a wallet after receiving a similar message. Leemah needs you to separate confirmed facts from rumours, then Kenny puts you on the live mic. Keep the affected member anonymous, answer hard questions without pretending the incident proves funds were stolen, and leave the audience with a practical response plan.",
    "learningObjectives": [
      "How to turn a live incident report into a clear public safety session",
      "How to moderate a tense room without blaming victims or silencing questions",
      "How to communicate known facts, unknowns and useful next steps"
    ],
    "prerequisites": [
      "m12"
    ],
    "objectives": [
      {
        "id": "m13-obj-1",
        "label": "Review Reina’s incident brief and separate verified facts from unknowns",
        "interactionTarget": "story:m13:objective:1",
        "required": true
      },
      {
        "id": "m13-obj-2",
        "label": "Prepare a short opening and privacy-safe Q&A rules",
        "interactionTarget": "story:m13:objective:2",
        "required": true
      },
      {
        "id": "m13-obj-3",
        "label": "Handle the audience dispute and keep the session useful",
        "interactionTarget": "story:m13:objective:3",
        "required": true
      },
      {
        "id": "m13-obj-4",
        "label": "Answer the wallet-safety question and publish the incident recap",
        "interactionTarget": "story:m13:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The opening accurately states the impersonation facts and what remains unknown",
      "The player moderates disagreement respectfully and protects the affected member’s identity",
      "The recap links to the official reporting route, gives practical checks, and does not claim funds were stolen without evidence"
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
    "ending": "The room leaves with a clear response plan: verify moderator identities through the published roster, do not open links from threatening DMs, preserve evidence privately, and report suspicious accounts. The recap states that one attendee opened a link, but the team has no verified evidence that funds were taken. Kenny shares the practical steps—not the victim’s story—and Reina’s report remains the source of truth.",
    "cliffhanger": "After the session, a founder says the safety recap reached people but their own product announcement gets ignored. Kore and Veedima are waiting down the street; they want you to fix the message without adding claims the product cannot prove.",
    "sceneLines": [
      "Leemah: \"You made it from Anambra with Reina’s report? Good. The host just cancelled, but the room is full. Three people are already arguing about whether the fake moderator stole someone’s funds. We cannot repeat that as fact. Help me put the evidence first, then we go live.\"",
      "Kenny: \"The room needs more than a warning. One person opened the link; we do not have proof that funds were taken. Keep the member anonymous, explain the difference between connecting, signing and approving, and give people a safe reporting route. Then answer the question everyone is avoiding: can a wallet ever be completely safe?\""
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
    "narrativePurpose": "The safety session in Mission 13 ends, but the lesson follows you into the street: people trust clear, useful information more than dramatic claims. Kore and Veedima bring you an announcement for a real product, packed with words like AI-powered, seamless and secure, yet nobody can tell what it actually does. Speak to the intended users, inspect the working flow, remove claims the team cannot prove, and publish a plain-language message with one useful next step. The challenge is to earn attention without borrowing trust the product has not earned.",
    "learningObjectives": [
      "How to find the real audience problem before writing a product announcement",
      "How to explain a live product feature without jargon or inflated promises",
      "How to replace unsupported marketing claims with evidence and a useful next step"
    ],
    "prerequisites": [
      "m13"
    ],
    "objectives": [
      {
        "id": "m14-obj-1",
        "label": "Ask street users what problem they need solved",
        "interactionTarget": "story:m14:objective:1",
        "required": true
      },
      {
        "id": "m14-obj-2",
        "label": "Inspect the working product and sort claims into proven, unclear and unsupported",
        "interactionTarget": "story:m14:objective:2",
        "required": true
      },
      {
        "id": "m14-obj-3",
        "label": "Rewrite the announcement so a first-time user understands it",
        "interactionTarget": "story:m14:objective:3",
        "required": true
      },
      {
        "id": "m14-obj-4",
        "label": "Publish a useful post with a clear next step and no false guarantees",
        "interactionTarget": "story:m14:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The message speaks to a real audience need discovered on the street",
      "Claims are supported by the product flow or removed if they cannot be verified",
      "The final post explains what the product does now, what it does not do, and how an interested user can try or learn more"
    ],
    "failureAndRetry": {
      "onFailure": "If the player keeps a claim like ‘guaranteed profits’ or ‘100% secure’ without evidence, Veedima stops publication and asks for proof or removes it.",
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
    "ending": "Kore and Veedima publish a shorter announcement based on what the product demonstrably does today. It names the intended user, explains the current feature in ordinary language, admits what it does not do, and offers a clear next step. The post earns attention by being useful, not by pretending the product is more mature than it is.",
    "cliffhanger": "A reader replies that the post finally made sense and asks whether you can help with a Web3 role opening. Web3_Esta and Love are waiting with the application brief. They want proof of what you can do—not another impressive bio.",
    "sceneLines": [
      "Kore: \"The safety recap reached people because it answered a real question. Our announcement has been sitting here all morning. It says ‘AI-powered, seamless and secure’—but a new user still asked me, ‘Abeg, what does this thing do?’ Help me fix that without making promises we cannot prove.\"",
      "Veedima: \"I tested the product myself. It surfaces market alerts; it does not place trades or guarantee outcomes. Let’s check every line against the real flow. If we cannot demonstrate a claim, it does not go in the post.\""
    ]
  },
  {
    "id": "m15",
    "chapterId": "ch08",
    "title": "Show the Work",
    "state": "Plateau",
    "location": "Plateau co-working entrance, portfolio wall and skills desk",
    "npcIds": ["web3-esta", "love"],
    "npcs": ["Web3_Esta", "Love"],
    "narrativePurpose": "The reader who replied to your verified product announcement has sent a real Web3 role brief. In Plateau, Web3_Esta and Love help you turn the work you just did—and earlier investigations, safety communication and product tests—into evidence a hiring lead can inspect. The brief asks for proof, not a grand bio. Choose work you can stand behind, explain exactly what you contributed, and name the gap you still need to close before the screening task.",
    "learningObjectives": ["How to match a role to evidence from real work","How to present contribution and context without claiming other people's work","How to identify a specific skill gap and make a credible next-step plan"],
    "prerequisites": ["m14"],
    "objectives": [
      {"id":"m15-obj-1","label":"Read the role brief and choose the strongest matching work","interactionTarget":"story:m15:objective:1","required":true},
      {"id":"m15-obj-2","label":"Build two evidence-backed portfolio samples","interactionTarget":"story:m15:objective:2","required":true},
      {"id":"m15-obj-3","label":"Separate your contribution from the team's work","interactionTarget":"story:m15:objective:3","required":true},
      {"id":"m15-obj-4","label":"Write a focused bio and name one skill gap to work on","interactionTarget":"story:m15:objective:4","required":true}
    ],
    "successConditions": ["The chosen samples directly support the role requirements","At least two samples state the player's contribution and point to inspectable evidence","The bio avoids invented experience and includes a concrete next skill to develop"],
    "failureAndRetry": {"onFailure":"If the player claims ownership of the whole team's result, Love asks them to name their own actions and link each claim to evidence.","retry":"Edit the sample descriptions and bio without losing the evidence already gathered."},
    "rewards": {"xp":245,"skillBadges":["Portfolio Building"],"portfolioArtifacts":["Evidence-backed Web3 portfolio"]},
    "storyFlags": ["m15_complete","portfolio_evidence_compiled"],
    "nextMissionId": "m16",
    "ending": "The hiring lead can now inspect two clear samples, understand what you personally did, and see where you are still learning. The application moves forward—but the screening task arrives with an upfront activation-fee demand.",
    "cliffhanger": "J.Jonathan and Essa want you to verify the recruiter before you respond. The deadline is tonight, and the message is already asking for money and private wallet details.",
    "sceneLines": [
      "Web3_Esta: \"The person who replied to your product post sent this role brief. They don't need another bio full of titles. They need to see what you can do. Read the requirements first; don't force every piece of work to fit.\"",
      "Love: \"This safety recap shows how you handled verified facts. That product announcement shows how you turned a real user need into clear copy. Tell me what you personally did, show the evidence, and be honest about what still needs work.\""
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
    "narrativePurpose": "Mission 15 ends with a recruiter demanding an activation fee and private wallet details before revealing the screening task. J.Jonathan and Essa help you check the sender independently, compare the offer with the company's real careers channel, preserve evidence and keep the application moving without paying or handing over sensitive information. The deadline pressure is part of the test.",
    "learningObjectives": [
      "How to verify a job opportunity independently",
      "How to match a real role to existing work samples",
      "How to report suspicious recruitment without making unsupported public accusations"
    ],
    "prerequisites": [
      "m15"
    ],
    "objectives": [
      {
        "id": "m16-obj-1",
        "label": "Inspect the recruiter message and verify the source independently",
        "interactionTarget": "story:m16:objective:1",
        "required": true
      },
      {
        "id": "m16-obj-2",
        "label": "Compare the role against the official careers channel",
        "interactionTarget": "story:m16:objective:2",
        "required": true
      },
      {
        "id": "m16-obj-3",
        "label": "Prepare a relevant work sample for a verified role",
        "interactionTarget": "story:m16:objective:3",
        "required": true
      },
      {
        "id": "m16-obj-4",
        "label": "Respond safely and report the suspicious contact",
        "interactionTarget": "story:m16:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The recruiter and role are checked through an independently reached official channel",
      "The application uses a relevant, evidence-backed work sample",
      "No money, identity documents or wallet secrets are sent to the unverified contact"
    ],
    "failureAndRetry": {
      "onFailure": "If the player is tempted by the deadline or fee, Essa pauses the response and asks for independent verification before any message is sent.",
      "retry": "Keep the role research and portfolio sample; retry the final response without paying or disclosing sensitive information."
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
    "ending": "The fee demand fails the verification check. You keep the suspicious message as evidence, submit your work sample only through the verified company channel if a matching vacancy exists, and report the contact without making public accusations you cannot prove.",
    "cliffhanger": "J.Jonathan forwards the honest work sample you prepared—not your private details—to White Coach and Abdul in Kano. They are running a community build challenge, but the team has splintered the night before its public demo. They ask if you can help turn scattered effort into one useful thing by morning.",
    "sceneLines": [
      "J.Jonathan: You just built a portfolio you can stand behind. Now someone wants money before they'll even name the job. Don't let a deadline make the decision for you. Check the source without using the links they sent.",
      "Essa: Open the company's careers page independently, compare the exact role and sender, and keep the message. No activation fee, no seed phrase, no private key—and don't send ID to an unverified contact. If there's a genuine vacancy, use its official application route."
    ]
  },
  {
    "id": "m17",
    "chapterId": "ch09",
    "title": "One Night to Build",
    "state": "Kano",
    "location": "Kano neighbourhood build camp, open courtyard and community workspace",
    "npcIds": [
      "white-coach",
      "abdul"
    ],
    "npcs": [
      "White Coach",
      "Abdul"
    ],
    "narrativePurpose": "Mission 16 ends with J.Jonathan forwarding the player's honest work sample to White Coach and Abdul in Kano. They are leading a community build challenge, but by the night before the public demo, teams are duplicating ideas, waiting on one another and abandoning unfinished projects. Help the group stop chasing impressive ideas, identify a real local need, choose a finishable solution and deliver a working first version before morning.",
    "learningObjectives": [
      "Ask intended users about a real problem before choosing what to build",
      "Turn an oversized idea into a small, testable first version",
      "Coordinate a team around clear roles, scope and a deadline"
    ],
    "prerequisites": [
      "m16"
    ],
    "objectives": [
      {
        "id": "m17-obj-1",
        "label": "Find out why the community build challenge is falling apart",
        "interactionTarget": "story:m17:objective:1",
        "required": true
      },
      {
        "id": "m17-obj-2",
        "label": "Ask local people which problem they need solved before choosing the project",
        "interactionTarget": "story:m17:objective:2",
        "required": true
      },
      {
        "id": "m17-obj-3",
        "label": "Cut the scope and assign roles for one finishable prototype",
        "interactionTarget": "story:m17:objective:3",
        "required": true
      },
      {
        "id": "m17-obj-4",
        "label": "Resolve the team's disagreement and deliver a usable first version",
        "interactionTarget": "story:m17:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player hears the competing team concerns before making a decision",
      "The project is chosen from a real local need rather than trend appeal alone",
      "The team agrees on a limited first version, clear roles and a working demonstration"
    ],
    "failureAndRetry": {
      "onFailure": "If the player chooses the flashiest idea without checking the need, lets everyone work separately, or adds features near the deadline, White Coach and Abdul show how the same coordination failure is repeating and let the player reset the scope.",
      "retry": "Keep the user interviews and completed work. Retry the project-scope or team decision without restarting the whole challenge."
    },
    "rewards": {
      "xp": 280,
      "skillBadges": [
        "Product Thinking",
        "Team Coordination"
      ],
      "portfolioArtifacts": [
        "Kano community build-challenge prototype and project brief"
      ]
    },
    "storyFlags": [
      "m17_complete",
      "community_problem_selected",
      "prototype_delivered",
      "team_roles_defined"
    ],
    "nextMissionId": "m18",
    "ending": "The team delivers a rough but usable prototype before the public demo. It is smaller than the ideas people argued for, but a local participant can use it without a long explanation. The group now has something real to improve instead of six unfinished promises.",
    "cliffhanger": "People ask how they can discover the prototype, so David proposes a campaign. Kanyin points out that the last campaign attracted thousands of clicks but few people finished onboarding. Before buying more attention, they want to understand where new users get stuck.",
    "sceneLines": [
      "White Coach: \"You made it from Plateau? J.Jonathan sent the work sample you prepared. I wanted to see how you work, but forget the interview talk for now—this team is about to miss its own demo. Everybody has an idea; nobody has a finished thing.\"",
      "Abdul: \"Three groups are building versions of the same idea, two people have walked out, and the rest are waiting for somebody to decide. We have until morning. Help us pick a real problem and finish something useful—not another presentation full of promises.\""
    ]
  },
  {
    "id": "m18",
    "chapterId": "ch09",
    "title": "Clicks Don't Pay the Bills",
    "state": "Kano",
    "location": "Kano community build camp, market entrance and campaign board",
    "npcIds": [
      "david",
      "kanyin"
    ],
    "npcs": [
      "David",
      "Kanyin"
    ],
    "narrativePurpose": "Mission 17 ends with a usable first version of a local creative directory and people asking how to find it. David wants to push a big launch campaign; Kanyin's previous campaign dashboard shows thousands of clicks but very few completed actions. Find out what people think the prototype offers, identify where their expectations break from reality, and run a small honest experiment before anyone spends more money.",
    "learningObjectives": [
      "Form a testable growth hypothesis from observed user behaviour",
      "Write a focused campaign brief with a truthful promise and one clear action",
      "Measure meaningful activation rather than clicks alone"
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
      "The hypothesis is based on observed user confusion, not guesses alone",
      "The campaign accurately describes the prototype and has one clear action",
      "The team measures completed useful actions, records the limits of a small test and rejects fake engagement"
    ],
    "failureAndRetry": {
      "onFailure": "If the player prioritizes reach, promises features the prototype does not have, or treats clicks as proof of success, Kanyin asks them to return to the observed user journey and define what a real first win looks like.",
      "retry": "Keep the user interview notes. Revise the promise or metric and run the small experiment plan again."
    },
    "rewards": {
      "xp": 275,
      "skillBadges": [
        "Growth Experiments",
        "User Research"
      ],
      "portfolioArtifacts": [
        "Kano prototype activation experiment brief and result note"
      ]
    },
    "storyFlags": [
      "m18_complete",
      "growth_experiment_defined",
      "prototype_expectations_checked"
    ],
    "nextMissionId": "m19",
    "ending": "The team pauses the paid-user offer and runs a small, clearly described test with local traders and creatives. A few people complete the intended first action; others still hesitate. The result is not a viral launch, but the team can now name the next problem to fix without pretending clicks equal adoption.",
    "cliffhanger": "A founder offers to fund the next stage, but the proposed terms promise fixed returns and skip milestone reporting. In Edo, Mcbond and Alpha.RWA need you to inspect the deal before the team signs anything.",
    "sceneLines": [
      "David: \"The prototype is finally real. People are asking for the link, so I want to push it everywhere tonight. If we wait, someone else will own the conversation.\"",
      "Kanyin: \"Last time we paid for attention. Thousands clicked; hardly anyone finished the task. And this prototype is a directory, not a fully vetted booking platform. If our campaign implies more than it does, we buy disappointment.\""
    ]
  },
  {
    "id": "m19",
    "chapterId": "ch10",
    "title": "The Offer on the Table",
    "state": "Edo",
    "location": "Edo co-working lobby, negotiation room and project planning wall",
    "npcIds": [
      "mcbond",
      "alpha-rwa"
    ],
    "npcs": [
      "Mcbond",
      "Alpha.RWA"
    ],
    "narrativePurpose": "After Mission 18's growth test, a founder offers to fund the directory's next stage—but promises fixed returns while leaving reporting, release conditions and responsibility for missed milestones vague. Mcbond is ready to sign because the team is nearly out of runway; Alpha.RWA refuses to let the headline number decide. Help them negotiate the actual obligations, stage the money against verifiable delivery, and leave the room with terms the team can review rather than a rushed signature.",
    "learningObjectives": [
      "Separate a funding headline from the obligations and risks in its terms",
      "Tie staged funding to observable milestones, budgets and reporting",
      "Recognise pressure tactics and seek independent review before signing"
    ],
    "prerequisites": [
      "m18"
    ],
    "objectives": [
      {
        "id": "m19-obj-1",
        "label": "Challenge the fixed-return promise and uncover the missing obligations",
        "interactionTarget": "story:m19:objective:1",
        "required": true
      },
      {
        "id": "m19-obj-2",
        "label": "Build a milestone release plan with proof the team can deliver",
        "interactionTarget": "story:m19:objective:2",
        "required": true
      },
      {
        "id": "m19-obj-3",
        "label": "Negotiate reporting rights, risk disclosures and a pause condition",
        "interactionTarget": "story:m19:objective:3",
        "required": true
      },
      {
        "id": "m19-obj-4",
        "label": "Choose whether to sign, renegotiate or walk away under pressure",
        "interactionTarget": "story:m19:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The player identifies that fixed-return language does not remove uncertainty or explain who bears losses",
      "Any proposed release schedule is tied to observable milestones, a budget and named reporting duties",
      "The team refuses to sign under deadline pressure and records the open questions for independent review"
    ],
    "failureAndRetry": {
      "onFailure": "If the player chooses the offer because its headline amount is largest, Alpha.RWA asks who controls release of funds, what happens if a milestone fails and which claims are actually enforceable.",
      "retry": "Return to the negotiation board and revise the proposed terms before making a final recommendation."
    },
    "rewards": {
      "xp": 300,
      "skillBadges": [
        "Funding Due Diligence"
      ],
      "portfolioArtifacts": [
        "Milestone-based funding term review"
      ]
    },
    "storyFlags": [
      "m19_complete",
      "funding_terms_reviewed",
      "milestone_reporting_required"
    ],
    "nextMissionId": "m20",
    "ending": "The team does not sign in the room. They request a written version with staged releases, measurable deliverables, reporting dates, clear risk allocation and time for independent review. The offer may still be useful, but the headline return is no longer being mistaken for a guarantee.",
    "cliffhanger": "While the revised terms are being prepared, Alpha.RWA shows you another pitch from the same network: a token supposedly represents goods in an Edo warehouse. BigWealth and Blessing have photos, but the ownership file is missing.",
    "sceneLines": [
      "Mcbond: \"David sent the growth numbers. We finally have something people can use, and now there's money on the table. The founder says the return is fixed. If we delay, we might lose the offer—and I can't keep the team running on promises.\"",
      "Alpha.RWA: \"Then don't let the word 'fixed' do the work of a contract. Who reports progress? Who controls each release? What happens if the build misses a milestone? The deck answers none of that. We can negotiate, but nobody signs today just because the room is tense.\""
    ]
  },
  {
    "id": "m20",
    "chapterId": "ch10",
    "title": "The Warehouse Behind the Token",
    "state": "Edo",
    "location": "Edo warehouse gate, loading bay, records desk and dispatch office",
    "npcIds": [
      "bigwealth",
      "blessing"
    ],
    "npcs": [
      "BigWealth",
      "Blessing"
    ],
    "narrativePurpose": "A token promotion claims each token represents stock held in an Edo warehouse. BigWealth brings glossy photos and a sales deck; Blessing, who tracks incoming and outgoing goods, spots a pallet seal number that appears twice. The player must compare the physical stock with the inventory record, trace the paperwork to its issuer, and test what holders can actually claim or redeem. The warehouse is real; that alone does not establish ownership, control of the goods, or enforceable rights for token holders.",
    "learningObjectives": [
      "Distinguish evidence that goods exist from evidence of title or control",
      "Cross-check inventory, seals, dates and source records rather than trusting promotional material",
      "Identify custody, holder rights and redemption terms that must be independently verified"
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
      "The player separates proof that goods exist from proof of who owns or controls them",
      "The duplicate seal and missing signed ownership record are preserved as unresolved discrepancies",
      "The promotion is paused until rights, custody and redemption claims are independently verified"
    ],
    "failureAndRetry": {
      "onFailure": "If the player treats a photo, token contract or unsigned inventory list as proof of ownership, Blessing asks them to identify who created the record, who signed it and which specific right it establishes.",
      "retry": "Return to the dispatch desk, compare the records and revise the due-diligence report without filling evidence gaps with assumptions."
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
    "ending": "The warehouse and some of the goods are real, but the duplicate seal reference and missing signed ownership record leave the advertised claim unverified. BigWealth pauses the promotion and asks the issuer for traceable records, a clear custody arrangement and written holder-redemption rights.",
    "cliffhanger": "The missing file includes an AI-generated summary that confidently names a different owner. In Cross River, Odion and Princess are testing the tool that produced it.",
    "sceneLines": [
      "BigWealth: \"The pitch says one token equals a share of this stock. I have photos from the tour and buyers waiting. But the issuer sent an inventory sheet without the signed ownership file. Can we launch if the goods are right here?\"",
      "Blessing: \"Look at pallet E-17. The seal number on the sheet appears on another dispatch record from last month. I can confirm what is physically here today; I cannot tell you who holds title or what a token holder can legally claim. We need the source records before anyone advertises ownership.\""
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
      "Alpha.RWA: \"The AI report names me as the owner, but that record belongs to another company. Now the team is treating the summary like it came from a lawyer.\"",
      "BigWealth: \"I traced the sentence to an old page with a similar name. The source doesn't support the claim. Flag the uncertainty and make the reviewer open the original record before this goes out.\""
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
      "Blessing: \"My transfer says complete here, but the other wallet hasn't received it. My friend says send it again before the price moves. I'm not paying twice because a screen is slow.\"",
      "Odion: \"The source side is final; the destination message is still pending. Let's follow the bridge record and its message ID. A second transfer would create a second payment, not speed up this one.\""
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
      "Princess: \"They want the treasury vote in ten minutes, but the proposal doesn't say who gets paid or what happens if delivery fails. I'm not voting yes just because the countdown is red.\"",
      "Racheal: \"I put the costs, recipients and milestones in one table. The proposal still leaves maintenance unassigned. We can delay the vote or approve with conditions; either way, record the trade-off.\""
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
      "Seun: \"This admin role can change the payout address. The developer says nobody would ever use it badly. That isn't a security argument—show me what the permission can do.\"",
      "Dorcas: \"The test redirected funds with one privileged call. The patch removes that path, but the test needs to fail on the old version and pass on the new one. Then disclose the impact clearly.\""
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
      "Joe: \"The artist says the collectible is exclusive, but another creator has posted the original file with an earlier timestamp. Buyers are arguing in the comments. We need to separate ownership of the token from rights to the artwork.\"",
      "Mike: \"The sale page grants no clear commercial licence, and the attribution trail points to the earlier upload. Pause the exclusivity claim until the creator and the rights are verified.\""
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
      "Gbemi: \"They copied the library, removed the credit and are now claiming they wrote it from scratch. I don't want a public fight built on a guess. Let's find the source and read the licence.\"",
      "FemiY: \"The commit history matches the original project, and the licence requires attribution. Save the exact files and licence text, then propose a correction that the maintainer can review.\""
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
      "Softstorm: \"That cyan mark showed up on the payment page, the wallet message and this new report. I'm tired of people calling it proof. Show me dates and records, not theories.\"",
      "IamAbdul: \"The same mark connects the cases, but it doesn't prove one person caused them. Put each appearance on the timeline and see which links survive when we check the original sources.\""
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
      "Joe_Sef: \"The user did everything right in the first app, then the evidence vanished when they moved to the second. Both teams say their screen worked. The break is between them.\"",
      "Larai: \"The first tool sent a reference ID the second tool never saved. Replay the whole hand-off and check what arrives at each step. Fixing either screen alone won't restore the missing record.\""
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
      "Softstorm: \"You made it to the gate. I'm not explaining the cyan mark until the case file shows what happened, when it happened and which source backs each claim.\"",
      "White Coach: \"Put the copied address, wallet warning and mark on one timeline. If two details only look alike, label them as a lead—not a conclusion.\"",
      "Craftore: \"I've opened the records wall. Show me which evidence changes the decision at this gate, and leave any gap visible instead of filling it with a guess.\""
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
      "Softstorm: \"Three teams, one afternoon, and no room for hand-waving. Tell me what you are taking responsibility for, then bring back something the others can check.\"",
      "IamAbdul: \"The newcomer has a recovery page open that asks for their phrase. I'm keeping them away from it; check the domain and explain the safe next step in plain language.\"",
      "Joe_Sef: \"The buyer's screenshot says paid, but the shop still has no matching receipt. I'm pulling the transaction record—compare the recipient and network before anyone hands over the device.\"",
      "Larai: \"I found the reference ID at the first tool, but the second one drops it. Follow the same case through both systems and note exactly where the hand-off breaks.\"",
      "Unique: \"I'll run the end-to-end test after you patch it. A green screen on its own isn't a pass; the payment, safety warning and reference all have to survive the journey.\"",
      "Christol: \"The hand-off now keeps the reference, but I want the failed case rerun too. If the old failure still happens, we haven't fixed the route.\"",
      "Craftore: \"Bring me the records, the test result and the limit of what you proved. I'll sign the verified parts—not a promise that every possible case is safe.\""
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
      "Softstorm: \"The signal brought you here, but the mark was never proof by itself. Start with the signed deployment record and show me the exact link it establishes.\"",
      "IamAbdul: \"The record names T3Kit as the commissioning project. That tells us who is behind this connected pathway; it doesn't guarantee anyone a job, profit or shortcut.\"",
      "Joe_Sef: \"I've matched the deployment reference to the earlier case notes. The chain is consistent where the records overlap, and I've marked the pieces we still can't independently confirm.\"",
      "Larai: \"The tools connect learning, building, verification and participation. Map the actual work each one enables, not just the labels printed on the city wall.\"",
      "Unique: \"Choose one skill you want to practise next. Make it concrete enough that another person can review the result, not just hear you say you're interested.\"",
      "Christol: \"I'll record your next step with a deliverable and a check-in point. If the plan depends on an assumption, write that down so you can test it.\"",
      "Craftore: \"The file is complete: source records, work you demonstrated and the direction you chose. The city opens because you can show your work—not because you guessed the mystery.\""
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
