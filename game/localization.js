/**
 * KitCity's offline UI phrasebook.
 *
 * This module is deliberately data-only: it never rewrites game logic, mission
 * identifiers, HTML markup, or player progress. Unknown copy safely stays in
 * English until an approved translation is added to the catalog.
 */
export const SUPPORTED_LANGUAGES = Object.freeze({
  en: 'English',
  pcm: 'Naija Pidgin',
});

const CATALOG = {
  pcm: {
    'Settings': 'Settings',
    'Language': 'Language',
    'Choose how the game talks to you.': 'Choose how the game go dey talk to you.',
    'English': 'English',
    'Naija Pidgin': 'Naija Pidgin',
    'Hausa': 'Hausa',
    'Yorùbá': 'Yorùbá',
    'Igbo': 'Igbo',
    'Graphics': 'Graphics',
    'High has real sun shadows and cinematic lighting. Low uses fewer pixels and no shadows, so it runs better on older phones.': 'High get real sun shadows and cinematic lighting. Low use fewer pixels and no shadows, so e go run better for older phones.',
    'Switch to High': 'Switch to High',
    'Switch to Low': 'Switch to Low',
    'Music': 'Music',
    'City-based Nigerian music from YouTube. Needs internet.': 'Nigerian music wey match each city from YouTube. Internet dey needed.',
    'Playlist': 'Playlist',
    'Paste any public YouTube playlist link to use your own songs.': 'Paste any public YouTube playlist link make you use your own songs.',
    'Use playlist': 'Use playlist',
    'Skip song': 'Skip song',
    'Default': 'Default',
    'Sound effects': 'Sound effects',
    'Footsteps, chimes and voices.': 'Footsteps, chimes and voices.',
    'How to play': 'How to play',
    'Move with the left stick or WASD. Hold Run or Shift to run. Tap Talk or press E near a glowing person. The arrow points to your goal. Avoid traffic.': 'Move with the left stick or WASD. Hold Run or Shift to run. Tap Talk or press E near person wey dey glow. The arrow show where your goal dey. Avoid traffic.',
    'About the streets': 'About the streets',
    'Street and district names are inspired by real places in each city. The layout is a stylised grid, not a survey map.': 'Street and district names take inspiration from real places for each city. The layout na stylised grid, no be survey map.',
    'Reset progress': 'Reset progress',
    'Erases badges, mission progress and your practice wallet on this device.': 'E go erase badges, mission progress and your practice wallet for this device.',
    'Reset': 'Reset',
    'Yes, erase everything': 'Yes, erase everything',
    'Turn off': 'Turn am off',
    'Turn on': 'Turn am on',
    'On': 'On',
    'Off': 'Off',
    'Talk': 'Talk',
    'Run': 'Run',
    'Pause menu': 'Pause menu',
    'Mission': 'Mission',
    'Resume': 'Continue',
    'Continue': 'Continue',
    'Back': 'Back',
    'Close': 'Close',
    'Cancel': 'Cancel',
    'Accept mission': 'Accept mission',
    'Start mission': 'Start mission',
    'Mission complete': 'Mission don complete',
    'Objective': 'Wetin you need do',
    'Next': 'Next',
    'Skip': 'Skip',
    'Sign in': 'Sign in',
    'Create account': 'Create account',
    'Every city dey teach you something new.': 'Every city dey teach you something new.',
    'Correct answer · +0.10 USDC': 'Correct answer · +0.10 USDC',
    'Wrong answer · −0.10 USDC': 'Wrong answer · −0.10 USDC',
    'Here': 'Here',
    "No wallet yet": "You never get wallet yet",
    "Practice top-up added": "Practice money don add",
    "Street smart": "Street smart",
    "Back on your feet. Watch the traffic.": "You don stand again. Watch traffic.",
    "Finish the previous city journey first": "Finish the last city journey first",
    "Step complete": "You don finish this step",
    "Progress erased": "Progress don clear",
    "Playlist loaded": "Playlist don load",
    "Default playlist": "Default playlist",
    "Could not sign out. Please try again.": "We no fit sign you out. Abeg try again.",
    "What do you do?": "Wetin you go do?",
    "Walk over and ask them": "Go meet them ask question",
    "Stay back and listen a little longer": "Stay back listen small more",
    "YOUR MOVE": "NA YOUR TURN",
    "NEXT OBJECTIVE": "NEXT THING TO DO",
    "REPORT COMPLETE": "REPORT DON COMPLETE",
    "YOUR OBJECTIVE": "WETIN YOU NEED DO",
    "Record evidence": "Save the evidence",
    "Report your findings": "Report wetin you find",
    "Evidence recorded": "Evidence don save",
    "You have returned to report what you found. The evidence is now part of the record.": "You don come back report wetin you find. The evidence don enter the record.",
    "The record has been inspected. Return to the contact and report what you found. Follow the compass arrow.": "You don check the record. Go back meet the contact report wetin you find. Follow the arrow.",
    "You": "You",
    "Create account & enter KitCity": "Create account & enter KitCity",
    "Sign in & enter KitCity": "Sign in & enter KitCity",
    "Continue to KitCity": "Continue to KitCity",
    "Securing your account…": "We dey secure your account…",
    "Restoring your KitCity session…": "We dey restore your KitCity session…",
    "Could not restore your saved session.": "We no fit restore your saved session.",
    "Use 3–20 letters, numbers, or underscores for your gamer ID.": "Use 3–20 letters, numbers, or underscores for your gamer ID.",
    "Enter your email and password to continue.": "Enter your email and password to continue.",
    "Your password must contain at least 8 characters.": "Your password must get at least 8 characters.",
    "That is not a YouTube playlist link": "This no be YouTube playlist link",
    "Reset progress": "Clear progress",
    "Yes, erase everything": "Yes, clear everything",
    "About the streets": "About the streets",
    "Every city dey teach you something new.": "Every city go teach you something new.",
    "Another day. Another transaction. Another promise of something better.": "Another day. Another transaction. Another promise say things go better.",
    "So this T3Kit thing connects all these people?": "So this T3Kit thing dey connect all these people?",
    "That’s what I’m trying to figure out. The same name keeps showing up in places that should have nothing in common.": "Na wetin I dey try understand. The same name dey show for places wey suppose no get anything in common.",
    "Then why does nobody explain what it is?": "Then why nobody dey explain wetin e be?",
    "YOUR THOUGHTS": "WETIN DEY YOUR MIND",
    "T3Kit? You’ve heard the name for the first time today. But something about the way they’re talking makes you want to know more.": "T3Kit? Na today you first hear the name. But the way dem dey talk make you wan know more.",
    "You heard us, abi? Fair enough. We’re trying to understand something ourselves. If you want answers, start with the people connected to it.": "You hear wetin we dey talk, abi? No wahala. We sef dey try understand am. If you want answers, start with people wey connect to am.",
    "I saw that symbol on an old meetup poster too. Same mark. Different place. That can’t be a coincidence.": "I see that symbol for old meetup poster too. Same mark, different place. E no fit be coincidence.",
    "CLUE ACQUIRED: THE T3KIT MARK": "CLUE DON FOUND: THE T3KIT MARK",
    "One name. Two people. No clear answers.": "One name. Two people. No clear answer.",
    "SKIP SCENE ↗": "SKIP SCENE ↗",
    "TAP TO CONTINUE →": "TAP TO CONTINUE →",
    "ENTER THE STORY →": "ENTER THE STORY →",
    "RETURN TO MISSION →": "RETURN TO MISSION →",
    "THE LOST VALUE · LAGOS": "THE LOST VALUE · LAGOS",
    "THE LOST VALUE · A CONVERSATION": "THE LOST VALUE · CONVERSATION",
    "LAGOS · A CONVERSATION": "LAGOS · CONVERSATION",
    "KitCity story scene": "KitCity story scene",
    "The First Promise": "Di First Promise",
    "The Price of Trust": "Wetin Trust Cost",
    "The Empty Promise": "Promise Wey Empty",
    "The People Who Built It": "People Wey Build Am",
    "Who Owns the Work?": "Who Get Di Work?",
    "The Exit": "Di Way Out",
    "The Community That Disappeared": "Di Community Wey Disappear",
    "The Numbers Game": "Di Number Game",
    "The Open Door": "Open Door",
    "Building for Nobody": "Building for Nobody",
    "The People Left Behind": "People Wey Dem Leave Behind",
    "The Rules for Everyone": "Rules for Everybody",
    "The Cost of Starting Over": "Wetin E Cost to Start Again",
    "The Things Worth Keeping": "Things Wey Worth to Keep",
    "The Lost Value": "Di Value Wey Lost",
    "Inspect the original promise noticeboard and return to Softstorm.": "Check the first promise board, then go back meet Softstorm.",
    "Review the project page and identify the missing delivery evidence.": "Check the project page and find the proof say dem deliver wetin dem promise.",
    "Test the demo and record which promised features actually work.": "Test the demo and write down the features wey really dey work.",
    "Review the contribution record and submit a public report naming the original contributors.": "Check who contribute and publish report wey name the people wey start am.",
    "Inspect the project permissions and identify a promised right the community never received.": "Check the project permissions and find the right dem promise but community never get.",
    "Compare public statements with the verified transaction history and record the evidence.": "Compare wetin dem talk publicly with verified transaction history, then save the proof.",
    "Recover archived proposals, identify three unfinished ideas, and select one realistic proposal to complete.": "Bring back old proposals, find three ideas wey never finish, and choose one wey fit work.",
    "Review the dashboard and select a measure that reflects actual product use.": "Check the dashboard and choose one measure wey show how people really dey use the product.",
    "Complete a transaction walkthrough and identify the action, cost, and risk.": "Follow the transaction steps and identify wetin to do, the cost, and the risk.",
    "Interview potential users and match one practical feature to a real problem.": "Talk to people wey fit use am and match one useful feature to real problem.",
    "Record the business owner’s needs and propose a practical feature with a clear user benefit.": "Write wetin the business owner need and suggest one feature wey go help users clearly.",
    "Compare the community vote with the administrative action and publish a clear summary of the process.": "Compare community vote with wetin admins do, then publish clear summary.",
    "Test the product and publish a transparent update explaining what is complete and unfinished.": "Test the product and publish clear update of wetin don finish and wetin remain.",
    "Place the recovered evidence on the archive wall and choose the value the next stage should emphasise.": "Put the evidence wey you recover for archive wall and choose the value wey next stage suppose focus on.",
    "Place the final evidence on the archive wall and review the connections between the 15 missions.": "Put the final evidence for archive wall and check how the 15 missions connect.",
    "The Original Promise": "Di Original Promise",
    "Project Promise Record": "Project Promise Record",
    "Product Demo Review": "Product Demo Review",
    "Contribution Record": "Contribution Record",
    "Ownership and Access Audit": "Ownership and Access Check",
    "Public Claims and Transaction Record": "Public Claims and Transaction Record",
    "Archived Community Proposals": "Old Community Proposals",
    "Project Metrics Review": "Project Metrics Review",
    "First-Time User Transaction": "First-Time User Transaction",
    "User Needs Record": "User Needs Record",
    "Local Business Needs": "Wetin Local Business Need",
    "Governance Decision Record": "Governance Decision Record",
    "Public Progress Record": "Public Progress Record",
    "The Evidence Wall": "Di Evidence Wall",
    "Introduce the original promise of Web3 through a real problem, rather than a lecture.": "Show wetin Web3 promise through real problem, no be lecture.",
    "Show how trust can be exploited when people rely on reputation instead of evidence.": "Show how person fit use trust take cheat people when dem believe reputation pass proof.",
    "Explore the difference between speculation and real utility.": "Show the difference between guesswork and real use.",
    "Reveal how contributors can create value without receiving recognition, ownership, or fair rewards.": "Show how people fit build value but dem no give dem credit, ownership, or fair reward.",
    "Distinguish between owning a token, controlling a system, and having meaningful ownership.": "Know the difference between holding token, controlling system, and truly owning something.",
    "Explore extractive behaviour and the consequences of treating communities as sources of money.": "See wetin happen when project use community collect money and abandon dem.",
    "Show how communities become disposable when engagement matters more than people.": "Show how community dey get abandoned when project care more about activity than people.",
    "Show how activity metrics can hide the absence of meaningful progress.": "Show how plenty numbers fit hide say real progress no dey.",
    "Explore the original promise of access and how complicated systems can exclude the people they claim to serve.": "Show how complicated systems fit lock out the same people dem promise to help.",
    "Reveal what happens when projects prioritise trends over actual human problems.": "Show wetin happen when project follow trend instead of solve real people problem.",
    "Connect Web3’s promises to practical opportunities beyond trading and speculation.": "Connect Web3 promise to real opportunities beyond trading and guesswork.",
    "Explore transparency, fair rules, and the danger of systems where powerful insiders are exempt from accountability.": "Show why clear rules and fairness matter, and why powerful people must answer for their actions too.",
    "Show the long-term damage caused when people lose trust in an entire ecosystem because of repeated failures.": "Show the long-term damage when repeated failures make people stop trusting the whole ecosystem.",
    "Bring together the values discovered across the previous missions and make the player consider what should be rebuilt.": "Bring together wetin the missions teach and choose wetin suppose rebuild next.",
    "Close the first playable arc, connect the evidence, and establish the larger journey through the remaining states.": "Close this first part, connect the proof, and set up the bigger journey through the other states.",
    "THE ORIGINAL PROMISE: Own what you create. Participate without asking permission from a gatekeeper. Verify what you can. Build things people can use. LAST UPDATED: UNKNOWN.": "THE ORIGINAL PROMISE: Own wetin you create. Join in without begging gatekeeper for permission. Verify wetin you fit. Build things people fit use. LAST UPDATED: UNKNOWN.",
    "Thousands of future users. Major partnerships. Guaranteed community rewards. Verified work: insufficient evidence.": "Thousands of future users. Big partnerships. Guaranteed community rewards. Verified work: proof no reach.",
    "Announced features: 8. Working features: 2. Verified user benefit: limited.": "Features dem announce: 8. Features wey work: 2. Verified benefit to users: small.",
    "Product design: Goodness. Testing and documentation: Semi. Early development: community contributors. Current control: restricted.": "Product design: Goodness. Testing and documentation: Semi. Early development: community people. Current control: limited.",
    "Token holders: 4,800. Administrators: 2. Community proposals accepted: 0. Critical settings: controlled by admin.": "Token holders: 4,800. Admins: 2. Community proposals accepted: 0. Important settings: na admin control.",
    "Public message: “We are here for the long term.” Verified transaction: large position sold before a major announcement. The record shows timing, not by itself proof of a crime.": "Public message: “We dey here for long term.” Verified transaction: big position sold before major announcement. Timing alone no prove crime.",
    "The community recorded ideas but did not track delivery or lasting user benefit.": "Community write ideas down but dem no track delivery or long-term benefit.",
    "Registered accounts: 10,000. Active users: unknown. Repeat usage: unknown. Completed tasks: unverified. Real-world outcomes: not measured.": "Registered accounts: 10,000. Active users: unknown. Repeat use: unknown. Completed tasks: no verify. Real-world results: no measure.",
    "The transaction prompt shows technical details without clearly explaining what the user is approving.": "The transaction prompt show technical details but e no clearly explain wetin user dey approve.",
    "Three potential users described different needs: small-business payment tracking, skills that lead to paid work, and checking whether an investment opportunity is legitimate.": "Three potential users talk about different needs: tracking small business payments, skills for paid work, and checking if investment opportunity legit.",
    "The business owner needs an understandable, affordable way to track payments and orders.": "Business owner need simple and affordable way to track payments and orders.",
    "Community vote: change rejected. Administrative action: change approved. Notice before vote: unclear. Explanation after vote: incomplete.": "Community vote: change rejected. Admin action: change approved. Notice before vote: no clear. Explanation after vote: no complete.",
    "Core feature: working. Documentation: available. Project progress: public. User feedback: limited.": "Main feature dey work. Documentation dey available. Project progress dey public. User feedback small.",
    "Ownership without control. Community without contribution. Access without understanding. Growth without usefulness. Trust without accountability. Promises without delivery.": "Ownership without control. Community without contribution. Access without understanding. Growth without real use. Trust without accountability. Promise without delivery.",
    "The First Promise. The Price of Trust. The Empty Promise. The People Who Built It. Who Owns the Work? The Exit. The Community That Disappeared. The Numbers Game. The Open Door. Building for Nobody. The People Left Behind. The Rules for Everyone. The Cost of Starting Over.": "Di First Promise. Wetin Trust Cost. Promise Wey Empty. People Wey Build Am. Who Get Di Work? Di Way Out. Di Community Wey Disappear. Di Number Game. Open Door. Building for Nobody. People Wey Dem Leave Behind. Rules for Everybody. Wetin E Cost to Start Again.",
    "EMAIL ADDRESS": "EMAIL WEY YOU DEY USE",
    "PASSWORD": "PASSWORD / SECRET WORD",
    "PLAYER USERNAME": "YOUR GAMER NAME",
    "Account action": "Account action",
    "Choose language": "Choose language",
    "3–20 letters, numbers, or underscores. Your username is your public gamer ID.": "3–20 letters, numbers, or underscores. Your username na your public gamer ID.",
    "Share approximate location (optional)": "Share approximate location (optional)",
    "Your app-generated device ID helps recognize this installation. Location is only requested if you opt in and is stored at approximate precision.": "Your app-generated device ID dey help recognize this installation. We go only ask location if you agree, and we store am as approximate location.",
    "Take KitCity with you": "Carry KitCity go with you",
    "Install the game on your home screen for a faster, app-like experience.": "Install the game for your home screen make e feel like app and run faster.",
    "Install": "Install",
    "Dismiss install prompt": "Close install prompt",
    "Loading city…": "City dey load…",
    "Preparing your city": "We dey prepare your city",
    "Loading": "Loading",
    "The 3D engine did not load. Check your connection and reload the page.": "The 3D engine no load. Check your connection and reload the page.",
    "Game menu": "Game menu",
    "Activity": "Activity",
    "Sign out": "Sign out",
    "Player health: 3 of 3 hearts": "Player health: 3 of 3 hearts",
    "Confirm": "Confirm",
    "Save": "Save",
    "Done": "Done",
    "Retry": "Try again",
    "Try again": "Try again",
    "Email address": "Email address",
    "At least 8 characters": "At least 8 characters",
    "e.g. KitExplorer": "e.g. KitExplorer",
    "Forgot password?": "Forgot password?",
    "Player username": "Player username",
    "Your objective": "Wetin you need do",
    "Loading mission…": "Mission dey load…",
    "Finding your way…": "We dey find road…",
    "Mission accepted": "You don accept mission",
    "Mission failed": "Mission no succeed",
    "Reward received": "Reward don land",
    "Badge earned": "You don earn badge",
    "Progress saved": "Progress don save",
    "Create a wallet, receive USDC and make your first payment.": "Create wallet, receive USDC and make your first payment.",
    "Learn rates, fees and slippage by swapping USDC for a naira token.": "Learn rates, fees and slippage by swapping USDC for a naira token.",
    "Recognise phishing, fake support and fake airdrops before they cost you.": "Recognise phishing, fake support and fake airdrops before they cost you.",
    "Learn what a recovery phrase is and how to keep it safe.": "Learn what a recovery phrase is and how to keep it safe.",
    "Check addresses properly and send a small test first.": "Check addresses properly and send a small test first.",
    "Understand signing messages and why unlimited approvals are risky.": "Understand signing messages and why unlimited approvals are risky.",
    "Learn how community votes work and how to read a proposal.": "Learn how community votes work and how to read a proposal.",
    "Sell USDC for naira with a peer, and never release before you are paid.": "Sell USDC for naira with a peer, and never release before you are paid.",
    "Receive your first payment": "Collect your first payment",
    "Give the right address, match the network, and send a real payment on it.": "Give the right address, match the network, and send a real payment on it.",
    "Prove a bounty deliverable": "Prove a bounty deliverable",
    "Submit a verifiable work reference, match it to the bounty requirements, and confirm the payout record.": "Submit a verifiable work reference, match it to the bounty requirements, and confirm the payout record.",
    "Get paid in a stablecoin": "Get paid in a stablecoin",
    "Choose the stable pay option, sell USDC on the right network, and keep savings safe.": "Choose the stable pay option, sell USDC on the right network, and keep savings safe.",
    "Check a token before buying": "Check a token before buying",
    "Verify a token’s official contract, network and market details before deciding whether to buy.": "Verify a token’s official contract, network and market details before deciding whether to buy.",
    "Pay the supplier on-chain": "Pay the supplier on-chain",
    "Pay a supplier on the right network, then prove the payment with its transaction ID.": "Pay a supplier on the right network, then prove the payment with its transaction ID.",
    "I did everything they told me to do. Connected my wallet, paid the fee, joined the group. Now the project has disappeared.": "I do everything wey dem tell me. Connect my wallet, pay fee, join group. Now the project don disappear.",
    "You people always say DYOR after everything don finish.": "Una always talk DYOR after everything don spoil.",
    "What happened to them?": "Wetin happen to dem?",
    "Same thing that keeps happening. Somebody promises people an opportunity. People trust the promise. Then everybody starts looking for somebody else to blame.": "Na the same thing wey dey happen. Person promise people opportunity. People trust the promise. Then everybody begin find who to blame.",
    "So Web3 is a scam?": "So Web3 na scam?",
    "If everything was a scam, people wouldn’t still be here trying to build something useful.": "If everything na scam, people no go still dey here try build something wey get use.",
    "But if the good ones keep promising and the bad ones keep collecting, how is anybody supposed to know the difference?": "But if good people dey promise and bad people dey collect money, how person go know the difference?",
    "That’s the question we should be asking.": "Na that question we suppose dey ask.",
    "These promises sound good. So what went wrong?": "These promises sound good. So wetin go wrong?",
    "Maybe people stopped caring about the promises.": "Maybe people stop to care about the promises.",
    "Or maybe they discovered they could make more money selling the promise than keeping it.": "Or maybe dem discover say dem fit make more money selling the promise than keeping am.",
    "Don’t decide who’s right yet. Find out what happened to the people who believed in it.": "No decide who dey right yet. Find out wetin happen to the people wey believe am.",
    "You cannot restore something you don’t understand.": "You no fit restore wetin you no understand.",
    "You told everybody the project was safe.": "You tell everybody say the project safe.",
    "I shared what the founder told me. I didn’t know they were going to disappear.": "I share wetin the founder tell me. I no know say dem go disappear.",
    "But people trusted you. Some of them used their school money.": "But people trust you. Some of dem use their school fees.",
    "And you think I don’t know that?": "You think say I no know that?",
    "What happened here?": "Wetin happen here?",
    "A project promised to fund local builders. People contributed money, ideas, and time. When it was time to deliver, the team vanished.": "One project promise to fund local builders. People contribute money, ideas and time. When na time to deliver, the team disappear.",
    "And now Joseph says he didn’t know.": "And now Joseph talk say e no know.",
    "Because I didn’t!": "Because I no know!",
    "Did anyone check the project before contributing?": "Anybody check the project before dem contribute?",
    "We checked their page. Their followers. Their partners. They had testimonials.": "We check their page, followers and partners. Dem get testimonials.",
    "Even people we respected vouched for them.": "Even people we respect vouch for dem.",
    "But did anyone verify what they had actually built?": "But anybody verify wetin dem actually build?",
    "I thought trusting the right people was enough.": "I think say to trust the right people go don do.",
    "Trusting people isn’t the problem. Making trust a substitute for evidence is.": "To trust people no be the problem. The problem na to use trust take replace evidence.",
    "So we should trust nobody?": "So we no suppose trust anybody?",
    "No. Ask better questions. Give people room to prove themselves. And don’t confuse popularity with proof.": "No. Ask better questions. Give people chance to prove themselves. No mix popularity with proof.",
    "Ask Joseph to show the original project records": "Ask Joseph make e show the original project records",
    "Ask Larai to show the evidence collected by the community": "Ask Larai make she show the evidence wey community collect",
    "Trust matters. Evidence matters too.": "Trust matter. Evidence matter too.",
    "MISSION UNLOCKED": "MISSION DON UNLOCK",
    "THE FIRST PROMISE": "DI FIRST PROMISE",
    "Lagos State": "Lagos State",
    "Record Center": "Record Center",
    "RECORD CENTER": "RECORD CENTER",
    "FIELD ARCHIVE": "FIELD ARCHIVE",
    "FIELD REPORT": "FIELD REPORT",
    "EVIDENCE RECORDED": "EVIDENCE DON SAVE",
    "Return and report": "Come back report",
    "FIRST MOVE": "FIRST MOVE",
    "Follow the arrow. Talk with the person you find.": "Follow the arrow. Talk to the person wey you find.",
    "Follow the arrow and watch for traffic.": "Follow the arrow and watch traffic.",
    "Mission paused": "Mission pause",
    "City journey completed": "City journey don complete",
    "All missions complete": "All missions don complete",
    "The journey continues.": "The journey go continue.",
    "THE LOST VALUE": "DI VALUE WEY LOST",
    "THE ONE WITH THE CARD": "DI PERSON WEY GET THE CARD",
    "THE ONE WHO HEARD IT FIRST": "DI PERSON WEY FIRST HEAR AM",
    "EXPLORE NIGERIA": "EXPLORE NIGERIA",
    "CITY NETWORK": "CITY NETWORK",
    "Unlocked": "Unlocked",
    "Completed": "Don complete",
    "Locked": "Locked",
    "Tap a labelled city to explore": "Tap city name make you explore",
    "City Map": "City Map",
    "SELECTED CITY": "CITY WEY YOU SELECT",
    "cities": "cities",
    "Mission badges": "Mission badges",
    "Journey progress": "Journey progress",
    "Missions complete": "Missions don complete",
    "City journeys complete": "City journeys don complete",
    "Wallet": "Wallet",
    "Address": "Address",
    "Naira token": "Naira token",
    "View certificate": "View certificate",
    "THE FINAL DESTINATION": "DI FINAL DESTINATION",
    "T3Kit Hub": "T3Kit Hub",
    "LEARN": "LEARN",
    "BUILD": "BUILD",
    "VERIFY": "VERIFY",
    "CONTRIBUTE": "CONTRIBUTE",
    "No active story mission here yet": "No active story mission here yet",
    "This city remains on the KitCity map. Its current story mission will appear here when it is part of the active arc.": "This city still dey for KitCity map. The story mission go show here when e enter the active story.",
    "Up to +0.50 USDC": "Up to +0.50 USDC",
    "Replay": "Play again",
    "Play": "Play",
    "Finish mission": "Finish mission",
    "PROLOGUE": "PROLOGUE",
    "MISSION": "MISSION",
    "FINAL DESTINATION · T3Kit Hub": "FINAL DESTINATION · T3Kit Hub",
    "CITY JOURNEY": "CITY JOURNEY",
    "ACHIEVEMENT EARNED": "ACHIEVEMENT DON EARN",
    "NOT EARNED YET": "NEVER EARN AM YET",
    "Pause": "Pause",
    "Paused": "Pause don happen",
    "Certificate": "Certificate",
    "Explore": "Explore",
    "City journey": "City journey",
    "Continue journey": "Continue journey",
    "All missions": "All missions",
    "Prototype: wallets, balances and payments are simulated. Rates are samples. Nothing here is financial advice.": "Na prototype: wallet, balance and payment na practice only. Rates na sample. This no be financial advice.",
    "Welcome! This is the next generation of decentralized community infrastructure.": "Welcome! Na the next generation of decentralized community infrastructure be this.",
    "Nice presentation. Can I use it?": "Fine presentation. I fit use am?",
    "The full release is coming soon.": "The full release go soon land.",
    "What about the current version?": "Wetin about the version wey dey now?",
    "We’re still polishing it.": "We still dey polish am.",
    "And the version before this one?": "And the version before this one nko?",
    "That was a test.": "Na test that one be.",
    "And the one before that?": "And the one before that nko?",
    "An early experiment.": "Na early experiment.",
    "At this point, even the experiments are in beta.": "As e be now, even the experiments still dey beta.",
    "Why keep announcing products that aren’t ready?": "Why una dey announce products wey never ready?",
    "Attention is difficult to get. If we wait until everything is perfect, nobody will notice us.": "Attention hard to get. If we wait make everything perfect, nobody go notice us.",
    "Nobody is asking you to be perfect. We’re asking you to make something that works.": "Nobody dey ask you to perfect. We dey ask you make something wey work.",
    "You think it’s that simple? Builders need funding. Funding needs attention. Attention comes from announcements.": "You think say e simple like that? Builders need funding. Funding need attention. Attention dey come from announcements.",
    "Then what happens when the announcements become the product?": "Then wetin go happen when announcements turn to the product?",
    "There’s nothing wrong with raising money for something you’re building. But people need to know what exists now and what’s still a promise.": "Nothing bad dey about raising money for wetin you dey build. But people need know wetin dey now and wetin still be promise.",
    "If I tell people the truth about how early the product is, they might leave.": "If I tell people the truth say the product still early, dem fit leave.",
    "And if you don’t tell them, they might never trust another builder again.": "And if you no tell dem, dem fit never trust another builder again.",
    "We built the first version in three months.": "We build the first version in three months.",
    "Four months.": "Four months.",
    "Four months, then. We worked every weekend. Some of us paid for tools ourselves.": "Okay, four months. We work every weekend. Some of us pay for tools from our pocket.",
    "What happened?": "Wetin happen?",
    "The project started making money. Then the founder changed the access permissions.": "The project start to make money. Then the founder change who fit access am.",
    "Our names disappeared from the credits. The people who built the product couldn’t even update it anymore.": "Our names disappear from the credits. The people wey build the product no fit update am again.",
    "Did you agree to give up control?": "Una agree to give up control?",
    "No.": "No.",
    "We thought contributing meant we were building something together.": "We think say contributing mean say we dey build something together.",
    "But the people controlling the system got to decide what our contributions meant.": "But na the people wey control the system decide wetin our contribution mean.",
    "Does contributing mean you automatically own part of a project?": "If you contribute, e mean say you automatically own part of the project?",
    "No. Agreements matter. Some people contribute for payment, some for experience, some because they believe in the mission.": "No. Agreement matter. Some people contribute for payment, some for experience, some because dem believe the mission.",
    "But people should know what they’re agreeing to before they give their time away.": "But people suppose know wetin dem dey agree to before dem give their time.",
    "And if the agreement changes?": "And if the agreement change nko?",
    "Then the people affected deserve a say. At the very least, they deserve the truth.": "Then the people wey e affect deserve to talk. At least, dem deserve the truth.",
    "The community owns this project.": "Na community own this project.",
    "Then why can’t the community change anything?": "Then why community no fit change anything?",
    "Because the admin controls the permissions.": "Because na admin dey control permissions.",
    "Who controls the admin?": "Who dey control the admin?",
    "What exactly does the community own?": "Wetin exactly community own?",
    "People bought the token because they believed they were part of something.": "People buy the token because dem believe say dem be part of something.",
    "Owning a token and controlling a system aren’t automatically the same thing.": "To own token no automatically mean say you control the system.",
    "So the token means nothing?": "So the token no mean anything?",
    "That’s not what I’m saying. A token can give access, rights, or a role in governance. But those rights have to exist in practice.": "No be wetin I dey talk. Token fit give access, rights, or role for governance. But those rights must really dey work.",
    "Then the real question isn’t just who owns the token.": "Then the real question no be only who own the token.",
    "It’s what ownership allows them to do.": "Na wetin the ownership allow dem do.",
    "You said you were building with us.": "You talk say you dey build with us.",
    "I was.": "I dey.",
    "Then why did you sell everything the moment the price went up?": "Then why you sell everything as price rise?",
    "I invested my money. I’m allowed to sell.": "Na my money I invest. I fit sell am.",
    "You told people to hold because you believed in the project!": "You tell people make dem hold because you believe the project!",
    "I did believe in it. That doesn’t mean I can’t take profit.": "I believe am. That no mean say I no fit take profit.",
    "Did you tell them you were planning to sell?": "You tell dem say you plan to sell?",
    "People act like taking profit is a crime. Nobody owes you a green chart.": "People dey behave like taking profit na crime. Nobody owe you green chart.",
    "Taking profit isn’t the issue. Encouraging people to trust your long-term commitment while hiding information that changes the situation is the issue.": "Taking profit no be the problem. The problem na to make people trust your long-term commitment while you hide information wey fit change the matter.",
    "Everybody is responsible for their own money.": "Everybody responsible for their own money.",
    "True. But responsibility doesn’t disappear just because somebody else made a decision.": "True. But responsibility no disappear just because another person make decision.",
    "So what do you want me to do?": "So wetin you want make I do?",
  },
};

const NORMALIZED = Object.fromEntries(
  Object.entries(CATALOG).map(([language, entries]) => [
    language,
    new Map(Object.entries(entries).map(([source, translated]) => [source.trim(), translated])),
  ]),
);
const NORMALIZED_FOLDED = Object.fromEntries(
  Object.entries(NORMALIZED).map(([language, entries]) => [
    language,
    new Map([...entries.entries()].map(([source, translated]) => [source.toLocaleLowerCase(), translated])),
  ]),
);

export function translateText(value, language = 'en') {
  const original = String(value ?? '');
  if (!original || language === 'en' || !NORMALIZED[language]) return original;
  const match = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match) return original;
  const source = match[2];
  let translated = NORMALIZED[language].get(source);
  if (translated === undefined) translated = NORMALIZED_FOLDED[language].get(source.toLocaleLowerCase());
  if (translated === undefined) return original;
  // Headings are often uppercased at render time (for cinematic cards and
  // mission markers). Match that presentation without duplicating every key.
  if (source && source === source.toLocaleUpperCase() && /[A-Z]/i.test(source)) {
    translated = translated.toLocaleUpperCase();
  }
  return match[1] + translated + match[3];
}

/**
 * Translate only text between HTML tags. Markup, attributes, IDs, URLs,
 * mission keys and embedded game data are left untouched.
 */
export function translateHTML(html, language = 'en') {
  if (!html || language === 'en' || !NORMALIZED[language]) return html;
  return html.replace(/(^|>)([^<>]+)(?=<|$)/g, (whole, prefix, text) => prefix + translateText(text, language));
}


/*
 * Translate only known text, never markup or game state. Original text is kept
 * per node/attribute so switching languages is reversible and does not stack
 * translations. Unknown copy remains intact until a reviewed translation is
 * added to CATALOG.
 */
const nodeSources = new WeakMap();
const attributeSources = new WeakMap();
const TRANSLATABLE_ATTRIBUTES = ['aria-label', 'title', 'placeholder', 'alt'];
const SKIP_TEXT_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'TEXTAREA', 'OPTION']);

function translateTextNode(node, language) {
  if (!node || node.nodeType !== 3 || !node.parentElement) return;
  if (node.parentElement.closest('[data-no-translate],script,style,noscript,code,pre,textarea,[contenteditable="true"]')) return;
  const current = node.nodeValue || '';
  if (!current.trim()) return;
  const prior = nodeSources.get(node);
  const source = prior && current === prior.rendered ? prior.source : current;
  const rendered = translateText(source, language);
  if (current !== rendered) node.nodeValue = rendered;
  nodeSources.set(node, { source, rendered });
}

function translateElementAttributes(element, language) {
  if (!element || element.nodeType !== 1 || element.closest('[data-no-translate]')) return;
  const names = TRANSLATABLE_ATTRIBUTES.slice();
  if (element.matches('button,input[type="button"],input[type="submit"],input[type="reset"]')) names.push('value');
  for (const name of names) {
    if (!element.hasAttribute(name)) continue;
    const current = element.getAttribute(name) || '';
    if (!current.trim()) continue;
    let perElement = attributeSources.get(element);
    if (!perElement) { perElement = new Map(); attributeSources.set(element, perElement); }
    const prior = perElement.get(name);
    const source = prior && current === prior.rendered ? prior.source : current;
    const rendered = translateText(source, language);
    if (current !== rendered) element.setAttribute(name, rendered);
    perElement.set(name, { source, rendered });
  }
}

export function translateDOM(root, language = 'en') {
  if (!root) return { translated: 0, unchanged: 0 };
  const doc = root.ownerDocument || (root.nodeType === 9 ? root : null);
  if (!doc || typeof doc.createTreeWalker !== 'function') return { translated: 0, unchanged: 0 };
  let translated = 0, unchanged = 0;
  const visitElement = element => {
    const before = element.textContent;
    translateElementAttributes(element, language);
    const walker = doc.createTreeWalker(element, 4);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    for (const textNode of nodes) {
      const oldValue = textNode.nodeValue;
      translateTextNode(textNode, language);
      if (textNode.nodeValue !== oldValue) translated++;
      else unchanged++;
    }
    return before;
  };
  if (root.nodeType === 1 || root.nodeType === 9) {
    if (root.nodeType === 1) translateElementAttributes(root, language);
    const elementWalker = doc.createTreeWalker(root, 1);
    let element;
    while ((element = elementWalker.nextNode())) translateElementAttributes(element, language);
    const textWalker = doc.createTreeWalker(root, 4);
    let node;
    while ((node = textWalker.nextNode())) {
      const oldValue = node.nodeValue;
      translateTextNode(node, language);
      if (node.nodeValue !== oldValue) translated++;
      else unchanged++;
    }
  }
  return { translated, unchanged };
}

export function observeLocalization(root, getLanguage) {
  if (!root || typeof MutationObserver === 'undefined') return { disconnect() {} };
  const languageNow = () => {
    try { return typeof getLanguage === 'function' ? getLanguage() : 'en'; }
    catch (_) { return 'en'; }
  };
  const apply = node => {
    if (!node) return;
    if (node.nodeType === 3) translateTextNode(node, languageNow());
    else if (node.nodeType === 1) translateDOM(node, languageNow());
  };
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') apply(record.target);
      if (record.type === 'attributes') translateElementAttributes(record.target, languageNow());
      if (record.type === 'childList') record.addedNodes.forEach(apply);
    }
  });
  observer.observe(root, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: TRANSLATABLE_ATTRIBUTES.concat(['value'])
  });
  translateDOM(root, languageNow());
  return observer;
}

/** Returns a phrase-level report; unknown phrases are intentionally not guessed. */
export function auditLocalization(phrases, language) {
  const list = Array.from(phrases || [], value => String(value ?? '').trim()).filter(Boolean);
  const translated = list.filter(value => language === 'en' || (NORMALIZED[language] && NORMALIZED[language].has(value)));
  return {
    language,
    total: list.length,
    translated: translated.length,
    missing: list.filter(value => language !== 'en' && (!NORMALIZED[language] || !NORMALIZED[language].has(value))),
    percent: list.length ? Math.round((translated.length / list.length) * 100) : 100
  };
}
