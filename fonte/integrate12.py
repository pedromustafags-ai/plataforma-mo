import sys

S = open('src.html', encoding='utf-8').read()

def rep(old, new, n=1):
    global S
    c = S.count(old)
    if c != n:
        sys.exit(f'ERRO: esperava {n} ocorrência(s), achei {c}: {old[:90]!r}')
    S = S.replace(old, new)

def rep_between(start, end, new):
    """Troca do início de `start` até o fim da primeira ocorrência de `end` depois dele."""
    global S
    if S.count(start) != 1:
        sys.exit(f'ERRO: início não único: {start[:80]!r}')
    a = S.find(start); b = S.find(end, a)
    if b < 0:
        sys.exit(f'ERRO: fim não achado: {end[:80]!r}')
    S = S[:a] + new + S[b + len(end):]

def drop(name):
    """Tira a função antiga; a versão nova mora nos módulos v12."""
    global S
    tag = '\nfunction ' + name + '('
    if S.count(tag) != 1:
        sys.exit(f'ERRO: função {name} não encontrada ou repetida')
    a = S.find(tag)
    b = S.find('\n}\n', a + 1)
    if '\nfunction ' in S[a + 1:b]:
        sys.exit(f'ERRO: o fim de {name} não foi achado antes da função seguinte')
    S = S[:a + 1] + S[b + 3:]

# ---------- CSS e módulos novos ----------
css = open('css_v12.txt', encoding='utf-8').read()
rep('\n</style>\n\n<div id="app"></div>', '\n' + css + '</style>\n\n<div id="app"></div>')
for name in ['ClientArea', 'NewMenu', 'Portal', 'PortalHome', 'ApprovalCard', 'BrandedLogin', 'MessageModal']:
    drop(name)
mods = ''.join(open(f, encoding='utf-8').read() for f in ['v12a.js', 'v12b.js', 'v12c.js', 'v12d.js'])
rep("\nrender(html`<${App} />`, document.getElementById('app'));", mods + "\nrender(html`<${App} />`, document.getElementById('app'));")

# ---------- app: endereço por tela, recentes, link do cliente, ações novas ----------
rep("""  const go = r => { setRoute(r); setDrawer(null); setSideOpen(false); if (mainRef.current) mainRef.current.scrollTop = 0; };
  const open = (k, id) => setDrawer({ k, id });""",
"""  const [recent, setRecent] = useState([]); const pushRecent = key => setRecent(r => [key, ...r.filter(x => x !== key)].slice(0, 6));
  const go = r => { setRoute(r); setDrawer(null); setSideOpen(false); if (mainRef.current) mainRef.current.scrollTop = 0; const rk = r.v === 'client' ? 'client:' + r.id : r.v === 'board' ? 'board:' + r.id : r.v === 'funnel' ? 'funnel:' + r.id : null; if (rk) pushRecent(rk); };
  const open = (k, id) => { setDrawer({ k, id }); if (k !== 'meeting') pushRecent(k + ':' + id); };
  const initRoute = useRef(null); const [deep, setDeep] = useState(null);
  useEffect(() => { const s = parseHash(location.hash); if (!s) return; if (s.portal) { if (dbRef.current.clients.some(c => c.id === s.portal.clientId)) { setSession({ role: 'cliente', clientId: s.portal.clientId, via: 'link' }); setDeep(s.portal.piece); } } else initRoute.current = s; }, []);
  useEffect(() => { if (!session || session.role === 'cliente') return; const h = routeHash(route, drawer); try { if (location.hash.slice(1) !== h) history.pushState(null, '', '#' + h); } catch (e) {} }, [route, drawer, session]);
  useEffect(() => { const h = () => { const s = parseHash(location.hash); if (!s || s.portal) return; setRoute(s.route); setDrawer(s.drawer); }; addEventListener('popstate', h); return () => removeEventListener('popstate', h); }, []);""")
rep("  Object.keys(act).forEach(k => { const f = act[k]; act[k] = (...a) =>",
    "  Object.assign(act, actV12({ commit, notify, me, dbRef }));\n  Object.keys(act).forEach(k => { const f = act[k]; act[k] = (...a) =>")
rep("const ctx = { db, act, me, can, log: logRef.current,", "const ctx = { db, act, me, can, recent, initRoute, deep, setDeep, log: logRef.current,")
rep("else if (session.role === 'cliente') body = html`<${Portal} clientId=${session.clientId} />`;",
    "else if (session.role === 'cliente') body = html`<${Portal} clientId=${session.clientId} deep=${deep} />`;")
rep("""  const { db, setSession, go } = useApp();
  const [email, setEmail] = useState(''); const [sent, setSent] = useState(false); const [bl, setBl] = useState(null);
  const enter = s => { setSession(s); go({ v: s.role === 'socio' ? 'overview' : 'myday' }); };""",
"""  const { db, setSession, go, open, initRoute } = useApp();
  const [email, setEmail] = useState(''); const [sent, setSent] = useState(false); const [bl, setBl] = useState(null);
  const enter = s => { setSession(s); const ir = initRoute.current; initRoute.current = null; if (s.role !== 'cliente' && ir) { go(ir.route); if (ir.drawer) open(ir.drawer.k, ir.drawer.id); } else go({ v: s.role === 'socio' ? 'overview' : 'myday' }); };""")

# ---------- barra do time: Visão geral no topo, cliente numa linha só ----------
rep("{ id: 'company', label: 'Empresa', items: [['overview', 'grid', 'Visão geral'], ['wiki',", "{ id: 'company', label: 'Empresa', items: [['wiki',")
rep("    ${N('inbox', 'inbox', 'Caixa de entrada', unread)}\n", "    ${N('inbox', 'inbox', 'Caixa de entrada', unread)}\n    ${N('overview', 'grid', 'Visão geral', 0)}\n")
rep_between("      ${!collapsed('clients') && db.clients.map(c => { const isOpen = !!prefs.open[c.id];", "      </div>`; })}\n",
"""      ${!collapsed('clients') && db.clients.map(c => { const here = route.v === 'client' && route.id === c.id; return html`<button key=${c.id} class=${cx('nav', here && 'on')} title=${c.name} aria-current=${here ? 'page' : null} onClick=${() => go({ v: 'client', id: c.id, tab: 'overview' })}><${CMark} c=${c} /><span class="lb">${c.name}</span>${waiting(c.id) ? html`<span class="n soft" title="Esperando o cliente">${waiting(c.id)}</span>` : null}</button>`; })}
""")

# ---------- busca: recentes antes de digitar ----------
rep("  const res = (q ? all.filter(x => norm(x[2] + ' ' + x[3] + ' ' + x[0]).includes(norm(q))) : all.filter(x => x[0] === 'Ações' || x[0] === 'Ir para' || x[0] === 'Clientes')).slice(0, 40);",
"""  const recentL = (app.recent || []).map(key => { const i = key.indexOf(':'); const k = key.slice(0, i), id = key.slice(i + 1); if (k === 'client') { const c = db.clients.find(x => x.id === id); return c && ['Recentes', 'building', c.name, 'cliente', () => go({ v: 'client', id, tab: 'overview' })]; } const t = favTarget(db, key); return t && ['Recentes', t.icon, t.title, { task: 'tarefa', post: 'post', script: 'roteiro', board: 'quadro', funnel: 'funil', page: 'página' }[k] || '', () => (t.route ? go(t.route) : open(t.drawer.k, t.drawer.id))]; }).filter(Boolean);
  const res = (q ? all.filter(x => norm(x[2] + ' ' + x[3] + ' ' + x[0]).includes(norm(q))) : [...recentL, ...all.filter(x => x[0] === 'Ações' || x[0] === 'Ir para' || x[0] === 'Clientes')]).slice(0, 40);""")

# ---------- modais novos ----------
rep("  else if (modal.t === 'newFunnel') inner = html`<${NewFunnel} close=${close} clientId=${modal.clientId} />`;",
"""  else if (modal.t === 'newFunnel') inner = html`<${NewFunnel} close=${close} clientId=${modal.clientId} />`;
  else if (modal.t === 'pickClient') inner = html`<${PickClient} close=${close} k=${modal.k} />`;
  else if (modal.t === 'report') inner = html`<${ReportEditor} close=${close} clientId=${modal.clientId} />`;""")

# ---------- criar post e roteiro fora de um cliente pergunta qual ----------
rep("function PostsTab({ c }) {\n  const { db, act, open } = useApp();", "function PostsTab({ c }) {\n  const { db, act, open, setModal } = useApp();")
rep("<button class=\"btn pri\" onClick=${() => act.addPost(c ? c.id : (cf || db.clients[0].id))}>",
    "<button class=\"btn pri\" onClick=${() => (!c && !cf && db.clients.length > 1 ? setModal({ t: 'pickClient', k: 'post' }) : act.addPost(c ? c.id : (cf || db.clients[0].id)))}>")
rep("function ScriptsTab({ c }) {\n  const { db, act, open } = useApp();", "function ScriptsTab({ c }) {\n  const { db, act, open, setModal } = useApp();")
rep("<button class=\"btn pri\" onClick=${() => act.addScript(c ? c.id : (cf || db.clients[0].id))}>",
    "<button class=\"btn pri\" onClick=${() => (!c && !cf && db.clients.length > 1 ? setModal({ t: 'pickClient', k: 'script' }) : act.addScript(c ? c.id : (cf || db.clients[0].id)))}>")

# ---------- gaveta da peça: cliente trocável e as rodadas ----------
rep('<dt>Responsável</dt><dd><${PersonSel} id="p-who" clientId=${p.clientId} value=${p.assignee} onChange=${v => set({ assignee: v })} /></dd>',
    '<dt>Responsável</dt><dd><${PersonSel} id="p-who" clientId=${p.clientId} value=${p.assignee} onChange=${v => set({ assignee: v })} /></dd>\n          <dt>Cliente</dt><dd><${ClientSel} k="post" x=${p} /></dd>')
rep('<dt>Responsável</dt><dd><${PersonSel} id="s-who" clientId=${s.clientId} value=${s.assignee} onChange=${v => set({ assignee: v })} /></dd>',
    '<dt>Responsável</dt><dd><${PersonSel} id="s-who" clientId=${s.clientId} value=${s.assignee} onChange=${v => set({ assignee: v })} /></dd>\n      <dt>Cliente</dt><dd><${ClientSel} k="script" x=${s} /></dd>')
rep('<${FlowBar} k="post" x=${p} />', '<${FlowBar} k="post" x=${p} />\n    <${RoundsBar} k="post" x=${p} />')
rep('<${FlowBar} k="script" x=${s} />', '<${FlowBar} k="script" x=${s} />\n    <${RoundsBar} k="script" x=${s} />')
rep("${c.slide ? html`<span class=\"tag\">SLIDE ${c.slide}</span>` : null}<span>${rel(c.at)}</span>",
    "${c.slide ? html`<span class=\"tag\">SLIDE ${c.slide}</span>` : null}${c.round ? html`<span class=\"tag\">RODADA ${c.round}</span>` : null}${c.pin ? html`<span class=\"tag\">PONTO MARCADO</span>` : null}${c.detail ? html`<span class=\"tag\">DETALHE NA APROVAÇÃO</span>` : null}<span>${rel(c.at)}</span>")

# ---------- peça aberta no painel: rodadas, falar com a M&O e a próxima peça ----------
rep("function PortalPiece({ k, id, c, lang, who, close }) {\n  const { db, act } = useApp(); const P = PX[lang] || PX.pt; const t = TX[lang] || TX.pt;",
    "function PortalPiece({ k, id, c, lang, who, close, openPiece }) {\n  const { db, act, toast } = useApp(); const P = PX[lang] || PX.pt; const t = TX[lang] || TX.pt; const X = XT[lang] || XT.pt;")
rep("    <${ApprovalCard} k=${k} x=${x} lang=${lang} onDecide=${(ok, text, slide) => { act.decide(k, x.id, ok, text, slide); close(); }} /></div></div>`;",
    "    <${ApprovalCard} k=${k} x=${x} lang=${lang} onReview=${r => { act.review(k, x.id, r); toast(r.ok ? (r.detail ? X.detailT : t.approvedT) + ': ' + x.title : X.roundSent((x.rounds || 0) + 1, roundsOf(x))); const nx2 = pendingOf(db, c.id, who).find(([, y]) => y.id !== x.id); if (nx2 && openPiece) openPiece(nx2[0], nx2[1].id); else close(); }} onTalk=${tx => { act.talk(k, x.id, tx); toast(X.talkT); close(); }} /></div></div>`;")

# ---------- caixa de entrada: aviso que aponta para o cliente ----------
rep("  const refOf = n => n.k === 'link' ? { title: n.label || 'link', clientId: n.cid } : itemOf(db, n.k, n.ref);\n  const hit = n => { act.readNote(n.id); if (n.k === 'link') go({ v: 'client', id: n.cid, tab: 'links' }); else open(n.k, n.ref); };",
    "  const refOf = n => n.k === 'link' || n.k === 'client' ? { title: n.label || 'link', clientId: n.cid } : itemOf(db, n.k, n.ref);\n  const hit = n => { act.readNote(n.id); if (n.k === 'link') go({ v: 'client', id: n.cid, tab: 'links' }); else if (n.k === 'client') go({ v: 'client', id: n.cid, tab: 'about' }); else open(n.k, n.ref); };")

# ---------- QG: pacote do mês, relatório e canal de aviso ----------
rep("        <${DocsDrive} c=${c} />\n        <${Lists} c=${c} />", "        <${PackCard} c=${c} setTab=${setTab} />\n        <${ReportCard} c=${c} />\n        <${DocsDrive} c=${c} />\n        <${Lists} c=${c} />")
rep("<dt>Idioma do painel</dt><dd>${(LANGS.find(l => l[0] === c.lang) || [0, ''])[1]}</dd>",
    "<dt>Idioma do painel</dt><dd>${(LANGS.find(l => l[0] === c.lang) || [0, ''])[1]}</dd><dt>Avisar por</dt><dd><${NotifyChips} c=${c} /></dd>")

# ---------- aba Sobre: contrato e pacote ----------
rep('      <section class="ab-sec"><h2>Anotações</h2>', '      <${ContractSec} c=${c} />\n      <section class="ab-sec"><h2>Anotações</h2>')
rep("<dt>Entregas</dt><dd>${ent.length ? ent.join(', ') : '—'}</dd></dl>",
    "<dt>Entregas</dt><dd>${ent.length ? ent.join(', ') : '—'}</dd><dt>Avisar por</dt><dd>${((c.notify && c.notify.ch) || ['whatsapp']).map(k => CHN[k]).join(', ')}</dd><dt>Contrato</dt><dd>${c.contract && c.contract.fee ? (c.contract.currency || 'US$') + ' ' + c.contract.fee + ' por mês' : '—'}</dd><dt>Formulário de entrada</dt><dd>${c.intake && c.intake.done ? 'preenchido ' + rel(c.intake.at) : 'ainda não'}</dd></dl>")

# ---------- cadastro: onde fica o cliente e por onde avisar ----------
rep("const [f, setF] = useState({ name: '', lang: 'en', owner: me.id, contact: '', niche: '' });",
    "const [f, setF] = useState({ name: '', lang: 'en', owner: me.id, contact: '', niche: '', country: 'us', notify: ['email', 'sms'] });")
rep('<p class="muted" style="font-size:12px">É o idioma padrão do painel do cliente. Cada pessoa do cliente pode trocar. O time continua em português.</p></div>',
    '<p class="muted" style="font-size:12px">É o idioma padrão do painel do cliente. Cada pessoa do cliente pode trocar. O time continua em português.</p></div>\n      <${NotifyField} f=${f} setF=${setF} />')
rep("d.clients.push({ id, name: f.name, lang: f.lang, owner: f.owner, contact: f.contact || '—',",
    "d.clients.push({ id, name: f.name, lang: f.lang, owner: f.owner, contact: f.contact || '—', country: f.country || 'other', notify: { ch: f.notify && f.notify.length ? f.notify : ['email'], weekly: true },")

# ---------- dados de exemplo ----------
rep("id: 'mo', name: 'M&O Company', lang: 'pt', owner: 'pedro', zero: true,", "id: 'mo', name: 'M&O Company', lang: 'pt', owner: 'pedro', zero: true, country: 'br', notify: { ch: ['whatsapp'], weekly: true },")
rep("P(6, '\"Post more\"', 'ajuste', 7, { sent: -3, since: -1, comments: [{ by: 'client', slide: 5, text: 'Dá pra deixar a frase final mais curta?', at: off(-1) }] }),",
    "P(6, '\"Post more\"', 'ajuste', 7, { sent: -3, since: -1, rounds: 1, lastRound: { n: 1, items: [{ slide: 5, text: 'Dá pra deixar a frase final mais curta?' }], at: off(-1) }, comments: [{ by: 'client', slide: 5, round: 1, text: 'Dá pra deixar a frase final mais curta?', at: off(-1) }] }),")
rep("automations: { au0: true, au1: true, au2: true, au3: false }", "automations: { au0: true, au1: true, au2: true, au3: false, au4: true }")

# ---------- automações: a regra dos avisos ao cliente ----------
rep("    ${Card('au3', 'Resumo da segunda-feira',",
    """    ${Card('au4', 'Avisos ao cliente', 'Peça pronta para aprovar vira uma mensagem por lote, no canal de cada cliente, com um lembrete só e um resumo na segunda.', [['inbox', 'Peças prontas esperam o cliente'], ['msg', 'Uma mensagem para o lote, com o link que já é o acesso'], ['clock', 'Um lembrete só, dois dias depois'], ['cal', 'Resumo da semana, toda segunda às 9h']], html`<div class="auto-note">O canal sai do cadastro do cliente: WhatsApp no Brasil, e-mail e SMS nos EUA. O WhatsApp vai à mão pelo número da M&O, sem custo. Pela API do WhatsApp, a mensagem fora da janela de 24 horas é cobrada, e por isso o produto não manda WhatsApp sozinho. E-mail e SMS saem pelo sistema; o SMS nos EUA pede o registro A2P 10DLC.</div>`)}
    ${Card('au3', 'Resumo da segunda-feira',""")

open('src.html', 'w', encoding='utf-8').write(S)
print('ok', len(S))
