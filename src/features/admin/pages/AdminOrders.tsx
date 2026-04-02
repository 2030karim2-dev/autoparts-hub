import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, ShoppingCart, Clock, Truck, CheckCircle, XCircle, CreditCard } from "lucide-react";

type OrderStatus = "جديد" | "قيد المعالجة" | "قيد الشحن" | "مكتمل" | "ملغي";
type PaymentMethod = "كاش" | "تحويل صرافة" | "حساب صرافة";
type PaymentStatus = "بانتظار التأكيد" | "مؤكد" | "مرفوض";

interface Order {
  id: string;
  customer: string;
  customerType: string;
  items: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  exchange?: string;
  date: string;
  city: string;
}

const orders: Order[] = [
  { id: "ORD-1024", customer: "أحمد محمد", customerType: "عادي", items: 3, total: 350, status: "جديد", paymentMethod: "كاش", paymentStatus: "مؤكد", date: "2026-04-01", city: "صنعاء" },
  { id: "ORD-1023", customer: "ورشة الأمين", customerType: "ورشة", items: 8, total: 2150, status: "قيد الشحن", paymentMethod: "تحويل صرافة", paymentStatus: "بانتظار التأكيد", exchange: "الكريمي", date: "2026-04-01", city: "تعز" },
  { id: "ORD-1022", customer: "وزارة النقل", customerType: "حكومي", items: 15, total: 8500, status: "مكتمل", paymentMethod: "حساب صرافة", paymentStatus: "مؤكد", exchange: "العمقي", date: "2026-03-31", city: "عدن" },
  { id: "ORD-1021", customer: "تجارة العولقي", customerType: "جملة", items: 25, total: 12300, status: "قيد المعالجة", paymentMethod: "تحويل صرافة", paymentStatus: "بانتظار التأكيد", exchange: "البسيري", date: "2026-03-31", city: "صنعاء" },
  { id: "ORD-1020", customer: "علي حسين", customerType: "عادي", items: 1, total: 180, status: "ملغي", paymentMethod: "كاش", paymentStatus: "مرفوض", date: "2026-03-30", city: "إب" },
  { id: "ORD-1019", customer: "مركز الوفاء", customerType: "ورشة", items: 5, total: 1800, status: "جديد", paymentMethod: "تحويل صرافة", paymentStatus: "بانتظار التأكيد", exchange: "الكريمي", date: "2026-03-30", city: "الحديدة" },
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

const AdminOrders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.includes(search) || o.customer.includes(search);
    const matchStatus = statusFilter === "الكل" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = statuses.reduce((acc, s) => ({ ...acc, [s]: orders.filter(o => o.status === s).length }), {} as Record<string, number>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">إدارة الطلبات</h1>
          <p className="text-sm text-muted-foreground mt-1">{orders.length} طلب</p>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <Button
            variant={statusFilter === "الكل" ? "default" : "outline"}
            size="sm"
            className="text-xs shrink-0"
            onClick={() => setStatusFilter("الكل")}
          >
            الكل ({orders.length})
          </Button>
          {statuses.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              className="text-xs shrink-0"
              onClick={() => setStatusFilter(s)}
            >
              {s} ({statusCounts[s]})
            </Button>
          ))}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث برقم الطلب أو اسم العميل..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-9 h-9 text-sm"
              />
            </div>
          </CardContent>
        </Card>

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
                  {filtered.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <span className="text-sm font-mono font-medium text-foreground">{order.id}</span>
                        <p className="text-[10px] text-muted-foreground">{order.date}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-foreground">{order.customer}</p>
                        <p className="text-[10px] text-muted-foreground">{order.customerType} • {order.city}</p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div>
                          <p className="text-xs text-foreground">{order.paymentMethod}</p>
                          {order.exchange && <p className="text-[10px] text-muted-foreground">{order.exchange}</p>}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${paymentStatusColor[order.paymentStatus]}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-foreground">{order.total.toLocaleString()} ر.س</TableCell>
                      <TableCell>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${statusConfig[order.status].color}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedOrder(order)}>
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

        {/* Order detail dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>تفاصيل الطلب {selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground">العميل</p>
                    <p className="text-sm font-medium text-foreground">{selectedOrder.customer}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedOrder.customerType}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground">المبلغ</p>
                    <p className="text-sm font-bold text-foreground">{selectedOrder.total.toLocaleString()} ر.س</p>
                    <p className="text-[10px] text-muted-foreground">{selectedOrder.items} منتجات</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <p className="text-xs font-semibold text-foreground">معلومات الدفع</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{selectedOrder.paymentMethod}</span>
                    {selectedOrder.exchange && <Badge variant="outline" className="text-[10px]">{selectedOrder.exchange}</Badge>}
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${paymentStatusColor[selectedOrder.paymentStatus]}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">تغيير الحالة</p>
                  <Select defaultValue={selectedOrder.status}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {selectedOrder.paymentStatus === "بانتظار التأكيد" && (
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white">تأكيد الدفع</Button>
                    <Button size="sm" variant="destructive" className="flex-1">رفض</Button>
                  </div>
                )}

                <Button className="w-full" onClick={() => setSelectedOrder(null)}>حفظ التغييرات</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
