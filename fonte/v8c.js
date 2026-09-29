
/* o quadro */
const TOOLS8 = [['select', 'cursor', 'Selecionar', 'V'], ['hand', 'hand', 'Mover a lousa', 'H'], ['tpl', 'grid', 'Modelos', ''], ['text', 'type', 'Texto', 'T'], ['sticky', 'sticky', 'Post-it', 'N'], ['shape', 'square', 'Formas', 'S'],
  ['line', 'lnC', 'Conector', 'L'], ['pen', 'pen', 'Caneta', 'P'], ['mind', 'mind', 'Mapa mental', 'M'], ['frame', 'frame', 'Moldura', 'F'], ['more', 'plus', 'Mais: imagem, link e carimbos', '']];
const WB_KEYS = { v: 'select', h: 'hand', t: 'text', n: 'sticky', s: 'shape', l: 'line', p: 'pen', e: 'eraser', m: 'mind', f: 'frame' };
const WB_SIZES = [['P', 14], ['M', 18], ['G', 26], ['GG', 36]];
const focusEnd = el => { if (!el) return; const go = () => { if (!el.isConnected || document.activeElement === el || el.getAttribute('contenteditable') !== 'true') return; el.focus({ preventScroll: true }); try { const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } catch (_) {} }; go(); setTimeout(go, 0); setTimeout(go, 90); };
function cloneEls(list, dx, dy) {
  const ids = {}; list.forEach(e => { ids[e.id] = uid('e'); });
  return list.filter(e => e.t !== 'arrow' || ((!e.from || ids[e.from]) && (!e.to || ids[e.to]))).map(e => {
    const n = { ...e, id: ids[e.id], locked: false };
    if (e.t === 'pen') n.pts = e.pts.map(([x, y]) => [x + dx, y + dy]);
    else if (e.t === 'arrow') { n.from = e.from ? ids[e.from] : null; n.to = e.to ? ids[e.to] : null; if (!e.from) { n.x1 = e.x1 + dx; n.y1 = e.y1 + dy; } if (!e.to) { n.x2 = e.x2 + dx; n.y2 = e.y2 + dy; } }
    else { n.x = e.x + dx; n.y = e.y + dy; }
    if (e.t === 'mind') { n.parent = e.parent && ids[e.parent] ? ids[e.parent] : null; n.root = n.parent ? ids[e.root] || null : n.id; }
    return n;
  }).map((n, _, all) => (n.t === 'mind' && n.parent && !n.root ? { ...n, root: all.find(x => x.id === n.parent).root } : n));
}
function Whiteboard({ board }) {
  const { act, me, toast } = useApp();
  const [ai, setAi] = useState(false);
  const [els, setEls] = useState(() => mindLayout(board.els));
  const elsRef = useRef(els); elsRef.current = els;
  const [vp, setVp] = useState({ x: 60, y: 90, k: 1 }); const vpRef = useRef(vp); vpRef.current = vp;
  const [tool, setTool] = useState('select');
  const [opt, setOptS] = useState({ color: 'sand', shape: 'rect', line: 'curve', head: 'end', dash: false, pen: 'pen', ink: WB_INK[0], stamp: '👍' });
  const setOpt = o => setOptS(v => ({ ...v, ...o }));
  const [sel, setSel] = useState([]); const selRef = useRef(sel); selRef.current = sel;
  const [editing, setEditing] = useState(null); const editingRef = useRef(null); editingRef.current = editing;
  const [draft, setDraft] = useState(null);
  const [spaceDown, setSpaceDown] = useState(false); const [busy, setBusy] = useState(false);
  const [panel, setPanel] = useState(null);
  const [mini, setMini] = useState(true);
  const [pres, setPres] = useState(null);
  const [box, setBox] = useState({ w: 1000, h: 600 });
  const [linkV, setLinkV] = useState('');
  const hist = useRef([]), fut = useRef([]); const svgRef = useRef(), wrapRef = useRef(), drag = useRef(null), fileRef = useRef(), H = useRef({});
  const map = Object.fromEntries(els.map(e => [e.id, e]));
  const frames = els.filter(e => e.t === 'frame');

  const commitEls = next => { next = mindLayout(next); setEls(next); elsRef.current = next; act.saveBoard(board.id, next); return next; };
  const save = (next, before) => { if (before) { hist.current.push(before); if (hist.current.length > 80) hist.current.shift(); fut.current = []; } return commitEls(next); };
  const undo = () => { const prev = hist.current.pop(); if (!prev) return; fut.current.push(elsRef.current); commitEls(prev); setSel([]); setEditing(null); };
  const redo = () => { const nx = fut.current.pop(); if (!nx) return; hist.current.push(elsRef.current); commitEls(nx); setSel([]); setEditing(null); };
  const toW = e => { const r = svgRef.current.getBoundingClientRect(); const v = vpRef.current; return [(e.clientX - r.left - v.x) / v.k, (e.clientY - r.top - v.y) / v.k]; };
  const viewCenter = () => { const r = svgRef.current.getBoundingClientRect(); const v = vpRef.current; return [(r.width / 2 - v.x) / v.k, (r.height / 2 - v.y) / v.k]; };
  const hitEl = (p, skip) => { const L = elsRef.current; for (let i = L.length - 1; i >= 0; i--) { const e = L[i]; if (!hasBox(e) || e.hid || e.t === 'frame' || e.id === skip) continue; if (p[0] >= e.x && p[0] <= e.x + e.w && p[1] >= e.y && p[1] <= e.y + e.h) return e; } return null; };
  const fitTo = (b, pad = 90, bare) => { if (!svgRef.current) return; const r = svgRef.current.getBoundingClientRect(); const L0 = bare || r.width < 760 ? 0 : 64; const k = Math.max(.1, Math.min(1.5, Math.min((r.width - L0 - pad) / (b.w || 1), (r.height - pad - 30) / (b.h || 1)))); setVp({ k, x: L0 + (r.width - L0 - b.w * k) / 2 - b.x * k, y: (r.height - b.h * k) / 2 - b.y * k }); };
  const fit = () => fitTo(wbBox(elsRef.current));
  useEffect(() => { requestAnimationFrame(fit); const ro = new ResizeObserver(() => { const r = wrapRef.current.getBoundingClientRect(); setBox({ w: r.width, h: r.height }); }); ro.observe(wrapRef.current); return () => ro.disconnect(); }, []);
  const zoomBy = (f, cx0, cy0) => setVp(v => { const k = Math.max(.1, Math.min(4, v.k * f)); const r = svgRef.current.getBoundingClientRect(); const px = cx0 ?? r.width / 2, py = cy0 ?? r.height / 2; return { k, x: px - (px - v.x) * k / v.k, y: py - (py - v.y) * k / v.k }; });
  useEffect(() => { const el = wrapRef.current; const wh = e => { if (e.target.closest && e.target.closest('.wb-ui')) return; e.preventDefault(); const r = svgRef.current.getBoundingClientRect(); if (e.ctrlKey || e.metaKey) zoomBy(Math.exp(-e.deltaY * .01), e.clientX - r.left, e.clientY - r.top); else setVp(v => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY })); }; el.addEventListener('wheel', wh, { passive: false }); return () => el.removeEventListener('wheel', wh); }, []);

  /* criar */
  const reveal = el => { if (!el || !svgRef.current) return; const r = svgRef.current.getBoundingClientRect(); const v = vpRef.current; const L0 = r.width < 760 ? 20 : 90, m = 50;
    const sx = el.x * v.k + v.x, sy = el.y * v.k + v.y, ex = (el.x + el.w) * v.k + v.x, ey = (el.y + el.h) * v.k + v.y; let dx = 0, dy = 0;
    if (sx < L0) dx = L0 - sx; else if (ex > r.width - m) dx = r.width - m - ex; if (sy < m + 20) dy = m + 20 - sy; else if (ey > r.height - m - 40) dy = r.height - m - 40 - ey; if (dx || dy) setVp(vv => ({ ...vv, x: vv.x + dx, y: vv.y + dy })); };
  const addEl = (el, edit = true) => { const next = save([...elsRef.current, el], elsRef.current); setSel([el.id]); if (edit) setEditing(el.id); reveal(next.find(x => x.id === el.id)); };
  const addImage = async (file, at, i = 0) => { const src = await fileToUrl(file); const img = new Image(); img.onload = () => { const w = Math.min(420, img.naturalWidth || 420); const h = Math.round(w * (img.naturalHeight || 300) / (img.naturalWidth || 420)); const c = at || viewCenter(); addEl({ id: uid('e'), t: 'image', x: c[0] - w / 2 + i * 24, y: c[1] - h / 2 + i * 24, w, h, src }, false); }; img.src = src; };
  const addLink = (url, at) => { const c = at || viewCenter(); addEl({ id: uid('e'), t: 'link', x: c[0] - 150, y: c[1] - 38, w: 300, h: 76, url, name: '' }, false); };
  const pasteEls = list => { const b = wbBox(list); const c = viewCenter(); const out = cloneEls(list, c[0] - (b.x + b.w / 2) + 20, c[1] - (b.y + b.h / 2) + 20); save([...elsRef.current, ...out], elsRef.current); setSel(out.filter(x => !(x.t === 'mind' && x.parent)).map(x => x.id)); };
  const insertTpl = t => { const made = mindLayout(t.make()); const b = wbBox(made); const cur = elsRef.current; const ex = cur.filter(x => !x.hid).length ? wbBox(cur) : null; const tx = ex ? ex.x + ex.w + 200 : viewCenter()[0] - b.w / 2, ty = ex ? ex.y : viewCenter()[1] - b.h / 2;
    const moved = cloneEls(made, tx - b.x, ty - b.y); const next = save([...cur, ...moved], cur); setPanel(null); setSel([]); setTool('select'); requestAnimationFrame(() => fitTo(wbBox(next.filter(x => moved.some(m => m.id === x.id))))); toast(`Modelo ${t.name} no quadro`); };
  const quickCreate = (id, dir, at) => { const L = elsRef.current; const s = L.find(x => x.id === id); if (!s) return; const gap = 70; let nx = s.x, ny = s.y;
    if (at) { nx = at[0] - s.w / 2; ny = at[1] - s.h / 2; } else {
      const hz = dir === 'r' || dir === 'l'; const sg = dir === 'r' || dir === 'b' ? 1 : -1; const free = (x, y) => !elsRef.current.some(o => hasBox(o) && !o.hid && o.t !== 'frame' && o.id !== id && x < o.x + o.w && x + s.w > o.x && y < o.y + o.h && y + s.h > o.y);
      const cands = []; [1, 2].forEach(st => [0, 1, -1, 2, -2].forEach(pp => cands.push(hz ? [s.x + sg * st * (s.w + gap), s.y + pp * (s.h + 30)] : [s.x + pp * (s.w + 30), s.y + sg * st * (s.h + gap)])));
      [nx, ny] = cands.find(([x, y]) => free(x, y)) || cands[0]; }
    const el = { ...s, id: uid('e'), x: nx, y: ny, text: '', locked: false }; const ar = { id: uid('e'), t: 'arrow', from: s.id, to: el.id, style: opt.line, head: 'end', ink: WB_INK[0] };
    const next = save([...L, el, ar], L); setSel([el.id]); setEditing(el.id); reveal(next.find(x => x.id === el.id)); };

  /* mapa mental */
  const mindAdd = (id, mode) => { const L = elsRef.current; const n = L.find(x => x.id === id); if (!n || n.t !== 'mind') return; const parent = mode === 'child' || !n.parent ? n : L.find(x => x.id === n.parent); const el = newMind(parent, ''); el.root = parent.root || parent.id;
    let next = (mode === 'sibling' || mode === 'before') && n.parent ? (i => [...L.slice(0, i + 1), el, ...L.slice(i + 1)])(L.findIndex(x => x.id === id) - (mode === 'before' ? 1 : 0)) : [...L, el];
    if (parent.collapsed) next = next.map(x => (x.id === parent.id ? { ...x, collapsed: false } : x)); const done = save(next, L); setSel([el.id]); setEditing(el.id); reveal(done.find(x => x.id === el.id)); };
  const mindToggle = id => { const L = elsRef.current; save(L.map(x => (x.id === id ? { ...x, collapsed: !x.collapsed } : x)), L); };
  const mindNav = (id, key) => { const L = elsRef.current; const n = L.find(x => x.id === id); if (!n) return; let to = null;
    if (key === 'ArrowLeft') to = n.parent; else if (key === 'ArrowRight') { const k = mindKids(L, id)[0]; if (k) { if (n.collapsed) mindToggle(id); to = k.id; } }
    else { const sib = n.parent ? mindKids(L, n.parent) : []; const i = sib.findIndex(x => x.id === id); const j = key === 'ArrowUp' ? i - 1 : i + 1; if (sib[j]) to = sib[j].id; }
    if (to) setSel([to]); };

  /* editar texto */
  const setText = (id, text) => { const before = elsRef.current; const cur = before.find(x => x.id === id); if (editingRef.current === id) setEditing(null); if (!cur) return;
    if (cur.t === 'arrow') { if ((cur.label || '') !== text) save(before.map(x => (x.id === id ? { ...x, label: text } : x)), before); return; }
    if (cur.t === 'frame') { if (text && text !== cur.title) save(before.map(x => (x.id === id ? { ...x, title: text } : x)), before); return; }
    if (!text && cur.t === 'text') { save(before.filter(x => x.id !== id), before); setSel([]); return; }
    if (!text && cur.t === 'mind') text = cur.parent ? 'Tópico' : 'Tema central';
    if (cur.text !== text) save(before.map(x => (x.id === id ? { ...x, text } : x)), before); };
  const nextSticky = id => { const L = elsRef.current; const s0 = L.find(x => x.id === id); if (!s0) return; let nx = s0.x + s0.w + 24, ny = s0.y; for (let i = 0; i < 12 && hitEl([nx + s0.w / 2, ny + s0.h / 2], id); i++) nx += s0.w + 24;
    const el = { ...s0, id: uid('e'), x: nx, y: ny, text: '', locked: false }; save([...L, el], L); setSel([el.id]); setEditing(el.id); reveal(el); };
  const onEditKey = (ev, e) => {
    if (e.t === 'sticky' && (ev.key === 'Tab' || ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'd'))) { ev.preventDefault(); setText(e.id, ev.currentTarget.innerText.replace(/\n+$/, '').trim()); nextSticky(e.id); return; }
    if (ev.key === 'Escape') { ev.preventDefault(); ev.currentTarget.blur(); return; }
    if ((e.t === 'mind' || e.t === 'frame' || e.t === 'arrow') && ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); ev.currentTarget.blur(); return; }
    if (e.t === 'mind' && ev.key === 'Tab') { ev.preventDefault(); setText(e.id, ev.currentTarget.innerText.trim()); mindAdd(e.id, 'child'); return; }
    if ((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter') { ev.preventDefault(); ev.currentTarget.blur(); }
  };

  /* seleção */
  const selEls = sel.map(id => map[id]).filter(Boolean);
  const expandMove = ids => { const L = elsRef.current; const out = new Set();
    ids.forEach(id => { const e = map[id]; if (!e) return; out.add(id);
      if (e.t === 'mind') { let r = e; for (let g = 0; r.parent && map[r.parent] && g < 99; g++) r = map[r.parent]; mindTree(L, r.id).forEach(x => out.add(x)); }
      if (e.t === 'frame') L.forEach(x => { if (x.id === e.id || x.t === 'frame' || x.hid) return; const b = x.t === 'pen' || x.t === 'arrow' ? (x.t === 'pen' ? wbBox([x]) : null) : x; if (!b) return; const [cx0, cy0] = [b.x + b.w / 2, b.y + b.h / 2]; if (cx0 >= e.x && cx0 <= e.x + e.w && cy0 >= e.y && cy0 <= e.y + e.h) { out.add(x.id); if (x.t === 'mind') mindTree(L, x.id).forEach(y => out.add(y)); } }); });
    return out; };
  const remove = () => { const before = elsRef.current; let ids = new Set(sel.filter(id => map[id] && !map[id].locked)); if (!ids.size) return; sel.forEach(id => { if (map[id] && map[id].t === 'mind' && !map[id].locked) mindTree(before, id).forEach(x => ids.add(x)); });
    save(before.filter(e => !ids.has(e.id) && !(e.t === 'arrow' && (ids.has(e.from) || ids.has(e.to)))), before); setSel([]); };
  const duplicate = () => { const before = elsRef.current; const ids = new Set(); sel.forEach(id => { const e = map[id]; if (!e) return; if (e.t === 'mind') { if (!e.parent) mindTree(before, id).forEach(x => ids.add(x)); } else ids.add(id); });
    const src = before.filter(e => ids.has(e.id) || (e.t === 'arrow' && ids.has(e.from) && ids.has(e.to))); if (!src.length) return; const out = cloneEls(src, 30, 30); save([...before, ...out], before); setSel(out.filter(x => x.t !== 'arrow' && !(x.t === 'mind' && x.parent)).map(x => x.id)); };
  const patchSel = (fn, only) => { const before = elsRef.current; const ids = new Set(sel); save(before.map(x => (ids.has(x.id) && (!only || only(x)) ? { ...x, ...fn(x) } : x)), before); };
  const reorder = front => { const before = elsRef.current; const ids = new Set(sel); const a = before.filter(x => ids.has(x.id)), b = before.filter(x => !ids.has(x.id)); save(front ? [...b, ...a] : [...a, ...b], before); };
  const alignSel = mode => { const before = elsRef.current; const S = selEls.filter(x => hasBox(x) && x.t !== 'mind' && !x.locked); if (S.length < 2) return; const b = wbBox(S); const pos = {};
    if (mode === 'dh' || mode === 'dv') { const hz = mode === 'dh'; const srt = [...S].sort((p, q) => (hz ? p.x - q.x : p.y - q.y)); const tot = srt.reduce((a, x) => a + (hz ? x.w : x.h), 0); const gap = ((hz ? b.w : b.h) - tot) / (srt.length - 1); let c = hz ? b.x : b.y; srt.forEach(x => { pos[x.id] = hz ? { x: c } : { y: c }; c += (hz ? x.w : x.h) + gap; }); }
    else S.forEach(x => { pos[x.id] = mode === 'l' ? { x: b.x } : mode === 'c' ? { x: b.x + b.w / 2 - x.w / 2 } : mode === 'r' ? { x: b.x + b.w - x.w } : mode === 't' ? { y: b.y } : mode === 'm' ? { y: b.y + b.h / 2 - x.h / 2 } : { y: b.y + b.h - x.h }; });
    save(before.map(x => (pos[x.id] ? { ...x, ...pos[x.id] } : x)), before); };
  const toTask = () => { const st = selEls.filter(x => x.t === 'sticky' && x.text); st.forEach(s => act.addTask({ title: s.text.slice(0, 140), clientId: board.clientId || 'mo', assignee: me.id, due: null, desc: `Veio do quadro "${board.title}".` }, true)); toast(st.length ? `${plural(st.length, 'tarefa criada', 'tarefas criadas')} a partir do quadro` : 'Escreva no post-it antes de virar tarefa.'); };
  const eraseAt = p => { const L = elsRef.current; const r = 10 / vpRef.current.k; const hit = L.filter(x => x.t === 'pen' && x.pts.some(([a, b]) => Math.hypot(a - p[0], b - p[1]) < r)); if (!hit.length) return; const ids = new Set(hit.map(x => x.id)); const nx = L.filter(x => !ids.has(x.id)); setEls(nx); elsRef.current = nx; drag.current.hit = true; };

  /* apresentação por molduras */
  const fitFrame = (f, bare) => fitTo({ x: f.x, y: f.y - 30, w: f.w, h: f.h + 30 }, 60, bare);
  const present = i => { if (!frames.length) { toast('Crie molduras (F) para apresentar o quadro em partes.'); return; } setPanel(null); setSel([]); setEditing(null); setPres(i); fitFrame(frames[i], true); };
  const presGo = d => setPres(i => { const ni = Math.max(0, Math.min(frames.length - 1, i + d)); fitFrame(frames[ni], true); return ni; });

  /* teclado, copiar e colar */
  H.current.kd = e => {
    if (pres != null) { if (e.key === 'Escape') setPres(null); else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') presGo(1); else if (e.key === 'ArrowLeft' || e.key === 'PageUp') presGo(-1); else return; e.preventDefault(); return; }
    const t = e.target; if (t && (t.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(t.tagName))) return;
    const mod = e.metaKey || e.ctrlKey; const k = e.key.toLowerCase(); const S = selRef.current; const one = S.length === 1 ? elsRef.current.find(x => x.id === S[0]) : null;
    if (e.code === 'Space') { e.preventDefault(); setSpaceDown(true); return; }
    if (mod && k === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
    if (mod && k === 'y') { e.preventDefault(); redo(); return; }
    if (mod && k === 'd') { e.preventDefault(); duplicate(); return; }
    if (mod && e.shiftKey && k === 'l' && S.length) { e.preventDefault(); const L0 = elsRef.current; const allL = S.every(id => (L0.find(x => x.id === id) || {}).locked); patchSel(() => ({ locked: !allL })); return; }
    if (e.altKey && (e.code === 'Digit1')) { e.preventDefault(); fit(); return; }
    if ((e.key === 'PageUp' || e.key === 'PageDown') && S.length) { e.preventDefault(); reorder(e.key === 'PageUp'); return; }
    if (mod && k === 'a') { e.preventDefault(); setSel(elsRef.current.filter(x => !x.hid && !(x.t === 'mind' && x.parent)).map(x => x.id)); return; }
    if (mod || e.altKey) return;
    if (one && one.t === 'mind') {
      if (e.key === 'Tab') { e.preventDefault(); mindAdd(one.id, 'child'); return; }
      if (e.key === 'Enter') { e.preventDefault(); mindAdd(one.id, one.parent ? (e.shiftKey ? 'before' : 'sibling') : 'child'); return; }
      if (e.key.startsWith('Arrow')) { e.preventDefault(); mindNav(one.id, e.key); return; }
    }
    if (e.key === 'Enter' && one && textual(one) && !one.locked) { e.preventDefault(); setEditing(one.id); return; }
    if ((e.key === 'Delete' || e.key === 'Backspace') && S.length) { e.preventDefault(); remove(); return; }
    if (e.key === 'Escape') { setSel([]); setTool('select'); setPanel(null); return; }
    if (e.key.startsWith('Arrow') && S.length) { e.preventDefault(); const st = e.shiftKey ? 10 : 1; const dx = e.key === 'ArrowLeft' ? -st : e.key === 'ArrowRight' ? st : 0, dy = e.key === 'ArrowUp' ? -st : e.key === 'ArrowDown' ? st : 0; const ids = expandMove(S);
      patchSel(x => (x.t === 'pen' ? { pts: x.pts.map(([a, b]) => [a + dx, b + dy]) } : x.t === 'arrow' ? {} : { x: x.x + dx, y: x.y + dy }), x => ids.has(x.id) && !x.locked); return; }
    if (one && textual(one) && !one.locked && e.key.length === 1) { e.preventDefault(); const L = elsRef.current; save(L.map(x => (x.id === one.id ? { ...x, text: e.key } : x)), L); setEditing(one.id); return; }
    const tk = WB_KEYS[k]; if (tk) { if (tk === 'eraser') { setTool('pen'); setOpt({ pen: 'eraser' }); } else pick(tk); }
  };
  H.current.ku = e => { if (e.code === 'Space') setSpaceDown(false); };
  H.current.copy = ev => { const t = ev.target; if (t && (t.isContentEditable || /INPUT|TEXTAREA/.test(t.tagName))) return; const S = selRef.current; if (!S.length) return; const L = elsRef.current; const ids = new Set();
    S.forEach(id => { const e = L.find(x => x.id === id); if (!e) return; if (e.t === 'mind') mindTree(L, id).forEach(x => ids.add(x)); else ids.add(id); });
    const pickd = L.filter(x => ids.has(x.id) || (x.t === 'arrow' && ids.has(x.from) && ids.has(x.to))); ev.clipboardData.setData('text/plain', 'mo-wb:' + JSON.stringify(pickd)); ev.preventDefault(); toast(`${plural(pickd.length, 'item copiado', 'itens copiados')}`); };
  H.current.paste = ev => { const t = ev.target; if (t && (t.isContentEditable || /INPUT|TEXTAREA/.test(t.tagName))) return; const dt = ev.clipboardData; if (!dt) return;
    const files = [...(dt.files || [])].filter(f => /^image\//.test(f.type)); if (files.length) { ev.preventDefault(); files.forEach((f, i) => addImage(f, null, i)); return; }
    const txt = (dt.getData('text/plain') || '').trim(); if (!txt) return; ev.preventDefault();
    if (txt.startsWith('mo-wb:')) { try { pasteEls(JSON.parse(txt.slice(6))); } catch (_) {} return; }
    if (/^https?:\/\/\S+$/.test(txt)) { addLink(txt); return; }
    const c = viewCenter(); addEl({ ...wbS(c[0] - 95, c[1] - 65, opt.color, txt.slice(0, 400)) }, false); };
  useEffect(() => { const kd = e => H.current.kd(e), ku = e => H.current.ku(e), cp = e => H.current.copy(e), ps = e => H.current.paste(e);
    addEventListener('keydown', kd); addEventListener('keyup', ku); document.addEventListener('copy', cp); document.addEventListener('paste', ps);
    return () => { removeEventListener('keydown', kd); removeEventListener('keyup', ku); document.removeEventListener('copy', cp); document.removeEventListener('paste', ps); }; }, []);
  const pick = k => { if (k === 'tpl') { setPanel(panel === 'tpl' ? null : 'tpl'); return; } if (k === 'more') { setPanel(panel === 'more' ? null : 'more'); return; } setTool(k); setPanel(null); if (k === 'pen' && opt.pen === 'eraser') setOpt({ pen: 'pen' }); };

  /* ponteiro */
  const down = e => {
    if (e.button === 2 || pres != null) return;
    const p = toW(e); const tg = e.target.closest ? e.target.closest('[data-id]') : null; const id = tg && tg.getAttribute('data-id');
    if (editing) { if (id === editing) return; document.activeElement && document.activeElement.blur(); }
    if (panel && panel !== 'tpl') setPanel(null);
    svgRef.current.setPointerCapture(e.pointerId);
    if (tool === 'hand' || spaceDown || e.button === 1) { drag.current = { m: 'pan', sx: e.clientX, sy: e.clientY, v: vpRef.current }; return; }
    if (tg && tg.hasAttribute('data-madd')) { drag.current = null; mindAdd(id, 'child'); return; }
    if (tg && tg.hasAttribute('data-mtog')) { drag.current = null; mindToggle(id); return; }
    if (tg && tg.hasAttribute('data-quick')) { drag.current = { m: 'quick', id, dir: tg.getAttribute('data-quick'), p0: p, moved: false }; setDraft({ id: uid('e'), t: 'arrow', from: id, x2: p[0], y2: p[1], style: opt.line, head: 'end' }); return; }
    if (tool === 'select') {
      const h = tg && tg.getAttribute('data-h');
      if (h) { drag.current = { m: 'resize', id, h, p0: p, o: { ...map[id] }, before: elsRef.current }; return; }
      if (id && map[id]) { const ns = e.shiftKey ? (sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]) : sel.includes(id) ? sel : [id]; setSel(ns); const ids = expandMove(ns); const o = {};
        elsRef.current.forEach(x => { if (ids.has(x.id)) o[x.id] = x.t === 'pen' ? { pts: x.pts } : x.t === 'arrow' ? { x1: x.x1, y1: x.y1, x2: x.x2, y2: x.y2 } : { x: x.x, y: x.y }; });
        drag.current = { m: 'move', p0: p, o, before: elsRef.current, moved: false }; return; }
      setSel([]); drag.current = { m: 'marq', p0: p }; setDraft({ t: 'marq', x: p[0], y: p[1], w: 0, h: 0 }); return;
    }
    drag.current = null;
    if (tool === 'sticky') { addEl(wbS(p[0] - 95, p[1] - 65, opt.color)); setTool('select'); return; }
    if (tool === 'text') { addEl({ id: uid('e'), t: 'text', x: p[0], y: p[1] - 16, w: 300, h: 36, text: '', size: 18 }); setTool('select'); return; }
    if (tool === 'mind') { const r = { ...newMind(null, ''), x: p[0] - 70, y: p[1] - 24 }; r.root = r.id; addEl(r); setTool('select'); return; }
    if (tool === 'stamp') { save([...elsRef.current, { id: uid('e'), t: 'stamp', x: p[0] - 18, y: p[1] - 18, w: 36, h: 36, e: opt.stamp }], elsRef.current); return; }
    if (tool === 'shape' || tool === 'frame') { drag.current = { m: 'draw', p0: p }; setDraft(tool === 'frame' ? { id: uid('e'), t: 'frame', x: p[0], y: p[1], w: 0, h: 0, title: `Moldura ${frames.length + 1}` } : { id: uid('e'), t: opt.shape, x: p[0], y: p[1], w: 0, h: 0, text: '', fill: 'white', size: 15 }); return; }
    if (tool === 'line') { const from = hitEl(p); drag.current = { m: 'line' }; setDraft({ id: uid('e'), t: 'arrow', from: from ? from.id : null, x1: p[0], y1: p[1], x2: p[0], y2: p[1], style: opt.line, head: opt.head, dash: opt.dash, ink: WB_INK[0] }); return; }
    if (tool === 'pen') { if (opt.pen === 'eraser') { drag.current = { m: 'erase', before: elsRef.current, hit: false }; eraseAt(p); return; } drag.current = { m: 'pen' }; setDraft({ id: uid('e'), t: 'pen', color: opt.pen === 'hl' ? '#F5C518' : opt.ink, hl: opt.pen === 'hl', pts: [p] }); }
  };
  const move = e => {
    const d = drag.current; if (!d) return; const p = toW(e);
    if (d.m === 'pan') { setVp({ ...d.v, x: d.v.x + e.clientX - d.sx, y: d.v.y + e.clientY - d.sy }); return; }
    if (d.m === 'move') { const dx = p[0] - d.p0[0], dy = p[1] - d.p0[1]; if (!d.moved && Math.abs(dx) + Math.abs(dy) < 2) return; if (!d.moved) setBusy(true); d.moved = true;
      let any = false; const nx = elsRef.current.map(x => { const o = d.o[x.id]; if (!o || x.locked) return x; any = true; return x.t === 'pen' ? { ...x, pts: o.pts.map(([a, b]) => [a + dx, b + dy]) } : x.t === 'arrow' ? (x.from || x.to ? x : { ...x, x1: o.x1 + dx, y1: o.y1 + dy, x2: o.x2 + dx, y2: o.y2 + dy }) : { ...x, x: o.x + dx, y: o.y + dy }; });
      if (!any) return; d.any = true; setEls(nx); elsRef.current = nx; return; }
    if (d.m === 'resize') { const o = d.o; let x1 = o.x, y1 = o.y, x2 = o.x + o.w, y2 = o.y + o.h; const dx = p[0] - d.p0[0], dy = p[1] - d.p0[1];
      if (d.h.includes('w')) x1 += dx; else x2 += dx; if (d.h.includes('n')) y1 += dy; else y2 += dy;
      const mw = o.t === 'frame' ? 200 : 40, mh = o.t === 'frame' ? 120 : 24; if (x2 - x1 < mw) { if (d.h.includes('w')) x1 = x2 - mw; else x2 = x1 + mw; } if (y2 - y1 < mh) { if (d.h.includes('n')) y1 = y2 - mh; else y2 = y1 + mh; }
      if (o.t === 'image') { const hh = (x2 - x1) * o.h / o.w; if (d.h.includes('n')) y1 = y2 - hh; else y2 = y1 + hh; }
      const nx = elsRef.current.map(x => (x.id === d.id ? { ...x, x: x1, y: y1, w: x2 - x1, h: y2 - y1 } : x)); setEls(nx); elsRef.current = nx; if (!d.moved) setBusy(true); d.moved = true; return; }
    if (d.m === 'marq' || d.m === 'draw') { setDraft(dr => ({ ...dr, x: Math.min(p[0], d.p0[0]), y: Math.min(p[1], d.p0[1]), w: Math.abs(p[0] - d.p0[0]), h: Math.abs(p[1] - d.p0[1]) })); return; }
    if (d.m === 'line' || d.m === 'quick') { if (d.m === 'quick' && Math.hypot(p[0] - d.p0[0], p[1] - d.p0[1]) > 6) d.moved = true; const hv = hitEl(p, d.m === 'quick' ? d.id : draft && draft.from); setDraft(dr => ({ ...dr, x2: p[0], y2: p[1], hover: hv ? hv.id : null })); return; }
    if (d.m === 'erase') { eraseAt(p); return; }
    if (d.m === 'pen') setDraft(dr => { const l = dr.pts[dr.pts.length - 1]; return Math.hypot(p[0] - l[0], p[1] - l[1]) > 2 / vpRef.current.k ? { ...dr, pts: [...dr.pts, p] } : dr; });
  };
  const up = e => {
    const d = drag.current; drag.current = null; setBusy(false); if (!d) return; const p = toW(e);
    if ((d.m === 'move' && d.any) || (d.m === 'resize' && d.moved)) { save(elsRef.current, d.before); return; }
    if (d.m === 'erase') { if (d.hit) save(elsRef.current, d.before); return; }
    if (d.m === 'marq') { const r = draft; setDraft(null); if (r.w < 4 && r.h < 4) return; const ids = elsRef.current.filter(x => { if (x.hid || (x.t === 'arrow')) return false; const b = x.t === 'pen' ? wbBox([x]) : x; if (x.t === 'frame') return b.x >= r.x && b.y >= r.y && b.x + b.w <= r.x + r.w && b.y + b.h <= r.y + r.h; return b.x < r.x + r.w && b.x + b.w > r.x && b.y < r.y + r.h && b.y + b.h > r.y; }).map(x => x.id); setSel(ids); return; }
    if (d.m === 'draw') { let el = { ...draft }; setDraft(null); if (el.w < 12 || el.h < 12) el = el.t === 'frame' ? { ...el, x: d.p0[0] - 480, y: d.p0[1] - 270, w: 960, h: 540 } : { ...el, x: d.p0[0] - 90, y: d.p0[1] - 55, w: 180, h: 110 };
      const L = elsRef.current; save([...L, el], L); setSel([el.id]); setTool('select'); if (el.t !== 'frame') setEditing(el.id); return; }
    if (d.m === 'line') { const to = hitEl(p, draft.from); const el = { ...draft, to: to ? to.id : null }; delete el.hover; setDraft(null); if (!el.from && !el.to && Math.hypot(el.x2 - el.x1, el.y2 - el.y1) < 12) return; if (el.from && el.from === el.to) return; if (el.from && el.to && map[el.from] && map[el.to] && map[el.from].t === 'mind' && map[el.to].t === 'mind') { el.dash = true; el.style = 'curve'; } addEl(el, false); setTool('select'); return; }
    if (d.m === 'quick') { setDraft(null); if (!d.moved) { quickCreate(d.id, d.dir); return; } const to = hitEl(p, d.id); if (to) { const L = elsRef.current; save([...L, { id: uid('e'), t: 'arrow', from: d.id, to: to.id, style: opt.line, head: 'end', ink: WB_INK[0] }], L); } else quickCreate(d.id, d.dir, p); return; }
    if (d.m === 'pen') { const el = draft; setDraft(null); if (el.pts.length > 1) save([...elsRef.current, el], elsRef.current); }
  };
  const dbl = e => { if (tool !== 'select' || pres != null) return; const tg = e.target.closest && e.target.closest('[data-id]'); if (tg) { const id = tg.getAttribute('data-id'); const x = map[id]; if (x && !x.locked && (textual(x) || x.t === 'frame' || x.t === 'arrow')) { setSel([id]); setEditing(id); } return; }
  };

  /* desenho */
  const k = vp.k; const px = n => n / k;
  const Txt = (e, cls, style, bx) => { const [x0, y0, w0, h0] = bx || [0, 0, e.w, e.h]; const ed = editing === e.id; const v = e.t === 'arrow' ? e.label : e.t === 'frame' ? e.title : e.text;
    return html`<foreignObject x=${x0} y=${y0} width=${w0} height=${h0}><div key=${ed ? 'ed' : 'ro'} xmlns="http://www.w3.org/1999/xhtml" class=${cls} style=${style} contenteditable=${ed ? 'true' : 'false'} ref=${ed ? focusEnd : null}
      data-ph=${e.t === 'sticky' ? 'Escreva' : e.t === 'arrow' ? 'Rótulo' : 'Texto'} onPointerDown=${ev => { if (ed) ev.stopPropagation(); }}
      onBlur=${ev => { if (editingRef.current === e.id) setText(e.id, ev.currentTarget.innerText.replace(/\n+$/, '').trim()); }} onKeyDown=${ev => onEditKey(ev, e)}>${v || ''}</div></foreignObject>`; };
  const inkFor = e => e.ink || (e.fill === 'dark' ? '#F4EBDD' : e.fill === 'none' || e.t === 'text' ? 'var(--text)' : '#222831');
  const renderEl = e => {
    if (e.hid || e.t === 'frame') return null; const s = sel.includes(e.id);
    if (e.t === 'arrow') { const A = e.from && map[e.from], B = e.to && map[e.to]; if ((e.from && (!A || A.hid)) || (e.to && (!B || B.hid))) return null; const g = connGeom(e, map); const ii = inkIdx(e.ink); const mk = `url(#wbh${ii})`;
      return html`<g key=${e.id}><path d=${g.d} class=${cx('wb-conn', s && 'sel')} stroke=${e.ink || WB_INK[0]} stroke-dasharray=${e.dash ? '8 6' : null} marker-end=${(e.head || 'end') !== 'none' ? mk : null} marker-start=${e.head === 'both' ? mk : null} />
        <path data-id=${e.id} d=${g.d} stroke="transparent" stroke-width=${px(14)} fill="none" />
        ${(e.label || editing === e.id) && html`<g transform=${`translate(${g.mid[0] - 80},${g.mid[1] - 15})`}>${Txt(e, 'wb-clabel', null, [0, 0, 160, 30])}</g>`}</g>`; }
    if (e.t === 'pen') { const d = penD(e.pts); return html`<g key=${e.id}><path d=${d} fill="none" stroke=${e.color || 'var(--text)'} stroke-width=${e.hl ? 16 : 3} opacity=${e.hl ? .4 : 1} stroke-linecap="round" stroke-linejoin="round" class=${s ? 'wb-pen sel' : 'wb-pen'} /><path data-id=${e.id} d=${d} fill="none" stroke="transparent" stroke-width=${px(14)} /></g>`; }
    if (e.t === 'mind') { const lv = e.lv || 0; return html`<g key=${e.id} data-id=${e.id} transform=${`translate(${e.x},${e.y})`}>
        <rect width=${e.w} height=${e.h} rx=${lv < 2 ? e.h / 2 : 8} fill=${lv === 0 ? '#222831' : lv === 1 ? e.bc : '#FFFFFF'} stroke=${lv > 1 ? e.bc : lv === 0 ? 'var(--line-strong)' : 'none'} stroke-width="1.5" class="wb-mnode" />
        ${Txt(e, 'wb-mind wb-m' + Math.min(lv, 2), null)}
        ${e.prio && html`<g transform="translate(2,2)" class=${'wb-prio p' + e.prio}><circle r="9" /><text y="3.5" text-anchor="middle">${e.prio}</text></g>`}</g>`; }
    return html`<g key=${e.id} data-id=${e.id} transform=${`translate(${e.x},${e.y})`}>
      ${e.t === 'sticky' && html`<rect width=${e.w} height=${e.h} rx="3" fill=${STICKY[e.color] || STICKY.sand} class="wb-sticky" />`}
      ${e.t === 'sticky' && Txt(e, 'wb-st-text', { fontSize: stickyFont(e) + 'px', fontWeight: e.bold ? 700 : 500 })}
      ${isShape(e) && shapeEl(e, e.fill === 'dark' ? '#222831' : 'var(--text-2)', 1.5, 'wb-shp')}
      ${isShape(e) && Txt(e, 'wb-shape-text', { fontSize: (e.size || 15) + 'px', fontWeight: e.bold ? 700 : 500, color: inkFor(e) }, shapeTextBox(e))}
      ${e.t === 'text' && Txt(e, 'wb-text', { fontSize: (e.size || 20) + 'px', fontWeight: e.bold ? 700 : e.bold === undefined && (e.size || 20) >= 20 ? 600 : 500, color: inkFor(e) })}
      ${e.t === 'image' && html`<image href=${e.src} width=${e.w} height=${e.h} preserveAspectRatio="xMidYMid slice" /><rect width=${e.w} height=${e.h} fill="transparent" stroke="var(--line)" />`}
      ${e.t === 'link' && (() => { const i = linkInfo(e.url); return html`<rect width=${e.w} height=${e.h} rx="12" class="wb-card" /><foreignObject width=${e.w} height=${e.h}><div xmlns="http://www.w3.org/1999/xhtml" class="wb-link"><span class="lp-tile" style=${i.tone ? { background: i.tone } : null}><${Icon} n=${i.video ? 'play' : i.k === 'image' ? 'image' : i.k === 'gfolder' ? 'book' : 'file'} s=${16} /></span><span class="lp-t"><b>${niceName(e.url, e.name)}</b><small>${i.label}${i.host && i.host !== i.label ? ' · ' + i.host : ''}</small></span><a class="btn sm icon ghost" href=${e.url} target="_blank" rel="noopener" title="Abrir o link" onPointerDown=${ev => ev.stopPropagation()}><${Icon} n="ext" s=${14} /></a></div></foreignObject>`; })()}
      ${e.t === 'stamp' && html`<circle cx=${e.w / 2} cy=${e.h / 2} r=${e.w / 2} class="wb-stamp" /><text x=${e.w / 2} y=${e.h / 2 + 7} text-anchor="middle" font-size="20">${e.e}</text>`}
      ${s && e.locked && html`<g transform=${`translate(${e.w - px(10)},${-px(22)}) scale(${px(1)})`} class="wb-lockb"><${Icon} n="lock" s=${14} /></g>`}
    </g>`;
  };
  const one = selEls.length === 1 ? selEls[0] : null;
  const selBox = selEls.length ? wbBox(selEls.map(x => (x.t === 'arrow' ? (() => { const g = connGeom(x, map); return { t: 'pen', pts: [g.mid, g.mid] }; })() : x.t === 'frame' ? { ...x, t: 'rect' } : x))) : null;
  const canQuick = one && !one.locked && !editing && (one.t === 'sticky' || isShape(one)) && tool === 'select';
  const canResize = one && !one.locked && !editing && hasBox(one) && !['mind', 'stamp'].includes(one.t);
  const minds = els.filter(x => x.t === 'mind' && !x.hid);
  const sbx = selBox && { left: selBox.x * k + vp.x, top: selBox.y * k + vp.y - (one && one.t === 'frame' ? 30 * k : 0) };
  const showBar = selBox && !editing && !busy && pres == null;
  const has = f => selEls.some(f); const all = f => selEls.length > 0 && selEls.every(f);
  const Sw = (c, on, onClick, label, round) => html`<button key=${label} class=${cx('sw', round && 'dot', on && 'on')} style=${{ background: c === 'none' ? 'repeating-linear-gradient(45deg,#fff 0 3px,#ddd 3px 6px)' : c }} aria-label=${label} title=${label} onClick=${onClick}></button>`;
  const B = (ic, label, onClick, on) => html`<button class=${cx('btn sm icon ghost', on && 'on')} aria-label=${label} title=${label} onClick=${onClick}><${Icon} n=${ic} s=${15} /></button>`;
  const flyTop = i => ({ top: 8 + i * 40 + 'px' });
  const toolIdx = k2 => TOOLS8.findIndex(t => t[0] === k2);
  const presF = pres != null && frames[pres];
  const fr = presF && { x: presF.x * k + vp.x, y: (presF.y - 30) * k + vp.y, w: presF.w * k, h: (presF.h + 30) * k };

  return html`<div class=${cx('cv-wrap wb', pres != null && 'presenting')} ref=${wrapRef} onDragOver=${e => e.preventDefault()} onDrop=${e => { e.preventDefault(); const fs = [...(e.dataTransfer.files || [])].filter(f => /^image\//.test(f.type)); const p = toW(e); fs.forEach((f, i) => addImage(f, p, i)); }}>
    <svg ref=${svgRef} class="cv-svg" style=${{ cursor: spaceDown || tool === 'hand' ? 'grab' : tool === 'select' ? 'default' : 'crosshair' }} onPointerDown=${down} onPointerMove=${move} onPointerUp=${up} onDblClick=${dbl} onContextMenu=${e => e.preventDefault()}>
      <defs>
        <pattern id="wbgrid" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform=${`translate(${vp.x},${vp.y}) scale(${vp.k})`}><circle cx="1" cy="1" r="1" fill="var(--line-strong)" /></pattern>
        ${WB_INK.map((c, i) => html`<marker key=${i} id=${'wbh' + i} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill=${c} /></marker>`)}
        <filter id="wbsh" x="-10%" y="-10%" width="130%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity=".18" /></filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#wbgrid)" />
      <g transform=${`translate(${vp.x},${vp.y}) scale(${vp.k})`}>
        ${frames.map(f => html`<g key=${f.id}><rect x=${f.x} y=${f.y} width=${f.w} height=${f.h} rx="4" class=${cx('wb-frame', sel.includes(f.id) && 'sel')} />
          <g data-id=${f.id} class="wb-ftitle"><rect x=${f.x} y=${f.y - px(30)} width=${Math.max(px(80), px(tw(f.title || '', 14, 600) + 20))} height=${px(26)} rx=${px(6)} class="wb-ftbg" />
            ${editing === f.id ? Txt(f, 'wb-ftext', { fontSize: px(14) + 'px' }, [f.x, f.y - px(30), Math.max(px(200), f.w / 2), px(26)]) : html`<text x=${f.x + px(10)} y=${f.y - px(12)} font-size=${px(14)} class="wb-fttext">${f.title}</text>`}</g></g>`)}
        ${minds.filter(n => n.parent && map[n.parent]).map(n => { const p = map[n.parent]; const x1 = p.x + p.w, y1 = p.y + p.h / 2, x2 = n.x, y2 = n.y + n.h / 2; return html`<path key=${'br' + n.id} d=${`M${x1} ${y1}C${x1 + 28} ${y1} ${x2 - 28} ${y2} ${x2} ${y2}`} fill="none" stroke=${n.bc} stroke-width=${n.lv === 1 ? 3 : 2} stroke-linecap="round" />`; })}
        ${els.map(renderEl)}
        ${minds.filter(n => mindKids(els, n.id).length || (one && one.id === n.id && !editing)).map(n => { const kidsN = mindKids(els, n.id).length; const cy = n.y + n.h / 2; const x0 = n.x + n.w + px(12); const isSel = one && one.id === n.id && !editing;
          return html`<g key=${'mt' + n.id}>${kidsN > 0 && html`<g data-id=${n.id} data-mtog="1" class="wb-mtog" transform=${`translate(${x0},${cy}) scale(${px(1)})`}><circle r="9" /><text y="4" text-anchor="middle">${n.collapsed ? mindTree(els, n.id).length - 1 : '−'}</text></g>`}
            ${isSel && html`<g data-id=${n.id} data-madd="1" class="wb-madd" transform=${`translate(${x0 + (kidsN ? px(24) : 0)},${cy}) scale(${px(1)})`}><circle r="10" /><path d="M-4.5 0h9M0-4.5v9" /><title>Tópico filho (Tab)</title></g>`}</g>`; })}
        ${selBox && html`<rect x=${selBox.x - px(6)} y=${selBox.y - px(one && one.t === 'frame' ? 36 : 6)} width=${selBox.w + px(12)} height=${selBox.h + px(one && one.t === 'frame' ? 42 : 12)} rx=${px(6)} class="wb-selbox" stroke-width=${px(1.5)} pointer-events="none" />`}
        ${canResize && ['nw', 'ne', 'sw', 'se'].map(h => html`<rect key=${h} data-id=${one.id} data-h=${h} x=${(h.includes('w') ? one.x : one.x + one.w) - px(6)} y=${(h.includes('n') ? one.y : one.y + one.h) - px(6)} width=${px(12)} height=${px(12)} rx=${px(3)} stroke-width=${px(1.5)} class=${'wb-handle h-' + h} />`)}
        ${canQuick && [['r', one.x + one.w + px(28), one.y + one.h / 2], ['l', one.x - px(28), one.y + one.h / 2], ['b', one.x + one.w / 2, one.y + one.h + px(28)], ['t', one.x + one.w / 2, one.y - px(28)]].map(([d, qx, qy]) => html`<g key=${d} data-id=${one.id} data-quick=${d} class="wb-quick" transform=${`translate(${qx},${qy}) scale(${px(1)})`}><circle r="11" /><path d="M-4.5 0h9M0-4.5v9" /><title>Clique para criar um igual ligado. Arraste para ligar.</title></g>`)}
        ${draft && draft.t === 'marq' && html`<rect x=${draft.x} y=${draft.y} width=${draft.w} height=${draft.h} class="wb-marq" stroke-width=${px(1)} />`}
        ${draft && draft.t === 'frame' && html`<rect x=${draft.x} y=${draft.y} width=${draft.w} height=${draft.h} rx="4" class="wb-frame" />`}
        ${draft && isShape(draft) && html`<g transform=${`translate(${draft.x},${draft.y})`}>${shapeEl(draft, 'var(--text-2)', 1.5)}</g>`}
        ${draft && draft.t === 'arrow' && (() => { const g = connGeom(draft, map); const hv = draft.hover && map[draft.hover]; return html`${hv && html`<rect x=${hv.x - px(5)} y=${hv.y - px(5)} width=${hv.w + px(10)} height=${hv.h + px(10)} rx=${px(8)} class="wb-hover" stroke-width=${px(2)} />`}<path d=${g.d} class="wb-conn" stroke=${WB_INK[0]} stroke-dasharray=${draft.dash ? '8 6' : null} marker-end=${(draft.head || 'end') !== 'none' ? 'url(#wbh0)' : null} />`; })()}
        ${draft && draft.t === 'pen' && html`<path d=${penD(draft.pts)} fill="none" stroke=${draft.color} stroke-width=${draft.hl ? 16 : 3} opacity=${draft.hl ? .4 : 1} stroke-linecap="round" stroke-linejoin="round" />`}
      </g>
      ${fr && html`<path d=${`M0 0H${box.w}V${box.h}H0Z M${fr.x} ${fr.y}v${fr.h}h${fr.w}v${-fr.h}Z`} fill-rule="evenodd" class="wb-pres-mask" />`}
    </svg>

    ${els.length === 0 && pres == null && html`<div class="cv-empty wb-empty"><b>Quadro em branco</b><span>Aperte N para um post-it, M para um mapa mental, ou comece por um modelo.</span>
      <div class="wb-empty-acts wb-ui"><button class="btn pri" onClick=${() => setPanel('tpl')}><${Icon} n="grid" s=${15} />Escolher um modelo</button><button class="btn" onClick=${() => { const c = viewCenter(); const r = { ...newMind(null, ''), x: c[0] - 70, y: c[1] - 24 }; r.root = r.id; addEl(r); }}><${Icon} n="mind" s=${15} />Começar um mapa mental</button></div></div>`}

    ${showBar && html`<div class="wb-seltools wb-ui" style=${{ ...((selBox.x + selBox.w / 2) * k + vp.x > box.w / 2 ? { right: Math.max(8, box.w - ((selBox.x + selBox.w) * k + vp.x)) + 'px' } : { left: Math.max(8, sbx.left) + 'px' }), top: (sbx.top < 90 ? selBox.y * k + vp.y + selBox.h * k + (canQuick ? 44 : 16) : sbx.top - 50 - (canQuick ? 26 : 0)) + 'px' }} onPointerDown=${e => e.stopPropagation()}>
      ${has(x => x.t === 'sticky') && html`<span class="grp">${Object.keys(STICKY).map(c => Sw(STICKY[c], selEls.some(x => x.color === c), () => patchSel(() => ({ color: c }), x => x.t === 'sticky'), 'Post-it ' + c))}</span>`}
      ${has(isShape) && html`<span class="grp">${Object.entries(WB_FILL).map(([c, v]) => Sw(v, selEls.some(x => x.fill === c), () => patchSel(() => ({ fill: c }), isShape), 'Fundo ' + c))}</span>`}
      ${one && one.t === 'mind' && one.lv > 0 && html`<span class="grp">${BRANCH.map(c => Sw(c, one.bc === c, () => patchSel(() => ({ color: c })), 'Cor do ramo', true))}</span>`}
      ${has(x => x.t === 'text' || isShape(x)) && html`<span class="grp seg-mini">${WB_SIZES.map(([l, v]) => html`<button key=${l} class=${cx(selEls.some(x => (x.size || (x.t === 'text' ? 20 : 15)) === v) && 'on')} title=${'Tamanho ' + l} onClick=${() => patchSel(() => ({ size: v }), x => x.t === 'text' || isShape(x))}>${l}</button>`)}</span>`}
      ${has(x => x.t === 'sticky' || x.t === 'text' || isShape(x)) && B('bold', 'Negrito', () => patchSel(x => ({ bold: !x.bold }), x => x.t === 'sticky' || x.t === 'text' || isShape(x)), all(x => x.bold))}
      ${has(x => x.t === 'text' || isShape(x) || x.t === 'arrow') && html`<span class="grp">${WB_INK.map(c => Sw(c, selEls.some(x => x.ink === c), () => patchSel(() => ({ ink: c }), x => x.t === 'text' || isShape(x) || x.t === 'arrow'), 'Cor', true))}</span>`}
      ${all(x => x.t === 'arrow') && html`<span class="grp">${[['straight', 'lnS', 'Reta'], ['curve', 'lnC', 'Curva'], ['elbow', 'lnE', 'Em ângulo']].map(([v, ic, l]) => B(ic, l, () => patchSel(() => ({ style: v })), selEls.every(x => (x.style || 'straight') === v)))}</span>
        <span class="grp">${[['none', 'hdN', 'Sem seta'], ['end', 'hdE', 'Seta no fim'], ['both', 'hdB', 'Seta nas duas pontas']].map(([v, ic, l]) => B(ic, l, () => patchSel(() => ({ head: v })), selEls.every(x => (x.head || 'end') === v)))}${B('dash', 'Tracejada', () => patchSel(x => ({ dash: !x.dash })), all(x => x.dash))}${B('type', 'Escrever um rótulo', () => setEditing(selEls[0].id))}</span>`}
      ${one && one.t === 'mind' && html`<span class="grp"><button class="btn sm" onClick=${() => mindAdd(one.id, 'child')}><${Icon} n="plus" s=${13} />Tópico filho</button>${one.parent && html`<button class="btn sm" onClick=${() => mindAdd(one.id, 'sibling')}>Irmão</button>`}</span>
        <span class="grp seg-mini" title="Prioridade">${[1, 2, 3].map(n => html`<button key=${n} class=${cx('prio-b p' + n, one.prio === n && 'on')} title=${'Prioridade ' + n} onClick=${() => patchSel(() => ({ prio: one.prio === n ? null : n }))}>${n}</button>`)}</span>`}
      ${selEls.filter(x => hasBox(x) && x.t !== 'mind').length > 1 && html`<span class="grp">${[['l', 'alL', 'Alinhar à esquerda'], ['c', 'alC', 'Centralizar'], ['r', 'alR', 'Alinhar à direita'], ['t', 'alT', 'Alinhar em cima'], ['m', 'alM', 'Alinhar no meio'], ['b', 'alB', 'Alinhar embaixo'], ['dh', 'dsH', 'Distribuir na horizontal'], ['dv', 'dsV', 'Distribuir na vertical']].map(([m, ic, l]) => B(ic, l, () => alignSel(m)))}</span>`}
      ${one && one.t === 'frame' && html`<button class="btn sm" onClick=${() => present(frames.findIndex(f => f.id === one.id))}><${Icon} n="play" s=${13} />Apresentar daqui</button>`}
      ${has(x => x.t === 'sticky') && html`<button class="btn sm" onClick=${toTask}><${Icon} n="tasks" s=${13} />Virar tarefa</button>`}
      <span class="grp">${B(all(x => x.locked) ? 'unlock' : 'lock', all(x => x.locked) ? 'Destravar' : 'Travar no lugar', () => { const L = all(x => x.locked); patchSel(() => ({ locked: !L })); })}${B('front', 'Trazer para a frente', () => reorder(true))}${B('back', 'Mandar para trás', () => reorder(false))}${B('copy', 'Duplicar (⌘D)', duplicate)}${B('trash', 'Apagar (Delete)', remove)}</span>
    </div>`}

    ${pres == null && html`<div class="wb-tools wb-ui" role="toolbar" aria-label="Ferramentas" onPointerDown=${e => e.stopPropagation()}>
      ${me && me.copilot && html`<button class=${cx('tl ai', ai && 'on')} title="Desenhar com IA: fale, escreva ou mande uma foto" aria-label="Desenhar com IA" onClick=${() => setAi(!ai)}><${Icon} n="sparkle" s=${18} /></button>`}
      ${TOOLS8.map(([k2, ic, l, key]) => { const on = k2 === 'tpl' ? panel === 'tpl' : k2 === 'more' ? panel === 'more' || tool === 'stamp' : tool === k2; const icn = k2 === 'shape' ? SHAPE_IC[opt.shape] : k2 === 'pen' ? (opt.pen === 'hl' ? 'hl' : opt.pen === 'eraser' ? 'eraser' : 'pen') : ic;
        return html`<button key=${k2} class=${cx('tl', on && 'on')} aria-pressed=${on} title=${key ? `${l} (${key})` : l} aria-label=${l} onClick=${() => pick(k2)}><${Icon} n=${icn} s=${18} /></button>`; })}
      <span class="tl-sep h"></span>
      <button class="tl" title="Desfazer (⌘Z)" aria-label="Desfazer" disabled=${!hist.current.length} onClick=${undo}><${Icon} n="undo" s=${18} /></button>
      <button class="tl" title="Refazer (⇧⌘Z)" aria-label="Refazer" disabled=${!fut.current.length} onClick=${redo}><${Icon} n="redo" s=${18} /></button>
      ${tool === 'sticky' && html`<div class="wb-fly" style=${flyTop(toolIdx('sticky') + (me && me.copilot ? 1 : 0))}>${Object.keys(STICKY).map(c => Sw(STICKY[c], opt.color === c, () => setOpt({ color: c }), 'Post-it ' + c))}</div>`}
      ${tool === 'shape' && html`<div class="wb-fly" style=${flyTop(toolIdx('shape') + (me && me.copilot ? 1 : 0))}>${SHAPE_T.map(s => B(SHAPE_IC[s], SHAPE_L[s], () => setOpt({ shape: s }), opt.shape === s))}</div>`}
      ${tool === 'line' && html`<div class="wb-fly" style=${flyTop(toolIdx('line') + (me && me.copilot ? 1 : 0))}>${[['straight', 'lnS', 'Reta'], ['curve', 'lnC', 'Curva'], ['elbow', 'lnE', 'Em ângulo']].map(([v, ic, l]) => B(ic, l, () => setOpt({ line: v }), opt.line === v))}<span class="tl-sep"></span>${[['none', 'hdN', 'Sem seta'], ['end', 'hdE', 'Seta no fim'], ['both', 'hdB', 'Seta nas duas pontas']].map(([v, ic, l]) => B(ic, l, () => setOpt({ head: v }), opt.head === v))}${B('dash', 'Tracejada', () => setOpt({ dash: !opt.dash }), opt.dash)}</div>`}
      ${tool === 'pen' && html`<div class="wb-fly" style=${flyTop(toolIdx('pen') + (me && me.copilot ? 1 : 0))}>${B('pen', 'Caneta', () => setOpt({ pen: 'pen' }), opt.pen === 'pen')}${B('hl', 'Marca-texto', () => setOpt({ pen: 'hl' }), opt.pen === 'hl')}${B('eraser', 'Borracha (E)', () => setOpt({ pen: 'eraser' }), opt.pen === 'eraser')}<span class="tl-sep"></span>${WB_INK.slice(0, 4).map(c => Sw(c, opt.ink === c, () => setOpt({ ink: c, pen: opt.pen === 'eraser' ? 'pen' : opt.pen }), 'Cor da caneta', true))}</div>`}
      ${(panel === 'more' || tool === 'stamp') && html`<div class="wb-fly col" style=${flyTop(toolIdx('more') + (me && me.copilot ? 1 : 0) - 2)}>
        <button class="btn sm ghost" onClick=${() => { setPanel(null); fileRef.current.click(); }}><${Icon} n="image" s=${15} />Imagem</button>
        <button class="btn sm ghost" onClick=${() => { setLinkV(''); setPanel('link'); }}><${Icon} n="link" s=${15} />Link</button>
        <span class="lbl">Carimbos</span><div class="stamps">${STAMPS.map(s => html`<button key=${s} class=${cx(tool === 'stamp' && opt.stamp === s && 'on')} title="Clique na lousa para carimbar" onClick=${() => { setOpt({ stamp: s }); setTool('stamp'); setPanel(null); }}>${s}</button>`)}</div></div>`}
      <input type="file" accept="image/*" class="sr" ref=${fileRef} onChange=${e => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (f) addImage(f); }} />
    </div>`}

    ${pres == null && html`<div class="wb-top wb-ui" onPointerDown=${e => e.stopPropagation()}>
      <div class="p-menu"><button class=${cx('btn sm', panel === 'frames' && 'on')} onClick=${() => setPanel(panel === 'frames' ? null : 'frames')}><${Icon} n="frame" s=${14} />Molduras <span class="muted">${frames.length}</span></button>
        ${panel === 'frames' && html`<div class="pop wb-frames">${frames.length ? frames.map((f, i) => html`<button key=${f.id} onClick=${() => { fitFrame(f); setSel([f.id]); setPanel(null); }}><span class="n">${i + 1}</span>${f.title}</button>`) : html`<p class="muted">Nenhuma moldura. Use a ferramenta Moldura (F) para separar o quadro em partes e apresentar uma de cada vez.</p>`}</div>`}</div>
      <button class="btn sm pri" disabled=${!frames.length} title=${frames.length ? 'Apresentar as molduras, uma por tela' : 'Crie uma moldura (F) para apresentar'} onClick=${() => present(0)}><${Icon} n="play" s=${14} />Apresentar</button>
      <div class="p-menu"><button class=${cx('btn sm icon', panel === 'help' && 'on')} aria-label="Atalhos" title="Atalhos do quadro" onClick=${() => setPanel(panel === 'help' ? null : 'help')}><${Icon} n="help" s=${15} /></button>
        ${panel === 'help' && html`<div class="pop wb-help"><b>Atalhos</b><dl>${[['V', 'Selecionar'], ['H ou Espaço', 'Mover a lousa'], ['N', 'Post-it'], ['T', 'Texto'], ['S', 'Formas'], ['L', 'Conector'], ['P / E', 'Caneta e borracha'], ['M', 'Mapa mental'], ['F', 'Moldura'], ['Digitar', 'Escreve no que está selecionado'], ['Tab', 'Próximo post-it, ou tópico filho no mapa mental'], ['Enter / ⇧Enter', 'Tópico irmão depois ou antes'], ['L entre tópicos', 'Relação tracejada no mapa mental'], ['Setas', 'Andar pelo mapa mental ou mover'], ['⌘Z / ⇧⌘Z', 'Desfazer e refazer'], ['⌘C / ⌘V', 'Copiar e colar, inclusive imagem e link'], ['⌘D', 'Duplicar'], ['⌘A', 'Selecionar tudo'], ['⇧⌘L', 'Travar no lugar'], ['PgUp / PgDn', 'Frente e trás'], ['⌥1', 'Enquadrar tudo'], ['⌘ + rolagem', 'Zoom']].map(([a, b]) => html`<dt key=${a}>${a}</dt><dd>${b}</dd>`)}</dl></div>`}</div>
    </div>`}

    ${panel === 'link' && html`<form class="wb-linkask wb-ui" onPointerDown=${e => e.stopPropagation()} onSubmit=${e => { e.preventDefault(); const u = linkV.trim(); if (!u) return; addLink(/^(https?:)/.test(u) ? u : 'https://' + u); setPanel(null); }}><${Icon} n="link" s=${15} /><input class="inp" ref=${autoF} placeholder="Cole um link: YouTube, Google Docs, Drive, Figma…" value=${linkV} onInput=${e => setLinkV(e.target.value)} /><button class="btn pri sm" type="submit" disabled=${!linkV.trim()}>Pôr no quadro</button><button type="button" class="btn sm icon ghost" aria-label="Fechar" onClick=${() => setPanel(null)}><${Icon} n="x" s=${14} /></button></form>`}

    ${panel === 'tpl' && html`<div class="wb-tpl wb-ui" onPointerDown=${e => e.stopPropagation()}><div class="wb-tpl-h"><b>Modelos</b><span class="muted">Entram ao lado do que já está no quadro.</span><button class="btn sm icon ghost" aria-label="Fechar" onClick=${() => setPanel(null)}><${Icon} n="x" s=${15} /></button></div>
      <div class="wb-tpl-grid">${WB_TPL.map(t => html`<button key=${t.k} class="wb-tpl-card" onClick=${() => insertTpl(t)}><span class="bthumb"><${BoardThumb} els=${mindLayout(t.make())} /></span><b>${t.name}</b><small>${t.desc}</small></button>`)}</div></div>`}

    ${ai && html`<${AiPanel} kind="board" onResult=${r => { const list = Array.isArray(r && r.elementos) ? r.elementos.slice(0, 30) : []; if (!list.length) { toast('A IA não devolveu nada para desenhar.'); return; }
        const cur = elsRef.current; const b0 = cur.length ? wbBox(cur) : null; const ox = b0 ? b0.x + b0.w + 140 : 40, oy = b0 ? b0.y : 40; const TT = { postit: 'sticky', texto: 'text', retangulo: 'rect', elipse: 'ellipse' };
        const made = list.map(e2 => { const t = TT[e2.tipo] || 'sticky'; const col = Math.max(0, Math.min(12, Math.round(num(e2.coluna)))), row = Math.max(0, Math.min(20, Math.round(num(e2.linha)))); const x = ox + col * 250, y = oy + (row === 0 ? 0 : 60 + (row - 1) * 160);
          return t === 'text' ? { id: uid('e'), t, x, y, w: 230, h: 40, text: String(e2.texto || '').slice(0, 120), size: 18, bold: true } : { id: uid('e'), t, x, y, w: 190, h: t === 'sticky' ? 130 : 110, color: STICKY[e2.cor] ? e2.cor : 'sand', fill: 'white', text: String(e2.texto || '').slice(0, 200) }; });
        const arrows = (Array.isArray(r.setas) ? r.setas : []).map(a => [made[Math.round(num(a.de))], made[Math.round(num(a.para))]]).filter(([a, b]) => a && b && a !== b).map(([a, b]) => ({ id: uid('e'), t: 'arrow', from: a.id, to: b.id, style: 'curve', head: 'end' }));
        save([...cur, ...made, ...arrows], cur); setSel(made.map(m => m.id)); requestAnimationFrame(fit); toast(`${plural(made.length, 'elemento desenhado', 'elementos desenhados')} pela IA`); }} close=${() => setAi(false)} />`}

    ${pres == null && mini && els.length > 0 && html`<${WbMini} els=${els} vp=${vp} box=${box} onNav=${(wx, wy) => setVp(v => ({ ...v, x: box.w / 2 - wx * v.k, y: box.h / 2 - wy * v.k }))} />`}
    ${pres == null && html`<div class="cv-zoom wb-ui"><button class=${cx('tl', mini && 'on')} aria-label="Minimapa" title="Minimapa" onClick=${() => setMini(!mini)}><${Icon} n="map" s=${16} /></button><button class="tl" aria-label="Diminuir zoom" onClick=${() => zoomBy(1 / 1.2)}><${Icon} n="minus" s=${16} /></button><button class="tl pct" onClick=${fit} title="Ajustar à tela">${Math.round(vp.k * 100)}%</button><button class="tl" aria-label="Aumentar zoom" onClick=${() => zoomBy(1.2)}><${Icon} n="plus" s=${16} /></button></div>`}
    ${pres != null && html`<div class="wb-presbar wb-ui"><button class="btn icon" aria-label="Anterior" disabled=${pres === 0} onClick=${() => presGo(-1)}><${Icon} n="chevL" /></button><span><b>${presF && presF.title}</b><small>${pres + 1} de ${frames.length}</small></span><button class="btn icon" aria-label="Próxima" disabled=${pres === frames.length - 1} onClick=${() => presGo(1)}><${Icon} n="chevR" /></button><button class="btn" onClick=${() => setPres(null)}>Sair (Esc)</button></div>`}
  </div>`;
}
function WbMini({ els, vp, box, onNav }) {
  const W = 190, Hh = 124; const vis = els.filter(e => !e.hid); const b = wbBox(vis); const view = { x: -vp.x / vp.k, y: -vp.y / vp.k, w: box.w / vp.k, h: box.h / vp.k };
  const x1 = Math.min(b.x, view.x), y1 = Math.min(b.y, view.y), x2 = Math.max(b.x + b.w, view.x + view.w), y2 = Math.max(b.y + b.h, view.y + view.h); const s = Math.min(W / (x2 - x1), Hh / (y2 - y1));
  const X = x => (x - x1) * s, Y = y => (y - y1) * s; const drag = useRef(false);
  const nav = e => { const r = e.currentTarget.getBoundingClientRect(); onNav((e.clientX - r.left) / s + x1, (e.clientY - r.top) / s + y1); };
  return html`<svg class="wb-mini wb-ui" width=${W} height=${Hh} onPointerDown=${e => { e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); drag.current = true; nav(e); }} onPointerMove=${e => drag.current && nav(e)} onPointerUp=${() => { drag.current = false; }} aria-label="Minimapa">
    ${vis.map(e => hasBox(e) ? html`<rect key=${e.id} x=${X(e.x)} y=${Y(e.y)} width=${Math.max(1.5, e.w * s)} height=${Math.max(1.5, e.h * s)} rx="1" fill=${e.t === 'frame' ? 'none' : e.t === 'sticky' ? STICKY[e.color] || STICKY.sand : e.t === 'mind' ? (e.lv === 0 ? '#222831' : e.bc || '#6A655D') : 'var(--line-strong)'} stroke=${e.t === 'frame' ? 'var(--text-3)' : 'none'} stroke-width="1" />` : null)}
    <rect x=${X(view.x)} y=${Y(view.y)} width=${view.w * s} height=${view.h * s} rx="2" class="wb-mini-view" />
  </svg>`;
}
