import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Save, Store, Bell, Shield, Palette } from "lucide-react";

const AdminSettings = () => (
  <AdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">الإعدادات</h1>
        <p className="text-sm text-muted-foreground mt-1">إعدادات المتجر والنظام</p>
      </div>

      {/* Store info */}
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
              <Label className="text-xs">رقم الهاتف</Label>
              <Input defaultValue="771000000" dir="ltr" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">البريد الإلكتروني</Label>
              <Input defaultValue="info@yemenparts.com" dir="ltr" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">المدينة</Label>
              <Input defaultValue="صنعاء" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">وصف المتجر</Label>
            <Textarea defaultValue="متجر متخصص في بيع قطع غيار السيارات الأصلية والبديلة في اليمن" className="text-sm" rows={2} />
          </div>
          <Button size="sm" className="gap-1.5">
            <Save className="h-4 w-4" /> حفظ
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4" /> الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "إشعار طلب جديد", desc: "تلقي إشعار عند استلام طلب جديد", default: true },
            { label: "إشعار تحويل بنكي", desc: "تلقي إشعار عند رفع إيصال تحويل", default: true },
            { label: "إشعار نفاد المخزون", desc: "تنبيه عند نفاد مخزون منتج", default: true },
            { label: "إشعار طلب إرجاع", desc: "تلقي إشعار عند طلب إرجاع جديد", default: false },
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

      {/* Security */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4" /> الأمان
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">كلمة المرور الحالية</Label>
            <Input type="password" />
          </div>
          <div className="grid grid-cols-2 gap-3">
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
    </div>
  </AdminLayout>
);

export default AdminSettings;
