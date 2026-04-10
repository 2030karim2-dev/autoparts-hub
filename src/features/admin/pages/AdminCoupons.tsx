import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Tag, Copy, Trash2, Edit, TicketPercent, Calendar, Users } from "lucide-react";
import { toast } from "sonner";

interface Coupon {
  id: string; code: string; type: "percentage" | "fixed"; value: number;
  minOrder: number; maxUses: number; usedCount: number;
  target: string; targetLabel: string; expiresAt: string; active: boolean;
}

const initialCoupons: Coupon[] = [
  { id: "CP001", code: "BRAKE20", type: "percentage", value: 20, minOrder: 200, maxUses: 100, usedCount: 45, target: "all", targetLabel: "الكل", expiresAt: "2026-04-30", active: true },
  { id: "CP002", code: "WORKSHOP10", type: "percentage", value: 10, minOrder: 500, maxUses: 50, usedCount: 22, target: "workshop", targetLabel: "الورش", expiresAt: "2026-05-15", active: true },
  { id: "CP003", code: "FLAT50", type: "fixed", value: 50, minOrder: 300, maxUses: 200, usedCount: 180, target: "all", targetLabel: "الكل", expiresAt: "2026-04-10", active: true },
  { id: "CP004", code: "GOV15", type: "percentage", value: 15, minOrder: 1000, maxUses: 30, usedCount: 8, target: "government", targetLabel: "حكومي", expiresAt: "2026-06-01", active: true },
  { id: "CP005", code: "WELCOME", type: "percentage", value: 5, minOrder: 0, maxUses: 1000, usedCount: 350, target: "retail", targetLabel: "تجزئة", expiresAt: "2026-12-31", active: false },
];

const targetLabels: Record<string, string> = { all: "الكل", retail: "تجزئة", workshop: "الورش", government: "حكومي", wholesale: "جملة" };

interface CouponForm { code: string; type: "percentage" | "fixed"; value: string; minOrder: string; maxUses: string; expiresAt: string; target: string; active: boolean; }
const emptyForm: CouponForm = { code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiresAt: "", target: "all", active: true };

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [form, setForm] = useState<CouponForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CouponForm, string>>>({});

  const activeCoupons = coupons.filter(c => c.active).length;
  const totalUsage = coupons.reduce((a, c) => a + c.usedCount, 0);

  const handleOpenAdd = () => { setEditingCoupon(null); setForm(emptyForm); setErrors({}); setDialogOpen(true); };
  const handleOpenEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setForm({ code: coupon.code, type: coupon.type, value: coupon.value.toString(), minOrder: coupon.minOrder.toString(), maxUses: coupon.maxUses.toString(), expiresAt: coupon.expiresAt, target: coupon.target, active: coupon.active });
    setErrors({});
    setDialogOpen(true);
  };

  const handleSave = () => {
    const newErrors: Partial<Record<keyof CouponForm, string>> = {};
    if (!form.code.trim()) newErrors.code = "كود الكوبون مطلوب";
    if (!form.value || parseFloat(form.value) <= 0) newErrors.value = "القيمة مطلوبة";
    if (!form.expiresAt) newErrors.expiresAt = "تاريخ الانتهاء مطلوب";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (editingCoupon) {
      setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? { ...c, code: form.code.toUpperCase().trim(), type: form.type, value: parseFloat(form.value), minOrder: parseFloat(form.minOrder) || 0, maxUses: parseInt(form.maxUses) || 100, expiresAt: form.expiresAt, target: form.target, targetLabel: targetLabels[form.target], active: form.active } : c));
      toast.success("تم تحديث الكوبون بنجاح");
    } else {
      const newCoupon: Coupon = { id: `CP-${Date.now()}`, code: form.code.toUpperCase().trim(), type: form.type, value: parseFloat(form.value), minOrder: parseFloat(form.minOrder) || 0, maxUses: parseInt(form.maxUses) || 100, usedCount: 0, expiresAt: form.expiresAt, target: form.target, targetLabel: targetLabels[form.target], active: form.active };
      setCoupons(prev => [newCoupon, ...prev]);
      toast.success("تم إنشاء الكوبون بنجاح");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCoupons(prev => prev.filter(c => c.id !== deleteTarget.id));
    toast.success(`تم حذف الكوبون "${deleteTarget.code}"`);
    setDeleteTarget(null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`تم نسخ "${code}"`);
  };

  const handleToggleActive = (couponId: string) => {
    setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, active: !c.active } : c));
    toast.success("تم تحديث حالة الكوبون");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">إدارة الكوبونات</h1>
            <p className="text-sm text-muted-foreground mt-1">{coupons.length} كوبون • {activeCoupons} نشط</p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={handleOpenAdd}><Plus className="h-4 w-4" /> كوبون جديد</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card><CardContent className="p-3 text-center"><TicketPercent className="h-5 w-5 text-primary mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{activeCoupons}</p><p className="text-[10px] text-muted-foreground">كوبونات نشطة</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><Users className="h-5 w-5 text-green-600 mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{totalUsage}</p><p className="text-[10px] text-muted-foreground">إجمالي الاستخدام</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><Calendar className="h-5 w-5 text-yellow-600 mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{coupons.filter(c => new Date(c.expiresAt) < new Date()).length}</p><p className="text-[10px] text-muted-foreground">منتهية الصلاحية</p></CardContent></Card>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الكوبون</TableHead>
                    <TableHead className="text-right">الخصم</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">الاستخدام</TableHead>
                    <TableHead className="text-right hidden md:table-cell">الفئة</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right w-24">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">لا توجد كوبونات</TableCell></TableRow>
                  ) : coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><Tag className="h-4 w-4 text-primary" /></div>
                          <div><p className="text-sm font-mono font-bold text-foreground" dir="ltr">{coupon.code}</p><p className="text-[10px] text-muted-foreground">حتى {coupon.expiresAt}</p></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold text-foreground">{coupon.type === "percentage" ? `${coupon.value}%` : `${coupon.value} ر.س`}</span>
                        {coupon.minOrder > 0 && <p className="text-[10px] text-muted-foreground">فوق {coupon.minOrder} ر.س</p>}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div>
                          <p className="text-sm text-foreground">{coupon.usedCount}/{coupon.maxUses}</p>
                          <div className="h-1 w-16 bg-muted rounded-full mt-1 overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${(coupon.usedCount / coupon.maxUses) * 100}%` }} /></div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell"><Badge variant="outline" className="text-[10px]">{coupon.targetLabel}</Badge></TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] cursor-pointer ${coupon.active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`} onClick={() => handleToggleActive(coupon.id)}>
                          {coupon.active ? "نشط" : "معطل"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="نسخ الكود" onClick={() => handleCopyCode(coupon.code)}><Copy className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenEdit(coupon)}><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteTarget(coupon)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader><DialogTitle>{editingCoupon ? "تعديل الكوبون" : "إنشاء كوبون جديد"}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">كود الكوبون</Label>
                  <Input placeholder="BRAKE20" className="font-mono uppercase" dir="ltr" value={form.code} onChange={(e) => setForm(f => ({ ...f, code: e.target.value }))} />
                  {errors.code && <p className="text-[10px] text-destructive">{errors.code}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">نوع الخصم</Label>
                  <Select value={form.type} onValueChange={(v) => setForm(f => ({ ...f, type: v as "percentage" | "fixed" }))}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="percentage">نسبة مئوية %</SelectItem><SelectItem value="fixed">مبلغ ثابت</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">قيمة الخصم</Label>
                  <Input type="number" placeholder="20" value={form.value} onChange={(e) => setForm(f => ({ ...f, value: e.target.value }))} />
                  {errors.value && <p className="text-[10px] text-destructive">{errors.value}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">الحد الأدنى للطلب (ر.س)</Label>
                  <Input type="number" placeholder="200" value={form.minOrder} onChange={(e) => setForm(f => ({ ...f, minOrder: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">الحد الأقصى للاستخدام</Label>
                  <Input type="number" placeholder="100" value={form.maxUses} onChange={(e) => setForm(f => ({ ...f, maxUses: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">تاريخ الانتهاء</Label>
                  <Input type="date" value={form.expiresAt} onChange={(e) => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
                  {errors.expiresAt && <p className="text-[10px] text-destructive">{errors.expiresAt}</p>}
                </div>
              </div>
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
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <Label className="text-sm">تفعيل الكوبون</Label>
                <Switch checked={form.active} onCheckedChange={(v) => setForm(f => ({ ...f, active: v }))} />
              </div>
              <Button className="w-full" onClick={handleSave}>{editingCoupon ? "حفظ التعديلات" : "إنشاء الكوبون"}</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>هل أنت متأكد من حذف الكوبون "{deleteTarget?.code}"؟</AlertDialogDescription>
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

export default AdminCoupons;
