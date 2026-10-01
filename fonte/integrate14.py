import sys

S = open('src.html', encoding='utf-8').read()

def rep(old, new, n=1):
    global S
    c = S.count(old)
    if c != n:
        sys.exit(f'ERRO: esperava {n} ocorrência(s), achei {c}: {old[:90]!r}')
    S = S.replace(old, new)

# ---------- uma lista só: o calendário lê as Reuniões, e a lista de eventos à parte sai ----------
rep("""  const events = [];
  for (let k = -35; k <= 70; k++) { const x = pd(off(k)); if (x.getDay() === 1) events.push({ id: 'e' + k, clientId: 'mo', title: 'Revisão da semana', date: off(k), time: '10:00' }); }
  events.push({ id: 'erec', clientId: 'mo', title: 'Gravação das caixinhas', date: off(3), time: '14:00' });
""", "")
rep("return { people, clients, tasks, posts, scripts, events, pages, notes, ...seedV2() };",
    "return { people, clients, tasks, posts, scripts, pages, notes, ...seedV2() };")
rep("""  db.events.filter(e => e.clientId === cid).forEach(e => it.push({ id: e.id, date: e.date, title: `${e.time} ${e.title}`, kind: 'meet', cls: 'k-meet' }));
""", "")

# calendário do time: as reuniões já vinham das Reuniões; sai o filtro que tirava os eventos antigos
rep("const items = [...ids.flatMap(id => calItems(db, id, false)).filter(i => i.kind !== 'meet'), ...meets].filter(i => !hide.includes(i.kind));",
    "const items = [...ids.flatMap(id => calItems(db, id, false)), ...meets].filter(i => !hide.includes(i.kind));")

# calendário do cliente: as reuniões que ele vê, com o horário na língua dele
rep("""function PortalCal({ c, lang, openPiece, goMeet }) {
  const { db } = useApp();
  const t = TX[lang];
  const [month, setMonth] = useState(new Date(T0.getFullYear(), T0.getMonth(), 1));
  const items = calItems(db, c.id, true).map(i => i.kind === 'meet' ? { ...i, title: i.title } : i);""",
"""function PortalCal({ c, lang, openPiece, goMeet }) {
  const app = useApp(); const { db } = app;
  const t = TX[lang];
  const [month, setMonth] = useState(new Date(T0.getFullYear(), T0.getMonth(), 1));
  const tm = iso => new Date(iso).toLocaleTimeString(LOC(lang), { hour: 'numeric', minute: '2-digit' });
  const meets = allMeetings(app).filter(m => m.clientId === c.id && m.show).map(m => ({ id: m.key, date: dayOf(m.start), title: `${tm(m.start)} ${m.title}`, kind: 'meet', cls: 'k-meet' }));
  const items = [...calItems(db, c.id, true), ...meets];""")

# pacote do mês: conta as reuniões das Reuniões
rep("""function PackCard({ c, setTab }) {
  const { db, act, open } = useApp();""",
"""function PackCard({ c, setTab }) {
  const app = useApp(); const { db, act, open } = app;""")
rep("const meets = db.events.filter(e => e.clientId === c.id && inM(e.date)).length;",
    "const meets = allMeetings(app).filter(m => m.clientId === c.id && inM(dayOf(m.start))).length;")

if 'db.events' in S or 'd.events' in S:
    sys.exit('ERRO: ainda sobrou leitura da lista de eventos')
open('src.html', 'w', encoding='utf-8').write(S)
print('v14 costurada')
