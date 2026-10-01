# Como a fonte monta a página

A plataforma inteira é uma página só (`index.html` na raiz do repositório), escrita em Preact com
htm, sem etapa de compilação. Ela roda como artifact do Claude, que embrulha o arquivo num esqueleto
HTML na hora de publicar e dá à página os conectores (Google Agenda, Tactiq, Drive, Gmail) e o acesso
ao Claude (copiloto, ata por IA, desenho por IA).

## O arquivo que vale hoje

- **`src.html`** é a fonte da versão 12, a que está no ar. Tem dois marcadores, `__LOGO__` e `__ICON__`,
  onde entram os SVGs do logo da M&O.
- **`build.py`** lê `src.html`, põe os dois SVGs de `logo/` nos marcadores (recolorindo os preenchimentos
  para as classes `lc`, `lm` e `lw`, que o tema pinta) e grava `index.html` e `test.html`.
  - `index.html` é o que se publica no artifact.
  - `test.html` é o mesmo conteúdo com `<meta charset="utf-8">` no topo, para abrir num servidor local.

Para mudar a plataforma: edite `src.html`, rode `python3 build.py` dentro de `fonte/` e publique o
`index.html` gerado no mesmo link do artifact (a ferramenta Artifact, passando a `url`). A página na
raiz do repositório é a cópia exata do que está publicado, já com o esqueleto.

## A história, versão por versão

Cada versão nasceu do mesmo jeito: um módulo novo de código, um bloco de CSS e um script que costura
os dois no `src.html` da versão anterior. Cada `src-vN.html` é o estado da versão N, salvo antes de
costurar a seguinte.

| Versão | Data | Snapshot de partida | Código novo | Script que costurou |
|---|---|---|---|---|
| v1 | 25/09 | (primeira) | tudo em `src-v1.html` | |
| v2 | 25/09 | `src-v1.html` | `v2.js`, `p_*.txt`, `icons.txt` (CSS em `css_v2.txt`) | `integrate.py` |
| v3 | 25/09 | `src-v2.html` | `v3.js`, `css_v3.txt` | `integrate3.py` |
| v4 | 25/09 | `src-v3.html` | `v4.js`, `css_v4.txt` | `integrate4.py` |
| v5 | 26/09 | `src-v4.html` | `v5.js`, `css_v5.txt` | `integrate5.py` |
| v6 | 28/09 | `src-v5.html` | `v6.js`, `css_v6.txt`, `fn_v6.txt`, `brand/` | `integrate6.py` |
| v7 | 28/09 | `src-v6.html` | `v7.js`, `css_v7.txt` | `integrate7.py`, `integrate7b.py` |
| v8 | 28/09 | `src-v7.html` | `v8a.js`, `v8b.js`, `v8c.js`, `css_v8.txt` | `integrate8a.py`, `integrate8b.py` |
| v9 | 28/09 | `src-v8.html` | `v9.js`, `css_v9.txt` | `integrate9.py` (rodado por `make9.sh`) |
| v10 | 29/09 | `src-v9.html` | `v10.js`, `css_v10.txt` | `integrate10.py` (rodado por `make10.sh`) |
| v11 | 29/09 | `src-v10.html` | `v11.js`, `css_v11.txt` | `integrate11.py` (rodado por `make11.sh`) |
| v12 | 30/09 | `src-v11.html` | `v12a.js` a `v12d.js`, `css_v12.txt` | `integrate12.py` (rodado por `make12.sh`) |

Os scripts de costura são registro histórico: eles esperam encontrar o texto exato da versão anterior
e param com erro se não acharem. O `integrate9.py` confere, a cada troca, que o trecho antigo apareceu
exatamente uma vez. O `make9.sh` refaz a v9 do zero: copia `src-v8.html` para `src.html`, costura, monta
e confere a sintaxe do script com `node --check`. O `make10.sh` faz o mesmo para a v10, a partir de
`src-v9.html`, o `make11.sh` para a v11, a partir de `src-v10.html`, e o `make12.sh` para a v12, a partir de
`src-v11.html`.

A partir da v10, quando uma função inteira muda, o script tira a versão antiga do `src.html` (função
`drop`) e a nova passa a morar no módulo da versão. Na v10 foram assim `CMark`, `NewClient`,
`FlowSettings`, `PortalBoard`, `LinkCard`, `PortalLinks` e `Inbox`, todas em `v10.js`. Na v11,
`mindLayout` (o mapa mental dos dois lados) e `NewFunnel` (o funil novo com o estilo), em `v11.js`. Na v12,
`ClientArea`, `NewMenu`, `Portal`, `PortalHome`, `ApprovalCard`, `BrandedLogin` e `MessageModal`, nos quatro
módulos: `v12a.js` (endereço por tela, navegação do time e as ações novas), `v12b.js` (os textos novos do
painel do cliente, nas quatro línguas), `v12c.js` (o painel do cliente) e `v12d.js` (rodadas, relatório,
pacote e avisos do lado do time). O `integrate12.py` tem também `rep_between`, que troca um trecho do início
de um marcador até o fim do outro.

## As outras pastas

- **`logo/`**: `2.svg` (logo completo, símbolo e nome) e `7.svg` (só o símbolo), tirados da pasta de
  identidade visual da M&O.
- **`brand/`**: as logos das fontes de tráfego do funil, do Simple Icons (licença CC0), e o
  `_data.json`, que é o catálogo inteiro do Simple Icons (nome, cor oficial e origem de cada marca).
  As logos entram embutidas na página, porque o artifact não carrega imagem de outro site.
- **`test-assets/`**: arquivos usados para testar a leitura de identidade visual e a prévia do post.
  - `brand.pdf`: um PDF de marca de 20 MB, usado nos testes de leitura de identidade visual da v3.
  - `manual.pdf` e `manual.txt`: um manual de marca fictício (ACME Roofing) com as cores escritas em
    hex, RGB e Pantone.
  - `v9/carrossel-teste.pdf` (3 páginas) e `v9/canva-export.zip` (2 imagens e lixo de Mac): os testes
    da prévia do post na v9.

## Como a página se organiza por dentro

Tudo mora num `<script type="module">` único, em blocos marcados por comentário:

- **Utilidades, ícones, status, textos por idioma e dados de exemplo** (`seed`): pessoas, cliente zero
  (a própria M&O), tarefas, posts, roteiros, eventos, páginas de processo e notificações.
- **`App`**: guarda o estado inteiro num objeto só (`db`). Toda mudança passa por `commit`, que clona o
  estado, aplica a mudança e oferece desfazer no aviso. As ações ficam em `act`.
- **Casca do time** (`TeamShell`, `SidebarV2`) e **painel do cliente** (`Portal`), que escolhe tema,
  idioma e marca do cliente pelo `portalStyle`.
- **Temas**: `THEMES` (8 prontos), `brandTheme` (gerado da cor principal) e, desde a v9, `customTheme`
  (o Personalizado, cor por parte da tela, com contraste calculado).
- **Esteira de produção** (`FLOW_DEFS`, `moveTo`, `FlowBar`): cada etapa concluída cria a tarefa da
  próxima para o responsável dela.
- **Funil** (`FN`, `computeFunnel`, `FunnelEditor`) e **quadro branco** (`Whiteboard`, `mindLayout`).
- **Conectores** (`cap('mcp')`, `SRV`): chamadas aos conectores do Claude de quem está vendo a página.
  Sem eles, cada parte mostra o que falta e segue funcionando com os dados de exemplo.

## Limites que o artifact impõe (e que a versão de verdade não terá)

- Nada é salvo: recarregar volta aos dados de exemplo.
- A página não carrega imagem, vídeo nem página de outro site. Por isso YouTube, Canva, Figma e página
  comum aparecem como cartão, e o Drive entra pelo conector.
- O microfone não funciona dentro do artifact; o ditado é pelo teclado do sistema.
