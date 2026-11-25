(() => {
  const loader = document.createElement('div');
  loader.className = 'castix-loader'; loader.hidden = true;
  loader.setAttribute('role','status');
  const mark = document.createElement('div'); mark.className = 'castix-loader-mark';
  const img = document.createElement('img'); img.src='assets/castix.png'; img.alt=''; mark.append(img);
  const name=document.createElement('strong'); name.textContent='Castix';
  const label=document.createElement('span');
  loader.append(mark,name,label); document.body.append(loader);
  let timer;
  window.CastixLoader=Object.freeze({show(){clearTimeout(timer);label.textContent=document.documentElement.lang==='ar'?'جارٍ تحميل التصاميم…':'Loading themes…';loader.hidden=false;timer=setTimeout(()=>{loader.hidden=true;},12000);},hide(){clearTimeout(timer);loader.hidden=true;}});
})();
