
/* ================= v12: o lado do time das rodadas, do relatório, do pacote e dos avisos ================= */
function RoundsBar({ k, x }) {
  const { db, act, can, me } = useApp();
  const used = x.rounds || 0; const max = roundsOf(x); const talk = x.talk; const lr = x.lastRound;
  if (!used && !talk && !x.uncounted && !x.paidRounds) return html`<p class="muted rb-line"><${Icon} n="msg" s=${13} />Rodadas de ajuste do cliente: 0 de ${max} usadas.</p>`;
  const mineOrSocio = can('round.grant') || (me && x.assignee === me.id);
  return html`<div class="rb">
    <p class="rb-line"><${Icon} n="msg" s=${13} /><b>Rodadas de ajuste: ${used} de ${max} usadas</b>${x.paidRounds ? html` · <span class="tag">${plural(x.paidRounds, 'RODADA COBRADA', 'RODADAS COBRADAS')}</span>` : null}${x.uncounted ? html` · <span class="muted">${plural(x.uncounted, 'devolvida', 'devolvidas')} por erro da M&O</span>` : null}</p>
    ${lr && x.status === 'ajuste' && html`<div class="rb-round"><span class="label">O que o cliente pediu na rodada ${lr.n}</span><ul>${lr.items.map((it, i) => html`<li key=${i}>${it.slide ? html`<span class="tag">SLIDE ${it.slide}</span> ` : null}${it.pin ? html`<span class="tag">PONTO MARCADO</span> ` : null}${it.text}</li>`)}</ul>
      ${mineOrSocio && used > 0 && html`<button class="linkbtn" style="font-size:12.5px" onClick=${() => act.uncountRound(k, x.id)}>Não contar esta rodada: o ajuste foi erro da M&O</button>`}</div>`}
    ${talk && talk.state === 'open' && html`<div class="rb-talk"><span class="label">O cliente quer falar sobre um 3º ajuste</span><p>"${talk.text}"</p>
      ${can('round.grant') ? html`<div class="rb-acts"><button class="btn sm" onClick=${() => act.resolveTalk(k, x.id, 'free')}>Liberar sem custo</button><button class="btn sm" onClick=${() => act.resolveTalk(k, x.id, 'paid')}>Cobrar à parte</button><button class="btn sm" onClick=${() => act.resolveTalk(k, x.id, 'new')}>Tratar como peça nova</button></div>
        <small class="muted">Liberar e cobrar abrem uma rodada nova com o pedido dele. Peça nova cria uma ideia na esteira e deixa esta como está.</small>` : html`<small class="muted">Esperando um sócio decidir.</small>`}</div>`}
    ${talk && talk.state === 'done' && html`<p class="muted rb-line">3º ajuste: ${talk.how === 'free' ? 'liberado sem custo' : talk.how === 'paid' ? 'cobrado à parte' : 'virou peça nova'}${talk.by ? ' por ' + firstName(db, talk.by) : ''}.</p>`}
  </div>`;
}

/* o relatório de uma página por mês */
function monthSum(db, c, mk) {
  const inM = s => s && s.slice(0, 7) === mk;
  const posts = db.posts.filter(p => p.clientId === c.id && p.status === 'publicado' && inM(p.date));
  const videos = db.scripts.filter(s => s.clientId === c.id && s.status === 'noar' && inM(s.since));
  const meets = Object.values(db.meetingNotes).filter(n => n.shared && n.clientId === c.id && inM(dayOf(n.start)));
  const deliv = db.tasks.filter(t => t.clientId === c.id && t.type === 'entrega' && t.status === 'done' && inM(t.since));
  return { posts: posts.length, videos: videos.length, meets: meets.length, deliv: deliv.length, list: [...posts.map(p => 'Post: ' + p.title), ...videos.map(s => 'Vídeo: ' + s.title), ...meets.map(n => 'Reunião: ' + n.title), ...deliv.map(t => 'Entrega: ' + t.title)] };
}
function ReportCard({ c }) {
  const { db, setModal } = useApp(); const mk = monthKey(); const r = (c.reports || []).find(x => x.month === mk);
  return html`<section class="sec"><div class="sec-h"><h2>Relatório do mês</h2>${r && html`<span class=${'pill t-' + (r.published ? 'ok' : 'neu')}>${r.published ? 'Publicado' : 'Rascunho'}</span>`}</div>
    <div class="card docs-card"><p class="muted" style="font-size:13px">Uma página por mês no painel do cliente: o que foi feito, que o sistema já sabe, e de 1 a 3 números com o comentário do time. A régua é o custo por reunião agendada.</p>
      <button class=${cx('btn', !r && 'pri')} style="align-self:flex-start" onClick=${() => setModal({ t: 'report', clientId: c.id })}><${Icon} n="chart" s=${14} />${r ? (r.published ? 'Ver e editar' : 'Continuar o relatório') : 'Montar o relatório de ' + monthName(mk)}</button>
      ${r && r.published && html`<small class="muted">O cliente vê na aba Resultados, em ${LANG_PT[c.lang]}.</small>`}</div></section>`;
}
function ReportEditor({ close, clientId }) {
  const { db, act } = useApp(); const c = db.clients.find(x => x.id === clientId); const mk = monthKey(); const cur = (c.reports || []).find(x => x.month === mk);
  const goals = (c.about && c.about.goals) || [];
  const [m, setM] = useState(() => cur ? structuredClone(cur.metrics || []) : [{ name: 'Custo por reunião agendada', value: '', goal: '' }, ...goals.slice(0, 2).map(g => ({ name: g, value: '', goal: '' }))]);
  const [note, setNote] = useState(cur ? cur.note || '' : '');
  const sum = monthSum(db, c, mk);
  const save = pub => { act.saveReport(c.id, { id: cur ? cur.id : uid('r'), month: mk, sum, metrics: m.filter(x => x.name.trim() && String(x.value || '').trim()), note: note.trim() }, pub); close(); };
  return html`<div><div class="mhd"><div><h2>Relatório de ${monthName(mk)}: ${c.name}</h2><p>Sai no painel em ${LANG_PT[c.lang]}. Escreva os números e o comentário nessa língua.</p></div><button class="btn icon ghost" aria-label="Fechar" onClick=${close}><${Icon} n="x" /></button></div>
    <div class="mbd">
      <div><span class="label">O que fizemos, pelo sistema</span>${sum.list.length ? html`<ul class="ata-ul">${sum.list.slice(0, 12).map((l, i) => html`<li key=${i}>${l}</li>`)}</ul>` : html`<p class="muted" style="font-size:13px;margin-top:6px">Nada publicado nem entregue neste mês ainda. O relatório fica com os números e o comentário.</p>`}</div>
      <div class="field"><span>Números (de 1 a 3)</span>
        ${m.map((x, i) => html`<div class="rep-row" key=${i}><input class="inp" aria-label=${'Nome do número ' + (i + 1)} placeholder="O que é" value=${x.name} onInput=${e => setM(m.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)))} /><input class="inp" aria-label="Valor" placeholder="Valor" value=${x.value} onInput=${e => setM(m.map((y, j) => (j === i ? { ...y, value: e.target.value } : y)))} /><input class="inp" aria-label="Meta" placeholder="Meta" value=${x.goal} onInput=${e => setM(m.map((y, j) => (j === i ? { ...y, goal: e.target.value } : y)))} /><button class="btn sm icon ghost" aria-label="Tirar" onClick=${() => setM(m.filter((_, j) => j !== i))}><${Icon} n="x" s=${13} /></button></div>`)}
        ${m.length < 3 && html`<button class="btn sm" style="align-self:flex-start" onClick=${() => setM([...m, { name: '', value: '', goal: '' }])}><${Icon} n="plus" s=${13} />Número</button>`}
        <small class="muted">No produto, os números do Meta Ads entram sozinhos, pela API de leitura. No protótipo, você digita.</small></div>
      <label class="field"><span>O que isso quer dizer e o que vem agora</span><textarea class="ta" id="rep-note" rows="4" value=${note} onInput=${e => setNote(e.target.value)}></textarea></label>
    </div>
    <div class="mft"><button class="btn ghost" onClick=${close}>Cancelar</button><button class="btn" onClick=${() => save(false)}>Salvar rascunho</button><button class="btn pri" onClick=${() => save(true)}><${Icon} n="send" s=${14} />Publicar no painel</button></div></div>`;
}

/* contrato e pacote do mês */
function ContractSec({ c }) {
  const { act } = useApp(); const k = c.contract || {}; const p = k.pack || {};
  const set = patch => act.setContract(c.id, patch); const setP = patch => set({ pack: { ...p, ...patch } });
  const N = (key, label) => html`<label class="field"><span>${label}</span><input class="inp" id=${'ct-' + key} type="number" min="0" inputmode="numeric" value=${p[key] ?? ''} onChange=${e => setP({ [key]: e.target.value === '' ? null : Math.max(0, Math.round(num(e.target.value))) })} /></label>`;
  return html`<section class="ab-sec"><h2>Contrato e pacote do mês</h2>
    <div class="ct-grid"><label class="field"><span>Valor mensal</span><div style="display:flex;gap:6px"><select class="sel" id="ct-cur" style="width:86px" value=${k.currency || 'US$'} onChange=${e => set({ currency: e.target.value })}><option>US$</option><option>R$</option><option>€</option></select><input class="inp" id="ct-fee" inputmode="decimal" value=${k.fee || ''} onChange=${e => set({ fee: e.target.value.trim() })} /></div></label>
      <label class="field"><span>Início</span><input class="inp" id="ct-start" type="date" value=${k.start || ''} onChange=${e => set({ start: e.target.value || null })} /></label>
      <label class="field"><span>Renovação</span><input class="inp" id="ct-renew" type="date" value=${k.renew || ''} onChange=${e => set({ renew: e.target.value || null })} /></label></div>
    <div class="ct-grid">${N('posts', 'Posts por mês')}${N('scripts', 'Vídeos por mês')}${N('meetings', 'Reuniões por mês')}<label class="field"><span>Relatório mensal</span><span class="seg" style="align-self:flex-start"><button type="button" class=${cx(p.report !== false && 'on')} onClick=${() => setP({ report: true })}>Sim</button><button type="button" class=${cx(p.report === false && 'on')} onClick=${() => setP({ report: false })}>Não</button></span></label></div>
    <p class="muted" style="font-size:12px">O pacote monta o mês no QG e avisa quando a entrega passa do que foi contratado.</p></section>`;
}
function PackCard({ c, setTab }) {
  const { db, act, open } = useApp(); const p = (c.contract || {}).pack || {}; const mk = monthKey(); const inM = s => s && s.slice(0, 7) === mk;
  const has = p.posts || p.scripts || p.meetings;
  if (!has) return html`<section class="sec"><div class="sec-h"><h2>Pacote do mês</h2></div><div class="card docs-card"><p class="muted" style="font-size:13px">Cadastre o contrato na aba Sobre para acompanhar o que o mês inclui e o que passou dele.</p><button class="btn sm" style="align-self:flex-start" onClick=${() => setTab('about')}><${Icon} n="package" s=${13} />Cadastrar o contrato</button></div></section>`;
  const posts = db.posts.filter(x => x.clientId === c.id && inM(x.date)).length;
  const scripts = db.scripts.filter(x => x.clientId === c.id && inM(x.record)).length;
  const meets = db.events.filter(e => e.clientId === c.id && inM(e.date)).length;
  const Row = (label, n, max) => max ? html`<div class="pk-row" key=${label}><span>${label}</span><span class="bar"><i class=${n > max ? 'late' : ''} style=${{ width: Math.min(100, n / max * 100) + '%' }}></i></span><b class="tnum">${n} de ${max}</b>${n > max ? html`<span class="pill t-late">${n - max} a mais</span>` : null}</div>` : null;
  const gap = p.posts ? Math.max(0, p.posts - posts) : 0;
  return html`<section class="sec"><div class="sec-h"><h2>Pacote de ${monthName(mk)}</h2></div><div class="card docs-card">
    ${Row('Posts', posts, p.posts)}${Row('Vídeos', scripts, p.scripts)}${Row('Reuniões', meets, p.meetings)}
    ${gap > 0 && html`<button class="btn sm" style="align-self:flex-start" onClick=${() => act.buildMonth(c.id, gap, mk)}><${Icon} n="plus" s=${13} />Montar o mês: ${plural(gap, 'post', 'posts')} que faltam</button>`}
    <small class="muted">Conta o que tem data neste mês, em qualquer etapa da esteira.</small></div></section>`;
}

/* canal de aviso do cliente */
function NotifyField({ f, setF }) {
  const ch = f.notify || []; const tog = k => setF({ ...f, notify: ch.includes(k) ? ch.filter(x => x !== k) : [...ch, k] });
  return html`<div class="field"><span>Onde fica o cliente</span><div class="seg" style="align-self:flex-start">${COUNTRY.map(([k, l, d]) => html`<button type="button" key=${k} class=${cx(f.country === k && 'on')} onClick=${() => setF({ ...f, country: k, notify: d })}>${l}</button>`)}</div>
    <span style="margin-top:6px">Avisar por</span><div class="filter-chips">${Object.entries(CHN).map(([k, l]) => html`<button type="button" key=${k} class=${cx(ch.includes(k) && 'on')} aria-pressed=${ch.includes(k)} onClick=${() => tog(k)}>${l}</button>`)}</div>
    <p class="muted" style="font-size:12px">No Brasil, o WhatsApp está em quase todo celular. Nos EUA, só 32% dos adultos usam, então o aviso vai por e-mail e SMS.</p></div>`;
}
function NotifyChips({ c }) {
  const { act } = useApp(); const ch = (c.notify && c.notify.ch) || ['whatsapp'];
  const tog = k => { const L = ch.includes(k) ? ch.filter(x => x !== k) : [...ch, k]; if (L.length) act.setClient(c.id, { notify: { ...(c.notify || {}), ch: L } }); };
  return html`<span class="nt-chips">${Object.entries(CHN).map(([k, l]) => html`<button key=${k} class=${cx('see-chip', ch.includes(k) && 'on')} aria-pressed=${ch.includes(k)} onClick=${() => tog(k)}>${l}</button>`)}</span>`;
}

/* lembrete e acesso: uma mensagem por lote, no canal do cliente, e um lembrete só */
function MessageModal({ kind, clientId, close, fresh }) {
  const app = useApp(); const { db, toast, act } = app;
  const c = db.clients.find(x => x.id === clientId);
  const pend = pendingOf(db, clientId, null); const n = pend.length;
  const chs = (c.notify && c.notify.ch && c.notify.ch.length ? c.notify.ch : ['whatsapp']);
  const [ch, setCh] = useState(chs[0]);
  const who = c.contact && c.contact !== '—' ? c.contact.split(' ')[0] : '';
  const M = MSG[c.lang] || MSG.pt; const M2 = MSG2[c.lang] || MSG2.pt;
  const url = magicUrl(clientId, kind === 'remind' && n === 1 ? pend[0] : null);
  const base = kind === 'invite' ? M.invite(who) : M.remind(who, n);
  const text = ch === 'email' && kind === 'remind' ? M2.mail(who, n, url) : ch === 'sms' && kind === 'remind' ? M2.sms(n, url) : base.replace(/\[[^\]]+\]/, url);
  const subj = kind === 'remind' ? M2.subj(n) : '';
  const reminded = kind === 'remind' && c.reminded && diff(c.reminded) >= -3 ? c.reminded : null;
  const mark = () => { if (kind === 'remind') act.setClient(c.id, { reminded: off(0) }); };
  const tryLink = () => { close(); mark(); app.setSession({ role: 'cliente', clientId, via: 'link' }); app.setDeep(kind === 'remind' && pend[0] ? { k: pend[0][0], id: pend[0][1].id } : null); };
  return html`<div>
    <div class="mhd"><div><h2>${fresh ? `Área de ${c.name} criada` : kind === 'invite' ? `Mandar acesso para ${c.name}` : `Lembrar ${c.name}`}</h2><p>${kind === 'invite' ? 'O link já é o acesso: o cliente entra sem senha e cai direto no painel dele.' : 'Uma mensagem só para todas as peças que esperam por ele, e o link abre direto na primeira.'}</p></div><button class="btn icon ghost" aria-label="Fechar" onClick=${close}><${Icon} n="x" /></button></div>
    <div class="mbd">
      ${chs.length > 1 && html`<div class="seg" style="align-self:flex-start">${chs.map(k => html`<button key=${k} class=${cx(ch === k && 'on')} onClick=${() => setCh(k)}>${CHN[k]}</button>`)}</div>`}
      <span class="wa"><${Icon} n=${ch === 'email' ? 'mail' : 'msg'} s=${14} />${ch === 'whatsapp' ? 'WhatsApp' : ch === 'email' ? 'E-mail' : 'SMS'}, em ${LANG_PT[c.lang]}</span>
      ${subj && ch === 'email' && html`<p style="font-size:13px"><b>Assunto:</b> ${subj}</p>`}
      <div class="msg">${text}</div>
      ${reminded && html`<p class="be-warn">O último lembrete foi ${rel(reminded)}. A regra é um lembrete por lote de peças.</p>`}
      <p class="muted" style="font-size:12px">${ch === 'whatsapp' ? 'Vai pelo WhatsApp da M&O, à mão, sem custo por mensagem.' : ch === 'email' ? 'No produto, o e-mail sai sozinho pelo sistema.' : 'No produto, o SMS sai sozinho pelo sistema. Nos EUA, o número precisa do registro A2P 10DLC.'} O link vale só para este cliente e expira em 3 dias.</p>
      <button class="linkbtn" style="font-size:13px" onClick=${tryLink}>Testar: abrir o link como o cliente abre (protótipo)</button></div>
    <div class="mft"><button class="btn ghost" onClick=${close}>Fechar</button>${ch === 'whatsapp' && html`<a class="btn" href=${'https://wa.me/?text=' + encodeURIComponent(text)} target="_blank" rel="noopener" style="text-decoration:none" onClick=${mark}><${Icon} n="msg" s=${14} />Abrir no WhatsApp</a>`}<button class="btn pri" onClick=${() => copyText((subj && ch === 'email' ? 'Assunto: ' + subj + '\n\n' : '') + text, ok => { toast(ok ? 'Mensagem copiada.' : 'Não deu pra copiar. Selecione o texto e copie.'); if (ok) { mark(); close(); } })}><${Icon} n="copy" s=${14} />Copiar mensagem</button></div>
  </div>`;
}

/* histórico das ações novas */
Object.assign(LOGD, {
  review: ([k, id, r], p, n) => LI(n, k, id, r && r.ok ? (r.detail ? 'aprovou com um detalhe ' : 'aprovou ') + KW[k] : 'pediu uma rodada de ajuste ' + KN[k]),
  undoReview: ([k, id], p, n) => LI(n, k, id, 'desfez a decisão ' + KD[k]),
  talk: ([k, id], p, n) => LI(n, k, id, 'pediu para falar sobre um 3º ajuste ' + KN[k]),
  resolveTalk: ([k, id, how], p, n) => LI(n, k, id, (how === 'free' ? 'liberou sem custo uma rodada extra ' : how === 'paid' ? 'liberou, para cobrar à parte, uma rodada extra ' : 'transformou em peça nova o pedido ') + KN[k]),
  uncountRound: ([k, id], p, n) => LI(n, k, id, 'devolveu ao cliente uma rodada, por erro da M&O, ' + KN[k]),
  moveClient: ([k, id], p, n) => LI(n, k, id, 'mudou de cliente ' + KW[k]),
  intakeSubmit: ([cid], p, n) => LC(n, cid, 'preencheu o formulário de entrada de', null, 'about'),
  saveAccess: ([cid], p, n) => LC(n, cid, 'criou o próprio acesso ao painel de'),
  setContract: ([cid], p, n) => LC(n, cid, 'editou o contrato de', 'contract:' + cid, 'about'),
  buildMonth: ([cid, k2], p, n) => LC(n, cid, 'montou o pacote do mês com ' + plural(k2, 'ideia', 'ideias') + ' de post em'),
  saveReport: ([cid, , pub], p, n) => LC(n, cid, pub ? 'publicou o relatório do mês de' : 'salvou o rascunho do relatório de'),
});
