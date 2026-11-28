/* Castix Studio - core: project model, geometric shapes, animation presets, renderer, .cas exporter. No dependencies. */
(() => {
'use strict';
const { f, esc, P, star8, diamond, sparkle } = window.CastixGeo;
const FR = window.CastixFrames;

/* ------------------------------------------------------------------ colour */
const hex2 = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mixc = (a, b, t) => { const A = hex2(a), B = hex2(b); return '#' + A.map((v, i) => Math.round(v * (1 - t) + B[i] * t).toString(16).padStart(2, '0')).join(''); };
const FIN = { polished: [.42, .52], satin: [.22, .25], flat: [0, 0] };
const PALETTE = ['#c9ad78', '#d9a08f', '#cfd3da', '#d08a52', '#5fc9a0', '#4cc2ff', '#7fa8ff', '#e0707f', '#b99aff', '#ffffff'];
const isHex = c => /^#[0-9a-f]{6}$/i.test(c || '');

/* ------------------------------------------------------------------ geometry for shapes (viewBox 200) */
const pol = (n, R, rot = -90, cx = 100, cy = 100) => Array.from({ length: n }, (_, i) => { const a = (rot + 360 * i / n) * Math.PI / 180; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
const line = pts => 'M' + pts.map(p => f(p[0]) + ' ' + f(p[1])).join('L');
const pth = d => `<path class="sh" pathLength="1" d="${d}"/>`;
const circ = (cx, cy, r) => `<circle class="sh" pathLength="1" cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"/>`;
const ell = (cx, cy, rx, ry, rot = 0) => `<ellipse class="sh" pathLength="1" cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}"${rot ? ` transform="rotate(${f(rot)} 100 100)"` : ''}/>`;
const R = (lo, hi, st, def, label) => ({ min: lo, max: hi, step: st, def, label });
// params: n (count) and k (ratio). Each shape names what they mean.
const SHAPES = {
  circle:     { sw: 2, fill: 0, g: l => circ(100, 100, 90 - l.sw / 2) },
  arc:        { sw: 4, p: { k: R(.1, .95, .01, .7, 'sweep') }, g: l => { const a1 = -90, a2 = -90 + 360 * l.k, r = 88, x1 = 100 + r * Math.cos(a1 * Math.PI / 180), y1 = 100 + r * Math.sin(a1 * Math.PI / 180), x2 = 100 + r * Math.cos(a2 * Math.PI / 180), y2 = 100 + r * Math.sin(a2 * Math.PI / 180); return pth(`M${f(x1)} ${f(y1)}A${r} ${r} 0 ${l.k > .5 ? 1 : 0} 1 ${f(x2)} ${f(y2)}`); } },
  polygon:    { sw: 2, p: { n: R(3, 12, 1, 6, 'sides') }, fill: 0, g: l => pth(P(pol(l.n, 88))) },
  star:       { sw: 2, p: { n: R(3, 16, 1, 5, 'points'), k: R(.2, .9, .01, .45, 'depth') }, fill: 0, g: l => { const pts = []; for (let i = 0; i < l.n * 2; i++) { const a = (-90 + 180 * i / l.n) * Math.PI / 180, r = i % 2 ? 88 * l.k : 88; pts.push([100 + r * Math.cos(a), 100 + r * Math.sin(a)]); } return pth(P(pts)); } },
  square:     { sw: 2, p: { k: R(0, .5, .01, .12, 'round') }, fill: 0, g: l => `<rect class="sh" pathLength="1" x="14" y="14" width="172" height="172" rx="${f(l.k * 172)}"/>` },
  chevrons:   { sw: 3, p: { n: R(2, 8, 1, 4, 'count'), k: R(.4, 1.6, .05, 1, 'angle') }, g: l => { let d = ''; const gap = 150 / (l.n); for (let i = 0; i < l.n; i++) { const y = 60 + gap * i; d += `M30 ${f(y + 30 * l.k)}L100 ${f(y)}L170 ${f(y + 30 * l.k)}`; } return pth(d); } },
  cross:      { sw: 3, p: { k: R(.3, 1, .01, 1, 'length') }, g: l => { const a = 88 * l.k; return pth(`M100 ${f(100 - a)}V${f(100 + a)}M${f(100 - a)} 100H${f(100 + a)}`) + pth(diamond(100, 100, 7, 7)); } },
  line:       { sw: 1.4, p: { k: R(.05, .6, .01, .22, 'gap') }, g: l => { const gp = 88 * l.k; return pth(`M8 100H${f(100 - gp)}M${f(100 + gp)} 100H192`) + pth(diamond(100, 100, Math.max(5, gp * .6), Math.max(5, gp * .6))); } },
  spiral:     { sw: 1.6, p: { n: R(1, 9, .5, 4, 'turns') }, g: l => { const pts = [], T = l.n * 2 * Math.PI, steps = Math.round(60 * l.n) + 30; for (let i = 0; i <= steps; i++) { const th = T * i / steps, r = 3 + 85 * th / T; pts.push([100 + r * Math.cos(th), 100 + r * Math.sin(th)]); } return pth(line(pts)); } },
  wave:       { sw: 2, p: { n: R(1, 10, .5, 3, 'waves'), k: R(.1, 1, .01, .5, 'height') }, g: l => { const pts = []; for (let i = 0; i <= 160; i++) { const x = 8 + 184 * i / 160; pts.push([x, 100 + 60 * l.k * Math.sin(2 * Math.PI * l.n * i / 160)]); } return pth(line(pts)); } },
  rose:       { sw: 1.6, p: { n: R(2, 12, 1, 5, 'petals') }, g: l => { const pts = []; for (let i = 0; i <= 720; i++) { const th = Math.PI * 2 * i / 720, r = 88 * Math.cos(l.n * th); pts.push([100 + r * Math.cos(th), 100 + r * Math.sin(th)]); } return pth(line(pts)); } },
  lissajous:  { sw: 1.4, p: { n: R(1, 8, 1, 3, 'frequency'), k: R(0, 1, .01, .5, 'phase') }, g: l => { const pts = []; for (let i = 0; i <= 600; i++) { const th = Math.PI * 2 * i / 600; pts.push([100 + 88 * Math.sin(l.n * th + l.k * Math.PI), 100 + 88 * Math.sin((l.n + 1) * th)]); } return pth(line(pts)); } },
  rosette:    { sw: .6, p: { n: R(6, 72, 1, 36, 'rings'), k: R(.15, .95, .01, .45, 'width') }, g: l => { let s = ''; for (let i = 0; i < l.n; i++) s += ell(100, 100, 88, 88 * l.k, i * 180 / l.n); return s; } },
  mandala:    { sw: 1.2, p: { n: R(4, 36, 1, 12, 'petals'), k: R(.15, .9, .01, .35, 'width') }, g: l => { let s = ''; for (let i = 0; i < l.n; i++) s += `<ellipse class="sh" pathLength="1" cx="100" cy="54" rx="${f(46 * l.k)}" ry="46" transform="rotate(${f(i * 360 / l.n)} 100 100)"/>`; return s; } },
  sunburst:   { sw: 1.4, p: { n: R(6, 72, 2, 24, 'rays'), k: R(.1, .7, .01, .3, 'inner') }, g: l => { let d = ''; for (let i = 0; i < l.n; i++) { const a = (360 * i / l.n) * Math.PI / 180, r1 = 88 * l.k, r2 = i % 2 ? 70 : 90; d += `M${f(100 + r1 * Math.cos(a))} ${f(100 + r1 * Math.sin(a))}L${f(100 + r2 * Math.cos(a))} ${f(100 + r2 * Math.sin(a))}`; } return pth(d); } },
  dotgrid:    { sw: 1.6, p: { n: R(3, 15, 1, 7, 'grid') }, g: l => { let s = ''; for (let i = 0; i < l.n; i++) for (let j = 0; j < l.n; j++) s += `<circle cx="${f(20 + 160 * i / (l.n - 1))}" cy="${f(20 + 160 * j / (l.n - 1))}" r="${f(l.sw)}" fill="var(--lc)" stroke="none"/>`; return s; } },
  concentric: { sw: 1, p: { n: R(2, 16, 1, 6, 'rings') }, g: l => { let s = ''; for (let i = 1; i <= l.n; i++) s += circ(100, 100, 88 * i / l.n); return s; } },
  khatam:     { sw: 1.2, p: { n: R(1, 6, 1, 3, 'layers'), k: R(.4, .9, .01, .7, 'shrink') }, g: l => { let d = ''; for (let i = 0; i < l.n; i++) d += star8(100, 100, 88 * Math.pow(l.k, i), i * 11.25); return pth(d); } },
  orbit:      { sw: 1.2, p: { k: R(.2, .9, .01, .45, 'flatness') }, g: () => '' },
  spiro:      { sw: 1, p: { n: R(3, 12, 1, 5, 'lobes'), k: R(.3, 1.6, .01, 1, 'reach') }, g: l => { const Rr = l.n + 1, rr = 1, d = l.k, sc = 88 / (Rr - rr + d), pts = []; for (let i = 0; i <= 1200; i++) { const t = Math.PI * 2 * i / 1200; pts.push([100 + sc * ((Rr - rr) * Math.cos(t) + d * Math.cos((Rr - rr) / rr * t)), 100 + sc * ((Rr - rr) * Math.sin(t) - d * Math.sin((Rr - rr) / rr * t))]); } return pth(line(pts)); } },
  lattice:    { sw: .9, p: { n: R(2, 6, 1, 4, 'cells') }, g: l => { let d = ''; const c = 176 / l.n; for (let i = 0; i < l.n; i++) for (let j = 0; j < l.n; j++) d += star8(12 + c * (i + .5), 12 + c * (j + .5), c * .46); return pth(d); } },
  hexgrid:    { sw: 1, p: { n: R(1, 4, 1, 2, 'rings') }, g: l => { const s = 88 / (l.n * 1.7320508 + 1), cells = []; for (let q = -l.n; q <= l.n; q++) for (let r = Math.max(-l.n, -q - l.n); r <= Math.min(l.n, -q + l.n); r++) cells.push([q, r]); let d = ''; cells.forEach(([q, r]) => { const x = 100 + s * Math.sqrt(3) * (q + r / 2), y = 100 + s * 1.5 * r; d += P(pol(6, s * .94, 30, x, y)); }); return pth(d); } }
};
SHAPES.orbit.g = l => { const ry = 88 * l.k, a = -25 * Math.PI / 180; return ell(100, 100, 88, ry, -25) + `<circle cx="${f(100 + 88 * Math.cos(a))}" cy="${f(100 + 88 * Math.sin(a))}" r="${f(l.sw * 3 + 2)}" fill="var(--lc)" stroke="none"/><circle cx="100" cy="100" r="${f(l.sw * 2 + 1.5)}" fill="var(--lc)" stroke="none"/>`; };
for (const [id, s] of Object.entries(SHAPES)) s.id = id;

/* ------------------------------------------------------------------ animation presets */
const ANIMS = {
  none: {},
  rot: { dir: 1 },
  spinpulse: { amp: [1.05, 1.7, .01, 1.2] },
  pulse: { amp: [1.02, 1.6, .01, 1.12] },
  float: { amp: [2, 50, 1, 10] },
  drift: { amp: [4, 80, 1, 18] },
  sway: { amp: [2, 45, 1, 8] },
  glide: { amp: [4, 90, 1, 14] },
  bounce: { amp: [4, 70, 1, 18] },
  breathe: { amp: [0, .9, .01, .25] },
  blink: { amp: [0, .8, .01, .1] },
  shimmer: { amp: [1.1, 3, .05, 1.8] },
  flip: {},
  orbit: { amp: [6, 170, 1, 30] },
  draw: { shapeOnly: 1 }
};
const KEYFRAMES = `@keyframes cx-rot{to{transform:rotate(360deg)}}
@keyframes cx-spinpulse{0%{transform:rotate(0) scale(1)}50%{transform:rotate(180deg) scale(var(--amp))}100%{transform:rotate(360deg) scale(1)}}
@keyframes cx-pulse{0%,100%{transform:scale(1)}50%{transform:scale(var(--amp))}}
@keyframes cx-float{0%,100%{transform:translateY(0)}50%{transform:translateY(calc(var(--amp)*var(--u)*-1))}}
@keyframes cx-drift{0%,100%{transform:translate(0,0)}50%{transform:translate(calc(var(--amp)*var(--u)),calc(var(--amp)*var(--u)*-.6))}}
@keyframes cx-sway{0%,100%{transform:rotate(calc(var(--amp)*-1deg))}50%{transform:rotate(calc(var(--amp)*1deg))}}
@keyframes cx-glide{0%,100%{transform:translateX(calc(var(--amp)*var(--u)*-1))}50%{transform:translateX(calc(var(--amp)*var(--u)))}}
@keyframes cx-bounce{0%,100%{transform:translateY(0)}40%{transform:translateY(calc(var(--amp)*var(--u)*-1))}60%{transform:translateY(calc(var(--amp)*var(--u)*-.85))}}
@keyframes cx-breathe{0%,100%{opacity:1}50%{opacity:var(--amp)}}
@keyframes cx-blink{0%,46%,100%{opacity:1}50%,96%{opacity:var(--amp)}}
@keyframes cx-shimmer{0%,100%{filter:brightness(1)}50%{filter:brightness(var(--amp))}}
@keyframes cx-flip{to{transform:perspective(calc(var(--u)*700)) rotateY(360deg)}}
@keyframes cx-orbit{from{transform:rotate(0) translateX(calc(var(--amp)*var(--u))) rotate(0)}to{transform:rotate(360deg) translateX(calc(var(--amp)*var(--u))) rotate(-360deg)}}
@keyframes cx-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes cx-tw{0%,100%{opacity:.12;transform:scale(.55)}50%{opacity:1;transform:scale(1)}}
@keyframes cx-rise{0%{opacity:0;transform:translateY(0)}15%{opacity:1}100%{opacity:0;transform:translateY(calc(var(--u)*-100))}}
@keyframes cx-fall{0%{opacity:0;transform:translateY(calc(var(--u)*-30))}15%{opacity:1}100%{opacity:0;transform:translateY(calc(var(--u)*100))}}
@keyframes cx-bk{0%,100%{opacity:.2;transform:translate(0,0) scale(.9)}50%{opacity:.85;transform:translate(calc(var(--u)*8),calc(var(--u)*-12)) scale(1.1)}}`;

/* ------------------------------------------------------------------ fonts */
const FONTS = {
  serif:  { stack: "'Noto Serif',Georgia,'Times New Roman',serif", w: 400 },
  italic: { stack: "'Noto Serif',Georgia,'Times New Roman',serif", w: 400, style: 'italic' },
  sans:   { stack: "'Roboto','Noto Sans',system-ui,sans-serif", w: 300 },
  cond:   { stack: "'Roboto Condensed','Noto Sans Condensed','Arial Narrow',sans-serif", w: 300 },
  mono:   { stack: "'Roboto Mono','Noto Sans Mono',ui-monospace,monospace", w: 300 },
  naskh:  { stack: "'Noto Naskh Arabic','Amiri',serif", w: 400 },
  kufi:   { stack: "'Noto Kufi Arabic','Cairo',sans-serif", w: 400 }
};

/* ------------------------------------------------------------------ project model */
let seq = 0;
const uid = () => 'l' + Date.now().toString(36).slice(-4) + (seq++).toString(36);
const A0 = () => ({ p: 'none', dur: 12, delay: 0, ease: 'linear', dir: 'normal', amp: 0 });
const BASE = type => ({ id: uid(), type, name: '', vis: true, lock: false, x: 195, y: 236, rot: 0, op: 1, blend: 'normal', anim: A0() });
function newLayer(type, o = {}) {
  const b = BASE(type);
  const defs = {
    clock: { size: 58, font: 'serif', weight: 0, ls: -.04, tone: 'ivory', c: 'accent', glow: .0 },
    text: { text: 'CASTIX', size: 11, font: 'sans', weight: 500, ls: .4, upper: true, tone: 'color', c: 'accent', glow: 0 },
    frame: { style: 'imperial', w: 340, h: 180, c: 'accent', finish: 'polished', kw: 1, glow: true, beads: true, jewels: true, pattern: true, ambient: true },
    shape: { shape: 'polygon', w: 220, h: 220, c: 'accent', finish: 'polished', metal: true, fill: false, fillOp: .15, sw: 2, n: 6, k: .5, glow: false },
    image: { asset: '', w: 200, h: 200, fit: 'contain', mask: 'none' },
    particles: { kind: 'stars', w: 340, h: 200, count: 30, size: 3, speed: 1, c: 'accent', seed: 7 },
    orb: { w: 260, h: 260, c: 'accent', soft: .7 }
  };
  const l = Object.assign(b, defs[type], o);
  if (type === 'shape') { const S = SHAPES[l.shape]; if (o.sw == null) l.sw = S.sw; if (o.n == null && S.p?.n) l.n = S.p.n.def; if (o.k == null && S.p?.k) l.k = S.p.k.def; if (o.fill == null) l.fill = !!S.fill && false; }
  if (!l.name) l.name = type;
  return l;
}
const newProject = () => ({
  v: 1,
  meta: { name: 'Castix Studio Theme', version: '1.0.0', author: '', category: 'Luxury', description: 'Animated AMOLED theme made with Castix Studio.' },
  theme: { accent: '#c9ad78', lock: false, bg: { type: 'solid', c1: '#000000', c2: '#0a0f1a', angle: 180 } },
  layers: [], assets: {}
});
const slugOf = p => String(p.meta.name).trim().replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'Castix_Theme';
const idOf = p => 'com.castix.studio.' + (String(p.meta.name).toLowerCase().replace(/[^a-z0-9]/g, '') || 'theme');

/* ------------------------------------------------------------------ rendering */
const prefixIds = (svg, pfx) => svg.replace(/(id="|url\(#|href="#)(\w+)/g, (m, a, b) => a + pfx + b);
function colorVars(l) {
  const finish = l.finish || 'polished', c = l.c;
  if (!isHex(c)) return { cls: 'ac ' + (finish === 'satin' ? 'sat' : finish === 'flat' ? 'flat' : 'pol'), style: '--lc:var(--accent);--mid:var(--accent);' };
  const [w, b] = FIN[finish];
  return { cls: '', style: `--lc:${c};--mid:${c};--hi:${mixc(c, '#ffffff', w)};--lo:${mixc(c, '#000000', b)};` };
}
const GRAD = (pre, W, H) => `<linearGradient id="${pre}g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="${H}"><stop offset="0" class="s-hi"/><stop offset=".28" class="s-mid"/><stop offset=".5" class="s-lo"/><stop offset=".72" class="s-mid"/><stop offset="1" class="s-hi"/></linearGradient><linearGradient id="${pre}gb" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="${H}"><stop offset="0" class="s-hi"/><stop offset=".5" class="s-mid"/><stop offset="1" class="s-hi"/></linearGradient><filter id="${pre}gl" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.4"/></filter>`;
function rng(seed) { let s = (seed >>> 0) || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

function bgColor(p) { return p.theme.bg.type === 'solid' ? p.theme.bg.c1 : p.theme.bg.c1; }
function layerInner(l, p) {
  const pre = 's' + l.id.slice(1) + '_';
  switch (l.type) {
    case 'clock': {
      const fn = FONTS[l.font] || FONTS.serif, paint = paintCss(l);
      return `<div id="clock" data-castix-clock dir="ltr" class="clk" style="font-family:${fn.stack};${fn.style ? 'font-style:' + fn.style + ';' : ''}font-size:calc(var(--u)*${f(l.size)});font-weight:${l.weight || fn.w};letter-spacing:${f(l.ls)}em;${paint}">--:--</div>`;
    }
    case 'text': {
      const fn = FONTS[l.font] || FONTS.sans;
      return `<div class="txt" dir="auto" style="font-family:${fn.stack};${fn.style ? 'font-style:' + fn.style + ';' : ''}font-size:calc(var(--u)*${f(l.size)});font-weight:${l.weight || fn.w};letter-spacing:${f(l.ls)}em;${l.upper ? 'text-transform:uppercase;' : ''}${paintCss(l)}">${esc(l.text)}</div>`;
    }
    case 'frame': {
      const W = 360, H = 190; let g = FR.GEN[l.style]({ k: l.kw, glow: l.glow, beads: l.beads, jewels: l.jewels, pattern: l.pattern, ambient: l.ambient });
      const bg = bgColor(p); g = g.split('fill="#000"').join(`fill="${bg}"`).split('stop-color="#000"').join(`stop-color="${bg}"`);
      return prefixIds(`<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs>${GRAD('', W, H)}</defs>${g}</svg>`, pre);
    }
    case 'shape': {
      const S = SHAPES[l.shape]; const stroke = l.metal ? `url(#${pre}g)` : 'var(--lc)', fill = l.fill ? (l.metal ? `url(#${pre}gb)` : 'var(--lc)') : 'none';
      const inner = S.g(l), glow = l.glow ? `<g filter="url(#${pre}gl)" opacity=".55">${inner}</g>` : '';
      return `<svg viewBox="0 0 200 200" aria-hidden="true"><defs>${GRAD(pre, 200, 200).split(`id="${pre}gl"`).join(`id="${pre}gl"`)}</defs><g fill="${fill}" fill-opacity="${f(l.fillOp)}" stroke-width="${f(l.sw)}" stroke-linecap="round" stroke-linejoin="round" style="stroke:${stroke}">${glow}${inner}</g></svg>`;
    }
    case 'image': {
      const a = p.assets[l.asset]; if (!a) return '';
      const m = { none: '', circle: 'border-radius:50%;', rounded: 'border-radius:14%;', hex: 'clip-path:polygon(50% 0,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%);' }[l.mask] || '';
      return `<img alt="" draggable="false" src="${a.data}" style="width:100%;height:100%;object-fit:${l.fit};display:block;${m}"/>`;
    }
    case 'particles': {
      const rnd = rng(l.seed * 9301 + 49297), out = [];
      const dur = k => f(k / Math.max(.2, l.speed));
      for (let i = 0; i < l.count; i++) {
        const x = rnd() * 100, y = rnd() * 100, s = l.size * (.4 + rnd() * 1.1), d = rnd() * 8, t = 3 + rnd() * 6;
        const an = { stars: `cx-tw ${dur(t)}s ease-in-out ${f(d)}s infinite`, rise: `cx-rise ${dur(t + 3)}s linear ${f(d)}s infinite`, fall: `cx-fall ${dur(t + 3)}s linear ${f(d)}s infinite`, bokeh: `cx-bk ${dur(t + 4)}s ease-in-out ${f(d)}s infinite` }[l.kind];
        const sz = l.kind === 'bokeh' ? s * 3.2 : s;
        out.push(`<i style="left:${f(x)}%;top:${f(y)}%;width:calc(var(--u)*${f(sz)});height:calc(var(--u)*${f(sz)});animation:${an}${l.kind === 'bokeh' ? ';opacity:.4' : ''}"></i>`);
      }
      return `<div class="pt ${l.kind}">${out.join('')}</div>`;
    }
    case 'orb': return `<div class="orb" style="background:radial-gradient(closest-side,var(--lc) 0%,transparent ${f(l.soft * 100)}%)"></div>`;
  }
  return '';
}
function paintCss(l) {
  const c = isHex(l.c) ? l.c : null, base = c || 'var(--accent)';
  const glow = l.glow > 0 ? `filter:drop-shadow(0 0 calc(var(--u)*${f(l.glow * 10)}) ${c ? c + '66' : 'color-mix(in srgb,var(--accent) 40%,transparent)'});` : '';
  switch (l.tone) {
    case 'white': return `color:#fff;${glow}`;
    case 'ivory': return `color:#efe7d6;background:linear-gradient(180deg,#fffaf0 0%,#f1e8d5 46%,#d9c8a2 100%);${c ? '' : 'background:linear-gradient(180deg,#fffaf0 0%,#f1e8d5 46%,color-mix(in srgb,var(--accent) 48%,#fff) 100%);'}-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;${glow || 'filter:drop-shadow(0 0 7px rgba(255,236,190,.13));'}`;
    case 'metal': return `color:${base};background:linear-gradient(180deg,var(--hi) 0%,var(--mid) 50%,var(--lo) 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;${glow}`;
    default: return `color:${base};${glow}`;
  }
}
function animCss(l) {
  const a = l.anim; if (!a || a.p === 'none') return '';
  const m = ANIMS[a.p] || {};
  if (a.p === 'draw') return '';
  const amp = m.amp ? (a.amp || m.amp[3]) : null;
  return `animation:cx-${a.p} ${f(a.dur)}s ${a.ease} ${f(a.delay)}s infinite ${a.dir};${amp != null ? `--amp:${amp};` : ''}`;
}
function renderLayer(l, p) {
  if (!l.vis) return '';
  const auto = l.type === 'clock' || l.type === 'text';
  const cv = colorVars(l), cls = ['L', auto ? 'auto' : '', cv.cls, l.anim.p === 'draw' && l.type === 'shape' ? 'dr' : ''].filter(Boolean).join(' ');
  const s = [`left:calc(var(--u)*${f(l.x)})`, `top:calc(var(--u)*${f(l.y)})`];
  if (!auto) s.push(`width:calc(var(--u)*${f(l.w)})`, `height:calc(var(--u)*${f(l.h)})`);
  s.push(`transform:translate(-50%,-50%)${l.rot ? ` rotate(${f(l.rot)}deg)` : ''}`);
  if (l.op < 1) s.push(`opacity:${f(l.op)}`);
  if (l.blend && l.blend !== 'normal') s.push(`mix-blend-mode:${l.blend}`);
  if (l.anim.p === 'draw' && l.type === 'shape') s.push(`--dd:${f(l.anim.dur)}s;--de:${l.anim.ease};--dl:${f(l.anim.delay)}s;--di:${l.anim.dir}`);
  const inner = layerInner(l, p);
  if (l.type === 'image' && !inner) return '';
  return `<div class="${cls}" data-lid="${l.id}" style="${s.join(';')};${cv.style}"><div class="A" style="${animCss(l)}">${inner}</div></div>`;
}
function bgCss(p) {
  const b = p.theme.bg;
  if (b.type === 'linear') return `linear-gradient(${b.angle}deg,${b.c1},${b.c2})`;
  if (b.type === 'radial') return `radial-gradient(circle at 50% 35%,${b.c2},${b.c1} 75%)`;
  return b.c1;
}
function buildCss(p, { preview = false } = {}) {
  const acc = p.theme.accent;
  const bgv = bgCss(p);
  return `*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;background:${p.theme.bg.c1};overflow:hidden;color:#ddd;font-family:system-ui,sans-serif}
:root{--accent:${acc}}
.cx{position:absolute;inset:0;overflow:hidden;background:${bgv};--u:calc(100vw/390)}
.L{position:absolute;pointer-events:none}
.A{width:100%;height:100%;will-change:transform}
.L.auto{white-space:nowrap}.L.auto .A{width:auto;height:auto}
.L svg{display:block;width:100%;height:100%;overflow:visible}
.ac{--hi:var(--accent);--lo:var(--accent)}
@supports (color:color-mix(in srgb,red,blue)){.ac.pol{--hi:color-mix(in srgb,var(--accent) 58%,#fff);--lo:color-mix(in srgb,var(--accent) 48%,#000)}.ac.sat{--hi:color-mix(in srgb,var(--accent) 78%,#fff);--lo:color-mix(in srgb,var(--accent) 75%,#000)}}
.s-hi{stop-color:var(--hi)}.s-mid{stop-color:var(--mid)}.s-lo{stop-color:var(--lo)}
.period{font-family:system-ui,sans-serif;font-size:.25em;letter-spacing:.08em;margin-inline-start:.4em;-webkit-text-fill-color:var(--accent);color:var(--accent);filter:none}
.clk,.txt{line-height:1.05;font-variant-numeric:tabular-nums;text-align:center}
.pt{position:relative;width:100%;height:100%}.pt i{position:absolute;border-radius:50%;background:var(--lc);transform:translate(-50%,-50%)}.pt.bokeh i{background:radial-gradient(closest-side,var(--lc),transparent)}
.orb{width:100%;height:100%;border-radius:50%}
.dr .sh{stroke-dasharray:1;stroke-dashoffset:1;animation:cx-draw var(--dd) var(--de) var(--dl) infinite var(--di)}
${KEYFRAMES}
${preview ? '.L{pointer-events:auto}.paused *{animation-play-state:paused!important}' : ''}
`;
}
function buildBody(p) { return `<div class="cx">${p.layers.map(l => renderLayer(l, p)).join('')}</div>`; }

/* ------------------------------------------------------------------ files */
const SCRIPT_ORIG = String.raw`(()=>{'use strict';const clock=document.getElementById('clock');let lastTime=null,lastAccent=null;function render(d){if(!d)return;const t=String(d.time||'--:--').trim();if(clock&&t!==lastTime){const m=t.match(/^(\S+)(?:\s+(.+))?$/u);clock.replaceChildren(document.createTextNode(m?m[1]:t));if(m&&m[2]){const p=document.createElement('span');p.className='period';p.textContent=m[2];clock.append(p);}lastTime=t;}const a=/^#[0-9a-f]{6}$/i.test(d.accentColor||'')?d.accentColor:'#c9ad78';if(a!==lastAccent){document.documentElement.style.setProperty('--accent',a);lastAccent=a;}document.documentElement.lang=d.language||'en';}window.addEventListener('castix:data',e=>render(e.detail));render(window.CastixData);})();`;
const ACC_SET = "if(a!==lastAccent){document.documentElement.style.setProperty('--accent',a);lastAccent=a;}";
function buildFiles(p) {
  const css = buildCss(p), body = buildBody(p);
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.meta.name)}</title><link rel="stylesheet" href="style.css"></head><body>${body}<script src="script.js"></script></body></html>`;
  const meta = { id: idOf(p), name: p.meta.name, version: p.meta.version, author: p.meta.author, type: 'amoled-theme', apiVersion: 1, entry: 'index.html', description: p.meta.description };
  return { html, css, js: p.theme.lock ? SCRIPT_ORIG.replace(ACC_SET, '') : SCRIPT_ORIG, json: JSON.stringify(meta) };
}

/* ------------------------------------------------------------------ zip (deflate when available) */
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
async function deflate(u8) {
  if (typeof CompressionStream !== 'function') return null;
  try { const cs = new Blob([u8]).stream().pipeThrough(new CompressionStream('deflate-raw')); return new Uint8Array(await new Response(cs).arrayBuffer()); } catch (e) { return null; }
}
async function zip(files) {
  const enc = new TextEncoder(), parts = [], central = []; let off = 0;
  for (const fl of files) {
    const name = enc.encode(fl.name), data = typeof fl.data === 'string' ? enc.encode(fl.data) : fl.data, crc = crc32(data);
    let comp = await deflate(data), method = 8; if (!comp || comp.length >= data.length) { comp = data; method = 0; }
    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, method, true); lh.setUint16(12, 0x21, true);
    lh.setUint32(14, crc, true); lh.setUint32(18, comp.length, true); lh.setUint32(22, data.length, true); lh.setUint16(26, name.length, true);
    parts.push(new Uint8Array(lh.buffer), name, comp);
    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(10, method, true); ch.setUint16(14, 0x21, true);
    ch.setUint32(16, crc, true); ch.setUint32(20, comp.length, true); ch.setUint32(24, data.length, true); ch.setUint16(28, name.length, true); ch.setUint32(42, off, true);
    central.push(new Uint8Array(ch.buffer), name);
    off += 30 + name.length + comp.length;
  }
  const cd = central.reduce((n, a) => n + a.length, 0), end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, cd, true); end.setUint32(16, off, true);
  return new Blob([...parts, ...central, new Uint8Array(end.buffer)], { type: 'application/octet-stream' });
}
async function buildCas(p) { const F = buildFiles(p); return zip([{ name: 'plugins.json', data: F.json }, { name: 'index.html', data: F.html }, { name: 'script.js', data: F.js }, { name: 'style.css', data: F.css }]); }

window.CastixStudioCore = { f, esc, mixc, FIN, PALETTE, isHex, SHAPES, ANIMS, FONTS, newLayer, newProject, slugOf, idOf, renderLayer, layerInner, buildCss, buildBody, buildFiles, buildCas, zip, bgCss, uid, rng };
})();
