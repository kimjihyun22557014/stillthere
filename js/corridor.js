(() => {
  const total = 6;
  let done = 0;
  for (let i = 1; i <= total; i++) {
    const items = window.readRoomProgress(i);
    const door = document.querySelector(`.corridor-door[data-room="${i}"]`);
    if (items.size === 3) {
      done++;
      door.classList.add('completed');
      door.setAttribute('aria-label', door.getAttribute('aria-label') + ' — 탐색 완료');
    }
  }
  document.querySelector('#visited-count').textContent = `${done} / ${total} ROOMS EXPLORED`;
  if (done === total) document.querySelector('#final-door').hidden = false;
})();

(() => {
 const key='ayst-j-subtitle-seen-v2',pending='ayst-j-subtitle-pending-v2';
 const room=Number(localStorage.getItem(pending));
 if(localStorage.getItem(key)==='true'||room<1||room>6||!Number.isInteger(room)||window.readRoomProgress(room).size!==3)return;
 const subtitle=document.createElement('div');
 subtitle.className='corridor-story-subtitle';
 subtitle.setAttribute('role','status');
 subtitle.setAttribute('aria-live','polite');
 const text=document.createElement('p');text.textContent='J는 누구지?';subtitle.appendChild(text);
 const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','자막 닫기');subtitle.appendChild(close);
 document.body.appendChild(subtitle);
 localStorage.setItem(key,'true');localStorage.removeItem(pending);
 const dismiss=()=>{subtitle.remove();};close.addEventListener('click',dismiss);setTimeout(dismiss,6500);
})();
