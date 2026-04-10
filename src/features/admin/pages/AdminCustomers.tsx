import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Users, UserCheck, Building2, Warehouse, ShieldCheck, ShieldX } from "lucide-react";
import { customerTypes } from "@/data/yemenData";
import { toast } from "sonner";

interface Customer {
  id: string; name: string; phone: string; type: string; typeLabel: string;
  city: string; totalOrders: number; totalSpent: number;
  status: "نشط" | "معلق" | "محظور"; joinDate: string; document?: string;
}

const initialCustomers: Customer[] = [
  { id: "C001", name: "أحمد محمد علي", phone: "771234567", type: "retail", typeLabel: "عادي", city: "صنعاء", totalOrders: 12, totalSpent: 4500, status: "نشط", joinDate: "2026-01-15" },
  { id: "C002", name: "ورشة الأمين للصيانة", phone: "773456789", type: "workshop", typeLabel: "ورشة", city: "تعز", totalOrders: 45, totalSpent: 28000, status: "نشط", joinDate: "2025-11-20" },
  { id: "C003", name: "وزارة النقل", phone: "771112233", type: "government", typeLabel: "حكومي", city: "صنعاء", totalOrders: 8, totalSpent: 65000, status: "نشط", joinDate: "2026-02-01", document: "خطاب رسمي مختوم" },
  { id: "C004", name: "تجارة العولقي", phone: "772233445", type: "wholesale", typeLabel: "جملة", city: "عدن", totalOrders: 22, totalSpent: 120000, status: "نشط", joinDate: "2025-10-05", document: "سجل تجاري" },
  { id: "C005", name: "خالد سعيد", phone: "775566778", type: "retail", typeLabel: "عادي", city: "إب", totalOrders: 2, totalSpent: 350, status: "معلق", joinDate: "2026-03-20" },
  { id: "C006", name: "مركز الوفاء", phone: "779988776", type: "workshop", typeLabel: "ورشة", city: "الحديدة", totalOrders: 30, totalSpent: 18500, status: "نشط", joinDate: "2025-12-10" },
];

const typeIcons: Record<string, any> = { retail: Users, workshop: UserCheck, government: Building2, wholesale: Warehouse };
const statusColor: Record<string, string> = {
  "نشط": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "معلق": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "محظور": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("الكل");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [banTarget, setBanTarget] = useState<Customer | null>(null);

  const filtered = customers.filter((c) => {
    const matchSearch = c.name.includes(search) || c.phone.includes(search);
    const matchType = typeFilter === "الكل" || c.type === typeFilter;
    return matchSearch && matchType;
  });

  const typeCounts = {
    retail: customers.filter(c => c.type === "retail").length,
    workshop: customers.filter(c => c.type === "workshop").length,
    government: customers.filter(c => c.type === "government").length,
    wholesale: customers.filter(c => c.type === "wholesale").length,
  };

  const handleActivate = (customerId: string) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, status: "نشط" } : c));
    setSelected(prev => prev && prev.id === customerId ? { ...prev, status: "نشط" } : prev);
    toast.success("تم تفعيل الحساب بنجاح");
  };

  const handleBan = () => {
    if (!banTarget) return;
    setCustomers(prev => prev.map(c => c.id === banTarget.id ? { ...c, status: "محظور" } : c));
    setSelected(prev => prev && prev.id === banTarget.id ? { ...prev, status: "محظور" } : prev);
    toast.success(`تم حظر "${banTarget.name}"`);
    setBanTarget(null);
  };

  const handleSuspend = (customerId: string) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, status: "معلق" } : c));
    setSelected(prev => prev && prev.id === customerId ? { ...prev, status: "معلق" } : prev);
    toast.success("تم تعليق الحساب");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">إدارة العملاء</h1>
          <p className="text-sm text-muted-foreground mt-1">{customers.length} عميل مسجل</p>
        </div>

        {/* Type stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {customerTypes.map((ct) => (
            <Card key={ct.type} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTypeFilter(ct.type)}>
              <CardContent className="p-3 text-center">
                <span className="text-2xl">{ct.icon}</span>
                <p className="text-lg font-bold text-foreground mt-1">{typeCounts[ct.type as keyof typeof typeCounts]}</p>
                <p className="text-[10px] text-muted-foreground">{ct.label}</p>
                <p className="text-[10px] text-primary font-medium">خصم {ct.discountPercent}%</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="بحث بالاسم أو رقم الهاتف..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 h-9 text-sm" />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-36 h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">الكل</SelectItem>
                  {customerTypes.map((ct) => <SelectItem key={ct.type} value={ct.type}>{ct.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">النوع</TableHead>
                    <TableHead className="text-right">الطلبات</TableHead>
                    <TableHead className="text-right hidden md:table-cell">الإنفاق</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right w-16">عرض</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">لا يوجد عملاء مطابقون</TableCell></TableRow>
                  ) : filtered.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell><p className="text-sm font-medium text-foreground">{customer.name}</p><p className="text-[10px] text-muted-foreground">{customer.phone} • {customer.city}</p></TableCell>
                      <TableCell className="hidden sm:table-cell"><Badge variant="outline" className="text-[10px]">{customer.typeLabel}</Badge></TableCell>
                      <TableCell className="text-sm text-foreground">{customer.totalOrders}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm font-semibold text-foreground">{customer.totalSpent.toLocaleString()} ر.س</TableCell>
                      <TableCell><span className={`text-[10px] px-2 py-1 rounded-full font-medium ${statusColor[customer.status]}`}>{customer.status}</span></TableCell>
                      <TableCell><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelected(customer)}><Eye className="h-3.5 w-3.5" /></Button></TableCell>
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
            <DialogHeader><DialogTitle>بيانات العميل</DialogTitle></DialogHeader>
            {selected && (
              <div className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <span className="text-3xl">{customerTypes.find(ct => ct.type === selected.type)?.icon}</span>
                  <p className="text-lg font-bold text-foreground mt-2">{selected.name}</p>
                  <p className="text-sm text-muted-foreground">{selected.typeLabel}</p>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium mt-2 inline-block ${statusColor[selected.status]}`}>{selected.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50"><p className="text-[10px] text-muted-foreground">الهاتف</p><p className="text-sm font-medium text-foreground" dir="ltr">{selected.phone}</p></div>
                  <div className="p-3 rounded-lg bg-muted/50"><p className="text-[10px] text-muted-foreground">المدينة</p><p className="text-sm font-medium text-foreground">{selected.city}</p></div>
                  <div className="p-3 rounded-lg bg-muted/50"><p className="text-[10px] text-muted-foreground">الطلبات</p><p className="text-sm font-bold text-foreground">{selected.totalOrders}</p></div>
                  <div className="p-3 rounded-lg bg-muted/50"><p className="text-[10px] text-muted-foreground">الإنفاق</p><p className="text-sm font-bold text-foreground">{selected.totalSpent.toLocaleString()} ر.س</p></div>
                </div>
                {selected.document && (
                  <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
                    <p className="text-xs font-semibold text-primary">📄 مستند التحقق</p>
                    <p className="text-sm text-foreground mt-1">{selected.document}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">إجراءات الحساب</p>
                  <div className="flex gap-2">
                    {selected.status !== "نشط" && (
                      <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs" onClick={() => handleActivate(selected.id)}>
                        <ShieldCheck className="h-3.5 w-3.5" /> تفعيل
                      </Button>
                    )}
                    {selected.status !== "معلق" && selected.status !== "محظور" && (
                      <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs" onClick={() => handleSuspend(selected.id)}>
                        تعليق
                      </Button>
                    )}
                    {selected.status !== "محظور" && (
                      <Button size="sm" variant="destructive" className="flex-1 gap-1 text-xs" onClick={() => setBanTarget(selected)}>
                        <ShieldX className="h-3.5 w-3.5" /> حظر
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Ban Confirmation */}
        <AlertDialog open={!!banTarget} onOpenChange={() => setBanTarget(null)}>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحظر</AlertDialogTitle>
              <AlertDialogDescription>هل أنت متأكد من حظر "{banTarget?.name}"؟ لن يتمكن من تسجيل الدخول أو إجراء طلبات.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row-reverse gap-2">
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={handleBan} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">حظر</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
