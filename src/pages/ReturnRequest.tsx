import { useState } from "react";
import { ArrowRight, Upload, Camera, Check, AlertTriangle, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { returnReasons } from "@/data/yemenData";
import { toast } from "sonner";

const ReturnRequest = () => {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [step, setStep] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (images.length >= 4) return;
      const reader = new FileReader();
      reader.onload = (ev) => setImages((prev) => [...prev.slice(0, 3), ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    if (!selectedReason) {
      toast.error("يرجى اختيار سبب الإرجاع");
      return;
    }
    toast.success("تم إرسال طلب الإرجاع بنجاح! سيتم مراجعته خلال 48 ساعة");
    navigate("/orders");
  };

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <h1 className="text-base font-bold">طلب إرجاع</h1>
        <div className="w-5" />
      </header>

      {/* Progress */}
      <div className="px-4 py-3" dir="rtl">
        <div className="flex items-center gap-1">
          {["سبب الإرجاع", "الصور والتفاصيل", "التأكيد"].map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-initial">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {i < step ? "✓" : i + 1}
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 mx-1.5 rounded-full ${i < step ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-2 space-y-4" dir="rtl">
        {/* Step 0: Reason */}
        {step === 0 && (
          <section className="space-y-3 animate-fade-in-up">
            {/* Order info mock */}
            <div className="bg-card rounded-xl p-3 shadow-sm flex items-center gap-3 border border-border">
              <div className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                <Package className="w-7 h-7 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">طلب #513400</p>
                <p className="text-xs text-muted-foreground">ممتصات صدمات أمامية × 1</p>
                <p className="text-xs text-muted-foreground">تم التوصيل: 25 مارس 2026</p>
              </div>
            </div>

            <h2 className="text-sm font-bold">ما سبب الإرجاع؟</h2>
            <div className="space-y-2">
              {returnReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full bg-card rounded-xl p-3 text-right shadow-sm transition-all flex items-center gap-3 ${selectedReason === reason ? "border-2 border-primary" : "border border-border"}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedReason === reason ? "bg-primary border-primary" : "border-border"}`}>
                    {selectedReason === reason && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <span className="text-sm">{reason}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Step 1: Photos & Details */}
        {step === 1 && (
          <section className="space-y-4 animate-fade-in-up">
            <div>
              <h2 className="text-sm font-bold mb-2">صور المنتج (اختياري - حتى 4 صور)</h2>
              <div className="grid grid-cols-2 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute top-1 left-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground text-xs font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <label className="aspect-square bg-card border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Camera className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-[10px] text-muted-foreground">إضافة صورة</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} multiple />
                  </label>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold mb-2">تفاصيل إضافية</h2>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full h-24 bg-card border border-border rounded-xl p-3 text-sm outline-none resize-none placeholder:text-muted-foreground focus:border-primary transition-colors"
                placeholder="اشرح المشكلة بالتفصيل..."
              />
            </div>
          </section>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <section className="space-y-4 animate-fade-in-up">
            <div className="bg-warning/10 rounded-xl p-4 border border-warning/20 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-warning mb-1">تنبيه مهم</p>
                <p className="text-xs text-muted-foreground">بعد إرسال طلب الإرجاع سيتم مراجعته من قبل فريقنا خلال 48 ساعة. سيتم إبلاغك بالقبول أو الرفض عبر الإشعارات.</p>
              </div>
            </div>

            <div className="bg-card rounded-xl p-4 shadow-sm space-y-3">
              <h3 className="text-sm font-bold">ملخص طلب الإرجاع</h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">المنتج</span>
                <span className="font-semibold">ممتصات صدمات أمامية</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">السبب</span>
                <span className="font-semibold text-left max-w-[60%]">{selectedReason}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الصور المرفقة</span>
                <span className="font-semibold">{images.length} صور</span>
              </div>
              {details && (
                <div className="border-t border-border pt-2">
                  <p className="text-xs text-muted-foreground mb-1">التفاصيل:</p>
                  <p className="text-xs">{details}</p>
                </div>
              )}
            </div>

            <div className="bg-card rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-bold mb-2">سياسة الإرجاع</h3>
              <ul className="space-y-1.5">
                {[
                  "يتم قبول الإرجاع خلال 7 أيام من الاستلام",
                  "المنتج يجب أن يكون بحالته الأصلية وغير مستخدم",
                  "يتم استرداد المبلغ خلال 3-5 أيام عمل بعد الموافقة",
                  "رسوم الشحن غير قابلة للاسترداد",
                  "المنتجات الكهربائية والإلكترونية لا يتم إرجاعها إلا إذا كانت معيبة",
                ].map((rule, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5 shrink-0">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-[var(--bottom-nav-height)] bg-card border-t border-border px-4 py-3" dir="rtl">
        <button
          onClick={() => {
            if (step < 2) setStep(step + 1);
            else handleSubmit();
          }}
          className="w-full bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-xl active:scale-[0.97] transition-transform shadow-md"
        >
          {step === 2 ? "إرسال طلب الإرجاع" : "التالي"}
        </button>
      </div>
    </AppLayout>
  );
};

export default ReturnRequest;
