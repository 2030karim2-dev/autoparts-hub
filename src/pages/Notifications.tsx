import { useState } from "react";
import { ArrowRight, Bell, Package, Truck, Tag, CheckCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";

interface Notification {
  id: string;
  type: "order" | "shipping" | "offer" | "delivered";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: "1", type: "shipping", title: "الشحنة في الطريق", message: "الطلب #514892 في طريقه إليك. التوصيل المتوقع غداً", time: "منذ 10 دقائق", read: false },
  { id: "2", type: "offer", title: "عرض خاص 🔥", message: "خصم 40% على فحمات الفرامل الأصلية. العرض لفترة محدودة!", time: "منذ ساعة", read: false },
  { id: "3", type: "order", title: "تم تأكيد الطلب", message: "طلبك #514892 تم تأكيده وجاري التجهيز", time: "منذ 3 ساعات", read: true },
  { id: "4", type: "delivered", title: "تم التوصيل ✓", message: "الطلب #512906 تم توصيله بنجاح. قيّم تجربتك", time: "أمس", read: true },
  { id: "5", type: "offer", title: "منتجات جديدة", message: "تم إضافة قطع غيار جديدة لـ Hyundai Tucson. اطلع عليها الآن", time: "منذ يومين", read: true },
];

const typeConfig = {
  order: { icon: Package, color: "bg-primary/10 text-primary" },
  shipping: { icon: Truck, color: "bg-warning/10 text-warning" },
  offer: { icon: Tag, color: "bg-success/10 text-success" },
  delivered: { icon: CheckCircle, color: "bg-success/10 text-success" },
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold">الإشعارات</h1>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs font-medium bg-primary-foreground/20 px-2 py-0.5 rounded-full">
            قراءة الكل
          </button>
        )}
        {unreadCount === 0 && <div className="w-5" />}
      </header>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center" dir="rtl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Bell className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-lg font-bold mb-1">لا توجد إشعارات</h2>
          <p className="text-sm text-muted-foreground">ستصلك إشعارات عن طلباتك والعروض الجديدة</p>
        </div>
      ) : (
        <div className="px-4 py-3 space-y-2" dir="rtl">
          {notifications.map((notif, i) => {
            const config = typeConfig[notif.type];
            const Icon = config.icon;
            return (
              <div
                key={notif.id}
                className={`bg-card rounded-xl p-3 flex gap-3 shadow-sm animate-fade-in-up stagger-${Math.min(i + 1, 5)} ${
                  !notif.read ? "border-r-[3px] border-primary" : ""
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className={`text-sm truncate ${!notif.read ? "font-bold" : "font-semibold"}`}>{notif.title}</h3>
                    <button onClick={() => removeNotification(notif.id)} className="text-muted-foreground active:scale-90 shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-1">{notif.message}</p>
                  <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default Notifications;
