import { useState, useMemo } from "react";
import { ArrowRight, Search as SearchIcon, SlidersHorizontal, X, Star, Heart, Grid3X3, List } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { products, categories } from "@/data/products";

const priceRanges = [
  { label: "أقل من 50", min: 0, max: 50 },
  { label: "50 - 150", min: 50, max: 150 },
  { label: "150 - 300", min: 150, max: 300 },
  { label: "أكثر من 300", min: 300, max: 99999 },
];

const sortOptions = [
  { label: "الأكثر صلة", value: "relevance" },
  { label: "السعر: الأقل أولاً", value: "price-asc" },
  { label: "السعر: الأعلى أولاً", value: "price-desc" },
  { label: "التقييم", value: "rating" },
  { label: "الأحدث", value: "newest" },
];

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [query, setQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.includes(q) ||
          p.oem.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedPrice !== null) {
      const range = priceRanges[selectedPrice];
      result = result.filter((p) => p.price >= range.min && p.price <= range.max);
    }

    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
    }

    return result;
  }, [query, selectedCategory, selectedPrice, sortBy, inStockOnly]);

  const activeFilters = [selectedCategory, selectedPrice !== null, inStockOnly].filter(Boolean).length;

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pb-3 pt-2 sticky top-0 z-10">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform shrink-0">
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 rounded-lg bg-card text-card-foreground pr-9 pl-3 text-sm placeholder:text-muted-foreground outline-none"
              placeholder="اسم القطعة، OEM، SKU..."
              dir="rtl"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute left-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                showFilters ? "bg-primary-foreground text-primary" : "bg-primary-foreground/20 text-primary-foreground"
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              فلترة {activeFilters > 0 && `(${activeFilters})`}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-primary-foreground/20 text-primary-foreground px-2 py-1.5 rounded-full outline-none"
              dir="rtl"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-primary-foreground/20" : ""}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-primary-foreground/20" : ""}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-card border-b border-border px-4 py-3 space-y-3 animate-fade-in-up" dir="rtl">
          {/* Category Filter */}
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-2">القسم</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory("")}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all ${
                  !selectedCategory ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                الكل
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all ${
                    selectedCategory === cat.name ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-2">السعر (SAR)</p>
            <div className="flex flex-wrap gap-1.5">
              {priceRanges.map((range, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPrice(selectedPrice === i ? null : i)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all ${
                    selectedPrice === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">متوفر فقط</span>
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`w-10 h-5 rounded-full transition-all relative ${inStockOnly ? "bg-primary" : "bg-muted"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-card rounded-full shadow transition-all ${inStockOnly ? "right-0.5" : "right-[calc(100%-1.125rem)]"}`} />
            </button>
          </div>

          {activeFilters > 0 && (
            <button
              onClick={() => { setSelectedCategory(""); setSelectedPrice(null); setInStockOnly(false); }}
              className="text-xs text-destructive font-semibold"
            >
              مسح جميع الفلاتر
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="px-4 py-2 flex items-center justify-between" dir="rtl">
        <span className="text-xs text-muted-foreground">{filtered.length} نتيجة</span>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center" dir="rtl">
          <SearchIcon className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <h3 className="text-base font-bold mb-1">لا توجد نتائج</h3>
          <p className="text-sm text-muted-foreground">جرب كلمات بحث مختلفة أو غيّر الفلاتر</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-2.5 px-4 pb-4" dir="rtl">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className={`bg-card rounded-xl shadow-sm p-2.5 cursor-pointer active:scale-[0.97] transition-transform animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}
            >
              <div className="relative">
                <div className="w-full aspect-square bg-secondary rounded-lg flex items-center justify-center mb-2">
                  <img src={item.image} alt={item.name} className="w-3/4 h-3/4 object-contain" />
                </div>
                {item.discount && (
                  <span className="absolute top-1.5 right-1.5 bg-destructive text-destructive-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
                    -{item.discount}%
                  </span>
                )}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1.5 left-1.5 w-7 h-7 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <Heart className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                {!item.inStock && (
                  <div className="absolute inset-0 bg-card/60 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-destructive bg-card px-2 py-1 rounded">غير متوفر</span>
                  </div>
                )}
              </div>
              <h3 className="text-xs font-semibold leading-tight mb-0.5 line-clamp-2">{item.name}</h3>
              <p className="text-[10px] text-muted-foreground mb-1">OEM: {item.oem}</p>
              <div className="flex items-center gap-0.5 mb-1">
                <Star className="w-3 h-3 fill-warning text-warning" />
                <span className="text-[10px] font-semibold">{item.rating}</span>
                <span className="text-[10px] text-muted-foreground">({item.reviews})</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-black">SAR {item.price}</span>
                  {item.oldPrice && (
                    <span className="text-[10px] text-muted-foreground line-through mr-1">SAR {item.oldPrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 pb-4 space-y-2" dir="rtl">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className={`bg-card rounded-xl shadow-sm p-3 flex gap-3 cursor-pointer active:scale-[0.98] transition-transform animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}
            >
              <div className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center shrink-0 relative">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-contain" />
                {item.discount && (
                  <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[8px] font-bold px-1 py-0.5 rounded">
                    -{item.discount}%
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold truncate">{item.name}</h3>
                <p className="text-[11px] text-muted-foreground">OEM: {item.oem} | {item.brand}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-warning text-warning" />
                  <span className="text-[11px] font-semibold">{item.rating}</span>
                  <span className="text-[11px] text-muted-foreground">({item.reviews})</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full mr-1 ${item.inStock ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}`}>
                    {item.inStock ? "متوفر" : "غير متوفر"}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-base font-black">SAR {item.price}</span>
                  {item.oldPrice && (
                    <span className="text-xs text-muted-foreground line-through">SAR {item.oldPrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Search;
