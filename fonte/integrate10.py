import sys

S = open('src.html', encoding='utf-8').read()

def rep(old, new, n=1):
    global S
    c = S.count(old)
    if c != n:
        sys.exit(f'ERRO: esperava {n} ocorrência(s), achei {c}: {old[:90]!r}')
    S = S.replace(old, new)

def drop(name):
    """Tira a função antiga; a versão nova mora no v10.js."""
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
css = open('css_v10.txt', encoding='utf-8').read()
rep('\n</style>\n\n<div id="app"></div>', '\n' + css + '</style>\n\n<div id="app"></div>')
for name in ['CMark', 'NewClient', 'FlowSettings', 'PortalBoard', 'LinkCard', 'PortalLinks', 'Inbox']:
    drop(name)
v10 = open('v10.js', encoding='utf-8').read()
rep("\nrender(html`<${App} />`, document.getElementById('app'));", v10 + "\nrender(html`<${App} />`, document.getElementById('app'));")

# ---------- histórico: quem fez, o que fez ----------
rep("""    dbRef.current = next; setDbState(next);
    if (msg) toast(msg, undo ? prev : null);""",
"""    dbRef.current = next; setDbState(next);
    if (curAct.current) logAct(curAct.current, prev, next);
    if (msg) toast(msg, undo ? prev : null);""")
rep("const undoTo = t => { dbRef.current = t.snap; setDbState(t.snap); setToasts(ts => ts.filter(x => x.id !== t.id)); };",
    "const undoTo = t => { dbRef.current = t.snap; setDbState(t.snap); setToasts(ts => ts.filter(x => x.id !== t.id)); logPush({ at: Date.now(), by: actorId(), via: preview ? 'preview' : null, text: 'desfez \"' + t.msg + '\"' }); };")
rep("  const notify = (d, to, who, verb, k, ref) => d.notes.unshift({ id: uid('n'), to, who, verb, k, ref, at: off(0), read: false });",
"""  const notify = (d, to, who, verb, k, ref, x) => d.notes.unshift({ id: uid('n'), to, who, verb, k, ref, at: off(0), read: false, ...(x || {}) });
  const actorId = () => session && session.role === 'cliente' ? (session.userId || 'client:' + session.clientId) : (me ? me.id : null);
  const noteWho = by => /^client:/.test(String(by || '')) ? 'client' : by;
  const curAct = useRef(null); const logRef = useRef(null); if (!logRef.current) logRef.current = seedLog(db);
  const [logTick, setLogTick] = useState(0);
  const logPush = e => { const L = logRef.current; const last = L[0]; if (last && e.merge && last.merge === e.merge && last.by === e.by && e.at - last.at < 180000) L[0] = { ...last, ...e, id: last.id, n: (last.n || 1) + 1 }; else L.unshift({ id: uid('h'), ...e }); setLogTick(x => x + 1); };
  const logAct = (a, prev, next) => { const f = LOGD[a.name]; if (!f) return; let e = null; try { e = f(a.args, prev, next); } catch (er) {} if (e) logPush({ at: Date.now(), by: actorId(), via: preview ? 'preview' : null, ...e }); };""")
rep("""'Página criada'); return id; },
  };""",
"""'Página criada'); return id; },
    setAbout: (cid, patch) => commit(d => { const c = d.clients.find(x => x.id === cid); c.about = { ...(c.about || {}), ...patch }; }),
    portalLink: (cid, l, msg) => commit(d => { const c = d.clients.find(x => x.id === cid); const id = uid('l'); const by = actorId(); c.links.push({ id, ...l, shared: true, fromClient: true, by }); if (c.owner !== by) notify(d, c.owner, noteWho(by), 'adicionou um link no painel:', 'link', id, { cid, label: l.name }); }, msg),
    portalLinkEdit: (cid, lid, patch, msg) => commit(d => { const c = d.clients.find(x => x.id === cid); const l = c.links.find(x => x.id === lid); if (!l) return; Object.assign(l, patch); const by = actorId(); if (c.owner !== by) notify(d, c.owner, noteWho(by), 'editou um link no painel:', 'link', lid, { cid, label: l.name }); }, msg),
    portalLinkDel: (cid, lid, msg) => commit(d => { const c = d.clients.find(x => x.id === cid); const l = c.links.find(x => x.id === lid); if (!l) return; c.links = c.links.filter(x => x.id !== lid); const by = actorId(); if (c.owner !== by) notify(d, c.owner, noteWho(by), 'tirou um link do painel:', 'link', lid, { cid, label: l.name }); }, msg),
  };
  Object.keys(act).forEach(k => { const f = act[k]; act[k] = (...a) => { const p = curAct.current; curAct.current = { name: k, args: a }; try { return f(...a); } finally { curAct.current = p; } }; });""")
rep("  const ctx = { db, act, me, can, session,", "  const ctx = { db, act, me, can, log: logRef.current, logTick, session,")
rep("socio: new Set(['client.create', 'client.invite', 'people.invite', 'people.role', 'delete'])",
    "socio: new Set(['client.create', 'client.invite', 'people.invite', 'people.role', 'delete', 'log.view'])")

# ---------- cadastro: marca e nicho; o cliente avisa o time quando cria ----------
rep("contact: f.contact || '—', brand: { logo: null, logoDark: null, colors: [], primary: null, font: null, theme: { mode: 'light', light: 'papel', dark: 'carvao' } },",
    "contact: f.contact || '—', brand: newBrand(f.brand), about: { desc: '', niche: f.niche || '', needs: [], other: '', goals: [], limits: [], notes: '' },")
rep("tpl: 'livre', blocks: [['', '']] }); }, msg); return id; },",
    "tpl: 'livre', blocks: [['', '']] }); if (c.owner !== by) notify(d, c.owner, by || 'client', k === 'post' ? 'criou um post no painel:' : 'criou um roteiro no painel:', k, id); }, msg); return id; },")
rep("id: 'mo', name: 'M&O Company', lang: 'pt', owner: 'pedro', zero: true, contact: 'Pedro e Bruno',",
    "id: 'mo', name: 'M&O Company', lang: 'pt', owner: 'pedro', zero: true, contact: 'Pedro e Bruno', about: structuredClone(MO_ABOUT),")
rep("if (key === 'logo') { patch.logoIsDark = await logoIsDark(data);",
    "if (key === 'logo') { patch.logoIsDark = await logoIsDark(data); patch.logoRatio = await imgRatio(data);")
rep("${Slot('logo', t.logoLight, false)}${Slot('logoDark', t.logoDark, true)}</div>",
    "${Slot('logo', t.logoLight, false)}${Slot('logoDark', t.logoDark, true)}${Slot('icon', t.icon || 'Ícone', false)}</div>")

# ---------- navegação: aba Sobre e Histórico ----------
rep("['team', 'users', 'Equipe'], ['automations', 'zap', 'Automações']] },",
    "['team', 'users', 'Equipe'], ['automations', 'zap', 'Automações'], ['history', 'history', 'Histórico']] },")
rep("const items = s.items.filter(([v]) => !prefs.hidden.includes(v));",
    "const items = s.items.filter(([v]) => !prefs.hidden.includes(v) && (v !== 'history' || can('log.view')));")
rep("const CLIENT_TABS = [['overview', 'QG', 'grid'], ['tasks', 'Tarefas', 'tasks'],",
    "const CLIENT_TABS = [['overview', 'QG', 'grid'], ['about', 'Sobre', 'info'], ['tasks', 'Tarefas', 'tasks'],")
rep("""    case 'brand': view = html`<${BrandEditor} c=${c} lang="pt" />`; break;""",
    """    case 'brand': view = html`<${BrandEditor} c=${c} lang="pt" />`; break;
    case 'about': view = html`<${AboutTab} c=${c} />`; break;""")
rep('<div><h1>${c.name}</h1><div class="badges">',
    '<div><h1>${c.name}</h1>${c.about && c.about.niche && html`<p class="chead-niche">${c.about.niche}</p>`}<div class="badges">')
rep("""        <button class="btn" onClick=${() => setPreview({ clientId: id, device: 'mobile' })}><${Icon} n="eye" />Ver como o cliente</button>""",
    """        ${can('log.view') && html`<button class="btn" onClick=${() => go({ v: 'history', cid: id })}><${Icon} n="history" />Histórico</button>`}
        <button class="btn" onClick=${() => setPreview({ clientId: id, device: 'mobile' })}><${Icon} n="eye" />Ver como o cliente</button>""")
rep("""    case 'automations': view = html`<${Automations} />`; break;""",
    """    case 'automations': view = html`<${Automations} />`; break;
    case 'history': view = html`<${History} cid=${route.cid} key=${'h' + (route.cid || '')} />`; break;""")
rep("team: 'Equipe', automations: 'Automações' };", "team: 'Equipe', automations: 'Automações', history: 'Histórico' };")
rep("['automations', 'zap', 'Automações']].forEach(([v, ic, l]) => L.push(['Ir para', ic, l, '', () => go({ v })]));",
    "['automations', 'zap', 'Automações']].forEach(([v, ic, l]) => L.push(['Ir para', ic, l, '', () => go({ v })])); if (can('log.view')) L.push(['Ir para', 'history', 'Histórico', '', () => go({ v: 'history' })]);")

# ---------- painel do cliente: a escada interna sai da vista ----------
rep("""<div class="flowbar" role="list" aria-label=${P.stage}>${fl.stages.map((s, i) => html`<span key=${s.key} role="listitem" class=${cx('fb-step', i < idx && 'done', i === idx && 'on', s.type === 'client' && 'cli')}>${i < idx ? html`<${Icon} n="check" s=${11} />` : null}${stageT(lang, s.key)}</span>`)}</div>""",
    """<div class="flowbar" role="list" aria-label=${P.stage}><${ClientFlowBar} db=${db} c=${c} k=${k} x=${x} lang=${lang} /></div>""")
rep("""  else action = html`<span class="hint">${stageT(lang, st.key)} · ${P.with(own ? (who && own === who.id ? P.you : firstName(db, own)) : P.nobody)}</span>`;""",
    """  else action = !clientSees(db, c, st.key, k) ? html`<span class="hint">${clientStageName(db, c, k, st.key, lang)}</span>` : html`<span class="hint">${stageT(lang, st.key)} · ${P.with(own ? (who && own === who.id ? P.you : firstName(db, own)) : P.nobody)}</span>`;""")
rep("${st ? ' · ' + stageT(lang, st.key) : ' · ' + P.ideas}", "${st ? ' · ' + clientStageName(db, c, k, st.key, lang) : ' · ' + P.ideas}")

# ---------- links que o cliente adicionou aparecem marcados para o time ----------
rep("<${LinkCard} l=${l} key=${l.id} copied=${copied === l.id}", "<${LinkCard} l=${l} key=${l.id} tag=${l.fromClient ? 'adicionado pelo cliente' : null} copied=${copied === l.id}")

# ---------- Drive: seguir as partes da lista ----------
rep("""    const pl = await driveCall('search_files', { query: `parentId = '${ref.id}' and (mimeType contains 'image/' or mimeType = 'application/pdf' or mimeType = 'application/vnd.google-apps.presentation')`, pageSize: 40, excludeContentSnippets: true });
    const files = ((pl && pl.files) || []).sort(""",
    """    const files = (await driveList({ query: `parentId = '${ref.id}' and (mimeType contains 'image/' or mimeType = 'application/pdf' or mimeType = 'application/vnd.google-apps.presentation')`, pageSize: 40, excludeContentSnippets: true })).sort(""")
rep("try { const r = await mcp.callTool(SRV.drive, 'search_files', { query: `parentId = '${fi.folder}'`, pageSize: 12, excludeContentSnippets: true }); setFiles({ list: (r.payload && r.payload.files) || [] }); }",
    "try { setFiles({ list: (await driveList({ query: `parentId = '${fi.folder}'`, pageSize: 12, excludeContentSnippets: true }, 12, 4)).slice(0, 12) }); }")

# ---------- texto duplicado: o título editável se refaz a cada valor salvo ----------
rep("""html`<h1 contenteditable="true" data-ph="Sem título" onBlur=${e => act.setPageTitle(page.id, e.currentTarget.innerText.trim())}""",
    """html`<h1 key=${'t:' + page.id + ':' + page.title} contenteditable="true" data-ph="Sem título" onBlur=${e => act.setPageTitle(page.id, e.currentTarget.innerText.trim())}""")
rep("""return html`<div class="dtitle" contenteditable="true" data-ph="Sem título" onBlur=${e => { const v = e.currentTarget.innerText.trim(); if (v && v !== value) onSave(v); }}""",
    """return html`<div class="dtitle" key=${value} contenteditable="true" data-ph="Sem título" onBlur=${e => { const v = e.currentTarget.innerText.trim(); if (!v) { e.currentTarget.innerText = value; return; } if (v !== value) onSave(v); }}""")
rep("""<div class="cv-title" contenteditable="true" onBlur=${e => act.renameBoard(b.id, e.currentTarget.innerText.trim() || b.title)}""",
    """<div class="cv-title" key=${'b:' + b.title} contenteditable="true" onBlur=${e => { const v = e.currentTarget.innerText.trim(); if (!v) { e.currentTarget.innerText = b.title; return; } if (v !== b.title) act.renameBoard(b.id, v); }}""")
rep("""<div class="cv-title" contenteditable="true" onBlur=${e => act.setFunnel(f.id, { title: e.currentTarget.innerText.trim() || f.title })}""",
    """<div class="cv-title" key=${'f:' + f.title} contenteditable="true" onBlur=${e => { const v = e.currentTarget.innerText.trim(); if (!v) { e.currentTarget.innerText = f.title; return; } if (v !== f.title) act.setFunnel(f.id, { title: v }); }}""")

# ---------- personalizar a barra: o Histórico só aparece para quem pode ver ----------
rep("function SidePrefs({ prefs, setPrefs, close }) {\n  const move =", "function SidePrefs({ prefs, setPrefs, close }) {\n  const { can } = useApp();\n  const move =")
rep("${s && s.items.map(([v, , l]) =>", "${s && s.items.filter(([v]) => v !== 'history' || can('log.view')).map(([v, , l]) =>")

open('src.html', 'w', encoding='utf-8').write(S)
print('integrate10 ok')
