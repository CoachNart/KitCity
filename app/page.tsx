'use client';

import { useEffect, useRef } from 'react';

const GAME_MARKUP = "\n<canvas id=\"gl\"></canvas>\n\n<div id=\"hud\" class=\"hidden\">\n  <div id=\"mission\" class=\"panel glass\">\n    <div class=\"mh\"><h2 id=\"mTitle\">Mission</h2><button id=\"pauseBtn\" type=\"button\" aria-label=\"Pause menu\">II</button></div>\n    <div id=\"loc\"></div>\n    <ol id=\"steps\"></ol>\n  </div>\n  <div id=\"side\">\n    <div id=\"health\" class=\"panel\" aria-label=\"Player health: 3 of 3 hearts\"><span class=\"heart full\" aria-hidden=\"true\">♥</span><span class=\"heart full\" aria-hidden=\"true\">♥</span><span class=\"heart full\" aria-hidden=\"true\">♥</span></div>\n    <div id=\"wallet\" class=\"panel\">No wallet yet</div>\n    <div id=\"compass\"><svg id=\"arrow\" viewBox=\"0 0 24 24\"><path d=\"M12 2 L20 21 L12 16 L4 21 Z\" fill=\"#E53935\"/></svg><span id=\"dist\"></span></div>\n  </div>\n  <div id=\"toast\" role=\"status\" aria-live=\"polite\" aria-atomic=\"true\"></div>\n  <div id=\"joy\"><div id=\"knob\"></div></div>\n  <button id=\"runBtn\" class=\"round\" type=\"button\">Run</button>\n  <button id=\"talkBtn\" class=\"round hidden\" type=\"button\">Talk</button>\n</div>\n\n<div id=\"modal\" class=\"hidden\"><div id=\"sheet\" class=\"panel\"></div></div>\n\n<div id=\"title\" class=\"screen\">\n  <div class=\"wrap\">\n    <div class=\"brand-lockup\"><img class=\"brand-logo\" src=\"https://i.postimg.cc/qqbdTXky/file-00000000958881f4a776df689a235dec.png\" alt=\"KitCity\" /></div>\n    <div class=\"band\">\n      <h1>KitCity</h1>\n      <p data-t data-pcm=\"Learn web3 before e cost you.\" data-ha=\"Koyi Web3 kafin ya jawo maka asara.\" data-yo=\"Kọ́ Web3 kí ó tó fa ìṣòro fún ọ.\" data-ig=\"Mụta Web3 tupu ọ kpatara gị nsogbu.\">Learn web3 before it costs you.</p>\n    </div>\n    <div class=\"player-entry hidden\">\n      <div class=\"auth-mode\" role=\"group\" aria-label=\"Account action\">\n        <button id=\"authModeSignIn\" type=\"button\" class=\"on\" data-auth-mode=\"signin\">Sign in</button>\n        <button id=\"authModeSignUp\" type=\"button\" data-auth-mode=\"signup\">Create account</button>\n      </div>\n      <label for=\"playerEmail\">EMAIL ADDRESS</label>\n      <input id=\"playerEmail\" name=\"email\" type=\"email\" maxlength=\"254\" autocomplete=\"email\" inputmode=\"email\" autocapitalize=\"off\" spellcheck=\"false\" placeholder=\"you@example.com\" required />\n      <label for=\"playerPassword\" class=\"auth-field-label\">PASSWORD</label>\n      <input id=\"playerPassword\" name=\"password\" type=\"password\" minlength=\"8\" maxlength=\"128\" autocomplete=\"current-password\" placeholder=\"At least 8 characters\" required />\n      <label for=\"playerName\" class=\"auth-field-label\">PLAYER USERNAME</label>\n      <input id=\"playerName\" name=\"playerName\" type=\"text\" maxlength=\"20\" minlength=\"3\" autocomplete=\"nickname\" autocapitalize=\"off\" spellcheck=\"false\" placeholder=\"e.g. KitExplorer\" aria-describedby=\"playerNameHelp\" required />\n      <small id=\"playerNameHelp\">3–20 letters, numbers, or underscores. Your username is your public gamer ID.</small>\n      <label class=\"location-consent\" for=\"shareLocation\"><input id=\"shareLocation\" type=\"checkbox\" /> <span>Share approximate location (optional)</span></label>\n      <small class=\"privacy-note\">Your app-generated device ID helps recognize this installation. Location is only requested if you opt in and is stored at approximate precision.</small>\n      <p id=\"playerNameError\" role=\"alert\" aria-live=\"polite\"></p>\n    </div>\n    <div class=\"cta\">\n      <button id=\"signInPageBtn\" class=\"btn\" type=\"button\">Sign in</button>\n      <div class=\"langs\" role=\"group\" aria-label=\"Choose language\"><button type=\"button\" data-lang=\"en\">EN</button><button type=\"button\" data-lang=\"pcm\">English</button><button type=\"button\" data-lang=\"ha\">regional language</button><button type=\"button\" data-lang=\"yo\">YORÙBÁ</button><button type=\"button\" data-lang=\"ig\">regional language</button></div>\n    </div>\n    <p class=\"line\" data-t data-pcm=\"Every city dey teach you something new.\" data-ha=\"Kowane birni yana koya maka sabon abu.\" data-yo=\"Ìlú kọ̀ọ̀kan ń kọ́ ọ ní ohun tuntun.\" data-ig=\"Obodo ọ bụla na-akụziri gị ihe ọhụrụ.\">Every city teaches you something new.</p>\n    <p class=\"credit\"><a href=\"https://t3kit.xyz\" target=\"_blank\" rel=\"noopener\" data-t data-pcm=\"Na T3Kit game.\">A T3Kit game.</a> <span data-t data-pcm=\"Easy way enter everything for web3.\" data-ha=\"Hanya mai sauƙi don shiga Web3.\" data-yo=\"Ọ̀nà rọrùn láti wọ inú Web3.\" data-ig=\"Ụzọ dị mfe ịbanye na Web3.\">Easy access to everything in web3.</span></p>\n  </div>\n</div>\n\n<div id=\"hub\" class=\"screen hidden\" aria-hidden=\"true\">\n  <div id=\"hubTop\"></div>\n  <div id=\"hubBody\"></div>\n  <nav id=\"nav\" aria-label=\"Game menu\">\n    <button type=\"button\" data-a=\"tab\" data-v=\"missions\">Mission</button>\n    <button type=\"button\" data-a=\"tab\" data-v=\"settings\">Settings</button>\n    <button type=\"button\" data-a=\"tab\" data-v=\"passport\">Activity</button>\n    <button type=\"button\" data-a=\"signout\">Sign out</button>\n  </nav>\n</div>\n\n<div id=\"installPrompt\" class=\"install-prompt hidden\" role=\"dialog\" aria-label=\"Install KitCity\"><div><b>Take KitCity with you</b><small>Install the game on your home screen for a faster, app-like experience.</small></div><button id=\"installBtn\" type=\"button\">Install</button><button id=\"installClose\" type=\"button\" aria-label=\"Dismiss install prompt\">×</button></div>\n\n<div id=\"bootLoading\" role=\"status\" aria-live=\"polite\"><div class=\"boot-inner\"><img class=\"boot-logo\" src=\"https://i.postimg.cc/qqbdTXky/file-00000000958881f4a776df689a235dec.png\" alt=\"KitCity\" /><div id=\"bootStatus\">Loading city…</div><div class=\"boot-track\"><i id=\"bootProgress\"></i></div><small>Preparing your city</small></div></div>\n\n<div id=\"loading\" class=\"hidden\"><span id=\"loadTxt\">Loading</span></div>\n<div id=\"err\" class=\"hidden\">The 3D engine did not load. Check your connection and reload the page.</div>\n\n";

export default function KitCityPage() {
  const gameRoot = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = gameRoot.current;
    if (!root) return;

    // Keep this legacy DOM-driven game out of SSR so the browser's HTML
    // parser cannot create a server/client hydration mismatch.
    root.innerHTML = GAME_MARKUP;

    // Load the heavy Three.js game engine after the lightweight page mounts.
    // A static import makes mobile browsers parse the entire engine before
    // React can paint anything, which can leave embedded Android browsers blank.
    let cancelled = false;
    const bootTimer = window.setTimeout(() => {
      if (cancelled) return;
      const status = document.getElementById('bootStatus');
      const error = document.getElementById('err');
      if (status && !document.getElementById('hud')?.classList.contains('ready')) {
        status.textContent = 'Still preparing the city…';
      }
      if (error && !document.getElementById('gl')) {
        error.classList.remove('hidden');
      }
    }, 18000);

    // Remove stale offline workers/caches left by earlier KitCity builds before
    // requesting the dynamically loaded engine. A stale cached chunk can keep
    // the old broken engine alive even after a successful production deploy.
    const clearStaleGameCache = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration) => registration.unregister()));
        }
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.filter((key) => key.startsWith('kitcity-')).map((key) => caches.delete(key)));
        }
      } catch (cacheError) {
        console.warn('[KitCity] Could not clear an old offline cache:', cacheError);
      }
    };

    clearStaleGameCache()
      .then(() => import('../game/kitcity-engine.js'))
      .then(({ default: initKitCity }) => {
        if (cancelled) return;
        window.clearTimeout(bootTimer);
        initKitCity();
      })
      .catch((error) => {
        window.clearTimeout(bootTimer);
        if (cancelled) return;
        console.error('[KitCity] Game engine failed to start:', error);
        const boot = document.getElementById('bootLoading');
        const message = document.getElementById('bootStatus');
        const errorPanel = document.getElementById('err');
        if (boot) boot.classList.add('hidden');
        if (message) message.textContent = 'The city could not start. Check your connection and reload.';
        if (errorPanel) {
          const detail = error instanceof Error ? ` Details: ${error.name}: ${error.message}` : '';
          errorPanel.textContent = 'KitCity could not load its game engine. Check your connection and tap Reload.' + detail;
          errorPanel.classList.remove('hidden');
        }
      });

    return () => {
      cancelled = true;
      window.clearTimeout(bootTimer);
      root.innerHTML = '';
    };
  }, []);

  return <main ref={gameRoot} />;
}