(() => {
  const loader = document.createElement('div');
  loader.className = 'castix-loader'; loader.hidden = true;
  loader.setAttribute('role','status');
  const mark = document.createElement('div'); mark.className = 'castix-loader-mark';
  const img = document.createElement('img'); img.src='assets/castix.png'; img.alt=''; mark.append(img);
  const name=document.createElement('strong'); name.textContent='Castix';
  const label=document.createElement('span');
  loader.append(mark,name,label); document.body.append(loader);
  const active=new Set();
  function begin(){
    const token={}; active.add(token);
    label.textContent=document.documentElement.lang==='ar'?'جارٍ التحميل…':'Loading…';
    loader.hidden=false;
    const timer=setTimeout(end,12000);
    function end(){clearTimeout(timer);active.delete(token);loader.hidden=!active.size;}
    return end;
  }
  const legacy=[];
  async function during(fn){const end=begin();try{await new Promise(resolve=>{const timer=setTimeout(resolve,100);requestAnimationFrame(()=>requestAnimationFrame(()=>{clearTimeout(timer);resolve();}));});return await fn();}finally{end();}}
  window.CastixLoader=Object.freeze({during,show(){legacy.push(begin());},hide(){legacy.shift()?.();}});
})();
