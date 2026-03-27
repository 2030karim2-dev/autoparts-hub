import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { currencies, Currency } from "@/data/yemenData";

interface CurrencyContextType {
  currency: Currency;
  setCurrencyCode: (code: string) => void;
  convert: (amountInSAR: number) => number;
  format: (amountInSAR: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>(currencies[0]); // SAR default

  const setCurrencyCode = useCallback((code: string) => {
    const found = currencies.find((c) => c.code === code);
    if (found) setCurrency(found);
  }, []);

  const convert = useCallback(
    (amountInSAR: number) => amountInSAR * currency.rate,
    [currency]
  );

  const format = useCallback(
    (amountInSAR: number) => {
      const converted = amountInSAR * currency.rate;
      return `${converted.toFixed(2)} ${currency.symbol}`;
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
};
