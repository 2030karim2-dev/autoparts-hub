import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Eye, RotateCcw, CheckCircle, XCircle, Clock } from "lucide-react";

type ReturnStatus = "بانتظار المراجعة" | "مقبول" | "مرفوض";

interface ReturnRequest {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  reason: string;
  status: ReturnStatus;
  date: string;
  amount: number;
}

const returns: ReturnRequest[] = [
  { id: "RET-101", orderId: "ORD-1020", customer: "أحمد محمد", product: "بواجي NGK إيريديوم", reason: "المنتج لا يتوافق مع السيارة", status: "بانتظار المراجعة", date: "2026-04-01", amount: 90 },
  { id: "RET-100", orderId: "ORD-1018", customer: "خالد سعيد", product: "فلتر هواء تويوتا", reason: "المنتج تالف أو معيب", status: "بانتظار المراجعة", date: "2026-03-31", amount: 50 },
  { id: "RET-099", orderId: "ORD-1015", customer: "ورشة الأمين", product: "تيل فرامل سيراميك", reason: "تم إرسال منتج خاطئ", status: "مقبول", date: "2026-03-29", amount: 100 },
  { id: "RET-098", orderId: "ORD-1010", customer: "علي حسين", product: "مساعدات KYB", reason: "وجدت سعر أفضل", status: "مرفوض", date: "2026-03-28", amount: 250 },
];

const statusConfig: Record<ReturnStatus, { icon: any; color: string }> = {
  "بانتظار المراجعة": { icon: Clock, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  "مقبول": { icon: CheckCircle, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  "مرفوض": { icon: XCircle, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const AdminReturns = () => {
  const [selected, setSelected] = useState<ReturnRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState("الكل");

  const filtered = returns.filter(r => statusFilter === "الكل" || r.status === statusFilter);
  const pending = returns.filter(r => r.status === "بانتظار المراجعة").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">إدارة المرتجعات</h1>
          <p className="text-sm text-muted-foreground mt-1">{returns.length} طلب إرجاع • {pending} بانتظار المراجعة</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <Clock className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{pending}</p>
              <p className="text-[10px] text-muted-foreground">بانتظار المراجعة</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{returns.filter(r => r.status === "مقبول").length}</p>
              <p className="text-[10px] text-muted-foreground">مقبول</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <XCircle className="h-5 w-5 text-destructive mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{returns.filter(r => r.status === "مرفوض").length}</p>
              <p className="text-[10px] text-muted-foreground">مرفوض</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 text-sm w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="الكل">الكل</SelectItem>
            <SelectItem value="بانتظار المراجعة">بانتظار المراجعة</SelectItem>
            <SelectItem value="مقبول">مقبول</SelectItem>
            <SelectItem value="مرفوض">مرفوض</SelectItem>
          </SelectContent>
        </Select>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الطلب</TableHead>
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">المنتج</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right w-16">عرض</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((ret) => (
                    <TableRow key={ret.id}>
                      <TableCell>
                        <span className="text-sm font-mono font-medium text-foreground">{ret.id}</span>
                        <p className="text-[10px] text-muted-foreground">{ret.date}</p>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">{ret.customer}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground truncate max-w-[120px]">{ret.product}</TableCell>
                      <TableCell className="text-sm font-semibold text-foreground">{ret.amount} ر.س</TableCell>
                      <TableCell>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${statusConfig[ret.status].color}`}>
                          {ret.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelected(ret)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Detail dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>طلب إرجاع {selected?.id}</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground">الطلب الأصلي</p>
                    <p className="text-sm font-mono font-medium text-foreground">{selected.orderId}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground">المبلغ</p>
                    <p className="text-sm font-bold text-foreground">{selected.amount} ر.س</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-[10px] text-muted-foreground">المنتج</p>
                  <p className="text-sm font-medium text-foreground">{selected.product}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-[10px] text-muted-foreground">سبب الإرجاع</p>
                  <p className="text-sm text-foreground">{selected.reason}</p>
                </div>

                {selected.status === "بانتظار المراجعة" && (
                  <>
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-foreground">ملاحظات الإدارة</p>
                      <Textarea placeholder="أضف ملاحظة..." className="text-sm" rows={2} />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-1" onClick={() => setSelected(null)}>
                        <CheckCircle className="h-4 w-4" /> قبول الإرجاع
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1 gap-1" onClick={() => setSelected(null)}>
                        <XCircle className="h-4 w-4" /> رفض
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminReturns;
