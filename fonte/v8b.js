
/* modelos do quadro: nascem na origem e o quadro os coloca ao lado do que já existe */
const wbS = (x, y, color, text = '', w = 190, h = 130) => ({ id: uid('e'), t: 'sticky', x, y, w, h, color, text });
const wbT = (x, y, text, size = 18, w = 360, bold = true) => ({ id: uid('e'), t: 'text', x, y, w, h: Math.round(size * 1.6), text, size, bold });
const wbSh = (t, x, y, w, h, text = '', fill = 'white') => ({ id: uid('e'), t, x, y, w, h, text, fill, size: 15 });
const wbA = (a, b, o = {}) => ({ id: uid('e'), t: 'arrow', from: a.id, to: b.id, style: 'straight', head: 'end', ...o });
const wbF = (x, y, w, h, title) => ({ id: uid('e'), t: 'frame', x, y, w, h, title });
function wbMindTpl(rootText, branches) {
  const r = { ...newMind(null, rootText), x: 0, y: 200 }; r.root = r.id; const out = [r];
  branches.forEach(([t, subs]) => { const b = { ...newMind(r, t), root: r.id }; out.push(b); (subs || []).forEach(s => out.push({ ...newMind(b, s), root: r.id })); });
  return out;
}
const WB_TPL = [
  { k: 'brainstorm', name: 'Brainstorm', desc: 'Uma pergunta, post-its soltos, e carimbo para votar nas melhores ideias.', make: () => { const f = wbF(0, 0, 1000, 600, 'Brainstorm'); const q = wbT(40, 36, 'Pergunta: como podemos…?', 26, 900); const n = wbT(40, 92, 'Uma ideia por post-it. Depois agrupe as parecidas e vote com os carimbos 👍', 15, 900, false);
      const st = [0, 1, 2, 3, 4, 5, 6, 7].map(i => wbS(40 + (i % 4) * 235, 150 + Math.floor(i / 4) * 200, ['sand', 'blue', 'green', 'pink'][i % 4])); return [f, q, n, ...st]; } },
  { k: 'mind', name: 'Mapa mental', desc: 'Tema no centro e ramos coloridos. Tab cria um ramo filho, Enter cria um irmão.', make: () => wbMindTpl('Tema central', [['Ideia 1', ['Detalhe']], ['Ideia 2', ['Detalhe']], ['Ideia 3'], ['Ideia 4']]) },
  { k: 'kanban', name: 'Kanban', desc: 'Três colunas para acompanhar o que está a fazer, fazendo e feito.', make: () => { const f = wbF(0, 0, 1060, 640, 'Kanban'); const cols = ['A fazer', 'Fazendo', 'Feito'].flatMap((t, i) => [wbSh('round', 30 + i * 340, 30, 320, 580, '', 'cream'), wbT(50 + i * 340, 46, t, 20, 280)]);
      return [f, ...cols, wbS(55 + 0, 100, 'sand', 'Arraste os post-its entre as colunas', 270, 110), wbS(55, 230, 'sand', 'Clique duas vezes para escrever', 270, 110)]; } },
  { k: 'journey', name: 'Jornada do cliente', desc: 'Do primeiro contato ao pós-venda: o que ele faz, pensa, sente, e onde trava.', make: () => { const stages = ['Descoberta', 'Consideração', 'Decisão', 'Compra', 'Pós-venda']; const rows = [['O que ele faz', 'sand'], ['O que pensa', 'blue'], ['O que sente', 'pink'], ['Onde trava', 'lilac'], ['Oportunidades', 'green']];
      const f = wbF(0, 0, 1180, 820, 'Jornada do cliente'); const out = [f]; stages.forEach((s, i) => out.push(wbSh('round', 190 + i * 196, 30, 180, 48, s, 'dark'))); rows.forEach(([r, c], j) => { out.push(wbT(24, 104 + j * 140, r, 15, 160)); stages.forEach((s, i) => out.push(wbS(190 + i * 196, 96 + j * 140, c, '', 180, 120))); }); return out; } },
  { k: 'flow', name: 'Fluxograma', desc: 'Início, etapas, decisão com sim e não, e fim.', make: () => { const a = wbSh('round', 0, 120, 170, 64, 'Início', 'green'); const b = wbSh('rect', 250, 112, 190, 80, 'Etapa'); const c = wbSh('diamond', 520, 92, 200, 120, 'Deu certo?', 'sand'); const d = wbSh('rect', 800, 112, 190, 80, 'Próxima etapa'); const e = wbSh('round', 1070, 120, 170, 64, 'Fim', 'pink'); const g = wbSh('rect', 525, 300, 190, 80, 'Ajustar', 'white');
      return [a, b, c, d, e, g, wbA(a, b), wbA(b, c), wbA(c, d, { label: 'Sim' }), wbA(d, e), wbA(c, g, { label: 'Não' }), wbA(g, b, { style: 'elbow' })]; } },
  { k: 'swot', name: 'SWOT (matriz 2×2)', desc: 'Forças, fraquezas, oportunidades e ameaças, cada uma no seu quadrante.', make: () => { const f = wbF(0, 0, 900, 700, 'SWOT'); const q = [['Forças', 'green', 30, 40], ['Fraquezas', 'pink', 460, 40], ['Oportunidades', 'blue', 30, 370], ['Ameaças', 'sand', 460, 370]];
      return [f, ...q.flatMap(([t, c, x, y]) => [wbSh('rect', x, y, 410, 300, '', c), wbT(x + 20, y + 16, t, 20, 300)])]; } },
  { k: 'retro', name: 'Retrospectiva', desc: 'O que foi bem, o que pode melhorar, e as ações da próxima semana.', make: () => { const f = wbF(0, 0, 1060, 600, 'Retrospectiva'); const cols = [['O que foi bem', 'green'], ['O que pode melhorar', 'pink'], ['Ações', 'blue']];
      return [f, ...cols.flatMap(([t, c], i) => [wbT(40 + i * 340, 34, t, 20, 300), wbS(40 + i * 340, 90, c, '', 300, 120), wbS(40 + i * 340, 230, c, '', 300, 120)])]; } },
  { k: 'road', name: 'Linha do tempo', desc: 'Meses no topo e uma raia por frente de trabalho.', make: () => { const f = wbF(0, 0, 1120, 560, 'Linha do tempo'); const months = ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4']; const lanes = ['Conteúdo', 'Tráfego', 'Vendas'];
      return [f, ...months.map((m, i) => wbSh('round', 180 + i * 230, 30, 210, 44, m, 'dark')), ...lanes.flatMap((l, j) => [wbT(24, 120 + j * 140, l, 16, 140), wbSh('rect', 170, 100 + j * 140, 930, 120, '', 'cream')])]; } },
  { k: 'onb', name: 'Onboarding de cliente', desc: 'Do sim do cliente à primeira peça, por semana.', make: () => { const h = wbT(40, 10, 'Onboarding: do sim do cliente à primeira peça', 24, 640); const l = ['Dia 1', 'Semana 1', 'Semana 2'].map((t, i) => wbT(40 + i * 250, 64, t, 15, 190));
      const s1 = wbS(40, 100, 'sand', 'Cadastrar o cliente e criar a área'), s2 = wbS(40, 250, 'sand', 'Mandar o acesso pelo WhatsApp'), s3 = wbS(290, 100, 'blue', 'Pedir acesso ao Gerenciador de Negócios da Meta'), s4 = wbS(290, 250, 'blue', 'Pedir o número do WhatsApp Business'), s5 = wbS(540, 100, 'green', 'Kickoff: descrever a operação do cliente melhor do que ele descreveu');
      return [h, ...l, s1, s2, s3, s4, s5, wbA(s1, s3), wbA(s2, s4), wbA(s3, s5)]; } },
];
