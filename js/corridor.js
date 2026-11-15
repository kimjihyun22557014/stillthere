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
 const showNext=()=>{
  const s=window.readHotelStory();
  if(s.order.length===6&&!s.endingSeen&&window.hotelStoryReady()){window.location.replace('ending.html');return;}
  const step=s.pending[0];if(!step||step>5)return;
  const subtitle=document.createElement('div');subtitle.className='corridor-story-subtitle';subtitle.setAttribute('role','status');subtitle.setAttribute('aria-live','polite');
  const text=document.createElement('p');text.textContent=window.HOTEL_STORY_MESSAGES[step-1];subtitle.appendChild(text);
  const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','자막 닫기');subtitle.appendChild(close);document.body.appendChild(subtitle);
  s.pending.shift();window.saveHotelStory(s);let dismissed=false;
  const dismiss=()=>{if(dismissed)return;dismissed=true;subtitle.remove();showNext()};close.addEventListener('click',dismiss);setTimeout(dismiss,6500);
 };showNext();
})();
