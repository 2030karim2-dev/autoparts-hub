import { ArrowRight, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

const Chat = () => {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)]">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <h1 className="text-base font-bold">المحادثة</h1>
        <div className="w-5" />
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center" dir="rtl">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Send className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-lg font-bold mb-1">مرحباً بك في الدعم</h2>
        <p className="text-sm text-muted-foreground">أرسل لنا رسالة وسنرد عليك في أقرب وقت</p>
      </div>
      <div className="sticky bottom-[var(--bottom-nav-height)] bg-card border-t border-border px-4 py-3 flex gap-2" dir="rtl">
        <input className="flex-1 h-10 rounded-lg bg-secondary px-3 text-sm outline-none" placeholder="اكتب رسالتك..." />
        <button className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center active:scale-95 transition-transform">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </AppLayout>
  );
};

export default Chat;
