async function startHotelBlackout(){
 if(document.querySelector('.blackout-cover'))return;
 const cover=document.createElement('div');cover.className='blackout-cover';cover.style.opacity='0';cover.setAttribute('aria-hidden','true');document.body.appendChild(cover);
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 if(document.readyState!=='complete')await new Promise(resolve=>window.addEventListener('load',resolve,{once:true}));
 await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));await wait(900);
 const calm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const sequence=calm?[[1,900]]:[[.92,220],[0,430],[.8,170],[0,550],[.96,280],[.1,300],[1,1100]];
 for(const [opacity,duration] of sequence){cover.style.opacity=String(opacity);if(opacity>.7)window.HotelAudio?.effect('flicker');await wait(duration);}
 window.location.replace('ending.html');
}
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
  if(s.order.length===6&&!s.endingSeen&&window.hotelStoryReady()){startHotelBlackout();return;}
  const step=s.pending[0];if(!step||step>5)return;
  const subtitle=document.createElement('div');subtitle.className='corridor-story-subtitle';subtitle.setAttribute('role','status');subtitle.setAttribute('aria-live','polite');
  const text=document.createElement('p');text.textContent=window.HOTEL_STORY_MESSAGES[step-1];subtitle.appendChild(text);
  const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','자막 닫기');subtitle.appendChild(close);document.body.appendChild(subtitle);
  s.pending.shift();window.saveHotelStory(s);let dismissed=false;
  const dismiss=()=>{if(dismissed)return;dismissed=true;subtitle.remove();showNext()};close.addEventListener('click',dismiss);setTimeout(dismiss,6500);
 };showNext();
})();
