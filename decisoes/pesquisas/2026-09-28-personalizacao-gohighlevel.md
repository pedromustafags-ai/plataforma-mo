# Personalização de cores no padrão do GoHighLevel

Pesquisa de 28/09/2026, feita para a v9. O pedido do Pedro: *"quero fazer muito parecido com a Go
High Level e o próprio cliente escolher as cores que ele pode também ter na barra lateral"*, subindo o
arquivo da identidade visual ou digitando o código da cor.

## O que o GoHighLevel faz (documentado)

- A marca da agência fica em Settings, Company, aba **Whitelabel**: logo, tema claro ou escuro (que,
  pela ajuda deles, não afeta as subcontas) e os campos de CSS e JS próprios. A própria HighLevel
  chama o CSS de "poderoso, mas sem suporte" e cita o fundo da barra lateral como uso típico [1].
- **Não há, na documentação oficial, seletor nativo de cor para a barra lateral do app.** Há pedidos
  de clientes sem resposta oficial: cor nos menus (mai/2025) [2], cores por subconta (jun/2025) [3] e
  uma camada oficial de tema, porque "cada atualização quebra os overrides" (nov/2025) [4].
- Na prática, as agências colam CSS feito por geradores de terceiros. Os campos desses geradores:
  fundo da lateral, hover, item ativo, cabeçalho, seletor de subconta, botão, anel de foco e divisória
  [13][14]. O "Theme Builder nativo" que um blog cita não tem fonte; o que existe com esse nome é um
  plugin pago de US$ 47/mês [15].
- Outros módulos do GHL têm tema nativo:
  - o **Communities** tem 10 campos: fundo da lateral, primária (botões), terciária (links), fundo,
    superfície, fonte primária e secundária, preenchimento (hover), bordas e erro. O quadrado de cor
    abre o seletor ou aceita hex, e claro e escuro são salvos em separado [5]; saiu em Labs em
    mai/2024, e o changelog de 23/09/2026 documenta prévia ao vivo [6];
  - o **Portal do Cliente** só tem "Brand Color One/Two" [7];
  - o seletor de cor do construtor de páginas aceita **hex e RGB** e deixa dar nome à cor [8].
- Conta-gotas e "restaurar padrão": não aparecem em nenhuma documentação do GHL.

## Outros portais de cliente (documentado)

- **SuiteDash**: temas prontos mais ajuste por elemento (fundo da navegação lateral, texto, ícone,
  linha de carregamento, destaque, avatar), com a mudança aparecendo na hora [10].
- **Assembly** (antigo Copilot.com): só três cores (fundo da barra, texto da barra, destaque), mais
  ícones, imagem de login e fonte [9].
- **HubSpot**: cor primária, secundária e de destaque, por hex ou seletor [11].
- Cores derivadas e checagem de contraste: não aparecem nesses três. Quem documenta é o Confluence,
  que escolhe sozinho a cor do texto da navegação "para legibilidade" e tem "Reset to default" [12], e
  o Intercom, que deriva fundo e texto de uma cor só para garantir cerca de 4,5:1 [16].

## Extração de cores de um arquivo de marca (documentado)

- **Canva Brand Kit Builder**: aceita URL ou PDF do manual (até 200 MB; PDF escaneado falha), extrai
  logo, cores e fontes e pede revisão antes do uso [17].
- **Microsoft 365 Copilot**: lê o PDF do guia de marca, mostra uma tela de revisão e salva no botão
  "Save assets", sobrescrevendo o que existia [18].
- **HubSpot**: "Import colors from URL" mostra as cores achadas, e o usuário arrasta cada uma para o
  campo [11].
- **Brandfetch**: devolve as cores já classificadas por papel (destaque, escura, clara, marca) [19].
- **GHL Brand Boards**: gera a partir de uma URL, com 2 a 10 cores em hex ou RGB, renomeáveis [20].
- **Confluence**: subir o logo já recolore a navegação [12]. **Adobe Express** (beta) e **Looka** sobem
  o logo e sugerem as cores [21].

## O que virou decisão na v9

- Sete cores por parte da tela: três à vista (fundo da barra, texto e ícones da barra, destaque) e
  quatro em "Ajustar mais cores" (item selecionado, fundo da página, cartões, texto da página).
- Cada cor entra por hex (`#1E90FF` ou `1E90FF`), RGB (`30, 144, 255` ou `rgb(30,144,255)`), seletor do
  sistema ou uma das cores da marca, e fica guardada em hex.
- Campo vazio volta ao automático, que calcula a cor pelo contraste.
- Aviso de leitura com botão "Corrigir", sem impedir de salvar: texto pede 4,5:1, e o botão contra o
  fundo da página pede 3:1.
- Subir a identidade visual distribui as cores sozinho: a mais escura vai para a barra, a mais viva
  para o destaque e a clara com tom para o fundo.
- O Personalizado vale nos dois lados, por decisão do Pedro: painel do cliente e Aparência do time.

## Fontes

1. https://help.gohighlevel.com/support/solutions/articles/48000982604-agency-company-settings-in-highlevel
2. https://ideas.gohighlevel.com/dashboard/p/add-color-to-the-menus
3. https://ideas.gohighlevel.com/saas/p/per-sub-account-customization-colors-css-javascript-access-permission-control
4. https://ideas.gohighlevel.com/ad-reporting-and-attribution/p/design-system-architecture-for-scalable-white-labeling-and-ui-stability
5. https://help.gohighlevel.com/support/solutions/articles/155000002455-communities-change-your-group-theme
6. https://ideas.gohighlevel.com/changelog/community-updates-new-features e https://ideas.gohighlevel.com/changelog/dark-mode-for-communities-courses-in-gokollab
7. https://help.gohighlevel.com/support/solutions/articles/155000000193-how-to-set-up-the-client-portal-
8. https://help.gohighlevel.com/support/solutions/articles/155000005806-how-to-use-the-color-picker-for-funnels-websites
9. https://assembly.com/guide/customization-and-setup
10. https://help.suitedash.com/article/127-platform-branding
11. https://knowledge.hubspot.com/branding/edit-your-logo-favicon-and-brand-colors
12. https://support.atlassian.com/confluence-cloud/docs/customize-a-sites-color-schemes/
13. https://gohighlevelwebsitetemplates.com/gohighlevel-tips/free-gohighlevel-dashboard-theme-generator/
14. https://www.ghlexperts.com/customization/gohighlevel-dashboard-themes-css-color-schemes
15. https://ghlplugins.com/theme-customizer (o blog sem fonte: https://ghlmarketing.org/gohighlevel-dashboard-customization/)
16. https://www.intercom.com/blog/accessibility-buttons-messenger/
17. https://www.canva.com/help/brand-kit-builder/ (conferido pelo trecho indexado na busca)
18. https://support.microsoft.com/en-us/topic/use-guidelines-to-manage-brand-kits-in-microsoft-365-copilot-182423c1-feb1-4141-9700-72e3fa88830f
19. https://docs.brandfetch.com/reference/brand-api
20. https://help.gohighlevel.com/support/solutions/articles/155000003136-how-to-create-a-brand-board
21. https://helpx.adobe.com/express/web/brands-libraries-projects/create-manage-brands/brand-setup.html e https://looka.com/brand-kit/ (conferido pelo trecho indexado na busca)
