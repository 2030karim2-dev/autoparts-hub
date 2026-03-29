import { ArrowRight, Shield, Truck, RotateCcw, CreditCard, Users, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";

const sections = [
  {
    icon: Scale,
    title: "الشروط العامة",
    items: [
      "باستخدام التطبيق فإنك توافق على جميع الشروط والأحكام المذكورة أدناه",
      "يحق للمتجر تعديل الشروط والأحكام في أي وقت مع إشعار المستخدمين",
      "جميع الأسعار بالريال السعودي وتشمل ضريبة القيمة المضافة (15%)",
      "يحق للمتجر رفض أي طلب لأسباب تتعلق بالتوفر أو الأسعار",
    ],
  },
  {
    icon: CreditCard,
    title: "سياسة الدفع",
    items: [
      "الدفع عند الاستلام: يتم الدفع نقداً للمندوب عند التوصيل بالعملة المتفق عليها",
      "التحويل البنكي: يجب إتمام التحويل خلال 24 ساعة من تأكيد الطلب",
      "في حال عدم إتمام التحويل خلال المدة المحددة يتم إلغاء الطلب تلقائياً",
      "يتم تأكيد التحويل خلال ساعة واحدة خلال أوقات العمل الرسمية",
      "العملات المقبولة: الريال السعودي (أساسي)، الريال اليمني، الريال العماني",
      "أسعار الصرف تقريبية وقد تختلف حسب سعر الصرف اليومي",
    ],
  },
  {
    icon: Truck,
    title: "سياسة التوصيل",
    items: [
      "رسوم التوصيل تختلف حسب المنطقة وتُعرض قبل تأكيد الطلب",
      "التوصيل مجاني عند تجاوز حد معين يختلف حسب المنطقة",
      "مدة التوصيل المتوقعة: 1-6 أيام عمل حسب المنطقة",
      "المتجر غير مسؤول عن التأخير الناتج عن ظروف قاهرة",
      "يجب التأكد من صحة العنوان ورقم الهاتف لضمان التوصيل",
    ],
  },
  {
    icon: RotateCcw,
    title: "سياسة الإرجاع والاستبدال",
    items: [
      "يحق للعميل طلب إرجاع المنتج خلال 7 أيام من تاريخ الاستلام",
      "المنتج يجب أن يكون بحالته الأصلية وغير مستخدم ومع التغليف الأصلي",
      "المنتجات الكهربائية المفتوحة لا تُقبل للإرجاع إلا إذا كانت معيبة",
      "رسوم الشحن الأصلية غير قابلة للاسترداد",
      "يتم استرداد المبلغ بنفس طريقة الدفع الأصلية خلال 3-5 أيام عمل",
      "منتجات التخفيضات والعروض الخاصة غير قابلة للإرجاع",
    ],
  },
  {
    icon: Users,
    title: "أنواع الحسابات",
    items: [
      "العميل العادي: تسجيل برقم الهاتف، أسعار تجزئة عادية",
      "حساب الورش: خصم 10%، فواتير شهرية بعد 3 طلبات ناجحة",
      "الحساب الحكومي: خصم 15%، دفع آجل 30 يوم، يتطلب مستند مختوم رسمي",
      "تاجر الجملة: خصم 20%، حد أدنى 1000 ر.س، شحن مجاني",
      "في حال تغيير المسؤول في المؤسسات الحكومية يجب تقديم مستند جديد",
      "يحق للمتجر إيقاف أي حساب يخالف الشروط أو يسيء الاستخدام",
    ],
  },
  {
    icon: Shield,
    title: "الخصوصية والأمان",
    items: [
      "نحتفظ ببيانات العملاء بسرية تامة ولا نشاركها مع أطراف ثالثة",
      "يتم استخدام البيانات فقط لتحسين الخدمة ومعالجة الطلبات",
      "يحق للعميل طلب حذف بياناته الشخصية في أي وقت",
      "نستخدم تقنيات حماية متقدمة لحماية المعلومات الشخصية والمالية",
    ],
  },
];

const Terms = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <h1 className="text-base font-bold">الشروط والأحكام</h1>
        <div className="w-5" />
      </header>

      <div className="px-4 py-4 space-y-4 pb-8" dir="rtl">
        <p className="text-xs text-muted-foreground">آخر تحديث: 27 مارس 2026</p>

        {sections.map(({ icon: Icon, title, items }, si) => (
          <div key={title} className={`bg-card rounded-xl p-4 shadow-sm animate-fade-in-up stagger-${Math.min(si + 1, 5)}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-sm font-bold">{title}</h2>
            </div>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                  <span className="text-primary mt-0.5 shrink-0 font-bold">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default Terms;
