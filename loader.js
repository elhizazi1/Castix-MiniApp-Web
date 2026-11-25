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
  const locked=new Set();
  function lock(){
    document.body.classList.add('castix-loading');
    for(const e of document.body.children){if(e!==loader && !e.inert && !['SCRIPT','STYLE'].includes(e.tagName)){e.inert=true;locked.add(e);}}
    if(document.activeElement instanceof HTMLElement && document.activeElement.matches('button,a')) document.activeElement.blur();
  }
  function unlock(){for(const e of locked)e.inert=false;locked.clear();document.body.classList.remove('castix-loading');}

  function begin(){
    const token={}; active.add(token);
    label.textContent=document.documentElement.lang==='ar'?'جارٍ التحميل…':'Loading…';
    loader.hidden=false;
    lock();
    const timer=setTimeout(end,12000);
    function end(){clearTimeout(timer);active.delete(token);loader.hidden=!active.size;if(!active.size)unlock();}
    return end;
  }
  const legacy=[];
  async function during(fn){const end=begin();try{await new Promise(resolve=>{const timer=setTimeout(resolve,100);requestAnimationFrame(()=>requestAnimationFrame(()=>{clearTimeout(timer);resolve();}));});return await fn();}finally{end();}}
  window.CastixLoader=Object.freeze({during,show(){legacy.push(begin());},hide(){legacy.shift()?.();}});
})();
