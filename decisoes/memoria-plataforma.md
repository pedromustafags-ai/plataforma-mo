---
name: plataforma-mo-sistema-proprio
description: "Plataforma de gestão própria da M&O (substitui Notion, ClickUp e o Trello), decisões de 25/09/2026 e onde está o protótipo"
metadata:
  node_type: memory
  type: project
  originSessionId: ab2d7709-f116-409b-a64f-d0018981c666
  modified: 2026-09-29T01:52:23.609Z
---

Em 25/09/2026 o Pedro decidiu construir um **sistema próprio de gestão para a M&O**, separado do
MVB-OS, que substitui o Notion, o ClickUp e o Trello da M&O. O foco declarado dele é
**usabilidade do time e dos clientes**, com o front muito bem construído.

A referência que ele mostrou é o sistema da Strag (`sistema-strag-v3.netlify.app`, do Rafael
Politi). O que o vídeo dele mostrou que **não se copia**: 21 de 24 tarefas atrasadas (ninguém
atualiza), 6 de 9 aprovações marcadas como invisíveis ao cliente (a aprovação acontecia no
WhatsApp), relatório medindo custo por lead e cliente tratado como filtro em vez de área própria.

**Decisões dele (25/09):**
- Níveis de login: colaborador vê o painel interno com todos os clientes; cliente vê só a própria
  área. Eu propus um terceiro nível, **Sócio** (cadastra cliente, convida, apaga). **Ainda não
  confirmado por ele.**
- Área do cliente no idioma de cada cliente; o time usa em português.
- Marca M&O nos temas claro e escuro, com cores de status discretas (a marca não tem acento).
- Aba Processos do cliente = duas páginas: processo de vendas dele + como trabalhamos juntos.
- Primeiro cliente no teste: a **própria M&O (cliente zero)**. Nada de cliente inventado.

**Protótipo clicável v1:** https://claude.ai/artifact/8isLH3dQCDxv73eQGtguWV (fonte recuperável
por `Artifact read`). Critério de pronto combinado: cliente aprova um post pelo celular, a partir
do link do WhatsApp, em menos de 30 s sem ajuda; alguém do time acha e atualiza a própria tarefa
em menos de 10 s.

**v2 publicada em 25/09 no mesmo link**, depois de o Pedro achar a v1 "simplória, principalmente o
menu lateral" (registro em `pedro/feedbacks/2026-09-25-plataforma-mo-menu-simplorio-e-modulos-novos.md`).
Entraram: barra lateral com visões globais (Tarefas, Postagens, Roteiros, Calendário, Reuniões) +
favoritos + personalização, quadro branco próprio (post-it vira tarefa), funis estilo Funnelytics
com custo por reunião agendada e custo por conversa do agente, Reuniões lendo Google Agenda e
Tactiq de verdade pelo `mcp` do artifact, Automações, e Copiloto com o Claude (`sample` + ferramentas
que respeitam o nível de acesso).

**O que a pesquisa de 25/09 decidiu ou deixou em aberto:**
- Transcrição: o Tactiq **não tem API**; o MCP dele só entrega texto no plano Team. Caminho real é a
  API do Google Meet (exige Workspace Business Standard) ou o Fathom (webhook desde o plano grátis).
  **Falta saber se a M&O tem Workspace pago.**
- Gmail com escopo restrito em app externo exige avaliação CASA anual; com Workspace e app
  "Internal", fica isento.
- Quadro branco no produto: tldraw SDK (licença comercial sem preço público, pedir cotação) ou
  Excalidraw (MIT, colaboração por conta própria). Funis: React Flow (MIT).
- Meta passa a cobrar por mensagem de serviço no WhatsApp a partir de 01/10/2026, inclusive
  resposta de IA; entra no custo por reunião do funil.

**v3 publicada em 25/09 no mesmo link** (registro em
`pedro/feedbacks/2026-09-25-plataforma-mo-marca-do-cliente-temas-idiomas.md`). Decisões do Pedro:
**Gmail pessoal** (sem Workspace), **copiloto só no acesso dele**, **zero custo variável e extrema
independência**. O painel do cliente leva nome, logo, cores, tema e idioma do cliente, com
"Powered by M&O" no rodapé; 8 temas (4 claros, 4 escuros) mais o tema gerado da cor da marca;
PT/EN/ES/FR no lado do cliente; o cliente sobe logo e manual e o sistema lê cores e fontes no
navegador (PDF com texto funciona; PDF só-imagem pesado cai num aviso); IA no quadro e no funil
(texto ditado ou foto) só para o Pedro. O microfone não funciona dentro de artifact, por isso o
protótipo usa o ditado do teclado.

**v4 publicada em 25/09 no mesmo link** (registro em
`pedro/feedbacks/2026-09-25-plataforma-mo-qg-do-cliente-atas-esteira.md`). A primeira aba do
cliente virou o **QG** (números do dia, esteira em kanban, o que está com o cliente, atas, Drive,
documentos, listas). A **esteira de produção** tem dois modelos, os dois desenhados pelo Pedro:
*enxuto* (estratégia, copy, design, aprovação interna, aprovação do cliente, agendar, publicar) e
*com aprovação por etapa*, mais um de vídeo. Terminar uma etapa cria a tarefa da próxima para o
responsável configurado; na M&O todas as etapas estão com o Pedro até ele dizer quem faz o quê.
Ajuste pedido pelo cliente volta para a última etapa de trabalho. Toda reunião gera **ata interna e
ata do cliente** (no idioma dele), e a do cliente só aparece no painel dele depois de publicada.
Postagem aceita link e arquivo com prévia (YouTube, Docs, Drive, imagem, vídeo, Figma, Canva).
Dentro do artifact a prévia de YouTube e Drive vira cartão, porque a página não carrega imagem de
outro site.

**v5 publicada em 26/09 no mesmo link** (registro em
`pedro/feedbacks/2026-09-26-plataforma-mo-roteiro-com-modelos-e-livre.md`). Depois de ver a v4, o
Pedro disse que o roteiro era "a única coisa que a gente vai ter que mudar". Roteiro novo nasce
**livre** (título e texto corrido, como no Notion), com os modelos logo abaixo: seis da casa (Reel
60–90 s, criativo em 4 partes, monólogo do lead, YouTube, VSL, história em 10 batidas) e quatro
clássicos (PAS, AIDA, antes/depois/ponte, gancho/história/oferta). Cada bloco traz a instrução
como texto de fundo. O texto salva sozinho, e trocar de modelo, inclusive ida e volta pelo livre,
devolve cada trecho ao bloco de mesmo nome sem perder nada. Os rótulos são internos e em português,
como na skill `roteiro`.

**v6 publicada em 28/09 no mesmo link** (registro em
`pedro/feedbacks/2026-09-28-plataforma-mo-funil-visual-como-funnelytics.md`). O funil virou mapa no
padrão do Funnelytics, pesquisado no site, nas imagens e no código do canvas de demonstração deles.
**A forma diz a categoria:** fonte de tráfego é bolinha com a logo da marca (com "$" quando é paga),
página é um esboço desenhado de cada tipo (captura, vendas, VSL, quiz, formulário nativo, webinar,
agendamento, artigo, checkout, upsell, downsell, obrigado), conversa é quadradinho (WhatsApp,
Direct, e-mail, SMS, ligação), resultado é losango, e a reunião agendada é o losango da meta.
Qualquer página aceita o print da página real no lugar do esboço. As linhas são tracejadas e
correm no sentido do fluxo, e cada etapa mostra quantos "não seguem". As logos vêm do Simple Icons
(CC0), embutidas na página. **Quadro branco e funil continuam separados**, que é para onde o Pedro
se inclinava; o funil ganhou a nota (post-it) para anotar em cima do mapa. Fontes locais dos EUA
entraram na lista (Perfil da empresa no Google, Yelp, Thumbtack); o Nextdoor saiu porque o ícone
dele é só o nome escrito. O TikTok ficou de fora de propósito.

**v7 publicada em 28/09 no mesmo link** (registro em
`pedro/feedbacks/2026-09-28-plataforma-mo-equipe-do-cliente-navegacao-tema-claro.md`). **A equipe do
cliente entra no painel dele** (o caso que o Pedro deu foi o social media e o copywriter do Rodrigo
Gualtero): pessoa com papel "aprova" ou "produz", convidada pelo cliente no painel ou pela M&O no QG;
pode ser dona de etapa da esteira; vê a aba Produção (Kanban), a lista "Com você agora" e cria post
ou roteiro. Quem só produz não aprova. **Navegação:** toda peça do painel do cliente abre (antes não
abria nada), peça publicada guarda o link de onde saiu, o caminho da gaveta leva até a aba da peça,
os números do QG abrem o item. **Tema:** abre claro por padrão (antes seguia o sistema e abria escuro
num Mac escuro), com o menu lateral em areia; o escuro virou escolha.

**v8 publicada em 28/09 no mesmo link** (registro em
`pedro/feedbacks/2026-09-28-plataforma-mo-quadro-como-miro-e-menu-legivel.md`). **O quadro branco foi
reescrito no padrão do Miro, com mapa mental no padrão do MindMaster**, depois de pesquisa nos dois
(central de ajuda, documentação e resenhas). Tem barra de ferramentas à esquerda, barra de contexto
sobre a seleção, os "+" que criam um igual ligado, conectores reto/curvo/em ângulo com rótulo,
formas, caneta com marca-texto e borracha, molduras com apresentação, 9 modelos, carimbos, imagem,
cartão de link, colar do exterior, travar, alinhar, desfazer/refazer e minimapa. O mapa mental se
monta pelo teclado (Tab filho, Enter irmão, setas navegam) com ramos coloridos e prioridade 1–3.
**Decisão tirada da pesquisa:** clique duplo na lousa vazia NÃO cria post-it, porque o Miro tirou
isso depois de medir que 64% desses objetos eram apagados. **Menu lateral:** títulos de seção em
negrito, rodapé fixo com as opções no menu do nome (numa tela de 720 px o menu escondia metade do
conteúdo), "Novo cliente" escrito em vez de um "+" solto, e os favoritos renomeados para "Funil de
vendas" e "Quadro branco" a pedido dele.

**v9 publicada em 28/09 no mesmo link** (registro em
`pedro/feedbacks/2026-09-28-plataforma-mo-cor-do-cliente-formato-do-post-mapa-livre.md`).
- **Barra lateral no painel do cliente**, no padrão do GoHighLevel. No celular continua a barra de
  baixo, com as mesmas cores.
- **O Personalizado vale nos dois lados**, a pedido dele: painel do cliente e Aparência do time.
  - São 7 cores, uma para cada parte da tela. Três ficam à vista (fundo da barra, texto da barra e
    destaque) e quatro em "Ajustar mais cores".
  - Cada cor entra por hex, RGB, seletor ou cor da marca. O automático calcula o contraste, e um
    aviso com "Corrigir" aparece quando a combinação fica ilegível.
  - Subir a identidade visual distribui as cores sozinho.
- **O post escolhe entre 8 formatos.** A arte que sobe sugere o formato, sem sobrescrever o que foi
  escolhido à mão.
- **A prévia recebe arquivo ou link.**
  - Arquivo: imagem, PDF (cada página vira slide), ZIP e vídeo.
  - Link de pasta ou de apresentação do Drive vira prévia pelo conector, só dentro do claude.ai.
  - Canva, Figma, YouTube e página comum viram cartão.
- **O mapa mental ganhou posição livre.**
  - Arrastar move o tópico junto com os filhos. Soltar em cima de outro tópico troca o pai, e ⌥
    só move.
  - Tem espaçamento do mapa inteiro, "voltar à posição automática", ⌥+setas, ⌘⇧↑/↓ e ⇧Delete.
- **Decisão tirada da pesquisa:** o GHL não tem seletor nativo de cor da barra (as agências usam
  CSS). O MindMaster só deixa mover livre com uma opção ligada; aqui a posição livre é o padrão.
- **Não rodou ao vivo:** o caminho do Drive dentro do claude.ai. O formato da resposta foi
  conferido por chamada real; a exportação de Docs e Slides em PDF, não.

**No GitHub desde 29/09:** repositório privado `github.com/pedromustafags-ai/plataforma-mo`, cópia local em
`~/Downloads/plataforma-mo`. Tem a página publicada, a fonte da v1 à v9 (`fonte/`, com `build.py` que remonta
a página a partir de `src.html` e dos logos em `fonte/logo/`), as falas do Pedro, os handoffs, esta memória e as
pesquisas (`decisoes/`). Ao mudar a plataforma, atualizar também o repositório.

**Arquitetura de custo fixo que a pesquisa recomendou:** VPS Hetzner CX33 + backup + Storage Box
(~€15/mês), Next.js + Postgres + Better Auth (link mágico e OAuth do MCP), Excalidraw + Hocuspocus
no quadro, arquivos no disco, e-mail Brevo com Resend de reserva. O copiloto do Pedro entra como
conector MCP no Claude dele: os termos da Anthropic **proíbem** estender a assinatura ao time, o
que torna "copiloto só do Pedro" também uma regra de termo, não só de custo.

**Why:** a plataforma é também material de demo da M&O (mostra estrutura sem precisar de caso,
respeitando a trava do zero cliente da skill `mo-agency`). As ferramentas que ela substitui estão
em [[trello-pela-api-da-sessao]] e [[clickup-qg-do-evento-rodrigo]].
**How to apply:** em aberto com ele: quem mantém a infra (~€15/mês) e se a aprovação do cliente
fica em dois estados (aprova/pede ajuste) ou quatro. Próximo passo é o Pedro navegar o protótipo e testar com o Bruno e com alguém de
fora; só depois stack real (Next.js, Supabase com segurança por linha, repo próprio, fora do
MVB-OS).
