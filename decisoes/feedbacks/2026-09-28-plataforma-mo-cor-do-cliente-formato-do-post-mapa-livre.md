---
data: 2026-09-28
peca: protótipo v8 da plataforma de gestão da M&O (https://claude.ai/artifact/8isLH3dQCDxv73eQGtguWV)
canal: geral — produto interno da M&O, fora do escopo do MVB-OS
tipo: diretriz — com aprovação do resto da v8
autor: Pedro
peso: lei
status: destilado — aplicado na v9 do protótipo, publicada em 28/09 no mesmo link; a regra mora no próprio protótipo e na memória plataforma-mo-sistema-proprio, porque não há manual do MVB-OS para a plataforma
relacionado: pedro/feedbacks/2026-09-28-plataforma-mo-quadro-como-miro-e-menu-legivel.md, pedro/feedbacks/2026-09-25-plataforma-mo-marca-do-cliente-temas-idiomas.md, memória plataforma-mo-sistema-proprio
quando-puxar: antes de mexer no tema do painel do cliente, na tela do post ou no mapa mental do quadro branco
---
O QUE O PEDRO DISSE, depois de ver a v8 (áudio transcrito, literal):

1. Personalização. *"Aqui eu quero fazer muito parecido com a Go High Level e o próprio cliente
   escolher as cores que ele pode também ter na barra lateral. Ele pode escolher um arquivo de ID
   visual dele ou ele mesmo conseguir personalizar, tirando os templates que já temos, então tem um
   template personalizado que ele tem a opção de subir o arquivo da ID visual ou ele mesmo coloca
   ali o o hashtag, né, o da, da cor, eu não sei se é via RGB ou via o próprio, o próprio número
   dela."*
2. Formato do post. *"Aqui na questão de post ainda está um pouco nebuloso e um pouco difícil de
   entender, porque quando eu coloco um novo post, eu não consigo mexer o formato, está sempre como
   carrossel. Tá. Então tem que mexer nisso, porque pode ser um post, um reels, um carrossel e todos
   os outros tipos de vídeo que temos, um vídeo, um vídeo longo, enfim, então a gente tem essas
   opções."*
3. Prévia do post. *"Quando for aparecer para visualizar a imagem do post, eu preciso ter um local
   onde eu vou ou subir o link ou colocar as imagens. Então... É, lógico que já tem arquivos e links
   da peça, então quando eu colocar o link, seja do Google Docs ou uma página, ou, ou até um arquivo
   com várias imagens, ele já pré-visualizar a partir desse link."*
4. Mapa mental. *"Eu não consigo é, separar as distâncias, não consigo mexer nas células aqui é,
   separadamente, elas ficam sempre unidas, então elas têm que ter essa individualidade, se eu
   quiser, por exemplo, botar o dia 1 mais em cima, semana 1 mais embaixo, semana 2 lá embaixo,
   continuar com isso, veja um pouco sobre a usabilidade e navegabilidade do Mind Master"*
5. O resto. *"Mas no mais, tá muito bom, muito bom mesmo."*

Nas duas perguntas desta sessão, ele escolheu: o painel do cliente ganha barra lateral, como no
GoHighLevel; e o Personalizado vale nos dois lados, no painel do cliente e na Aparência do time.

O QUE ISSO REVELA:

A causa comum aos quatro pedidos: o protótipo tomava sozinho uma decisão que é do usuário. A cor
vinha só de modelo pronto, o formato nascia "Carrossel" sem ter como trocar, a arte não tinha onde
entrar e o mapa mental recalculava a posição de tudo a cada mudança. REFINA
[[2026-09-28-plataforma-mo-quadro-como-miro-e-menu-legivel]], cuja primeira lei era "o que não se
vê não se entende". Agora a lei cobre também o que se vê e não se pode mudar.

AS LEIS QUE SAEM DAÍ:

**1. A plataforma sugere e deixa trocar.** Toda escolha automática (formato, cor derivada, posição
no mapa) aparece como sugestão visível, com o caminho para mudar ao lado e um jeito de voltar ao
automático.

**2. A marca do cliente chega à navegação.** Personalizar vale por peça da interface (barra lateral,
texto da barra, destaque, fundo), e a entrada aceita o que o cliente tem na mão: o arquivo da
identidade visual, o código hexadecimal ou o RGB.

**3. O lugar de ver a peça é o lugar de pôr a peça.** A prévia recebe arquivo ou link, e o sistema
faz o trabalho de transformar isso em prévia.

**4. Formato é a primeira escolha da peça**, visível desde o post novo, e a arte que sobe sugere o
formato sem sobrescrever a escolha feita à mão.

**5. No mapa mental, cada tópico fica onde o usuário soltar.** O layout automático arruma a primeira
vez; depois disso, arrastar move o tópico com os filhos, soltar em cima de outro tópico troca o pai,
e a distância entre níveis e entre irmãos se ajusta para o mapa inteiro.

DECISÕES DO SISTEMA, tiradas de pesquisa e ditas a ele na entrega:

- O GoHighLevel não tem, na documentação oficial, seletor nativo de cor para a barra lateral do
  app; as agências usam CSS de terceiros. O desenho seguiu o tema do Communities do próprio GHL
  (slots por parte da tela, hex ou RGB) e o Assembly (três cores obrigatórias). Fontes no histórico
  da sessão de 28/09.
- No MindMaster, arrastar troca o pai por padrão, e a posição livre depende de ligar uma opção. Aqui
  a posição livre é o padrão, porque num quadro branco quem arrasta espera que o item fique onde
  soltou; soltar em cima de outro tópico troca o pai, e ⌥ com o arraste só move.
- Os formatos seguem Planable, Later, Loomly, Hootsuite e Sprout: Post, Carrossel, Reels, Story,
  Vídeo, Vídeo longo, Shorts e Documento. TikTok fica de fora pela regra da casa.
- Link de Canva, Figma, YouTube e página comum vira cartão dentro do artifact, que não carrega
  conteúdo de outro site. Link de pasta, arquivo e apresentação do Drive vira prévia de verdade pelo
  conector do Drive, dentro do claude.ai.
