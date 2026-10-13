/**
 * Canonical narrative registry for KitCity's connected story missions.
 * The runtime consumes stable mission IDs, character order and objective data.
 * Only implemented story locations are registered here. New state stops are
 * added when their missions and playable city integrations are ready.
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
    "narrativePurpose": "At a Lagos electronics shop, a buyer says he paid 120 USDC for a laptop, but Softstorm's records show no matching payment. You are new to this world and don't need to know crypto jargon yet: follow the screenshot back to its source, compare the transaction with the shop's address and decide what the evidence actually proves before anyone hands over the laptop.",
    "learningObjectives": [
      "Understand that a screenshot is a claim, not proof that the shop received money",
      "Learn what a transaction record and recipient address tell you",
      "Make a fair decision from the evidence without accusing anyone before the facts are checked"
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
    "ending": "The transaction succeeded, but the recipient address does not belong to the shop. Softstorm keeps the laptop until the correct payment arrives. You solve the dispute by checking the record, not by deciding who seems more convincing.",
    "cliffhanger": "The buyer says he copied the address from an online page that looked like the shop's account. Softstorm sends you to Joe_Sef and Larai to find the source. Your first lesson is simple: before trusting a payment claim, learn where the details came from."
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
      "Preserve a suspicious page, its exact URL and timestamp before it changes",
      "Compare a familiar logo with the actual domain and payment destination",
      "Trace a message without assuming a display name proves who sent it"
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
    "ending": "The copied page borrowed the shop's name and design, but its domain and payment destination differ from the original. You preserve the page and message trail. You know how the buyer was misdirected; you still do not know who created the page.",
    "cliffhanger": "Larai receives a voice note from Oyo. Timi says he followed the same shortened link from the market chat later that day, and it now redirects to a second page offering to 'restore' wallets in exchange for twelve secret words. Timi has not entered them. The redirect connects the leads, but it does not prove who operates either page. You head to Oyo to stop a second possible loss.",
    "sceneLines": [
      "Joe_Sef: \"Softstorm sent you? The buyer says this page gave him the address. The café wipes its sessions when people leave, so we have minutes—not hours. Save the page and its full address before clicking anything else. A screenshot without its source can lose the most useful clue.\"",
      "Larai: \"The real shop link is in my original message. Put the two addresses side by side; don't judge them by the logo. Then follow the timestamps. We can show where the link appeared, but a familiar name on a forwarded message doesn't prove who controlled that account.\""
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
    "sceneCast": [
      "Timi"
    ],
    "narrativePurpose": "The voice note from Lagos leads you to Timi at an Oyo bus park. A stranger's wallet-recovery page is counting down and demanding twelve secret words. Timi has not submitted them. Stop the rushed decision, find out what the page is really asking for, and help Timi get out safely before the message spreads.",
    "learningObjectives": [
      "Explain in plain language why a recovery phrase can give someone control of a wallet",
      "Recognise urgency and secret-word requests as warning signs",
      "Find support independently and help a target without shame or exposure"
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
    "ending": "Timi closes the page without entering the recovery phrase. You locate the support route independently and preserve enough evidence to report the fake service. There is no evidence that Timi's wallet was accessed, so the report does not claim that funds were stolen.",
    "cliffhanger": "A screenshot appears in the student group claiming Timi has already drained the wallet. People are choosing sides before checking the facts. Goodness and Semi need your help to stop the rumour without turning Timi's private life into public evidence.",
    "sceneLines": [
      "Unique: \"Timi, pause your thumb. This page says your wallet will vanish in sixty seconds unless you type twelve words. Those words aren't a password for customer support; they can give someone control of the wallet itself. Close the page first. We can investigate without handing over the keys.\"",
      "Smrt huntr: \"Don't use the contact link on the suspicious page to verify the suspicious page. We'll find the wallet provider's support route independently. Timi, you haven't typed the words, right? Good. Keep them private—even from us. We can report the page using its address and the message that brought you here.\"",
      "Timi: \"I thought the countdown meant I had to act quickly. I haven't entered anything. Please help me get back to my wallet without making me post the words or explain my whole account to strangers.\""
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
    "sceneCast": [
      "Timi"
    ],
    "narrativePurpose": "The student group is turning Timi's screenshot into a public accusation. Goodness wants the rumour stopped; Semi has found the uncropped message and the wallet's public transaction history. Follow the mismatch, find what the screenshot leaves out, and help Timi face the group without exposing private details or accusing an unproven editor.",
    "learningObjectives": [
      "Trace a screenshot claim back to its original message and context",
      "Check relevant public wallet activity without asking for secret information",
      "Correct misinformation without naming an unproven culprit or exposing the person targeted"
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
    "ending": "The source message and relevant wallet activity do not support the claim that Timi's wallet was drained. The group corrects the rumour and removes Timi's private details. The editor's identity remains unknown, and the team says so.",
    "cliffhanger": "Goodness shares the correction with a market-tech team in Osun. Their payment app has the opposite problem: its screen says PAID before the underlying transaction is confirmed. A customer is holding goods while the team argues about what the green badge means.",
    "sceneLines": [
      "Goodness: \"They're calling Timi a thief because an image says the wallet was emptied. Nobody saw that happen; they saw a screenshot. Please stop the group from turning a frightened student's name into a verdict while we check what the image actually shows.\"",
      "Semi: \"I found the message before it was cropped. The screenshot removes the transaction reference and changes the order of the messages. That makes it unreliable, but it doesn't tell us who edited it. Let's compare the original context with the wallet activity, then say only what those sources support.\""
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
      "Observe a user's real problem before adding features",
      "Distinguish a submitted payment request from a confirmed transaction",
      "Test a focused fix against both successful and unsuccessful outcomes"
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
    "ending": "The checkout now distinguishes pending from confirmed and the team retests both outcomes. The merchant can see what has actually happened. The payout destination still differs from the approved address, so the team pauses release rather than pretending the interface fix solved everything.",
    "cliffhanger": "Blockqueen asks Laloba and BigSam to inspect the code that controls the payout. The checkout now reports payment status correctly, but the payout destination still differs from the merchant-approved address. The team must verify who can change it before releasing any stock.",
    "sceneLines": [
      "Blockqueen: \"A seller nearly handed over a box of stock because the screen turned green while the payment was still pending. He doesn't need another dashboard; he needs the receipt to tell the truth. Follow checkout from the first tap and show me the exact moment the app claims more than the record proves.\"",
      "Christol: \"I wanted to save the launch with a loyalty feature. The event log shows the real bug: we mark success when the wallet request returns, not when the payment reaches the required state. Let's fix that and test the failure path too. Then inspect the payout setting—the destination isn't the one the merchant approved.\""
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
      "Understand that a smart contract follows code and permissions rather than good intentions",
      "Trace who can change a critical destination and what evidence that action leaves",
      "Reproduce a risk safely and verify a fix before release"
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
    "ending": "The test shows that one administrator can redirect payouts without a meaningful delay or clear review trail. The team records the finding, adds independent review and visible change records, and holds release until the fix passes. The evidence proves a dangerous capability, not that anyone used it to steal.",
    "cliffhanger": "A trader outside the workshop brings a different mismatch: the token shown in her wallet has the expected name, but the amount received is lower than the quote. LunaX and OxNight are waiting in Ekiti—and someone is urging her to approve the swap again.",
    "sceneLines": [
      "Laloba: \"We have two addresses and a signed approval for only one of them. Don't jump from mismatch to theft. First find the function that can change the destination, then find which role is allowed to call it. The important question is what the system permits—not what its author says they would do.\"",
      "BigSam: \"I've opened the test deployment. Never test a suspected redirect with a merchant's real funds. Reproduce the call, save the result, then require a reviewed change path and a visible event. We release only after the old failure is blocked and the regression test passes.\""
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
      "Identify a token by its contract address rather than its ticker or logo",
      "Compare quotes fairly using the same trade size, route, fees and liquidity",
      "Understand that quoted output is an estimate and inspect approval permissions before retrying"
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
    "ending": "The execution record shows that the received token contract does not match the intended asset. Route costs also affected the amount, but fees and price impact cannot explain away the identity mismatch. LunaX blocks the retry, preserves the record and reviews the spender before taking any further action.",
    "cliffhanger": "At the exchange counter, withdrawals are paused and a cropped hot-wallet screenshot is spreading as proof that everyone has lost their money. A fake support account promises instant access. Moon needs help tracing one real request before the rumour becomes the only story customers hear.",
    "sceneLines": [
      "LunaX: \"I needed this swap to pay the parts supplier before closing. The quote showed one amount; the wallet shows less, and the token name looks familiar. Someone says I should approve it again. I won't press anything until I understand what arrived and what the first transaction actually did.\"",
      "OxNight: \"Start with identity: a ticker and logo can be copied, but the token contract address distinguishes the asset. Then separate three questions: did you receive the intended token, what did the route cost, and how did execution compare with the quote? Finally inspect the spender and allowance. Don't grant more access just to make the warning go away.\""
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
      "Trace a withdrawal from the exchange's request status to a broadcast transaction",
      "Report only the routes and impacts confirmed by incident records",
      "Explain why one public wallet view cannot establish every customer's balance or an exchange's solvency"
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
    "ending": "The update identifies the request status, the route confirmed to be paused, the official source and the next update time. It does not invent a cause or promise a restoration time. When an unsourced board announces that withdrawals are back, Moon waits for a verified test withdrawal.",
    "cliffhanger": "The queue quiets, but a customer at the counter is trying to win back a trading loss before the day ends. He says the exchange moved his stop. Joseph Nnadi and The Don have the original plan and order history.",
    "sceneLines": [
      "Moon: \"This customer has refreshed the page all morning. The request says processing, but there is no transaction hash. Now people are sharing a hot-wallet screenshot and saying everyone's money is gone. I need an update before panic pushes somebody toward the fake support account.\"",
      "The Cryptonian: \"The incident log confirms one route is paused. A missing hash means this request has not been shown to have reached the public chain; it doesn't explain why. A hot wallet is one part of a larger system, not the full customer ledger. Let's link the official notice, state what is still unknown and give a real time for the next update.\""
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
      "Use an original trading plan and full order history to reconstruct an event",
      "Understand that position size and stop distance both affect planned loss",
      "Recognise revenge trading and record uncertainty instead of blaming without evidence"
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
    "ending": "The complete order history explains how the trader changed his own exposure after the first loss. There is not enough evidence to claim the exchange deliberately moved the stop. He records the mistake, declines the revenge entry and reviews the plan before trading again.",
    "cliffhanger": "Toza says leverage can make a large position look affordable because the initial margin is small. Then Praise receives a margin alert and considers using money reserved for a community event. Craftore asks you to separate the position's risk from the money it is borrowing.",
    "sceneLines": [
      "Joseph Nnadi: \"He says the exchange moved his stop, but this is the plan he wrote before the session. His screenshot cuts off the order times. Let's rebuild the sequence before we defend him or accuse the platform. A trade can go wrong without every bad outcome being someone else's fault.\"",
      "The Don: \"The first position had ten dollars of planned risk. Three minutes after it closed, he opened another trade with a larger position and a wider stop, raising planned risk to thirty dollars. That's what the order history shows. It doesn't prove the exchange acted deliberately, and another trade won't erase this loss. Check whether the next setup meets his rules at all.\""
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
      "Distinguish position exposure from the margin posted to open or maintain it",
      "Treat liquidation estimates as conditional rather than guaranteed prices",
      "Protect money committed to another purpose and follow a written risk limit under pressure"
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
    "ending": "Toza separates the venue deposit from trading funds and follows the risk limit he set before the alert. The group records the decision without claiming the market will recover. The lesson is not that one action always wins; it is that a plan should survive a stressful moment.",
    "cliffhanger": "The event goes ahead, but the hall is nearly empty despite the project's huge follower count. Kodavic and Cybersage ask why newcomers arrive online yet leave before taking one useful first step.",
    "sceneLines": [
      "Praise: \"That money is the venue deposit. If we lose it, the whole community event is affected. Toza, I won't let a trading screen quietly turn shared funds into collateral. Let's look at the original plan before you move anything.\"",
      "Toza: \"The margin number looks small, so I thought topping it up would buy time. But I haven't compared the whole position with my limit. Show me the exposure and what the liquidation estimate actually assumes. I need a decision I can defend tomorrow, not a guess about the next candle.\"",
      "Craftore: \"Margin is what supports the position; it is not the same as the amount exposed to market movement. The estimate can change as price, fees and maintenance requirements change. Compare the choices with the written limit, protect the venue money and record the reason for the decision.\""
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
      "Measure the first useful action rather than follower or signup counts alone",
      "Find friction by observing a real newcomer journey",
      "Test a simpler welcome with another person and report the sample honestly"
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
    "ending": "Dera completes one clear first task, and a second newcomer tests the revised welcome. The team records the actual result and sample size instead of announcing that onboarding is fixed for everyone. The meetup begins with people who know what they came to do.",
    "cliffhanger": "As the welcome card goes live, a newcomer receives a direct message from an account using a moderator's name and photo. It threatens to restrict their wallet unless they verify through a link. The community has earned attention; now it must earn trust.",
    "sceneLines": [
      "Kodavic: \"The dashboard says a thousand members. The chairs say something else. Dera came all this way and still can't tell what to do first. I was about to announce a prize, but I want to know why the welcome itself isn't helping.\"",
      "Cybersage: \"Watch without coaching her through every click. She meets six channels, a long rules post and a request to explain her whole Web3 identity before she can try anything. Record where she stops, then give her one low-risk first task and see whether a second newcomer can finish it without a wallet or a giveaway.\""
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
      "Verify a moderator by the exact account handle and an independently found official roster",
      "Contain and report an impersonation attempt without amplifying its link",
      "Guide an affected person through wallet safety without requesting secret phrases or assuming funds were stolen"
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
    "ending": "The impersonating account is reported, the affected member gets a private safety walkthrough and the community receives a factual warning with an official reporting route. The notice does not identify the victim or claim a loss that has not been verified.",
    "cliffhanger": "The safety session in Enugu is due to start, but the host cancels minutes before the doors open. Leemah and Kenny have a room full of people and your verified incident brief. They need someone who can explain the facts without turning uncertainty into a promise.",
    "sceneLines": [
      "Reina: \"The name and photo are mine; the handle isn't. Three newcomers received the same threat. One opened the link, but we don't yet know what they approved. Preserve the message privately and compare the exact handle with the moderator list pinned in our independently verified channel.\"",
      "Cclya: \"Don't repost the dangerous link to warn people. Report the account, remove the link from public view and help the member review recent connections and approvals through the wallet's own controls. Never ask for their recovery phrase. Our warning should tell people what to do, not expose the person who was targeted.\""
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
      "Separate confirmed incident facts from unverified reports",
      "Answer difficult questions without shaming people or promising perfect safety",
      "Turn a technical incident into a practical, privacy-safe response plan"
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
    "ending": "The session ends with a concise recap: verify the exact account and domain, read each wallet prompt, protect recovery words, review approvals and report through official routes. The recap names what was confirmed and what remains unknown, so the audience leaves with steps rather than false certainty.",
    "cliffhanger": "A founder says the safety recap reached people because it was clear, but nobody understands their own product announcement. Kore and Veedima want help explaining what the product actually does—without borrowing trust from buzzwords.",
    "sceneLines": [
      "Leemah: \"We have a room full of people and a report we can stand behind. Three people received the fake message; one opened the link; we haven't confirmed a loss. Start there. No names, no private screenshots, and no pretending the unknown parts are settled.\"",
      "Kenny: \"The mic is yours. Someone will ask whether a wallet connection is always dangerous or always harmless. Explain the action, not just the label: connecting, signing a message, sending a transaction and granting token approval can do different things. Give people a safe way to check, and tell them where verified updates will appear.\""
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
      "Start product messaging from a real user problem",
      "Separate working capabilities from assumptions and unsupported claims",
      "Write a clear explanation that helps a first-time user decide what to do next"
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
    "ending": "The new announcement names the user problem, describes the capability that was actually tested and gives readers one useful next step. The team removes the unsupported guarantees and keeps the evidence behind the claims.",
    "cliffhanger": "One reader asks whether you can help with a Web3 role. Web3_Esta and Love have the brief. They are not looking for a grand bio; they want to see the work behind the explanation you just improved.",
    "sceneLines": [
      "Kore: \"People read our announcement and ask, 'But what does it actually do?' We keep saying seamless and AI-powered as if those words explain the product. Help us find the sentence a real user would understand.\"",
      "Veedima: \"Ask people what they're trying to get done before showing them the pitch. Then try the working product yourself. Mark each claim as demonstrated, unclear or unsupported. We can make the message exciting without promising security, results or features we haven't proved.\""
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
    "narrativePurpose": "The reader who replied to your verified product announcement has sent a real Web3 role brief. In Plateau, Web3_Esta and Love help you turn the work you just did—and earlier investigations, safety communication and product tests—into evidence a hiring lead can inspect. The brief asks for proof, not a grand bio. Choose work you can stand behind, explain exactly what you contributed, and name the gap you still need to close before the screening task.",
    "learningObjectives": [
      "Match evidence to the actual requirements of a role",
      "Distinguish your own contribution from a team's work",
      "Build a portfolio sample with a clear result, source and honest account of limitations"
    ],
    "prerequisites": [
      "m14"
    ],
    "objectives": [
      {
        "id": "m15-obj-1",
        "label": "Read the role brief and choose the strongest matching work",
        "interactionTarget": "story:m15:objective:1",
        "required": true
      },
      {
        "id": "m15-obj-2",
        "label": "Build two evidence-backed portfolio samples",
        "interactionTarget": "story:m15:objective:2",
        "required": true
      },
      {
        "id": "m15-obj-3",
        "label": "Separate your contribution from the team's work",
        "interactionTarget": "story:m15:objective:3",
        "required": true
      },
      {
        "id": "m15-obj-4",
        "label": "Write a focused bio and name one skill gap to work on",
        "interactionTarget": "story:m15:objective:4",
        "required": true
      }
    ],
    "successConditions": [
      "The chosen samples directly support the role requirements",
      "At least two samples state the player's contribution and point to inspectable evidence",
      "The bio avoids invented experience and includes a concrete next skill to develop"
    ],
    "failureAndRetry": {
      "onFailure": "If the player claims ownership of the whole team's result, Love asks them to name their own actions and link each claim to evidence.",
      "retry": "Edit the sample descriptions and bio without losing the evidence already gathered."
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
    "ending": "Your portfolio contains two reviewable samples with clear ownership of the work and a named skill gap. The application is stronger because the evidence is specific, not because the bio sounds impressive.",
    "cliffhanger": "Before you reply, J.Jonathan and Essa notice the recruiter is demanding an activation fee and private wallet details. The opportunity may be real or fake—but the message has not earned your trust yet.",
    "sceneLines": [
      "Web3_Esta: \"This role asks for evidence, not adjectives. Choose one case where you can show the problem, what you personally did and the result someone else can verify. A small honest contribution is stronger than a title you can't support.\"",
      "Love: \"Make two samples readable without needing you in the room to explain them. Link the source, describe your part and say what you would improve next. Then compare the brief with your current skills and name one real gap instead of pretending you already know everything.\""
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
      "Verify a job opportunity through a source found independently of the recruiter message",
      "Recognise upfront fees and requests for wallet secrets as warning signs",
      "Continue a legitimate application using a relevant work sample while protecting private information"
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
    "ending": "The offer cannot be matched to the company's official hiring route, and the upfront fee is refused. You preserve the evidence and keep your portfolio ready for a verified opportunity. The mission rewards judgement, not blind suspicion: the decision follows the checks.",
    "cliffhanger": "J.Jonathan shares your work sample—with your permission and without private details—with White Coach and Abdul in Kano. Their community build challenge is hours from a public demo, but the team has too many ideas and no finished solution.",
    "sceneLines": [
      "J.Jonathan: \"A deadline and a professional logo don't verify a recruiter. Before you pay or send anything sensitive, find the company's careers page yourself and check whether the role and contact match. Don't use only the link the message gave you.\"",
      "Essa: \"Keep your work sample ready, but don't send money or recovery details to unlock a screening task. Save the offer and sender details for a report. If the role can't be verified, you can decline without surrendering your safety or your work.\""
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
      "Discover a real user need before selecting a project",
      "Reduce scope until the team can deliver a testable result",
      "Assign responsibilities and test a working prototype with a real user"
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
    "ending": "The team delivers a small working version of a local creative directory and tests the main task with a person who did not build it. Not every feature is finished, but the group can show what works, what remains and who owns the next step.",
    "cliffhanger": "People ask how to find the prototype. David wants a big launch campaign; Kanyin remembers a past campaign with thousands of clicks and almost no completed tasks. Before spending money, they want to know whether attention turns into real use.",
    "sceneLines": [
      "White Coach: \"Everyone has a big idea; nobody can show a finished thing. We have until morning. Don't pick the project that sounds most impressive—find a problem someone here actually needs solved, then define the smallest useful version.\"",
      "Abdul: \"The team needs one owner for each piece and a shared definition of done. Ask a few local people what they need, choose the problem we can serve tonight, and test the result with someone who wasn't in the build chat. A demo is not the same as a useful product.\""
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
      "Write a testable growth hypothesis linked to a real user need",
      "Measure meaningful completion rather than impressions or raw signups",
      "Interpret a small experiment honestly and identify suspicious growth tactics"
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
    "ending": "The team compares the experiment with its stated success measure and reports the actual result, including the sample's limits. It does not treat clicks as proof of product value or buy unverifiable growth.",
    "cliffhanger": "The results attract a founder offering to fund the next stage—but the pitch promises fixed returns and says little about reporting or missed milestones. Mcbond and Alpha.RWA want you to inspect the deal before anyone signs.",
    "sceneLines": [
      "David: \"I can buy attention by tonight. But if people click and leave, we have paid to learn almost nothing. Tell me what we believe is stopping people from using the directory, and let's test that before we buy a bigger campaign.\"",
      "Kanyin: \"Pick one audience, one message and one action we can actually observe—like a person completing their first listing search. Decide what result would support the hypothesis before the numbers arrive. If someone offers thousands of guaranteed users, ask how those users are real and how completion will be measured.\""
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
      "Distinguish a headline funding promise from enforceable terms and real risk",
      "Tie staged funding to verifiable milestones and named responsibilities",
      "Make and document a decision under pressure without treating promised returns as guaranteed"
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
    "ending": "The team refuses to sign the original vague terms. It requests written risk disclosures, named responsibilities, milestone evidence and a pause condition. The decision preserves the option to negotiate without pretending that funding is automatically good or bad.",
    "cliffhanger": "While the terms are reviewed, the founder points to another opportunity: a token said to represent goods stored in an Edo warehouse. BigWealth has glossy photos; Blessing has noticed that a pallet seal number appears twice.",
    "sceneLines": [
      "Mcbond: \"The runway is short, and this offer could keep the team working. But the founder keeps repeating the return number and skipping the question of what happens if the work isn't delivered. What do we need in writing before we can make a real decision?\"",
      "Alpha.RWA: \"Start with who provides the funds, what the team must deliver, who can approve each release, what reporting the funder receives and what happens if a milestone fails. A promised return is a claim, not proof that the risk has disappeared. We can renegotiate, pause or walk away.\""
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
      "Separate the existence of a physical asset from proof of ownership and control",
      "Check inventory, issuer authority, custody and redemption terms against independent records",
      "Pause claims when important evidence is missing rather than endorsing or accusing without proof"
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
    "ending": "The team confirms that goods are physically present but cannot establish the claimed ownership, custody or holder redemption rights from the available records. The launch is paused and the missing documents are listed. The evidence does not justify either an endorsement or a fraud accusation.",
    "cliffhanger": "The warehouse is real, but the file is not complete. Its token promotion also includes a record of units issued on more than one blockchain network. An AI-generated summary of the due-diligence packet confidently names a different owner, so the team sends the source documents and token-issuance records to Odion and Princess in Cross River. Before anyone moves the asset or repeats the claim, the report must be checked against its sources.",
    "sceneLines": [
      "BigWealth: \"The warehouse photos look convincing, and the sales deck says every token is backed by stock. But a photo proves only that someone photographed goods in a warehouse. We need the ownership record and the issuer's authority before we repeat the claim.\"",
      "Blessing: \"This seal number appears on two pallets in the inventory log. That could be a recording error or something more serious; we need to check the physical stock and the original records. I also can't find signed custody or redemption terms. Until those are verified, nobody should promise buyers what the token gives them.\""
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
    "narrativePurpose": "An AI-generated summary of the warehouse due-diligence packet confidently names the wrong owner and glosses over a token-issuance record that spans two blockchain networks. Move from the records room to the AI workstation and back to the field office to trace the unsupported claim, correct the workflow and produce a human-reviewed evidence packet before the project relies on it.",
    "learningObjectives": [
      "Recognise that a fluent AI answer can contain unsupported or invented claims",
      "Trace important statements to the original source documents",
      "Design a workflow that flags uncertainty and requires human verification before publication"
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
    "ending": "The corrected report links each material claim to its source, flags the ownership question as unresolved and is reviewed by a person before sharing. The team records the AI's error instead of quietly replacing the answer and hiding the failure.",
    "cliffhanger": "The corrected packet leaves one unresolved detail: some of the warehouse-linked tokens were moved from the issuing network to a second network, but the destination record has not updated. Racheal and Seun are tracing that specific transfer. Someone suggests sending it again; first establish whether the original bridge message is pending, failed or complete.",
    "sceneLines": [
      "Odion: \"The summary sounds certain, but it names an owner who doesn't appear in the signed records. It also treats the token list as if every network shows the same final state. Don't ask the model to sound more confident. Trace each claim to the exact source it was supposed to summarise.\"",
      "Princess: \"The report must show its evidence, distinguish missing information from a negative finding and stop when sources conflict. Retest it against the original ownership file and the issuance records. A person must verify claims that affect someone's rights before the report is shared or used to move an asset.\""
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
    "narrativePurpose": "The due-diligence packet from the warehouse-backed token project includes a transfer from its issuing network to a second network, but the receiving record has not updated. Follow that exact transfer from the source-network record to the bridge status desk and receiving network. Check the route, supported asset and final status before anyone repeats the transfer or claims the token arrived.",
    "learningObjectives": [
      "Understand that separate blockchain networks maintain separate transaction records",
      "Trace a cross-network transfer through its source, bridge message and destination status",
      "Recognise bridge, asset-support and fake-interface risks before retrying a transfer"
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
    "ending": "The source transaction and bridge message are found; the destination update is delayed rather than shown as failed. The sender avoids a duplicate transfer and reports the fake bridge interface. The due-diligence packet now records what is confirmed and what remains pending, so the project cannot mistake a source-chain transaction for proof that the destination asset arrived.",
    "cliffhanger": "The project proposes adding another bridge route for the warehouse-backed token. In Bauchi, Dorcas and Joe discover that the community vote is being promoted before costs, beneficiaries, maintenance ownership and a failure plan have been explained. The transfer incident has made those omissions concrete: the community must decide what risk it is being asked to accept.",
    "sceneLines": [
      "Racheal: \"This is the transfer reference from the warehouse project's due-diligence packet. The source transaction is confirmed, but the receiving record hasn't updated. Those are two different facts. Verify the exact networks and asset, then find the bridge's official status route independently. Don't send again just because one screen is behind.\"",
      "Seun: \"A bridge coordinates an asset or message movement between systems; it adds another dependency and another place where delays or failures can occur. Match the source transaction to the bridge message ID and destination status. If the destination is pending, repeating the transfer may create a second movement rather than finish the first.\""
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
      "Read a governance proposal for goals, costs, risks and accountable owners",
      "Compare treasury spending with measurable milestones and delivery responsibilities",
      "Record a vote and its trade-offs without confusing majority support with technical safety"
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
    "ending": "The community delays the vote until the missing cost, maintenance and failure details are published. Members disagree, but they can now point to the unresolved questions instead of mistaking a countdown or a majority for evidence that the route is safe.",
    "cliffhanger": "During the review, Mike finds a privileged permission that could redirect funds—and it was absent from the proposal. The launch is tomorrow. Gbemi asks you to help verify the impact and prepare a responsible disclosure before the team decides whether to proceed.",
    "sceneLines": [
      "Dorcas: \"The countdown says ten minutes, but the proposal doesn't say who receives the funds or who maintains the route next year. People are treating urgency as a reason to vote. Let's make the missing obligations visible before anyone commits the treasury.\"",
      "Joe: \"Here are the requested costs, recipients and milestones. Maintenance still has no named owner, and the failure plan is missing. We can delay the vote or approve only with clear conditions. Whatever the result, record the trade-offs so the community can hold the decision-makers accountable.\""
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
      "Assess a security finding by its real capability and potential impact",
      "Disclose a vulnerability responsibly without needlessly exposing users to exploitation",
      "Verify a patch against the original failure and related regression cases before release"
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
    "ending": "The team receives a reproducible report, patches the redirect path and verifies the fix against the original and related tests. The launch remains paused until the review passes. The finding is disclosed through the agreed route rather than hidden or broadcast without a response plan.",
    "cliffhanger": "While the project prepares a revised launch plan, a creator who helped explain the security finding proposes a commemorative digital collectible for the same community. FemiY finds an earlier version of the artwork credited to another artist. Before the launch team advertises it as exclusive, you must establish what rights the creator can actually grant.",
    "sceneLines": [
      "Mike: \"The developer says nobody would abuse this role. That's not the question. What can the permission do if it is used, and what funds or users could it affect? Reproduce the path in a controlled test and preserve the exact evidence.\"",
      "Gbemi: \"Send the finding through the agreed security contact, with enough detail for the team to reproduce it—not a public exploit recipe. The patch must fail the old test on the old code and pass on the new code, plus the adjacent permission checks. Until an independent review confirms that, the launch stays on hold.\""
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
    "narrativePurpose": "The community project wants to sell a commemorative digital collectible, but the creator cannot show a licence and another artist claims the original artwork. The collectible's minting page also bundles a code component whose licence notice may be wrong. Follow both the artwork and the page from the studio to the licensing desk: a token record does not settle copyright, and an attractive interface does not excuse missing software attribution.",
    "learningObjectives": [
      "Distinguish owning a token from owning copyright or commercial-use rights",
      "Read licence terms and attribution evidence before making an exclusivity claim",
      "Explain buyer rights, creator revenue and resale terms in precise language"
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
    "ending": "The listing is paused while the competing authorship claims and licence are checked. FemiY replaces the broad word 'exclusive' with a precise description of what is actually documented. The token's existence is not treated as proof of copyright ownership.",
    "cliffhanger": "The artwork listing is paused, but its minting page still uses an open-source component with a missing or incorrect licence notice. Softstorm and IamAbdul ask you to trace that exact component to its repository, restore the required attribution and confirm that the page's licence claims match the source before it goes live.",
    "sceneLines": [
      "FemiY: \"The token can prove that a particular token was transferred to a buyer. It doesn't automatically transfer copyright or permission to use the image commercially. Another artist has an earlier file, and this listing says 'exclusive' without a licence. We need to establish the rights before selling that promise.\""
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
    "narrativePurpose": "The minting page for the disputed collectible copied an open-source component, removed the author's notice and shipped it under a licence that does not match the repository. Travel from the workshop to the repository terminal and then meet the maintainer. Preserve the code history, identify the actual licence and propose a clean contribution path before the listing returns.",
    "learningObjectives": [
      "Use repository history to trace where code came from",
      "Understand that open-source licences set conditions for reuse",
      "Make a focused, reviewable change that restores attribution and respects the licence"
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
    "ending": "The project restores the required attribution and opens a focused change for review. The maintainer contacts the original author and documents the licence. The team corrects the record without claiming that one matching file proves every part of the dispute.",
    "cliffhanger": "While checking the minting page's build and saved incident packet, Joe_Sef and Larai notice the same small cyan marker in the archive metadata attached to several case records. It appears on the records for the payment page and recovery redirect, but not as proof that those pages were operated by the same person. The marker may identify the evidence-routing system; you need more records before drawing that conclusion.",
    "sceneLines": [
      "Softstorm: \"The team says they wrote this component, but the commit history points to another repository. Before we call it theft, compare the exact files and dates and read the licence that came with them.\"",
      "IamAbdul: \"The licence requires attribution, and the notice disappeared in this copy. Preserve the source and licence, restore the required credit and open a focused change for review. A clean contribution lets the maintainer verify what changed instead of turning the issue into a public argument.\""
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
    "narrativePurpose": "A small cyan marker appears in the archive metadata of records from the payment dispute, recovery-page report, payment prototype and repository review. It is not a mark proven to have been placed by the people behind those incidents. Trace the marker through saved evidence packets and deployment notes to learn whether it identifies a shared record-routing tool or something else.",
    "learningObjectives": [
      "Combine evidence from separate incidents into a timeline with traceable sources",
      "Test competing explanations and notice evidence that contradicts an early theory",
      "Distinguish a useful lead from proof of common ownership or responsibility"
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
    "ending": "The timeline confirms that the cyan marker appears in archive metadata across several cases, but no source proves a common operator or shared intent. The team records it as a lead, not a verdict. A deployment note suggests the marker may belong to a shared evidence-routing tool designed to pass case references between systems.",
    "cliffhanger": "That evidence hand-off is failing: a user completes a verification task in one tool, but the next tool loses the case reference. Unique and Christol are testing the integration in Kogi. The practical question is now clear—can the shared system carry a traceable case forward without losing the user's work or exposing private details?",
    "sceneLines": [
      "Joe_Sef: \"There it is again—the cyan marker in the archive footer. Be precise: we found it on saved case records, not proof that the people behind each incident put it on their pages. Put every appearance on a timeline with the original file, date and source. If a clue doesn't survive comparison, it doesn't belong in the conclusion.\"",
      "Larai: \"We have several matching archive markers, but no verified record tying the incidents to one operator. Compare the export metadata and deployment notes, and account for the gaps. The useful question isn't 'Who can we blame?' It's 'Which system added this marker, and what record would prove or disprove that?'\""
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
    "narrativePurpose": "A user completes a verification task in one tool, moves to another and loses the evidence they just collected. The archive marker and deployment notes point to a shared evidence-routing system, but its hand-off is broken. Walk the route from the roadside station to the integration workshop and test whether the case reference survives each step without leaking private details.",
    "learningObjectives": [
      "Understand how connected tools pass references and state between systems",
      "Trace an end-to-end failure instead of fixing one screen in isolation",
      "Test that evidence survives the hand-off while private data remains protected"
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
    "ending": "The revised flow carries the case reference into the next tool and passes the end-to-end regression test. It shares only the information needed for the next step. The team records the remaining limits rather than declaring every possible integration safe.",
    "cliffhanger": "The repaired evidence route points to a city that does not appear on the ordinary map: KitCity. Softstorm is waiting at its gate, where the cyan marker is carved into the entry panel. Bring the traceable case references and deployment notes—not a theory about who is guilty.",
    "sceneLines": [
      "Unique: \"The user completed the first check and did everything asked. Then the second tool behaved as if nothing had happened. Don't make them repeat the whole task yet—trace the reference from the first screen and find where it disappears.\"",
      "Christol: \"The first tool sends a case reference; the second never stores it. Document what each side promises to send and receive, patch the missing step and replay the entire journey. Test the old failure and the retry path. The hand-off is fixed only when the evidence arrives and the private details stay private.\""
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
      "Reconstruct a multi-stage investigation from original sources and saved work",
      "Choose evidence that changes a decision instead of collecting clues for their own sake",
      "Explain both the strength and the limits of a conclusion"
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
    "ending": "The gate opens when the timeline is supported by traceable sources and its uncertainties are labelled. The player is not rewarded for guessing a culprit; the reward comes from showing a defensible chain of reasoning.",
    "cliffhanger": "Inside, three teams are waiting with a practical problem. One needs a payment flow checked, one needs a newcomer protected and one needs a broken integration repaired. Softstorm lets you choose where to begin, but every team will ask you to show your work.",
    "sceneLines": [
      "Softstorm: \"You made it to KitCity. The marker is part of the evidence route, not a password, and I'm not opening the gate because you guessed a name. Show me what happened, when it happened and which original source supports each part.\"",
      "White Coach: \"Lay the cases along one timeline. The wrong payment, fake recovery redirect and broken hand-off may share an evidence route, but that doesn't prove one culprit. Label facts, inferences and unanswered questions separately.\"",
      "Craftore: \"Now choose the evidence that actually changes our decision at the gate. A pile of screenshots is not a strong case if nobody can trace them to a source. Keep the gaps visible; careful uncertainty is a skill, not a failure.\""
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
    "narrativePurpose": "Three KitCity teams have one afternoon to investigate a suspicious payment flow, protect a newcomer and repair a broken hand-off between two tools. Move between the workshop, field-test square and review chamber. Use the evidence, test the fix and leave a record another person can verify.",
    "learningObjectives": [
      "Combine verification, wallet safety and product testing in one end-to-end task",
      "Coordinate responsibilities while keeping each contribution reviewable",
      "Present tested results, failed cases and limitations honestly"
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
    "ending": "The teams verify the payment status, protect the newcomer and pass the revised hand-off tests, including the original failure case. Each result has a source, an owner and a stated limit. KitCity records the work rather than awarding success for confidence alone.",
    "cliffhanger": "The final review unlocks the evidence-routing deployment trail. The cyan marker appears beside a project name, T3Kit—but the marker itself is not proof of responsibility for any incident. Softstorm takes you to the records room to inspect the signed deployment record and verify what relationship it actually establishes.",
    "sceneLines": [
      "Softstorm: \"Three teams, one shared deadline. Choose a task you can take responsibility for, then tell the others what evidence you'll bring back. We don't need three people doing the same work or one person claiming everything.\"",
      "IamAbdul: \"The newcomer has a recovery page open. Explain why the twelve words must stay private, then help them find support through a route you verify independently.\"",
      "Joe_Sef: \"The buyer's screenshot says paid, but the shop has no matching receipt. Trace the transaction, compare the network and recipient, and record what the evidence proves before any goods change hands.\"",
      "Larai: \"The first tool has a case reference and the second drops it. Follow the same case through both systems and identify the exact step where the hand-off fails.\"",
      "Unique: \"I'll run the end-to-end test after the change. A green screen isn't a pass; the correct payment state, safety guidance and case reference all have to survive the journey.\"",
      "Christol: \"The happy path works. Now rerun the case that failed before, plus a timeout and retry. If the old failure can still happen, the fix isn't finished.\"",
      "Craftore: \"Bring the source records, test results and known limits. I'll sign off on what you demonstrated—not on a promise that no future failure is possible.\""
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
    "narrativePurpose": "The signed deployment record identifies T3Kit as the project that commissioned the shared evidence-routing pathway used by the connected tools. The cyan marker is a provenance cue for that pathway, not proof that T3Kit operated the scams or authored every record. Visit the records room, compare the signed record with the evidence you collected and decide what the city should build next. The mystery resolves through documented provenance, not a convenient culprit.",
    "learningObjectives": [
      "Verify a project's stated role from a source record and distinguish that from broader claims",
      "Recognise roles across learning, building, security, communication and community work",
      "Choose one practical skill goal with a deliverable another person can review"
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
    "ending": "The signed records confirm that T3Kit commissioned the shared evidence-routing pathway for learning, building, verification and participation. They do not establish that T3Kit operated the suspicious pages described in the cases, nor do they promise easy money or guaranteed outcomes. The player leaves with a portfolio of work, a chosen next step and a method for checking future claims.",
    "cliffhanger": "The square fills with new teams looking for people who can do the work. Your story does not end with the mission list: it continues with the next skill you practise, the evidence you create and the people your work helps.",
    "sceneLines": [
      "Softstorm: \"The signal brought you here, but the cyan marker was never proof that one person caused every incident. Open the signed deployment record and show me the exact relationship it establishes. If the record doesn't say it, don't add it to the story.\"",
      "IamAbdul: \"The record names T3Kit as the commissioning project for this shared evidence pathway. That tells us who initiated the tool—not who operated every suspicious page that appears in a case file, and not whether any product guarantees a job or profit. What matters now is what you learned to do and what you can prove.\"",
      "Joe_Sef: \"I've matched the deployment reference against the case notes. The links that agree are documented; the gaps stay marked as gaps. A complete story is not one where every mystery has a convenient answer—it's one where we know the difference between evidence and assumption.\"",
      "Larai: \"Look at the work you've touched: verify records, protect people, explain products, build and test tools, review permissions, respect licences and connect systems. Those are real contributions, and none requires you to pretend to know everything already.\"",
      "Unique: \"Choose one skill you want to practise next. Name a small deliverable someone else can inspect—a tested feature, a clear guide, a reviewed report or a useful community task.\"",
      "Christol: \"I'll record your next step with a check-in date and a way to tell whether it worked. If your plan depends on an assumption, write it down so you can test it rather than quietly treating it as fact.\"",
      "Craftore: \"Your file contains the sources, the work you demonstrated and the direction you chose. KitCity opens because you can verify, build, communicate and contribute—and because you're willing to keep learning.\""
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
  const chapterById = new Map(CHAPTERS.map((chapter) => [chapter.id, chapter]));
  for (const mission of MISSIONS) {
    const chapter = chapterById.get(mission.chapterId);
    if (!chapter) errors.push("Unknown chapter " + mission.chapterId + " for " + mission.id);
    else if (chapter.state !== mission.state) errors.push("Mission/chapter state mismatch: " + mission.id);
  }
  const chapterMissionIds = new Set(CHAPTERS.flatMap((chapter) => chapter.missionIds));
  for (const chapter of CHAPTERS) {
    if (!chapter.missionIds.length) errors.push("Chapter has no missions: " + chapter.id);
    for (const missionId of chapter.missionIds) {
      if (!MISSIONS.some((mission) => mission.id === missionId && mission.chapterId === chapter.id)) {
        errors.push("Chapter references an unregistered or mismatched mission: " + chapter.id + "/" + missionId);
      }
    }
  }
  for (const mission of MISSIONS) {
    if (!chapterMissionIds.has(mission.id)) errors.push("Mission is not assigned to a chapter: " + mission.id);
  }
  const implementedStoryStates = [...new Set(MISSIONS.map((mission) => mission.state))];
  return { valid: errors.length === 0, errors, missionCount: MISSIONS.length, characterCount: CHARACTER_ORDER.length, implementedStoryStates };
}
