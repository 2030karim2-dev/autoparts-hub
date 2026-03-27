import { useState } from "react";
import { ArrowRight, MapPin, CreditCard, Truck, Check, ChevronLeft, Banknote, Building2, Smartphone, Copy, Upload, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import CheckoutProgress from "@/components/CheckoutProgress";
import ProductSuggestions from "@/components/ProductSuggestions";
import { yemenExchanges, storeAccounts, deliveryZones, currencies } from "@/data/yemenData";
import { toast } from "sonner";

const addresses = [
  { id: "1", name: "المنزل", city: "صنعاء", detail: "شارع الستين، بجوار مسجد الصالح", phone: "771234567", isDefault: true },
  { id: "2", name: "العمل", city: "صنعاء", detail: "شارع حدة، برج التجارة", phone: "771234568", isDefault: false },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, coupon, discount, clearCart } = useCart();
  const { format, currency, setCurrencyCode } = useCurrency();
  const [selectedAddress, setSelectedAddress] = useState("1");
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
  const [transferType, setTransferType] = useState<"name" | "account">("name");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  // Delivery fee based on selected address city
  const selectedAddr = addresses.find((a) => a.id === selectedAddress);
  const zone = deliveryZones.find((z) => z.city === selectedAddr?.city);
  const deliveryFee = zone ? (subtotal >= zone.freeAbove ? 0 : zone.fee) : 25;

  const discountAmount = subtotal * (discount / 100);
  const afterDiscount = subtotal - discountAmount;
  const vat = afterDiscount * 0.15;
  const total = afterDiscount + deliveryFee + vat;
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  const selectedAccount = selectedExchange ? storeAccounts.find((a) => a.exchangeId === selectedExchange) : null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`تم نسخ ${label}`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setReceiptImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 1 && selectedPayment === "transfer" && !selectedExchange) {
      toast.error("يرجى اختيار الصرافة");
      return;
    }
    if (step < 2) {
      setStep(step + 1);
    } else {
      clearCart();
      navigate("/order-confirmation");
    }
  };

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <h1 className="text-base font-bold">إتمام الطلب</h1>
        <div className="w-5" />
      </header>

      <CheckoutProgress currentStep={step} />

      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Step 0: Address & Delivery */}
        {step === 0 && (
          <section className="animate-fade-in-up space-y-4">
            {/* Currency Selector */}
            <button onClick={() => setShowCurrencyPicker(!showCurrencyPicker)} className="w-full bg-card rounded-xl p-3 shadow-sm flex items-center justify-between border border-border">
              <div className="flex items-center gap-2">
                <span className="text-lg">{currency.flag}</span>
                <span className="text-sm font-bold">{currency.name} ({currency.code})</span>
              </div>
              <span className="text-xs text-primary font-semibold">تغيير العملة</span>
            </button>

            {showCurrencyPicker && (
              <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden animate-fade-in">
                {currencies.map((c) => (
                  <button key={c.code} onClick={() => { setCurrencyCode(c.code); setShowCurrencyPicker(false); }}
                    className={`w-full px-4 py-3 flex items-center gap-3 border-b border-border last:border-0 ${currency.code === c.code ? "bg-primary/5" : ""}`}>
                    <span className="text-lg">{c.flag}</span>
                    <div className="flex-1 text-right">
                      <p className="text-sm font-bold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.code === "SAR" ? "العملة الأساسية" : `1 ر.س = ${c.rate} ${c.symbol}`}</p>
                    </div>
                    {currency.code === c.code && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            )}

            {/* Address Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> عنوان التوصيل</h2>
                <button onClick={() => navigate("/addresses")} className="text-xs text-primary font-semibold flex items-center gap-0.5">تغيير <ChevronLeft className="w-3 h-3" /></button>
              </div>
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <button key={addr.id} onClick={() => setSelectedAddress(addr.id)} className={`w-full bg-card rounded-xl p-3 text-right shadow-sm transition-all ${selectedAddress === addr.id ? "border-2 border-primary" : "border border-border"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">{addr.name}</span>
                      {selectedAddress === addr.id && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-sm text-foreground">{addr.city}، {addr.detail}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">📞 +967 {addr.phone}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div>
              <h2 className="text-sm font-bold flex items-center gap-1.5 mb-2"><Truck className="w-4 h-4 text-primary" /> التوصيل</h2>
              <div className="bg-card rounded-xl p-3 border border-primary shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-bold">توصيل إلى {selectedAddr?.city}</p>
                    <p className="text-xs text-muted-foreground">التوصيل خلال {zone?.estimatedDays || "2-4"} أيام عمل</p>
                  </div>
                  <span className="text-sm font-bold">{deliveryFee === 0 ? "مجاني 🎉" : format(deliveryFee)}</span>
                </div>
                {zone && subtotal < zone.freeAbove && (
                  <p className="text-[10px] text-primary mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3" /> أضف {format(zone.freeAbove - subtotal)} للشحن المجاني
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Step 1: Payment */}
        {step === 1 && (
          <section className="animate-fade-in-up space-y-4">
            <h2 className="text-sm font-bold flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-primary" /> طريقة الدفع</h2>

            {/* COD */}
            <button onClick={() => { setSelectedPayment("cod"); setSelectedExchange(null); }}
              className={`w-full bg-card rounded-xl p-4 flex items-center gap-3 shadow-sm transition-all ${selectedPayment === "cod" ? "border-2 border-primary" : "border border-border"}`}>
              <div className="w-11 h-11 bg-success/10 rounded-xl flex items-center justify-center shrink-0"><Banknote className="w-5 h-5 text-success" /></div>
              <div className="flex-1 text-right">
                <p className="text-sm font-bold">الدفع عند الاستلام</p>
                <p className="text-xs text-muted-foreground">ادفع نقداً عند وصول الطلب</p>
              </div>
              {selectedPayment === "cod" && <Check className="w-5 h-5 text-primary shrink-0" />}
            </button>

            {selectedPayment === "cod" && (
              <div className="bg-success/5 rounded-xl p-3 border border-success/20 animate-fade-in">
                <p className="text-xs text-muted-foreground">سيقوم المندوب بتحصيل المبلغ ({format(total)}) عند التوصيل. يمكنك الدفع بأي عملة متاحة.</p>
              </div>
            )}

            {/* Transfer */}
            <button onClick={() => setSelectedPayment("transfer")}
              className={`w-full bg-card rounded-xl p-4 flex items-center gap-3 shadow-sm transition-all ${selectedPayment === "transfer" ? "border-2 border-primary" : "border border-border"}`}>
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><Building2 className="w-5 h-5 text-primary" /></div>
              <div className="flex-1 text-right">
                <p className="text-sm font-bold">تحويل عبر صرافة</p>
                <p className="text-xs text-muted-foreground">الكريمي، العمقي، البسيري، القطيبي...</p>
              </div>
              {selectedPayment === "transfer" && <Check className="w-5 h-5 text-primary shrink-0" />}
            </button>

            {selectedPayment === "transfer" && (
              <div className="space-y-3 animate-fade-in-up">
                {/* Transfer Type */}
                <div className="flex bg-muted rounded-xl p-1 gap-1">
                  <button onClick={() => setTransferType("name")}
                    className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${transferType === "name" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}>
                    <Smartphone className="w-3.5 h-3.5 inline ml-1" /> بالاسم والهاتف
                  </button>
                  <button onClick={() => setTransferType("account")}
                    className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${transferType === "account" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}>
                    <Building2 className="w-3.5 h-3.5 inline ml-1" /> برقم الحساب
                  </button>
                </div>

                {/* Exchange Selection */}
                <p className="text-xs font-bold text-muted-foreground">اختر الصرافة</p>
                <div className="grid grid-cols-2 gap-2">
                  {yemenExchanges.map((ex) => (
                    <button key={ex.id} onClick={() => setSelectedExchange(ex.id)}
                      className={`bg-card rounded-xl p-2.5 flex items-center gap-2 transition-all ${selectedExchange === ex.id ? "border-2 border-primary shadow-md" : "border border-border"}`}>
                      <span className="text-base">{ex.logo}</span>
                      <span className="text-xs font-bold flex-1 text-right">{ex.name}</span>
                      {selectedExchange === ex.id && <Check className="w-3 h-3 text-primary" />}
                    </button>
                  ))}
                </div>

                {/* Store Account Info */}
                {selectedAccount && (
                  <div className="bg-primary/5 rounded-xl p-3 border border-primary/20 space-y-2 animate-fade-in">
                    <p className="text-xs font-bold text-primary">{transferType === "name" ? "حوّل إلى:" : "حوّل إلى الحساب:"}</p>
                    {transferType === "account" ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">رقم الحساب</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold font-mono">{selectedAccount.accountNumber}</span>
                            <button onClick={() => copyToClipboard(selectedAccount.accountNumber, "رقم الحساب")} className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                              {copied === "رقم الحساب" ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3 text-primary" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">اسم الحساب</span>
                          <span className="text-sm font-semibold">{selectedAccount.accountName}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">الاسم</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold">{selectedAccount.accountName}</span>
                            <button onClick={() => copyToClipboard(selectedAccount.accountName, "الاسم")} className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                              {copied === "الاسم" ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3 text-primary" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">رقم الهاتف</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold font-mono">+967 {selectedAccount.phone}</span>
                            <button onClick={() => copyToClipboard(selectedAccount.phone, "الهاتف")} className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                              {copied === "الهاتف" ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3 text-primary" />}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="border-t border-primary/10 pt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">المبلغ المطلوب</span>
                      <span className="text-sm font-black text-primary">{format(total)}</span>
                    </div>
                  </div>
                )}

                {/* Sender Info */}
                {selectedExchange && (
                  <div className="space-y-3 animate-fade-in">
                    <p className="text-xs font-bold text-muted-foreground">بيانات المُحوِّل</p>
                    <input value={senderName} onChange={(e) => setSenderName(e.target.value)}
                      className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none focus:border-primary transition-colors"
                      placeholder="اسمك كما في الصرافة" />
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 bg-card border border-border rounded-xl px-3 h-11 shrink-0">
                        <span className="text-xs">🇾🇪</span><span className="text-xs font-semibold">+967</span>
                      </div>
                      <input value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)}
                        className="flex-1 h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none focus:border-primary transition-colors"
                        placeholder="رقم هاتفك" type="tel" maxLength={9} />
                    </div>
                    <label className="w-full bg-card border-2 border-dashed border-border rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-primary transition-colors">
                      {receiptImage ? (
                        <img src={receiptImage} alt="إيصال" className="w-12 h-12 object-cover rounded-lg" />
                      ) : (
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground flex-1">{receiptImage ? "تم رفع الإيصال ✅" : "رفع صورة الإيصال (اختياري)"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleReceiptUpload} />
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <div>
              <h2 className="text-sm font-bold mb-2">ملاحظات على الطلب</h2>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                className="w-full h-20 bg-card border border-border rounded-xl p-3 text-sm outline-none resize-none placeholder:text-muted-foreground" placeholder="أضف أي ملاحظات..." />
            </div>
          </section>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <section className="animate-fade-in-up space-y-3">
            <div className="bg-card rounded-xl p-3 shadow-sm">
              <h3 className="text-sm font-bold mb-2">المنتجات ({totalItems})</h3>
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-2 py-2 border-b border-border last:border-0">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                    <img src={item.product.image} alt="" className="w-7 h-7 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{item.product.name}</p>
                    <p className="text-[10px] text-muted-foreground">× {item.qty}</p>
                  </div>
                  <span className="text-xs font-bold">{format(item.product.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-xl p-3 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs">{selectedAddr?.city}، {selectedAddr?.detail}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs">
                  {selectedPayment === "cod" ? "الدفع عند الاستلام" : `تحويل عبر ${yemenExchanges.find(e => e.id === selectedExchange)?.name || "صرافة"} (${transferType === "name" ? "بالاسم" : "بالحساب"})`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{currency.flag}</span>
                <span className="text-xs font-semibold">العملة: {currency.name}</span>
              </div>
            </div>

            <div className="bg-card rounded-xl p-4 shadow-sm space-y-2.5">
              <h2 className="text-sm font-bold mb-2">ملخص الطلب</h2>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">المجموع الفرعي ({totalItems} منتجات)</span>
                <span className="font-semibold">{format(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-success">الخصم ({coupon} - {discount}%)</span>
                  <span className="font-semibold text-success">- {format(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">التوصيل ({selectedAddr?.city})</span>
                <span className="font-semibold">{deliveryFee === 0 ? "مجاني 🎉" : format(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ضريبة القيمة المضافة (15%)</span>
                <span className="font-semibold">{format(vat)}</span>
              </div>
              <div className="border-t border-border pt-2.5 flex justify-between">
                <span className="text-base font-bold">الإجمالي</span>
                <span className="text-lg font-black text-primary">{format(total)}</span>
              </div>
            </div>
          </section>
        )}
      </div>

      {step === 0 && <ProductSuggestions title="أضف لطلبك" maxItems={4} />}

      <div className="sticky bottom-[var(--bottom-nav-height)] bg-card border-t border-border px-4 py-3" dir="rtl">
        <button onClick={handleNext} className="w-full bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-xl active:scale-[0.97] transition-transform shadow-md">
          {step === 2 ? `تأكيد الطلب — ${format(total)}` : "التالي"}
        </button>
      </div>
    </AppLayout>
  );
};

export default Checkout;
