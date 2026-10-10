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

/* =====================  helpers  ===================== */
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

/* =====================  saved progress  ===================== */
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
const DEFAULT_PLAYER={wallet:null,usdc:0,ngn:0,done:{},dodged:0,fell:0,low:false,music:true,sfx:true,lang:'en',pl:'',name:'',scores:{},web3:null};
let activeUid=Store.get('kitcity_active_uid',null);
let storageKey=activeUid?KEY+'_user_'+activeUid:KEY;
const P=Object.assign({},DEFAULT_PLAYER,Store.get(storageKey,{}));
if(!P.done||typeof P.done!=='object') P.done={};
let cloudSyncReady=false;
function progressSnapshot(){ return {wallet:P.wallet,usdc:P.usdc,ngn:P.ngn,done:P.done,dodged:P.dodged,fell:P.fell,low:P.low,music:P.music,sfx:P.sfx,lang:P.lang,pl:P.pl,name:P.name,scores:P.scores,web3:P.web3}; }
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
  replacePlayerState(merged);
}
delete P.xp;
save();
const QUESTION_REWARD=.10,QUESTION_PENALTY=.10,MISSION_CLEAR_REWARD=.50,MISSION_RETRY_REWARD=.10;
function awardUSDC(amount,message){ P.usdc=Math.max(0,Math.round((P.usdc+amount)*100)/100); save(); updateHUD(); if(message) toast(message); }
function settleAnswer(good){ if(!G) return; if(good){ G.correct=(G.correct||0)+1; awardUSDC(QUESTION_REWARD,'Correct answer · +0.10 USDC'); } else { G.wrong=(G.wrong||0)+1; awardUSDC(-QUESTION_PENALTY,'Wrong answer · −0.10 USDC'); } }
function playerName(){ return (P.name||'Player').trim(); }
function personalize(html){ return String(html==null?'':html).replace(/Agent Kit/g,playerName()).replace(/agent kit/g,playerName()); }

/* =====================  sound (synthesised, no files)  ===================== */

/* =====================  YouTube soundtrack  ===================== */
const MUSIC_QUEUES={
  afrobeat:{label:'Naija Afrobeats Mix 2026',videos:['bGgjIvWj2I0']},
  'lagos':{label:"Lagos · Soulful Jazz & Lo-fi",videos:["Ik-9-VulHv8","XhMgKHZr1f8"]},
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
  function pause(){ if(ready){ try{ player.pauseVideo(); }catch(e){} } }
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

/* =====================  language: English / Naija Pidgin  ===================== */
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

/* =====================  renderer / scene  ===================== */
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

/* =====================  people  ===================== */
const SKINS=['#8d5a3b','#6b3f26','#a8744f','#5a3421','#7a4a2e'];
const matCache={};
const M=c=>matCache[c]||(matCache[c]=lam(c));
const ball=(r,c,sx,sy,sz)=>{ const m=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),M(c)); m.scale.set(sx||1,sy||1,sz||1); return m; };
const tube=(rt,rb,h,c)=>{ const g=new THREE.CylinderGeometry(rt,rb,h,10); g.translate(0,-h/2,0); return new THREE.Mesh(g,M(c)); };
const boxm=(w,h,d,c)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));
let logoMat=null;
const KITCITY_LOGO_URL='https://i.postimg.cc/6pLt0sn3/file-000000006e348210b7a8c70bc4ed899d.png';
function getLogoMat(){if(logoMat)return logoMat;const loader=new THREE.TextureLoader();loader.setCrossOrigin('anonymous');const texture=loader.load(KITCITY_LOGO_URL);texture.colorSpace=THREE.SRGBColorSpace;logoMat=new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide});return logoMat;}
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

/* =====================  labels  ===================== */
function label(text,bg,fg,H0){
  const size=44,font='900 '+size+'px "Arial Black",Impact,sans-serif';
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

/* =====================  world  ===================== */
const R=70;
const colliders=[],buildings=[];
const SPAWN={x:9.5,z:-9.5};
const SPOTS={
  a:{x:10,z:-30,f:-1}, b:{x:-10,z:-105,f:1}, c:{x:80,z:-35,f:-1}, d:{x:60,z:-105,f:1},
  e:{x:-80,z:-35,f:1}, f:{x:-60,z:-105,f:-1}, g:{x:10,z:-175,f:-1}, h:{x:-10,z:-175,f:1},
  i:{x:150,z:-35,f:-1}, j:{x:130,z:-175,f:1}, k:{x:-150,z:-35,f:1}, l:{x:-130,z:-175,f:-1},
  m:{x:80,z:35,f:-1}, n:{x:-80,z:105,f:1}, o:{x:10,z:175,f:-1}, x1:{x:60,z:-105,f:1}
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
  minna:{name:'Niger',tag:'The city of the Niger State',lon:6.55,lat:9.61,seed:271,sky:0xC9DBC6,ground:'#2F302B',slab:'#BFBDA8',
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
/* =====================  KitCity LOOK: real-city grading, skies, weathering  ===================== */
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
/* KitCity is a fictional Web3 destination, not another regional street-grid city. */
CITIES.kitcity={
 name:'KitCity',tag:'The Web3 World · Built by T3kit',lon:14.15,lat:13.05,seed:811,
 sky:0x07182D,fog:[180,520],ground:'#07121F',slab:'#172B3D',dirt:'#07121F',
 leaf:'#10C8DC',paint:['#10263A','#17384B','#203D54','#0D2A3B'],h:[24,88],market:1,palm:0,tree:0,
 fleet:[],pal:{},localLanguage:'web3',
 barks:['Welcome to KitCity.','Build something that lasts.','Your next chapter starts here.'],
 barksEn:['Welcome to KitCity.','Build something that lasts.','Your next chapter starts here.'],
 hawk:['Learn it. Verify it. Build it.'],conductor:['T3Kit Hub ahead.'],
 nsRoads:['Genesis Boulevard','Validator Avenue','Builder Parkway','Open Protocol Road','T3Kit Way','Creator Avenue','Consensus Drive'],
 ewRoads:['Wallet Way','Onchain Boulevard','DAO Crescent','Smart Contract Street','Learning Loop','Public Goods Road','Mainnet Avenue'],
 districts:['Genesis Quarter','Builder District','Protocol Row','Creator Campus','DAO Commons','Learning Quarter','Validator Park','Open Finance District','T3Kit Hub']
};
Object.assign(LOOK,{
 kitcity:{h:'#07182D',z:'#123B63',sun:'#7CEBFF',sI:1.35,hS:'#C5E8F8',hG:'#07121F',hI:.9,off:[-42,74,36],exp:1.12,sat:1.16,con:1.12,fade:0,lift:[0,.01,.025],gain:[.94,1.04,1.12],vig:.16,grain:.012,bloom:.72,veil:['#0A2340',.025],cl:.22,cc:'#8CEBFF',fog:[150,500],dust:0,mil:0,rust:0,lat:0,dash:'#36E5F5',roof:'#17384B',ground:'#07121F',slab:'#172B3D',dirt:'#07121F',leaf:'#10C8DC',paint:['#10263A','#17384B','#203D54','#0D2A3B'],zinc:['#123047','#17384B','#0C2337']}
});
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
  while(made<24&&tries++<480){ const b=pk(blocks),side=Math.floor(RN()*4),pt=ringPoint(b,side,rr(-12,12)); if(!ringFree(pt.x,pt.z,4)) continue; ringTaken.push({x:pt.x,z:pt.z,r:2}); addHawker(pt,side); made++; }
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
  const mk=(geo,c,x,y,z,sx,sy,sz,flat)=>{ const m=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:c,flatShading:!!flat})); m.position.set(x,y,z); m.scale.set(sx,sy,sz); backGroup.add(m); return m; };
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
  // T3Kit Hub: a monumental, multi-tier glass-and-metal headquarters.
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
  // Four monumental entrance pylons frame the T3Kit Hub gate.
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
  const hubTitle=label('T3KIT HUB',white,'#071827',2.1); hubTitle.position.set(0,58,-140); cityGroup.add(hubTitle);
  const hubSub=label('THE WEB3 WORLD',gold,'#071827',1.25); hubSub.position.set(0,53,-140); cityGroup.add(hubSub);
  const gate=label('WELCOME TO KITCITY',white,'#062638',1.4); gate.position.set(0,23,-176); cityGroup.add(gate);
  const access=label('LEARN  •  BUILD  •  CONTRIBUTE',glow,'#071827',1.05); access.position.set(0,20,-180); cityGroup.add(access);
  cityCols=colliders.length;
  mergeStatic(cityGroup); flagShadows(cityGroup); flagShadows(trafficGroup); freeze(cityGroup);
  setupBarks(C); Snd.setCity('kitcity');
}
function buildCity(key){
  const C=CITIES[key]; curCity=key;
  clearGroup(cityGroup); clearGroup(trafficGroup); texs.forEach(t=>t.dispose()); texs=[];
  colliders.length=0; buildings.length=0; cars=[]; walkers=[];
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
    const n=(k===0||k===-1)?5:(RN()<.45?3:2);
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
  for(let q=0;q<52;q++){ const sp=spotWalk(); if(!sp) continue; const sg=RN()<.5?1:-1; mkW(sp.x,sp.z,sp.dx*sg,sp.dz*sg,rr(2,3.2)); }
  for(let q=0;q<16;q++){
    const sp=spotWalk(); if(!sp) continue; const sg=RN()<.5?1:-1,spd=rr(2,2.7),rem=rr(10,30);
    const a=mkW(sp.x,sp.z,sp.dx*sg,sp.dz*sg,spd,{type:'pair',rem:rem}),b=mkW(sp.x+sp.dz*1.1,sp.z+sp.dx*1.1,sp.dx*sg,sp.dz*sg,spd,{type:'pair',rem:rem,ph:a.ph+.6});
    a.partner=b; b.partner=a;
  }
  let made=0,tr=0;
  while(made<22&&tr++<260){
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
  const att=buildPerson(def.look); att.position.set(x+1.6*face,.05,z+4.9*face); att.rotation.y=face>0?Math.PI/2:-Math.PI/2; missionGroup.add(att);
  if(o.grill){
    const gx=x+2.3*face;
    const grill=new THREE.Mesh(new THREE.BoxGeometry(1.6,.4,4),lam('#222')); grill.position.set(gx,1.75,z); missionGroup.add(grill);
    for(let i=0;i<7;i++){
      const m=new THREE.Mesh(new THREE.SphereGeometry(.35,6,5),new THREE.MeshBasicMaterial({color:0xcccccc,transparent:true,opacity:.5,depthWrite:false}));
      m.userData.ph=i/7; m.userData.ox=rand(-.5,.5); m.userData.oz=rand(-1,1); missionGroup.add(m); smoke.push({m,x:gx,z});
    }
  }
}
function placeNPC(def,spot){
  if(def.stall) buildStall(def,spot);
  else {
    const p=buildPerson(def.look); p.position.set(spot.x,.05,spot.z); p.rotation.y=spot.f>0?Math.PI/2:-Math.PI/2; missionGroup.add(p);
    const sp=label(tr(def.sign||def.name),def.signBg,def.signFg); sp.position.set(spot.x,6,spot.z); missionGroup.add(sp);
    colliders.push({x0:spot.x-1,x1:spot.x+1,z0:spot.z-1,z1:spot.z+1});
  }
  return {x:spot.x,z:spot.z,r:def.stall?7.5:6.5};
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

/* =====================  state  ===================== */
const S={phase:'title',modal:false};
let G=null,ents=[],goal=null,nearEnt=null;
let hubTab='missions',hubCity='lagos',resetArm=false;
const SUYA_ADDR='0x'+hex(20);

/* =====================  sheet UI  ===================== */
const modalEl=$('#modal'),sheetEl=$('#sheet'),talkBtn=$('#talkBtn');
let cbs=[],toastT=0,chat={npc:null,log:[]},sheetTok=0,pendingReveal=null;
function toast(msg){ const t=$('#toast'); t.textContent=tr(msg); t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2400); }
function openSheet(html,btns,typingMs){
  html=tx(personalize(html)); S.modal=true; joy.reset(); btns=btns||[]; cbs=btns.map(b=>b.f);
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
function closeSheet(){ S.modal=false; cbs=[]; sheetTok++; pendingReveal=null; chat={npc:null,log:[]}; sheetEl.classList.remove('typing'); modalEl.classList.add('hidden'); sheetEl.innerHTML=''; Snd.duck(false); }
sheetEl.addEventListener('click',e=>{
  if(pendingReveal){ pendingReveal(); return; }
  const b=e.target.closest('[data-i]'); if(!b) return;
  Snd.sfx('click'); const f=cbs[+b.dataset.i]; if(f) f();
});
const who=(i,n,r,bg)=>'<div class="who"><span class="av" style="background:'+bg+'">'+i+'</span><div><b>'+n+'</b><small>'+r+'</small></div></div>';
const whoOf=d=>who(d.name.charAt(0),d.name,d.role,d.color);
const plain=h=>h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
function talk(def,html,btns){
  html=tx(personalize(html));
  if(!S.modal||chat.npc!==def.name) chat={npc:def.name,log:[]};
  const npcName=personalize(def.name||'Local resident');
  const playerLabel=playerName().toUpperCase();
  const prev=chat.log.slice(-3).map(m=>'<div class="b '+(m.me?'me':'npc old')+'"><small class="speaker-tag">'+(m.me?playerLabel:npcName.toUpperCase())+'</small>'+m.html+'</div>').join('');
  const pl=plain(html);
  chat.log.push({html:pl.slice(0,80)+(pl.length>80?'\u2026':'')});
  const wrapped=(btns||[]).map(b=>({t:tr(b.t),g:b.g,m:b.m,f:()=>{ chat.log.push({me:1,html:tr(b.t)}); b.f(); }}));
  openSheet(personalize(whoOf(def))+'<div class="chat">'+prev+'<div class="b npc dots"><i></i><i></i><i></i></div><div class="b npc new"><small class="speaker-tag">'+npcName.toUpperCase()+'</small>'+html+'</div></div>',wrapped,Math.min(1100,320+pl.length*4));
}
function busy(def,txt,ms,next){ openSheet(whoOf(def)+'<div class="busy"><span class="spin"></span><p>'+txt+'</p></div>',[]); setTimeout(next,ms); }
const TX=()=>'0x'+hex(32);
function needFunds(n){ if(P.usdc<n-1e-9){ P.usdc=n; save(); updateHUD(); toast('Practice top-up added'); } }
function confirmTx(def,o){
  talk(def,'<h3>'+o.title+'</h3>'+o.rows.map(r=>'<div class="kv"><span>'+r[0]+'</span><b'+(r[2]?' class="mono"':'')+'>'+r[1]+'</b></div>').join('')+(o.note?'<p class="note">'+o.note+'</p>':''),
    [{t:o.btn,f:()=>busy(def,o.busyText||'Confirming\u2026',1500,()=>{ Snd.sfx('coin'); o.after(TX()); })},{t:'Cancel',g:1,f:closeSheet}]);
}
const FEE0='\u20A60, covered for you';
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

/* =====================  HUD  ===================== */
function updateHUD(){
  if(G){
    $('#mTitle').textContent=tr('Mission '+G.m.n+': '+G.m.title);
    $('#steps').innerHTML=G.m.steps.map((s,i)=>'<li class="'+(G.i>i?'done':(G.i===i?'now':''))+'">'+tr(s.label)+'</li>').join('');
  }
  $('#wallet').innerHTML=P.wallet?('<b>'+P.usdc.toFixed(2)+' USDC</b>'+(P.ngn>0?fmtN(P.ngn)+' token':short(P.wallet))):tr('No wallet yet');
}

/* =====================  missions  ===================== */
const NPC=(name,role,color,look,stall,sign)=>({name,role,color,look,stall,sign});
const MAMA=NPC('Softstorm','KitCity wallet kiosk','#0897A8',LK.mama,{body:'#0897A8',a:'#ffffff',b:BRAND,sub:'KitCity wallet'});
const SUYA=NPC('IamAbdul','Best suya on the street',EMBER,LK.suya,{body:'#8E2F1B',a:'#ffffff',b:EMBER,grill:true});
const GUY=NPC('Joseph Nnadi','Says he is your friend','#6a3fb5',LK.guy,null,'Free USDC giveaway!'); GUY.signBg='#6a3fb5'; GUY.signFg='#ffffff';
const ALHAJA=NPC('Larai','Bureau de Change','#2D6FB3',LK.trader,{body:'#2D6FB3',a:'#ffffff',b:'#2D6FB3',sub:'Bureau de Change'});
const CLERK=NPC('Unique','Swap counter','#1f4f82',LK.clerk,{body:'#1f4f82',a:'#ffffff',b:YELLOW,sub:'Swap counter'});
const BRIGHT=NPC('Smrt huntr','Shows you a text message','#6a3fb5',LK.guy,null,'Check this text'); BRIGHT.signBg='#6a3fb5'; BRIGHT.signFg='#ffffff';
const HASSAN=NPC('Goodness','Messaged you online','#C7457E',LK.man,null,'New DM'); HASSAN.signBg='#C7457E'; HASSAN.signFg='#ffffff';
const CHIOMA=NPC('Semi','Shows you a post','#E4572E',LK.woman,null,'Airdrop alert'); CHIOMA.signBg='#E4572E'; CHIOMA.signFg='#ffffff';
const KEEPER=NPC('Blockqueen','Guardian of secrets','#5a3a22',LK.elder,{body:'#5a3a22',a:'#ffffff',b:GREEN,sub:'Recovery vault'});
const NOTARY=NPC('Christol','Checks your memory','#2D6FB3',LK.clerk,{body:'#2D6FB3',a:'#ffffff',b:YELLOW,sub:'Notary'});
const MUSA=NPC('Laloba','Market trader','#C7457E',LK.woman,{body:'#C7457E',a:'#ffffff',b:'#E7D27A',sub:'Fresh yam'});
const REG=NPC('Kenny','Passport registry','#0B7A43',LK.woman,{body:'#0B7A43',a:'#ffffff',b:BRAND,sub:'KitCity Passport'});
const MINT=NPC('Leemah','Passport mint','#0897A8',LK.clerk,{body:'#0897A8',a:'#ffffff',b:BRAND,sub:'Free mint'});
const CHAIR=NPC('Cybersage','Community leader','#6a3fb5',LK.trader,{body:'#6a3fb5',a:'#ffffff',b:BRAND,sub:'Community'});
const HALL=NPC('Kodavic','Counts the votes','#2D6FB3',LK.clerk,{body:'#1f4f82',a:'#ffffff',b:BRAND,sub:'Town hall'});
const ADA=NPC('Toza','P2P trader','#E4572E',LK.woman,{body:'#E4572E',a:'#ffffff',b:YELLOW,sub:'P2P desk'});
const TOLA=NPC('Craftore','Bank agent','#0B7A43',LK.clerk,{body:'#0B7A43',a:'#ffffff',b:'#ffffff',sub:'Bank agent'});

/* ---- extra mission characters ---- */
const mkSign=(name,role,color,look,sign)=>{ const n=NPC(name,role,color,look,null,sign); n.signBg=color; n.signFg='#ffffff'; return n; };
const OXNIGHT=mkSign('OxNight','Knows the street rules','#1f4f82',LK.man,'Share or keep?');
const MOON=mkSign('Moon','Rate watcher','#6a3fb5',LK.woman,'Check the quote');
const CRYPT=mkSign('The cryptonian','Scam veteran','#0B7A43',LK.guy,'Spot the red flag');
const NNADI=mkSign('Joe_Sef','Backup advisor','#2D6FB3',LK.clerk,'Where to keep it');
const DON=mkSign('The don','Careful sender','#5a3a22',LK.elder,'Test first');
const PRAISE=mkSign('Praise','Signature checker','#C7457E',LK.trader,'Read before signing');
const BIGSAM=mkSign('BigSam','Community organiser','#E4572E',LK.man,'Read the proposal');
const LUNAX=mkSign('LunaX','Trusted trader','#0897A8',LK.woman,'Name must match');

/* One answer earns USDC; an incorrect answer deducts USDC. */
function askStep(o){
  return {label:o.label,spot:o.spot,npc:o.npc,run(){
    const opts=shuffle(o.opts);
    talk(o.npc,'<p>'+o.intro+'</p><p><b>'+o.q+'</b></p>',
      opts.map(x=>({t:x[0],f:()=>{
        const good=x[1]===1;
        Snd.sfx(good?'good':'error'); settleAnswer(good);
        talk(o.npc,'<h3>'+(good?'Correct':'Not quite')+'</h3><p>'+(good?o.good:o.bad)+'</p>',[{t:'Continue',f:finishStep}]);
      }})));
  }};
}
const STEP_OXNIGHT=askStep({label:'Ask OxNight what is safe to share',spot:'b',npc:OXNIGHT,
  intro:'Before you pay anyone, know what you can hand out. Your wallet address works like an account number, so people use it to send you money. Your recovery phrase is the master key.',
  q:'Someone wants to send you USDC and asks what to use. What do you give them?',
  opts:[['My wallet address',1],['My recovery phrase',0],['My phone password',0]],
  good:'Right. An address only lets people send to you. Keep your phrase and passwords to yourself, always.',
  bad:'No. Your phrase or password gives full control of your money. All anyone needs to pay you is your address.'});
const STEP_MOON=askStep({label:'Check the quote with Moon',spot:'g',npc:MOON,
  intro:'Rates move all day, and every swap has a fee. Compare the quote with the rate before you confirm anything.',
  q:'The swap screen shows far fewer naira than the rate you were told. What is the smart move?',
  opts:[['Cancel and check the quote and fee',1],['Confirm anyway, it is probably fine',0],['Raise slippage so it goes through',0]],
  good:'Right. A big gap can mean a high fee or a bad price. Raising slippage only makes a bad price easier to accept.',
  bad:'That is how people lose money. When the quote looks wrong, stop and check it before you confirm.'});
const STEP_CRYPT=askStep({label:'Test your instincts with The cryptonian',spot:'a',npc:CRYPT,
  intro:'I have watched scammers for years. They change the story, but the trick is nearly always the same.',
  q:'Which of these is a real red flag?',
  opts:[['Anyone asking you to send first so you can receive more',1],['An app that shows your balance',0],['A block explorer link to check a payment',0]],
  good:'Right. Real giveaways and real support never need you to pay first, and they never rush you.',
  bad:'Those are normal. The danger sign is someone who asks you to send first, or who pushes you to hurry.'});
const STEP_NNADI=askStep({label:'Ask Joe_Sef where to keep your phrase',spot:'e',npc:NNADI,
  intro:'You have written your 12 words down. Now the question is where they live.',
  q:'Where is the safest place to keep your recovery phrase?',
  opts:[['On paper, somewhere private and safe',1],['A screenshot in my gallery',0],['In my notes app or a chat with myself',0]],
  good:'Right. Paper cannot be hacked from far away. Keep it private, and consider a second copy in another safe place.',
  bad:'Phones sync to the cloud and get hacked or lost. Anything digital can leak. Paper in a safe place is best.'});
const STEP_DON=askStep({label:'Hear The don on test payments',spot:'b',npc:DON,
  intro:'Money sent on a blockchain cannot be pulled back. That is why careful people never send blind.',
  q:'You are about to send money to an address you have not used before. What do you do first?',
  opts:[['Send a small test and check it arrives',1],['Send everything, blockchains are fast',0],['Trust the address because it came in a message',0]],
  good:'Right. A small test proves the address works before you risk the full amount.',
  bad:'Too risky. A wrong or fake address cannot be fixed afterwards. Test small first, and compare the whole address.'});
const STEP_PRAISE=askStep({label:'Learn from Praise what to check before signing',spot:'c',npc:PRAISE,
  intro:'Signing feels harmless because it is quick. But what you sign decides what a site can do.',
  q:'A site asks you to sign. What should you check?',
  opts:[['That it only proves I own the wallet and mentions no transfers or permissions',1],['Nothing, signing is always free and safe',0],['Only how nice the site looks',0]],
  good:'Right. Read it first. Be careful with anything that mentions transfers, approvals or unlimited access.',
  bad:'Some signatures give a site permission over your tokens. If you cannot understand it, do not sign it.'});
const STEP_BIGSAM=askStep({label:'Talk to BigSam before you vote',spot:'e',npc:BIGSAM,
  intro:'A vote only means something if people know what they are voting for.',
  q:'What should you do before voting on a proposal?',
  opts:[['Read the full proposal and see who benefits',1],['Vote the way the loudest person says',0],['Vote fast before time runs out',0]],
  good:'Right. Read it yourself, check who benefits and ask questions. Your vote is yours.',
  bad:'Following the crowd or rushing is how bad proposals pass. Take your time and read it properly.'});
const STEP_LUNAX=askStep({label:'Check the buyer with LunaX',spot:'h',npc:LUNAX,
  intro:'In a peer trade, the buyer should pay from an account in their own name. That is how you know the money is really theirs.',
  q:'Your buyer says they will pay from their cousin\u2019s account, and the name does not match. What do you do?',
  opts:[['Keep the USDC in escrow and ask for payment from their own account, or cancel',1],['Release as soon as the money shows',0],['Accept a screenshot of the transfer',0]],
  good:'Right. Third-party payments are a common cover for stolen money and chargebacks. Stay in escrow until it is clean.',
  bad:'That puts you at risk. Payments from other people can be reversed or flagged later. Keep the USDC in escrow.'});

const WORDS=['river','market','lantern','cedar','harvest','mango','copper','saffron','pepper','canoe','drum','sunrise','thunder','yam','kola','baobab','cotton','amber','falcon','jungle','pottery','tide','village','whistle','zebra','anchor','bridge','coral','dune','ember','forest','garden','honey','island','jewel','kettle','ladder','meadow','nectar','orchard'];
const RATE=1500;

function createWallet(){
  busy(MAMA,'Setting up your wallet\u2026',1100,()=>{
    P.wallet='0x'+hex(20); save(); updateHUD();
    talk(MAMA,'<h3>Your wallet is ready</h3><span class="addr">'+P.wallet+'</span><p>This is your address. Anyone can send money here, but only you can spend it.</p>',[{t:'Claim 5 starter USDC',f:claimStarter}]);
  });
}
function claimStarter(){
  busy(MAMA,'Sending your starter USDC\u2026',1300,()=>{
    P.usdc=5; save(); updateHUD();
    talk(MAMA,'<h3>5 USDC received</h3><div class="kv"><span>Amount</span><b>5.00 USDC</b></div><div class="kv"><span>Network fee</span><b>'+FEE0+'</b></div><p>USDC is a digital dollar. Each one is meant to stay worth one US dollar, so it holds steady while you learn.</p>',[{t:'Continue',f:finishStep}]);
  });
}
function giveawayGuy(e){
  if(!P.wallet||P.usdc<2){ talk(GUY,'<p>Hey boss! Got any money? Not yet? Come back when your wallet has funds. I have a big offer for you.</p>',[{t:'Okay',f:closeSheet}]); return; }
  talk(GUY,'<p>Congratulations, you are our lucky winner! Send 2 USDC to this address and we will send you 20 USDC back in five minutes. Today only!</p><div class="kv"><span>Send to</span><b class="mono">'+short('0x'+hex(20))+'</b></div>',[
    {t:'Send 2 USDC',f:()=>busy(GUY,'Sending 2 USDC\u2026',1200,()=>{
      G.used[e.ex.id]=true; settleAnswer(false); P.fell++; save(); hideEnt(e); Snd.sfx('error');
      talk(NPC('Joseph Nnadi','The giveaway guy is gone','#B3261E',LK.guy),'<p>Nobody doubles your money, and crypto payments cannot be reversed. A real giveaway never asks you to send first.</p><p class="note">This is practice, so your balance is safe. In real life that money would be gone for good.</p>',[{t:'Keep going',f:closeSheet}]);
    })},
    {t:'Walk away',g:1,f:()=>{
      G.used[e.ex.id]=true; settleAnswer(true); P.dodged++; save(); hideEnt(e); Snd.sfx('good');
      talk(NPC('Caleb','You spotted the scam',GREEN,LK.guy),'<p>Anyone who asks you to send money first, so you can receive more, is running a scam. Walking away was right. You earned 0.10 USDC.</p>',[{t:'Keep going',f:closeSheet}]);
      toast('Street smart');
    }}
  ]);
}
function scamStep(sc){
  return {label:sc.label,spot:sc.spot,npc:sc.npc,run(){
    const opts=shuffle(sc.opts);
    talk(sc.npc,'<div class="msg"><small>'+sc.from+'</small>'+sc.msg+'</div><p><b>What do you do?</b></p>',
      opts.map(o=>({t:o[0],f:()=>{
        const good=o[1]===1;
        Snd.sfx(good?'good':'error'); settleAnswer(good); if(good){ P.dodged++; } else { P.fell++; }
        save();
        talk(sc.npc,'<h3>'+(good?'Correct':'That is a trap')+'</h3><p>'+(good?sc.good:sc.bad)+'</p>',[{t:'Continue',f:finishStep}]);
      }})));
  }};
}
function addrMutate(a,from,to){
  const hexc='0123456789abcdef'; let s=a.split('');
  for(let i=from;i<to;i++){ let c; do{ c=hexc[Math.floor(Math.random()*16)]; }while(c===s[i]); s[i]=c; }
  return s.join('');
}

const payStep=o=>({label:o.label,spot:o.spot,npc:o.npc,run(){
  needFunds(o.amt);
  confirmTx(o.npc,{title:o.title,rows:[['To',short('0x'+hex(20)),1],['Amount',o.amt.toFixed(2)+' USDC'],['Network',o.net],['Network fee',FEE0]],note:o.note,btn:o.btn,
    after:h=>{ P.usdc=Math.max(0,P.usdc-o.amt); save(); updateHUD();
      talk(o.npc,'<h3>'+o.done+'</h3><div class="kv"><span>Receipt</span><b class="mono">'+short(h)+'</b></div><div class="kv"><span>Balance</span><b>'+P.usdc.toFixed(2)+' USDC</b></div><p>'+o.say+'</p>',[{t:'Continue',f:finishStep}]); }});
}});

/* task step: pick the right action (network, address, signature, token), then do it */
function taskStep(o){ return {label:o.label,spot:o.spot,npc:o.npc,run(){ pickStep(o); }}; }
function pickStep(o){
  talk(o.npc,'<p>'+o.intro+'</p>'+(o.q?'<p><b>'+o.q+'</b></p>':''),
    shuffle(o.opts).map(x=>({t:x[0],m:o.mono?1:0,f:()=>{
      if(!x[1]){ Snd.sfx('error'); settleAnswer(false); talk(o.npc,'<h3>Not that one</h3><p>'+o.wrong+'</p>',[{t:'Try again',f:()=>pickStep(o)}]); return; }
      Snd.sfx('good'); settleAnswer(true);
      if(o.tx){
        needFunds(o.tx.amt);
        confirmTx(o.npc,{title:o.tx.title,rows:o.tx.rows(x[0]),note:o.tx.note,btn:o.tx.btn,
          after:h=>{ P.usdc=Math.max(0,P.usdc-o.tx.amt); save(); updateHUD();
            talk(o.npc,'<h3>'+o.tx.done+'</h3><div class="kv"><span>Receipt</span><b class="mono">'+short(h)+'</b></div><p>'+o.say+'</p>',[{t:'Continue',f:finishStep}]); }});
      } else {
        talk(o.npc,'<h3>Done</h3><p>'+o.say+'</p>',[{t:'Continue',f:finishStep}]);
      }
    }})));
}
const MISSIONS=[
{id:'m1',n:1,city:'lagos',title:'Your first wallet',goal:'Create a wallet, receive USDC and make your first payment.',
 steps:[
  {label:'Open your wallet and claim USDC',spot:'a',npc:MAMA,run(){
    if(P.wallet){
      talk(MAMA,'<p>Welcome back, my child. Your wallet is already open. Let me top you up so you can practise.</p>',[{t:'Top up to 5 USDC',f:()=>{ if(P.usdc<5) P.usdc=5; save(); updateHUD(); finishStep(); }}]);
      return;
    }
    talk(MAMA,'<p>Welcome, my child. Nobody buys anything in Lagos without an account. Yours is a wallet.</p><ul class="pts"><li>It lives on your phone, and only you control it.</li><li>Your address is like an account number. It is safe to share.</li><li>Your secret recovery phrase is different. Never share that with anyone.</li></ul><p class="note">Prototype: the wallet is simulated. The live game will use phone or Google sign-in here.</p>',
      [{t:'Create my wallet',f:createWallet},{t:'Not now',g:1,f:closeSheet}]);
  }},
  STEP_OXNIGHT,
  {label:'Pay IamAbdul 1 USDC',spot:'j',npc:SUYA,run(){
    needFunds(1);
    confirmTx(SUYA,{title:'Pay for suya',rows:[['Pay to',short(SUYA_ADDR),1],['Amount','1.00 USDC'],['Network fee',FEE0]],note:'Payments on a blockchain cannot be undone. Always check the address before you pay.',btn:'Pay 1 USDC',
      after:h=>{ P.usdc=Math.max(0,P.usdc-1); save(); updateHUD();
        talk(SUYA,'<h3>Payment confirmed</h3><div class="kv"><span>Receipt</span><b class="mono">'+short(h)+'</b></div><div class="kv"><span>Balance</span><b>'+P.usdc.toFixed(2)+' USDC</b></div><p>IamAbdul hands you a hot stick. Your receipt is permanent and public, so anyone can check that you paid.</p>',[{t:'Continue',f:finishStep}]); }});
  }}
 ],
 extras:[{id:'guy',spot:SPOTS.x1,npc:GUY,run:giveawayGuy}]
},
{id:'m2',n:2,city:'lagos',title:'Bureau de Change',goal:'Learn rates, fees and slippage by swapping USDC for a naira token.',
 steps:[
  {label:'Ask Larai for today\u2019s rate',spot:'e',npc:ALHAJA,run(){
    talk(ALHAJA,'<p>A Bureau de Change swaps one money for another. On KitCity you can swap USDC for a naira token. Three words to know:</p><ul class="pts"><li><b>Rate:</b> how many naira you get for 1 USDC. It moves through the day.</li><li><b>Fee:</b> the part the service keeps.</li><li><b>Slippage:</b> how far the price can move before your swap is cancelled.</li></ul>',
      [{t:'Show me today\u2019s rate',f:()=>talk(ALHAJA,'<h3>Today\u2019s rate</h3><div class="kv"><span>1 USDC</span><b>'+fmtN(RATE)+'</b></div><div class="kv"><span>Fee</span><b>0.5%</b></div><p class="note">Sample rate for this prototype. Real rates change all day, so always check the quote before you confirm.</p>',[{t:'Got it',f:finishStep}])}]);
  }},
  STEP_MOON,
  {label:'Swap 2 USDC at the counter',spot:'i',npc:CLERK,run(){
    needFunds(2);
    talk(CLERK,'<p>You are swapping <b>2 USDC</b>. First choose your slippage limit. If the price moves more than this, your swap is cancelled instead of giving you a bad deal.</p>',[
      {t:'Allow 0.5% price move',f:()=>doSwap(0.005)},
      {t:'Allow 5% price move',g:1,f:()=>doSwap(0.05)}
    ]);
    function doSwap(slip){
      G.slip=slip; settleAnswer(slip<=0.005);
      const gross=2*RATE,fee=gross*0.005,recv=gross-fee,min=recv*(1-slip);
      confirmTx(CLERK,{title:'Confirm your swap',rows:[['You pay','2.00 USDC'],['Rate','1 USDC = '+fmtN(RATE)],['Fee (0.5%)',fmtN(fee)],['Slippage limit',(slip*100).toFixed(1)+'%'],['You receive at least',fmtN(min)],['Network fee',FEE0]],btn:'Swap now',
        after:()=>{ P.usdc=Math.max(0,P.usdc-2); P.ngn+=recv;  save(); updateHUD();
          talk(CLERK,'<h3>Swap complete</h3><div class="kv"><span>Received</span><b>'+fmtN(recv)+' token</b></div><p>'+(slip<=0.005?'Smart. A tight limit protects you from a bad price.':'This worked, but a wide limit lets the price move against you. Keep slippage low unless you have a reason.')+'</p>',[{t:'Continue',f:finishStep}]); }});
    }
  }}
 ]
},
{id:'m3',n:3,city:'minna',title:'Spot the scam',goal:'Recognise phishing, fake support and fake airdrops before they cost you.',
 steps:[
  scamStep({label:'Read the security text',spot:'c',npc:BRIGHT,from:'KitCity Security',msg:'URGENT: Your wallet will be locked in 1 hour. Verify now at kitcity-verify.net and enter your 12-word recovery phrase.',
    opts:[['Enter my recovery phrase to keep my wallet',0],['Ignore the link and open the official app myself',1],['Reply and ask them to hold my wallet',0]],
    good:'Nobody real will ever ask for your recovery phrase. Not support, not the app, not a bank. Fake urgency like \u201C1 hour\u201D is how scammers rush you.',
    bad:'That is phishing. Anyone with your recovery phrase can empty your wallet and nothing can be reversed. Real services never ask for it.'}),
  scamStep({label:'Answer the stranger\u2019s DM',spot:'n',npc:HASSAN,from:'Goodness (not verified)',msg:'Hi, I am KitCity support. I saw your problem. Connect your wallet to my site and share your screen so I can fix it.',
    opts:[['Connect and share my screen',0],['Block and report. Real support never messages first',1],['Send a small amount to prove I am real',0]],
    good:'Scammers pose as support in DMs. Only use the help links inside the official app or website, and never share your screen or connect to a stranger\u2019s site.',
    bad:'Fake support is common. Connecting your wallet or sharing your screen can give them what they need to drain your funds.'}),
  scamStep({label:'Judge the airdrop post',spot:'k',npc:CHIOMA,from:'@kitbonus_official',msg:'You won 50,000 $KITBONUS! Connect your wallet and click Approve to claim. Only 10 spots left!',
    opts:[['Connect and approve to claim it',0],['Share it with my friends first',0],['Skip it. Unknown tokens and links are traps',1]],
    good:'Free tokens you did not ask for are bait. Approving a strange site can let it take your real tokens. When in doubt, skip it.',
    bad:'That \u201Cclaim\u201D is a drainer. Clicking Approve gives the site permission over your tokens. Free money plus a countdown is a classic scam.'}),
  STEP_CRYPT
 ]
},
{id:'m4',n:4,city:'minna',title:'Back up your wallet',goal:'Learn what a recovery phrase is and how to keep it safe.',
 steps:[
  {label:'Get your recovery phrase',spot:'h',npc:KEEPER,run(){
    if(!G.words) G.words=shuffle(WORDS).slice(0,12);
    talk(KEEPER,'<p>These 12 words are the master key to your wallet. Lose them and your money is gone. Share them and someone else can take it.</p><div class="words">'+G.words.map((w,i)=>'<span><em>'+(i+1)+'</em>'+w+'</span>').join('')+'</div><ul class="pts"><li>Write them on paper, in order.</li><li>Do not screenshot them or save them in notes, email or cloud storage.</li><li>Never type them into a website. Nobody legitimate will ask.</li></ul><p class="note">Practice words for this game. Your real wallet creates its own, privately.</p>',
      [{t:'I wrote them down',f:finishStep}]);
  }},
  STEP_NNADI,
  {label:'Prove you remember',spot:'m',npc:NOTARY,run(){
    if(!G.words) G.words=shuffle(WORDS).slice(0,12);
    const idxs=shuffle([0,1,2,3,4,5,6,7,8,9,10,11]).slice(0,3).sort((a,b)=>a-b);
    let q=0,right=0;
    function ask(){
      if(q>=idxs.length){
        /* Individual answers were settled when selected. */
        talk(NOTARY,'<h3>'+right+' of 3 correct</h3><p>'+(right===3?'Perfect. In real life, check your paper backup the same way, and store a copy in a second safe place.':'Your paper backup is what saves you. Write it clearly, check it twice, and keep a second copy somewhere safe.')+'</p>',[{t:'Continue',f:finishStep}]);
        return;
      }
      const i=idxs[q],correct=G.words[i];
      const wrong=shuffle(WORDS.filter(w=>G.words.indexOf(w)<0)).slice(0,2);
      talk(NOTARY,'<p>Question '+(q+1)+' of 3: what was word number <b>'+(i+1)+'</b>?</p>',shuffle([correct].concat(wrong)).map(w=>({t:w,f:()=>{
        const ok=w===correct; if(ok) right++; settleAnswer(ok);
        talk(NOTARY,'<h3>'+(ok?'Correct':'Not quite')+'</h3><p>'+(ok?'Yes, it was <b>'+correct+'</b>.':'Word '+(i+1)+' was <b>'+correct+'</b>. In real life you would read it from your paper backup.')+'</p>',[{t:'Next',f:()=>{ q++; ask(); }}]);
      }})));
    }
    ask();
  }}
 ]
},
{id:'m5',n:5,city:'kano',title:'Pay a friend, safely',goal:'Check addresses properly and send a small test first.',
 steps:[
  {label:'Get Laloba\u2019s address at the motor park',spot:'i',npc:MUSA,run(){
    if(!G.addr) G.addr='0x'+hex(20);
    talk(MUSA,'<p>Boss, I am rushing to my stall in the market across town. Take my address, then bring my 1 USDC for the yam there:</p><span class="addr">'+G.addr+'</span><p class="note">Address mistakes cannot be undone. Funds sent to the wrong address are lost.</p>',[{t:'Copy her address',f:()=>{ toast('Address copied'); finishStep(); }}]);
  }},
  STEP_DON,
  {label:'Pay Laloba at her market stall',spot:'o',npc:MUSA,run(){
    if(!G.addr) G.addr='0x'+hex(20);
    needFunds(1);
    const fakeA=addrMutate(G.addr,12,16),fakeB=addrMutate(G.addr,36,40);
    const opts=shuffle([[G.addr,1],[fakeA,0],[fakeB,0]]);
    talk(MUSA,'<p>You find Laloba at her stall. Her phone shows:</p><span class="addr">'+G.addr+'</span><p>Your clipboard has an address. <b>Which one matches hers, character for character?</b></p>',
      opts.map(o=>({t:o[0],m:1,f:()=>{
        if(o[1]!==1){ settleAnswer(false); talk(MUSA,'<h3>Close, but wrong</h3><p>That address looks similar but is not the same. Scammers make lookalike addresses that match the start and end. Compare the whole address, not just the edges.</p>',[{t:'Try again',f:()=>MISSIONS[4].steps[2].run()}]); return; }
        settleAnswer(true); talk(MUSA,'<h3>Right address</h3><p>Now decide how to send. A small test payment proves the address works before you risk the full amount.</p>',[
          {t:'Send 0.10 USDC as a test first',f:()=>{ settleAnswer(true); sendPart(0.10,true); }},
          {t:'Send all 1.00 USDC now',g:1,f:()=>{ settleAnswer(false); sendPart(1.00,false); }}
        ]);
      }})));
    function sendPart(amt,test){
      confirmTx(MUSA,{title:test?'Send a test':'Send payment',rows:[['To',short(G.addr),1],['Amount',amt.toFixed(2)+' USDC'],['Network fee',FEE0]],btn:'Send '+amt.toFixed(2)+' USDC',
        after:()=>{
          P.usdc=Math.max(0,P.usdc-amt); save(); updateHUD();
          if(test){
            
            talk(MUSA,'<h3>Laloba got it</h3><p>She confirms the test arrived. Now send the rest.</p>',[{t:'Send remaining 0.90 USDC',f:()=>sendRest()}]);
          } else {
            talk(MUSA,'<h3>Sent</h3><p>It worked this time. For larger amounts, always send a small test first.</p>',[{t:'Continue',f:finishStep}]);
          }
        }});
    }
    function sendRest(){
      confirmTx(MUSA,{title:'Send the rest',rows:[['To',short(G.addr),1],['Amount','0.90 USDC'],['Network fee',FEE0]],btn:'Send 0.90 USDC',
        after:()=>{ P.usdc=Math.max(0,P.usdc-0.9); save(); updateHUD(); talk(MUSA,'<h3>All paid</h3><p>Laloba thanks you. Test first, then send the rest. That habit saves money.</p>',[{t:'Continue',f:finishStep}]); }});
    }
  }}
 ]
},
{id:'m6',n:6,city:'kano',title:'Mint your KitCity Passport',goal:'Understand signing messages and why unlimited approvals are risky.',
 steps:[
  {label:'Sign in at the registry',spot:'f',npc:REG,run(){
    talk(REG,'<h3>Sign-in request</h3><div class="msg"><small>Message to sign</small>KitCity wants you to sign in. This message cannot move your money. Fee: \u20A60.</div><p>Signing a message proves this wallet is yours. It is different from sending a transaction. Always read what you sign.</p>',[
      {t:'Sign message',f:()=>busy(REG,'Signing\u2026',1000,()=>talk(REG,'<h3>Signed</h3><p>Welcome. The registry knows this wallet is yours, and no money moved.</p>',[{t:'Continue',f:finishStep}]))},
      {t:'Reject',g:1,f:()=>talk(REG,'<p>Good habit to pause. Here the message is safe: it only proves ownership. Never sign messages you do not understand, especially ones that mention transfers or permissions.</p>',[{t:'Back',f:()=>MISSIONS[5].steps[0].run()}])}
    ]);
  }},
  STEP_PRAISE,
  {label:'Mint your free Passport',spot:'j',npc:MINT,run(){
    confirmTx(MINT,{title:'Mint KitCity Passport',rows:[['Item','KitCity Passport'],['Price','Free'],['Network fee',FEE0]],btn:'Mint free Passport',
      after:()=>talk(MINT,'<h3>Permission request</h3><div class="msg"><small>BonusMint.xyz</small>Allow this site to spend an <b>unlimited</b> amount of your USDC to unlock extra rewards?</div><p>You already minted your Passport. Do you approve this extra request?</p>',[
        {t:'Approve',f:()=>{ settleAnswer(false); P.fell++; save(); talk(MINT,'<h3>Dangerous choice</h3><p>An unlimited approval lets that site take all your USDC at any time, even later. Only approve exact amounts, only for sites you trust, and revoke old permissions.</p>',[{t:'Continue',f:finishStep}]); }},
        {t:'Reject',g:1,f:()=>{ settleAnswer(true); P.dodged++; save(); talk(MINT,'<h3>Smart</h3><p>Minting was free and needed no spending permission. You earned 0.10 USDC for rejecting an unnecessary spending approval.</p>',[{t:'Continue',f:finishStep}]); }}
      ])});
  }}
 ]
},
{id:'m7',n:7,city:'ph',title:'Vote in the community',goal:'Learn how community votes work and how to read a proposal.',
 steps:[
  {label:'Meet the Chairlady',spot:'g',npc:CHAIR,run(){
    talk(CHAIR,'<p>Many communities now decide things together by vote. Members hold a pass, like your Passport, and each vote is a signed message.</p><ul class="pts"><li>Anyone can read the proposal before voting.</li><li>Voting is usually free because it is a signature, not a payment.</li><li>Ask who benefits and who can change the result.</li></ul>',[{t:'Take me to the town hall',f:finishStep}]);
  }},
  STEP_BIGSAM,
  {label:'Cast your vote',spot:'k',npc:HALL,run(){
    talk(HALL,'<h3>Proposal #12</h3><div class="msg"><small>Solar street lights for Mile 3 market</small>Spend 500 USDC from the community pot to install solar lights, installed by local electricians. Work is paid in two parts, after inspection.</div><p>Read it, then vote. Your Passport lets you vote once.</p>',[
      {t:'Vote Yes',f:()=>vote('Yes')},{t:'Vote No',g:1,f:()=>vote('No')},{t:'Abstain',g:1,f:()=>vote('Abstain')}
    ]);
    function vote(c){
      busy(HALL,'Signing your vote\u2026',1100,()=>{
        const t={Yes:142,No:38,Abstain:12}; t[c]++;
        talk(HALL,'<h3>Vote counted</h3><div class="kv"><span>Yes</span><b>'+t.Yes+'</b></div><div class="kv"><span>No</span><b>'+t.No+'</b></div><div class="kv"><span>Abstain</span><b>'+t.Abstain+'</b></div><p>You voted <b>'+c+'</b>. Signing was free, and your vote is public and permanent. Whatever you choose, read before you sign.</p>',[{t:'Continue',f:finishStep}]);
      });
    }
  }}
 ]
},
{id:'m8',n:8,city:'ph',title:'Cash out safely',goal:'Sell USDC for naira with a peer, and never release before you are paid.',
 steps:[
  {label:'Post your sell offer',spot:'l',npc:ADA,run(){
    talk(ADA,'<p>Peer-to-peer means you trade with another person. The platform holds your USDC in escrow while they pay your bank. You release only after you see the money.</p><div class="kv"><span>You sell</span><b>1.00 USDC</b></div><div class="kv"><span>Price</span><b>'+fmtN(1480)+'</b></div>',[
      {t:'Post my offer',f:()=>busy(ADA,'Finding a buyer\u2026',1400,()=>talk(ADA,'<h3>Buyer found</h3><p>Chidi accepted your offer. Your USDC is locked in escrow. He has 15 minutes to pay your bank account.</p>',[{t:'Continue',f:finishStep}]))}
    ]);
  }},
  STEP_LUNAX,
  {label:'Check your bank before you release',spot:'c',npc:TOLA,run(){
    needFunds(1);
    function bank(){
      talk(TOLA,'<h3>Your bank app</h3><div class="msg"><small>Credit alert</small>'+fmtN(1480)+' received from CHIDI OKAFOR. Balance updated.</div><p>The money is in your own account and the sender name matches your buyer. Now it is safe to release.</p>',[
        {t:'Release 1 USDC',f:()=>busy(TOLA,'Releasing from escrow\u2026',1300,()=>{
          P.usdc=Math.max(0,P.usdc-1); save(); updateHUD();
          talk(TOLA,'<h3>Trade complete</h3><div class="kv"><span>Sold</span><b>1.00 USDC</b></div><div class="kv"><span>Received</span><b>'+fmtN(1480)+'</b></div><p>You cashed out safely. Rule one: your own bank app is the only proof of payment.</p>',[{t:'Continue',f:finishStep}]);
        })}
      ]);
    }
    talk(TOLA,'<div class="msg"><small>Chidi says</small>I have paid! See my receipt. Please release the USDC now, I am in a hurry.</div><div class="msg"><small>Receipt screenshot</small>Transfer successful. '+fmtN(1480)+' sent.</div><p>What do you do?</p>',[
      {t:'Release the USDC now',f:()=>{ settleAnswer(false); talk(TOLA,'<h3>Stop, this is a trap</h3><p>Fake receipts are the most common cash-out scam. A screenshot proves nothing. If you release first, the buyer keeps your USDC and your bank shows no money.</p>',[{t:'Check my bank app',f:bank}]); }},
      {t:'Check my own bank app first',g:1,f:()=>{ settleAnswer(true); bank(); }}
    ]);
  }}
 ]
},
/* ---- Ibadan ---- */
{id:'m9',n:9,city:'ibadan',title:'Receive your first payment',goal:'Give the right address, match the network, and send a real payment on it.',
 steps:[
  taskStep({label:'Give Christol your receiving address',spot:'a',npc:mkSign('Christol','Startup founder','#6a3fb5',LK.woman,'Client'),mono:1,
    intro:'Christol is ready to send 50 USDC for your logo. She needs something to send it to.',q:'What do you give her?',
    opts:[['Your public wallet address',1],['Your 12-word recovery phrase',0],['Both, so she can check the wallet',0]],
    wrong:'Never share the recovery phrase. It opens your wallet. Only the public address goes to someone who wants to pay you.',
    say:'She copies your address and sends the 50 USDC. It is an account number, and it is safe to share.'}),
  taskStep({label:'Set the network with Christol',spot:'c',npc:mkSign('Christol','Startup founder','#6a3fb5',LK.woman,'Client'),
    intro:'Her app asks which network to send on. Your wallet is set up on Base.',q:'Which network do you tell her?',
    opts:[['Base',1],['Ethereum',0],['Solana',0]],
    wrong:'Your USDC is on Base. Money sent on another network does not reach your wallet, and it can be lost.',
    say:'Christol confirms Base in her app. Good. The network must match on both sides.'}),
  taskStep({label:'Pay your design tool on Base',spot:'k',npc:mkSign('Reina','Design tools','#2D6FB3',LK.clerk,'Subscriptions'),
    intro:'Your design tool takes USDC. Choose where to pay from.',q:'Which network do you pay on?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'Your USDC balance is on Base. Paying from Ethereum would fail, because you hold nothing there.',
    tx:{title:'Design tool',amt:1,btn:'Pay 1 USDC',done:'Payment sent',note:'A small network fee is paid to the network, separately from the price.',
        rows:x=>[['Pay to','Tool Desk',0],['Amount','1.00 USDC'],['Network',x],['Network fee','Small, paid to the network']]},
    say:'Your payment is on the public network. Anyone can look it up with its transaction ID.'})
 ]},
{id:'m10',n:10,city:'ibadan',title:'Prove a bounty deliverable',goal:'Submit a verifiable work reference, match it to the bounty requirements, and confirm the payout record.',
 steps:[
  taskStep({label:'Read the bounty requirements',spot:'e',npc:mkSign('Tolu','Bounty reviewer','#2D6FB3',LK.man,'Bounty board'),
    intro:'A community bounty asks for a translation with a specific format and deadline.',q:'What should you do before accepting?',
    opts:[['Read the deliverable, deadline and acceptance rules',1],['Start work from the title alone',0]],
    wrong:'A title is not a full brief. Read what counts as acceptable work and when it is due.',say:'You know what must be delivered and how it will be reviewed.'}),
  taskStep({label:'Submit a verifiable work reference',spot:'g',npc:mkSign('Tolu','Bounty reviewer','#2D6FB3',LK.man,'Bounty board'),
    intro:'The work is finished. The reviewer needs to identify the exact version you submitted.',q:'What is the strongest evidence?',
    opts:[['A stable link or content hash for the submitted version',1],['A message saying the work is finished',0]],
    wrong:'A stable reference lets the reviewer inspect the exact deliverable.',say:'Your submission can be checked against the agreed requirements.'}),
  taskStep({label:'Confirm the bounty payout record',spot:'h',npc:mkSign('Tolu','Bounty reviewer','#2D6FB3',LK.man,'Bounty board'),
    intro:'The reviewer marks the bounty accepted and records a payment.',q:'What should you check before closing the task?',
    opts:[['The recorded amount, recipient and transaction status',1],['Only the congratulatory message',0]],
    wrong:'A message is not proof of payment. Verify the recorded amount and status.',say:'You verified the bounty payout rather than relying on a notification.'})
 ]},
{id:'m11',n:11,city:'kaduna',title:'Get paid in a stablecoin',goal:'Choose the stable pay option, sell USDC on the right network, and keep savings safe.',
 steps:[
  taskStep({label:'Choose your pay with Larai',spot:'c',npc:mkSign('Larai','Remote employer','#2D6FB3',LK.man,'Remote job'),
    intro:'Larai offers pay in USDC, or in a token that jumps around in price all week.',q:'Which do you take for a monthly salary?',
    opts:[['USDC',1],['The volatile token, it might double',0]],
    wrong:'Your rent does not move with a token’s chart. USDC is designed to stay close to one US dollar.',
    say:'Salary set in USDC, paid on the 1st. Your balance is stable.'}),
  taskStep({label:'Sell 2 USDC to the exchange',spot:'g',npc:mkSign('Unique','Licensed exchange','#1f4f82',LK.clerk,'Off-ramp'),
    intro:'The exchange gives a deposit address. The address shows which network it uses: Base.',q:'Which network do you send on?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'Send on the network the exchange lists. Funds on the wrong network can be lost.',
    tx:{title:'Deposit to exchange',amt:2,btn:'Send 2 USDC',done:'Deposit sent',note:'Naira is credited after the exchange sees the deposit.',
        rows:x=>[['To','Ola Exchange deposit',0],['Amount','2.00 USDC'],['Network',x]]},
    say:'The exchange credits your naira once the deposit is confirmed.'}),
  taskStep({label:'Move 1 USDC to savings',spot:'k',npc:mkSign('Cclya','Savings app','#0B7A43',LK.clerk,'Savings'),
    intro:'Your savings wallet is your own address. Choose where the 1 USDC goes.',q:'Which address do you send to?',
    opts:[['My own savings address',1],['An address a stranger sent you on social media',0]],
    wrong:'Never move savings to an address that someone messaged you. Only send to a wallet you control.',
    tx:{title:'Savings transfer',amt:1,btn:'Send 1 USDC',done:'Moved',note:'Between your own wallets, you still control the funds.',
        rows:x=>[['To','My savings address',0],['Amount','1.00 USDC'],['Network','Base']]},
    say:'Your savings are kept in USDC, in a wallet only you hold.'})
 ]},
{id:'m12',n:12,city:'kaduna',title:'Check a token before buying',goal:'Verify a token’s official contract, network and market details before deciding whether to buy.',
 steps:[
  taskStep({label:'Find the official token contract',spot:'d',npc:mkSign('Sadiq','Market analyst','#C7457E',LK.man,'Token desk'),
    intro:'A new token is trending in the group chat. Before buying, compare the contract address with the project’s official website.',q:'Which source should you trust first?',
    opts:[['The contract linked from the project’s verified official site',1],['A contract address sent by an unknown account',0]],
    wrong:'A copied name or logo proves nothing. Start from the project’s official channel and verify the contract address.',
    say:'You found the contract from the project’s own source, not a stranger’s message.'}),
  taskStep({label:'Match the network and token address',spot:'e',npc:mkSign('Sadiq','Market analyst','#C7457E',LK.man,'Token desk'),
    intro:'Two tokens can share a name while living at different contract addresses or networks.',q:'What must match before you trade?',
    opts:[['The full contract address and the intended network',1],['Only the token name and logo',0]],
    wrong:'Names and logos are easy to copy. Check the complete address and the network.',
    say:'The token identity and network match the details published by the project.'}),
  taskStep({label:'Check liquidity before deciding',spot:'h',npc:mkSign('Sadiq','Market analyst','#C7457E',LK.man,'Token desk'),
    intro:'A token can show a price but have too little liquidity for you to sell later.',q:'What is the safest next step?',
    opts:[['Check liquidity, trading activity and sell conditions before buying',1],['Buy immediately because the price is rising',0]],
    wrong:'A displayed price does not guarantee you can sell. Review liquidity and the trading conditions first.',
    say:'You checked whether the market can support an exit before risking funds.'})
 ]},
{id:'m13',n:13,city:'enugu',title:'Pay the supplier on-chain',goal:'Pay a supplier on the right network, then prove the payment with its transaction ID.',
 steps:[
  taskStep({label:'Choose the route with Joe_Sef',spot:'c',npc:mkSign('Joe_Sef','Trader sourcing abroad','#2D6FB3',LK.man,'Import'),
    intro:'Your supplier abroad accepts USDC. A bank wire takes days. A USDC transfer settles on a public network in minutes.',q:'Which route do you use?',
    opts:[['USDC on Base',1],['Hold the order until the bank wire clears',0]],
    wrong:'Waiting for a bank wire ties up your cash for days. The public network settles in minutes.',
    say:'Route set. Your supplier gets the payment on the network they listed.'}),
  taskStep({label:'Pay the supplier 4 USDC',spot:'e',npc:mkSign('Joe_Sef','Trader sourcing abroad','#2D6FB3',LK.man,'Import'),
    intro:'Enter the supplier’s address, and check the network before you confirm.',q:'Which network is the supplier on?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The supplier listed Base. A payment on another network does not reach them.',
    tx:{title:'Supplier payment',amt:4,btn:'Pay 4 USDC',done:'Payment sent',note:'Payments on a public network cannot be reversed.',
        rows:x=>[['To','Supplier address',1],['Amount','4.00 USDC'],['Network',x]]},
    say:'Your payment now has a transaction ID. That ID is your proof.'}),
  taskStep({label:'Prove the payment to the supplier',spot:'g',npc:mkSign('Blockqueen','Bookkeeper','#0B7A43',LK.man,'Records'),
    intro:'The supplier says the money did not arrive. You have the transaction ID.',q:'What do you do?',
    opts:[['Paste the transaction ID into the block explorer for Base',1],['Send the payment again to be safe',0]],
    wrong:'Sending again can pay the supplier twice. Check the transaction you already sent.',
    say:'The explorer shows the amount, the recipient and the status. The supplier confirms it.'})
 ]},
{id:'m14',n:14,city:'enugu',title:'Mint your access pass',goal:'Set the tip address with its network, then mint an access pass that proves a fan’s access.',
 steps:[
  taskStep({label:'Set your tip address with Chiamaka',spot:'i',npc:mkSign('Chiamaka','Music producer','#E4572E',LK.woman,'Creator'),
    intro:'Fans will tip you directly. The tip page must show the address and the network.',q:'What do you put on the page?',
    opts:[['Address and network: Base',1],['Address only',0]],
    wrong:'Without the network name, a fan can send on the wrong chain and the tip never reaches you.',
    say:'The tip page is live, with the network shown next to the address.'}),
  taskStep({label:'Mint the access pass',spot:'j',npc:mkSign('Duke David','Access pass','#2D6FB3',LK.clerk,'Pass'),
    intro:'Minting writes a new token into your wallet. It becomes the pass for your sample pack.',q:'Which network do you mint on?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'Mint on Base, where your wallet and buyers already are.',
    tx:{title:'Mint access pass',amt:1,btn:'Mint for 1 USDC',done:'Pass minted',note:'Minting costs a network fee on top of the price.',
        rows:x=>[['Item','Sample pack access pass'],['Price','1.00 USDC'],['Network',x],['Network fee','Paid to the network']]},
    say:'Your pass is minted. Anyone holding it can check their access on the public record.'}),
  taskStep({label:'Check a fan’s pass',spot:'k',npc:mkSign('Dark','Fan','#6a3fb5',LK.man,'Fan'),
    intro:'A fan shows a screenshot that says they own the pass.',q:'How do you check?',
    opts:[['Look up their address on the block explorer for the pass’s contract',1],['Trust the screenshot',0]],
    wrong:'Screenshots can be edited. The pass is only real if the public record shows it in their wallet.',
    say:'The record shows the pass in their wallet. They get their sample pack.'})
 ]},
{id:'m15',n:15,city:'benin',title:'Mint a provenance certificate',goal:'Check the issuer, mint the certificate, and show the buyer the contract.',
 steps:[
  taskStep({label:'Check the issuer with LunaX',spot:'b',npc:mkSign('LunaX','Bronze craftsman','#8E2F1B',LK.man,'Craft shop'),
    intro:'Before you mint, the certificate must come from LunaX’s registered address.',q:'What do you check?',
    opts:[['The issuing address matches the one registered for LunaX',1],['The name on the certificate looks right',0]],
    wrong:'A name is easy to copy. Only the registered address proves who issued the certificate.',
    say:'The issuer matches. You can mint the certificate.'}),
  taskStep({label:'Mint the certificate',spot:'d',npc:mkSign('LunaX','Bronze craftsman','#8E2F1B',LK.man,'Craft shop'),
    intro:'Minting writes the certificate to the public record. It cannot be quietly edited afterwards.',q:'Which network do you mint on?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'Your collection and buyers are on Base. Mint there.',
    tx:{title:'Mint certificate',amt:1,btn:'Mint for 1 USDC',done:'Certificate minted',note:'The certificate is written to the record.',
        rows:x=>[['Item','Bronze certificate'],['Price','1.00 USDC'],['Network',x]]},
    say:'Your certificate is on the public record, linked to the piece.'}),
  taskStep({label:'Show Ngozi the contract',spot:'e',npc:mkSign('Web3_Esta','Overseas buyer','#6a3fb5',LK.woman,'Buyer'),
    intro:'Ngozi wants to check the certificate herself before buying.',q:'What do you send her?',
    opts:[['The contract address, so she can check the history on a block explorer',1],['A screenshot of the certificate',0]],
    wrong:'Screenshots can be faked. The contract address lets her check the record herself.',
    say:'Ngozi checks the history on the explorer and buys with confidence.'})
 ]},
{id:'m16',n:16,city:'benin',title:'Sell a token, keep the net',goal:'Read the token terms, work out the net after the network fee, and transfer the token.',
 steps:[
  taskStep({label:'Read the terms with the curator',spot:'g',npc:mkSign('Ekhoi Nwafor','Gallery curator','#8E2F1B',LK.man,'Gallery'),
    intro:'Your token links to a bronze carving. The terms say what the token gives you.',q:'What do you check first?',
    opts:[['The rights section of the terms',1],['Assume copyright comes with the token',0]],
    wrong:'A token is a record. Copyright and rights come from the terms, not from holding the token.',
    say:'The terms are clear. You know exactly what the token gives you.'}),
  taskStep({label:'Set your sale with the curator',spot:'h',npc:mkSign('Ekhoi Nwafor','Gallery curator','#8E2F1B',LK.man,'Gallery'),
    intro:'You will transfer the token to a buyer. Every transfer costs a network fee.',q:'What price do you list?',
    opts:[['The price after the network fee, so you know what you keep',1],['The sticker price, the fee is small',0]],
    wrong:'The fee is paid on every transfer. List at the price you actually keep.',
    say:'You list the sale at the net price.'}),
  taskStep({label:'Transfer the token to the buyer',spot:'k',npc:mkSign('Ekhoi Nwafor','Gallery curator','#8E2F1B',LK.man,'Gallery'),
    intro:'Confirm the transfer. The network fee is paid to the network.',q:'Which network do you send on?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The token lives on Base. Transfer it there.',
    tx:{title:'Transfer token',amt:1,btn:'Transfer for 1 USDC',done:'Transferred',note:'Network fee applies on top of the price.',
        rows:x=>[['Item','Bronze certificate token'],['Price','1.00 USDC'],['Network',x],['Network fee','Paid to the network']]},
    say:'The token is now in the buyer’s wallet. The record is public.'})
 ]},
{id:'m17',n:17,city:'calabar',title:'Confirm before you serve',goal:'Serve only after the payment shows in your wallet, and help a customer on the wrong network.',
 steps:[
  taskStep({label:'Take a payment with Moon',spot:'a',npc:mkSign('Moon','Carnival food seller','#0B7A43',LK.mama,'Stall'),
    intro:'A customer says they have paid in USDC. They show you a screen.',q:'When do you hand over the food?',
    opts:[['When it shows in my own wallet',1],['As soon as they show the screen',0]],
    wrong:'A screen is not a payment. Only your wallet, or the public record, shows what you received.',
    say:'The payment is in your wallet. Food goes over.'}),
  taskStep({label:'Buy stock with 1 USDC',spot:'c',npc:mkSign('Praise','Wholesaler','#2D6FB3',LK.man,'Wholesale'),
    intro:'Restock for the afternoon crowd. Choose the network your supplier accepts.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'Your supplier takes USDC on Base. Pay there.',
    tx:{title:'Stock',amt:1,btn:'Pay 1 USDC',done:'Stock bought',note:'Payments on the network cannot be reversed.',
        rows:x=>[['To','Wholesale Ekpo',1],['Amount','1.00 USDC'],['Network',x]]},
    say:'Your restock is paid. Keep the transaction ID with your stock notes.'}),
  taskStep({label:'A tourist sent from the wrong network',spot:'f',npc:mkSign('Kenny','Visitor','#6a3fb5',LK.guy,'Visitor'),
    intro:'Kofi sent USDC, but his wallet shows it on a different network from yours.',q:'What do you do?',
    opts:[['Look up his transaction ID on the network he used',1],['Ask him to send it again on yours',0]],
    wrong:'Sending again can double his loss. Find where the first transfer actually went.',
    say:'The explorer shows where it went. You help him move it to the right network.'})
 ]},
{id:'m18',n:18,city:'calabar',title:'Print your own QR',goal:'Print a QR code that points to your own address, and wait for the payment to show in your wallet.',
 steps:[
  taskStep({label:'Set the restaurant QR with Mama Ifiok',spot:'i',npc:mkSign('Mama Ifiok','Restaurant owner','#E4572E',LK.mama,'Restaurant'),
    intro:'A QR code holds a wallet address. Customers scan it and send to that address.',q:'Whose address goes in the code?',
    opts:[['Our restaurant’s own address',1],['An address a friend shared with you',0]],
    wrong:'Only print an address you control. Money sent to someone else’s address is gone.',
    say:'The code points to your address. You check it against your wallet before printing.'}),
  taskStep({label:'Pay for the QR setup',spot:'j',npc:mkSign('Love','QR setup','#2D6FB3',LK.clerk,'Setup'),
    intro:'Setup takes a small payment. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'Your restaurant wallet is on Base.',
    tx:{title:'QR setup',amt:1,btn:'Pay 1 USDC',done:'QR live',note:'Network fee applies.',
        rows:x=>[['Item','QR setup'],['Amount','1.00 USDC'],['Network',x]]},
    say:'The QR is ready. Print it on the menu card.'}),
  taskStep({label:'A customer shows a payment screen',spot:'k',npc:mkSign('Essa','Restaurant customer','#6a3fb5',LK.man,'Customer'),
    intro:'They show a screen that says they paid. Your wallet shows nothing yet.',q:'What do you do?',
    opts:[['Wait for it in my wallet, and check the transaction ID',1],['Serve them now, they showed a screen',0]],
    wrong:'Wait. A payment is real when it lands in your wallet.',
    say:'The payment lands in your wallet. You serve the food.'})
 ]},
{id:'m19',n:19,city:'jos',title:'Sign in without spending',goal:'Sign a login message safely, and share only the credential that is needed.',
 steps:[
  taskStep({label:'Sign in to the identity app',spot:'a',npc:mkSign('Caleb','Identity guide','#2D6FB3',LK.woman,'Identity'),
    intro:'The app asks you to sign a message to log in. Your wallet shows the request.',q:'Which request do you approve?',
    opts:[['Sign the login message',1],['Approve unlimited spending for this app',0]],
    wrong:'Unlimited spending lets the app take all your USDC at any time. A login needs only a signature.',
    say:'You are logged in. The signature moved no money.'}),
  taskStep({label:'Share your course credential',spot:'c',npc:mkSign('Caleb','Identity guide','#2D6FB3',LK.woman,'Identity'),
    intro:'The employer wants proof that you finished the course. Nothing else.',q:'What do you share?',
    opts:[['Only the course credential',1],['My full profile and all my records',0]],
    wrong:'Share only what is needed. Your full profile stays with you.',
    say:'The employer sees the course credential, and nothing else.'}),
  taskStep({label:'Issue your credential',spot:'h',npc:mkSign('Caleb','Identity guide','#2D6FB3',LK.woman,'Identity'),
    intro:'Issuing the credential writes it to your wallet.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'Your wallet is on Base.',
    tx:{title:'Issue credential',amt:1,btn:'Pay 1 USDC',done:'Credential issued',note:'Network fee applies.',
        rows:x=>[['Item','Course credential'],['Amount','1.00 USDC'],['Network',x]]},
    say:'It sits in your wallet. You decide who gets to see it.'})
 ]},
{id:'m20',n:20,city:'jos',title:'Get paid for a writing role',goal:'Send your public address and network, agree the paid trial, and confirm the first payment on the explorer.',
 steps:[
  taskStep({label:'Send your details to Chinwe',spot:'e',npc:mkSign('Chinwe Recruit','Recruiter','#1f4f82',LK.woman,'Recruiting'),
    intro:'They pay in USDC and ask for where to send it.',q:'What do you send?',
    opts:[['My public address and the network: Base',1],['My recovery phrase, so you can check my wallet',0]],
    wrong:'Never send your recovery phrase. The public address and network are all they need.',
    say:'They save your address and network for the first payment.'}),
  taskStep({label:'Accept the paid trial',spot:'f',npc:mkSign('Chisom Nwafor','Hiring manager','#0B7A43',LK.man,'Hiring'),
    intro:'They offer a paid trial article before the role is confirmed.',q:'What do you accept?',
    opts:[['A paid trial, with amount and date written down',1],['An unpaid trial that they keep',0]],
    wrong:'Unpaid trials that they keep are work for free. Insist on paid, written terms.',
    say:'The trial terms are written. You start on the article.'}),
  taskStep({label:'Check your first payment',spot:'g',npc:mkSign('Chisom Nwafor','Hiring manager','#0B7A43',LK.man,'Hiring'),
    intro:'The first payment is sent. You want to confirm it arrived.',q:'How do you check?',
    opts:[['Paste the transaction ID into the block explorer for Base',1],['Trust the message that says it is paid',0]],
    wrong:'Messages are not proof. The block explorer shows the payment on the public record.',
    say:'The payment is on the record, with the amount and your address.'})
 ]},
{id:'m21',n:21,city:'maiduguri',title:'Lock the deposit in escrow',goal:'Lock a guest deposit in escrow, approve only the exact amount, and release it at check-in.',
 steps:[
  taskStep({label:'Set up the deposit with Craftore',spot:'a',npc:mkSign('Craftore','Guesthouse owner','#7a4a2e',LK.elder,'Guesthouse'),
    intro:'The guest pays a deposit. It must not go straight to a personal wallet.',q:'Where does the deposit go?',
    opts:[['Into the escrow contract, released at check-in',1],['Straight to my personal wallet',0]],
    wrong:'Straight to a personal wallet means the guest has no protection. Use escrow.',
    say:'The deposit is set to escrow.'}),
  taskStep({label:'Approve the escrow amount',spot:'c',npc:mkSign('John Jonathan','Escrow service','#2D6FB3',LK.clerk,'Escrow'),
    intro:'Your wallet asks to let the escrow contract spend USDC. Set the limit.',q:'What do you approve?',
    opts:[['Exactly 2 USDC, the deposit',1],['Unlimited USDC',0]],
    wrong:'Unlimited approval lets the contract take all your USDC at any time. Approve only the deposit.',
    say:'The contract can take only the 2 USDC deposit.'}),
  taskStep({label:'Lock the deposit',spot:'e',npc:mkSign('John Jonathan','Escrow service','#2D6FB3',LK.clerk,'Escrow'),
    intro:'The guest’s 2 USDC goes into the contract on Base.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The contract lives on Base. Lock it there.',
    tx:{title:'Lock escrow deposit',amt:2,btn:'Lock 2 USDC',done:'Deposit locked',note:'Released only when the agreed condition is met.',
        rows:x=>[['To','Escrow contract',1],['Amount','2.00 USDC'],['Network',x]]},
    say:'The deposit now sits in the contract, visible on the public record.'})
 ]},
{id:'m22',n:22,city:'maiduguri',title:'Record your milestone',goal:'Record a milestone that links to finished public work, pay for the course, and check the receipt.',
 steps:[
  taskStep({label:'Record your milestone with Musa',spot:'g',npc:mkSign('Musa Abubakar','Skills coach','#0B7A43',LK.man,'Skills'),
    intro:'You can record a milestone on the network, with a date.',q:'What does the record link to?',
    opts:[['My finished, public writing sample',1],['My private notes',0]],
    wrong:'A record that points to private notes proves nothing anyone can check.',
    tx:{title:'Record milestone',amt:0.5,btn:'Record for 0.5 USDC',done:'Milestone recorded',note:'Network fee applies.',
        rows:x=>[['Item','Milestone record'],['Amount','0.50 USDC'],['Links to',x]]},
    say:'The milestone is on the public record with its date.'}),
  taskStep({label:'Pay for the course',spot:'h',npc:mkSign('Musa Abubakar','Skills coach','#0B7A43',LK.man,'Skills'),
    intro:'The course takes USDC. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'Your USDC is on Base.',
    tx:{title:'Course payment',amt:1,btn:'Pay 1 USDC',done:'Enrolled',note:'Keep the receipt and the refund policy.',
        rows:x=>[['Item','Writing course'],['Amount','1.00 USDC'],['Network',x]]},
    say:'You are enrolled. Your payment has a transaction ID.'}),
  taskStep({label:'Check your receipt',spot:'i',npc:mkSign('Musa Abubakar','Skills coach','#0B7A43',LK.man,'Skills'),
    intro:'You want proof that the course payment went through.',q:'What do you keep?',
    opts:[['The transaction ID, checked on the block explorer',1],['A screenshot of the app',0]],
    wrong:'Screenshots can be faked. The transaction ID on the explorer is the proof.',
    say:'Your receipt is on the public record.'})
 ]},

/* ---- Onitsha ---- */
{id:'m23',n:23,city:'anambra',title:'Price your shop in USDC',goal:'Put a USDC price on your shelf card, restock on Base, and accept a payment only once it lands in your wallet.',
 steps:[
  taskStep({label:'Set the shelf price with Obi',spot:'a',npc:mkSign('Toza','Phone and gadget shop','#0B7A43',LK.man,'Shop prices'),
    intro:'Overseas customers want to pay in USDC. Your shelf card only shows naira.',q:'What goes on the card?',
    opts:[['Naira and USDC prices, with the rate and the date it was set',1],['Naira only',0]],
    wrong:'Customers paying from abroad cannot read a naira-only card. Add the USDC price and the date.',
    say:'The card now shows both prices. Customers can see exactly what to pay.'}),
  taskStep({label:'Restock with Chibuike',spot:'c',npc:mkSign('Duke David','Wholesale supplier','#2D6FB3',LK.man,'Wholesale'),
    intro:'Your supplier takes USDC. Pick the network before you pay.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'Your supplier’s account is on Base. Paying on Ethereum would not reach them.',
    tx:{title:'Restock',amt:3,btn:'Pay 3 USDC',done:'Restocked',note:'Payments on the network cannot be reversed.',
        rows:x=>[['To','Wholesale Chibuike',1],['Amount','3.00 USDC'],['Network',x]]},
    say:'Your restock is paid. The supplier confirms the order on the network.'}),
  taskStep({label:'Take a payment from Ifeoma',spot:'g',npc:mkSign('Kore','Regular customer','#E4572E',LK.woman,'Customer'),
    intro:'Ifeoma shows a screen that says she has paid in USDC.',q:'When do you hand over the goods?',
    opts:[['When the payment lands in my wallet',1],['As soon as she shows the screen',0]],
    wrong:'A screen is not a payment. Only your wallet shows what you received.',
    say:'The payment is in your wallet. Goods handed over.'})
 ]},
{id:'m24',n:24,city:'anambra',title:'Pay your association dues',goal:'Check the dues address on the published notice, then pay dues on the right network.',
 steps:[
  taskStep({label:'Check the dues address with Chief Emeka',spot:'e',npc:mkSign('Chief Emeka','Association chairman','#7a4a2e',LK.elder,'Association'),
    intro:'Someone in the group chat posts a new dues address. The association also publishes one.',q:'Which address do you use?',
    opts:[['The one on the association’s published notice',1],['The one posted in the group chat',0]],
    wrong:'Addresses in chats can be swapped. Use the published notice.',
    say:'You have the correct address. Dues go to the association.'}),
  taskStep({label:'Pay your 1 USDC dues',spot:'h',npc:mkSign('Chief Emeka','Association chairman','#7a4a2e',LK.elder,'Association'),
    intro:'Dues are paid in USDC. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The association accepts USDC on Base.',
    tx:{title:'Membership dues',amt:1,btn:'Pay 1 USDC',done:'Dues paid',note:'Your payment appears on the association’s public record.',
        rows:x=>[['To','Association dues address',1],['Amount','1.00 USDC'],['Network',x]]},
    say:'Your payment is on the public record, with the date and purpose.'}),
  taskStep({label:'Find your payment on the record',spot:'k',npc:mkSign('Secretary Ada','Association secretary','#1f4f82',LK.woman,'Secretary'),
    intro:'You want to see your payment in the association’s records.',q:'What do you do?',
    opts:[['Search the public ledger for my address',1],['Ask the secretary to confirm by message',0]],
    wrong:'Messages are not records. The public ledger shows your payment directly.',
    say:'Your payment is listed with the date and amount.'})
 ]},
{id:'m25',n:25,city:'owerri',title:'Batch the palm oil',goal:'Record each batch with its farm and producer, publish it on Base, and quote a price that the record supports.',
 steps:[
  taskStep({label:'Label the batch with Dark',spot:'b',npc:mkSign('Dark','Palm oil producer','#F6B21A',LK.woman,'Palm oil'),
    intro:'Buyers abroad ask where each batch came from.',q:'What do you record?',
    opts:[['Farm, date and producer name for the batch',1],['A photo label only',0]],
    wrong:'A photo does not say where the oil came from. Record the farm, date and producer.',
    say:'The batch record is ready to publish.'}),
  taskStep({label:'Publish the batch record',spot:'d',npc:mkSign('White Coach','Batch certification','#2D6FB3',LK.clerk,'Certification'),
    intro:'Publishing writes the batch record to the public network. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'Batch records are published on Base.',
    tx:{title:'Publish batch',amt:2,btn:'Publish for 2 USDC',done:'Batch published',note:'Network fee applies.',
        rows:x=>[['Item','Palm oil batch record'],['Amount','2.00 USDC'],['Network',x]]},
    say:'The record is public. Buyers can scan the link and see the batch history.'}),
  taskStep({label:'Quote the batch to Lara',spot:'f',npc:mkSign('Debs','Buyer abroad','#6a3fb5',LK.woman,'Buyer'),
    intro:'Lara wants 20 batches. She asks for your price.',q:'What do you quote?',
    opts:[['A premium, with the batch record link attached',1],['The lowest price, to win the order',0]],
    wrong:'Traceable batches are worth more. Quote the premium and send the record.',
    say:'Lara checks the link and agrees the premium.'})
 ]},
{id:'m26',n:26,city:'owerri',title:'Take a paid seat',goal:'Set your workshop fee with a refund rule, book the hall on Base, and confirm each student’s payment before the seat is given.',
 steps:[
  taskStep({label:'Set the fee with Prof. Nnamdi',spot:'g',npc:mkSign('Prof. Nnamdi','Community educator','#0B7A43',LK.man,'Workshop'),
    intro:'Your workshop is three hours for twenty people.',q:'How do you set the fee?',
    opts:[['A fair fee in USDC and naira, refunded if cancelled',1],['A fee nobody can afford',0]],
    wrong:'A fee nobody can afford fills no seats. Set a fair fee with a refund rule.',
    say:'Your listing shows the fee and the refund rule.'}),
  taskStep({label:'Book the hall',spot:'j',npc:mkSign('K','Community hall','#2D6FB3',LK.clerk,'Venue'),
    intro:'Pay the hall in USDC. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The venue takes USDC on Base.',
    tx:{title:'Hall booking',amt:1,btn:'Pay 1 USDC',done:'Hall booked',note:'Keep the receipt.',
        rows:x=>[['To','Community hall',1],['Amount','1.00 USDC'],['Network',x]]},
    say:'The hall is booked for your workshop.'}),
  taskStep({label:'Accept your first student',spot:'k',npc:mkSign('Oromachi','Workshop student','#E4572E',LK.woman,'Student'),
    intro:'Ngozi wants a seat. She says she has paid and asks for her seat now.',q:'What do you do?',
    opts:[['Check the payment in my wallet, then give the seat',1],['Give the seat now and check later',0]],
    wrong:'Check first. A seat given before payment is a seat you may not get paid for.',
    say:'The payment arrives. Ngozi has her seat.'})
 ]},
{id:'m27',n:27,city:'ilorin',title:'Set a realistic savings target',goal:'Choose a measurable savings goal, set a practical timeline, and plan contributions without relying on guaranteed returns.',
 steps:[
  taskStep({label:'Define the savings target',spot:'d',npc:mkSign('Leemah','Savings coach','#0B7A43',LK.elder,'Savings plan'),
    intro:'You want to save for a future expense, but the target is still vague.',q:'How do you make the goal useful?',
    opts:[['Choose a specific amount and what the money is for',1],['Save whatever is left without a target',0]],
    wrong:'A clear amount and purpose make progress measurable.',say:'Your goal now has a defined amount and purpose.'}),
  taskStep({label:'Set a realistic deadline',spot:'e',npc:mkSign('Leemah','Savings coach','#0B7A43',LK.elder,'Savings plan'),
    intro:'You know the target amount and the date you need it.',q:'What should you check before committing?',
    opts:[['Whether the amount and timeline fit your expected income and costs',1],['Assume your income will always rise',0]],
    wrong:'A plan should fit realistic cash flow, not assumed future gains.',say:'The deadline is based on a realistic budget.'}),
  taskStep({label:'Plan contributions without guaranteed returns',spot:'h',npc:mkSign('Leemah','Savings coach','#0B7A43',LK.elder,'Savings plan'),
    intro:'You need to work out how much to set aside each week.',q:'Which plan is safest?',
    opts:[['Set a contribution you can afford and do not assume investment returns are guaranteed',1],['Count on a token price doubling before the deadline',0]],
    wrong:'Price gains are uncertain. Build the plan around contributions you can actually make.',say:'Your savings target has a contribution plan that does not depend on promised gains.'})
 ]},
{id:'m28',n:28,city:'ilorin',title:'Fund one milestone at a time',goal:'Back a project in milestones, and check each report before the next payment.',
 steps:[
  taskStep({label:'Agree the funding with Hajia Rahmat',spot:'f',npc:mkSign('Hajia Rahmat','Project founder','#C7457E',LK.woman,'Project'),
    intro:'The reading room needs funds for furniture, books and the roof.',q:'How is the money released?',
    opts:[['In milestones, each paid when its report is posted',1],['All at once, before any work starts',0]],
    wrong:'All at once means nothing holds the project to its plan. Fund by milestone.',
    say:'Each milestone has its own payment and its own report.'}),
  taskStep({label:'Back milestone one',spot:'h',npc:mkSign('Hajia Rahmat','Project founder','#C7457E',LK.woman,'Project'),
    intro:'Your 1 USDC backs the furniture milestone. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The project’s account is on Base.',
    tx:{title:'Back milestone one',amt:1,btn:'Back 1 USDC',done:'Backed',note:'You will see the report when it is posted.',
        rows:x=>[['To','Reading room milestone',1],['Amount','1.00 USDC'],['Network',x]]},
    say:'Your support is tied to milestone one.'}),
  taskStep({label:'Check the milestone report',spot:'i',npc:mkSign('Hajia Rahmat','Project founder','#C7457E',LK.woman,'Project'),
    intro:'The report lists the furniture bought, with receipts.',q:'What do you do?',
    opts:[['Check the receipts match the milestone, then approve the next one',1],['Approve the next payment without looking',0]],
    wrong:'Look at the receipts first. Milestone payments depend on the work being done.',
    say:'The receipts match. The next milestone is released.'})
 ]},
{id:'m29',n:29,city:'sokoto',title:'License your pattern',goal:'Write the licence terms, confirm the deposit is held, and set a royalty on each sale.',
 steps:[
  taskStep({label:'Set the licence with Love',spot:'a',npc:mkSign('Love','Textile designer','#2D6FB3',LK.woman,'Designs'),
    intro:'An overseas studio wants to use your dye patterns on fabric.',q:'What goes in the licence?',
    opts:[['Usage rights, territory, fee and your credit',1],['A handshake and a thank-you',0]],
    wrong:'A handshake protects nobody. Write the rights, the fee and your credit.',
    say:'The licence is written. Both sides sign it.'}),
  taskStep({label:'Receive the licence deposit',spot:'c',npc:mkSign('Essa','Design studio','#6a3fb5',LK.man,'Studio'),
    intro:'The studio sends a 2 USDC deposit. Where does it sit until the licence is signed?',q:'Where does the deposit go?',
    opts:[['Into an escrow contract, released when the licence is signed',1],['Straight to my personal wallet',0]],
    wrong:'Escrow holds the deposit until both sides sign. Do not accept it straight to a personal wallet.',
    say:'The deposit is held in escrow until the licence is signed.'}),
  taskStep({label:'Set the royalty',spot:'e',npc:mkSign('Essa','Design studio','#6a3fb5',LK.man,'Studio'),
    intro:'The studio can pay one fee, or a royalty on each sale.',q:'Which do you choose?',
    opts:[['A royalty on each sale, with a public sales report',1],['A one-off fee only',0]],
    wrong:'A one-off fee ends your income at the first sale. Choose the royalty.',
    say:'Your pattern earns on every sale. The report shows it.'})
 ]},
{id:'m30',n:30,city:'sokoto',title:'Verify a digital land record',goal:'Check the issuer, parcel reference and change history before relying on a digital land record.',
 steps:[
  taskStep({label:'Check who issued the record',spot:'g',npc:mkSign('Aunty Ronke','Community records officer','#0B7A43',LK.woman,'Land registry'),
    intro:'A buyer brings a digital record for a plot of land. A file or token alone does not prove the claim is genuine.',q:'What do you verify first?',
    opts:[['The issuing registry and its official record',1],['The seller’s forwarded screenshot',0]],
    wrong:'Screenshots can be edited. Verify the issuer and locate the record through its official registry.',
    say:'You have confirmed the record comes from the registry that is meant to issue it.'}),
  taskStep({label:'Match the parcel reference',spot:'h',npc:mkSign('Aunty Ronke','Community records officer','#0B7A43',LK.woman,'Land registry'),
    intro:'The registry entry has a parcel reference, location and named holder. The seller’s document must match the public entry.',q:'What should you compare?',
    opts:[['The parcel reference and holder details against the registry entry',1],['Only the seller’s name on the printed page',0]],
    wrong:'A printed page can be altered. Compare the parcel reference and holder details against the registry source.',
    say:'The parcel details match the source record, so you can continue your checks.'}),
  taskStep({label:'Review the record history',spot:'i',npc:mkSign('Aunty Ronke','Community records officer','#0B7A43',LK.woman,'Land registry'),
    intro:'A record can be updated or disputed after it was first issued.',q:'Before relying on it, what else do you inspect?',
    opts:[['The latest status, recorded changes and any dispute notice',1],['The date on the oldest copy only',0]],
    wrong:'An old copy can miss later changes. Check the current status and the full available history.',
    say:'You checked the latest entry and its history instead of relying on a single document.'})
 ]},
{id:'m31',n:31,city:'abeokuta',title:'Book tours in USDC',goal:'Set up a booking link that shows both prices and the network, and confirm a deposit in your wallet.',
 steps:[
  taskStep({label:'Set the booking link with K',spot:'b',npc:mkSign('K','Licensed tour guide','#E4572E',LK.man,'Tours'),
    intro:'Visitors want to book the rock before they arrive.',q:'What does the booking link show?',
    opts:[['Both prices, and the network for the deposit',1],['Cash only, on the day',0]],
    wrong:'Cash on the day loses bookings. Show both prices and the network.',
    say:'Your booking link is live.'}),
  taskStep({label:'Pay the booking tool',spot:'d',npc:mkSign('David','Booking tool','#2D6FB3',LK.clerk,'Booking'),
    intro:'The booking tool takes USDC. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The booking tool is on Base.',
    tx:{title:'Booking tool',amt:1,btn:'Pay 1 USDC',done:'Booking tool active',note:'Keep the receipt.',
        rows:x=>[['To','Booking tool',1],['Amount','1.00 USDC'],['Network',x]]},
    say:'Your booking tool is active.'}),
  taskStep({label:'Confirm a visitor’s deposit',spot:'f',npc:mkSign('Oromachi','Tourist','#6a3fb5',LK.woman,'Visitor'),
    intro:'Kemi sends a deposit for Saturday’s tour.',q:'What do you check?',
    opts:[['The deposit in my wallet, then confirm the tour',1],['Her screenshot of the transfer',0]],
    wrong:'A screenshot is not a deposit. Check your wallet first.',
    say:'The deposit is in your wallet. Kemi’s tour is confirmed.'})
 ]},
{id:'m32',n:32,city:'abeokuta',title:'Set up the community fund',goal:'Create a fund that needs two of three approvals, put money in, and approve only the agreed amount.',
 steps:[
  taskStep({label:'Set up the fund with Mama Yetunde',spot:'h',npc:mkSign('Mama Yetunde','Community organiser','#C7457E',LK.trader,'Community fund'),
    intro:'The street wants a shared fund for lights and repairs.',q:'How is the fund controlled?',
    opts:[['Two of three named members must approve each payment',1],['One member holds the phrase for everyone',0]],
    wrong:'One holder controls everyone’s money. Use two approvals out of three.',
    say:'The fund needs two approvals for every payment.'}),
  taskStep({label:'Put 2 USDC into the fund',spot:'i',npc:mkSign('Mama Yetunde','Community organiser','#C7457E',LK.trader,'Community fund'),
    intro:'Your share goes into the fund. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The fund is on Base.',
    tx:{title:'Community fund',amt:2,btn:'Pay 2 USDC',done:'Contribution recorded',note:'The fund’s record is public.',
        rows:x=>[['To','Community fund',1],['Amount','2.00 USDC'],['Network',x]]},
    say:'Your share is recorded in the fund.'}),
  taskStep({label:'Approve the first project',spot:'j',npc:mkSign('Mama Yetunde','Community organiser','#C7457E',LK.trader,'Community fund'),
    intro:'Your wallet asks to let the fund spend for the street lights.',q:'What do you approve?',
    opts:[['Exactly the agreed project cost',1],['Unlimited spending from the fund',0]],
    wrong:'Unlimited spending lets the fund be emptied at any time. Approve only the agreed cost.',
    say:'The approval covers the agreed cost only.'})
 ]},
{id:'m33',n:33,city:'asaba',title:'Get paid on each milestone',goal:'Agree USDC on Base for each milestone, confirm payment on the explorer, and log the transaction ID.',
 steps:[
  taskStep({label:'Agree the payment with Engr. Ekpo',spot:'a',npc:mkSign('Abdul','Contractor client','#1f4f82',LK.man,'Contract'),
    intro:'Your client pays on each milestone. Bank delays have cost you cash before.',q:'How does the payment work?',
    opts:[['USDC on Base, sent on each milestone date',1],['Whenever it is convenient for them',0]],
    wrong:'Undated payments cause the late payments you already know. Fix the date and the network.',
    say:'The payment schedule is set.'}),
  taskStep({label:'Confirm milestone one',spot:'c',npc:mkSign('Abdul','Contractor client','#1f4f82',LK.man,'Contract'),
    intro:'Five USDC should have arrived for milestone one.',q:'How do you confirm it?',
    opts:[['Paste the transaction ID into the explorer and check 5 USDC arrived',1],['Trust their message that it is sent',0]],
    wrong:'A message is not proof. The explorer shows the payment on the public record.',
    say:'The explorer confirms 5 USDC. Milestone one is paid.'}),
  taskStep({label:'Log the payment with Chidi',spot:'e',npc:mkSign('Mcbond','Bookkeeper','#0B7A43',LK.man,'Records'),
    intro:'Your accountant needs the record for the month.',q:'What do you save?',
    opts:[['The transaction ID with the milestone sign-off',1],['A screenshot of the app',0]],
    wrong:'Screenshots are easy to lose or fake. Save the transaction ID with the sign-off.',
    say:'The payment is logged and linked to the milestone.'})
 ]},
{id:'m34',n:34,city:'asaba',title:'Take a digital gig',goal:'Confirm the gig terms in writing, share a permitted sample, and pay for a skills course on Base.',
 steps:[
  taskStep({label:'Confirm terms with Tamuno',spot:'g',npc:mkSign('Tamuno','Digital services recruiter','#2D6FB3',LK.man,'Gigs'),
    intro:'An overseas team needs bookkeeping help, paid in USDC every two weeks.',q:'What do you agree first?',
    opts:[['Rate, schedule and tasks, in writing',1],['Start the work, we talk money later',0]],
    wrong:'Start with written terms. Money talk after the work leaves you unpaid.',
    say:'The terms are written. You start the work.'}),
  taskStep({label:'Share a sample',spot:'h',npc:mkSign('Tamuno','Digital services recruiter','#2D6FB3',LK.man,'Gigs'),
    intro:'The team asks for a sample of your work.',q:'What do you send?',
    opts:[['A public example you are allowed to share',1],['Confidential data from a past client',0]],
    wrong:'Never share a past client’s confidential data. Send a public example.',
    say:'They review your sample and move to the offer.'}),
  taskStep({label:'Pay for a skills course',spot:'i',npc:mkSign('Akimitsu','Online course','#0B7A43',LK.clerk,'Course'),
    intro:'The course takes USDC. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The course is on Base.',
    tx:{title:'Skills course',amt:1,btn:'Pay 1 USDC',done:'Enrolled',note:'Check the refund policy in writing.',
        rows:x=>[['Item','Skills course'],['Amount','1.00 USDC'],['Network',x]]},
    say:'You are enrolled. Keep the receipt.'})
 ]},
{id:'m35',n:35,city:'uyo',title:'Open your pre-orders',goal:'Put a date, a price and a refund rule on the order page, and buy the fabric on Base.',
 steps:[
  taskStep({label:'Set up pre-orders with Ime',spot:'b',npc:mkSign('Akimitsu','Fashion designer','#C7457E',LK.woman,'Fashion'),
    intro:'You want to make 100 pieces. Pre-orders pay for the fabric before you cut.',q:'What goes on the order page?',
    opts:[['A delivery date, a price and a refund if late',1],['Money now, the date later',0]],
    wrong:'Without a date and a refund rule, buyers have no reason to trust the order.',
    say:'Your order page shows the date, price and refund rule.'}),
  taskStep({label:'Buy fabric for 3 USDC',spot:'c',npc:mkSign('Odion','Textile wholesaler','#2D6FB3',LK.man,'Fabric'),
    intro:'The fabric seller takes USDC. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The fabric seller takes USDC on Base.',
    tx:{title:'Fabric purchase',amt:3,btn:'Pay 3 USDC',done:'Fabric bought',note:'Keep the invoice with the pre-order list.',
        rows:x=>[['To','Fabric seller',1],['Amount','3.00 USDC'],['Network',x]]},
    say:'The fabric is on its way.'}),
  taskStep({label:'Announce the delay',spot:'d',npc:mkSign('Akimitsu','Fashion designer','#C7457E',LK.woman,'Fashion'),
    intro:'Fabric is a week late. You need to tell pre-order buyers.',q:'What do you do?',
    opts:[['Message every pre-order buyer early, with a new date and the refund option',1],['Say nothing and take more orders',0]],
    wrong:'Silence and more orders make the delay worse. Tell buyers now.',
    say:'Buyers hear early. Most stay with you.'})
 ]},
{id:'m36',n:36,city:'uyo',title:'Split royalties, in writing',goal:'Write each share in a published split, confirm your royalty on the record, and answer a partner from the record.',
 steps:[
  taskStep({label:'Write the split with Ekaette',spot:'e',npc:mkSign('Ekaette','Music producer','#0B7A43',LK.woman,'Music'),
    intro:'Your song is used in a video, and several people share the royalties.',q:'How is the split recorded?',
    opts:[['Each share written in the agreement and the payments published',1],['A verbal split among friends',0]],
    wrong:'Verbal splits cause disputes. Write the shares and publish the payments.',
    say:'The split is written and published.'}),
  taskStep({label:'Receive your royalty',spot:'f',npc:mkSign('Princess','Royalty payments','#2D6FB3',LK.clerk,'Royalties'),
    intro:'A royalty of 1 USDC arrives. Check it against your share.',q:'What do you do?',
    opts:[['Check the amount matches my share on the record',1],['Accept it without checking',0]],
    wrong:'Check the amount against your share before you accept it as complete.',
    say:'Your share matches the record.'}),
  taskStep({label:'Answer a partner from the record',spot:'h',npc:mkSign('Ekaette','Music producer','#0B7A43',LK.woman,'Music'),
    intro:'A partner asks why their share is smaller this month.',q:'What do you show?',
    opts:[['The public record of earnings and each share',1],['A change to the split without telling them',0]],
    wrong:'Changing the split without telling partners breaks trust. Show the record.',
    say:'The partner checks the record and the question is settled.'})
 ]},

/* ---- Katsina ---- */
{id:'m37',n:37,city:'katsina',title:'List your herd at the market board',goal:'List your herd on the market board, pay the listing fee on Base, and confirm the buyer’s deposit on the explorer.',
 steps:[
  taskStep({label:'Post the herd at the cattle market',spot:'a',npc:mkSign('Princess','Market association','#8E2F1B',LK.man,'Market board'),
    intro:'The market board is public. Buyers and sellers both check it before they agree a price.',q:'What do you list?',
    opts:[['The herd count, age, and the price range I accept',1],['Only a price, nothing else',0]],
    wrong:'A bare price tells buyers nothing about the animals. List the count, the age and your range.',
    say:'Your herd is on the board. Buyers can see what they are bidding on.'}),
  taskStep({label:'Pay the listing fee',spot:'b',npc:mkSign('Motunrayo','Market board','#2D6FB3',LK.clerk,'Listing'),
    intro:'Listings are paid in USDC. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The market board takes USDC on Base.',
    tx:{title:'Listing fee',amt:1,btn:'Pay 1 USDC',done:'Listed',note:'Your listing shows on the public board.',
        rows:x=>[['To','Market listing board',1],['Amount','1.00 USDC'],['Network',x]]},
    say:'Your listing is live on the board.'}),
  taskStep({label:'Confirm a buyer’s deposit',spot:'c',npc:mkSign('Seun','Cattle buyer','#E4572E',LK.man,'Buyer'),
    intro:'Garba sends a deposit to hold the herd. He sends you the transaction ID.',q:'How do you confirm it?',
    opts:[['Paste the transaction ID into the explorer and check the amount and address',1],['Trust his message that he has sent it',0]],
    wrong:'A message is not a deposit. The explorer shows what really arrived.',
    say:'The explorer confirms the deposit. The herd is held for Garba.'})
 ]},
{id:'m38',n:38,city:'katsina',title:'Herd health on the record',goal:'Have your vet sign the vaccination record, sign it as the owner, and pay the vet on Base.',
 steps:[
  taskStep({label:'Call the vet to the farm',spot:'d',npc:mkSign('Dr Sule','Veterinary officer','#0B7A43',LK.man,'Vet'),
    intro:'Dr Sule vaccinates the herd. The record should be signed by him and by you.',q:'What do you ask for?',
    opts:[['A signed vaccination record for each animal, with the date',1],['A verbal OK that the herd is fine',0]],
    wrong:'A verbal OK cannot be checked later. Ask for the signed record.',
    say:'Dr Sule writes the record for each animal.'}),
  taskStep({label:'Sign the record as owner',spot:'e',npc:mkSign('Dr Sule','Veterinary officer','#0B7A43',LK.man,'Vet'),
    intro:'Your wallet asks you to sign the vaccination record. A signature moves no money.',q:'What do you sign?',
    opts:[['The vaccination record for this herd',1],['A request to spend USDC from my wallet',0]],
    wrong:'Signing the record proves you agree to it. A spending request is not a record, so reject it.',
    say:'Your signature is on the record. Buyers can check it.'}),
  taskStep({label:'Pay the vet on Base',spot:'g',npc:mkSign('Dr Sule','Veterinary officer','#0B7A43',LK.man,'Vet'),
    intro:'The vet takes USDC. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The clinic is on Base.',
    tx:{title:'Vet fee',amt:1,btn:'Pay 1 USDC',done:'Vet paid',note:'Keep the receipt with the record.',
        rows:x=>[['To','Dr Sule',1],['Amount','1.00 USDC'],['Network',x]]},
    say:'The vet is paid. The record is complete.'})
 ]},
{id:'m39',n:39,city:'makurdi',title:'Payroll for the yam barn',goal:'Set up a payroll contract for your workers, approve only the monthly amount, and run the first payroll on Base.',
 steps:[
  taskStep({label:'Choose how to pay the workers',spot:'h',npc:mkSign('Racheal','Yam barn owner','#E4572E',LK.man,'Yam barn'),
    intro:'Eight workers need paying every month. You want a record for each pay day.',q:'How do you pay them?',
    opts:[['A payroll contract that pays each worker on the same day',1],['Cash handed out by hand, no record',0]],
    wrong:'Cash without a record is hard to prove at the end of the season. Use the payroll contract.',
    say:'The payroll contract is set up for eight workers.'}),
  taskStep({label:'Approve the monthly payroll amount',spot:'i',npc:mkSign('Blessing','Payroll contract','#2D6FB3',LK.clerk,'Payroll'),
    intro:'Your wallet asks to let the payroll contract spend USDC for wages.',q:'What do you approve?',
    opts:[['Exactly this month’s payroll total',1],['Unlimited USDC for the contract',0]],
    wrong:'Unlimited approval lets the contract take your whole balance. Approve only the monthly total.',
    say:'The contract can spend only this month’s payroll.'}),
  taskStep({label:'Run the first payroll',spot:'j',npc:mkSign('Blessing','Payroll contract','#2D6FB3',LK.clerk,'Payroll'),
    intro:'The payroll sends each worker’s wage in one transaction. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'Your payroll contract is on Base.',
    tx:{title:'First payroll',amt:3,btn:'Run payroll, 3 USDC',done:'Payroll sent',note:'Every worker’s pay is recorded on the network.',
        rows:x=>[['Workers','8'],['Total','3.00 USDC'],['Network',x]]},
    say:'Every worker’s pay is on the public record for the season.'})
 ]},
{id:'m40',n:40,city:'makurdi',title:'Shared storage for the farms',goal:'Join a storage group, sign its agreement, and pay your share of the storage on Base.',
 steps:[
  taskStep({label:'Join the storage group on the farm',spot:'k',npc:mkSign('Mama Ngu','Farm group leader','#C7457E',LK.mama,'Farm group'),
    intro:'Five farms share one grain store. Each farm pays a share of the running costs.',q:'What do you check before joining?',
    opts:[['The shared rules and the cost split, written and public',1],['The group leader’s word on the costs',0]],
    wrong:'Costs and rules should be written and public, so every farm can check them.',
    say:'You have the group’s written rules.'}),
  taskStep({label:'Sign the storage agreement',spot:'l',npc:mkSign('Mama Ngu','Farm group leader','#C7457E',LK.mama,'Farm group'),
    intro:'Your wallet asks you to sign the storage agreement. A signature is a promise, not a payment.',q:'What do you sign?',
    opts:[['The storage agreement for this season',1],['A request to send my whole balance to the group',0]],
    wrong:'Never send your whole balance to a group wallet. Sign the agreement only.',
    say:'The agreement is signed by your farm.'}),
  taskStep({label:'Pay your storage share',spot:'m',npc:mkSign('Racheal','Grain store','#2D6FB3',LK.clerk,'Store'),
    intro:'Your share of the storage is paid in USDC. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The store group pays on Base.',
    tx:{title:'Storage share',amt:2,btn:'Pay 2 USDC',done:'Storage paid',note:'Your share is recorded for the season.',
        rows:x=>[['To','Grain store group',1],['Amount','2.00 USDC'],['Network',x]]},
    say:'Your grain has a place in the store for the season.'})
 ]},
{id:'m41',n:41,city:'ibadan',title:'Verify a translation credential',goal:'Check who issued a translator credential, confirm its current status, and share only the proof a client needs.',
 steps:[
  taskStep({label:'Check the credential issuer',spot:'d',npc:mkSign('Bamidele','Professional registry','#2D6FB3',LK.clerk,'Credentials'),
    intro:'A client asks whether your translation credential is genuine.',q:'Where do you verify it?',
    opts:[['Search the issuing registry’s official record',1],['Trust a picture of the certificate',0]],
    wrong:'A picture can be copied or changed. Use the official issuing registry.',say:'You located the credential in the source registry.'}),
  taskStep({label:'Confirm the credential is current',spot:'e',npc:mkSign('Bamidele','Professional registry','#2D6FB3',LK.clerk,'Credentials'),
    intro:'The registry shows the credential, but it may have expired or been suspended.',q:'What do you check next?',
    opts:[['Its current status, issue date and expiry details',1],['Only the name printed on it',0]],
    wrong:'A matching name does not tell you whether a credential is still valid.',say:'You confirmed the credential’s current status.'}),
  taskStep({label:'Share only the required proof',spot:'h',npc:mkSign('Isaac','Translation client','#C7457E',LK.woman,'Client'),
    intro:'The client only needs proof that your credential is valid.',q:'What should you send?',
    opts:[['The public verification link or required credential reference',1],['Your private account password',0]],
    wrong:'A client never needs your account password to verify a credential.',say:'You shared enough proof for verification without exposing private access.'})
 ]},
{id:'m42',n:42,city:'ibadan',title:'Check school bursary eligibility',goal:'Verify a bursary’s published criteria, match an application to the required evidence, and protect a student’s private details.',
 steps:[
  taskStep({label:'Read the published criteria',spot:'d',npc:mkSign('Toheeb','Bursary office','#2D6FB3',LK.clerk,'Bursary'),
    intro:'The school has published criteria for a limited bursary.',q:'What do you check first?',
    opts:[['The official eligibility rules and application deadline',1],['A forwarded list with no source',0]],
    wrong:'Use the school’s official notice so applicants are judged by the same rules.',say:'You found the official eligibility criteria.'}),
  taskStep({label:'Match evidence to the application',spot:'e',npc:mkSign('Toheeb','Bursary office','#2D6FB3',LK.clerk,'Bursary'),
    intro:'An application must prove enrollment and meet the income requirement.',q:'What is the right review?',
    opts:[['Check only the required evidence against the published rules',1],['Ask the applicant to send every personal document they own',0]],
    wrong:'Collect only the evidence needed for the decision; extra personal data creates risk.',say:'You matched the required evidence without over-collecting data.'}),
  taskStep({label:'Protect the applicant’s details',spot:'h',npc:mkSign('Toheeb','Bursary office','#2D6FB3',LK.clerk,'Bursary'),
    intro:'The committee needs a record of its decision without exposing private student data.',q:'What belongs in a public update?',
    opts:[['The decision reference and outcome, with sensitive details withheld',1],['The student’s full private documents',0]],
    wrong:'Public accountability does not require publishing sensitive documents.',say:'The result can be checked while the student’s private information stays protected.'})
 ]},
{id:'m43',n:43,city:'asaba',title:'Document a supplier dispute',goal:'Build a clear evidence trail for a disputed delivery and record both sides’ response before the issue is closed.',
 steps:[
  taskStep({label:'Record what was agreed',spot:'d',npc:mkSign('Joe','Trade desk','#6a3fb5',LK.clerk,'Dispute desk'),
    intro:'A supplier says the delivery matched the order, but the buyer disagrees.',q:'What should the record start with?',
    opts:[['The original order, quantities and agreed delivery terms',1],['A conclusion based on who complains loudest',0]],
    wrong:'Start with the terms both sides accepted before deciding what happened.',say:'The dispute is anchored to the original agreement.'}),
  taskStep({label:'Attach verifiable delivery evidence',spot:'e',npc:mkSign('Joe','Trade desk','#6a3fb5',LK.clerk,'Dispute desk'),
    intro:'Both parties submit photos, counts and a delivery receipt.',q:'How should the evidence be handled?',
    opts:[['Keep dated references and identify which party supplied each item',1],['Replace the original records with one edited summary',0]],
    wrong:'Preserve the original evidence and its source so the trail remains auditable.',say:'Each piece of evidence has a source and can be reviewed.'}),
  taskStep({label:'Record the agreed outcome',spot:'h',npc:mkSign('Joe','Trade desk','#6a3fb5',LK.clerk,'Dispute desk'),
    intro:'After reviewing the evidence, both sides agree on a partial replacement.',q:'What closes the case properly?',
    opts:[['Record the remedy, both parties’ acknowledgement and completion status',1],['Delete the disagreement without noting the remedy',0]],
    wrong:'A clear close-out shows what was agreed and whether it was completed.',say:'The final record captures the remedy and both sides’ acknowledgement.'})
 ]},
{id:'m44',n:44,city:'asaba',title:'Invoice an overseas client',goal:'Prepare an invoice with clear scope, currency, due date and payment instructions, then reconcile the payment record.',
 steps:[
  taskStep({label:'Write a complete invoice',spot:'d',npc:mkSign('Mike','Overseas client','#C7457E',LK.woman,'Client desk'),
    intro:'You completed a design job for an overseas client.',q:'What should the invoice include?',
    opts:[['The agreed work, amount, currency, due date and payment details',1],['Only a total with no description or due date',0]],
    wrong:'A complete invoice helps both sides understand what is owed and when.',say:'The invoice records the agreed scope and payment terms.'}),
  taskStep({label:'Match the invoice to the agreement',spot:'e',npc:mkSign('Mike','Overseas client','#C7457E',LK.woman,'Client desk'),
    intro:'The client asks why the invoice amount differs from the original quote.',q:'What do you compare?',
    opts:[['The signed scope and any approved changes',1],['A new amount you cannot explain',0]],
    wrong:'The invoice should follow the agreed scope and documented changes.',say:'The amount can be traced back to the agreement.'}),
  taskStep({label:'Reconcile the incoming payment',spot:'h',npc:mkSign('Mike','Overseas client','#C7457E',LK.woman,'Client desk'),
    intro:'A payment arrives with a reference number.',q:'What confirms the invoice is settled?',
    opts:[['The amount and reference match the payment record',1],['A message that says “sent” with no record',0]],
    wrong:'A payment message alone does not reconcile an invoice.',say:'The payment record matches the amount due.'})
 ]},
{id:'m45',n:45,city:'akure',title:'Give to the church fund, verified',goal:'Check the church fund address on the published notice, sign a pledge, and give on Base.',
 steps:[
  taskStep({label:'Check the building fund with Bamidele',spot:'m',npc:mkSign('Bamidele','Church treasurer','#7a4a2e',LK.elder,'Church'),
    intro:'The church is raising funds for a new roof. The address is on the notice board.',q:'Which address do you give to?',
    opts:[['The address on the church’s published notice',1],['The address shared in the members’ chat',0]],
    wrong:'Chat addresses can be swapped. Use the published notice.',
    say:'You have the correct address for the roof fund.'}),
  taskStep({label:'Sign your pledge',spot:'n',npc:mkSign('Bamidele','Church treasurer','#7a4a2e',LK.elder,'Church'),
    intro:'Your pledge is a signed message on the fund’s record. It moves no money.',q:'What do you sign?',
    opts:[['My pledge to the roof fund',1],['A request to send my whole balance to the fund',0]],
    wrong:'A pledge is a message. Never send your whole balance on a pledge.',
    say:'Your pledge is on the public record.'}),
  taskStep({label:'Give to the roof fund',spot:'o',npc:mkSign('Bamidele','Church treasurer','#7a4a2e',LK.elder,'Church'),
    intro:'Your gift goes to the verified roof fund. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The fund is on Base.',
    tx:{title:'Roof fund gift',amt:1,btn:'Give 1 USDC',done:'Gift received',note:'The fund publishes its receipts.',
        rows:x=>[['To','Church roof fund',1],['Amount','1.00 USDC'],['Network',x]]},
    say:'Your gift is on the public record, and the fund will publish its receipts.'})
 ]},
{id:'m46',n:46,city:'akure',title:'A concert ticket you own',goal:'Buy the official ticket, check it is minted from the official contract, and show proof at the gate.',
 steps:[
  taskStep({label:'Choose the ticket with the promoter',spot:'a',npc:mkSign('Promoter Dayo','Concert promoter','#E4572E',LK.man,'Tickets'),
    intro:'Tickets for the concert are sold as tokens, so the seat is yours on the record.',q:'Where do you buy?',
    opts:[['The promoter’s official ticket contract, listed on their site',1],['A resale link sent in a message',0]],
    wrong:'Resale links are how fake tickets are sold. Buy from the official contract.',
    say:'You are on the official list for the concert.'}),
  taskStep({label:'Mint your ticket',spot:'b',npc:mkSign('Favour','Official ticket','#2D6FB3',LK.clerk,'Ticket desk'),
    intro:'Minting writes your ticket to your wallet. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The official ticket contract is on Base.',
    tx:{title:'Concert ticket',amt:2,btn:'Mint for 2 USDC',done:'Ticket minted',note:'Your seat is recorded on the network.',
        rows:x=>[['Item','Concert ticket, 1 seat'],['Price','2.00 USDC'],['Network',x]]},
    say:'Your ticket is in your wallet.'}),
  taskStep({label:'Show proof at the gate',spot:'c',npc:mkSign('Joshua','Concert gate','#0B7A43',LK.man,'Gate'),
    intro:'The gate scanner asks for proof of your ticket.',q:'What do you show?',
    opts:[['The ticket in my wallet, from the official contract',1],['A screenshot of the ticket',0]],
    wrong:'Screenshots can be copied. Show the ticket from your wallet.',
    say:'You are through the gate.'})
 ]},
{id:'m47',n:47,city:'bauchi',title:'Inspect a roof-material delivery',goal:'Check a contractor’s material list, record quantities received, and flag a short delivery before approving the invoice.',
 steps:[
  taskStep({label:'Compare the delivery with the order',spot:'d',npc:mkSign('Isaac','Mosque building committee','#0B7A43',LK.elder,'Roof project'),
    intro:'Roof sheets and timber arrive for a community building project.',q:'What do you compare first?',
    opts:[['The delivered items and quantities against the approved order',1],['The driver’s verbal estimate',0]],
    wrong:'Count the actual items against the approved list.',say:'You have a measured comparison against the order.'}),
  taskStep({label:'Record missing or damaged items',spot:'e',npc:mkSign('Isaac','Mosque building committee','#0B7A43',LK.elder,'Roof project'),
    intro:'Two sheets are damaged and several timber lengths are missing.',q:'How should you document it?',
    opts:[['Record the quantities and attach dated evidence before sign-off',1],['Approve the full delivery and mention it later',0]],
    wrong:'The record should reflect what arrived before anyone signs acceptance.',say:'The short delivery is documented before approval.'}),
  taskStep({label:'Approve only the verified amount',spot:'h',npc:mkSign('Isaac','Mosque building committee','#0B7A43',LK.elder,'Roof project'),
    intro:'The supplier invoice charges for the full order.',q:'What is the right next step?',
    opts:[['Hold approval until the invoice reflects the verified delivery',1],['Approve the full invoice despite the shortage',0]],
    wrong:'Approval should match the agreed terms and the quantity actually received.',say:'The committee has a clear record before approving payment.'})
 ]},
{id:'m48',n:48,city:'bauchi',title:'Pay stall rent by approval',goal:'Approve the exact monthly rent, check the landlord’s address on the published lease, and pay on Base.',
 steps:[
  taskStep({label:'Check the lease with Hajiya Zainab',spot:'g',npc:mkSign('Hajiya Zainab','Market landlord','#C7457E',LK.trader,'Stall lease'),
    intro:'Your stall lease is signed. The landlord’s payment address is written in it.',q:'Which address do you pay to?',
    opts:[['The address written in the signed lease',1],['A new address sent this week',0]],
    wrong:'A changed address is the first sign of trouble. Pay the address in the signed lease.',
    say:'The address matches the lease.'}),
  taskStep({label:'Approve the rent amount',spot:'h',npc:mkSign('Okiks','Rent payments','#2D6FB3',LK.clerk,'Rent'),
    intro:'The rent contract asks to spend your USDC each month. Set the limit.',q:'What do you approve?',
    opts:[['Exactly this month’s rent',1],['Unlimited USDC',0]],
    wrong:'Unlimited access lets the rent contract spend your savings. Approve one month’s rent.',
    say:'The approval covers one month’s rent only.'}),
  taskStep({label:'Pay the rent on Base',spot:'i',npc:mkSign('Okiks','Rent payments','#2D6FB3',LK.clerk,'Rent'),
    intro:'Pay this month’s rent. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The lease is paid on Base.',
    tx:{title:'Stall rent',amt:2,btn:'Pay 2 USDC',done:'Rent paid',note:'Keep the receipt with the lease.',
        rows:x=>[['To','Hajiya Zainab (lease address)',1],['Amount','2.00 USDC'],['Network',x]]},
    say:'Rent is paid. The receipt goes with your lease.'})
 ]},
{id:'m49',n:49,city:'minna',title:'Split a shared office utility bill',goal:'Allocate a shared utility bill using an agreed rule, check the meter period, and record each tenant’s contribution.',
 steps:[
  taskStep({label:'Check the bill period and meter',spot:'d',npc:mkSign('Egbuna','Shared office','#2D6FB3',LK.clerk,'Utilities'),
    intro:'Three small businesses share one office and receive a power bill.',q:'What do you verify first?',
    opts:[['The billing period, meter reading and total charge',1],['Last month’s amount without checking this bill',0]],
    wrong:'The amount must match the actual period and meter data.',say:'The shared bill is tied to the correct reading and period.'}),
  taskStep({label:'Apply the agreed split',spot:'e',npc:mkSign('Egbuna','Shared office','#2D6FB3',LK.clerk,'Utilities'),
    intro:'The tenants agreed to split the shared bill equally unless a separate meter shows otherwise.',q:'How do you calculate each share?',
    opts:[['Use the documented split rule and any verified sub-meter readings',1],['Charge one tenant the full bill without agreement',0]],
    wrong:'Use the rule everyone agreed to and account for reliable separate readings.',say:'Each share follows a transparent, agreed calculation.'}),
  taskStep({label:'Publish the contribution record',spot:'h',npc:mkSign('Egbuna','Shared office','#2D6FB3',LK.clerk,'Utilities'),
    intro:'The tenants need to see who has contributed without exposing unrelated personal details.',q:'What should the record show?',
    opts:[['The bill reference, split calculation and contribution status',1],['Private account details unrelated to the bill',0]],
    wrong:'Show enough to reconcile the bill without disclosing unnecessary private data.',say:'Everyone can reconcile the shared cost.'})
 ]},
{id:'m50',n:50,city:'minna',title:'A health claim, approved on the record',goal:'Sign the health claim, approve only the approved amount, and confirm the payout on the explorer.',
 steps:[
  taskStep({label:'File the claim with Sister Ruth',spot:'m',npc:mkSign('Sister Ruth','Clinic nurse','#0B7A43',LK.woman,'Clinic'),
    intro:'You file a claim for a clinic visit. The pool’s rules are public.',q:'What do you attach?',
    opts:[['The clinic receipt and the visit record',1],['A verbal explanation only',0]],
    wrong:'A claim needs the receipt and the visit record. Attach both.',
    say:'The claim is filed with its receipt.'}),
  taskStep({label:'Sign the claim',spot:'n',npc:mkSign('Amaka','Health pool','#2D6FB3',LK.clerk,'Claims'),
    intro:'Your claim is signed on the pool’s record. A signature moves no money.',q:'What do you sign?',
    opts:[['The claim with its receipt',1],['A request to send the pool’s whole balance',0]],
    wrong:'A claim is a signature on the record. A balance request is not a claim, so reject it.',
    say:'The claim is on the record for review.'}),
  taskStep({label:'Confirm the payout',spot:'o',npc:mkSign('Amaka','Health pool','#2D6FB3',LK.clerk,'Claims'),
    intro:'The claim is approved. The payout is sent on Base.',q:'How do you check it arrived?',
    opts:[['Look up the payout transaction on the explorer',1],['Wait for a message from the desk',0]],
    wrong:'Messages can be late or wrong. The explorer shows the payout.',
    say:'The payout is on the public record.'})
 ]},

/* ---- Oyo ---- */
{id:'m51',n:51,city:'ibadan',title:'List your recipe guide on the marketplace',goal:'List the guide with a clear licence, sign the licence, and receive the buyer’s payment on Base.',
 steps:[
  taskStep({label:'List the guide on the marketplace',spot:'a',npc:mkSign('Mama Folake','Home cook','#E4572E',LK.mama,'Marketplace'),
    intro:'The recipe guide goes on the online marketplace. Buyers choose a licence before they pay.',q:'Which licence do you list?',
    opts:[['A personal-use licence, with the price and credit to you',1],['A full transfer of rights for one fee',0]],
    wrong:'A full transfer gives away your recipes for good. List a personal-use licence.',
    say:'The guide is listed with its licence.'}),
  taskStep({label:'Sign the licence you offer',spot:'b',npc:mkSign('Mama Folake','Home cook','#E4572E',LK.mama,'Marketplace'),
    intro:'Your listing asks you to sign the licence terms. A signature is a promise, not a payment.',q:'What do you sign?',
    opts:[['The licence terms for the guide',1],['A request to send money from my wallet to the marketplace',0]],
    wrong:'Signing a licence is not paying anyone. Reject the spending request.',
    say:'Your licence is on the record for buyers.'}),
  taskStep({label:'Receive the buyer’s payment',spot:'c',npc:mkSign('Mide','Buyer abroad','#6a3fb5',LK.woman,'Buyer'),
    intro:'Tara buys the guide and pays on Base. Check it arrives.',q:'How do you confirm the sale?',
    opts:[['Look up her transaction on the explorer for Base',1],['Trust the marketplace notification',0]],
    wrong:'Notifications can be wrong. The explorer shows the payment on the public record.',
    say:'The payment is in your wallet. The guide is hers.'})
 ]},
{id:'m52',n:52,city:'ibadan',title:'Plan a school-fee budget',goal:'Build a school-fee plan with due dates, separate essentials from optional spending, and track each payment against the plan.',
 steps:[
  taskStep({label:'List the upcoming school costs',spot:'d',npc:mkSign('Ayo Bello','School parent','#C7457E',LK.woman,'School fees'),
    intro:'A parent needs to plan for tuition, books, transport and a uniform before term starts.',q:'What is the best first step?',
    opts:[['List each expected cost and its due date',1],['Spend first and estimate what remains later',0]],
    wrong:'A plan starts with the amounts and deadlines that are known.',say:'You have a dated list of expected school costs.'}),
  taskStep({label:'Prioritise the required payments',spot:'e',npc:mkSign('Ayo Bello','School parent','#C7457E',LK.woman,'School fees'),
    intro:'The available budget cannot cover every purchase at once.',q:'How do you decide what gets paid first?',
    opts:[['Prioritise required fees and essentials due soon, then plan optional items',1],['Pay optional purchases before the school deadline',0]],
    wrong:'Protect required deadlines before discretionary spending.',say:'The plan puts essential costs and deadlines first.'}),
  taskStep({label:'Track the payment against the plan',spot:'h',npc:mkSign('Ayo Bello','School parent','#C7457E',LK.woman,'School fees'),
    intro:'A tuition payment is made and a receipt is issued.',q:'What do you update?',
    opts:[['Mark the fee paid with its receipt reference and remaining balance',1],['Delete the planned fee without recording the payment',0]],
    wrong:'A receipt reference and updated balance keep the plan auditable.',say:'The budget reflects the actual payment and what remains due.'})
 ]},
{id:'m53',n:53,city:'adoekiti',title:'Honey contract, signed at the cooperative',goal:'Sign the honey contract at the cooperative, check the lab certificate’s address, and release payment on delivery.',
 steps:[
  taskStep({label:'Sign the honey contract',spot:'g',npc:mkSign('Toheeb','Honey buyer','#F6B21A',LK.man,'Honey'),
    intro:'The cooperative office holds the signing. The contract covers grade, quantity and price.',q:'What do you check before signing?',
    opts:[['The grade, quantity, price and release terms',1],['Only the buyer’s name',0]],
    wrong:'A name is not a contract. Check grade, quantity, price and release terms.',
    say:'The contract is signed on the cooperative’s record.'}),
  taskStep({label:'Check the lab certificate address',spot:'h',npc:mkSign('Joe','Grading lab','#2D6FB3',LK.clerk,'Lab'),
    intro:'The lab certificate is linked to its published address. Check the address before you trust it.',q:'Which address do you check against?',
    opts:[['The lab’s published address on its official page',1],['The address printed on the certificate itself',0]],
    wrong:'A certificate can carry any address. Check the lab’s published one.',
    say:'The certificate matches the lab’s address.'}),
  taskStep({label:'Release the payment on delivery',spot:'i',npc:mkSign('Toheeb','Honey buyer','#F6B21A',LK.man,'Honey'),
    intro:'The batch is delivered and graded. Release the escrowed payment on Base.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The escrow is on Base.',
    tx:{title:'Release escrow',amt:0,btn:'Release payment',done:'Payment released',note:'Released as the contract agrees.',
        rows:x=>[['Contract','Honey escrow',1],['Release','On delivery'],['Network',x]]},
    say:'The honey is paid for, and the record shows the grade.'})
 ]},
{id:'m54',n:54,city:'adoekiti',title:'Guide certificate, checked on the registry',goal:'Check your guide certificate on the registry, sign the trail waiver, and pay the park entry on Base.',
 steps:[
  taskStep({label:'Check your certificate on the registry',spot:'j',npc:mkSign('Ayo Ogunleye','Trail guide trainer','#0B7A43',LK.man,'Guides'),
    intro:'Hikers check that your guide certificate is real before they book.',q:'Where do you check it?',
    opts:[['The public guide registry, against my wallet address',1],['The certificate I printed myself',0]],
    wrong:'A printed certificate proves nothing. The registry shows if it was issued to your wallet.',
    say:'The registry shows your certificate, issued to you.'}),
  taskStep({label:'Sign the trail waiver',spot:'k',npc:mkSign('Ayo Ogunleye','Trail guide trainer','#0B7A43',LK.man,'Guides'),
    intro:'Hikers sign a waiver before the climb. Your wallet asks you to sign it.',q:'What do you sign?',
    opts:[['The trail waiver for this climb',1],['A request for spending on my wallet',0]],
    wrong:'A waiver is a signature. A spending request has no place in it.',
    say:'The waiver is signed on the record for this climb.'}),
  taskStep({label:'Pay the park entry',spot:'l',npc:mkSign('Tunde Akin','Park entry','#2D6FB3',LK.clerk,'Gate'),
    intro:'Park entry is paid in USDC. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The park gate takes USDC on Base.',
    tx:{title:'Park entry',amt:1,btn:'Pay 1 USDC',done:'Entry paid',note:'Keep the entry record.',
        rows:x=>[['To','Park gate',1],['Amount','1.00 USDC'],['Network',x]]},
    say:'Your entry is on the record. The climb can start.'})
 ]},
{id:'m55',n:55,city:'gombe',title:'Weekly order on the chef’s tab',goal:'Open the chef’s weekly order, approve only the delivery amount, and pay on delivery on Base.',
 steps:[
  taskStep({label:'Open the weekly order with Mike',spot:'m',npc:mkSign('Mike','Restaurant chef','#6a3fb5',LK.man,'Chef'),
    intro:'The restaurant orders tomatoes every week. The order is on a shared list.',q:'What goes on the order?',
    opts:[['Quantity, price per crate and the delivery day',1],['Quantity only, price to be agreed later',0]],
    wrong:'An order without a price invites disputes at delivery. Agree the price per crate.',
    say:'The weekly order is on the shared list.'}),
  taskStep({label:'Approve the delivery amount',spot:'n',npc:mkSign('Favour','Restaurant payments','#2D6FB3',LK.clerk,'Orders'),
    intro:'The order payment contract asks to spend USDC for this week’s delivery.',q:'What do you approve?',
    opts:[['This week’s delivery total',1],['Unlimited USDC for future orders',0]],
    wrong:'Unlimited approval is far more than a week’s order. Approve this week’s total.',
    say:'The approval covers this week only.'}),
  taskStep({label:'Pay on delivery',spot:'o',npc:mkSign('Mike','Restaurant chef','#6a3fb5',LK.man,'Chef'),
    intro:'The crates arrive. Pay the agreed amount on Base.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The restaurant pays on Base.',
    tx:{title:'Weekly tomatoes',amt:2,btn:'Pay 2 USDC',done:'Delivery paid',note:'Paid on delivery, against the order.',
        rows:x=>[['To','Tomato farm',1],['Amount','2.00 USDC'],['Network',x]]},
    say:'The delivery is paid. The order is closed on the record.'})
 ]},
{id:'m56',n:56,city:'gombe',title:'Share your farm record with the bank',goal:'Sign to share your farm record with the bank, and check the loan amount before you accept the disbursement.',
 steps:[
  taskStep({label:'Share your farm record at the bank',spot:'a',npc:mkSign('Lami Bako','Agricultural lender','#1f4f82',LK.woman,'Lender'),
    intro:'The bank wants to see your farm records. You decide what to share.',q:'What do you share?',
    opts:[['Only the seasons the bank asked for, by signed permission',1],['My whole phone and all my messages',0]],
    wrong:'Share the records the bank needs, under a permission you sign. Nothing more.',
    say:'The bank has access to the two seasons you agreed.'}),
  taskStep({label:'Check the loan before you accept',spot:'b',npc:mkSign('Lami Bako','Agricultural lender','#1f4f82',LK.woman,'Lender'),
    intro:'The loan is approved for 8 USDC. The disbursement contract shows the amount and the release.',q:'What do you check?',
    opts:[['The amount, the repayment schedule and the bank’s published address',1],['Only that the bank seems friendly',0]],
    wrong:'Check the amount, the schedule and the address. Friendly staff do not change the loan terms.',
    say:'The loan terms match what you agreed.'}),
  taskStep({label:'Accept the loan disbursement',spot:'c',npc:mkSign('Mallam Adamu','Loan disbursement','#2D6FB3',LK.clerk,'Loans'),
    intro:'Accepting pays out the loan. The contract asks you to approve receiving the amount. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The loan pays out on Base.',
    tx:{title:'Loan disbursement',amt:0,btn:'Accept 8 USDC loan',done:'Loan received',note:'Repayments follow the schedule you read.',
        rows:x=>[['From','Agricultural lender',1],['Amount','8.00 USDC'],['Network',x]]},
    say:'The loan is in your wallet. Repayments follow the agreed schedule.'})
 ]},
{id:'m57',n:57,city:'yola',title:'Join the groundnut co-op at the market',goal:'Check the co-op register address, sign your membership, and pay the fee on Base.',
 steps:[
  taskStep({label:'Check the co-op register',spot:'d',npc:mkSign('Joshua','Co-op secretary','#0B7A43',LK.man,'Co-op'),
    intro:'The co-op keeps its member register public. Check the address on the register before paying.',q:'Which address do you check?',
    opts:[['The address on the public register',1],['The address the secretary gave you at the stall',0]],
    wrong:'An address given verbally can be swapped. Check the public register.',
    say:'The address is confirmed on the register.'}),
  taskStep({label:'Sign your membership',spot:'e',npc:mkSign('Joshua','Co-op secretary','#0B7A43',LK.man,'Co-op'),
    intro:'Your membership is a signature on the register. It is free to sign.',q:'What do you sign?',
    opts:[['My membership on the public register',1],['A request to send my savings to the co-op',0]],
    wrong:'Signing membership is not paying savings. Reject any request to move your savings.',
    say:'You are on the register.'}),
  taskStep({label:'Pay the membership fee',spot:'f',npc:mkSign('Okiks','Membership','#2D6FB3',LK.clerk,'Membership'),
    intro:'The membership fee is paid in USDC. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The co-op takes USDC on Base.',
    tx:{title:'Co-op membership',amt:1,btn:'Pay 1 USDC',done:'Membership active',note:'Your receipt is on the register.',
        rows:x=>[['To','Co-op register address',1],['Amount','1.00 USDC'],['Network',x]]},
    say:'Your membership is active and on the public register.'})
 ]},
{id:'m58',n:58,city:'yola',title:'Approve wedding-photo delivery',goal:'Agree the wedding photo selection, verify the delivered files, and record client approval before closing the job.',
 steps:[
  taskStep({label:'Agree the photo selection',spot:'d',npc:mkSign('Hajiya Kande','Wedding client','#C7457E',LK.woman,'Photo delivery'),
    intro:'The photographer and couple need to agree on the final album.',q:'What should the delivery brief specify?',
    opts:[['The number of edited photos, format and delivery date',1],['Only that the album should look nice',0]],
    wrong:'Clear deliverables help both sides know what counts as finished.',say:'The final album has an agreed scope and deadline.'}),
  taskStep({label:'Check the delivered files',spot:'e',npc:mkSign('Hajiya Kande','Wedding client','#C7457E',LK.woman,'Photo delivery'),
    intro:'The photographer sends a download link for the album.',q:'What do you verify?',
    opts:[['The link works and the files match the agreed format and selection',1],['Only the first thumbnail',0]],
    wrong:'Check the actual delivered files, not just a preview.',say:'The album is checked against the delivery brief.'}),
  taskStep({label:'Record approval or specific revisions',spot:'h',npc:mkSign('Hajiya Kande','Wedding client','#C7457E',LK.woman,'Photo delivery'),
    intro:'The client requests two small edits before accepting the album.',q:'What is the clearest response?',
    opts:[['Record the specific edits and confirm approval after they are completed',1],['Close the job without acknowledging the requested changes',0]],
    wrong:'Specific revisions create a clear path to acceptance.',say:'The approval record states what remains and when the job is complete.'})
 ]},
{id:'m59',n:59,city:'abakaliki',title:'Group buy at the rice depot',goal:'Sign the group order, pay your share on Base, and check the depot’s delivery record.',
 steps:[
  taskStep({label:'Sign the group order at the depot',spot:'j',npc:mkSign('Egbuna','Rice depot','#1f4f82',LK.man,'Depot'),
    intro:'Five millers order rice together. The order lists each share.',q:'What do you sign?',
    opts:[['The group order with each miller’s share written in',1],['A blank order to be filled in later',0]],
    wrong:'A blank order can be filled in by anyone. Sign only the complete order.',
    say:'The group order is signed.'}),
  taskStep({label:'Pay your share on Base',spot:'k',npc:mkSign('Egbuna','Rice depot','#1f4f82',LK.man,'Depot'),
    intro:'Your share is paid into the group order. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The depot takes USDC on Base.',
    tx:{title:'Group order share',amt:2,btn:'Pay 2 USDC',done:'Share paid',note:'Your share is recorded on the order.',
        rows:x=>[['To','Rice depot group order',1],['Amount','2.00 USDC'],['Network',x]]},
    say:'Your share is recorded on the group order.'}),
  taskStep({label:'Check the delivery record',spot:'l',npc:mkSign('Egbuna','Rice depot','#1f4f82',LK.man,'Depot'),
    intro:'The rice is delivered. The depot posts a delivery record for the group.',q:'What do you check?',
    opts:[['Each miller’s share on the record matches the bags received',1],['Only the total number of bags',0]],
    wrong:'Check each share, not just the total. That is how the group stays fair.',
    say:'Every share matches the delivery record.'})
 ]},
{id:'m60',n:60,city:'abakaliki',title:'Resolve a pending transfer safely',goal:'Investigate a pending transfer without exposing private keys or sending the payment a second time.',
 steps:[
  taskStep({label:'Find the transaction status',spot:'m',npc:mkSign('Mmesoma Okafor','Network support desk','#C7457E',LK.woman,'Help desk'),
    intro:'A customer says a transfer is still pending. The balance has not changed yet, and they are worried.',q:'What should you check first?',
    opts:[['Search the transaction ID on the correct network explorer',1],['Send the same amount again immediately',0]],
    wrong:'The first transfer may still confirm. Check its transaction ID and status before attempting anything else.',
    say:'You found the original transaction and checked its status before taking another action.'}),
  taskStep({label:'Share only safe troubleshooting details',spot:'n',npc:mkSign('Mmesoma Okafor','Network support desk','#C7457E',LK.woman,'Help desk'),
    intro:'The support agent asks for information to investigate the delay.',q:'What can you safely share?',
    opts:[['The public transaction ID and wallet address',1],['The recovery phrase or wallet password',0]],
    wrong:'Support never needs your recovery phrase or password. Share only public troubleshooting details.',
    say:'You shared the public transaction reference without exposing account secrets.'}),
  taskStep({label:'Choose the next step from the status',spot:'o',npc:mkSign('Mmesoma Okafor','Network support desk','#C7457E',LK.woman,'Help desk'),
    intro:'The explorer says the transaction is still pending, not failed.',q:'What do you do now?',
    opts:[['Wait for the status to resolve and follow the network guidance',1],['Pay a stranger an extra fee to unlock it',0]],
    wrong:'An unsolicited unlock fee can be a scam. Follow the network status and official support guidance.',
    say:'You avoided a duplicate payment and an unofficial fee while the original transfer is pending.'})
 ]},
{id:'m61',n:61,city:'abia',title:'Overseas repair order on the courier',goal:'Accept the repair order by signature, pay the courier on Base, and confirm the parcel was received.',
 steps:[
  taskStep({label:'Accept the repair order',spot:'a',npc:mkSign('Amaka','Overseas client','#6a3fb5',LK.man,'Client'),
    intro:'A client sends shoes for repair from overseas. Accepting the order is a signature.',q:'What do you sign?',
    opts:[['The repair order with the price and the return address',1],['A spending approval for the client’s account',0]],
    wrong:'The client does not need access to your money. Sign the order only.',
    say:'The order is accepted on the record.'}),
  taskStep({label:'Pay the courier',spot:'b',npc:mkSign('Mide','Courier','#2D6FB3',LK.clerk,'Courier'),
    intro:'The courier takes USDC for the return journey. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The courier takes USDC on Base.',
    tx:{title:'Courier return',amt:1,btn:'Pay 1 USDC',done:'Courier booked',note:'Keep the tracking link.',
        rows:x=>[['To','Courier',1],['Amount','1.00 USDC'],['Network',x]]},
    say:'The courier has the parcel. The tracking link is shared.'}),
  taskStep({label:'Confirm the parcel was received',spot:'c',npc:mkSign('Amaka','Overseas client','#6a3fb5',LK.man,'Client'),
    intro:'The client confirms the shoes arrived in good order.',q:'How do you close the order?',
    opts:[['Mark the order received on the record, so the job closes',1],['Leave it open and ignore the client',0]],
    wrong:'An open order keeps disputes alive. Mark it received once it arrives.',
    say:'The order is closed, and the record shows it.'})
 ]},
{id:'m62',n:62,city:'abia',title:'Workshop rent, booked on a shared calendar',goal:'Sign the shared rent agreement, pay your share on Base, and swap a booking by signature.',
 steps:[
  taskStep({label:'Sign the shared rent agreement',spot:'d',npc:mkSign('Mama Uche','Workshop owner','#7a4a2e',LK.mama,'Workshop'),
    intro:'Three artisans share the workshop. The agreement sets each share of the rent.',q:'What do you sign?',
    opts:[['The agreement with each share written in',1],['A blank agreement to fill in later',0]],
    wrong:'A blank agreement lets anyone fill in the shares. Sign the complete one.',
    say:'The agreement is signed by all three artisans.'}),
  taskStep({label:'Pay your rent share',spot:'e',npc:mkSign('Mama Uche','Workshop owner','#7a4a2e',LK.mama,'Workshop'),
    intro:'Your share is paid into the workshop account. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The workshop account is on Base.',
    tx:{title:'Workshop rent share',amt:2,btn:'Pay 2 USDC',done:'Rent paid',note:'Recorded against the agreement.',
        rows:x=>[['To','Workshop account',1],['Amount','2.00 USDC'],['Network',x]]},
    say:'Your share is paid and recorded.'}),
  taskStep({label:'Swap a booking by signature',spot:'f',npc:mkSign('Artisan Ngozi','Shared tenant','#C7457E',LK.woman,'Tenant'),
    intro:'Ngozi wants to swap Thursday for your Friday. The calendar needs both signatures.',q:'What do you sign?',
    opts:[['The swap on the shared calendar, with both names',1],['A payment to Ngozi for the swap',0]],
    wrong:'A swap is a signed change to the calendar, not a payment. Sign the swap only.',
    say:'The calendar is updated with both signatures.'})
 ]},
{id:'m63',n:63,city:'bayelsa',title:'Trace a fish catch to its landing',goal:'Record the landing location, catch time and handling checks so a buyer can trace the fish batch to its source.',
 steps:[
  taskStep({label:'Record the landing details',spot:'d',npc:mkSign('Aunty Kemi','Fish seller','#2D6FB3',LK.man,'Landing site'),
    intro:'A buyer asks where a batch of fish was caught and landed.',q:'What should the first record include?',
    opts:[['The landing site, date, time and batch reference',1],['Only the seller’s nickname',0]],
    wrong:'A traceable batch needs a source and a time reference.',say:'The batch can be linked to a specific landing event.'}),
  taskStep({label:'Check the handling record',spot:'e',npc:mkSign('Aunty Kemi','Fish seller','#2D6FB3',LK.man,'Landing site'),
    intro:'The fish must stay chilled between landing and market.',q:'What should you check?',
    opts:[['The recorded handling and temperature checks for the batch',1],['A general claim that it stayed fresh',0]],
    wrong:'A specific handling record is more useful than an unsupported assurance.',say:'The batch has a documented handling trail.'}),
  taskStep({label:'Share the traceability reference',spot:'h',npc:mkSign('Chuka Nwosu','Fish buyer','#C7457E',LK.woman,'Fish market'),
    intro:'The buyer wants to verify the batch without seeing unrelated business records.',q:'What do you provide?',
    opts:[['The batch reference and its relevant source and handling record',1],['Private records for every other customer',0]],
    wrong:'Share only the records relevant to this batch.',say:'The buyer can trace the fish to its source and handling checks.'})
 ]},
{id:'m64',n:64,city:'bayelsa',title:'Manage the ferry boarding manifest',goal:'Match passenger bookings to the departure manifest, handle a changed booking, and reconcile the final passenger count.',
 steps:[
  taskStep({label:'Match bookings to the manifest',spot:'d',npc:mkSign('Timi Opu','Ferry operator','#2D6FB3',LK.clerk,'Boarding desk'),
    intro:'The ferry crew needs a reliable list of passengers for the crossing.',q:'What do you check?',
    opts:[['Each booking reference against the departure manifest',1],['Only the total number written on a note',0]],
    wrong:'Individual references help detect missing or duplicated bookings.',say:'The manifest can be reconciled to actual bookings.'}),
  taskStep({label:'Handle a changed booking',spot:'e',npc:mkSign('Timi Opu','Ferry operator','#2D6FB3',LK.clerk,'Boarding desk'),
    intro:'A passenger has moved to a later departure.',q:'What should happen to the manifest?',
    opts:[['Update the booking status and place the passenger on the correct departure',1],['Leave both departures marked as confirmed',0]],
    wrong:'A change must update the record so the same booking is not counted twice.',say:'The passenger appears on the correct departure only.'}),
  taskStep({label:'Reconcile before departure',spot:'h',npc:mkSign('Timi Opu','Ferry operator','#2D6FB3',LK.clerk,'Boarding desk'),
    intro:'Boarding is complete and the ferry is ready to leave.',q:'What do you confirm?',
    opts:[['The boarded count matches the checked manifest and safety limit',1],['Depart with an unexplained mismatch',0]],
    wrong:'The crew needs a reconciled count within the safe passenger limit.',say:'The final manifest matches the boarding count.'})
 ]},
{id:'m65',n:65,city:'jigawa',title:'Book the shared pump on the log',goal:'Book your turn on the shared pump, approve the group fund for your share, and pay your running cost on Base.',
 steps:[
  taskStep({label:'Book your turn at the pump',spot:'a',npc:mkSign('Sadiq Bello','Farm group leader','#0B7A43',LK.man,'Pump log'),
    intro:'The pump runs on a shared booking log. Each farm books its hours before it runs.',q:'What do you book?',
    opts:[['Two hours on Thursday, in the shared log',1],['The pump for the whole week, without a log entry',0]],
    wrong:'A week with no entry blocks the other farms. Book your hours in the log.',
    say:'Your hours are in the shared log.'}),
  taskStep({label:'Approve your share from the group fund',spot:'b',npc:mkSign('Tunde Balogun','Shared fund','#2D6FB3',LK.clerk,'Fund'),
    intro:'The fund asks to release your share of the running cost.',q:'What do you approve?',
    opts:[['Exactly my share for these hours',1],['The whole fund, for all future runs',0]],
    wrong:'Approve only your share. A whole-fund approval lets anyone spend the lot.',
    say:'The release covers your share only.'}),
  taskStep({label:'Pay your running cost on Base',spot:'c',npc:mkSign('Tunde Balogun','Shared fund','#2D6FB3',LK.clerk,'Fund'),
    intro:'Pay your share of the running cost. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The pump fund is on Base.',
    tx:{title:'Pump running cost',amt:1,btn:'Pay 1 USDC',done:'Cost paid',note:'Recorded in the shared log.',
        rows:x=>[['To','Pump fund',1],['Amount','1.00 USDC'],['Network',x]]},
    say:'Your hours and cost are both on the shared record.'})
 ]},
{id:'m66',n:66,city:'jigawa',title:'List your grain at the market board',goal:'Check the market price feed, list your grain with a signed listing, and confirm the buyer’s payment on the explorer.',
 steps:[
  taskStep({label:'Check the market price feed',spot:'d',npc:mkSign('Malam Musa','Market information','#2D6FB3',LK.man,'Prices'),
    intro:'The market publishes prices at its board and online. Check the feed before you list.',q:'Which feed do you use?',
    opts:[['The market’s published feed, on its official page',1],['A feed link sent to my phone',0]],
    wrong:'A link sent to a phone can show false prices. Use the published feed.',
    say:'You see the true price for this week.'}),
  taskStep({label:'Sign your grain listing',spot:'e',npc:mkSign('Malam Musa','Market information','#2D6FB3',LK.man,'Prices'),
    intro:'Your listing is a signed message on the board. It moves no money.',q:'What do you sign?',
    opts:[['The listing: 40 bags, price per bag, pickup day',1],['A request to send my stock to the board',0]],
    wrong:'A listing is a message. Nobody needs your stock sent to them to list it.',
    say:'Your listing is on the board.'}),
  taskStep({label:'Confirm the buyer’s payment',spot:'f',npc:mkSign('Hadiza Bello','Grain buyer','#E4572E',LK.woman,'Buyer'),
    intro:'Hadiza pays for the 40 bags. Check the payment before the truck leaves.',q:'How do you confirm?',
    opts:[['Look up the payment transaction on the explorer',1],['Trust her message that it is sent',0]],
    wrong:'Messages do not move the truck. The explorer shows the payment.',
    say:'The payment is in your wallet. The truck can leave.'})
 ]},
{id:'m67',n:67,city:'kebbi',title:'Consent before the field survey',goal:'Sign the consent form, submit the survey on the research registry, and check the survey fee arrives.',
 steps:[
  taskStep({label:'Sign the consent form with Nneka Okafor',spot:'g',npc:mkSign('Nneka Okafor','Agricultural research','#0B7A43',LK.woman,'Research'),
    intro:'The survey asks about your farm. Before the first question, you choose what you agree to share.',q:'What do you sign?',
    opts:[['Consent for my farm data only, with the fee and how it is used',1],['Consent for my farm and my neighbours’ names',0]],
    wrong:'Your neighbours have not agreed to be named. Consent covers your farm only.',
    say:'Your consent is on the research registry.'}),
  taskStep({label:'Submit the survey',spot:'h',npc:mkSign('Nneka Okafor','Agricultural research','#0B7A43',LK.woman,'Research'),
    intro:'Submitting the survey writes the answers to the registry, with your consent attached.',q:'What do you attach?',
    opts:[['My consent record and the survey answers',1],['Only the answers, without consent',0]],
    wrong:'A survey without consent is not usable. Attach your consent record.',
    say:'The survey is in the registry, with your consent attached.'}),
  taskStep({label:'Check the survey fee',spot:'i',npc:mkSign('Hadiza Sule','Survey payments','#2D6FB3',LK.clerk,'Payments'),
    intro:'The fee for the survey is sent when the registry accepts it.',q:'Where do you check it arrived?',
    opts:[['The transaction on the explorer, from the research wallet',1],['A message saying it has been sent',0]],
    wrong:'The explorer shows the fee. A message only says it was sent.',
    say:'The fee is in your wallet.'})
 ]},
{id:'m68',n:68,city:'kebbi',title:'Sign off the pond harvest',goal:'Vote on the harvest sign-off, pay the feed on Base, and check the harvest record for your share.',
 steps:[
  taskStep({label:'Vote on the harvest sign-off',spot:'j',npc:mkSign('Mallam Sadiq','Pond manager','#2D6FB3',LK.man,'Pond'),
    intro:'The harvest is weighed. Members vote to sign off the record.',q:'What do you vote?',
    opts:[['Sign off the weighed harvest, as posted on the board',1],['Sign off a harvest number nobody weighed',0]],
    wrong:'Sign off only the weights everyone saw. An unweighed number is not a harvest.',
    say:'Your vote is recorded with the harvest.'}),
  taskStep({label:'Pay for the pond feed',spot:'k',npc:mkSign('Yahaya Bako','Fish feed','#2D6FB3',LK.clerk,'Feed'),
    intro:'The feed is paid in USDC for next season. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The feed seller takes USDC on Base.',
    tx:{title:'Pond feed',amt:2,btn:'Pay 2 USDC',done:'Feed paid',note:'Recorded against the pond.',
        rows:x=>[['To','Feed seller',1],['Amount','2.00 USDC'],['Network',x]]},
    say:'The feed is paid and recorded.'}),
  taskStep({label:'Check your share on the harvest record',spot:'l',npc:mkSign('Mallam Sadiq','Pond manager','#2D6FB3',LK.man,'Pond'),
    intro:'The harvest record shows each member’s share by work days.',q:'What do you check?',
    opts:[['My work days and share match the record',1],['Only that the total harvest is large',0]],
    wrong:'Check your own share. A large total can hide a short share.',
    say:'Your share matches the record.'})
 ]},
{id:'m69',n:69,city:'kogi',title:'Sign the apprenticeship offer',goal:'Check the plant’s published address, sign your apprenticeship offer, and pay your safety course on Base.',
 steps:[
  taskStep({label:'Check the plant’s address',spot:'m',npc:mkSign('Femi Alade','Training officer','#1f4f82',LK.man,'Training'),
    intro:'The apprenticeship is posted on the plant’s site. Check the plant’s address before you sign.',q:'Which address do you check?',
    opts:[['The address published on the plant’s official site',1],['The address on the offer letter a recruiter gave you',0]],
    wrong:'Offer letters can carry the wrong address. Check the plant’s published one.',
    say:'The address matches the plant’s site.'}),
  taskStep({label:'Sign the apprenticeship offer',spot:'n',npc:mkSign('Femi Alade','Training officer','#1f4f82',LK.man,'Training'),
    intro:'Your offer is signed on the plant’s record. The offer shows your pay and milestones.',q:'What do you sign?',
    opts:[['The offer, with the pay and the milestones written in',1],['A request to pay the plant a training fee',0]],
    wrong:'A real apprenticeship does not charge you a fee to sign. Reject the payment.',
    say:'The offer is signed with its milestones.'}),
  taskStep({label:'Pay for your safety course',spot:'o',npc:mkSign('Efe Tamuno','Training school','#2D6FB3',LK.clerk,'Safety'),
    intro:'The safety course is paid for in USDC. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The safety school takes USDC on Base.',
    tx:{title:'Safety course',amt:1,btn:'Pay 1 USDC',done:'Enrolled',note:'Ask the plant whether it reimburses training.',
        rows:x=>[['Item','Plant safety course'],['Amount','1.00 USDC'],['Network',x]]},
    say:'You are enrolled. Keep the receipt.'})
 ]},
{id:'m70',n:70,city:'kogi',title:'Loan repayment, approved in advance',goal:'Sign the loan terms, approve only the next instalment, and repay on time on Base.',
 steps:[
  taskStep({label:'Sign the loan terms with Mrs Ojo',spot:'a',npc:mkSign('Mrs Ojo','Community lender','#0B7A43',LK.woman,'Lender'),
    intro:'The loan is 8 USDC over four months. The terms are written on a signed record.',q:'What do you check before signing?',
    opts:[['The total repayment and the monthly amount on the record',1],['Only the amount I receive now',0]],
    wrong:'The amount you receive is not the cost. Check the total repayment.',
    say:'The loan terms are signed on the record.'}),
  taskStep({label:'Approve the monthly instalment',spot:'b',npc:mkSign('Sani Abdullahi','Repayments','#2D6FB3',LK.clerk,'Repayments'),
    intro:'Repayments are pulled from your wallet by an approval. Set the limit.',q:'What do you approve?',
    opts:[['The next instalment only',1],['Unlimited USDC to the loan desk',0]],
    wrong:'Unlimited approval lets the loan desk take far more than the instalment. Approve one instalment.',
    say:'The approval covers the next instalment only.'}),
  taskStep({label:'Make the repayment on Base',spot:'c',npc:mkSign('Mrs Ojo','Community lender','#0B7A43',LK.woman,'Lender'),
    intro:'This month’s instalment is due. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The loan is repaid on Base.',
    tx:{title:'Loan instalment',amt:2,btn:'Repay 2 USDC',done:'Instalment paid',note:'Recorded on your schedule.',
        rows:x=>[['To','Loan desk',1],['Amount','2.00 USDC'],['Network',x]]},
    say:'Your repayment is on the record. The schedule is on track.'})
 ]},
{id:'m71',n:71,city:'nasarawa',title:'Weekly egg round, approved for the week',goal:'Sign this week’s delivery list, approve only the weekly total, and pay for the crates on Base.',
 steps:[
  taskStep({label:'Sign the weekly delivery list',spot:'d',npc:mkSign('Aisha Danladi','Poultry seller','#C7457E',LK.mama,'Eggs'),
    intro:'Your round has regular customers. The weekly list is signed so customers can check it.',q:'What do you sign?',
    opts:[['The list of households and shops, with eggs per drop',1],['A blank list to fill in on the day',0]],
    wrong:'A blank list cannot be checked by customers. Sign the complete list.',
    say:'The round is on the signed list.'}),
  taskStep({label:'Approve the week’s total',spot:'e',npc:mkSign('Boma Briggs','Delivery payments','#2D6FB3',LK.clerk,'Orders'),
    intro:'Customers pay per week through a contract. Set your limit.',q:'What do you approve?',
    opts:[['This week’s delivery total only',1],['Unlimited payments from customers’ wallets',0]],
    wrong:'Unlimited access lets anyone’s payments be pulled at will. Approve only the week’s total.',
    say:'The approval covers this week’s round.'}),
  taskStep({label:'Buy the crates on Base',spot:'f',npc:mkSign('Ifeoma Uche','Crates','#2D6FB3',LK.clerk,'Crates'),
    intro:'Fresh crates for the round. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The crate seller takes USDC on Base.',
    tx:{title:'Egg crates',amt:1,btn:'Pay 1 USDC',done:'Crates bought',note:'Keep the receipt with the round.',
        rows:x=>[['To','Crate seller',1],['Amount','1.00 USDC'],['Network',x]]},
    say:'The crates are paid for. The round can start.'})
 ]},
{id:'m72',n:72,city:'nasarawa',title:'Post the water tariff and test',goal:'Sign the posted tariff on the kiosk record, pay for the water test on Base, and check the test certificate.',
 steps:[
  taskStep({label:'Sign the posted tariff',spot:'g',npc:mkSign('Engr. Dauda','Water kiosk operator','#2D6FB3',LK.man,'Water kiosk'),
    intro:'The kiosk tariff is posted on the community record. Sign it to make it official.',q:'What do you sign?',
    opts:[['The tariff per container, with the date of review',1],['A tariff that changes with each customer',0]],
    wrong:'A tariff that changes per customer is not a tariff. Sign one fixed rate.',
    say:'The tariff is signed on the community record.'}),
  taskStep({label:'Pay for the water test',spot:'h',npc:mkSign('Nneka Umeh','Water testing','#0B7A43',LK.clerk,'Testing'),
    intro:'The lab tests the water before the kiosk reopens. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The lab takes USDC on Base.',
    tx:{title:'Water test',amt:2,btn:'Pay 2 USDC',done:'Test booked',note:'The certificate is issued after the test.',
        rows:x=>[['To','Lab Test',1],['Amount','2.00 USDC'],['Network',x]]},
    say:'The test is booked.'}),
  taskStep({label:'Check the test certificate',spot:'i',npc:mkSign('Village Head','Village head','#7a4a2e',LK.elder,'Village'),
    intro:'The certificate says the water is safe. Post it at the kiosk.',q:'What do you check on the certificate?',
    opts:[['The lab’s address and the test date match the lab’s record',1],['Only that it has a stamp on it',0]],
    wrong:'A stamp can be copied. Check the lab’s address and the date against its record.',
    say:'The certificate is genuine. It goes up at the kiosk.'})
 ]},
{id:'m73',n:73,city:'osun',title:'Check a festival vendor’s food-safety record',goal:'Verify a vendor’s food-handling checklist, record a temperature check, and flag an issue before the stall opens.',
 steps:[
  taskStep({label:'Review the vendor checklist',spot:'d',npc:mkSign('Sani Musa','Event safety team','#2D6FB3',LK.clerk,'Food safety'),
    intro:'A food stall is preparing to open at a busy festival.',q:'What do you review first?',
    opts:[['The required hygiene, storage and handling checklist',1],['Only the stall’s decoration and menu',0]],
    wrong:'The checklist focuses on risks that can affect customers.',say:'The vendor has been checked against the safety requirements.'}),
  taskStep({label:'Record a cold-storage check',spot:'e',npc:mkSign('Sani Musa','Event safety team','#2D6FB3',LK.clerk,'Food safety'),
    intro:'Some ingredients need to remain within a safe temperature range.',q:'What is the correct record?',
    opts:[['The measured temperature, time and equipment checked',1],['A note that the fridge feels cold',0]],
    wrong:'A measured, timed reading is more reliable than a vague impression.',say:'The storage check can be reviewed later.'}),
  taskStep({label:'Flag and resolve a failed check',spot:'h',npc:mkSign('Sani Musa','Event safety team','#2D6FB3',LK.clerk,'Food safety'),
    intro:'The reading is outside the required range before the stall opens.',q:'What should you do?',
    opts:[['Record the issue, prevent unsafe food from being served and recheck after correction',1],['Ignore it so the stall can open on time',0]],
    wrong:'Protect customers first, then document the correction and recheck.',say:'The issue has a documented corrective action before service.'})
 ]},
{id:'m74',n:74,city:'osun',title:'Publish a craft with the maker’s consent',goal:'Get the maker’s consent, publish the craft entry on Base, and remove a piece when a maker asks.',
 steps:[
  taskStep({label:'Get the maker’s consent',spot:'m',npc:mkSign('Maker Funmi','Weaver','#C7457E',LK.woman,'Maker'),
    intro:'Before a craft goes in the archive, the maker signs her consent.',q:'What does the consent say?',
    opts:[['Her name, the technique, and that she agrees to publication',1],['Nothing, the craft is public already',0]],
    wrong:'Public is not consent. The maker signs before her work is published.',
    say:'Funmi’s consent is signed.'}),
  taskStep({label:'Publish the entry on Base',spot:'n',npc:mkSign('Chief Oyebanji','Heritage custodian','#7a4a2e',LK.elder,'Heritage'),
    intro:'The entry goes on the archive record with the maker’s name. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The archive is on Base.',
    tx:{title:'Publish craft entry',amt:1,btn:'Publish for 1 USDC',done:'Entry published',note:'Entries carry the maker’s name and consent.',
        rows:x=>[['Item','Weaving entry, Funmi'],['Amount','1.00 USDC'],['Network',x]]},
    say:'The entry is public, with the maker’s name.'}),
  taskStep({label:'Remove a piece at the maker’s request',spot:'o',npc:mkSign('Maker Funmi','Weaver','#C7457E',LK.woman,'Maker'),
    intro:'Funmi asks to remove a pattern her family considers sacred.',q:'What do you do on the record?',
    opts:[['Sign the removal and keep a record that it was requested',1],['Refuse, because the archive is public',0]],
    wrong:'The maker decides what is shared. Sign the removal.',
    say:'The pattern is removed. The record shows the request.'})
 ]},
{id:'m75',n:75,city:'taraba',title:'Sell cocoa on a graded board',goal:'Check the published grade, sign the sale at that grade, and confirm payment on the explorer.',
 steps:[
  taskStep({label:'Check the published grade',spot:'a',npc:mkSign('Nura Abubakar','Cocoa cooperative','#7a4a2e',LK.man,'Cocoa'),
    intro:'Your batch is graded by the cooperative. The grade is on its published board.',q:'What do you check?',
    opts:[['The grade on the published board, against my batch number',1],['The grade the buyer quoted me',0]],
    wrong:'A quoted grade can be lower than yours. Check the board against your batch.',
    say:'Your batch grade is confirmed on the board.'}),
  taskStep({label:'Sign the sale at the grade',spot:'b',npc:mkSign('Eno Bassey','Cocoa buyer','#6a3fb5',LK.woman,'Buyer'),
    intro:'Lara agrees to buy at the published grade. Sign the sale.',q:'What do you sign?',
    opts:[['The sale at the published grade, with the price',1],['A sale at a lower grade, to be agreed later',0]],
    wrong:'Sign at the published grade only. A lower grade later is a loss you agreed to.',
    say:'The sale is signed at the grade.'}),
  taskStep({label:'Confirm the payment',spot:'c',npc:mkSign('Eno Bassey','Cocoa buyer','#6a3fb5',LK.woman,'Buyer'),
    intro:'Lara pays into escrow, released after weighing. Check it on Base.',q:'How do you confirm it is there?',
    opts:[['Look up the escrow on the explorer, for the agreed amount',1],['Trust her message that it is paid',0]],
    wrong:'Messages are not escrow. The explorer shows the amount held.',
    say:'The amount is held in escrow for weighing.'})
 ]},
{id:'m76',n:76,city:'taraba',title:'Log a sighting on the park record',goal:'Sign the park data policy, log your sighting with time and place, and pay the research permit on Base.',
 steps:[
  taskStep({label:'Sign the park data policy',spot:'d',npc:mkSign('Dr Iliya','Park researcher','#0B7A43',LK.man,'Park research'),
    intro:'Field data is shared under a policy. You sign before your first survey.',q:'What do you sign?',
    opts:[['The data policy, including where sightings may be shared',1],['A blank policy to fill in later',0]],
    wrong:'A blank policy lets anyone set the rules later. Sign the complete one.',
    say:'The policy is signed on the research record.'}),
  taskStep({label:'Log the sighting',spot:'e',npc:mkSign('Dr Iliya','Park researcher','#0B7A43',LK.man,'Park research'),
    intro:'You saw a bird you think is rare. Log it on the record with time and place.',q:'What do you log?',
    opts:[['What I saw, the time, the place, and that I am not sure of the species',1],['The rare species, to make the entry exciting',0]],
    wrong:'Overstating a sighting corrupts the research. Log what you saw and how sure you are.',
    say:'The sighting is logged honestly.'}),
  taskStep({label:'Pay the research permit',spot:'f',npc:mkSign('Mallam Ibrahim','Park permit','#2D6FB3',LK.clerk,'Permit'),
    intro:'The park permit is paid in USDC. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The park permit is on Base.',
    tx:{title:'Research permit',amt:1,btn:'Pay 1 USDC',done:'Permit paid',note:'Keep the permit with your field notes.',
        rows:x=>[['To','Park permit office',1],['Amount','1.00 USDC'],['Network',x]]},
    say:'The permit is paid and recorded.'})
 ]},
{id:'m77',n:77,city:'yobe',title:'Sell a seedling with a lot certificate',goal:'Mint a lot certificate for the seedling batch on Base, and check a buyer’s lot record before you guarantee it.',
 steps:[
  taskStep({label:'Name the variety with Zainab Lawal',spot:'g',npc:mkSign('Zainab Lawal','Date grower','#7a4a2e',LK.elder,'Nursery'),
    intro:'Each seedling batch has a variety and a lot number. Buyers want both.',q:'What goes on the lot label?',
    opts:[['The variety name and the lot number',1],['Only the word “date palm”',0]],
    wrong:'Without the variety and lot, a buyer cannot check the seedling later. Add both.',
    say:'The label names the variety and the lot.'}),
  taskStep({label:'Mint the lot certificate',spot:'h',npc:mkSign('Oluchi Mba','Nursery certificates','#2D6FB3',LK.clerk,'Certificates'),
    intro:'The certificate is minted for this lot, and sits on the record. Choose the network.',q:'Which network?',
    opts:[['Base',1],['Ethereum',0]],
    wrong:'The nursery certificate contract is on Base.',
    tx:{title:'Lot certificate',amt:1,btn:'Mint for 1 USDC',done:'Certificate minted',note:'The lot record is public.',
        rows:x=>[['Item','Date palm lot certificate'],['Price','1.00 USDC'],['Network',x]]},
    say:'The lot certificate is on the record.'}),
  taskStep({label:'Check a buyer’s earlier lot',spot:'i',npc:mkSign('Danjuma Saleh','New farmer','#C7457E',LK.man,'Farmer'),
    intro:'Farmer Ali bought seedlings from you before. You want to see how they grew.',q:'Where do you check?',
    opts:[['The lot records on the explorer, for his earlier certificate',1],['His word that they grew well',0]],
    wrong:'His word is not a record. The lot certificate shows what was sold and when.',
    say:'His earlier lot is on record. You can guarantee the new batch with confidence.'})
 ]},
{id:'m78',n:78,city:'yobe',title:'Document a cold-chain power outage',goal:'Record a cold-store outage, track the affected batch and temperature history, and document the corrective action before release.',
 steps:[
  taskStep({label:'Log the outage window',spot:'d',npc:mkSign('Zainab Gambo','Produce storage','#2D6FB3',LK.clerk,'Cold chain'),
    intro:'Power fails overnight at a cold store holding produce for several farms.',q:'What do you record first?',
    opts:[['The outage start and end times and the affected storage unit',1],['Only that the power was off',0]],
    wrong:'A timeline and affected unit help establish which stock may be at risk.',say:'The outage has a clear time and location record.'}),
  taskStep({label:'Match stock to the temperature history',spot:'e',npc:mkSign('Zainab Gambo','Produce storage','#2D6FB3',LK.clerk,'Cold chain'),
    intro:'Several batches were stored in the affected unit.',q:'How do you decide which batches need review?',
    opts:[['Match each batch to the recorded temperature history and exposure window',1],['Release all stock because the power is back',0]],
    wrong:'The impact depends on each batch’s exposure, not just the current power status.',say:'The affected batches are identified from the recorded conditions.'}),
  taskStep({label:'Record the corrective action',spot:'h',npc:mkSign('Zainab Gambo','Produce storage','#2D6FB3',LK.clerk,'Cold chain'),
    intro:'The temperature is stable again, but the batches still need review.',q:'What closes the incident?',
    opts:[['Record the inspection result and release or hold decision for each batch',1],['Delete the outage note after power returns',0]],
    wrong:'The record should show how each batch was assessed and what happened next.',say:'The incident trail records the checks and final disposition.'})
 ]},
{id:'m79',n:79,city:'zamfara',title:'Prepare a livestock movement record',goal:'Document the origin, animal count, destination and required health documents before livestock are moved between markets.',
 steps:[
  taskStep({label:'Record the origin and destination',spot:'d',npc:mkSign('Chisom Okeke','Movement desk','#2D6FB3',LK.clerk,'Animal movement'),
    intro:'A livestock owner is preparing to move a group of animals to another market.',q:'What belongs in the movement record?',
    opts:[['The owner, origin, destination, date and animal count',1],['Only the driver’s phone number',0]],
    wrong:'A traceable movement record needs to identify the animals and their route.',say:'The movement has a clear origin, destination and count.'}),
  taskStep({label:'Attach the required health documents',spot:'e',npc:mkSign('Chisom Okeke','Movement desk','#2D6FB3',LK.clerk,'Animal movement'),
    intro:'The destination market requires current veterinary documents.',q:'What should you check?',
    opts:[['The relevant signed health documents and their dates',1],['A verbal claim that the animals were checked',0]],
    wrong:'Required health evidence must be verifiable and current.',say:'The movement file contains the required health evidence.'}),
  taskStep({label:'Reconcile the count at arrival',spot:'o',npc:mkSign('Chisom Okeke','Movement desk','#2D6FB3',LK.clerk,'Animal movement'),
    intro:'The animals arrive at the destination market.',q:'What closes the movement record?',
    opts:[['Confirm the arrival count and record any discrepancy',1],['Reuse the departure count without checking',0]],
    wrong:'A final count helps identify losses or mistakes during transit.',say:'The movement record reflects the actual arrival count.'})
 ]},
{id:'m80',n:80,city:'zamfara',title:'Weigh-in, sign, and a fair payout',goal:'Sign the weigh-in for your milk deliveries, check the weekly payout against the record, and raise a gap before you accept.',
 steps:[
  taskStep({label:'Sign your weigh-in',spot:'a',npc:mkSign('Hajiya Rakiya','Milk cooperative chair','#C7457E',LK.woman,'Milk co-op'),
    intro:'Each morning’s milk is weighed and recorded. You sign the weigh-in for your deliveries.',q:'What do you sign?',
    opts:[['The weigh-in for my deliveries this week',1],['A blank weigh-in to be filled in by the chair',0]],
    wrong:'A blank weigh-in can be filled in by anyone. Sign only the weighed record.',
    say:'Your deliveries are signed in the weigh-in record.'}),
  taskStep({label:'Check the weekly payout',spot:'b',npc:mkSign('Hauwa Bello','Weekly payouts','#2D6FB3',LK.clerk,'Payouts'),
    intro:'Your payout is ready. It should match your weighed deliveries.',q:'What do you check?',
    opts:[['The payout against my signed weigh-in, litre by litre',1],['Only the total in the message',0]],
    wrong:'Check the payout against your weighed litres, not only the total.',
    say:'The payout matches your weigh-in.'}),
  taskStep({label:'Raise a gap before accepting',spot:'c',npc:mkSign('Hajiya Rakiya','Milk cooperative chair','#C7457E',LK.woman,'Milk co-op'),
    intro:'The payout is a little short for three mornings. You can raise it before you accept.',q:'What do you do?',
    opts:[['Raise it on the record, with the three weigh-ins, before accepting',1],['Accept it and say nothing',0]],
    wrong:'Accepting a short payout in silence lets gaps repeat. Raise it on the record first.',
    say:'The co-op reviews the three mornings and corrects the payout.'})
 ]},
{id:'m81',n:81,city:'kitcity',title:'The Final Gate: Enter the T3Kit Hub',goal:'Prove you can protect your wallet, verify on-chain activity, question unsafe permissions, and choose how you will contribute to Web3 before entering KitCity.',steps:[
 taskStep({label:'Protect your keys',spot:'a',npc:mkSign('Amina Okoro','T3Kit security guide','#1A7897',LK.clerk,'Wallet safety'),
  intro:'The city gates only open for people who understand the first rule of self-custody. A visitor asks you to send your recovery phrase so they can “activate” your wallet.',
  q:'What is the safe response?',
  opts:[['Never share the recovery phrase; use only the official wallet flow',1],['Send it to the visitor because they sound helpful',0]],
  wrong:'A recovery phrase can give someone control of the wallet. Legitimate support should never ask you to reveal it.',
  say:'Your keys remain yours. You know the difference between a public address and a secret.'}),
 taskStep({label:'Verify the transaction trail',spot:'c',npc:mkSign('Tobi Adeyemi','On-chain analyst','#2266A3',LK.guy,'Transaction explorer'),
  intro:'A contributor claims that a payment is complete and sends you a screenshot. The destination wallet and network are not shown.',
  q:'What should you verify before accepting the claim?',
  opts:[['Check the transaction hash, network, recipient and confirmed status in a trusted explorer',1],['Trust the screenshot and move on',0]],
  wrong:'A screenshot is not proof of an on-chain result. Verify the transaction details on the correct network.',
  say:'You can distinguish a claim from verifiable on-chain evidence.'}),
 taskStep({label:'Review the contract permissions',spot:'d',npc:mkSign('Nneka James','Protocol reviewer','#6A4FC8',LK.trader,'Smart contract review'),
  intro:'A new dApp asks for broad token approval and promises a guaranteed reward if you sign immediately.',
  q:'What is the responsible next step?',
  opts:[['Pause, inspect the app and approval scope, and reject anything you cannot verify',1],['Approve immediately because the reward expires soon',0]],
  wrong:'Urgency and guaranteed rewards are not proof of safety. Understand the permission and verify the application first.',
  say:'You have learned to question signatures instead of treating every prompt as harmless.'}),
 taskStep({label:'Choose how you will contribute',spot:'g',npc:mkSign('David Eze','T3Kit community steward','#0B7A70',LK.man,'Builder pathways'),
  intro:'KitCity is not an endpoint for speculation. It is a starting point for people who learn, build, explain, review and contribute.',
  q:'What is a useful first step into the ecosystem?',
  opts:[['Choose a learning path, practise the skills, and contribute work people can verify',1],['Chase rewards without understanding the tools or helping anyone',0]],
  wrong:'The Hub is designed to turn curiosity into competence and meaningful contribution.',
  say:'Your path is yours to choose: builder, analyst, creator, researcher or community contributor.'}),
 {label:'Cross the T3Kit threshold',spot:'h',npc:mkSign('T3Kit Hub Concierge','Final access steward','#D3A84C',LK.elder,'The Web3 World'),run(){
  talk(this.npc,'<div class="who"><span class="av" style="background:#D3A84C">81</span><div><b>The final gate is open.</b><small>KitCity · T3Kit Hub</small></div></div><p>You have travelled through the cities, learned the street-level rules, and reached the place they were preparing you for.</p><p><b>Welcome to the T3Kit Hub.</b> This is the Web3 World: learn with direction, build with care, verify what you use, and contribute to an open ecosystem.</p><p class="note">Your next chapter begins here. The game’s wallet and rewards remain simulated practice features.</p>',[{t:'Enter the Web3 World',f:finishStep}]);
 }}
]},
];
const MBY={}; MISSIONS.forEach(m=>{ MBY[m.id]=m; });
const loc=(name,role,color,look,sub)=>NPC(name,role,color,look,{body:color,a:'#ffffff',b:YELLOW,sub:sub});
const BADGES=['Wallet Starter','Swap Smart','Scam Spotter','Key Keeper','Safe Sender','Passport Holder','Community Voice','Cash-out Pro','Fare Payer','Club Skeptic','Gas Watcher','Escrow Trader','Off-ramp Pro','Depeg Calm','Mint Checker','Pump Spotter','Buffer Keeper','Pool Wise','Hardware Holder','Multisig Team','Wallet Splitter','Record Keeper','Phone Buyer','Phish Doubter','School Donor','Review Reader','Remit Careful','Lost Phone Calm','Invoice Checker','Crowdfund Skeptic','Gate Watcher','Ledger Clear','Oil Money Smart','Creek Careful','Tailor Shield','Bank Alert Calm','Loan Sense','Herd Wise','Flyer Doubter','Relief Guard','Gift Pool Wise','Clearance Check','Lucky Draw Skeptic','Cocoa Careful','Gold Audit','Tour Verifier','Lease Check','Supply Watch','Scholar Shield','Fee Guard','Rent Shield','Franchise Check','Loan Sense','Course Skeptic','Input Verified','Bureau Wise','PIN Guard','Bulk Buyer Check','Partner Guard','Recharge Safe','Abia Shoe Check','Land Title Check','Net Co-op','Produce Guard','Pump Verifier','Travel Licence','Seed Scheme Sense','Pond Skeptic','Job Fee Guard','Bond Checker','Permit Honest','Feed Invoice','Ticket Honest','Grove Trust','Cocoa Terms','Park Permit','Solar Limit','Export Office','Gold Licence','Cattle Terms','Genesis Access'];
/* Progress is tracked by completed missions and practice USDC. */
const isUnlocked=m=>{ const k=MISSIONS.indexOf(m); return k===0||!!P.done[MISSIONS[k-1].id]; };


const cityOrder=[...new Set(MISSIONS.map(m=>m.city))];
const cityMissions=city=>MISSIONS.filter(m=>m.city===city);
const isCityComplete=city=>{const ms=cityMissions(city);return ms.length>0&&ms.every(m=>!!P.done[m.id]);};
const isCityUnlocked=city=>{const ms=cityMissions(city);return ms.length>0&&isUnlocked(ms[0]);};
/* =====================  mission flow  ===================== */
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
  clearGroup(missionGroup); colliders.length=cityCols; smoke=[]; ents=[]; goal=null;
  const m=G.m,st=m.steps[G.i];
  const e=placeNPC(st.npc,SPOTS[st.spot]); e.talk=()=>st.run(); e.active=()=>true; ents.push(e); goal=e;
  for(const ex of (m.extras||[])){
    if(G.used[ex.id]) continue;
    const e2=placeNPC(ex.npc,ex.spot); e2.ex=ex; e2.talk=()=>ex.run(e2); e2.active=()=>!G.used[ex.id]; ents.push(e2);
  }
  updateHUD();
}
function startMission(id){
  const m=MBY[id];
  if(!m||!isUnlocked(m)){ toast('Finish the previous city journey first'); renderHub(); return; }
  $('#loadTxt').textContent=L('Loading '+CITIES[m.city].name+'\u2026','We dey load '+CITIES[m.city].name+'\u2026'); $('#loading').classList.remove('hidden');
  setTimeout(()=>{
    if(curCity!==m.city) buildCity(m.city); else setupBarks(CITIES[curCity]);
    G={m,i:0,correct:0,wrong:0,used:{},words:null,addr:null,slip:null};
    $('#hub').classList.add('hidden'); $('#hub').setAttribute('aria-hidden','true'); $('#title').classList.add('hidden'); $('#hud').classList.remove('hidden');
    S.phase='play'; closeSheet(); Snd.setMode('play'); lastLoc=''; resetPlayer(); loadStep();
    $('#loading').classList.add('hidden');
    briefing();
  },60);
}
function briefing(){
  const m=G.m,C=CITIES[m.city];
  openSheet('<div class="who"><span class="av" style="background:'+INK+'">'+m.n+'</span><div><b>'+'Mission '+m.n+': '+m.title+'</b><small>'+C.name+', '+C.tag+'</small></div></div><p>'+m.goal+'</p><ul class="pts">'+m.steps.map(s=>'<li>'+s.label+'</li>').join('')+'</ul>'+(m.n===1?'<p class="note">Move with the left stick or WASD. Hold Run or Shift to run. Tap Talk or press E to speak. Follow the arrow.</p>':'<p class="note">Follow the arrow to the next person. Watch for traffic.</p>'),
    [{t:'Start mission',f:closeSheet},{t:'Back to hub',g:1,f:exitToHub}]);
}
function finishStep(){
  closeSheet(); if(!G) return;
  G.i++;
  if(G.i>=G.m.steps.length){ completeMission(); return; }
  Snd.sfx('chime'); toast('Step complete'); loadStep();
}
function completeMission(){
  const m=G.m,first=!P.done[m.id],wrong=G.wrong||0;
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
  openSheet('<div class="who"><span class="av" style="background:'+INK+'">'+m.n+'</span><div><h3 style="margin:0">Mission '+m.n+' complete</h3><small>'+CITIES[m.city].name+' · '+m.title+'</small></div></div>'+
    (first?'<div class="kv"><span>Mission reward</span><b>+'+missionReward.toFixed(2)+' USDC</b></div><p class="note">'+(wrong===0?'Clean run reward collected.':'Completed with '+wrong+' wrong answer'+(wrong===1?'':'s')+'. Correct answers and mistakes have already adjusted your USDC balance.')+'</p>':'<p class="note">Replay complete. The first-clear reward has already been collected.</p>')+
    (m.city==='kitcity'?'<p><b>Welcome to the T3Kit Hub. The journey through Nigeria was your preparation; KitCity is the destination.</b></p>':'')+
    (cityComplete?'<p><b>All missions in '+CITIES[m.city].name+' are complete. Your city badge is available.</b></p>':'')+
    '<div class="kv"><span>Practice balance</span><b>'+P.usdc.toFixed(2)+' USDC</b></div>',btns);
}
function showCityBadge(city,after){
 const name=CITIES[city]?.name||city;
 openSheet('<div class="badge">'+badgeSVG('★',true,96)+'<div><h3 style="margin-top:0">'+name+' Pathfinder</h3><small>City journey completed</small></div></div><p>You completed both missions and earned the '+name+' city badge.</p>',[{t:'Continue journey',f:()=>{closeSheet();if(after)after();}}]);
}
function certificate(){
  const totalMissions=MISSIONS.length;
  const msg=encodeURIComponent(L('I finished all '+totalMissions+' KitCity missions and learned how to use a crypto wallet safely. Can you survive Naija with your wallet?','I don finish all '+totalMissions+' KitCity missions and I don learn how to use crypto wallet safely. You fit survive Naija with your wallet?'));
  openSheet('<div class="badge">'+badgeSVG('\u2605',true,96)+'<div><h3 style="margin-top:0">KitCity Graduate</h3><small>All '+totalMissions+' missions complete</small></div></div><p>You completed the full KitCity mission journey across all cities. Your practice balance is <b>'+P.usdc.toFixed(2)+' USDC</b>.</p>',
    [{t:'Back to hub',f:exitToHub}]);
  sheetEl.insertAdjacentHTML('beforeend',tx('<div class="row"><a class="btn" href="https://wa.me/?text='+msg+'" target="_blank" rel="noopener">Share on WhatsApp</a></div>'));
}
function exitToHub(){
  closeSheet(); S.phase='hub'; Snd.setMode('hub'); G=null;
  clearGroup(missionGroup); colliders.length=cityCols; smoke=[]; ents=[]; goal=null; beacon.visible=false;
  $('#hud').classList.add('hidden'); $('#title').classList.add('hidden');
  $('#hub').classList.remove('hidden'); $('#hub').setAttribute('aria-hidden','false');
  renderHub();
}
$('#pauseBtn').addEventListener('click',()=>{
  if(S.phase!=='play'||S.modal) return;
  openSheet('<h3>Paused</h3><p class="note">'+('Mission '+G.m.n)+': '+G.m.title+'</p>',[
    {t:'Resume',f:closeSheet},
    {t:'Restart mission',g:1,f:()=>startMission(G.m.id)},
    {t:'Back to hub',g:1,f:exitToHub}
  ]);
});

/* =====================  hub  ===================== */
const NG=[[2.7,6.4],[4.0,6.4],[5.0,5.4],[5.6,4.4],[6.8,4.3],[7.6,4.5],[8.3,4.6],[8.5,4.9],[9.0,5.8],[9.9,6.7],[10.6,7.0],[11.2,6.6],[11.8,7.2],[12.8,7.8],[13.2,9.0],[12.2,10.0],[11.7,10.9],[12.5,11.5],[13.7,11.9],[14.6,12.2],[14.2,13.0],[13.6,13.6],[12.0,13.5],[10.0,13.3],[8.5,13.0],[7.0,13.0],[5.5,13.6],[4.2,13.4],[3.6,11.9],[3.8,11.0],[3.7,10.0],[3.1,9.0],[2.8,7.9]];
const mx=lon=>(lon-2.2)*20,my=lat=>(14.2-lat)*20;
function mapSVG(){
  const pts=NG.map(p=>mx(p[0]).toFixed(1)+','+my(p[1]).toFixed(1)).join(' '); let pins='';
  for(const k of cityOrder){ const c=CITIES[k],x=mx(c.lon),y=my(c.lat),open=isCityUnlocked(k),sel=k===hubCity,done=cityMissions(k).filter(m=>P.done[m.id]).length,total=cityMissions(k).length;
    pins+='<g data-a="city" data-v="'+k+'" role="button" aria-label="'+c.name+(open?'':' locked')+'" tabindex="0" style="cursor:'+(open?'pointer':'not-allowed')+'">'+(sel?'<circle cx="'+x+'" cy="'+y+'" r="8.5" fill="none" stroke="'+(k==='kitcity'?'#F4C76B':'#e8f7ff')+'" stroke-width="'+(k==='kitcity'?2.2:1.4)+'"/>':'')+'<circle cx="'+x+'" cy="'+y+'" r="'+(sel?4.6:(k==='kitcity'?4:3.1))+'" fill="'+(k==='kitcity'?'#F4C76B':done===total?'#72E0B0':open?'#53DDF0':'#536273')+'" stroke="'+(sel||k==='kitcity'?'#fff':'#142333')+'" stroke-width="'+(sel||k==='kitcity'?1.7:1.1)+'"/><title>'+(k==='kitcity'?'FINAL DESTINATION · T3Kit Hub':c.name)+' · '+done+'/'+total+' missions</title></g>'; }
  return '<section class="map-card"><div class="map-card-head"><div><span>EXPLORE NIGERIA</span><h2>City Map</h2></div><b>'+cityOrder.length+' cities</b></div><svg viewBox="0 0 270 220" class="map" role="img" aria-label="Interactive map of Nigeria. Tap a city marker to view its missions"><defs><linearGradient id="landFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#153747"/><stop offset="100%" stop-color="#172432"/></linearGradient></defs><rect width="270" height="220" rx="14" fill="#0b131d"/><g stroke="#fff" stroke-opacity=".035" stroke-width=".7">'+Array.from({length:10},(_,i)=>'<path d="M'+(i*30)+' 0V220"/>').join('')+Array.from({length:8},(_,i)=>'<path d="M0 '+(i*30)+'H270"/>').join('')+'</g><polygon points="'+pts+'" fill="url(#landFill)" stroke="#2c6578" stroke-width="1.6" stroke-linejoin="round"/>'+pins+'</svg><div class="map-legend"><span><i class="map-dot unlocked"></i>Unlocked</span><span><i class="map-dot completed"></i>Completed</span><span><i class="map-dot locked"></i>Locked</span></div></section>';
}
function missionCard(m){
  const un=isUnlocked(m),dn=!!P.done[m.id];
  return '<div class="card'+(un?'':' lock')+(m.city==='kitcity'?' final-destination':'')+'"><div class="ch">'+badgeSVG(m.n,false,46)+'<div><b>'+'Mission '+m.n+': '+m.title+'</b><small>'+m.goal+'</small></div></div><div class="cf"><span>'+(dn?'Completed':'Up to +0.50 USDC')+'</span>'+(un?'<button class="btn brand" data-a="play" data-v="'+m.id+'" type="button">'+(dn?'Replay':'Play')+'</button>':'<span>Finish mission '+(m.n-1)+' first</span>')+'</div></div>';
}
function renderHub(){
  $('#hubTop').innerHTML=tx('<span class="wm"><img class="header-logo" src="https://i.postimg.cc/6pLt0sn3/file-000000006e348210b7a8c70bc4ed899d.png" alt="KitCity" /></span><div class="lvl"><b>Practice wallet</b><div class="balance-line"><strong>'+P.usdc.toFixed(2)+' USDC</strong><small>'+Object.keys(P.done).filter(k=>P.done[k]).length+' missions completed</small></div></div>');
  document.querySelectorAll('#nav [data-v="kitlab"]').forEach(b=>b.remove());
  if(hubTab==='kitlab') hubTab='cityhub';
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===hubTab));
  let h='';
  if(hubTab==='missions'){
    const C=CITIES[hubCity];
    h+=mapSVG()+'<div class="map-selected"><div><span>SELECTED CITY</span><b>'+C.name+'</b><small>'+C.tag+'</small></div><strong>'+cityMissions(hubCity).filter(m=>P.done[m.id]).length+' / '+cityMissions(hubCity).length+' missions</strong></div>';
    if(hubCity==='kitcity') h+='<section class="destination-card"><span class="destination-kicker">THE FINAL DESTINATION</span><h2>T3Kit Hub</h2><p>Every city prepared you for this. KitCity is the Web3 World: a premium campus for learning, building, verification, creators, open finance and community contribution.</p><div class="destination-pillars"><span>LEARN</span><span>BUILD</span><span>VERIFY</span><span>CONTRIBUTE</span></div></section>';
    h+='<div class="chips">'+cityOrder.map(k=>'<button class="chip'+(k===hubCity?' on':'')+'" data-a="city" data-v="'+k+'" type="button" '+(isCityUnlocked(k)?'':'disabled')+'>'+CITIES[k].name+(isCityUnlocked(k)?'':' · Locked')+'</button>').join('')+'</div>';
    h+=cityMissions(hubCity).map(m=>missionCard(m)).join('');
  } else if(hubTab==='cityhub'){
    hubTab='missions';
    const C=CITIES[hubCity];
    h+=mapSVG()+'<div class="map-selected"><div><span>SELECTED CITY</span><b>'+C.name+'</b><small>'+C.tag+'</small></div><strong>'+cityMissions(hubCity).filter(m=>P.done[m.id]).length+' / '+cityMissions(hubCity).length+' missions</strong></div>'+cityMissions(hubCity).map(m=>missionCard(m)).join('');
  } else if(hubTab==='passport'){
    const allMissions=MISSIONS;
    const done=allMissions.filter(m=>P.done[m.id]).length,all=done===allMissions.length;
    const completedCities=cityOrder.filter(city=>isCityComplete(city)).length;
    h+='<div class="h2">Mission badges</div><div class="grid2">'+allMissions.map((m,i)=>'<div class="bd'+(P.done[m.id]?' earned':' off')+'">'+badgeSVG(m.n,!!P.done[m.id],64)+'<b>Mission '+m.n+': '+m.title+'</b><span class="badge-status">'+(P.done[m.id]?'ACHIEVEMENT EARNED':'NOT EARNED YET')+'</span></div>').join('')+'</div>';
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
    h+='<div class="card"><div class="ch"><div><b>Reset progress</b><small>Erases badges, mission progress and your practice wallet on this device.</small></div></div><div class="cf"><span>'+(resetArm?'Tap again to confirm':'')+'</span><button class="btn line" data-a="reset" type="button">'+(resetArm?'Yes, erase everything':'Reset')+'</button></div></div>';
    h+='<p class="soft">Prototype: wallets, balances and payments are simulated. Rates are samples. Nothing here is financial advice.</p>';
  }
  $('#hubBody').innerHTML=tx(h);
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
    Store.del(KEY); Object.assign(P,{wallet:null,usdc:0,ngn:0,done:{},dodged:0,fell:0,scores:{},web3:null}); save(); resetArm=false; hubCity='lagos'; hubTab='missions'; renderHub(); toast('Progress erased');
  }
});
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
  $('#startBtn').textContent=signedIn?'Continue to KitCity':(authMode==='signup'?'Create account & enter KitCity':'Sign in & enter KitCity');
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
  button.disabled=true;
  button.textContent='Securing your account…';
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
    button.disabled=false;
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
$('#startBtn').addEventListener('click',submitPlayerName);
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
  }).catch(()=>updateAuthButton());
}else updateAuthButton();
function applyLang(){
  document.documentElement.lang=P.lang==='pcm'?'pcm':'en';
  document.querySelectorAll('[data-t]').forEach(el=>{ if(!el.dataset.en) el.dataset.en=el.textContent; el.textContent=(P.lang==='pcm'&&el.dataset.pcm)?el.dataset.pcm:tr(el.dataset.en); });
  document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('on',b.dataset.lang===P.lang));
  updateAuthButton();
  if(G) updateHUD();
  renderHub();
}
$('#title').addEventListener('click',e=>{ const b=e.target.closest('[data-lang]'); if(!b) return; P.lang=b.dataset.lang; save(); applyLang(); Snd.unlock(); Snd.sfx('click'); });

/* =====================  input  ===================== */
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

/* =====================  collisions  ===================== */
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
function carHit(dt){ if(hitCd>0)hitCd=Math.max(0,hitCd-dt);
  if(fallTimer>0){fallTimer=Math.max(0,fallTimer-dt);player.rotation.z=fallLean*1.25*Math.min(1,(1.5-fallTimer)*8);if(fallTimer===0){player.rotation.z=0;toast('Back on your feet. Watch the traffic.');}return;}
  player.rotation.z=0;if(hitCd>0)return;const p=player.position;
  for(const c of cars){const hx=c.axis==='x'?c.hl:c.hw,hz=c.axis==='x'?c.hw:c.hl,cx=c.m.position.x,cz=c.m.position.z;
    if(Math.abs(p.x-cx)<hx+.9&&Math.abs(p.z-cz)<hz+.9){
      if(c.axis==='x')p.z=cz+(p.z>=cz?1:-1)*(hz+3.5);else p.x=cx+(p.x>=cx?1:-1)*(hx+3.5);
      hitCd=2.2;fallTimer=1.5;fallLean=(p.x-cx)>=0?1:-1;shake=1.2;
      const missionToRestart=G?G.m.id:null;
      const penalty=Math.min(.50,P.usdc);
      P.usdc=Math.round((P.usdc-penalty)*100)/100;save();updateHUD();Snd.sfx('bump');
      resolve(p,1);resolve(p,1);
      if(P.usdc<=1e-9&&missionToRestart){
        toast('No USDC left. Mission failed — restarting from the beginning.');
        startMission(missionToRestart);
      } else {
        toast(penalty>0?'Traffic collision · −'+penalty.toFixed(2)+' USDC':'Traffic collision · no USDC left to deduct');
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

/* =====================  loop  ===================== */
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
  for(const e of ents){
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