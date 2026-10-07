import { useState, useRef, type FC, type FormEvent } from "react";
import toast from "react-hot-toast";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineX,
  HiOutlineFilm,
} from "react-icons/hi";
import { useSlides, fallbackSlides, type SlideInput } from "../hooks/useSlides";
import { compressImage, readFileAsDataURL } from "../utils/media";
import { SlideMedia } from "./HeroSlider";
import type { Slide, SlideTransition } from "../types";

const MAX_VIDEO_SIZE = 8 * 1024 * 1024; // 8 MB (stockée dans la base)
const MAX_FILE_SIZE = 15 * 1024 * 1024;

const toastStyle = { borderRadius: "0", fontSize: "12px" };
const okStyle = { background: "#19110b", color: "#fff", borderRadius: "0", fontSize: "12px" };

const TRANSITIONS: { value: SlideTransition; label: string }[] = [
  { value: "fade", label: "Fondu" },
  { value: "slide", label: "Glissement" },
  { value: "zoom", label: "Zoom" },
  { value: "none", label: "Aucune" },
];

const emptySlide: SlideInput = {
  mediaType: "image",
  media: "",
  poster: "",
  eyebrow: "Collection Exclusive",
  title: "",
  subtitle: "",
  cta: "Découvrir la collection",
  link: "#produits",
  duration: 8,
  transition: "fade",
  active: true,
};

const isVideoUrl = (url: string) => /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url) || url.startsWith("data:video");

const inputCls =
  "w-full border-b border-[#e8e8e8] py-2.5 text-[14px] text-[#19110b] font-light bg-transparent outline-none focus:border-[#19110b] transition-colors placeholder:text-[#d0d0d0]";
const labelCls = "block text-[10px] tracking-[0.15em] uppercase text-[#757575] mb-2";

const HeroManager: FC = () => {
  const { slides, loading, fromServer, addSlide, updateSlide, deleteSlide, reorderSlides } = useSlides(true);
  const [form, setForm] = useState<SlideInput>(emptySlide);
  const [editId, setEditId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fail = (e: unknown, fallback: string) =>
    toast.error(e instanceof Error ? e.message : fallback, { style: toastStyle });

  const openNew = () => { setForm(emptySlide); setEditId(null); setMediaUrl(""); setEditing(true); };
  const openEdit = (s: Slide) => {
    const { id, order, ...rest } = s;
    void order;
    setForm(rest);
    setEditId(id);
    setMediaUrl("");
    setEditing(true);
  };
  const close = () => { setEditing(false); setEditId(null); setForm(emptySlide); };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    if (!isVideo && !file.type.startsWith("image/")) {
      toast.error("Choisissez une image ou une vidéo", { style: toastStyle });
      return;
    }
    if (file.size > (isVideo ? MAX_VIDEO_SIZE : MAX_FILE_SIZE)) {
      toast.error(
        isVideo
          ? `Vidéo trop lourde (${(file.size / 1024 / 1024).toFixed(1)} Mo). Max 8 Mo — sinon collez un lien (URL) de la vidéo.`
          : "Image trop volumineuse (max 15 Mo)",
        { style: toastStyle }
      );
      return;
    }
    setBusy(true);
    try {
      const data = isVideo ? await readFileAsDataURL(file) : await compressImage(file, 1920, 0.8);
      setForm((p) => ({ ...p, media: data, mediaType: isVideo ? "video" : "image" }));
    } catch {
      toast.error("Impossible de lire le fichier", { style: toastStyle });
    } finally {
      setBusy(false);
    }
  };

  const applyUrl = () => {
    const url = mediaUrl.trim();
    if (!url) return;
    setForm((p) => ({ ...p, media: url, mediaType: isVideoUrl(url) ? "video" : "image" }));
    setMediaUrl("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.media) {
      toast.error("Ajoutez une image ou une vidéo", { style: toastStyle });
      return;
    }
    setSubmitting(true);
    try {
      if (editId) await updateSlide(editId, form);
      else await addSlide(form);
      toast.success(editId ? "Slide modifié" : "Slide ajouté", { style: okStyle });
      close();
    } catch (err) {
      fail(err, "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    const ids = slides.map((s) => s.id);
    [ids[i], ids[j]] = [ids[j], ids[i]];
    try { await reorderSlides(ids); } catch (err) { fail(err, "Erreur"); }
  };

  const toggleActive = async (s: Slide) => {
    try {
      await updateSlide(s.id, { active: !s.active });
      toast.success(s.active ? "Slide masqué" : "Slide affiché", { style: okStyle });
    } catch (err) { fail(err, "Erreur"); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSlide(deleteId);
      toast.success("Slide supprimé", { style: okStyle });
    } catch (err) { fail(err, "Erreur lors de la suppression"); }
    setDeleteId(null);
  };

  const importDefaults = async () => {
    setBusy(true);
    try {
      for (const s of fallbackSlides) {
        const { id, order, ...rest } = s;
        void id; void order;
        await addSlide(rest);
      }
      toast.success("Slides par défaut importés — vous pouvez les modifier", { style: okStyle });
    } catch (err) { fail(err, "Erreur d'import"); }
    finally { setBusy(false); }
  };

  /* ───────── FORMULAIRE ───────── */
  if (editing) {
    const preview: Slide = { ...form, id: "preview", order: 0 };
    return (
      <div className="max-w-[800px]">
        <h2 className="text-[11px] tracking-[0.2em] uppercase text-[#19110b] font-medium mb-6">
          {editId ? "Modifier le slide" : "Nouveau slide"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white border border-[#e8e8e8] p-4 sm:p-6">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#757575] font-medium mb-4">Image ou vidéo de fond</p>

            {form.media ? (
              <div className="relative aspect-[16/10] sm:aspect-[16/7] bg-[#19110b] overflow-hidden mb-3">
                <SlideMedia slide={preview} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                <div className="absolute bottom-3 left-3 right-12 text-white">
                  <p className="text-[8px] tracking-[0.25em] uppercase text-white/70">{form.eyebrow}</p>
                  <p className="text-[16px] sm:text-[20px] font-light leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {form.title || "Titre du slide"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, media: "", mediaType: "image" }))}
                  aria-label="Supprimer le média"
                  className="absolute top-2 right-2 w-9 h-9 bg-red-600 text-white shadow flex items-center justify-center active:bg-red-700"
                >
                  <HiOutlineTrash size={18} />
                </button>
                <span className="absolute top-2 left-2 text-[9px] tracking-[0.1em] uppercase bg-[#c5a467] text-white px-2 py-0.5">
                  {form.mediaType === "video" ? "Vidéo" : "Image"}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="w-full aspect-[16/8] border-2 border-dashed border-[#e0e0e0] flex flex-col items-center justify-center gap-2 hover:border-[#19110b] transition-colors mb-3 disabled:opacity-50"
              >
                <HiOutlineFilm size={26} className="text-[#c0c0c0]" />
                <span className="text-[10px] tracking-[0.1em] uppercase text-[#757575]">
                  {busy ? "Chargement..." : "Choisir une image ou une vidéo"}
                </span>
              </button>
            )}
            {form.media && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="text-[10px] tracking-[0.1em] uppercase text-[#19110b] border border-[#19110b] px-3 py-2 mb-3 active:bg-[#19110b] active:text-white"
              >
                {busy ? "Chargement..." : "Remplacer le média"}
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" />

            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <p className="text-[11px] text-[#757575] font-light mb-1.5">Ou coller un lien (image ou vidéo .mp4) :</p>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyUrl(); } }}
                  placeholder="https://..."
                  className={inputCls}
                />
              </div>
              <button
                type="button"
                onClick={applyUrl}
                disabled={!mediaUrl.trim()}
                className="text-[10px] tracking-[0.1em] uppercase text-[#19110b] border border-[#19110b] px-3 py-2 disabled:opacity-30 mb-[1px]"
              >
                OK
              </button>
            </div>
            <p className="text-[10px] text-[#757575] font-light mt-3">
              Vidéo : 8 Mo max en téléversement (lecture muette en boucle). Pour une vidéo plus lourde, utilisez un lien direct.
            </p>
          </div>

          <div className="bg-white border border-[#e8e8e8] p-4 sm:p-6 space-y-4">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#757575] font-medium">Textes</p>
            <div>
              <label className={labelCls}>Sur-titre</label>
              <input className={inputCls} value={form.eyebrow} onChange={(e) => setForm((p) => ({ ...p, eyebrow: e.target.value }))} placeholder="Collection Exclusive" />
            </div>
            <div>
              <label className={labelCls}>Titre</label>
              <input className={inputCls} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Collection Bandoulière Wax" />
            </div>
            <div>
              <label className={labelCls}>Sous-titre</label>
              <input className={inputCls} value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} placeholder="L'élégance africaine redéfinie" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className={labelCls}>Texte du bouton (vide = pas de bouton)</label>
                <input className={inputCls} value={form.cta} onChange={(e) => setForm((p) => ({ ...p, cta: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Lien du bouton</label>
                <input className={inputCls} value={form.link} onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} placeholder="#produits ou /category/..." />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e8e8e8] p-4 sm:p-6">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#757575] font-medium mb-4">Animation</p>
            <div className="mb-4">
              <label className={labelCls}>Transition vers ce slide</label>
              <div className="flex flex-wrap gap-2">
                {TRANSITIONS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, transition: t.value }))}
                    className={`px-4 h-10 text-[11px] tracking-[0.05em] border transition-colors ${
                      form.transition === t.value ? "bg-[#19110b] text-white border-[#19110b]" : "bg-white text-[#757575] border-[#e8e8e8]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Durée d'affichage : {form.duration} s</label>
              <input
                type="range"
                min={3}
                max={30}
                value={form.duration}
                onChange={(e) => setForm((p) => ({ ...p, duration: Number(e.target.value) }))}
                className="w-full accent-[#19110b]"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer mt-5">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} className="w-4 h-4 accent-[#19110b]" />
              <span className="text-[13px] text-[#19110b]">Afficher ce slide sur l'accueil</span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting || busy}
              className="bg-[#19110b] text-white text-[11px] tracking-[0.15em] uppercase px-8 py-3.5 hover:bg-[#6b4c3b] transition-colors disabled:opacity-60"
            >
              {submitting ? "Enregistrement..." : editId ? "Enregistrer les modifications" : "Ajouter le slide"}
            </button>
            <button type="button" onClick={close} className="text-[11px] tracking-[0.15em] uppercase text-[#757575] px-8 py-3.5 border border-[#e8e8e8]">
              Annuler
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* ───────── LISTE ───────── */
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <p className="text-[12px] text-[#757575] font-light">
          {slides.length} slide(s) · ils défilent sur l'accueil dans cet ordre.
        </p>
        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 bg-[#19110b] text-white text-[11px] tracking-[0.15em] uppercase px-5 py-3 hover:bg-[#6b4c3b] transition-colors"
        >
          <HiOutlinePlus size={15} /> Ajouter un slide
        </button>
      </div>

      {!loading && (!fromServer || slides.length === 0) && (
        <div className="bg-white border border-[#e8e8e8] p-5 mb-5">
          <p className="text-[13px] text-[#19110b] mb-1">
            {fromServer ? "Aucun slide personnalisé." : "Serveur injoignable pour le moment."}
          </p>
          <p className="text-[12px] text-[#757575] font-light mb-3">
            L'accueil affiche les 6 visuels d'origine. Importez-les pour pouvoir les modifier, les réordonner ou les supprimer.
          </p>
          {fromServer && (
            <button onClick={importDefaults} disabled={busy} className="text-[10px] tracking-[0.1em] uppercase text-[#19110b] border border-[#19110b] px-4 py-2.5 disabled:opacity-40">
              {busy ? "Import..." : "Importer les 6 slides d'origine"}
            </button>
          )}
        </div>
      )}

      <div className="space-y-3">
        {slides.map((s, i) => (
          <div key={s.id} className={`bg-white border border-[#e8e8e8] p-3 sm:p-4 flex gap-3 ${s.active ? "" : "opacity-60"}`}>
            <div className="relative w-24 h-20 sm:w-40 sm:h-24 bg-[#19110b] overflow-hidden shrink-0">
              {s.mediaType === "video" ? (
                <video src={s.media} poster={s.poster || undefined} muted playsInline preload="metadata" className="w-full h-full object-cover" />
              ) : (
                <img src={s.media} alt={s.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              )}
              <span className="absolute top-1 left-1 text-[8px] uppercase bg-[#19110b]/80 text-white px-1.5 py-0.5">
                {i + 1} · {s.mediaType === "video" ? "Vidéo" : "Image"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[#19110b] font-medium truncate">{s.title || "(sans titre)"}</p>
              <p className="text-[11px] text-[#757575] font-light truncate">{s.subtitle}</p>
              <p className="text-[10px] text-[#757575] mt-1.5">
                {TRANSITIONS.find((t) => t.value === s.transition)?.label} · {s.duration}s{!s.active && " · masqué"}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter" className="w-9 h-9 flex items-center justify-center border border-[#e8e8e8] text-[#19110b] disabled:opacity-30 active:bg-[#f0f0f0]">
                  <HiOutlineArrowUp size={16} />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === slides.length - 1} aria-label="Descendre" className="w-9 h-9 flex items-center justify-center border border-[#e8e8e8] text-[#19110b] disabled:opacity-30 active:bg-[#f0f0f0]">
                  <HiOutlineArrowDown size={16} />
                </button>
                <button onClick={() => toggleActive(s)} aria-label={s.active ? "Masquer" : "Afficher"} className="w-9 h-9 flex items-center justify-center border border-[#e8e8e8] text-[#757575] active:bg-[#f0f0f0]">
                  {s.active ? <HiOutlineEye size={16} /> : <HiOutlineEyeOff size={16} />}
                </button>
                <button onClick={() => openEdit(s)} aria-label="Modifier" className="w-9 h-9 flex items-center justify-center border border-[#19110b] text-[#19110b] active:bg-[#f0f0f0]">
                  <HiOutlinePencil size={16} />
                </button>
                <button onClick={() => setDeleteId(s.id)} aria-label="Supprimer" className="w-9 h-9 flex items-center justify-center border border-red-200 text-red-600 active:bg-red-50">
                  <HiOutlineTrash size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white p-6 sm:p-8 max-w-sm w-full text-center">
            <button onClick={() => setDeleteId(null)} aria-label="Fermer" className="absolute top-3 right-3 text-[#757575]"><HiOutlineX size={18} /></button>
            <p className="text-[15px] text-[#19110b] font-light mb-2">Supprimer ce slide ?</p>
            <p className="text-[12px] text-[#757575] font-light mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={confirmDelete} className="bg-red-600 text-white text-[11px] tracking-[0.1em] uppercase px-6 py-2.5">Supprimer</button>
              <button onClick={() => setDeleteId(null)} className="border border-[#e8e8e8] text-[11px] tracking-[0.1em] uppercase text-[#757575] px-6 py-2.5">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroManager;
