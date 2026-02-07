import { useState, useEffect, useCallback } from "react";
import type { Product } from "../types";
import { products as defaultProducts } from "../data/products";

const PRODUCTS_KEY = "africamarketbag_products";

const getStoredProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* fallback */ }
  return defaultProducts;
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(getStoredProducts);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback((product: Omit<Product, "id">) => {
    setProducts((prev) => {
      const maxId = prev.reduce((max, p) => Math.max(max, p.id), 0);
      return [...prev, { ...product, id: maxId + 1 }];
    });
  }, []);

  const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const resetToDefaults = useCallback(() => {
    setProducts(defaultProducts);
  }, []);

  return { products, addProduct, updateProduct, deleteProduct, resetToDefaults };
};