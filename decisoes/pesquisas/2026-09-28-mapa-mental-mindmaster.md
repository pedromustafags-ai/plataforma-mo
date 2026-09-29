# Mapa mental: arrastar, posição livre e espaçamento

Pesquisa de 28/09/2026, feita para a v9. O pedido do Pedro: *"não consigo separar as distâncias, não
consigo mexer nas células separadamente, elas ficam sempre unidas... se eu quiser botar o dia 1 mais em
cima, semana 1 mais embaixo, semana 2 lá embaixo... veja a usabilidade e navegabilidade do Mind
Master"*. Até a v8, o mapa recalculava a posição de todos os tópicos a cada mudança.

## MindMaster / EdrawMind (documentado)

- **Arrastar troca o pai ou a ordem.** O tópico vai "para baixo de qualquer tópico ou subtópico", com
  pré-visualização [1]. O tutorial oficial em chinês descreve uma linha laranja cujas pontas mostram
  onde o tópico vai entrar [3]. Subtópicos e conectores vão junto [2].
- **Mover livre depende de ligar uma opção**: painel direito, Map, Topic Spacing, *Branch Free
  Positioning*. Depois disso, "selecione um tópico principal e arraste para qualquer lugar" [4]. A nota
  da v9.0 diz "mover temas principais livremente" [5]. A documentação só garante isso no 1º nível.
- Na mesma seção ficam *Flexible Floating Topic*, *Topic Overlap* e *Alignment With Sibling Topic*.
  Tópico flutuante: Alt+F e clique, ou clique duplo numa área vazia [8].
- **Espaçamento**: horizontal e vertical, padrão 30, de 20 a 100, para o mapa inteiro [6]. Sem ajuste
  por ramo.
- **Atalhos**: Tab, Insert ou Ctrl+Enter criam filho; Enter cria irmão abaixo e Shift+Enter acima; F2
  ou Espaço editam; Del apaga com o ramo, e Shift+Del apaga só o tópico, com os filhos subindo um nível;
  setas navegam; Ctrl+Shift+setas reordenam; Ctrl+arrastar copia [3][7][8].
- A documentação não esclarece se subtópico pode ficar em posição livre, se soltar um tópico livre
  sobre outro troca o pai, como o conector é desenhado no modo livre, nem se existe "reset position".

## Os outros (documentado)

| | Posição livre | Soltar sobre tópico | Indicador | Espaçamento | Volta ao automático |
|---|---|---|---|---|---|
| XMind | *Branch Free-Positioning*, só na estrutura Mind Map [9]; no XMind 8, Alt/Cmd+arrastar move o principal e Shift+arrastar vira flutuante [12] | muda a hierarquia [10] | *Smart Guideline* [11] | só "Compact Map" [13] | Ctrl+Z ou desmarcar [9]; *Reset Position* no XMind 8 [12] |
| MindMeister | desligar *Auto align* no tópico, em qualquer nível [14][15] | não documentado | não documentado | não achado | "Auto layout", ou soltar sobre o pai [15] |
| MindManager | só tópico principal: pela alça, Alt+arrastar ou botão direito [16] | menu *Drop as Subtopic / Sibling* (Mac); Shift impede de grudar [17] | sinal visual do destino e guia verde a 5 px [17][19] | entre irmãos e pai-filho do selecionado; no central, o mapa todo [18] | *Reset Position*, *Reset All Topic Positions*, *Balance Map* [16] |

Avisos documentados: o MindMeister diz que muitos tópicos posicionados à mão deixam o mapa difícil de
manejar [14]; o MindManager diz que o tópico livre pode se deslocar um pouco para não sobrepor [16].

## O que virou decisão na v9

- **Mover livre é o padrão**, sem opção para ligar, e vale para qualquer nível. Num quadro branco, quem
  arrasta espera que o item fique onde soltou. A rede de segurança é o ⌘Z e a volta ao automático.
- **Arrastar sem tecla**:
  - solto em área vazia, o tópico fica ali, continua filho do mesmo pai, e o conector se estica até
    ele (o caso do Dia 1 e da Semana 2);
  - solto dentro de outro tópico, que ganha contorno e o aviso "Solte para virar tópico filho", ele vira
    filho daquele e entra no layout automático do novo pai;
  - solto sobre o próprio pai, volta à posição automática.
- **⌥ com o arraste** só move, nunca troca o pai. Esc no meio do arraste cancela.
- **Os filhos andam junto** e mantêm o arranjo: a posição à mão fica guardada em relação ao pai. Os
  irmãos que continuam no automático não se mexem. Filho novo de um tópico livre nasce no automático,
  ancorado nele.
- **Espaçamento do mapa inteiro** em dois controles na barra de contexto: distância entre níveis (16 a
  240) e entre irmãos (0 a 120).
- **Volta ao automático**: botão no tópico movido à mão, e "Reorganizar o mapa" na raiz.
- **Atalhos novos**: ⌥+setas movem o tópico, ⌘⇧↑/↓ trocam a ordem entre irmãos, F2 edita e ⇧Delete
  apaga só o tópico, com os filhos subindo um nível.
- Fica para depois: linha de inserção para reordenar arrastando entre irmãos e guias de alinhamento.

## Fontes

1. https://edrawmind.wondershare.com/guide/move-topics.html
2. https://edrawmind.wondershare.com/guide/select-move-topics.html
3. https://www.edrawsoft.cn/mindmaster/tutorial/move-mindmap-topic/ (tutorial oficial, em chinês)
4. https://edrawmind.wondershare.com/guide/more-layout-settings.html
5. https://edrawmind.wondershare.com/whats-new.html
6. https://edrawmind.wondershare.com/guide/topic-spacing.html
7. https://edrawmind.wondershare.com/guide/shortcuts.html
8. https://www.edrawsoft.com/guide/edrawmind10/EdrawMind-User-Guide-V10.pdf (páginas 23 a 26)
9. https://xmind.com/user-guide/advanced-layout-new
10. https://xmind.com/user-guide/topic-editing-new
11. https://xmind.com/user-guide/smart-guideline
12. https://xmind-help.github.io/en/topic.html e https://xmind-help.github.io/en/alignment.html (ajuda do XMind 8)
13. https://xmind.com/user-guide/map-style-new
14. https://support.mindmeister.com/hc/en-us/articles/360017549439-Customize-Your-Map-s-Layout
15. https://www.mindmeister.com/MindMeister_Panda_User_Guide.pdf
16. https://onlinehelp.mindjet.com/help/MindManager/21/EN/reorganize_topics.htm
17. https://help.mindjet.com/23/MindManager-en/MindManager-drag-drop-topics.html
18. https://onlinehelp.mindjet.com/help/MindManager/18/EN/map_layout.htm
19. https://onlinehelp.mindjet.com/23/MindManager-en/MindManager-Reorganize-topics.html
