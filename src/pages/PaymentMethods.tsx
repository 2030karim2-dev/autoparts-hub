import { useState } from "react";
import { ArrowRight, Banknote, Building2, Smartphone, Copy, Check, Upload, ChevronDown, ChevronUp, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { yemenExchanges, storeAccounts } from "@/data/yemenData";
import { useCurrency } from "@/contexts/CurrencyContext";
import { currencies } from "@/data/yemenData";
import { toast } from "sonner";

const PaymentMethods = () => {
  const navigate = useNavigate();
  const { currency, setCurrencyCode, format } = useCurrency();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
  const [transferType, setTransferType] = useState<"name" | "account">("name");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showCurrency, setShowCurrency] = useState(false);

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

  const selectedAccount = selectedExchange
    ? storeAccounts.find((a) => a.exchangeId === selectedExchange)
    : null;

  const exampleAmount = 500;

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <h1 className="text-base font-bold">طرق الدفع</h1>
        <div className="w-5" />
      </header>

      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Currency Selector */}
        <button onClick={() => setShowCurrency(!showCurrency)} className="w-full bg-card rounded-xl p-3 shadow-sm flex items-center justify-between border border-border">
          <div className="flex items-center gap-2">
            <span className="text-lg">{currency.flag}</span>
            <div className="text-right">
              <p className="text-sm font-bold">{currency.name}</p>
              <p className="text-xs text-muted-foreground">{currency.code}</p>
            </div>
          </div>
          {showCurrency ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {showCurrency && (
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden animate-fade-in">
            {currencies.map((c) => (
              <button
                key={c.code}
                onClick={() => { setCurrencyCode(c.code); setShowCurrency(false); }}
                className={`w-full px-4 py-3 flex items-center gap-3 border-b border-border last:border-0 transition-colors ${currency.code === c.code ? "bg-primary/5" : ""}`}
              >
                <span className="text-lg">{c.flag}</span>
                <div className="flex-1 text-right">
                  <p className="text-sm font-bold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.code === "SAR" ? "العملة الأساسية" : `1 ر.س = ${c.rate} ${c.symbol}`}
                  </p>
                </div>
                {currency.code === c.code && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
            <div className="px-4 py-2 bg-muted/50">
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" /> أسعار الصرف تقريبية وقد تختلف عند التحويل الفعلي
              </p>
            </div>
          </div>
        )}

        {/* Example Price */}
        <div className="bg-primary/5 rounded-xl p-3 border border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">مثال: منتج بسعر 500 ر.س</p>
          <p className="text-lg font-black text-primary">{format(exampleAmount)}</p>
        </div>

        {/* Payment Method 1: Cash on Delivery */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold">اختر طريقة الدفع</h2>

          <button
            onClick={() => setSelectedMethod(selectedMethod === "cod" ? null : "cod")}
            className={`w-full bg-card rounded-xl p-4 flex items-center gap-3 shadow-sm transition-all ${selectedMethod === "cod" ? "border-2 border-primary" : "border border-border"}`}
          >
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center shrink-0">
              <Banknote className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-bold">الدفع عند الاستلام</p>
              <p className="text-xs text-muted-foreground">ادفع نقداً عند وصول الطلب</p>
            </div>
            {selectedMethod === "cod" && <Check className="w-5 h-5 text-primary shrink-0" />}
          </button>

          {selectedMethod === "cod" && (
            <div className="bg-success/5 rounded-xl p-3 border border-success/20 animate-fade-in">
              <p className="text-xs text-success font-semibold mb-1">✅ لا يلزم أي إجراء إضافي</p>
              <p className="text-xs text-muted-foreground">سيقوم المندوب بتحصيل المبلغ عند التوصيل. يمكنك الدفع بالريال السعودي أو اليمني أو العماني.</p>
            </div>
          )}

          {/* Payment Method 2: Exchange Transfer */}
          <button
            onClick={() => setSelectedMethod(selectedMethod === "transfer" ? null : "transfer")}
            className={`w-full bg-card rounded-xl p-4 flex items-center gap-3 shadow-sm transition-all ${selectedMethod === "transfer" ? "border-2 border-primary" : "border border-border"}`}
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-bold">تحويل عبر صرافة</p>
              <p className="text-xs text-muted-foreground">الكريمي، العمقي، البسيري، القطيبي...</p>
            </div>
            {selectedMethod === "transfer" && <Check className="w-5 h-5 text-primary shrink-0" />}
          </button>

          {selectedMethod === "transfer" && (
            <div className="space-y-3 animate-fade-in-up">
              {/* Transfer Type Toggle */}
              <div className="flex bg-muted rounded-xl p-1 gap-1">
                <button
                  onClick={() => setTransferType("name")}
                  className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${transferType === "name" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  <Smartphone className="w-3.5 h-3.5 inline ml-1" />
                  بالاسم والهاتف
                </button>
                <button
                  onClick={() => setTransferType("account")}
                  className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${transferType === "account" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  <Building2 className="w-3.5 h-3.5 inline ml-1" />
                  برقم الحساب
                </button>
              </div>

              {/* Select Exchange */}
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-2">اختر الصرافة</p>
                <div className="grid grid-cols-2 gap-2">
                  {yemenExchanges.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => setSelectedExchange(ex.id)}
                      className={`bg-card rounded-xl p-3 flex items-center gap-2 transition-all ${selectedExchange === ex.id ? "border-2 border-primary shadow-md" : "border border-border"}`}
                    >
                      <span className="text-lg">{ex.logo}</span>
                      <span className="text-xs font-bold flex-1 text-right">{ex.name}</span>
                      {selectedExchange === ex.id && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Store Account Info (when exchange selected) */}
              {selectedAccount && (
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 space-y-2 animate-fade-in">
                  <p className="text-xs font-bold text-primary mb-2">
                    {transferType === "name" ? "حوّل إلى:" : "حوّل إلى الحساب:"}
                  </p>

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

                  <div className="flex items-center justify-between pt-1 border-t border-primary/10">
                    <span className="text-xs text-muted-foreground">الصرافة</span>
                    <span className="text-sm font-semibold">{yemenExchanges.find(e => e.id === selectedExchange)?.name}</span>
                  </div>
                </div>
              )}

              {/* Sender Info */}
              {selectedExchange && (
                <div className="space-y-3 animate-fade-in">
                  <p className="text-xs font-bold text-muted-foreground">بيانات المُحوِّل (أنت)</p>
                  <input
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="اسمك الكامل كما في الصرافة"
                  />
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 bg-card border border-border rounded-xl px-3 h-11 shrink-0">
                      <span className="text-xs">🇾🇪</span>
                      <span className="text-xs font-semibold">+967</span>
                    </div>
                    <input
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="flex-1 h-11 rounded-xl bg-card border border-border px-3 text-sm outline-none focus:border-primary transition-colors"
                      placeholder="رقم هاتفك"
                      type="tel"
                      maxLength={9}
                    />
                  </div>

                  {/* Receipt Upload */}
                  <div>
                    <p className="text-xs font-bold text-muted-foreground mb-2">إيصال التحويل (اختياري)</p>
                    <label className="w-full bg-card border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary transition-colors">
                      {receiptImage ? (
                        <img src={receiptImage} alt="إيصال" className="w-full h-32 object-contain rounded-lg" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">اضغط لرفع صورة الإيصال</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleReceiptUpload} />
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default PaymentMethods;
