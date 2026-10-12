import * as THREE from 'three';
import { createStorySceneDirector } from './story-scene-director';
import { MISSION_BY_ID as CHRONICLE_MISSION_BY_ID, MISSIONS as CHRONICLE_MISSIONS, CHARACTER_ORDER } from './story/chronicles';
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
const DEFAULT_PLAYER={wallet:null,usdc:0,ngn:0,done:{},dodged:0,fell:0,low:false,music:true,sfx:true,lang:'en',pl:'',name:'',scores:{},web3:null,storyPrologueSeen:false,chroniclesPrologueSeen:false,storyProgress:{},storyFlags:{}};
let activeUid=Store.get('kitcity_active_uid',null);
let storageKey=activeUid?KEY+'_user_'+activeUid:KEY;
const P=Object.assign({},DEFAULT_PLAYER,Store.get(storageKey,{}));
if(!P.done||typeof P.done!=='object') P.done={};
if(!P.storyProgress||typeof P.storyProgress!=='object') P.storyProgress={};
if(!P.storyFlags||typeof P.storyFlags!=='object') P.storyFlags={};
let cloudSyncReady=false;
function progressSnapshot(){ return {wallet:P.wallet,usdc:P.usdc,ngn:P.ngn,done:P.done,dodged:P.dodged,fell:P.fell,low:P.low,music:P.music,sfx:P.sfx,lang:P.lang,pl:P.pl,name:P.name,scores:P.scores,web3:P.web3,storyPrologueSeen:!!P.storyPrologueSeen,chroniclesPrologueSeen:!!P.chroniclesPrologueSeen,storyProgress:P.storyProgress||{},storyFlags:P.storyFlags||{}}; }
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
  merged.storyPrologueSeen=!!(remote.storyPrologueSeen||local.storyPrologueSeen);
  merged.chroniclesPrologueSeen=!!(remote.chroniclesPrologueSeen||local.chroniclesPrologueSeen);
  merged.storyProgress=Object.assign({},remote.storyProgress||{},local.storyProgress||{});
  merged.storyFlags=Object.assign({},remote.storyFlags||{},local.storyFlags||{});
  replacePlayerState(merged);
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
  afrobeat:{label:'Naija Afrobeats Mix 2026',videos:['bGgjIvWj2I0']},
  'lagos':{label:"Lagos · Soundtrack",videos:["rhrCG0Vtx3g"]},
  'abuja':{label:"Abuja · Contemporary Afrobeats",videos:["XCjU9qbfv1U"]},
  'ph':{label:"Port Harcourt · Niger Delta / Ijaw",videos:["xodanM9AfrI"]},
  'benin':{label:"Benin City · Edo / Delta grooves",videos:["qcBFntpoW4M"]},
  'calabar':{label:"Calabar · Efik / Ibibio",videos:["qbefFtgUVTY"]},
  'jos':{label:"Jos · Plateau / regional Naija",videos:["MsZhYgo9MoA"]},
  'ibadan':{label:"Ibadan · Yoruba / Fuji",videos:["RFPqZKpsl90"]},
  'enugu':{label:"Enugu · Igbo highlife / Afrobeat",videos:["q49JaeHIuF4"]},
  'kano':{label:"Kano · Hausa / Arewa",videos:["6euD2iXZAlg"]},
  'kaduna':{label:"Kaduna · Hausa / Arewa",videos:["w69hlGyNEYI"]},
  'maiduguri':{label:"Maiduguri · Kanuri / Hausa",videos:["N3xkWjh7UNM"]},
  'owerri':{label:"Owerri · Igbo highlife / Afrobeat",videos:["Ra1yHDcJygY"]},
  'aba':{label:"Aba · Igbo highlife / Afrobeat",videos:["Uyr1c0pkpas"]},
  'umuahia':{label:"Umuahia · Igbo highlife / Afrobeat",videos:["W41TT8g3MnQ"]},
  'awka':{label:"Awka · Igbo highlife / Afrobeat",videos:["9aEEIyw34Xw"]},
  'onitsha':{label:"Onitsha · Igbo highlife / Afrobeat",videos:["nMXLMe4_x68"]},
  'asaba':{label:"Asaba · Anioma / Delta",videos:["l-_FcHIS4Yo"]},
  'uyo':{label:"Uyo · Efik / Ibibio",videos:["ulmVmlNoSL8"]},
  'ikot-ekpene':{label:"Ikot Ekpene · Efik / Ibibio",videos:["kc4PfiRWpog"]},
  'yenagoa':{label:"Yenagoa · Niger Delta / Ijaw",videos:["k6eE3c70hgg"]},
  'warri':{label:"Warri · Urhobo / Itsekiri",videos:["DqUd72pK15Y"]},
  'makurdi':{label:"Makurdi · Tiv / Middle Belt",videos:["VmakV_meVY0"]},
  'ilorin':{label:"Ilorin · Yoruba / Fuji",videos:["ZyXvPdVt474"]},
  'akure':{label:"Akure · Yoruba / Fuji",videos:["bcs_jFdPQn4"]},
  'ado-ekiti':{label:"Ado-Ekiti · Yoruba / Fuji",videos:["zzhKmRovdMY"]},
  'osogbo':{label:"Osogbo · Yoruba / Apala & Fuji",videos:["yUUsKekKQLM"]},
  'abeokuta':{label:"Abeokuta · Yoruba / Fuji",videos:["_hKuvfH1j_w"]},
  'lokoja':{label:"Lokoja · Igala / Confluence",videos:["ddXZE34DFbQ"]},
  'lafia':{label:"Lafia · Hausa / Arewa",videos:["aGhY4twLRM"]},
  'bauchi':{label:"Bauchi · Hausa / Arewa",videos:["jwxbXMCHj5c"]},
  'gombe':{label:"Gombe · Hausa / Arewa",videos:["KIkN66oFBns"]},
  'damaturu':{label:"Damaturu · Kanuri / Hausa",videos:["TxRI1o4UCzM"]},
  'jalingo':{label:"Jalingo · Fulfulde / North-East",videos:["qseIbxXwlmg"]},
  'yola':{label:"Yola · Fulfulde / North-East",videos:["cv5chGtfVTg"]},
  'sokoto':{label:"Sokoto · Hausa / Arewa",videos:["1tn8vcSPe70"]},
  'katsina':{label:"Katsina · Hausa / Arewa",videos:["i1uEVNMSalo"]},
  'birnin-kebbi':{label:"Birnin Kebbi · Hausa / Arewa",videos:["UuumEqJKQ9I"]},
  'minna':{label:"Minna · Nupe / Arewa",videos:["WQFDWM-6ytA"]},
  'dutse':{label:"Dutse · Hausa / Arewa",videos:["ULjXLxJa74w"]},
  'gusau':{label:"Gusau · Hausa / Arewa",videos:["hCR54DuQoBM"]},
  'kafanchan':{label:"Kafanchan · Southern Kaduna",videos:["dkPClcO4Whw"]},
  'damboa':{label:"Damboa · Kanuri / Hausa",videos:["hLJcQH_2Onk"]}
};
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
const DEFAULT_PLAYLIST='PLtZ6yiYzu2i3UoRZM3wmw2xpBRM9zYrwP';
const YT=(function(){
  let player=null,ready=false,failed=false,started=false,wantOn=true,duck=false,loading=false,errCount=0,currentKey='afrobeat';

  function parseId(v){
    v=String(v||'').trim(); if(!v) return '';
    const m=v.match(/[?&]list=([A-Za-z0-9_-]+)/); if(m) return m[1];
    return /^[A-Za-z0-9_-]{10,}$/.test(v)?v:'';
  }
  function queue(){
    const custom=parseId(P.pl);
    if(custom) return {label:'Custom YouTube playlist',list:custom,videos:null};
    return MUSIC_QUEUES[currentKey]||MUSIC_QUEUES.lagos;
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
      d.style.cssText='position:fixed;left:-9999px;bottom:0;width:320px;height:180px;opacity:.001;pointer-events:none;z-index:-1';
      d.innerHTML='<div id="ytPlayer"></div>'; document.body.appendChild(d);
    }
  }
  function loadQueue(){
    const q=queue();
    try{
      if(q.videos&&q.videos.length) player.loadPlaylist({playlist:q.videos,index:0});
      else player.loadPlaylist({list:q.list,listType:'playlist',index:0});
      player.setLoop(true); player.setShuffle(true);
    }catch(e){}
  }
  function create(){
    mount();
    player=new window.YT.Player('ytPlayer',{
      width:320,height:180,
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
          if(ev.data===0&&wantOn){ try{ player.nextVideo(); }catch(e){} }
        },
        onError:()=>{
          errCount++;
          if(errCount>8){ failed=true; return; }
          try{ player.nextVideo(); }catch(e){}
        }
      }
    });
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
      const key=CITY_MUSIC[city]||'afrobeat';
      currentKey=key;
      if(ready){
        try{ loadQueue(); if(wantOn) play(); }catch(e){}
      }
    },
    currentLabel(){ return (parseId(P.pl)?'Custom YouTube playlist':(MUSIC_QUEUES[currentKey]||MUSIC_QUEUES.afrobeat).label); },
    setList(v){
      const id=parseId(v);
      P.pl=id===DEFAULT_PLAYLIST?'':(id?String(v).trim():''); save();
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

/* ===================== language: English / Naija Pidgin ===================== */
const L=(en,pcm)=>P.lang==='pcm'?pcm:en;
const PCM={
/*PCM_BEGIN*/
/*PCM_END*/
};
const RULES=[
/*RULES_BEGIN*/
/*RULES_END*/
];
function tr(t){
  if(P.lang!=='pcm'||!t) return t;
  const m=t.match(/^(\s*)([\s\S]*?)(\s*)$/),core=m[2];
  if(!core||!/[A-Za-z]/.test(core)) return t;
  /*MISS*/
  let out=PCM[core];
  if(out===undefined){ for(let i=0;i<RULES.length;i++){ const mm=core.match(RULES[i][0]); if(mm){ out=RULES[i][1].apply(null,mm); break; } } }
  return out===undefined?t:m[1]+out+m[3];
}
function tx(html){
  if(P.lang!=='pcm'||!html) return html;
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
const R=70;
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
  lagos:{styles:[['zinc',.3],['flat',.5],['glass',.1],['admin',.1]],bridges:[[0,-52],[70,-60]],lm:[['theatre',-35,35],['church',35,105]],
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
/* ===================== modern Nigerian city visual pass ===================== */
/* Keep each city's layout, landmarks, traffic and regional character, but remove
   the heavy sepia/rust treatment and give buildings contemporary urban finishes. */
(function modernizeCityVisuals(){
  const coolPalettes={
    coastal:['#E8EFF2','#C6D9DF','#B7CBC7','#D9E5DC','#A9C1D1','#F0F1EA','#91AAB9','#D2DCE4'],
    southwest:['#E9ECEF','#CCD7DD','#B7C9C6','#DCE5D8','#A8BCCC','#F0EEE8','#8EA6B5','#D3DDE2'],
    southeast:['#E7EEF0','#C7D7D8','#B6C9C2','#DCE6D9','#AABED0','#F1EFE8','#8FA6B2','#D2DCE3'],
    north:['#E7EBED','#D0D9DF','#BBCBD4','#E3E8E2','#AFC2CD','#F0F0E9','#94A9B5','#D5DDE2'],
    capital:['#F0F2F3','#D5E0E7','#C0D0D8','#E1E9E5','#A8BFCE','#F3F1EA','#91A8B7','#DCE4E8']
  };
  const northern=new Set(['kano','kaduna','maiduguri','sokoto','katsina','birnin-kebbi','minna','dutse','gusau','damaturu','bauchi','gombe','lafia','jalingo','yola','kafanchan','damboa']);
  const coastal=new Set(['lagos','ph','calabar','uyo','ikot-ekpene','yenagoa','warri','asaba','port-harcourt']);
  const southeast=new Set(['enugu','benin','owerri','aba','umuahia','awka','onitsha','abakaliki','anambra']);
  const capital=new Set(['abuja','jos']);
  const steel=['#6E7C86','#7F8D96','#596A75','#8C989F','#657681','#4D5C66'];
  Object.keys(CITIES).forEach((key,index)=>{
    if(key==='kitcity') return;
    const C=CITIES[key];
    const palette=capital.has(key)?coolPalettes.capital:northern.has(key)?coolPalettes.north:coastal.has(key)?coolPalettes.coastal:southeast.has(key)?coolPalettes.southeast:coolPalettes.southwest;
    const shift=(index*3)%palette.length;
    C.paint=Array.from({length:palette.length},(_,i)=>palette[(i+shift)%palette.length]);
    C.ground='#30363C';
    C.slab='#BFC8CE';
    C.dirt='#78838A';
    C.zinc=steel.slice();
    if(key==='ibadan') C.tag='The city of firsts';
    if(Array.isArray(C.styles)){
      C.styles=C.styles.map(([style,weight])=>[style,weight*(style==='glass'?1.45:style==='admin'?1.25:style==='flat'?1.2:style==='zinc'?.55:style==='banco'?.12:1)]);
      const present=new Set(C.styles.map(x=>x[0]));
      [['flat',.3],['admin',.18],['glass',.16],['zinc',.1]].forEach(([style,weight])=>{if(!present.has(style)) C.styles.push([style,weight]);});
    }else{
      C.styles=[['flat',.48],['admin',.2],['glass',.18],['zinc',.12],['banco',northern.has(key)?.04:.01]];
    }
    const old=LOOK[key]||{};
    const sky=capital.has(key)?{h:'#C9DFEE',z:'#5889B5',sun:'#FFF5E7',cc:'#E9F4FA',hS:'#EAF3F8',hG:'#414B51'}:
      northern.has(key)?{h:'#C8DDF0',z:'#719AC2',sun:'#FFF4E4',cc:'#EDF4F8',hS:'#EAF2F8',hG:'#454B4F'}:
      coastal.has(key)?{h:'#BBDCE4',z:'#5E91A8',sun:'#FFF4E8',cc:'#E5F1F4',hS:'#E7F2F4',hG:'#38494B'}:
      southeast.has(key)?{h:'#C4E0E0',z:'#6595B0',sun:'#FFF4E8',cc:'#E8F4F2',hS:'#E8F3F1',hG:'#3B4A47'}:
      {h:'#C6DCEB',z:'#658FB7',sun:'#FFF4E7',cc:'#EAF3F8',hS:'#EAF2F7',hG:'#424B50'};
    LOOK[key]=Object.assign({},old,sky,{
      paint:C.paint,ground:C.ground,slab:C.slab,dirt:C.dirt,zinc:steel,roof:'#858F97',
      rust:.025,dust:.025,lat:0,mil:Math.min(Number(old.mil)||0,.22),
      fx:old.fx==='rain'?'rain':null,fade:0,grain:.016,bloom:.22,
      sat:1.06,con:1.08,exp:1.04,veil:[sky.h,.025],
      lift:[0,.006,.012],gain:[1.01,1.015,1.02],vig:.2,
      dash:'#E8C95B'
    });
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
function lkAsph(L){ const c=cv(256,256),g=c.getContext('2d'),R=mulberry(311); g.fillStyle='#e2e2e2'; g.fillRect(0,0,256,256); speckle(g,256,256,2800,.5,['#b0b0b0','#fafafa','#8d8d8d','#d0d0d0']);
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
  const L=Object.assign({},LOOK_BASE,LOOK[key]||{}); LKC=L;
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
function roadDecals(C,blocks){
  const L=LKC,dc=L.lat>.3?'#9a5a38':(L.dust>.2?'#cdb48a':'#8a7e6a'),its=[]; const geo=new THREE.PlaneGeometry(56,2.8); geo.rotateX(-Math.PI/2);
  blocks.forEach(b=>{ const o=30.4; its.push({x:b.cx,y:.047,z:b.cz-o},{x:b.cx,y:.047,z:b.cz+o,ry:Math.PI},{x:b.cx-o,y:.047,z:b.cz,ry:Math.PI/2},{x:b.cx+o,y:.047,z:b.cz,ry:-Math.PI/2}); });
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
function pickStyle(C){ let t=0; C.styles.forEach(x=>{ t+=x[1]; }); let r=RN()*t; for(const x of C.styles){ r-=x[1]; if(r<=0) return x[0]; } return C.styles[0][0]; }
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
function addBuilding(x,z,w,d,style,color,cx,cz,ox,oz){
  let h; if(style==='zinc') h=rr(6,9); else if(style==='banco') h=rr(7,13); else if(style==='glass') h=rr(30,46); else if(style==='admin') h=rr(12,18); else h=rr(14,30);
  const mats=[],vv=Math.floor(RN()*3),tex=FACT[style][vv],th=FAC_TH[style];
  const geo=new THREE.BoxGeometry(w,h,d),uv=geo.attributes.uv,rxd=Math.max(1,Math.round(d/10)),rxw=Math.max(1,Math.round(w/10)),ry=Math.max(1,Math.round(h/th));
  for(let i=0;i<uv.count;i++){ const f=Math.floor(i/4),rx=(f===0||f===1)?rxd:rxw; if(f===2||f===3) uv.setXY(i,uv.getX(i)*rxw,uv.getY(i)*rxd); else uv.setXY(i,uv.getX(i)*rx,uv.getY(i)*ry); }
  const side=lam(style==='glass'?'#86aac6':color,{map:tex,transparent:true});
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
  else if(style==='glass'){ xb(w*.6,3,d*.6,'#3b4650',x,h+1.5,z); xb(.25,9,.25,'#9aa0a8',x,h+7.5,z); }
  else if(style==='banco'){
    for(const sx of [-1,1])for(const sz of [-1,1]){ DX.pin.push({x:x+sx*(w/2-.8),y:h+1.4,z:z+sz*(d/2-.8),sx:1.6,sy:2.8,sz:1.6}); DX.pinCap.push({x:x+sx*(w/2-.8),y:h+3.6,z:z+sz*(d/2-.8),sx:1.1,sy:1.7,sz:1.1}); }
    for(let t=-w/2+2.8;t<w/2-2;t+=2.4) for(const sz of [-1,1]) DX.merlon.push({x:x+t,y:h+.5,z:z+sz*(d/2-.4),sx:1,sy:1,sz:.8});
    for(let t=-d/2+2.8;t<d/2-2;t+=2.4) for(const sx of [-1,1]) DX.merlon.push({x:x+sx*(w/2-.4),y:h+.5,z:z+t,sx:.8,sy:1,sz:1});
  }
  else if(style==='admin'){ xb(w+2,.6,d+2,'#e9e6df',x,h+.3,z); const fx=x+w/2-1,fz=z+d/2-1; DX.pole.push({x:fx,y:h+5.6,z:fz,sx:.2,sy:10,sz:.2}); DX.flag.push({x:fx+.1,y:h+9.6,z:fz,ry:rr(0,6)}); }
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
  if(c.axis==='x'){ c.m.position.set(c.pos,0,c.lane); c.m.rotation.y=c.dir>0?0:Math.PI; }
  else { c.m.position.set(c.lane,0,c.pos); c.m.rotation.y=c.dir>0?-Math.PI/2:Math.PI/2; }
}
function vehicleBox(c,pos){ const along=pos==null?c.pos:pos,x=c.axis==='x'?along:c.lane,z=c.axis==='x'?c.lane:along,hx=c.axis==='x'?c.hl:c.hw,hz=c.axis==='x'?c.hw:c.hl; return {x0:x-hx,x1:x+hx,z0:z-hz,z1:z+hz}; }
function boxesOverlap(a,b,pad=.35){ return a.x0<b.x1+pad&&a.x1>b.x0-pad&&a.z0<b.z1+pad&&a.z1>b.z0-pad; }
function addCar(axis,k,dir,C){ const road=k*R,kind=pickKind(C),v=makeVehicle(kind,C),lane=axis==='x'?road+(dir>0?3.6:-3.6):road+(dir>0?-3.6:3.6),c={m:v.m,axis,dir,lane,pos:0,speed:rr(v.sp[0],v.sp[1]),hl:v.hl,hw:v.hw,kind};
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
function streetDetails0(C,blocks){
  ringTaken=[]; hawkers=[];
  (C.bridges||[]).forEach(b=>footbridge(b[0],b[1]));
  if(C.flare) landmark('flare',C.flare[0],C.flare[1]);
  const poles=[],arms=[],wires=[],lampsOn=[],lampsOff=[],zebra=[],holes=[],drains=[];
  for(const b of blocks){
    const cx=b.cx,cz=b.cz;
    for(const sx of [-1,1]){
      for(const sz of [-1,1]){
        const px=cx+sx*27.4,pz=cz+sz*14;
        if(nearSpecial(px,pz,10)||!ringFree(px,pz,2)) continue;
        ringTaken.push({x:px,z:pz,r:1.5});
        poles.push({x:px,y:0,z:pz}); arms.push({x:px-sx*1.1,y:13.7,z:pz,sx:2.4,sy:.25,sz:.25});
        (RN()<.65?lampsOn:lampsOff).push({x:px-sx*2.1,y:13.5,z:pz});
      }
      wires.push({x:cx+sx*27.4,y:13.2,z:cz,sx:.07,sy:.07,sz:28},{x:cx+sx*27.4,y:12.4,z:cz,sx:.07,sy:.07,sz:28});
    }
    drains.push({x:cx,y:.08,z:cz-28.6,sx:56,sy:.16,sz:1.1},{x:cx,y:.08,z:cz+28.6,sx:56,sy:.16,sz:1.1},{x:cx-28.6,y:.08,z:cz,sx:1.1,sy:.16,sz:56},{x:cx+28.6,y:.08,z:cz,sx:1.1,sy:.16,sz:56});
  }
  for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){
    zebra.push({x:i*R+10.5,y:.06,z:j*R},{x:i*R-10.5,y:.06,z:j*R},{x:i*R,y:.06,z:j*R+10.5,ry:Math.PI/2},{x:i*R,y:.06,z:j*R-10.5,ry:Math.PI/2});
  }
  for(let q=0;q<70;q++){
    const k=Math.floor(rr(-3,4)),alongX=RN()<.5,t=rr(-200,200),off=rr(-5,5),mo=((t%R)+R)%R;
    if(mo<10||mo>R-10) continue;
    const sx=rr(.8,1.8),sz=rr(.6,1.3);
    holes.push(alongX?{x:t,y:.055,z:k*R+off,sx,sz}:{x:k*R+off,y:.055,z:t,sx,sz});
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
    bumps.push(alongX?{x:t,y:.075,z:k*R,ry:Math.PI/2}:{x:k*R,y:.075,z:t});
  }
  if(bumps.length) instanced(bumpG,new THREE.MeshBasicMaterial({map:stripeTex(YELLOW,INK),transparent:true,depthWrite:false}),bumps,cityGroup);
  for(let q=0;q<(C.pud||0);q++){
    const k=Math.floor(rr(-3,4)),alongX=RN()<.5,t=rr(-200,200),off=rr(-5,5),mo=((t%R)+R)%R; if(mo<12||mo>R-12) continue;
    const sx=rr(1.6,3.4),sz=rr(1.2,2.4); pud.push(alongX?{x:t,y:.062,z:k*R+off,sx,sz}:{x:k*R+off,y:.062,z:t,sx,sz});
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
    DX.bunt.push(alongX?{x:t,y:10.8,z:k*R,ry:Math.PI/2}:{x:k*R,y:10.8,z:t});
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
function buildCity(key){
  const C=CITIES[key]; curCity=key;
  clearGroup(cityGroup); clearGroup(trafficGroup); texs.forEach(t=>t.dispose()); texs=[];
  colliders.length=0; buildings.length=0; cars=[]; walkers=[]; hawkers=[]; ringTaken=[];
  RN=mulberry(C.seed); dxReset(); LOOKSC=CITY_LOOKS[key]||LOOKS;
  applyLook(key,C);
  if(key==='kitcity'){ buildKitCity(C); return; }
  const outer=new THREE.Mesh(uvScale(new THREE.PlaneGeometry(1400,1400),100,100),lam(C.dirt,{map:LKT.dirt})); outer.rotation.x=-Math.PI/2; outer.position.y=-.04; cityGroup.add(outer);
  const ground=new THREE.Mesh(uvScale(new THREE.PlaneGeometry(520,520),20,20),lam(C.ground,{map:LKT.asph})); ground.rotation.x=-Math.PI/2; cityGroup.add(ground);
  const dirtMat=lam(C.dirt,{map:LKT.dirt}),paveMat=lam(C.slab,{map:LKT.pave}),slabGeo=uvScale(new THREE.BoxGeometry(56,0.1,56),14,14),vergeGeo=uvScale(new THREE.PlaneGeometry(59,59),10,10);
  for(let k=-3;k<=3;k++)for(let i=-3;i<=2;i++){
    const h=new THREE.Mesh(dashGeo,dashMat); h.rotation.x=-Math.PI/2; h.position.set(i*R+35,0.04,k*R); cityGroup.add(h);
    const v=new THREE.Mesh(dashGeo,dashMat); v.rotation.set(-Math.PI/2,0,Math.PI/2); v.position.set(k*R,0.04,i*R+35); cityGroup.add(v);
  }
  const blocks=[];
  for(let i=-3;i<=2;i++)for(let j=-3;j<=2;j++){
    const cx=i*R+35,cz=j*R+35; blocks.push({cx,cz});
    const vg=new THREE.Mesh(vergeGeo,dirtMat); vg.rotation.x=-Math.PI/2; vg.position.set(cx,.03,cz); cityGroup.add(vg);
    const slab=new THREE.Mesh(slabGeo,paveMat); slab.position.set(cx,0.05,cz); cityGroup.add(slab);
    const lmk=(C.lm||[]).find(l=>l[1]===cx&&l[2]===cz);
    if(lmk) landmark(lmk[0],cx,cz);
    else if((((i+j)%C.market)+C.market)%C.market===0) addMarket(cx,cz);
    else for(const ox of [-11,11])for(const oz of [-11,11]) addBuilding(cx+ox+rr(-1,1),cz+oz+rr(-1,1),rr(14,20),rr(14,20),pickStyle(C),pk(C.paint),cx,cz,ox,oz);
    // Roadside/block-edge tree placement removed: keep streets and road verges clear.
  }
  streetDetails(C,blocks); roadDecals(C,blocks);
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
    if(RN()<.5){ const x0=i*R+o,z0=j*R; A={x:x0,z:z0-8.2}; B={x:x0,z:z0+8.2}; axis='x'; coord=z0; cc=x0; }
    else { const z0=j*R+o,x0=i*R; A={x:x0-8.2,z:z0}; B={x:x0+8.2,z:z0}; axis='z'; coord=x0; cc=z0; }
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
  /* Keep every character at their own world anchor; the opening-only actors handle the shared cinematic. */
  att.position.set(x+1.6*face,.05,z+4.9*face); att.rotation.y=face>0?Math.PI/2:-Math.PI/2;
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
function placeStoryClue(def,spot){
  const g=new THREE.Group(); g.position.set(spot.x,0,spot.z);
  const wood=lam('#45352A'),paper=lam('#F4F5F0'),cyan=lam(BRAND),dark=lam('#17212A');
  for(const x of [-1.35,1.35]){
    const post=new THREE.Mesh(new THREE.BoxGeometry(.13,3.9,.13),wood); post.position.set(x,1.95,0); g.add(post);
  }
  const board=new THREE.Mesh(new THREE.BoxGeometry(3.15,3.55,.16),wood); board.position.set(0,3.45,0); g.add(board);
  const sheet=new THREE.Mesh(new THREE.BoxGeometry(2.72,3.1,.08),paper); sheet.position.set(0,3.48,.13); g.add(sheet);
  const mark=new THREE.Mesh(new THREE.BoxGeometry(.68,.68,.08),cyan); mark.position.set(-.76,4.45,.2); g.add(mark);
  const barA=new THREE.Mesh(new THREE.BoxGeometry(1.35,.1,.06),dark); barA.position.set(.42,4.55,.2); g.add(barA);
  const barB=new THREE.Mesh(new THREE.BoxGeometry(1.75,.08,.06),dark); barB.position.set(.18,4.25,.2); g.add(barB);
  for(let row=0;row<4;row++){
    const line=new THREE.Mesh(new THREE.BoxGeometry(2.1-row*.18,.055,.05),dark);
    line.position.set(0,3.72-row*.27,.2); g.add(line);
  }
  if(def.id==='m01-transaction-record'){
    /* A distinct verification kiosk makes this stop feel like a place, not another floating clue. */
    const consoleBody=new THREE.Mesh(new THREE.BoxGeometry(2.8,1.25,1.35),lam('#26343E'));
    consoleBody.position.set(0,.63,2.05);g.add(consoleBody);
    const screen=new THREE.Mesh(new THREE.BoxGeometry(2.05,1.25,.1),lam('#0D202B',{emissive:0x073C4A,emissiveIntensity:.7}));
    screen.position.set(0,2.05,1.34);screen.rotation.x=-.12;g.add(screen);
    const screenLine=new THREE.Mesh(new THREE.BoxGeometry(1.4,.09,.05),lam(BRAND));screenLine.position.set(0,2.25,1.27);g.add(screenLine);
    const screenDot=new THREE.Mesh(new THREE.CircleGeometry(.12,12),lam('#55E6C1'));screenDot.position.set(.7,1.85,1.27);g.add(screenDot);
    const foot=new THREE.Mesh(new THREE.BoxGeometry(3.4,.15,1.7),lam('#17232B'));foot.position.set(0,.08,2.05);g.add(foot);
  }
  missionGroup.add(g);
  const sign=label(tr(def.sign||def.title),BRAND,'#071827',1.25); sign.position.set(spot.x,6.6,spot.z); missionGroup.add(sign);
  return {x:spot.x,z:spot.z,r:6.5,clue:true};
}
function placeMissionEvidence(def,mission,spot){
  const g=new THREE.Group();g.position.set(spot.x,0,spot.z);
  const title=String(def.title||def.label||'Evidence').replace(/[.!?]+$/,'');
  const labelText=tr(def.sign||title.toUpperCase().slice(0,28));
  const dark=lam('#17242C'),desk=lam('#465760'),screen=lam('#0D202B',{emissive:0x073C4A,emissiveIntensity:.7}),cyan=lam(BRAND),paper=lam('#F4F5F0'),wood=lam('#45352A');
  const add=(mesh,x,y,z)=>{mesh.position.set(x,y,z);g.add(mesh);return mesh;};
  const box=(w,h,d,mat,x,y,z)=>add(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat),x,y,z);
  const monitor=(w=2.5,h=1.6)=>{box(w,.12,1.2,desk,0,.65,.1);box(w*.78,h,.14,screen,0,1.85,-.38);box(w*.52,.08,.05,cyan,0,2.18,-.47);};
  const text=title.toLowerCase()+' '+String(def.label||'').toLowerCase();
  if(mission.id==='m02'&&/transaction explorer|transaction hash|ledger|recipient address|trace a transaction/.test(text)){
    if(/record the address mismatch|incident note/.test(text)){
      box(2.8,.8,1.8,desk,0,.4,0);box(1.75,.05,1.25,paper,0,.84,-.05);box(.85,.06,.08,cyan,-.28,.89,-.55);box(1.1,.04,.07,dark,.18,.89,-.28);
      for(let i=0;i<3;i++)box(1.6-i*.15,.035,.05,dark,0,.89-i*.14,.22);
    }else if(/trace a transaction|recipient address/.test(text)){
      box(3.5,.75,1.4,desk,0,.38,0);
      box(1.3,1.5,.12,screen,-.85,1.55,-.48);box(1.3,1.5,.12,screen,.85,1.55,-.48);
      box(.8,.08,.05,cyan,-.85,1.9,-.56);box(.8,.08,.05,cyan,.85,1.9,-.56);
      box(.95,.06,.05,paper,-.85,1.62,-.56);box(.95,.06,.05,paper,.85,1.62,-.56);
    }else monitor(2.7,1.7);
  }else if(/wallet|recovery phrase|seed phrase|scam|malicious|security|support impersonat/.test(text)){
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
function storyExecutionStation(m,stepIndex){
  const base=SPOTS.execution;
  const objectiveIndex=Math.max(0,stepIndex-(m.characterStepCount||0));
  const angle=objectiveIndex*2.399963229728653;
  return {x:base.x+Math.cos(angle)*4.15,z:base.z+Math.sin(angle)*3.05,f:-1};
}
function placeExecutionCenter(def,base,station){
  const hall=new THREE.Group();hall.position.set(base.x,0,base.z);
  const floor=new THREE.Mesh(new THREE.BoxGeometry(15,.24,12),lam('#34434B'));floor.position.y=.12;hall.add(floor);
  const roof=new THREE.Mesh(new THREE.BoxGeometry(15.5,.28,12.5),lam('#17262F'));roof.position.set(0,4.25,0);hall.add(roof);
  for(const x of [-7,7]) for(const z of [-5.5,5.5]){
    const pillar=new THREE.Mesh(new THREE.BoxGeometry(.32,4.2,.32),lam('#637681'));pillar.position.set(x,2.1,z);hall.add(pillar);
  }
  const back=new THREE.Mesh(new THREE.BoxGeometry(14,.16,.3),lam('#50616A'));back.position.set(0,2.4,-5.7);hall.add(back);
  missionGroup.add(hall);
  const centerSign=label("EXECUTION CENTRE",BRAND,'#071827',1.45);centerSign.position.set(base.x,6.3,base.z-5.5);missionGroup.add(centerSign);
  const stationGroup=new THREE.Group();stationGroup.position.set(station.x,0,station.z);
  const desk=new THREE.Mesh(new THREE.BoxGeometry(2.7,1.05,1.35),lam('#465760'));desk.position.set(0,.55,0);stationGroup.add(desk);
  const screen=new THREE.Mesh(new THREE.BoxGeometry(1.65,1.1,.12),lam('#0D202B',{emissive:0x073C4A,emissiveIntensity:.75}));screen.position.set(0,1.85,-.22);screen.rotation.x=-.12;stationGroup.add(screen);
  const screenBar=new THREE.Mesh(new THREE.BoxGeometry(1.12,.08,.05),lam(BRAND));screenBar.position.set(0,2.05,-.3);stationGroup.add(screenBar);
  const screenDot=new THREE.Mesh(new THREE.CircleGeometry(.1,12),lam('#55E6C1'));screenDot.position.set(.54,1.66,-.3);stationGroup.add(screenDot);
  missionGroup.add(stationGroup);
  const stationSign=label(tr(def.sign||def.title||def.label||'WORKSTATION'),BRAND,'#071827',1.1);stationSign.position.set(station.x,4.1,station.z);missionGroup.add(stationSign);
  return {x:station.x,z:station.z,r:7.2,clue:true};
}
function placeStoryOffice(spot){
  /* A small open-front office gives Abdul a clear, separate destination from Softstorm. */
  const office=new THREE.Group();
  office.position.set(spot.x,0,spot.z-13);
  const floor=new THREE.Mesh(new THREE.BoxGeometry(8,.22,6),lam('#39464F'));floor.position.set(0,.11,0);office.add(floor);
  const back=new THREE.Mesh(new THREE.BoxGeometry(8,4,.25),lam('#23313A'));back.position.set(0,2,-2.9);office.add(back);
  const left=new THREE.Mesh(new THREE.BoxGeometry(.25,4,6),lam('#2D3D46'));left.position.set(-3.9,2,0);office.add(left);
  const right=new THREE.Mesh(new THREE.BoxGeometry(.25,4,6),lam('#2D3D46'));right.position.set(3.9,2,0);office.add(right);
  const roof=new THREE.Mesh(new THREE.BoxGeometry(8.4,.25,6.4),lam('#17242C'));roof.position.set(0,4.1,0);office.add(roof);
  const desk=new THREE.Mesh(new THREE.BoxGeometry(3.2,1,1.1),lam('#5A4638'));desk.position.set(0,.72,1.4);office.add(desk);
  const terminal=new THREE.Mesh(new THREE.BoxGeometry(1.25,.85,.12),lam('#0D202B',{emissive:0x073C4A,emissiveIntensity:.6}));terminal.position.set(0,1.65,1.05);office.add(terminal);
  const accent=new THREE.Mesh(new THREE.BoxGeometry(1.1,.07,.05),lam(BRAND));accent.position.set(0,1.78,.98);office.add(accent);
  missionGroup.add(office);
  const sign=label("IAMABDUL'S OFFICE",BRAND,'#071827',1.35);sign.position.set(spot.x,6.4,spot.z-13);missionGroup.add(sign);
}
function placeNPC(def,spot){
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
    const sp=label(tr(def.sign||def.name),def.signBg,def.signFg); sp.position.set(p.position.x,6,p.position.z); p.userData.storyNameLabel=sp; missionGroup.add(sp);
    colliders.push({x0:p.position.x-1,x1:p.position.x+1,z0:p.position.z-1,z1:p.position.z+1});
    storyNPCActors.push(p);
    return {x:p.position.x,z:p.position.z,r:6.5,object:p};
  }
  return {x:spot.x,z:spot.z,r:7.5};
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
const SUYA_ADDR='0x'+hex(20);
// Dedicated cinematic actors: the regular Softstorm/IamAbdul NPC definitions are stalls,
 // so searching missionGroup alone cannot ever produce two visible people in the opening scene.
const storyCastGroup=new THREE.Group();
storyCastGroup.name='KitCity opening story cast';
scene.add(storyCastGroup);
const storySoftstorm=buildPerson(LK.mama);
storySoftstorm.userData.storyCharacter='Softstorm';
storySoftstorm.userData.storyRole='The one with the card';
storySoftstorm.position.set(9.1,.05,-30);
storySoftstorm.rotation.y=Math.PI/2;
storyCastGroup.add(storySoftstorm);
const storyAbdul=buildPerson(LK.suya);
storyAbdul.userData.storyCharacter='IamAbdul';
storyAbdul.userData.storyRole='The one who heard it first';
storyAbdul.position.set(12.9,.05,-30);
storyAbdul.rotation.y=-Math.PI/2;
storyCastGroup.add(storyAbdul);
storyCastGroup.visible=false;
const storyDirector=createStorySceneDirector({camera,player,getCharacter(name){
  const staged=name==='Softstorm'?storySoftstorm:name==='IamAbdul'?storyAbdul:null;
  if(storyCastGroup.visible&&staged) return staged;
  let found=null;missionGroup.traverse(o=>{if(!found&&o.userData&&o.userData.storyCharacter===name) found=o;});return found;
},animateCharacter:animatePerson,setModal(value){S.modal=value;Snd.duck(value);}});

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
function closeSheet(){ S.modal=false; cbs=[]; sheetTok++; pendingReveal=null; chat={npc:null,log:[]}; sheetEl.classList.remove('typing','chronicle-dialogue-card'); modalEl.classList.remove('chronicle-dialogue-open'); modalEl.classList.add('hidden'); sheetEl.innerHTML=''; Snd.duck(false); }
sheetEl.addEventListener('click',e=>{
  if(pendingReveal){ pendingReveal(); return; }
  const b=e.target.closest('[data-i]'); if(!b) return;
  Snd.sfx('click'); const f=cbs[+b.dataset.i]; if(f) f();
});
const who=(i,n,r,bg)=>'<div class="who"><span class="av" style="background:'+bg+'">'+i+'</span><div><b>'+n+'</b><small>'+r+'</small></div></div>';
const whoOf=d=>who(d.name.charAt(0),d.name,d.role,d.color);
const plain=h=>h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
function talk(def,html,btns){
  html=tx(personalize(html,G&&G.m,def));
  const npcName=String(def.name||'Local resident');
  const role=String(def.role||'KITCITY RESIDENT');
  const wrapped=(btns||[]).map(b=>({t:personalize(tr(b.t)),g:b.g,m:b.m,f:b.f}));
  const card='<div class="chronicle-talk-head"><span class="chronicle-talk-avatar" style="--npc-accent:'+escapeStoryHtml(def.color||BRAND)+'">'+escapeStoryHtml(npcName.slice(0,1).toUpperCase())+'</span><div class="chronicle-talk-identity"><small>NEARBY · '+escapeStoryHtml(G&&G.m?CITIES[G.m.city]?.name||G.m.state||'KITCITY':'KITCITY')+'</small><h3>'+escapeStoryHtml(npcName)+'</h3><span>'+escapeStoryHtml(role)+'</span></div></div><div class="chronicle-talk-body"><small class="chronicle-talk-speaker">'+escapeStoryHtml(npcName.toUpperCase())+'</small><div class="chronicle-talk-line">'+html+'</div></div>';
  openSheet(card,wrapped,0,true);
  sheetEl.classList.add('chronicle-dialogue-card');
  modalEl.classList.add('chronicle-dialogue-open');
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
    $('#mTitle').textContent=tr(personalize('Mission '+G.m.n+': '+G.m.title,null));
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
const STORY_CITY_BY_STATE={'Lagos':'lagos','Oyo':'ibadan','Osun':'osun','Ekiti':'adoekiti','Delta':'asaba','Anambra':'anambra','Enugu':'enugu','Plateau':'jos','Kano':'kano','Edo':'benin','Cross River':'calabar','Bauchi':'bauchi','Abia':'abia','Niger':'minna','Kogi':'kogi','KitCity':'kitcity'};
const STORY_COLORS=['#0897A8','#2D6FB3','#C7457E','#0B7A43','#6a3fb5','#E4572E','#7a4a2e','#1f4f82'];
const STORY_LOOKS=[LK.mama,LK.suya,LK.guy,LK.trader,LK.clerk,LK.elder,LK.man,LK.woman];
const STORY_ROLES={
  Softstorm:'Neighbour · community builder',IamAbdul:'Neighbour · curious builder',
  Joe_Sef:'Community guide',Larai:'Workshop host',Unique:'Wallet mentor', 'Smrt huntr':'Security researcher',
  Goodness:'Transaction analyst',Semi:'Ledger researcher',Blockqueen:'Product designer',Christol:'Application developer',
  Laloba:'Smart-contract auditor',BigSam:'Engineering lead',LunaX:'Liquidity analyst',OxNight:'Market trader',
  Moon:'Exchange analyst','The Cryptonian':'Exchange operations', 'Joseph Nnadi':'Spot trader','The Don':'Trading mentor',
  Praise:'Risk analyst',Toza:'Derivatives trader',Craftore:'KitCity gatekeeper',Kodavic:'Community organiser',
  Cybersage:'Community security lead',Reina:'Community coordinator',Cclya:'Server administrator',Leemah:'Event host',
  Kenny:'Public speaker',Kore:'Storyteller',Veedima:'Talent connector','Web3_Esta':'Career mentor',Love:'Portfolio reviewer',
  'J.Jonathan':'Hiring lead',Essa:'Opportunity scout','White Coach':'Product mentor',Abdul:'Product designer',
  David:'Growth lead',Kanyin:'Growth analyst',Mcbond:'Investor','Alpha.RWA':'Investment analyst',
  BigWealth:'Asset issuer',Blessing:'AI engineer',Odion:'Quality analyst',Princess:'Interoperability engineer',
  Racheal:'Protocol developer',Seun:'Governance delegate',Dorcas:'Independent auditor',Joe:'Audit investigator',
  Mike:'Smart-contract reviewer',Gbemi:'Digital creator',FemiY:'Creator-economy builder'
};
const STORY_NPCS=Object.create(null);
CHARACTER_ORDER.forEach((name,index)=>{
  const color=STORY_COLORS[index%STORY_COLORS.length];
  const npc=NPC(name,STORY_ROLES[name]||'Local resident',color,STORY_LOOKS[index%STORY_LOOKS.length],null,name);
  npc.name=name;npc.originalName=name;npc.signBg=color;npc.signFg='#ffffff';STORY_NPCS[name]=npc;
});
const CHRONICLE_CHALLENGES={
m02:{q:"The cybercafé session is about to clear, and the copied payment page may disappear. What do you save first?",o:["Capture the full page, URL and timestamp as it is","Refresh the page and hope the address corrects itself","Post the account name publicly before the evidence is gone"],a:0,w:"Preserve the page as it appeared first. A changing page and a familiar display name are not proof of who made it."},
m03:{q:"Timi's recovery page starts a countdown and asks for twelve secret words. What do you do?",o:["Stop the page and find support independently","Enter the words before the countdown ends","Send them to the account offering help"],a:0,w:"A countdown is pressure, not proof. Never give a recovery phrase to a website or support contact."},
m04:{q:"The student group is about to publish a screenshot claiming Timi drained the wallet. What do you do first?",o:["Pause the accusation and compare the original message with the relevant wallet record","Forward the screenshot so more people can decide","Name the person who shared it and call them a scammer"],a:0,w:"Stop the pile-on, preserve the source and check the relevant record before repeating the claim."},
m05:{q:"Two buyers back out at the same network screen. What should the team do before adding features?",o:["Watch and reproduce the problem, then test one focused change","Build a dashboard because it looks more advanced","Assume the buyers need to learn more jargon"],a:0,w:"A repeated observed problem is a stronger starting point than an untested assumption about customers."},
m06:{q:"The same payment can be processed twice. What should block release?",o:["A fix plus regression tests for repeated calls and sensitive state changes","One successful demo with a single tap","A note promising to monitor complaints after launch"],a:0,w:"A financial workflow needs tests for the failure condition, not only the happy path."},
m07:{q:"The quoted swap output is lower than expected. What should you check?",o:["Token identity, liquidity, fees, price impact and approval","Only the token symbol","Whether the promoter says the pool is safe"],a:0,w:"A quote is an estimate; review the route and permissions before confirming."},
m08:{q:"Withdrawals are paused but the cause is unknown. What should the notice say?",o:["What is confirmed, where to check official updates and when another update is due","That the exchange has definitely lost all funds","A guaranteed restoration time guessed from chat"],a:0,w:"An incident update should be useful without turning uncertainty into a claim."},
m09:{q:"After a loss, the trader wants to double position size. What is the responsible response?",o:["Recheck the original risk limit and only take a trade if the plan still qualifies","Double size to recover faster","Move invalidation until the trade becomes profitable"],a:0,w:"Risk should follow the plan, not the desire to recover a loss."},
m10:{q:"The margin buffer is nearly gone. What should guide the next action?",o:["The liquidation threshold and pre-agreed risk plan","The number of people predicting a reversal","A decision to increase leverage without recalculating"],a:0,w:"Leverage magnifies exposure; the risk plan should not be rewritten under pressure."},
m11:{q:"How should the project judge its new onboarding session?",o:["By useful task completion and return visits","By the total number of members","By how many promotional messages were sent"],a:0,w:"Meaningful participation is more informative than raw membership."},
m12:{q:"A fake moderator asks for wallet verification. What is the safest response?",o:["Contain and report the message, preserve evidence and guide the user through official channels","Forward the link to every member","Ask the user to post their recovery phrase for review"],a:0,w:"Contain the threat without amplifying it or exposing the victim."},
m13:{q:"You do not know whether an account was compromised. What should you tell the audience?",o:["State what is known, what is unknown and where verified updates will appear","Guess so the audience gets a quick answer","Promise the incident cannot happen again"],a:0,w:"Honesty and clear next steps are more useful than invented certainty."},
m14:{q:"Which announcement should the founder publish?",o:["A clear explanation of the user problem, current capability and next step","A list of grand claims with no evidence","A message full of unexplained acronyms"],a:0,w:"A strong product message is specific, understandable and supportable."},
m15:{q:"What makes the portfolio credible?",o:["Work samples that explain your contribution and show verifiable evidence","A long bio full of titles","Projects you followed but did not contribute to"],a:0,w:"A portfolio should let a reviewer see what you actually did."},
m16:{q:"The recruiter demands an upfront activation fee. What should you do?",o:["Decline the fee and verify the role through an official channel","Pay to prove you are serious","Send wallet recovery details instead"],a:0,w:"An upfront fee and requests for wallet secrets are warning signs; use a verified contact route."},
m17:{q:"What should the team build for the trader first?",o:["A focused reconciliation flow tested against the trader's real workflow","A token unrelated to the missing records","A dashboard full of extra settings"],a:0,w:"A product should reduce the observed friction before adding complexity."},
m18:{q:"Which result shows the growth experiment worked?",o:["More real traders completing the first reconciliation task","More impressions regardless of behaviour","More fake accounts joining the group"],a:0,w:"Measure the action that demonstrates value, not attention alone."},
m19:{q:"What must be clear before accepting the funding offer?",o:["Milestones, budget, risks, reporting duties and conflicts","Only the headline amount","A promise of guaranteed returns"],a:0,w:"A funding decision needs clear terms and accountability; returns are never guaranteed."},
m20:{q:"The warehouse exists but the ownership file is missing. What can you claim?",o:["Only what the records prove; pause the backing claim until rights are verified","The token proves the goods belong to holders","The photos prove legal title"],a:0,w:"The existence of an asset does not establish the token holder's legal rights."},
m21:{q:"The AI confidently names an owner without a source. What should happen?",o:["Trace the claim to original records and mark it unresolved if evidence is missing","Ask the same AI to confirm itself","Publish it because the summary sounds precise"],a:0,w:"Important AI outputs must be independently checked against reliable evidence."},
m22:{q:"The source transaction is confirmed but the destination is pending. What is safest?",o:["Check the official bridge status and destination record before retrying","Send the same amount again immediately","Enter a recovery phrase into the bridge page"],a:0,w:"Trace both sides of the transfer and never share recovery words."},
m23:{q:"The treasury proposal has no clear cost breakdown. What should the community do?",o:["Request the missing budget and delivery accountability before deciding","Vote yes because the deadline is close","Follow the most popular post"],a:0,w:"A governance decision should reflect the proposal's actual costs, risks and beneficiaries."},
m24:{q:"The privileged permission has not been independently retested. Can launch proceed?",o:["Hold release until the fix and regression tests are reviewed","Hide the finding to protect the deadline","Assume it is safe because nobody has complained"],a:0,w:"A critical finding needs a verified fix, not a promise."},
m25:{q:"The collectible's authorship is disputed. What should the seller do?",o:["Pause the listing until authorship and licence rights are resolved","Mint first so the claim becomes official","Remove the original artist's name"],a:0,w:"A token does not automatically establish authorship or transfer copyright."},
m26:{q:"What is the right response to copied open-source code with missing attribution?",o:["Restore the source trail, check the licence and submit a reviewable correction","Delete the repository history","Rename the author to the new project"],a:0,w:"Reuse must follow the licence, and maintainers should preserve a reviewable source history."},
m27:{q:"The same cyan mark appears in several records. What does it prove?",o:["It is a lead to investigate, not proof of common ownership or intent","One person definitely caused every incident","The mark alone proves the projects are fraudulent"],a:0,w:"A recurring symbol helps connect cases but does not establish who controls them."},
m28:{q:"Each screen works alone, but the full journey loses its source reference. What should happen?",o:["Fix the hand-off and rerun the complete end-to-end test","Approve it because the individual screens passed","Tell users to remember the missing reference"],a:0,w:"Integration is only reliable when the whole user journey preserves required context."},
m29:{q:"What should the KitCity gate accept as evidence?",o:["A traceable reconstruction that includes contradictions and uncertainty","A confident accusation with no source","A polished slide deck alone"],a:0,w:"The gate tests reasoning and evidence, not confidence."},
m30:{q:"What should the practical test prove?",o:["The payment is verified, the newcomer is protected and the hand-off is repeatably tested","The demo looks smooth once","Every possible risk has disappeared forever"],a:0,w:"A practical result should be repeatable, reviewable and honest about limits."},
m31:{q:"What finally proves the cyan mark's connection to T3Kit?",o:["The signed deployment record and matching project documentation","The symbol by itself","A rumour repeated by several characters"],a:0,w:"The mark led to the records; the records support the conclusion."}
};
function escapeStoryHtml(value){return String(value==null?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
const STORY_PLAYER_REACTIONS={
  m02:["So the transfer is real, but the shop never got it. Show me the page he used before it changes again.","The address is the clue. Save the page and timestamp first; we can work out intent after."],
  m03:["Timi, don't enter those words. Close the page and tell us exactly what the stranger asked you to do.","Let's secure the wallet without giving the stranger control of it."],
  m04:["Nobody has checked this screenshot against the source yet. Stop the accusation before it spreads further.","Keep the original message and compare the wallet activity. We can correct the claim without guessing who edited it."],
  m05:["Watch another buyer try it without coaching; keep notes on where they hesitate.","Show the exact screen where they hesitate so the team can reproduce it."],
  m06:["Reproduce the double charge before launch. One successful demo proves nothing.","Run the same tap sequence after the patch. If it happens again, we're not shipping."],
  m07:["Pause the next swap. I want the token address and approval in front of us.","The quote and the received amount disagree. Let's find where the difference entered."],
  m08:["Tell customers what's confirmed and what's still unknown. No fake deadline.","Give them a safe next step and one official place to get updates."],
  m09:["Let's compare the first trade plan with the revenge trade, not just the losses.","No new position until the risk is written down again."],
  m10:["Show me the current exposure and liquidation level before price moves again.","Set the risk limit now. Don't wait for another candle to make the decision for you."],
  m11:["Forget the sign-up count for a minute. Let me follow a newcomer through the first task.","Give her one clear next step and see whether she can finish it without help."],
  m12:["Take down the fake link and contact the member privately. Don't expose their chat.","Pin the real support route and make it clear nobody needs their recovery phrase."],
  m13:["I'll take the question, but we won't promise profit we can't guarantee.","Let's show the product doing one real thing and be honest about its limits."],
  m14:["Cut the slogans. What does the user get after pressing this button?","Let's rewrite the claim around what we just tested, not what sounds impressive."],
  m15:["Choose one piece of work a reviewer can open and test. Start there.","Add the source, the decisions you made and what still needs work."],
  m16:["Don't pay or send ID yet. Let's verify the vacancy outside this recruiter's message.","I'll check the official company site and save the suspicious request."],
  m17:["Trace the order from payment to collection. The break has to be somewhere between those hand-offs.","Let's replay the exact order and see which status arrived late."],
  m18:["Before spending more, find the screen where people stop and ask why.","Change one thing, test it with real users, then compare completions."],
  m19:["Put the promised return beside the obligations and the people carrying the risk.","I won't recommend this until the reporting terms and conflicts are clear."],
  m20:["No ownership document, no claim that the token represents the stock. Show me the signed record.","Pause the launch language until the legal claim matches the evidence."],
  m21:["Open the original source. The AI summary is not stronger than the record it copied.","Mark the owner as unverified until a human checks the underlying document."],
  m22:["Don't send it twice. Let's follow the message ID to see where the transfer is waiting.","Check the destination status before making another transaction."],
  m23:["I want the recipients, costs and failure conditions on the table before this vote.","We can delay or add conditions, but the trade-off needs to be written down."],
  m24:["Show me exactly what that admin permission can do, not what the developer says they'd do.","Run the exploit against the old version and the patched version before sign-off."],
  m25:["A token doesn't automatically give someone copyright. Let's read the licence and attribution trail.","Pause the exclusivity claim until the creator and rights are clear."],
  m26:["Find the original repository and read the licence before contacting the maintainer.","Save the matching commit and propose a correction we can prove."],
  m27:["A repeated mark is a lead, not proof. Put the appearances in date order.","Let's test each connection against the original records and leave gaps marked."],
  m28:["Replay the hand-off and compare what the first tool sends with what the second saves.","Fix the missing reference, then run the entire journey again."],
  m29:["I'll separate what the records prove from what only looks connected.","Let's put the evidence in order and leave the unanswered parts visible."],
  m30:["Run all three cases and keep the records from each. No pass based on a promise.","I'll sign only what we tested; anything else stays open."],
  m31:["Let's read the signed deployment record itself before attaching a bigger story to it.","I'll choose the next contribution based on work we can verify, not a promise of easy money."]
};
const STORY_PLAYER_CHOICES={
  m02:["Open the saved page and compare its address","Ask the buyer to retrace where he copied it"],
  m03:["Close the recovery page now","Check the message against the official support route"],
  m04:["Preserve the original message and check the claim","Compare the wallet activity before correcting the group"],
  m05:["Observe the buyer without coaching them","Test a clearer network-selection screen with the next buyer"],
  m06:["Replay the double-payment sequence","Hold launch until the regression test passes"],
  m07:["Inspect the token contract and approval","Compare the quote with the actual swap output"],
  m08:["Publish the confirmed status and safe steps","Check the incident log before giving a cause"],
  m09:["Compare both trades against the written plan","Set a risk limit before considering another trade"],
  m10:["Review current exposure and margin","Reduce the position to fit the risk limit"],
  m11:["Follow a newcomer through onboarding","Replace the channel maze with one first task"],
  m12:["Remove the impersonation link","Contact the affected member privately"],
  m13:["Answer the live question honestly","Demonstrate one feature and its limits"],
  m14:["Rewrite the announcement around the tested feature","Remove claims the product cannot support"],
  m15:["Build a reviewable work sample","Document the decisions and unfinished parts"],
  m16:["Verify the vacancy on the company site","Save and report the suspicious recruiter message"],
  m17:["Trace the payment-to-collection hand-off","Reproduce the order-status mismatch"],
  m18:["Interview users who abandoned the task","Test one change before buying more traffic"],
  m19:["Compare return terms with reporting duties","List the risks and conflicts before recommending"],
  m20:["Request the signed ownership record","Pause the token claim until rights are verified"],
  m21:["Open and verify the original source","Mark the AI claim unverified and route it for review"],
  m22:["Trace the bridge message ID","Check the destination status before retrying"],
  m23:["List recipients, costs and milestones","Delay the vote until the missing terms are supplied"],
  m24:["Test the privileged role on the old contract","Verify the patch blocks the same exploit"],
  m25:["Check the licence and creator attribution","Pause the exclusivity claim pending verification"],
  m26:["Compare the source commit and licence","Prepare a documented correction for the maintainer"],
  m27:["Build a dated evidence timeline","Test each suspected link against its source"],
  m28:["Replay the complete cross-tool hand-off","Compare the outgoing and saved reference IDs"],
  m29:["Sort confirmed facts from open questions","Assemble the records into one reviewable case file"],
  m30:["Run the payment, safety and hand-off checks","Review each result before signing off"],
  m31:["Inspect the signed deployment record","Choose a practical contribution backed by the evidence"]
};
const STORY_NPC_FOLLOWUPS={
  m02:"I saved the page before it refreshed. Look at the address in the capture—the shop name stayed the same, but the destination did not.",
  m03:"He said the words were needed to unlock the wallet. That's exactly why we're stopping here before Timi loses control of it.",
  m04:"The original message is saved, and the relevant wallet record does not support the screenshot’s claim. I’ll correct the group without exposing Timi or pretending we know who edited the image.",
  m05:"Two buyers opened the network list and backed out at the same point. We can reproduce that. Change the labels, then watch another buyer try it.",
  m06:"The second request got through while the first was pending. I'll keep the test steps so we can prove the patch closes that gap.",
  m07:"The token address is the mismatch. The ticker alone fooled the screen, and the approval may have exposed more than this one swap.",
  m08:"I'll publish the status now and update it when the incident log changes. No promises about a time we can't support.",
  m09:"The first trade followed the plan; the second was an attempt to erase the loss. I can see the difference now that they're side by side.",
  m10:"That liquidation estimate assumes the current position and margin. If either changes, the buffer changes too.",
  m11:"She finished the one-step task when someone welcomed her. Six channels were not the problem she needed solved.",
  m12:"The member has stopped replying in the public chat. I'll message them directly and never ask for their phrase or password.",
  m13:"I'll tell the room what the tool can do today and where it falls short. I'd rather lose a signup than mislead someone.",
  m14:"That wording is defensible: the alert is a prompt for the user, not an automatic trading decision.",
  m15:"The reviewer can run the demo and inspect the source now. I'll include the trade-offs instead of pretending it's finished.",
  m16:"The company confirmed there is no role under that reference. Keep the messages in case the real company wants to investigate.",
  m17:"The delayed callback changed the payment status after the order had already timed out. The logs show where the hand-off broke.",
  m18:"The next test will change only the wallet explanation. If completion improves, we'll know that wording was part of the drop-off.",
  m19:"The return is a projection, not a guarantee. These reporting clauses are what I'd want clarified before anyone signs.",
  m20:"They sent another token screenshot, but still no signed inventory document. I'm not going to call that backing.",
  m21:"The source is about a different entity with a similar name. I'll mark the AI output as unsupported until the owner record is checked.",
  m22:"The bridge message is still pending on the destination. Sending again would create a separate transfer and another risk.",
  m23:"The proposal can wait. We still don't know who owns maintenance after delivery, and that cost belongs in the vote.",
  m24:"The old contract fails the test and the patch passes it. I'll attach both results to the disclosure so the fix can be reviewed.",
  m25:"The token proves which collectible was transferred. It does not settle copyright or grant a commercial licence by itself.",
  m26:"The commit and licence are clear enough to raise a specific request. We'll send the maintainer evidence, not an insult.",
  m27:"Two records share the mark, but the dates and ownership differ. I'll keep the timeline open until another link is verified.",
  m28:"The reference leaves the first tool but disappears in the second. I'll log the payload at both ends and retest the whole route.",
  m29:"The timeline supports a few links and leaves others open. That's the case file I'm willing to hand over.",
  m30:"All three checks produced records we can inspect. If a team cannot reproduce one, I won't mark that part complete.",
  m31:"The signature verifies this deployment record and its stated scope. Anything beyond that needs a separate source."
};
function chronicleNpcLine(m,name,index=0){
  const authoredLine=Array.isArray(m.sceneLines)?m.sceneLines[index]:null;
  if(authoredLine) return authoredLine;
  const found=(m.dialogue||[]).find(d=>String(d.speaker||'').toLowerCase()===String(name||'').toLowerCase());
  if(found&&found.text) return found.text;
  return (STORY_BRIDGES[m.id]||m.title)+'. '+((STORY_PLAYER_REACTIONS[m.id]||[])[index]||'I need to see the part of this situation you were dealing with.');
}
const STORY_BRIDGES={
  m02:'The laptop dispute is still fresh; the transaction reached a different address',
  m03:'Timi is frightened and the recovery page is still open',
  m04:'The student group is about to brand Timi a thief over a screenshot nobody has verified',
  m05:'The payment demo looks fine in the studio, but buyers keep abandoning checkout in the market queue',
  m06:'The same payment can be processed twice',
  m07:'The received swap amount does not match the quote',
  m08:'Withdrawals are paused and customers want an answer',
  m09:'A loss has pushed the trader into an unplanned second position',
  m10:'The margin buffer is shrinking while the position stays open',
  m11:'New members sign up but disappear before taking part',
  m12:'A fake moderator is sending wallet-verification links',
  m13:'The host has cancelled and the audience is waiting',
  m14:'The product announcement makes claims the demo does not explain',
  m15:'The hiring lead wants work they can inspect',
  m16:'A recruiter demands an activation fee and identity documents',
  m17:'The order says complete but the item is still in the warehouse',
  m18:'Campaign clicks are not turning into completed tasks',
  m19:'The funding offer promises returns but hides obligations',
  m20:'The token claim has no signed ownership record',
  m21:'An AI summary names an owner the source does not support',
  m22:'The transfer is confirmed on one network and pending on the other',
  m23:'The treasury vote is being rushed without clear costs',
  m24:'A privileged contract role can redirect funds',
  m25:'The collectible rights and authorship are disputed',
  m26:'A copied codebase has lost its attribution',
  m27:'The cyan mark appears across several unrelated-looking records',
  m28:'Evidence disappears between two tools',
  m29:'The KitCity gate requires a case file, not a rumour',
  m30:'Three teams must verify the payment, protect a newcomer and repair a hand-off',
  m31:'A signed deployment record connects the evidence to T3Kit'
};
function chronicleNpcStep(m,name,index){
  const npc=STORY_NPCS[name];
  const step={kind:'character',characterIndex:index,label:'Talk to '+name,spot:index===0?'a':index===1?'story':['b','c','d','e','f','g','h'][index%7],npc};
  step.run=function(){
    const line=chronicleNpcLine(m,name,index);
    const playerLine=(STORY_PLAYER_REACTIONS[m.id]||[])[index]||'I want to understand what happened here before we decide what to do.';
    const html='<p><b>'+escapeStoryHtml(name.toUpperCase())+':</b> '+escapeStoryHtml(line)+'</p><p><b>YOU:</b> '+escapeStoryHtml(playerLine)+'</p>';
    const choices=STORY_PLAYER_CHOICES[m.id]||['Inspect the specific record in front of us','Ask what changed in this situation'];
    const buttons=m.id==='m02'&&index===0
      ?[
        {t:'Confirm the hash and network',f:()=>{G.evidence.hash_and_network_confirmed=true;talk(npc,'<p><b>'+escapeStoryHtml(name.toUpperCase())+':</b> The hash identifies the transfer; the network tells us which ledger to search. I have the explorer open. Check the recipient field against Softstorm’s address.</p>',[{t:'Compare the recipient addresses',f:()=>{G.evidence['met_'+name]=true;finishStep();}}]);}},
        {t:'Trust the screenshot and release the laptop',f:()=>talk(npc,'<p><b>'+escapeStoryHtml(name.toUpperCase())+':</b> No. It proves what the picture says, not where the funds landed. The shop still has no matching payment. Check the public record before releasing anything.</p>',[{t:'Open the transaction record',f:()=>{G.evidence.hash_and_network_confirmed=true;G.evidence['met_'+name]=true;finishStep();}}])}
      ]
      :m.id==='m02'&&index===1
      ?[
        {t:'Compare the recipient with the shop address',f:()=>{G.evidence.larai_opened_explorer=true;finishStep();}},
        {t:'Treat the confirmed status as proof the shop was paid',f:()=>talk(npc,'<p><b>'+escapeStoryHtml(name.toUpperCase())+':</b> Confirmed tells us the transfer was recorded. It does not identify the shop as the recipient. Read the full address before drawing that conclusion.</p>',[{t:'Inspect the recipient field',f:()=>{G.evidence.larai_opened_explorer=true;finishStep();}}])}
      ]
      :[
        {t:choices[0],f:()=>{G.evidence['met_'+name]=true;G.evidence['approach_'+m.id]='evidence-first';finishStep();}},
        {t:choices[1],f:()=>talk(npc,'<p><b>'+escapeStoryHtml(name.toUpperCase())+':</b> '+escapeStoryHtml(STORY_NPC_FOLLOWUPS[m.id]||'Let me show you the record I am relying on.')+'</p>',[{t:'Compare the account with the record',f:()=>{G.evidence['met_'+name]=true;G.evidence['approach_'+m.id]='compare-accounts';finishStep();}}])}
      ];
    talk(npc,html,buttons);
  };
  return step;
}
const CHRONICLE_ACTIVITY_RULES=[
{r:/reach the queue and watch a buyer try to pay/i,q:"A buyer opens checkout, pauses at the network list, then backs out. What should you do?",o:["Observe and record the exact step without jumping in to coach them","Tell them which option to tap so the demo succeeds","Decide they don't understand crypto"],a:0,w:"Observe the behaviour first. Coaching the buyer hides the point where the product itself may be confusing."},
{r:/follow the second buyer's attempt without coaching them/i,q:"The next buyer also opens the network list twice and abandons checkout. What does that tell you?",o:["Two attempts show a repeatable hesitation worth reproducing, not a proven reason yet","All market traders are unable to use payment apps","The team should add a dashboard immediately"],a:0,w:"A repeated pattern is evidence of friction. Reproduce it before deciding on the smallest useful change."},
{r:/reproduce the network-selection dead end with blockqueen and christol/i,q:"In the studio, the team reproduces the same dead end. What should they change first?",o:["Make the network options understandable in plain language and test the flow","Add more screens and technical explanations","Release the change without another user test"],a:0,w:"Fix the observed obstacle with one focused change, then retest it with a real buyer."},
{r:/test a clearer checkout with the next buyer/i,q:"The labels are clearer. How do you know whether the change helped?",o:["Let the next buyer try without coaching and record whether they complete checkout","Ask the team if the new screen looks premium","Assume success because the button was tapped once"],a:0,w:"Test with a buyer and observe completion. A prettier screen is not proof of a better checkout."},
{r:/compare the viral screenshot with the original message/i,q:"The forwarded image says Timi's wallet was emptied, but the original message is still available. What do you compare first?",o:["Preserve both versions and compare their timestamps, crop and missing transaction details","Trust the forwarded version because it has more reactions","Delete the original message so the group stops arguing"],a:0,w:"Keep both versions. A crop can remove context, but the missing context alone does not identify who changed the image."},
{r:/check the wallet activity against the screenshot's claim/i,q:"The screenshot claims an outgoing transfer on a named network at 14:07. What is the strongest check?",o:["With Timi's consent, compare the public wallet activity on that network and time with the claimed transfer","Ask Timi to reveal the recovery phrase so you can log in","Assume a zero-balance image proves every asset is gone"],a:0,w:"Check the relevant public record using the known address and network. Never ask for recovery words, and do not claim more than the record shows."},
{r:/correct the group without exposing timi or guessing who edited it/i,q:"The relevant record does not support the screenshot's claim, but the editor is unknown. What should the correction say?",o:["The screenshot is unverified and the checked record does not show the claimed transfer; the editor is not identified","Timi definitely has no risk on any network and the sender is guilty","Post Timi's private chat and accuse the first account that forwarded it"],a:0,w:"Correct only the claim the evidence can address. Protect Timi's privacy and leave the editor's identity unresolved."},
{r:/identify the source of the copied address/i,q:"The transaction went to a different address. Which evidence helps explain where the buyer copied it from?",o:["Preserve the page URL, timestamp and address shown","Guess who changed the page","Use the buyer's display name as proof"],a:0,w:"Preserve the source and time before the page changes. The address mismatch is confirmed; intent still needs evidence."},
 {r:/compare the copied link with softstorm's real shop page/i,q:"Both pages carry the same shop logo. What exposes the lookalike?",o:["Compare the full link with the shop's saved genuine link","Trust the matching logo and colours","Assume the first page in the chat is official"],a:0,w:"A copied logo is easy to imitate. Compare the actual link and preserve both versions."},
 {r:/trace how the altered link reached the buyer/i,q:"The link was forwarded from a familiar display name. What can you safely record?",o:["The original message, sender handle and timestamps","That the account owner definitely created the page","A public accusation before checking the message trail"],a:0,w:"A message trail can show how a link spread; it does not automatically prove who created it or controlled the account."},
 {r:/write an incident report that separates facts from guesses/i,q:"What belongs in the incident report?",o:["The confirmed wrong recipient, captured lookalike link, message times and unanswered questions","The sender's name labelled as the culprit","A confident explanation even where the trail has gaps"],a:0,w:"A useful report separates verified facts from unanswered questions and keeps the evidence reviewable."},
 {r:/inspect the recovery page and spot the trap/i,q:"The page has a familiar logo, a ticking timer and a twelve-word field. Which detail is the real danger?",o:["It demands the wallet's recovery phrase","The logo is a different colour","The page loads slowly"],a:0,w:"A recovery phrase can give someone control of the wallet. A logo and countdown are easy to fake."},
{r:/reproduce the payment bug with a test case/i,q:"The checkout can process one payment twice. What should the test reproduce?",o:["The same repeated-call sequence that triggers the duplicate processing","Only a successful single payment","The app's welcome animation"],a:0,w:"A repeatable failing sequence lets the team verify the fix and guard against regression."},
{r:/execute a small practice swap after reviewing the quote/i,q:"Before confirming the practice swap, what should you compare?",o:["The token address, network, fees and expected output","Only the ticker symbol","A promoter's claim that the pool is safe"],a:0,w:"A token symbol can be copied. Check the actual token, network, quote and permissions."},
 {r:/verify the support route without sharing wallet secrets/i,q:"The page provides a 'support agent' number. How do you verify it?",o:["Find the official support route independently from the wallet provider's known site or app","Call the number shown on the suspicious page","Send the phrase so support can identify the wallet"],a:0,w:"Don't trust contact details supplied by the suspicious page. Find the provider's support route independently."},
{r:/publish a clear incident notice/i,q:"What should a community safety notice contain?",o:["The confirmed issue, safe next steps and the official reporting route","The victim's private messages and username","An unverified claim about who caused it"],a:0,w:"A clear notice helps members act safely while protecting the affected person's privacy."},
{r:/complete a relevant work sample/i,q:"What makes a hiring work sample useful?",o:["It demonstrates a core task from the role and explains the decisions","It copies another applicant's work","It promises results without evidence"],a:0,w:"A focused work sample lets the reviewer assess how you approach the actual job."},
{r:/map the trader's journey from order to collection/i,q:"Where should the team look for the missing payment record?",o:["At the hand-off between order creation, payment confirmation and collection","At the product logo","At the number of social followers"],a:0,w:"Mapping the whole journey helps reveal where information is lost between steps."},
{r:/allocate and vest the proposed token share/i,q:"What does the vesting schedule explain to the team?",o:["When an allocation becomes available and under what conditions","The token's guaranteed future price","Whether the product has real users"],a:0,w:"Allocation and vesting terms make timing and incentives transparent; they do not guarantee market value."},
{r:/test the asset claim against independent records/i,q:"The warehouse exists, but the inventory list is unsigned. What does that prove?",o:["Only that the location exists; the ownership and inventory claim still need verification","That every token is fully backed","That the photos establish legal title"],a:0,w:"Verify the specific asset, the issuer's authority and the rights represented by the token."},
{r:/review custody and redemption terms/i,q:"Before buying an asset-backed token, what must be clear?",o:["Who holds the asset, what rights the token grants and how redemption works","Only the expected resale price","Whether the token has a memorable name"],a:0,w:"Custody, enforceable rights and redemption procedures must be clear before the claim is marketed."},
{r:/verify the corrected ownership claim before sharing/i,q:"The AI report has been corrected. What should happen before it is shared?",o:["A reviewer checks the claim against the original records and cited sources","The AI confirms its own answer","The team publishes it because the wording sounds confident"],a:0,w:"Important AI outputs must be independently checked against reliable source material."},
{r:/identify a fake bridge interface/i,q:"The bridge page asks for a wallet recovery phrase to speed up the transfer. What do you do?",o:["Stop and verify the official bridge; never enter the recovery phrase","Enter the phrase because the page looks familiar","Send the transfer again immediately"],a:0,w:"A bridge does not need your recovery phrase. Verify the site and status through official sources."},
{r:/explain bridge risks and fees to the sender/i,q:"The source transfer is confirmed but the destination is pending. What should you explain?",o:["Check the bridge status, destination record and fees before considering any retry","The assets are definitely lost","A second transfer will automatically fix it"],a:0,w:"Trace both sides of the route and avoid duplicate transfers until the status is understood."},
{r:/inspect the treasury and milestone plan/i,q:"What makes a treasury spending plan accountable?",o:["A clear budget, delivery owner, milestones and public reporting","A single unexplained total","A promise to report only if someone asks"],a:0,w:"Transparent spending plans let members follow the costs, ownership and progress."},
{r:/prepare a responsible vulnerability disclosure/i,q:"What belongs in a responsible vulnerability report?",o:["Affected component, reproducible evidence, impact and a safe contact route","A live exploit posted publicly before a fix","An accusation without reproduction steps"],a:0,w:"Give maintainers enough information to verify and address the risk while avoiding unnecessary exposure."},
{r:/recommend whether launch can proceed/i,q:"The patch has not been independently verified. What should happen to launch?",o:["Hold it until the fix and regression tests are reviewed","Hide the finding to protect the deadline","Assume it is safe because no incident has happened yet"],a:0,w:"A critical finding needs a verified fix and review, not a promise."},
{r:/identify the buyer's rights from the listing/i,q:"What should the collectible listing explain?",o:["What the buyer receives, what rights remain with the creator and any restrictions","That the token transfers every copyright automatically","Only the image file format"],a:0,w:"Token ownership and copyright are different. The listing should state rights the seller can actually grant."},
{r:/rewrite unclear ownership terms before launch/i,q:"The original artist disputes the exclusive-rights claim. What should the seller do?",o:["Pause the listing until authorship and licence rights are resolved","Mint quickly before the claim spreads","Remove the artist's name from the file"],a:0,w:"Resolve authorship and licence evidence before selling an exclusive claim."},
{r:/read licence terms for the copied component/i,q:"What should you check before reusing this component?",o:["The actual licence, attribution requirements and source history","Only the repository's star count","Whether the README has a logo"],a:0,w:"Open-source reuse is allowed under stated conditions; check the licence and preserve attribution."},
{r:/present an evidence summary to joe_sef and larai/i,q:"What makes the cross-case summary reliable?",o:["Sources, dates, matches, contradictions and unresolved questions","Only the most dramatic screenshot","A final accusation without supporting records"],a:0,w:"A useful evidence summary distinguishes facts from hypotheses and preserves contradictions."},
{r:/build and test a safe prototype for the broken hand-off/i,q:"Each screen works alone, but the journey loses its source reference. What should the prototype test?",o:["The full hand-off with the source reference preserved from start to finish","Only the visual design of each screen","A single successful click with no repeat test"],a:0,w:"The end-to-end journey is what the user experiences. Test it as a complete route."},

{r:/create (?:a )?wallet/i,q:'Set up a wallet at the wallet station. What should you do first?',o:['Create the wallet and keep its recovery details private','Give the recovery phrase to a helper'],a:0,w:'A wallet helps you manage keys and addresses. Keep the recovery phrase private.',effect:'wallet-create'},
{r:/receive tokens/i,q:'A transfer is on the way. What should you check first?',o:['The destination address and supported network','A message asking for your recovery phrase','Only the sender’s display name'],a:0,w:'Check the destination and supported network before accepting an incoming transfer.',effect:'wallet-faucet'},
{r:/send a transaction/i,q:'You are about to send a transfer. What should you review?',o:['Recipient, network and amount','A stranger’s urgent message','Only the token logo'],a:0,w:'Check the recipient, network and amount before you confirm a transfer.',effect:'transaction'},
{r:/reject a malicious request/i,q:'The request asks for an unlimited spending approval to unlock a bonus. What do you do?',o:['Reject it and inspect the request','Approve it because the bonus is free'],a:0,w:'Reject unnecessary permissions. Unlimited approval can expose assets in a real wallet.',effect:'safe-rejection'},
 {r:/report the fake page and get timi out safely/i,q:"The page is confirmed suspicious. What's the next move?",o:["Close it, report the link through an official route and keep Timi's private details out of the group chat","Post Timi's screenshots and username to warn everyone","Claim the wallet was drained before checking any record"],a:0,w:"Contain the link, use official reporting and protect the person. Don't turn an attempted scam into an unsupported claim."},
{r:/transaction explorer record/i,q:'The buyer’s hash opens a confirmed 120 USDC transfer. Which details show whether the shop received it?',o:['Compare the exact recipient with the shop’s saved address','Treat Confirmed as proof the shop received it','Use the buyer’s display name instead of the address'],a:0,w:'The record is confirmed on Base for 120 USDC in block 1842031. The recipient is 0x2222222222222222222222222222222222222222, while the shop expects 0x1111111111111111111111111111111111111111. The transaction succeeded, but the funds went to a different address.',effect:'payment-dispute-trace'},
{r:/trace a transaction and compare the recipient address/i,q:'You have the transaction record. What should you compare before reporting the result?',o:['The recipient address against the shop’s expected address','Only the confirmation status','The wallet display name against the buyer’s name'],a:0,w:'The recipient address does not match the shop address. Record the mismatch without guessing why it happened.',effect:'payment-dispute-trace'},
{r:/record the address mismatch/i,q:'You have confirmed that the transaction went to a different address. What belongs in the incident note?',o:['The hash, network, amount, recipient and shop address for comparison','A guess about who intended to receive the money','A screenshot with no transaction reference'],a:0,w:'The report records a confirmed 120 USDC transfer on Base, block 1842031, to 0x2222222222222222222222222222222222222222 instead of the shop address 0x1111111111111111111111111111111111111111. The evidence establishes the mismatch, not the buyer’s intent.',effect:'payment-dispute-report'},
{r:/transaction explorer/i,q:'Which details help verify a transaction?',o:['Transaction hash, network, status and block details','A screenshot alone','The sender’s promise'],a:0,w:'Use the transaction reference and network details; a screenshot alone is not proof.',effect:'explorer-record'},
{r:/trace a transaction/i,q:'How do you trace the payment?',o:['Match the hash, recipient, amount and status','Guess from the wallet name','Trust a forwarded screenshot'],a:0,w:'Trace the transaction using the hash and verify the recipient, amount and status.'},
{r:/record the address mismatch/i,q:'You have confirmed that the transaction went to a different address. What should go into the incident note?',o:['The hash, network, amount, recipient and the shop address for comparison','A guess about who intended to receive the money','A screenshot with no transaction reference'],a:0,w:'Record verifiable transaction details and the address comparison. Do not guess about intent.'},
{r:/identify its block/i,q:'What does a block reference help you find?',o:['Where the transaction was recorded in the chain','The owner’s password','A guaranteed transaction reversal'],a:0,w:'A block reference helps locate a transaction in the network’s recorded history.'},
{r:/proposed record change/i,q:'An unknown person proposes changing a confirmed record without evidence. What do you do?',o:['Reject the unsupported change and check the history','Accept it to keep the peace','Delete the original evidence'],a:0,w:'Preserve the history and require verifiable authorization for proposed changes.'},
{r:/explain consensus/i,q:'What helps a distributed network agree on accepted records?',o:['Network participants following shared consensus rules','One person secretly editing the ledger','A popular social post'],a:0,w:'Consensus rules help independent participants agree on the accepted state.'},
 {r:/stop timi before the recovery countdown ends/i,q:"Timi's thumb is hovering over 'Restore now'. What do you do?",o:["Get Timi to pause before sending anything","Tell Timi to hurry before the timer reaches zero","Ask Timi to forward the secret words to you"],a:0,w:"Interrupt the pressure first. Nobody needs the recovery phrase to help Timi assess the message."},
{r:/test the core flow/i,q:'What is a useful first test of the app?',o:['Walk through the main task as a user and record where it fails','Add a feature unrelated to the problem','Test only the colour palette'],a:0,w:'Test the main user journey and document the point where it breaks.'},
{r:/isolate the biggest failure/i,q:'How should you identify the main failure?',o:['Reproduce it and compare evidence from the failing steps','Guess without repeating the issue','Change several things at once'],a:0,w:'Reproduce the failure and isolate its cause before changing the product.'},
{r:/recommend a fix/i,q:'What is the strongest fix recommendation?',o:['A small change tied to the observed cause, then retest','A full rebuild without evidence','A promise that the bug can never return'],a:0,w:'Tie the fix to the evidence and retest the affected flow.'},
{r:/contract workspace/i,q:'What should you inspect first in a contract?',o:['Permissions, conditions and who can call sensitive functions','Only the contract name','The page animation'],a:0,w:'Review permissions, conditions and sensitive functions before deployment.'},
{r:/reproduce the bug/i,q:'How do you investigate a contract bug?',o:['Reproduce it with a clear test case','Try random changes in production','Ignore the steps that caused it'],a:0,w:'A reproducible test case helps reveal the underlying fault.'},
{r:/faulty assumption/i,q:'Which assumption is dangerous in contract code?',o:['That user input and caller permissions are always trustworthy','That edge cases need testing','That permissions should be explicit'],a:0,w:'Treat inputs and callers as untrusted; enforce permissions and validate edge cases.'},
{r:/propose a fix/i,q:'What should a contract fix include?',o:['The corrected rule plus tests for normal and adversarial cases','Only a comment saying it is fixed','A deploy before review'],a:0,w:'A fix needs tests that cover the intended behaviour and ways it might fail.'},
{r:/tests needed before deployment/i,q:'What should happen before deployment?',o:['Review, test edge cases and use an appropriate security audit','Skip tests because the demo works','Trust a single happy-path test'],a:0,w:'A successful demo is not a security review. Test edge cases and obtain suitable review.'},
{r:/compare liquidity pools/i,q:'Which pool is usually better for a small swap?',o:['The one with sufficient liquidity and lower expected price impact','The one with the largest promotional banner','A pool with an unknown token address'],a:0,w:'Liquidity, token identity, fees and expected price impact matter more than promotion.'},
{r:/estimate price impact/i,q:'What tends to increase price impact?',o:['A trade large relative to available liquidity','A deeper pool for the same trade','Checking the quote before confirming'],a:0,w:'A trade large relative to pool liquidity can move the execution price more.'},
{r:/execute a swap/i,q:'Before confirming a swap, what should you verify?',o:['Token pair, network, amount, fee and expected output','Only the token symbol','A stranger’s instruction to hurry'],a:0,w:'Verify the pair, network, expected output and fee before confirming.',effect:'swap'},
{r:/inspect token approval/i,q:'What is the safer approval?',o:['Only the permission and amount actually needed','Unlimited spending for any site','An approval you cannot identify'],a:0,w:'Use the smallest necessary permission and avoid approvals you do not understand.'},
{r:/liquidity and slippage/i,q:'How are liquidity and slippage related?',o:['Low liquidity can make execution move more than expected','They mean exactly the same thing as network fees','Slippage is always zero'],a:0,w:'Slippage is the difference between expected and actual execution; liquidity can affect it.'},
{r:/market and limit orders/i,q:'Which statement is correct?',o:['A limit order sets a price boundary and may not fill','A limit order guarantees profit','A market order guarantees the displayed price'],a:0,w:'A limit order sets a price boundary; market orders may experience slippage.'},
{r:/compare bid\/ask/i,q:'What is the bid-ask spread?',o:['The gap between the best buy and sell quotes','A guaranteed trading profit','The blockchain transaction hash'],a:0,w:'The spread is the difference between the best bid and best ask.'},
{r:/withdrawal incident/i,q:'Withdrawals appear delayed. What is the responsible response?',o:['Verify the official status and communicate confirmed facts','Invent a cause to calm users','Ask users to share their recovery phrases'],a:0,w:'Verify the source, share what is confirmed and explain the next update time.'},
{r:/verified status update/i,q:'What belongs in a status update?',o:['Confirmed facts, affected service, next action and next update time','Rumours presented as facts','A promise of an exact resolution without evidence'],a:0,w:'A clear update separates known facts from unknowns and states the next action.'},
{r:/custody models/i,q:'What is a key difference between custodial and self-custody?',o:['In custodial services the provider controls the keys; in self-custody the user does','They always have identical risks','Self-custody means no responsibility'],a:0,w:'Understand who controls the keys and what recovery and counterparty risks follow.'},
{r:/read a market chart/i,q:'What should a chart-based trade plan include?',o:['A scenario, invalidation point and defined risk','A prediction treated as certainty','An entry with no exit plan'],a:0,w:'Charts describe possible scenarios, not certainty. Define invalidation and risk.'},
{r:/mark a possible entry and invalidation/i,q:'Why define invalidation before entry?',o:['It identifies where the trade idea no longer holds','It guarantees the trade will win','It removes market risk'],a:0,w:'An invalidation point makes the idea testable and helps prevent impulsive decisions.'},
{r:/calculate risk/i,q:'How should position size be chosen?',o:['From the defined risk and distance to invalidation','From the size of a hoped-for profit','By doubling after a loss'],a:0,w:'Position size should follow a defined risk limit, not emotion or a profit target.'},
{r:/paper trade/i,q:'What is the purpose of a paper trade?',o:['Practise a plan and record results without real money','Guarantee future returns','Hide losses from the journal'],a:0,w:'Paper trading lets you test a plan without placing a real order.'},
{r:/open a futures position/i,q:'What should be clear before opening a futures position?',o:['Direction, position size, margin and invalidation','Only the leverage multiplier','A promise that price cannot move against you'],a:0,w:'A futures position has directional, margin and liquidation risks.'},
{r:/compare leverage/i,q:'Which leverage choice is safer to study first?',o:['Understand the unleveraged risk first and keep exposure low','Choose maximum leverage to learn faster','Assume leverage removes risk'],a:0,w:'Learn the underlying risk first. Higher leverage leaves less room for adverse price moves.'},
{r:/estimate margin/i,q:'What does margin represent in a leveraged position?',o:['Collateral supporting the position','Guaranteed profit','A refund of trading fees'],a:0,w:'Margin is collateral, and it can be lost if the position moves against you.'},
{r:/identify liquidation risk/i,q:'What can trigger liquidation?',o:['Equity falling below the required maintenance margin','A trader reading the chart','A public wallet address'],a:0,w:'If equity falls below maintenance requirements, the position may be liquidated.'},
{r:/loss and close plan/i,q:'What is a disciplined response when the trade idea is invalidated?',o:['Follow the pre-defined close plan and review the result','Increase size to win it back','Move the stop endlessly'],a:0,w:'Follow the plan, limit further exposure and review the outcome without revenge trading.'},
{r:/inspect onboarding/i,q:'What is a good first-session goal for a community?',o:['Help a newcomer complete one useful action and know what to do next','Show every channel at once','Demand a purchase before explaining anything'],a:0,w:'A clear first win helps newcomers understand the community and return with purpose.'},
{r:/interview members/i,q:'What is the best way to learn why members leave?',o:['Ask them and compare their answers with observed behaviour','Guess based on follower count','Blame inactive members'],a:0,w:'Combine respectful interviews with behaviour data to understand where people get stuck.'},
{r:/locate the drop-off/i,q:'What does a drop-off point tell you?',o:['Where people stop progressing in a journey','That every user dislikes the product','That you should add more steps'],a:0,w:'A drop-off is a signal to investigate friction, not a complete explanation by itself.'},
{r:/retention metric/i,q:'Which metric is more meaningful than raw member count?',o:['Whether people return and complete a useful action','How many accounts joined in one hour','How many emojis a post received'],a:0,w:'Measure repeated useful participation, not just sign-ups or vanity engagement.'},
{r:/identify impersonation/i,q:'How do you verify an account claiming to be a moderator?',o:['Check the official channel and known account details','Trust the display name alone','Follow a private link sent urgently'],a:0,w:'Display names can be copied. Verify through a known official channel.'},
{r:/contain a dangerous message/i,q:'A message requests passwords and recovery phrases. What should the moderator do?',o:['Warn users, preserve evidence and escalate through the trusted process','Pin the message','Ask users to test the link'],a:0,w:'Limit exposure, preserve relevant evidence and use the established incident process.'},
{r:/secure an account/i,q:'What is a safer account-recovery step?',o:['Use the official recovery flow and secure active sessions','Send credentials to a helper in DM','Reuse the compromised password'],a:0,w:'Use official recovery, rotate compromised credentials and revoke unknown sessions.'},
{r:/de-escalate a dispute/i,q:'How should a moderator handle a heated dispute?',o:['Check facts, set respectful boundaries and protect private details','Publish personal information','Take sides before checking evidence'],a:0,w:'De-escalate, check facts and avoid exposing personal information.'},
{r:/publish a clear notice/i,q:'What should an incident notice include?',o:['Confirmed facts, user guidance and the next update','Rumours and blame','Private account information'],a:0,w:'Keep the notice factual, useful and respectful of user privacy.'},
{r:/research the topic/i,q:'How do you prepare a trustworthy explanation?',o:['Check primary sources and verify important claims','Repeat the first search result','Invent details to sound confident'],a:0,w:'Verify the facts and distinguish what you know from what remains uncertain.'},
{r:/write a bio/i,q:'What should a professional bio communicate?',o:['What you do, proof of work and a clear next step','Only generic claims','Private account credentials'],a:0,w:'A strong bio makes your focus, evidence and next step easy to understand.'},
{r:/organize work samples|assemble a portfolio/i,q:'How should work samples be presented?',o:['Explain the goal, your role, the result and what can be verified','Post links with no context','Claim work created by someone else'],a:0,w:'Context helps a reviewer understand your actual contribution and assess the evidence.'},
{r:/identify missing evidence/i,q:'Your portfolio makes a claim without proof. What next?',o:['Create a relevant work sample or remove the unsupported claim','Make the claim louder','Use a fake testimonial'],a:0,w:'Fill evidence gaps with real work or make the claim more precise.'},
{r:/review a role/i,q:'What should you check in a role description?',o:['Responsibilities, required skills, terms and who is hiring','Only the promised salary','Whether the recruiter uses a famous logo'],a:0,w:'Verify the role, expectations and employer before sharing information or accepting terms.'},
{r:/map required skills/i,q:'How should you plan a skill gap?',o:['Compare requirements with current proof and choose one focused task','Claim every skill already','Avoid checking the requirements'],a:0,w:'A specific skill gap can become a practical learning plan.'},
{r:/complete a work sample/i,q:'What makes a work sample useful?',o:['It follows the brief and shows your reasoning','It ignores the brief to look impressive','It copies another person’s output'],a:0,w:'Follow the brief and explain your choices so the reviewer can assess your work.'},
{r:/submit an application/i,q:'What strengthens an application?',o:['A tailored note with relevant, verifiable evidence','A mass message with no context','An upfront payment to the recruiter'],a:0,w:'Show how your evidence matches the role and keep the application clear.'},
{r:/respond to feedback/i,q:'How should you use useful feedback?',o:['Clarify it, make a targeted revision and show what changed','Argue before understanding it','Ignore every suggestion'],a:0,w:'Turn actionable feedback into a revision and explain the change.'},
{r:/define target users/i,q:'How should a team define its target users?',o:['Name the group, their need and the situation where it occurs','Say the product is for everyone','Choose an audience only because it is large'],a:0,w:'Specific users and needs make a product hypothesis testable.'},
{r:/form a hypothesis/i,q:'What makes a growth hypothesis testable?',o:['A specific change and a measurable expected outcome','A vague wish to go viral','A guaranteed result'],a:0,w:'A good hypothesis states what will change and what evidence would support it.'},
{r:/prepare a campaign brief/i,q:'What belongs in a campaign brief?',o:['Audience, value, channel, call to action and measurement','Only a slogan','Unverified performance claims'],a:0,w:'A brief aligns the audience, message, distribution and success criteria.'},
{r:/choose success metrics/i,q:'Which metric should you choose?',o:['One tied to the behaviour the experiment is meant to change','Any number that rises','Only impressions regardless of the goal'],a:0,w:'Choose a metric connected to the intended behaviour, then compare it with a baseline.'},
{r:/interpret results/i,q:'How should you interpret an experiment?',o:['Compare results with the hypothesis and note limits','Claim success from one lucky data point','Hide results that disagree'],a:0,w:'Report what the evidence shows, what it does not show and what to test next.'},
{r:/suspicious growth offer/i,q:'A service promises thousands of real users overnight. What do you check?',o:['Source, consent, quality and whether the offer relies on fake engagement','Only the discount','Nothing if the numbers look good'],a:0,w:'Fake engagement can harm trust and mislead decisions. Verify the source and quality of growth.'},
{r:/budget/i,q:'What should you review in a project budget?',o:['Costs, runway, milestones and assumptions','Only the largest projected revenue','A guaranteed return'],a:0,w:'Understand costs, runway and assumptions before recommending funding.'},
{r:/allocation and vesting/i,q:'What does a vesting schedule describe?',o:['When allocated tokens or shares become available','A guaranteed token price','The project’s daily active users'],a:0,w:'Vesting sets a release schedule; it does not guarantee value or future price.'},
{r:/flag conflicts/i,q:'A decision-maker may benefit personally from a proposal. What should happen?',o:['Disclose the conflict and use a transparent review process','Hide the relationship','Approve it without discussion'],a:0,w:'Disclose conflicts and use a fair process so the decision can be evaluated.'},
{r:/missing ownership evidence/i,q:'The asset file lacks proof of ownership. What next?',o:['Pause the claim and request verifiable legal and custody records','Mint a token anyway','Treat the screenshot as proof'],a:0,w:'Do not claim ownership without the relevant evidence and rights.'},
{r:/custody\/redemption/i,q:'What must a buyer understand about redemption?',o:['Who holds the asset, the conditions and how redemption works','Only the token ticker','That redemption is always guaranteed'],a:0,w:'Explain custody, redemption terms, limitations and responsible parties clearly.'},
{r:/verify on-chain claims/i,q:'How should an AI-generated on-chain claim be checked?',o:['Compare it with a reliable explorer or source record','Accept it because it sounds confident','Invent a hash if one is missing'],a:0,w:'Check the source record. AI can misread data or invent details.'},
{r:/improve instructions/i,q:'What makes an instruction easier for an AI system to follow?',o:['Clear context, constraints, expected format and a verifiable goal','A vague prompt with conflicting requests','Hiding the desired output'],a:0,w:'Clear context and success criteria make outputs easier to assess and improve.'},
{r:/retest output/i,q:'How should you retest a changed AI workflow?',o:['Use known test cases and check the output against expected results','Trust the first improved answer','Test only one easy example'],a:0,w:'Known test cases help reveal whether a change actually improved reliability.'},
{r:/compare blockchain networks/i,q:'What should you compare across networks?',o:['Supported assets, fees, finality, security assumptions and tooling','Only the network logo','A social media poll'],a:0,w:'Networks differ in fees, finality, security assumptions and supported assets.'},
{r:/inspect the bridge role/i,q:'What is a key risk when using a bridge?',o:['Bridge contracts, validators or custody can introduce additional risk','A bridge removes every network risk','A matching logo proves safety'],a:0,w:'Bridges add components and trust assumptions. Review their design, security and fees.'},
{r:/identify a fake interface/i,q:'A bridge page asks for your recovery phrase. What do you do?',o:['Leave and verify the official interface','Enter it to continue','Ask the page to prove it is real'],a:0,w:'A website should not need your recovery phrase. Verify the official interface independently.'},
{r:/read proposals/i,q:'What should you read before casting a governance vote?',o:['The proposal, trade-offs, execution details and who benefits','Only the title','A message telling you how to vote'],a:0,w:'Read the proposal and its consequences before deciding.'},
{r:/inspect a treasury/i,q:'What helps people assess a treasury decision?',o:['A clear record of balances, allocations and intended use','An unexplained total','A promise that funds cannot be lost'],a:0,w:'Transparent records make it possible to question allocations and monitor use.'},
{r:/cast a governance vote/i,q:'How should you decide on a governance proposal?',o:['Choose yes, no or abstain based on the proposal','Assume every vote automatically executes the proposal','Share your credentials to vote'],a:[0,1,2],w:'Check the proposal rules, eligibility, quorum and execution process before you vote.',effect:'safe-vote'},
{r:/estimate impact/i,q:'How do you prioritize a security finding?',o:['Consider severity, likelihood and affected users or funds','Choose the easiest cosmetic change','Ignore the impact'],a:0,w:'Prioritize based on potential impact and likelihood, then document the reasoning.'},
{r:/prepare disclosure/i,q:'What belongs in responsible vulnerability disclosure?',o:['Reproducible evidence, impact, affected version and a safe contact route','A public exploit before maintainers can respond','Private data about users'],a:0,w:'Share enough evidence to reproduce the issue safely while protecting users and allowing a fix.'},
{r:/verify the patch/i,q:'How do you verify a security patch?',o:['Run regression and edge-case tests in a safe test environment','Trust the commit message','Skip tests because the issue disappeared once'],a:0,w:'Reproduce the original issue and test the fix against regressions and edge cases.'},
{r:/read license terms/i,q:'What do licence terms determine?',o:['Which uses, rights and restrictions apply to the work','The guaranteed resale price','Whether ownership records matter'],a:0,w:'A licence describes permitted use and restrictions; it does not automatically grant every right.'},
{r:/identify buyer rights/i,q:'What should a buyer check before purchasing a digital collectible?',o:['The exact rights granted and any restrictions','Only the image','A claim that the item is “fully owned”'],a:0,w:'Owning a token does not automatically grant copyright or every commercial right.'},
{r:/creator revenue models/i,q:'What should a creator know about royalties?',o:['The rules, marketplace support and limits; future revenue is not guaranteed','Royalties are guaranteed on every resale','A token alone enforces every off-chain promise'],a:0,w:'Royalty behaviour depends on the system and marketplace. Future revenue is not guaranteed.'},
{r:/explore a repository/i,q:'What should you check before contributing to a repository?',o:['Licence, project guidelines, issue scope and existing code','Only the number of stars','Whether you can remove attribution'],a:0,w:'Understand the licence and contribution process before proposing changes.'},
{r:/find an issue/i,q:'What makes a good first contribution?',o:['A clearly scoped issue with steps to reproduce and expected behaviour','A vague rewrite of the whole project','An unreviewed change straight to production'],a:0,w:'A scoped issue gives contributors a shared definition of the problem and done.'},
{r:/propose a contribution/i,q:'What should accompany a code contribution?',o:['A clear explanation, relevant tests and a reviewable change','Only “fixed it”','A demand to merge without review'],a:0,w:'Make the change understandable, test it and invite review.'},
{r:/version control and review/i,q:'Why use version control and review?',o:['To track changes, compare versions and catch problems collaboratively','To hide who changed the code','To remove the need for tests'],a:0,w:'Version history and review make collaboration more transparent and reversible.'},
{r:/review saved evidence/i,q:'How should you connect the clues you collected?',o:['Check the sources and timestamps, then compare what they support','Assume every clue proves the same claim','Ignore contradictions'],a:0,w:'Build a reconstruction from evidence, and keep uncertainty where the records do not agree.'},
{r:/identify contradictions/i,q:'Two records disagree. What is the next step?',o:['Compare source, date and context before deciding','Choose the record you like more','Delete the disagreement'],a:0,w:'Resolve contradictions by examining the source and context rather than guessing.'},
{r:/choose relevant skills/i,q:'How should a team choose skills for a challenge?',o:['Match the actual problem to people with relevant abilities','Give every task to one person','Choose roles by popularity'],a:0,w:'Match responsibilities to the work and make ownership clear.'},
{r:/coordinate a team/i,q:'What helps a small team deliver safely?',o:['Clear roles, shared milestones and regular checks','Everyone working on the same task without coordination','No review or hand-off'],a:0,w:'Clear ownership and checkpoints help teams combine work without losing accountability.'},
{r:/build a safe prototype/i,q:'What is a good prototype goal?',o:['Test the core idea with minimal risk and clear success criteria','Build everything before testing','Use funds to make the demo exciting'],a:0,w:'A prototype tests the key assumption safely before expanding the scope.'},
{r:/register for a practical assessment|complete the hands-on challenge/i,q:'What belongs in a practical assessment?',o:['A real task, clear criteria, reviewable evidence and feedback','A popularity vote only','A payment to guarantee a pass'],a:0,w:'Assess applied ability against clear criteria. No payment guarantees a pass.'},
{r:/select a specialization|choose a specialization/i,q:'Which path do you want to explore?',o:['Builder','Analyst','Creator or community contributor'],a:[0,1,2],w:'Choose a path that matches your interests and the work you want to practise.',effect:'future-direction'},
{r:/choose what Web3 means|future direction/i,q:'Which direction do you want to take next?',o:['Build products','Research and analyse','Create, educate or contribute to communities'],a:[0,1,2],w:'There is no single correct career path. Choose a direction and keep building verifiable skills.',effect:'future-direction'},
{r:/classify Web1, Web2 and Web3/i,q:'Which description fits the web eras?',o:['Web1 mostly read; Web2 read and publish; Web3 explores user ownership and decentralised systems','Web1 is blockchain and Web3 is email','All three eras work exactly the same'],a:0,w:'These are broad patterns, not strict labels. Focus on who controls the platform and how participation works.'},
{r:/compare platform control/i,q:'What is worth comparing between a central platform and a blockchain-based system?',o:['Who controls rules, data, access and changes','Only the interface colour','Whether the name sounds modern'],a:0,w:'Compare control, permissions, incentives, transparency and trade-offs rather than assuming decentralisation solves everything.'},
{r:/ask about the mark/i,q:'What is the strongest way to investigate a recurring mark?',o:['Trace it to sources and compare what each source actually proves','Assume every use is official','Ignore differences between the sources'],a:0,w:'A recurring symbol is a clue, not proof. Follow the source and compare the evidence.'},
{r:/present evidence/i,q:'What should your evidence summary include?',o:['The observation, source, result and what remains uncertain','Only your conclusion','A claim with no supporting record'],a:0,w:'Show what you observed and how you know it. Keep uncertainty visible.'},
{r:/record the outcome/i,q:'What belongs in a trade journal?',o:['The plan, risk, execution, outcome and lesson','Only winning trades','A prediction edited after the result'],a:0,w:'A journal records the original plan and result so you can evaluate decisions honestly.'},
{r:/redesign the first session/i,q:'How should you improve a weak first session?',o:['Give newcomers one clear first win and a next step','Add more channels before explaining anything','Ask everyone to buy something'],a:0,w:'A focused first experience reduces confusion and gives newcomers a reason to return.'},
{r:/prepare an opening/i,q:'What should the opening of a live session do?',o:['Set context, explain the value and tell listeners what to expect','Read a long biography with no purpose','Promise an outcome you cannot guarantee'],a:0,w:'A clear opening earns attention by setting context and expectations.'},
{r:/arrange questions/i,q:'How should you arrange questions for a live session?',o:['Start with context, move to specifics, then invite useful follow-ups','Jump randomly between unrelated topics','Avoid questions from the audience'],a:0,w:'A clear sequence helps listeners follow the conversation and understand the details.'},
{r:/host a live session/i,q:'What helps a host run a useful live session?',o:['Manage time, introduce speakers, moderate and summarise key points','Let one speaker dominate without context','Ignore safety and audience questions'],a:0,w:'The host guides the conversation, protects the room and keeps the session useful.'},
{r:/handle a difficult question/i,q:'You do not know the answer to a difficult question. What should you do?',o:['Say what you know, clarify the uncertainty and follow up with evidence','Invent a confident answer','Dismiss the person asking'],a:0,w:'Honesty builds trust. Clarify what is unknown and follow up when you can verify the answer.'},
{r:/write a recap/i,q:'What makes a recap useful?',o:['Key points, useful links, decisions and next actions','Only a screenshot of the room','A claim that everyone agreed'],a:0,w:'A recap lets people who missed the session catch up and shows what happens next.'},
{r:/identify the audience/i,q:'How do you identify the right audience for a product message?',o:['Start with who has the problem and what they need to know','Target everyone with the same message','Choose only the largest account'],a:0,w:'Audience choice follows the problem and context, not simply the biggest possible reach.'},
{r:/rewrite an announcement/i,q:'What is a stronger announcement?',o:['Specific benefit, verified details and one clear next step','Several vague promises and no next step','A fake deadline to create pressure'],a:0,w:'Make the value clear, verify the details and tell people what action is relevant.'},
{r:/create an educational post/i,q:'What should an educational post give the reader?',o:['One useful idea they can understand or apply','A guarantee of profit','A copied thread with no credit'],a:0,w:'Teach one useful thing clearly and credit sources when needed.'},
{r:/verify each claim/i,q:'How should you handle a claim you cannot verify?',o:['Remove it or clearly state the uncertainty','Publish it because it sounds impressive','Attribute it to an unnamed insider'],a:0,w:'Do not present an unverified claim as fact.'},
{r:/map their journey/i,q:'What is a user journey map for?',o:['Showing the steps users take and where they may struggle','Listing internal team titles','Predicting guaranteed revenue'],a:0,w:'Map the real steps, user needs and points where the experience becomes difficult.'},
{r:/find the main friction/i,q:'How do you identify the main point of friction?',o:['Use user evidence to find the step causing the most trouble','Pick the most colourful screen','Assume the first idea is correct'],a:0,w:'Use observations and tests to find the obstacle with the strongest evidence.'},
{r:/prioritize one fix|prioritize a fix/i,q:'How should a team prioritize a product fix?',o:['Choose a high-impact issue supported by evidence and test the change','Fix the easiest cosmetic issue regardless of impact','Change everything at once'],a:0,w:'Prioritize the issue that matters most to users and measure whether the fix works.'},
{r:/test the revised flow/i,q:'After revising a flow, what should happen?',o:['Ask users to try it and compare results with the previous version','Assume the change worked','Stop collecting feedback'],a:0,w:'Retest with users and compare the results to see whether friction actually decreased.'},
{r:/compare proposals/i,q:'How should you compare funding proposals?',o:['Assess fit, terms, risks, incentives and accountability','Choose only the biggest number','Ignore conflicts and conditions'],a:0,w:'Compare the whole proposal, including conditions and risk, rather than the headline amount.'},
{r:/recommend a responsible option/i,q:'What makes a funding recommendation responsible?',o:['It explains evidence, trade-offs, risks and conditions','It promises a guaranteed return','It hides uncertainty from decision-makers'],a:0,w:'A responsible recommendation makes the reasoning and uncertainty clear.'},
{r:/test claims against evidence/i,q:'A document claims an asset is fully backed. What should you do?',o:['Match the claim to verifiable ownership, custody and redemption records','Treat the marketing statement as proof','Ignore missing documentation'],a:0,w:'Check whether the documents support the exact claim and identify any missing evidence.'},
{r:/write questions required before launch/i,q:'Which question should be answered before an asset-backed product launches?',o:['Who legally owns the asset, who holds it and how can holders redeem?','Which influencer will post first?','How can risks be hidden?'],a:0,w:'Ownership, custody, redemption, rights and failure handling need clear answers before launch.'},
{r:/find false assumptions/i,q:'An AI report states a claim without a source. What should you do?',o:['Treat it as unverified and check the underlying data','Repeat it as fact','Invent a source'],a:0,w:'An unsourced claim remains unverified, even when it appears in a polished report.'},
{r:/trace a transfer/i,q:'What should a cross-network transfer trace include?',o:['Source network, destination network, transaction reference and final status','Only the sender’s screenshot','A token logo'],a:0,w:'Follow the source and destination records, then verify the final status on the correct network.'},
{r:/explain risks and fees/i,q:'What should users understand before using a bridge?',o:['Fees, delays, supported assets and bridge-specific risks','Only the expected speed','That every bridge is equally secure'],a:0,w:'Bridges add trust assumptions and may involve delays, fees or security failures.'},
{r:/compare trade-offs/i,q:'How should you compare governance proposals?',o:['Consider benefits, costs, who is affected and what can go wrong','Choose the most popular title','Ignore implementation details'],a:0,w:'Good governance weighs trade-offs and who bears the costs, not only the headline benefit.'},
{r:/explain the outcome and participation limits/i,q:'After a vote, what should you explain?',o:['The result, whether it passed the rules and what happens next','That every vote automatically executes the proposal','Only your personal opinion'],a:0,w:'A vote result may depend on quorum, eligibility, timelocks and execution rules.'},
{r:/rewrite unclear terms/i,q:'How do you improve unclear ownership terms?',o:['State the exact rights granted, restrictions and what is not included','Use broader claims to sound valuable','Leave key conditions unwritten'],a:0,w:'Clear terms explain the rights granted, limits and responsibilities without overclaiming.'},
{r:/improve documentation/i,q:'What makes technical documentation helpful?',o:['Clear setup steps, examples, expected results and troubleshooting','A list of jargon with no examples','Instructions that omit prerequisites'],a:0,w:'Documentation should let another person reproduce the steps and understand the expected result.'},
{r:/connect clues/i,q:'How should you connect clues from different cities?',o:['Look for corroborating evidence and explain how the clues relate','Force every clue to fit one theory','Ignore contradictions'],a:0,w:'A sound reconstruction connects corroborating evidence and notes contradictions rather than forcing a theory.'},
{r:/map professional roles/i,q:'Why map the different professional roles in Web3?',o:['To understand how distinct skills contribute to a shared outcome','To assume everyone must become a trader','To rank people by follower count'],a:0,w:'Web3 work includes technical, analytical, creative, educational and operational roles.'},
{r:/submit a reconstruction/i,q:'What makes a reconstruction convincing?',o:['A clear claim, supporting evidence, source links and stated uncertainty','A confident conclusion without sources','A copied theory'],a:0,w:'Explain your conclusion and show which evidence supports it and what remains uncertain.'},
{r:/meet representatives/i,q:'What should you learn from the representatives?',o:['What each role does, who it serves and what skills it requires','Which person has the largest following','How to bypass the assessment'],a:0,w:'Different roles solve different problems. Learn the work and skill requirements before choosing.'},
{r:/review feedback/i,q:'What is a useful response to assessment feedback?',o:['Identify the gap, revise the work and show the improvement','Argue without reviewing the feedback','Delete the first attempt'],a:0,w:'Use feedback to make a targeted improvement and keep the evidence of what changed.'},
{r:/submit the result/i,q:'What should accompany your practical result?',o:['The work, your decisions and evidence that it meets the criteria','Only a claim that it is finished','Someone else’s work'],a:0,w:'A reviewer needs the result and enough context to assess your contribution.'},
{r:/retry if needed/i,q:'If your first attempt fails, what should you do?',o:['Use the feedback, retry the task and explain what changed','Hide the failure','Repeat the same attempt without learning'],a:0,w:'Retries are part of learning. Use the feedback and document the improvement.'},
{r:/receive the practitioner record/i,q:'What should your practitioner record represent?',o:['The work and skills you demonstrated, not a guaranteed job or income','A guarantee of future profit','A claim that you know everything'],a:0,w:'The record reflects completed work and demonstrated skills; it is not a job or income guarantee.'}
,
{r:/present the result/i,q:'How should you present the team result?',o:['Demonstrate the prototype, explain each contribution and show what the test proved','Show only the final screen with no explanation','Claim success without evidence'],a:0,w:'A good demo connects the problem, the team’s work, the result and the evidence.'}
];
function chronicleActivityFor(obj){
  const label=String(obj.label||'');
  const rule=CHRONICLE_ACTIVITY_RULES.find(item=>item.r.test(label));
  return rule||{q:'How should you complete this step responsibly?',o:['Check the evidence, record what you learned and verify the source','Trust the first claim without checking','Share private information to move faster'],a:0,w:'Verify the source, protect private information and keep a clear record of what you learned.'};
}
function applyChronicleActivityEffect(effect,m,obj,choice,options){
  if(!effect) return;
  P.storyFlags=P.storyFlags||{};
  const once='effect_'+m.id+'_'+effect+'_'+obj.id;
  if(effect==='wallet-create'){
    if(!P.wallet) P.wallet='0x'+hex(20);
    P.storyFlags.practice_wallet_created=true;
  }else if(effect==='wallet-faucet'){
    if(!P.storyFlags[once]) P.usdc=Math.round(((Number(P.usdc)||0)+2)*100)/100;
    P.wallet=P.wallet||('0x'+hex(20));P.storyFlags[once]=true;
  }else if(effect==='transaction'){
    P.wallet=P.wallet||('0x'+hex(20));
    P.storyFlags.last_transaction={hash:'0x'+hex(32),network:'Base',status:'Confirmed',realTransaction:false};
  }else if(effect==='swap'){
    P.storyFlags.last_swap={pair:'TEST-A / TEST-B',status:'Completed',realTransaction:false};
  }else if(effect==='safe-rejection'){
    P.storyFlags.rejected_malicious_request=true;
  }else if(effect==='explorer-record'){
    P.storyFlags.practice_explorer_record={hash:'0x'+hex(32),block:1842031,status:'Confirmed',realTransaction:false};
  }else if(effect==='payment-dispute-trace'){
    P.storyFlags.payment_dispute_transaction={
      hash:'0x'+'a'.repeat(64),network:'Base',amount:'120 USDC',status:'Confirmed',block:1842031,
      recipient:'0x2222222222222222222222222222222222222222',
      expectedRecipient:'0x1111111111111111111111111111111111111111'
    };
  }else if(effect==='payment-dispute-report'){
    const trace=P.storyFlags.payment_dispute_transaction||{};
    P.storyFlags.payment_dispute_report={
      hash:trace.hash||'0x'+'a'.repeat(64),network:trace.network||'Base',amount:trace.amount||'120 USDC',
      status:trace.status||'Confirmed',recipient:trace.recipient||'0x2222222222222222222222222222222222222222',
      expectedRecipient:trace.expectedRecipient||'0x1111111111111111111111111111111111111111',
      conclusion:'Confirmed transfer; recipient differs from the shop address'
    };
  }else if(effect==='safe-vote'){
    P.storyFlags['test_vote_'+m.id]=options[choice];
  }else if(effect==='future-direction'){
    P.storyFlags.future_direction=options[choice];
  }
  save();updateHUD();
}
function chronicleClueStep(m,obj,index,spot){
  const npc=STORY_NPCS[m.npcs[index%m.npcs.length]],title=obj.label.replace(/[.!?]+$/,'');
  const step={kind:'clue',id:obj.id,label:obj.label,spot,title,sign:title.toUpperCase().slice(0,28),npc};
  step.run=function(){
    const activity=chronicleActivityFor(obj);
    const buttons=activity.o.map((option,choice)=>({t:option,g:!(Array.isArray(activity.a)?activity.a.includes(choice):choice===activity.a),f:()=>{
      const correct=Array.isArray(activity.a)?activity.a.includes(choice):choice===activity.a;
      if(!correct){
        G.wrong=(G.wrong||0)+1;
        talk(npc,'<p><b>'+escapeStoryHtml(npc.name.toUpperCase())+':</b> That answer leaves this part unexplained: '+escapeStoryHtml(activity.w)+'</p><p><b>YOU:</b> I missed that detail. Let me compare the options with the record again.</p>',[{t:'Try it again',f:()=>step.run()}]);
        return;
      }
      G.correct=(G.correct||0)+1;
      talk(npc,'<p><b>'+escapeStoryHtml(npc.name.toUpperCase())+':</b> That fits what we found. '+escapeStoryHtml(activity.w)+'</p><p><b>YOU:</b> Good. Save that finding with the case so the next person can check it.</p>',[{t:'Save what we found',f:()=>{
        applyChronicleActivityEffect(activity.effect,m,obj,choice,activity.o);
        G.evidence[obj.id]=true;P.storyFlags=Object.assign({},P.storyFlags||{},{['evidence_'+obj.id]:true});save();finishStep();
      }}]);
    }}));
    const sceneLead=m.id==='m02'
      ?(/transaction explorer/i.test(obj.label)
        ?'Joe has the transaction open. The amount and status match the buyer’s claim; the recipient is the part still in dispute.'
        :/trace a transaction|recipient address/i.test(obj.label)
        ?'The destination field is visible beside the address Softstorm supplied. Read both before deciding what this means.'
        :'The page may change again. Save the exact URL, timestamp and address shown in this capture.')
      :(STORY_BRIDGES[m.id]||m.title)+'. '+title+' is where the case turns.';
    const playerPrompt=((STORY_PLAYER_REACTIONS[m.id]||[])[Math.min(index,1)])||'I want to see what this record can prove.';
    const prompt='<p><b>'+escapeStoryHtml(npc.name.toUpperCase())+':</b> '+sceneLead+' '+escapeStoryHtml(activity.q)+'</p><p><b>YOU:</b> '+escapeStoryHtml(playerPrompt)+'</p><p><b>'+escapeStoryHtml(npc.name.toUpperCase())+':</b> '+(m.id==='m02'?'The buyer’s account and the public record are not the same thing. Read the field that separates them.':'That is the disputed point. Pick the option that fits the evidence in front of us.')+'</p>';
    talk(npc,prompt,buttons);
  };
  return step;
}
function chronicleChallengeStep(m,obj,index,spot){
  const npc=STORY_NPCS[m.npcs[index%m.npcs.length]];
  const challenge=CHRONICLE_CHALLENGES[m.id]||{q:'What is the safest next step?',o:['Check the evidence and understand the risks','Trust the first promise','Share private information'],a:0,w:'Pause, verify the evidence and protect private information.'};
  const step={kind:'challenge',id:obj.id,label:obj.label,spot,npc};
  step.run=function(){
    const buttons=challenge.o.map((option,choice)=>({t:option,g:choice!==challenge.a,f:()=>{
      if(choice!==challenge.a){
        G.wrong=(G.wrong||0)+1;
        talk(npc,'<p><b>'+escapeStoryHtml(npc.name.toUpperCase())+':</b> That move leaves us exposed: '+escapeStoryHtml(challenge.w)+'</p><p><b>YOU:</b> You’re right about the risk. I’ll choose again with that consequence in mind.</p>',[{t:'Try the decision again',f:()=>step.run()}]);
        return;
      }
      G.correct=(G.correct||0)+1;
      talk(npc,'<p><b>'+escapeStoryHtml(npc.name.toUpperCase())+':</b> That gives us a defensible next move. '+escapeStoryHtml(challenge.w)+'</p><p><b>YOU:</b> Record the reason as well as the decision.</p>',[{t:'Record the decision',f:()=>{applyChronicleActivityEffect(challenge.effect,m,obj,choice,challenge.o);G.evidence[obj.id]=true;P.storyFlags=Object.assign({},P.storyFlags||{},{['challenge_'+m.id]:true});finishStep();}}]);
    }}));
    talk(npc,'<p><b>'+escapeStoryHtml(npc.name.toUpperCase())+':</b> '+(m.id==='m02'?'We have the buyer’s transaction details in front of us. ':'This is happening right now: '+escapeStoryHtml((STORY_BRIDGES[m.id]||m.title))+'. ')+escapeStoryHtml(challenge.q)+'</p><p><b>YOU:</b> '+escapeStoryHtml(((STORY_PLAYER_REACTIONS[m.id]||[])[1])||'I will make the call based on what we can verify.')+'</p><p><b>'+escapeStoryHtml(npc.name.toUpperCase())+':</b> Choose what you would do next. The consequences belong to this case.</p>',buttons);
  };
  return step;
}
const MISSIONS=CHRONICLE_MISSIONS.map((story,index)=>{
  const city=STORY_CITY_BY_STATE[story.state];
  if(!city||!CITIES[city]) throw new Error('No playable city mapping for story state '+story.state);
  const people=story.npcs.map((name,i)=>chronicleNpcStep(story,name,i));
  let steps;
  if(story.id==='m01'){
    const buyerNpc=NPC('Buyer','CUSTOMER',EMBER,STORY_LOOKS[4],null,'BUYER');
    steps=[
      {
        kind:'character',id:'m01-join-dispute',label:'Find out what happened',spot:'a',npc:STORY_NPCS.Softstorm,
        run(){
          talk(STORY_NPCS.Softstorm,"<p><b>SOFTSTORM:</b> You heard the argument. I can't make sense of that screenshot, and I'm not risking the laptop on it.</p><p><b>PLAYER:</b> So wetin I fit do?</p><p><b>SOFTSTORM:</b> Go meet Abdul at his office, far side of the block. He understands this tech better than me. I'll stay here and keep the laptop safe.</p>",[
            {t:"I'm on it. Let's check the evidence.",f:()=>{G.evidence.joined_dispute=true;finishStep();}}
          ]);
        }
      },
      {
        kind:'character',id:'m01-ask-abdul',label:'Ask IamAbdul how to verify it',spot:'story',npc:STORY_NPCS.IamAbdul,
        run(){
          talk(STORY_NPCS.IamAbdul,"<p><b>IAMABDUL:</b> You haven't done this before, abi? No wahala. I'll walk you through it. First, we compare the screenshot with the shop's own records. If nothing landed, we ask the buyer for the transaction hash and network, then check the destination.</p><p><b>PLAYER:</b> I no even know where to start.</p><p><b>IAMABDUL:</b> That's why we're doing it together. Start by looking closely at what he sent.</p>",[
            {t:"Got it. Let's inspect the screenshot.",f:()=>{G.evidence.knows_verification_steps=true;finishStep();}},
            {t:"A successful screenshot should be enough.",f:()=>talk(STORY_NPCS.IamAbdul,"<p><b>IAMABDUL:</b> The screenshot is only a claim. We still need to compare its details with the shop's own records.</p>",[{t:"Fine. Show me what to check.",f:()=>{G.evidence.knows_verification_steps=true;finishStep();}}])}
          ]);
        }
      },
      {
        kind:'clue',id:'m01-screenshot',label:'Inspect the buyer’s payment screenshot',spot:'screenshot',title:'Payment screenshot',sign:'CHECK SCREENSHOT',
        run(){
          talk(STORY_NPCS.Softstorm,"<p>Zoom in: the screenshot shows <b>120 USDC · Successful</b>. But this picture doesn't show a destination address we can compare. You can't tell where the money landed from this alone.</p><p><b>PLAYER:</b> So the green tick no tell us who receive am?</p>",[
            {t:"Compare it with the shop's payment records.",f:()=>{G.evidence.screenshot_inspected=true;finishStep();}},
            {t:"That green tick proves the payment arrived.",f:()=>talk(STORY_NPCS.Softstorm,"<p>A green tick on a screenshot only tells us what the picture claims. Let's compare it with the shop's account before we decide.</p>",[{t:"Check the shop's payment records.",f:()=>{G.evidence.screenshot_inspected=true;finishStep();}}])}
          ]);
        }
      },
      {
        kind:'clue',id:'m01-shop-records',label:'Check the shop’s payment records',spot:'shopdesk',title:'Shop payment records',sign:'PAYMENT RECORDS',
        run(){
          talk(STORY_NPCS.IamAbdul,"<p>The shop's own payment history shows <b>no incoming 120 USDC payment</b>.</p><p><b>PLAYER:</b> So we never receive am?</p><p><b>IAMABDUL:</b> Not in this account. Now we need the transaction details to see where it went.</p>",[
            {t:"Hold the laptop until we verify the destination.",f:()=>{G.evidence.shop_record_checked=true;G.evidence.laptop_held=true;finishStep();}},
            {t:"Maybe it's just delayed.",f:()=>talk(STORY_NPCS.IamAbdul,"<p>Could be a delay. Could be the wrong network or address. We don't have to guess; let's compare the transaction details.</p>",[{t:"Keep the laptop here and investigate.",f:()=>{G.evidence.shop_record_checked=true;G.evidence.laptop_held=true;finishStep();}}])}
          ]);
        }
      },
      {
        kind:'character',id:'m01-buyer-arrives',label:'Speak to the buyer',spot:'buyer',npc:buyerNpc,
        run(){
          talk(buyerNpc,"<p><b>BUYER:</b> I've paid already. Check the screenshot. I came all this way for the laptop.</p><p><b>PLAYER:</b> We checked the shop records. Nothing has arrived.</p><p><b>BUYER:</b> The transaction says successful. What else do you want?</p>",[
            {t:"Ask for the transaction hash and network.",f:()=>{G.evidence.requested_transaction_details=true;talk(buyerNpc,"<p>Fine. Here's the transaction hash and the network I used. Just check it quickly, abeg.</p>",[{t:"Inspect the transaction details.",f:()=>finishStep()}]);}},
            {t:"Tell him the screenshot is enough.",f:()=>talk(buyerNpc,"<p>So you'll give me the laptop then?</p><p>Softstorm steps in: <b>Not until we verify the destination.</b></p>",[{t:"Ask for the transaction details.",f:()=>{G.evidence.requested_transaction_details=true;finishStep();}}])}
          ]);
        }
      },
      {
        kind:'clue',id:'m01-transaction-record',label:'Meet Abdul at the verification centre',spot:'ledger',title:'Public transaction record',sign:'VERIFY TX',
        run(){
          talk(STORY_NPCS.IamAbdul,"<p><b>VERIFICATION CENTRE · TRANSACTION RECORD</b></p><p>Abdul points out each field as you check it:<br>Status: Confirmed<br>Amount: 120 USDC<br>Network: Base<br>Recipient: <b>0x73A…2B1</b><br>Shop's expected address: <b>0x91C…7F0</b></p><p>Compare the last part of the recipient address with the shop's saved address. They don't match. The transaction succeeded, but it went to a different address. </p>",[
            {t:"It was sent to the wrong address. Don't release the laptop.",f:()=>{G.evidence.transaction_checked=true;G.evidence.recipient_mismatch=true;finishStep();}},
            {t:"It's confirmed, so the shop has been paid.",f:()=>talk(STORY_NPCS.IamAbdul,"<p>Not quite. ‘Confirmed’ describes the transaction, not whether this shop received it. Check the destination against the shop's saved address, then tell me what you notice.</p>",[{t:"The addresses don't match. Hold the laptop.",f:()=>{G.evidence.transaction_checked=true;G.evidence.recipient_mismatch=true;finishStep();}}])}
          ]);
        }
      },
      {
        kind:'character',id:'m01-resolve-dispute',label:'Tell Softstorm what you found',spot:'a',npc:STORY_NPCS.Softstorm,
        run(){
          talk(STORY_NPCS.Softstorm,"<p>You compare the public record with the shop's expected address. The payment was confirmed, but it went somewhere else.</p><p><b>SOFTSTORM:</b> So the screenshot wasn't necessarily fake. It just didn't prove that the money reached us.</p><p><b>PLAYER:</b> Exactly. No matching payment, no laptop.</p><p>The buyer is asked to resolve the wrong-address transfer before collecting the laptop.</p><p><b>SOFTSTORM:</b> You came here looking for breakfast and ended up saving my business.</p>",[
            {t:"Keep the laptop until the correct payment arrives.",f:()=>{G.evidence.dispute_resolved=true;P.storyFlags=Object.assign({},P.storyFlags||{},{payment_dispute_resolved:true,web3_first_lesson:true});save();finishStep();}},
            {t:"Release it because the transaction says confirmed.",f:()=>talk(STORY_NPCS.Softstorm,"<p>Wait. We just proved the recipient address is wrong. A confirmed transaction to another address is not payment to this shop.</p>",[{t:"Keep the laptop until the correct payment arrives.",f:()=>{G.evidence.dispute_resolved=true;P.storyFlags=Object.assign({},P.storyFlags||{},{payment_dispute_resolved:true,web3_first_lesson:true});save();finishStep();}}])}
          ]);
        }
      }
    ];
  }else if(story.id==='m02'){
    const joe=STORY_NPCS.Joe_Sef;
    const larai=STORY_NPCS.Larai;
    steps=[
      {
        kind:'character',id:'m02-obj-1',label:story.objectives[0].label,spot:'a',npc:joe,
        run(){
          talk(joe,"<p><b>JOE_SEF:</b> Softstorm sent you, abi? The buyer copied a payment link from a market chat. I found the page still open on this café machine, but the session clears when people log out.</p><p><b>YOU:</b> Then let's save what he saw before it disappears. No guessing who did it yet.</p>",[
            {t:'Save the full page, URL and timestamp now.',f:()=>{G.evidence.m02_page_capture_saved=true;G.evidence.m02_source_url_saved=true;finishStep();}},
            {t:'Refresh it first. Maybe the address will correct itself.',f:()=>talk(joe,"<p><b>JOE_SEF:</b> Guy, if the page changes on refresh, we lose the version the buyer actually saw. Save it first. We can test the link after.</p>",[{t:'Save the page exactly as it is.',f:()=>{G.evidence.m02_page_capture_saved=true;G.evidence.m02_source_url_saved=true;finishStep();}}])}
          ]);
        }
      },
      {
        kind:'clue',id:'m02-obj-2',label:story.objectives[1].label,spot:'screenshot',title:'Two payment links',sign:'COMPARE LINKS',npc:joe,
        run(){
          talk(joe,"<p><b>JOE_SEF:</b> Here’s the link from the buyer’s chat. Now compare it with the one Softstorm sent us directly.</p><p><b>Copied page:</b> softstorm-electronic.example/pay</p><p><b>Softstorm’s saved link:</b> softstorm-electronics.example/pay</p><p><b>YOU:</b> One letter missing. The logo was never the proof.</p>",[
            {t:'Flag the different link and keep both captures.',f:()=>{G.evidence.m02_lookalike_link_confirmed=true;G.evidence.m02_both_links_saved=true;finishStep();}},
            {t:'The logo matches, so the page must be genuine.',f:()=>talk(joe,"<p><b>JOE_SEF:</b> Anybody can copy a logo. Check the address bar, not the decoration. The two links are different, so keep both captures.</p>",[{t:'Flag the different link and keep both captures.',f:()=>{G.evidence.m02_lookalike_link_confirmed=true;G.evidence.m02_both_links_saved=true;finishStep();}}])}
          ]);
        }
      },
      {
        kind:'character',id:'m02-obj-3',label:story.objectives[2].label,spot:'story',npc:larai,
        run(){
          talk(larai,"<p><b>LARAI:</b> I sent Softstorm’s real link to the market group at 10:16. At 10:42, another link appeared under a familiar display name. The buyer says that’s the one he tapped.</p><p><b>YOU:</b> We can trace when it spread. We can’t say who made it just because we recognise the name.</p>",[
            {t:'Save the original message, handle and both timestamps.',f:()=>{G.evidence.m02_message_trail_saved=true;G.evidence.m02_timestamps_saved=true;finishStep();}},
            {t:'Post the sender’s name and call them a thief.',f:()=>talk(larai,"<p><b>LARAI:</b> And if someone hijacked that account? You’d turn a lead into another victim. Save the original message first; let the evidence speak.</p>",[{t:'Save the original message, handle and both timestamps.',f:()=>{G.evidence.m02_message_trail_saved=true;G.evidence.m02_timestamps_saved=true;finishStep();}}])}
          ]);
        }
      },
      {
        kind:'clue',id:'m02-obj-4',label:story.objectives[3].label,spot:'shopdesk',title:'Incident report',sign:'SAVE REPORT',npc:larai,
        run(){
          talk(larai,"<p><b>LARAI:</b> We have the confirmed wrong recipient from Softstorm’s case, the lookalike link, and the times it moved through the group. We still don’t know who created the page or who controlled that display name.</p><p><b>YOU:</b> Put the facts in the report. Leave the unanswered parts open.</p>",[
            {t:'Record the evidence and mark the unknowns clearly.',f:()=>{G.evidence.m02_report_saved=true;G.evidence.m02_facts_separated=true;finishStep();}},
            {t:'Name the account holder as the culprit.',f:()=>talk(larai,"<p><b>LARAI:</b> The record doesn’t prove that. We can report the suspicious link and preserve the trail without pretending we know who made it.</p>",[{t:'Record the evidence and mark the unknowns clearly.',f:()=>{G.evidence.m02_report_saved=true;G.evidence.m02_facts_separated=true;finishStep();}}])}
          ]);
        }
      },
      {
        kind:'character',id:'m02-close-case',label:'Send the report to Softstorm',spot:'a',npc:joe,
        run(){
          talk(joe,"<p><b>JOE_SEF:</b> Report sent. Softstorm has the real link and the lookalike side by side now. We’ve got enough to warn people without making up a culprit.</p><p><b>LARAI:</b> Wait—this just came in from Oyo. A student called Timi says the same page is now offering wallet recovery. It wants twelve secret words.</p><p><b>YOU:</b> That’s not payment support. Tell Timi not to enter anything. We’re checking on them next.</p>",[
            {t:'Save the report and follow the Oyo lead.',f:()=>{P.storyFlags=Object.assign({},P.storyFlags||{},{m02_complete:true,payment_recipient_mismatch_confirmed:true,copied_address_source_preserved:true});G.evidence.chapterSummary=true;finishStep();}}
          ]);
        }
      }
    ];
  }else if(story.id==='m03'){
    const unique=STORY_NPCS.Unique;
    const hunter=STORY_NPCS['Smrt huntr'];
    steps=[
      {
        kind:'character',id:'m03-obj-1',label:story.objectives[0].label,spot:'buyer',npc:unique,
        run(){
          talk(unique,"<p><b>UNIQUE:</b> You made it. Timi's right there by the bus park, and this person on the phone is telling them the wallet will be gone in one minute if they don't 'restore' it.</p><p><b>TIMI:</b> I just need my wallet back. He said the twelve words are the last step.</p><p><b>YOU:</b> Timi, pause. Don't type anything. Let me see what the page is asking for first.</p>",[
            {t:'Stop the countdown and close the page before sending anything.',f:()=>{G.evidence.m03_timi_paused=true;G.evidence.m03_phrase_not_shared=true;finishStep();}},
            {t:'Tell Timi to hurry before the timer expires.',f:()=>talk(unique,"<p><b>UNIQUE:</b> No, no. That's exactly how the page is pushing them—panic first, think later. We can help without handing over the keys to the wallet.</p>",[{t:'Pause the countdown. No secret words go in.',f:()=>{G.evidence.m03_timi_paused=true;G.evidence.m03_phrase_not_shared=true;finishStep();}}])}
          ]);
        }
      },
      {
        kind:'clue',id:'m03-obj-2',label:story.objectives[1].label,spot:'shopdesk',title:'Timi’s recovery page',sign:'CHECK THE PAGE',npc:unique,
        run(){
          talk(unique,"<p><b>UNIQUE:</b> Look at this. Same logo as the wallet app, a big countdown, and a box asking for all twelve words. The button says 'Restore now'.</p><p><b>TIMI:</b> He said everybody has to do this when they lose access.</p><p><b>YOU:</b> The page is asking for the thing that can give someone control of the whole wallet. The timer is there to rush you.</p>",[
            {t:'Mark the phrase request and countdown as the trap; keep the link for reporting.',f:()=>{G.evidence.m03_fake_phrase_request=true;G.evidence.m03_link_preserved=true;finishStep();}},
            {t:'Trust it because the logo looks familiar.',f:()=>talk(unique,"<p><b>UNIQUE:</b> Timi, you can copy a logo in two minutes. You can't copy trust like that. The page wants the wallet's keys—close it.</p>",[{t:'Save the link as evidence and flag the phrase request.',f:()=>{G.evidence.m03_fake_phrase_request=true;G.evidence.m03_link_preserved=true;finishStep();}}])}
          ]);
        }
      },
      {
        kind:'character',id:'m03-obj-3',label:story.objectives[2].label,spot:'story',npc:hunter,
        run(){
          talk(hunter,"<p><b>SMRT HUNTR:</b> The page gives a phone number and a chat handle. Both lead back to the same account that sent the link. That's not independent verification.</p><p><b>TIMI:</b> So who do I contact?</p><p><b>YOU:</b> We open the provider's known site ourselves, not through that message. And nobody needs to see your recovery words.</p>",[
            {t:'Open the known official support route independently.',f:()=>{G.evidence.m03_support_verified=true;G.evidence.m03_no_secrets_shared=true;finishStep();}},
            {t:'Call the number on the recovery page.',f:()=>talk(hunter,"<p><b>SMRT HUNTR:</b> That number came from the suspicious page. The scammer would be verifying their own story. Let's find the support route separately.</p>",[{t:'Find support through the provider’s known site or app.',f:()=>{G.evidence.m03_support_verified=true;G.evidence.m03_no_secrets_shared=true;finishStep();}}])}
          ]);
        }
      },
      {
        kind:'clue',id:'m03-obj-4',label:story.objectives[3].label,spot:'ledger',title:'Report the recovery scam',sign:'REPORT LINK',npc:hunter,
        run(){
          talk(hunter,"<p><b>SMRT HUNTR:</b> We can report the page and the message that sent it. Timi hasn't entered the words, so don't tell the group the wallet was drained. We don't have evidence for that.</p><p><b>TIMI:</b> Please don't post my chat everywhere. Everybody will laugh at me.</p><p><b>YOU:</b> We can warn people about the link without exposing you.</p>",[
            {t:'Report the link, block the sender and warn the group without naming Timi.',f:()=>{G.evidence.m03_fake_page_reported=true;G.evidence.m03_timi_privacy_protected=true;finishStep();}},
            {t:'Post Timi’s screenshots and username so everyone knows.',f:()=>talk(hunter,"<p><b>SMRT HUNTR:</b> That exposes the person who nearly got tricked and gives the link more attention. Share the warning and reporting route, not Timi's private chat.</p>",[{t:'Report the link and share a warning without Timi’s details.',f:()=>{G.evidence.m03_fake_page_reported=true;G.evidence.m03_timi_privacy_protected=true;finishStep();}}])}
          ]);
        }
      },
      {
        kind:'character',id:'m03-close-case',label:'Check on Timi before leaving',spot:'buyer',npc:unique,
        run(){
          talk(unique,"<p><b>UNIQUE:</b> The report is in. Timi's closed the page and hasn't given them the words.</p><p><b>TIMI:</b> Then why did somebody just post that my wallet is empty? Look—it's already in the group chat.</p><p><b>SMRT HUNTR:</b> That's a screenshot, not a wallet check.</p><p><b>YOU:</b> Keep the original message. We're not calling it true until we check what actually happened.</p>",[
            {t:'Save the screenshot and take it to Goodness and Semi.',f:()=>{P.storyFlags=Object.assign({},P.storyFlags||{},{m03_complete:true,recovery_scam_identified:true,timi_phrase_not_shared:true,fake_recovery_page_reported:true});G.evidence.m03_screenshot_lead_saved=true;G.evidence.chapterSummary=true;finishStep();}}
          ]);
        }
      }
    ];
  }else if(story.id==='m04'){
    const goodness=STORY_NPCS.Goodness;
    const semi=STORY_NPCS.Semi;
    steps=[
      {kind:'character',id:'m04-obj-1',label:story.objectives[0].label,spot:'buyer',npc:goodness,run(){
        talk(goodness,"<p><b>GOODNESS:</b> Look at this group chat. Somebody posted Timi's face beside 'wallet thief' and now the whole courtyard is arguing like they watched it happen.</p><p><b>TIMI:</b> I never entered those twelve words. I didn't even finish the page.</p><p><b>YOU:</b> Nobody is posting another accusation until we check the source and the record.</p>",[
          {t:'Pause the accusation and preserve the post before it disappears.',f:()=>{G.evidence.m04_accusation_paused=true;G.evidence.m04_original_preserved=true;finishStep();}},
          {t:'Forward the screenshot so everyone can judge.',f:()=>talk(goodness,"<p><b>GOODNESS:</b> That only spreads the claim to more people. We already have enough noise. Save the original first, then let's check what it actually shows.</p>",[{t:'Save the post and stop the accusation for now.',f:()=>{G.evidence.m04_accusation_paused=true;G.evidence.m04_original_preserved=true;finishStep();}}])}
        ]);
      }},
      {kind:'clue',id:'m04-obj-2',label:story.objectives[1].label,spot:'screenshot',title:'Original group message',sign:'COMPARE VERSIONS',npc:semi,run(){
        talk(semi,"<p><b>SEMI:</b> Here's the forwarded image, and here's the message it came from before somebody cropped it. The viral version cuts off the network, transaction reference and the sender's question mark.</p><p><b>GOODNESS:</b> So the picture makes a question look like a confirmed report?</p><p><b>YOU:</b> It changes how the message reads. That still doesn't tell us who made the crop.</p>",[
          {t:'Keep both versions and note the missing context and timestamps.',f:()=>{G.evidence.m04_versions_compared=true;G.evidence.m04_source_saved=true;finishStep();}},
          {t:'The crop proves the first sender edited it.',f:()=>talk(semi,"<p><b>SEMI:</b> No. We know the versions differ; we don't know who made the crop or who forwarded it. Keep the original and follow the transaction claim itself.</p>",[{t:'Record the differences without naming an editor.',f:()=>{G.evidence.m04_versions_compared=true;G.evidence.m04_source_saved=true;finishStep();}}])}
        ]);
      }},
      {kind:'clue',id:'m04-obj-3',label:story.objectives[2].label,spot:'ledger',title:'Wallet activity check',sign:'CHECK THE RECORD',npc:semi,run(){
        talk(semi,"<p><b>SEMI:</b> The image claims an outgoing transfer at 14:07 on this network. Timi has agreed to let us compare the public activity for the address they already use. We do not need to open the wallet or ask for secret words.</p><p><b>TIMI:</b> Please don't put my address in the group chat.</p><p><b>YOU:</b> We can check it privately, then report only what the record tells us.</p>",[
          {t:'Compare the known address, network and time with the public transaction record.',f:()=>{G.evidence.m04_wallet_activity_checked=true;G.evidence.m04_claimed_transfer_not_found=true;finishStep();}},
          {t:'Ask Timi for the recovery phrase to log in.',f:()=>talk(semi,"<p><b>SEMI:</b> Absolutely not. A recovery phrase gives control of the wallet; it isn't needed to inspect public transaction history. We'll use the address Timi already knows and keep it out of the group.</p>",[{t:'Check the public record without asking for secrets.',f:()=>{G.evidence.m04_wallet_activity_checked=true;G.evidence.m04_claimed_transfer_not_found=true;finishStep();}}])}
        ]);
      }},
      {kind:'clue',id:'m04-obj-4',label:story.objectives[3].label,spot:'shopdesk',title:'Correction for the group',sign:'CORRECT THE CLAIM',npc:goodness,run(){
        talk(goodness,"<p><b>GOODNESS:</b> We checked the network and time shown in the image. There's no matching outgoing transaction in that record. I want to correct the group now—but we still don't know who changed the screenshot.</p><p><b>YOU:</b> Then we say exactly that, and keep Timi's private details out of the post.</p>",[
          {t:'Post a careful correction, attach the source context and leave the editor unidentified.',f:()=>{G.evidence.m04_correction_posted=true;G.evidence.m04_timi_privacy_protected=true;finishStep();}},
          {t:'Name the first account that forwarded it.',f:()=>talk(goodness,"<p><b>GOODNESS:</b> Forwarding isn't proof of editing. If we accuse someone without evidence, we're repeating the same mistake. Correct the claim, not invent a culprit.</p>",[{t:'Post the correction and leave the identity unresolved.',f:()=>{G.evidence.m04_correction_posted=true;G.evidence.m04_timi_privacy_protected=true;finishStep();}}])}
        ]);
      }},
      {kind:'character',id:'m04-close-case',label:'Check in with Timi before leaving',spot:'buyer',npc:semi,run(){
        talk(semi,"<p><b>SEMI:</b> The corrected message is up. It says the checked record doesn't support the screenshot's claim, and that we don't know who edited it.</p><p><b>TIMI:</b> At least they stopped calling me a thief. I still want to secure the wallet through the real support route.</p><p><b>GOODNESS:</b> We'll help you do that privately. The warning can travel without your name and messages attached.</p><p><b>YOU:</b> Save the source, share the correction, and leave the accusation out.</p>",[
          {t:'Save the evidence note and follow the Osun product-team lead.',f:()=>{P.storyFlags=Object.assign({},P.storyFlags||{},{m04_complete:true,screenshot_claim_checked:true,original_message_preserved:true});G.evidence.chapterSummary=true;finishStep();}}
        ]);
      }}
    ];
  }else if(story.id==='m05'){
    const blockqueen=STORY_NPCS.Blockqueen;
    const christol=STORY_NPCS.Christol;
    steps=[
      {kind:'character',id:'m05-obj-1',label:story.objectives[0].label,spot:'buyer',npc:blockqueen,run(){
        talk(blockqueen,"<p><b>BLOCKQUEEN:</b> You came from the Oyo correction? Good. Look at this queue. The app works when Christol drives the demo, but three buyers have walked away.</p><p><b>BUYER:</b> Which one is my bank network? I don't want to send money to the wrong place.</p><p><b>CHRISTOL:</b> It's just a network choice. Maybe we need a tutorial.</p><p><b>YOU:</b> Hold on. Let's watch what the screen asks her to do before we decide what she needs.</p>",[
          {t:'Watch the buyer attempt checkout without coaching her.',f:()=>{G.evidence.m05_first_attempt_observed=true;G.evidence.m05_network_hesitation=true;finishStep();}},
          {t:'Tell her which network to select so the demo can continue.',f:()=>talk(blockqueen,"<p><b>BLOCKQUEEN:</b> That gets one payment through, but it hides the problem. Let her make the choice herself—we need to see what the screen makes unclear.</p>",[{t:'Observe without coaching and note where she hesitates.',f:()=>{G.evidence.m05_first_attempt_observed=true;G.evidence.m05_network_hesitation=true;finishStep();}}])}
        ]);
      }},
      {kind:'character',id:'m05-obj-2',label:story.objectives[1].label,spot:'ledger',npc:christol,run(){
        talk(christol,"<p><b>CHRISTOL:</b> Okay, next buyer. I'll stay quiet this time. Watch the screen, not my explanation.</p><p><b>BUYER 2:</b> I tapped this, it opened more choices, and now I don't know which one matches the shop. Let me try again… no, I'm leaving it.</p><p><b>YOU:</b> Same point, same hesitation. We have a pattern, not a guess about the customers.</p>",[
          {t:'Record the second attempt and compare it with the first.',f:()=>{G.evidence.m05_second_attempt_observed=true;G.evidence.m05_repeat_pattern=true;finishStep();}},
          {t:'Explain the technical meaning of each network to the buyer.',f:()=>talk(christol,"<p><b>CHRISTOL:</b> If we have to stand beside every buyer and explain the jargon, the checkout hasn't done its job. Let's record where they get stuck and reproduce it.</p>",[{t:'Record the hesitation without coaching.',f:()=>{G.evidence.m05_second_attempt_observed=true;G.evidence.m05_repeat_pattern=true;finishStep();}}])}
        ]);
      }},
      {kind:'clue',id:'m05-obj-3',label:story.objectives[2].label,spot:'shopdesk',title:'Checkout test bench',sign:'REPRODUCE THE PROBLEM',npc:blockqueen,run(){
        talk(blockqueen,"<p><b>BLOCKQUEEN:</b> We saw two buyers back out at the network list. Let's reproduce the same flow here before touching the design.</p><p><b>CHRISTOL:</b> Here. The labels are chain names with no hint which one the shop accepts. When I follow the buyer's path, I hesitate too.</p><p><b>YOU:</b> Then the first fix is plain-language network labels and a clear supported option—not another dashboard.</p>",[
          {t:'Reproduce the dead end and choose one focused label change.',f:()=>{G.evidence.m05_checkout_reproduced=true;G.evidence.m05_focused_fix_selected=true;finishStep();}},
          {t:'Add a dashboard before fixing checkout.',f:()=>talk(blockqueen,"<p><b>BLOCKQUEEN:</b> A dashboard won't help someone who can't finish the payment. Keep the scope small: make this choice clear, then test it.</p>",[{t:'Reproduce the issue and choose a focused label change.',f:()=>{G.evidence.m05_checkout_reproduced=true;G.evidence.m05_focused_fix_selected=true;finishStep();}}])}
        ]);
      }},
      {kind:'clue',id:'m05-obj-4',label:story.objectives[3].label,spot:'ledger',title:'Retest with the next buyer',sign:'WATCH THE RESULT',npc:christol,run(){
        talk(christol,"<p><b>CHRISTOL:</b> We've changed the network labels into plain language and made the supported choice clear. No tutorial, no extra pop-up. Let's see if the next buyer can finish without us helping.</p><p><b>BUYER 3:</b> Okay, this one says which option the shop accepts. Done. Payment sent.</p><p><b>YOU:</b> Good sign. We record the completed flow and keep watching failed attempts before calling it solved.</p>",[
          {t:'Observe the uncoached retest and record the completed checkout.',f:()=>{G.evidence.m05_retest_completed=true;G.evidence.m05_checkout_friction_reduced=true;finishStep();}},
          {t:'Call the redesign a success because it looks cleaner.',f:()=>talk(christol,"<p><b>CHRISTOL:</b> Looks aren't the measure. This buyer completed checkout without help. We'll record that result and keep tracking completion and failures.</p>",[{t:'Record the uncoached completed checkout.',f:()=>{G.evidence.m05_retest_completed=true;G.evidence.m05_checkout_friction_reduced=true;finishStep();}}])}
        ]);
      }},
      {kind:'character',id:'m05-close-case',label:'Wrap up the market test',spot:'shopdesk',npc:blockqueen,run(){
        talk(blockqueen,"<p><b>BLOCKQUEEN:</b> The clearer labels helped the next buyer finish. Christol has shelved the dashboard and is tracking completed payments and drop-offs instead.</p><p><b>CHRISTOL:</b> Wait—during the retest, one buyer tapped pay twice because the first tap looked stuck. Both payments went through.</p><p><b>BLOCKQUEEN:</b> Laloba and BigSam are preparing the contract release. If a retry can charge someone twice, we need to stop and check before this ships.</p><p><b>YOU:</b> Save the checkout notes. The duplicate-payment report goes to the team handling the release.</p>",[
          {t:'Save the market test report and follow the duplicate-payment lead.',f:()=>{P.storyFlags=Object.assign({},P.storyFlags||{},{m05_complete:true,checkout_friction_confirmed:true});G.evidence.chapterSummary=true;finishStep();}}
        ]);
      }}
    ];
  }else{
    steps=[];
    const objectives=story.objectives||[];
    const objectiveSpots=['ledger','screenshot','shopdesk','buyer','b','c','d','e','f','g','h','i','j','k','l','m','n','o'];
    let personIndex=0;
    objectives.forEach((obj,j)=>{
      if(personIndex<people.length) steps.push(people[personIndex++]);
      const spot=objectiveSpots[(j+index)%objectiveSpots.length];
      const npcIndex=Math.max(0,Math.min(personIndex-1,story.npcs.length-1));
      steps.push(j===0?chronicleChallengeStep(story,obj,npcIndex,spot):chronicleClueStep(story,obj,npcIndex,spot));
    });
    while(personIndex<people.length) steps.push(people[personIndex++]);
    steps.push({label:'Bring the evidence together',spot:'a',npc:STORY_NPCS[story.npcs[0]],run(){
      const npc=STORY_NPCS[story.npcs[0]],partner=STORY_NPCS[story.npcs[1]]||npc;
      const ending=story.ending||('We have enough evidence to close '+story.title+'.');
      const recap=ending.replace(/^The player\s+/i,'You ').replace(/^You\b/,'We');
      const nextLine=story.cliffhanger||'There is another problem ahead, and now we know to ask better questions.';
      const playerReply=story.id==='m31'?'I know what I want to build next.':'I understand the result now. Let us keep moving.';
      talk(npc,'<p><b>'+escapeStoryHtml(npc.name.toUpperCase())+':</b> '+escapeStoryHtml(recap)+'</p><p><b>'+escapeStoryHtml(partner.name.toUpperCase())+':</b> Next, we need to deal with this: '+escapeStoryHtml(nextLine)+'</p><p><b>YOU:</b> '+escapeStoryHtml(playerReply)+'</p>',[{t:'Save the chapter findings',f:()=>{P.storyFlags=Object.assign({},P.storyFlags||{},Object.fromEntries((story.storyFlags||[]).map(flag=>[flag,true])));G.evidence.chapterSummary=true;finishStep();}}]);
    }});
  }
  return {id:story.id,n:index+1,city,title:story.title,goal:story.narrativePurpose,state:story.state,story,npcs:story.npcs,characterStepCount:story.id==='m01'?2:people.length,steps,extras:[],storyFlags:story.storyFlags||[],xp:story.rewards&&story.rewards.xp||100};
});

const MBY={}; MISSIONS.forEach(m=>{ MBY[m.id]=m; });
/* Progress is tracked by completed missions and the in-game wallet balance. */
const isUnlocked=m=>{ const k=MISSIONS.indexOf(m); return k===0||!!P.done[MISSIONS[k-1].id]; };


const cityOrder=[...new Set(MISSIONS.map(m=>m.city))];

/* Story character names are canonical: never rename by array position. */
function missionNPCObjects(mission){
  const found=new Set();
  const add=value=>{
    const name=typeof value==='string'?value:(value&&value.name);
    const npc=name&&STORY_NPCS[name];
    if(npc) found.add(npc);
  };
  (mission&&mission.npcs||[]).forEach(add);
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
const isCityUnlocked=city=>{const ms=cityMissions(city);return ms.length>0&&isUnlocked(ms[0]);};
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
function loadStep(){
  clearGroup(missionGroup); storyNPCActors.length=0; colliders.length=cityCols; smoke=[]; ents=[]; goal=null;
  const m=G.m,st=m.steps[G.i];
  if(m.id==='m01'&&st.kind==='character'&&G.i<m.characterStepCount){
    let target=null;
    const fallbackSpots=['b','c','d','e','f','g','h'];
    if(m.id==='m01') placeStoryOffice(SPOTS.story);
    m.npcs.forEach((name,index)=>{
      const npc=STORY_NPCS[name];
      const spotKey=index===0?'a':index===1?'story':fallbackSpots[(index-2)%fallbackSpots.length];
      const entity=placeNPC(npc,SPOTS[spotKey]||SPOTS.a);
      entity.talk=()=>{ if(st.npc&&st.npc.name===name) st.run(); };
      entity.active=()=>!!(st.npc&&st.npc.name===name);
      ents.push(entity);
      if(st.npc&&st.npc.name===name) target=entity;
    });
    goal=target||ents[0]||null;
  }else{
    if(st.kind==='character'){
      const entity=placeNPC(st.npc,SPOTS[st.spot]||SPOTS.a);
      entity.talk=()=>st.run();entity.active=()=>true;ents.push(entity);goal=entity;
    }else if(st.kind==='clue'||st.kind==='challenge'){
      const entity=m.id==='m01'?placeStoryClue(st,SPOTS[st.spot]||SPOTS.execution):placeMissionEvidence(st,m,SPOTS[st.spot]||SPOTS.execution);
      entity.talk=()=>st.run();entity.active=()=>true;ents.push(entity);goal=entity;
    }else{
      const entity=placeNPC(st.npc,SPOTS[st.spot]||SPOTS.a);
      entity.talk=()=>st.run();entity.active=()=>true;ents.push(entity);goal=entity;
    }
    if(m.id==='m01'&&st.id==='m01-transaction-record'){
      /* Abdul meets the player at the separate verification centre for the guided check. */
      const guide=placeNPC(STORY_NPCS.IamAbdul,SPOTS.ledgerGuide);
      guide.active=()=>false; guide.talk=()=>{}; ents.push(guide);
    }
    if(m.id==='m01'&&(st.id==='m01-screenshot'||st.id==='m01-shop-records')){
      /* Keep Softstorm physically at the shop while the player inspects the evidence there. */
      const shopkeeper=placeNPC(STORY_NPCS.Softstorm,SPOTS.a);
      shopkeeper.active=()=>false; shopkeeper.talk=()=>{}; ents.push(shopkeeper);
    }
  }
  for(const ex of (m.extras||[])){
    if(G.used[ex.id]) continue;
    const entity=placeNPC(ex.npc,ex.spot); entity.ex=ex; entity.talk=()=>ex.run(entity); entity.active=()=>!G.used[ex.id]; ents.push(entity);
  }
  updateHUD();
}
function startMission(id,restart){
  const m=MBY[id];
  if(!m||!isUnlocked(m)){ toast('Finish the previous city journey first'); renderHub(); return; }
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
    if(m.id==='m01'&&P.chroniclesPrologueVersion!==2){
      missionGroup.visible=false;
      storyCastGroup.visible=true;
      storyDirector.playOpening(()=>{
        storyCastGroup.visible=false;
        missionGroup.visible=true;
        P.chroniclesPrologueSeen=true;
        P.chroniclesPrologueVersion=2;
        save();
        loadStep();
        toast('Your turn. Walk up to someone and press Talk when you are ready.',{duration:3600});
      });
    }else{
      loadStep();
      toast('Look around. Walk up to someone and press Talk when you are ready.',{duration:3600});
    }
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
  openSheet('<div class="who"><span class="av" style="background:'+INK+'">'+m.n+'</span><div><h3 style="margin:0">Mission '+m.n+' complete</h3><small>'+CITIES[m.city].name+' · '+personalize(m.title,null)+'</small></div></div>'+
    (first?'<div class="kv"><span>Mission reward</span><b>+'+missionReward.toFixed(2)+' USDC</b></div><p class="note">'+(wrong===0?'Clean run reward collected.':'Completed after '+wrong+' retry attempt'+(wrong===1?'':'s')+'.')+'</p>':'<p class="note">Replay complete. The first-clear reward has already been collected.</p>')+
    (m.city==='kitcity'?'<p><b>Welcome to KitCity. Your journey through Nigeria has brought you here to see how Web3 works in the real world.</b></p>':'')+
    (cityComplete?'<p><b>All missions in '+CITIES[m.city].name+' are complete. Your city badge is available.</b></p>':'')+
    '<div class="kv"><span>Wallet balance</span><b>'+P.usdc.toFixed(2)+' USDC</b></div>',btns);
}
function showCityBadge(city,after){
 const name=CITIES[city]?.name||city;
 openSheet('<div class="badge">'+badgeSVG('★',true,96)+'<div><h3 style="margin-top:0">'+name+' Pathfinder</h3><small>City journey completed</small></div></div><p>You completed the story missions in '+name+' and earned the city badge.</p>',[{t:'Continue journey',f:()=>{closeSheet();if(after)after();}}]);
}
function certificate(){
  const totalMissions=MISSIONS.length;
  const msg=encodeURIComponent(L('I finished all '+totalMissions+' KitCity missions and learned how to use a crypto wallet safely. Can you survive Naija with your wallet?','I don finish all '+totalMissions+' KitCity missions and I don learn how to use crypto wallet safely. You fit survive Naija with your wallet?'));
  openSheet('<div class="badge">'+badgeSVG('\u2605',true,96)+'<div><h3 style="margin-top:0">KitCity Graduate</h3><small>All '+totalMissions+' missions complete</small></div></div><p>You completed the full KitCity mission journey across all cities. Your wallet balance is <b>'+P.usdc.toFixed(2)+' USDC</b>.</p>',
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
  openSheet('<h3>Paused</h3><p class="note">'+personalize('Mission '+G.m.n+': '+G.m.title,null)+'</p>',[
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
    const color=k==='kitcity'?'#F4C76B':done===total?'#72E0B0':open?'#53DDF0':'#718093';
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

function missionCard(m){
  const un=isUnlocked(m),dn=!!P.done[m.id],reward=m.city==='kitcity'?2.5:MISSION_CLEAR_REWARD;
  return '<article class="card mission-card'+(un?'':' lock')+(m.city==='kitcity'?' final-destination':'')+'" data-mission-id="'+m.id+'"><div class="ch">'+badgeSVG(m.n,dn,46)+'<div><b>'+personalize('Mission '+m.n+': '+m.title,null)+'</b><small>'+personalize(m.goal,null)+'</small></div></div><div class="cf"><span>'+(dn?'Completed':'Up to +'+reward.toFixed(2)+' USDC')+'</span>'+(un?'<button class="btn brand" data-a="play" data-v="'+m.id+'" type="button">'+(dn?'Replay':'Play')+'</button>':'<span>Finish mission '+(m.n-1)+' first</span>')+'</div></article>';
}
function renderHub(){
  $('#hubTop').innerHTML=tx('<span class="wm"><img class="header-logo" src="https://i.postimg.cc/qqbdTXky/file-00000000958881f4a776df689a235dec.png" alt="KitCity" /></span><div class="lvl"><b>Wallet</b><div class="balance-line"><strong>'+P.usdc.toFixed(2)+' USDC</strong><small>'+Object.keys(P.done).filter(k=>P.done[k]).length+' missions completed</small></div></div>');
  document.querySelectorAll('#nav [data-v="kitlab"]').forEach(b=>b.remove());
  if(hubTab==='kitlab'||hubTab==='cityhub') hubTab='missions';
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===hubTab));
  let h='';
  if(hubTab==='missions'){
    const C=CITIES[hubCity];
    h+=mapSVG()+'<div class="map-selected"><div><span>SELECTED CITY</span><b>'+C.name+'</b><small>'+C.tag+'</small></div><strong>'+cityMissions(hubCity).filter(m=>P.done[m.id]).length+' / '+cityMissions(hubCity).length+' missions</strong></div>';
    if(hubCity==='kitcity') h+='<section class="destination-card"><span class="destination-kicker">THE FINAL DESTINATION</span><h2>KitCity</h2><p>Every city prepared you for this. KitCity is the Web3 World: a premium campus for learning, building, verification, creators, open finance and community contribution.</p><div class="destination-pillars"><span>LEARN</span><span>BUILD</span><span>VERIFY</span><span>CONTRIBUTE</span></div></section>';
    h+='<div class="chips">'+cityOrder.map(k=>'<button class="chip'+(k===hubCity?' on':'')+'" data-a="city" data-v="'+k+'" type="button" '+(isCityUnlocked(k)?'':'disabled')+'>'+CITIES[k].name+(isCityUnlocked(k)?'':' · Locked')+'</button>').join('')+'</div>';
    h+=cityMissions(hubCity).map(m=>missionCard(m)).join('');
  } else if(hubTab==='passport'){
    const allMissions=MISSIONS;
    const done=allMissions.filter(m=>P.done[m.id]).length,all=done===allMissions.length;
    const completedCities=cityOrder.filter(city=>isCityComplete(city)).length;
    h+='<div class="h2">Mission badges</div><div class="grid2">'+allMissions.map((m,i)=>'<div class="bd'+(P.done[m.id]?' earned':' off')+'">'+badgeSVG(m.n,!!P.done[m.id],64)+'<b>'+personalize('Mission '+m.n+': '+m.title,null)+'</b><span class="badge-status">'+(P.done[m.id]?'ACHIEVEMENT EARNED':'NOT EARNED YET')+'</span></div>').join('')+'</div>';
    h+='<div class="h2">Journey progress</div><div class="stat"><span>Missions complete</span><b>'+done+' of '+allMissions.length+'</b></div><div class="stat"><span>City journeys complete</span><b>'+completedCities+' of '+cityOrder.length+'</b></div>';
    h+='<div class="h2">Wallet</div>'+(P.wallet?'<div class="stat"><span>Address</span><b style="font-family:ui-monospace,Menlo,monospace;font-size:13px">'+short(P.wallet)+'</b></div><div class="stat"><span>USDC</span><b>'+P.usdc.toFixed(2)+'</b></div><div class="stat"><span>Naira token</span><b>'+fmtN(P.ngn)+'</b></div>':'<p class="soft">No wallet yet. Finish mission 1 to open one.</p>');
    if(all) h+='<div class="row"><button class="btn brand" data-a="cert" type="button">View certificate</button></div>';
  } else {
    h+='<div class="h2">Settings</div><div class="card"><div class="ch"><div><b>Language</b><small>Choose how the game talks to you.</small></div></div><div class="row"><button class="btn '+(P.lang==='en'?'brand':'line')+'" data-a="lang" data-v="en" type="button">English</button><button class="btn '+(P.lang==='pcm'?'brand':'line')+'" data-a="lang" data-v="pcm" type="button">Naija Pidgin</button></div></div>';
    h+='<div class="card"><div class="ch"><div><b>Graphics</b><small>High has real sun shadows and cinematic lighting. Low uses fewer pixels and no shadows, so it runs better on older phones.</small></div></div><div class="cf"><span>'+(P.low?'Low':'High')+'</span><button class="btn line" data-a="quality" type="button">Switch to '+(P.low?'High':'Low')+'</button></div></div>';
    const tg=(k,t,d)=>'<div class="card"><div class="ch"><div><b>'+t+'</b><small>'+d+'</small></div></div><div class="cf"><span>'+(P[k]?'On':'Off')+'</span><button class="btn line" data-a="snd" data-v="'+k+'" type="button">Turn '+(P[k]?'off':'on')+'</button></div></div>';
    h+=tg('music','Music','City-based Nigerian music from YouTube. Needs internet.')+'<div class="card"><div class="ch"><div><b>Playlist</b><small>Paste any public YouTube playlist link to use your own songs.</small></div></div><input id="plIn" type="url" inputmode="url" placeholder="https://www.youtube.com/playlist?list=..." value="'+(P.pl||'').replace(/"/g,'&quot;')+'" style="width:100%;margin-top:10px;padding:11px;border-radius:6px;border:2px solid rgba(255,255,255,.35);background:#1B1C20;color:#fff;font:14px system-ui"><div class="row"><button class="btn brand" data-a="plset" type="button">Use playlist</button><button class="btn line" data-a="plnext" type="button">Skip song</button><button class="btn line" data-a="pldef" type="button">Default</button></div></div>'+tg('sfx','Sound effects','Footsteps, chimes and voices.');
    h+='<div class="card"><div class="ch"><div><b>How to play</b><small>Move with the left stick or WASD. Hold Run or Shift to run. Tap Talk or press E near a glowing person. The arrow points to your goal. Avoid traffic.</small></div></div></div>';
    h+='<div class="card"><div class="ch"><div><b>About the streets</b><small>Street and district names are inspired by real places in each city. The layout is a stylised grid, not a survey map.</small></div></div></div>';
    h+='<div class="card"><div class="ch"><div><b>Reset progress</b><small>Erases badges, mission progress and your wallet on this device.</small></div></div><div class="cf"><span>'+(resetArm?'Tap again to confirm':'')+'</span><button class="btn line" data-a="reset" type="button">'+(resetArm?'Yes, erase everything':'Reset')+'</button></div></div>';
    h+='';
  }
  $('#hubBody').innerHTML=tx(h);
  /* Render only canonical registry missions; discard any orphaned or duplicate legacy cards. */
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
  else if(a==='city'){ if(!isCityUnlocked(v)){ toast('Finish the previous city journey first'); return; } hubCity=v; hubTab='missions'; renderHub(); }
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
    Store.del(KEY); Object.assign(P,{wallet:null,usdc:0,ngn:0,done:{},dodged:0,fell:0,scores:{},web3:null,storyPrologueSeen:false,chroniclesPrologueSeen:false,storyProgress:{},storyFlags:{}}); save(); resetArm=false; hubCity='lagos'; hubTab='missions'; renderHub(); toast('Progress erased');
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
  document.documentElement.lang=P.lang==='pcm'?'pcm':'en';
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
talkBtn.addEventListener('click',()=>interact());
function interact(){ if(S.phase!=='play'||S.modal||!nearEnt) return; nearEnt.talk(); }

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
    if(u.storyNameLabel) u.storyNameLabel.position.set(actor.position.x,6,actor.position.z);
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
  for(const e of ents){
    if(e.object){e.x=e.object.position.x;e.z=e.object.position.z;}
    if(e.hidden||!e.active()) continue;
    const d=Math.hypot(player.position.x-e.x,player.position.z-e.z);
    if(d<e.r&&d<best){ best=d; nearEnt=e; }
  }
  talkBtn.classList.toggle('hidden',!(nearEnt&&!S.modal));
  const compass=$('#compass');
  if(goal){
    compass.classList.remove('hidden');
    beacon.visible=true; beacon.position.set(goal.x,0,goal.z);
    beacon.getObjectByName('ring').scale.setScalar(1+.18*Math.sin(time*4));
    const dx=goal.x-player.position.x,dz=goal.z-player.position.z,d=Math.round(Math.hypot(dx,dz));
    $('#arrow').style.transform='rotate('+Math.atan2(dx,-dz)+'rad)';
    if(d!==lastDist){ lastDist=d; $('#dist').textContent=d<9?tr('Here'):Math.round(d/2)+' m'; }
  } else { beacon.visible=false; compass.classList.add('hidden'); }
  { updateBarks(dt);
    locT-=dt; if(locT<=0){ locT=.3; const n=locName(player.position.x,player.position.z); if(n!==lastLoc){ lastLoc=n; $('#loc').textContent=n; } } }
  camTarget.set(player.position.x,0,player.position.z);
  camDesired.set(camTarget.x,35,camTarget.z+20);
  camera.position.lerp(camDesired,1-Math.pow(.0004,dt));
  if(shake>0){ camera.position.x+=(Math.random()-.5)*shake; camera.position.y+=(Math.random()-.5)*shake*.5; shake=Math.max(0,shake-dt*2); }
  camera.lookAt(camTarget.x,1.5,camTarget.z-1);
  storyDirector.update(dt,time);
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