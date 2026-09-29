# Central M&O

Protótipo clicável da plataforma de gestão da M&O Company, com a central do time e o painel de cada
cliente, pensada para substituir Notion, ClickUp e Trello. Os dados são de exemplo, tirados do
trabalho real da M&O, e nada é salvo em servidor: recarregar a página volta ao começo.

- **No ar:** https://claude.ai/artifact/8isLH3dQCDxv73eQGtguWV (versão 10, 29/09/2026)
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
| `fonte/` | A fonte de todas as versões, da v1 à v10, com os scripts que montaram cada uma. O guia está em `fonte/COMO-FUNCIONA.md`. |
| `decisoes/` | O porquê de cada escolha: as falas do Pedro volta a volta, os handoffs, a memória da plataforma e as pesquisas. O índice está em `decisoes/README.md`. |

## O que só funciona dentro do claude.ai

O protótipo roda como artifact do Claude. Aberto fora dele, estas partes ficam desligadas e a página
avisa:

- as reuniões lidas do Google Agenda e do Tactiq, e a busca no Drive e no Gmail;
- o link do Drive que vira prévia do post;
- o copiloto, a ata por IA e o desenho por IA no quadro e no funil.

## O que tem, até a versão 10

- Central do time: meu dia, caixa de entrada, visão geral, tarefas, postagens, roteiros, calendário,
  reuniões, quadros, funis, processos internos, equipe e automações.
- Painel de cada cliente com a marca e o idioma dele (português, inglês, espanhol e francês), barra
  lateral nas cores que ele escolher e a equipe dele dentro.
- Esteira de produção com passagem automática de etapa, e aprovação do cliente pelo celular.
- Post com 8 formatos e uma prévia que recebe imagem, PDF, ZIP, vídeo ou link.
- Roteiro com 10 modelos ou em texto livre.
- Funil no padrão do Funnelytics, com o custo de cada reunião agendada.
- Quadro branco no padrão do Miro, com mapa mental de posição livre.
- Cadastro do cliente com logo, ícone, cores e nicho, e uma aba Sobre com a bio do cliente, só do time.
- O cliente vê na produção só as etapas que o time liga para ele, adiciona os próprios links e avisa o
  time do que faz.
- Histórico de tudo o que cada pessoa mudou, do time e dos clientes, para os sócios consultarem.

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

## O que está em aberto

- O Pedro testar a v10 dentro do claude.ai, e o link de pasta do Drive virando prévia do post (esse
  caminho não rodou ao vivo; a parte do conector foi conferida de fora em 29/09).
- A v11, pedida em 29/09: mais modelos no quadro (funil, infográficos), mapa mental dos dois lados com a
  ideia central móvel, cor livre além das seis de cada paleta, e modelos de funil por estilo de desenho
  (só o caminho, ou com o cálculo no fim).
- Qual falta do quadro vem depois: cursores ao vivo, comentários, votação com cronômetro, agrupar e
  guias de alinhamento, exportar.
- Se o TikTok entra como fonte de tráfego no funil dos clientes.
- Quem mantém o servidor (cerca de €15 por mês), se a aprovação do cliente fica em dois botões ou ganha
  mais estados, e se o nível Sócio entra.
- Traduzir o editor de roteiro no painel do cliente, e avisar por WhatsApp ou e-mail quando chega a vez
  de alguém do cliente.

## Próximo passo

Depois da validação com o time e com alguém de fora, a versão de verdade: Next.js, Postgres, Better
Auth e Excalidraw, num servidor de custo fixo, com o próprio servidor puxando a prévia de qualquer
link.
