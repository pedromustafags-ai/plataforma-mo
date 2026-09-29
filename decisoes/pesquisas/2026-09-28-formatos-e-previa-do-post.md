# Formatos do post e prévia da peça

Pesquisa de 28/09/2026, feita para a v9, nas centrais de ajuda de Planable, Later, Loomly, Hootsuite
e Sprout Social (a maioria dos artigos atualizada em 2026). Os dois problemas relatados pelo Pedro: o
post novo nascia sempre como carrossel, sem trocar, e a prévia não tinha onde receber a arte nem o link.

## Os formatos

| Formato | Rede | Proporção | Mídia |
|---|---|---|---|
| Post (imagem única) | Instagram, LinkedIn, Facebook | 4:5 (1080×1350); o Instagram aceita de 3:4 a 1,91:1 | 1 imagem |
| Carrossel | Instagram | 4:5, todos os slides na mesma proporção; 10 itens por API (no app, 20) | imagens e vídeos |
| Story | Instagram | 9:16 (1080×1920) | imagem ou vídeo |
| Reels | Instagram | 9:16, de 3 s a 15 min | vídeo |
| Vídeo | LinkedIn, Facebook | a do próprio arquivo | vídeo |
| Shorts | YouTube | 9:16 ou quadrado, até 3 min | vídeo |
| Vídeo longo | YouTube | 16:9 (aceita qualquer); capa 1280×720 | vídeo |
| Documento | LinkedIn | cada página do PDF vira um slide; até 300 páginas e 100 MB | PDF |

Documentado também:
- no Instagram, um vídeo único publicado por API sai como Reels (Hootsuite e Loomly);
- no 9:16, o Later recomenda deixar texto e logo fora dos 250 px de cima e de baixo;
- Later e Sprout aceitam Shorts de até 3 min; Loomly e Hootsuite ainda documentam menos de 60 s.

## Como cada ferramenta escolhe o formato

- **Planable**: escolhe a página e depois o tipo no editor ("Reel" como tipo de conteúdo, aba "Story";
  no YouTube, uma seção "Shorts"). O carrossel nasce sozinho com 2 ou mais mídias. No LinkedIn, o botão
  "Turn into PDF" converte um post de várias imagens em documento.
- **Later**: a mídia vem primeiro (arrasta da biblioteca para o calendário). O editor tem um menu "Post
  Type", e Stories têm botão próprio.
- **Loomly**: conteúdo geral primeiro, depois o ajuste por canal, com prévia. Stories é um botão de
  liga e desliga. Vídeo único no Instagram vira Reels, e vídeo curto vertical no YouTube vira Short,
  sem ninguém escolher.
- **Hootsuite**: escolhe Post ou Story; vídeo único vira Reels, e o Short sai pela duração e pela
  proporção. No LinkedIn, PDF é um tipo de mídia.
- **Sprout**: Story é a opção "This is a story". No LinkedIn há o botão "Upload Document".

O padrão entre as cinco: Story é sempre escolha explícita; Carrossel, Reels e Shorts costumam ser
deduzidos da mídia.

## Como a mídia entra e como a prévia aparece

- As cinco aceitam envio de arquivo e arrastar e soltar.
- **Google Drive**: por seletor com login no Loomly (10 imagens, 1 vídeo ou 1 PDF por vez), no
  Hootsuite e no Sprout. O Later perdeu o Drive por mudança na API do Google. O Planable só tem Drive
  via Zapier.
- **Canva**: exportando para a biblioteca (Planable, Later, Loomly) ou pelo seletor dentro do editor
  (Sprout, Hootsuite).
- **PDF como carrossel do LinkedIn**: Loomly (com prévia do carrossel), Sprout e Hootsuite. O Later não
  aceita.
- **ZIP**: nenhuma das cinco.
- **Prévia**: Hootsuite e Sprout mostram cada rede ao lado do editor, atualizando na hora (o Sprout
  alterna entre computador e celular). Later e Loomly simulam a grade do perfil. O Planable desenha no
  layout da rede. Planable, Loomly e Sprout reordenam slides arrastando.

## Prévia a partir de link

- Nenhuma das cinco transforma um link colado do Drive, do Canva ou do Figma em mídia.
- O link vira um cartão com título, descrição e miniatura tirados da página (Open Graph): Hootsuite,
  Sprout (cartão editável só no LinkedIn e no Facebook), Planable e Loomly. O Later não mostra prévia de
  link.
- O "importar de URL" do Loomly exige link direto para o arquivo (vídeo terminando em .mp4 ou .mov).
- Sem integração com Figma em nenhuma delas.
- Para a versão de verdade: a API do Drive entrega a miniatura (`thumbnailLink`), mas o link expira em
  horas e o navegador bloqueia o uso direto, então precisa de servidor. O Figma tem embed oficial em
  iframe, e o Canva tem o "smart embed link" (com o design público).

## O que virou decisão na v9

- Oito formatos em chips no topo do post: Post, Carrossel, Reels, Story, Vídeo, Vídeo longo, Shorts e
  Documento. TikTok fica de fora pela regra da casa.
- O post novo nasce sem formato. A arte que sobe sugere (uma imagem vira Post, várias viram Carrossel,
  vídeo vertical vira Reels, vídeo horizontal vira Vídeo), sem sobrescrever uma escolha feita à mão.
- Aviso quando a arte não bate com o formato, com o botão para trocar.
- Uma área só para a peça: arrastar ou enviar imagem, PDF (cada página vira slide, até 20), ZIP ou
  vídeo, e colar link. A moldura segue a proporção do formato, com a área segura marcada no 9:16.
- Dentro do artifact, que não carrega conteúdo de outro site: link do Drive vira prévia pelo conector
  do Drive; Canva, Figma, YouTube e página comum viram cartão.

## Fontes

- Planable: [criar post](https://help.planable.io/hc/en-us/articles/21715290660508-Create-a-post) · [Reels](https://help.planable.io/hc/en-us/articles/21715400745500-Instagram-Reels) · [Stories](https://help.planable.io/hc/en-us/articles/21715477616284-Instagram-Stories) · [várias imagens](https://help.planable.io/hc/en-us/articles/21715295163292-Create-a-Multi-Image-post) · [PDF do LinkedIn](https://help.planable.io/hc/en-us/articles/21715345250204-LinkedIn-PDF) · [YouTube](https://help.planable.io/hc/en-us/articles/21715266246812-YouTube-Videos-and-Shorts-in-Planable) · [proporções do Instagram](https://help.planable.io/hc/en-us/articles/21715519870492-Instagram-Publishing) · [limites de imagem](https://help.planable.io/hc/en-us/articles/21715388565276-Photos-and-caption-Guidelines-and-Limitations) · [cartão de link](https://help.planable.io/hc/en-us/articles/21715451020700-Customize-link-thumbnails) · [Canva](https://help.planable.io/hc/en-us/articles/21715284906652-Canva-integration) · [campanhas](https://help.planable.io/hc/en-us/articles/21715321168796-Campaigns) · [Zapier](https://help.planable.io/hc/en-us/articles/23751605870620-Zapier-Integration)
- Later: [tipos de post](https://help.later.com/hc/en-us/articles/360060842914-Supported-Social-Platforms-Post-Types) · [Reels](https://help.later.com/hc/en-us/articles/5023195813143-Schedule-Publish-Instagram-Reels) · [carrossel](https://help.later.com/hc/en-us/articles/360042773934-Schedule-Publish-Instagram-Multi-Photo-Carousel-Posts) · [Stories](https://help.later.com/hc/en-us/articles/360042772514-Schedule-Publish-Instagram-Stories) · [envio e formatos](https://help.later.com/hc/en-us/articles/360043361213-Uploading-Media-Format-Requirements) · [Shorts](https://help.later.com/hc/en-us/articles/14720878941463-Schedule-Publish-YouTube-Shorts) · [prévia de link](https://help.later.com/hc/en-us/articles/4408198159127-Check-Link-Previews-Before-Publishing) · [grade do perfil](https://help.later.com/hc/en-us/articles/360043244233-Preview-Your-Feed-With-Your-Visual-Instagram-Planner)
- Loomly: [Post Builder](https://loomly.zendesk.com/hc/en-us/articles/39256457269531-3-Post-Builder) · [envio de mídia](https://loomly.zendesk.com/hc/en-us/articles/39082216726043-How-to-Upload-Media-in-Post-Builder) · [importar de URL](https://www.loomly.com/blog/import-media-from-urls) · [Drive](https://loomly.zendesk.com/hc/en-us/articles/39082258912667-Does-Loomly-integrate-with-Google-Drive) · [Reels](https://loomly.zendesk.com/hc/en-us/articles/39081813491227-How-to-Schedule-and-Auto-Post-Reels-with-Loomly) · [Stories](https://loomly.zendesk.com/hc/en-us/articles/39081817960091-Do-you-support-stories) · [carrossel e PDF](https://loomly.zendesk.com/hc/en-us/articles/39082040100635-How-do-I-create-a-carousel-post) · [YouTube](https://loomly.zendesk.com/hc/en-us/articles/38970447223451-YouTube-and-Loomly-Overview) · [Facebook e prévia de link](https://loomly.zendesk.com/hc/en-us/articles/38857537755931-Scheduling-Facebook-Posts-with-Loomly)
- Hootsuite: [Instagram](https://help.hootsuite.com/hc/en-us/articles/1260804249750-Create-an-Instagram-post-story-or-reel) · [YouTube](https://help.hootsuite.com/s/article/publish-yt?language=en_US) · [PDF do LinkedIn](https://www.hootsuite.com/whats-new/add-a-pdf-to-your-linkedin-posts) · [Drive](https://www.hootsuite.com/whats-new/google-drive-integration-in-create) · [prévia](https://help.hootsuite.com/hc/en-us/articles/1260804249890-Preview-your-post) · [prévia de link](https://help.hootsuite.com/hc/en-us/articles/1260804306209-About-link-previews)
- Sprout: [tipos de post](https://support.sproutsocial.com/hc/en-us/articles/15632585403021-What-types-of-posts-can-I-publish-using-Sprout-Social) · [Stories](https://support.sproutsocial.com/hc/en-us/articles/8795781823117-How-do-I-schedule-Instagram-Stories) · [Reels](https://support.sproutsocial.com/hc/en-us/articles/4423001236365-How-can-I-use-Instagram-Reels-in-Sprout) · [YouTube](https://support.sproutsocial.com/hc/en-us/articles/360024633771-How-do-I-publish-videos-to-YouTube) · [PDF do LinkedIn](https://support.sproutsocial.com/hc/en-us/articles/13077423455117-How-do-I-create-a-LinkedIn-post-for-a-Company-Page-in-Sprout) · [editor e prévia](https://support.sproutsocial.com/hc/en-us/articles/360000095183-How-can-I-customize-my-social-posts-using-Compose) · [metadados de link](https://support.sproutsocial.com/hc/en-us/articles/115001306746-URL-Metadata)
- Técnico: [API do Drive](https://developers.google.com/workspace/drive/api/reference/rest/v3/files) · [embed do Figma](https://developers.figma.com/docs/embeds) · [embed do Canva](https://www.canva.com/help/embed-designs/)
