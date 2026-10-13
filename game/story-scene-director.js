const SPEAKER_LABELS = {
  Softstorm: 'THE ONE WITH THE CARD',
  IamAbdul: 'THE ONE WHO HEARD IT FIRST',
};

const OPENING_PANELS = [
  { shot: 'wide', kicker: 'LAGOS · 3:42 PM', caption: 'Another day. Another transaction. Another promise of something better.', next: 'next' },
  { shot: 'conversation', speaker: 'IamAbdul', text: 'So this T3Kit thing connects all these people?', next: 'next' },
  { shot: 'conversation', speaker: 'Softstorm', text: 'That’s what I’m trying to figure out. The same name keeps showing up in places that should have nothing in common.', next: 'next' },
  { shot: 'conversation', speaker: 'IamAbdul', text: 'Then why does nobody explain what it is?', next: 'next' },
  { shot: 'player', kicker: 'YOUR THOUGHTS', caption: 'T3Kit? You’ve heard the name for the first time today. But something about the way they’re talking makes you want to know more.', next: 'next' },
  { shot: 'wide', kicker: 'YOUR MOVE', caption: 'What do you do?', choices: [
    { label: 'Walk over and ask them', target: 6 },
    { label: 'Stay back and listen a little longer', target: 7 },
  ] },
  { shot: 'softstorm', speaker: 'Softstorm', text: 'You heard us, abi? Fair enough. We’re trying to understand something ourselves. If you want answers, start with the people connected to it.', next: 'next' },
  { shot: 'abdul', speaker: 'IamAbdul', text: 'I saw that symbol on an old meetup poster too. Same mark. Different place. That can’t be a coincidence.', next: 'next' },
  { shot: 'clue', kicker: 'CLUE ACQUIRED: THE T3KIT MARK', caption: 'One name. Two people. No clear answers.', card: true, finish: true },
];

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
}

export function createStorySceneDirector({ camera, player, getCharacter, animateCharacter, setModal }) {
  let active = false;
  let activePanels = OPENING_PANELS;
  let genericScene = false;
  let panelIndex = 0;
  let cameraGoal = null;
  let startedAt = 0;
  let onComplete = null;
  let overlay = null;
  let speechBubble = null;
  let speechSpeaker = null;
  let speechText = null;
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
      <div class="comic-scene-top"><span class="comic-brand">KITCITY <i>·</i> THE LOST VALUE</span><button type="button" class="comic-skip">SKIP SCENE ↗</button></div>
      <div class="comic-scene-frame">
        <div class="comic-frame-stamp">ISSUE 001</div>
        <div class="comic-card-symbol" aria-hidden="true"><span> T3 </span><b>KIT</b></div>
        <div class="comic-caption"><small class="comic-kicker"></small><p class="comic-caption-text"></p></div>
      </div>
      <div class="comic-speech-bubble hidden" aria-live="polite"><small class="comic-speech-speaker"></small><p class="comic-speech-text"></p></div>
      <div class="comic-dialogue">
        <div class="comic-dialogue-meta"><span class="comic-speaker"></span><span class="comic-counter"></span></div>
        <p class="comic-dialogue-text"></p>
        <div class="comic-choices"></div>
        <div class="comic-actions"><span class="comic-hint">THE LOST VALUE · LAGOS</span><button type="button" class="comic-next">NEXT PANEL →</button></div>
      </div>`;
    document.body.appendChild(overlay);
    speechBubble = overlay.querySelector('.comic-speech-bubble');
    speechSpeaker = overlay.querySelector('.comic-speech-speaker');
    speechText = overlay.querySelector('.comic-speech-text');
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
    overlay.addEventListener('click', event => {
      if (!active || event.target.closest('button')) return;
      const panel = activePanels[panelIndex];
      if (panel && panel.choices) return;
      if (panel && !panel.choices) requestAdvance();
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

  function shotFor(key, speaker) {
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
        ? (mobilePortrait ? 11.5 : 11)
        : key === 'conversation' ? (mobilePortrait ? 11 : 5.8)
        : (mobilePortrait ? 12 : 17);
      const distance = key === 'clue'
        ? (mobilePortrait ? 36 : 20)
        : key === 'conversation' ? (mobilePortrait ? 39 : 13.5)
        : (mobilePortrait ? 42 : 28);
      position = target.clone().add(new camera.position.constructor(0, height, distance));
    } else if (key === 'abdul') {
      target = abdul || soft || target;
      position = target.clone().add(new camera.position.constructor(mobilePortrait ? 11 : 8, mobilePortrait ? 6 : 4.5, mobilePortrait ? 15 : 8));
    } else if (key === 'softstorm') {
      target = soft || abdul || target;
      position = target.clone().add(new camera.position.constructor(mobilePortrait ? -11 : -8, mobilePortrait ? 6 : 4.5, mobilePortrait ? 15 : 8));
    } else if (key === 'character') {
      target = worldPosition(speaker && getCharacter(speaker)) || hero || soft || abdul || target;
      position = target.clone().add(new camera.position.constructor(mobilePortrait ? 7 : 4, mobilePortrait ? 6 : 3.5, mobilePortrait ? 23 : 9));
    } else {
      target = hero || soft || abdul || target;
      position = target.clone().add(new camera.position.constructor(7, 4, 8));
    }
    return { position, target: target.clone().add(new camera.position.constructor(0, 1.8, 0)) };
  }

  function show(index) {
    panelIndex = Math.max(0, Math.min(index, activePanels.length - 1));
    const panel = activePanels[panelIndex];
    const frame = overlay.querySelector('.comic-scene-frame');
    overlay.dataset.shot = panel.shot;
    overlay.classList.toggle('has-card', !!panel.card);
    overlay.classList.toggle('has-dialogue', !!panel.speaker);
    overlay.classList.toggle('has-choices', !!panel.choices);
    overlay.querySelector('.comic-dialogue').classList.toggle('hidden', !panel.choices);
    const bubbleOn = !!(panel.speaker && panel.text && !panel.choices);
    overlay.classList.toggle('has-bubble', bubbleOn || (genericScene && !panel.choices));
    speechBubble.classList.toggle('hidden', !bubbleOn);
    speechSpeaker.textContent = bubbleOn ? panel.speaker.toUpperCase() : '';
    speechText.textContent = bubbleOn ? panel.text : '';
    kickerEl.textContent = panel.kicker || (panel.speaker ? (genericScene ? 'THE LOST VALUE · A CONVERSATION' : 'LAGOS · A CONVERSATION') : '');
    captionEl.textContent = panel.caption || '';
    speakerEl.textContent = panel.speaker ? (genericScene ? panel.speaker.toUpperCase() : (SPEAKER_LABELS[panel.speaker] || panel.speaker.toUpperCase())) : '';
    dialogueEl.textContent = panel.text || '';
    counterEl.textContent = String(panelIndex + 1).padStart(2, '0') + ' / ' + String(activePanels.length).padStart(2, '0');
    overlay.querySelector('.comic-frame-stamp').textContent = genericScene ? 'THE LOST VALUE · ' + String(panelIndex + 1).padStart(2, '0') : 'ISSUE 001';
    choicesEl.innerHTML = '';
    if (panel.choices) {
      panel.choices.forEach(choice => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'comic-choice';
        button.textContent = choice.label;
        button.addEventListener('click', () => {
          if (typeof choice.onSelect === 'function') { choice.onSelect(); finish(); }
          else show(choice.target);
        });
        choicesEl.appendChild(button);
      });
    }
    choicesEl.classList.toggle('hidden', !panel.choices);
    nextBtn.classList.toggle('hidden', !!panel.choices);
    nextBtn.textContent = panel.finish ? (genericScene ? 'RETURN TO MISSION →' : 'ENTER THE STORY →') : 'TAP TO CONTINUE →';
    cameraGoal = shotFor(panel.shot, panel.speaker);
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
    const panel = activePanels[panelIndex];
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
    activePanels = OPENING_PANELS;
    genericScene = false;
  }

  function playOpening(done) {
    ensureOverlay();
    activePanels = OPENING_PANELS;
    genericScene = false;
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

  function playPanels(panels, done) {
    if (!Array.isArray(panels) || !panels.length) { if (done) done(); return; }
    ensureOverlay();
    activePanels = panels;
    genericScene = true;
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
    const panel = activePanels[panelIndex];
    if (speechBubble && !speechBubble.classList.contains('hidden') && panel && panel.speaker) {
      const speakerObject = panel.speaker === 'PLAYER' ? player : getCharacter(panel.speaker);
      const point = worldPosition(speakerObject);
      if (point) {
        point.y += 3.3;
        point.project(camera);
        const x = (point.x * .5 + .5) * window.innerWidth;
        const y = (-point.y * .5 + .5) * window.innerHeight - 10;
        const bubbleWidth = speechBubble.offsetWidth || 280;
        const bubbleHeight = speechBubble.offsetHeight || 90;
        const halfBubble = bubbleWidth / 2;
        const dialogueTop = overlay.querySelector('.comic-dialogue').getBoundingClientRect().top;
        const minAnchorY = bubbleHeight + 12;
        const maxAnchorY = Math.max(minAnchorY, Math.min(dialogueTop - 12, window.innerHeight - 12));
        speechBubble.style.left = Math.max(halfBubble + 12, Math.min(window.innerWidth - halfBubble - 12, x)) + 'px';
        speechBubble.style.top = Math.max(minAnchorY, Math.min(maxAnchorY, y)) + 'px';
      }
    }
    if (genericScene) {
      const lead = panel && panel.speaker ? (panel.speaker === 'PLAYER' ? player : getCharacter(panel.speaker)) : null;
      if (lead && animateCharacter) {
        animateCharacter(lead, time * 2.2, .12, -.025);
        const u = lead.userData || {};
        if (u.armR && u.armR.sh) u.armR.sh.rotation.z = Math.sin(time * 2.2) * .2 - .2;
        if (u.head) u.head.rotation.y = Math.sin(time * 1.8) * .07;
      }
    } else {
      const cast = characters();
      const speaker = panel && panel.speaker;
      const lead = speaker === 'Softstorm' ? cast.softstorm : speaker === 'IamAbdul' ? cast.abdul : null;
      const other = lead === cast.softstorm ? cast.abdul : cast.softstorm;
      if (lead && other) {
        const a = worldPosition(lead), b = worldPosition(other);
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
    }
    // Non-choice panels continue after their reading beat; choices intentionally pause.
    if (autoAdvanceAt && performance.now() >= autoAdvanceAt) {
      autoAdvanceAt = 0;
      advance();
    }
    const hero = player;
    if (!genericScene && hero && panelIndex === 4 && animateCharacter) animateCharacter(hero, time * 1.4, .04, 0);
    overlay.style.setProperty('--panel-beat', String((performance.now() - startedAt) / 1000));
  }

  return { playOpening, playPanels, update, get active() { return active; } };
}
