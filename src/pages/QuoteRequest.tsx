import { useState } from "react";
import { ArrowRight, Camera, Send, FileText, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { vehicleMakes } from "@/data/products";

const QuoteRequest = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ make: "", model: "", year: "", partName: "", oem: "", notes: "", qty: "1" });
  const [submitted, setSubmitted] = useState(false);

  const selectedMake = vehicleMakes.find((m) => m.id === form.make);

  if (submitted) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center" dir="rtl">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-5 animate-fade-in">
            <FileText className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-xl font-black mb-2 animate-fade-in-up stagger-1">تم إرسال الطلب! ✅</h1>
          <p className="text-sm text-muted-foreground mb-6 animate-fade-in-up stagger-2">سيتم مراجعة طلبك والرد عليك عبر المحادثة خلال ساعات</p>
          <button onClick={() => navigate("/")} className="bg-primary text-primary-foreground font-bold text-sm px-6 py-3 rounded-xl active:scale-[0.97] transition-transform">
            العودة للرئيسية
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold">طلب عرض سعر</h1>
        <div className="w-5" />
      </header>

      <div className="px-4 py-4 space-y-4" dir="rtl">
        <div className="bg-primary/5 rounded-xl p-3 flex items-center gap-2 animate-fade-in">
          <FileText className="w-5 h-5 text-primary shrink-0" />
          <p className="text-xs text-foreground">أرسل لنا تفاصيل القطعة التي تبحث عنها وسنوفرها لك بأفضل سعر</p>
        </div>

        {/* Vehicle Info */}
        <section className="animate-fade-in-up stagger-1">
          <h2 className="text-sm font-bold flex items-center gap-1.5 mb-2">
            <Car className="w-4 h-4 text-primary" /> بيانات المركبة
          </h2>
          <div className="space-y-2.5">
            <select
              value={form.make}
              onChange={(e) => setForm({ ...form, make: e.target.value, model: "" })}
              className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none"
            >
              <option value="">اختر الشركة المصنعة</option>
              {vehicleMakes.map((m) => <option key={m.id} value={m.id}>{m.name} - {m.nameEn}</option>)}
            </select>
            <select
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none"
              disabled={!form.make}
            >
              <option value="">اختر الموديل</option>
              {selectedMake?.models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <input
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none"
              placeholder="سنة الصنع (مثال: 2018)"
              type="number"
            />
          </div>
        </section>

        {/* Part Info */}
        <section className="animate-fade-in-up stagger-2">
          <h2 className="text-sm font-bold mb-2">بيانات القطعة</h2>
          <div className="space-y-2.5">
            <input
              value={form.partName}
              onChange={(e) => setForm({ ...form, partName: e.target.value })}
              className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none"
              placeholder="اسم القطعة المطلوبة"
            />
            <input
              value={form.oem}
              onChange={(e) => setForm({ ...form, oem: e.target.value })}
              className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none"
              placeholder="رقم OEM (اختياري)"
            />
            <input
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: e.target.value })}
              className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none"
              placeholder="الكمية"
              type="number"
              min="1"
            />
          </div>
        </section>

        {/* Notes & Photo */}
        <section className="animate-fade-in-up stagger-3">
          <h2 className="text-sm font-bold mb-2">ملاحظات إضافية</h2>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full h-20 rounded-xl bg-card border border-border p-3 text-sm outline-none resize-none"
            placeholder="أي تفاصيل إضافية عن القطعة..."
          />
          <button className="mt-2 flex items-center gap-2 text-primary text-sm font-semibold bg-primary/10 px-4 py-2.5 rounded-xl active:scale-[0.97] transition-transform">
            <Camera className="w-4 h-4" /> إرفاق صورة القطعة
          </button>
        </section>
      </div>

      <div className="sticky bottom-[var(--bottom-nav-height)] bg-card border-t border-border px-4 py-3" dir="rtl">
        <button
          onClick={() => setSubmitted(true)}
          className="w-full bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-xl active:scale-[0.97] transition-transform shadow-md flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> إرسال طلب عرض السعر
        </button>
      </div>
    </AppLayout>
  );
};

export default QuoteRequest;
