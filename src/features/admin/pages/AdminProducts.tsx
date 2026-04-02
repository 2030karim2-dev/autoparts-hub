import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, Eye } from "lucide-react";
import { products } from "@/data/products";
import { useCurrency } from "@/contexts/CurrencyContext";

const categories = ["الكل", "فرامل", "فلاتر", "إنارة", "محرك", "تعليق"];

const AdminProducts = () => {
  const { format } = useCurrency();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("الكل");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.includes(search);
    const matchCat = category === "الكل" || p.category === category;
    return matchSearch && matchCat;
  });

  const lowStock = products.filter((p) => !p.inStock).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">إدارة المنتجات</h1>
            <p className="text-sm text-muted-foreground mt-1">{products.length} منتج • {lowStock} نفد مخزونه</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" /> إضافة منتج
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle>إضافة منتج جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">اسم المنتج</Label>
                    <Input placeholder="بواجي NGK" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">رقم القطعة (SKU)</Label>
                    <Input placeholder="NGK-IR-5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">السعر (ر.س)</Label>
                    <Input type="number" placeholder="90" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">السعر القديم</Label>
                    <Input type="number" placeholder="120" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">الفئة</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">الماركة</Label>
                    <Input placeholder="NGK" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">رقم OEM</Label>
                  <Input placeholder="94702" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">السيارات المتوافقة</Label>
                  <Textarea placeholder="تويوتا كامري 2015-2023&#10;هيونداي سوناتا 2016-2022" className="text-sm" rows={3} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <Label className="text-sm">متوفر في المخزون</Label>
                  <Switch defaultChecked />
                </div>
                <Button className="w-full" onClick={() => setDialogOpen(false)}>حفظ المنتج</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث بالاسم أو SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-9 h-9 text-sm"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-36 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats mini */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <Package className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{products.length}</p>
              <p className="text-[10px] text-muted-foreground">إجمالي المنتجات</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Eye className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{products.filter(p => p.inStock).length}</p>
              <p className="text-[10px] text-muted-foreground">متوفر</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <AlertTriangle className="h-5 w-5 text-destructive mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{lowStock}</p>
              <p className="text-[10px] text-muted-foreground">نفد المخزون</p>
            </CardContent>
          </Card>
        </div>

        {/* Products table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المنتج</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">SKU</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                    <TableHead className="text-right hidden md:table-cell">الفئة</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right w-20">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img src={product.image} alt="" className="h-9 w-9 rounded-md object-cover bg-muted" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate max-w-[150px]">{product.name}</p>
                            <p className="text-[10px] text-muted-foreground">{product.brand}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground font-mono">{product.sku}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{format(product.price)}</p>
                          {product.oldPrice && (
                            <p className="text-[10px] text-muted-foreground line-through">{format(product.oldPrice)}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-[10px]">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${product.inStock ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                          {product.inStock ? "متوفر" : "نفد"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
