import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart, Package, Users, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownRight, Clock, Truck
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const kpis = [
  { label: "إجمالي المبيعات", value: "45,230 ر.س", change: "+12.5%", up: true, icon: DollarSign, color: "text-primary" },
  { label: "الطلبات الجديدة", value: "128", change: "+8.3%", up: true, icon: ShoppingCart, color: "text-primary" },
  { label: "العملاء", value: "1,847", change: "+5.2%", up: true, icon: Users, color: "text-accent-foreground" },
  { label: "المنتجات النشطة", value: "342", change: "-2.1%", up: false, icon: Package, color: "text-warning" },
];

const salesData = [
  { day: "السبت", sales: 4200 }, { day: "الأحد", sales: 3800 },
  { day: "الإثنين", sales: 5100 }, { day: "الثلاثاء", sales: 4600 },
  { day: "الأربعاء", sales: 5800 }, { day: "الخميس", sales: 7200 },
  { day: "الجمعة", sales: 6100 },
];

const categoryData = [
  { name: "فرامل", value: 35, color: "hsl(var(--primary))" },
  { name: "فلاتر", value: 25, color: "hsl(var(--accent))" },
  { name: "إنارة", value: 20, color: "hsl(var(--warning))" },
  { name: "محركات", value: 15, color: "hsl(var(--destructive))" },
  { name: "أخرى", value: 5, color: "hsl(var(--muted-foreground))" },
];

const monthlyData = [
  { month: "يناير", revenue: 32000 }, { month: "فبراير", revenue: 35000 },
  { month: "مارس", revenue: 41000 }, { month: "أبريل", revenue: 38000 },
  { month: "مايو", revenue: 45000 }, { month: "يونيو", revenue: 52000 },
];

const recentOrders = [
  { id: "ORD-1024", customer: "أحمد محمد", amount: "350 ر.س", status: "جديد", type: "retail" },
  { id: "ORD-1023", customer: "ورشة الأمين", amount: "2,150 ر.س", status: "قيد الشحن", type: "workshop" },
  { id: "ORD-1022", customer: "وزارة النقل", amount: "8,500 ر.س", status: "مكتمل", type: "government" },
  { id: "ORD-1021", customer: "تجارة العولقي", amount: "12,300 ر.س", status: "قيد المعالجة", type: "wholesale" },
  { id: "ORD-1020", customer: "علي حسين", amount: "180 ر.س", status: "ملغي", type: "retail" },
];

const statusColors: Record<string, string> = {
  "جديد": "bg-accent text-accent-foreground",
  "قيد المعالجة": "bg-warning/10 text-warning",
  "قيد الشحن": "bg-primary/10 text-primary",
  "مكتمل": "bg-primary/10 text-primary",
  "ملغي": "bg-destructive/10 text-destructive",
};

const topProducts = [
  { name: "بواجي NGK إيريديوم", sold: 89, revenue: "8,010 ر.س" },
  { name: "فلتر هواء تويوتا", sold: 67, revenue: "3,350 ر.س" },
  { name: "تيل فرامل سيراميك", sold: 54, revenue: "5,400 ر.س" },
  { name: "مساعدات KYB", sold: 42, revenue: "10,500 ر.س" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground mt-1">نظرة عامة على أداء المتجر</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center ${kpi.color}`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? "text-primary" : "text-destructive"}`}>
                    {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {kpi.change}
                  </span>
                </div>
                <p className="text-lg md:text-xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">المبيعات الأسبوعية</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => `${v.toLocaleString()} ر.س`} />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">المبيعات حسب الفئة</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {categoryData.map((c) => (
                  <span key={c.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                    {c.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Revenue + Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">الإيرادات الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => `${v.toLocaleString()} ر.س`} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">الأكثر مبيعاً</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sold} وحدة</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{p.revenue}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">آخر الطلبات</CardTitle>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => navigate("/admin/orders")}>عرض الكل</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate("/admin/orders")}>
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{order.id}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{order.customer}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{order.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
