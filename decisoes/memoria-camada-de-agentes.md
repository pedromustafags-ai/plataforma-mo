---
name: fractal-camada-de-agentes-do-socio
description: "O Fractal como referência da camada de agentes que só o sócio da M&O vê (versão futura), como ele é construído e organizado, e o time de 13 agentes desenhado para a M&O"
metadata:
  node_type: memory
  type: project
  originSessionId: a0005993-0a2f-4fd3-9d46-9f19302140e9
  modified: 2026-10-01T14:08:02.972Z
---

Em 01/10/2026 o Pedro decidiu que uma camada no estilo do **Fractal** (tryfractal.co, de Felipe
Barcelos, Vibe Dev, Nubler Digital) é **o que o sócio vê** na M&O: agentes de IA como membros do time,
por trás da [[plataforma-mo-sistema-proprio]]. A Central continua sendo do time e do cliente. **Não entra
na versão atual**; é para mais à frente. Ele pediu para guardar como o Fractal é construído e organizado,
e para desenhar quais agentes a agência precisa, pela estrutura do One Person Business do Dan Koe.

**Não confundir os dois Felipes:** Felipe Barcelos fez o Fractal; o Felipe da M&O desenvolve o agente de
WhatsApp.

**Como o Fractal é feito (lido no repositório público, no pacote npm e nos tipos do SDK, sem executar):**
- Local-first, dois binários fechados (CLI e gateway) instalados pelo npm; app em Electron; agente
  sobre o Vercel AI SDK; sem banco de dados, tudo em arquivos Markdown/YAML dentro de `.fractal/`.
- Organização: `agents/{id}/agent.md` (frontmatter com papel, líder, modelo, canais, orquestrador; o
  corpo é o prompt), `agents/{id}/memories/` (uma memória por arquivo, imutável, corrigida por
  "supersedes"), `skills/<skill>/SKILL.md` com ferramentas em código, `tasks/FRA-xxx/TASK.md` com
  worktree, `routines/`, `goals/`, `artifacts/`, `instructions/`.
- Tarefa com 8 estados, começando em **sugestão** e passando por **em revisão**; rotina com gatilho
  (horário, evento, webhook), dono e histórico; um orquestrador por workspace; canal Telegram.
- Motor sob licença proprietária (sem fork); SDK de plugins e skills sob MIT. Alpha desde 05/2026,
  pouca tração, contradições na documentação de segurança.

**Recomendação registrada:** construir a camada própria sobre o MVB-OS e a Central, usando o Fractal só
como referência de organização, e reavaliar o Fractal em seis meses. O MVB-OS já tem a maior parte do
desenho em arquivo: agent.md, learnings.md, destilação de feedback, portões e autonomia em 3 fases.

**O time desenhado (13 agentes, 7 camadas, 3 ondas):** Direção (Chefe de Gabinete); Marca (Marca e
Conteúdo, Produção com copy, design e vídeo); Oferta (Comercial, pedido do Pedro); Distribuição (SDR que
já existe, Prospecção ativa, Growth e Tráfego); Entrega (Estrategista de Conta, Analista, Engenharia de
Automação); Retenção (CS e Suporte, pedido do Pedro, a única porta do cliente); Sistema (Operações e
Financeiro, Conhecimento). Onda 1, com zero cliente: os que vendem. Onda 2, no primeiro cliente: CS e
Suporte, Estrategista de Conta, Analista, Growth. Onda 3: o resto.

**Decisões pendentes do Pedro:** custo variável (contra a decisão de 25/09 de custo zero); **aviso de IA
no SDR que se apresenta como Pedro ou Bruno** (AI Act art. 50 desde 02/08/2026; Califórnia §17941),
para revisão jurídica; conta de API para agentes do negócio; usar o Fractal ou construir; nomes dos
agentes.

**Onde está o detalhe:** página https://claude.ai/artifact/MyyaViyPCeW9BehkaqAi5M e o registro completo
em `plataforma-mo/decisoes/pesquisas/2026-10-01-fractal-e-time-de-agentes.md`. Fala do Pedro em
`pedro/feedbacks/2026-10-01-plataforma-mo-fractal-camada-de-agentes-do-socio.md`.

**Why:** o Pedro quer operar a M&O como agência de uma pessoa só, com o sócio comandando agentes, e
quer essa base pronta quando chegar a hora.
**How to apply:** antes de desenhar qualquer agente, a área do sócio da Central ou a versão de verdade,
partir deste time e da fundação de nove itens da pesquisa; não propor depender do Fractal sem reavaliar
licença, tração e segurança. A régua do Koe para o que fica humano (escolher as ideias, a voz, a edição
final e a decisão) está na nota `Pedro_Second_Brain/Conhecimento/wiki/dan-koe-purpose-and-profit.md`.
