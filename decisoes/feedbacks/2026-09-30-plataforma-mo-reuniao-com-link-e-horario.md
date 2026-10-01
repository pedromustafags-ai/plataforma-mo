---
data: 2026-09-30
peca: protótipo v12 da plataforma de gestão da M&O (https://claude.ai/artifact/8isLH3dQCDxv73eQGtguWV)
canal: geral — produto interno da M&O, fora do escopo do MVB-OS
tipo: pedido — o que a reunião precisa mostrar
autor: Pedro
peso: lei
status: destilado — aplicado na v13, publicada em 30/09 no mesmo link; a regra mora no próprio protótipo e na memória plataforma-mo-sistema-proprio
relacionado: pedro/feedbacks/2026-09-30-plataforma-mo-socio-dois-ajustes-e-pesquisa-de-navegacao.md, memória plataforma-mo-sistema-proprio
quando-puxar: antes de mexer em Reuniões, na aba Reuniões do painel do cliente ou na integração com a Google Agenda
---
O QUE O PEDRO DISSE (literal):

*"Nas reuniões, seria interessante deixar o link da reunião e horário."*

O QUE A V12 TINHA

- **Do lado do time,** o horário já aparecia na lista, mas o link só aparecia dentro da reunião, e só
  quando ela vinha da Google Agenda. Não havia como marcar uma reunião à mão nem colar um link de Zoom
  ou Teams. Sem o conector, as reuniões de exemplo não tinham link nenhum.
- **Do lado do cliente,** a aba Reuniões mostrava só a ata de reunião que já tinha acontecido. A
  próxima reunião não aparecia, nem com horário nem com link. O calendário do cliente mostrava a
  reunião, e clicar levava para a aba que não a tinha.

COMO FOI LIDO

"Deixar" foi lido como as duas pontas: o time tem onde pôr o link e o horário, e o cliente vê os dois
para entrar. Sem a ponta do cliente, o link fica guardado para quem já tem; sem a do time, não há
onde guardar fora da Google Agenda.

O QUE A V13 FEZ

- **Nova reunião,** na tela Reuniões do time e na aba Reuniões do cliente, com título, dia, início,
  fim e link editáveis. O link aceita Meet, Zoom, Teams ou qualquer endereço, e o botão diz onde entra
  ("Entrar no Meet", "Entrar no Zoom"). Reunião que vem da Google Agenda mostra o link de lá, com
  "Copiar", e o horário dela muda na Agenda, não aqui.
- **Na lista do time,** o botão "Entrar" vai direto na linha da reunião de hoje ou das próximas.
- **No painel do cliente,** a aba Reuniões abre com "Próximas reuniões": dia, horário no fuso de quem
  está vendo, com a sigla do fuso, e o botão "Entrar na reunião", nas quatro línguas. Sem link ainda,
  aparece "O link aparece aqui antes da reunião". As atas seguem logo abaixo.
- **Quem vê:** a reunião só aparece para o cliente quando está ligada a ele e com "O cliente vê o
  horário e o link" marcado. Reunião marcada à mão nasce marcada; a da Google Agenda nasce desmarcada,
  porque uma reunião interna sobre o cliente também fica ligada a ele e não pode vazar para o painel.

O QUE FICOU EM ABERTO

- O calendário do cliente ainda lê uma lista de eventos separada da de Reuniões (a "Revisão da
  semana" de toda segunda). As duas listas não batem, e juntá-las é o próximo conserto se o Pedro
  achar que vale.
- O lembrete da reunião (WhatsApp, e-mail ou SMS antes de começar) não entrou: não foi pedido.
