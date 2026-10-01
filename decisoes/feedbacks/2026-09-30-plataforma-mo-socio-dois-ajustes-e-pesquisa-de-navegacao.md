---
data: 2026-09-30
peca: protótipo v11 da plataforma de gestão da M&O (https://claude.ai/artifact/8isLH3dQCDxv73eQGtguWV)
canal: geral — produto interno da M&O, fora do escopo do MVB-OS
tipo: diretriz — respostas às três perguntas abertas, e ordem de pesquisar antes de construir
autor: Pedro
peso: lei
status: destilado — aplicado na v12, publicada em 30/09 no mesmo link; a pesquisa está em https://claude.ai/artifact/BGxbjd2zKeQ1zbBodrh9L7; a regra mora no próprio protótipo e na memória plataforma-mo-sistema-proprio
relacionado: pedro/feedbacks/2026-09-29-plataforma-mo-cliente-com-a-cara-dele-historico-quadro-e-funil.md, memória plataforma-mo-sistema-proprio
quando-puxar: antes de mexer em nível de acesso, no fluxo de aprovação do cliente ou na infraestrutura da versão de verdade
---
O QUE O PEDRO DISSE, depois de abrir a v11 (literal):

*"Antes de qualquer coisa, vamos entender e pesquisar e entender melhor sobre a navegabilidade.
E entender se há alguma funcionalidade que está faltando. E entender como melhorar a experiência
do cliente também."*

E às três perguntas que estavam em aberto desde 25/09:

1. O nível Sócio (cadastra cliente, convida, apaga): *"Fica"*.
2. A aprovação do cliente: *"O cliente aprova, mas pode pedir até 2 ajustes"*.
3. Quem mantém a infraestrutura (~€15/mês): *"Já está contratado"*.

O QUE ISSO MUDA

- **Três níveis de acesso, confirmados:** Sócio, colaborador e cliente. O Sócio foi proposta minha
  em 25/09 e estava sem confirmação.
- **Limite de ajustes por peça.** Hoje o protótipo deixa o cliente pedir ajuste sem limite: cada
  "Pedir ajuste" devolve a peça para a última etapa de produção (`prevWorkOf`). A regra nova é de
  até dois pedidos. **Não foi dito o que acontece no terceiro**: bloquear o botão, cobrar à parte,
  chamar para uma conversa ou deixar o Sócio liberar. Entra como pergunta da pesquisa.
- **A infraestrutura já está contratada.** Não foi dito qual serviço. A arquitetura recomendada em
  25/09 era uma VPS da Hetzner (CX33 + backup + Storage Box); se o contratado for outro, a stack da
  versão de verdade se ajusta a ele, e não o contrário.
- **A ordem é pesquisar antes de construir.** Nenhuma versão nova sai antes do levantamento de
  navegação, de funções que faltam e de experiência do cliente.

SEGUNDA VOLTA, depois de ler a pesquisa (áudio transcrito, literal):

*"Eu acho que o cliente ele pode ter duas rodadas de ajustes, né? e não só dois ajustes pontuais,
igual você falou, ele não estava conseguindo mexer nas publicações. Então, eu acho que aqui o ajuste
1 de falar com a MNU é bom. Aqui no o CRM vai ser diferente desse sistema de projetos, processos, na
verdade. O cliente dos Estados Unidos avisa pelos dois. E também fazer toda aquela conclusão que você
fez ali antes. Faça um formulário também, né? Então, ter ali um e-mail, senha, nome, senha, sei lá,
para ser melhor."*

O QUE ISSO DECIDE

- **São 2 RODADAS por peça, e não 2 comentários.** Cada rodada junta quantos comentários o cliente
  quiser, em slides diferentes, e só conta quando ele envia. É a definição de rodada que as cinco
  fontes da pesquisa têm em comum.
- **No terceiro pedido, "Falar com a M&O"**, a recomendação da pesquisa: o pedido chega ao
  responsável e aos sócios, e o Sócio decide ali (liberar sem custo, cobrar à parte ou tratar como
  peça nova).
- **O CRM é outro sistema**, separado da plataforma de gestão, e mora no subdomínio de prospecção.
  Nada de CRM dentro da Central.
- **Cliente dos EUA é avisado por e-mail E por SMS.**
- **Todas as conclusões da pesquisa entram na v12.**
- **Formulário com nome, e-mail e senha.** Lido como o criar acesso do primeiro login, somado ao
  formulário de entrada que a pesquisa recomendou. A senha é a segunda porta: o link do WhatsApp
  continua abrindo a peça sem senha, para não perder os 30 s.

Os subdomínios combinados na mesma conversa: `central.moagency.io` (a plataforma) e
`prospect.moagency.io` (o CRM de prospecção). O DNS do moagency.io está na Hostinger, e o site raiz
roda no Lovable e hoje mostra "Le Palmier | Luxury Properties", um site de imóveis.
