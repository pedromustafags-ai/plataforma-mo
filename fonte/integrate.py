import re
p='src.html'; s=open(p,encoding='utf-8').read()
v2=open('v2.js',encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)>=1, ('MISSING', a[:110]); s=s.replace(a,b,cnt)
ICONS = open('icons.txt',encoding='utf-8').read()
rep("  bell: ['M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9', 'M13.7 21a2 2 0 0 1-3.4 0'],\n", "  bell: ['M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9', 'M13.7 21a2 2 0 0 1-3.4 0'],\n"+ICONS)
rep("  return { people, clients, tasks, posts, scripts, events, pages, notes };", "  return { people, clients, tasks, posts, scripts, events, pages, notes, ...seedV2() };")
rep("  const [sideOpen, setSideOpen] = useState(false);\n", open('p_state.txt',encoding='utf-8').read())
rep("    addTask: o => { const id = uid('t'); commit(d => d.tasks.unshift({ id, clientId: 'mo', type: 'interna', priority: 'media', checklist: [], comments: [], desc: '', changeReq: false, status: 'todo', due: off(0), since: off(0), ...o }), 'Tarefa criada'); return id; },",
    "    addTask: (o, silent) => { const id = uid('t'); commit(d => d.tasks.unshift({ id, clientId: 'mo', type: 'interna', priority: 'media', checklist: [], comments: [], desc: '', changeReq: false, status: 'todo', due: off(0), since: off(0), ...o }), silent ? null : 'Tarefa criada'); return id; },")
rep("    setRole: (id, role) => commit(d => { d.people.find(p => p.id === id).role = role; }, 'Nível de acesso alterado'),\n  };", open('p_act.txt',encoding='utf-8').read())
rep("      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && me) { e.preventDefault(); setPalette(p => !p); }", open('p_keys.txt',encoding='utf-8').read())
rep("theme, setTheme, sideOpen, setSideOpen, mainRef };", "theme, setTheme, sideOpen, setSideOpen, mainRef, copilot, setCopilot, live, setLive, rail, setRail };")
start=s.index("function TeamShell() {"); end=s.index("/* ================= linhas ================= */")
s=s[:start]+open('p_shell.txt',encoding='utf-8').read()+s[end:]
rep("  const tabs = [['overview', 'Visão geral'], ['tasks', 'Tarefas', nTasks], ['posts', 'Postagens', nPosts], ['scripts', 'Roteiros', nScripts], ['calendar', 'Calendário'], ['process', 'Processos'], ['links', 'Links', c.links.length]];",
    "  const CNT = { tasks: nTasks, posts: nPosts, scripts: nScripts, links: c.links.length, boards: db.boards.filter(b => b.clientId === id).length, funnels: db.funnels.filter(f => f.clientId === id).length };\n  const tabs = CLIENT_TABS.map(([k, l]) => [k, l, CNT[k]]);")
rep("    case 'links': view = html`<${LinksTab} c=${c} />`; break;",
    "    case 'links': view = html`<${LinksTab} c=${c} />`; break;\n    case 'meetings': view = html`<${MeetingsView} clientId=${id} />`; break;\n    case 'boards': view = html`<${BoardsList} clientId=${id} />`; break;\n    case 'funnels': view = html`<${FunnelsList} clientId=${id} />`; break;")
rep("  const tasks = db.tasks.filter(t => t.clientId === c.id && (!who || t.assignee === who));",
    "  const [cf, setCf] = useState(null);\n  const tasks = db.tasks.filter(t => (c ? t.clientId === c.id : (!cf || t.clientId === cf)) && (!who || t.assignee === who));")
rep("act.addTask({ title: txt.trim(), status: st, clientId: c.id, assignee: me.id, due: null });", "act.addTask({ title: txt.trim(), status: st, clientId: c ? c.id : (cf || db.clients[0].id), assignee: me.id, due: null });")
rep("""    <div class="toolbar">
      <div class="seg"><button class=${cx(view === 'board' && 'on')}""", """    <div class="toolbar">
      ${!c && html`<${ClientFilter} value=${cf} onChange=${setCf} />`}
      <div class="seg"><button class=${cx(view === 'board' && 'on')}""")
rep("          <span class=\"t\">${t.title}</span>\n", "          <span class=\"t\">${t.title}</span>\n          ${!c && html`<${CChip} id=${t.clientId} />`}\n")
rep("  const [f, setF] = useState('all');\n  const flt = POST_FILTERS", "  const [f, setF] = useState('all'); const [cf, setCf] = useState(null);\n  const mine = p => c ? p.clientId === c.id : (!cf || p.clientId === cf);\n  const flt = POST_FILTERS")
rep("const posts = db.posts.filter(p => p.clientId === c.id && (!flt || flt.includes(p.status)))", "const posts = db.posts.filter(p => mine(p) && (!flt || flt.includes(p.status)))")
rep("${db.posts.filter(p => p.clientId === c.id && (!s || s.includes(p.status))).length}", "${db.posts.filter(p => mine(p) && (!s || s.includes(p.status))).length}")
rep("<div class=\"toolbar\"><div class=\"filter-chips\">${POST_FILTERS", "<div class=\"toolbar\">${!c && html`<${ClientFilter} value=${cf} onChange=${setCf} />`}<div class=\"filter-chips\">${POST_FILTERS")
rep("<button class=\"btn pri\" onClick=${() => act.addPost(c.id)}>", "<button class=\"btn pri\" onClick=${() => act.addPost(c ? c.id : (cf || db.clients[0].id))}>")
rep("<${Thumb} p=${p} /><span class=\"pt\">${p.title}</span>", "<${Thumb} p=${p} /><span class=\"pt\">${p.title}</span>${!c && html`<${CChip} id=${p.clientId} />`}")
rep("  const list = db.scripts.filter(s => s.clientId === c.id);", "  const [cf, setCf] = useState(null);\n  const list = db.scripts.filter(s => c ? s.clientId === c.id : (!cf || s.clientId === cf));")
rep("<div class=\"toolbar\"><span class=\"muted\">Caixinhas, Reels e anúncios.", "<div class=\"toolbar\">${!c && html`<${ClientFilter} value=${cf} onChange=${setCf} />`}<span class=\"muted\">Caixinhas, Reels e anúncios.")
rep("onClick=${() => act.addScript(c.id)}>", "onClick=${() => act.addScript(c ? c.id : (cf || db.clients[0].id))}>")
rep("<span class=\"t\">${s.title}</span><span class=\"m\" style=\"margin-top:6px\">", "<span class=\"t\">${s.title}</span><span class=\"m\" style=\"margin-top:6px\">${!c && html`<${CChip} id=${s.clientId} />`}")
rep("  const items = calItems(db, c.id, false).filter(i => !hide.includes(i.kind));", "  const [cf, setCf] = useState(null);\n  const items = (c ? [c.id] : db.clients.filter(x => !cf || x.id === cf).map(x => x.id)).flatMap(id => calItems(db, id, false)).filter(i => !hide.includes(i.kind));")
rep("  const legend = html`<div class=\"legend\">${KINDS", "  const legend = html`<div class=\"legend\">${!c && html`<${ClientFilter} value=${cf} onChange=${setCf} />`}${KINDS")
rep("function Docs({ pages, editable, clientPage, lang }) {\n  const [sel, setSel] = useState(pages[0] && pages[0].id);", "function Docs({ pages, editable, clientPage, lang, initial }) {\n  const [sel, setSel] = useState(initial || (pages[0] && pages[0].id));")
rep("<${Docs} pages=${db.pages.filter(p => p.clientId === null)} editable />", "<${Docs} pages=${db.pages.filter(p => p.clientId === null)} editable initial=${pid} />")
start=s.index("function DrawerHost() {"); end=s.index("function Title({ value, onSave }) {")
s=s[:start]+open('p_drawer.txt',encoding='utf-8').read()+s[end:]
rep("  else if (modal.t === 'invitePerson') inner = html`<${InvitePerson} close=${close} />`;",
    "  else if (modal.t === 'invitePerson') inner = html`<${InvitePerson} close=${close} />`;\n  else if (modal.t === 'newTask') inner = html`<${NewTask} close=${close} clientId=${modal.clientId} />`;\n  else if (modal.t === 'newFunnel') inner = html`<${NewFunnel} close=${close} clientId=${modal.clientId} />`;")
rep("  const { db, go, open, setPalette, setModal, can, setPreview, theme, setTheme } = useApp();", "  const { db, go, open, setPalette, setModal, can, setPreview, theme, setTheme, setCopilot } = useApp();")
rep("    db.clients.forEach(c => { L.push(['Clientes',", open('p_pal.txt',encoding='utf-8').read())
rep("all.filter(x => x[0] === 'Ações' || x[0] === 'Clientes')", "all.filter(x => x[0] === 'Ações' || x[0] === 'Ir para' || x[0] === 'Clientes')")
rep("  const { db, setSession, theme, setTheme } = useApp();\n  const c = db.clients.find(x => x.id === clientId);\n  const [lang, setLang] = useState(c.lang);",
    "  const { db, setSession, theme, setTheme, copilot, setCopilot } = useApp();\n  const c = db.clients.find(x => x.id === clientId);\n  const [lang, setLang] = useState(c.lang);")
rep("    <div class=\"p-scroll\" ref=${scRef}><div class=\"p-body\">${view}</div></div>\n  </div>`;",
    "    <div class=\"p-scroll\" ref=${scRef}><div class=\"p-body\">${view}</div></div>\n    ${!preview && (copilot.open ? html`<${Copilot} floating />` : html`<button class=\"p-ask\" onClick=${() => setCopilot(x => ({ ...x, open: true }))}><${Icon} n=\"sparkle\" s=${16} />${lang === 'en' ? 'Ask' : 'Pergunte'}</button>`)}\n  </div>`;")
assert 'function Sidebar()' not in s
v2=v2.replace("${it('file', 'Página de processo', () => { act.addPage(null); go({ v: 'wiki' }); })}", "${it('file', 'Página de processo', () => { const id = act.addPage(null); go({ v: 'wiki', pid: id }); })}")
rep("render(html`<${App} />`, document.getElementById('app'));", v2+"\nrender(html`<${App} />`, document.getElementById('app'));")
open(p,'w',encoding='utf-8').write(s); print('ok', len(s))
