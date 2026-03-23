import { ReactNode } from "react";
import BottomNav from "./BottomNav";

const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen max-w-md mx-auto bg-background relative">
    <div className="pb-[var(--bottom-nav-height)]">{children}</div>
    <BottomNav />
  </div>
);

export default AppLayout;
