
/* ================= v9: formato do post e prévia da peça ================= */
const short = (s, n = 28) => { s = String(s || '').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const PFMT = [
  { k: 'post', r: 4 / 5, tag: '4:5' }, { k: 'carrossel', r: 4 / 5, tag: '4:5' }, { k: 'reels', r: 9 / 16, tag: '9:16', vid: true }, { k: 'story', r: 9 / 16, tag: '9:16' },
  { k: 'video', r: 16 / 9, tag: 'feed', vid: true }, { k: 'longo', r: 16 / 9, tag: '16:9', vid: true }, { k: 'shorts', r: 9 / 16, tag: '9:16', vid: true }, { k: 'documento', r: 4 / 5, tag: 'PDF' },
];
const FMT_T = {
  pt: { post: 'Post', carrossel: 'Carrossel', reels: 'Reels', story: 'Story', video: 'Vídeo', longo: 'Vídeo longo', shorts: 'Shorts', documento: 'Documento', slides: 'slides', label: 'Formato' },
  en: { post: 'Post', carrossel: 'Carousel', reels: 'Reel', story: 'Story', video: 'Video', longo: 'Long video', shorts: 'Short', documento: 'Document', slides: 'slides', label: 'Format' },
  es: { post: 'Publicación', carrossel: 'Carrusel', reels: 'Reel', story: 'Historia', video: 'Video', longo: 'Video largo', shorts: 'Short', documento: 'Documento', slides: 'diapositivas', label: 'Formato' },
  fr: { post: 'Publication', carrossel: 'Carrousel', reels: 'Reel', story: 'Story', video: 'Vidéo', longo: 'Vidéo longue', shorts: 'Short', documento: 'Document', slides: 'diapositives', label: 'Format' },
};
const FMT_DESC = { post: 'Uma imagem, 4:5', carrossel: 'Até 20 imagens, 4:5', reels: 'Vídeo vertical, 9:16', story: 'Imagem ou vídeo vertical, 9:16', video: 'Vídeo no feed do LinkedIn ou do Facebook', longo: 'YouTube, 16:9', shorts: 'YouTube, vertical, até 3 min', documento: 'PDF no LinkedIn, cada página vira um slide' };
const fmtKey = f => { if (!f) return null; const n = norm(f); const hit = PFMT.find(x => x.k === n || norm(FMT_T.pt[x.k]) === n); return hit ? hit.k : null; };
const fmtOf = f => PFMT.find(x => x.k === fmtKey(f)) || null;
const fmtName = (lang, f) => { const k = fmtKey(f); return k ? (FMT_T[lang] || FMT_T.pt)[k] : ''; };
const vidRatio = v => (v && v.w && v.h ? Math.max(9 / 16, Math.min(16 / 9, v.w / v.h)) : null);
function pieceRatio(x) { const F = fmtOf(x.format); if (F && F.k === 'video') return vidRatio(x.video) || F.r; return F ? F.r : vidRatio(x.video) || 4 / 5; }
const ratioCls = r => (r < .7 ? 'r916' : r > 1.2 ? 'r169' : 'r45');
function pieceKind(lang, x) { const L = FMT_T[lang] || FMT_T.pt; const n = (x.imgs || []).length; const name = fmtName(lang, x.format) || L.post; return n > 1 && !x.video ? `${name} · ${n} ${L.slides}` : name; }
const pieceCover = x => (x.imgs && x.imgs[0]) || (x.video && x.video.poster) || null;
function autoFmt(x) { if (x.format && x.fmtAuto !== true) return; const n = (x.imgs || []).length; const f = x.video ? (x.video.h > x.video.w ? 'reels' : 'video') : n > 1 ? 'carrossel' : n === 1 ? 'post' : null; if (f) { x.format = f; x.fmtAuto = true; } }
const addImgs = (x, list) => { x.imgs = [...(x.imgs || []), ...list].slice(0, 20); autoFmt(x); };
function fmtWarn(x) {
  const F = fmtOf(x.format); if (!F) return null; const n = (x.imgs || []).length; const v = x.video;
  if (F.vid && !v && n) return [`${F.k === 'video' ? 'Este formato' : FMT_T.pt[F.k]} pede vídeo. Suba o vídeo ou troque o formato.`, n > 1 ? 'carrossel' : 'post'];
  if (F.k === 'post' && n > 1 && !v) return [`Post leva uma imagem só. Com ${n} imagens, ele sai como carrossel.`, 'carrossel'];
  if (['post', 'carrossel', 'documento'].includes(F.k) && v && !n) return ['Um vídeo sozinho no Instagram sai como Reels.', 'reels'];
  if ((F.k === 'reels' || F.k === 'shorts') && v && v.w > v.h) return [`${FMT_T.pt[F.k]} é vertical (9:16), e este vídeo é horizontal.`, 'video'];
  if (F.k === 'longo' && v && v.h > v.w) return ['Vídeo longo do YouTube é horizontal (16:9), e este vídeo é vertical.', 'shorts'];
  return null;
}
const PM = {
  pt: { hidden: n => `${n === 1 ? 'A imagem continua guardada e volta' : `As ${n} imagens continuam guardadas e voltam`} se você tirar o vídeo.`, linkAdded: 'Link adicionado à peça', drop: 'Solte aqui as imagens, o vídeo, o PDF ou o ZIP', upload: 'Enviar arquivos', link: 'Colar link', add: 'Pôr na prévia', cancel: 'Cancelar', ph: 'Link do Drive, Canva, Figma, YouTube…', removeV: 'Tirar o vídeo', removeI: 'Tirar esta imagem', addMore: 'Adicionar imagens', reorder: 'Arraste para mudar a ordem',
    note: 'Imagem, vídeo, PDF (cada página vira um slide) ou ZIP. Link de pasta ou de apresentação do Drive também vira prévia.', linkNote: 'Este link aparece como cartão. Para ver a peça aqui, suba as imagens ou o PDF, ou cole o link da pasta do Drive.',
    none: 'Sem arte ainda', slidesAdded: n => `${n} ${n === 1 ? 'imagem entrou' : 'imagens entraram'} na prévia`, removedI: 'Imagem tirada da prévia', removedV: 'Vídeo tirado da prévia',
    reading: n => `Lendo ${n}`, page: (n, i, t) => `${n}: página ${i} de ${t}`, zipImg: (n, i, t) => `${n}: imagem ${i} de ${t}`, drive: 'Lendo a pasta do Drive', driveN: (i, t) => `Puxando do Drive: arquivo ${i} de ${t}`, drivePage: (i, t) => `Puxando do Drive: página ${i} de ${t}`,
    offline: 'Para puxar a peça do Drive, abra a plataforma dentro do claude.ai. Aqui o link fica como cartão.', empty: 'Não achei imagem nesse link. Se for a pasta geral, cole a pasta de um post só.', videoLink: 'Vídeo do Drive fica como link. Para assistir aqui, suba o arquivo.', tooBig: 'Arquivo grande demais para puxar por aqui.',
    badType: n => `${n}: esse tipo de arquivo não entra na prévia`, badRead: n => `${n}: não deu para ler`, noPages: n => `${n}: não deu para desenhar as páginas`, first20: (n, t) => `${n}: entraram as 20 primeiras páginas de ${t}`, zipEmpty: n => `${n}: não tem imagem dentro` },
  en: { hidden: n => `${n === 1 ? 'The image is kept and comes back' : `The ${n} images are kept and come back`} if you remove the video.`, linkAdded: 'Link added to the piece', drop: 'Drop images, a video, a PDF or a ZIP here', upload: 'Upload files', link: 'Paste a link', add: 'Add to preview', cancel: 'Cancel', ph: 'Drive, Canva, Figma or YouTube link…', removeV: 'Remove the video', removeI: 'Remove this image', addMore: 'Add images', reorder: 'Drag to reorder',
    note: 'Image, video, PDF (each page becomes a slide) or ZIP. A Drive folder or presentation link also becomes a preview.', linkNote: 'This link shows as a card. To see the piece here, upload the images or the PDF, or paste the Drive folder link.',
    none: 'No artwork yet', slidesAdded: n => `${n} ${n === 1 ? 'image' : 'images'} added to the preview`, removedI: 'Image removed from the preview', removedV: 'Video removed from the preview',
    reading: n => `Reading ${n}`, page: (n, i, t) => `${n}: page ${i} of ${t}`, zipImg: (n, i, t) => `${n}: image ${i} of ${t}`, drive: 'Reading the Drive folder', driveN: (i, t) => `Pulling from Drive: file ${i} of ${t}`, drivePage: (i, t) => `Pulling from Drive: page ${i} of ${t}`,
    offline: 'Open the workspace inside claude.ai to pull this from Drive. Here the link stays as a card.', empty: 'No images found at that link. If it is the main folder, paste the folder of a single post.', videoLink: 'A Drive video stays as a link. Upload the file to watch it here.', tooBig: 'This file is too large to pull in here.',
    badType: n => `${n}: this file type can't go in the preview`, badRead: n => `${n}: couldn't read it`, noPages: n => `${n}: couldn't draw the pages`, first20: (n, t) => `${n}: the first 20 of ${t} pages went in`, zipEmpty: n => `${n}: no images inside` },
  es: { hidden: n => `${n === 1 ? 'La imagen sigue guardada y vuelve' : `Las ${n} imágenes siguen guardadas y vuelven`} si quitas el video.`, linkAdded: 'Enlace añadido a la pieza', drop: 'Suelta aquí las imágenes, el video, el PDF o el ZIP', upload: 'Subir archivos', link: 'Pegar enlace', add: 'Poner en la vista previa', cancel: 'Cancelar', ph: 'Enlace de Drive, Canva, Figma, YouTube…', removeV: 'Quitar el video', removeI: 'Quitar esta imagen', addMore: 'Añadir imágenes', reorder: 'Arrastra para cambiar el orden',
    note: 'Imagen, video, PDF (cada página se vuelve una diapositiva) o ZIP. Un enlace de carpeta o presentación de Drive también se vuelve vista previa.', linkNote: 'Este enlace aparece como tarjeta. Para ver la pieza aquí, sube las imágenes o el PDF, o pega el enlace de la carpeta de Drive.',
    none: 'Todavía sin arte', slidesAdded: n => `${n} ${n === 1 ? 'imagen entró' : 'imágenes entraron'} en la vista previa`, removedI: 'Imagen quitada de la vista previa', removedV: 'Video quitado de la vista previa',
    reading: n => `Leyendo ${n}`, page: (n, i, t) => `${n}: página ${i} de ${t}`, zipImg: (n, i, t) => `${n}: imagen ${i} de ${t}`, drive: 'Leyendo la carpeta de Drive', driveN: (i, t) => `Trayendo de Drive: archivo ${i} de ${t}`, drivePage: (i, t) => `Trayendo de Drive: página ${i} de ${t}`,
    offline: 'Para traer la pieza de Drive, abre el panel dentro de claude.ai. Aquí el enlace queda como tarjeta.', empty: 'No encontré imágenes en ese enlace. Si es la carpeta general, pega la carpeta de una sola publicación.', videoLink: 'Un video de Drive queda como enlace. Para verlo aquí, sube el archivo.', tooBig: 'El archivo es demasiado grande para traerlo aquí.',
    badType: n => `${n}: este tipo de archivo no entra en la vista previa`, badRead: n => `${n}: no se pudo leer`, noPages: n => `${n}: no se pudieron dibujar las páginas`, first20: (n, t) => `${n}: entraron las 20 primeras páginas de ${t}`, zipEmpty: n => `${n}: no tiene imágenes dentro` },
  fr: { hidden: n => `${n === 1 ? 'L’image reste enregistrée et revient' : `Les ${n} images restent enregistrées et reviennent`} si vous retirez la vidéo.`, linkAdded: 'Lien ajouté au contenu', drop: 'Déposez ici les images, la vidéo, le PDF ou le ZIP', upload: 'Importer des fichiers', link: 'Coller un lien', add: 'Mettre dans l’aperçu', cancel: 'Annuler', ph: 'Lien Drive, Canva, Figma, YouTube…', removeV: 'Retirer la vidéo', removeI: 'Retirer cette image', addMore: 'Ajouter des images', reorder: 'Glissez pour changer l’ordre',
    note: 'Image, vidéo, PDF (chaque page devient une diapositive) ou ZIP. Un lien de dossier ou de présentation Drive devient aussi un aperçu.', linkNote: 'Ce lien s’affiche comme une carte. Pour voir le contenu ici, importez les images ou le PDF, ou collez le lien du dossier Drive.',
    none: 'Pas encore de visuel', slidesAdded: n => `${n} ${n === 1 ? 'image ajoutée' : 'images ajoutées'} à l’aperçu`, removedI: 'Image retirée de l’aperçu', removedV: 'Vidéo retirée de l’aperçu',
    reading: n => `Lecture de ${n}`, page: (n, i, t) => `${n} : page ${i} sur ${t}`, zipImg: (n, i, t) => `${n} : image ${i} sur ${t}`, drive: 'Lecture du dossier Drive', driveN: (i, t) => `Import depuis Drive : fichier ${i} sur ${t}`, drivePage: (i, t) => `Import depuis Drive : page ${i} sur ${t}`,
    offline: 'Ouvrez l’espace dans claude.ai pour importer depuis Drive. Ici, le lien reste une carte.', empty: 'Aucune image à ce lien. S’il s’agit du dossier général, collez le dossier d’une seule publication.', videoLink: 'Une vidéo Drive reste un lien. Importez le fichier pour la regarder ici.', tooBig: 'Fichier trop lourd pour être importé ici.',
    badType: n => `${n} : ce type de fichier ne va pas dans l’aperçu`, badRead: n => `${n} : lecture impossible`, noPages: n => `${n} : impossible de dessiner les pages`, first20: (n, t) => `${n} : les 20 premières pages sur ${t} sont entrées`, zipEmpty: n => `${n} : aucune image dedans` },
};
function FormatPicker({ x, onPick, lang = 'pt' }) {
  const L = FMT_T[lang] || FMT_T.pt; const cur = fmtKey(x.format);
  return html`<div class="fmt-pick"><div class="fmt-row" role="group" aria-label=${L.label}><span class="label">${L.label}</span>
      ${PFMT.map(F => html`<button key=${F.k} type="button" class=${cx('fmt-chip', cur === F.k && 'on')} aria-pressed=${cur === F.k} title=${lang === 'pt' ? FMT_DESC[F.k] : L[F.k]} onClick=${() => onPick(F.k)}>${L[F.k]}<small>${F.tag}</small></button>`)}</div>
    ${lang === 'pt' && !cur && html`<p class="muted" style="font-size:12px">Escolha o formato, ou suba a arte: uma imagem vira Post, várias viram Carrossel e um vídeo vertical vira Reels.</p>`}
    ${lang === 'pt' && cur && x.fmtAuto && html`<p class="muted" style="font-size:12px">Formato escolhido pela arte que subiu. Clique em outro para trocar.</p>`}</div>`;
}

/* arquivos que viram a prévia: imagem, PDF, ZIP e vídeo */
const JSZIP = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
const b64ToBytes = s => { const bin = atob(s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; };
const b64Kind = s => (/^JVBER/.test(s) ? 'pdf' : /^iVBOR/.test(s) ? 'image/png' : /^\/9j\//.test(s) ? 'image/jpeg' : /^R0lGOD/.test(s) ? 'image/gif' : /^UklGR/.test(s) ? 'image/webp' : null);
async function shrinkSrc(src, max = 1400) {
  const img = await loadImg(src); const W = img.naturalWidth || 1, Hh = img.naturalHeight || 1; const k = Math.min(1, max / Math.max(W, Hh));
  const cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(W * k)); cv.height = Math.max(1, Math.round(Hh * k));
  const ctx = cv.getContext('2d'); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, cv.width, cv.height); ctx.drawImage(img, 0, 0, cv.width, cv.height);
  return cv.toDataURL('image/jpeg', .86);
}
async function pdfToSlides(data, onPage, max = 20, width = 960) {
  const { lib, worker } = await pdfSetup();
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data instanceof ArrayBuffer ? data : await data.arrayBuffer());
  const pdf = await lib.getDocument({ data: bytes, isEvalSupported: false, disableFontFace: true, ...(worker ? { worker } : {}) }).promise;
  const n = Math.min(pdf.numPages, max); const out = [];
  for (let i = 1; i <= n; i++) {
    onPage && onPage(i, n);
    const page = await pdf.getPage(i); const v0 = page.getViewport({ scale: 1 }); const vp = page.getViewport({ scale: Math.min(3, width / v0.width) });
    const cv = document.createElement('canvas'); cv.width = Math.max(1, Math.ceil(vp.width)); cv.height = Math.max(1, Math.ceil(vp.height));
    const ctx = cv.getContext('2d'); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, cv.width, cv.height);
    const task = page.render({ canvasContext: ctx, viewport: vp });
    const r = await withTimeout(task.promise.then(() => 'ok', () => 'err'), 30000, () => task.cancel());
    if (r === 'ok') out.push(cv.toDataURL('image/jpeg', .86));
  }
  return { slides: out, pages: pdf.numPages };
}
async function zipToSlides(file, onStep) {
  await loadScript(JSZIP); const zip = await window.JSZip.loadAsync(await file.arrayBuffer());
  const names = Object.keys(zip.files).filter(n => !zip.files[n].dir && /\.(png|jpe?g|webp|gif)$/i.test(n) && !/(^|\/)(__MACOSX|\._)/.test(n))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })).slice(0, 20);
  const out = [];
  for (let i = 0; i < names.length; i++) { onStep && onStep(i + 1, names.length); const url = URL.createObjectURL(await zip.files[names[i]].async('blob')); try { out.push(await shrinkSrc(url)); } finally { URL.revokeObjectURL(url); } }
  return out;
}
function videoInfo(url) {
  return new Promise(res => {
    let done = false; const fin = o => { if (!done) { done = true; res(o); } };
    const v = document.createElement('video'); v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = url;
    const base = () => ({ w: v.videoWidth || 0, h: v.videoHeight || 0, dur: isFinite(v.duration) ? v.duration : 0 });
    v.onloadedmetadata = () => { try { v.currentTime = Math.min(.5, (v.duration || 1) / 3); } catch (e) { fin({ ...base(), poster: null }); } };
    v.onseeked = () => { let poster = null; try { const k = Math.min(1, 720 / Math.max(v.videoWidth || 1, v.videoHeight || 1)); const cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(v.videoWidth * k)); cv.height = Math.max(1, Math.round(v.videoHeight * k)); cv.getContext('2d').drawImage(v, 0, 0, cv.width, cv.height); poster = cv.toDataURL('image/jpeg', .8); } catch (e) {} fin({ ...base(), poster }); };
    v.onerror = () => fin({ w: 0, h: 0, dur: 0, poster: null });
    setTimeout(() => fin({ ...base(), poster: null }), 8000);
  });
}
async function ingestFiles(act, k, id, list, say, T) {
  let n = 0; const errs = [];
  for (const f of list) {
    const nm = f.name || 'arquivo';
    try {
      if (/^image\//.test(f.type) || /\.(png|jpe?g|webp|gif|svg)$/i.test(nm)) { say(T.reading(nm)); const url = URL.createObjectURL(f); let src; try { src = await shrinkSrc(url); } finally { URL.revokeObjectURL(url); } act.mutItem(k, id, x => addImgs(x, [src])); n++; }
      else if (f.type === 'application/pdf' || /\.pdf$/i.test(nm)) {
        const r = await pdfToSlides(f, (i, t) => say(T.page(nm, i, t)));
        if (!r.slides.length) { errs.push(T.noPages(nm)); continue; }
        act.mutItem(k, id, x => { addImgs(x, r.slides); x.media = [...(x.media || []), { id: uid('m'), url: URL.createObjectURL(f), name: nm, kind: 'pdf' }]; }); n += r.slides.length;
        if (r.pages > 20) errs.push(T.first20(nm, r.pages));
      }
      else if (/zip/.test(f.type) || /\.zip$/i.test(nm)) { const L = await zipToSlides(f, (i, t) => say(T.zipImg(nm, i, t))); if (!L.length) errs.push(T.zipEmpty(nm)); else { act.mutItem(k, id, x => addImgs(x, L)); n += L.length; } }
      else if (/^video\//.test(f.type) || /\.(mp4|mov|webm|m4v)$/i.test(nm)) { say(T.reading(nm)); const url = URL.createObjectURL(f); const inf = await videoInfo(url); act.mutItem(k, id, x => { x.video = { url, name: nm, ...inf }; autoFmt(x); }); }
      else errs.push(T.badType(nm));
    } catch (e) { errs.push(T.badRead(nm)); }
  }
  say(''); return { n, errs };
}

/* link do Drive vira prévia pelo conector; no produto, o servidor faz isso para qualquer link */
function driveRef(url) {
  const u = String(url || ''); let m;
  if ((m = u.match(/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([\w-]+)/))) return { kind: 'folder', id: m[1] };
  if ((m = u.match(/docs\.google\.com\/presentation\/d\/([\w-]+)/))) return { kind: 'gslide', id: m[1] };
  if ((m = u.match(/docs\.google\.com\/document\/d\/([\w-]+)/))) return { kind: 'gdoc', id: m[1] };
  if ((m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/))) return { kind: 'file', id: m[1] };
  return null;
}
async function driveCall(tool, input) { const mcp = await cap('mcp'); if (!mcp) throw { code: 'capability_disabled' }; const r = await mcp.callTool(SRV.drive, tool, input); return r && r.payload; }
async function driveFileSlides(fileId, onPage, max = 20, width = 960) {
  const pl = await driveCall('download_file_content', { fileId, exportMimeType: 'application/pdf' });
  const s = pl && typeof pl.content === 'string' ? pl.content.replace(/\s+/g, '') : ''; const kind = b64Kind(s);
  if (kind === 'pdf') return (await pdfToSlides(b64ToBytes(s), onPage, max, width)).slides;
  if (kind) return [await shrinkSrc(`data:${kind};base64,${s}`, width === 960 ? 1400 : width)];
  return [];
}
async function driveSlides(url, say, T) {
  const ref = driveRef(url); if (!ref) return null;
  if (ref.kind === 'folder') {
    say(T.drive);
    const pl = await driveCall('search_files', { query: `parentId = '${ref.id}' and (mimeType contains 'image/' or mimeType = 'application/pdf' or mimeType = 'application/vnd.google-apps.presentation')`, pageSize: 40, excludeContentSnippets: true });
    const files = ((pl && pl.files) || []).sort((a, b) => String(a.title || '').localeCompare(String(b.title || ''), undefined, { numeric: true, sensitivity: 'base' }));
    const imgs = files.filter(f => /^image\//.test(f.mimeType || '')); const pick = imgs.length ? imgs.slice(0, 20) : files.slice(0, 1);
    const out = [];
    for (let i = 0; i < pick.length && out.length < 20; i++) { say(T.driveN(i + 1, pick.length)); out.push(...await driveFileSlides(pick[i].id, (a, b) => say(T.drivePage(a, b)))); }
    return out.slice(0, 20);
  }
  if (ref.kind === 'file') {
    const meta = await driveCall('get_file_metadata', { fileId: ref.id, excludeContentSnippets: true }).catch(() => null);
    if (meta && /^video\//.test(meta.mimeType || '')) return { video: true };
    if (meta && Number(meta.fileSize) > 25e6) throw { code: 'too_big' };
  }
  say(T.drivePage(1, 1));
  return await driveFileSlides(ref.id, (a, b) => say(T.drivePage(a, b)));
}
async function ingestLink(act, k, id, url, say, T, force) {
  act.mutItem(k, id, x => { if (!(x.media || []).some(m => m.url === url)) x.media = [...(x.media || []), { id: uid('m'), url }]; });
  if (!force) return {};
  if (!driveRef(url)) return { card: true };
  if (!(await cap('mcp'))) return { offline: true };
  try {
    const r = await driveSlides(url, say, T); say('');
    if (r && r.video) return { video: true }; if (!r || !r.length) return { empty: true };
    act.mutItem(k, id, x => addImgs(x, r)); return { n: r.length };
  } catch (e) { say(''); return { err: e && e.code === 'too_big' ? T.tooBig : mcpMsg(e, SRV.drive) }; }
}
const THUMBS = new Map();
function driveThumb(url) {
  if (THUMBS.has(url)) return THUMBS.get(url);
  const ref = driveRef(url);
  const p = (async () => {
    if (!ref || ref.kind === 'folder') return null;
    if (ref.kind === 'file') { const meta = await driveCall('get_file_metadata', { fileId: ref.id, excludeContentSnippets: true }).catch(() => null); if (meta && (/^video\//.test(meta.mimeType || '') || Number(meta.fileSize) > 25e6)) return null; }
    return (await driveFileSlides(ref.id, null, 1, 640))[0] || null;
  })();
  THUMBS.set(url, p); p.catch(() => THUMBS.delete(url)); return p;
}

/* a prévia da peça: moldura no formato, com imagens, vídeo ou link */
function PieceMedia({ k, x, edit, lang = 'pt' }) {
  const { act, toast } = useApp(); const T = PM[lang] || PM.pt;
  const [busy, setBusy] = useState(''); const [err, setErr] = useState(''); const [over, setOver] = useState(false);
  const [ask, setAsk] = useState(false); const [lv, setLv] = useState(''); const [cur, setCur] = useState(0); const [dragI, setDragI] = useState(null); const [overI, setOverI] = useState(null);
  const imgs = x.imgs || []; const vid = x.video; const r = pieceRatio(x); const rc = ratioCls(r); const S = { aspectRatio: String(r) };
  const link = !imgs.length && !vid ? (x.media || []).find(m => m.kind !== 'pdf') : null;
  const ci = Math.min(cur, Math.max(0, imgs.length - 1));
  const files = async list => { const fs = [...(list || [])]; if (!fs.length) return; setErr(''); const res = await ingestFiles(act, k, x.id, fs, setBusy, T); if (res.n) toast(T.slidesAdded(res.n)); if (res.errs.length) setErr(res.errs.join(' · ')); };
  const addLink = async e => { e.preventDefault(); let u = lv.trim(); if (!u) return; if (!/^https?:\/\//i.test(u)) u = 'https://' + u; setLv(''); setAsk(false); setErr('');
    const res = await ingestLink(act, k, x.id, u, setBusy, T, true); if (res.n) toast(T.slidesAdded(res.n)); else setErr(res.err || (res.offline ? T.offline : res.empty ? T.empty : res.video ? T.videoLink : '')); };
  const ACC = 'image/*,video/*,application/pdf,.zip,application/zip';
  const pickInp = acc => html`<input type="file" multiple class="sr" accept=${acc} onChange=${e => { const fs = [...(e.target.files || [])]; e.target.value = ''; files(fs); }} />`;
  const safe = edit && rc === 'r916' ? html`<span class="pv-safe t" aria-hidden="true"></span><span class="pv-safe b" aria-hidden="true"></span>` : null;
  let frame;
  if (vid) frame = html`<div class="slider pv-v" style=${S}><video src=${vid.url} poster=${vid.poster || null} controls playsinline preload="metadata"></video>${safe}</div>`;
  else if (imgs.length) frame = html`<${Slider} imgs=${imgs} title=${x.title} ratio=${r} idx=${ci} onIdx=${setCur} overlay=${safe} />`;
  else if (link) frame = html`<div class="slider pv-l" style=${S}><div class="pv-link"><${LinkPreview} url=${link.url} name=${link.name} kind=${link.kind} compact lang=${lang} />${edit && html`<p>${T.linkNote}</p>`}</div></div>`;
  else if (edit) frame = html`<div class="slider" style=${S}><label class=${cx('pv-drop', over && 'on')}><${Icon} n="image" s=${26} /><b>${T.drop}</b><span class="btn sm">${T.upload}</span>${pickInp(ACC)}</label></div>`;
  else frame = html`<div class="slider" style=${S}><div class="noart"><small>${T.none}</small><b>${x.title}</b><small>${fmtName(lang, x.format)}</small></div></div>`;
  if (!edit) return html`<div class=${cx('ap-media', rc)}>${frame}</div>`;
  const w = lang === 'pt' ? fmtWarn(x) : null;
  return html`<div class=${cx('pv-stage', rc, over && 'on')} onDragOver=${e => { if (e.dataTransfer && [...(e.dataTransfer.types || [])].includes('Files')) { e.preventDefault(); setOver(true); } }}
      onDragLeave=${e => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(false); }} onDrop=${e => { const fs = e.dataTransfer && e.dataTransfer.files; if (fs && fs.length) { e.preventDefault(); setOver(false); files(fs); } }}>
    ${frame}
    ${busy && html`<p class="pv-busy" role="status">${busy}…</p>`}
    ${imgs.length > 0 && !vid && html`<div class="pv-thumbs">${imgs.map((src, i) => html`<div key=${i + ':' + src.length} class=${cx('pv-th', i === ci && 'on', overI === i && dragI !== i && 'over')} draggable="true" title=${T.reorder}
        onDragStart=${e => { setDragI(i); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', 'slide:' + i); } catch (_) {} }} onDragEnd=${() => { setDragI(null); setOverI(null); }}
        onDragOver=${e => { if (dragI == null) return; e.preventDefault(); e.stopPropagation(); setOverI(i); }}
        onDrop=${e => { if (dragI == null) return; e.preventDefault(); e.stopPropagation(); const from = dragI; setDragI(null); setOverI(null); if (from !== i) { act.mutItem(k, x.id, y => { const L = [...(y.imgs || [])]; const [m] = L.splice(from, 1); L.splice(i, 0, m); y.imgs = L; }); setCur(i); } }}
        onClick=${() => setCur(i)}><img src=${src} alt=${'Slide ' + (i + 1)} /><span class="n">${i + 1}</span>
        <button class="x" aria-label=${T.removeI} title=${T.removeI} onClick=${e => { e.stopPropagation(); act.mutItem(k, x.id, y => { y.imgs = (y.imgs || []).filter((_, j) => j !== i); autoFmt(y); }, T.removedI); }}>×</button></div>`)}
      ${imgs.length < 20 && html`<label class="pv-th add" title=${T.addMore} aria-label=${T.addMore}><${Icon} n="plus" s=${16} />${pickInp('image/*,application/pdf,.zip,application/zip')}</label>`}</div>`}
    ${vid && imgs.length > 0 && html`<p class="pv-note">${T.hidden(imgs.length)}</p>`}
    ${!ask && html`<div class="pv-acts">${(imgs.length > 0 || vid || link) && html`<label class="btn sm"><${Icon} n="plus" s=${13} />${T.upload}${pickInp(ACC)}</label>`}
      <button class="btn sm" onClick=${() => setAsk(true)}><${Icon} n="link" s=${13} />${T.link}</button>
      ${vid && html`<button class="btn sm" onClick=${() => act.mutItem(k, x.id, y => { y.video = null; autoFmt(y); }, T.removedV)}><${Icon} n="trash" s=${13} />${T.removeV}</button>`}</div>`}
    ${ask && html`<form class="pv-linkin" onSubmit=${addLink}><label class="sr" for=${'pvl-' + x.id}>Link</label><input class="inp" id=${'pvl-' + x.id} ref=${autoF} placeholder=${T.ph} value=${lv} onInput=${e => setLv(e.target.value)} onKeyDown=${e => { if (e.key === 'Escape') { e.stopPropagation(); setAsk(false); } }} />
      <button class="btn sm" type="button" onClick=${() => setAsk(false)}>${T.cancel}</button><button class="btn sm pri" type="submit" disabled=${!lv.trim()}>${T.add}</button></form>`}
    ${err && html`<p class="pv-err">${err}</p>`}
    ${w && html`<div class="fmt-warn"><span>${w[0]}</span><button class="btn sm" onClick=${() => act.setItem(k, x.id, { format: w[1], fmtAuto: false }, 'Formato: ' + FMT_T.pt[w[1]])}>Trocar para ${FMT_T.pt[w[1]]}</button></div>`}
    <p class="pv-note">${T.note}</p>
  </div>`;
}

/* ================= v9: tema personalizado (o cliente escolhe cada cor, como no GoHighLevel) ================= */
const CSLOTS = [['side', 'base'], ['sideText', 'auto'], ['primary', 'base'], ['sideActive', 'adv'], ['bg', 'adv'], ['surface', 'adv'], ['text', 'adv']];
const mixHex = (a, b, t) => { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); };
const onDarkOf = bg => contrast('#FFFFFF', bg) >= contrast('#111111', bg);
const hexN = v => { const h = String(v || '').trim().replace(/^#/, ''); return /^[0-9a-f]{6}$/i.test(h) ? '#' + h.toUpperCase() : null; };
function parseColor(v) {
  const s = String(v || '').trim(); if (!s) return null; let m;
  if ((m = s.match(/^#?([0-9a-f]{3})$/i))) return '#' + m[1].split('').map(c => c + c).join('').toUpperCase();
  if ((m = s.match(/^#?([0-9a-f]{6})$/i))) return '#' + m[1].toUpperCase();
  if ((m = s.match(/^(?:rgba?\s*\(\s*)?(\d{1,3})\s*[,;\s]\s*(\d{1,3})\s*[,;\s]\s*(\d{1,3})(?:\s*[,;\s/]\s*[\d.]+%?)?\s*\)?$/i))) { const v3 = m.slice(1, 4).map(Number); if (v3.every(x => x <= 255)) return rgb2hex(...v3); }
  return null;
}
function customTheme(cu) {
  const V = k => hexN(cu && cu[k]);
  const side = V('side') || '#222831'; const primary = V('primary') || side;
  const [ph, ps] = rgb2hsl(...hex2rgb(primary)); const s = Math.min(ps, 40);
  const bg = V('bg') || hsl2hex(ph, s * .22, 97); const dark = onDarkOf(bg); const dir = dark ? 1 : -1;
  const surface = V('surface') || mixHex(bg, '#FFFFFF', dark ? .05 : .7);
  const surface2 = mixHex(bg, dark ? '#FFFFFF' : '#000000', dark ? .1 : .045);
  const text = V('text') || nudge(dark ? hsl2hex(ph, Math.min(s, 20), 94) : hsl2hex(ph, Math.min(s, 30) * .6, 13), surface2, 7, dir);
  const text2 = nudge(mixHex(text, surface2, .22), surface2, 7, dir);
  const text3 = nudge(mixHex(text, surface2, .42), surface2, 4.6, dir);
  const sd = onDarkOf(side); const sdir = sd ? 1 : -1; const ink = sd ? '#FFFFFF' : '#000000';
  const sideText = V('sideText') || nudge(mixHex(side, ink, .8), side, 4.6, sdir);
  const strong = V('sideText') || nudge(mixHex(side, ink, .94), side, 7, sdir);
  const active = V('sideActive') || mixHex(side, ink, sd ? .13 : .08);
  const badgeBg = contrast(primary, side) >= 2 ? primary : strong;
  return { name: 'Personalizado', mode: dark ? 'dark' : 'light', custom: true, bg, surface, surface2, line: mixHex(bg, text, dark ? .13 : .1), lineStrong: mixHex(bg, text, dark ? .24 : .18),
    text, text2, text3, primary, onPrimary: onDarkOf(primary) ? '#FFFFFF' : '#111111', accent: primary,
    side: SD(side, sideText, strong, mixHex(side, active, .55), active, mixHex(side, sideText, .13), mixHex(side, sideText, .26), nudge(mixHex(sideText, side, .3), side, 4.5, sdir), badgeBg, onDarkOf(badgeBg) ? '#FFFFFF' : '#111111', [strong, side, strong]) };
}
function customChecks(cu, th) {
  const out = []; const chk = (a, b, min, key, slot) => { const r = contrast(a, b); if (r < min) out.push({ key, r, slot }); };
  chk(th.side.text, th.side.bg, 4.5, 'sideText', 'sideText');
  chk(th.side.strong, th.side.active, 4.5, 'active', 'sideActive');
  chk(th.text, th.bg, 4.5, 'text', 'text');
  chk(th.text, th.surface, 4.5, 'card', hexN(cu && cu.surface) ? 'surface' : 'text');
  chk(th.primary, th.bg, 3, 'primary', 'primary');
  return out;
}
function autoSlots(hexes) {
  const L = [...new Set((hexes || []).map(hexN).filter(Boolean))]; if (!L.length) return null;
  const I = L.map(h => { const [, s, l] = rgb2hsl(...hex2rgb(h)); return { h, s, l, lum: relLum(h) }; });
  const darks = I.filter(c => c.lum < .07).sort((a, b) => a.lum - b.lum);
  const vivid = I.filter(c => c.s > 25 && c.l > 18 && c.l < 72).sort((a, b) => b.s - a.s);
  const light = I.find(c => c.l > 88 && c.l < 99 && c.s < 70);
  const side = darks[0] ? darks[0].h : vivid[0] ? vivid[0].h : I[0].h;
  const acc = vivid.find(c => c.h !== side);
  return { side, sideText: null, primary: acc ? acc.h : side, sideActive: null, bg: light ? light.h : null, surface: null, text: null };
}
const seedSlots = th => ({ side: th.side ? th.side.bg : th.surface2, sideText: null, primary: th.primary, sideActive: null, bg: th.bg, surface: null, text: null });
const CS = {
  pt: { ready: 'Modelos prontos', custom: 'Personalizado', customSub: 'Suba a identidade visual e a gente distribui as cores, ou escolha cada cor. Pode digitar o código (#1E90FF) ou o RGB (30, 144, 255).',
    slots: { side: ['Fundo da barra lateral', 'o menu da esquerda'], sideText: ['Texto e ícones da barra', 'os nomes das abas'], primary: ['Cor de destaque', 'botões, links e seleção'], sideActive: ['Item selecionado da barra', 'a aba aberta'], bg: ['Fundo da página', 'atrás de tudo'], surface: ['Cartões', 'caixas e janelas'], text: ['Texto da página', 'títulos e parágrafos'] },
    auto: 'automático, pelo contraste', more: 'Ajustar mais cores', less: 'Mostrar menos cores', backAuto: 'Voltar ao automático', brand: 'Cores da marca', noBrand: 'Suba a identidade visual para as cores da marca aparecerem aqui.', other: 'Outra cor', invalid: 'Não entendi essa cor. Use #1E90FF ou 30, 144, 255.', fix: 'Corrigir', choose: c => `Escolher a cor: ${c}`, min: m => (m === 3 ? '3:1' : '4,5:1'),
    warn: { sideText: 'O texto da barra está difícil de ler sobre o fundo dela', active: 'A aba selecionada está difícil de ler', text: 'O texto está difícil de ler sobre o fundo da página', card: 'O texto está difícil de ler dentro dos cartões', primary: 'Os botões quase somem sobre o fundo da página' }, minW: 'o mínimo é', allOk: 'Todas as combinações passam no teste de leitura.' },
  en: { ready: 'Ready-made themes', custom: 'Custom', customSub: 'Upload your brand guidelines and we place the colors for you, or choose each color. Type the code (#1E90FF) or the RGB (30, 144, 255).',
    slots: { side: ['Sidebar background', 'the menu on the left'], sideText: ['Sidebar text and icons', 'the tab names'], primary: ['Accent color', 'buttons, links and selection'], sideActive: ['Selected sidebar item', 'the open tab'], bg: ['Page background', 'behind everything'], surface: ['Cards', 'boxes and panels'], text: ['Page text', 'headings and paragraphs'] },
    auto: 'automatic, for contrast', more: 'Adjust more colors', less: 'Show fewer colors', backAuto: 'Back to automatic', brand: 'Brand colors', noBrand: 'Upload your brand guidelines and your colors show up here.', other: 'Other color', invalid: "That color didn't read. Use #1E90FF or 30, 144, 255.", fix: 'Fix', choose: c => `Choose the color: ${c}`, min: m => (m === 3 ? '3:1' : '4.5:1'),
    warn: { sideText: 'Sidebar text is hard to read on its background', active: 'The selected tab is hard to read', text: 'Text is hard to read on the page background', card: 'Text is hard to read inside cards', primary: 'Buttons barely show on the page background' }, minW: 'the minimum is', allOk: 'Every color pair passes the readability check.' },
  es: { ready: 'Temas listos', custom: 'Personalizado', customSub: 'Sube tu identidad visual y repartimos los colores por ti, o elige cada color. Escribe el código (#1E90FF) o el RGB (30, 144, 255).',
    slots: { side: ['Fondo de la barra lateral', 'el menú de la izquierda'], sideText: ['Texto e íconos de la barra', 'los nombres de las pestañas'], primary: ['Color de acento', 'botones, enlaces y selección'], sideActive: ['Elemento seleccionado de la barra', 'la pestaña abierta'], bg: ['Fondo de la página', 'detrás de todo'], surface: ['Tarjetas', 'cajas y ventanas'], text: ['Texto de la página', 'títulos y párrafos'] },
    auto: 'automático, por contraste', more: 'Ajustar más colores', less: 'Mostrar menos colores', backAuto: 'Volver a automático', brand: 'Colores de la marca', noBrand: 'Sube tu identidad visual y los colores de tu marca aparecen aquí.', other: 'Otro color', invalid: 'No entendí ese color. Usa #1E90FF o 30, 144, 255.', fix: 'Corregir', choose: c => `Elegir el color: ${c}`, min: m => (m === 3 ? '3:1' : '4,5:1'),
    warn: { sideText: 'El texto de la barra se lee mal sobre su fondo', active: 'La pestaña seleccionada se lee mal', text: 'El texto se lee mal sobre el fondo de la página', card: 'El texto se lee mal dentro de las tarjetas', primary: 'Los botones casi desaparecen sobre el fondo de la página' }, minW: 'el mínimo es', allOk: 'Todas las combinaciones pasan la prueba de lectura.' },
  fr: { ready: 'Thèmes prêts', custom: 'Personnalisé', customSub: 'Importez votre charte et nous répartissons les couleurs pour vous, ou choisissez chaque couleur. Saisissez le code (#1E90FF) ou le RVB (30, 144, 255).',
    slots: { side: ['Fond de la barre latérale', 'le menu à gauche'], sideText: ['Texte et icônes de la barre', 'les noms des onglets'], primary: ['Couleur d’accent', 'boutons, liens et sélection'], sideActive: ['Élément sélectionné de la barre', 'l’onglet ouvert'], bg: ['Fond de la page', 'derrière tout'], surface: ['Cartes', 'encadrés et fenêtres'], text: ['Texte de la page', 'titres et paragraphes'] },
    auto: 'automatique, selon le contraste', more: 'Ajuster plus de couleurs', less: 'Afficher moins de couleurs', backAuto: 'Revenir à l’automatique', brand: 'Couleurs de la marque', noBrand: 'Importez votre charte et vos couleurs apparaîtront ici.', other: 'Autre couleur', invalid: 'Couleur non reconnue. Utilisez #1E90FF ou 30, 144, 255.', fix: 'Corriger', choose: c => `Choisir la couleur : ${c}`, min: m => (m === 3 ? '3:1' : '4,5:1'),
    warn: { sideText: 'Le texte de la barre est peu lisible sur son fond', active: 'L’onglet sélectionné est peu lisible', text: 'Le texte est peu lisible sur le fond de la page', card: 'Le texte est peu lisible dans les cartes', primary: 'Les boutons se voient à peine sur le fond de la page' }, minW: 'le minimum est', allOk: 'Toutes les combinaisons passent le test de lisibilité.' },
};
Object.assign(BT.pt, { apply: 'Distribuir estas cores no tema', idvBtn: 'Subir identidade visual', appliedCustom: 'Cores da marca distribuídas no tema personalizado. Ajuste o que quiser.' });
Object.assign(BT.en, { apply: 'Use these colors in the theme', idvBtn: 'Upload brand guidelines', appliedCustom: 'Brand colors placed in your custom theme. Adjust anything you like.' });
Object.assign(BT.es, { apply: 'Usar estos colores en el tema', idvBtn: 'Subir identidad visual', appliedCustom: 'Colores de la marca repartidos en el tema personalizado. Ajusta lo que quieras.' });
Object.assign(BT.fr, { apply: 'Utiliser ces couleurs dans le thème', idvBtn: 'Importer la charte', appliedCustom: 'Couleurs de la marque réparties dans le thème personnalisé. Ajustez ce que vous voulez.' });

function IdvReader({ lang = 'pt', onApply, compact }) {
  const t = BT[lang] || BT.pt; const [busy, setBusy] = useState(''); const [found, setFound] = useState(null); const [drag, setDrag] = useState(false);
  const read = async files => { if (!files || !files.length) return; setFound(null); const r = await readBrandFiles([...files], name => setBusy(name)); setBusy(''); setFound(r); };
  const inp = html`<input type="file" multiple accept="application/pdf,image/png,image/jpeg,image/webp,image/svg+xml" class="sr" onChange=${e => { read(e.target.files); e.target.value = ''; }} />`;
  return html`<div class="idv">
    ${compact ? html`<label class="btn sm idv-btn"><${Icon} n="image" s=${14} />${busy ? `${t.reading} ${busy}…` : t.idvBtn}${inp}</label>`
      : html`<label class=${cx('drop', drag && 'on')} onDragOver=${e => { e.preventDefault(); setDrag(true); }} onDragLeave=${() => setDrag(false)} onDrop=${e => { e.preventDefault(); setDrag(false); read(e.dataTransfer.files); }}>
          <${Icon} n="image" s=${22} /><span>${busy ? `${t.reading} ${busy}…` : t.drop}</span><small class="muted">PDF · PNG · JPG · SVG</small>${inp}</label>`}
    ${found && html`<div class="found"><b>${t.found}</b>
      ${found.colors.length || found.fonts.length ? html`
        <div class="sw-row">${found.colors.map(x => html`<span key=${x.hex} class="sw-lg" title=${`${x.hex} · ${x.src === 'text' ? t.inText : t.inImg}`}><i style=${{ background: x.hex }}></i><span class="mono">${x.hex}</span>${x.src === 'text' && html`<small>${t.inText}</small>`}</span>`)}</div>
        ${found.fonts.length > 0 && html`<p style="font-size:13px">${t.fonts}: <b>${found.fonts.join(', ')}</b></p>`}
        <button class="btn pri" onClick=${() => { onApply(found); setFound(null); }}><${Icon} n="sparkle" s=${14} />${t.apply}</button>` : html`<p class="muted">${t.none}</p>`}
      ${found.heavy && found.heavy.length > 0 && html`<p class="be-warn">${found.heavy.join(', ')}: ${t.heavy}</p>`}
      ${found.fails.length > 0 && html`<p class="err">${t.fail}: ${found.fails.join(', ')}</p>`}</div>`}
  </div>`;
}
function CustomEditor({ value, onChange, palette = [], lang = 'pt' }) {
  const C = CS[lang] || CS.pt; const cu = value || {}; const th = customTheme(cu);
  const shown = { side: th.side.bg, sideText: th.side.text, primary: th.primary, sideActive: th.side.active, bg: th.bg, surface: th.surface, text: th.text };
  const [open, setOpen] = useState(null); const [drafts, setDrafts] = useState({}); const [bad, setBad] = useState({});
  const [more, setMore] = useState(() => ['sideActive', 'bg', 'surface', 'text'].some(k => hexN(cu[k])));
  useEffect(() => { if (!open) return; const h = e => { if (!e.target.closest || !e.target.closest('.ct-row')) setOpen(null); }; document.addEventListener('pointerdown', h); return () => document.removeEventListener('pointerdown', h); }, [open]);
  const set = patch => onChange({ ...cu, ...patch });
  const commit = (k, raw, canAuto) => {
    const clear = () => { setBad(b => ({ ...b, [k]: false })); setDrafts(d => ({ ...d, [k]: undefined })); };
    if (!String(raw).trim()) { clear(); if (canAuto) set({ [k]: null }); return; }
    const c = parseColor(raw); if (!c) { setBad(b => ({ ...b, [k]: true })); return; }
    clear(); if (c !== hexN(cu[k])) set({ [k]: c });
  };
  const fmtR = r => new Intl.NumberFormat(LOC(lang), { maximumFractionDigits: 1 }).format(r);
  const warns = customChecks(cu, th);
  const fix = w => { if (w.slot === 'primary') set({ primary: nudge(th.primary, th.bg, 3.1, th.mode === 'dark' ? 1 : -1) }); else if (hexN(cu[w.slot])) set({ [w.slot]: null }); else if (w.key === 'active') set({ sideText: nudge(th.side.strong, th.side.active, 4.6, onDarkOf(th.side.active) ? 1 : -1) }); else set({ [w.slot]: null }); };
  const Row = ([k, grp]) => {
    const manual = !!hexN(cu[k]); const canAuto = grp !== 'base'; const [lab, sub] = C.slots[k];
    return html`<div class="ct-row" key=${k}>
      <button type="button" class="ct-sw" style=${{ background: shown[k] }} aria-label=${C.choose(lab)} title=${C.choose(lab)} aria-expanded=${open === k} onClick=${() => setOpen(open === k ? null : k)}></button>
      <span class="ct-lab"><b>${lab}</b><small>${manual || !canAuto ? sub : C.auto}</small></span>
      <input class=${cx('inp ct-hex', bad[k] && 'bad')} id=${'ct-' + k} aria-label=${lab} spellcheck="false" autocomplete="off" value=${drafts[k] != null ? drafts[k] : manual || !canAuto ? shown[k] : ''} placeholder=${shown[k]}
        onInput=${e => { const v = e.target.value; setDrafts(d => ({ ...d, [k]: v })); }} onBlur=${e => commit(k, e.target.value, canAuto)} onKeyDown=${e => { if (e.key === 'Enter') { e.preventDefault(); commit(k, e.target.value, canAuto); } }} />
      ${bad[k] && html`<span class="ct-err">${C.invalid}</span>`}
      ${open === k && html`<div class="ct-pop" role="dialog" aria-label=${lab}>
        <span class="label">${C.brand}</span>
        ${palette.length ? html`<div class="ct-chips">${palette.map(h => html`<button type="button" key=${h} class=${cx('ct-chip', shown[k] === h && 'on')} style=${{ background: h }} title=${h} aria-label=${h} onClick=${() => { set({ [k]: h }); setOpen(null); }}></button>`)}</div>` : html`<p class="muted" style="font-size:12px">${C.noBrand}</p>`}
        <div class="ct-pop-acts"><label class="btn sm"><${Icon} n="sliders" s=${13} />${C.other}<input type="color" class="sr" value=${shown[k]} onChange=${e => { set({ [k]: e.target.value.toUpperCase() }); setOpen(null); }} /></label>
          ${canAuto && manual && html`<button type="button" class="btn sm ghost" onClick=${() => { set({ [k]: null }); setOpen(null); }}>${C.backAuto}</button>`}</div></div>`}
    </div>`;
  };
  return html`<div class="ct-ed">
    <div class="ct-list">${CSLOTS.filter(([, g]) => g !== 'adv').map(Row)}${more && CSLOTS.filter(([, g]) => g === 'adv').map(Row)}</div>
    <button type="button" class="linkbtn ct-more" onClick=${() => setMore(!more)}>${more ? C.less : C.more}</button>
    ${warns.length ? warns.map(w => html`<div class="ct-warn" key=${w.key}><span>${C.warn[w.key]} (${fmtR(w.r)}:1; ${C.minW} ${C.min(w.key === 'primary' ? 3 : 4.5)}).</span><button type="button" class="btn sm" onClick=${() => fix(w)}>${C.fix}</button></div>`) : html`<p class="ct-ok">${C.allOk}</p>`}
  </div>`;
}
