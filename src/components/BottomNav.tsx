import { Home, LayoutGrid, ClipboardList, MessageCircle, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/", icon: Home, label: "الرئيسية", labelEn: "Home" },
  { to: "/categories", icon: LayoutGrid, label: "الأقسام", labelEn: "Categories" },
  { to: "/orders", icon: ClipboardList, label: "الطلبات", labelEn: "Orders" },
  { to: "/chat", icon: MessageCircle, label: "المحادثة", labelEn: "Chat" },
  { to: "/profile", icon: User, label: "حسابي", labelEn: "Profile" },
];

const BottomNav = () => (
  <nav className="fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border h-[var(--bottom-nav-height)] flex items-center justify-around px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
    {tabs.map(({ to, icon: Icon, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors ${
            isActive ? "text-primary" : "text-muted-foreground"
          }`
        }
      >
        <Icon className="w-5 h-5" strokeWidth={2} />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);

export default BottomNav;
