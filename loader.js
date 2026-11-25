(() => {
  const loader = document.createElement('div');
  loader.className = 'castix-loader'; loader.hidden = true;
  loader.setAttribute('role','status');
  const mark = document.createElement('div'); mark.className = 'castix-loader-mark';
  const img = document.createElement('img'); img.src='assets/castix.png'; img.alt=''; mark.append(img);
  const name=document.createElement('strong'); name.textContent='Castix';
  const label=document.createElement('span');
  loader.append(mark,name,label); document.body.append(loader);
  const active=new Set(), locked=new Set();
  // Two frames separate the loading surface from the underlying DOM update.
  function painted(){return new Promise(resolve=>{let done=false;const finish=()=>{if(done)return;done=true;clearTimeout(timer);resolve();};const timer=setTimeout(finish,150);requestAnimationFrame(()=>requestAnimationFrame(finish));});}
  function lock(){
    document.body.classList.add('castix-loading');
    const focused=document.activeElement;
    if(focused instanceof HTMLElement && focused.matches('button,a')) focused.blur();
    for(const e of document.body.children){if(e!==loader && !e.inert && !['SCRIPT','STYLE','DIALOG'].includes(e.tagName)){e.inert=true;locked.add(e);}}
  }
  function unlock(){for(const e of locked)e.inert=false;locked.clear();document.body.classList.remove('castix-loading');}
  function begin(){
    const token={};active.add(token);
    label.textContent=document.documentElement.lang==='ar'?'جارٍ التحميل…':'Loading…';
    loader.hidden=false;lock();
    let ended=false;
    return async function end(){if(ended)return;ended=true;await painted();active.delete(token);if(!active.size){unlock();loader.hidden=true;}};
  }
  const legacy=[];
  async function during(fn){const end=begin();try{await painted();return await fn();}finally{await end();}}
  window.CastixLoader=Object.freeze({during,show(){legacy.push(begin());},hide(){return legacy.shift()?.();}});
})();
