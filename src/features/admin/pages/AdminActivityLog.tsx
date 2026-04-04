import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search, Package, ShoppingCart, Users, Settings, RotateCcw,
  Tag, Truck, Bell, DollarSign, Shield, Clock
} from "lucide-react";

interface ActivityLog {
  id: string;
  action: string;
  category: string;
  user: string;
  details: string;
  timestamp: string;
  icon: any;
  color: string;
}

const activities: ActivityLog[] = [
  { id: "A001", action: "تعديل منتج", category: "المنتجات", user: "المدير", details: "تم تحديث سعر بواجي NGK إيريديوم من 120 إلى 90 ر.س", timestamp: "2026-04-04 14:30", icon: Package, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
  { id: "A002", action: "تأكيد طلب", category: "الطلبات", user: "المدير", details: "تم تأكيد الطلب ORD-1024 وتحويله لقيد الشحن", timestamp: "2026-04-04 13:45", icon: ShoppingCart, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
  { id: "A003", action: "تأكيد دفع", category: "المدفوعات", user: "المحاسب", details: "تم تأكيد إيصال التحويل عبر الكريمي للطلب ORD-1023", timestamp: "2026-04-04 12:00", icon: DollarSign, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" },
  { id: "A004", action: "تفعيل عميل", category: "العملاء", user: "المدير", details: "تم تفعيل حساب ورشة الأمين بعد التحقق من المستندات", timestamp: "2026-04-04 11:30", icon: Users, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
  { id: "A005", action: "إنشاء كوبون", category: "الكوبونات", user: "المدير", details: "تم إنشاء كوبون BRAKE20 بخصم 20% على الفرامل", timestamp: "2026-04-04 10:00", icon: Tag, color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30" },
  { id: "A006", action: "تحديث التوصيل", category: "التوصيل", user: "المدير", details: "تم تعديل رسوم التوصيل لمنطقة تعز من 50 إلى 40 ر.س", timestamp: "2026-04-03 16:00", icon: Truck, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30" },
  { id: "A007", action: "قبول مرتجع", category: "المرتجعات", user: "المدير", details: "تم قبول طلب إرجاع RET-099 وبدء إجراءات الاسترداد", timestamp: "2026-04-03 14:30", icon: RotateCcw, color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" },
  { id: "A008", action: "إرسال إشعار", category: "الإشعارات", user: "المدير", details: "تم إرسال إشعار 'عرض خاص على الفرامل' لجميع العملاء", timestamp: "2026-04-03 10:30", icon: Bell, color: "text-pink-600 bg-pink-100 dark:bg-pink-900/30" },
  { id: "A009", action: "تحديث الإعدادات", category: "الإعدادات", user: "المدير", details: "تم تحديث معلومات المتجر ورقم الهاتف", timestamp: "2026-04-02 16:00", icon: Settings, color: "text-gray-600 bg-gray-100 dark:bg-gray-900/30" },
  { id: "A010", action: "تحديث سعر الصرف", category: "العملات", user: "المدير", details: "تم تحديث سعر الريال اليمني إلى 150 مقابل 1 ر.س", timestamp: "2026-04-02 09:00", icon: DollarSign, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" },
  { id: "A011", action: "إضافة منتج", category: "المنتجات", user: "المدير", details: "تم إضافة منتج جديد: فلتر وقود نيسان", timestamp: "2026-04-01 15:00", icon: Package, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
  { id: "A012", action: "حظر عميل", category: "العملاء", user: "المدير", details: "تم حظر حساب العميل خالد سعيد بسبب مخالفة الشروط", timestamp: "2026-04-01 11:00", icon: Shield, color: "text-red-600 bg-red-100 dark:bg-red-900/30" },
];

const categoryFilters = ["الكل", "المنتجات", "الطلبات", "المدفوعات", "العملاء", "الكوبونات", "التوصيل", "المرتجعات", "الإشعارات", "الإعدادات", "العملات"];

const AdminActivityLog = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("الكل");

  const filtered = activities.filter((a) => {
    const matchSearch = a.action.includes(search) || a.details.includes(search);
    const matchCategory = categoryFilter === "الكل" || a.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Group by date
  const grouped = filtered.reduce((acc, item) => {
    const date = item.timestamp.split(" ")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, ActivityLog[]>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">سجل النشاطات</h1>
          <p className="text-sm text-muted-foreground mt-1">تتبع جميع العمليات والتغييرات في النظام</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث في النشاطات..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-9 h-9 text-sm"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryFilters.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activity timeline */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground">{date}</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="space-y-2 relative pr-4">
                <div className="absolute right-[7px] top-0 bottom-0 w-0.5 bg-border" />
                {items.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="relative flex gap-3">
                      <div className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${activity.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <Card className="flex-1">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-foreground">{activity.action}</span>
                                <Badge variant="outline" className="text-[10px]">{activity.category}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                            </div>
                            <div className="text-left shrink-0">
                              <p className="text-[10px] text-muted-foreground">{activity.timestamp.split(" ")[1]}</p>
                              <p className="text-[10px] text-muted-foreground">{activity.user}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="text-center">
          <Button variant="outline" size="sm" className="text-xs">تحميل المزيد</Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminActivityLog;
