import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Package, AlertTriangle, TrendingDown, TrendingUp, Search, ArrowUpDown, Eye, PackagePlus, PackageMinus, History, Bell } from "lucide-react";
import { toast } from "sonner";

type StockStatus = "متوفر" | "مخزون منخفض" | "نفد المخزون";

interface InventoryItem {
  id: string; name: string; sku: string; category: string;
  currentStock: number; minStock: number; maxStock: number;
  status: StockStatus; lastRestocked: string; avgMonthlySales: number;
  daysUntilOut: number | null; warehouse: string;
}

interface StockMovement { date: string; type: "إضافة" | "خصم" | "تعديل"; quantity: number; note: string; }

const getStatus = (current: number, min: number): StockStatus => {
  if (current === 0) return "نفد المخزون";
  if (current <= min) return "مخزون منخفض";
  return "متوفر";
};

const initialItems: InventoryItem[] = [
  { id: "1", name: "بواجي NGK إيريديوم", sku: "NGK-IR-5", category: "محرك", currentStock: 156, minStock: 20, maxStock: 300, status: "متوفر", lastRestocked: "2026-03-28", avgMonthlySales: 89, daysUntilOut: 52, warehouse: "المستودع الرئيسي" },
  { id: "2", name: "تيل فرامل سيراميك", sku: "BRK-CER-01", category: "فرامل", currentStock: 8, minStock: 15, maxStock: 100, status: "مخزون منخفض", lastRestocked: "2026-03-15", avgMonthlySales: 54, daysUntilOut: 4, warehouse: "المستودع الرئيسي" },
  { id: "3", name: "فلتر هواء تويوتا كامري", sku: "FLT-AIR-TC", category: "فلاتر", currentStock: 0, minStock: 10, maxStock: 80, status: "نفد المخزون", lastRestocked: "2026-03-01", avgMonthlySales: 67, daysUntilOut: null, warehouse: "المستودع الرئيسي" },
  { id: "4", name: "مساعدات KYB أمامية", sku: "KYB-F-001", category: "تعليق", currentStock: 34, minStock: 10, maxStock: 60, status: "متوفر", lastRestocked: "2026-03-20", avgMonthlySales: 42, daysUntilOut: 24, warehouse: "مستودع عدن" },
  { id: "5", name: "فلتر زيت بوش", sku: "BSH-OIL-03", category: "فلاتر", currentStock: 12, minStock: 15, maxStock: 120, status: "مخزون منخفض", lastRestocked: "2026-03-22", avgMonthlySales: 87, daysUntilOut: 4, warehouse: "المستودع الرئيسي" },
  { id: "6", name: "شمعات LED هيونداي", sku: "LED-HY-01", category: "إنارة", currentStock: 45, minStock: 10, maxStock: 80, status: "متوفر", lastRestocked: "2026-03-25", avgMonthlySales: 32, daysUntilOut: 42, warehouse: "المستودع الرئيسي" },
  { id: "7", name: "سير مروحة تويوتا", sku: "BLT-FN-TC", category: "محرك", currentStock: 0, minStock: 8, maxStock: 50, status: "نفد المخزون", lastRestocked: "2026-02-28", avgMonthlySales: 15, daysUntilOut: null, warehouse: "مستودع عدن" },
  { id: "8", name: "هوبات فرامل خلفية", sku: "BRK-DSC-R", category: "فرامل", currentStock: 22, minStock: 10, maxStock: 60, status: "متوفر", lastRestocked: "2026-03-18", avgMonthlySales: 18, daysUntilOut: 36, warehouse: "المستودع الرئيسي" },
];

const statusConfig: Record<StockStatus, { color: string; bgColor: string }> = {
  "متوفر": { color: "text-green-700 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/30" },
  "مخزون منخفض": { color: "text-yellow-700 dark:text-yellow-400", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
  "نفد المخزون": { color: "text-red-700 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-900/30" },
};

const AdminInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustDialog, setAdjustDialog] = useState<InventoryItem | null>(null);
  const [adjustType, setAdjustType] = useState<"إضافة" | "خصم">("إضافة");
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustNote, setAdjustNote] = useState("");
  const [movements, setMovements] = useState<Record<string, StockMovement[]>>({
    "1": [
      { date: "2026-04-01 14:30", type: "خصم", quantity: 5, note: "طلب ORD-1024" },
      { date: "2026-03-28 09:00", type: "إضافة", quantity: 100, note: "استلام شحنة جديدة" },
    ],
  });

  const filtered = items.filter((item) => {
    const matchSearch = item.name.includes(search) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "الكل" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const outOfStock = items.filter(i => i.status === "نفد المخزون").length;
  const lowStock = items.filter(i => i.status === "مخزون منخفض").length;
  const totalValue = items.reduce((a, i) => a + i.currentStock, 0);

  const handleAdjust = () => {
    if (!adjustDialog || !adjustQty || parseInt(adjustQty) <= 0) {
      toast.error("أدخل كمية صحيحة");
      return;
    }

    const qty = parseInt(adjustQty);
    const now = new Date().toISOString().replace("T", " ").slice(0, 16);

    setItems(prev => prev.map(item => {
      if (item.id !== adjustDialog.id) return item;
      const newStock = adjustType === "إضافة" ? item.currentStock + qty : Math.max(0, item.currentStock - qty);
      const newStatus = getStatus(newStock, item.minStock);
      const newDays = newStock > 0 && item.avgMonthlySales > 0 ? Math.round((newStock / item.avgMonthlySales) * 30) : null;
      return { ...item, currentStock: newStock, status: newStatus, daysUntilOut: newDays, lastRestocked: adjustType === "إضافة" ? now.split(" ")[0] : item.lastRestocked };
    }));

    const newMovement: StockMovement = { date: now, type: adjustType, quantity: qty, note: adjustNote || (adjustType === "إضافة" ? "إضافة مخزون يدوي" : "خصم مخزون يدوي") };
    setMovements(prev => ({ ...prev, [adjustDialog.id]: [newMovement, ...(prev[adjustDialog.id] || [])] }));

    toast.success(`تم ${adjustType === "إضافة" ? "إضافة" : "خصم"} ${qty} وحدة من "${adjustDialog.name}"`);
    setAdjustDialog(null);
    setAdjustQty("");
    setAdjustNote("");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">إدارة المخزون</h1>
          <p className="text-sm text-muted-foreground mt-1">تتبع الكميات وتنبيهات النفاد</p>
        </div>

        {(outOfStock > 0 || lowStock > 0) && (
          <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">تنبيه المخزون</p>
              <p className="text-xs text-muted-foreground">
                {outOfStock > 0 && `${outOfStock} منتج نفد مخزونه`}
                {outOfStock > 0 && lowStock > 0 && " • "}
                {lowStock > 0 && `${lowStock} منتج مخزونه منخفض`}
              </p>
            </div>
            <Button size="sm" variant="outline" className="text-xs shrink-0 gap-1"><Bell className="h-3 w-3" /> طلب توريد</Button>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card><CardContent className="p-4"><Package className="h-5 w-5 text-primary mb-2" /><p className="text-lg font-bold text-foreground">{totalValue.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">إجمالي القطع</p></CardContent></Card>
          <Card><CardContent className="p-4"><TrendingUp className="h-5 w-5 text-green-600 mb-2" /><p className="text-lg font-bold text-foreground">{items.filter(i => i.status === "متوفر").length}</p><p className="text-[10px] text-muted-foreground">متوفرة</p></CardContent></Card>
          <Card className={lowStock > 0 ? "border-yellow-300 dark:border-yellow-700" : ""}><CardContent className="p-4"><TrendingDown className="h-5 w-5 text-yellow-600 mb-2" /><p className="text-lg font-bold text-foreground">{lowStock}</p><p className="text-[10px] text-muted-foreground">منخفض</p></CardContent></Card>
          <Card className={outOfStock > 0 ? "border-destructive/50" : ""}><CardContent className="p-4"><AlertTriangle className="h-5 w-5 text-destructive mb-2" /><p className="text-lg font-bold text-foreground">{outOfStock}</p><p className="text-[10px] text-muted-foreground">نفد</p></CardContent></Card>
        </div>

        <Card><CardContent className="p-3"><div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1"><Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="بحث بالاسم أو SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 h-9 text-sm" /></div>
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full sm:w-40 h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="الكل">جميع الحالات</SelectItem><SelectItem value="متوفر">متوفر</SelectItem><SelectItem value="مخزون منخفض">مخزون منخفض</SelectItem><SelectItem value="نفد المخزون">نفد المخزون</SelectItem></SelectContent></Select>
        </div></CardContent></Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-right">المنتج</TableHead>
                  <TableHead className="text-right">المخزون</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">نفاد متوقع</TableHead>
                  <TableHead className="text-right hidden md:table-cell">المستودع</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right w-24">إجراء</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">لا توجد منتجات مطابقة</TableCell></TableRow>
                  ) : filtered.map((item) => {
                    const stockPercent = Math.min((item.currentStock / item.maxStock) * 100, 100);
                    return (
                      <TableRow key={item.id}>
                        <TableCell><p className="text-sm font-medium text-foreground truncate max-w-[160px]">{item.name}</p><p className="text-[10px] text-muted-foreground font-mono">{item.sku} • {item.category}</p></TableCell>
                        <TableCell><div className="space-y-1"><p className="text-sm font-bold text-foreground">{item.currentStock} <span className="text-[10px] text-muted-foreground font-normal">/ {item.maxStock}</span></p><Progress value={stockPercent} className="h-1.5 w-20" /></div></TableCell>
                        <TableCell className="hidden sm:table-cell">{item.daysUntilOut !== null ? <span className={`text-sm font-medium ${item.daysUntilOut <= 7 ? "text-destructive" : item.daysUntilOut <= 14 ? "text-yellow-600" : "text-foreground"}`}>{item.daysUntilOut} يوم</span> : <span className="text-xs text-destructive font-medium">نفد</span>}</TableCell>
                        <TableCell className="hidden md:table-cell"><span className="text-xs text-muted-foreground">{item.warehouse}</span></TableCell>
                        <TableCell><span className={`text-[10px] px-2 py-1 rounded-full font-medium ${statusConfig[item.status].bgColor} ${statusConfig[item.status].color}`}>{item.status}</span></TableCell>
                        <TableCell><div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedItem(item)}><Eye className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setAdjustDialog(item); setAdjustType("إضافة"); setAdjustQty(""); setAdjustNote(""); }}><ArrowUpDown className="h-3.5 w-3.5" /></Button>
                        </div></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Detail dialog */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader><DialogTitle>تفاصيل المخزون</DialogTitle></DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-muted/50"><Package className="h-8 w-8 text-primary mx-auto mb-2" /><p className="text-sm font-bold text-foreground">{selectedItem.name}</p><p className="text-xs text-muted-foreground font-mono">{selectedItem.sku}</p></div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg bg-muted/50 text-center"><p className="text-[10px] text-muted-foreground">الحالي</p><p className="text-sm font-bold text-foreground">{selectedItem.currentStock}</p></div>
                  <div className="p-2.5 rounded-lg bg-muted/50 text-center"><p className="text-[10px] text-muted-foreground">الأدنى</p><p className="text-sm font-bold text-foreground">{selectedItem.minStock}</p></div>
                  <div className="p-2.5 rounded-lg bg-muted/50 text-center"><p className="text-[10px] text-muted-foreground">الأقصى</p><p className="text-sm font-bold text-foreground">{selectedItem.maxStock}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-muted/50"><p className="text-[10px] text-muted-foreground">متوسط المبيعات/شهر</p><p className="text-sm font-bold text-foreground">{selectedItem.avgMonthlySales} وحدة</p></div>
                  <div className="p-2.5 rounded-lg bg-muted/50"><p className="text-[10px] text-muted-foreground">آخر توريد</p><p className="text-sm font-medium text-foreground">{selectedItem.lastRestocked}</p></div>
                </div>
                {(movements[selectedItem.id] || []).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5"><History className="h-3.5 w-3.5" /> سجل الحركة</p>
                    <div className="space-y-2">
                      {(movements[selectedItem.id] || []).map((m, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 text-xs">
                          <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${m.type === "إضافة" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : m.type === "خصم" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                            {m.type === "إضافة" ? "+" : m.type === "خصم" ? "-" : "~"}
                          </span>
                          <div className="flex-1 min-w-0"><p className="text-foreground">{m.note}</p><p className="text-[10px] text-muted-foreground">{m.date}</p></div>
                          <span className={`font-bold ${m.type === "إضافة" ? "text-green-600" : m.type === "خصم" ? "text-destructive" : "text-blue-600"}`}>{m.type === "إضافة" ? "+" : ""}{m.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Adjust stock dialog */}
        <Dialog open={!!adjustDialog} onOpenChange={() => setAdjustDialog(null)}>
          <DialogContent className="max-w-sm" dir="rtl">
            <DialogHeader><DialogTitle>تعديل الكمية</DialogTitle></DialogHeader>
            {adjustDialog && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-sm font-bold text-foreground">{adjustDialog.name}</p><p className="text-xs text-muted-foreground">المخزون الحالي: {adjustDialog.currentStock}</p></div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={adjustType === "إضافة" ? "default" : "outline"} className="gap-1.5 h-12 flex-col" onClick={() => setAdjustType("إضافة")}><PackagePlus className="h-5 w-5 text-green-600" /><span className="text-[10px]">إضافة مخزون</span></Button>
                  <Button variant={adjustType === "خصم" ? "default" : "outline"} className="gap-1.5 h-12 flex-col" onClick={() => setAdjustType("خصم")}><PackageMinus className="h-5 w-5 text-destructive" /><span className="text-[10px]">خصم مخزون</span></Button>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">الكمية</Label><Input type="number" placeholder="0" min="1" value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs">ملاحظة</Label><Input placeholder="سبب التعديل..." value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} /></div>
                <Button className="w-full" onClick={handleAdjust}>تأكيد التعديل</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;
