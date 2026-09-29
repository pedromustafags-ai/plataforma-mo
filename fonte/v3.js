/* ================= v3: cor e contraste ================= */
const hex2rgb = h => { h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const rgb2hex = (r, g, b) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase();
const rgb2hsl = (r, g, b) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2; if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return [h, s * 100, l * 100]; };
const hsl2hex = (h, s, l) => { s /= 100; l /= 100; const k = n => (n + h / 30) % 12; const a = s * Math.min(l, 1 - l); const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return rgb2hex(f(0) * 255, f(8) * 255, f(4) * 255); };
const relLum = hex => { const [r, g, b] = hex2rgb(hex).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * r + .7152 * g + .0722 * b; };
const contrast = (a, b) => { const x = relLum(a), y = relLum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const nudge = (fg, bg, min, dir) => { let [h, s, l] = rgb2hsl(...hex2rgb(fg)); let c = rgb2hex(...hex2rgb(fg)); for (let i = 0; i < 45 && contrast(c, bg) < min; i++) { l = Math.max(0, Math.min(100, l + dir * 2.2)); c = hsl2hex(h, s, l); } return c; };
const isHex = v => /^#?[0-9a-f]{6}$/i.test(String(v || ''));

/* ================= v3: temas ================= */
const STATUS_L = { '--st-neu': '#51565D', '--st-neu-bg': '#E6E3DF', '--st-prog': '#58488A', '--st-prog-bg': '#E7E2F1', '--st-cli': '#2D5A83', '--st-cli-bg': '#DFE8F1', '--st-adj': '#7E5410', '--st-adj-bg': '#F4E6CC', '--st-ok': '#2E6844', '--st-ok-bg': '#DCEBE0', '--st-late': '#9A3B2E', '--st-late-bg': '#F5E1DC' };
const STATUS_D = { '--st-neu': '#CBC6BE', '--st-neu-bg': '#3A3F47', '--st-prog': '#C8BBEE', '--st-prog-bg': '#382F4E', '--st-cli': '#A3C4E6', '--st-cli-bg': '#29394B', '--st-adj': '#EAC47F', '--st-adj-bg': '#463A25', '--st-ok': '#A3D4B3', '--st-ok-bg': '#27402F', '--st-late': '#F2AE9F', '--st-late-bg': '#4A2F2C' };
const SD = (bg, text, strong, hover, active, line, lineStrong, label, badgeBg, badgeFg, logo) => ({ bg, text, strong, hover, active, line, lineStrong, label, badgeBg, badgeFg, logo });
const THEMES = {
  areia: { name: 'Areia', mode: 'light', mo: true, bg: '#F2F0EF', surface: '#FBFAF8', surface2: '#E9E6E2', line: '#E2DBD0', lineStrong: '#D3C5AE', text: '#222831', text2: '#454A52', text3: '#6A655D', primary: '#222831', onPrimary: '#F4EBDD', accent: '#948979',
    side: SD('#222831', '#C9C2B6', '#F2F0EF', '#2B313A', '#393E46', '#2B313A', '#48505A', '#A8A195', '#DFD0B8', '#222831', ['#DFD0B8', '#222831', '#F2F0EF']) },
  papel: { name: 'Papel', mode: 'light', bg: '#F7F7F5', surface: '#FFFFFF', surface2: '#EEEEEB', line: '#E6E6E2', lineStrong: '#D2D2CC', text: '#1C1C1A', text2: '#45453F', text3: '#68685F', primary: '#1C1C1A', onPrimary: '#FFFFFF', accent: '#9A9A92',
    side: SD('#F0F0ED', '#45453F', '#1C1C1A', '#E6E6E2', '#DEDED9', '#E4E4E0', '#CFCFC9', '#68685F', '#1C1C1A', '#FFFFFF', ['#1C1C1A', '#F0F0ED', '#1C1C1A']) },
  nevoa: { name: 'Névoa', mode: 'light', bg: '#F1F4F8', surface: '#FFFFFF', surface2: '#E6EBF2', line: '#DCE3EC', lineStrong: '#C5D0DE', text: '#15202C', text2: '#3B4757', text3: '#5A6778', primary: '#2956B8', onPrimary: '#FFFFFF', accent: '#7F95B5',
    side: SD('#E8EDF4', '#3B4757', '#15202C', '#DCE3EC', '#D2DBE7', '#DCE3EC', '#C5D0DE', '#5A6778', '#2956B8', '#FFFFFF', ['#15202C', '#E8EDF4', '#15202C']) },
  salvia: { name: 'Sálvia', mode: 'light', bg: '#F2F5F1', surface: '#FCFDFB', surface2: '#E5EBE3', line: '#DAE2D7', lineStrong: '#C3CFBF', text: '#19281E', text2: '#3D4E42', text3: '#5A6B5E', primary: '#2E6A48', onPrimary: '#FFFFFF', accent: '#8BA38F',
    side: SD('#E7EDE5', '#3D4E42', '#19281E', '#DAE2D7', '#CFD9CB', '#DAE2D7', '#C3CFBF', '#5A6B5E', '#2E6A48', '#FFFFFF', ['#19281E', '#E7EDE5', '#19281E']) },
  grafite: { name: 'Grafite', mode: 'dark', mo: true, bg: '#222831', surface: '#2A3039', surface2: '#343A43', line: '#363C45', lineStrong: '#48505A', text: '#F2F0EF', text2: '#DFD0B8', text3: '#ABA497', primary: '#DFD0B8', onPrimary: '#222831', accent: '#948979',
    side: SD('#1B2027', '#C9C2B6', '#F2F0EF', '#252B33', '#2F353E', '#262C34', '#3A414B', '#A8A195', '#DFD0B8', '#222831', ['#DFD0B8', '#222831', '#F2F0EF']) },
  carvao: { name: 'Carvão', mode: 'dark', bg: '#151515', surface: '#1D1D1D', surface2: '#272727', line: '#2C2C2C', lineStrong: '#3D3D3D', text: '#EDEDED', text2: '#CFCFCF', text3: '#9C9C9C', primary: '#EDEDED', onPrimary: '#151515', accent: '#7A7A7A',
    side: SD('#101010', '#BDBDBD', '#F5F5F5', '#1C1C1C', '#262626', '#1E1E1E', '#333333', '#8E8E8E', '#EDEDED', '#151515', ['#EDEDED', '#151515', '#EDEDED']) },
  meianoite: { name: 'Meia-noite', mode: 'dark', bg: '#0D1526', surface: '#141E35', surface2: '#1C2946', line: '#22304F', lineStrong: '#334268', text: '#E8EDF7', text2: '#C0CAE0', text3: '#909CB6', primary: '#86A8FF', onPrimary: '#0D1526', accent: '#5B6F99',
    side: SD('#0A1120', '#B4BFD6', '#EEF2FA', '#121B30', '#1A2541', '#141D33', '#26324F', '#7F8BA6', '#86A8FF', '#0D1526', ['#86A8FF', '#0D1526', '#EEF2FA']) },
  floresta: { name: 'Floresta', mode: 'dark', bg: '#0E1914', surface: '#15231C', surface2: '#1D3027', line: '#22382D', lineStrong: '#314D40', text: '#E5EFE9', text2: '#BED2C5', text3: '#8EA798', primary: '#86D2A6', onPrimary: '#0E1914', accent: '#5E7F6C',
    side: SD('#0A140F', '#B1C7B9', '#EDF5F0', '#122019', '#1A2C23', '#132019', '#253A30', '#7E998A', '#86D2A6', '#0E1914', ['#86D2A6', '#0E1914', '#EDF5F0']) },
};
const LIGHTS = ['areia', 'papel', 'nevoa', 'salvia'], DARKS = ['grafite', 'carvao', 'meianoite', 'floresta'];
function brandTheme(primary, mode) {
  const [h, s0] = rgb2hsl(...hex2rgb(primary)); const s = Math.min(s0, 60);
  if (mode === 'light') {
    const bg = hsl2hex(h, s * .3, 97), surface = hsl2hex(h, s * .2, 99.4), surface2 = hsl2hex(h, s * .32, 93);
    const text = hsl2hex(h, Math.min(s, 30) * .6, 13); const text2 = nudge(hsl2hex(h, Math.min(s, 25) * .5, 31), surface2, 7, -1); const text3 = nudge(hsl2hex(h, Math.min(s, 20) * .5, 43), surface2, 4.6, -1);
    let p = nudge(primary, surface, 3.2, -1); let onP = contrast('#FFFFFF', p) >= contrast('#111111', p) ? '#FFFFFF' : '#111111'; if (contrast(onP, p) < 4.5) p = nudge(p, onP, 4.6, onP === '#FFFFFF' ? -1 : 1);
    return { name: 'Da marca', mode, brand: true, bg, surface, surface2, line: hsl2hex(h, s * .28, 88), lineStrong: hsl2hex(h, s * .3, 79), text, text2, text3, primary: p, onPrimary: onP, accent: p };
  }
  const bg = hsl2hex(h, s * .35, 8.5), surface = hsl2hex(h, s * .32, 12), surface2 = hsl2hex(h, s * .3, 16.5);
  const text = hsl2hex(h, Math.min(s, 20), 94), text2 = nudge(hsl2hex(h, Math.min(s, 20), 79), surface2, 7, 1), text3 = nudge(hsl2hex(h, Math.min(s, 16), 63), surface2, 4.6, 1);
  let p = nudge(primary, surface, 4.5, 1); const onP = contrast(bg, p) >= 4.5 ? bg : '#0B0B0B';
  return { name: 'Da marca', mode, brand: true, bg, surface, surface2, line: hsl2hex(h, s * .28, 19), lineStrong: hsl2hex(h, s * .25, 27), text, text2, text3, primary: p, onPrimary: onP, accent: p };
}
function themeVars(th) {
  const dark = th.mode === 'dark';
  const sd = th.side || SD(th.surface2, th.text2, th.text, th.surface, th.line, th.line, th.lineStrong, th.text3, th.primary, th.onPrimary, dark ? ['#DFD0B8', '#222831', '#F2F0EF'] : ['#222831', '#DFD0B8', '#222831']);
  return { '--bg': th.bg, '--surface': th.surface, '--surface-2': th.surface2, '--hover': dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.045)', '--line': th.line, '--line-strong': th.lineStrong,
    '--text': th.text, '--text-2': th.text2, '--text-3': th.text3, '--primary': th.primary, '--on-primary': th.onPrimary, '--focus': th.primary, '--taupe': th.accent || th.text3,
    '--side-bg': sd.bg, '--side-text': sd.text, '--side-strong': sd.strong, '--side-hover': sd.hover, '--side-active': sd.active, '--side-line': sd.line, '--side-line-strong': sd.lineStrong, '--side-label': sd.label,
    '--side-badge-bg': sd.badgeBg, '--side-badge-fg': sd.badgeFg, '--side-logo-c': sd.logo[0], '--side-logo-m': sd.logo[1], '--side-logo-w': sd.logo[2],
    '--logo-c': dark ? '#DFD0B8' : '#222831', '--logo-m': dark ? '#222831' : '#DFD0B8', '--logo-w': dark ? '#F2F0EF' : '#222831',
    '--toast-bg': th.text, '--toast-fg': th.bg, '--toast-act': th.surface2, '--scrim': dark ? 'rgba(0,0,0,.55)' : 'rgba(20,22,26,.38)', '--media-bg': dark ? '#0B0D10' : '#1B2027',
    '--shadow': dark ? '0 1px 2px rgba(0,0,0,.3),0 16px 40px rgba(0,0,0,.45)' : '0 1px 2px rgba(0,0,0,.06),0 12px 32px rgba(0,0,0,.10)', '--shadow-sm': dark ? '0 1px 2px rgba(0,0,0,.3)' : '0 1px 2px rgba(0,0,0,.07)',
    ...(dark ? STATUS_D : STATUS_L) };
}
function clientTheme(c, sysDark) {
  const b = c.brand || {}; const t = b.theme || { mode: 'light', light: 'areia', dark: 'grafite' };
  const mode = t.mode === 'auto' ? (sysDark ? 'dark' : 'light') : t.mode;
  const pick = mode === 'dark' ? t.dark : t.light;
  if (pick === 'brand' && isHex(b.primary)) return brandTheme(b.primary, mode);
  return THEMES[pick] || THEMES[mode === 'dark' ? 'grafite' : 'areia'];
}
const SANS = "'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
function portalStyle(c, th) {
  const v = themeVars(th); const f = c.brand && c.brand.font;
  if (f) { loadFont(f); v['--sans'] = `'${f}', ${SANS}`; }
  return { ...v, colorScheme: th.mode, fontFamily: 'var(--sans)' };
}
const fontsLoaded = new Set();
function loadFont(name) { if (!name || fontsLoaded.has(name)) return; fontsLoaded.add(name); const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(/%20/g, '+')}:wght@400;500;600;700&display=swap`; document.head.appendChild(l); }
const useSysDark = () => { const [d, setD] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches); useEffect(() => { const m = matchMedia('(prefers-color-scheme: dark)'); const h = e => setD(e.matches); m.addEventListener('change', h); return () => m.removeEventListener('change', h); }, []); return d; };

/* ================= v3: idiomas ================= */
const LANGS = [['pt', 'Português'], ['en', 'English'], ['es', 'Español'], ['fr', 'Français']];
const LANG_PT = { pt: 'português', en: 'inglês', es: 'espanhol', fr: 'francês' };
Object.assign(TX.pt, { personalize: 'Personalizar', powered: 'Powered by', language: 'Idioma' });
Object.assign(TX.en, { personalize: 'Customize', powered: 'Powered by', language: 'Language' });
TX.es = { ...TX.en,
  forYou: 'Para ti', cal: 'Calendario', content: 'Contenido', proc: 'Procesos', links: 'Enlaces',
  hello: 'Hola', waiting: n => n === 1 ? 'Una pieza espera tu aprobación. Toma menos de un minuto.' : `${n} piezas esperan tu aprobación. Cada una toma menos de un minuto.`,
  clear: 'Todo al día', clearSub: 'Nada te espera ahora. Te avisamos por WhatsApp cuando llegue algo nuevo.',
  approve: 'Aprobar', change: 'Pedir cambios', whatChange: '¿Qué quieres cambiar?', whichSlide: '¿En qué diapositiva?', general: 'General',
  sendChange: 'Enviar cambios', cancel: 'Cancelar', approvedT: 'Aprobado', approvedS: 'M&O lo agenda para publicar.', changeT: 'Cambios enviados', changeS: 'Te avisamos cuando llegue la nueva versión.', undo: 'Deshacer',
  sentBy: (n, a) => `Enviado por ${n}, ${a}`, goes: d => `Se publica el ${d}`, record: d => `Grabación el ${d}`,
  upnext: 'Próximamente', inprod: n => `${n} ${n === 1 ? 'pieza' : 'piezas'} en producción`,
  readAll: 'Leer el guion completo', collapse: 'Ocultar', carousel: n => `Carrusel · ${n} diapositivas`, script: 'Guion', delivery: 'Entrega',
  phChange: 'Ej.: en la diapositiva 3, cambia "pipeline" por algo más simple.',
  st: { cliente: 'Te espera', ajuste: 'Pediste cambios', aprovado: 'Aprobado', agendado: 'Agendado', publicado: 'Publicado', gravado: 'Grabado', editado: 'En edición', noar: 'Publicado', client: 'Te espera', done: 'Aprobado', doing: 'Pediste cambios' },
  all: 'Todo', waitingF: 'Te espera', approvedF: 'Aprobados', liveF: 'Publicados',
  signout: 'Salir', switchAcc: 'Cambiar de cuenta (prototipo)', theme: 'Cambiar tema', meeting: 'Reunión',
  sharedLinks: 'Enlaces del proyecto', open: 'Abrir', copy: 'Copiar enlace', copied: 'Enlace copiado',
  updated: (n, a) => `Actualizado por ${n}, ${a}`, noLinks: 'Todavía no hay enlaces.', today: 'Hoy', nothingCal: 'Nada agendado en los próximos días.', from: 'de M&O', entregaOpen: 'Léelo y responde aquí mismo.',
  personalize: 'Personalizar', powered: 'Powered by', language: 'Idioma' };
TX.fr = { ...TX.en,
  forYou: 'Pour vous', cal: 'Calendrier', content: 'Contenu', proc: 'Processus', links: 'Liens',
  hello: 'Bonjour', waiting: n => n === 1 ? 'Un contenu attend votre validation. Cela prend moins d’une minute.' : `${n} contenus attendent votre validation. Moins d’une minute chacun.`,
  clear: 'Tout est à jour', clearSub: 'Rien ne vous attend pour le moment. Nous vous prévenons sur WhatsApp dès qu’il y a du nouveau.',
  approve: 'Valider', change: 'Demander une modification', whatChange: 'Que souhaitez-vous modifier ?', whichSlide: 'Quelle diapositive ?', general: 'Général',
  sendChange: 'Envoyer', cancel: 'Annuler', approvedT: 'Validé', approvedS: 'M&O le planifie pour publication.', changeT: 'Demande envoyée', changeS: 'Nous vous prévenons dès que la nouvelle version est prête.', undo: 'Annuler',
  sentBy: (n, a) => `Envoyé par ${n}, ${a}`, goes: d => `Publication le ${d}`, record: d => `Tournage le ${d}`,
  upnext: 'À venir', inprod: n => `${n} ${n === 1 ? 'contenu' : 'contenus'} en production`,
  readAll: 'Lire le script complet', collapse: 'Réduire', carousel: n => `Carrousel · ${n} diapositives`, script: 'Script', delivery: 'Livrable',
  phChange: 'Ex. : diapositive 3, remplacer « pipeline » par un mot plus simple.',
  st: { cliente: 'Vous attend', ajuste: 'Modification demandée', aprovado: 'Validé', agendado: 'Planifié', publicado: 'Publié', gravado: 'Tourné', editado: 'En montage', noar: 'Publié', client: 'Vous attend', done: 'Validé', doing: 'Modification demandée' },
  all: 'Tout', waitingF: 'Vous attend', approvedF: 'Validés', liveF: 'Publiés',
  signout: 'Se déconnecter', switchAcc: 'Changer de compte (prototype)', theme: 'Changer de thème', meeting: 'Réunion',
  sharedLinks: 'Liens du projet', open: 'Ouvrir', copy: 'Copier le lien', copied: 'Lien copié',
  updated: (n, a) => `Mis à jour par ${n}, ${a}`, noLinks: 'Aucun lien pour le moment.', today: 'Aujourd’hui', nothingCal: 'Rien de prévu dans les prochains jours.', from: 'de M&O', entregaOpen: 'Lisez-le et répondez ici.',
  personalize: 'Personnaliser', powered: 'Powered by', language: 'Langue' };
const BT = {
  pt: { contrastT: 'Contraste', textT: 'texto', buttonT: 'botão', adjusted: 'Ajustamos o tom da cor principal para o texto ficar legível.', darkLogo: 'Seu logo é escuro. Envie a versão clara para o modo escuro.', title: 'Sua marca', sub: 'Logo, cores e tema do painel. As mudanças aparecem na hora.', logo: 'Logo', logoLight: 'Para fundo claro', logoDark: 'Para fundo escuro (opcional)', upload: 'Enviar', remove: 'Remover',
    idv: 'Identidade visual', idvSub: 'Envie o manual da marca em PDF, ou imagens e o logo. O sistema lê as cores e as fontes sozinho.', drop: 'Arraste os arquivos aqui ou clique para escolher', reading: 'Lendo', found: 'O que encontramos', colors: 'Cores', fonts: 'Fontes', apply: 'Montar o tema com estas cores',
    primary: 'Cor principal', add: 'Adicionar cor', noColors: 'Nenhuma cor ainda. Envie o logo ou o manual.', theme: 'Tema do painel', mode: 'Modo', light: 'Claro', dark: 'Escuro', auto: 'Automático', lightS: 'Estilo claro', darkS: 'Estilo escuro', brandT: 'Da marca',
    preview: 'Prévia', lang: 'Idioma do painel', font: 'Fonte', fontNone: 'Padrão do sistema', inText: 'no texto do manual', inImg: 'nas imagens', applied: 'Tema montado com as cores da marca', powered: 'O rodapé do painel mostra "Powered by M&O".', fail: 'Não deu para ler', pMock: 'Carrossel de lançamento', none: 'Nada encontrado nestes arquivos.' },
  en: { contrastT: 'Contrast', textT: 'text', buttonT: 'button', adjusted: 'We adjusted the main color’s shade so text stays readable.', darkLogo: 'Your logo is dark. Upload a light version for dark mode.', title: 'Your brand', sub: 'Logo, colors and theme of your workspace. Changes show up instantly.', logo: 'Logo', logoLight: 'For light backgrounds', logoDark: 'For dark backgrounds (optional)', upload: 'Upload', remove: 'Remove',
    idv: 'Brand identity', idvSub: 'Upload your brand guidelines as a PDF, or images and your logo. We read the colors and fonts for you.', drop: 'Drop files here or click to choose', reading: 'Reading', found: 'What we found', colors: 'Colors', fonts: 'Fonts', apply: 'Build the theme from these colors',
    primary: 'Main color', add: 'Add color', noColors: 'No colors yet. Upload your logo or guidelines.', theme: 'Workspace theme', mode: 'Mode', light: 'Light', dark: 'Dark', auto: 'Automatic', lightS: 'Light style', darkS: 'Dark style', brandT: 'Your brand',
    preview: 'Preview', lang: 'Workspace language', font: 'Font', fontNone: 'System default', inText: 'in the guidelines text', inImg: 'in the images', applied: 'Theme built from your brand colors', powered: 'The footer shows "Powered by M&O".', fail: 'Could not read', pMock: 'Launch carousel', none: 'Nothing found in these files.' },
  es: { contrastT: 'Contraste', textT: 'texto', buttonT: 'botón', adjusted: 'Ajustamos el tono del color principal para que el texto se lea bien.', darkLogo: 'Tu logo es oscuro. Sube la versión clara para el modo oscuro.', title: 'Tu marca', sub: 'Logo, colores y tema de tu panel. Los cambios aparecen al instante.', logo: 'Logo', logoLight: 'Para fondo claro', logoDark: 'Para fondo oscuro (opcional)', upload: 'Subir', remove: 'Quitar',
    idv: 'Identidad visual', idvSub: 'Sube tu manual de marca en PDF, o imágenes y el logo. Leemos los colores y las fuentes por ti.', drop: 'Arrastra los archivos aquí o haz clic para elegir', reading: 'Leyendo', found: 'Lo que encontramos', colors: 'Colores', fonts: 'Fuentes', apply: 'Armar el tema con estos colores',
    primary: 'Color principal', add: 'Añadir color', noColors: 'Todavía no hay colores. Sube tu logo o tu manual.', theme: 'Tema del panel', mode: 'Modo', light: 'Claro', dark: 'Oscuro', auto: 'Automático', lightS: 'Estilo claro', darkS: 'Estilo oscuro', brandT: 'De tu marca',
    preview: 'Vista previa', lang: 'Idioma del panel', font: 'Fuente', fontNone: 'Predeterminada', inText: 'en el texto del manual', inImg: 'en las imágenes', applied: 'Tema armado con los colores de tu marca', powered: 'El pie del panel muestra "Powered by M&O".', fail: 'No se pudo leer', pMock: 'Carrusel de lanzamiento', none: 'No encontramos nada en estos archivos.' },
  fr: { contrastT: 'Contraste', textT: 'texte', buttonT: 'bouton', adjusted: 'Nous avons ajusté la nuance de la couleur principale pour que le texte reste lisible.', darkLogo: 'Votre logo est sombre. Importez la version claire pour le mode sombre.', title: 'Votre marque', sub: 'Logo, couleurs et thème de votre espace. Les changements s’affichent tout de suite.', logo: 'Logo', logoLight: 'Pour fond clair', logoDark: 'Pour fond sombre (optionnel)', upload: 'Importer', remove: 'Retirer',
    idv: 'Identité visuelle', idvSub: 'Importez votre charte graphique en PDF, ou des images et votre logo. Nous lisons les couleurs et les polices pour vous.', drop: 'Déposez vos fichiers ici ou cliquez pour choisir', reading: 'Lecture de', found: 'Ce que nous avons trouvé', colors: 'Couleurs', fonts: 'Polices', apply: 'Créer le thème avec ces couleurs',
    primary: 'Couleur principale', add: 'Ajouter une couleur', noColors: 'Aucune couleur pour le moment. Importez votre logo ou votre charte.', theme: 'Thème de l’espace', mode: 'Mode', light: 'Clair', dark: 'Sombre', auto: 'Automatique', lightS: 'Style clair', darkS: 'Style sombre', brandT: 'Votre marque',
    preview: 'Aperçu', lang: 'Langue de l’espace', font: 'Police', fontNone: 'Par défaut', inText: 'dans le texte de la charte', inImg: 'dans les images', applied: 'Thème créé avec les couleurs de votre marque', powered: 'Le pied de page affiche « Powered by M&O ».', fail: 'Lecture impossible', pMock: 'Carrousel de lancement', none: 'Rien trouvé dans ces fichiers.' },
};
const MSG = {
  pt: { invite: w => `Oi${w ? ', ' + w : ''}! Seu painel está pronto: [link de acesso]\n\nÉ por lá que você aprova os posts, vê o calendário e acha todos os links do projeto. Não precisa de senha.`, remind: (w, n) => `Oi${w ? ', ' + w : ''}! ${n === 1 ? 'Tem uma peça esperando' : 'Tem ' + n + ' peças esperando'} sua aprovação: [link de acesso]\n\nLeva menos de um minuto, pelo celular mesmo.` },
  en: { invite: w => `Hi${w ? ' ' + w : ''}! Your workspace is ready: [access link]\n\nThat's where you approve posts, check the calendar and find every project link. No password needed.`, remind: (w, n) => `Hi${w ? ' ' + w : ''}! ${n === 1 ? 'One piece is' : n + ' pieces are'} waiting for your approval: [access link]\n\nTakes less than a minute, right from your phone.` },
  es: { invite: w => `¡Hola${w ? ', ' + w : ''}! Tu panel está listo: [enlace de acceso]\n\nAhí apruebas las publicaciones, ves el calendario y encuentras todos los enlaces del proyecto. No necesitas contraseña.`, remind: (w, n) => `¡Hola${w ? ', ' + w : ''}! ${n === 1 ? 'Hay una pieza esperando' : 'Hay ' + n + ' piezas esperando'} tu aprobación: [enlace de acceso]\n\nToma menos de un minuto, desde el celular.` },
  fr: { invite: w => `Bonjour${w ? ' ' + w : ''} ! Votre espace est prêt : [lien d’accès]\n\nC’est là que vous validez les publications, consultez le calendrier et retrouvez tous les liens du projet. Pas de mot de passe.`, remind: (w, n) => `Bonjour${w ? ' ' + w : ''} ! ${n === 1 ? 'Un contenu attend' : n + ' contenus attendent'} votre validation : [lien d’accès]\n\nMoins d’une minute, depuis votre téléphone.` },
};
const TPL = {
  pt: { sales: 'Processo de vendas', salesP: 'A M&O desenha este processo com você nas primeiras semanas. Cada etapa abaixo ganha o jeito real como a sua empresa funciona.', salesH: 'Da primeira mensagem ao serviço fechado', steps: ['Primeiro contato', 'Qualificação', 'Reunião', 'Proposta', 'Fechamento'],
    wt: 'Como trabalhamos juntos', h1: 'Como você aprova', p1: 'Toda peça chega na aba "Para você". Você aprova ou pede ajuste ali mesmo, pelo celular. Peça aprovada entra na agenda de publicação.', h2: 'Onde falar com a gente', p2: 'Dúvida rápida: WhatsApp. Comentário sobre uma peça: dentro da própria peça, pra decisão ficar junto dela.' },
  en: { sales: 'Sales process', salesP: 'M&O maps this process with you in the first weeks. Every step below gets filled in with how your business actually works.', salesH: 'From first message to signed job', steps: ['First contact', 'Qualification', 'Meeting', 'Proposal', 'Close'],
    wt: 'How we work together', h1: 'How you approve', p1: 'Every piece arrives in the "For you" tab. You approve or request changes right there, from your phone. Approved pieces go on the publishing schedule.', h2: 'Where to reach us', p2: 'Quick questions: WhatsApp. Comments about a piece: inside the piece itself, so the decision stays with it.' },
  es: { sales: 'Proceso de ventas', salesP: 'M&O diseña este proceso contigo en las primeras semanas. Cada etapa se completa con la forma real en que funciona tu empresa.', salesH: 'Del primer mensaje al servicio cerrado', steps: ['Primer contacto', 'Calificación', 'Reunión', 'Propuesta', 'Cierre'],
    wt: 'Cómo trabajamos juntos', h1: 'Cómo apruebas', p1: 'Cada pieza llega a la pestaña "Para ti". La apruebas o pides cambios ahí mismo, desde el celular. Lo aprobado entra en la agenda de publicación.', h2: 'Dónde hablar con nosotros', p2: 'Dudas rápidas: WhatsApp. Comentarios sobre una pieza: dentro de la misma pieza, para que la decisión quede con ella.' },
  fr: { sales: 'Processus commercial', salesP: 'M&O construit ce processus avec vous pendant les premières semaines. Chaque étape reflète le fonctionnement réel de votre entreprise.', salesH: 'Du premier message au contrat signé', steps: ['Premier contact', 'Qualification', 'Rendez-vous', 'Proposition', 'Signature'],
    wt: 'Comment nous travaillons ensemble', h1: 'Comment vous validez', p1: 'Chaque contenu arrive dans l’onglet « Pour vous ». Vous le validez ou demandez une modification directement, depuis votre téléphone. Ce qui est validé part au planning de publication.', h2: 'Où nous joindre', p2: 'Question rapide : WhatsApp. Remarque sur un contenu : dans le contenu lui-même, pour que la décision reste avec lui.' },
};

/* ================= v3: leitura da identidade visual ================= */
const GFONTS = ['Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins', 'Lato', 'Raleway', 'Nunito', 'Nunito Sans', 'Playfair Display', 'Merriweather', 'Oswald', 'Source Sans 3', 'PT Sans', 'PT Serif', 'Work Sans', 'DM Sans', 'DM Serif Display', 'Manrope', 'Space Grotesk', 'Sora', 'Outfit', 'Plus Jakarta Sans', 'Rubik', 'Karla', 'Mulish', 'Barlow', 'Barlow Condensed', 'IBM Plex Sans', 'IBM Plex Serif', 'IBM Plex Mono', 'Lora', 'Libre Baskerville', 'Cormorant Garamond', 'EB Garamond', 'Archivo', 'Figtree', 'Geist', 'Bebas Neue', 'Anton', 'Josefin Sans', 'Quicksand', 'Fira Sans', 'Heebo', 'Hind', 'Noto Sans', 'Noto Serif', 'Ubuntu', 'Cabin', 'Arimo', 'Titillium Web', 'Exo 2', 'Kanit', 'Prompt', 'Urbanist', 'Lexend', 'Red Hat Display', 'Syne', 'Unbounded', 'Fraunces', 'Instrument Serif', 'Instrument Sans', 'Onest', 'Epilogue', 'Public Sans', 'Albert Sans', 'Be Vietnam Pro', 'Libre Franklin', 'Chivo', 'Bitter', 'Crimson Pro', 'Spectral', 'Zilla Slab', 'Roboto Slab', 'Roboto Condensed', 'Asap', 'Overpass', 'Assistant', 'Catamaran', 'Oxygen', 'Space Mono', 'JetBrains Mono', 'Abril Fatface', 'Archivo Black', 'Big Shoulders Display', 'Dela Gothic One', 'Familjen Grotesk', 'Hanken Grotesk', 'Schibsted Grotesk', 'Bricolage Grotesque', 'Young Serif', 'Gloock'];
const fkey = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const GF_KEYS = Object.fromEntries(GFONTS.map(f => [fkey(f), f]));
function matchFont(raw) {
  let s = String(raw || '').replace(/^[A-Z]{6}\+/, '').split(/[,;]/)[0];
  s = s.replace(/[-_](Regular|Bold|Light|Medium|SemiBold|Semibold|ExtraBold|Black|Thin|Italic|Book|Heavy|Condensed|Roman|Variable|VF)+.*$/i, '');
  const k = fkey(s); if (GF_KEYS[k]) return GF_KEYS[k];
  const hit = Object.keys(GF_KEYS).filter(x => x.length > 4 && k.startsWith(x)).sort((a, b) => b.length - a.length)[0];
  return hit ? GF_KEYS[hit] : null;
}
function fontsInText(txt) { const k = fkey(txt); return GFONTS.filter(f => fkey(f).length > 4 && k.includes(fkey(f))); }
function hexesInText(txt) {
  const out = []; let m;
  const r1 = /#([0-9A-Fa-f]{6})(?![0-9A-Fa-f])/g; while ((m = r1.exec(txt))) out.push('#' + m[1].toUpperCase());
  const r2 = /\bHEX\s*[:#]?\s*#?([0-9A-Fa-f]{6})(?![0-9A-Fa-f])/gi; while ((m = r2.exec(txt))) out.push('#' + m[1].toUpperCase());
  const r3 = /\bR\s*[:=]?\s*(\d{1,3})\s*[,\/ ]\s*G\s*[:=]?\s*(\d{1,3})\s*[,\/ ]\s*B\s*[:=]?\s*(\d{1,3})\b/g; while ((m = r3.exec(txt))) { const v = m.slice(1, 4).map(Number); if (v.every(x => x <= 255)) out.push(rgb2hex(...v)); }
  const r4 = /\bRGB\s*[:(]?\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\b/gi; while ((m = r4.exec(txt))) { const v = m.slice(1, 4).map(Number); if (v.every(x => x <= 255)) out.push(rgb2hex(...v)); }
  return out;
}
function paletteFromCanvas(cv) {
  const ctx = cv.getContext('2d', { willReadFrequently: true }); const { width: w, height: h } = cv; if (!w || !h) return [];
  const d = ctx.getImageData(0, 0, w, h).data; const B = {};
  for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 140) continue; const r = d[i], g = d[i + 1], b = d[i + 2]; const k = (r >> 4) << 8 | (g >> 4) << 4 | (b >> 4); const e = B[k] || (B[k] = [0, 0, 0, 0]); e[0] += r; e[1] += g; e[2] += b; e[3]++; }
  const tot = Object.values(B).reduce((s, e) => s + e[3], 0) || 1;
  return Object.values(B).map(e => { const hex = rgb2hex(e[0] / e[3], e[1] / e[3], e[2] / e[3]); const [, s, l] = rgb2hsl(...hex2rgb(hex)); return { hex, w: e[3] / tot * (l > 95 || l < 6 ? .25 : .6 + s / 100) }; }).filter(c => c.w > .004).sort((a, b) => b.w - a.w).slice(0, 12);
}
const loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
async function paletteFromImage(src) { const img = await loadImg(src); const k = Math.min(1, 120 / Math.max(img.naturalWidth || img.width || 1, img.naturalHeight || img.height || 1)); const cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round((img.naturalWidth || img.width) * k)); cv.height = Math.max(1, Math.round((img.naturalHeight || img.height) * k)); cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height); return paletteFromCanvas(cv); }
function mergeColors(list) {
  const out = [];
  list.forEach(c => { const rgb = hex2rgb(c.hex); const near = out.find(o => { const q = hex2rgb(o.hex); return Math.hypot(rgb[0] - q[0], rgb[1] - q[1], rgb[2] - q[2]) < 34; }); if (near) { near.w += c.w; if (c.src === 'text') { near.src = 'text'; near.hex = c.hex; } } else out.push({ ...c }); });
  return out.sort((a, b) => b.w - a.w);
}
const loadScript = src => new Promise((ok, no) => { if (document.querySelector(`script[src="${src}"]`)) return ok(); const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/';
async function readPdf(file, onPage) {
  await loadScript(PDFJS + 'pdf.min.js'); await loadScript(PDFJS + 'pdf.worker.min.js');
  const lib = window.pdfjsLib; lib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js';
  const pdf = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false, disableFontFace: true }).promise;
  const colors = [], fonts = new Set(); let text = '';
  const n = Math.min(pdf.numPages, 10);
  for (let i = 1; i <= n; i++) {
    onPage && onPage(i, n);
    const page = await pdf.getPage(i); const tc = await page.getTextContent(); text += ' ' + tc.items.map(x => x.str).join(' ');
    const vp0 = page.getViewport({ scale: 1 }); const vp = page.getViewport({ scale: 260 / vp0.width }); const cv = document.createElement('canvas'); cv.width = Math.ceil(vp.width); cv.height = Math.ceil(vp.height);
    try { await page.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise; paletteFromCanvas(cv).slice(0, 6).forEach(c => colors.push({ ...c, w: c.w * .5, src: 'img' })); } catch (e) {}
    [...new Set(tc.items.map(x => x.fontName))].forEach(id => { try { const fo = page.commonObjs.get(id); const m = fo && matchFont(fo.name); if (m) fonts.add(m); } catch (e) {} });
  }
  hexesInText(text).forEach(hex => colors.push({ hex, w: 3, src: 'text' }));
  fontsInText(text).forEach(f => fonts.add(f));
  return { colors, fonts: [...fonts] };
}
async function readBrandFiles(files, onStatus) {
  const colors = [], fonts = new Set(), fails = [];
  for (const f of files) {
    onStatus(f.name);
    try {
      if (f.type === 'application/pdf' || /\.pdf$/i.test(f.name)) { const r = await readPdf(f, (i, n) => onStatus(`${f.name} · ${i}/${n}`)); colors.push(...r.colors); r.fonts.forEach(x => fonts.add(x)); }
      else if (f.type === 'image/svg+xml' || /\.svg$/i.test(f.name)) { const t = await f.text(); hexesInText(t).forEach(hex => colors.push({ hex, w: 2, src: 'text' })); fontsInText(t).forEach(x => fonts.add(x)); const url = URL.createObjectURL(f); (await paletteFromImage(url)).forEach(c => colors.push({ ...c, src: 'img' })); URL.revokeObjectURL(url); }
      else if (/^image\//.test(f.type)) { const url = URL.createObjectURL(f); (await paletteFromImage(url)).forEach(c => colors.push({ ...c, src: 'img' })); URL.revokeObjectURL(url); }
      else fails.push(f.name);
    } catch (e) { fails.push(f.name); }
  }
  return { colors: mergeColors(colors).slice(0, 10), fonts: [...fonts].slice(0, 4), fails };
}
async function logoData(file) {
  if (file.type === 'image/svg+xml' || /\.svg$/i.test(file.name)) { const t = await file.text(); return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(t); }
  const url = URL.createObjectURL(file); const img = await loadImg(url); const k = Math.min(1, 560 / Math.max(img.naturalWidth, img.naturalHeight)); const cv = document.createElement('canvas'); cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k); cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url); return cv.toDataURL('image/png');
}
async function logoIsDark(src) { try { const img = await loadImg(src); const cv = document.createElement('canvas'); cv.width = 64; cv.height = Math.max(1, Math.round(64 * (img.naturalHeight || 1) / (img.naturalWidth || 1))); const ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0, cv.width, cv.height); const d = ctx.getImageData(0, 0, cv.width, cv.height).data; let s = 0, n = 0; for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 140) continue; s += relLum(rgb2hex(d[i], d[i + 1], d[i + 2])); n++; } return n > 0 && s / n < .2; } catch (e) { return false; } }
function pickPrimary(colors) { const c = colors.find(x => { const [, s, l] = rgb2hsl(...hex2rgb(x.hex)); return s > 18 && l > 12 && l < 88; }); return (c || colors[0] || {}).hex || null; }

/* ================= v3: peças de marca ================= */
function ClientLogo({ c, dark }) {
  const b = c.brand || {}; const src = dark && b.logoDark ? b.logoDark : b.logo;
  if (src) return html`<img class="c-logo" src=${src} alt=${c.name} />`;
  if (c.id === 'mo') return html`<${Logo} />`;
  return html`<span class="c-mono"><${CMark} c=${c} /><b>${c.name}</b></span>`;
}
function PoweredBy({ lang = 'pt' }) {
  return html`<span class="powered">${(TX[lang] || TX.pt).powered}<span class="pw-mark" dangerouslySetInnerHTML=${{ __html: ICON }}></span><b>M&O</b></span>`;
}
function ThemeCard({ th, on, onClick, label }) {
  return html`<button type="button" class=${cx('th-card', on && 'on')} aria-pressed=${!!on} onClick=${onClick} title=${label || th.name}>
    <span class="th-sw" style=${{ background: th.bg }}><span class="th-bar" style=${{ background: th.side ? th.side.bg : th.surface2 }}></span><span class="th-body"><i style=${{ background: th.surface, borderColor: th.line }}></i><i style=${{ background: th.primary, width: '40%' }}></i><i style=${{ background: th.text3, width: '60%', height: '3px' }}></i></span></span>
    <span class="th-name">${label || th.name}${th.mo ? html` <small>M&O</small>` : null}</span></button>`;
}
function AppearancePop({ close }) {
  const { look, setLook } = useApp();
  const setMode = m => setLook({ ...look, mode: m });
  return html`<div class="pop side-pop look-pop" role="dialog" aria-label="Aparência">
    <div class="pop-h"><b>Aparência</b><button class="btn icon sm ghost" aria-label="Fechar" onClick=${close}><${Icon} n="x" s=${14} /></button></div>
    <div class="seg" style="align-self:stretch">${[['light', 'Claro'], ['dark', 'Escuro'], ['auto', 'Automático']].map(([k, l]) => html`<button key=${k} class=${cx(look.mode === k && 'on')} style="flex:1;justify-content:center" onClick=${() => setMode(k)}>${l}</button>`)}</div>
    <span class="label">Estilos claros</span><div class="th-grid">${LIGHTS.map(id => html`<${ThemeCard} key=${id} th=${THEMES[id]} on=${look.light === id} onClick=${() => setLook({ ...look, light: id, mode: look.mode === 'dark' ? 'light' : look.mode })} />`)}</div>
    <span class="label">Estilos escuros</span><div class="th-grid">${DARKS.map(id => html`<${ThemeCard} key=${id} th=${THEMES[id]} on=${look.dark === id} onClick=${() => setLook({ ...look, dark: id, mode: look.mode === 'light' ? 'dark' : look.mode })} />`)}</div>
    <p class="muted" style="font-size:12px">No automático, segue o claro ou escuro do seu sistema. Fica salvo neste navegador.</p>
  </div>`;
}
function LangPop({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  return html`<div class="p-menu"><button class="btn sm ghost lang-btn" aria-expanded=${open} aria-label="Idioma" onClick=${() => setOpen(!open)}><${Icon} n="globe" s=${15} /><span class="mono">${lang.toUpperCase()}</span></button>
    ${open && html`<div class="pop">${LANGS.map(([k, l]) => html`<button key=${k} onClick=${() => { setLang(k); setOpen(false); }}><span class="mono" style="width:22px">${k.toUpperCase()}</span>${l}${lang === k && html`<span style="margin-left:auto"><${Icon} n="check" s=${14} /></span>`}</button>`)}</div>`}</div>`;
}
function BrandEditor({ c, lang = 'pt', asClient }) {
  const { act, toast } = useApp();
  const t = BT[lang] || BT.pt; const b = c.brand || {}; const th = b.theme || { mode: 'light', light: 'areia', dark: 'grafite' };
  const [busy, setBusy] = useState(''); const [found, setFound] = useState(null); const [drag, setDrag] = useState(false);
  const set = patch => act.setBrand(c.id, patch);
  const onLogo = async (e, key) => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return; const data = await logoData(f); const patch = { [key]: data };
    if (key === 'logo') { patch.logoIsDark = await logoIsDark(data); try { const pal = await paletteFromImage(data); const cols = mergeColors(pal.map(p => ({ ...p, src: 'img' }))).slice(0, 6).map(x => x.hex); const merged = [...new Set([...(b.colors || []), ...cols])].slice(0, 10); patch.colors = merged; if (!b.primary) patch.primary = pickPrimary(pal.map(p => ({ hex: p.hex }))); } catch (er) {} }
    set(patch); };
  const read = async files => { if (!files || !files.length) return; setFound(null); const r = await readBrandFiles([...files], name => setBusy(name)); setBusy(''); setFound(r); };
  const applyFound = () => { const cols = [...new Set([...found.colors.map(x => x.hex), ...(b.colors || [])])].slice(0, 10); const primary = pickPrimary(found.colors) || b.primary; const font = found.fonts[0] || b.font || null;
    set({ colors: cols, primary, font, theme: { ...th, light: 'brand', dark: 'brand' } }); setFound(null); toast(t.applied); };
  const cols = b.colors || [];
  const Slot = (key, label, bgDark) => html`<div class=${cx('logo-slot', bgDark && 'dark')}>
    <div class="logo-prev">${b[key] ? html`<img src=${b[key]} alt="" />` : key === 'logo' && c.id === 'mo' ? html`<${Logo} />` : html`<span class="muted" style="font-size:12px">—</span>`}</div>
    <div class="logo-meta"><span>${label}</span><span style="display:flex;gap:6px"><label class="btn sm"><${Icon} n="plus" s=${13} />${t.upload}<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" class="sr" onChange=${e => onLogo(e, key)} /></label>${b[key] && html`<button class="btn sm ghost" onClick=${() => set({ [key]: null })}>${t.remove}</button>`}</span></div></div>`;
  const pv = clientTheme(c, false); const pvD = clientTheme({ ...c, brand: { ...b, theme: { ...th, mode: 'dark' } } }, true);
  const Mock = (tm, dark) => html`<div class="mock" style=${portalStyle(c, tm)}><div class="mock-top"><${ClientLogo} c=${c} dark=${dark} /></div>
    <div class="mock-body"><span class="pill t-cli">${(TX[lang] || TX.pt).st.cliente}</span><b>${t.pMock}</b><div class="mock-img"></div><div class="mock-acts"><span class="btn sm">${(TX[lang] || TX.pt).change}</span><span class="btn sm pri">${(TX[lang] || TX.pt).approve}</span></div></div>
    <div class="mock-foot"><${PoweredBy} lang=${lang} /></div></div>`;
  return html`<div class="brand-ed">
    <div class="be-main">
      ${asClient && html`<div><h1 style="font-size:24px">${t.title}</h1><p class="muted" style="margin-top:4px">${t.sub}</p></div>`}
      <section class="sec be-sec"><h2>${t.idv}</h2><p class="muted">${t.idvSub}</p>
        <label class=${cx('drop', drag && 'on')} onDragOver=${e => { e.preventDefault(); setDrag(true); }} onDragLeave=${() => setDrag(false)} onDrop=${e => { e.preventDefault(); setDrag(false); read(e.dataTransfer.files); }}>
          <${Icon} n="image" s=${22} /><span>${busy ? `${t.reading} ${busy}…` : t.drop}</span><small class="muted">PDF · PNG · JPG · SVG</small>
          <input type="file" multiple accept="application/pdf,image/png,image/jpeg,image/webp,image/svg+xml" class="sr" onChange=${e => { read(e.target.files); e.target.value = ''; }} /></label>
        ${found && html`<div class="found"><b>${t.found}</b>
          ${found.colors.length || found.fonts.length ? html`
            <div class="sw-row">${found.colors.map(x => html`<span key=${x.hex} class="sw-lg" title=${`${x.hex} · ${x.src === 'text' ? t.inText : t.inImg}`}><i style=${{ background: x.hex }}></i><span class="mono">${x.hex}</span>${x.src === 'text' && html`<small>${t.inText}</small>`}</span>`)}</div>
            ${found.fonts.length > 0 && html`<p style="font-size:13px">${t.fonts}: <b>${found.fonts.join(', ')}</b></p>`}
            <button class="btn pri" onClick=${applyFound}><${Icon} n="sparkle" s=${14} />${t.apply}</button>` : html`<p class="muted">${t.none}</p>`}
          ${found.fails.length > 0 && html`<p class="err">${t.fail}: ${found.fails.join(', ')}</p>`}</div>`}
      </section>
      <section class="sec be-sec"><h2>${t.logo}</h2><div class="logo-slots">${Slot('logo', t.logoLight, false)}${Slot('logoDark', t.logoDark, true)}</div></section>
      <section class="sec be-sec"><h2>${t.colors}</h2>
        ${cols.length ? html`<div class="sw-row">${cols.map(h => html`<button key=${h} class=${cx('sw-lg pick', b.primary === h && 'on')} onClick=${() => set({ primary: h })} title=${t.primary}><i style=${{ background: h }}></i><span class="mono">${h}</span>${b.primary === h && html`<small>${t.primary}</small>`}</button>`)}
          <label class="sw-lg add" title=${t.add}><i><${Icon} n="plus" s=${14} /></i><span>${t.add}</span><input type="color" class="sr" onChange=${e => set({ colors: [...new Set([...cols, e.target.value.toUpperCase()])], primary: b.primary || e.target.value.toUpperCase() })} /></label></div>`
          : html`<p class="muted">${t.noColors}</p>`}
        <div class="two" style="max-width:520px"><label class="field"><span>${t.font}</span><select class="sel" id=${'be-font-' + c.id} value=${b.font || ''} onChange=${e => set({ font: e.target.value || null })}><option value="">${t.fontNone}</option>${[...new Set([...(b.font ? [b.font] : []), ...GFONTS])].map(f => html`<option key=${f} value=${f}>${f}</option>`)}</select></label>
          <label class="field"><span>${t.lang}</span><select class="sel" id=${'be-lang-' + c.id} value=${c.lang} onChange=${e => act.setClient(c.id, { lang: e.target.value })}>${LANGS.map(([k, l]) => html`<option key=${k} value=${k}>${l}</option>`)}</select></label></div>
      </section>
      <section class="sec be-sec"><h2>${t.theme}</h2>
        <div class="seg">${[['light', t.light], ['dark', t.dark], ['auto', t.auto]].map(([k, l]) => html`<button key=${k} class=${cx(th.mode === k && 'on')} onClick=${() => set({ theme: { ...th, mode: k } })}>${l}</button>`)}</div>
        <span class="label">${t.lightS}</span><div class="th-grid">${isHex(b.primary) && html`<${ThemeCard} th=${brandTheme(b.primary, 'light')} label=${t.brandT} on=${th.light === 'brand'} onClick=${() => set({ theme: { ...th, light: 'brand' } })} />`}${LIGHTS.map(id => html`<${ThemeCard} key=${id} th=${THEMES[id]} on=${th.light === id} onClick=${() => set({ theme: { ...th, light: id } })} />`)}</div>
        <span class="label">${t.darkS}</span><div class="th-grid">${isHex(b.primary) && html`<${ThemeCard} th=${brandTheme(b.primary, 'dark')} label=${t.brandT} on=${th.dark === 'brand'} onClick=${() => set({ theme: { ...th, dark: 'brand' } })} />`}${DARKS.map(id => html`<${ThemeCard} key=${id} th=${THEMES[id]} on=${th.dark === id} onClick=${() => set({ theme: { ...th, dark: id } })} />`)}</div>
        <p class="muted" style="font-size:12px">${t.powered}</p>
      </section>
    </div>
    <aside class="be-prev"><span class="label">${t.preview}</span>${Mock(pv, false)}${Mock(pvD, true)}
      <p class="be-note">${t.contrastT}: ${t.textT} ${nf(contrast(pv.text, pv.bg), 1)}:1 · ${t.buttonT} ${nf(contrast(pv.onPrimary, pv.primary), 1)}:1 ✓</p>
      ${pv.brand && isHex(b.primary) && pv.primary !== String(b.primary).toUpperCase() && html`<p class="be-note">${t.adjusted}</p>`}
      ${b.logo && b.logoIsDark && !b.logoDark && html`<p class="be-warn">${t.darkLogo}</p>`}</aside>
  </div>`;
}
function BrandedLogin({ c, back, enter }) {
  const sysDark = useSysDark(); const th = clientTheme(c, sysDark); const lang = c.lang;
  const T = { pt: ['Entre no seu painel', 'A gente manda um link de acesso pro seu e-mail. Sem senha.', 'Receber link', 'Protótipo: entrar direto'], en: ['Sign in to your workspace', "We'll email you a sign-in link. No password.", 'Email me a link', 'Prototype: sign in now'], es: ['Entra a tu panel', 'Te enviamos un enlace de acceso por correo. Sin contraseña.', 'Recibir enlace', 'Prototipo: entrar ahora'], fr: ['Accédez à votre espace', 'Nous vous envoyons un lien de connexion par e-mail. Sans mot de passe.', 'Recevoir le lien', 'Prototype : entrer maintenant'] }[lang] || [];
  const [email, setEmail] = useState(''); const [sent, setSent] = useState(false);
  return html`<div class="blogin" style=${portalStyle(c, th)}><div class="bl-box">
    <div class="bl-logo"><${ClientLogo} c=${c} dark=${th.mode === 'dark'} /></div>
    <div><h1>${T[0]}</h1><p class="muted" style="margin-top:8px">${T[1]}</p></div>
    <form class="bl-form" onSubmit=${e => { e.preventDefault(); if (email.includes('@')) setSent(true); }}><label class="sr" for="bl-email">E-mail</label><input id="bl-email" class="inp" type="email" placeholder="you@company.com" value=${email} onInput=${e => setEmail(e.target.value)} /><button class="btn pri" type="submit">${T[2]}</button></form>
    ${sent && html`<p class="muted" style="font-size:13px">✓ ${email}</p>`}
    <button class="btn" onClick=${enter}>${T[3]}<${Icon} n="arrowR" s=${14} /></button>
    <div class="bl-foot"><button class="linkbtn" onClick=${back}>← M&O</button><${PoweredBy} lang=${lang} /></div>
  </div></div>`;
}

/* ================= v3: painel do cliente ================= */
const RQ = {
  pt: { ask: 'Pedir algo', title: 'O que você precisa?', ph: 'Ex.: um post sobre a promoção de outubro', details: 'Detalhes', phD: 'Conte o que precisa, o prazo e as referências. Pode colar links.', send: 'Enviar pedido', sent: 'Pedido enviado. A resposta chega por aqui.', mine: 'Seus pedidos', st: { todo: 'Recebido', doing: 'Em andamento', review: 'Em andamento', client: 'Esperando você', done: 'Entregue' } },
  en: { ask: 'Request something', title: 'What do you need?', ph: 'E.g. a post about the October promotion', details: 'Details', phD: 'Tell us what you need, the deadline and references. You can paste links.', send: 'Send request', sent: "Request sent. You'll get the answer here.", mine: 'Your requests', st: { todo: 'Received', doing: 'In progress', review: 'In progress', client: 'Waiting on you', done: 'Delivered' } },
  es: { ask: 'Pedir algo', title: '¿Qué necesitas?', ph: 'Ej.: una publicación sobre la promoción de octubre', details: 'Detalles', phD: 'Cuéntanos qué necesitas, el plazo y las referencias. Puedes pegar enlaces.', send: 'Enviar pedido', sent: 'Pedido enviado. La respuesta llega por aquí.', mine: 'Tus pedidos', st: { todo: 'Recibido', doing: 'En curso', review: 'En curso', client: 'Te espera', done: 'Entregado' } },
  fr: { ask: 'Faire une demande', title: 'De quoi avez-vous besoin ?', ph: 'Ex. : une publication sur la promotion d’octobre', details: 'Détails', phD: 'Dites-nous ce qu’il vous faut, le délai et vos références. Vous pouvez coller des liens.', send: 'Envoyer', sent: 'Demande envoyée. La réponse arrivera ici.', mine: 'Vos demandes', st: { todo: 'Reçue', doing: 'En cours', review: 'En cours', client: 'Vous attend', done: 'Livrée' } },
};
function RequestSheet({ c, lang, close }) {
  const { act } = useApp(); const R = RQ[lang] || RQ.pt; const t = TX[lang] || TX.pt;
  const [f, setF] = useState({ title: '', desc: '' }); const [done, setDone] = useState(false);
  return html`<div class="p-sheet-wrap" onClick=${e => e.target === e.currentTarget && close()}><form class="p-sheet" role="dialog" aria-modal="true" aria-label=${R.title} onSubmit=${e => { e.preventDefault(); if (!f.title.trim()) return; act.clientRequest(c.id, f.title.trim(), f.desc.trim()); setDone(true); }}>
    <div class="mhd"><h2>${done ? R.sent : R.title}</h2><button type="button" class="btn icon ghost" aria-label=${t.cancel} onClick=${close}><${Icon} n="x" /></button></div>
    ${done ? html`<div class="mft"><button type="button" class="btn pri" onClick=${close}>OK</button></div>` : html`
      <div class="mbd"><label class="field"><span>${R.title}</span><input class="inp" id="rq-title" ref=${autoF} placeholder=${R.ph} value=${f.title} onInput=${e => setF({ ...f, title: e.target.value })} /></label>
        <label class="field"><span>${R.details}</span><textarea class="ta" id="rq-desc" placeholder=${R.phD} value=${f.desc} onInput=${e => setF({ ...f, desc: e.target.value })}></textarea></label></div>
      <div class="mft"><button type="button" class="btn ghost" onClick=${close}>${t.cancel}</button><button class="btn pri" type="submit" disabled=${!f.title.trim()}>${R.send}</button></div>`}
  </form></div>`;
}
function Portal({ clientId, preview }) {
  const { db, setSession } = useApp();
  const c = db.clients.find(x => x.id === clientId);
  const sysDark = useSysDark();
  const [lang, setLangS] = useState(() => lsGet('mo.lang.' + clientId, c.lang));
  const setLang = l => { setLangS(l); lsSet('mo.lang.' + clientId, l); };
  const [tab, setTab] = useState('home'); const [menu, setMenu] = useState(false); const [ask, setAsk] = useState(false);
  const scRef = useRef();
  const t = TX[lang] || TX.pt; const R = RQ[lang] || RQ.pt; const th = clientTheme(c, sysDark);
  const pending = [...db.posts.filter(p => p.clientId === clientId && p.status === 'cliente'), ...db.scripts.filter(s => s.clientId === clientId && s.status === 'cliente'), ...db.tasks.filter(x => x.clientId === clientId && x.status === 'client')].length;
  const tabs = [['home', t.forYou, 'home', pending], ['cal', t.cal, 'cal'], ['content', t.content, 'image'], ['proc', t.proc, 'file'], ['links', t.links, 'link']];
  const pick = k => { setTab(k); if (scRef.current) scRef.current.scrollTop = 0; };
  let view;
  if (tab === 'cal') view = html`<${PortalCal} c=${c} lang=${lang} />`;
  else if (tab === 'content') view = html`<${PortalContent} c=${c} lang=${lang} />`;
  else if (tab === 'proc') view = html`<div class="sec" style="gap:18px"><h1 style="font-size:24px">${t.proc}</h1><${Docs} pages=${db.pages.filter(p => p.clientId === clientId)} clientPage lang=${lang} /></div>`;
  else if (tab === 'links') view = html`<${PortalLinks} c=${c} lang=${lang} />`;
  else if (tab === 'brand') view = html`<${BrandEditor} c=${c} lang=${lang} asClient />`;
  else view = html`<${PortalHome} c=${c} lang=${lang} goCal=${() => pick('cal')} />`;
  return html`<div class="portal" style=${portalStyle(c, th)}>
    <header class="p-top"><button class="p-brand" onClick=${() => pick('home')} aria-label=${c.name}><${ClientLogo} c=${c} dark=${th.mode === 'dark'} /></button>
      <div class="right">
        <button class="btn sm p-req" onClick=${() => setAsk(true)} title=${R.ask}><${Icon} n="plus" s=${14} /><span>${R.ask}</span></button>
        <${LangPop} lang=${lang} setLang=${setLang} />
        <div class="p-menu"><button class="btn icon ghost" aria-label="Menu" aria-expanded=${menu} onClick=${() => setMenu(!menu)}><${CMark} c=${c} /></button>
          ${menu && html`<div class="pop"><button onClick=${() => { pick('brand'); setMenu(false); }}><${Icon} n="sliders" />${t.personalize}</button>${!preview && html`<button onClick=${() => setSession(null)}><${Icon} n="logout" />${t.switchAcc}</button>`}<div class="pop-foot"><${PoweredBy} lang=${lang} /></div></div>`}</div>
      </div></header>
    <nav class="p-tabs" aria-label="Seções">${tabs.map(([k, l, ic, n]) => html`<button key=${k} class=${cx('p-tab', tab === k && 'on')} aria-current=${tab === k ? 'page' : null} onClick=${() => pick(k)}><${Icon} n=${ic} s=${20} />${l}${n ? html`<span class="badge">${n}</span>` : null}</button>`)}</nav>
    <div class="p-scroll" ref=${scRef}><div class="p-body">${view}<footer class="p-foot"><${PoweredBy} lang=${lang} /></footer></div></div>
    ${ask && html`<${RequestSheet} c=${c} lang=${lang} close=${() => setAsk(false)} />`}
  </div>`;
}
function MyRequests({ c, lang }) {
  const { db } = useApp(); const R = RQ[lang] || RQ.pt;
  const list = db.tasks.filter(x => x.clientId === c.id && x.req);
  if (!list.length) return null;
  return html`<section class="sec" style="gap:10px"><div class="sec-h" style="padding:0"><h2>${R.mine}</h2><span class="c">${list.length}</span></div>
    <div class="list">${list.map(x => html`<div class="row" key=${x.id} style="cursor:default"><${Icon} n="inbox" /><div class="row-main"><div class="row-title">${x.title}</div><div class="row-meta">${rel(x.since, lang)}</div></div><span class=${'pill t-' + (x.status === 'done' ? 'ok' : x.status === 'todo' ? 'neu' : x.status === 'client' ? 'cli' : 'prog')}>${R.st[x.status]}</span></div>`)}</div></section>`;
}

/* ================= v3: IA no quadro e no funil (só no acesso do Pedro) ================= */
function boardPrompt(q, hasImg) {
  return `Você desenha num quadro branco de uma agência. Transforme o pedido${hasImg ? ' e a imagem anexada (foto de quadro, papel ou esboço)' : ''} em elementos do quadro.
Responda SOMENTE com um JSON neste formato:
{"elementos":[{"tipo":"postit","texto":"curto","cor":"sand","coluna":0,"linha":1}],"setas":[{"de":0,"para":1}]}
- tipo: postit, texto, retangulo ou elipse. Use "texto" para títulos de coluna, sempre na linha 0.
- cor (só para postit): sand, cream, green, blue, lilac ou pink. Use a mesma cor para coisas do mesmo grupo.
- coluna e linha organizam o desenho: colunas são etapas da esquerda para a direita, linhas empilham itens da mesma etapa.
- setas ligam posições do array "elementos".
- Textos curtos (até 12 palavras), no idioma do pedido. No máximo 24 elementos. ${hasImg ? 'Reproduza a estrutura da imagem com fidelidade, sem inventar o que não está nela.' : 'Não invente dado, número ou nome que não esteja no pedido.'}
Pedido: ${q || '(sem texto; use só a imagem)'}`;
}
function funnelPrompt(q, hasImg) {
  return `Você monta funis de venda num construtor visual.${hasImg ? ' Use também a imagem anexada (foto de um funil desenhado ou de uma tela).' : ''}
Tipos de etapa disponíveis (use só estes códigos): ${Object.entries(FN).map(([k, t]) => `${k} = ${t.label}`).join('; ')}.
Responda SOMENTE com um JSON neste formato:
{"etapas":[{"tipo":"meta","nome":"Meta Ads","investimento":3000,"cpc":2.5,"visitas":0,"taxa_compra":0,"preco":0}],"ligacoes":[{"de":0,"para":1,"taxa":100}]}
- ligações apontam posições do array "etapas". taxa = porcentagem que passa de uma etapa para a outra.
- investimento e cpc só em tráfego pago; visitas só em tráfego orgânico; taxa_compra e preco só em checkout, upsell, downsell e venda.
- Use os números que o pedido ou a imagem trouxerem. Onde faltar taxa, use uma premissa conservadora típica de mercado; onde faltar investimento, preço ou visitas, deixe 0.
- Nomes curtos, no idioma do pedido.
Pedido: ${q || '(sem texto; use só a imagem)'}`;
}
function layoutFunnel(steps, links) {
  const n = steps.length; const indeg = Array(n).fill(0); links.forEach(l => { indeg[l.to]++; });
  const depth = Array(n).fill(0); const q = []; indeg.forEach((d, i) => { if (!d) q.push(i); }); const deg = [...indeg];
  while (q.length) { const i = q.shift(); links.filter(l => l.from === i).forEach(l => { depth[l.to] = Math.max(depth[l.to], depth[i] + 1); if (--deg[l.to] === 0) q.push(l.to); }); }
  const rows = {}; return steps.map((s, i) => { const d = depth[i]; const r = rows[d] = (rows[d] || 0) + 1; return { x: d * 250, y: (r - 1) * 150 }; });
}
function AiPanel({ kind, onResult, close }) {
  const [q, setQ] = useState(''); const [img, setImg] = useState(null); const [prev, setPrev] = useState(null); const [busy, setBusy] = useState(false); const [err, setErr] = useState(''); const [canImg, setCanImg] = useState(true); const [mode, setMode] = useState('add');
  useEffect(() => { (async () => { const s = await cap('sample'); if (!s) return; const l = await s.limits().catch(() => null); setCanImg(!!(l && l.images)); })(); }, []);
  const run = async () => {
    const s = await cap('sample'); if (!s) { setErr('O Claude não está disponível nesta visualização. Abra o link dentro do claude.ai.'); return; }
    setBusy(true); setErr('');
    try { const r = await s.json(kind === 'board' ? boardPrompt(q.trim(), !!img) : funnelPrompt(q.trim(), !!img), { modelTier: 'default', ...(img ? { images: img } : {}) }); onResult(r, mode); close(); }
    catch (e) { setErr(sampleMsg(e)); } finally { setBusy(false); }
  };
  return html`<div class="ai-pop" role="dialog" aria-label=${kind === 'board' ? 'Desenhar com IA' : 'Montar o funil com IA'} onPointerDown=${e => e.stopPropagation()}>
    <div class="pop-h"><b><${Icon} n="sparkle" s=${15} /> ${kind === 'board' ? 'Desenhar com IA' : 'Montar o funil com IA'}</b><button class="btn icon sm ghost" aria-label="Fechar" onClick=${close}><${Icon} n="x" s=${14} /></button></div>
    <label class="sr" for="ai-q">Pedido</label>
    <textarea id="ai-q" class="ta" ref=${autoF} placeholder=${kind === 'board' ? 'Ex.: desenha o onboarding do cliente novo em 3 etapas: dia 1, semana 1, semana 2' : 'Ex.: Meta Ads com 3 mil dólares, leva pro quiz, o agente qualifica no WhatsApp e agenda a reunião'} value=${q} onInput=${e => setQ(e.target.value)} onKeyDown=${e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) run(); }}></textarea>
    <p class="ai-hint"><${Icon} n="msg" s=${13} />Pra falar em vez de digitar, use o ditado do teclado: o microfone do teclado no celular, ou a tecla Fn duas vezes no Mac.</p>
    ${canImg && html`<div class="ai-att">${prev ? html`<span class="ai-thumb"><img src=${prev} alt="Imagem anexada" /><button class="btn icon sm ghost" aria-label="Tirar imagem" onClick=${() => { setImg(null); setPrev(null); }}><${Icon} n="x" s=${12} /></button></span>` : null}
      <label class="btn sm"><${Icon} n="image" s=${14} />${prev ? 'Trocar foto' : 'Anexar foto'}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="sr" onChange=${e => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (f) { setImg(f); setPrev(URL.createObjectURL(f)); } }} /></label>
      <span class="muted" style="font-size:12px">Foto de lousa, papel ou print</span></div>`}
    ${kind === 'funnel' && html`<div class="seg" style="align-self:flex-start"><button class=${cx(mode === 'add' && 'on')} onClick=${() => setMode('add')}>Adicionar ao lado</button><button class=${cx(mode === 'replace' && 'on')} onClick=${() => setMode('replace')}>Substituir o funil</button></div>`}
    ${err && html`<p class="err">${err}</p>`}
    <div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn ghost" onClick=${close}>Cancelar</button><button class="btn pri" disabled=${busy || (!q.trim() && !img)} onClick=${run}><${Icon} n="sparkle" s=${14} />${busy ? (kind === 'board' ? 'Desenhando…' : 'Montando…') : kind === 'board' ? 'Desenhar' : 'Montar'}</button></div>
  </div>`;
}
