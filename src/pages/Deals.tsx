import { useState, useEffect } from "react";
import { ArrowRight, Star, Clock, Flame, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const flashDeals = products.filter((p) => p.discount && p.discount >= 20).slice(0, 4);
const weeklyDeals = products.filter((p) => p.discount).slice(0, 6);

const useCountdown = (hours: number) => {
  const [timeLeft, setTimeLeft] = useState(hours * 3600);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;
  return { h, m, s };
};

const CountdownBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <span className="bg-primary text-primary-foreground text-sm font-black w-9 h-9 rounded-lg flex items-center justify-center">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[9px] text-muted-foreground mt-0.5">{label}</span>
  </div>
);

const Deals = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const countdown = useCountdown(6);

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <h1 className="text-base font-bold flex items-center gap-1.5"><Flame className="w-4 h-4" /> العروض والتخفيضات</h1>
        <div className="w-5" />
      </header>

      <div className="px-4 py-4 space-y-5" dir="rtl">
        {/* Flash Deals */}
        <section className="animate-fade-in-up stagger-1">
          <div className="bg-gradient-to-l from-destructive/10 to-warning/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-destructive" />
                <h2 className="text-base font-black">عروض فلاش</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <div className="flex items-center gap-1">
                  <CountdownBox value={countdown.h} label="ساعة" />
                  <span className="text-primary font-bold text-lg mb-3">:</span>
                  <CountdownBox value={countdown.m} label="دقيقة" />
                  <span className="text-primary font-bold text-lg mb-3">:</span>
                  <CountdownBox value={countdown.s} label="ثانية" />
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
              {flashDeals.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="bg-card rounded-xl shadow-sm p-2.5 min-w-[150px] shrink-0 cursor-pointer active:scale-[0.97] transition-transform"
                >
                  <div className="w-full aspect-square bg-secondary rounded-lg flex items-center justify-center mb-2 relative">
                    <img src={item.image} alt={item.name} className="w-3/4 h-3/4 object-contain" />
                    <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
                      -{item.discount}%
                    </span>
                  </div>
                  <h3 className="text-[11px] font-semibold leading-tight mb-1 line-clamp-1">{item.name}</h3>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-black">SAR {item.price}</span>
                    <span className="text-[10px] text-muted-foreground line-through">SAR {item.oldPrice}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); addItem(item); toast.success("تمت الإضافة"); }}
                    className="w-full bg-primary text-primary-foreground text-[10px] font-bold py-1.5 rounded-lg active:scale-95 transition-transform"
                  >
                    أضف للسلة
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coupon Banner */}
        <section className="animate-fade-in-up stagger-2">
          <div className="bg-gradient-to-l from-primary/15 to-primary/5 rounded-xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Percent className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold mb-0.5">استخدم كوبون YEMEN25</p>
              <p className="text-xs text-muted-foreground">واحصل على خصم 25% على طلبك القادم</p>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText("YEMEN25"); toast.success("تم نسخ الكوبون"); }}
              className="bg-primary text-primary-foreground text-[11px] font-bold px-3 py-2 rounded-lg active:scale-95 transition-transform shrink-0"
            >
              نسخ
            </button>
          </div>
        </section>

        {/* Weekly Deals */}
        <section className="animate-fade-in-up stagger-3">
          <h2 className="text-base font-bold mb-3 flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-primary" /> عروض الأسبوع
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {weeklyDeals.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                className="bg-card rounded-xl shadow-sm p-2.5 cursor-pointer active:scale-[0.97] transition-transform"
              >
                <div className="w-full aspect-square bg-secondary rounded-lg flex items-center justify-center mb-2 relative">
                  <img src={item.image} alt={item.name} className="w-3/4 h-3/4 object-contain" />
                  {item.discount && (
                    <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
                      -{item.discount}%
                    </span>
                  )}
                </div>
                <h3 className="text-[11px] font-semibold leading-tight mb-0.5 line-clamp-2">{item.name}</h3>
                <div className="flex items-center gap-0.5 mb-1">
                  <Star className="w-2.5 h-2.5 fill-warning text-warning" />
                  <span className="text-[10px] font-medium">{item.rating}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black">SAR {item.price}</span>
                  {item.oldPrice && <span className="text-[10px] text-muted-foreground line-through">SAR {item.oldPrice}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Free Shipping Banner */}
        <section className="animate-fade-in-up stagger-4">
          <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-center">
            <p className="text-sm font-bold text-success mb-1">🚛 شحن مجاني</p>
            <p className="text-xs text-muted-foreground">على جميع الطلبات بقيمة 500 ريال وأكثر</p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Deals;
