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
  ha: 'Hausa',
  yo: 'Yorùbá',
  ig: 'Igbo',
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
  },
  ha: {
    'Settings': 'Saituna',
    'Language': 'Harshe',
    'Choose how the game talks to you.': 'Zaɓi harshen da wasan zai yi amfani da shi.',
    'English': 'Turanci',
    'Naija Pidgin': 'Pidgin na Najeriya',
    'Hausa': 'Hausa',
    'Yorùbá': 'Yarbanci',
    'Igbo': 'Igbo',
    'Graphics': 'Zane-zanen wasa',
    'Music': 'Kiɗa',
    'Playlist': 'Jerin waƙoƙi',
    'Use playlist': 'Yi amfani da jerin waƙoƙi',
    'Skip song': 'Tsallake waƙa',
    'Default': 'Na asali',
    'Sound effects': 'Sautukan wasa',
    'How to play': 'Yadda ake wasa',
    'Move with the left stick or WASD. Hold Run or Shift to run. Tap Talk or press E near a glowing person. The arrow points to your goal. Avoid traffic.': 'Yi motsi da sandar hagu ko WASD. Riƙe Run ko Shift don gudu. Taɓa Talk ko danna E kusa da mutum mai haske. Kibiya tana nuna inda za ka je. Guji ababen hawa.',
    'About the streets': 'Game da tituna',
    'Reset progress': 'Sake saita ci gaba',
    'Reset': 'Sake saita',
    'Yes, erase everything': 'Eh, goge komai',
    'Talk': 'Yi magana',
    'Run': 'Gudu',
    'Mission': 'Manufa',
    'Resume': 'Ci gaba',
    'Continue': 'Ci gaba',
    'Back': 'Koma baya',
    'Close': 'Rufe',
    'Cancel': 'Soke',
    'Accept mission': 'Karɓi manufa',
    'Start mission': 'Fara manufa',
    'Mission complete': 'An kammala manufa',
    'Objective': 'Abin da za a yi',
    'Next': 'Na gaba',
    'Skip': 'Tsallake',
    'Sign in': 'Shiga',
    'Create account': 'Ƙirƙiri asusu',
    'On': 'A kunne',
    'Off': 'A kashe',
    'Here': 'Nan',
    "No wallet yet": "Babu walat tukuna",
    "Practice top-up added": "An ƙara kuɗin gwaji",
    "Back on your feet. Watch the traffic.": "Ka tashi. Ka kula da ababen hawa.",
    "Finish the previous city journey first": "Ka fara kammala tafiyar birnin da ya gabata",
    "Step complete": "An kammala matakin",
    "Progress erased": "An goge ci gaba",
    "Playlist loaded": "An loda jerin waƙoƙi",
    "Default playlist": "Jerin waƙoƙi na asali",
    "Could not sign out. Please try again.": "Ba a iya fita ba. Sake gwadawa.",
    "What do you do?": "Me za ka yi?",
    "Walk over and ask them": "Je ka tambaye su",
    "Stay back and listen a little longer": "Ka tsaya ka ƙara sauraro",
    "YOUR MOVE": "MATSAKIN KA",
    "NEXT OBJECTIVE": "MANUFA TA GABA",
    "REPORT COMPLETE": "AN KAMMALA RAHOTO",
    "YOUR OBJECTIVE": "MANUFARKA",
    "Record evidence": "Ajiye hujja",
    "Report your findings": "Bayar da rahoton abin da ka gano",
    "Evidence recorded": "An ajiye hujja",
    "You have returned to report what you found. The evidence is now part of the record.": "Ka dawo don bayar da rahoton abin da ka gano. Yanzu hujjar tana cikin bayanan.",
    "You": "Kai",
    "Create account & enter KitCity": "Ƙirƙiri asusu ka shiga KitCity",
    "Sign in & enter KitCity": "Shiga KitCity",
    "Continue to KitCity": "Ci gaba zuwa KitCity",
    "Securing your account…": "Ana kare asusunka…",
    "Restoring your KitCity session…": "Ana dawo da zaman KitCity ɗinka…",
    "That is not a YouTube playlist link": "Wannan ba hanyar jerin waƙoƙin YouTube ba ce",
    "Reset progress": "Sake saita ci gaba",
    "Yes, erase everything": "Eh, goge komai",
    "Another day. Another transaction. Another promise of something better.": "Wata rana kuma. Wata ciniki kuma. Wata alkawarin ingantacciyar rayuwa.",
    "So this T3Kit thing connects all these people?": "Shin wannan T3Kit yana haɗa waɗannan mutanen ne?",
    "That’s what I’m trying to figure out. The same name keeps showing up in places that should have nothing in common.": "Abin da nake ƙoƙarin ganewa ke nan. Sunan ɗaya yana bayyana a wuraren da bai kamata su haɗu ba.",
    "Then why does nobody explain what it is?": "To me ya sa babu wanda yake bayyana abin da yake nufi?",
    "YOUR THOUGHTS": "TUNANINKA",
    "T3Kit? You’ve heard the name for the first time today. But something about the way they’re talking makes you want to know more.": "T3Kit? A yau ne ka fara jin sunan. Amma yadda suke magana ya sa kana son ƙarin sani.",
    "You heard us, abi? Fair enough. We’re trying to understand something ourselves. If you want answers, start with the people connected to it.": "Ka ji abin da muke magana a kai, ko? To, shikenan. Mu ma muna ƙoƙarin fahimta. Idan kana son amsoshi, fara da mutanen da ke da alaƙa da shi.",
    "I saw that symbol on an old meetup poster too. Same mark. Different place. That can’t be a coincidence.": "Na ga wannan alama a tsohon sanarwar taro ma. Alama ɗaya, wuri daban. Wannan ba zai zama kwatsam ba.",
    "CLUE ACQUIRED: THE T3KIT MARK": "AN SAMU ALAMA: T3KIT",
    "One name. Two people. No clear answers.": "Suna ɗaya. Mutane biyu. Babu amsa bayyananniya.",
    "SKIP SCENE ↗": "TSALLAKE FAGE ↗",
    "TAP TO CONTINUE →": "TAƁA DON CI GABA →",
    "ENTER THE STORY →": "SHIGA LABARIN →",
    "RETURN TO MISSION →": "KOMA MANUFA →",
    "THE LOST VALUE · LAGOS": "THE LOST VALUE · LAGOS",
    "THE LOST VALUE · A CONVERSATION": "THE LOST VALUE · TATTAUNAWA",
    "LAGOS · A CONVERSATION": "LAGOS · TATTAUNAWA",
    "KitCity story scene": "Fagen labarin KitCity",
  },
  yo: {
    'Settings': 'Ètò',
    'Language': 'Èdè',
    'Choose how the game talks to you.': 'Yan èdè tí eré yóò fi bá ọ sọ̀rọ̀.',
    'English': 'Èdè Gẹ̀ẹ́sì',
    'Naija Pidgin': 'Pídìjìn Nàìjíríà',
    'Hausa': 'Hausa',
    'Yorùbá': 'Yorùbá',
    'Igbo': 'Ìgbò',
    'Graphics': 'Àwòrán eré',
    'Music': 'Orin',
    'Playlist': 'Àkójọ orin',
    'Use playlist': 'Lo àkójọ orin',
    'Skip song': 'Fo orin yìí kọjá',
    'Default': 'Èyí tí a ṣe déédé',
    'Sound effects': 'Àwọn ìró eré',
    'How to play': 'Bí a ṣe ń ṣeré',
    'Move with the left stick or WASD. Hold Run or Shift to run. Tap Talk or press E near a glowing person. The arrow points to your goal. Avoid traffic.': 'Lo ọ̀pá òsì tàbí WASD láti rìn. Di Run tàbí Shift mú láti sáré. Tẹ Talk tàbí lẹ́tà E lẹ́gbẹ̀ẹ́ ẹni tó ń tàn. Ọfà ń tọ́ ọ sí ibi tí o ń lọ. Yàgò fún ọkọ̀.',
    'About the streets': 'Nípa àwọn òpópónà',
    'Reset progress': 'Tún ìlọsíwájú bẹ̀rẹ̀',
    'Reset': 'Tún bẹ̀rẹ̀',
    'Yes, erase everything': 'Bẹ́ẹ̀ ni, pa gbogbo rẹ́ rẹ́',
    'Talk': 'Bá sọ̀rọ̀',
    'Run': 'Sáré',
    'Mission': 'Iṣẹ́',
    'Resume': 'Tẹ̀ síwájú',
    'Continue': 'Tẹ̀ síwájú',
    'Back': 'Padà',
    'Close': 'Pàdé',
    'Cancel': 'Fagilé',
    'Accept mission': 'Gba iṣẹ́ náà',
    'Start mission': 'Bẹ̀rẹ̀ iṣẹ́',
    'Mission complete': 'Iṣẹ́ ti parí',
    'Objective': 'Ohun tí o yẹ kí o ṣe',
    'Next': 'Tókàn',
    'Skip': 'Fo kọjá',
    'Sign in': 'Wọlé',
    'Create account': 'Ṣẹ̀dá àkáǹtì',
    'On': 'Ń ṣiṣẹ́',
    'Off': 'Kò ṣiṣẹ́',
    'Here': 'Níhìn-ín',
    "No wallet yet": "O kò tíì ní àpò owó",
    "Practice top-up added": "A ti fi owó ìdánwò kún un",
    "Back on your feet. Watch the traffic.": "O ti dìde. Ṣọ́ra fún ọkọ̀ ojú ọ̀nà.",
    "Finish the previous city journey first": "Parí ìrìn-àjò ìlú tó ṣáájú kọ́kọ́",
    "Step complete": "Igbésẹ̀ ti parí",
    "Progress erased": "A ti pa ìlọsíwájú rẹ́",
    "Playlist loaded": "A ti ṣí àkójọ orin",
    "Default playlist": "Àkójọ orin àkọ́kọ́",
    "Could not sign out. Please try again.": "A kò lè jáde. Jọ̀wọ́ tún gbìyànjú.",
    "What do you do?": "Kí ni o máa ṣe?",
    "Walk over and ask them": "Lọ bá wọn sọ̀rọ̀",
    "Stay back and listen a little longer": "Dúró sí ẹ̀yìn kí o tún gbọ́ díẹ̀ sí i",
    "YOUR MOVE": "ÌGBÉSẸ̀ RẸ",
    "NEXT OBJECTIVE": "OHUN TÍ O YẸ KÍ O ṢE TÓ KAN",
    "REPORT COMPLETE": "ÌRÒYÌN TI PARÍ",
    "YOUR OBJECTIVE": "OHUN TÍ O YẸ KÍ O ṢE",
    "Record evidence": "Fi ẹ̀rí pamọ́",
    "Report your findings": "Jabọ ohun tí o rí",
    "Evidence recorded": "A ti fi ẹ̀rí pamọ́",
    "You have returned to report what you found. The evidence is now part of the record.": "O ti padà láti sọ ohun tí o rí. Ẹ̀rí náà ti di apá kan ìwé àkọsílẹ̀.",
    "You": "Ìwọ",
    "Create account & enter KitCity": "Ṣẹ̀dá àkáǹtì kí o sì wọ KitCity",
    "Sign in & enter KitCity": "Wọlé sí KitCity",
    "Continue to KitCity": "Tẹ̀ síwájú sí KitCity",
    "Securing your account…": "A ń dáàbò bo àkáǹtì rẹ…",
    "Restoring your KitCity session…": "A ń dá ìgbàwọlé KitCity rẹ padà…",
    "That is not a YouTube playlist link": "Èyí kì í ṣe ìjápọ̀ àkójọ orin YouTube",
    "Reset progress": "Tún ìlọsíwájú bẹ̀rẹ̀",
    "Yes, erase everything": "Bẹ́ẹ̀ ni, pa gbogbo rẹ́ rẹ́",
    "Another day. Another transaction. Another promise of something better.": "Ọjọ́ míì. Ìṣòwò míì. Ìlérí míì pé ohun gbogbo yóò dára sí i.",
    "So this T3Kit thing connects all these people?": "Ṣé ohun T3Kit yìí so gbogbo àwọn ènìyàn wọ̀nyí pọ̀?",
    "That’s what I’m trying to figure out. The same name keeps showing up in places that should have nothing in common.": "Ohun tí mo ń gbìyànjú láti lóye nìyẹn. Orúkọ kan náà ń farahàn ní àwọn ibi tí kò yẹ kí wọ́n ní ohunkóhun papọ̀.",
    "Then why does nobody explain what it is?": "Kí ló dé tí ẹnikẹ́ni kò fi ṣàlàyé ohun tí ó jẹ́?",
    "YOUR THOUGHTS": "ÈRÒ RẸ",
    "T3Kit? You’ve heard the name for the first time today. But something about the way they’re talking makes you want to know more.": "T3Kit? Lónìí ni o kọ́kọ́ gbọ́ orúkọ náà. Ṣùgbọ́n ọ̀nà tí wọ́n gbà ń sọ̀rọ̀ mú kí o fẹ́ mọ̀ sí i.",
    "You heard us, abi? Fair enough. We’re trying to understand something ourselves. If you want answers, start with the people connected to it.": "O gbọ́ ohun tí a ń sọ, abi? Ó dáa. Àwa náà ń gbìyànjú láti lóye rẹ̀. Tí o bá fẹ́ ìdáhùn, bẹ̀rẹ̀ lọ́dọ̀ àwọn tó ní ìbáṣepọ̀ pẹ̀lú rẹ̀.",
    "I saw that symbol on an old meetup poster too. Same mark. Different place. That can’t be a coincidence.": "Mo tún rí àmì yẹn lórí ìwé ìpàdé àtijọ́. Àmì kan náà, ibi mìíràn. Èyí kò lè jẹ́ àìròtẹ́lẹ̀.",
    "CLUE ACQUIRED: THE T3KIT MARK": "A TI RÍ ÀMÌ: T3KIT",
    "One name. Two people. No clear answers.": "Orúkọ kan. Ènìyàn méjì. Kò sí ìdáhùn tó ṣe kedere.",
    "SKIP SCENE ↗": "FOJÚ KỌ SCENE ↗",
    "TAP TO CONTINUE →": "TẸ̀ LÁTI TẸ̀ SÍWÁJÚ →",
    "ENTER THE STORY →": "WỌ INÚ ÌTÀN →",
    "RETURN TO MISSION →": "PADÀ SÍ IṢẸ́ →",
    "THE LOST VALUE · LAGOS": "THE LOST VALUE · LAGOS",
    "THE LOST VALUE · A CONVERSATION": "THE LOST VALUE · ÌJỌ̀RỌ̀",
    "LAGOS · A CONVERSATION": "LAGOS · ÌJỌ̀RỌ̀",
    "KitCity story scene": "Ìṣẹ̀lẹ̀ ìtàn KitCity",
  },
  ig: {
    'Settings': 'Ntọala',
    'Language': 'Asụsụ',
    'Choose how the game talks to you.': 'Họrọ asụsụ egwuregwu ga-eji gwa gị okwu.',
    'English': 'Bekee',
    'Naija Pidgin': 'Pidgin Naịjirịa',
    'Hausa': 'Hausa',
    'Yorùbá': 'Yoruba',
    'Igbo': 'Igbo',
    'Graphics': 'Ọdịdị eserese',
    'Music': 'Egwu',
    'Playlist': 'Ndepụta egwu',
    'Use playlist': 'Jiri ndepụta egwu',
    'Skip song': 'Mafee egwu',
    'Default': 'Nke mbụ',
    'Sound effects': 'Ụda egwuregwu',
    'How to play': 'Otu esi egwu',
    'Move with the left stick or WASD. Hold Run or Shift to run. Tap Talk or press E near a glowing person. The arrow points to your goal. Avoid traffic.': 'Jiri mkpịsị aka ekpe ma ọ bụ WASD gaa. Jide Run ma ọ bụ Shift ka ị gbaa ọsọ. Pịa Talk ma ọ bụ E n’akụkụ onye na-enwu. Akara akụ na-egosi ebe ị ga-aga. Zere ụgbọala.',
    'About the streets': 'Banyere okporo ụzọ',
    'Reset progress': 'Malite ọganihu ọzọ',
    'Reset': 'Malite ọzọ',
    'Yes, erase everything': 'Ee, hichapụ ihe niile',
    'Talk': 'Kwuo okwu',
    'Run': 'Gbaa ọsọ',
    'Mission': 'Ọrụ',
    'Resume': 'Gaa n’ihu',
    'Continue': 'Gaa n’ihu',
    'Back': 'Laghachi',
    'Close': 'Mechie',
    'Cancel': 'Kagbuo',
    'Accept mission': 'Nabata ọrụ',
    'Start mission': 'Malite ọrụ',
    'Mission complete': 'Emechaala ọrụ',
    'Objective': 'Ihe ị ga-eme',
    'Next': 'Ọzọ',
    'Skip': 'Mafee',
    'Sign in': 'Banye',
    'Create account': 'Mepụta akaụntụ',
    'On': 'Gbanwuru',
    'Off': 'Gbanyụọ',
    'Here': 'Ebe a',
    "No wallet yet": "Enweghị obere akpa ego",
    "Practice top-up added": "Agbakwunyere ego nnwale",
    "Back on your feet. Watch the traffic.": "I biliela ọzọ. Lezie anya n’okporo ụzọ.",
    "Finish the previous city journey first": "Buru ụzọ mechaa njem obodo gara aga",
    "Step complete": "Emechaala nzọụkwụ a",
    "Progress erased": "Ehichapụrụ ọganihu",
    "Playlist loaded": "Ebugola ndepụta egwu",
    "Default playlist": "Ndepụta egwu ndabara",
    "Could not sign out. Please try again.": "Enweghị ike ịpụ. Biko nwaa ọzọ.",
    "What do you do?": "Gịnị ka ị ga-eme?",
    "Walk over and ask them": "Gakwuru ha jụọ ha",
    "Stay back and listen a little longer": "Nọrọ ebe ahụ gee ntị ntakịrị ọzọ",
    "YOUR MOVE": "Ọ BỤRỤ GỊ",
    "NEXT OBJECTIVE": "IHE Ị GA-eme ỌZỌ",
    "REPORT COMPLETE": "EDECHALA AKỤKỌ",
    "YOUR OBJECTIVE": "IHE Ị GA-eme",
    "Record evidence": "Debe ihe akaebe",
    "Report your findings": "Kọọ ihe ị chọpụtara",
    "Evidence recorded": "Edekọla ihe akaebe",
    "You have returned to report what you found. The evidence is now part of the record.": "Ị lọghachila ịkọ ihe ị chọpụtara. Ihe akaebe ahụ abụrụla akụkụ nke ndekọ.",
    "You": "Gị",
    "Create account & enter KitCity": "Mepụta akaụntụ ma banye KitCity",
    "Sign in & enter KitCity": "Banye na KitCity",
    "Continue to KitCity": "Gaa n’ihu na KitCity",
    "Securing your account…": "A na-echekwa akaụntụ gị…",
    "Restoring your KitCity session…": "A na-eweghachi nnọkọ KitCity gị…",
    "That is not a YouTube playlist link": "Nke a abụghị njikọ ndepụta egwu YouTube",
    "Reset progress": "Malite ọganihu ọzọ",
    "Yes, erase everything": "Ee, hichapụ ihe niile",
    "Another day. Another transaction. Another promise of something better.": "Ụbọchị ọzọ. Azụmahịa ọzọ. Nkwa ọzọ na ihe ga-aka mma.",
    "So this T3Kit thing connects all these people?": "Ya bụ na ihe a bụ T3Kit na-ejikọ ndị a niile?",
    "That’s what I’m trying to figure out. The same name keeps showing up in places that should have nothing in common.": "Ọ bụ ihe ahụ ka m na-achọ ịghọta. Otu aha ahụ na-apụta n’ebe dị iche iche na-enweghị ihe jikọrọ ha.",
    "Then why does nobody explain what it is?": "Gịnị mere na onye ọ bụla anaghị akọwa ihe ọ bụ?",
    "YOUR THOUGHTS": "ECHICHE GỊ",
    "T3Kit? You’ve heard the name for the first time today. But something about the way they’re talking makes you want to know more.": "T3Kit? Ọ bụ taa ka ị nụrụ aha ahụ nke mbụ. Ma otú ha si ekwu okwu mere ka ịchọọ ịmatakwu.",
    "You heard us, abi? Fair enough. We’re trying to understand something ourselves. If you want answers, start with the people connected to it.": "Ị nụrụ ihe anyị na-ekwu, abi? Ọ dị mma. Anyị onwe anyị na-achọkwa ịghọta ya. Ọ bụrụ na ịchọrọ azịza, malite n’aka ndị metụtara ya.",
    "I saw that symbol on an old meetup poster too. Same mark. Different place. That can’t be a coincidence.": "Ahụrụ m akara ahụ n’akwụkwọ ọkwa nzukọ ochie. Otu akara, ebe ọzọ. Nke a enweghị ike ịbụ ihe ndabara.",
    "CLUE ACQUIRED: THE T3KIT MARK": "ENWEELA AKARA: T3KIT",
    "One name. Two people. No clear answers.": "Otu aha. Mmadụ abụọ. Enweghị azịza doro anya.",
    "SKIP SCENE ↗": "MAFEE EBE A ↗",
    "TAP TO CONTINUE →": "PỊA KA ỊGA N’IHU →",
    "ENTER THE STORY →": "BANYE N’IME AKỤKỌ →",
    "RETURN TO MISSION →": "LAGHACHI N’ỌRỤ →",
    "THE LOST VALUE · LAGOS": "THE LOST VALUE · LAGOS",
    "THE LOST VALUE · A CONVERSATION": "THE LOST VALUE · MKPARỊTA ỤKA",
    "LAGOS · A CONVERSATION": "LAGOS · MKPARỊTA ỤKA",
    "KitCity story scene": "Ebe akụkọ KitCity",
  },
};

const NORMALIZED = Object.fromEntries(
  Object.entries(CATALOG).map(([language, entries]) => [
    language,
    new Map(Object.entries(entries).map(([source, translated]) => [source.trim(), translated])),
  ]),
);

export function translateText(value, language = 'en') {
  const original = String(value ?? '');
  if (!original || language === 'en' || !NORMALIZED[language]) return original;
  const match = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match) return original;
  const translated = NORMALIZED[language].get(match[2]);
  return translated === undefined ? original : match[1] + translated + match[3];
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
