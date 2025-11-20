import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  totalQuantity: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'africa_market_cart_v1';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem: CartContextValue['addItem'] = (item, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(p => p.id !== id));
  };

  const clear = () => setItems([]);

  const increment = (id: number) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, quantity: p.quantity + 1 } : p));
  };

  const decrement = (id: number) => {
    setItems(prev => prev.flatMap(p => {
      if (p.id !== id) return [p];
      const nextQty = p.quantity - 1;
      return nextQty <= 0 ? [] : [{ ...p, quantity: nextQty }];
    }));
  };

  const { totalQuantity, subtotal } = useMemo(() => {
    const totalQuantityCalc = items.reduce((acc, p) => acc + p.quantity, 0);
    const subtotalCalc = items.reduce((acc, p) => acc + p.price * p.quantity, 0);
    return { totalQuantity: totalQuantityCalc, subtotal: subtotalCalc };
  }, [items]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    clear,
    increment,
    decrement,
    totalQuantity,
    subtotal,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};


