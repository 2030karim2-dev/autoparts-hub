import { useState } from "react";
import { ArrowRight, Heart, ShoppingCart, Star, Check, Minus, Plus, ChevronLeft, Share2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useCompare } from "@/contexts/CompareContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id) || products[2];
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "compatibility" | "reviews">("details");
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const navigate = useNavigate();
  const { addItem, totalItems } = useCart();
  const { addItem: addToCompare, isInCompare } = useCompare();

  const handleAddToCart = () => {
    addItem(product, qty);
    toast.success(`تمت إضافة ${product.name} إلى السلة`);
  };

  const handleCompare = () => {
    if (addToCompare(product)) {
      toast.success("تمت الإضافة للمقارنة");
    } else {
      toast.error("يمكنك مقارنة 3 منتجات كحد أقصى");
    }
  };

  const reviews = [
    { name: "أحمد", rating: 5, text: "قطعة ممتازة وتركيب سهل", time: "منذ أسبوع" },
    { name: "محمد", rating: 4, text: "جودة عالية والتوصيل سريع", time: "منذ شهر" },
    { name: "خالد", rating: 5, text: "مطابقة للأصلي تماماً", time: "منذ شهرين" },
  ];

  return (
    <AppLayout>
      <header className="flex items-center justify-between px-4 h-[var(--nav-height)] bg-card border-b border-border sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 active:scale-95 transition-transform">
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-sm text-muted-foreground" dir="rtl">قطع غيار &gt; {product.category}</p>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsFavorite(!isFavorite)} className="active:scale-95 transition-transform">
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
          </button>
          <button onClick={() => navigate("/cart")} className="relative active:scale-95 transition-transform">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-destructive text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{totalItems}</span>
            )}
          </button>
        </div>
      </header>

      <div className="bg-card">
        <div className="aspect-[4/3] flex items-center justify-center p-6">
          <img src={product.image} alt={product.name} className="max-h-full object-contain" />
        </div>
      </div>

      <div className="mx-4 mt-3 bg-card rounded-xl p-3 flex items-center gap-2 shadow-sm" dir="rtl">
        <span className="bg-success text-success-foreground text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Check className="w-3 h-3" /> 95% تطابق
        </span>
        <span className="text-sm">متوافق مع <strong>توسان</strong> الخاصة بك</span>
        <ChevronLeft className="w-4 h-4 text-muted-foreground mr-auto" />
      </div>

      <div className="px-4 pt-4 space-y-2" dir="rtl">
        <p className="text-xs text-muted-foreground">{product.compat.join(" | ")}</p>
        <h1 className="text-lg font-bold leading-tight">[OEM {product.oem}] {product.name}</h1>
        <p className="text-xs text-muted-foreground">{product.brand} | SKU: {product.sku}</p>
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "fill-warning text-warning" : "text-muted"}`} />
            ))}
          </div>
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews} تقييم)</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black">SAR {product.price.toFixed(2)}</span>
            {product.discount && <span className="bg-success/15 text-success text-xs font-bold px-1.5 py-0.5 rounded">-{product.discount}%</span>}
          </div>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 flex items-center justify-center active:bg-muted"><Minus className="w-4 h-4" /></button>
            <span className="w-8 text-center text-sm font-semibold">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="w-9 h-9 flex items-center justify-center active:bg-muted"><Plus className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
            product.inStock ? "text-success border border-success/30 bg-success/10" : "text-destructive border border-destructive/30 bg-destructive/10"
          }`}>
            {product.inStock ? <><Check className="w-3 h-3" /> متوفر</> : "غير متوفر"}
          </span>
          <button
            onClick={handleCompare}
            className={`text-xs font-medium px-2 py-0.5 rounded-full border transition-colors ${
              isInCompare(product.id) ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"
            }`}
          >
            {isInCompare(product.id) ? "✓ في المقارنة" : "➕ قارن"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-5" dir="rtl">
        <div className="flex bg-muted rounded-xl p-1 gap-1">
          {([
            { key: "details", label: "التفاصيل" },
            { key: "compatibility", label: "التوافق" },
            { key: "reviews", label: `التقييمات (${product.reviews})` },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all ${
                activeTab === tab.key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-4 space-y-2.5">
          {activeTab === "details" && (
            <>
              {["ذراع تحكم عالي الجودة", "مصنوع من مواد متينة", "مُجمّع مسبقاً وجاهز للتركيب"].map((txt) => (
                <div key={txt} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{txt}</p>
                </div>
              ))}
            </>
          )}
          {activeTab === "compatibility" && (
            <div className="space-y-2">
              {product.compat.map((c) => (
                <div key={c} className="flex items-center gap-2 bg-card rounded-lg p-3 border border-border">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm">{c}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-3">
              {/* Add Review */}
              <div className="bg-card rounded-xl p-3 border border-border">
                <p className="text-xs font-bold mb-2">أضف تقييمك</p>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setUserRating(s)}>
                      <Star className={`w-5 h-5 ${s <= userRating ? "fill-warning text-warning" : "text-muted"}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full h-16 bg-secondary rounded-lg p-2 text-sm outline-none resize-none mb-2"
                  placeholder="اكتب تقييمك..."
                />
                <button
                  onClick={() => { setUserRating(0); setReviewText(""); toast.success("تم إرسال التقييم"); }}
                  className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-lg active:scale-95"
                >
                  إرسال
                </button>
              </div>
              {/* Existing Reviews */}
              {reviews.map((r) => (
                <div key={r.name} className="bg-card rounded-xl p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold">{r.name}</span>
                    <span className="text-[10px] text-muted-foreground">{r.time}</span>
                  </div>
                  <div className="flex gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "fill-warning text-warning" : "text-muted"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-[var(--bottom-nav-height)] bg-card border-t border-border px-4 py-3 flex gap-3" dir="rtl">
        <button onClick={handleAddToCart} disabled={!product.inStock} className="flex-1 bg-primary text-primary-foreground font-bold text-sm py-3 rounded-xl transition-transform active:scale-[0.97] shadow-md disabled:opacity-50">
          أضف للسلة
        </button>
        <button onClick={() => navigate("/quote-request")} className="flex-1 border-2 border-primary text-primary font-bold text-sm py-3 rounded-xl transition-transform active:scale-[0.97]">
          طلب عرض سعر
        </button>
      </div>
    </AppLayout>
  );
};

export default ProductDetail;
