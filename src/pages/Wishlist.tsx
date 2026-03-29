import { useState } from "react";
import { ArrowRight, Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const Wishlist = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(products.slice(0, 4));
  const { addItem } = useCart();

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <h1 className="text-base font-bold">المفضلة</h1>
        <span className="text-xs font-medium bg-primary-foreground/20 px-2 py-0.5 rounded-full">{items.length}</span>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center" dir="rtl">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-7 h-7 text-destructive" />
          </div>
          <h2 className="text-lg font-bold mb-1">قائمة المفضلة فارغة</h2>
          <p className="text-sm text-muted-foreground mb-4">أضف المنتجات التي تعجبك للرجوع إليها لاحقاً</p>
          <button onClick={() => navigate("/")} className="bg-primary text-primary-foreground font-bold text-sm px-6 py-3 rounded-xl active:scale-[0.97] transition-transform">
            تصفح المنتجات
          </button>
        </div>
      ) : (
        <div className="px-4 py-3 space-y-2.5" dir="rtl">
          {items.map((item, i) => (
            <div key={item.id} className={`bg-card rounded-xl p-3 flex gap-3 shadow-sm animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}>
              <div onClick={() => navigate(`/product/${item.id}`)} className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center shrink-0 cursor-pointer">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold truncate cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
                <p className="text-[11px] text-muted-foreground mb-1">{item.brand} | OEM: {item.oem}</p>
                <div className="flex items-center gap-0.5 mb-1">
                  <Star className="w-3 h-3 fill-warning text-warning" />
                  <span className="text-[11px] font-semibold">{item.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black">SAR {item.price}</span>
                    {item.oldPrice && <span className="text-[10px] text-muted-foreground line-through">SAR {item.oldPrice}</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => removeItem(item.id)} className="w-7 h-7 flex items-center justify-center text-destructive active:scale-90 transition-transform">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { addItem(item); toast.success("تمت الإضافة للسلة"); }}
                      className="bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-1.5 rounded-lg active:scale-95 transition-transform"
                    >
                      <ShoppingCart className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Wishlist;
