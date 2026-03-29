import { useState } from "react";
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag, Tag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { useCart } from "@/contexts/CartContext";
import ProductSuggestions from "@/components/product/ProductSuggestions";

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQty, totalItems, subtotal, coupon, discount, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState(false);

  const shipping = subtotal > 500 ? 0 : 25;
  const discountAmount = subtotal * (discount / 100);
  const afterDiscount = subtotal - discountAmount;
  const vat = afterDiscount * 0.15;
  const total = afterDiscount + shipping + vat;

  const handleApplyCoupon = () => {
    if (applyCoupon(couponInput)) { setCouponError(false); setCouponInput(""); } else { setCouponError(true); }
  };

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <h1 className="text-base font-bold">سلة المشتريات</h1>
        <span className="text-xs font-medium bg-primary-foreground/20 px-2 py-0.5 rounded-full">{totalItems} منتجات</span>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center" dir="rtl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4"><ShoppingBag className="w-7 h-7 text-primary" /></div>
          <h2 className="text-lg font-bold mb-1">السلة فارغة</h2>
          <p className="text-sm text-muted-foreground mb-4">تصفح المنتجات وأضف ما تحتاجه إلى السلة</p>
          <button onClick={() => navigate("/")} className="bg-primary text-primary-foreground font-bold text-sm px-6 py-3 rounded-xl active:scale-[0.97] transition-transform">تصفح المنتجات</button>
        </div>
      ) : (
        <>
          <div className="px-4 py-3 space-y-3" dir="rtl">
            {items.map((item, i) => (
              <div key={item.product.id} className={`bg-card rounded-xl p-3 flex gap-3 shadow-sm animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}>
                <div className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center shrink-0"><img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-contain" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold truncate">{item.product.name}</h3>
                  <p className="text-[11px] text-muted-foreground mb-2">OEM: {item.product.oem}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black">SAR {(item.product.price * item.qty).toFixed(2)}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => removeItem(item.product.id)} className="w-7 h-7 flex items-center justify-center text-destructive active:scale-90 transition-transform"><Trash2 className="w-3.5 h-3.5" /></button>
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button onClick={() => updateQty(item.product.id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center active:bg-muted"><Minus className="w-3 h-3" /></button>
                        <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
                        <button onClick={() => updateQty(item.product.id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center active:bg-muted"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ProductSuggestions title="قد يعجبك أيضاً" maxItems={4} currentProductId={items[0]?.product.id} />

          <div className="px-4 py-2" dir="rtl">
            {coupon ? (
              <div className="bg-success/10 border border-success/20 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-success" /><span className="text-sm font-bold text-success">كوبون {coupon} — خصم {discount}%</span></div>
                <button onClick={removeCoupon} className="w-6 h-6 flex items-center justify-center"><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={couponInput} onChange={(e) => { setCouponInput(e.target.value); setCouponError(false); }} className={`flex-1 h-10 rounded-lg bg-card border px-3 text-sm outline-none ${couponError ? "border-destructive" : "border-border"}`} placeholder="أدخل كود الخصم..." />
                <button onClick={handleApplyCoupon} className="bg-primary text-primary-foreground text-xs font-bold px-4 rounded-lg active:scale-95 transition-transform">تطبيق</button>
              </div>
            )}
            {couponError && <p className="text-xs text-destructive mt-1">كود الخصم غير صحيح</p>}
          </div>

          <div className="px-4 py-4 animate-fade-in-up" dir="rtl">
            <div className="bg-card rounded-xl p-4 shadow-sm space-y-2.5">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">المجموع الفرعي</span><span className="font-semibold">SAR {subtotal.toFixed(2)}</span></div>
              {discount > 0 && (<div className="flex justify-between text-sm"><span className="text-success">الخصم ({discount}%)</span><span className="font-semibold text-success">- SAR {discountAmount.toFixed(2)}</span></div>)}
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">الشحن</span><span className="font-semibold">{shipping === 0 ? "مجاني 🎉" : `SAR ${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">ضريبة القيمة المضافة (15%)</span><span className="font-semibold">SAR {vat.toFixed(2)}</span></div>
              <div className="border-t border-border pt-2.5 flex justify-between"><span className="text-base font-bold">الإجمالي</span><span className="text-lg font-black text-primary">SAR {total.toFixed(2)}</span></div>
            </div>
          </div>

          <div className="sticky bottom-[var(--bottom-nav-height)] bg-card border-t border-border px-4 py-3" dir="rtl">
            <button onClick={() => navigate("/checkout")} className="w-full bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-xl transition-transform active:scale-[0.97] shadow-md">إتمام الطلب — SAR {total.toFixed(2)}</button>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default Cart;
