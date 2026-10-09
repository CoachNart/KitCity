import * as THREE from 'three';

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
const P=Object.assign({wallet:null,usdc:0,ngn:0,xp:0,done:{},dodged:0,fell:0,low:false,music:true,sfx:true,lang:'en',pl:'',name:'',scores:{},web3:null},Store.get(KEY,{}));
if(!P.done||typeof P.done!=='object') P.done={};
function save(){ Store.set(KEY,{wallet:P.wallet,usdc:P.usdc,ngn:P.ngn,xp:P.xp,done:P.done,dodged:P.dodged,fell:P.fell,low:P.low,music:P.music,sfx:P.sfx,lang:P.lang,pl:P.pl,name:P.name,scores:P.scores,web3:P.web3}); }
function playerName(){ return (P.name||'Player').trim(); }
function personalize(html){ return String(html==null?'':html).replace(/Agent Kit/g,playerName()).replace(/agent kit/g,playerName()); }

/* =====================  sound (synthesised, no files)  ===================== */

/* =====================  YouTube soundtrack  ===================== */
const MUSIC_QUEUES={
  afrobeat:{label:'Naija Afrobeats',videos:['kc4PfiRWpog','ulmVmlNoSL8','LZ6B1xACdxM']},
  'lagos':{label:"Lagos · Naija Afrobeats",videos:["kc4PfiRWpog","ulmVmlNoSL8","LZ6B1xACdxM"]},
  'abuja':{label:"Abuja · Naija Afrobeats",videos:["kc4PfiRWpog","ulmVmlNoSL8","qbefFtgUVTY"]},
  'ph':{label:"Port Harcourt · Niger Delta / Ijaw",videos:["l-_FcHIS4Yo","k6eE3c70hgg","kc4PfiRWpog"]},
  'benin':{label:"Benin City · Edo / Delta grooves",videos:["l-_FcHIS4Yo","k6eE3c70hgg","ulmVmlNoSL8"]},
  'calabar':{label:"Calabar · Efik / Ibibio",videos:["qbefFtgUVTY","ulmVmlNoSL8","kc4PfiRWpog"]},
  'jos':{label:"Jos · Plateau / regional Naija",videos:["DqUd72pK15Y","l-_FcHIS4Yo","kc4PfiRWpog"]},
  'ibadan':{label:"Ibadan · Yoruba / Fuji",videos:["bcs_jFdPQn4","zzhKmRovdMY","kc4PfiRWpog"]},
  'enugu':{label:"Enugu · Igbo highlife / Afrobeat",videos:["Uyr1c0pkpas","W41TT8g3MnQ","kc4PfiRWpog"]},
  'kano':{label:"Kano · Hausa / Arewa",videos:["qseIbxXwlmg","UuumEqJKQ9I","kc4PfiRWpog"]},
  'kaduna':{label:"Kaduna · Hausa / Arewa",videos:["qseIbxXwlmg","UuumEqJKQ9I","ulmVmlNoSL8"]},
  'maiduguri':{label:"Maiduguri · Kanuri / Hausa",videos:["qseIbxXwlmg","UuumEqJKQ9I","LZ6B1xACdxM"]},
  'owerri':{label:"Owerri · Igbo highlife / Afrobeat",videos:["Uyr1c0pkpas","W41TT8g3MnQ","ulmVmlNoSL8"]},
  'aba':{label:"Aba · Igbo highlife / Afrobeat",videos:["Uyr1c0pkpas","W41TT8g3MnQ","LZ6B1xACdxM"]},
  'umuahia':{label:"Umuahia · Igbo highlife / Afrobeat",videos:["Uyr1c0pkpas","W41TT8g3MnQ","qbefFtgUVTY"]},
  'awka':{label:"Awka · Igbo highlife / Afrobeat",videos:["Uyr1c0pkpas","nMXLMe4_x68","kc4PfiRWpog"]},
  'onitsha':{label:"Onitsha · Igbo highlife / Afrobeat",videos:["Uyr1c0pkpas","nMXLMe4_x68","ulmVmlNoSL8"]},
  'asaba':{label:"Asaba · Anioma / Delta",videos:["l-_FcHIS4Yo","k6eE3c70hgg","LZ6B1xACdxM"]},
  'uyo':{label:"Uyo · Efik / Ibibio",videos:["qbefFtgUVTY","ulmVmlNoSL8","LZ6B1xACdxM"]},
  'ikot-ekpene':{label:"Ikot Ekpene · Efik / Ibibio",videos:["qbefFtgUVTY","LZ6B1xACdxM","kc4PfiRWpog"]},
  'yenagoa':{label:"Yenagoa · Niger Delta / Ijaw",videos:["l-_FcHIS4Yo","k6eE3c70hgg","qbefFtgUVTY"]},
  'warri':{label:"Warri · Urhobo / Itsekiri",videos:["l-_FcHIS4Yo","kc4PfiRWpog","ulmVmlNoSL8"]},
  'makurdi':{label:"Makurdi · Tiv / Middle Belt",videos:["DqUd72pK15Y","l-_FcHIS4Yo","ulmVmlNoSL8"]},
  'ilorin':{label:"Ilorin · Yoruba / Fuji",videos:["bcs_jFdPQn4","zzhKmRovdMY","ulmVmlNoSL8"]},
  'akure':{label:"Akure · Yoruba / Fuji",videos:["bcs_jFdPQn4","zzhKmRovdMY","LZ6B1xACdxM"]},
  'ado-ekiti':{label:"Ado-Ekiti · Yoruba / Fuji",videos:["bcs_jFdPQn4","zzhKmRovdMY","qbefFtgUVTY"]},
  'osogbo':{label:"Osogbo · Yoruba / Fuji",videos:["bcs_jFdPQn4","yUUsKekKQLM","kc4PfiRWpog"]},
  'abeokuta':{label:"Abeokuta · Yoruba / Fuji",videos:["bcs_jFdPQn4","yUUsKekKQLM","ulmVmlNoSL8"]},
  'lokoja':{label:"Lokoja · Igala / Confluence",videos:["DqUd72pK15Y","l-_FcHIS4Yo","LZ6B1xACdxM"]},
  'lafia':{label:"Lafia · Hausa / Arewa",videos:["qseIbxXwlmg","UuumEqJKQ9I","qbefFtgUVTY"]},
  'bauchi':{label:"Bauchi · Hausa / Arewa",videos:["qseIbxXwlmg","i1uEVNMSalo","kc4PfiRWpog"]},
  'gombe':{label:"Gombe · Hausa / Arewa",videos:["qseIbxXwlmg","i1uEVNMSalo","ulmVmlNoSL8"]},
  'damaturu':{label:"Damaturu · Kanuri / Hausa",videos:["qseIbxXwlmg","i1uEVNMSalo","LZ6B1xACdxM"]},
  'jalingo':{label:"Jalingo · Fulfulde / North-East",videos:["qseIbxXwlmg","i1uEVNMSalo","qbefFtgUVTY"]},
  'yola':{label:"Yola · Fulfulde / North-East",videos:["qseIbxXwlmg","ULjXLxJa74w","kc4PfiRWpog"]},
  'sokoto':{label:"Sokoto · Hausa / Arewa",videos:["qseIbxXwlmg","ULjXLxJa74w","ulmVmlNoSL8"]},
  'katsina':{label:"Katsina · Hausa / Arewa",videos:["qseIbxXwlmg","ULjXLxJa74w","LZ6B1xACdxM"]},
  'birnin-kebbi':{label:"Birnin Kebbi · Hausa / Arewa",videos:["qseIbxXwlmg","ULjXLxJa74w","qbefFtgUVTY"]},
  'minna':{label:"Minna · Nupe / Arewa",videos:["qseIbxXwlmg","ddXZE34DFbQ","kc4PfiRWpog"]},
  'dutse':{label:"Dutse · Hausa / Arewa",videos:["qseIbxXwlmg","ddXZE34DFbQ","ulmVmlNoSL8"]},
  'gusau':{label:"Gusau · Hausa / Arewa",videos:["qseIbxXwlmg","ddXZE34DFbQ","LZ6B1xACdxM"]},
  'kafanchan':{label:"Kafanchan · Southern Kaduna",videos:["qseIbxXwlmg","ddXZE34DFbQ","qbefFtgUVTY"]},
  'damboa':{label:"Damboa · Kanuri / Hausa",videos:["UuumEqJKQ9I","i1uEVNMSalo","kc4PfiRWpog"]}
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
      const run=!!(a&&a.run),side=(a&&a.side)?1:-1,v=((a&&a.vol)||1)*(run?.42:.32);
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
    sfx(n,a){ if(!ctx||!on.sfx) return; const f=SFX[n]; if(f) f(ctx.currentTime,a); },
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
function getLogoMat(){
  if(logoMat) return logoMat;
  const c=document.createElement('canvas'); c.width=128; c.height=64; const g=c.getContext('2d');
  g.fillStyle=INK; g.font='900 46px "Arial Black",Impact,sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('KN',64,34);
  const t=new THREE.Texture(c); t.needsUpdate=true;
  logoMat=new THREE.MeshBasicMaterial({map:t,transparent:true}); return logoMat;
}
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
    districts:['Gwange','Bolori','Maiduguri Central','Shehuri','Pompomari','Bulumkutu','Ngomari','Hausari','Mairi']}
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
function pickKind(C){ let t=0; C.fleet.forEach(f=>{ t+=f[1]; }); let r=RN()*t; for(const f of C.fleet){ r-=f[1]; if(r<=0) return f[0]; } return C.fleet[0][0]; }
function makeVehicle(kind,C){
  const pl=C.pal;
  if(kind==='danfo') return {m:buildDanfo(pl.danfo[0],pl.danfo[1]),hl:4.9,hw:1.95,sp:[8,12]};
  if(kind==='police') return {m:buildPolice(),hl:4.8,hw:2,sp:[10,14]};
  if(kind==='keke') return {m:buildKeke(pl.keke[0],pl.keke[1]),hl:2.8,hw:1.4,sp:[6.5,9.5]};
  if(kind==='okada') return {m:buildOkada(pk(['#C8402A','#2D6FB3','#0B7A43','#F2F2F2','#1B1C20'])),hl:2.2,hw:.9,sp:[11,16]};
  if(kind==='truck') return {m:buildTruck(pk(['#C8402A','#2D6FB3','#E9E4DA','#0B7A43']),pk(['#E4572E','#F6B21A','#6b6f78'])),hl:9,hw:2.6,sp:[5,8]};
  if(kind==='suv') return {m:buildSedan(pk(['#2b2b30','#F2F2F2','#8a8d93']),pl.stripe,true),hl:4.8,hw:2,sp:[9,13]};
  return {m:buildSedan(pk(pl.sedan),pl.stripe,false),hl:4.5,hw:1.8,sp:[9,14]};
}
function placeCar(c){
  if(c.axis==='x'){ c.m.position.set(c.pos,0,c.lane); c.m.rotation.y=c.dir>0?0:Math.PI; }
  else { c.m.position.set(c.lane,0,c.pos); c.m.rotation.y=c.dir>0?-Math.PI/2:Math.PI/2; }
}
function addCar(axis,k,dir,C){
  const road=k*R,kind=pickKind(C),v=makeVehicle(kind,C);
  const lane=axis==='x'?road+(dir>0?3.6:-3.6):road+(dir>0?-3.6:3.6);
  trafficGroup.add(v.m);
  const c={m:v.m,axis,dir,lane,pos:rr(-225,225),speed:rr(v.sp[0],v.sp[1]),hl:v.hl,hw:v.hw,kind}; placeCar(c); cars.push(c);
}
function updateCars(dt){
  for(const c of cars){
    let sp=c.speed;
    for(const o of cars){
      if(o===c||o.axis!==c.axis||o.lane!==c.lane||o.dir!==c.dir) continue;
      const gap=(o.pos-c.pos)*c.dir,free=gap-c.hl-o.hl;
      if(gap>0&&free<8) sp=Math.min(sp,free<3?0:o.speed*.9);
    }
    c.pos+=c.dir*sp*dt;
    if(c.pos*c.dir>240) c.pos=-240*c.dir;
    placeCar(c);
  }
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
  while(made<8&&tries++<200){ const b=pk(blocks),side=Math.floor(RN()*4),pt=ringPoint(b,side,rr(-12,12)); if(!ringFree(pt.x,pt.z,4)) continue; ringTaken.push({x:pt.x,z:pt.z,r:2}); addHawker(pt,side); made++; }
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
function buildCity(key){
  const C=CITIES[key]; curCity=key;
  clearGroup(cityGroup); clearGroup(trafficGroup); texs.forEach(t=>t.dispose()); texs=[];
  colliders.length=0; buildings.length=0; cars=[]; walkers=[];
  RN=mulberry(C.seed); dxReset(); LOOKSC=CITY_LOOKS[key]||LOOKS;
  applyLook(key,C);
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
    for(const sx of [-25,25])for(const sz of [-25,25]) if(RN()<C.palm&&!nearSpecial(cx+sx,cz+sz,8)) addTree(cx+sx,cz+sz,C);
  }
  streetDetails(C,blocks); roadDecals(C,blocks);
  dxFlush(C);
  cityCols=colliders.length;
  for(let k=-3;k<=3;k++)for(const axis of ['x','z'])for(const dir of [1,-1]){
    const n=(k===0||k===-1)?2:(RN()<.5?1:0);
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
  for(let q=0;q<20;q++){ const sp=spotWalk(); if(!sp) continue; const sg=RN()<.5?1:-1; mkW(sp.x,sp.z,sp.dx*sg,sp.dz*sg,rr(2,3.2)); }
  for(let q=0;q<6;q++){
    const sp=spotWalk(); if(!sp) continue; const sg=RN()<.5?1:-1,spd=rr(2,2.7),rem=rr(10,30);
    const a=mkW(sp.x,sp.z,sp.dx*sg,sp.dz*sg,spd,{type:'pair',rem:rem}),b=mkW(sp.x+sp.dz*1.1,sp.z+sp.dx*1.1,sp.dx*sg,sp.dz*sg,spd,{type:'pair',rem:rem,ph:a.ph+.6});
    a.partner=b; b.partner=a;
  }
  let made=0,tr=0;
  while(made<10&&tr++<120){
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
  const f=on?BRAND:'#555960',st=on?INK:'#2a2c31';
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 120 120" aria-hidden="true"><polygon points="60,6 108,33 108,87 60,114 12,87 12,33" fill="'+f+'" stroke="'+st+'" stroke-width="6" stroke-linejoin="round"/><text x="60" y="76" text-anchor="middle" font-family="Arial Black,Impact,sans-serif" font-weight="900" font-size="52" fill="'+(on?INK:'#2a2c31')+'">'+n+'</text></svg>';
}

/* =====================  HUD  ===================== */
function updateHUD(){
  if(G){
    $('#mTitle').textContent=tr(G.m.explore?G.m.title:'Mission '+G.m.n+': '+G.m.title);
    $('#steps').innerHTML=G.m.steps.map((s,i)=>'<li class="'+(G.i>i?'done':(G.i===i?'now':''))+'">'+tr(s.label)+'</li>').join('');
  }
  $('#wallet').innerHTML=P.wallet?('<b>'+P.usdc.toFixed(2)+' USDC</b>'+(P.ngn>0?fmtN(P.ngn)+' token':short(P.wallet))):tr('No wallet yet');
}

/* =====================  missions  ===================== */
const NPC=(name,role,color,look,stall,sign)=>({name,role,color,look,stall,sign});
const MAMA=NPC('Softstorm','KitCity wallet kiosk','#0897A8',LK.mama,{body:'#0897A8',a:'#ffffff',b:BRAND,sub:'KitCity wallet'});
const SUYA=NPC('Dark','Best suya on the street',EMBER,LK.suya,{body:'#8E2F1B',a:'#ffffff',b:EMBER,grill:true});
const GUY=NPC('Joseph','Says they are your friend','#6a3fb5',LK.guy,null,'Free USDC giveaway!'); GUY.signBg='#6a3fb5'; GUY.signFg='#ffffff';
const ALHAJA=NPC('Tessa','Bureau de Change','#2D6FB3',LK.trader,{body:'#2D6FB3',a:'#ffffff',b:'#2D6FB3',sub:'Bureau de Change'});
const CLERK=NPC('Unique','Swap counter','#1f4f82',LK.clerk,{body:'#1f4f82',a:'#ffffff',b:YELLOW,sub:'Swap counter'});
const BRIGHT=NPC('Smrt huntr','Shows you a text message','#6a3fb5',LK.guy,null,'Check this text'); BRIGHT.signBg='#6a3fb5'; BRIGHT.signFg='#ffffff';
const HASSAN=NPC('Web3 Esta','Messaged you online','#C7457E',LK.man,null,'New DM'); HASSAN.signBg='#C7457E'; HASSAN.signFg='#ffffff';
const CHIOMA=NPC('Semi','Shows you a post','#E4572E',LK.woman,null,'Airdrop alert'); CHIOMA.signBg='#E4572E'; CHIOMA.signFg='#ffffff';
const KEEPER=NPC('Kore','Guardian of secrets','#5a3a22',LK.elder,{body:'#5a3a22',a:'#ffffff',b:GREEN,sub:'Recovery vault'});
const NOTARY=NPC('Love','Checks your memory','#2D6FB3',LK.clerk,{body:'#2D6FB3',a:'#ffffff',b:YELLOW,sub:'Notary'});
const MUSA=NPC('Essa','Market trader','#C7457E',LK.man,{body:'#C7457E',a:'#ffffff',b:'#E7D27A',sub:'Fresh yam'});
const REG=NPC('White Coach','Passport registry','#0B7A43',LK.woman,{body:'#0B7A43',a:'#ffffff',b:BRAND,sub:'KitCity Passport'});
const MINT=NPC('Leemah','Passport mint','#0897A8',LK.clerk,{body:'#0897A8',a:'#ffffff',b:BRAND,sub:'Free mint'});
const CHAIR=NPC('Cybersage','Community leader','#6a3fb5',LK.trader,{body:'#6a3fb5',a:'#ffffff',b:BRAND,sub:'Community'});
const HALL=NPC('Abdul','Counts the votes','#2D6FB3',LK.clerk,{body:'#1f4f82',a:'#ffffff',b:BRAND,sub:'Town hall'});
const ADA=NPC('David','P2P trader','#E4572E',LK.woman,{body:'#E4572E',a:'#ffffff',b:YELLOW,sub:'P2P desk'});
const TOLA=NPC('Craftore','Bank agent','#0B7A43',LK.clerk,{body:'#0B7A43',a:'#ffffff',b:'#ffffff',sub:'Bank agent'});

/* ---- extra mission characters ---- */
const mkSign=(name,role,color,look,sign)=>{ const n=NPC(name,role,color,look,null,sign); n.signBg=color; n.signFg='#ffffff'; return n; };
const OXNIGHT=mkSign('OxNight','Knows the street rules','#1f4f82',LK.man,'Share or keep?');
const MOON=mkSign('Moyo Akin','Rate watcher','#6a3fb5',LK.woman,'Check the quote');
const CRYPT=mkSign('The Cryptonian','Scam veteran','#0B7A43',LK.guy,'Spot the red flag');
const NNADI=mkSign('Joseph Nnadi','Backup advisor','#2D6FB3',LK.clerk,'Where to keep it');
const DON=mkSign('The Don','Careful sender','#5a3a22',LK.elder,'Test first');
const PRAISE=mkSign('Mcbond','Signature checker','#C7457E',LK.trader,'Read before signing');
const BIGSAM=mkSign('K','Community organiser','#E4572E',LK.man,'Read the proposal');
const LUNAX=mkSign('LunaX','Trusted trader','#0897A8',LK.woman,'Name must match');

/* one question step: the character explains, asks, and gives feedback (right answer = +15 XP) */
function askStep(o){
  return {label:o.label,spot:o.spot,npc:o.npc,run(){
    const opts=shuffle(o.opts);
    talk(o.npc,'<p>'+o.intro+'</p><p><b>'+o.q+'</b></p>',
      opts.map(x=>({t:x[0],f:()=>{
        const good=x[1]===1;
        Snd.sfx(good?'good':'error'); if(good){ G.correct++; G.bonus+=15; }
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
const STEP_MOON=askStep({label:'Check the quote with John Jonathan',spot:'g',npc:MOON,
  intro:'Rates move all day, and every swap has a fee. Compare the quote with the rate before you confirm anything.',
  q:'The swap screen shows far fewer naira than the rate you were told. What is the smart move?',
  opts:[['Cancel and check the quote and fee',1],['Confirm anyway, it is probably fine',0],['Raise slippage so it goes through',0]],
  good:'Right. A big gap can mean a high fee or a bad price. Raising slippage only makes a bad price easier to accept.',
  bad:'That is how people lose money. When the quote looks wrong, stop and check it before you confirm.'});
const STEP_CRYPT=askStep({label:'Test your instincts with The Cryptonian',spot:'a',npc:CRYPT,
  intro:'I have watched scammers for years. They change the story, but the trick is nearly always the same.',
  q:'Which of these is a real red flag?',
  opts:[['Anyone asking you to send first so you can receive more',1],['An app that shows your balance',0],['A block explorer link to check a payment',0]],
  good:'Right. Real giveaways and real support never need you to pay first, and they never rush you.',
  bad:'Those are normal. The danger sign is someone who asks you to send first, or who pushes you to hurry.'});
const STEP_NNADI=askStep({label:'Ask Joseph Nnadi where to keep your phrase',spot:'e',npc:NNADI,
  intro:'You have written your 12 words down. Now the question is where they live.',
  q:'Where is the safest place to keep your recovery phrase?',
  opts:[['On paper, somewhere private and safe',1],['A screenshot in my gallery',0],['In my notes app or a chat with myself',0]],
  good:'Right. Paper cannot be hacked from far away. Keep it private, and consider a second copy in another safe place.',
  bad:'Phones sync to the cloud and get hacked or lost. Anything digital can leak. Paper in a safe place is best.'});
const STEP_DON=askStep({label:'Hear The Don on test payments',spot:'b',npc:DON,
  intro:'Money sent on a blockchain cannot be pulled back. That is why careful people never send blind.',
  q:'You are about to send money to an address you have not used before. What do you do first?',
  opts:[['Send a small test and check it arrives',1],['Send everything, blockchains are fast',0],['Trust the address because it came in a message',0]],
  good:'Right. A small test proves the address works before you risk the full amount.',
  bad:'Too risky. A wrong or fake address cannot be fixed afterwards. Test small first, and compare the whole address.'});
const STEP_PRAISE=askStep({label:'Learn from Mcbond what to check before signing',spot:'c',npc:PRAISE,
  intro:'Signing feels harmless because it is quick. But what you sign decides what a site can do.',
  q:'A site asks you to sign. What should you check?',
  opts:[['That it only proves I own the wallet and mentions no transfers or permissions',1],['Nothing, signing is always free and safe',0],['Only how nice the site looks',0]],
  good:'Right. Read it first. Be careful with anything that mentions transfers, approvals or unlimited access.',
  bad:'Some signatures give a site permission over your tokens. If you cannot understand it, do not sign it.'});
const STEP_BIGSAM=askStep({label:'Talk to K before you vote',spot:'e',npc:BIGSAM,
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
      G.used[e.ex.id]=true; P.fell++; save(); hideEnt(e); Snd.sfx('error');
      talk(NPC('Nothing came back','The giveaway guy is gone','#B3261E',LK.guy),'<p>Nobody doubles your money, and crypto payments cannot be reversed. A real giveaway never asks you to send first.</p><p class="note">This is practice, so your balance is safe. In real life that money would be gone for good.</p>',[{t:'Keep going',f:closeSheet}]);
    })},
    {t:'Walk away',g:1,f:()=>{
      G.used[e.ex.id]=true; G.bonus+=20; P.dodged++; save(); hideEnt(e); Snd.sfx('good');
      talk(NPC('Good call','You spotted the scam',GREEN,LK.guy),'<p>Anyone who asks you to send money first, so you can receive more, is running a scam. Walking away was right. Bonus +20 XP.</p>',[{t:'Keep going',f:closeSheet}]);
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
        Snd.sfx(good?'good':'error'); if(good){ G.correct++; G.bonus+=15; P.dodged++; } else { P.fell++; }
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

const MISSIONS=[
{id:'m1',n:1,city:'lagos',title:'Your first wallet',goal:'Create a wallet, receive USDC and make your first payment.',xp:100,
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
  {label:'Pay Dark 1 USDC',spot:'j',npc:SUYA,run(){
    needFunds(1);
    confirmTx(SUYA,{title:'Pay for suya',rows:[['Pay to',short(SUYA_ADDR),1],['Amount','1.00 USDC'],['Network fee',FEE0]],note:'Payments on a blockchain cannot be undone. Always check the address before you pay.',btn:'Pay 1 USDC',
      after:h=>{ P.usdc=Math.max(0,P.usdc-1); save(); updateHUD();
        talk(SUYA,'<h3>Payment confirmed</h3><div class="kv"><span>Receipt</span><b class="mono">'+short(h)+'</b></div><div class="kv"><span>Balance</span><b>'+P.usdc.toFixed(2)+' USDC</b></div><p>Dark hands you a hot stick. Your receipt is permanent and public, so anyone can check that you paid.</p>',[{t:'Continue',f:finishStep}]); }});
  }}
 ],
 extras:[{id:'guy',spot:SPOTS.x1,npc:GUY,run:giveawayGuy}]
},
{id:'m2',n:2,city:'lagos',title:'Bureau de Change',goal:'Learn rates, fees and slippage by swapping USDC for a naira token.',xp:120,
 steps:[
  {label:'Ask Tessa for today\u2019s rate',spot:'e',npc:ALHAJA,run(){
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
      G.slip=slip;
      const gross=2*RATE,fee=gross*0.005,recv=gross-fee,min=recv*(1-slip);
      confirmTx(CLERK,{title:'Confirm your swap',rows:[['You pay','2.00 USDC'],['Rate','1 USDC = '+fmtN(RATE)],['Fee (0.5%)',fmtN(fee)],['Slippage limit',(slip*100).toFixed(1)+'%'],['You receive at least',fmtN(min)],['Network fee',FEE0]],btn:'Swap now',
        after:()=>{ P.usdc=Math.max(0,P.usdc-2); P.ngn+=recv; if(slip<=0.005) G.bonus+=10; save(); updateHUD();
          talk(CLERK,'<h3>Swap complete</h3><div class="kv"><span>Received</span><b>'+fmtN(recv)+' token</b></div><p>'+(slip<=0.005?'Smart. A tight limit protects you from a bad price.':'This worked, but a wide limit lets the price move against you. Keep slippage low unless you have a reason.')+'</p>',[{t:'Continue',f:finishStep}]); }});
    }
  }}
 ]
},
{id:'m3',n:3,city:'abuja',title:'Spot the scam',goal:'Recognise phishing, fake support and fake airdrops before they cost you.',xp:130,
 steps:[
  scamStep({label:'Read the security text',spot:'c',npc:BRIGHT,from:'KitCity Security',msg:'URGENT: Your wallet will be locked in 1 hour. Verify now at kitcity-verify.net and enter your 12-word recovery phrase.',
    opts:[['Enter my recovery phrase to keep my wallet',0],['Ignore the link and open the official app myself',1],['Reply and ask them to hold my wallet',0]],
    good:'Nobody real will ever ask for your recovery phrase. Not support, not the app, not a bank. Fake urgency like \u201C1 hour\u201D is how scammers rush you.',
    bad:'That is phishing. Anyone with your recovery phrase can empty your wallet and nothing can be reversed. Real services never ask for it.'}),
  scamStep({label:'Answer the stranger\u2019s DM',spot:'n',npc:HASSAN,from:'Web3 Esta (not verified)',msg:'Hi, I am KitCity support. I saw your problem. Connect your wallet to my site and share your screen so I can fix it.',
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
{id:'m4',n:4,city:'abuja',title:'Back up your wallet',goal:'Learn what a recovery phrase is and how to keep it safe.',xp:130,
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
        G.bonus+=right*10;
        talk(NOTARY,'<h3>'+right+' of 3 correct</h3><p>'+(right===3?'Perfect. In real life, check your paper backup the same way, and store a copy in a second safe place.':'Your paper backup is what saves you. Write it clearly, check it twice, and keep a second copy somewhere safe.')+'</p>',[{t:'Continue',f:finishStep}]);
        return;
      }
      const i=idxs[q],correct=G.words[i];
      const wrong=shuffle(WORDS.filter(w=>G.words.indexOf(w)<0)).slice(0,2);
      talk(NOTARY,'<p>Question '+(q+1)+' of 3: what was word number <b>'+(i+1)+'</b>?</p>',shuffle([correct].concat(wrong)).map(w=>({t:w,f:()=>{
        const ok=w===correct; if(ok) right++;
        talk(NOTARY,'<h3>'+(ok?'Correct':'Not quite')+'</h3><p>'+(ok?'Yes, it was <b>'+correct+'</b>.':'Word '+(i+1)+' was <b>'+correct+'</b>. In real life you would read it from your paper backup.')+'</p>',[{t:'Next',f:()=>{ q++; ask(); }}]);
      }})));
    }
    ask();
  }}
 ]
},
{id:'m5',n:5,city:'kano',title:'Pay a friend, safely',goal:'Check addresses properly and send a small test first.',xp:140,
 steps:[
  {label:'Get Essa\u2019s address at the motor park',spot:'i',npc:MUSA,run(){
    if(!G.addr) G.addr='0x'+hex(20);
    talk(MUSA,'<p>Boss, I am rushing to my stall in the market across town. Take my address, then bring my 1 USDC for the yam there:</p><span class="addr">'+G.addr+'</span><p class="note">Address mistakes cannot be undone. Funds sent to the wrong address are lost.</p>',[{t:'Copy their address',f:()=>{ toast('Address copied'); finishStep(); }}]);
  }},
  STEP_DON,
  {label:'Pay Essa at their market stall',spot:'o',npc:MUSA,run(){
    if(!G.addr) G.addr='0x'+hex(20);
    needFunds(1);
    const fakeA=addrMutate(G.addr,12,16),fakeB=addrMutate(G.addr,36,40);
    const opts=shuffle([[G.addr,1],[fakeA,0],[fakeB,0]]);
    talk(MUSA,'<p>You find Essa at their stall. Their phone shows:</p><span class="addr">'+G.addr+'</span><p>Your clipboard has an address. <b>which one matches their, character for character?</b></p>',
      opts.map(o=>({t:o[0],m:1,f:()=>{
        if(o[1]!==1){ talk(MUSA,'<h3>Close, but wrong</h3><p>That address looks similar but is not the same. Scammers make lookalike addresses that match the start and end. Compare the whole address, not just the edges.</p>',[{t:'Try again',f:()=>MISSIONS[4].steps[2].run()}]); return; }
        talk(MUSA,'<h3>Right address</h3><p>Now decide how to send. A small test payment proves the address works before you risk the full amount.</p>',[
          {t:'Send 0.10 USDC as a test first',f:()=>sendPart(0.10,true)},
          {t:'Send all 1.00 USDC now',g:1,f:()=>sendPart(1.00,false)}
        ]);
      }})));
    function sendPart(amt,test){
      confirmTx(MUSA,{title:test?'Send a test':'Send payment',rows:[['To',short(G.addr),1],['Amount',amt.toFixed(2)+' USDC'],['Network fee',FEE0]],btn:'Send '+amt.toFixed(2)+' USDC',
        after:()=>{
          P.usdc=Math.max(0,P.usdc-amt); save(); updateHUD();
          if(test){
            G.bonus+=10;
            talk(MUSA,'<h3>Essa got it</h3><p>They confirm the test arrived. Now send the rest.</p>',[{t:'Send remaining 0.90 USDC',f:()=>sendRest()}]);
          } else {
            talk(MUSA,'<h3>Sent</h3><p>It worked this time. For larger amounts, always send a small test first.</p>',[{t:'Continue',f:finishStep}]);
          }
        }});
    }
    function sendRest(){
      confirmTx(MUSA,{title:'Send the rest',rows:[['To',short(G.addr),1],['Amount','0.90 USDC'],['Network fee',FEE0]],btn:'Send 0.90 USDC',
        after:()=>{ P.usdc=Math.max(0,P.usdc-0.9); save(); updateHUD(); talk(MUSA,'<h3>All paid</h3><p>Essa thanks you. Test first, then send the rest. That habit saves money.</p>',[{t:'Continue',f:finishStep}]); }});
    }
  }}
 ]
},
{id:'m6',n:6,city:'kano',title:'Mint your KitCity Passport',goal:'Understand signing messages and why unlimited approvals are risky.',xp:140,
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
        {t:'Approve',f:()=>{ P.fell++; save(); talk(MINT,'<h3>Dangerous choice</h3><p>An unlimited approval lets that site take all your USDC at any time, even later. Only approve exact amounts, only for sites you trust, and revoke old permissions.</p>',[{t:'Continue',f:finishStep}]); }},
        {t:'Reject',g:1,f:()=>{ G.bonus+=15; P.dodged++; save(); talk(MINT,'<h3>Smart</h3><p>Minting was free and needed no spending permission. When a site asks for unlimited access to your money, reject it. Bonus +15 XP.</p>',[{t:'Continue',f:finishStep}]); }}
      ])});
  }}
 ]
},
{id:'m7',n:7,city:'ph',title:'Vote in the community',goal:'Learn how community votes work and how to read a proposal.',xp:150,
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
{id:'m8',n:8,city:'ph',title:'Cash out safely',goal:'Sell USDC for naira with a peer, and never release before you are paid.',xp:200,
 steps:[
  {label:'Post your sell offer',spot:'l',npc:ADA,run(){
    talk(ADA,'<p>Peer-to-peer means you trade with another person. The platform holds your USDC in escrow while they pay your bank. You release only after you see the money.</p><div class="kv"><span>You sell</span><b>1.00 USDC</b></div><div class="kv"><span>Price</span><b>'+fmtN(1480)+'</b></div>',[
      {t:'Post my offer',f:()=>busy(ADA,'Finding a buyer\u2026',1400,()=>talk(ADA,'<h3>Buyer found</h3><p>Chidi accepted your offer. Your USDC is locked in escrow. They have 15 minutes to pay your bank account.</p>',[{t:'Continue',f:finishStep}]))}
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
      {t:'Release the USDC now',f:()=>talk(TOLA,'<h3>Stop, this is a trap</h3><p>Fake receipts are the most common cash-out scam. A screenshot proves nothing. If you release first, the buyer keeps your USDC and your bank shows no money.</p>',[{t:'Check my bank app',f:bank}])},
      {t:'Check my own bank app first',g:1,f:()=>{ G.bonus+=15; bank(); }}
    ]);
  }}
 ]
}
];
const MBY={}; MISSIONS.forEach(m=>{ MBY[m.id]=m; });
const loc=(name,role,color,look,sub)=>NPC(name,role,color,look,{body:color,a:'#ffffff',b:YELLOW,sub:sub});
/* =====================  fresh short street missions =====================
   The old post-four-city lesson/quiz catalogue is intentionally removed.
   Each later city gets one distinct, playable street scenario with a local mentor.
   The interaction pattern follows Lagos: walk to a person, hear the problem,
   choose a practical action, get a short response, and continue. No lesson decks.
*/
const EXPLORE=[];
const routeSpots=Object.keys(SPOTS).filter(k=>k!=='x1');
/*
 * Later journeys are authored as distinct local stories, not a recycled task catalogue.
 * Each mission is a playable NPC decision using the same talk/choice/progression primitives
 * as the original eight missions. There is no field-review or task-submission phase.
 * Each city's final story points into the next city without copying its identity.
 */
const CITY_JOURNEYS=[{"city":"owerri","name":"Adaeze","role":"Radio host","site":"Eke Ukwu square","nextCity":"Aba","handoff":"A live call-in exposes a fake giveaway spreading across town.","missions":[["The On-Air Giveaway","A caller says listeners must send a small token payment to unlock a prize. The station is live and people are already sending funds.",["Tell listeners to pay quickly before the giveaway closes","Pause the giveaway and verify it with the named project through its official channel","Ask the caller to DM the station a recovery phrase"],1,"You stop the rush, verify the source, and keep listeners from turning a rumour into losses.","A live audience makes the pressure worse, not the claim more trustworthy."],["The Missing Broadcast Fund","A community event wallet shows a transfer as pending, but the organiser wants to pay the venue again.",["Check the transaction status and recipient on the same network before paying twice","Trust the screenshot and send another payment","Switch networks and assume the first transfer will appear"],0,"The original transfer is checked before another payment is considered. No duplicate payment is made.","A screenshot or a different network view cannot prove the first transfer failed."]]},{"city":"aba","name":"Ikenna","role":"Ariaria shoe maker","site":"Ariaria market","nextCity":"Umuahia","handoff":"A supplier dispute over a digital invoice leads to a cooperative asking for a safer payment routine.","missions":[["The Altered Leather Invoice","A shoe maker notices the wallet address on a supplier's new invoice differs by two characters from last week's verified invoice.",["Pay the new address because the logo matches","Compare the full address with the supplier through a known phone number","Ask the invoice sender to confirm by replying to the same email"],1,"The address is confirmed through a separate trusted channel before money moves.","A familiar logo and a reply from the same compromised channel are not independent verification."],["The Shared Workshop Wallet","Three artisans share a wallet for bulk materials, but one person wants everyone to use the same recovery phrase in a group chat.",["Post the phrase so the whole cooperative can access it","Give the phrase only to the group administrator","Set up an agreed wallet-access process without sharing recovery words in chat"],2,"The cooperative agrees on a safer access process instead of spreading a secret across chats.","A group chat multiplies exposure; a shared phrase is not a proper team-access plan."]]},{"city":"umuahia","name":"Chidinma","role":"Online food vendor","site":"Isi Gate","nextCity":"Awka","handoff":"A supplier's payment confusion reveals that a clean receipt matters as much as a successful transfer.","missions":[["The Wrong Token Receipt","A customer sends a receipt for a token with the right name but a different contract address from the one the vendor accepts.",["Accept it because the token name looks right","Verify the token contract and received asset before handing over the order","Ask the customer to crop the contract details out"],1,"The vendor checks the actual asset, not just its displayed name, before releasing the order.","Token names can be copied; the contract and received asset matter."],["The Rush-Hour Refund","A customer says a refund is urgent and sends a link that asks the vendor to connect a wallet and sign a message.",["Open the link and sign to unlock the refund","Use the vendor's known payment provider or official app to handle the refund","Share the wallet recovery words with the customer service account"],1,"The refund is handled through a known route; no unexplained signature is approved.","A refund should not require a stranger's link or an unexplained wallet signature."]]},{"city":"awka","name":"Obinna","role":"Campus device builder","site":"Unizik junction","nextCity":"Onitsha","handoff":"A campus prototype needs real users, so the next stop is where small businesses depend on reliable stock payments.","missions":[["The Demo Wallet Trap","A student demo asks participants to enter the recovery phrase from their everyday wallet to test a feature.",["Use a separate test wallet and test assets for the demo","Enter the real phrase but delete it afterwards","Send the phrase privately to the student developer"],0,"The demo uses a separate test wallet, keeping real funds and secrets out of the experiment.","Deleting a secret later cannot undo exposure."],["The Club's Token Vote","A campus club vote is shared as a screenshot, but the deadline and proposal text are missing.",["Vote based on the screenshot's summary","Find the official proposal, rules and voting window before deciding","Ask a random member to vote from your account"],1,"Members read the source proposal and confirm eligibility and timing before voting.","A screenshot is not the complete proposal or a substitute for your own vote."]]},{"city":"onitsha","name":"Ngozi","role":"Spare-parts importer","site":"Main Market","nextCity":"Asaba","handoff":"A shipment payment is delayed, and the trader needs to distinguish a real network delay from a forged proof.","missions":[["The Container Release Fee","A seller claims customs release requires a new crypto fee sent to a personal address outside the agreed channel.",["Pay immediately so the shipment is not lost","Verify the fee with the official shipping or customs contact using known details","Ask the seller to split the fee into three smaller transfers"],1,"The fee is verified independently before any new payment is made.","Splitting an unverified payment does not make it legitimate."],["The Duplicate Transfer","A buyer's transfer is still pending while the seller's assistant sends a second address and asks for a fresh payment.",["Check the first transaction and confirm the agreed recipient before deciding","Send to both addresses to be safe","Cancel the first by sharing the recovery phrase"],0,"The first transaction is traced and the agreed recipient is confirmed before taking further action.","Sending twice can turn a temporary delay into a permanent loss."]]},{"city":"asaba","name":"Oghene","role":"Dispatch coordinator","site":"Summit Road","nextCity":"Uyo","handoff":"A delivery route is disrupted by a fake dispatch notice, forcing the team to verify payments and instructions.","missions":[["The Driver's QR Code","A driver receives a QR code said to redirect a delivery deposit to a new wallet.",["Scan and approve whatever wallet prompt appears","Verify the new payment details with dispatch through the established channel","Forward the QR code to every driver to ask if it looks real"],1,"Dispatch confirms the payment destination independently before the driver acts.","A QR code hides its destination until scanned and can be replaced."],["The Fuel Advance","A fleet wallet has enough for fuel only if the network fee is ignored.",["Enter the amount and hope the fee is small","Check the total debit, including the network fee, before confirming","Borrow a stranger's wallet to avoid the fee"],1,"The coordinator checks the complete cost before approving the fuel transfer.","The amount sent is not always the total amount deducted."]]},{"city":"uyo","name":"Mfon","role":"Fashion designer","site":"Itam market","nextCity":"Ikot Ekpene","handoff":"A designer's preorder campaign gets attention, but one copied account tries to redirect customers.","missions":[["The Copycat Preorder Page","A new social page copies the designer's photos and posts a different wallet address for deposits.",["Pin the new address because the page looks professional","Compare the handle and payment address against the designer's known official channel","Ask customers to send recovery phrases as proof of payment"],1,"Customers are directed to the verified page and the impersonating address is not promoted.","Copied branding is easy to reproduce; the actual account and payment destination must be checked."],["The Deposit Ledger","Two customers claim they paid the same preorder, but only one transfer is visible in the shop wallet.",["Release both orders using their screenshots","Match each transaction to the correct network, recipient and amount","Ask one customer to pay again without checking"],1,"Each order is matched to a verified incoming transaction before goods are reserved.","A screenshot alone does not establish that the correct wallet received funds."]]},{"city":"ikot-ekpene","name":"Anietie","role":"Craft cooperative lead","site":"Craft market","nextCity":"Yenagoa","handoff":"A craft cooperative wants transparent shared funds without exposing one person's wallet secrets.","missions":[["The Festival Contribution","A committee member posts a recovery phrase in the cooperative group so everyone can track the festival fund.",["Remove the secret from circulation and set up a transparent balance/transaction view instead","Copy the phrase into a shared document","Keep the message because the group is private"],0,"The group uses visible transaction records for transparency without exposing control of the wallet.","A private group is still a place where secrets can be copied, forwarded or compromised."],["The Unapproved Treasurer","A message says the treasurer has changed and gives a new address, but no committee decision is recorded.",["Use the new address because it arrived from a familiar name","Confirm the change with the committee through its established process","Send a test amount to the new address and assume that proves authority"],1,"The cooperative confirms who is authorised before updating its payment details.","A successful test transfer proves only that an address can receive funds, not that it belongs to the authorised treasurer."]]},{"city":"yenagoa","name":"Tari","role":"Seafood exporter","site":"Swali waterfront","nextCity":"Warri","handoff":"A buyer across the river disputes a payment while the seafood shipment is time-sensitive.","missions":[["The Tide-Time Payment","A buyer claims payment is complete but provides a transaction hash for a different network.",["Check the hash on the matching network and confirm recipient, amount and status","Trust the buyer's message because the boat is waiting","Release the goods after seeing any explorer result"],0,"The payment is checked on the correct network before the shipment is released.","A transaction hash on the wrong network cannot confirm the payment you are expecting."],["The Cold-Store Cash-Out","A cash-out agent says the payout is ready but asks the exporter to send a separate unlock fee to a personal wallet.",["Pay the fee to avoid losing the buyer","Verify all charges with the agreed provider and reject an unlisted personal-wallet fee","Share account credentials so the agent can finish it"],1,"The exporter checks the provider's published charges and refuses an unverified extra payment.","An unexpected fee to a personal wallet is not proof that a payout exists."]]},{"city":"warri","name":"Efe","role":"Workshop owner","site":"Effurun roundabout","nextCity":"Makurdi","handoff":"A mechanic's savings circle needs to settle a parts purchase without letting urgency bypass the group's rules.","missions":[["The Parts-Order Approval","A supplier sends a token approval request for a wallet used only to pay a parts invoice.",["Approve unlimited spending to save time","Inspect the spender and requested allowance; reject access unrelated to the invoice","Approve it because the supplier has worked with the shop before"],1,"The workshop declines unnecessary token access and uses a payment method that matches the invoice.","A familiar supplier does not need unlimited access to a wallet."],["The Savings Circle Vote","One member says a proposal passed, but the shared group has no record of the vote or its terms.",["Release the funds based on the member's voice note","Check the agreed vote record, proposal details and required approvals","Let the loudest member decide"],1,"The circle follows its agreed approval process and records the decision before funds move.","A claim that a vote passed is not the same as a verifiable decision."]]},{"city":"makurdi","name":"Terna","role":"Grain market broker","site":"Modern Market","nextCity":"Ilorin","handoff":"A grain deal changes price after a quote is shown, so the broker must protect both sides from a bad swap.","missions":[["The Changing Grain Quote","A buyer's token-to-naira quote changes sharply between preview and confirmation.",["Confirm anyway because the first quote looked good","Refresh the quote and compare final output, fees and price impact against the agreed limit","Increase slippage to the maximum without reading the new price"],1,"The broker rechecks the current quote and refuses an unacceptable price change.","A preview is not a guarantee; a wider slippage limit can permit a worse outcome."],["The Market-Day Ledger","A cooperative sees a large balance increase but cannot match it to a transaction.",["Treat the balance change as final proof of payment","Trace the incoming transaction and match sender, amount and network","Delete the old ledger to avoid confusion"],1,"The ledger is reconciled against the transaction record before the grain is handed over.","A displayed balance alone may not explain the source or status of funds."]]},{"city":"ilorin","name":"Sade","role":"Adire fabric trader","site":"Oja-Oba","nextCity":"Akure","handoff":"A fabric order has two nearly identical token listings, and the trader must avoid accepting a counterfeit asset.","missions":[["The Look-Alike Fabric Token","Two assets use the same ticker in a payment app, but their contract addresses differ.",["Choose the one with the larger logo","Verify the accepted contract address from the project's trusted source","Accept either token because the ticker matches"],1,"The trader checks the contract address, not the ticker or artwork.","Names, tickers and images can be copied by counterfeit tokens."],["The Buyer Who Overpaid","A buyer says an overpayment entitles them to a refund to a third-party wallet.",["Refund to the new address immediately","Verify the actual incoming payment and follow the shop's established refund route","Send the overpayment to any address the buyer gives"],1,"The trader verifies the payment and refunds only through the established process.","A claimed overpayment can be used to redirect funds to an unrelated address."]]},{"city":"akure","name":"Tunde","role":"Phone repair technician","site":"Oba Adesida Road","nextCity":"Ado-Ekiti","handoff":"A customer brings a phone with wallet alerts and needs help securing it without surrendering control.","missions":[["The Repair-Shop Recovery Phrase","A customer asks the technician to type their recovery words into a laptop to restore a wallet.",["Explain that the owner should enter secrets privately on a trusted device; never collect the phrase","Type the words while the customer watches","Photograph the phrase in case the repair fails"],0,"The technician protects the customer's control and never handles the recovery phrase.","A repair shop should never collect or store a customer's wallet secret."],["The Unknown Wallet App","The phone has two wallet apps with similar names and one requests accessibility permissions it doesn't need.",["Keep the app that promises the fastest recovery","Verify the publisher and permissions; remove suspicious software through trusted device guidance","Give the app the recovery phrase to see whether it works"],1,"The technician checks the app's provenance and permissions before trusting it.","Unexpected permissions and look-alike apps can expose sensitive information."]]},{"city":"ado-ekiti","name":"Bisi","role":"Digital illustrator","site":"Fajuyi creative corner","nextCity":"Osogbo","handoff":"A client wants to mint commissioned art, but the artwork's rights and minting contract are unclear.","missions":[["The Commissioned Art Mint","A client says paying for an illustration automatically grants them every copyright and commercial right.",["Mint it immediately and let the token decide the rights","Read the written licence and agree on usage rights before minting","Assume wallet ownership transfers copyright automatically"],1,"The illustrator and client agree on rights before any mint goes live.","Owning a token does not automatically transfer copyright or every usage right."],["The Surprise Mint Fee","A mint screen displays a price but adds a network fee and a separate royalty amount at confirmation.",["Confirm because the headline price was acceptable","Review the full cost breakdown and cancel if it differs from the agreed terms","Approve a second transaction without reading it"],1,"The illustrator checks every cost before confirming the mint.","The headline price is not the complete cost of a mint."]]},{"city":"osogbo","name":"Dayo","role":"Festival ticket organiser","site":"Oja Oba","nextCity":"Abeokuta","handoff":"A festival ticket link is copied by a scammer during a busy sales rush.","missions":[["The Fake Festival Mint","A ticket buyer finds two mint pages with identical posters and different domains.",["Choose the page that sells out fastest","Open the ticket link from the festival's verified channel and check the actual domain","Connect the wallet to both pages to compare"],1,"The organiser points buyers to the verified domain and warns against the copycat page.","A familiar poster does not authenticate a website."],["The Ticket Transfer Dispute","A buyer says a ticket transfer is complete, but the organiser sees no token at the destination.",["Check the transfer on the correct network and confirm the destination address","Accept a cropped screenshot as final","Ask the buyer to share their recovery phrase"],0,"The organiser verifies the onchain transfer before marking the ticket delivered.","A cropped image can omit the details needed to verify delivery."]]},{"city":"abeokuta","name":"Kemi","role":"Adire studio owner","site":"Kuto market","nextCity":"Lokoja","handoff":"A wholesale order crosses several payment steps; the studio must know which network each step belongs to.","missions":[["The Wrong-Network Deposit","A wholesaler sends an asset on a network the studio wallet does not support for that token.",["Assume the funds will appear automatically","Check the exact network and supported recovery path before taking further action","Send more funds to force the balance to update"],1,"The studio identifies the network first and avoids making the problem larger with another transfer.","The same address format can exist across networks; network details still matter."],["The Supplier's Bridge Link","A supplier sends an unofficial bridge link to move funds between networks before delivery.",["Use the link because the supplier is waiting","Navigate to the bridge from its official documentation and verify assets, fees and route","Share the wallet phrase so the supplier can bridge it"],1,"The studio verifies the bridge and route from official information before proceeding.","A link supplied in a rushed message is not proof that a bridge is legitimate."]]},{"city":"lokoja","name":"Ibrahim","role":"Interstate transport operator","site":"Lagos–Abuja park","nextCity":"Lafia","handoff":"A transport association is coordinating fares across routes and needs a reliable record of a disputed settlement.","missions":[["The Route-Fare Settlement","A driver claims the association wallet received fares, but the record uses the wrong chain explorer.",["Check the transaction on the chain the wallet actually used","Count the driver's screenshots as cash","Ask every passenger to pay again"],0,"The association checks the matching network and records the actual settlement.","An explorer for another network cannot validate this transfer."],["The Offline Queue","A network outage delays several fare payments, and drivers are tempted to retry every transfer.",["Retry all payments at once","Separate confirmed, pending and failed transactions before deciding what to resend","Ignore the queue and clear the app data"],1,"Drivers reconcile the queue first and only act on verified transaction states.","Blind retries can create duplicate payments when pending transactions later confirm."]]},{"city":"lafia","name":"Hauwa","role":"Cooperative accountant","site":"Central market","nextCity":"Bauchi","handoff":"A cooperative's monthly report shows a token balance that differs from its naira ledger.","missions":[["The Balance-Reconciliation Meeting","The report mixes token units with naira values and the totals do not match.",["Treat the biggest number as the true balance","Separate token quantity, decimals, conversion rate and fees before reconciling","Delete the mismatched rows"],1,"The accountant reconciles quantities and valuation separately, with assumptions recorded.","Token units and naira valuation are different measurements."],["The Emergency Treasury Request","A member asks for an emergency transfer but the destination and approving members are missing.",["Send first and record it later","Confirm recipient and follow the cooperative's required approval process","Let the requester approve their own transfer"],1,"The transfer waits for recipient verification and the agreed approvals.","An emergency does not remove basic treasury controls."]]},{"city":"bauchi","name":"Zainab","role":"Clinic supply coordinator","site":"Wunti market","nextCity":"Gombe","handoff":"A clinic supply fund must distinguish an actual supplier payment from a fake proof during a tight delivery window.","missions":[["The Medicine Supply Receipt","A supplier's receipt has the right amount but names a different recipient wallet.",["Release the supplies because the amount matches","Verify the recipient and transaction status against the purchase order","Ask the supplier to send a recovery phrase"],1,"The coordinator matches recipient, amount and status before recording the invoice as paid.","The right amount sent to the wrong recipient is still the wrong payment."],["The Stablecoin Budget","A budget assumes a stablecoin can always be redeemed one-for-one immediately.",["Promise the exact naira value without checking","Check current redemption terms, liquidity and any conversion charges before budgeting","Ignore the difference because the token says stable"],1,"The budget states the actual assumptions and risks instead of treating the peg as a guarantee.","A stable label does not guarantee instant redemption at a fixed value."]]},{"city":"gombe","name":"Musa","role":"Building materials merchant","site":"Main market","nextCity":"Damaturu","handoff":"A contractor wants to borrow against token collateral and the merchant must understand the risk before accepting the arrangement.","missions":[["The Collateral Warning","A borrower shows a healthy collateral balance but debt has grown and the liquidation threshold is close.",["Focus only on the collateral's current value","Review collateral, debt, interest and liquidation threshold together","Assume prices cannot fall during the contract"],1,"The risk is assessed using the full position, not one reassuring number.","Collateral value alone does not show how close a position is to liquidation."],["The Oracle Gap","A lending dashboard displays a price with no timestamp or source.",["Treat it as a live quote","Check the feed source and freshness before relying on the valuation","Use yesterday's screenshot as proof"],1,"The merchant refuses to rely on a price until its source and timestamp are known.","A stale or unexplained price can hide material risk."]]},{"city":"damaturu","name":"Fatima","role":"Phone accessories wholesaler","site":"Monday Market","nextCity":"Jalingo","handoff":"A wholesale buyer is targeted by an urgent fake wallet update while the shop is closing.","missions":[["The Wallet Update Alert","A text says the shop's wallet will be frozen unless the owner installs an attached update file.",["Install the attachment before the deadline","Open the wallet's official site or app store independently and verify the notice","Send the sender the recovery phrase to unlock the wallet"],1,"The owner verifies the alert through a trusted route and avoids the attachment.","Threats and deadlines are common pressure tactics; the attachment is unverified."],["The Late-Night Support Call","A caller claiming to be support wants remote access to the phone to recover a payment.",["Allow remote access because the caller knows the wallet brand","End the call and contact official support using independently found details","Read out the one-time code and recovery words"],1,"The owner keeps control of the device and starts a support request through the official route.","A brand name and knowledge of a wallet do not establish the caller's identity."]]},{"city":"jalingo","name":"Ladi","role":"Community network organiser","site":"Central market meeting point","nextCity":"Yola","handoff":"A community group is voting on a shared connectivity fund and must make the decision transparent.","missions":[["The Connectivity Fund Vote","The proposal promises a network upgrade but has no budget, milestone owner or delivery date.",["Approve it because connectivity is popular","Ask for a budget, accountable owner and measurable milestones before voting","Let the proposer cast every vote"],1,"The group asks for a plan it can assess and later measure.","A popular goal is not enough to evaluate how shared funds will be used."],["The Unrecorded Decision","A voice note says the vote passed, but nobody can find the final tally or execution record.",["Treat the voice note as the official result","Check the agreed voting record and record the decision before funds move","Send funds to the first person who asks"],1,"The community verifies the result and records the decision before execution.","A claim about a vote is not a verifiable vote record."]]},{"city":"yola","name":"Mariam","role":"Livestock market coordinator","site":"Jimeta market","nextCity":"Sokoto","handoff":"A livestock buyer and seller disagree about a cross-network payment at the end of market day.","missions":[["The Two-Chain Payment","The seller sees a successful transaction on one chain, while the buyer expects funds on another.",["Check the official bridge or transfer status and the destination chain","Declare payment complete from the source-chain screen alone","Send the buyer's funds to a random bridge address"],0,"Both sides verify the source and destination status before closing the deal.","Source-chain success does not always mean the destination transfer is complete."],["The Escrow Release","A counterparty pressures the coordinator to release escrow based on a payment notification.",["Release on the notification alone","Check the actual settlement and follow the escrow's release rules","Send escrow to the counterparty to prove trust"],1,"The coordinator follows verifiable settlement conditions instead of pressure.","Notifications can be delayed, forged or unrelated to the actual settlement."]]},{"city":"sokoto","name":"Bello","role":"Leather goods exporter","site":"Kasuwar Kara","nextCity":"Katsina","handoff":"An overseas buyer asks for a new token contract to settle a leather shipment.","missions":[["The Export Token Swap","A buyer proposes a token with a familiar name but provides no official contract reference.",["Accept the token based on its name","Verify the contract through trusted project sources and confirm the shop can accept it","Pay a listing fee to unlock the token"],1,"The exporter confirms the exact asset and acceptance route before agreeing to payment.","A familiar token name is not enough to establish identity or redeemability."],["The Exchange Rate Promise","An agent guarantees a fixed cash-out rate but refuses to show fees or the provider.",["Accept the promise and send the tokens","Request the full quote, provider details and payout terms before committing","Share the wallet credentials so the agent can quote accurately"],1,"The exporter evaluates the full terms before committing funds.","A rate without fees, provider and payout terms is not a complete quote."]]},{"city":"katsina","name":"Rabi","role":"Farm-input retailer","site":"Central market","nextCity":"Birnin Kebbi","handoff":"Farmers are buying inputs together, and a spoofed supplier tries to change the cooperative's destination address.","missions":[["The Seed-Fund Address Change","A message changes the cooperative's payment address just before a bulk seed purchase.",["Use the newest message without checking","Verify the change with the known supplier contact and the cooperative's approval process","Send half to each address"],1,"The cooperative verifies the change before paying the supplier.","Splitting a payment between an old and unverified address increases risk rather than resolving it."],["The Reward-Token Offer","A seller offers bonus tokens if the retailer connects a wallet and approves an unfamiliar contract.",["Approve the contract to claim the bonus","Check the official offer and inspect the permission requested; decline anything unrelated","Enter the recovery phrase into the offer page"],1,"The retailer declines the unverified approval and checks the offer independently.","A reward offer is not worth granting unexplained wallet permissions."]]},{"city":"birnin-kebbi","name":"Yakubu","role":"Rice mill operator","site":"Central rice market","nextCity":"Minna","handoff":"A rice cooperative wants a shared treasury that can survive staff changes and keep an auditable record.","missions":[["The Mill Treasury Signers","A departing manager is still a signer on the cooperative's multisignature wallet.",["Ignore it until a transfer fails","Use the authorised signer-change process and document the required approvals","Ask the manager to post their recovery phrase"],1,"The cooperative updates access through its agreed multisig procedure.","A staff change should be reflected in signer permissions before it becomes an emergency."],["The Grain-Purchase Batch","A batch of supplier payments has one unfamiliar destination mixed among verified addresses.",["Approve the batch because most entries look right","Review each recipient and amount before the batch is signed","Sign first and investigate after the rice arrives"],1,"The unfamiliar destination is checked before the batch can be approved.","A batch can contain one bad entry even when every other payment is correct."]]},{"city":"minna","name":"Bala","role":"Student software builder","site":"Bosso campus","nextCity":"Dutse","handoff":"A student-built app is ready for a demo, but the team must separate test assets from real money.","missions":[["The Testnet Demo","A tutorial tells the team to fund a demo using a personal wallet's recovery phrase.",["Use a separate test wallet and test-network assets","Paste the real phrase into the tutorial","Ask the audience to share their phrases so the demo can continue"],0,"The team runs the demo with test assets and keeps real wallet secrets private.","A demo should never require the recovery phrase of a real wallet."],["The Unreadable Contract Call","The app requests a contract interaction whose effect is not explained in the interface.",["Sign because the app is the team's own build","Inspect the function and expected effects using trusted code/docs before signing","Approve every permission so testing goes faster"],1,"The team pauses until it understands the call and can explain its effects.","Signing is an authorisation, not a harmless click."]]},{"city":"dutse","name":"Nura","role":"Irrigation equipment seller","site":"Dutse market","nextCity":"Gusau","handoff":"A customer wants to stake funds for a discount, but the seller notices withdrawal terms are missing.","missions":[["The Locked Discount","A provider offers a large reward for staking but hides lockup and withdrawal conditions.",["Accept the reward headline as the full deal","Check custody, lockup, withdrawal rules and provider risks before committing","Send funds to the salesperson's personal wallet"],1,"The customer evaluates the actual staking terms rather than the advertised reward alone.","Rewards do not remove lockup, custody or protocol risk."],["The Validator Promise","An agent claims delegated staking has no risk because the user keeps their tokens in a wallet.",["Trust the claim because the wallet remains visible","Check the protocol's delegation model, operator duties and penalty exposure","Give the agent the wallet's recovery phrase"],1,"The seller explains that delegation still carries protocol and operator risks.","Keeping wallet access does not eliminate every staking risk."]]},{"city":"gusau","name":"Amina","role":"Tailoring studio owner","site":"Central market","nextCity":"Kafanchan","handoff":"A customer brings a token migration notice that may be an attempt to steal funds.","missions":[["The Migration Deadline","A message says the studio must migrate tokens through a shortened link before midnight.",["Open the link and sign whatever appears","Find the migration notice on the project's official domain and verify both contracts","Share the phrase with the sender for a guided migration"],1,"The studio verifies the notice and contract details through the official project source.","A shortened link and artificial deadline are not reliable migration instructions."],["The Recovery-Agent Offer","An online agent promises to recover tokens for an upfront fee and asks for the recovery phrase.",["Pay first because the agent guarantees success","Reject any request for the phrase and use official wallet guidance","Send the phrase but change it afterwards"],1,"The studio avoids exposing the wallet secret and rejects the fake recovery service.","No legitimate recovery helper should need the recovery phrase."]]},{"city":"kafanchan","name":"Grace","role":"Produce cooperative coordinator","site":"Station market","nextCity":"Damboa","handoff":"A produce cooperative is expanding membership and must decide how to share records without sharing control of the wallet.","missions":[["The Public Treasury Board","Members want a public board showing all cooperative transactions but a draft includes a recovery phrase.",["Publish the phrase alongside the balance for transparency","Remove all secrets and publish only the transaction information members need","Make every member an unrestricted wallet signer"],1,"The cooperative shares useful records while protecting wallet control and private information.","Transparency means auditable activity, not exposing secrets or giving everyone unrestricted access."],["The Signer Who Left","A former coordinator's phone was lost and the group is unsure whether its shared wallet is exposed.",["Keep using it without checking access","Review signer access and follow the wallet's official procedure to secure or rotate control","Ask the former coordinator to post their phrase in the group"],1,"The group checks who can still authorise transfers and secures access through the approved process.","A lost device can create an access risk; posting secrets publicly makes it worse."]]},{"city":"damboa","name":"Hajara","role":"Market association organiser","site":"Damboa trading area","nextCity":"Ibadan","handoff":"A market association needs to protect a shared fund while keeping members informed after a suspicious approval.","missions":[["The Unknown Allowance","A member discovers an unfamiliar token allowance granted to a shopping site months ago.",["Assume disconnecting the site removed every allowance","Check the token allowance on the correct network and revoke unwanted access with a trusted tool","Send a second approval to cancel the first"],1,"The member checks and removes the unwanted allowance separately from disconnecting the site.","Disconnecting a site and revoking a token allowance are different actions."],["The Association Safety Notice","A scam link is circulating in the association group and members want to repost it as a warning.",["Repost the clickable link with a warning emoji","Report the link and warn members using a plain description and verified official channels","Ask members to open it and screenshot the page"],1,"The association warns people without amplifying the malicious link.","Repeating a scam link can send more people into the trap."]]},{"city":"ibadan","name":"Reina","role":"Food-stall owner","site":"Bodija market","nextCity":"Kaduna","handoff":"A popular food stall's preorder list is being impersonated, and a real customer needs proof of a payment.","missions":[["The Dodo Preorder Impersonator","A fake account copies the stall's menu and sends customers a different deposit wallet.",["Confirm orders from any page using the same menu photo","Direct customers to the established official account and verify the payment address","Ask customers to pay both addresses to reserve a slot"],1,"The stall separates its genuine preorder channel from the impersonator and confirms its payment route.","Copied menus are not proof of account ownership."],["The Customer's Transaction Hash","A customer provides a hash, but the transfer is on a different network and the amount is short.",["Mark the order paid because a hash exists","Check network, recipient, status and exact amount against the order","Ask the customer for their recovery phrase"],1,"The order is reconciled against the exact payment conditions before being marked paid.","A transaction hash alone does not prove the right amount reached the right recipient."]]},{"city":"kaduna","name":"Mcbond","role":"Textile merchant","site":"Kasuwan Barci","nextCity":"Enugu","handoff":"A textile group is evaluating a protocol proposal and must separate a completed vote from actual delivery.","missions":[["The Treasury Proposal","A proposal requests funds but has no milestones, named owners or budget breakdown.",["Approve it because the goal sounds useful","Ask for an accountable budget and measurable milestones before voting","Let the proposer sign on behalf of every member"],1,"The group asks for enough detail to evaluate and later audit the spending.","A good-sounding goal does not show how funds will be used."],["The Promise After the Vote","A proposal passed, but the promised product update has not shipped and no execution transaction is linked.",["Announce that delivery is complete because the vote passed","Check execution records and progress reports; distinguish approval from delivery","Vote again without reading the first result"],1,"The group reports what has actually been executed and what remains outstanding.","A successful vote authorises a plan; it does not prove the plan was delivered."]]},{"city":"enugu","name":"Nneka","role":"Event producer","site":"New Haven","nextCity":"Benin City","handoff":"An event sponsor wants to pay in a stablecoin, but the team must check what the token and contract actually promise.","missions":[["The Sponsor's Stablecoin","A sponsor offers a token marketed as stable, but the issuer's redemption and reserve disclosures are unclear.",["Treat the peg as guaranteed because of the name","Check current issuer disclosures, redemption terms and liquidity before budgeting","Promise the sponsor a fixed cash-out without checking"],1,"The producer states the real redemption assumptions and does not present stability as a guarantee.","A stablecoin can still face liquidity, issuer and depeg risks."],["The Venue's Smart Contract","A venue payment dApp claims its contract is audited but provides no audit report or contract address.",["Trust the badge on its homepage","Verify the contract address and inspect the audit's date, scope and findings","Approve the contract and ask for proof later"],1,"The producer asks for verifiable contract and audit evidence before connecting funds.","An audit claim is not the same as evidence, and an audit is not a guarantee."]]},{"city":"benin","name":"Osarobo","role":"Bronze craft seller","site":"Igun Street","nextCity":"Calabar","handoff":"A craft buyer claims a token proves ownership of a bronze design and demands exclusive rights.","missions":[["The Bronze Design NFT","A buyer says the NFT automatically transfers every right to reproduce the design.",["Agree because the token is onchain","Check the written licence and agree on specific usage rights before minting or transferring","Delete the artwork source files after minting"],1,"The seller separates token ownership from copyright and documents the actual licence.","An NFT does not automatically transfer copyright."],["The Replica Contract","A mint page uses the craft collective's name but the linked contract is not listed by its official channels.",["Mint immediately before the collection sells out","Verify the contract through the collective's official channels before connecting","Connect to the page using the main treasury wallet"],1,"The collective confirms the actual contract before promoting the mint.","A copied name or artwork cannot authenticate a contract."]]},{"city":"calabar","name":"Eka","role":"Waterfront tour operator","site":"Marina waterfront","nextCity":"Jos","handoff":"A tour operator is coordinating group bookings, and a false payment alert threatens to release seats too early.","missions":[["The Waterfront Booking Alert","A booking dashboard shows a payment notification, but the account balance and transaction record do not agree.",["Release the seats based on the notification","Verify the actual transaction and recipient before confirming the booking","Ask the guest to share their wallet password"],1,"The operator waits for the payment record to match before confirming seats.","A notification is not a substitute for the underlying transaction."],["The Group Refund","A guest asks for a refund to a new third-party address and says the original payer is unavailable.",["Refund to the new address without checking","Follow the published refund process and verify who is entitled to receive it","Send the refund to the first address in the chat"],1,"The operator uses the agreed refund procedure and verifies the recipient.","A refund redirected to an unrelated address can be difficult or impossible to recover."]]},{"city":"jos","name":"Danjuma","role":"Potato cooperative lead","site":"Terminus market","nextCity":"Maiduguri","handoff":"A cooperative is funding cold storage and must evaluate an oracle-fed price used in a shared financing agreement.","missions":[["The Cold-Store Price Feed","The financing dashboard's collateral price has not updated since yesterday, despite a market move.",["Use the old price because it is displayed clearly","Check the feed source, timestamp and protocol's stale-price behaviour","Average it with an unverified social-media quote"],1,"The cooperative identifies the stale price and does not rely on it as current market data.","A clear display can still be stale; source and timestamp matter."],["The Harvest Collateral","A lender focuses on the value of stored potatoes but ignores debt growth and liquidation thresholds.",["Approve the loan based on collateral value alone","Assess collateral, debt, interest and liquidation conditions together","Assume the harvest price can only rise"],1,"The cooperative evaluates the whole position before accepting the financing risk.","Collateral value alone does not reveal liquidation exposure."]]},{"city":"maiduguri","name":"Aisha","role":"Community relief coordinator","site":"Community supply point","nextCity":"Lagos","handoff":"A relief fund faces a suspicious treasury request; the lessons return to Lagos with a stronger, locally led safety network.","missions":[["The Relief-Fund Multisig","A message asks the relief team to sign a treasury transfer to an unfamiliar address before supplies are dispatched.",["Verify the recipient and transaction details with the required signers before approving","Approve because the message says the trucks are waiting","Let one signer bypass the team's agreed process"],0,"The team verifies the destination and required approvals, protecting the relief fund without ignoring the delivery deadline.","Urgency does not verify a destination or replace the required signers."],["The Community Incident Brief","Members report a suspicious wallet approval and want to share screenshots that include personal details.",["Publish every screenshot so people can investigate","Preserve relevant evidence, remove secrets and personal details, and direct members to official safety steps","Ask affected members to post recovery phrases for analysis"],1,"The team publishes a careful incident notice with verified facts and safe next steps, then carries the warning back to the wider network.","An incident report should inform people without exposing more sensitive information."]]}];
const cityHandoffs=Object.fromEntries(CITY_JOURNEYS.map(c=>[c.city,c.handoff]));
CITY_JOURNEYS.forEach((cityData,ci)=>{
  cityData.missions.forEach((data,mi)=>{
    const n=9+ci*2+mi;
    const mentor=loc(cityData.name,cityData.role,['#00A6B8','#C77937','#6A65B8','#268A66'][ci%4],ci%3===0?LK.mama:(ci%3===1?LK.trader:LK.man),cityData.site);
    const spot=routeSpots[(ci*7+mi*11+3)%routeSpots.length];
    const m={
      id:'journey_'+cityData.city+'_'+(mi+1),n,city:cityData.city,title:data[0],
      goal:data[1].split('. ')[0]+'.',xp:95+mi*15,explore:true,
      steps:[{label:data[0],spot,npc:mentor,run(){
        const choices=data[2].map((choice,choiceIndex)=>({
          t:choice,
          g:choiceIndex!==data[3],
          f:()=>{
            if(choiceIndex===data[3]){
              talk(mentor,'<h3>Good call</h3><p>'+data[4]+'</p><p><b>'+cityData.name+' remembers how you handled this.</b></p>',[{t:'Continue',f:finishStep}]);
            }else{
              talk(mentor,'<h3>Think it through</h3><p>'+data[5]+'</p><p>Look at what is actually verified, who controls the funds, and what this action would authorise.</p>',[{t:'Try another choice',f:()=>{closeSheet();loadStep();}}]);
            }
          }
        }));
        talk(mentor,'<p><b>'+cityData.name+' · '+cityData.site+'</b></p><p>'+data[1]+'</p><p>'+cityData.handoff+'</p><p><b>What do you do?</b></p>',choices);
      }}]
    };
    EXPLORE.push(m);MBY[m.id]=m;
  });
});
function completeExplore(){
 const m=G.m,first=!P.done[m.id],before=levelInfo(P.xp).n;let gain=0;if(first){gain=m.xp+G.bonus;P.xp+=gain;}P.done[m.id]=true;save();updateHUD();Snd.sfx('done');
 const after=levelInfo(P.xp),cityComplete=isCityComplete(m.city);clearGroup(missionGroup);colliders.length=cityCols;smoke=[];ents=[];goal=null;beacon.visible=false;hubCity=m.city;
 const idx=cityOrder.indexOf(m.city),nextCity=cityOrder[idx+1],remainingHere=cityMissions(m.city).find(x=>!P.done[x.id]),nextJourney=remainingHere||(nextCity?cityMissions(nextCity)[0]:null),btns=[];
 if(cityComplete)btns.push({t:'Collect city badge',f:()=>showCityBadge(m.city,()=>nextJourney?startMission(nextJourney.id):exitToHub())});
 if(nextJourney)btns.push({t:remainingHere?'Next mission: '+nextJourney.title:'Continue to '+CITIES[nextCity].name,f:()=>startMission(nextJourney.id)});
 btns.push({t:'Back to hub',g:1,f:exitToHub});
 openSheet('<div class="who"><span class="av" style="background:'+INK+'">'+m.n+'</span><div><h3 style="margin:0">'+(cityComplete?CITIES[m.city].name+' journey complete':'Mission '+m.n+' complete')+'</h3><small>'+CITIES[m.city].name+' · '+m.title+'</small></div></div>'+(gain?'<div class="kv"><span>Mission XP</span><b>+'+gain+'</b></div>':'<p class="note">Mission already completed.</p>')+(cityComplete?'<p><b>Both missions in '+CITIES[m.city].name+' are complete. Your city badge is available.</b></p>':'<p class="note">Finish the other mission in this city to earn its badge.</p>')+(gain&&after.n>before?'<p><b>Level up! You are now '+after.title+'.</b></p>':''),btns);
}
function moduleCard(m){
 const un=isUnlocked(m),dn=!!P.done[m.id],foot=dn?'Mission complete':(un?'City story · Meet a local resident':'Finish the previous mission first');
 return '<div class="card'+(un?'':' lock')+'"><div class="ch">'+badgeSVG(m.n,false,46)+'<div><b>Mission '+m.n+': '+m.title+'</b><small>'+m.goal+'</small></div></div><div class="cf"><span>'+foot+'</span>'+(un?'<button class="btn brand" data-a="play" data-v="'+m.id+'" type="button">'+(dn?'Replay':'Play mission')+'</button>':'<span>Locked</span>')+'</div></div>';
}
const BADGES=['Wallet Starter','Swap Smart','Scam Spotter','Key Keeper','Safe Sender','Passport Holder','Community Voice','Cash-out Pro'];
const LEVELS=[0,150,400,700,1000,1400],LTITLES=['Newcomer','Hustler','Street smart','Wallet pro','Onchain Oga','Naija legend'];
function levelInfo(xp){
  let n=0; for(let i=0;i<LEVELS.length;i++) if(xp>=LEVELS[i]) n=i;
  const lo=LEVELS[n],hi=LEVELS[n+1];
  return {n:n+1,title:LTITLES[n],pct:hi?Math.min(100,Math.round((xp-lo)/(hi-lo)*100)):100};
}
const cityOrder=['lagos','abuja','kano','ph',...CITY_JOURNEYS.map(c=>c.city)];
EXPLORE.sort((a,b)=>cityOrder.indexOf(a.city)-cityOrder.indexOf(b.city));
EXPLORE.forEach((m,i)=>{ m.mod=i+1; });
const cityMissions=city=>{ const explore=EXPLORE.filter(m=>m.city===city); return explore.length?explore:MISSIONS.filter(m=>m.city===city); };
const isCityComplete=city=>{ const missions=cityMissions(city); return missions.length>0&&missions.every(m=>!!P.done[m.id]); };
const isCityUnlocked=city=>{ const i=cityOrder.indexOf(city); return i>=0&&(i===0||isCityComplete(cityOrder[i-1])); };
const isUnlocked=m=>{
  if(m.explore){
    if(!isCityUnlocked(m.city)) return false;
    const pack=cityMissions(m.city),at=pack.indexOf(m);
    return at<=0||!!P.done[pack[at-1].id];
  }
  const k=MISSIONS.indexOf(m); return k===0||!!P.done[MISSIONS[k-1].id];
};
/* Guard the intended two-mission-per-city route and globally unique titles. */
const ALL_MISSIONS=[...MISSIONS,...EXPLORE];
const missionTitles=new Set();
for(const mission of ALL_MISSIONS){
  if(missionTitles.has(mission.title)) throw new Error('Duplicate mission title: '+mission.title);
  missionTitles.add(mission.title);
}
for(let ci=0;ci<cityOrder.length;ci++){
  const pack=cityMissions(cityOrder[ci]);
  if(pack.length!==2) throw new Error('Each city must have exactly two missions: '+cityOrder[ci]);
  for(let mi=0;mi<pack.length;mi++){
    const expected=ci<4?ci*2+mi+1:9+2*(ci-4)+mi;
    if(pack[mi].n!==expected) throw new Error('Mission numbering gap at '+cityOrder[ci]+': expected '+expected+', got '+pack[mi].n);
  }
}


/* =====================  mission flow  ===================== */
function hideEnt(e){ e.hidden=true; loadStep(); }
function resetPlayer(){
  player.position.set(SPAWN.x,.05,SPAWN.z); faceAng=0; player.rotation.y=0;
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
  const routeKey=(G.routeSpots&&G.routeSpots[G.i%G.routeSpots.length])||st.spot; const e=placeNPC(st.npc,SPOTS[routeKey]||SPOTS[st.spot]); e.talk=()=>st.run(); e.active=()=>true; ents.push(e); goal=e;
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
    G={m,i:0,bonus:0,correct:0,used:{},words:null,addr:null,slip:null,routeSpots:shuffle(routeSpots)};
    $('#hub').classList.add('hidden'); $('#hub').setAttribute('aria-hidden','true'); $('#title').classList.add('hidden'); $('#hud').classList.remove('hidden');
    S.phase='play'; closeSheet(); Snd.setMode('play'); lastLoc=''; resetPlayer(); loadStep();
    $('#loading').classList.add('hidden');
    briefing();
  },60);
}
function briefing(){
  const m=G.m,C=CITIES[m.city];
  openSheet('<div class="who"><span class="av" style="background:'+INK+'">'+m.n+'</span><div><b>'+(m.explore?'':'Mission '+m.n+': ')+m.title+'</b><small>'+C.name+', '+C.tag+'</small></div></div><p>'+m.goal+'</p><ul class="pts">'+m.steps.map(s=>'<li>'+s.label+'</li>').join('')+'</ul>'+(m.explore?'<p class="note">Move with the left stick or WASD. Hold Run or Shift to run. Tap Talk or press E near a person. Follow the arrow to your next conversation.</p>':'<p class="note">Follow the arrow to the next person. Watch for traffic.</p>'),
    [{t:'Start conversations',f:closeSheet},{t:'Back to hub',g:1,f:exitToHub}]);
}
function finishStep(){
  closeSheet(); if(!G) return;
  G.i++;
  if(G.i>=G.m.steps.length){ completeMission(); return; }
  Snd.sfx('chime'); toast('Step complete'); loadStep();
}
function completeMission(){
 if(G.m.explore){completeExplore();return;}
 const m=G.m,first=!P.done[m.id],before=levelInfo(P.xp).n;let gain=0;if(first){gain=m.xp+G.bonus;P.xp+=gain;}
 P.done[m.id]=true;save();updateHUD();Snd.sfx('done');
 const after=levelInfo(P.xp),idx=MISSIONS.indexOf(m),next=MISSIONS[idx+1],cityComplete=isCityComplete(m.city);
 clearGroup(missionGroup);colliders.length=cityCols;smoke=[];ents=[];goal=null;beacon.visible=false;
 const nextInCity=cityMissions(m.city).find(x=>!P.done[x.id]);
 const nextCityKey=cityOrder[cityOrder.indexOf(m.city)+1];
 const nextJourney=nextInCity||(next||(nextCityKey?cityMissions(nextCityKey)[0]:null)),btns=[];
 hubCity=nextJourney?nextJourney.city:m.city;
 if(cityComplete)btns.push({t:'Collect city badge',f:()=>showCityBadge(m.city,()=>nextJourney?startMission(nextJourney.id):exitToHub())});
 if(nextJourney)btns.push({t:nextJourney.city!==m.city?'Continue to '+CITIES[nextJourney.city].name:'Next: '+nextJourney.title,f:()=>startMission(nextJourney.id)});
 btns.push({t:'Back to hub',g:1,f:exitToHub});
 openSheet('<div class="who"><span class="av" style="background:'+INK+'">'+m.n+'</span><div><h3 style="margin:0">'+(cityComplete?CITIES[m.city].name+' journey complete':'Mission '+m.n+' complete')+'</h3><small>'+CITIES[m.city].name+' · '+m.title+'</small></div></div>'+(first?'<div class="kv"><span>Mission XP</span><b>+'+m.xp+'</b></div>'+(G.bonus?'<div class="kv"><span>Bonus XP</span><b>+'+G.bonus+'</b></div>':'')+'<div class="kv"><span>Total XP</span><b>'+P.xp+'</b></div>':'<p class="note">Replay complete. XP is only awarded the first time.</p>')+(cityComplete?'<p><b>Both missions in '+CITIES[m.city].name+' are complete. Your city badge is available.</b></p>':'<p class="note">Finish the other mission in this city to earn its badge.</p>')+(first&&after.n>before?'<p><b>Level up! You are now '+after.title+'.</b></p>':''),btns);
}
function showCityBadge(city,after){
 const name=CITIES[city]?.name||city;
 openSheet('<div class="badge">'+badgeSVG('★',true,96)+'<div><h3 style="margin-top:0">'+name+' Pathfinder</h3><small>City journey completed</small></div></div><p>You completed both missions and earned the '+name+' city badge.</p>',[{t:'Continue journey',f:()=>{closeSheet();if(after)after();}}]);
}
function certificate(){
  const totalMissions=MISSIONS.length+EXPLORE.length;
  const msg=encodeURIComponent(L('I finished all '+totalMissions+' KitCity missions and learned how to use a crypto wallet safely. Can you survive Naija with your wallet?','I don finish all '+totalMissions+' KitCity missions and I don learn how to use crypto wallet safely. You fit survive Naija with your wallet?'));
  openSheet('<div class="badge">'+badgeSVG('\u2605',true,96)+'<div><h3 style="margin-top:0">KitCity Graduate</h3><small>All '+totalMissions+' missions complete</small></div></div><p>You completed the full KitCity mission journey across all cities. Total XP: <b>'+P.xp+'</b>.</p>',
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
  openSheet('<h3>Paused</h3><p class="note">'+(G.m.explore?'Module '+G.m.mod:'Mission '+G.m.n)+': '+G.m.title+'</p>',[
    {t:'Resume',f:closeSheet},
    {t:'Restart mission',g:1,f:()=>startMission(G.m.id)},
    {t:'Back to hub',g:1,f:exitToHub}
  ]);
});

/* =====================  hub  ===================== */
const NG=[[2.7,6.4],[4.0,6.4],[5.0,5.4],[5.6,4.4],[6.8,4.3],[7.6,4.5],[8.3,4.6],[8.5,4.9],[9.0,5.8],[9.9,6.7],[10.6,7.0],[11.2,6.6],[11.8,7.2],[12.8,7.8],[13.2,9.0],[12.2,10.0],[11.7,10.9],[12.5,11.5],[13.7,11.9],[14.6,12.2],[14.2,13.0],[13.6,13.6],[12.0,13.5],[10.0,13.3],[8.5,13.0],[7.0,13.0],[5.5,13.6],[4.2,13.4],[3.6,11.9],[3.8,11.0],[3.7,10.0],[3.1,9.0],[2.8,7.9]];
const mx=lon=>(lon-2.2)*20,my=lat=>(14.2-lat)*20;
function mapSVG(){
  const pts=NG.map(p=>mx(p[0]).toFixed(1)+','+my(p[1]).toFixed(1)).join(' ');
  let pins='';
  for(const k in CITIES){
    const c=CITIES[k],x=mx(c.lon),y=my(c.lat),ms=cityMissions(k),d=ms.filter(m=>P.done[m.id]).length,open=isCityUnlocked(k),sel=k===hubCity;
    pins+='<g data-a="city" data-v="'+k+'" style="cursor:'+(open?'pointer':'not-allowed')+'"><circle cx="'+x+'" cy="'+y+'" r="'+(sel?12:9)+'" fill="'+(open?BRAND:'#6b6f78')+'" stroke="#fff" stroke-width="'+(sel?3:2)+'"/><text x="'+x+'" y="'+(y+3.5)+'" text-anchor="middle" font-size="10" font-weight="800" fill="'+INK+'">'+d+'/'+ms.length+'</text><text x="'+x+'" y="'+(y+25)+'" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">'+c.name+(open?'':' · LOCKED')+'</text></g>';
  }
  return '<svg viewBox="0 0 270 220" class="map" role="img" aria-label="Map of Nigeria with mission cities"><polygon points="'+pts+'" fill="rgba(16,200,220,.18)" stroke="'+BRAND+'" stroke-width="2.5" stroke-linejoin="round"/>'+pins+'</svg>';
}
function missionCard(m){
  const un=isUnlocked(m),dn=!!P.done[m.id];
  return '<div class="card'+(un?'':' lock')+'"><div class="ch">'+badgeSVG(m.n,false,46)+'<div><b>'+'Mission '+m.n+': '+m.title+'</b><small>'+m.goal+'</small></div></div><div class="cf"><span>'+m.xp+' XP'+(dn?', done':'')+'</span>'+(un?'<button class="btn brand" data-a="play" data-v="'+m.id+'" type="button">'+(dn?'Replay':'Play')+'</button>':'<span>Finish mission '+(m.n-1)+' first</span>')+'</div></div>';
}
function renderHub(){
  const L=levelInfo(P.xp);
  $('#hubTop').innerHTML=tx('<span class="wm"><img class="header-logo" src="https://i.postimg.cc/6pLt0sn3/file-000000006e348210b7a8c70bc4ed899d.png" alt="KitCity" /></span><div class="lvl"><b>Level '+L.n+': '+L.title+'</b><div class="bar"><i style="width:'+L.pct+'%"></i></div>'+P.xp+' XP</div>');
  document.querySelectorAll('#nav [data-v="kitlab"]').forEach(b=>b.remove());
  if(hubTab==='kitlab') hubTab='cityhub';
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===hubTab));
  let h='';
  if(hubTab==='missions'){
    const C=CITIES[hubCity];
    h+=mapSVG()+'<div class="chips">'+Object.keys(CITIES).map(k=>'<button class="chip'+(k===hubCity?' on':'')+'" data-a="city" data-v="'+k+'" type="button" '+(isCityUnlocked(k)?'':'disabled')+'>'+CITIES[k].name+(isCityUnlocked(k)?'':' · Locked')+'</button>').join('')+'</div>';
    h+='<p class="soft"><b>'+C.name+'</b>, '+C.tag+'</p>'+cityMissions(hubCity).map(m=>m.explore?moduleCard(m):missionCard(m)).join('');
  } else if(hubTab==='cityhub'){
    hubTab='missions';
    const C=CITIES[hubCity];
    h+=mapSVG()+'<p class="soft"><b>'+C.name+'</b>, '+C.tag+'</p>'+cityMissions(hubCity).map(m=>m.explore?moduleCard(m):missionCard(m)).join('');
  } else if(hubTab==='passport'){
    const allMissions=[...MISSIONS,...EXPLORE];
    const done=allMissions.filter(m=>P.done[m.id]).length,all=done===allMissions.length;
    const completedCities=cityOrder.filter(city=>isCityComplete(city)).length;
    h+='<div class="h2">Mission badges</div><div class="grid2">'+allMissions.map((m,i)=>'<div class="bd'+(P.done[m.id]?'':' off')+'">'+badgeSVG(m.n,!!P.done[m.id],56)+'<b>Mission '+m.n+': '+m.title+'</b></div>').join('')+'</div>';
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
    h+='<div class="card"><div class="ch"><div><b>Reset progress</b><small>Erases XP, badges and your practice wallet on this device.</small></div></div><div class="cf"><span>'+(resetArm?'Tap again to confirm':'')+'</span><button class="btn line" data-a="reset" type="button">'+(resetArm?'Yes, erase everything':'Reset')+'</button></div></div>';
    h+='<p class="soft">Prototype: wallets, balances and payments are simulated. Rates are samples. Nothing here is financial advice.</p>';
  }
  $('#hubBody').innerHTML=tx(h);
}
$('#hub').addEventListener('click',e=>{
  const b=e.target.closest('[data-a]'); if(!b) return;
  const a=b.dataset.a,v=b.dataset.v;
  if(a==='tab'){ hubTab=v; resetArm=false; renderHub(); $('#hubBody').scrollTop=0; }
  else if(a==='city'){ if(!isCityUnlocked(v)){ toast('Finish the previous city journey first'); return; } hubCity=v; hubTab='missions'; renderHub(); }
  else if(a==='cityhub'){ hubTab='missions'; renderHub(); $('#hubBody').scrollTop=0; }
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
    Store.del(KEY); Object.assign(P,{wallet:null,usdc:0,ngn:0,xp:0,done:{},dodged:0,fell:0,scores:{},web3:null}); save(); resetArm=false; hubCity='lagos'; hubTab='missions'; renderHub(); toast('Progress erased');
  }
});
const playerNameInput=$('#playerName');
const playerNameError=$('#playerNameError');
if(playerNameInput){ playerNameInput.value=P.name||''; }
function submitPlayerName(){
  const candidate=(playerNameInput&&playerNameInput.value||'').trim();
  if(!/^[A-Za-z0-9_]{3,20}$/.test(candidate)){
    if(playerNameError) playerNameError.textContent='Use 3–20 letters, numbers, or underscores.';
    if(playerNameInput) playerNameInput.focus();
    return;
  }
  P.name=candidate; save();
  if(playerNameError) playerNameError.textContent='';
  beginGame();
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
function applyLang(){
  document.documentElement.lang=P.lang==='pcm'?'pcm':'en';
  document.querySelectorAll('[data-t]').forEach(el=>{ if(!el.dataset.en) el.dataset.en=el.textContent; el.textContent=(P.lang==='pcm'&&el.dataset.pcm)?el.dataset.pcm:tr(el.dataset.en); });
  document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('on',b.dataset.lang===P.lang));
  $('#startBtn').textContent=(P.xp>0||Object.keys(P.done).length)?L('Continue','Continue'):L('Enter KitCity','Enter KitCity');
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
let hitCd=0,shake=0;
function carHit(dt){
  if(hitCd>0){ hitCd-=dt; return; }
  const p=player.position;
  for(const c of cars){
    const hx=c.axis==='x'?c.hl:c.hw,hz=c.axis==='x'?c.hw:c.hl,cx=c.m.position.x,cz=c.m.position.z;
    if(Math.abs(p.x-cx)<hx+.9&&Math.abs(p.z-cz)<hz+.9){
      if(c.axis==='x') p.z=cz+(p.z>=cz?1:-1)*(hz+3.5); else p.x=cx+(p.x>=cx?1:-1)*(hx+3.5);
      hitCd=1.2; shake=.8; Snd.sfx('bump'); toast('Watch the road!'); resolve(p,1); resolve(p,1); break;
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