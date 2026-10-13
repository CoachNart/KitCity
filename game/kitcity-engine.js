import * as THREE from 'three';
import {
  authenticateEmailPassword,
  firebaseConfigured,
  flushCloudProgress,
  getCurrentAuthUser,
  getOrCreateUserProfile,
  loadCloudProgress,
  queueCloudProgressSave,
  signOutCurrentUser,
  waitForAuthState,
} from '../lib/firebase';

export default function initKitCity(){
'use strict';
const $=s=>document.querySelector(s);
const bootLoading=$('#bootLoading');
const bootStatus=$('#bootStatus');
const bootProgress=$('#bootProgress');
const bootDone=()=>{ if(bootLoading){ bootLoading.classList.add('done'); setTimeout(()=>bootLoading.remove(),550); } };
const bootStep=(pct,msg)=>{ if(bootProgress) bootProgress.style.width=pct+'%'; if(bootStatus&&msg) bootStatus.textContent=msg; };
bootStep(18,'Loading 3D engine…');
if(typeof THREE==='undefined'){ bootDone(); $('#err').classList.remove('hidden'); return; }

/* ===================== helpers ===================== */
const rand=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=a[i]; a[i]=a[j]; a[j]=t; } return a; };
const rbytes=n=>(window.crypto&&crypto.getRandomValues)?crypto.getRandomValues(new Uint8Array(n)):Array.from({length:n},()=>Math.floor(Math.random()*256));
const hex=n=>Array.from(rbytes(n),b=>b.toString(16).padStart(2,'0')).join('');
const short=a=>a.slice(0,6)+'\u2026'+a.slice(-4);
const lam=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({color:c},o||{}));
const fmtN=n=>'\u20A6'+Math.round(n).toLocaleString('en-US');
const BRAND='#00E5FF',YELLOW='#F6B21A',INK='#1B1C20',GREEN='#0B7A43',EMBER='#E4572E';
function mulberry(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return((t^t>>>14)>>>0)/4294967296; }; }

/* ===================== saved progress ===================== */
const Store=(function(){
  let ls=null; const mem={};
  try{ ls=window.localStorage; ls.setItem('__kn','1'); ls.removeItem('__kn'); }catch(e){ ls=null; }
  return {
    get(k,d){ try{ const v=(ls&&ls.getItem(k))||mem[k]; return v?JSON.parse(v):d; }catch(e){ return d; } },
    set(k,v){ const s=JSON.stringify(v); mem[k]=s; if(ls){ try{ ls.setItem(k,s); }catch(e){} } },
    del(k){ delete mem[k]; if(ls){ try{ ls.removeItem(k); }catch(e){} } }
  };
})();
const KEY='kitnaija_v1';
const DEFAULT_PLAYER={wallet:null,usdc:0,ngn:0,done:{},dodged:0,fell:0,low:false,music:true,sfx:true,lang:'en',pl:'',name:'',scores:{},web3:null,storyProgress:{},storyFlags:{}};
let activeUid=Store.get('kitcity_active_uid',null);
let storageKey=activeUid?KEY+'_user_'+activeUid:KEY;
const P=Object.assign({},DEFAULT_PLAYER,Store.get(storageKey,{}));
const STORY_RESET_VERSION=2;
if(Number(P.storyResetVersion||0)<STORY_RESET_VERSION){
  P.done={};P.storyProgress={};P.storyFlags={};P.storyResetVersion=STORY_RESET_VERSION;
}
if(!P.done||typeof P.done!=='object') P.done={};
if(!P.storyProgress||typeof P.storyProgress!=='object') P.storyProgress={};
if(!P.storyFlags||typeof P.storyFlags!=='object') P.storyFlags={};
let cloudSyncReady=false;
function progressSnapshot(){ return {wallet:P.wallet,usdc:P.usdc,ngn:P.ngn,done:P.done,dodged:P.dodged,fell:P.fell,low:P.low,music:P.music,sfx:P.sfx,lang:P.lang,pl:P.pl,name:P.name,scores:P.scores,web3:P.web3,storyProgress:P.storyProgress||{},storyFlags:P.storyFlags||{},storyResetVersion:STORY_RESET_VERSION}; }
function save(){
  const snapshot=progressSnapshot();
  Store.set(storageKey,snapshot);
  const user=getCurrentAuthUser();
  if(cloudSyncReady&&user&&activeUid===user.uid) queueCloudProgressSave(user.uid,snapshot);
}
function replacePlayerState(data){
  Object.keys(P).forEach(k=>delete P[k]);
  Object.assign(P,DEFAULT_PLAYER,data||{});
  if(!P.done||typeof P.done!=='object') P.done={};
  if(!P.storyProgress||typeof P.storyProgress!=='object') P.storyProgress={};
  if(!P.storyFlags||typeof P.storyFlags!=='object') P.storyFlags={};
  if(Number(P.storyResetVersion||0)<STORY_RESET_VERSION){
    P.done={};P.storyProgress={};P.storyFlags={};P.storyResetVersion=STORY_RESET_VERSION;
  }
}
function activateUserProgress(uid){
  const nextKey=KEY+'_user_'+uid;
  if(activeUid!==uid){
    const stored=Store.get(nextKey,null);
    if(activeUid||stored) replacePlayerState(stored||DEFAULT_PLAYER);
    storageKey=nextKey;
    activeUid=uid;
    Store.set('kitcity_active_uid',uid);
  }else{
    storageKey=nextKey;
  }
}
function mergeCloudProgress(remote){
  if(!remote||typeof remote!=='object') return;
  const local=progressSnapshot();
  const merged=Object.assign({},remote,local);
  merged.done=Object.assign({},remote.done&&typeof remote.done==='object'?remote.done:{},local.done||{});
  merged.scores=Object.assign({},remote.scores&&typeof remote.scores==='object'?remote.scores:{},local.scores||{});
  merged.wallet=local.wallet||remote.wallet||null;
  merged.usdc=Math.max(Number(remote.usdc)||0,Number(local.usdc)||0);
  merged.ngn=Math.max(Number(remote.ngn)||0,Number(local.ngn)||0);
  merged.dodged=Math.max(Number(remote.dodged)||0,Number(local.dodged)||0);
  merged.fell=Math.max(Number(remote.fell)||0,Number(local.fell)||0);
  merged.web3=local.web3||remote.web3||null;
  if(Number(remote.storyResetVersion||0)<STORY_RESET_VERSION){
    merged.done={};merged.storyProgress={};merged.storyFlags={};merged.storyResetVersion=STORY_RESET_VERSION;
  }else{
    merged.storyProgress=Object.assign({},remote.storyProgress||{},local.storyProgress||{});
    merged.storyFlags=Object.assign({},remote.storyFlags||{},local.storyFlags||{});
    merged.storyResetVersion=STORY_RESET_VERSION;
  }
  replacePlayerState(merged);
  save();
}
delete P.xp;
save();
const MISSION_CLEAR_REWARD=.50,MISSION_RETRY_REWARD=.10;
function playerName(){ return (P.name||'Player').trim(); }
function neutralizeGenderedPronouns(value){
  let out=String(value==null?'':value);
  const swap=(word,repl)=>{ const re=new RegExp('\\b'+word+'\\b','gi'); out=out.replace(re,m=>m[0]===m[0].toUpperCase()?repl.charAt(0).toUpperCase()+repl.slice(1):repl); };
  swap('himself','themself'); swap('herself','themself'); swap('hers','theirs');
  swap('he','they'); swap('she','they'); swap('him','them'); swap('his','their'); swap('her','their');
  const fixes=[
    [/\bthey has\b/gi,'they have'],[/\bthey is\b/gi,'they are'],[/\bthey was\b/gi,'they were'],
    [/\bthey does\b/gi,'they do'],[/\bthey confirms\b/gi,'they confirm'],[/\bthey copies\b/gi,'they copy'],
    [/\bthey sends\b/gi,'they send'],[/\bthey needs\b/gi,'they need'],[/\bthey wants\b/gi,'they want'],
    [/\bthey asks\b/gi,'they ask'],[/\bthey says\b/gi,'they say'],[/\bthey shows\b/gi,'they show'],
    [/\bthey gives\b/gi,'they give'],[/\bthey keeps\b/gi,'they keep'],[/\bthey accepts\b/gi,'they accept'],
    [/\bthey holds\b/gi,'they hold'],[/\bthey pays\b/gi,'they pay'],[/\bthey goes\b/gi,'they go'],
    [/\bthey tells\b/gi,'they tell'],[/\bthey makes\b/gi,'they make'],[/\bthey proves\b/gi,'they prove']
  ];
  for(const [re,to] of fixes) out=out.replace(re,m=>m[0]===m[0].toUpperCase()?to.charAt(0).toUpperCase()+to.slice(1):to);
  return out;
}
function personalize(html,mission,preferredNPC){
  let out=String(html==null?'':html).replace(/Agent Kit/g,playerName()).replace(/agent kit/g,playerName());
  const aliases=mission?buildMissionNameAliases(mission):Object.create(null);
  if(preferredNPC){
    const original=String(preferredNPC.originalName||'').trim();
    const current=String(preferredNPC.name||'').trim();
    const missionNPCs=mission?missionNPCObjects(mission):[];
    const originalBelongsToAnother=missionNPCs.some(npc=>npc!==preferredNPC&&String(npc.name||'').trim().toLowerCase()===original.toLowerCase());
    if(original&&current&&original!==current&&!originalBelongsToAnother){
      const escaped=original.replace(/ /g,'\\s+');
      out=out.replace(new RegExp('\\b'+escaped+'\\b','gi'),current);
    }
  }
  Object.keys(aliases).sort((a,b)=>b.length-a.length).forEach(original=>{
    const pattern=original.replace(/ /g,'\\s+');
    out=out.replace(new RegExp('\\b'+pattern+'\\b','gi'),aliases[original]);
  });
  return neutralizeGenderedPronouns(out);
}

/* ===================== sound (synthesised, no files) ===================== */

/* ===================== YouTube soundtrack ===================== */
const MUSIC_QUEUES={
  /* Every city has a distinct first-play video ID. Lagos's existing soundtrack is preserved. */
  'lagos':{label:"Lagos · Existing Soundtrack",videos:["rhrCG0Vtx3g"]},
  'abuja':{label:"Abuja · Contemporary Afrobeats",videos:["421w1j87fEM"]},
  'ph':{label:"Port Harcourt · Niger Delta Afrobeats",videos:["X3Ai6osw3Mk"]},
  'benin':{label:"Benin City · Edo / Contemporary Afrobeats",videos:["eYsldLTYyrM"]},
  'calabar':{label:"Calabar · Contemporary Afrobeats",videos:["OFtYscjjdCk"]},
  'jos':{label:"Jos · Afrobeats",videos:["k6eE3c70hgg"]},
  'ibadan':{label:"Ibadan · Lil Kesh — Shoki",videos:["f34zcceVu7U"]},
  'enugu':{label:"Enugu · Igbo Pop / Afrobeats",videos:["yMSTYtMSbL0"]},
  'kano':{label:"Kano · Contemporary Hausa Music",videos:["1tn8vcSPe70"]},
  'kaduna':{label:"Kaduna · Contemporary Hausa Music",videos:["ddXZE34DFbQ"]},
  'maiduguri':{label:"Maiduguri · Contemporary Hausa Music",videos:["N3xkWjh7UNM"]},
  'owerri':{label:"Owerri · Igbo Pop / Afrobeats",videos:["2lUFM8yTtUc"]},
  'aba':{label:"Aba · Igbo Pop / Afrobeats",videos:["q49JaeHIuF4"]},
  'umuahia':{label:"Umuahia · Igbo Pop / Afrobeats",videos:["71hoOjpy9tY"]},
  'awka':{label:"Awka · Igbo Pop / Afrobeats",videos:["9aEEIyw34Xw"]},
  'onitsha':{label:"Onitsha · Igbo Pop / Afrobeats",videos:["UVnMZUWZt-U"]},
  'asaba':{label:"Asaba · Delta / Contemporary Afrobeats",videos:["lw38RXlOyeY"]},
  'uyo':{label:"Uyo · Contemporary Afrobeats",videos:["xBxwayuEgJA"]},
  'ikot-ekpene':{label:"Ikot Ekpene · Contemporary Afrobeats",videos:["L8lwGVbple4"]},
  'yenagoa':{label:"Yenagoa · Niger Delta Afrobeats",videos:["yQIeKWFmBwE"]},
  'warri':{label:"Warri · Delta / Contemporary Afrobeats",videos:["zrgJAxScaAs"]},
  'makurdi':{label:"Makurdi · Contemporary Afrobeats",videos:["VmakV_meVY0"]},
  'ilorin':{label:"Ilorin · Seyi Vibez — Lagos",videos:["lKeP2yDK_78"]},
  'akure':{label:"Akure · Bella Shmurda & FOLA — Dangbana Riddim",videos:["nwSYUMzIXPM"]},
  'ado-ekiti':{label:"Ado-Ekiti · Chinko Ekun, Lil Kesh & Zlatan — Able God",videos:["rvSyIqZSzHw"]},
  'osogbo':{label:"Osogbo · DJ Tunez, Wizkid, Seyi Vibez & Terry Apala — Apala Disco Remix",videos:["Q-6wx4LekUE"]},
  'abeokuta':{label:"Abeokuta · Seyi Vibez — Instagram",videos:["-zoC0Qdbidc"]},
  'lokoja':{label:"Lokoja · Contemporary Afrobeats",videos:["77iJTnmILrw"]},
  'lafia':{label:"Lafia · Contemporary Hausa Music",videos:["mxULSjNvC7Y"]},
  'bauchi':{label:"Bauchi · Contemporary Hausa Music",videos:["jwxbXMCHj5c"]},
  'gombe':{label:"Gombe · Contemporary Hausa Music",videos:["KIkN66oFBns"]},
  'damaturu':{label:"Damaturu · Contemporary Hausa Music",videos:["TxRI1o4UCzM"]},
  'jalingo':{label:"Jalingo · Contemporary Afrobeats",videos:["cfadXIZA48U"]},
  'yola':{label:"Yola · Contemporary Afrobeats",videos:["cv5chGtfVTg"]},
  'sokoto':{label:"Sokoto · Contemporary Hausa Music",videos:["CWu5SbIrBTc"]},
  'katsina':{label:"Katsina · Contemporary Hausa Music",videos:["Vl4A_zA_kpk"]},
  'birnin-kebbi':{label:"Birnin Kebbi · Contemporary Hausa Music",videos:["CUnp5hD2tZQ"]},
  'minna':{label:"Minna · Contemporary Afrobeats",videos:["WQFDWM-6ytA"]},
  'dutse':{label:"Dutse · Contemporary Hausa Music",videos:["-InI_om5zpQ"]},
  'gusau':{label:"Gusau · Contemporary Hausa Music",videos:["hCR54DuQoBM"]},
  'kafanchan':{label:"Kafanchan · Contemporary Afrobeats",videos:["dkPClcO4Whw"]},
  'damboa':{label:"Damboa · Contemporary Hausa Music",videos:["sO3H9n7J8E4"]},
};
/* Cultural profiles describe the sound direction, not a claim that every track is sung exclusively in one language. */
const CITY_MUSIC_PROFILE={
  abuja:{genre:'Contemporary Afrobeats',label:'Abuja · Contemporary Afrobeats'},
  ph:{genre:'Niger Delta Afrobeats',label:'Port Harcourt · Niger Delta Afrobeats'},
  benin:{genre:'Edo / Contemporary Afrobeats',label:'Benin City · Edo / Contemporary Afrobeats'},
  calabar:{genre:'Contemporary Afrobeats',label:'Calabar · Contemporary Afrobeats'},
  jos:{genre:'Contemporary Afrobeats',label:'Jos · Contemporary Afrobeats'},
  ibadan:{genre:'Yoruba-infused Afrobeats',label:'Ibadan · Yoruba-infused Afrobeats'},
  enugu:{genre:'Igbo Pop / Afrobeats',label:'Enugu · Igbo Pop / Afrobeats'},
  kano:{genre:'Contemporary Hausa Music',label:'Kano · Contemporary Hausa Music'},
  kaduna:{genre:'Contemporary Hausa Music',label:'Kaduna · Contemporary Hausa Music'},
  maiduguri:{genre:'Contemporary Hausa Music',label:'Maiduguri · Contemporary Hausa Music'},
  owerri:{genre:'Igbo Pop / Afrobeats',label:'Owerri · Igbo Pop / Afrobeats'},
  aba:{genre:'Igbo Pop / Afrobeats',label:'Aba · Igbo Pop / Afrobeats'},
  umuahia:{genre:'Igbo Pop / Afrobeats',label:'Umuahia · Igbo Pop / Afrobeats'},
  awka:{genre:'Igbo Pop / Afrobeats',label:'Awka · Igbo Pop / Afrobeats'},
  onitsha:{genre:'Igbo Pop / Afrobeats',label:'Onitsha · Igbo Pop / Afrobeats'},
  asaba:{genre:'Delta / Contemporary Afrobeats',label:'Asaba · Delta / Contemporary Afrobeats'},
  uyo:{genre:'Contemporary Afrobeats',label:'Uyo · Contemporary Afrobeats'},
  'ikot-ekpene':{genre:'Contemporary Afrobeats',label:'Ikot Ekpene · Contemporary Afrobeats'},
  yenagoa:{genre:'Niger Delta Afrobeats',label:'Yenagoa · Niger Delta Afrobeats'},
  warri:{genre:'Delta / Contemporary Afrobeats',label:'Warri · Delta / Contemporary Afrobeats'},
  makurdi:{genre:'Contemporary Afrobeats',label:'Makurdi · Contemporary Afrobeats'},
  ilorin:{genre:'Yoruba-infused Afrobeats',label:'Ilorin · Yoruba-infused Afrobeats'},
  akure:{genre:'Yoruba-infused Afrobeats',label:'Akure · Yoruba-infused Afrobeats'},
  'ado-ekiti':{genre:'Yoruba-infused Afrobeats',label:'Ado-Ekiti · Yoruba-infused Afrobeats'},
  osogbo:{genre:'Yoruba-infused Afrobeats',label:'Osogbo · Yoruba-infused Afrobeats'},
  abeokuta:{genre:'Yoruba-infused Afrobeats',label:'Abeokuta · Yoruba-infused Afrobeats'},
  lokoja:{genre:'Contemporary Afrobeats',label:'Lokoja · Contemporary Afrobeats'},
  lafia:{genre:'Contemporary Hausa Music',label:'Lafia · Contemporary Hausa Music'},
  bauchi:{genre:'Contemporary Hausa Music',label:'Bauchi · Contemporary Hausa Music'},
  gombe:{genre:'Contemporary Hausa Music',label:'Gombe · Contemporary Hausa Music'},
  damaturu:{genre:'Contemporary Hausa Music',label:'Damaturu · Contemporary Hausa Music'},
  jalingo:{genre:'Contemporary Afrobeats',label:'Jalingo · Contemporary Afrobeats'},
  yola:{genre:'Contemporary Afrobeats',label:'Yola · Contemporary Afrobeats'},
  sokoto:{genre:'Contemporary Hausa Music',label:'Sokoto · Contemporary Hausa Music'},
  katsina:{genre:'Contemporary Hausa Music',label:'Katsina · Contemporary Hausa Music'},
  'birnin-kebbi':{genre:'Contemporary Hausa Music',label:'Birnin Kebbi · Contemporary Hausa Music'},
  minna:{genre:'Contemporary Afrobeats',label:'Minna · Contemporary Afrobeats'},
  dutse:{genre:'Contemporary Hausa Music',label:'Dutse · Contemporary Hausa Music'},
  gusau:{genre:'Contemporary Hausa Music',label:'Gusau · Contemporary Hausa Music'},
  kafanchan:{genre:'Contemporary Afrobeats',label:'Kafanchan · Contemporary Afrobeats'},
  damboa:{genre:'Contemporary Hausa Music',label:'Damboa · Contemporary Hausa Music'}
};
Object.entries(CITY_MUSIC_PROFILE).forEach(([key,profile])=>{
  if(MUSIC_QUEUES[key]) MUSIC_QUEUES[key].label=profile.label;
});
const CITY_MUSIC={
  lagos:'lagos', abuja:'abuja', ph:'ph', benin:'benin', calabar:'calabar',
  jos:'jos', ibadan:'ibadan', enugu:'enugu', kano:'kano', kaduna:'kaduna', maiduguri:'maiduguri',
  'owerri':'owerri',
  'aba':'aba',
  'umuahia':'umuahia',
  'awka':'awka',
  'onitsha':'onitsha',
  'asaba':'asaba',
  'uyo':'uyo',
  'ikot-ekpene':'ikot-ekpene',
  'yenagoa':'yenagoa',
  'warri':'warri',
  'makurdi':'makurdi',
  'ilorin':'ilorin',
  'akure':'akure',
  'ado-ekiti':'ado-ekiti',
  'osogbo':'osogbo',
  'abeokuta':'abeokuta',
  'lokoja':'lokoja',
  'lafia':'lafia',
  'bauchi':'bauchi',
  'gombe':'gombe',
  'damaturu':'damaturu',
  'jalingo':'jalingo',
  'yola':'yola',
  'sokoto':'sokoto',
  'katsina':'katsina',
  'birnin-kebbi':'birnin-kebbi',
  'minna':'minna',
  'dutse':'dutse',
  'gusau':'gusau',
  'kafanchan':'kafanchan',
  'damboa':'damboa'
};
/* Validate every configured city queue. Reusing tracks across cities is intentional:
   regional queues need reliable fallbacks, not 42 unverified one-off uploads. */
(()=>{
  Object.entries(MUSIC_QUEUES).forEach(([city,queue])=>{
    if(!queue||!Array.isArray(queue.videos)||!queue.videos.length) throw new Error('Empty music queue: '+city);
    queue.videos.forEach(id=>{
      if(!/^[A-Za-z0-9_-]{11}$/.test(id)) throw new Error('Invalid YouTube video ID in '+city+': '+id);
    });
  });
  Object.keys(CITY_MUSIC).forEach(city=>{
    if(city!=='lagos'&&!MUSIC_QUEUES[CITY_MUSIC[city]]) throw new Error('Missing city music queue: '+city);
  });
})();
/* Normalize both internal city keys and display names before soundtrack lookup.
   Some navigation/settings flows pass "Port Harcourt" while the world uses "ph";
   silently treating those names as Lagos made unrelated cities share Lagos audio. */
const CITY_MUSIC_ALIASES={
  /* Internal city names and the actual Nigerian state names used by the world registry. */
  'port-harcourt':'ph','portharcourt':'ph','port-harcourt-city':'ph','ph-city':'ph',
  'benin-city':'benin','benincity':'benin','benin-city-edo':'benin',
  'calabar-city':'calabar','federal-capital-territory':'abuja','fct':'abuja','abuja-fct':'abuja',
  'ikot-epene':'ikot-ekpene','ikotepene':'ikot-ekpene','birnin-kebbi-city':'birnin-kebbi',
  'ado-ekiti-city':'ado-ekiti','adoekiti':'ado-ekiti',
  /* 36 states + FCT. State locations route to a culturally relevant regional queue. */
  'abia':'umuahia','adamawa':'yola','akwa-ibom':'uyo','akwaibom':'uyo',
  'anambra':'awka','bauchi-state':'bauchi','bayelsa':'yenagoa','benue':'makurdi',
  'borno':'maiduguri','cross-river':'calabar','crossriver':'calabar',
  'delta-state':'asaba','ebonyi':'enugu','edo':'benin','ekiti':'ado-ekiti',
  'enugu-state':'enugu','gombe-state':'gombe','imo':'owerri','jigawa':'dutse',
  'kaduna-state':'kaduna','kano-state':'kano','katsina-state':'katsina',
  'kebbi':'birnin-kebbi','kogi':'lokoja','kwara':'ilorin','lagos-state':'lagos',
  'nasarawa':'lafia','nassarawa':'lafia','niger':'minna','niger-state':'minna','delta':'asaba','ogun':'abeokuta',
  'ondo':'akure','osun':'osogbo','oyo':'ibadan','plateau':'jos',
  'rivers':'ph','river-state':'ph','sokoto-state':'sokoto','taraba':'jalingo',
  'yobe':'damaturu','zamfara':'gusau','federal-capital-territory-fct':'abuja'
};
function resolveCityMusicKey(value){
  const raw=String(value||'').trim().toLowerCase();
  const normalized=raw.replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  /* World labels may use either the state name or the formal "X State" form. */
  const base=normalized.replace(/-state$/,'');
  const compact=base.replace(/-/g,'');
  const key=CITY_MUSIC_ALIASES[base]||CITY_MUSIC_ALIASES[compact]||base;
  if(MUSIC_QUEUES[key]) return key;
  const mapped=CITY_MUSIC[key]||CITY_MUSIC[base]||CITY_MUSIC[compact];
  return mapped&&MUSIC_QUEUES[mapped]?mapped:null;
}
const YT=(function(){
  /* During Next.js hot reload, an old hidden YouTube iframe can survive after
     this module is evaluated again. Tear it down before creating a new player,
     otherwise its old audio can continue underneath the newly selected track. */
  try{
    const previous=window.__KITCITY_MUSIC_PLAYER__;
    if(previous){ try{previous.stopVideo();}catch(e){} try{previous.destroy();}catch(e){} }
  }catch(e){}
  try{ const staleHost=document.getElementById('ytHost'); if(staleHost) staleHost.remove(); }catch(e){}
  try{ const staleFrame=document.getElementById('ytPlayer'); if(staleFrame) staleFrame.remove(); }catch(e){}
  let player=null,ready=false,failed=false,started=false,wantOn=true,duck=false,loading=false,errCount=0,currentKey='lagos';

  function parseId(v){
    v=String(v||'').trim(); if(!v) return '';
    const m=v.match(/[?&]list=([A-Za-z0-9_-]+)/); if(m) return m[1];
    return /^[A-Za-z0-9_-]{10,}$/.test(v)?v:'';
  }
  function queue(){
    /* A custom playlist is used only after the player explicitly selects it.
       Saved old playlist data never overrides a city soundtrack on its own. */
    if(currentKey==='custom'){
      const custom=parseId(P.pl);
      if(custom) return {label:'Custom YouTube playlist',list:custom,videos:null};
    }
    return MUSIC_QUEUES[currentKey]||null;
  }
  function vol(){ if(ready) try{ player.setVolume(duck?22:55); }catch(e){} }
  function suppressSystemMediaControls(){
    try{
      const session=navigator.mediaSession;
      if(!session) return;
      session.metadata=null;
      session.playbackState='none';
      ['play','pause','stop','seekbackward','seekforward','seekto','previoustrack','nexttrack'].forEach(action=>{
        try{ session.setActionHandler(action,null); }catch(e){}
      });
    }catch(e){}
  }
  function mount(){
    let d=document.getElementById('ytHost');
    if(!d){
      d=document.createElement('div'); d.id='ytHost';
      d.style.cssText='position:fixed;left:-9999px;bottom:0;width:320px;height:240px;opacity:.001;pointer-events:none;z-index:-1';
      d.innerHTML='<div id="ytPlayer"></div>'; document.body.appendChild(d);
    }
  }
  function loadQueue(){
    const q=queue();
    if(!q){ console.error('[KitCity music] No queue for current city:',currentKey); try{player.stopVideo();}catch(e){} return; }
    try{
      /* Most city queues currently contain one video. Load it directly rather
         than asking YouTube to treat a single ID as a playlist; this forces a
         real source switch instead of risking the previous queue continuing. */
      player.stopVideo();
      if(q.videos&&q.videos.length===1){
        player.loadVideoById({videoId:q.videos[0],startSeconds:0});
      }else if(q.videos&&q.videos.length>1){
        player.loadPlaylist(q.videos,0);
      }else if(q.list){
        player.loadPlaylist({list:q.list,listType:'playlist',index:0});
      }else{
        console.error('[KitCity music] Empty soundtrack queue for city:',currentKey);
        try{player.stopVideo();}catch(e){}
        return;
      }
      setTimeout(()=>{
        if(!ready||!player) return;
        try{
          player.setLoop(!!(q.videos&&q.videos.length>1));
          player.setShuffle(!!(q.videos&&q.videos.length>1));
        }catch(e){}
      },350);
    }catch(e){
      console.warn('[KitCity music] Could not load soundtrack for',currentKey,e);
    }
  }
  function create(){
    mount();
    player=new window.YT.Player('ytPlayer',{
      width:320,height:240,
      playerVars:{
        autoplay:0,controls:0,disablekb:1,playsinline:1,rel:0,modestbranding:1,
        origin:location.origin&&location.origin.indexOf('http')===0?location.origin:undefined
      },
      events:{
        onReady:()=>{
          ready=true; errCount=0; loadQueue(); vol();
          if(wantOn && started) play();
        },
        onStateChange:ev=>{
          suppressSystemMediaControls();
          if(ev.data===1) errCount=0;
          if(ev.data===0&&wantOn){
            const q=queue();
            try{
              if(q.videos&&q.videos.length===1){
                player.seekTo(0,true);
                player.playVideo();
              }else{
                player.nextVideo();
              }
            }catch(e){ loadQueue(); }
          }
        },
        onError:ev=>{
          errCount++;
          console.warn('[KitCity music] YouTube source error',ev&&ev.data,'for city',currentKey,'video',((queue()||{}).videos||[])[0]||'custom playlist');
          if(errCount>8){ failed=true; return; }
          const q=queue();
          if(q.videos&&q.videos.length===1){
            /* Don't let a failed city source silently keep the previous song. */
            try{ player.stopVideo(); }catch(e){}
          }else{
            try{ player.nextVideo(); }catch(e){}
          }
        }
      }
    });
    window.__KITCITY_MUSIC_PLAYER__=player;
  }
  function load(){
    if(loading||player||failed) return;
    loading=true;
    if(window.YT&&window.YT.Player){ create(); return; }
    window.onYouTubeIframeAPIReady=create;
    const sc=document.createElement('script');
    sc.src='https://www.youtube.com/iframe_api';
    sc.async=true;
    sc.onerror=()=>{ failed=true; };
    document.head.appendChild(sc);
    setTimeout(()=>{ if(!ready) failed=true; },15000);
  }
  function play(){
    /* Never restart a previous city's video if the current state has no mapping. */
    if(!queue()){ if(ready){ try{player.stopVideo();}catch(e){} } return; }
    if(ready){
      try{ if(player.getPlayerState&&player.getPlayerState()===-1) loadQueue(); player.playVideo(); }catch(e){}
    }
  }
  function pause(){ suppressSystemMediaControls(); if(ready){ try{ player.pauseVideo(); }catch(e){} } }
  return {
    parseId,
    start(){
      wantOn=P.music!==false; started=true;
      load();
      if(wantOn) play();
    },
    setOn(v){
      wantOn=!!v;
      if(v){ started=true; load(); play(); } else pause();
    },
    setDuck(b){ duck=b; vol(); },
    next(){ if(ready) try{ player.nextVideo(); }catch(e){} },
    setCity(city){
      const normalized=String(city||'').trim().toLowerCase().replace(/\s+/g,'-');
      /* The shared hub keeps the last selected playable city's soundtrack. */
      const requested=normalized==='kitcity'?(resolveCityMusicKey(curCity)||'lagos'):resolveCityMusicKey(normalized);
      if(!requested){
        /* Clear the old key as well as stopping playback: otherwise a later unlock
           could restart the previous city's soundtrack under an unmapped state. */
        currentKey=null;
        console.error('[KitCity music] No city soundtrack mapping for:',city,'normalized as',normalized);
        if(ready){ try{ player.stopVideo(); }catch(e){} }
        return;
      }
      currentKey=requested;
      console.info('[KitCity music] City soundtrack selected:',city,'=>',currentKey,(MUSIC_QUEUES[currentKey]||{}).videos);
      if(ready){
        try{ loadQueue(); if(wantOn) play(); }catch(e){}
      }
    },
    currentLabel(){ return currentKey==='custom'&&parseId(P.pl)?'Custom YouTube playlist':(MUSIC_QUEUES[currentKey]||{label:'No soundtrack mapped'}).label; },
    setList(v){
      /* Only a deliberate selection can switch away from the city soundtrack. */
      const id=parseId(v);
      P.pl=id?String(v).trim():'';
      currentKey=id?'custom':resolveCityMusicKey(curCity);
      save();
      if(ready){ try{ loadQueue(); if(wantOn) play(); else player.pauseVideo(); }catch(e){} }
    }
  };
})();
const Snd=(function(){
  /* Sound effects only. Music is the YouTube playlist (see YT above). */
  const AC=window.AudioContext||window.webkitAudioContext;
  const noop=()=>{};
  const on={music:P.music!==false,sfx:P.sfx!==false};
  if(!AC) return {unlock:()=>YT.start(),setCity:city=>YT.setCity(city),setMode:noop,duck:b=>YT.setDuck(b),sfx:noop,set:(k,v)=>{ on[k]=v; if(k==='music') YT.setOn(v); },blip:noop};
  let ctx=null,master,gSfx,noiseBuf;
  function applyVol(now){
    if(!ctx) return; const t=ctx.currentTime;
    gSfx.gain.setTargetAtTime(on.sfx?.85:0,t,now?.01:.05);
  }
  function build(){
    master=ctx.createGain(); master.gain.value=.9; master.connect(ctx.destination);
    gSfx=ctx.createGain(); gSfx.connect(master);
    const len=Math.floor(ctx.sampleRate*2); noiseBuf=ctx.createBuffer(1,len,ctx.sampleRate);
    const d=noiseBuf.getChannelData(0); for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
    applyVol(true);
  }
  function ensure(){
    if(!ctx){ try{ ctx=new AC(); }catch(e){ ctx=null; return false; } build(); }
    if(ctx.state==='suspended') ctx.resume();
    return true;
  }
  function tone(freq,t,dur,type,vol,dest,opt){
    const o=ctx.createOscillator(),g=ctx.createGain(); o.type=type||'sine';
    o.frequency.setValueAtTime(freq,t); if(opt&&opt.to) o.frequency.exponentialRampToValueAtTime(opt.to,t+dur);
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),t+.006); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    let n=o; if(opt&&opt.lp){ const f=ctx.createBiquadFilter(); f.type='lowpass'; f.frequency.value=opt.lp; o.connect(f); n=f; }
    n.connect(g); g.connect(dest||gSfx); o.start(t); o.stop(t+dur+.05);
  }
  function burst(t,dur,type,freq,vol,dest,q){
    const s=ctx.createBufferSource(); s.buffer=noiseBuf; const f=ctx.createBiquadFilter(); f.type=type; f.frequency.value=freq; if(q) f.Q.value=q;
    const g=ctx.createGain(); g.gain.setValueAtTime(Math.max(.0002,vol),t); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    s.connect(f); f.connect(g); g.connect(dest||gSfx); s.start(t,Math.random()); s.stop(t+dur+.05);
  }
  const SFX={
    click(t){ tone(560,t,.06,'triangle',.12,gSfx,{to:420}); },
    /* footstep: heel thud + shoe scuff + crisp tap. side alternates left/right, run is heavier and snappier */
    foot(t,a){
      const run=!!(a&&a.run),side=(a&&a.side)?1:-1,v=Math.min(1.15,((a&&a.vol)||1)*(run?.48:.38));
      const p=.9+Math.random()*.2+side*.03;
      tone(150*p,t,.1,'sine',.55*v,gSfx,{to:55*p});
      burst(t,run?.09:.12,'bandpass',(run?1700:1250)*p,.12*v,gSfx,.8);
      burst(t,.03,'highpass',3200,.05*v,gSfx);
      if(run) burst(t+.045,.05,'bandpass',900*p,.06*v,gSfx,.9);
    },
    chime(t){ tone(784,t,.18,'sine',.16,gSfx); tone(1175,t+.12,.3,'sine',.14,gSfx); },
    done(t){ [523,659,784,1047].forEach((f,i)=>tone(f,t+i*.11,.3,'triangle',.16,gSfx)); tone(1568,t+.5,.6,'sine',.12,gSfx); },
    coin(t){ tone(1318,t,.09,'square',.07,gSfx,{lp:3000}); tone(1760,t+.08,.2,'square',.07,gSfx,{lp:3000}); },
    error(t){ tone(170,t,.4,'sawtooth',.14,gSfx,{to:90,lp:700}); },
    good(t){ tone(660,t,.12,'triangle',.14,gSfx); tone(880,t+.1,.2,'triangle',.14,gSfx); },
    bump(t){ burst(t,.25,'lowpass',260,.5,gSfx); tone(90,t,.2,'sine',.3,gSfx,{to:50}); }
  };
  return {
    unlock(){ YT.start(); ensure(); },
    setCity:city=>YT.setCity(city),
    setMode:noop,
    duck(b){ YT.setDuck(b); },
    sfx(n,a){ if(!on.sfx||!ensure()) return; const f=SFX[n]; if(f) f(ctx.currentTime,a); },
    set(k,v){ on[k]=v; if(k==='music') YT.setOn(v); applyVol(); },
    blip(name,n){
      if(!ctx||!on.sfx) return; let h=0; const str=String(name||''); for(let i=0;i<str.length;i++) h=(h*31+str.charCodeAt(i))|0;
      const base=150+(Math.abs(h)%8)*28,t=ctx.currentTime; for(let i=0;i<n;i++) tone(base*(.9+Math.random()*.3),t+i*.07,.055,'triangle',.07,gSfx,{lp:1700});
    }
  };
})();
window.addEventListener('pointerdown',()=>Snd.unlock());

/* ===================== language: English / Naija Pidgin / Igbo / Hausa ===================== */
const L=(en,pcm)=>P.lang==='pcm'?pcm:tr(en);
const PCM={
/*PCM_BEGIN*/
/*PCM_END*/
};
const RULES=[
/*RULES_BEGIN*/
/*RULES_END*/
];
const LOCALIZED_UI={
  ig:{
    'Settings':'Ntọala','Language':'Asụsụ','Choose how the game talks to you.':'Họrọ asụsụ egwuregwu ga-eji agwa gị okwu.',
    'Mission':'Ọrụ','Missions':'Ọrụ','Activity':'Ọganihu','Sign out':'Pụọ','Sign in':'Banye','Create account':'Mepụta akaụntụ',
    'Graphics':'Ngosipụta','High has real sun shadows and cinematic lighting. Low uses fewer pixels and no shadows, so it runs better on older phones.':'Ngosipụta dị elu nwere onyinyo anyanwụ na ọkụ sinima. Nke dị ala na-arụ ọrụ nke ọma na ekwentị ochie.',
    'Low':'Ala','High':'Elu','Switch to High':'Gbanwee gaa Elu','Switch to Low':'Gbanwee gaa Ala',
    'Music':'Egwu','City-based Nigerian music from YouTube. Needs internet.':'Egwu Naịjirịa dabere n’obodo. Ọ chọrọ ịntanetị.',
    'Playlist':'Ndepụta egwu','Paste any public YouTube playlist link to use your own songs.':'Tinye njikọ ndepụta egwu YouTube ọha iji kpọọ egwu nke gị.',
    'Use playlist':'Jiri ndepụta egwu','Skip song':'Mafee egwu','Default':'Nke ndabara','Sound effects':'Ụda egwuregwu',
    'Footsteps, chimes and voices.':'Ụda nzọụkwụ, mgbịrịgba na olu.','How to play':'Otu esi egwu','Move with the left stick or WASD. Hold Run or Shift to run. Tap Talk or press E near a glowing person. The arrow points to your goal. Avoid traffic.':'Jiri joystick aka ekpe ma ọ bụ WASD mee njem. Pịa Gbaa ọsọ ma ọ bụ Shift ka ị gbaa ọsọ. Pịa Kwuo okwu ma ọ bụ E n’akụkụ onye na-enwu. Àkụ́ na-egosi ebe ị na-aga. Zere ụgbọala.',
    'About the streets':'Banyere okporo ụzọ','Reset progress':'Malite ọganihu ọzọ','Reset':'Malite ọzọ','Yes, erase everything':'Ee, hichapụ ihe niile',
    'No wallet yet':'Ị nwebeghị akpa ego','Here':'Ebe a','Talk':'Kwuo okwu','Run':'Gbaa ọsọ','Loading':'Na-ebu',
    'Choose language':'Họrọ asụsụ','Wallet':'Akpa ego','Learn web3 before it costs you.':'Mụta Web3 tupu ọ kpatara gị nsogbu.',
    'Every city teaches you something new.':'Obodo ọ bụla na-akụziri gị ihe ọhụrụ.','A T3Kit game.':'Egwuregwu T3Kit.','Easy access to everything in web3.':'Ụzọ dị mfe ịbanye n’ụwa Web3.'
  },
  ha:{
    'Settings':'Saituna','Language':'Harshe','Choose how the game talks to you.':'Zaɓi harshen da wasan zai yi amfani da shi.',
    'Mission':'Manufa','Missions':'Manufofi','Activity':'Ci gaba','Sign out':'Fita','Sign in':'Shiga','Create account':'Ƙirƙiri asusu',
    'Graphics':'Zane','High has real sun shadows and cinematic lighting. Low uses fewer pixels and no shadows, so it runs better on older phones.':'Ingantaccen zane yana da inuwa da hasken fim. Ƙaramin zane ya fi sauƙi ga tsofaffin wayoyi.',
    'Low':'Ƙasa','High':'Sama','Switch to High':'Canza zuwa sama','Switch to Low':'Canza zuwa ƙasa',
    'Music':'Kiɗa','City-based Nigerian music from YouTube. Needs internet.':'Kiɗan Najeriya bisa birni daga YouTube. Ana buƙatar intanet.',
    'Playlist':'Jerin kiɗa','Paste any public YouTube playlist link to use your own songs.':'Manna hanyar jerin kiɗan YouTube na jama’a don amfani da waƙoƙinka.',
    'Use playlist':'Yi amfani da jerin kiɗa','Skip song':'Tsallake waƙa','Default':'Na asali','Sound effects':'Sautin wasa',
    'Footsteps, chimes and voices.':'Sautin tafiya, ƙararrawa da murya.','How to play':'Yadda ake wasa','Move with the left stick or WASD. Hold Run or Shift to run. Tap Talk or press E near a glowing person. The arrow points to your goal. Avoid traffic.':'Yi motsi da sandar hagu ko WASD. Riƙe Gudu ko Shift don gudu. Danna Yi magana ko E kusa da mutum mai haske. Kibiya tana nuna inda za ka je. Guji ababen hawa.',
    'About the streets':'Game da tituna','Reset progress':'Sake farawa','Reset':'Sake saita','Yes, erase everything':'Eh, goge komai',
    'No wallet yet':'Ba ka da walat tukuna','Here':'Nan','Talk':'Yi magana','Run':'Gudu','Loading':'Ana lodawa',
    'Choose language':'Zaɓi harshe','Wallet':'Walat','Learn web3 before it costs you.':'Koyi Web3 kafin ya jawo maka asara.',
    'Every city teaches you something new.':'Kowane birni yana koya maka sabon abu.','A T3Kit game.':'Wasan T3Kit.','Easy access to everything in web3.':'Sauƙin shiga duniyar Web3.'
  }
};
function tr(t){
  if(!t) return t;
  const m=t.match(/^(\s*)([\s\S]*?)(\s*)$/),core=m[2];
  if(!core||!/[A-Za-z]/.test(core)) return t;
  if(P.lang==='pcm'){
    /*MISS*/
    let out=PCM[core];
    if(out===undefined){ for(let i=0;i<RULES.length;i++){ const mm=core.match(RULES[i][0]); if(mm){ out=RULES[i][1].apply(null,mm); break; } } }
    return out===undefined?t:m[1]+out+m[3];
  }
  if(P.lang==='ig'||P.lang==='ha'){
    const out=LOCALIZED_UI[P.lang][core];
    return out===undefined?t:m[1]+out+m[3];
  }
  return t;
}
function tx(html){
  if(P.lang==='en'||!html) return html;
  return html.replace(/(^|>)([^<>]+)(?=<|$)/g,(m,a,t)=>a+tr(t));
}
/* ===================== renderer / scene ===================== */
const renderer=new THREE.WebGLRenderer({canvas:$('#gl'),antialias:true,powerPreference:'high-performance'});
function setPR(){ renderer.setPixelRatio(P.low?1:Math.min(window.devicePixelRatio||1,1.75)); }
setPR();
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(50,1,0.5,700);
function resize(){
  const w=window.innerWidth,h=window.innerHeight;
  renderer.setSize(w,h,false);
  camera.aspect=w/h; camera.fov=(w/h<0.8)?64:50; camera.updateProjectionMatrix(); onResizeHook();
}
window.addEventListener('resize',resize); resize();
renderer.toneMapping=THREE.NoToneMapping;
const hemi=new THREE.HemisphereLight(0xFFF1D6,0x4A3A2A,0.8); scene.add(hemi);
const sun=new THREE.DirectionalLight(0xFFD59A,1.05); sun.position.set(-40,60,30); scene.add(sun,sun.target);
const SUNC={kano:0xFFE0A8,maiduguri:0xFFDCA0,kaduna:0xFFE0AE,jos:0xFFF0D8,calabar:0xFFE6C4,ph:0xFFDDB0};
function flagShadows(root){
  root.traverse(o=>{
    if(!o.isMesh) return;
    o.receiveShadow=true;
    const g=o.geometry; if(!g) return;
    if(!g.boundingBox) g.computeBoundingBox();
    const b=g.boundingBox; o.castShadow=!!b&&(b.max.y-b.min.y)>.6;
  });
}
function setShadows(){
  const on=!P.low; renderer.shadowMap.enabled=on; renderer.shadowMap.type=THREE.PCFSoftShadowMap; sun.castShadow=on;
  const sz=on?1536:512; if(sun.shadow.mapSize.x!==sz){ sun.shadow.mapSize.set(sz,sz); if(sun.shadow.map){ sun.shadow.map.dispose(); sun.shadow.map=null; } }
  const c=sun.shadow.camera; c.left=-75; c.right=75; c.top=75; c.bottom=-75; c.near=10; c.far=260; c.updateProjectionMatrix();
  sun.shadow.bias=-0.0006; sun.shadow.normalBias=.35;
  scene.traverse(o=>{ if(o.material){ const ms=Array.isArray(o.material)?o.material:[o.material]; ms.forEach(m=>{ m.needsUpdate=true; }); } });
}
let mgCount=-1;

/* ===================== people ===================== */
const SKINS=['#8d5a3b','#6b3f26','#a8744f','#5a3421','#7a4a2e'];
const matCache={};
const M=c=>matCache[c]||(matCache[c]=lam(c));
const ball=(r,c,sx,sy,sz)=>{ const m=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),M(c)); m.scale.set(sx||1,sy||1,sz||1); return m; };
const tube=(rt,rb,h,c)=>{ const g=new THREE.CylinderGeometry(rt,rb,h,10); g.translate(0,-h/2,0); return new THREE.Mesh(g,M(c)); };
const boxm=(w,h,d,c)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));
let logoMat=null;
const KITCITY_LOGO_URL='https://i.postimg.cc/qqbdTXky/file-00000000958881f4a776df689a235dec.png';
function getLogoMat(){if(logoMat)return logoMat;const loader=new THREE.TextureLoader();loader.setCrossOrigin('anonymous');const texture=loader.load(KITCITY_LOGO_URL);texture.encoding=THREE.sRGBEncoding;logoMat=new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide});return logoMat;}
const ANK=[];
function ankaraMat(i){
  i=((i%4)+4)%4; if(ANK[i]) return ANK[i];
  const pal=[['#E4572E','#F6B21A','#0B7A43'],['#2D6FB3','#F6B21A','#ffffff'],['#C7457E','#10C8DC','#F6B21A'],['#6a3fb5','#E7D27A','#E4572E']][i];
  const c=document.createElement('canvas'); c.width=c.height=64; const g=c.getContext('2d');
  g.fillStyle=pal[0]; g.fillRect(0,0,64,64);
  for(let y=0;y<4;y++)for(let x=0;x<4;x++){ g.fillStyle=pal[(x+y)%2?1:2]; g.beginPath(); g.arc(x*16+8,y*16+8,6,0,7); g.fill(); g.fillStyle=pal[0]; g.beginPath(); g.arc(x*16+8,y*16+8,2.5,0,7); g.fill(); }
  const t=new THREE.Texture(c); t.needsUpdate=true; t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(2,1);
  return ANK[i]=new THREE.MeshLambertMaterial({map:t});
}
function buildPerson(o){
  o=o||{};
  const skin=o.skin||pick(SKINS),top=o.top||'#2D6FB3',bottom=o.bottom||'#2a2d3a',shoe=o.shoe||'#e9e9e9';
  const fem=!!o.female,style=o.style||'tee',hairC=o.hairColor||'#15110f',hat=o.hat||'#ffffff',detail=!!o.detail;
  const root=new THREE.Group(),rig=new THREE.Group(); root.add(rig); root.scale.setScalar(1.25);
  const hipY=1.32,sw=fem?.36:.42,legC=style==='wrapper'?skin:bottom;
  const U={rig,legAmp:style==='tee'?1:.6};
  const mkLeg=side=>{
    const hip=new THREE.Group(); hip.position.set(side*(fem?.14:.16),hipY,0);
    const knee=new THREE.Group(); knee.position.y=-.62;
    const foot=boxm(.24,.14,.44,shoe); foot.position.set(0,-.63,.08);
    knee.add(tube(.115,.085,.6,legC),foot);
    hip.add(tube(.15,.115,.62,legC),knee); rig.add(hip);
    return {hip,knee};
  };
  U.legL=mkLeg(-1); U.legR=mkLeg(1);
  const pel=boxm(fem?.5:.56,.3,.34,bottom); pel.position.y=hipY+.04; rig.add(pel);
  const upper=new THREE.Group(); upper.position.y=hipY+.15; rig.add(upper); U.upper=upper;
  const tg=new THREE.CylinderGeometry(sw*.82,sw*.68,.82,12); tg.translate(0,.41,0);
  const torso=new THREE.Mesh(tg,M(top)); torso.scale.z=.62; upper.add(torso);
  for(const s of [-1,1]){ const sh=ball(.13,top); sh.position.set(s*sw*.84,.72,0); upper.add(sh); }
  const neck=tube(.085,.09,.16,skin); neck.position.y=.9; upper.add(neck);
  if(style==='kaftan'){ const k=tube(.33,.42,1.3,top); k.scale.z=.72; k.position.y=.78; upper.add(k); }
  if(style==='wrapper'){ const k=tube(.3,.47,.98,bottom); k.scale.z=.8; k.position.y=.12; upper.add(k); if(o.ankara!=null){ k.material=ankaraMat(o.ankara); torso.material=ankaraMat(o.ankara+1); } }
  const slv=style==='kaftan'?.4:.26;
  const mkArm=side=>{
    const sh=new THREE.Group(); sh.position.set(side*sw*.9,.7,0); sh.rotation.z=side*.07;
    const elbow=new THREE.Group(); elbow.position.y=-.5;
    const hand=ball(.085,skin); hand.position.y=-.52;
    elbow.add(tube(.082,.065,.46,skin),hand);
    sh.add(tube(.1,.085,.5,skin),tube(.118,.108,slv,top),elbow); upper.add(sh);
    return {sh,elbow};
  };
  U.armL=mkArm(-1); U.armR=mkArm(1);
  const head=new THREE.Group(); head.position.y=1.06; upper.add(head); U.head=head;
  head.add(ball(.26,skin,.94,1.1,1));
  const nose=ball(.05,skin,1,1.1,1.2); nose.position.set(0,-.03,.265); head.add(nose);
  for(const s of [-1,1]){ const ear=ball(.06,skin,.6,1,.9); ear.position.set(s*.25,-.01,0); head.add(ear); }
  if(detail){
    for(const s of [-1,1]){
      const eye=ball(.034,'#111111',1,1.2,.6); eye.position.set(s*.1,.05,.235); head.add(eye);
      const br=boxm(.1,.022,.02,hairC); br.position.set(s*.1,.11,.238); head.add(br);
    }
    const mouth=boxm(.1,.022,.02,'#5a2a2a'); mouth.position.set(0,-.12,.238); head.add(mouth);
  }
  if(o.shades){ const sg=boxm(.3,.07,.04,'#0b0b0b'); sg.position.set(0,.05,.245); head.add(sg); }
  const half=(r,c,tilt)=>{ const m=new THREE.Mesh(new THREE.SphereGeometry(r,12,8,0,Math.PI*2,0,Math.PI*.5),M(c)); m.scale.set(.96,1.12,1.04); m.rotation.x=tilt; m.position.y=.015; return m; };
  const hs=o.hair||'short';
  if(hs==='short') head.add(half(.272,hairC,-.4));
  else if(hs==='bun'){ head.add(half(.272,hairC,-.4)); const b=ball(.11,hairC); b.position.set(0,.3,-.12); head.add(b); }
  else if(hs==='afro'){ const a=ball(.31,hairC,1.05,.95,1.02); a.position.set(0,.14,-.1); head.add(a); }
  else if(hs==='cap'){ head.add(half(.275,hat,-.22)); const br=boxm(.34,.025,.2,hat); br.position.set(0,.1,.3); head.add(br); }
  else if(hs==='gele'){
    const w=ball(.3,hat,1.12,.7,1.05); w.position.set(0,.2,-.02); head.add(w);
    const fan=boxm(.5,.26,.08,hat); fan.position.set(0,.4,-.02); fan.rotation.z=.15; head.add(fan);
  }
  if(hs==='fila'){ const f=half(.28,hat,-.1); f.rotation.z=.32; head.add(f); }
  else if(hs==='hijab'){ const hj=ball(.3,hat,1,1.12,1.05); hj.position.set(0,.04,-.1); head.add(hj); const dr=boxm(.62,.3,.46,hat); dr.position.set(0,-.3,-.06); head.add(dr); }
  else if(hs==='turban'){ const tb=ball(.34,hat,1.05,.8,1.05); tb.position.set(0,.2,-.04); head.add(tb); }
  if(o.backpack){
    const bp=boxm(.5,.62,.22,INK); bp.position.set(0,.42,-.26); upper.add(bp);
    const trim=boxm(.52,.1,.24,BRAND); trim.position.set(0,.68,-.26); upper.add(trim);
    for(const s of [-1,1]){ const st=boxm(.07,.5,.04,INK); st.position.set(s*.17,.5,.17); upper.add(st); }
  }
  if(o.logo){ const lg=new THREE.Mesh(new THREE.PlaneGeometry(.28,.14),getLogoMat()); lg.position.set(0,.5,.215); upper.add(lg); }
  root.userData=U; return root;
}
function animatePerson(p,ph,amt,lean){
  const u=p.userData,s=Math.sin(ph),c=Math.cos(ph),k=u.legAmp,a=amt*.55*k;
  u.legL.hip.rotation.x=s*a; u.legR.hip.rotation.x=-s*a;
  u.legL.knee.rotation.x=Math.max(0,-c)*amt*.9*k; u.legR.knee.rotation.x=Math.max(0,c)*amt*.9*k;
  u.armL.sh.rotation.x=-s*amt*.7; u.armR.sh.rotation.x=s*amt*.7;
  u.armL.elbow.rotation.x=-(.1+Math.max(0,s)*.55*amt); u.armR.elbow.rotation.x=-(.1+Math.max(0,-s)*.55*amt);
  u.rig.position.y=-1.24*(1-Math.cos(s*a));
  u.upper.rotation.y=s*amt*.12; u.upper.rotation.x=lean||0; u.head.rotation.y=-s*amt*.08;
}
const LOOKS=[
  {top:'#2D6FB3',bottom:'#2a2d3a',hair:'short'},
  {top:'#f2f2f2',bottom:'#8a6a48',hair:'cap',hat:'#f2f2f2',style:'kaftan'},
  {top:'#C7457E',bottom:'#E7D27A',female:true,style:'wrapper',hair:'gele',hat:'#E4572E'},
  {top:'#E7D27A',bottom:'#2a2d3a',hair:'afro'},
  {top:'#6a3fb5',bottom:'#6a3fb5',female:true,style:'wrapper',hair:'gele',hat:'#10C8DC'},
  {top:'#E4572E',bottom:'#2a2d3a',female:true,hair:'bun'},
  {top:'#0B7A43',bottom:'#3a3f55',hair:'short'},
  {top:'#1B1C20',bottom:'#1B1C20',hair:'cap',hat:'#1B1C20',style:'kaftan'}
];
const CITY_LOOKS={
  lagos:[{top:'#2D6FB3',bottom:'#2a2d3a',hair:'short'},{top:'#7a3b8f',bottom:'#7a3b8f',style:'kaftan',hair:'fila',hat:'#7a3b8f'},{top:'#C7457E',bottom:'#E7D27A',female:true,style:'wrapper',hair:'gele',hat:'#E4572E',ankara:0},{top:'#E7D27A',bottom:'#2a2d3a',hair:'afro'},{top:'#6a3fb5',bottom:'#6a3fb5',female:true,style:'wrapper',hair:'gele',hat:'#10C8DC',ankara:2},{top:'#E4572E',bottom:'#2a2d3a',female:true,hair:'bun'},{top:'#0B7A43',bottom:'#3a3f55',hair:'short'},{top:'#2D6FB3',bottom:'#E7D27A',female:true,style:'wrapper',hair:'gele',hat:'#F6B21A',ankara:1},{top:'#ffffff',bottom:'#0B7A43',hair:'short'}],
  abuja:[{top:'#1B1C20',bottom:'#1B1C20',hair:'short'},{top:'#f2f2f2',bottom:'#8a6a48',hair:'cap',hat:'#f2f2f2',style:'kaftan'},{top:'#C7457E',bottom:'#E7D27A',female:true,style:'wrapper',hair:'gele',hat:'#2D6FB3',ankara:3},{top:'#6a3fb5',bottom:'#6a3fb5',female:true,style:'kaftan',hair:'hijab',hat:'#6a3fb5'},{top:'#2D6FB3',bottom:'#2a2d3a',hair:'short'},{top:'#0897A8',bottom:'#2a2d3a',female:true,hair:'bun'},{top:'#0B7A43',bottom:'#0B7A43',style:'kaftan',hair:'fila',hat:'#0B7A43'}],
  kano:[{top:'#f2f2f2',bottom:'#f2f2f2',style:'kaftan',hair:'cap',hat:'#f2f2f2'},{top:'#cfe3ee',bottom:'#cfe3ee',style:'kaftan',hair:'turban',hat:'#ffffff'},{top:'#E7D9B5',bottom:'#E7D9B5',style:'kaftan',hair:'cap',hat:'#C8402A'},{top:'#6a3fb5',bottom:'#6a3fb5',female:true,style:'kaftan',hair:'hijab',hat:'#E4572E'},{top:'#0B7A43',bottom:'#0B7A43',female:true,style:'kaftan',hair:'hijab',hat:'#f2f2f2'},{top:'#1B1C20',bottom:'#1B1C20',style:'kaftan',hair:'cap',hat:'#1B1C20'},{top:'#C7457E',bottom:'#E7D27A',female:true,style:'wrapper',hair:'gele',hat:'#2D6FB3',ankara:2}],
  ph:[{top:'#2D6FB3',bottom:'#2a2d3a',hair:'short'},{top:'#E4572E',bottom:'#2a2d3a',female:true,hair:'bun'},{top:'#C7457E',bottom:'#E7D27A',female:true,style:'wrapper',hair:'gele',hat:'#E4572E',ankara:0},{top:'#6a3fb5',bottom:'#6a3fb5',female:true,style:'wrapper',hair:'gele',hat:'#10C8DC',ankara:1},{top:'#E7D27A',bottom:'#2a2d3a',hair:'afro'},{top:'#0B7A43',bottom:'#3a3f55',hair:'short'},{top:'#7a3b8f',bottom:'#7a3b8f',style:'kaftan',hair:'fila',hat:'#7a3b8f'}]
};
CITY_LOOKS.ibadan=CITY_LOOKS.lagos; CITY_LOOKS.benin=CITY_LOOKS.ph; CITY_LOOKS.calabar=CITY_LOOKS.ph; CITY_LOOKS.enugu=CITY_LOOKS.ph;
CITY_LOOKS.kaduna=CITY_LOOKS.kano.concat(CITY_LOOKS.abuja); CITY_LOOKS.jos=CITY_LOOKS.abuja.concat(CITY_LOOKS.kano); CITY_LOOKS.maiduguri=CITY_LOOKS.kano;
let LOOKSC=LOOKS;
const LK={
  mama:{top:BRAND,bottom:'#E4572E',female:true,style:'wrapper',hair:'gele',hat:'#F6B21A',skin:'#6b3f26',detail:true},
  suya:{top:'#f2f2f2',bottom:'#f2f2f2',style:'kaftan',hair:'cap',hat:'#ffffff',skin:'#5a3421',detail:true},
  guy:{top:'#6a3fb5',bottom:INK,hair:'cap',hat:INK,shades:true,skin:'#8d5a3b',detail:true},
  trader:{top:'#C7457E',bottom:'#E7D27A',female:true,style:'wrapper',hair:'gele',hat:'#2D6FB3',skin:'#7a4a2e',detail:true},
  man:{top:'#2D6FB3',bottom:'#2a2d3a',hair:'short',skin:'#6b3f26',detail:true},
  elder:{top:'#ffffff',bottom:'#ffffff',style:'kaftan',hair:'cap',hat:'#0B7A43',skin:'#5a3421',detail:true},
  woman:{top:'#0897A8',bottom:'#2a2d3a',female:true,hair:'bun',skin:'#7a4a2e',detail:true},
  clerk:{top:'#e9e9e9',bottom:'#2a2d3a',hair:'short',skin:'#8d5a3b',detail:true}
};

/* ===================== labels ===================== */
function label(text,bg,fg,H0){
  const size=44,font='900 '+size+'px "BadaBoom BB","Badaboom BB",Impact,sans-serif';
  const m=document.createElement('canvas').getContext('2d'); m.font=font;
  const w=Math.ceil(m.measureText(text).width)+44,h=size+28;
  const c=document.createElement('canvas'); c.width=w; c.height=h; const g=c.getContext('2d');
  g.fillStyle=bg||BRAND; g.strokeStyle=INK; g.lineWidth=7;
  const r=14; g.beginPath(); g.moveTo(r+4,4); g.arcTo(w-4,4,w-4,h-4,r); g.arcTo(w-4,h-4,4,h-4,r); g.arcTo(4,h-4,4,4,r); g.arcTo(4,4,w-4,4,r); g.closePath(); g.fill(); g.stroke();
  g.font=font; g.fillStyle=fg||INK; g.textAlign='center'; g.textBaseline='middle'; g.fillText(text,w/2,h/2+2);
  const t=new THREE.Texture(c); t.needsUpdate=true;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));
  const H=H0||1.9; sp.scale.set(H*w/h,H,1); sp.renderOrder=10; return sp;
}

/* ===================== world ===================== */
let R=70, GRID_OFFSET=35, CITY_LAYOUT_INDEX=0;
const colliders=[],buildings=[];
const SPAWN={x:9.5,z:-9.5};
const SPOTS={
  a:{x:10,z:-30,f:-1}, b:{x:-10,z:-105,f:1}, c:{x:80,z:-35,f:-1}, d:{x:60,z:-105,f:1},
  e:{x:-80,z:-35,f:1}, f:{x:-60,z:-105,f:-1}, g:{x:10,z:-175,f:-1}, h:{x:-10,z:-175,f:1},
  i:{x:150,z:-35,f:-1}, j:{x:130,z:-175,f:1}, k:{x:-150,z:-35,f:1}, l:{x:-130,z:-175,f:-1},
  m:{x:80,z:35,f:-1}, n:{x:-80,z:105,f:1}, o:{x:10,z:175,f:-1}, story:{x:-95,z:-35,f:1}, x1:{x:60,z:-105,f:1}, shopdesk:{x:25,z:-42,f:1}, screenshot:{x:18,z:-38,f:-1}, buyer:{x:130,z:105,f:-1}, ledger:{x:-150,z:105,f:1}, ledgerGuide:{x:-156,z:110,f:1}, execution:{x:90,z:115,f:-1}
};
const special=Object.keys(SPOTS).map(k=>SPOTS[k]).concat([SPAWN]);
const nearSpecial=(x,z,d)=>special.some(s=>Math.hypot(s.x-x,s.z-z)<d);

const CITIES={
  lagos:{name:'Lagos',tag:'The hustle capital',lon:3.4,lat:6.5,seed:11,sky:0xF2B87A,fog:[95,250],ground:'#2B2C31',slab:'#B9B3A6',
    paint:['#D9C7A3','#B8CBBF','#E0A58F','#C9B6D6','#9FB7C7','#E7D27A','#CFCFC8','#8FB39A'],h:[10,36],market:3,palm:.55,fleet:[['police',.5],['danfo',4],['keke',3],['okada',3],['sedan',3],['suv',1],['truck',1]],pal:{danfo:['#F6B21A','#1B1C20'],keke:['#F6B21A','#1B1C20'],sedan:['#E9E4DA','#2b2b30','#8a8d93','#C8402A','#2D6FB3'],stripe:null}},
  abuja:{name:'Abuja',tag:'The planned capital',lon:7.5,lat:9.1,seed:23,sky:0xBFD9F2,fog:[120,300],ground:'#33353B',slab:'#C9CCC6',
    paint:['#E8EEF2','#C9D8E4','#B7C6D6','#F2E9D8','#DDE5DA','#A9BCCB'],h:[14,44],market:6,palm:.8,fleet:[['police',.9],['sedan',6],['danfo',2],['suv',3],['truck',1]],pal:{danfo:['#F2F2F2','#0B7A43'],sedan:['#F2F2F2','#F2F2F2','#2b2b30'],stripe:'#0B7A43'}},
  kano:{name:'Kano',tag:'The ancient trading city',lon:8.5,lat:12.0,seed:37,sky:0xF0C79A,fog:[90,240],ground:'#3B3530',slab:'#C8B18F',
    paint:['#D9B98C','#C89F6D','#E5CBA3','#B98B5B','#D2A679','#EBD9B6'],h:[8,20],market:2,palm:.3,fleet:[['police',.3],['keke',5],['okada',4],['danfo',2],['truck',2],['sedan',2]],pal:{danfo:['#F6B21A','#1B1C20'],keke:['#F6B21A','#0B7A43'],sedan:['#E9E4DA','#8a8d93','#2b2b30'],stripe:null}},
  ph:{name:'Port Harcourt',tag:'The garden city',lon:7.0,lat:4.8,seed:51,sky:0x9FB3B8,fog:[70,200],ground:'#26292D',slab:'#9EA39F',
    paint:['#A9B8A8','#8FA79A','#B7B7A8','#9AA7B5','#C4B79F','#7E9C8E'],h:[10,30],market:4,palm:.75,fleet:[['police',.5],['danfo',3],['keke',3],['okada',2],['sedan',3],['truck',2],['suv',1]],pal:{danfo:['#F6B21A','#1B1C20'],keke:['#F6B21A','#2D6FB3'],sedan:['#E9E4DA','#2b2b30','#C8402A','#8a8d93'],stripe:null}}
};
// Expanded Nigerian city worlds: distinct coordinates, seed, climate palette and regional traffic/language.
const EXTRA_CITIES=[["owerri","Owerri",5.48,7.03,63,12047041,"#2E3B32","igbo"],["aba","Aba",5.12,7.37,67,15254682,"#3A3029","igbo"],["umuahia","Umuahia",5.53,7.49,71,13030857,"#343934","igbo"],["awka","Awka",6.21,7.07,73,12571865,"#34393B","igbo"],["onitsha","Onitsha",6.15,6.78,79,14992540,"#39332D","igbo"],["asaba","Asaba",6.2,6.2,83,13097429,"#343B3B","igbo"],["uyo","Uyo",7.91,5.05,89,11060920,"#29352F","ibibio"],["ikot-ekpene","Ikot Ekpene",7.71,5.18,97,11848630,"#2C342E","ibibio"],["yenagoa","Yenagoa",6.26,4.92,101,9549758,"#293638","ijaw"],["warri","Warri",5.75,5.52,103,10926516,"#2C3333","ijaw"],["makurdi","Makurdi",8.53,7.73,107,14010017,"#38352D","tiv"],["ilorin","Ilorin",4.54,8.5,109,14206112,"#39342D","yoruba"],["akure","Akure",5.2,7.25,113,12177591,"#2F3730","yoruba"],["ado-ekiti","Ado-Ekiti",5.23,7.62,127,11848632,"#303831","yoruba"],["osogbo","Osogbo",4.56,7.77,131,12898999,"#33372E","yoruba"],["abeokuta","Abeokuta",3.35,7.15,137,14140320,"#3A342C","yoruba"],["lokoja","Lokoja",6.74,7.8,139,13095349,"#35372F","igala"],["lafia","Lafia",8.49,8.49,149,14075301,"#39352F","hausa"],["bauchi","Bauchi",9.84,10.31,151,14861467,"#3A342D","hausa"],["gombe","Gombe",11.17,10.29,157,14927516,"#39342D","hausa"],["damaturu","Damaturu",11.96,11.75,163,15255450,"#3B352D","kanuri"],["jalingo","Jalingo",11.37,8.89,167,12899256,"#32372F","fulfulde"],["yola","Yola",12.46,9.2,173,14272420,"#39352E","fulfulde"],["sokoto","Sokoto",5.24,13.06,179,15255964,"#3A332B","hausa"],["katsina","Katsina",7.62,12.99,181,15058845,"#3A342C","hausa"],["birnin-kebbi","Birnin Kebbi",4.2,12.45,191,14993822,"#3A352D","hausa"],["minna","Minna",6.56,9.61,193,13944228,"#36342F","nupe"],["dutse","Dutse",9.35,11.76,197,14927774,"#3A342C","hausa"],["gusau","Gusau",6.66,12.17,211,14993308,"#3A342D","hausa"],["kafanchan","Kafanchan",8.3,9.58,223,13748652,"#38352F","hausa"],["damboa","Damboa",12.75,11.15,227,15124635,"#3A342D","kanuri"]];
EXTRA_CITIES.forEach(([key,name,lon,lat,seed,sky,ground,language])=>{
 const northern=['hausa','kanuri','fulfulde','nupe'].includes(language);
 const base=northern?CITIES.kano:(['igbo','ibibio','ijaw'].includes(language)?CITIES.ph:CITIES.lagos);
 const paints=northern?['#D8C39C','#CFBA9B','#B8C6D2','#C88F74']:language==='yoruba'?['#C9D5BB','#D5C3A2','#B9C9D6','#C98F77']:['#C6D8D1','#D5C6AE','#B7C7D6','#C48E7A'];
 CITIES[key]={...base,name,tag:name+' · '+language+' region',lon,lat,seed,sky,ground,slab:northern?'#C8B89B':'#B8B9AA',paint:paints,h:northern?[5,22]:[7,28],market:northern?2:3,palm:northern?.12:(language==='ijaw'||language==='ibibio'?.72:.35),fog:northern?[85,220]:[95,250],localLanguage:language,fleet:northern?[['police',.3],['keke',5],['okada',3],['sedan',2],['truck',2]]:base.fleet};
});
const CITY_X={
  lagos:{styles:[['glass',.62],['admin',.27],['flat',.11]],bridges:[[0,-52],[70,-60]],lm:[['theatre',-35,35],['church',35,105]],
    signs:[['PURE WATER','#0B7A43','#ffffff'],['POS & RECHARGE','#E4572E','#ffffff'],['PROVISIONS','#2D6FB3','#ffffff'],['PHARMACY','#0B7A43','#ffffff'],['BARBING SALON','#1B1C20','#F6B21A'],['FRESH BREAD','#F6B21A','#1B1C20'],['TAILOR','#C7457E','#ffffff'],['PHONE REPAIR','#10C8DC','#1B1C20'],['BUKA','#E4572E','#ffffff']],
    barks:['Oga, wetin dey?','How far?','No shaking!','Customer, come!','Make we dey go!'],barksEn:['Hey boss, what\u2019s up?','How are you?','Easy now!','Customer, come!','Let\u2019s go!'],hawk:['Pure water! Cold!','Gala! Gala!','Zobo, cold zobo!'],conductor:['Oshodi! Oshodi! Enter!','Ojota, Ojota!','Change ready!'],conductorEn:['Oshodi! Oshodi! Get in!','Ojota, Ojota!','Have your change ready!'],
    nsRoads:['Western Avenue','Ikorodu Road','Awolowo Road','Broad Street','Allen Avenue','Herbert Macaulay Way','Lekki Road'],
    ewRoads:['Marina','Adeniran Ogunsanya St','Ozumba Mbadiwe Ave','Kingsway Road','Ahmadu Bello Way','Eko Bridge Road','Apapa Road'],
    districts:['Ikeja','Ojota','Maryland','Surulere','Yaba','Oshodi','Apapa','Lagos Island','Victoria Island']},
  abuja:{styles:[['glass',.4],['flat',.3],['admin',.3]],bridges:[[0,-52]],lm:[['mosque',-35,35],['church',35,105]],
    signs:[['PHARMACY','#0B7A43','#ffffff'],['BOOKSHOP','#2D6FB3','#ffffff'],['CAFE','#7a4a2e','#ffffff'],['TECH HUB','#10C8DC','#1B1C20'],['SUPERMARKET','#E4572E','#ffffff']],
    barks:['Good morning, sir.','Taxi, madam?','Na so e be!','Wuse Market!'],barksEn:['Good morning, sir.','Taxi, madam?','That is how it is!','Wuse Market!'],hawk:['Pure water!','Suya, hot suya!'],conductor:['Wuse! Wuse! Enter!','Garki, Garki!'],
    nsRoads:['Constitution Avenue','Shehu Shagari Way','Ahmadu Bello Way','Independence Avenue','Herbert Macaulay Way','Gimbiya Street','Aminu Kano Crescent'],
    ewRoads:['Ibrahim Babangida Way','Adetokunbo Ademola Crescent','Sultan Abubakar Way','Yakubu Gowon Crescent','Moshood Abiola Way','Olusegun Obasanjo Way','Kur Mohammed Avenue'],
    districts:['Maitama','Asokoro','Jabi','Wuse','Central Area','Garki','Gwarinpa','Utako','Kubwa']},
  kano:{styles:[['banco',.7],['flat',.2],['zinc',.1]],bridges:[],lm:[['mosque',-35,35]],
    signs:[['KASUWA','#E4572E','#ffffff'],['ABINCI','#0B7A43','#ffffff'],['TELA','#C7457E','#ffffff'],['PHARMACY','#0B7A43','#ffffff'],['POS & RECHARGE','#2D6FB3','#ffffff']],
    barks:['Sannu!','Sannu da zuwa!','Barka da yamma!','Kasuwa! Kasuwa!'],hawk:['Ruwa sanyi!','Suya, suya!'],conductor:['Sabon Gari! Hawa!','Kasuwa! Kasuwa!'],
    nsRoads:['Zaria Road','Murtala Mohammed Way','Ibrahim Taiwo Road','Bompai Road','Airport Road','Gwarzo Road','Kofar Mata Road'],
    ewRoads:['Sabon Gari Road','Court Road','France Road','Katsina Road','Hadejia Road','Maiduguri Road','Dawakin Kudu Road'],
    districts:['Nassarawa','Tarauni','Gwale','Fagge','Dala','Sabon Gari','Bompai','Kurmi','Kofar Wambai']},
  ph:{styles:[['zinc',.4],['flat',.45],['glass',.05],['admin',.1]],bridges:[[70,-60]],lm:[['church',-35,35]],flare:[-215,215],
    signs:[['PEPPER SOUP','#E4572E','#ffffff'],['FRESH FISH','#2D6FB3','#ffffff'],['PROVISIONS','#0B7A43','#ffffff'],['POS & RECHARGE','#1B1C20','#F6B21A'],['PURE WATER','#0B7A43','#ffffff'],['BUKA','#C7457E','#ffffff']],
    barks:['My brother!','Wetin dey happen?','Oya, enter!','Fresh fish!'],barksEn:['My brother!','What is happening?','Come on, get in!','Fresh fish!'],hawk:['Pure water!','Roasted corn!','Pepper soup!'],conductor:['Mile One! Mile One!','Town, Town! Enter!'],conductorEn:['Mile One! Mile One!','Town, Town! Get in!'],
    nsRoads:['Aba Road','Ikwerre Road','Olu Obasanjo Road','Trans-Amadi Road','Peter Odili Road','Azikiwe Street','Stadium Road'],
    ewRoads:['Forces Avenue','Bonny Street','Creek Road','Harbour Road','Tombia Street','Ada George Road','Rumuokoro Road'],
    districts:['Old GRA','Rumuola','Diobu','Mile 1','Town','Mile 3','Trans-Amadi','Borokiri','D-Line']}
};
Object.keys(CITY_X).forEach(k=>Object.assign(CITIES[k],CITY_X[k]));
const CITY_Y={
  lagos:{dirt:'#9a5a38',leaf:'#2f7a3f',tree:.3,oka:6,bump:14,pud:18,shopKinds:[['shop',3],['kiosk',3],['container',2],['buka',2],['vulc',1.2],['police',.5]],
    more:[["GOD'S TIME ENT.",'#0B7A43','#ffffff'],['MAMA NKECHI BUKA','#E4572E','#ffffff'],['TOKUNBO AUTO PARTS','#1B1C20','#F6B21A'],['ALHAJI & SONS','#2D6FB3','#ffffff'],['DIVINE FAVOUR STORES','#7a3b8f','#ffffff'],['NEW LIFE BUREAU DE CHANGE','#F6B21A','#1B1C20'],['AMAKA HAIR & BEAUTY','#C7457E','#ffffff'],['CYBER CAFE','#10C8DC','#1B1C20'],['GAS REFILL','#C8402A','#ffffff'],['POS 24/7','#0B7A43','#ffffff']]},
  abuja:{dirt:'#a96b45',leaf:'#3d8f45',tree:.6,oka:0,bump:8,pud:4,shopKinds:[['shop',3],['kiosk',1],['container',1],['buka',1],['police',.7]],
    more:[['WUSE PHARMACY','#0B7A43','#ffffff'],['GARKI BOOKS','#2D6FB3','#ffffff'],['GWARINPA CAFE','#7a4a2e','#ffffff'],['POS 24/7','#1B1C20','#F6B21A'],['DIVINE GRACE STORES','#7a3b8f','#ffffff']]},
  kano:{dirt:'#cfa878',leaf:'#6f8f3e',tree:.85,oka:8,bump:10,pud:0,shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',1],['vulc',1]],
    more:[['ALHAJI & SONS VENTURES','#0B7A43','#ffffff'],['KASUWAR KURMI','#E4572E','#ffffff'],['GIDAN ABINCI','#2D6FB3','#ffffff'],['SHAGON TUFAFI','#7a3b8f','#ffffff'],['MAI SHAYI','#1B1C20','#F6B21A']]},
  ph:{dirt:'#5c4636',leaf:'#1f6b3a',tree:.4,oka:6,bump:12,pud:30,shopKinds:[['shop',3],['kiosk',3],['container',2],['buka',2],['vulc',1.2]],
    more:[['PEPPER SOUP JOINT','#C8402A','#ffffff'],['DIVINE FAVOUR PROVISIONS','#0B7A43','#ffffff'],['NKECHI POS','#F6B21A','#1B1C20'],['FRESH FISH & SNAIL','#2D6FB3','#ffffff'],['TOKUNBO TYRES','#1B1C20','#F6B21A']]}
};
Object.keys(CITY_Y).forEach(k=>{ const y=CITY_Y[k]; Object.assign(CITIES[k],y); CITIES[k].signs=CITIES[k].signs.concat(y.more); });
// Extra cities are declared before the city-specific extension tables. Inherit the
// full base-city build profile only after both tables exist; otherwise districts,
// signs and environmental settings are missing and buildCity() crashes on selection.
EXTRA_CITIES.forEach(([key,, , , , , ,language])=>{
  const baseKey=['hausa','kanuri','fulfulde','nupe'].includes(language)?'kano':
    ['igbo','ibibio','ijaw'].includes(language)?'ph':'lagos';
  const x=CITY_X[baseKey]||{};
  const y=CITY_Y[baseKey]||CITY_Y.lagos;
  Object.assign(CITIES[key],x,y);
  if(x.signs) CITIES[key].signs=x.signs.slice();
  if(y.more) CITIES[key].signs=(CITIES[key].signs||[]).concat(y.more);
});
const NEWC={

  ibadan:{name:'Ibadan',tag:'The city of rusty rooftops',lon:3.9,lat:7.4,seed:61,sky:0xEBC48F,ground:'#2E2D30',slab:'#BDB5A6',
    paint:['#D9B99B','#C98F6B','#E0C9A6','#B7A58F','#9FB7A5','#E7D27A'],market:3,palm:.5,tree:.5,leaf:'#3a7a3f',dirt:'#9a5a38',
    fleet:[['police',.4],['keke',4],['okada',3],['danfo',3],['sedan',3],['truck',1]],styles:[['zinc',.55],['flat',.3],['admin',.1],['glass',.05]],lm:[['mosque',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['container',2],['buka',2],['vulc',1.2],['police',.4]],oka:5,
    more:[['MAPO BUKA','#E4572E','#ffffff'],['IYA DODO','#F6B21A','#1B1C20'],['OLUWASEUN VENTURES','#2D6FB3','#ffffff'],['AGBALAGBA POS','#0B7A43','#ffffff']],
    barks:['E kaaro!','Bawo ni?','How far?','Customer, come!'],barksEn:['Good morning!','How are you?','How are you?','Customer, come!'],hawk:['Pure water!','Gala! Gala!','Dodo! Hot dodo!'],conductor:['Dugbe! Dugbe!','Challenge! Enter!'],
    nsRoads:['Ring Road','Ibadan-Ife Expressway','Iwo Road','Mokola Road','Sango Road','Oyo Road','Challenge Road'],ewRoads:['Dugbe Road','Oba Adebimpe Road','Agodi Gate Road','Bodija Road','Ojoo Road','Eleyele Road','Apata Road'],
    districts:['Bodija','Ojoo','Agodi','Mokola','Dugbe','Challenge','Apata','Oluyole','Iwo Road']},
  kaduna:{name:'Kaduna',tag:'The railway crossroads',lon:7.4,lat:10.5,seed:73,sky:0xE9C9A0,ground:'#35332F',slab:'#C9BBA0',
    paint:['#E0D3B8','#D2BE98','#C9B38C','#E8DCC0','#B9C4B0','#D8B78F'],market:4,palm:.5,tree:.7,leaf:'#6b8a3e',dirt:'#b88a5a',
    fleet:[['police',.5],['keke',4],['sedan',3],['okada',2],['danfo',2],['truck',2]],styles:[['flat',.35],['zinc',.25],['admin',.2],['banco',.2]],lm:[['mosque',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',1],['vulc',1],['police',.4]],oka:4,pud:2,
    more:[['SHAGON ABINCI','#E4572E','#ffffff'],['MALAM AUDU TEA','#7a4a2e','#ffffff'],['KADUNA TEXTILES','#7a3b8f','#ffffff'],['ALHAJI & BROTHERS','#0B7A43','#ffffff']],
    barks:['Sannu!','Barka da zuwa!','Ina kwana?','Boss, come!'],barksEn:['Hello!','Welcome!','How are you?','Boss, come!'],hawk:['Ruwa! Ruwa sanyi!','Suya, suya!'],conductor:['Kawo! Kawo!','Kaduna! Hawa!'],
    nsRoads:['Ahmadu Bello Way','Kachia Road','Independence Way','Waff Road','Constitution Road','Yakubu Gowon Way','Ali Akilu Road'],ewRoads:['Ibrahim Taiwo Road','Katsina Road','Rabah Road','Sultan Road','Narayi Road','Abuja Road','Tafawa Balewa Way'],
    districts:['Barnawa','Kawo','Malali','Ungwan Rimi','Tudun Wada','Sabon Tasha','Television','Kakuri','Rigasa']},
  enugu:{name:'Enugu',tag:'The coal city',lon:7.5,lat:6.45,seed:85,sky:0xB9D3C2,fog:[100,260],ground:'#2D2F2F',slab:'#B0B3AA',
    paint:['#A9C4B0','#C9D8B8','#E0C9A6','#9FB7C7','#E7D27A','#C4B79F'],market:4,palm:.7,tree:.6,leaf:'#2f7a45',dirt:'#8f5a3a',bridges:[[0,-52]],
    fleet:[['police',.5],['keke',4],['sedan',3],['danfo',3],['okada',1],['truck',1]],styles:[['flat',.45],['zinc',.3],['admin',.15],['glass',.1]],lm:[['church',-35,35],['mosque',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['container',2],['buka',2],['vulc',1],['police',.5]],oka:3,pud:10,
    more:[['OFE ONUGBU SPOT','#0B7A43','#ffffff'],['OGBETE MARKET STORES','#E4572E','#ffffff'],['NNA M VENTURES','#2D6FB3','#ffffff'],['COAL CITY POS','#1B1C20','#F6B21A']],
    barks:['Nna m!','Kedu?','Boss, come!','Customer!'],barksEn:['My brother!','How are you?','Boss, come!','Customer!'],hawk:['Pure water!','Akara! Akara!','Fresh ugba!'],conductor:['Ogbete! Ogbete!','Gariki! Enter!'],
    nsRoads:['Okpara Avenue','Ogui Road','Zik Avenue','Agbani Road','Chime Avenue','Abakaliki Road','Nsukka Road'],ewRoads:['Enugu-Onitsha Expressway','Ziks Avenue East','Independence Layout Road','Garden Avenue','New Haven Road','Owerri Road','Edinburgh Road'],
    districts:['Independence Layout','New Haven','Ogui','Uwani','GRA','Achara Layout','Trans-Ekulu','Abakpa','Coal Camp']},
  benin:{name:'Benin City',tag:'The ancient kingdom city',lon:5.6,lat:6.3,seed:97,sky:0xD9BE98,ground:'#2F2C2A',slab:'#B8A68E',
    paint:['#C9835F','#B5694A','#D8A47F','#9E5B43','#E0C29E','#8FAE9A'],market:3,palm:.55,tree:.5,leaf:'#2f7040',dirt:'#a0502e',
    fleet:[['police',.4],['keke',4],['okada',3],['sedan',3],['danfo',2],['truck',1]],styles:[['zinc',.4],['flat',.4],['admin',.1],['glass',.1]],lm:[['church',-35,35],['mosque',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['container',2],['buka',2],['vulc',1.2],['police',.4]],oka:6,pud:12,
    more:[['BENIN BRONZE CRAFTS','#8E2F1B','#ffffff'],['OBA MARKET STORES','#0B7A43','#ffffff'],['MAMA EDO KITCHEN','#E4572E','#ffffff'],['OSAZE POS','#F6B21A','#1B1C20']],
    barks:['Wetin dey?','How far, my guy?','Oya, enter!','Customer!'],barksEn:['What is happening?','How are you, my friend?','Come on, get in!','Customer!'],hawk:['Pure water!','Roasted plantain!'],conductor:['Ring Road! Ring Road!','Ekenwan! Enter!'],
    nsRoads:['Sapele Road','Akpakpava Road','Airport Road','Ring Road','Mission Road','Ikpoba Hill Road','Uselu-Lagos Road'],ewRoads:['Ugbowo Road','Oba Market Road','New Lagos Road','Siluko Road','Ekenwan Road','Upper Mission Road','Aduwawa Road'],
    districts:['GRA','Ugbowo','Oka','Ikpoba Hill','Uselu','Sapele Road','New Benin','Ekenwan','Aduwawa']},
  calabar:{name:'Calabar',tag:'The carnival city',lon:8.3,lat:4.95,seed:109,sky:0xA9C9C6,fog:[80,215],ground:'#2A2D2E',slab:'#B3B8B0',
    paint:['#E7B8A0','#A9D1C2','#F0D58A','#C9B8E0','#9FC0DA','#E8A5A5'],market:3,palm:.85,tree:.5,leaf:'#1f7a3f',dirt:'#6a4a38',
    fleet:[['police',.4],['keke',5],['okada',2],['sedan',3],['danfo',1],['truck',1]],styles:[['zinc',.3],['flat',.4],['admin',.2],['glass',.1]],lm:[['church',-35,35],['theatre',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['container',2],['buka',3],['vulc',1]],oka:3,pud:20,
    more:[['AFANG SOUP SPOT','#0B7A43','#ffffff'],['WATT MARKET STORES','#E4572E','#ffffff'],['CARNIVAL TAILORS','#C7457E','#ffffff'],['FRESH FISH','#2D6FB3','#ffffff']],
    barks:['How you dey?','Wetin dey?','Oya, enter!','Customer!'],barksEn:['How are you?','What is happening?','Come on, get in!','Customer!'],hawk:['Pure water!','Fresh fish!','Afang soup!'],conductor:['Marian! Marian!','Watt Market! Enter!'],
    nsRoads:['Mary Slessor Avenue','Marian Road','Calabar Road','Ekpo Abasi Street','Murtala Mohammed Highway','Atimbo Road','Ndidem Usang Iso Road'],ewRoads:['Target Road','Ikot Ishie Road','Etta Agbor Road','Goldie Street','Hawkins Street','Ndidem Road','Satellite Town Road'],
    districts:['Calabar South','Marian','Atimbo','State Housing','Diamond Hill','Ikot Ansa','Satellite Town','Big Qua','Ediba']},
  jos:{name:'Jos',tag:'The cool plateau city',lon:8.9,lat:9.9,seed:121,sky:0xCFE0EA,fog:[110,280],ground:'#34363A',slab:'#BFC0BA',
    paint:['#D8D0C0','#BFC9B8','#C9B79C','#A9B8C4','#E0C9A6','#9CAF9A'],market:3,palm:.35,tree:.85,leaf:'#3f7a45',dirt:'#9a6a48',
    fleet:[['police',.4],['keke',4],['sedan',3],['danfo',3],['okada',2],['truck',1]],styles:[['flat',.35],['zinc',.4],['admin',.15],['banco',.1]],lm:[['church',-35,35],['mosque',35,105]],
    shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',1],['vulc',1]],oka:3,pud:6,
    more:[['IRISH POTATO STORE','#7a4a2e','#ffffff'],['PLATEAU PHARMACY','#0B7A43','#ffffff'],['TERMINUS POS','#F6B21A','#1B1C20'],['HILL STATION CAFE','#2D6FB3','#ffffff']],
    barks:['Sannu!','Ina kwana?','Boss, come!','Customer!'],barksEn:['Hello!','How are you?','Boss, come!','Customer!'],hawk:['Pure water!','Irish potatoes!','Fresh tomatoes!'],conductor:['Terminus! Terminus!','Bukuru! Hawa!'],
    nsRoads:['Bauchi Road','Ahmadu Bello Way','Murtala Mohammed Way','Zaria Road','Tafawa Balewa Street','Yakubu Gowon Way','Rayfield Road'],ewRoads:['Church Street','Museum Road','Beach Road','Jenta Road','Hwolshe Road','Bukuru Road','Terminus Road'],
    districts:['Terminus','Rayfield','Bukuru','Jenta','Angwan Rogo','Tudun Wada','Hill Station','Anglo-Jos','Rantya']},
  maiduguri:{name:'Maiduguri',tag:'The city of hospitality',lon:13.1,lat:11.85,seed:133,sky:0xF2CC96,fog:[85,230],ground:'#3A352E',slab:'#CDB894',
    paint:['#E0C79B','#D2AE7C','#EAD9B3','#C49A6A','#DDBE8F','#B88B5C'],market:3,palm:.25,tree:.9,leaf:'#6f8f3e',dirt:'#cfa878',
    fleet:[['police',.5],['keke',6],['okada',3],['sedan',2],['truck',2],['danfo',1]],styles:[['banco',.5],['flat',.3],['zinc',.2]],lm:[['mosque',-35,35]],
    shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',1],['vulc',1]],oka:5,pud:0,
    more:[['KASUWAR MONDAY','#E4572E','#ffffff'],['SHAGON TUFAFI','#7a3b8f','#ffffff'],['MAI SHAYI','#1B1C20','#F6B21A'],['GIDAN ABINCI','#2D6FB3','#ffffff']],
    barks:['Sannu!','Ina kwana?','Boss, come!','Customer!'],barksEn:['Hello!','How are you?','Boss, come!','Customer!'],hawk:['Ruwa! Ruwa sanyi!','Suya, suya!','Kunu! Cold kunu!'],conductor:['Monday Market! Hawa!','Baga Road! Hawa!'],
    nsRoads:['Baga Road','Bama Road','Kano Road','Gombole Road','Customs Road','Damboa Road','Jos Road'],ewRoads:['Sir Kashim Ibrahim Road','Shehu Laminu Way','Ngomari Road','Bulumkutu Road','Lagos Street','Mohammed Goni Road','Shehu Garbai Way'],
    districts:['Gwange','Bolori','Maiduguri Central','Shehuri','Pompomari','Bulumkutu','Ngomari','Hausari','Mairi']},
  minna:{name:'Minna',tag:'Capital of Niger State',lon:6.55,lat:9.61,seed:271,sky:0xC9DBC6,ground:'#2F302B',slab:'#BFBDA8',
    paint:['#D6C7A4','#B9C6A4','#E2D1AC','#A9B9B0','#CDB58F','#C1CFA8'],market:4,palm:.4,tree:.7,leaf:'#4a7c3a',dirt:'#94643e',
    fleet:[['police',.4],['keke',4],['okada',3],['sedan',3],['danfo',2],['truck',2]],styles:[['flat',.4],['zinc',.3],['admin',.2],['banco',.1]],lm:[['church',-35,35],['mosque',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['buka',2],['container',2],['vulc',1]],oka:4,pud:6,
    more:[['MINNA POWER STORES','#E4572E','#ffffff'],['BOSSO ROAD PHARMACY','#0B7A43','#ffffff'],['TUNGA MARKET FABRICS','#C7457E','#ffffff'],['MINNA POS','#F6B21A','#1B1C20']],
    barks:['Sannu!','Bawo ni?','Oga, come!','Customer!'],barksEn:['Hello!','How are you?','Boss, come!','Customer!'],hawk:['Pure water!','Fresh tomatoes!','Suya, suya!'],conductor:['Tunga! Hawa!','Bosso! Hawa!'],
    nsRoads:['Bida Road','Paiko Road','Kontagora Road','Ahmadu Bello Way','Minna Bypass','Bosso Road','Airport Road'],ewRoads:['Tunga Road','Shiroro Road','Chanchaga Road','Maitumbi Road','Fanfa Road','Gwari Road','Kpakungu Road'],
    districts:['Tunga','Bosso','Maitumbi','Chanchaga','Fanfa','Shiroro','Gwari','Kpakungu','Dutsen Kura']},
  anambra:{name:'Anambra',tag:'The river trade city',lon:6.78,lat:6.14,seed:151,sky:0xD8C7A2,ground:'#2C2E2C',slab:'#BDB6A4',
    paint:['#D6B98E','#B9C7C0','#E3C29A','#A9B5C0','#CFA981','#D9CFA5'],market:6,palm:.6,tree:.4,leaf:'#3a7a40',dirt:'#8f5e3c',
    fleet:[['police',.4],['keke',4],['okada',4],['danfo',3],['sedan',2],['truck',2]],styles:[['flat',.4],['zinc',.3],['glass',.1],['admin',.2]],lm:[['church',-35,35],['mosque',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['container',2],['buka',2],['vulc',1],['police',.4]],oka:5,pud:14,
    more:[['ONITSHA MAIN MARKET','#E4572E','#ffffff'],['IYIFE SHOES','#2D6FB3','#ffffff'],['OBI PHONE CENTRE','#0B7A43','#ffffff'],['RIVER ROAD POS','#F6B21A','#1B1C20']],
    barks:['Nna m!','Wetin you want?','Oya, come!','Customer!'],barksEn:['My brother!','What do you want?','Come on!','Customer!'],hawk:['Pure water!','Ice water!','Fresh fish!'],conductor:['Main Market! Enter!','Upper Iweka! Hawa!'],
    nsRoads:['Awka Road','Old Market Road','Main Market Road','Nkwelle Road','Upper Iweka Road','Ogbunike Road','Niger Bridge Road'],ewRoads:['Woliwo Road','Ifite Road','Ezi Road','Ogbe Road','Atani Road','Ukpor Road','Chime Road'],
    districts:['Main Market','Upper Iweka','Ogbunike','Woliwo','Ezi','Fegge','Ifite','Nkwelle','Ogbe']},
  owerri:{name:'Imo',tag:'The heartland of Imo',lon:7.03,lat:5.48,seed:163,sky:0xB8D9B0,ground:'#2A3028',slab:'#B7BFAA',
    paint:['#C9D9B0','#A9C4A0','#E4D8B4','#B8C9C0','#D9C7A3','#9FBE9E'],market:4,palm:.8,tree:.8,leaf:'#2b7a3c',dirt:'#7e5a3a',
    fleet:[['police',.4],['keke',3],['sedan',3],['danfo',3],['okada',3],['suv',2]],styles:[['flat',.4],['glass',.2],['admin',.2],['zinc',.2]],lm:[['church',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',2],['vulc',1]],oka:3,pud:10,
    more:[['NEKEDE TRADERS','#E4572E','#ffffff'],['PALM OIL HOUSE','#F6B21A','#1B1C20'],['OWERRI CLASSICS','#2D6FB3','#ffffff'],['SAINT NEKE CAFE','#0B7A43','#ffffff']],
    barks:['Kedu?','Nna, come!','How you dey?','Customer!'],barksEn:['How are you?','Brother, come!','How are you?','Customer!'],hawk:['Pure water!','Palm wine!','Roasted corn!'],conductor:['Douglas! Hawa!','Wetheral! Enter!'],
    nsRoads:['Douglas Road','Wetheral Road','Ikenegbu Road','Egbu Road','Okigwe Road','Port Harcourt Road','Aba Road'],ewRoads:['Works Road','Tetlow Road','Ama Road','Orji Road','Nekede Road','Naze Road','Umuguma Road'],
    districts:['Owerri Municipal','Ikenegbu','Egbu','Nekede','Works Layout','Douglas','Orji','Naze','Umuguma']},
  ilorin:{name:'Kwara',tag:'Where north meets south',lon:4.55,lat:8.5,seed:173,sky:0xF0D2A4,ground:'#3A3430',slab:'#CDBA9A',
    paint:['#E2C79A','#C9A77C','#D8B98A','#EAD5A8','#B88F62','#C8B38D'],market:4,palm:.45,tree:.6,leaf:'#5f8a3e',dirt:'#b07a4c',
    fleet:[['police',.4],['keke',5],['okada',3],['sedan',3],['danfo',2],['truck',2]],styles:[['banco',.3],['flat',.3],['zinc',.3],['admin',.1]],lm:[['mosque',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['buka',3],['container',1],['vulc',1]],oka:4,pud:4,
    more:[['ILORIN RICE STORES','#E4572E','#ffffff'],['MALLAM SHAYI','#7a4a2e','#ffffff'],['OKE-ODE TEXTILES','#7a3b8f','#ffffff'],['GAA AKANBI POS','#0B7A43','#ffffff']],
    barks:['E kaaro!','Bawo ni?','Boss, come!','Customer!'],barksEn:['Good morning!','How are you?','Boss, come!','Customer!'],hawk:['Ruwa! Ruwa sanyi!','Kunu! Cold kunu!'],conductor:['Ilorin! Hawa!','Offa! Hawa!'],
    nsRoads:['Ibrahim Taiwo Road','Ahmadu Bello Way','Murtala Mohammed Way','Ogbomoso Road','Offa Road','Tanke Road','Post Office Road'],ewRoads:['Unity Road','Basin Road','Oke-Oyi Road','Sobi Road','Zango Road','Fate Road','Adewole Road'],
    districts:['Tanke','Taiwo','Sobi','Fate','Basin','Zango','Oke-Oyi','Ubandoko','Adewole']},
  sokoto:{name:'Sokoto',tag:'The Sultan’s city',lon:5.24,lat:13.06,seed:181,sky:0xF3D3A0,ground:'#3D3528',slab:'#D2B894',
    paint:['#E5CFA2','#D6B98A','#EBDDBE','#C7A374','#DCC29A','#B98D5E'],market:3,palm:.2,tree:.6,leaf:'#6f8f3e',dirt:'#c9a070',
    fleet:[['police',.5],['keke',5],['okada',3],['sedan',2],['truck',2],['danfo',1]],styles:[['banco',.5],['flat',.3],['zinc',.2]],lm:[['mosque',-35,35]],
    shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',1],['vulc',1]],oka:4,pud:0,
    more:[['SULTAN DYE HOUSE','#2D6FB3','#ffffff'],['DANDE SHOES','#E4572E','#ffffff'],['SOKOTO DATES','#7a4a2e','#ffffff'],['KARA POS','#0B7A43','#ffffff']],
    barks:['Sannu!','Ina kwana?','Boss, come!','Customer!'],barksEn:['Hello!','How are you?','Boss, come!','Customer!'],hawk:['Ruwa! Ruwa sanyi!','Dates! Sweet dates!'],conductor:['Sultan Road! Hawa!','Kasuwa! Hawa!'],
    nsRoads:['Sultan Abubakar Way','Kano Road','Gusau Road','Bello Road','Tambuwal Road','Gwadabawa Road','Airport Road'],ewRoads:['Usmanu Danfodiyo Road','Kofar Kaura Road','Mabera Road','Gidan Dere Road','Kasuwar Rake Road','Market Road','Rabah Road'],
    districts:['Sultan Quarters','Kofar Kaura','Mabera','Gidan Dere','Rumbu','Dange','Runjin Sambo','Kasuwar Rake','Tudun Wada']},
  abeokuta:{name:'Ogun',tag:'The rock city',lon:3.35,lat:7.15,seed:191,sky:0xE4CDA6,ground:'#3A3631',slab:'#C9BFAE',
    paint:['#D8C4A0','#C4B08C','#E6D6B6','#B5A387','#CDB895','#A8B49A'],market:4,palm:.5,tree:.7,leaf:'#3f7a3a',dirt:'#9a6a40',
    fleet:[['police',.4],['keke',4],['okada',3],['sedan',3],['danfo',2],['truck',1]],styles:[['flat',.35],['zinc',.35],['admin',.15],['banco',.15]],lm:[['church',-35,35],['mosque',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['buka',2],['container',2],['vulc',1]],oka:4,pud:6,
    more:[['KUTO MARKET STORES','#E4572E','#ffffff'],['OLUMO ROCK SOUVENIRS','#7a4a2e','#ffffff'],['EGBA TAILORS','#2D6FB3','#ffffff'],['ABEOKUTA POS','#F6B21A','#1B1C20']],
    barks:['E kaaro!','Bawo ni?','Boss, come!','Customer!'],barksEn:['Good morning!','How are you?','Boss, come!','Customer!'],hawk:['Pure water!','Oranges! Sweet oranges!','Akara!'],conductor:['Kuto! Hawa!','Lafenwa! Enter!'],
    nsRoads:['Lafenwa Road','Oba Adegbola Road','Ibara Road','Kuto Road','Ogun Road','Olumo Road','Ijemo Road'],ewRoads:['Ake Road','Ita-Eko Road','Isabo Road','Panseke Road','Oke-Mosan Road','Ibara Orile Road','Ijeun Road'],
    districts:['Kuto','Lafenwa','Ake','Oke-Mosan','Isabo','Ibara','Panseke','Ijemo','Ita-Eko']},
  asaba:{name:'Delta',tag:'The river port city',lon:6.73,lat:6.2,seed:241,sky:0xB8D4D0,ground:'#2D302F',slab:'#B5BBB1',
    paint:['#C2D0BF','#A9C2B6','#D7C7A6','#9DB5BE','#C8B69A','#B1C6A3'],market:4,palm:.7,tree:.6,leaf:'#2b7a40',dirt:'#7a5a3e',bridges:[[0,-52]],
    fleet:[['police',.5],['keke',3],['sedan',3],['danfo',3],['okada',3],['truck',2]],styles:[['flat',.4],['zinc',.25],['glass',.2],['admin',.15]],lm:[['church',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',2],['container',3],['buka',2],['vulc',1]],oka:4,pud:12,
    more:[['ASABA HARBOUR STORES','#2D6FB3','#ffffff'],['NIGER BRIDGE PHARMACY','#0B7A43','#ffffff'],['DELTA FISH HOUSE','#E4572E','#ffffff'],['ASABA POS','#F6B21A','#1B1C20']],
    barks:['Nna!','Wetin dey?','Oga, come!','Customer!'],barksEn:['My brother!','What is happening?','Boss, come!','Customer!'],hawk:['Pure water!','Fresh fish!','Ice water!'],conductor:['Harbour! Enter!','Okpanam! Hawa!'],
    nsRoads:['Nnebisi Road','Okpanam Road','Harbour Road','Cable Point Road','Ibusa Road','Oko Road','Summit Road'],ewRoads:['Ibusa Road','Okwe Road','Ugbolu Road','Ogbeoma Road','Ogbe Road','Otulu Road','Dukpa Road'],
    districts:['Okpanam','Cable Point','Harbour','Ibusa','Okwe','Ugbolu','Ogbeoma','Summit','Dukpa']},
  uyo:{name:'Akwa Ibom',tag:'The Land of Promise',lon:7.93,lat:5.03,seed:207,sky:0xC9DCC0,ground:'#2E302C',slab:'#C0C4B4',
    paint:['#D5C9AD','#B7C7AD','#E2D2B0','#A9BDB2','#D8BF9A','#C2CFA8'],market:4,palm:.7,tree:.8,leaf:'#2b7a3f',dirt:'#8d6242',
    fleet:[['police',.4],['keke',3],['sedan',4],['suv',3],['danfo',2],['okada',2]],styles:[['flat',.45],['glass',.2],['admin',.2],['zinc',.15]],lm:[['church',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',2],['vulc',1]],oka:3,pud:8,
    more:[['AKWA IBOM SUPERMARKET','#0B7A43','#ffffff'],['ITAM FABRICS','#C7457E','#ffffff'],['UYO FRESH FISH','#2D6FB3','#ffffff'],['ISONG POS','#F6B21A','#1B1C20']],
    barks:['Good day!','How far?','Boss, come!','Customer!'],barksEn:['Good day!','How far?','Boss, come!','Customer!'],hawk:['Pure water!','Fresh fish!','Corn! Hot corn!'],conductor:['Ring Road! Enter!','Ekpan! Hawa!'],
    nsRoads:['Ring Road','Abak Road','Ekpan Road','Aka Road','Nwaniba Road','Oron Road','Ibom Plaza Road'],ewRoads:['Udo Udoma Avenue','Ikot Ekpene Road','Itam Road','Aniong Road','Ewet Road','Akpan Andem Road','Nsikak Eduok Road'],
    districts:['Ewet','Aniong','Nwaniba','Ikot Akpan Abia','Itam','Ewet Housing','Ikpa','Ikot Ekpene Road','Akpan Andem']},
  katsina:{name:'Katsina',tag:'The walled city of the north',lon:7.6,lat:12.99,seed:213,sky:0xF1D4A2,ground:'#3B3429',slab:'#D0B98E',
    paint:['#E4CB9E','#D4B386','#EAD7AE','#C49C6C','#DCC08E','#B88C5C'],market:3,palm:.25,tree:.6,leaf:'#6e8e3c',dirt:'#c69b6a',
    fleet:[['police',.5],['keke',5],['okada',3],['sedan',2],['truck',2],['danfo',1]],styles:[['banco',.5],['flat',.3],['zinc',.2]],lm:[['mosque',-35,35],['mosque',35,105]],
    shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',1],['vulc',1]],oka:4,pud:0,
    more:[['KASUWAR KATSINA','#E4572E','#ffffff'],['MALAM ADAMU TEA','#7a4a2e','#ffffff'],['DAN ILLO TEXTILES','#2D6FB3','#ffffff'],['KATSINA POS','#0B7A43','#ffffff']],
    barks:['Sannu!','Ina kwana?','Boss, come!','Customer!'],barksEn:['Hello!','How are you?','Boss, come!','Customer!'],hawk:['Ruwa! Ruwa sanyi!','Kunu! Cold kunu!','Suya, suya!'],conductor:['Kasuwa! Hawa!','Daura Road! Hawa!'],
    nsRoads:['Kofar Kaura Road','Daura Road','Funtua Road','Mani Road','Kankia Road','Zaria Road','Airport Road'],ewRoads:['Kofar Marusa Road','Sabon Gari Road','Ummaru Musa Road','Dutsin-Ma Road','Ilela Road','Yar’adua Road','Barrack Road'],
    districts:['Kofar Kaura','Kofar Marusa','Sabon Gari','Dutsinma Quarters','Mani','Kankia','Tudun Wada','Barrack','Sabuwa']},
  makurdi:{name:'Benue',tag:'The food basket on the Benue',lon:8.53,lat:7.73,seed:223,sky:0xC6DDB7,ground:'#2D3029',slab:'#BDBFA8',
    paint:['#D0C49F','#B9C7A4','#E0CFA5','#A8B89A','#CFB48A','#C4D0AA'],market:4,palm:.6,tree:.8,leaf:'#3f7f3a',dirt:'#8b6040',bridges:[[0,-52]],
    fleet:[['police',.4],['keke',4],['okada',3],['sedan',3],['danfo',2],['truck',2]],styles:[['flat',.4],['zinc',.3],['banco',.15],['admin',.15]],lm:[['church',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['buka',2],['container',2],['vulc',1]],oka:4,pud:10,
    more:[['WURUKUM YAM HOUSE','#E4572E','#ffffff'],['BENUE RIVER HOTEL','#2D6FB3','#ffffff'],['TIV FABRICS','#C7457E','#ffffff'],['MAKURDI POS','#F6B21A','#1B1C20']],
    barks:['Good morning!','How far?','Boss, come!','Customer!'],barksEn:['Good morning!','How far?','Boss, come!','Customer!'],hawk:['Pure water!','Yam! Fresh yam!','Roasted corn!'],conductor:['Wurukum! Hawa!','Modern Market! Enter!'],
    nsRoads:['North Bank Road','Gboko Road','Wurukum Road','Konshisha Road','Ankpa Road','High Level Road','Benue Road'],ewRoads:['Ochi Road','Ogbo Road','Naka Road','Ikpayongo Road','Dan Asabe Road','Agan Road','Nyiaev Road'],
    districts:['Wurukum','North Bank','High Level','Modern Market','Gboko Road','Ikpayongo','Naka','Agan','Ochi']},
  akure:{name:'Ondo',tag:'The glorious city of the rock',lon:5.19,lat:7.25,seed:251,sky:0xD5C6A6,ground:'#332F2B',slab:'#BFB3A0',
    paint:['#D0BC98','#B7A583','#E0CDAA','#A8B59B','#C9AE87','#9BB0A0'],market:4,palm:.65,tree:.8,leaf:'#2f7a3c',dirt:'#8b5e3c',
    fleet:[['police',.4],['keke',4],['sedan',3],['okada',3],['danfo',2],['suv',2]],styles:[['flat',.4],['zinc',.25],['admin',.2],['glass',.15]],lm:[['church',-35,35],['mosque',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['buka',2],['container',2],['vulc',1]],oka:3,pud:8,
    more:[['AKURE COCOA HOUSE','#7a4a2e','#ffffff'],['OKE-IJEBU STORES','#E4572E','#ffffff'],['ONDO GOLD BUREAU','#F6B21A','#1B1C20'],['AKURE POS','#0B7A43','#ffffff']],
    barks:['E kaaro!','Bawo ni?','Boss, come!','Customer!'],barksEn:['Good morning!','How are you?','Boss, come!','Customer!'],hawk:['Pure water!','Cocoa drink!','Roasted corn!'],conductor:['Oja Oba! Hawa!','Ijapo! Enter!'],
    nsRoads:['Oba Adesida Road','Ilesha Road','Ondo Road','Oyemekun Road','Ijapo Road','Akure-Owo Road','Airport Road'],ewRoads:['Oke Ijebu Road','Alagbaka Road','Ilumoba Road','Arakale Road','Oja Oba Road','Ogbese Road','Obanla Road'],
    districts:['Alagbaka','Oja Oba','Oke Ijebu','Ijapo','Arakale','Ilumoba','Oyemekun','Ogbese','Obanla']},
  bauchi:{name:'Bauchi',tag:'The gateway to Yankari',lon:9.84,lat:10.31,seed:263,sky:0xEFD2A4,ground:'#3A3430',slab:'#D0BC9A',
    paint:['#E1CBA0','#CDB48A','#D9C29A','#EFE0BC','#BC9A6E','#C9B88E'],market:3,palm:.3,tree:.7,leaf:'#5e8a3c',dirt:'#b48258',
    fleet:[['police',.5],['keke',5],['sedan',2],['okada',3],['truck',2],['danfo',1]],styles:[['banco',.45],['flat',.3],['zinc',.25]],lm:[['mosque',-35,35]],
    shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',1],['vulc',1]],oka:4,pud:0,
    more:[['YANKARI TOURS OFFICE','#2D6FB3','#ffffff'],['BAUCHI TEA HOUSE','#7a4a2e','#ffffff'],['GWALLAME TEXTILES','#7a3b8f','#ffffff'],['BAUCHI POS','#0B7A43','#ffffff']],
    barks:['Sannu!','Ina kwana?','Boss, come!','Customer!'],barksEn:['Hello!','How are you?','Boss, come!','Customer!'],hawk:['Ruwa! Ruwa sanyi!','Kunu! Cold kunu!','Suya, suya!'],conductor:['Kasuwa! Hawa!','Yankari! Hawa!'],
    nsRoads:['Maiduguri Road','Jos Road','Gombe Road','Murtala Mohammed Way','Gwallame Road','Azare Road','Airport Road'],ewRoads:['Yelwa Road','Dass Road','Miri Road','Tafawa Balewa Way','Wunti Road','Kofar Wunti Road','Gwallaga Road'],
    districts:['Gwallame','Miri','Wunti','Yelwa','Dass','Tafawa Balewa','Gwallaga','Nasarawa','Kofar Wunti']},
  adoekiti:{name:'Ekiti',tag:'The fountain of knowledge',lon:5.22,lat:7.62,seed:293,sky:0xCFD9B8,ground:'#2D302A',slab:'#B9BDA8',
    paint:['#C9D1AE','#B2BE9A','#DCD3B1','#A4B8A6','#CCB58F','#BFCCA4'],market:4,palm:.6,tree:.8,leaf:'#2d7a3e',dirt:'#8a5e3e',
    fleet:[['police',.4],['keke',4],['okada',3],['sedan',3],['suv',2],['danfo',2]],styles:[['flat',.4],['zinc',.25],['admin',.25],['glass',.1]],lm:[['church',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['buka',2],['container',2],['vulc',1]],oka:3,pud:8,
    more:[['FOUNTAIN BOOKSHOP','#2D6FB3','#ffffff'],['EKITI HONEY HOUSE','#F6B21A','#1B1C20'],['ADO TAILORS','#C7457E','#ffffff'],['ADO-EKITI POS','#0B7A43','#ffffff']],
    barks:['E kaaro!','Bawo ni?','Boss, come!','Customer!'],barksEn:['Good morning!','How are you?','Boss, come!','Customer!'],hawk:['Pure water!','Honey! Pure honey!','Roasted corn!'],conductor:['Ajilosun! Hawa!','Oke Ila! Enter!'],
    nsRoads:['Ikere Road','Ilawe Road','Iworoko Road','Ajilosun Road','Oke Ila Road','Ikole Road','Airport Road'],ewRoads:['Erekesan Road','Ilupeju Road','Ogbontoko Road','Ijigbo Road','Okesha Road','Ogbonna Road','Okeoro Road'],
    districts:['Okesha','Ajilosun','Oke Ila','Ilawe','Erekesan','Ogbontoko','Ijigbo','Iworoko','Ilupeju']},
  gombe:{name:'Gombe',tag:'The Jewel of the East',lon:11.17,lat:10.29,seed:307,sky:0xF0D0A0,ground:'#3B3429',slab:'#D2BB94',
    paint:['#E3C89D','#CFAE7E','#EBD8B2','#BE9A6A','#DAC08A','#B5A07A'],market:3,palm:.3,tree:.7,leaf:'#6a8f3e',dirt:'#c09060',
    fleet:[['police',.5],['keke',5],['okada',3],['sedan',2],['truck',2],['danfo',1]],styles:[['banco',.4],['flat',.35],['zinc',.25]],lm:[['mosque',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',1],['vulc',1]],oka:4,pud:0,
    more:[['GOMBE TOMATO HOUSE','#E4572E','#ffffff'],['BOLARI TEXTILES','#7a3b8f','#ffffff'],['GOMBE PHARMACY','#0B7A43','#ffffff'],['GOMBE POS','#F6B21A','#1B1C20']],
    barks:['Sannu!','Ina kwana?','Boss, come!','Customer!'],barksEn:['Hello!','How are you?','Boss, come!','Customer!'],hawk:['Ruwa! Ruwa sanyi!','Tomatoes!','Kunu!'],conductor:['Bolari! Hawa!','Pantami! Hawa!'],
    nsRoads:['Biu Road','Bauchi Road','Pantami Road','Dukku Road','Kumo Road','Airport Road','Ashaka Road'],ewRoads:['Bolari Road','Pantami Road','Jekadafari Road','Tudun Wada Road','Kwadon Road','Bajoga Road','Dadin Kowa Road'],
    districts:['Bolari','Pantami','Jekadafari','Kwadon','Bajoga','Dadin Kowa','Tudun Wada','Gombe Central','Kumo']},
  yola:{name:'Adamawa',tag:'The old capital of Adamawa',lon:12.46,lat:9.2,seed:311,sky:0xE8CFA2,ground:'#3A3228',slab:'#CDB995',
    paint:['#DCC498','#C9AB7A','#E8D3A8','#B6956C','#D3B584','#A9B49A'],market:3,palm:.45,tree:.8,leaf:'#4e8a3b',dirt:'#a2704a',bridges:[[0,-52]],
    fleet:[['police',.4],['keke',4],['okada',3],['sedan',2],['danfo',2],['truck',2]],styles:[['flat',.4],['banco',.3],['zinc',.2],['admin',.1]],lm:[['mosque',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',1],['vulc',1]],oka:4,pud:6,
    more:[['YOLA RIVER STORES','#2D6FB3','#ffffff'],['ADAMAWA CRAFTS','#7a4a2e','#ffffff'],['JIMETA TELECOM','#E4572E','#ffffff'],['YOLA POS','#0B7A43','#ffffff']],
    barks:['Sannu!','Ina kwana?','Boss, come!','Customer!'],barksEn:['Hello!','How are you?','Boss, come!','Customer!'],hawk:['Ruwa! Ruwa sanyi!','Groundnuts!','Kunu!'],conductor:['Jimeta! Hawa!','Yola! Hawa!'],
    nsRoads:['Jimeta Road','Bauchi Road','Numan Road','Airport Road','Ahmadu Bello Way','Gombe Road','Mubi Road'],ewRoads:['Lamido Road','Jambutu Road','Doubeli Road','Gwadabawa Road','Ngurore Road','Yelwa Road','Yolde Pate Road'],
    districts:['Jimeta','Doubeli','Jambutu','Lamido','Yelwa','Ngurore','Yolde Pate','Gwadabawa','Karewa']},
  abakaliki:{name:'Ebonyi',tag:'The rice city',lon:8.12,lat:6.32,seed:331,sky:0xC8D8BA,ground:'#2E302C',slab:'#BCC0AC',
    paint:['#CAD3B0','#B6C7A0','#DDD2B0','#A5B8A3','#C9B38C','#BBCBA3'],market:4,palm:.7,tree:.8,leaf:'#2e7a3c',dirt:'#8a6040',
    fleet:[['police',.4],['keke',4],['okada',3],['sedan',3],['danfo',2],['truck',2]],styles:[['flat',.4],['zinc',.3],['admin',.15],['banco',.15]],lm:[['church',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['buka',2],['container',2],['vulc',1]],oka:3,pud:8,
    more:[['EBONYI RICE MILL','#E4572E','#ffffff'],['ABAKALIKI MARKET STORES','#0B7A43','#ffffff'],['NKALAGU STONE HOUSE','#7a4a2e','#ffffff'],['ABAKALIKI POS','#F6B21A','#1B1C20']],
    barks:['Nna!','Kedu?','Boss, come!','Customer!'],barksEn:['My brother!','How are you?','Boss, come!','Customer!'],hawk:['Pure water!','Rice! Fresh rice!','Roasted corn!'],conductor:['Nkaliki! Hawa!','Market Road! Enter!'],
    nsRoads:['Nkaliki Road','Enugu Road','Ogoja Road','Market Road','Ebonyi Road','Ikwo Road','Airport Road'],ewRoads:['Okposi Road','Ndufu Road','Rice Mill Road','Ezza Road','Presidential Road','Nwofe Road','Ikwo Road East'],
    districts:['Nkaliki','Presidential','Okposi','Ndufu','Rice Mill','Ezza','Nwofe','Ogbo','Ebonyi Estate']},
  abia:{name:'Abia',tag:'Capital: Umuahia',lon:7.49,lat:5.53,seed:341,sky:0xD2C8A4,ground:'#2F2E2B',slab:'#BDB59E',
    paint:['#D8C6A0','#C2AF88','#E3D3AE','#B0A082','#CDBA94','#A9B89A'],market:4,palm:.7,tree:.7,leaf:'#2f7a3c',dirt:'#8a6040',
    fleet:[['police',.4],['keke',3],['okada',3],['sedan',3],['danfo',3],['truck',2]],styles:[['flat',.4],['zinc',.3],['admin',.15],['glass',.15]],lm:[['church',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['buka',2],['container',2],['vulc',1]],oka:4,pud:9,
    more:[['ABA SHOE HOUSE','#E4572E','#ffffff'],['UMUAHIA MARKET STORES','#0B7A43','#ffffff'],['ABIA FABRICS','#C7457E','#ffffff'],['ABIA POS','#F6B21A','#1B1C20']],
    barks:['Nna!','Kedu?','Boss, come!','Customer!'],barksEn:['My brother!','How are you?','Boss, come!','Customer!'],hawk:['Pure water!','Fresh fish!','Ice water!'],conductor:['Umuahia! Hawa!','Aba Road! Enter!'],
    nsRoads:['Aba Road','Ohanze Road','Okigwe Road','Ikot Ekpene Road','Umuahia Ring Road','Ibeku Road','Airport Road'],ewRoads:['Ohanku Road','Ngwa Road','Obingwa Road','Ibeku Road East','Ugwunagbo Road','Nkwoagu Road','Ogbor Road'],
    districts:['Ohanku','Ngwa','Ibeku','Obingwa','Ugwunagbo','Nkwoagu','Ogbor','Ohanze','Umuahia Central']},
  bayelsa:{name:'Bayelsa',tag:'Capital: Yenagoa',lon:6.27,lat:4.92,seed:353,sky:0xA9C9C0,ground:'#26302B',slab:'#A3AE9E',
    paint:['#B2C2A8','#9FB59A','#C9C09A','#8FA9A0','#BBAA8C','#A7BAA0'],market:4,palm:.85,tree:.8,leaf:'#246a38',dirt:'#5f4a33',bridges:[[0,-52]],
    fleet:[['police',.4],['keke',3],['sedan',3],['danfo',2],['okada',3],['truck',2]],styles:[['flat',.45],['zinc',.3],['glass',.15],['admin',.1]],lm:[['church',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['container',2],['buka',2],['vulc',1]],oka:3,pud:18,
    more:[['YENAGOA FISH MARKET','#2D6FB3','#ffffff'],['NIGER DELTA PHARMACY','#0B7A43','#ffffff'],['OGBOINBIRI STORES','#E4572E','#ffffff'],['YENAGOA POS','#F6B21A','#1B1C20']],
    barks:['How far?','Wetin dey?','Oga, come!','Customer!'],barksEn:['How are you?','What is happening?','Boss, come!','Customer!'],hawk:['Fresh fish!','Pure water!','Crayfish!'],conductor:['Okaka! Enter!','Yenagoa! Hawa!'],
    nsRoads:['Ox-Bow Road','Azikoro Road','Okutukutu Road','Onopa Road','Airport Road','Yenegoa Ring Road','Mbiama Road'],ewRoads:['Akenfa Road','Opolo Road','Biogbolo Road','Amassoma Road','Ekeki Road','Tombia Road','Igbogene Road'],
    districts:['Azikoro','Opolo','Akenfa','Biogbolo','Amassoma','Tombia','Ekeki','Igbogene','Yenagoa Central']},
  jigawa:{name:'Jigawa',tag:'Capital: Dutse',lon:9.34,lat:11.76,seed:367,sky:0xF0D4A6,ground:'#3B3428',slab:'#D4BD96',
    paint:['#E5CDA2','#D2B486','#EBD9B2','#BF9A69','#DCC08C','#B4A07A'],market:3,palm:.3,tree:.6,leaf:'#6f8e3c',dirt:'#c79a66',
    fleet:[['police',.5],['keke',5],['okada',3],['sedan',2],['truck',2],['danfo',1]],styles:[['banco',.45],['flat',.3],['zinc',.25]],lm:[['mosque',-35,35],['mosque',35,105]],
    shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',1],['vulc',1]],oka:4,pud:0,
    more:[['DUTSE GRAIN HOUSE','#E4572E','#ffffff'],['JIGAWA TEXTILES','#7a3b8f','#ffffff'],['KAZAURE TEA','#7a4a2e','#ffffff'],['JIGAWA POS','#0B7A43','#ffffff']],
    barks:['Sannu!','Ina kwana?','Boss, come!','Customer!'],barksEn:['Hello!','How are you?','Boss, come!','Customer!'],hawk:['Ruwa! Ruwa sanyi!','Kunu!','Groundnuts!'],conductor:['Dutse! Hawa!','Kasuwa! Hawa!'],
    nsRoads:['Kano Road','Hadejia Road','Gumel Road','Dutse Road','Ringim Road','Airport Road','Birnin Kudu Road'],ewRoads:['Kofar Arewa Road','Sabon Gari Road','Ahmadu Bello Road','Kazaure Road','Kafin Hausa Road','Kiyawa Road','Ringim Lane'],
    districts:['Kofar Arewa','Sabon Gari','Kazaure','Kafin Hausa','Kiyawa','Gumel','Hadejia','Ringim','Dutse Central']},
  kebbi:{name:'Kebbi',tag:'Capital: Birnin Kebbi',lon:4.2,lat:12.45,seed:373,sky:0xF2D1A0,ground:'#3A3228',slab:'#D0B992',
    paint:['#E6CCA0','#CFB185','#EDD9B2','#BE9868','#D9BE8C','#AFA27A'],market:3,palm:.3,tree:.6,leaf:'#66883a',dirt:'#c2935e',
    fleet:[['police',.5],['keke',5],['okada',3],['sedan',2],['truck',2],['danfo',1]],styles:[['banco',.45],['flat',.3],['zinc',.25]],lm:[['mosque',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',1],['vulc',1]],oka:4,pud:0,
    more:[['BIRNIN KEBBI RICE','#E4572E','#ffffff'],['ZURU TEXTILES','#7a3b8f','#ffffff'],['KEBBI PHARMACY','#0B7A43','#ffffff'],['KEBBI POS','#F6B21A','#1B1C20']],
    barks:['Sannu!','Ina kwana?','Boss, come!','Customer!'],barksEn:['Hello!','How are you?','Boss, come!','Customer!'],hawk:['Ruwa! Ruwa sanyi!','Rice cakes!','Suya, suya!'],conductor:['Birnin Kebbi! Hawa!','Zuru! Hawa!'],
    nsRoads:['Kamba Road','Argungu Road','Zuru Road','Airport Road','Sokoto Road','Yauri Road','Jega Road'],ewRoads:['Kanya Road','Maiyama Road','Gwadangaji Road','Dakingari Road','Kalgo Road','Bagudo Road','Shanga Road'],
    districts:['Kanya','Maiyama','Gwadangaji','Dakingari','Kalgo','Bagudo','Shanga','Jega Road','Birnin Central']},
  kogi:{name:'Kogi',tag:'Capital: Lokoja',lon:6.74,lat:7.8,seed:383,sky:0xC8D2C0,ground:'#2F3029',slab:'#B8BAA5',
    paint:['#C9C4A0','#B5B98E','#D8D0AB','#A5AFA0','#C8AE86','#B3C1A1'],market:4,palm:.6,tree:.8,leaf:'#2f7a3c',dirt:'#8c5e3c',bridges:[[0,-52]],
    fleet:[['police',.4],['keke',3],['sedan',3],['danfo',2],['okada',3],['truck',3]],styles:[['flat',.4],['zinc',.3],['admin',.2],['banco',.1]],lm:[['church',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['container',2],['buka',2],['vulc',2]],oka:4,pud:10,
    more:[['CONFLUENCE STORES','#2D6FB3','#ffffff'],['LOKOJA RIVERSIDE HOTEL','#0B7A43','#ffffff'],['KOGI TEXTILES','#C7457E','#ffffff'],['LOKOJA POS','#F6B21A','#1B1C20']],
    barks:['Kedu?','Boss, come!','How far?','Customer!'],barksEn:['How are you?','Boss, come!','How far?','Customer!'],hawk:['Pure water!','Fresh fish!','Akara!'],conductor:['Lokoja! Hawa!','Confluence! Enter!'],
    nsRoads:['Lokoja-Abuja Road','Ganaja Road','Confluence Road','Okene Road','Airport Road','Felele Road','Adankolo Road'],ewRoads:['Felele Road','Ganaja Road','Adankolo Road','Lokongoma Road','Ahmadu Bello Road','Ajaokuta Road','Kabawa Road'],
    districts:['Felele','Adankolo','Lokongoma','Ganaja','Confluence','Okene Road','Ajaokuta','Kabawa','Lokoja Central']},
  nasarawa:{name:'Nasarawa',tag:'Capital: Lafia',lon:8.52,lat:8.49,seed:389,sky:0xD8CCAC,ground:'#33312B',slab:'#C6BC9F',
    paint:['#D9C7A0','#C6B085','#E4D5B0','#B39A6E','#CDB990','#AFBC9B'],market:3,palm:.4,tree:.8,leaf:'#4b8032',dirt:'#9a6c42',
    fleet:[['police',.4],['keke',4],['okada',3],['sedan',3],['danfo',2],['truck',2]],styles:[['flat',.35],['zinc',.3],['banco',.2],['admin',.15]],lm:[['church',-35,35],['mosque',35,105]],
    shopKinds:[['shop',3],['kiosk',2],['buka',3],['container',1],['vulc',1]],oka:3,pud:6,
    more:[['LAFIA DAM STORES','#2D6FB3','#ffffff'],['NASARAWA FABRICS','#C7457E','#ffffff'],['KARU BUKA','#E4572E','#ffffff'],['LAFIA POS','#0B7A43','#ffffff']],
    barks:['Good day!','How far?','Boss, come!','Customer!'],barksEn:['Good day!','How far?','Boss, come!','Customer!'],hawk:['Pure water!','Fresh tomatoes!','Suya!'],conductor:['Lafia! Hawa!','Akwanga Road! Enter!'],
    nsRoads:['Makurdi Road','Akwanga Road','Keffi Road','Jos Road','Obi Road','Airport Road','Doma Road'],ewRoads:['Bukan Sidi Road','Ahmadu Bello Road','Shabu Road','Keffi Road East','Kofar Road','Mararaba Road','Jigawa Road'],
    districts:['Bukan Sidi','Shabu','Keffi Road','Mararaba','Kofar','Jigawa','Obi','Doma','Lafia Central']},
  osun:{name:'Osun',tag:'Capital: Osogbo',lon:4.56,lat:7.77,seed:397,sky:0xE7CBA0,ground:'#35302B',slab:'#CDB99C',
    paint:['#D7BD97','#C2A37A','#E5D0AC','#B39169','#D1B287','#A9B39A'],market:4,palm:.5,tree:.8,leaf:'#3a7d3a',dirt:'#9a6a40',
    fleet:[['police',.4],['keke',4],['okada',3],['sedan',3],['danfo',2],['truck',1]],styles:[['flat',.4],['zinc',.3],['admin',.15],['banco',.15]],lm:[['church',-35,35],['mosque',35,105]],
    shopKinds:[['shop',3],['kiosk',3],['buka',2],['container',2],['vulc',1]],oka:4,pud:6,
    more:[['OSOGBO SHRINE CRAFTS','#7a3b8f','#ffffff'],['OLAIYA STORES','#E4572E','#ffffff'],['OSUN FABRICS','#F6B21A','#1B1C20'],['OSOGBO POS','#0B7A43','#ffffff']],
    barks:['E kaaro!','Bawo ni?','Boss, come!','Customer!'],barksEn:['Good morning!','How are you?','Boss, come!','Customer!'],hawk:['Pure water!','Oranges!','Akara!'],conductor:['Osogbo! Hawa!','Oke Fia! Enter!'],
    nsRoads:['Ibadan Road','Ede Road','Ilesa Road','Iwo Road','Oke-Fia Road','Gbongan Road','Airport Road'],ewRoads:['Olaiya Road','Ogbona Road','Ataoja Road','Oke Baale Road','Gbongan Road East','Ilesha Road Lane','Oke Fia Lane'],
    districts:['Olaiya','Ataoja','Oke-Fia','Ogbona','Oke Baale','Gbongan','Iwo Road','Ede Road','Osogbo Central']},
  taraba:{name:'Taraba',tag:'Capital: Jalingo',lon:11.36,lat:8.9,seed:401,sky:0xDAD3A8,ground:'#2E3228',slab:'#BDBE9E',
    paint:['#C7C69C','#B0B88A','#D8D4AE','#A1AE8E','#C0AA84','#B1BD9C'],market:3,palm:.4,tree:.9,leaf:'#3a7c36',dirt:'#8c6442',
    fleet:[['police',.4],['keke',4],['okada',3],['sedan',2],['truck',2],['danfo',2]],styles:[['flat',.35],['zinc',.3],['banco',.25],['admin',.1]],lm:[['church',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',1],['vulc',1]],oka:3,pud:8,
    more:[['JALINGO COCOA STORES','#7a4a2e','#ffffff'],['MAMBILLA TEA','#0B7A43','#ffffff'],['TARABA CRAFTS','#E4572E','#ffffff'],['JALINGO POS','#F6B21A','#1B1C20']],
    barks:['Good day!','How far?','Boss, come!','Customer!'],barksEn:['Good day!','How far?','Boss, come!','Customer!'],hawk:['Pure water!','Cocoa drink!','Roasted corn!'],conductor:['Jalingo! Hawa!','Lamido Road! Enter!'],
    nsRoads:['Hospital Road','Ibi Road','Gassol Road','Wukari Road','Mayo Ranewo Road','Lamido Road','Airport Road'],ewRoads:['Mutai Road','Jalingo Ring Road','Barade Road','Kona Road','Mararaba Road','Gaidam Road','Yola Road'],
    districts:['Mutai','Barade','Kona','Gassol','Wukari Road','Lamido','Ibi','Mayo Ranewo','Jalingo Central']},
  yobe:{name:'Yobe',tag:'Capital: Damaturu',lon:11.96,lat:11.75,seed:409,sky:0xF3CF9C,ground:'#3C352C',slab:'#D3BA90',
    paint:['#E4C799','#CDAE7F','#EBD6AE','#BB9866','#D9BD8A','#B09874'],market:3,palm:.25,tree:.5,leaf:'#6f8d3d',dirt:'#c9a070',
    fleet:[['police',.5],['keke',5],['okada',3],['sedan',2],['truck',2],['danfo',1]],styles:[['banco',.45],['flat',.3],['zinc',.25]],lm:[['mosque',-35,35]],
    shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',1],['vulc',1]],oka:4,pud:0,
    more:[['DAMATURU SOLAR HOUSE','#E4572E','#ffffff'],['YOBE DATES','#7a4a2e','#ffffff'],['DAMATURU TEXTILES','#7a3b8f','#ffffff'],['DAMATURU POS','#0B7A43','#ffffff']],
    barks:['Sannu!','Ina kwana?','Boss, come!','Customer!'],barksEn:['Hello!','How are you?','Boss, come!','Customer!'],hawk:['Ruwa! Ruwa sanyi!','Dates! Sweet dates!','Kunu!'],conductor:['Damaturu! Hawa!','Maiduguri Road! Hawa!'],
    nsRoads:['Maiduguri Road','Potiskum Road','Gujba Road','Airport Road','Gashua Road','Buni Yadi Road','Damaturu Ring Road'],ewRoads:['Kofar Kwaya Road','Sabon Gari Road','Gwange Road','Pompomari Road','Kasuwan Lane','Jigawa Road','Tudun Wada Road'],
    districts:['Kofar Kwaya','Sabon Gari','Gwange','Pompomari','Kasuwan','Tudun Wada','Gujba','Potiskum Road','Damaturu Central']},
  zamfara:{name:'Zamfara',tag:'Capital: Gusau',lon:6.66,lat:12.17,seed:419,sky:0xEFD0A2,ground:'#3A3328',slab:'#D0B88E',
    paint:['#E3C69A','#CDAE7E','#EAD4AA','#BA9566','#D9BB88','#AEA076'],market:3,palm:.25,tree:.6,leaf:'#66893a',dirt:'#c2905c',
    fleet:[['police',.5],['keke',4],['okada',3],['sedan',2],['truck',3],['danfo',1]],styles:[['banco',.4],['flat',.35],['zinc',.25]],lm:[['mosque',-35,35],['church',35,105]],
    shopKinds:[['shop',3],['kiosk',2],['buka',2],['container',2],['vulc',1]],oka:4,pud:0,
    more:[['GUSAU LIVESTOCK','#E4572E','#ffffff'],['MAIGORO FABRICS','#7a3b8f','#ffffff'],['ZAMFARA PHARMACY','#0B7A43','#ffffff'],['GUSAU POS','#F6B21A','#1B1C20']],
    barks:['Sannu!','Ina kwana?','Boss, come!','Customer!'],barksEn:['Hello!','How are you?','Boss, come!','Customer!'],hawk:['Ruwa! Ruwa sanyi!','Suya, suya!','Kunu!'],conductor:['Gusau! Hawa!','Kasuwa! Hawa!'],
    nsRoads:['Sokoto Road','Kaura Namoda Road','Talata Mafara Road','Airport Road','Maru Road','Tsafe Road','Bakura Road'],ewRoads:['Kofar Kaura Road','Sabon Gari Road','Gusau Ring Road','Mada Road','Dan Yaro Road','Kasuwan Shanu Road','Tudun Wada Road'],
    districts:['Kofar Kaura','Sabon Gari','Mada','Dan Yaro','Kasuwan Shanu','Tudun Wada','Maru','Tsafe','Gusau Central']}
};
Object.keys(NEWC).forEach(k=>{
  const o=NEWC[k],base={h:[10,30],fog:[95,250],bridges:[],bump:10,pud:8,oka:5,pal:{danfo:['#F6B21A','#1B1C20'],keke:['#F6B21A','#1B1C20'],sedan:['#E9E4DA','#2b2b30','#8a8d93','#C8402A','#2D6FB3'],stripe:null}};
  const c=Object.assign({},base,o); c.signs=CITIES.lagos.signs.slice(0,9).concat(o.more||[]); CITIES[k]=c;
});
/* ===================== KitCity LOOK: real-city grading, skies, weathering ===================== */
var GR=null,LKT={},LKC={roof:'#9a958a'},LKS={sx:-40,sy:60,sz:30,col:0xFFD59A,dir:[-.5,.7,.4]},ATMO=null,SKY=null,LS=1;
const LOOK_BASE={h:'#E3C9A0',z:'#6F94B5',sun:'#FFD9A0',sI:.95,hS:'#F4E4C8',hG:'#5A4636',hI:.6,off:[-45,55,32],exp:1.05,sat:1.0,con:1.08,fade:.02,lift:[0,.01,.025],gain:[1.04,1,.94],vig:.3,grain:.03,bloom:.4,veil:['#E8C896',.1],cl:.4,cc:'#F6EBDD',fog:[55,210],dust:.1,mil:.3,rust:.3,lat:.2,dash:'#D9A62A',fx:null,roof:'#9a958a',zinc:['#8a4a2c','#7c4b34','#6b4630','#9a5a38','#7d7266','#5e5b55'],ground:'#2A2A2C',slab:'#A39C8E',dirt:'#8E5638',leaf:'#35603a'};
const LOOK={
 lagos:{paint:['#CDBE9E','#D6D0BF','#B9A57E','#C58F6E','#8FA597','#A3B0B5','#A87B5C','#C9B25A'],mil:.6,rust:.5},
 abuja:{h:'#CFE0EE',z:'#4F86C0',sun:'#FFF1DA',sI:1.05,hS:'#E6F0FA',hI:.7,off:[-35,70,25],exp:1.08,sat:1.06,con:1.14,lift:[0,.01,.04],gain:[1,1,1.02],vig:.24,bloom:.3,veil:['#D5E4F2',.08],cl:.7,fog:[75,260],dust:.03,mil:.05,rust:.05,lat:0,dash:'#F2F2F2',roof:'#b4b6b4',ground:'#303236',slab:'#C4C6C0',dirt:'#8a6a4a',leaf:'#3f8a45',paint:['#E4E2DA','#CFD3D0','#BFC9CE','#D9D0BC','#EDEBE4','#A8B7C2'],zinc:['#8c9296','#7e8488','#6d7378','#9aa0a4','#5e6469','#a3a9ad']},
 kano:{h:'#E2C6A0',z:'#B9A58C',sun:'#FFDDAA',sI:.9,hS:'#EAD6B6',hI:.68,off:[-30,66,20],exp:1.06,sat:.88,con:.96,fade:.07,lift:[.01,.012,.01],gain:[1.08,1.02,.88],vig:.38,grain:.04,bloom:.55,veil:['#E4C99C',.32],cl:.15,cc:'#E8D2AE',fog:[40,170],dust:.45,mil:0,rust:.2,lat:.3,fx:'dust',dash:'#CDBE9A',ground:'#4A4036',slab:'#BFA77F',dirt:'#B58C5C',leaf:'#667a3a',paint:['#C9A06E','#B98A58','#D5B88A','#A9784A','#C4A47C','#DCC6A0']},
 ph:{h:'#A9B6B0',z:'#6E7F86',sun:'#E8E0C8',sI:.62,hS:'#C8D2CC',hG:'#3E4A42',hI:.78,off:[-30,64,26],exp:1.0,sat:1.0,con:1.12,fade:.04,lift:[-.01,.015,.015],gain:[.96,1.02,.98],vig:.4,grain:.045,bloom:.45,veil:['#9FB0A8',.2],cl:.9,cc:'#B8C2C0',fog:[40,165],dust:0,mil:.9,rust:.55,lat:.1,fx:'rain',dash:'#C8B260',ground:'#1E2224',slab:'#8E938C',dirt:'#4E4034',leaf:'#1f6b3a',paint:['#8E9B8C','#7B8E86','#9A9A8C','#8696A3','#A89E86','#6E8478']},
 ibadan:{paint:['#C9A88A','#B77D58','#D1BC9A','#A8967F','#8E9F8B','#C9B060'],rust:.8,mil:.5,lat:.4,zinc:['#8a4a2c','#7c3f26','#6b3a22','#9a5a38','#7a4a34','#5e3a2a'],dirt:'#9a5a38',h:'#E0C095',off:[-52,44,30]},
 kaduna:{paint:['#DCCFB0','#CDB88E','#C2A57C','#E2D6BA','#AEB8A2','#CDA880'],dust:.3,fx:'dust',h:'#E6CFA6',veil:['#E6CFA6',.2],fog:[48,190],sat:.95,dirt:'#B88A5A',leaf:'#6b8a3e'},
 enugu:{paint:['#9FB8A4','#BCCDAE','#D3BC95','#8DA4B4','#CFC08A','#B8AD96'],h:'#C6D6C6',z:'#5E8DB0',sat:1.06,lat:.35,mil:.4,cl:.7,leaf:'#2f7a45',fog:[55,220],veil:['#C6D6C6',.13]},
 benin:{paint:['#B9714E','#A55E40','#CF9A74','#8F5239','#D9BC95','#7E9A86'],lat:.6,dirt:'#a0502e',h:'#DDB98D',sat:1.05,gain:[1.08,1,.9],rust:.5},
 calabar:{paint:['#DDB09A','#9CC4B4','#E3C77F','#B9A8D0','#8CB0CF','#DE9F9F'],mil:.5,h:'#BCD2CC',z:'#5E92AE',sat:1.08,cl:.75,sI:.8,leaf:'#1f7a3f',veil:['#BCD2CC',.14],fog:[50,190]},
 jos:{paint:['#D3CCBC','#B3BFB0','#BCA98C','#9FAFBA','#D6BF9A','#8FA38F'],h:'#D5E3EC',z:'#4A82BA',sun:'#FFF3DE',con:1.14,sat:1.04,cl:.8,gain:[1,1,1.02],lift:[0,.01,.04],dust:.05,veil:['#D5E3EC',.07],fog:[75,260],leaf:'#3f7a45'},
 maiduguri:{paint:['#D7BE92','#C7A171','#E2CFA6','#B88F5E','#D0B084','#A98254'],dust:.5,fx:'dust',h:'#EBD3A6',z:'#C4B08E',sI:1.0,exp:1.12,sat:.85,con:1.0,fade:.08,gain:[1.08,1.02,.86],vig:.4,veil:['#EBD3A6',.34],fog:[38,165],cl:.1,dirt:'#C9A06E',slab:'#C3AC82',leaf:'#6f8f3e'}
};
/* KitCity is the final Web3 destination, distinct from the regional street-grid cities. */
CITIES.kitcity={
 name:'KitCity',tag:'The Web3 World',lon:14.15,lat:13.05,seed:811,
 sky:0x07182D,fog:[180,520],ground:'#07121F',slab:'#172B3D',dirt:'#07121F',
 leaf:'#10C8DC',paint:['#10263A','#17384B','#203D54','#0D2A3B'],h:[24,88],market:1,palm:0,tree:0,
 fleet:[],pal:{},localLanguage:'web3',
 barks:['Welcome to KitCity.','Build something that lasts.','Your next chapter starts here.'],
 barksEn:['Welcome to KitCity.','Build something that lasts.','Your next chapter starts here.'],
 hawk:['Learn it. Verify it. Build it.'],conductor:['KitCity Core ahead.'],
 nsRoads:['Genesis Boulevard','Validator Avenue','Builder Parkway','Open Protocol Road','Open Web Road','Creator Avenue','Consensus Drive'],
 ewRoads:['Wallet Way','Onchain Boulevard','DAO Crescent','Smart Contract Street','Learning Loop','Public Goods Road','Mainnet Avenue'],
 districts:['Genesis Quarter','Builder District','Protocol Row','Creator Campus','DAO Commons','Learning Quarter','Validator Park','Open Finance District','KitCity Core']
};
Object.assign(LOOK,{
 kitcity:{h:'#07182D',z:'#123B63',sun:'#7CEBFF',sI:1.35,hS:'#C5E8F8',hG:'#07121F',hI:.9,off:[-42,74,36],exp:1.12,sat:1.16,con:1.12,fade:0,lift:[0,.01,.025],gain:[.94,1.04,1.12],vig:.16,grain:.012,bloom:.72,veil:['#0A2340',.025],cl:.22,cc:'#8CEBFF',fog:[150,500],dust:0,mil:0,rust:0,lat:0,dash:'#36E5F5',roof:'#17384B',ground:'#07121F',slab:'#172B3D',dirt:'#07121F',leaf:'#10C8DC',paint:['#10263A','#17384B','#203D54','#0D2A3B'],zinc:['#123047','#17384B','#0C2337']}
});
/* ===================== state-specific Nigerian visual identities ===================== */
/* Keep each capital recognisable: regional architecture, terrain, materials and sky
   should not be flattened into one generic grey city. Profiles are intentionally
   city-specific; landmarks below add readable silhouettes to the street grid. */
const CITY_VISUAL_PROFILES={
 lagos:{paint:['#D8C3A0','#B9C9C1','#E4A58C','#C9B7D4','#8FAFBE','#F2C84B'],ground:'#34383B',slab:'#AEB7B8',dirt:'#8C654B',leaf:'#2F7846',sky:{h:'#B8DDE6',z:'#508FA9',sun:'#FFF1D9'},styles:[['flat',.46],['zinc',.24],['glass',.18],['admin',.12]]},
 abuja:{paint:['#E7E5DD','#D3DEE5','#BBCBD7','#F2E7D1','#C4D1C9','#9FB6C8'],ground:'#3C4249',slab:'#CDD2D0',dirt:'#9C9D91',leaf:'#45834D',sky:{h:'#C8DFF0',z:'#5388BD',sun:'#FFF4E4'},styles:[['glass',.42],['admin',.32],['flat',.26]]},
 kano:{paint:['#D8B98C','#C79B68','#E5CDA7','#B7824E','#D3AE7D','#EEDDB9'],ground:'#55473A',slab:'#C4AC8A',dirt:'#B68B5A',leaf:'#788B43',sky:{h:'#E4C49A',z:'#B79C7D',sun:'#FFDEA7'},styles:[['banco',.62],['flat',.28],['zinc',.1]]},
 'port-harcourt':{paint:['#93A89A','#7C9C90','#C3B9A2','#8396A6','#D0C4AA','#6D887F'],ground:'#26352F',slab:'#9DAAA3',dirt:'#5B4939',leaf:'#237347',sky:{h:'#AFC8C6',z:'#648F9D',sun:'#EDE4D0'},styles:[['flat',.42],['zinc',.34],['glass',.12],['admin',.12]]},
 ibadan:{paint:['#B87550','#C78C65','#D8BA91','#9C6849','#D1C09F','#8F9D82'],ground:'#494039',slab:'#B9A58E',dirt:'#9C6540',leaf:'#4C7940',sky:{h:'#E3C49D',z:'#8B9FA7',sun:'#FFE0AC'},styles:[['flat',.42],['zinc',.27],['admin',.18],['banco',.13]]},
 enugu:{paint:['#6F8D79','#8BAA8C','#C6B999','#9DAFBC','#D6C9A7','#66806D'],ground:'#34423B',slab:'#B0B7A9',dirt:'#74634C',leaf:'#2E7847',sky:{h:'#C7D8CF',z:'#608BA7',sun:'#FFF0D6'},styles:[['flat',.38],['admin',.22],['zinc',.2],['banco',.2]]},
 benin:{paint:['#A65337','#C17A53','#D6A17A','#8E4A36','#D4BD99','#76957A'],ground:'#45352E',slab:'#B8A18B',dirt:'#945536',leaf:'#397543',sky:{h:'#DDBD94',z:'#7399A3',sun:'#FFE1B4'},styles:[['flat',.38],['banco',.24],['zinc',.2],['admin',.18]]},
 calabar:{paint:['#D8B09B','#93C4B5','#E7CF8C','#B6A2C9','#85B1C8','#D99D91'],ground:'#34443F',slab:'#B9C4B8',dirt:'#80634D',leaf:'#237744',sky:{h:'#BDD5D1',z:'#568EAA',sun:'#FFF0D8'},styles:[['flat',.4],['admin',.2],['zinc',.2],['glass',.2]]},
 jos:{paint:['#B7C7BD','#D6D0C0','#A6B7C8','#C2AD8A','#8CA39A','#E1D7C3'],ground:'#4B514F',slab:'#C2C9C5',dirt:'#8D8B7A',leaf:'#4B7E4C',sky:{h:'#D4E5EE',z:'#4F84B6',sun:'#FFF5E2'},styles:[['flat',.38],['admin',.2],['banco',.18],['zinc',.24]]},
 lokoja:{paint:['#C9B17C','#A8B49A','#D7C8A0','#9BAEAF','#B98E6A','#D6D5C3'],ground:'#3C4038',slab:'#B9BBA8',dirt:'#9A754A',leaf:'#547D42',sky:{h:'#CBD8C9',z:'#6E98B4',sun:'#FFE2AF'},styles:[['flat',.4],['zinc',.24],['admin',.18],['banco',.18]]},
 osogbo:{paint:['#B7C9A7','#D6C09A','#9AB9A5','#D2A17B','#8BA5B7','#E0D8B9'],ground:'#353D35',slab:'#B9B8A5',dirt:'#96734C',leaf:'#347A3F',sky:{h:'#D8D9B7',z:'#6B98AA',sun:'#FFE3B0'},styles:[['flat',.38],['banco',.22],['zinc',.22],['admin',.18]]},
 abeokuta:{paint:['#C8B49A','#D9C6A7','#AAB5A0','#B7C6CB','#B98161','#D7D6C6'],ground:'#4A443D',slab:'#C1B6A6',dirt:'#A17A53',leaf:'#507B43',sky:{h:'#D9C9AC',z:'#7698B4',sun:'#FFE4B5'},styles:[['flat',.4],['banco',.24],['zinc',.2],['admin',.16]]},
 maiduguri:{paint:['#D5B37D','#C89A61','#E7D0A0','#B47D4A','#D9C19A','#A78A61'],ground:'#544637',slab:'#C8B18B',dirt:'#C29A65',leaf:'#7A8B43',sky:{h:'#E8CDA1',z:'#C4AD88',sun:'#FFE2B0'},styles:[['banco',.44],['flat',.36],['zinc',.2]]},
 kaduna:{paint:['#D8C8A5','#C9B68C','#AEB9A4','#E1D8C2','#B9A27E','#9DAEBA'],ground:'#49433A',slab:'#C6B89D',dirt:'#B08A5A',leaf:'#668644',sky:{h:'#E0D0AC',z:'#829FB8',sun:'#FFE6B7'},styles:[['flat',.38],['banco',.28],['admin',.18],['zinc',.16]]},
 sokoto:{paint:['#E4C79A','#D3B17D','#EAD9B7','#BD925D','#D8C39D','#B2A080'],ground:'#5A4A37',slab:'#CFB995',dirt:'#C49A66',leaf:'#829044',sky:{h:'#E9CFA5',z:'#C3AD8E',sun:'#FFE3B0'},styles:[['banco',.55],['flat',.32],['zinc',.13]]},
 katsina:{paint:['#DCC197','#C9A777','#E9D8B6','#B98D5A','#D7C29A','#AFA080'],ground:'#554738',slab:'#CBB692',dirt:'#BE945F',leaf:'#788A43',sky:{h:'#E6CCA1',z:'#B9A183',sun:'#FFE4B3'},styles:[['banco',.52],['flat',.34],['zinc',.14]]},
 'birnin-kebbi':{paint:['#D7C39A','#C5A978','#E4D5B2','#B78C5A','#D0BE9B','#A7A584'],ground:'#4E4739',slab:'#C5B89C',dirt:'#B88D5B',leaf:'#738744',sky:{h:'#E0D0A8',z:'#A8A98F',sun:'#FFE2B0'},styles:[['banco',.42],['flat',.38],['zinc',.2]]},
 minna:{paint:['#CBB58B','#B7BE9E','#D9C9A1','#A9B6B5','#C18C69','#9BAA89'],ground:'#41443B',slab:'#BEBBA8',dirt:'#A78155',leaf:'#5C8144',sky:{h:'#D6D5B4',z:'#7D9EAC',sun:'#FFE4B2'},styles:[['flat',.38],['banco',.24],['zinc',.2],['admin',.18]]},
 bauchi:{paint:['#D9C49B','#C6AC80','#E5D8B8','#B89A6B','#D2C19E','#A7AF92'],ground:'#4B4539',slab:'#C7B99C',dirt:'#B18D5D',leaf:'#7B8D45',sky:{h:'#DFD2AF',z:'#9AABB2',sun:'#FFE5B7'},styles:[['flat',.38],['banco',.32],['admin',.16],['zinc',.14]]},
 gombe:{paint:['#D5BE91','#C4A879','#E4D2A8','#B68D5C','#D2BE97','#A6AD8E'],ground:'#4A4439',slab:'#C4B69A',dirt:'#AF895A',leaf:'#788B43',sky:{h:'#E1D0A8',z:'#9BAAAB',sun:'#FFE4B5'},styles:[['flat',.38],['banco',.3],['zinc',.18],['admin',.14]]},
 damaturu:{paint:['#DCC397','#C8A777','#E8D5AF','#B88C59','#D5C19A','#B3A27D'],ground:'#514639',slab:'#C9B695',dirt:'#C19A66',leaf:'#788A43',sky:{h:'#E8D0A7',z:'#C2AB88',sun:'#FFE3B1'},styles:[['banco',.48],['flat',.36],['zinc',.16]]},
 gusau:{paint:['#D8C097','#C8A574','#E7D3AA','#B78B59','#D4C099','#A8A17D'],ground:'#514539',slab:'#C8B494',dirt:'#BD925F',leaf:'#7A8B43',sky:{h:'#E4CCA2',z:'#B8A084',sun:'#FFE2AF'},styles:[['banco',.44],['flat',.38],['zinc',.18]]}
};
const CITY_PALETTE_FAMILIES={
 coastal:['#D5C9B3','#8FB7B0','#C7A18B','#A7BAC7','#D5D5C7','#8BAA91'],
 southwest:['#C9B49A','#D6C4A8','#AAB9A2','#B5C6CC','#B9805F','#D6D2BD'],
 southeast:['#B6C8B8','#D2C1A1','#9DB6C0','#C98E70','#D6D6C8','#8AA68B'],
 north:['#D8C197','#C7A675','#E7D5B0','#B88C5B','#D4C09A','#A9A282'],
 highland:['#B7C8BF','#D2CDBD','#9EB4C8','#C3AF8E','#8DA79A','#DDD5C2']
};
const CITY_REGION={
 'port-harcourt':'coastal',ph:'coastal',calabar:'coastal',uyo:'coastal','ikot-ekpene':'coastal',yenagoa:'coastal',warri:'coastal',asaba:'coastal',lagos:'coastal',
 ibadan:'southwest',osogbo:'southwest','ado-ekiti':'southwest',akure:'southwest',abeokuta:'southwest',ilorin:'southwest',
 owerri:'southeast',aba:'southeast',umuahia:'southeast',awka:'southeast',onitsha:'southeast',abakaliki:'southeast',enugu:'southeast',benin:'southeast',
 jos:'highland',kafanchan:'highland',makurdi:'highland',lokoja:'highland',minna:'highland',
 kano:'north',kaduna:'north',maiduguri:'north',sokoto:'north',katsina:'north','birnin-kebbi':'north',dutse:'north',gusau:'north',damaturu:'north',bauchi:'north',gombe:'north',lafia:'north',jalingo:'north',yola:'north'
};
(function applyCityVisualProfiles(){
 const keys=Object.keys(CITIES);
 keys.forEach((key,index)=>{
   if(key==='kitcity')return;
   const C=CITIES[key],profile=CITY_VISUAL_PROFILES[key];
   const family=CITY_REGION[key]||'southwest';
   const base=CITY_PALETTE_FAMILIES[family];
   if(profile){
     C.paint=profile.paint.slice(); C.ground=profile.ground; C.slab=profile.slab; C.dirt=profile.dirt; C.leaf=profile.leaf;
     if(profile.styles)C.styles=profile.styles.map(x=>x.slice());
   }else{
     // Give every remaining state capital its own stable palette rotation instead
     // of assigning all towns the same four regional greys.
     const shift=(index*2+key.length)%base.length;
     C.paint=Array.from({length:base.length},(_,i)=>base[(i+shift)%base.length]);
     const northern=family==='north';
     C.ground=northern?'#4A4338':family==='coastal'?'#303C39':family==='highland'?'#414741':'#3D403B';
     C.slab=northern?'#C5B18F':family==='coastal'?'#B7C4BA':family==='highland'?'#C1C6BB':'#BDB7A5';
     C.dirt=northern?'#B78D5A':family==='coastal'?'#81664B':family==='highland'?'#93866A':'#98734E';
     C.leaf=northern?'#788944':family==='coastal'?'#267545':family==='highland'?'#4B7C4B':'#477A42';
   }
   const old=LOOK[key]||{};
   const sky=profile&&profile.sky?profile.sky:(family==='north'?{h:'#E0CBA4',z:'#B6A184',sun:'#FFE3B2'}:family==='coastal'?{h:'#BDD8D9',z:'#5F91A3',sun:'#FFF0D9'}:family==='highland'?{h:'#D1E0E4',z:'#5D8BB2',sun:'#FFF4E1'}:family==='southeast'?{h:'#C8DCD3',z:'#6595A7',sun:'#FFF1DA'}:{h:'#D7C9B0',z:'#7598B0',sun:'#FFE3B3'});
   LOOK[key]=Object.assign({},old,sky,{paint:C.paint,ground:C.ground,slab:C.slab,dirt:C.dirt,leaf:C.leaf,roof:family==='north'?'#9D7953':family==='coastal'?'#687F7C':family==='highland'?'#818D83':'#8C8171',zinc:family==='north'?['#A18A6A','#8E7659','#B49B75','#7F6B54']:family==='coastal'?['#7D9690','#617B77','#A0B1A7','#6C8582']:['#A39B8C','#8C8477','#B5AA97','#7C817C'],rust:family==='north'?.12:.04,dust:family==='north'?.18:.02,lat:family==='coastal'?.18:0,fx:family==='coastal'&&['port-harcourt','ph','yenagoa','warri'].includes(key)?'rain':null,fade:0,grain:.02,bloom:.24,sat:family==='north'?.96:1.07,con:1.07,exp:1.04,veil:[sky.h,.035],lift:[0,.006,.012],gain:[1.01,1.01,1.02],vig:.2,dash:family==='north'?'#D0B785':'#D6BC6A'});
 });
})();
const lkc=h=>new THREE.Color(h);
function lkWeather(c,L){
  const g=c.getContext('2d'),S=c.width,R=mulberry(S*7+Math.floor(L.dust*100)+Math.floor(L.mil*100)+Math.floor(L.lat*100)),r=(a,b)=>a+R()*(b-a);
  const gr=g.createLinearGradient(0,S*.6,0,S); gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(1,L.lat>.25?'rgba(125,66,36,'+(.2+L.lat*.4)+')':'rgba(62,50,40,.3)'); g.fillStyle=gr; g.fillRect(0,S*.6,S,S*.4);
  for(let i=0;i<34;i++){ const x=r(0,S),y=r(0,S*.7),len=r(30,110),lg=g.createLinearGradient(0,y,0,y+len); lg.addColorStop(0,'rgba(40,30,22,'+r(.08,.2)+')'); lg.addColorStop(1,'rgba(40,30,22,0)'); g.fillStyle=lg; g.fillRect(x,y,r(1.5,4),len); }
  for(let i=0;i<L.mil*70;i++){ g.fillStyle='rgba(24,42,28,'+r(.05,.17)+')'; g.beginPath(); g.arc(r(0,S),S*(.25+.75*R()*R()),r(3,12),0,7); g.fill(); }
  for(let i=0;i<L.rust*16;i++){ const x=r(0,S),y=r(0,S*.8),len=r(20,70),lg=g.createLinearGradient(0,y,0,y+len); lg.addColorStop(0,'rgba(125,58,24,.2)'); lg.addColorStop(1,'rgba(125,58,24,0)'); g.fillStyle=lg; g.fillRect(x,y,r(2,4),len); }
  for(let i=0;i<4;i++){ g.fillStyle='rgba(118,110,96,'+r(.18,.35)+')'; g.beginPath(); g.ellipse(r(0,S),r(0,S),r(8,26),r(6,18),r(0,3),0,7); g.fill(); }
  if(L.dust>0){ g.fillStyle='rgba(222,196,152,'+(L.dust*.38)+')'; g.fillRect(0,0,S,S); }
  return c;
}
function lkRoofC(L){ const c=cv(128,128),g=c.getContext('2d'),R=mulberry(91); g.fillStyle='#f2f2f2'; g.fillRect(0,0,128,128); speckle(g,128,128,900,.35,['#9a9a9a','#ffffff','#777']);
  for(let i=0;i<6;i++){ g.fillStyle='rgba(30,30,26,'+(.12+R()*.2)+')'; g.beginPath(); g.ellipse(R()*128,R()*128,8+R()*22,6+R()*16,R()*3,0,7); g.fill(); }
  for(let i=0;i<L.mil*8;i++){ g.fillStyle='rgba(30,60,34,.14)'; g.beginPath(); g.arc(R()*128,R()*128,4+R()*9,0,7); g.fill(); }
  if(L.dust>0){ g.fillStyle='rgba(222,196,152,'+(L.dust*.5)+')'; g.fillRect(0,0,128,128); } return c; }
function lkRoofZ(L){ const c=cv(64,64),g=c.getContext('2d'),R=mulberry(57); g.fillStyle='#fff'; g.fillRect(0,0,64,64);
  for(let y=0;y<64;y+=16){ const lg=g.createLinearGradient(0,y,0,y+16); lg.addColorStop(0,'rgba(255,255,255,0)'); lg.addColorStop(.5,'rgba(0,0,0,.28)'); lg.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=lg; g.fillRect(0,y,64,16); }
  for(let i=0;i<10;i++){ g.fillStyle='rgba(110,50,20,'+(.1+R()*.2*L.rust*2)+')'; g.fillRect(R()*64,R()*64,3+R()*12,3+R()*10); }
  g.fillStyle='rgba(0,0,0,.35)'; for(let x=4;x<64;x+=10) g.fillRect(x,6,2,2);
  if(L.dust>0){ g.fillStyle='rgba(222,196,152,'+(L.dust*.45)+')'; g.fillRect(0,0,64,64); } return c; }
function lkAsph(L){ const c=cv(256,256),g=c.getContext('2d'),style=L.roadStyle||0,R=mulberry(311+style*37); g.fillStyle='#e2e2e2'; g.fillRect(0,0,256,256); speckle(g,256,256,2200,.5,['#b0b0b0','#fafafa','#8d8d8d','#d0d0d0']);
  if(style%6===0){g.strokeStyle='rgba(20,20,20,.32)';g.lineWidth=2;for(let y=12;y<256;y+=24){g.beginPath();g.moveTo(0,y);g.lineTo(256,y);g.stroke();}}
  else if(style%6===1){g.strokeStyle='rgba(30,30,30,.35)';g.lineWidth=1.4;for(let y=0;y<256;y+=18)for(let x=(y%36===0?0:9);x<256;x+=18)g.strokeRect(x,y,18,18);}
  else if(style%6===2){g.strokeStyle='rgba(35,35,35,.5)';g.lineWidth=2;for(let i=0;i<10;i++){g.beginPath();g.moveTo(R()*256,R()*256);g.lineTo(R()*256,R()*256);g.stroke();}}
  else if(style%6===3){g.fillStyle='rgba(30,30,30,.2)';for(let i=0;i<26;i++)g.fillRect(R()*256,R()*256,10+R()*24,3+R()*8);}
  else if(style%6===4){g.strokeStyle='rgba(30,30,30,.3)';g.lineWidth=1;for(let x=0;x<256;x+=32){g.beginPath();g.moveTo(x,0);g.lineTo(x,256);g.stroke();}for(let y=0;y<256;y+=32){g.beginPath();g.moveTo(0,y);g.lineTo(256,y);g.stroke();}}
  else {g.strokeStyle='rgba(30,30,30,.38)';g.lineWidth=2;for(let y=0;y<256;y+=32){g.beginPath();g.moveTo(0,y);g.lineTo(256,y+8);g.stroke();}}
  for(let i=0;i<7;i++){ g.fillStyle='rgba(50,50,50,'+(.1+R()*.14)+')'; g.fillRect(R()*200,R()*200,30+R()*60,20+R()*44); }
  g.strokeStyle='rgba(25,25,25,.5)'; for(let i=0;i<8;i++){ let x=R()*256,y=R()*256; g.beginPath(); g.moveTo(x,y); for(let k=0;k<6;k++){ x+=(R()-.5)*40; y+=(R()-.5)*40; g.lineTo(x,y); } g.stroke(); }
  for(let i=0;i<5;i++){ g.fillStyle='rgba(15,15,15,.28)'; g.beginPath(); g.ellipse(R()*256,R()*256,6+R()*10,4+R()*7,R()*3,0,7); g.fill(); }
  if(L.fx==='rain'||L.mil>.8){ g.fillStyle='rgba(20,28,34,.3)'; g.fillRect(0,0,256,256); }
  if(L.dust>0||L.lat>.3){ g.fillStyle=L.lat>.3&&L.dust<.3?'rgba(160,96,60,.22)':'rgba(214,186,140,'+(.12+L.dust*.35)+')'; g.fillRect(0,0,256,256); speckle(g,256,256,900,.4,['#d8b98a','#c49a64']); } return c; }
function lkDirt(L){ const c=cv(128,128),g=c.getContext('2d'); g.fillStyle='#f0f0f0'; g.fillRect(0,0,128,128); speckle(g,128,128,1600,.55,['#c0c0c0','#ffffff','#a0a0a0','#dedede','#b89a78']); return c; }
function lkPave(L){ const c=cv(128,128),g=c.getContext('2d'),R=mulberry(5); g.fillStyle='#ececec'; g.fillRect(0,0,128,128); g.strokeStyle='rgba(60,60,60,.4)'; g.lineWidth=2;
  for(let y=0;y<128;y+=32){ g.beginPath(); g.moveTo(0,y); g.lineTo(128,y); g.stroke(); for(let x=((y/32)%2)*16;x<128;x+=32){ g.beginPath(); g.moveTo(x,y); g.lineTo(x,y+32); g.stroke(); } }
  speckle(g,128,128,600,.4,['#a8a090','#ffffff','#8a7c68']); for(let i=0;i<L.mil*6;i++){ g.fillStyle='rgba(30,60,34,.16)'; g.beginPath(); g.arc(R()*128,R()*128,5+R()*10,0,7); g.fill(); }
  if(L.dust>0){ g.fillStyle='rgba(222,196,152,'+(L.dust*.4)+')'; g.fillRect(0,0,128,128); } return c; }
function lkEdge(){ const c=cv(8,64),g=c.getContext('2d'),lg=g.createLinearGradient(0,0,0,64); lg.addColorStop(0,'rgba(255,255,255,0)'); lg.addColorStop(1,'rgba(255,255,255,.75)'); g.fillStyle=lg; g.fillRect(0,0,8,64); return c; }
function applyLook(key,C){
  CITY_LOOKS[key]=CITY_LOOKS[key]||CITY_LOOKS.lagos;
  const ARCH=cityKit(key);
  const L=Object.assign({},LOOK_BASE,LOOK[key]||{}); L.cityKey=key; L.roadType=ARCH.road; L.roadStyle=Math.max(0,Object.keys(CITY_ARCH_ROAD).indexOf(key)); L.roadMark=ARCH.mark; L.roadKerb=ARCH.kerb; L.roadEdge=ARCH.edge; LKC=L;
  Object.assign(C,{paint:L.paint||C.paint,ground:L.ground,slab:L.slab,dirt:L.dirt,leaf:L.leaf,zinc:L.zinc,fog:L.fog});
  if(L.paint===undefined) L.paint=C.paint;
  const hc=lkc(L.h); scene.background=hc; scene.fog=new THREE.Fog(hc,L.fog[0],L.fog[1]);
  hemi.color.set(L.hS); hemi.groundColor.set(L.hG); hemi.intensity=L.hI*LS; sun.intensity=L.sI*LS; sun.color.set(L.sun); LKS.col=lkc(L.sun);
  LKS.sx=L.off[0]; LKS.sy=L.off[1]; LKS.sz=L.off[2]; { const v=new THREE.Vector3(-L.off[0],L.off[1],-L.off[2]).normalize(); LKS.dir=[v.x,v.y,v.z]; }
  if(GR){ const u=GR.comp.uniforms; u.uExp.value=L.exp; u.uSat.value=1+(L.sat-1)*1.6; u.uCon.value=1+(L.con-1)*1.3; u.uFade.value=L.fade; u.uLift.value.set(L.lift[0]*2,L.lift[1]*2,L.lift[2]*2); u.uGain.value.set(L.gain[0],L.gain[1],L.gain[2]); u.uVig.value=L.vig+.12; u.uGrain.value=L.grain; u.uVeil.value.set(L.veil[0]); u.uVeilA.value=Math.min(.5,L.veil[1]*1.5); GR.bloom=L.bloom*1.3;
    const s=SKY.material.uniforms; s.uTop.value.set(L.z); s.uHor.value.set(L.h); s.uSunCol.value.set(L.sun); s.uSunDir.value.set(LKS.dir[0],LKS.dir[1],LKS.dir[2]); s.uCl.value=L.cl; s.uCloud.value.set(L.cc); }
  ['asph','dirt','pave','roofC','zroof','edge'].forEach(k=>{ if(LKT[k]) LKT[k].dispose(); });
  LKT.asph=mkTex(lkAsph(L)); LKT.dirt=mkTex(lkDirt(L)); LKT.pave=mkTex(lkPave(L)); LKT.roofC=mkTex(lkRoofC(L)); LKT.zroof=mkTex(lkRoofZ(L)); LKT.zroof.repeat.set(1,5); LKT.edge=new THREE.Texture(lkEdge()); LKT.edge.needsUpdate=true;
  ['flat','zinc','banco','glass','admin'].forEach(st=>{ FACT[st].forEach(t=>t.dispose()); FACT[st]=[0,1,2].map(v=>{ const cn=facadeCanvas(st,v); return mkTex(st==='glass'?cn:lkWeather(cn,L)); }); });
  { const g=dashCanvas.getContext('2d'); g.clearRect(0,0,64,4); g.fillStyle=L.dash; g.globalAlpha=.85; g.fillRect(0,0,30,4); g.globalAlpha=1; speckle(g,64,4,40,.6,['#444']); dashTex.needsUpdate=true; }
  atmoSet(L.fx);
  try{ let b=document.getElementById('lkBadge'); if(!b){ b=document.createElement('div'); b.id='lkBadge'; b.style.cssText='position:fixed;left:8px;bottom:8px;z-index:99999;font:700 11px monospace;background:#000c;color:#fff;padding:5px 8px;border-radius:6px;pointer-events:none;transition:opacity 1s'; document.body.appendChild(b); }
    b.textContent='LOOK v2 \u2022 '+key+' \u2022 grade '+(GR?'ON':'OFF (fallback)'); b.style.opacity=1; clearTimeout(b._t); b._t=setTimeout(()=>{b.style.opacity=0;},6000); }catch(e){}
}
function addRoadIdentity(key,blocks){
 const A=cityKit(key),L=LKC;
 const mat=(color,opts)=>new THREE.MeshLambertMaterial(Object.assign({color},opts||{}));
 const box=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);cityGroup.add(m);return m;};
 const stripeItems=[];
 const stripe=(w,d,c,x,z,rot=0)=>{stripeItems.push({color:c,x,y:.065,z,rx:-Math.PI/2,rz:rot,sx:w,sy:d,sz:1});};
 // Road signatures: each location has its own markings and edge treatment while
 // preserving the existing road footprint/collision-safe street grid.
 const roadKeys=Object.keys(CITY_ARCH_ROAD),idx=Math.max(0,roadKeys.indexOf(key));
 const patterns=[
   ()=>{for(let k=-3;k<=3;k++)for(let i=-3;i<=2;i++){for(const side of [-1,1])stripe(8,.28,A.mark,roadMid(i,'x')+side*5,roadCoord(k,'z'),0);}},
   ()=>{for(let k=-3;k<=3;k++)for(let i=-3;i<=2;i++){for(const side of [-1,1]){box(R-14,.18,.65,A.kerb,roadMid(i,'x'),.1,roadCoord(k,'z')+side*6.6);stripe(R-14,.18,A.mark,roadMid(i,'x'),roadCoord(k,'z')+side*2.5,0);}}},
   ()=>{for(let k=-3;k<=3;k++)for(let i=-3;i<=2;i++){for(const side of [-1,1]){for(let n=0;n<6;n++)stripe(3,.25,A.mark,roadMid(i,'x')-25+n*10,roadCoord(k,'z')+side*3,0);}}},
   ()=>{for(let k=-3;k<=3;k++)for(let i=-3;i<=2;i++){for(const side of [-1,1]){box(R-14,.16,.5,A.kerb,roadMid(i,'x'),.09,roadCoord(k,'z')+side*6.7);for(let n=-2;n<=2;n++)stripe(1.5,1.5,A.mark,roadMid(i,'x')+n*10,roadCoord(k,'z')+side*4.7,0);}}},
   ()=>{for(let k=-3;k<=3;k++)for(let i=-3;i<=2;i++){for(const side of [-1,1])stripe(R-14,.45,A.mark,roadMid(i,'x'),roadCoord(k,'z')+side*5.4,0);}}
 ];
 patterns[idx%patterns.length]();
 // Add a stable per-city road signature: line rhythm, lane count and junction paint differ by city.
 const laneCount=1+(idx%4),gap=5.2+(idx%3)*.55,roadSpan=R*6;
 for(let k=-3;k<=3;k++)for(let i=-3;i<=2;i++){
   for(let lane=0;lane<laneCount;lane++){
     const offset=(lane-(laneCount-1)/2)*gap;
     if(idx%4===0){for(let seg=-2;seg<=2;seg++)stripe(5.5,idx%2?.18:.28,A.mark,roadMid(i,'x')+seg*11,roadCoord(k,'z')+offset,0);}
     else if(idx%4===1){stripe(R-14,.16,A.mark,roadMid(i,'x'),roadCoord(k,'z')+offset,0);}
     else if(idx%4===2){for(let seg=-3;seg<=3;seg++)stripe(2.6,.3,A.mark,roadMid(i,'x')+seg*8,roadCoord(k,'z')+offset,0);}
     else {stripe(R-14,.22,A.mark,roadMid(i,'x'),roadCoord(k,'z')+offset,0);stripe(R-14,.12,A.kerb,roadMid(i,'x'),roadCoord(k,'z')+offset+.65,0);}
   }
   if(idx%3===0){for(let side of [-1,1])for(let seg=0;seg<6;seg++)stripe(2.8,1.1,A.mark,roadMid(i,'x')-27+seg*4,roadCoord(k,'z')+side*5.8,0);}
 }
 // Mirror the same city-specific treatment onto the north/south streets.
 for(let k=-3;k<=3;k++)for(let i=-3;i<=2;i++){
   for(let lane=0;lane<laneCount;lane++){
     const offset=(lane-(laneCount-1)/2)*gap;
     if(idx%4===0){for(let seg=-2;seg<=2;seg++)stripe(5.5,.22,A.mark,roadCoord(k,'x')+offset,roadMid(i,'z')+seg*11,Math.PI/2);}
     else if(idx%4===1){stripe(R-14,.16,A.mark,roadCoord(k,'x')+offset,roadMid(i,'z'),Math.PI/2);}
     else if(idx%4===2){for(let seg=-3;seg<=3;seg++)stripe(2.6,.3,A.mark,roadCoord(k,'x')+offset,roadMid(i,'z')+seg*8,Math.PI/2);}
     else {stripe(R-14,.22,A.mark,roadCoord(k,'x')+offset,roadMid(i,'z'),Math.PI/2);stripe(R-14,.12,A.kerb,roadCoord(k,'x')+offset+.65,roadMid(i,'z'),Math.PI/2);}
   }
 }
 blocks.forEach(b=>{
   const x=b.cx,z=b.cz;
   if(A.edge==='rail'){
     for(const side of [-1,1]){box(R-14,.08,.18,A.roof,x,.12,z+side*(R/2+7.1));for(let n=-3;n<=3;n++)box(1.1,.08,1.2,A.kerb,x+n*8,.1,z+side*(R/2+7.1));}
   }else if(A.edge==='water-channel'||A.edge==='canal'){
     for(const side of [-1,1]){box(R-14,.1,.8,'#5D8E9B',x,.05,z+side*(R/2+7.2));for(let n=-2;n<=2;n++)box(2,.14,.6,A.kerb,x+n*10,.12,z+side*(R/2+7.2));}
   }else if(A.edge==='rock'||A.edge==='stone'){
     for(const side of [-1,1])for(let n=-2;n<=2;n++)box(5,.22,.7,A.kerb,x+n*10,.11,z+side*(R/2+7.1));
   }else if(A.edge==='green-strip'||A.edge==='rooted'){
     for(const side of [-1,1]){box(R-14,.12,1.2,'#527B48',x,.08,z+side*(R/2+7.25));for(let n=-2;n<=2;n++){const t=new THREE.Mesh(new THREE.ConeGeometry(.6,1.5,5),mat('#2F7441'));t.position.set(x+n*10,.8,z+side*(R/2+7.25));cityGroup.add(t);}}
   }else if(A.edge==='loading-bay'||A.edge==='service-ditch'){
     for(const side of [-1,1])for(let n=-2;n<=2;n++)stripe(4,1.1,A.mark,x+n*10,z+side*(R/2+5.8),0);
   }else if(A.edge==='sand-shoulder'||A.edge==='earth-shoulder'){
     for(const side of [-1,1])box(R-14,.08,1.4,A.kerb,x,.03,z+side*(R/2+7.2));
   }else{
     for(const side of [-1,1])box(R-14,.12,.32,A.kerb,x,.07,z+side*7.05);
   }
 });
 // State-specific road furniture: every road kit gets a distinct marker/sign shape.
 for(let n=-2;n<=2;n++){
   const x=roadMid(n,'x'),z=roadMid(-3,'z');
   if(A.edge==='rail'){
     box(.25,5,.25,A.roof,x,2.5,z-8);box(3,.3,.3,A.mark,x,4.8,z-8);
   }else if(A.edge==='water-channel'||A.edge==='canal'){
     box(2,1.2,.25,A.roof,x,1,z-8);box(1.2,.2,.3,A.mark,x,1.6,z-8);
   }else if(A.edge==='green-strip'||A.edge==='rooted'){
     const tree=new THREE.Mesh(new THREE.CylinderGeometry(.25,.45,3,6),mat('#76583B'));tree.position.set(x,1.5,z-8);cityGroup.add(tree);
     const crown=new THREE.Mesh(new THREE.SphereGeometry(1.6,7,6),mat('#367744'));crown.position.set(x,3.8,z-8);cityGroup.add(crown);
   }else{
     box(.3,2.4,.3,A.roof,x,1.2,z-8);box(1.4,.45,.18,A.mark,x,2.2,z-8);
   }
 }
 const byColor=new Map();
 stripeItems.forEach(item=>{if(!byColor.has(item.color))byColor.set(item.color,[]);byColor.get(item.color).push(item);});
 byColor.forEach((items,color)=>instanced(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color,depthWrite:false}),items,cityGroup));
}
function roadDecals(C,blocks){
  const L=LKC,dc=L.lat>.3?'#9a5a38':(L.dust>.2?'#cdb48a':'#8a7e6a'),its=[]; const geo=new THREE.PlaneGeometry(R-14,2.8); geo.rotateX(-Math.PI/2);
  blocks.forEach(b=>{ const o=R/2-4.6; its.push({x:b.cx,y:.047,z:b.cz-o},{x:b.cx,y:.047,z:b.cz+o,ry:Math.PI},{x:b.cx-o,y:.047,z:b.cz,ry:Math.PI/2},{x:b.cx+o,y:.047,z:b.cz,ry:-Math.PI/2}); });
  instanced(geo,new THREE.MeshLambertMaterial({color:dc,map:LKT.edge,transparent:true,opacity:.35+L.dust*.6+L.lat*.3,depthWrite:false}),its,cityGroup);
}
function atmoSet(type){
  if(ATMO){ scene.remove(ATMO.o); ATMO.o.geometry.dispose(); ATMO=null; } if(!type) return;
  const rain=type==='rain',n=P.low?(rain?250:110):(rain?700:280),l=new Float32Array(n*3),pos=new Float32Array(n*(rain?6:3));
  for(let i=0;i<n;i++){ l[i*3]=(Math.random()-.5)*150; l[i*3+1]=Math.random()*55; l[i*3+2]=(Math.random()-.5)*150; }
  const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const o=rain?new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:0xbccdd2,transparent:true,opacity:.38,fog:false})):new THREE.Points(geo,new THREE.PointsMaterial({color:0xe6cc9c,size:1.5,transparent:true,opacity:.42,depthWrite:false,fog:false}));
  o.frustumCulled=false; scene.add(o); ATMO={o,rain,n,l,pos,geo};
}
function atmoUpdate(dt,time,fx,fz){
  if(!ATMO) return; const A=ATMO,l=A.l,p=A.pos;
  for(let i=0;i<A.n;i++){
    if(A.rain){ l[i*3+1]-=58*dt; l[i*3]-=5*dt; if(l[i*3+1]<0){ l[i*3+1]+=55; } }
    else { l[i*3]+=(4+Math.sin(i)*1.5)*dt; l[i*3+1]+=Math.sin(time*.6+i)*.6*dt; if(l[i*3]>75) l[i*3]-=150; l[i*3+1]=Math.max(.5,Math.min(40,l[i*3+1])); }
    const x=fx+l[i*3],y=l[i*3+1],z=fz+l[i*3+2];
    if(A.rain){ const k=i*6; p[k]=x; p[k+1]=y; p[k+2]=z; p[k+3]=x-.35; p[k+4]=y+2.6; p[k+5]=z; } else { p[i*3]=x; p[i*3+1]=y; p[i*3+2]=z; }
  }
  A.geo.attributes.position.needsUpdate=true;
}
function onResizeHook(){ if(GR) GR.size(); }
function initGrade(){
  try{
    const gl=renderer.getContext(),w2=renderer.capabilities.isWebGL2; let hdr=false;
    if(w2) hdr=!!(gl.getExtension('EXT_color_buffer_float')||gl.getExtension('EXT_color_buffer_half_float'));
    else hdr=!!(renderer.extensions.get('OES_texture_half_float')&&gl.getExtension('EXT_color_buffer_half_float'));
    const mk=(w,h,t,d)=>new THREE.WebGLRenderTarget(w,h,{type:t,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat,depthBuffer:d,stencilBuffer:false});
    const probe=t=>{ try{ const r=mk(16,16,t,true); renderer.setRenderTarget(r); const ok=gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE; renderer.setRenderTarget(null); r.dispose(); return ok; }catch(e){ renderer.setRenderTarget(null); return false; } };
    let type=THREE.UnsignedByteType; if(hdr&&probe(THREE.HalfFloatType)) type=THREE.HalfFloatType; else LS=.62;
    const vs='varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }';
    const rt=mk(4,4,type,true),ra=mk(4,4,type,false),rb=mk(4,4,type,false);
    const bright=new THREE.ShaderMaterial({uniforms:{tS:{value:null}},vertexShader:vs,fragmentShader:'precision highp float; uniform sampler2D tS; varying vec2 vUv; void main(){ vec3 c=texture2D(tS,vUv).rgb; float l=max(c.r,max(c.g,c.b)); gl_FragColor=vec4(c*smoothstep(1.0,1.7,l),1.); }',depthTest:false,depthWrite:false});
    const blur=new THREE.ShaderMaterial({uniforms:{tS:{value:null},uD:{value:new THREE.Vector2()}},vertexShader:vs,fragmentShader:'precision highp float; uniform sampler2D tS; uniform vec2 uD; varying vec2 vUv; void main(){ vec3 c=texture2D(tS,vUv).rgb*.227; c+=(texture2D(tS,vUv+uD*1.5).rgb+texture2D(tS,vUv-uD*1.5).rgb)*.194; c+=(texture2D(tS,vUv+uD*3.5).rgb+texture2D(tS,vUv-uD*3.5).rgb)*.121; c+=(texture2D(tS,vUv+uD*5.5).rgb+texture2D(tS,vUv-uD*5.5).rgb)*.054; c+=(texture2D(tS,vUv+uD*7.5).rgb+texture2D(tS,vUv-uD*7.5).rgb)*.016; gl_FragColor=vec4(c,1.); }',depthTest:false,depthWrite:false});
    const fs=`precision highp float;
uniform sampler2D tS,tB; uniform vec2 uPx; uniform float uExp,uBl,uSat,uCon,uFade,uVig,uGrain,uT,uVeilA,uFx;
uniform vec3 uLift,uGain,uVeil;
varying vec2 vUv;
float lum(vec3 c){ return dot(c,vec3(.299,.587,.114)); }
vec3 fit(vec3 v){ vec3 a=v*(v+.0245786)-.000090537; vec3 b=v*(.983729*v+.432951)+.238081; return a/b; }
vec3 aces(vec3 c){ const mat3 I=mat3(vec3(.59719,.076,.0284),vec3(.35458,.90834,.13383),vec3(.04823,.01566,.83777)); const mat3 O=mat3(vec3(1.60475,-.10208,-.00327),vec3(-.53108,1.10813,-.07276),vec3(-.07367,-.00605,1.07602)); c*=1./.6; c=I*c; c=fit(c); c=O*c; return clamp(c,0.,1.); }
vec3 S(vec2 uv){ return min(texture2D(tS,uv).rgb,vec3(4.)); }
void main(){
  vec2 uv=vUv; vec3 col=S(uv);
  if(uFx>.5){
    vec3 nw=S(uv+vec2(-1.,-1.)*uPx),ne=S(uv+vec2(1.,-1.)*uPx),sw=S(uv+vec2(-1.,1.)*uPx),se=S(uv+vec2(1.,1.)*uPx);
    float lN=lum(nw),lE=lum(ne),lS=lum(sw),lW=lum(se),lM=lum(col);
    float mn=min(lM,min(min(lN,lE),min(lS,lW))),mx=max(lM,max(max(lN,lE),max(lS,lW)));
    vec2 dir=vec2(-((lN+lE)-(lS+lW)),(lN+lS)-(lE+lW));
    float dr=max((lN+lE+lS+lW)*.03125,1./128.); float rc=1./(min(abs(dir.x),abs(dir.y))+dr);
    dir=min(vec2(8.),max(vec2(-8.),dir*rc))*uPx;
    vec3 a=.5*(S(uv+dir*(1./3.-.5))+S(uv+dir*(2./3.-.5)));
    vec3 b=a*.5+.25*(S(uv-dir*.5)+S(uv+dir*.5));
    float lb=lum(b); col=(lb<mn||lb>mx)?a:b;
  }
  col+=texture2D(tB,uv).rgb*uBl;
  col=aces(col*uExp);
  col*=uGain; float l=lum(col);
  col+=uLift*(1.-smoothstep(0.,.6,l));
  col=(col-.45)*uCon+.45;
  l=lum(col); col=mix(vec3(l),col,uSat);
  col=mix(col,uVeil,uVeilA*pow(uv.y,1.6));
  col=col*(1.-uFade)+uFade*uVeil*.55;
  float v=length((uv-.5)*vec2(1.,.9)); col*=1.-uVig*smoothstep(.3,.85,v);
  float n=fract(sin(dot(uv*(1./uPx)+uT,vec2(12.9898,78.233)))*43758.5453); col+=(n-.5)*uGrain*(1.-l*.6);
  gl_FragColor=vec4(clamp(col,0.,1.),1.);
}`;
    const comp=new THREE.ShaderMaterial({uniforms:{tS:{value:null},tB:{value:null},uPx:{value:new THREE.Vector2(1,1)},uExp:{value:1.05},uBl:{value:0},uSat:{value:1},uCon:{value:1.08},uFade:{value:.02},uVig:{value:.3},uGrain:{value:.03},uT:{value:0},uVeilA:{value:.1},uFx:{value:1},uLift:{value:new THREE.Vector3()},uGain:{value:new THREE.Vector3(1,1,1)},uVeil:{value:new THREE.Color('#E8C896')}},vertexShader:vs,fragmentShader:fs,depthTest:false,depthWrite:false});
    const qs=new THREE.Scene(),qc=new THREE.OrthographicCamera(-1,1,1,-1,0,1),quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),bright); quad.frustumCulled=false; qs.add(quad);
    SKY=new THREE.Mesh(new THREE.SphereGeometry(450,24,14),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,depthTest:false,fog:false,
      uniforms:{uTop:{value:new THREE.Color()},uHor:{value:new THREE.Color()},uSunCol:{value:new THREE.Color()},uSunDir:{value:new THREE.Vector3(0,1,0)},uCl:{value:.4},uCloud:{value:new THREE.Color()},uT:{value:0}},
      vertexShader:'varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader:'precision highp float; uniform vec3 uTop,uHor,uSunCol,uSunDir,uCloud; uniform float uCl,uT; varying vec3 vP; float h2(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); } float no(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h2(i),h2(i+vec2(1.,0.)),f.x),mix(h2(i+vec2(0.,1.)),h2(i+vec2(1.,1.)),f.x),f.y); } void main(){ vec3 d=normalize(vP); float h=clamp(d.y,0.,1.); vec3 c=mix(uHor,uTop,pow(h,.5)); float s=max(dot(d,normalize(uSunDir)),0.); c+=uSunCol*(pow(s,6.)*.22+pow(s,160.)*1.1); vec2 p=d.xz/(max(d.y,0.)+.28)*1.7+vec2(uT*.01,0.); float n=no(p)*.55+no(p*2.1)*.3+no(p*4.3)*.15; c=mix(c,uCloud,smoothstep(.5,.82,n)*uCl*smoothstep(0.,.2,d.y)); gl_FragColor=vec4(c,1.); }'}));
    SKY.renderOrder=-10; SKY.frustumCulled=false; scene.add(SKY);
    const pass=(m,t)=>{ quad.material=m; renderer.setRenderTarget(t); renderer.render(qs,qc); };
    const v2=new THREE.Vector2();
    GR={comp,bloom:.4,rt,
      size(){ renderer.getDrawingBufferSize(v2); const w=Math.max(4,v2.x|0),h=Math.max(4,v2.y|0); rt.setSize(w,h); const bw=Math.max(4,w>>2),bh=Math.max(4,h>>2); ra.setSize(bw,bh); rb.setSize(bw,bh); comp.uniforms.uPx.value.set(1/w,1/h); GR.bw=bw; GR.bh=bh; },
      render(){
        SKY.position.copy(camera.position); SKY.material.uniforms.uT.value=clock.elapsedTime; comp.uniforms.uT.value=(clock.elapsedTime%10)*.37;
        renderer.setRenderTarget(rt); renderer.render(scene,camera);
        const bl=!P.low&&GR.bloom>0;
        if(bl){ bright.uniforms.tS.value=rt.texture; pass(bright,ra); blur.uniforms.tS.value=ra.texture; blur.uniforms.uD.value.set(1/GR.bw,0); pass(blur,rb); blur.uniforms.tS.value=rb.texture; blur.uniforms.uD.value.set(0,1/GR.bh); pass(blur,ra); }
        comp.uniforms.tS.value=rt.texture; comp.uniforms.tB.value=ra.texture; comp.uniforms.uBl.value=bl?GR.bloom:0; comp.uniforms.uFx.value=P.low?0:1;
        pass(comp,null);
      }};
    GR.size();
  }catch(e){ GR=null; SKY=null; LS=1; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.2; console.warn('grade off',e); }
}

let curCity=null,RN=Math.random;
const rr=(a,b)=>a+RN()*(b-a),pk=a=>a[Math.floor(RN()*a.length)];
const cityGroup=new THREE.Group(),missionGroup=new THREE.Group(),trafficGroup=new THREE.Group(),barkGroup=new THREE.Group(); const backGroup=new THREE.Group(); scene.add(cityGroup,missionGroup,trafficGroup,barkGroup,backGroup);
let cityCols=0,cars=[],walkers=[],smoke=[],texs=[];

function clearGroup(g){
  g.traverse(o=>{ if(o.geometry) o.geometry.dispose(); });
  while(g.children.length) g.remove(g.children[0]);
}
function winCanvas(lit){
  const c=document.createElement('canvas'); c.width=c.height=64; const g=c.getContext('2d');
  g.fillStyle='#fff'; g.fillRect(0,0,64,64);
  for(let y=0;y<4;y++)for(let x=0;x<4;x++){ g.fillStyle=(lit&&Math.random()<.2)?'#ffd36b':'#5f6e7a'; g.fillRect(x*16+3,y*16+4,10,8); }
  return c;
}
const winCans=[winCanvas(false),winCanvas(true),winCanvas(true)];
const dashCanvas=document.createElement('canvas'); dashCanvas.width=64; dashCanvas.height=4;
{ const g=dashCanvas.getContext('2d'); g.fillStyle=YELLOW; g.fillRect(0,0,30,4); }
const dashTex=new THREE.Texture(dashCanvas); dashTex.needsUpdate=true; dashTex.wrapS=THREE.RepeatWrapping; dashTex.repeat.set(56/6,1);
const dashMat=new THREE.MeshBasicMaterial({map:dashTex,transparent:true,depthWrite:false});
const dashGeo=new THREE.PlaneGeometry(56,0.5);

const ZINC=['#8a4b2a','#7a5a45','#6f7f8a','#3c6e8f','#8c3b2e','#a2552e'];
function pickStyle(C){
  if(curCity==='lagos') return RN()<.7?'glass':(RN()<.68?'admin':'flat');
  let t=0; C.styles.forEach(x=>{ t+=x[1]; }); let r=RN()*t; for(const x of C.styles){ r-=x[1]; if(r<=0) return x[0]; } return C.styles[0][0];
}
const signTexCache={};
function signMat(sg){
  const key=sg.join('|'); let tex=signTexCache[key];
  if(!tex){
    const c=document.createElement('canvas'); c.width=256; c.height=72; const g=c.getContext('2d');
    g.fillStyle=sg[1]; g.fillRect(0,0,256,72); g.strokeStyle=sg[2]; g.lineWidth=4; g.strokeRect(5,5,246,62);
    g.fillStyle=sg[2]; g.font='900 30px "Arial Black",Impact,sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(sg[0],128,38,236);
    tex=new THREE.Texture(c); tex.needsUpdate=true; signTexCache[key]=tex;
  }
  return new THREE.MeshBasicMaterial({map:tex,transparent:true});
}
function signPlane(sg,w,h,x,y,z,ry,mats){
  const mt=signMat(sg); if(mats) mats.push(mt);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mt); m.position.set(x,y,z); m.rotation.y=ry; if(mats) m.userData.nomerge=true; cityGroup.add(m); return m;
}
/* ---- procedural Nigerian textures ---- */
const TEX_R=mulberry(777);
function cv(w,h){ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; }
function speckle(g,w,h,n,a,cols){ for(let i=0;i<n;i++){ g.globalAlpha=a*(.4+TEX_R()*.6); g.fillStyle=cols[Math.floor(TEX_R()*cols.length)]; const z=1+TEX_R()*3; g.fillRect(TEX_R()*w,TEX_R()*h,z,z); } g.globalAlpha=1; }
function mkTex(c){ const t=new THREE.Texture(c); t.needsUpdate=true; t.wrapS=t.wrapT=THREE.RepeatWrapping; return t; }
function uvScale(geo,rx,ry){ const uv=geo.attributes.uv; for(let i=0;i<uv.count;i++) uv.setXY(i,uv.getX(i)*rx,uv.getY(i)*ry); return geo; }
const ASPH=mkTex((function(){ const c=cv(256,256),g=c.getContext('2d'); g.fillStyle='#e6e6e6'; g.fillRect(0,0,256,256); speckle(g,256,256,2600,.5,['#bdbdbd','#fafafa','#9d9d9d','#d0d0d0']);
  for(let i=0;i<5;i++){ g.fillStyle='rgba(60,60,60,'+(.1+TEX_R()*.12)+')'; g.fillRect(TEX_R()*200,TEX_R()*200,30+TEX_R()*50,20+TEX_R()*40); }
  g.strokeStyle='rgba(30,30,30,.45)'; for(let i=0;i<7;i++){ let x=TEX_R()*256,y=TEX_R()*256; g.beginPath(); g.moveTo(x,y); for(let k=0;k<6;k++){ x+=(TEX_R()-.5)*40; y+=(TEX_R()-.5)*40; g.lineTo(x,y); } g.stroke(); }
  for(let i=0;i<4;i++){ g.fillStyle='rgba(20,20,20,.25)'; g.beginPath(); g.ellipse(TEX_R()*256,TEX_R()*256,6+TEX_R()*10,4+TEX_R()*7,TEX_R()*3,0,7); g.fill(); } return c; })());
const DIRT=mkTex((function(){ const c=cv(128,128),g=c.getContext('2d'); g.fillStyle='#f0f0f0'; g.fillRect(0,0,128,128); speckle(g,128,128,1500,.55,['#c9c9c9','#ffffff','#b0b0b0','#dedede']); return c; })());
const PAVE=mkTex((function(){ const c=cv(128,128),g=c.getContext('2d'); g.fillStyle='#f4f4f4'; g.fillRect(0,0,128,128); g.strokeStyle='rgba(60,60,60,.35)'; g.lineWidth=2;
  for(let y=0;y<128;y+=32){ g.beginPath(); g.moveTo(0,y); g.lineTo(128,y); g.stroke(); for(let x=((y/32)%2)*16;x<128;x+=32){ g.beginPath(); g.moveTo(x,y); g.lineTo(x,y+32); g.stroke(); } }
  speckle(g,128,128,500,.4,['#c8c0b0','#ffffff','#a89c88']); return c; })());
function facadeCanvas(style,v){
  const S=256,c=cv(S,S),g=c.getContext('2d'),R2=mulberry(style.charCodeAt(0)*131+style.length*17+v*977),rn=(a,b)=>a+R2()*(b-a);
  g.fillStyle='#ffffff'; g.fillRect(0,0,S,S);
  const stain=(x,y,len,a)=>{ g.fillStyle='rgba(60,40,20,'+a+')'; g.fillRect(x,y,rn(3,7),len); };
  const bars=(wx,wy,ww,wh)=>{ g.fillStyle='#16191c'; for(let x=wx+6;x<wx+ww;x+=12) g.fillRect(x,wy,3,wh); g.fillRect(wx,wy+wh*.5,ww,3); };
  if(style==='flat'){
    for(let f=0;f<2;f++){ const fy=f*128; g.fillStyle='rgba(0,0,0,.16)'; g.fillRect(0,fy+118,S,10);
      for(let b=0;b<2;b++){ const wx=b*128+34,wy=fy+26,ww=60,wh=70;
        g.fillStyle='#2f3a43'; g.fillRect(wx-4,wy-4,ww+8,wh+8); g.fillStyle=R2()<.18?'#f0c96a':'#566673'; g.fillRect(wx,wy,ww,wh);
        if(v===0){ g.fillStyle='rgba(255,255,255,.18)'; for(let y=wy+4;y<wy+wh;y+=8) g.fillRect(wx,y,ww,3); } else bars(wx,wy,ww,wh);
        g.fillStyle='rgba(0,0,0,.25)'; g.fillRect(wx-8,wy+wh+4,ww+16,6);
        if(v===2&&f===1){ g.fillStyle='rgba(0,0,0,.3)'; g.fillRect(wx-14,fy+112,ww+28,8); g.fillStyle='#22262a'; for(let x=wx-12;x<wx+ww+12;x+=8) g.fillRect(x,fy+92,2,20); g.fillRect(wx-14,fy+92,ww+28,2); }
        else if(R2()<.35){ g.fillStyle='#cfd2d4'; g.fillRect(wx+ww-20,wy+wh+12,26,18); g.fillStyle='#8a8f93'; for(let k=0;k<3;k++) g.fillRect(wx+ww-17,wy+wh+16+k*4,20,1.5); }
        for(let k=0;k<3;k++) stain(wx+rn(0,ww),wy+wh+10,rn(20,50),.1); } }
    const gr=g.createLinearGradient(0,S-60,0,S); gr.addColorStop(0,'rgba(70,50,30,0)'); gr.addColorStop(1,'rgba(70,50,30,.22)'); g.fillStyle=gr; g.fillRect(0,S-60,S,60);
  } else if(style==='zinc'){
    g.fillStyle='rgba(0,0,0,.28)'; g.fillRect(0,208,S,48);
    g.fillStyle='#4a2f1b'; g.fillRect(34,92,66,116); g.fillStyle='#1c1c1c'; for(let x=40;x<96;x+=9) g.fillRect(x,96,2,108);
    g.fillStyle='#2f3a43'; g.fillRect(143,86,80,66); g.fillStyle='#566673'; g.fillRect(148,91,70,56); bars(148,91,70,56);
    g.fillStyle='#fff'; g.fillRect(44,58,44,22); g.fillStyle='#111'; g.font='bold 16px Arial'; g.textAlign='center'; g.fillText('No.'+(2+Math.floor(R2()*48)),66,75);
    g.fillStyle='rgba(255,255,255,.25)'; for(let i=0;i<4;i++) g.fillRect(rn(0,200),rn(10,190),rn(10,40),rn(8,24));
    for(let i=0;i<6;i++) stain(rn(0,S),0,rn(30,110),.12);
  } else if(style==='banco'){
    g.fillStyle='#f3ecdc'; g.fillRect(0,0,S,S); speckle(g,S,S,1800,.35,['#b99a6c','#ffffff','#8a6a44']);
    g.fillStyle='rgba(255,255,255,.9)'; g.fillRect(0,10,S,34); g.strokeStyle='rgba(110,75,40,.55)'; g.lineWidth=2;
    for(let x=0;x<S;x+=32){ g.beginPath(); g.moveTo(x,44); g.lineTo(x+16,12); g.lineTo(x+32,44); g.stroke(); g.beginPath(); g.arc(x+16,34,4,0,7); g.stroke(); }
    for(let b=0;b<2;b++){ const wx=36+b*128; g.fillStyle='#fff'; g.fillRect(wx-6,80,52,62); g.fillStyle='#5a3d22'; g.fillRect(wx,86,40,52); g.fillStyle='rgba(0,0,0,.3)'; g.fillRect(wx+19,86,2,52); }
    g.fillStyle='#fff'; g.fillRect(98,150,60,106); g.fillStyle='#3b2a1a'; g.beginPath(); g.moveTo(104,256); g.lineTo(104,196); g.arc(128,196,24,Math.PI,0); g.lineTo(152,256); g.fill();
    for(let i=0;i<5;i++) stain(rn(0,S),50,rn(30,90),.08);
  } else if(style==='glass'){
    const gr=g.createLinearGradient(0,0,S,S); gr.addColorStop(0,'#eaf3fa'); gr.addColorStop(1,'#a9c6da'); g.fillStyle=gr; g.fillRect(0,0,S,S);
    for(let i=0;i<4;i++)for(let j=0;j<5;j++) if(R2()<.12){ g.fillStyle='rgba(255,225,150,.75)'; g.fillRect(i*64+4,j*51+4,56,43); }
    g.strokeStyle='rgba(30,45,60,.85)'; g.lineWidth=3; for(let i=0;i<=4;i++){ g.beginPath(); g.moveTo(i*64,0); g.lineTo(i*64,S); g.stroke(); } for(let j=0;j<=5;j++){ g.beginPath(); g.moveTo(0,j*51); g.lineTo(S,j*51); g.stroke(); }
  } else {
    for(let f=0;f<2;f++){ const fy=f*128; for(let b=0;b<4;b++){ const wx=b*64+14; g.fillStyle='#2f3a43'; g.fillRect(wx,fy+24,36,86); g.fillStyle='#566673'; g.fillRect(wx+3,fy+27,30,80); } g.fillStyle='rgba(0,0,0,.18)'; g.fillRect(0,fy+118,S,10); }
    g.fillStyle='rgba(0,0,0,.14)'; for(let b=0;b<=4;b++) g.fillRect(b*64-6,0,3,S);
  }
  return c;
}
const FACT={}; ['flat','zinc','banco','glass','admin'].forEach(st=>{ FACT[st]=[0,1,2].map(v=>mkTex(facadeCanvas(st,v))); });
const FAC_TH={flat:12,zinc:8,banco:10,glass:14,admin:12};
const GABLE=(function(){ const g=new THREE.CylinderGeometry(1,1,1,3,1,false); g.rotateY(Math.PI/2); g.rotateZ(Math.PI/2); return g; })();
const WALLADS=[['UP NEPA!','#F6B21A','#1B1C20'],['NOT FOR SALE','#ffffff','#C8402A'],['BEWARE OF 419','#ffffff','#0B7A43'],['NO DUMPING','#ffffff','#C8402A'],['POST NO BILLS','#E7D27A','#1B1C20'],['GOD DID','#0B7A43','#ffffff'],['RECHARGE HERE','#F6B21A','#1B1C20'],['RECHARGE HERE','#0B7A43','#ffffff'],['RECHARGE HERE','#C8402A','#ffffff'],['KEEP NIGERIA CLEAN','#ffffff','#0B7A43']];
const flagTex=(function(){ const c=cv(96,64),g=c.getContext('2d'); g.fillStyle='#008751'; g.fillRect(0,0,96,64); g.fillStyle='#fff'; g.fillRect(32,0,32,64); const t=new THREE.Texture(c); t.needsUpdate=true; return t; })();
const FLAGMAT=new THREE.MeshBasicMaterial({map:flagTex,side:THREE.DoubleSide});
const buntTex=(function(){ const c=cv(256,32),g=c.getContext('2d'); g.strokeStyle='#222'; g.lineWidth=2; g.beginPath(); g.moveTo(0,2); g.lineTo(256,2); g.stroke(); for(let i=0;i<8;i++){ g.fillStyle=i%2?'#ffffff':'#008751'; g.beginPath(); g.moveTo(i*32+2,3); g.lineTo(i*32+30,3); g.lineTo(i*32+16,30); g.fill(); } const t=new THREE.Texture(c); t.needsUpdate=true; return t; })();
const BUNTMAT=new THREE.MeshBasicMaterial({map:buntTex,transparent:true,side:THREE.DoubleSide,alphaTest:.4});
const ADS=[['NAIJA PAY','Send money. No wahala.','#0B7A43','#ffffff'],['PEPPER MAX','Make your soup sweet','#C8402A','#fff4d6'],['GOLDEN SPOON RICE','Chop well. Live well.','#F6B21A','#1B1C20'],['KITCITY','Learn wallet. Dodge scam.','#10C8DC','#1B1C20'],['POWER FOR ALL','UP NEPA!','#2D6FB3','#ffffff'],['PURE & COLD','Table water for the family','#10A0C8','#ffffff'],['BEWARE OF 419','Verify before you send','#1B1C20','#F6B21A']];
const adMats={};
function adMat(i){ if(adMats[i]) return adMats[i]; const a=ADS[i%ADS.length],c=cv(512,220),g=c.getContext('2d'); g.fillStyle=a[2]; g.fillRect(0,0,512,220); g.fillStyle='rgba(255,255,255,.14)'; g.beginPath(); g.arc(440,60,90,0,7); g.fill(); g.beginPath(); g.arc(70,200,70,0,7); g.fill();
  g.fillStyle=a[3]; g.textAlign='center'; g.textBaseline='middle'; g.font='900 56px "Arial Black",Impact,sans-serif'; g.fillText(a[0],256,86,480); g.font='bold 30px Arial'; g.fillText(a[1],256,160,480); g.strokeStyle=a[3]; g.lineWidth=6; g.strokeRect(8,8,496,204);
  const t=new THREE.Texture(c); t.needsUpdate=true; return adMats[i]=new THREE.MeshBasicMaterial({map:t}); }
let DX=null;
function dxReset(){ DX={stand:[],tank:[],dish:[],rebar:[],merlon:[],pin:[],pinCap:[],pole:[],flag:[],xfmr:[],trash:[],bag:[],trunk:[],crownA:[],crownB:[],ptrunk:[],frond:[],bunt:[]}; }
function dxFlush(C){
  const put=(geo,mat,a)=>{ if(a.length) instanced(geo,mat,a,cityGroup); };
  const unit=new THREE.BoxGeometry(1,1,1),cyl=new THREE.CylinderGeometry(1,1,1,10),ico=new THREE.IcosahedronGeometry(1,1),cone=new THREE.ConeGeometry(1,1,10);
  const tg=new THREE.CylinderGeometry(.3,.5,1,7),fr=new THREE.BoxGeometry(3.4,.1,.8); fr.translate(1.7,0,0);
  const fg=new THREE.PlaneGeometry(3.6,2.1); fg.translate(1.8,0,0);
  const bg=new THREE.PlaneGeometry(14,1.4);
  const plaster=M('#e6d6b8'),leaf=new THREE.Color(C.leaf);
  put(unit,M('#7d7f82'),DX.stand); put(cyl,M('#12161a'),DX.tank);
  put(new THREE.ConeGeometry(1,1,12,1,true),new THREE.MeshLambertMaterial({color:'#e8e8e8',side:THREE.DoubleSide}),DX.dish);
  put(unit,M('#7a4a2e'),DX.rebar); put(unit,plaster,DX.merlon); put(unit,plaster,DX.pin); put(cone,plaster,DX.pinCap);
  put(unit,M('#8c9096'),DX.pole); put(fg,FLAGMAT,DX.flag); put(unit,M('#565b61'),DX.xfmr);
  put(ico,M('#3b2f26'),DX.trash); put(ico,M('#d8d8d8'),DX.bag);
  put(tg,M('#7a5530'),DX.trunk); put(ico,lam(leaf),DX.crownA); put(ico,lam(leaf.clone().multiplyScalar(1.28)),DX.crownB);
  put(tg,M('#8a6a44'),DX.ptrunk); put(fr,M('#2f8a4a'),DX.frond); put(bg,BUNTMAT,DX.bunt);
}
function mergeStatic(group){
  group.updateMatrixWorld(true);
  const buckets=new Map(),kill=[];
  group.traverse(o=>{
    if(!o.isMesh||o.isInstancedMesh||o.userData.nomerge||Array.isArray(o.material)||!o.material) return;
    const g=o.geometry; if(!g||!g.attributes.position||!g.attributes.normal||!g.attributes.uv) return;
    let b=buckets.get(o.material); if(!b){ b={mat:o.material,items:[]}; buckets.set(o.material,b); }
    b.items.push(o); kill.push(o);
  });
  const v=new THREE.Vector3(),nm=new THREE.Matrix3(),out=[];
  buckets.forEach(b=>{
    let vc=0,ic=0; b.items.forEach(o=>{ const g=o.geometry; vc+=g.attributes.position.count; ic+=g.index?g.index.count:g.attributes.position.count; });
    const pos=new Float32Array(vc*3),nor=new Float32Array(vc*3),uv=new Float32Array(vc*2),idx=new Uint32Array(ic); let vo=0,io=0;
    b.items.forEach(o=>{
      const g=o.geometry,pa=g.attributes.position,na=g.attributes.normal,ta=g.attributes.uv,m=o.matrixWorld; nm.getNormalMatrix(m);
      for(let i=0;i<pa.count;i++){
        v.fromBufferAttribute(pa,i).applyMatrix4(m); pos[(vo+i)*3]=v.x; pos[(vo+i)*3+1]=v.y; pos[(vo+i)*3+2]=v.z;
        v.fromBufferAttribute(na,i).applyMatrix3(nm).normalize(); nor[(vo+i)*3]=v.x; nor[(vo+i)*3+1]=v.y; nor[(vo+i)*3+2]=v.z;
        uv[(vo+i)*2]=ta.getX(i); uv[(vo+i)*2+1]=ta.getY(i);
      }
      if(g.index){ for(let i=0;i<g.index.count;i++) idx[io++]=g.index.getX(i)+vo; } else { for(let i=0;i<pa.count;i++) idx[io++]=vo+i; }
      vo+=pa.count;
    });
    const mg=new THREE.BufferGeometry(); mg.setAttribute('position',new THREE.BufferAttribute(pos,3)); mg.setAttribute('normal',new THREE.BufferAttribute(nor,3)); mg.setAttribute('uv',new THREE.BufferAttribute(uv,2)); mg.setIndex(new THREE.BufferAttribute(idx,1));
    out.push(new THREE.Mesh(mg,b.mat));
  });
  kill.forEach(o=>{ if(o.parent) o.parent.remove(o); });
  out.forEach(m=>group.add(m));
}
/* Each playable capital has its own architecture + street kit. These are not colour
   swaps: archetypes change roof silhouettes, frontage, supports, road markings,
   kerbs and roadside infrastructure. */
const CITY_ARCH_ROAD={
 lagos:{arch:'glass-tower',road:'coastal-boulevard',roof:'#6A9EAD',kerb:'#D7E8E8',mark:'#F6C85F',edge:'median',feature:'curtain-wall'},
 abuja:{arch:'monument',road:'boulevard',roof:'#AEBCC8',kerb:'#F1F1E8',mark:'#E8E4D6',edge:'median',feature:'portico'},
 kano:{arch:'adobe',road:'market-lanes',roof:'#B18A5B',kerb:'#C5A577',mark:'#DCC79C',edge:'gutter',feature:'parapet'},
 ph:{arch:'industrial',road:'harbour',roof:'#687E78',kerb:'#A6B8B1',mark:'#E2D4A7',edge:'drain',feature:'steel'},
 ibadan:{arch:'terrace',road:'hillside',roof:'#9B5B3D',kerb:'#B99A7D',mark:'#D4B57C',edge:'open-gutter',feature:'terrace'},
 kaduna:{arch:'rail',road:'rail-crossing',roof:'#A98B64',kerb:'#D3C2A1',mark:'#F0D8A0',edge:'rail',feature:'canopy'},
 enugu:{arch:'coal',road:'incline',roof:'#63766A',kerb:'#B3BEB2',mark:'#E7D9A6',edge:'stone-drain',feature:'gable'},
 benin:{arch:'bronze',road:'heritage',roof:'#8B4C36',kerb:'#C18A63',mark:'#D9B76A',edge:'brick',feature:'court'},
 calabar:{arch:'verandah',road:'rainforest',roof:'#718B7C',kerb:'#C5D5C8',mark:'#E4E5CE',edge:'canal',feature:'verandah'},
 owerri:{arch:'pavilion',road:'garden',roof:'#8C6C4B',kerb:'#B6C9AE',mark:'#E8D7A8',edge:'green-strip',feature:'pavilion'},
 aba:{arch:'workshop',road:'trade',roof:'#7C6657',kerb:'#BA9D7B',mark:'#F0C75E',edge:'loading-bay',feature:'workshop'},
 umuahia:{arch:'compound',road:'compound',roof:'#8A7057',kerb:'#C2B39B',mark:'#DCCB9D',edge:'yard',feature:'compound'},
 awka:{arch:'civic-tower',road:'civic',roof:'#8E9E9B',kerb:'#C5D0C8',mark:'#E6D9A5',edge:'stone',feature:'tower'},
 onitsha:{arch:'market-stack',road:'market-grid',roof:'#827468',kerb:'#B8A38A',mark:'#F3C74F',edge:'loading-bay',feature:'market'},
 asaba:{arch:'riverfront',road:'riverfront',roof:'#8B9998',kerb:'#C7D3CE',mark:'#E7E7D8',edge:'water-channel',feature:'river'},
 uyo:{arch:'modern-lowrise',road:'boulevard-palms',roof:'#748F82',kerb:'#C7D5C8',mark:'#E7E1C9',edge:'green-strip',feature:'canopy'},
 'ikot-ekpene':{arch:'raffia',road:'craft-quarter',roof:'#8A7250',kerb:'#C4B18E',mark:'#E2C98E',edge:'woven-drain',feature:'raffia'},
 yenagoa:{arch:'stilt',road:'wetland',roof:'#697E78',kerb:'#9BB9B2',mark:'#DDE8D9',edge:'water-channel',feature:'stilt'},
 warri:{arch:'oil-yard',road:'industrial-link',roof:'#6F7976',kerb:'#B4B6A7',mark:'#F0D27B',edge:'service-ditch',feature:'industrial'},
 makurdi:{arch:'river-market',road:'river-road',roof:'#8B795C',kerb:'#C6B89A',mark:'#E3D5A5',edge:'earth-shoulder',feature:'river'},
 ilorin:{arch:'emirate',road:'courtyard',roof:'#B39B75',kerb:'#D2C4A6',mark:'#E6D7B3',edge:'gutter',feature:'dome'},
 akure:{arch:'hill-roof',road:'ridge',roof:'#777E68',kerb:'#C5C4AA',mark:'#E7D6A3',edge:'stone-drain',feature:'hill'},
 'ado-ekiti':{arch:'spring-court',road:'rolling',roof:'#718666',kerb:'#C3CEB6',mark:'#E4D9AC',edge:'green-strip',feature:'spring'},
 osogbo:{arch:'sculpture',road:'grove',roof:'#6F835B',kerb:'#BFC7A7',mark:'#E2D7A1',edge:'rooted',feature:'sculpture'},
 abeokuta:{arch:'granite',road:'rock-cut',roof:'#9A8066',kerb:'#C4B49A',mark:'#E3D3A6',edge:'rock',feature:'granite'},
 lokoja:{arch:'confluence',road:'confluence',roof:'#8C8D7A',kerb:'#C2C5B3',mark:'#D8E0C9',edge:'water-channel',feature:'river'},
 lafia:{arch:'savanna-compound',road:'savanna',roof:'#B69A6D',kerb:'#D0C09C',mark:'#E4D3A6',edge:'earth-shoulder',feature:'compound'},
 bauchi:{arch:'yankari-lodge',road:'parkway',roof:'#A7A078',kerb:'#C9C6A6',mark:'#E2D8AD',edge:'earth-shoulder',feature:'pavilion'},
 gombe:{arch:'escarpment',road:'escarpment',roof:'#A69A77',kerb:'#C9C0A2',mark:'#E4D5A8',edge:'stone',feature:'hill'},
 damaturu:{arch:'sahel-court',road:'sahel',roof:'#B99561',kerb:'#D0B98D',mark:'#EAD7A8',edge:'sand-shoulder',feature:'parapet'},
 jalingo:{arch:'mambilla',road:'highland',roof:'#71856A',kerb:'#B8C5B0',mark:'#E0DDB6',edge:'stone-drain',feature:'gable'},
 yola:{arch:'adamawa',road:'plateau-link',roof:'#9A8C6D',kerb:'#C8BCA0',mark:'#E4D7AF',edge:'earth-shoulder',feature:'terrace'},
 sokoto:{arch:'sultanate',road:'historic-gate',roof:'#D1B58B',kerb:'#DCC9A8',mark:'#E8D8B6',edge:'gutter',feature:'dome'},
 katsina:{arch:'minaret',road:'old-city',roof:'#C4A578',kerb:'#D9C7A5',mark:'#E8D9B8',edge:'gutter',feature:'tower'},
 'birnin-kebbi':{arch:'river-courtyard',road:'fishing-quarter',roof:'#B5A078',kerb:'#C8C4A4',mark:'#D8E0C6',edge:'water-channel',feature:'river'},
 minna:{arch:'granite-modern',road:'rocky-link',roof:'#A9A18A',kerb:'#C5C5B0',mark:'#E4D8B0',edge:'rock',feature:'granite'},
 dutse:{arch:'rock-city',road:'rock-pass',roof:'#A79A7D',kerb:'#C7BDA3',mark:'#E5D9B4',edge:'rock',feature:'hill'},
 gusau:{arch:'northern-trade',road:'trade-gate',roof:'#B69A70',kerb:'#D2C19D',mark:'#E7D7B0',edge:'earth-shoulder',feature:'canopy'},
 kafanchan:{arch:'rail-junction',road:'rail-yard',roof:'#9D8C70',kerb:'#C3B99E',mark:'#E0D4AC',edge:'rail',feature:'rail'},
 damboa:{arch:'kanuri-compound',road:'dry-season',roof:'#C4A274',kerb:'#D7C49F',mark:'#E8D7B2',edge:'sand-shoulder',feature:'compound'},
 jos:{arch:'plateau-rock',road:'jos-switchback',roof:'#7D887A',kerb:'#C2C8BC',mark:'#E2D8B5',edge:'rock',feature:'plateau'},
 maiduguri:{arch:'sahel-gate',road:'maiduguri-dust',roof:'#B88F5C',kerb:'#D5BD96',mark:'#E8D7B0',edge:'sand-shoulder',feature:'sahel'},
 anambra:{arch:'market-arcade',road:'anambra-market',roof:'#9A765A',kerb:'#C8B79B',mark:'#F0C75B',edge:'loading-bay',feature:'market-arcade'},
 adoekiti:{arch:'ekiti-spring',road:'ekiti-hills',roof:'#6F8665',kerb:'#C1CEB7',mark:'#E1D7AA',edge:'green-strip',feature:'spring'},
 abakaliki:{arch:'rice-granary',road:'rice-fields',roof:'#A6A27B',kerb:'#C8C6A6',mark:'#E1D9AF',edge:'earth-shoulder',feature:'granary'},
 abia:{arch:'industrial-market',road:'aba-factory',roof:'#8A6A58',kerb:'#C2A58A',mark:'#F1C75D',edge:'loading-bay',feature:'factory'},
 bayelsa:{arch:'delta-stilt',road:'mangrove-boardwalk',roof:'#5E7E77',kerb:'#A9C4BA',mark:'#DCE7D6',edge:'water-channel',feature:'stilt'},
 jigawa:{arch:'sahel-courtyard',road:'jigawa-courtyard',roof:'#C0A071',kerb:'#D8C49D',mark:'#E7D8B3',edge:'sand-shoulder',feature:'courtyard'},
 kebbi:{arch:'fishing-granary',road:'kebbi-river',roof:'#A89A72',kerb:'#C9C6A7',mark:'#D9E1C7',edge:'water-channel',feature:'fishing'},
 kogi:{arch:'confluence-terrace',road:'kogi-riverbend',roof:'#8D927D',kerb:'#C1C5B4',mark:'#D8E0C9',edge:'water-channel',feature:'confluence'},
 nasarawa:{arch:'middlebelt-court',road:'nasarawa-link',roof:'#9C9A7C',kerb:'#C7C2A6',mark:'#E1D6AE',edge:'earth-shoulder',feature:'court'},
 osun:{arch:'grove-sculpture',road:'osun-grove',roof:'#70865A',kerb:'#C0C8A7',mark:'#E2D6A3',edge:'rooted',feature:'grove'},
 taraba:{arch:'mambilla-stilt',road:'taraba-highland',roof:'#71886C',kerb:'#B9C8B3',mark:'#DFDDB8',edge:'stone-drain',feature:'highland'},
 yobe:{arch:'kanuri-sahel',road:'yobe-dryland',roof:'#C3A071',kerb:'#D8C49E',mark:'#E8D9B5',edge:'sand-shoulder',feature:'sahel'},
 zamfara:{arch:'northern-craft',road:'zamfara-trade',roof:'#B89A6D',kerb:'#D1BE98',mark:'#E5D4AE',edge:'earth-shoulder',feature:'craft'}
};
function cityKit(key){return CITY_ARCH_ROAD[key]||{arch:'local-'+key,road:'local-'+key,roof:'#8A8172',kerb:'#B9B2A4',mark:'#E2D1A0',edge:'local',feature:'local'};}
function addArchitectureDetail(key,x,z,w,h,d,color,xb){
 const A=cityKit(key),edge=A.roof,trim=A.kerb;
 // A different structural silhouette per location, not a tint-only variation.
 switch(A.arch){
 case 'balcony': for(let y=5;y<h-3;y+=5)for(const side of [-1,1])xb(w+.8,.35,.65,trim,x,y,z+side*(d/2+.15)); break;
 case 'glass-tower':
   for(let y=5;y<h-3;y+=6) xb(w+.35,.22,d+.35,trim,x,y,z);
   for(const side of [-1,1]){xb(.28,h,.28,edge,x+side*(w/2-.45),h/2,z+d/2);xb(.28,h,.28,edge,x+side*(w/2-.45),h/2,z-d/2);}
   xb(w*.72,.55,d*.72,'#D7F4F8',x,h+.28,z); xb(w*.48,1.2,d*.48,'#10C8DC',x,h+1.1,z); break;
 case 'monument': xb(w+2,.8,d+2,trim,x,h+.4,z); xb(w*.72,.7,d*.72,edge,x,h+1.1,z); break;
 case 'adobe': for(let side of [-1,1])xb(.8,h*.72,d+.8,trim,x+side*(w/2-.8),h*.48,z); xb(w+1,1.1,d+1,edge,x,h+.55,z); break;
 case 'industrial': for(let side of [-1,1]){xb(.45,h,.45,edge,x+side*(w/2-.5),h/2,z-d/2);xb(.45,h,.45,edge,x+side*(w/2-.5),h/2,z+d/2);} xb(w+1,.4,.5,trim,x,h*.72,z); break;
 case 'terrace': xb(w+1,.7,d+1,edge,x,h+.35,z); xb(w*.72,.5,d*.7,trim,x,h+.95,z); break;
 case 'rail': xb(w+1,.7,d+1,trim,x,h+.35,z); for(let i=-1;i<=1;i++)xb(.25,h*.45,.25,edge,x+i*w*.25,h*.72,z+d/2); break;
 case 'coal': xb(w+1,.7,d+1,edge,x,h+.35,z); xb(w*.7,.35,d*.7,trim,x,h+.85,z); break;
 case 'bronze': for(let side of [-1,1])xb(1.1,h*.8,1.1,edge,x+side*(w/2-.6),h*.4,z+d/2); xb(w+1,.6,d+1,trim,x,h+.3,z); break;
 case 'verandah': xb(w+1,.5,d+2,trim,x,h*.7,z+d/2); for(let i=-1;i<=1;i++)xb(.3,h*.68,.3,edge,x+i*w*.28,h*.34,z+d/2); break;
 case 'pavilion': xb(w+2,.5,d+2,edge,x,h+.25,z); xb(w*.75,.45,d*.75,trim,x,h+.8,z); break;
 case 'workshop': for(let i=-1;i<=1;i++)xb(.5,h*.8,.5,edge,x+i*w*.28,h*.4,z-d/2); xb(w+1,.45,d+1,trim,x,h+.22,z); break;
 case 'compound': xb(w+1,1.2,d+1,trim,x,h+.6,z); xb(w*.5,.5,d*.5,edge,x,h+1.45,z); break;
 case 'civic-tower': xb(w*.7,Math.max(3,h*.35),d*.7,trim,x,h+Math.max(2,h*.18),z); break;
 case 'market-stack': for(let y=3;y<h-1;y+=3)xb(w+1,.3,d+1,edge,x,y,z); break;
 case 'riverfront': xb(w+1,.6,d+1,trim,x,h+.3,z); xb(w*.8,.4,d*.8,edge,x,h+.8,z); break;
 case 'modern-lowrise': xb(w+1,.4,d+1,trim,x,h+.2,z); for(let y=3;y<h-2;y+=4)xb(w+.3,.2,.3,edge,x,y,z+d/2); break;
 case 'raffia': for(let side of [-1,1])xb(.6,h*.8,.6,edge,x+side*(w/2-.4),h*.4,z); xb(w+1,.5,d+1,trim,x,h+.25,z); break;
 case 'stilt': for(let sx of [-1,1])for(let sz of [-1,1])xb(.35,h*.5,.35,edge,x+sx*w*.35,h*.25,z+sz*d*.35); xb(w+1,.4,d+1,trim,x,h*.5,z); break;
 case 'oil-yard': xb(w+1,.7,d+1,edge,x,h+.35,z); for(let i=-1;i<=1;i++)xb(.25,h*.9,.25,trim,x+i*w*.25,h*.45,z); break;
 case 'river-market': xb(w+1,.6,d+1,trim,x,h+.3,z); xb(w*.6,.4,d*.6,edge,x,h+.8,z); break;
 case 'emirate': for(let side of [-1,1]){const dome=new THREE.Mesh(new THREE.SphereGeometry(Math.max(1,Math.min(w,d)*.13),8,6,0,Math.PI*2,0,Math.PI/2),lam(edge));dome.position.set(x+side*w*.28,h,z);cityGroup.add(dome);} break;
 case 'hill-roof': xb(w+1,.5,d+1,edge,x,h+.25,z); xb(w*.55,.4,d*.55,trim,x,h+.7,z); break;
 case 'spring-court': xb(w+1,.5,d+1,trim,x,h+.25,z); xb(w*.65,.4,d*.65,edge,x,h+.7,z); break;
 case 'sculpture': for(let side of [-1,1]){const s=new THREE.Mesh(new THREE.ConeGeometry(1.1,h*.35,5),lam(edge));s.position.set(x+side*w*.32,h*.75,z+d/2);cityGroup.add(s);} break;
 case 'granite': for(let side of [-1,1])xb(1.5,h*.85,1.5,edge,x+side*w*.34,h*.42,z); break;
 case 'confluence': xb(w+1,.6,d+1,trim,x,h+.3,z); xb(w*.65,.5,d*.65,edge,x,h+.85,z); break;
 case 'savanna-compound': xb(w+1,.8,d+1,edge,x,h+.4,z); break;
 case 'yankari-lodge': xb(w+1,.6,d+1,trim,x,h+.3,z); for(let side of [-1,1])xb(.4,h*.65,.4,edge,x+side*w*.35,h*.32,z); break;
 case 'escarpment': xb(w+1,.6,d+1,edge,x,h+.3,z); xb(w*.65,.45,d*.65,trim,x,h+.8,z); break;
 case 'sahel-court': xb(w+1,1.1,d+1,trim,x,h+.55,z); break;
 case 'mambilla': xb(w+1,.5,d+1,edge,x,h+.25,z); for(let i=-1;i<=1;i++)xb(.3,h*.7,.3,trim,x+i*w*.25,h*.35,z+d/2); break;
 case 'adamawa': xb(w+1,.6,d+1,trim,x,h+.3,z); xb(w*.7,.5,d*.7,edge,x,h+.85,z); break;
 case 'sultanate': for(let side of [-1,1]){const dome=new THREE.Mesh(new THREE.SphereGeometry(Math.max(1,Math.min(w,d)*.16),10,7,0,Math.PI*2,0,Math.PI/2),lam(edge));dome.position.set(x+side*w*.25,h,z);cityGroup.add(dome);} break;
 case 'minaret': xb(w*.35,h*.35,d*.35,edge,x,h+h*.15,z); break;
 case 'river-courtyard': xb(w+1,.6,d+1,trim,x,h+.3,z); xb(w*.55,.4,d*.55,edge,x,h+.8,z); break;
 case 'granite-modern': xb(w+1,.5,d+1,trim,x,h+.25,z); for(let i=-1;i<=1;i++)xb(.35,h*.85,.35,edge,x+i*w*.25,h*.42,z); break;
 case 'rock-city': for(let side of [-1,1])xb(1.1,h*.9,1.1,edge,x+side*w*.34,h*.45,z); break;
 case 'northern-trade': xb(w+1,.8,d+1,trim,x,h+.4,z); break;
 case 'rail-junction': xb(w+1,.5,d+1,edge,x,h+.25,z); for(let i=-1;i<=1;i++)xb(.3,h*.7,.3,trim,x+i*w*.25,h*.35,z+d/2); break;
 case 'kanuri-compound': xb(w+1,1,d+1,trim,x,h+.5,z); break;
 case 'plateau-rock': for(let side of [-1,1]){const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(Math.max(1,Math.min(w,d)*.15),0),lam(edge));rock.position.set(x+side*w*.32,h+.7,z+d/2);rock.scale.y=1.7;cityGroup.add(rock);} break;
 case 'sahel-gate': xb(w+1,1.2,d+1,trim,x,h+.6,z); xb(w*.45,h*.25,d*.45,edge,x,h+h*.12,z); break;
 case 'market-arcade': for(let i=-1;i<=1;i++){const arch=new THREE.Mesh(new THREE.TorusGeometry(Math.max(1,w*.12),.28,5,12,Math.PI),lam(edge));arch.position.set(x+i*w*.28,h*.42,z+d/2);cityGroup.add(arch);} break;
 case 'ekiti-spring': xb(w+1,.45,d+1,trim,x,h+.22,z); for(let i=-1;i<=1;i++)xb(.35,h*.55,.35,edge,x+i*w*.27,h*.28,z+d/2); break;
 case 'rice-granary': for(let side of [-1,1]){const g=new THREE.Mesh(new THREE.CylinderGeometry(Math.min(w,d)*.13,Math.min(w,d)*.16,h*.75,8),lam(edge));g.position.set(x+side*w*.28,h*.38,z+d/2);cityGroup.add(g);} break;
 case 'industrial-market': xb(w+1,.55,d+1,trim,x,h+.27,z); for(let i=-1;i<=1;i++)xb(.25,h*.8,.25,edge,x+i*w*.25,h*.4,z+d/2); break;
 case 'delta-stilt': for(let side of [-1,1])for(let front of [-1,1])xb(.3,h*.55,.3,edge,x+side*w*.32,h*.27,z+front*d*.32); xb(w+1,.4,d+1,trim,x,h*.55,z); break;
 case 'sahel-courtyard': xb(w+1,1.2,d+1,trim,x,h+.6,z); xb(w*.6,.5,d*.6,edge,x,h+1.45,z); break;
 case 'fishing-granary': for(let i=-1;i<=1;i++)xb(.3,h*.7,.3,edge,x+i*w*.25,h*.35,z+d/2); xb(w+1,.4,d+1,trim,x,h+.2,z); break;
 case 'confluence-terrace': xb(w+1,.5,d+1,trim,x,h+.25,z); xb(w*.8,.45,d*.8,edge,x,h+.75,z); break;
 case 'middlebelt-court': xb(w+1,.8,d+1,trim,x,h+.4,z); for(let side of [-1,1])xb(.45,h*.65,.45,edge,x+side*w*.35,h*.32,z); break;
 case 'grove-sculpture': for(let side of [-1,1]){const s=new THREE.Mesh(new THREE.TorusKnotGeometry(.8,.22,32,5),lam(edge));s.position.set(x+side*w*.28,h*.72,z+d/2);s.scale.set(1,1.2,1);cityGroup.add(s);} break;
 case 'mambilla-stilt': for(let side of [-1,1])for(let front of [-1,1])xb(.3,h*.5,.3,edge,x+side*w*.3,h*.25,z+front*d*.3); xb(w+1,.5,d+1,trim,x,h+.25,z); break;
 case 'kanuri-sahel': xb(w+1,1.3,d+1,trim,x,h+.65,z); for(let side of [-1,1])xb(.7,h*.8,.7,edge,x+side*w*.38,h*.4,z+d/2); break;
 case 'northern-craft': xb(w+1,.6,d+1,trim,x,h+.3,z); for(let i=-2;i<=2;i++)xb(.35,h*.6,.35,edge,x+i*w*.17,h*.3,z+d/2); break;
 default: xb(w+1,.5,d+1,trim,x,h+.25,z); xb(w*.6,.4,d*.6,edge,x,h+.75,z);
 }
}
function addBuilding(x,z,w,d,style,color,cx,cz,ox,oz){
  let h;
  if(curCity==='lagos'&&style==='glass') h=(Math.abs(cx)<145&&Math.abs(cz)<145)?rr(118,168):rr(58,96);
  else if(curCity==='lagos'&&style==='admin') h=rr(30,54);
  else if(curCity==='lagos'&&style==='flat') h=rr(22,38);
  else if(style==='zinc') h=rr(6,9); else if(style==='banco') h=rr(7,13); else if(style==='glass') h=rr(30,46); else if(style==='admin') h=rr(12,18); else h=rr(14,30);
  if(curCity==='lagos'&&special.some(sp=>Math.abs(sp.x-x)<w/2+5&&Math.abs(sp.z-z)<d/2+5)) return;
  const mats=[],vv=Math.floor(RN()*3),tex=FACT[style][vv],th=FAC_TH[style];
  const geo=new THREE.BoxGeometry(w,h,d),uv=geo.attributes.uv,rxd=Math.max(1,Math.round(d/10)),rxw=Math.max(1,Math.round(w/10)),ry=Math.max(1,Math.round(h/th));
  for(let i=0;i<uv.count;i++){ const f=Math.floor(i/4),rx=(f===0||f===1)?rxd:rxw; if(f===2||f===3) uv.setXY(i,uv.getX(i)*rxw,uv.getY(i)*rxd); else uv.setXY(i,uv.getX(i)*rx,uv.getY(i)*ry); }
  const side=lam(style==='glass'?(curCity==='lagos'?pk(['#7CC9DF','#A5DDE9','#5AAFCB','#D6EDF2','#8ABCCF']):'#86aac6'):color,{map:tex,transparent:true});
  const roof=lam(new THREE.Color(color).lerp(new THREE.Color(LKC.roof),.55).multiplyScalar(.85),{map:LKT.roofC,transparent:true}); mats.push(side,roof);
  const m=new THREE.Mesh(geo,[side,side,roof,roof,side,side]); m.position.set(x,h/2,z); m.userData.nomerge=true; cityGroup.add(m);
  const xb=(bw,bh,bd,c,px,py,pz)=>{ const mt=lam(c,{transparent:true}); mats.push(mt); const b=new THREE.Mesh(new THREE.BoxGeometry(bw,bh,bd),mt); b.position.set(px,py,pz); b.userData.nomerge=true; cityGroup.add(b); return b; };
  if(style==='zinc'){
    const long=w>=d,L=long?w:d,Wd=long?d:w,rh=rr(2.4,3.6),sy=rh/1.5;
    const rm=lam(pk(CITIES[curCity].zinc||ZINC),{map:LKT.zroof,transparent:true}); mats.push(rm);
    const rf=new THREE.Mesh(GABLE,rm); rf.userData.nomerge=true; rf.scale.set(L+1.4,sy,(Wd+1.6)/1.732); rf.position.set(x,h+.5*sy,z); rf.rotation.y=long?0:Math.PI/2; cityGroup.add(rf);
    if(RN()<.5) DX.stand.push({x:x+rr(-w/4,w/4),y:h+rh+.4,z:z,sx:.5,sy:.8,sz:.5});
  }
  else if(style==='flat'){
    xb(w+.4,.9,d+.4,'#6f7075',x,h+.45,z); xb(2.2,2.4,2.2,'#1f2124',x+rr(-w/3,w/3),h+2.1,z+rr(-d/3,d/3));
    if(RN()<.5){ const tx=x+rr(-w/3,w/3),tz=z+rr(-d/3,d/3); DX.stand.push({x:tx,y:h+1.5,z:tz,sx:2.6,sy:1.2,sz:2.6}); DX.tank.push({x:tx,y:h+2.9,z:tz,sx:1.5,sy:2.6,sz:1.5}); }
    if(RN()<.35) DX.dish.push({x:x+rr(-w/3,w/3),y:h+1.6,z:z+rr(-d/3,d/3),sx:.9,sy:.4,sz:.9,rx:Math.PI,rz:.5});
    if(RN()<.22) for(let q=0;q<6;q++) DX.rebar.push({x:x+(q%2?1:-1)*(w/2-.6),y:h+2.5,z:z-d/2+.6+q*(d-1.2)/5,sx:.22,sy:5,sz:.22});
  }
  else if(style==='glass'){
    xb(w+2,1.4,d+2,'#D8E7E9',x,.7,z);
    xb(w*.72,2.2,d*.72,'#314650',x,h+1.1,z);
    if(curCity==='lagos'){
      const fin=pk(['#4E879E','#78B5CD','#D8E7E9','#10AFC2']);
      for(const side of [-1,1]){
        xb(.34,h-3,.38,fin,x+side*(w/2-.7),h/2,z);
        xb(.38,h-3,.34,fin,x,h/2,z+side*(d/2-.7));
      }
      for(let y=9;y<h-3;y+=9){
        xb(w-.8,.22,.24,'#B9D7E1',x,y,z+d/2+.03);
        xb(w-.8,.22,.24,'#B9D7E1',x,y,z-d/2-.03);
        xb(.24,.22,d-.8,'#B9D7E1',x+w/2+.03,y,z);
        xb(.24,.22,d-.8,'#B9D7E1',x-w/2-.03,y,z);
      }
      const crownY=h+2.1,accent=pk(['#10C8DC','#F6C85F','#EAF5F7']);
      xb(w*.62,.55,d*.62,accent,x,crownY,z);
      if(h>110){
        xb(w*.28,4,d*.28,'#D8E7E9',x,h+4.1,z);
        xb(.22,7,.22,accent,x,h+8,z);
      }
    }else{ xb(.25,9,.25,'#9aa0a8',x,h+7.5,z); }
  }
  else if(style==='banco'){
    for(const sx of [-1,1])for(const sz of [-1,1]){ DX.pin.push({x:x+sx*(w/2-.8),y:h+1.4,z:z+sz*(d/2-.8),sx:1.6,sy:2.8,sz:1.6}); DX.pinCap.push({x:x+sx*(w/2-.8),y:h+3.6,z:z+sz*(d/2-.8),sx:1.1,sy:1.7,sz:1.1}); }
    for(let t=-w/2+2.8;t<w/2-2;t+=2.4) for(const sz of [-1,1]) DX.merlon.push({x:x+t,y:h+.5,z:z+sz*(d/2-.4),sx:1,sy:1,sz:.8});
    for(let t=-d/2+2.8;t<d/2-2;t+=2.4) for(const sx of [-1,1]) DX.merlon.push({x:x+sx*(w/2-.4),y:h+.5,z:z+t,sx:.8,sy:1,sz:1});
  }
  else if(style==='admin'){ xb(w+2,.6,d+2,'#e9e6df',x,h+.3,z); const fx=x+w/2-1,fz=z+d/2-1; DX.pole.push({x:fx,y:h+5.6,z:fz,sx:.2,sy:10,sz:.2}); DX.flag.push({x:fx+.1,y:h+9.6,z:fz,ry:rr(0,6)}); }
  addArchitectureDetail(curCity,x,z,w,h,d,color,xb);
  const box={x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2,y1:h+4};
  colliders.push({x0:box.x0,x1:box.x1,z0:box.z0,z1:box.z1});
  if(style!=='glass'&&RN()<.8){
    const ad=RN()<.3,sg=ad?pk(WALLADS):pk(CITIES[curCity].signs),sx=ox<0?-1:1,sz=oz<0?-1:1,sw=Math.min(ad?10:9,w-2),sh=ad?3.4:2.4,sy=style==='zinc'?3.6:(ad?6.5:5);
    if(RN()<.5) signPlane(sg,sw,sh,x+sx*(w/2+.06),sy,z,sx<0?-Math.PI/2:Math.PI/2,mats);
    else signPlane(sg,sw,sh,x,sy,z+sz*(d/2+.06),sz<0?Math.PI:0,mats);
  }
  buildings.push({mats,box,o:1});
}
function addMarket(cx,cz){
  const cols=[EMBER,YELLOW,GREEN,'#2D6FB3','#C7457E','#6a3fb5','#10C8DC'],prod=['#C8402A','#E4572E','#3f9a4a','#E7D27A','#8a5a2a','#F6B21A'],tarps=['#2D6FB3','#E4572E','#0B7A43','#c9a227'];
  const mk=(w,h,d,c,x,y,z)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c)); b.position.set(x,y,z); cityGroup.add(b); return b; };
  for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){
    if(RN()<.2) continue;
    const x=cx+a*9,z=cz+b*9,w=5,d=4;
    if(curCity==='kano'&&RN()<.28){
      const pit=new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.1,.5,14),M('#3a2a1a')); pit.position.set(x,.3,z); cityGroup.add(pit);
      const dye=new THREE.Mesh(new THREE.CylinderGeometry(1.8,1.8,.1,14),M(pk(['#1f2f6b','#1f2f6b','#7a2d2d','#c9a227']))); dye.position.set(x,.58,z); cityGroup.add(dye);
      mk(.2,5,.2,'#5a3a22',x+3,2.5,z); mk(.2,5,.2,'#5a3a22',x-3,2.5,z); mk(6.2,.2,.2,'#5a3a22',x,5,z);
      for(let q=-2;q<=2;q++) mk(.9,3,.08,pk(['#1f2f6b','#ffffff','#7a2d2d','#2D6FB3']),x+q*1.1,3.4,z);
      colliders.push({x0:x-2.4,x1:x+2.4,z0:z-2.4,z1:z+2.4}); continue;
    }
    mk(w,1.1,d,'#7a5a3c',x,.55,z);
    for(let q=0;q<4;q++) mk(1.1,.7,1.1,pk(prod),x-1.8+q*1.2,1.4,z+rr(-1,1));
    mk(.2,3.4,.2,'#444',x,2.7,z);
    if(RN()<.35) { const t=mk(w+1.4,.15,d+1.4,pk(tarps),x,4.3,z); t.rotation.z=.08; }
    else { const umb=new THREE.Mesh(new THREE.ConeGeometry(3.4,1.2,8),M(pk(cols))); umb.position.set(x,4.6,z); cityGroup.add(umb); }
    colliders.push({x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2});
  }
}
function addTree(x,z,C){
  if(RN()<(C.tree||.3)){
    const s=rr(1.5,2.1);
    DX.trunk.push({x,y:1.6*s,z,sx:s,sy:3.2*s,sz:s});
    DX.crownA.push({x,y:4.4*s,z,sx:3.2*s,sy:2.4*s,sz:3.2*s}); DX.crownB.push({x:x+1.4*s,y:5*s,z:z+.6*s,sx:2.3*s,sy:1.8*s,sz:2.3*s},{x:x-1.3*s,y:4.8*s,z:z-.8*s,sx:2.2*s,sy:1.7*s,sz:2.2*s});
    colliders.push({x0:x-.8,x1:x+.8,z0:z-.8,z1:z+.8}); return;
  }
  const n=7,off=RN()*6;
  DX.ptrunk.push({x,y:3.2,z,sx:.6,sy:6.4,sz:.6,rz:rr(-.07,.07)});
  for(let k=0;k<n;k++) DX.frond.push({x,y:6.5,z,ry:off+k*Math.PI*2/n,rz:-.45});
  colliders.push({x0:x-.7,x1:x+.7,z0:z-.7,z1:z+.7});
}
/* ---- Nigerian vehicles (1 metre = 2 units) ---- */
const WHEELG=new THREE.CylinderGeometry(1,1,1,14);
function vbox(g,w,h,d,c,x,y,z){ const m=boxm(w,h,d,c); m.position.set(x,y,z); g.add(m); return m; }
function vwheel(g,r,wd,x,y,z){ const m=new THREE.Mesh(WHEELG,M('#111214')); m.scale.set(r,wd,r); m.rotation.x=Math.PI/2; m.position.set(x,y,z); g.add(m); }
function buildSedan(color,stripe,suv){
  const g=new THREE.Group();
  const L=suv?9.6:9,W=suv?3.9:3.6,bh=suv?1.7:1.25,by=suv?2.1:1.55,wr=suv?.85:.65;
  vbox(g,L,bh,W,color,0,by,0);
  if(stripe) vbox(g,L+.04,.34,W+.04,stripe,0,by,0);
  const ch=suv?1.35:1,cy=by+bh/2+ch/2,cl=suv?6.6:4.6,cx=suv?-.6:-.5;
  vbox(g,cl,ch,W-.5,color,cx,cy,0);
  vbox(g,cl+.04,ch-.35,W-.46,'#27333d',cx,cy+.02,0);
  vbox(g,cl-.3,.12,W-.7,color,cx,cy+ch/2,0);
  for(const s of [-1,1]){
    vbox(g,.4,.5,W-.1,'#2a2a2e',s*L/2,by-bh/2+.15,0);
    for(const z of [-1,1]) vbox(g,.1,.32,.6,s>0?'#fff7d6':'#c01818',s*(L/2+.02),by+.15,z*(W/2-.55));
    vwheel(g,wr,.6,s*L*.32,wr,W/2-.1); vwheel(g,wr,.6,s*L*.32,wr,-(W/2-.1));
  }
  return g;
}
const SLOGANS=['GOD DID','NO CONDITION IS PERMANENT','OGA AT THE TOP','BLESSED','JESUS IS LORD','SHEGE','LAGOS OR NOTHING','ONE LOVE','HUSTLE & BLESSING','NO FEAR','ALHAMDULILLAH'];
const slogMats={};
function slogMat(t,bg,fg){ const k=t+bg+fg; if(slogMats[k]) return slogMats[k]; const c=document.createElement('canvas'); c.width=512; c.height=48; const g=c.getContext('2d'); g.fillStyle=bg; g.fillRect(0,0,512,48); g.fillStyle=fg; g.font='900 34px "Arial Black",Impact,sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(t,256,26,490); const tx=new THREE.Texture(c); tx.needsUpdate=true; return slogMats[k]=new THREE.MeshBasicMaterial({map:tx}); }
function buildPolice(){
  const g=buildSedan('#1f3357','#e9e9e9',true);
  vbox(g,.5,.25,1.6,'#c01818',-.6,4.5,-.6); vbox(g,.5,.25,1.6,'#2255cc',-.6,4.5,.6);
  for(const sd of [-1,1]){ const pl=new THREE.Mesh(new THREE.PlaneGeometry(4,.7),slogMat('POLICE','#1f3357','#ffffff')); pl.position.set(-.3,2.1,sd*2.0); pl.rotation.y=sd>0?0:Math.PI; g.add(pl); }
  return g;
}
function buildDanfo(body,stripe){
  const g=new THREE.Group(),L=9.6,W=3.8;
  { const sl=pk(SLOGANS),dk=stripe==='#F6B21A'; for(const sd of [-1,1]){ const pl=new THREE.Mesh(new THREE.PlaneGeometry(7.6,.6),slogMat(sl,stripe,dk?'#1B1C20':(stripe==='#1B1C20'?'#F6B21A':'#ffffff'))); pl.position.set(-.2,2.05,sd*(W/2+.04)); pl.rotation.y=sd>0?0:Math.PI; g.add(pl); } }
  vbox(g,L,2.3,W,body,0,1.95,0);
  vbox(g,L-.2,1.3,W-.1,body,0,3.75,0);
  vbox(g,L-.9,.9,W+.02,'#27333d',-.3,3.8,0);
  vbox(g,.12,.9,W-.5,'#27333d',L/2-.04,3.8,0);
  vbox(g,L+.04,.7,W+.02,stripe,0,2.05,0);
  vbox(g,L-.4,.14,W-.2,body,0,4.47,0);
  vbox(g,4.6,.55,2.8,'#3a2a1a',-.8,4.82,0);
  vbox(g,.35,.7,W-.1,'#9aa0a8',L/2+.05,1.2,0);
  vbox(g,.35,.7,W-.1,'#9aa0a8',-L/2-.05,1.2,0);
  for(const z of [-1,1]){
    vbox(g,.1,.5,.5,'#fff7d6',L/2+.02,2.4,z*1.3); vbox(g,.1,.5,.4,'#c01818',-L/2-.02,2.4,z*1.4);
    vwheel(g,.8,.7,3.2,.8,z*(W/2-.1)); vwheel(g,.8,.7,-3.2,.8,z*(W/2-.1));
  }
  return g;
}
function buildKeke(body,roof){
  const g=new THREE.Group();
  vbox(g,4.4,.3,2.5,'#222',-.4,.95,0);
  vbox(g,.3,1.5,2.5,body,-2.4,1.75,0);
  vbox(g,1.8,.5,2.2,'#3a2a22',-1.2,1.35,0);
  vbox(g,1.9,1.5,2.3,body,1.9,1.75,0);
  vbox(g,.1,1.2,2.2,'#27333d',2.88,2.55,0);
  vbox(g,.6,.5,.9,'#222',.7,1.4,0);
  vbox(g,.1,.3,.4,'#fff7d6',2.9,1.7,0);
  for(const z of [-1.15,1.15]){ vbox(g,.12,1.7,.12,'#222',-2.3,2.45,z); vbox(g,.12,1.7,.12,'#222',1.0,2.45,z); }
  vbox(g,5.6,.16,2.7,roof,0,3.35,0);
  vwheel(g,.6,.4,2.7,.6,0); vwheel(g,.6,.4,-1.3,.6,1.35); vwheel(g,.6,.4,-1.3,.6,-1.35);
  return g;
}
function buildOkada(tank){
  const g=new THREE.Group(),shirt=pk(['#E4572E','#2D6FB3','#f2f2f2','#0B7A43','#6a3fb5','#C7457E']),skin=pk(SKINS);
  vwheel(g,.72,.3,1.55,.72,0); vwheel(g,.72,.3,-1.55,.72,0);
  vbox(g,3.1,.28,.3,'#222',0,1.35,0);
  vbox(g,1.0,.55,.7,tank,.5,1.85,0);
  vbox(g,1.5,.25,.65,'#1a1a1a',-.7,1.65,0);
  const f=vbox(g,.15,1.3,.15,'#9aa0a8',1.4,1.4,0); f.rotation.z=.3;
  vbox(g,.15,.15,1.5,'#222',1.2,2.45,0);
  vbox(g,.15,.35,.35,'#fff7d6',1.65,2.15,0);
  vbox(g,.8,.15,.8,'#333',-1.6,1.9,0);
  const t=vbox(g,.8,1.3,1.0,shirt,-.55,2.85,0); t.rotation.z=-.2;
  const h=ball(.36,skin); h.position.set(-.05,3.95,0); g.add(h);
  const hm=ball(.42,pk(['#C8402A','#F6B21A','#ffffff','#1B1C20']),1,.8,1); hm.position.set(-.05,4.1,0); g.add(hm);
  for(const z of [-1,1]){
    const a=vbox(g,1.85,.22,.22,shirt,.38,2.88,z*.55); a.rotation.z=-.47;
    vbox(g,.45,1.3,.35,'#2a2d3a',-.3,1.5,z*.5);
    vbox(g,.7,.2,.3,'#e9e9e9',.15,.95,z*.5);
  }
  return g;
}
function buildBicycle(){
  const g=new THREE.Group(),frame=pk(['#E4572E','#2D6FB3','#0B7A43','#F6B21A','#C7457E','#7C83FD']);
  const wheelMat=M('#171A1D'),rubber=new THREE.TorusGeometry(.62,.085,8,18);
  for(const x of [-1.05,1.05]){
    const w=new THREE.Mesh(rubber,wheelMat); w.rotation.y=Math.PI/2; w.position.set(x,.68,0); g.add(w);
    const hub=new THREE.Mesh(new THREE.SphereGeometry(.105,8,8),M('#AEB8C2')); hub.position.set(x,.68,0); g.add(hub);
  }
  const bar=(len,thick,x,y,z,rz,col)=>{ const m=vbox(g,len,thick,thick,col,x,y,z); m.rotation.z=rz; return m; };
  bar(1.05,.105,-.48,.95,0,-.48,frame);
  bar(.88,.105,.48,.96,0,.56,frame);
  bar(.7,.1,.02,.72,0,0,frame);
  bar(.66,.09,.92,1.3,0,.1,'#24272B');
  bar(.62,.11,-.7,1.32,0,0,'#24272B');
  vbox(g,.58,.14,.38,'#202226',-.63,1.52,0);
  const rider=vbox(g,.52,1.05,.55,pk(['#E4572E','#2D6FB3','#0B7A43','#F6B21A','#C7457E','#6a3fb5']),-.02,2.08,0); rider.rotation.z=-.22;
  const head=ball(.32,pk(SKINS)); head.position.set(.17,2.86,0); g.add(head);
  const helmet=ball(.35,pk(['#F6B21A','#E4572E','#2D6FB3','#1B1C20','#F2F2F2']),1,.72,1); helmet.position.set(.17,2.98,0); g.add(helmet);
  for(const z of [-.22,.22]){
    const leg=vbox(g,.85,.2,.18,'#242936',-.45,1.08,z); leg.rotation.z=.18;
    const arm=vbox(g,.8,.16,.16,frame,.52,2.22,z); arm.rotation.z=.18;
  }
  return g;
}
function buildTruck(cab,bed){
  const g=new THREE.Group();
  vbox(g,18,.8,4.2,'#1d1e22',0,1.7,0);
  vbox(g,4.2,3.7,4.8,cab,6.4,3.85,0);
  vbox(g,.12,1.5,4.2,'#27333d',8.52,4.9,0);
  vbox(g,2.4,1.3,4.84,'#27333d',6.2,4.95,0);
  vbox(g,.2,1.4,3.6,'#222',8.55,2.9,0);
  vbox(g,.5,.5,4.8,'#555',8.55,1.5,0);
  vbox(g,11.6,2.8,5,bed,-2.2,3.7,0);
  vbox(g,11.7,.2,5.1,'#222',-2.2,5.1,0);
  if(Math.random()<.6) vbox(g,10.6,.9,4.5,'#a88f5c',-2.2,5.5,0);
  vbox(g,.3,3.4,.3,'#9aa0a8',4.2,5.3,2.0);
  for(const z of [-2.45,2.45]){ vwheel(g,1.05,.9,6.8,1.05,z); vwheel(g,1.05,.9,-.8,1.05,z); vwheel(g,1.05,.9,-3.4,1.05,z); }
  return g;
}
function pickKind(C){ if(RN()<.13) return 'bicycle'; let t=0; C.fleet.forEach(f=>{ t+=f[1]; }); let r=RN()*t; for(const f of C.fleet){ r-=f[1]; if(r<=0) return f[0]; } return C.fleet[0][0]; }
function makeVehicle(kind,C){
  const pl=C.pal;
  if(kind==='danfo') return {m:buildDanfo(pl.danfo[0],pl.danfo[1]),hl:4.9,hw:1.95,sp:[8,12]};
  if(kind==='police') return {m:buildPolice(),hl:4.8,hw:2,sp:[10,14]};
  if(kind==='keke') return {m:buildKeke(pl.keke[0],pl.keke[1]),hl:2.8,hw:1.4,sp:[6.5,9.5]};
  if(kind==='okada') return {m:buildOkada(pk(['#C8402A','#2D6FB3','#0B7A43','#F2F2F2','#1B1C20'])),hl:2.2,hw:.9,sp:[11,16]};
  if(kind==='bicycle') return {m:buildBicycle(),hl:1.8,hw:.8,sp:[5.5,9]};
  if(kind==='truck') return {m:buildTruck(pk(['#C8402A','#2D6FB3','#E9E4DA','#0B7A43']),pk(['#E4572E','#F6B21A','#6b6f78'])),hl:9,hw:2.6,sp:[5,8]};
  if(kind==='suv') return {m:buildSedan(pk(['#2b2b30','#F2F2F2','#8a8d93']),pl.stripe,true),hl:4.8,hw:2,sp:[9,13]};
  return {m:buildSedan(pk(pl.sedan),pl.stripe,false),hl:4.5,hw:1.8,sp:[9,14]};
}
function placeCar(c){
  // Vehicle bodies are modelled lengthwise on local X: keep them parallel to X roads and rotate onto Z roads.
  if(c.axis==='x'){ c.m.position.set(c.pos,0,c.lane); c.m.rotation.y=c.dir>0?0:Math.PI; }
  else { c.m.position.set(c.lane,0,c.pos); c.m.rotation.y=c.dir>0?-Math.PI/2:Math.PI/2; }
}
function vehicleBox(c,pos){ const along=pos==null?c.pos:pos,x=c.axis==='x'?along:c.lane,z=c.axis==='x'?c.lane:along,hx=c.axis==='x'?c.hl:c.hw,hz=c.axis==='x'?c.hw:c.hl; return {x0:x-hx,x1:x+hx,z0:z-hz,z1:z+hz}; }
function boxesOverlap(a,b,pad=.35){ return a.x0<b.x1+pad&&a.x1>b.x0-pad&&a.z0<b.z1+pad&&a.z1>b.z0-pad; }
function addCar(axis,k,dir,C){ const road=roadCoord(k,axis==='x'?'z':'x'),kind=pickKind(C),v=makeVehicle(kind,C),lane=axis==='x'?road+(dir>0?2.2:-2.2):road+(dir>0?-2.2:2.2),c={m:v.m,axis,dir,lane,pos:0,speed:rr(v.sp[0],v.sp[1]),hl:v.hl,hw:v.hw,kind};
  for(let tries=0;tries<36;tries++){const candidate=rr(-225,225),box=vehicleBox(c,candidate);if(cars.every(o=>!boxesOverlap(box,vehicleBox(o)))){c.pos=candidate;break;}if(tries===35)c.pos=rr(-225,225);}
  trafficGroup.add(v.m);placeCar(c);cars.push(c);
}
function updateCars(dt){ for(const c of cars){let sp=c.speed;
  for(const o of cars){if(o===c||o.axis!==c.axis||o.lane!==c.lane||o.dir!==c.dir)continue;const gap=(o.pos-c.pos)*c.dir,free=gap-c.hl-o.hl;if(gap>0&&free<8)sp=Math.min(sp,free<3?0:o.speed*.9);}
  let next=c.pos+c.dir*sp*dt;if(next*c.dir>240)next=-240*c.dir;const box=vehicleBox(c,next);for(const o of cars){if(o!==c&&boxesOverlap(box,vehicleBox(o),.45)){sp=0;next=c.pos;break;}}c.pos=next;placeCar(c);}
}
/* ---- Nigerian street life: furniture, shops, bridges, landmarks, barks ---- */
let ringTaken=[],hawkers=[];
const ringFree=(x,z,d)=>!nearSpecial(x,z,16)&&ringTaken.every(r=>Math.hypot(r.x-x,r.z-z)>r.r+d);
function instanced(geo,mat,items,parent){
  const im=new THREE.InstancedMesh(geo,mat,items.length),mm=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),pp=new THREE.Vector3(),sc=new THREE.Vector3();
  items.forEach((it,i)=>{ e.set(it.rx||0,it.ry||0,it.rz||0); q.setFromEuler(e); pp.set(it.x,it.y,it.z); sc.set(it.sx||1,it.sy||1,it.sz||1); mm.compose(pp,q,sc); im.setMatrixAt(i,mm); });
  im.instanceMatrix.needsUpdate=true; im.frustumCulled=false; parent.add(im); return im;
}
function freeze(g){ g.traverse(o=>{ o.matrixAutoUpdate=false; o.updateMatrix(); }); }
function ringPoint(b,side,t){
  if(side===0) return {x:b.cx+t,z:b.cz-26,alongX:true};
  if(side===1) return {x:b.cx+t,z:b.cz+26,alongX:true};
  if(side===2) return {x:b.cx-26,z:b.cz+t,alongX:false};
  return {x:b.cx+26,z:b.cz+t,alongX:false};
}
function pickW(list){ let t=0; list.forEach(x=>{ t+=x[1]; }); let r=RN()*t; for(const x of list){ r-=x[1]; if(r<=0) return x[0]; } return list[0][0]; }
const TYREG=new THREE.CylinderGeometry(.75,.75,.5,12),BARRELG=new THREE.CylinderGeometry(.7,.7,1.6,10);
function addShop(pt,side,C){
  const fs=(side===0||side===2)?-1:1,kind=pickW(C.shopKinds||[['shop',1]]),col=pk(['#E4572E','#2D6FB3','#0B7A43','#F6B21A','#C7457E','#10C8DC','#7a4a2e']);
  const g=new THREE.Group(); g.position.set(pt.x,0,pt.z); if(!pt.alongX) g.rotation.y=Math.PI/2;
  const bx=(w,h,d,c,x,y,z)=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c)); m.position.set(x,y,z); g.add(m); return m; };
  const chair=(x,z,c)=>{ bx(.8,.12,.8,c,x,1.1,z); bx(.8,.8,.1,c,x,1.6,z-fs*.4); for(const a of [-.3,.3])for(const b of [-.3,.3]) bx(.1,1,.1,c,x+a,.55,z+b); };
  const sgn=(w,h,y,sg,zz)=>{ const sp=new THREE.Mesh(new THREE.PlaneGeometry(w,h),signMat(sg)); sp.position.set(0,y,fs*zz); sp.rotation.y=fs>0?0:Math.PI; g.add(sp); };
  if(kind==='kiosk'){
    const c=pk(['#F6B21A','#0B7A43','#C8402A','#2D6FB3']),fg=c==='#F6B21A'?'#1B1C20':'#ffffff';
    bx(3.8,3.6,2.8,c,0,1.8,0); bx(4.2,.3,3.4,'#444',0,3.8,0); bx(2.4,1.3,.1,'#222',0,2.2,fs*1.45); bx(2.6,.25,.9,'#5a3a22',0,1.4,fs*1.8);
    sgn(3.6,1,4.7,['RECHARGE CARDS',c,fg],1.5);
    const um=new THREE.Mesh(new THREE.ConeGeometry(2.2,.9,8),M(pk(['#E4572E','#ffffff','#10C8DC']))); um.position.set(-3.6,4,fs*2.4); g.add(um); bx(.15,3.2,.15,'#444',-3.6,2.2,fs*2.4);
    chair(2.4,fs*2.8,'#e9e9e9'); chair(-3.6,fs*3.2,'#C8402A');
  } else if(kind==='container'){
    const c=pk(['#2D6FB3','#2a7a57','#a8402a','#d98324']);
    bx(6.2,3,2.6,c,0,1.5,0); for(let i=-2;i<=2;i++) bx(.12,3,2.7,'#222',i*1.2,1.5,0);
    bx(3.2,2.2,.12,'#1c1c1c',-.6,1.4,fs*1.35); bx(5.6,.2,1.6,pk(['#E4572E','#F6B21A','#0B7A43']),0,3.2,fs*1.9);
    sgn(5.4,1.2,3.9,pk(C.signs),1.4);
  } else if(kind==='buka'){
    for(const a of [-2.8,2.8])for(const b of [-1.4,1.4]) bx(.2,3.8,.2,'#5a3a22',a,1.9,b);
    const rf=bx(6.6,.25,3.6,pk(['#8a4b2a','#6f7f8a','#7a5a45']),0,4,0); rf.rotation.x=fs*.08;
    bx(2.4,1.1,1.1,'#7a5a3c',-1.4,.55,-fs*.3); bx(2.4,1.1,1.1,'#7a5a3c',1.6,.55,-fs*.3);
    for(const a of [-2.2,-.6,1.0,2.4]) chair(a,fs*1.0,pk(['#C8402A','#ffffff','#2D6FB3']));
    const pot=new THREE.Mesh(new THREE.CylinderGeometry(.8,.7,1,10),M('#111214')); pot.position.set(-1.4,1.6,-fs*.3); g.add(pot);
    sgn(4.6,1.1,4.9,['MAMA PUT BUKA','#E4572E','#ffffff'],1.7);
  } else if(kind==='vulc'){
    bx(3.6,3,2.6,'#6b6f78',-1.6,1.5,0); bx(4,.25,3,'#333',-1.6,3.1,0);
    for(let i=0;i<7;i++){ const t=new THREE.Mesh(TYREG,M('#161719')); t.position.set(1.8,.25+(i%4)*.5,fs*(i<4?1.0:.2)); g.add(t); }
    for(let i=0;i<3;i++){ const t=new THREE.Mesh(TYREG,M('#161719')); t.position.set(2.9,.25+i*.5,fs*-.4); g.add(t); }
    sgn(3.4,1,4.1,['VULCANIZER','#F6B21A','#1B1C20'],1.4);
  } else if(kind==='police'){
    bx(3.6,3.2,2.6,'#6d7a54',-1.4,1.6,0); bx(4,.25,3,'#333',-1.4,3.3,0);
    for(let i=0;i<3;i++){ const b=new THREE.Mesh(BARRELG,M(i%2?'#ffffff':'#C8402A')); b.position.set(1.8+i*1.5,.8,fs*1.2); g.add(b); }
    bx(5,.12,.12,'#ffffff',2.9,1.6,fs*1.2);
    sgn(3.2,1,4.1,['POLICE','#1f3357','#ffffff'],1.4);
  } else {
    bx(6,4.4,3,col,0,2.2,0); bx(2.6,3,.1,'#222',-1,1.6,fs*1.55); bx(6.4,.2,3.6,'#555',0,4.5,0); bx(6.1,.55,3.05,'#1B1C20',0,.3,0);
    bx(1.8,2.6,.08,'#8a8f94',1.7,1.5,fs*1.55); const aw=bx(6,.15,1.6,pk(['#E4572E','#F6B21A','#2D6FB3']),0,3.8,fs*2.2); aw.rotation.x=-fs*.2;
    sgn(5.6,1.4,5.4,pk(C.signs),1.7);
  }
  cityGroup.add(g);
  colliders.push(pt.alongX?{x0:pt.x-3.4,x1:pt.x+3.4,z0:pt.z-1.9,z1:pt.z+1.9}:{x0:pt.x-1.9,x1:pt.x+1.9,z0:pt.z-3.4,z1:pt.z+3.4});
}
function addBusStop(pt,side){
  const fs=(side===0||side===2)?-1:1;
  const g=new THREE.Group(); g.position.set(pt.x,0,pt.z); if(!pt.alongX) g.rotation.y=Math.PI/2;
  const bx=(w,h,d,c,x,y,z)=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lam(c)); m.position.set(x,y,z); g.add(m); return m; };
  bx(7,.3,3,'#0897A8',0,5.2,0);
  for(const sx of [-3.2,3.2])for(const sz of [-1.3,1.3]) bx(.2,5,.2,'#444',sx,2.5,sz);
  bx(5,.5,1.2,'#7a4a2e',0,1.2,-fs*.8);
  const sm=signMat(['BUS STOP','#F6B21A','#1B1C20']),sp=new THREE.Mesh(new THREE.PlaneGeometry(4,1.1),sm); sp.position.set(0,6.1,fs*1.4); sp.rotation.y=fs>0?0:Math.PI; g.add(sp);
  cityGroup.add(g);
  colliders.push(pt.alongX?{x0:pt.x-3.6,x1:pt.x+3.6,z0:pt.z-1.7,z1:pt.z+1.7}:{x0:pt.x-1.7,x1:pt.x+1.7,z0:pt.z-3.6,z1:pt.z+3.6});
}
function addHawker(pt,side){
  const g=buildPerson(Object.assign({},pk(LOOKSC),{skin:pk(SKINS)}));
  g.position.set(pt.x,.05,pt.z); g.rotation.y=[Math.PI,0,-Math.PI/2,Math.PI/2][side]; animatePerson(g,0,0,0);
  const tray=new THREE.Mesh(new THREE.BoxGeometry(1.8,.2,1.3),lam('#8a6a48')); tray.position.set(0,2.5,.9); g.add(tray);
  for(let i=0;i<4;i++){ const it=new THREE.Mesh(new THREE.BoxGeometry(.5,.6,.5),lam(pk(['#2D6FB3','#E4572E','#F6B21A','#0B7A43']))); it.position.set(-.6+i*.4,2.9,.9); g.add(it); }
  cityGroup.add(g); hawkers.push({x:pt.x,z:pt.z});
}
function footbridge(rx,z){
  const col='#3f5870';
  const m=(w,h,d,c,x,y,zz)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lam(c)); b.position.set(x,y,zz); cityGroup.add(b); return b; };
  m(24,.5,3.6,col,rx,9.5,z); m(24,1.2,.15,'#9aa0a8',rx,10.4,z-1.7); m(24,1.2,.15,'#9aa0a8',rx,10.4,z+1.7);
  for(const sg of [-1,1]){
    const px=rx+sg*9.5;
    m(1.8,9.5,3.4,col,px,4.75,z); colliders.push({x0:px-.9,x1:px+.9,z0:z-1.7,z1:z+1.7});
    const ramp=m(3,.4,11.5,col,px,4.8,z+6.4); ramp.rotation.x=Math.atan2(9.5,11);
    colliders.push({x0:px-1.5,x1:px+1.5,z0:z+1,z1:z+12});
    ringTaken.push({x:px,z:z+5,r:10});
  }
}
function landmark(type,cx,cz){
  const add=(geo,c,x,y,z)=>{ const m=new THREE.Mesh(geo,lam(c)); m.position.set(x,y,z); cityGroup.add(m); return m; };
  let name='',top=24;
  if(type==='flare'){
    add(new THREE.CylinderGeometry(.8,1.4,70,8),'#4b4f55',cx,35,cz);
    const f=new THREE.Mesh(new THREE.SphereGeometry(2.2,10,8),new THREE.MeshBasicMaterial({color:0xffa030})); f.position.set(cx,72,cz); f.scale.set(1,1.8,1); cityGroup.add(f);
    return;
  }
  if(type==='theatre'){
    add(new THREE.CylinderGeometry(17,19,10,28),'#c9cfd4',cx,5,cz); add(new THREE.CylinderGeometry(23,23,2,28),'#aeb6bd',cx,11,cz); add(new THREE.ConeGeometry(21,6,28),'#b8c0c7',cx,15,cz);
    for(let a=0;a<12;a++){ const ang=a/12*Math.PI*2; add(new THREE.BoxGeometry(1.2,10,1.2),'#e9ecef',cx+Math.cos(ang)*19.5,5,cz+Math.sin(ang)*19.5); }
    name='Arts Theatre'; top=22;
  } else if(type==='mosque'){
    const kano=curCity==='kano',wall=kano?'#d8c3a0':'#efece4',dome=kano?'#1c8f5a':'#d6a93a';
    add(new THREE.BoxGeometry(40,10,40),wall,cx,5,cz); add(new THREE.CylinderGeometry(9,10,5,24),wall,cx,12.5,cz);
    const dm=new THREE.Mesh(new THREE.SphereGeometry(10,24,12,0,Math.PI*2,0,Math.PI/2),lam(dome)); dm.position.set(cx,15,cz); cityGroup.add(dm);
    for(const sx of [-1,1])for(const sz of [-1,1]){ add(new THREE.CylinderGeometry(1.3,1.6,38,10),'#f3f0e8',cx+sx*18,19,cz+sz*18); add(new THREE.ConeGeometry(1.8,4,10),'#d6a93a',cx+sx*18,40,cz+sz*18); }
    name=kano?'Central Mosque':'Grand Mosque'; top=40;
  } else {
    add(new THREE.BoxGeometry(24,13,38),'#efe6d2',cx,6.5,cz);
    const rf=add(new THREE.ConeGeometry(1,1,4),'#7a3b2e',cx,16,cz); rf.rotation.y=Math.PI/4; rf.scale.set(24*.74,7,38*.74);
    add(new THREE.BoxGeometry(6,28,6),'#efe6d2',cx,14,cz-19);
    const sp=add(new THREE.ConeGeometry(4,9,4),'#7a3b2e',cx,32.5,cz-19); sp.rotation.y=Math.PI/4;
    add(new THREE.BoxGeometry(.6,5,.6),'#F6B21A',cx,40,cz-19); add(new THREE.BoxGeometry(3,.6,.6),'#F6B21A',cx,41.2,cz-19);
    name='Grace Chapel'; top=40;
  }
  colliders.push({x0:cx-24,x1:cx+24,z0:cz-24,z1:cz+24});
  const sp=label(name); sp.position.set(cx,top+6,cz); cityGroup.add(sp);
}
function addRegionalIdentity(C,key){
  // Distinct, low-collision skyline/terrain silhouettes placed on the far edge
  // of the playable grid so each capital reads differently from street level.
  const box=(w,h,d,color,x,y,z,rot=0)=>{
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lam(color));
    m.position.set(x,y,z);m.rotation.y=rot;cityGroup.add(m);return m;
  };
  const cyl=(r1,r2,h,color,x,y,z,segments=10)=>{
    const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),lam(color));
    m.position.set(x,y,z);cityGroup.add(m);return m;
  };
  const cone=(r,h,color,x,y,z,segments=7)=>{
    const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,segments),lam(color));
    m.position.set(x,y,z);cityGroup.add(m);return m;
  };
  const hills=(color,points)=>points.forEach(([x,z,r,h])=>cone(r,h,color,x,h*.38,z,8));
  if(key==='lagos'){
    // Lagos Island / Victoria Island skyline with the unmistakable long lagoon bridge.
    box(220,1.1,5.5,'#667B83',0,8,-218);
    for(const x of [-150,-75,0,75,150]){
      box(1.1,3,5.9,'#D2D8D6',x,10,-218);
      box(1.2,17,1.2,'#778991',x,18,-218);
    }
    [[-205,42,18],[-180,58,23],[-151,34,16],[-120,72,29],[-88,44,20],[-58,31,14]].forEach(([x,h,w],i)=>{
      box(w,h,w*.72,['#9BB5BE','#D2D5D1','#7F9CA8','#B8C8CB'][i%4],x,h/2-0.2,-190+(i%2)*13);
      for(let y=6;y<h-3;y+=5)box(w*.76,.28,w*.74,'#D9E8E9',x,y,-190+(i%2)*13);
    });
  }else if(key==='ibadan'){
    // Cocoa House and the brown-roofed, hill-spread city.
    hills('#81715F',[[-205,-215,30,38],[-165,-230,38,48],[-105,-222,28,32]]);
    box(17,74,15,'#B96F45',-195,37,-195);
    for(let y=8;y<68;y+=7)box(17.5,.8,15.5,'#E1C49A',-195,y,-195);
    const t=label('COCOA HOUSE', '#8A4B31','#FFFFFF',1.5);t.position.set(-195,81,-195);cityGroup.add(t);
  }else if(key==='kano'){
    // Earthen city-wall profile with rounded watch towers and a historic gate.
    box(210,12,5,'#B88C5D',0,6,-220);
    for(const x of [-100,-50,0,50,100]){
      cyl(6,7,18,'#CBA777',x,9,-220,8);
      cyl(7,7,2,'#9B7047',x,18,-220,8);
    }
    box(24,18,8,'#DCC39A',0,9,-220);
    box(7,9,9,'#5B4634',0,4.5,-215);
    const t=label('KANO • ANCIENT CITY', '#B88C5D','#241B13',1.5);t.position.set(0,27,-220);cityGroup.add(t);
  }else if(key==='jos'){
    hills('#777F78',[[-210,-215,28,34],[-175,-226,40,49],[-132,-218,25,30],[-90,-230,34,39]]);
    hills('#A7ADA0',[[-206,-212,18,24],[-174,-223,27,35],[-130,-215,17,22]]);
    const t=label('JOS PLATEAU', '#E8ECE4','#35443C',1.5);t.position.set(-170,55,-225);cityGroup.add(t);
  }else if(key==='enugu'){
    hills('#607766',[[-205,-218,32,34],[-164,-230,40,42],[-120,-218,28,30]]);
    // Coal-mining headframe silhouette.
    box(2,29,2,'#303B39',-190,14.5,-194);box(2,29,2,'#303B39',-169,14.5,-194);
    box(27,2,2,'#303B39',-179.5,29,-194);box(22,1.5,2,'#303B39',-179.5,20,-194);
    for(const x of [-187,-172])box(1,14,1,'#A7B5A8',x,7,-194);
    const t=label('COAL CITY', '#425E4B','#FFFFFF',1.5);t.position.set(-180,36,-194);cityGroup.add(t);
  }else if(key==='benin'){
    // Red-earth palace gate and bronze-toned sculptural pillars.
    box(44,3,5,'#8E4A36',-190,20,-205);box(6,20,6,'#A65B3D',-210,10,-205);box(6,20,6,'#A65B3D',-170,10,-205);
    for(const x of [-202,-190,-178]){cyl(1.2,1.5,13,'#B9783D',x,7,-201,8);cyl(1.8,1.8,1.2,'#D7A65B',x,14,-201,8);}
    const t=label('BENIN CITY • BRONZE HERITAGE','#B9783D','#24180F',1.45);t.position.set(-190,29,-205);cityGroup.add(t);
  }else if(key==='calabar'){
    // Historic waterfront station: deep verandah, columns and tropical palms.
    box(42,13,20,'#D8C2A3',-190,6.5,-205);box(46,1.4,24,'#6B8D83',-190,14,-205);
    box(48,1,5,'#B5A38B',-190,10,-194);
    for(const x of [-208,-196,-184,-172])box(.9,8,.9,'#F1E6D2',x,4,-194);
    for(const x of [-220,-160]){
      cyl(1,1.4,10,'#795A3C',x,5,-190,7);
      for(let a=0;a<6;a++){const fr=cone(3,8,'#287448',x+Math.cos(a*Math.PI/3)*3,12,-190+Math.sin(a*Math.PI/3)*3,5);fr.rotation.z=Math.PI/2;}
    }
    const t=label('CALABAR WATERFRONT','#3D756D','#FFFFFF',1.5);t.position.set(-190,22,-205);cityGroup.add(t);
  }else if(key==='lokoja'){
    // Two differently coloured river ribbons meet at a confluence marker.
    const river1=new THREE.Mesh(new THREE.PlaneGeometry(150,24),lam('#477F9D'));river1.rotation.x=-Math.PI/2;river1.rotation.z=-.32;river1.position.set(-172,0.12,-185);cityGroup.add(river1);
    const river2=new THREE.Mesh(new THREE.PlaneGeometry(120,19),lam('#6B9FAF'));river2.rotation.x=-Math.PI/2;river2.rotation.z=.42;river2.position.set(-170,0.15,-185);cityGroup.add(river2);
    hills('#9A9278',[[-225,-210,23,27],[-208,-232,18,23]]);
    const t=label('NIGER + BENUE CONFLUENCE','#477F9D','#FFFFFF',1.4);t.position.set(-170,18,-185);cityGroup.add(t);
  }else if(key==='abuja'){
    // Aso Rock profile and clean, monumental civic skyline.
    hills('#777F80',[[-210,-215,36,52],[-174,-225,46,66],[-128,-215,30,44]]);
    box(20,42,20,-1===0?'#FFFFFF':'#DCE3E5',-75,21,-195);
    box(26,2,26,'#FFFFFF',-75,43,-195);
    const t=label('ASO ROCK • CAPITAL CITY','#FFFFFF','#33434F',1.5);t.position.set(-170,69,-225);cityGroup.add(t);
  }else if(key==='osogbo'){
    // Sacred-grove inspired sculptural gateway and green canopy.
    box(3,22,3,'#8A6D48',-190,11,-205);box(3,22,3,'#8A6D48',-164,11,-205);box(29,3,4,'#B7C79B',-177,22,-205);
    for(const x of [-205,-190,-174,-158]){cyl(1.1,1.3,7,'#6D563A',x,3.5,-192,7);cone(5,10,'#2D7842',x,11,-192,7);}
    const t=label('OSOGBO • SACRED GROVE','#2D7842','#FFFFFF',1.4);t.position.set(-177,31,-205);cityGroup.add(t);
  }else if(key==='abeokuta'){
    hills('#8B7964',[[-210,-218,32,40],[-176,-226,45,56],[-128,-216,28,34]]);
    hills('#B8A58A',[[-209,-215,20,28],[-175,-222,27,36]]);
    const t=label('OLumo ROCK COUNTRY','#6D5A47','#FFFFFF',1.4);t.position.set(-176,61,-226);cityGroup.add(t);
  }else if(key==='maiduguri'){
    // Sahel edge: low sand-coloured compounds and a dry-season horizon.
    box(46,9,24,'#D8B784',-190,4.5,-208);box(50,1.2,28,'#B58C5D',-190,9.6,-208);
    for(const x of [-207,-190,-173]){cyl(2.4,2.8,10,'#C49B68',x,5,-205,8);cone(3,4,'#E1C59A',x,12,-205,8);}
    const t=label('MAIDUGURI • SAHEL GATE','#B58C5D','#241B13',1.4);t.position.set(-190,19,-208);cityGroup.add(t);
  }else if(key==='port-harcourt'||key==='ph'){
    // Port city silhouette: harbour cranes and a steel-framed industrial skyline.
    for(const x of [-205,-175,-145]){
      box(2,32,2,'#596F70',x,16,-205);box(26,2,2,'#7D9997',x+12,31,-205);
      box(2,12,2,'#596F70',x+23,24,-205);box(2,8,2,'#596F70',x+20,19,-205);
    }
    const t=label('PORT HARCOURT • HARBOUR CITY','#477C78','#FFFFFF',1.45);t.position.set(-175,39,-205);cityGroup.add(t);
  }else if(key==='yenagoa'||key==='warri'||key==='uyo'||key==='ikot-ekpene'){
    // Niger Delta / coastal cities: raised boardwalk and dense tropical canopy.
    box(90,.7,8,'#80694D',-175,1.3,-208);
    for(let x=-215;x<=-135;x+=16){box(.7,2,.7,'#725C42',x,1,-208);cyl(1,1.3,9,'#775B3C',x,4,-198,7);for(let a=0;a<5;a++)cone(3.5,7,'#287447',x+Math.cos(a*1.25)*2.5,9,-198+Math.sin(a*1.25)*2.5,5);}
    const t=label(C.name.toUpperCase()+' • COASTAL LOWLAND','#36775A','#FFFFFF',1.35);t.position.set(-175,18,-208);cityGroup.add(t);
  }else if(key==='makurdi'||key==='lafia'||key==='minna'||key==='kafanchan'){
    // Middle Belt terrain: low layered ridges and a broad open horizon.
    hills('#78866C',[[-215,-218,26,28],[-180,-229,34,37],[-142,-218,24,25]]);
    hills('#A5A58B',[[-212,-216,16,20],[-178,-226,21,25]]);
    const t=label(C.name.toUpperCase()+' • MIDDLE BELT','#687C62','#FFFFFF',1.35);t.position.set(-180,40,-228);cityGroup.add(t);
  }else if(key==='awka'||key==='onitsha'||key==='aba'){
    // Anambra / Aba commercial energy: dense market frontage and a cave-like stone arch.
    const wall=key==='aba'?'#B86C49':'#9B8C75';
    box(48,11,20,wall,-190,5.5,-208);
    for(let x=-211;x<=-169;x+=7){box(5,15,17,['#C84D35','#E4B84D','#287B65','#3E79A6'][Math.floor((x+211)/7)%4],x,7.5,-197);}
    box(26,2,4,'#D5B98C',-190,17,-207);
    const t=label(key==='aba'?'ABA • ARIARIA TRADE':key==='onitsha'?'ONITSHA • RIVER MARKET':'AWKA • IGBO HEARTLAND','#E9E3D5','#27332F',1.35);t.position.set(-190,22,-208);cityGroup.add(t);
  }else if(key==='asaba'){
    // Asaba's river crossing and Niger Bridge silhouette.
    box(160,1.4,5,'#667F89',-165,8,-207);
    for(const x of [-220,-190,-160,-130,-100]){box(1.4,15,1.4,'#D2D9D6',x,15,-207);box(18,.65,1.1,'#AEBEC0',x+9,22,-207);}
    const t=label('ASABA • NIGER BRIDGE','#527E91','#FFFFFF',1.4);t.position.set(-160,27,-207);cityGroup.add(t);
  }else if(key==='abakaliki'){
    // Ebonyi rice plains and salt-pan geometry.
    for(let i=0;i<5;i++){box(54,.28,7,i%2?'#9DAF7B':'#C5B58C',-190,0.18,-225+i*8);box(54,.12,1,'#6D9A9A',-190,.32,-221+i*8);}
    box(26,8,18,'#C7B99A',-190,4,-187);for(let x=-199;x<=-181;x+=6)box(4,8,4,'#D5C6A5',x,4,-187);
    const t=label('ABAKALIKI • RICE & SALT','#7D8B60','#FFFFFF',1.35);t.position.set(-190,15,-187);cityGroup.add(t);
  }else if(key==='owerri'||key==='umuahia'){
    // Southeast cultural pavilion with painted posts and palm canopy.
    box(38,2,26,'#8A5B3C',-190,12,-207);box(34,8,22,'#D6C3A0',-190,6,-207);
    for(const x of [-205,-193,-181,-169]){box(1.3,12,1.3,'#B65B3A',x,6,-194);box(2,1.4,1.6,'#E1B95D',x,9,-194);}
    cone(23,9,'#6B8A4A',-190,19,-207,8);
    const t=label(key==='owerri'?'OWERRI • CULTURE & CREATIVITY':'UMUAHIA • IGBO HERITAGE','#8A5B3C','#FFFFFF',1.35);t.position.set(-190,27,-207);cityGroup.add(t);
  }else if(key==='yola'){
    // Adamawa highlands: distant ridges and terraced mountain silhouettes.
    hills('#637E69',[[-220,-220,25,33],[-190,-230,36,49],[-150,-221,30,39],[-112,-232,22,30]]);
    hills('#9AA78C',[[-216,-216,15,22],[-188,-226,22,31],[-150,-217,18,25]]);
    const t=label('YOLA • ADAMAWA HIGHLANDS','#637E69','#FFFFFF',1.35);t.position.set(-180,53,-230);cityGroup.add(t);
  }else if(key==='jalingo'){
    hills('#607F62',[[-220,-218,28,37],[-186,-230,42,58],[-143,-220,29,40],[-105,-231,34,46]]);
    hills('#A6B69B',[[-216,-214,16,23],[-184,-225,26,36],[-140,-215,18,26]]);
    const t=label('JALINGO • MAMBILLA GATEWAY','#52794E','#FFFFFF',1.35);t.position.set(-180,62,-230);cityGroup.add(t);
  }else if(key==='akure'){
    hills('#7C8A70',[[-220,-218,26,35],[-185,-229,42,55],[-142,-219,29,39]]);
    hills('#B0A98C',[[-216,-214,16,23],[-183,-225,25,34]]);
    const t=label('AKURE • IDANRE HILLS COUNTRY','#687D5F','#FFFFFF',1.35);t.position.set(-183,59,-229);cityGroup.add(t);
  }else if(key==='ado-ekiti'){
    hills('#66815E',[[-218,-220,24,33],[-185,-231,38,49],[-146,-219,26,34]]);
    const pool=new THREE.Mesh(new THREE.CircleGeometry(9,20),lam('#6AA7A4'));pool.rotation.x=-Math.PI/2;pool.position.set(-145,.2,-195);cityGroup.add(pool);
    const t=label('ADO-EKITI • HILLS & SPRINGS','#557C50','#FFFFFF',1.35);t.position.set(-183,53,-231);cityGroup.add(t);
  }else if(key==='katsina'){
    box(24,15,20,'#D9C29B',-190,7.5,-208);
    box(7,24,7,'#C6A579',-190,19,-208);
    for(let y=8;y<28;y+=5)box(8,.8,8,'#E8D6B3',-190,y,-208);
    cone(5,5,'#A57D4F',-190,33,-208,8);
    const t=label('KATSINA • GOBARAU MINARET','#A57D4F','#FFFFFF',1.35);t.position.set(-190,38,-208);cityGroup.add(t);
  }else if(key==='sokoto'){
    box(44,13,26,'#D8C39B',-190,6.5,-208);box(48,1.2,30,'#B79A6C',-190,13.5,-208);
    for(const x of [-207,-190,-173]){cyl(2,2.5,22,'#D8C39B',x,11,-205,8);cone(3.2,4,'#B99A6D',x,24,-205,8);}
    const t=label('SOKOTO • SULTANATE HERITAGE','#A88A5F','#FFFFFF',1.35);t.position.set(-190,31,-208);cityGroup.add(t);
  }else if(key==='ilorin'){
    box(42,12,24,'#D5C29F',-190,6,-208);box(44,1,27,'#BBA274',-190,12.5,-208);
    for(const x of [-205,-190,-175]){cyl(2,2.2,18,'#E3D5B9',x,9,-205,8);const dome=new THREE.Mesh(new THREE.SphereGeometry(3,10,8,0,Math.PI*2,0,Math.PI/2),lam('#B79A6A'));dome.position.set(x,18,-205);cityGroup.add(dome);}
    const t=label('ILORIN • EMIRATE CITY','#8C795C','#FFFFFF',1.35);t.position.set(-190,25,-208);cityGroup.add(t);
  }else if(key==='bauchi'){
    hills('#A28B68',[[-218,-220,25,31],[-185,-230,37,45],[-145,-220,27,32]]);
    box(34,5,20,'#8A9A66',-190,2.5,-192);for(const x of [-202,-188,-174])cone(3,6,'#A6B87A',x,7,-192,7);
    const t=label('BAUCHI • YANKARI COUNTRY','#758957','#FFFFFF',1.35);t.position.set(-185,50,-230);cityGroup.add(t);
  }else if(key==='gombe'){
    hills('#9B9676',[[-218,-220,24,30],[-185,-230,36,45],[-145,-220,25,32]]);
    hills('#C2B596',[[-215,-216,14,19],[-183,-226,22,28]]);
    const t=label('GOMBE • SAVANNAH HILLS','#8B835F','#FFFFFF',1.35);t.position.set(-185,48,-230);cityGroup.add(t);
  }else if(key==='dutse'){
    hills('#9A8A6C',[[-218,-220,24,30],[-185,-230,34,42],[-146,-220,24,30]]);
    const t=label('DUTSE • GRANITE COUNTRY','#887858','#FFFFFF',1.35);t.position.set(-185,47,-230);cityGroup.add(t);
  }else if(key==='gusau'){
    box(46,10,22,'#C9AD7D',-190,5,-208);box(50,1.2,26,'#9A835F',-190,10.5,-208);
    for(const x of [-207,-190,-173]){box(6,4,6,'#7D6A4E',x,2,-193);cone(3,5,'#B6A06F',x,6.5,-193,7);}
    const t=label('GUSAU • NORTHERN TRADE','#8D7754','#FFFFFF',1.35);t.position.set(-190,19,-208);cityGroup.add(t);
  }else if(key==='birnin-kebbi'){
    const river=new THREE.Mesh(new THREE.PlaneGeometry(130,22),lam('#5B8FA0'));river.rotation.x=-Math.PI/2;river.rotation.z=.18;river.position.set(-175,.15,-207);cityGroup.add(river);
    box(44,7,22,'#D3BD96',-190,3.5,-190);
    const t=label('BIRNIN KEBBI • RIVER & FISHING','#4F8190','#FFFFFF',1.3);t.position.set(-175,13,-207);cityGroup.add(t);
  }else{
    // Remaining capitals retain a named civic silhouette; never leave an empty,
    // interchangeable horizon when the player enters a new state.
    const family=CITY_REGION[key]||'southwest';
    const tone=family==='north'?'#B99A70':family==='coastal'?'#73968B':family==='highland'?'#8D9B8C':family==='southeast'?'#7D9C87':'#B3A58D';
    box(34,10,18,tone,-190,5,-210);
    for(const x of [-202,-190,-178])box(1.2,15,1.2,'#E3D7BE',x,7.5,-200);
    box(38,1.1,22,family==='north'?'#D5BD96':'#D1D7C8',-190,12,-210);
    const t=label(C.name.toUpperCase()+' • '+(C.tag||'LOCAL DISTRICT').toUpperCase(),'#F0EEE4','#27332F',1.25);t.position.set(-190,19,-210);cityGroup.add(t);
  }
}
function streetDetails0(C,blocks){
  ringTaken=[]; hawkers=[];
  (C.bridges||[]).forEach(b=>footbridge(b[0],b[1]));
  if(C.flare) landmark('flare',C.flare[0],C.flare[1]);
  const poles=[],arms=[],wires=[],lampsOn=[],lampsOff=[],zebra=[],holes=[],drains=[];
  for(const b of blocks){
    const cx=b.cx,cz=b.cz;
    for(const sx of [-1,1]){
      for(const sz of [-1,1]){
        const px=cx+sx*(R/2-7),pz=cz+sz*(R/2-21);
        if(nearSpecial(px,pz,10)||!ringFree(px,pz,2)) continue;
        ringTaken.push({x:px,z:pz,r:1.5});
        poles.push({x:px,y:0,z:pz}); arms.push({x:px-sx*1.1,y:13.7,z:pz,sx:2.4,sy:.25,sz:.25});
        (RN()<.65?lampsOn:lampsOff).push({x:px-sx*2.1,y:13.5,z:pz});
      }
      wires.push({x:cx+sx*(R/2-7),y:13.2,z:cz,sx:.07,sy:.07,sz:R/2-21},{x:cx+sx*(R/2-7),y:12.4,z:cz,sx:.07,sy:.07,sz:R/2-21});
    }
    drains.push({x:cx,y:.08,z:cz-(R/2-6.4),sx:R-14,sy:.16,sz:1.1},{x:cx,y:.08,z:cz+(R/2-6.4),sx:R-14,sy:.16,sz:1.1},{x:cx-(R/2-6.4),y:.08,z:cz,sx:1.1,sy:.16,sz:R-14},{x:cx+(R/2-6.4),y:.08,z:cz,sx:1.1,sy:.16,sz:R-14});
  }
  const crossingMode=CITY_LAYOUT_INDEX%4;
  for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){
    if(crossingMode===1&&Math.abs(i+j)%2===1) continue;
    if(crossingMode===2&&Math.abs(i-j)%3===1) continue;
    const offset=crossingMode===3?14.5:10.5;
    zebra.push({x:roadCoord(i,'x')+offset,y:.06,z:roadCoord(j,'z')},{x:roadCoord(i,'x')-offset,y:.06,z:roadCoord(j,'z')},{x:roadCoord(i,'x'),y:.06,z:roadCoord(j,'z')+offset,ry:Math.PI/2},{x:roadCoord(i,'x'),y:.06,z:roadCoord(j,'z')-offset,ry:Math.PI/2});
  }
  for(let q=0;q<70;q++){
    const k=Math.floor(rr(-3,4)),alongX=RN()<.5,t=rr(-200,200),off=rr(-5,5),mo=((t%R)+R)%R;
    if(mo<10||mo>R-10) continue;
    const sx=rr(.8,1.8),sz=rr(.6,1.3);
    holes.push(alongX?{x:t,y:.055,z:roadCoord(k,'z')+off,sx,sz}:{x:roadCoord(k,'x')+off,y:.055,z:t,sx,sz});
  }
  const unit=new THREE.BoxGeometry(1,1,1);
  const add=(geo,mat,items)=>{ if(items.length) instanced(geo,mat,items,cityGroup); };
  const pg=new THREE.CylinderGeometry(.22,.3,14,6); pg.translate(0,7,0);
  add(pg,lam('#7b7b78'),poles); add(unit,lam('#55555a'),arms); add(unit,lam('#0c0c0e'),wires);
  add(new THREE.BoxGeometry(1.5,.35,.7),new THREE.MeshBasicMaterial({color:0xfff2b0}),lampsOn);
  add(new THREE.BoxGeometry(1.5,.35,.7),lam('#3a3b3e'),lampsOff);
  const zc=document.createElement('canvas'); zc.width=64; zc.height=128; { const g=zc.getContext('2d'); g.fillStyle='#f2f2f2'; for(let k=0;k<6;k++) g.fillRect(0,k*21+3,64,11); }
  const zt=new THREE.Texture(zc); zt.needsUpdate=true;
  const zg=new THREE.PlaneGeometry(3.2,12); zg.rotateX(-Math.PI/2);
  add(zg,new THREE.MeshBasicMaterial({map:zt,transparent:true,depthWrite:false}),zebra);
  const hg=new THREE.CircleGeometry(1,10); hg.rotateX(-Math.PI/2); add(hg,lam('#141518'),holes);
  add(unit,lam('#2f2d29'),drains);
  /* shops, bus stops, hawkers on the sidewalks */
  for(const b of blocks){
    const n=RN()<.5?1:2;
    for(let q=0;q<n;q++){
      const side=Math.floor(RN()*4),pt=ringPoint(b,side,rr(-9,9));
      if(!ringFree(pt.x,pt.z,5)) continue;
      ringTaken.push({x:pt.x,z:pt.z,r:4}); addShop(pt,side,C);
    }
  }
  let tries=0,made=0;
  while(made<4&&tries++<120){ const b=pk(blocks),side=Math.floor(RN()*4),pt=ringPoint(b,side,rr(-8,8)); if(!ringFree(pt.x,pt.z,7)) continue; ringTaken.push({x:pt.x,z:pt.z,r:5}); addBusStop(pt,side); made++; }
  tries=0; made=0;
  while(made<48&&tries++<960){ const b=pk(blocks),side=Math.floor(RN()*4),pt=ringPoint(b,side,rr(-12,12)); if(!ringFree(pt.x,pt.z,4)) continue; ringTaken.push({x:pt.x,z:pt.z,r:2}); addHawker(pt,side); made++; }
}
function streetDetails(C,blocks){
  streetDetails0(C,blocks);
  const bumpG=new THREE.PlaneGeometry(12,1.8); bumpG.rotateX(-Math.PI/2);
  const bumps=[],pud=[];
  for(let q=0;q<(C.bump||8);q++){
    const k=Math.floor(rr(-3,4)),alongX=RN()<.5,t=rr(-200,200),mo=((t%R)+R)%R; if(mo<20||mo>R-20) continue;
    bumps.push(alongX?{x:t,y:.075,z:roadCoord(k,'z'),ry:Math.PI/2}:{x:roadCoord(k,'x'),y:.075,z:t});
  }
  if(bumps.length) instanced(bumpG,new THREE.MeshBasicMaterial({map:stripeTex(YELLOW,INK),transparent:true,depthWrite:false}),bumps,cityGroup);
  for(let q=0;q<(C.pud||0);q++){
    const k=Math.floor(rr(-3,4)),alongX=RN()<.5,t=rr(-200,200),off=rr(-5,5),mo=((t%R)+R)%R; if(mo<12||mo>R-12) continue;
    const sx=rr(1.6,3.4),sz=rr(1.2,2.4); pud.push(alongX?{x:t,y:.062,z:roadCoord(k,'z')+off,sx,sz}:{x:roadCoord(k,'x')+off,y:.062,z:t,sx,sz});
  }
  if(pud.length){ const pg=new THREE.CircleGeometry(1,14); pg.rotateX(-Math.PI/2); instanced(pg,new THREE.MeshLambertMaterial({color:'#5b6a6e',transparent:true,opacity:.6,depthWrite:false}),pud,cityGroup); }
  let tries=0,made=0;
  while(made<18&&tries++<300){ const b=pk(blocks),side=Math.floor(RN()*4),pt=ringPoint(b,side,rr(-10,10)); if(!ringFree(pt.x,pt.z,3)) continue; ringTaken.push({x:pt.x,z:pt.z,r:2.5}); const ox=pt.x+(pt.alongX?0:(side===2?-1.6:1.6)),oz=pt.z+(pt.alongX?(side===0?-1.6:1.6):0);
    DX.trash.push({x:ox,y:.5,z:oz,sx:rr(1,2),sy:rr(.5,1),sz:rr(1,2)}); DX.bag.push({x:ox+rr(-.8,.8),y:1,z:oz+rr(-.8,.8),sx:.4,sy:.35,sz:.4}); made++; }
  tries=0; made=0;
  while(made<10&&tries++<300){ const b=pk(blocks),side=Math.floor(RN()*4),pt=ringPoint(b,side,rr(-10,10)); if(!ringFree(pt.x,pt.z,3)) continue; ringTaken.push({x:pt.x,z:pt.z,r:2});
    DX.pole.push({x:pt.x,y:7,z:pt.z,sx:.2,sy:14,sz:.2}); DX.flag.push({x:pt.x+.1,y:12.6,z:pt.z,ry:rr(0,6)}); made++; }
  for(let q=0;q<12;q++){
    const k=Math.floor(rr(-3,4)),alongX=RN()<.5,t=rr(-190,190),mo=((t%R)+R)%R; if(mo<16||mo>R-16) continue;
    DX.bunt.push(alongX?{x:t,y:10.8,z:roadCoord(k,'z'),ry:Math.PI/2}:{x:roadCoord(k,'x'),y:10.8,z:t});
  }
  tries=0; made=0;
  while(made<5&&tries++<200){
    const b=pk(blocks),side=Math.floor(RN()*4),pt=ringPoint(b,side,rr(-6,6)),fs=(side===0||side===2)?-1:1;
    if(!ringFree(pt.x,pt.z,9)) continue; ringTaken.push({x:pt.x,z:pt.z,r:8});
    const g=new THREE.Group(); g.position.set(pt.x,0,pt.z); if(!pt.alongX) g.rotation.y=Math.PI/2;
    for(const a of [-5,5]){ const po=new THREE.Mesh(new THREE.BoxGeometry(.5,11,.5),M('#55555a')); po.position.set(a,5.5,0); g.add(po); }
    const bk=new THREE.Mesh(new THREE.BoxGeometry(12.4,5.8,.4),M('#2a2b2f')); bk.position.set(0,11.5,0); g.add(bk);
    const pn=new THREE.Mesh(new THREE.PlaneGeometry(12,5.4),adMat(Math.floor(RN()*ADS.length))); pn.position.set(0,11.5,fs*.23); pn.rotation.y=fs>0?0:Math.PI; g.add(pn);
    cityGroup.add(g);
    colliders.push(pt.alongX?{x0:pt.x-5.4,x1:pt.x-4.6,z0:pt.z-.5,z1:pt.z+.5}:{x0:pt.x-.5,x1:pt.x+.5,z0:pt.z-5.4,z1:pt.z-4.6},pt.alongX?{x0:pt.x+4.6,x1:pt.x+5.4,z0:pt.z-.5,z1:pt.z+.5}:{x0:pt.x-.5,x1:pt.x+.5,z0:pt.z+4.6,z1:pt.z+5.4});
    made++;
  }
  tries=0; made=0;
  while(made<(C.oka||0)&&tries++<300){
    const b=pk(blocks),side=Math.floor(RN()*4),pt=ringPoint(b,side,rr(-12,12)); if(!ringFree(pt.x,pt.z,4)) continue; ringTaken.push({x:pt.x,z:pt.z,r:3});
    const og=buildOkada(pk(['#C8402A','#2D6FB3','#0B7A43','#F2F2F2','#1B1C20'])); og.position.set(pt.x,0,pt.z); og.rotation.y=pt.alongX?(RN()<.5?0:Math.PI):Math.PI/2; cityGroup.add(og);
    colliders.push(pt.alongX?{x0:pt.x-2.2,x1:pt.x+2.2,z0:pt.z-.9,z1:pt.z+.9}:{x0:pt.x-.9,x1:pt.x+.9,z0:pt.z-2.2,z1:pt.z+2.2}); made++;
  }
}
function buildBackdrop(key){
  clearGroup(backGroup);
  const mk=(geo,c,x,y,z,sx,sy,sz,flat)=>{ const material=new THREE.MeshLambertMaterial({color:c}); material.flatShading=!!flat; const m=new THREE.Mesh(geo,material); m.position.set(x,y,z); m.scale.set(sx,sy,sz); backGroup.add(m); return m; };
  const ico=new THREE.IcosahedronGeometry(1,1),box=new THREE.BoxGeometry(1,1,1);
  const water=(w,d,x,z,c)=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshLambertMaterial({color:c})); m.rotation.x=-Math.PI/2; m.position.set(x,.01,z); backGroup.add(m); };
  if(key==='lagos'){
    water(1400,440,0,482,'#4f7a80');
    mk(box,'#8d9094',0,11,335,1000,2.4,7);
    for(let x=-480;x<=480;x+=40) mk(box,'#7b7e82',x,5.5,335,3,11,3);
    for(let i=0;i<14;i++){ const x=rr(-200,200),z=rr(268,320); mk(box,'#6b4a2a',x,.5,z,5,.8,1.6); if(i%2){ mk(box,'#7a6a3a',x+2,2.6,z+6,4,2.4,4); mk(box,'#5a4a2a',x+2,4.2,z+6,5,.4,5); } }
  } else if(key==='ph'){
    water(440,1400,482,0,'#476a55');
    for(let i=0;i<10;i++){ const z=rr(-200,200); mk(box,'#6b4a2a',rr(270,330),.5,z,1.6,.8,5); }
    for(let i=0;i<5;i++) mk(new THREE.CylinderGeometry(1,1,1,16),'#d8dad8',-290,8,-120+i*28,12,16,12);
  } else if(key==='abuja'){
    mk(ico,'#8f8a80',30,22,-300,110,75,60,true); mk(ico,'#9b968b',-45,14,-295,60,48,42,true); mk(ico,'#86817a',300,12,150,48,40,40,true);
  } else if(key==='calabar'){
    water(1400,440,0,482,'#4a7a78');
    for(let i=0;i<10;i++) mk(box,'#6b4a2a',rr(-200,200),.5,rr(268,320),5,.8,1.6);
  } else if(key==='enugu'||key==='ibadan'||key==='kaduna'){
    const hc=key==='enugu'?'#6f8a5a':(key==='ibadan'?'#7d8a5c':'#a08e72');
    mk(ico,hc,-300,20,-60,90,40,70,true); mk(ico,hc,290,16,120,80,34,60,true); mk(ico,hc,60,18,-310,100,38,50,true);
  } else if(key==='jos'){
    for(let i=0;i<9;i++){ const a=rr(0,6.28),r=rr(275,320); mk(ico,'#8d8579',Math.cos(a)*r,rr(6,12),Math.sin(a)*r,rr(10,22),rr(12,22),rr(10,22),true); }
  } else if(key==='benin'||key==='maiduguri'){
    mk(ico,CITIES[key].leaf,-290,3,40,30,6,40);
  } else {
    mk(ico,'#9c8a74',-285,12,150,46,34,40,true); mk(ico,'#8e7d68',275,10,-70,36,26,32,true);
  }
  for(let i=0;i<60;i++){ const a=rr(0,6.28),r=rr(262,330),x=Math.cos(a)*r,z=Math.sin(a)*r; if((key==='lagos'||key==='calabar')&&z>255) continue; if(key==='ph'&&x>255) continue; mk(ico,CITIES[key].leaf,x,2,z,rr(2,3.5),rr(1.6,2.6),rr(2,3.5)); }
}
/* ---- street chatter (barks) and location names ---- */
let barkPool={},barkActive=[],barkT=3,locT=0,lastLoc='';
let barkSet={barks:[],hawk:[],conductor:[]};
function setupBarks(C){
  clearGroup(barkGroup); barkPool={}; barkActive=[]; barkT=3;
  const en=P.lang!=='pcm';
  barkSet={barks:(en&&C.barksEn)||C.barks,hawk:C.hawk,conductor:(en&&C.conductorEn)||C.conductor};
  barkSet.barks.concat(barkSet.hawk,barkSet.conductor).forEach(ph=>{ if(barkPool[ph]) return; const sp=label(ph,'#ffffff',INK,1.15); sp.visible=false; barkGroup.add(sp); barkPool[ph]=sp; });
}
function updateBarks(dt){
  const C=CITIES[curCity],p=player.position;
  barkT-=dt;
  if(barkT<=0){
    barkT=rand(3,6);
    if(barkActive.length<2){
      const cand=[];
      for(const w of walkers) cand.push({pos:w.g.position,h:5.6,pool:barkSet.barks});
      for(const h of hawkers) cand.push({pos:h,h:5.6,pool:barkSet.hawk});
      for(const c of cars) if(c.kind==='danfo') cand.push({pos:c.m.position,h:7.6,pool:barkSet.conductor});
      const near=cand.filter(t=>Math.hypot(t.pos.x-p.x,t.pos.z-p.z)<55);
      if(near.length){ const t=pick(near),sp=barkPool[pick(t.pool)]; if(sp&&!sp.visible){ sp.visible=true; barkActive.push({sp,t,life:3.4}); } }
    }
  }
  for(const b of barkActive){ b.life-=dt; b.sp.position.set(b.t.pos.x,b.t.h,b.t.pos.z); if(b.life<=0) b.sp.visible=false; }
  barkActive=barkActive.filter(b=>b.life>0);
}
function locName(x,z){
  const C=CITIES[curCity],kx=Math.round(x/R),kz=Math.round(z/R);
  let road=null;
  if(Math.abs(x-kx*R)<9&&Math.abs(kx)<=3) road=C.nsRoads[kx+3]; else if(Math.abs(z-kz*R)<9&&Math.abs(kz)<=3) road=C.ewRoads[kz+3];
  const di=Math.max(0,Math.min(2,Math.floor((x+210)/140))),dj=Math.max(0,Math.min(2,Math.floor((z+210)/140)));
  return (road?road+', ':'')+C.districts[dj*3+di];
}
function buildKitCity(C){
  const add=(geo,color,x,y,z,opts={})=>{
    const mat=new THREE.MeshStandardMaterial({
      color,metalness:opts.metalness===undefined?.45:opts.metalness,
      roughness:opts.roughness===undefined?.38:opts.roughness,
      emissive:opts.emissive||'#000000',emissiveIntensity:opts.emissiveIntensity||0
    });
    const mesh=new THREE.Mesh(geo,mat); mesh.position.set(x,y,z);
    mesh.castShadow=true; mesh.receiveShadow=true; mesh.userData.nomerge=true;
    cityGroup.add(mesh); return mesh;
  };
  const box=(w,h,d,color,x,y,z,opts)=>add(new THREE.BoxGeometry(w,h,d),color,x,y,z,opts);
  const cyl=(rt,rb,h,color,x,y,z,opts)=>add(new THREE.CylinderGeometry(rt,rb,h,12),color,x,y,z,opts);
  const glow='#20E5F5',gold='#F4C76B',glass='#12334C',white='#E6F5FF';
  // A dark, polished campus platform with luminous roads instead of the familiar Nigerian grid.
  box(520,.35,520,'#081725',0,-.28,0,{roughness:.8});
  for(let k=-2;k<=2;k++){
    box(9,.08,470,'#10283B',k*82,.015,0,{roughness:.65});
    box(470,.08,9,'#10283B',0,.018,k*82,{roughness:.65});
    box(.24,.035,470,glow,k*82,.08,0,{emissive:glow,emissiveIntensity:.8});
    box(470,.035,.24,glow,0,.08,k*82,{emissive:glow,emissiveIntensity:.8});
  }
  // Circular consensus plazas and connected on-chain nodes.
  for(const [x,z,r] of [[0,-140,40],[-105,-25,24],[110,-30,26],[-110,100,23],[110,95,25],[0,65,28]]){
    const pad=add(new THREE.CylinderGeometry(r,r,1.1,48),'#122A3E',x,.25,z,{metalness:.7,roughness:.28});
    pad.rotation.y=.12;
    add(new THREE.TorusGeometry(r*.83,.18,8,64),glow,x,.9,z,{emissive:glow,emissiveIntensity:1.1,metalness:.55});
    add(new THREE.TorusGeometry(r*.64,.08,6,64),gold,x,1.02,z,{emissive:gold,emissiveIntensity:.65});
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4, nx=x+Math.cos(a)*r*.74,nz=z+Math.sin(a)*r*.74;
      cyl(.55,.75,2.2,white,nx,1.7,nz,{emissive:glow,emissiveIntensity:.3});
    }
  }
  // KitCity Core: a monumental, multi-tier glass-and-metal headquarters.
  const hx=0,hz=-140;
  box(78,2,68,'#0D2438',hx,1.25,hz,{metalness:.8,roughness:.25});
  box(68,1,58,'#1A3D55',hx,2.8,hz,{metalness:.65,roughness:.2});
  box(54,24,44,glass,hx,15,hz,{metalness:.7,roughness:.18,emissive:'#0A4565',emissiveIntensity:.35});
  box(58,2,48,'#1B4A63',hx,27,hz,{metalness:.75,roughness:.2});
  box(44,20,36,'#102C42',hx,38,hz,{metalness:.75,roughness:.16,emissive:'#07364D',emissiveIntensity:.5});
  box(48,1.2,40,gold,hx,48,hz,{metalness:.8,roughness:.18,emissive:gold,emissiveIntensity:.5});
  // Layered crown and a signature cyan beacon, visible across the whole destination.
  for(let i=0;i<4;i++){
    const r=26-i*5;
    const ring=add(new THREE.TorusGeometry(r,.42,10,72),i%2?gold:glow,hx,50+i*4,hz,{emissive:i%2?gold:glow,emissiveIntensity:1.2});
    ring.rotation.x=Math.PI/2;
  }
  cyl(1.7,2.4,30,white,hx,68,hz,{emissive:glow,emissiveIntensity:1.2,metalness:.3});
  add(new THREE.OctahedronGeometry(4,1),glow,hx,85,hz,{emissive:glow,emissiveIntensity:2,metalness:.7});
  // Four monumental entrance pylons frame the KitCity Core gate.
  for(const x of [-30,30]){
    for(const z of [-176,-169]){
      box(2.2,18,2.2,white,x,9,z,{emissive:glow,emissiveIntensity:1.3,metalness:.7});
      box(3.4,.65,3.4,gold,x,18.4,z,{emissive:gold,emissiveIntensity:1});
    }
  }
  box(66,.7,2,glow,0,18,-173,{emissive:glow,emissiveIntensity:1.2});
  // Distinct Web3 districts: learning, builders, creators, DAO governance, and open finance.
  const campus=[
    {x:-105,z:-25,w:34,d:28,h:26,c:'#153E59',name:'LEARN / VERIFY',kind:'learn'},
    {x:110,z:-30,w:38,d:30,h:36,c:'#16415A',name:'BUILDER CAMPUS',kind:'build'},
    {x:-110,z:100,w:32,d:28,h:24,c:'#15354C',name:'CREATOR STUDIOS',kind:'create'},
    {x:110,z:95,w:38,d:30,h:30,c:'#163B50',name:'DAO COMMONS',kind:'dao'},
    {x:0,z:65,w:42,d:30,h:27,c:'#17364D',name:'OPEN FINANCE',kind:'finance'},
    {x:-180,z:-140,w:24,d:26,h:38,c:'#13344B',name:'VALIDATOR NODE',kind:'node'},
    {x:180,z:-140,w:24,d:26,h:42,c:'#13344B',name:'PROTOCOL LAB',kind:'node'},
    {x:-180,z:155,w:28,d:26,h:22,c:'#15384D',name:'PUBLIC GOODS',kind:'dao'},
    {x:180,z:155,w:30,d:26,h:25,c:'#15384D',name:'IDENTITY & SAFETY',kind:'learn'}
  ];
  for(const b of campus){
    box(b.w,b.h,b.d,b.c,b.x,b.h/2,b.z,{metalness:.65,roughness:.2,emissive:'#082D43',emissiveIntensity:.3});
    box(b.w+2,1,b.d+2,glow,b.x,b.h+0.6,b.z,{emissive:glow,emissiveIntensity:.55,metalness:.7});
    for(let y=5;y<b.h-2;y+=5){
      box(b.w+.12,.22,.3,glow,b.x,y,b.z+b.d/2+.18,{emissive:glow,emissiveIntensity:.8});
      box(.3,.22,b.d+.12,glow,b.x-b.w/2-.18,y,b.z,{emissive:glow,emissiveIntensity:.55});
    }
    for(let xx=-1;xx<=1;xx++){
      box(2.8,Math.max(3,b.h-5),.5,white,b.x+xx*b.w*.23,b.h/2,b.z+b.d/2+.42,{emissive:glow,emissiveIntensity:.3,metalness:.25});
    }
    const tag=label(b.name,white,'#0A1B2C',1.2); tag.position.set(b.x,b.h+5,b.z); cityGroup.add(tag);
    colliders.push({x0:b.x-b.w/2,x1:b.x+b.w/2,z0:b.z-b.d/2,z1:b.z+b.d/2});
    // Validator antennae make the skyline feel active and infrastructural.
    if(b.kind==='node'){
      cyl(1.1,1.5,22,gold,b.x,b.h+11,b.z,{emissive:gold,emissiveIntensity:.7});
      for(let y=b.h+7;y<b.h+24;y+=5){
        const rr=add(new THREE.TorusGeometry(3,.16,6,24),glow,b.x,y,b.z,{emissive:glow,emissiveIntensity:1});
        rr.rotation.x=Math.PI/2;
      }
    }
  }
  // A suspended data bridge, linking the campus districts to the Hub.
  box(12,1.2,240,'#1A4058',0,5,-12,{metalness:.8,roughness:.2});
  for(const x of [-6,6]) box(.25,3,240,glow,x,6.5,-12,{emissive:glow,emissiveIntensity:.7});
  for(let z=-120;z<=100;z+=20){
    for(const x of [-5.2,5.2]) box(.22,4,.22,gold,x,6,z,{emissive:gold,emissiveIntensity:.55});
  }
  // Large holographic-looking rings above the DAO Commons and open-finance campus.
  for(const [x,z,r] of [[110,95,18],[0,65,20],[-105,-25,15]]){
    const tor=add(new THREE.TorusGeometry(r,.5,10,48),glow,x,42,z,{emissive:glow,emissiveIntensity:1.25});
    tor.rotation.x=Math.PI/2;
    tor.rotation.y=.18;
  }
  // A small, deliberately restrained set of static citizens around the plazas.
  const people=[[-45,-105],[-56,-80],[42,-94],[52,-65],[-82,-8],[-76,-42],[82,-4],[84,-54],[-92,82],[-75,118],[88,76],[91,119],[-30,48],[32,84],[145,50],[-145,35]];
  people.forEach(([x,z],i)=>{
    const p=buildPerson(Object.assign({},pk(LOOKSC),{skin:pk(SKINS)}));
    p.position.set(x,.05,z); p.rotation.y=(i%2?Math.PI:0); trafficGroup.add(p);
  });
  // Landmark labels and a clear route into the Hub.
  const hubTitle=label('KITCITY CORE',white,'#071827',2.1); hubTitle.position.set(0,58,-140); cityGroup.add(hubTitle);
  const hubSub=label('THE WEB3 WORLD',gold,'#071827',1.25); hubSub.position.set(0,53,-140); cityGroup.add(hubSub);
  const gate=label('WELCOME TO KITCITY',white,'#062638',1.4); gate.position.set(0,23,-176); cityGroup.add(gate);
  const access=label('LEARN • BUILD • CONTRIBUTE',glow,'#071827',1.05); access.position.set(0,20,-180); cityGroup.add(access);
  cityCols=colliders.length;
  mergeStatic(cityGroup); flagShadows(cityGroup); flagShadows(trafficGroup); freeze(cityGroup);
  setupBarks(C); Snd.setCity('kitcity');
}
function cityLayout(key){
  const keys=Object.keys(CITY_ARCH_ROAD),idx=Math.max(0,keys.indexOf(key));
  const spacing=[70,76,82,72,78,84,74,80,86,72,78,84,74][idx%13];
  return {idx,spacing,pattern:idx%8,arterial:idx%5,sidewalk:idx%4};
}
function roadCoord(n,axis='x'){
  // Lagos uses offset avenue spacing instead of a perfectly repeated square grid.
  if(CITY_LAYOUT_INDEX===0){ const offsets={[-3]:-12,[-2]:-5,[-1]:-1,[1]:5,[2]:11,[3]:16}; return n===0?0:n*R+(offsets[n]||0); }
  if(n===0) return 0;
  const mode=CITY_LAYOUT_INDEX%8,sign=n<0?-1:1,abs=Math.abs(n);
  let shift=0;
  if(mode===1) shift=(abs%2?7:-7)*sign;
  else if(mode===2) shift=Math.sin(n*1.15)*7;
  else if(mode===3) shift=sign*Math.min(abs,2)*4;
  else if(mode===4) shift=(((abs%3)-1)*7)*sign;
  else if(mode===5) shift=Math.sin(n*.82)*10;
  else if(mode===6) shift=abs%2?8*sign:0;
  else if(mode===7) shift=((abs%3)*4)*sign;
  if(axis==='z') shift=-shift*.72 + (mode===3?sign*2:0);
  return n*R+shift;
}
function roadMid(n,axis='x'){return (roadCoord(n,axis)+roadCoord(n+1,axis))/2;}
function roadWidthFor(key,n){return key==='lagos'?(n===0?22:(Math.abs(n)===2?18:14)):14;}
function blockMid(n,axis='x'){
  const key=curCity;
  if(key!=='lagos') return roadMid(n,axis);
  const start=roadCoord(n,axis)+roadWidthFor(key,n)/2;
  const end=roadCoord(n+1,axis)-roadWidthFor(key,n+1)/2;
  return (start+end)/2;
}
function addCityBlockBuildings(C,cx,cz,ix,iz){
  const L=cityLayout(curCity),A=cityKit(curCity),p=L.pattern;
  const lots=[
    [[-13,-13,13,10],[-13,1,10,12],[2,-13,11,13],[13,3,9,15]],
    [[-12,-12,17,13],[12,12,17,13]],
    [[-15,-13,9,8],[-5,-14,9,8],[6,-13,9,8],[15,-3,8,10],[-14,2,9,10],[-3,12,10,8],[8,12,10,8]],
    [[-12,-11,22,11],[12,10,21,12]],
    [[-13,-12,12,11],[3,-14,14,10],[-8,4,13,12],[12,11,11,9]],
    [[-12,-12,16,12],[12,-9,12,14],[-7,12,13,10]],
    [[-12,-12,15,15],[12,12,16,15]],
    [[-14,-12,10,13],[-2,-14,12,9],[12,-7,10,12],[-10,8,13,10],[5,13,10,8]]
  ];
  let placements=lots[p].map(v=>v.slice()),core=curCity==='lagos'&&Math.abs(cx)<145&&Math.abs(cz)<145;
  if(curCity==='lagos'){
    // A pair of large office towers per CBD block; smaller office plots on the outer ring.
    placements=core?[[-12,-10,18,20],[12,10,18,20]]:[[-13,-12,19,17],[12,11,18,16],[-12,12,14,13]];
  }else if(A.arch==='industrial'||A.arch==='workshop') placements=lots[3].map(v=>v.slice());
  else if(A.arch==='adobe'||A.arch==='kanuri-sahel'||A.arch==='northern-craft'||A.arch==='compound') placements=lots[2].map(v=>v.slice());
  else if(A.arch==='verandah'||A.arch==='raffia'||A.arch==='stilt') placements=lots[5].map(v=>v.slice());
  else if(A.arch==='civic-tower'||A.arch==='monument'||A.arch==='modern-lowrise') placements=lots[6].map(v=>v.slice());
  else if(A.arch==='terrace'||A.arch==='coal'||A.arch==='plateau-rock') placements=lots[4].map(v=>v.slice());
  for(const [ox,oz,w,d] of placements){
    const x=cx+ox+rr(-.7,.7),z=cz+oz+rr(-.7,.7);
    if(nearSpecial(x,z,core?11:18)) continue;
    let style=pickStyle(C);
    if(curCity==='lagos') style=core?(RN()<.86?'glass':'admin'):(RN()<.62?'glass':(RN()<.8?'admin':'flat'));
    const palette=['#6DC6E6','#91D8F0','#C7EAF3','#F0F7FA','#4F9FC5','#B7DCE8','#D8E8ED','#7EB3CB'];
    addBuilding(x,z,w*rr(.96,1.08),d*rr(.96,1.08),style,curCity==='lagos'?pk(palette):pk(C.paint),cx,cz,ox,oz);
  }
}
function addCityRoadTopology(key){
  const L=cityLayout(key),A=cityKit(key);
  const mat=new THREE.MeshLambertMaterial({color:A.road==='lagoon-expressway'?'#343B3E':A.road==='planned-boulevard'?'#42474B':A.road.includes('dry')?'#5A5145':'#3A3D3F'});
  const strip=(x,z,w,d,rot=0)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat);m.rotation.x=-Math.PI/2;m.rotation.z=rot;m.position.set(x,.035,z);cityGroup.add(m);};
  const dash=(x,z,w,d,rot=0,color=A.mark)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshBasicMaterial({color,depthWrite:false}));m.rotation.x=-Math.PI/2;m.rotation.z=rot;m.position.set(x,.07,z);cityGroup.add(m);};
  if(L.arterial===0){
    strip(0,245,470,15);dash(0,245,470,1,0,A.kerb);strip(0,245,8,470);
    for(let x=-220;x<=220;x+=18)dash(x,245,8,.22);
  }else if(L.arterial===1){
    strip(-240,230,150,10,-.42);for(let n=-5;n<=5;n++)dash(-240+n*12,230-n*5,5,.2,-.42);
    strip(240,-230,130,8,.38);
  }else if(L.arterial===2){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(31,5,5,64),mat);ring.rotation.x=Math.PI/2;ring.position.set(245,.045,245);cityGroup.add(ring);
    strip(245,207,10,76);strip(207,245,76,10);
    const island=new THREE.Mesh(new THREE.CircleGeometry(20,32),new THREE.MeshLambertMaterial({color:A.edge==='green-strip'?'#4F7D4B':'#9B9B87'}));island.rotation.x=-Math.PI/2;island.position.set(245,.06,245);cityGroup.add(island);
  }else if(L.arterial===3){
    strip(-245,0,11,420);for(let z=-190;z<=190;z+=16)dash(-245,z,5,.22,0,A.kerb);
    strip(0,-245,420,12);for(let x=-190;x<=190;x+=16)dash(x,-245,.22,5,0,A.kerb);
  }else{
    strip(-245,-225,75,9,-.55);strip(-190,-245,70,9,-.12);strip(-115,-250,70,9,.22);strip(-35,-240,70,9,.46);
    for(let n=0;n<7;n++)dash(-255+n*25,-225-n*3,4,.2,-.55);
  }
}
function addLagosInterchange(cx,cz){
  const asphalt=new THREE.MeshLambertMaterial({color:'#30383D',map:LKT.asph});
  const curb=new THREE.MeshLambertMaterial({color:'#D9E5E6'});
  const cyan=new THREE.MeshBasicMaterial({color:'#10C8DC'});
  const gold=new THREE.MeshBasicMaterial({color:'#F6C85F'});
  const deck=new THREE.Mesh(new THREE.BoxGeometry(108,.12,15),asphalt);
  deck.position.set(cx,.13,cz);deck.rotation.y=-Math.PI/4;cityGroup.add(deck);
  for(const side of [-1,1]){
    const edge=new THREE.Mesh(new THREE.BoxGeometry(108,.08,.35),curb);
    edge.position.set(cx-side*5.125,.21,cz+side*5.125);edge.rotation.y=-Math.PI/4;cityGroup.add(edge);
  }
  for(let n=-4;n<=4;n++){
    const marker=new THREE.Mesh(new THREE.BoxGeometry(5,.035,.2),n%2?cyan:gold);
    marker.position.set(cx+n*8,.205,cz+n*8);marker.rotation.y=-Math.PI/4;cityGroup.add(marker);
  }
  const circle=new THREE.Mesh(new THREE.TorusGeometry(8.5,.65,5,48),new THREE.MeshBasicMaterial({color:'#10C8DC'}));
  circle.rotation.x=Math.PI/2;circle.position.set(cx,.24,cz);cityGroup.add(circle);
  const plaza=new THREE.Mesh(new THREE.CylinderGeometry(6.4,6.4,.35,24),new THREE.MeshLambertMaterial({color:'#355C4A'}));
  plaza.position.set(cx,.22,cz);cityGroup.add(plaza);
}
function addLagosPremiumRoads(){
  const asphalt=new THREE.MeshLambertMaterial({color:'#30383D',map:LKT.asph});
  const curbMat=new THREE.MeshLambertMaterial({color:'#D9E5E6'});
  const medianMat=new THREE.MeshLambertMaterial({color:'#263E45'});
  const stripeMat=new THREE.MeshBasicMaterial({color:'#F6C85F',depthWrite:false});
  const cyanMat=new THREE.MeshBasicMaterial({color:'#10C8DC'});
  const road=(x,z,length,width,angle=0)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(length,.09,width),asphalt);m.position.set(x,.02,z);m.rotation.y=angle;cityGroup.add(m);};
  const bar=(x,z,length,width,material,angle=0,y=.11)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(length,.035,width),material);m.position.set(x,y,z);m.rotation.y=angle;cityGroup.add(m);};
  // Every route that carries traffic gets a visible asphalt surface. Cars use these same roadCoord() axes.
  for(const axis of ['x','z']) for(let n=-3;n<=3;n++){
    const p=roadCoord(n,axis==='x'?'z':'x'),major=n===0||Math.abs(n)===2,width=n===0?22:(Math.abs(n)===2?18:14);
    if(axis==='x') road(0,p,520,width);
    else road(p,0,520,width,Math.PI/2);
    const edge=width/2-.25;
    if(axis==='x'){
      bar(0,p-edge,520,.32,curbMat);bar(0,p+edge,520,.32,curbMat);
      if(major){
        bar(0,p,520,1.25,medianMat);
        for(let x=-240;x<=240;x+=24){bar(x,p,1.35,.16,stripeMat);bar(x,p+1.05,.8,.12,cyanMat,0,.13);}
        for(const side of [-1,1])bar(0,p+side*6.7,520,.14,curbMat);
      }else{
        for(let x=-240;x<=240;x+=13)bar(x,p,5.2,.18,stripeMat,0,.105);
      }
    }else{
      bar(p-edge,0,.32,520,curbMat,Math.PI/2);bar(p+edge,0,.32,520,curbMat,Math.PI/2);
      if(major){
        bar(p,0,1.25,520,medianMat,Math.PI/2);
        for(let z=-240;z<=240;z+=24){bar(p,z,.8,.12,cyanMat,Math.PI/2,.13);bar(p,z,.16,1.35,stripeMat,Math.PI/2,.105);}
        for(const side of [-1,1])bar(p+side*6.7,0,.14,520,curbMat,Math.PI/2);
      }else{
        for(let z=-240;z<=240;z+=13)bar(p,z,.18,5.2,stripeMat,Math.PI/2,.105);
      }
    }
  }
  const cx=roadCoord(2,'x'),cz=roadCoord(-2,'z');
  const ring=new THREE.Mesh(new THREE.TorusGeometry(13,1.3,6,64),new THREE.MeshBasicMaterial({color:'#10C8DC'}));ring.rotation.x=Math.PI/2;ring.position.set(cx,.18,cz);cityGroup.add(ring);
  const island=new THREE.Mesh(new THREE.CylinderGeometry(10.5,10.5,.5,32),new THREE.MeshLambertMaterial({color:'#355C4A'}));island.position.set(cx,.23,cz);cityGroup.add(island);
  const core=new THREE.Mesh(new THREE.CylinderGeometry(3.2,4,7,12),new THREE.MeshLambertMaterial({color:'#D7E5E8'}));core.position.set(cx,3.7,cz);cityGroup.add(core);
  const crown=new THREE.Mesh(new THREE.SphereGeometry(2.6,16,10),new THREE.MeshBasicMaterial({color:'#F6C85F'}));crown.position.set(cx,7.8,cz);cityGroup.add(crown);
}
function buildCity(key){
  const C=CITIES[key]; curCity=key;
  const layout=cityLayout(key); CITY_LAYOUT_INDEX=layout.idx; R=layout.spacing; GRID_OFFSET=R/2;
  clearGroup(cityGroup); clearGroup(trafficGroup); texs.forEach(t=>t.dispose()); texs=[];
  colliders.length=0; buildings.length=0; cars=[]; walkers=[]; hawkers=[]; ringTaken=[];
  RN=mulberry(C.seed); dxReset(); LOOKSC=CITY_LOOKS[key]||LOOKS;
  applyLook(key,C);
  if(key==='kitcity'){ buildKitCity(C); return; }
  const outer=new THREE.Mesh(uvScale(new THREE.PlaneGeometry(1400,1400),100,100),lam(C.dirt,{map:LKT.dirt})); outer.rotation.x=-Math.PI/2; outer.position.y=-.04; cityGroup.add(outer);
  const ground=new THREE.Mesh(uvScale(new THREE.PlaneGeometry(520,520),20,20),lam(C.ground,{map:LKT.asph})); ground.rotation.x=-Math.PI/2; cityGroup.add(ground);
  const dirtMat=lam(C.dirt,{map:LKT.dirt}),paveMat=lam(C.slab,{map:LKT.pave}),slabGeo=uvScale(new THREE.BoxGeometry(R-14,0.1,R-14),Math.max(8,(R-14)/4),Math.max(8,(R-14)/4)),vergeGeo=uvScale(new THREE.PlaneGeometry(R-11,R-11),Math.max(6,(R-11)/5),Math.max(6,(R-11)/5));
  for(let k=-3;k<=3;k++)for(let i=-3;i<=2;i++){
    const h=new THREE.Mesh(dashGeo,dashMat); h.rotation.x=-Math.PI/2; h.position.set(roadMid(i,'x'),0.04,roadCoord(k,'z')); cityGroup.add(h);
    const v=new THREE.Mesh(dashGeo,dashMat); v.rotation.set(-Math.PI/2,0,Math.PI/2); v.position.set(roadCoord(k,'x'),0.04,roadMid(i,'z')); cityGroup.add(v);
  }
  const blocks=[];
  for(let i=-3;i<=2;i++)for(let j=-3;j<=2;j++){
    const cx=blockMid(i,'x'),cz=blockMid(j,'z'); blocks.push({cx,cz});
    const roadWidth=n=>key!=='lagos'?14:(n===0?22:(Math.abs(n)===2?18:14));
    const cellW=key==='lagos'?Math.max(50,roadCoord(i+1,'x')-roadCoord(i,'x')-(roadWidthFor(key,i)+roadWidthFor(key,i+1))/2):R-14;
    const cellD=key==='lagos'?Math.max(50,roadCoord(j+1,'z')-roadCoord(j,'z')-(roadWidthFor(key,j)+roadWidthFor(key,j+1))/2):R-14;
    const vg=new THREE.Mesh(key==='lagos'?uvScale(new THREE.PlaneGeometry(cellW+3,cellD+3),Math.max(6,cellW/5),Math.max(6,cellD/5)):vergeGeo,dirtMat); vg.rotation.x=-Math.PI/2; vg.position.set(cx,.03,cz); cityGroup.add(vg);
    const slab=new THREE.Mesh(key==='lagos'?uvScale(new THREE.BoxGeometry(cellW,0.1,cellD),Math.max(8,cellW/4),Math.max(8,cellD/4)):slabGeo,paveMat); slab.position.set(cx,0.05,cz); cityGroup.add(slab);
    const lmk=(C.lm||[]).find(l=>Math.hypot(l[1]-cx,l[2]-cz)<15);
    if(key==='lagos'&&i===1&&j===-2) addLagosInterchange(cx,cz);
    else if(lmk) landmark(lmk[0],cx,cz);
    else if((key!=='lagos'||Math.abs(i)>=2||Math.abs(j)>=2)&&((((i+j)%C.market)+C.market)%C.market===0)) addMarket(cx,cz);
    else addCityBlockBuildings(C,cx,cz,i,j);
    // Roadside/block-edge tree placement removed: keep streets and road verges clear.
  }
  streetDetails(C,blocks); roadDecals(C,blocks);
  addRoadIdentity(key,blocks); addCityRoadTopology(key);
  if(key==='lagos') addLagosPremiumRoads();
  addRegionalIdentity(C,key);
  dxFlush(C);
  cityCols=colliders.length;
  for(let k=-3;k<=3;k++)for(const axis of ['x','z'])for(const dir of [1,-1]){
    const n=(k===0||k===-1)?8:(RN()<.45?5:4);
    for(let q=0;q<n;q++) addCar(axis,k,dir,C);
  }
  const spotWalk=()=>{
    for(let t=0;t<40;t++){
      const b=pk(blocks),side=Math.floor(RN()*4); let ax,az,dx,dz;
      if(side===0){ ax=b.cx; az=b.cz-25; dx=1; dz=0; } else if(side===1){ ax=b.cx; az=b.cz+25; dx=1; dz=0; }
      else if(side===2){ ax=b.cx-25; az=b.cz; dx=0; dz=1; } else { ax=b.cx+25; az=b.cz; dx=0; dz=1; }
      const off=rr(-12,12);
      if([-20,0,20].some(q=>nearSpecial(ax+dx*q,az+dz*q,15))) continue;
      return {x:ax+dx*off,z:az+dz*off,dx:dx,dz:dz};
    }
    return null;
  };
  const mkW=(x,z,dx,dz,sp,extra)=>{
    const g=buildPerson(Object.assign({},pk(LOOKSC),{skin:pk(SKINS)})); g.position.set(x,.05,z); trafficGroup.add(g);
    const w=Object.assign({g:g,dir:new THREE.Vector3(dx,0,dz),sp:sp,rem:rr(10,30),ph:rr(0,6),state:'walk',timer:0,cd:rr(0,6),type:'walk',near:true},extra||{}); walkers.push(w); return w;
  };
  for(let q=0;q<88;q++){ const sp=spotWalk(); if(!sp) continue; const sg=RN()<.5?1:-1; mkW(sp.x,sp.z,sp.dx*sg,sp.dz*sg,rr(2,3.2)); }
  for(let q=0;q<24;q++){
    const sp=spotWalk(); if(!sp) continue; const sg=RN()<.5?1:-1,spd=rr(2,2.7),rem=rr(10,30);
    const a=mkW(sp.x,sp.z,sp.dx*sg,sp.dz*sg,spd,{type:'pair',rem:rem}),b=mkW(sp.x+sp.dz*1.1,sp.z+sp.dx*1.1,sp.dx*sg,sp.dz*sg,spd,{type:'pair',rem:rem,ph:a.ph+.6});
    a.partner=b; b.partner=a;
  }
  let made=0,tr=0;
  while(made<32&&tr++<420){
    const i=Math.floor(rr(-3,4)),j=Math.floor(rr(-3,4)),o=RN()<.5?10.5:-10.5; let A,B,axis,coord,cc;
    if(RN()<.5){ const x0=roadCoord(i,'x')+o,z0=roadCoord(j,'z'); A={x:x0,z:z0-8.2}; B={x:x0,z:z0+8.2}; axis='x'; coord=z0; cc=x0; }
    else { const z0=roadCoord(j,'z')+o,x0=roadCoord(i,'x'); A={x:x0-8.2,z:z0}; B={x:x0+8.2,z:z0}; axis='z'; coord=x0; cc=z0; }
    if([A,B].some(q=>Math.abs(q.x)>205||Math.abs(q.z)>205||nearSpecial(q.x,q.z,10))) continue;
    mkW(A.x,A.z,0,0,rr(3,3.6),{type:'cross',A:A,B:B,fwd:true,axis:axis,coord:coord,cc:cc,state:'wait'}); made++;
  }
  mergeStatic(cityGroup);
  sun.color.copy(LKS.col); flagShadows(cityGroup); flagShadows(trafficGroup);
  freeze(cityGroup); buildBackdrop(key); setupBarks(C); Snd.setCity(key);
}

/* ---- mission props: stalls + people ---- */
function stripeTex(a,b){
  const c=document.createElement('canvas'); c.width=64; c.height=8; const g=c.getContext('2d');
  for(let i=0;i<8;i++){ g.fillStyle=i%2?b:a; g.fillRect(i*8,0,8,8); }
  const t=new THREE.Texture(c); t.needsUpdate=true; return t;
}
function buildStall(def,spot){
  const o=def.stall,x=spot.x,z=spot.z,face=spot.f;
  const KS=1.35;
  const g=new THREE.Group(); g.position.set(x,0,z); g.rotation.y=face>0?0:Math.PI; g.scale.setScalar(KS);
  const body=new THREE.Mesh(new THREE.BoxGeometry(3.2,3.2,5),lam(o.body)); body.position.set(-.4,1.6,0);
  const counter=new THREE.Mesh(new THREE.BoxGeometry(1,1.1,5),lam('#5a3a22')); counter.position.set(1.7,.55,0);
  const awn=new THREE.Mesh(new THREE.BoxGeometry(3,.18,5.6),lam(0xffffff,{map:stripeTex(o.a,o.b)})); awn.position.set(1.5,3.6,0); awn.rotation.z=-.18;
  g.add(body,counter,awn);
  for(const s of [-2.6,2.6]){ const pole=new THREE.Mesh(new THREE.BoxGeometry(.12,3.5,.12),lam(INK)); pole.position.set(2.9,1.75,s); g.add(pole); }
  missionGroup.add(g);
  colliders.push({x0:x-3.2,x1:x+3.2,z0:z-3.7,z1:z+3.7});
  const sp=label(tr(def.sign||def.name),def.signBg,def.signFg); sp.position.set(x,8.4,z); missionGroup.add(sp);
  if(o.sub){ const s2=label(tr(o.sub),'#ffffff',INK,1.25); s2.position.set(x,6.4,z); missionGroup.add(s2); }
  const att=buildPerson(def.look); att.userData.storyCharacter=def.name; att.userData.storyRole=def.role;
  /* Keep the stall owner beside the counter, but run the final actor position through
     the same road-clearance check as mission targets after every city redesign. */
  const actorSpot=safeMissionSpot({x:x+1.6*face,z:z+4.9*face,f:face});
  att.position.set(actorSpot.x,.05,actorSpot.z); att.rotation.y=face>0?Math.PI/2:-Math.PI/2;
  missionGroup.add(att);
  if(o.grill){
    const gx=x+2.3*face;
    const grill=new THREE.Mesh(new THREE.BoxGeometry(1.6,.4,4),lam('#222')); grill.position.set(gx,1.75,z); missionGroup.add(grill);
    for(let i=0;i<7;i++){
      const m=new THREE.Mesh(new THREE.SphereGeometry(.35,6,5),new THREE.MeshBasicMaterial({color:0xcccccc,transparent:true,opacity:.5,depthWrite:false}));
      m.userData.ph=i/7; m.userData.ox=rand(-.5,.5); m.userData.oz=rand(-1,1); missionGroup.add(m); smoke.push({m,x:gx,z});
    }
  }
}
function placeMissionEvidence(def,mission,spot){
  spot=safeMissionSpot(spot,10,10);
  const g=new THREE.Group();g.position.set(spot.x,0,spot.z);
  const title=String(def.title||def.label||'Evidence').replace(/[.!?]+$/,'');
  const labelText=tr(def.sign||title.toUpperCase().slice(0,28));
  const dark=lam('#17242C'),desk=lam('#465760'),screen=lam('#0D202B',{emissive:0x073C4A,emissiveIntensity:.7}),cyan=lam(BRAND),paper=lam('#F4F5F0'),wood=lam('#45352A');
  const add=(mesh,x,y,z)=>{mesh.position.set(x,y,z);g.add(mesh);return mesh;};
  const box=(w,h,d,mat,x,y,z)=>add(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat),x,y,z);
  const monitor=(w=2.5,h=1.6)=>{box(w,.12,1.2,desk,0,.65,.1);box(w*.78,h,.14,screen,0,1.85,-.38);box(w*.52,.08,.05,cyan,0,2.18,-.47);};
  const text=title.toLowerCase()+' '+String(def.label||'').toLowerCase(); 
  if(/wallet|recovery phrase|seed phrase|scam|malicious|security|support impersonat/.test(text)){
    box(2.6,.9,1.8,desk,0,.45,0);box(1.15,1.9,.18,dark,0,1.85,-.25);box(.88,1.35,.06,screen,0,1.85,-.37);box(.6,.08,.04,cyan,0,2.2,-.42);
    box(.45,.5,.35,wood,-1.05,.65,.25);box(.2,.25,.06,cyan,-1.05,.65,.45);
  }else if(/app|user|test|bug|contract|code|repository|audit|developer|software/.test(text)){
    box(3.1,.8,1.8,desk,0,.4,0);monitor(2.7,1.6);box(.7,.08,.06,cyan,-.55,1.9,-.47);box(.45,.08,.06,paper,.35,1.7,-.47);box(.8,.08,.06,paper,.2,1.5,-.47);
  }else if(/liquidity|swap|pool|market|trade|leverage|margin|chart|withdraw|exchange/.test(text)){
    box(3.2,.75,1.7,desk,0,.38,0);box(2.5,1.55,.13,screen,0,1.75,-.45);
    for(let i=0;i<5;i++)box(.16,.28+(i%3)*.22,.05,i%2?cyan:paper,-.8+i*.4,1.25+(i%3)*.11,-.55);
    box(1.6,.07,.05,cyan,.1,2.15,-.55);
  }else if(/investor|property|ownership|licen[cs]e|artwork|tokenized|asset/.test(text)){
    box(3.1,.7,1.8,wood,0,.35,0);box(1.65,.06,1.2,paper,0,.75,-.1);box(1.2,.06,.05,dark,0,.82,-.35);box(.9,.05,.05,cyan,-.1,.82,-.12);box(.9,.05,.05,dark,0,.82,.12);
  }else if(/campaign|community|event|message|governance|vote|dao|announcement|creator|portfolio|career|opportunity/.test(text)){
    box(.15,3.5,.15,wood,-1.45,1.75,0);box(.15,3.5,.15,wood,1.45,1.75,0);box(3.1,2.8,.15,wood,0,2.25,0);box(2.65,2.35,.06,paper,0,2.25,.1);box(1.6,.08,.04,cyan,0,2.8,.16);
    for(let i=0;i<3;i++)box(1.9-i*.2,.05,.04,dark,0,2.45-i*.28,.16);
  }else if(/bridge|network|chain|interoperab|transfer|cross-chain/.test(text)){
    box(.55,2.5,.55,cyan,-1.05,1.25,0);box(.55,2.5,.55,cyan,1.05,1.25,0);box(1.7,.12,.5,dark,0,1.6,0);box(1.2,.1,.1,paper,0,1.8,0);
  }else{
    box(2.8,.75,1.6,desk,0,.38,0);box(2.15,2,.14,wood,0,2.05,-.35);box(1.75,1.6,.06,paper,0,2.05,-.25);
    box(1.1,.08,.05,cyan,0,2.55,-.2);for(let i=0;i<3;i++)box(1.35-i*.12,.045,.04,dark,0,2.25-i*.2,-.2);
  }
  missionGroup.add(g);
  const sign=label(labelText,BRAND,'#071827',1.25);sign.position.set(spot.x,6.5,spot.z);missionGroup.add(sign);
  return {x:spot.x,z:spot.z,r:6.7,clue:true};
}
function safeMissionSpot(function safeMissionSpot(spot,offsetX=0,offsetZ=0){
  if(!spot||!Number.isFinite(Number(spot.x))||!Number.isFinite(Number(spot.z))) return spot;
  const safeAxis=(value,axis,offset)=>{
    const v=Number(value);
    let bestN=-3,bestMid=roadMid(-3,axis),bestDist=Infinity;
    for(let n=-3;n<=2;n++){
      const mid=roadMid(n,axis),dist=Math.abs(v-mid);
      if(dist<bestDist){bestDist=dist;bestN=n;bestMid=mid;}
    }
    const left=roadCoord(bestN,axis)+roadWidthFor(curCity,bestN)/2+22;
    const right=roadCoord(bestN+1,axis)-roadWidthFor(curCity,bestN+1)/2-22;
    if(left>right) return bestMid;
    /* If the authored spot is on/too near a road, move it to the block interior,
       not merely to the edge of the safe zone. Offsets then keep a scene cast spread out. */
    const base=(v<left||v>right)?bestMid:v;
    return Math.max(left,Math.min(right,base+offset));
  };
  return Object.assign({},spot,{
    x:safeAxis(spot.x,'x',offsetX),
    z:safeAxis(spot.z,'z',offsetZ)
  });
}
function placeNPC(def,spot){
  spot=safeMissionSpot(spot);
  if(def.stall) buildStall(def,spot);
  else {
    const p=buildPerson(def.look);
    const angle=Math.random()*Math.PI*2, radius=.45+Math.random()*.95;
    p.userData.storyCharacter=def.name; p.userData.storyRole=def.role;
    p.userData.storyAnchorX=spot.x+Math.cos(angle)*radius;
    p.userData.storyAnchorZ=spot.z+Math.sin(angle)*radius;
    p.userData.storyPhase=Math.random()*Math.PI*2;
    p.userData.storyGestureAt=Math.random()*3;
    p.position.set(p.userData.storyAnchorX,.05,p.userData.storyAnchorZ);
    p.rotation.y=Math.atan2(spot.x-p.position.x,spot.z-p.position.z);
    missionGroup.add(p);
    const sp=label(tr(def.sign||def.name),def.signBg,def.signFg); sp.position.set(p.position.x,4.15,p.position.z); sp.material.depthTest=false; sp.renderOrder=50; sp.scale.set(6.2,1.55,1); p.userData.storyNameLabel=sp; missionGroup.add(sp);
    colliders.push({x0:p.position.x-1,x1:p.position.x+1,z0:p.position.z-1,z1:p.position.z+1});
    storyNPCActors.push(p);
    return {x:p.position.x,z:p.position.z,r:10,object:p};
  }
  return {x:spot.x,z:spot.z,r:10};
}

/* ---- player + beacon ---- */
const player=buildPerson({top:BRAND,bottom:'#2b3350',shoe:'#ffffff',hair:'short',skin:'#7a4a2e',detail:true,backpack:true,logo:true});
player.position.set(SPAWN.x,.05,SPAWN.z); scene.add(player);
// The selected username is the player character; no floating name tag above the avatar.
{
  const blob=new THREE.Mesh(new THREE.CircleGeometry(.95,14),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.3,depthWrite:false}));
  blob.rotation.x=-Math.PI/2; blob.position.y=.02; player.add(blob);
  const halo=new THREE.Mesh(new THREE.RingGeometry(1.05,1.3,28),new THREE.MeshBasicMaterial({color:0x10C8DC,transparent:true,opacity:.9,depthWrite:false,side:THREE.DoubleSide}));
  halo.rotation.x=-Math.PI/2; halo.position.y=.03; player.add(halo);
}
let faceAng=0,walkPh=0,stepIdx=0;
const beacon=new THREE.Group();
{
  const col=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,40,16,1,true),new THREE.MeshBasicMaterial({color:0x10C8DC,transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide}));
  col.position.y=20;
  const ring=new THREE.Mesh(new THREE.RingGeometry(2.4,3,32),new THREE.MeshBasicMaterial({color:0x10C8DC,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));
  ring.rotation.x=-Math.PI/2; ring.position.y=.12; ring.name='ring';
  beacon.add(col,ring); beacon.visible=false; scene.add(beacon);
}

/* ===================== state ===================== */
const S={phase:'title',modal:false};
let G=null,ents=[],goal=null,nearEnt=null;
const storyNPCActors=[];
let hubTab='missions',hubCity='lagos',resetArm=false;
/* ===================== sheet UI ===================== */
const modalEl=$('#modal'),sheetEl=$('#sheet'),talkBtn=$('#talkBtn');
let cbs=[],toastT=0,chat={npc:null,log:[]},sheetTok=0,pendingReveal=null,hazardSpeechActive=false,pendingFeetLine=false;
function toast(msg,opts){
  const t=$('#toast'),bubble=!!(opts&&opts.bubble);
  /* Ordinary HUD notices must not cut off the player's readable hazard speech. */
  if(hazardSpeechActive&&!bubble) return;
  clearTimeout(toastT); t.classList.remove('hazard-bubble'); hazardSpeechActive=false;
  t.textContent=tr(msg);
  if(bubble){t.classList.add('hazard-bubble');hazardSpeechActive=true;}
  t.classList.add('show');
  const duration=opts&&opts.duration?opts.duration:(bubble?8500:2400);
  toastT=setTimeout(()=>{
    t.classList.remove('show','hazard-bubble');hazardSpeechActive=false;
    if(pendingFeetLine){pendingFeetLine=false;toast('Back on your feet. Watch the traffic.');}
  },duration);
}
function openSheet(html,btns,typingMs,preserveIdentity){
  html=tx(neutralizeGenderedPronouns(preserveIdentity?html:personalize(html))); S.modal=true; joy.reset(); btns=btns||[]; cbs=btns.map(b=>b.f);
  const row=btns.length?'<div class="row">'+btns.map((b,i)=>'<button class="btn'+(b.g?' ghost':'')+(b.m?' mono':'')+'" data-i="'+i+'" type="button">'+tr(b.t)+'</button>').join('')+'</div>':'';
  const tok=++sheetTok;
  sheetEl.innerHTML=html+row; sheetEl.scrollTop=0;
  modalEl.classList.remove('hidden'); talkBtn.classList.add('hidden'); Snd.duck(true);
  if(typingMs){
    sheetEl.classList.add('typing'); let done=false;
    pendingReveal=()=>{ if(done||tok!==sheetTok) return; done=true; pendingReveal=null; sheetEl.classList.remove('typing'); sheetEl.scrollTop=0; Snd.blip(chat.npc,Math.min(10,Math.round(typingMs/70))); };
    setTimeout(pendingReveal,typingMs);
  } else { sheetEl.classList.remove('typing'); pendingReveal=null; }
}
function closeSheet(){ clearMissionDialogueUI(); S.modal=false; cbs=[]; sheetTok++; pendingReveal=null; chat={npc:null,log:[]}; sheetEl.classList.remove('typing','dialogue-card'); modalEl.classList.remove('dialogue-open'); modalEl.classList.add('hidden'); sheetEl.innerHTML=''; Snd.duck(false); }
sheetEl.addEventListener('click',e=>{
  if(pendingReveal){ pendingReveal(); return; }
  const b=e.target.closest('[data-i]'); if(!b) return;
  Snd.sfx('click'); const f=cbs[+b.dataset.i]; if(f) f();
});
const who=(i,n,r,bg)=>'<div class="who"><span class="av" style="background:'+bg+'">'+i+'</span><div><b>'+n+'</b><small>'+r+'</small></div></div>';
const whoOf=d=>who(d.name.charAt(0),d.name,d.role,d.color);
const plain=h=>h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
let activeMissionDialogue=null;
let missionDialogueBubble=null;
let missionDialogueNav=null;
let missionDialogueFrame=0;
function ensureMissionDialogueUI(){
  if(missionDialogueBubble&&missionDialogueNav)return;
  missionDialogueBubble=document.createElement('div');
  missionDialogueBubble.className='kitcity-mission-dialogue-bubble hidden';
  missionDialogueBubble.setAttribute('role','status');
  missionDialogueBubble.setAttribute('aria-live','polite');
  document.body.appendChild(missionDialogueBubble);
  missionDialogueNav=document.createElement('div');
  missionDialogueNav.className='kitcity-mission-dialogue-nav hidden';
  missionDialogueNav.setAttribute('aria-label','Conversation navigation');
  missionDialogueNav.innerHTML='<button type="button" data-dialogue-step="-1" aria-label="Previous line">‹ Prev</button><span aria-live="polite"></span><button type="button" data-dialogue-step="1" aria-label="Next line">Next ›</button>';
  document.body.appendChild(missionDialogueNav);
  missionDialogueNav.addEventListener('click',event=>{
    const button=event.target.closest('button[data-dialogue-step]');
    if(!button||!activeMissionDialogue)return;
    event.preventDefault();
    const step=Number(button.dataset.dialogueStep);
    if(step<0){
      renderMissionDialogueLine(Math.max(0,activeMissionDialogue.index-1));
    }else if(activeMissionDialogue.index<activeMissionDialogue.lines.length-1){
      renderMissionDialogueLine(activeMissionDialogue.index+1);
    }else{
      revealMissionDialogueChoices();
    }
  });
}
function clearMissionDialogueUI(){
  activeMissionDialogue=null;
  if(missionDialogueFrame){cancelAnimationFrame(missionDialogueFrame);missionDialogueFrame=0;}
  if(missionDialogueBubble)missionDialogueBubble.classList.add('hidden');
  if(missionDialogueNav)missionDialogueNav.classList.add('hidden');
}
function missionDialogueActor(speaker,fallback){
  const name=String(speaker||'').trim().replace(/:$/,'').toLowerCase();
  if(['you','player','yourself'].includes(name))return player;
  const found=storyNPCActors.find(actor=>String(actor.userData&&actor.userData.storyCharacter||'').trim().toLowerCase()===name);
  if(found)return found;
  if(fallback&&fallback.object)return fallback.object;
  return storyNPCActors.find(actor=>String(actor.userData&&actor.userData.storyCharacter||'').trim().toLowerCase()===String(fallback&&fallback.name||'').trim().toLowerCase())||player;
}
function positionMissionDialogueBubble(){
  if(!activeMissionDialogue||!missionDialogueBubble)return;
  const line=activeMissionDialogue.lines[activeMissionDialogue.index];
  const actor=missionDialogueActor(line&&line.speaker,activeMissionDialogue.def);
  if(!actor||!actor.visible){missionDialogueBubble.classList.add('hidden');return;}
  const point=new THREE.Vector3();
  actor.getWorldPosition(point);
  point.y+=actor===player?4.1:4.5;
  point.project(camera);
  missionDialogueBubble.classList.remove('hidden');
  const rect=document.querySelector('#gl')?.getBoundingClientRect()||{left:0,top:0,width:innerWidth,height:innerHeight};
  let x=rect.left+(point.x*.5+.5)*rect.width;
  let y=rect.top+(-point.y*.5+.5)*rect.height;
  if(point.z<=-1||point.z>=1){x=window.innerWidth/2;y=window.innerHeight*.68;}
  const margin=10;
  const width=Math.min(missionDialogueBubble.offsetWidth||300,window.innerWidth-margin*2);
  const height=missionDialogueBubble.offsetHeight||84;
  const left=Math.max(margin+width/2,Math.min(window.innerWidth-margin-width/2,x));
  const top=Math.max(margin+height,Math.min(window.innerHeight-margin,y));
  missionDialogueBubble.style.left=left+'px';
  missionDialogueBubble.style.top=top+'px';
}
function missionDialogueFrameLoop(){
  if(!activeMissionDialogue){missionDialogueFrame=0;return;}
  camera.updateMatrixWorld();
  positionMissionDialogueBubble();
  missionDialogueFrame=requestAnimationFrame(missionDialogueFrameLoop);
}
function renderMissionDialogueLine(index){
  if(!activeMissionDialogue)return;
  activeMissionDialogue.index=index;
  const line=activeMissionDialogue.lines[index];
  missionDialogueBubble.innerHTML='<small>'+escapeStoryHtml(String(line.speaker||'').toUpperCase())+'</small><div>'+line.html+'</div>';
  missionDialogueBubble.classList.remove('hidden','bubble-pop');
  void missionDialogueBubble.offsetWidth;
  missionDialogueBubble.classList.add('bubble-pop');
  missionDialogueNav.classList.remove('hidden');
  missionDialogueNav.querySelector('span').textContent=(index+1)+' / '+activeMissionDialogue.lines.length;
  missionDialogueNav.querySelector('[data-dialogue-step="-1"]').disabled=index<=0;
  missionDialogueNav.querySelector('[data-dialogue-step="1"]').textContent=index>=activeMissionDialogue.lines.length-1?'Choices ›':'Next ›';
  positionMissionDialogueBubble();
}
function revealMissionDialogueChoices(){
  if(!activeMissionDialogue)return;
  const dialogue=activeMissionDialogue;
  clearMissionDialogueUI();
  if(!dialogue.buttons.length){closeSheet();return;}
  const def=dialogue.def;
  const card='<div class="dialogue-talk-head"><span class="dialogue-talk-avatar" style="--npc-accent:'+escapeStoryHtml(def.color||BRAND)+'">'+escapeStoryHtml(String(def.name||'').slice(0,1).toUpperCase())+'</span><div class="dialogue-talk-identity"><small>YOUR MOVE</small><h3>'+escapeStoryHtml(String(def.name||'Local resident'))+'</h3><span>Choose what happens next.</span></div></div>';
  openSheet(card,dialogue.buttons,0,true);
  sheetEl.classList.add('dialogue-card');
  modalEl.classList.add('dialogue-open');
}
function talk(def,html,btns){
  html=tx(personalize(html,G&&G.m,def));
  const npcName=String(def.name||'Local resident');
  const wrapped=(btns||[]).map(b=>({t:personalize(tr(b.t)),g:b.g,m:b.m,f:b.f}));
  const holder=document.createElement('div');
  holder.innerHTML=html;
  let nodes=Array.from(holder.querySelectorAll('p'));
  if(!nodes.length){
    nodes=holder.innerHTML.split(/<br\s*\/?\s*>/i).filter(part=>part.replace(/<[^>]+>/g,'').trim()).map(part=>{
      const p=document.createElement('p');p.innerHTML=part;return p;
    });
  }
  const lines=nodes.map(node=>{
    const first=node.querySelector('b,strong');
    let speaker=npcName;
    if(first){
      const label=first.textContent.trim();
      if(/:$/.test(label)){speaker=label.replace(/:$/,'').trim();first.remove();}
    }
    const lineHtml=node.innerHTML.trim()||escapeStoryHtml(node.textContent.trim());
    return {speaker,html:lineHtml};
  }).filter(line=>line.html.replace(/<[^>]+>/g,'').trim());
  if(!lines.length)lines.push({speaker:npcName,html:escapeStoryHtml(plain(html))});
  closeSheet();
  ensureMissionDialogueUI();
  activeMissionDialogue={def,buttons:wrapped,lines,index:0};
  S.modal=true;
  talkBtn.classList.add('hidden');
  Snd.duck(true);
  renderMissionDialogueLine(0);
  if(!missionDialogueFrame)missionDialogueFrame=requestAnimationFrame(missionDialogueFrameLoop);
}
function badgeSVG(n,on,size){
  const num=Number(n),idx=Number.isFinite(num)&&num>0?Math.floor(num)-1:Math.abs(String(n).split('').reduce((a,c)=>a+c.charCodeAt(0),0))%12;
  const colors=['#F4B942','#28C7A5','#5CA8FF','#C084FC','#FF8066','#F472B6','#A3D95B','#4DD0E1','#FFA64D','#818CF8','#E879F9','#7DD3A7'];
  const hue=(idx*137.508+38)%360;
  const accent=on?'hsl('+hue+' 78% 62%)':'#59636D';
  const dark=on?'hsl('+hue+' 52% 20%)':'#252D35';
  const icons=[
    '<path d="M60 29 81 37V53C81 68 71 79 60 85 49 79 39 68 39 53V37Z"/><path d="m49 55 8 8 15-17"/>',
    '<circle cx="60" cy="49" r="17"/><path d="M51 49h18M60 40v18M49 68l-4 16 15-7 15 7-4-16"/>',
    '<path d="M35 51Q60 25 85 51Q60 77 35 51Z"/><circle cx="60" cy="51" r="7"/>',
    '<rect x="41" y="47" width="38" height="30" rx="6"/><path d="M49 47v-8a11 11 0 0 1 22 0v8M60 58v8"/>',
    '<path d="M34 54 60 33l26 21-26 21Z"/><path d="M46 54h28M60 42v24"/>',
    '<path d="M60 29 78 48 60 67 42 48Z"/><path d="M60 67v16M49 83h22"/>',
    '<path d="M35 39h50v34H57L44 83V73h-9Z"/><path d="M46 50h28M46 61h19"/>',
    '<circle cx="60" cy="48" r="18"/><path d="M69 39c-3-5-17-4-17 3 0 8 17 3 17 11 0 7-14 9-19 2M60 26v5M60 65v5"/>',
    '<rect x="36" y="38" width="48" height="36" rx="7"/><path d="M43 38v36M77 38v36M36 61h48M48 81h6M66 81h6"/><circle cx="47" cy="69" r="3"/><circle cx="73" cy="69" r="3"/>',
    '<circle cx="51" cy="43" r="9"/><circle cx="70" cy="47" r="7"/><path d="M33 76c1-13 8-20 18-20s17 7 18 20M66 61c11-2 19 4 21 15"/>',
    '<path d="M63 29c4 14-10 17-5 27 3-4 9-5 11-12 12 17 7 34-9 38-15-1-23-15-15-29 3 7 7 8 9 10-2-13 4-21 9-34Z"/>',
    '<path d="M39 49 51 37l10 8 8-6 12 12-22 27Z"/><path d="m48 58 8 8 17-18"/>'
  ];
  const shape=icons[idx%icons.length];
  const lock=on?'':'<g transform="translate(78 73)"><circle r="15" fill="#151D25" stroke="#8996A2" stroke-width="2"/><rect x="-6" y="-1" width="12" height="9" rx="2" fill="#AAB4BE"/><path d="M-4-1v-4a4 4 0 0 1 8 0v4" fill="none" stroke="#AAB4BE" stroke-width="2"/></g>';
  const earned=on?'<g transform="translate(82 27)"><circle r="13" fill="#F7FFF9" stroke="'+accent+'" stroke-width="3"/><path d="m-6 0 4 4 8-9" fill="none" stroke="#137B56" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></g>':'';
  return '<svg class="mission-medal '+(on?'earned':'unearned')+'" width="'+size+'" height="'+size+'" viewBox="0 0 120 120" aria-hidden="true"><path d="M35 76 31 108 51 98 60 113 69 98 89 108 85 76" fill="'+(on?dark:'#303943')+'" stroke="'+accent+'" stroke-width="3" stroke-linejoin="round"/><path d="M60 7 94 21 108 51 94 81 60 95 26 81 12 51 26 21Z" fill="'+dark+'" stroke="'+accent+'" stroke-width="5" stroke-linejoin="round"/><path d="M60 17 86 28 97 51 86 74 60 85 34 74 23 51 34 28Z" fill="'+(on?'#17232D':'#202830')+'" stroke="'+accent+'" stroke-opacity=".65" stroke-width="2"/><g fill="none" stroke="'+accent+'" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 0)">'+shape+'</g>'+earned+lock+'</svg>';
}

/* ===================== HUD ===================== */
function updateLivesHUD(){
  const el=$('#lives');
  if(!el) return;
  const lives=G&&Number.isFinite(G.lives)?Math.max(0,Math.min(3,G.lives)):3;
  el.innerHTML=[0,1,2].map(i=>'<span class="life-heart '+(i<lives?'alive':'lost')+'" aria-hidden="true">♥</span>').join('');
  el.setAttribute('aria-label',lives+' of 3 lives remaining');
}
function updateHUD(){
  updateLivesHUD();
  if(G){
    $('#mTitle').textContent=tr(personalize(G.m.title,null));
    $('#steps').innerHTML=G.m.steps.map((s,i)=>'<li class="'+(G.i>i?'done':(G.i===i?'now':''))+'">'+personalize(tr(s.label),G.m,s.npc)+'</li>').join('');
  }
  $('#wallet').innerHTML=P.wallet?('<b>'+P.usdc.toFixed(2)+' USDC</b>'+(P.ngn>0?fmtN(P.ngn)+' token':short(P.wallet))):tr('No wallet yet');
}

/* ===================== KitCity story runtime =====================
   The story registry drives mission order, character encounters and evidence.
   Wallet, trading and identity tasks are handled through hands-on workbenches.
*/
const NPC=(name,role,color,look,stall,sign)=>({name,role,color,look,stall,sign});
CITIES.kitcity={...CITIES.lagos,name:'KitCity',tag:'The final city · Web3 District',lon:7.3,lat:6.1,seed:991,sky:0x142C3B,ground:'#18272E',slab:'#657985',paint:['#1B3440','#234653','#2D5360','#18313D','#37616A','#203B49'],h:[14,42],market:3,palm:.25};
const STORY_NPCS=Object.create(null);
const MISSIONS=[];
const MBY=Object.create(null);
/* Progress is tracked by completed missions and the in-game wallet balance. */
const isUnlocked=m=>{ const k=MISSIONS.indexOf(m); return k===0||!!P.done[MISSIONS[k-1].id]; };


const cityOrder=Object.keys(CITIES);

/* Mission character names are explicit; never infer them from array position. */
function missionNPCObjects(mission){
  const found=new Set();
  const add=value=>{
    const name=typeof value==='string'?value:(value&&value.name);
    const npc=name&&STORY_NPCS[name];
    if(npc) found.add(npc);
  };
  (mission&&mission.npcs||[]).forEach(add);
  (mission&&mission.sceneCast||[]).forEach(add);
  (mission&&mission.steps||[]).forEach(step=>{
    add(step.npc);
    (step.npcs||[]).forEach(add);
  });
  (mission&&mission.extras||[]).forEach(extra=>add(extra.npc));
  return Array.from(found);
}
for(const npc of Object.values(STORY_NPCS)) if(!npc.originalName) npc.originalName=npc.name;
function buildMissionNameAliases(mission){
  const candidates=Object.create(null),ambiguous=new Set(),currentNames=new Set();
  const npcs=missionNPCObjects(mission);
  for(const npc of npcs){ const current=String(npc.name||'').trim(); if(current) currentNames.add(current.toLowerCase()); }
  for(const npc of npcs){
    const original=String(npc.originalName||'').trim();
    const current=String(npc.name||'').trim();
    if(!original||!current||original===current) continue;
    /* Never rewrite a name that is already the canonical name of another NPC in this mission.
       Otherwise a card for Praise or The don can be renamed by an unrelated dialogue alias. */
    if(currentNames.has(original.toLowerCase())) continue;
    if(Object.prototype.hasOwnProperty.call(candidates,original)&&candidates[original]!==current) ambiguous.add(original);
    else candidates[original]=current;
  }
  ambiguous.forEach(name=>delete candidates[name]);
  return candidates;
}
const cityMissions=city=>MISSIONS.filter(m=>m.city===city);
const isCityComplete=city=>{const ms=cityMissions(city);return ms.length>0&&ms.every(m=>!!P.done[m.id]);};
const isCityUnlocked=city=>{const ms=cityMissions(city);return ms.length===0||isUnlocked(ms[0]);};
/* ===================== mission flow ===================== */
function hideEnt(e){ e.hidden=true; loadStep(); }
function resetPlayer(){
  player.position.set(SPAWN.x,.05,SPAWN.z); faceAng=0; player.rotation.y=0; player.rotation.z=0; fallTimer=0; hitCd=0;
  camera.position.set(SPAWN.x,35,SPAWN.z+20);
}
function bannerSprite(text,sub){
 const c=document.createElement('canvas'); c.width=768; c.height=192; const g=c.getContext("2d");
 g.fillStyle='#111820';g.fillRect(0,0,c.width,c.height);g.fillStyle='#10C8DC';g.fillRect(0,0,14,c.height);g.fillRect(c.width-14,0,14,c.height);
 g.fillStyle='#ffffff';g.font='900 43px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(text.toUpperCase(),c.width/2,72,700);
 g.fillStyle='#9deef5';g.font='700 24px Arial';g.fillText(sub.toUpperCase(),c.width/2,132,700);
 const t=new THREE.CanvasTexture(c);t.needsUpdate=true;const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:true}));sp.scale.set(12,3,1);return sp;
}
function getStoryNpc(value){
  const name=typeof value==='string'?value:(value&&value.name);
  if(!name) return value&&typeof value==='object'?value:null;
  if(!STORY_NPCS[name]){
    const npc=NPC(name,'Resident',BRAND,LK.guy,null,name);
    npc.name=name;npc.originalName=name;npc.signBg=BRAND;npc.signFg='#ffffff';
    STORY_NPCS[name]=npc;
  }
  return STORY_NPCS[name];
}
function loadStep(){
  clearGroup(missionGroup);storyNPCActors.length=0;colliders.length=cityCols;smoke=[];ents=[];goal=null;
  const m=G.m,st=m.steps[G.i];if(!st)return;
  const castNames=[];
  const addCastName=value=>{const name=typeof value==='string'?value:(value&&value.name);if(name&&!castNames.includes(name))castNames.push(name);};
  (m.npcs||[]).forEach(addCastName);(m.sceneCast||[]).forEach(addCastName);
  (m.steps||[]).forEach(step=>{addCastName(step.npc);(step.npcs||[]).forEach(addCastName);});
  const activeName=st.npc&&(st.npc.name||st.npc);
  if(activeName&&!castNames.includes(activeName))castNames.push(activeName);
  const anchor=safeMissionSpot(SPOTS[st.spot]||SPOTS.a);
  const offsets=[[0,0],[4,-2],[-4,-2],[0,4],[6,3],[-6,3],[0,-6],[8,-1],[-8,-1]];
  if(st.kind==='clue'||st.kind==='challenge'){
    const clue=placeMissionEvidence(st,m,SPOTS[st.spot]||SPOTS.execution);
    clue.talk=()=>st.run();clue.active=()=>true;ents.push(clue);goal=clue;
  }else{
    castNames.forEach((name,index)=>{
      const npc=getStoryNpc(name);if(!npc)return;
      const offset=offsets[index%offsets.length];
      const entity=placeNPC(npc,{x:anchor.x+offset[0],z:anchor.z+offset[1],f:index===0?anchor.f:-anchor.f});
      const isTarget=st.kind==='character'&&(
        st.npc===npc||
        String(activeName||'').toLowerCase()===String(name).toLowerCase()||
        String(npc.originalName||npc.name).toLowerCase()===String(activeName||'').toLowerCase()
      );
      if(st.kind==='character'){
        entity.talk=()=>{if(isTarget)st.run();};entity.active=()=>isTarget;
        if(isTarget){entity._missionTarget=true;goal=entity;}
      }else{entity.talk=()=>{};entity.active=()=>false;}
      ents.push(entity);
    });
    if(!goal&&st.kind==='character'){
      const targetNpc=getStoryNpc(st.npc),targetSpot=safeMissionSpot(SPOTS[st.spot]||SPOTS.a);
      const target=targetNpc?placeNPC(targetNpc,targetSpot):{x:targetSpot.x,z:targetSpot.z,r:18};
      target.r=Math.max(Number(target.r)||0,24);target.talk=()=>st.run();target.active=()=>true;target._missionTarget=true;
      ents.unshift(target);goal=target;
    }
  }
  for(const ex of (m.extras||[])){
    if(G.used[ex.id])continue;
    const entity=placeNPC(getStoryNpc(ex.npc),ex.spot);entity.ex=ex;entity.talk=()=>ex.run(entity);entity.active=()=>!G.used[ex.id];ents.push(entity);
  }
  updateHUD();
  if(goal){beacon.visible=true;beacon.position.set(goal.object?.position?.x??goal.x,0,goal.object?.position?.z??goal.z);}
  const compass=$('#compass');
  if(goal&&compass){compass.classList.remove('hidden');compass.classList.add('force-visible');compass.style.display='grid';compass.style.visibility='visible';compass.style.opacity='1';}
}

function startMission(id,restart){
  const m=MBY[id];
  if(!m||!isUnlocked(m)){ toast('This mission is not available yet.'); renderHub(); return; }
  $('#loadTxt').textContent=L('Loading '+CITIES[m.city].name+'\u2026','We dey load '+CITIES[m.city].name+'\u2026'); $('#loading').classList.remove('hidden');
  setTimeout(()=>{
    if(curCity!==m.city) buildCity(m.city); else setupBarks(CITIES[curCity]);
    const savedStory=P.storyProgress&&P.storyProgress[id];
    if(restart&&P.storyProgress) delete P.storyProgress[id];
    const restored=(!restart&&savedStory)||null;
    G={m,i:Math.max(0,Math.min(restored&&Number.isInteger(restored.step)?restored.step:0,m.steps.length-1)),correct:restored&&restored.correct||0,wrong:restored&&restored.wrong||0,lives:3,used:{},evidence:Object.assign({},restored&&restored.evidence||{}),words:null,addr:null,slip:null,nameAliases:buildMissionNameAliases(m)};
    $('#hub').classList.add('hidden'); $('#hub').setAttribute('aria-hidden','true'); $('#title').classList.add('hidden'); $('#hud').classList.remove('hidden');
    S.phase='play'; closeSheet(); Snd.setMode('play'); lastLoc=''; resetPlayer();
    $('#loading').classList.add('hidden');
    updateHUD();
    loadStep();
    toast('Look around. Walk up to someone and press Talk when you are ready.',{duration:3600});
  },60);
}
function finishStep(){
  closeSheet(); if(!G) return;
  G.i++;
  P.storyProgress=P.storyProgress||{};
  P.storyProgress[G.m.id]={step:Math.min(G.i,G.m.steps.length-1),correct:G.correct||0,wrong:G.wrong||0,evidence:G.evidence||{}};
  save();
  if(G.i>=G.m.steps.length){ completeMission(); return; }
  Snd.sfx('chime'); toast('Step complete'); loadStep();
}
function completeMission(){
  const m=G.m,first=!P.done[m.id],wrong=G.wrong||0;
  if(P.storyProgress) delete P.storyProgress[m.id];
  P.storyFlags=Object.assign({},P.storyFlags||{},Object.fromEntries((m.storyFlags||[]).map(flag=>[flag,true])));
  const missionReward=first?(m.city==='kitcity'?2.5:(wrong===0?MISSION_CLEAR_REWARD:MISSION_RETRY_REWARD)):0;
  if(missionReward) P.usdc=Math.round((P.usdc+missionReward)*100)/100;
  P.done[m.id]=true;save();updateHUD();Snd.sfx('done');
  const idx=MISSIONS.indexOf(m),next=MISSIONS[idx+1],cityComplete=isCityComplete(m.city);
  clearGroup(missionGroup);colliders.length=cityCols;smoke=[];ents=[];goal=null;beacon.visible=false;
  hubCity=next?next.city:m.city;
  const btns=[];
  if(cityComplete)btns.push({t:'Collect city badge',f:()=>showCityBadge(m.city,()=>next?startMission(next.id):exitToHub())});
  if(next)btns.push({t:next.city!==m.city?'Continue to '+CITIES[next.city].name:'Next: '+next.title,f:()=>startMission(next.id)});
  btns.push({t:'Back to hub',g:1,f:exitToHub});
  openSheet('<div class="who"><span class="av" style="background:'+INK+'">'+m.n+'</span><div><h3 style="margin:0">Mission complete</h3><small>'+CITIES[m.city].name+'</small></div></div>'+
    (first?'<div class="kv"><span>Mission reward</span><b>+'+missionReward.toFixed(2)+' USDC</b></div><p class="note">'+(wrong===0?'Clean run reward collected.':'Completed after '+wrong+' retry attempt'+(wrong===1?'':'s')+'.')+'</p>':'<p class="note">Replay complete. The first-clear reward has already been collected.</p>')+
    
    (cityComplete?'<p><b>All available missions in '+CITIES[m.city].name+' are complete.</b></p>':'')+
    '<div class="kv"><span>Wallet balance</span><b>'+P.usdc.toFixed(2)+' USDC</b></div>',btns);
}
function showCityBadge(city,after){
 const name=CITIES[city]?.name||city;
 openSheet('<div class="badge">'+badgeSVG('★',true,96)+'<div><h3 style="margin-top:0">'+name+' Badge</h3><small>Completed</small></div></div><p>You completed the available missions in '+name+'.</p>',[{t:'Continue journey',f:()=>{closeSheet();if(after)after();}}]);
}
function certificate(){
  const totalMissions=MISSIONS.length;
  const msg=encodeURIComponent(L('I finished all '+totalMissions+' KitCity missions. Check out KitCity.','I don finish all '+totalMissions+' KitCity missions. Check out KitCity.'));
  openSheet('<div class="badge">'+badgeSVG('\u2605',true,96)+'<div><h3 style="margin-top:0">KitCity Complete</h3><small>All '+totalMissions+' missions complete</small></div></div><p>You completed all available missions. Your wallet balance is <b>'+P.usdc.toFixed(2)+' USDC</b>.</p>',
    [{t:'Back to hub',f:exitToHub}]);
  sheetEl.insertAdjacentHTML('beforeend',tx('<div class="row"><a class="btn" href="https://wa.me/?text='+msg+'" target="_blank" rel="noopener">Share on WhatsApp</a></div>'));
}
function exitToHub(){
  if(G&&!P.done[G.m.id]){P.storyProgress=P.storyProgress||{};P.storyProgress[G.m.id]={step:G.i||0,correct:G.correct||0,wrong:G.wrong||0,evidence:G.evidence||{}};save();}
  closeSheet(); S.phase='hub'; Snd.setMode('hub'); G=null;
  clearGroup(missionGroup); colliders.length=cityCols; smoke=[]; ents=[]; goal=null; beacon.visible=false;
  $('#hud').classList.add('hidden'); $('#title').classList.add('hidden');
  $('#hub').classList.remove('hidden'); $('#hub').setAttribute('aria-hidden','false');
  renderHub();
}
$('#pauseBtn').addEventListener('click',()=>{
  if(S.phase!=='play'||S.modal) return;
  openSheet('<h3>Paused</h3><p class="note">'+personalize(G.m.title,null)+'</p>',[
    {t:'Resume',f:closeSheet},
    {t:'Restart mission',g:1,f:()=>startMission(G.m.id,true)},
    {t:'Back to hub',g:1,f:exitToHub}
  ]);
});

/* ===================== hub ===================== */
const mapXY=(lon,lat)=>({x:(lon-2.2)*27+9,y:(14.2-lat)*27+7});
const mapPoints=coords=>coords.map(p=>{const q=mapXY(p[0],p[1]);return q.x.toFixed(1)+','+q.y.toFixed(1);}).join(' ');
const mapPath=coords=>coords.map((p,i)=>{const q=mapXY(p[0],p[1]);return (i?'L':'M')+q.x.toFixed(1)+' '+q.y.toFixed(1);}).join(' ');
const escMapText=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
/* Nigeria outline follows the country's broad real geographic shape; interior strokes
   are quiet state-region guides, while the Niger and Benue are shown as waterways. */
const NG=[
 [2.72,6.45],[2.77,7.15],[2.78,8.15],[2.83,9.15],[2.92,10.15],[2.98,11.1],
 [3.12,12.05],[3.62,12.72],[4.05,13.38],[5.12,13.68],[6.18,13.57],[7.24,13.55],
 [8.25,13.45],[9.25,13.28],[10.12,13.34],[11.18,13.44],[12.2,13.43],[13.22,13.49],
 [14.08,13.12],[14.42,12.35],[14.35,11.45],[13.92,10.55],[13.48,9.68],[13.16,8.82],
 [12.82,7.98],[12.54,7.13],[12.23,6.42],[11.9,5.65],[11.47,4.68],[10.92,4.31],
 [10.12,4.25],[9.25,4.29],[8.4,4.44],[7.62,4.49],[6.82,4.41],[6.02,4.35],
 [5.22,4.39],[4.4,4.41],[3.76,4.62],[3.22,5.15],[2.9,5.82]
];
const MAP_LABELS=new Set(['lagos','abuja','kano','ibadan','minna','ph','kaduna','enugu','benin','calabar','jos','maiduguri','ilorin','sokoto','kitcity']);
const MAP_OFFSETS={
 lagos:[8,13],ibadan:[10,-8],abeokuta:[-8,-10],ilorin:[-12,-8],akure:[12,11],
 'ado-ekiti':[12,12],osogbo:[10,-8],abuja:[10,-8],minna:[-10,13],kano:[9,-8],
 kaduna:[-10,12],jos:[10,-8],enugu:[10,12],benin:[10,-8],ph:[10,8],
 calabar:[10,11],maiduguri:[-12,-8],sokoto:[-8,-8],kitcity:[-10,12]
};
function mapSVG(){
  const outline=mapPoints(NG);
  const stateGuides=[
    [[4.15,12.95],[5.15,12.2],[5.75,11.25],[6.9,11.15]],
    [[6.9,13.52],[7.0,12.25],[7.35,11.15],[7.4,10.5]],
    [[8.35,13.44],[8.55,12.3],[8.5,11.2],[8.55,10.2],[8.53,9.0],[8.53,7.73]],
    [[10.1,13.34],[10.0,12.2],[10.4,11.1],[10.7,10.1],[10.8,8.9]],
    [[12.2,13.43],[12.05,12.2],[12.45,11.1],[12.8,10.1],[13.2,9.1]],
    [[3.0,10.15],[4.25,10.05],[5.3,9.6],[6.56,9.61],[7.5,9.1]],
    [[3.0,8.2],[4.3,8.35],[5.25,7.62],[6.2,7.07],[6.74,7.8]],
    [[3.2,5.15],[4.35,5.9],[5.2,6.5],[6.2,6.2],[7.0,6.0]],
    [[7.0,6.0],[7.9,6.3],[8.8,6.1],[9.6,5.8],[10.7,5.1]],
    [[8.53,7.73],[9.8,7.2],[10.9,7.4],[12.0,7.2]],
    [[9.25,13.28],[9.4,12.0],[9.84,10.31],[9.7,9.0],[9.8,7.2]],
    [[5.75,11.25],[6.56,9.61],[6.74,7.8],[5.75,6.1]]
  ];
  const roads=[
    [[3.4,6.5],[3.9,7.4],[4.54,8.5],[6.74,7.8],[7.5,9.1],[8.5,12.0]],
    [[7.5,9.1],[7.4,10.5],[8.5,12.0],[9.84,10.31],[11.17,10.29],[12.46,9.2]],
    [[7.5,9.1],[6.56,9.61],[6.21,7.07],[6.15,6.78],[5.48,7.03]],
    [[7.5,9.1],[8.53,7.73],[11.37,8.89]],
    [[5.2,7.25],[3.9,7.4],[3.35,7.15]],
    [[6.74,7.8],[8.53,7.73],[9.0,9.9],[9.84,10.31]]
  ];
  const rivers=[
    [[4.25,13.0],[4.7,12.0],[5.15,11.1],[5.65,10.3],[6.15,9.45],[6.58,8.65],[6.74,7.8],[6.45,7.05],[6.15,6.35],[5.85,5.7],[5.55,5.05],[5.35,4.45]],
    [[11.55,7.45],[10.7,7.12],[9.85,7.2],[9.0,7.35],[8.15,7.55],[7.4,7.68],[6.74,7.8]]
  ];
  const guides=stateGuides.map(p=>'<path d="'+mapPath(p)+'" class="map-state-line"/>').join('');
  const roadLines=roads.map(p=>'<path d="'+mapPath(p)+'" class="map-road-line"/>').join('');
  const riverLines=rivers.map(p=>'<path d="'+mapPath(p)+'" class="map-river-line"/>').join('');
  let pins='';
  for(const k of cityOrder){
    const c=CITIES[k],p=mapXY(c.lon,c.lat),open=isCityUnlocked(k),sel=k===hubCity;
    const done=cityMissions(k).filter(m=>P.done[m.id]).length,total=cityMissions(k).length;
    const color=k==='kitcity'?'#F4C76B':(total>0&&done===total)?'#72E0B0':open?'#53DDF0':'#718093';
    const off=MAP_OFFSETS[k]||(p.x>280?[-8,-8]:[8,-7]);
    const showLabel=sel||MAP_LABELS.has(k);
    const lx=p.x+off[0],ly=p.y+off[1],anchor=off[0]<0?'end':'start';
    const label=showLabel?'<path d="M'+p.x.toFixed(1)+' '+p.y.toFixed(1)+' L'+(p.x+off[0]*.62).toFixed(1)+' '+(p.y+off[1]*.62).toFixed(1)+'" class="map-label-leader"/><text x="'+lx.toFixed(1)+'" y="'+ly.toFixed(1)+'" text-anchor="'+anchor+'" class="map-city-label'+(sel?' selected':'')+'">'+escMapText(c.name)+'</text>':'';
    pins+='<g data-a="city" data-v="'+k+'" role="button" aria-label="'+escMapText(c.name)+(open?'':' locked')+'" tabindex="0" class="map-city'+(sel?' selected':'')+'" style="cursor:'+(open?'pointer':'not-allowed')+'">'+
      (sel?'<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="8.2" class="map-selected-ring"/>':'')+
      '<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="'+(sel?4.5:(k==='kitcity'?4:2.8))+'" fill="'+color+'" class="map-city-dot"/>'+
      '<title>'+escMapText(k==='kitcity'?'FINAL DESTINATION · KitCity':c.name)+' · '+done+'/'+total+' missions</title>'+label+'</g>';
  }
  return '<section class="map-card"><div class="map-card-head"><div><span>EXPLORE NIGERIA</span><h2>City Map</h2></div><b>'+cityOrder.length+' cities</b></div>'+
    '<svg viewBox="0 0 360 300" class="map" role="img" aria-label="Interactive geographic overview of Nigeria. Select a labelled city marker or use the city list below to view missions">'+
    '<defs><linearGradient id="landFill" x1="0" y1="0" x2="0.9" y2="1"><stop offset="0%" stop-color="#263A42"/><stop offset="100%" stop-color="#202D35"/></linearGradient><linearGradient id="seaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#132C3A"/><stop offset="100%" stop-color="#0D202C"/></linearGradient></defs>'+
    '<rect width="360" height="300" rx="14" fill="url(#seaFill)"/>'+
    '<path d="M0 256 Q60 247 110 262 T220 258 T360 263 V300 H0Z" fill="#153A47" opacity=".58"/>'+
    '<polygon points="'+outline+'" fill="url(#landFill)" stroke="#82949A" stroke-width="1.5" stroke-linejoin="round"/>'+
    guides+riverLines+roadLines+
    '<text x="26" y="22" class="map-map-title">NIGERIA</text><text x="26" y="34" class="map-map-subtitle">CITY NETWORK</text>'+
    '<g transform="translate(330 24)" class="map-north"><path d="M0 13 L6 0 L12 13 L6 10Z" fill="#D8E6E9"/><text x="6" y="24" text-anchor="middle">N</text></g>'+
    pins+'</svg>'+
    '<div class="map-legend"><span><i class="map-dot unlocked"></i>Unlocked</span><span><i class="map-dot completed"></i>Completed</span><span><i class="map-dot locked"></i>Locked</span><span class="map-legend-note">Tap a labelled city to explore</span></div></section>';
}

function renderHub(){
  $('#hubTop').innerHTML=tx('<span class="wm"><img class="header-logo" src="https://i.postimg.cc/qqbdTXky/file-00000000958881f4a776df689a235dec.png" alt="KitCity" /></span><div class="lvl"><b>Wallet</b><div class="balance-line"><strong>'+P.usdc.toFixed(2)+' USDC</strong><small>Storyline not published</small></div>'+'</div>');
  document.querySelectorAll('#nav [data-v="kitlab"]').forEach(b=>b.remove());
  if(hubTab==='kitlab'||hubTab==='cityhub') hubTab='missions';
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===hubTab));
  let h='';
  if(hubTab==='missions'){
    h+='<section class="card empty-storyline" aria-live="polite"><div class="ch"><div><b>Storyline in preparation</b><small>The mission catalogue is empty. New content will appear here when it is ready.</small></div></div></section>';
  } else if(hubTab==='passport'){
    h+='<div class="card empty-storyline"><div class="ch"><div><b>No mission records</b><small>Badges and journey progress will appear when a new storyline is ready.</small></div></div></div>';
    h+='<div class="h2">Wallet</div>'+(P.wallet?'<div class="stat"><span>Address</span><b style="font-family:ui-monospace,Menlo,monospace;font-size:13px">'+short(P.wallet)+'</b></div><div class="stat"><span>USDC</span><b>'+P.usdc.toFixed(2)+'</b></div><div class="stat"><span>Naira token</span><b>'+fmtN(P.ngn)+'</b></div>':'<p class="soft">Wallet tools will appear here when available.</p>');
  } else {
    h+='<div class="h2">Settings</div><div class="card"><div class="ch"><div><b>Language</b><small>Choose how the game talks to you.</small></div></div><div class="language-switch" role="group" aria-label="Choose language"><button class="lang-option '+(P.lang==='en'?'on':'')+'" data-a="lang" data-v="en" type="button" aria-label="English">EN</button><button class="lang-option '+(P.lang==='pcm'?'on':'')+'" data-a="lang" data-v="pcm" type="button" aria-label="Naija Pidgin">PID</button><button class="lang-option '+(P.lang==='ig'?'on':'')+'" data-a="lang" data-v="ig" type="button" aria-label="Igbo">IG</button><button class="lang-option '+(P.lang==='ha'?'on':'')+'" data-a="lang" data-v="ha" type="button" aria-label="Hausa">HA</button></div></div></div>';
    h+='<div class="card"><div class="ch"><div><b>Graphics</b><small>High has real sun shadows and cinematic lighting. Low uses fewer pixels and no shadows, so it runs better on older phones.</small></div></div><div class="cf"><span>'+(P.low?'Low':'High')+'</span><button class="btn line" data-a="quality" type="button">Switch to '+(P.low?'High':'Low')+'</button></div></div>';
    const tg=(k,t,d)=>'<div class="card"><div class="ch"><div><b>'+t+'</b><small>'+d+'</small></div></div><div class="cf"><span>'+(P[k]?'On':'Off')+'</span><button class="btn line" data-a="snd" data-v="'+k+'" type="button">Turn '+(P[k]?'off':'on')+'</button></div></div>';
    h+=tg('music','Music','City-based Nigerian music from YouTube. Needs internet.')+'<div class="card"><div class="ch"><div><b>Playlist</b><small>Paste any public YouTube playlist link to use your own songs.</small></div></div><input id="plIn" type="url" inputmode="url" placeholder="https://www.youtube.com/playlist?list=..." value="'+(P.pl||'').replace(/"/g,'&quot;')+'" style="width:100%;margin-top:10px;padding:11px;border-radius:6px;border:2px solid rgba(255,255,255,.35);background:#1B1C20;color:#fff;font:14px system-ui"><div class="row"><button class="btn brand" data-a="plset" type="button">Use playlist</button><button class="btn line" data-a="plnext" type="button">Skip song</button><button class="btn line" data-a="pldef" type="button">Default</button></div></div>'+tg('sfx','Sound effects','Footsteps, chimes and voices.');
    h+='<div class="card"><div class="ch"><div><b>How to play</b><small>Move with the left stick or WASD. Hold Run or Shift to run. Tap Talk or press E near a glowing person. The arrow points to your goal. Avoid traffic.</small></div></div></div>';
    h+='<div class="card"><div class="ch"><div><b>About the streets</b><small>Street and district names are inspired by real places in each city. The layout is a stylised grid, not a survey map.</small></div></div></div>';
    h+='<div class="card"><div class="ch"><div><b>Reset progress</b><small>Erases saved game data and your wallet on this device.</small></div></div><div class="cf"><span>'+(resetArm?'Tap again to confirm':'')+'</span><button class="btn line" data-a="reset" type="button">'+(resetArm?'Yes, erase everything':'Reset')+'</button></div></div>';
    h+='';
  }
  $('#hubBody').innerHTML=tx(h);
  /* Render only missions present in the active registry. */
  const hubBody=$('#hubBody');
  const currentMissionIds=new Set(MISSIONS.map(m=>m.id)),renderedMissionIds=new Set();
  hubBody.querySelectorAll('.mission-card').forEach(card=>{
    const id=card.dataset.missionId;
    if(!id||!currentMissionIds.has(id)||renderedMissionIds.has(id)) card.remove();
    else renderedMissionIds.add(id);
  });
  const retiredFocusClass=['web3','focus'].join('-');
  hubBody.querySelectorAll('[class*="'+retiredFocusClass+'"],[data-legacy-mission],.legacy-mission-card,.old-mission-card,.mission-card-old').forEach(node=>node.remove());
  const focusLabelPattern=new RegExp(['web3','\\s*','focus'].join(''),'ig');
  const textWalker=document.createTreeWalker(hubBody,NodeFilter.SHOW_TEXT),staleTextNodes=[];
  while(textWalker.nextNode()){
    const node=textWalker.currentNode;
    if(focusLabelPattern.test(node.nodeValue||'')){staleTextNodes.push(node);focusLabelPattern.lastIndex=0;}
  }
  staleTextNodes.forEach(node=>{node.nodeValue=(node.nodeValue||'').replace(focusLabelPattern,'').trim();});
  hubBody.querySelectorAll('.card,article,section').forEach(node=>{
    if(!node.matches('.map-card,.destination-card,.mission-card')&&!node.textContent.trim()&&!node.querySelector('button,svg,img')) node.remove();
    else if(!node.matches('.mission-card')&&/mission\s+\d+\s*:/i.test(node.textContent||'')) node.remove();
  });
  if(hubTab==='missions') hubBody.querySelectorAll('.card:not(.mission-card),article:not(.mission-card)').forEach(node=>node.remove());
}
$('#hub').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest('.map g[data-a="city"]')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
$('#hub').addEventListener('click',async e=>{
  const b=e.target.closest('[data-a]'); if(!b) return;
  const a=b.dataset.a,v=b.dataset.v;
  if(a==='tab'){ hubTab=v; resetArm=false; renderHub(); $('#hubBody').scrollTop=0; }
  else if(a==='city'){ if(!isCityUnlocked(v)){ toast('That mission is not available yet.'); return; } hubCity=v; hubTab='missions'; renderHub(); }
  else if(a==='cityhub'){ hubTab='missions'; renderHub(); $('#hubBody').scrollTop=0; }
  else if(a==='signout'){
    try{
      const user=getCurrentAuthUser();
      if(user&&activeUid===user.uid){
        try{ await flushCloudProgress(user.uid,progressSnapshot()); }
        catch(syncError){ console.warn('KitCity sign-out continuing; local progress is saved.',syncError); }
      }
      await signOutCurrentUser();
      cloudSyncReady=false;
      $('#hub').classList.add('hidden');
      $('#hub').setAttribute('aria-hidden','true');
      $('#title').classList.remove('hidden');
      $('#hud').classList.add('hidden');
      S.phase='title'; G=null;
      if(playerPasswordInput) playerPasswordInput.value='';
      updateAuthButton();
    }catch(error){ toast('Could not sign out. Please try again.'); }
  }
  else if(a==='play'){ startMission(v); }
  else if(a==='quality'){ P.low=!P.low; save(); setPR(); setShadows(); resize(); renderHub(); }
  else if(a==='cert'){ certificate(); }
  else if(a==='lang'){ P.lang=v; save(); applyLang(); Snd.sfx('click'); }
  else if(a==='plset'){ const v=($('#plIn').value||'').trim(); if(!YT.parseId(v)){ toast('That is not a YouTube playlist link'); } else { YT.setList(v); toast('Playlist loaded'); } Snd.sfx('click'); }
  else if(a==='pldef'){ YT.setList(''); renderHub(); toast('Default playlist'); Snd.sfx('click'); }
  else if(a==='plnext'){ YT.next(); }
  else if(a==='snd'){ P[v]=!P[v]; save(); Snd.set(v,P[v]); Snd.sfx('click'); renderHub(); }
  else if(a==='reset'){
    if(!resetArm){ resetArm=true; renderHub(); return; }
    Store.del(KEY); Object.assign(P,{wallet:null,usdc:0,ngn:0,done:{},dodged:0,fell:0,scores:{},web3:null,storyProgress:{},storyFlags:{}}); save(); resetArm=false; hubCity='lagos'; hubTab='missions'; renderHub(); toast('Progress erased');
  }
});
const LOCAL_GUEST_TEST=process.env.NODE_ENV==='development'&&window.location.hostname==='localhost';
const playerNameInput=$('#playerName');
const playerNameError=$('#playerNameError');
const playerEmailInput=$('#playerEmail');
const playerPasswordInput=$('#playerPassword');
const shareLocationInput=$('#shareLocation');
let authMode='signin';
let authBusy=false;
if(playerNameInput){ playerNameInput.value=P.name||''; }
function updateAuthButton(){
  const signedIn=!!getCurrentAuthUser();
  const startButton=$('#startBtn');
  if(startButton) startButton.textContent=signedIn?'Continue to KitCity':(authMode==='signup'?'Create account & enter KitCity':'Sign in & enter KitCity');
  const passwordLabel=document.querySelector('label[for="playerPassword"]');
  if(playerPasswordInput) playerPasswordInput.required=!signedIn;
  if(passwordLabel) passwordLabel.textContent=signedIn?'PASSWORD (NOT NEEDED FOR THIS SESSION)':'PASSWORD';
}
function setAuthMode(mode){
  authMode=mode==='signup'?'signup':'signin';
  document.querySelectorAll('[data-auth-mode]').forEach(b=>b.classList.toggle('on',b.dataset.authMode===authMode));
  if(playerPasswordInput) playerPasswordInput.autocomplete=authMode==='signup'?'new-password':'current-password';
  updateAuthButton();
}
document.querySelectorAll('[data-auth-mode]').forEach(b=>b.addEventListener('click',()=>setAuthMode(b.dataset.authMode)));
const signInPageButton=$('#signInPageBtn');
if(signInPageButton) signInPageButton.addEventListener('click',()=>{ window.location.href='/auth'; });
const authOpenButton=$('#authOpenBtn');
const authBackButton=$('#authBackBtn');
if(authOpenButton) authOpenButton.addEventListener('click',()=>{
  $('#title').classList.add('auth-open');
  setAuthMode('signin');
  if(playerEmailInput) playerEmailInput.focus({preventScroll:true});
});
if(authBackButton) authBackButton.addEventListener('click',()=>{
  $('#title').classList.remove('auth-open');
  if(playerNameError) playerNameError.textContent='';
});
function deviceInstallId(){
  const key='kitcity_install_id';
  try{
    let id=window.localStorage.getItem(key);
    if(!id){ id=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():'kc-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2); window.localStorage.setItem(key,id); }
    return id;
  }catch(e){ return 'kc-session-'+Math.random().toString(36).slice(2); }
}
async function approximateLocation(){
  if(!shareLocationInput||!shareLocationInput.checked||!navigator.geolocation) return null;
  try{
    const position=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:false,timeout:7000,maximumAge:600000}));
    return {
      latitude:Math.round(position.coords.latitude*100)/100,
      longitude:Math.round(position.coords.longitude*100)/100,
      accuracy:Math.max(1000,Math.round(position.coords.accuracy||1000))
    };
  }catch(e){ return null; }
}
function authErrorMessage(error){
  const code=error&&error.code||'';
  if(code==='auth/email-already-in-use') return 'An account already uses this email. Sign in instead.';
  if(code==='auth/invalid-credential'||code==='auth/wrong-password'||code==='auth/user-not-found') return 'Email or password is incorrect.';
  if(code==='auth/weak-password') return 'Choose a stronger password with at least 8 characters.';
  if(code==='auth/invalid-email') return 'Enter a valid email address.';
  if(code==='auth/too-many-requests') return 'Too many attempts. Wait a little and try again.';
  return error&&error.message?error.message:'Could not sign in right now. Check your connection and try again.';
}
async function submitPlayerName(){
  if(authBusy) return;
  if(LOCAL_GUEST_TEST&&!firebaseConfigured){
    const candidate=(playerNameInput&&playerNameInput.value||'KitTester01').trim();
    if(!/^[A-Za-z0-9_]{3,20}$/.test(candidate)){
      if(playerNameError) playerNameError.textContent='Use 3–20 letters, numbers, or underscores for your gamer ID.';
      return;
    }
    P.name=candidate; cloudSyncReady=false; activeUid=null; storageKey=KEY;
    Store.set('kitcity_player_name',candidate); Store.set('kitcity_local_guest_test',true);
    save(); beginGame(); return;
  }
  if(!firebaseConfigured){
    if(playerNameError) playerNameError.textContent='Firebase is not configured yet. Add the NEXT_PUBLIC_FIREBASE_* settings in Vercel and deploy the Firestore rules before signing in.';
    return;
  }
  const candidate=(playerNameInput&&playerNameInput.value||'').trim();
  if(!/^[A-Za-z0-9_]{3,20}$/.test(candidate)){
    if(playerNameError) playerNameError.textContent='Use 3–20 letters, numbers, or underscores for your gamer ID.';
    if(playerNameInput) playerNameInput.focus();
    return;
  }
  const email=(playerEmailInput&&playerEmailInput.value||'').trim();
  const password=(playerPasswordInput&&playerPasswordInput.value||'');
  const existing=await waitForAuthState();
  if(!existing&&(!email||!password)){
    if(playerNameError) playerNameError.textContent='Enter your email and password to continue.';
    return;
  }
  if(!existing&&password.length<8){
    if(playerNameError) playerNameError.textContent='Your password must contain at least 8 characters.';
    return;
  }
  authBusy=true;
  const button=$('#startBtn');
  if(button){ button.disabled=true; button.textContent='Securing your account…'; }
  try{
    const location=await approximateLocation();
    const deviceId=deviceInstallId();
    let user=existing,profile;
    if(user){
      profile=await getOrCreateUserProfile(user,candidate,deviceId,location);
    }else{
      const result=await authenticateEmailPassword({mode:authMode,email,password,username:candidate,deviceId,location});
      user=result.user; profile=result.profile;
    }
    activateUserProgress(user.uid);
    const remote=await loadCloudProgress(user.uid);
    if(remote) mergeCloudProgress(remote);
    P.name=(profile&&typeof profile.username==='string'&&profile.username)||candidate;
    cloudSyncReady=true;
    save();
    if(playerNameError) playerNameError.textContent='';
    beginGame();
  }catch(error){
    if(playerNameError) playerNameError.textContent=authErrorMessage(error);
  }finally{
    authBusy=false;
    if(button) button.disabled=false;
    updateAuthButton();
  }
}
async function resumeAuthenticatedUser(user){
  if(!user||authBusy) return;
  authBusy=true;
  const button=$('#startBtn');
  if(button){ button.disabled=true; button.textContent='Restoring your KitCity session…'; }
  try{
    let savedName='';
    try{ savedName=window.localStorage.getItem('kitcity_player_name')||''; }catch(e){}
    const validName=value=>/^[A-Za-z0-9_]{3,20}$/.test(String(value||''));
    const candidate=validName(savedName)?savedName:(validName(P.name)?P.name:'Player_'+String(user.uid).slice(0,8));
    const profile=await getOrCreateUserProfile(user,candidate,deviceInstallId(),null);
    activateUserProgress(user.uid);
    const remote=await loadCloudProgress(user.uid);
    if(remote) mergeCloudProgress(remote);
    P.name=(profile&&typeof profile.username==='string'&&profile.username)||candidate;
    try{ window.localStorage.setItem('kitcity_player_name',P.name); }catch(e){}
    cloudSyncReady=true;
    save();
    if(playerNameError) playerNameError.textContent='';
    beginGame();
  }catch(error){
    if(playerNameError) playerNameError.textContent='Could not restore your saved session. '+authErrorMessage(error);
  }finally{
    authBusy=false;
    if(button) button.disabled=false;
    updateAuthButton();
  }
}
function beginGame(){
  Snd.unlock(); Snd.setMode('hub'); Snd.sfx('click');
  $('#title').classList.add('hidden');
  $('#hub').classList.remove('hidden');
  $('#hub').setAttribute('aria-hidden','false');
  $('#hud').classList.add('hidden');
  S.phase='hub'; G=null;
  const nextCity=cityOrder.find(city=>!isCityComplete(city));
  if(nextCity) hubCity=nextCity;
  hubTab='missions';
  renderHub();
}
const startGameButton=$('#startBtn');
if(startGameButton) startGameButton.addEventListener('click',submitPlayerName);
if(playerNameInput){
  playerNameInput.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); submitPlayerName(); } });
  playerNameInput.addEventListener('input',()=>{ if(playerNameError) playerNameError.textContent=''; });
}
if(playerEmailInput) playerEmailInput.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); submitPlayerName(); } });
if(playerPasswordInput) playerPasswordInput.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); submitPlayerName(); } });
if(firebaseConfigured){
  waitForAuthState().then(user=>{
    if(user&&playerEmailInput) playerEmailInput.value=user.email||'';
    updateAuthButton();
    if(user) void resumeAuthenticatedUser(user);
  }).catch(()=>updateAuthButton());
}else updateAuthButton();
if(LOCAL_GUEST_TEST&&!firebaseConfigured){
  if(playerNameInput) playerNameInput.value='KitTester01';
  setTimeout(()=>{ void submitPlayerName(); },0);
}
function applyLang(){
  document.documentElement.lang=({pcm:'pcm',ig:'ig',ha:'ha',en:'en'})[P.lang]||'en';
  document.querySelectorAll('[data-t]').forEach(el=>{ if(!el.dataset.en) el.dataset.en=el.textContent; el.textContent=(P.lang==='pcm'&&el.dataset.pcm)?el.dataset.pcm:tr(el.dataset.en); });
  document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('on',b.dataset.lang===P.lang));
  updateAuthButton();
  if(G) updateHUD();
  renderHub();
}
$('#title').addEventListener('click',e=>{ const b=e.target.closest('[data-lang]'); if(!b) return; P.lang=b.dataset.lang; save(); applyLang(); Snd.unlock(); Snd.sfx('click'); });

/* ===================== input ===================== */
const keys={};
let runHeld=false;
const joy={x:0,y:0,active:false,id:null,reset(){ this.active=false; this.id=null; this.x=0; this.y=0; $('#knob').style.transform='translate(0,0)'; }};
{
  const el=$('#joy'),knob=$('#knob'),JR=46;
  const move=e=>{
    const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    let dx=e.clientX-cx,dy=e.clientY-cy; const l=Math.hypot(dx,dy),k=l>JR?JR/l:1; dx*=k; dy*=k;
    knob.style.transform='translate('+dx+'px,'+dy+'px)'; joy.x=dx/JR; joy.y=dy/JR;
  };
  el.addEventListener('pointerdown',e=>{ joy.active=true; joy.id=e.pointerId; try{el.setPointerCapture(e.pointerId);}catch(_){} move(e); });
  el.addEventListener('pointermove',e=>{ if(joy.active&&e.pointerId===joy.id) move(e); });
  const end=e=>{ if(e.pointerId===joy.id) joy.reset(); };
  el.addEventListener('pointerup',end); el.addEventListener('pointercancel',end);
}
{
  const rb=$('#runBtn');
  rb.addEventListener('pointerdown',e=>{ runHeld=true; try{rb.setPointerCapture(e.pointerId);}catch(_){} });
  const off=()=>{ runHeld=false; };
  rb.addEventListener('pointerup',off); rb.addEventListener('pointercancel',off); rb.addEventListener('lostpointercapture',off);
}
window.addEventListener('keydown',e=>{
  keys[e.code]=true;
  if(e.code==='KeyE') interact();
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)&&S.phase==='play') e.preventDefault();
});
window.addEventListener('keyup',e=>{ keys[e.code]=false; });
window.addEventListener('blur',()=>{ for(const k in keys) keys[k]=false; });
document.addEventListener('contextmenu',e=>e.preventDefault());
talkBtn.setAttribute('aria-label','Talk to nearby character');
talkBtn.addEventListener('click',()=>interact());
function interact(){
  if(S.phase!=='play'||S.modal||!nearEnt) return;
  if(typeof nearEnt.talk==='function') nearEnt.talk();
}

/* ===================== collisions ===================== */
function resolve(p,r){
  for(const c of colliders){
    if(p.x<c.x0-r||p.x>c.x1+r||p.z<c.z0-r||p.z>c.z1+r) continue;
    const cx=Math.max(c.x0,Math.min(p.x,c.x1)),cz=Math.max(c.z0,Math.min(p.z,c.z1));
    const dx=p.x-cx,dz=p.z-cz,d2=dx*dx+dz*dz;
    if(d2>=r*r) continue;
    if(d2<1e-6){
      const l=p.x-c.x0,rr2=c.x1-p.x,t=p.z-c.z0,b=c.z1-p.z,m=Math.min(l,rr2,t,b);
      if(m===l) p.x=c.x0-r; else if(m===rr2) p.x=c.x1+r; else if(m===t) p.z=c.z0-r; else p.z=c.z1+r;
    } else { const d=Math.sqrt(d2); p.x=cx+dx/d*r; p.z=cz+dz/d*r; }
  }
}
let hitCd=0,shake=0,fallTimer=0,fallLean=1;
const HAZARD_LINES={
  en:[
    'Yeeh! I don die! Oga driver, who give you licence?',
    'Ah-ah! You dey drive or you dey play FIFA with my body?',
    'Driver! Na road you dey use or you dey settle family beef?',
    'Jesus take the wheel! This driver don turn me to speed bump!',
    'Omo! My ancestors just saw the car and logged out.',
    'Oga, you see human being and press accelerator? Outstanding madness.',
    'I just came to learn crypto, not to become road crypto dust!',
    'Abeg! Who dash this driver steering wheel? Collect am back!',
    'This one no be driving, na live-action demolition!',
    'I don see my village people. Dem dey inside this motor!',
    'Yeeh! My insurance company just block my number!',
    'Oga driver, you dey dodge pothole or you dey dodge sense?',
    'My body get 206 bones, but your driving wan reduce the number!',
    'Who give you licence, your mechanic or your prayer warrior?',
    'I never even cash out my USDC, you wan cash out my soul!',
    'Driver, calm down! Na me be passenger, no be your debt!',
    'If na audition for Fast and Furious, you don fail medicals!',
    'Ah! My spirit don press emergency exit!',
    'You see road user, you think say na bonus level?',
    'Abeg park! Even Google Maps don abandon us!',
    'I see my whole life flash before me, including the ones I never lived!',
    'Oga, this is Lagos road, not a racing game final boss!',
    'My slippers don reach destination before the car!',
    'You dey drive with your eyes closed or na confidence alone?',
    'I just remembered I never tell my people where I dey!',
    'This pothole and this driver dey compete for my downfall!',
    'I came out for fresh air, not emergency landing!'
  ],
  pcm:[
    'Yeeh! I don die! Oga driver, who give you licence?',
    'Ah-ah! You dey drive or you dey play FIFA with my body?',
    'Driver! Na road you dey use settle family beef?',
    'Jesus take wheel! This driver don turn me to speed bump!',
    'Omo! My ancestors don log out since dem see this motor.',
    'Oga, you see human being come press accelerator? Madness!',
    'I come learn crypto, no be to become road dust!',
    'Abeg, who dash this driver steering? Collect am back!',
    'This one no be driving, na live-action demolition!',
    'My village people dey inside this motor, I don confirm am!',
    'Yeeh! My insurance people don block my number!',
    'Oga rider, you dey avoid pothole or you dey avoid sense?',
    'My bones no be suya stick, abeg drive with sense!',
    'I never cash out my USDC, you wan cash out my soul!',
    'Na me be passenger, no be your enemy for road!',
    'If na Fast and Furious audition, you don fail medical!',
    'Even Google Maps don abandon us, driver!',
    'Ah! My spirit don press emergency exit!',
    'You see human being, you think say na bonus level?',
    'Abeg park! Your steering dey write obituary!',
    'My slippers don reach house before me!',
    'Oga, this na Lagos road, no be game final boss!',
    'You dey drive with your eyes closed or na faith alone?',
    'I never even send my location to my people!',
    'This pothole and this motor dey plan my downfall together!',
    'I come outside for fresh air, no be emergency landing!'
  ]
};
function carHit(dt){ if(hitCd>0)hitCd=Math.max(0,hitCd-dt);
  if(fallTimer>0){fallTimer=Math.max(0,fallTimer-dt);player.rotation.z=fallLean*1.25*Math.min(1,(1.5-fallTimer)*8);if(fallTimer===0){player.rotation.z=0;if(hazardSpeechActive)pendingFeetLine=true;else toast('Back on your feet. Watch the traffic.');}return;}
  player.rotation.z=0;if(hitCd>0)return;const p=player.position;
  for(const c of cars){const hx=c.axis==='x'?c.hl:c.hw,hz=c.axis==='x'?c.hw:c.hl,cx=c.m.position.x,cz=c.m.position.z;
    if(Math.abs(p.x-cx)<hx+.9&&Math.abs(p.z-cz)<hz+.9){
      if(c.axis==='x')p.z=cz+(p.z>=cz?1:-1)*(hz+3.5);else p.x=cx+(p.x>=cx?1:-1)*(hx+3.5);
      hitCd=2.2;fallTimer=1.5;fallLean=(p.x-cx)>=0?1:-1;shake=1.2;
      Snd.sfx('bump');
      resolve(p,1);resolve(p,1);
      const shout=pick(HAZARD_LINES[P.lang==='pcm'?'pcm':'en']);
      if(G){
        G.lives=Math.max(0,(Number.isFinite(G.lives)?G.lives:3)-1);
        updateLivesHUD();
      }
      if(G&&G.lives===0){
        const missionId=G.m.id;
        hitCd=999;
        toast('Three hits. This mission starts again — you can get it next time.',{bubble:true,duration:1800});
        setTimeout(()=>{if(G&&G.m.id===missionId&&S.phase==='play')startMission(missionId,true);},1900);
      }else{
        toast(shout,{bubble:true,duration:3200});
      }
      break;
    }
  }
}
function segHits(a,b,bx){
  if(Math.max(a.x,b.x)<bx.x0||Math.min(a.x,b.x)>bx.x1||Math.max(a.z,b.z)<bx.z0||Math.min(a.z,b.z)>bx.z1) return false;
  let t0=0,t1=1;
  const test=(p,d,lo,hi)=>{
    if(Math.abs(d)<1e-8) return p>=lo&&p<=hi;
    let ta=(lo-p)/d,tb=(hi-p)/d; if(ta>tb){ const t=ta; ta=tb; tb=t; }
    t0=Math.max(t0,ta); t1=Math.min(t1,tb); return t0<=t1;
  };
  return test(a.x,b.x-a.x,bx.x0,bx.x1)&&test(a.y,b.y-a.y,0,bx.y1)&&test(a.z,b.z-a.z,bx.z0,bx.z1);
}
const head=new THREE.Vector3();
function fadeBuildings(dt,active){
  head.set(player.position.x,2.8,player.position.z);
  for(const b of buildings){
    const target=(active&&segHits(camera.position,head,b.box))?.2:1;
    b.o+=(target-b.o)*Math.min(1,dt*10);
    const op=Math.abs(b.o-target)<.01?target:b.o;
    for(const m of b.mats){ m.opacity=op; m.depthWrite=op>.99; }
  }
}

/* ===================== loop ===================== */
const clock=new THREE.Clock();
const camTarget=new THREE.Vector3(),camDesired=new THREE.Vector3();
let lastDist=-1;
function inputVec(){
  let x=0,z=0;
  if(keys.KeyA||keys.ArrowLeft) x-=1; if(keys.KeyD||keys.ArrowRight) x+=1;
  if(keys.KeyW||keys.ArrowUp) z-=1; if(keys.KeyS||keys.ArrowDown) z+=1;
  const l=Math.hypot(x,z); if(l>0){ x/=l; z/=l; }
  if(joy.active){ x=joy.x; z=joy.y; }
  return {x,z};
}
/* ---- pedestrians: walking, pairs, crossers, chats, greetings, buying from hawkers ---- */
function bubble(pos,h,pool,life){ const sp=barkPool[pick(pool)]; if(sp&&!sp.visible&&barkActive.length<4){ sp.visible=true; barkActive.push({sp:sp,t:{pos:pos,h:h||5.6},life:life||2.6}); } }
function gesture(p,t,amt){ const u=p.userData,sn=Math.sin(t*5.2); u.armR.sh.rotation.x=-1.1+sn*.35*amt; u.armR.elbow.rotation.x=-(1+Math.sin(t*5.2+1)*.25*amt); u.upper.rotation.y=Math.sin(t*2.1)*.12; u.head.rotation.y=Math.sin(t*1.7)*.18; }
function waveArm(p,t){ const u=p.userData; u.armR.sh.rotation.x=-2.7; u.armR.elbow.rotation.x=-(.5+Math.sin(t*10)*.45); u.head.rotation.y=0; }
function faceTo(g,x,z){ g.rotation.y=Math.atan2(x-g.position.x,z-g.position.z); }
function roadClear(w){
  for(const c of cars){
    if(c.axis!==w.axis||Math.abs(c.lane-w.coord)>5) continue;
    const rel=(w.cc-c.pos)*c.dir;
    if(rel>-(c.hl+3)&&rel<14+c.speed*.7) return false;
  }
  return true;
}
function crosserStep(w,dt){
  const g=w.g,p=g.position,to=w.fwd?w.B:w.A;
  if(w.state==='rest'){ w.timer-=dt; if(w.near) animatePerson(g,0,0,0); if(w.timer<=0) w.state='wait'; return; }
  if(w.state==='wait'){ faceTo(g,to.x,to.z); if(w.near) animatePerson(g,0,0,0); if(roadClear(w)) w.state='cross'; return; }
  const dx=to.x-p.x,dz=to.z-p.z,d=Math.hypot(dx,dz),st=w.sp*dt;
  if(d<=st){ p.x=to.x; p.z=to.z; w.fwd=!w.fwd; w.state='rest'; w.timer=rand(2,6); return; }
  p.x+=dx/d*st; p.z+=dz/d*st; g.rotation.y=Math.atan2(dx,dz); w.ph+=dt*w.sp*2.4; if(w.near) animatePerson(g,w.ph,1,0);
}
function updateStoryNPCActors(dt,time){
  for(const actor of storyNPCActors){
    if(!actor||!actor.parent) continue;
    const u=actor.userData||{},phase=(u.storyPhase||0)+time*.72;
    const ax=u.storyAnchorX==null?actor.position.x:u.storyAnchorX;
    const az=u.storyAnchorZ==null?actor.position.z:u.storyAnchorZ;
    actor.position.x=ax+Math.sin(phase)*.22;
    actor.position.z=az+Math.sin(phase*.63+(u.storyPhase||0))*.16;
    if(u.storyNameLabel) u.storyNameLabel.position.set(actor.position.x,4.15,actor.position.z);
    const close=G&&Math.hypot(player.position.x-actor.position.x,player.position.z-actor.position.z)<9;
    if(close){
      actor.rotation.y=Math.atan2(player.position.x-actor.position.x,player.position.z-actor.position.z);
      animatePerson(actor,time*1.35+(u.storyPhase||0),.12,.012);
      const gestureCycle=(time+(u.storyGestureAt||0))%6.5;
      if(gestureCycle<1.15) gesture(actor,time+(u.storyPhase||0),.45);
      if(u.head) u.head.rotation.y=Math.sin(time*1.1+(u.storyPhase||0))*.1;
    }else{
      actor.rotation.y+=Math.sin(time*.45+(u.storyPhase||0))*dt*.12;
      animatePerson(actor,time*.8+(u.storyPhase||0),.055,0);
    }
  }
}
function updateWalkers(dt,time){
  const pp=player.position,play=S.phase==='play',rx=play?pp.x:25,rz=play?pp.z:-55;
  for(const w of walkers){
    const g=w.g,p=g.position,ddx=p.x-rx,ddz=p.z-rz;
    w.near=ddx*ddx+ddz*ddz<95*95; g.visible=w.near;
    if(w.type==='cross'){ crosserStep(w,dt); continue; }
    w.cd-=dt;
    if(w.state==='talk'||w.state==='buy'||w.state==='wave'){
      w.timer-=dt;
      if(w.near){ animatePerson(g,0,0,0); if(w.state==='wave') waveArm(g,time+w.ph); else gesture(g,time+w.ph,w.listener?.25:1); }
      if(w.timer<=0){ w.state='walk'; w.cd=rand(14,30); }
      continue;
    }
    if(w.state==='goto'){
      const dx=w.target.x-p.x,dz=w.target.z-p.z,d=Math.hypot(dx,dz),st=w.sp*dt;
      if(d<2.6){ w.state='buy'; w.timer=rand(3,5); faceTo(g,w.target.x,w.target.z); bubble(w.target,5.6,barkSet.hawk,2.8); }
      else { p.x+=dx/d*st; p.z+=dz/d*st; g.rotation.y=Math.atan2(dx,dz); w.ph+=dt*w.sp*2.4; if(w.near) animatePerson(g,w.ph,1,0); }
      continue;
    }
    w.rem-=w.sp*dt; if(w.rem<=0){ w.dir.multiplyScalar(-1); w.rem=rand(18,40); }
    p.x+=w.dir.x*w.sp*dt; p.z+=w.dir.z*w.sp*dt;
    g.rotation.y=Math.atan2(w.dir.x,w.dir.z); w.ph+=dt*w.sp*2.4;
    if(w.near){ animatePerson(g,w.ph,1,0); if(w.type==='pair'&&((time*.4+w.ph*.3)%5)<1.8) gesture(g,time+w.ph,.8); }
    if(!w.near||w.type!=='walk'||w.cd>0) continue;
    if(play&&!S.modal&&ddx*ddx+ddz*ddz<36&&Math.random()<dt*.8){
      w.state='wave'; w.timer=1.9; w.cd=rand(30,50); faceTo(g,pp.x,pp.z); bubble(p,5.6,barkSet.barks,2.2); continue;
    }
    let met=false;
    for(const o of walkers){
      if(o===w||o.type!=='walk'||o.state!=='walk'||o.cd>0) continue;
      const ex=o.g.position.x-p.x,ez=o.g.position.z-p.z;
      if(ex*ex+ez*ez<10&&w.dir.dot(o.dir)<-.3){
        if(Math.random()<.7){
          const t=rand(4,8); w.state=o.state='talk'; w.timer=o.timer=t; w.listener=false; o.listener=true;
          faceTo(g,o.g.position.x,o.g.position.z); faceTo(o.g,p.x,p.z); bubble(p,5.6,barkSet.barks,2.8);
          w.cd=o.cd=rand(20,40);
        } else { w.cd=o.cd=4; }
        met=true; break;
      }
    }
    if(met||!hawkers.length||Math.random()>dt*.12) continue;
    for(const h of hawkers){
      const hx=h.x-p.x,hz=h.z-p.z,along=hx*w.dir.x+hz*w.dir.z,lat=Math.abs(hx*w.dir.z-hz*w.dir.x);
      if(lat<3&&along>2&&along<18){ w.state='goto'; w.target=h; break; }
    }
  }
}
function update(dt,time){
  updateCars(dt);
  updateWalkers(dt,time);
  { const play=S.phase==='play',fx=play?player.position.x:25,fz=play?player.position.z:-55;
    sun.position.set(fx+LKS.sx,LKS.sy,fz+LKS.sz); sun.target.position.set(fx,0,fz); sun.target.updateMatrixWorld(); atmoUpdate(dt,time,fx,fz);
    if(missionGroup.children.length!==mgCount){ mgCount=missionGroup.children.length; flagShadows(missionGroup); flagShadows(player); } }
  for(const s of smoke){
    const ph=(time*.35+s.m.userData.ph)%1;
    s.m.position.set(s.x+s.m.userData.ox,2.2+ph*4.6,s.z+s.m.userData.oz); s.m.scale.setScalar(.8+ph*2); s.m.material.opacity=.5*(1-ph);
  }
  if(S.phase!=='play'){
    const a=time*.1;
    camera.position.set(25+Math.cos(a)*75,34,-55+Math.sin(a)*75);
    camera.lookAt(25,2,-55);
    fadeBuildings(dt,false);
    return;
  }
  if(!S.modal){
    if(fallTimer>0){carHit(dt);animatePerson(player,0,0,0);}
    else {
    const inp=inputVec(),len=Math.hypot(inp.x,inp.z);
    if(len>.08){
      const run=keys.ShiftLeft||keys.ShiftRight||runHeld;
      const sp=(run?13:7.8)*Math.min(1,len),dx=inp.x/len,dz=inp.z/len;
      const p=player.position; p.x+=dx*sp*dt; p.z+=dz*sp*dt;
      const want=Math.atan2(dx,dz); let diff=want-faceAng; while(diff>Math.PI) diff-=Math.PI*2; while(diff<-Math.PI) diff+=Math.PI*2;
      faceAng+=diff*Math.min(1,dt*14); player.rotation.y=faceAng;
      walkPh+=sp*dt*1.05; animatePerson(player,walkPh,run?1.35:1,run?.2:.06);
      const si=Math.floor((walkPh-Math.PI/2)/Math.PI); if(si!==stepIdx){ stepIdx=si; Snd.sfx('foot',{side:si&1,run:!!run,vol:Math.min(1,.55+len*.45)}); }
    } else { animatePerson(player,0,0,0); }
    const p=player.position;
    resolve(p,1); resolve(p,1);
    p.x=Math.max(-215,Math.min(215,p.x)); p.z=Math.max(-215,Math.min(215,p.z));
    carHit(dt);
    }
  }
  nearEnt=null; let best=1e9;
  updateStoryNPCActors(dt,time);
  /* One malformed or stale NPC must never abort the interaction scan for the
     whole frame. This previously could leave Talk hidden even at the mission marker. */
  for(const e of ents){
    try{
      if(e.object){e.x=e.object.position.x;e.z=e.object.position.z;}
      if(e.hidden||typeof e.active!=='function'||!e.active()) continue;
      const d=Math.hypot(player.position.x-e.x,player.position.z-e.z);
      if(d<(Number(e.r)||0)&&d<best){ best=d; nearEnt=e; }
    }catch(err){
      console.warn('[KitCity mission] Skipping invalid interaction entity',err);
    }
  }
  /* The active objective and its beacon must agree. If a redesigned scene leaves
     the NPC anchor a little offset from its visible label, proximity to that
     objective still exposes the same conversation instead of stranding the player. */
  if(!nearEnt&&S.phase==='play'&&!S.modal&&G){
    const target=ents.find(e=>e._missionTarget&&typeof e.talk==='function');
    if(target){
      const tx=target.object&&target.object.position?target.object.position.x:Number(target.x);
      const tz=target.object&&target.object.position?target.object.position.z:Number(target.z);
      if(Number.isFinite(tx)&&Number.isFinite(tz)&&Math.hypot(player.position.x-tx,player.position.z-tz)<=26){
        nearEnt=target;
      }
    }
  }
  talkBtn.classList.toggle('hidden',!(nearEnt&&!S.modal));
  const compass=$('#compass');
  const stepNow=G&&G.m&&G.m.steps?G.m.steps[G.i]:null;
  const activeNav=ents.find(e=>{try{return e.active&&e.active();}catch(_){return false;}})||null;
  const navCandidates=[goal,activeNav,stepNow&&safeMissionSpot(SPOTS[stepNow.spot]||SPOTS.a),(G&&G.m&&(G.m.city==='lagos'||curCity==='lagos'))?safeMissionSpot(SPOTS.a||{x:0,z:0}):null];
  const navGoal=navCandidates.find(t=>{
    if(!t)return false;
    const x=t.object&&t.object.position?t.object.position.x:t.x;
    const z=t.object&&t.object.position?t.object.position.z:t.z;
    return Number.isFinite(x)&&Number.isFinite(z);
  })||null;
  if(navGoal){
    const gx=navGoal.object&&navGoal.object.position?navGoal.object.position.x:navGoal.x;
    const gz=navGoal.object&&navGoal.object.position?navGoal.object.position.z:navGoal.z;
    if(Number.isFinite(gx)&&Number.isFinite(gz)){
      compass.classList.remove('hidden'); compass.classList.add('force-visible'); compass.style.display='grid'; compass.style.visibility='visible'; compass.style.opacity='1';
      beacon.visible=true; beacon.position.set(gx,0,gz);
      beacon.getObjectByName('ring').scale.setScalar(1+.18*Math.sin(time*4));
      const dx=gx-player.position.x,dz=gz-player.position.z,d=Math.round(Math.hypot(dx,dz));
      $('#arrow').style.transform='rotate('+Math.atan2(dx,-dz)+'rad)';
      if(d!==lastDist){ lastDist=d; $('#dist').textContent=d<9?tr('Here'):Math.round(d/2)+' m'; }
    }
  } else { beacon.visible=false; compass.classList.add('hidden'); compass.classList.remove('force-visible'); compass.style.removeProperty('display'); compass.style.removeProperty('visibility'); compass.style.removeProperty('opacity'); }
  { updateBarks(dt);
    locT-=dt; if(locT<=0){ locT=.3; const n=locName(player.position.x,player.position.z); if(n!==lastLoc){ lastLoc=n; $('#loc').textContent=n; } } }
  camTarget.set(player.position.x,0,player.position.z);
  camDesired.set(camTarget.x,35,camTarget.z+20);
  camera.position.lerp(camDesired,1-Math.pow(.0004,dt));
  if(shake>0){ camera.position.x+=(Math.random()-.5)*shake; camera.position.y+=(Math.random()-.5)*shake*.5; shake=Math.max(0,shake-dt*2); }
  camera.lookAt(camTarget.x,1.5,camTarget.z-1);
  fadeBuildings(dt,true);
}
function tick(){
  requestAnimationFrame(tick);
  const dt=Math.min(clock.getDelta(),.05);
  update(dt,clock.elapsedTime);
  if(GR) GR.render(); else renderer.render(scene,camera);
}
initGrade();
bootStep(42,'Building Lagos…');
setShadows();
buildCity('lagos');
bootStep(78,'Setting up your city…');
applyLang();
bootStep(94,'Almost ready…');
tick();
requestAnimationFrame(()=>bootDone());
}