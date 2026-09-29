p='src.html'; s=open(p,encoding='utf-8').read()
v5=open('v5.js',encoding='utf-8').read(); css=open('css_v5.txt',encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt, ('COUNT', s.count(a), a[:120]); s=s.replace(a,b)
rep("useState(() => withFlows(seed()))", "useState(() => withTpls(withFlows(seed())))")
rep("blocks: [['Gancho', ''], ['Roteiro', ''], ['Chamada', '']] }), 'Roteiro criado')", "tpl: 'livre', blocks: [['', '']] }), 'Roteiro criado')")
rep("<dt>Etapa</dt><dd><${StageSelect} k=\"script\" x=${s} /></dd>\n      <dt>Formato</dt>", "<dt>Etapa</dt><dd><${StageSelect} k=\"script\" x=${s} /></dd>\n      <dt>Modelo</dt><dd><${TplSelect} s=${s} /></dd>\n      <dt>Formato</dt>")
a='<section class="sec" style="gap:14px"><div class="sec-h" style="padding:0"><h2>Roteiro</h2>'
i=s.index(a); j=s.index('<${MediaSection} k="script"', i)
s=s[:i]+'<section class="sec" style="gap:12px"><div class="sec-h" style="padding:0"><h2>Roteiro</h2><span class="muted" style="font-size:12px">clique e escreva, salva sozinho</span></div>\n      <${ScriptEditor} key=${s.id} s=${s} /></section>\n    '+s[j:]
rep('html`<div key=${i}><div class="label">${l}</div><p style="white-space:pre-wrap">${v}</p></div>`', 'html`<div key=${i}>${l && html`<div class="label">${l}</div>`}<p style="white-space:pre-wrap">${v}</p></div>`')
rep("x.blocks.map(b => `[${b[0]}] ${b[1]}`)", "x.blocks.map(b => (b[0] ? `[${b[0]}] ` : '') + b[1])")
rep("render(html`<${App} />`, document.getElementById('app'));", v5+"\nrender(html`<${App} />`, document.getElementById('app'));")
rep("</style>", css+"</style>")
open(p,'w',encoding='utf-8').write(s); print('ok')
