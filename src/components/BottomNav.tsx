import { Home, LayoutGrid, ClipboardList, MessageCircle, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/profile", icon: User, label: "حسابي" },
  { to: "/chat", icon: MessageCircle, label: "المحادثة" },
  { to: "/orders", icon: ClipboardList, label: "الطلبات" },
  { to: "/categories", icon: LayoutGrid, label: "الأقسام" },
  { to: "/", icon: Home, label: "الرئيسية" },
];

const BottomNav = () => (
  <nav className="fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border h-[var(--bottom-nav-height)] flex items-center justify-around px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
    {tabs.map(({ to, icon: Icon, label }) => (
      <NavLink
        key={to}
        to={to}
        end={to === "/"}
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors relative ${
            isActive ? "text-primary" : "text-muted-foreground"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute -top-2.5 w-8 h-0.5 bg-primary rounded-full" />
            )}
            <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
            <span className={isActive ? "font-bold" : ""}>{label}</span>
          </>
        )}
      </NavLink>
    ))}
  </nav>
);

export default BottomNav;
