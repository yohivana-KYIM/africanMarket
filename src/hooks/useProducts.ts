import { useState, useEffect, useCallback } from "react";
import type { Product } from "../types";
import { products as defaultProducts } from "../data/products";
import environment from "../environment";

const API = `${environment.API_URL}/api/products`;

const getToken = (): string | null => {
  try {
    const stored = localStorage.getItem("africanmarket_user");
    if (stored) {
      const user = JSON.parse(stored);
      return user.token || null;
    }
  } catch { /* ignore */ }
  return null;
};

const authHeaders = (): Record<string, string> => {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const mapProduct = (doc: any): Product => ({
  id: doc._id,
  name: doc.name,
  category: doc.category || "",
  categorySlug: doc.categorySlug || "",
  subcategory: doc.subcategory || "",
  subcategorySlug: doc.subcategorySlug || "",
  price: doc.price,
  oldPrice: doc.oldPrice ?? null,
  discount: doc.discount ?? null,
  image: doc.image || "",
  description: doc.description || "",
  featured: doc.featured || false,
});

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setProducts(data.map(mapProduct));
    } catch {
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (product: Omit<Product, "id">) => {
    const res = await fetch(API, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Erreur lors de l'ajout");
    const created = await res.json();
    setProducts((prev) => [...prev, mapProduct(created)]);
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour");
    const updated = await res.json();
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? mapProduct(updated) : p))
    );
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const resetToDefaults = useCallback(async () => {
    const headers = authHeaders();
    await Promise.all(
      products.map((p) =>
        fetch(`${API}/${p.id}`, { method: "DELETE", headers })
      )
    );
    const created = await Promise.all(
      defaultProducts.map((p) => {
        const { id, ...body } = p;
        return fetch(API, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        }).then((r) => r.json());
      })
    );
    setProducts(created.map(mapProduct));
  }, [products]);

  return { products, loading, addProduct, updateProduct, deleteProduct, resetToDefaults };
};
