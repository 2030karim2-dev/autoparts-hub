import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { products, Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface Props {
  currentProductId?: string;
  title?: string;
  maxItems?: number;
}

const ProductSuggestions = ({ currentProductId, title = "عملاء اشتروا أيضاً", maxItems = 6 }: Props) => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const suggested = products
    .filter((p) => p.id !== currentProductId && p.inStock)
    .sort(() => Math.random() - 0.5)
    .slice(0, maxItems);

  if (suggested.length === 0) return null;

  return (
    <section className="px-4 mb-4" dir="rtl">
      <h2 className="text-sm font-bold mb-3">{title}</h2>
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
        {suggested.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/product/${item.id}`)}
            className="bg-card rounded-xl shadow-sm p-2.5 min-w-[140px] max-w-[160px] shrink-0 cursor-pointer active:scale-[0.97] transition-transform"
          >
            <div className="w-full aspect-square bg-secondary rounded-lg flex items-center justify-center mb-2 relative">
              <img src={item.image} alt={item.name} className="w-3/4 h-3/4 object-contain" />
              {item.discount && (
                <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[8px] font-bold px-1 py-0.5 rounded">
                  -{item.discount}%
                </span>
              )}
            </div>
            <h3 className="text-[11px] font-semibold leading-tight mb-0.5 line-clamp-2">{item.name}</h3>
            <div className="flex items-center gap-0.5 mb-1">
              <Star className="w-2.5 h-2.5 fill-warning text-warning" />
              <span className="text-[10px] font-medium">{item.rating}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black">SAR {item.price}</span>
              <button
                onClick={(e) => { e.stopPropagation(); addItem(item); toast.success("تمت الإضافة"); }}
                className="bg-primary text-primary-foreground text-[9px] font-bold px-2 py-1 rounded-md active:scale-90 transition-transform"
              >
                أضف
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSuggestions;
