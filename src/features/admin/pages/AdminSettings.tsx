import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save, Store, Bell, Shield, Palette, Globe, Receipt, FileText,
  Smartphone, Mail, MapPin, Clock, Image, CreditCard
} from "lucide-react";

const AdminSettings = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">الإعدادات</h1>
          <p className="text-sm text-muted-foreground mt-1">إعدادات المتجر والنظام</p>
        </div>

        <Tabs defaultValue="store" className="space-y-4">
          <TabsList className="w-full grid grid-cols-4 sm:grid-cols-6 h-9 overflow-x-auto">
            <TabsTrigger value="store" className="text-[10px] sm:text-xs">🏪 المتجر</TabsTrigger>
            <TabsTrigger value="notifications" className="text-[10px] sm:text-xs">🔔 الإشعارات</TabsTrigger>
            <TabsTrigger value="payment" className="text-[10px] sm:text-xs">💳 الدفع</TabsTrigger>
            <TabsTrigger value="tax" className="text-[10px] sm:text-xs">🧾 الضرائب</TabsTrigger>
            <TabsTrigger value="security" className="text-[10px] sm:text-xs">🔐 الأمان</TabsTrigger>
            <TabsTrigger value="policies" className="text-[10px] sm:text-xs">📜 السياسات</TabsTrigger>
          </TabsList>

          {/* Store Info */}
          <TabsContent value="store" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Store className="h-4 w-4" /> معلومات المتجر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">اسم المتجر</Label>
                    <Input defaultValue="مؤسسة قطع غيار اليمن" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">الاسم المختصر</Label>
                    <Input defaultValue="قطع اليمن" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1"><Smartphone className="h-3 w-3" /> رقم الهاتف</Label>
                    <Input defaultValue="771000000" dir="ltr" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1"><Smartphone className="h-3 w-3" /> رقم واتساب</Label>
                    <Input defaultValue="771000000" dir="ltr" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1"><Mail className="h-3 w-3" /> البريد الإلكتروني</Label>
                    <Input defaultValue="info@yemenparts.com" dir="ltr" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3" /> المدينة</Label>
                    <Input defaultValue="صنعاء" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">العنوان التفصيلي</Label>
                  <Input defaultValue="شارع الزبيري، بجوار بنك التسليف" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">وصف المتجر</Label>
                  <Textarea defaultValue="متجر متخصص في بيع قطع غيار السيارات الأصلية والبديلة في اليمن. نوفر قطع لجميع أنواع السيارات مع ضمان الجودة والتوصيل السريع." className="text-sm" rows={3} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1"><Clock className="h-3 w-3" /> ساعات العمل</Label>
                    <Input defaultValue="8:00 صباحاً - 10:00 مساءً" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1"><Globe className="h-3 w-3" /> اللغة الافتراضية</Label>
                    <Select defaultValue="ar">
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button size="sm" className="gap-1.5" onClick={handleSave}>
                  <Save className="h-4 w-4" /> {saved ? "✓ تم الحفظ" : "حفظ"}
                </Button>
              </CardContent>
            </Card>

            {/* Social media */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Globe className="h-4 w-4" /> حسابات التواصل الاجتماعي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "فيسبوك", placeholder: "https://facebook.com/yemenparts", icon: "📘" },
                  { label: "انستغرام", placeholder: "https://instagram.com/yemenparts", icon: "📸" },
                  { label: "تويتر / X", placeholder: "https://x.com/yemenparts", icon: "🐦" },
                  { label: "تيك توك", placeholder: "https://tiktok.com/@yemenparts", icon: "🎵" },
                ].map((social) => (
                  <div key={social.label} className="flex items-center gap-2">
                    <span className="text-lg shrink-0">{social.icon}</span>
                    <Input placeholder={social.placeholder} dir="ltr" className="h-9 text-sm" />
                  </div>
                ))}
                <Button size="sm" variant="outline" className="gap-1.5" onClick={handleSave}>
                  <Save className="h-4 w-4" /> حفظ الروابط
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Bell className="h-4 w-4" /> إعدادات الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "إشعار طلب جديد", desc: "تلقي إشعار عند استلام طلب جديد", default: true },
                  { label: "إشعار تحويل بنكي", desc: "تلقي إشعار عند رفع إيصال تحويل", default: true },
                  { label: "إشعار نفاد المخزون", desc: "تنبيه عند نفاد مخزون منتج أو وصوله للحد الأدنى", default: true },
                  { label: "إشعار طلب إرجاع", desc: "تلقي إشعار عند طلب إرجاع جديد", default: true },
                  { label: "إشعار عميل جديد", desc: "تنبيه عند تسجيل عميل جديد في المتجر", default: false },
                  { label: "ملخص يومي", desc: "استلام ملخص يومي بأداء المتجر عبر البريد", default: false },
                  { label: "إشعارات صوتية", desc: "تشغيل صوت عند استلام إشعار جديد", default: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment */}
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> طرق الدفع المتاحة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "الدفع عند الاستلام (كاش)", desc: "يدفع العميل نقداً عند استلام الطلب", icon: "💵", default: true },
                  { label: "التحويل البنكي عبر الصرافات", desc: "التحويل عبر الكريمي والعمقي والبسيري وغيرها", icon: "🏦", default: true },
                  { label: "الدفع بحساب الصرافة", desc: "التحويل المباشر لحساب المتجر في الصرافة", icon: "💳", default: true },
                  { label: "الدفع الآجل (للجملة والحكومي)", desc: "السماح بالدفع لاحقاً لعملاء الجملة والجهات الحكومية", icon: "📋", default: false },
                ].map((method) => (
                  <div key={method.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{method.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{method.label}</p>
                        <p className="text-[10px] text-muted-foreground">{method.desc}</p>
                      </div>
                    </div>
                    <Switch defaultChecked={method.default} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">إعدادات إضافية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">مهلة تأكيد التحويل (بالساعات)</Label>
                    <Input type="number" defaultValue="24" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">العملة الافتراضية</Label>
                    <Select defaultValue="SAR">
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAR">ريال سعودي (ر.س)</SelectItem>
                        <SelectItem value="YER">ريال يمني (ر.ي)</SelectItem>
                        <SelectItem value="OMR">ريال عماني (ر.ع)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button size="sm" className="gap-1.5" onClick={handleSave}>
                  <Save className="h-4 w-4" /> حفظ
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax */}
          <TabsContent value="tax" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Receipt className="h-4 w-4" /> إعدادات الضرائب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">تفعيل الضريبة</p>
                    <p className="text-[10px] text-muted-foreground">إضافة ضريبة على المنتجات والطلبات</p>
                  </div>
                  <Switch />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">نسبة الضريبة (%)</Label>
                    <Input type="number" defaultValue="0" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">الرقم الضريبي</Label>
                    <Input placeholder="000000000000000" dir="ltr" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">الأسعار شاملة الضريبة</p>
                    <p className="text-[10px] text-muted-foreground">عرض الأسعار في المتجر شاملة الضريبة</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button size="sm" className="gap-1.5" onClick={handleSave}>
                  <Save className="h-4 w-4" /> حفظ
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" /> الأمان وكلمة المرور
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">كلمة المرور الحالية</Label>
                  <Input type="password" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">كلمة المرور الجديدة</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">تأكيد كلمة المرور</Label>
                    <Input type="password" />
                  </div>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Save className="h-4 w-4" /> تغيير كلمة المرور
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">إعدادات الأمان</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "تسجيل خروج تلقائي", desc: "تسجيل الخروج بعد 30 دقيقة من عدم النشاط", default: true },
                  { label: "إشعار تسجيل دخول جديد", desc: "تلقي إشعار عند تسجيل دخول من جهاز جديد", default: true },
                  { label: "حظر محاولات الدخول الفاشلة", desc: "حظر IP بعد 5 محاولات فاشلة", default: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies */}
          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" /> سياسات المتجر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">سياسة الإرجاع والاستبدال</Label>
                  <Textarea
                    defaultValue="يحق للعميل إرجاع المنتج خلال 7 أيام من تاريخ الاستلام بشرط أن يكون بحالته الأصلية مع إيصال الشراء. لا يشمل الإرجاع المنتجات المصنعة حسب الطلب أو القطع الكهربائية بعد فتحها."
                    className="text-sm" rows={4}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">سياسة الضمان</Label>
                  <Textarea
                    defaultValue="جميع المنتجات الأصلية مضمونة لمدة سنة ضد عيوب التصنيع. يستثنى من الضمان التلف الناتج عن سوء الاستخدام أو التركيب الخاطئ."
                    className="text-sm" rows={3}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">شروط وأحكام عملاء الجملة</Label>
                  <Textarea
                    defaultValue="الحد الأدنى للطلب 5,000 ر.س. يتم التسعير حسب الكمية والاتفاق. الدفع خلال 30 يوم من تاريخ الفاتورة. يشترط تقديم سجل تجاري ساري المفعول."
                    className="text-sm" rows={3}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">شروط التعامل مع الجهات الحكومية</Label>
                  <Textarea
                    defaultValue="يشترط تقديم خطاب رسمي مختوم من الجهة الحكومية. الأسعار حسب العقود والاتفاقيات. الدفع حسب إجراءات الجهة الحكومية."
                    className="text-sm" rows={3}
                  />
                </div>
                <Button size="sm" className="gap-1.5" onClick={handleSave}>
                  <Save className="h-4 w-4" /> حفظ السياسات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
