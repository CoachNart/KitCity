const SPEAKER_LABELS = {
  Softstorm: 'THE ONE WITH THE CARD',
  IamAbdul: 'THE ONE WHO HEARD IT FIRST',
};

const OPENING_PANELS = [
  { shot: 'wide', kicker: 'LAGOS · 3:42 PM', caption: 'Nothing unusual. Just another day.', next: 'next' },
  { shot: 'abdul', speaker: 'IamAbdul', text: 'So this T3Kit thing connects all these people?', next: 'next' },
  { shot: 'softstorm', speaker: 'Softstorm', text: 'That’s what I’m trying to figure out. The same name keeps showing up in places that should have nothing in common.', next: 'next' },
  { shot: 'abdul', speaker: 'IamAbdul', text: 'Then why does nobody explain what it is?', next: 'next' },
  { shot: 'player', kicker: 'YOUR THOUGHTS', caption: 'T3Kit? First time you’ve heard that name. But now you want to know why it keeps appearing.', next: 'next' },
  { shot: 'wide', kicker: 'YOUR MOVE', caption: 'What do you do?', choices: [
    { label: 'Walk over and ask them', target: 6 },
    { label: 'Stay back and listen a little longer', target: 7 },
  ] },
  { shot: 'softstorm', speaker: 'Softstorm', text: 'You heard us, abi? Fair enough. If you want answers, start with the people and places connected to that name.', next: 'next' },
  { shot: 'abdul', speaker: 'IamAbdul', text: 'I saw that symbol on an old meetup poster too. Same mark. Different place. That can’t be a coincidence.', next: 'next' },
  { shot: 'clue', kicker: 'CLUE ACQUIRED · 001', caption: 'A cyan mark. One name. Two people who don’t have the full story. Your journey starts here.', card: true, finish: true },
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
    overlay.querySelector('.comic-skip').addEventListener('click', finish);
    nextBtn.addEventListener('click', advance);
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
    if (key === 'wide' || key === 'clue') {
      if (soft && abdul) target = soft.clone().add(abdul).multiplyScalar(.5);
      else target = soft || abdul || target;
      position = target.clone().add(new camera.position.constructor(0, key === 'clue' ? 11 : 17, key === 'clue' ? 20 : 28));
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
    nextBtn.textContent = panel.finish ? 'ENTER THE STORY →' : 'NEXT PANEL →';
    cameraGoal = shotFor(panel.shot);
    startedAt = performance.now();
    frame.classList.remove('panel-enter');
    void frame.offsetWidth;
    frame.classList.add('panel-enter');
    overlay.querySelector('.comic-dialogue').classList.remove('dialogue-enter');
    void overlay.querySelector('.comic-dialogue').offsetWidth;
    overlay.querySelector('.comic-dialogue').classList.add('dialogue-enter');
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
    if (overlay) overlay.classList.add('hidden');
    setModal(false);
    cameraGoal = null;
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
      if (a && b) lead.rotation.y = Math.atan2(b.x - a.x, b.z - a.z);
      if (animateCharacter) animateCharacter(lead, time * 2.4, .16, -.025);
      const u = lead.userData || {};
      if (u.armR && u.armR.sh) u.armR.sh.rotation.z = Math.sin(time * 2.4) * .28 - .35;
      if (other && animateCharacter) animateCharacter(other, time * 1.2, .035, 0);
    }
    const hero = player;
    if (hero && panelIndex === 4 && animateCharacter) animateCharacter(hero, time * 1.4, .04, 0);
    overlay.style.setProperty('--panel-beat', String((performance.now() - startedAt) / 1000));
  }

  return { playOpening, update, get active() { return active; } };
}
