const SPEAKER_LABELS = {
  Softstorm: 'THE ONE WHO BUILDS',
  IamAbdul: 'THE ONE ASKING QUESTIONS',
};

const OPENING_PANELS = [
  { shot: 'wide', kicker: 'LAGOS · 3:42 PM', caption: 'The city is full of people chasing opportunities. But what makes an opportunity worth believing in?', next: 'next' },
  { shot: 'conversation', speaker: 'IamAbdul', text: 'Everybody is talking about Web3. Tokens, projects, new platforms. But what are people actually building with all this?', next: 'next' },
  { shot: 'softstorm', speaker: 'Softstorm', text: 'There’s real potential here. People can learn new skills, build products, find work, create together, and solve problems that matter.', next: 'next' },
  { shot: 'abdul', speaker: 'IamAbdul', text: 'Then why does the conversation always come back to hype and price?', next: 'next' },
  { shot: 'player', kicker: 'YOUR THOUGHTS', caption: 'You’ve heard the promises too. You want to see what this world can actually offer—and what happens when people forget why they started.', next: 'next' },
  { shot: 'wide', kicker: 'YOUR MOVE', caption: 'Softstorm and IamAbdul are still talking. What do you do?', choices: [
    { label: 'Walk over and join the conversation', target: 6 },
    { label: 'Listen a little longer before speaking', target: 7 },
  ] },
  { shot: 'character', speaker: 'PLAYER', text: 'Sorry, I caught part of that. I’m curious too—what does building something useful in Web3 actually look like?', next: 8 },
  { shot: 'abdul', speaker: 'IamAbdul', text: 'I was wondering the same thing. Everybody has a pitch. I want to see what people can really do with it.', next: 8 },
  { shot: 'softstorm', speaker: 'Softstorm', text: 'That’s a fair question. T3kit is an ecosystem with different ways into Web3: KitLab helps people learn, while the wider ecosystem supports career paths, building, creating, and tools that make trading easier to understand.', next: 'next' },
  { shot: 'abdul', speaker: 'IamAbdul', text: 'And KitArcade is the gaming side, right? A place to explore, meet people, and discover how these ideas connect to real life.', next: 'next' },
  { shot: 'character', speaker: 'PLAYER', text: 'Then why call this story The Lost Value?', next: 'next' },
  { shot: 'softstorm', speaker: 'Softstorm', text: 'Because value was never just a token price. It was what people could learn, what they could create, the problems they could solve, and the opportunities they could open for others.', next: 'next' },
  { shot: 'abdul', speaker: 'IamAbdul', text: 'We can have more projects, more money, and more attention—and still lose sight of what made any of it worthwhile.', next: 'next' },
  { shot: 'wide', kicker: 'THE LOST VALUE', caption: 'Learn. Build. Create. Contribute. The journey begins with one question: are we making something valuable for people, or have we become distracted by everything around it?', next: 'next' },
  { shot: 'clue', kicker: 'PROLOGUE COMPLETE', caption: 'Your first lead is waiting in Lagos. Find out what people were promised—and what they actually received.', card: true, finish: true },
];
function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
}

export function createStorySceneDirector({ camera, player, getCharacter, getCharacters, animateCharacter, setModal, getLanguage }) {
  // Keep source copy intact here; the shared DOM localization observer translates it once and retains the source for language switching.
  const localized = value => String(value == null ? '' : value);
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
  let speechBubbleTimer = 0;

  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement('section');
    overlay.id = 'kitcity-comic-scene';
    overlay.className = 'comic-scene hidden';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', localized('KitCity story scene'));
    overlay.innerHTML = `
      <div class="comic-scene-top"><span class="comic-brand">KITCITY <i>·</i> THE LOST VALUE</span><button type="button" class="comic-skip">SKIP SCENE ↗</button></div>
      <div class="comic-scene-frame">
        <div class="comic-frame-stamp">ISSUE 001</div>
        <div class="comic-card-symbol" aria-hidden="true"><span>3</span><b>KIT</b></div>
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
    overlay.querySelector('.comic-skip').textContent = localized('SKIP SCENE ↗');
    overlay.querySelector('.comic-hint').textContent = localized('THE LOST VALUE · LAGOS');
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
    if (key === 'wide' || key === 'clue' || key === 'conversation' || key === 'character') {
      // The opening scene is staged as one three-person conversation, not separate
      // shots that strand the player away from the two NPCs.
      const points = [hero, soft, abdul].filter(Boolean);
      if (points.length) {
        target = points.reduce((sum, point) => sum.add(point), new camera.position.constructor(0, 0, 0)).multiplyScalar(1 / points.length);
      } else target = soft || abdul || hero || target;
      // Keep the full pair visible on portrait phones: the narrow screen needs
      // a wider establishing shot, not a close-up that crops either character.
      const height = key === 'clue'
        ? (mobilePortrait ? 11.5 : 11)
        : key === 'conversation' ? (mobilePortrait ? 10 : 6.5)
        : key === 'character' ? (mobilePortrait ? 12 : 8)
        : (mobilePortrait ? 12 : 17);
      const distance = key === 'clue'
        ? (mobilePortrait ? 36 : 20)
        : key === 'conversation' ? (mobilePortrait ? 35 : 16)
        : key === 'character' ? (mobilePortrait ? 38 : 19)
        : (mobilePortrait ? 42 : 28);
      position = target.clone().add(new camera.position.constructor(0, height, distance));
    } else if (key === 'abdul') {
      target = abdul || soft || target;
      position = target.clone().add(new camera.position.constructor(mobilePortrait ? 11 : 8, mobilePortrait ? 6 : 4.5, mobilePortrait ? 15 : 8));
    } else if (key === 'softstorm') {
      target = soft || abdul || target;
      position = target.clone().add(new camera.position.constructor(mobilePortrait ? -11 : -8, mobilePortrait ? 6 : 4.5, mobilePortrait ? 15 : 8));
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
    clearTimeout(speechBubbleTimer);
    speechBubble.classList.toggle('hidden', !bubbleOn);
    if (bubbleOn) speechBubbleTimer = setTimeout(() => speechBubble.classList.add('hidden'), 4800);
    speechSpeaker.textContent = bubbleOn ? localized(panel.speaker === 'PLAYER' ? 'You' : panel.speaker.toUpperCase()) : '';
    speechText.textContent = bubbleOn ? localized(panel.text) : '';
    kickerEl.textContent = localized(panel.kicker || (panel.speaker ? (genericScene ? 'THE LOST VALUE · A CONVERSATION' : 'LAGOS · A CONVERSATION') : ''));
    captionEl.textContent = localized(panel.caption || '');
    speakerEl.textContent = panel.speaker ? localized(panel.speaker === 'PLAYER' ? 'You' : (genericScene ? panel.speaker.toUpperCase() : (SPEAKER_LABELS[panel.speaker] || panel.speaker.toUpperCase()))) : '';
    dialogueEl.textContent = localized(panel.text || '');
    counterEl.textContent = String(panelIndex + 1).padStart(2, '0') + ' / ' + String(activePanels.length).padStart(2, '0');
    overlay.querySelector('.comic-frame-stamp').textContent = genericScene ? 'THE LOST VALUE · ' + String(panelIndex + 1).padStart(2, '0') : 'ISSUE 001';
    choicesEl.innerHTML = '';
    if (panel.choices) {
      panel.choices.forEach(choice => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'comic-choice';
        button.textContent = localized(choice.label);
        button.addEventListener('click', () => {
          if (typeof choice.onSelect === 'function') {
            choice.onSelect();
            if (panel.continueAfterChoice && panelIndex < activePanels.length - 1) show(panelIndex + 1);
            else finish();
          } else show(choice.target);
        });
        choicesEl.appendChild(button);
      });
    }
    choicesEl.classList.toggle('hidden', !panel.choices);
    nextBtn.classList.toggle('hidden', !!panel.choices);
    nextBtn.textContent = localized(panel.finish ? (genericScene ? 'RETURN TO MISSION →' : 'ENTER THE STORY →') : 'TAP TO CONTINUE →');
    cameraGoal = shotFor(panel.shot, panel.speaker);
    startedAt = performance.now();
    // Keep every story/caption card on screen until the player continues.
    // This is especially important on mobile, where reading speed varies.
    autoAdvanceAt = 0;
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
    else if (panel && Number.isInteger(panel.next)) show(panel.next);
  }

  function finish() {
    if (!active) return;
    active = false;
    clearTimeout(speechBubbleTimer);
    if (speechBubble) speechBubble.classList.add('hidden');
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
    // Panels are deliberately player-paced; no card disappears automatically.
    const hero = player;
    if (!genericScene && hero && panelIndex === 4 && animateCharacter) animateCharacter(hero, time * 1.4, .04, 0);
    overlay.style.setProperty('--panel-beat', String((performance.now() - startedAt) / 1000));
  }

  return { playOpening, playPanels, update, get active() { return active; } };
}
