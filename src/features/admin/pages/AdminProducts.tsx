import { useState, useEffect } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, Eye } from "lucide-react";
import { products as initialProducts, Product } from "@/data/products";
import { useCurrency } from "@/contexts/CurrencyContext";
import { toast } from "sonner";

const categoryOptions = ["الكل", "فرامل", "فلاتر", "إنارة", "محرك", "تعليق", "فحمات فرامل", "فلتر هواء", "فلتر زيت", "شمعات إشعال", "إضاءة", "ذراع تحكم", "قاعدة محرك", "ممتصات صدمات"];

interface ProductForm {
  name: string;
  sku: string;
  price: string;
  oldPrice: string;
  category: string;
  brand: string;
  oem: string;
  compat: string;
  inStock: boolean;
}

const emptyForm: ProductForm = {
  name: "", sku: "", price: "", oldPrice: "", category: "", brand: "", oem: "", compat: "", inStock: true,
};

const AdminProducts = () => {
  const { format } = useCurrency();
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("الكل");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductForm, string>>>({});

  const debouncedSearch = useDebounce(search, 300);

  const filtered = productsList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || p.sku.includes(debouncedSearch);
    const matchCat = category === "الكل" || p.category === category;
    return matchSearch && matchCat;
  });

  const pagination = usePagination(filtered, { pageSize: 8 });

  const lowStock = productsList.filter((p) => !p.inStock).length;

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductForm, string>> = {};
    if (!form.name.trim()) newErrors.name = "اسم المنتج مطلوب";
    if (!form.sku.trim()) newErrors.sku = "رقم القطعة مطلوب";
    if (!form.price || parseFloat(form.price) <= 0) newErrors.price = "السعر مطلوب وأكبر من صفر";
    if (!form.category) newErrors.category = "الفئة مطلوبة";
    if (!form.brand.trim()) newErrors.brand = "الماركة مطلوبة";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString() || "",
      category: product.category,
      brand: product.brand,
      oem: product.oem,
      compat: product.compat.join("\n"),
      inStock: product.inStock,
    });
    setErrors({});
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const productData: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: parseFloat(form.price),
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : undefined,
      discount: form.oldPrice ? Math.round(((parseFloat(form.oldPrice) - parseFloat(form.price)) / parseFloat(form.oldPrice)) * 100) : undefined,
      category: form.category,
      brand: form.brand.trim(),
      oem: form.oem.trim(),
      compat: form.compat.split("\n").filter(Boolean),
      inStock: form.inStock,
      rating: editingProduct?.rating || 0,
      reviews: editingProduct?.reviews || 0,
      image: editingProduct?.image || "/placeholder.svg",
    };

    if (editingProduct) {
      setProductsList(prev => prev.map(p => p.id === editingProduct.id ? productData : p));
      toast.success("تم تحديث المنتج بنجاح");
    } else {
      setProductsList(prev => [productData, ...prev]);
      toast.success("تم إضافة المنتج بنجاح");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setProductsList(prev => prev.filter(p => p.id !== deleteTarget.id));
    toast.success(`تم حذف "${deleteTarget.name}" بنجاح`);
    setDeleteTarget(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">إدارة المنتجات</h1>
            <p className="text-sm text-muted-foreground mt-1">{productsList.length} منتج • {lowStock} نفد مخزونه</p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={handleOpenAdd}>
            <Plus className="h-4 w-4" /> إضافة منتج
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="بحث بالاسم أو SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 h-9 text-sm" />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-36 h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats mini */}
        <div className="grid grid-cols-3 gap-3">
          <Card><CardContent className="p-3 text-center"><Package className="h-5 w-5 text-primary mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{productsList.length}</p><p className="text-[10px] text-muted-foreground">إجمالي المنتجات</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><Eye className="h-5 w-5 text-green-600 mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{productsList.filter(p => p.inStock).length}</p><p className="text-[10px] text-muted-foreground">متوفر</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><AlertTriangle className="h-5 w-5 text-destructive mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{lowStock}</p><p className="text-[10px] text-muted-foreground">نفد المخزون</p></CardContent></Card>
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
                  {pagination.paginatedItems.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="p-0"><AdminEmptyState title="لا توجد منتجات مطابقة" description="جرب تغيير كلمات البحث أو الفلتر" /></TableCell></TableRow>
                  ) : pagination.paginatedItems.map((product) => (
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
                          {product.oldPrice && <p className="text-[10px] text-muted-foreground line-through">{format(product.oldPrice)}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell"><Badge variant="outline" className="text-[10px]">{product.category}</Badge></TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${product.inStock ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                          {product.inStock ? "متوفر" : "نفد"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenEdit(product)}><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteTarget(product)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
           </CardContent>
          <AdminTablePagination {...pagination} />
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">اسم المنتج</Label>
                  <Input placeholder="بواجي NGK" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                  {errors.name && <p className="text-[10px] text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">رقم القطعة (SKU)</Label>
                  <Input placeholder="NGK-IR-5" value={form.sku} onChange={(e) => setForm(f => ({ ...f, sku: e.target.value }))} />
                  {errors.sku && <p className="text-[10px] text-destructive">{errors.sku}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">السعر (ر.س)</Label>
                  <Input type="number" placeholder="90" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} />
                  {errors.price && <p className="text-[10px] text-destructive">{errors.price}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">السعر القديم</Label>
                  <Input type="number" placeholder="120" value={form.oldPrice} onChange={(e) => setForm(f => ({ ...f, oldPrice: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">الفئة</Label>
                  <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
                    <SelectContent>
                      {categoryOptions.slice(1).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-[10px] text-destructive">{errors.category}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">الماركة</Label>
                  <Input placeholder="NGK" value={form.brand} onChange={(e) => setForm(f => ({ ...f, brand: e.target.value }))} />
                  {errors.brand && <p className="text-[10px] text-destructive">{errors.brand}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">رقم OEM</Label>
                <Input placeholder="94702" value={form.oem} onChange={(e) => setForm(f => ({ ...f, oem: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">السيارات المتوافقة</Label>
                <Textarea placeholder={"تويوتا كامري 2015-2023\nهيونداي سوناتا 2016-2022"} className="text-sm" rows={3} value={form.compat} onChange={(e) => setForm(f => ({ ...f, compat: e.target.value }))} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <Label className="text-sm">متوفر في المخزون</Label>
                <Switch checked={form.inStock} onCheckedChange={(v) => setForm(f => ({ ...f, inStock: v }))} />
              </div>
              <Button className="w-full" onClick={handleSave}>
                {editingProduct ? "حفظ التعديلات" : "إضافة المنتج"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من حذف "{deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
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

export default AdminProducts;
