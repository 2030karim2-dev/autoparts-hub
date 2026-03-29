const SkeletonCard = ({ variant = "grid" }: { variant?: "grid" | "list" }) => {
  if (variant === "list") {
    return (
      <div className="bg-card rounded-xl p-3 flex gap-3 shadow-sm animate-pulse">
        <div className="w-20 h-20 bg-muted rounded-lg shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-5 bg-muted rounded w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-sm p-2.5 animate-pulse">
      <div className="w-full aspect-square bg-muted rounded-lg mb-2" />
      <div className="h-3.5 bg-muted rounded w-3/4 mb-1.5" />
      <div className="h-3 bg-muted rounded w-1/2 mb-1.5" />
      <div className="h-4 bg-muted rounded w-1/3" />
    </div>
  );
};

export const SkeletonOrderCard = () => (
  <div className="bg-card rounded-xl shadow-sm overflow-hidden animate-pulse">
    <div className="px-4 py-3 border-b border-border flex justify-between">
      <div className="h-4 bg-muted rounded w-20" />
      <div className="h-3 bg-muted rounded w-16" />
    </div>
    <div className="px-4 py-3 flex gap-3">
      <div className="w-14 h-14 bg-muted rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-3 bg-muted rounded w-1/3" />
      </div>
    </div>
    <div className="px-4 py-3 border-t border-border flex justify-between">
      <div className="h-4 bg-muted rounded w-24" />
      <div className="h-8 bg-muted rounded w-20" />
    </div>
  </div>
);

export const SkeletonProductDetail = () => (
  <div className="animate-pulse">
    <div className="bg-card aspect-[4/3] w-full" />
    <div className="px-4 pt-4 space-y-3">
      <div className="h-3 bg-muted rounded w-2/3" />
      <div className="h-5 bg-muted rounded w-full" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="h-6 bg-muted rounded w-1/3" />
    </div>
  </div>
);

export default SkeletonCard;