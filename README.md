# Central M&O

Protótipo clicável da plataforma de gestão da M&O Company, com a central do time e o painel de cada
cliente, pensada para substituir Notion, ClickUp e Trello. Os dados são de exemplo, tirados do
trabalho real da M&O, e nada é salvo em servidor: recarregar a página volta ao começo.

- **No ar:** https://claude.ai/artifact/8isLH3dQCDxv73eQGtguWV (versão 9, 28/09/2026)
- **Este repositório** guarda a cópia exata da versão publicada, para versionar e para servir de ponto
  de partida da versão de verdade.

## Como abrir

A página carrega as imagens da pasta `img/`, então precisa de um servidor local. Na pasta do
repositório:

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000 no navegador e escolha um dos acessos de exemplo na tela de entrada.

## O que só funciona dentro do claude.ai

O protótipo roda como artifact do Claude. Aberto fora dele, estas partes ficam desligadas e a página
avisa:

- as reuniões lidas do Google Agenda e do Tactiq, e a busca no Drive e no Gmail;
- o link do Drive que vira prévia do post;
- o copiloto, a ata por IA e o desenho por IA no quadro e no funil.

## O que tem, até a versão 9

- Central do time: meu dia, caixa de entrada, visão geral, tarefas, postagens, roteiros, calendário,
  reuniões, quadros, funis, processos internos, equipe e automações.
- Painel de cada cliente com a marca e o idioma dele (português, inglês, espanhol e francês), barra
  lateral nas cores que ele escolher e a equipe dele dentro.
- Esteira de produção com passagem automática de etapa, e aprovação do cliente pelo celular.
- Post com 8 formatos e uma prévia que recebe imagem, PDF, ZIP, vídeo ou link.
- Roteiro com 10 modelos ou em texto livre.
- Funil no padrão do Funnelytics, com o custo de cada reunião agendada.
- Quadro branco no padrão do Miro, com mapa mental de posição livre.

## Próximo passo

Depois da validação com o time e com alguém de fora, a versão de verdade: Next.js, Postgres, Better
Auth e Excalidraw, num servidor de custo fixo, com o próprio servidor puxando a prévia de qualquer
link.
