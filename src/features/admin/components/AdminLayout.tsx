import { ReactNode, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Truck, RotateCcw,
  Settings, BarChart3, ChevronRight, ChevronLeft, Menu, Bell, Search, LogOut,
  Megaphone, Tag, FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "لوحة التحكم", end: true },
  { to: "/admin/products", icon: Package, label: "المنتجات" },
  { to: "/admin/categories", icon: FolderOpen, label: "الفئات" },
  { to: "/admin/orders", icon: ShoppingCart, label: "الطلبات", badge: 5 },
  { to: "/admin/customers", icon: Users, label: "العملاء" },
  { to: "/admin/coupons", icon: Tag, label: "الكوبونات" },
  { to: "/admin/delivery", icon: Truck, label: "التوصيل والعملات" },
  { to: "/admin/returns", icon: RotateCcw, label: "المرتجعات", badge: 2 },
  { to: "/admin/notifications", icon: Megaphone, label: "الإشعارات" },
  { to: "/admin/reports", icon: BarChart3, label: "التقارير" },
  { to: "/admin/settings", icon: Settings, label: "الإعدادات" },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-border px-4">
        {collapsed ? (
          <span className="text-xl font-bold text-primary">⚙️</span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <span className="font-bold text-primary text-sm">لوحة التحكم</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="flex-1 text-right">{label}</span>}
            {!collapsed && badge && (
              <Badge variant="destructive" className="text-[10px] h-5 min-w-5 flex items-center justify-center">
                {badge}
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle (desktop) */}
      <div className="hidden lg:flex border-t border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Back to store */}
      <div className="border-t border-border p-3">
        <NavLink to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>العودة للمتجر</span>}
        </NavLink>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-64 bg-card border-l border-border shadow-xl transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-card border-l border-border shadow-sm transition-all",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative hidden sm:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="بحث..." className="pr-9 w-64 h-9 text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              م
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
