import { useState, useEffect, useCallback } from "react";
import type { Product } from "../types";

const WISHLIST_STORAGE_KEY = "africamarket_wishlist";

const getStoredWishlist = (): Product[] => {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

interface UseWishlistReturn {
  wishlistItems: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlist = (): UseWishlistReturn => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>(getStoredWishlist);

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const isInWishlist = useCallback(
    (productId: string) => wishlistItems.some((item) => item.id === productId),
    [wishlistItems]
  );

  const toggleWishlist = useCallback((product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) return prev.filter((item) => item.id !== product.id);
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const wishlistCount = wishlistItems.length;

  return { wishlistItems, wishlistCount, isInWishlist, toggleWishlist, removeFromWishlist, clearWishlist };
};
