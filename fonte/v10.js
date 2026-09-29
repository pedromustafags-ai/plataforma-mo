
/* ================= v10: cliente com a cara dele, aba Sobre, o que o cliente vê, histórico ================= */
Object.assign(IC, {
  info: ['M21 12a9 9 0 1 1-18 0a9 9 0 1 1 18 0', 'M12 11v5', 'M12 8h.01'],
  history: ['M3 12a9 9 0 1 0 2.6-6.4', 'M3 4v5h5', 'M12 7v5l3 2'],
  eyeOff: ['M3 3l18 18', 'M10.6 5.1A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9', 'M6.6 6.6C3.9 8.4 2 12 2 12s4 7 10 7a9.7 9.7 0 0 0 5.4-1.6', 'M9.9 9.9a3 3 0 0 0 4.2 4.2'],
});
[['pt', 'Ícone (quadrado)'], ['en', 'Icon (square)'], ['es', 'Ícono (cuadrado)'], ['fr', 'Icône (carrée)']].forEach(([l, v]) => { if (BT[l]) BT[l].icon = v; });

/* quem fez: pessoa do time, pessoa do cliente, ou o contato principal do cliente ('client:<id>') */
const clientOfActor = (db, id) => { const m = /^client:(.+)$/.exec(String(id || '')); return m ? db.clients.find(c => c.id === m[1]) : null; };
function actorName(db, id) {
  if (!id) return 'Alguém';
  if (id === 'client') return 'O cliente';
  const c = clientOfActor(db, id); if (c) return c.contact && c.contact !== '—' ? c.contact : 'Contato de ' + c.name;
  return personName(db, id);
}
const isClientActor = (db, id) => id === 'client' || /^client:/.test(String(id || '')) || db.people.some(p => p.id === id && p.role === 'cliente');
function ActorAv({ id }) { return html`<${Av} id=${id === 'client' || /^client:/.test(String(id || '')) ? 'client' : id} />`; }

/* logo, ícone e cores do cliente */
async function imgRatio(src) { try { const i = await loadImg(src); return (i.naturalWidth || 1) / (i.naturalHeight || 1); } catch (e) { return null; } }
async function brandFromLogo(data) {
  const out = { logo: data, logoIsDark: await logoIsDark(data), logoRatio: await imgRatio(data), colors: [], primary: null };
  try { const pal = await paletteFromImage(data); out.colors = mergeColors(pal.map(p => ({ ...p, src: 'img' }))).slice(0, 6).map(x => x.hex); out.primary = pickPrimary(pal.map(p => ({ hex: p.hex }))); } catch (e) {}
  return out;
}
function newBrand(br) {
  const base = { logo: null, logoDark: null, icon: null, colors: [], primary: null, font: null, theme: { mode: 'light', light: 'papel', dark: 'carvao' } };
  if (!br) return base;
  return { ...base, ...br, theme: isHex(br.primary) ? { mode: 'light', light: 'brand', dark: 'brand' } : base.theme };
}
const onColor = hex => contrast('#FFFFFF', hex) >= contrast('#222831', hex) ? '#FFFFFF' : '#222831';

/* o Drive entrega a lista em partes; a prévia pede as partes seguintes */
async function driveList(input, want = Infinity, pages = 6) {
  const out = []; let tok = null, n = 0;
  do { const pl = await driveCall('search_files', tok ? { ...input, pageToken: tok } : input); out.push(...((pl && pl.files) || [])); tok = pl && pl.nextPageToken; n++; } while (tok && n < pages && out.length < want);
  return out;
}

/* ---------- cadastro do cliente ---------- */
function NewClient({ close }) {
  const { act, go, setModal, me } = useApp();
  const [f, setF] = useState({ name: '', lang: 'en', owner: me.id, contact: '', niche: '' });
  const [br, setBr] = useState(null); const [busy, setBusy] = useState('');
  const ok = f.name.trim().length > 1;
  const pick = key => async e => { const file = e.target.files && e.target.files[0]; e.target.value = ''; if (!file) return; setBusy(key === 'logo' ? 'Lendo as cores do logo…' : 'Carregando o ícone…');
    try { const data = await logoData(file); const patch = key === 'logo' ? await brandFromLogo(data) : { icon: data }; setBr(b => ({ ...(b || {}), ...patch })); } catch (er) {} setBusy(''); };
  const submit = e => { e.preventDefault(); if (!ok) return; const id = act.createClient({ ...f, name: f.name.trim(), niche: f.niche.trim(), brand: br }); go({ v: 'client', id, tab: 'overview' }); setModal({ t: 'invite', clientId: id, fresh: true }); };
  const Slot = (key, label, sq) => html`<div class=${cx('nc-slot', sq && 'sq')}><div class="nc-prev">${br && br[key] ? html`<img src=${br[key]} alt="" />` : html`<span class="muted">${label}</span>`}</div>
    <label class="btn sm"><${Icon} n="plus" s=${13} />${br && br[key] ? 'Trocar' : 'Subir ' + label.toLowerCase()}<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" class="sr" onChange=${pick(key)} /></label>
    ${br && br[key] && html`<button type="button" class="btn sm ghost" onClick=${() => setBr({ ...br, [key]: null, ...(key === 'logo' ? { colors: [], primary: null } : {}) })}>Tirar</button>`}</div>`;
  return html`<form onSubmit=${submit}>
    <div class="mhd"><div><h2>Novo cliente</h2><p>A área nasce pronta: lista de onboarding, as duas páginas de processo e o acesso pra mandar.</p></div><button type="button" class="btn icon ghost" aria-label="Fechar" onClick=${close}><${Icon} n="x" /></button></div>
    <div class="mbd">
      <div class="nc-top"><${CMark} c=${{ id: 'novo', name: f.name.trim() || 'Novo cliente', brand: br || {} }} lg />
        <label class="field" style="flex:1"><span>Nome da empresa</span><input class="inp" id="nc-name" ref=${autoF} placeholder="Ex.: Silva Roofing" value=${f.name} onInput=${e => setF({ ...f, name: e.target.value })} /></label></div>
      <div class="field"><span>Logo e ícone</span>
        <div class="nc-brand">${Slot('logo', 'Logo')}${Slot('icon', 'Ícone', true)}</div>
        <p class="muted" style="font-size:12px">${busy || 'O logo vai para o painel do cliente, e as cores dele montam o tema. O ícone é o símbolo quadrado que aparece ao lado do nome, aqui no time; sem ele, entram as iniciais na cor da marca. Os dois mudam depois na aba Marca.'}</p>
        ${br && (br.colors || []).length > 0 && html`<div class="nc-colors"><span class="muted" style="font-size:12px">Cor principal</span>${br.colors.map(h => html`<button type="button" key=${h} class=${cx('nc-sw', br.primary === h && 'on')} style=${{ background: h }} title=${h} aria-label=${'Usar ' + h + ' como cor principal'} aria-pressed=${br.primary === h} onClick=${() => setBr({ ...br, primary: h })}></button>`)}</div>`}</div>
      <label class="field"><span>Nicho</span><input class="inp" id="nc-niche" placeholder="Ex.: telhados residenciais na Flórida" value=${f.niche} onInput=${e => setF({ ...f, niche: e.target.value })} /></label>
      <div class="field"><span>Idioma da área do cliente</span><div class="seg" style="align-self:flex-start;flex-wrap:wrap">${LANGS.map(([k, l]) => html`<button type="button" key=${k} class=${cx(f.lang === k && 'on')} onClick=${() => setF({ ...f, lang: k })}>${l}</button>`)}</div>
        <p class="muted" style="font-size:12px">É o idioma padrão do painel do cliente. Cada pessoa do cliente pode trocar. O time continua em português.</p></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <label class="field"><span>Contato no cliente</span><input class="inp" id="nc-contact" placeholder="Nome de quem aprova" value=${f.contact} onInput=${e => setF({ ...f, contact: e.target.value })} /></label>
        <label class="field"><span>Responsável na M&O</span><${PersonSel} id="nc-owner" value=${f.owner} onChange=${v => setF({ ...f, owner: v })} /></label>
      </div>
      <p class="muted" style="font-size:12px">O que a empresa faz, os objetivos, as limitações e o que ela precisa da M&O ficam na aba Sobre, depois de criar.</p>
    </div>
    <div class="mft"><button type="button" class="btn ghost" onClick=${close}>Cancelar</button><button class="btn pri" type="submit" disabled=${!ok || !!busy}>Criar área do cliente</button></div>
  </form>`;
}

/* ---------- aba Sobre: a bio do cliente, só do time ---------- */
const NEEDS = [['social', 'Social media'], ['trafego', 'Tráfego pago'], ['criativo', 'Criativo e vídeo'], ['pagina', 'Página ou site'], ['vendas', 'Processo de vendas'], ['agente', 'Agente de IA']];
const MO_ABOUT = {
  desc: 'Consultoria de growth para negócio de dono, nos mercados americano e europeu. Cobre o que uma agência de marketing cobre, mais vendas e implementação de IA. O produto é o Funil de Qualificação Imediata: interceptar o lead no pico de intenção, qualificar na hora e fechar a janela antes de ela decair.',
  niche: 'Growth para negócio de dono, nos EUA e na Europa',
  needs: ['social', 'trafego', 'criativo', 'pagina', 'vendas', 'agente'], other: '',
  goals: ['Fechar o primeiro cliente e medir o resultado dele, que é o que libera usar caso nas peças', 'Encher a agenda pela campanha do quiz, medindo o custo por reunião agendada', 'Publicar com constância no @m.o.com.pany, em inglês'],
  limits: ['Zero clientes até agora: nenhuma peça mostra caso, número de resultado ou depoimento', 'As faixas de preço têm estrutura, mas ainda não têm os três números', 'O ICP tem duas réguas que não batem (a da oferta e a do agente) e espera a decisão do Pedro', 'Pedro e Bruno fazem um pouco de tudo'],
  notes: 'Tudo que é público sai em inglês; briefing, documento interno e conversa ficam em português. A M&O é uma agência de brasileiros, e o cliente pode ser de qualquer lugar: nenhuma peça fala como se o serviço fosse para brasileiros. Preço nunca aparece antes da demo.',
};
function AboutList({ items, onChange, label, add }) {
  const [v, setV] = useState('');
  const put = (i, val) => { const L = [...items]; if (val) L[i] = val; else L.splice(i, 1); onChange(L); };
  return html`<div class="ab-list">
    ${items.map((it, i) => html`<div class="ab-item" key=${i + ':' + it}><span class="ab-dot" aria-hidden="true"></span><input class="inp ab-in" aria-label=${label + ' ' + (i + 1)} defaultValue=${it} onChange=${e => put(i, e.target.value.trim())} /><button class="btn sm icon ghost" aria-label=${'Tirar ' + label.toLowerCase()} title="Tirar" onClick=${() => put(i, '')}><${Icon} n="x" s=${13} /></button></div>`)}
    <form class="ab-item add" onSubmit=${e => { e.preventDefault(); if (!v.trim()) return; onChange([...items, v.trim()]); setV(''); }}><span class="ab-dot" aria-hidden="true"><${Icon} n="plus" s=${11} /></span><input class="inp ab-in" aria-label=${add} placeholder=${add + ' (Enter)'} value=${v} onInput=${e => setV(e.target.value)} /></form>
  </div>`;
}
function AboutTab({ c }) {
  const { db, act } = useApp(); const a = c.about || {}; const set = patch => act.setAbout(c.id, patch);
  const needs = a.needs || []; const tog = k => set({ needs: needs.includes(k) ? needs.filter(x => x !== k) : [...needs, k] });
  const T = (id, key, rows, ph) => html`<textarea class="ta" id=${id} key=${id + ':' + (a[key] || '')} rows=${rows} placeholder=${ph} defaultValue=${a[key] || ''} onChange=${e => set({ [key]: e.target.value.trim() })}></textarea>`;
  const ent = [...NEEDS.filter(([k]) => needs.includes(k)).map(([, l]) => l), ...(a.other ? [a.other] : [])];
  return html`<div class="about">
    <div class="ab-main">
      <p class="ab-lead"><${Icon} n="lock" s=${13} />Só o time vê esta aba. É o que alguém que acabou de chegar precisa ler para entender o cliente.</p>
      <section class="ab-sec"><h2>O que a empresa faz</h2>${T('ab-desc', 'desc', 4, 'Em duas ou três frases: o que ela vende, para quem e onde.')}</section>
      <section class="ab-sec"><h2>Nicho</h2><input class="inp" id="ab-niche" key=${'n:' + (a.niche || '')} placeholder="Ex.: telhados residenciais na Flórida" defaultValue=${a.niche || ''} onChange=${e => set({ niche: e.target.value.trim() })} /></section>
      <section class="ab-sec"><h2>O que ela precisa da M&O</h2>
        <div class="filter-chips">${NEEDS.map(([k, l]) => html`<button key=${k} class=${cx(needs.includes(k) && 'on')} aria-pressed=${needs.includes(k)} onClick=${() => tog(k)}>${l}</button>`)}</div>
        <input class="inp" id="ab-other" key=${'o:' + (a.other || '')} aria-label="Outra entrega" placeholder="Outra entrega, se tiver" defaultValue=${a.other || ''} onChange=${e => set({ other: e.target.value.trim() })} /></section>
      <section class="ab-sec"><h2>Objetivos</h2><${AboutList} items=${a.goals || []} onChange=${L => set({ goals: L })} label="Objetivo" add="Adicionar objetivo" /></section>
      <section class="ab-sec"><h2>Limitações de hoje</h2><${AboutList} items=${a.limits || []} onChange=${L => set({ limits: L })} label="Limitação" add="Adicionar limitação" /></section>
      <section class="ab-sec"><h2>Anotações</h2>${T('ab-notes', 'notes', 4, 'Tom, cuidados, o que já foi tentado, o que não pode acontecer.')}</section>
    </div>
    <aside class="card ab-side"><span class="label">Resumo</span>
      <dl class="ab-kv"><dt>Nicho</dt><dd>${a.niche || '—'}</dd><dt>Contato</dt><dd>${c.contact || '—'}</dd><dt>Responsável na M&O</dt><dd>${personName(db, c.owner)}</dd><dt>Painel do cliente</dt><dd>em ${LANG_PT[c.lang]}</dd><dt>Entregas</dt><dd>${ent.length ? ent.join(', ') : '—'}</dd></dl>
    </aside>
  </div>`;
}

/* ---------- o que o cliente vê da esteira ---------- */
const SEE_DEFAULT = new Set(['cliente', 'gravacao', 'edicao', 'aprov_edicao', 'publicado']);
const byClientTeam = (db, c, key) => { const o = ownerOf(c, key); return !!o && db.people.some(p => p.id === o && p.role === 'cliente'); };
function clientSees(db, c, key, kind) {
  const st = flowFor(c, kind).stages.find(s => s.key === key);
  if ((st && st.type === 'client') || byClientTeam(db, c, key)) return true;
  const m = c && c.flows && c.flows.see && c.flows.see[kind];
  return m && key in m ? !!m[key] : SEE_DEFAULT.has(key);
}
function clientCols(db, c, kind) {
  const cols = []; let run = null;
  flowFor(c, kind).stages.forEach(s => {
    if (clientSees(db, c, s.key, kind)) { run = null; cols.push({ key: s.key, keys: [s.key], type: s.type }); return; }
    if (!run) { run = { key: 'g:' + s.key, keys: [], type: 'group', busy: false }; cols.push(run); }
    run.keys.push(s.key); if (s.type === 'work') run.busy = true; if (s.type === 'review') run.rev = true;
  });
  return cols;
}
const GT = { pt: { prod: 'Em produção', rev: 'Em revisão', ok: 'Aprovado' }, en: { prod: 'In production', rev: 'In review', ok: 'Approved' }, es: { prod: 'En producción', rev: 'En revisión', ok: 'Aprobado' }, fr: { prod: 'En production', rev: 'En relecture', ok: 'Validé' } };
const colName = (lang, col) => col.type === 'group' ? (GT[lang] || GT.pt)[col.busy ? 'prod' : col.rev ? 'rev' : 'ok'] : stageT(lang, col.key);
const clientStageName = (db, c, kind, key, lang) => { const col = clientCols(db, c, kind).find(x => x.keys.includes(key)); return col ? colName(lang, col) : stageT(lang, key); };
function ClientFlowBar({ db, c, k, x, lang }) {
  const cols = clientCols(db, c, k); const ci = cols.findIndex(col => col.keys.includes(x.stage));
  return cols.map((col, i) => html`<span key=${col.key} role="listitem" class=${cx('fb-step', i < ci && 'done', i === ci && 'on', col.type === 'client' && 'cli')}>${i < ci ? html`<${Icon} n="check" s=${11} />` : null}${colName(lang, col)}</span>`);
}
function FlowSettings({ close, clientId }) {
  const { db, act } = useApp(); const c = db.clients.find(x => x.id === clientId);
  const [f, setF] = useState(() => structuredClone(c.flows || { post: 'enxuto', script: 'video', owners: {} }));
  const keys = [...new Set([...flowFor({ flows: f }, 'post').stages, ...FLOW_DEFS.video.stages].filter(s => ['work', 'review', 'task'].includes(s.type)).map(s => s.key))].sort((a, b) => STAGE_ORDER.indexOf(a) - STAGE_ORDER.indexOf(b));
  const draft = { ...c, flows: f };
  const flip = (kind, key, on) => setF({ ...f, see: { ...(f.see || {}), [kind]: { ...((f.see || {})[kind] || {}), [key]: !on } } });
  const SeeRow = kind => { const fl = flowFor(draft, kind); const cols = clientCols(db, draft, kind);
    return html`<div class="see-row"><span class="see-k">${kind === 'post' ? 'Posts' : 'Vídeos'}</span>
      <div class="see-chips">${fl.stages.map(s => { const lock = s.type === 'client' || byClientTeam(db, draft, s.key); const on = lock || clientSees(db, draft, s.key, kind);
        return html`<button type="button" key=${s.key} class=${cx('see-chip', on && 'on', lock && 'lock')} aria-pressed=${on} disabled=${lock} title=${lock ? (s.type === 'client' ? 'A aprovação aparece sempre para o cliente' : 'Esta etapa é de alguém da equipe do cliente, então ele vê') : on ? 'O cliente vê esta etapa. Clique para esconder.' : 'Escondida do cliente. Clique para mostrar.'} onClick=${() => flip(kind, s.key, on)}><${Icon} n=${on ? 'eye' : 'eyeOff'} s=${13} />${s.label}</button>`; })}</div>
      <p class="see-prev"><span class="muted">No painel dele:</span> ${[PX.pt.ideas, ...cols.map(col => colName('pt', col))].join(' → ')}</p></div>`; };
  return html`<form onSubmit=${e => { e.preventDefault(); act.setFlows(clientId, f); close(); }}>
    <div class="mhd"><div><h2>Fluxo de produção de ${c.name}</h2><p>Quando uma etapa termina, a tarefa da próxima nasce sozinha para o responsável dela.</p></div><button type="button" class="btn icon ghost" aria-label="Fechar" onClick=${close}><${Icon} n="x" /></button></div>
    <div class="mbd">
      <span class="label">Posts</span>
      <div class="tpls">${['enxuto', 'etapas'].map(id => html`<button type="button" key=${id} class=${cx('tpl', f.post === id && 'on')} aria-pressed=${f.post === id} onClick=${() => setF({ ...f, post: id })}><b>${FLOW_DEFS[id].name}</b><small>${FLOW_DEFS[id].desc}</small><span class="flow-mini">${FLOW_DEFS[id].stages.map(s => s.label).join(' → ')}</span></button>`)}</div>
      <span class="label">Vídeos</span><p class="muted" style="font-size:13px">${FLOW_DEFS.video.stages.map(s => s.label).join(' → ')}</p>
      <span class="label">Quem faz cada etapa</span>
      <div class="own-grid">${keys.map(k => html`<label class="field" key=${k}><span>${STAGE_NAME[k] || k}</span><select class="sel" id=${'own-' + k} value=${f.owners[k] || ''} onChange=${e => setF({ ...f, owners: { ...f.owners, [k]: e.target.value || null } })}><option value="">Sem responsável</option>${teamOf(db).map(p => html`<option key=${p.id} value=${p.id}>${p.name}</option>`)}${clientPeople(db, clientId).length > 0 && html`<optgroup label=${'Equipe de ' + c.name}>${clientPeople(db, clientId).map(p => html`<option key=${p.id} value=${p.id}>${p.name}${p.func ? ' (' + p.func + ')' : ''}</option>`)}</optgroup>`}</select></label>`)}</div>
      <span class="label">O que o cliente vê na produção</span>
      <p class="muted" style="font-size:13px">Etapa escondida sai do painel do cliente. As escondidas em sequência viram uma coluna só ("Em produção", "Em revisão" ou "Aprovado"), sem nome de etapa nem de quem está com a peça. A aprovação dele aparece sempre.</p>
      ${SeeRow('post')}${SeeRow('script')}
    </div>
    <div class="mft"><button type="button" class="btn ghost" onClick=${close}>Cancelar</button><button class="btn pri" type="submit">Salvar fluxo</button></div>
  </form>`;
}
function PortalBoard({ c, lang, who, openPiece }) {
  const { db, act } = useApp(); const P = PX[lang] || PX.pt;
  const [kind, setKind] = useState('post');
  const list = (kind === 'post' ? db.posts : db.scripts).filter(x => x.clientId === c.id);
  const cols = [{ key: null, keys: [null], type: 'idea' }, ...clientCols(db, c, kind)];
  const make = () => { const id = act.portalNew(kind, c.id, who ? who.id : null, kind === 'post' ? P.untitledPost : P.untitledScript, P.created); openPiece(kind, id); };
  return html`<div class="sec" style="gap:14px">
    <div class="pb-head"><div><h1 style="font-size:24px">${P.board}</h1><p class="muted" style="margin-top:6px">${P.boardSub}</p></div>
      <div class="pb-acts"><div class="seg"><button class=${cx(kind === 'post' && 'on')} onClick=${() => setKind('post')}>${P.posts}</button><button class=${cx(kind === 'script' && 'on')} onClick=${() => setKind('script')}>${P.videos}</button></div>
        <button class="btn pri" onClick=${make}><${Icon} n="plus" s=${14} />${kind === 'post' ? P.newPost : P.newScript}</button></div></div>
    <div class="est-board">${cols.map(col => { const items = list.filter(x => col.keys.includes(x.stage || null)); const grp = col.type === 'group'; const own = !grp && col.key && ownerOf(c, col.key);
      return html`<div key=${col.key || 'idea'} class=${cx('est-col', col.type === 'client' && 'cli', grp && 'grp')}>
      <div class="col-h"><b>${col.key ? colName(lang, col) : P.ideas}</b><span class="c">${items.length}</span>${own && col.type !== 'client' && col.type !== 'live' && html`<span class="hint" title=${personName(db, own)}><${Av} id=${own} /></span>`}</div>
      ${items.map(x => { const img = kind === 'post' && pieceCover(x); const t = openPieceTask(db, kind, x.id); const mine = who && t && t.assignee === who.id; return html`<button key=${x.id} class=${cx('pc-card', x.status === 'ajuste' && 'adj', mine && 'mine')} onClick=${() => openPiece(kind, x.id)}>
        ${img && html`<img src=${img} alt="" loading="lazy" />`}<span class="t">${x.title}</span>
        <span class="m">${mine && html`<span class="pill t-cli">${P.mine}</span>`}${!grp && t && t.due && html`<${Due} date=${t.due} />`}${!grp && (t ? t.assignee : null) && html`<${Av} id=${t.assignee} />`}</span></button>`; })}
    </div>`; })}</div>
  </div>`;
}

/* ---------- links que o cliente adiciona ---------- */
const LK = {
  pt: { add: 'Adicionar', name: 'Nome', url: 'Endereço', phName: 'Ex.: Pasta de fotos', yours: 'você adicionou', edit: 'Editar', del: 'Tirar', save: 'Salvar', cancel: 'Cancelar', added: 'Link adicionado. O time da M&O já vê.', saved: 'Link salvo', removed: 'Link tirado', note: a => `Os links que você adiciona aparecem na hora para o time da M&O, e você edita ou tira quando quiser. Para mudar um link da M&O, use "${a}".` },
  en: { add: 'Add', name: 'Name', url: 'Address', phName: 'e.g. Photo folder', yours: 'added by you', edit: 'Edit', del: 'Remove', save: 'Save', cancel: 'Cancel', added: 'Link added. The M&O team can see it now.', saved: 'Link saved', removed: 'Link removed', note: a => `Links you add show up for the M&O team right away, and you can edit or remove them anytime. To change an M&O link, use "${a}".` },
  es: { add: 'Añadir', name: 'Nombre', url: 'Dirección', phName: 'Ej.: Carpeta de fotos', yours: 'añadido por ti', edit: 'Editar', del: 'Quitar', save: 'Guardar', cancel: 'Cancelar', added: 'Enlace añadido. El equipo de M&O ya lo ve.', saved: 'Enlace guardado', removed: 'Enlace quitado', note: a => `Los enlaces que añades aparecen al momento para el equipo de M&O, y puedes editarlos o quitarlos cuando quieras. Para cambiar un enlace de M&O, usa "${a}".` },
  fr: { add: 'Ajouter', name: 'Nom', url: 'Adresse', phName: 'Ex. : Dossier photos', yours: 'ajouté par vous', edit: 'Modifier', del: 'Retirer', save: 'Enregistrer', cancel: 'Annuler', added: 'Lien ajouté. L’équipe M&O le voit déjà.', saved: 'Lien enregistré', removed: 'Lien retiré', note: a => `Les liens que vous ajoutez apparaissent tout de suite pour l’équipe M&O, et vous pouvez les modifier ou les retirer quand vous voulez. Pour changer un lien de M&O, utilisez « ${a} ».` },
};
const normUrl = u => /^https?:\/\//i.test(u) ? u : 'https://' + u;
function LinkCard({ l, onCopy, copied, onDel, onEdit, tag, lang = 'pt' }) {
  let host = l.url; try { host = new URL(l.url).hostname.replace('www.', ''); } catch (e) {}
  const t = TX[lang] || TX.pt; const L = LK[lang] || LK.pt;
  return html`<div class="lcard"><span class="fav">${(host[0] || '?').toUpperCase()}</span><span class="body"><div class="nm">${l.name}</div><div class="url">${host}</div>${tag ? html`<div class="lc-tag">${tag}</div>` : null}</span>
    <button class="btn sm icon ghost" aria-label=${copied ? t.copied : t.copy} title=${copied ? t.copied : t.copy} onClick=${onCopy}><${Icon} n=${copied ? 'check' : 'copy'} s=${14} /></button>
    <a class="btn sm icon ghost" href=${l.url} target="_blank" rel="noopener" aria-label=${t.open} title=${t.open}><${Icon} n="ext" s=${14} /></a>
    ${onEdit && html`<button class="btn sm icon ghost" aria-label=${L.edit} title=${L.edit} onClick=${onEdit}><${Icon} n="pen" s=${14} /></button>`}
    ${onDel && html`<button class="btn sm icon ghost" aria-label=${L.del} title=${L.del} onClick=${onDel}><${Icon} n="trash" s=${14} /></button>`}</div>`;
}
function PortalLinks({ c, lang }) {
  const { act } = useApp(); const t = TX[lang] || TX.pt; const L = LK[lang] || LK.pt; const R = RQ[lang] || RQ.pt;
  const [copied, setCopied] = useState(null); const [f, setF] = useState({ name: '', url: '' }); const [ed, setEd] = useState(null);
  const list = c.links.filter(l => l.shared);
  const add = e => { e.preventDefault(); if (!f.name.trim() || !f.url.trim()) return; act.portalLink(c.id, { name: f.name.trim(), url: normUrl(f.url.trim()) }, L.added); setF({ name: '', url: '' }); };
  const save = e => { e.preventDefault(); if (!ed.name.trim() || !ed.url.trim()) return; act.portalLinkEdit(c.id, ed.id, { name: ed.name.trim(), url: normUrl(ed.url.trim()) }, L.saved); setEd(null); };
  const cp = l => copyText(l.url, ok => { setCopied(ok ? l.id : null); setTimeout(() => setCopied(null), 1600); });
  return html`<div class="sec" style="gap:16px"><h1 style="font-size:24px">${t.sharedLinks}</h1>
    <form class="card lform pl-form" onSubmit=${add}>
      <label class="field"><span>${L.name}</span><input class="inp" id="pl-name" placeholder=${L.phName} value=${f.name} onInput=${e => setF({ ...f, name: e.target.value })} /></label>
      <label class="field"><span>${L.url}</span><input class="inp" id="pl-url" placeholder="https://" value=${f.url} onInput=${e => setF({ ...f, url: e.target.value })} /></label>
      <button class="btn pri" type="submit" style="height:36px"><${Icon} n="plus" />${L.add}</button></form>
    ${list.length ? html`<div class="lgrid">${list.map(l => ed && ed.id === l.id
      ? html`<form key=${l.id} class="lcard pl-edit" onSubmit=${save}><input class="inp" aria-label=${L.name} ref=${autoF} value=${ed.name} onInput=${e => setEd({ ...ed, name: e.target.value })} /><input class="inp" aria-label=${L.url} value=${ed.url} onInput=${e => setEd({ ...ed, url: e.target.value })} /><span class="pl-acts"><button type="button" class="btn sm ghost" onClick=${() => setEd(null)}>${L.cancel}</button><button class="btn sm pri" type="submit">${L.save}</button></span></form>`
      : html`<${LinkCard} key=${l.id} l=${l} lang=${lang} copied=${copied === l.id} onCopy=${() => cp(l)} tag=${l.fromClient ? L.yours : null} onEdit=${l.fromClient ? () => setEd({ id: l.id, name: l.name, url: l.url }) : null} onDel=${l.fromClient ? () => act.portalLinkDel(c.id, l.id, L.removed) : null} />`)}</div>` : html`<div class="card empty">${t.noLinks}</div>`}
    <p class="muted" style="font-size:12px">${L.note(R.ask)}</p></div>`;
}

/* ---------- caixa de entrada: aviso de link do cliente ---------- */
function Inbox() {
  const { db, me, act, open, go } = useApp();
  const [only, setOnly] = useState(false);
  const mine = db.notes.filter(n => n.to === me.id && (!only || !n.read));
  const refOf = n => n.k === 'link' ? { title: n.label || 'link', clientId: n.cid } : itemOf(db, n.k, n.ref);
  const hit = n => { act.readNote(n.id); if (n.k === 'link') go({ v: 'client', id: n.cid, tab: 'links' }); else open(n.k, n.ref); };
  return html`<div class="page">
    <${PageHead} title="Caixa de entrada" sub="Menções, aprovações e ajustes do que é seu.">
      <div class="seg"><button class=${cx(!only && 'on')} onClick=${() => setOnly(false)}>Todas</button><button class=${cx(only && 'on')} onClick=${() => setOnly(true)}>Não lidas</button></div>
      <button class="btn" onClick=${act.readAll}><${Icon} n="check" />Marcar tudo como lido</button>
    <//>
    <div class="list">${mine.length ? mine.map(n => { const x = refOf(n); if (!x) return null; return html`<button key=${n.id} class=${cx('note', n.read && 'read')} onClick=${() => hit(n)}>
      <span class="unread"></span><${ActorAv} id=${n.who} />
      <span class="txt"><b>${actorName(db, n.who)}</b> ${n.verb} <b>${x.title}</b><div class="row-meta" style="margin-top:4px"><${CChip} id=${x.clientId} /></div></span>
      <span class="when">${rel(n.at)}</span></button>`; }) : html`<div class="empty">Nenhuma notificação ${only ? 'não lida' : ''}.</div>`}</div>
  </div>`;
}

/* ---------- histórico de alterações ---------- */
const KW = { task: 'a tarefa', post: 'o post', script: 'o roteiro' };
const KD = { task: 'da tarefa', post: 'do post', script: 'do roteiro' };
const KN = { task: 'na tarefa', post: 'no post', script: 'no roteiro' };
const LI = (db, k, id, text, merge) => { const x = itemOf(db, k, id); return x ? { text, k, ref: id, label: x.title, clientId: x.clientId, merge } : null; };
const LC = (db, cid, text, merge, tab) => { const c = db.clients.find(x => x.id === cid); return c ? { text, k: 'client', ref: cid, tab, label: c.name, clientId: cid, merge } : null; };
const LP = (db, pid, text, merge) => { const p = db.pages.find(x => x.id === pid); return p ? { text, k: 'page', ref: pid, label: p.title || 'Sem título', clientId: p.clientId || null, merge } : null; };
const LB = (db, id, text, merge) => { const b = db.boards.find(x => x.id === id); return b ? { text, k: 'board', ref: id, label: b.title, clientId: b.clientId || null, merge } : null; };
const LF = (db, id, text, merge) => { const f = db.funnels.find(x => x.id === id); return f ? { text, k: 'funnel', ref: id, label: f.title, clientId: f.clientId || null, merge } : null; };
const stLbl = (db, k, id) => { const x = itemOf(db, k, id); if (!x || !x.stage) return 'ideias'; const c = db.clients.find(y => y.id === x.clientId); const s = flowFor(c, k).stages.find(y => y.key === x.stage); return (s ? s.label : x.stage).toLowerCase(); };
const fresh = (L0, L1) => L1.find(x => !L0.some(y => y.id === x.id));
const LOGD = {
  toggleDone: ([id], p, n) => { const t = n.tasks.find(x => x.id === id); return t && LI(n, 'task', id, t.status === 'done' ? 'concluiu a tarefa' : 'reabriu a tarefa'); },
  setTask: ([id, patch = {}], p, n) => LI(n, 'task', id,
    patch.status ? 'moveu para "' + stOf('task', patch.status)[1].toLowerCase() + '" a tarefa'
      : patch.assignee !== undefined ? 'passou para ' + (patch.assignee ? personName(n, patch.assignee) : 'ninguém') + ' a tarefa'
      : patch.due !== undefined ? 'mudou o prazo da tarefa' : patch.title ? 'renomeou a tarefa' : patch.priority ? 'mudou a prioridade da tarefa'
      : patch.checklist ? 'mexeu no checklist da tarefa' : patch.desc !== undefined ? 'editou a descrição da tarefa' : 'editou a tarefa', 'setTask:' + id + ':' + Object.keys(patch).join()),
  addTask: (a, p, n) => { const t = fresh(p.tasks, n.tasks); return t && LI(n, 'task', t.id, 'criou a tarefa'); },
  delTask: ([id], p) => { const t = p.tasks.find(x => x.id === id); return t && { text: 'apagou a tarefa', label: t.title, clientId: t.clientId }; },
  setItem: ([k, id, patch = {}], p, n) => LI(n, k, id,
    patch.liveUrl !== undefined ? 'salvou o link publicado ' + KD[k] : patch.title ? 'renomeou ' + KW[k] : patch.caption !== undefined ? 'editou a legenda ' + KD[k]
      : patch.format !== undefined ? 'mudou o formato ' + KD[k] : patch.date !== undefined ? 'mudou a data ' + KD[k] : patch.blocks ? 'editou o texto ' + KD[k] : 'editou ' + KW[k],
    'setItem:' + k + ':' + id + ':' + Object.keys(patch).join()),
  mutItem: ([k, id], p, n) => LI(n, k, id, 'mexeu na prévia ' + KD[k], 'mutItem:' + k + ':' + id),
  addPost: (a, p, n) => { const x = fresh(p.posts, n.posts); return x && LI(n, 'post', x.id, 'criou o post'); },
  addScript: (a, p, n) => { const x = fresh(p.scripts, n.scripts); return x && LI(n, 'script', x.id, 'criou o roteiro'); },
  comment: ([k, id], p, n) => LI(n, k, id, 'comentou ' + KN[k]),
  addClientPerson: ([cid, f], p, n) => LC(n, cid, 'convidou ' + f.name + ' para o painel de'),
  removeClientPerson: ([pid], p, n) => { const x = p.people.find(y => y.id === pid); return x && LC(n, x.clientId, 'tirou ' + x.name + ' do painel de'); },
  portalNew: ([k], p, n) => { const x = fresh(k === 'post' ? p.posts : p.scripts, k === 'post' ? n.posts : n.scripts); return x && LI(n, k, x.id, 'criou pelo painel do cliente ' + KW[k]); },
  portalAdvance: ([k, id], p, n) => LI(n, k, id, 'mandou para "' + stLbl(n, k, id) + '" ' + KW[k]),
  decide: ([k, id, ok], p, n) => LI(n, k, id, ok ? 'aprovou ' + KW[k] : 'pediu ajuste ' + KN[k]),
  createClient: (a, p, n) => { const c = fresh(p.clients, n.clients); return c && LC(n, c.id, 'criou o cliente'); },
  toggleOnb: ([cid, i], p, n) => { const c = n.clients.find(x => x.id === cid); const o = c && c.onboarding[i]; return o && LC(n, cid, (o.done ? 'marcou' : 'desmarcou') + ' "' + o.t + '" no onboarding de'); },
  setBlock: ([pid], p, n) => LP(n, pid, 'editou a página', 'page:' + pid),
  setPageTitle: ([pid], p, n) => LP(n, pid, 'renomeou a página', 'page:' + pid),
  addBlock: ([pid], p, n) => LP(n, pid, 'editou a página', 'page:' + pid),
  addPage: (a, p, n) => { const x = fresh(p.pages, n.pages); return x && LP(n, x.id, 'criou a página'); },
  addLink: ([cid, l], p, n) => LC(n, cid, 'adicionou o link "' + l.name + '" em', null, 'links'),
  delLink: ([cid, lid], p, n) => { const c = p.clients.find(x => x.id === cid); const l = c && c.links.find(x => x.id === lid); return l && LC(n, cid, 'removeu o link "' + l.name + '" de', null, 'links'); },
  portalLink: ([cid, l], p, n) => LC(n, cid, 'adicionou pelo painel o link "' + l.name + '" em', null, 'links'),
  portalLinkEdit: ([cid, lid], p, n) => { const c = n.clients.find(x => x.id === cid); const l = c && c.links.find(x => x.id === lid); return l && LC(n, cid, 'editou pelo painel o link "' + l.name + '" de', 'plink:' + lid, 'links'); },
  portalLinkDel: ([cid, lid], p, n) => { const c = p.clients.find(x => x.id === cid); const l = c && c.links.find(x => x.id === lid); return l && LC(n, cid, 'tirou pelo painel o link "' + l.name + '" de', null, 'links'); },
  invitePerson: ([f]) => ({ text: 'convidou ' + f.name + ' para o time' }),
  setRole: ([id, role], p, n) => ({ text: 'mudou o nível de acesso de ' + personName(n, id) + ' para ' + (role === 'socio' ? 'sócio' : 'colaborador') }),
  saveBoard: ([id], p, n) => LB(n, id, 'mexeu no quadro', 'board:' + id),
  renameBoard: ([id], p, n) => LB(n, id, 'renomeou o quadro', 'board:' + id),
  addBoard: (a, p, n) => { const b = fresh(p.boards, n.boards); return b && LB(n, b.id, 'criou o quadro'); },
  setFunnel: ([id], p, n) => LF(n, id, 'mexeu no funil', 'funnel:' + id),
  addFunnel: (a, p, n) => { const f = fresh(p.funnels, n.funnels); return f && LF(n, f.id, 'criou o funil'); },
  setMeetingNote: ([key, note]) => ({ text: 'editou a ata da reunião', label: note && note.title, clientId: (note && note.clientId) || null, merge: 'ata:' + key }),
  linkMeeting: ([key, cid], p, n) => LC(n, cid, 'ligou uma reunião a'),
  createTasksFromMeeting: ([key, list]) => ({ text: 'criou ' + plural(list.length, 'tarefa', 'tarefas') + ' a partir da ata de uma reunião' }),
  toggleAuto: ([id], p, n) => ({ text: (n.automations[id] ? 'ligou' : 'desligou') + ' uma automação' }),
  advance: ([k, id], p, n) => LI(n, k, id, 'mandou para "' + stLbl(n, k, id) + '" ' + KW[k]),
  sendBack: ([k, id], p, n) => LI(n, k, id, 'devolveu para ajuste ' + KW[k]),
  jumpStage: ([k, id], p, n) => LI(n, k, id, 'moveu para "' + stLbl(n, k, id) + '" ' + KW[k]),
  setFlows: ([cid], p, n) => LC(n, cid, 'mudou o fluxo de produção de'),
  shareAta: ([key, shared, m]) => ({ text: shared ? 'publicou no painel do cliente a ata' : 'tirou do painel do cliente a ata', label: m && m.title, clientId: (m && m.clientId) || null }),
  setBrand: ([cid], p, n) => LC(n, cid, 'mudou a marca de', 'brand:' + cid, 'brand'),
  setClient: ([cid, patch = {}], p, n) => LC(n, cid, patch.lang ? 'mudou o idioma do painel de' : 'editou os dados de', 'client:' + cid),
  clientRequest: ([cid, title], p, n) => { const t = fresh(p.tasks, n.tasks); return t ? LI(n, 'task', t.id, 'fez o pedido') : { text: 'fez o pedido', label: title, clientId: cid }; },
  setAbout: ([cid], p, n) => LC(n, cid, 'editou a aba Sobre de', 'about:' + cid, 'about'),
};
function seedLog(db) {
  const L = []; let i = 0; const at = (day, h, m) => { const d = pd(day); d.setHours(h, m, 0, 0); return d.getTime(); };
  const add = (by, day, e) => { if (!by || !day || diff(day) < -30 || diff(day) > 0) return; i++; L.push({ id: 'hs' + i, by, at: Math.min(at(day, 9 + (i * 5) % 9, (i * 17) % 60), Date.now() - i * 11 * 60000), ...e }); };
  db.tasks.forEach(t => {
    const base = { k: 'task', ref: t.id, label: t.title, clientId: t.clientId };
    if (t.status !== 'todo' && t.assignee) add(t.assignee, t.since, { ...base, text: t.status === 'done' ? 'concluiu a tarefa' : 'moveu para "' + stOf('task', t.status)[1].toLowerCase() + '" a tarefa' });
    (t.comments || []).forEach(cm => add(cm.by, cm.at, { ...base, text: 'comentou na tarefa' }));
  });
  db.posts.filter(x => x.status === 'publicado' && x.date).forEach(x => add(x.assignee, x.date, { k: 'post', ref: x.id, label: x.title, clientId: x.clientId, text: 'marcou como publicado o post' }));
  return L.sort((a, b) => b.at - a.at);
}
function History({ cid }) {
  const { db, log, can, go, open } = useApp();
  const [who, setWho] = useState(''); const [cl, setCl] = useState(cid || ''); const [per, setPer] = useState('30'); const [q, setQ] = useState('');
  if (!can('log.view')) return html`<div class="page"><${PageHead} title="Histórico" /><div class="card empty">Só os sócios veem o histórico.</div></div>`;
  const now = Date.now(); const d0 = new Date(); d0.setHours(0, 0, 0, 0);
  const since = per === 'today' ? d0.getTime() : per === '7' ? now - 7 * 864e5 : per === '30' ? now - 30 * 864e5 : 0;
  const ql = q.trim().toLowerCase();
  const rows = log.filter(e => (!who || (who === '@clients' ? isClientActor(db, e.by) : e.by === who)) && (!cl || e.clientId === cl) && e.at >= since && (!ql || [actorName(db, e.by), e.text, e.label || ''].join(' ').toLowerCase().includes(ql)));
  const actors = [...new Set(log.map(e => e.by).filter(Boolean))];
  const team = actors.filter(a => !isClientActor(db, a)); const cli = actors.filter(a => isClientActor(db, a));
  const days = []; rows.forEach(e => { const k = new Date(e.at).toDateString(); let g = days[days.length - 1]; if (!g || g.k !== k) days.push(g = { k, at: e.at, list: [] }); g.list.push(e); });
  const dayName = t => { const d = new Date(t); const n = Math.round((new Date(t).setHours(0, 0, 0, 0) - d0.getTime()) / 864e5); if (n === 0) return 'Hoje'; if (n === -1) return 'Ontem'; const s = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }); return s[0].toUpperCase() + s.slice(1); };
  const hm = t => new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const goTo = e => {
    if (e.k === 'task' || e.k === 'post' || e.k === 'script') return itemOf(db, e.k, e.ref) ? () => open(e.k, e.ref) : null;
    if (e.k === 'client') return db.clients.some(c => c.id === e.ref) ? () => go({ v: 'client', id: e.ref, tab: e.tab || 'overview' }) : null;
    if (e.k === 'page') { const pg = db.pages.find(x => x.id === e.ref); return pg ? () => (pg.clientId ? go({ v: 'client', id: pg.clientId, tab: 'process', pid: pg.id }) : go({ v: 'wiki', pid: pg.id })) : null; }
    if (e.k === 'board') return db.boards.some(b => b.id === e.ref) ? () => go({ v: 'board', id: e.ref }) : null;
    if (e.k === 'funnel') return db.funnels.some(f => f.id === e.ref) ? () => go({ v: 'funnel', id: e.ref }) : null;
    return null; };
  return html`<div class="page">
    <${PageHead} title="Histórico" sub="Tudo o que cada pessoa mudou, do time e dos clientes. Não gera notificação: fica aqui para quando você precisar conferir." />
    <div class="toolbar hist-f">
      <label class="sr" for="h-who">Pessoa</label><select class="sel" id="h-who" value=${who} onChange=${e => setWho(e.target.value)}><option value="">Todas as pessoas</option><optgroup label="Time">${team.map(a => html`<option key=${a} value=${a}>${actorName(db, a)}</option>`)}</optgroup>${cli.length > 0 && html`<optgroup label="Clientes"><option value="@clients">Qualquer pessoa de cliente</option>${cli.map(a => html`<option key=${a} value=${a}>${actorName(db, a)}</option>`)}</optgroup>`}</select>
      <label class="sr" for="h-cl">Cliente</label><select class="sel" id="h-cl" value=${cl} onChange=${e => setCl(e.target.value)}><option value="">Todos os clientes</option>${db.clients.map(c => html`<option key=${c.id} value=${c.id}>${c.name}</option>`)}</select>
      <div class="seg">${[['today', 'Hoje'], ['7', '7 dias'], ['30', '30 dias'], ['all', 'Tudo']].map(([k, l]) => html`<button key=${k} class=${cx(per === k && 'on')} aria-pressed=${per === k} onClick=${() => setPer(k)}>${l}</button>`)}</div>
      <input class="inp hist-q" type="search" placeholder="Buscar no histórico" aria-label="Buscar no histórico" value=${q} onInput=${e => setQ(e.target.value)} />
    </div>
    ${days.length ? days.map(g => html`<section class="sec" key=${g.k}><div class="sec-h"><h2 class="hist-day">${dayName(g.at)}</h2><span class="c">${g.list.length}</span></div>
      <div class="list">${g.list.map(e => { const fn = goTo(e); const ca = isClientActor(db, e.by); const Tg = fn ? 'button' : 'div';
        return html`<${Tg} key=${e.id} class=${cx('hist-row', ca && 'cli', fn && 'go')} onClick=${fn}>
          <${ActorAv} id=${e.by} /><span class="hist-t"><b>${actorName(db, e.by)}</b>${ca ? html` <span class="tag">CLIENTE</span>` : null}${e.via === 'preview' ? html` <span class="tag">NA PRÉVIA DO CLIENTE</span>` : null} ${e.text}${e.label ? html` <b>${e.label}</b>` : null}${e.n > 1 ? html` <span class="muted">(${e.n} alterações seguidas)</span>` : null}
            ${e.clientId && e.k !== 'client' && html`<span class="row-meta" style="margin-top:3px;display:flex"><${CChip} id=${e.clientId} /></span>`}</span>
          <span class="when">${hm(e.at)}</span><//>`; })}</div></section>`) : html`<div class="card empty">Nada no histórico com esses filtros.</div>`}
    <p class="muted" style="font-size:12px">No produto, o histórico fica guardado no servidor e ninguém apaga, nem os sócios. No protótipo, ele começa com exemplos montados a partir dos dados de teste e volta ao início quando a página recarrega.</p>
  </div>`;
}

/* ---------- o ícone do cliente aparece também no lado do time ---------- */
function CMark({ c, lg }) {
  if (c.id === 'mo') return html`<span class=${cx('cmark', lg && 'lg')} dangerouslySetInnerHTML=${{ __html: ICON }}></span>`;
  const b = c.brand || {}; const src = b.icon || (b.logo && b.logoRatio >= .6 && b.logoRatio <= 1.7 ? b.logo : null);
  if (src) return html`<span class=${cx('cmark img', lg && 'lg', b.icon && 'fill')}><img src=${src} alt="" /></span>`;
  const bg = isHex(b.primary) ? b.primary : null;
  return html`<span class=${cx('cmark', lg && 'lg')} style=${bg ? { background: bg, color: onColor(bg) } : null}>${initials(c.name)}</span>`;
}
