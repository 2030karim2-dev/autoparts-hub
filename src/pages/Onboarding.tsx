import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Truck, Shield, ChevronLeft } from "lucide-react";

const slides = [
  {
    icon: Search,
    title: "ابحث عن قطعتك بسهولة",
    desc: "ابحث برقم OEM أو اسم القطعة أو اختر موديل سيارتك وسنعرض لك القطع المتوافقة",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Shield,
    title: "جودة مضمونة",
    desc: "جميع القطع أصلية أو بجودة OEM مع ضمان يصل إلى سنة كاملة",
    color: "bg-success/10 text-success",
  },
  {
    icon: Truck,
    title: "توصيل سريع لكل اليمن",
    desc: "نوصل لجميع المحافظات اليمنية مع إمكانية الدفع عند الاستلام",
    color: "bg-warning/10 text-warning",
  },
];

const Onboarding = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      localStorage.setItem("onboarding_done", "1");
      navigate("/");
    }
  };

  const skip = () => {
    localStorage.setItem("onboarding_done", "1");
    navigate("/");
  };

  const slide = slides[current];

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background flex flex-col" dir="rtl">
      {/* Skip */}
      <div className="flex justify-start px-4 pt-4">
        <button onClick={skip} className="text-sm text-muted-foreground font-medium flex items-center gap-0.5">
          تخطي <ChevronLeft className="w-3 h-3" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center animate-fade-in-up" key={current}>
        <div className={`w-24 h-24 rounded-3xl ${slide.color} flex items-center justify-center mb-8`}>
          <slide.icon className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-black mb-3 leading-tight">{slide.title}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">{slide.desc}</p>
      </div>

      {/* Dots & Button */}
      <div className="px-6 pb-10 space-y-6">
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-full bg-primary text-primary-foreground font-bold text-sm py-4 rounded-2xl active:scale-[0.97] transition-transform shadow-lg"
        >
          {current < slides.length - 1 ? "التالي" : "ابدأ التسوق"}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
