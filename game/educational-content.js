/**
 * KitCity educational library: story-led concepts and reusable mission trees.
 * All examples are authored and work offline. The content distinguishes current
 * capabilities from proposed applications and names a limitation in every mission.
 */
export const EDUCATIONAL_CONCEPTS = [
  {
    "id": "digital-ownership",
    "title": "Digital ownership",
    "explanation": "A digital file can be copied; a token is a record associated with an asset or claim. What rights that record gives depends on the actual terms, creator rights, platform and law.",
    "sectors": [
      "creative-industries",
      "commerce"
    ],
    "npcProfiles": [
      "musician",
      "designer",
      "trader"
    ],
    "scenario": "A creator wants buyers to distinguish an original collectible from copied files.",
    "complexity": "basic",
    "application": "A signed edition record can help buyers check which edition was issued.",
    "limitations": "A token does not automatically transfer copyright or stop copying.",
    "takeaway": "Ask what exactly is being sold: the file, a license, a collectible, or legal rights.",
    "prerequisites": []
  },
  {
    "id": "portable-credentials",
    "title": "Portable credentials",
    "explanation": "A verifiable credential is a claim issued by an identifiable organization and presented for checking. The technology can make checking easier, but it cannot make a dishonest issuer trustworthy.",
    "sectors": [
      "education",
      "employment"
    ],
    "npcProfiles": [
      "student",
      "recruiter",
      "school administrator"
    ],
    "scenario": "A graduate is asked to verify a qualification across borders.",
    "complexity": "basic",
    "application": "A school issues a digitally signed certificate that an employer can verify.",
    "limitations": "Recognition, issuer trust, privacy and access to verification still matter.",
    "takeaway": "Verify who issued the credential and whether the employer recognizes it.",
    "prerequisites": []
  },
  {
    "id": "agriculture-traceability",
    "title": "Agriculture traceability",
    "explanation": "Shared records can document where goods came from and how they moved. The value depends on reliable inspections, data entry and practical processes.",
    "sectors": [
      "agriculture",
      "commerce"
    ],
    "npcProfiles": [
      "farmer",
      "cooperative lead",
      "distributor"
    ],
    "scenario": "A buyer disputes the origin and handling history of a produce shipment.",
    "complexity": "basic",
    "application": "A cooperative links harvest, transport and inspection records.",
    "limitations": "A tamper-evident record cannot prove that the first physical-world claim was true.",
    "takeaway": "Keep evidence, allow corrections, and provide offline alternatives.",
    "prerequisites": []
  },
  {
    "id": "commerce-payments",
    "title": "Commerce and payments",
    "explanation": "Digital payments and shared records can coordinate orders and settlement. A blockchain is only one possible tool; fees, speed, regulation and user experience determine whether it helps.",
    "sectors": [
      "commerce",
      "finance"
    ],
    "npcProfiles": [
      "market trader",
      "supplier",
      "small business owner"
    ],
    "scenario": "A trader struggles to reconcile orders when customers pay in different ways.",
    "complexity": "basic",
    "application": "A simple order record links an invoice, payment reference and delivery confirmation.",
    "limitations": "Blockchain does not automatically make payments cheaper, reversible or fraud-proof.",
    "takeaway": "Compare with a regular database and mobile-money workflow before choosing.",
    "prerequisites": []
  },
  {
    "id": "health-data-rights",
    "title": "Health data rights",
    "explanation": "Patients need useful access to records without exposing sensitive details. Keep medical records in properly protected systems; use permissions and minimal verifiable references where suitable.",
    "sectors": [
      "healthcare",
      "privacy"
    ],
    "npcProfiles": [
      "nurse",
      "patient advocate",
      "clinic administrator"
    ],
    "scenario": "A patient changing clinics wants records shared without exposing them to strangers.",
    "complexity": "intermediate",
    "application": "A clinic shares a time-limited, permissioned reference to an off-chain record.",
    "limitations": "Publicly storing identifiable medical details can create lasting privacy harm.",
    "takeaway": "Minimize data, control access, revoke where possible, and follow health regulations.",
    "prerequisites": []
  },
  {
    "id": "smart-contracts",
    "title": "Smart contracts",
    "explanation": "A smart contract is software that automatically follows coded rules when triggered. It executes code, not moral judgment, and its output is not automatically legally enforceable.",
    "sectors": [
      "law",
      "commerce",
      "governance"
    ],
    "npcProfiles": [
      "lawyer",
      "business owner",
      "developer"
    ],
    "scenario": "Two small businesses disagree about a delayed delivery and an automated payment.",
    "complexity": "intermediate",
    "application": "A contract holds payment until a verified delivery event is submitted.",
    "limitations": "Bad code, unfair terms, disputed inputs and legal context remain problems.",
    "takeaway": "Ask who can trigger the contract, how errors are handled and what law applies.",
    "prerequisites": []
  },
  {
    "id": "professional-credentials",
    "title": "Proof of skills",
    "explanation": "A portable record can help someone present evidence of work, training or contributions. The strongest proof remains useful work that employers can inspect.",
    "sectors": [
      "employment",
      "education",
      "open source"
    ],
    "npcProfiles": [
      "job seeker",
      "recruiter",
      "craftsperson"
    ],
    "scenario": "A mechanic has skill but no formal certificate from a large institution.",
    "complexity": "basic",
    "application": "A portfolio combines signed training records, references and reviewed work samples.",
    "limitations": "A badge alone does not prove competence or guarantee employment.",
    "takeaway": "Build evidence people can independently assess; protect private details.",
    "prerequisites": [
      "portable-credentials"
    ]
  },
  {
    "id": "creative-rights",
    "title": "Creative rights",
    "explanation": "Digital records can timestamp claims and help track licenses or agreed revenue splits. Copyright, permissions and disputes still depend on evidence, contracts and jurisdiction.",
    "sectors": [
      "music",
      "art",
      "media"
    ],
    "npcProfiles": [
      "musician",
      "producer",
      "designer"
    ],
    "scenario": "A musician hears their work in an advert but is not credited or paid.",
    "complexity": "basic",
    "application": "A written license and transparent split record make agreed terms easier to track.",
    "limitations": "A token cannot by itself prove authorship or force every platform to honor a license.",
    "takeaway": "Record the agreement, identify rights holders and plan dispute handling.",
    "prerequisites": [
      "digital-ownership",
      "smart-contracts"
    ]
  },
  {
    "id": "community-governance",
    "title": "Community governance",
    "explanation": "Online proposals and voting can help groups coordinate decisions. The voting mechanism does not guarantee fair representation or prevent concentrated influence.",
    "sectors": [
      "community",
      "public administration",
      "open source"
    ],
    "npcProfiles": [
      "community organizer",
      "resident",
      "cooperative member"
    ],
    "scenario": "A neighborhood cooperative must decide how to spend a shared fund.",
    "complexity": "intermediate",
    "application": "Members publish proposals, disclose conflicts and track a decision log.",
    "limitations": "Low participation, bought influence, identity problems and voter fatigue can distort outcomes.",
    "takeaway": "Ask who gets a voice, how quorum works and how decisions can be challenged.",
    "prerequisites": []
  },
  {
    "id": "decentralized-identity",
    "title": "Digital identity and selective disclosure",
    "explanation": "Verifiable credentials can prove a specific claim without sharing every personal detail. Good systems reveal only what is necessary and avoid turning identity into public tracking.",
    "sectors": [
      "identity",
      "privacy",
      "employment"
    ],
    "npcProfiles": [
      "privacy advocate",
      "student",
      "service provider"
    ],
    "scenario": "A person needs to prove they meet an age or qualification requirement without exposing unrelated data.",
    "complexity": "intermediate",
    "application": "A credential can confirm a claim while withholding unrelated fields, when the system supports it.",
    "limitations": "Selective disclosure is not automatic; metadata, issuers and device security can still leak information.",
    "takeaway": "Share the minimum, check the verifier, and understand what can be correlated.",
    "prerequisites": [
      "portable-credentials"
    ]
  },
  {
    "id": "decentralized-infrastructure",
    "title": "Decentralized infrastructure",
    "explanation": "Distributed storage, computing and physical networks spread work across participants rather than one provider. They can improve resilience or access, but coordination and reliability still cost money.",
    "sectors": [
      "infrastructure",
      "connectivity",
      "computing"
    ],
    "npcProfiles": [
      "network operator",
      "small business owner",
      "community organizer"
    ],
    "scenario": "A community needs reliable connectivity beyond one provider's coverage.",
    "complexity": "intermediate",
    "application": "A local network combines several operators and has clear service and repair incentives.",
    "limitations": "Distributed systems can be slower, harder to govern, or unreliable if incentives fail.",
    "takeaway": "Compare uptime, support, cost and accountability with centralized options.",
    "prerequisites": []
  },
  {
    "id": "tokenization",
    "title": "Tokenization and real-world assets",
    "explanation": "A token can represent a claim or reference to an asset. The legal link between token and asset must be established and enforceable outside the token itself.",
    "sectors": [
      "property",
      "finance",
      "supply chain"
    ],
    "npcProfiles": [
      "lawyer",
      "cooperative member",
      "property administrator"
    ],
    "scenario": "A family is offered a token said to represent part ownership of a building.",
    "complexity": "intermediate",
    "application": "A regulated arrangement links token records to defined legal rights and a responsible custodian.",
    "limitations": "A token alone does not transfer land title, guarantee custody or prevent disputes.",
    "takeaway": "Read the legal documents, ownership registry, redemption rules and risks.",
    "prerequisites": [
      "smart-contracts"
    ]
  },
  {
    "id": "verifiable-ai",
    "title": "AI provenance and Web3",
    "explanation": "Cryptographic signatures and provenance records can help trace who published a file or model output and whether it changed. They do not prove that content is true or an AI is fair.",
    "sectors": [
      "AI",
      "media",
      "research"
    ],
    "npcProfiles": [
      "journalist",
      "AI developer",
      "researcher"
    ],
    "scenario": "A newsroom receives a viral clip with a claim that it is genuine.",
    "complexity": "intermediate",
    "application": "Signed source files and an audit trail support a provenance check.",
    "limitations": "A perfectly signed file can still contain misinformation; provenance is not truth verification.",
    "takeaway": "Check origin, independent evidence, model limits and human accountability.",
    "prerequisites": [
      "digital-ownership"
    ]
  },
  {
    "id": "security-and-limits",
    "title": "Security and personal responsibility",
    "explanation": "Self-custody gives a person control of signing keys, but losing or exposing them can lose access or authorize theft. Verify requests and use safer recovery practices.",
    "sectors": [
      "security",
      "finance",
      "identity"
    ],
    "npcProfiles": [
      "trader",
      "student",
      "small business owner"
    ],
    "scenario": "A friend receives a message demanding a seed phrase to unlock a reward.",
    "complexity": "basic",
    "application": "The person verifies the site independently, rejects the request and uses secure backups.",
    "limitations": "Transactions may be irreversible; support teams cannot magically recover exposed secrets.",
    "takeaway": "Never share seed phrases; check addresses, permissions, links and unrealistic promises.",
    "prerequisites": []
  },
  {
    "id": "open-internet",
    "title": "Open protocols and the internet",
    "explanation": "Open protocols allow independent services to communicate and users to move between compatible tools. Openness is not the same as decentralization, and switching costs remain.",
    "sectors": [
      "internet",
      "software",
      "social networks"
    ],
    "npcProfiles": [
      "developer",
      "creator",
      "community moderator"
    ],
    "scenario": "A creator loses access to an account and wants to carry their audience and work elsewhere.",
    "complexity": "intermediate",
    "application": "Exportable data and interoperable protocols make switching providers easier.",
    "limitations": "Platforms can still control interfaces, moderation, hosting and access; standards may not be adopted.",
    "takeaway": "Test portability, compatibility, moderation and who controls critical infrastructure.",
    "prerequisites": []
  }
];

export const EDUCATIONAL_PROFILES = [
  {
    "id": "credential-verifier",
    "name": "Nneka",
    "role": "School records officer",
    "personality": [
      "careful",
      "patient",
      "practical"
    ],
    "personalConcern": "Her office spends days confirming paper certificates.",
    "existingKnowledge": "Trusts official seals but worries about forged documents.",
    "communicationStyle": "Explains process step by step; asks who issued the claim.",
    "participationReason": "Help a graduate prove a qualification to an overseas employer."
  },
  {
    "id": "farm-coop",
    "name": "Musa",
    "role": "Smallholder farmer",
    "personality": [
      "observant",
      "patient",
      "skeptical"
    ],
    "personalConcern": "Buyers dispute where produce came from and when it was harvested.",
    "existingKnowledge": "Believes a notebook and cooperative witness are still essential.",
    "communicationStyle": "Concrete examples; no jargon; challenges unrealistic claims.",
    "participationReason": "Resolve a produce-origin dispute without exposing farmers' personal details."
  },
  {
    "id": "market-ledger",
    "name": "Amaka",
    "role": "Market trader",
    "personality": [
      "witty",
      "practical",
      "sharp"
    ],
    "personalConcern": "She loses time reconciling cash, transfers and orders.",
    "existingKnowledge": "Believes technology often ignores weak networks and busy stalls.",
    "communicationStyle": "Short direct questions and lively market phrasing.",
    "participationReason": "Reconcile an order and payment while comparing simple tools."
  },
  {
    "id": "clinic-privacy",
    "name": "Halima",
    "role": "Community health worker",
    "personality": [
      "empathetic",
      "cautious",
      "firm"
    ],
    "personalConcern": "A patient needs records at a new clinic but fears gossip.",
    "existingKnowledge": "Knows confidentiality matters; unsure how digital sharing can be limited.",
    "communicationStyle": "Gentle, careful, asks about consent and access.",
    "participationReason": "Share the minimum necessary record through controlled access."
  },
  {
    "id": "legal-clerk",
    "name": "Barrister Eze",
    "role": "Small-business lawyer",
    "personality": [
      "analytical",
      "skeptical",
      "precise"
    ],
    "personalConcern": "A client assumes automated code settles a contract dispute.",
    "existingKnowledge": "Knows that law, evidence and jurisdiction still matter.",
    "communicationStyle": "Asks who is liable and what happens when inputs are wrong.",
    "participationReason": "Review a smart payment clause against real-world obligations."
  },
  {
    "id": "skills-mentor",
    "name": "Chidi",
    "role": "Motor-park mechanic and mentor",
    "personality": [
      "funny",
      "resourceful",
      "distrusts hype"
    ],
    "personalConcern": "He needs evidence of skill to win remote repair work.",
    "existingKnowledge": "Trusts demonstrated ability more than badges.",
    "communicationStyle": "Uses workshop comparisons and asks to see proof.",
    "participationReason": "Build a portable work record without exposing customer details."
  },
  {
    "id": "music-producer",
    "name": "Tayo",
    "role": "Independent musician",
    "personality": [
      "expressive",
      "proud",
      "skeptical"
    ],
    "personalConcern": "His beat was used in an advert without clear credit or payment.",
    "existingKnowledge": "Believes exposure is often used as an excuse not to pay creators.",
    "communicationStyle": "Vivid examples; pushes back on vague promises.",
    "participationReason": "Clarify rights and revenue split before releasing a track."
  },
  {
    "id": "community-steward",
    "name": "Aisha",
    "role": "Cooperative organizer",
    "personality": [
      "fair-minded",
      "persistent"
    ],
    "personalConcern": "Members disagree over spending and few attend meetings.",
    "existingKnowledge": "Wants transparency but fears wealthy members will dominate votes.",
    "communicationStyle": "Invites disagreement and asks whose voice is missing.",
    "participationReason": "Design a decision process with quorum and appeal rules."
  },
  {
    "id": "privacy-guide",
    "name": "Zainab",
    "role": "Student designer and privacy advocate",
    "personality": [
      "curious",
      "direct",
      "ambitious"
    ],
    "personalConcern": "She must prove a qualification without sharing all her personal data.",
    "existingKnowledge": "Believes verification should not require a public life history.",
    "communicationStyle": "Clear questions; calls out unnecessary data collection.",
    "participationReason": "Share one credential claim while minimizing disclosure."
  },
  {
    "id": "network-builder",
    "name": "Emeka",
    "role": "Community network technician",
    "personality": [
      "inventive",
      "grounded"
    ],
    "personalConcern": "A neighborhood's connection fails when one provider is down.",
    "existingKnowledge": "Likes shared infrastructure but worries about maintenance and accountability.",
    "communicationStyle": "Practical engineering language, explains trade-offs.",
    "participationReason": "Compare a community network with a single-provider plan."
  },
  {
    "id": "property-clerk",
    "name": "Mrs Danjuma",
    "role": "Property documentation clerk",
    "personality": [
      "methodical",
      "cautious"
    ],
    "personalConcern": "A family is offered fractional tokens in a building with unclear title.",
    "existingKnowledge": "Insists paper title, custody and legal rights still matter.",
    "communicationStyle": "Careful and asks to see documents before believing claims.",
    "participationReason": "Identify what legal rights a property token actually represents."
  },
  {
    "id": "news-researcher",
    "name": "Fola",
    "role": "Local journalist",
    "personality": [
      "curious",
      "evidence-first"
    ],
    "personalConcern": "A viral AI-generated clip is being shared as proof of an event.",
    "existingKnowledge": "Knows metadata can help but is not proof of truth.",
    "communicationStyle": "Asks who filmed it and what independent evidence exists.",
    "participationReason": "Check provenance without confusing authenticity with truth."
  },
  {
    "id": "security-coach",
    "name": "Ifeanyi",
    "role": "Phone repair technician",
    "personality": [
      "blunt",
      "protective",
      "street-smart"
    ],
    "personalConcern": "A customer nearly gives a stranger their recovery phrase.",
    "existingKnowledge": "Knows mistakes happen under pressure and avoids shaming victims.",
    "communicationStyle": "Plain warnings and practical next steps.",
    "participationReason": "Spot a phishing attempt and choose a safer recovery plan."
  },
  {
    "id": "open-source-builder",
    "name": "Dayo",
    "role": "Software developer",
    "personality": [
      "collaborative",
      "independent"
    ],
    "personalConcern": "A creator cannot move followers and content when a platform blocks them.",
    "existingKnowledge": "Likes open standards but knows network effects are hard to beat.",
    "communicationStyle": "Uses relatable app examples; challenges 'decentralized' branding.",
    "participationReason": "Compare export, interoperability and actual control."
  },
  {
    "id": "creator-rights",
    "name": "Tomi",
    "role": "Student illustrator and designer",
    "personality": [
      "thoughtful",
      "ambitious"
    ],
    "personalConcern": "Her artwork is copied and she is unsure what a token would protect.",
    "existingKnowledge": "Values attribution but knows legal rights can be complicated.",
    "communicationStyle": "Asks what was sold and what permission was granted.",
    "participationReason": "Distinguish a collectible record from copyright and license rights."
  }
];

export const EDUCATIONAL_MISSIONS = [
  {
    "id": "learn-digital-ownership",
    "conceptId": "digital-ownership",
    "title": "A problem before a protocol: Digital ownership",
    "npcId": "creator-rights",
    "npcName": "Tomi",
    "role": "Student illustrator and designer",
    "personality": "Thoughtful, ambitious",
    "personalConcern": "Her artwork is copied and she is unsure what a token would protect.",
    "existingKnowledge": "Values attribution but knows legal rights can be complicated.",
    "communicationStyle": "Asks what was sold and what permission was granted.",
    "participationReason": "Distinguish a collectible record from copyright and license rights.",
    "sectors": [
      "creative-industries",
      "commerce"
    ],
    "scenario": "A creator wants buyers to distinguish an original collectible from copied files.",
    "complexity": "basic",
    "prerequisites": [],
    "conceptTags": [
      "digital-ownership",
      "creative-industries",
      "commerce"
    ],
    "explanation": "A digital file can be copied; a token is a record associated with an asset or claim. What rights that record gives depends on the actual terms, creator rights, platform and law.",
    "application": "A signed edition record can help buyers check which edition was issued.",
    "limitations": "A token does not automatically transfer copyright or stop copying.",
    "takeaway": "Ask what exactly is being sold: the file, a license, a collectible, or legal rights.",
    "optionalFollowUps": [
      {
        "id": "digital-ownership-deeper",
        "title": "Explore a harder case",
        "optional": true
      }
    ],
    "nodes": {
      "opening": {
        "text": "A creator wants buyers to distinguish an original collectible from copied files.",
        "choices": [
          {
            "id": "ask-practical",
            "label": "Ask what would help in practice",
            "next": "application",
            "effects": {
              "knowledge": [
                "digital-ownership-problem-framing"
              ]
            }
          },
          {
            "id": "challenge-hype",
            "label": "Question whether this needs Web3 at all",
            "next": "compare",
            "effects": {
              "flags": {
                "digital-ownership-questioned-necessity": true
              }
            }
          },
          {
            "id": "hear-concern",
            "label": "Ask what worries them most",
            "next": "limitation"
          }
        ]
      },
      "application": {
        "text": "A signed edition record can help buyers check which edition was issued.",
        "choices": [
          {
            "id": "how-work",
            "label": "How would that work, simply?",
            "next": "explain",
            "effects": {
              "knowledge": [
                "digital-ownership"
              ]
            }
          },
          {
            "id": "who-benefits",
            "label": "Who benefits—and who might be left out?",
            "next": "limitation"
          },
          {
            "id": "finish-idea",
            "label": "Keep the idea small and testable",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "compare": {
        "text": "Fair question. A normal database or existing process may solve this more simply. Compare who needs to trust whom, the cost, privacy, and what happens when something goes wrong.",
        "choices": [
          {
            "id": "compare-cost",
            "label": "Compare cost, control and usability first",
            "next": "explain",
            "effects": {
              "knowledge": [
                "not-everything-needs-blockchain"
              ]
            }
          },
          {
            "id": "continue-story",
            "label": "Show me the useful part without the hype",
            "next": "application"
          }
        ]
      },
      "explain": {
        "text": "A digital file can be copied; a token is a record associated with an asset or claim. What rights that record gives depends on the actual terms, creator rights, platform and law.",
        "choices": [
          {
            "id": "limitation",
            "label": "What could still go wrong?",
            "next": "limitation",
            "effects": {
              "knowledge": [
                "digital-ownership"
              ]
            }
          },
          {
            "id": "real-world",
            "label": "What would a realistic first trial look like?",
            "next": "trial"
          }
        ]
      },
      "limitation": {
        "text": "A token does not automatically transfer copyright or stop copying.",
        "choices": [
          {
            "id": "design-around",
            "label": "What safeguard would you add?",
            "next": "trial",
            "effects": {
              "knowledge": [
                "digital-ownership-limitations"
              ]
            }
          },
          {
            "id": "accept-tradeoff",
            "label": "That trade-off may be worth knowing before deciding",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "trial": {
        "text": "Start with one small group, clear consent, a way to correct errors, a low-tech fallback, and measures for time, cost and trust. Compare it with the simplest non-blockchain option before scaling.",
        "choices": [
          {
            "id": "takeaway",
            "label": "That sounds testable",
            "next": "takeaway",
            "effects": {
              "flags": {
                "digital-ownership-trial-designed": true
              }
            }
          },
          {
            "id": "ask-limits",
            "label": "Who is accountable if it fails?",
            "next": "limitation"
          }
        ]
      },
      "takeaway": {
        "text": "The useful discovery: Ask what exactly is being sold: the file, a license, a collectible, or legal rights.",
        "choices": [
          {
            "id": "finish",
            "label": "I’ll use that when I evaluate a real project",
            "end": true,
            "completeConversation": true,
            "completeMission": "learn-digital-ownership",
            "effects": {
              "knowledge": [
                "digital-ownership"
              ],
              "trust": 1,
              "flags": {
                "digital-ownership-takeaway-seen": true
              }
            }
          }
        ]
      }
    },
    "start": "opening",
    "missionId": "learn-digital-ownership",
    "reward": {
      "xp": 18,
      "ngn": 25
    },
    "position": {
      "x": 175,
      "z": -50,
      "f": -1
    },
    "domain": "Digital ownership"
  },
  {
    "id": "learn-portable-credentials",
    "conceptId": "portable-credentials",
    "title": "A problem before a protocol: Portable credentials",
    "npcId": "credential-verifier",
    "npcName": "Nneka",
    "role": "School records officer",
    "personality": "Careful, patient, practical",
    "personalConcern": "Her office spends days confirming paper certificates.",
    "existingKnowledge": "Trusts official seals but worries about forged documents.",
    "communicationStyle": "Explains process step by step; asks who issued the claim.",
    "participationReason": "Help a graduate prove a qualification to an overseas employer.",
    "sectors": [
      "education",
      "employment"
    ],
    "scenario": "A graduate is asked to verify a qualification across borders.",
    "complexity": "basic",
    "prerequisites": [],
    "conceptTags": [
      "portable-credentials",
      "education",
      "employment"
    ],
    "explanation": "A verifiable credential is a claim issued by an identifiable organization and presented for checking. The technology can make checking easier, but it cannot make a dishonest issuer trustworthy.",
    "application": "A school issues a digitally signed certificate that an employer can verify.",
    "limitations": "Recognition, issuer trust, privacy and access to verification still matter.",
    "takeaway": "Verify who issued the credential and whether the employer recognizes it.",
    "optionalFollowUps": [
      {
        "id": "portable-credentials-deeper",
        "title": "Explore a harder case",
        "optional": true
      }
    ],
    "nodes": {
      "opening": {
        "text": "A graduate is asked to verify a qualification across borders.",
        "choices": [
          {
            "id": "ask-practical",
            "label": "Ask what would help in practice",
            "next": "application",
            "effects": {
              "knowledge": [
                "portable-credentials-problem-framing"
              ]
            }
          },
          {
            "id": "challenge-hype",
            "label": "Question whether this needs Web3 at all",
            "next": "compare",
            "effects": {
              "flags": {
                "portable-credentials-questioned-necessity": true
              }
            }
          },
          {
            "id": "hear-concern",
            "label": "Ask what worries them most",
            "next": "limitation"
          }
        ]
      },
      "application": {
        "text": "A school issues a digitally signed certificate that an employer can verify.",
        "choices": [
          {
            "id": "how-work",
            "label": "How would that work, simply?",
            "next": "explain",
            "effects": {
              "knowledge": [
                "portable-credentials"
              ]
            }
          },
          {
            "id": "who-benefits",
            "label": "Who benefits—and who might be left out?",
            "next": "limitation"
          },
          {
            "id": "finish-idea",
            "label": "Keep the idea small and testable",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "compare": {
        "text": "Fair question. A normal database or existing process may solve this more simply. Compare who needs to trust whom, the cost, privacy, and what happens when something goes wrong.",
        "choices": [
          {
            "id": "compare-cost",
            "label": "Compare cost, control and usability first",
            "next": "explain",
            "effects": {
              "knowledge": [
                "not-everything-needs-blockchain"
              ]
            }
          },
          {
            "id": "continue-story",
            "label": "Show me the useful part without the hype",
            "next": "application"
          }
        ]
      },
      "explain": {
        "text": "A verifiable credential is a claim issued by an identifiable organization and presented for checking. The technology can make checking easier, but it cannot make a dishonest issuer trustworthy.",
        "choices": [
          {
            "id": "limitation",
            "label": "What could still go wrong?",
            "next": "limitation",
            "effects": {
              "knowledge": [
                "portable-credentials"
              ]
            }
          },
          {
            "id": "real-world",
            "label": "What would a realistic first trial look like?",
            "next": "trial"
          }
        ]
      },
      "limitation": {
        "text": "Recognition, issuer trust, privacy and access to verification still matter.",
        "choices": [
          {
            "id": "design-around",
            "label": "What safeguard would you add?",
            "next": "trial",
            "effects": {
              "knowledge": [
                "portable-credentials-limitations"
              ]
            }
          },
          {
            "id": "accept-tradeoff",
            "label": "That trade-off may be worth knowing before deciding",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "trial": {
        "text": "Start with one small group, clear consent, a way to correct errors, a low-tech fallback, and measures for time, cost and trust. Compare it with the simplest non-blockchain option before scaling.",
        "choices": [
          {
            "id": "takeaway",
            "label": "That sounds testable",
            "next": "takeaway",
            "effects": {
              "flags": {
                "portable-credentials-trial-designed": true
              }
            }
          },
          {
            "id": "ask-limits",
            "label": "Who is accountable if it fails?",
            "next": "limitation"
          }
        ]
      },
      "takeaway": {
        "text": "The useful discovery: Verify who issued the credential and whether the employer recognizes it.",
        "choices": [
          {
            "id": "finish",
            "label": "I’ll use that when I evaluate a real project",
            "end": true,
            "completeConversation": true,
            "completeMission": "learn-portable-credentials",
            "effects": {
              "knowledge": [
                "portable-credentials"
              ],
              "trust": 1,
              "flags": {
                "portable-credentials-takeaway-seen": true
              }
            }
          }
        ]
      }
    },
    "start": "opening",
    "missionId": "learn-portable-credentials",
    "reward": {
      "xp": 18,
      "ngn": 25
    },
    "position": {
      "x": -175,
      "z": -50,
      "f": 1
    },
    "domain": "Education"
  },
  {
    "id": "learn-agriculture-traceability",
    "conceptId": "agriculture-traceability",
    "title": "A problem before a protocol: Agriculture traceability",
    "npcId": "farm-coop",
    "npcName": "Musa",
    "role": "Smallholder farmer",
    "personality": "Observant, patient, skeptical",
    "personalConcern": "Buyers dispute where produce came from and when it was harvested.",
    "existingKnowledge": "Believes a notebook and cooperative witness are still essential.",
    "communicationStyle": "Concrete examples; no jargon; challenges unrealistic claims.",
    "participationReason": "Resolve a produce-origin dispute without exposing farmers' personal details.",
    "sectors": [
      "agriculture",
      "commerce"
    ],
    "scenario": "A buyer disputes the origin and handling history of a produce shipment.",
    "complexity": "basic",
    "prerequisites": [],
    "conceptTags": [
      "agriculture-traceability",
      "agriculture",
      "commerce"
    ],
    "explanation": "Shared records can document where goods came from and how they moved. The value depends on reliable inspections, data entry and practical processes.",
    "application": "A cooperative links harvest, transport and inspection records.",
    "limitations": "A tamper-evident record cannot prove that the first physical-world claim was true.",
    "takeaway": "Keep evidence, allow corrections, and provide offline alternatives.",
    "optionalFollowUps": [
      {
        "id": "agriculture-traceability-deeper",
        "title": "Explore a harder case",
        "optional": true
      }
    ],
    "nodes": {
      "opening": {
        "text": "A buyer disputes the origin and handling history of a produce shipment.",
        "choices": [
          {
            "id": "ask-practical",
            "label": "Ask what would help in practice",
            "next": "application",
            "effects": {
              "knowledge": [
                "agriculture-traceability-problem-framing"
              ]
            }
          },
          {
            "id": "challenge-hype",
            "label": "Question whether this needs Web3 at all",
            "next": "compare",
            "effects": {
              "flags": {
                "agriculture-traceability-questioned-necessity": true
              }
            }
          },
          {
            "id": "hear-concern",
            "label": "Ask what worries them most",
            "next": "limitation"
          }
        ]
      },
      "application": {
        "text": "A cooperative links harvest, transport and inspection records.",
        "choices": [
          {
            "id": "how-work",
            "label": "How would that work, simply?",
            "next": "explain",
            "effects": {
              "knowledge": [
                "agriculture-traceability"
              ]
            }
          },
          {
            "id": "who-benefits",
            "label": "Who benefits—and who might be left out?",
            "next": "limitation"
          },
          {
            "id": "finish-idea",
            "label": "Keep the idea small and testable",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "compare": {
        "text": "Fair question. A shared database with a trusted cooperative might be enough; use a blockchain only if independent parties need a shared record without one operator controlling every update.",
        "choices": [
          {
            "id": "compare-cost",
            "label": "Compare cost, control and usability first",
            "next": "explain",
            "effects": {
              "knowledge": [
                "not-everything-needs-blockchain"
              ]
            }
          },
          {
            "id": "continue-story",
            "label": "Show me the useful part without the hype",
            "next": "application"
          }
        ]
      },
      "explain": {
        "text": "Shared records can document where goods came from and how they moved. The value depends on reliable inspections, data entry and practical processes.",
        "choices": [
          {
            "id": "limitation",
            "label": "What could still go wrong?",
            "next": "limitation",
            "effects": {
              "knowledge": [
                "agriculture-traceability"
              ]
            }
          },
          {
            "id": "real-world",
            "label": "What would a realistic first trial look like?",
            "next": "trial"
          }
        ]
      },
      "limitation": {
        "text": "A tamper-evident record cannot prove that the first physical-world claim was true.",
        "choices": [
          {
            "id": "design-around",
            "label": "What safeguard would you add?",
            "next": "trial",
            "effects": {
              "knowledge": [
                "agriculture-traceability-limitations"
              ]
            }
          },
          {
            "id": "accept-tradeoff",
            "label": "That trade-off may be worth knowing before deciding",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "trial": {
        "text": "Start with one small group, clear consent, a way to correct errors, a low-tech fallback, and measures for time, cost and trust. Compare it with the simplest non-blockchain option before scaling.",
        "choices": [
          {
            "id": "takeaway",
            "label": "That sounds testable",
            "next": "takeaway",
            "effects": {
              "flags": {
                "agriculture-traceability-trial-designed": true
              }
            }
          },
          {
            "id": "ask-limits",
            "label": "Who is accountable if it fails?",
            "next": "limitation"
          }
        ]
      },
      "takeaway": {
        "text": "The useful discovery: Keep evidence, allow corrections, and provide offline alternatives.",
        "choices": [
          {
            "id": "finish",
            "label": "I’ll use that when I evaluate a real project",
            "end": true,
            "completeConversation": true,
            "completeMission": "learn-agriculture-traceability",
            "effects": {
              "knowledge": [
                "agriculture-traceability"
              ],
              "trust": 1,
              "flags": {
                "agriculture-traceability-takeaway-seen": true
              }
            }
          }
        ]
      }
    },
    "start": "opening",
    "missionId": "learn-agriculture-traceability",
    "reward": {
      "xp": 18,
      "ngn": 25
    },
    "position": {
      "x": 45,
      "z": -215,
      "f": -1
    },
    "domain": "Agriculture"
  },
  {
    "id": "learn-commerce-payments",
    "conceptId": "commerce-payments",
    "title": "A problem before a protocol: Commerce and payments",
    "npcId": "market-ledger",
    "npcName": "Amaka",
    "role": "Market trader",
    "personality": "Witty, practical, sharp",
    "personalConcern": "She loses time reconciling cash, transfers and orders.",
    "existingKnowledge": "Believes technology often ignores weak networks and busy stalls.",
    "communicationStyle": "Short direct questions and lively market phrasing.",
    "participationReason": "Reconcile an order and payment while comparing simple tools.",
    "sectors": [
      "commerce",
      "finance"
    ],
    "scenario": "A trader struggles to reconcile orders when customers pay in different ways.",
    "complexity": "basic",
    "prerequisites": [],
    "conceptTags": [
      "commerce-payments",
      "commerce",
      "finance"
    ],
    "explanation": "Digital payments and shared records can coordinate orders and settlement. A blockchain is only one possible tool; fees, speed, regulation and user experience determine whether it helps.",
    "application": "A simple order record links an invoice, payment reference and delivery confirmation.",
    "limitations": "Blockchain does not automatically make payments cheaper, reversible or fraud-proof.",
    "takeaway": "Compare with a regular database and mobile-money workflow before choosing.",
    "optionalFollowUps": [
      {
        "id": "commerce-payments-deeper",
        "title": "Explore a harder case",
        "optional": true
      }
    ],
    "nodes": {
      "opening": {
        "text": "A trader struggles to reconcile orders when customers pay in different ways.",
        "choices": [
          {
            "id": "ask-practical",
            "label": "Ask what would help in practice",
            "next": "application",
            "effects": {
              "knowledge": [
                "commerce-payments-problem-framing"
              ]
            }
          },
          {
            "id": "challenge-hype",
            "label": "Question whether this needs Web3 at all",
            "next": "compare",
            "effects": {
              "flags": {
                "commerce-payments-questioned-necessity": true
              }
            }
          },
          {
            "id": "hear-concern",
            "label": "Ask what worries them most",
            "next": "limitation"
          }
        ]
      },
      "application": {
        "text": "A simple order record links an invoice, payment reference and delivery confirmation.",
        "choices": [
          {
            "id": "how-work",
            "label": "How would that work, simply?",
            "next": "explain",
            "effects": {
              "knowledge": [
                "commerce-payments"
              ]
            }
          },
          {
            "id": "who-benefits",
            "label": "Who benefits—and who might be left out?",
            "next": "limitation"
          },
          {
            "id": "finish-idea",
            "label": "Keep the idea small and testable",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "compare": {
        "text": "Fair question. A normal database or existing process may solve this more simply. Compare who needs to trust whom, the cost, privacy, and what happens when something goes wrong.",
        "choices": [
          {
            "id": "compare-cost",
            "label": "Compare cost, control and usability first",
            "next": "explain",
            "effects": {
              "knowledge": [
                "not-everything-needs-blockchain"
              ]
            }
          },
          {
            "id": "continue-story",
            "label": "Show me the useful part without the hype",
            "next": "application"
          }
        ]
      },
      "explain": {
        "text": "Digital payments and shared records can coordinate orders and settlement. A blockchain is only one possible tool; fees, speed, regulation and user experience determine whether it helps.",
        "choices": [
          {
            "id": "limitation",
            "label": "What could still go wrong?",
            "next": "limitation",
            "effects": {
              "knowledge": [
                "commerce-payments"
              ]
            }
          },
          {
            "id": "real-world",
            "label": "What would a realistic first trial look like?",
            "next": "trial"
          }
        ]
      },
      "limitation": {
        "text": "Blockchain does not automatically make payments cheaper, reversible or fraud-proof.",
        "choices": [
          {
            "id": "design-around",
            "label": "What safeguard would you add?",
            "next": "trial",
            "effects": {
              "knowledge": [
                "commerce-payments-limitations"
              ]
            }
          },
          {
            "id": "accept-tradeoff",
            "label": "That trade-off may be worth knowing before deciding",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "trial": {
        "text": "Start with one small group, clear consent, a way to correct errors, a low-tech fallback, and measures for time, cost and trust. Compare it with the simplest non-blockchain option before scaling.",
        "choices": [
          {
            "id": "takeaway",
            "label": "That sounds testable",
            "next": "takeaway",
            "effects": {
              "flags": {
                "commerce-payments-trial-designed": true
              }
            }
          },
          {
            "id": "ask-limits",
            "label": "Who is accountable if it fails?",
            "next": "limitation"
          }
        ]
      },
      "takeaway": {
        "text": "The useful discovery: Compare with a regular database and mobile-money workflow before choosing.",
        "choices": [
          {
            "id": "finish",
            "label": "I’ll use that when I evaluate a real project",
            "end": true,
            "completeConversation": true,
            "completeMission": "learn-commerce-payments",
            "effects": {
              "knowledge": [
                "commerce-payments"
              ],
              "trust": 1,
              "flags": {
                "commerce-payments-takeaway-seen": true
              }
            }
          }
        ]
      }
    },
    "start": "opening",
    "missionId": "learn-commerce-payments",
    "reward": {
      "xp": 18,
      "ngn": 25
    },
    "position": {
      "x": -45,
      "z": -215,
      "f": 1
    },
    "domain": "Commerce"
  },
  {
    "id": "learn-health-data-rights",
    "conceptId": "health-data-rights",
    "title": "A problem before a protocol: Health data rights",
    "npcId": "clinic-privacy",
    "npcName": "Halima",
    "role": "Community health worker",
    "personality": "Empathetic, cautious, firm",
    "personalConcern": "A patient needs records at a new clinic but fears gossip.",
    "existingKnowledge": "Knows confidentiality matters; unsure how digital sharing can be limited.",
    "communicationStyle": "Gentle, careful, asks about consent and access.",
    "participationReason": "Share the minimum necessary record through controlled access.",
    "sectors": [
      "healthcare",
      "privacy"
    ],
    "scenario": "A patient changing clinics wants records shared without exposing them to strangers.",
    "complexity": "intermediate",
    "prerequisites": [],
    "conceptTags": [
      "health-data-rights",
      "healthcare",
      "privacy"
    ],
    "explanation": "Patients need useful access to records without exposing sensitive details. Keep medical records in properly protected systems; use permissions and minimal verifiable references where suitable.",
    "application": "A clinic shares a time-limited, permissioned reference to an off-chain record.",
    "limitations": "Publicly storing identifiable medical details can create lasting privacy harm.",
    "takeaway": "Minimize data, control access, revoke where possible, and follow health regulations.",
    "optionalFollowUps": [
      {
        "id": "health-data-rights-deeper",
        "title": "Explore a harder case",
        "optional": true
      }
    ],
    "nodes": {
      "opening": {
        "text": "A patient changing clinics wants records shared without exposing them to strangers.",
        "choices": [
          {
            "id": "ask-practical",
            "label": "Ask what would help in practice",
            "next": "application",
            "effects": {
              "knowledge": [
                "health-data-rights-problem-framing"
              ]
            }
          },
          {
            "id": "challenge-hype",
            "label": "Question whether this needs Web3 at all",
            "next": "compare",
            "effects": {
              "flags": {
                "health-data-rights-questioned-necessity": true
              }
            }
          },
          {
            "id": "hear-concern",
            "label": "Ask what worries them most",
            "next": "limitation"
          }
        ]
      },
      "application": {
        "text": "A clinic shares a time-limited, permissioned reference to an off-chain record.",
        "choices": [
          {
            "id": "how-work",
            "label": "How would that work, simply?",
            "next": "explain",
            "effects": {
              "knowledge": [
                "health-data-rights"
              ]
            }
          },
          {
            "id": "who-benefits",
            "label": "Who benefits—and who might be left out?",
            "next": "limitation"
          },
          {
            "id": "finish-idea",
            "label": "Keep the idea small and testable",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "compare": {
        "text": "Fair question. A normal database or existing process may solve this more simply. Compare who needs to trust whom, the cost, privacy, and what happens when something goes wrong.",
        "choices": [
          {
            "id": "compare-cost",
            "label": "Compare cost, control and usability first",
            "next": "explain",
            "effects": {
              "knowledge": [
                "not-everything-needs-blockchain"
              ]
            }
          },
          {
            "id": "continue-story",
            "label": "Show me the useful part without the hype",
            "next": "application"
          }
        ]
      },
      "explain": {
        "text": "Patients need useful access to records without exposing sensitive details. Keep medical records in properly protected systems; use permissions and minimal verifiable references where suitable.",
        "choices": [
          {
            "id": "limitation",
            "label": "What could still go wrong?",
            "next": "limitation",
            "effects": {
              "knowledge": [
                "health-data-rights"
              ]
            }
          },
          {
            "id": "real-world",
            "label": "What would a realistic first trial look like?",
            "next": "trial"
          }
        ]
      },
      "limitation": {
        "text": "Publicly storing identifiable medical details can create lasting privacy harm.",
        "choices": [
          {
            "id": "design-around",
            "label": "What safeguard would you add?",
            "next": "trial",
            "effects": {
              "knowledge": [
                "health-data-rights-limitations"
              ]
            }
          },
          {
            "id": "accept-tradeoff",
            "label": "That trade-off may be worth knowing before deciding",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "trial": {
        "text": "Start with one small group, clear consent, a way to correct errors, a low-tech fallback, and measures for time, cost and trust. Compare it with the simplest non-blockchain option before scaling.",
        "choices": [
          {
            "id": "takeaway",
            "label": "That sounds testable",
            "next": "takeaway",
            "effects": {
              "flags": {
                "health-data-rights-trial-designed": true
              }
            }
          },
          {
            "id": "ask-limits",
            "label": "Who is accountable if it fails?",
            "next": "limitation"
          }
        ]
      },
      "takeaway": {
        "text": "The useful discovery: Minimize data, control access, revoke where possible, and follow health regulations.",
        "choices": [
          {
            "id": "finish",
            "label": "I’ll use that when I evaluate a real project",
            "end": true,
            "completeConversation": true,
            "completeMission": "learn-health-data-rights",
            "effects": {
              "knowledge": [
                "health-data-rights"
              ],
              "trust": 1,
              "flags": {
                "health-data-rights-takeaway-seen": true
              }
            }
          }
        ]
      }
    },
    "start": "opening",
    "missionId": "learn-health-data-rights",
    "reward": {
      "xp": 18,
      "ngn": 25
    },
    "position": {
      "x": 175,
      "z": -145,
      "f": -1
    },
    "domain": "Healthcare"
  },
  {
    "id": "learn-smart-contracts",
    "conceptId": "smart-contracts",
    "title": "A problem before a protocol: Smart contracts",
    "npcId": "legal-clerk",
    "npcName": "Barrister Eze",
    "role": "Small-business lawyer",
    "personality": "Analytical, skeptical, precise",
    "personalConcern": "A client assumes automated code settles a contract dispute.",
    "existingKnowledge": "Knows that law, evidence and jurisdiction still matter.",
    "communicationStyle": "Asks who is liable and what happens when inputs are wrong.",
    "participationReason": "Review a smart payment clause against real-world obligations.",
    "sectors": [
      "law",
      "commerce",
      "governance"
    ],
    "scenario": "Two small businesses disagree about a delayed delivery and an automated payment.",
    "complexity": "intermediate",
    "prerequisites": [],
    "conceptTags": [
      "smart-contracts",
      "law",
      "commerce",
      "governance"
    ],
    "explanation": "A smart contract is software that automatically follows coded rules when triggered. It executes code, not moral judgment, and its output is not automatically legally enforceable.",
    "application": "A contract holds payment until a verified delivery event is submitted.",
    "limitations": "Bad code, unfair terms, disputed inputs and legal context remain problems.",
    "takeaway": "Ask who can trigger the contract, how errors are handled and what law applies.",
    "optionalFollowUps": [
      {
        "id": "smart-contracts-deeper",
        "title": "Explore a harder case",
        "optional": true
      }
    ],
    "nodes": {
      "opening": {
        "text": "Two small businesses disagree about a delayed delivery and an automated payment.",
        "choices": [
          {
            "id": "ask-practical",
            "label": "Ask what would help in practice",
            "next": "application",
            "effects": {
              "knowledge": [
                "smart-contracts-problem-framing"
              ]
            }
          },
          {
            "id": "challenge-hype",
            "label": "Question whether this needs Web3 at all",
            "next": "compare",
            "effects": {
              "flags": {
                "smart-contracts-questioned-necessity": true
              }
            }
          },
          {
            "id": "hear-concern",
            "label": "Ask what worries them most",
            "next": "limitation"
          }
        ]
      },
      "application": {
        "text": "A contract holds payment until a verified delivery event is submitted.",
        "choices": [
          {
            "id": "how-work",
            "label": "How would that work, simply?",
            "next": "explain",
            "effects": {
              "knowledge": [
                "smart-contracts"
              ]
            }
          },
          {
            "id": "who-benefits",
            "label": "Who benefits—and who might be left out?",
            "next": "limitation"
          },
          {
            "id": "finish-idea",
            "label": "Keep the idea small and testable",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "compare": {
        "text": "Fair question. A normal database or existing process may solve this more simply. Compare who needs to trust whom, the cost, privacy, and what happens when something goes wrong.",
        "choices": [
          {
            "id": "compare-cost",
            "label": "Compare cost, control and usability first",
            "next": "explain",
            "effects": {
              "knowledge": [
                "not-everything-needs-blockchain"
              ]
            }
          },
          {
            "id": "continue-story",
            "label": "Show me the useful part without the hype",
            "next": "application"
          }
        ]
      },
      "explain": {
        "text": "A smart contract is software that automatically follows coded rules when triggered. It executes code, not moral judgment, and its output is not automatically legally enforceable.",
        "choices": [
          {
            "id": "limitation",
            "label": "What could still go wrong?",
            "next": "limitation",
            "effects": {
              "knowledge": [
                "smart-contracts"
              ]
            }
          },
          {
            "id": "real-world",
            "label": "What would a realistic first trial look like?",
            "next": "trial"
          }
        ]
      },
      "limitation": {
        "text": "Bad code, unfair terms, disputed inputs and legal context remain problems.",
        "choices": [
          {
            "id": "design-around",
            "label": "What safeguard would you add?",
            "next": "trial",
            "effects": {
              "knowledge": [
                "smart-contracts-limitations"
              ]
            }
          },
          {
            "id": "accept-tradeoff",
            "label": "That trade-off may be worth knowing before deciding",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "trial": {
        "text": "Start with one small group, clear consent, a way to correct errors, a low-tech fallback, and measures for time, cost and trust. Compare it with the simplest non-blockchain option before scaling.",
        "choices": [
          {
            "id": "takeaway",
            "label": "That sounds testable",
            "next": "takeaway",
            "effects": {
              "flags": {
                "smart-contracts-trial-designed": true
              }
            }
          },
          {
            "id": "ask-limits",
            "label": "Who is accountable if it fails?",
            "next": "limitation"
          }
        ]
      },
      "takeaway": {
        "text": "The useful discovery: Ask who can trigger the contract, how errors are handled and what law applies.",
        "choices": [
          {
            "id": "finish",
            "label": "I’ll use that when I evaluate a real project",
            "end": true,
            "completeConversation": true,
            "completeMission": "learn-smart-contracts",
            "effects": {
              "knowledge": [
                "smart-contracts"
              ],
              "trust": 1,
              "flags": {
                "smart-contracts-takeaway-seen": true
              }
            }
          }
        ]
      }
    },
    "start": "opening",
    "missionId": "learn-smart-contracts",
    "reward": {
      "xp": 18,
      "ngn": 25
    },
    "position": {
      "x": -175,
      "z": -145,
      "f": 1
    },
    "domain": "Law and public records"
  },
  {
    "id": "learn-professional-credentials",
    "conceptId": "professional-credentials",
    "title": "A problem before a protocol: Proof of skills",
    "npcId": "skills-mentor",
    "npcName": "Chidi",
    "role": "Motor-park mechanic and mentor",
    "personality": "Funny, resourceful, distrusts hype",
    "personalConcern": "He needs evidence of skill to win remote repair work.",
    "existingKnowledge": "Trusts demonstrated ability more than badges.",
    "communicationStyle": "Uses workshop comparisons and asks to see proof.",
    "participationReason": "Build a portable work record without exposing customer details.",
    "sectors": [
      "employment",
      "education",
      "open source"
    ],
    "scenario": "A mechanic has skill but no formal certificate from a large institution.",
    "complexity": "basic",
    "prerequisites": [
      "portable-credentials"
    ],
    "conceptTags": [
      "professional-credentials",
      "employment",
      "education",
      "open-source"
    ],
    "explanation": "A portable record can help someone present evidence of work, training or contributions. The strongest proof remains useful work that employers can inspect.",
    "application": "A portfolio combines signed training records, references and reviewed work samples.",
    "limitations": "A badge alone does not prove competence or guarantee employment.",
    "takeaway": "Build evidence people can independently assess; protect private details.",
    "optionalFollowUps": [
      {
        "id": "professional-credentials-deeper",
        "title": "Explore a harder case",
        "optional": true
      }
    ],
    "nodes": {
      "opening": {
        "text": "A mechanic has skill but no formal certificate from a large institution.",
        "choices": [
          {
            "id": "ask-practical",
            "label": "Ask what would help in practice",
            "next": "application",
            "effects": {
              "knowledge": [
                "professional-credentials-problem-framing"
              ]
            }
          },
          {
            "id": "challenge-hype",
            "label": "Question whether this needs Web3 at all",
            "next": "compare",
            "effects": {
              "flags": {
                "professional-credentials-questioned-necessity": true
              }
            }
          },
          {
            "id": "hear-concern",
            "label": "Ask what worries them most",
            "next": "limitation"
          }
        ]
      },
      "application": {
        "text": "A portfolio combines signed training records, references and reviewed work samples.",
        "choices": [
          {
            "id": "how-work",
            "label": "How would that work, simply?",
            "next": "explain",
            "effects": {
              "knowledge": [
                "professional-credentials"
              ]
            }
          },
          {
            "id": "who-benefits",
            "label": "Who benefits—and who might be left out?",
            "next": "limitation"
          },
          {
            "id": "finish-idea",
            "label": "Keep the idea small and testable",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "compare": {
        "text": "Fair question. A normal database or existing process may solve this more simply. Compare who needs to trust whom, the cost, privacy, and what happens when something goes wrong.",
        "choices": [
          {
            "id": "compare-cost",
            "label": "Compare cost, control and usability first",
            "next": "explain",
            "effects": {
              "knowledge": [
                "not-everything-needs-blockchain"
              ]
            }
          },
          {
            "id": "continue-story",
            "label": "Show me the useful part without the hype",
            "next": "application"
          }
        ]
      },
      "explain": {
        "text": "A portable record can help someone present evidence of work, training or contributions. The strongest proof remains useful work that employers can inspect.",
        "choices": [
          {
            "id": "limitation",
            "label": "What could still go wrong?",
            "next": "limitation",
            "effects": {
              "knowledge": [
                "professional-credentials"
              ]
            }
          },
          {
            "id": "real-world",
            "label": "What would a realistic first trial look like?",
            "next": "trial"
          }
        ]
      },
      "limitation": {
        "text": "A badge alone does not prove competence or guarantee employment.",
        "choices": [
          {
            "id": "design-around",
            "label": "What safeguard would you add?",
            "next": "trial",
            "effects": {
              "knowledge": [
                "professional-credentials-limitations"
              ]
            }
          },
          {
            "id": "accept-tradeoff",
            "label": "That trade-off may be worth knowing before deciding",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "trial": {
        "text": "Start with one small group, clear consent, a way to correct errors, a low-tech fallback, and measures for time, cost and trust. Compare it with the simplest non-blockchain option before scaling.",
        "choices": [
          {
            "id": "takeaway",
            "label": "That sounds testable",
            "next": "takeaway",
            "effects": {
              "flags": {
                "professional-credentials-trial-designed": true
              }
            }
          },
          {
            "id": "ask-limits",
            "label": "Who is accountable if it fails?",
            "next": "limitation"
          }
        ]
      },
      "takeaway": {
        "text": "The useful discovery: Build evidence people can independently assess; protect private details.",
        "choices": [
          {
            "id": "finish",
            "label": "I’ll use that when I evaluate a real project",
            "end": true,
            "completeConversation": true,
            "completeMission": "learn-professional-credentials",
            "effects": {
              "knowledge": [
                "professional-credentials"
              ],
              "trust": 1,
              "flags": {
                "professional-credentials-takeaway-seen": true
              }
            }
          }
        ]
      }
    },
    "start": "opening",
    "missionId": "learn-professional-credentials",
    "reward": {
      "xp": 18,
      "ngn": 25
    },
    "position": {
      "x": 45,
      "z": 215,
      "f": -1
    },
    "domain": "Employment and professional development",
    "requires": {
      "any": [
        {
          "any": [
            {
              "knowledge": "portable-credentials"
            },
            {
              "completedMission": "learn-portable-credentials"
            }
          ]
        }
      ]
    },
    "unavailableText": "We should build on one idea first. Learn the basics of portable credentials and then come back."
  },
  {
    "id": "learn-creative-rights",
    "conceptId": "creative-rights",
    "title": "A problem before a protocol: Creative rights",
    "npcId": "music-producer",
    "npcName": "Tayo",
    "role": "Independent musician",
    "personality": "Expressive, proud, skeptical",
    "personalConcern": "His beat was used in an advert without clear credit or payment.",
    "existingKnowledge": "Believes exposure is often used as an excuse not to pay creators.",
    "communicationStyle": "Vivid examples; pushes back on vague promises.",
    "participationReason": "Clarify rights and revenue split before releasing a track.",
    "sectors": [
      "music",
      "art",
      "media"
    ],
    "scenario": "A musician hears their work in an advert but is not credited or paid.",
    "complexity": "basic",
    "prerequisites": [
      "digital-ownership",
      "smart-contracts"
    ],
    "conceptTags": [
      "creative-rights",
      "music",
      "art",
      "media"
    ],
    "explanation": "Digital records can timestamp claims and help track licenses or agreed revenue splits. Copyright, permissions and disputes still depend on evidence, contracts and jurisdiction.",
    "application": "A written license and transparent split record make agreed terms easier to track.",
    "limitations": "A token cannot by itself prove authorship or force every platform to honor a license.",
    "takeaway": "Record the agreement, identify rights holders and plan dispute handling.",
    "optionalFollowUps": [
      {
        "id": "creative-rights-deeper",
        "title": "Explore a harder case",
        "optional": true
      }
    ],
    "nodes": {
      "opening": {
        "text": "A musician hears their work in an advert but is not credited or paid.",
        "choices": [
          {
            "id": "ask-practical",
            "label": "Ask what would help in practice",
            "next": "application",
            "effects": {
              "knowledge": [
                "creative-rights-problem-framing"
              ]
            }
          },
          {
            "id": "challenge-hype",
            "label": "Question whether this needs Web3 at all",
            "next": "compare",
            "effects": {
              "flags": {
                "creative-rights-questioned-necessity": true
              }
            }
          },
          {
            "id": "hear-concern",
            "label": "Ask what worries them most",
            "next": "limitation"
          }
        ]
      },
      "application": {
        "text": "A written license and transparent split record make agreed terms easier to track.",
        "choices": [
          {
            "id": "how-work",
            "label": "How would that work, simply?",
            "next": "explain",
            "effects": {
              "knowledge": [
                "creative-rights"
              ]
            }
          },
          {
            "id": "who-benefits",
            "label": "Who benefits—and who might be left out?",
            "next": "limitation"
          },
          {
            "id": "finish-idea",
            "label": "Keep the idea small and testable",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "compare": {
        "text": "Fair question. A normal database or existing process may solve this more simply. Compare who needs to trust whom, the cost, privacy, and what happens when something goes wrong.",
        "choices": [
          {
            "id": "compare-cost",
            "label": "Compare cost, control and usability first",
            "next": "explain",
            "effects": {
              "knowledge": [
                "not-everything-needs-blockchain"
              ]
            }
          },
          {
            "id": "continue-story",
            "label": "Show me the useful part without the hype",
            "next": "application"
          }
        ]
      },
      "explain": {
        "text": "Digital records can timestamp claims and help track licenses or agreed revenue splits. Copyright, permissions and disputes still depend on evidence, contracts and jurisdiction.",
        "choices": [
          {
            "id": "limitation",
            "label": "What could still go wrong?",
            "next": "limitation",
            "effects": {
              "knowledge": [
                "creative-rights"
              ]
            }
          },
          {
            "id": "real-world",
            "label": "What would a realistic first trial look like?",
            "next": "trial"
          }
        ]
      },
      "limitation": {
        "text": "A token cannot by itself prove authorship or force every platform to honor a license.",
        "choices": [
          {
            "id": "design-around",
            "label": "What safeguard would you add?",
            "next": "trial",
            "effects": {
              "knowledge": [
                "creative-rights-limitations"
              ]
            }
          },
          {
            "id": "accept-tradeoff",
            "label": "That trade-off may be worth knowing before deciding",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "trial": {
        "text": "Start with one small group, clear consent, a way to correct errors, a low-tech fallback, and measures for time, cost and trust. Compare it with the simplest non-blockchain option before scaling.",
        "choices": [
          {
            "id": "takeaway",
            "label": "That sounds testable",
            "next": "takeaway",
            "effects": {
              "flags": {
                "creative-rights-trial-designed": true
              }
            }
          },
          {
            "id": "ask-limits",
            "label": "Who is accountable if it fails?",
            "next": "limitation"
          }
        ]
      },
      "takeaway": {
        "text": "The useful discovery: Record the agreement, identify rights holders and plan dispute handling.",
        "choices": [
          {
            "id": "finish",
            "label": "I’ll use that when I evaluate a real project",
            "end": true,
            "completeConversation": true,
            "completeMission": "learn-creative-rights",
            "effects": {
              "knowledge": [
                "creative-rights"
              ],
              "trust": 1,
              "flags": {
                "creative-rights-takeaway-seen": true
              }
            }
          }
        ]
      }
    },
    "start": "opening",
    "missionId": "learn-creative-rights",
    "reward": {
      "xp": 18,
      "ngn": 25
    },
    "position": {
      "x": -45,
      "z": 215,
      "f": 1
    },
    "domain": "Creative industries",
    "requires": {
      "any": [
        {
          "any": [
            {
              "knowledge": "digital-ownership"
            },
            {
              "completedMission": "learn-digital-ownership"
            }
          ]
        },
        {
          "any": [
            {
              "knowledge": "smart-contracts"
            },
            {
              "completedMission": "learn-smart-contracts"
            }
          ]
        }
      ]
    },
    "unavailableText": "We should build on one idea first. Learn the basics of digital ownership, smart contracts and then come back."
  },
  {
    "id": "learn-community-governance",
    "conceptId": "community-governance",
    "title": "A problem before a protocol: Community governance",
    "npcId": "community-steward",
    "npcName": "Aisha",
    "role": "Cooperative organizer",
    "personality": "Fair-minded, persistent",
    "personalConcern": "Members disagree over spending and few attend meetings.",
    "existingKnowledge": "Wants transparency but fears wealthy members will dominate votes.",
    "communicationStyle": "Invites disagreement and asks whose voice is missing.",
    "participationReason": "Design a decision process with quorum and appeal rules.",
    "sectors": [
      "community",
      "public administration",
      "open source"
    ],
    "scenario": "A neighborhood cooperative must decide how to spend a shared fund.",
    "complexity": "intermediate",
    "prerequisites": [],
    "conceptTags": [
      "community-governance",
      "community",
      "public-administration",
      "open-source"
    ],
    "explanation": "Online proposals and voting can help groups coordinate decisions. The voting mechanism does not guarantee fair representation or prevent concentrated influence.",
    "application": "Members publish proposals, disclose conflicts and track a decision log.",
    "limitations": "Low participation, bought influence, identity problems and voter fatigue can distort outcomes.",
    "takeaway": "Ask who gets a voice, how quorum works and how decisions can be challenged.",
    "optionalFollowUps": [
      {
        "id": "community-governance-deeper",
        "title": "Explore a harder case",
        "optional": true
      }
    ],
    "nodes": {
      "opening": {
        "text": "A neighborhood cooperative must decide how to spend a shared fund.",
        "choices": [
          {
            "id": "ask-practical",
            "label": "Ask what would help in practice",
            "next": "application",
            "effects": {
              "knowledge": [
                "community-governance-problem-framing"
              ]
            }
          },
          {
            "id": "challenge-hype",
            "label": "Question whether this needs Web3 at all",
            "next": "compare",
            "effects": {
              "flags": {
                "community-governance-questioned-necessity": true
              }
            }
          },
          {
            "id": "hear-concern",
            "label": "Ask what worries them most",
            "next": "limitation"
          }
        ]
      },
      "application": {
        "text": "Members publish proposals, disclose conflicts and track a decision log.",
        "choices": [
          {
            "id": "how-work",
            "label": "How would that work, simply?",
            "next": "explain",
            "effects": {
              "knowledge": [
                "community-governance"
              ]
            }
          },
          {
            "id": "who-benefits",
            "label": "Who benefits—and who might be left out?",
            "next": "limitation"
          },
          {
            "id": "finish-idea",
            "label": "Keep the idea small and testable",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "compare": {
        "text": "Fair question. A normal database or existing process may solve this more simply. Compare who needs to trust whom, the cost, privacy, and what happens when something goes wrong.",
        "choices": [
          {
            "id": "compare-cost",
            "label": "Compare cost, control and usability first",
            "next": "explain",
            "effects": {
              "knowledge": [
                "not-everything-needs-blockchain"
              ]
            }
          },
          {
            "id": "continue-story",
            "label": "Show me the useful part without the hype",
            "next": "application"
          }
        ]
      },
      "explain": {
        "text": "Online proposals and voting can help groups coordinate decisions. The voting mechanism does not guarantee fair representation or prevent concentrated influence.",
        "choices": [
          {
            "id": "limitation",
            "label": "What could still go wrong?",
            "next": "limitation",
            "effects": {
              "knowledge": [
                "community-governance"
              ]
            }
          },
          {
            "id": "real-world",
            "label": "What would a realistic first trial look like?",
            "next": "trial"
          }
        ]
      },
      "limitation": {
        "text": "Low participation, bought influence, identity problems and voter fatigue can distort outcomes.",
        "choices": [
          {
            "id": "design-around",
            "label": "What safeguard would you add?",
            "next": "trial",
            "effects": {
              "knowledge": [
                "community-governance-limitations"
              ]
            }
          },
          {
            "id": "accept-tradeoff",
            "label": "That trade-off may be worth knowing before deciding",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "trial": {
        "text": "Start with one small group, clear consent, a way to correct errors, a low-tech fallback, and measures for time, cost and trust. Compare it with the simplest non-blockchain option before scaling.",
        "choices": [
          {
            "id": "takeaway",
            "label": "That sounds testable",
            "next": "takeaway",
            "effects": {
              "flags": {
                "community-governance-trial-designed": true
              }
            }
          },
          {
            "id": "ask-limits",
            "label": "Who is accountable if it fails?",
            "next": "limitation"
          }
        ]
      },
      "takeaway": {
        "text": "The useful discovery: Ask who gets a voice, how quorum works and how decisions can be challenged.",
        "choices": [
          {
            "id": "finish",
            "label": "I’ll use that when I evaluate a real project",
            "end": true,
            "completeConversation": true,
            "completeMission": "learn-community-governance",
            "effects": {
              "knowledge": [
                "community-governance"
              ],
              "trust": 1,
              "flags": {
                "community-governance-takeaway-seen": true
              }
            }
          }
        ]
      }
    },
    "start": "opening",
    "missionId": "learn-community-governance",
    "reward": {
      "xp": 18,
      "ngn": 25
    },
    "position": {
      "x": 210,
      "z": 40,
      "f": -1
    },
    "domain": "Governance and communities"
  },
  {
    "id": "learn-decentralized-identity",
    "conceptId": "decentralized-identity",
    "title": "A problem before a protocol: Digital identity and selective disclosure",
    "npcId": "privacy-guide",
    "npcName": "Zainab",
    "role": "Student designer and privacy advocate",
    "personality": "Curious, direct, ambitious",
    "personalConcern": "She must prove a qualification without sharing all her personal data.",
    "existingKnowledge": "Believes verification should not require a public life history.",
    "communicationStyle": "Clear questions; calls out unnecessary data collection.",
    "participationReason": "Share one credential claim while minimizing disclosure.",
    "sectors": [
      "identity",
      "privacy",
      "employment"
    ],
    "scenario": "A person needs to prove they meet an age or qualification requirement without exposing unrelated data.",
    "complexity": "intermediate",
    "prerequisites": [
      "portable-credentials"
    ],
    "conceptTags": [
      "decentralized-identity",
      "identity",
      "privacy",
      "employment"
    ],
    "explanation": "Verifiable credentials can prove a specific claim without sharing every personal detail. Good systems reveal only what is necessary and avoid turning identity into public tracking.",
    "application": "A credential can confirm a claim while withholding unrelated fields, when the system supports it.",
    "limitations": "Selective disclosure is not automatic; metadata, issuers and device security can still leak information.",
    "takeaway": "Share the minimum, check the verifier, and understand what can be correlated.",
    "optionalFollowUps": [
      {
        "id": "decentralized-identity-deeper",
        "title": "Explore a harder case",
        "optional": true
      }
    ],
    "nodes": {
      "opening": {
        "text": "A person needs to prove they meet an age or qualification requirement without exposing unrelated data.",
        "choices": [
          {
            "id": "ask-practical",
            "label": "Ask what would help in practice",
            "next": "application",
            "effects": {
              "knowledge": [
                "decentralized-identity-problem-framing"
              ]
            }
          },
          {
            "id": "challenge-hype",
            "label": "Question whether this needs Web3 at all",
            "next": "compare",
            "effects": {
              "flags": {
                "decentralized-identity-questioned-necessity": true
              }
            }
          },
          {
            "id": "hear-concern",
            "label": "Ask what worries them most",
            "next": "limitation"
          }
        ]
      },
      "application": {
        "text": "A credential can confirm a claim while withholding unrelated fields, when the system supports it.",
        "choices": [
          {
            "id": "how-work",
            "label": "How would that work, simply?",
            "next": "explain",
            "effects": {
              "knowledge": [
                "decentralized-identity"
              ]
            }
          },
          {
            "id": "who-benefits",
            "label": "Who benefits—and who might be left out?",
            "next": "limitation"
          },
          {
            "id": "finish-idea",
            "label": "Keep the idea small and testable",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "compare": {
        "text": "Fair question. A normal database or existing process may solve this more simply. Compare who needs to trust whom, the cost, privacy, and what happens when something goes wrong.",
        "choices": [
          {
            "id": "compare-cost",
            "label": "Compare cost, control and usability first",
            "next": "explain",
            "effects": {
              "knowledge": [
                "not-everything-needs-blockchain"
              ]
            }
          },
          {
            "id": "continue-story",
            "label": "Show me the useful part without the hype",
            "next": "application"
          }
        ]
      },
      "explain": {
        "text": "Verifiable credentials can prove a specific claim without sharing every personal detail. Good systems reveal only what is necessary and avoid turning identity into public tracking.",
        "choices": [
          {
            "id": "limitation",
            "label": "What could still go wrong?",
            "next": "limitation",
            "effects": {
              "knowledge": [
                "decentralized-identity"
              ]
            }
          },
          {
            "id": "real-world",
            "label": "What would a realistic first trial look like?",
            "next": "trial"
          }
        ]
      },
      "limitation": {
        "text": "Selective disclosure is not automatic; metadata, issuers and device security can still leak information.",
        "choices": [
          {
            "id": "design-around",
            "label": "What safeguard would you add?",
            "next": "trial",
            "effects": {
              "knowledge": [
                "decentralized-identity-limitations"
              ]
            }
          },
          {
            "id": "accept-tradeoff",
            "label": "That trade-off may be worth knowing before deciding",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "trial": {
        "text": "Start with one small group, clear consent, a way to correct errors, a low-tech fallback, and measures for time, cost and trust. Compare it with the simplest non-blockchain option before scaling.",
        "choices": [
          {
            "id": "takeaway",
            "label": "That sounds testable",
            "next": "takeaway",
            "effects": {
              "flags": {
                "decentralized-identity-trial-designed": true
              }
            }
          },
          {
            "id": "ask-limits",
            "label": "Who is accountable if it fails?",
            "next": "limitation"
          }
        ]
      },
      "takeaway": {
        "text": "The useful discovery: Share the minimum, check the verifier, and understand what can be correlated.",
        "choices": [
          {
            "id": "finish",
            "label": "I’ll use that when I evaluate a real project",
            "end": true,
            "completeConversation": true,
            "completeMission": "learn-decentralized-identity",
            "effects": {
              "knowledge": [
                "decentralized-identity"
              ],
              "trust": 1,
              "flags": {
                "decentralized-identity-takeaway-seen": true
              }
            }
          }
        ]
      }
    },
    "start": "opening",
    "missionId": "learn-decentralized-identity",
    "reward": {
      "xp": 18,
      "ngn": 25
    },
    "position": {
      "x": -210,
      "z": 40,
      "f": 1
    },
    "domain": "Digital identity and privacy",
    "requires": {
      "any": [
        {
          "any": [
            {
              "knowledge": "portable-credentials"
            },
            {
              "completedMission": "learn-portable-credentials"
            }
          ]
        }
      ]
    },
    "unavailableText": "We should build on one idea first. Learn the basics of portable credentials and then come back."
  },
  {
    "id": "learn-decentralized-infrastructure",
    "conceptId": "decentralized-infrastructure",
    "title": "A problem before a protocol: Decentralized infrastructure",
    "npcId": "network-builder",
    "npcName": "Emeka",
    "role": "Community network technician",
    "personality": "Inventive, grounded",
    "personalConcern": "A neighborhood's connection fails when one provider is down.",
    "existingKnowledge": "Likes shared infrastructure but worries about maintenance and accountability.",
    "communicationStyle": "Practical engineering language, explains trade-offs.",
    "participationReason": "Compare a community network with a single-provider plan.",
    "sectors": [
      "infrastructure",
      "connectivity",
      "computing"
    ],
    "scenario": "A community needs reliable connectivity beyond one provider's coverage.",
    "complexity": "intermediate",
    "prerequisites": [],
    "conceptTags": [
      "decentralized-infrastructure",
      "infrastructure",
      "connectivity",
      "computing"
    ],
    "explanation": "Distributed storage, computing and physical networks spread work across participants rather than one provider. They can improve resilience or access, but coordination and reliability still cost money.",
    "application": "A local network combines several operators and has clear service and repair incentives.",
    "limitations": "Distributed systems can be slower, harder to govern, or unreliable if incentives fail.",
    "takeaway": "Compare uptime, support, cost and accountability with centralized options.",
    "optionalFollowUps": [
      {
        "id": "decentralized-infrastructure-deeper",
        "title": "Explore a harder case",
        "optional": true
      }
    ],
    "nodes": {
      "opening": {
        "text": "A community needs reliable connectivity beyond one provider's coverage.",
        "choices": [
          {
            "id": "ask-practical",
            "label": "Ask what would help in practice",
            "next": "application",
            "effects": {
              "knowledge": [
                "decentralized-infrastructure-problem-framing"
              ]
            }
          },
          {
            "id": "challenge-hype",
            "label": "Question whether this needs Web3 at all",
            "next": "compare",
            "effects": {
              "flags": {
                "decentralized-infrastructure-questioned-necessity": true
              }
            }
          },
          {
            "id": "hear-concern",
            "label": "Ask what worries them most",
            "next": "limitation"
          }
        ]
      },
      "application": {
        "text": "A local network combines several operators and has clear service and repair incentives.",
        "choices": [
          {
            "id": "how-work",
            "label": "How would that work, simply?",
            "next": "explain",
            "effects": {
              "knowledge": [
                "decentralized-infrastructure"
              ]
            }
          },
          {
            "id": "who-benefits",
            "label": "Who benefits—and who might be left out?",
            "next": "limitation"
          },
          {
            "id": "finish-idea",
            "label": "Keep the idea small and testable",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "compare": {
        "text": "Fair question. A normal database or existing process may solve this more simply. Compare who needs to trust whom, the cost, privacy, and what happens when something goes wrong.",
        "choices": [
          {
            "id": "compare-cost",
            "label": "Compare cost, control and usability first",
            "next": "explain",
            "effects": {
              "knowledge": [
                "not-everything-needs-blockchain"
              ]
            }
          },
          {
            "id": "continue-story",
            "label": "Show me the useful part without the hype",
            "next": "application"
          }
        ]
      },
      "explain": {
        "text": "Distributed storage, computing and physical networks spread work across participants rather than one provider. They can improve resilience or access, but coordination and reliability still cost money.",
        "choices": [
          {
            "id": "limitation",
            "label": "What could still go wrong?",
            "next": "limitation",
            "effects": {
              "knowledge": [
                "decentralized-infrastructure"
              ]
            }
          },
          {
            "id": "real-world",
            "label": "What would a realistic first trial look like?",
            "next": "trial"
          }
        ]
      },
      "limitation": {
        "text": "Distributed systems can be slower, harder to govern, or unreliable if incentives fail.",
        "choices": [
          {
            "id": "design-around",
            "label": "What safeguard would you add?",
            "next": "trial",
            "effects": {
              "knowledge": [
                "decentralized-infrastructure-limitations"
              ]
            }
          },
          {
            "id": "accept-tradeoff",
            "label": "That trade-off may be worth knowing before deciding",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "trial": {
        "text": "Start with one small group, clear consent, a way to correct errors, a low-tech fallback, and measures for time, cost and trust. Compare it with the simplest non-blockchain option before scaling.",
        "choices": [
          {
            "id": "takeaway",
            "label": "That sounds testable",
            "next": "takeaway",
            "effects": {
              "flags": {
                "decentralized-infrastructure-trial-designed": true
              }
            }
          },
          {
            "id": "ask-limits",
            "label": "Who is accountable if it fails?",
            "next": "limitation"
          }
        ]
      },
      "takeaway": {
        "text": "The useful discovery: Compare uptime, support, cost and accountability with centralized options.",
        "choices": [
          {
            "id": "finish",
            "label": "I’ll use that when I evaluate a real project",
            "end": true,
            "completeConversation": true,
            "completeMission": "learn-decentralized-infrastructure",
            "effects": {
              "knowledge": [
                "decentralized-infrastructure"
              ],
              "trust": 1,
              "flags": {
                "decentralized-infrastructure-takeaway-seen": true
              }
            }
          }
        ]
      }
    },
    "start": "opening",
    "missionId": "learn-decentralized-infrastructure",
    "reward": {
      "xp": 18,
      "ngn": 25
    },
    "position": {
      "x": 210,
      "z": 115,
      "f": -1
    },
    "domain": "Infrastructure and decentralized networks"
  },
  {
    "id": "learn-tokenization",
    "conceptId": "tokenization",
    "title": "A problem before a protocol: Tokenization and real-world assets",
    "npcId": "property-clerk",
    "npcName": "Mrs Danjuma",
    "role": "Property documentation clerk",
    "personality": "Methodical, cautious",
    "personalConcern": "A family is offered fractional tokens in a building with unclear title.",
    "existingKnowledge": "Insists paper title, custody and legal rights still matter.",
    "communicationStyle": "Careful and asks to see documents before believing claims.",
    "participationReason": "Identify what legal rights a property token actually represents.",
    "sectors": [
      "property",
      "finance",
      "supply chain"
    ],
    "scenario": "A family is offered a token said to represent part ownership of a building.",
    "complexity": "intermediate",
    "prerequisites": [
      "smart-contracts"
    ],
    "conceptTags": [
      "tokenization",
      "property",
      "finance",
      "supply-chain"
    ],
    "explanation": "A token can represent a claim or reference to an asset. The legal link between token and asset must be established and enforceable outside the token itself.",
    "application": "A regulated arrangement links token records to defined legal rights and a responsible custodian.",
    "limitations": "A token alone does not transfer land title, guarantee custody or prevent disputes.",
    "takeaway": "Read the legal documents, ownership registry, redemption rules and risks.",
    "optionalFollowUps": [
      {
        "id": "tokenization-deeper",
        "title": "Explore a harder case",
        "optional": true
      }
    ],
    "nodes": {
      "opening": {
        "text": "A family is offered a token said to represent part ownership of a building.",
        "choices": [
          {
            "id": "ask-practical",
            "label": "Ask what would help in practice",
            "next": "application",
            "effects": {
              "knowledge": [
                "tokenization-problem-framing"
              ]
            }
          },
          {
            "id": "challenge-hype",
            "label": "Question whether this needs Web3 at all",
            "next": "compare",
            "effects": {
              "flags": {
                "tokenization-questioned-necessity": true
              }
            }
          },
          {
            "id": "hear-concern",
            "label": "Ask what worries them most",
            "next": "limitation"
          }
        ]
      },
      "application": {
        "text": "A regulated arrangement links token records to defined legal rights and a responsible custodian.",
        "choices": [
          {
            "id": "how-work",
            "label": "How would that work, simply?",
            "next": "explain",
            "effects": {
              "knowledge": [
                "tokenization"
              ]
            }
          },
          {
            "id": "who-benefits",
            "label": "Who benefits—and who might be left out?",
            "next": "limitation"
          },
          {
            "id": "finish-idea",
            "label": "Keep the idea small and testable",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "compare": {
        "text": "Fair question. A normal database or existing process may solve this more simply. Compare who needs to trust whom, the cost, privacy, and what happens when something goes wrong.",
        "choices": [
          {
            "id": "compare-cost",
            "label": "Compare cost, control and usability first",
            "next": "explain",
            "effects": {
              "knowledge": [
                "not-everything-needs-blockchain"
              ]
            }
          },
          {
            "id": "continue-story",
            "label": "Show me the useful part without the hype",
            "next": "application"
          }
        ]
      },
      "explain": {
        "text": "A token can represent a claim or reference to an asset. The legal link between token and asset must be established and enforceable outside the token itself.",
        "choices": [
          {
            "id": "limitation",
            "label": "What could still go wrong?",
            "next": "limitation",
            "effects": {
              "knowledge": [
                "tokenization"
              ]
            }
          },
          {
            "id": "real-world",
            "label": "What would a realistic first trial look like?",
            "next": "trial"
          }
        ]
      },
      "limitation": {
        "text": "A token alone does not transfer land title, guarantee custody or prevent disputes.",
        "choices": [
          {
            "id": "design-around",
            "label": "What safeguard would you add?",
            "next": "trial",
            "effects": {
              "knowledge": [
                "tokenization-limitations"
              ]
            }
          },
          {
            "id": "accept-tradeoff",
            "label": "That trade-off may be worth knowing before deciding",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "trial": {
        "text": "Start with one small group, clear consent, a way to correct errors, a low-tech fallback, and measures for time, cost and trust. Compare it with the simplest non-blockchain option before scaling.",
        "choices": [
          {
            "id": "takeaway",
            "label": "That sounds testable",
            "next": "takeaway",
            "effects": {
              "flags": {
                "tokenization-trial-designed": true
              }
            }
          },
          {
            "id": "ask-limits",
            "label": "Who is accountable if it fails?",
            "next": "limitation"
          }
        ]
      },
      "takeaway": {
        "text": "The useful discovery: Read the legal documents, ownership registry, redemption rules and risks.",
        "choices": [
          {
            "id": "finish",
            "label": "I’ll use that when I evaluate a real project",
            "end": true,
            "completeConversation": true,
            "completeMission": "learn-tokenization",
            "effects": {
              "knowledge": [
                "tokenization"
              ],
              "trust": 1,
              "flags": {
                "tokenization-takeaway-seen": true
              }
            }
          }
        ]
      }
    },
    "start": "opening",
    "missionId": "learn-tokenization",
    "reward": {
      "xp": 18,
      "ngn": 25
    },
    "position": {
      "x": -210,
      "z": 115,
      "f": 1
    },
    "domain": "Tokenization and real-world assets",
    "requires": {
      "any": [
        {
          "any": [
            {
              "knowledge": "smart-contracts"
            },
            {
              "completedMission": "learn-smart-contracts"
            }
          ]
        }
      ]
    },
    "unavailableText": "We should build on one idea first. Learn the basics of smart contracts and then come back."
  },
  {
    "id": "learn-verifiable-ai",
    "conceptId": "verifiable-ai",
    "title": "A problem before a protocol: AI provenance and Web3",
    "npcId": "news-researcher",
    "npcName": "Fola",
    "role": "Local journalist",
    "personality": "Curious, evidence-first",
    "personalConcern": "A viral AI-generated clip is being shared as proof of an event.",
    "existingKnowledge": "Knows metadata can help but is not proof of truth.",
    "communicationStyle": "Asks who filmed it and what independent evidence exists.",
    "participationReason": "Check provenance without confusing authenticity with truth.",
    "sectors": [
      "AI",
      "media",
      "research"
    ],
    "scenario": "A newsroom receives a viral clip with a claim that it is genuine.",
    "complexity": "intermediate",
    "prerequisites": [
      "digital-ownership"
    ],
    "conceptTags": [
      "verifiable-ai",
      "ai",
      "media",
      "research"
    ],
    "explanation": "Cryptographic signatures and provenance records can help trace who published a file or model output and whether it changed. They do not prove that content is true or an AI is fair.",
    "application": "Signed source files and an audit trail support a provenance check.",
    "limitations": "A perfectly signed file can still contain misinformation; provenance is not truth verification.",
    "takeaway": "Check origin, independent evidence, model limits and human accountability.",
    "optionalFollowUps": [
      {
        "id": "verifiable-ai-deeper",
        "title": "Explore a harder case",
        "optional": true
      }
    ],
    "nodes": {
      "opening": {
        "text": "A newsroom receives a viral clip with a claim that it is genuine.",
        "choices": [
          {
            "id": "ask-practical",
            "label": "Ask what would help in practice",
            "next": "application",
            "effects": {
              "knowledge": [
                "verifiable-ai-problem-framing"
              ]
            }
          },
          {
            "id": "challenge-hype",
            "label": "Question whether this needs Web3 at all",
            "next": "compare",
            "effects": {
              "flags": {
                "verifiable-ai-questioned-necessity": true
              }
            }
          },
          {
            "id": "hear-concern",
            "label": "Ask what worries them most",
            "next": "limitation"
          }
        ]
      },
      "application": {
        "text": "Signed source files and an audit trail support a provenance check.",
        "choices": [
          {
            "id": "how-work",
            "label": "How would that work, simply?",
            "next": "explain",
            "effects": {
              "knowledge": [
                "verifiable-ai"
              ]
            }
          },
          {
            "id": "who-benefits",
            "label": "Who benefits—and who might be left out?",
            "next": "limitation"
          },
          {
            "id": "finish-idea",
            "label": "Keep the idea small and testable",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "compare": {
        "text": "Fair question. A normal database or existing process may solve this more simply. Compare who needs to trust whom, the cost, privacy, and what happens when something goes wrong.",
        "choices": [
          {
            "id": "compare-cost",
            "label": "Compare cost, control and usability first",
            "next": "explain",
            "effects": {
              "knowledge": [
                "not-everything-needs-blockchain"
              ]
            }
          },
          {
            "id": "continue-story",
            "label": "Show me the useful part without the hype",
            "next": "application"
          }
        ]
      },
      "explain": {
        "text": "Cryptographic signatures and provenance records can help trace who published a file or model output and whether it changed. They do not prove that content is true or an AI is fair.",
        "choices": [
          {
            "id": "limitation",
            "label": "What could still go wrong?",
            "next": "limitation",
            "effects": {
              "knowledge": [
                "verifiable-ai"
              ]
            }
          },
          {
            "id": "real-world",
            "label": "What would a realistic first trial look like?",
            "next": "trial"
          }
        ]
      },
      "limitation": {
        "text": "A perfectly signed file can still contain misinformation; provenance is not truth verification.",
        "choices": [
          {
            "id": "design-around",
            "label": "What safeguard would you add?",
            "next": "trial",
            "effects": {
              "knowledge": [
                "verifiable-ai-limitations"
              ]
            }
          },
          {
            "id": "accept-tradeoff",
            "label": "That trade-off may be worth knowing before deciding",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "trial": {
        "text": "Start with one small group, clear consent, a way to correct errors, a low-tech fallback, and measures for time, cost and trust. Compare it with the simplest non-blockchain option before scaling.",
        "choices": [
          {
            "id": "takeaway",
            "label": "That sounds testable",
            "next": "takeaway",
            "effects": {
              "flags": {
                "verifiable-ai-trial-designed": true
              }
            }
          },
          {
            "id": "ask-limits",
            "label": "Who is accountable if it fails?",
            "next": "limitation"
          }
        ]
      },
      "takeaway": {
        "text": "The useful discovery: Check origin, independent evidence, model limits and human accountability.",
        "choices": [
          {
            "id": "finish",
            "label": "I’ll use that when I evaluate a real project",
            "end": true,
            "completeConversation": true,
            "completeMission": "learn-verifiable-ai",
            "effects": {
              "knowledge": [
                "verifiable-ai"
              ],
              "trust": 1,
              "flags": {
                "verifiable-ai-takeaway-seen": true
              }
            }
          }
        ]
      }
    },
    "start": "opening",
    "missionId": "learn-verifiable-ai",
    "reward": {
      "xp": 18,
      "ngn": 25
    },
    "position": {
      "x": 0,
      "z": -255,
      "f": 1
    },
    "domain": "AI and Web3",
    "requires": {
      "any": [
        {
          "any": [
            {
              "knowledge": "digital-ownership"
            },
            {
              "completedMission": "learn-digital-ownership"
            }
          ]
        }
      ]
    },
    "unavailableText": "We should build on one idea first. Learn the basics of digital ownership and then come back."
  },
  {
    "id": "learn-security-and-limits",
    "conceptId": "security-and-limits",
    "title": "A problem before a protocol: Security and personal responsibility",
    "npcId": "security-coach",
    "npcName": "Ifeanyi",
    "role": "Phone repair technician",
    "personality": "Blunt, protective, street-smart",
    "personalConcern": "A customer nearly gives a stranger their recovery phrase.",
    "existingKnowledge": "Knows mistakes happen under pressure and avoids shaming victims.",
    "communicationStyle": "Plain warnings and practical next steps.",
    "participationReason": "Spot a phishing attempt and choose a safer recovery plan.",
    "sectors": [
      "security",
      "finance",
      "identity"
    ],
    "scenario": "A friend receives a message demanding a seed phrase to unlock a reward.",
    "complexity": "basic",
    "prerequisites": [],
    "conceptTags": [
      "security-and-limits",
      "security",
      "finance",
      "identity"
    ],
    "explanation": "Self-custody gives a person control of signing keys, but losing or exposing them can lose access or authorize theft. Verify requests and use safer recovery practices.",
    "application": "The person verifies the site independently, rejects the request and uses secure backups.",
    "limitations": "Transactions may be irreversible; support teams cannot magically recover exposed secrets.",
    "takeaway": "Never share seed phrases; check addresses, permissions, links and unrealistic promises.",
    "optionalFollowUps": [
      {
        "id": "security-and-limits-deeper",
        "title": "Explore a harder case",
        "optional": true
      }
    ],
    "nodes": {
      "opening": {
        "text": "A friend receives a message demanding a seed phrase to unlock a reward.",
        "choices": [
          {
            "id": "ask-practical",
            "label": "Ask what would help in practice",
            "next": "application",
            "effects": {
              "knowledge": [
                "security-and-limits-problem-framing"
              ]
            }
          },
          {
            "id": "challenge-hype",
            "label": "Question whether this needs Web3 at all",
            "next": "compare",
            "effects": {
              "flags": {
                "security-and-limits-questioned-necessity": true
              }
            }
          },
          {
            "id": "hear-concern",
            "label": "Ask what worries them most",
            "next": "limitation"
          }
        ]
      },
      "application": {
        "text": "The person verifies the site independently, rejects the request and uses secure backups.",
        "choices": [
          {
            "id": "how-work",
            "label": "How would that work, simply?",
            "next": "explain",
            "effects": {
              "knowledge": [
                "security-and-limits"
              ]
            }
          },
          {
            "id": "who-benefits",
            "label": "Who benefits—and who might be left out?",
            "next": "limitation"
          },
          {
            "id": "finish-idea",
            "label": "Keep the idea small and testable",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "compare": {
        "text": "Fair question. A normal database or existing process may solve this more simply. Compare who needs to trust whom, the cost, privacy, and what happens when something goes wrong.",
        "choices": [
          {
            "id": "compare-cost",
            "label": "Compare cost, control and usability first",
            "next": "explain",
            "effects": {
              "knowledge": [
                "not-everything-needs-blockchain"
              ]
            }
          },
          {
            "id": "continue-story",
            "label": "Show me the useful part without the hype",
            "next": "application"
          }
        ]
      },
      "explain": {
        "text": "Self-custody gives a person control of signing keys, but losing or exposing them can lose access or authorize theft. Verify requests and use safer recovery practices.",
        "choices": [
          {
            "id": "limitation",
            "label": "What could still go wrong?",
            "next": "limitation",
            "effects": {
              "knowledge": [
                "security-and-limits"
              ]
            }
          },
          {
            "id": "real-world",
            "label": "What would a realistic first trial look like?",
            "next": "trial"
          }
        ]
      },
      "limitation": {
        "text": "Transactions may be irreversible; support teams cannot magically recover exposed secrets.",
        "choices": [
          {
            "id": "design-around",
            "label": "What safeguard would you add?",
            "next": "trial",
            "effects": {
              "knowledge": [
                "security-and-limits-limitations"
              ]
            }
          },
          {
            "id": "accept-tradeoff",
            "label": "That trade-off may be worth knowing before deciding",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "trial": {
        "text": "Start with one small group, clear consent, a way to correct errors, a low-tech fallback, and measures for time, cost and trust. Compare it with the simplest non-blockchain option before scaling.",
        "choices": [
          {
            "id": "takeaway",
            "label": "That sounds testable",
            "next": "takeaway",
            "effects": {
              "flags": {
                "security-and-limits-trial-designed": true
              }
            }
          },
          {
            "id": "ask-limits",
            "label": "Who is accountable if it fails?",
            "next": "limitation"
          }
        ]
      },
      "takeaway": {
        "text": "The useful discovery: Never share seed phrases; check addresses, permissions, links and unrealistic promises.",
        "choices": [
          {
            "id": "finish",
            "label": "I’ll use that when I evaluate a real project",
            "end": true,
            "completeConversation": true,
            "completeMission": "learn-security-and-limits",
            "effects": {
              "knowledge": [
                "security-and-limits"
              ],
              "trust": 1,
              "flags": {
                "security-and-limits-takeaway-seen": true
              }
            }
          }
        ]
      }
    },
    "start": "opening",
    "missionId": "learn-security-and-limits",
    "reward": {
      "xp": 18,
      "ngn": 25
    },
    "position": {
      "x": 100,
      "z": 255,
      "f": -1
    },
    "domain": "Security and responsibility"
  },
  {
    "id": "learn-open-internet",
    "conceptId": "open-internet",
    "title": "A problem before a protocol: Open protocols and the internet",
    "npcId": "open-source-builder",
    "npcName": "Dayo",
    "role": "Software developer",
    "personality": "Collaborative, independent",
    "personalConcern": "A creator cannot move followers and content when a platform blocks them.",
    "existingKnowledge": "Likes open standards but knows network effects are hard to beat.",
    "communicationStyle": "Uses relatable app examples; challenges 'decentralized' branding.",
    "participationReason": "Compare export, interoperability and actual control.",
    "sectors": [
      "internet",
      "software",
      "social networks"
    ],
    "scenario": "A creator loses access to an account and wants to carry their audience and work elsewhere.",
    "complexity": "intermediate",
    "prerequisites": [],
    "conceptTags": [
      "open-internet",
      "internet",
      "software",
      "social-networks"
    ],
    "explanation": "Open protocols allow independent services to communicate and users to move between compatible tools. Openness is not the same as decentralization, and switching costs remain.",
    "application": "Exportable data and interoperable protocols make switching providers easier.",
    "limitations": "Platforms can still control interfaces, moderation, hosting and access; standards may not be adopted.",
    "takeaway": "Test portability, compatibility, moderation and who controls critical infrastructure.",
    "optionalFollowUps": [
      {
        "id": "open-internet-deeper",
        "title": "Explore a harder case",
        "optional": true
      }
    ],
    "nodes": {
      "opening": {
        "text": "A creator loses access to an account and wants to carry their audience and work elsewhere.",
        "choices": [
          {
            "id": "ask-practical",
            "label": "Ask what would help in practice",
            "next": "application",
            "effects": {
              "knowledge": [
                "open-internet-problem-framing"
              ]
            }
          },
          {
            "id": "challenge-hype",
            "label": "Question whether this needs Web3 at all",
            "next": "compare",
            "effects": {
              "flags": {
                "open-internet-questioned-necessity": true
              }
            }
          },
          {
            "id": "hear-concern",
            "label": "Ask what worries them most",
            "next": "limitation"
          }
        ]
      },
      "application": {
        "text": "Exportable data and interoperable protocols make switching providers easier.",
        "choices": [
          {
            "id": "how-work",
            "label": "How would that work, simply?",
            "next": "explain",
            "effects": {
              "knowledge": [
                "open-internet"
              ]
            }
          },
          {
            "id": "who-benefits",
            "label": "Who benefits—and who might be left out?",
            "next": "limitation"
          },
          {
            "id": "finish-idea",
            "label": "Keep the idea small and testable",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "compare": {
        "text": "Fair question. A normal database or existing process may solve this more simply. Compare who needs to trust whom, the cost, privacy, and what happens when something goes wrong.",
        "choices": [
          {
            "id": "compare-cost",
            "label": "Compare cost, control and usability first",
            "next": "explain",
            "effects": {
              "knowledge": [
                "not-everything-needs-blockchain"
              ]
            }
          },
          {
            "id": "continue-story",
            "label": "Show me the useful part without the hype",
            "next": "application"
          }
        ]
      },
      "explain": {
        "text": "Open protocols allow independent services to communicate and users to move between compatible tools. Openness is not the same as decentralization, and switching costs remain.",
        "choices": [
          {
            "id": "limitation",
            "label": "What could still go wrong?",
            "next": "limitation",
            "effects": {
              "knowledge": [
                "open-internet"
              ]
            }
          },
          {
            "id": "real-world",
            "label": "What would a realistic first trial look like?",
            "next": "trial"
          }
        ]
      },
      "limitation": {
        "text": "Platforms can still control interfaces, moderation, hosting and access; standards may not be adopted.",
        "choices": [
          {
            "id": "design-around",
            "label": "What safeguard would you add?",
            "next": "trial",
            "effects": {
              "knowledge": [
                "open-internet-limitations"
              ]
            }
          },
          {
            "id": "accept-tradeoff",
            "label": "That trade-off may be worth knowing before deciding",
            "next": "takeaway",
            "effects": {
              "trust": 1
            }
          }
        ]
      },
      "trial": {
        "text": "Start with one small group, clear consent, a way to correct errors, a low-tech fallback, and measures for time, cost and trust. Compare it with the simplest non-blockchain option before scaling.",
        "choices": [
          {
            "id": "takeaway",
            "label": "That sounds testable",
            "next": "takeaway",
            "effects": {
              "flags": {
                "open-internet-trial-designed": true
              }
            }
          },
          {
            "id": "ask-limits",
            "label": "Who is accountable if it fails?",
            "next": "limitation"
          }
        ]
      },
      "takeaway": {
        "text": "The useful discovery: Test portability, compatibility, moderation and who controls critical infrastructure.",
        "choices": [
          {
            "id": "finish",
            "label": "I’ll use that when I evaluate a real project",
            "end": true,
            "completeConversation": true,
            "completeMission": "learn-open-internet",
            "effects": {
              "knowledge": [
                "open-internet"
              ],
              "trust": 1,
              "flags": {
                "open-internet-takeaway-seen": true
              }
            }
          }
        ]
      }
    },
    "start": "opening",
    "missionId": "learn-open-internet",
    "reward": {
      "xp": 18,
      "ngn": 25
    },
    "position": {
      "x": -100,
      "z": 255,
      "f": 1
    },
    "domain": "Open internet and digital infrastructure"
  }
];

export const EDUCATIONAL_NPCS = EDUCATIONAL_MISSIONS.map((mission,index)=>({
 id:mission.id,dialogueId:mission.id,name:mission.npcName,role:mission.role,
 color:["#3A8DAD","#0B7A43","#D28A20","#8C6AC8","#2D6FB3"][index%5],
 look:["woman","guy","man","elder"][index%4],
 spot:null,position:mission.position,sign:"Learn: "+mission.domain,
 kind:"education",major:true,reward:mission.reward,missionId:mission.missionId,conceptId:mission.conceptId
}));

export function getConcept(id){return EDUCATIONAL_CONCEPTS.find(item=>item.id===id)||null;}
export function getEducationalMission(id){return EDUCATIONAL_MISSIONS.find(item=>item.id===id)||null;}
export function getMissionsForSector(sector){return EDUCATIONAL_MISSIONS.filter(item=>item.sectors.includes(sector));}
export function getAvailableEducationalMissions(state={}) {
 const completed=state.completedMissions||{};
 const knowledge=state.knowledge||{};
 return EDUCATIONAL_MISSIONS.filter(mission=>
   !completed[mission.missionId] &&
   mission.prerequisites.every(id=>knowledge[id]||completed["learn-"+id])
 );
}
export function validateEducationalLibrary(){
 const errors=[],ids=new Set();
 for(const concept of EDUCATIONAL_CONCEPTS){
  if(ids.has(concept.id))errors.push("duplicate concept: "+concept.id);ids.add(concept.id);
  for(const field of ["title","explanation","sectors","npcProfiles","scenario","complexity","application","limitations","takeaway","prerequisites"])if(concept[field]==null)errors.push(concept.id+": missing "+field);
 }
 const missionIds=new Set();
 for(const mission of EDUCATIONAL_MISSIONS){
  if(missionIds.has(mission.id))errors.push("duplicate mission: "+mission.id);missionIds.add(mission.id);
  if(!ids.has(mission.conceptId))errors.push(mission.id+": unknown concept "+mission.conceptId);
  if(!mission.nodes[mission.start])errors.push(mission.id+": missing start node");
  for(const [nodeId,node] of Object.entries(mission.nodes)){
   if(!node.text)errors.push(mission.id+"/"+nodeId+": missing text");
   if((node.choices||[]).length>4)errors.push(mission.id+"/"+nodeId+": more than four choices");
   for(const choice of node.choices||[])if(!choice.end&&choice.next&&!mission.nodes[choice.next])errors.push(mission.id+"/"+nodeId+": missing next node "+choice.next);
  }
 }
 return errors;
}
