import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface AdminTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

const AdminTablePagination = ({
  currentPage, totalPages, totalItems, startIndex, endIndex,
  hasNextPage, hasPrevPage, nextPage, prevPage, goToPage,
}: AdminTablePaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <p className="text-xs text-muted-foreground">
        {startIndex}-{endIndex} من {totalItems}
      </p>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!hasPrevPage} onClick={prevPage}>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span key={`e${i}`} className="px-1 text-xs text-muted-foreground">...</span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "ghost"}
              size="icon"
              className="h-7 w-7 text-xs"
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          )
        )}
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!hasNextPage} onClick={nextPage}>
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default AdminTablePagination;
