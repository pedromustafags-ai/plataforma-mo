
/* ================= v12: painel do cliente com 5 destinos ================= */
const MORE_TABS = ['proc', 'links', 'team', 'brand'];
function Portal({ clientId, preview, deep }) {
  const { db, setSession, session, setDeep } = useApp();
  const who = !preview && session && session.userId ? db.people.find(p => p.id === session.userId) : null;
  const [piece, setPiece] = useState(() => deep && pieceOf(db, deep.k, deep.id) ? deep : null); const openPiece = (k, id) => setPiece({ k, id });
  useEffect(() => { if (deep && setDeep) setDeep(null); }, []);
  const c = db.clients.find(x => x.id === clientId);
  const sysDark = useSysDark();
  const [lang, setLangS] = useState(() => lsGet('mo.lang.' + clientId, c.lang));
  const setLang = l => { setLangS(l); lsSet('mo.lang.' + clientId, l); };
  const [tab, setTab] = useState('home'); const [cview, setCview] = useState('list'); const [menu, setMenu] = useState(false); const [ask, setAsk] = useState(false);
  const scRef = useRef();
  const t = TX[lang] || TX.pt; const R = RQ[lang] || RQ.pt; const X = XT[lang] || XT.pt; const th = clientTheme(c, sysDark); const sideDark = onDarkOf(th.side ? th.side.bg : th.surface2);
  const pending = pendingOf(db, clientId, who).length + (who ? db.tasks.filter(x => x.assignee === who.id && x.status !== 'done' && x.piece).length : 0);
  const PL = PX[lang] || PX.pt;
  const reports = (c.reports || []).filter(r => r.published);
  const tabs = [['home', t.forYou, 'home', pending], ['content', t.content, 'image'], ['meet', (MT[lang] || MT.pt).tab, 'video'], ...(reports.length ? [['results', X.results, 'chart']] : []), ['more', X.more, 'menu']];
  const isOn = k => tab === k || (k === 'more' && MORE_TABS.includes(tab));
  const pick = k => { setTab(k); if (scRef.current) scRef.current.scrollTop = 0; };
  let view;
  if (tab === 'content') view = html`<${PortalContentHub} c=${c} lang=${lang} who=${who} openPiece=${openPiece} cview=${cview} setCview=${setCview} goMeet=${() => pick('meet')} />`;
  else if (tab === 'team') view = html`<${ClientTeam} c=${c} lang=${lang} asClient canEdit=${canApproveAs(who)} />`;
  else if (tab === 'proc') view = html`<div class="sec" style="gap:18px"><h1 style="font-size:24px">${t.proc}</h1><${Docs} pages=${db.pages.filter(p => p.clientId === clientId)} clientPage lang=${lang} /></div>`;
  else if (tab === 'links') view = html`<${PortalLinks} c=${c} lang=${lang} />`;
  else if (tab === 'meet') view = html`<${PortalMeetings} c=${c} lang=${lang} />`;
  else if (tab === 'brand') view = html`<${BrandEditor} c=${c} lang=${lang} asClient />`;
  else if (tab === 'results') view = html`<${PortalResults} c=${c} lang=${lang} />`;
  else if (tab === 'more') view = html`<${PortalMore} lang=${lang} pick=${pick} />`;
  else view = html`<${PortalHome} c=${c} lang=${lang} goCal=${() => { setCview('cal'); pick('content'); }} who=${who} openPiece=${openPiece} />`;
  return html`<div class="portal" style=${portalStyle(c, th)}>
    <div class="p-frame">
    <aside class="p-side">
      <button class="p-brand" onClick=${() => pick('home')} aria-label=${c.name}><${ClientLogo} c=${c} dark=${sideDark} /></button>
      <nav class="p-tabs" aria-label="Seções">${tabs.map(([k, l, ic, n]) => html`<button key=${k} class=${cx('p-tab', isOn(k) && 'on')} aria-current=${isOn(k) ? 'page' : null} onClick=${() => pick(k)}><${Icon} n=${ic} s=${20} /><span class="pt-l">${l}</span>${n ? html`<span class="badge">${n}</span>` : null}</button>`)}</nav>
      <div class="p-side-foot"><${PoweredBy} lang=${lang} /></div>
    </aside>
    <div class="p-main">
    <header class="p-top"><button class="p-brand p-brand-m" onClick=${() => pick('home')} aria-label=${c.name}><${ClientLogo} c=${c} dark=${th.mode === 'dark'} /></button>
      <div class="right">
        <button class="btn sm p-req" onClick=${() => setAsk(true)}><${Icon} n="plus" s=${14} /><span>${R.ask}</span></button>
        <${LangPop} lang=${lang} setLang=${setLang} />
        <div class="p-menu"><button class="btn icon ghost" aria-label="Menu" aria-expanded=${menu} onClick=${() => setMenu(!menu)}><${CMark} c=${c} /></button>
          ${menu && html`<div class="pop">${who && html`<div class="pop-who"><b>${who.name}</b><small>${who.func || PL.team}</small></div>`}<button onClick=${() => { pick('team'); setMenu(false); }}><${Icon} n="users" />${PL.team}</button><button onClick=${() => { pick('brand'); setMenu(false); }}><${Icon} n="sliders" />${t.personalize}</button>${!preview && html`<button onClick=${() => setSession(null)}><${Icon} n="logout" />${t.switchAcc}</button>`}<div class="pop-foot"><${PoweredBy} lang=${lang} /></div></div>`}</div>
      </div></header>
    <div class="p-scroll" ref=${scRef}><div class=${cx('p-body', tab === 'content' && cview === 'board' && 'wide')}>${view}<footer class="p-foot"><${PoweredBy} lang=${lang} /></footer></div></div>
    </div>
    </div>
    ${ask && html`<${RequestSheet} c=${c} lang=${lang} close=${() => setAsk(false)} />`}
    ${piece && html`<${PortalPiece} k=${piece.k} id=${piece.id} c=${c} lang=${lang} who=${who} close=${() => setPiece(null)} openPiece=${openPiece} />`}
  </div>`;
}
/* lista, calendário e produção são três vistas das mesmas peças */
function PortalContentHub({ c, lang, who, openPiece, cview, setCview, goMeet }) {
  const X = XT[lang] || XT.pt;
  return html`<div class="sec" style="gap:14px">
    <div class="seg cv-seg" role="tablist">${[['list', X.list, 'list'], ['cal', X.calendar, 'cal'], ['board', X.production, 'board']].map(([k, l, ic]) => html`<button key=${k} role="tab" aria-selected=${cview === k} class=${cx(cview === k && 'on')} onClick=${() => setCview(k)}><${Icon} n=${ic} s=${14} />${l}</button>`)}</div>
    ${cview === 'cal' ? html`<${PortalCal} c=${c} lang=${lang} openPiece=${openPiece} goMeet=${goMeet} />` : cview === 'board' ? html`<${PortalBoard} c=${c} lang=${lang} who=${who} openPiece=${openPiece} />` : html`<${PortalContent} c=${c} lang=${lang} openPiece=${openPiece} />`}
  </div>`;
}
function PortalMore({ lang, pick }) {
  const t = TX[lang] || TX.pt; const X = XT[lang] || XT.pt; const PL = PX[lang] || PX.pt;
  const Row = (k, ic, l) => html`<button key=${k} class="row more-row" onClick=${() => pick(k)}><span class="av" style="border-radius:8px"><${Icon} n=${ic} s=${14} /></span><div class="row-main"><div class="row-title">${l}</div></div><${Icon} n="chevR" s=${14} /></button>`;
  return html`<div class="sec" style="gap:14px"><div><h1 style="font-size:24px">${X.more}</h1><p class="muted" style="margin-top:6px">${X.moreS}</p></div>
    <div class="list">${Row('proc', 'file', t.proc)}${Row('links', 'link', t.links)}${Row('team', 'users', PL.team)}${Row('brand', 'sliders', t.personalize)}</div></div>`;
}

/* para você: o que espera aprovação, com rodadas, lote, formulário de entrada e criar acesso */
function PortalHome({ c, lang, goCal, who, openPiece }) {
  const { db, act, session } = useApp();
  const t = TX[lang] || TX.pt; const X = XT[lang] || XT.pt; const P = PX[lang] || PX.pt;
  const [done, setDone] = useState([]); const [batch, setBatch] = useState(false); const [intake, setIntake] = useState(false); const [skipAcc, setSkipAcc] = useState(false);
  const all = pendingOf(db, c.id, null); const items = canApproveAs(who) ? all : [];
  const review = (k, x, r) => { act.review(k, x.id, r); setDone(d => [...d, { k, id: x.id, title: x.title, kind: r.ok ? (r.detail ? 'detail' : 'ok') : 'round', n: r.ok ? 0 : (x.rounds || 0) + 1, max: roundsOf(x) }]); };
  const talk = (k, x, text) => { act.talk(k, x.id, text); setDone(d => [...d, { k, id: x.id, title: x.title, kind: 'talk' }]); };
  const undo = d => { if (d.kind !== 'talk') act.undoReview(d.k, d.id, d.kind); setDone(ds => ds.filter(z => z.id !== d.id)); };
  const next = db.posts.filter(p => p.clientId === c.id && p.date && ['agendado', 'aprovado'].includes(p.status) && diff(p.date) >= 0).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const inprod = db.posts.filter(p => p.clientId === c.id && ['producao', 'revisao', 'ajuste'].includes(p.status)).length + db.scripts.filter(s => s.clientId === c.id && ['rascunho', 'revisao', 'ajuste'].includes(s.status)).length;
  const accKey = who ? who.id : 'main'; const needAcc = session && session.via === 'link' && !(c.access && c.access[accKey]) && !skipAcc;
  const needIntake = canApproveAs(who) && !(c.intake && c.intake.done);
  const doneTitle = d => d.kind === 'ok' ? t.approvedT : d.kind === 'detail' ? X.detailT : d.kind === 'talk' ? X.talkT : X.roundSent(d.n, d.max);
  const doneSub = d => d.kind === 'ok' || d.kind === 'detail' ? t.approvedS : d.kind === 'talk' ? X.talkNote : t.changeS;
  return html`
    <div class="hello"><h1>${t.hello}${who ? ', ' + who.name.split(' ')[0] : c.contact && c.contact !== '—' && c.id !== 'mo' ? ', ' + c.contact.split(' ')[0] : ''}.</h1><p>${items.length ? t.waiting(items.length) : !canApproveAs(who) && all.length ? P.othersAppr(all.length) : t.clearSub}</p>
</div>
    <${PortalTasks} c=${c} lang=${lang} who=${who} openPiece=${openPiece} />
    ${items.length > 1 && html`<div class="batch">${batch ? html`<span>${X.approveAllQ(items.length)}</span><button class="btn sm" onClick=${() => setBatch(false)}>${t.cancel}</button><button class="btn sm pri" onClick=${() => { items.forEach(([k, x]) => review(k, x, { ok: true })); setBatch(false); }}><${Icon} n="check" s=${14} />${X.confirm}</button>` : html`<button class="btn sm" onClick=${() => setBatch(true)}><${Icon} n="check" s=${14} />${X.approveAll(items.length)}</button>`}</div>`}
    <div class="aps">
      ${done.map(d => html`<div class=${cx('done-row', d.kind !== 'ok' && d.kind !== 'detail' && 'chg-sent')} key=${'d' + d.id}><span class="okc"><${Icon} n=${d.kind === 'ok' || d.kind === 'detail' ? 'check' : 'msg'} s=${16} /></span><span class="t"><b>${doneTitle(d)}: ${d.title}</b><small>${doneSub(d)}</small></span>${d.kind !== 'talk' && html`<button class="btn sm ghost" onClick=${() => undo(d)}>${t.undo}</button>`}</div>`)}
      ${items.map(([k, x]) => html`<${ApprovalCard} key=${x.id} k=${k} x=${x} lang=${lang} onReview=${r => review(k, x, r)} onTalk=${tx => talk(k, x, tx)} />`)}
      ${!items.length && canApproveAs(who) && html`<div class="card allclear"><span class="okc"><${Icon} n="check" s=${20} /></span><b>${t.clear}</b></div>`}
    </div>
    ${needAcc && html`<${AccessCard} c=${c} lang=${lang} who=${who} accKey=${accKey} skip=${() => setSkipAcc(true)} />`}
    ${needIntake && html`<div class="card intake-cta"><div><b>${X.intakeT}</b><p class="muted">${X.intakeS}</p></div><button class="btn pri" onClick=${() => setIntake(true)}>${X.intakeBtn}</button></div>`}
    <${MyRequests} c=${c} lang=${lang} />
    ${next.length > 0 && html`<section class="sec" style="gap:12px"><div class="sec-h" style="padding:0"><h2>${t.upnext}</h2><button class="linkbtn" style="margin-left:auto;font-size:13px" onClick=${goCal}>${t.cal}</button></div>
      <div class="upnext">${next.map(p => html`<button class="pcard" key=${p.id} onClick=${() => openPiece('post', p.id)}><${Thumb} p=${p} pillText=${t.st[p.status]} tone=${PTONE[p.status]} lang=${lang} /><span class="pt">${p.title}</span><span class="pd">${t.goes(fmt(p.date, lang))}</span></button>`)}</div></section>`}
    ${inprod > 0 && html`<p class="muted" style="font-size:13px;display:flex;gap:8px;align-items:center"><${Icon} n="clock" s=${14} />${t.inprod(inprod)}</p>`}
    ${intake && html`<${IntakeSheet} c=${c} lang=${lang} who=${who} close=${() => setIntake(false)} />`}`;
}

/* a imagem que recebe o ponto do comentário */
function ReviewMedia({ x, cur, setCur, pins, onPin }) {
  const imgs = x.imgs || []; const r = pieceRatio(x); const p0 = useRef(null);
  const here = pins.filter(p => p.slide === cur + 1 && p.pin);
  const layer = html`<div class="rv-layer" onPointerDown=${e => { p0.current = [e.clientX, e.clientY]; }} onClick=${e => { const s = p0.current; if (s && Math.hypot(e.clientX - s[0], e.clientY - s[1]) > 10) return; const b = e.currentTarget.getBoundingClientRect(); onPin(Math.round((e.clientX - b.left) / b.width * 100), Math.round((e.clientY - b.top) / b.height * 100)); }}>
    ${here.map(p => html`<span key=${p.n} class=${cx('rv-pin', p.draft && 'draft')} style=${{ left: p.pin.x + '%', top: p.pin.y + '%' }}>${p.n}</span>`)}</div>`;
  return html`<div class=${cx('ap-media', ratioCls(r))}><${Slider} imgs=${imgs} title=${x.title} ratio=${r} idx=${cur} onIdx=${setCur} overlay=${layer} /></div>`;
}
function ApprovalCard({ k, x, lang, onReview, onTalk }) {
  const { db } = useApp();
  const t = TX[lang] || TX.pt; const X = XT[lang] || XT.pt;
  const [mode, setMode] = useState(null); const [list, setList] = useState([]); const [txt, setTxt] = useState(''); const [slide, setSlide] = useState(0); const [pin, setPin] = useState(null); const [cur, setCur] = useState(0); const [full, setFull] = useState(false);
  const used = x.rounds || 0; const max = roundsOf(x); const left = max - used; const talkOpen = x.talk && x.talk.state === 'open';
  const kind = k === 'post' ? pieceKind(lang, x) : k === 'script' ? `${t.script} · ${x.kind}` : t.delivery;
  const when = k === 'post' && x.date ? t.goes(fmt(x.date, lang)) : k === 'script' && x.record ? t.record(fmt(x.record, lang)) : k === 'task' && x.due ? fmt(x.due, lang) : '';
  const blocks = k === 'script' ? (full ? x.blocks : x.blocks.slice(0, 2)) : [];
  const imgs = k === 'post' ? (x.imgs || []) : [];
  const reset = () => { setMode(null); setList([]); setTxt(''); setPin(null); setSlide(0); };
  const add = () => { if (!txt.trim()) return; setList(L => [...L, { text: txt.trim(), slide: slide || null, pin }]); setTxt(''); setPin(null); };
  const send = () => { const L = txt.trim() ? [...list, { text: txt.trim(), slide: slide || null, pin }] : list; if (L.length) onReview({ ok: false, list: L }); };
  const pins = [...list.map((it, i) => ({ ...it, n: i + 1 })), ...(pin ? [{ slide: cur + 1, pin, n: list.length + 1, draft: true }] : [])];
  const roundLine = left <= 0 ? X.rNone(max) : used === 0 ? X.r0(max) : left === 1 ? X.rLast : X.rLeft(left);
  return html`<article class="ap">
    <div class="ap-h"><span class="k"><span class="pill t-cli">${t.st.cliente}</span><span>${kind}</span>${when && html`<span>· ${when}</span>`}${used > 0 && html`<span class="tag">${X.version(used + 1).toUpperCase()}</span>`}</span><h2>${x.title}</h2>
      <span class="ap-until"><${Icon} n="clock" s=${13} />${X.until(fmt(approveBy(k, x), lang))}</span></div>
    ${k === 'post' && (mode === 'change' && imgs.length ? html`<${ReviewMedia} x=${x} cur=${cur} setCur=${setCur} pins=${pins} onPin=${(px, py) => { setPin({ x: px, y: py }); setSlide(cur + 1); }} />` : html`<${PieceMedia} k="post" x=${x} lang=${lang} />`)}
    <div class="ap-b">
      ${x.lastRound && x.lastRound.items && x.lastRound.items.length > 0 && html`<div class="changed"><span class="label">${X.changed(x.lastRound.n)}</span><ul>${x.lastRound.items.map((it, i) => html`<li key=${i}><${Icon} n="check" s=${13} />${it.slide ? html`<span class="tag">${it.slide}</span> ` : null}${it.text}</li>`)}</ul></div>`}
      ${(x.media || []).length > 0 && html`<div class="lp-grid">${x.media.map((md, i) => html`<${LinkPreview} key=${i} url=${md.url} name=${md.name} kind=${md.kind} lang=${lang} />`)}</div>`}
      ${k === 'post' && x.caption && html`<p style="white-space:pre-wrap;font-size:14px">${x.caption}</p>`}
      ${k === 'script' && html`<div class="sblk-read">${blocks.map(([l, v], i) => html`<div key=${i}>${l && html`<div class="label">${l}</div>`}<p style="white-space:pre-wrap">${v}</p></div>`)}${x.blocks.length > 2 && html`<button class="linkbtn" onClick=${() => setFull(!full)}>${full ? t.collapse : t.readAll}</button>`}</div>`}
      ${k === 'task' && html`<p style="font-size:14px">${x.desc}</p><p class="muted" style="font-size:13px">${t.entregaOpen}</p>`}
      <span class="from">${t.sentBy(firstName(db, x.assignee), rel(x.sentAt || x.since, lang))}</span>
      <p class=${cx('rounds-line', left <= 1 && 'last')}>${talkOpen ? X.talkSent : roundLine}</p>
    </div>
    ${mode === 'change' ? html`<form class="chg" onSubmit=${e => { e.preventDefault(); send(); }}>
        ${imgs.length > 1 && html`<div class="field"><span>${t.whichSlide}</span><div class="chips">${[0, ...imgs.map((_, i) => i + 1)].map(n => html`<button type="button" key=${n} class=${cx(slide === n && 'on')} onClick=${() => { setSlide(n); if (n) setCur(n - 1); }}>${n === 0 ? t.general : n}</button>`)}</div></div>`}
        ${imgs.length > 0 && html`<p class="muted" style="font-size:12.5px;display:flex;gap:6px;align-items:center"><${Icon} n="pin" s=${13} />${pin ? X.pinned : X.tapToPin}</p>`}
        <label class="field"><span>${t.whatChange}</span><textarea class="ta" id=${'chg-' + x.id} ref=${autoF} placeholder=${t.phChange} value=${txt} onInput=${e => setTxt(e.target.value)}></textarea></label>
        <button type="button" class="btn sm" style="align-self:flex-start" disabled=${!txt.trim()} onClick=${add}><${Icon} n="plus" s=${13} />${X.addAnother}</button>
        ${list.length > 0 && html`<div class="round-list"><span class="label">${X.inRound}</span>${list.map((it, i) => html`<div class="rl-it" key=${i}><span class="rl-n">${i + 1}</span><span class="rl-t">${it.slide ? html`<span class="tag">${it.slide}</span> ` : null}${it.text}${it.pin ? html` <small class="muted">· ${X.pinned}</small>` : null}</span><button type="button" class="btn sm ghost" onClick=${() => setList(L => L.filter((_, j) => j !== i))}>${X.remove}</button></div>`)}</div>`}
        ${left === 1 && html`<p class="rounds-line last">${X.rLast}</p>`}
        <div class="ap-acts" style="padding:0"><button type="button" class="btn lg" onClick=${reset}>${t.cancel}</button><button class="btn pri lg" type="submit" disabled=${!list.length && !txt.trim()}>${X.sendRound(list.length + (txt.trim() ? 1 : 0))}</button></div>
      </form>`
    : mode === 'detail' || mode === 'talk' ? html`<form class="chg" onSubmit=${e => { e.preventDefault(); if (!txt.trim()) return; if (mode === 'detail') onReview({ ok: true, detail: txt.trim() }); else { onTalk(txt.trim()); reset(); } }}>
        <label class="field"><span>${mode === 'detail' ? X.detail : X.talk}</span><textarea class="ta" id=${'dt-' + x.id} ref=${autoF} placeholder=${mode === 'detail' ? X.detailPh : X.talkPh} value=${txt} onInput=${e => setTxt(e.target.value)}></textarea></label>
        <p class="muted" style="font-size:12.5px">${mode === 'detail' ? X.detailNote : X.talkNote}</p>
        <div class="ap-acts" style="padding:0"><button type="button" class="btn lg" onClick=${reset}>${t.cancel}</button><button class="btn pri lg" type="submit" disabled=${!txt.trim()}>${mode === 'detail' ? X.detailSend : X.talkSend}</button></div></form>`
    : html`<div class="ap-acts">${left > 0 ? html`<button class="btn lg" onClick=${() => setMode('change')}><${Icon} n="msg" />${t.change}</button>` : html`<button class="btn lg" disabled=${talkOpen} onClick=${() => setMode('talk')}><${Icon} n="msg" />${X.talk}</button>`}<button class="btn pri lg" onClick=${() => onReview({ ok: true })}><${Icon} n="check" />${t.approve}</button></div>
      <div class="ap-more"><button class="linkbtn" onClick=${() => setMode('detail')}>${X.detail}</button></div>`}
  </article>`;
}

/* formulário de entrada, no idioma do cliente */
function IntakeSheet({ c, lang, who, close }) {
  const { act } = useApp(); const X = XT[lang] || XT.pt; const t = TX[lang] || TX.pt; const a = c.about || {};
  const [f, setF] = useState(() => ({ desc: a.desc || '', niche: a.niche || '', goals: [...(a.goals || []), '', '', ''].slice(0, 3), approver: c.contact && c.contact !== '—' ? c.contact : '', ch: [...((c.notify || {}).ch || [])], phone: '', email: '', access: [] }));
  const [sent, setSent] = useState(false);
  const tog = (key, v) => setF(o => ({ ...o, [key]: o[key].includes(v) ? o[key].filter(y => y !== v) : [...o[key], v] }));
  const submit = e => { e.preventDefault(); act.intakeSubmit(c.id, { ...f, goals: f.goals.map(g => g.trim()).filter(Boolean) }, who ? who.id : 'client'); setSent(true); };
  return html`<div class="p-sheet-wrap" onClick=${e => e.target === e.currentTarget && close()}><form class="p-sheet pp-sheet" role="dialog" aria-modal="true" aria-label=${X.intakeT} onSubmit=${submit}>
    <div class="mhd"><div><h2>${sent ? X.sentT : X.intakeT}</h2>${!sent && html`<p>${X.intakeS}</p>`}</div><button type="button" class="btn icon ghost" aria-label=${t.cancel} onClick=${close}><${Icon} n="x" /></button></div>
    ${sent ? html`<div class="mft"><button type="button" class="btn pri" onClick=${close}>OK</button></div>` : html`<div class="mbd pp-body">
      <label class="field"><span>${X.desc}</span><textarea class="ta" id="in-desc" rows="3" placeholder=${X.descPh} value=${f.desc} onInput=${e => (v => setF(o => ({ ...o, desc: v })))(e.target.value)}></textarea></label>
      <label class="field"><span>${X.niche}</span><input class="inp" id="in-niche" placeholder=${X.nichePh} value=${f.niche} onInput=${e => (v => setF(o => ({ ...o, niche: v })))(e.target.value)} /></label>
      <div class="field"><span>${X.goals}</span>${f.goals.map((g, i) => html`<input key=${i} class="inp" id=${'in-goal' + i} aria-label=${X.goals + ' ' + (i + 1)} placeholder=${i === 0 ? X.goalPh : ''} value=${g} onInput=${e => { const v = e.target.value; setF(o => ({ ...o, goals: o.goals.map((y, j) => (j === i ? v : y)) })); }} />`)}</div>
      <label class="field"><span>${X.approver}</span><input class="inp" id="in-appr" placeholder=${X.approverPh} value=${f.approver} onInput=${e => (v => setF(o => ({ ...o, approver: v })))(e.target.value)} /></label>
      <div class="field"><span>${X.notifyQ}</span><div class="filter-chips">${['whatsapp', 'email', 'sms'].map(k => html`<button type="button" key=${k} class=${cx(f.ch.includes(k) && 'on')} aria-pressed=${f.ch.includes(k)} onClick=${() => tog('ch', k)}>${X.ch[k]}</button>`)}</div>
        <div class="two"><input class="inp" id="in-phone" aria-label=${X.phone} placeholder=${X.phone} value=${f.phone} onInput=${e => (v => setF(o => ({ ...o, phone: v })))(e.target.value)} /><input class="inp" id="in-email" type="email" aria-label=${X.email} placeholder=${X.email} value=${f.email} onInput=${e => (v => setF(o => ({ ...o, email: v })))(e.target.value)} /></div></div>
      <div class="field"><span>${X.access}</span><div class="acc-list">${Object.entries(X.acc).map(([k, l]) => html`<label key=${k} class="acc-it"><input type="checkbox" checked=${f.access.includes(k)} onChange=${() => tog('access', k)} />${l}</label>`)}</div><small class="muted">${X.accessNote}</small></div>
    </div>
    <div class="mft"><button type="button" class="btn ghost" onClick=${close}>${t.cancel}</button><button class="btn pri" type="submit">${X.send}</button></div>`}
  </form></div>`;
}
/* criar acesso: nome, e-mail e senha opcional; o link do WhatsApp segue valendo */
function AccessCard({ c, lang, who, accKey, skip }) {
  const { act, toast } = useApp(); const X = XT[lang] || XT.pt;
  const [f, setF] = useState({ name: who ? who.name : (c.contact && c.contact !== '—' ? c.contact : ''), email: who && who.email ? who.email : '', password: '' });
  const okPw = !f.password || f.password.length >= 8; const ok = f.name.trim() && f.email.includes('@') && okPw;
  return html`<form class="card acc-card" onSubmit=${e => { e.preventDefault(); if (!ok) return; act.saveAccess(c.id, accKey, f); toast(X.accessOk); }}>
    <div><b><${Icon} n="key" s=${15} /> ${X.accessT}</b><p class="muted">${X.accessS}</p></div>
    <div class="acc-grid"><input class="inp" id="ac-name" aria-label=${X.name} placeholder=${X.name} autocomplete="name" value=${f.name} onInput=${e => (v => setF(o => ({ ...o, name: v })))(e.target.value)} />
      <input class="inp" id="ac-email" type="email" aria-label=${X.email} placeholder=${X.email} autocomplete="email" value=${f.email} onInput=${e => (v => setF(o => ({ ...o, email: v })))(e.target.value)} />
      <input class=${cx('inp', !okPw && 'bad')} id="ac-pw" type="password" aria-label=${X.password} placeholder=${X.password} autocomplete="new-password" value=${f.password} onInput=${e => (v => setF(o => ({ ...o, password: v })))(e.target.value)} /></div>
    ${!okPw && html`<small class="err">${X.pwHint}</small>`}
    <div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost sm" onClick=${skip}>${X.later}</button><button class="btn pri sm" type="submit" disabled=${!ok}>${X.saveAcc}</button></div>
  </form>`;
}

/* resultados: o relatório de uma página por mês que o time publica */
function PortalResults({ c, lang }) {
  const { db } = useApp(); const X = XT[lang] || XT.pt;
  const L = (c.reports || []).filter(r => r.published).sort((a, b) => b.month.localeCompare(a.month));
  const [mk, setMk] = useState(L[0] ? L[0].month : null); const r = L.find(x => x.month === mk) || L[0];
  if (!r) return null;
  const s = r.sum || {};
  return html`<div class="sec" style="gap:18px"><div><h1 style="font-size:24px">${X.results}</h1><p class="muted" style="margin-top:6px">${capFirst(monthName(r.month, lang))}</p></div>
    <section class="sec" style="gap:8px"><h2 style="font-size:16px">${X.rDone}</h2><ul class="res-done">${[s.posts ? X.rPosts(s.posts) : null, s.videos ? X.rVideos(s.videos) : null, s.meets ? X.rMeets(s.meets) : null, s.deliv ? X.rDeliv(s.deliv) : null].filter(Boolean).map((l, i) => html`<li key=${i}><${Icon} n="check" s=${14} />${l}</li>`)}</ul></section>
    ${(r.metrics || []).length > 0 && html`<section class="sec" style="gap:8px"><h2 style="font-size:16px">${X.rNumbers}</h2><div class="res-grid">${r.metrics.map((m, i) => html`<div class="card res-m" key=${i}><span class="muted">${m.name}</span><b>${m.value || '—'}</b>${m.goal && html`<small>${X.rGoal(m.goal)}</small>`}</div>`)}</div></section>`}
    ${r.note && html`<p class="res-note">${r.note}</p>`}
    <p class="muted" style="font-size:12.5px">${X.rBy(firstName(db, r.by), fmt(r.at, lang))}</p>
    ${L.length > 1 && html`<div class="filter-chips"><span class="muted" style="font-size:13px;align-self:center">${X.rOther}</span>${L.map(x => html`<button key=${x.month} class=${cx(x.month === r.month && 'on')} onClick=${() => setMk(x.month)}>${capFirst(monthName(x.month, lang))}</button>`)}</div>`}
  </div>`;
}

/* login do cliente: link por e-mail ou senha, no idioma dele */
function BrandedLogin({ c, back, enter }) {
  const sysDark = useSysDark(); const th = clientTheme(c, sysDark); const lang = c.lang; const T = (XT[lang] || XT.pt).login;
  const [mode, setMode] = useState('link'); const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [sent, setSent] = useState(false);
  return html`<div class="blogin" style=${portalStyle(c, th)}><div class="bl-box">
    <div class="bl-logo"><${ClientLogo} c=${c} dark=${th.mode === 'dark'} /></div>
    <div><h1>${T[0]}</h1><p class="muted" style="margin-top:8px">${mode === 'link' ? T[1] : ''}</p></div>
    <div class="seg" style="align-self:flex-start"><button type="button" class=${cx(mode === 'link' && 'on')} onClick=${() => setMode('link')}>${T[5]}</button><button type="button" class=${cx(mode === 'pw' && 'on')} onClick=${() => setMode('pw')}>${T[6]}</button></div>
    ${mode === 'link' ? html`<form class="bl-form" onSubmit=${e => { e.preventDefault(); if (email.includes('@')) setSent(true); }}><label class="sr" for="bl-email">E-mail</label><input id="bl-email" class="inp" type="email" placeholder=${T[4]} value=${email} onInput=${e => setEmail(e.target.value)} /><button class="btn pri" type="submit">${T[2]}</button></form>`
      : html`<form class="bl-form col" onSubmit=${e => { e.preventDefault(); if (email.includes('@') && pw) enter(); }}><label class="sr" for="bl-email2">E-mail</label><input id="bl-email2" class="inp" type="email" autocomplete="email" placeholder=${T[4]} value=${email} onInput=${e => setEmail(e.target.value)} /><label class="sr" for="bl-pw">${T[6]}</label><input id="bl-pw" class="inp" type="password" autocomplete="current-password" placeholder=${T[6]} value=${pw} onInput=${e => setPw(e.target.value)} /><button class="btn pri" type="submit" disabled=${!email.includes('@') || !pw}>${T[7]}</button><button type="button" class="linkbtn" style="font-size:13px" onClick=${() => setMode('link')}>${T[8]}</button></form>`}
    ${sent && html`<p class="muted" style="font-size:13px">✓ ${email}</p>`}
    <button class="btn" onClick=${enter}>${T[3]}<${Icon} n="arrowR" s=${14} /></button>
    <div class="bl-foot"><button class="linkbtn" onClick=${back}>← M&O</button><${PoweredBy} lang=${lang} /></div>
  </div></div>`;
}
