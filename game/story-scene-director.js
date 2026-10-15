const SPEAKER_LABELS = {
  Softstorm: 'THE ONE WHO BUILDS',
  IamAbdul: 'THE ONE ASKING QUESTIONS',
};

const OPENING_PANELS = [
  { shot: 'wide', kicker: 'LAGOS · A BUSY AFTERNOON', caption: 'Lagos is moving at its usual pace. Everywhere, people are looking for work, building businesses, and searching for their next opportunity.', next: 'next' },
  { shot: 'conversation', speaker: 'IamAbdul', text: 'Everybody dey talk about Web3 these days. New tokens, new apps, new opportunities. But wetin people really dey do with am?', next: 'next' },
  { shot: 'softstorm', speaker: 'Softstorm', text: 'Web3 is bigger than tokens. It can change how people build, own digital things, work together, and take part in online communities.', next: 'next' },
  { shot: 'abdul', speaker: 'IamAbdul', text: 'So person fit build something useful online without waiting for one big company to give them permission?', next: 'next' },
  { shot: 'softstorm', speaker: 'Softstorm', text: 'In some systems, yes. People can build apps, contribute to open communities, create digital assets, and work with others. But every project is different.', next: 'next' },
  { shot: 'abdul', speaker: 'IamAbdul', text: 'E sound interesting. But I don see people lose money too. Everybody dey promise opportunity.', next: 'next' },
  { shot: 'character', speaker: 'PLAYER', text: 'I have been hearing about Web3 too. I want to understand how it actually works, not just what people promise.', next: 'next' },
  { shot: 'softstorm', speaker: 'Softstorm', text: 'Then start with the basics. Understand wallets, digital ownership, transactions, and the permissions you give an application. Never connect blindly.', next: 'next' },
  { shot: 'abdul', speaker: 'IamAbdul', text: 'Apart from trading, wetin person fit actually do for Web3?', next: 'next' },
  { shot: 'softstorm', speaker: 'Softstorm', text: 'Build software. Design products. Create content. Research projects. Support communities. There are different paths, but none comes with guaranteed money or success.', next: 'next' },
  { shot: 'character', speaker: 'PLAYER', text: 'So person fit start from zero, learn skills, practise, and find their own path?', next: 'next' },
  { shot: 'softstorm', speaker: 'Softstorm', text: 'Exactly. Learn how things work, ask questions, practise safely, and judge opportunities by what they actually do—not by the hype around them.', next: 'next' },
  { shot: 'abdul', speaker: 'IamAbdul', text: 'Maybe the real problem no be the technology itself. Maybe na how people dey use am.', next: 'next' },
  { shot: 'softstorm', speaker: 'Softstorm', text: 'Technology can create possibilities, but it cannot replace good judgement. If we chase only hype and quick money, we can miss what makes it useful.', next: 'next' },
  { shot: 'character', speaker: 'PLAYER', text: 'Then I want to see for myself—the good, the bad, the risks, and the real opportunities.', next: 'next' },
  { shot: 'clue', kicker: 'THE JOURNEY BEGINS', caption: 'Lagos is full of people with problems to solve and ideas to explore. Step into the city, meet its people, and discover Web3 through the choices you make.', card: true, finish: true },
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
    if (key === 'wide' || key === 'clue' || key === 'conversation' || (key === 'character' && !genericScene)) {
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
    } else if (key === 'character') {
      const castPoints = typeof getCharacters === 'function' ? getCharacters().map(worldPosition).filter(Boolean) : [];
      if (castPoints.length) {
        const minX = Math.min(...castPoints.map(point => point.x));
        const maxX = Math.max(...castPoints.map(point => point.x));
        const minZ = Math.min(...castPoints.map(point => point.z));
        const maxZ = Math.max(...castPoints.map(point => point.z));
        target = new camera.position.constructor((minX + maxX) / 2, 0, (minZ + maxZ) / 2);
        const spanX = maxX - minX, spanZ = maxZ - minZ;
        const distance = mobilePortrait
          ? Math.max(38, spanX * 2.5 + 24, spanZ * 2.5 + 24)
          : Math.max(24, spanX * 1.65 + 16, spanZ * 1.65 + 16);
        const height = mobilePortrait ? Math.max(10, distance * .25) : Math.max(7, distance * .22);
        position = target.clone().add(new camera.position.constructor(0, height, distance));
      } else {
        target = worldPosition(speaker && getCharacter(speaker)) || hero || soft || abdul || target;
        position = target.clone().add(new camera.position.constructor(mobilePortrait ? 7 : 4, mobilePortrait ? 6 : 3.5, mobilePortrait ? 23 : 9));
      }
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

    // Dialogue bubbles are short-lived, but the conversation must continue:
    // advance to the next panel after the current bubble has had time to be read.
    // A panel-index guard prevents an old timer from hiding or advancing a newer bubble.
    if (bubbleOn) {
      const shownIndex = panelIndex;
      const readTime = Math.min(8500, Math.max(5200, String(panel.text || '').length * 55));
      speechBubbleTimer = setTimeout(() => {
        if (!active || panelIndex !== shownIndex) return;
        speechBubble.classList.add('hidden');
        // Move from the final spoken line straight to its next story beat,
        // including the closing card. Otherwise the bubble disappears and leaves
        // the player stuck on the previous panel until they tap the screen.
        if (activePanels[shownIndex + 1]) show(shownIndex + 1);
      }, readTime);
    } else if (genericScene && !bubbleOn && !panel.choices && !panel.finish && activePanels[panelIndex + 1]) {
      // Mission conversations begin with an establishing panel that may already
      // name the lead speaker but has no spoken text yet. Auto-advance any such
      // non-dialogue beat so the first real speech bubble appears without a tap.
      // Keep choice and finish panels player-controlled.
      const shownIndex = panelIndex;
      speechBubbleTimer = setTimeout(() => {
        if (!active || panelIndex !== shownIndex) return;
        show(shownIndex + 1);
      }, 2200);
    }
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
