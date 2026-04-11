import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import AdminTablePagination from "../components/AdminTablePagination";
import AdminEmptyState from "../components/AdminEmptyState";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, ShoppingCart, Clock, Truck, CheckCircle, XCircle, CreditCard, MapPin, Package, FileText, Printer } from "lucide-react";
import { toast } from "sonner";

type OrderStatus = "جديد" | "قيد المعالجة" | "قيد الشحن" | "مكتمل" | "ملغي";
type PaymentMethod = "كاش" | "تحويل صرافة" | "حساب صرافة";
type PaymentStatus = "بانتظار التأكيد" | "مؤكد" | "مرفوض";

interface OrderItem { name: string; sku: string; qty: number; price: number; }
interface Order {
  id: string; customer: string; customerType: string; phone: string;
  items: OrderItem[]; total: number; status: OrderStatus;
  paymentMethod: PaymentMethod; paymentStatus: PaymentStatus;
  exchange?: string; date: string; city: string; address: string;
  deliveryFee: number; notes?: string;
  timeline: { status: string; date: string; note?: string }[];
}

const initialOrders: Order[] = [
  { id: "ORD-1024", customer: "أحمد محمد", customerType: "عادي", phone: "771234567", items: [{ name: "بواجي NGK إيريديوم", sku: "NGK-IR-5", qty: 2, price: 90 }, { name: "فلتر هواء تويوتا", sku: "FLT-AIR-TC", qty: 1, price: 50 }, { name: "فلتر زيت بوش", sku: "BSH-OIL-03", qty: 1, price: 40 }], total: 310, status: "جديد", paymentMethod: "كاش", paymentStatus: "مؤكد", date: "2026-04-01", city: "صنعاء", address: "شارع حدة، بجوار مسجد الصالح", deliveryFee: 40, timeline: [{ status: "جديد", date: "2026-04-01 10:30", note: "تم استلام الطلب" }] },
  { id: "ORD-1023", customer: "ورشة الأمين", customerType: "ورشة", phone: "773456789", items: [{ name: "تيل فرامل سيراميك", sku: "BRK-CER-01", qty: 4, price: 100 }, { name: "هوبات فرامل خلفية", sku: "BRK-DSC-R", qty: 2, price: 150 }, { name: "مساعدات KYB", sku: "KYB-F-001", qty: 2, price: 250 }], total: 1600, status: "قيد الشحن", paymentMethod: "تحويل صرافة", paymentStatus: "بانتظار التأكيد", exchange: "الكريمي", date: "2026-04-01", city: "تعز", address: "شارع جمال، قرب دوار المطار", deliveryFee: 50, timeline: [{ status: "جديد", date: "2026-04-01 08:00" }, { status: "قيد المعالجة", date: "2026-04-01 10:00", note: "تم تجهيز الطلب" }, { status: "قيد الشحن", date: "2026-04-02 09:00", note: "تم تسليم الشحنة للسائق" }] },
  { id: "ORD-1022", customer: "وزارة النقل", customerType: "حكومي", phone: "771112233", items: [{ name: "فلتر هواء تويوتا", sku: "FLT-AIR-TC", qty: 10, price: 50 }, { name: "فلتر زيت بوش", sku: "BSH-OIL-03", qty: 10, price: 40 }, { name: "بواجي NGK إيريديوم", sku: "NGK-IR-5", qty: 20, price: 90 }], total: 2700, status: "مكتمل", paymentMethod: "حساب صرافة", paymentStatus: "مؤكد", exchange: "العمقي", date: "2026-03-31", city: "عدن", address: "كريتر، شارع الملكة أروى", deliveryFee: 0, notes: "طلب حكومي - مطلوب فاتورة رسمية", timeline: [{ status: "جديد", date: "2026-03-31 08:00" }, { status: "قيد المعالجة", date: "2026-03-31 09:00" }, { status: "قيد الشحن", date: "2026-03-31 14:00" }, { status: "مكتمل", date: "2026-04-02 11:00", note: "تم التسليم والتوقيع" }] },
  { id: "ORD-1021", customer: "تجارة العولقي", customerType: "جملة", phone: "772233445", items: [{ name: "تيل فرامل سيراميك", sku: "BRK-CER-01", qty: 25, price: 85 }, { name: "فلتر هواء تويوتا", sku: "FLT-AIR-TC", qty: 50, price: 42 }], total: 4225, status: "قيد المعالجة", paymentMethod: "تحويل صرافة", paymentStatus: "بانتظار التأكيد", exchange: "البسيري", date: "2026-03-31", city: "صنعاء", address: "شارع 26 سبتمبر", deliveryFee: 0, notes: "عميل جملة - خصم 15%", timeline: [{ status: "جديد", date: "2026-03-31 14:00" }, { status: "قيد المعالجة", date: "2026-04-01 08:00", note: "جاري تجهيز الطلب" }] },
  { id: "ORD-1020", customer: "علي حسين", customerType: "عادي", phone: "775566778", items: [{ name: "شمعات LED هيونداي", sku: "LED-HY-01", qty: 1, price: 180 }], total: 180, status: "ملغي", paymentMethod: "كاش", paymentStatus: "مرفوض", date: "2026-03-30", city: "إب", address: "شارع العدين", deliveryFee: 45, timeline: [{ status: "جديد", date: "2026-03-30 16:00" }, { status: "ملغي", date: "2026-03-30 18:00", note: "ألغي بطلب من العميل" }] },
  { id: "ORD-1019", customer: "مركز الوفاء", customerType: "ورشة", phone: "779988776", items: [{ name: "سير مروحة تويوتا", sku: "BLT-FN-TC", qty: 3, price: 35 }, { name: "بواجي NGK إيريديوم", sku: "NGK-IR-5", qty: 6, price: 90 }], total: 645, status: "جديد", paymentMethod: "تحويل صرافة", paymentStatus: "بانتظار التأكيد", exchange: "الكريمي", date: "2026-03-30", city: "الحديدة", address: "شارع صنعاء", deliveryFee: 60, timeline: [{ status: "جديد", date: "2026-03-30 11:00" }] },
];

const statuses: OrderStatus[] = ["جديد", "قيد المعالجة", "قيد الشحن", "مكتمل", "ملغي"];
const statusConfig: Record<OrderStatus, { icon: any; color: string }> = {
  "جديد": { icon: Clock, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  "قيد المعالجة": { icon: ShoppingCart, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  "قيد الشحن": { icon: Truck, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  "مكتمل": { icon: CheckCircle, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  "ملغي": { icon: XCircle, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};
const paymentStatusColor: Record<PaymentStatus, string> = {
  "بانتظار التأكيد": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "مؤكد": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "مرفوض": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};
const timelineIcons: Record<string, any> = { "جديد": Clock, "قيد المعالجة": Package, "قيد الشحن": Truck, "مكتمل": CheckCircle, "ملغي": XCircle };

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [orderNote, setOrderNote] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.includes(debouncedSearch) || o.customer.includes(debouncedSearch);
    const matchStatus = statusFilter === "الكل" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pagination = usePagination(filtered, { pageSize: 8 });

  const statusCounts = statuses.reduce((acc, s) => ({ ...acc, [s]: orders.filter(o => o.status === s).length }), {} as Record<string, number>);

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    const now = new Date().toISOString().replace("T", " ").slice(0, 16);
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status,
      timeline: [...o.timeline, { status, date: now, note: orderNote || undefined }],
    } : o));
    setSelectedOrder(prev => prev && prev.id === orderId ? {
      ...prev,
      status,
      timeline: [...prev.timeline, { status, date: now, note: orderNote || undefined }],
    } : prev);
    toast.success(`تم تحديث حالة الطلب ${orderId} إلى "${status}"`);
    setOrderNote("");
  };

  const handlePaymentAction = (orderId: string, action: "مؤكد" | "مرفوض") => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: action } : o));
    setSelectedOrder(prev => prev && prev.id === orderId ? { ...prev, paymentStatus: action } : prev);
    toast.success(action === "مؤكد" ? `تم تأكيد دفع الطلب ${orderId}` : `تم رفض دفع الطلب ${orderId}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setOrderNote("");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">إدارة الطلبات</h1>
            <p className="text-sm text-muted-foreground mt-1">{orders.length} طلب</p>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs"><FileText className="h-4 w-4" /> تصدير الطلبات</Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card><CardContent className="p-3 text-center"><ShoppingCart className="h-5 w-5 text-primary mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{orders.length}</p><p className="text-[10px] text-muted-foreground">إجمالي الطلبات</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><Clock className="h-5 w-5 text-yellow-600 mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{(statusCounts["جديد"] || 0) + (statusCounts["قيد المعالجة"] || 0)}</p><p className="text-[10px] text-muted-foreground">بانتظار المعالجة</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><Truck className="h-5 w-5 text-purple-600 mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{statusCounts["قيد الشحن"] || 0}</p><p className="text-[10px] text-muted-foreground">قيد الشحن</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><CreditCard className="h-5 w-5 text-orange-600 mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{orders.filter(o => o.paymentStatus === "بانتظار التأكيد").length}</p><p className="text-[10px] text-muted-foreground">بانتظار تأكيد الدفع</p></CardContent></Card>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <Button variant={statusFilter === "الكل" ? "default" : "outline"} size="sm" className="text-xs shrink-0" onClick={() => setStatusFilter("الكل")}>الكل ({orders.length})</Button>
          {statuses.map((s) => (
            <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" className="text-xs shrink-0" onClick={() => setStatusFilter(s)}>{s} ({statusCounts[s] || 0})</Button>
          ))}
        </div>

        {/* Search */}
        <Card><CardContent className="p-3"><div className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="بحث برقم الطلب أو اسم العميل..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 h-9 text-sm" /></div></CardContent></Card>

        {/* Orders table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الطلب</TableHead>
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">الدفع</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right w-16">عرض</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.paginatedItems.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="p-0"><AdminEmptyState title="لا توجد طلبات مطابقة" description="جرب تغيير كلمات البحث أو الفلتر" /></TableCell></TableRow>
                  ) : pagination.paginatedItems.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell><span className="text-sm font-mono font-medium text-foreground">{order.id}</span><p className="text-[10px] text-muted-foreground">{order.date}</p></TableCell>
                      <TableCell><p className="text-sm font-medium text-foreground">{order.customer}</p><p className="text-[10px] text-muted-foreground">{order.customerType} • {order.city}</p></TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div>
                          <p className="text-xs text-foreground">{order.paymentMethod}</p>
                          {order.exchange && <p className="text-[10px] text-muted-foreground">{order.exchange}</p>}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${paymentStatusColor[order.paymentStatus]}`}>{order.paymentStatus}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-foreground">{order.total.toLocaleString()} ر.س</TableCell>
                      <TableCell><span className={`text-[10px] px-2 py-1 rounded-full font-medium ${statusConfig[order.status].color}`}>{order.status}</span></TableCell>
                      <TableCell><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openOrderDetail(order)}><Eye className="h-3.5 w-3.5" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
           </CardContent>
          <AdminTablePagination {...pagination} />
        </Card>

        {/* Order detail dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto print:max-w-full print:shadow-none" dir="rtl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>تفاصيل الطلب {selectedOrder?.id}</DialogTitle>
                <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={handlePrint}><Printer className="h-3.5 w-3.5" /> طباعة</Button>
              </div>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                {/* Customer & address */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground">العميل</p>
                    <p className="text-sm font-medium text-foreground">{selectedOrder.customer}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedOrder.customerType}</p>
                    <p className="text-[10px] text-muted-foreground font-mono" dir="ltr">{selectedOrder.phone}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="h-2.5 w-2.5" /> عنوان التوصيل</p>
                    <p className="text-sm font-medium text-foreground">{selectedOrder.city}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedOrder.address}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="bg-muted/50 px-3 py-2"><p className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> المنتجات ({selectedOrder.items.length})</p></div>
                  <div className="divide-y divide-border">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3">
                        <div><p className="text-sm font-medium text-foreground">{item.name}</p><p className="text-[10px] text-muted-foreground font-mono">{item.sku}</p></div>
                        <div className="text-left"><p className="text-sm font-semibold text-foreground">{(item.qty * item.price).toLocaleString()} ر.س</p><p className="text-[10px] text-muted-foreground">{item.qty} × {item.price} ر.س</p></div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted/30 px-3 py-2 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground"><span>المنتجات</span><span>{(selectedOrder.total - selectedOrder.deliveryFee).toLocaleString()} ر.س</span></div>
                    <div className="flex justify-between text-xs text-muted-foreground"><span>التوصيل</span><span>{selectedOrder.deliveryFee > 0 ? `${selectedOrder.deliveryFee} ر.س` : "مجاني"}</span></div>
                    <div className="flex justify-between text-sm font-bold text-foreground pt-1 border-t border-border"><span>الإجمالي</span><span>{selectedOrder.total.toLocaleString()} ر.س</span></div>
                  </div>
                </div>

                {/* Payment */}
                <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <p className="text-xs font-semibold text-foreground">معلومات الدفع</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{selectedOrder.paymentMethod}</span>
                    {selectedOrder.exchange && <Badge variant="outline" className="text-[10px]">{selectedOrder.exchange}</Badge>}
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${paymentStatusColor[selectedOrder.paymentStatus]}`}>{selectedOrder.paymentStatus}</span>
                </div>

                {/* Timeline */}
                <div>
                  <p className="text-xs font-semibold text-foreground mb-3">تتبع الطلب</p>
                  <div className="space-y-0 relative pr-4">
                    <div className="absolute right-[7px] top-2 bottom-2 w-0.5 bg-border" />
                    {selectedOrder.timeline.map((step, i) => {
                      const Icon = timelineIcons[step.status] || Clock;
                      const isLast = i === selectedOrder.timeline.length - 1;
                      return (
                        <div key={i} className="relative flex gap-3 pb-4">
                          <div className={`relative z-10 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${isLast ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                            <Icon className="h-3 w-3" />
                          </div>
                          <div className="pt-0.5">
                            <p className={`text-xs font-medium ${isLast ? "text-foreground" : "text-muted-foreground"}`}>{step.status}</p>
                            <p className="text-[10px] text-muted-foreground">{step.date}</p>
                            {step.note && <p className="text-[10px] text-muted-foreground mt-0.5">📝 {step.note}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
                    <p className="text-xs font-semibold text-primary">📝 ملاحظات</p>
                    <p className="text-sm text-foreground mt-1">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* Actions - only if not completed or cancelled */}
                {selectedOrder.status !== "مكتمل" && selectedOrder.status !== "ملغي" && (
                  <>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-foreground">تغيير الحالة</p>
                      <Select value={newStatus} onValueChange={(v) => setNewStatus(v as OrderStatus)}>
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-foreground">إضافة ملاحظة</p>
                      <Textarea placeholder="أضف ملاحظة على الطلب..." className="text-sm" rows={2} value={orderNote} onChange={(e) => setOrderNote(e.target.value)} />
                    </div>

                    {selectedOrder.paymentStatus === "بانتظار التأكيد" && (
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => handlePaymentAction(selectedOrder.id, "مؤكد")}>تأكيد الدفع</Button>
                        <Button size="sm" variant="destructive" className="flex-1" onClick={() => handlePaymentAction(selectedOrder.id, "مرفوض")}>رفض</Button>
                      </div>
                    )}

                    <Button className="w-full" onClick={() => {
                      if (newStatus && newStatus !== selectedOrder.status) {
                        handleStatusChange(selectedOrder.id, newStatus as OrderStatus);
                      } else {
                        toast.info("لم يتم تغيير الحالة");
                      }
                    }}>حفظ التغييرات</Button>
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

export default AdminOrders;
