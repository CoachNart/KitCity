/**
 * KITCITY: THE LOST VALUE — continuation after Kogi.
 * These are story-scene records, not replacements for the approved first arc.
 * Keep each stop playable, short, character-led, and grounded in a real task.
 */
export const LOST_VALUE_CONTINUATION = [
  {
    id:'lost-value-16', n:16, state:'Ogun State', city:'abeokuta', title:'The Builder Who Walked Away',
    goal:'Discover why a capable builder left a promising project and recover the agreement that was never made clear.',
    value:'FAIR AGREEMENTS', cast:['Tessa'], splitAfter:3,
    dialogue:[
      ['Tessa','Your Kogi archive lists a release that never credited its builder. That was my project.'],
      ['PLAYER','Why did you leave before launch?'],
      ['Tessa','They kept changing what counted as my work, my credit, and my payment. Nothing was written down. They called me disloyal when I asked for clarity.'],
      ['PLAYER','Then let’s recover the messages and build a clear delivery agreement before anybody starts again.']
    ],
    choices:[], task:'Find the original work messages and assemble a clear scope, credit, payment, and change record.',
    evidenceTitle:'The Missing Agreement', evidenceBody:'The team never agreed in writing on scope, payment, ownership, or how changes would be approved.',
    reward:'A good idea needs a fair agreement before the work begins.'
  },
  {
    id:'lost-value-17', n:17, state:'Ondo State', city:'akure', title:'The Copy Nobody Asked For',
    goal:'Help a small team test a useful feature with real users before spending its limited budget.',
    value:'VALIDATION', cast:['Tessa'], splitAfter:3,
    dialogue:[
      ['Tessa','We copied a popular app because everyone said it was the next big thing. Nobody used ours.'],
      ['PLAYER','Did you ask people what they actually needed?'],
      ['Tessa','We asked after we had already spent the money.'],
      ['PLAYER','Let’s test one small feature with the people who would use it, then decide what deserves to grow.']
    ],
    choices:[], task:'Collect three user needs, run a small feature test, and record what changed after feedback.',
    evidenceTitle:'The Test Before the Build', evidenceBody:'The team has opinions and a prototype, but no evidence that the intended users need the copied feature.',
    reward:'You do not have to build everything. Build the part people need.'
  },
  {
    id:'lost-value-18', n:18, state:'Kwara State', city:'ilorin', title:'The Deal That Needed Both Sides',
    goal:'Resolve a collaboration dispute by making responsibilities and approval steps visible to everyone involved.',
    value:'COLLABORATION', cast:['Mira'], splitAfter:3,
    dialogue:[
      ['Mira','The designer says the work is finished. The developer says the files cannot be used.'],
      ['PLAYER','What did each side agree to deliver?'],
      ['Mira','They agreed to “work together.” That was the whole agreement.'],
      ['PLAYER','Let’s match the files to a delivery checklist and get both sides to confirm the next step.']
    ],
    choices:[], task:'Match the deliverables to the brief and record both sides’ acceptance or specific revisions.',
    evidenceTitle:'The Shared Delivery Record', evidenceBody:'Responsibilities, file formats, review dates, and acceptance criteria were never agreed.',
    reward:'Collaboration works when both sides know what they are responsible for.'
  },
  {
    id:'lost-value-19', n:19, state:'Imo State', city:'owerri', title:'The First Real Customer',
    goal:'Help a creator turn a promising demo into a small paid service with clear terms and a real customer.',
    value:'DELIVERY', cast:['Nkem'], splitAfter:3,
    dialogue:[
      ['Nkem','My portfolio gets likes, but nobody has paid me for the service yet.'],
      ['PLAYER','What can you deliver this week that solves one clear problem?'],
      ['Nkem','A booking page for a local business. I can make a small working version.'],
      ['PLAYER','Agree the price and deadline, show the demo, and record whether the customer accepts it.']
    ],
    choices:[], task:'Agree a small scope with a local customer, deliver the working demo, and record feedback.',
    evidenceTitle:'First Customer Brief', evidenceBody:'The customer needs a working booking page, a clear price, a delivery date, and a way to request changes.',
    reward:'A real customer teaches you what applause cannot.'
  },
  {
    id:'lost-value-20', n:20, state:'Rivers State', city:'ph', title:'When Success Becomes the Problem',
    goal:'Help a growing service deal with missed requests by fixing its operations before chasing more users.',
    value:'SUSTAINABILITY', cast:['Boma'], splitAfter:3,
    dialogue:[
      ['Boma','We finally have customers. Now every order is late and support messages are piling up.'],
      ['PLAYER','What changed when the business grew?'],
      ['Boma','We kept adding customers but never fixed the process behind each order.'],
      ['PLAYER','Let’s map the order from request to delivery and find where work gets stuck.']
    ],
    choices:[], task:'Trace three orders from request to delivery and identify the biggest repeated delay.',
    evidenceTitle:'The Bottleneck', evidenceBody:'Demand increased, but the team has no shared order status, owner, or escalation process.',
    reward:'Growth is only useful when the service can keep its promises.'
  },
  {
    id:'lost-value-21', n:21, state:'Bayelsa State', city:'bayelsa', title:'The Record Beneath the Water',
    goal:'Reconstruct a disputed community payment using records from both sides without treating a digital record as the whole truth.',
    value:'RECONCILIATION', cast:['Timi'], splitAfter:3,
    dialogue:[
      ['Timi','The group says the supplier was paid. The supplier says the money never arrived.'],
      ['PLAYER','Do we have the transaction reference and the delivery record?'],
      ['Timi','We have a reference, but nobody checked the network or the receiving address.'],
      ['PLAYER','Let’s verify the transaction, then compare it with the agreed amount and the goods received.']
    ],
    choices:[], task:'Verify the transaction reference and reconcile the payment against the order and delivery record.',
    evidenceTitle:'Two Records, One Dispute', evidenceBody:'A transaction record can show a transfer, but the network, recipient, amount, and real-world delivery still need checking.',
    reward:'Evidence becomes useful when the records agree with what actually happened.'
  },
  {
    id:'lost-value-22', n:22, state:'Akwa Ibom State', city:'uyo', title:'More Than a Wallet',
    goal:'Help a beginner find a realistic Web3 work path and identify an opportunity that demands an unsafe upfront fee.',
    value:'CAREERS', cast:['Ini'], splitAfter:3,
    dialogue:[
      ['Ini','Every advert says “Web3 job,” but some ask me to pay before they even explain the work.'],
      ['PLAYER','What skill do you want to build first?'],
      ['Ini','Writing and community support. I want real experience, not a promise of instant income.'],
      ['PLAYER','Let’s compare the role, the portfolio task, the pay terms, and the person offering it. No job should need your recovery phrase or a mystery fee.']
    ],
    choices:[], task:'Review three role cards and select the one with verifiable work, clear terms, and no suspicious upfront fee.',
    evidenceTitle:'A Work Offer That Can Be Checked', evidenceBody:'A credible role explains the work, hiring contact, payment terms, and selection process without guaranteeing earnings.',
    reward:'Web3 work includes writing, design, research, support, development, and many other skills.'
  },
  {
    id:'lost-value-23', n:23, state:'Ebonyi State', city:'abakaliki', title:'The Door With No Instructions',
    goal:'Improve a confusing first-use flow so a beginner can understand the next action and its consequences.',
    value:'ONBOARDING', cast:['Mmesoma'], splitAfter:3,
    dialogue:[
      ['Mmesoma','People sign up, see five unfamiliar buttons, and leave.'],
      ['PLAYER','What does a first-time user need to do first?'],
      ['Mmesoma','We never watched anyone try it. We just assumed the screen was obvious.'],
      ['PLAYER','Let’s watch a new user complete one task and mark the first point where the instructions fail.']
    ],
    choices:[], task:'Guide a first-time user through one safe task and record the first confusing step.',
    evidenceTitle:'First-Use Test', evidenceBody:'The onboarding screen presents technical actions before explaining the purpose, cost, or risk of each action.',
    reward:'Open access starts with helping people understand what they are doing.'
  },
  {
    id:'lost-value-24', n:24, state:'Benue State', city:'makurdi', title:'The Work Nobody Saw',
    goal:'Recover missing contributor credit and establish a fair way to record future work.',
    value:'CREDIT', cast:['Terna'], splitAfter:3,
    dialogue:[
      ['Terna','The product works, but the people who tested and documented it are nowhere in the record.'],
      ['PLAYER','Can we prove who did what?'],
      ['Terna','The review notes and commits are still there. They were never connected to the release.'],
      ['PLAYER','Let’s match the evidence to each contribution and agree how future releases will credit the work.']
    ],
    choices:[], task:'Match review notes and work records to contributors, then publish a corrected contribution log.',
    evidenceTitle:'The Contribution Trail', evidenceBody:'Testing, documentation, and review helped the release but were omitted from the public contribution record.',
    reward:'Not every contribution is code. Good systems recognise the work that makes delivery possible.'
  },
  {
    id:'lost-value-25', n:25, state:'Taraba State', city:'jalingo', title:'The Permission Nobody Read',
    goal:'Help a user inspect an application permission and reduce unnecessary access before connecting an account.',
    value:'PERMISSIONS', cast:['Amina'], splitAfter:3,
    dialogue:[
      ['Amina','This app says it needs access to everything before I can try one small feature.'],
      ['PLAYER','What does the permission actually allow it to do?'],
      ['Amina','The prompt is long, and I cannot tell what happens after I approve it.'],
      ['PLAYER','Let’s inspect the requested access, compare it with the task, and refuse anything we cannot justify.']
    ],
    choices:[], task:'Compare the requested permission with the feature and choose the narrowest access that can complete the task.',
    evidenceTitle:'Permission Review', evidenceBody:'The requested access is broader than the single feature requires. The user has not yet approved it.',
    reward:'A signature is a decision. Understand the permission before you make it.'
  },
  {
    id:'lost-value-26', n:26, state:'Adamawa State', city:'yola', title:'Everything Depends on Something',
    goal:'Recover a project after a key service fails by mapping dependencies and preparing a simple fallback.',
    value:'RESILIENCE', cast:['Joshua'], splitAfter:3,
    dialogue:[
      ['Joshua','The service stopped when one provider went offline. We cannot even tell users when it will return.'],
      ['PLAYER','What depends on that provider?'],
      ['Joshua','Nearly everything. We never documented the backup or how to restore the data.'],
      ['PLAYER','Let’s map the dependency, write the recovery steps, and tell users what is unavailable right now.']
    ],
    choices:[], task:'Map the failed service, identify the affected features, and write a recovery and user-update checklist.',
    evidenceTitle:'The Dependency Map', evidenceBody:'Critical service, data backup, recovery owner, and user communication steps were not documented.',
    reward:'A resilient project plans for failure before it happens.'
  },
  {
    id:'lost-value-27', n:27, state:'Gombe State', city:'gombe', title:'The Person Holding Everything Together',
    goal:'Prevent a community project from collapsing by making maintenance work visible and sustainable.',
    value:'MAINTENANCE', cast:['Lami'], splitAfter:3,
    dialogue:[
      ['Lami','The launch team has moved on. One volunteer is still answering every question and fixing every issue.'],
      ['PLAYER','What happens if that person needs a break?'],
      ['Lami','Nobody else knows the process, and there is no time or budget for maintenance.'],
      ['PLAYER','Let’s list the essential work, share ownership, and agree what the team can realistically maintain.']
    ],
    choices:[], task:'Create a short maintenance rota with named responsibilities, backup contacts, and a realistic workload.',
    evidenceTitle:'The Work After Launch', evidenceBody:'Support, updates, moderation, and recovery depend on one person with no backup or agreed capacity.',
    reward:'Launching is one moment. Keeping something useful alive is ongoing work.'
  },
  {
    id:'lost-value-28', n:28, state:'Yobe State', city:'damaturu', title:'The Internet Is Not Always There',
    goal:'Make an essential task usable on a slow or interrupted connection without hiding transaction status.',
    value:'ACCESSIBILITY', cast:['Zainab'], splitAfter:3,
    dialogue:[
      ['Zainab','The page keeps loading. People here cannot rely on a strong connection all day.'],
      ['PLAYER','Which part must work first?'],
      ['Zainab','Checking the saved order and knowing whether a payment went through.'],
      ['PLAYER','Let’s reduce the page, preserve the order locally, and show a clear pending status until the result is verified.']
    ],
    choices:[], task:'Test the order flow with a simulated slow connection and confirm that saved data and pending status remain clear.',
    evidenceTitle:'The Low-Connection Test', evidenceBody:'The current flow depends on a continuous connection and gives no reliable message when a request is still pending.',
    reward:'Access means designing for the conditions people actually live with.'
  },
  {
    id:'lost-value-29', n:29, state:'Borno State', city:'maiduguri', title:'The Data That Wasn’t Theirs',
    goal:'Resolve a data-sharing dispute by checking consent, purpose, and what information is truly necessary.',
    value:'CONSENT', cast:['Hauwa'], splitAfter:3,
    dialogue:[
      ['Hauwa','The team shared our members’ details with a partner. Nobody asked us.'],
      ['PLAYER','What did the members agree to share?'],
      ['Hauwa','They signed up for event updates, not for their details to be passed around.'],
      ['PLAYER','Let’s record the original consent, stop the unrelated sharing, and tell members what happened and what can be removed.']
    ],
    choices:[], task:'Compare the signup notice with the data shared and prepare a correction and notification record.',
    evidenceTitle:'Consent and Purpose', evidenceBody:'The original signup was for event updates. The later sharing went beyond that stated purpose.',
    reward:'A public ledger does not make private information public property.'
  },
  {
    id:'lost-value-30', n:30, state:'Jigawa State', city:'jigawa', title:'The Record That Looked Perfect',
    goal:'Investigate a flawless digital record against physical evidence before approving a real-world outcome.',
    value:'VERIFICATION', cast:['Sadiq'], splitAfter:3,
    dialogue:[
      ['Sadiq','The register says every delivery arrived. Two farmers say their supplies never came.'],
      ['PLAYER','What can we compare with the register?'],
      ['Sadiq','The signed collection notes and the stock count do not match it.'],
      ['PLAYER','Let’s check the independent records and flag the mismatch instead of accepting a perfect-looking entry.']
    ],
    choices:[], task:'Compare the register with signed collection notes and the stock count, then report any mismatch.',
    evidenceTitle:'The Record Versus the Reality', evidenceBody:'The digital register reports complete delivery, but independent collection and stock records disagree.',
    reward:'A record can be permanent and still be wrong. Verify what it claims.'
  },
  {
    id:'lost-value-31', n:31, state:'Katsina State', city:'katsina', title:'The Missing Piece',
    goal:'Investigate an incomplete allegation fairly without treating missing evidence as proof of guilt.',
    value:'FAIR INVESTIGATION', cast:['Hauwa'], splitAfter:3,
    dialogue:[
      ['Hauwa','The report says someone took the funds, but the transaction history is incomplete.'],
      ['PLAYER','What do we know, and what is still missing?'],
      ['Hauwa','We have one transfer reference and two conflicting statements. We do not have the receiving account record.'],
      ['PLAYER','Let’s preserve what we have, request the missing evidence, and avoid accusing anyone until the facts support it.']
    ],
    choices:[], task:'Separate confirmed facts from claims and list the evidence still needed before reaching a conclusion.',
    evidenceTitle:'Known, Claimed, Missing', evidenceBody:'One reference is available, but the recipient record and full sequence of events have not been verified.',
    reward:'Accountability needs evidence. Fairness means admitting what you do not yet know.'
  },
  {
    id:'lost-value-32', n:32, state:'Kaduna State', city:'kaduna', title:'Who Gets to Change the Rules?',
    goal:'Clarify who has authority to change a digital community’s rules and how urgent changes can be challenged.',
    value:'GOVERNANCE', cast:['Cybersage'], splitAfter:3,
    dialogue:[
      ['Cybersage','The team changed the rules overnight. The community only found out afterward.'],
      ['PLAYER','Who was allowed to make that change?'],
      ['Cybersage','The policy says administrators can act in an emergency, but it never defines an emergency.'],
      ['PLAYER','Let’s write the authority, notice, review window, and appeal path in language everyone can find.']
    ],
    choices:[], task:'Compare the current policy with the change log and draft a clear emergency-change and review process.',
    evidenceTitle:'Authority and Review', evidenceBody:'Emergency powers exist without a clear definition, notice requirement, or review path.',
    reward:'Transparent governance makes power visible and gives people a way to challenge it.'
  },
  {
    id:'lost-value-33', n:33, state:'Sokoto State', city:'sokoto', title:'Open to Everyone. Trusted by Whom?',
    goal:'Help a new community earn participation through clear expectations, respectful moderation, and verifiable work.',
    value:'BELONGING', cast:['Abdul'], splitAfter:3,
    dialogue:[
      ['Abdul','New people join, ask one question, and leave. They say nobody takes them seriously.'],
      ['PLAYER','What happens when someone new needs help?'],
      ['Abdul','The regulars use inside jokes and tell beginners to read everything before asking.'],
      ['PLAYER','Let’s make a welcome route, name a real helper, and give newcomers one useful task they can finish.']
    ],
    choices:[], task:'Create a short newcomer path with a named contact, clear community rules, and one beginner-friendly contribution.',
    evidenceTitle:'The Newcomer Route', evidenceBody:'The community has no clear welcome path, help contact, or low-risk first contribution.',
    reward:'A community becomes open when newcomers have a fair chance to participate.'
  },
  {
    id:'lost-value-34', n:34, state:'Kebbi State', city:'birnin-kebbi', title:'The Fund Everyone Could See',
    goal:'Help a transparent community fund explain its decision process without exposing private applicant information.',
    value:'FAIR FUNDING', cast:['Sani'], splitAfter:3,
    dialogue:[
      ['Sani','Everyone can see the fund balance. People still say the grants are handed to friends.'],
      ['PLAYER','Can the public see how each application was assessed?'],
      ['Sani','They see the winners, but not the criteria or the conflict-of-interest rules.'],
      ['PLAYER','Let’s publish the criteria and decision reasons while keeping applicants’ private details protected.']
    ],
    choices:[], task:'Compare grant decisions against the published criteria and prepare a privacy-respecting decision summary.',
    evidenceTitle:'A Fair Funding Record', evidenceBody:'The balance is visible, but scoring criteria, conflicts of interest, and decision explanations are not.',
    reward:'Transparency is more than showing a balance. It shows how decisions are made.'
  },
  {
    id:'lost-value-35', n:35, state:'Zamfara State', city:'gusau', title:'The Promise of a Shortcut',
    goal:'Help a job seeker verify a paid opportunity and reject a fake recruitment fee without dismissing legitimate training costs.',
    value:'DUE DILIGENCE', cast:['Musa'], splitAfter:3,
    dialogue:[
      ['Musa','They say I have the job if I pay a registration fee today. The salary sounds too good to be true.'],
      ['PLAYER','Can we verify the employer and the role through an independent channel?'],
      ['Musa','The contact only replies from a personal account and will not share the job description.'],
      ['PLAYER','Let’s check the official employer contact, written terms, and what the fee is for before you send anything.']
    ],
    choices:[], task:'Check the employer identity, written job details, and fee explanation; record which claims can be verified.',
    evidenceTitle:'The Opportunity Check', evidenceBody:'The role lacks a verifiable employer contact, a written job description, and a clear explanation for the upfront fee.',
    reward:'An opportunity should survive reasonable questions before you commit.'
  },
  {
    id:'lost-value-36', n:36, state:'Nasarawa State', city:'lafia', title:'Build It Small Enough to Work',
    goal:'Turn the evidence gathered across the journey into a tiny prototype that solves one real problem.',
    value:'PROTOTYPING', cast:['Softstorm'], splitAfter:3,
    dialogue:[
      ['Softstorm','We have seen broken promises, useful ideas, unfair systems, and people trying to start again.'],
      ['PLAYER','We cannot fix all of it with one big launch.'],
      ['Softstorm','Then choose one problem small enough to test and useful enough that somebody would return to it.'],
      ['PLAYER','Let’s build a working first version, ask a real user to try it, and keep the result whether it succeeds or fails.']
    ],
    choices:[], task:'Choose one user problem, assemble a minimal prototype brief, and record a real test result.',
    evidenceTitle:'The Smallest Useful Build', evidenceBody:'The prototype must name one user, one problem, one testable feature, and one observable outcome.',
    reward:'A small working solution is worth more than a giant promise that cannot be tested.'
  },
  {
    id:'lost-value-37', n:37, state:'Federal Capital Territory', city:'abuja', title:'The Room Where Everything Meets',
    goal:'Bring the evidence together in a cross-community review and choose the next action based on what people need.',
    value:'COORDINATION', cast:['Softstorm','IamAbdul','Kenny'], splitAfter:4,
    dialogue:[
      ['IamAbdul','We came here expecting to find one missing project and one person to blame.'],
      ['Kenny','Instead, we found different problems that kept repeating because the work never connected.'],
      ['PLAYER','Can the builders, users, and communities agree on one useful thing to finish together?'],
      ['Softstorm','Only if they share the evidence, make responsibilities clear, and let the people affected judge the result.'],
      ['PLAYER','Then let’s choose one shared problem and set a delivery date everyone can verify.']
    ],
    choices:[], task:'Join the evidence from earlier cities into one shared project brief with owners, milestones, and a public review date.',
    evidenceTitle:'The Shared Build Brief', evidenceBody:'The brief must connect user need, contributor roles, permissions, delivery evidence, maintenance, and a review date.',
    reward:'The next chapter begins when separate efforts become useful work together.'
  },
  {
    id:'lost-value-38', n:38, state:'KitCity', city:'kitcity', title:'What We Build Next',
    goal:'Close the investigation by giving the player agency to choose a practical direction for their next chapter.',
    value:'PLAYER AGENCY', cast:['Softstorm','IamAbdul','Kenny'], splitAfter:4,
    dialogue:[
      ['Kenny','We have no final boss to defeat. The work is still here after the story ends.'],
      ['IamAbdul','You have seen how people create, lose, repair, and share value. What will you do with what you learned?'],
      ['Softstorm','You can explore a career, create something, research a problem, build a tool, or contribute to a community. You do not have to choose the same path forever.'],
      ['PLAYER','Now that I understand the possibilities, what am I going to build?']
    ],
    choices:[], task:'Choose a next-step path—build, create, research, contribute, work, or keep exploring—and save the choice to your journey record.',
    evidenceTitle:'The Next Chapter Is Yours', evidenceBody:'There is no single correct career or guaranteed outcome. Choose a direction, practise safely, and keep evidence of what you create.',
    reward:'Your journey continues beyond the investigation. Build something worth using.',
    finale:true
  }
];
