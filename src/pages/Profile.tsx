import { ArrowRight, User, Settings, MapPin, CreditCard, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

const menuItems = [
  { icon: User, label: "معلوماتي الشخصية" },
  { icon: MapPin, label: "عناوين التوصيل" },
  { icon: CreditCard, label: "طرق الدفع" },
  { icon: Bell, label: "الإشعارات" },
  { icon: Settings, label: "الإعدادات" },
];

const Profile = () => {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)]">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <h1 className="text-base font-bold">حسابي</h1>
        <div className="w-5" />
      </header>
      <div className="px-4 py-6 flex flex-col items-center" dir="rtl">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <User className="w-9 h-9 text-primary" />
        </div>
        <h2 className="text-lg font-bold">أحمد محمد</h2>
        <p className="text-sm text-muted-foreground">ahmed@example.com</p>
      </div>
      <div className="px-4 space-y-2 pb-6" dir="rtl">
        {menuItems.map(({ icon: Icon, label }) => (
          <button key={label} className="w-full bg-card rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-transform">
            <Icon className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{label}</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground mr-auto rotate-180" />
          </button>
        ))}
        <button className="w-full bg-destructive/10 rounded-xl px-4 py-3.5 flex items-center gap-3 mt-4 active:scale-[0.98] transition-transform">
          <LogOut className="w-5 h-5 text-destructive" />
          <span className="text-sm font-medium text-destructive">تسجيل الخروج</span>
        </button>
      </div>
    </AppLayout>
  );
};

export default Profile;
