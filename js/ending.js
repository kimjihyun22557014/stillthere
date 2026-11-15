(() => {
 if(!window.hotelStoryReady()){window.location.replace('corridor.html');return;}
 document.getElementById('reveal').addEventListener('click',()=>{
  document.getElementById('endingNote').classList.add('hidden');const reveal=document.getElementById('endingReveal');reveal.classList.remove('hidden');reveal.focus();
  const s=window.readHotelStory();s.endingSeen=true;s.pending=[];window.saveHotelStory(s);localStorage.setItem('ayst-complete','true');
 });
})();
