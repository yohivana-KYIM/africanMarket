import { useState, useEffect, useCallback } from "react";
import type { Product, CartItem } from "../types";

const CART_STORAGE_KEY = "africamarketbag_cart";

const getStoredCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getCartKey = (id: string, size?: string): string =>
  size ? `${id}_${size}` : id;

const matchesCartKey = (item: CartItem, id: string, size?: string): boolean =>
  item.id === id && (item.size || "") === (size || "");

interface UseCartReturn {
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
}

export const useCart = (): UseCartReturn => {
  const [cartItems, setCartItems] = useState<CartItem[]>(getStoredCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product: Product, size?: string) => {
    if (product.sizes && product.sizes.length > 0 && !size) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => matchesCartKey(item, product.id, size));
      if (existing) {
        return prev.map((item) =>
          matchesCartKey(item, product.id, size)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, size }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size?: string) => {
    setCartItems((prev) => prev.filter((item) => !matchesCartKey(item, productId, size)));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => !matchesCartKey(item, productId, size)));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        matchesCartKey(item, productId, size) ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  return {
    cartItems,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};