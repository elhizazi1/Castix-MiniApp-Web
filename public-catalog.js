(() => {
'use strict';
if(window.Telegram?.WebApp?.initData) return;
const root=document.getElementById('public-catalog'); root.hidden=false;
const lang=()=>document.documentElement.lang==='ar';
const tr=(en,ar)=>lang()?ar:en;
const el=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
let items=[],state='loading';
async function request(action,extra={}){const r=await fetch(window.CASTIX_API,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({action,...extra})});if(!r.ok)throw Error('HTTP '+r.status);const j=await r.json();if(!j.ok)throw Error('Catalog unavailable');return j;}
function draw(){root.replaceChildren();root.append(el('h2',tr('Published themes','التصاميم المنشورة')));if(state!=='ready'){root.append(el('p',state==='loading'?tr('Loading themes…','جارٍ تحميل التصاميم…'):tr('Catalog temporarily unavailable.','الكتالوج غير متاح مؤقتاً.')));if(state==='error'){const b=el('button',tr('Retry','إعادة المحاولة'));b.onclick=load;root.append(b);}return;}
if(!items.length){root.append(el('p',tr('No published themes yet.','لا توجد تصاميم منشورة بعد.')));return;}
const grid=el('div');grid.className='public-grid';for(const x of items){const card=el('article');const title=el('h3',x.name);title.dir='auto';const meta=el('p',[x.version,x.author,x.category].filter(Boolean).join(' · '));meta.dir='auto';const img=el('img');img.src='assets/default-preview.jpg';img.alt=x.name;img.loading='lazy';img.className='public-preview';if(x.hasPreview){const fetchImage=()=>request('publicPreview',{id:x.id}).then(j=>{if(j.preview)img.src='data:image/jpeg;base64,'+j.preview;}).catch(()=>{});if('IntersectionObserver' in window){const o=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){o.disconnect();fetchImage();}});o.observe(img);}else fetchImage();}const desc=el('p',x.description);desc.dir='auto';const a=el('a',tr('Open in Telegram','فتح في Telegram'));a.href='https://t.me/Castix_bot?startapp=theme_'+encodeURIComponent(x.id);a.className='public-action';card.append(title,meta,img,desc,el('small',tr('Downloads: ','التحميلات: ')+x.downloads),a);grid.append(card);}root.append(grid);}
async function load(){state='loading';draw();try{const j=await request('publicCatalog');items=Array.isArray(j.themes)?j.themes:[];state='ready';}catch{state='error';}draw();}
new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});load();
})();
