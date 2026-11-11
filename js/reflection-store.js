(() => {
  'use strict';
  const key = 'ayst-reflections-v1';
  const question = '당신도 특별해 보이고 싶어서 골랐던 물건이 있나요?';
  function raw() {
    const value = localStorage.getItem(key);
    if (!value) return [];
    const records = JSON.parse(value);
    if (!Array.isArray(records)) throw new Error('저장된 기록을 읽지 못했습니다.');
    return records;
  }
  function list() {
    return raw().filter(r => r && r.characterId === 'cherry' && typeof r.question === 'string' && typeof r.answer === 'string' && typeof r.createdAt === 'string' && Number.isFinite(Date.parse(r.createdAt))).reverse().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }
  function save(answer) {
    answer = String(answer).trim();
    if (!answer) throw new Error('답변을 작성해주세요.');
    if (answer.length > 1000) throw new Error('답변은 1,000자 이내로 작성해주세요.');
    const records = raw();
    const record = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + records.length,
      characterId: 'cherry', character: 'Cherry Doll', questionId: 'cherry-special-item-v1',
      question, answer, createdAt: new Date().toISOString()
    };
    // A later visit creates a new dated answer; previous answers remain intact.
    records.push(record);
    localStorage.setItem(key, JSON.stringify(records));
    return record;
  }
  function date(value) {
    return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  }
  window.ReflectionStore = { key, question, list, save, date };
})();
