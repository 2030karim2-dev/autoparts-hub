import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Product } from "@/data/products";

interface CompareContextType {
  items: Product[];
  addItem: (product: Product) => boolean;
  removeItem: (productId: string) => void;
  clearAll: () => void;
  isInCompare: (productId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>([]);

  const addItem = useCallback((product: Product): boolean => {
    if (items.length >= 3) return false;
    if (items.find((p) => p.id === product.id)) return false;
    setItems((prev) => [...prev, product]);
    return true;
  }, [items]);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  const isInCompare = useCallback(
    (productId: string) => items.some((p) => p.id === productId),
    [items]
  );

  return (
    <CompareContext.Provider value={{ items, addItem, removeItem, clearAll, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within CompareProvider");
  return context;
};
