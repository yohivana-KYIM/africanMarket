import { useState, useEffect, useCallback } from "react";
import type { Slide } from "../types";
import { heroSlides as defaultSlides } from "../data/products";
import environment from "../environment";

const API = `${environment.API_URL}/api/slides`;

const authHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  try {
    const stored = localStorage.getItem("africanmarket_user");
    const token = stored ? JSON.parse(stored).token : null;
    if (token) headers["Authorization"] = `Bearer ${token}`;
  } catch { /* ignore */ }
  return headers;
};

const apiError = async (res: Response, fallback: string): Promise<Error> => {
  if (res.status === 401) return new Error("Session expirée, reconnectez-vous");
  if (res.status === 413) return new Error("Fichier trop volumineux pour le serveur");
  const err = await res.json().catch(() => ({}));
  return new Error(err.message || fallback);
};

export const mapSlide = (doc: any): Slide => ({
  id: doc._id,
  mediaType: doc.mediaType === "video" ? "video" : "image",
  media: doc.media || "",
  poster: doc.poster || "",
  eyebrow: doc.eyebrow ?? "",
  title: doc.title || "",
  subtitle: doc.subtitle || "",
  cta: doc.cta || "",
  link: doc.link || "#produits",
  duration: doc.duration || 8,
  transition: doc.transition || "fade",
  order: doc.order ?? 0,
  active: doc.active !== false,
});

// Slides d'origine, utilisés tant que la base n'en contient aucun
export const fallbackSlides: Slide[] = defaultSlides.map((s, i) => ({
  id: `default-${s.id}`,
  mediaType: "image",
  media: s.image,
  poster: "",
  eyebrow: "Collection Exclusive",
  title: s.title,
  subtitle: s.subtitle,
  cta: s.cta,
  link: "#produits",
  duration: 8,
  transition: "fade",
  order: i,
  active: true,
}));

export type SlideInput = Omit<Slide, "id" | "order">;

/** all = true pour l'admin (inclut les slides masqués) */
export const useSlides = (all = false) => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromServer, setFromServer] = useState(false);

  const fetchSlides = useCallback(async () => {
    try {
      const res = await fetch(all ? `${API}?all=true` : API);
      if (!res.ok) throw new Error("fetch");
      const data = await res.json();
      setSlides(data.map(mapSlide));
      setFromServer(true);
    } catch {
      setSlides([]);
      setFromServer(false);
    } finally {
      setLoading(false);
    }
  }, [all]);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const addSlide = useCallback(async (input: SlideInput) => {
    const res = await fetch(API, { method: "POST", headers: authHeaders(), body: JSON.stringify(input) });
    if (!res.ok) throw await apiError(res, "Erreur lors de l'ajout");
    await fetchSlides();
  }, [fetchSlides]);

  const updateSlide = useCallback(async (id: string, input: Partial<SlideInput>) => {
    const res = await fetch(`${API}/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(input) });
    if (!res.ok) throw await apiError(res, "Erreur lors de la modification");
    await fetchSlides();
  }, [fetchSlides]);

  const deleteSlide = useCallback(async (id: string) => {
    const res = await fetch(`${API}/${id}`, { method: "DELETE", headers: authHeaders() });
    if (!res.ok) throw await apiError(res, "Erreur lors de la suppression");
    setSlides((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const reorderSlides = useCallback(async (ids: string[]) => {
    setSlides((prev) => ids.map((id) => prev.find((s) => s.id === id)!).filter(Boolean));
    const res = await fetch(`${API}/reorder`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ ids }) });
    if (!res.ok) {
      await fetchSlides();
      throw await apiError(res, "Erreur lors de la réorganisation");
    }
  }, [fetchSlides]);

  return { slides, loading, fromServer, fetchSlides, addSlide, updateSlide, deleteSlide, reorderSlides };
};
