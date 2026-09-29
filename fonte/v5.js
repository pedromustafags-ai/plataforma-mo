
/* ================= v5: modelos de roteiro ================= */
const B = (l, h = '') => [l, h];
const SCRIPT_TPLS = [
  { key: 'livre', group: 'livre', name: 'Livre', desc: 'Título e texto corrido, como uma página do Notion.', blocks: [] },
  { key: 'reel', group: 'casa', name: 'Reel 60–90 s', kind: 'Reel', desc: 'A estrutura do Pedro para Reel.', blocks: [
    B('Gancho · 0–3 s', 'A frase que para o scroll. O que aparece na tela nos 3 primeiros segundos conta junto.'),
    B('Validação · 3–15 s', 'Uma confissão ou um número que mostra que você conhece o problema.'),
    B('O problema real · 15–45 s', 'A causa de verdade, de preferência numa metáfora.'),
    B('A solução · 45–75 s', 'Uma ação que dá para fazer hoje.'),
    B('Chamada · 75–90 s', 'O que fazer agora, e onde.')] },
  { key: 'caixinha', group: 'casa', name: 'Criativo em 4 partes', kind: 'Caixinha', desc: 'A anatomia de anúncio da M&O: público, dor, solução, chamada.', blocks: [
    B('Gancho', 'A pergunta da caixinha, ou a linha presa na tela desde o segundo zero.'),
    B('Identificação', 'Quem é o público, nos 3 primeiros segundos. O visual vem antes da fala.'),
    B('Dor', 'Mostre que conhece o dia dele.'),
    B('Solução', 'Diga o que resolve e pare aí. O detalhe fica para a reunião.'),
    B('Chamada', 'Com destino: "clica no botão e chama a gente no WhatsApp".')] },
  { key: 'monologo', group: 'casa', name: 'Monólogo do lead', desc: 'Você fala como se fosse o lead, e a oferta entra só no fim.', blocks: [
    B('O sintoma', 'O que ele admite em voz alta. Só entra frase que um lead disse de verdade.'),
    B('A culpa', 'O que ele sabe que deveria fazer e não faz.'),
    B('A evidência', 'O fato que alimenta a dúvida.'),
    B('A crença sobre o mundo', '"O mercado está saturado", "o método não funciona".'),
    B('A crença sobre si', 'O fundo da escada: "talvez eu não seja bom o suficiente".'),
    B('A comparação', 'Os outros crescendo, e a suspeita junto.'),
    B('Os dois medos', 'Dois medos em direções opostas. É o degrau que encurrala.'),
    B('O desejo', 'Dito como certeza, nunca como dinheiro.'),
    B('Virada e chamada', 'Os últimos 20% do tempo, olhando para a câmera. Nomeia o caminho e chama, sem explicar o mecanismo.')] },
  { key: 'youtube', group: 'casa', name: 'YouTube 8–15 min', kind: 'YouTube', desc: 'Abertura, quatro capítulos e encerramento.', blocks: [
    B('Abertura', 'O gancho e a promessa do vídeo.'),
    B('Cap. 1 · O problema'),
    B('Cap. 2 · Por que ninguém fala disso'),
    B('Cap. 3 · A solução', 'A explicação de fundo. Um ângulo novo a cada 20 ou 30 segundos.'),
    B('Cap. 4 · Como começar hoje', 'O primeiro passo concreto.'),
    B('Encerramento', 'A chamada.')] },
  { key: 'vsl', group: 'casa', name: 'VSL', kind: 'VSL', desc: 'A espinha em sete partes, do lead às perguntas.', blocks: [
    B('Lead', 'Chama o problema, promete a solução e diz para quem é.'),
    B('História', 'Quem fala, o que disparou, a busca pela resposta.'),
    B('Mecanismo do problema', 'A causa real, a que surpreende.'),
    B('Mecanismo da solução', 'A solução ligada à causa. Primeiro o geral, depois o detalhe que prova.'),
    B('O produto', 'Por que ele precisou ser construído.'),
    B('Fechamento', 'O que tem dentro, preço, garantia e urgência.'),
    B('Perguntas', 'Tira as dúvidas e lembra como comprar.')] },
  { key: 'historia', group: 'casa', name: 'História em 10 batidas', desc: 'Para abertura de história e para o "quem sou eu".', blocks: [
    B('Herói', 'Só cena real. Se faltar uma, deixe o buraco e peça a história.'), B('Crise'), B('Escolha'), B('O monstro'), B('Falso fracasso'),
    B('O problema aperta'), B('O segredo'), B('Resultados'), B('Com quem dividiu'), B('O produto nasce')] },
  { key: 'pas', group: 'classico', name: 'PAS', desc: 'Problema, agitação, solução.', blocks: [
    B('Problema', 'A dor que ele reconhece na hora.'), B('Agitação', 'O que piora se nada mudar.'), B('Solução', 'O caminho, e por que ele funciona.'), B('Chamada', 'O próximo passo.')] },
  { key: 'aida', group: 'classico', name: 'AIDA', desc: 'Atenção, interesse, desejo, ação.', blocks: [
    B('Atenção', 'O que faz parar.'), B('Interesse', 'Por que continuar ouvindo.'), B('Desejo', 'O que muda na vida dele.'), B('Ação', 'O que fazer agora.')] },
  { key: 'bab', group: 'classico', name: 'Antes, depois, ponte', desc: 'Como está hoje, como pode ficar, e o que leva de um ao outro.', blocks: [
    B('Antes', 'O dia dele hoje.'), B('Depois', 'O mesmo dia com o problema resolvido.'), B('Ponte', 'O que leva de um ao outro.'), B('Chamada', 'O próximo passo.')] },
  { key: 'hso', group: 'classico', name: 'Gancho, história, oferta', desc: 'Prende, conta, oferece.', blocks: [
    B('Gancho', 'O que faz parar.'), B('História', 'Uma cena real que prova o ponto.'), B('Oferta', 'O que você oferece, e como pegar.')] },
];
const TPL_GROUPS = [['casa', 'Da M&O'], ['classico', 'Clássicos de copy']];
const tplOf = k => SCRIPT_TPLS.find(t => t.key === k);
const isFree = s => s.tpl === 'livre';
const scriptEmpty = s => s.blocks.every(b => !b[1].trim());
function reflow(blocks, tpl) {
  if (tpl.key === 'livre' && blocks.length === 1 && !blocks[0][0]) return blocks;
  let secs = blocks.filter(b => b[1].trim());
  if (secs.length === 1 && !secs[0][0]) {
    const out = []; secs[0][1].split(/\n\s*\n/).forEach(par => { const [first, ...rest] = par.split('\n'); const lab = first.trim(); if (rest.length && lab.length < 40 && /\p{Lu}/u.test(lab) && lab === lab.toUpperCase()) out.push([lab, rest.join('\n')]); else if (out.length) out[out.length - 1][1] += '\n\n' + par; else out.push(['', par]); });
    secs = out;
  }
  if (tpl.key === 'livre') return [['', secs.map(([l, t]) => l ? l.toUpperCase() + '\n' + t : t).join('\n\n')]];
  const out = tpl.blocks.map(([l]) => [l, '']); const put = (j, t) => { out[j][1] = out[j][1] ? out[j][1] + '\n\n' + t : t; };
  const rest = secs.filter(([l, t]) => { const j = l ? out.findIndex(o => o[0].toUpperCase() === l.toUpperCase()) : -1; if (j < 0) return true; put(j, t); return false; });
  let last = out.length - 1; rest.forEach(([, t]) => { const j = out.findIndex(o => !o[1]); if (j >= 0) last = j; put(last, t); });
  return out;
}
const spoken = blocks => { const w = blocks.map(b => b[1]).join(' ').split(/\s+/).filter(Boolean).length; const sec = Math.round(w / 2.5); return { w, t: sec < 60 ? `${sec} s` : `${Math.floor(sec / 60)} min${sec % 60 ? ' ' + (sec % 60) + ' s' : ''}` }; };

function Grow({ value, onInput, onBlur, placeholder, cls, id, label }) {
  const r = useRef(null);
  useEffect(() => { const el = r.current; if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }, [value]);
  return html`<textarea ref=${r} id=${id} class=${cls} rows="1" aria-label=${label} placeholder=${placeholder} value=${value} onInput=${onInput} onBlur=${onBlur}></textarea>`;
}

function TplPicker({ onPick, current }) {
  const card = t => html`<button key=${t.key} class=${cx('tpl-card', current === t.key && 'on')} onClick=${() => onPick(t)}>
    <b>${t.name}</b><small>${t.desc}</small>
    <span class="tpl-seq">${t.blocks.map(b => b[0].split(' · ')[0]).join(' → ')}</span></button>`;
  return html`<div class="tpl-pick">${TPL_GROUPS.map(([g, name]) => html`<div key=${g}><div class="label" style="margin:0 0 8px">${name}</div>
    <div class="tpl-grid">${SCRIPT_TPLS.filter(t => t.group === g).map(card)}</div></div>`)}</div>`;
}

function ScriptEditor({ s }) {
  const { act } = useApp();
  const [b, setB] = useState(s.blocks); const bRef = useRef(b); const tm = useRef(null);
  useEffect(() => { setB(s.blocks); bRef.current = s.blocks; }, [s.id, s.tpl, s.blocks.length]);
  const flush = () => { if (tm.current) { clearTimeout(tm.current); tm.current = null; act.setItem('script', s.id, { blocks: bRef.current }); } };
  useEffect(() => flush, [s.id]);
  const edit = (i, col, v) => { const nb = bRef.current.map((x, j) => j === i ? (col ? [x[0], v] : [v, x[1]]) : x); bRef.current = nb; setB(nb); clearTimeout(tm.current); tm.current = setTimeout(flush, 500); };
  const structural = (nb, patch, msg) => { clearTimeout(tm.current); tm.current = null; act.setItem('script', s.id, { blocks: nb, ...patch }, msg); };
  const pick = t => { const nb = reflow(bRef.current, t); structural(nb, { tpl: t.key, ...(t.kind ? { kind: t.kind } : {}) }, t.key === 'livre' ? 'Roteiro virou texto livre' : `Modelo ${t.name} aplicado`); };
  const tpl = tplOf(s.tpl); const hint = (l, i) => { const h = tpl && tpl.blocks.find(x => x[0] === l); return (h && h[1]) || 'Escreva aqui'; };
  const sp = spoken(b);
  if (isFree(s)) return html`<div class="sed">
    <${Grow} cls="free-ta" id=${'sf-' + s.id} label="Roteiro" value=${b[0] ? b[0][1] : ''} placeholder="Escreva o roteiro. Salva sozinho." onInput=${e => edit(0, 1, e.target.value)} onBlur=${flush} />
    ${scriptEmpty({ blocks: b }) ? html`<div class="tpl-empty"><p class="muted">Ou comece por um modelo:</p><${TplPicker} onPick=${pick} /></div>`
      : html`<p class="sp-meta">${sp.w} palavras · cerca de ${sp.t} falados</p>`}
  </div>`;
  return html`<div class="sed">
    <div class="script-blocks">${b.map(([l, t], i) => html`<div class="sblock" key=${i}>
      <div class="sb-head"><input class="sb-label" aria-label="Nome do bloco" value=${l} onInput=${e => edit(i, 0, e.target.value)} onBlur=${flush} />
        <button class="btn sm icon ghost sb-x" aria-label=${'Remover o bloco ' + l} title="Remover bloco" onClick=${() => structural(bRef.current.filter((_, j) => j !== i), {}, `Bloco "${l || 'sem nome'}" removido`)}><${Icon} n="x" s=${13} /></button></div>
      <${Grow} cls="sb-ta" id=${'sb-' + s.id + '-' + i} label=${l || 'Bloco'} value=${t} placeholder=${hint(l, i)} onInput=${e => edit(i, 1, e.target.value)} onBlur=${flush} />
    </div>`)}</div>
    <div class="sb-foot"><button class="btn sm ghost" onClick=${() => structural([...bRef.current, ['Novo bloco', '']], {}, null)}><${Icon} n="plus" s=${13} />Bloco</button>
      <span class="sp-meta">${sp.w} palavras · cerca de ${sp.t} falados</span></div>
  </div>`;
}
function TplSelect({ s }) {
  const { act } = useApp(); const cur = tplOf(s.tpl);
  const change = key => { const t = tplOf(key); act.setItem('script', s.id, { blocks: reflow(s.blocks, t), tpl: t.key, ...(t.kind ? { kind: t.kind } : {}) }, t.key === 'livre' ? 'Roteiro virou texto livre' : `Modelo ${t.name} aplicado`); };
  return html`<select class="sel" id="s-tpl" aria-label="Modelo do roteiro" value=${cur ? cur.key : 'custom'} onChange=${e => change(e.target.value)}>
    ${!cur && html`<option value="custom" disabled>Personalizado</option>`}
    <option value="livre">Livre</option>
    ${TPL_GROUPS.map(([g, name]) => html`<optgroup label=${name}>${SCRIPT_TPLS.filter(t => t.group === g).map(t => html`<option value=${t.key}>${t.name}</option>`)}</optgroup>`)}
  </select>`;
}
function withTpls(db) {
  db.scripts.forEach(s => { if (s.tpl === undefined) s.tpl = s.kind === 'Caixinha' ? 'caixinha' : 'custom'; });
  return db;
}
