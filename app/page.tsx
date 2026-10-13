'use client';

import { useEffect } from 'react';
import initKitCity from '../game/kitcity-engine';

const GAME_MARKUP = `
<canvas id="gl"></canvas>

<div id="hud" class="hidden">
  <div id="lives" role="img" aria-label="3 of 3 lives remaining"><span class="life-heart alive">♥</span><span class="life-heart alive">♥</span><span class="life-heart alive">♥</span></div>
  <div id="mission" class="panel glass">
    <div class="mh"><h2 id="mTitle">Story</h2><button id="pauseBtn" type="button" aria-label="Pause menu">II</button></div>
    <div id="loc"></div>
    <ol id="steps"></ol>
  </div>
  <div id="side">
    <div id="wallet" class="panel">No wallet yet</div>
    <div id="compass"><svg id="arrow" viewBox="0 0 24 24"><path d="M12 2 L20 21 L12 16 L4 21 Z" fill="#F3263E" stroke="#FFFFFF" stroke-width=".8"/></svg><span id="dist"></span></div>
  </div>
  <div id="toast" role="status" aria-live="polite" aria-atomic="true"></div>
  <div id="joy"><div id="knob"></div></div>
  <button id="runBtn" class="round" type="button">Run</button>
  <button id="talkBtn" class="round hidden" type="button">Talk</button>
</div>

<div id="modal" class="hidden"><div id="sheet" class="panel"></div></div>

<div id="title" class="screen">
  <div class="wrap">
    <div class="brand-lockup"><img class="brand-logo" src="https://i.postimg.cc/qqbdTXky/file-00000000958881f4a776df689a235dec.png" alt="KitCity" /></div>
    <div class="band">
      <h1>KitCity</h1>
      <p data-t data-pcm="Learn web3 before e cost you.">Learn web3 before it costs you.</p>
    </div>
    <div class="player-entry hidden">
      <div class="auth-mode" role="group" aria-label="Account action">
        <button id="authModeSignIn" type="button" class="on" data-auth-mode="signin">Sign in</button>
        <button id="authModeSignUp" type="button" data-auth-mode="signup">Create account</button>
      </div>
      <label for="playerEmail">EMAIL ADDRESS</label>
      <input id="playerEmail" name="email" type="email" maxlength="254" autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false" placeholder="you@example.com" required />
      <label for="playerPassword" class="auth-field-label">PASSWORD</label>
      <input id="playerPassword" name="password" type="password" minlength="8" maxlength="128" autocomplete="current-password" placeholder="At least 8 characters" required />
      <label for="playerName" class="auth-field-label">PLAYER USERNAME</label>
      <input id="playerName" name="playerName" type="text" maxlength="20" minlength="3" autocomplete="nickname" autocapitalize="off" spellcheck="false" placeholder="e.g. KitExplorer" aria-describedby="playerNameHelp" required />
      <small id="playerNameHelp">3–20 letters, numbers, or underscores. Your username is your public gamer ID.</small>
      <label class="location-consent" for="shareLocation"><input id="shareLocation" type="checkbox" /> <span>Share approximate location (optional)</span></label>
      <small class="privacy-note">Your app-generated device ID helps recognize this installation. Location is only requested if you opt in and is stored at approximate precision.</small>
      <p id="playerNameError" role="alert" aria-live="polite"></p>
    </div>
    <div class="cta">
      <button id="signInPageBtn" class="btn" type="button">Sign in</button>
      <div class="langs" role="group" aria-label="Choose language"><button type="button" data-lang="en" aria-label="English">EN</button><button type="button" data-lang="pcm" aria-label="Naija Pidgin">PID</button><button type="button" data-lang="ig" aria-label="Igbo">IG</button><button type="button" data-lang="ha" aria-label="Hausa">HA</button></div>
    </div>
    <p class="line" data-t data-pcm="Every city dey teach you something new.">Every city teaches you something new.</p>
    <p class="credit"><a href="https://t3kit.xyz" target="_blank" rel="noopener" data-t data-pcm="Na T3Kit game.">A T3Kit game.</a> <span data-t data-pcm="Easy way enter everything for web3.">Easy access to everything in web3.</span></p>
  </div>
</div>

<div id="hub" class="screen hidden" aria-hidden="true">
  <div id="hubTop"></div>
  <div id="hubBody"></div>
  <nav id="nav" aria-label="Game menu">
    <button type="button" data-a="tab" data-v="missions">Story</button>
    <button type="button" data-a="tab" data-v="settings">Settings</button>
    <button type="button" data-a="tab" data-v="passport">Activity</button>
    <button type="button" data-a="signout">Sign out</button>
  </nav>
</div>

<div id="installPrompt" class="install-prompt hidden" role="dialog" aria-label="Install KitCity"><div><b>Take KitCity with you</b><small>Install the game on your home screen for a faster, app-like experience.</small></div><button id="installBtn" type="button">Install</button><button id="installClose" type="button" aria-label="Dismiss install prompt">×</button></div>

<div id="bootLoading" role="status" aria-live="polite"><div class="boot-inner"><img class="boot-logo" src="https://i.postimg.cc/qqbdTXky/file-00000000958881f4a776df689a235dec.png" alt="KitCity" /><div id="bootStatus">Loading city…</div><div class="boot-track"><i id="bootProgress"></i></div><small>Preparing your city</small></div></div>

<div id="loading" class="hidden"><span id="loadTxt">Loading</span></div>
<div id="err" class="hidden">The 3D engine did not load. Check your connection and reload the page.</div>

`;

export default function KitCityPage() {
  useEffect(() => {
    initKitCity();
  }, []);

  return <main dangerouslySetInnerHTML={{ __html: GAME_MARKUP }} />;
}