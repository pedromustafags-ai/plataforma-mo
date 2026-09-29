p='src.html'; s=open(p,encoding='utf-8').read()
v4=open('v4.js',encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    assert a in s, ('MISSING', a[:120]); s=s.replace(a,b,cnt)
def cut(start,end,new):
    global s
    i=s.index(start); j=s.index(end,i); s=s[:i]+new+s[j:]

s=s.replace("</style>", open('css_v4.txt',encoding='utf-8').read()+"</style>",1)
rep("const [db, setDbState] = useState(seed);", "const [db, setDbState] = useState(() => withFlows(seed()));")
rep("automations: { au1: true, au2: true, au3: false }", "automations: { au0: true, au1: true, au2: true, au3: false }")

# ações
rep("    toggleDone: id => commit(d => {", "    toggleDone: id => { const t0 = dbRef.current.tasks.find(x => x.id === id); if (t0 && t0.piece && t0.status !== 'done') { const x0 = itemOf(dbRef.current, t0.piece.k, t0.piece.id); if (x0 && x0.stage === t0.piece.stage) return act.advance(t0.piece.k, t0.piece.id); } commit(d => {")
rep("'Tarefa reaberta' : 'Tarefa concluída'),", "'Tarefa reaberta' : 'Tarefa concluída'); },")
rep("      if (k === 'task') { x.status = ok ? 'done' : 'doing'; x.changeReq = !ok; } else x.status = ok ? 'aprovado' : 'ajuste';",
    "      if (k === 'task') { x.status = ok ? 'done' : 'doing'; x.changeReq = !ok; } else { const fl = flowFor(d.clients.find(y => y.id === x.clientId), k); if (ok) { const nx = nextOf(fl, 'cliente'); moveTo(d, k, x, nx ? nx.key : null); } else moveTo(d, k, x, prevWorkOf(fl, 'cliente').key, { note: 'Ajuste do cliente', status: 'ajuste', changeReq: true }); }")
rep("title: 'Post sem título', status: 'ideia', format: 'Carrossel', assignee: me?.id || 'pedro', comments: [],", "title: 'Post sem título', status: 'ideia', stage: null, media: [], format: 'Carrossel', assignee: me?.id || 'pedro', comments: [],")
rep("title: 'Roteiro sem título', kind: 'Reel', lang: 'pt', status: 'rascunho',", "title: 'Roteiro sem título', kind: 'Reel', lang: 'pt', status: 'rascunho', stage: null, media: [],")
rep("    setBrand: (cid, patch) =>", """    advance: (k, id) => { const d0 = dbRef.current; const x0 = itemOf(d0, k, id); const c0 = d0.clients.find(y => y.id === x0.clientId); const nx = nextOf(flowFor(c0, k), x0.stage); if (!nx) return; const own = ownerOf(c0, nx.key);
      commit(d => { const x = itemOf(d, k, id); moveTo(d, k, x, nx.key); if (own && me && own !== me.id && nx.type !== 'client') notify(d, own, me.id, `passou para você (${nx.label.toLowerCase()}):`, k, id); },
        nx.type === 'client' ? 'Enviado para o cliente aprovar' : nx.type === 'live' ? 'Concluído' : `Próxima etapa: ${nx.label}${own && nx.type !== 'client' ? ', com ' + firstName(d0, own) : ''}`); },
    sendBack: (k, id, text) => { const d0 = dbRef.current; const x0 = itemOf(d0, k, id); const pw = prevWorkOf(flowFor(d0.clients.find(y => y.id === x0.clientId), k), x0.stage);
      commit(d => { const x = itemOf(d, k, id); if (text) x.comments.push({ by: me.id, text, at: off(0) }); moveTo(d, k, x, pw.key, { note: 'Ajuste interno' }); const own = x.assignee; if (own && own !== me.id) notify(d, own, me.id, 'devolveu para ajuste:', k, id); }, `Devolvida para ${pw.label.toLowerCase()}`); },
    jumpStage: (k, id, key) => { const d0 = dbRef.current; const x0 = itemOf(d0, k, id); const st = key && flowFor(d0.clients.find(y => y.id === x0.clientId), k).stages.find(s => s.key === key); commit(d => { moveTo(d, k, itemOf(d, k, id), key); }, st ? `Movida para ${st.label.toLowerCase()}` : 'Voltou para ideias'); },
    setFlows: (cid, flows) => commit(d => { const c = d.clients.find(y => y.id === cid); c.flows = flows; const fl = flowFor(c, 'post'); d.posts.filter(p => p.clientId === cid && p.stage && !fl.stages.some(s => s.key === p.stage)).forEach(p => { const oi = STAGE_ORDER.indexOf(p.stage); const ns = fl.stages.find(s => STAGE_ORDER.indexOf(s.key) >= oi) || fl.stages[0]; p.stage = ns.key; }); d.tasks.forEach(t => { if (t.piece && t.status !== 'done') { const own = ownerOf(c, t.piece.stage); if (t.clientId === cid && own) t.assignee = own; } }); }, 'Fluxo de produção salvo'),
    shareAta: (key, shared, m) => commit(d => { const n = d.meetingNotes[key]; n.shared = shared; n.clientId = m.clientId; n.title = m.title; n.start = m.start; }, shared ? 'Ata publicada no painel do cliente' : 'Ata tirada do painel do cliente'),
    setBrand: (cid, patch) =>""")
rep("brand: { logo: null, logoDark: null, colors: [], primary: null, font: null, theme: { mode: 'light', light: 'papel', dark: 'carvao' } }, ",
    "brand: { logo: null, logoDark: null, colors: [], primary: null, font: null, theme: { mode: 'light', light: 'papel', dark: 'carvao' } }, flows: { post: 'enxuto', script: 'video', owners: Object.fromEntries(STAGE_ORDER.map(k => [k, f.owner])) }, drive: null, docs: [], lists: [], ")

# QG no lugar da visão geral do cliente
cut("function ClientOverview({ c, setTab }) {", "/* ---------- tarefas ---------- */", "")
rep("    default: view = html`<${ClientOverview} c=${c} setTab=${setTab} />`;", "    default: view = html`<${ClientQG} c=${c} setTab=${setTab} />`;")
rep("[['overview', 'Visão geral', 'grid'],", "[['overview', 'QG', 'grid'],")

# peça: esteira, etapa e mídia
cut("const POST_NEXT = {", "function PostBody({ p }) {", "")
rep("    <${NextStep} k=\"post\" x=${p} nextMap=${POST_NEXT} />", "    <${FlowBar} k=\"post\" x=${p} />")
rep("<dt>Status</dt><dd><select class=\"sel\" id=\"p-status\" value=${p.status} onChange=${e => set({ status: e.target.value }, `Movido para ${stOf('post', e.target.value)[1]}`)}>${POST_ST.map(([k, l]) => html`<option value=${k}>${l}</option>`)}</select></dd>",
    "<dt>Etapa</dt><dd><${StageSelect} k=\"post\" x=${p} /></dd>")
rep("    <${Comments} k=\"post\" x=${p} />`;", "    <${MediaSection} k=\"post\" x=${p} />\n    <${Comments} k=\"post\" x=${p} />`;")
rep("    <${NextStep} k=\"script\" x=${s} nextMap=${SCRIPT_NEXT} />", "    <${FlowBar} k=\"script\" x=${s} />")
rep("<dt>Status</dt><dd><select class=\"sel\" id=\"s-status\" value=${s.status} onChange=${e => set({ status: e.target.value }, `Movido para ${stOf('script', e.target.value)[1]}`)}>${SCRIPT_ST.map(([k, l]) => html`<option value=${k}>${l}</option>`)}</select></dd>",
    "<dt>Etapa</dt><dd><${StageSelect} k=\"script\" x=${s} /></dd>")
rep("    <${Comments} k=\"script\" x=${s} />`;", "    <${MediaSection} k=\"script\" x=${s} />\n    <${Comments} k=\"script\" x=${s} />`;")
rep("    <${Title} value=${t.title} onSave=${v => set({ title: v })} />\n    ${t.changeReq", "    <${Title} value=${t.title} onSave=${v => set({ title: v })} />\n    ${t.piece && html`<${PieceBanner} t=${t} />`}\n    ${t.changeReq")
rep("    ${next && html`<div class=\"primary-act\"><span class=\"hint\">${t.status === 'review' && t.type === 'entrega'", "    ${next && !t.piece && html`<div class=\"primary-act\"><span class=\"hint\">${t.status === 'review' && t.type === 'entrega'")

# meu dia sem duplicar peça e tarefa de ajuste
rep(".filter(([, x]) => x.assignee === me.id && x.status === 'ajuste');", ".filter(([k2, x]) => x.assignee === me.id && x.status === 'ajuste' && !openPieceTask(db, k2, x.id));")

# modais
rep("  else if (modal.t === 'newFunnel')", "  else if (modal.t === 'flow') inner = html`<${FlowSettings} close=${close} clientId=${modal.clientId} />`;\n  else if (modal.t === 'preview') inner = html`<${PreviewModal} close=${close} url=${modal.url} name=${modal.name} />`;\n  else if (modal.t === 'newFunnel')")

# reunião: ata em duas versões
rep('"email": "e-mail curto de follow-up em português, sem assinatura"}', '"email": "e-mail curto de follow-up em português, sem assinatura", "cliente": {"resumo": "2 a 4 frases escritas para o cliente, em ${LANG_PT[cl] || \'português\'}", "decisoes": ["decisão, em ${LANG_PT[cl] || \'português\'}"], "proximos": [{"quem": "M&O ou Cliente", "o": "o que será feito"}]}}')
rep("Regras: tarefa só se alguém se comprometeu a fazer algo;", "Regras: a parte \"cliente\" é o que o cliente vai ler, então sai sem nome do time interno, sem comentário interno e sem custo interno, em tom profissional e direto. Tarefa só se alguém se comprometeu a fazer algo;")
rep("    const people = db.people.map(p => p.name).join(', ');", "    const people = db.people.map(p => p.name).join(', '); const cl = (db.clients.find(x => x.id === m.clientId) || {}).lang || 'pt';")
rep("email: String(r.email || ''),", "email: String(r.email || ''), cliente: r.cliente ? { lang: cl, resumo: String(r.cliente.resumo || ''), decisoes: (r.cliente.decisoes || []).map(String).slice(0, 8), proximos: (r.cliente.proximos || []).slice(0, 8).map(q => ({ quem: String(q.quem || 'M&O'), o: String(q.o || q.o_que || '') })) } : null, shared: false, clientId: m.clientId || null, title: m.title, start: m.start,")
rep("  const [pick, setPick] = useState(null); const [drive, setDrive] = useState(null); const [mail, setMail] = useState(null);", "  const [pick, setPick] = useState(null); const [drive, setDrive] = useState(null); const [mail, setMail] = useState(null); const [view, setView] = useState('int');")
rep("      ${note && html`<div class=\"mt-note\">", "      ${note && html`<div class=\"seg ata-tabs\"><button class=${cx(view === 'int' && 'on')} onClick=${() => setView('int')}>Ata interna</button><button class=${cx(view === 'cli' && 'on')} onClick=${() => setView('cli')}>Ata para o cliente${note.shared ? ' ✓' : ''}</button></div>`}\n      ${note && view === 'cli' && html`<${AtaClient} m=${m} note=${note} />`}\n      ${note && view === 'int' && html`<div class=\"mt-note\">")
rep("<h2>Resumo, decisões e tarefas</h2>", "<h2>Ata da reunião</h2>")

# painel do cliente: aba de reuniões e mídia na aprovação
rep("['content', t.content, 'image'], ['proc', t.proc, 'file']", "['content', t.content, 'image'], ['meet', (MT[lang] || MT.pt).tab, 'video'], ['proc', t.proc, 'file']")
rep("  else if (tab === 'links') view = html`<${PortalLinks} c=${c} lang=${lang} />`;", "  else if (tab === 'links') view = html`<${PortalLinks} c=${c} lang=${lang} />`;\n  else if (tab === 'meet') view = html`<${PortalMeetings} c=${c} lang=${lang} />`;")
rep("    <div class=\"ap-b\">\n      ${k === 'post' && x.caption", "    <div class=\"ap-b\">\n      ${(x.media || []).length > 0 && html`<div class=\"lp-grid\">${x.media.map((md, i) => html`<${LinkPreview} key=${i} url=${md.url} name=${md.name} lang=${lang} />`)}</div>`}\n      ${k === 'post' && x.caption")

# processos internos e automação
cut("    { id: 'w2', clientId: null, title: 'Como uma peça é aprovada',", "    { id: 'w3', clientId: null,", """    { id: 'w2', clientId: null, title: 'A esteira de produção', by: 'pedro', at: off(0), blocks: [
      { type: 'steps', items: ['Estratégia', 'Copy', 'Design', 'Aprovação interna', 'Aprovação do cliente', 'Agendar', 'Publicado'] },
      { type: 'callout', text: 'Quando uma etapa termina, a tarefa da próxima nasce sozinha, já com o responsável dela.' },
      { type: 'p', text: 'Cada cliente usa um de dois modelos. No enxuto, estratégia, copy e design passam por uma aprovação interna antes de ir para o cliente. No de aprovação por etapa, estratégia, copy e design são aprovados um a um antes de a próxima etapa começar.' },
      { type: 'p', text: 'Ajuste pedido pelo cliente volta para a última etapa de produção, com o comentário preso ao slide. Quem produziu vê a tarefa no topo do "Meu dia".' },
    ] },
""")
rep("    ${Card('au1', 'Pós-reunião',", "    ${Card('au0', 'Passagem de etapa', 'Terminou uma etapa da esteira: a tarefa da próxima nasce sozinha, com o responsável e o prazo dela.', [['check', 'Etapa concluída'], ['tasks', 'Cria a tarefa da próxima etapa'], ['users', 'Atribui ao responsável do fluxo'], ['inbox', 'Avisa na caixa de entrada'], ['alert', 'Atrasou? Aparece em Onde travou']], null)}\n    ${Card('au1', 'Pós-reunião',")

rep("render(html`<${App} />`, document.getElementById('app'));", v4+"\nrender(html`<${App} />`, document.getElementById('app'));")
assert 'NextStep' not in s and 'ClientOverview' not in s and 'POST_NEXT' not in s, 'dead refs'
open(p,'w',encoding='utf-8').write(s); print('ok', len(s))
