p='src.html'; s=open(p,encoding='utf-8').read()
v8=open('v8a.js',encoding='utf-8').read()+open('v8b.js',encoding='utf-8').read()+open('v8c.js',encoding='utf-8').read(); css=open('css_v8.txt',encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt, ('COUNT', s.count(a), a[:140]); s=s.replace(a,b)
def cut(start,end):
    global s
    i=s.index(start); j=s.index(end,i); s=s[:i]+s[j:]
# o quadro antigo sai inteiro (o novo está no módulo v8)
cut('function bbox(els) {', 'function BoardPage({ id }) {')
cut("const TOOLS = [['select', 'cursor', 'Selecionar', 'V']", '/* ================= v2: funis')
rep("""      <span class="spacer"></span><span class="muted cv-hint">Arraste com espaço pressionado para mover a lousa · ⌘ + rolagem para zoom</span>
    </div>
    <${Whiteboard} board=${b} key=${b.id} />""", """    </div>
    <${Whiteboard} board=${b} key=${b.id} />""")
# post-it com as cores clássicas do Miro, além das da marca
rep("const STICKY = { sand: '#EFE3CD', cream: '#F7F0E3', green: '#DCE9DD', blue: '#DCE6F0', lilac: '#E6E0F0', pink: '#F2DEDC' };",
    "const STICKY = { sand: '#EFE3CD', cream: '#F7F0E3', yellow: '#FDF1A6', orange: '#FAD9B8', green: '#DCE9DD', blue: '#DCE6F0', lilac: '#E6E0F0', pink: '#F2DEDC', gray: '#E4E2DF' };")
# o quadro de exemplo mostra o que o quadro faz: a moldura e o mapa mental saem do mesmo conteúdo
rep("""      { id: 'h1', t: 'text', x: 40, y: 10, w: 640, h: 44, text: 'Onboarding: do sim do cliente à primeira peça', size: 24 },""",
    """      { id: 'fr1', t: 'frame', x: 16, y: 40, w: 750, h: 380, title: 'Onboarding: do sim do cliente à primeira peça' },""")
rep("""      { id: 'a3', t: 'arrow', from: 's3', to: 's5' }, { id: 'a4', t: 'arrow', from: 's4', to: 's6' },""",
    """      { id: 'a3', t: 'arrow', from: 's3', to: 's5' }, { id: 'a4', t: 'arrow', from: 's4', to: 's6' },
      { id: 'm0', t: 'mind', root: 'm0', parent: null, text: 'Onboarding', x: 40, y: 640, w: 140, h: 44 },
      ...[['m1', 'Dia 1', ['Cadastrar o cliente e criar a área', 'Mandar o acesso pelo WhatsApp']], ['m2', 'Semana 1', ['Pedir acesso ao Gerenciador de Negócios da Meta', 'Pedir o número do WhatsApp Business']], ['m3', 'Semana 2', ['Kickoff: descrever a operação do cliente melhor do que ele descreveu', 'Dúvida: quem aprova as peças do lado do cliente?']]]
        .flatMap(([id, t, kids]) => [{ id, t: 'mind', root: 'm0', parent: 'm0', text: t, x: 0, y: 0, w: 80, h: 34 }, ...kids.map((k, i) => ({ id: id + 'k' + i, t: 'mind', root: 'm0', parent: id, text: k, x: 0, y: 0, w: 80, h: 34 }))]),""")
rep("render(html`<${App} />`, document.getElementById('app'));", v8+"\nrender(html`<${App} />`, document.getElementById('app'));")
rep("</style>", css+"</style>")
open(p,'w',encoding='utf-8').write(s); print('ok')
