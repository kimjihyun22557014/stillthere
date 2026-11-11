window.roomProgressKey = n => n === 1 ? 'ayst-room-1-cherry-v2' : 'ayst-room-'+n;
window.readRoomProgress = n => {try {const saved=JSON.parse(localStorage.getItem(window.roomProgressKey(n))||'[]');return new Set(Array.isArray(saved)?saved.filter(i=>Number.isInteger(i)&&i>=0&&i<3):[])}catch(_){return new Set()}};

// Queue only after a completed room; corridor consumes this event once per saved game.
window.queueFirstClearSubtitle = n => {
 if(window.readRoomProgress(n).size!==3||localStorage.getItem('ayst-j-subtitle-seen-v2')==='true')return;
 const pending=Number(localStorage.getItem('ayst-j-subtitle-pending-v2'));
 if(!Number.isInteger(pending)||pending<1||pending>6||window.readRoomProgress(pending).size!==3)localStorage.setItem('ayst-j-subtitle-pending-v2',String(n));
};

// Restarting the only completed room starts a fresh first-clear story cycle.
window.resetFirstClearStoryIfUnfinished = () => {
 for(let n=1;n<=6;n++)if(window.readRoomProgress(n).size===3)return;
 localStorage.removeItem('ayst-j-subtitle-seen-v2');
 localStorage.removeItem('ayst-j-subtitle-pending-v2');
};
