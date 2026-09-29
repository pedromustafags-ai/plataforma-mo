
/* ================= v8: quadro branco no padrão Miro, mapa mental no padrão MindMaster ================= */
Object.assign(IC, {
  redo: ['M21 7v6h-6', 'M3 17a9 9 0 0 1 15-6.7L21 13'],
  mind: ['M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0', 'M15 10.5 19 6', 'M15 13.5 19 18', 'M9 12H4', 'M19 6h2', 'M19 18h2'],
  frame: ['M7 3v18', 'M17 3v18', 'M3 7h18', 'M3 17h18'],
  eraser: ['M8 20h12', 'M4.5 15.5 14 6l5 5-9.5 9.5H9z', 'M9.5 10.5l5 5'],
  hl: ['M9 11l-5 5v4h4l5-5', 'M9 11l6-6 4 4-6 6', 'M14 20h7'],
  smile: ['M21 12a9 9 0 1 1-18 0a9 9 0 1 1 18 0', 'M8 14.5s1.5 2 4 2 4-2 4-2', 'M9 9.5h.01', 'M15 9.5h.01'],
  unlock: ['M5 11h14v10H5z', 'M8 11V7a4 4 0 0 1 7.6-1.8'],
  bold: ['M7 5h6a3.5 3.5 0 0 1 0 7H7z', 'M7 12h7a3.5 3.5 0 0 1 0 7H7z'],
  alL: ['M4 3v18', 'M8 6h11v4H8z', 'M8 14h7v4H8z'], alC: ['M12 3v18', 'M5 6h14v4H5z', 'M8 14h8v4H8z'], alR: ['M20 3v18', 'M5 6h11v4H5z', 'M9 14h7v4H9z'],
  alT: ['M3 4h18', 'M6 8h4v11H6z', 'M14 8h4v7h-4z'], alM: ['M3 12h18', 'M6 5h4v14H6z', 'M14 8h4v8h-4z'], alB: ['M3 20h18', 'M6 5h4v11H6z', 'M14 9h4v7h-4z'],
  dsH: ['M4 4v16', 'M20 4v16', 'M10 7h4v10h-4z'], dsV: ['M4 4h16', 'M4 20h16', 'M7 10h10v4H7z'],
  front: ['M9 9h11v11H9z', 'M15 5H4v11'], back: ['M4 4h11v11H4z', 'M9 20h11V9'],
  map: ['M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z', 'M9 3v15', 'M15 6v15'],
  round: ['M3 8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z'], diamond: ['M12 3l9 9-9 9-9-9z'], tri: ['M12 4l9 16H3z'], para: ['M8 5h13l-5 14H3z'],
  lnS: ['M5 19 19 5'], lnC: ['M5 19C5 9 19 15 19 5'], lnE: ['M5 19h7V5h7'],
  hdN: ['M4 12h16'], hdE: ['M4 12h16', 'M15 7l5 5-5 5'], hdB: ['M4 12h16', 'M15 7l5 5-5 5', 'M9 7l-5 5 5 5'], dash: ['M3 12h4', 'M10 12h4', 'M17 12h4'],
  help: ['M21 12a9 9 0 1 1-18 0a9 9 0 1 1 18 0', 'M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3', 'M12 17h.01'],
  fit: ['M4 9V4h5', 'M20 9V4h-5', 'M4 15v5h5', 'M20 15v5h-5'],
});
const WB_FILL = { white: '#FFFFFF', sand: '#EFE3CD', cream: '#F7F0E3', green: '#DCE9DD', blue: '#DCE6F0', lilac: '#E6E0F0', pink: '#F2DEDC', dark: '#222831', none: 'none' };
const WB_INK = ['var(--text)', '#6A655D', '#C0392B', '#2459C7', '#1E7A4C', '#6D3FC0'];
const BRANCH = ['#C0392B', '#B4540C', '#1E7A4C', '#2459C7', '#6D3FC0', '#0E7480'];
const STAMPS = ['👍', '❤️', '🔥', '⭐', '✅', '❌', '❓', '💡'];
const SHAPE_T = ['rect', 'round', 'ellipse', 'diamond', 'tri', 'para'];
const SHAPE_L = { rect: 'Retângulo', round: 'Arredondado', ellipse: 'Elipse', diamond: 'Losango', tri: 'Triângulo', para: 'Paralelogramo' };
const SHAPE_IC = { rect: 'square', round: 'round', ellipse: 'circle', diamond: 'diamond', tri: 'tri', para: 'para' };
const isShape = e => SHAPE_T.includes(e.t);
const hasBox = e => e && e.t !== 'arrow' && e.t !== 'pen';
const textual = e => e && (e.t === 'sticky' || e.t === 'text' || isShape(e) || e.t === 'mind');

/* medir texto de verdade para o post-it encolher a letra e o mapa mental crescer com o texto */
const _mc = document.createElement('canvas').getContext('2d');
const tw = (s, px, wt = 500) => { _mc.font = `${wt} ${px}px Geist, ui-sans-serif, system-ui, sans-serif`; return _mc.measureText(s).width; };
function wrapLines(text, px, wt, maxW) {
  const out = [];
  String(text || '').split('\n').forEach(par => { let line = ''; par.split(/\s+/).forEach(word => { const t = line ? line + ' ' + word : word; if (!line || tw(t, px, wt) <= maxW) line = t; else { out.push(line); line = word; } }); out.push(line); });
  return out;
}
function stickyFont(e) { const txt = e.text || ''; if (!txt) return 18; for (let fs = 22; fs >= 11; fs--) { if (wrapLines(txt, fs, 500, e.w - 28).length * fs * 1.32 <= e.h - 22) return fs; } return 11; }

/* geometria */
function wbBox(els) {
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  els.forEach(e => { if (e.hid) return; if (e.t === 'pen') e.pts.forEach(([x, y]) => { x1 = Math.min(x1, x); y1 = Math.min(y1, y); x2 = Math.max(x2, x); y2 = Math.max(y2, y); }); else if (e.t === 'arrow') { if (!e.from) { x1 = Math.min(x1, e.x1); y1 = Math.min(y1, e.y1); x2 = Math.max(x2, e.x1); y2 = Math.max(y2, e.y1); } if (!e.to) { x1 = Math.min(x1, e.x2); y1 = Math.min(y1, e.y2); x2 = Math.max(x2, e.x2); y2 = Math.max(y2, e.y2); } } else { x1 = Math.min(x1, e.x); y1 = Math.min(y1, e.y - (e.t === 'frame' ? 30 : 0)); x2 = Math.max(x2, e.x + e.w); y2 = Math.max(y2, e.y + e.h); } });
  return isFinite(x1) ? { x: x1, y: y1, w: x2 - x1, h: y2 - y1 } : { x: 0, y: 0, w: 800, h: 500 };
}
const ctr = e => [e.x + e.w / 2, e.y + e.h / 2];
function edgePt(e, toward) { const [cx0, cy0] = ctr(e); const dx = toward[0] - cx0, dy = toward[1] - cy0; if (!dx && !dy) return [cx0, cy0]; const s = Math.min((e.w / 2 + 5) / Math.abs(dx || 1e-9), (e.h / 2 + 5) / Math.abs(dy || 1e-9)); return [cx0 + dx * s, cy0 + dy * s]; }
function connGeom(a, map) {
  const A = a.from && map[a.from], B = a.to && map[a.to];
  const pa = A ? ctr(A) : [a.x1, a.y1], pb = B ? ctr(B) : [a.x2, a.y2];
  const st = a.style || 'straight';
  if (st === 'straight') { const p = A ? edgePt(A, pb) : pa, q = B ? edgePt(B, pa) : pb; return { d: `M${p[0]} ${p[1]}L${q[0]} ${q[1]}`, mid: [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2] }; }
  const dx = pb[0] - pa[0], dy = pb[1] - pa[1]; const hor = Math.abs(dx) >= Math.abs(dy); const sx = Math.sign(dx) || 1, sy = Math.sign(dy) || 1;
  const side = (E, s) => hor ? [s > 0 ? E.x + E.w + 5 : E.x - 5, E.y + E.h / 2] : [E.x + E.w / 2, s > 0 ? E.y + E.h + 5 : E.y - 5];
  const p = A ? side(A, hor ? sx : sy) : pa, q = B ? side(B, hor ? -sx : -sy) : pb;
  if (st === 'elbow') { if (hor) { const mx = (p[0] + q[0]) / 2; return { d: `M${p[0]} ${p[1]}H${mx}V${q[1]}H${q[0]}`, mid: [mx, (p[1] + q[1]) / 2] }; } const my = (p[1] + q[1]) / 2; return { d: `M${p[0]} ${p[1]}V${my}H${q[0]}V${q[1]}`, mid: [(p[0] + q[0]) / 2, my] }; }
  const k = Math.max(40, (hor ? Math.abs(q[0] - p[0]) : Math.abs(q[1] - p[1])) / 2);
  const c1 = hor ? [p[0] + sx * k, p[1]] : [p[0], p[1] + sy * k], c2 = hor ? [q[0] - sx * k, q[1]] : [q[0], q[1] - sy * k];
  return { d: `M${p[0]} ${p[1]}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${q[0]} ${q[1]}`, mid: [(p[0] + 3 * c1[0] + 3 * c2[0] + q[0]) / 8, (p[1] + 3 * c1[1] + 3 * c2[1] + q[1]) / 8] };
}
const penD = pts => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
const inkIdx = c => Math.max(0, WB_INK.indexOf(c || WB_INK[0]));

/* mapa mental: o tamanho sai do texto, a posição sai da árvore */
const MIND = { maxW: 240, padX: 16, padY: 9, hgap: 56, vgap: 12 };
function mindSize(n, lv) {
  const px = lv === 0 ? 17 : lv === 1 ? 14 : 13.5, wt = lv < 2 ? 600 : 500;
  const lines = wrapLines(n.text || '', px, wt, MIND.maxW - MIND.padX * 2);
  const w = Math.max(lv === 0 ? 120 : 64, Math.min(MIND.maxW, Math.max(...lines.map(l => tw(l, px, wt))) + MIND.padX * 2 + 2));
  return { w: Math.ceil(w), h: Math.round(lines.length * px * 1.35 + MIND.padY * 2 + (lv === 0 ? 8 : 0)) };
}
function mindLayout(els) {
  if (!els.some(e => e.t === 'mind')) return els;
  const map = {}; els.forEach(e => { if (e.t === 'mind') map[e.id] = { ...e }; });
  const kids = {}; Object.values(map).forEach(n => { if (n.parent && map[n.parent]) (kids[n.parent] = kids[n.parent] || []).push(n); });
  const sub = {};
  const size = (n, lv, col) => { Object.assign(n, mindSize(n, lv), { lv, bc: lv === 0 ? null : col }); (kids[n.id] || []).forEach((k, i) => size(k, lv + 1, lv === 0 ? (k.color || BRANCH[i % BRANCH.length]) : (k.color || col))); };
  const H = n => { const ks = n.collapsed ? [] : kids[n.id] || []; const tot = ks.reduce((a, k) => a + H(k), 0) + Math.max(0, ks.length - 1) * MIND.vgap; return (sub[n.id] = Math.max(n.h, tot)); };
  const place = (n, x, cy) => { n.x = Math.round(x); n.y = Math.round(cy - n.h / 2); const ks = n.collapsed ? [] : kids[n.id] || []; const tot = ks.reduce((a, k) => a + sub[k.id], 0) + Math.max(0, ks.length - 1) * MIND.vgap; let y = cy - tot / 2; ks.forEach(k => { place(k, x + n.w + MIND.hgap, y + sub[k.id] / 2); y += sub[k.id] + MIND.vgap; }); };
  const hide = (n, h) => { n.hid = h; (kids[n.id] || []).forEach(k => hide(k, h || !!n.collapsed)); };
  Object.values(map).filter(n => !n.parent || !map[n.parent]).forEach(r => { const cy = r.y + (r.h || 40) / 2; size(r, 0, null); H(r); place(r, r.x, cy); hide(r, false); });
  return els.map(e => (e.t === 'mind' ? map[e.id] : e));
}
const mindKids = (els, id) => els.filter(e => e.t === 'mind' && e.parent === id);
function mindTree(els, id) { const out = [id]; for (let i = 0; i < out.length; i++) mindKids(els, out[i]).forEach(k => out.push(k.id)); return out; }
const newMind = (parent, text = '') => ({ id: uid('e'), t: 'mind', root: parent ? parent.root : null, parent: parent ? parent.id : null, text, x: parent ? parent.x + parent.w + MIND.hgap : 0, y: parent ? parent.y : 0, w: 80, h: 34 });

/* miniatura da lista de quadros */
function BoardThumb({ els }) {
  const vis = mindLayout(els).filter(e => !e.hid); const b = wbBox(vis); const pad2 = 30; const map = Object.fromEntries(vis.map(e => [e.id, e]));
  return html`<svg viewBox=${`${b.x - pad2} ${b.y - pad2} ${b.w + pad2 * 2} ${b.h + pad2 * 2}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    ${vis.filter(e => e.t === 'frame').map(e => html`<rect key=${e.id} x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx="6" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="3" />`)}
    ${vis.filter(e => e.t === 'mind' && e.parent && map[e.parent]).map(e => { const p = map[e.parent]; const x1 = p.x + p.w, y1 = p.y + p.h / 2, x2 = e.x, y2 = e.y + e.h / 2; return html`<path key=${'b' + e.id} d=${`M${x1} ${y1}C${x1 + 28} ${y1} ${x2 - 28} ${y2} ${x2} ${y2}`} fill="none" stroke=${e.bc || '#6A655D'} stroke-width="4" />`; })}
    ${vis.map(e => { if (e.t === 'frame') return null;
      if (e.t === 'sticky') return html`<rect key=${e.id} x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx="4" fill=${STICKY[e.color] || STICKY.sand} />`;
      if (e.t === 'mind') return html`<rect key=${e.id} x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx=${e.h / 2} fill=${e.lv === 0 ? '#222831' : e.lv === 1 ? e.bc : '#FFFFFF'} stroke=${e.lv > 1 ? e.bc : 'none'} stroke-width="3" />`;
      if (isShape(e)) return html`<g key=${e.id} transform=${`translate(${e.x},${e.y})`}>${shapeEl(e, 'var(--text-2)', 3)}</g>`;
      if (e.t === 'text') return html`<rect key=${e.id} x=${e.x} y=${e.y + e.h * .3} width=${Math.min(e.w, (e.text || '').length * (e.size || 18) * .5)} height=${e.h * .35} rx="3" fill="var(--text-3)" opacity=".5" />`;
      if (e.t === 'image' || e.t === 'link') return html`<rect key=${e.id} x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx="6" fill="var(--surface-2)" stroke="var(--line-strong)" stroke-width="2" />`;
      if (e.t === 'stamp') return html`<circle key=${e.id} cx=${e.x + e.w / 2} cy=${e.y + e.h / 2} r=${e.w / 2} fill="var(--st-adj-bg)" />`;
      if (e.t === 'pen') return html`<path key=${e.id} d=${penD(e.pts)} fill="none" stroke=${e.color || 'var(--text)'} stroke-width=${e.hl ? 14 : 4} opacity=${e.hl ? .4 : 1} stroke-linecap="round" stroke-linejoin="round" />`;
      if (e.t === 'arrow') return html`<path key=${e.id} d=${connGeom(e, map).d} fill="none" stroke="var(--text-2)" stroke-width="3" />`;
      return null; })}
  </svg>`;
}
function shapeEl(e, stroke, sw, cls) {
  const w = e.w, h = e.h; const fill = e.t === 'text' ? 'none' : (WB_FILL[e.fill] || WB_FILL.white); const p = { fill, stroke, 'stroke-width': sw, class: cls };
  if (e.t === 'ellipse') return html`<ellipse cx=${w / 2} cy=${h / 2} rx=${w / 2} ry=${h / 2} ...${p} />`;
  if (e.t === 'diamond') return html`<polygon points=${`${w / 2},0 ${w},${h / 2} ${w / 2},${h} 0,${h / 2}`} ...${p} />`;
  if (e.t === 'tri') return html`<polygon points=${`${w / 2},0 ${w},${h} 0,${h}`} ...${p} />`;
  if (e.t === 'para') return html`<polygon points=${`${w * .18},0 ${w},0 ${w * .82},${h} 0,${h}`} ...${p} />`;
  return html`<rect width=${w} height=${h} rx=${e.t === 'round' ? Math.min(h / 2, 28) : 6} ...${p} />`;
}
const shapeTextBox = e => e.t === 'diamond' ? [e.w * .2, e.h * .22, e.w * .6, e.h * .56] : e.t === 'tri' ? [e.w * .22, e.h * .42, e.w * .56, e.h * .52] : e.t === 'para' ? [e.w * .16, 0, e.w * .68, e.h] : [0, 0, e.w, e.h];
