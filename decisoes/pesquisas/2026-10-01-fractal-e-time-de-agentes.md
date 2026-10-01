# O Fractal e o time de agentes da M&O

> Pesquisa de 01/10/2026, pedida pelo Pedro depois de ver o Fractal (tryfractal.co) e o vídeo de
> apresentação dele. Ordem dele: guardar como o Fractal é construído e organizado, porque uma camada
> assim é **o que o sócio vê** e vai entrar na operação da M&O **numa versão futura**; e desenhar quais
> agentes uma agência de uma pessoa só precisa ter, com o que cada um exige, pela estrutura do One
> Person Business do Dan Koe. Registro da fala em
> `decisoes/feedbacks/2026-10-01-plataforma-mo-fractal-camada-de-agentes-do-socio.md`.
>
> Nada daqui entra na versão atual do protótipo.

## O veredito, antes do detalhe

1. **Construir a camada por conta própria, com o Fractal como referência de organização.** O motor do
   Fractal é fechado (licença proprietária, só binário), é um alpha de um desenvolvedor só com pouca
   tração, e a documentação de segurança dele se contradiz. Depender dele seria a dependência de
   fornecedor único que o próprio ICP da M&O teme. O que vale copiar é a organização: agente como
   arquivo, memória que não se apaga, tarefa que nasce como sugestão, rotina com dono e histórico,
   aprovação humana no meio. Boa parte disso o MVB-OS já tem.
2. **Os primeiros agentes são os que vendem**, porque a M&O tem zero cliente: Chefe de Gabinete,
   Comercial, Marca e Conteúdo com a Produção, e o SDR que já existe. O CS e Suporte entra com o
   primeiro cliente, e a base de conhecimento dele pode ser escrita já.
3. **Três decisões são do Pedro antes de construir**: o custo variável (contra a decisão de 25/09 de
   custo zero), o aviso de IA no SDR que se apresenta como Pedro ou Bruno, e a conta de API para agentes
   que trabalham para o negócio (os termos não deixam usar a assinatura dele para isso).

---

## 1. O Fractal

### Quem fez e em que estágio está

- Felipe Barcelos, dev brasileiro (canal Vibe Dev, criador do Igniter.js), pela Nubler Digital LTDA, de
  São Paulo. **Não confundir com o Felipe da M&O**, que desenvolve o agente de WhatsApp.
- Alpha público desde 11/05/2026 (versão 0.1.0); o changelog chega à 0.1.406 em 24/08/2026 e o npm à
  0.1.407 em 24/09/2026. Acesso por lista de espera, ou junto com o boilerplate de SaaS que ele vende.
  Sem preço público.
- Tração baixa: repositório público com 8 estrelas e 5 commits; o post de lançamento no TabNews
  (07/08/2026) fechou sem engajamento; o vídeo tinha 549 visualizações em 01/10. Aos 14:40 da
  demonstração uma tela quebra ao vivo ("Something went wrong").
- Agência aparece no site como um de seis públicos, numa linha ("Multi-client boards with shared
  context"). Ele não tem nada do lado do cliente de agência: portal, aprovação do cliente, proposta,
  contrato, cobrança, marca do cliente.

### O que o vídeo mostra (com o minuto)

Vídeo: "Nem Claude Code, nem Codex: passei 10 meses construindo o que faltava", Felipe Barcelos,
publicado em 29/09/2026, 17 min.

| minuto | o que aparece |
|---|---|
| 00:00–01:56 | A tese: o SaaS pronto é a ponta do iceberg; falta quem opere marketing, suporte, feedback e vendas |
| 03:05 | O time de agentes na barra lateral: marketing, product lead, growth lead, product designer, a chefe de gabinete que coordena, o engenheiro líder. Sem "novo chat" a cada pedido |
| 04:03 | O "DNA" do agente: identidade, missão, contexto do workspace, papel, modelo, flag de orquestrador |
| 04:30 | A memória do agente, em grafo, que cresce a cada experiência |
| 05:07–06:38 | Canais: conversa com o agente pelo Telegram, com áudio. Onboarding por áudio: o agente pesquisou mercado, público e concorrentes e montou o roteiro com as tarefas. WhatsApp prometido |
| 07:08–08:09 | Rotinas: post no blog toda terça e quinta, mandado para revisão no Telegram, aprovado ali e publicado. Webhook do Instagram dispara o agente de marketing para DM e comentário |
| 08:37 | Integrações: o agente cria a própria ferramenta a partir do link de uma API; servidores MCP; loja de plugins |
| 09:11–10:43 | Skills como as do Claude Code, com ferramentas em código, instruções e artifacts. Caso de cliente: loja virtual com ferramentas de produto e variante |
| 10:43–12:18 | Coleções de dados e telas sob medida montadas pelo agente; painel entregue ao cliente por link (túnel) |
| 12:18 | Feedback do cliente chega por formulário, o agente analisa e sugere a tarefa para aprovação |
| 13:20 | Roda na máquina ou servidor de quem usa, com o provedor de modelo dele; tese de modelos locais |

O agente de marketing, na conversa mostrada, montou uma esteira de conteúdo com as etapas sugestão,
rascunho, revisão, aprovado e publicado, campos de público, promessa, prova e chamada, e um calendário
de 90 dias com 30 ideias.

### A arquitetura (lida no código público e no pacote npm, sem executar nada)

Fontes: repositório `github.com/tryfractal/fractal` (README, LICENSE, SECURITY.md, PRIVACY.md);
pacote `@fractal-os/cli` lido pelo unpkg; registro de skills `github.com/tryfractal/registry` (MIT);
SDK de plugins `@fractal-os/plugin` 0.0.106 (MIT, tipos completos); notas de versão do site.

- **Local-first, em dois binários fechados.** O `@fractal-os/cli` é um lançador de 1,4 KB que escolhe o
  pacote da plataforma. No Mac vêm `bin/fractal` (CLI, 80 MB) e `bin/fractal-server` (gateway, 170 MB),
  provavelmente compilados com Bun. Fluxo: instalar pelo npm, `fractal gateway start`, usar pelo app,
  pelo IDE ou pela API HTTP (OpenAPI em `/api/docs/openapi.json`; artifacts servidos em
  `/v/<workspace>/artifacts/<id>/`). Com `--mcp`, a CLI vira servidor MCP e cada comando vira ferramenta.
- **App desktop em Electron; site em Next.js** com componentes Radix.
- **Sem banco de dados.** Toda entidade é uma coleção do `@igniter-js/collections`: arquivos Markdown,
  JSON e YAML com busca BM25 (adaptadores de disco, Redis e S3).
- **O agente roda sobre o Vercel AI SDK** (`ToolLoopAgent`). Seis papéis de modelo: padrão,
  "subconsciente" (o que observa a sessão e consolida memória), tempo real, voz, imagem e vídeo.
  Provedores: OpenAI, Google, Anthropic, Codex.
- **Ferramentas carregadas sob demanda** (listar, ver o schema, chamar), com um campo de raciocínio
  obrigatório em toda chamada. Cinco tipos de conexão: MCP por stdio, MCP por HTTP, API REST gerada do
  OpenAPI, CLI e código próprio (`FractalTool.create().withSchema().withHandler()`).
- **Licença:** o motor está sob a "Fractal Software License", proprietária, que proíbe copiar,
  modificar e fazer engenharia reversa. O SDK de plugins e o registro de skills são MIT. Dá para instalar
  e estender; não dá para fazer fork nem rodar a partir do código.

### A organização em disco (a parte que mais interessa)

```
~/.fractal/workspaces/{id}/config.json        registro global
<projeto>/.fractal/
  agents/{id}/agent.md                         frontmatter + corpo (o prompt do agente)
  agents/{id}/memories/{uuid}.memory.md        uma memória por arquivo
  skills/<skill>/SKILL.md                      + manifest, toolsets/<grupo>/tools/<nome>.tool.ts,
                                                 references/, templates/, collections/, views/,
                                                 hooks/, artifacts/, goals/, routines/, assets/
  instructions/{patterns|standards|workflows}/{id}.instruction.md
  tasks/{FRA-012}/TASK.md + worktree/          uma pasta por tarefa, com cópia isolada do código
  goals/GOAL-XXX/GOAL.md
  routines/<x>/ROUTINE.md
  artifacts/<id>/ARTIFACT.md + source/
  collections/, views/, templates/, files/
```

- **agent.md**: frontmatter com `id`, `name`, `role`, `description` (que guia o roteamento), `leader`
  (a hierarquia), `skill`, `provider`, `model`, `voice`, `image`, `channels`, `orchestrator`. O corpo é
  o prompt, com "Identity" e "Responsibilities". O workspace nasce com um orquestrador (`atlas`).
- **SKILL.md**: frontmatter com nome, descrição e regras; corpo em Markdown, como as skills do Claude
  Code.
- Mudança em disco recarrega sozinha.

### O modelo de dados

| entidade | campos que importam |
|---|---|
| **Memória** | título, descrição, categoria (13: decisão, intenção, compromisso, relação, evento, observação, erro, aprendizado, fato, referência, instrução, preferência, contexto), tags, agente, confiança de 0 a 1, links (o grafo), `supersedes` (qual memória ela substitui e por quê), status (ativa, depreciada, arquivada, expirada), escopo, validade |
| **Tarefa** | oito estados: **sugestão**, backlog, planejamento, a fazer, em andamento, parada, **em revisão**, concluída; prioridade, responsável, worktree, checkpoint, dependências, projeto, meta, conversa. Todos e comentários são coleções à parte |
| **Rotina** | agente dono, o prompt, gatilhos (webhook com token, horário por cron, ou evento com filtros), status. Cada disparo vira uma execução com histórico, gravada como conversa |
| **Meta** | status (ativa, alcançada, abandonada), prazo, projeto |
| **Artifact** | ponto de entrada, visibilidade (privado, workspace, por senha) |
| **Conversa** | tipo (canal, direta, tarefa, execução, externa), participantes (gente ou agente, membro ou admin), canal externo (Telegram) |

"Surface" não existe como entidade: no código são views (sobre json-render) e artifacts.

### Como funciona

- **Memória:** cada memória é imutável; corrigir é criar outra que substitui a antiga, sem apagar
  arquivo. Recuperação por busca com pesos (título pesa mais que o corpo), e o prompt recebe as 5
  memórias ativas mais recentes. O site fala em memória vetorial, mas o SDK não tem embedding. A
  consolidação roda quando a sessão para, pelo modelo "subconsciente"; a "consolidação noturna" do vídeo
  parece ser uma rotina comum.
- **Orquestrador:** só um agente pode ser orquestrador, e ele recebe toda mensagem que não menciona
  ninguém. A delegação é por menção (`@agente`) com tarefa, um repasse por resposta.
- **Aprovação humana:** a etapa "em revisão" com o diff da cópia isolada; regras "perguntar" nas
  instruções; ganchos antes de cada ferramenta (permitir, negar, perguntar). A política de segurança diz
  que ferramenta pede aprovação por padrão.
- **Telegram:** o agente guarda o token do bot e o chat. Não foi possível ver como o usuário é pareado.
- **Contradições na documentação:** a política de segurança diz que as chaves ficam no Keychain, e o
  tipo de configuração guarda chave de provedor, senha e token do túnel em `config.json`; a política de
  privacidade fala em transcrição retida por 30 dias "no servidor", contra o discurso local-first.

### O design

- **O aplicativo** é escuro e monocromático, no estilo do Linear. Barra lateral com seletor de
  workspace, Tarefas, Rotinas, Metas, Arquivos, Plugins, Projetos, Telas e Coleções; depois o canal do
  time, os agentes (cada um com uma esfera colorida) e as pessoas. Abas de navegador no topo. Listas
  densas com código por item (FRA-171) e responsável à direita. Detalhe com painel de propriedades à
  direita. Um verde-água como único destaque.
- **O site** segue o tema do sistema, usa Inter com Instrument Serif itálica no destaque, mostra os
  prints sobre fundos de paisagem pintada, e tem seções numeradas com quatro subitens cada.

---

## 2. O modelo One Person Business do Dan Koe

Fontes principais: as cartas dele (letters.thedankoe.com e thedankoe.com), conferidas no texto.

- **A versão mais recente** ("The One-Human Business", 06/09/2026): interesses próprios (valor único) +
  rede social (distribuição grátis) + IA (multiplicação barata). Três componentes, nesta ordem:
  **Marca, Oferta, Distribuição**. A oferta tem quatro alavancas (resultado sonhado, mecanismo de
  entrega, velocidade, garantia); distribuição é marketing, venda, conteúdo, anúncio e página, o funil.
- **Versões anteriores:** em 03/2026 eram três pilares (Marca, Conteúdo, Oferta); em seis meses o
  conteúdo passou para dentro de Distribuição. Em 2024, três estágios: começar com serviço para cliente,
  construir audiência, transformar em produto.
- **O time de IA dele** (06/09/2026), seis papéis nesta ordem: estrategista de marca, estrategista de
  conteúdo, especialista em texto longo, especialista em texto curto, consultor de oferta, estrategista
  de marketing. Mais um "estrategista semanal" que roda sozinho toda semana. Nenhum escreve por ele.
- **Como ele monta cada papel**, em três passos: saber como é o bom (referências), codificar o próprio
  processo, iterar.
- **Suporte:** a IA escreveu 30 artigos da central de ajuda em 2h entrevistando ele; essa base atende o
  suporte humano e um agente de suporte (03/01/2026).
- **O que fica humano:** descobrir e escolher as ideias, a voz, a edição final e a decisão. É a mesma
  regra do livro Purpose & Profit, que o Pedro já internalizou (`Pedro_Second_Brain/Conhecimento/wiki/dan-koe-purpose-and-profit.md`):
  com a inteligência técnica disponível, sobram gosto, agência e coerência.
- **O limite, para a M&O:** o Koe trata serviço e agência como o primeiro degrau, e os seis papéis dele
  servem um criador que vende produto. Entrega, retenção, atendimento e prospecção ficam fora do modelo
  dele e foram desenhados aqui.
- **Críticas de fora:** viés de sobrevivente, "uma pessoa" que esconde terceirização, receita que não é
  lucro (Marks Insights, 02/2026; Kassandra Kuehl, 07/2023).

---

## 3. Agentes em agências pequenas: o que funciona e onde quebra

- **Adoção:** 9 em cada 10 agências dos EUA usam IA generativa e metade já usa agentes para executar
  trabalho (Forrester com a 4A's, 24/06/2026). Não há estudo só de agências de 1 a 5 pessoas.
- **Autonomia que se vê na prática:** prospecção e SDR fazem sozinhos depois de um período de leitura de
  toda mensagem (SaaStr, autodeclarado); suporte resolve o repetitivo e passa o resto; proposta, gestão
  de conta, relatório e cobrança rascunham; estratégia e vídeo só ajudam.
- **Onde quebra:** o bot de suporte do Cursor inventou uma regra de assinatura (04/2025); no caso
  Moffatt contra Air Canada (2024) a empresa respondeu pelo que o chatbot disse; o Advantage+ da Meta
  multiplicou o custo por mil impressões e trocou criativos sem pedido (2024 e 01/2026); o agente do
  Replit apagou um banco de produção durante um congelamento (07/2025); a Deloitte devolveu parte de um
  contrato por citações inventadas (10/2025).
- **O que nunca sai sem humano** (guia de agentes da OpenAI, mais leitura para a M&O): preço, proposta e
  contrato; mudança de orçamento ou campanha nova; peça publicada em nome do cliente; resposta sobre
  reembolso, cancelamento ou prazo; primeira mensagem a cada cliente novo; número de relatório que vai ao
  cliente; cobrança. Suporte sem resposta na base passa para um humano em vez de improvisar.
- **Aviso de IA:** o artigo 50(1) do AI Act europeu obriga a avisar que a pessoa fala com uma IA, desde
  02/08/2026; na Califórnia, o §17941 proíbe esconder que é bot para vender. **O SDR da M&O se apresenta
  como Pedro ou Bruno**, e isso precisa de revisão jurídica antes de atender lead europeu ou californiano.
  A data do AI Act foi conferida numa nota da Cloud Security Alliance, não no texto consolidado.
- **Custo:** n8n instalado no próprio servidor é grátis (a M&O já usa); Claude Haiku 4.5 custa US$ 1 por
  milhão de tokens de entrada e US$ 5 de saída, e a Anthropic estima uns US$ 37 para 10 mil tickets de
  suporte; plataformas cobram por usuário e crédito (Lindy, US$ 30 a 200), por atendimento resolvido
  (Intercom US$ 0,99, HubSpot US$ 0,50) ou por conta (GoHighLevel, US$ 97).
- **WhatsApp, lido na documentação da Meta em 01/10/2026:** a partir de hoje a mensagem de serviço é
  cobrada, inclusive a resposta de IA de terceiros; cada número tem 1.000 mensagens de serviço grátis por
  mês; depois disso, US$ 0,0034 por mensagem na América do Norte, US$ 0,02 na Espanha, US$ 0,055 na
  Alemanha. A janela grátis de quem clica num anúncio para WhatsApp continua. A página comercial da Meta
  ainda diz que serviço é grátis e está desatualizada. **Isto fecha a pendência de 30/09.**
- **Métricas por agente:** SDR (tempo até a primeira resposta, % que agenda, comparecimento, custo por
  reunião agendada); suporte e CS (resolução confirmada, reabertura em 72h, % passado a humano com o
  motivo, satisfação); criativo (% aprovado sem edição, rodadas); tráfego (gasto acima do limite, que deve
  ser zero); todos (custo do mês contra horas poupadas, incidentes a cada 100 interações).

---

## 4. O time de agentes da M&O

A estrutura é a do Koe (Marca, Oferta, Distribuição), mais o que uma agência precisa e ele não desenha
(Entrega e Retenção), com uma direção em cima e um sistema embaixo. Para cada agente: o equivalente no
Fractal e no Koe, a missão, o que ele lê, o que ele usa, as rotinas, o que **nunca** sai sem o sócio, a
métrica, o que já existe e o que falta.

### Direção

**1. Chefe de Gabinete** (o orquestrador, com quem o sócio fala)
- Fractal: a chefe de gabinete do vídeo e o orquestrador padrão. Koe: o estrategista semanal.
- Missão: transformar o que o sócio pede (áudio no WhatsApp ou Telegram, texto) em tarefa com dono;
  passar para o agente certo; montar o resumo do dia e a revisão da semana; segurar a fila de aprovação;
  consolidar a memória do time.
- Lê: a Central M&O inteira (tarefas, esteira, reuniões, pacote do mês), as memórias, a skill mo-agency.
- Usa: a API da Central, o canal de áudio do sócio, a Google Agenda, transcrição.
- Rotinas: resumo às 8h; revisão às segundas; tarefa parada há mais de 3 dias; consolidação à noite.
- Nunca sem o sócio: nada sai para fora da M&O. Ele organiza e pede.
- Métrica: pedidos do sócio que viraram a tarefa certa sem retrabalho; tempo do áudio à tarefa.
- Já existe: o Maestro do MVB-OS (ciclo, portões, destilação) e o Copiloto do protótipo.
- Falta: o canal de áudio, a ligação com a Central de verdade, memória por agente.

### Marca

**2. Marca e Conteúdo** (da própria M&O)
- Fractal: o agente de marketing. Koe: estrategista de marca e estrategista de conteúdo.
- Missão: posicionamento e calendário do `@m.o.com.pany` em inglês; pauta a partir da performance e das
  tendências; brief para a Produção.
- Lê: a skill mo-agency (as oito leis, voz, identidade, os quatro ângulos), a performance do Instagram.
- Usa: leitura do Instagram, pesquisa de tendências, o calendário da Central.
- Rotinas: pauta semanal; leitura de performance mensal.
- Nunca sem o sócio: publicação; qualquer prova social (zero cliente, lei 1).
- Métrica: conversas iniciadas a partir do orgânico.
- Já existe: Maestro, Trend Researcher e Analista do MVB-OS, desenhados para a marca pessoal. Troca a
  régua de voz e o canal.

**3. Produção** (três especialistas: Copywriter, Designer, Editor de vídeo)
- Fractal: o product designer. Koe: especialista em texto longo e em texto curto.
- Missão: as peças da M&O e as dos clientes, com a voz de cada cliente.
- Lê: a marca do cliente guardada na Central, o brief, as regras de cada canal.
- Usa: as skills `conteudo`, `copy`, `roteiro`, `vender`, `editar-video`, os motores de imagem.
- Nunca sem o sócio: peça de cliente passa pela aprovação interna e pelas duas rodadas do cliente.
- Métrica: % aprovado sem edição; rodadas por peça.
- Já existe: Copywriter e Design do MVB-OS, as skills de produção, o agente de edição de vídeo.
- Falta: um perfil de voz por cliente; o agente como dono da etapa Copy ou Design na esteira.

### Oferta

**4. Comercial** (pedido do Pedro)
- Koe: consultor de oferta.
- Missão: preparar cada reunião (dossiê do lead com site, Instagram, anúncios e o espelho da operação);
  montar a proposta nas três faixas a partir da call; follow-up depois da call; registrar objeções.
- Lê: o CRM (`prospect.moagency.io`), a transcrição da reunião, `mo-agency/03`, a skill `vender`.
- Usa: CRM, Google Agenda, transcrição (o Fathom, já que o Tactiq não tem API), rascunho no Gmail.
- Rotinas: dossiê duas horas antes de cada reunião; rascunho de follow-up no dia seguinte, no terceiro e
  no sétimo; revisão semanal do funil.
- Nunca sem o sócio: preço, proposta e qualquer mensagem com número. Nunca desconto na faixa 2.
- Métrica: reuniões que viram proposta; propostas fechadas; tempo de ciclo.
- Já existe: a skill `vender`, `mo-agency/03`, o script do closer.
- Falta: o CRM ligado; a transcrição das calls.

### Distribuição

**5. SDR** (já existe, no WhatsApp)
- Missão: qualificar o lead que chega (BANT declarado, Filtro CERTO por baixo) e agendar.
- Nunca sem o sócio: preço; mudança de script.
- Métrica: tempo até a primeira resposta; % qualificado que agenda; comparecimento; custo por reunião.
- Falta: o Chefe de Gabinete enxergar o funil; contar o custo do WhatsApp desde 01/10; **revisão
  jurídica do aviso de IA**.

**6. Prospecção ativa** (outbound)
- Fractal: a prospecção ativa citada no vídeo.
- Missão: listar negócios no ICP, pesquisar cada um, escrever a primeira mensagem personalizada.
- Usa: as skills `apify-*`, a skill mo-agency.
- Nunca sem o sócio, na fase 1: cada primeira mensagem. Regras de e-mail frio nos EUA e na Europa a
  verificar.
- Métrica: taxa de resposta; reuniões a cada 100 contatos.

**7. Growth e Tráfego**
- Fractal: o growth lead e o tráfego pago. Koe: estrategista de marketing.
- Missão: ler as contas de anúncio (da M&O e dos clientes), avisar gasto fora do limite, fadiga de
  criativo e custo acima da meta; propor teste; brief de criativo.
- Nunca sem o sócio: mudar orçamento ou ligar campanha. Quem executa é o Vinícius.
- Métrica: gasto acima do limite (meta zero); custo por reunião agendada.

### Entrega (o que o Koe não desenha)

**8. Estrategista de Conta**
- Fractal: o agente de produto (escopo). Na agência, o produto é o plano do cliente.
- Missão: o diagnóstico (faixa 3), o plano do cliente, o funil, o calendário e o pacote do mês; brief
  para a Produção; conferir a entrega contra o contrato.
- Lê: a aba Sobre, o formulário de entrada, o contrato e o pacote, as atas.
- Nunca sem o sócio: plano e diagnóstico antes de irem ao cliente.
- Métrica: entrega dentro do pacote; peça aprovada na primeira rodada.

**9. Analista**
- Fractal: o agente de evidência. Koe: o estrategista de marca que lê a performance.
- Missão: o relatório do mês de cada cliente (a aba Resultados), o custo por reunião agendada, a
  leitura de anúncios e conversas.
- Nunca sem o sócio: número que vai para o cliente.

**10. Engenharia de Automação**
- Fractal: o engenheiro líder.
- Missão: apoiar o Felipe da M&O nos agentes de WhatsApp dos clientes: testar conversas contra as dez
  regras do script, vigiar falha do n8n, documentar.
- Nunca sem o sócio ou o Felipe: nada vai para produção.
- Métrica: falha achada antes do cliente.

### Retenção (o que o Koe não desenha)

**11. CS e Suporte** (pedido do Pedro: a única porta do cliente)
- Fractal: a especialista de onboarding e suporte. Koe: o agente de suporte sobre a central de ajuda.
- Missão: tirar dúvida do cliente (WhatsApp, e-mail, SMS, Central); fazer o onboarding (formulário,
  acessos); mandar o status da semana; acompanhar a saúde da conta (atraso, rodadas usadas,
  satisfação); avisar risco de cancelamento; abrir pedido na esteira; escalar para o sócio pelo "Falar
  com a M&O".
- Lê: a base de conhecimento (perguntas frequentes, "Como trabalhamos juntos"), a Central (esteira,
  posts, reuniões, contrato), o histórico do cliente.
- Usa: WhatsApp API, e-mail, SMS (registro A2P 10DLC nos EUA), a Central.
- Rotinas: resposta em minutos; status às segundas; saúde da conta toda semana; lembrete de aprovação,
  um por lote.
- Nunca sem o sócio: prazo, preço, reembolso ou escopo. Sem resposta na base, passa para humano.
- Métrica: resolução confirmada; reabertura em 72h; % escalado com o motivo; tempo da primeira resposta;
  satisfação; renovação.
- Já existe: o fluxo do cliente na Central (rodadas, "Falar com a M&O", lembretes), as páginas "Como
  trabalhamos juntos".
- Falta: a base de conhecimento escrita (dá para fazer já, como o Koe: a IA entrevista o sócio e escreve
  os artigos), o canal ligado, as regras de escalonamento.

### Sistema

**12. Operações e Financeiro**
- Missão: vigiar a esteira (prazos, onde travou, carga do time), contratos e renovação, cobrança
  (rascunho do lembrete de fatura vencida), o custo dos próprios agentes.
- Nunca sem o sócio: cobrança e qualquer valor.
- Métrica: tarefas atrasadas; dias de atraso de pagamento; custo dos agentes no mês.

**13. Conhecimento**
- Fractal: a agente de conhecimento e documentação. MVB-OS: o Curador.
- Missão: manter a base (processos, playbooks, a skill mo-agency), destilar o feedback do sócio em regra,
  consolidar a memória.
- Já existe: o Curador, o `/aprender` e a destilação do MVB-OS.

### Como o vídeo e o Koe se encaixam no time

| no vídeo do Fractal | no Koe | na M&O |
|---|---|---|
| chefe de gabinete, orquestrador | estrategista semanal | Chefe de Gabinete |
| marketing, social media | estrategista de marca e de conteúdo | Marca e Conteúdo |
| product designer | especialistas de texto longo e curto | Produção |
| SDR | consultor de oferta | SDR e Comercial |
| prospecção ativa | (fora do modelo) | Prospecção ativa |
| growth lead, tráfego pago | estrategista de marketing | Growth e Tráfego |
| product lead (escopo) | (fora do modelo) | Estrategista de Conta |
| especialista de onboarding e suporte | agente de suporte | CS e Suporte |
| conhecimento e documentação | biblioteca do Eden | Conhecimento e Analista |
| engenheiro líder | (fora do modelo) | Engenharia de Automação |

---

## 5. O que construir, e em que ordem

### A fundação, antes de qualquer agente

1. **O formato do agente**: um arquivo por agente com identidade, papel, missão, quem é o líder, o que lê
   e o canal, no molde do `agent.md` (o MVB-OS já usa um parecido).
2. **Memória por agente**, uma memória por registro, com categoria, confiança e "substitui a anterior"
   em vez de apagar. O `learnings.md` e a destilação dos feedbacks do MVB-OS são a versão em arquivo
   disso.
3. **Tarefa com a etapa "Sugestão"** antes do backlog e "Em revisão" antes de concluir, na área do sócio
   da Central.
4. **Uma fila de aprovação só**, que o sócio resolve pelo celular.
5. **Rotinas com gatilho** (horário, evento, webhook), dono e histórico de execuções, no lugar dos
   cartões fixos da página Automações.
6. **O canal do sócio**: áudio no WhatsApp ou no Telegram com o Chefe de Gabinete.
7. **Autonomia progressiva por agente**, nas três fases do `SISTEMA-APRENDIZADO.md` do MVB-OS (aprova
   tudo, amostragem, autônomo), com o recuo automático quando ele erra três vezes seguidas.
8. **Teto de custo por agente** e o custo do mês visível.
9. **O aviso de IA** para todo agente que fala com lead ou cliente, depois da revisão jurídica.

### Como montar cada agente (os três passos do Koe)

1. Juntar referências do que é bom naquele papel.
2. Escrever o processo da M&O (o arquivo do agente e a skill dele).
3. Iterar: começa na fase 1, com o sócio aprovando tudo, e sobe de fase pelo critério.

### As ondas

| onda | quando | agentes |
|---|---|---|
| fundação | antes de tudo | os nove itens acima |
| 1. vender | agora, com zero cliente | Chefe de Gabinete, Comercial, Marca e Conteúdo com a Produção, SDR ligado |
| 2. primeiro cliente | quando assinar | CS e Suporte, Estrategista de Conta, Analista, Growth em modo leitura |
| 3. escala | com três clientes ou mais | Prospecção ativa, Engenharia de Automação, Operações e Financeiro, Conhecimento formal |

A base de conhecimento do CS pode ser escrita na onda 1, porque custa uma conversa do sócio com a IA.

### Onde isso aparece na Central M&O

A Central continua sendo do time e do cliente. A camada de agentes aparece só para o sócio:

- os agentes entram na Equipe, com papel, missão e memória, e podem ser donos de etapa da esteira;
- as tarefas propostas por agente ficam em "Sugestão" até o sócio aprovar;
- a página Automações vira a lista de rotinas, com gatilho, dono e histórico;
- uma tela de aprovação junta tudo que espera o sócio.

---

## 6. O que depende do Pedro

1. **Custo variável.** Em 25/09 a decisão foi custo variável zero. Agente que trabalha sozinho em rotina
   gasta tokens a cada execução, e o WhatsApp passou a cobrar a mensagem de serviço depois das 1.000
   grátis do mês. No volume de uma agência pequena a conta é de dezenas de dólares por mês, e precisa de
   teto por agente.
2. **O aviso de IA no SDR**, que hoje se apresenta como Pedro ou Bruno.
3. **Conta de API** para os agentes que trabalham para o negócio. O copiloto pela assinatura dele vale
   só para o uso dele.
4. **Usar o Fractal ou construir**: a recomendação é construir sobre o MVB-OS e a Central, e reavaliar o
   Fractal daqui a seis meses.
5. **Nomes para os agentes**, se ele quiser (o Felipe Barcelos dá nome a cada um).

## Limites desta pesquisa

- Quase tudo sobre o Fractal vem do próprio fabricante; o motor é fechado, e os mapas de fonte do binário
  não foram abertos porque a licença proíbe.
- Os casos de SDR que mais impressionam (SaaStr, Relevance) são autodeclarados. Para proposta, onboarding,
  vídeo e gestão de projeto, não há caso verificável.
- Os números de receita do Koe são declarados por ele.
- A data do AI Act precisa de confirmação com advogado.
