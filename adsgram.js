/* One native Task placement per home view; never request ads on the public website. */
window.CastixAds = (() => {
  let sdk;
  function load(){return sdk ||= new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://sad.adsgram.ai/js/sad.min.js';s.onload=resolve;s.onerror=reject;document.head.append(s);}).then(()=>customElements.whenDefined('adsgram-task'));}
  function mount(root,tr){
    if(window.CASTIX_ADS_ENABLED !== true || !window.Telegram?.WebApp?.initData || root.querySelector('.castix-sponsored'))return;
    const sections=root.querySelectorAll('.catalog-section');if(sections.length<2)return;
    const wrap=document.createElement('section');wrap.className='castix-sponsored';wrap.hidden=true;
    const label=document.createElement('small');label.textContent=tr('Sponsored','إعلان ممول');wrap.append(label);
    sections[Math.min(1,sections.length-2)].after(wrap);
    load().then(()=>{
      if(!wrap.isConnected)return;
      const task=document.createElement('adsgram-task');task.setAttribute('data-block-id','task-61999');task.setAttribute('data-debug','false');
      for(const event of ['onError','onBannerNotFound','onTooLongSession','reward'])task.addEventListener(event,()=>{wrap.remove();});
      wrap.append(task);wrap.hidden=false;
    }).catch(()=>wrap.remove());
  }
  return {mount};
})();
