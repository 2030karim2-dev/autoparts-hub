import { useState } from "react";
import { ArrowRight, MapPin, CreditCard, Truck, Check, ChevronLeft, Banknote, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useCart } from "@/contexts/CartContext";

const addresses = [
  { id: "1", name: "المنزل", detail: "صنعاء، شارع الستين، بجوار مسجد الصالح", phone: "771234567", isDefault: true },
  { id: "2", name: "العمل", detail: "صنعاء، شارع حدة، برج التجارة", phone: "771234568", isDefault: false },
];

const paymentMethods = [
  { id: "cash", label: "الدفع عند الاستلام", icon: Banknote, desc: "ادفع نقداً عند التوصيل" },
  { id: "transfer", label: "تحويل بنكي", icon: CreditCard, desc: "كريمي أو الأمل" },
  { id: "mobile", label: "محفظة إلكترونية", icon: Smartphone, desc: "جيب، فلوسك، كاش" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, coupon, discount, clearCart } = useCart();
  const [selectedAddress, setSelectedAddress] = useState("1");
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [notes, setNotes] = useState("");

  const discountAmount = subtotal * (discount / 100);
  const afterDiscount = subtotal - discountAmount;
  const shipping = subtotal > 500 ? 0 : 25;
  const vat = afterDiscount * 0.15;
  const total = afterDiscount + shipping + vat;
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  const handleConfirm = () => {
    clearCart();
    navigate("/order-confirmation");
  };

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <h1 className="text-base font-bold">إتمام الطلب</h1>
        <div className="w-5" />
      </header>

      <div className="px-4 py-4 space-y-4" dir="rtl">
        <section className="animate-fade-in-up stagger-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> عنوان التوصيل</h2>
            <button onClick={() => navigate("/addresses")} className="text-xs text-primary font-semibold flex items-center gap-0.5">تغيير <ChevronLeft className="w-3 h-3" /></button>
          </div>
          <div className="space-y-2">
            {addresses.map((addr) => (
              <button key={addr.id} onClick={() => setSelectedAddress(addr.id)} className={`w-full bg-card rounded-xl p-3 text-right shadow-sm transition-all ${selectedAddress === addr.id ? "border-2 border-primary" : "border border-border"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">{addr.name}</span>
                  {selectedAddress === addr.id && <Check className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-sm text-foreground">{addr.detail}</p>
                <p className="text-xs text-muted-foreground mt-0.5">📞 +967 {addr.phone}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="animate-fade-in-up stagger-2">
          <h2 className="text-sm font-bold flex items-center gap-1.5 mb-2"><Truck className="w-4 h-4 text-primary" /> طريقة الشحن</h2>
          <div className="bg-card rounded-xl p-3 border border-primary shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">شحن عادي</p>
                <p className="text-xs text-muted-foreground">التوصيل خلال 2-4 أيام عمل</p>
              </div>
              <span className="text-sm font-bold">{shipping === 0 ? "مجاني 🎉" : `SAR ${shipping.toFixed(2)}`}</span>
            </div>
          </div>
        </section>

        <section className="animate-fade-in-up stagger-3">
          <h2 className="text-sm font-bold flex items-center gap-1.5 mb-2"><CreditCard className="w-4 h-4 text-primary" /> طريقة الدفع</h2>
          <div className="space-y-2">
            {paymentMethods.map(({ id, label, icon: Icon, desc }) => (
              <button key={id} onClick={() => setSelectedPayment(id)} className={`w-full bg-card rounded-xl p-3 flex items-center gap-3 shadow-sm transition-all ${selectedPayment === id ? "border-2 border-primary" : "border border-border"}`}>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-primary" /></div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-bold">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                {selectedPayment === id && <Check className="w-5 h-5 text-primary shrink-0" />}
              </button>
            ))}
          </div>
        </section>

        <section className="animate-fade-in-up stagger-4">
          <h2 className="text-sm font-bold mb-2">ملاحظات على الطلب</h2>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full h-20 bg-card border border-border rounded-xl p-3 text-sm outline-none resize-none placeholder:text-muted-foreground" placeholder="أضف أي ملاحظات للتوصيل أو الطلب..." />
        </section>

        <section className="animate-fade-in-up stagger-5">
          <div className="bg-card rounded-xl p-4 shadow-sm space-y-2.5">
            <h2 className="text-sm font-bold mb-2">ملخص الطلب</h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">المجموع الفرعي ({totalItems} منتجات)</span>
              <span className="font-semibold">SAR {subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-success">الخصم ({coupon} - {discount}%)</span>
                <span className="font-semibold text-success">- SAR {discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">الشحن</span>
              <span className="font-semibold">{shipping === 0 ? "مجاني" : `SAR ${shipping.toFixed(2)}`}</span>
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
        </section>
      </div>

      <div className="sticky bottom-[var(--bottom-nav-height)] bg-card border-t border-border px-4 py-3" dir="rtl">
        <button onClick={handleConfirm} className="w-full bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-xl active:scale-[0.97] transition-transform shadow-md">
          تأكيد الطلب — SAR {total.toFixed(2)}
        </button>
      </div>
    </AppLayout>
  );
};

export default Checkout;
