import { ArrowRight, Package, CheckCircle, Truck, MapPin, Phone, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

const steps = [
  { label: "تم تأكيد الطلب", time: "اليوم 10:30 ص", done: true, icon: CheckCircle },
  { label: "قيد التجهيز", time: "اليوم 11:15 ص", done: true, icon: Package },
  { label: "تم الشحن", time: "اليوم 2:00 م", done: true, icon: Truck },
  { label: "في الطريق إليك", time: "متوقع غداً", done: false, icon: Truck },
  { label: "تم التوصيل", time: "", done: false, icon: MapPin },
];

const OrderTracking = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold">تتبع الطلب</h1>
        <div className="w-5" />
      </header>

      <div className="px-4 py-4" dir="rtl">
        {/* Order Info */}
        <div className="bg-card rounded-xl p-4 shadow-sm mb-4 animate-fade-in-up stagger-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">الطلب #514892</span>
            <span className="text-xs font-bold text-warning bg-warning/10 px-2 py-0.5 rounded-full">● في الطريق</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">التوصيل المتوقع</span>
            <span className="font-semibold">غداً 28 مارس</span>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-card rounded-xl overflow-hidden shadow-sm mb-4 animate-fade-in-up stagger-2">
          <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }} />
            <div className="text-center z-10">
              <Truck className="w-10 h-10 text-primary mx-auto mb-2" />
              <p className="text-xs font-semibold text-primary">الشحنة في الطريق</p>
              <p className="text-[10px] text-muted-foreground">صنعاء ← شارع الستين</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-xl p-4 shadow-sm mb-4 animate-fade-in-up stagger-3">
          <h3 className="text-sm font-bold mb-4">مراحل الطلب</h3>
          <div className="space-y-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === steps.length - 1;
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      step.done ? "bg-success" : "bg-muted"
                    }`}>
                      <Icon className={`w-4 h-4 ${step.done ? "text-success-foreground" : "text-muted-foreground"}`} />
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 h-8 ${step.done ? "bg-success" : "bg-muted"}`} />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={`text-sm font-bold ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                    {step.time && <p className="text-xs text-muted-foreground">{step.time}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver Info */}
        <div className="bg-card rounded-xl p-4 shadow-sm mb-4 animate-fade-in-up stagger-4">
          <h3 className="text-sm font-bold mb-3">مندوب التوصيل</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">أحمد العمري</p>
              <p className="text-xs text-muted-foreground">سائق توصيل • تقييم 4.9 ⭐</p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center active:scale-95 transition-transform">
                <Phone className="w-4 h-4 text-success" />
              </button>
              <button className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center active:scale-95 transition-transform">
                <MessageCircle className="w-4 h-4 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default OrderTracking;
