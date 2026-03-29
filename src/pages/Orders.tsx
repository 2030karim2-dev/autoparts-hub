import { useState } from "react";
import { ArrowRight, Filter, Truck, RotateCcw, Eye, Package, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { SkeletonOrderCard } from "@/components/product/SkeletonCard";
import shockAbsorbers from "@/assets/shock-absorbers.png";
import airFilter from "@/assets/air-filter.png";
import controlArm from "@/assets/control-arm.png";
import brakePads from "@/assets/brake-pads.png";
import oilFilter from "@/assets/oil-filter.png";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import { toast } from "sonner";

const tabs = ["الكل", "قيد التنفيذ", "تم الشحن", "تم التوصيل", "ملغاة"];

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem { name: string; oem: string; qty: number; price: number; image: string; productId?: string }

interface Order {
  id: string;
  status: OrderStatus;
  statusLabel: string;
  time: string;
  date: string;
  est?: string;
  items: OrderItem[];
  total: number;
}

const orders: Order[] = [
  {
    id: "#513468",
    status: "processing",
    statusLabel: "قيد التنفيذ",
    time: "منذ ساعة",
    date: "26 مارس 2026",
    items: [
      { name: "فلتر زيت", oem: "26300-35504", qty: 2, price: 24.75, image: oilFilter, productId: "oil-1" },
    ],
    total: 56.93,
  },
  {
    id: "#513400",
    status: "shipped",
    statusLabel: "تم الشحن",
    time: "منذ 4 ساعات",
    date: "25 مارس 2026",
    est: "28 مارس - 29 مارس",
    items: [
      { name: "ممتصات صدمات", oem: "54660-D3100", qty: 1, price: 220, image: shockAbsorbers, productId: "shock-1" },
      { name: "فلتر هواء", oem: "97133-D3000", qty: 1, price: 55.50, image: airFilter, productId: "filter-1" },
    ],
    total: 635.85,
  },
  {
    id: "#512906",
    status: "shipped",
    statusLabel: "تم الشحن",
    time: "منذ يوم",
    date: "24 مارس 2026",
    est: "27 مارس - 28 مارس",
    items: [{ name: "ذراع تحكم", oem: "54500-D3100", qty: 1, price: 132, image: controlArm, productId: "control-1" }],
    total: 132,
  },
  {
    id: "#510453",
    status: "delivered",
    statusLabel: "تم التوصيل",
    time: "23 مارس 7:10 م",
    date: "23 مارس 2026",
    items: [{ name: "فحمات فرامل خلفية", oem: "58101-D3A70", qty: 1, price: 185, image: brakePads, productId: "brake-1" }],
    total: 185,
  },
  {
    id: "#509100",
    status: "cancelled",
    statusLabel: "ملغاة",
    time: "20 مارس",
    date: "20 مارس 2026",
    items: [{ name: "مصباح أمامي LED", oem: "92101-D3100", qty: 1, price: 450, image: shockAbsorbers }],
    total: 450,
  },
];

const statusConfig: Record<OrderStatus, { color: string; icon: typeof Clock; progressStep: number }> = {
  processing: { color: "text-warning bg-warning/10 border-warning/20", icon: Clock, progressStep: 0 },
  shipped: { color: "text-primary bg-primary/10 border-primary/20", icon: Truck, progressStep: 1 },
  delivered: { color: "text-success bg-success/10 border-success/20", icon: CheckCircle2, progressStep: 2 },
  cancelled: { color: "text-destructive bg-destructive/10 border-destructive/20", icon: XCircle, progressStep: -1 },
};

const progressSteps = ["قيد التنفيذ", "تم الشحن", "تم التوصيل"];

const Orders = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const { addItem } = useCart();

  const filteredOrders = activeTab === 0
    ? orders
    : orders.filter((o) => {
        const map: Record<number, OrderStatus> = { 1: "processing", 2: "shipped", 3: "delivered", 4: "cancelled" };
        return o.status === map[activeTab];
      });

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      if (item.productId) {
        const product = products.find((p) => p.id === item.productId);
        if (product) addItem(product, item.qty);
      }
    });
    toast.success("تمت إضافة المنتجات للسلة");
    navigate("/cart");
  };

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <h1 className="text-base font-bold">طلباتي</h1>
        <button className="active:scale-95 transition-transform"><Filter className="w-5 h-5" /></button>
      </header>

      <div className="flex gap-1 px-4 py-3 overflow-x-auto scrollbar-hide" dir="rtl">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${activeTab === i ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
            {tab}
            {i === 0 && <span className="mr-1 text-[10px] opacity-70">({orders.length})</span>}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3 pb-4" dir="rtl">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <h3 className="text-base font-bold mb-1">لا توجد طلبات</h3>
            <p className="text-sm text-muted-foreground">لم يتم العثور على طلبات في هذا التصنيف</p>
          </div>
        ) : (
          filteredOrders.map((order, idx) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;

            return (
              <div key={order.id} className={`bg-card rounded-xl shadow-sm overflow-hidden animate-fade-in-up stagger-${Math.min(idx + 1, 5)}`}>
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{order.id}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${config.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {order.statusLabel}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{order.time}</span>
                </div>

                {order.est && (
                  <div className="px-4 py-2 bg-primary/5 text-xs flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-primary" />
                    <span>التوصيل المتوقع: <strong>{order.est}</strong></span>
                  </div>
                )}

                {/* Progress bar for non-cancelled */}
                {order.status !== "cancelled" && (
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      {progressSteps.map((step, i) => (
                        <div key={step} className="flex items-center flex-1 last:flex-initial">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                            i <= config.progressStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}>
                            {i < config.progressStep ? "✓" : i + 1}
                          </div>
                          {i < progressSteps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 rounded-full ${i < config.progressStep ? "bg-primary" : "bg-muted"}`} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-1">
                      {progressSteps.map((step, i) => (
                        <span key={step} className={`text-[9px] ${i <= config.progressStep ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                          {step}
                        </span>
                      ))}
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
                      <span className="text-xs text-muted-foreground font-medium">{order.items.length} منتجات</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                        <img src={order.items[0].image} alt="" className="w-10 h-10 object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{order.items[0].name}</p>
                        <p className="text-[11px] text-muted-foreground">OEM: {order.items[0].oem} × {order.items[0].qty}</p>
                      </div>
                      <p className="text-sm font-bold shrink-0">SAR {order.items[0].price}</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-bold">SAR {order.total.toFixed(2)}</span>
                  <div className="flex gap-2">
                    {order.status === "delivered" && (
                      <button onClick={() => handleReorder(order)} className="text-xs font-semibold border border-primary text-primary px-3 py-1.5 rounded-lg active:scale-95 transition-transform flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" /> إعادة الطلب
                      </button>
                    )}
                    {order.status === "shipped" && (
                      <button onClick={() => navigate(`/order-tracking/${order.id.replace("#", "")}`)} className="text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg active:scale-95 transition-transform flex items-center gap-1">
                        <Truck className="w-3 h-3" /> تتبع
                      </button>
                    )}
                    <button className="text-xs font-semibold bg-muted text-muted-foreground px-3 py-1.5 rounded-lg active:scale-95 transition-transform flex items-center gap-1">
                      <Eye className="w-3 h-3" /> التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </AppLayout>
  );
};

export default Orders;
