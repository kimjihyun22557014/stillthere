(() => {
  'use strict';
  const canvas = document.getElementById('wakeupCanvas');
  const image = document.getElementById('sceneImage');
  const dialogue = document.getElementById('dialogue');
  const line = document.getElementById('dialogueText');
  const next = document.getElementById('nextDialogue');
  const door = document.getElementById('roomDoor');
  const hint = document.getElementById('doorHint');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  let step = 0;
  let busy = true;

  function showDialogue(text) {
    line.textContent = text;
    line.style.animation = 'none';
    void line.offsetHeight;
    line.style.animation = '';
    dialogue.hidden = false;
  }

  async function panDown() {
    canvas.classList.add('has-panned');
    // The image never changes. CSS owns the responsive, vertical-only movement.
    await delay(reduced ? 150 : 5900);
  }

  async function begin() {
    try { await image.decode(); } catch (_) { /* Allow navigation if decoding fails. */ }
    await delay(reduced ? 100 : 800);
    canvas.classList.remove('eyes-shut');
    await delay(reduced ? 150 : 1400);
    if (!reduced) {
      canvas.classList.add('eyes-shut');
      await delay(1100);
      canvas.classList.remove('eyes-shut');
      await delay(1300);
    }
    canvas.classList.add('is-awake');
    await delay(reduced ? 120 : 1500);
    showDialogue('여기가 어디지?');
    busy = false;
  }

  next.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    if (step === 0) {
      dialogue.hidden = true;
      await panDown();
      showDialogue('이런 곳에 온 기억은 없는데..');
      step = 1;
    } else if (step === 1) {
      showDialogue('일단 나가보자.');
      step = 2;
    } else if (step === 2) {
      dialogue.hidden = true;
      door.hidden = false;
      hint.hidden = false;
      step = 3;
    }
    busy = false;
  });
  begin();
})();
