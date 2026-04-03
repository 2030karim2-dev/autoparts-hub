import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Send, Users, Megaphone, Clock, CheckCircle, Plus, Filter } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  target: string;
  targetLabel: string;
  type: "عرض" | "تحديث طلب" | "تنبيه" | "عام";
  status: "مرسل" | "مجدول";
  sentAt: string;
  readCount: number;
  totalCount: number;
}

const notifications: Notification[] = [
  { id: "N001", title: "عرض خاص على الفرامل!", message: "خصم 20% على جميع أنواع تيل الفرامل لمدة أسبوع", target: "all", targetLabel: "جميع العملاء", type: "عرض", status: "مرسل", sentAt: "2026-04-02 10:30", readCount: 892, totalCount: 1847 },
  { id: "N002", title: "وصول شحنة جديدة", message: "تم استلام شحنة فلاتر هواء تويوتا وهيونداي الأصلية", target: "workshop", targetLabel: "الورش", type: "تحديث طلب", status: "مرسل", sentAt: "2026-04-01 14:00", readCount: 38, totalCount: 45 },
  { id: "N003", title: "تحديث أسعار الصرف", message: "تم تحديث أسعار صرف الريال اليمني مقابل الريال السعودي", target: "all", targetLabel: "جميع العملاء", type: "تنبيه", status: "مرسل", sentAt: "2026-03-31 09:00", readCount: 1200, totalCount: 1847 },
  { id: "N004", title: "عرض رمضان الكبير", message: "خصومات تصل إلى 30% على جميع المنتجات بمناسبة شهر رمضان", target: "all", targetLabel: "جميع العملاء", type: "عرض", status: "مجدول", sentAt: "2026-04-05 08:00", readCount: 0, totalCount: 1847 },
  { id: "N005", title: "تخفيضات حصرية لعملاء الجملة", message: "خصم إضافي 10% على طلبات الجملة فوق 5000 ر.س", target: "wholesale", targetLabel: "عملاء الجملة", type: "عرض", status: "مرسل", sentAt: "2026-03-29 11:00", readCount: 18, totalCount: 22 },
];

const typeColors: Record<string, string> = {
  "عرض": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "تحديث طلب": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "تنبيه": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "عام": "bg-muted text-muted-foreground",
};

const AdminNotifications = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("الكل");

  const filtered = notifications.filter(n => typeFilter === "الكل" || n.type === typeFilter);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">إدارة الإشعارات</h1>
            <p className="text-sm text-muted-foreground mt-1">إرسال وإدارة الإشعارات للعملاء</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" /> إشعار جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg" dir="rtl">
              <DialogHeader>
                <DialogTitle>إرسال إشعار جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">عنوان الإشعار</Label>
                  <Input placeholder="عرض خاص على الفرامل!" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">نص الإشعار</Label>
                  <Textarea placeholder="اكتب رسالة الإشعار هنا..." className="text-sm" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">الفئة المستهدفة</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع العملاء</SelectItem>
                        <SelectItem value="retail">عملاء التجزئة</SelectItem>
                        <SelectItem value="workshop">الورش</SelectItem>
                        <SelectItem value="government">الجهات الحكومية</SelectItem>
                        <SelectItem value="wholesale">عملاء الجملة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">نوع الإشعار</Label>
                    <Select defaultValue="عرض">
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="عرض">عرض ترويجي</SelectItem>
                        <SelectItem value="تحديث طلب">تحديث طلب</SelectItem>
                        <SelectItem value="تنبيه">تنبيه</SelectItem>
                        <SelectItem value="عام">عام</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 gap-1.5" onClick={() => setDialogOpen(false)}>
                    <Send className="h-4 w-4" /> إرسال الآن
                  </Button>
                  <Button variant="outline" className="gap-1.5" onClick={() => setDialogOpen(false)}>
                    <Clock className="h-4 w-4" /> جدولة
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "إجمالي الإشعارات", value: notifications.length, icon: Bell, color: "text-primary" },
            { label: "المرسلة", value: notifications.filter(n => n.status === "مرسل").length, icon: CheckCircle, color: "text-green-600" },
            { label: "المجدولة", value: notifications.filter(n => n.status === "مجدول").length, icon: Clock, color: "text-yellow-600" },
            { label: "الوصول", value: `${Math.round((notifications.reduce((a, n) => a + n.readCount, 0) / notifications.reduce((a, n) => a + n.totalCount, 0)) * 100)}%`, icon: Users, color: "text-accent-foreground" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-3 text-center">
                <s.icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} />
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["الكل", "عرض", "تحديث طلب", "تنبيه", "عام"].map((t) => (
            <Button
              key={t}
              variant={typeFilter === t ? "default" : "outline"}
              size="sm"
              className="text-xs shrink-0"
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </Button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="space-y-3">
          {filtered.map((notif) => (
            <Card key={notif.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Megaphone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-foreground">{notif.title}</h3>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${typeColors[notif.type]}`}>
                        {notif.type}
                      </span>
                      {notif.status === "مجدول" && (
                        <Badge variant="outline" className="text-[10px] gap-0.5">
                          <Clock className="h-2.5 w-2.5" /> مجدول
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notif.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span>📤 {notif.targetLabel}</span>
                      <span>🕐 {notif.sentAt}</span>
                      {notif.status === "مرسل" && (
                        <span>👁 {notif.readCount}/{notif.totalCount} قرأ</span>
                      )}
                    </div>
                    {notif.status === "مرسل" && (
                      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(notif.readCount / notif.totalCount) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
