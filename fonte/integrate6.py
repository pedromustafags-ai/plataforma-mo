p='src.html'; s=open(p,encoding='utf-8').read()
v6=open('v6.js',encoding='utf-8').read(); css=open('css_v6.txt',encoding='utf-8').read(); fn=open('fn_v6.txt',encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt, ('COUNT', s.count(a), a[:120]); s=s.replace(a,b)
def cut(start,end,new,keep_end=True):
    global s
    i=s.index(start); j=s.index(end,i); s=s[:i]+new+(s[j:] if keep_end else s[j+len(end):])
# 1. catálogo de etapas
cut('const FN = {\n', 'const KIND_TONE', fn)
rep("const KIND_TONE = { traffic: 'prog', page: 'cli', buy: 'ok', talk: 'adj', lead: 'neu', meeting: 'ok' };", "const KIND_TONE = { traffic: 'prog', page: 'cli', buy: 'ok', talk: 'adj', lead: 'neu', meeting: 'ok', note: 'neu' };")
# 2. edgePath e FunnelThumb antigos saem (os novos estão no v6)
cut('function edgePath(a, b) {', '\n', '', keep_end=False)
cut('function FunnelThumb({ f }) {', '\nfunction FunnelPage', '')
# 3. editor: enquadrar pela área real de cada etapa
rep("const xs = nRef.current.map(n => n.x), ys = nRef.current.map(n => n.y); const x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) + NW - x0, h = Math.max(...ys) + NH - y0;",
    "const G = nRef.current.map(geo); const x0 = Math.min(...G.map(g => g.box[0])), y0 = Math.min(...G.map(g => g.box[1])), w = Math.max(...G.map(g => g.box[0] + g.box[2])) - x0, h = Math.max(...G.map(g => g.box[1] + g.box[3])) - y0;")
rep("T.kind === 'talk' ? { cost: '' } : {} }; setN([...nRef.current, n]);", "T.kind === 'talk' ? { cost: '' } : T.kind === 'note' ? { text: '' } : {} }; setN([...nRef.current, n]);")
rep("const t = nRef.current.find(n => p[0] >= n.x && p[0] <= n.x + NW && p[1] >= n.y && p[1] <= n.y + NH); if (t && t.id !== d.from && !eRef.current",
    "const t = nRef.current.find(n => FN[n.type].kind !== 'note' && inBox(geo(n), p[0], p[1])); if (t && t.id !== d.from && FN[by[d.from].type].kind !== 'note' && !eRef.current")
rep("  const groups = [...new Set(Object.values(FN).map(t => t.g))];\n  const sn = sel",
    "  const leakOf = n => { if (FN[n.type].kind === 'note') return null; const out = edges.filter(e => e.from === n.id); const sum = out.reduce((a, e) => a + num(e.rate), 0); return out.length && sum < 100 ? `${nf(100 - sum)}% não seguem` : null; };\n  const sn = sel")
cut('    <aside class="fn-pal" aria-label="Etapas">', '\n', '    <${FnPalette} onAdd=${addNode} />', keep_end=True)
rep('        <defs><pattern id="fngrid"', '        <${FnDefs} />\n        <defs><pattern id="fngrid"')
rep("html`<path d=${edgePath(by[link.from], { x: link.x, y: link.y - NH / 2 }).d} class=\"fn-line on\" fill=\"none\" />`", "html`<path d=${linkPath(by[link.from], link.x, link.y)} class=\"fn-line on\" fill=\"none\" />`")
cut('          ${nodes.map(n => { const Tt = FN[n.type];', '\n        </g>\n      </svg>', "          ${nodes.map(n => html`<${FnNode} key=${n.id} n=${n} on=${!!(sel && sel.k === 'node' && sel.id === n.id)} metric=${metric(n)} leak=${leakOf(n)} />`)}")
rep("const T = FN[type]; const n = { id: uid('n'), type, x: Math.round(p[0]), y: Math.round(p[1]),", "const T = FN[type]; if (!at) for (let i = 0; i < 24 && nRef.current.some(m => boxHit(geo(m), geo({ type, x: p[0], y: p[1] }))); i++) p[0] += 60; const n = { id: uid('n'), type, x: Math.round(p[0]), y: Math.round(p[1]),")
# 4. painel lateral
rep("<div class=\"insp-h\"><span class=${'fn-ic t-' + KIND_TONE[FN[sn.type].kind]}><${Icon} n=${FN[sn.type].ic} s=${15} /></span>", "<div class=\"insp-h\"><${Mini} type=${sn.type} s=${34} />")
rep("""          <label class="field"><span>Nome</span><input class="inp" id="fn-name" value=${sn.label} onChange=${e => setNode(sn.id, { label: e.target.value })} /></label>""",
"""          ${FN[sn.type].kind === 'note' ? html`<label class="field"><span>Texto da nota</span><textarea class="ta" id="fn-note" rows="5" style="height:auto;padding:8px 11px;resize:vertical" value=${sn.p.text || ''} onChange=${e => setNode(sn.id, { p: { text: e.target.value } })}></textarea></label>`
            : html`<label class="field"><span>Nome</span><input class="inp" id="fn-name" value=${sn.label} onChange=${e => setNode(sn.id, { label: e.target.value })} /></label>`}
          ${FN[sn.type].sh === 'page' && html`<div class="field"><span>Desenho da página</span><div style="display:flex;gap:8px;flex-wrap:wrap"><label class="btn sm"><${Icon} n="image" s=${14} />${sn.p.shot ? 'Trocar o print' : 'Usar print da página'}<input type="file" accept="image/*" class="sr" onChange=${async e => { const file = e.target.files && e.target.files[0]; e.target.value = ''; if (file) setNode(sn.id, { p: { shot: await fileToUrl(file) } }); }} /></label>${sn.p.shot && html`<button class="btn sm ghost" onClick=${() => setNode(sn.id, { p: { shot: null } })}>Voltar ao esboço</button>`}</div><small class="muted">Sem print, o funil mostra o esboço desse tipo de página.</small></div>`}""")
rep("""<small class="muted">Mensagem do WhatsApp mais a IA. Entra no custo por reunião.</small>""", """<small class="muted">${FN[sn.type].brand === 'whatsapp' ? 'Mensagem do WhatsApp mais a IA. ' : ''}Entra no custo por reunião.</small>""")
a='          <div class="insp-stat"><span>Chegam aqui</span>'
b='          <button class="btn sm ghost danger" style="align-self:flex-start" onClick=${del}><${Icon} n="trash" s=${14} />Apagar etapa</button>'
i=s.index(a); j=s.index(b,i); chunk=s[i:j].rstrip('\n')
s=s[:i]+"          ${FN[sn.type].kind !== 'note' && html`"+chunk.strip()+"`}\n"+s[j:]
rep("Puxe a bolinha da direita do cartão até outra etapa para ligar.", "Puxe a bolinha à direita desta etapa até outra para ligar.")
rep("<li>Puxe a bolinha da direita de um cartão até outro para ligar.</li>", "<li>Puxe a bolinha à direita de uma etapa até outra para ligar.</li><li>Clique numa página para trocar o esboço pelo print da página real.</li>")
# 5. IA, layout e modelos
rep("Tipos de etapa disponíveis (use só estes códigos): ${Object.entries(FN).map(", "Tipos de etapa disponíveis (use só estes códigos): ${Object.entries(FN).filter(([, t]) => t.kind !== 'note').map(")
rep("return { x: d * 250, y: (r - 1) * 150 }; });", "return { x: d * 250, y: (r - 1) * 230 }; });")
rep("N('v4', 'upsell', 750, 30, { conv: 25, price: 197 }), N('v5', 'downsell', 1000, 220, { conv: 20, price: 47 })", "N('v4', 'upsell', 750, -40, { conv: 25, price: 197 }), N('v5', 'downsell', 1000, 260, { conv: 20, price: 47 })")
rep("f.tpl === 'vsl' ? tplVSL(id, null) : f.tpl === 'qualif' ? tplQualif(id, null) :", "f.tpl === 'vsl' ? tplVSL(id, null) : f.tpl === 'captura' ? tplCaptura(id, null) : f.tpl === 'qualif' ? tplQualif(id, null) :")
rep("['vsl', 'VSL com upsell e downsell', 'Anúncio → VSL → checkout → upsell → downsell → obrigado'], ['blank',", "['vsl', 'VSL com upsell e downsell', 'Anúncio → VSL → checkout → upsell → downsell → obrigado'], ['captura', 'Captura, e-mail e página de vendas', 'Anúncio e orgânico → página de captura → e-mail → página de vendas → checkout'], ['blank',")
rep("    tplVSL('f2', null),\n  ];", "    tplVSL('f2', null),\n    tplCaptura('f3', null),\n  ];")
rep("<${Icon} n=\"trash\" s=${14} />Apagar etapa</button>", "<${Icon} n=\"trash\" s=${14} />${FN[sn.type].kind === 'note' ? 'Apagar nota' : 'Apagar etapa'}</button>")
# 6. módulo e estilo
rep("render(html`<${App} />`, document.getElementById('app'));", v6+"\nrender(html`<${App} />`, document.getElementById('app'));")
rep("</style>", css+"</style>")
open(p,'w',encoding='utf-8').write(s); print('ok')
