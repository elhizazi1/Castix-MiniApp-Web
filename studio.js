/* Castix Studio - editor UI. Mounts inside the Castix Mini App (or studio.html). Vanilla JS, no dependencies. */
(() => {
'use strict';
const C = window.CastixStudioCore, FR = window.CastixFrames;
const { f, esc, mixc, PALETTE, isHex, SHAPES, ANIMS, FONTS, newLayer, newProject } = C;

/* ------------------------------------------------------------------ strings [en, ar] */
const L = {
  title: ['Castix Studio', 'Castix Studio'], sub: ['Design animated AMOLED themes', 'صمّم ثيمات AMOLED متحركة'],
  undo: ['Undo', 'تراجع'], redo: ['Redo', 'إعادة'], templates: ['Templates', 'القوالب'], export: ['Export', 'تصدير'], add: ['Add', 'إضافة'], theme: ['Theme', 'الثيم'],
  style: ['Style', 'التنسيق'], motion: ['Motion', 'الحركة'], arrange: ['Arrange', 'الترتيب'],
  top: ['Top', 'الأعلى'], full: ['Full', 'كامل'], play: ['Play', 'تشغيل'], pause: ['Pause', 'إيقاف'], guide: ['Widget zone', 'منطقة الودجت'],
  shapes: ['Shapes', 'أشكال'], frames: ['Frames', 'إطارات'], media: ['Media', 'وسائط'], effects: ['Effects', 'مؤثرات'], texts: ['Text', 'نص'],
  clock: ['Clock', 'الساعة'], text: ['Text', 'نص'], frame: ['Frame', 'إطار'], shape: ['Shape', 'شكل'], image: ['Image', 'صورة'], particles: ['Particles', 'جسيمات'], orb: ['Glow', 'توهج'],
  pickImage: ['Image, GIF or animated SVG', 'صورة أو GIF أو SVG متحرك'], replaceImage: ['Replace image', 'استبدال الصورة'], imgBig: ['Image is large and may exceed the 2 MB limit.', 'الصورة كبيرة وقد تتجاوز حد 2 م.ب.'], imgFail: ['Could not read this image.', 'تعذّرت قراءة الصورة.'],
  color: ['Color', 'اللون'], devAccent: ['Device accent', 'لون الجهاز'], metal: ['Metal finish', 'لمعة معدنية'], finish: ['Finish', 'اللمعة'], polished: ['Polished', 'مصقول'], satin: ['Satin', 'ساتان'], flat: ['Flat', 'مسطّح'],
  fill: ['Fill', 'تعبئة'], fillOp: ['Fill strength', 'قوة التعبئة'], stroke: ['Line weight', 'سُمك الخط'], glow: ['Glow', 'توهج'], size: ['Size', 'الحجم'], width: ['Width', 'العرض'], height: ['Height', 'الارتفاع'],
  beads: ['Beads & fine detail', 'خرز وتفاصيل'], jewels: ['Jewels', 'جواهر'], pattern: ['Pattern', 'نقش'], ambient: ['Soft backlight', 'إضاءة خلفية'],
  sides: ['Sides', 'الأضلاع'], points: ['Points', 'الرؤوس'], depth: ['Depth', 'العمق'], round: ['Roundness', 'الاستدارة'], count: ['Count', 'العدد'], angle: ['Angle', 'الزاوية'], length: ['Length', 'الطول'], gap: ['Gap', 'الفراغ'], turns: ['Turns', 'اللفات'],
  waves: ['Waves', 'الموجات'], height2: ['Height', 'الارتفاع'], petals: ['Petals', 'البتلات'], frequency: ['Frequency', 'التردد'], phase: ['Phase', 'الطور'], rings: ['Rings', 'الحلقات'], rays: ['Rays', 'الأشعة'], inner: ['Inner radius', 'القطر الداخلي'],
  grid: ['Grid', 'الشبكة'], layers: ['Layers', 'الطبقات'], shrink: ['Shrink', 'التصغير'], flatness: ['Flatness', 'التسطيح'], lobes: ['Lobes', 'الفصوص'], reach: ['Reach', 'الامتداد'], cells: ['Cells', 'الخلايا'], sweep: ['Sweep', 'المدى'],
  s_circle: ['Circle', 'دائرة'], s_arc: ['Arc', 'قوس'], s_polygon: ['Polygon', 'مضلّع'], s_star: ['Star', 'نجمة'], s_square: ['Square', 'مربع'], s_chevrons: ['Chevrons', 'شيفرون'], s_cross: ['Cross', 'صليب'], s_line: ['Ornament line', 'خط زخرفي'],
  s_spiral: ['Spiral', 'حلزون'], s_wave: ['Wave', 'موجة'], s_rose: ['Rose', 'وردة'], s_lissajous: ['Lissajous', 'ليساجو'], s_rosette: ['Rosette', 'غيلوشيه'], s_mandala: ['Mandala', 'مندالا'], s_sunburst: ['Sunburst', 'أشعة'],
  s_dotgrid: ['Dot grid', 'نقاط'], s_concentric: ['Concentric', 'دوائر'], s_khatam: ['Khatam', 'خاتم'], s_orbit: ['Orbit', 'مدار'], s_spiro: ['Spiro', 'سبيرو'], s_lattice: ['Lattice', 'زليج'], s_hexgrid: ['Honeycomb', 'خلية'],
  f_imperial: ['Imperial', 'إمبريال'], f_guilloche: ['Guilloché', 'غيلوشيه'], f_zellige: ['Zellige', 'زليج'], f_laurier: ['Laurier', 'غار'], f_celestial: ['Celestial', 'سماوي'], f_brackets: ['Brackets', 'أقواس'],
  p_stars: ['Twinkling stars', 'نجوم لامعة'], p_rise: ['Rising dust', 'غبار صاعد'], p_fall: ['Falling snow', 'ثلج متساقط'], p_bokeh: ['Bokeh', 'بوكيه'],
  kind: ['Kind', 'النوع'], speed: ['Speed', 'السرعة'], seed: ['Shuffle', 'خلط'], soft: ['Softness', 'النعومة'],
  content: ['Text', 'النص'], font: ['Font', 'الخط'], weight: ['Weight', 'السماكة'], spacing: ['Spacing', 'التباعد'], upper: ['Uppercase', 'أحرف كبيرة'], tone: ['Fill', 'التلوين'],
  ftSerif: ['Classic', 'كلاسيكي'], ftItalic: ['Italic', 'مائل'], ftSans: ['Light', 'نحيف'], ftCond: ['Condensed', 'ضيّق'], ftMono: ['Mono', 'ميكانيكي'], ftNaskh: ['Naskh', 'نسخ'], ftKufi: ['Kufi', 'كوفي'],
  tIvory: ['Ivory', 'عاجي'], tColor: ['Color', 'لون'], tMetal: ['Metal', 'معدن'], tWhite: ['White', 'أبيض'],
  fit: ['Fit', 'الملاءمة'], contain: ['Contain', 'احتواء'], cover: ['Cover', 'تغطية'], mask: ['Mask', 'قناع'], none: ['None', 'بدون'], circle: ['Circle', 'دائرة'], rounded: ['Rounded', 'مستدير'], hex: ['Hexagon', 'سداسي'],
  preset: ['Animation', 'الحركة'], duration: ['Duration', 'المدة'], delay: ['Delay', 'التأخير'], easing: ['Easing', 'التسارع'], direction: ['Direction', 'الاتجاه'], amount: ['Amount', 'الشدة'],
  a_none: ['None', 'بدون'], a_rot: ['Rotate', 'دوران'], a_spinpulse: ['Spin pulse', 'دوران نابض'], a_pulse: ['Pulse', 'نبض'], a_float: ['Float', 'طفو'], a_drift: ['Drift', 'انجراف'], a_sway: ['Sway', 'تمايل'], a_glide: ['Glide', 'انزلاق'],
  a_bounce: ['Bounce', 'ارتداد'], a_breathe: ['Breathe', 'تنفّس'], a_blink: ['Blink', 'وميض'], a_shimmer: ['Shimmer', 'لمعان'], a_flip: ['Flip', 'قلب'], a_orbit: ['Orbit', 'مدار'], a_draw: ['Draw', 'رسم'],
  e_linear: ['Linear', 'ثابت'], 'e_ease-in-out': ['Smooth', 'سلس'], e_ease: ['Ease', 'خفيف'], 'e_cubic-bezier(.34,1.56,.64,1)': ['Springy', 'نابضي'],
  d_normal: ['Forward', 'للأمام'], d_reverse: ['Reverse', 'للخلف'], d_alternate: ['Ping-pong', 'ذهاب وإياب'],
  posX: ['Position X', 'الموضع س'], posY: ['Position Y', 'الموضع ص'], rotation: ['Rotation', 'التدوير'], opacity: ['Opacity', 'الشفافية'], blend: ['Blend', 'المزج'], normal: ['Normal', 'عادي'], screen: ['Screen', 'إضاءة'], lighten: ['Lighten', 'تفتيح'], overlay: ['Overlay', 'تراكب'], plusl: ['Add', 'جمع'],
  dup: ['Duplicate', 'تكرار'], del: ['Delete', 'حذف'], up: ['Bring forward', 'للأمام'], down: ['Send back', 'للخلف'], lock: ['Lock', 'قفل'], hide: ['Hide', 'إخفاء'], center: ['Center', 'توسيط'],
  noSel: ['Select a layer on the canvas or from the strip, or add a new one.', 'اختر طبقة من اللوحة أو الشريط، أو أضف طبقة جديدة.'], noDelClock: ['The clock layer cannot be deleted.', 'لا يمكن حذف طبقة الساعة.'],
  tName: ['Theme name', 'اسم الثيم'], tVersion: ['Version', 'الإصدار'], tAuthor: ['Author', 'المؤلف'], tCat: ['Category', 'التصنيف'], tDesc: ['Description', 'الوصف'],
  bg: ['Background', 'الخلفية'], solid: ['Solid', 'ساده'], linear: ['Linear', 'خطي'], radial: ['Radial', 'شعاعي'], bgA: ['Color 1', 'اللون 1'], bgB: ['Color 2', 'اللون 2'], accent: ['Default accent', 'اللون الافتراضي'], lockAcc: ['Lock accent', 'تثبيت اللون'], lockAccH: ['Ignore the device accent color', 'تجاهل لون الجهاز التكيّفي'],
  newProj: ['New blank project', 'مشروع فارغ جديد'], openProj: ['Open project file', 'فتح ملف مشروع'], saveProj: ['Save project file', 'حفظ ملف المشروع'], confirmNew: ['Start a blank project? Current work will be replaced (you can undo).', 'بدء مشروع فارغ؟ سيُستبدل العمل الحالي (يمكنك التراجع).'],
  xTitle: ['Export theme', 'تصدير الثيم'], dlCas: ['Download .cas', 'تنزيل .cas'], share: ['Share file', 'مشاركة الملف'], send: ['Send for review', 'إرسال للمراجعة'], sent: ['Sent for review.', 'تم الإرسال للمراجعة.'],
  imgs: ['Preview & icon', 'المعاينة والأيقونة'], pkgSize: ['Package size', 'حجم الحزمة'], limit: ['Limit 2 MB', 'الحد 2 م.ب'], over: ['Over the 2 MB submission limit. Remove or shrink images.', 'يتجاوز حد 2 م.ب. احذف الصور أو صغّرها.'],
  noClock: ['Add a clock layer, otherwise the theme shows no time.', 'أضف طبقة ساعة وإلا لن يعرض الثيم الوقت.'], tgHint: ['If the download does not start inside Telegram, use Share or Send for review.', 'إن لم يبدأ التنزيل داخل تيليجرام فاستخدم المشاركة أو الإرسال للمراجعة.'],
  building: ['Building…', 'جارٍ البناء…'], done: ['Done.', 'تم.'], failed: ['Export failed.', 'تعذّر التصدير.'], close: ['Close', 'إغلاق'], cat: ['Category', 'التصنيف'],
  tplTitle: ['Templates', 'القوالب'], tplHint: ['Applying a template replaces the layers (you can undo).', 'تطبيق القالب يستبدل الطبقات (يمكنك التراجع).'],
  zone: ['Widgets sit here', 'منطقة الودجت'], editMode: ['Edit', 'تعديل'], minimize: ['Minimize', 'تصغير'], editHint: ['Edit mode: drag to move, use the handles to scale and rotate. Tap Minimize to scroll again.', 'وضع التعديل: اسحب للتحريك وبالمقابض للتكبير والتدوير. اضغط تصغير للتمرير من جديد.'], saved: ['Saved', 'تم الحفظ'], codeV: ['Code', 'الكود']
};
let host = { lang: () => (localStorage.getItem('castix-lang') === 'ar' ? 'ar' : 'en'), tg: window.Telegram?.WebApp, api: null, during: fn => fn() };
const lang = () => host.lang();
const T = k => { const v = L[k]; return v ? v[lang() === 'ar' ? 1 : 0] : k; };

/* ------------------------------------------------------------------ tiny DOM helpers */
const $ = (s, r = document) => r.querySelector(s);
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) { if (v == null || v === false) continue; if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (k === 'html') e.innerHTML = v; else e.setAttribute(k, v === true ? '' : v); }
  for (const c of kids.flat()) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
}
const ICON = {
  undo: '<path d="M9 7 4 12l5 5M4 12h10a6 6 0 0 1 0 12"/>', redo: '<path d="m15 7 5 5-5 5M20 12H10a6 6 0 0 0 0 12"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>', shrink: '<path d="M14 10l7-7M3 21l7-7M20 10h-6V4M4 14h6v6"/>', layers: '<path d="m3 8 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5"/>', export: '<path d="M12 15V3m-5 5 5-5 5 5M4 16v4h16v-4"/>', tpl: '<rect x="4" y="4" width="7" height="9" rx="2"/><rect x="13" y="4" width="7" height="5" rx="2"/><rect x="13" y="11" width="7" height="9" rx="2"/><rect x="4" y="15" width="7" height="5" rx="2"/>',
  dup: '<rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>', trash: '<path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15"/>', up: '<path d="m6 15 6-6 6 6"/>', down: '<path d="m6 9 6 6 6-6"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>', eyeoff: '<path d="M3 3l18 18M10.6 5.1A9 9 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3 3.7M6.6 6.6A17 17 0 0 0 2 12s4 7 10 7a9 9 0 0 0 4-1"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', unlock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7-2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', text: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>', frame: '<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8z"/>', shape: '<path d="m12 3 8 6-3 10H7L4 9z"/>', image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-8 8"/>',
  particles: '<circle cx="6" cy="8" r="1.2"/><circle cx="12" cy="5" r="1.2"/><circle cx="18" cy="9" r="1.2"/><circle cx="9" cy="14" r="1.2"/><circle cx="16" cy="16" r="1.2"/><circle cx="6" cy="19" r="1.2"/>', orb: '<circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9" opacity=".5"/>',
  play: '<path d="m7 4 13 8-13 8z"/>', pause: '<path d="M8 5v14M16 5v14"/>', x: '<path d="m6 6 12 12M18 6 6 18"/>', check: '<path d="m5 12 4 4L19 6"/>', dl: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>', send: '<path d="m3 4 18 8-18 8 4-8-4-8Zm4 8h14"/>', share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6m-7.6 6 7.6 3.6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/>', center: '<path d="M12 3v18M3 12h18"/>', file: '<path d="M6 3h9l3 3v15H6zM9 11h6m-6 4h6"/>'
};
const ic = (k, size) => h('span', { class: 'cs-ic', 'aria-hidden': 'true', html: `<svg viewBox="0 0 24 24"${size ? ` style="width:${size}px;height:${size}px"` : ''}>${ICON[k] || ''}</svg>` });
const btn = (label, k, fn, cls, aria) => { const b = h('button', { type: 'button', class: 'cs-b ' + (cls || ''), 'aria-label': aria || (label || null), title: label ? null : (aria || null), onclick: fn }); if (k) b.append(ic(k)); if (label) b.append(h('span', null, label)); return b; };

/* ------------------------------------------------------------------ state */
const LS = 'castix-studio-v1';
let st = null;          // {p, sel, tab, view, time, paused, guide, u}
let hist = [], hi = -1, commitT = 0, root, stageEl, shadow, ov, selBox, stripEl, inspEl, undoB, redoB, dlg, fileIn, cleanup = [];
const layerById = id => st.p.layers.find(l => l.id === id);
const cur = () => st.sel ? layerById(st.sel) : null;
const clone = o => JSON.parse(JSON.stringify(o));
const snap = () => JSON.stringify({ meta: st.p.meta, theme: st.p.theme, layers: st.p.layers });

function loadSaved() { try { const s = JSON.parse(localStorage.getItem(LS) || 'null'); if (s && s.p && Array.isArray(s.p.layers)) return s.p; } catch (e) {} return null; }
function persist() {
  try { localStorage.setItem(LS, JSON.stringify({ p: st.p })); } catch (e) {
    try { localStorage.setItem(LS, JSON.stringify({ p: { ...st.p, assets: {} } })); } catch (e2) {}
  }
}
function commit(now) {
  clearTimeout(commitT);
  const go = () => { const s = snap(); if (hist[hi] === s) return; hist = hist.slice(0, hi + 1); hist.push(s); if (hist.length > 60) hist.shift(); hi = hist.length - 1; persist(); syncUndo(); };
  if (now) go(); else commitT = setTimeout(go, 350);
}
function restore(s) { const o = JSON.parse(s); st.p.meta = o.meta; st.p.theme = o.theme; st.p.layers = o.layers; if (st.sel && !layerById(st.sel)) st.sel = null; renderAll(); persist(); }
function undo() { clearTimeout(commitT); if (hist[hi] !== snap()) commit(true); if (hi > 0) { hi--; restore(hist[hi]); syncUndo(); } }
function redo() { if (hi < hist.length - 1) { hi++; restore(hist[hi]); syncUndo(); } }
function syncUndo() { if (undoB) { undoB.disabled = hi <= 0; redoB.disabled = hi >= hist.length - 1; } }

/* ------------------------------------------------------------------ stage */
const VIEW_H = { top: 560, full: 844 };
const coarse = () => matchMedia('(pointer:coarse)').matches;
const touchLocked = e => e.pointerType === 'touch' && !st.edit; /* scroll mode: let the page scroll */
function fitStage() {
  if (!stageEl) return;
  const w = stageEl.parentElement.clientWidth; if (!w) return;
  let u = w / 390;
  if (st.edit && coarse()) u = Math.min(u, (innerHeight * .5) / VIEW_H[st.view]);
  st.u = u; stageEl.style.height = VIEW_H[st.view] * u + 'px'; stageEl.style.width = 390 * u + 'px'; stageEl.style.marginInline = 'auto';
}
let rafStage = 0;
function renderStage() { cancelAnimationFrame(rafStage); rafStage = requestAnimationFrame(renderStageNow); }
function renderStageNow() {
  if (!shadow) return;
  fitStage();
  const css = C.buildCss(st.p, { preview: true }).replace(':root', ':host'), body = C.buildBody(st.p).replace('<div class="cx">', `<div class="cx${st.paused ? ' paused' : ''}" style="--u:${st.u}px">`);
  shadow.innerHTML = `<style>:host{display:block;position:relative;width:100%;height:100%}${css}</style>${body}`;
  const clock = shadow.querySelector('#clock');
  if (clock) { const m = st.time.match(/^(\S+)(?:\s+(.+))?$/u); clock.textContent = m ? m[1] : st.time; if (m && m[2]) { const s = document.createElement('span'); s.className = 'period'; s.textContent = m[2]; clock.append(s); } }
  drawOverlay();
}
function layerEl(id) { return shadow && shadow.querySelector(`[data-lid="${id}"]`); }
function drawOverlay() {
  if (!ov) return;
  const l = cur(), el = l && layerEl(l.id);
  ov.querySelector('.cs-zone').hidden = !st.guide;
  ov.querySelector('.cs-zone').style.top = (440 * st.u) + 'px';
  if (!l || !el) { selBox.hidden = true; return; }
  const w = Math.max(el.offsetWidth, 34), hh = Math.max(el.offsetHeight, 34);
  selBox.hidden = false; selBox.classList.toggle('locked', !!l.lock);
  Object.assign(selBox.style, { width: w + 'px', height: hh + 'px', left: (l.x * st.u - w / 2) + 'px', top: (l.y * st.u - hh / 2) + 'px', transform: `rotate(${l.rot}deg)` });
}
function hit(cx, cy) {
  const els = shadow.elementsFromPoint ? shadow.elementsFromPoint(cx, cy) : [];
  for (const e of els) {
    const L = e.closest && e.closest('[data-lid]'); if (!L) continue;
    const l = layerById(L.dataset.lid); if (!l || l.lock || !l.vis) continue;
    if (l.type === 'particles' && e.tagName !== 'I') continue;
    if (l.type === 'orb' && !e.classList.contains('orb')) continue;
    return l.id;
  }
  return null;
}
function select(id) { st.sel = id; if (id) { const l = layerById(id); if (l && ![ 'style', 'motion', 'arrange' ].includes(st.tab)) st.tab = 'style'; } renderStrip(); renderInspector(); drawOverlay(); }

/* ---- drag / scale / rotate (selection box) */
function beginDrag(e, mode) {
  const l = cur(); if (!l || l.lock) return;
  e.preventDefault(); e.stopPropagation();
  const u = st.u, r0 = stageEl.getBoundingClientRect(), cx = r0.left + l.x * u, cy = r0.top + l.y * u;
  const s0 = { x: l.x, y: l.y, w: l.w, h: l.h, size: l.size, rot: l.rot }, p0 = { x: e.clientX, y: e.clientY }, d0 = Math.hypot(p0.x - cx, p0.y - cy) || 1;
  selBox.setPointerCapture?.(e.pointerId);
  const guideV = ov.querySelector('.cs-gv');
  const mv = ev => {
    if (mode === 'move') {
      let nx = s0.x + (ev.clientX - p0.x) / u, ny = s0.y + (ev.clientY - p0.y) / u;
      const snapX = Math.abs(nx - 195) < 4; if (snapX) nx = 195; guideV.hidden = !snapX;
      l.x = Math.round(nx * 10) / 10; l.y = Math.round(ny * 10) / 10;
      const el = layerEl(l.id); if (el) { el.style.left = `calc(var(--u)*${f(l.x)})`; el.style.top = `calc(var(--u)*${f(l.y)})`; }
      drawOverlay();
    } else if (mode === 'scale') {
      const k = Math.max(.1, Math.hypot(ev.clientX - cx, ev.clientY - cy) / d0);
      if (l.type === 'clock' || l.type === 'text') l.size = Math.max(4, Math.min(220, Math.round(s0.size * k * 10) / 10));
      else if (l.type === 'shape') { l.w = l.h = Math.max(8, Math.min(900, Math.round(s0.w * k))); }
      else { const r = s0.h / s0.w; l.w = Math.max(8, Math.min(900, Math.round(s0.w * k))); l.h = Math.round(l.w * r); }
      renderStage();
    } else {
      let a = Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI + 90; a = ((a % 360) + 360) % 360; if (a > 180) a -= 360;
      const sn = Math.round(a / 15) * 15; if (Math.abs(a - sn) < 3) a = sn; l.rot = Math.round(a);
      const el = layerEl(l.id); if (el) el.style.transform = `translate(-50%,-50%) rotate(${l.rot}deg)`; drawOverlay();
    }
  };
  const up = () => { selBox.removeEventListener('pointermove', mv); selBox.removeEventListener('pointerup', up); selBox.removeEventListener('pointercancel', up); guideV.hidden = true; renderInspector(true); commit(); };
  selBox.addEventListener('pointermove', mv); selBox.addEventListener('pointerup', up); selBox.addEventListener('pointercancel', up);
}

/* ------------------------------------------------------------------ mutation helper */
function upd(fn, rebuildPanel) { fn(); renderStage(); if (rebuildPanel) renderInspector(); renderStrip(); commit(); }
function addLayer(l, noSelect) { st.p.layers.push(l); if (!noSelect) st.sel = l.id; renderAll(); commit(true); closeDlg(); }
function nameFor(l) { return T(l.type === 'shape' ? 's_' + l.shape : l.type === 'frame' ? 'f_' + l.style : l.type); }

/* ------------------------------------------------------------------ strip */
function renderStrip() {
  if (!stripEl) return;
  stripEl.replaceChildren();
  stripEl.append(btn(T('add'), 'plus', () => openAdd(), 'cs-add primary'));
  for (const l of [...st.p.layers].reverse()) {
    const chip = h('div', { class: 'cs-chip' + (l.id === st.sel ? ' on' : '') + (l.vis ? '' : ' off') });
    chip.append(h('button', { type: 'button', class: 'cs-chip-main', onclick: () => select(l.id), 'aria-pressed': String(l.id === st.sel) }, ic(l.type === 'shape' ? 'shape' : l.type === 'frame' ? 'frame' : l.type), h('span', null, nameFor(l))));
    chip.append(h('button', { type: 'button', class: 'cs-chip-eye', 'aria-label': T(l.vis ? 'hide' : 'layers'), onclick: e => { e.stopPropagation(); l.vis = !l.vis; renderAll(); commit(true); } }, ic(l.vis ? 'eye' : 'eyeoff')));
    stripEl.append(chip);
  }
}

/* ------------------------------------------------------------------ inspector controls */
function row(label, ...ctrl) { return h('div', { class: 'cs-row' }, h('span', { class: 'cs-lbl' }, label), ...ctrl); }
function range(label, get, set, min, max, step, fmt, onchange) {
  const out = h('output', { class: 'cs-val' }, fmt ? fmt(get()) : String(get()));
  const inp = h('input', { type: 'range', min, max, step, value: get(), 'aria-label': label });
  inp.addEventListener('input', () => { const v = +inp.value; set(v); out.textContent = fmt ? fmt(v) : String(v); renderStage(); commit(); if (onchange) onchange(); });
  return h('label', { class: 'cs-range' }, h('span', { class: 'cs-lbl' }, label), out, inp);
}
function seg(label, opts, get, set, rebuild) {
  const wrap = h('div', { class: 'cs-seg', role: 'group', 'aria-label': label });
  for (const [v, t] of opts) wrap.append(h('button', { type: 'button', 'aria-pressed': String(get() === v), onclick: () => { set(v); renderStage(); commit(); if (rebuild) renderInspector(); else [...wrap.children].forEach(b => b.setAttribute('aria-pressed', String(b === event.currentTarget))); renderStrip(); } }, t));
  return h('div', { class: 'cs-field' }, label ? h('span', { class: 'cs-lbl' }, label) : null, wrap);
}
function toggle(label, get, set, rebuild) {
  const inp = h('input', { type: 'checkbox' }); inp.checked = !!get();
  inp.addEventListener('change', () => { set(inp.checked); renderStage(); commit(); if (rebuild) renderInspector(); });
  return h('label', { class: 'cs-tog' }, h('span', null, label), inp);
}
function colorField(label, get, set, { accent = true } = {}) {
  const wrap = h('div', { class: 'cs-field' }, h('span', { class: 'cs-lbl' }, label)), sw = h('div', { class: 'cs-sw' });
  const mark = () => [...sw.querySelectorAll('button')].forEach(b => b.setAttribute('aria-pressed', String(b.dataset.c === get())));
  if (accent) sw.append(h('button', { type: 'button', 'data-c': 'accent', class: 'acc', 'aria-label': T('devAccent'), title: T('devAccent'), onclick: () => { set('accent'); renderStage(); commit(); mark(); } }));
  for (const c of PALETTE) sw.append(h('button', { type: 'button', 'data-c': c, 'aria-label': c, style: `background:${c}`, onclick: () => { set(c); renderStage(); commit(); mark(); pick.value = c; } }));
  const pick = h('input', { type: 'color', 'aria-label': label, value: isHex(get()) ? get() : st.p.theme.accent });
  pick.addEventListener('input', () => { set(pick.value); renderStage(); commit(); mark(); });
  sw.append(pick); mark(); wrap.append(sw); return wrap;
}
function textInput(label, get, set, multiline) {
  const inp = h(multiline ? 'textarea' : 'input', { type: 'text', value: multiline ? null : get(), 'aria-label': label, maxlength: 80, dir: 'auto' }); if (multiline) inp.value = get();
  inp.addEventListener('input', () => { set(inp.value); renderStage(); renderStrip(); commit(); });
  return h('label', { class: 'cs-field' }, h('span', { class: 'cs-lbl' }, label), inp);
}
function sel(label, opts, get, set) {
  const s = h('select', { 'aria-label': label }); for (const [v, t] of opts) { const o = h('option', { value: v }, t); if (get() === v) o.selected = true; s.append(o); }
  s.addEventListener('change', () => { set(s.value); renderStage(); commit(); });
  return h('label', { class: 'cs-field' }, h('span', { class: 'cs-lbl' }, label), s);
}
const pct = v => Math.round(v * 100) + '%';

/* ---- per-type style panels */
function stylePanel(l) {
  const out = [];
  const colorBlock = (finish = true) => { out.push(colorField(T('color'), () => l.c, v => l.c = v)); if (finish) out.push(seg(T('finish'), [['polished', T('polished')], ['satin', T('satin')], ['flat', T('flat')]], () => l.finish || 'polished', v => l.finish = v)); };
  if (l.type === 'clock' || l.type === 'text') {
    if (l.type === 'text') out.push(textInput(T('content'), () => l.text, v => l.text = v, false));
    out.push(seg(T('font'), Object.keys(FONTS).map(k => [k, T('ft' + k[0].toUpperCase() + k.slice(1))]), () => l.font, v => { l.font = v; l.weight = 0; }));
    out.push(range(T('size'), () => l.size, v => l.size = v, 4, 160, .5));
    out.push(range(T('weight'), () => l.weight || FONTS[l.font].w, v => l.weight = v, 100, 900, 100));
    out.push(range(T('spacing'), () => l.ls, v => l.ls = v, -.1, 1, .01, v => v.toFixed(2) + 'em'));
    if (l.type === 'text') out.push(toggle(T('upper'), () => l.upper, v => l.upper = v));
    out.push(seg(T('tone'), [['ivory', T('tIvory')], ['color', T('tColor')], ['metal', T('tMetal')], ['white', T('tWhite')]], () => l.tone, v => l.tone = v, true));
    if (l.tone !== 'white') colorBlock(l.tone === 'metal');
    out.push(range(T('glow'), () => l.glow, v => l.glow = v, 0, 2, .05, v => v.toFixed(2)));
  } else if (l.type === 'frame') {
    out.push(sel(T('frames'), Object.keys(FR.GEN).map(k => [k, T('f_' + k)]), () => l.style, v => { l.style = v; renderInspector(); renderStrip(); }));
    colorBlock(true);
    out.push(range(T('stroke'), () => l.kw, v => l.kw = v, .5, 2, .05, v => '×' + v.toFixed(2)));
    const use = FR.STYLES[l.style].use;
    for (const k of ['glow', 'beads', 'jewels', 'pattern', 'ambient']) if (use.includes(k)) out.push(toggle(T(k), () => l[k], v => l[k] = v));
  } else if (l.type === 'shape') {
    const S = SHAPES[l.shape];
    out.push(sel(T('shapes'), Object.keys(SHAPES).map(k => [k, T('s_' + k)]), () => l.shape, v => { l.shape = v; const S2 = SHAPES[v]; l.sw = S2.sw; if (S2.p?.n) l.n = S2.p.n.def; if (S2.p?.k) l.k = S2.p.k.def; renderInspector(); renderStrip(); }));
    out.push(toggle(T('metal'), () => l.metal, v => l.metal = v, true));
    colorBlock(l.metal);
    out.push(range(T('stroke'), () => l.sw, v => l.sw = v, .2, 8, .1, v => v.toFixed(1)));
    if (S.p?.n) out.push(range(T(S.p.n.label), () => l.n, v => l.n = v, S.p.n.min, S.p.n.max, S.p.n.step));
    if (S.p?.k) out.push(range(T(S.p.k.label), () => l.k, v => l.k = v, S.p.k.min, S.p.k.max, S.p.k.step, v => v.toFixed(2)));
    out.push(toggle(T('fill'), () => l.fill, v => l.fill = v, true)); if (l.fill) out.push(range(T('fillOp'), () => l.fillOp, v => l.fillOp = v, .02, 1, .01, pct));
    out.push(toggle(T('glow'), () => l.glow, v => l.glow = v));
  } else if (l.type === 'image') {
    out.push(btn(T('replaceImage'), 'image', () => pickImage(l.id), 'cs-wide'));
    out.push(seg(T('fit'), [['contain', T('contain')], ['cover', T('cover')]], () => l.fit, v => l.fit = v));
    out.push(seg(T('mask'), [['none', T('none')], ['circle', T('circle')], ['rounded', T('rounded')], ['hex', T('hex')]], () => l.mask, v => l.mask = v));
    const a = st.p.assets[l.asset]; if (a) out.push(h('p', { class: 'cs-note' }, `${a.name || ''} · ${(a.bytes / 1024).toFixed(0)} KB${a.animated ? ' · animated' : ''}`));
  } else if (l.type === 'particles') {
    out.push(seg(T('kind'), [['stars', T('p_stars')], ['rise', T('p_rise')], ['fall', T('p_fall')], ['bokeh', T('p_bokeh')]], () => l.kind, v => l.kind = v));
    colorBlock(false);
    out.push(range(T('count'), () => l.count, v => l.count = v, 4, 90, 1));
    out.push(range(T('size'), () => l.size, v => l.size = v, 1, 12, .1, v => v.toFixed(1)));
    out.push(range(T('speed'), () => l.speed, v => l.speed = v, .2, 3, .05, v => '×' + v.toFixed(2)));
    out.push(btn(T('seed'), 'redo', () => upd(() => l.seed = Math.floor(Math.random() * 9999)), 'cs-wide'));
  } else if (l.type === 'orb') {
    out.push(colorField(T('color'), () => l.c, v => l.c = v));
    out.push(range(T('soft'), () => l.soft, v => l.soft = v, .2, 1, .01, pct));
  }
  return out;
}
function motionPanel(l) {
  const out = [], a = l.anim;
  const ids = Object.keys(ANIMS).filter(k => !(ANIMS[k].shapeOnly && l.type !== 'shape'));
  const grid = h('div', { class: 'cs-anims' });
  for (const k of ids) grid.append(h('button', { type: 'button', 'aria-pressed': String(a.p === k), onclick: () => { a.p = k; if (k === 'draw') { a.ease = 'ease-in-out'; a.dir = 'alternate'; a.dur = 6; } a.amp = 0; renderStage(); renderInspector(); commit(); } }, T('a_' + k)));
  out.push(h('div', { class: 'cs-field' }, h('span', { class: 'cs-lbl' }, T('preset')), grid));
  if (a.p !== 'none') {
    out.push(range(T('duration'), () => a.dur, v => a.dur = v, .5, 180, .5, v => v + 's'));
    out.push(range(T('delay'), () => a.delay, v => a.delay = v, -30, 30, .5, v => v + 's'));
    const m = ANIMS[a.p];
    if (m.amp) out.push(range(T('amount'), () => a.amp || m.amp[3], v => a.amp = v, m.amp[0], m.amp[1], m.amp[2], v => (+v).toFixed(2)));
    out.push(seg(T('easing'), [['linear', T('e_linear')], ['ease-in-out', T('e_ease-in-out')], ['ease', T('e_ease')], ['cubic-bezier(.34,1.56,.64,1)', T('e_cubic-bezier(.34,1.56,.64,1)')]], () => a.ease, v => a.ease = v));
    out.push(seg(T('direction'), [['normal', T('d_normal')], ['reverse', T('d_reverse')], ['alternate', T('d_alternate')]], () => a.dir, v => a.dir = v));
  }
  return out;
}
function arrangePanel(l) {
  const out = [];
  out.push(range(T('posX'), () => l.x, v => l.x = v, -40, 430, 1, v => Math.round(v)));
  out.push(range(T('posY'), () => l.y, v => l.y = v, -40, 880, 1, v => Math.round(v)));
  out.push(btn(T('center'), 'center', () => upd(() => l.x = 195, true), 'cs-wide'));
  if (l.type !== 'clock' && l.type !== 'text') {
    out.push(range(T('width'), () => l.w, v => { const r = l.h / l.w; l.w = v; if (l.type === 'shape') l.h = v; else l.h = v * r; }, 8, 900, 1, v => Math.round(v), () => 0));
    if (l.type === 'particles' || l.type === 'orb') out.push(range(T('height'), () => l.h, v => l.h = v, 8, 900, 1, v => Math.round(v)));
  }
  out.push(range(T('rotation'), () => l.rot, v => l.rot = v, -180, 180, 1, v => v + '°'));
  out.push(range(T('opacity'), () => l.op, v => l.op = v, .02, 1, .01, pct));
  out.push(sel(T('blend'), [['normal', T('normal')], ['screen', T('screen')], ['lighten', T('lighten')], ['overlay', T('overlay')], ['plus-lighter', T('plusl')]], () => l.blend, v => l.blend = v));
  return out;
}
function renderInspector(light) {
  if (!inspEl) return;
  const l = cur();
  if (light && l && inspEl.dataset.id === l.id) { drawOverlay(); const keep = inspEl.querySelector('.cs-tab-body'); if (keep) { fill(keep, l); } return; }
  inspEl.replaceChildren(); inspEl.dataset.id = l ? l.id : '';
  if (!l) { inspEl.append(h('div', { class: 'cs-empty' }, h('p', null, T('noSel')), h('div', { class: 'cs-empty-acts' }, btn(T('add'), 'plus', () => openAdd(), 'primary'), btn(T('templates'), 'tpl', () => openTemplates()), btn(T('theme'), 'gear', () => openTheme())))); return; }
  const tools = h('div', { class: 'cs-tools' },
    h('strong', { class: 'cs-lname' }, nameFor(l)),
    h('div', { class: 'cs-tools-b' },
      btn('', 'dup', () => { const c = clone(l); c.id = C.uid(); c.x += 14; c.y += 14; st.p.layers.splice(st.p.layers.indexOf(l) + 1, 0, c); st.sel = c.id; renderAll(); commit(true); }, 'icon', T('dup')),
      btn('', 'up', () => { const i = st.p.layers.indexOf(l); if (i < st.p.layers.length - 1) { st.p.layers.splice(i, 1); st.p.layers.splice(i + 1, 0, l); renderAll(); commit(true); } }, 'icon', T('up')),
      btn('', 'down', () => { const i = st.p.layers.indexOf(l); if (i > 0) { st.p.layers.splice(i, 1); st.p.layers.splice(i - 1, 0, l); renderAll(); commit(true); } }, 'icon', T('down')),
      btn('', l.lock ? 'lock' : 'unlock', () => { l.lock = !l.lock; renderAll(); commit(true); }, 'icon' + (l.lock ? ' on' : ''), T('lock')),
      btn('', 'trash', () => { if (l.type === 'clock') { say(T('noDelClock')); return; } st.p.layers = st.p.layers.filter(x => x !== l); st.sel = null; renderAll(); commit(true); }, 'icon danger', T('del'))));
  const tabs = h('div', { class: 'cs-tabs', role: 'tablist' });
  for (const k of ['style', 'motion', 'arrange']) tabs.append(h('button', { type: 'button', role: 'tab', 'aria-selected': String(st.tab === k), onclick: () => { st.tab = k; renderInspector(); } }, T(k)));
  const body = h('div', { class: 'cs-tab-body' }); fill(body, l);
  inspEl.append(tools, tabs, body);
}
function fill(body, l) { body.replaceChildren(...(st.tab === 'motion' ? motionPanel(l) : st.tab === 'arrange' ? arrangePanel(l) : stylePanel(l))); }
function say(msg) { const s = $('.cs-toast', root); if (!s) return; s.textContent = msg; s.hidden = false; clearTimeout(say.t); say.t = setTimeout(() => s.hidden = true, 2600); }

/* ------------------------------------------------------------------ dialogs */
function openDlg(title, content, cls) {
  if (!dlg) { dlg = h('dialog', { class: 'cs-dlg' }); document.body.append(dlg); dlg.addEventListener('click', e => { if (e.target === dlg) closeDlg(); }); }
  dlg.className = 'cs-dlg ' + (cls || '');
  dlg.replaceChildren(h('div', { class: 'sheet-handle' }), h('div', { class: 'cs-dh' }, h('h2', null, title), btn('', 'x', closeDlg, 'icon', T('close'))), content);
  if (!dlg.open) dlg.showModal();
}
function closeDlg() { if (dlg && dlg.open) dlg.close(); }
const thumbCache = {};
function thumb(kind, id) {
  const key = kind + id + st.p.theme.accent; if (thumbCache[key]) return thumbCache[key].cloneNode(true);
  const proj = newProject(); proj.theme.accent = st.p.theme.accent;
  const l = kind === 'shape' ? newLayer('shape', { shape: id, c: '#c9ad78', w: 100, h: 100 }) : newLayer('frame', { style: id, c: '#c9ad78', w: 180, h: 95 });
  const inner = C.layerInner(l, proj); const d = h('div', { class: 'cs-th' + (kind === 'frame' ? ' wide' : ''), html: inner });
  d.style.cssText = '--lc:#c9ad78;--mid:#c9ad78;--hi:#f1e3bd;--lo:#7f6a3e;'; thumbCache[key] = d; return d.cloneNode(true);
}
function openAdd(tab = 'shapes') {
  const body = h('div', { class: 'cs-add' }), tabs = h('div', { class: 'cs-seg wide', role: 'tablist' });
  const grids = {
    shapes: () => h('div', { class: 'cs-tiles' }, Object.keys(SHAPES).map(k => h('button', { type: 'button', class: 'cs-tile', onclick: () => addLayer(newLayer('shape', { shape: k, c: 'accent' })) }, thumb('shape', k), h('span', null, T('s_' + k))))),
    frames: () => h('div', { class: 'cs-tiles two' }, Object.keys(FR.GEN).map(k => h('button', { type: 'button', class: 'cs-tile', onclick: () => addLayer(newLayer('frame', { style: k, c: 'accent' })) }, thumb('frame', k), h('span', null, T('f_' + k))))),
    media: () => h('div', { class: 'cs-tiles two' }, h('button', { type: 'button', class: 'cs-tile', onclick: () => pickImage() }, h('div', { class: 'cs-th ico' }, ic('image', 40)), h('span', null, T('pickImage')))),
    effects: () => h('div', { class: 'cs-tiles' }, ['stars', 'rise', 'fall', 'bokeh'].map(k => h('button', { type: 'button', class: 'cs-tile', onclick: () => addLayer(newLayer('particles', { kind: k, c: 'accent', size: k === 'bokeh' ? 4 : 2.6, count: k === 'bokeh' ? 14 : 34, speed: k === 'bokeh' ? .6 : 1 })) }, h('div', { class: 'cs-th ico' }, ic('particles', 34)), h('span', null, T('p_' + k)))), h('button', { type: 'button', class: 'cs-tile', onclick: () => addLayer(newLayer('orb', { c: 'accent', op: .35 })) }, h('div', { class: 'cs-th ico' }, ic('orb', 34)), h('span', null, T('orb')))),
    texts: () => h('div', { class: 'cs-tiles two' }, h('button', { type: 'button', class: 'cs-tile', onclick: () => addLayer(newLayer('text', { text: lang() === 'ar' ? 'كاستيكس' : 'CASTIX', y: 200 })) }, h('div', { class: 'cs-th ico' }, ic('text', 36)), h('span', null, T('text'))),
      st.p.layers.some(x => x.type === 'clock') ? null : h('button', { type: 'button', class: 'cs-tile', onclick: () => addLayer(newLayer('clock')) }, h('div', { class: 'cs-th ico' }, ic('clock', 36)), h('span', null, T('clock'))))
  };
  const show = k => { body.replaceChildren(grids[k]()); [...tabs.children].forEach(b => b.setAttribute('aria-selected', String(b.dataset.k === k))); };
  for (const k of ['shapes', 'frames', 'media', 'effects', 'texts']) tabs.append(h('button', { type: 'button', role: 'tab', 'data-k': k, onclick: () => show(k) }, T(k)));
  openDlg(T('add'), h('div', null, tabs, body)); show(tab);
}
/* images */
function pickImage(replaceId) {
  if (!fileIn) { fileIn = h('input', { type: 'file', accept: 'image/*,.svg,.gif,.webp', hidden: true }); document.body.append(fileIn); }
  fileIn.value = ''; fileIn.onchange = async () => { const fl = fileIn.files[0]; if (!fl) return; try { const a = await readImage(fl); const id = 'a' + C.uid().slice(1); st.p.assets[id] = a;
    if (replaceId) { const l = layerById(replaceId); if (l) { l.asset = id; } renderAll(); commit(true); }
    else { const r = a.h / a.w, w = Math.min(240, Math.max(80, a.w)); addLayer(newLayer('image', { asset: id, w, h: Math.round(w * r), name: fl.name })); }
    if (a.bytes > 900000) say(T('imgBig')); } catch (e) { say(T('imgFail')); } };
  fileIn.click();
}
async function readImage(file) {
  const buf = await file.arrayBuffer(), u8 = new Uint8Array(buf), head = new TextDecoder('latin1').decode(u8.slice(0, 65536));
  const mime = file.type || 'image/png', animated = mime === 'image/gif' || mime === 'image/svg+xml' || head.includes('acTL') || head.includes('ANIM');
  const toUrl = (blob) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(blob); });
  const dims = await new Promise((res, rej) => { const u = URL.createObjectURL(file), im = new Image(); im.onload = () => { res([im.naturalWidth || 200, im.naturalHeight || 200]); URL.revokeObjectURL(u); }; im.onerror = () => rej(new Error('img')); im.src = u; });
  if (animated) { if (file.size > 3e6) throw new Error('big'); return { mime, data: await toUrl(file), bytes: file.size, animated: true, name: file.name, w: dims[0], h: dims[1] }; }
  const max = 1024, k = Math.min(1, max / Math.max(dims[0], dims[1])), bm = await createImageBitmap(file), cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(dims[0] * k)); cv.height = Math.max(1, Math.round(dims[1] * k)); cv.getContext('2d').drawImage(bm, 0, 0, cv.width, cv.height);
  let blob = await new Promise(r => cv.toBlob(r, 'image/webp', .86)); if (!blob || blob.type !== 'image/webp') blob = await new Promise(r => cv.toBlob(r, 'image/png'));
  return { mime: blob.type, data: await toUrl(blob), bytes: blob.size, animated: false, name: file.name, w: cv.width, h: cv.height };
}

/* ------------------------------------------------------------------ templates */
const m = (type, o) => newLayer(type, o);
const GOLD = '#c9ad78';
const TEMPLATES = [
  { id: 'imperial', n: ['Imperial', 'إمبريال'], accent: GOLD, build: () => [
    m('particles', { kind: 'stars', w: 330, h: 180, y: 236, count: 22, size: 2.2, c: '#f1e3bd', seed: 3, op: .8 }),
    m('frame', { style: 'imperial', w: 340, h: 180, c: GOLD }),
    m('text', { text: 'ONYX', y: 200, size: 8.5, ls: .5, c: GOLD, weight: 500 }), m('clock', { size: 54, y: 236, c: GOLD }), m('text', { text: 'IMPERIAL', y: 274, size: 8.5, ls: .34, c: GOLD, weight: 500 })] },
  { id: 'zellige', n: ['Zellige Night', 'ليل الزليج'], accent: GOLD, build: () => [
    m('shape', { shape: 'khatam', w: 330, h: 330, y: 236, n: 3, k: .72, sw: 1, op: .22, anim: { p: 'rot', dur: 140, delay: 0, ease: 'linear', dir: 'normal', amp: 0 } }),
    m('shape', { shape: 'lattice', w: 250, h: 250, y: 236, n: 5, sw: .6, op: .18, anim: { p: 'rot', dur: 90, delay: 0, ease: 'linear', dir: 'reverse', amp: 0 } }),
    m('frame', { style: 'zellige', w: 350, h: 185, y: 236, c: GOLD }),
    m('text', { text: 'ONYX', y: 198, size: 8.5, ls: .5, c: GOLD, weight: 500 }), m('clock', { size: 50, y: 236, c: GOLD }), m('text', { text: 'ZELLIGE', y: 274, size: 8.5, ls: .34, c: GOLD, weight: 500 }),
    m('particles', { kind: 'stars', w: 360, h: 300, y: 236, count: 18, size: 2, c: '#fff1c8', seed: 11, op: .7 })] },
  { id: 'orbit', n: ['Orbit', 'مدار'], accent: '#4cc2ff', build: () => [
    m('orb', { w: 330, h: 330, y: 236, c: '#4cc2ff', op: .22, soft: .72, anim: { p: 'pulse', dur: 7, delay: 0, ease: 'ease-in-out', dir: 'normal', amp: 1.14 } }),
    m('shape', { shape: 'circle', w: 300, h: 300, y: 236, c: '#4cc2ff', sw: .7, op: .55 }),
    m('shape', { shape: 'arc', w: 280, h: 280, y: 236, c: '#4cc2ff', k: .32, sw: 2.4, metal: false, anim: { p: 'rot', dur: 14, delay: 0, ease: 'linear', dir: 'normal', amp: 0 } }),
    m('shape', { shape: 'orbit', w: 250, h: 250, y: 236, c: '#4cc2ff', k: .4, sw: 1, anim: { p: 'rot', dur: 24, delay: 0, ease: 'linear', dir: 'reverse', amp: 0 } }),
    m('shape', { shape: 'concentric', w: 190, h: 190, y: 236, c: '#4cc2ff', n: 3, sw: .5, op: .45, anim: { p: 'spinpulse', dur: 16, delay: 0, ease: 'ease-in-out', dir: 'normal', amp: 1.08 } }),
    m('clock', { size: 50, y: 236, font: 'sans', tone: 'white', glow: .6, c: '#4cc2ff' })] },
  { id: 'rosette', n: ['Guilloché Rosette', 'وردة الغيلوشيه'], accent: GOLD, build: () => [
    m('shape', { shape: 'rosette', w: 340, h: 340, y: 236, n: 48, k: .5, sw: .45, op: .8, anim: { p: 'rot', dur: 120, delay: 0, ease: 'linear', dir: 'normal', amp: 0 } }),
    m('shape', { shape: 'circle', w: 348, h: 348, y: 236, sw: 1.4 }), m('shape', { shape: 'circle', w: 336, h: 336, y: 236, sw: .5, op: .6 }),
    m('orb', { w: 200, h: 200, y: 236, c: '#000000', op: .85, soft: .9 }),
    m('clock', { size: 56, y: 236, c: GOLD })] },
  { id: 'aurora', n: ['Aurora', 'الشفق'], accent: '#7fe0d0', build: () => [
    m('orb', { w: 380, h: 380, x: 120, y: 170, c: '#3ad6c3', op: .55, blend: 'screen', anim: { p: 'drift', dur: 16, delay: 0, ease: 'ease-in-out', dir: 'normal', amp: 34 } }),
    m('orb', { w: 360, h: 360, x: 290, y: 310, c: '#7a6bff', op: .5, blend: 'screen', anim: { p: 'drift', dur: 20, delay: -6, ease: 'ease-in-out', dir: 'reverse', amp: 40 } }),
    m('orb', { w: 280, h: 280, x: 200, y: 120, c: '#ff6ea8', op: .3, blend: 'screen', anim: { p: 'drift', dur: 24, delay: -10, ease: 'ease-in-out', dir: 'normal', amp: 30 } }),
    m('particles', { kind: 'rise', w: 380, h: 420, y: 250, count: 36, size: 1.8, c: '#ffffff', speed: .6, seed: 5, op: .8 }),
    m('clock', { size: 70, y: 236, font: 'sans', weight: 200, tone: 'white', glow: .4, c: '#7fe0d0' })] },
  { id: 'sacred', n: ['Sacred Geometry', 'الهندسة المقدسة'], accent: '#d9a08f', build: () => [
    m('shape', { shape: 'mandala', w: 310, h: 310, y: 236, n: 16, k: .3, sw: .8, c: '#d9a08f', anim: { p: 'rot', dur: 100, delay: 0, ease: 'linear', dir: 'normal', amp: 0 } }),
    m('shape', { shape: 'star', w: 250, h: 250, y: 236, n: 8, k: .55, sw: 1, c: '#d9a08f', op: .8, anim: { p: 'rot', dur: 70, delay: 0, ease: 'linear', dir: 'reverse', amp: 0 } }),
    m('shape', { shape: 'circle', w: 330, h: 330, y: 236, sw: 1, c: '#d9a08f', op: .7 }),
    m('shape', { shape: 'hexgrid', w: 150, h: 150, y: 236, n: 2, sw: .7, c: '#d9a08f', op: .55, anim: { p: 'sway', dur: 12, delay: 0, ease: 'ease-in-out', dir: 'normal', amp: 6 } }),
    m('orb', { w: 150, h: 150, y: 236, c: '#000000', op: .8, soft: .95 }),
    m('clock', { size: 44, y: 236, c: '#d9a08f' })] },
  { id: 'laurier', n: ['Laurel Crest', 'تاج الغار'], accent: GOLD, build: () => [
    m('particles', { kind: 'rise', w: 340, h: 260, y: 250, count: 30, size: 1.8, c: '#e8d6ad', speed: .55, seed: 9, op: .9 }),
    m('frame', { style: 'laurier', w: 350, h: 185, c: GOLD }),
    m('text', { text: 'ONYX', y: 205, size: 8.5, ls: .5, c: GOLD, weight: 500 }), m('clock', { size: 50, y: 236, c: GOLD }), m('text', { text: 'LAURIER', y: 270, size: 8.5, ls: .34, c: GOLD, weight: 500 })] },
  { id: 'minimal', n: ['Minimal Draw', 'رسم بسيط'], accent: '#ffffff', build: () => [
    m('shape', { shape: 'circle', w: 270, h: 270, y: 236, c: '#ffffff', metal: false, sw: 1.2, anim: { p: 'draw', dur: 7, delay: 0, ease: 'ease-in-out', dir: 'alternate', amp: 0 } }),
    m('shape', { shape: 'arc', w: 300, h: 300, y: 236, c: '#ffffff', metal: false, k: .22, sw: 3, anim: { p: 'rot', dur: 6, delay: 0, ease: 'linear', dir: 'normal', amp: 0 } }),
    m('shape', { shape: 'orbit', w: 220, h: 220, y: 236, c: '#ffffff', metal: false, k: .5, sw: .8, op: .6, anim: { p: 'rot', dur: 14, delay: 0, ease: 'linear', dir: 'reverse', amp: 0 } }),
    m('clock', { size: 56, y: 236, font: 'mono', weight: 300, tone: 'white', c: '#ffffff', ls: -.06 })] },
  { id: 'celestial', n: ['Celestial', 'سماوي'], accent: '#b99aff', build: () => [
    m('orb', { w: 320, h: 260, y: 236, c: '#b99aff', op: .16, soft: .7, anim: { p: 'breathe', dur: 9, delay: 0, ease: 'ease-in-out', dir: 'normal', amp: .5 } }),
    m('frame', { style: 'celestial', w: 350, h: 185, c: '#b99aff' }),
    m('particles', { kind: 'stars', w: 380, h: 330, y: 236, count: 44, size: 2.2, c: '#ffffff', seed: 21, op: .8 }),
    m('clock', { size: 52, y: 240, c: '#b99aff' })] }
];
function applyTemplate(t) {
  st.p.layers = t.build(); st.p.theme.accent = t.accent; st.p.meta.name = 'Castix ' + t.n[0]; st.sel = st.p.layers.find(l => l.type === 'clock')?.id || null; st.tab = 'style';
  renderAll(); commit(true); closeDlg();
}
function openTemplates() {
  const grid = h('div', { class: 'cs-tpls' });
  TEMPLATES.forEach(t => {
    const card = h('button', { type: 'button', class: 'cs-tpl', onclick: () => applyTemplate(t) }), box = h('div', { class: 'cs-tpl-v' }), sh = box.attachShadow({ mode: 'open' });
    const proj = newProject(); proj.theme.accent = t.accent; proj.layers = t.build();
    sh.innerHTML = `<style>:host{display:block;position:relative;width:100%;height:100%}${C.buildCss(proj, { preview: true }).replace(':root', ':host')}.L{pointer-events:none}</style>${C.buildBody(proj).replace('<div class="cx">', '<div class="cx paused" style="--u:0.42px">')}`;
    const clk = sh.querySelector('#clock'); if (clk) clk.textContent = '10:08';
    card.addEventListener('pointerenter', () => sh.querySelector('.cx')?.classList.remove('paused')); card.addEventListener('pointerleave', () => sh.querySelector('.cx')?.classList.add('paused'));
    grid.append(card); card.append(box, h('span', null, t.n[lang() === 'ar' ? 1 : 0]));
    setTimeout(() => sh.querySelector('.cx')?.classList.remove('paused'), 150);
  });
  openDlg(T('tplTitle'), h('div', null, h('p', { class: 'cs-note' }, T('tplHint')), grid));
}
function openTheme() {
  const p = st.p, b = h('div', { class: 'cs-form' });
  const inp = (label, get, set, ml) => textInput(label, get, v => { set(v); }, ml);
  b.append(inp(T('tName'), () => p.meta.name, v => p.meta.name = v), inp(T('tAuthor'), () => p.meta.author, v => p.meta.author = v), inp(T('tVersion'), () => p.meta.version, v => p.meta.version = v), inp(T('tCat'), () => p.meta.category, v => p.meta.category = v), inp(T('tDesc'), () => p.meta.description, v => p.meta.description = v, true));
  b.append(seg(T('bg'), [['solid', T('solid')], ['linear', T('linear')], ['radial', T('radial')]], () => p.theme.bg.type, v => p.theme.bg.type = v, false));
  const bgRow = h('div', { class: 'cs-two' },
    h('label', { class: 'cs-field' }, h('span', { class: 'cs-lbl' }, T('bgA')), h('input', { type: 'color', value: p.theme.bg.c1, oninput: e => { p.theme.bg.c1 = e.target.value; renderStage(); commit(); } })),
    h('label', { class: 'cs-field' }, h('span', { class: 'cs-lbl' }, T('bgB')), h('input', { type: 'color', value: p.theme.bg.c2, oninput: e => { p.theme.bg.c2 = e.target.value; renderStage(); commit(); } })));
  b.append(bgRow, range(T('angle'), () => p.theme.bg.angle, v => p.theme.bg.angle = v, 0, 360, 5, v => v + '°'));
  b.append(colorField(T('accent'), () => p.theme.accent, v => p.theme.accent = v, { accent: false }), toggle(T('lockAcc') + ' · ' + T('lockAccH'), () => p.theme.lock, v => p.theme.lock = v));
  const acts = h('div', { class: 'cs-acts' },
    btn(T('newProj'), 'plus', () => { if (confirm(T('confirmNew'))) { const n = newProject(); n.layers = [newLayer('clock', { c: 'accent' })]; st.p.layers = n.layers; st.p.assets = {}; st.p.meta = n.meta; st.p.theme = n.theme; st.sel = n.layers[0].id; renderAll(); commit(true); closeDlg(); } }),
    btn(T('saveProj'), 'file', () => saveFile(new Blob([JSON.stringify(st.p)], { type: 'application/json' }), C.slugOf(p) + '.castixstudio.json')),
    btn(T('openProj'), 'file', () => { const fi = h('input', { type: 'file', accept: '.json,application/json' }); fi.onchange = async () => { try { const o = JSON.parse(await fi.files[0].text()); if (!o.layers) throw 0; st.p = Object.assign(newProject(), o); st.sel = null; renderAll(); commit(true); closeDlg(); } catch (e) { say(T('failed')); } }; fi.click(); }));
  openDlg(T('theme'), h('div', null, b, acts));
}

/* ------------------------------------------------------------------ export */
let dlSeq = 0;
function saveFile(blob, name) {
  const a = h('a', { href: URL.createObjectURL(blob), download: name }); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 30000);
}
async function snapshot(p, w = 390, hgt = 560, time = '10:08') {
  const css = C.buildCss(p).replace(/html,body\{[^}]*\}/, '') + '*{animation:none!important}.dr .sh{stroke-dasharray:none!important;stroke-dashoffset:0!important}.pt i{opacity:.8!important}',
    body = C.buildBody(p).replace('<div class="cx">', '<div class="cx" style="--u:1px">').replace(/<img([^>]*?)>/g, '<img$1/>');
  const html = `<div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;width:${w}px;height:${hgt}px;overflow:hidden;background:${p.theme.bg.c1}"><style><![CDATA[${css}]]></style>${body.replace('--:--', time)}</div>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${hgt}"><foreignObject width="100%" height="100%">${html}</foreignObject></svg>`;
  const im = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
  return im;
}
async function makeImages(p) {
  const im = await snapshot(p), clk = p.layers.find(l => l.type === 'clock'), cy = clk ? clk.y : 236;
  const ic2 = document.createElement('canvas'); ic2.width = ic2.height = 256; const x = ic2.getContext('2d'); x.fillStyle = p.theme.bg.c1; x.fillRect(0, 0, 256, 256);
  const sy = Math.max(0, Math.min(560 - 390, cy - 195)); x.drawImage(im, 0, sy, 390, 390, 0, 0, 256, 256);
  const pv = document.createElement('canvas'); pv.width = 960; pv.height = 600; const y = pv.getContext('2d'); y.fillStyle = '#0a0e14'; y.fillRect(0, 0, 960, 600);
  y.fillStyle = '#000'; y.strokeStyle = mixc(p.theme.accent, '#000000', .35); y.lineWidth = 2; y.beginPath(); y.roundRect(600, 15, 314, 570, 44); y.fill(); y.stroke();
  y.save(); y.beginPath(); y.roundRect(602, 17, 310, 566, 42); y.clip(); y.drawImage(im, 603, 60, 308, 442); y.restore();
  y.fillStyle = '#e8eef5'; y.font = '600 70px system-ui,sans-serif'; y.fillText(p.meta.name.slice(0, 18), 56, 250); y.fillStyle = p.theme.accent; y.font = '22px system-ui,sans-serif'; try { y.letterSpacing = '4px'; } catch (e) {} y.fillText('CASTIX  /  AMOLED THEME', 58, 300);
  y.fillStyle = '#9aa8b6'; try { y.letterSpacing = '0px'; } catch (e) {} y.font = '20px system-ui,sans-serif'; y.fillText(p.meta.category + ' · v' + p.meta.version, 58, 350);
  return { icon: ic2, preview: pv };
}
const jpegB64 = (cv, limit) => { for (let q = .9; q >= .3; q -= .1) { const d = cv.toDataURL('image/jpeg', q).split(',')[1]; if (d.length <= Math.floor(limit / 3) * 4) return d; } return ''; };
const blobB64 = b => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(',')[1]); r.onerror = rej; r.readAsDataURL(b); });
async function openExport() {
  const p = st.p, box = h('div', { class: 'cs-exp' }), status = h('p', { class: 'cs-note', role: 'status' }, T('building'));
  const meter = h('div', { class: 'cs-meter' }, h('i')), meterT = h('div', { class: 'cs-mt' });
  let cas = null;
  const names = h('div', { class: 'cs-form' }, textInput(T('tName'), () => p.meta.name, v => { p.meta.name = v; clearTimeout(names.t); names.t = setTimeout(build, 400); }), textInput(T('tVersion'), () => p.meta.version, v => p.meta.version = v), textInput(T('tCat'), () => p.meta.category, v => p.meta.category = v), textInput(T('tDesc'), () => p.meta.description, v => p.meta.description = v, true));
  const acts = h('div', { class: 'cs-acts col' });
  const tg = host.tg && host.tg.initData && host.api;
  const bDl = btn(T('dlCas'), 'dl', async () => { if (!cas) return; saveFile(cas, C.slugOf(p) + '.cas'); status.textContent = tg ? T('tgHint') : T('done'); }, 'primary');
  const bSh = btn(T('share'), 'share', async () => { if (!cas) return; const file = new File([cas], C.slugOf(p) + '.cas', { type: 'application/octet-stream' }); try { if (navigator.canShare && navigator.canShare({ files: [file] })) await navigator.share({ files: [file], title: p.meta.name }); else status.textContent = T('tgHint'); } catch (e) {} });
  const bSend = tg ? btn(T('send'), 'send', async () => {
    if (!cas || cas.size > 2097152) return; bSend.disabled = true; status.textContent = T('building');
    try { const im = await makeImages(p).catch(() => null); const payload = { name: p.meta.name, version: p.meta.version, category: p.meta.category, description: p.meta.description, filename: C.slugOf(p) + '.cas', file: await blobB64(cas), icon: im ? jpegB64(im.icon, 120000) : '', preview: im ? jpegB64(im.preview, 400000) : '' };
      await host.api('submit', payload); status.textContent = T('sent'); host.tg?.HapticFeedback?.notificationOccurred?.('success'); } catch (e) { status.textContent = (e && e.message) || T('failed'); } finally { bSend.disabled = false; } }) : null;
  const bImg = btn(T('imgs'), 'image', async () => { try { const im = await makeImages(p); im.icon.toBlob(b => saveFile(b, C.slugOf(p) + '_icon.jpg'), 'image/jpeg', .92); im.preview.toBlob(b => setTimeout(() => saveFile(b, C.slugOf(p) + '_preview.jpg'), 400), 'image/jpeg', .9); } catch (e) { status.textContent = T('failed'); } });
  acts.append(...[bDl, bSh, bSend, bImg].filter(Boolean));
  async function build() {
    status.textContent = T('building'); [bDl, bSh, bSend].forEach(b => b && (b.disabled = true));
    try { cas = await C.buildCas(p); const pctv = Math.min(100, cas.size / 2097152 * 100); meter.firstChild.style.width = pctv + '%'; meter.classList.toggle('bad', cas.size > 2097152);
      meterT.textContent = `${T('pkgSize')}: ${(cas.size / 1024).toFixed(0)} KB · ${T('limit')}`;
      const warns = []; if (cas.size > 2097152) warns.push(T('over')); if (!p.layers.some(l => l.type === 'clock')) warns.push(T('noClock'));
      status.textContent = warns.join(' ') || ''; [bDl, bSh].forEach(b => b.disabled = false); if (bSend) bSend.disabled = cas.size > 2097152;
    } catch (e) { status.textContent = T('failed'); }
  }
  const codeSeg = h('div', { class: 'cs-seg', role: 'group' }), pre = h('pre', { class: 'cs-code' }); const F = C.buildFiles(p);
  const files = { 'index.html': F.html, 'style.css': F.css, 'script.js': F.js, 'plugins.json': F.json };
  const showCode = k => { pre.textContent = files[k].length > 6000 ? files[k].slice(0, 6000) + '\n…' : files[k]; [...codeSeg.children].forEach(b => b.setAttribute('aria-pressed', String(b.textContent === k))); };
  Object.keys(files).forEach(k => codeSeg.append(h('button', { type: 'button', onclick: () => showCode(k) }, k))); showCode('index.html');
  box.append(names, h('div', { class: 'cs-mw' }, meter, meterT), status, acts, h('details', { class: 'cs-det' }, h('summary', null, T('codeV')), codeSeg, pre));
  openDlg(T('xTitle'), box); build();
}

/* ------------------------------------------------------------------ mount */
function renderAll() { renderStage(); renderStrip(); renderInspector(); syncToolbar(); }
function syncToolbar() {
  if (!root) return; const q = s => $(s, root);
  q('[data-v=top]')?.setAttribute('aria-pressed', String(st.view === 'top')); q('[data-v=full]')?.setAttribute('aria-pressed', String(st.view === 'full'));
  [...root.querySelectorAll('[data-t]')].forEach(b => b.setAttribute('aria-pressed', String(b.dataset.t === st.time)));
  const pp = q('.cs-pp'); if (pp) { pp.replaceChildren(ic(st.paused ? 'play' : 'pause'), h('span', null, st.paused ? T('play') : T('pause'))); }
  q('.cs-gtog')?.setAttribute('aria-pressed', String(st.guide));
  syncUndo();
}
function build() {
  root = h('section', { class: 'cs', 'data-studio': '' });
  undoB = btn('', 'undo', undo, 'icon', T('undo')); redoB = btn('', 'redo', redo, 'icon', T('redo'));
  const bar = h('div', { class: 'cs-bar' }, h('div', { class: 'cs-tt' }, h('h2', null, T('title')), h('small', null, T('sub'))),
    h('div', { class: 'cs-bar-a' }, undoB, redoB, btn(T('templates'), 'tpl', openTemplates), btn('', 'gear', openTheme, 'icon', T('theme')), btn(T('export'), 'export', openExport, 'primary')));
  edB = h('button', { type: 'button', class: 'cs-edbtn', onclick: () => setEdit(!st.edit) });
  stageEl = h('div', { class: 'cs-stage' }); const host2 = h('div', { class: 'cs-host' }); stageEl.append(host2); shadow = host2.attachShadow({ mode: 'open' });
  ov = h('div', { class: 'cs-ov' }, h('div', { class: 'cs-zone' }, h('span', null, T('zone'))), h('div', { class: 'cs-gv', hidden: true }));
  selBox = h('div', { class: 'cs-sel', hidden: true, onpointerdown: e => { if (touchLocked(e)) return; if (!e.target.dataset.h) beginDrag(e, 'move'); } }, h('i', { class: 'cs-hs', 'data-h': 'scale', onpointerdown: e => { if (!touchLocked(e)) beginDrag(e, 'scale'); } }), h('i', { class: 'cs-hr', 'data-h': 'rot', onpointerdown: e => { if (!touchLocked(e)) beginDrag(e, 'rot'); } }));
  ov.append(selBox); stageEl.append(ov);
  ov.addEventListener('click', e => { if (e.target.closest('.cs-sel')) return; const id = hit(e.clientX, e.clientY); select(id); });
  const tools = h('div', { class: 'cs-stool' },
    h('div', { class: 'cs-seg' }, h('button', { type: 'button', 'data-v': 'top', onclick: () => { st.view = 'top'; renderStage(); syncToolbar(); } }, T('top')), h('button', { type: 'button', 'data-v': 'full', onclick: () => { st.view = 'full'; renderStage(); syncToolbar(); } }, T('full'))),
    h('div', { class: 'cs-seg' }, ...['10:08', '12:48 PM', '١٠:٠٨ ص'].map(t => h('button', { type: 'button', 'data-t': t, onclick: () => { st.time = t; renderStage(); syncToolbar(); } }, t))),
    h('button', { type: 'button', class: 'cs-b cs-pp', onclick: () => { st.paused = !st.paused; renderStage(); syncToolbar(); } }),
    h('button', { type: 'button', class: 'cs-b cs-gtog', onclick: () => { st.guide = !st.guide; drawOverlay(); syncToolbar(); } }, T('guide')));
  stripEl = h('div', { class: 'cs-strip' }); inspEl = h('article', { class: 'cs-insp' });
  root.append(bar, h('div', { class: 'cs-grid' }, h('div', { class: 'cs-col-a' }, h('div', { class: 'cs-stagebox' }, stageEl, edB), tools), h('div', { class: 'cs-col-b' }, stripEl, inspEl)), h('div', { class: 'cs-toast', hidden: true, role: 'status' }));
  return root;
}
let edB;
function syncEdit() {
  if (!edB) return;
  root.classList.toggle('cs-edit', !!st.edit);
  edB.replaceChildren(ic(st.edit ? 'shrink' : 'expand'), h('span', null, T(st.edit ? 'minimize' : 'editMode')));
  edB.classList.toggle('on', !!st.edit); edB.setAttribute('aria-pressed', String(!!st.edit));
}
function setEdit(on) {
  st.edit = !!on; syncEdit(); fitStage(); renderStage();
  if (on) { stageEl.parentElement.scrollIntoView({ block: 'start', behavior: 'smooth' }); say(T('editHint')); }
}
function mount(container, hostOpts) {
  host = Object.assign(host, hostOpts || {});
  st = { p: loadSaved() || newProject(), sel: null, tab: 'style', view: 'top', time: '10:08', paused: false, guide: true, u: 1 };
  st.p.assets = st.p.assets || {};
  if (!st.p.layers.length) { st.p.layers = TEMPLATES[0].build(); st.p.theme.accent = TEMPLATES[0].accent; st.p.meta.name = 'Castix Imperial'; }
  st.sel = null; hist = []; hi = -1;
  container.replaceChildren(build());
  root.addEventListener('pointerdown', e => { const b = e.target.closest && e.target.closest('button'); if (b && !b.disabled) host.tg?.HapticFeedback?.selectionChanged?.(); });
  new ResizeObserver(() => { fitStage(); renderStage(); }).observe(stageEl.parentElement);
  hist = [snap()]; hi = 0; renderAll(); syncUndo(); syncEdit();
  if (!window.__csKeys) { window.__csKeys = 1; document.addEventListener('keydown', e => { if (!st || !root || !root.isConnected) return; const tag = (e.target.tagName || '').toLowerCase(); if (['input', 'textarea', 'select'].includes(tag)) return; if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); } else if (e.key === 'Delete' && cur() && cur().type !== 'clock') { st.p.layers = st.p.layers.filter(x => x.id !== st.sel); st.sel = null; renderAll(); commit(true); } }); }
}
function relocalize() { if (!st || !root || !root.isConnected) return; const sel0 = st.sel, ed0 = st.edit; mount(root.parentElement, host); st.sel = sel0; st.edit = ed0; syncEdit(); fitStage(); renderAll(); }
window.CastixStudio = { mount, relocalize, _state: () => st, _TEMPLATES: TEMPLATES };
})();
