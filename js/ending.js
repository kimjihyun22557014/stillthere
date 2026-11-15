(() => {
 'use strict';
 if(!window.hotelStoryReady()){window.location.replace('corridor.html');return;}
 const $=id=>document.getElementById(id), reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let guest='',started=false,step=0;const wait=ms=>new Promise(resolve=>setTimeout(resolve,reduced?Math.min(ms,350):ms));
 const panels=['nameScene','mirrorScene','dialogueScene','blackScene'];
 function show(id){for(const p of panels)$(p).hidden=p!==id;}
 function vocative(name){const last=name.charCodeAt(name.length-1);if(last>=0xac00&&last<=0xd7a3)return name+((last-0xac00)%28?'아.':'야.');return name+'.';}
 async function intro(){show('blackScene');await wait(1800);show('nameScene');$('guestName').focus();}
 $('guestForm').addEventListener('submit',e=>{e.preventDefault();const name=$('guestName').value.trim();if(!name){$('guestName').focus();return;}guest=name;show('mirrorScene');$('approachMirror').focus();});
 const memories=['images/cherrydollroom.png','images/blackroseroom.png','images/miroroom-shoes.png','images/bubblyroom-shoes.png','images/bloom-rot-room.png','images/sageroom.png'];
 for(const src of memories){const img=new Image();img.src=src;}
 $('approachMirror').addEventListener('click',async()=>{
  if(started)return;started=true;$('approachMirror').disabled=true;$('mirrorGuide').hidden=true;$('mirrorCanvas').classList.add('approaching');await wait(3800);$('humanShadow').classList.add('visible');await wait(1800);
  for(let i=0;i<memories.length;i++){$('memoryPortrait').src=memories[i];$('memoryPortrait').dataset.character=String(i);$('memoryPortrait').classList.add('visible');await wait(1700);$('memoryPortrait').classList.remove('visible');await wait(650);}
  await wait(1400);show('blackScene');$('blackWords').textContent='';await wait(1100);step=0;dialogue();
 });
 function dialogue(){show('dialogueScene');$('endingWords').textContent=step===0?'나였구나.':step===1?'네가 실패했다고 생각한 그 모든 여정에서\n너는 우리를 만들어냈어.':'넌 해냈어.';$('calledName').hidden=true;$('nextDialogue').hidden=step===2;$('endingLinks').hidden=true;$('endingWords').classList.remove('line-appear');void $('endingWords').offsetWidth;$('endingWords').classList.add('line-appear');if(step<2)$('nextDialogue').focus();else finish();}
 async function finish(){const s=window.readHotelStory();s.endingSeen=true;s.pending=[];window.saveHotelStory(s);localStorage.setItem('ayst-complete','true');await wait(1400);$('calledName').textContent=vocative(guest);$('calledName').hidden=false;await wait(3200);$('endingLinks').hidden=false;}
 $('nextDialogue').addEventListener('click',()=>{if(step>=2)return;step++;dialogue();});$('replayEnding').addEventListener('click',()=>window.location.reload());intro();
})();
