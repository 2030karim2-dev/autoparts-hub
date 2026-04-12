import { ArrowRight, Moon, Sun, Bell, Globe, Shield, Trash2, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains("dark"));
  const [pushNotifications, setPushNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promoNotifications, setPromoNotifications] = useState(false);
  const [language, setLanguage] = useState("ar");

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <h1 className="text-base font-bold">الإعدادات</h1>
        <div className="w-5" />
      </header>

      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Appearance */}
        <section className="animate-fade-in-up stagger-1">
          <h3 className="text-xs font-bold text-muted-foreground mb-2 px-1">المظهر</h3>
          <div className="bg-card rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-warning" />}
              <span className="text-sm font-medium flex-1">الوضع الداكن</span>
              <Switch checked={darkMode} onCheckedChange={toggleDark} />
            </div>
          </div>
        </section>

        {/* Language */}
        <section className="animate-fade-in-up stagger-2">
          <h3 className="text-xs font-bold text-muted-foreground mb-2 px-1">اللغة</h3>
          <div className="bg-card rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium flex-1">لغة التطبيق</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm bg-muted px-3 py-1.5 rounded-lg outline-none"
                dir="rtl"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="animate-fade-in-up stagger-3">
          <h3 className="text-xs font-bold text-muted-foreground mb-2 px-1">الإشعارات</h3>
          <div className="bg-card rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 flex items-center gap-3 border-b border-border">
              <Bell className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium flex-1">إشعارات الدفع</span>
              <Switch checked={pushNotifications} onCheckedChange={() => setPushNotifications(!pushNotifications)} />
            </div>
            <div className="px-4 py-3.5 flex items-center gap-3 border-b border-border">
              <Bell className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium flex-1">تحديثات الطلبات</span>
              <Switch checked={orderUpdates} onCheckedChange={() => setOrderUpdates(!orderUpdates)} />
            </div>
            <div className="px-4 py-3.5 flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium flex-1">العروض والخصومات</span>
              <Switch checked={promoNotifications} onCheckedChange={() => setPromoNotifications(!promoNotifications)} />
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="animate-fade-in-up stagger-4">
          <h3 className="text-xs font-bold text-muted-foreground mb-2 px-1">الخصوصية والأمان</h3>
          <div className="bg-card rounded-xl shadow-sm overflow-hidden">
            <button className="w-full px-4 py-3.5 flex items-center gap-3 border-b border-border active:bg-muted/50 transition-colors">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium flex-1 text-right">تغيير كلمة المرور</span>
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-full px-4 py-3.5 flex items-center gap-3 active:bg-muted/50 transition-colors">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium flex-1 text-right">سياسة الخصوصية</span>
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* Danger zone */}
        <section className="animate-fade-in-up stagger-5">
          <button className="w-full bg-destructive/10 rounded-xl px-4 py-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform">
            <Trash2 className="w-5 h-5 text-destructive" />
            <span className="text-sm font-medium text-destructive">حذف الحساب</span>
          </button>
        </section>

        <p className="text-center text-xs text-muted-foreground pt-4">الإصدار 1.0.0</p>
      </div>
    </AppLayout>
  );
};

export default Settings;
