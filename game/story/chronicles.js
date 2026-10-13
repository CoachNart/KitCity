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
    "cardDescription": "A buyer says he paid for a laptop. Check the screenshot against the shop’s records before deciding what happened.",
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
    "cardDescription": "Trace the payment to the wrong address and uncover how a lookalike link misled the buyer.",
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
    "cardDescription": "Help Timi respond to a wallet-recovery page demanding his secret recovery words.",
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
    "cardDescription": "Separate verified facts from a spreading accusation and decide what the evidence really supports.",
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
    "cardDescription": "A merchant app says PAID too early. Test the checkout flow and stop an unconfirmed payment from being treated as complete.",
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
    "cardDescription": "Inspect the payout setup and find out who can redirect the merchant’s funds.",
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
    "cardDescription": "Investigate a trader’s unexpected token balance and compare the wallet evidence with the claim.",
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
    "cardDescription": "A withdrawal is stuck in processing. Check the transaction status before trusting screenshots or rumours.",
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
    "cardDescription": "Review a disputed trading screenshot and work out what the available evidence can actually prove.",
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
    "cardDescription": "An urgent margin problem threatens a community payment. Weigh the risks before choosing what to do.",
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
    "cardDescription": "A community event has plenty of online hype but few attendees. Find a better way to build real participation.",
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
    "cardDescription": "A fake account impersonates a trusted community member. Trace the message and help protect newcomers.",
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
    "cardDescription": "Help a community recover from a last-minute event cancellation by sharing clear, verified safety information.",
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
    "cardDescription": "Turn useful Web3 knowledge into a practical product announcement people can understand and trust.",
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
    "cardDescription": "Review a Web3 job offer that demands an activation fee and private wallet details before revealing the work.",
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
    "cardDescription": "Create an honest work sample and use it to move toward a real community-building opportunity.",
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
    "cardDescription": "Help launch a local creative directory and decide how to make it useful to the people it serves.",
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
    "cardDescription": "Test whether the directory is reaching real users before choosing how to grow it.",
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
    "cardDescription": "Investigate a token claiming to represent goods held in a warehouse. Check whether the ownership evidence supports the claim.",
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
    "cardDescription": "Review an AI-generated due-diligence report, identify its mistaken ownership claim and inspect the cross-network records.",
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
    "narrativePurpose": "Continue from Mission 20's warehouse due-diligence packet. An AI-generated summary names a different owner even though the signed ownership file is missing and issuance records conflict. Work with Odion and Princess to trace each claim to its source, correct the workflow and keep ownership unresolved until a person can verify it.",
    "cardDescription": "Check an AI-generated ownership claim against the original warehouse and token records.",
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
    "ending": "The report links material claims to original records, flags the owner as unresolved and records the AI's unsupported statement instead of quietly hiding it. A human reviewer checks the corrected summary before it is shared.",
    "cliffhanger": "The source packet also lists tokens moved from the issuing network to a second network, but the destination record is still pending. Racheal and Seun have the original transfer reference. Before anyone sends the asset again, trace the source transaction, bridge message and destination status.",
    "sceneLines": [
      "Odion: \"The warehouse packet is the same one you checked in Edo. The AI summary names an owner, but the signed file does not support that name. Trace the sentence to its source instead of making the answer sound more certain.\"",
      "Princess: \"Separate what we saw, what a record establishes and what is still missing. Retest the summary against the inventory and issuance records, then require human review before sharing an ownership claim.\""
    ],
    "interactionPlan": {
      "m21-obj-1": {
        "speaker": 0,
        "prompt": "The AI summary names an owner, but the signed warehouse file does not support that name.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Trace the claim to the signed inventory and transfer records; leave ownership unresolved if neither proves it.",
            "correct": true,
            "response": "The owner claim stays unresolved until a signed record establishes it."
          },
          {
            "text": "Publish the AI's owner because the report sounds precise.",
            "correct": false,
            "response": "Fluent wording does not replace a missing source or signature."
          }
        ],
        "resolution": "The owner claim stays unresolved until a signed record establishes it.",
        "evidenceFlag": "m21_step_1"
      },
      "m21-obj-2": {
        "speaker": 1,
        "prompt": "The report blends confirmed stock, missing title and conflicting token records into one paragraph.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Require a source for every material claim and separate confirmed, missing and conflicting evidence.",
            "correct": true,
            "response": "The workflow flags conflicts instead of hiding them."
          },
          {
            "text": "Tell the AI to sound more confident and remove uncertainty language.",
            "correct": false,
            "response": "Changing tone cannot repair a missing source. The workflow must expose uncertainty."
          }
        ],
        "resolution": "The workflow flags conflicts instead of hiding them.",
        "evidenceFlag": "m21_step_2"
      },
      "m21-obj-3": {
        "speaker": 0,
        "prompt": "The revised report links to sources, but one sentence still conflicts with the issuance record.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Compare each ownership and issuance statement directly with the original documents.",
            "correct": true,
            "response": "Only claims supported by the original records are retained."
          },
          {
            "text": "Ask the same AI to approve its own revised answer.",
            "correct": false,
            "response": "A system cannot independently validate itself by repeating its output."
          }
        ],
        "resolution": "Only claims supported by the original records are retained.",
        "evidenceFlag": "m21_step_3"
      },
      "m21-obj-4": {
        "speaker": 1,
        "prompt": "The report now lists the missing signature and conflicting issuance entry.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Keep the owner field unresolved and require a human review before sharing.",
            "correct": true,
            "response": "The corrected report is reviewed before it is shared."
          },
          {
            "text": "Publish the most likely owner and add a disclaimer afterward.",
            "correct": false,
            "response": "A disclaimer does not turn an unsupported claim into evidence."
          }
        ],
        "resolution": "The corrected report is reviewed before it is shared.",
        "evidenceFlag": "m21_step_4"
      }
    }
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
    "narrativePurpose": "Continue from Mission 21's corrected due-diligence packet. The issuing-network transaction is confirmed, but the destination record has not updated. Work with Racheal and Seun to trace the original transfer, verify the official bridge status and explain the delay without creating a duplicate transfer.",
    "cardDescription": "Trace one transfer across two networks without mistaking a confirmed source for a completed destination.",
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
    "ending": "The source transaction and bridge message are matched while the destination remains pending. The sender avoids a duplicate transfer and receives a factual update about fees, dependencies and the next status check.",
    "cliffhanger": "The project now proposes adding another bridge route, but the community vote is being promoted before costs, maintenance ownership and a failure plan are clear. Dorcas and Joe in Bauchi need the proposal reviewed before treasury funds are committed.",
    "sceneLines": [
      "Racheal: \"This is the exact transfer reference from the warehouse packet. The source transaction is confirmed; the receiving record is not. We need both records before saying what arrived.\"",
      "Seun: \"Match the networks, asset contract and bridge message ID, then check the official status route independently. A pending destination is not permission to send again.\""
    ],
    "interactionPlan": {
      "m22-obj-1": {
        "speaker": 0,
        "prompt": "The source transaction is confirmed, but the receiving network has no completed destination record.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Match the source and destination networks, asset contract and original transaction reference.",
            "correct": true,
            "response": "The source is verified while destination completion remains a separate question."
          },
          {
            "text": "Use the same ticker on both screens and assume the assets match.",
            "correct": false,
            "response": "Tickers can be copied. Network and contract details identify the asset."
          }
        ],
        "resolution": "The source is verified while destination completion remains a separate question.",
        "evidenceFlag": "m22_step_1"
      },
      "m22-obj-2": {
        "speaker": 1,
        "prompt": "The bridge message has a reference, but the destination status is still pending.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Match the message ID to the independently reached official status page and destination record.",
            "correct": true,
            "response": "The original transfer is traced without creating a second one."
          },
          {
            "text": "Send the same amount again because the receiving screen is late.",
            "correct": false,
            "response": "A second transfer may create a duplicate; it does not complete the first."
          }
        ],
        "resolution": "The original transfer is traced without creating a second one.",
        "evidenceFlag": "m22_step_2"
      },
      "m22-obj-3": {
        "speaker": 0,
        "prompt": "A bridge page has a familiar logo but a slightly different domain.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Navigate to the official bridge from a trusted source and compare the exact domain.",
            "correct": true,
            "response": "The suspicious interface is recorded and avoided."
          },
          {
            "text": "Connect the wallet and enter recovery words to unlock the transfer.",
            "correct": false,
            "response": "A bridge never needs a recovery phrase; a copied logo proves nothing."
          }
        ],
        "resolution": "The suspicious interface is recorded and avoided.",
        "evidenceFlag": "m22_step_3"
      },
      "m22-obj-4": {
        "speaker": 1,
        "prompt": "The source transaction and bridge message are found; the destination remains pending.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Explain the fee, delay and bridge dependency without promising arrival or resending.",
            "correct": true,
            "response": "The sender gets a factual update and a next status check."
          },
          {
            "text": "Promise the sender the asset will arrive soon because the source succeeded.",
            "correct": false,
            "response": "A confirmed source does not prove destination completion or guarantee timing."
          }
        ],
        "resolution": "The sender gets a factual update and a next status check.",
        "evidenceFlag": "m22_step_4"
      }
    }
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
    "narrativePurpose": "Continue from Mission 22's unresolved destination status. A proposal to add another bridge route is heading to a community vote, but its costs, beneficiaries, maintenance owner and failure plan are incomplete. Help Dorcas and Joe make the missing obligations visible before members commit treasury funds.",
    "cardDescription": "Review a treasury proposal's costs, owners and failure plan before voting.",
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
    "ending": "The community delays the vote until costs, maintenance responsibility and the failure plan are published. The record explains why the vote was postponed and what would allow members to reconsider.",
    "cliffhanger": "During the review, Mike finds a privileged contract permission that could redirect treasury funds, and the proposal never disclosed it. Gbemi has the launch build and needs a controlled impact test and responsible disclosure before the team proceeds.",
    "sceneLines": [
      "Dorcas: \"The transfer delay made the risk real, but the proposal asks for a fast vote without naming who maintains the route or pays when it fails. Urgency is not readiness.\"",
      "Joe: \"Compare the budget, recipients, milestones and failure response. If missing information changes the decision, delay the vote and record what must be supplied before it returns.\""
    ],
    "interactionPlan": {
      "m23-obj-1": {
        "speaker": 0,
        "prompt": "The proposal asks for a fast vote but leaves costs, beneficiaries and maintenance unclear.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Request the budget, recipient list, named maintainer and failure plan before voting.",
            "correct": true,
            "response": "The missing obligations are recorded before treasury funds are committed."
          },
          {
            "text": "Vote yes before the countdown ends so the community looks united.",
            "correct": false,
            "response": "Urgency does not tell members what they are funding or who is accountable."
          }
        ],
        "resolution": "The missing obligations are recorded before treasury funds are committed.",
        "evidenceFlag": "m23_step_1"
      },
      "m23-obj-2": {
        "speaker": 1,
        "prompt": "The team wants to release all funds for a broad goal called growth.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Split the plan into deliverables with owners, budgets, evidence and review dates.",
            "correct": true,
            "response": "Each release is tied to a measurable result."
          },
          {
            "text": "Keep one broad growth milestone so nobody has to report delays.",
            "correct": false,
            "response": "Vague milestones make it impossible to measure delivery or accountability."
          }
        ],
        "resolution": "Each release is tied to a measurable result.",
        "evidenceFlag": "m23_step_2"
      },
      "m23-obj-3": {
        "speaker": 0,
        "prompt": "The proposal still has no maintenance owner or failure response.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Delay the vote until those obligations are published, then record the trade-offs.",
            "correct": true,
            "response": "The vote is delayed for missing evidence, not used as a verdict on people."
          },
          {
            "text": "Approve it because most comments are positive.",
            "correct": false,
            "response": "Popularity cannot replace costs, responsibilities or a failure plan."
          }
        ],
        "resolution": "The vote is delayed for missing evidence, not used as a verdict on people.",
        "evidenceFlag": "m23_step_3"
      },
      "m23-obj-4": {
        "speaker": 1,
        "prompt": "Members disagree about whether postponing the vote is too cautious.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Publish the reason for delay and the conditions required for a new vote.",
            "correct": true,
            "response": "Members know what remains open and how to revisit the decision."
          },
          {
            "text": "Announce that the community approved a safe route even though no vote occurred.",
            "correct": false,
            "response": "A postponed vote is not approval, and a majority does not prove technical safety."
          }
        ],
        "resolution": "Members know what remains open and how to revisit the decision.",
        "evidenceFlag": "m23_step_4"
      }
    }
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
    "narrativePurpose": "Continue from Mission 23's delayed governance vote. A privileged contract role can redirect funds, a capability missing from the proposal. Work with Mike and Gbemi to reproduce the path safely, report it through the agreed security route, test the patch and decide whether launch must remain paused.",
    "cardDescription": "Test and report a privileged contract risk before the project launches.",
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
    "ending": "The team receives a reproducible private report, patches the redirect path and retests the original and related cases. Launch stays paused until independent review confirms the fix.",
    "cliffhanger": "While the revised launch is on hold, FemiY proposes a commemorative digital collectible using artwork that another creator may have made first. Before the listing promises exclusive rights, the team must check authorship, the licence and what a buyer would actually receive.",
    "sceneLines": [
      "Mike: \"The proposal never mentioned this role, but the test build shows it can redirect funds. The developer says nobody would misuse it. That does not answer what the permission can do.\"",
      "Gbemi: \"Reproduce the path in a controlled test, preserve the evidence and disclose it through the agreed contact. The fix must pass the original failure and nearby permission checks before independent review.\""
    ],
    "interactionPlan": {
      "m24-obj-1": {
        "speaker": 0,
        "prompt": "A privileged contract role can redirect funds, although the proposal never mentioned it.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Trace the role in a test deployment and document which funds or actions it can affect.",
            "correct": true,
            "response": "The finding describes a demonstrated capability, not a claim about intent."
          },
          {
            "text": "Trust the developer's promise that nobody would misuse it.",
            "correct": false,
            "response": "Intent does not remove a permission's capability. Test what it can do."
          }
        ],
        "resolution": "The finding describes a demonstrated capability, not a claim about intent.",
        "evidenceFlag": "m24_step_1"
      },
      "m24-obj-2": {
        "speaker": 1,
        "prompt": "The redirect path is reproduced and needs responsible disclosure.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Send the impact and reproduction steps privately through the agreed security contact.",
            "correct": true,
            "response": "The team receives enough detail to reproduce the issue safely."
          },
          {
            "text": "Post the full exploit steps publicly so the team has to respond.",
            "correct": false,
            "response": "Publicly exposing a working exploit before a fix can put users at risk."
          }
        ],
        "resolution": "The team receives enough detail to reproduce the issue safely.",
        "evidenceFlag": "m24_step_2"
      },
      "m24-obj-3": {
        "speaker": 0,
        "prompt": "A patch is ready, but only the normal successful transaction was tested.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Run the original failing test and adjacent permission regression tests.",
            "correct": true,
            "response": "The patch is judged after the original and related tests pass."
          },
          {
            "text": "Accept the demo because the main screen now looks correct.",
            "correct": false,
            "response": "A visual demo cannot prove the privileged path is blocked."
          }
        ],
        "resolution": "The patch is judged after the original and related tests pass.",
        "evidenceFlag": "m24_step_3"
      },
      "m24-obj-4": {
        "speaker": 1,
        "prompt": "The deadline is tomorrow, but independent review has not confirmed the patch.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Keep launch paused until regression tests and independent review pass.",
            "correct": true,
            "response": "The team records the hold and what evidence would allow release."
          },
          {
            "text": "Launch now and promise to investigate if anyone complains.",
            "correct": false,
            "response": "The known redirect risk remains open until the fix is verified."
          }
        ],
        "resolution": "The team records the hold and what evidence would allow release.",
        "evidenceFlag": "m24_step_4"
      }
    }
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
      "FemiY",
      "Softstorm"
    ],
    "narrativePurpose": "Continue from Mission 24's paused launch. A commemorative digital collectible is being prepared, but an earlier artwork file names another creator and the listing promises exclusivity without a clear licence. Work with FemiY and Softstorm to separate token ownership from copyright, verify the terms and pause unsupported claims.",
    "cardDescription": "Check artwork authorship and licence terms before promising collectible ownership rights.",
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
    "ending": "The listing remains paused while authorship and licence rights are reviewed. The team removes unsupported exclusivity language and records the difference between owning a token and owning copyright or commercial-use rights.",
    "cliffhanger": "The minting page also includes an open-source component whose licence notice has disappeared. Softstorm and IamAbdul are tracing it to the original repository so the team can restore the required attribution before release.",
    "sceneLines": [
      "FemiY: \"The token can record a transfer, but that does not automatically give a buyer copyright or commercial-use rights. The earlier file has another creator's name, and our listing says exclusive without showing the licence.\"",
      "Softstorm: \"Trace the file history and read the actual licence. If the project cannot establish the rights it advertises, pause the mint and describe only what the documents support.\""
    ],
    "interactionPlan": {
      "m25-obj-1": {
        "speaker": 0,
        "prompt": "The collectible says exclusive, but an earlier artwork file names another creator.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Check file history, attribution and the licence before repeating the exclusivity claim.",
            "correct": true,
            "response": "The listing stays paused until authorship and permission are supported."
          },
          {
            "text": "Assume the token mint record proves copyright ownership.",
            "correct": false,
            "response": "A token record does not automatically transfer copyright."
          }
        ],
        "resolution": "The listing stays paused until authorship and permission are supported.",
        "evidenceFlag": "m25_step_1"
      },
      "m25-obj-2": {
        "speaker": 1,
        "prompt": "The seller wants to say buyers own the artwork outright.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "State separately what the buyer owns, what the licence permits and what stays with the creator.",
            "correct": true,
            "response": "Buyer-facing terms describe only documented rights."
          },
          {
            "text": "Promise full commercial rights because buyers expect them.",
            "correct": false,
            "response": "Expectation cannot expand rights that the creator did not grant."
          }
        ],
        "resolution": "Buyer-facing terms describe only documented rights.",
        "evidenceFlag": "m25_step_2"
      },
      "m25-obj-3": {
        "speaker": 0,
        "prompt": "The draft promises royalties on every resale, but no marketplace terms are attached.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Verify the contract and marketplace terms, then state any limits.",
            "correct": true,
            "response": "Resale and revenue terms stay qualified until verified."
          },
          {
            "text": "Promise royalties forever on every marketplace without checking.",
            "correct": false,
            "response": "Royalty behaviour varies; an unsupported promise misleads buyers and creators."
          }
        ],
        "resolution": "Resale and revenue terms stay qualified until verified.",
        "evidenceFlag": "m25_step_3"
      },
      "m25-obj-4": {
        "speaker": 1,
        "prompt": "The artwork and minting page disagree about exclusivity and commercial use.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Pause the launch and publish precise rights only after the licence review.",
            "correct": true,
            "response": "The project does not sell rights it has not established."
          },
          {
            "text": "Keep 'exclusive' and remove the earlier creator's attribution.",
            "correct": false,
            "response": "Removing a credit hides evidence; it does not resolve the rights dispute."
          }
        ],
        "resolution": "The project does not sell rights it has not established.",
        "evidenceFlag": "m25_step_4"
      }
    }
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
    "narrativePurpose": "Continue from Mission 25's paused minting page. Its open-source component points to another repository, and the required licence notice is missing. Work with Softstorm and IamAbdul to inspect the history, restore attribution and submit a focused change for review without making an unsupported accusation.",
    "cardDescription": "Restore missing open-source attribution through a traceable, reviewable change.",
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
    "ending": "The required attribution is restored in a focused review, the licence and source are linked, and the maintainer can inspect the change. The team corrects the record without claiming the file match proves every part of the dispute.",
    "cliffhanger": "While saving the review packet, Joe_Sef and Larai find the same cyan marker in archive metadata attached to several earlier cases. It may identify a shared evidence-routing tool, but it does not identify who operated the original pages. Trace the marker before drawing a conclusion.",
    "sceneLines": [
      "Softstorm: \"The commit history points to another repository. Compare the exact files and dates before deciding what happened; a matching file is a lead, not a complete verdict.\"",
      "IamAbdul: \"Read the licence, restore the required notice and source credit, then open a small change the maintainer can inspect. Preserve the history so the correction remains traceable.\""
    ],
    "interactionPlan": {
      "m26-obj-1": {
        "speaker": 0,
        "prompt": "The minting page uses a component whose history points to another repository.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Compare exact files, dates and repository history, then preserve the source licence.",
            "correct": true,
            "response": "The provenance is recorded without claiming more than the files prove."
          },
          {
            "text": "Accuse the current team of theft because one file looks familiar.",
            "correct": false,
            "response": "A matching file is a lead to investigate, not a complete verdict."
          }
        ],
        "resolution": "The provenance is recorded without claiming more than the files prove.",
        "evidenceFlag": "m26_step_1"
      },
      "m26-obj-2": {
        "speaker": 1,
        "prompt": "The source is identified, but the copied component has no licence notice.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Read the actual licence and identify required attribution before editing the copy.",
            "correct": true,
            "response": "The correction follows the licence and preserves the record."
          },
          {
            "text": "Delete the repository history so the old source cannot be found.",
            "correct": false,
            "response": "Removing history hides provenance and does not satisfy the licence."
          }
        ],
        "resolution": "The correction follows the licence and preserves the record.",
        "evidenceFlag": "m26_step_2"
      },
      "m26-obj-3": {
        "speaker": 0,
        "prompt": "The notice needs restoring without changing unrelated code.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Restore attribution, link the source and keep the change focused.",
            "correct": true,
            "response": "The source credit is restored in a reviewable change."
          },
          {
            "text": "Replace the original author's name with the current project's name.",
            "correct": false,
            "response": "Changing the author's name makes the record less accurate."
          }
        ],
        "resolution": "The source credit is restored in a reviewable change.",
        "evidenceFlag": "m26_step_3"
      },
      "m26-obj-4": {
        "speaker": 1,
        "prompt": "The fix is ready, but no one has reviewed the attribution or tests.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Open a review with the source reference, licence note and relevant tests.",
            "correct": true,
            "response": "The change is ready for maintainer review with its source preserved."
          },
          {
            "text": "Merge directly because the change is small and the deadline is close.",
            "correct": false,
            "response": "Licence changes still need traceable review."
          }
        ],
        "resolution": "The change is ready for maintainer review with its source preserved.",
        "evidenceFlag": "m26_step_4"
      }
    }
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
    "narrativePurpose": "Continue from Mission 26's saved review packet. A cyan marker appears in archived records for several earlier incidents, including the payment page and recovery redirect. Work with Joe_Sef and Larai to build a source-linked timeline, test competing explanations and avoid treating shared archive metadata as proof of a common operator.",
    "cardDescription": "Investigate the cyan archive marker without confusing shared metadata with proof of guilt.",
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
    "ending": "The timeline confirms that the cyan marker appears in several archive exports, but no source connects it to one operator of the original incidents. The team records it as a lead and leaves the identity question open.",
    "cliffhanger": "The archive notes point to a practical failure: one tool completes a verification step, but the next tool loses the case reference. Unique and Christol are testing that broken hand-off in Kogi. Trace the reference end to end without making the user repeat completed work or exposing private details.",
    "sceneLines": [
      "Joe_Sef: \"The cyan marker is back in the archive footer. We found it on saved case packets, not proof that the people behind each incident added it. Record every appearance with its original file and timestamp.\"",
      "Larai: \"Compare the export metadata and deployment notes, including records that do not fit the first theory. The question is which system added the marker and what source could establish that—not who we can blame.\""
    ],
    "interactionPlan": {
      "m27-obj-1": {
        "speaker": 0,
        "prompt": "The cyan marker appears in saved packets for several earlier incidents.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Build a timeline with each marker's original file, timestamp and archive metadata.",
            "correct": true,
            "response": "The marker is recorded as a sourced clue, not a verdict."
          },
          {
            "text": "Treat every packet with the marker as proof one person ran every incident.",
            "correct": false,
            "response": "Shared metadata may show an export path, not the original operator."
          }
        ],
        "resolution": "The marker is recorded as a sourced clue, not a verdict.",
        "evidenceFlag": "m27_step_1"
      },
      "m27-obj-2": {
        "speaker": 1,
        "prompt": "The archive exports share a marker, but timestamps and deployment notes differ.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Compare export versions and deployment notes, including records that contradict the first theory.",
            "correct": true,
            "response": "The timeline preserves matches and discrepancies."
          },
          {
            "text": "Ignore records that do not fit and keep only the repeated marker.",
            "correct": false,
            "response": "Contradictions are evidence too and may change the explanation."
          }
        ],
        "resolution": "The timeline preserves matches and discrepancies.",
        "evidenceFlag": "m27_step_2"
      },
      "m27-obj-3": {
        "speaker": 0,
        "prompt": "Two explanations remain: a shared archive tool or one common operator.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Test whether the marker was added during export and seek a signed link to the original pages.",
            "correct": true,
            "response": "The report says which explanation is supported and what is missing."
          },
          {
            "text": "Choose the common-operator theory because it connects the story neatly.",
            "correct": false,
            "response": "A neat explanation is not proof without a source linking it to the original activity."
          }
        ],
        "resolution": "The report says which explanation is supported and what is missing.",
        "evidenceFlag": "m27_step_3"
      },
      "m27-obj-4": {
        "speaker": 1,
        "prompt": "The marker repeats in archive metadata, but no source links it to one operator.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Report what the marker establishes and leave operator identity unresolved.",
            "correct": true,
            "response": "The team investigates the system without making an unsupported accusation."
          },
          {
            "text": "Name the project closest to the marker and call it responsible.",
            "correct": false,
            "response": "Proximity in an archive is not proof of responsibility."
          }
        ],
        "resolution": "The team investigates the system without making an unsupported accusation.",
        "evidenceFlag": "m27_step_4"
      }
    }
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
    "narrativePurpose": "Continue from Mission 27's archive notes. The evidence-routing path is losing a case reference between two tools, so a completed verification appears missing at the next step. Work with Unique and Christol to map the full journey, document the interface contract, repair the hand-off and retest failure, timeout and retry paths.",
    "cardDescription": "Repair and test the hand-off so verified work reaches the next tool safely.",
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
    "ending": "The case reference survives the revised hand-off, and the team passes the original failure, timeout and retry tests using only the information needed by the next tool. The report states which paths were tested and what remains outside the test scope.",
    "cliffhanger": "The repaired route points to a city missing from the ordinary map: KitCity. Softstorm is waiting at its gate with the deployment notes and traceable case references. Bring the sources and unresolved questions, not a guess about who is guilty.",
    "sceneLines": [
      "Unique: \"The user completed the first check, but the next screen behaves as if nothing happened. Follow the same case reference across the full journey before asking the user to repeat anything.\"",
      "Christol: \"The first tool sends a reference and the second never stores it. Define the fields and privacy limits, fix the mapping, then replay the original failure plus timeout and retry cases.\""
    ],
    "interactionPlan": {
      "m28-obj-1": {
        "speaker": 0,
        "prompt": "The user completes verification in one tool, but the next opens without the case reference.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Trace the same case ID through the request, response and receiving tool.",
            "correct": true,
            "response": "The failure is located in the hand-off, not blamed on the user."
          },
          {
            "text": "Tell the user to repeat the task and ignore the missing reference.",
            "correct": false,
            "response": "Repeating work hides the defect and may create inconsistent records."
          }
        ],
        "resolution": "The failure is located in the hand-off, not blamed on the user.",
        "evidenceFlag": "m28_step_1"
      },
      "m28-obj-2": {
        "speaker": 1,
        "prompt": "The two tools disagree about which fields the hand-off must carry.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Document the required case reference, status fields and privacy limits on both sides.",
            "correct": true,
            "response": "The interface contract becomes explicit without spreading private data."
          },
          {
            "text": "Pass the entire private chat and account details to make it easier.",
            "correct": false,
            "response": "Only the minimum necessary context should cross the boundary."
          }
        ],
        "resolution": "The interface contract becomes explicit without spreading private data.",
        "evidenceFlag": "m28_step_2"
      },
      "m28-obj-3": {
        "speaker": 0,
        "prompt": "The receiving tool drops the case reference when it stores the response.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Fix the mapping and test with a synthetic case containing no private data.",
            "correct": true,
            "response": "The prototype carries the case ID without unnecessary personal data."
          },
          {
            "text": "Duplicate the entire user record in the second tool as a shortcut.",
            "correct": false,
            "response": "Copying everything increases exposure and may not repair the mapping."
          }
        ],
        "resolution": "The prototype carries the case ID without unnecessary personal data.",
        "evidenceFlag": "m28_step_3"
      },
      "m28-obj-4": {
        "speaker": 1,
        "prompt": "The happy path works, but timeout and retry behaviour remain untested.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Run the original failure, timeout, retry and privacy checks end to end.",
            "correct": true,
            "response": "The repaired flow is accepted only for the cases actually tested."
          },
          {
            "text": "Approve the fix after one successful screen recording.",
            "correct": false,
            "response": "One happy path cannot show that the hand-off survives failure and retry."
          }
        ],
        "resolution": "The repaired flow is accepted only for the cases actually tested.",
        "evidenceFlag": "m28_step_4"
      }
    }
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
    "narrativePurpose": "Continue from Mission 28's repaired hand-off. The case references lead to KitCity, where Softstorm, White Coach and Craftore ask you to reconstruct the connected incidents from source records. Build a timeline, choose work you can demonstrate and separate verified facts from inferences before the gate opens.",
    "cardDescription": "Build a source-linked timeline to open KitCity's evidence gate.",
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
    "ending": "The gate opens when the timeline links material claims to source records and labels contradictions and unanswered questions. The player succeeds by showing defensible reasoning, not by guessing a culprit.",
    "cliffhanger": "Inside KitCity, three teams need a payment flow checked, a newcomer protected and a broken integration repaired. Softstorm lets you choose where to begin, but every team will ask you to show your work and report the limits of the result.",
    "sceneLines": [
      "Softstorm: \"The marker is part of the evidence route, not a password. Show what happened, when it happened and which original record supports each part.\"",
      "White Coach: \"Put the payment dispute, recovery redirect and hand-off failure on one timeline. A shared route does not prove a shared culprit; label facts, inferences and unknowns separately.\"",
      "Craftore: \"Choose evidence that changes the decision. A pile of screenshots is not a strong case unless another person can trace each claim to its source.\""
    ],
    "interactionPlan": {
      "m29-obj-1": {
        "speaker": 0,
        "prompt": "The gatekeeper has several case records, but the sources are scattered.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Connect the incidents using dated source records and label facts, inferences and gaps.",
            "correct": true,
            "response": "The timeline is traceable and does not turn inference into fact."
          },
          {
            "text": "Assume the matching marker proves one culprit and write the conclusion first.",
            "correct": false,
            "response": "A shared clue can connect records without proving a shared operator or intent."
          }
        ],
        "resolution": "The timeline is traceable and does not turn inference into fact.",
        "evidenceFlag": "m29_step_1"
      },
      "m29-obj-2": {
        "speaker": 1,
        "prompt": "The gate also checks what you can contribute to the next task.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Choose a role tied to a demonstrated skill and name the artifact that proves the result.",
            "correct": true,
            "response": "The role has a clear scope and reviewable evidence."
          },
          {
            "text": "Claim expertise in every area so the team trusts you with the whole case.",
            "correct": false,
            "response": "An unsupported title does not show what you can deliver."
          }
        ],
        "resolution": "The role has a clear scope and reviewable evidence.",
        "evidenceFlag": "m29_step_2"
      },
      "m29-obj-3": {
        "speaker": 0,
        "prompt": "Three teams need help under one deadline.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Assign one owner per case, agree on evidence to return and set a check-in.",
            "correct": true,
            "response": "Each team knows its task, sources and hand-off point."
          },
          {
            "text": "Let everyone investigate the same clue without assigning responsibility.",
            "correct": false,
            "response": "Duplicated effort leaves other problems unattended."
          }
        ],
        "resolution": "Each team knows its task, sources and hand-off point.",
        "evidenceFlag": "m29_step_3"
      },
      "m29-obj-4": {
        "speaker": 1,
        "prompt": "The gatekeeper asks for the reconstruction, including unresolved questions.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Submit a source-linked timeline with facts, inferences and unknowns clearly labelled.",
            "correct": true,
            "response": "The gate opens on evidence, not a guess."
          },
          {
            "text": "Name the most likely suspect so the report feels complete.",
            "correct": false,
            "response": "A defensible report can leave identity unresolved when the sources do not establish it."
          }
        ],
        "resolution": "The gate opens on evidence, not a guess.",
        "evidenceFlag": "m29_step_4"
      }
    }
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
    "narrativePurpose": "Continue from Mission 29's open gate. Three teams need practical help: one has a premature payment-success screen, one has a newcomer facing a fake recovery page, and one has an integration that drops a case reference. Coordinate the work, test each real failure and report results without claiming the whole system is risk-free.",
    "cardDescription": "Solve three practical cases and verify the results through repeatable tests.",
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
    "ending": "The payment state reflects the verified transaction, the newcomer receives safe guidance without sharing secrets, and the case reference survives end-to-end tests. Each team records its evidence, owner and remaining limits.",
    "cliffhanger": "The practical tests reveal a signed deployment trail beside the cyan marker and the project name T3Kit. That is a lead, not proof of who operated the suspicious pages. Softstorm opens the records room for a final check of the signed deployment record and its stated scope.",
    "sceneLines": [
      "Softstorm: \"Three teams share one deadline. Take responsibility for one task and tell the others which evidence you will return. We need reviewable results, not one person claiming everything.\"",
      "IamAbdul: \"The newcomer needs a safe route away from the recovery page; the buyer needs a payment record checked; the integration needs the same case reference to survive. Keep secrets private and test the actual failure.\"",
      "Christol: \"When the first version works, rerun the old failure, a timeout and a retry. A green screen is not a pass if the underlying record is wrong.\""
    ],
    "interactionPlan": {
      "m30-obj-1": {
        "speaker": 0,
        "prompt": "The teams bring a payment screenshot, a newcomer report and a broken hand-off.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Use the original transaction, private incident record and case-reference trace; assign an owner to each.",
            "correct": true,
            "response": "Each workstream begins with evidence another person can inspect."
          },
          {
            "text": "Start from memory and let the smoothest story decide what matters.",
            "correct": false,
            "response": "Confidence cannot replace source records when cases disagree."
          }
        ],
        "resolution": "Each workstream begins with evidence another person can inspect.",
        "evidenceFlag": "m30_step_1"
      },
      "m30-obj-2": {
        "speaker": 1,
        "prompt": "A newcomer has opened a lookalike recovery page on a practice device.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Close it, verify support independently and never expose recovery words.",
            "correct": true,
            "response": "The newcomer receives safe guidance without exposing secrets."
          },
          {
            "text": "Enter the recovery phrase to see whether the warning is real.",
            "correct": false,
            "response": "A recovery phrase gives wallet control and must never be entered into a suspicious page."
          }
        ],
        "resolution": "The newcomer receives safe guidance without exposing secrets.",
        "evidenceFlag": "m30_step_2"
      },
      "m30-obj-3": {
        "speaker": 0,
        "prompt": "The payment screen turns green early, and the second tool loses the case ID.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Require confirmed payment state and preserve the same case reference across the hand-off.",
            "correct": true,
            "response": "The prototype fixes the actual failure points in the full journey."
          },
          {
            "text": "Polish the green badge and leave the backend hand-off for later.",
            "correct": false,
            "response": "A polished screen still misleads if the payment or case state is wrong."
          }
        ],
        "resolution": "The prototype fixes the actual failure points in the full journey.",
        "evidenceFlag": "m30_step_3"
      },
      "m30-obj-4": {
        "speaker": 1,
        "prompt": "The happy path passes, but pending payment and failed hand-off cases have not been tested.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Test pending and confirmed payment, missing reference, timeout and retry; report limits.",
            "correct": true,
            "response": "The review records repeatable results and the scope of the tests."
          },
          {
            "text": "Declare the system safe because the demo worked once.",
            "correct": false,
            "response": "One demo cannot prove every risk is gone or every failure path works."
          }
        ],
        "resolution": "The review records repeatable results and the scope of the tests.",
        "evidenceFlag": "m30_step_4"
      }
    }
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
    "narrativePurpose": "Continue from Mission 30's tested results. The signed deployment record names T3Kit beside the shared evidence-routing pathway, but the record must be read within its stated scope. Verify the signature and project relationship, present the evidence limits, then choose a practical skill goal with a deliverable another person can review.",
    "cardDescription": "Verify the signed deployment record and finish with a defensible conclusion and practical next step.",
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
    "ending": "The signed records confirm that T3Kit commissioned the shared evidence-routing pathway for learning, building, verification and participation. They do not establish that T3Kit operated the suspicious pages described in the cases. The player leaves with a source-linked portfolio and one practical next deliverable.",
    "cliffhanger": "New teams are gathering in the square. The next chapter is the work you choose to practise, the evidence you create and the people that work helps.",
    "sceneLines": [
      "Softstorm: \"The cyan marker brought us here, but it never proved who caused every incident. Open the signed deployment record and show the exact relationship it establishes.\"",
      "IamAbdul: \"The record names T3Kit as the project that commissioned this evidence pathway. That is not proof it operated every suspicious page in the case files. Keep the conclusion within the signed record.\"",
      "Craftore: \"Your portfolio should show the work you can verify and one next step someone else can review. KitCity opens because you can explain what the evidence proves—and where it stops.\""
    ],
    "interactionPlan": {
      "m31-obj-1": {
        "speaker": 0,
        "prompt": "The cyan marker sits beside a project name, but the team needs the signed deployment record.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Check the signature, project identity and the relationship the record explicitly documents.",
            "correct": true,
            "response": "The conclusion stays within the scope of the signed record."
          },
          {
            "text": "Treat the marker alone as proof the project operated every suspicious page.",
            "correct": false,
            "response": "The marker is an archive clue; the signed record establishes the documented relationship."
          }
        ],
        "resolution": "The conclusion stays within the scope of the signed record.",
        "evidenceFlag": "m31_step_1"
      },
      "m31-obj-2": {
        "speaker": 1,
        "prompt": "The record names who commissioned the pathway, not who caused every incident.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Map the verified role to the pathway and leave unrelated incident responsibility unresolved.",
            "correct": true,
            "response": "The project relationship is described without extending it beyond the evidence."
          },
          {
            "text": "Claim the project ran every suspicious page because its name appears in the record.",
            "correct": false,
            "response": "Commissioning a tool does not prove who operated every page later referenced by it."
          }
        ],
        "resolution": "The project relationship is described without extending it beyond the evidence.",
        "evidenceFlag": "m31_step_2"
      },
      "m31-obj-3": {
        "speaker": 0,
        "prompt": "You have worked on verification, wallet safety, communication, product tests and integration.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Choose one skill and define a small deliverable, reviewer and check-in date.",
            "correct": true,
            "response": "The next step becomes concrete and reviewable."
          },
          {
            "text": "Write 'become an expert' without a deliverable or way to measure progress.",
            "correct": false,
            "response": "A practical goal needs an observable result and a review method."
          }
        ],
        "resolution": "The next step becomes concrete and reviewable.",
        "evidenceFlag": "m31_step_3"
      },
      "m31-obj-4": {
        "speaker": 1,
        "prompt": "The final file contains source records, test results and a learning direction.",
        "playerPrompt": "I will check the source before deciding.",
        "choices": [
          {
            "text": "Present what the record proves, what it does not, your portfolio and one next deliverable.",
            "correct": true,
            "response": "The player leaves with a defensible conclusion and a reviewable next step."
          },
          {
            "text": "Say the investigation proves T3Kit operated the suspicious pages so every mystery has an answer.",
            "correct": false,
            "response": "The signed record does not establish that T3Kit operated the suspicious pages."
          }
        ],
        "resolution": "The player leaves with a defensible conclusion and a reviewable next step.",
        "evidenceFlag": "m31_step_4"
      }
    }
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
