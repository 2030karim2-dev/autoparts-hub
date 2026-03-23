import { useState } from "react";
import { ArrowRight, Heart, ShoppingCart, Star, Check, Minus, Plus, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import controlArm from "@/assets/control-arm.png";

const ProductDetail = () => {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "compatibility" | "reviews">("details");
  const navigate = useNavigate();

  return (
    <AppLayout>
      {/* Top Nav */}
      <header className="flex items-center justify-between px-4 h-[var(--nav-height)] bg-card border-b border-border sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 active:scale-95 transition-transform">
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-sm text-muted-foreground" dir="rtl">قطع غيار &gt; ذراع تحكم</p>
        <div className="flex items-center gap-3">
          <button className="active:scale-95 transition-transform"><Heart className="w-5 h-5 text-muted-foreground" /></button>
          <button onClick={() => navigate("/cart")} className="relative active:scale-95 transition-transform">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            <span className="absolute -top-1.5 -right-1.5 bg-destructive text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
        </div>
      </header>

      {/* Image Gallery */}
      <div className="bg-card">
        <div className="aspect-[4/3] flex items-center justify-center p-6">
          <img src={controlArm} alt="Control Arm" className="max-h-full object-contain" />
        </div>
        <div className="flex justify-center gap-2 pb-3">
          <div className="w-14 h-14 rounded-lg border-2 border-primary overflow-hidden p-1">
            <img src={controlArm} alt="" className="w-full h-full object-contain" />
          </div>
          <div className="w-14 h-14 rounded-lg border border-border overflow-hidden p-1 opacity-60">
            <img src={controlArm} alt="" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* Compatibility Badge */}
      <div className="mx-4 mt-3 bg-card rounded-xl p-3 flex items-center gap-2 shadow-sm" dir="rtl">
        <span className="bg-success text-success-foreground text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Check className="w-3 h-3" /> 95% تطابق
        </span>
        <span className="text-sm">متوافق مع <strong>توسان</strong> الخاصة بك</span>
        <ChevronLeft className="w-4 h-4 text-muted-foreground mr-auto" />
      </div>

      {/* Product Info */}
      <div className="px-4 pt-4 space-y-2" dir="rtl">
        <p className="text-xs text-muted-foreground">Tucson 2016-2021, Sportage 2017-2021</p>
        <h1 className="text-lg font-bold leading-tight">[OEM 54500-D3100] ذراع تحكم أمامي يسار</h1>
        <p className="text-xs text-muted-foreground">Days Automotive | SKU:54500-D3100.Dep.</p>
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? "fill-warning text-warning" : i < 5 ? "fill-warning/60 text-warning/60" : ""}`} />
            ))}
          </div>
          <span className="text-xs font-medium">4.8</span>
          <span className="text-xs text-muted-foreground">(715 تقييم)</span>
        </div>

        {/* Price & Qty */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black">SAR 132.00</span>
            <span className="bg-success/15 text-success text-xs font-bold px-1.5 py-0.5 rounded">-20%</span>
          </div>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 flex items-center justify-center text-foreground active:bg-muted transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-semibold">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="w-9 h-9 flex items-center justify-center text-foreground active:bg-muted transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-sm"><span className="text-muted-foreground">الماركة:</span> <strong>Days Automotive</strong></p>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-success border border-success/30 bg-success/10 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" /> متوفر
          </span>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">OEM Reference</span>
          <span className="text-xs text-muted-foreground">54500-D3000 | 54500-D3100</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-5" dir="rtl">
        <div className="flex bg-muted rounded-xl p-1 gap-1">
          {([
            { key: "details", label: "التفاصيل" },
            { key: "compatibility", label: "التوافق" },
            { key: "reviews", label: "التقييمات (715)" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-4 space-y-2.5">
          {activeTab === "details" && (
            <>
              {[
                "ذراع تحكم عالي الجودة للجهة الأمامية اليسرى",
                "مصنوع من الفولاذ المطروق المتين",
                "مُجمّع مسبقاً مع مفصل كروي وجلب",
              ].map((txt) => (
                <div key={txt} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{txt}</p>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
                <span className="text-sm font-semibold">رقم OEM:</span>
                <span className="text-sm text-muted-foreground">54500-D3000 | 54500-D3100</span>
              </div>
            </>
          )}
          {activeTab === "compatibility" && (
            <p className="text-sm text-muted-foreground">متوافق مع Hyundai Tucson 2016-2021 و Kia Sportage 2017-2021</p>
          )}
          {activeTab === "reviews" && (
            <p className="text-sm text-muted-foreground">715 تقييم - 4.8 من 5 نجوم</p>
          )}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-[var(--bottom-nav-height)] bg-card border-t border-border px-4 py-3 flex gap-3" dir="rtl">
        <button className="flex-1 bg-primary text-primary-foreground font-bold text-sm py-3 rounded-xl transition-transform active:scale-[0.97] shadow-md">
          أضف للسلة
        </button>
        <button className="flex-1 border-2 border-primary text-primary font-bold text-sm py-3 rounded-xl transition-transform active:scale-[0.97]">
          طلب عرض سعر
        </button>
      </div>
    </AppLayout>
  );
};

export default ProductDetail;
