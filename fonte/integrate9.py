import re, sys

S = open('src.html', encoding='utf-8').read()

def rep(old, new, n=1):
    global S
    c = S.count(old)
    if c != n:
        sys.exit(f'ERRO: esperava {n} ocorrência(s), achei {c}: {old[:90]!r}')
    S = S.replace(old, new)

def func(name, new):
    global S
    a = S.find('\nfunction ' + name + '(')
    if a < 0 or S.count('\nfunction ' + name + '(') != 1:
        sys.exit(f'ERRO: função {name} não encontrada ou repetida')
    b = S.find('\n}\n', a + 1)
    S = S[:a + 1] + new.strip('\n') + S[b + 2:]

def block(start, end, new):
    global S
    a = S.find(start)
    if a < 0 or S.count(start) != 1:
        sys.exit(f'ERRO: início não achado ou repetido: {start[:80]!r}')
    b = S.find(end, a)
    if b < 0:
        sys.exit(f'ERRO: fim não achado: {end[:80]!r}')
    S = S[:a] + new + S[b + len(end):]

# ---------- CSS e bloco novo ----------
css = open('css_v9.txt', encoding='utf-8').read()
rep('\n</style>\n\n<div id="app"></div>', '\n' + css + '</style>\n\n<div id="app"></div>')
v9 = open('v9.js', encoding='utf-8').read()
rep("\nrender(html`<${App} />`, document.getElementById('app'));", v9 + "\nrender(html`<${App} />`, document.getElementById('app'));")

# ---------- dados e ações ----------
rep("format: 'Carrossel', assignee: 'pedro', comments: []", "format: 'carrossel', assignee: 'pedro', comments: []")
rep("media: [], format: 'Carrossel', assignee: me?.id || 'pedro'", "media: [], format: null, fmtAuto: true, video: null, assignee: me?.id || 'pedro'")
rep("media: [], format: 'Carrossel', assignee: who", "media: [], format: null, fmtAuto: true, video: null, assignee: who")
rep("x.sentAt = off(0); Object.assign(x, patch); }, msg),\n",
    "x.sentAt = off(0); Object.assign(x, patch); }, msg),\n    mutItem: (k, id, fn, msg) => commit(d => { const x = itemOf(d, k, id); if (x) fn(x, d); }, msg),\n")
rep("legenda: x.caption, slides: x.imgs.length,", "legenda: x.caption, formato: fmtName('pt', x.format) || 'sem formato', slides: x.imgs.length,")

# ---------- tema do time: Personalizado ----------
rep("""  const theme = look.mode === 'auto' ? (sysDark ? 'dark' : 'light') : look.mode;
  const setTheme = m => setLook({ ...look, mode: m });""",
"""  const custom = look.useCustom && look.custom ? customTheme(look.custom) : null;
  const theme = custom ? custom.mode : look.mode === 'auto' ? (sysDark ? 'dark' : 'light') : look.mode;
  const setTheme = m => setLook({ ...look, mode: m, useCustom: false });""")
rep("""useEffect(() => { const root = document.documentElement; root.dataset.theme = theme; const th = THEMES[theme === 'dark' ? look.dark : look.light] || THEMES[theme === 'dark' ? 'grafite' : 'areia']; Object.entries(themeVars(th)).forEach(([k, v]) => root.style.setProperty(k, v)); root.style.colorScheme = theme; }, [theme, look.light, look.dark]);""",
"""useEffect(() => { const root = document.documentElement; root.dataset.theme = theme; const th = custom || THEMES[theme === 'dark' ? look.dark : look.light] || THEMES[theme === 'dark' ? 'grafite' : 'areia']; Object.entries(themeVars(th)).forEach(([k, v]) => root.style.setProperty(k, v)); root.style.colorScheme = theme; }, [theme, look.light, look.dark, look.useCustom, JSON.stringify(look.custom || null)]);""")
rep("""function clientTheme(c, sysDark) {
  const b = c.brand || {}; const t = b.theme""", """function clientTheme(c, sysDark) {
  const b = c.brand || {}; if (b.useCustom && b.custom) return customTheme(b.custom); const t = b.theme""")

func('AppearancePop', r"""
function AppearancePop({ close }) {
  const { look, setLook, db, theme } = useApp(); const useC = !!(look.useCustom && look.custom);
  const mo = db.clients.find(x => x.id === 'mo');
  const palette = [...new Set([...(((look.custom || {}).palette) || []), ...((mo && mo.brand && mo.brand.colors) || [])])];
  const cur = THEMES[theme === 'dark' ? look.dark : look.light] || THEMES.areia;
  const setMode = m => setLook({ ...look, mode: m, useCustom: false });
  const idv = f => { const hx = f.colors.map(c => c.hex); const sl = autoSlots(hx); if (sl) setLook({ ...look, useCustom: true, custom: { ...sl, palette: [...new Set([...hx, ...(((look.custom || {}).palette) || [])])].slice(0, 12) } }); };
  return html`<div class="pop side-pop look-pop" role="dialog" aria-label="Aparência">
    <div class="pop-h"><b>Aparência</b><button class="btn icon sm ghost" aria-label="Fechar" onClick=${close}><${Icon} n="x" s=${14} /></button></div>
    <div class="seg" style="align-self:stretch"><button class=${cx(!useC && 'on')} style="flex:1;justify-content:center" onClick=${() => setLook({ ...look, useCustom: false })}>Modelos prontos</button><button class=${cx(useC && 'on')} style="flex:1;justify-content:center" onClick=${() => setLook({ ...look, useCustom: true, custom: look.custom || seedSlots(cur) })}>Personalizado</button></div>
    ${useC ? html`<p class="muted" style="font-size:12px">Suba a identidade visual e a gente distribui as cores, ou escolha cada cor. Pode digitar #1E90FF ou 30, 144, 255. A barra ao lado muda na hora.</p>
        <${IdvReader} compact lang="pt" onApply=${idv} />
        <${CustomEditor} value=${look.custom} onChange=${cu => setLook({ ...look, useCustom: true, custom: cu })} palette=${palette} lang="pt" />`
      : html`<div class="seg" style="align-self:stretch">${[['light', 'Claro'], ['dark', 'Escuro'], ['auto', 'Automático']].map(([k, l]) => html`<button key=${k} class=${cx(look.mode === k && 'on')} style="flex:1;justify-content:center" onClick=${() => setMode(k)}>${l}</button>`)}</div>
        <span class="label">Estilos claros</span><div class="th-grid">${LIGHTS.map(id => html`<${ThemeCard} key=${id} th=${THEMES[id]} on=${look.light === id} onClick=${() => setLook({ ...look, light: id, mode: 'light', useCustom: false })} />`)}</div>
        <span class="label">Estilos escuros</span><div class="th-grid">${DARKS.map(id => html`<${ThemeCard} key=${id} th=${THEMES[id]} on=${look.dark === id} onClick=${() => setLook({ ...look, dark: id, mode: 'dark', useCustom: false })} />`)}</div>
        <p class="muted" style="font-size:12px">Escolher um estilo liga o modo dele. No automático, o painel alterna entre o seu estilo claro e o escuro junto com o sistema.</p>`}
    <p class="muted" style="font-size:12px">Fica salvo neste navegador.</p>
  </div>`;
}
""")

func('BrandEditor', r"""
function BrandEditor({ c, lang = 'pt', asClient }) {
  const { act, toast } = useApp();
  const t = BT[lang] || BT.pt; const C = CS[lang] || CS.pt; const b = c.brand || {}; const th = b.theme || { mode: 'light', light: 'areia', dark: 'grafite' };
  const set = patch => act.setBrand(c.id, patch); const useC = !!(b.useCustom && b.custom);
  const onLogo = async (e, key) => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return; const data = await logoData(f); const patch = { [key]: data };
    if (key === 'logo') { patch.logoIsDark = await logoIsDark(data); try { const pal = await paletteFromImage(data); const cols = mergeColors(pal.map(p => ({ ...p, src: 'img' }))).slice(0, 6).map(x => x.hex); const merged = [...new Set([...(b.colors || []), ...cols])].slice(0, 10); patch.colors = merged; if (!b.primary) patch.primary = pickPrimary(pal.map(p => ({ hex: p.hex }))); } catch (er) {} }
    set(patch); };
  const applyFound = found => { const hx = found.colors.map(x => x.hex); const sl = autoSlots(hx); const cols = [...new Set([...hx, ...(b.colors || [])])].slice(0, 10); const font = found.fonts[0] || b.font || null;
    set({ colors: cols, primary: pickPrimary(found.colors) || b.primary || null, font, ...(sl ? { custom: sl, useCustom: true } : {}) }); toast(sl ? t.appliedCustom : t.applied); };
  const cols = b.colors || [];
  const Slot = (key, label, bgDark) => html`<div class=${cx('logo-slot', bgDark && 'dark')}>
    <div class="logo-prev">${b[key] ? html`<img src=${b[key]} alt="" />` : key === 'logo' && c.id === 'mo' ? html`<${Logo} />` : html`<span class="muted" style="font-size:12px">—</span>`}</div>
    <div class="logo-meta"><span>${label}</span><span style="display:flex;gap:6px"><label class="btn sm"><${Icon} n="plus" s=${13} />${t.upload}<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" class="sr" onChange=${e => onLogo(e, key)} /></label>${b[key] && html`<button class="btn sm ghost" onClick=${() => set({ [key]: null })}>${t.remove}</button>`}</span></div></div>`;
  const pv = clientTheme(c, false); const pvD = clientTheme({ ...c, brand: { ...b, theme: { ...th, mode: 'dark' } } }, true);
  const TXl = TX[lang] || TX.pt; const PL = PX[lang] || PX.pt;
  const Mock = tm => { const sd = tm.side ? tm.side.bg : tm.surface2; return html`<div class="mock" style=${portalStyle(c, tm)}>
    <div class="mock-side"><div class="mock-logo"><${ClientLogo} c=${c} dark=${onDarkOf(sd)} /></div>${[TXl.forYou, PL.board, TXl.cal, TXl.content].map((l, i) => html`<span key=${i} class=${cx('mock-nav', i === 0 && 'on')}>${l}</span>`)}</div>
    <div class="mock-main"><div class="mock-body"><span class="pill t-cli">${TXl.st.cliente}</span><b>${t.pMock}</b><div class="mock-img"></div><div class="mock-acts"><span class="btn sm">${TXl.change}</span><span class="btn sm pri">${TXl.approve}</span></div></div>
      <div class="mock-foot"><${PoweredBy} lang=${lang} /></div></div></div>`; };
  return html`<div class="brand-ed">
    <div class="be-main">
      ${asClient && html`<div><h1 style="font-size:24px">${t.title}</h1><p class="muted" style="margin-top:4px">${t.sub}</p></div>`}
      <section class="sec be-sec"><h2>${t.logo}</h2><div class="logo-slots">${Slot('logo', t.logoLight, false)}${Slot('logoDark', t.logoDark, true)}</div></section>
      <section class="sec be-sec"><h2>${t.theme}</h2>
        <div class="seg" style="align-self:flex-start"><button class=${cx(!useC && 'on')} onClick=${() => set({ useCustom: false })}>${C.ready}</button><button class=${cx(useC && 'on')} onClick=${() => set({ useCustom: true, custom: b.custom || seedSlots(clientTheme({ ...c, brand: { ...b, useCustom: false } }, false)) })}>${C.custom}</button></div>
        ${useC ? html`<p class="muted">${C.customSub}</p>
            <${IdvReader} lang=${lang} onApply=${applyFound} />
            <${CustomEditor} value=${b.custom} onChange=${cu => set({ custom: cu, useCustom: true })} palette=${cols} lang=${lang} />`
          : html`<div class="seg" style="align-self:flex-start">${[['light', t.light], ['dark', t.dark], ['auto', t.auto]].map(([k, l]) => html`<button key=${k} class=${cx(th.mode === k && 'on')} onClick=${() => set({ theme: { ...th, mode: k } })}>${l}</button>`)}</div>
            <span class="label">${t.lightS}</span><div class="th-grid">${isHex(b.primary) && html`<${ThemeCard} th=${brandTheme(b.primary, 'light')} label=${t.brandT} on=${th.light === 'brand'} onClick=${() => set({ theme: { ...th, light: 'brand' } })} />`}${LIGHTS.map(id => html`<${ThemeCard} key=${id} th=${THEMES[id]} on=${th.light === id} onClick=${() => set({ theme: { ...th, light: id } })} />`)}</div>
            <span class="label">${t.darkS}</span><div class="th-grid">${isHex(b.primary) && html`<${ThemeCard} th=${brandTheme(b.primary, 'dark')} label=${t.brandT} on=${th.dark === 'brand'} onClick=${() => set({ theme: { ...th, dark: 'brand' } })} />`}${DARKS.map(id => html`<${ThemeCard} key=${id} th=${THEMES[id]} on=${th.dark === id} onClick=${() => set({ theme: { ...th, dark: id } })} />`)}</div>`}
        <p class="muted" style="font-size:12px">${t.powered}</p>
      </section>
      <section class="sec be-sec"><h2>${t.colors}</h2>
        ${cols.length ? html`<div class="sw-row">${cols.map(h => html`<button key=${h} class=${cx('sw-lg pick', b.primary === h && 'on')} onClick=${() => set({ primary: h })} title=${t.primary}><i style=${{ background: h }}></i><span class="mono">${h}</span>${b.primary === h && html`<small>${t.primary}</small>`}</button>`)}
          <label class="sw-lg add" title=${t.add}><i><${Icon} n="plus" s=${14} /></i><span>${t.add}</span><input type="color" class="sr" onChange=${e => set({ colors: [...new Set([...cols, e.target.value.toUpperCase()])], primary: b.primary || e.target.value.toUpperCase() })} /></label></div>`
          : html`<p class="muted">${t.noColors}</p>`}
        <div class="two" style="max-width:520px"><label class="field"><span>${t.font}</span><select class="sel" id=${'be-font-' + c.id} value=${b.font || ''} onChange=${e => set({ font: e.target.value || null })}><option value="">${t.fontNone}</option>${[...new Set([...(b.font ? [b.font] : []), ...GFONTS])].map(f => html`<option key=${f} value=${f}>${f}</option>`)}</select></label>
          <label class="field"><span>${t.lang}</span><select class="sel" id=${'be-lang-' + c.id} value=${c.lang} onChange=${e => act.setClient(c.id, { lang: e.target.value })}>${LANGS.map(([k, l]) => html`<option key=${k} value=${k}>${l}</option>`)}</select></label></div>
      </section>
    </div>
    <aside class="be-prev"><span class="label">${t.preview}</span>${useC ? Mock(pv) : html`${Mock(pv)}${Mock(pvD)}`}
      <p class="be-note">${t.contrastT}: ${t.textT} ${nf(contrast(pv.text, pv.bg), 1)}:1 · ${t.buttonT} ${nf(contrast(pv.onPrimary, pv.primary), 1)}:1</p>
      ${!useC && pv.brand && isHex(b.primary) && pv.primary !== String(b.primary).toUpperCase() && html`<p class="be-note">${t.adjusted}</p>`}
      ${b.logo && b.logoIsDark && !b.logoDark && html`<p class="be-warn">${t.darkLogo}</p>`}</aside>
  </div>`;
}
""")

# ---------- painel do cliente com barra lateral ----------
rep("const t = TX[lang] || TX.pt; const R = RQ[lang] || RQ.pt; const th = clientTheme(c, sysDark);",
    "const t = TX[lang] || TX.pt; const R = RQ[lang] || RQ.pt; const th = clientTheme(c, sysDark); const sideDark = onDarkOf(th.side ? th.side.bg : th.surface2);")
block("""  return html`<div class="portal" style=${portalStyle(c, th)}>
    <header class="p-top">""", """    <div class="p-scroll" ref=${scRef}><div class=${cx('p-body', tab === 'board' && 'wide')}>${view}<footer class="p-foot"><${PoweredBy} lang=${lang} /></footer></div></div>
""", r"""  return html`<div class="portal" style=${portalStyle(c, th)}>
    <div class="p-frame">
    <aside class="p-side">
      <button class="p-brand" onClick=${() => pick('home')} aria-label=${c.name}><${ClientLogo} c=${c} dark=${sideDark} /></button>
      <nav class="p-tabs" aria-label="Seções">${tabs.map(([k, l, ic, n]) => html`<button key=${k} class=${cx('p-tab', tab === k && 'on')} aria-current=${tab === k ? 'page' : null} onClick=${() => pick(k)}><${Icon} n=${ic} s=${20} /><span class="pt-l">${l}</span>${n ? html`<span class="badge">${n}</span>` : null}</button>`)}</nav>
      <div class="p-side-foot"><${PoweredBy} lang=${lang} /></div>
    </aside>
    <div class="p-main">
    <header class="p-top"><button class="p-brand p-brand-m" onClick=${() => pick('home')} aria-label=${c.name}><${ClientLogo} c=${c} dark=${th.mode === 'dark'} /></button>
      <div class="right">
        <button class="btn sm p-req" onClick=${() => setAsk(true)} title=${R.ask}><${Icon} n="plus" s=${14} /><span>${R.ask}</span></button>
        <${LangPop} lang=${lang} setLang=${setLang} />
        <div class="p-menu"><button class="btn icon ghost" aria-label="Menu" aria-expanded=${menu} onClick=${() => setMenu(!menu)}><${CMark} c=${c} /></button>
          ${menu && html`<div class="pop">${who && html`<div class="pop-who"><b>${who.name}</b><small>${who.func || PL.team}</small></div>`}<button onClick=${() => { pick('team'); setMenu(false); }}><${Icon} n="users" />${PL.team}</button><button onClick=${() => { pick('brand'); setMenu(false); }}><${Icon} n="sliders" />${t.personalize}</button>${!preview && html`<button onClick=${() => setSession(null)}><${Icon} n="logout" />${t.switchAcc}</button>`}<div class="pop-foot"><${PoweredBy} lang=${lang} /></div></div>`}</div>
      </div></header>
    <div class="p-scroll" ref=${scRef}><div class=${cx('p-body', tab === 'board' && 'wide')}>${view}<footer class="p-foot"><${PoweredBy} lang=${lang} /></footer></div></div>
    </div>
    </div>
""")

rep("  const who = session && session.userId ? db.people.find(p => p.id === session.userId) : null;\n  const [piece, setPiece]",
    "  const who = !preview && session && session.userId ? db.people.find(p => p.id === session.userId) : null;\n  const [piece, setPiece]")

# ---------- post: formato, prévia e arquivos ----------
func('Thumb', r"""
function Thumb({ p, pillText, tone, lang = 'pt' }) {
  const cover = pieceCover(p); const n = (p.imgs || []).length; const fl = fmtName(lang, p.format);
  return html`<div class="thumb">${cover ? html`<img src=${cover} alt=${'Capa de ' + p.title} loading="lazy" />` : html`<div class="noart"><small>${(PM[lang] || PM.pt).none}</small><b>${p.title}</b><small>${fl}</small></div>`}
    ${pillText ? html`<span class=${'pill t-' + tone}>${pillText}</span>` : html`<${Pill} kind="post" st=${p.status} />`}
    ${cover && fl && html`<span class="thumb-fmt">${p.video ? html`<${Icon} n="play" s=${10} />` : null}${fl}${n > 1 && !p.video ? ' · ' + n : ''}</span>`}</div>`;
}
""")
func('PostBody', r"""
function PostBody({ p }) {
  const { act } = useApp();
  const set = (patch, m) => act.setItem('post', p.id, patch, m);
  return html`
    <${Title} value=${p.title} onSave=${v => set({ title: v })} />
    <${FormatPicker} x=${p} onPick=${f => set({ format: f, fmtAuto: false }, 'Formato: ' + FMT_T.pt[f])} />
    <${FlowBar} k="post" x=${p} />
    <div class="pd-grid">
      <${PieceMedia} k="post" x=${p} edit />
      <div class="sec" style="gap:18px">
        <dl class="props">
          <dt>Etapa</dt><dd><${StageSelect} k="post" x=${p} /></dd>
          <dt>Publicação</dt><dd><input class="inp" id="p-date" type="date" value=${p.date || ''} onChange=${e => set({ date: e.target.value || null })} /></dd>
          <dt>Responsável</dt><dd><${PersonSel} id="p-who" clientId=${p.clientId} value=${p.assignee} onChange=${v => set({ assignee: v })} /></dd>
          <dt>Cliente vê?</dt><dd class="muted">${POST_VISIBLE.includes(p.status) ? 'Sim, na área dele' : 'Ainda não. Só a partir de "Com o cliente"'}</dd>
        </dl>
        <section class="sec" style="gap:8px"><div class="sec-h" style="padding:0"><h2>Legenda</h2><span class="tag">EN</span></div>
          <textarea key=${p.id} class="ta" id="p-cap" style="min-height:110px" defaultValue=${p.caption} placeholder="Legenda do post" onBlur=${e => e.target.value !== p.caption && set({ caption: e.target.value })}></textarea>
          ${p.cta && html`<p class="cta">${p.cta}</p>`}</section>
      </div>
    </div>
    <${MediaSection} k="post" x=${p} team />
    <${Comments} k="post" x=${p} />`;
}
""")
rep("    <${MediaSection} k=\"script\" x=${s} />", "    <${MediaSection} k=\"script\" x=${s} team />")
func('Slider', r"""
function Slider({ imgs, title, ratio, idx, onIdx, overlay }) {
  const [i0, setI0] = useState(0); const x0 = useRef(null);
  const S = ratio ? { aspectRatio: String(ratio) } : null;
  if (!imgs.length) return html`<div class="slider" style=${S}><div class="noart"><small>Sem arte ainda</small><b>${title}</b><small>A arte aparece aqui quando o design subir</small></div></div>`;
  const i = Math.min(idx != null ? idx : i0, imgs.length - 1);
  const setI = n => { if (onIdx) onIdx(n); else setI0(n); };
  const go = n => setI(Math.max(0, Math.min(imgs.length - 1, n)));
  return html`<div class="slider" style=${S} onPointerDown=${e => { x0.current = e.clientX; }} onPointerUp=${e => { if (x0.current == null) return; const dx = e.clientX - x0.current; x0.current = null; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); }}>
      <img src=${imgs[i]} alt=${`${title}, slide ${i + 1} de ${imgs.length}`} draggable="false" />
      ${imgs.length > 1 && html`<span class="sl-count">${i + 1}/${imgs.length}</span>`}
      ${i > 0 && html`<button class="sl-nav l" aria-label="Slide anterior" onPointerDown=${e => e.stopPropagation()} onClick=${() => go(i - 1)}><${Icon} n="chevL" /></button>`}
      ${i < imgs.length - 1 && html`<button class="sl-nav r" aria-label="Próximo slide" onPointerDown=${e => e.stopPropagation()} onClick=${() => go(i + 1)}><${Icon} n="chevR" /></button>`}
      ${overlay}
    </div>
    ${imgs.length > 1 && html`<div class="dots">${imgs.map((_, kk) => html`<button key=${kk} class=${cx(kk === i && 'on')} aria-label=${`Slide ${kk + 1}`} onClick=${() => setI(kk)}></button>`)}</div>`}`;
}
""")
rep("""function linkInfo(url) {
  const u = String(url || '').trim();""", """function linkInfo(url, kind) {
  if (kind === 'pdf') return { k: 'pdf', label: 'PDF', host: 'arquivo', tone: '#B3261E' };
  const u = String(url || '').trim();""")
func('LinkPreview', r"""
function LinkPreview({ url, name, kind, compact, onRemove, lang = 'pt', fetchThumb }) {
  const i = linkInfo(url, kind); const [bad, setBad] = useState(false); const title = niceName(url, name); const open = (TX[lang] || TX.pt).open;
  const ext = /^(data:|blob:)/.test(url) ? null : url;
  const dr = !compact && fetchThumb ? driveRef(url) : null; const canThumb = !!(dr && dr.kind !== 'folder');
  const [th, setTh] = useState(null); const [ts, setTs] = useState(null);
  const loadTh = async () => { setTs('loading'); try { const s = await driveThumb(url); setTh(s || null); setTs(s ? null : 'none'); } catch (e) { setTs({ err: mcpMsg(e, SRV.drive) }); } };
  useEffect(() => { if (!canThumb) return; let on = true; (async () => { const mcp = await cap('mcp'); if (!on || !mcp) return; const perms = await cap('permissions'); const st = perms ? await perms.state('mcp:' + SRV.drive).catch(() => 'prompt') : 'prompt'; if (!on) return; if (st === 'granted') loadTh(); else if (st !== 'unavailable') setTs('ask'); })(); return () => { on = false; }; }, [url, canThumb]);
  const Tile = html`<span class="lp-tile" style=${i.tone ? { background: i.tone } : null}><${Icon} n=${i.video ? 'play' : i.k === 'image' ? 'image' : i.k === 'gfolder' ? 'book' : 'file'} s=${compact ? 14 : 18} /></span>`;
  if (compact) return html`<div class="lp-row">${Tile}<span class="lp-t"><b>${title}</b><small>${i.label}${i.host && i.host !== i.label ? ' · ' + i.host : ''}</small></span>
    ${ext && html`<a class="btn sm icon ghost" href=${ext} target="_blank" rel="noopener" aria-label=${open} title=${open}><${Icon} n="ext" s=${14} /></a>`}
    ${onRemove && html`<button class="btn sm icon ghost" aria-label="Remover" onClick=${onRemove}><${Icon} n="x" s=${14} /></button>`}</div>`;
  let media = null;
  if (th) media = html`<div class="lp-doc" style=${{ '--tone': i.tone }}><img src=${th} alt="" /><span class="lp-badge">${i.label}</span></div>`;
  else if (canThumb) media = html`<div class="lp-doc empty" style=${{ '--tone': i.tone || 'var(--text-3)' }}>${Tile}<span>${i.label}</span>${ts === 'ask' && html`<button class="btn sm" onClick=${loadTh}><${Icon} n="eye" s=${13} />Ver a prévia pelo Drive</button>`}${ts === 'loading' && html`<small class="muted">Carregando a prévia…</small>`}${ts && ts.err && html`<small class="err" style="padding:0 12px;text-align:center">${ts.err}</small>`}</div>`;
  else if (i.k === 'image' && !bad) media = html`<img class="lp-img" src=${url} alt=${title} onError=${() => setBad(true)} />`;
  else if (i.k === 'video' && !bad) media = html`<video class="lp-img" src=${url} controls preload="metadata" playsinline onError=${() => setBad(true)}></video>`;
  else if (i.video) media = html`<div class="lp-vid">${i.thumb && !bad && html`<img src=${i.thumb} alt="" onError=${() => setBad(true)} />`}<span class="lp-play"><${Icon} n="play" s=${22} /></span><span class="lp-badge">${i.label}</span></div>`;
  else if (i.thumb && !bad) media = html`<div class="lp-doc" style=${{ '--tone': i.tone }}><img src=${i.thumb} alt="" onError=${() => setBad(true)} /><span class="lp-badge">${i.label}</span></div>`;
  else media = html`<div class="lp-doc empty" style=${{ '--tone': i.tone || 'var(--text-3)' }}>${Tile}<span>${i.label}</span></div>`;
  return html`<div class="lp">${media}<div class="lp-foot"><span class="lp-t"><b>${title}</b><small>${i.label}${i.host && i.host !== i.label ? ' · ' + i.host : ''}</small></span>
    ${ext && html`<a class="btn sm" href=${ext} target="_blank" rel="noopener"><${Icon} n="ext" s=${13} />${open}</a>`}
    ${onRemove && html`<button class="btn sm icon ghost" aria-label="Remover" onClick=${onRemove}><${Icon} n="trash" s=${14} /></button>`}</div></div>`;
}
""")
func('AddLink', r"""
function AddLink({ onAdd, onFiles, label = 'Adicionar' }) {
  const [v, setV] = useState('');
  const add = e => { e && e.preventDefault(); const u = v.trim(); if (!u) return; onAdd({ url: /^(https?:|data:|blob:)/.test(u) ? u : 'https://' + u }); setV(''); };
  return html`<form class="addlink" onSubmit=${add}><label class="sr" for=${'al-' + label}>Link</label><input class="inp" id=${'al-' + label} placeholder="Cole um link: YouTube, Google Docs, Drive, PNG, Figma…" value=${v} onInput=${e => setV(e.target.value)} />
    <button class="btn" type="submit" disabled=${!v.trim()}>${label}</button>
    <label class="btn" title="Enviar arquivo"><${Icon} n="plus" s=${14} />Arquivo<input type="file" class="sr" multiple=${!!onFiles} accept=${onFiles ? 'image/*,video/*,application/pdf,.zip,application/zip' : 'image/*,video/*,application/pdf'} onChange=${async e => { const fs = [...(e.target.files || [])]; e.target.value = ''; if (!fs.length) return; if (onFiles) { onFiles(fs); return; } onAdd({ url: await fileToUrl(fs[0]), name: fs[0].name }); }} /></label></form>`;
}
""")
func('MediaSection', r"""
function MediaSection({ k, x, readOnly, lang, title = 'Arquivos e links da peça', note = true, team }) {
  const { act, toast } = useApp(); const list = x.media || []; const T = PM[lang] || PM.pt;
  const [busy, setBusy] = useState(''); const [err, setErr] = useState('');
  if (readOnly && !list.length) return null;
  const smart = k === 'post' && !readOnly;
  const onFiles = smart ? async fs => { setErr(''); const r = await ingestFiles(act, k, x.id, fs, setBusy, T); if (r.n) toast(T.slidesAdded(r.n)); if (r.errs.length) setErr(r.errs.join(' · ')); } : null;
  const onAdd = async m => {
    if (!smart) { act.setItem(k, x.id, { media: [...list, { id: uid('m'), ...m }] }, 'Adicionado à peça'); return; }
    setErr(''); const dr = driveRef(m.url); const auto = !(x.imgs || []).length && !x.video && !!dr && dr.kind !== 'gdoc';
    const r = await ingestLink(act, k, x.id, m.url, setBusy, T, auto);
    if (r.n) toast(T.slidesAdded(r.n)); else { toast(T.linkAdded); if (auto && (r.err || r.empty || r.offline)) setErr(r.err || (r.empty ? T.empty : T.offline)); } };
  return html`<section class="sec" style="gap:10px"><div class="sec-h" style="padding:0"><h2>${title}</h2><span class="c">${list.length}</span></div>
    ${list.length > 0 && html`<div class="lp-grid">${list.map((m, i) => html`<${LinkPreview} key=${m.id || i} url=${m.url} name=${m.name} kind=${m.kind} lang=${lang} fetchThumb=${team} onRemove=${readOnly ? null : () => act.setItem(k, x.id, { media: list.filter((_, j) => j !== i) })} />`)}</div>`}
    ${!readOnly && html`<${AddLink} onAdd=${onAdd} onFiles=${onFiles} />`}
    ${busy && html`<p class="muted" style="font-size:12px">${busy}…</p>`}${err && html`<p class="err">${err}</p>`}
    ${!readOnly && note && html`<p class="muted" style="font-size:12px">${smart ? 'Imagem, PDF, ZIP e vídeo que você subir aqui entram na prévia da peça, e link de pasta ou de apresentação do Drive também. Documento do Google mostra a primeira página no cartão. YouTube, Canva, Figma e página comum aparecem como cartão, porque a página não carrega conteúdo de outro site; no produto, a prévia deles vem sozinha.' : 'No protótipo, vídeo do YouTube aparece como cartão, porque a página não pode carregar conteúdo de outro site. Arquivo e documento do Drive mostram a prévia pelo conector. No produto, a prévia vem sozinha.'}</p>`}
  </section>`;
}
""")
rep("<div class=\"mbd\"><${LinkPreview} url=${url} name=${name} /></div>", "<div class=\"mbd\"><${LinkPreview} url=${url} name=${name} fetchThumb /></div>")

# painel do cliente: aprovação e peça aberta
rep("const kind = k === 'post' ? t.carousel(x.imgs.length || 1) :", "const kind = k === 'post' ? pieceKind(lang, x) :")
rep("    ${k === 'post' && html`<div class=\"ap-media\"><${Slider} imgs=${x.imgs} title=${x.title} /></div>`}", "    ${k === 'post' && html`<${PieceMedia} k=\"post\" x=${x} lang=${lang} />`}")
rep("x.media.map((md, i) => html`<${LinkPreview} key=${i} url=${md.url} name=${md.name} lang=${lang} />`)", "x.media.map((md, i) => html`<${LinkPreview} key=${i} url=${md.url} name=${md.name} kind=${md.kind} lang=${lang} />`)", 2)
rep("      ${k === 'post' && x.imgs && x.imgs.length > 0 && html`<div class=\"ap-media\"><${Slider} imgs=${x.imgs} title=${x.title} /></div>`}",
    "      ${k === 'post' && edit && html`<${FormatPicker} x=${x} lang=${lang} onPick=${f => act.setItem(k, x.id, { format: f, fmtAuto: false })} />`}\n      ${k === 'post' && (edit || pieceCover(x) || (x.media || []).length > 0) && html`<${PieceMedia} k=\"post\" x=${x} edit=${edit} lang=${lang} />`}")
rep("<${Thumb} p=${p} pillText=${t.st[p.status]} tone=${PTONE[p.status]} />", "<${Thumb} p=${p} pillText=${t.st[p.status]} tone=${PTONE[p.status]} lang=${lang} />", 2)

# capas de vídeo nas listas
rep("kind: 'post', k: 'post', cls: p.status === 'cliente' ? 'k-cli' : p.status === 'ajuste' ? 'k-adj' : ['aprovado', 'agendado', 'publicado'].includes(p.status) ? 'k-ok' : 'k-post', img: p.imgs[0], st: p.status",
    "kind: 'post', k: 'post', cls: p.status === 'cliente' ? 'k-cli' : p.status === 'ajuste' ? 'k-adj' : ['aprovado', 'agendado', 'publicado'].includes(p.status) ? 'k-ok' : 'k-post', img: pieceCover(p), st: p.status")
rep("const img = kind === 'post' && x.imgs && x.imgs[0];", "const img = kind === 'post' && pieceCover(x);", 2)

# ---------- mapa mental: posição livre, troca de pai e espaçamento ----------
func('mindLayout', r"""
function mindLayout(els) {
  if (!els.some(e => e.t === 'mind')) return els;
  const map = {}; els.forEach(e => { if (e.t === 'mind') map[e.id] = { ...e }; });
  const kids = {}; Object.values(map).forEach(n => { if (n.parent && map[n.parent]) (kids[n.parent] = kids[n.parent] || []).push(n); });
  const sub = {};
  const size = (n, lv, col) => { Object.assign(n, mindSize(n, lv), { lv, bc: lv === 0 ? null : col }); (kids[n.id] || []).forEach((k, i) => size(k, lv + 1, lv === 0 ? (k.color || BRANCH[i % BRANCH.length]) : (k.color || col))); };
  const H = (n, gy) => { const ks = n.collapsed ? [] : kids[n.id] || []; const tot = ks.reduce((a, k) => a + H(k, gy), 0) + Math.max(0, ks.length - 1) * gy; return (sub[n.id] = Math.max(n.h, tot)); };
  const place = (n, x, cy, gx, gy, root) => { n.x = Math.round(x + (root ? 0 : n.ox || 0)); n.y = Math.round(cy - n.h / 2 + (root ? 0 : n.oy || 0)); const ks = n.collapsed ? [] : kids[n.id] || []; const tot = ks.reduce((a, k) => a + sub[k.id], 0) + Math.max(0, ks.length - 1) * gy; let y = n.y + n.h / 2 - tot / 2; ks.forEach(k => { place(k, n.x + n.w + gx, y + sub[k.id] / 2, gx, gy, false); y += sub[k.id] + gy; }); };
  const hide = (n, h) => { n.hid = h; (kids[n.id] || []).forEach(k => hide(k, h || !!n.collapsed)); };
  Object.values(map).filter(n => !n.parent || !map[n.parent]).forEach(r => { const gx = r.gx ?? MIND.hgap, gy = r.gy ?? MIND.vgap; const cy = r.y + (r.h || 40) / 2; size(r, 0, null); H(r, gy); place(r, r.x, cy, gx, gy, true); hide(r, false); });
  return els.map(e => (e.t === 'mind' ? map[e.id] : e));
}
""")
rep("const newMind = (parent, text = '') =>", "const mindPath = (p, n) => { const right = n.x + n.w / 2 >= p.x + p.w / 2; const x1 = right ? p.x + p.w : p.x, y1 = p.y + p.h / 2, x2 = right ? n.x : n.x + n.w, y2 = n.y + n.h / 2; const k = (right ? 1 : -1) * Math.max(18, Math.min(64, Math.abs(x2 - x1) / 2)); return `M${x1} ${y1}C${x1 + k} ${y1} ${x2 - k} ${y2} ${x2} ${y2}`; };\nconst newMind = (parent, text = '') =>")
rep("""    ${vis.filter(e => e.t === 'mind' && e.parent && map[e.parent]).map(e => { const p = map[e.parent]; const x1 = p.x + p.w, y1 = p.y + p.h / 2, x2 = e.x, y2 = e.y + e.h / 2; return html`<path key=${'b' + e.id} d=${`M${x1} ${y1}C${x1 + 28} ${y1} ${x2 - 28} ${y2} ${x2} ${y2}`} fill="none" stroke=${e.bc || '#6A655D'} stroke-width="4" />`; })}""",
"""    ${vis.filter(e => e.t === 'mind' && e.parent && map[e.parent]).map(e => html`<path key=${'b' + e.id} d=${mindPath(map[e.parent], e)} fill="none" stroke=${e.bc || '#6A655D'} stroke-width="4" />`)}""")
rep("desc: 'Tema no centro e ramos coloridos. Tab cria um ramo filho, Enter cria um irmão.'",
    "desc: 'Tema no centro e ramos coloridos. Tab cria filho, Enter cria irmão, e cada tópico pode ser arrastado para onde você quiser.'")
rep("  const [box, setBox] = useState({ w: 1000, h: 600 });\n", "  const [box, setBox] = useState({ w: 1000, h: 600 });\n  const [mindDrop, setMindDrop] = useState(null); const mdRef = useRef(null); const spaceBefore = useRef(null);\n")
rep("      if (e.t === 'mind') { let r = e; for (let g = 0; r.parent && map[r.parent] && g < 99; g++) r = map[r.parent]; mindTree(L, r.id).forEach(x => out.add(x)); }",
    "      if (e.t === 'mind') mindTree(L, e.id).forEach(x => out.add(x));")
rep("""        elsRef.current.forEach(x => { if (ids.has(x.id)) o[x.id] = x.t === 'pen' ? { pts: x.pts } : x.t === 'arrow' ? { x1: x.x1, y1: x.y1, x2: x.x2, y2: x.y2 } : { x: x.x, y: x.y }; });
        drag.current = { m: 'move', p0: p, o, before: elsRef.current, moved: false }; return; }""",
"""        elsRef.current.forEach(x => { if (ids.has(x.id)) o[x.id] = x.t === 'pen' ? { pts: x.pts } : x.t === 'arrow' ? { x1: x.x1, y1: x.y1, x2: x.x2, y2: x.y2 } : { x: x.x, y: x.y, ox: x.ox || 0, oy: x.oy || 0 }; });
        const one0 = ns.length === 1 ? map[ns[0]] : null; const mm = one0 && one0.t === 'mind' && one0.parent && map[one0.parent] && !one0.locked ? one0.id : null;
        drag.current = { m: 'move', p0: p, o, ids, sel: ns, mind: mm, before: elsRef.current, moved: false }; return; }""")
rep("if (!d.moved && Math.abs(dx) + Math.abs(dy) < 2) return; if (!d.moved) setBusy(true); d.moved = true;",
    "if (!d.moved && Math.abs(dx) + Math.abs(dy) < 3 / vpRef.current.k) return; if (!d.moved) setBusy(true); d.moved = true;")
rep("""      if (!any) return; d.any = true; setEls(nx); elsRef.current = nx; return; }""",
"""      if (!any) return; d.any = true; setEls(nx); elsRef.current = nx;
      if (d.mind) { const tg = e.altKey ? null : hitMind(p, d.ids); const tid = tg ? tg.id : null; if (tid !== mdRef.current) { mdRef.current = tid; setMindDrop(tid); } }
      return; }""")
rep("""    if ((d.m === 'move' && d.any) || (d.m === 'resize' && d.moved)) { save(elsRef.current, d.before); return; }""",
"""    if (d.m === 'move' && d.any) { const tid = mdRef.current; mdRef.current = null; setMindDrop(null); const dx = p[0] - d.p0[0], dy = p[1] - d.p0[1]; const L = elsRef.current;
      if (d.mind && tid && !e.altKey) { const tg = L.find(x => x.id === tid); const n0 = L.find(x => x.id === d.mind); const nr = tg.root || tg.id; const subt = new Set(mindTree(L, d.mind)); const same = n0.parent === tid;
        save(L.map(x => (x.id === d.mind ? { ...x, parent: tid, root: nr, ox: 0, oy: 0 } : subt.has(x.id) ? { ...x, root: nr } : x.id === tid && x.collapsed ? { ...x, collapsed: false } : x)), d.before); setSel([d.mind]);
        toast(same ? 'Tópico de volta à posição automática' : `Agora é tópico filho de "${short(tg.text)}"`); return; }
      const B0 = d.before; const top = new Set(d.sel.filter(id => { const n = B0.find(x => x.id === id); if (!n || n.t !== 'mind' || n.locked || !n.parent || !B0.some(x => x.id === n.parent)) return false; for (let q = n, g = 0; q && q.parent && g < 99; g++) { if (d.sel.includes(q.parent)) return false; q = B0.find(x => x.id === q.parent); } return true; }));
      save(top.size ? L.map(x => (top.has(x.id) ? { ...x, ox: Math.round((d.o[x.id] ? d.o[x.id].ox : 0) + dx), oy: Math.round((d.o[x.id] ? d.o[x.id].oy : 0) + dy) } : x)) : L, d.before); return; }
    if (d.m === 'resize' && d.moved) { save(elsRef.current, d.before); return; }""")
rep("""    if (to) setSel([to]); };
""", """    if (to) setSel([to]); };
  const hitMind = (p, skip) => { const L = elsRef.current; for (let i = L.length - 1; i >= 0; i--) { const n = L[i]; if (n.t !== 'mind' || n.hid || skip.has(n.id)) continue; if (p[0] >= n.x && p[0] <= n.x + n.w && p[1] >= n.y && p[1] <= n.y + n.h) return n; } return null; };
  const rootOf = n => { let r = n; for (let g = 0; r.parent && map[r.parent] && g < 99; g++) r = map[r.parent]; return r; };
  const mindReorder = (id, dir) => { const L = elsRef.current; const n = L.find(x => x.id === id); if (!n || !n.parent) return; const sib = mindKids(L, n.parent); const i = sib.findIndex(x => x.id === id); const j = i + dir; if (j < 0 || j >= sib.length) return; const a = L.indexOf(sib[i]), b = L.indexOf(sib[j]); const next = [...L]; [next[a], next[b]] = [next[b], next[a]]; save(next, L); };
  const removeKeep = () => { const L = elsRef.current; const M = Object.fromEntries(L.map(x => [x.id, x])); const S2 = sel.map(id => M[id]).filter(x => x && x.t === 'mind' && x.parent && !x.locked); if (!S2.length) { remove(); return; } const ids = new Set(S2.map(x => x.id)); const up2 = pid => { let q = pid; for (let g = 0; q && ids.has(q) && g < 99; g++) q = M[q] ? M[q].parent : null; return q; };
    save(L.filter(x => !ids.has(x.id) && !(x.t === 'arrow' && (ids.has(x.from) || ids.has(x.to)))).map(x => (x.t === 'mind' && ids.has(x.parent) ? { ...x, parent: up2(x.parent), ox: 0, oy: 0 } : x)), L); setSel([]); };
  const spaceSet = (rid, patch, fin) => { const L = elsRef.current; if (!spaceBefore.current) spaceBefore.current = L; const nx = mindLayout(L.map(x => (x.id === rid ? { ...x, ...patch } : x))); if (fin) { const b0 = spaceBefore.current; spaceBefore.current = null; save(nx, b0); } else { setEls(nx); elsRef.current = nx; } };
""")
rep("""  H.current.kd = e => {
""", """  H.current.kd = e => {
    if (e.key === 'Escape' && drag.current && drag.current.m === 'move' && drag.current.any) { const d = drag.current; drag.current = null; mdRef.current = null; setMindDrop(null); setBusy(false); setEls(d.before); elsRef.current = d.before; return; }
""")
rep("""    if (mod || e.altKey) return;
""", """    if (one && one.t === 'mind' && !one.locked && e.key.startsWith('Arrow')) {
      if (e.altKey && !mod) { e.preventDefault(); const st = e.shiftKey ? 2 : 12; const ddx = e.key === 'ArrowLeft' ? -st : e.key === 'ArrowRight' ? st : 0, ddy = e.key === 'ArrowUp' ? -st : e.key === 'ArrowDown' ? st : 0; const L = elsRef.current;
        save(L.map(x => (x.id !== one.id ? x : one.parent ? { ...x, ox: (x.ox || 0) + ddx, oy: (x.oy || 0) + ddy } : { ...x, x: x.x + ddx, y: x.y + ddy })), L); return; }
      if (mod && e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); mindReorder(one.id, e.key === 'ArrowUp' ? -1 : 1); return; }
    }
    if (e.key === 'F2' && one && textual(one) && !one.locked) { e.preventDefault(); setEditing(one.id); return; }
    if (mod || e.altKey) return;
""")
rep("if ((e.key === 'Delete' || e.key === 'Backspace') && S.length) { e.preventDefault(); remove(); return; }",
    "if ((e.key === 'Delete' || e.key === 'Backspace') && S.length) { e.preventDefault(); if (e.shiftKey) removeKeep(); else remove(); return; }")
rep("""        ${minds.filter(n => n.parent && map[n.parent]).map(n => { const p = map[n.parent]; const x1 = p.x + p.w, y1 = p.y + p.h / 2, x2 = n.x, y2 = n.y + n.h / 2; return html`<path key=${'br' + n.id} d=${`M${x1} ${y1}C${x1 + 28} ${y1} ${x2 - 28} ${y2} ${x2} ${y2}`} fill="none" stroke=${n.bc} stroke-width=${n.lv === 1 ? 3 : 2} stroke-linecap="round" />`; })}""",
"""        ${minds.filter(n => n.parent && map[n.parent]).map(n => html`<path key=${'br' + n.id} d=${mindPath(map[n.parent], n)} fill="none" stroke=${n.bc} stroke-width=${n.lv === 1 ? 3 : 2} stroke-linecap="round" />`)}""")
rep("""        ${selBox && html`<rect x=${selBox.x - px(6)}""", """        ${mindDrop && map[mindDrop] && (() => { const tg = map[mindDrop]; return html`<g pointer-events="none"><rect x=${tg.x - px(6)} y=${tg.y - px(6)} width=${tg.w + px(12)} height=${tg.h + px(12)} rx=${px(12)} class="wb-mdrop" stroke-width=${px(2.5)} /><text x=${tg.x} y=${tg.y - px(14)} font-size=${px(12.5)} class="wb-mdrop-t">Solte para virar tópico filho · ⌥ só move</text></g>`; })()}
        ${selBox && html`<rect x=${selBox.x - px(6)}""")
rep("""({ prio: one.prio === n ? null : n }))}>${n}</button>`)}</span>`}
""", """({ prio: one.prio === n ? null : n }))}>${n}</button>`)}</span>`}
      ${one && one.t === 'mind' && (() => { const r = rootOf(one); const gx = r.gx ?? MIND.hgap, gy = r.gy ?? MIND.vgap; const offs = mindTree(els, r.id).some(id => { const n = map[id]; return n && n.parent && (n.ox || n.oy); });
        return html`<span class="grp"><label class="rng" title="Distância entre um nível e o próximo, no mapa inteiro"><${Icon} n="dsH" s=${14} /><input type="range" min="16" max="240" step="4" value=${gx} aria-label="Distância entre níveis" onInput=${ev => spaceSet(r.id, { gx: +ev.target.value }, false)} onChange=${ev => spaceSet(r.id, { gx: +ev.target.value }, true)} /></label><label class="rng" title="Distância entre tópicos irmãos, no mapa inteiro"><${Icon} n="dsV" s=${14} /><input type="range" min="0" max="120" step="2" value=${gy} aria-label="Distância entre tópicos" onInput=${ev => spaceSet(r.id, { gy: +ev.target.value }, false)} onChange=${ev => spaceSet(r.id, { gy: +ev.target.value }, true)} /></label>
          ${one.parent && (one.ox || one.oy) ? B('refresh', 'Voltar à posição automática', () => patchSel(() => ({ ox: 0, oy: 0 }))) : null}
          ${!one.parent && offs ? B('refresh', 'Reorganizar o mapa (tira as posições feitas à mão)', () => { const ids = new Set(mindTree(els, one.id)); const L = elsRef.current; save(L.map(x => (ids.has(x.id) ? { ...x, ox: 0, oy: 0 } : x)), L); }) : null}</span>`; })()}
""")
rep("['L entre tópicos', 'Relação tracejada no mapa mental'], ['Setas', 'Andar pelo mapa mental ou mover'], ",
    "['L entre tópicos', 'Relação tracejada no mapa mental'], ['Setas', 'Andar pelo mapa mental ou mover'], ['Arrastar tópico', 'Solto no vazio, fica ali. Solto em cima de outro, vira filho dele'], ['⌥ + arrastar', 'Só move o tópico, sem trocar de pai'], ['⌥ + setas', 'Move o tópico selecionado'], ['⌘⇧↑ / ↓', 'Muda a ordem entre os irmãos'], ['F2', 'Edita o texto'], ['⇧Delete', 'Apaga só o tópico; os filhos sobem um nível'], ")

open('src.html', 'w', encoding='utf-8').write(S)
print('ok', len(S))
