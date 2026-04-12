import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import AdminTablePagination from "../components/AdminTablePagination";
import AdminEmptyState from "../components/AdminEmptyState";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Bell, Send, Users, Megaphone, Clock, CheckCircle, Plus, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string; title: string; message: string; target: string; targetLabel: string;
  type: "عرض" | "تحديث طلب" | "تنبيه" | "عام"; status: "مرسل" | "مجدول";
  sentAt: string; readCount: number; totalCount: number;
}

const initialNotifications: Notification[] = [
  { id: "N001", title: "عرض خاص على الفرامل!", message: "خصم 20% على جميع أنواع تيل الفرامل لمدة أسبوع", target: "all", targetLabel: "جميع العملاء", type: "عرض", status: "مرسل", sentAt: "2026-04-02 10:30", readCount: 892, totalCount: 1847 },
  { id: "N002", title: "وصول شحنة جديدة", message: "تم استلام شحنة فلاتر هواء تويوتا وهيونداي الأصلية", target: "workshop", targetLabel: "الورش", type: "تحديث طلب", status: "مرسل", sentAt: "2026-04-01 14:00", readCount: 38, totalCount: 45 },
  { id: "N003", title: "تحديث أسعار الصرف", message: "تم تحديث أسعار صرف الريال اليمني مقابل الريال السعودي", target: "all", targetLabel: "جميع العملاء", type: "تنبيه", status: "مرسل", sentAt: "2026-03-31 09:00", readCount: 1200, totalCount: 1847 },
  { id: "N004", title: "عرض رمضان الكبير", message: "خصومات تصل إلى 30% على جميع المنتجات بمناسبة شهر رمضان", target: "all", targetLabel: "جميع العملاء", type: "عرض", status: "مجدول", sentAt: "2026-04-05 08:00", readCount: 0, totalCount: 1847 },
  { id: "N005", title: "تخفيضات حصرية لعملاء الجملة", message: "خصم إضافي 10% على طلبات الجملة فوق 5000 ر.س", target: "wholesale", targetLabel: "عملاء الجملة", type: "عرض", status: "مرسل", sentAt: "2026-03-29 11:00", readCount: 18, totalCount: 22 },
];

const typeColors: Record<string, string> = {
  "عرض": "bg-primary/10 text-primary dark:bg-primary/20",
  "تحديث طلب": "bg-accent/50 text-accent-foreground",
  "تنبيه": "bg-warning/10 text-warning dark:bg-warning/20",
  "عام": "bg-muted text-muted-foreground",
};

const targetLabels: Record<string, string> = { all: "جميع العملاء", retail: "عملاء التجزئة", workshop: "الورش", government: "الجهات الحكومية", wholesale: "عملاء الجملة" };
const targetCounts: Record<string, number> = { all: 1847, retail: 1200, workshop: 45, government: 12, wholesale: 22 };

interface NotifForm { title: string; message: string; target: string; type: string; }
const emptyForm: NotifForm = { title: "", message: "", target: "all", type: "عرض" };

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("الكل");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<NotifForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof NotifForm, string>>>({});
  const [deleteTarget, setDeleteTarget] = useState<Notification | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const filtered = notifications.filter(n => {
    const matchType = typeFilter === "الكل" || n.type === typeFilter;
    const matchSearch = n.title.includes(debouncedSearch) || n.message.includes(debouncedSearch);
    return matchType && matchSearch;
  });

  const pagination = usePagination(filtered, { pageSize: 6 });

  const handleSend = (scheduled: boolean) => {
    const newErrors: Partial<Record<keyof NotifForm, string>> = {};
    if (!form.title.trim()) newErrors.title = "العنوان مطلوب";
    if (!form.message.trim()) newErrors.message = "نص الإشعار مطلوب";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const now = new Date().toISOString().replace("T", " ").slice(0, 16);
    const newNotif: Notification = {
      id: `N-${Date.now()}`, title: form.title.trim(), message: form.message.trim(),
      target: form.target, targetLabel: targetLabels[form.target],
      type: form.type as Notification["type"], status: scheduled ? "مجدول" : "مرسل",
      sentAt: now, readCount: 0, totalCount: targetCounts[form.target] || 1847,
    };
    setNotifications(prev => [newNotif, ...prev]);
    toast.success(scheduled ? "تم جدولة الإشعار بنجاح" : "تم إرسال الإشعار بنجاح");
    setDialogOpen(false);
    setForm(emptyForm);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setNotifications(prev => prev.filter(n => n.id !== deleteTarget.id));
    toast.success("تم حذف الإشعار");
    setDeleteTarget(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">إدارة الإشعارات</h1>
            <p className="text-sm text-muted-foreground mt-1">إرسال وإدارة الإشعارات للعملاء</p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => { setForm(emptyForm); setErrors({}); setDialogOpen(true); }}>
            <Plus className="h-4 w-4" /> إشعار جديد
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "إجمالي الإشعارات", value: notifications.length, icon: Bell, color: "text-primary" },
            { label: "المرسلة", value: notifications.filter(n => n.status === "مرسل").length, icon: CheckCircle, color: "text-primary" },
            { label: "المجدولة", value: notifications.filter(n => n.status === "مجدول").length, icon: Clock, color: "text-warning" },
            { label: "الوصول", value: notifications.length > 0 ? `${Math.round((notifications.reduce((a, n) => a + n.readCount, 0) / Math.max(notifications.reduce((a, n) => a + n.totalCount, 0), 1)) * 100)}%` : "0%", icon: Users, color: "text-accent-foreground" },
          ].map((s) => (
            <Card key={s.label}><CardContent className="p-3 text-center"><s.icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} /><p className="text-lg font-bold text-foreground">{s.value}</p><p className="text-[10px] text-muted-foreground">{s.label}</p></CardContent></Card>
          ))}
        </div>

        <Card><CardContent className="p-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="بحث في الإشعارات..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 h-9 text-sm" />
          </div>
        </CardContent></Card>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {["الكل", "عرض", "تحديث طلب", "تنبيه", "عام"].map((t) => (
            <Button key={t} variant={typeFilter === t ? "default" : "outline"} size="sm" className="text-xs shrink-0" onClick={() => setTypeFilter(t)}>{t}</Button>
          ))}
        </div>

        <div className="space-y-3">
          {pagination.paginatedItems.length === 0 ? (
            <AdminEmptyState title="لا توجد إشعارات" description="جرب تغيير كلمات البحث أو الفلتر" />
          ) : pagination.paginatedItems.map((notif) => (
            <Card key={notif.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Megaphone className="h-5 w-5 text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-foreground">{notif.title}</h3>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${typeColors[notif.type]}`}>{notif.type}</span>
                      {notif.status === "مجدول" && <Badge variant="outline" className="text-[10px] gap-0.5"><Clock className="h-2.5 w-2.5" /> مجدول</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notif.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span>📤 {notif.targetLabel}</span><span>🕐 {notif.sentAt}</span>
                      {notif.status === "مرسل" && <span>👁 {notif.readCount}/{notif.totalCount} قرأ</span>}
                    </div>
                    {notif.status === "مرسل" && (
                      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(notif.readCount / notif.totalCount) * 100}%` }} /></div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive shrink-0" onClick={() => setDeleteTarget(notif)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {pagination.totalPages > 1 && <AdminTablePagination {...pagination} />}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader><DialogTitle>إرسال إشعار جديد</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs">عنوان الإشعار</Label>
                <Input placeholder="عرض خاص على الفرامل!" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
                {errors.title && <p className="text-[10px] text-destructive">{errors.title}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">نص الإشعار</Label>
                <Textarea placeholder="اكتب رسالة الإشعار هنا..." className="text-sm" rows={3} value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} />
                {errors.message && <p className="text-[10px] text-destructive">{errors.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">الفئة المستهدفة</Label>
                  <Select value={form.target} onValueChange={(v) => setForm(f => ({ ...f, target: v }))}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع العملاء</SelectItem><SelectItem value="retail">عملاء التجزئة</SelectItem>
                      <SelectItem value="workshop">الورش</SelectItem><SelectItem value="government">الجهات الحكومية</SelectItem>
                      <SelectItem value="wholesale">عملاء الجملة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">نوع الإشعار</Label>
                  <Select value={form.type} onValueChange={(v) => setForm(f => ({ ...f, type: v }))}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="عرض">عرض ترويجي</SelectItem><SelectItem value="تحديث طلب">تحديث طلب</SelectItem>
                      <SelectItem value="تنبيه">تنبيه</SelectItem><SelectItem value="عام">عام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 gap-1.5" onClick={() => handleSend(false)}><Send className="h-4 w-4" /> إرسال الآن</Button>
                <Button variant="outline" className="gap-1.5" onClick={() => handleSend(true)}><Clock className="h-4 w-4" /> جدولة</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>هل أنت متأكد من حذف إشعار "{deleteTarget?.title}"؟</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row-reverse gap-2">
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">حذف</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
