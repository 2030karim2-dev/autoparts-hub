import { ArrowRight, Search, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { categories } from "@/data/products";
import { useState } from "react";

const Categories = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = search ? categories.filter((c) => c.name.includes(search)) : categories;

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold">الأقسام</h1>
        <div className="w-5" />
      </header>

      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-lg bg-card border border-border pr-9 pl-3 text-sm outline-none"
            placeholder="ابحث في الأقسام..."
            dir="rtl"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pb-6" dir="rtl">
        {filtered.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}`)}
            className={`bg-card rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-[0.97] transition-transform animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <img src={cat.image} alt={cat.name} className="w-10 h-10 object-contain" />
            </div>
            <span className="text-sm font-semibold">{cat.name}</span>
            <span className="text-[11px] text-muted-foreground">{cat.count} منتج</span>
            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        ))}
      </div>
    </AppLayout>
  );
};

export default Categories;
