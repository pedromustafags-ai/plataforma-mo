
/* ================= v12: um endereço por tela, recentes e navegação do time ================= */
Object.assign(IC, { chart: ['M3 3v18h18', 'M7 15l4-4 3 3 6-7'], package: ['M21 8 12 3 3 8v8l9 5 9-5z', 'M3 8l9 5 9-5', 'M12 13v8'], key: ['M15 7a4 4 0 1 1-3.9 4.9L4 19v-3h3v-3h3l1.1-1.1A4 4 0 0 1 15 7z', 'M16.5 8.5h.01'], pin: ['M12 21s-7-6.2-7-12a7 7 0 1 1 14 0c0 5.8-7 12-7 12z', 'M14.5 9a2.5 2.5 0 1 1-5 0a2.5 2.5 0 1 1 5 0'] });
PERM.socio.add('round.grant');

/* o endereço da tela: só letras, números, ponto, til, hífen e sublinhado, para o link chegar inteiro */
const ROUTE_V = ['myday', 'inbox', 'overview', 'tasks', 'posts', 'scripts', 'calendar', 'meetings', 'boards', 'funnels', 'wiki', 'team', 'automations', 'history'];
const HID = s => /^[A-Za-z0-9_-]+$/.test(String(s || ''));
function routeHash(r, dr) {
  let h = 'myday';
  if (r.v === 'client') h = 'c.' + r.id + '.' + (r.tab || 'overview') + (r.pid && HID(r.pid) ? '.' + r.pid : '');
  else if (r.v === 'board') h = 'b.' + r.id;
  else if (r.v === 'funnel') h = 'f.' + r.id;
  else if (r.v === 'wiki' && r.pid) h = 'wiki.' + r.pid;
  else if (r.v === 'history' && r.cid) h = 'history.' + r.cid;
  else if (ROUTE_V.includes(r.v)) h = r.v;
  if (dr && ['task', 'post', 'script'].includes(dr.k) && HID(dr.id)) h += '~' + dr.k + '.' + dr.id;
  return h;
}
function parseHash(h) {
  h = String(h || '').replace(/^#/, ''); if (!h) return null;
  const [a, b] = h.split('~'); const p = a.split('.');
  if (p[0] === 'a' && p[1]) return { portal: { clientId: p[1], piece: p[2] && p[3] && ['post', 'script', 'task'].includes(p[2]) ? { k: p[2], id: p[3] } : null } };
  let route = null;
  if (p[0] === 'c' && p[1]) route = { v: 'client', id: p[1], tab: p[2] || 'overview', pid: p[3] };
  else if (p[0] === 'b' && p[1]) route = { v: 'board', id: p[1] };
  else if (p[0] === 'f' && p[1]) route = { v: 'funnel', id: p[1] };
  else if (p[0] === 'wiki') route = { v: 'wiki', pid: p[1] };
  else if (p[0] === 'history') route = { v: 'history', cid: p[1] };
  else if (ROUTE_V.includes(p[0])) route = { v: p[0] };
  if (!route) return null;
  const q = b ? b.split('.') : [];
  return { route, drawer: q[0] && q[1] && ['task', 'post', 'script'].includes(q[0]) ? { k: q[0], id: q[1] } : null };
}

/* a área do cliente em seis abas; as sub-abas guardam o nome antigo, para os links de dentro do sistema continuarem valendo */
const CLIENT_GROUPS = [['overview', 'QG', ['overview']], ['prod', 'Produção', ['posts', 'scripts', 'tasks']], ['calendar', 'Calendário', ['calendar']], ['meetings', 'Reuniões', ['meetings']], ['strategy', 'Estratégia', ['boards', 'funnels']], ['about', 'Sobre', ['about', 'brand', 'process', 'links']]];
const SUB_L = { posts: 'Postagens', scripts: 'Roteiros', tasks: 'Tarefas', boards: 'Quadros', funnels: 'Funis', about: 'Bio do cliente', brand: 'Marca', process: 'Processos', links: 'Links' };
const groupOf = tab => CLIENT_GROUPS.find(g => g[2].includes(tab)) || CLIENT_GROUPS[0];
function ClientArea({ id, tab, pid }) {
  const { db, go, can, setModal, setPreview } = useApp();
  const c = db.clients.find(x => x.id === id);
  if (!c) return html`<div class="page"><div class="card empty">Cliente não encontrado.</div></div>`;
  const CNT = { tasks: db.tasks.filter(t => t.clientId === id && t.status !== 'done').length, posts: db.posts.filter(p => p.clientId === id).length, scripts: db.scripts.filter(s => s.clientId === id).length, links: c.links.length, boards: db.boards.filter(b => b.clientId === id).length, funnels: db.funnels.filter(f => f.clientId === id).length };
  const setTab = t => go({ v: 'client', id, tab: t });
  const g = groupOf(tab);
  let view;
  switch (tab) {
    case 'tasks': view = html`<${TasksTab} c=${c} />`; break;
    case 'posts': view = html`<${PostsTab} c=${c} />`; break;
    case 'scripts': view = html`<${ScriptsTab} c=${c} />`; break;
    case 'calendar': view = html`<${TeamCalendar} c=${c} />`; break;
    case 'process': view = html`<${Docs} pages=${db.pages.filter(p => p.clientId === id)} editable clientPage initial=${pid} key=${pid || 'docs'} />`; break;
    case 'links': view = html`<${LinksTab} c=${c} />`; break;
    case 'brand': view = html`<${BrandEditor} c=${c} lang="pt" />`; break;
    case 'about': view = html`<${AboutTab} c=${c} />`; break;
    case 'meetings': view = html`<${MeetingsView} clientId=${id} />`; break;
    case 'boards': view = html`<${BoardsList} clientId=${id} />`; break;
    case 'funnels': view = html`<${FunnelsList} clientId=${id} />`; break;
    default: view = html`<${ClientQG} c=${c} setTab=${setTab} />`;
  }
  return html`<div class="page">
    <div class="chead"><${CMark} c=${c} lg />
      <div><h1>${c.name}</h1>${c.about && c.about.niche && html`<p class="chead-niche">${c.about.niche}</p>`}<div class="badges">${c.zero && html`<span class="tag">CLIENTE ZERO</span>`}<span class="tag">${'PAINEL EM ' + LANG_PT[c.lang].toUpperCase()}</span><span class="tag">RESP. ${firstName(db, c.owner).toUpperCase()}</span></div></div>
      <div class="acts">
        ${can('log.view') && html`<button class="btn" onClick=${() => go({ v: 'history', cid: id })}><${Icon} n="history" />Histórico</button>`}
        <button class="btn" onClick=${() => setPreview({ clientId: id, device: 'mobile' })}><${Icon} n="eye" />Ver como o cliente</button>
        ${can('client.invite') && html`<button class="btn pri" onClick=${() => setModal({ t: 'invite', clientId: id })}><${Icon} n="send" />Mandar acesso</button>`}
      </div>
    </div>
    <div class="tabs" role="tablist">${CLIENT_GROUPS.map(([gk, l, subs]) => html`<button key=${gk} role="tab" aria-selected=${g[0] === gk} class=${cx('tab', g[0] === gk && 'on')} onClick=${() => setTab(subs[0])}>${l}</button>`)}</div>
    ${g[2].length > 1 && html`<div class="subtabs"><div class="seg" role="tablist" aria-label=${g[1]}>${g[2].map(k => html`<button key=${k} role="tab" aria-selected=${tab === k} class=${cx(tab === k && 'on')} onClick=${() => setTab(k)}>${SUB_L[k]}${CNT[k] != null ? html` <span class="mono" style="opacity:.6">${CNT[k]}</span>` : null}</button>`)}</div>
      ${g[0] === 'prod' && html`<button class="linkbtn" style="font-size:13px" onClick=${() => go({ v: tab })}>Ver de todos os clientes</button>`}</div>`}
    ${view}
  </div>`;
}

/* criar sem cair no cliente errado: fora de um cliente, com mais de um, o sistema pergunta */
function NewMenu({ close }) {
  const { db, act, can, setModal, go, route } = useApp();
  const here = route.v === 'client' ? route.id : null;
  const cid = here || db.clients[0].id; const ask = !here && db.clients.length > 1;
  const it = (icon, label, fn) => html`<button onClick=${() => { close(); fn(); }}><${Icon} n=${icon} />${label}</button>`;
  return html`<div class="pop new-pop" role="menu">
    ${it('tasks', 'Tarefa', () => setModal({ t: 'newTask', clientId: here }))}
    ${it('image', 'Post', () => ask ? setModal({ t: 'pickClient', k: 'post' }) : act.addPost(cid))}
    ${it('script', 'Roteiro', () => ask ? setModal({ t: 'pickClient', k: 'script' }) : act.addScript(cid))}
    ${it('whiteboard', 'Quadro branco', () => { const id = act.addBoard(here); go({ v: 'board', id }); })}
    ${it('funnel', 'Funil', () => setModal({ t: 'newFunnel', clientId: here }))}
    ${it('file', 'Página de processo', () => { const id = act.addPage(null); go({ v: 'wiki', pid: id }); })}
    ${can('client.create') && it('building', 'Cliente', () => setModal({ t: 'newClient' }))}
  </div>`;
}
function PickClient({ close, k }) {
  const { db, act } = useApp();
  return html`<div><div class="mhd"><div><h2>${k === 'post' ? 'Novo post' : 'Novo roteiro'}: de qual cliente?</h2><p>A peça entra na esteira desse cliente, com os responsáveis dele.</p></div><button class="btn icon ghost" aria-label="Fechar" onClick=${close}><${Icon} n="x" /></button></div>
    <div class="mbd"><div class="list">${db.clients.map(c => html`<button key=${c.id} class="row pick-row" onClick=${() => { close(); k === 'post' ? act.addPost(c.id) : act.addScript(c.id); }}><${CMark} c=${c} /><div class="row-main"><div class="row-title">${c.name}</div>${c.about && c.about.niche && html`<div class="row-meta">${c.about.niche}</div>`}</div><${Icon} n="chevR" s=${14} /></button>`)}</div></div></div>`;
}
function ClientSel({ k, x }) {
  const { db, act } = useApp();
  return html`<select class="sel" id=${'cl-' + x.id} value=${x.clientId} onChange=${e => act.moveClient(k, x.id, e.target.value)}>${db.clients.map(c => html`<option key=${c.id} value=${c.id}>${c.name}</option>`)}</select>`;
}

/* ações novas da v12 */
const roundsOf = x => 2 + (x.extra || 0);
function approveBy(k, x) {
  const base = k === 'post' && x.date ? x.date : k === 'script' && x.record ? x.record : k === 'task' && x.due ? x.due : null;
  if (base) { const d = pd(base); if (k !== 'task') d.setDate(d.getDate() - 1); return iso(d); }
  const d = pd(x.sentAt || x.since || off(0)); d.setDate(d.getDate() + 3); return iso(d);
}
const pendingOf = (db, cid, who) => canApproveAs(who) ? [
  ...db.posts.filter(p => p.clientId === cid && p.status === 'cliente').map(x => ['post', x]),
  ...db.scripts.filter(s => s.clientId === cid && s.status === 'cliente').map(x => ['script', x]),
  ...db.tasks.filter(x => x.clientId === cid && x.status === 'client').map(x => ['task', x])] : [];
const monthKey = (s = off(0)) => s.slice(0, 7);
const monthName = (mk, lang = 'pt') => new Intl.DateTimeFormat(LOC(lang), { month: 'long', year: 'numeric' }).format(pd(mk + '-01'));
const capFirst = s => s ? s[0].toUpperCase() + s.slice(1) : s;

function actV12({ commit, notify, me, dbRef }) {
  const pieceTasks = (d, k, id) => d.tasks.filter(t => t.piece && t.piece.k === k && t.piece.id === id);
  return {
    moveClient: (k, id, cid) => { const nm = (dbRef.current.clients.find(c => c.id === cid) || {}).name || 'outro cliente'; commit(d => { const x = itemOf(d, k, id); if (!x || x.clientId === cid) return; x.clientId = cid; pieceTasks(d, k, id).forEach(t => { t.clientId = cid; }); }, 'Peça movida para ' + nm); },
    review: (k, id, r) => commit(d => {
      const x = itemOf(d, k, id); if (!x) return; x.since = off(0); const c = d.clients.find(y => y.id === x.clientId);
      if (r.ok) {
        if (k === 'task') { x.status = 'done'; x.changeReq = false; } else { const nx = nextOf(flowFor(c, k), 'cliente'); moveTo(d, k, x, nx ? nx.key : null); }
        if (r.detail) { x.comments.push({ by: 'client', text: r.detail, detail: true, at: off(0) }); const t = d.tasks.find(t2 => t2.piece && t2.piece.k === k && t2.piece.id === id && t2.status !== 'done'); if (t) t.desc = `Antes de publicar, ajustar o detalhe que o cliente pediu ao aprovar: "${r.detail}"` + (t.desc ? '\n\n' + t.desc : ''); }
        x.lastRound = null;
        notify(d, x.assignee, 'client', r.detail ? 'aprovou com um detalhe' : 'aprovou', k, id);
      } else {
        x.rounds = (x.rounds || 0) + 1; x.lastRound = { n: x.rounds, items: r.list, at: off(0) };
        r.list.forEach(it => x.comments.push({ by: 'client', text: it.text, slide: it.slide || null, pin: it.pin || null, round: x.rounds, at: off(0) }));
        if (k === 'task') { x.status = 'doing'; x.changeReq = true; } else moveTo(d, k, x, prevWorkOf(flowFor(c, k), 'cliente').key, { note: `Ajuste do cliente (rodada ${x.rounds})`, status: 'ajuste', changeReq: true });
        notify(d, x.assignee, 'client', `pediu a rodada ${x.rounds} de ${roundsOf(x)} em`, k, id);
      }
    }),
    undoReview: (k, id, kind) => commit(d => {
      const x = itemOf(d, k, id); if (!x) return;
      if (k === 'task') { x.status = 'client'; x.changeReq = false; } else moveTo(d, k, x, 'cliente');
      if (kind === 'round' && x.rounds) { const n = x.rounds; x.comments = x.comments.filter(cm => !(cm.by === 'client' && cm.round === n)); x.rounds = n - 1; x.lastRound = null; }
      if (kind === 'detail') { const i = x.comments.map(cm => !!cm.detail).lastIndexOf(true); if (i >= 0) x.comments.splice(i, 1); }
    }),
    talk: (k, id, text) => commit(d => {
      const x = itemOf(d, k, id); if (!x) return; const c = d.clients.find(y => y.id === x.clientId);
      x.talk = { text, at: off(0), state: 'open' };
      d.tasks.unshift({ id: uid('t'), clientId: x.clientId, title: `Falar com ${c.name} sobre o 3º ajuste: ${x.title}`, desc: `O cliente já usou as ${roundsOf(x)} rodadas incluídas e pediu: "${text}". Um sócio decide na própria peça: liberar sem custo, cobrar à parte ou tratar como peça nova.`, type: 'interna', req: true, priority: 'alta', checklist: [], comments: [], changeReq: false, status: 'todo', due: off(1), since: off(0), assignee: c.owner, talkOf: { k, id } });
      new Set([c.owner, ...d.people.filter(p => p.role === 'socio').map(p => p.id)]).forEach(p => notify(d, p, 'client', 'quer falar sobre um 3º ajuste em', k, id));
    }),
    resolveTalk: (k, id, how) => commit(d => {
      const x = itemOf(d, k, id); if (!x || !x.talk) return; const c = d.clients.find(y => y.id === x.clientId); const text = x.talk.text;
      x.talk = { ...x.talk, state: 'done', how, by: me ? me.id : null, done: off(0) };
      d.tasks.forEach(t => { if (t.talkOf && t.talkOf.k === k && t.talkOf.id === id && t.status !== 'done') { t.status = 'done'; t.since = off(0); } });
      if (how === 'free' || how === 'paid') {
        x.extra = (x.extra || 0) + 1; if (how === 'paid') x.paidRounds = (x.paidRounds || 0) + 1;
        x.rounds = (x.rounds || 0) + 1; x.lastRound = { n: x.rounds, items: [{ text }], at: off(0) }; x.comments.push({ by: 'client', text, round: x.rounds, at: off(0) });
        if (k === 'task') { x.status = 'doing'; x.changeReq = true; } else moveTo(d, k, x, prevWorkOf(flowFor(c, k), 'cliente').key, { note: `Rodada extra ${how === 'paid' ? 'cobrada à parte' : 'liberada sem custo'}`, status: 'ajuste', changeReq: true });
      }
      if (how === 'new') {
        const nid = uid(k === 'post' ? 'p' : 's'); const base = { id: nid, n: 99, clientId: x.clientId, title: x.title + ' (peça nova)', stage: null, media: [], assignee: c.owner, comments: [{ by: 'client', text, at: off(0) }], sentAt: null, since: off(0), from: 'talk' };
        if (k === 'post') d.posts.unshift({ ...base, status: 'ideia', format: x.format, fmtAuto: true, video: null, date: null, caption: '', cta: '', imgs: [] });
        else if (k === 'script') d.scripts.unshift({ ...base, status: 'rascunho', kind: x.kind, lang: x.lang, format: '', angle: '', record: null, tpl: 'livre', blocks: [['', '']] });
        x.talk.newId = nid;
      }
    }, how === 'new' ? 'Peça nova criada com o pedido do cliente' : how === 'paid' ? 'Rodada extra liberada e marcada para cobrar' : 'Rodada extra liberada sem custo'),
    uncountRound: (k, id) => commit(d => { const x = itemOf(d, k, id); if (x && x.rounds > 0) { x.rounds--; x.uncounted = (x.uncounted || 0) + 1; } }, 'Rodada devolvida ao cliente: o ajuste foi erro da M&O'),
    intakeSubmit: (cid, f, by) => commit(d => {
      const c = d.clients.find(x => x.id === cid); if (!c) return; const a = c.about || {};
      c.about = { ...a, desc: f.desc || a.desc || '', niche: f.niche || a.niche || '', goals: f.goals.length ? f.goals : (a.goals || []) };
      if (f.approver) c.contact = f.approver;
      c.notify = { ...(c.notify || {}), ch: f.ch.length ? f.ch : ((c.notify || {}).ch || ['whatsapp']), phone: f.phone, email: f.email };
      c.intake = { ...f, done: true, at: off(0), by };
      const tick = (word, on) => { if (!on) return; const o = c.onboarding.find(y => y.t.includes(word)); if (o) o.done = true; };
      tick('Gerenciador', f.access.includes('meta')); tick('Instagram', f.access.includes('instagram')); tick('WhatsApp', f.access.includes('wa'));
      notify(d, c.owner, by || 'client', 'preencheu o formulário de entrada de', 'client', cid, { cid, label: c.name });
    }),
    saveAccess: (cid, key, f) => commit(d => { const c = d.clients.find(x => x.id === cid); if (!c) return; c.access = { ...(c.access || {}), [key]: { name: f.name, email: f.email, password: !!f.password, at: off(0) } }; }),
    setContract: (cid, patch) => commit(d => { const c = d.clients.find(x => x.id === cid); c.contract = { ...(c.contract || {}), ...patch }; }),
    buildMonth: (cid, n, mk) => commit(d => {
      const c = d.clients.find(x => x.id === cid); const last = new Date(pd(mk + '-01').getFullYear(), pd(mk + '-01').getMonth() + 1, 0); const first = Math.max(diff(mk + '-01'), 0); const span = Math.max(0, diff(iso(last)) - first);
      for (let i = 0; i < n; i++) d.posts.unshift({ id: uid('p'), n: 99, clientId: cid, title: `Post ${i + 1} do pacote de ${monthName(mk)}`, status: 'ideia', stage: null, media: [], format: null, fmtAuto: true, video: null, assignee: c.owner, comments: [], date: off(first + Math.round(span * i / Math.max(1, n - 1))), caption: '', cta: '', imgs: [], sentAt: null, since: off(0) });
    }, `${plural(n, 'ideia de post criada', 'ideias de post criadas')} para fechar o pacote`),
    saveReport: (cid, rep, publish) => commit(d => {
      const c = d.clients.find(x => x.id === cid); const L = c.reports || []; const i = L.findIndex(r => r.month === rep.month);
      const r = { ...rep, published: !!publish, at: off(0), by: me ? me.id : null }; c.reports = i >= 0 ? L.map((y, j) => (j === i ? r : y)) : [...L, r];
    }, publish ? 'Relatório publicado no painel do cliente' : 'Rascunho do relatório salvo'),
  };
}
