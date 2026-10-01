# Central M&O

Protótipo clicável da plataforma de gestão da M&O Company, com a central do time e o painel de cada
cliente, pensada para substituir Notion, ClickUp e Trello. Os dados são de exemplo, tirados do
trabalho real da M&O, e nada é salvo em servidor: recarregar a página volta ao começo.

- **No ar:** https://claude.ai/artifact/8isLH3dQCDxv73eQGtguWV (versão 12, 30/09/2026)
- **Este repositório** guarda a cópia exata da versão publicada, para versionar e para servir de ponto
  de partida da versão de verdade.

## Como abrir

A página carrega as imagens da pasta `img/`, então precisa de um servidor local. Na pasta do
repositório:

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000 no navegador e escolha um dos acessos de exemplo na tela de entrada.

## O que tem neste repositório

| Caminho | O que é |
|---|---|
| `index.html` | A página publicada, idêntica à que está no ar. |
| `img/` | As 51 artes dos carrosséis da M&O usadas nos posts de exemplo. |
| `fonte/` | A fonte de todas as versões, da v1 à v12, com os scripts que montaram cada uma. O guia está em `fonte/COMO-FUNCIONA.md`. |
| `decisoes/` | O porquê de cada escolha: as falas do Pedro volta a volta, os handoffs, a memória da plataforma e as pesquisas. O índice está em `decisoes/README.md`. |

## O que só funciona dentro do claude.ai

O protótipo roda como artifact do Claude. Aberto fora dele, estas partes ficam desligadas e a página
avisa:

- as reuniões lidas do Google Agenda e do Tactiq, e a busca no Drive e no Gmail;
- o link do Drive que vira prévia do post;
- o copiloto, a ata por IA e o desenho por IA no quadro e no funil.

## O que tem, até a versão 12

- Central do time: meu dia, caixa de entrada, visão geral, tarefas, postagens, roteiros, calendário,
  reuniões, quadros, funis, processos internos, equipe e automações.
- Painel de cada cliente com a marca e o idioma dele (português, inglês, espanhol e francês), barra
  lateral nas cores que ele escolher e a equipe dele dentro.
- Esteira de produção com passagem automática de etapa, e aprovação do cliente pelo celular.
- Post com 8 formatos e uma prévia que recebe imagem, PDF, ZIP, vídeo ou link.
- Roteiro com 10 modelos ou em texto livre.
- Funil no padrão do Funnelytics, em dois estilos: só o caminho, para mostrar ao cliente, ou com o
  custo de cada reunião agendada.
- Quadro branco no padrão do Miro, com 16 modelos (entre eles funil, pirâmide, ciclo e matriz de
  prioridade), mapa mental dos dois lados com posição livre, e cor livre em todas as paletas.
- Cadastro do cliente com logo, ícone, cores e nicho, e uma aba Sobre com a bio do cliente, só do time.
- O cliente vê na produção só as etapas que o time liga para ele, adiciona os próprios links e avisa o
  time do que faz.
- Histórico de tudo o que cada pessoa mudou, do time e dos clientes, para os sócios consultarem.
- Um endereço por tela: o Voltar do navegador funciona, e o link do cliente abre direto na peça a aprovar,
  sem tela de login.
- Duas rodadas de ajuste por peça, cada uma com quantos comentários o cliente quiser, presos ao slide ou a um
  ponto da imagem; no terceiro pedido, "Falar com a M&O", e um sócio decide.
- Formulário de entrada, criar acesso com senha opcional, relatório do mês (aba Resultados) e o pacote do
  contrato, que monta o mês e avisa quando passa do contratado.

## Histórico das versões

Todas publicadas no mesmo link, entre 25 e 29/09/2026. O detalhe de cada uma está em
`decisoes/memoria-plataforma.md` e no registro de feedback correspondente.

- **v1 (25/09):** central da empresa, central por cliente e dois níveis de acesso (time e cliente).
  Primeiro cliente de teste: a própria M&O, o cliente zero.
- **v2 (25/09):** depois do Pedro achar a v1 "simplória". Barra lateral com visões globais, favoritos
  e personalização; quadro branco em que o post-it vira tarefa; funis com custo por reunião agendada;
  reuniões lendo Google Agenda e Tactiq; automações; copiloto com o Claude.
- **v3 (25/09):** o painel do cliente com nome, logo, cores, tema e idioma dele (PT, EN, ES, FR), e
  "Powered by M&O" no rodapé; 8 temas mais o tema gerado da cor da marca; leitura do manual de marca no
  navegador; copiloto e IA no quadro e no funil só no acesso do Pedro.
- **v4 (25/09):** o QG do cliente (números do dia, esteira, atas, Drive, documentos, listas); a esteira
  de produção com os dois fluxos desenhados pelo Pedro, em que terminar uma etapa cria a tarefa da
  próxima; ata interna e ata do cliente; prévia de link na postagem.
- **v5 (26/09):** o roteiro nasce livre, como página do Notion, com 10 modelos logo abaixo (6 da casa e
  4 clássicos); trocar de modelo devolve cada trecho ao bloco de mesmo nome.
- **v6 (28/09):** o funil desenhado no padrão do Funnelytics: a forma diz a categoria (bolinha com logo
  para tráfego, esboço de página, quadradinho de conversa, losango de resultado), as linhas correm no
  sentido do fluxo e cada etapa mostra quantos não seguem.
- **v7 (28/09):** a equipe do cliente entra no painel dele (quem aprova e quem produz); toda peça abre
  e leva ao lugar dela; a plataforma abre clara, com o menu lateral em areia.
- **v8 (28/09):** o quadro branco no padrão do Miro, com mapa mental no padrão do MindMaster; o menu
  lateral legível, com as opções no menu do nome.
- **v9 (28/09):** barra lateral no painel do cliente, no padrão do GoHighLevel; cores personalizadas por
  hex, RGB ou pela identidade visual, no painel do cliente e na Aparência do time; post com 8 formatos e
  prévia que recebe arquivo ou link; mapa mental com posição livre, troca de pai ao soltar e
  espaçamento.
- **v10 (29/09):** o cadastro do cliente ganha logo, ícone, cores lidas do logo e nicho, e o ícone
  aparece no lado do time; a aba Sobre guarda a bio do cliente para quem chega no time; cada etapa da
  esteira tem a chave "o cliente vê", e as internas viram uma coluna só no painel dele; o cliente
  adiciona e edita os próprios links, e o time é avisado; o Histórico registra quem mudou o quê, sem
  notificar; o título do funil, do quadro, das páginas e das peças parou de duplicar o texto; a prévia
  pelo Drive segue as partes da lista de arquivos.
- **v11 (29/09):** o quadro ganha sete modelos de desenho (funil, pirâmide, ciclo, processo em etapas,
  comparação, matriz de prioridade e persona) e os trapézios de funil e de pirâmide como formas; o mapa
  mental cresce para os dois lados da ideia central, e cada ramo troca de lado pelo botão Outro lado ou
  arrastado por cima dela; toda paleta do quadro ganha uma bolinha de cor livre, com as três últimas
  cores à mão; o funil ganha o estilo Só o caminho, com etapas e setas e sem número nenhum, ao lado do
  Com números, e três modelos nesse estilo.
- **v12 (30/09):** depois da pesquisa de navegação, função que falta e experiência do cliente
  (`decisoes/pesquisas/2026-09-30-navegacao-funcoes-e-experiencia-do-cliente.md`). Cada tela ganha um
  endereço, e o Voltar funciona; o link do cliente já é o acesso e abre direto na peça; a barra do time sobe a
  Visão geral para o topo e mostra cada cliente numa linha só; as 12 abas do cliente viram 6, com sub-abas;
  o "Novo" pergunta de qual cliente é o post; a busca mostra os recentes. No painel do cliente, 5 destinos no
  celular (Para você, Conteúdo, Reuniões, Resultados e Mais); duas rodadas de ajuste por peça, com vários
  comentários num envio, ponto marcado na imagem, contador e "o que mudou"; "Aprovar com um detalhe" sem
  gastar rodada; no terceiro pedido, "Falar com a M&O", e o Sócio libera sem custo, cobra à parte ou trata
  como peça nova; aprovar em lote; prazo de aprovação à vista. Formulário de entrada, criar acesso com nome,
  e-mail e senha opcional, login por senha, relatório do mês e pacote do contrato. Lembrete por WhatsApp,
  e-mail ou SMS, conforme o país do cliente, com um lembrete só por lote.

## O que está em aberto

- O Pedro testar a v12 dentro do claude.ai, e o link de pasta do Drive virando prévia do post (esse
  caminho não rodou ao vivo; a parte do conector foi conferida de fora em 29/09).
- O teste de navegação com o Bruno, um colaborador e dois ou três clientes, que confirma o agrupamento das
  abas do cliente (hoje é hipótese).
- Qual falta do quadro vem depois: cursores ao vivo, comentários, votação com cronômetro, agrupar e
  guias de alinhamento, exportar.
- Se o TikTok entra como fonte de tráfego no funil dos clientes.
- Qual serviço de servidor foi contratado: a stack da versão de verdade se ajusta a ele.
- Traduzir o editor de roteiro no painel do cliente, e avisar por WhatsApp ou e-mail quando chega a vez
  de alguém do cliente.

## Próximo passo

Depois da validação com o time e com alguém de fora, a versão de verdade: Next.js, Postgres, Better
Auth e Excalidraw, num servidor de custo fixo, com o próprio servidor puxando a prévia de qualquer
link.
