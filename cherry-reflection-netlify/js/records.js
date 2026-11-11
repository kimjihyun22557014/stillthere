(() => {
  const get = id => document.getElementById(id);
  function render() {
    const list = get('recordList');
    list.replaceChildren();
    get('recordError').hidden = true;
    try {
      const filter = get('recordFilter').value;
      const records = window.ReflectionStore.list().filter(r => filter === 'all' || r.characterId === filter);
      get('recordCount').textContent = records.length + '개의 답변';
      get('recordEmpty').hidden = records.length !== 0;
      for (const record of records) {
        const card = document.createElement('article'); card.className = 'record-card';
        const meta = document.createElement('div'); meta.className = 'record-meta';
        const name = document.createElement('span'); name.textContent = record.character;
        const date = document.createElement('time'); date.dateTime = record.createdAt; date.textContent = window.ReflectionStore.date(record.createdAt);
        meta.append(name, date);
        const question = document.createElement('h2'); question.textContent = record.question;
        const answer = document.createElement('p'); answer.className = 'record-answer'; answer.textContent = record.answer;
        const revisit = document.createElement('a'); revisit.href = 'room01.html'; revisit.textContent = '이 방 다시 방문하기 →';
        card.append(meta, question, answer, revisit); list.appendChild(card);
      }
    } catch (_) {
      get('recordCount').textContent = '';
      get('recordEmpty').hidden = true;
      get('recordError').hidden = false;
      get('recordError').textContent = '저장한 기록을 읽지 못했습니다. 브라우저의 저장 공간 설정을 확인해주세요.';
    }
  }
  get('recordFilter').addEventListener('change', render);
  window.addEventListener('pageshow', render);
  window.addEventListener('storage', e => { if (e.key === window.ReflectionStore.key || e.key === null) render(); });
  render();
})();
