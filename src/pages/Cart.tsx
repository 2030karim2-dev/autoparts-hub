import { useState } from "react";
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import shockAbsorbers from "@/assets/shock-absorbers.png";
import airFilter from "@/assets/air-filter.png";
import controlArm from "@/assets/control-arm.png";

interface CartItem {
  id: string;
  name: string;
  oem: string;
  price: number;
  qty: number;
  image: string;
}

const initialItems: CartItem[] = [
  { id: "1", name: "ممتصات صدمات أمامية", oem: "54660-D3100", price: 220, qty: 1, image: shockAbsorbers },
  { id: "2", name: "فلتر هواء المقصورة", oem: "97133-D3000", price: 55.50, qty: 2, image: airFilter },
  { id: "3", name: "ذراع تحكم أمامي يسار", oem: "54500-D3100", price: 132, qty: 1, image: controlArm },
];

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialItems);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = 25;
  const vat = subtotal * 0.15;
  const total = subtotal + shipping + vat;

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold">سلة المشتريات</h1>
        <span className="text-xs font-medium bg-primary-foreground/20 px-2 py-0.5 rounded-full">{items.length} منتجات</span>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center" dir="rtl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-lg font-bold mb-1">السلة فارغة</h2>
          <p className="text-sm text-muted-foreground mb-4">تصفح المنتجات وأضف ما تحتاجه إلى السلة</p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-primary-foreground font-bold text-sm px-6 py-3 rounded-xl active:scale-[0.97] transition-transform"
          >
            تصفح المنتجات
          </button>
        </div>
      ) : (
        <>
          <div className="px-4 py-3 space-y-3" dir="rtl">
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`bg-card rounded-xl p-3 flex gap-3 shadow-sm animate-fade-in-up stagger-${i + 1}`}
              >
                <div className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold truncate">{item.name}</h3>
                  <p className="text-[11px] text-muted-foreground mb-2">OEM: {item.oem}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black">SAR {(item.price * item.qty).toFixed(2)}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-7 h-7 flex items-center justify-center text-destructive active:scale-90 transition-transform"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center active:bg-muted">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center active:bg-muted">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="px-4 py-4 animate-fade-in-up" dir="rtl">
            <div className="bg-card rounded-xl p-4 shadow-sm space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span className="font-semibold">SAR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الشحن</span>
                <span className="font-semibold">SAR {shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ضريبة القيمة المضافة (15%)</span>
                <span className="font-semibold">SAR {vat.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2.5 flex justify-between">
                <span className="text-base font-bold">الإجمالي</span>
                <span className="text-lg font-black text-primary">SAR {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="sticky bottom-[var(--bottom-nav-height)] bg-card border-t border-border px-4 py-3" dir="rtl">
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-xl transition-transform active:scale-[0.97] shadow-md"
            >
              إتمام الطلب — SAR {total.toFixed(2)}
            </button>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default Cart;
