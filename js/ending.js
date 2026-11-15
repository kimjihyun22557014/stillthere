(() => {
 'use strict';
 if(!window.hotelStoryReady()){window.location.replace('corridor.html');return;}
 const $=id=>document.getElementById(id), reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let guest='',started=false,step=0;const wait=ms=>new Promise(resolve=>setTimeout(resolve,reduced?Math.min(ms,350):ms));
 const panels=['nameScene','mirrorScene','dialogueScene','blackScene'];
 function show(id){for(const p of panels)$(p).hidden=p!==id;}
 function givenName(value){
 const parts=value.trim().split(/\s+/);if(parts.length>1&&/^[가-힣]{1,2}$/.test(parts[0]))return parts.slice(1).join('');
 const name=parts.join(' ');if(!/^[가-힣]+$/.test(name))return name;
 const compound=['남궁','황보','제갈','선우','독고','서문','사공','동방'];
 if(name.length>=4&&compound.some(s=>name.startsWith(s)))return name.slice(2);
 const surnames='김이박최정강조윤장임한오서신권황안송전홍유고문양손배백허남심노하곽성차주우구민진지엄채원천방공현함변염여추도소석선설마길연위표명기반왕금옥육인맹제모탁국어은편용';
 if(name.length>=3&&name.length<=5&&surnames.includes(name[0]))return name.slice(1);
 return name;
 }
 function vocative(value){const name=givenName(value);const last=name.charCodeAt(name.length-1);if(last>=0xac00&&last<=0xd7a3)return name+((last-0xac00)%28?'아.':'야.');return name+'.';}
 async function intro(){show('blackScene');await wait(1800);show('nameScene');$('guestName').focus();}
 $('guestForm').addEventListener('submit',e=>{e.preventDefault();const name=$('guestName').value.trim();if(!name){$('guestName').focus();return;}guest=name;show('mirrorScene');$('approachMirror').focus();});
 const memories=['images/cherrydollroom.png','images/blackroseroom.png','images/miroroom-shoes.png','images/bubblyroom-shoes.png','images/bloom-rot-room.png','images/sageroom.png'];
 for(const src of memories){const img=new Image();img.src=src;}
 $('approachMirror').addEventListener('click',async()=>{
  if(started)return;started=true;window.HotelAudio?.effect('mirror');$('approachMirror').disabled=true;$('mirrorGuide').hidden=true;$('mirrorCanvas').classList.add('approaching');await wait(3800);$('humanShadow').classList.add('visible');await wait(1800);
  $('humanShadow').classList.remove('visible');for(let i=0;i<memories.length;i++){$('memoryPortrait').src=memories[i];$('memoryPortrait').dataset.character=String(i);$('memoryPortrait').classList.add('visible');await wait(1250);$('memoryPortrait').classList.remove('visible');await wait(350);}
  $('mirrorCanvas').classList.add('final-approach');$('humanShadow').classList.add('visible','final-shadow');await wait(2800);show('blackScene');$('blackWords').textContent='';await wait(1100);step=0;dialogue();
 });
 function dialogue(){if(step===0)window.HotelAudio?.warm();show('dialogueScene');$('endingWords').textContent=step===0?'나였구나.':step===1?'네가 실패했다고 생각한 그 모든 여정에서\n너는 우리를 만들어냈어.':'넌 해냈어.';$('calledName').hidden=true;$('nextDialogue').hidden=step===2;$('endingLinks').hidden=true;$('endingWords').classList.remove('line-appear');void $('endingWords').offsetWidth;$('endingWords').classList.add('line-appear');if(step<2)$('nextDialogue').focus();else finish();}
 async function finish(){const s=window.readHotelStory();s.endingSeen=true;s.pending=[];window.saveHotelStory(s);localStorage.setItem('ayst-complete','true');await wait(1400);$('calledName').textContent=vocative(guest);$('calledName').hidden=false;await wait(3200);$('endingLinks').hidden=false;}
 $('nextDialogue').addEventListener('click',()=>{if(step>=2)return;step++;dialogue();});$('replayEnding').addEventListener('click',()=>window.location.reload());intro();
})();
