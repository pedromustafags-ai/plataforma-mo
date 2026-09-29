
/* ================= v7: a equipe do cliente no painel dele ================= */
const PX = {
  pt: { board: 'Produção', posts: 'Posts', videos: 'Vídeos', ideas: 'Ideias', newPost: 'Novo post', newScript: 'Novo roteiro', mine: 'Com você agora', open: 'Abrir', stage: 'Etapa', with: n => `com ${n}`, nobody: 'sem responsável', you: 'você',
    finish: s => `Concluir ${s.toLowerCase()}`, start: 'Enviar para a produção', live: 'Peça concluída.', waitAppr: 'Esperando a aprovação de quem aprova as peças.', othersAppr: n => `${n} ${n === 1 ? 'peça espera' : 'peças esperam'} a aprovação de quem aprova.`,
    title: 'Título', caption: 'Legenda', script: 'Roteiro', readOnly: 'Nesta etapa a peça está com outra pessoa. Você acompanha por aqui.', team: 'Equipe', access: 'Acesso', files: 'Arquivos e links', liveOpen: 'Ver a peça publicada', liveField: 'Link de onde a peça foi publicada', save: 'Salvar', teamSub: 'Quem trabalha com você entra no painel, vê a produção e pode ser dono de uma etapa.',
    invite: 'Convidar', name: 'Nome', email: 'E-mail', func: 'Função', phFunc: 'Ex.: social media, copywriter', approves: 'Aprova as peças', produces: 'Produz', remove: 'Remover', invited: 'convite enviado', noTeam: 'Ninguém da sua equipe ainda.',
    inviteSent: n => `Convite enviado para ${n}`, removed: n => `${n} saiu da equipe`, created: 'Criado', sent: 'Enviado', nextWith: (s, n) => `Próxima etapa: ${s}${n ? ', com ' + n : ''}`, sentToAppr: 'Enviado para aprovação', done: 'Concluído', close: 'Fechar',
    boardSub: 'Onde cada peça está agora. Clique numa peça para abrir.', untitledPost: 'Post sem título', untitledScript: 'Roteiro sem título', onlyApprover: 'Só quem aprova pode convidar pessoas.' },
  en: { board: 'Production', posts: 'Posts', videos: 'Videos', ideas: 'Ideas', newPost: 'New post', newScript: 'New script', mine: 'On your plate', open: 'Open', stage: 'Stage', with: n => `with ${n}`, nobody: 'unassigned', you: 'you',
    finish: s => `Finish ${s.toLowerCase()}`, start: 'Send to production', live: 'This piece is done.', waitAppr: 'Waiting for the approver.', othersAppr: n => `${n} ${n === 1 ? 'piece is' : 'pieces are'} waiting for the approver.`,
    title: 'Title', caption: 'Caption', script: 'Script', readOnly: 'Someone else has this piece at this stage. You can follow along here.', team: 'Team', access: 'Access', files: 'Files and links', liveOpen: 'View the published piece', liveField: 'Link to where it was published', save: 'Save', teamSub: 'People who work with you join the workspace, see production and can own a stage.',
    invite: 'Invite', name: 'Name', email: 'Email', func: 'Role', phFunc: 'e.g. social media, copywriter', approves: 'Approves content', produces: 'Creates', remove: 'Remove', invited: 'invite sent', noTeam: 'No one from your team yet.',
    inviteSent: n => `Invite sent to ${n}`, removed: n => `${n} left the team`, created: 'Created', sent: 'Sent', nextWith: (s, n) => `Next stage: ${s}${n ? ', with ' + n : ''}`, sentToAppr: 'Sent for approval', done: 'Done', close: 'Close',
    boardSub: 'Where each piece is right now. Click a piece to open it.', untitledPost: 'Untitled post', untitledScript: 'Untitled script', onlyApprover: 'Only approvers can invite people.' },
  es: { board: 'Producción', posts: 'Publicaciones', videos: 'Videos', ideas: 'Ideas', newPost: 'Nueva publicación', newScript: 'Nuevo guion', mine: 'Contigo ahora', open: 'Abrir', stage: 'Etapa', with: n => `con ${n}`, nobody: 'sin responsable', you: 'tú',
    finish: s => `Terminar ${s.toLowerCase()}`, start: 'Enviar a producción', live: 'Pieza terminada.', waitAppr: 'Esperando la aprobación de quien aprueba.', othersAppr: n => `${n} ${n === 1 ? 'pieza espera' : 'piezas esperan'} la aprobación de quien aprueba.`,
    title: 'Título', caption: 'Texto', script: 'Guion', readOnly: 'En esta etapa la pieza está con otra persona. Puedes seguirla desde aquí.', team: 'Equipo', access: 'Acceso', files: 'Archivos y enlaces', liveOpen: 'Ver la pieza publicada', liveField: 'Enlace de donde se publicó', save: 'Guardar', teamSub: 'Quien trabaja contigo entra al panel, ve la producción y puede ser responsable de una etapa.',
    invite: 'Invitar', name: 'Nombre', email: 'Correo', func: 'Función', phFunc: 'Ej.: social media, copywriter', approves: 'Aprueba las piezas', produces: 'Produce', remove: 'Quitar', invited: 'invitación enviada', noTeam: 'Aún no hay nadie de tu equipo.',
    inviteSent: n => `Invitación enviada a ${n}`, removed: n => `${n} salió del equipo`, created: 'Creado', sent: 'Enviado', nextWith: (s, n) => `Siguiente etapa: ${s}${n ? ', con ' + n : ''}`, sentToAppr: 'Enviado para aprobación', done: 'Terminado', close: 'Cerrar',
    boardSub: 'Dónde está cada pieza ahora. Haz clic en una pieza para abrirla.', untitledPost: 'Publicación sin título', untitledScript: 'Guion sin título', onlyApprover: 'Solo quien aprueba puede invitar personas.' },
  fr: { board: 'Production', posts: 'Publications', videos: 'Vidéos', ideas: 'Idées', newPost: 'Nouvelle publication', newScript: 'Nouveau script', mine: 'À faire par vous', open: 'Ouvrir', stage: 'Étape', with: n => `avec ${n}`, nobody: 'non attribué', you: 'vous',
    finish: s => `Terminer : ${s.toLowerCase()}`, start: 'Envoyer en production', live: 'Contenu terminé.', waitAppr: 'En attente de la personne qui valide.', othersAppr: n => `${n} ${n === 1 ? 'contenu attend' : 'contenus attendent'} la validation.`,
    title: 'Titre', caption: 'Légende', script: 'Script', readOnly: 'À cette étape, le contenu est entre les mains de quelqu’un d’autre. Vous suivez d’ici.', team: 'Équipe', access: 'Accès', files: 'Fichiers et liens', liveOpen: 'Voir le contenu publié', liveField: 'Lien de publication', save: 'Enregistrer', teamSub: 'Les personnes qui travaillent avec vous accèdent à l’espace, voient la production et peuvent porter une étape.',
    invite: 'Inviter', name: 'Nom', email: 'E-mail', func: 'Rôle', phFunc: 'Ex. : social media, rédacteur', approves: 'Valide les contenus', produces: 'Produit', remove: 'Retirer', invited: 'invitation envoyée', noTeam: 'Personne de votre équipe pour l’instant.',
    inviteSent: n => `Invitation envoyée à ${n}`, removed: n => `${n} a quitté l’équipe`, created: 'Créé', sent: 'Envoyé', nextWith: (s, n) => `Étape suivante : ${s}${n ? ', avec ' + n : ''}`, sentToAppr: 'Envoyé pour validation', done: 'Terminé', close: 'Fermer',
    boardSub: 'Où en est chaque contenu. Cliquez sur un contenu pour l’ouvrir.', untitledPost: 'Publication sans titre', untitledScript: 'Script sans titre', onlyApprover: 'Seules les personnes qui valident peuvent inviter.' },
};
const STAGE_T = {
  pt: { estrategia: 'Estratégia', aprov_estrategia: 'Aprovar estratégia', copy: 'Copy', aprov_copy: 'Aprovar copy', design: 'Design', aprov_design: 'Aprovar design', roteiro: 'Roteiro', interna: 'Revisão da M&O', cliente: 'Sua aprovação', agendar: 'Agendar', gravacao: 'Gravação', edicao: 'Edição', aprov_edicao: 'Aprovar edição', publicar: 'Publicar', publicado: 'Publicado' },
  en: { estrategia: 'Strategy', aprov_estrategia: 'Approve strategy', copy: 'Copy', aprov_copy: 'Approve copy', design: 'Design', aprov_design: 'Approve design', roteiro: 'Script', interna: 'M&O review', cliente: 'Your approval', agendar: 'Schedule', gravacao: 'Recording', edicao: 'Editing', aprov_edicao: 'Approve edit', publicar: 'Publish', publicado: 'Published' },
  es: { estrategia: 'Estrategia', aprov_estrategia: 'Aprobar estrategia', copy: 'Copy', aprov_copy: 'Aprobar copy', design: 'Diseño', aprov_design: 'Aprobar diseño', roteiro: 'Guion', interna: 'Revisión de M&O', cliente: 'Tu aprobación', agendar: 'Programar', gravacao: 'Grabación', edicao: 'Edición', aprov_edicao: 'Aprobar edición', publicar: 'Publicar', publicado: 'Publicado' },
  fr: { estrategia: 'Stratégie', aprov_estrategia: 'Valider la stratégie', copy: 'Rédaction', aprov_copy: 'Valider la rédaction', design: 'Design', aprov_design: 'Valider le design', roteiro: 'Script', interna: 'Relecture M&O', cliente: 'Votre validation', agendar: 'Planifier', gravacao: 'Tournage', edicao: 'Montage', aprov_edicao: 'Valider le montage', publicar: 'Publier', publicado: 'Publié' },
};
const stageT = (lang, key) => ((STAGE_T[lang] || STAGE_T.pt)[key]) || STAGE_NAME[key] || key;
const teamOf = db => db.people.filter(p => p.role !== 'cliente');
const clientPeople = (db, cid) => db.people.filter(p => p.role === 'cliente' && p.clientId === cid);
const canApproveAs = who => !who || who.perm === 'aprova';
const pieceOf = (db, k, id) => (k === 'post' ? db.posts : db.scripts).find(x => x.id === id);

function ClientTeam({ c, lang = 'pt', canEdit, asClient }) {
  const { db, act } = useApp(); const P = PX[lang] || PX.pt; const list = clientPeople(db, c.id);
  const [f, setF] = useState(null);
  const send = e => { e.preventDefault(); if (!f.name.trim()) return; act.addClientPerson(c.id, { ...f, name: f.name.trim() }, P.inviteSent(f.name.trim())); setF(null); };
  return html`<section class="sec" style="gap:12px">
    ${asClient ? html`<div><h1 style="font-size:24px">${P.team}</h1><p class="muted" style="margin-top:6px">${P.teamSub}</p></div>` : html`<div class="sec-h"><h2>Equipe do cliente</h2><span class="c">${list.length}</span></div>`}
    <div class="list">${list.map(p => html`<div class="row" key=${p.id} style="cursor:default"><span class="av">${p.ini}</span><div class="row-main"><div class="row-title">${p.name}</div><div class="row-meta">${[p.func, p.perm === 'aprova' ? P.approves : P.produces, p.invited ? P.invited : ''].filter(Boolean).join(' · ')}</div></div>
        ${canEdit && html`<button class="btn sm ghost" onClick=${() => act.removeClientPerson(p.id, P.removed(p.name))}>${P.remove}</button>`}</div>`)}
      ${!list.length && html`<div class="empty">${P.noTeam}</div>`}</div>
    ${canEdit ? (f ? html`<form class="card ct-form" onSubmit=${send}>
        <div class="two"><label class="field"><span>${P.name}</span><input class="inp" id="ct-name" ref=${autoF} value=${f.name} onInput=${e => { const v = e.target.value; setF(o => ({ ...o, name: v })); }} /></label>
          <label class="field"><span>${P.email}</span><input class="inp" id="ct-email" type="email" value=${f.email} onInput=${e => { const v = e.target.value; setF(o => ({ ...o, email: v })); }} /></label></div>
        <div class="two"><label class="field"><span>${P.func}</span><input class="inp" id="ct-func" placeholder=${P.phFunc} value=${f.func} onInput=${e => { const v = e.target.value; setF(o => ({ ...o, func: v })); }} /></label>
          <div class="field"><span>${P.access}</span><div class="seg">${[['equipe', P.produces], ['aprova', P.approves]].map(([k, l]) => html`<button type="button" key=${k} class=${cx(f.perm === k && 'on')} onClick=${() => setF(o => ({ ...o, perm: k }))}>${l}</button>`)}</div></div></div>
        <div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" onClick=${() => setF(null)}>${(TX[lang] || TX.pt).cancel}</button><button class="btn pri" type="submit" disabled=${!f.name.trim()}>${P.invite}</button></div></form>`
      : html`<button class="btn" style="align-self:flex-start" onClick=${() => setF({ name: '', email: '', func: '', perm: 'equipe' })}><${Icon} n="plus" s=${14} />${P.invite}</button>`)
      : asClient && html`<p class="muted" style="font-size:13px">${P.onlyApprover}</p>`}
  </section>`;
}

function PortalBoard({ c, lang, who, openPiece }) {
  const { db, act } = useApp(); const P = PX[lang] || PX.pt;
  const [kind, setKind] = useState('post'); const fl = flowFor(c, kind);
  const list = (kind === 'post' ? db.posts : db.scripts).filter(x => x.clientId === c.id);
  const cols = [{ key: null }, ...fl.stages];
  const make = () => { const id = act.portalNew(kind, c.id, who ? who.id : null, kind === 'post' ? P.untitledPost : P.untitledScript, P.created); openPiece(kind, id); };
  return html`<div class="sec" style="gap:14px">
    <div class="pb-head"><div><h1 style="font-size:24px">${P.board}</h1><p class="muted" style="margin-top:6px">${P.boardSub}</p></div>
      <div class="pb-acts"><div class="seg"><button class=${cx(kind === 'post' && 'on')} onClick=${() => setKind('post')}>${P.posts}</button><button class=${cx(kind === 'script' && 'on')} onClick=${() => setKind('script')}>${P.videos}</button></div>
        ${html`<button class="btn pri" onClick=${make}><${Icon} n="plus" s=${14} />${kind === 'post' ? P.newPost : P.newScript}</button>`}</div></div>
    <div class="est-board">${cols.map(col => { const items = list.filter(x => (x.stage || null) === col.key); const own = col.key && ownerOf(c, col.key); return html`<div key=${col.key || 'idea'} class=${cx('est-col', col.type === 'client' && 'cli')}>
      <div class="col-h"><b>${col.key ? stageT(lang, col.key) : P.ideas}</b><span class="c">${items.length}</span>${own && col.type !== 'client' && col.type !== 'live' && html`<span class="hint" title=${personName(db, own)}><${Av} id=${own} /></span>`}</div>
      ${items.map(x => { const img = kind === 'post' && x.imgs && x.imgs[0]; const t = openPieceTask(db, kind, x.id); const mine = who && t && t.assignee === who.id; return html`<button key=${x.id} class=${cx('pc-card', x.status === 'ajuste' && 'adj', mine && 'mine')} onClick=${() => openPiece(kind, x.id)}>
        ${img && html`<img src=${img} alt="" loading="lazy" />`}<span class="t">${x.title}</span>
        <span class="m">${mine && html`<span class="pill t-cli">${P.mine}</span>`}${t && t.due && html`<${Due} date=${t.due} />`}${(t ? t.assignee : null) && html`<${Av} id=${t.assignee} />`}</span></button>`; })}
    </div>`; })}</div>
  </div>`;
}

function PortalTasks({ c, lang, who, openPiece }) {
  const { db } = useApp(); const P = PX[lang] || PX.pt;
  if (!who) return null;
  const mine = db.tasks.filter(t => t.assignee === who.id && t.status !== 'done' && t.piece && pieceOf(db, t.piece.k, t.piece.id));
  if (!mine.length) return null;
  return html`<section class="sec" style="gap:10px"><div class="sec-h" style="padding:0"><h2>${P.mine}</h2><span class="c">${mine.length}</span></div>
    <div class="list">${mine.map(t => { const x = pieceOf(db, t.piece.k, t.piece.id); return html`<button class="row" key=${t.id} onClick=${() => openPiece(t.piece.k, x.id)}>
      <${Icon} n=${t.piece.k === 'post' ? 'image' : 'script'} /><div class="row-main"><div class="row-title">${x.title}</div><div class="row-meta">${stageT(lang, t.piece.stage)}${t.due ? html` · <${Due} date=${t.due} />` : ''}</div></div><span class="btn sm">${P.open}</span></button>`; })}</div></section>`;
}

function PortalPiece({ k, id, c, lang, who, close }) {
  const { db, act } = useApp(); const P = PX[lang] || PX.pt; const t = TX[lang] || TX.pt;
  const x = pieceOf(db, k, id); if (!x) return null;
  const fl = flowFor(c, k); const idx = fl.stages.findIndex(s => s.key === x.stage); const st = fl.stages[idx];
  const task = openPieceTask(db, k, x.id); const own = task ? task.assignee : st && ownerOf(c, st.key);
  const mine = !!(who && own === who.id && st && ['work', 'review', 'task'].includes(st.type));
  const ownIdea = !st && x.from === 'client'; const edit = ownIdea || (mine && st.type !== 'review');
  const nx = nextOf(fl, x.stage);
  const go = () => { const n2 = nx && ownerOf(c, nx.key); act.portalAdvance(k, x.id, who ? who.id : 'client', nx && nx.type === 'client' ? P.sentToAppr : nx && nx.type === 'live' ? P.done : P.nextWith(stageT(lang, nx.key), n2 && nx.type !== 'client' ? firstName(db, n2) : null)); };
  let action;
  if (!st) action = ownIdea ? html`<button class="btn pri" onClick=${go}>${P.start}<${Icon} n="arrowR" s=${14} /></button>` : html`<span class="hint">${P.ideas}</span>`;
  else if (st.type === 'client') action = html`<span class="hint">${P.waitAppr}</span>`;
  else if (st.type === 'live') action = html`<span class="hint">${P.live}</span>`;
  else if (mine) action = html`<button class="btn pri" onClick=${go}><${Icon} n="check" s=${14} />${P.finish(stageT(lang, st.key))}</button>`;
  else action = html`<span class="hint">${stageT(lang, st.key)} · ${P.with(own ? (who && own === who.id ? P.you : firstName(db, own)) : P.nobody)}</span>`;
  if (st && st.type === 'client' && canApproveAs(who)) return html`<div class="p-sheet-wrap" onClick=${e => e.target === e.currentTarget && close()}><div class="p-sheet pp-sheet pp-appr" role="dialog" aria-modal="true" aria-label=${x.title}>
    <div class="mhd"><span></span><button type="button" class="btn icon ghost" aria-label=${P.close} onClick=${close}><${Icon} n="x" /></button></div>
    <${ApprovalCard} k=${k} x=${x} lang=${lang} onDecide=${(ok, text, slide) => { act.decide(k, x.id, ok, text, slide); close(); }} /></div></div>`;
  return html`<div class="p-sheet-wrap" onClick=${e => e.target === e.currentTarget && close()}><div class="p-sheet pp-sheet" role="dialog" aria-modal="true" aria-label=${x.title}>
    <div class="mhd"><span class="k" style="display:flex;gap:8px;align-items:center;font-size:13px;color:var(--text-3);padding-top:6px"><${Icon} n=${k === 'post' ? 'image' : 'script'} s=${15} />${k === 'post' ? P.posts : P.videos}${st ? ' · ' + stageT(lang, st.key) : ' · ' + P.ideas}</span>
      <button type="button" class="btn icon ghost" aria-label=${P.close} onClick=${close}><${Icon} n="x" /></button></div>
    <div class="mbd pp-body">
      ${edit ? html`<label class="field"><span>${P.title}</span><input class="inp pp-title" id="pp-title" value=${x.title} onChange=${e => e.target.value.trim() && act.setItem(k, x.id, { title: e.target.value.trim() })} /></label>` : html`<h2 class="pp-h">${x.title}</h2>`}
      <div class="flowbar" role="list" aria-label=${P.stage}>${fl.stages.map((s, i) => html`<span key=${s.key} role="listitem" class=${cx('fb-step', i < idx && 'done', i === idx && 'on', s.type === 'client' && 'cli')}>${i < idx ? html`<${Icon} n="check" s=${11} />` : null}${stageT(lang, s.key)}</span>`)}</div>
      <div class="primary-act">${action}</div>
      ${st && (st.type === 'live' || st.key === 'publicar') && (edit || (who && st.type === 'live') ? html`<${PortalLive} k=${k} x=${x} P=${P} />` : x.liveUrl && html`<a class="btn" style="align-self:flex-start" href=${x.liveUrl} target="_blank" rel="noopener"><${Icon} n="ext" s=${14} />${P.liveOpen}</a>`)}
      ${!edit && who && st && st.type !== 'live' && st.type !== 'client' && !mine && html`<p class="muted" style="font-size:13px">${P.readOnly}</p>`}
      ${k === 'post' && x.imgs && x.imgs.length > 0 && html`<div class="ap-media"><${Slider} imgs=${x.imgs} title=${x.title} /></div>`}
      ${k === 'post' && (edit ? html`<label class="field"><span>${P.caption}</span><textarea class="ta" id="pp-cap" rows="5" style="height:auto;padding:10px 12px" value=${x.caption || ''} onChange=${e => act.setItem(k, x.id, { caption: e.target.value })}></textarea></label>`
        : x.caption && html`<p style="white-space:pre-wrap;font-size:14px">${x.caption}</p>`)}
      ${k === 'script' && (edit ? html`<div class="field"><span>${P.script}</span><${ScriptEditor} key=${x.id} s=${x} /></div>`
        : html`<div class="sblk-read">${x.blocks.map(([l, v], i) => html`<div key=${i}>${l && html`<div class="label">${l}</div>`}<p style="white-space:pre-wrap">${v}</p></div>`)}</div>`)}
      ${edit ? html`<${MediaSection} k=${k} x=${x} lang=${lang} title=${P.files} note=${false} />` : (x.media || []).length > 0 && html`<div class="lp-grid">${x.media.map((md, i) => html`<${LinkPreview} key=${i} url=${md.url} name=${md.name} lang=${lang} />`)}</div>`}
    </div></div></div>`;
}
function PortalLive({ k, x, P }) {
  const { act } = useApp(); const [v, setV] = useState(x.liveUrl || '');
  return html`<div style="display:flex;flex-direction:column;gap:8px">${x.liveUrl && html`<a class="btn" style="align-self:flex-start" href=${x.liveUrl} target="_blank" rel="noopener"><${Icon} n="ext" s=${14} />${P.liveOpen}</a>`}
    <form class="addlink" onSubmit=${e => { e.preventDefault(); act.setItem(k, x.id, { liveUrl: v.trim() || null }, v.trim() ? P.save : null); }}><label class="sr" for=${'pl-' + x.id}>${P.liveField}</label><input class="inp" id=${'pl-' + x.id} placeholder=${P.liveField} value=${v} onInput=${e => setV(e.target.value)} /><button class="btn" type="submit" disabled=${v.trim() === (x.liveUrl || '')}>${P.save}</button></form></div>`;
}
