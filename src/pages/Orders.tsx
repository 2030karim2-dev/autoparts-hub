import { useState } from "react";
import { ArrowRight, Filter, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import shockAbsorbers from "@/assets/shock-absorbers.png";
import airFilter from "@/assets/air-filter.png";
import controlArm from "@/assets/control-arm.png";
import brakePads from "@/assets/brake-pads.png";

const tabs = ["الكل", "قيد التنفيذ", "تم الشحن", "تم التوصيل", "ملغاة"];

type OrderStatus = "shipped" | "delivered";

interface Order {
  id: string;
  status: OrderStatus;
  statusLabel: string;
  time: string;
  est?: string;
  items: { name: string; oem: string; qty: number; price: number; image: string }[];
  total: number;
}

const orders: Order[] = [
  {
    id: "#513468",
    status: "shipped",
    statusLabel: "تم الشحن",
    time: "منذ 4 ساعات",
    est: "28 أبريل - 29 أبريل",
    items: [
      { name: "ممتصات صدمات", oem: "", qty: 1, price: 220, image: shockAbsorbers },
      { name: "فلتر هواء", oem: "", qty: 1, price: 55.50, image: airFilter },
    ],
    total: 635.85,
  },
  {
    id: "#512906",
    status: "shipped",
    statusLabel: "تم الشحن",
    time: "منذ يوم",
    est: "27 أبريل - 28 أبريل",
    items: [{ name: "ذراع تحكم", oem: "OEM 54500-D3100", qty: 1, price: 132, image: controlArm }],
    total: 132,
  },
  {
    id: "#510453",
    status: "delivered",
    statusLabel: "تم التوصيل",
    time: "23 أبريل 7:10 م",
    items: [{ name: "فحمات فرامل خلفية", oem: "OEM 58302-0WA00", qty: 1, price: 220, image: brakePads }],
    total: 220,
  },
];

const statusColors: Record<OrderStatus, string> = {
  shipped: "text-warning bg-warning/10 border-warning/20",
  delivered: "text-success bg-success/10 border-success/20",
};

const Orders = () => {
  const [activeTab, setActiveTab] = useState(2);
  const navigate = useNavigate();

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)]">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold">الطلبات</h1>
        <button className="active:scale-95 transition-transform">
          <Filter className="w-5 h-5" />
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 px-4 py-3 overflow-x-auto scrollbar-hide" dir="rtl">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              activeTab === i
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="px-4 space-y-3 pb-4" dir="rtl">
        {orders.map((order) => (
          <div key={order.id} className="bg-card rounded-xl shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{order.id}</span>
                <span className="text-xs text-muted-foreground">{order.statusLabel}</span>
              </div>
              <span className="text-xs text-muted-foreground">{order.time}</span>
            </div>

            {order.est && (
              <div className="px-4 py-2 bg-primary/5 text-xs flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-primary" />
                <span>التوصيل المتوقع بين <strong>{order.est}</strong></span>
              </div>
            )}

            {/* Progress for shipped */}
            {order.status === "shipped" && order.items.length > 1 && (
              <div className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="h-1 flex-1 bg-primary rounded-full" />
                  <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary-foreground shadow" />
                  <div className="h-1 flex-1 bg-muted rounded-full" />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>قيد التنفيذ</span>
                  <span className="font-semibold text-primary">تم الشحن</span>
                  <span>تم التوصيل</span>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="px-4 py-3">
              {order.items.length > 1 ? (
                <div className="flex items-center gap-2">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-xs text-primary font-medium">+{order.items.length - 3} منتجات أخرى</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                    <img src={order.items[0].image} alt="" className="w-10 h-10 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{order.items[0].name} {order.items[0].oem && `[${order.items[0].oem}]`}</p>
                    <p className="text-xs text-muted-foreground">الكمية: {order.items[0].qty}</p>
                  </div>
                  <p className="text-sm font-bold shrink-0">SAR {order.items[0].price}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                {order.items.length > 1 && <span className="text-sm font-bold">الإجمالي: SAR {order.total}</span>}
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusColors[order.status]}`}>
                  {order.status === "shipped" ? "● في الطريق" : "✓ تم التوصيل"}
                </span>
              </div>
              <div className="flex gap-2">
                {order.status === "delivered" && (
                  <button className="text-xs font-semibold border border-primary text-primary px-3 py-1.5 rounded-lg active:scale-95 transition-transform">
                    إعادة الطلب
                  </button>
                )}
                <button className="text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg active:scale-95 transition-transform flex items-center gap-1">
                  {order.status === "shipped" ? (
                    <><Truck className="w-3 h-3" /> تتبع الطلب</>
                  ) : (
                    "عرض الطلب"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default Orders;
