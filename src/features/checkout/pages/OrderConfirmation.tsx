import { CheckCircle, Package, ArrowRight, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const orderNumber = "#514892";

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center" dir="rtl">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-5 animate-fade-in"><CheckCircle className="w-12 h-12 text-success" /></div>
        <h1 className="text-xl font-black mb-2 animate-fade-in-up stagger-1">تم تأكيد الطلب بنجاح! 🎉</h1>
        <p className="text-sm text-muted-foreground mb-6 animate-fade-in-up stagger-2">شكراً لك، سيتم معالجة طلبك وشحنه في أقرب وقت</p>
        <div className="bg-card rounded-xl p-4 shadow-sm w-full mb-4 animate-fade-in-up stagger-3">
          <p className="text-xs text-muted-foreground mb-1">رقم الطلب</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-black text-primary">{orderNumber}</span>
            <button className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center active:scale-95 transition-transform"><Copy className="w-4 h-4 text-primary" /></button>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm w-full space-y-3 mb-4 animate-fade-in-up stagger-4">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">الإجمالي</span><span className="font-bold">SAR 493.63</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">طريقة الدفع</span><span className="font-semibold">الدفع عند الاستلام</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">التوصيل المتوقع</span><span className="font-semibold">2-4 أيام عمل</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">العنوان</span><span className="font-semibold text-left">صنعاء، شارع الستين</span></div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm w-full mb-6 animate-fade-in-up stagger-5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center"><CheckCircle className="w-4 h-4 text-success-foreground" /></div>
              <div className="w-0.5 h-8 bg-muted" />
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center"><Package className="w-4 h-4 text-muted-foreground" /></div>
            </div>
            <div className="flex-1 space-y-6">
              <div><p className="text-sm font-bold text-success">تم تأكيد الطلب</p><p className="text-xs text-muted-foreground">الآن</p></div>
              <div><p className="text-sm font-semibold text-muted-foreground">قيد التجهيز</p><p className="text-xs text-muted-foreground">في الانتظار</p></div>
            </div>
          </div>
        </div>
        <div className="w-full space-y-2">
          <button onClick={() => navigate("/order-tracking/514892")} className="w-full bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-xl active:scale-[0.97] transition-transform shadow-md flex items-center justify-center gap-2"><Package className="w-4 h-4" /> تتبع الطلب</button>
          <button onClick={() => navigate("/")} className="w-full border-2 border-primary text-primary font-bold text-sm py-3.5 rounded-xl active:scale-[0.97] transition-transform flex items-center justify-center gap-2"><ArrowRight className="w-4 h-4 rotate-180" /> متابعة التسوق</button>
        </div>
      </div>
    </AppLayout>
  );
};

export default OrderConfirmation;
