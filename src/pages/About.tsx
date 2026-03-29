import { ArrowRight, Shield, Truck, RotateCcw, Phone, Mail, MapPin, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";

const policies = [
  {
    icon: Truck,
    title: "سياسة الشحن",
    items: [
      "التوصيل خلال 2-4 أيام عمل داخل صنعاء",
      "التوصيل خلال 5-7 أيام عمل للمحافظات",
      "شحن مجاني للطلبات فوق SAR 500",
      "رسوم شحن SAR 25 للطلبات الأقل",
    ],
  },
  {
    icon: RotateCcw,
    title: "سياسة الإرجاع",
    items: [
      "إمكانية الإرجاع خلال 7 أيام من الاستلام",
      "المنتج يجب أن يكون بحالته الأصلية",
      "استرداد المبلغ خلال 3-5 أيام عمل",
      "القطع الكهربائية غير قابلة للإرجاع بعد التركيب",
    ],
  },
  {
    icon: Shield,
    title: "ضمان الجودة",
    items: [
      "جميع القطع أصلية أو بجودة OEM",
      "ضمان 6 أشهر على جميع المنتجات",
      "ضمان سنة على قطع المحرك الأساسية",
      "شهادات جودة معتمدة",
    ],
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <h1 className="text-base font-bold">عن التطبيق</h1>
        <div className="w-5" />
      </header>

      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* App Info */}
        <div className="bg-card rounded-xl p-4 shadow-sm text-center animate-fade-in-up stagger-1">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🔧</span>
          </div>
          <h2 className="text-lg font-bold mb-1">قطع غيار اليمن</h2>
          <p className="text-xs text-muted-foreground">الإصدار 1.0.0</p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            منصتك الأولى لقطع غيار السيارات في اليمن. نوفر لك قطع أصلية وبديلة بجودة عالية مع توصيل سريع لجميع المحافظات.
          </p>
        </div>

        {/* Policies */}
        {policies.map((policy, i) => (
          <div key={policy.title} className={`bg-card rounded-xl p-4 shadow-sm animate-fade-in-up stagger-${Math.min(i + 2, 5)}`}>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
              <policy.icon className="w-4 h-4 text-primary" />
              {policy.title}
            </h3>
            <ul className="space-y-2">
              {policy.items.map((item) => (
                <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div className="bg-card rounded-xl p-4 shadow-sm animate-fade-in-up stagger-5">
          <h3 className="text-sm font-bold mb-3">تواصل معنا</h3>
          <div className="space-y-3">
            <a href="tel:+967771234567" className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span>+967 77 123 4567</span>
            </a>
            <a href="mailto:support@yemenparts.com" className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-primary" />
              <span>support@yemenparts.com</span>
            </a>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span>صنعاء، شارع الستين</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default About;
