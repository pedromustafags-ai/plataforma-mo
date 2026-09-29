p='src.html'; s=open(p,encoding='utf-8').read()
v7=open('v7.js',encoding='utf-8').read(); css=open('css_v7.txt',encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt, ('COUNT', s.count(a), a[:140]); s=s.replace(a,b)
# ---------- tema: abre claro, menu lateral cor de areia ----------
rep("""  areia: { name: 'Areia', mode: 'light', mo: true, bg: '#F2F0EF', surface: '#FBFAF8', surface2: '#E9E6E2', line: '#E2DBD0', lineStrong: '#D3C5AE', text: '#222831', text2: '#454A52', text3: '#6A655D', primary: '#222831', onPrimary: '#F4EBDD', accent: '#948979',
    side: SD('#222831', '#C9C2B6', '#F2F0EF', '#2B313A', '#393E46', '#2B313A', '#48505A', '#A8A195', '#DFD0B8', '#222831', ['#DFD0B8', '#222831', '#F2F0EF']) },""",
"""  areia: { name: 'Areia', mode: 'light', mo: true, bg: '#F6F4F1', surface: '#FFFFFF', surface2: '#EFEBE6', line: '#E7E0D6', lineStrong: '#D8CCBB', text: '#222831', text2: '#454A52', text3: '#665F56', primary: '#222831', onPrimary: '#F4EBDD', accent: '#948979',
    side: SD('#EEE4D3', '#3E434B', '#222831', '#E6D9C3', '#DFD0B8', '#E3D6C2', '#D3C5AE', '#655D52', '#222831', '#F4EBDD', ['#222831', '#EEE4D3', '#222831']) },""")
rep("""  --bg:#F2F0EF;--surface:#FBFAF8;--surface-2:#E9E6E2;--hover:rgba(34,40,49,.05);--line:#E2DBD0;--line-strong:#D3C5AE;
  --text:#222831;--text-2:#454A52;--text-3:#6A655D;
  --primary:#222831;--on-primary:#F4EBDD;--focus:#948979;--taupe:#948979;
  --side-bg:#222831;--side-text:#C9C2B6;--side-strong:#F2F0EF;--side-hover:#2B313A;--side-active:#393E46;--side-line:#2B313A;--side-label:#A8A195;""",
"""  --bg:#F6F4F1;--surface:#FFFFFF;--surface-2:#EFEBE6;--hover:rgba(34,40,49,.05);--line:#E7E0D6;--line-strong:#D8CCBB;
  --text:#222831;--text-2:#454A52;--text-3:#665F56;
  --primary:#222831;--on-primary:#F4EBDD;--focus:#948979;--taupe:#948979;
  --side-bg:#EEE4D3;--side-text:#3E434B;--side-strong:#222831;--side-hover:#E6D9C3;--side-active:#DFD0B8;--side-line:#E3D6C2;--side-label:#655D52;""")
rep("useState(() => lsGet('mo.look', { mode: document.documentElement.dataset.theme || 'auto', light: 'areia', dark: 'grafite' }));", "useState(() => lsGet('mo.look2', { mode: 'light', light: 'areia', dark: 'grafite' }));")
rep("const setLook = v => { setLookS(v); lsSet('mo.look', v); };", "const setLook = v => { setLookS(v); lsSet('mo.look2', v); };")
rep('<meta name="viewport" content="width=device-width, initial-scale=1">\n', """<meta name="viewport" content="width=device-width, initial-scale=1">
<script>try{var l=JSON.parse(localStorage.getItem('mo.look2')||'null');document.documentElement.dataset.theme=l&&(l.mode==='dark'||(l.mode==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches))?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}</script>
""")
# ---------- ações novas ----------
a="    decide: (k, id, ok, text, slide) => commit(d => {"
rep(a, """    addClientPerson: (cid, f, msg) => commit(d => d.people.push({ id: uid('u'), name: f.name, ini: initials(f.name), role: 'cliente', clientId: cid, func: f.func || '', perm: f.perm || 'equipe', email: f.email || '', invited: true }), msg || `Convite enviado para ${f.name}`, false),
    removeClientPerson: (pid, msg) => commit(d => { d.people = d.people.filter(x => x.id !== pid); d.clients.forEach(c => { const o = c.flows && c.flows.owners; if (o) Object.keys(o).forEach(k => { if (o[k] === pid) o[k] = null; }); }); d.tasks.forEach(t => { if (t.assignee === pid && t.status !== 'done') t.assignee = null; }); }, msg),
    portalNew: (k, cid, by, title, msg) => { const id = uid(k === 'post' ? 'p' : 's'); commit(d => { const c = d.clients.find(x => x.id === cid); const who = by || c.owner; if (k === 'post') d.posts.unshift({ id, n: 99, from: 'client', clientId: cid, title, status: 'ideia', stage: null, media: [], format: 'Carrossel', assignee: who, comments: [], date: null, caption: '', cta: '', imgs: [], sentAt: null, since: off(0) }); else d.scripts.unshift({ id, from: 'client', clientId: cid, title, kind: 'Reel', lang: c.lang || 'pt', status: 'rascunho', stage: null, media: [], format: '', angle: '', assignee: who, comments: [], sentAt: null, record: null, since: off(0), tpl: 'livre', blocks: [['', '']] }); }, msg); return id; },
    portalAdvance: (k, id, by, msg) => { const d0 = dbRef.current; const x0 = itemOf(d0, k, id); const c0 = d0.clients.find(y => y.id === x0.clientId); const nx = nextOf(flowFor(c0, k), x0.stage); if (!nx) return; const own = ownerOf(c0, nx.key);
      commit(d => { moveTo(d, k, itemOf(d, k, id), nx.key); if (own && own !== by && nx.type !== 'client') notify(d, own, by, `passou para você (${nx.label.toLowerCase()}):`, k, id); }, msg); },
"""+a)
# ---------- pessoas: a equipe da M&O separada da equipe do cliente ----------
rep("""function PersonSel({ value, onChange, id }) {
  const { db } = useApp();
  return html`<select class="sel" id=${id} value=${value} onChange=${e => onChange(e.target.value)}>${db.people.map(p => html`<option value=${p.id}>${p.name}</option>`)}</select>`;""",
"""function PersonSel({ value, onChange, id, clientId }) {
  const { db } = useApp(); const cp = clientId ? clientPeople(db, clientId) : [];
  return html`<select class="sel" id=${id} value=${value} onChange=${e => onChange(e.target.value)}>${teamOf(db).map(p => html`<option value=${p.id}>${p.name}</option>`)}${cp.length > 0 && html`<optgroup label=${'Equipe de ' + db.clients.find(x => x.id === clientId).name}>${cp.map(p => html`<option value=${p.id}>${p.name}</option>`)}</optgroup>`}</select>`;""")
rep('<${PersonSel} id="t-who" value=${t.assignee}', '<${PersonSel} id="t-who" clientId=${t.clientId} value=${t.assignee}')
rep('<${PersonSel} id="p-who" value=${p.assignee}', '<${PersonSel} id="p-who" clientId=${p.clientId} value=${p.assignee}')
rep('<${PersonSel} id="s-who" value=${s.assignee}', '<${PersonSel} id="s-who" clientId=${s.clientId} value=${s.assignee}')
rep("  const load = db.people.map(p => {", "  const load = teamOf(db).map(p => {")
rep('<div class="people-filter" role="group" aria-label="Filtrar por pessoa">${db.people.map(', '<div class="people-filter" role="group" aria-label="Filtrar por pessoa">${teamOf(db).map(')
rep('<section class="sec"><div class="sec-h"><h2>Pessoas</h2><span class="c">${db.people.length}</span></div>\n      <div class="pgrid2">${db.people.map(p => {',
    '<section class="sec"><div class="sec-h"><h2>Pessoas</h2><span class="c">${teamOf(db).length}</span></div>\n      <div class="pgrid2">${teamOf(db).map(p => {')
rep("const people = db.people.map(p => p.name).join(', ');", "const people = teamOf(db).map(p => p.name).join(', ');")
rep("""<option value="">Sem responsável</option>${db.people.map(p => html`<option key=${p.id} value=${p.id}>${p.name}</option>`)}</select>""",
    """<option value="">Sem responsável</option>${teamOf(db).map(p => html`<option key=${p.id} value=${p.id}>${p.name}</option>`)}${clientPeople(db, clientId).length > 0 && html`<optgroup label=${'Equipe de ' + c.name}>${clientPeople(db, clientId).map(p => html`<option key=${p.id} value=${p.id}>${p.name}${p.func ? ' (' + p.func + ')' : ''}</option>`)}</optgroup>`}</select>""")
rep("""<dt>Links</dt><dd><button class="linkbtn" onClick=${() => setTab('links')}>${plural(c.links.length, 'link')}</button></dd></dl></section>""",
    """<dt>Links</dt><dd><button class="linkbtn" onClick=${() => setTab('links')}>${plural(c.links.length, 'link')}</button></dd></dl></section>
        <${ClientTeam} c=${c} canEdit=${true} />""")
# ---------- login: a equipe do cliente também entra ----------
rep("""    ...db.clients.map(c => ({ s: { role: 'cliente', clientId: c.id }, c, name: c.name, lvl: 'Cliente', what: 'Vê só o próprio painel' + (c.lang !== 'pt' ? `, em ${LANG_PT[c.lang]}` : '') + '.' })),""",
    """    ...db.clients.flatMap(c => [{ s: { role: 'cliente', clientId: c.id }, c, name: c.name, lvl: 'Cliente', what: 'Vê só o próprio painel' + (c.lang !== 'pt' ? `, em ${LANG_PT[c.lang]}` : '') + '.' },
      ...clientPeople(db, c.id).map(p => ({ s: { role: 'cliente', clientId: c.id, userId: p.id }, c, person: true, ini: p.ini, name: p.name, lvl: p.perm === 'aprova' ? 'Cliente' : 'Equipe do cliente', what: `${p.func || 'Equipe'} de ${c.name}. Vê a produção e o que está com ${p.name.split(' ')[0]}.` }))]),""")
rep("  const blc = bl && db.clients.find(x => x.id === bl);\n  if (blc) return html`<${BrandedLogin} c=${blc} back=${() => setBl(null)} enter=${() => enter({ role: 'cliente', clientId: blc.id })} />`;",
    "  const blc = bl && db.clients.find(x => x.id === bl.clientId);\n  if (blc) return html`<${BrandedLogin} c=${blc} back=${() => setBl(null)} enter=${() => enter(bl)} />`;")
rep("""      ${accs.map(a => html`<button class="role" key=${a.name} onClick=${() => a.c ? setBl(a.c.id) : enter(a.s)}>
        ${a.c ? html`<${CMark} c=${a.c} lg />` : html`<span class="av lg">${a.ini}</span>`}""",
    """      ${accs.map(a => html`<button class="role" key=${a.name + (a.s.userId || '')} onClick=${() => a.c ? setBl(a.s) : enter(a.s)}>
        ${a.c && !a.person ? html`<${CMark} c=${a.c} lg />` : html`<span class="av lg">${a.ini}</span>`}""")
# ---------- painel do cliente ----------
rep("""function Portal({ clientId, preview }) {
  const { db, setSession } = useApp();""", """function Portal({ clientId, preview }) {
  const { db, setSession, session } = useApp();
  const who = session && session.userId ? db.people.find(p => p.id === session.userId) : null;
  const [piece, setPiece] = useState(null); const openPiece = (k, id) => setPiece({ k, id });""")
rep("""  const pending = [...db.posts.filter(p => p.clientId === clientId && p.status === 'cliente'), ...db.scripts.filter(s => s.clientId === clientId && s.status === 'cliente'), ...db.tasks.filter(x => x.clientId === clientId && x.status === 'client')].length;
  const tabs = [['home', t.forYou, 'home', pending], ['cal', t.cal, 'cal'],""",
"""  const pending = (canApproveAs(who) ? [...db.posts.filter(p => p.clientId === clientId && p.status === 'cliente'), ...db.scripts.filter(s => s.clientId === clientId && s.status === 'cliente'), ...db.tasks.filter(x => x.clientId === clientId && x.status === 'client')].length : 0) + (who ? db.tasks.filter(x => x.assignee === who.id && x.status !== 'done' && x.piece).length : 0);
  const PL = PX[lang] || PX.pt;
  const tabs = [['home', t.forYou, 'home', pending], ['board', PL.board, 'board'], ['cal', t.cal, 'cal'],""")
rep("""  if (tab === 'cal') view = html`<${PortalCal} c=${c} lang=${lang} />`;
  else if (tab === 'content') view = html`<${PortalContent} c=${c} lang=${lang} />`;""",
"""  if (tab === 'cal') view = html`<${PortalCal} c=${c} lang=${lang} openPiece=${openPiece} goMeet=${() => pick('meet')} />`;
  else if (tab === 'board') view = html`<${PortalBoard} c=${c} lang=${lang} who=${who} openPiece=${openPiece} />`;
  else if (tab === 'team') view = html`<${ClientTeam} c=${c} lang=${lang} asClient canEdit=${canApproveAs(who)} />`;
  else if (tab === 'content') view = html`<${PortalContent} c=${c} lang=${lang} openPiece=${openPiece} />`;""")
rep("""  else view = html`<${PortalHome} c=${c} lang=${lang} goCal=${() => pick('cal')} />`;""", """  else view = html`<${PortalHome} c=${c} lang=${lang} goCal=${() => pick('cal')} who=${who} openPiece=${openPiece} />`;""")
rep("""${menu && html`<div class="pop"><button onClick=${() => { pick('brand'); setMenu(false); }}><${Icon} n="sliders" />${t.personalize}</button>""",
    """${menu && html`<div class="pop">${who && html`<div class="pop-who"><b>${who.name}</b><small>${who.func || PL.team}</small></div>`}<button onClick=${() => { pick('team'); setMenu(false); }}><${Icon} n="users" />${PL.team}</button><button onClick=${() => { pick('brand'); setMenu(false); }}><${Icon} n="sliders" />${t.personalize}</button>""")
rep("""    ${ask && html`<${RequestSheet} c=${c} lang=${lang} close=${() => setAsk(false)} />`}
  </div>`;""", """    ${ask && html`<${RequestSheet} c=${c} lang=${lang} close=${() => setAsk(false)} />`}
    ${piece && html`<${PortalPiece} k=${piece.k} id=${piece.id} c=${c} lang=${lang} who=${who} close=${() => setPiece(null)} />`}
  </div>`;""")
rep("""<div class="p-scroll" ref=${scRef}><div class="p-body">${view}""", """<div class="p-scroll" ref=${scRef}><div class=${cx('p-body', tab === 'board' && 'wide')}>${view}""")
# "Para você"
rep("function PortalHome({ c, lang, goCal }) {", "function PortalHome({ c, lang, goCal, who, openPiece }) {")
rep("""  const items = [
    ...db.posts.filter(p => p.clientId === c.id && p.status === 'cliente').map(x => ['post', x]),""", """  const all = [
    ...db.posts.filter(p => p.clientId === c.id && p.status === 'cliente').map(x => ['post', x]),""")
rep("""    ...db.tasks.filter(x => x.clientId === c.id && x.status === 'client').map(x => ['task', x]),
  ];
  const decide =""", """    ...db.tasks.filter(x => x.clientId === c.id && x.status === 'client').map(x => ['task', x]),
  ];
  const items = canApproveAs(who) ? all : []; const P = PX[lang] || PX.pt;
  const decide =""")
rep("""<div class="hello"><h1>${t.hello}${c.contact && c.contact !== '—' && c.id !== 'mo' ? ', ' + c.contact.split(' ')[0] : ''}.</h1><p>${items.length ? t.waiting(items.length) : t.clearSub}</p></div>""",
    """<div class="hello"><h1>${t.hello}${who ? ', ' + who.name.split(' ')[0] : c.contact && c.contact !== '—' && c.id !== 'mo' ? ', ' + c.contact.split(' ')[0] : ''}.</h1><p>${items.length ? t.waiting(items.length) : !canApproveAs(who) && all.length ? P.othersAppr(all.length) : t.clearSub}</p></div>
    <${PortalTasks} c=${c} lang=${lang} who=${who} openPiece=${openPiece} />""")
rep("""      ${!items.length && html`<div class="card allclear">""", """      ${!items.length && canApproveAs(who) && html`<div class="card allclear">""")
rep("""<div class="upnext">${next.map(p => html`<div class="pcard" key=${p.id}><${Thumb} p=${p} pillText=${t.st[p.status]} tone=${PTONE[p.status]} /><span class="pt">${p.title}</span><span class="pd">${t.goes(fmt(p.date, lang))}</span></div>`)}</div>""",
    """<div class="upnext">${next.map(p => html`<button class="pcard" key=${p.id} onClick=${() => openPiece('post', p.id)}><${Thumb} p=${p} pillText=${t.st[p.status]} tone=${PTONE[p.status]} /><span class="pt">${p.title}</span><span class="pd">${t.goes(fmt(p.date, lang))}</span></button>`)}</div>""")
# conteúdo e calendário do cliente abrem a peça
rep("function PortalContent({ c, lang }) {", "function PortalContent({ c, lang, openPiece }) {")
rep("""<div class="p-grid">${posts.map(p => html`<div class="pcard" key=${p.id}><${Thumb} p=${p} pillText=${t.st[p.status]} tone=${PTONE[p.status]} /><span class="pt">${p.title}</span><span class="pd">${p.date ? fmt(p.date, lang) : ''}</span></div>`)}</div>""",
    """<div class="p-grid">${posts.map(p => html`<button class="pcard" key=${p.id} onClick=${() => openPiece('post', p.id)}><${Thumb} p=${p} pillText=${t.st[p.status]} tone=${PTONE[p.status]} /><span class="pt">${p.title}</span><span class="pd">${p.date ? fmt(p.date, lang) : ''}</span></button>`)}</div>""")
rep("""<div class="slist">${scripts.map(s => html`<div class="scard" key=${s.id} style="cursor:default">""", """<div class="slist">${scripts.map(s => html`<button class="scard" key=${s.id} onClick=${() => openPiece('script', s.id)}>""")
rep("""<span class="hook">${s.blocks[0][1]}</span></div>`)}</div>`}
    ${posts.length + scripts.length === 0""", """<span class="hook">${s.blocks[0][1]}</span></button>`)}</div>`}
    ${posts.length + scripts.length === 0""")
rep("function PortalCal({ c, lang }) {", "function PortalCal({ c, lang, openPiece, goMeet }) {")
rep("<${MonthGrid} items=${items} month=${month} setMonth=${setMonth} lang=${lang} onOpen=${() => {}} />", "<${MonthGrid} items=${items} month=${month} setMonth=${setMonth} lang=${lang} onOpen=${i => i.kind === 'meet' ? goMeet() : (i.k === 'post' || i.k === 'script') && openPiece(i.k, i.id)} />")
# MediaSection com título e nota opcionais
rep("function MediaSection({ k, x, readOnly, lang }) {", "function MediaSection({ k, x, readOnly, lang, title = 'Arquivos e links da peça', note = true }) {")
rep('<div class="sec-h" style="padding:0"><h2>Arquivos e links da peça</h2><span class="c">${list.length}</span></div>', '<div class="sec-h" style="padding:0"><h2>${title}</h2><span class="c">${list.length}</span></div>')
rep("${!readOnly && html`<p class=\"muted\" style=\"font-size:12px\">No protótipo,", "${!readOnly && note && html`<p class=\"muted\" style=\"font-size:12px\">No protótipo,")
# módulo e estilo
rep("render(html`<${App} />`, document.getElementById('app'));", v7+"\nrender(html`<${App} />`, document.getElementById('app'));")
rep("</style>", css+"</style>")
open(p,'w',encoding='utf-8').write(s); print('ok')
