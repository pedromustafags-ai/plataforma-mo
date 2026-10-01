
/* ================= v13: link e horário da reunião ================= */
/* reunião marcada à mão (sem Google Agenda) guarda o link e o horário aqui; a da Agenda mostra o que veio de lá */
const MT13 = {
  pt: { up: 'Próximas reuniões', notes: 'Atas', join: 'Entrar na reunião', today: 'Hoje', tomorrow: 'Amanhã', nolink: 'O link aparece aqui antes da reunião.' },
  en: { up: 'Upcoming meetings', notes: 'Meeting notes', join: 'Join meeting', today: 'Today', tomorrow: 'Tomorrow', nolink: 'The link will show up here before the meeting.' },
  es: { up: 'Próximas reuniones', notes: 'Actas', join: 'Entrar a la reunión', today: 'Hoy', tomorrow: 'Mañana', nolink: 'El enlace aparecerá aquí antes de la reunión.' },
  fr: { up: 'Prochaines réunions', notes: 'Comptes rendus', join: 'Rejoindre la réunion', today: "Aujourd'hui", tomorrow: 'Demain', nolink: 'Le lien apparaîtra ici avant la réunion.' },
};
Object.keys(MT13).forEach(l => Object.assign(MT[l], MT13[l]));
const safeUrl = u => { u = String(u || '').trim(); if (!u) return ''; if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) u = 'https://' + u; return /^https?:\/\/[^\s/]+\.[^\s]+$/i.test(u) ? u : ''; };
const shortUrl = u => String(u || '').replace(/^https?:\/\//i, '').replace(/\/$/, '');
const meetHost = u => /meet\.google\./i.test(u) ? 'Meet' : /zoom\.us/i.test(u) ? 'Zoom' : /teams\.(microsoft|live)\./i.test(u) ? 'Teams' : '';
const joinLabel = u => { const h = meetHost(u); return h ? 'Entrar no ' + h : 'Entrar na reunião'; };
const hm24 = iso => { const x = new Date(iso); return pad(x.getHours()) + ':' + pad(x.getMinutes()); };
const atDay = (day, hm) => { const x = pd(day); const [h, m] = hm.split(':').map(Number); x.setHours(h, m || 0, 0, 0); return x.toISOString(); };
const notOver = m => Date.parse(m.end || m.start) > Date.now();

function actV13({ commit }) {
  return {
    addMeeting: clientId => { const key = uid('man'); const s = atDay(off(1), '10:00');
      commit(d => { d.meetings.push({ key, manual: true, clientId: clientId || null, title: 'Nova reunião', start: s, end: new Date(Date.parse(s) + 30 * 6e4).toISOString(), attendees: [], meet: '' }); }, 'Reunião criada'); return key; },
    setMeeting: (key, patch) => commit(d => { const m = d.meetings.find(x => x.key === key); if (m) Object.assign(m, patch); }),
    showMeeting: (key, on) => commit(d => { d.meetingShow[key] = on; }, on ? 'O cliente vê esta reunião no painel' : 'Reunião escondida do painel do cliente'),
    delMeeting: key => commit(d => { d.meetings = d.meetings.filter(x => x.key !== key); delete d.meetingShow[key]; }, 'Reunião apagada'),
  };
}

/* as linhas de horário e link na gaveta da reunião */
function MeetFields({ m }) {
  const { act, toast } = useApp();
  const [link, setLink] = useState(m.meet || ''); const [bad, setBad] = useState(false);
  useEffect(() => { setLink(m.meet || ''); }, [m.meet]);
  const copy = () => copyText(m.meet, ok => toast(ok ? 'Link copiado.' : 'Não deu para copiar. Selecione o link.'));
  if (m.live) return html`<dt>Link</dt><dd>${m.meet ? html`<span class="mt-url"><a href=${m.meet} target="_blank" rel="noopener">${shortUrl(m.meet)}</a><button class="btn sm" onClick=${copy}><${Icon} n="copy" s=${14} />Copiar</button></span>` : html`<span class="muted">—</span>`}</dd>`;
  const dur = Date.parse(m.end) - Date.parse(m.start);
  const setStart = (day, t) => { if (!day || !t) return; const s = atDay(day, t); act.setMeeting(m.key, { start: s, end: new Date(Date.parse(s) + Math.max(dur, 15 * 6e4)).toISOString() }); };
  const setEnd = t => { if (!t) return; const e = atDay(dayOf(m.start), t); if (Date.parse(e) <= Date.parse(m.start)) { toast('O fim precisa ser depois do início.'); return; } act.setMeeting(m.key, { end: e }); };
  const saveLink = () => { const v = link.trim();
    if (!v) { setBad(false); if (m.meet) act.setMeeting(m.key, { meet: '' }); return; }
    const u = safeUrl(v); if (!u) { setBad(true); return; }
    setBad(false); setLink(u); if (u !== m.meet) act.setMeeting(m.key, { meet: u }); };
  return html`<dt>Horário</dt><dd class="mt-when">
      <input type="date" class="inp" aria-label="Dia" value=${dayOf(m.start)} onChange=${e => setStart(e.target.value, hm24(m.start))} />
      <input type="time" class="inp" aria-label="Início" value=${hm24(m.start)} onChange=${e => setStart(dayOf(m.start), e.target.value)} />
      <span class="muted">até</span>
      <input type="time" class="inp" aria-label="Fim" value=${hm24(m.end)} onChange=${e => setEnd(e.target.value)} /></dd>
    <dt><label for="mt-link">Link</label></dt><dd><div class="mt-url">
      <input id="mt-link" class="inp" type="url" placeholder="Cole o link do Meet, Zoom ou Teams" value=${link} onInput=${e => setLink(e.target.value)} onBlur=${saveLink} onKeyDown=${e => e.key === 'Enter' && e.currentTarget.blur()} />
      ${m.meet && html`<button class="btn sm" onClick=${copy}><${Icon} n="copy" s=${14} />Copiar</button>`}</div>
      ${bad && html`<span class="err">Esse endereço não parece um link. Confira e cole de novo.</span>`}</dd>`;
}
function MeetShow({ m }) {
  const { act } = useApp(); if (!m.clientId) return null;
  return html`<dt>Painel do cliente</dt><dd><label class="mt-show"><input type="checkbox" checked=${m.show} onChange=${e => act.showMeeting(m.key, e.target.checked)} /><span>O cliente vê o horário e o link</span></label></dd>`;
}
function MeetDel({ m }) {
  const { act, setDrawer } = useApp();
  return html`<button class="btn sm ghost danger" style="align-self:flex-start" onClick=${() => { setDrawer(null); act.delMeeting(m.key); }}><${Icon} n="trash" s=${14} />Apagar reunião</button>`;
}

/* aba Reuniões do painel do cliente: as próximas, com horário e link, e depois as atas */
function PortalMeetings({ c, lang }) {
  const app = useApp(); const { db } = app; const T = MT[lang] || MT.pt;
  const list = Object.entries(db.meetingNotes).filter(([k, n]) => n.shared && n.cliente && (n.clientId || (db.meetings.find(m => m.key === k) || {}).clientId || db.meetingClient[k]) === c.id).sort((a, b) => Date.parse(b[1].start) - Date.parse(a[1].start));
  const up = allMeetings(app).filter(m => m.clientId === c.id && m.show && notOver(m)).sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  const who = q => /cliente|client|you|você|tú|vous/i.test(q) ? T.you : q;
  const when = m => { const d = diff(dayOf(m.start)); return d === 0 ? T.today : d === 1 ? T.tomorrow : capFirst(fmt(dayOf(m.start), lang, { weekday: 'long', day: 'numeric', month: 'long' })); };
  const tm = (iso, tz) => new Date(iso).toLocaleTimeString(LOC(lang), { hour: 'numeric', minute: '2-digit', ...(tz ? { timeZoneName: 'short' } : {}) });
  const mon = iso => new Intl.DateTimeFormat(LOC(lang), { month: 'short' }).format(new Date(iso)).replace(/\./g, '');
  return html`<div class="sec" style="gap:16px"><h1 style="font-size:24px">${T.tab}</h1>
    ${up.length > 0 && html`<section class="sec" style="gap:10px"><div class="sec-h" style="padding:0"><h2>${T.up}</h2></div>
      ${up.map(m => html`<div class="card mt-up" key=${m.key}>
        <div class="mt-day"><b>${new Date(m.start).getDate()}</b><small>${mon(m.start)}</small></div>
        <div class="mt-info"><span class="k">${when(m)} · ${tm(m.start)} – ${tm(m.end, true)}</span><b>${m.title}</b>
          ${!m.meet && html`<small class="muted">${T.nolink}</small>`}${m.example && html`<span class="tag" style="align-self:flex-start">EXEMPLO</span>`}</div>
        ${m.meet && html`<a class="btn pri" href=${m.meet} target="_blank" rel="noopener"><${Icon} n="video" s=${16} />${T.join}</a>`}</div>`)}</section>`}
    ${up.length > 0 && list.length > 0 && html`<div class="sec-h" style="padding:0"><h2>${T.notes}</h2></div>`}
    ${list.length ? list.map(([k, n]) => html`<article class="ap ata" key=${k}><div class="ap-h"><span class="k"><span>${fmt(dayOf(n.start), lang, { weekday: 'long', day: 'numeric', month: 'long' })}</span><span>· ${hhmm(n.start)}</span>${n.example && html`<span class="tag">EXEMPLO</span>`}</span><h2>${n.title}</h2></div>
      <div class="ap-b"><div><span class="label">${T.sum}</span><p style="margin-top:4px">${n.cliente.resumo}</p></div>
        ${n.cliente.decisoes && n.cliente.decisoes.length > 0 && html`<div><span class="label">${T.dec}</span><ul class="ata-ul">${n.cliente.decisoes.map((d, i) => html`<li key=${i}>${d}</li>`)}</ul></div>`}
        ${n.cliente.proximos && n.cliente.proximos.length > 0 && html`<div><span class="label">${T.next}</span><ul class="ata-ul">${n.cliente.proximos.map((p, i) => html`<li key=${i}><b>${who(p.quem)}</b> ${p.o}</li>`)}</ul></div>`}</div></article>`) : !up.length && html`<div class="card empty">${T.empty}</div>`}
  </div>`;
}

/* histórico das ações novas */
Object.assign(LOGD, {
  addMeeting: ([cid], p, n) => ({ text: 'marcou uma reunião', clientId: cid || null }),
  setMeeting: ([key, patch = {}], p, n) => { const m = n.meetings.find(x => x.key === key); return m && { text: patch.meet !== undefined ? 'mudou o link da reunião' : patch.title ? 'renomeou a reunião' : 'mudou o horário da reunião', label: m.title, clientId: m.clientId || null, merge: 'meet:' + key + ':' + Object.keys(patch).join() }; },
  showMeeting: ([key, on], p, n) => { const m = n.meetings.find(x => x.key === key); return { text: on ? 'mostrou no painel do cliente a reunião' : 'tirou do painel do cliente a reunião', label: m ? m.title : null, clientId: (m && m.clientId) || null }; },
  delMeeting: ([key], p) => { const m = p.meetings.find(x => x.key === key); return m && { text: 'apagou a reunião', label: m.title, clientId: m.clientId || null }; },
});
