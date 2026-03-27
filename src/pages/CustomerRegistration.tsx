import { useState } from "react";
import { ArrowRight, Check, Upload, ChevronLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { customerTypes, CustomerType } from "@/data/yemenData";
import { toast } from "sonner";

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<CustomerType | null>(null);
  const [step, setStep] = useState<"select" | "form">("select");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    workshopName: "",
    workshopAddress: "",
    orgName: "",
    officialName: "",
    businessName: "",
    commercialReg: "",
  });
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setDocumentImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!agreed) {
      toast.error("يرجى الموافقة على الشروط والأحكام");
      return;
    }
    if (!formData.name || !formData.phone) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    toast.success("تم إرسال طلب التسجيل بنجاح! سيتم مراجعته خلال 24 ساعة");
    navigate("/profile");
  };

  const selectedInfo = customerTypes.find((c) => c.type === selectedType);

  const terms: Record<CustomerType, string[]> = {
    retail: [
      "يحق للعميل إرجاع المنتج خلال 7 أيام من الاستلام",
      "المنتج يجب أن يكون بحالته الأصلية وغير مستخدم",
      "رسوم الشحن غير قابلة للاسترداد",
      "الأسعار بالريال السعودي وتشمل ضريبة القيمة المضافة",
    ],
    workshop: [
      "يجب تقديم اسم الورشة وعنوانها للتحقق",
      "خصم 10% يطبق تلقائياً على كل الطلبات",
      "إمكانية الدفع الشهري بعد 3 طلبات ناجحة",
      "حد الإرجاع 14 يوماً للمنتجات غير المركبة",
      "يتم تعيين مندوب مخصص للورشة",
    ],
    government: [
      "يجب تقديم مستند رسمي مختوم من المؤسسة الحكومية",
      "المستند يجب أن يتضمن أمر بالتعامل مع المتجر",
      "خصم 15% على جميع المنتجات",
      "الدفع الآجل متاح لمدة 30 يوم من تاريخ التوصيل",
      "يتم إصدار فواتير رسمية معتمدة",
      "في حال تغيير المسؤول يجب تقديم مستند جديد",
    ],
    wholesale: [
      "يجب تقديم السجل التجاري ساري المفعول",
      "الحد الأدنى للطلب 1,000 ريال سعودي",
      "خصم 20% على أسعار الجملة",
      "الشحن مجاني لجميع الطلبات",
      "أسعار خاصة بالكميات الكبيرة (100+ قطعة)",
      "إمكانية التوصيل المباشر من المستودع",
    ],
  };

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => step === "form" ? setStep("select") : navigate(-1)} className="active:scale-95 transition-transform">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold">{step === "select" ? "نوع الحساب" : "تسجيل حساب"}</h1>
        <div className="w-5" />
      </header>

      <div className="px-4 py-4 space-y-4" dir="rtl">
        {step === "select" ? (
          <>
            <p className="text-sm text-muted-foreground">اختر نوع حسابك للحصول على المميزات والأسعار المناسبة:</p>
            {customerTypes.map((ct, idx) => (
              <button
                key={ct.type}
                onClick={() => { setSelectedType(ct.type); setStep("form"); }}
                className={`w-full bg-card rounded-xl p-4 shadow-sm text-right transition-all border border-border active:scale-[0.98] animate-fade-in-up stagger-${Math.min(idx + 1, 5)}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{ct.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{ct.label}</p>
                    <p className="text-xs text-muted-foreground">{ct.description}</p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </div>
                {ct.discountPercent > 0 && (
                  <div className="bg-success/10 text-success text-xs font-bold px-2 py-1 rounded-lg inline-block">
                    خصم {ct.discountPercent}% على كل الطلبات
                  </div>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {ct.benefits.slice(0, 2).map((b) => (
                    <span key={b} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded">{b}</span>
                  ))}
                </div>
              </button>
            ))}
          </>
        ) : selectedInfo && (
          <div className="space-y-4 animate-fade-in-up">
            {/* Type Badge */}
            <div className="bg-primary/5 rounded-xl p-3 border border-primary/20 flex items-center gap-3">
              <span className="text-2xl">{selectedInfo.icon}</span>
              <div>
                <p className="text-sm font-bold">{selectedInfo.label}</p>
                {selectedInfo.discountPercent > 0 && (
                  <p className="text-xs text-success font-semibold">خصم {selectedInfo.discountPercent}%</p>
                )}
              </div>
            </div>

            {/* Common Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1.5 block">الاسم الكامل *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none focus:border-primary transition-colors"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1.5 block">رقم الهاتف *</label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 bg-card border border-border rounded-xl px-3 h-11 shrink-0">
                    <span className="text-xs">🇾🇪</span>
                    <span className="text-xs font-semibold">+967</span>
                  </div>
                  <input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="flex-1 h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="7XXXXXXXX"
                    type="tel"
                    maxLength={9}
                  />
                </div>
              </div>
            </div>

            {/* Workshop Fields */}
            {selectedType === "workshop" && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 block">اسم الورشة *</label>
                  <input
                    value={formData.workshopName}
                    onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
                    className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="مثال: ورشة الأمان لصيانة السيارات"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 block">عنوان الورشة *</label>
                  <input
                    value={formData.workshopAddress}
                    onChange={(e) => setFormData({ ...formData, workshopAddress: e.target.value })}
                    className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="المدينة، الشارع، بجوار..."
                  />
                </div>
              </div>
            )}

            {/* Government Fields */}
            {selectedType === "government" && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 block">اسم المؤسسة الحكومية *</label>
                  <input
                    value={formData.orgName}
                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                    className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="مثال: وزارة النقل"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 block">اسم المسؤول *</label>
                  <input
                    value={formData.officialName}
                    onChange={(e) => setFormData({ ...formData, officialName: e.target.value })}
                    className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="اسم المسؤول المخوّل بالتعامل"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 block">المستند الرسمي المختوم *</label>
                  <label className="w-full bg-card border-2 border-dashed border-warning rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary transition-colors">
                    {documentImage ? (
                      <img src={documentImage} alt="المستند" className="w-full h-32 object-contain rounded-lg" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-warning" />
                        <span className="text-xs text-muted-foreground text-center">ارفع صورة المستند المختوم من المؤسسة الحكومية</span>
                        <span className="text-[10px] text-warning font-semibold">مطلوب لضمان الحقوق في حال تغيير المسؤول</span>
                      </>
                    )}
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleDocUpload} />
                  </label>
                </div>
              </div>
            )}

            {/* Wholesale Fields */}
            {selectedType === "wholesale" && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 block">الاسم التجاري *</label>
                  <input
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="اسم المنشأة التجارية"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 block">رقم السجل التجاري *</label>
                  <input
                    value={formData.commercialReg}
                    onChange={(e) => setFormData({ ...formData, commercialReg: e.target.value })}
                    className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="أدخل رقم السجل التجاري"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 block">صورة السجل التجاري</label>
                  <label className="w-full bg-card border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary transition-colors">
                    {documentImage ? (
                      <img src={documentImage} alt="السجل" className="w-full h-32 object-contain rounded-lg" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">ارفع صورة السجل التجاري</span>
                      </>
                    )}
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleDocUpload} />
                  </label>
                </div>
              </div>
            )}

            {/* Terms & Conditions */}
            {selectedType && (
              <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold">الشروط والأحكام</h3>
                </div>
                <ul className="space-y-2">
                  {terms[selectedType].map((term, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5 shrink-0">•</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setAgreed(!agreed)}
                  className="mt-3 flex items-center gap-2 w-full"
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${agreed ? "bg-primary border-primary" : "border-border"}`}>
                    {agreed && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <span className="text-xs font-semibold">أوافق على الشروط والأحكام</span>
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-xl active:scale-[0.97] transition-transform shadow-md"
            >
              {selectedType === "retail" ? "إنشاء الحساب" : "إرسال طلب التسجيل"}
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CustomerRegistration;
