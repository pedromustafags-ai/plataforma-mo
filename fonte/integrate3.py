import re
p='src.html'; s=open(p,encoding='utf-8').read()
v3=open('v3.js',encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    assert a in s, ('MISSING', a[:120]); s=s.replace(a,b,cnt)
def cut(start, end, new):
    global s
    i=s.index(start); j=s.index(end, i); s=s[:i]+new+s[j:]

# ---------- CSS
rep(".side{background:var(--side-bg);color:var(--side-text);display:flex;flex-direction:column;gap:2px;padding:16px 10px 12px;overflow-y:auto;--logo-c:#DFD0B8;--logo-m:#222831;--logo-w:#F2F0EF}",
    ".side{background:var(--side-bg);color:var(--side-text);display:flex;flex-direction:column;gap:2px;padding:16px 10px 12px;overflow-y:auto;--logo-c:var(--side-logo-c);--logo-m:var(--side-logo-m);--logo-w:var(--side-logo-w)}")
rep("z-index:20;--logo-c:#DFD0B8;--logo-m:#222831;--logo-w:#F2F0EF}", "z-index:20;--logo-c:var(--side-logo-c);--logo-m:var(--side-logo-m);--logo-w:var(--side-logo-w)}")
rep(".nav .n{margin-left:auto;font:500 11px/1 var(--mono);color:#222831;background:#DFD0B8;border-radius:10px;padding:3px 6px}", ".nav .n{margin-left:auto;font:500 11px/1 var(--mono);color:var(--side-badge-fg);background:var(--side-badge-bg);border-radius:10px;padding:3px 6px}")
rep(".search-btn:hover{border-color:#48505A;color:var(--side-strong)}", ".search-btn:hover{border-color:var(--side-line-strong);color:var(--side-strong)}")
rep(".me .av{background:#393E46;color:#DFD0B8;border-color:#48505A}", ".me .av{background:var(--side-active);color:var(--side-strong);border-color:var(--side-line-strong)}")
rep(".act-btn:hover{color:var(--side-strong);border-color:#48505A}", ".act-btn:hover{color:var(--side-strong);border-color:var(--side-line-strong)}")
rep(".act-btn.cp.on{background:#DFD0B8;color:#222831;border-color:#DFD0B8}", ".act-btn.cp.on{background:var(--side-badge-bg);color:var(--side-badge-fg);border-color:var(--side-badge-bg)}")
s=re.sub(r"\.p-ask\{[^\n]*\n", "", s); s=re.sub(r"@container portal \(max-width:680px\)\{\.p-ask\{[^\n]*\n", "", s)
s=s.replace("</style>", open('css_v3.txt',encoding='utf-8').read()+"</style>",1)

# ---------- idioma e modelos
rep("const LOC = l => (l === 'en' ? 'en-US' : 'pt-BR');", "const LOC = l => ({ en: 'en-US', es: 'es-ES', fr: 'fr-FR' }[l] || 'pt-BR');")
cut("function tplPages(clientId, lang) {", "const ONB = ", """function tplPages(clientId, lang) {
  const t = TPL[lang] || TPL.pt;
  return [
    { id: uid('pg'), clientId, kind: 'vendas', tpl: true, title: t.sales, by: 'pedro', at: off(0), blocks: [{ type: 'p', text: t.salesP }, { type: 'h2', text: t.salesH }, { type: 'steps', items: t.steps }] },
    { id: uid('pg'), clientId, kind: 'juntos', tpl: true, title: t.wt, by: 'bruno', at: off(0), blocks: [{ type: 'h2', text: t.h1 }, { type: 'p', text: t.p1 }, { type: 'h2', text: t.h2 }, { type: 'p', text: t.p2 }] },
  ];
}
""")

# ---------- dados
rep("{ id: 'pedro', name: 'Pedro Mustafa', ini: 'PM', role: 'socio', func: 'Marketing e vendas' },", "{ id: 'pedro', name: 'Pedro Mustafa', ini: 'PM', role: 'socio', func: 'Marketing e vendas', copilot: true },")
rep("zero: true, contact: 'Pedro e Bruno',", "zero: true, contact: 'Pedro e Bruno',\n    brand: { logo: null, logoDark: null, colors: ['#222831', '#DFD0B8', '#948979', '#F4EBDD'], primary: '#222831', font: null, theme: { mode: 'light', light: 'areia', dark: 'grafite' } },")
rep("d.clients.push({ id, name: f.name, lang: f.lang, owner: f.owner, contact: f.contact || '—', ", "d.clients.push({ id, name: f.name, lang: f.lang, owner: f.owner, contact: f.contact || '—', brand: { logo: null, logoDark: null, colors: [], primary: null, font: null, theme: { mode: 'light', light: 'papel', dark: 'carvao' } }, ")

# ---------- app: aparência, copiloto, ações
rep("  useEffect(() => { document.body.classList.toggle('cp-open', !!(copilot.open && session && session.role !== 'cliente')); }, [copilot.open, session]);",
    "  useEffect(() => { document.body.classList.toggle('cp-open', !!(copilot.open && session && session.role !== 'cliente' && (db.people.find(x => x.id === session.userId) || {}).copilot)); }, [copilot.open, session]);")
rep("  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));",
"""  const sysDark = useSysDark();
  const [look, setLookS] = useState(() => lsGet('mo.look', { mode: document.documentElement.dataset.theme || 'auto', light: 'areia', dark: 'grafite' }));
  const setLook = v => { setLookS(v); lsSet('mo.look', v); };
  const theme = look.mode === 'auto' ? (sysDark ? 'dark' : 'light') : look.mode;
  const setTheme = m => setLook({ ...look, mode: m });""")
rep("  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);",
    "  useEffect(() => { const root = document.documentElement; root.dataset.theme = theme; const th = THEMES[theme === 'dark' ? look.dark : look.light] || THEMES[theme === 'dark' ? 'grafite' : 'areia']; Object.entries(themeVars(th)).forEach(([k, v]) => root.style.setProperty(k, v)); root.style.colorScheme = theme; }, [theme, look.light, look.dark]);")
rep("    addPage: clientId => {", """    setBrand: (cid, patch) => commit(d => { const c = d.clients.find(x => x.id === cid); c.brand = { ...(c.brand || {}), ...patch }; }),
    setClient: (cid, patch) => commit(d => { Object.assign(d.clients.find(x => x.id === cid), patch); }),
    clientRequest: (cid, title, desc) => commit(d => { const c = d.clients.find(x => x.id === cid); const id = uid('t'); d.tasks.unshift({ id, clientId: cid, title, desc, type: 'interna', req: true, priority: 'media', checklist: [], comments: [], changeReq: false, status: 'todo', due: null, since: off(0), assignee: c.owner }); notify(d, c.owner, 'client', 'fez um pedido:', 'task', id); }),
    addPage: clientId => {""")
rep("e.key.toLowerCase() === 'j' && session && !preview)", "e.key.toLowerCase() === 'j' && me && me.copilot && !preview)")
rep("mainRef, copilot, setCopilot, live, setLive, rail, setRail };", "mainRef, copilot, setCopilot, live, setLive, rail, setRail, look, setLook };")

# ---------- login com a marca do cliente
rep("what: c.lang === 'en' ? 'Vê só a própria área, em inglês.' : 'Vê só a própria área.' })),", "what: 'Vê só o próprio painel' + (c.lang !== 'pt' ? `, em ${LANG_PT[c.lang]}` : '') + '.' })),")
rep("  const [email, setEmail] = useState(''); const [sent, setSent] = useState(false);\n  const enter = s =>", "  const [email, setEmail] = useState(''); const [sent, setSent] = useState(false); const [bl, setBl] = useState(null);\n  const enter = s =>")
rep("  return html`<div class=\"login\"><div class=\"login-box\">", "  const blc = bl && db.clients.find(x => x.id === bl);\n  if (blc) return html`<${BrandedLogin} c=${blc} back=${() => setBl(null)} enter=${() => enter({ role: 'cliente', clientId: blc.id })} />`;\n  return html`<div class=\"login\"><div class=\"login-box\">")
rep("<button class=\"role\" key=${a.name} onClick=${() => enter(a.s)}>", "<button class=\"role\" key=${a.name} onClick=${() => a.c ? setBl(a.c.id) : enter(a.s)}>")

# ---------- casca: copiloto só do Pedro
rep("  const { route, sideOpen, setSideOpen, mainRef, copilot, setCopilot, rail } = useApp();", "  const { route, sideOpen, setSideOpen, mainRef, copilot, setCopilot, rail, me } = useApp();")
rep("<span style=\"flex:1\"></span><button class=\"btn icon\" aria-label=\"Copiloto\" onClick=${() => setCopilot(c => ({ ...c, open: !c.open }))}><${Icon} n=\"sparkle\" s=${18} /></button></div>",
    "<span style=\"flex:1\"></span>${me.copilot && html`<button class=\"btn icon\" aria-label=\"Copiloto\" onClick=${() => setCopilot(c => ({ ...c, open: !c.open }))}><${Icon} n=\"sparkle\" s=${18} /></button>`}</div>")
rep("    ${copilot.open && html`<${Copilot} />`}", "    ${copilot.open && me.copilot && html`<${Copilot} />`}")
rep("return html`<div class=${cx('shell', (rail || full) && 'rail', copilot.open && 'cp')}>", "return html`<div class=${cx('shell', (rail || full) && 'rail', copilot.open && me.copilot && 'cp')}>")
rep("      <button class=${cx('act-btn cp', copilot.open && 'on')} onClick=${() => setCopilot({ ...copilot, open: !copilot.open })} title=\"Copiloto (⌘J)\"><${Icon} n=\"sparkle\" /><span class=\"lb\">Copiloto</span><kbd>⌘J</kbd></button>",
    "      ${me.copilot && html`<button class=${cx('act-btn cp', copilot.open && 'on')} onClick=${() => setCopilot({ ...copilot, open: !copilot.open })} title=\"Copiloto (⌘J)\"><${Icon} n=\"sparkle\" /><span class=\"lb\">Copiloto</span><kbd>⌘J</kbd></button>`}")
rep("      <button class=\"nav\" title=\"Tema\" onClick=${() => setTheme(theme === 'dark' ? 'light' : 'dark')}><${Icon} n=${theme === 'dark' ? 'sun' : 'moon'} /><span class=\"lb\">${theme === 'dark' ? 'Tema claro' : 'Tema escuro'}</span></button>",
    "      <div class=\"p-menu\"><button class=\"nav\" title=\"Aparência\" onClick=${() => setMenu(menu === 'look' ? null : 'look')}><${Icon} n=${theme === 'dark' ? 'moon' : 'sun'} /><span class=\"lb\">Aparência</span></button>${menu === 'look' && html`<${AppearancePop} close=${() => setMenu(null)} />`}</div>")
rep("    L.push(['Ações', 'sparkle', 'Abrir o copiloto', '⌘J', () => setCopilot(c => ({ ...c, open: true }))]);", "    if (me && me.copilot) L.push(['Ações', 'sparkle', 'Abrir o copiloto', '⌘J', () => setCopilot(c => ({ ...c, open: true }))]);")
rep("  const { db, go, open, setPalette, setModal, can, setPreview, theme, setTheme, setCopilot } = useApp();", "  const { db, go, open, setPalette, setModal, can, setPreview, theme, setTheme, setCopilot, me } = useApp();")

# ---------- área do cliente
rep("${c.lang === 'en' ? 'ÁREA EM INGLÊS' : 'ÁREA EM PORTUGUÊS'}", "${'PAINEL EM ' + LANG_PT[c.lang].toUpperCase()}")
rep("<dt>Idioma da área</dt><dd>${c.lang === 'en' ? 'English' : 'Português'}</dd>", "<dt>Idioma do painel</dt><dd>${(LANGS.find(l => l[0] === c.lang) || [0, ''])[1]}</dd>")
rep("['links', 'Links', 'link']];", "['links', 'Links', 'link'], ['brand', 'Marca', 'sliders']];")
rep("    case 'links': view = html`<${LinksTab} c=${c} />`; break;", "    case 'links': view = html`<${LinksTab} c=${c} />`; break;\n    case 'brand': view = html`<${BrandEditor} c=${c} lang=\"pt\" />`; break;")
rep("<small>${p.func}${p.invited ? ' · convite enviado' : ''}</small></span></div>", "<small>${p.func}${p.invited ? ' · convite enviado' : ''}</small></span>${p.copilot && html`<span class=\"tag\" style=\"margin-left:auto\">COPILOTO</span>`}</div>")
rep("        <tbody>${rows.map(r => html`<tr key=${r[0]} style=\"cursor:default\"><td>${r[0]}</td><td>${r[1] ? Y : N}</td><td>${r[2] ? Y : N}</td><td>${r[3] ? Y : N}</td></tr>`)}</tbody></table></div>",
    "        <tbody>${rows.map(r => html`<tr key=${r[0]} style=\"cursor:default\"><td>${r[0]}</td><td>${r[1] ? Y : N}</td><td>${r[2] ? Y : N}</td><td>${r[3] ? Y : N}</td></tr>`)}</tbody></table></div>\n      <p class=\"muted\" style=\"font-size:13px\">O copiloto fica liberado só para o Pedro. Ele roda no plano do Claude dele, sem custo por uso, e os termos da Anthropic não permitem estender esse plano ao time.</p>")

# ---------- mensagens em 4 idiomas + WhatsApp por link
cut("  const text = kind === 'invite'", "  const parts = text", "  const M = MSG[c.lang] || MSG.pt;\n  const text = kind === 'invite' ? M.invite(who) : M.remind(who, n);\n")
rep("Mensagem pro WhatsApp, em ${en ? 'inglês' : 'português'}</span>", "Mensagem pro WhatsApp, em ${LANG_PT[c.lang]}</span>")
rep("<button class=\"btn pri\" onClick=${() => copyText(text, ok =>", "<a class=\"btn\" href=${'https://wa.me/?text=' + encodeURIComponent(text)} target=\"_blank\" rel=\"noopener\" style=\"text-decoration:none\"><${Icon} n=\"msg\" s=${14} />Abrir no WhatsApp</a><button class=\"btn pri\" onClick=${() => copyText(text, ok =>")
rep("  const en = c.lang === 'en';\n  const n = [...db.posts", "  const n = [...db.posts")
# ---------- novo cliente com 4 idiomas
rep("<div class=\"seg\" style=\"align-self:flex-start\"><button type=\"button\" class=${cx(f.lang === 'en' && 'on')} onClick=${() => setF({ ...f, lang: 'en' })}>English</button><button type=\"button\" class=${cx(f.lang === 'pt' && 'on')} onClick=${() => setF({ ...f, lang: 'pt' })}>Português</button></div>",
    "<div class=\"seg\" style=\"align-self:flex-start;flex-wrap:wrap\">${LANGS.map(([k, l]) => html`<button type=\"button\" key=${k} class=${cx(f.lang === k && 'on')} onClick=${() => setF({ ...f, lang: k })}>${l}</button>`)}</div>")
rep("O cliente vê a área neste idioma. O time continua em português.", "É o idioma padrão do painel do cliente. Cada pessoa do cliente pode trocar. O time continua em português.")

# ---------- automação com Gmail pessoal
rep("Os dois caminhos reais são a API do Google Meet (exige Workspace Business Standard) ou o Fathom, que avisa o sistema quando a transcrição fica pronta já no plano grátis.",
    "Com Gmail pessoal, a API do Google Meet não entrega transcrição, então o caminho é o Fathom: grava a reunião e avisa o sistema quando a transcrição fica pronta, já no plano grátis. O resumo roda no Claude do Pedro, sem custo por uso.")

# ---------- pedido do cliente no time
rep("<${Pill} kind=\"task\" st=${t.status} />${t.type === 'entrega' && html`<span class=\"tag\">ENTREGA</span>`}", "<${Pill} kind=\"task\" st=${t.status} />${t.req && html`<span class=\"tag\">PEDIDO DO CLIENTE</span>`}${t.type === 'entrega' && html`<span class=\"tag\">ENTREGA</span>`}")
rep("<span class=\"m\">${t.type === 'entrega' && html`<span class=\"tag\">ENTREGA</span>`}", "<span class=\"m\">${t.req && html`<span class=\"tag\">PEDIDO</span>`}${t.type === 'entrega' && html`<span class=\"tag\">ENTREGA</span>`}")

# ---------- IA no quadro e no funil (só Pedro)
rep("function Whiteboard({ board }) {\n  const { act, me, toast } = useApp();", """function Whiteboard({ board }) {
  const { act, me, toast } = useApp();
  const [ai, setAi] = useState(false);""")
rep("  const selEls = sel.map(id => map[id]).filter(Boolean);", """  const applyAi = r => {
    const list = Array.isArray(r && r.elementos) ? r.elementos.slice(0, 30) : []; if (!list.length) { toast('A IA não devolveu nada para desenhar.'); return; }
    const cur = elsRef.current; const b0 = cur.length ? bbox(cur) : null; const ox = b0 ? b0.x + b0.w + 140 : 40, oy = b0 ? b0.y : 40;
    const TT = { postit: 'sticky', texto: 'text', retangulo: 'rect', elipse: 'ellipse' };
    const made = list.map(e => { const t = TT[e.tipo] || 'sticky'; const col = Math.max(0, Math.min(12, Math.round(num(e.coluna)))), row = Math.max(0, Math.min(20, Math.round(num(e.linha)))); const x = ox + col * 250, y = oy + (row === 0 ? 0 : 60 + (row - 1) * 160);
      return t === 'text' ? { id: uid('e'), t, x, y, w: 230, h: 40, text: String(e.texto || '').slice(0, 120), size: 18 } : { id: uid('e'), t, x, y, w: 190, h: t === 'sticky' ? 130 : 110, color: STICKY[e.cor] ? e.cor : 'sand', text: String(e.texto || '').slice(0, 200) }; });
    const arrows = (Array.isArray(r.setas) ? r.setas : []).map(a => [made[Math.round(num(a.de))], made[Math.round(num(a.para))]]).filter(([a, b]) => a && b && a !== b).map(([a, b]) => ({ id: uid('e'), t: 'arrow', from: a.id, to: b.id }));
    save([...cur, ...made, ...arrows], cur); setSel(made.map(m => m.id)); requestAnimationFrame(fit); toast(`${plural(made.length, 'elemento desenhado', 'elementos desenhados')} pela IA`);
  };
  const selEls = sel.map(id => map[id]).filter(Boolean);""")
rep("act.saveBoard(board.id, prev); } }}><${Icon} n=\"undo\" s=${18} /></button>\n    </div>",
    "act.saveBoard(board.id, prev); } }}><${Icon} n=\"undo\" s=${18} /></button>\n      ${me && me.copilot && html`<span class=\"tl-sep\"></span><button class=${cx('tl ai', ai && 'on')} title=\"Desenhar com IA: fale, escreva ou mande uma foto\" aria-label=\"Desenhar com IA\" onClick=${() => setAi(!ai)}><${Icon} n=\"sparkle\" s=${18} /></button>`}\n    </div>\n    ${ai && html`<${AiPanel} kind=\"board\" onResult=${applyAi} close=${() => setAi(false)} />`}")
rep("function FunnelEditor({ f }) {\n  const { act } = useApp();", "function FunnelEditor({ f }) {\n  const { act, me, toast } = useApp();\n  const [ai, setAi] = useState(false);")
rep("  const groups = [...new Set(Object.values(FN).map(t => t.g))];", """  const applyAi = (r, mode) => {
    const steps = (Array.isArray(r && r.etapas) ? r.etapas : []).filter(x => x && FN[x.tipo]).slice(0, 20); if (!steps.length) { toast('A IA não devolveu etapas reconhecíveis.'); return; }
    const links = (Array.isArray(r.ligacoes) ? r.ligacoes : []).map(l => ({ from: Math.round(num(l.de)), to: Math.round(num(l.para)), rate: num(l.taxa) || 50 })).filter(l => steps[l.from] && steps[l.to] && l.from !== l.to);
    const pos = layoutFunnel(steps, links);
    const base = mode === 'replace' ? [] : nRef.current; const ox = base.length ? Math.max(...base.map(n => n.x)) + NW + 160 : 0;
    const ids = steps.map(() => uid('n'));
    const nodes2 = steps.map((x, i) => { const T = FN[x.tipo]; const pp = T.kind === 'traffic' ? (T.paid ? { invest: num(x.investimento) || '', cpc: num(x.cpc) || '' } : { visits: num(x.visitas) || '' }) : T.kind === 'buy' ? { conv: num(x.taxa_compra) || (x.tipo === 'venda' ? 100 : ''), price: num(x.preco) || '' } : T.kind === 'talk' ? { cost: '' } : {}; return { id: ids[i], type: x.tipo, x: ox + pos[i].x, y: pos[i].y, label: String(x.nome || T.label).slice(0, 60), p: pp }; });
    const N2 = [...base, ...nodes2], E2 = [...(mode === 'replace' ? [] : eRef.current), ...links.map(l => ({ id: uid('e'), from: ids[l.from], to: ids[l.to], rate: l.rate }))];
    setNodes(N2); nRef.current = N2; setEdges(E2); eRef.current = E2; persist(N2, E2);
    act.setFunnel(f.id, { note: 'Onde o pedido não trouxe número, a IA usou premissas. Troque pelos números reais.' });
    requestAnimationFrame(fit); toast(`Funil montado com ${plural(nodes2.length, 'etapa')}`);
  };
  const groups = [...new Set(Object.values(FN).map(t => t.g))];""")
rep("<div class=\"cv-wrap fn-canvas\" ref=${wrapRef} onDragOver=${e => e.preventDefault()} onDrop=${onDrop}>",
    "<div class=\"cv-wrap fn-canvas\" ref=${wrapRef} onDragOver=${e => e.preventDefault()} onDrop=${onDrop}>\n      ${me && me.copilot && html`<button class=\"ai-fab\" onClick=${() => setAi(!ai)} title=\"Fale, escreva ou mande uma foto do funil\"><${Icon} n=\"sparkle\" s=${15} />Montar com IA</button>`}\n      ${ai && html`<${AiPanel} kind=\"funnel\" onResult=${applyAi} close=${() => setAi(false)} />`}")

# ---------- painel do cliente novo (troca o antigo) e pedidos
cut("function Portal({ clientId, preview }) {", "function PortalHome(", "")
rep("    ${next.length > 0 && html`<section class=\"sec\" style=\"gap:12px\">", "    <${MyRequests} c=${c} lang=${lang} />\n    ${next.length > 0 && html`<section class=\"sec\" style=\"gap:12px\">")
rep("  const t = TX[lang];\n  const [done, setDone] = useState([]);", "  const t = TX[lang] || TX.pt;\n  const [done, setDone] = useState([]);")

rep("render(html`<${App} />`, document.getElementById('app'));", v3+"\nrender(html`<${App} />`, document.getElementById('app'));")
open(p,'w',encoding='utf-8').write(s); print('ok', len(s))
