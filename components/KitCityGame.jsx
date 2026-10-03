'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { mountKitCityGame } from '../game/kitcityGame';

export default function KitCityGame() {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    const teardown = mountKitCityGame(THREE);
    return () => {
      try { teardown?.(); } finally { mounted.current = false; }
    };
  }, []);

  return (
    <main id="kitcity-game">
      <div id="canvas-container" />
      <div id="flash" />
      <div id="hud">
        <h2>KitCity 3D <span>v3.0</span></h2>
        <div className="hud-row"><span>State/City:</span> <span className="hud-value" id="hud-state">Lagos (Ikeja Hub)</span></div>
        <div className="hud-row"><span>Danfo Passengers:</span> <span className="hud-value" id="passenger-count">0 / 5</span></div>
        <div className="hud-row"><span>Impact Score:</span> <span className="hud-value" id="impact-score">0 pts</span></div>
        <div className="hud-row"><span>$KIT Earned:</span> <span className="hud-value" id="kit-count" style={{color:'#f5b014'}}>0</span></div>
        <div className="hud-row"><span>T3Kit Onboarded:</span> <span className="hud-value" id="learner-count">0</span></div>
        <div className="hud-row"><span>Passenger Vibe:</span> <span className="hud-value" id="vibe-val">50%</span></div>
        <div id="vibe-wrap"><div id="vibe-bar" /></div><div id="progress"><div /></div><div id="mission" />
      </div>
      <div id="objective"><div id="arrow-wrap"><div id="arrow" /></div><div id="obj-text">Loading mission…</div></div>
      <div id="side-panel">
        <canvas id="radar" width="208" height="208" />
        <div className="icon-row">
          <button className="icon-btn" id="btn-cam" title="Camera (C)">📷</button>
          <button className="icon-btn" id="btn-recover" title="Back on road (R)">↺</button>
          <button className="icon-btn" id="btn-fm" title="FM radio (F)" style={{fontSize:'13px',fontWeight:800}}>FM</button>
          <button className="icon-btn" id="btn-mute" title="Sound (M)">🔊</button>
        </div>
        <div id="fm-bar"><button className="icon-btn fm-b" id="fm-prev" title="Back">⏮</button><span id="fm-name">Afrobeats Party</span><button className="icon-btn fm-b" id="fm-next" title="Next">⏭</button></div>
      </div>
      <div id="controls-hint">Drive: <span>W A S D</span> / <span>Arrows</span><br />Brake: <span>S</span> &nbsp; Reverse: <span>V</span> &nbsp; Handbrake: <span>Space</span><br />Horn: <span>H</span> &nbsp; Camera: <span>C</span> &nbsp; Back on road: <span>R</span><br />Pick up passenger: <span>E</span> &nbsp; FM: <span>F</span></div>
      <div id="speedo"><div id="speed-val">0</div><div id="speed-unit">KM/H</div><div id="speed-bar"><div /></div></div>
      <div id="toast" /><div id="yt-hidden"><div id="yt-player" /></div><button id="prompt">PICK UP PASSENGER</button>
      <div id="controls"><div id="steer-zone" /><div id="steer-ind"><div id="steer-dot" /></div><div id="pedals"><div id="horn">📯</div><div className="pedal" id="reverse">REVERSE</div><div className="pedal" id="brake">BRAKE</div><div className="pedal" id="gas">GAS</div></div></div>
      <div id="dialogue"><div id="dlg-badge">Passenger</div><div id="dlg-name" /><div id="dlg-text" /><div id="dlg-choices" /></div>
      <div id="start" className="overlay"><div className="card"><div className="chapter" id="start-chapter">CHAPTER 1</div><h1>Onboard Nigeria</h1><p id="start-sub">Drive your yellow danfo from Ikeja to Maryland Terminal. Pick up 5 passengers along the way and help each one understand Web3 safely, the T3Kit way.</p><div id="start-mission" /><div className="state-pick"><label htmlFor="state-sel">Choose your state (all 36 + FCT)</label><select id="state-sel" /><small id="state-progress" /></div><ul id="start-list" /><button className="big-btn" id="btn-start">START DRIVING</button></div></div>
      <div id="end" className="overlay"><div className="card" style={{textAlign:'center'}}><div className="chapter" id="end-chapter">MARYLAND TERMINAL</div><h1>Chapter 1 Complete!</h1><div id="end-stars">★★★</div><p id="end-msg" /><div id="end-mission" /><div className="stat-grid" style={{textAlign:'left'}}><div className="stat"><small>Impact Score</small><b id="e-score">0</b></div><div className="stat"><small>$KIT Earned</small><b id="e-kit" style={{color:'#f5b014'}}>0</b></div><div className="stat"><small>T3Kit Onboarded</small><b id="e-learners">0</b></div><div className="stat"><small>Trip Time</small><b id="e-time">0:00</b></div><div className="stat"><small>Crashes</small><b id="e-crash">0</b></div><div className="stat"><small>Passengers</small><b id="e-pax">0</b></div><div className="stat"><small>Vibe Bonus</small><b id="e-vibe">0</b></div></div><button className="big-btn" id="btn-next">NEXT STATE  →</button><button className="big-btn" id="btn-again" style={{marginTop:'10px',background:'transparent',border:'2px solid #00e5ff',color:'#00e5ff'}}>DRIVE THIS STATE AGAIN</button></div></div>
    </main>
  );
}
