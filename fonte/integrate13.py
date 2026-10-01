import sys

S = open('src.html', encoding='utf-8').read()

def rep(old, new, n=1):
    global S
    c = S.count(old)
    if c != n:
        sys.exit(f'ERRO: esperava {n} ocorrência(s), achei {c}: {old[:90]!r}')
    S = S.replace(old, new)

def drop(name):
    """Tira a função antiga; a versão nova mora em v13.js."""
    global S
    tag = '\nfunction ' + name + '('
    if S.count(tag) != 1:
        sys.exit(f'ERRO: função {name} não encontrada ou repetida')
    a = S.find(tag)
    b = S.find('\n}\n', a + 1)
    if '\nfunction ' in S[a + 1:b]:
        sys.exit(f'ERRO: o fim de {name} não foi achado antes da função seguinte')
    S = S[:a + 1] + S[b + 3:]

# ---------- CSS e módulo novo ----------
css = open('css_v13.txt', encoding='utf-8').read()
rep('\n</style>\n\n<div id="app"></div>', '\n' + css + '</style>\n\n<div id="app"></div>')
drop('PortalMeetings')
mod = open('v13.js', encoding='utf-8').read()
rep("\nrender(html`<${App} />`, document.getElementById('app'));", mod + "\nrender(html`<${App} />`, document.getElementById('app'));")
rep("  Object.assign(act, actV12({ commit, notify, me, dbRef }));",
    "  Object.assign(act, actV12({ commit, notify, me, dbRef }));\n  Object.assign(act, actV13({ commit }));")

# ---------- dados: a reunião de exemplo que vem tem link e aparece para o cliente ----------
rep("start: dtOff(3, '10:00'), end: dtOff(3, '10:45'), attendees: team },",
    "start: dtOff(3, '10:00'), end: dtOff(3, '10:45'), attendees: team, meet: 'https://meet.google.com/abc-defg-hij' },")
rep("meetings, meetingNotes: {}, meetingClient: {},", "meetings, meetingNotes: {}, meetingClient: {}, meetingShow: { 'ex:m3': true },")

# ---------- quem vê: só reunião ligada a cliente; a marcada à mão aparece por padrão, a da Agenda só se alguém ligar ----------
rep("  return [...liveMeetings(live), ...db.meetings].map(m => ({ ...m, clientId: db.meetingClient[m.key] !== undefined ? db.meetingClient[m.key] : (m.clientId || null) }));",
    "  return [...liveMeetings(live), ...db.meetings].map(m => { const clientId = db.meetingClient[m.key] !== undefined ? db.meetingClient[m.key] : (m.clientId || null); const sh = db.meetingShow[m.key];\n    return { ...m, clientId, show: !!clientId && (sh !== undefined ? sh : !!m.manual) }; });")

# ---------- lista do time: Entrar direto na linha, e Nova reunião ----------
rep("""      <span>${plural(m.attendees.length, 'participante')}</span>
      ${m.meet && html`<span class="src"><${Icon} n="video" s=${12} />Meet</span>`}""",
"""      ${m.attendees.length > 0 && html`<span>${plural(m.attendees.length, 'participante')}</span>`}
      ${c && m.show && html`<span class="pill t-cli">Cliente vê</span>`}""")
rep("""      ${m.example && html`<span class="tag">EXEMPLO</span>`}
    </div></div></div>`; };""",
"""      ${m.example && html`<span class="tag">EXEMPLO</span>`}
    </div></div>${m.meet && notOver(m) && html`<a class="btn sm" href=${m.meet} target="_blank" rel="noopener" onClick=${e => e.stopPropagation()} onKeyDown=${e => e.stopPropagation()}><${Icon} n="video" s=${14} />Entrar</a>`}</div>`; };""")
rep("""  return html`<div class="sec" style="gap:20px">
    <${IntegrationCard} avail=${avail} />""",
"""  return html`<div class="sec" style="gap:20px">
    <div class="toolbar"><span class="spacer"></span><button class="btn" onClick=${() => open('meeting', app.act.addMeeting(clientId))}><${Icon} n="plus" s=${14} />Nova reunião</button></div>
    <${IntegrationCard} avail=${avail} />""")

# ---------- gaveta da reunião: título, horário e link editáveis, e quem vê ----------
rep("""    <div class="dtitle">${m.title}</div>
    <div class="row-meta" style="font-size:13px">""",
"""    ${m.live ? html`<div class="dtitle">${m.title}</div>` : html`<${Title} value=${m.title} onSave=${v => act.setMeeting(m.key, { title: v })} />`}
    <div class="row-meta" style="font-size:13px">""")
rep("""      ${m.meet && html`<a class="btn sm" href=${m.meet} target="_blank" rel="noopener"><${Icon} n="video" s=${14} />Abrir no Meet</a>`}""",
"""      ${m.meet && html`<a class=${cx('btn sm', notOver(m) && 'pri')} href=${m.meet} target="_blank" rel="noopener"><${Icon} n="video" s=${14} />${joinLabel(m.meet)}</a>`}""")
rep("""    <dl class="props"><dt>Cliente</dt><dd><select class="sel" id="mt-client" value=${m.clientId || ''} onChange=${e => act.linkMeeting(m.key, e.target.value || null)}><option value="">Sem cliente</option>${db.clients.map(c => html`<option value=${c.id}>${c.name}</option>`)}</select></dd>
      <dt>Participantes</dt>""",
"""    <dl class="props"><${MeetFields} m=${m} /><dt>Cliente</dt><dd><select class="sel" id="mt-client" value=${m.clientId || ''} onChange=${e => act.linkMeeting(m.key, e.target.value || null)}><option value="">Sem cliente</option>${db.clients.map(c => html`<option value=${c.id}>${c.name}</option>`)}</select></dd>
      <${MeetShow} m=${m} />
      <dt>Participantes</dt>""")
rep("""${m.attendees.length ? m.attendees.map((a, i) => html`<span class="tag" key=${i} title=${a.email || ''}>${a.name}</span>`) : html`<span class="muted">—</span>`}</dd></dl>""",
"""${m.attendees.length ? m.attendees.map((a, i) => html`<span class="tag" key=${i} title=${a.email || ''}>${a.name}</span>`) : html`<span class="muted">—</span>`}</dd></dl>
    ${m.manual && html`<${MeetDel} m=${m} />`}""")

open('src.html', 'w', encoding='utf-8').write(S)
print('v13 costurada')
