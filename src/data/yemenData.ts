// === الصرافات اليمنية ===
export interface Exchange {
  id: string;
  name: string;
  logo: string;
  color: string;
}

export const yemenExchanges: Exchange[] = [
  { id: "alkuraimi", name: "الكريمي", logo: "🏦", color: "hsl(213 56% 24%)" },
  { id: "alamqi", name: "العمقي", logo: "🏦", color: "hsl(142 71% 45%)" },
  { id: "albusairi", name: "البسيري", logo: "🏦", color: "hsl(38 92% 50%)" },
  { id: "alqutaibi", name: "القطيبي", logo: "🏦", color: "hsl(0 72% 51%)" },
  { id: "bindawl", name: "بن دول", logo: "🏦", color: "hsl(270 50% 45%)" },
  { id: "unified", name: "الشبكة الموحدة", logo: "🌐", color: "hsl(200 60% 40%)" },
  { id: "alnajm", name: "النجم", logo: "⭐", color: "hsl(45 90% 50%)" },
];

// === حسابات المتجر في الصرافات ===
export interface StoreAccount {
  exchangeId: string;
  accountName: string;
  accountNumber: string;
  phone: string;
}

export const storeAccounts: StoreAccount[] = [
  { exchangeId: "alkuraimi", accountName: "مؤسسة قطع غيار اليمن", accountNumber: "1234567890", phone: "771000001" },
  { exchangeId: "alamqi", accountName: "مؤسسة قطع غيار اليمن", accountNumber: "9876543210", phone: "771000002" },
  { exchangeId: "albusairi", accountName: "مؤسسة قطع غيار اليمن", accountNumber: "1122334455", phone: "771000003" },
  { exchangeId: "alqutaibi", accountName: "مؤسسة قطع غيار اليمن", accountNumber: "5566778899", phone: "771000004" },
  { exchangeId: "bindawl", accountName: "مؤسسة قطع غيار اليمن", accountNumber: "6677889900", phone: "771000005" },
  { exchangeId: "unified", accountName: "مؤسسة قطع غيار اليمن", accountNumber: "7788990011", phone: "771000006" },
  { exchangeId: "alnajm", accountName: "مؤسسة قطع غيار اليمن", accountNumber: "8899001122", phone: "771000007" },
];

// === العملات ===
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number; // بالنسبة للريال السعودي
}

export const currencies: Currency[] = [
  { code: "SAR", name: "ريال سعودي", symbol: "ر.س", flag: "🇸🇦", rate: 1 },
  { code: "YER", name: "ريال يمني", symbol: "ر.ي", flag: "🇾🇪", rate: 160 },
  { code: "OMR", name: "ريال عماني", symbol: "ر.ع", flag: "🇴🇲", rate: 0.1025 },
];

// === مناطق التوصيل ===
export interface DeliveryZone {
  id: string;
  city: string;
  areas: string[];
  fee: number; // بالريال السعودي
  estimatedDays: string;
  freeAbove: number; // مجاني فوق هذا المبلغ
}

export const deliveryZones: DeliveryZone[] = [
  { id: "sanaa", city: "صنعاء", areas: ["شارع الستين", "شارع حدة", "شارع تعز", "الجراف", "بيت بوس", "شميلة", "السنينة"], fee: 15, estimatedDays: "1-2", freeAbove: 500 },
  { id: "aden", city: "عدن", areas: ["كريتر", "المعلا", "خور مكسر", "الشيخ عثمان", "المنصورة", "دار سعد"], fee: 35, estimatedDays: "2-4", freeAbove: 800 },
  { id: "taiz", city: "تعز", areas: ["المظفر", "القاهرة", "صالة", "المسراخ"], fee: 30, estimatedDays: "2-3", freeAbove: 700 },
  { id: "ibb", city: "إب", areas: ["المشنة", "الظهار", "القفر", "بعدان"], fee: 30, estimatedDays: "2-3", freeAbove: 700 },
  { id: "hodeidah", city: "الحديدة", areas: ["المينا", "الحالي", "الحوك", "بيت الفقيه"], fee: 35, estimatedDays: "3-4", freeAbove: 800 },
  { id: "dhamar", city: "ذمار", areas: ["المدينة", "عنس", "جهران"], fee: 25, estimatedDays: "2-3", freeAbove: 600 },
  { id: "hajjah", city: "حجة", areas: ["المدينة", "حرض", "ميدي", "عبس"], fee: 40, estimatedDays: "3-5", freeAbove: 900 },
  { id: "mukalla", city: "المكلا", areas: ["المكلا", "الشحر", "غيل باوزير"], fee: 50, estimatedDays: "4-6", freeAbove: 1000 },
  { id: "marib", city: "مأرب", areas: ["المدينة", "مأرب الوادي"], fee: 35, estimatedDays: "3-4", freeAbove: 800 },
  { id: "amran", city: "عمران", areas: ["المدينة", "ثلا", "خمر"], fee: 20, estimatedDays: "1-2", freeAbove: 500 },
  { id: "saada", city: "صعدة", areas: ["المدينة", "ضحيان"], fee: 45, estimatedDays: "4-5", freeAbove: 900 },
];

// === أنواع العملاء ===
export type CustomerType = "retail" | "workshop" | "government" | "wholesale";

export interface CustomerTypeInfo {
  type: CustomerType;
  label: string;
  icon: string;
  description: string;
  requirements: string[];
  benefits: string[];
  discountPercent: number;
}

export const customerTypes: CustomerTypeInfo[] = [
  {
    type: "retail",
    label: "عميل عادي",
    icon: "👤",
    description: "للأفراد والمستهلكين العاديين",
    requirements: ["رقم الهاتف", "الاسم الكامل"],
    benefits: ["أسعار التجزئة", "نقاط مكافأة", "عروض حصرية"],
    discountPercent: 0,
  },
  {
    type: "workshop",
    label: "ورشة / مركز صيانة",
    icon: "🔧",
    description: "لورش الصيانة ومراكز الخدمة المعتمدة",
    requirements: ["رقم الهاتف", "اسم الورشة", "عنوان الورشة"],
    benefits: ["خصم 10% على كل الطلبات", "فواتير شهرية", "أولوية في التوصيل", "مندوب مخصص"],
    discountPercent: 10,
  },
  {
    type: "government",
    label: "مؤسسة حكومية",
    icon: "🏛️",
    description: "للجهات والمؤسسات الحكومية",
    requirements: ["رقم الهاتف", "اسم المؤسسة", "مستند مختوم بأمر التعامل", "اسم المسؤول"],
    benefits: ["خصم 15% على كل الطلبات", "دفع آجل (30 يوم)", "فواتير رسمية", "أولوية قصوى"],
    discountPercent: 15,
  },
  {
    type: "wholesale",
    label: "تاجر جملة",
    icon: "📦",
    description: "لتجار الجملة والموزعين",
    requirements: ["رقم الهاتف", "الاسم التجاري", "السجل التجاري"],
    benefits: ["أسعار الجملة (خصم 20%)", "حد أدنى للطلب 1000 ر.س", "شحن مجاني", "أسعار خاصة بالكمية"],
    discountPercent: 20,
  },
];

// === أسباب الإرجاع ===
export const returnReasons = [
  "المنتج تالف أو معيب",
  "المنتج لا يتوافق مع السيارة",
  "تم إرسال منتج خاطئ",
  "المنتج لا يطابق الوصف",
  "وجدت سعر أفضل",
  "لم أعد بحاجة للمنتج",
  "سبب آخر",
];
