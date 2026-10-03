const CURRICULUM_VERSION = 'web3-literacy-v2';

const CHAPTERS = [
  {
    id: 'before-web3',
    number: 1,
    title: 'Before Web3',
    phase: 'Discover',
    objective: 'See how the internet evolved before asking what should come next.',
    passenger: { name: 'Tunde', role: 'University Student' },
    beats: [
      { type: 'dialogue', speaker: 'Tunde', text: 'Think about the first internet you used. You mostly visited pages that were already there. You could read, but you were not really shaping the network.' },
      { type: 'teach', title: 'Web1 · Read', text: 'Early web experiences were mostly publishing and browsing. Websites were often static and interaction was limited.' },
      { type: 'choice', prompt: 'What did Web1 make easier for ordinary people?', options: [
        { text: 'Finding and reading information online', correct: true, feedback: 'Exactly. Web1 made the web a powerful place to publish and browse information.' },
        { text: 'Owning every platform they used', feedback: 'Platforms were generally controlled by the people running the websites.' }
      ]},
      { type: 'dialogue', speaker: 'Tunde', text: 'Then the web changed. We started posting, commenting, sharing, uploading and building businesses on platforms.' }
    ]
  },
  {
    id: 'web2',
    number: 2,
    title: 'The Web2 Revolution',
    phase: 'Discover',
    objective: 'Understand what social, mobile and platform internet unlocked.',
    passenger: { name: 'Aisha', role: 'Creator' },
    beats: [
      { type: 'dialogue', speaker: 'Aisha', text: 'Web2 gave people a voice. A phone became a camera, a shop, a newsroom and a community doorway.' },
      { type: 'teach', title: 'Web2 · Read + Write', text: 'Social networks, marketplaces, creator platforms and mobile apps made participation easy. Millions could create and communicate without running their own servers.' },
      { type: 'scenario', prompt: 'A creator builds an audience on a platform. What does the platform control?', options: [
        { text: 'The account, rules, distribution and often the relationship with the audience', correct: true, feedback: 'Right. Platforms can provide enormous reach while retaining important control.' },
        { text: 'Nothing. The creator automatically owns the platform', feedback: 'Using a platform is not the same as owning the platform.' }
      ]},
      { type: 'dialogue', speaker: 'Aisha', text: 'So Web2 solved participation, but it left a new question: if I create value online, how much control and ownership do I actually have?' }
    ]
  },
  {
    id: 'why-web3',
    number: 3,
    title: 'Why Web3 Emerged',
    phase: 'Understand',
    objective: 'Connect the ownership question to the ideas behind Web3.',
    passenger: { name: 'Mama Ngozi', role: 'Market Trader' },
    beats: [
      { type: 'dialogue', speaker: 'Mama Ngozi', text: 'Imagine a market where one company can change the rules, freeze your account or decide which customers can reach you. Now imagine a network where the rules are shared more openly.' },
      { type: 'teach', title: 'The ownership question', text: 'Web3 is a broad term for internet systems that use open networks, cryptography and programmable digital assets to give users more direct ownership or participation.' },
      { type: 'choice', prompt: 'Which idea best explains why people became interested in Web3?', options: [
        { text: 'More open ownership, participation and peer-to-peer coordination', correct: true, feedback: 'That is the core idea. It is a design goal, not a guarantee that every Web3 product achieves it.' },
        { text: 'A promise that every digital asset will increase in price', feedback: 'Speculation is one activity around Web3, not the reason the technology has to exist.' }
      ]},
      { type: 'teach', title: 'A useful distinction', text: 'Technology, utility, participation and speculation are different things. A beginner should learn to separate them.' }
    ]
  },
  {
    id: 'blockchain',
    number: 4,
    title: 'Blockchain From Zero',
    phase: 'Understand',
    objective: 'Build a mental model of shared records, transactions, blocks and validation.',
    passenger: { name: 'Emeka', role: 'Developer' },
    beats: [
      { type: 'dialogue', speaker: 'Emeka', text: 'Forget the jargon for a minute. Picture a notebook whose entries are copied across many independent computers. A new entry is accepted only when the network follows its rules.' },
      { type: 'teach', title: 'The blockchain model', text: 'Transactions are proposed, checked by network participants and grouped into blocks. The network uses a consensus mechanism to agree on which valid history to extend.' },
      { type: 'scenario', prompt: 'Someone edits an old transaction on one computer. What happens on a well-designed public blockchain?', options: [
        { text: 'The other copies and the network rules make the altered history difficult to accept', correct: true, feedback: 'Exactly. The power comes from many participants verifying the same history, not from one magic database.' },
        { text: 'The blockchain instantly makes the computer impossible to hack', feedback: 'Blockchain design does not make individual computers or users invulnerable.' }
      ]},
      { type: 'teach', title: 'Nodes, transparency and limits', text: 'Nodes keep or verify network data. Public ledgers can make transactions inspectable. Immutability is a practical property of network design and economic incentives, not a claim that no system can ever change.' }
    ]
  },
  {
    id: 'networks',
    number: 5,
    title: 'Networks Have Tradeoffs',
    phase: 'Understand',
    objective: 'Understand why different chains make different engineering choices.',
    passenger: { name: 'Emeka', role: 'Developer' },
    beats: [
      { type: 'dialogue', speaker: 'Emeka', text: 'Not every blockchain is built for the same job. Some prioritize security and decentralization; others optimize for speed, cost, or specialized workloads.' },
      { type: 'teach', title: 'Consensus and network design', text: 'Consensus is how a network coordinates on valid state. Different networks use different mechanisms and architectures, creating tradeoffs in cost, throughput, security, decentralization and user experience.' },
      { type: 'choice', prompt: 'What should you ask before choosing a network?', options: [
        { text: 'What is it designed for, how does it secure transactions, and what tradeoffs does it make?', correct: true, feedback: 'Good. A network is infrastructure with design choices, not a ranking of which coin will win.' },
        { text: 'Which network has the loudest marketing?', feedback: 'Marketing is not a technical evaluation.' }
      ]},
      { type: 'dialogue', speaker: 'Emeka', text: 'That habit of asking what a system is designed to do will save you from a lot of Web3 hype.' }
    ]
  },
  {
    id: 'wallets',
    number: 6,
    title: 'Wallets & Digital Ownership',
    phase: 'Practice',
    objective: 'Understand addresses, keys, signing, custody and transaction fees.',
    passenger: { name: 'Chidi', role: 'New Wallet Owner' },
    beats: [
      { type: 'dialogue', speaker: 'Chidi', text: 'I thought a wallet was like a bank account. Then I heard about addresses, private keys and seed phrases and got confused.' },
      { type: 'teach', title: 'A wallet is an interface', text: 'A wallet helps you view blockchain accounts, receive assets and sign actions. The public address can be shared; the private key or recovery phrase must remain secret.' },
      { type: 'scenario', prompt: 'A website asks you to approve a transaction. What should you do first?', options: [
        { text: 'Read what you are signing, verify the site and destination, and understand the fee', correct: true, feedback: 'Exactly. Signing is an action, not a harmless login.' },
        { text: 'Approve immediately because the wallet will automatically protect you', feedback: 'Wallet software can show information, but it cannot decide whether every request is safe.' }
      ]},
      { type: 'teach', title: 'Custody', text: 'Self-custody gives you direct control but also direct responsibility. A custodial service holds keys for you. Network fees pay for processing activity and vary by network and conditions.' }
    ]
  },
  {
    id: 'security',
    number: 7,
    title: 'Security Is Part of the Skill',
    phase: 'Practice',
    objective: 'Build practical habits that prevent common Web3 losses.',
    passenger: { name: 'Zainab', role: 'Security-conscious Freelancer' },
    beats: [
      { type: 'dialogue', speaker: 'Zainab', text: 'The most expensive mistake is sometimes one tap. A fake support agent, cloned website or malicious approval can turn a normal task into a loss.' },
      { type: 'teach', title: 'Never share the master key', text: 'Never share a seed phrase or private key. Legitimate support should not need it. Avoid storing recovery phrases in screenshots, chats or ordinary cloud notes.' },
      { type: 'choice', prompt: 'You receive a message: “Urgent! Your wallet is locked. Connect here to restore it.”', options: [
        { text: 'Do not use the link. Open the official service yourself and verify the warning.', correct: true, feedback: 'Strong move. Urgency and unfamiliar links are common phishing signals.' },
        { text: 'Connect quickly before the account is deleted', feedback: 'Urgency is exactly what scammers use to stop people thinking.' }
      ]},
      { type: 'choice', prompt: 'Before signing, what deserves a second look?', options: [
        { text: 'Website identity, destination, permissions, amount and network', correct: true, feedback: 'Correct. Slow down when a signature or approval can move value.' },
        { text: 'Only the logo', feedback: 'Logos and interfaces can be copied. Verify the underlying destination and request.' }
      ]}
    ]
  },
  {
    id: 'smart-contracts',
    number: 8,
    title: 'Smart Contracts',
    phase: 'Apply',
    objective: 'Understand programmable rules without treating code as magic.',
    passenger: { name: 'Emeka', role: 'Developer' },
    beats: [
      { type: 'dialogue', speaker: 'Emeka', text: 'Imagine an agreement where software checks a condition and executes the next step automatically. That is the intuition behind a smart contract.' },
      { type: 'scenario', prompt: 'A freelancer should receive payment only after a verified milestone. What could programmable rules do?', options: [
        { text: 'Hold the agreed conditions in code and execute the payment when the required condition is met', correct: true, feedback: 'That is the useful mental model: rules encoded in software that can interact with a blockchain.' },
        { text: 'Guarantee the freelancer is honest', feedback: 'Code can enforce specified rules; it cannot make people or outside information inherently trustworthy.' }
      ]},
      { type: 'teach', title: 'Code is not automatically safe', text: 'Smart contracts can contain bugs, flawed assumptions or dangerous permissions. A transparent contract can still be unsafe. Verification, audits and cautious interaction matter.' },
      { type: 'dialogue', speaker: 'Emeka', text: 'So the question is not “Is it on a blockchain?” The better question is “What exactly will this code do if I interact with it?”' }
    ]
  },
  {
    id: 'tokens',
    number: 9,
    title: 'Tokens & Digital Assets',
    phase: 'Apply',
    objective: 'Separate utility, ownership, representation, governance and speculation.',
    passenger: { name: 'Aisha', role: 'Creator' },
    beats: [
      { type: 'dialogue', speaker: 'Aisha', text: 'People hear token and immediately think price. But a token can represent access, membership, voting rights, a collectible or another digital claim.' },
      { type: 'teach', title: 'Fungible and non-fungible', text: 'Fungible assets are interchangeable units. NFTs are individually distinguishable tokens. Neither category automatically tells you whether an asset is useful, valuable or safe.' },
      { type: 'choice', prompt: 'A community token gives members access to a product. What is the first thing to understand?', options: [
        { text: 'What the token actually does, who controls the system and what risks or limits apply', correct: true, feedback: 'Exactly. Utility should be understood before speculation.' },
        { text: 'How quickly its price is rising', feedback: 'Price movement does not explain purpose or risk.' }
      ]},
      { type: 'teach', title: 'Digital ownership', text: 'A blockchain can record control or provenance of a digital asset. That does not automatically grant copyright, physical ownership or permanent value; those depend on the actual system and legal context.' }
    ]
  },
  {
    id: 'real-world',
    number: 10,
    title: 'What People Build',
    phase: 'Apply',
    objective: 'Recognize practical Web3 use cases in work and communities.',
    passenger: { name: 'Kunle', role: 'Entrepreneur' },
    beats: [
      { type: 'dialogue', speaker: 'Kunle', text: 'Forget the charts. Think about people: creators trying to reach global audiences, freelancers getting paid across borders, communities coordinating shared projects, and developers building open services.' },
      { type: 'teach', title: 'The ecosystem', text: 'Web3 applications can include payments, remittances, decentralized finance, creator tools, gaming, identity, governance, tokenized assets, public goods, infrastructure and community systems.' },
      { type: 'scenario', prompt: 'A Nigerian freelancer works with a client abroad. Which Web3 idea might be relevant?', options: [
        { text: 'A blockchain-based payment rail could provide another way to move value across borders, subject to fees, regulation and local access', correct: true, feedback: 'Yes. It is a possible tool, not a promise that it is always cheaper, faster or better.' },
        { text: 'Web3 guarantees instant, free international payments', feedback: 'Real systems have fees, network conditions, access constraints and regulatory considerations.' }
      ]},
      { type: 'teach', title: 'People, not promises', text: 'The useful question is whether a product solves a real problem. Skills, businesses and communities matter more than hype cycles.' }
    ]
  },
  {
    id: 'risks',
    number: 11,
    title: 'Web3 Is Not Perfect',
    phase: 'Explore',
    objective: 'Learn to evaluate Web3 critically instead of becoming a believer or a cynic.',
    passenger: { name: 'Mr. Bola', role: 'Skeptical Teacher' },
    beats: [
      { type: 'dialogue', speaker: 'Mr. Bola', text: 'Now I will challenge you. Scams, hacks, bad contracts, volatility and confusing interfaces are real. Why should anyone trust this ecosystem?' },
      { type: 'teach', title: 'The honest answer', text: 'You should not trust a label. Evaluate the product, code, people, permissions, incentives, security model and evidence. Web3 also has tradeoffs around privacy, regulation, scalability and decentralization.' },
      { type: 'choice', prompt: 'Which is the healthiest Web3 mindset?', options: [
        { text: 'Curious but skeptical: verify claims, understand risks and start small', correct: true, feedback: 'That is the habit we want you to leave with.' },
        { text: 'Everything is a scam', feedback: 'Scams exist, but dismissing useful technology can be as unhelpful as blindly trusting it.' },
        { text: 'Everything is the future', feedback: 'Hype is not evidence.' }
      ]},
      { type: 'teach', title: 'Irreversibility changes the stakes', text: 'Some blockchain transactions cannot be reversed by a bank or support team. That makes address verification, signing discipline and recovery planning especially important.' }
    ]
  },
  {
    id: 'future',
    number: 12,
    title: 'Where It Could Go',
    phase: 'Explore',
    objective: 'Separate current reality from experiments and speculation, then prepare for the next destination.',
    passenger: { name: 'Tunde', role: 'Student & Future Builder' },
    beats: [
      { type: 'dialogue', speaker: 'Tunde', text: 'We started with the old web. Now look ahead: open infrastructure, digital identity, creator ownership, AI plus Web3, global commerce, games and new community models are all being explored.' },
      { type: 'choice', prompt: 'Which statement is responsible?', options: [
        { text: 'Some applications exist today, some are early experiments, and some ideas remain speculative.', correct: true, feedback: 'Exactly. Good Web3 literacy keeps those categories separate.' },
        { text: 'Anything described as the future should be treated as already proven', feedback: 'A future possibility is not evidence that the system works today.' }
      ]},
      { type: 'teach', title: 'Your literacy toolkit', text: 'You can now ask: What problem is this solving? How does it work? Who controls what? What do I sign? What can go wrong? What evidence supports the claim? What exists today versus what is still experimental?' },
      { type: 'dialogue', speaker: 'Tunde', text: 'You started by saying, “I do not understand this Web3 thing.” Now you can recognize the ideas, question the claims and decide what deserves deeper exploration.' },
      { type: 'final', title: 'The next destination', text: 'You have finished the preparatory journey. KitCity is the place to keep learning by doing. T3kit is the next destination for deeper Web3 practice: Learn → Explore → Practice → Participate → Grow.' }
    ]
  }
];

function freshState() {
  return {
    version: CURRICULUM_VERSION,
    chapterIndex: 0,
    beatIndex: 0,
    completed: [],
    decisions: [],
    mastery: {},
    securityAwareness: 0,
    literacy: 0,
    started: false,
    finished: false
  };
}

function loadState(storage) {
  const base = freshState();
  try {
    const raw = storage.getItem('kitcity_web3_literacy_v2');
    if (!raw) return base;
    const saved = JSON.parse(raw);
    if (!saved || saved.version !== CURRICULUM_VERSION) return base;
    return { ...base, ...saved, decisions: Array.isArray(saved.decisions) ? saved.decisions : [], completed: Array.isArray(saved.completed) ? saved.completed : [], mastery: saved.mastery || {} };
  } catch (_) {
    return base;
  }
}

function saveState(storage, state) {
  try { storage.setItem('kitcity_web3_literacy_v2', JSON.stringify(state)); } catch (_) {}
}

function currentChapter(state) { return CHAPTERS[Math.min(state.chapterIndex, CHAPTERS.length - 1)]; }

export { CHAPTERS, CURRICULUM_VERSION, freshState, loadState, saveState, currentChapter };
