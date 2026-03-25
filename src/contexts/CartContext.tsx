import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  coupon: string | null;
  discount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const VALID_COUPONS: Record<string, number> = {
  "WELCOME10": 10,
  "SAVE20": 20,
  "PARTS15": 15,
  "YEMEN25": 25,
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  const addItem = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { product, qty }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
    setDiscount(0);
  }, []);

  const applyCoupon = useCallback((code: string): boolean => {
    const upper = code.toUpperCase().trim();
    if (VALID_COUPONS[upper]) {
      setCoupon(upper);
      setDiscount(VALID_COUPONS[upper]);
      return true;
    }
    return false;
  }, []);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setDiscount(0);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal, coupon, discount, applyCoupon, removeCoupon }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
