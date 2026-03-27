import { useState } from "react";
import { ArrowRight, Plus, MapPin, Edit2, Trash2, Check, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { deliveryZones } from "@/data/yemenData";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Address {
  id: string;
  name: string;
  city: string;
  detail: string;
  phone: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  { id: "1", name: "المنزل", city: "صنعاء", detail: "شارع الستين، بجوار مسجد الصالح", phone: "771234567", isDefault: true },
  { id: "2", name: "العمل", city: "صنعاء", detail: "شارع حدة، برج التجارة، الطابق 5", phone: "771234568", isDefault: false },
];

const yemenCities = deliveryZones.map((z) => z.city);

const Addresses = () => {
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", city: "صنعاء", detail: "", phone: "" });

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const addAddress = () => {
    if (!form.name || !form.detail || !form.phone) return;
    const newAddr: Address = {
      id: Date.now().toString(),
      ...form,
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, newAddr]);
    setForm({ name: "", city: "صنعاء", detail: "", phone: "" });
    setShowForm(false);
  };

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold">عناوين التوصيل</h1>
        <button onClick={() => setShowForm(!showForm)} className="active:scale-95 transition-transform">
          <Plus className="w-5 h-5" />
        </button>
      </header>

      <div className="px-4 py-4 space-y-3" dir="rtl">
        {/* Add Form */}
        {showForm && (
          <div className="bg-card rounded-xl p-4 shadow-sm space-y-3 animate-fade-in-up border-2 border-primary">
            <h3 className="text-sm font-bold">إضافة عنوان جديد</h3>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-10 rounded-lg bg-secondary px-3 text-sm outline-none"
              placeholder="اسم العنوان (مثل: المنزل، العمل)"
            />
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full h-10 rounded-lg bg-secondary px-3 text-sm outline-none"
            >
              {yemenCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <textarea
              value={form.detail}
              onChange={(e) => setForm({ ...form, detail: e.target.value })}
              className="w-full h-16 rounded-lg bg-secondary p-3 text-sm outline-none resize-none"
              placeholder="تفاصيل العنوان (الشارع، الحي، علامة مميزة)"
            />
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full h-10 rounded-lg bg-secondary px-3 text-sm outline-none"
              placeholder="رقم الهاتف (مثال: 771234567)"
              type="tel"
            />
            <div className="flex gap-2">
              <button onClick={addAddress} className="flex-1 bg-primary text-primary-foreground font-bold text-sm py-2.5 rounded-xl active:scale-[0.97] transition-transform">
                حفظ العنوان
              </button>
              <button onClick={() => setShowForm(false)} className="flex-1 border border-border text-foreground font-bold text-sm py-2.5 rounded-xl active:scale-[0.97] transition-transform">
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Address List */}
        {addresses.map((addr, i) => (
          <div
            key={addr.id}
            className={`bg-card rounded-xl p-4 shadow-sm animate-fade-in-up stagger-${Math.min(i + 1, 5)} ${
              addr.isDefault ? "border-2 border-primary" : "border border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold">{addr.name}</span>
                {addr.isDefault && (
                  <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">افتراضي</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 flex items-center justify-center text-muted-foreground active:scale-90">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => removeAddress(addr.id)} className="w-7 h-7 flex items-center justify-center text-destructive active:scale-90">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-foreground mb-0.5">{addr.city}، {addr.detail}</p>
            <p className="text-xs text-muted-foreground mb-1">📞 +967 {addr.phone}</p>
            {(() => {
              const z = deliveryZones.find((dz) => dz.city === addr.city);
              return z ? (
                <div className="flex items-center gap-2 mb-2 bg-primary/5 rounded-lg px-2 py-1.5">
                  <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-[10px] text-muted-foreground">التوصيل: {z.estimatedDays} أيام • الرسوم: {format(z.fee)} • مجاني فوق {format(z.freeAbove)}</span>
                </div>
              ) : null;
            })()}
            {!addr.isDefault && (
              <button
                onClick={() => setDefault(addr.id)}
                className="text-xs text-primary font-semibold flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> تعيين كافتراضي
              </button>
            )}
          </div>
        ))}

        {addresses.length === 0 && !showForm && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MapPin className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <h3 className="text-base font-bold mb-1">لا توجد عناوين</h3>
            <p className="text-sm text-muted-foreground mb-4">أضف عنوان توصيل لإتمام طلبك</p>
            <button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground font-bold text-sm px-6 py-3 rounded-xl active:scale-[0.97] transition-transform">
              إضافة عنوان
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Addresses;
