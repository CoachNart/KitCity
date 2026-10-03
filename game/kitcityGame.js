import { STDATA, hornOf, skyFor, skyNow, transTo, transAlpha } from './stateData.js';

export function mountKitCityGame(THREE) {

(()=>{'use strict';
const K=window.__KC;
const STDATA={
 LG:{name:'Lagos',city:'Ikeja Hub',region:'SW',tone:'#00a8cc',arch:['highrise','lekki','trader'],mood:'modern-bustling',landmark:'Lekki Towers & Third Mainland',time:'commerce-hours',horn:'three-tone',emoji:'🏙️',brt:true},
 OG:{name:'Ogun',city:'Abeokuta',region:'SW',tone:'#8b6f47',arch:['colonial','market','shrine'],mood:'heritage-artsy',landmark:'Olumo Rock & Museum',time:'afternoon-gold',horn:'fuji-horn',emoji:'⛰️'},
 OY:{name:'Oyo',city:'Ibadan',region:'SW',tone:'#c85a54',arch:['colonial','cocoa-house','compound'],mood:'historic-layered',landmark:'Cocoa House & Mapo Hall',time:'sunset-amber',horn:'talking-drum-horn',emoji:'🏛️'},
 OS:{name:'Osun',city:'Osogbo',region:'SW',tone:'#2d5016',arch:['shrine','sacred-grove','craft'],mood:'spiritual-artisan',landmark:'Osun Shrine & Sacred Grove',time:'misty-dawn',horn:'soft-wood-horn',emoji:'🌿'},
 OD:{name:'Ondo',city:'Akure',region:'SW',tone:'#d4a574',arch:['timber','market','resort'],mood:'rural-relaxed',landmark:'Idanre Hills & Resort',time:'afternoon-serene',horn:'horn-of-plenty',emoji:'🏞️'},
 EK:{name:'Ekiti',city:'Ado-Ekiti',region:'SW',tone:'#4a7c59',arch:['hill-settlement','forest-edge','farming'],mood:'mountain-quiet',landmark:'Ekiti Hills & Waterfalls',time:'cool-morning',horn:'forest-horn',emoji:'🌄'},
 ED:{name:'Edo',city:'Benin City',region:'SS',tone:'#8b3a3a',arch:['palace','ancient-wall','modern-blend'],mood:'ancient-regal',landmark:'Benin Palace & Walls',time:'burgundy-dusk',horn:'palace-horn',emoji:'👑'},
 DL:{name:'Delta',city:'Warri',region:'SS',tone:'#1a5f7a',arch:['riverside','oil-modern','stilt-houses'],mood:'oil-coast',landmark:'Warri Refinery & Riverine',time:'hazy-afternoon',horn:'oil-horn',emoji:'🛢️'},
 BY:{name:'Bayelsa',city:'Yenagoa',region:'SS',tone:'#2d5a4a',arch:['swamp-dwelling','waterfront','mangrove'],mood:'water-world',landmark:'Niger Delta Waterways',time:'misty-riverine',horn:'water-horn',emoji:'🌊'},
 RV:{name:'Rivers',city:'Port Harcourt',region:'SS',tone:'#006494',arch:['port-commercial','flare-stacks','modern-port'],mood:'industrial-maritime',landmark:'Flare Stacks & Port',time:'smoky-evening',horn:'port-whistle',emoji:'🚢'},
 AK:{name:'Akwa Ibom',city:'Uyo',region:'SS',tone:'#1f6b5a',arch:['tropical-modern','beach-resort','palm-lined'],mood:'coastal-modern',landmark:'Ibom Air & Beaches',time:'seaside-glow',horn:'coastal-horn',emoji:'🏖️'},
 CR:{name:'Cross River',city:'Calabar',region:'SS',tone:'#2d4a2d',arch:['colonial-mansion','forest-frame','riverine'],mood:'forest-colonial',landmark:'Tinapa & Rain Forest',time:'green-dusk',horn:'forest-bird-horn',emoji:'🌳'},
 AB:{name:'Abia',city:'Aba',region:'SE',tone:'#c84a3a',arch:['trader-warehouse','market','craft'],mood:'hustle-market',landmark:'Aba Market & Shoemaking',time:'busy-bright',horn:'market-horn',emoji:'🏬'},
 IM:{name:'Imo',city:'Owerri',region:'SE',tone:'#5a4a2a',arch:['compound','modern-blend','roundabout'],mood:'traditional-modern',landmark:'Owerri Roundabouts & Art',time:'warm-afternoon',horn:'igbo-horn',emoji:'🎨'},
 AN:{name:'Anambra',city:'Onitsha',region:'SE',tone:'#4a5a7a',arch:['riverine-trader','bridge','modern-market'],mood:'trade-vibrant',landmark:'Niger Bridge & Market',time:'gold-riverside',horn:'trader-horn',emoji:'🌉'},
 EN:{name:'Enugu',city:'Enugu',region:'SE',tone:'#3a5f3a',arch:['hillside','coal-era','modern'],mood:'hill-city',landmark:'Enugu Escarpment & Parks',time:'cool-hillside',horn:'hill-echo-horn',emoji:'⛏️'},
 EB:{name:'Ebonyi',city:'Abakaliki',region:'SE',tone:'#2a4a2a',arch:['rural-farming','hills','craft'],mood:'rural-green',landmark:'Abakaliki Caves & Weaving',time:'misty-valleys',horn:'weaver-horn',emoji:'🧵'},
 KG:{name:'Kogi',city:'Lokoja',region:'NC',tone:'#7a5a3a',arch:['confluence','old-colonial','modern'],mood:'confluence-historic',landmark:'Confluence & Abujas Road',time:'hazy-confluence',horn:'confluence-horn',emoji:'🌊'},
 KW:{name:'Kwara',city:'Ilorin',region:'NC',tone:'#4a4a5a',arch:['islamic-heritage','emir-palace','modern'],mood:'islamic-learned',landmark:'Emir\'s Palace & Mosque',time:'call-to-prayer-glow',horn:'islamic-horn',emoji:'🕌'},
 NR:{name:'Niger',city:'Minna',region:'NC',tone:'#3a5a4a',arch:['savanna-town','farming','modern'],mood:'savanna-calm',landmark:'Niger Upstream & Dams',time:'dry-season-haze',horn:'savanna-horn',emoji:'🌾'},
 BE:{name:'Benue',city:'Makurdi',region:'NC',tone:'#5a3a2a',arch:['river-settlement','farming','bridge'],mood:'farming-riverine',landmark:'Benue Bridge & Agricultural',time:'riverine-amber',horn:'farming-horn',emoji:'🌾'},
 NS:{name:'Nasarawa',city:'Lafia',region:'NC',tone:'#5a4a3a',arch:['hillside-town','rural','farming'],mood:'rural-plateau',landmark:'Nasarawa Hills & Crafts',time:'cool-hillside',horn:'craft-horn',emoji:'⛰️'},
 PT:{name:'Plateau',city:'Jos',region:'NC',tone:'#2a5a4a',arch:['plateau-highland','tourist-town','craft-market'],mood:'cool-highland',landmark:'Jos Plateau & Museum',time:'cool-clear-night',horn:'highland-horn',emoji:'⛰️'},
 TR:{name:'Taraba',city:'Jalingo',region:'NE',tone:'#4a6a3a',arch:['rural-hills','farming','pastoral'],mood:'pastoral-green',landmark:'Taraba Landscape & Farming',time:'green-dusk',horn:'pastoral-horn',emoji:'🐄'},
 AD:{name:'Adamawa',city:'Yola',region:'NE',tone:'#5a5a3a',arch:['sudanic','emir-palace','modern'],mood:'sudanic-islamic',landmark:'Emir\'s Palace & Gongora',time:'savanna-dusk',horn:'sudanic-horn',emoji:'👑'},
 BC:{name:'Bauchi',city:'Bauchi',region:'NE',tone:'#6a5a3a',arch:['sudanic-architecture','emir-palace','fort'],mood:'historic-sudanic',landmark:'Emir\'s Palace & Fort',time:'sunset-savanna',horn:'sudanic-horn',emoji:'🏜️'},
 GM:{name:'Gombe',city:'Gombe',region:'NE',tone:'#5a4a4a',arch:['frontier-town','emir-palace','market'],mood:'frontier-market',landmark:'Gombe Emir\'s Palace',time:'dusty-afternoon',horn:'frontier-horn',emoji:'🏜️'},
 YB:{name:'Yobe',city:'Damaturu',region:'NE',tone:'#7a6a4a',arch:['sahel-town','emir-palace','market'],mood:'sahel-dry',landmark:'Yobe Landscape & Palace',time:'sandy-dusk',horn:'sahel-horn',emoji:'🏜️'},
 BR:{name:'Borno',city:'Maiduguri',region:'NE',tone:'#4a5a6a',arch:['walled-city','emir-palace','historic'],mood:'ancient-walled',landmark:'Maiduguri Walls & Palace',time:'cool-dusk',horn:'ancient-horn',emoji:'🏯'},
 KN:{name:'Kano',city:'Kano',region:'NW',tone:'#4a5a7a',arch:['ancient-city','dye-pits','emir-palace'],mood:'ancient-trade',landmark:'Dala Hill & Ancient Walls',time:'golden-kano',horn:'hausa-horn',emoji:'🟫'},
 KT:{name:'Katsina',city:'Katsina',region:'NW',tone:'#6a5a4a',arch:['walled-city','emir-palace','fort'],mood:'walled-historic',landmark:'Katsina Walls & Palace',time:'dusty-afternoon',horn:'katsina-horn',emoji:'🏯'},
 JG:{name:'Jigawa',city:'Dutse',region:'NW',tone:'#5a6a7a',arch:['farming-town','market','modern'],mood:'farming-busy',landmark:'Jigawa Landscape & Crafts',time:'bright-afternoon',horn:'farming-horn',emoji:'🌾'},
 KD:{name:'Kaduna',city:'Kaduna',region:'NW',tone:'#5a4a4a',arch:['colonial-military','modern-blend','diverse'],mood:'colonial-cosmopolitan',landmark:'Kaduna Textiles & Fort',time:'warm-afternoon',horn:'kaduna-horn',emoji:'🏖️'},
 KB:{name:'Kebbi',city:'Birnin Kebbi',region:'NW',tone:'#7a6a5a',arch:['river-fortress','emir-palace','trading'],mood:'river-fortress',landmark:'Niger Fortress & Palace',time:'riverine-dusk',horn:'fortress-horn',emoji:'🏰'},
 SK:{name:'Sokoto',city:'Sokoto',region:'NW',tone:'#4a5a6a',arch:['sultanate-capital','sultan-palace','historic'],mood:'sultanic-historic',landmark:'Sultan\'s Palace & Mosque',time:'golden-sultanate',horn:'sultanic-horn',emoji:'🧿'},
 ZM:{name:'Zamfara',city:'Gusau',region:'NW',tone:'#6a5a5a',arch:['market-town','emir-palace','historic'],mood:'market-historic',landmark:'Zamfara Landscape & Palace',time:'sunset-savanna',horn:'zamfara-horn',emoji:'👑'},
 FC:{name:'F.C.T. Abuja',city:'Abuja Central',region:'FCT',tone:'#1a5a4a',arch:['planned-city','modern-federal','monuments'],mood:'planned-cosmopolitan',landmark:'Aso Rock & National Mosque',time:'federal-glow',horn:'federal-horn',emoji:'🏛️'}
};

/* horn synthesis: region-specific tones */
const HORNS={
 'three-tone':t=>[659*.5,739,659,659*.5].map((f,i)=>({t:t+i*.08,f,a:.09,w:.005})),
 'fuji-horn':t=>[523,659,523,587].map((f,i)=>({t:t+i*.06,f,a:.08,w:.004})),
 'talking-drum-horn':t=>[440,540,440,440].map((f,i)=>({t:t+i*.1,f,a:.12,w:.006})),
 'soft-wood-horn':t=>[392,523,392].map((f,i)=>({t:t+i*.08,f,a:.06,w:.003})),
 'horn-of-plenty':t=>[659,659,739,659].map((f,i)=>({t:t+i*.07,f,a:.1,w:.005})),
 'forest-horn':t=>[523,440,523].map((f,i)=>({t:t+i*.09,f,a:.08,w:.004})),
 'palace-horn':t=>[587,659,587,523].map((f,i)=>({t:t+i*.08,f,a:.11,w:.006})),
 'oil-horn':t=>[440,440,587,587].map((f,i)=>({t:t+i*.12,f,a:.14,w:.007})),
 'water-horn':t=>[349,392,349].map((f,i)=>({t:t+i*.1,f,a:.07,w:.003})),
 'port-whistle':t=>[880,880,987,880].map((f,i)=>({t:t+i*.08,f,a:.16,w:.008})),
 'coastal-horn':t=>[659,587,659].map((f,i)=>({t:t+i*.07,f,a:.09,w:.005})),
 'forest-bird-horn':t=>[988,880,988,1047].map((f,i)=>({t:t+i*.05,f,a:.07,w:.003})),
 'market-horn':t=>[659,659,587,659].map((f,i)=>({t:t+i*.06,f,a:.1,w:.005})),
 'igbo-horn':t=>[523,587,523].map((f,i)=>({t:t+i*.08,f,a:.09,w:.004})),
 'trader-horn':t=>[659,587,659,739].map((f,i)=>({t:t+i*.07,f,a:.11,w:.006})),
 'hill-echo-horn':t=>[587,659,587,523].map((f,i)=>({t:t+i*.1,f,a:.08,w:.004})),
 'weaver-horn':t=>[440,523,440].map((f,i)=>({t:t+i*.08,f,a:.07,w:.003})),
 'confluence-horn':t=>[523,659,523].map((f,i)=>({t:t+i*.09,f,a:.09,w:.005})),
 'islamic-horn':t=>[587,523,587,523].map((f,i)=>({t:t+i*.1,f,a:.1,w:.005})),
 'savanna-horn':t=>[349,440,349].map((f,i)=>({t:t+i*.12,f,a:.08,w:.004})),
 'farming-horn':t=>[523,523,440].map((f,i)=>({t:t+i*.08,f,a:.08,w:.004})),
 'craft-horn':t=>[659,659,587].map((f,i)=>({t:t+i*.07,f,a:.08,w:.004})),
 'highland-horn':t=>[659,739,659].map((f,i)=>({t:t+i*.08,f,a:.09,w:.005})),
 'pastoral-horn':t=>[349,392,349].map((f,i)=>({t:t+i*.11,f,a:.06,w:.003})),
 'sudanic-horn':t=>[587,587,659,587].map((f,i)=>({t:t+i*.09,f,a:.1,w:.005})),
 'hausa-horn':t=>[659,587,659,587].map((f,i)=>({t:t+i*.08,f,a:.11,w:.006})),
 'katsina-horn':t=>[587,659,587].map((f,i)=>({t:t+i*.09,f,a:.09,w:.005})),
 'kaduna-horn':t=>[523,659,523].map((f,i)=>({t:t+i*.08,f,a:.09,w:.005})),
 'fortress-horn':t=>[659,659,739,739].map((f,i)=>({t:t+i*.1,f,a:.12,w:.006})),
 'sultanic-horn':t=>[587,659,587,523].map((f,i)=>({t:t+i*.1,f,a:.1,w:.006})),
 'zamfara-horn':t=>[523,587,523].map((f,i)=>({t:t+i*.09,f,a:.08,w:.004})),
 'federal-horn':t=>[659,739,659,587].map((f,i)=>({t:t+i*.08,f,a:.12,w:.007})),
 'frontier-horn':t=>[523,440,523].map((f,i)=>({t:t+i*.1,f,a:.08,w:.004})),
};

function hornOf(id){const h=STDATA[id]&&STDATA[id].horn;return HORNS[h]||HORNS['three-tone']}

/* sky and lighting: by mood and night */
const MOODS={
 'modern-bustling':{day:{sky0:'#7fb6cf',sky1:'#e0f5ff'},night:{sky0:'#0a1a2a',sky1:'#1a2a3a'}},
 'heritage-artsy':{day:{sky0:'#d4a574',sky1:'#f5d9c4'},night:{sky0:'#3a2810',sky1:'#5a3a20'}},
 'historic-layered':{day:{sky0:'#c85a54',sky1:'#e5a8a0'},night:{sky0:'#4a1a10',sky1:'#6a2a20'}},
 'spiritual-artisan':{day:{sky0:'#4a7c59',sky1:'#a8d4b0'},night:{sky0:'#1a2a18',sky1:'#2a3a28'}},
 'rural-relaxed':{day:{sky0:'#d4a574',sky1:'#f0d4b8'},night:{sky0:'#3a2a14',sky1:'#5a3a24'}},
 'mountain-quiet':{day:{sky0:'#6a9b7a',sky1:'#b8e0c0'},night:{sky0:'#1a3018',sky1:'#2a4028'}},
 'ancient-regal':{day:{sky0:'#8b3a3a',sky1:'#c08080'},night:{sky0:'#3a0a00',sky1:'#5a1a10'}},
 'oil-coast':{day:{sky0:'#1a5f7a',sky1:'#7fb6cf'},night:{sky0:'#0a1a2a',sky1:'#1a2a3a'}},
 'water-world':{day:{sky0:'#2d5a4a',sky1:'#7fb6cf'},night:{sky0:'#0a1a1a',sky1:'#1a2a2a'}},
 'industrial-maritime':{day:{sky0:'#1a3a5a',sky1:'#6fa8cf'},night:{sky0:'#0a0a1a',sky1:'#1a1a2a'}},
 'coastal-modern':{day:{sky0:'#2a7a9a',sky1:'#a0d8e8'},night:{sky0:'#0a1a2a',sky1:'#1a2a3a'}},
 'forest-colonial':{day:{sky0:'#3a6a4a',sky1:'#a0d4a8'},night:{sky0:'#0a1a0a',sky1:'#1a2a1a'}},
 'hustle-market':{day:{sky0:'#c84a3a',sky1:'#e8a8a0'},night:{sky0:'#4a0a00',sky1:'#6a1a10'}},
 'traditional-modern':{day:{sky0:'#7a6a5a',sky1:'#c8a890'},night:{sky0:'#2a1a0a',sky1:'#4a2a1a'}},
 'trade-vibrant':{day:{sky0:'#6a8aaa',sky1:'#b8d0e0'},night:{sky0:'#1a2a3a',sky1:'#2a3a4a'}},
 'hill-city':{day:{sky0:'#5a7a6a',sky1:'#a8d4c0'},night:{sky0:'#1a2a20',sky1:'#2a3a30'}},
 'rural-green':{day:{sky0:'#4a6a5a',sky1:'#a0d4a8'},night:{sky0:'#0a1a10',sky1:'#1a2a20'}},
 'confluence-historic':{day:{sky0:'#7a6a5a',sky1:'#c8a8a0'},night:{sky0:'#2a1a0a',sky1:'#4a2a1a'}},
 'islamic-learned':{day:{sky0:'#6a7a8a',sky1:'#b8d0e8'},night:{sky0:'#1a2a3a',sky1:'#2a3a4a'}},
 'savanna-calm':{day:{sky0:'#6a8a5a',sky1:'#c8e0a8'},night:{sky0:'#1a2a0a',sky1:'#2a3a1a'}},
 'farming-riverine':{day:{sky0:'#7a8a6a',sky1:'#c8daa8'},night:{sky0:'#1a2a0a',sky1:'#2a3a1a'}},
 'rural-plateau':{day:{sky0:'#7a8a6a',sky1:'#c8daa8'},night:{sky0:'#1a2a0a',sky1:'#2a3a1a'}},
 'cool-highland':{day:{sky0:'#5a9a7a',sky1:'#b0e0c8'},night:{sky0:'#0a2018',sky1:'#1a3028'}},
 'pastoral-green':{day:{sky0:'#5a8a6a',sky1:'#a8d4b0'},night:{sky0:'#0a1a10',sky1:'#1a2a20'}},
 'sudanic-islamic':{day:{sky0:'#8a8a6a',sky1:'#d0d0a8'},night:{sky0:'#2a2a0a',sky1:'#4a4a1a'}},
 'historic-sudanic':{day:{sky0:'#9a7a5a',sky1:'#d8b8a0'},night:{sky0:'#3a1a0a',sky1:'#5a2a1a'}},
 'frontier-market':{day:{sky0:'#8a7a6a',sky1:'#d0b8a0'},night:{sky0:'#2a1a0a',sky1:'#4a2a1a'}},
 'sahel-dry':{day:{sky0:'#9a8a6a',sky1:'#e0d0a8'},night:{sky0:'#3a2a0a',sky1:'#5a3a1a'}},
 'ancient-walled':{day:{sky0:'#7a8a9a',sky1:'#b8d8e8'},night:{sky0:'#1a2a3a',sky1:'#2a3a4a'}},
 'ancient-trade':{day:{sky0:'#8a9a7a',sky1:'#d0e0b8'},night:{sky0:'#2a3a1a',sky1:'#3a4a2a'}},
 'walled-historic':{day:{sky0:'#9a8a6a',sky1:'#d8b8a0'},night:{sky0:'#3a1a0a',sky1:'#5a2a1a'}},
 'farming-busy':{day:{sky0:'#8a9a6a',sky1:'#d0e0a8'},night:{sky0:'#2a3a0a',sky1:'#3a4a1a'}},
 'colonial-cosmopolitan':{day:{sky0:'#8a8a7a',sky1:'#d0d0b8'},night:{sky0:'#2a2a1a',sky1:'#4a4a2a'}},
 'river-fortress':{day:{sky0:'#8a9a8a',sky1:'#d0e0c8'},night:{sky0:'#2a3a2a',sky1:'#3a4a3a'}},
 'sultanic-historic':{day:{sky0:'#8a8a7a',sky1:'#d0d0b8'},night:{sky0:'#2a2a1a',sky1:'#4a4a2a'}},
 'market-historic':{day:{sky0:'#9a8a6a',sky1:'#d8b8a0'},night:{sky0:'#3a1a0a',sky1:'#5a2a1a'}},
 'planned-cosmopolitan':{day:{sky0:'#6a9a8a',sky1:'#b8d8c8'},night:{sky0:'#0a2a1a',sky1:'#1a3a2a'}}
};

function skyFor(id,night){const m=STDATA[id]&&STDATA[id].mood;const mood=MOODS[m]||MOODS['modern-bustling'];return night?mood.night:mood.day}

/* transitions: smooth camera pan, lighting fade */
const TRANS={id:null,from:null,to:null,start:0,dur:2.0};
function transTo(id,now){TRANS.from=TRANS.id;TRANS.to=id;TRANS.id=id;TRANS.start=now;TRANS.dur=2.0}
function transAlpha(now){if(!TRANS.from)return 1;const e=Math.min(1,(now-TRANS.start)/TRANS.dur);return e<.5?1-e*2:e*2-1}
function skyNow(night,now){const a=transAlpha(now);if(a===1)return skyFor(TRANS.id,night);const from=skyFor(TRANS.from,night),to=skyFor(TRANS.id,night);return{sky0:lerpHex(from.sky0,to.sky0,a),sky1:lerpHex(from.sky1,to.sky1,a)}}

function lerpHex(h0,h1,t){const c0=parseInt(h0.slice(1),16),c1=parseInt(h1.slice(1),16);const r0=c0>>16,g0=(c0>>8)&255,b0=c0&255,r1=c1>>16,g1=(c1>>8)&255,b1=c1&255;const r=Math.round(r0+t*(r1-r0)),g=Math.round(g0+t*(g1-g0)),b=Math.round(b0+t*(b1-b0));return'#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('')}

window.__STATES={STDATA,hornOf,skyFor,skyNow,transTo,transAlpha};
    return teardown;
}
