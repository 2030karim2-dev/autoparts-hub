import { ArrowRight, X, Star, Check, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { useCompare } from "@/contexts/CompareContext";
import { useCart } from "@/contexts/CartContext";

const Compare = () => {
  const navigate = useNavigate();
  const { items, removeItem, clearAll } = useCompare();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <AppLayout>
        <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
          <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
          <h1 className="text-base font-bold">مقارنة المنتجات</h1>
          <div className="w-5" />
        </header>
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center" dir="rtl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-lg font-bold mb-1">لا توجد منتجات للمقارنة</h2>
          <p className="text-sm text-muted-foreground mb-4">أضف حتى 3 منتجات من صفحة البحث للمقارنة</p>
          <button onClick={() => navigate("/search")} className="bg-primary text-primary-foreground font-bold text-sm px-6 py-3 rounded-xl active:scale-[0.97] transition-transform">
            تصفح المنتجات
          </button>
        </div>
      </AppLayout>
    );
  }

  const rows = [
    { label: "السعر", render: (p: typeof items[0]) => `SAR ${p.price}` },
    { label: "الماركة", render: (p: typeof items[0]) => p.brand },
    { label: "الفئة", render: (p: typeof items[0]) => p.category },
    { label: "رقم OEM", render: (p: typeof items[0]) => p.oem },
    { label: "التقييم", render: (p: typeof items[0]) => `${p.rating} ★` },
    { label: "المراجعات", render: (p: typeof items[0]) => `${p.reviews}` },
    { label: "التوفر", render: (p: typeof items[0]) => p.inStock ? "متوفر ✓" : "غير متوفر" },
  ];

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <h1 className="text-base font-bold">مقارنة ({items.length})</h1>
        <button onClick={clearAll} className="text-xs font-medium bg-primary-foreground/20 px-2 py-0.5 rounded-full">مسح</button>
      </header>

      <div className="overflow-x-auto" dir="rtl">
        {/* Product headers */}
        <div className="flex border-b border-border min-w-max">
          <div className="w-24 shrink-0" />
          {items.map((p) => (
            <div key={p.id} className="w-36 shrink-0 p-3 text-center relative">
              <button onClick={() => removeItem(p.id)} className="absolute top-1 left-1 w-5 h-5 bg-destructive/10 rounded-full flex items-center justify-center">
                <X className="w-3 h-3 text-destructive" />
              </button>
              <div className="w-16 h-16 mx-auto bg-secondary rounded-lg flex items-center justify-center mb-2">
                <img src={p.image} alt={p.name} className="w-12 h-12 object-contain" />
              </div>
              <p className="text-xs font-bold leading-tight">{p.name}</p>
            </div>
          ))}
        </div>

        {/* Comparison rows */}
        {rows.map((row, i) => (
          <div key={row.label} className={`flex min-w-max ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
            <div className="w-24 shrink-0 p-3 text-xs font-bold text-muted-foreground flex items-center">{row.label}</div>
            {items.map((p) => (
              <div key={p.id} className="w-36 shrink-0 p-3 text-xs font-medium text-center">{row.render(p)}</div>
            ))}
          </div>
        ))}

        {/* Add to cart row */}
        <div className="flex min-w-max border-t border-border">
          <div className="w-24 shrink-0" />
          {items.map((p) => (
            <div key={p.id} className="w-36 shrink-0 p-3 text-center">
              <button
                onClick={() => addItem(p)}
                disabled={!p.inStock}
                className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-2 rounded-lg active:scale-95 transition-transform disabled:opacity-50"
              >
                أضف للسلة
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Compare;
