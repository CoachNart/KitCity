const SPEAKER_LABELS = {
  Softstorm: 'SOFTSTORM',
  IamAbdul: 'THE ONE WHO HEARD IT FIRST',
};

const OPENING_PANELS = [
  { shot: 'wide', kicker: 'CHAPTER 01 · LAGOS STATE', caption: 'Morning in Lagos. Danfo horns compete with music from a nearby shop. Hawkers weave through traffic. Just another day.', next: 'next' },
  { shot: 'player', kicker: 'A LITTLE WHILE LATER', caption: 'You sit outside a neighbourhood shop, scrolling through your phone. Crypto is a word you have heard. Beyond that? Not much.', next: 'next' },
  { shot: 'conversation', speaker: 'IamAbdul', text: 'I’m telling you, people are building businesses on the internet and getting paid from anywhere.', next: 'next' },
  { shot: 'conversation', speaker: 'Softstorm', text: 'You make it sound like everybody can do it overnight.', next: 'next' },
  { shot: 'player', kicker: 'YOU SPEAK UP', speaker: 'PLAYER', text: 'Abeg, wetin una dey talk about?', next: 'next' },
  { shot: 'softstorm', speaker: 'Softstorm', text: 'Web3.', next: 'next' },
  { shot: 'abdul', speaker: 'IamAbdul', text: 'Omo, we need to start from the beginning.', next: 'next' },
  { shot: 'wide', kicker: 'YOUR FIRST MOVE', caption: 'You don’t know enough to know what to ask yet. How do you start?', choices: [
    { label: 'Ask what Web3 means', target: 8 },
    { label: 'Ask where a beginner should start', target: 9 },
  ] },
  { shot: 'softstorm', speaker: 'Softstorm', text: 'Web3 is a broad world of blockchain networks, apps, digital assets, and people building new ways to work together online. That’s the short version.', next: 'next' },
  { shot: 'abdul', speaker: 'IamAbdul', text: 'Start with the people around you. Find out what they use, what they’re building, and what problems they’re trying to solve. Don’t believe every promise you hear.', next: 'next' },
  { shot: 'clue', kicker: 'MISSION 01 · JUST ANOTHER DAY', caption: 'You don’t have to understand the whole industry today. Start by asking questions and checking what you discover.', text: 'Speak to Softstorm and IamAbdul. Then investigate three nearby places where people discuss digital opportunities. Return and share one useful thing you learned.', card: true, finish: true },
];

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
}

export function createStorySceneDirector({ camera, player, getCharacter, animateCharacter, setModal }) {
  let active = false;
  let panelIndex = 0;
  let cameraGoal = null;
  let startedAt = 0;
  let onComplete = null;
  let overlay = null;
  let captionEl = null;
  let kickerEl = null;
  let speakerEl = null;
  let dialogueEl = null;
  let choicesEl = null;
  let counterEl = null;
  let nextBtn = null;
  let reduceMotion = false;
  let lastAdvanceAt = 0;
  let autoAdvanceAt = 0;

  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement('section');
    overlay.id = 'kitcity-comic-scene';
    overlay.className = 'comic-scene hidden';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'KitCity story scene');
    overlay.innerHTML = `
      <div class="comic-scene-top"><span class="comic-brand">KITCITY <i>·</i> THE T3KIT CHRONICLES</span><button type="button" class="comic-skip">SKIP SCENE ↗</button></div>
      <div class="comic-scene-frame">
        <div class="comic-frame-stamp">ISSUE 001</div>
        <div class="comic-card-symbol" aria-hidden="true"><span> T3 </span><b>KIT</b></div>
        <div class="comic-caption"><small class="comic-kicker"></small><p class="comic-caption-text"></p></div>
      </div>
      <div class="comic-dialogue">
        <div class="comic-dialogue-meta"><span class="comic-speaker"></span><span class="comic-counter"></span></div>
        <p class="comic-dialogue-text"></p>
        <div class="comic-choices"></div>
        <div class="comic-actions"><span class="comic-hint">A STORY IN MOTION · LAGOS</span><button type="button" class="comic-next">NEXT PANEL →</button></div>
      </div>`;
    document.body.appendChild(overlay);
    captionEl = overlay.querySelector('.comic-caption-text');
    kickerEl = overlay.querySelector('.comic-kicker');
    speakerEl = overlay.querySelector('.comic-speaker');
    dialogueEl = overlay.querySelector('.comic-dialogue-text');
    choicesEl = overlay.querySelector('.comic-choices');
    counterEl = overlay.querySelector('.comic-counter');
    nextBtn = overlay.querySelector('.comic-next');
    overlay.querySelector('.comic-skip').addEventListener('click', event => {
      event.preventDefault();
      finish();
    });
    // Mobile browsers can occasionally lose a synthetic click over a full-screen canvas.
    // Advance on touch pointer-up, and debounce the follow-up click so one tap means one panel.
    nextBtn.addEventListener('pointerup', event => {
      if (event.pointerType !== 'touch') return;
      event.preventDefault();
      requestAdvance();
    });
    nextBtn.addEventListener('click', event => {
      event.preventDefault();
      requestAdvance();
    });
    overlay.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        finish();
      } else if ((event.key === 'Enter' || event.key === ' ') && event.target === overlay) {
        event.preventDefault();
        requestAdvance();
      }
    });
    reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function worldPosition(object) {
    if (!object) return null;
    const point = new camera.position.constructor();
    object.getWorldPosition(point);
    return point;
  }

  function characters() {
    return {
      softstorm: getCharacter('Softstorm'),
      abdul: getCharacter('IamAbdul'),
    };
  }

  function shotFor(key) {
    const cast = characters();
    const soft = worldPosition(cast.softstorm);
    const abdul = worldPosition(cast.abdul);
    const hero = worldPosition(player);
    let target = hero || new camera.position.constructor(0, 0, 0);
    let position;
    const mobilePortrait = window.matchMedia('(max-width: 699px) and (orientation: portrait)').matches;
    if (key === 'wide' || key === 'clue' || key === 'conversation') {
      if (soft && abdul) target = soft.clone().add(abdul).multiplyScalar(.5);
      else target = soft || abdul || target;
      // Keep the full pair visible on portrait phones: the narrow screen needs
      // a wider establishing shot, not a close-up that crops either character.
      const height = key === 'clue'
        ? (mobilePortrait ? 8 : 11)
        : key === 'conversation' ? (mobilePortrait ? 8.5 : 5.8)
        : (mobilePortrait ? 10 : 17);
      const distance = key === 'clue'
        ? (mobilePortrait ? 27 : 20)
        : key === 'conversation' ? (mobilePortrait ? 30 : 13.5)
        : (mobilePortrait ? 32 : 28);
      position = target.clone().add(new camera.position.constructor(0, height, distance));
    } else if (key === 'abdul') {
      target = abdul || soft || target;
      position = target.clone().add(new camera.position.constructor(8, 4.5, 8));
    } else if (key === 'softstorm') {
      target = soft || abdul || target;
      position = target.clone().add(new camera.position.constructor(-8, 4.5, 8));
    } else {
      target = hero || soft || abdul || target;
      position = target.clone().add(new camera.position.constructor(7, 4, 8));
    }
    return { position, target: target.clone().add(new camera.position.constructor(0, 1.8, 0)) };
  }

  function show(index) {
    panelIndex = Math.max(0, Math.min(index, OPENING_PANELS.length - 1));
    const panel = OPENING_PANELS[panelIndex];
    const frame = overlay.querySelector('.comic-scene-frame');
    overlay.dataset.shot = panel.shot;
    overlay.classList.toggle('has-card', !!panel.card);
    overlay.classList.toggle('has-dialogue', !!panel.speaker);
    overlay.classList.toggle('has-choices', !!panel.choices);
    kickerEl.textContent = panel.kicker || (panel.speaker ? 'LAGOS · A CONVERSATION' : '');
    captionEl.textContent = panel.caption || '';
    speakerEl.textContent = panel.speaker ? (SPEAKER_LABELS[panel.speaker] || panel.speaker.toUpperCase()) : '';
    dialogueEl.textContent = panel.text || '';
    counterEl.textContent = String(panelIndex + 1).padStart(2, '0') + ' / ' + String(OPENING_PANELS.length).padStart(2, '0');
    choicesEl.innerHTML = '';
    if (panel.choices) {
      panel.choices.forEach(choice => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'comic-choice';
        button.textContent = choice.label;
        button.addEventListener('click', () => show(choice.target));
        choicesEl.appendChild(button);
      });
    }
    choicesEl.classList.toggle('hidden', !panel.choices);
    nextBtn.classList.toggle('hidden', !!panel.choices);
    nextBtn.textContent = panel.finish ? 'ENTER THE STORY →' : 'TAP TO CONTINUE →';
    cameraGoal = shotFor(panel.shot);
    startedAt = performance.now();
    // Cinematic panels advance on their own; dialogue stays up long enough to read.
    const textLength = (panel.text || panel.caption || '').length;
    const holdMs = panel.choices ? 0
      : panel.finish ? 3600
      : panel.speaker ? Math.min(7200, Math.max(3000, 1900 + textLength * 42))
      : panel.shot === 'wide' ? 2600
      : Math.min(5200, Math.max(3000, 2100 + textLength * 34));
    autoAdvanceAt = holdMs ? startedAt + holdMs : 0;
    frame.classList.remove('panel-enter');
    void frame.offsetWidth;
    frame.classList.add('panel-enter');
    overlay.querySelector('.comic-dialogue').classList.remove('dialogue-enter');
    void overlay.querySelector('.comic-dialogue').offsetWidth;
    overlay.querySelector('.comic-dialogue').classList.add('dialogue-enter');
  }

  function requestAdvance() {
    const now = performance.now();
    if (now - lastAdvanceAt < 350) return;
    lastAdvanceAt = now;
    advance();
  }

  function advance() {
    const panel = OPENING_PANELS[panelIndex];
    if (panel && panel.finish) {
      finish();
      return;
    }
    if (panel && panel.next === 'next') show(panelIndex + 1);
  }

  function finish() {
    if (!active) return;
    active = false;
    document.body.classList.remove('kitcity-story-active');
    document.documentElement.classList.remove('kitcity-story-active');
    if (overlay) overlay.classList.add('hidden');
    setModal(false);
    cameraGoal = null;
    autoAdvanceAt = 0;
    if (onComplete) {
      const done = onComplete;
      onComplete = null;
      done();
    }
  }

  function playOpening(done) {
    ensureOverlay();
    onComplete = done;
    active = true;
    panelIndex = 0;
    lastAdvanceAt = 0;
    autoAdvanceAt = 0;
    document.body.classList.add('kitcity-story-active');
    document.documentElement.classList.add('kitcity-story-active');
    setModal(true);
    overlay.classList.remove('hidden');
    show(0);
  }

  function update(dt, time) {
    if (!active) return;
    if (!cameraGoal) cameraGoal = shotFor('wide');
    const smooth = reduceMotion ? 1 : 1 - Math.pow(.0008, Math.max(0, dt));
    camera.position.lerp(cameraGoal.position, smooth);
    const look = cameraGoal.target;
    camera.lookAt(look.x, look.y, look.z);
    const cast = characters();
    const speaker = OPENING_PANELS[panelIndex] && OPENING_PANELS[panelIndex].speaker;
    const lead = speaker === 'Softstorm' ? cast.softstorm : speaker === 'IamAbdul' ? cast.abdul : null;
    const other = lead === cast.softstorm ? cast.abdul : cast.softstorm;
    if (lead && other) {
      const a = worldPosition(lead), b = worldPosition(other);
      // Keep the pair facing each other and frame both, rather than cutting to an isolated NPC.
      if (a && b) {
        lead.rotation.y = Math.atan2(b.x - a.x, b.z - a.z);
        other.rotation.y = Math.atan2(a.x - b.x, a.z - b.z);
      }
      if (animateCharacter) {
        animateCharacter(lead, time * 2.4, .16, -.025);
        animateCharacter(other, time * 1.35, .045, 0);
      }
      const u = lead.userData || {};
      if (u.armR && u.armR.sh) u.armR.sh.rotation.z = Math.sin(time * 2.4) * .22 - .22;
      if (u.head) u.head.rotation.y = Math.sin(time * 1.8) * .08;
      const listener = other.userData || {};
      if (listener.head) listener.head.rotation.y = Math.sin(time * 1.3 + .7) * .09;
    }
    // Non-choice panels continue after their reading beat; choices intentionally pause.
    if (autoAdvanceAt && performance.now() >= autoAdvanceAt) {
      autoAdvanceAt = 0;
      advance();
    }
    const hero = player;
    if (hero && panelIndex === 4 && animateCharacter) animateCharacter(hero, time * 1.4, .04, 0);
    overlay.style.setProperty('--panel-beat', String((performance.now() - startedAt) / 1000));
  }

  return { playOpening, update, get active() { return active; } };
}
