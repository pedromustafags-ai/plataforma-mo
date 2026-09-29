---
data: 2026-09-25
peca: protótipo v2 da plataforma de gestão da M&O (https://claude.ai/artifact/8isLH3dQCDxv73eQGtguWV)
canal: produto interno (M&O)
tipo: diretriz
autor: Pedro
peso: regra
status: em aplicação na v3 do protótipo (25/09)
relacionado: pedro/feedbacks/2026-09-25-plataforma-mo-menu-simplorio-e-modulos-novos.md, memória plataforma-mo-sistema-proprio
quando-puxar: antes de mexer em arquitetura, custo, IA, marca do cliente, temas ou idiomas da plataforma da M&O
---
O QUE ELE DISSE:

- *"Por enquanto usa Gmail pessoal."* (a M&O não tem Google Workspace pago)
- *"Vamos então deixar o copiloto apenas para o meu acesso."*
- *"Quero que esse SaaS seja de extrema independência e não tenha custos variáveis."*
- Pediu pesquisa a fundo de Trello, monday, Notion, ClickUp e eKyte, para pensar num que seja muito bom.
- *"Sinto que podemos ter mais personalizações, se o cliente quiser escolher o tema, colocar a logo dele."*
- *"No painel do cliente não ter a M&O COMPANY, mas ser o nome do próprio cliente. E em algum lugar ter 'powered by M&O'."*
- Vários templates de cor: *"vários estilos de light, vários estilos de dark"*.
- Quatro idiomas: português, inglês, espanhol e francês.
- *"O próprio cliente subir a sua ID visual e o sistema ler."*

AS LEIS QUE SAEM DAÍ:

**1. Custo fixo, sempre.** Nada que cobre por uso: nem API de IA por token, nem mensagem paga, nem
serviço que cresce com o volume. Quando uma função só existe com custo variável, ela fica de fora
ou roda num recurso que já é assinatura fixa (o plano do Claude do Pedro).

**2. O copiloto é do Pedro, e só dele.** Nem cliente nem colaborador têm copiloto.

**3. O painel do cliente é do cliente.** Nome, logo, cores, tema e idioma dele. A M&O aparece como
assinatura discreta ("Powered by M&O"), nunca como dona da tela.

**4. A marca entra por arquivo, não por formulário.** O cliente sobe o logo e o manual, e o sistema
lê cores e fontes sozinho. Ajuste manual existe, mas é o segundo passo.

**5. Tema é escolha de quem usa.** Vários claros e vários escuros, para o time e para o cliente,
sempre passando no contraste mínimo de 4,5:1.
