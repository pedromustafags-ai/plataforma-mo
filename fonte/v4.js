/* ================= v4: esteira de produção ================= */
const SO = a => ({ key: a[0], label: a[1], type: a[2], st: a[3], days: a[4] });
const FLOW_DEFS = {
  enxuto: { name: 'Enxuto', kind: 'post', desc: 'Estratégia, copy e design, com uma aprovação interna antes do cliente.', stages: [
    ['estrategia', 'Estratégia', 'work', 'producao', 1], ['copy', 'Copy', 'work', 'producao', 2], ['design', 'Design', 'work', 'producao', 2], ['interna', 'Aprovação interna', 'review', 'revisao', 1],
    ['cliente', 'Aprovação do cliente', 'client', 'cliente', 3], ['agendar', 'Agendar', 'task', 'aprovado', 1], ['publicar', 'Publicar', 'task', 'agendado', 0], ['publicado', 'Publicado', 'live', 'publicado', 0]].map(SO) },
  etapas: { name: 'Aprovação por etapa', kind: 'post', desc: 'Cada entrega é aprovada antes de a próxima começar.', stages: [
    ['estrategia', 'Estratégia', 'work', 'producao', 1], ['aprov_estrategia', 'Aprovar estratégia', 'review', 'revisao', 1], ['copy', 'Copy', 'work', 'producao', 2], ['aprov_copy', 'Aprovar copy', 'review', 'revisao', 1],
    ['design', 'Design', 'work', 'producao', 2], ['aprov_design', 'Aprovar design', 'review', 'revisao', 1], ['cliente', 'Aprovação do cliente', 'client', 'cliente', 3], ['agendar', 'Agendar', 'task', 'aprovado', 1], ['publicar', 'Publicar', 'task', 'agendado', 0], ['publicado', 'Publicado', 'live', 'publicado', 0]].map(SO) },
  video: { name: 'Vídeo', kind: 'script', desc: 'Roteiro aprovado vira gravação e edição.', stages: [
    ['estrategia', 'Estratégia', 'work', 'rascunho', 1], ['roteiro', 'Roteiro', 'work', 'rascunho', 2], ['interna', 'Aprovação interna', 'review', 'revisao', 1], ['cliente', 'Aprovação do cliente', 'client', 'cliente', 3],
    ['gravacao', 'Gravação', 'task', 'aprovado', 3], ['edicao', 'Edição', 'work', 'gravado', 3], ['aprov_edicao', 'Aprovar edição', 'review', 'editado', 1], ['publicado', 'No ar', 'live', 'noar', 0]].map(SO) },
};
const STAGE_ORDER = ['estrategia', 'aprov_estrategia', 'copy', 'aprov_copy', 'design', 'aprov_design', 'roteiro', 'interna', 'cliente', 'agendar', 'gravacao', 'edicao', 'aprov_edicao', 'publicar', 'publicado'];
const STAGE_NAME = { estrategia: 'Estratégia', aprov_estrategia: 'Aprovar estratégia', copy: 'Copy', aprov_copy: 'Aprovar copy', design: 'Design', aprov_design: 'Aprovar design', roteiro: 'Roteiro', interna: 'Aprovação interna', agendar: 'Agendar', gravacao: 'Gravação', edicao: 'Edição', aprov_edicao: 'Aprovar edição', publicar: 'Publicar' };
function flowFor(c, kind) { const f = (c && c.flows) || {}; return FLOW_DEFS[kind === 'script' ? (f.script || 'video') : (f.post || 'enxuto')]; }
const ownerOf = (c, key) => (c && c.flows && c.flows.owners && c.flows.owners[key]) || null;
const nextOf = (fl, key) => { if (!key) return fl.stages[0]; const i = fl.stages.findIndex(s => s.key === key); return i < 0 ? fl.stages[0] : fl.stages[i + 1] || null; };
const prevWorkOf = (fl, key) => { const i = fl.stages.findIndex(s => s.key === key); for (let j = i - 1; j >= 0; j--) if (fl.stages[j].type === 'work') return fl.stages[j]; return fl.stages[0]; };
function stageTaskOn(d, c, kind, x, st, note, changeReq) {
  if (!st || !['work', 'review', 'task'].includes(st.type)) return;
  const due = st.key === 'publicar' && x.date ? x.date : st.key === 'gravacao' && x.record ? x.record : off(st.days || 1);
  d.tasks.unshift({ id: uid('t'), clientId: x.clientId, title: `${note || st.label}: ${x.title}`, desc: '', type: 'interna', priority: 'media', checklist: [], comments: [], changeReq: !!changeReq, status: 'todo', due, since: off(0), assignee: ownerOf(c, st.key), piece: { k: kind, id: x.id, stage: st.key } });
}
function closePieceTasks(d, kind, id) { d.tasks.forEach(t => { if (t.piece && t.piece.k === kind && t.piece.id === id && t.status !== 'done') { t.status = 'done'; t.since = off(0); } }); }
function moveTo(d, kind, x, key, o = {}) {
  const c = d.clients.find(y => y.id === x.clientId); const fl = flowFor(c, kind); const st = key && fl.stages.find(s => s.key === key);
  closePieceTasks(d, kind, x.id);
  if (!st) { x.stage = null; x.status = kind === 'post' ? 'ideia' : 'rascunho'; x.since = off(0); return; }
  x.stage = key; x.since = off(0); x.status = o.status || st.st; const own = ownerOf(c, key); if (own) x.assignee = own;
  if (st.type === 'client') x.sentAt = off(0);
  stageTaskOn(d, c, kind, x, st, o.note, o.changeReq);
}
const openPieceTask = (db, kind, id) => db.tasks.find(t => t.piece && t.piece.k === kind && t.piece.id === id && t.status !== 'done');
function withFlows(db) {
  const c = db.clients.find(x => x.id === 'mo');
  c.flows = { post: 'enxuto', script: 'video', owners: Object.fromEntries(STAGE_ORDER.map(k => [k, 'pedro'])) };
  c.drive = 'https://drive.google.com/drive/folders/1V1ytqvxIwcG-6djsfGE6uUlx_aZCelHq';
  c.docs = [];
  c.lists = [{ id: 'ls1', title: 'O que falta decidir', items: [{ t: 'Assinar o MVV (o post está escrito e espera a assinatura)', done: false }, { t: 'Definir os três números das faixas de preço', done: false }, { t: 'Escolher o CTA padrão do último slide dos carrosséis', done: false }] }];
  const PM = { ideia: null, producao: 'design', revisao: 'interna', cliente: 'cliente', ajuste: 'design', aprovado: 'agendar', agendado: 'publicar', publicado: 'publicado' };
  const SM = { rascunho: 'roteiro', revisao: 'interna', cliente: 'cliente', ajuste: 'roteiro', aprovado: 'gravacao', gravado: 'edicao', editado: 'aprov_edicao', noar: 'publicado' };
  [['post', db.posts, PM], ['script', db.scripts, SM]].forEach(([kind, list, M]) => list.forEach(x => {
    x.media = x.media || []; const key = M[x.status] || null; x.stage = key; if (!key) return;
    const st = flowFor(c, kind).stages.find(s => s.key === key); stageTaskOn(db, c, kind, x, st, x.status === 'ajuste' ? 'Ajuste do cliente' : null, x.status === 'ajuste');
  }));
  const m2 = db.meetings.find(m => m.key === 'ex:m2');
  db.meetingNotes['ex:m2'] = { example: true, at: off(-1), created: 0, shared: true, title: m2.title, start: m2.start,
    resumo: 'Os três criativos do quiz estão no ar há dois dias, e o do tempo de resposta é o que mais puxa clique. A decisão foi esperar a semana fechar antes de mexer, e medir a campanha por custo por reunião agendada.',
    decisoes: ['Esperar a semana fechar antes de trocar criativo', 'O relatório mede custo por reunião agendada, e não custo por lead'],
    tarefas: [{ titulo: 'Marcar no CRM quando o agente agendar a reunião', responsavel: 'Felipe', prazo: 2 }, { titulo: 'Rever os números do quiz na segunda', responsavel: 'Pedro Mustafa', prazo: 3 }],
    email: 'Oi! Resumo do alinhamento de ontem: os criativos seguem no ar até a semana fechar, e a partir de agora medimos a campanha por custo por reunião agendada. Na segunda revemos os números juntos.',
    cliente: { lang: 'pt', resumo: 'Os anúncios do quiz estão no ar há dois dias. Vamos esperar a semana fechar antes de mudar qualquer criativo, e a partir de agora a campanha é medida pelo custo de cada reunião agendada.', decisoes: ['Os criativos seguem no ar até o fim da semana', 'A campanha passa a ser medida por custo por reunião agendada'], proximos: [{ quem: 'M&O', o: 'Conectar o agendamento ao CRM para medir as reuniões' }, { quem: 'M&O', o: 'Rever os números na segunda-feira' }] } };
  return db;
}

/* ================= v4: prévia de link e de arquivo ================= */
const gthumb = id => `https://drive.google.com/thumbnail?id=${id}&sz=w640`;
function linkInfo(url) {
  const u = String(url || '').trim(); let host = ''; try { host = new URL(u).hostname.replace(/^www\./, ''); } catch (e) {}
  let m;
  if ((m = u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/))) return { k: 'youtube', label: 'YouTube', host, thumb: `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`, video: true };
  if ((m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/))) return { k: 'vimeo', label: 'Vimeo', host, video: true };
  if ((m = u.match(/docs\.google\.com\/document\/d\/([\w-]+)/))) return { k: 'gdoc', label: 'Google Docs', host, thumb: gthumb(m[1]), tone: '#2A6BDB' };
  if ((m = u.match(/docs\.google\.com\/spreadsheets\/d\/([\w-]+)/))) return { k: 'gsheet', label: 'Google Sheets', host, thumb: gthumb(m[1]), tone: '#1E8E4E' };
  if ((m = u.match(/docs\.google\.com\/presentation\/d\/([\w-]+)/))) return { k: 'gslide', label: 'Google Slides', host, thumb: gthumb(m[1]), tone: '#C98A10' };
  if ((m = u.match(/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([\w-]+)/))) return { k: 'gfolder', label: 'Pasta do Drive', host, tone: '#5F6368', folder: m[1] };
  if ((m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/))) return { k: 'gfile', label: 'Arquivo do Drive', host, thumb: gthumb(m[1]), tone: '#5F6368' };
  if (/^data:image\//.test(u) || /\.(png|jpe?g|gif|webp|svg)(\?|#|$)/i.test(u)) return { k: 'image', label: 'Imagem', host: host || 'arquivo' };
  if (/^data:video\//.test(u) || /^blob:/.test(u) || /\.(mp4|mov|webm|m4v)(\?|#|$)/i.test(u)) return { k: 'video', label: 'Vídeo', host: host || 'arquivo', video: true };
  if (/^data:application\/pdf/.test(u) || /\.pdf(\?|#|$)/i.test(u)) return { k: 'pdf', label: 'PDF', host: host || 'arquivo', tone: '#B3261E' };
  if (/figma\.com$/.test(host)) return { k: 'figma', label: 'Figma', host, tone: '#7B4BD6' };
  if (/canva\.com$/.test(host)) return { k: 'canva', label: 'Canva', host, tone: '#1A9BB8' };
  if (/instagram\.com$/.test(host)) return { k: 'instagram', label: 'Instagram', host, tone: '#B1306E' };
  return { k: 'web', label: host || 'Link', host };
}
const niceName = (url, name) => name || (!['web', 'image', 'video', 'pdf'].includes(linkInfo(url).k) ? '' : (() => { try { const p = decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).pop() || ''); return p.length > 3 && p.length < 60 && !/^(edit|view|preview|watch|share)$/i.test(p) ? p : ''; } catch (e) { return ''; } })()) || linkInfo(url).label;
function LinkPreview({ url, name, compact, onRemove, lang = 'pt' }) {
  const i = linkInfo(url); const [bad, setBad] = useState(false); const title = niceName(url, name); const open = (TX[lang] || TX.pt).open;
  const ext = /^(data:|blob:)/.test(url) ? null : url;
  const Tile = html`<span class="lp-tile" style=${i.tone ? { background: i.tone } : null}><${Icon} n=${i.video ? 'play' : i.k === 'image' ? 'image' : i.k === 'gfolder' ? 'book' : 'file'} s=${compact ? 14 : 18} /></span>`;
  if (compact) return html`<div class="lp-row">${Tile}<span class="lp-t"><b>${title}</b><small>${i.label}${i.host && i.host !== i.label ? ' · ' + i.host : ''}</small></span>
    ${ext && html`<a class="btn sm icon ghost" href=${ext} target="_blank" rel="noopener" aria-label=${open} title=${open}><${Icon} n="ext" s=${14} /></a>`}
    ${onRemove && html`<button class="btn sm icon ghost" aria-label="Remover" onClick=${onRemove}><${Icon} n="x" s=${14} /></button>`}</div>`;
  let media = null;
  if (i.k === 'image' && !bad) media = html`<img class="lp-img" src=${url} alt=${title} onError=${() => setBad(true)} />`;
  else if (i.k === 'video' && !bad) media = html`<video class="lp-img" src=${url} controls preload="metadata" playsinline onError=${() => setBad(true)}></video>`;
  else if (i.video) media = html`<div class="lp-vid">${i.thumb && !bad && html`<img src=${i.thumb} alt="" onError=${() => setBad(true)} />`}<span class="lp-play"><${Icon} n="play" s=${22} /></span><span class="lp-badge">${i.label}</span></div>`;
  else if (i.thumb && !bad) media = html`<div class="lp-doc" style=${{ '--tone': i.tone }}><img src=${i.thumb} alt="" onError=${() => setBad(true)} /><span class="lp-badge">${i.label}</span></div>`;
  else media = html`<div class="lp-doc empty" style=${{ '--tone': i.tone || 'var(--text-3)' }}>${Tile}<span>${i.label}</span></div>`;
  return html`<div class="lp">${media}<div class="lp-foot"><span class="lp-t"><b>${title}</b><small>${i.label}${i.host && i.host !== i.label ? ' · ' + i.host : ''}</small></span>
    ${ext && html`<a class="btn sm" href=${ext} target="_blank" rel="noopener"><${Icon} n="ext" s=${13} />${open}</a>`}
    ${onRemove && html`<button class="btn sm icon ghost" aria-label="Remover" onClick=${onRemove}><${Icon} n="trash" s=${14} /></button>`}</div></div>`;
}
async function fileToUrl(f) {
  if (/^video\//.test(f.type)) return URL.createObjectURL(f);
  if (/^image\//.test(f.type) && !/svg/.test(f.type)) { const url = URL.createObjectURL(f); try { const img = await loadImg(url); const k = Math.min(1, 1400 / Math.max(img.naturalWidth, img.naturalHeight)); const cv = document.createElement('canvas'); cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k); cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height); return cv.toDataURL('image/jpeg', .85); } finally { URL.revokeObjectURL(url); } }
  return await new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = no; r.readAsDataURL(f); });
}
function AddLink({ onAdd, label = 'Adicionar' }) {
  const [v, setV] = useState('');
  const add = e => { e && e.preventDefault(); const u = v.trim(); if (!u) return; onAdd({ url: /^(https?:|data:|blob:)/.test(u) ? u : 'https://' + u }); setV(''); };
  return html`<form class="addlink" onSubmit=${add}><label class="sr" for=${'al-' + label}>Link</label><input class="inp" id=${'al-' + label} placeholder="Cole um link: YouTube, Google Docs, Drive, PNG, Figma…" value=${v} onInput=${e => setV(e.target.value)} />
    <button class="btn" type="submit" disabled=${!v.trim()}>${label}</button>
    <label class="btn" title="Enviar arquivo"><${Icon} n="plus" s=${14} />Arquivo<input type="file" class="sr" accept="image/*,video/*,application/pdf" onChange=${async e => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return; onAdd({ url: await fileToUrl(f), name: f.name }); }} /></label></form>`;
}
function MediaSection({ k, x, readOnly, lang }) {
  const { act } = useApp(); const list = x.media || [];
  if (readOnly && !list.length) return null;
  return html`<section class="sec" style="gap:10px"><div class="sec-h" style="padding:0"><h2>Arquivos e links da peça</h2><span class="c">${list.length}</span></div>
    ${list.length > 0 && html`<div class="lp-grid">${list.map((m, i) => html`<${LinkPreview} key=${m.id || i} url=${m.url} name=${m.name} lang=${lang} onRemove=${readOnly ? null : () => act.setItem(k, x.id, { media: list.filter((_, j) => j !== i) })} />`)}</div>`}
    ${!readOnly && html`<${AddLink} onAdd=${m => act.setItem(k, x.id, { media: [...list, { id: uid('m'), ...m }] }, 'Adicionado à peça')} />`}
    ${!readOnly && html`<p class="muted" style="font-size:12px">No protótipo, vídeo do YouTube e arquivo do Drive aparecem como cartão, porque a página não pode carregar conteúdo de outro site. No produto, a prévia mostra o vídeo e a imagem.</p>`}
  </section>`;
}

/* ================= v4: barra da esteira na peça ================= */
function FlowBar({ k, x }) {
  const { db, act, setModal, open } = useApp();
  const c = db.clients.find(y => y.id === x.clientId); const fl = flowFor(c, k); const idx = fl.stages.findIndex(s => s.key === x.stage); const st = fl.stages[idx];
  const nx = nextOf(fl, x.stage); const task = openPieceTask(db, k, x.id);
  const [back, setBack] = useState(false); const [why, setWhy] = useState('');
  const own = st && ownerOf(c, st.key); const nOwn = nx && ownerOf(c, nx.key);
  const who = id => id ? firstName(db, id) : 'sem responsável';
  let body;
  if (!st) body = html`<span class="hint">Ainda é ideia. Começar cria a tarefa de ${nx.label} para ${who(nOwn)}.</span><button class="btn pri" onClick=${() => act.advance(k, x.id)}>Começar<${Icon} n="arrowR" s=${14} /></button>`;
  else if (st.type === 'client') body = html`<span class="hint">Com o cliente ${-diff(x.sentAt || x.since) > 0 ? 'há ' + plural(-diff(x.sentAt || x.since), 'dia') : 'desde hoje'}. Ele aprova no painel dele.</span><button class="btn" onClick=${() => setModal({ t: 'remind', clientId: x.clientId })}><${Icon} n="msg" s=${14} />Lembrar o cliente</button>`;
  else if (st.type === 'review') body = back
    ? html`<form style="display:flex;gap:8px;flex:1;flex-wrap:wrap" onSubmit=${e => { e.preventDefault(); act.sendBack(k, x.id, why.trim()); setBack(false); setWhy(''); }}><label class="sr" for="fb-why">O que ajustar</label><input class="inp" id="fb-why" ref=${autoF} style="flex:1;min-width:200px" placeholder=${`O que precisa mudar em ${prevWorkOf(fl, st.key).label.toLowerCase()}?`} value=${why} onInput=${e => setWhy(e.target.value)} /><button class="btn" type="button" onClick=${() => setBack(false)}>Cancelar</button><button class="btn pri" type="submit">Devolver</button></form>`
    : html`<span class="hint">${st.label} com ${who(own)}. Aprovar manda para ${nx.label.toLowerCase()}${nOwn && nx.type !== 'client' ? ' (' + who(nOwn) + ')' : ''}.</span><button class="btn" onClick=${() => setBack(true)}>Devolver para ${prevWorkOf(fl, st.key).label}</button><button class="btn pri" onClick=${() => act.advance(k, x.id)}><${Icon} n="check" s=${14} />Aprovar</button>`;
  else if (st.type === 'live') body = html`<span class="hint">Peça concluída.</span>`;
  else body = html`<span class="hint">${x.status === 'ajuste' ? 'O cliente pediu ajuste. ' : ''}${st.label} com ${who(own)}${task && task.due ? ', ' + (diff(task.due) < 0 ? 'atrasada' : 'prazo ' + fmt(task.due)) : ''}. Concluir cria a tarefa de ${nx.label.toLowerCase()}${nOwn && nx.type !== 'client' ? ' para ' + who(nOwn) : ''}.</span><button class="btn pri" onClick=${() => act.advance(k, x.id)}>Concluir ${st.label.toLowerCase()}<${Icon} n="arrowR" s=${14} /></button>`;
  return html`<div class="sec" style="gap:10px">
    <div class="flowbar" role="list" aria-label="Etapas">${fl.stages.map((s, i) => html`<span key=${s.key} role="listitem" class=${cx('fb-step', i < idx && 'done', i === idx && 'on', s.type === 'client' && 'cli')} title=${s.label + (ownerOf(c, s.key) ? ' · ' + who(ownerOf(c, s.key)) : '')}>${i < idx ? html`<${Icon} n="check" s=${11} />` : null}${s.label}</span>`)}</div>
    <div class="primary-act">${body}</div>
    ${task && html`<button class="linkbtn" style="font-size:12px" onClick=${() => open('task', task.id)}>Ver a tarefa desta etapa</button>`}
  </div>`;
}
function StageSelect({ k, x }) {
  const { db, act } = useApp(); const fl = flowFor(db.clients.find(y => y.id === x.clientId), k);
  return html`<select class="sel" id=${'stg-' + x.id} value=${x.stage || ''} onChange=${e => act.jumpStage(k, x.id, e.target.value || null)}><option value="">Ideia</option>${fl.stages.map(s => html`<option key=${s.key} value=${s.key}>${s.label}</option>`)}</select>`;
}

/* ================= v4: esteira em quadro ================= */
function Esteira({ c }) {
  const { db, act, open, setModal } = useApp();
  const [kind, setKind] = useState('post'); const [drag, setDrag] = useState(null); const [over, setOver] = useState(null);
  const fl = flowFor(c, kind); const list = (kind === 'post' ? db.posts : db.scripts).filter(x => x.clientId === c.id);
  const cols = [{ key: null, label: 'Ideias', type: 'idea' }, ...fl.stages];
  const Card = x => { const t = openPieceTask(db, kind, x.id); const img = kind === 'post' && x.imgs && x.imgs[0]; return html`<div key=${x.id} class=${cx('pc-card', drag === x.id && 'dragging', x.status === 'ajuste' && 'adj')} draggable="true" onDragStart=${e => { setDrag(x.id); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', x.id); } catch (_) {} }} onDragEnd=${() => { setDrag(null); setOver(null); }} onClick=${() => open(kind, x.id)} role="button" tabindex="0" onKeyDown=${e => e.key === 'Enter' && open(kind, x.id)}>
      ${img && html`<img src=${img} alt="" loading="lazy" />`}<span class="t">${x.title}</span>
      <span class="m">${x.status === 'ajuste' && html`<span class="pill t-adj">Ajuste</span>`}${t && t.due && html`<${Due} date=${t.due} />`}${(t ? t.assignee : x.assignee) && html`<${Av} id=${t ? t.assignee : x.assignee} />`}</span></div>`; };
  return html`<section class="sec" style="gap:12px">
    <div class="sec-h"><h2>Esteira de produção</h2>
      <div class="seg" style="margin-left:8px"><button class=${cx(kind === 'post' && 'on')} onClick=${() => setKind('post')}>Posts</button><button class=${cx(kind === 'script' && 'on')} onClick=${() => setKind('script')}>Vídeos</button></div>
      <span class="muted" style="font-size:12px;margin-left:auto">Fluxo: ${fl.name}</span><button class="btn sm" onClick=${() => setModal({ t: 'flow', clientId: c.id })}><${Icon} n="sliders" s=${13} />Editar fluxo</button></div>
    <div class="est-board">${cols.map(col => { const items = list.filter(x => (x.stage || null) === col.key); return html`<div key=${col.key || 'idea'} class=${cx('est-col', col.type === 'client' && 'cli', over === (col.key || 'idea') && 'over')}
        onDragOver=${e => { e.preventDefault(); setOver(col.key || 'idea'); }} onDragLeave=${() => setOver(o => o === (col.key || 'idea') ? null : o)} onDrop=${() => { setOver(null); const x = list.find(y => y.id === drag); if (x && (x.stage || null) !== col.key) act.jumpStage(kind, x.id, col.key); }}>
        <div class="col-h"><b>${col.label}</b><span class="c">${items.length}</span>${col.key && ownerOf(c, col.key) && col.type !== 'client' && col.type !== 'live' && html`<span class="hint"><${Av} id=${ownerOf(c, col.key)} /></span>`}</div>
        ${items.map(Card)}
      </div>`; })}</div>
  </section>`;
}
function FlowSettings({ close, clientId }) {
  const { db, act } = useApp(); const c = db.clients.find(x => x.id === clientId);
  const [f, setF] = useState(() => structuredClone(c.flows || { post: 'enxuto', script: 'video', owners: {} }));
  const keys = [...new Set([...flowFor({ flows: f }, 'post').stages, ...FLOW_DEFS.video.stages].filter(s => ['work', 'review', 'task'].includes(s.type)).map(s => s.key))].sort((a, b) => STAGE_ORDER.indexOf(a) - STAGE_ORDER.indexOf(b));
  return html`<form onSubmit=${e => { e.preventDefault(); act.setFlows(clientId, f); close(); }}>
    <div class="mhd"><div><h2>Fluxo de produção de ${c.name}</h2><p>Quando uma etapa termina, a tarefa da próxima nasce sozinha para o responsável dela.</p></div><button type="button" class="btn icon ghost" aria-label="Fechar" onClick=${close}><${Icon} n="x" /></button></div>
    <div class="mbd">
      <span class="label">Posts</span>
      <div class="tpls">${['enxuto', 'etapas'].map(id => html`<button type="button" key=${id} class=${cx('tpl', f.post === id && 'on')} aria-pressed=${f.post === id} onClick=${() => setF({ ...f, post: id })}><b>${FLOW_DEFS[id].name}</b><small>${FLOW_DEFS[id].desc}</small><span class="flow-mini">${FLOW_DEFS[id].stages.map(s => s.label).join(' → ')}</span></button>`)}</div>
      <span class="label">Vídeos</span><p class="muted" style="font-size:13px">${FLOW_DEFS.video.stages.map(s => s.label).join(' → ')}</p>
      <span class="label">Quem faz cada etapa</span>
      <div class="own-grid">${keys.map(k => html`<label class="field" key=${k}><span>${STAGE_NAME[k] || k}</span><select class="sel" id=${'own-' + k} value=${f.owners[k] || ''} onChange=${e => setF({ ...f, owners: { ...f.owners, [k]: e.target.value || null } })}><option value="">Sem responsável</option>${db.people.map(p => html`<option key=${p.id} value=${p.id}>${p.name}</option>`)}</select></label>`)}</div>
    </div>
    <div class="mft"><button type="button" class="btn ghost" onClick=${close}>Cancelar</button><button class="btn pri" type="submit">Salvar fluxo</button></div>
  </form>`;
}

/* ================= v4: QG do cliente ================= */
function ClientQG({ c, setTab }) {
  const app = useApp(); const { db, act, open, setModal } = app;
  const pieces = [...db.posts.filter(p => p.clientId === c.id).map(x => ['post', x]), ...db.scripts.filter(s => s.clientId === c.id).map(x => ['script', x])];
  const inProd = pieces.filter(([, x]) => x.stage && !['cliente', 'publicado'].includes(x.stage)).length;
  const waiting = [...pieces.filter(([, x]) => x.status === 'cliente'), ...db.tasks.filter(t => t.clientId === c.id && t.status === 'client').map(x => ['task', x])];
  const oldest = waiting.reduce((m, [, x]) => Math.max(m, -diff(x.sentAt || x.since)), 0);
  const late = db.tasks.filter(t => t.clientId === c.id && t.status !== 'done' && t.due && diff(t.due) < 0);
  const meets = allMeetings(app).filter(m => m.clientId === c.id);
  const nextMeet = meets.filter(m => Date.parse(m.end || m.start) > Date.now()).sort((a, b) => Date.parse(a.start) - Date.parse(b.start))[0];
  const nextPost = db.posts.filter(p => p.clientId === c.id && p.date && diff(p.date) >= 0 && ['agendado', 'aprovado'].includes(p.status)).sort((a, b) => a.date.localeCompare(b.date))[0];
  const atas = meets.filter(m => db.meetingNotes[m.key]).sort((a, b) => Date.parse(b.start) - Date.parse(a.start)).slice(0, 3);
  const Stat = (label, val, sub, tone, onClick) => html`<button class="qg-stat" onClick=${onClick}><span class="k"><i class="dot" style=${{ background: tone }}></i>${label}</span><b>${val}</b><small>${sub}</small></button>`;
  return html`<div class="sec" style="gap:22px">
    <div class="qg-stats">
      ${Stat('Na esteira', inProd, 'peças em produção', 'var(--st-prog)', () => {})}
      ${Stat('Com o cliente', waiting.length, oldest ? `a mais antiga há ${plural(oldest, 'dia')}` : 'nada esperando', 'var(--st-cli)', () => {})}
      ${Stat('Atrasadas', late.length, late.length ? 'tarefas com prazo vencido' : 'tudo no prazo', 'var(--st-late)', () => setTab('tasks'))}
      ${Stat('Próxima reunião', nextMeet ? fmt(dayOf(nextMeet.start)) : '—', nextMeet ? `${hhmm(nextMeet.start)} · ${nextMeet.title}` : 'nada marcado', 'var(--taupe)', () => setTab('meetings'))}
      ${Stat('Próximo post', nextPost ? fmt(nextPost.date) : '—', nextPost ? nextPost.title : 'nada agendado', 'var(--st-ok)', () => setTab('posts'))}
    </div>
    <${Esteira} c=${c} />
    <div class="ov">
      <div class="side-col">
        <section class="sec"><div class="sec-h"><h2>Com o cliente agora</h2><span class="c">${waiting.length}</span>${waiting.length > 0 && html`<button class="btn sm" style="margin-left:auto" onClick=${() => setModal({ t: 'remind', clientId: c.id })}><${Icon} n="msg" s=${13} />Lembrar o cliente</button>`}</div>
          <div class="list">${waiting.length ? waiting.map(([k, x]) => { const s = -diff(x.sentAt || x.since); return html`<${ItemRow} k=${k} x=${x} key=${x.id} why=${s === 0 ? 'Enviado hoje' : `Esperando há ${plural(s, 'dia')}`} tone=${s >= 3 ? 'late' : 'cli'} />`; }) : html`<div class="empty">Nada esperando o cliente.</div>`}</div></section>
        <section class="sec"><div class="sec-h"><h2>Reuniões e atas</h2><button class="btn sm" style="margin-left:auto" onClick=${() => setTab('meetings')}>Ver todas</button></div>
          <div class="list">${nextMeet && html`<div class="row" onClick=${() => open('meeting', nextMeet.key)}><span class="mt-time"><b>${hhmm(nextMeet.start)}</b><small>${fmt(dayOf(nextMeet.start))}</small></span><div class="row-main"><div class="row-title">${nextMeet.title}</div><div class="row-meta"><span class="pill t-neu">Próxima</span></div></div></div>`}
            ${atas.map(m => { const n = db.meetingNotes[m.key]; return html`<div class="row" key=${m.key} onClick=${() => open('meeting', m.key)}><span class="mt-time"><b>${hhmm(m.start)}</b><small>${fmt(dayOf(m.start))}</small></span><div class="row-main"><div class="row-title">Ata: ${m.title}</div><div class="row-meta">${n.shared ? html`<span class="pill t-ok">Publicada para o cliente</span>` : html`<span class="pill t-neu">Só interna</span>`}${n.example && html`<span class="tag">EXEMPLO</span>`}</div></div></div>`; })}
            ${!nextMeet && !atas.length && html`<div class="empty">Nenhuma reunião ligada a este cliente.</div>`}</div></section>
      </div>
      <div class="side-col">
        <${DocsDrive} c=${c} />
        <${Lists} c=${c} />
        <section class="sec"><div class="sec-h"><h2>Onboarding</h2><span class="c">${c.onboarding.filter(o => o.done).length}/${c.onboarding.length}</span></div>
          <div class="card onb"><span class="bar"><i style=${{ width: (c.onboarding.filter(o => o.done).length / c.onboarding.length * 100) + '%' }}></i></span>
            ${c.onboarding.map((o, i) => html`<button class=${cx('onb-item', o.done && 'done')} key=${i} onClick=${() => act.toggleOnb(c.id, i)}><span class=${cx('chk sq', o.done && 'on')}>${o.done && html`<${Icon} n="check" s=${12} />`}</span><span>${o.t}</span></button>`)}</div></section>
        <section class="sec"><div class="sec-h"><h2>Conta</h2></div>
          <dl class="card kv"><dt>Contato</dt><dd>${c.contact}</dd><dt>Responsável</dt><dd>${personName(db, c.owner)}</dd><dt>Idioma do painel</dt><dd>${(LANGS.find(l => l[0] === c.lang) || [0, ''])[1]}</dd><dt>Links</dt><dd><button class="linkbtn" onClick=${() => setTab('links')}>${plural(c.links.length, 'link')}</button></dd></dl></section>
      </div>
    </div>
  </div>`;
}
function DocsDrive({ c }) {
  const { act, setModal } = useApp(); const [files, setFiles] = useState(null); const [edit, setEdit] = useState(false); const [dv, setDv] = useState(c.drive || '');
  const fi = c.drive && linkInfo(c.drive);
  const load = async () => { const mcp = await cap('mcp'); if (!mcp) { setFiles({ error: 'Abra o link dentro do claude.ai para listar a pasta pelo conector do Google Drive.' }); return; } setFiles({ loading: true });
    try { const r = await mcp.callTool(SRV.drive, 'search_files', { query: `parentId = '${fi.folder}'`, pageSize: 12, excludeContentSnippets: true }); setFiles({ list: (r.payload && r.payload.files) || [] }); } catch (e) { setFiles({ error: mcpMsg(e, SRV.drive) }); } };
  const docs = c.docs || [];
  return html`<section class="sec"><div class="sec-h"><h2>Documentos e Drive</h2><span class="c">${docs.length}</span></div>
    <div class="card docs-card">
      ${c.drive && !edit ? html`<div class="drive-row"><span class="lp-tile" style="background:#5F6368"><${Icon} n="book" s=${16} /></span><span class="lp-t"><b>Pasta do cliente no Drive</b><small>drive.google.com</small></span>
          <a class="btn sm" href=${c.drive} target="_blank" rel="noopener"><${Icon} n="ext" s=${13} />Abrir</a>${fi && fi.folder && html`<button class="btn sm" onClick=${load}>${files && files.loading ? 'Lendo…' : 'Ver arquivos'}</button>`}<button class="btn sm icon ghost" aria-label="Trocar pasta" onClick=${() => setEdit(true)}><${Icon} n="sliders" s=${13} /></button></div>`
        : html`<form class="addlink" onSubmit=${e => { e.preventDefault(); act.setClient(c.id, { drive: dv.trim() || null }); setEdit(false); }}><label class="sr" for=${'drv-' + c.id}>Pasta do Drive</label><input class="inp" id=${'drv-' + c.id} placeholder="Cole o link da pasta do cliente no Google Drive" value=${dv} onInput=${e => setDv(e.target.value)} /><button class="btn pri" type="submit">Salvar</button></form>`}
      ${files && (files.error ? html`<p class="err">${files.error}</p>` : files.list && html`<div class="drive-files">${files.list.length ? files.list.map(f => html`<a key=${f.id} class="lp-row" href=${f.viewUrl} target="_blank" rel="noopener" style="text-decoration:none"><span class="lp-tile" style=${{ background: /folder/.test(f.mimeType) ? '#5F6368' : /document/.test(f.mimeType) ? '#2A6BDB' : /spreadsheet/.test(f.mimeType) ? '#1E8E4E' : /presentation/.test(f.mimeType) ? '#C98A10' : /pdf/.test(f.mimeType) ? '#B3261E' : 'var(--text-3)' }}><${Icon} n=${/folder/.test(f.mimeType) ? 'book' : /image/.test(f.mimeType) ? 'image' : /video/.test(f.mimeType) ? 'play' : 'file'} s=${14} /></span><span class="lp-t"><b>${f.title}</b><small>${f.modifiedTime ? 'alterado ' + rel(dayOf(f.modifiedTime)) : ''}</small></span><${Icon} n="ext" s=${13} /></a>`) : html`<p class="muted">A pasta está vazia ou você não tem acesso a ela.</p>`}</div>`)}
      <div class="docs-list">${docs.map((d, i) => html`<button key=${d.id} class="doc-btn" onClick=${() => setModal({ t: 'preview', url: d.url, name: d.name })}><${LinkPreview} url=${d.url} name=${d.name} compact /></button>`)}</div>
      <${AddLink} label="Adicionar" onAdd=${m => act.setClient(c.id, { docs: [...docs, { id: uid('d'), ...m, at: off(0) }] })} />
    </div></section>`;
}
function Lists({ c }) {
  const { act } = useApp(); const lists = c.lists || []; const [adding, setAdding] = useState({}); const [newList, setNewList] = useState('');
  const setLists = L => act.setClient(c.id, { lists: L });
  const addItem = (li, v) => { const s = v.trim(); if (!s) return; const isUrl = /^https?:\/\//.test(s); setLists(lists.map(l => l.id === li ? { ...l, items: [...l.items, isUrl ? { t: niceName(s), url: s, done: false } : { t: s, done: false }] } : l)); setAdding({ ...adding, [li]: '' }); };
  return html`<section class="sec"><div class="sec-h"><h2>Listas</h2><span class="c">${lists.length}</span></div>
    ${lists.map(l => { const done = l.items.filter(i => i.done).length; return html`<div class="card qg-list" key=${l.id}><div class="ql-h"><b>${l.title}</b><span class="c mono">${done}/${l.items.length}</span><button class="btn sm icon ghost" style="margin-left:auto" aria-label="Apagar lista" onClick=${() => setLists(lists.filter(x => x.id !== l.id))}><${Icon} n="trash" s=${13} /></button></div>
      ${l.items.map((it, j) => html`<div key=${j} class=${cx('ql-it', it.done && 'done')}><button class=${cx('chk sq', it.done && 'on')} aria-label="Marcar" onClick=${() => setLists(lists.map(x => x.id === l.id ? { ...x, items: x.items.map((y, k) => k === j ? { ...y, done: !y.done } : y) } : x))}>${it.done && html`<${Icon} n="check" s=${12} />`}</button><span>${it.t}</span>${it.url && html`<a class="btn sm icon ghost" href=${it.url} target="_blank" rel="noopener" aria-label="Abrir link"><${Icon} n="link" s=${13} /></a>`}</div>`)}
      <form onSubmit=${e => { e.preventDefault(); addItem(l.id, adding[l.id] || ''); }}><label class="sr" for=${'li-' + l.id}>Novo item</label><input class="inp" id=${'li-' + l.id} placeholder="Adicionar item ou colar um link do Drive" value=${adding[l.id] || ''} onInput=${e => setAdding({ ...adding, [l.id]: e.target.value })} /></form></div>`; })}
    <form class="addlink" onSubmit=${e => { e.preventDefault(); if (!newList.trim()) return; setLists([...lists, { id: uid('ls'), title: newList.trim(), items: [] }]); setNewList(''); }}><label class="sr" for=${'nl-' + c.id}>Nova lista</label><input class="inp" id=${'nl-' + c.id} placeholder="Nova lista, ex.: acessos que faltam" value=${newList} onInput=${e => setNewList(e.target.value)} /><button class="btn" type="submit" disabled=${!newList.trim()}>Criar lista</button></form>
  </section>`;
}
function PreviewModal({ url, name, close }) {
  return html`<div><div class="mhd"><div><h2>${niceName(url, name)}</h2><p>${linkInfo(url).label}</p></div><button class="btn icon ghost" aria-label="Fechar" onClick=${close}><${Icon} n="x" /></button></div><div class="mbd"><${LinkPreview} url=${url} name=${name} /></div></div>`;
}

/* ================= v4: atas no painel do cliente ================= */
const MT = {
  pt: { tab: 'Reuniões', empty: 'Nenhuma ata ainda. Depois de cada reunião, o resumo aparece aqui.', sum: 'Resumo', dec: 'Decisões', next: 'Próximos passos', you: 'Você', cli: 'Cliente' },
  en: { tab: 'Meetings', empty: 'No meeting notes yet. After each meeting, the summary shows up here.', sum: 'Summary', dec: 'Decisions', next: 'Next steps', you: 'You', cli: 'Client' },
  es: { tab: 'Reuniones', empty: 'Todavía no hay actas. Después de cada reunión, el resumen aparece aquí.', sum: 'Resumen', dec: 'Decisiones', next: 'Próximos pasos', you: 'Tú', cli: 'Cliente' },
  fr: { tab: 'Réunions', empty: 'Aucun compte rendu pour le moment. Après chaque réunion, le résumé apparaît ici.', sum: 'Résumé', dec: 'Décisions', next: 'Prochaines étapes', you: 'Vous', cli: 'Client' },
};
function PortalMeetings({ c, lang }) {
  const { db } = useApp(); const T = MT[lang] || MT.pt;
  const list = Object.entries(db.meetingNotes).filter(([k, n]) => n.shared && n.cliente && (n.clientId || (db.meetings.find(m => m.key === k) || {}).clientId || db.meetingClient[k]) === c.id).sort((a, b) => Date.parse(b[1].start) - Date.parse(a[1].start));
  const who = q => /cliente|client|you|você|tú|vous/i.test(q) ? T.you : q;
  return html`<div class="sec" style="gap:16px"><h1 style="font-size:24px">${T.tab}</h1>
    ${list.length ? list.map(([k, n]) => html`<article class="ap ata" key=${k}><div class="ap-h"><span class="k"><span>${fmt(dayOf(n.start), lang, { weekday: 'long', day: 'numeric', month: 'long' })}</span><span>· ${hhmm(n.start)}</span>${n.example && html`<span class="tag">EXEMPLO</span>`}</span><h2>${n.title}</h2></div>
      <div class="ap-b"><div><span class="label">${T.sum}</span><p style="margin-top:4px">${n.cliente.resumo}</p></div>
        ${n.cliente.decisoes && n.cliente.decisoes.length > 0 && html`<div><span class="label">${T.dec}</span><ul class="ata-ul">${n.cliente.decisoes.map((d, i) => html`<li key=${i}>${d}</li>`)}</ul></div>`}
        ${n.cliente.proximos && n.cliente.proximos.length > 0 && html`<div><span class="label">${T.next}</span><ul class="ata-ul">${n.cliente.proximos.map((p, i) => html`<li key=${i}><b>${who(p.quem)}</b> ${p.o}</li>`)}</ul></div>`}</div></article>`) : html`<div class="card empty">${T.empty}</div>`}
  </div>`;
}
function PieceBanner({ t }) {
  const { db, act, open } = useApp(); const x = itemOf(db, t.piece.k, t.piece.id); if (!x) return null;
  const c = db.clients.find(y => y.id === x.clientId); const fl = flowFor(c, t.piece.k); const st = fl.stages.find(s => s.key === t.piece.stage); const nx = nextOf(fl, t.piece.stage);
  const cur = st && x.stage === t.piece.stage && t.status !== 'done'; const no = nx && ownerOf(c, nx.key);
  return html`<div class="primary-act piece-ban"><span class="hint">Etapa <b>${st ? st.label : '—'}</b> da peça <button class="linkbtn" onClick=${() => open(t.piece.k, x.id)}>${x.title}</button>.${cur && nx ? ` Concluir cria a próxima: ${nx.label.toLowerCase()}${no && nx.type !== 'client' ? ', com ' + firstName(db, no) : ''}.` : ''}</span>
    ${cur && (st.type === 'review' ? html`<button class="btn" onClick=${() => act.sendBack(t.piece.k, x.id, '')}>Devolver</button><button class="btn pri" onClick=${() => act.advance(t.piece.k, x.id)}><${Icon} n="check" s=${14} />Aprovar</button>` : html`<button class="btn pri" onClick=${() => act.advance(t.piece.k, x.id)}>Concluir etapa<${Icon} n="arrowR" s=${14} /></button>`)}</div>`;
}
function AtaClient({ m, note }) {
  const { db, act, toast } = useApp(); const c = db.clients.find(x => x.id === m.clientId); const cl = note.cliente;
  if (!cl) return html`<p class="muted">Esta ata foi gerada sem a versão do cliente. Gere de novo para ter as duas.</p>`;
  const T = MT[cl.lang] || MT.pt;
  const text = `${m.title}\n\n${cl.resumo}\n\n${cl.decisoes.length ? T.dec + ':\n' + cl.decisoes.map(d => '- ' + d).join('\n') + '\n\n' : ''}${cl.proximos.length ? T.next + ':\n' + cl.proximos.map(p => '- ' + p.quem + ': ' + p.o).join('\n') : ''}`;
  return html`<div class="mt-note">
    <p>${cl.resumo}</p>
    ${cl.decisoes.length > 0 && html`<div><span class="label">${T.dec}</span><ul>${cl.decisoes.map((d, i) => html`<li key=${i}>${d}</li>`)}</ul></div>`}
    ${cl.proximos.length > 0 && html`<div><span class="label">${T.next}</span><ul>${cl.proximos.map((p, i) => html`<li key=${i}><b>${p.quem}</b> ${p.o}</li>`)}</ul></div>`}
    ${!c ? html`<p class="muted">Ligue a reunião a um cliente para publicar a ata no painel dele.</p>` : html`<div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class=${cx('btn', !note.shared && 'pri')} onClick=${() => act.shareAta(m.key, !note.shared, m)}><${Icon} n=${note.shared ? 'x' : 'send'} s=${14} />${note.shared ? 'Tirar do painel do cliente' : 'Publicar no painel do cliente'}</button>
      <button class="btn" onClick=${() => copyText(text, ok => toast(ok ? 'Ata copiada. Cole no e-mail ou no WhatsApp do cliente.' : 'Não deu para copiar. Selecione o texto.'))}><${Icon} n="copy" s=${14} />Copiar</button>
      <a class="btn" href=${'https://wa.me/?text=' + encodeURIComponent(text)} target="_blank" rel="noopener" style="text-decoration:none"><${Icon} n="msg" s=${14} />WhatsApp</a></div>
      ${note.shared && html`<p class="muted" style="font-size:12px">${c.name} vê esta ata na aba "${T.tab}" do painel, em ${LANG_PT[cl.lang] || 'português'}.</p>`}`}
    <p class="muted" style="font-size:12px">No produto, as duas versões saem por e-mail sozinhas: a interna para você, a do cliente para o contato dele.</p>
  </div>`;
}
