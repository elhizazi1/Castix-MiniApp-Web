/* Castix Studio - luxury ornament frames (geometry helpers + six frame generators). Vanilla, no dependencies. */
(() => {
'use strict';
const f = n => { let s = (+n).toFixed(2); if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, ''); return (s === '-0' || s === '') ? '0' : s; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const P = (p, close = true) => 'M' + p.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + (close ? 'Z' : '');
const chamfer = (x0, y0, x1, y1, c) => [[x0+c,y0],[x1-c,y0],[x1,y0+c],[x1,y1-c],[x1-c,y1],[x0+c,y1],[x0,y1-c],[x0,y0+c]];
function offsetPoly(poly, d) {
  const n = poly.length; let cx = 0, cy = 0;
  poly.forEach(p => { cx += p[0]; cy += p[1]; }); cx /= n; cy /= n;
  const lines = [];
  for (let i = 0; i < n; i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % n];
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    let nx = -dy / L, ny = dx / L; const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    if (nx * (cx - mx) + ny * (cy - my) < 0) { nx = -nx; ny = -ny; }
    lines.push([[x1 + nx * d, y1 + ny * d], [dx / L, dy / L]]);
  }
  const out = [];
  for (let i = 0; i < n; i++) {
    const [p1, d1] = lines[(i - 1 + n) % n], [p2, d2] = lines[i];
    const det = d1[0] * (-d2[1]) - d1[1] * (-d2[0]);
    const tt = ((p2[0] - p1[0]) * (-d2[1]) - (p2[1] - p1[1]) * (-d2[0])) / det;
    out.push([p1[0] + d1[0] * tt, p1[1] + d1[1] * tt]);
  }
  return out;
}
function star8(cx, cy, R, rot = 0) {
  let d = '';
  for (const k of [0, 45]) {
    const pts = [];
    for (let j = 0; j < 4; j++) { const a = (rot + k + 90 * j + 45) * Math.PI / 180; pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); }
    d += P(pts);
  }
  return d;
}
const diamond = (cx, cy, rx, ry) => P([[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]]);
const sparkle = (cx, cy, h, w) => `M${f(cx)} ${f(cy-h)}Q${f(cx+w*.12)} ${f(cy-w*.12)} ${f(cx+w)} ${f(cy)}Q${f(cx+w*.12)} ${f(cy+w*.12)} ${f(cx)} ${f(cy+h)}Q${f(cx-w*.12)} ${f(cy+w*.12)} ${f(cx-w)} ${f(cy)}Q${f(cx-w*.12)} ${f(cy-w*.12)} ${f(cx)} ${f(cy-h)}Z`;
const rrectPath = (x0, y0, x1, y1, r) => `M${f(x0+r)} ${f(y0)}H${f(x1-r)}A${f(r)} ${f(r)} 0 0 1 ${f(x1)} ${f(y0+r)}V${f(y1-r)}A${f(r)} ${f(r)} 0 0 1 ${f(x1-r)} ${f(y1)}H${f(x0+r)}A${f(r)} ${f(r)} 0 0 1 ${f(x0)} ${f(y1-r)}V${f(y0+r)}A${f(r)} ${f(r)} 0 0 1 ${f(x0+r)} ${f(y0)}Z`;
function rrectSamples(x0, y0, x1, y1, r, N) {
  const dense = [], cxm = (x0 + x1) / 2, st = .25;
  const line = (ax, ay, bx, by, nx, ny) => { const L = Math.hypot(bx - ax, by - ay), k = Math.max(1, Math.floor(L / st)); for (let i = 0; i < k; i++) { const u = i / k; dense.push([ax + (bx - ax) * u, ay + (by - ay) * u, nx, ny]); } };
  const arc = (cx, cy, a0, a1) => { const L = r * Math.abs(a1 - a0), k = Math.max(1, Math.floor(L / st)); for (let i = 0; i < k; i++) { const a = a0 + (a1 - a0) * i / k; dense.push([cx + r * Math.cos(a), cy + r * Math.sin(a), Math.cos(a), Math.sin(a)]); } };
  line(cxm, y0, x1 - r, y0, 0, -1); arc(x1 - r, y0 + r, -Math.PI / 2, 0);
  line(x1, y0 + r, x1, y1 - r, 1, 0); arc(x1 - r, y1 - r, 0, Math.PI / 2);
  line(x1 - r, y1, x0 + r, y1, 0, 1); arc(x0 + r, y1 - r, Math.PI / 2, Math.PI);
  line(x0, y1 - r, x0, y0 + r, -1, 0); arc(x0 + r, y0 + r, Math.PI, 1.5 * Math.PI);
  line(x0 + r, y0, cxm, y0, 0, -1);
  const tot = dense.length, out = [];
  for (let i = 0; i < N; i++) out.push(dense[Math.floor(i * tot / N)]);
  return out;
}
const CX = 180, CY = 95;
const AMB = (id, r) => `<defs><radialGradient id="${id}" cx="50%" cy="50%" r="${r}%"><stop offset="0" stop-color="var(--lc)" stop-opacity=".10"/><stop offset="1" stop-color="var(--lc)" stop-opacity="0"/></radialGradient></defs>`;
const VIG = (a, b, c) => `<defs><radialGradient id="vg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#000" stop-opacity="${a}"/><stop offset=".5" stop-color="#000" stop-opacity="${b}"/><stop offset="1" stop-color="#000" stop-opacity="${c}"/></radialGradient></defs>`;
const GLOW = o => o.glow ? `<use href="#fr" filter="url(#gl)" opacity=".42"/>` : '';

/* ---------------------------------------------------------------- style generators */
const GEN = {};
GEN.imperial = o => {
  const sw = x => f(x * o.k), O = chamfer(5, 6, 355, 184, 44); let s = '';
  if (o.ambient) s += AMB('amb', 60) + `<path d="${P(offsetPoly(O, 20))}" fill="url(#amb)"/>`;
  let fr = '';
  [[0, 1.9, 1], [13, .8, 1], [20, .5, .65]].forEach(([d, w, op]) => fr += `<path d="${P(offsetPoly(O, d))}" stroke="url(#g)" stroke-width="${sw(w)}" opacity="${op}" fill="none" stroke-linejoin="miter"/>`);
  if (o.beads) fr += `<path d="${P(offsetPoly(O, 6.5))}" stroke="url(#g)" stroke-width="${sw(1.7)}" stroke-dasharray="0.01 4.2" stroke-linecap="round" fill="none" opacity=".9"/>`;
  s += `<g id="fr" fill="none">${fr}</g>` + GLOW(o);
  if (o.jewels) {
    const f2 = offsetPoly(O, 13);
    [[f2[7], f2[0]], [f2[1], f2[2]], [f2[3], f2[4]], [f2[5], f2[6]]].forEach(([a, b]) => {
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      s += `<circle cx="${f(mx)}" cy="${f(my)}" r="7" fill="#000"/><path d="${diamond(mx, my, 4.4, 4.4)}" fill="url(#gb)"/><path d="${diamond(mx, my, 6.6, 6.6)}" fill="none" stroke="url(#g)" stroke-width=".6"/><path d="M${f(mx-2)} ${f(my)}L${f(mx)} ${f(my-2)}" stroke="#fff" stroke-opacity=".55" stroke-width=".6"/>`;
    });
  }
  const crest = sg => {
    const y0 = sg > 0 ? 6 : 184, up = sg > 0 ? 0 : 1, dn = sg > 0 ? 1 : 0;
    let g = `<path d="M${CX-40} ${y0}A40 40 0 0 ${dn} ${CX+40} ${y0}Z" fill="#000"/>`;
    g += `<path d="M${CX-40} ${y0}A40 40 0 0 ${up} ${CX+40} ${y0}" stroke="url(#g)" stroke-width="${sw(1.5)}" fill="none"/>`;
    g += `<path d="M${CX-32} ${y0}A32 32 0 0 ${up} ${CX+32} ${y0}" stroke="url(#g)" stroke-width="${sw(.5)}" opacity=".6" fill="none"/>`;
    g += `<path d="M${CX-12} ${y0}A12 12 0 0 ${up} ${CX+12} ${y0}" stroke="url(#g)" stroke-width="${sw(.8)}" fill="none"/>`;
    let rays = ''; const n = 15;
    for (let k = 0; k < n; k++) { const a = (12 + k * (156 / (n - 1))) * Math.PI / 180, r1 = 12, r2 = k % 2 === 0 ? 30 : 22;
      rays += `M${f(CX + r1 * Math.cos(a))} ${f(y0 + sg * r1 * Math.sin(a))}L${f(CX + r2 * Math.cos(a))} ${f(y0 + sg * r2 * Math.sin(a))}`;
      if (o.beads && k % 2 === 0) g += `<circle cx="${f(CX + 34.5 * Math.cos(a))}" cy="${f(y0 + sg * 34.5 * Math.sin(a))}" r="1" fill="url(#gb)"/>`; }
    g += `<path d="${rays}" stroke="url(#g)" stroke-width="${sw(1)}" fill="none" stroke-linecap="round"/><path d="${diamond(CX, y0 + sg * 5.2, 2.6, 3.2)}" fill="url(#gb)"/>`;
    return g;
  };
  s += crest(1) + crest(-1);
  const fin = (x, side) => {
    const sx = side === 'L' ? 1 : -1; let g = `<ellipse cx="${x}" cy="${CY}" rx="24" ry="25" fill="#000"/>`;
    g += `<path d="${diamond(x + sx * 3, CY, 15, 21)}" fill="none" stroke="url(#g)" stroke-width="${sw(1.1)}"/><path d="${diamond(x + sx * 3, CY, 9.5, 14)}" fill="none" stroke="url(#g)" stroke-width="${sw(.6)}" opacity=".8"/><path d="${diamond(x + sx * 3, CY, 4, 6)}" fill="url(#gb)"/>`;
    const x1 = x + sx * 21, x2 = x + sx * 52;
    g += `<path d="M${f(x1)} ${CY}H${f(x2)}" stroke="url(#g)" stroke-width="${sw(.7)}"/><path d="M${f(x1)} ${CY-3}H${f(x+sx*40)}M${f(x1)} ${CY+3}H${f(x+sx*40)}" stroke="url(#g)" stroke-width="${sw(.4)}" opacity=".6"/><circle cx="${f(x2+sx*3)}" cy="${CY}" r="1.1" fill="url(#gb)"/>`;
    return g;
  };
  return s + fin(15, 'L') + fin(345, 'R');
};

GEN.guilloche = o => {
  const sw = x => f(x * o.k), x0 = 4, y0 = 5, x1 = 356, y1 = 185, r = 50;
  const rr = d => rrectPath(x0 + d, y0 + d, x1 - d, y1 - d, Math.max(4, r - d));
  let s = `<path d="${rr(19)}" fill="#050505"/><clipPath id="dial"><path d="${rr(19.5)}"/></clipPath>`;
  let inner = '';
  if (o.pattern) {
    let gu = '';
    for (let i = 0; i < 60; i++) gu += `<ellipse cx="${CX}" cy="${CY}" rx="176" ry="70" transform="rotate(${f(i * 3)} ${CX} ${CY})"/>`;
    for (let i = 0; i < 36; i++) gu += `<ellipse cx="${CX}" cy="${CY}" rx="56" ry="20" transform="rotate(${f(i * 10)} ${CX} ${CY}) translate(60 0)"/>`;
    inner += `<g fill="none" stroke="url(#g)" stroke-width="${sw(.34)}" opacity=".55">${gu}</g>` + VIG('.95', '.78', '0').replace('offset=".5" stop-color="#000" stop-opacity=".78"', 'offset=".45" stop-color="#000" stop-opacity=".78"') + `<ellipse cx="${CX}" cy="${CY}" rx="150" ry="64" fill="url(#vg)"/>`;
  }
  inner += `<circle cx="${CX}" cy="${CY}" r="70" fill="none" stroke="url(#g)" stroke-width="${sw(.9)}"/><circle cx="${CX}" cy="${CY}" r="67.4" fill="none" stroke="url(#g)" stroke-width="${sw(.3)}" opacity=".6"/>`;
  s += `<g clip-path="url(#dial)">${inner}<path d="${rr(19.5)}" fill="none" stroke="#000" stroke-width="5" opacity=".55"/></g>`;
  let cs = `<path d="${rr(0)}" stroke="url(#g)" stroke-width="${sw(2.6)}" fill="none"/><path d="${rr(3.4)}" stroke="#fff" stroke-opacity=".28" stroke-width=".5" fill="none"/><path d="${rr(16)}" stroke="url(#g)" stroke-width="${sw(1.3)}" fill="none"/><path d="${rr(18.2)}" stroke="url(#g)" stroke-width="${sw(.4)}" opacity=".7" fill="none"/><path d="${rr(25.5)}" stroke="url(#g)" stroke-width="${sw(.3)}" opacity=".45" fill="none"/>`;
  if (o.beads) {
    let tk = ''; rrectSamples(x0 + 7, y0 + 7, x1 - 7, y1 - 7, r - 7, 120).forEach(([px, py, nx, ny], i) => { const ln = i % 10 === 0 ? 6.2 : 3.3; tk += `M${f(px)} ${f(py)}L${f(px - nx * ln)} ${f(py - ny * ln)}`; });
    cs += `<path d="${tk}" stroke="url(#g)" stroke-width="${sw(.7)}" stroke-linecap="round" fill="none"/>`;
  }
  s += `<g id="fr">${cs}</g>` + GLOW(o);
  if (o.jewels) {
    [y0 + 8, y1 - 8].forEach(y => {
      s += `<circle cx="${CX}" cy="${y}" r="9" fill="#000"/><path d="${diamond(CX, y, 5.6, 7.6)}" fill="url(#gb)"/><path d="M${CX} ${y-7.6}V${y+7.6}M${CX-5.6} ${y}H${CX+5.6}" stroke="#000" stroke-opacity=".45" stroke-width=".5"/><path d="M${CX-2.6} ${y-2.4}L${CX} ${y-5.8}L${CX+2.6} ${y-2.4}" stroke="#fff" stroke-opacity=".6" stroke-width=".6" fill="none"/><path d="${diamond(CX, y, 8.6, 10.4)}" fill="none" stroke="url(#g)" stroke-width=".6"/>`;
    });
    [x0 + 7.5, x1 - 7.5].forEach(x => { s += `<circle cx="${f(x)}" cy="${CY}" r="6.5" fill="#000"/><circle cx="${f(x)}" cy="${CY}" r="3.1" fill="url(#gb)"/><circle cx="${f(x)}" cy="${CY}" r="5.2" fill="none" stroke="url(#g)" stroke-width=".5"/>`; });
  }
  return s;
};

GEN.zellige = o => {
  const sw = x => f(x * o.k), base = [[3,95],[47,7],[313,7],[357,95],[313,183],[47,183]], inner = offsetPoly(base, 26);
  let s = `<clipPath id="in"><path d="${P(inner)}"/></clipPath><path d="${P(inner)}" fill="#040404"/>`;
  let ig = '';
  if (o.pattern) {
    let tess = ''; const sp = 21;
    for (let i = -9; i < 10; i++) for (let j = -5; j < 6; j++) { const x = CX + i * sp, y = CY + j * sp; tess += star8(x, y, 7.6) + diamond(x + sp / 2, y + sp / 2, 2.4, 2.4); }
    ig += `<path d="${tess}" fill="none" stroke="url(#g)" stroke-width="${sw(.35)}" opacity=".34"/>` + VIG('.96', '.85', '0').replace('offset=".5"', 'offset=".6"') + `<ellipse cx="${CX}" cy="${CY}" rx="140" ry="52" fill="url(#vg)"/>`;
  }
  s += `<g clip-path="url(#in)">${ig}</g>`;
  let fr = `<path d="${P(base)}" stroke="url(#g)" stroke-width="${sw(2.1)}" fill="none"/><path d="${P(offsetPoly(base, 4.2))}" stroke="url(#g)" stroke-width="${sw(.5)}" opacity=".65" fill="none"/><path d="${P(offsetPoly(base, 19))}" stroke="url(#g)" stroke-width="${sw(1)}" fill="none"/><path d="${P(offsetPoly(base, 26))}" stroke="url(#g)" stroke-width="${sw(.5)}" opacity=".6" fill="none"/>`;
  s += `<g id="fr">${fr}</g>` + GLOW(o);
  if (o.beads) {
    const ring = offsetPoly(base, 11.6); let stars = '', dots = '';
    for (let i = 0; i < 6; i++) { const a = ring[i], b = ring[(i + 1) % 6], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 17.5));
      for (let k = 0; k < n; k++) { const u = k / n, x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u; stars += star8(x, y, 5.1); dots += `M${f(x)} ${f(y)}h.01`; } }
    s += `<path d="${stars}" fill="none" stroke="url(#g)" stroke-width="${sw(.75)}" stroke-linejoin="miter"/><path d="${dots}" stroke="url(#g)" stroke-width="1.5" stroke-linecap="round"/>`;
  }
  if (o.jewels) {
    [29, 331].forEach(x => { s += `<circle cx="${x}" cy="${CY}" r="19" fill="#000"/><path d="${star8(x, CY, 15)}" fill="none" stroke="url(#g)" stroke-width="${sw(1.1)}" stroke-linejoin="miter"/><path d="${star8(x, CY, 9.2)}" fill="none" stroke="url(#g)" stroke-width="${sw(.7)}"/><path d="${star8(x, CY, 4.6)}" fill="url(#gb)"/><circle cx="${x}" cy="${CY}" r="17.2" fill="none" stroke="url(#g)" stroke-width=".4" opacity=".7"/>`; });
    [[7, 1], [183, -1]].forEach(([y, sg]) => { s += `<ellipse cx="${CX}" cy="${y}" rx="26" ry="13" fill="#000"/><path d="${star8(CX, y + sg, 11.5)}" fill="#000" stroke="url(#g)" stroke-width="1"/><path d="${star8(CX, y + sg, 6.2)}" fill="url(#gb)"/><path d="M${CX-28} ${y}H${CX-14}M${CX+14} ${y}H${CX+28}" stroke="url(#g)" stroke-width="1.6"/>`; });
  }
  return s;
};

GEN.laurier = o => {
  const sw = x => f(x * o.k); let s = `<defs><g id="lf"><path d="M0 0C9 -6.6 22 -6.6 30 0C22 6.6 9 6.6 0 0Z" fill="url(#gb)"/><path d="M1.5 0H25" stroke="#000" stroke-opacity=".5" stroke-width=".7"/></g></defs>`;
  if (o.ambient) s += AMB('amb', 55) + `<ellipse cx="${CX}" cy="${CY}" rx="134" ry="55" fill="url(#amb)"/>`;
  let el = `<ellipse cx="${CX}" cy="${CY}" rx="141" ry="62" stroke="url(#g)" stroke-width="${sw(2.4)}" fill="none"/><ellipse cx="${CX}" cy="${CY}" rx="135" ry="56" stroke="url(#g)" stroke-width="${sw(.5)}" opacity=".65" fill="none"/>`;
  if (o.beads) el += `<ellipse cx="${CX}" cy="${CY}" rx="138" ry="59" stroke="url(#g)" stroke-width="${sw(1.5)}" stroke-dasharray="0.01 4.1" stroke-linecap="round" fill="none" opacity=".85"/>`;
  el += `<ellipse cx="${CX}" cy="${CY}" rx="127" ry="46" stroke="url(#g)" stroke-width="${sw(.35)}" opacity=".4" fill="none"/>`;
  s += `<g id="fr">${el}</g>` + GLOW(o);
  const rx = 160, ry = 78, t0 = 98, t1 = 262, N = 15; let leaves = '';
  for (let i = 0; i <= N; i++) { const u = i / N, tt = (t0 + (t1 - t0) * u) * Math.PI / 180, x = CX + rx * Math.cos(tt), y = CY + ry * Math.sin(tt), ang = Math.atan2(ry * Math.cos(tt), -rx * Math.sin(tt)) * 180 / Math.PI, sc = .56 - .26 * u;
    for (const sg of [-1, 1]) { if (i === N && sg === 1) continue; leaves += `<use href="#lf" transform="translate(${f(x)} ${f(y)}) rotate(${f(ang + sg * (40 - 8 * u))}) scale(${f(sc)})"/>`; }
    if (i === N) leaves += `<use href="#lf" transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)}) scale(${f(sc * 1.15)})"/>`; }
  const pts = []; for (let i = 0; i <= 60; i++) { const tt = (t0 + (t1 - t0) * i / 60) * Math.PI / 180; pts.push([CX + rx * Math.cos(tt), CY + ry * Math.sin(tt)]); }
  let berries = '';
  if (o.jewels) [[6, 6], [12, -6], [18, 7]].forEach(([dt, off]) => { const tt = (t0 + dt) * Math.PI / 180; berries += `<circle cx="${f(CX + (rx + off) * Math.cos(tt))}" cy="${f(CY + (ry + off * .5) * Math.sin(tt))}" r="2" fill="url(#gb)"/>`; });
  s += `<g id="br"><path d="${P(pts, false)}" stroke="url(#gb)" stroke-width="${sw(1.1)}" fill="none" stroke-linecap="round"/>${leaves}${berries}</g><use href="#br" transform="matrix(-1 0 0 1 360 0)"/>`;
  s += `<circle cx="${CX}" cy="${CY+ry+1}" r="9" fill="#000"/><path d="${diamond(CX, CY + ry + 1, 4.4, 5.8)}" fill="url(#gb)"/><path d="M${CX-7} ${CY+ry+1}Q${CX-18} ${CY+ry+9} ${CX-26} ${CY+ry+3}M${CX+7} ${CY+ry+1}Q${CX+18} ${CY+ry+9} ${CX+26} ${CY+ry+3}" stroke="url(#g)" stroke-width=".9" fill="none" stroke-linecap="round"/>`;
  if (o.jewels) s += `<path d="${sparkle(CX, 14, 11, 8)}" fill="url(#gb)"/><path d="${sparkle(CX-17, 18, 4.2, 3)}" fill="url(#gb)" opacity=".8"/><path d="${sparkle(CX+17, 18, 4.2, 3)}" fill="url(#gb)" opacity=".8"/><path d="M${CX-30} 14H${CX-23}M${CX+23} 14H${CX+30}" stroke="url(#g)" stroke-width=".6" opacity=".8"/>`;
  return s;
};

GEN.celestial = o => {
  const sw = x => f(x * o.k); let s = '';
  if (o.ambient) s += AMB('amb', 58) + `<ellipse cx="${CX}" cy="${CY}" rx="140" ry="58" fill="url(#amb)"/>`;
  let fr = `<ellipse cx="${CX}" cy="${CY}" rx="146" ry="64" stroke="url(#g)" stroke-width="${sw(1.8)}" fill="none"/><ellipse cx="${CX}" cy="${CY}" rx="138" ry="56" stroke="url(#g)" stroke-width="${sw(.6)}" stroke-dasharray="1.5 3" opacity=".75" fill="none"/><ellipse cx="${CX}" cy="${CY}" rx="127" ry="45" stroke="url(#g)" stroke-width="${sw(.35)}" opacity=".45" fill="none"/>`;
  if (o.beads) { let tk = ''; for (let i = 0; i < 120; i++) { const a = i * 3 * Math.PI / 180, x = CX + 146 * Math.cos(a), y = CY + 64 * Math.sin(a); let nx = Math.cos(a) / 146, ny = Math.sin(a) / 64; const L = Math.hypot(nx, ny); nx /= L; ny /= L; const ln = i % 5 === 0 ? 7 : 3.6; tk += `M${f(x)} ${f(y)}L${f(x + nx * ln)} ${f(y + ny * ln)}`; }
    fr += `<path d="${tk}" stroke="url(#g)" stroke-width="${sw(.7)}" stroke-linecap="round" fill="none"/>`; }
  if (o.pattern) { let st = ''; for (let i = 0; i < 24; i++) { const a = i * 15 * Math.PI / 180; st += `M${f(CX + 20 * Math.cos(a))} ${f(CY + 9 * Math.sin(a))}L${f(CX + 125 * Math.cos(a))} ${f(CY + 44 * Math.sin(a))}`; }
    s += `<g opacity=".22"><path d="${st}" stroke="url(#g)" stroke-width="${sw(.3)}"/></g>` + VIG('.96', '.8', '0') + `<ellipse cx="${CX}" cy="${CY}" rx="100" ry="40" fill="url(#vg)"/>`; }
  s += `<g id="fr">${fr}</g>` + GLOW(o);
  // crescent moon
  s += `<circle cx="${CX}" cy="13" r="12" fill="#000"/><circle cx="${CX}" cy="13" r="7.6" fill="url(#gb)"/><circle cx="${CX+3.4}" cy="11.4" r="6.6" fill="#000"/>`;
  s += `<path d="M${CX-26} 14H${CX-16}M${CX+16} 14H${CX+26}" stroke="url(#g)" stroke-width=".6" opacity=".8"/>`;
  s += `<path d="${diamond(CX, 176, 3.4, 4.6)}" fill="url(#gb)"/><path d="M${CX-24} 176H${CX-9}M${CX+9} 176H${CX+24}" stroke="url(#g)" stroke-width=".6" opacity=".8"/>`;
  if (o.jewels) {
    [205, 335, 112].forEach(d => { const a = d * Math.PI / 180, x = CX + 138 * Math.cos(a), y = CY + 56 * Math.sin(a); s += `<circle cx="${f(x)}" cy="${f(y)}" r="7" fill="#000"/><circle cx="${f(x)}" cy="${f(y)}" r="3.2" fill="url(#gb)"/><circle cx="${f(x)}" cy="${f(y)}" r="5.4" fill="none" stroke="url(#g)" stroke-width=".5"/>`; });
    [[14, 95, 7, 5], [346, 95, 7, 5], [38, 26, 5, 3.6], [322, 26, 5, 3.6], [38, 164, 5, 3.6], [322, 164, 5, 3.6]].forEach(([x, y, h, w]) => { s += `<path d="${sparkle(x, y, h, w)}" fill="url(#gb)" opacity=".9"/>`; });
  }
  return s;
};

GEN.brackets = o => {
  const sw = x => f(x * o.k); let s = '';
  if (o.pattern) { let ln = ''; for (let x = 24; x <= 336; x += 4) ln += `M${x} 20V170`;
    s += `<clipPath id="in"><rect x="20" y="20" width="320" height="150" rx="8"/></clipPath><g clip-path="url(#in)"><path d="${ln}" stroke="url(#g)" stroke-width="${sw(.3)}" opacity=".18"/>` + VIG('.97', '.85', '0') + `<ellipse cx="${CX}" cy="${CY}" rx="150" ry="62" fill="url(#vg)"/></g>`; }
  if (o.ambient) s += AMB('amb', 60) + `<rect x="14" y="14" width="332" height="162" rx="14" fill="url(#amb)"/>`;
  const cn = `<path d="M6 48V20Q6 6 20 6H52" stroke-width="${sw(1.8)}"/><path d="M13 42V27Q13 13 27 13H46" stroke-width="${sw(.6)}" opacity=".7"/>`;
  let fr = `<g id="cn" fill="none" stroke="url(#g)" stroke-linecap="round">${cn}</g>` +
    `<use href="#cn" transform="matrix(-1 0 0 1 360 0)"/><use href="#cn" transform="matrix(1 0 0 -1 0 190)"/><use href="#cn" transform="matrix(-1 0 0 -1 360 190)"/>`;
  fr += `<g fill="none" stroke="url(#g)" stroke-linecap="round"><path d="M62 6H148M212 6H298M62 184H148M212 184H298M6 62V80M6 110V128M354 62V80M354 110V128" stroke-width="${sw(.7)}"/></g>`;
  if (o.beads) fr += `<path d="M62 12H148M212 12H298M62 178H148M212 178H298" stroke="url(#g)" stroke-width="${sw(1.2)}" stroke-dasharray="0.01 4" stroke-linecap="round" fill="none" opacity=".8"/>`;
  s += `<g id="fr">${fr}</g>` + GLOW(o);
  s += [6, 184].map(y => `<circle cx="${CX}" cy="${y}" r="10" fill="#000"/><path d="${diamond(CX, y, 5, 7)}" fill="url(#gb)"/><path d="${diamond(CX, y, 8.4, 9.4)}" fill="none" stroke="url(#g)" stroke-width=".6"/>`).join('');
  s += [6, 354].map(x => `<circle cx="${x}" cy="${CY}" r="10" fill="#000"/><path d="${diamond(x, CY, 6, 8)}" fill="url(#gb)"/><path d="${diamond(x, CY, 9, 11)}" fill="none" stroke="url(#g)" stroke-width=".6"/>`).join('');
  if (o.jewels) [[20, 20], [340, 20], [20, 170], [340, 170]].forEach(([x, y]) => { s += `<path d="${diamond(x, y, 2.8, 2.8)}" fill="url(#gb)"/>`; });
  return s;
};

const STYLES = {
  imperial: { ed: 'IMPERIAL', use: ['glow','beads','jewels','ambient'] },
  guilloche:{ ed: 'GUILLOCHE', use: ['glow','beads','jewels','pattern'] },
  zellige:  { ed: 'ZELLIGE', use: ['glow','beads','jewels','pattern'] },
  laurier:  { ed: 'LAURIER', use: ['glow','beads','jewels','ambient'] },
  celestial:{ ed: 'CELESTIAL', use: ['glow','beads','jewels','pattern','ambient'] },
  brackets: { ed: 'BRACKETS', use: ['glow','beads','jewels','pattern','ambient'] }
};
window.CastixGeo = { f, esc, P, chamfer, offsetPoly, star8, diamond, sparkle, rrectPath, rrectSamples, CX, CY };
window.CastixFrames = { GEN, STYLES };
})();
