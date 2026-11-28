/* Shared home catalog layout; data and actions remain owned by each client. */
window.CastixCatalog = (() => {
  const key = value => String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
  const latest = rows => [...rows].sort((a,b)=>(Date.parse(b.createdAt)||0)-(Date.parse(a.createdAt)||0));
  const popular = rows => latest(rows).sort((a,b)=>(Number(b.downloads)||0)-(Number(a.downloads)||0));
  const randomRanks = new Map();
  function randomRank(x) { if (!randomRanks.has(x.id)) randomRanks.set(x.id, Math.random()); return randomRanks.get(x.id); }
  function render(root, rows, options) {
    const {full, compact, tr, flat=false, empty, sort='latest'}=options;
    const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
    root.replaceChildren();
    const sorted=sort==='popular'?popular(rows):sort==='name'?[...rows].sort((a,b)=>String(a.name).localeCompare(String(b.name))):latest(rows);
    if(!sorted.length){root.append(empty());return;}
    function section(title, data, large=false, expanded=false, home=false){
      const s=el('section','catalog-section'), h=el('div','catalog-heading'), label=el('h2','',title);h.append(label);
      const list=el('div',large?'catalog-rail':'catalog-list');
      const limit=large?8:3;let shown=0;
      function append(count){for(const x of data.slice(shown,shown+count))list.append(large?full(x):compact(x));shown=Math.min(data.length,shown+count);more.hidden=shown>=data.length;}
      const more=el('button','quiet catalog-more',tr('Load more','عرض المزيد'));more.type='button';more.onclick=()=>append(24);
      const all=el('button','quiet catalog-all',tr('See more','عرض المزيد'));all.type='button';all.onclick=()=>{root.replaceChildren();const back=el('button','quiet catalog-back',tr('Back to explore','العودة للاستكشاف'));back.onclick=()=>render(root,rows,options);root.append(back);section(title,data,false,true);root.scrollIntoView({block:'start'});};
      if(home&&data.length>limit)h.append(all);s.append(h,list);if(expanded)s.append(more);root.append(s);append(expanded?24:limit);
    }
    if(flat){section(tr('All themes','جميع التصاميم'),sorted,false,true);return;}
    const featured=latest(rows);
    const used=new Set(featured.slice(0,8).map(x=>x.id));
    section(tr('Recently added','أحدث التصاميم'),featured,true,false,true);
    const ranked=popular(rows).filter(x=>Number(x.downloads)>0);
    if(ranked.length){section(tr('Most downloaded','الأكثر تحميلاً'),ranked,false,false,true);ranked.slice(0,3).forEach(x=>used.add(x.id));}
    const groups=new Map();for(const x of sorted){const k=key(x.category);if(!k)continue;if(!groups.has(k))groups.set(k,{label:String(x.category).trim(),rows:[]});groups.get(k).rows.push(x);}
    const categories=[...groups.values()].sort((a,b)=>b.rows.length-a.rows.length||a.label.localeCompare(b.label));
    for(const g of categories.slice(0,6)){section(g.label,g.rows,false,false,true);g.rows.slice(0,3).forEach(x=>used.add(x.id));}
    if(categories.length>6){const s=el('section','catalog-section'),h=el('h2','',tr('More categories','تصنيفات أخرى'));s.append(h);for(const g of categories.slice(6)){const b=el('button','quiet catalog-category',g.label+' · '+g.rows.length);b.onclick=()=>{root.replaceChildren();const back=el('button','quiet catalog-back',tr('Back to explore','العودة للاستكشاف'));back.onclick=()=>render(root,rows,options);root.append(back);section(g.label,g.rows,false,true);};s.append(b);}root.append(s);}
    sorted.forEach(randomRank);
    const discovery=[...sorted].sort((a,b)=>Number(used.has(a.id))-Number(used.has(b.id))||randomRank(a)-randomRank(b));
    section(tr('Discover more','اكتشف المزيد'),discovery,false,false,true);
    window.CastixAds?.mount(root,tr);
  }
  return {render,key,latest,popular};
})();
