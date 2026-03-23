import { ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import sparkPlug from "@/assets/spark-plug.png";
import brakePads from "@/assets/brake-pads.png";
import headlight from "@/assets/headlight.png";
import controlArm from "@/assets/control-arm.png";
import engineMount from "@/assets/engine-mount.png";
import airFilter from "@/assets/air-filter.png";
import oilFilter from "@/assets/oil-filter.png";
import shockAbsorbers from "@/assets/shock-absorbers.png";

const categories = [
  { name: "شمعات إشعال", image: sparkPlug },
  { name: "فحمات فرامل", image: brakePads },
  { name: "إضاءة", image: headlight },
  { name: "ذراع تحكم", image: controlArm },
  { name: "قاعدة محرك", image: engineMount },
  { name: "فلتر هواء", image: airFilter },
  { name: "فلتر زيت", image: oilFilter },
  { name: "ممتصات صدمات", image: shockAbsorbers },
];

const Categories = () => {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)]">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold">الأقسام</h1>
        <div className="w-5" />
      </header>
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input className="w-full h-10 rounded-lg bg-card border border-border pr-9 pl-3 text-sm outline-none" placeholder="ابحث في الأقسام..." dir="rtl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 pb-6" dir="rtl">
        {categories.map((cat) => (
          <button key={cat.name} className="bg-card rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-[0.97] transition-transform">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <img src={cat.image} alt={cat.name} className="w-10 h-10 object-contain" />
            </div>
            <span className="text-sm font-semibold">{cat.name}</span>
          </button>
        ))}
      </div>
    </AppLayout>
  );
};

export default Categories;
