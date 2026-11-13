(() => {
  'use strict';
  const key = 'ayst-reflections-v1';
  const question = '당신도 특별해 보이고 싶어서 골랐던 물건이 있나요?';
  const configs={1:{characterId:'cherry',character:'Cherry Doll',questionId:'cherry-special-item-v1',question,placeholder:'떠오르는 물건과 그때 골랐던 이유를 적어보세요.'},2:{characterId:'blackrose',character:'Black Rose',questionId:'blackrose-self-acceptance-v1',question:'예전에는 싫었지만, 지금은 받아들일 수 있게 된 자신의 모습이 있나요?',placeholder:'어떤 모습이었는지, 지금은 어떻게 생각하는지 적어보세요.'}};
  function raw() {
    const value = localStorage.getItem(key);
    if (!value) return [];
    const records = JSON.parse(value);
    if (!Array.isArray(records)) throw new Error('저장된 기록을 읽지 못했습니다.');
    return records;
  }
  function list() {
    return raw().filter(r => r && ['cherry','blackrose'].includes(r.characterId) && typeof r.question === 'string' && typeof r.answer === 'string' && typeof r.createdAt === 'string' && Number.isFinite(Date.parse(r.createdAt))).reverse().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }
  function save(answer, roomNumber = 1) {
    const config=configs[roomNumber];
    if(!config)throw new Error('이 방에는 아직 질문이 없습니다.');
    answer = String(answer).trim();
    if (!answer) throw new Error('답변을 작성해주세요.');
    if (answer.length > 1000) throw new Error('답변은 1,000자 이내로 작성해주세요.');
    const records = raw();
    const record = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + records.length,
      characterId: config.characterId, character: config.character, questionId: config.questionId,
      question: config.question, answer, createdAt: new Date().toISOString()
    };
    // A later visit creates a new dated answer; previous answers remain intact.
    records.push(record);
    localStorage.setItem(key, JSON.stringify(records));
    return record;
  }
  function date(value) {
    return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  }
  window.ReflectionStore = { key, question, configs, list, save, date };
})();
