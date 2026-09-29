p='src.html'; s=open(p,encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt, ('COUNT', s.count(a), a[:140]); s=s.replace(a,b)
# 7. navegar fecha a gaveta
rep("  const go = r => { setRoute(r); setSideOpen(false); if (mainRef.current) mainRef.current.scrollTop = 0; };",
    "  const go = r => { setRoute(r); setDrawer(null); setSideOpen(false); if (mainRef.current) mainRef.current.scrollTop = 0; };")
# 1. o caminho da gaveta leva até onde a peça está
rep("""<div class="dhead"><span class="crumb">${x.clientId ? html`<${CChip} id=${x.clientId} />` : null}${x.clientId && html`<${Icon} n="chevR" s=${12} />`}${kind}</span>""",
    """<div class="dhead">${x.clientId ? html`<button class="crumb crumb-btn" title="Ir para onde está" onClick=${() => { app.go({ v: 'client', id: x.clientId, tab: { task: 'tasks', post: 'posts', script: 'scripts', meeting: 'meetings' }[drawer.k] }); app.open(drawer.k, drawer.id); }}><${CChip} id=${x.clientId} /><${Icon} n="chevR" s=${12} />${kind}<${Icon} n="arrowUR" s=${12} /></button>` : html`<span class="crumb">${kind}</span>`}""")
# 2. peça concluída: link do post no ar e o histórico de tarefas
rep("""  else if (st.type === 'live') body = html`<span class="hint">Peça concluída.</span>`;""",
    """  else if (st.type === 'live') body = x.liveUrl ? html`<span class="hint">Peça no ar.</span><a class="btn pri" href=${x.liveUrl} target="_blank" rel="noopener"><${Icon} n="ext" s=${14} />Abrir ${k === 'post' ? 'o post' : 'o vídeo'} publicado</a>` : html`<span class="hint">Peça concluída. Cole abaixo o link de onde ela foi publicada.</span>`;""")
rep("""    ${task && html`<button class="linkbtn" style="font-size:12px" onClick=${() => open('task', task.id)}>Ver a tarefa desta etapa</button>`}
  </div>`;
}""", """    ${st && (st.type === 'live' || st.key === 'publicar') && html`<${LiveLink} k=${k} x=${x} />`}
    ${task && html`<button class="linkbtn" style="font-size:12px" onClick=${() => open('task', task.id)}>Ver a tarefa desta etapa</button>`}
    ${hist.length > 0 && html`<details class="hist"><summary>Histórico: ${plural(hist.length, 'tarefa')} desta peça</summary><div class="list">${hist.map(t => html`<${TaskRow} key=${t.id} t=${t} client=${false} />`)}</div></details>`}
  </div>`;
}
function LiveLink({ k, x }) {
  const { act } = useApp(); const [v, setV] = useState(x.liveUrl || '');
  return html`<form class="addlink" onSubmit=${e => { e.preventDefault(); act.setItem(k, x.id, { liveUrl: v.trim() || null }, v.trim() ? 'Link salvo' : null); }}><label class="sr" for=${'live-' + x.id}>Link publicado</label><input class="inp" id=${'live-' + x.id} placeholder=${'Link ' + (k === 'post' ? 'do post' : 'do vídeo') + ' publicado (Instagram, YouTube, TikTok...)'} value=${v} onInput=${e => setV(e.target.value)} /><button class="btn" type="submit" disabled=${v.trim() === (x.liveUrl || '')}>Salvar</button></form>`;
}""")
rep("""  const nx = nextOf(fl, x.stage); const task = openPieceTask(db, k, x.id);
  const [back, setBack] = useState(false);""", """  const nx = nextOf(fl, x.stage); const task = openPieceTask(db, k, x.id); const hist = db.tasks.filter(t => t.piece && t.piece.k === k && t.piece.id === x.id && t.status === 'done');
  const [back, setBack] = useState(false);""")
# 3. os números do QG levam a algum lugar
rep("""  const Stat = (label, val, sub, tone, onClick) =>""", """  const toId = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const Stat = (label, val, sub, tone, onClick) =>""")
rep("""      ${Stat('Na esteira', inProd, 'peças em produção', 'var(--st-prog)', () => {})}
      ${Stat('Com o cliente', waiting.length, oldest ? `a mais antiga há ${plural(oldest, 'dia')}` : 'nada esperando', 'var(--st-cli)', () => {})}""",
    """      ${Stat('Na esteira', inProd, 'peças em produção', 'var(--st-prog)', () => toId('qg-esteira'))}
      ${Stat('Com o cliente', waiting.length, oldest ? `a mais antiga há ${plural(oldest, 'dia')}` : 'nada esperando', 'var(--st-cli)', () => toId('qg-cliente'))}""")
rep("""'var(--taupe)', () => setTab('meetings'))}""", """'var(--taupe)', () => nextMeet ? open('meeting', nextMeet.key) : setTab('meetings'))}""")
rep("""'var(--st-ok)', () => setTab('posts'))}""", """'var(--st-ok)', () => nextPost ? open('post', nextPost.id) : setTab('posts'))}""")
rep("""    <${Esteira} c=${c} />
    <div class="ov">""", """    <div id="qg-esteira" class="anchor"><${Esteira} c=${c} /></div>
    <div class="ov">""")
rep("""        <section class="sec"><div class="sec-h"><h2>Com o cliente agora</h2>""", """        <section class="sec anchor" id="qg-cliente"><div class="sec-h"><h2>Com o cliente agora</h2>""")
# 4. reunião no calendário abre a reunião
rep("""function TeamCalendar({ c }) {
  const { db, open } = useApp();""", """function TeamCalendar({ c }) {
  const app = useApp(); const { db, open } = app;""")
rep("""  const items = (c ? [c.id] : db.clients.filter(x => !cf || x.id === cf).map(x => x.id)).flatMap(id => calItems(db, id, false)).filter(i => !hide.includes(i.kind));""",
    """  const ids = c ? [c.id] : db.clients.filter(x => !cf || x.id === cf).map(x => x.id);
  const meets = allMeetings(app).filter(m => ids.includes(m.clientId)).map(m => ({ id: m.key, date: dayOf(m.start), title: `${hhmm(m.start)} ${m.title}`, kind: 'meet', k: 'meeting', cls: 'k-meet' }));
  const items = [...ids.flatMap(id => calItems(db, id, false)).filter(i => i.kind !== 'meet'), ...meets].filter(i => !hide.includes(i.kind));""")
# 5. o calendário respeita o mês e o "+N" abre o dia
rep("""  const agenda = Object.keys(byDay).filter(k => diff(k) >= -1 && diff(k) <= 45).sort();""", """  const agenda = Object.keys(byDay).filter(k => k.slice(0, 7) === iso(first).slice(0, 7)).sort(); const [openDay, setOpenDay] = useState(null);""")
rep("""${its.slice(0, 3).map(Ev)}${its.length > 3 && html`<span class="more">+${its.length - 3}</span>`}""", """${its.slice(0, openDay === k ? its.length : 3).map(Ev)}${its.length > 3 && openDay !== k && html`<button class="more" onClick=${() => setOpenDay(k)}>+${its.length - 3}</button>`}""")
# 8. busca e favoritos abrem a página certa
rep("""() => p.clientId ? go({ v: 'client', id: p.clientId, tab: 'process' }) : go({ v: 'wiki' })]));""", """() => p.clientId ? go({ v: 'client', id: p.clientId, tab: 'process', pid: p.id }) : go({ v: 'wiki', pid: p.id })]));""")
rep("""route: p.clientId ? { v: 'client', id: p.clientId, tab: 'process' } : { v: 'wiki' } }; }""", """route: p.clientId ? { v: 'client', id: p.clientId, tab: 'process', pid: p.id } : { v: 'wiki', pid: p.id } }; }""")
rep("""go(p && p.clientId ? { v: 'client', id: p.clientId, tab: 'process' } : { v: 'wiki' }); } };""", """go(p && p.clientId ? { v: 'client', id: p.clientId, tab: 'process', pid: p.id } : { v: 'wiki', pid: p.id }); } };""")
rep("""    case 'client': view = html`<${ClientArea} id=${route.id} tab=${route.tab || 'overview'} key=${route.id} />`; break;""", """    case 'client': view = html`<${ClientArea} id=${route.id} tab=${route.tab || 'overview'} pid=${route.pid} key=${route.id} />`; break;""")
rep("function ClientArea({ id, tab }) {", "function ClientArea({ id, tab, pid }) {")
rep("""    case 'process': view = html`<${Docs} pages=${db.pages.filter(p => p.clientId === id)} editable clientPage />`; break;""", """    case 'process': view = html`<${Docs} pages=${db.pages.filter(p => p.clientId === id)} editable clientPage initial=${pid} key=${pid || 'docs'} />`; break;""")
# 9. reunião, tarefas e automações ligadas; reuniões na busca
rep("""    createTasksFromMeeting: (key, list) => commit(d => { list.forEach(o => d.tasks.unshift({ id: uid('t'), type: 'interna', priority: 'media', checklist: [], comments: [], changeReq: false, status: 'todo', since: off(0), ...o })); d.meetingNotes[key].created = list.length; },""",
    """    createTasksFromMeeting: (key, list) => commit(d => { const ids = list.map(o => { const id = uid('t'); d.tasks.unshift({ id, type: 'interna', priority: 'media', checklist: [], comments: [], changeReq: false, status: 'todo', since: off(0), meeting: key, ...o }); return id; }); d.meetingNotes[key].created = list.length; d.meetingNotes[key].taskIds = ids; },""")
rep("""          ${note.created ? html`<p class="muted" style="margin-top:8px">${plural(note.created, 'tarefa criada', 'tarefas criadas')} a partir desta reunião.</p>` :""",
    """          ${note.created ? html`<p class="muted" style="margin-top:8px">${plural(note.created, 'tarefa criada', 'tarefas criadas')} a partir desta reunião.</p>${(note.taskIds || []).length > 0 && html`<div class="list" style="margin-top:6px">${note.taskIds.map(id => db.tasks.find(t => t.id === id)).filter(Boolean).map(t => html`<${TaskRow} key=${t.id} t=${t} client=${false} />`)}</div>`}` :""")
rep("""      <div class="list">${runs.length ? runs.map(r => html`<div class="row" key=${r.k}>""", """      <div class="list">${runs.length ? runs.map(r => html`<div class="row" key=${r.k} role="button" tabindex="0" onClick=${() => open('meeting', r.k)} onKeyDown=${e => e.key === 'Enter' && open('meeting', r.k)}>""")
rep("""function Automations() {
  const { db, act, go } = useApp();""", """function Automations() {
  const { db, act, go, open } = useApp();""")
rep("""function Palette() {
  const { db, go, open, setPalette, setModal, can, setPreview, theme, setTheme, setCopilot, me } = useApp();""", """function Palette() {
  const app = useApp(); const { db, go, open, setPalette, setModal, can, setPreview, theme, setTheme, setCopilot, me } = app;""")
rep("""    db.scripts.forEach(s => L.push(['Roteiros', 'script', s.title, stOf('script', s.status)[1], () => open('script', s.id)]));""",
    """    db.scripts.forEach(s => L.push(['Roteiros', 'script', s.title, stOf('script', s.status)[1], () => open('script', s.id)]));
    allMeetings(app).forEach(m => L.push(['Reuniões', 'video', m.title, fmt(dayOf(m.start)), () => open('meeting', m.key)]));""")
# 10. desfazer a aprovação no painel volta a peça para a etapa certa
rep("""  const undo = d => { act.setItem(d.k, d.id, d.k === 'task' ? { status: 'client', changeReq: false } : { status: 'cliente' }); setDone(ds => ds.filter(z => z.id !== d.id)); };""",
    """  const undo = d => { if (d.k === 'task') act.setItem(d.k, d.id, { status: 'client', changeReq: false }); else act.jumpStage(d.k, d.id, 'cliente'); setDone(ds => ds.filter(z => z.id !== d.id)); };""")
# níveis de acesso com a equipe do cliente
rep("""  const rows = [['Vê todos os clientes', 1, 1, 0], ['Cria e edita tarefas, posts e roteiros', 1, 1, 0], ['Vê processos internos e a equipe', 1, 1, 0], ['Cadastra cliente e manda o acesso', 1, 0, 0], ['Convida pessoas e muda o nível', 1, 0, 0], ['Apaga tarefa, post e link', 1, 0, 0], ['Vê só a própria área', 0, 0, 1], ['Aprova ou pede ajuste nas peças', 0, 0, 1]];""",
    """  const rows = [['Vê todos os clientes', 1, 1, 0, 0], ['Cria e edita tarefas, posts e roteiros', 1, 1, 0, 0], ['Vê processos internos e a equipe', 1, 1, 0, 0], ['Cadastra cliente e manda o acesso', 1, 0, 0, 0], ['Convida pessoas e muda o nível', 1, 0, 0, 0], ['Apaga tarefa, post e link', 1, 0, 0, 0], ['Vê só a própria área', 0, 0, 1, 1], ['Vê a produção em Kanban e cria post e roteiro', 1, 1, 1, 1], ['É dono de uma etapa da esteira', 1, 1, 1, 1], ['Aprova ou pede ajuste nas peças', 0, 0, 1, 0], ['Convida a própria equipe', 1, 0, 1, 0]];""")
rep("""<thead><tr><th>O que pode</th><th>Sócio</th><th>Colaborador</th><th>Cliente</th></tr></thead>
        <tbody>${rows.map(r => html`<tr key=${r[0]} style="cursor:default"><td>${r[0]}</td><td>${r[1] ? Y : N}</td><td>${r[2] ? Y : N}</td><td>${r[3] ? Y : N}</td></tr>`)}</tbody>""",
    """<thead><tr><th>O que pode</th><th>Sócio</th><th>Colaborador</th><th>Cliente</th><th>Equipe do cliente</th></tr></thead>
        <tbody>${rows.map(r => html`<tr key=${r[0]} style="cursor:default"><td>${r[0]}</td><td>${r[1] ? Y : N}</td><td>${r[2] ? Y : N}</td><td>${r[3] ? Y : N}</td><td>${r[4] ? Y : N}</td></tr>`)}</tbody>""")
# leitura: a etiqueta "A fazer" só repetia o que o círculo de marcar já diz; Espaço também abre a linha
rep("""<${CChip} id=${t.clientId} />`}<${Pill} kind="task" st=${t.status} />${t.req""", """<${CChip} id=${t.clientId} />`}${t.status !== 'todo' && html`<${Pill} kind="task" st=${t.status} />`}${t.req""")
rep("""role="button" tabindex="0" onKeyDown=${e => e.key === 'Enter' && open('task', t.id)}>""", """role="button" tabindex="0" onKeyDown=${e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open('task', t.id); } }}>""", 2)
# celular: sete abas no painel do cliente sem o texto encostar
rep("""onClick=${() => pick(k)}><${Icon} n=${ic} s=${20} />${l}${n ? html`<span class="badge">${n}</span>` : null}</button>`)}</nav>""", """onClick=${() => pick(k)}><${Icon} n=${ic} s=${20} /><span class="pt-l">${l}</span>${n ? html`<span class="badge">${n}</span>` : null}</button>`)}</nav>""")
rep("</style>", """/* v7: navegação */
.crumb-btn{border:0;background:none;padding:4px 6px;margin-left:-6px;border-radius:8px;cursor:pointer;text-align:left;flex:0 1 auto}
.crumb-btn:hover{background:var(--hover);color:var(--text)}
button.more{border:0;background:none;cursor:pointer;text-align:left;font:inherit;font-size:11px}
button.more:hover{color:var(--text);text-decoration:underline}
.hist summary{font-size:12px;color:var(--text-3);cursor:pointer;padding:2px 0}
.hist .list{margin-top:6px}
.anchor{scroll-margin-top:16px}
@container portal (max-width:680px){.p-tab .pt-l{font-size:10px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 1px}}
</style>""")
open(p,'w',encoding='utf-8').write(s); print('ok')
