import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, FolderOpen, Package, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface SubCategory {
  id: string;
  name: string;
  productCount: number;
}

interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  productCount: number;
  active: boolean;
  order: number;
  subcategories: SubCategory[];
}

const initialCategories: Category[] = [
  { id: "cat1", name: "فرامل", nameEn: "Brakes", icon: "🔴", productCount: 45, active: true, order: 1, subcategories: [{ id: "s1", name: "تيل فرامل", productCount: 20 }, { id: "s2", name: "هوبات", productCount: 15 }, { id: "s3", name: "أسطوانات فرامل", productCount: 10 }] },
  { id: "cat2", name: "فلاتر", nameEn: "Filters", icon: "🟡", productCount: 38, active: true, order: 2, subcategories: [{ id: "s4", name: "فلتر هواء", productCount: 15 }, { id: "s5", name: "فلتر زيت", productCount: 13 }, { id: "s6", name: "فلتر وقود", productCount: 10 }] },
  { id: "cat3", name: "إنارة", nameEn: "Lighting", icon: "💡", productCount: 32, active: true, order: 3, subcategories: [{ id: "s7", name: "شمعات أمامية", productCount: 18 }, { id: "s8", name: "أضواء خلفية", productCount: 14 }] },
  { id: "cat4", name: "محرك", nameEn: "Engine", icon: "⚙️", productCount: 55, active: true, order: 4, subcategories: [{ id: "s9", name: "بواجي", productCount: 20 }, { id: "s10", name: "سيور", productCount: 15 }, { id: "s11", name: "حساسات", productCount: 20 }] },
  { id: "cat5", name: "تعليق", nameEn: "Suspension", icon: "🔧", productCount: 28, active: true, order: 5, subcategories: [{ id: "s12", name: "مساعدات", productCount: 12 }, { id: "s13", name: "مقصات", productCount: 8 }, { id: "s14", name: "كبالن", productCount: 8 }] },
  { id: "cat6", name: "زيوت وسوائل", nameEn: "Oils & Fluids", icon: "🛢️", productCount: 22, active: false, order: 6, subcategories: [{ id: "s15", name: "زيت محرك", productCount: 12 }, { id: "s16", name: "ماء رديتر", productCount: 10 }] },
];

interface CatForm { name: string; nameEn: string; icon: string; active: boolean; }
const emptyForm: CatForm = { name: "", nameEn: "", icon: "", active: true };

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<CatForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CatForm, string>>>({});
  const [subDialogOpen, setSubDialogOpen] = useState<string | null>(null);
  const [subName, setSubName] = useState("");

  const totalProducts = categories.reduce((a, c) => a + c.productCount, 0);

  const handleOpenAdd = () => { setEditingCat(null); setForm(emptyForm); setErrors({}); setDialogOpen(true); };
  const handleOpenEdit = (cat: Category) => {
    setEditingCat(cat);
    setForm({ name: cat.name, nameEn: cat.nameEn, icon: cat.icon, active: cat.active });
    setErrors({});
    setDialogOpen(true);
  };

  const handleSave = () => {
    const newErrors: Partial<Record<keyof CatForm, string>> = {};
    if (!form.name.trim()) newErrors.name = "اسم الفئة مطلوب";
    if (!form.icon.trim()) newErrors.icon = "الأيقونة مطلوبة";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (editingCat) {
      setCategories(prev => prev.map(c => c.id === editingCat.id ? { ...c, name: form.name.trim(), nameEn: form.nameEn.trim(), icon: form.icon.trim(), active: form.active } : c));
      toast.success("تم تحديث الفئة بنجاح");
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`, name: form.name.trim(), nameEn: form.nameEn.trim(), icon: form.icon.trim(),
        productCount: 0, active: form.active, order: categories.length + 1, subcategories: [],
      };
      setCategories(prev => [...prev, newCat]);
      toast.success("تم إضافة الفئة بنجاح");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCategories(prev => prev.filter(c => c.id !== deleteTarget.id));
    toast.success(`تم حذف فئة "${deleteTarget.name}"`);
    setDeleteTarget(null);
  };

  const handleToggleActive = (catId: string) => {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, active: !c.active } : c));
    const cat = categories.find(c => c.id === catId);
    toast.success(cat?.active ? `تم تعطيل "${cat.name}"` : `تم تفعيل "${cat?.name}"`);
  };

  const handleAddSubcategory = (catId: string) => {
    if (!subName.trim()) { toast.error("اسم الفئة الفرعية مطلوب"); return; }
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, subcategories: [...c.subcategories, { id: `sub-${Date.now()}`, name: subName.trim(), productCount: 0 }] } : c));
    toast.success("تم إضافة الفئة الفرعية");
    setSubName("");
    setSubDialogOpen(null);
  };

  const handleDeleteSub = (catId: string, subId: string) => {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, subcategories: c.subcategories.filter(s => s.id !== subId) } : c));
    toast.success("تم حذف الفئة الفرعية");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">إدارة الفئات</h1>
            <p className="text-sm text-muted-foreground mt-1">{categories.length} فئة رئيسية • {totalProducts} منتج</p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={handleOpenAdd}>
            <Plus className="h-4 w-4" /> فئة جديدة
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card><CardContent className="p-3 text-center"><FolderOpen className="h-5 w-5 text-primary mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{categories.length}</p><p className="text-[10px] text-muted-foreground">فئة رئيسية</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><FolderOpen className="h-5 w-5 text-green-600 mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{categories.reduce((a, c) => a + c.subcategories.length, 0)}</p><p className="text-[10px] text-muted-foreground">فئة فرعية</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><Package className="h-5 w-5 text-yellow-600 mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{totalProducts}</p><p className="text-[10px] text-muted-foreground">إجمالي المنتجات</p></CardContent></Card>
        </div>

        {/* Categories list */}
        <div className="space-y-3">
          {categories.map((cat) => (
            <Card key={cat.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}>
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab" />
                  <span className="text-2xl">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">{cat.name}</h3>
                      <span className="text-xs text-muted-foreground">({cat.nameEn})</span>
                      {!cat.active && <Badge variant="outline" className="text-[10px]">معطل</Badge>}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{cat.productCount} منتج • {cat.subcategories.length} فئة فرعية</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); handleOpenEdit(cat); }}><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteTarget(cat); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>

                {expandedCat === cat.id && (
                  <div className="border-t border-border bg-muted/20 p-3 space-y-2">
                    {cat.subcategories.map((sub) => (
                      <div key={sub.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-background">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                        <span className="text-sm text-foreground flex-1">{sub.name}</span>
                        <Badge variant="outline" className="text-[10px]">{sub.productCount} منتج</Badge>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeleteSub(cat.id, sub.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1 mt-2" onClick={() => { setSubDialogOpen(cat.id); setSubName(""); }}>
                      <Plus className="h-3 w-3" /> إضافة فئة فرعية
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Category Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-sm" dir="rtl">
            <DialogHeader><DialogTitle>{editingCat ? "تعديل الفئة" : "إضافة فئة جديدة"}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs">اسم الفئة (عربي)</Label>
                <Input placeholder="فرامل" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                {errors.name && <p className="text-[10px] text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">اسم الفئة (إنجليزي)</Label>
                <Input placeholder="Brakes" dir="ltr" value={form.nameEn} onChange={(e) => setForm(f => ({ ...f, nameEn: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">الأيقونة (Emoji)</Label>
                <Input placeholder="🔴" className="text-center text-xl" value={form.icon} onChange={(e) => setForm(f => ({ ...f, icon: e.target.value }))} />
                {errors.icon && <p className="text-[10px] text-destructive">{errors.icon}</p>}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <Label className="text-sm">تفعيل الفئة</Label>
                <Switch checked={form.active} onCheckedChange={(v) => setForm(f => ({ ...f, active: v }))} />
              </div>
              <Button className="w-full" onClick={handleSave}>{editingCat ? "حفظ التعديلات" : "إضافة الفئة"}</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Subcategory Dialog */}
        <Dialog open={!!subDialogOpen} onOpenChange={() => setSubDialogOpen(null)}>
          <DialogContent className="max-w-sm" dir="rtl">
            <DialogHeader><DialogTitle>إضافة فئة فرعية</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs">اسم الفئة الفرعية</Label>
                <Input placeholder="تيل فرامل" value={subName} onChange={(e) => setSubName(e.target.value)} />
              </div>
              <Button className="w-full" onClick={() => subDialogOpen && handleAddSubcategory(subDialogOpen)}>إضافة</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>هل أنت متأكد من حذف فئة "{deleteTarget?.name}"؟ سيتم حذف {deleteTarget?.subcategories.length} فئة فرعية أيضاً.</AlertDialogDescription>
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

export default AdminCategories;
