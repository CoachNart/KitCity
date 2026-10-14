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
    "The city is full of people chasing opportunities. But what makes an opportunity worth believing in?": "The city full of people wey dey chase opportunity. But wetin make opportunity worth believing?",
    "Everybody is talking about Web3. Tokens, projects, new platforms. But what are people actually building with all this?": "Everybody dey talk about Web3. Tokens, projects, new platforms. But wetin people really dey build with all this?",
    "There’s real potential here. People can learn new skills, build products, find work, create together, and solve problems that matter.": "Real potential dey here. People fit learn new skills, build products, find work, create together, and solve problems wey matter.",
    "Then why does the conversation always come back to hype and price?": "Then why the conversation dey always come back to hype and price?",
    "You’ve heard the promises too. You want to see what this world can actually offer—and what happens when people forget why they started.": "You don hear the promises too. You wan see wetin this world fit really offer—and wetin happen when people forget why dem start.",
    "Softstorm and IamAbdul are still talking. What do you do?": "Softstorm and IamAbdul still dey talk. Wetin you go do?",
    "Walk over and join the conversation": "Go meet dem join the conversation",
    "Listen a little longer before speaking": "Listen small more before you talk",
    "Sorry, I caught part of that. I’m curious too—what does building something useful in Web3 actually look like?": "Sorry, I hear small part of wetin una talk. I dey curious too—how e really look to build something useful for Web3?",
    "I was wondering the same thing. Everybody has a pitch. I want to see what people can really do with it.": "Na the same thing I dey wonder. Everybody get pitch. I wan see wetin people fit really do with am.",
    "That’s a fair question. 3Kit is an ecosystem designed to give people different ways into Web3: learning, exploring career paths, building, creating, and using tools that can make trading easier to understand.": "Na fair question. 3Kit na ecosystem wey give people different ways to enter Web3: to learn, explore career paths, build, create, and use tools wey fit make trading easier to understand.",
    "And KitaKage is the gaming side of that ecosystem, right? A place to explore and discover how these ideas connect to real people and real choices.": "And KitaKage na the gaming side of the ecosystem, abi? Place to explore and see how these ideas connect to real people and real choices.",
    "Then why call this story The Lost Value?": "Then why dem call this story The Lost Value?",
    "Because value was never just a token price. It was what people could learn, what they could create, the problems they could solve, and the opportunities they could open for others.": "Because value no be token price alone. Na wetin people fit learn, wetin dem fit create, problems dem fit solve, and opportunities dem fit open for others.",
    "We can have more projects, more money, and more attention—and still lose sight of what made any of it worthwhile.": "We fit get more projects, more money, and more attention—and still forget wetin make everything worth am.",
    "THE LOST VALUE": "DI VALUE WEY LOST",
    "Learn. Build. Create. Contribute. The journey begins with one question: are we making something valuable for people, or have we become distracted by everything around it?": "Learn. Build. Create. Contribute. The journey start with one question: we dey make something wey get value for people, or we don lose focus because of everything around am?",
    "PROLOGUE COMPLETE": "PROLOGUE DON COMPLETE",
    "Your first lead is waiting in Lagos. Find out what people were promised—and what they actually received.": "Your first lead dey wait for Lagos. Find out wetin people promise dem—and wetin dem really receive.",
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
    "At one point, you couldn’t find a seat in here.": "There was a time wey you no fit even find seat for here.",
    "Events every week. Spaces every night. Everybody had something to say.": "Event every week. Space every night. Everybody get something to talk.",
    "The rewards stopped.": "The rewards stop.",
    "And most of the people stopped showing up.": "And most people stop to show face.",
    "Some of them were only here for the rewards. But others were here because they thought they were part of something.": "Some people dey here only because of the rewards. But others dey here because dem think say dem be part of something.",
    "Did the community ever decide what it wanted to build?": "The community ever decide wetin e wan build?",
    "We had ideas. Lots of them.": "We get plenty ideas.",
    "But the team measured success by how many people showed up, how many messages were posted, and how many people shared announcements.": "But the team measure success by how many people show face, how many messages dem post, and how many people share announcements.",
    "We were busy looking active.": "We dey busy trying to look active.",
    "We never stopped to ask whether any of it was useful.": "We never stop ask whether any of am dey useful.",
    "So the community wasn’t necessarily fake.": "So the community no necessarily be fake.",
    "No. The people were real. Their time was real. But nobody built a system that turned that energy into lasting value.": "No. The people real. Their time real. But nobody build system wey turn that energy to value wey go last.",
    "Look at this. Ten thousand users. Fifty thousand transactions. The project is growing.": "See this. Ten thousand users. Fifty thousand transactions. The project dey grow.",
    "How many people came back this month?": "How many people come back this month?",
    "We have the total registrations here.": "We get the total registrations here.",
    "That’s not what I asked.": "No be that I ask.",
    "How many people actually use the product?": "How many people really dey use the product?",
    "We haven’t separated that from registrations yet.": "We never separate that one from registrations yet.",
    "We worked hard to get those numbers.": "We work hard to get those numbers.",
    "I’m not saying the work was useless. I’m saying the numbers don’t prove what we want them to prove.": "I no dey talk say the work useless. I dey talk say the numbers no prove wetin we want make dem prove.",
    "So what should we measure?": "So wetin we suppose measure?",
    "Start with what the product is supposed to help people do.": "Start with wetin the product suppose help people do.",
    "Then measure whether people can actually do it, whether they return because it helps them, and whether it keeps helping them.": "Then measure whether people fit really do am, whether dem come back because e help dem, and whether e continue to help dem.",
    "That sounds less impressive than ten thousand users.": "That one no sound as impressive as ten thousand users.",
    "Until ten thousand users can prove the product is worth using.": "Until ten thousand users fit prove say the product worth using.",
    "I’ve watched the tutorials three times. I still don’t understand what I’m signing.": "I don watch the tutorials three times. I still no understand wetin I dey sign.",
    "Read the documentation.": "Read the documentation.",
    "I did.": "I don read am.",
    "Then read it again.": "Then read am again.",
    "That isn’t helping.": "That one no dey help.",
    "What’s the problem?": "Wetin be the problem?",
    "The product says it’s open to everybody. But if you already understand wallets, fees, keys, signatures, and networks, you’re the only kind of person who can use it without help.": "The product talk say everybody fit use am. But if you must already understand wallets, fees, keys, signatures, and networks, na only that kind person fit use am without help.",
    "How can someone make a safe decision if they don’t understand what they’re approving?": "How person go make safe decision if dem no understand wetin dem dey approve?",
    "People are responsible for learning.": "People get responsibility to learn.",
    "Yes. But builders are responsible for making things understandable too.": "Yes. But builders too get responsibility to make things easy to understand.",
    "We can’t simplify everything.": "We no fit simplify everything.",
    "We don’t have to simplify the technology until it’s meaningless. We need to explain the consequences in language people understand.": "We no need simplify the technology reach where e no mean anything. We need explain the consequences with language wey people understand.",
    "Access isn’t just allowing someone to create an account.": "Access no be only to allow person create account.",
    "It’s giving them a fair chance to understand what they’re doing.": "Na to give dem fair chance to understand wetin dem dey do.",
    "I need a way to keep track of my small business payments.": "I need way to track payments for my small business.",
    "I want to learn a skill that can get me paid.": "I wan learn skill wey fit bring me money.",
    "I just want to know whether this investment opportunity is legitimate.": "I just wan know whether this investment opportunity legit.",
    "AI agent. Token. Marketplace. Points. Governance. We can combine everything.": "AI agent. Token. Marketplace. Points. Governance. We fit combine everything.",
    "What problem does it solve?": "Wetin be the problem wey e solve?",
    "Everything is moving in that direction.": "Everything dey move for that direction.",
    "That isn’t a problem.": "That one no be problem.",
    "If we don’t move now, someone else will.": "If we no move now, another person go do am.",
    "Who is supposed to use this?": "Who suppose use this?",
    "Crypto users, creators, traders, communities. Anybody.": "Crypto users, creators, traders, communities. Anybody.",
    "So everybody is the target, and nobody is the actual user.": "So everybody na the target, but nobody be the real user.",
    "People have real problems. But this product doesn’t have a clear answer for any of them.": "People get real problems. But this product no get clear answer for any of dem.",
    "Are you saying we should stop experimenting?": "You dey talk say make we stop experimenting?",
    "No. Experiment. But don’t confuse the newest technology with the most useful solution.": "No. Experiment. But no confuse the newest technology with the most useful solution.",
    "Then where do we start?": "Then where we go start?",
    "Pick one problem. Find the people who experience it. Build something small that helps. Test whether it works.": "Pick one problem. Find people wey dey face am. Build something small wey go help. Test whether e work.",
    "And let the evidence decide what comes next.": "Make the evidence decide wetin go happen next.",
    "I don’t need another token. I need to know who paid, who hasn’t paid, and where my orders are.": "I no need another token. I need know who pay, who never pay, and where my orders dey.",
    "What if a tool could help you track those things?": "Wetin if one tool fit help you track those things?",
    "If it works, doesn’t cost too much, and I can understand how to use it, I’ll try it.": "If e work, no cost too much, and I fit understand how to use am, I go try am.",
    "People come here to talk about financial freedom.": "People dey come here talk about financial freedom.",
    "Then they show everybody how to trade.": "Then dem show everybody how to trade.",
    "Nothing wrong with trading.": "Nothing wrong with trading.",
    "No. But not everybody wants to trade. Some people want customers. Some want jobs. Some want to learn how to build software. Some just need a better way to run their business.": "No. But no be everybody wan trade. Some people want customers. Some want jobs. Some wan learn how to build software. Some just need better way to run their business.",
    "Can Web3 help with those things?": "Web3 fit help with those things?",
    "It can. But only if somebody builds a solution that fits the problem.": "E fit. But only if somebody build solution wey fit the problem.",
    "That’s the part people forget. The technology is not the final goal.": "Na that part people dey forget. The technology no be the final goal.",
    "It’s a tool. If the tool doesn’t help anyone, why should they care what chain it runs on?": "Na tool. If the tool no help anybody, why dem go care which chain e dey run on?",
    "So restoring value means giving people reasons to participate beyond price.": "So to restore value mean say make people get reason to participate beyond price.",
    "Exactly. Give builders a reason to build. Give users a reason to stay. Give people a reason to trust what they’re using.": "Exactly. Give builders reason to build. Give users reason to stay. Give people reason to trust wetin dem dey use.",
    "The community voted against the change.": "The community vote against the change.",
    "The change has already been applied.": "Dem don already apply the change.",
    "Then why did you ask us to vote?": "Then why you ask us to vote?",
    "The vote was advisory.": "The vote na only advice.",
    "Was that made clear before the vote?": "Una make that one clear before the vote?",
    "It’s in the governance terms.": "E dey inside the governance terms.",
    "Buried in a document nobody showed us until after the decision.": "Dem hide am inside document wey nobody show us until after the decision.",
    "Some decisions have to be made quickly. You can’t put everything to a vote.": "Some decisions must happen quick. You no fit put everything to vote.",
    "Then define which decisions can be made quickly. Tell people who has the authority. Explain what happens when that authority is abused.": "Then define which decisions fit happen quick. Tell people who get the authority. Explain wetin go happen if person abuse that authority.",
    "Decentralization doesn’t mean every person votes on every action.": "Decentralization no mean say everybody must vote on every action.",
    "Correct.": "Correct.",
    "But it should mean the actual power is clear, and the people affected understand how decisions get made.": "But e suppose mean say the real power clear, and people wey the decision affect understand how dem dey make decisions.",
    "And that the rules apply to the people running the system too.": "And the rules must apply to the people wey dey run the system too.",
    "Nobody even wants to hear what we’re building.": "Nobody even wan hear wetin we dey build.",
    "Can you blame them?": "You fit blame dem?",
    "We didn’t do anything to them.": "We no do anything to dem.",
    "They don’t know that.": "Dem no know that.",
    "What happened before?": "Wetin happen before?",
    "Three projects promised to solve the same problem. Two disappeared. One collected money and never delivered. Now people assume every new project is another version of the same story.": "Three projects promise to solve the same problem. Two disappear. One collect money and never deliver. Now people dey assume every new project na another version of the same story.",
    "We have something useful. But people don’t trust us enough to try it.": "We get something useful. But people no trust us enough to try am.",
    "Then don’t demand their trust.": "Then no demand make dem trust you.",
    "What do you mean?": "Wetin you mean?",
    "A promise can attract attention. Only delivery can justify it.": "Promise fit attract attention. Na delivery go prove say e worth am.",
    "A healthy ecosystem recognises the people who make it possible.": "Healthy ecosystem dey recognise people wey make am possible.",
    "Ownership means more than holding an asset. Understand the rights attached to it.": "Ownership pass to hold asset. Understand the rights wey come with am.",
    "Taking a profit isn’t the same as misleading the people who trusted you.": "To take profit no be the same as to mislead people wey trust you.",
    "A crowd is not automatically a community. Shared work gives people something to build together.": "Crowd no automatically mean community. Shared work give people something to build together.",
    "Activity is easy to count. Value takes evidence.": "Activity easy to count. Value need evidence.",
    "A door isn’t truly open if people cannot understand how to enter safely.": "Door no truly open if people no understand how to enter safely.",
    "Start with the problem, not the trend.": "Start with the problem, no be the trend.",
    "Technology becomes valuable when it helps people do something they couldn’t do as well before.": "Technology get value when e help people do something wey dem no fit do well before.",
    "Rules mean little when people don’t know who can change them.": "Rules no mean much if people no know who fit change dem.",
    "Trust isn’t restored by asking for another chance. It’s rebuilt by giving people evidence.": "You no restore trust just by asking for another chance. You rebuild am by showing people evidence.",
    "Rebuilding is not repeating. It’s learning what deserves to survive.": "To rebuild no mean to repeat. Na to learn wetin deserve to survive.",
    "You have discovered what was lost. Now you must discover what it takes to restore it.": "You don discover wetin lost. Now you must discover wetin e go take to restore am.",
    "Larai": "Larai",
    "Smrt huntr": "Smrt huntr",
    "Semi": "Semi",
    "Christol": "Christol",
    "BigSam": "BigSam",
    "OxNight": "OxNight",
    "The cryptonian": "The cryptonian",
    "Reina": "Reina",
    "Leemah": "Leemah",
    "LAGOS · 3:42 PM": "LAGOS · 3:42 PM",
    "Show them what works. Show them what doesn’t. Keep records of what you change. Answer questions when things go wrong.": "Show dem wetin dey work. Show dem wetin no work. Keep record of wetin you change. Answer questions when things spoil.",
    "And don’t promise what you can’t deliver.": "And no promise wetin you no fit deliver.",
    "That won’t fix everything overnight.": "That one no go fix everything overnight.",
    "No. Trust isn’t a switch. It’s a record of what you do over time.": "No. Trust no be switch wey you fit turn on. Na record of wetin you dey do over time.",
    "Look at everything we’ve found.": "Look everything we don find.",
    "People who lost money. Builders who lost control. Communities that disappeared. Products nobody needed. Rules that only worked for the people in charge.": "People wey lose money. Builders wey lose control. Communities wey disappear. Products wey nobody need. Rules wey only work for people wey dey in charge.",
    "Different states. Different problems.": "Different states. Different problems.",
    "But the same pattern.": "But na the same pattern.",
    "We keep talking about bringing back the old days.": "We dey always talk about bringing back the old days.",
    "The old days weren’t perfect either.": "The old days no perfect too.",
    "Then we’re not trying to rebuild the past.": "Then we no dey try rebuild the past.",
    "No. We’re trying to recover what was worth keeping and do better with it.": "No. We dey try recover wetin worth keeping and do better with am.",
    "What should a better ecosystem protect first?": "Wetin better ecosystem suppose protect first?",
    "Fifteen states.": "Fifteen states.",
    "Fifteen different places. More problems than we expected.": "Fifteen different places. More problems pass wetin we expect.",
    "And not one of them can be fixed by launching another token.": "And no be any of dem wey another token go fit fix.",
    "So what exactly are we trying to recover?": "So wetin exactly we dey try recover?",
    "At first, I thought we were looking for a missing project.": "At first, I think say we dey look for project wey disappear.",
    "I thought somebody had stolen something.": "I think say somebody don steal something.",
    "Maybe something was stolen. But not everything we found was taken by one person.": "Maybe dem steal something. But no be everything we find wey one person carry.",
    "Then how did it get lost?": "Then how e take lost?",
    "So Web3 lost its value?": "So Web3 lose im value?",
    "Not exactly.": "No be exactly so.",
    "Then what did we lose?": "Then wetin we lose?",
    "We lost sight of what made the technology worth building in the first place.": "We forget wetin make the technology worth building from the beginning.",
    "And we kept rewarding the things that made it easier to forget.": "And we continue to reward the things wey make am easy to forget.",
    "Can we bring it back?": "We fit bring am back?",
    "Not by pretending nothing happened. Not by asking people to trust another promise.": "No be by pretending say nothing happen. No be by asking people to trust another promise.",
    "Then how?": "Then how?",
    "Build something worth trusting. Make something people can use. Give contributors a fair place in the system. Be honest when things fail. Let people see what their participation actually means.": "Build something wey worth trusting. Make something wey people fit use. Give contributors fair place for the system. Talk true when things fail. Make people see wetin their participation really mean.",
    "That sounds like a lot of work.": "That one sound like plenty work.",
    "It is.": "E be so.",
    "That’s why somebody has to do it.": "Na why somebody must do am.",
    "Softstorm": "Softstorm",
    "Player health:": "Player health:",
    "of 3 hearts": "out of 3 hearts",
    "Boss, I am rushing to my stall in the market across town. Take my address, then bring my 1 USDC for the yam there:": "Boss, I dey rush go my stall for the market across town. Take my address, then bring my 1 USDC come collect the yam.",
    "Address mistakes cannot be undone. Funds sent to the wrong address are lost.": "You no fit reverse address mistake. If you send money go wrong address, the money don lost.",
    "Copy her address": "Copy her address",
    "Address copied": "Address don copy",
    "Share on WhatsApp": "Share am for WhatsApp",
    "Interactive geographic overview of Nigeria. Select a labelled city marker or use the city list below to view missions": "Map of Nigeria. Select city wey get label or use city list below to see missions.",
    "missions completed": "missions don complete",
    "Enter KitCity": "Enter KitCity",
    "Restoring your session…": "We dey restore your session…",
    "PASSWORD (NOT NEEDED FOR THIS SESSION)": "PASSWORD (YOU NO NEED AM FOR THIS SESSION)",
    "Firebase is not configured yet. Add the NEXT_PUBLIC_FIREBASE_* settings in Vercel and deploy the Firestore rules before signing in.": "Firebase never configure yet. Add the NEXT_PUBLIC_FIREBASE_* settings for Vercel and deploy the Firestore rules before you sign in.",
    "No hearts left — restarting mission!": "You don use all your hearts — we dey restart the mission!",
    "Mission ": "Mission ",
    " locked": " locked",
    "MISSIONS COMPLETED": "MISSIONS DON COMPLETE",
    "CHOOSE YOUR NEXT MOVE": "CHOOSE WETIN YOU GO DO NEXT",
    "Next objective": "Next thing wey you need do",
    "Report complete": "Report don complete",
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
