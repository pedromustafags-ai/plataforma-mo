/* ================= v2: capacidades do artifact ================= */
const capP = {};
const cap = name => (capP[name] ??= (window.claude && window.claude.use ? window.claude.use(name).catch(() => null) : Promise.resolve(null)));
const SRV = { cal: 'Google Calendar', tq: 'Tactiq', drive: 'Google Drive', gmail: 'Gmail' };
const SRV_PT = { 'Google Calendar': 'Google Agenda', Tactiq: 'Tactiq', 'Google Drive': 'Google Drive', Gmail: 'Gmail' };
function mcpMsg(e, server) {
  const s = SRV_PT[server] || server; const c = e && e.code;
  const M = {
    needs_reauth: `Reconecte o ${s} em claude.ai, Configurações, Conectores.`,
    server_not_connected: `O ${s} não está conectado na sua conta do Claude. Adicione em Configurações, Conectores.`,
    selection_required: `Escolha qual conta do ${s} usar no aviso do Claude.`,
    not_in_manifest: `Você não liberou o ${s} para esta página.`,
    consent_required: `Libere o ${s} para esta página e tente de novo.`,
    blocked_by_policy: `A política da sua organização bloqueia o ${s} aqui.`,
    approval_required: `O ${s} precisa de aprovação da organização.`,
    server_unavailable: `O ${s} não respondeu agora. Tente de novo em instantes.`,
    tool_error: `O ${s} recusou o pedido: ${(e && e.message) || ''}`,
    not_granted: 'As integrações não foram liberadas nesta visualização.',
    capability_disabled: 'As integrações não funcionam nesta visualização.',
  };
  return M[c] || `Não deu para falar com o ${s} (${c || 'erro'}).`;
}
const SAMPLE_MSG = {
  not_granted: 'Você não liberou o Claude para esta página. Dá para liberar no menu de permissões do artifact.',
  sampling_disabled: 'O Claude não está disponível para esta conta.',
  rate_limited: 'Muitas perguntas seguidas. Espere um pouco e tente de novo.',
  session_expired: 'Sua sessão expirou. Entre de novo no Claude.',
  refused: 'O Claude não quis responder isso. Tente perguntar de outro jeito.',
  empty_completion: 'Veio uma resposta vazia. Tente simplificar a pergunta.',
  invalid_json: 'A resposta veio fora do formato. Tente de novo.',
  prompt_too_large: 'Texto grande demais. Corte um pedaço e tente de novo.',
  tools_unavailable: 'Esta visualização não deixa o Claude usar as ferramentas da página.',
};
const sampleMsg = e => SAMPLE_MSG[e && e.code] || 'A conexão com o Claude falhou. Tente de novo.';
const dtOff = (n, hm) => { const x = pd(off(n)); const [h, m] = hm.split(':').map(Number); x.setHours(h, m, 0, 0); return x.toISOString(); };
const nf = (n, d = 0) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: d, minimumFractionDigits: 0 }).format(n);
const money = (n, cur) => n == null || !isFinite(n) ? '—' : `${cur} ${nf(n, n < 100 ? 2 : 0)}`;
const num = v => { const x = parseFloat(String(v ?? '').replace(',', '.')); return isFinite(x) ? x : 0; };
const hhmm = iso => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const dayOf = iso => iso2day(new Date(iso));
const iso2day = x => `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

/* ================= v2: dados novos ================= */
const STICKY = { sand: '#EFE3CD', cream: '#F7F0E3', green: '#DCE9DD', blue: '#DCE6F0', lilac: '#E6E0F0', pink: '#F2DEDC' };
function seedV2() {
  const S = (id, x, y, color, text) => ({ id, t: 'sticky', x, y, w: 190, h: 130, color, text });
  const boards = [
    { id: 'b1', clientId: null, title: 'Mapa do onboarding de cliente', by: 'bruno', at: off(-2), els: [
      { id: 'h1', t: 'text', x: 40, y: 10, w: 640, h: 44, text: 'Onboarding: do sim do cliente à primeira peça', size: 24 },
      { id: 'l1', t: 'text', x: 40, y: 64, w: 190, h: 30, text: 'Dia 1', size: 15 },
      { id: 'l2', t: 'text', x: 290, y: 64, w: 190, h: 30, text: 'Semana 1', size: 15 },
      { id: 'l3', t: 'text', x: 540, y: 64, w: 190, h: 30, text: 'Semana 2', size: 15 },
      S('s1', 40, 100, 'sand', 'Cadastrar o cliente e criar a área'),
      S('s2', 40, 250, 'sand', 'Mandar o acesso pelo WhatsApp'),
      S('s3', 290, 100, 'blue', 'Pedir acesso ao Gerenciador de Negócios da Meta'),
      S('s4', 290, 250, 'blue', 'Pedir o número do WhatsApp Business'),
      S('s5', 540, 100, 'green', 'Kickoff: descrever a operação do cliente melhor do que ele descreveu'),
      S('s6', 540, 250, 'pink', 'Dúvida: quem aprova as peças do lado do cliente?'),
      { id: 'a1', t: 'arrow', from: 's1', to: 's3' }, { id: 'a2', t: 'arrow', from: 's2', to: 's4' },
      { id: 'a3', t: 'arrow', from: 's3', to: 's5' }, { id: 'a4', t: 'arrow', from: 's4', to: 's6' },
      { id: 'r1', t: 'ellipse', x: 800, y: 160, w: 170, h: 110, text: 'Primeira peça com o cliente' },
      { id: 'a5', t: 'arrow', from: 's5', to: 'r1' },
    ] },
    { id: 'b2', clientId: 'mo', title: 'Ganchos para os Reels de outubro', by: 'pedro', at: off(-1), els: [
      { id: 'h1', t: 'text', x: 40, y: 10, w: 600, h: 44, text: 'Ganchos: o que abre os próximos Reels', size: 24 },
      S('g1', 40, 80, 'cream', 'This is the message that loses you the job, and it takes eleven seconds to fix.'),
      S('g2', 260, 80, 'cream', 'Three ways to answer "how much do you charge". Two of them lose the deal.'),
      S('g3', 480, 80, 'lilac', 'Sou brasileiro e não consigo cliente nos EUA, o que pode ser?'),
      S('g4', 40, 240, 'lilac', 'Estou nos EUA há menos de 5 anos e só fecho por indicação'),
      S('g5', 260, 240, 'green', 'Só me chama gente querendo preço baixo. É porque eu sou brasileiro?'),
      { id: 'c1', t: 'rect', x: 480, y: 240, w: 190, h: 130, text: 'Regra: experiência abre, filósofo sustenta' },
      { id: 'p1', t: 'pen', color: '#9A3B2E', pts: [[30, 70], [250, 64], [440, 70], [680, 66], [686, 214], [690, 382], [460, 388], [240, 382], [26, 388], [24, 230], [30, 72]] },
    ] },
  ];
  const N = (id, type, x, y, p = {}, label) => ({ id, type, x, y, p, label: label || FN[type].label });
  const funnels = [
    { id: 'f1', clientId: 'mo', title: 'Funil de Qualificação Imediata', currency: 'US$', by: 'pedro', at: off(-1),
      note: 'Premissas de exemplo para planejar. Troque pelos números reais quando a campanha rodar.',
      nodes: [N('n1', 'meta', 0, 40, { invest: 3000, cpc: 2.5 }), N('n8', 'organico', 0, 220, { visits: 300 }), N('n2', 'quiz', 280, 130),
        N('n3', 'lead', 560, 130, {}, 'Lead (concluiu o quiz)'), N('n4', 'agente', 840, 130), N('n5', 'qualificado', 1120, 130),
        N('n6', 'reuniao', 1400, 130), N('n7', 'venda', 1680, 130, { conv: 100, price: '' })],
      edges: [{ id: 'e1', from: 'n1', to: 'n2', rate: 100 }, { id: 'e2', from: 'n8', to: 'n2', rate: 100 }, { id: 'e3', from: 'n2', to: 'n3', rate: 25 },
        { id: 'e4', from: 'n3', to: 'n4', rate: 70 }, { id: 'e5', from: 'n4', to: 'n5', rate: 35 }, { id: 'e6', from: 'n5', to: 'n6', rate: 55 }, { id: 'e7', from: 'n6', to: 'n7', rate: 25 }] },
    tplVSL('f2', null),
  ];
  const team = ['Pedro Mustafa', 'Bruno', 'Felipe', 'Vinícius'].map(name => ({ name }));
  const meetings = [
    { key: 'ex:m1', example: true, clientId: 'mo', title: 'Revisão da semana M&O', start: dtOff(-3, '10:00'), end: dtOff(-3, '10:48'), attendees: team,
      transcript: `Pedro: Primeira coisa, o script do agente. Felipe, você viu as seis emendas?
Felipe: Vi. A da etapa seis é a mais séria. Preciso do teu veredito até quinta pra subir no agente.
Pedro: Fechado. Eu dou o veredito até quarta.
Bruno: Sobre o MVV, o post está escrito, mas eu ainda não registrei. Faço isso essa semana.
Vinícius: A campanha do quiz está com os criativos no ar desde ontem. Falta conectar o formulário e testar os eventos.
Pedro: Termina isso até sexta. E a gente decide formulário nativo ou conversa direta depois de uma semana rodando.
Bruno: Preciso também das três faixas de preço pra fechar a proposta modelo.
Pedro: Eu mando os números na segunda. E alguém troca o nome do Instagram, que ainda está como Peter Johnson.
Bruno: Deixa comigo.` },
    { key: 'ex:m2', example: true, clientId: 'mo', title: 'Alinhamento do quiz com o Vinícius', start: dtOff(-1, '15:00'), end: dtOff(-1, '15:31'), attendees: [{ name: 'Pedro Mustafa' }, { name: 'Vinícius' }],
      transcript: `Vinícius: Os três criativos estão rodando. O que mais puxa clique é o do tempo de resposta.
Pedro: Faz sentido, é o gancho mais concreto. Quanto está o clique?
Vinícius: Ainda cedo pra dizer, dois dias de dado. Eu preferia esperar a semana fechar antes de mexer.
Pedro: Concordo. Mas quero o relatório medindo custo por reunião agendada, não custo por lead.
Vinícius: Então preciso que o Felipe marque no CRM quando a reunião é agendada pelo agente.
Pedro: Eu falo com ele hoje. Semana que vem a gente olha junto na segunda.` },
    { key: 'ex:m3', example: true, clientId: 'mo', title: 'Revisão da semana M&O', start: dtOff(3, '10:00'), end: dtOff(3, '10:45'), attendees: team },
  ];
  return { boards, funnels, meetings, meetingNotes: {}, meetingClient: {}, automations: { au1: true, au2: true, au3: false },
    favs: { pedro: ['funnel:f1', 'board:b1'], felipe: ['board:b1'], bruno: ['board:b1'], vinicius: ['funnel:f1'] } };
}
function tplVSL(id, clientId) {
  const N = (nid, type, x, y, p = {}) => ({ id: nid, type, x, y, p, label: FN[type].label });
  return { id, clientId, title: 'VSL com upsell e downsell', currency: 'US$', by: 'pedro', at: off(-6), tpl: true,
    note: 'Modelo clássico de funil de oferta. As taxas são premissas para você editar.',
    nodes: [N('v1', 'meta', 0, 120, { invest: 2000, cpc: 1.2 }), N('v2', 'vsl', 280, 120), N('v3', 'checkout', 560, 120, { conv: 30, price: 97 }),
      N('v4', 'upsell', 840, 40, { conv: 25, price: 197 }), N('v5', 'downsell', 1120, 220, { conv: 20, price: 47 }), N('v6', 'obrigado', 1400, 120)],
    edges: [{ id: 'x1', from: 'v1', to: 'v2', rate: 100 }, { id: 'x2', from: 'v2', to: 'v3', rate: 12 }, { id: 'x3', from: 'v3', to: 'v4', rate: 30 },
      { id: 'x4', from: 'v4', to: 'v5', rate: 75 }, { id: 'x5', from: 'v4', to: 'v6', rate: 25 }, { id: 'x6', from: 'v5', to: 'v6', rate: 100 }] };
}
function tplQualif(id, clientId) {
  const f = structuredClone(seedV2().funnels[0]); f.id = id; f.clientId = clientId; f.at = off(0); return f;
}

/* ================= v2: funil ================= */
const FN = {
  meta: { g: 'Tráfego', label: 'Meta Ads', kind: 'traffic', paid: true, ic: 'megaphone' },
  google: { g: 'Tráfego', label: 'Google Ads', kind: 'traffic', paid: true, ic: 'search' },
  youtube: { g: 'Tráfego', label: 'YouTube Ads', kind: 'traffic', paid: true, ic: 'play' },
  organico: { g: 'Tráfego', label: 'Instagram orgânico', kind: 'traffic', paid: false, ic: 'image' },
  indicacao: { g: 'Tráfego', label: 'Indicação', kind: 'traffic', paid: false, ic: 'users' },
  lista: { g: 'Tráfego', label: 'Lista de e-mail', kind: 'traffic', paid: false, ic: 'mail' },
  landing: { g: 'Páginas', label: 'Página de captura', kind: 'page', ic: 'file' },
  quiz: { g: 'Páginas', label: 'Quiz', kind: 'page', ic: 'quiz' },
  vsl: { g: 'Páginas', label: 'Página com VSL', kind: 'page', ic: 'play' },
  webinar: { g: 'Páginas', label: 'Webinar', kind: 'page', ic: 'video' },
  agenda: { g: 'Páginas', label: 'Página de agendamento', kind: 'page', ic: 'cal' },
  checkout: { g: 'Páginas', label: 'Checkout', kind: 'buy', ic: 'cart' },
  upsell: { g: 'Páginas', label: 'Upsell', kind: 'buy', ic: 'arrowUR' },
  downsell: { g: 'Páginas', label: 'Downsell', kind: 'buy', ic: 'chevD' },
  obrigado: { g: 'Páginas', label: 'Obrigado', kind: 'page', ic: 'check' },
  agente: { g: 'Conversa', label: 'Agente de IA no WhatsApp', kind: 'talk', ic: 'msg' },
  email: { g: 'Conversa', label: 'Sequência de e-mail', kind: 'talk', ic: 'mail' },
  sdr: { g: 'Conversa', label: 'Ligação do SDR', kind: 'talk', ic: 'phone' },
  lead: { g: 'Resultado', label: 'Lead', kind: 'lead', ic: 'users' },
  qualificado: { g: 'Resultado', label: 'Lead qualificado', kind: 'lead', ic: 'check' },
  reuniao: { g: 'Resultado', label: 'Reunião agendada', kind: 'meeting', ic: 'cal' },
  venda: { g: 'Resultado', label: 'Venda', kind: 'buy', ic: 'cart' },
};
const KIND_TONE = { traffic: 'prog', page: 'cli', buy: 'ok', talk: 'adj', lead: 'neu', meeting: 'ok' };
function computeFunnel(nodes, edges) {
  const by = Object.fromEntries(nodes.map(n => [n.id, n]));
  const inE = {}, outE = {}; nodes.forEach(n => { inE[n.id] = []; outE[n.id] = []; });
  edges.forEach(e => { if (by[e.from] && by[e.to] && e.from !== e.to) { outE[e.from].push(e); inE[e.to].push(e); } });
  const deg = Object.fromEntries(nodes.map(n => [n.id, inE[n.id].length]));
  const q = nodes.filter(n => !deg[n.id]).map(n => n.id); const order = [];
  while (q.length) { const id = q.shift(); order.push(id); outE[id].forEach(e => { if (--deg[e.to] === 0) q.push(e.to); }); }
  const vol = {}, flow = {}, buyers = {}, rev = {};
  let invest = 0, varCost = 0, visits = 0, leads = 0, qual = 0, meetings = 0, sales = 0, revenue = 0;
  order.forEach(id => {
    const n = by[id]; const T = FN[n.type] || {}; let v = 0;
    if (T.kind === 'traffic') { const own = T.paid ? num(n.p.invest) / Math.max(num(n.p.cpc), 0.01) : num(n.p.visits); v += own; visits += own; if (T.paid) invest += num(n.p.invest); }
    inE[id].forEach(e => { v += flow[e.id] || 0; });
    vol[id] = v;
    if (T.kind === 'talk') varCost += v * num(n.p.cost);
    if (T.kind === 'buy') { const c = n.p.conv === '' || n.p.conv == null ? 100 : num(n.p.conv); buyers[id] = v * c / 100; rev[id] = buyers[id] * num(n.p.price); sales += buyers[id]; revenue += rev[id]; }
    if (n.type === 'lead') leads += v; if (n.type === 'qualificado') qual += v; if (n.type === 'reuniao') meetings += v;
    outE[id].forEach(e => { flow[e.id] = v * num(e.rate) / 100; });
  });
  return { vol, flow, buyers, rev, cycle: order.length !== nodes.length,
    t: { invest, varCost, cost: invest + varCost, visits, leads, qual, meetings, sales, revenue, cpMeet: meetings ? (invest + varCost) / meetings : null, cpl: leads ? (invest + varCost) / leads : null, roas: invest && revenue ? revenue / (invest + varCost) : null } };
}

/* ================= v2: navegação ================= */
const SECTIONS = [
  { id: 'work', label: 'Trabalho', items: [['tasks', 'tasks', 'Tarefas'], ['posts', 'image', 'Postagens'], ['scripts', 'script', 'Roteiros'], ['calendar', 'cal', 'Calendário'], ['meetings', 'video', 'Reuniões']] },
  { id: 'strategy', label: 'Estratégia', items: [['boards', 'whiteboard', 'Quadros'], ['funnels', 'funnel', 'Funis']] },
  { id: 'company', label: 'Empresa', items: [['overview', 'grid', 'Visão geral'], ['wiki', 'book', 'Processos internos'], ['team', 'users', 'Equipe'], ['automations', 'zap', 'Automações']] },
];
const CLIENT_TABS = [['overview', 'Visão geral', 'grid'], ['tasks', 'Tarefas', 'tasks'], ['posts', 'Postagens', 'image'], ['scripts', 'Roteiros', 'script'], ['calendar', 'Calendário', 'cal'], ['meetings', 'Reuniões', 'video'], ['boards', 'Quadros', 'whiteboard'], ['funnels', 'Funis', 'funnel'], ['process', 'Processos', 'file'], ['links', 'Links', 'link']];
const SIDE_DEFAULT = { hidden: [], collapsed: [], order: ['favs', 'work', 'strategy', 'clients', 'company'], open: { mo: false } };
function favTarget(db, key) {
  const [k, id] = key.split(':');
  if (k === 'funnel') { const f = db.funnels.find(x => x.id === id); return f && { icon: 'funnel', title: f.title, route: { v: 'funnel', id } }; }
  if (k === 'board') { const b = db.boards.find(x => x.id === id); return b && { icon: 'whiteboard', title: b.title, route: { v: 'board', id } }; }
  if (k === 'task' || k === 'post' || k === 'script') { const x = itemOf(db, k, id); return x && { icon: k === 'task' ? 'tasks' : k === 'post' ? 'image' : 'script', title: x.title, drawer: { k, id } }; }
  if (k === 'page') { const p = db.pages.find(x => x.id === id); return p && { icon: 'file', title: p.title, route: p.clientId ? { v: 'client', id: p.clientId, tab: 'process' } : { v: 'wiki' } }; }
  return null;
}

function SidebarV2() {
  const app = useApp();
  const { db, route, go, me, can, setPalette, setModal, setSession, theme, setTheme, sideOpen, rail, setRail, copilot, setCopilot, open } = app;
  const [prefs, setPrefsS] = useState(() => ({ ...SIDE_DEFAULT, ...lsGet('mo.side.v2', {}) }));
  const setPrefs = p => { setPrefsS(p); lsSet('mo.side.v2', p); };
  const [menu, setMenu] = useState(null);
  const unread = db.notes.filter(n => n.to === me.id && !n.read).length;
  const waiting = cid => db.posts.filter(p => p.clientId === cid && p.status === 'cliente').length + db.scripts.filter(s => s.clientId === cid && s.status === 'cliente').length + db.tasks.filter(t => t.clientId === cid && t.status === 'client').length;
  const counts = { tasks: db.tasks.filter(t => t.assignee === me.id && t.status !== 'done').length, meetings: allMeetingsCount(app) };
  const N = (v, icon, label, count, extra) => html`<button key=${v} class=${cx('nav', route.v === v && 'on')} title=${label} onClick=${() => go({ v, ...(extra || {}) })} aria-current=${route.v === v ? 'page' : null}><${Icon} n=${icon} /><span class="lb">${label}</span>${count ? html`<span class="n soft">${count}</span>` : null}</button>`;
  const collapsed = id => prefs.collapsed.includes(id);
  const toggleSec = id => setPrefs({ ...prefs, collapsed: collapsed(id) ? prefs.collapsed.filter(x => x !== id) : [...prefs.collapsed, id] });
  const SecH = (id, label, extra) => html`<div class="sec-row"><button class="side-label sec-btn" aria-expanded=${!collapsed(id)} onClick=${() => toggleSec(id)}><span class=${cx('chev', collapsed(id) && 'shut')}><${Icon} n="chevD" s=${12} /></span>${label}</button>${extra}</div>`;
  const favs = (db.favs[me.id] || []).map(k => [k, favTarget(db, k)]).filter(([, t]) => t);
  const blocks = {
    favs: favs.length ? html`<div class="side-sec" key="favs">${SecH('favs', 'Favoritos')}${!collapsed('favs') && favs.map(([k, t]) => html`<button key=${k} class="nav" title=${t.title} onClick=${() => t.route ? go(t.route) : open(t.drawer.k, t.drawer.id)}><${Icon} n=${t.icon} /><span class="lb">${t.title}</span></button>`)}</div>` : null,
    clients: html`<div class="side-sec" key="clients">${SecH('clients', 'Clientes', can('client.create') && html`<button class="sec-add" title="Novo cliente" aria-label="Novo cliente" onClick=${() => setModal({ t: 'newClient' })}><${Icon} n="plus" s=${13} /></button>`)}
      ${!collapsed('clients') && db.clients.map(c => { const isOpen = !!prefs.open[c.id]; const here = route.v === 'client' && route.id === c.id; return html`<div key=${c.id} class="tree">
        <div class=${cx('nav tree-row', here && !isOpen && 'on')}>
          <button class="tree-tog" aria-label=${isOpen ? 'Recolher' : 'Expandir'} aria-expanded=${isOpen} onClick=${() => setPrefs({ ...prefs, open: { ...prefs.open, [c.id]: !isOpen } })}><span class=${cx('chev', !isOpen && 'shut')}><${Icon} n="chevD" s=${12} /></span></button>
          <button class="tree-main" title=${c.name} onClick=${() => go({ v: 'client', id: c.id, tab: 'overview' })}><${CMark} c=${c} /><span class="lb">${c.name}</span>${waiting(c.id) ? html`<span class="n soft" title="Esperando o cliente">${waiting(c.id)}</span>` : null}</button>
        </div>
        ${isOpen && html`<div class="tree-kids">${CLIENT_TABS.map(([k, l, ic]) => html`<button key=${k} class=${cx('nav kid', here && route.tab === k && 'on')} onClick=${() => go({ v: 'client', id: c.id, tab: k })}><${Icon} n=${ic} s=${14} /><span class="lb">${l}</span></button>`)}</div>`}
      </div>`; })}</div>`,
  };
  SECTIONS.forEach(s => {
    const items = s.items.filter(([v]) => !prefs.hidden.includes(v));
    blocks[s.id] = items.length ? html`<div class="side-sec" key=${s.id}>${SecH(s.id, s.label)}${!collapsed(s.id) && items.map(([v, ic, l]) => N(v, ic, l, v === 'tasks' ? counts.tasks : v === 'meetings' ? counts.meetings : 0))}</div>` : null;
  });
  return html`<aside class=${cx('side', sideOpen && 'open')} aria-label="Navegação">
    <div class="side-head"><${Logo} /><button class="rail-btn" aria-label=${rail ? 'Expandir barra' : 'Recolher barra'} title="Recolher barra (⌘\\)" onClick=${() => setRail(!rail)}><${Icon} n="panelL" /></button></div>
    <button class="search-btn" onClick=${() => setPalette(true)} title="Buscar (⌘K)"><${Icon} n="search" /><span class="lb">Buscar ou ir para…</span><kbd>⌘K</kbd></button>
    <div class="side-actions">
      <div class="p-menu"><button class="act-btn" aria-expanded=${menu === 'new'} onClick=${() => setMenu(menu === 'new' ? null : 'new')} title="Criar"><${Icon} n="plus" /><span class="lb">Novo</span></button>
        ${menu === 'new' && html`<${NewMenu} close=${() => setMenu(null)} />`}</div>
      <button class=${cx('act-btn cp', copilot.open && 'on')} onClick=${() => setCopilot({ ...copilot, open: !copilot.open })} title="Copiloto (⌘J)"><${Icon} n="sparkle" /><span class="lb">Copiloto</span><kbd>⌘J</kbd></button>
    </div>
    ${N('myday', 'sun', 'Meu dia', 0)}
    ${N('inbox', 'inbox', 'Caixa de entrada', unread)}
    ${prefs.order.map(id => blocks[id])}
    <div class="side-foot">
      <div class="me" title=${me.name}><span class="av">${me.ini}</span><span class="lb"><b>${me.name}</b><small>${me.role === 'socio' ? 'Sócio' : 'Colaborador'}</small></span></div>
      <div class="p-menu"><button class="nav" onClick=${() => setMenu(menu === 'prefs' ? null : 'prefs')} title="Personalizar barra"><${Icon} n="sliders" /><span class="lb">Personalizar barra</span></button>
        ${menu === 'prefs' && html`<${SidePrefs} prefs=${prefs} setPrefs=${setPrefs} close=${() => setMenu(null)} />`}</div>
      <button class="nav" title="Tema" onClick=${() => setTheme(theme === 'dark' ? 'light' : 'dark')}><${Icon} n=${theme === 'dark' ? 'sun' : 'moon'} /><span class="lb">${theme === 'dark' ? 'Tema claro' : 'Tema escuro'}</span></button>
      <button class="nav" title="Trocar acesso" onClick=${() => setSession(null)}><${Icon} n="logout" /><span class="lb">Trocar acesso</span></button>
      <p class="proto lb">Protótipo com dados de exemplo da M&O. Nada é salvo.</p>
    </div>
  </aside>`;
}
function SidePrefs({ prefs, setPrefs, close }) {
  const move = (id, d) => { const o = [...prefs.order]; const i = o.indexOf(id); const j = i + d; if (j < 0 || j >= o.length) return; [o[i], o[j]] = [o[j], o[i]]; setPrefs({ ...prefs, order: o }); };
  const names = { favs: 'Favoritos', work: 'Trabalho', strategy: 'Estratégia', clients: 'Clientes', company: 'Empresa' };
  const toggle = v => setPrefs({ ...prefs, hidden: prefs.hidden.includes(v) ? prefs.hidden.filter(x => x !== v) : [...prefs.hidden, v] });
  return html`<div class="pop side-pop" role="dialog" aria-label="Personalizar barra">
    <div class="pop-h"><b>Personalizar barra</b><button class="btn icon sm ghost" aria-label="Fechar" onClick=${close}><${Icon} n="x" s=${14} /></button></div>
    <p class="muted" style="font-size:12px">A ordem e o que aparece ficam salvos neste navegador.</p>
    ${prefs.order.map((id, i) => { const s = SECTIONS.find(x => x.id === id); return html`<div class="pref-sec" key=${id}>
      <div class="pref-h"><b>${names[id]}</b><span style="margin-left:auto;display:flex;gap:2px"><button class="btn icon sm ghost" disabled=${i === 0} aria-label="Subir seção" onClick=${() => move(id, -1)}><${Icon} n="chevUp" s=${13} /></button><button class="btn icon sm ghost" disabled=${i === prefs.order.length - 1} aria-label="Descer seção" onClick=${() => move(id, 1)}><${Icon} n="chevD" s=${13} /></button></span></div>
      ${s && s.items.map(([v, , l]) => html`<label class="pref-it" key=${v}><input type="checkbox" checked=${!prefs.hidden.includes(v)} onChange=${() => toggle(v)} />${l}</label>`)}
    </div>`; })}
    <button class="btn sm" onClick=${() => setPrefs({ ...SIDE_DEFAULT })}>Restaurar padrão</button>
  </div>`;
}
function NewMenu({ close }) {
  const { db, act, can, setModal, go, route, me } = useApp();
  const cid = route.v === 'client' ? route.id : db.clients[0].id;
  const it = (icon, label, fn) => html`<button onClick=${() => { close(); fn(); }}><${Icon} n=${icon} />${label}</button>`;
  return html`<div class="pop new-pop" role="menu">
    ${it('tasks', 'Tarefa', () => setModal({ t: 'newTask', clientId: cid }))}
    ${it('image', 'Post', () => act.addPost(cid))}
    ${it('script', 'Roteiro', () => act.addScript(cid))}
    ${it('whiteboard', 'Quadro branco', () => { const id = act.addBoard(route.v === 'client' ? route.id : null); go({ v: 'board', id }); })}
    ${it('funnel', 'Funil', () => setModal({ t: 'newFunnel', clientId: route.v === 'client' ? route.id : null }))}
    ${it('file', 'Página de processo', () => { act.addPage(null); go({ v: 'wiki' }); })}
    ${can('client.create') && it('building', 'Cliente', () => setModal({ t: 'newClient' }))}
  </div>`;
}

/* ================= v2: páginas globais ================= */
function ClientFilter({ value, onChange }) {
  const { db } = useApp();
  return html`<label class="sr" for="cf-sel">Cliente</label><select id="cf-sel" class="sel" style="width:auto;height:32px;font-size:13px" value=${value || ''} onChange=${e => onChange(e.target.value || null)}><option value="">Todos os clientes</option>${db.clients.map(c => html`<option value=${c.id}>${c.name}</option>`)}</select>`;
}
function GlobalPage({ title, sub, children, acts }) {
  return html`<div class="page"><${PageHead} title=${title} sub=${sub}>${acts}<//>${children}</div>`;
}

/* ================= v2: reuniões ================= */
function allMeetingsCount(app) { const m = allMeetings(app); return m.filter(x => { const d = diff(dayOf(x.start)); return d === 0; }).length; }
function liveMeetings(live) {
  if (!live || live.state !== 'ready') return [];
  const evs = ((live.cal && live.cal.events) || []).filter(e => e && e.status !== 'cancelled' && e.start && e.start.dateTime && (e.conferenceUrl || (e.conferenceData && e.conferenceData.videoEntryPoint && e.conferenceData.videoEntryPoint.uri)));
  const tq = ((live.tq && live.tq.meetings) || []).filter(x => x && x.createdAt);
  const used = new Set();
  const out = evs.map(e => {
    const s = Date.parse(e.start.dateTime), en = Date.parse((e.end && e.end.dateTime) || e.start.dateTime);
    const m = tq.find(x => !used.has(x.id) && Date.parse(x.createdAt) >= s - 20 * 6e4 && Date.parse(x.createdAt) <= en + 20 * 6e4);
    if (m) used.add(m.id);
    return { key: 'cal:' + e.id, live: true, title: (e.summary || 'Sem título').trim(), start: e.start.dateTime, end: (e.end && e.end.dateTime) || e.start.dateTime,
      attendees: (e.attendees || []).filter(a => !a.self && !a.resource).map(a => ({ name: a.displayName || String(a.email || '').split('@')[0], email: a.email })),
      meet: e.conferenceUrl || e.conferenceData.videoEntryPoint.uri, cal: e.htmlLink, tactiq: m ? { id: m.id, url: m.url, dur: m.durationSeconds } : null };
  });
  tq.filter(x => !used.has(x.id)).forEach(x => out.push({ key: 'tq:' + x.id, live: true, title: x.title || 'Reunião', start: x.createdAt,
    end: new Date(Date.parse(x.createdAt) + (x.durationSeconds || 0) * 1000).toISOString(), attendees: (x.attendees || []).map(n => ({ name: String(n) })), meet: null, cal: null, tactiq: { id: x.id, url: x.url, dur: x.durationSeconds } }));
  return out;
}
function allMeetings(app) {
  const { db, live } = app;
  return [...liveMeetings(live), ...db.meetings].map(m => ({ ...m, clientId: db.meetingClient[m.key] !== undefined ? db.meetingClient[m.key] : (m.clientId || null) }));
}
async function loadLive(setLive) {
  const mcp = await cap('mcp');
  if (!mcp) { setLive({ state: 'unavailable' }); return; }
  setLive(l => ({ ...l, state: 'loading' }));
  const now = Date.now();
  const [c, t] = await Promise.allSettled([
    mcp.callTool(SRV.cal, 'list_events', { startTime: new Date(now - 14 * 864e5).toISOString(), endTime: new Date(now + 14 * 864e5).toISOString(), orderBy: 'startTime', pageSize: 100 }),
    mcp.callTool(SRV.tq, 'list_recent_meetings', { limit: 30 }),
  ]);
  const P = r => (r && r.payload && typeof r.payload === 'object') ? r.payload : {};
  setLive({ state: 'ready', at: Date.now(),
    cal: c.status === 'fulfilled' ? { events: P(c.value).events || [] } : { error: mcpMsg(c.reason, SRV.cal) },
    tq: t.status === 'fulfilled' ? { meetings: P(t.value).results || [] } : { error: mcpMsg(t.reason, SRV.tq) } });
}
function MeetingsView({ clientId }) {
  const app = useApp(); const { live, setLive, open, db } = app;
  const [avail, setAvail] = useState(null);
  useEffect(() => { let on = true; (async () => {
    const mcp = await cap('mcp'); if (!on) return; if (!mcp) { setAvail(false); return; } setAvail(true);
    const perms = await cap('permissions'); const st = perms ? await perms.state('mcp:' + SRV.cal).catch(() => 'unavailable') : 'prompt';
    if (on && st === 'granted' && live.state === 'idle') loadLive(setLive);
  })(); return () => { on = false; }; }, []);
  const list = allMeetings(app).filter(m => !clientId || m.clientId === clientId).sort((a, b) => Date.parse(b.start) - Date.parse(a.start));
  const today = list.filter(m => diff(dayOf(m.start)) === 0).sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  const next = list.filter(m => diff(dayOf(m.start)) > 0).sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  const past = list.filter(m => diff(dayOf(m.start)) < 0);
  const Row = m => { const note = db.meetingNotes[m.key]; const c = db.clients.find(x => x.id === m.clientId); return html`<div class="row" key=${m.key} role="button" tabindex="0" onClick=${() => open('meeting', m.key)} onKeyDown=${e => e.key === 'Enter' && open('meeting', m.key)}>
    <span class="mt-time"><b>${hhmm(m.start)}</b><small>${diff(dayOf(m.start)) === 0 ? 'hoje' : fmt(dayOf(m.start))}</small></span>
    <div class="row-main"><div class="row-title">${m.title}</div><div class="row-meta">
      ${c ? html`<${CChip} id=${c.id} />` : html`<span class="tag">SEM CLIENTE</span>`}
      <span>${plural(m.attendees.length, 'participante')}</span>
      ${m.meet && html`<span class="src"><${Icon} n="video" s=${12} />Meet</span>`}
      ${(m.tactiq || m.transcript) && html`<span class="src"><${Icon} n="script" s=${12} />${m.example ? 'Transcrição de exemplo' : 'Tactiq'}</span>`}
      ${note ? html`<span class="pill t-ok">Resumo pronto</span>` : (m.tactiq || m.transcript) && diff(dayOf(m.start)) <= 0 ? html`<span class="pill t-adj">Resumo pendente</span>` : null}
      ${m.example && html`<span class="tag">EXEMPLO</span>`}
    </div></div></div>`; };
  const Sec = (t, items, empty) => html`<section class="sec"><div class="sec-h"><h2>${t}</h2><span class="c">${items.length}</span></div><div class="list">${items.length ? items.map(Row) : html`<div class="empty">${empty}</div>`}</div></section>`;
  return html`<div class="sec" style="gap:20px">
    <${IntegrationCard} avail=${avail} />
    ${Sec('Hoje', today, 'Nenhuma reunião hoje.')}
    ${Sec('Próximas', next, 'Nada marcado nos próximos dias.')}
    ${Sec('Anteriores', past, 'Nenhuma reunião anterior.')}
  </div>`;
}
function IntegrationCard({ avail }) {
  const { live, setLive } = useApp();
  const Src = (label, part, count) => html`<div class="int-src"><span class=${cx('int-dot', part && part.error ? 'bad' : part ? 'ok' : '')}></span><b>${label}</b><span class="muted">${!part ? 'não conectado' : part.error ? part.error : count}</span></div>`;
  if (avail === false) return html`<div class="card int-card"><div class="int-h"><${Icon} n="zap" /><div><b>Integrações</b><p class="muted">Nesta visualização a página não consegue usar os conectores do Claude. Abrindo o link dentro do claude.ai, o Google Agenda e o Tactiq entram aqui com as suas reuniões reais. Abaixo, reuniões de exemplo para testar o resumo.</p></div></div></div>`;
  const ready = live.state === 'ready';
  return html`<div class="card int-card">
    <div class="int-h"><${Icon} n="zap" /><div><b>Google Agenda + Tactiq</b><p class="muted">A página lê a sua agenda e as suas transcrições com a sua conta do Claude. Nada fica gravado no protótipo.</p></div>
      <button class=${cx('btn', !ready && 'pri')} disabled=${live.state === 'loading' || avail === null} onClick=${() => loadLive(setLive)}><${Icon} n=${ready ? 'refresh' : 'link'} s=${14} />${live.state === 'loading' ? 'Buscando…' : ready ? 'Atualizar' : 'Conectar e buscar reuniões'}</button></div>
    ${ready && html`<div class="int-srcs">${Src('Google Agenda', live.cal, `${plural((live.cal.events || []).filter(e => e.conferenceUrl || (e.conferenceData && e.conferenceData.videoEntryPoint)).length, 'reunião', 'reuniões')} com Meet, 14 dias pra trás e pra frente`)}${Src('Tactiq', live.tq, `${plural((live.tq.meetings || []).length, 'transcrição', 'transcrições')} recentes`)}</div>`}
  </div>`;
}
function MeetingBody({ m }) {
  const app = useApp(); const { db, act, me, toast } = app;
  const note = db.meetingNotes[m.key];
  const [paste, setPaste] = useState(''); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const [pick, setPick] = useState(null); const [drive, setDrive] = useState(null); const [mail, setMail] = useState(null);
  const tx = m.transcript || paste;
  const gen = async () => {
    const sample = await cap('sample');
    if (!sample) { setErr('O Claude não está disponível nesta visualização. Abra o link dentro do claude.ai.'); return; }
    setBusy(true); setErr('');
    const people = db.people.map(p => p.name).join(', ');
    const prompt = `Você organiza reuniões da agência M&O. Leia a transcrição e responda SOMENTE com um JSON neste formato:
{"resumo": "3 a 5 frases em português", "decisoes": ["decisão curta"], "tarefas": [{"titulo": "verbo no infinitivo + objeto", "responsavel": "um destes nomes ou vazio: ${people}", "prazo_dias": 3}], "email": "e-mail curto de follow-up em português, sem assinatura"}
Regras: tarefa só se alguém se comprometeu a fazer algo; prazo_dias é quantos dias a partir de hoje (${fmt(off(0))}), deduzido do que foi dito; não invente nada que não está na transcrição.
Reunião: ${m.title} (${fmt(dayOf(m.start))}).
Transcrição:
${tx.slice(0, 40000)}`;
    try {
      const r = await sample.json(prompt, { modelTier: 'default' });
      const res = { resumo: String(r.resumo || ''), decisoes: (r.decisoes || []).map(String).slice(0, 8), tarefas: (r.tarefas || []).slice(0, 10).map(t => ({ titulo: String(t.titulo || ''), responsavel: String(t.responsavel || ''), prazo: Math.max(0, Math.min(60, Math.round(num(t.prazo_dias)))) })), email: String(r.email || ''), at: off(0), created: 0 };
      act.setMeetingNote(m.key, res);
      setPick(res.tarefas.map(() => true));
    } catch (e) { setErr(sampleMsg(e)); } finally { setBusy(false); }
  };
  const personId = n => { const f = norm(n).split(' ')[0]; const p = db.people.find(x => norm(x.name).split(' ')[0] === f); return p ? p.id : me.id; };
  const create = () => {
    const sel = note.tarefas.filter((_, i) => !pick || pick[i]);
    act.createTasksFromMeeting(m.key, sel.map(t => ({ title: t.titulo, assignee: personId(t.responsavel), due: off(t.prazo || 3), clientId: m.clientId || 'mo', desc: `Saiu da reunião "${m.title}" (${fmt(dayOf(m.start))}).` })));
  };
  const kw = () => { const c = db.clients.find(x => x.id === m.clientId); const w = c ? c.name : m.title.split(/\s+/).filter(x => x.length > 3).slice(0, 2).join(' '); return w.replace(/'/g, "\\'"); };
  const findDrive = async () => { const mcp = await cap('mcp'); if (!mcp) { setDrive({ error: 'Integração indisponível nesta visualização.' }); return; } setDrive({ loading: true });
    try { const r = await mcp.callTool(SRV.drive, 'search_files', { query: `fullText contains '${kw()}'`, pageSize: 5, excludeContentSnippets: true }); setDrive({ files: (r.payload && r.payload.files) || [] }); } catch (e) { setDrive({ error: mcpMsg(e, SRV.drive) }); } };
  const emails = m.attendees.map(a => a.email).filter(Boolean).slice(0, 6);
  const findMail = async () => { const mcp = await cap('mcp'); if (!mcp) { setMail({ error: 'Integração indisponível nesta visualização.' }); return; } setMail({ loading: true });
    try { const q = `{${emails.map(e => `from:${e} to:${e}`).join(' ')}} newer_than:30d`; const r = await mcp.callTool(SRV.gmail, 'search_threads', { query: q, pageSize: 5 }); setMail({ threads: (r.payload && r.payload.threads) || [] }); } catch (e) { setMail({ error: mcpMsg(e, SRV.gmail) }); } };
  const dur = Math.round((Date.parse(m.end) - Date.parse(m.start)) / 6e4);
  return html`
    <div class="dtitle">${m.title}</div>
    <div class="row-meta" style="font-size:13px"><span>${fmt(dayOf(m.start), 'pt', { weekday: 'long', day: 'numeric', month: 'long' })}, ${hhmm(m.start)}${dur > 0 ? ` · ${dur} min` : ''}</span>${m.example && html`<span class="tag">EXEMPLO</span>`}</div>
    <div class="mt-links">
      ${m.meet && html`<a class="btn sm" href=${m.meet} target="_blank" rel="noopener"><${Icon} n="video" s=${14} />Abrir no Meet</a>`}
      ${m.cal && html`<a class="btn sm" href=${m.cal} target="_blank" rel="noopener"><${Icon} n="cal" s=${14} />Ver na Agenda</a>`}
      ${m.tactiq && html`<a class="btn sm" href=${m.tactiq.url} target="_blank" rel="noopener"><${Icon} n="script" s=${14} />Transcrição no Tactiq</a>`}
    </div>
    <dl class="props"><dt>Cliente</dt><dd><select class="sel" id="mt-client" value=${m.clientId || ''} onChange=${e => act.linkMeeting(m.key, e.target.value || null)}><option value="">Sem cliente</option>${db.clients.map(c => html`<option value=${c.id}>${c.name}</option>`)}</select></dd>
      <dt>Participantes</dt><dd style="display:flex;gap:6px;flex-wrap:wrap">${m.attendees.length ? m.attendees.map((a, i) => html`<span class="tag" key=${i} title=${a.email || ''}>${a.name}</span>`) : html`<span class="muted">—</span>`}</dd></dl>
    <section class="sec" style="gap:12px"><div class="sec-h" style="padding:0"><h2>Resumo, decisões e tarefas</h2>${note && html`<span class="pill t-ok">gerado ${rel(note.at)}</span>`}</div>
      ${!note && !tx && diff(dayOf(m.start)) > 0 && html`<p class="muted">A reunião ainda não aconteceu. Com a automação ligada, o resumo aparece aqui quando ela terminar.</p>`}
      ${!note && !m.transcript && diff(dayOf(m.start)) <= 0 && html`<div class="primary-act" style="flex-direction:column;align-items:stretch">
        <span class="hint">${m.tactiq ? 'O plano atual do Tactiq não entrega o texto da transcrição pela integração. Abra a transcrição no Tactiq, copie e cole aqui.' : 'Cole a transcrição da reunião aqui.'}</span>
        <label class="sr" for="mt-paste">Transcrição</label><textarea id="mt-paste" class="ta" style="min-height:120px" placeholder="Cole a transcrição" value=${paste} onInput=${e => setPaste(e.target.value)}></textarea></div>`}
      ${m.transcript && !note && html`<details class="tx"><summary>Ver a transcrição de exemplo</summary><pre>${m.transcript}</pre></details>`}
      ${!note && tx && html`<div class="primary-act"><span class="hint">O Claude lê a transcrição e devolve resumo, decisões, tarefas com responsável e um e-mail de follow-up. Nada é criado sem você confirmar.</span><button class="btn pri" disabled=${busy} onClick=${gen}><${Icon} n="sparkle" s=${14} />${busy ? 'Lendo a reunião…' : 'Gerar com IA'}</button></div>`}
      ${err && html`<p class="err">${err}</p>`}
      ${note && html`<div class="mt-note">
        <p>${note.resumo}</p>
        ${note.decisoes.length > 0 && html`<div><span class="label">Decisões</span><ul>${note.decisoes.map((d, i) => html`<li key=${i}>${d}</li>`)}</ul></div>`}
        ${note.tarefas.length > 0 && html`<div><span class="label">Tarefas</span><div class="checklist" style="margin-top:6px">${note.tarefas.map((t, i) => html`<label class="ci" key=${i}><input type="checkbox" disabled=${note.created > 0} checked=${!pick || pick[i]} onChange=${() => setPick((pick || note.tarefas.map(() => true)).map((v, j) => j === i ? !v : v))} /><span>${t.titulo}</span><span class="muted" style="font-size:12px;margin-left:auto;white-space:nowrap">${t.responsavel || 'sem responsável'} · ${t.prazo === 0 ? 'hoje' : fmt(off(t.prazo))}</span></label>`)}</div>
          ${note.created ? html`<p class="muted" style="margin-top:8px">${plural(note.created, 'tarefa criada', 'tarefas criadas')} a partir desta reunião.</p>` : html`<button class="btn pri" style="margin-top:10px" onClick=${create}><${Icon} n="plus" s=${14} />Criar ${plural((pick || note.tarefas).filter(Boolean).length, 'tarefa')}</button>`}</div>`}
        ${note.email && html`<div><span class="label">E-mail de follow-up</span><div class="caption" style="margin-top:6px">${note.email}</div><button class="btn sm" style="margin-top:8px" onClick=${() => copyText(note.email, ok => toast(ok ? 'E-mail copiado. Cole no Gmail.' : 'Não deu para copiar. Selecione o texto.'))}><${Icon} n="copy" s=${13} />Copiar e-mail</button></div>`}
      </div>`}
    </section>
    ${!m.example && html`<section class="sec" style="gap:10px"><div class="sec-h" style="padding:0"><h2>Arquivos no Drive</h2><button class="btn sm" style="margin-left:auto" onClick=${findDrive}><${Icon} n="search" s=${13} />Buscar "${kw()}"</button></div>
      ${drive && (drive.loading ? html`<p class="muted">Buscando…</p>` : drive.error ? html`<p class="err">${drive.error}</p>` : drive.files.length ? html`<div class="list">${drive.files.map(f => html`<a class="row" key=${f.id} href=${f.viewUrl} target="_blank" rel="noopener" style="text-decoration:none"><${Icon} n="file" /><div class="row-main"><div class="row-title">${f.title}</div><div class="row-meta">${f.modifiedTime ? 'alterado ' + rel(dayOf(f.modifiedTime)) : ''}</div></div><${Icon} n="ext" s=${14} /></a>`)}</div>` : html`<p class="muted">Nada encontrado.</p>`)}
    </section>`}
    ${!m.example && emails.length > 0 && html`<section class="sec" style="gap:10px"><div class="sec-h" style="padding:0"><h2>E-mails com os participantes</h2><button class="btn sm" style="margin-left:auto" onClick=${findMail}><${Icon} n="mail" s=${13} />Buscar no Gmail</button></div>
      ${mail && (mail.loading ? html`<p class="muted">Buscando…</p>` : mail.error ? html`<p class="err">${mail.error}</p>` : mail.threads.length ? html`<div class="list">${mail.threads.map(t => { const msg = (t.messages || [])[0] || {}; return html`<a class="row" key=${t.id} href=${t.viewUrl || msg.viewUrl} target="_blank" rel="noopener" style="text-decoration:none"><${Icon} n="mail" /><div class="row-main"><div class="row-title">${msg.subject || '(sem assunto)'}</div><div class="row-meta">${msg.sender || ''}${msg.date ? ' · ' + rel(dayOf(msg.date)) : ''}</div></div><${Icon} n="ext" s=${14} /></a>`; })}</div>` : html`<p class="muted">Nenhum e-mail nos últimos 30 dias.</p>`)}
    </section>`}`;
}

/* ================= v2: automações ================= */
function Automations() {
  const { db, act, go } = useApp();
  const runs = Object.entries(db.meetingNotes).map(([k, n]) => ({ k, n, m: db.meetings.find(x => x.key === k) }));
  const Flow = steps => html`<ol class="flow">${steps.map((s, i) => html`<li key=${i}><span class="fl-i"><${Icon} n=${s[0]} s=${15} /></span><span>${s[1]}</span></li>`)}</ol>`;
  const Card = (id, title, sub, steps, note) => html`<div class="card auto"><div class="auto-h"><div><b>${title}</b><p class="muted">${sub}</p></div>
    <button class=${cx('switch', db.automations[id] && 'on')} role="switch" aria-checked=${!!db.automations[id]} aria-label=${'Ligar ' + title} onClick=${() => act.toggleAuto(id)}><i></i></button></div>${Flow(steps)}${note}</div>`;
  return html`<div class="page">
    <${PageHead} title="Automações" sub="O que o sistema faz sozinho, e o que ainda depende de você." />
    ${Card('au1', 'Pós-reunião', 'Terminou uma reunião no Meet: o sistema busca a transcrição, resume e propõe as tarefas.', [['video', 'Reunião do Meet termina'], ['script', 'Transcrição do Tactiq'], ['sparkle', 'Resumo, decisões e tarefas com IA'], ['building', 'Liga ao cliente pelos participantes'], ['check', 'Você confere e confirma'], ['mail', 'Rascunho do follow-up no Gmail']],
      html`<div class="auto-note"><b>Onde isso está hoje.</b> No protótipo, roda quando você abre a reunião e clica em Gerar com IA. No produto, um serviço no servidor escuta o fim do evento na Google Agenda e roda sozinho. O gargalo é o texto da transcrição: o Tactiq não tem API, e pelo conector o plano atual entrega a lista de reuniões, mas não o texto. Os dois caminhos reais são a API do Google Meet (exige Workspace Business Standard) ou o Fathom, que avisa o sistema quando a transcrição fica pronta já no plano grátis. <button class="linkbtn" onClick=${() => go({ v: 'meetings' })}>Abrir Reuniões</button></div>`)}
    ${Card('au2', 'Ajuste pedido pelo cliente', 'O cliente pediu ajuste: a peça volta para quem produziu, com o comentário preso ao slide.', [['msg', 'Cliente pede ajuste'], ['sun', 'Sobe para o topo do Meu dia'], ['inbox', 'Aviso na caixa de entrada']], null)}
    ${Card('au3', 'Resumo da segunda-feira', 'Toda segunda às 8h, o copiloto monta a semana de cada cliente: o que atrasou, o que espera aprovação, o que sai.', [['clock', 'Segunda, 8h'], ['sparkle', 'Copiloto lê as áreas dos clientes'], ['sun', 'Resumo no Meu dia de cada pessoa']], html`<div class="auto-note">Desligada: fica para a fase do copiloto rodando no servidor.</div>`)}
    <section class="sec"><div class="sec-h"><h2>Execuções nesta sessão</h2><span class="c">${runs.length}</span></div>
      <div class="list">${runs.length ? runs.map(r => html`<div class="row" key=${r.k}><${Icon} n="sparkle" /><div class="row-main"><div class="row-title">Resumo gerado: ${r.m ? r.m.title : 'reunião'}</div><div class="row-meta">${plural(r.n.tarefas.length, 'tarefa proposta', 'tarefas propostas')} · ${r.n.created ? plural(r.n.created, 'criada', 'criadas') : 'nenhuma criada ainda'}</div></div></div>`) : html`<div class="empty">Nada rodou ainda. Abra uma reunião e gere o resumo.</div>`}</div></section>
  </div>`;
}

/* ================= v2: quadro branco ================= */
function BoardsList({ clientId }) {
  const { db, act, go, can } = useApp();
  const [cf, setCf] = useState(null);
  const list = db.boards.filter(b => clientId ? b.clientId === clientId : (!cf || b.clientId === cf));
  return html`<div class="sec" style="gap:16px">
    <div class="toolbar">${!clientId && html`<${ClientFilter} value=${cf} onChange=${setCf} />`}<span class="muted">Lousa livre para mapear processo, fazer brainstorm e desenhar com o cliente. Um post-it vira tarefa com um clique.</span><span class="spacer"></span>
      <button class="btn pri" onClick=${() => { const id = act.addBoard(clientId || cf); go({ v: 'board', id }); }}><${Icon} n="plus" />Novo quadro</button></div>
    <div class="bgrid">${list.map(b => html`<button class="bcard" key=${b.id} onClick=${() => go({ v: 'board', id: b.id })}><div class="bthumb"><${BoardThumb} els=${b.els} /></div>
      <span class="bt">${b.title}</span><span class="bd">${b.clientId ? html`<${CChip} id=${b.clientId} />` : html`<span class="tag">INTERNO</span>`}<span>${firstName(db, b.by)}, ${rel(b.at)}</span></span></button>`)}
      ${list.length === 0 && html`<div class="card empty" style="grid-column:1/-1">Nenhum quadro ainda.</div>`}</div>
  </div>`;
}
function bbox(els) {
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  els.forEach(e => { if (e.t === 'pen') e.pts.forEach(([x, y]) => { x1 = Math.min(x1, x); y1 = Math.min(y1, y); x2 = Math.max(x2, x); y2 = Math.max(y2, y); }); else if (e.t !== 'arrow') { x1 = Math.min(x1, e.x); y1 = Math.min(y1, e.y); x2 = Math.max(x2, e.x + e.w); y2 = Math.max(y2, e.y + e.h); } });
  return isFinite(x1) ? { x: x1, y: y1, w: x2 - x1, h: y2 - y1 } : { x: 0, y: 0, w: 800, h: 500 };
}
const center = e => [e.x + e.w / 2, e.y + e.h / 2];
function clipTo(e, toward) { const [cx0, cy0] = center(e); const dx = toward[0] - cx0, dy = toward[1] - cy0; if (!dx && !dy) return [cx0, cy0]; const s = Math.min((e.w / 2 + 6) / Math.abs(dx || 1e-9), (e.h / 2 + 6) / Math.abs(dy || 1e-9)); return [cx0 + dx * s, cy0 + dy * s]; }
function arrowPts(a, map) {
  const A = a.from && map[a.from], B = a.to && map[a.to];
  let p1 = A ? center(A) : [a.x1, a.y1], p2 = B ? center(B) : [a.x2, a.y2];
  const q1 = A ? clipTo(A, p2) : p1, q2 = B ? clipTo(B, p1) : p2;
  return [q1, q2];
}
const penD = pts => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
function BoardThumb({ els }) {
  const b = bbox(els); const pad2 = 30; const map = Object.fromEntries(els.map(e => [e.id, e]));
  return html`<svg viewBox=${`${b.x - pad2} ${b.y - pad2} ${b.w + pad2 * 2} ${b.h + pad2 * 2}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <defs><marker id="thar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--text-2)" /></marker></defs>
    ${els.map(e => { if (e.t === 'sticky') return html`<rect key=${e.id} x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx="4" fill=${STICKY[e.color] || STICKY.sand} />`;
      if (e.t === 'rect') return html`<rect key=${e.id} x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx="8" fill="var(--surface)" stroke="var(--text-2)" stroke-width="2" />`;
      if (e.t === 'ellipse') return html`<ellipse key=${e.id} cx=${e.x + e.w / 2} cy=${e.y + e.h / 2} rx=${e.w / 2} ry=${e.h / 2} fill="var(--surface)" stroke="var(--text-2)" stroke-width="2" />`;
      if (e.t === 'text') return html`<rect key=${e.id} x=${e.x} y=${e.y + e.h * .3} width=${Math.min(e.w, (e.text || '').length * (e.size || 18) * .5)} height=${e.h * .35} rx="3" fill="var(--text-3)" opacity=".5" />`;
      if (e.t === 'pen') return html`<path key=${e.id} d=${penD(e.pts)} fill="none" stroke=${e.color || 'var(--text)'} stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />`;
      if (e.t === 'arrow') { const [p, q] = arrowPts(e, map); return html`<line key=${e.id} x1=${p[0]} y1=${p[1]} x2=${q[0]} y2=${q[1]} stroke="var(--text-2)" stroke-width="3" marker-end="url(#thar)" />`; }
      return null; })}
  </svg>`;
}
function BoardPage({ id }) {
  const app = useApp(); const { db, act, go } = app;
  const b = db.boards.find(x => x.id === id);
  if (!b) return html`<div class="page"><div class="card empty">Quadro não encontrado.</div></div>`;
  return html`<div class="canvas-page">
    <div class="cv-head">
      <button class="btn icon sm ghost" aria-label="Voltar" onClick=${() => go(b.clientId ? { v: 'client', id: b.clientId, tab: 'boards' } : { v: 'boards' })}><${Icon} n="chevL" /></button>
      <${Icon} n="whiteboard" /><div class="cv-title" contenteditable="true" onBlur=${e => act.renameBoard(b.id, e.currentTarget.innerText.trim() || b.title)} onKeyDown=${e => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}>${b.title}</div>
      ${b.clientId ? html`<${CChip} id=${b.clientId} />` : html`<span class="tag">INTERNO</span>`}
      <${FavBtn} k=${'board:' + b.id} />
      <span class="spacer"></span><span class="muted cv-hint">Arraste com espaço pressionado para mover a lousa · ⌘ + rolagem para zoom</span>
    </div>
    <${Whiteboard} board=${b} key=${b.id} />
  </div>`;
}
function FavBtn({ k }) {
  const { db, me, act } = useApp(); const on = (db.favs[me.id] || []).includes(k);
  return html`<button class=${cx('btn icon sm ghost fav', on && 'on')} aria-pressed=${on} aria-label=${on ? 'Tirar dos favoritos' : 'Pôr nos favoritos'} title=${on ? 'Tirar dos favoritos' : 'Pôr nos favoritos'} onClick=${() => act.toggleFav(k)}><${Icon} n="star" s=${15} /></button>`;
}
const TOOLS = [['select', 'cursor', 'Selecionar', 'V'], ['hand', 'hand', 'Mover a lousa', 'H'], ['sticky', 'sticky', 'Post-it', 'N'], ['text', 'type', 'Texto', 'T'], ['rect', 'square', 'Retângulo', 'R'], ['ellipse', 'circle', 'Elipse', 'O'], ['arrow', 'arrowUR', 'Seta', 'A'], ['pen', 'pen', 'Caneta', 'P']];
function Whiteboard({ board }) {
  const { act, me, toast } = useApp();
  const [els, setEls] = useState(board.els);
  const elsRef = useRef(els); elsRef.current = els;
  const [vp, setVp] = useState({ x: 60, y: 90, k: 1 });
  const vpRef = useRef(vp); vpRef.current = vp;
  const [tool, setTool] = useState('select');
  const [sel, setSel] = useState([]);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);
  const [color, setColor] = useState('sand');
  const [spaceDown, setSpaceDown] = useState(false);
  const hist = useRef([]); const svgRef = useRef(); const wrapRef = useRef(); const drag = useRef(null);
  const map = Object.fromEntries(els.map(e => [e.id, e]));
  const save = (next, before) => { if (before) { hist.current.push(before); if (hist.current.length > 60) hist.current.shift(); } setEls(next); elsRef.current = next; act.saveBoard(board.id, next); };
  const toW = e => { const r = svgRef.current.getBoundingClientRect(); const v = vpRef.current; return [(e.clientX - r.left - v.x) / v.k, (e.clientY - r.top - v.y) / v.k]; };
  const hitEl = (p, skip) => { const L = elsRef.current; for (let i = L.length - 1; i >= 0; i--) { const e = L[i]; if (e.t === 'arrow' || e.t === 'pen' || e.id === skip) continue; if (p[0] >= e.x && p[0] <= e.x + e.w && p[1] >= e.y && p[1] <= e.y + e.h) return e; } return null; };
  const fit = () => { const b = bbox(elsRef.current); const r = svgRef.current.getBoundingClientRect(); const k = Math.max(.2, Math.min(1.6, Math.min((r.width - 80) / (b.w || 1), (r.height - 140) / (b.h || 1)))); setVp({ k, x: (r.width - b.w * k) / 2 - b.x * k, y: (r.height - b.h * k) / 2 - b.y * k + 10 }); };
  useEffect(() => { requestAnimationFrame(fit); }, []);
  const zoomBy = (f, cx0, cy0) => setVp(v => { const k = Math.max(.15, Math.min(4, v.k * f)); const r = svgRef.current.getBoundingClientRect(); const px = cx0 ?? r.width / 2, py = cy0 ?? r.height / 2; return { k, x: px - (px - v.x) * k / v.k, y: py - (py - v.y) * k / v.k }; });
  useEffect(() => {
    const el = wrapRef.current;
    const wh = e => { e.preventDefault(); const r = svgRef.current.getBoundingClientRect(); if (e.ctrlKey || e.metaKey) zoomBy(Math.exp(-e.deltaY * .01), e.clientX - r.left, e.clientY - r.top); else setVp(v => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY })); };
    el.addEventListener('wheel', wh, { passive: false });
    return () => el.removeEventListener('wheel', wh);
  }, []);
  useEffect(() => {
    const typing = t => t && (t.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(t.tagName));
    const kd = e => {
      if (typing(e.target)) return;
      const mod = e.metaKey || e.ctrlKey;
      if (e.code === 'Space') { e.preventDefault(); setSpaceDown(true); return; }
      if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); const prev = hist.current.pop(); if (prev) { setEls(prev); elsRef.current = prev; act.saveBoard(board.id, prev); setSel([]); } return; }
      if (mod && e.key.toLowerCase() === 'd') { e.preventDefault(); duplicate(); return; }
      if (mod) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && sel.length) { e.preventDefault(); remove(); return; }
      if (e.key === 'Escape') { setSel([]); setTool('select'); return; }
      const t = TOOLS.find(x => x[3].toLowerCase() === e.key.toLowerCase()); if (t) setTool(t[0]);
    };
    const ku = e => { if (e.code === 'Space') setSpaceDown(false); };
    addEventListener('keydown', kd); addEventListener('keyup', ku);
    return () => { removeEventListener('keydown', kd); removeEventListener('keyup', ku); };
  });
  const remove = () => { const before = elsRef.current; const ids = new Set(sel); save(before.filter(e => !ids.has(e.id) && !(e.t === 'arrow' && (ids.has(e.from) || ids.has(e.to)))), before); setSel([]); };
  const duplicate = () => { const before = elsRef.current; const copies = before.filter(e => sel.includes(e.id) && e.t !== 'arrow').map(e => e.t === 'pen' ? { ...e, id: uid('e'), pts: e.pts.map(([x, y]) => [x + 24, y + 24]) } : { ...e, id: uid('e'), x: e.x + 24, y: e.y + 24 }); if (!copies.length) return; save([...before, ...copies], before); setSel(copies.map(c => c.id)); };
  const down = e => {
    if (e.button === 2) return;
    const p = toW(e);
    const tgt = e.target.closest && e.target.closest('[data-id]'); const id = tgt && tgt.getAttribute('data-id');
    if (editing) { if (id === editing) return; document.activeElement && document.activeElement.blur(); }
    svgRef.current.setPointerCapture(e.pointerId);
    if (tool === 'hand' || spaceDown || e.button === 1) { drag.current = { m: 'pan', sx: e.clientX, sy: e.clientY, v: vpRef.current }; return; }
    if (tool === 'select') {
      if (tgt && tgt.getAttribute('data-handle')) { drag.current = { m: 'resize', id, p0: p, o: { ...map[id] }, before: elsRef.current }; return; }
      if (id) { const ns = e.shiftKey ? (sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]) : (sel.includes(id) ? sel : [id]); setSel(ns); drag.current = { m: 'move', p0: p, ids: ns, o: elsRef.current.filter(x => ns.includes(x.id)).map(x => ({ ...x })), before: elsRef.current, moved: false }; return; }
      setSel([]); drag.current = { m: 'marq', p0: p }; setDraft({ t: 'marq', x: p[0], y: p[1], w: 0, h: 0 }); return;
    }
    if (tool === 'sticky' || tool === 'text') {
      const el = tool === 'sticky' ? { id: uid('e'), t: 'sticky', x: p[0] - 95, y: p[1] - 65, w: 190, h: 130, color, text: '' } : { id: uid('e'), t: 'text', x: p[0], y: p[1] - 18, w: 280, h: 40, text: '', size: 20 };
      save([...elsRef.current, el], elsRef.current); setSel([el.id]); setEditing(el.id); setTool('select'); drag.current = null; return;
    }
    if (tool === 'rect' || tool === 'ellipse') { drag.current = { m: 'draw', p0: p }; setDraft({ id: uid('e'), t: tool, x: p[0], y: p[1], w: 0, h: 0, text: '' }); return; }
    if (tool === 'arrow') { const from = hitEl(p); drag.current = { m: 'arrow' }; setDraft({ id: uid('e'), t: 'arrow', from: from ? from.id : null, x1: p[0], y1: p[1], x2: p[0], y2: p[1] }); return; }
    if (tool === 'pen') { drag.current = { m: 'pen' }; setDraft({ id: uid('e'), t: 'pen', color: '#222831', pts: [p] }); }
  };
  const move = e => {
    const d = drag.current; if (!d) return; const p = toW(e);
    if (d.m === 'pan') { setVp({ ...d.v, x: d.v.x + e.clientX - d.sx, y: d.v.y + e.clientY - d.sy }); return; }
    if (d.m === 'move') { const dx = p[0] - d.p0[0], dy = p[1] - d.p0[1]; if (Math.abs(dx) + Math.abs(dy) > 1) d.moved = true;
      const nx = elsRef.current.map(x => { const o = d.o.find(z => z.id === x.id); if (!o) return x; return o.t === 'pen' ? { ...x, pts: o.pts.map(([a, b]) => [a + dx, b + dy]) } : o.t === 'arrow' ? x : { ...x, x: o.x + dx, y: o.y + dy }; }); setEls(nx); elsRef.current = nx; return; }
    if (d.m === 'resize') { const nx = elsRef.current.map(x => x.id === d.id ? { ...x, w: Math.max(60, d.o.w + p[0] - d.p0[0]), h: Math.max(32, d.o.h + p[1] - d.p0[1]) } : x); setEls(nx); elsRef.current = nx; d.moved = true; return; }
    if (d.m === 'marq' || d.m === 'draw') { setDraft(dr => ({ ...dr, x: Math.min(p[0], d.p0[0]), y: Math.min(p[1], d.p0[1]), w: Math.abs(p[0] - d.p0[0]), h: Math.abs(p[1] - d.p0[1]) })); return; }
    if (d.m === 'arrow') { setDraft(dr => ({ ...dr, x2: p[0], y2: p[1] })); return; }
    if (d.m === 'pen') setDraft(dr => { const l = dr.pts[dr.pts.length - 1]; return Math.hypot(p[0] - l[0], p[1] - l[1]) > 2 ? { ...dr, pts: [...dr.pts, p] } : dr; });
  };
  const up = e => {
    const d = drag.current; drag.current = null; if (!d) return; const p = toW(e);
    if ((d.m === 'move' || d.m === 'resize') && d.moved) { save(elsRef.current, d.before); return; }
    if (d.m === 'marq') { const r = draft; const ids = elsRef.current.filter(x => { if (x.t === 'arrow') return false; const b = x.t === 'pen' ? bbox([x]) : x; return b.x < r.x + r.w && b.x + b.w > r.x && b.y < r.y + r.h && b.y + b.h > r.y; }).map(x => x.id); if (r.w > 4 || r.h > 4) setSel(ids); setDraft(null); return; }
    if (d.m === 'draw') { let el = { ...draft }; if (el.w < 10 || el.h < 10) el = { ...el, x: d.p0[0] - 90, y: d.p0[1] - 55, w: 180, h: 110 }; save([...elsRef.current, el], elsRef.current); setDraft(null); setSel([el.id]); setTool('select'); return; }
    if (d.m === 'arrow') { const to = hitEl(p, draft.from); const el = { ...draft, to: to ? to.id : null }; setDraft(null); if (!el.from && !el.to && Math.hypot(el.x2 - el.x1, el.y2 - el.y1) < 12) return; if (el.from && el.from === el.to) return; save([...elsRef.current, el], elsRef.current); setSel([el.id]); return; }
    if (d.m === 'pen') { const el = draft; setDraft(null); if (el.pts.length > 1) save([...elsRef.current, el], elsRef.current); }
  };
  const setText = (id, text) => { const before = elsRef.current; const cur = before.find(x => x.id === id); setEditing(null); if (!cur) return; if (!text && (cur.t === 'text')) { save(before.filter(x => x.id !== id), before); setSel([]); return; } if (cur.text !== text) save(before.map(x => x.id === id ? { ...x, text } : x), before); };
  const recolor = c => { setColor(c); const before = elsRef.current; if (sel.some(id => map[id] && map[id].t === 'sticky')) save(before.map(x => sel.includes(x.id) && x.t === 'sticky' ? { ...x, color: c } : x), before); };
  const toTask = () => { const st = sel.map(id => map[id]).filter(x => x && x.t === 'sticky' && x.text); st.forEach(s => act.addTask({ title: s.text.slice(0, 140), clientId: board.clientId || 'mo', assignee: me.id, due: null, desc: `Veio do quadro "${board.title}".` }, true)); toast(st.length ? `${plural(st.length, 'tarefa criada', 'tarefas criadas')} a partir do quadro` : 'Escreva no post-it antes de virar tarefa.'); };
  const selEls = sel.map(id => map[id]).filter(Boolean);
  const selBox = selEls.length ? bbox(selEls.filter(e => e.t !== 'arrow').length ? selEls.filter(e => e.t !== 'arrow') : selEls.map(a => { const [p, q] = arrowPts(a, map); return { x: Math.min(p[0], q[0]), y: Math.min(p[1], q[1]), w: Math.abs(q[0] - p[0]), h: Math.abs(q[1] - p[1]) }; })) : null;
  const cursor = spaceDown || tool === 'hand' ? (drag.current && drag.current.m === 'pan' ? 'grabbing' : 'grab') : tool === 'select' ? 'default' : 'crosshair';
  const TextBox = (e, cls) => html`<foreignObject x="0" y="0" width=${e.w} height=${e.h}><div xmlns="http://www.w3.org/1999/xhtml" class=${cls} style=${e.t === 'text' ? { fontSize: (e.size || 20) + 'px' } : null}
      contenteditable=${editing === e.id ? 'true' : 'false'} ref=${editing === e.id ? autoF : null} data-ph=${e.t === 'sticky' ? 'Escreva' : 'Texto'}
      onPointerDown=${ev => { if (editing === e.id) ev.stopPropagation(); }} onBlur=${ev => editing === e.id && setText(e.id, ev.currentTarget.innerText.trim())}
      onKeyDown=${ev => { if (ev.key === 'Escape') ev.currentTarget.blur(); }}>${e.text}</div></foreignObject>`;
  const renderEl = e => {
    const s = sel.includes(e.id);
    if (e.t === 'arrow') { const [p, q] = arrowPts(e, map); return html`<g key=${e.id}><line x1=${p[0]} y1=${p[1]} x2=${q[0]} y2=${q[1]} class=${cx('wb-arrow', s && 'sel')} marker-end="url(#wbar)" /><line data-id=${e.id} x1=${p[0]} y1=${p[1]} x2=${q[0]} y2=${q[1]} stroke="transparent" stroke-width="14" /></g>`; }
    if (e.t === 'pen') { const d = penD(e.pts); return html`<g key=${e.id}><path d=${d} fill="none" stroke=${e.color || 'var(--text)'} stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class=${s ? 'wb-pen sel' : 'wb-pen'} /><path data-id=${e.id} d=${d} fill="none" stroke="transparent" stroke-width="14" /></g>`; }
    return html`<g key=${e.id} data-id=${e.id} transform=${`translate(${e.x},${e.y})`} onDblClick=${() => { setSel([e.id]); setEditing(e.id); }}>
      ${e.t === 'sticky' && html`<rect width=${e.w} height=${e.h} rx="4" fill=${STICKY[e.color] || STICKY.sand} class="wb-sticky" />`}
      ${e.t === 'rect' && html`<rect width=${e.w} height=${e.h} rx="10" class="wb-shape" />`}
      ${e.t === 'ellipse' && html`<ellipse cx=${e.w / 2} cy=${e.h / 2} rx=${e.w / 2} ry=${e.h / 2} class="wb-shape" />`}
      ${TextBox(e, e.t === 'sticky' ? 'wb-st-text' : e.t === 'text' ? 'wb-text' : 'wb-shape-text')}
      ${s && sel.length === 1 && e.t !== 'text' && html`<rect data-id=${e.id} data-handle="1" x=${e.w - 6} y=${e.h - 6} width="12" height="12" rx="3" class="wb-handle" />`}
    </g>`;
  };
  const sb = selBox && { left: selBox.x * vp.k + vp.x, top: selBox.y * vp.k + vp.y - 48 };
  const hasSticky = selEls.some(e => e.t === 'sticky');
  return html`<div class="cv-wrap" ref=${wrapRef}>
    <svg ref=${svgRef} class="cv-svg" style=${{ cursor }} onPointerDown=${down} onPointerMove=${move} onPointerUp=${up} onContextMenu=${e => e.preventDefault()}>
      <defs>
        <pattern id="wbgrid" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform=${`translate(${vp.x},${vp.y}) scale(${vp.k})`}><circle cx="1" cy="1" r="1" fill="var(--line-strong)" /></pattern>
        <marker id="wbar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--text-2)" /></marker>
        <filter id="wbsh" x="-10%" y="-10%" width="130%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity=".18" /></filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#wbgrid)" />
      <g transform=${`translate(${vp.x},${vp.y}) scale(${vp.k})`}>
        ${els.map(renderEl)}
        ${selBox && html`<rect x=${selBox.x - 6} y=${selBox.y - 6} width=${selBox.w + 12} height=${selBox.h + 12} rx="6" class="wb-selbox" pointer-events="none" />`}
        ${draft && draft.t === 'marq' && html`<rect x=${draft.x} y=${draft.y} width=${draft.w} height=${draft.h} class="wb-marq" />`}
        ${draft && (draft.t === 'rect' || draft.t === 'ellipse') && (draft.t === 'rect' ? html`<rect x=${draft.x} y=${draft.y} width=${draft.w} height=${draft.h} rx="10" class="wb-shape" />` : html`<ellipse cx=${draft.x + draft.w / 2} cy=${draft.y + draft.h / 2} rx=${draft.w / 2} ry=${draft.h / 2} class="wb-shape" />`)}
        ${draft && draft.t === 'arrow' && (() => { const [p, q] = arrowPts(draft, map); return html`<line x1=${p[0]} y1=${p[1]} x2=${q[0]} y2=${q[1]} class="wb-arrow" marker-end="url(#wbar)" />`; })()}
        ${draft && draft.t === 'pen' && html`<path d=${penD(draft.pts)} fill="none" stroke=${draft.color} stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`}
      </g>
    </svg>
    ${els.length === 0 && html`<div class="cv-empty"><b>Quadro em branco</b><span>Aperte N e clique para um post-it, T para texto, P para a caneta.</span></div>`}
    ${sb && !editing && !drag.current && html`<div class="wb-seltools" style=${{ left: Math.max(8, sb.left) + 'px', top: Math.max(8, sb.top) + 'px' }} onPointerDown=${e => e.stopPropagation()}>
      ${hasSticky && Object.keys(STICKY).map(c => html`<button key=${c} class=${cx('sw', selEls.some(x => x.color === c) && 'on')} style=${{ background: STICKY[c] }} aria-label=${'Cor ' + c} onClick=${() => recolor(c)}></button>`)}
      ${hasSticky && html`<button class="btn sm" onClick=${toTask}><${Icon} n="tasks" s=${13} />Virar tarefa</button>`}
      <button class="btn sm icon ghost" aria-label="Duplicar" title="Duplicar (⌘D)" onClick=${duplicate}><${Icon} n="copy" s=${14} /></button>
      <button class="btn sm icon ghost danger" aria-label="Apagar" title="Apagar (Delete)" onClick=${remove}><${Icon} n="trash" s=${14} /></button>
    </div>`}
    <div class="cv-toolbar" role="toolbar" aria-label="Ferramentas">
      ${TOOLS.map(([k, ic, l, key]) => html`<button key=${k} class=${cx('tl', tool === k && 'on')} aria-pressed=${tool === k} title=${`${l} (${key})`} aria-label=${l} onClick=${() => setTool(k)}><${Icon} n=${ic} s=${18} /></button>`)}
      ${tool === 'sticky' && html`<span class="tl-sep"></span>${Object.keys(STICKY).map(c => html`<button key=${c} class=${cx('sw', color === c && 'on')} style=${{ background: STICKY[c] }} aria-label=${'Cor ' + c} onClick=${() => setColor(c)}></button>`)}`}
      <span class="tl-sep"></span>
      <button class="tl" title="Desfazer (⌘Z)" aria-label="Desfazer" onClick=${() => { const prev = hist.current.pop(); if (prev) { setEls(prev); elsRef.current = prev; act.saveBoard(board.id, prev); } }}><${Icon} n="undo" s=${18} /></button>
    </div>
    <div class="cv-zoom"><button class="tl" aria-label="Diminuir zoom" onClick=${() => zoomBy(1 / 1.2)}><${Icon} n="minus" s=${16} /></button><button class="tl pct" onClick=${fit} title="Ajustar à tela">${Math.round(vp.k * 100)}%</button><button class="tl" aria-label="Aumentar zoom" onClick=${() => zoomBy(1.2)}><${Icon} n="plus" s=${16} /></button></div>
  </div>`;
}

/* ================= v2: funis ================= */
function FunnelsList({ clientId }) {
  const { db, setModal, go } = useApp();
  const [cf, setCf] = useState(null);
  const list = db.funnels.filter(f => clientId ? f.clientId === clientId : (!cf || f.clientId === cf));
  return html`<div class="sec" style="gap:16px">
    <div class="toolbar">${!clientId && html`<${ClientFilter} value=${cf} onChange=${setCf} />`}<span class="muted">Desenhe o caminho do anúncio até a venda e veja na hora quanto custa cada reunião agendada.</span><span class="spacer"></span>
      <button class="btn pri" onClick=${() => setModal({ t: 'newFunnel', clientId: clientId || cf })}><${Icon} n="plus" />Novo funil</button></div>
    <div class="bgrid">${list.map(f => { const c = computeFunnel(f.nodes, f.edges); return html`<button class="bcard" key=${f.id} onClick=${() => go({ v: 'funnel', id: f.id })}>
      <div class="bthumb"><${FunnelThumb} f=${f} /></div>
      <span class="bt">${f.title}</span>
      <span class="bd">${f.clientId ? html`<${CChip} id=${f.clientId} />` : html`<span class="tag">MODELO</span>`}<span>${c.t.meetings ? `${money(c.t.cpMeet, f.currency)} por reunião` : c.t.revenue ? `ROAS ${nf(c.t.roas, 1)}` : plural(f.nodes.length, 'etapa')}</span></span></button>`; })}
      ${list.length === 0 && html`<div class="card empty" style="grid-column:1/-1">Nenhum funil ainda.</div>`}</div>
  </div>`;
}
const NW = 210, NH = 78;
function edgePath(a, b) { const x1 = a.x + NW, y1 = a.y + NH / 2, x2 = b.x, y2 = b.y + NH / 2; const dx = Math.max(50, Math.abs(x2 - x1) / 2); return { d: `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 }; }
function FunnelThumb({ f }) {
  const xs = f.nodes.map(n => n.x), ys = f.nodes.map(n => n.y); const x0 = Math.min(...xs) - 30, y0 = Math.min(...ys) - 30, w = Math.max(...xs) + NW + 30 - x0, h = Math.max(...ys) + NH + 30 - y0;
  const by = Object.fromEntries(f.nodes.map(n => [n.id, n]));
  return html`<svg viewBox=${`${x0} ${y0} ${w} ${h}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    ${f.edges.map(e => by[e.from] && by[e.to] && html`<path key=${e.id} d=${edgePath(by[e.from], by[e.to]).d} fill="none" stroke="var(--text-3)" stroke-width="5" />`)}
    ${f.nodes.map(n => html`<rect key=${n.id} x=${n.x} y=${n.y} width=${NW} height=${NH} rx="14" fill="var(--surface)" stroke=${n.type === 'reuniao' ? 'var(--text)' : 'var(--line-strong)'} stroke-width=${n.type === 'reuniao' ? 6 : 4} />`)}
  </svg>`;
}
function FunnelPage({ id }) {
  const { db, act, go } = useApp();
  const f = db.funnels.find(x => x.id === id);
  if (!f) return html`<div class="page"><div class="card empty">Funil não encontrado.</div></div>`;
  return html`<div class="canvas-page">
    <div class="cv-head">
      <button class="btn icon sm ghost" aria-label="Voltar" onClick=${() => go(f.clientId ? { v: 'client', id: f.clientId, tab: 'funnels' } : { v: 'funnels' })}><${Icon} n="chevL" /></button>
      <${Icon} n="funnel" /><div class="cv-title" contenteditable="true" onBlur=${e => act.setFunnel(f.id, { title: e.currentTarget.innerText.trim() || f.title })} onKeyDown=${e => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}>${f.title}</div>
      ${f.clientId ? html`<${CChip} id=${f.clientId} />` : html`<span class="tag">MODELO</span>`}
      <${FavBtn} k=${'funnel:' + f.id} />
      <span class="spacer"></span>
      <label class="sr" for="fn-cur">Moeda</label><select id="fn-cur" class="sel" style="width:auto;height:30px;font-size:13px" value=${f.currency} onChange=${e => act.setFunnel(f.id, { currency: e.target.value })}><option>US$</option><option>R$</option><option>€</option></select>
    </div>
    <${FunnelEditor} f=${f} key=${f.id} />
  </div>`;
}
function FunnelEditor({ f }) {
  const { act } = useApp();
  const [nodes, setNodes] = useState(f.nodes); const [edges, setEdges] = useState(f.edges);
  const nRef = useRef(nodes); nRef.current = nodes; const eRef = useRef(edges); eRef.current = edges;
  const [vp, setVp] = useState({ x: 40, y: 60, k: .8 }); const vpRef = useRef(vp); vpRef.current = vp;
  const [sel, setSel] = useState(null); const [link, setLink] = useState(null); const [spaceDown, setSpaceDown] = useState(false); const [goal, setGoal] = useState('40');
  const svgRef = useRef(); const wrapRef = useRef(); const drag = useRef(null);
  const calc = computeFunnel(nodes, edges); const cur = f.currency;
  const by = Object.fromEntries(nodes.map(n => [n.id, n]));
  const persist = (n = nRef.current, e = eRef.current) => act.setFunnel(f.id, { nodes: n, edges: e });
  const setN = (n, keep) => { setNodes(n); nRef.current = n; if (!keep) persist(n, eRef.current); };
  const setE = e => { setEdges(e); eRef.current = e; persist(nRef.current, e); };
  const toW = e => { const r = svgRef.current.getBoundingClientRect(); const v = vpRef.current; return [(e.clientX - r.left - v.x) / v.k, (e.clientY - r.top - v.y) / v.k]; };
  const fit = () => { if (!nRef.current.length || !svgRef.current) return; const xs = nRef.current.map(n => n.x), ys = nRef.current.map(n => n.y); const x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) + NW - x0, h = Math.max(...ys) + NH - y0; const r = svgRef.current.getBoundingClientRect(); const k = Math.max(.25, Math.min(1.2, Math.min((r.width - 80) / w, (r.height - 80) / h))); setVp({ k, x: (r.width - w * k) / 2 - x0 * k, y: (r.height - h * k) / 2 - y0 * k }); };
  useEffect(() => { requestAnimationFrame(fit); }, []);
  const zoomBy = (fct, px, py) => setVp(v => { const k = Math.max(.2, Math.min(2.5, v.k * fct)); const r = svgRef.current.getBoundingClientRect(); const cx0 = px ?? r.width / 2, cy0 = py ?? r.height / 2; return { k, x: cx0 - (cx0 - v.x) * k / v.k, y: cy0 - (cy0 - v.y) * k / v.k }; });
  useEffect(() => { const el = wrapRef.current; const wh = e => { e.preventDefault(); const r = svgRef.current.getBoundingClientRect(); if (e.ctrlKey || e.metaKey) zoomBy(Math.exp(-e.deltaY * .01), e.clientX - r.left, e.clientY - r.top); else setVp(v => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY })); }; el.addEventListener('wheel', wh, { passive: false }); return () => el.removeEventListener('wheel', wh); }, []);
  useEffect(() => {
    const typing = t => t && (t.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(t.tagName));
    const kd = e => { if (typing(e.target)) return; if (e.code === 'Space') { e.preventDefault(); setSpaceDown(true); } if ((e.key === 'Delete' || e.key === 'Backspace') && sel) { e.preventDefault(); del(); } if (e.key === 'Escape') setSel(null); };
    const ku = e => { if (e.code === 'Space') setSpaceDown(false); };
    addEventListener('keydown', kd); addEventListener('keyup', ku); return () => { removeEventListener('keydown', kd); removeEventListener('keyup', ku); };
  });
  const del = () => { if (!sel) return; if (sel.k === 'node') { setNodes(nRef.current.filter(n => n.id !== sel.id)); nRef.current = nRef.current.filter(n => n.id !== sel.id); setE(eRef.current.filter(e => e.from !== sel.id && e.to !== sel.id)); } else setE(eRef.current.filter(e => e.id !== sel.id)); setSel(null); };
  const addNode = (type, at) => { const r = svgRef.current.getBoundingClientRect(); const v = vpRef.current; const p = at || [(r.width / 2 - v.x) / v.k - NW / 2, (r.height / 2 - v.y) / v.k - NH / 2]; const T = FN[type]; const n = { id: uid('n'), type, x: Math.round(p[0]), y: Math.round(p[1]), label: T.label, p: T.kind === 'traffic' ? (T.paid ? { invest: 1000, cpc: 2 } : { visits: 500 }) : T.kind === 'buy' ? { conv: type === 'venda' ? 100 : 20, price: '' } : T.kind === 'talk' ? { cost: '' } : {} }; setN([...nRef.current, n]); setSel({ k: 'node', id: n.id }); };
  const down = e => {
    const p = toW(e); const tgt = e.target.closest && e.target.closest('[data-n]');
    svgRef.current.setPointerCapture(e.pointerId);
    if (spaceDown || e.button === 1) { drag.current = { m: 'pan', sx: e.clientX, sy: e.clientY, v: vpRef.current }; return; }
    if (tgt && tgt.getAttribute('data-port')) { const id = tgt.getAttribute('data-n'); drag.current = { m: 'link', from: id }; setLink({ from: id, x: p[0], y: p[1] }); return; }
    if (tgt) { const id = tgt.getAttribute('data-n'); setSel({ k: 'node', id }); const n = by[id]; drag.current = { m: 'move', id, p0: p, o: { x: n.x, y: n.y }, moved: false }; return; }
    const et = e.target.closest && e.target.closest('[data-e]'); if (et) { setSel({ k: 'edge', id: et.getAttribute('data-e') }); return; }
    setSel(null); drag.current = { m: 'pan', sx: e.clientX, sy: e.clientY, v: vpRef.current };
  };
  const move = e => { const d = drag.current; if (!d) return; const p = toW(e);
    if (d.m === 'pan') { setVp({ ...d.v, x: d.v.x + e.clientX - d.sx, y: d.v.y + e.clientY - d.sy }); return; }
    if (d.m === 'move') { const dx = p[0] - d.p0[0], dy = p[1] - d.p0[1]; if (Math.abs(dx) + Math.abs(dy) > 2) d.moved = true; setN(nRef.current.map(n => n.id === d.id ? { ...n, x: Math.round(d.o.x + dx), y: Math.round(d.o.y + dy) } : n), true); return; }
    if (d.m === 'link') setLink(l => ({ ...l, x: p[0], y: p[1] }));
  };
  const up = e => { const d = drag.current; drag.current = null; if (!d) return; const p = toW(e);
    if (d.m === 'move' && d.moved) persist();
    if (d.m === 'link') { setLink(null); const t = nRef.current.find(n => p[0] >= n.x && p[0] <= n.x + NW && p[1] >= n.y && p[1] <= n.y + NH); if (t && t.id !== d.from && !eRef.current.some(x => x.from === d.from && x.to === t.id)) { const src = by[d.from]; const ne = { id: uid('e'), from: d.from, to: t.id, rate: FN[src.type].kind === 'traffic' ? 100 : 50 }; setE([...eRef.current, ne]); setSel({ k: 'edge', id: ne.id }); } }
  };
  const onDrop = e => { e.preventDefault(); const type = e.dataTransfer.getData('text/fn'); if (!FN[type]) return; const p = toW(e); addNode(type, [p[0] - NW / 2, p[1] - NH / 2]); };
  const setNode = (id, patch) => setN(nRef.current.map(n => n.id === id ? { ...n, ...patch, p: { ...n.p, ...(patch.p || {}) } } : n));
  const setEdge = (id, patch) => setE(eRef.current.map(x => x.id === id ? { ...x, ...patch } : x));
  const metric = n => { const T = FN[n.type]; const v = calc.vol[n.id] || 0;
    if (T.kind === 'traffic') return T.paid ? `${money(num(n.p.invest), cur)} · ${nf(v)} cliques` : `${nf(v)} visitas/mês`;
    if (T.kind === 'buy') return `${nf(calc.buyers[n.id] || 0, 1)} ${n.type === 'venda' ? 'vendas' : 'compras'}${num(n.p.price) ? ' · ' + money(calc.rev[n.id], cur) : ''}`;
    if (n.type === 'reuniao') return `${nf(v, 1)} reuniões/mês`;
    if (T.kind === 'talk' && num(n.p.cost)) return `${nf(v)} conversas · ${money(v * num(n.p.cost), cur)}`;
    return `${nf(v)} /mês`; };
  const groups = [...new Set(Object.values(FN).map(t => t.g))];
  const sn = sel && sel.k === 'node' ? by[sel.id] : null; const se = sel && sel.k === 'edge' ? edges.find(x => x.id === sel.id) : null;
  const T = calc.t;
  return html`<div class="fn-layout">
    <aside class="fn-pal" aria-label="Etapas">${groups.map(g => html`<div key=${g}><span class="label">${g}</span>${Object.entries(FN).filter(([, t]) => t.g === g).map(([k, t]) => html`<button key=${k} class="fn-pi" draggable="true" onDragStart=${e => { e.dataTransfer.setData('text/fn', k); e.dataTransfer.effectAllowed = 'copy'; }} onClick=${() => addNode(k)} title="Clique ou arraste para o funil"><span class=${'fn-ic t-' + KIND_TONE[t.kind]}><${Icon} n=${t.ic} s=${14} /></span>${t.label}</button>`)}</div>`)}</aside>
    <div class="cv-wrap fn-canvas" ref=${wrapRef} onDragOver=${e => e.preventDefault()} onDrop=${onDrop}>
      <svg ref=${svgRef} class="cv-svg" style=${{ cursor: spaceDown ? 'grab' : 'default' }} onPointerDown=${down} onPointerMove=${move} onPointerUp=${up}>
        <defs><pattern id="fngrid" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform=${`translate(${vp.x},${vp.y}) scale(${vp.k})`}><circle cx="1" cy="1" r="1" fill="var(--line-strong)" /></pattern>
          <marker id="fnar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--text-3)" /></marker></defs>
        <rect width="100%" height="100%" fill="url(#fngrid)" />
        <g transform=${`translate(${vp.x},${vp.y}) scale(${vp.k})`}>
          ${edges.map(e => { const a = by[e.from], b = by[e.to]; if (!a || !b) return null; const g = edgePath(a, b); const on = sel && sel.k === 'edge' && sel.id === e.id; const lab = `${nf(num(e.rate), 1)}% · ${nf(calc.flow[e.id] || 0)}`; const w = lab.length * 7 + 18;
            return html`<g key=${e.id} data-e=${e.id} class="fn-edge"><path d=${g.d} class=${cx('fn-line', on && 'on')} marker-end="url(#fnar)" /><path d=${g.d} stroke="transparent" stroke-width="16" fill="none" />
              <g transform=${`translate(${g.mx - w / 2},${g.my - 12})`}><rect width=${w} height="24" rx="12" class=${cx('fn-lab', on && 'on')} /><text x=${w / 2} y="16" text-anchor="middle" class="fn-lab-t">${lab}</text></g></g>`; })}
          ${link && by[link.from] && html`<path d=${edgePath(by[link.from], { x: link.x, y: link.y - NH / 2 }).d} class="fn-line on" fill="none" />`}
          ${nodes.map(n => { const Tt = FN[n.type]; const on = sel && sel.k === 'node' && sel.id === n.id; const tone = KIND_TONE[Tt.kind]; return html`<g key=${n.id} data-n=${n.id} transform=${`translate(${n.x},${n.y})`} class="fn-node">
            <rect width=${NW} height=${NH} rx="12" class=${cx('fn-card', on && 'on', n.type === 'reuniao' && 'goal')} />
            <foreignObject x="0" y="0" width=${NW} height=${NH}><div xmlns="http://www.w3.org/1999/xhtml" class="fn-body"><span class=${'fn-ic t-' + tone}><${Icon} n=${Tt.ic} s=${15} /></span><span class="fn-txt"><b>${n.label}</b><small>${metric(n)}</small></span></div></foreignObject>
            <circle data-n=${n.id} data-port="1" cx=${NW} cy=${NH / 2} r="8" class="fn-port" /><circle cx="0" cy=${NH / 2} r="4" class="fn-in" />
          </g>`; })}
        </g>
      </svg>
      ${calc.cycle && html`<div class="cv-warn">Tem uma volta no funil (uma etapa que aponta para trás). As etapas da volta ficam fora da conta.</div>`}
      <div class="cv-zoom"><button class="tl" aria-label="Diminuir zoom" onClick=${() => zoomBy(1 / 1.2)}><${Icon} n="minus" s=${16} /></button><button class="tl pct" onClick=${fit} title="Ajustar à tela">${Math.round(vp.k * 100)}%</button><button class="tl" aria-label="Aumentar zoom" onClick=${() => zoomBy(1.2)}><${Icon} n="plus" s=${16} /></button></div>
      <div class="fn-forecast" aria-label="Previsão do mês">
        ${[['Custo total', money(T.cost, cur)], ['Visitas', nf(T.visits)], ['Leads', nf(T.leads)], ['Reuniões agendadas', nf(T.meetings, 1)], ['Custo por reunião agendada', money(T.cpMeet, cur), 'goal'], ['Custo por lead', money(T.cpl, cur)], ['Vendas', nf(T.sales, 1)], ['Receita', T.revenue ? money(T.revenue, cur) : '—'], ['ROAS', T.roas ? nf(T.roas, 2) + '×' : '—']].map(([l, v, g]) => html`<div key=${l} class=${cx('fc', g)}><span>${l}</span><b>${v}</b></div>`)}
      </div>
    </div>
    <aside class="fn-insp">
      ${sn ? html`<div class="sec" style="gap:14px"><div class="insp-h"><span class=${'fn-ic t-' + KIND_TONE[FN[sn.type].kind]}><${Icon} n=${FN[sn.type].ic} s=${15} /></span><span class="label">${FN[sn.type].g} · ${FN[sn.type].label}</span></div>
          <label class="field"><span>Nome</span><input class="inp" id="fn-name" value=${sn.label} onChange=${e => setNode(sn.id, { label: e.target.value })} /></label>
          ${FN[sn.type].kind === 'traffic' && (FN[sn.type].paid ? html`<div class="two"><label class="field"><span>Investimento/mês (${cur})</span><input class="inp" id="fn-inv" inputmode="decimal" value=${sn.p.invest} onChange=${e => setNode(sn.id, { p: { invest: e.target.value } })} /></label><label class="field"><span>Custo por clique</span><input class="inp" id="fn-cpc" inputmode="decimal" value=${sn.p.cpc} onChange=${e => setNode(sn.id, { p: { cpc: e.target.value } })} /></label></div>` : html`<label class="field"><span>Visitas por mês</span><input class="inp" id="fn-vis" inputmode="numeric" value=${sn.p.visits} onChange=${e => setNode(sn.id, { p: { visits: e.target.value } })} /></label>`)}
          ${FN[sn.type].kind === 'buy' && html`<div class="two"><label class="field"><span>Taxa de compra (%)</span><input class="inp" id="fn-conv" inputmode="decimal" value=${sn.p.conv} onChange=${e => setNode(sn.id, { p: { conv: e.target.value } })} /></label><label class="field"><span>Preço (${cur})</span><input class="inp" id="fn-price" inputmode="decimal" placeholder="definir" value=${sn.p.price} onChange=${e => setNode(sn.id, { p: { price: e.target.value } })} /></label></div>`}
          ${FN[sn.type].kind === 'talk' && html`<label class="field"><span>Custo por conversa (${cur})</span><input class="inp" id="fn-cost" inputmode="decimal" placeholder="ex.: 0,50" value=${sn.p.cost} onChange=${e => setNode(sn.id, { p: { cost: e.target.value } })} /><small class="muted">Mensagem do WhatsApp mais a IA. Entra no custo por reunião.</small></label>`}
          <div class="insp-stat"><span>Chegam aqui</span><b>${nf(calc.vol[sn.id] || 0, 1)} /mês</b></div>
          <div><span class="label">Para onde vai</span>${edges.filter(e => e.from === sn.id).map(e => html`<div class="insp-edge" key=${e.id}><span>${by[e.to] ? by[e.to].label : '—'}</span><input class="inp" aria-label=${'Taxa para ' + (by[e.to] ? by[e.to].label : '')} inputmode="decimal" value=${e.rate} onChange=${ev => setEdge(e.id, { rate: ev.target.value })} /><span class="muted">%</span></div>`)}
            ${!edges.some(e => e.from === sn.id) && html`<p class="muted" style="font-size:12px;margin-top:6px">Puxe a bolinha da direita do cartão até outra etapa para ligar.</p>`}</div>
          <button class="btn sm ghost danger" style="align-self:flex-start" onClick=${del}><${Icon} n="trash" s=${14} />Apagar etapa</button></div>`
      : se ? html`<div class="sec" style="gap:14px"><span class="label">Ligação</span><p><b>${by[se.from] && by[se.from].label}</b> → <b>${by[se.to] && by[se.to].label}</b></p>
          <label class="field"><span>Quantos passam (%)</span><input class="inp" id="fn-rate" inputmode="decimal" value=${se.rate} onChange=${e => setEdge(se.id, { rate: e.target.value })} /></label>
          <div class="insp-stat"><span>Passam por mês</span><b>${nf(calc.flow[se.id] || 0, 1)}</b></div>
          <button class="btn sm ghost danger" style="align-self:flex-start" onClick=${del}><${Icon} n="trash" s=${14} />Apagar ligação</button></div>`
      : html`<div class="sec" style="gap:12px"><span class="label">Como usar</span>
          <ul class="tips"><li>Clique numa etapa à esquerda (ou arraste) para pôr no funil.</li><li>Puxe a bolinha da direita de um cartão até outro para ligar.</li><li>Clique na ligação para mudar quantos passam.</li><li>Espaço + arrastar move a tela, ⌘ + rolagem dá zoom.</li></ul>
          ${f.note && html`<div class="callout-s"><${Icon} n="alert" s=${15} /><span>${f.note}</span></div>`}
          <div class="insp-stat goal"><span>Custo por reunião agendada</span><b>${money(T.cpMeet, cur)}</b><small>A régua da M&O. Custo por lead aparece, mas não decide.</small></div>
          <label class="field"><span>Meta de reuniões por mês</span><input class="inp" id="fn-goal" inputmode="numeric" value=${goal} onInput=${e => setGoal(e.target.value)} /></label>
          <div class="insp-stat"><span>Custo total para bater a meta</span><b>${T.cpMeet && num(goal) ? money(num(goal) * T.cpMeet, cur) : '—'}</b><small>Conta linear: mantém as taxas de hoje e escala a verba.</small></div></div>`}
    </aside>
  </div>`;
}
function NewFunnel({ close, clientId }) {
  const { db, act, go } = useApp();
  const [f, setF] = useState({ title: '', tpl: 'qualif', clientId: clientId || '' });
  const TPL = [['qualif', 'Qualificação Imediata', 'Meta e orgânico → quiz → agente no WhatsApp → reunião → venda'], ['vsl', 'VSL com upsell e downsell', 'Anúncio → VSL → checkout → upsell → downsell → obrigado'], ['blank', 'Em branco', 'Comece do zero']];
  return html`<form onSubmit=${e => { e.preventDefault(); const id = act.addFunnel(f); close(); go({ v: 'funnel', id }); }}>
    <div class="mhd"><div><h2>Novo funil</h2><p>Escolha um ponto de partida. Tudo é editável depois.</p></div><button type="button" class="btn icon ghost" aria-label="Fechar" onClick=${close}><${Icon} n="x" /></button></div>
    <div class="mbd">
      <div class="tpls">${TPL.map(([k, l, d]) => html`<button type="button" key=${k} class=${cx('tpl', f.tpl === k && 'on')} aria-pressed=${f.tpl === k} onClick=${() => setF({ ...f, tpl: k })}><b>${l}</b><small>${d}</small></button>`)}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><label class="field"><span>Nome</span><input class="inp" id="nf-name" placeholder=${TPL.find(t => t[0] === f.tpl)[1]} value=${f.title} onInput=${e => setF({ ...f, title: e.target.value })} /></label>
        <label class="field"><span>Cliente</span><select class="sel" id="nf-client" value=${f.clientId} onChange=${e => setF({ ...f, clientId: e.target.value })}><option value="">Modelo interno</option>${db.clients.map(c => html`<option value=${c.id}>${c.name}</option>`)}</select></label></div>
    </div>
    <div class="mft"><button type="button" class="btn ghost" onClick=${close}>Cancelar</button><button class="btn pri" type="submit">Criar funil</button></div>
  </form>`;
}
function NewTask({ close, clientId }) {
  const { db, act, me } = useApp();
  const [f, setF] = useState({ title: '', clientId: clientId || db.clients[0].id, assignee: me.id, due: off(1), type: 'interna' });
  return html`<form onSubmit=${e => { e.preventDefault(); if (!f.title.trim()) return; act.addTask({ ...f, title: f.title.trim() }); close(); }}>
    <div class="mhd"><div><h2>Nova tarefa</h2></div><button type="button" class="btn icon ghost" aria-label="Fechar" onClick=${close}><${Icon} n="x" /></button></div>
    <div class="mbd">
      <label class="field"><span>O que precisa ser feito</span><input class="inp" id="nt-title" ref=${autoF} value=${f.title} onInput=${e => setF({ ...f, title: e.target.value })} /></label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <label class="field"><span>Cliente</span><select class="sel" id="nt-client" value=${f.clientId} onChange=${e => setF({ ...f, clientId: e.target.value })}>${db.clients.map(c => html`<option value=${c.id}>${c.name}</option>`)}</select></label>
        <label class="field"><span>Responsável</span><${PersonSel} id="nt-who" value=${f.assignee} onChange=${v => setF({ ...f, assignee: v })} /></label>
        <label class="field"><span>Prazo</span><input class="inp" id="nt-due" type="date" value=${f.due} onChange=${e => setF({ ...f, due: e.target.value })} /></label>
        <div class="field"><span>Tipo</span><div class="seg" style="align-self:flex-start"><button type="button" class=${cx(f.type === 'interna' && 'on')} onClick=${() => setF({ ...f, type: 'interna' })}>Interna</button><button type="button" class=${cx(f.type === 'entrega' && 'on')} onClick=${() => setF({ ...f, type: 'entrega' })}>Entrega</button></div></div>
      </div>
    </div>
    <div class="mft"><button type="button" class="btn ghost" onClick=${close}>Cancelar</button><button class="btn pri" type="submit" disabled=${!f.title.trim()}>Criar tarefa</button></div>
  </form>`;
}

/* ================= v2: copiloto ================= */
const REF_KIND = { tarefa: 'task', post: 'post', roteiro: 'script', pagina: 'page', reuniao: 'meeting', quadro: 'board', funil: 'funnel', cliente: 'client' };
function copilotScope(app) {
  const { session, db } = app; const client = session.role === 'cliente' ? session.clientId : null;
  const tasks = db.tasks.filter(t => !client || (t.clientId === client && t.type === 'entrega' && ['client', 'done'].includes(t.status)));
  const posts = db.posts.filter(p => !client || (p.clientId === client && POST_VISIBLE.includes(p.status)));
  const scripts = db.scripts.filter(s => !client || (s.clientId === client && SCRIPT_VISIBLE.includes(s.status)));
  const pages = db.pages.filter(p => !client || p.clientId === client);
  const boards = client ? [] : db.boards; const funnels = client ? [] : db.funnels;
  const meetings = client ? [] : allMeetings(app);
  const links = db.clients.filter(c => !client || c.id === client).flatMap(c => c.links.filter(l => !client || l.shared).map(l => ({ ...l, clientId: c.id })));
  return { client, tasks, posts, scripts, pages, boards, funnels, meetings, links };
}
function refTitle(app, kind, id) {
  const { db } = app; const K = REF_KIND[kind];
  if (K === 'task' || K === 'post' || K === 'script') { const x = itemOf(db, K, id); return x && x.title; }
  if (K === 'page') { const p = db.pages.find(x => x.id === id); return p && p.title; }
  if (K === 'board') { const b = db.boards.find(x => x.id === id); return b && b.title; }
  if (K === 'funnel') { const f = db.funnels.find(x => x.id === id); return f && f.title; }
  if (K === 'client') { const c = db.clients.find(x => x.id === id); return c && c.name; }
  if (K === 'meeting') { const m = allMeetings(app).find(x => x.key === id); return m && m.title; }
  return null;
}
function copilotTools(app, setStatus, addProposal) {
  const { db, session } = app; const S = copilotScope(app); const cname = id => (db.clients.find(c => c.id === id) || {}).name || '';
  const row = (kind, x) => ({ ref: `${kind}:${kind === 'reuniao' ? x.key : x.id}`, titulo: x.title || x.name, cliente: cname(x.clientId) || (kind === 'pagina' || kind === 'quadro' || kind === 'funil' ? 'interno' : ''),
    status: kind === 'tarefa' ? stOf('task', x.status)[1] : kind === 'post' ? stOf('post', x.status)[1] : kind === 'roteiro' ? stOf('script', x.status)[1] : undefined,
    prazo: x.due ? `${fmt(x.due)} (${rel(x.due)})` : x.date ? `publicação ${fmt(x.date)}` : x.start ? fmt(dayOf(x.start)) + ' ' + hhmm(x.start) : undefined,
    responsavel: x.assignee && !session.clientId ? personName(db, x.assignee) : undefined });
  const corpus = () => [
    ...S.tasks.map(x => ['tarefa', x, x.title + ' ' + x.desc + ' ' + x.checklist.map(c => c.t).join(' ')]),
    ...S.posts.map(x => ['post', x, x.title + ' ' + x.caption]),
    ...S.scripts.map(x => ['roteiro', x, x.title + ' ' + x.kind + ' ' + x.blocks.map(b => b[1]).join(' ')]),
    ...S.pages.map(x => ['pagina', x, x.title + ' ' + x.blocks.map(b => b.text || (b.items || []).map(i => i.t || i).join(' ')).join(' ')]),
    ...S.boards.map(x => ['quadro', x, x.title + ' ' + x.els.map(e => e.text || '').join(' ')]),
    ...S.funnels.map(x => ['funil', x, x.title + ' ' + x.nodes.map(n => n.label).join(' ')]),
    ...S.meetings.map(x => ['reuniao', x, x.title + ' ' + (x.transcript || '') + ' ' + x.attendees.map(a => a.name).join(' ')]),
  ];
  const tools = [
    { name: 'buscar', description: 'Busca por palavras em tarefas, posts, roteiros, páginas de processo, quadros, funis e reuniões que esta pessoa pode ver. Devolve até 8 itens com ref, título, cliente, status e prazo.',
      inputSchema: { type: 'object', properties: { texto: { type: 'string', description: 'palavras-chave' }, tipo: { type: 'string', enum: ['tarefa', 'post', 'roteiro', 'pagina', 'quadro', 'funil', 'reuniao'] } }, required: ['texto'] },
      execute: ({ texto, tipo }) => { setStatus(`Buscando "${texto}"…`); const words = norm(String(texto)).split(/\s+/).filter(w => w.length > 2); const res = corpus().filter(([k]) => !tipo || k === tipo).map(([k, x, t]) => { const title = norm(x.title || ''), body = norm(t); const sc = words.reduce((s, w) => s + (title.includes(w) ? 3 : 0) + (body.includes(w) ? 1 : 0), 0); return [sc, k, x]; }).filter(r => r[0] > 0).sort((a, b) => b[0] - a[0]).slice(0, 8).map(([, k, x]) => row(k, x)); return res.length ? res : 'Nada encontrado.'; } },
    { name: 'detalhar', description: 'Devolve o conteúdo de um item pela ref (ex.: "tarefa:t2", "roteiro:s1", "post:p6", "pagina:w1", "reuniao:ex:m1"): descrição, checklist, comentários, legenda, texto do roteiro, blocos da página ou transcrição.',
      inputSchema: { type: 'object', properties: { ref: { type: 'string' } }, required: ['ref'] },
      execute: ({ ref }) => { const r = String(ref); const i = r.indexOf(':'); const k = r.slice(0, i), id = r.slice(i + 1); setStatus('Abrindo o item…'); const cut = s => String(s || '').slice(0, 1800);
        if (k === 'tarefa') { const x = S.tasks.find(t => t.id === id); if (!x) throw new Error('não encontrado ou sem acesso'); return { ...row(k, x), tipo: x.type, descricao: cut(x.desc), checklist: x.checklist.map(c => (c.done ? '[x] ' : '[ ] ') + c.t), comentarios: session.clientId ? undefined : x.comments.map(c => `${c.by === 'client' ? 'Cliente' : personName(db, c.by)}: ${c.text}`) }; }
        if (k === 'post') { const x = S.posts.find(t => t.id === id); if (!x) throw new Error('não encontrado ou sem acesso'); return { ...row(k, x), legenda: x.caption, slides: x.imgs.length, comentarios: x.comments.map(c => `${c.by === 'client' ? 'Cliente' : personName(db, c.by)}${c.slide ? ' (slide ' + c.slide + ')' : ''}: ${c.text}`) }; }
        if (k === 'roteiro') { const x = S.scripts.find(t => t.id === id); if (!x) throw new Error('não encontrado ou sem acesso'); return { ...row(k, x), formato: x.kind, gravacao: x.record ? fmt(x.record) : null, como_gravar: x.format, texto: cut(x.blocks.map(b => `[${b[0]}] ${b[1]}`).join('\n')) }; }
        if (k === 'pagina') { const x = S.pages.find(t => t.id === id); if (!x) throw new Error('não encontrado ou sem acesso'); return { titulo: x.title, texto: cut(x.blocks.map(b => b.text || (b.items || []).map(i => '- ' + (i.t || i)).join('\n')).join('\n')) }; }
        if (k === 'reuniao') { const x = S.meetings.find(t => t.key === id); if (!x) throw new Error('não encontrado ou sem acesso'); const n = db.meetingNotes[x.key]; return { ...row(k, x), participantes: x.attendees.map(a => a.name), resumo: n ? n.resumo : null, transcricao: cut(x.transcript) || (x.tactiq ? 'Transcrição no Tactiq; o texto não sai pela integração no plano atual.' : null) }; }
        if (k === 'funil') { const x = S.funnels.find(t => t.id === id); if (!x) throw new Error('não encontrado'); const c = computeFunnel(x.nodes, x.edges).t; return { titulo: x.title, etapas: x.nodes.map(n => n.label), previsao_mensal: { investimento: money(c.invest, x.currency), leads: nf(c.leads), reunioes: nf(c.meetings, 1), custo_por_reuniao: money(c.cpMeet, x.currency) }, nota: x.note }; }
        if (k === 'quadro') { const x = S.boards.find(t => t.id === id); if (!x) throw new Error('não encontrado'); return { titulo: x.title, textos: x.els.filter(e => e.text).map(e => e.text).slice(0, 40) }; }
        throw new Error('ref desconhecida'); } },
    { name: 'listar', description: 'Lista itens por filtro. tipo: tarefa, post ou roteiro. Filtros opcionais: cliente (nome), responsavel (primeiro nome), atrasadas (true), esperando_cliente (true), status (texto do status). Devolve até 15.',
      inputSchema: { type: 'object', properties: { tipo: { type: 'string', enum: ['tarefa', 'post', 'roteiro'] }, cliente: { type: 'string' }, responsavel: { type: 'string' }, atrasadas: { type: 'boolean' }, esperando_cliente: { type: 'boolean' }, status: { type: 'string' } }, required: ['tipo'] },
      execute: a => { setStatus('Listando…'); const k = a.tipo === 'post' ? 'post' : a.tipo === 'roteiro' ? 'roteiro' : 'tarefa'; let L = k === 'post' ? S.posts : k === 'roteiro' ? S.scripts : S.tasks.filter(t => t.status !== 'done');
        if (a.cliente) L = L.filter(x => norm(cname(x.clientId)).includes(norm(a.cliente)));
        if (a.responsavel && !session.clientId) L = L.filter(x => norm(personName(db, x.assignee)).includes(norm(a.responsavel)));
        if (a.atrasadas) L = L.filter(x => x.due && diff(x.due) < 0);
        if (a.esperando_cliente) L = L.filter(x => x.status === 'cliente' || x.status === 'client');
        if (a.status) L = L.filter(x => norm(stOf(k === 'tarefa' ? 'task' : k === 'post' ? 'post' : 'script', x.status)[1]).includes(norm(a.status)));
        return L.slice(0, 15).map(x => row(k, x)); } },
  ];
  if (!session.clientId) tools.push({ name: 'propor_tarefa', description: 'Propõe uma tarefa nova. NÃO cria: mostra um cartão para a pessoa confirmar com um clique. cliente e responsavel pelo nome; prazo_dias a partir de hoje.',
    inputSchema: { type: 'object', properties: { titulo: { type: 'string' }, cliente: { type: 'string' }, responsavel: { type: 'string' }, prazo_dias: { type: 'number' } }, required: ['titulo'] },
    execute: a => { const c = db.clients.find(x => a.cliente && norm(x.name).includes(norm(a.cliente))) || db.clients[0]; const p = db.people.find(x => a.responsavel && norm(x.name).split(' ')[0] === norm(a.responsavel).split(' ')[0]) || app.me; addProposal({ title: String(a.titulo).slice(0, 160), clientId: c.id, assignee: p.id, due: off(Math.max(0, Math.round(num(a.prazo_dias) || 3))) }); return 'Cartão de confirmação mostrado. A tarefa só existe depois que a pessoa clicar em Criar.'; } });
  return tools;
}
function copilotContext(app) {
  const { route, drawer, db, session } = app;
  if (drawer) { if (drawer.k === 'meeting') { const m = allMeetings(app).find(x => x.key === drawer.id); return m ? { label: 'Reunião: ' + m.title, text: `a reunião "${m.title}" (ref reuniao:${m.key})`, sug: ['Resume esta reunião', 'O que ficou decidido?'] } : null; }
    const x = itemOf(db, drawer.k, drawer.id); if (x) { const kind = { task: 'tarefa', post: 'post', script: 'roteiro' }[drawer.k]; return { label: `${kind[0].toUpperCase() + kind.slice(1)}: ${x.title}`, text: `o ${kind} "${x.title}" (ref ${kind}:${x.id})`, sug: drawer.k === 'script' ? ['Como está este roteiro?', 'Sugira 3 ganchos alternativos'] : drawer.k === 'post' ? ['Por que este post está parado?', 'O que o cliente pediu aqui?'] : ['O que falta para fechar esta tarefa?', 'Quem está esperando isso?'] }; } }
  if (session.role === 'cliente') return { label: 'Sua área', text: 'a área do cliente', sug: ['O que precisa da minha aprovação?', 'Quando sai o próximo post?', 'Como eu peço um ajuste num slide?'] };
  const c = route.v === 'client' ? db.clients.find(x => x.id === route.id) : null;
  if (c) return { label: `${c.name} · ${(CLIENT_TABS.find(t => t[0] === (route.tab || 'overview')) || [0, ''])[1]}`, text: `a área do cliente ${c.name}, aba ${route.tab || 'overview'}`, sug: [`O que está atrasado da ${c.name}?`, `O que espera aprovação da ${c.name}?`, 'Onde estão os roteiros das caixinhas?'] };
  if (route.v === 'board') { const b = db.boards.find(x => x.id === route.id); return b && { label: 'Quadro: ' + b.title, text: `o quadro "${b.title}" (ref quadro:${b.id})`, sug: ['Transforma este quadro numa lista de tarefas', 'Resume este quadro'] }; }
  if (route.v === 'funnel') { const f = db.funnels.find(x => x.id === route.id); return f && { label: 'Funil: ' + f.title, text: `o funil "${f.title}" (ref funil:${f.id})`, sug: ['Quanto custa cada reunião neste funil?', 'Onde este funil perde mais gente?'] }; }
  return { label: 'Visão geral', text: 'a navegação geral', sug: ['O que está atrasado?', 'O que espera o cliente há mais de 3 dias?', 'Estou com problema pra postar', 'Onde está o roteiro das caixinhas?'] };
}
function RichText({ text, onRef, app }) {
  const lines = String(text).split('\n');
  const inline = s => s.split(/(\[\[[a-z]+:[^\]]+\]\]|\*\*[^*]+\*\*)/g).map((p, i) => {
    const m = p.match(/^\[\[([a-z]+):([^\]]+)\]\]$/);
    if (m) { const t = refTitle(app, m[1], m[2]); return t ? html`<button key=${i} class="ref" onClick=${() => onRef(m[1], m[2])}>${t}</button>` : html`<span key=${i} class="muted">(item não encontrado)</span>`; }
    if (p.startsWith('**') && p.endsWith('**')) return html`<b key=${i}>${p.slice(2, -2)}</b>`;
    return p; });
  const out = []; let list = null;
  lines.forEach((l, i) => { const li = l.match(/^\s*(?:[-•*]|\d+\.)\s+(.*)$/); if (li) { (list = list || []).push(html`<li key=${i}>${inline(li[1])}</li>`); return; } if (list) { out.push(html`<ul key=${'u' + i}>${list}</ul>`); list = null; } if (l.trim()) out.push(html`<p key=${i}>${inline(l)}</p>`); });
  if (list) out.push(html`<ul key="ul-end">${list}</ul>`);
  return out;
}
function Copilot({ floating }) {
  const app = useApp(); const { copilot, setCopilot, session, me, db, act, go, open, toast } = app;
  const [q, setQ] = useState(''); const [status, setStatus] = useState(''); const ctl = useRef(null); const listRef = useRef();
  const isClient = session.role === 'cliente';
  const ctx = copilotContext(app) || { label: 'Geral', text: 'a navegação geral', sug: [] };
  const msgs = copilot.msgs; const busy = copilot.busy;
  const setMsgs = fn => setCopilot(c => ({ ...c, msgs: typeof fn === 'function' ? fn(c.msgs) : fn }));
  useEffect(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight; }, [msgs.length, msgs[msgs.length - 1] && msgs[msgs.length - 1].text]);
  const onRef = (kind, id) => { const K = REF_KIND[kind]; if (isClient) return;
    if (K === 'task' || K === 'post' || K === 'script') open(K, id); else if (K === 'meeting') open('meeting', id);
    else if (K === 'board') go({ v: 'board', id }); else if (K === 'funnel') go({ v: 'funnel', id }); else if (K === 'client') go({ v: 'client', id, tab: 'overview' });
    else if (K === 'page') { const p = db.pages.find(x => x.id === id); go(p && p.clientId ? { v: 'client', id: p.clientId, tab: 'process' } : { v: 'wiki' }); } };
  const guide = isClient
    ? '- Aprovar: aba "Para você", botão Aprovar. Pedir ajuste: botão Pedir ajuste, escolha o slide e escreva o que mudar.\n- Próximas publicações: aba Calendário.\n- Arquivos e acessos: aba Links.\n- Como a M&O trabalha com você: aba Processos.'
    : '- Postar ou agendar: abra o post em Postagens. O botão do próximo passo segue o status: Revisão interna, Enviar para o cliente, (cliente aprova), Agendar, Marcar como publicado. Post travado quase sempre está Com o cliente (lembre pelo WhatsApp) ou em Ajuste pedido (veja o comentário do cliente).\n- Mandar acesso ao cliente: área do cliente, botão Mandar acesso, copiar a mensagem.\n- Reunião: Trabalho, Reuniões, abrir a reunião, Gerar com IA.\n- Quadro branco: Estratégia, Quadros. N post-it, T texto, P caneta, A seta, espaço para mover.\n- Funil: Estratégia, Funis. O custo por reunião agendada aparece na barra de baixo.\n- Atalhos: ⌘K busca, ⌘J copiloto, ⌘\\ recolhe a barra.';
  const rules = `Você é o Copiloto da Central M&O, a plataforma de gestão da agência M&O. Responda em português do Brasil, curto, direto e útil, como um colega que conhece o sistema. No máximo 5 itens por lista.
Regras:
- Para qualquer pergunta sobre o trabalho (tarefas, posts, roteiros, reuniões, páginas, quadros, funis), use as ferramentas. Nunca invente item, prazo, número, status ou pessoa. Se não achar, diga que não achou.
- Ao citar um item, escreva a ref exatamente como veio da ferramenta, entre colchetes duplos, assim: [[tarefa:t2]]. A tela vira isso num link. Não repita o título ao lado da ref.
- ${isClient ? 'Quem pergunta é um CLIENTE da M&O e só enxerga a própria área. Não fale de tarefas internas, de outros clientes nem de custos.' : 'Para criar tarefa, use propor_tarefa. Não diga que criou: a pessoa confirma no cartão.'}
- Pergunta de "como faço" no sistema: responda pelo guia abaixo, em passos curtos, e se fizer sentido confira o estado do item com as ferramentas.
Quem pergunta: ${isClient ? 'cliente ' + ((db.clients.find(c => c.id === session.clientId) || {}).name || '') : me.name + (me.role === 'socio' ? ' (sócio)' : ' (colaborador)')}. Hoje é ${fmt(off(0), 'pt', { weekday: 'long', day: 'numeric', month: 'long' })}. Tela atual: ${ctx.text}.
Guia do sistema:
${guide}`;
  const send = async text => {
    const t = String(text || '').trim(); if (!t || busy) return;
    setQ('');
    const history = msgs.filter(m => m.role === 'user' || (m.role === 'assistant' && m.text && !m.error)).slice(-8).map(m => ({ role: m.role, content: m.role === 'user' ? m.text : m.text }));
    const aid = uid('m');
    setCopilot(c => ({ ...c, busy: true, msgs: [...c.msgs, { id: uid('m'), role: 'user', text: t }, { id: aid, role: 'assistant', text: '', proposals: [] }] }));
    const patch = p => setMsgs(ms => ms.map(m => m.id === aid ? { ...m, ...(typeof p === 'function' ? p(m) : p) } : m));
    const sample = await cap('sample');
    if (!sample) {
      const tools = copilotTools(app, () => {}, () => {}); const res = tools[0].execute({ texto: t });
      patch({ text: Array.isArray(res) ? `O Claude não está disponível nesta visualização, então rodei só a busca. Achei isto:\n${res.slice(0, 5).map(r => '- [[' + r.ref + ']]').join('\n')}` : 'O Claude não está disponível nesta visualização, e a busca não achou nada com essas palavras.', offline: true });
      setCopilot(c => ({ ...c, busy: false })); return;
    }
    ctl.current = new AbortController(); setStatus('Pensando…');
    const addProposal = pr => patch(m => ({ proposals: [...(m.proposals || []), { ...pr, id: uid('pr'), state: 'open' }] }));
    try {
      await sample([{ role: 'user', content: rules }, ...history, { role: 'user', content: t }], { modelTier: 'quick', signal: ctl.current.signal, tools: copilotTools(app, setStatus, addProposal), onText: ({ text: tx }) => { setStatus(''); patch({ text: tx }); } });
    } catch (e) { if (e && e.code !== 'cancelled') patch(m => ({ text: (e.text || m.text || ''), error: sampleMsg(e) })); }
    finally { setStatus(''); setCopilot(c => ({ ...c, busy: false })); }
  };
  const decide = (mid, pid, ok) => { const m = msgs.find(x => x.id === mid); const pr = m && m.proposals.find(p => p.id === pid); if (!pr) return; if (ok) act.addTask({ title: pr.title, clientId: pr.clientId, assignee: pr.assignee, due: pr.due, desc: 'Criada pelo copiloto.' }); setMsgs(ms => ms.map(x => x.id === mid ? { ...x, proposals: x.proposals.map(p => p.id === pid ? { ...p, state: ok ? 'done' : 'dropped' } : p) } : x)); };
  return html`<aside class=${cx('copilot', floating && 'floating')} aria-label="Copiloto">
    <div class="cp-head"><span class="cp-mark"><${Icon} n="sparkle" s=${16} /></span><div class="cp-ttl"><b>${isClient ? 'Assistente' : 'Copiloto'}</b><small title=${ctx.label}>Vendo: ${ctx.label}</small></div>
      ${msgs.length > 0 && html`<button class="btn sm ghost" disabled=${busy} onClick=${() => setCopilot(c => ({ ...c, msgs: [] }))}>Nova conversa</button>`}
      <button class="btn icon sm ghost" aria-label="Fechar copiloto" onClick=${() => setCopilot(c => ({ ...c, open: false }))}><${Icon} n="x" s=${16} /></button></div>
    <div class="cp-list" ref=${listRef}>
      ${msgs.length === 0 && html`<div class="cp-empty"><b>${isClient ? 'Pergunte sobre as suas peças, o calendário ou como aprovar.' : 'Pergunte sobre qualquer coisa do trabalho. Eu busco por você.'}</b>
        <div class="cp-sugs">${ctx.sug.map(s => html`<button key=${s} onClick=${() => send(s)}>${s}</button>`)}</div></div>`}
      ${msgs.map(m => m.role === 'user' ? html`<div class="cp-u" key=${m.id}>${m.text}</div>` : html`<div class="cp-a" key=${m.id}>
        ${m.text ? html`<div class="cp-md"><${RichText} text=${m.text} onRef=${onRef} app=${app} /></div>` : !m.error && html`<div class="cp-think"><span class="dot1"></span><span class="dot1"></span><span class="dot1"></span>${status || 'Pensando…'}</div>`}
        ${(m.proposals || []).map(p => html`<div class="cp-prop" key=${p.id}><div><span class="label">Tarefa proposta</span><b>${p.title}</b><small>${(db.clients.find(c => c.id === p.clientId) || {}).name} · ${personName(db, p.assignee)} · ${fmt(p.due)}</small></div>
          ${p.state === 'open' ? html`<div class="cp-prop-a"><button class="btn sm ghost" onClick=${() => decide(m.id, p.id, false)}>Descartar</button><button class="btn sm pri" onClick=${() => decide(m.id, p.id, true)}>Criar</button></div>` : html`<span class="muted" style="font-size:12px">${p.state === 'done' ? 'Criada' : 'Descartada'}</span>`}</div>`)}
        ${m.error && html`<p class="err">${m.error}</p>`}
      </div>`)}
    </div>
    <form class="cp-in" onSubmit=${e => { e.preventDefault(); send(q); }}>
      <label class="sr" for="cp-q">Pergunta</label>
      <textarea id="cp-q" rows="1" placeholder=${isClient ? 'Pergunte algo sobre o seu projeto' : 'Pergunte ou peça algo'} value=${q} onInput=${e => { setQ(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(140, e.target.scrollHeight) + 'px'; }} onKeyDown=${e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(q); } }}></textarea>
      ${busy ? html`<button type="button" class="btn icon" aria-label="Parar" onClick=${() => ctl.current && ctl.current.abort()}><${Icon} n="stop" s=${14} /></button>` : html`<button type="submit" class="btn icon pri" aria-label="Enviar" disabled=${!q.trim()}><${Icon} n="send" s=${14} /></button>`}
    </form>
    <p class="cp-foot">Usa o Claude da sua conta e só enxerga o que o seu nível de acesso permite.</p>
  </aside>`;
}
