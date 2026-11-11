window.createCherryReflection = ({ setSceneInert, returnFocus }) => {
  const modal = document.createElement('div');
  modal.className = 'reflection-modal hidden';
  modal.id = 'reflectionModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'reflectionQuestion');
  modal.innerHTML = `<section class="reflection-card">
    <p class="reflection-caption">CHERRY DOLL · 나의 답변</p>
    <h2 id="reflectionQuestion"></h2>
    <form id="reflectionForm">
      <label class="sr-only" for="reflectionAnswer">질문에 대한 나의 답변</label>
      <textarea id="reflectionAnswer" maxlength="1000" required placeholder="떠오르는 물건과 그때 골랐던 이유를 적어보세요."></textarea>
      <div class="reflection-input-meta"><span id="reflectionCount">0 / 1,000</span><span>공개되지 않는 개인 기록입니다.</span></div>
      <div class="reflection-actions"><button type="submit" class="reflection-primary" id="saveReflection">답변 저장</button><button type="button" id="skipReflection">나중에 작성하기</button></div>
    </form>
    <p id="reflectionStatus" class="reflection-status" role="status" aria-live="polite"></p>
    <div id="reflectionSaved" hidden>
      <p class="reflection-saved-answer" id="reflectionSavedAnswer"></p>
      <div class="reflection-actions"><a class="reflection-primary" href="records.html">내 기록 보기</a><button type="button" id="continueReflection">방으로 돌아가기</button><a href="corridor.html" id="reflectionCorridor">복도로 나가기 →</a></div>
    </div>
    <p class="reflection-storage-note">답변은 이 기기의 현재 브라우저에만 저장됩니다. 시크릿 창을 닫거나 사이트 데이터를 지우면 사라질 수 있습니다.</p>
  </section>`;
  document.body.appendChild(modal);
  const get = id => modal.querySelector('#' + id);
  const form = get('reflectionForm');
  const answer = get('reflectionAnswer');
  const status = get('reflectionStatus');
  let destination = null;
  let submitting = false;
  get('reflectionQuestion').textContent = window.ReflectionStore.question;
  function close() {
    modal.classList.add('hidden');
    setSceneInert(false);
    const target = destination;
    destination = null;
    if (target) window.location.assign(target);
    else returnFocus();
  }
  function open(next = null) {
    destination = next;
    submitting = false;
    get('saveReflection').disabled = false;
    form.hidden = false;
    get('reflectionSaved').hidden = true;
    status.textContent = '';
    get('reflectionCount').textContent = answer.value.length + ' / 1,000';
    modal.classList.remove('hidden');
    setSceneInert(true);
    answer.focus();
  }
  answer.addEventListener('input', () => {
    get('reflectionCount').textContent = answer.value.length + ' / 1,000';
    status.textContent = '';
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (submitting || form.hidden) return;
    submitting = true;
    get('saveReflection').disabled = true;
    try {
      const record = window.ReflectionStore.save(answer.value);
      status.textContent = '저장되었습니다. · ' + window.ReflectionStore.date(record.createdAt);
      get('reflectionSavedAnswer').textContent = record.answer;
      answer.value = '';
      form.hidden = true;
      get('reflectionSaved').hidden = false;
      get('continueReflection').textContent = destination ? '복도로 나가기 →' : '방으로 돌아가기';
      get('reflectionCorridor').hidden = Boolean(destination);
      get('continueReflection').focus();
    } catch (error) {
      status.textContent = /답변/.test(error.message) ? error.message : '저장하지 못했습니다. 브라우저의 저장 공간 설정을 확인해주세요. 작성한 답변은 그대로 남아 있습니다.';
      submitting = false;
      get('saveReflection').disabled = false;
      answer.focus();
    }
  });
  get('skipReflection').addEventListener('click', close);
  get('continueReflection').addEventListener('click', close);
  get('reflectionCorridor').addEventListener('click', () => window.queueFirstClearSubtitle(1));
  document.addEventListener('keydown', e => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab') {
      const targets = [...modal.querySelectorAll('a,button,textarea')].filter(el => !el.disabled && !el.closest('[hidden]'));
      const index = targets.indexOf(document.activeElement);
      if (index < 0 || (!e.shiftKey && index === targets.length - 1) || (e.shiftKey && index === 0)) {
        e.preventDefault(); targets[e.shiftKey ? targets.length - 1 : 0].focus();
      }
    }
  });
  return { open };
};
