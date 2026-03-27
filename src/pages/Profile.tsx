import { ArrowRight, User, MapPin, CreditCard, Bell, LogOut, Heart, Package, Star, ChevronLeft, Gift, Moon, Sun, Info, Settings, Flame, RotateCcw, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

const menuSections = [
  {
    title: "طلباتي",
    items: [
      { icon: Package, label: "طلباتي", to: "/orders", badge: "3" },
      { icon: Heart, label: "المفضلة", to: "/wishlist", badge: "4" },
      { icon: Star, label: "تقييماتي", to: "#" },
      { icon: Flame, label: "العروض", to: "/deals" },
      { icon: RotateCcw, label: "طلبات الإرجاع", to: "/return-request" },
    ],
  },
  {
    title: "حسابي",
    items: [
      { icon: User, label: "معلوماتي الشخصية", to: "#" },
      { icon: Users, label: "نوع الحساب", to: "/customer-registration" },
      { icon: MapPin, label: "عناوين التوصيل", to: "/addresses" },
      { icon: CreditCard, label: "طرق الدفع", to: "/payment-methods" },
      { icon: Bell, label: "الإشعارات", to: "/notifications" },
    ],
  },
  {
    title: "عام",
    items: [
      { icon: Settings, label: "الإعدادات", to: "/settings" },
      { icon: Shield, label: "الشروط والأحكام", to: "/terms" },
      { icon: Info, label: "عن التطبيق", to: "/about" },
    ],
  },
];

const Profile = () => {
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <h1 className="text-base font-bold">حسابي</h1>
        <button onClick={() => navigate("/notifications")} className="relative active:scale-95 transition-transform">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-destructive text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">2</span>
        </button>
      </header>

      <div className="px-4 py-5" dir="rtl">
        <div className="bg-card rounded-xl p-4 shadow-sm flex items-center gap-4 animate-fade-in-up stagger-1">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold">أحمد محمد</h2>
            <p className="text-sm text-muted-foreground">+967 771234567</p>
            <div className="flex items-center gap-1 mt-1">
              <Gift className="w-3.5 h-3.5 text-warning" />
              <span className="text-xs font-bold text-warning">3,250 نقطة مكافأة</span>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>
      </div>

      <div className="px-4 mb-4" dir="rtl">
        <div className="grid grid-cols-3 gap-2 animate-fade-in-up stagger-2">
          {[
            { label: "الطلبات", value: "12" },
            { label: "المفضلة", value: "4" },
            { label: "التقييمات", value: "8" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-3 text-center shadow-sm">
              <p className="text-lg font-black text-primary">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="px-4 mb-4" dir="rtl">
        <button onClick={toggleDarkMode} className="w-full bg-card rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-transform animate-fade-in-up stagger-3">
          <Moon className="w-5 h-5 text-primary dark:hidden" />
          <Sun className="w-5 h-5 text-warning hidden dark:block" />
          <span className="text-sm font-medium flex-1 text-right">الوضع الداكن</span>
          <div className="w-10 h-6 bg-muted dark:bg-primary rounded-full relative transition-colors">
            <div className="absolute top-0.5 left-0.5 dark:left-auto dark:right-0.5 w-5 h-5 bg-card rounded-full shadow transition-all" />
          </div>
        </button>
      </div>

      <div className="px-4 space-y-4 pb-6" dir="rtl">
        {menuSections.map((section, si) => (
          <div key={section.title} className={`animate-fade-in-up stagger-${Math.min(si + 3, 5)}`}>
            <h3 className="text-xs font-bold text-muted-foreground mb-2 px-1">{section.title}</h3>
            <div className="bg-card rounded-xl shadow-sm overflow-hidden">
              {section.items.map(({ icon: Icon, label, to, badge }, i) => (
                <button
                  key={label}
                  onClick={() => to !== "#" && navigate(to)}
                  className={`w-full px-4 py-3.5 flex items-center gap-3 active:bg-muted/50 transition-colors ${
                    i < section.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <Icon className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium flex-1 text-right">{label}</span>
                  {badge && <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">{badge}</span>}
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <button onClick={() => navigate("/auth")} className="w-full bg-destructive/10 rounded-xl px-4 py-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform animate-fade-in-up stagger-5">
          <LogOut className="w-5 h-5 text-destructive" />
          <span className="text-sm font-medium text-destructive">تسجيل الخروج</span>
        </button>
      </div>
    </AppLayout>
  );
};

export default Profile;
