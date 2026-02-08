import { useState, useCallback, useRef } from "react";
import type { Product } from "../types";
import { mapProduct } from "./useProducts";
import environment from "../environment";

const API = `${environment.API_URL}/api/products`;

export const useSearch = () => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const search = useCallback((term: string) => {
    setQuery(term);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!term.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API}?search=${encodeURIComponent(term)}&limit=8`);
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults(data.products.map(mapProduct));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  return { results, loading, query, search, clearSearch };
};
