# Navegação, funções que faltam e experiência do cliente

Pesquisa de 30/09/2026, feita sobre a v11, antes de qualquer versão nova. O pedido do Pedro: *"Antes de
qualquer coisa, vamos entender e pesquisar e entender melhor sobre a navegabilidade. E entender se há
alguma funcionalidade que está faltando. E entender como melhorar a experiência do cliente também."*
Na mesma mensagem ele respondeu às três perguntas abertas: o Sócio fica, o cliente pode pedir até 2
ajustes por peça, e a infraestrutura já está contratada.

Duas frentes: um passeio pelo protótipo, clicando como Sócio, como colaborador e como cliente no celular
(375 × 812), com a fonte aberta ao lado para separar defeito de escolha; e seis levantamentos externos em
paralelo (navegação, aprovação em ferramentas de redes sociais, proofing e portais de cliente, limite de
rodadas, o lado do cliente, funções de plataforma de agência).

## O que o passeio mostrou

Os dois critérios de pronto combinados em 25/09:

- **Alguém do time acha e atualiza a própria tarefa em menos de 10 s: passa.** O colaborador abre em Meu
  dia, e a tarefa se atualiza em 2 cliques (abrir e trocar o status, ou marcar o círculo).
- **O cliente aprova um post pelo celular, a partir do link do WhatsApp, em menos de 30 s: não passa.**
  Com o painel aberto, aprovar é uma rolagem e um toque. O problema vem antes: o link cai numa tela que
  pede o e-mail e manda um link de acesso, então o cliente sai do WhatsApp, abre o e-mail e volta.

Os defeitos, cada um conferido na fonte:

1. **O link não é o acesso.** Tela "Entre no seu painel" pedindo e-mail antes de qualquer coisa. O campo
   diz `you@company.com` numa página em português.
2. **O ajuste aceita um slide e um texto por envio** (`decide(k, id, ok, text, slide)`). Com o limite de 2,
   o cliente precisa juntar tudo numa rodada, e a tela não deixa. Também não há contador de ajustes.
3. **A barra de baixo do cliente tem 7 abas**, de 52 px cada, e os rótulos cortam ("Calendá…", "Process…").
   Para você, Produção, Conteúdo e Calendário mostram as mesmas peças de quatro jeitos. A Produção no
   celular é um kanban com rolagem lateral. O "Pedir algo" vira só um "+" sem texto no celular.
4. **O endereço da página nunca muda.** Não há `pushState` nem `hashchange` na fonte; o `go()` troca a tela
   sem histórico. O Voltar do navegador sai da plataforma, e nenhum link aponta para uma peça ou tarefa.
5. **O Sócio abre na Visão geral, que o menu não mostra.** Numa tela de 1366 × 820, a barra tem 1.021 px
   de altura para 820 visíveis; a seção Empresa inteira fica abaixo da dobra e o item ativo (y = 781) fica
   atrás do rodapé fixo.
6. **"Novo → Post" e "Novo → Roteiro" fora de um cliente caem no primeiro cliente sem perguntar**
   (`db.clients[0]`), e a gaveta do post não tem campo de cliente para corrigir. A tarefa pergunta. Com um
   cliente só isso não aparece; com o segundo, vira post no lugar errado.
7. **O cliente não vê resultado.** O painel mostra o que foi feito e nada do que isso rendeu.

A barra do time tem 17 itens de primeiro nível, e cada cliente aberto na árvore soma 12, que repetem as
12 abas que a página do cliente já tem no topo.

## Navegação

- **Teto de 5 destinos na barra de baixo do celular.** Material 3, Apple HIG e NN/g concordam; a Apple
  avisa que a aba "Mais" esconde o que vai para dentro dela e que a barra de abas é para navegar, não para
  ação. **Forte.**
- **Navegação escondida mede pior.** NN/g (2016, 179 pessoas, 6 sites): descoberta caiu mais de 20% e o
  desktop ficou pelo menos 39% mais lento. O trilho só de ícones deve ser opção, nunca o padrão. É estudo
  com sites, evidência indireta. **Forte.**
- **A busca acelera e não substitui o menu.** Em média 14% das pessoas começam pela busca (Sauro,
  MeasuringU, mais de 1.500 pessoas; outros estudos de 5% a 30%). O ⌘K fica, com os recentes na paleta
  vazia. **Forte.**
- **Personalizar não conserta uma ordem de fábrica ruim.** Menos de 5% mudam configuração (Spool, fonte
  única para o número; a NN/g confirma de forma qualitativa). **Forte.**
- **Navegação do projeto aparece depois de entrar nele** (Linear, Teamwork), em vez de uma árvore com as
  sub-abas de todos. Abas demais numa entidade viram carrossel e escondem opção (NN/g, 2024). **Forte no
  princípio; o agrupamento proposto é hipótese.**
- **"Você está aqui" é o erro mais comum de menu** (NN/g, 2024). O item ativo escondido atrás do rodapé é
  esse erro.
- **Home de ação**: Basecamp, Asana, Linear, ClickUp (renomeou Home para My Tasks) e Teamwork abrem no que
  é seu. Não achei estudo comparando com painel de números.
- **Com 3 a 10 clientes, lista visível na lateral.** O monday escondeu num menu e os usuários pediram 5 a 7
  sempre visíveis; o Asana virou hover e quem gerencia muitos reclamou. O corte para trocar por seletor com
  busca (algo como 15 a 20) é inferência. **Fraca.**
- **Toda reforma de lateral que achamos provocou rejeição** (Asana 2015, que ofereceu voltar atrás; Asana
  2023; ClickUp 4.0; monday). A hora de fechar a navegação é antes de o time se acostumar.

## Experiência do cliente

**Acesso.** O link por pessoa que já é o acesso é o padrão de quem faz portal: Assembly (ex-Copilot, 3
dias ou um uso, dentro de toda notificação), Moxo (72 h, reenvia sozinho), Ziflow (a URL privada é a
identidade de quem abre), HoneyBook e Dubsado (só o e-mail). As que exigem conta (ClickUp, Notion,
Teamwork, Loomly) são as que geram fricção. Risco medido no Ziflow: quem recebe um link encaminhado age no
nome do revisor original. Por analogia, 18% já abandonaram uma compra por não querer criar conta (Baymard,
2025, 1.026 adultos).

**Aprovação.** O que as ferramentas de proofing têm e as de redes sociais não:
- comentário preso num ponto da imagem (Filestage, Ziflow, ManyRequests, Moxo; nenhuma das 9 de redes
  sociais tem);
- comparação de versões, lado a lado ou sobreposta (Filestage, Ziflow com "Auto Compare");
- aprovação em lote (Filestage, Ziflow, ContentStudio, GoHighLevel; o Sprout diz que não tem);
- "Approved with changes" no Ziflow: aprova e pede um detalhe pequeno, sem versão nova.

**Prazo vencido.** Nenhuma das ferramentas lidas aprova sozinha, exceto o SocialPilot, e só com a opção
ligada. Sprout, Hootsuite, ContentStudio e Loomly não publicam sem aprovação; o Later publica. Contratos
de design (AIGA, AMI) tratam o silêncio como aceite; a Apaya pede aprovação explícita para o que sai em
nome do cliente, que é o caso de social media.

**O limite de 2 ajustes.**
- **O que é uma rodada** tem consenso em cinco fontes independentes (ProCopywriters, Creator Essentials,
  Creative Bloq, Really Good Designs, Kontentino): uma lista consolidada, enviada de uma vez, respondida com
  uma versão nova. Comentário em gotas conta como várias.
- **Duas rodadas** é o número mais repetido em contratos e modelos, sempre como opinião, nunca medido.
- **Não conta como ajuste**: corrigir erro da agência (Fiverr, Creative Bloq). **Vira peça nova**: mudança
  de direção (AIGA, "change of concept" do Fiverr, FemFounded).
- **Ninguém implementa o limite na interface.** Nenhuma das cerca de vinte ferramentas lidas limita rodadas
  nem mostra "último ajuste incluído". O Fiverr, que vende revisões no pacote, deixa o botão ativo depois
  que elas acabam. O texto do contador vai ser nosso.
- **O que se faz no 3º pedido**: cobrar à parte (AIGA, Contract Killer, ProCopywriters); abater do mês
  seguinte (ManyRequests); pausar e realinhar com o briefing (Postly, Kontentino); reclassificar como peça
  nova; absorver de vez em quando (Creative Bloq). Quase 80% das agências raramente cobram o que passa do
  escopo (Ignition 2025, mais de 270 agências, patrocinada, fonte única). **"O Sócio libera o 3º" não
  aparece em nenhuma fonte.**
- **O limite faz o cliente consolidar**, dizem Sked e Fiverr, sem medir.

**Avisos.**
- A queixa mais repetida em reviews de portal é mensagem demais (Gain, Content Snare, Planable).
- Notificação agrupada três vezes por dia deixou as pessoas mais atentas e no controle; sem notificação
  nenhuma, mais ansiosas (Fitz et al., 2019, ensaio randomizado, 237 pessoas).
- Lembrete funciona, mas lembra quem já ia responder (Van Mol, 2016; Cochrane 2013 com SMS).
- **Canal por país:** o WhatsApp está em 99% dos smartphones no Brasil (Mobile Time/Opinion Box, fev/2025)
  e é usado por 32% dos adultos nos EUA (Pew, 2025). O critério "a partir do link do WhatsApp" serve ao
  cliente brasileiro; o americano precisa de e-mail ou SMS.
- **Custo:** pela API da Meta, fora da janela de 24 h só vale template, e template é cobrado por mensagem
  desde 01/07/2025. Link mandado à mão pelo WhatsApp Business não passa por essa regra. **Divergência a
  conferir:** a memória da plataforma diz que a mensagem de serviço passa a ser cobrada em 01/10/2026, e a
  página de preços da Meta lida em 30/09 diz que é grátis.

**Transparência e resultado.**
- Por que o cliente sai: entrega (61%) e valor (61%) na voz do cliente; 75% das agências acham que é
  orçamento (Setup 2025; é uma agência, amostra de empresas grandes).
- Mostrar o processo aumenta o valor percebido, com o mesmo resultado (Buell e Norton, 2011; Buell, Kim e
  Tsay, 2017; fora de agência). Sustenta manter a Produção visível ao cliente.
- 82% precisam de evidência objetiva de que o marketing funciona, e 81% ficam mais confiantes quando a
  métrica de sucesso é definida no começo (AMI/Audience Audit 2026, 400 decisores).
- 78% das agências trabalham com 1 a 3 metas numéricas por cliente (Databox, 241 agências).

**Primeiro acesso.** Formulário de entrada antes do kickoff, pedindo ativos, metas, contatos e acessos num
pedido só (Assembly, ManyRequests, Content Snare). Acesso por parceria, nunca por senha: os termos da Meta
proíbem compartilhar senha, e o caminho oficial é o acesso de parceiro no portfólio empresarial; no Google
Ads, convite ou conta de administrador.

## Funções que faltam

Contagem sobre 12 plataformas de agência (Productive, Teamwork, Function Point, Scoro, Accelo, Workamajig,
Bonsai, SuiteDash, Plutio, Moxo, ManyRequests, AgencyAnalytics), pela página de funções; contagem baixa é
piso.

| Função | Para a M&O | Por quê |
|---|---|---|
| CRM da própria M&O | Agora, enxuto, ou integração | Pipeline é o problema nº 1 em todos os portes (AMI 2025, 778 líderes); 43% dizem que achar cliente está mais difícil que nunca. Se os leads já vivem no CRM do agente de WhatsApp, integrar |
| Formulário de entrada do cliente | Agora | O checklist interno já existe; falta o lado do cliente |
| Relatório mensal de uma página | Agora | Trabalho feito + 1 a 3 números do Meta Ads pela API, com a régua do custo por reunião agendada |
| Pacote do mês (recorrência) | Agora | O escopo do contrato monta a esteira do mês e impede entregar além do fee (dedução, sem fonte) |
| E-mail como canal de aviso | Agora | Cabe em plano grátis e é o canal do cliente dos EUA |
| Registro do contrato | Agora | Valor, início, renovação, escopo; base para rentabilidade |
| Horas leves, rentabilidade, publicação automática, verba de mídia, PWA, Google Ads | Depois | |
| Timesheet obrigatório, agenda de recursos, nota e cobrança, cofre de senhas, DAM, offline, chat interno, dependências genéricas, WhatsApp automático pela API | Nunca | Custo variável, peso de manutenção, ou ferramenta pronta resolve |

Correções à lista do que "não tem": a carga por pessoa já está na Visão geral; o prazo por etapa já existe
e gera "Onde travou" com "Lembrar o cliente"; o checklist de onboarding já nasce sozinho no cadastro.

O risco maior é somar módulo: a reclamação mais repetida contra o ClickUp na Capterra é peso, semanas de
configuração e automação que quebra. Cada função nova precisa preservar os dois critérios de pronto.

## Limites desta pesquisa

- O Reddit ficou bloqueado para as ferramentas de leitura, e o G2 devolveu 403. Nenhuma conclusão vem de lá.
- A cota de busca acabou no meio dos seis levantamentos; o resto foi lido direto nas centrais de ajuda.
  "Não encontrado" quer dizer que não estava nas páginas lidas.
- Os estudos de navegação com número (NN/g, MeasuringU, Spool) foram feitos com sites, não com ferramentas
  de gestão.
- Muito do que se sabe sobre portal vem de fornecedor. A página de venda mostra que a função existe, não
  que importa.

## Fontes principais

Navegação: NN/g ([navegação vertical](https://www.nngroup.com/articles/vertical-nav/),
[navegação local](https://www.nngroup.com/articles/local-navigation/),
[menu](https://www.nngroup.com/articles/menu-design/), [abas](https://www.nngroup.com/articles/tabs-used-right/),
[navegação escondida](https://www.nngroup.com/articles/find-navigation-desktop-not-hamburger/),
[você está aqui](https://www.nngroup.com/articles/navigation-you-are-here/)),
[Material 3](https://developer.android.com/develop/ui/compose/components/navigation-bar),
[MeasuringU](https://measuringu.com/?p=121),
[Spool](https://archive.uie.com/brainsparks/2011/09/14/do-users-change-their-settings/),
[ClickUp 4.0](https://clickup.com/blog/clickup-4-0/),
[fórum do ClickUp, "too many clicks"](https://feedback.clickup.com/feature-requests/p/bad-design-choices),
[Asana 2015](https://asana.com/inside-asana/more-navigation-improvements),
[Linear](https://linear.app/changelog/2024-12-18-personalized-sidebar),
[Basecamp](https://updates.37signals.com/post/new-refined-home-screen-participation-types),
[Teamwork](https://support.teamwork.com/projects/efficiency/switch-project-menu).

Acesso e aprovação: [Assembly, magic links](https://assembly.com/docs/core-concepts/magic-links),
[Moxo](https://support.moxo.com/articles/1652847917-invite-new-clients),
[Ziflow, links](https://help.ziflow.com/hc/en-us/articles/46691629361684-How-do-Ziflow-proof-links-work),
[Ziflow, comparar versões](https://help.ziflow.com/hc/en-us/articles/30725270836372-Compare-proof-versions),
[Filestage, lote](https://help.filestage.io/en/articles/7325349-review-multiple-files-at-once),
[Sprout](https://support.sproutsocial.com/hc/en-us/articles/205974715),
[SocialPilot](https://help.socialpilot.co/article/573-how-do-i-add-clients-to-my-team),
[Later](https://help.later.com/hc/en-us/articles/40954654500375),
[GoHighLevel](https://help.gohighlevel.com/support/solutions/articles/155000007623-external-link-approval-flow-in-social-planner),
[Baymard](https://baymard.com/blog/current-state-of-checkout-ux).

Rodadas: [ProCopywriters](https://www.procopywriters.co.uk/guidance/feedback-revisions/),
[Kontentino](https://www.kontentino.com/blog/social-media-client-approval/),
[Creative Bloq](https://www.creativebloq.com/career/stop-endless-revisions-81412587),
[AIGA](https://aiga.org/resources/aiga-standard-form-of-agreement-for-design-services),
[Apaya](https://apaya.com/blog/social-media-management-contract),
[Fiverr](https://help.fiverr.com/hc/en-us/articles/37332473202065),
[ManyRequests, créditos](https://help.manyrequests.com/en/articles/9229229-how-to-create-credit-based-services),
[Ignition](https://www.ignitionapp.com/2025-agency-pricing-cashflow-report).

Cliente: [Setup](https://setup.us/blog/why-do-clients-end-agency-relationships-8-years-of-surveys-point-to-a-clear-pattern),
[AMI 2026](https://agencymanagementinstitute.com/wp-content/uploads/2026/05/AgencyEdgeReport26.pdf),
[Buell e Norton](https://doi.org/10.1287/mnsc.1110.1376), [Fitz et al.](https://doi.org/10.1016/j.chb.2019.07.016),
[Pew 2025](https://www.pewresearch.org/internet/2025/11/20/americans-social-media-use-2025/),
[Mobile Time](https://www.mobiletime.com.br/pesquisas/assistentes-de-ia-e-mensageria-movel-no-brasil-fevereiro-de-2025/),
[Meta, preços do WhatsApp](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing),
[Databox](https://databox.com/state-of-agency-client-collaboration).

Funções: [AMI 2025](https://agencymanagementinstitute.com/wp-content/uploads/2025/05/The-2025-Agency-Core-Research-Report.pdf),
[Capterra, ClickUp](https://www.capterra.com/p/158833/ClickUp/reviews/),
[Meta, Insights](https://developers.facebook.com/docs/marketing-api/insights),
[Meta, publicação](https://developers.facebook.com/docs/instagram-platform/content-publishing),
[Meta, acesso de parceiro](https://www.facebook.com/business/help/1717412048538897).
