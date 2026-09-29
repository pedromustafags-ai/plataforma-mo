p='src.html'; s=open(p,encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt, ('COUNT', s.count(a), a[:140]); s=s.replace(a,b)
# ---------- nomes curtos no menu ----------
rep("{ id: 'b1', clientId: null, title: 'Mapa do onboarding de cliente',", "{ id: 'b1', clientId: null, title: 'Quadro branco',")
rep("{ id: 'f1', clientId: 'mo', title: 'Funil de Qualificação Imediata',", "{ id: 'f1', clientId: 'mo', title: 'Funil de vendas',")
rep("f.tpl === 'qualif' ? 'Funil de Qualificação Imediata' : 'Funil sem título'", "f.tpl === 'qualif' ? 'Funil de vendas' : 'Funil sem título'")
# ---------- "+" sem nome vira linha escrita ----------
rep("""${SecH('clients', 'Clientes', can('client.create') && html`<button class="sec-add" title="Novo cliente" aria-label="Novo cliente" onClick=${() => setModal({ t: 'newClient' })}><${Icon} n="plus" s=${13} /></button>`)}""",
    """${SecH('clients', 'Clientes')}""")
rep("""        ${isOpen && html`<div class="tree-kids">${CLIENT_TABS.map(([k, l, ic]) => html`<button key=${k} class=${cx('nav kid', here && route.tab === k && 'on')} onClick=${() => go({ v: 'client', id: c.id, tab: k })}><${Icon} n=${ic} s=${14} /><span class="lb">${l}</span></button>`)}</div>`}
      </div>`; })}</div>`,""",
    """        ${isOpen && html`<div class="tree-kids">${CLIENT_TABS.map(([k, l, ic]) => html`<button key=${k} class=${cx('nav kid', here && route.tab === k && 'on')} onClick=${() => go({ v: 'client', id: c.id, tab: k })}><${Icon} n=${ic} s=${14} /><span class="lb">${l}</span></button>`)}</div>`}
      </div>`; })}
      ${!collapsed('clients') && can('client.create') && html`<button class="nav add-row" title="Cadastrar um cliente novo" onClick=${() => setModal({ t: 'newClient' })}><${Icon} n="plus" /><span class="lb">Novo cliente</span></button>`}</div>`,""")
# ---------- rodapé sempre à vista, com as opções no menu do nome ----------
rep("""    <div class="side-foot">
      <div class="me" title=${me.name}><span class="av">${me.ini}</span><span class="lb"><b>${me.name}</b><small>${me.role === 'socio' ? 'Sócio' : 'Colaborador'}</small></span></div>
      <div class="p-menu"><button class="nav" onClick=${() => setMenu(menu === 'prefs' ? null : 'prefs')} title="Personalizar barra"><${Icon} n="sliders" /><span class="lb">Personalizar barra</span></button>
        ${menu === 'prefs' && html`<${SidePrefs} prefs=${prefs} setPrefs=${setPrefs} close=${() => setMenu(null)} />`}</div>
      <div class="p-menu"><button class="nav" title="Aparência" onClick=${() => setMenu(menu === 'look' ? null : 'look')}><${Icon} n=${theme === 'dark' ? 'moon' : 'sun'} /><span class="lb">Aparência</span></button>${menu === 'look' && html`<${AppearancePop} close=${() => setMenu(null)} />`}</div>
      <button class="nav" title="Trocar acesso" onClick=${() => setSession(null)}><${Icon} n="logout" /><span class="lb">Trocar acesso</span></button>
      <p class="proto lb">Protótipo com dados de exemplo da M&O. Nada é salvo.</p>
    </div>""",
"""    <div class="side-foot p-menu">
      <button class=${cx('me me-btn', menu === 'me' && 'on')} title="Sua conta, aparência e barra" aria-expanded=${menu === 'me'} onClick=${() => setMenu(menu === 'me' ? null : 'me')}><span class="av">${me.ini}</span><span class="lb"><b>${me.name}</b><small>${me.role === 'socio' ? 'Sócio' : 'Colaborador'}</small></span><span class="lb me-chev"><${Icon} n="chevUp" s=${14} /></span></button>
      ${menu === 'me' && html`<div class="pop side-pop me-pop" role="menu"><button onClick=${() => setMenu('look')}><${Icon} n=${theme === 'dark' ? 'moon' : 'sun'} />Aparência</button><button onClick=${() => setMenu('prefs')}><${Icon} n="sliders" />Personalizar barra</button><button onClick=${() => { setMenu(null); setSession(null); }}><${Icon} n="logout" />Trocar acesso</button><p class="proto">Protótipo com dados de exemplo da M&O. Nada é salvo.</p></div>`}
      ${menu === 'prefs' && html`<${SidePrefs} prefs=${prefs} setPrefs=${setPrefs} close=${() => setMenu(null)} />`}
      ${menu === 'look' && html`<${AppearancePop} close=${() => setMenu(null)} />`}
    </div>""")
rep("</style>", """/* v8: menu lateral legível e sem nada escondido */
.side-label{font:700 12px/1 var(--sans);letter-spacing:.06em;color:var(--side-strong);padding:16px 10px 7px}
.side-label .chev{color:var(--side-label)}
.nav{min-height:32px;padding:5px 10px}
.tree-main{min-height:32px}
.tree-tog{height:32px}
.nav.add-row{color:var(--side-label)}
.nav.add-row:hover{color:var(--side-strong)}
.side-foot{position:sticky;bottom:-12px;margin:auto -10px -12px;padding:8px 10px 12px;background:var(--side-bg);box-shadow:0 -10px 14px -12px rgba(0,0,0,.28);z-index:3}
.me-btn{border:0;background:none;width:100%;text-align:left;border-radius:8px;color:inherit;font:inherit;cursor:pointer}
.me-btn:hover,.me-btn.on{background:var(--side-hover)}
.me-chev{margin-left:auto;color:var(--side-label);display:inline-flex}
.me-pop{display:flex;flex-direction:column;gap:2px;padding:6px;width:240px}
.me-pop button{display:flex;align-items:center;gap:10px;border:0;background:none;padding:8px 10px;border-radius:8px;text-align:left;font:inherit;font-size:14px;color:var(--text);cursor:pointer}
.me-pop button:hover{background:var(--hover)}
.me-pop .proto{color:var(--text-3);padding:6px 10px 2px;border-top:1px solid var(--line);margin-top:4px}
</style>""")
open(p,'w',encoding='utf-8').write(s); print('ok')
