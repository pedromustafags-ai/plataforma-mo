import sys

S = open('src.html', encoding='utf-8').read()

def rep(old, new, n=1):
    global S
    c = S.count(old)
    if c != n:
        sys.exit(f'ERRO: esperava {n} ocorrência(s), achei {c}: {old[:90]!r}')
    S = S.replace(old, new)

def drop(name):
    """Tira a função antiga; a versão nova mora no v11.js."""
    global S
    tag = '\nfunction ' + name + '('
    if S.count(tag) != 1:
        sys.exit(f'ERRO: função {name} não encontrada ou repetida')
    a = S.find(tag)
    b = S.find('\n}\n', a + 1)
    if '\nfunction ' in S[a + 1:b]:
        sys.exit(f'ERRO: o fim de {name} não foi achado antes da função seguinte')
    S = S[:a + 1] + S[b + 3:]

# ---------- CSS e bloco novo ----------
css = open('css_v11.txt', encoding='utf-8').read()
rep('\n</style>\n\n<div id="app"></div>', '\n' + css + '</style>\n\n<div id="app"></div>')
for name in ['mindLayout', 'NewFunnel']:
    drop(name)
v11 = open('v11.js', encoding='utf-8').read()
rep("\nrender(html`<${App} />`, document.getElementById('app'));", v11 + "\nrender(html`<${App} />`, document.getElementById('app'));")

# ---------- formas: trapézio de funil e de pirâmide, e fundo de qualquer cor ----------
rep(r"""const fill = e.t === 'text' ? 'none' : (WB_FILL[e.fill] || WB_FILL.white);""",
    r"""const fill = e.t === 'text' ? 'none' : fillOf(e.fill);""")
rep(r"""  if (e.t === 'para') return html`<polygon points=${`${w * .18},0 ${w},0 ${w * .82},${h} 0,${h}`} ...${p} />`;""",
    r"""  if (e.t === 'para') return html`<polygon points=${`${w * .18},0 ${w},0 ${w * .82},${h} 0,${h}`} ...${p} />`;
  if (e.t === 'trap') return html`<polygon points=${`0,0 ${w},0 ${w * .88},${h} ${w * .12},${h}`} ...${p} />`;
  if (e.t === 'trapU') return html`<polygon points=${`${w * .12},0 ${w * .88},0 ${w},${h} 0,${h}`} ...${p} />`;""")
rep(r"""e.t === 'para' ? [e.w * .16, 0, e.w * .68, e.h] : [0, 0, e.w, e.h];""",
    r"""e.t === 'para' ? [e.w * .16, 0, e.w * .68, e.h] : e.t === 'trap' || e.t === 'trapU' ? [e.w * .12, 0, e.w * .76, e.h] : [0, 0, e.w, e.h];""")
rep(r"""desc: 'Tema no centro e ramos coloridos. Tab cria filho, Enter cria irmão, e cada tópico pode ser arrastado para onde você quiser.'""",
    r"""desc: 'Tema no centro e ramos coloridos dos dois lados. Tab cria filho, Enter cria irmão, e cada ramo pode mudar de lado.'""")

# ---------- cor livre: post-it, forma, texto, seta, ramo e caneta ----------
rep('STICKY[e.color] || STICKY.sand', 'stickyFill(e.color)', 3)
rep(r"""${e.t === 'sticky' && Txt(e, 'wb-st-text', { fontSize: stickyFont(e) + 'px', fontWeight: e.bold ? 700 : 500 })}""",
    r"""${e.t === 'sticky' && Txt(e, 'wb-st-text', { fontSize: stickyFont(e) + 'px', fontWeight: e.bold ? 700 : 500, color: onDarkOf(stickyFill(e.color)) ? '#F4EBDD' : null })}""")
rep(r"""${isShape(e) && shapeEl(e, e.fill === 'dark' ? '#222831' : 'var(--text-2)', 1.5, 'wb-shp')}""",
    r"""${isShape(e) && shapeEl(e, darkFill(e) ? fillOf(e.fill) : 'var(--text-2)', 1.5, 'wb-shp')}""")
rep(r"""  const inkFor = e => e.ink || (e.fill === 'dark' ? '#F4EBDD' : e.fill === 'none' || e.t === 'text' ? 'var(--text)' : '#222831');""",
    r"""  const inkFor = e => e.ink || (e.fill === 'none' || e.t === 'text' ? 'var(--text)' : darkFill(e) ? '#F4EBDD' : '#222831');""")
rep(r"""${Txt(e, 'wb-mind wb-m' + Math.min(lv, 2), null)}""",
    r"""${Txt(e, 'wb-mind wb-m' + Math.min(lv, 2), lv === 1 && isHex(e.bc) && !onDarkOf(e.bc) ? { color: '#222831' } : null)}""")
rep(r"""const g = connGeom(e, map); const ii = inkIdx(e.ink); const mk = `url(#wbh${ii})`;""",
    r"""const g = connGeom(e, map); const mk = markOf(e.ink);""")
rep(r"""id=${'wbh' + i} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill=${c} /></marker>`)}""",
    r"""id=${'wbh' + i} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill=${c} /></marker>`)}${inkMarks(els)}""")
rep(r"""'Post-it ' + c))}</span>`}""",
    r"""'Post-it ' + c))}<${ColorPick} label="Post-it" value=${(selEls.find(x => x.t === 'sticky' && isHex(x.color)) || {}).color} onPick=${c => patchSel(() => ({ color: c }), x => x.t === 'sticky')} /></span>`}""")
rep(r"""'Fundo ' + c))}</span>`}""",
    r"""'Fundo ' + c))}<${ColorPick} label="Fundo" value=${(selEls.find(x => isShape(x) && isHex(x.fill)) || {}).fill} onPick=${c => patchSel(() => ({ fill: c }), isShape)} /></span>`}""")
rep(r"""'Cor do ramo', true))}</span>`}""",
    r"""'Cor do ramo', true))}<${ColorPick} label="Cor do ramo" round value=${BRANCH.includes(one.bc) ? null : one.bc} onPick=${c => patchSel(() => ({ color: c }))} /></span>`}""")
rep(r"""'Cor', true))}</span>`}""",
    r"""'Cor', true))}<${ColorPick} label="Cor" round value=${(selEls.find(x => (x.t === 'text' || isShape(x) || x.t === 'arrow') && isHex(x.ink)) || {}).ink} onPick=${c => patchSel(() => ({ ink: c }), x => x.t === 'text' || isShape(x) || x.t === 'arrow')} /></span>`}""")
rep(r"""'Post-it ' + c))}</div>`}""",
    r"""'Post-it ' + c))}<${ColorPick} label="Post-it" value=${opt.color} onPick=${c => setOpt({ color: c })} /></div>`}""")
rep(r"""'Cor da caneta', true))}</div>`}""",
    r"""'Cor da caneta', true))}<${ColorPick} label="Cor da caneta" round value=${opt.ink} onPick=${c => setOpt({ ink: c, pen: opt.pen === 'eraser' ? 'pen' : opt.pen })} /></div>`}""")

# ---------- mapa mental dos dois lados ----------
rep(r"""  const commitEls = next => { next = mindLayout(next); setEls(next);""",
    r"""  const commitEls = next => { next = mindLayout(mindFreeze(next, elsRef.current)); setEls(next);""")
rep(r"""  const mindAdd = (id, mode) => { const L = elsRef.current; const n = L.find(x => x.id === id); if (!n || n.t !== 'mind') return; const parent = mode === 'child' || !n.parent ? n : L.find(x => x.id === n.parent); const el = newMind(parent, ''); el.root = parent.root || parent.id;""",
    r"""  const mindAdd = (id, mode, side) => { const L = elsRef.current; const n = L.find(x => x.id === id); if (!n || n.t !== 'mind') return; const parent = mode === 'child' || !n.parent ? n : L.find(x => x.id === n.parent); const el = newMind(parent, ''); el.root = parent.root || parent.id; if (!parent.parent) el.side = side === 'l' || side === 'r' ? side : mode === 'child' ? undefined : n.dir < 0 ? 'l' : 'r';""")
rep(r"""    if (key === 'ArrowLeft') to = n.parent; else if (key === 'ArrowRight') { const k = mindKids(L, id)[0]; if (k) { if (n.collapsed) mindToggle(id); to = k.id; } }
    else { const sib = n.parent ? mindKids(L, n.parent) : []; const i = sib.findIndex(x => x.id === id); const j = key === 'ArrowUp' ? i - 1 : i + 1; if (sib[j]) to = sib[j].id; }""",
    r"""    if (key === 'ArrowLeft' || key === 'ArrowRight') { const d = key === 'ArrowLeft' ? -1 : 1; if (n.parent && d !== (n.dir || 1)) to = n.parent; else { const k = mindKids(L, id).find(x => !!n.parent || x.dir === d); if (k) { if (n.collapsed) mindToggle(id); to = k.id; } } }
    else { const sib = n.parent ? mindKids(L, n.parent).filter(x => x.dir === n.dir) : []; const i = sib.findIndex(x => x.id === id); const j = key === 'ArrowUp' ? i - 1 : i + 1; if (sib[j]) to = sib[j].id; }""")
rep(r"""const sib = mindKids(L, n.parent); const i = sib.findIndex(x => x.id === id); const j = i + dir;""",
    r"""const sib = mindKids(L, n.parent).filter(x => x.dir === n.dir); const i = sib.findIndex(x => x.id === id); const j = i + dir;""")
rep(r"""if (tg && tg.hasAttribute('data-madd')) { drag.current = null; mindAdd(id, 'child'); return; }""",
    r"""if (tg && tg.hasAttribute('data-madd')) { drag.current = null; mindAdd(id, 'child', tg.getAttribute('data-madd')); return; }""")
rep(r"""        save(L.map(x => (x.id === d.mind ? { ...x, parent: tid, root: nr, ox: 0, oy: 0 } : subt.has(x.id)""",
    r"""        save(L.map(x => (x.id === d.mind ? { ...x, parent: tid, root: nr, ox: 0, oy: 0, side: tg.parent ? x.side : p[0] < tg.x + tg.w / 2 ? 'l' : 'r' } : subt.has(x.id)""")
rep(r"""      const B0 = d.before; const top = new Set(d.sel.filter(""",
    r"""      if (d.mind && !e.altKey) { const n0 = d.before.find(x => x.id === d.mind); const r0 = n0 && d.before.find(x => x.id === n0.parent); if (r0 && !r0.parent) { const nd = n0.x + dx + n0.w / 2 < r0.x + r0.w / 2 ? -1 : 1; if (nd !== (n0.dir || 1)) { save(L.map(x => (x.id === d.mind ? { ...x, side: nd < 0 ? 'l' : 'r', ox: 0, oy: 0 } : x)), d.before); toast(`Ramo passou para o lado ${nd < 0 ? 'esquerdo' : 'direito'}`); return; } } }
      const B0 = d.before; const top = new Set(d.sel.filter(""")
rep(r"""const kidsN = mindKids(els, n.id).length; const cy = n.y + n.h / 2; const x0 = n.x + n.w + px(12);""",
    r"""const kidsN = mindKids(els, n.id).length; const cy = n.y + n.h / 2; const lf = n.dir < 0; const x0 = lf ? n.x - px(12) : n.x + n.w + px(12);""")
rep(r"""${isSel && html`<g data-id=${n.id} data-madd="1" class="wb-madd" transform=${`translate(${x0 + (kidsN ? px(24) : 0)},${cy}) scale(${px(1)})`}><circle r="10" /><path d="M-4.5 0h9M0-4.5v9" /><title>Tópico filho (Tab)</title></g>`}</g>`; })}""",
    r"""${isSel && html`<g data-id=${n.id} data-madd=${n.parent ? '1' : 'r'} class="wb-madd" transform=${`translate(${x0 + (kidsN ? px(lf ? -24 : 24) : 0)},${cy}) scale(${px(1)})`}><circle r="10" /><path d="M-4.5 0h9M0-4.5v9" /><title>${n.parent ? 'Tópico filho (Tab)' : 'Tópico filho à direita'}</title></g>`}${isSel && !n.parent && html`<g data-id=${n.id} data-madd="l" class="wb-madd" transform=${`translate(${n.x - px(12)},${cy}) scale(${px(1)})`}><circle r="10" /><path d="M-4.5 0h9M0-4.5v9" /><title>Tópico filho à esquerda</title></g>`}</g>`; })}""")
rep(r"""${one.parent && html`<button class="btn sm" onClick=${() => mindAdd(one.id, 'sibling')}>Irmão</button>`}</span>""",
    r"""${one.parent && html`<button class="btn sm" onClick=${() => mindAdd(one.id, 'sibling')}>Irmão</button>`}${one.lv === 1 && html`<button class="btn sm" title="Leva o ramo para o outro lado da ideia central" onClick=${() => { const L = elsRef.current; save(L.map(x => (x.id === one.id ? { ...x, side: one.dir < 0 ? 'r' : 'l', ox: 0, oy: 0 } : x)), L); }}><${Icon} n="swap" s=${13} />Outro lado</button>`}</span>""")
rep(r"""['⌥ + arrastar', 'Só move o tópico, sem trocar de pai'],""",
    r"""['⌥ + arrastar', 'Só move o tópico, sem trocar de pai'], ['Ramo para o outro lado', 'Arraste por cima da ideia central, ou use Outro lado'],""")

# ---------- funil: só o caminho, ou com os números ----------
rep(r"""    addFunnel: f => { const id = uid('f'); const base = f.tpl === 'vsl' ? tplVSL(id, null) : f.tpl === 'captura' ? tplCaptura(id, null) : f.tpl === 'qualif' ? tplQualif(id, null) : { currency: 'US$', nodes: [], edges: [], note: '' };
      const title = f.title.trim() || (f.tpl === 'vsl' ? 'VSL com upsell e downsell' : f.tpl === 'qualif' ? 'Funil de vendas' : 'Funil sem título');
      commit(d => d.funnels.unshift({ ...base, id, clientId: f.clientId || null, tpl: false, title, by: me ? me.id : 'pedro', at: off(0) }), 'Funil criado'); return id; },""",
    r"""    addFunnel: f => { const id = uid('f'); const base = FN_PATH[f.tpl] ? FN_PATH[f.tpl](id) : f.tpl === 'vsl' ? tplVSL(id, null) : f.tpl === 'captura' ? tplCaptura(id, null) : f.tpl === 'qualif' ? tplQualif(id, null) : { currency: 'US$', nodes: [], edges: [], note: '' };
      const title = f.title.trim() || base.title || 'Funil sem título';
      commit(d => d.funnels.unshift({ ...base, id, clientId: f.clientId || null, tpl: false, style: f.style === 'path' ? 'path' : 'calc', title, by: me ? me.id : 'pedro', at: off(0) }), 'Funil criado'); return id; },""")
rep(r"""    tplCaptura('f3', null),
  ];""",
    r"""    tplCaptura('f3', null),
    { ...FN_PATH.caminho('f4'), clientId: 'mo', title: 'Caminho do lead, para mostrar ao cliente', at: off(-2) },
  ];""")
rep(r"""<span>${c.t.meetings ? `${money(c.t.cpMeet, f.currency)} por reunião` : c.t.revenue ?""",
    r"""<span>${f.style === 'path' ? `Só o caminho · ${plural(f.nodes.length, 'etapa')}` : c.t.meetings ? `${money(c.t.cpMeet, f.currency)} por reunião` : c.t.revenue ?""")
rep(r"""      <label class="sr" for="fn-cur">Moeda</label><select id="fn-cur" class="sel" style="width:auto;height:30px;font-size:13px" value=${f.currency} onChange=${e => act.setFunnel(f.id, { currency: e.target.value })}><option value="US$">US$</option><option value="R$">R$</option><option value="€">€</option></select>""",
    r"""      <div class="seg fn-mode" role="group" aria-label="Estilo do funil">${[['path', 'Só o caminho', 'Etapas e setas, sem número nenhum. Bom para apresentar ao cliente.'], ['calc', 'Com números', 'Taxas, custo por reunião agendada e previsão do mês.']].map(([k, l, t]) => html`<button key=${k} class=${cx((f.style || 'calc') === k && 'on')} aria-pressed=${(f.style || 'calc') === k} title=${t} onClick=${() => act.setFunnel(f.id, { style: k })}>${l}</button>`)}</div>
      ${f.style !== 'path' && html`<label class="sr" for="fn-cur">Moeda</label><select id="fn-cur" class="sel" style="width:auto;height:30px;font-size:13px" value=${f.currency} onChange=${e => act.setFunnel(f.id, { currency: e.target.value })}><option value="US$">US$</option><option value="R$">R$</option><option value="€">€</option></select>`}""")
rep(r"""const calc = computeFunnel(nodes, edges); const cur = f.currency;""",
    r"""const calc = computeFunnel(nodes, edges); const cur = f.currency; const path = f.style === 'path';""")
rep(r"""              <g transform=${`translate(${g.mx - w / 2},${g.my - 12})`}><rect width=${w} height="24" rx="12" class=${cx('fn-lab', on && 'on')} /><text x=${w / 2} y="16" text-anchor="middle" class="fn-lab-t">${lab}</text></g></g>`; })}""",
    r"""              ${!path && html`<g transform=${`translate(${g.mx - w / 2},${g.my - 12})`}><rect width=${w} height="24" rx="12" class=${cx('fn-lab', on && 'on')} /><text x=${w / 2} y="16" text-anchor="middle" class="fn-lab-t">${lab}</text></g>`}</g>`; })}""")
rep(r"""metric=${metric(n)} leak=${leakOf(n)} />""",
    r"""metric=${path ? null : metric(n)} leak=${path ? null : leakOf(n)} />""")
rep(r"""${calc.cycle && html`<div class="cv-warn">""",
    r"""${calc.cycle && !path && html`<div class="cv-warn">""")
rep(r"""      <div class="fn-forecast" aria-label="Previsão do mês">""",
    r"""      ${!path && html`<div class="fn-forecast" aria-label="Previsão do mês">""")
rep("""      </div>\n    </div>\n    <aside class="fn-insp">""",
    """      </div>`}\n    </div>\n    <aside class="fn-insp">""")
rep(r"""          ${FN[sn.type].kind === 'traffic' && (FN[sn.type].paid ?""",
    r"""          ${!path && FN[sn.type].kind === 'traffic' && (FN[sn.type].paid ?""")
rep(r"""          ${FN[sn.type].kind === 'buy' && html`<div class="two">""",
    r"""          ${!path && FN[sn.type].kind === 'buy' && html`<div class="two">""")
rep(r"""          ${FN[sn.type].kind === 'talk' && html`<label class="field"><span>Custo por conversa""",
    r"""          ${!path && FN[sn.type].kind === 'talk' && html`<label class="field"><span>Custo por conversa""")
rep(r"""<div class="insp-stat"><span>Chegam aqui</span><b>${nf(calc.vol[sn.id] || 0, 1)} /mês</b></div>""",
    r"""${!path && html`<div class="insp-stat"><span>Chegam aqui</span><b>${nf(calc.vol[sn.id] || 0, 1)} /mês</b></div>`}""")
rep(r"""<input class="inp" aria-label=${'Taxa para ' + (by[e.to] ? by[e.to].label : '')} inputmode="decimal" value=${e.rate} onChange=${ev => setEdge(e.id, { rate: ev.target.value })} /><span class="muted">%</span>""",
    r"""${!path && html`<input class="inp" aria-label=${'Taxa para ' + (by[e.to] ? by[e.to].label : '')} inputmode="decimal" value=${e.rate} onChange=${ev => setEdge(e.id, { rate: ev.target.value })} /><span class="muted">%</span>`}""")
rep(r"""          <label class="field"><span>Quantos passam (%)</span><input class="inp" id="fn-rate" inputmode="decimal" value=${se.rate} onChange=${e => setEdge(se.id, { rate: e.target.value })} /></label>
          <div class="insp-stat"><span>Passam por mês</span><b>${nf(calc.flow[se.id] || 0, 1)}</b></div>""",
    r"""          ${!path && html`<label class="field"><span>Quantos passam (%)</span><input class="inp" id="fn-rate" inputmode="decimal" value=${se.rate} onChange=${e => setEdge(se.id, { rate: e.target.value })} /></label>
          <div class="insp-stat"><span>Passam por mês</span><b>${nf(calc.flow[se.id] || 0, 1)}</b></div>`}""")
rep(r"""      : html`<div class="sec" style="gap:12px"><span class="label">Como usar</span>""",
    r"""      : path ? html`<div class="sec" style="gap:12px"><span class="label">Como usar</span>
          <ul class="tips"><li>Clique numa etapa à esquerda (ou arraste) para pôr no funil.</li><li>Puxe a bolinha à direita de uma etapa até outra para ligar.</li><li>Clique numa página para trocar o esboço pelo print da página real.</li><li>Espaço + arrastar move a tela, ⌘ + rolagem dá zoom.</li></ul>
          <div class="callout-s"><${Icon} n="info" s=${15} /><span>Este funil mostra só o caminho, sem número nenhum na tela. Para planejar custo e reuniões, troque para Com números no topo.</span></div></div>`
      : html`<div class="sec" style="gap:12px"><span class="label">Como usar</span>""")
rep(r"""<small>${metric}</small>""",
    r"""${metric ? html`<small>${metric}</small>` : null}""")

open('src.html', 'w', encoding='utf-8').write(S)
print('integrate11 ok')
