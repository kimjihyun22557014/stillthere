window.roomProgressKey = n => n === 1 ? 'ayst-room-1-cherry-v2' : n === 2 ? 'ayst-room-2-blackrose-v2' : n === 3 ? 'ayst-room-3-miro-v2' : n === 4 ? 'ayst-room-4-bubbly-v2' : n === 5 ? 'ayst-room-5-bloom-v2' : n === 6 ? 'ayst-room-6-sage-v2' : 'ayst-room-'+n;
window.readRoomProgress = n => {try {const saved=JSON.parse(localStorage.getItem(window.roomProgressKey(n))||'[]');return new Set(Array.isArray(saved)?saved.filter(i=>Number.isInteger(i)&&i>=0&&i<3):[])}catch(_){return new Set()}};


window.HOTEL_STORY_MESSAGES=['J는 누구지?','J에 대한 애틋함이 느껴져.','어쩌면 이 호텔 전체가 J의 것일지도...','듣다보니 J가 낯설지가 않아.','다들 J를 사랑하나봐.'];
window.readHotelStory=()=>{
 const raw=localStorage.getItem('ayst-hotel-story-v1');
 if(raw){try{const s=JSON.parse(raw);if(Array.isArray(s.order)&&Array.isArray(s.pending))return {...s,order:[...new Set(s.order.filter(n=>Number.isInteger(n)&&n>=1&&n<=6))],pending:s.pending.filter(n=>Number.isInteger(n)&&n>=1&&n<=6)};}catch(_){}}
 const order=[];for(let n=1;n<=6;n++)if(window.readRoomProgress(n).size===3)order.push(n);
 const legacyPending=Number(localStorage.getItem('ayst-j-subtitle-pending-v2'));
 const pending=order.length===1&&legacyPending===order[0]&&localStorage.getItem('ayst-j-subtitle-seen-v2')!=='true'?[1]:[];
 const s={order,pending,endingSeen:localStorage.getItem('ayst-complete')==='true'};
 localStorage.setItem('ayst-hotel-story-v1',JSON.stringify(s));return s;
};
window.saveHotelStory=s=>localStorage.setItem('ayst-hotel-story-v1',JSON.stringify(s));
window.queueFirstClearSubtitle=n=>{
 const s=window.readHotelStory();
 if(window.readRoomProgress(n).size!==3||s.order.includes(n))return;
 s.order.push(n);s.pending.push(s.order.length);window.saveHotelStory(s);
};
// Replaying a room never advances or rewinds the story.
window.resetFirstClearStoryIfUnfinished=()=>{};
window.hotelStoryReady=()=>{const s=window.readHotelStory();return s.order.length===6&&Array.from({length:6},(_,i)=>window.readRoomProgress(i+1).size===3).every(Boolean)};
