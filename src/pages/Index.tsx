import { Search, ScanBarcode, Camera, FileText, LayoutGrid, ChevronRight, Star, ShoppingCart } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import sparkPlug from "@/assets/spark-plug.png";
import brakePads from "@/assets/brake-pads.png";
import headlight from "@/assets/headlight.png";
import controlArm from "@/assets/control-arm.png";
import engineMount from "@/assets/engine-mount.png";
import airFilter from "@/assets/air-filter.png";
import shockAbsorbers from "@/assets/shock-absorbers.png";
import oilFilter from "@/assets/oil-filter.png";

const categories = [
  { name: "شمعات إشعال", image: sparkPlug },
  { name: "فحمات فرامل", image: brakePads },
  { name: "إضاءة", image: headlight },
  { name: "ذراع تحكم", image: controlArm },
  { name: "قاعدة محرك", image: engineMount },
  { name: "فلتر هواء", image: airFilter },
];

const recommended = [
  { name: "ممتصات صدمات أمامية", compat: "توسان 2016-2020", oldPrice: 340, price: 220, discount: 35, image: shockAbsorbers },
  { name: "فلتر هواء المقصورة", compat: "توسان 2016-2021", oldPrice: 79.30, price: 55.50, discount: 30, rating: 5, image: airFilter },
];

const deals = [
  { name: "فلتر زيت", price: 24.75, oldPrice: 19.90, image: oilFilter },
];

const Index = () => (
  <AppLayout>
    {/* Header */}
    <header className="bg-primary text-primary-foreground px-4 pt-3 pb-5 rounded-b-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>🇸🇦</span>
          <span>SAR</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">SAR</span>
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-destructive text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full h-10 rounded-lg bg-card text-card-foreground pr-9 pl-3 text-sm placeholder:text-muted-foreground outline-none"
            placeholder="ادخل اسم القطعة او OEM / SKU"
            dir="rtl"
          />
        </div>
        <button className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center shrink-0">
          <Camera className="w-5 h-5" />
        </button>
      </div>
    </header>

    {/* Vehicle Selector */}
    <div className="mx-4 -mt-3 bg-card rounded-xl p-3 shadow-sm flex items-center justify-between" dir="rtl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">🚗</div>
        <div>
          <p className="text-sm font-semibold">2018 Hyundai Tucson 2.0 L</p>
          <p className="text-xs text-muted-foreground">تغيير المركبة</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground rotate-180" />
    </div>

    {/* Quick Actions */}
    <div className="flex justify-around px-4 py-4" dir="rtl">
      {[
        { icon: ScanBarcode, label: "مسح VIN" },
        { icon: Camera, label: "بحث OCR" },
        { icon: FileText, label: "طلب عرض سعر" },
        { icon: LayoutGrid, label: "كل القطع" },
      ].map(({ icon: Icon, label }) => (
        <button key={label} className="flex flex-col items-center gap-1.5 group">
          <div className="w-12 h-12 rounded-xl bg-card shadow-sm flex items-center justify-center text-primary transition-shadow group-hover:shadow-md group-active:scale-95">
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium text-foreground">{label}</span>
        </button>
      ))}
    </div>

    {/* Categories */}
    <section className="px-4 mb-4" dir="rtl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold">الأقسام</h2>
        <button className="text-xs text-primary font-medium flex items-center gap-0.5">
          عرض الكل <ChevronRight className="w-3 h-3 rotate-180" />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {categories.map((cat) => (
          <button key={cat.name} className="flex flex-col items-center gap-1.5 shrink-0 group">
            <div className="w-14 h-14 rounded-full bg-card shadow-sm flex items-center justify-center overflow-hidden transition-shadow group-hover:shadow-md group-active:scale-95">
              <img src={cat.image} alt={cat.name} className="w-9 h-9 object-contain" />
            </div>
            <span className="text-[11px] font-medium text-foreground whitespace-nowrap">{cat.name}</span>
          </button>
        ))}
      </div>
    </section>

    {/* Recommended */}
    <section className="px-4 mb-4" dir="rtl">
      <h2 className="text-base font-bold mb-3">موصى بها لتوسان الخاصة بك</h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {recommended.map((item) => (
          <div key={item.name} className="bg-card rounded-xl shadow-sm p-3 min-w-[170px] shrink-0">
            <div className="w-full h-24 bg-secondary rounded-lg flex items-center justify-center mb-2">
              <img src={item.image} alt={item.name} className="h-20 object-contain" />
            </div>
            <h3 className="text-sm font-semibold mb-0.5 leading-tight">{item.name}</h3>
            <p className="text-xs text-primary mb-1">{item.compat}</p>
            {item.rating && (
              <div className="flex items-center gap-0.5 mb-1">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                ))}
              </div>
            )}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs text-muted-foreground line-through">SAR {item.oldPrice}</span>
              <span className="text-[10px] bg-destructive/10 text-destructive font-bold px-1.5 py-0.5 rounded">-{item.discount}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold">SAR {item.price}</span>
              <button className="bg-primary text-primary-foreground text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-transform active:scale-95">
                أضف للسلة
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Best Deals */}
    <section className="px-4 mb-6" dir="rtl">
      <h2 className="text-base font-bold mb-3">أفضل العروض</h2>
      <div className="flex gap-3">
        {deals.map((item) => (
          <div key={item.name} className="bg-card rounded-xl shadow-sm p-3 flex-1">
            <div className="w-full h-20 bg-secondary rounded-lg flex items-center justify-center mb-2">
              <img src={item.image} alt={item.name} className="h-16 object-contain" />
            </div>
            <p className="text-base font-bold">SAR {item.price}</p>
            <p className="text-xs text-muted-foreground line-through">SAR {item.oldPrice}</p>
          </div>
        ))}
        <div className="bg-gradient-to-br from-warning/20 to-warning/5 rounded-xl p-3 flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-bold mb-1">سجل الآن واحصل</p>
          <p className="text-2xl font-black text-primary">3000</p>
          <p className="text-xs font-semibold text-primary">نقطة مكافأة</p>
        </div>
      </div>
    </section>
  </AppLayout>
);

export default Index;
