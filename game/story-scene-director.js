const OPENING_LINES = [
  { speaker: 'Softstorm', text: "I'm telling you, the transfer went through. He sent me the screenshot twice." },
  { speaker: 'IamAbdul', text: "Screenshot no be money, abeg. Has the shop actually received it?" },
  { speaker: 'Softstorm', text: "The buyer is already coming for the laptop. If this payment is fake, na me go explain." },
  { speaker: 'IamAbdul', text: "Then hold the laptop. Get the transaction details and check the recipient address. No guessing." },
  { speaker: 'PLAYER', text: "Abeg, wetin una dey argue about?" },
  { speaker: 'Softstorm', text: "Buyer says he paid 120 USDC. All we have is a screenshot." },
  { speaker: 'PLAYER', text: "Wait, so una never see the money, but he wants to collect the laptop?" },
  { speaker: 'IamAbdul', text: "Exactly. I'll head back to my office across the block. Come find me there, and I'll show you how to check it." },
  { speaker: 'Softstorm', text: "Help us first. If you're right, breakfast is on me." },
  { speaker: 'PLAYER', text: "Now you're speaking my language." },
];;

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
}

export function createStorySceneDirector({ camera, player, getCharacter, animateCharacter, setModal }) {
  let active = false;
  let startedAt = 0;
  let nextLineAt = 0;
  let lineIndex = -1;
  let onComplete = null;
  let titleCard = null;
  let skipButton = null;
  let bubbles = [];
  let bubbleBySpeaker = Object.create(null);
  let titleTimer = 0;
  let closingTimer = 0;
  let navControls = null;
  let manualAdvance = false;

  function ensureScene() {
    if (titleCard) return;
    titleCard = document.createElement('div');
    titleCard.className = 'kitcity-intro-card';
    titleCard.innerHTML = '<div class="kitcity-intro-copy"><small>KITCITY · LAGOS STATE</small><strong>JUST ANOTHER DAY</strong><span>8:17 AM · Lagos, Nigeria</span></div><button type="button" class="kitcity-intro-skip">Skip intro</button>';
    document.body.appendChild(titleCard);
    skipButton = titleCard.querySelector('.kitcity-intro-skip');
    skipButton.addEventListener('click', event => {
      event.preventDefault();
      finish();
    });
    bubbles = [];
    bubbleBySpeaker = Object.create(null);
    navControls = document.createElement('div');
    navControls.className = 'kitcity-dialogue-nav';
    navControls.setAttribute('aria-label', 'Dialogue controls');
    navControls.innerHTML = '<button type="button" data-step="-1" aria-label="Previous dialogue" title="Previous">‹ Prev</button><span aria-live="polite"></span><button type="button" data-step="1" aria-label="Next dialogue" title="Next">Next ›</button>';
    document.body.appendChild(navControls);
    navControls.addEventListener('click', event => {
      const button = event.target.closest('button[data-step]');
      if (!button || !active) return;
      event.preventDefault();
      const step = Number(button.dataset.step);
      if (step > 0 && lineIndex >= OPENING_LINES.length - 1) { finish(); return; }
      manualAdvance = true;
      const target = Math.max(0, Math.min(OPENING_LINES.length - 1, lineIndex + step));
      showLine(target);
    });
    ['Softstorm', 'IamAbdul', 'PLAYER'].forEach(speaker => {
      const el = document.createElement('div');
      el.className = 'kitcity-speech-bubble hidden';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.innerHTML = '<small class="kitcity-bubble-speaker"></small><p></p>';
      document.body.appendChild(el);
      el.dataset.speaker = speaker;
      bubbles.push(el);
      bubbleBySpeaker[speaker] = el;
    });
  }

  function actorFor(speaker) {
    if (speaker === 'PLAYER') return player;
    return getCharacter(speaker);
  }

  function hideBubbles() {
    bubbles.forEach(el => el.classList.add('hidden'));
  }

  function showLine(index) {
    const line = OPENING_LINES[index];
    if (!line) return;
    hideBubbles();
    const bubble = bubbleBySpeaker[line.speaker];
    if (!bubble) return;
    bubble.querySelector('.kitcity-bubble-speaker').textContent =
      line.speaker === 'PLAYER' ? 'YOU' : line.speaker.toUpperCase();
    bubble.querySelector('p').textContent = line.text;
    bubble.classList.remove('hidden', 'bubble-pop');
    void bubble.offsetWidth;
    bubble.classList.add('bubble-pop');
    lineIndex = index;
    const readTime = Math.min(9000, Math.max(5200, line.text.length * 82));
    nextLineAt = manualAdvance ? Number.POSITIVE_INFINITY : performance.now() + readTime;
    if (navControls) {
      navControls.classList.remove('hidden');
      navControls.querySelector('span').textContent = (index + 1) + ' / ' + OPENING_LINES.length;
      navControls.querySelector('[data-step="-1"]').disabled = index <= 0;
      navControls.querySelector('[data-step="1"]').textContent = index >= OPENING_LINES.length - 1 ? 'Finish ›' : 'Next ›';
    }
  }

  function finish() {
    if (!active) return;
    active = false;
    clearTimeout(titleTimer);
    clearTimeout(closingTimer);
    hideBubbles();
    if (navControls) navControls.classList.add('hidden');
    if (titleCard) titleCard.classList.add('hidden');
    document.body.classList.remove('kitcity-intro-active');
    document.documentElement.classList.remove('kitcity-intro-active');
    if (setModal) setModal(false);
    if (onComplete) {
      const done = onComplete;
      onComplete = null;
      done();
    }
  }

  function playOpening(done) {
    ensureScene();
    onComplete = done;
    active = true;
    lineIndex = -1;
    manualAdvance = false;
    startedAt = performance.now();
    nextLineAt = startedAt + 1050;
    document.body.classList.add('kitcity-intro-active');
    document.documentElement.classList.add('kitcity-intro-active');
    titleCard.classList.remove('hidden');
    hideBubbles();
    if (setModal) setModal(false);
    titleTimer = setTimeout(() => {
      if (titleCard) titleCard.classList.add('intro-card-fade');
    }, 2600);
  }

  function positionBubble(el, speaker) {
    const actor = actorFor(speaker);
    if (!actor || !actor.visible) {
      el.classList.add('hidden');
      return;
    }
    const point = new camera.position.constructor();
    actor.getWorldPosition(point);
    point.y += speaker === 'PLAYER' ? 4.1 : 4.5;
    point.project(camera);
    const canvas = document.querySelector('#gl');
    const rect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0, width: innerWidth, height: innerHeight };
    const x = rect.left + (point.x * .5 + .5) * rect.width;
    const y = rect.top + (-point.y * .5 + .5) * rect.height;
    const visible = point.z > -1 && point.z < 1 && x > rect.left - 80 && x < rect.right + 80 && y > rect.top - 30 && y < rect.bottom + 30;
    if (!visible) {
      el.classList.add('offscreen');
      return;
    }
    el.classList.remove('offscreen');
    // Keep the full bubble inside the viewport on narrow phones and edge actors.
    const margin = 10;
    const width = Math.min(el.offsetWidth || 300, window.innerWidth - margin * 2);
    const height = el.offsetHeight || 80;
    const left = Math.max(margin + width / 2, Math.min(window.innerWidth - margin - width / 2, x));
    const top = Math.max(margin + height, Math.min(window.innerHeight - margin, y));
    el.style.left = left + 'px';
    el.style.top = top + 'px';
  }

  function update(dt, time) {
    if (!active) return;
    const now = performance.now();
    if (lineIndex < 0 && now >= nextLineAt) showLine(0);
    else if (lineIndex >= 0 && now >= nextLineAt) {
      if (lineIndex + 1 < OPENING_LINES.length) showLine(lineIndex + 1);
      else {
        hideBubbles();
        if (navControls) navControls.classList.add('hidden');
        if (titleCard) {
          titleCard.querySelector('.kitcity-intro-copy').innerHTML =
            '<small>YOUR STORY STARTS HERE</small><strong>DON\'T TRUST A SCREENSHOT.</strong><span>Find out what really happened.</span>';
          titleCard.classList.remove('intro-card-fade');
        }
        closingTimer = setTimeout(finish, 1750);
        nextLineAt = Number.POSITIVE_INFINITY;
      }
    }
    camera.updateMatrixWorld();
    bubbles.forEach(el => positionBubble(el, el.dataset.speaker));
    ['Softstorm', 'IamAbdul'].forEach((name, index) => {
      const actor = getCharacter(name);
      if (!actor || !actor.visible) return;
      const other = getCharacter(name === 'Softstorm' ? 'IamAbdul' : 'Softstorm');
      if (other) actor.rotation.y = Math.atan2(other.position.x - actor.position.x, other.position.z - actor.position.z);
      if (animateCharacter) animateCharacter(actor, time * (index ? 1.2 : 1.7), index ? .08 : .18, -.01);
      const u = actor.userData || {};
      if (u.head) u.head.rotation.y = Math.sin(time * (index ? 1.1 : 1.6)) * .09;
    });
  }

  return { playOpening, update, get active() { return active; } };
}
