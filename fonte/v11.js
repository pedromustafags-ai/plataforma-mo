
/* ================= v11: modelos de desenho no quadro, mapa mental dos dois lados, cor livre, funil só com o caminho ================= */
Object.assign(IC, {
  trap: ['M3 5h18l-3 14H6z'], trapU: ['M6 5h12l3 14H3z'],
  swap: ['M7 4 3 8l4 4', 'M3 8h13', 'M17 20l4-4-4-4', 'M21 16H8'],
});
SHAPE_T.push('trap', 'trapU');
Object.assign(SHAPE_L, { trap: 'Trapézio, como funil', trapU: 'Trapézio, como pirâmide' });
Object.assign(SHAPE_IC, { trap: 'trap', trapU: 'trapU' });

/* cor livre: além das bolinhas prontas, qualquer cor, e as últimas escolhidas ficam à mão */
const stickyFill = c => STICKY[c] || (isHex(c) ? c : STICKY.sand);
const fillOf = f => WB_FILL[f] || (isHex(f) ? f : WB_FILL.white);
const darkFill = e => e.t !== 'text' && e.fill !== 'none' && onDarkOf(fillOf(e.fill));
const markOf = c => (c && !WB_INK.includes(c) && isHex(c) ? `url(#wbhc${c.replace('#', '')})` : `url(#wbh${inkIdx(c)})`);
const inkMarks = els => [...new Set(els.filter(a => a.t === 'arrow' && a.ink && !WB_INK.includes(a.ink) && isHex(a.ink)).map(a => a.ink))]
  .map(c => html`<marker key=${'c' + c} id=${'wbhc' + c.replace('#', '')} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill=${c} /></marker>`);
function ColorPick({ value, onPick, label, round }) {
  const [, bump] = useState(0);
  const recent = lsGet('mo.wb.cores', []);
  const cur = isHex(value) ? String(value).toUpperCase() : null;
  const pick = v => { const c = String(v).toUpperCase(); lsSet('mo.wb.cores', [c, ...recent.filter(x => x !== c)].slice(0, 3)); bump(x => x + 1); onPick(c); };
  const free = cur && !recent.includes(cur);
  return html`${recent.map(c => html`<button key=${'r' + c} class=${cx('sw', round && 'dot', cur === c && 'on')} style=${{ background: c }} aria-label=${label + ' ' + c} title=${c} onClick=${() => onPick(c)}></button>`)}<label key="free" class=${cx('sw sw-free', round && 'dot', free && 'on')} style=${free ? { background: cur } : null} title="Outra cor: qualquer uma, pelo seletor ou pelo código"><input type="color" aria-label=${'Outra cor: ' + label.toLowerCase()} value=${cur || '#E4572E'} onChange=${e => pick(e.target.value)} /></label>`;
}

/* mapa mental: os ramos nascem dos dois lados da ideia central, e cada ramo pode trocar de lado */
function mindLayout(els) {
  if (!els.some(e => e.t === 'mind')) return els;
  const map = {}; els.forEach(e => { if (e.t === 'mind') map[e.id] = { ...e }; });
  const kids = {}; Object.values(map).forEach(n => { if (n.parent && map[n.parent]) (kids[n.parent] = kids[n.parent] || []).push(n); });
  const roots = Object.values(map).filter(n => !n.parent || !map[n.parent]);
  roots.forEach(r => { const ks = kids[r.id] || []; const cnt = { r: 0, l: 0 }; ks.forEach(k => { if (k.side === 'l' || k.side === 'r') cnt[k.side]++; });
    ks.forEach(k => { let s = k.side; if (s !== 'l' && s !== 'r') { s = cnt.l < cnt.r ? 'l' : 'r'; cnt[s]++; } k.dir = s === 'l' ? -1 : 1; }); });
  const sub = {};
  const size = (n, lv, col, dir) => { Object.assign(n, mindSize(n, lv), { lv, bc: lv === 0 ? null : col, dir }); (kids[n.id] || []).forEach((k, i) => size(k, lv + 1, lv === 0 ? (k.color || BRANCH[i % BRANCH.length]) : (k.color || col), lv === 0 ? k.dir : dir)); };
  const H = (n, gy) => { const ks = n.collapsed ? [] : kids[n.id] || []; const tot = ks.reduce((a, k) => a + H(k, gy), 0) + Math.max(0, ks.length - 1) * gy; return (sub[n.id] = Math.max(n.h, tot)); };
  const stack = (ks, gy) => ks.reduce((a, k) => a + sub[k.id], 0) + Math.max(0, ks.length - 1) * gy;
  const place = (n, ax, cy, gx, gy) => { const d = n.dir; n.x = Math.round((d < 0 ? ax - n.w : ax) + (n.ox || 0)); n.y = Math.round(cy - n.h / 2 + (n.oy || 0));
    const ks = n.collapsed ? [] : kids[n.id] || []; let y = n.y + n.h / 2 - stack(ks, gy) / 2;
    ks.forEach(k => { place(k, d < 0 ? n.x - gx : n.x + n.w + gx, y + sub[k.id] / 2, gx, gy); y += sub[k.id] + gy; }); };
  const hide = (n, h) => { n.hid = h; (kids[n.id] || []).forEach(k => hide(k, h || !!n.collapsed)); };
  roots.forEach(r => { const gx = r.gx ?? MIND.hgap, gy = r.gy ?? MIND.vgap; const cy = r.y + (r.h || 40) / 2;
    size(r, 0, null, 0); r.x = Math.round(r.x); r.y = Math.round(cy - r.h / 2);
    const ks = r.collapsed ? [] : kids[r.id] || []; ks.forEach(k => H(k, gy));
    [1, -1].forEach(dir => { const g = ks.filter(k => k.dir === dir); let y = cy - stack(g, gy) / 2; g.forEach(k => { place(k, dir > 0 ? r.x + r.w + gx : r.x - gx, y + sub[k.id] / 2, gx, gy); y += sub[k.id] + gy; }); });
    hide(r, false); });
  return els.map(e => (e.t === 'mind' ? map[e.id] : e));
}
/* o lado de cada ramo fica gravado quando o mapa muda, para nenhum ramo pular de lado sozinho */
function mindFreeze(next, prev) {
  const pd = {}; prev.forEach(e => { if (e.t === 'mind' && e.dir) pd[e.id] = e.dir; });
  const M = {}; next.forEach(e => { if (e.t === 'mind') M[e.id] = e; });
  return next.map(e => (e.t === 'mind' && !e.side && e.parent && M[e.parent] && !M[e.parent].parent && pd[e.id] ? { ...e, side: pd[e.id] < 0 ? 'l' : 'r' } : e));
}

/* modelos de desenho: servem para qualquer cliente */
const P11 = { cream: '#F4EBDD', sand: '#DFD0B8', taupe: '#948979', slate: '#393E46', dark: '#222831' };
const big = (e, size = 17) => Object.assign(e, { size, bold: true });
WB_TPL.splice(2, 0,
  { k: 'funil', name: 'Funil', desc: 'Quatro camadas, da atenção à compra, com o que acontece em cada uma.', make: () => {
    const out = [wbF(0, 0, 1180, 560, 'Funil')]; let w = 660;
    [['Atenção', 'Quem vê a marca pela primeira vez', P11.cream], ['Interesse', 'Quem clica, responde ou pergunta', P11.sand], ['Decisão', 'Quem compara e pede proposta', P11.taupe], ['Compra', 'Quem fecha', P11.dark]].forEach(([t, s, c], i) => {
      const y = 44 + i * 118; out.push(big(wbSh('trap', Math.round(390 - w / 2), y, Math.round(w), 108, t, c), 18), wbT(760, y + 42, s, 15, 380, false)); w *= .76; });
    return out; } },
  { k: 'piramide', name: 'Pirâmide', desc: 'Níveis empilhados, da base que sustenta tudo até o topo.', make: () => {
    const out = [wbF(0, 0, 1060, 540, 'Pirâmide')]; let w = 190, y = 40;
    [['Visão', P11.dark], ['Estratégia', P11.slate], ['Tática', P11.taupe], ['Execução', P11.sand]].forEach(([t, c], i) => {
      if (i) w = Math.round(w / .76); const h = i ? 100 : 124;
      out.push(big(wbSh(i ? 'trapU' : 'tri', Math.round(360 - w / 2), y, w, h, t, c)), wbT(720, y + h / 2 - 12, 'O que entra neste nível', 15, 300, false)); y += h + 8; });
    return out; } },
  { k: 'ciclo', name: 'Ciclo', desc: 'Etapas que se repetem em roda, cada uma levando à seguinte.', make: () => {
    const F = [P11.cream, P11.sand, P11.taupe, P11.slate, P11.dark];
    const n = ['Planejar', 'Produzir', 'Publicar', 'Medir', 'Ajustar'].map((t, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return big(wbSh('ellipse', Math.round(450 + 220 * Math.cos(a) - 85), Math.round(330 + 220 * Math.sin(a) - 42), 170, 84, t, F[i]), 16); });
    return [wbF(0, 0, 900, 640, 'Ciclo'), ...n, ...n.map((x, i) => wbA(x, n[(i + 1) % n.length]))]; } },
  { k: 'etapas', name: 'Processo em etapas', desc: 'Passos numerados da esquerda para a direita, com o que acontece em cada um.', make: () => {
    const c = [0, 1, 2, 3, 4].map(i => big(wbSh('ellipse', 71 + i * 240, 40, 96, 96, String(i + 1), i === 4 ? P11.dark : P11.slate), 26));
    return [wbF(0, 0, 1200, 420, 'Processo em etapas'), ...c, ...c.slice(1).map((x, i) => wbA(c[i], x)), ...c.flatMap((x, i) => [wbT(34 + i * 240, 158, 'Etapa ' + (i + 1), 18, 200, true), wbS(34 + i * 240, 200, 'cream', '', 170, 170)])]; } },
  { k: 'compara', name: 'Comparação', desc: 'Dois lados frente a frente: antes e depois, nós e eles, hoje e amanhã.', make: () => {
    const out = [wbF(0, 0, 900, 600, 'Comparação'), big(wbSh('round', 40, 40, 350, 64, 'Antes', P11.slate), 20), big(wbSh('ellipse', 410, 42, 80, 60, 'vs', P11.sand), 16), big(wbSh('round', 510, 40, 350, 64, 'Depois', P11.dark), 20)];
    [0, 1, 2, 3].forEach(i => out.push(wbS(40, 124 + i * 116, 'pink', '', 350, 102), wbS(510, 124 + i * 116, 'green', '', 350, 102)));
    return out; } },
  { k: 'prioridade', name: 'Matriz de prioridade', desc: 'Impacto contra esforço: o que fazer já, o que planejar e o que deixar de lado.', make: () => {
    const out = [wbF(0, 0, 960, 720, 'Impacto e esforço'), wbT(80, 16, '↑ Mais impacto', 14, 200, true), wbT(770, 668, 'Mais esforço →', 14, 160, true)];
    [['Fazer já', 'Muito impacto, pouco esforço', 'green', 80, 56], ['Planejar', 'Muito impacto, muito esforço', 'blue', 490, 56], ['Se sobrar tempo', 'Pouco impacto, pouco esforço', 'sand', 80, 366], ['Deixar de lado', 'Pouco impacto, muito esforço', 'pink', 490, 366]]
      .forEach(([t, s, c, x, y]) => out.push(wbSh('rect', x, y, 390, 290, '', c), wbT(x + 20, y + 16, t, 20, 330, true), wbT(x + 20, y + 52, s, 14, 330, false)));
    return out; } },
  { k: 'persona', name: 'Persona', desc: 'O cliente ideal: o que quer, o que dói, o que trava a compra e onde encontrá-lo.', make: () => {
    const out = [wbF(0, 0, 1000, 640, 'Persona'), wbSh('ellipse', 40, 40, 110, 110, '', P11.sand), wbT(170, 58, 'Nome, cargo e empresa', 24, 700, true), wbT(170, 104, 'Uma frase que ele diria sobre o problema', 16, 700, false)];
    [['Quem é', 'cream'], ['O que quer', 'green'], ['O que dói', 'pink'], ['O que trava a compra', 'lilac'], ['Onde ele está', 'blue'], ['Como decide', 'sand']]
      .forEach(([t, c], i) => { const x = 40 + (i % 3) * 315, y = 180 + Math.floor(i / 3) * 220; out.push(wbT(x, y, t, 16, 290, true), wbS(x, y + 34, c, '', 290, 160)); });
    return out; } },
);

/* funil: o estilo "só o caminho" desenha etapas e setas, sem número nenhum na tela */
const PN = (id, type, x, y, label) => ({ id, type, x, y, p: {}, label: label || FN[type].label });
const PE = (a, b) => ({ id: 'e' + a + b, from: a, to: b, rate: 100 });
const FNP = (id, title, nodes, edges) => ({ id, clientId: null, title, currency: 'US$', by: 'pedro', at: off(0), style: 'path', note: '', nodes, edges });
const FN_PATH = {
  simples: id => FNP(id, 'Caminho simples', [PN('a', 'meta', 0, 120, 'Anúncio'), PN('b', 'landing', 250, 120, 'Página'), PN('c', 'agente', 500, 120, 'Conversa no WhatsApp'), PN('d', 'reuniao', 750, 120)],
    [PE('a', 'b'), PE('b', 'c'), PE('c', 'd')]),
  caminho: id => FNP(id, 'Caminho com qualificação', [PN('a', 'meta', 0, 40), PN('b', 'organico', 0, 260), PN('c', 'quiz', 250, 150), PN('d', 'agente', 500, 150), PN('e', 'qualificado', 750, 150), PN('f', 'reuniao', 1000, 150), PN('g', 'venda', 1250, 150)],
    [PE('a', 'c'), PE('b', 'c'), PE('c', 'd'), PE('d', 'e'), PE('e', 'f'), PE('f', 'g')]),
  lancamento: id => FNP(id, 'Lançamento', [PN('a', 'meta', 0, 40, 'Anúncio'), PN('b', 'lista', 0, 260), PN('c', 'landing', 250, 150), PN('d', 'webinar', 500, 150), PN('e', 'vendas', 750, 150), PN('f', 'checkout', 1000, 150), PN('g', 'obrigado', 1250, 150)],
    [PE('a', 'c'), PE('b', 'c'), PE('c', 'd'), PE('d', 'e'), PE('e', 'f'), PE('f', 'g')]),
};
const NF_TPL = {
  path: [['simples', 'Caminho simples', 'Anúncio → página → conversa no WhatsApp → reunião'], ['caminho', 'Caminho com qualificação', 'Anúncio e orgânico → quiz → agente → lead qualificado → reunião → venda'], ['lancamento', 'Lançamento', 'Anúncio e lista → captura → webinar → página de vendas → checkout → obrigado']],
  calc: [['qualif', 'Qualificação Imediata', 'Meta e orgânico → quiz → agente no WhatsApp → reunião → venda'], ['vsl', 'VSL com upsell e downsell', 'Anúncio → VSL → checkout → upsell → downsell → obrigado'], ['captura', 'Captura, e-mail e página de vendas', 'Anúncio e orgânico → página de captura → e-mail → página de vendas → checkout']],
};
function NewFunnel({ close, clientId }) {
  const { db, act, go } = useApp();
  const [f, setF] = useState({ title: '', style: 'path', tpl: 'simples', clientId: clientId || '' });
  const L = [...NF_TPL[f.style], ['blank', 'Em branco', 'Comece do zero']];
  const cur = L.find(t => t[0] === f.tpl) || L[0];
  return html`<form onSubmit=${e => { e.preventDefault(); const id = act.addFunnel({ ...f, title: f.title.trim() || (f.tpl === 'blank' ? '' : cur[1]) }); close(); go({ v: 'funnel', id }); }}>
    <div class="mhd"><div><h2>Novo funil</h2><p>Escolha o estilo e um ponto de partida. Dentro do funil dá para trocar de estilo a qualquer hora.</p></div><button type="button" class="btn icon ghost" aria-label="Fechar" onClick=${close}><${Icon} n="x" /></button></div>
    <div class="mbd">
      <div class="nf-style"><div class="seg" role="group" aria-label="Estilo do funil">${[['path', 'Só o caminho'], ['calc', 'Com números']].map(([k, l]) => html`<button type="button" key=${k} class=${cx(f.style === k && 'on')} aria-pressed=${f.style === k} onClick=${() => setF({ ...f, style: k, tpl: NF_TPL[k][0][0] })}>${l}</button>`)}</div>
        <small class="muted">${f.style === 'path' ? 'Etapas e setas, sem número nenhum na tela. Serve para mostrar ao cliente por onde o lead passa.' : 'Cada ligação com a taxa de quem passa e, no fim, quanto custa cada reunião agendada.'}</small></div>
      <div class="tpls">${L.map(([k, l, d]) => html`<button type="button" key=${k} class=${cx('tpl', f.tpl === k && 'on')} aria-pressed=${f.tpl === k} onClick=${() => setF({ ...f, tpl: k })}><b>${l}</b><small>${d}</small></button>`)}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><label class="field"><span>Nome</span><input class="inp" id="nf-name" placeholder=${f.tpl === 'blank' ? 'Funil sem título' : cur[1]} value=${f.title} onInput=${e => setF({ ...f, title: e.target.value })} /></label>
        <label class="field"><span>Cliente</span><select class="sel" id="nf-client" value=${f.clientId} onChange=${e => setF({ ...f, clientId: e.target.value })}><option value="">Modelo interno</option>${db.clients.map(c => html`<option value=${c.id}>${c.name}</option>`)}</select></label></div>
    </div>
    <div class="mft"><button type="button" class="btn ghost" onClick=${close}>Cancelar</button><button class="btn pri" type="submit">Criar funil</button></div>
  </form>`;
}
