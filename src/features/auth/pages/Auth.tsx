import { useState } from "react";
import { Eye, EyeOff, Phone, Lock, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background flex flex-col">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground px-6 pt-12 pb-10 rounded-b-3xl relative">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔧</span>
          </div>
          <h1 className="text-xl font-black mb-1">قطع غيار اليمن</h1>
          <p className="text-sm opacity-80">أكبر متجر لقطع غيار السيارات</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mx-6 mt-6 bg-muted rounded-xl p-1 gap-1" dir="rtl">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 text-sm font-bold py-2.5 rounded-lg transition-all ${
            mode === "login" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          تسجيل الدخول
        </button>
        <button
          onClick={() => setMode("register")}
          className={`flex-1 text-sm font-bold py-2.5 rounded-lg transition-all ${
            mode === "register" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          حساب جديد
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 pt-6 space-y-4 flex-1" dir="rtl">
        {mode === "register" && (
          <div className="animate-fade-in-up">
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 rounded-xl bg-card border border-border pr-10 pl-3 text-sm outline-none focus:border-primary transition-colors"
                placeholder="أدخل اسمك الكامل"
              />
            </div>
          </div>
        )}

        <div className="animate-fade-in-up stagger-1">
          <label className="text-xs font-bold text-muted-foreground mb-1.5 block">رقم الهاتف</label>
          <div className="relative flex gap-2">
            <div className="flex items-center gap-1 bg-card border border-border rounded-xl px-3 h-12 shrink-0">
              <span className="text-sm">🇾🇪</span>
              <span className="text-sm font-semibold">+967</span>
            </div>
            <div className="relative flex-1">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-12 rounded-xl bg-card border border-border pr-10 pl-3 text-sm outline-none focus:border-primary transition-colors"
                placeholder="7XXXXXXXX"
                type="tel"
                maxLength={9}
              />
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up stagger-2">
          <label className="text-xs font-bold text-muted-foreground mb-1.5 block">كلمة المرور</label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              className="w-full h-12 rounded-xl bg-card border border-border pr-10 pl-10 text-sm outline-none focus:border-primary transition-colors"
              placeholder="أدخل كلمة المرور"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2">
              {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>
        </div>

        {mode === "login" && (
          <div className="text-left">
            <button type="button" className="text-xs text-primary font-semibold">نسيت كلمة المرور؟</button>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-xl active:scale-[0.97] transition-transform shadow-md animate-fade-in-up stagger-3"
        >
          {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
        </button>

        {mode === "register" && (
          <p className="text-[11px] text-muted-foreground text-center leading-relaxed animate-fade-in-up stagger-4">
            بالتسجيل أنت توافق على <span className="text-primary font-semibold">الشروط والأحكام</span> و<span className="text-primary font-semibold">سياسة الخصوصية</span>
          </p>
        )}
      </form>

      {/* Social / Divider */}
      <div className="px-6 py-6 space-y-4" dir="rtl">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">أو</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <button className="w-full border border-border bg-card text-foreground font-semibold text-sm py-3 rounded-xl active:scale-[0.97] transition-transform flex items-center justify-center gap-2">
          <span className="text-lg">G</span>
          المتابعة مع Google
        </button>
      </div>
    </div>
  );
};

export default Auth;
