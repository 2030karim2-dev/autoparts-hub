import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, MapPin, Users, Package } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

const weeklyData = [
  { label: "السبت", revenue: 4200, orders: 12 }, { label: "الأحد", revenue: 3800, orders: 10 },
  { label: "الإثنين", revenue: 5100, orders: 15 }, { label: "الثلاثاء", revenue: 4600, orders: 13 },
  { label: "الأربعاء", revenue: 5800, orders: 17 }, { label: "الخميس", revenue: 7200, orders: 20 },
  { label: "الجمعة", revenue: 6100, orders: 18 },
];

const monthlyData = [
  { label: "يناير", revenue: 32000, orders: 85 }, { label: "فبراير", revenue: 35000, orders: 92 },
  { label: "مارس", revenue: 41000, orders: 110 }, { label: "أبريل", revenue: 38000, orders: 98 },
  { label: "مايو", revenue: 45000, orders: 125 }, { label: "يونيو", revenue: 52000, orders: 140 },
];

const yearlyData = [
  { label: "2023", revenue: 280000, orders: 720 }, { label: "2024", revenue: 350000, orders: 920 },
  { label: "2025", revenue: 420000, orders: 1100 }, { label: "2026", revenue: 243000, orders: 650 },
];

const dataSets: Record<string, typeof monthlyData> = { weekly: weeklyData, monthly: monthlyData, yearly: yearlyData };

const regionSales = [
  { region: "صنعاء", value: 40, color: "hsl(var(--primary))" },
  { region: "عدن", value: 22, color: "hsl(var(--accent))" },
  { region: "تعز", value: 18, color: "hsl(var(--warning))" },
  { region: "إب", value: 10, color: "hsl(var(--destructive))" },
  { region: "أخرى", value: 10, color: "hsl(var(--muted-foreground))" },
];

const customerTypeRevenue = [
  { type: "تجزئة", revenue: 45000, color: "hsl(var(--primary))" },
  { type: "ورش", revenue: 85000, color: "hsl(var(--accent))" },
  { type: "حكومي", revenue: 65000, color: "hsl(var(--warning))" },
  { type: "جملة", revenue: 120000, color: "hsl(var(--destructive))" },
];

const topProducts = [
  { name: "بواجي NGK إيريديوم", sold: 189, revenue: 17010 },
  { name: "تيل فرامل سيراميك", sold: 154, revenue: 15400 },
  { name: "فلتر هواء تويوتا", sold: 132, revenue: 6600 },
  { name: "مساعدات KYB", sold: 98, revenue: 24500 },
  { name: "فلتر زيت بوش", sold: 87, revenue: 3480 },
];

const exportCSV = (data: Record<string, any>[], filename: string) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map(row => headers.map(h => `"${row[h]}"`).join(","))
  ].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

const AdminReports = () => {
  const [period, setPeriod] = useState("monthly");

  const currentData = dataSets[period] || monthlyData;
  const totalRevenue = currentData.reduce((a, d) => a + d.revenue, 0);
  const totalOrders = currentData.reduce((a, d) => a + d.orders, 0);

  const handleExportSales = () => exportCSV(currentData.map(d => ({ الفترة: d.label, الإيرادات: d.revenue, الطلبات: d.orders })), "تقرير_المبيعات");
  const handleExportProducts = () => exportCSV(topProducts, "المنتجات_الأكثر_مبيعاً");
  const handleExportRegions = () => exportCSV(regionSales, "المبيعات_حسب_المنطقة");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">التقارير والإحصائيات</h1>
            <p className="text-sm text-muted-foreground mt-1">تحليل شامل لأداء المتجر</p>
          </div>
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">أسبوعي</SelectItem>
                <SelectItem value="monthly">شهري</SelectItem>
                <SelectItem value="yearly">سنوي</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => {
              if (v === "sales") handleExportSales();
              if (v === "products") handleExportProducts();
              if (v === "regions") handleExportRegions();
            }}>
              <SelectTrigger className="w-36 h-9 text-xs"><SelectValue placeholder="📥 تصدير CSV" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">تقرير المبيعات</SelectItem>
                <SelectItem value="products">أكثر المنتجات مبيعاً</SelectItem>
                <SelectItem value="regions">المبيعات حسب المنطقة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "إجمالي الإيرادات", value: `${totalRevenue.toLocaleString()} ر.س`, icon: TrendingUp },
            { label: "إجمالي الطلبات", value: totalOrders.toLocaleString(), icon: Package },
            { label: "العملاء النشطين", value: "1,847", icon: Users },
            { label: "المناطق المخدومة", value: "11", icon: MapPin },
          ].map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="p-4">
                <kpi.icon className="h-5 w-5 text-primary mb-2" />
                <p className="text-lg font-bold text-foreground">{kpi.value}</p>
                <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">الإيرادات والطلبات ({period === "weekly" ? "أسبوعي" : period === "monthly" ? "شهري" : "سنوي"})</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} ر.س`} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">المبيعات حسب المنطقة</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={regionSales} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value">
                    {regionSales.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {regionSales.map((r) => (
                  <span key={r.region} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                    {r.region} ({r.value}%)
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">الإيرادات حسب نوع العميل</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={customerTypeRevenue} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="type" tick={{ fontSize: 11 }} width={50} />
                  <Tooltip formatter={(v: number) => `${v.toLocaleString()} ر.س`} />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                    {customerTypeRevenue.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">أكثر المنتجات مبيعاً</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.sold} وحدة مباعة</p>
                </div>
                <span className="text-sm font-semibold text-foreground">{p.revenue.toLocaleString()} ر.س</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
