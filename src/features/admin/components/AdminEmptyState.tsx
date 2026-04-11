import { LucideIcon, SearchX } from "lucide-react";

interface AdminEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

const AdminEmptyState = ({ icon: Icon = SearchX, title, description }: AdminEmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
      <Icon className="h-6 w-6 text-muted-foreground" />
    </div>
    <p className="text-sm font-medium text-foreground">{title}</p>
    {description && <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">{description}</p>}
  </div>
);

export default AdminEmptyState;
