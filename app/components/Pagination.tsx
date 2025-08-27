type PaginationProps = {
  currentPage: number;        // 1-based
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const btn =
    "inline-flex items-center justify-center h-9 min-w-9 px-3 rounded-md text-sm font-medium border border-slate-200";
  const inactive = `${btn} bg-white text-slate-700 hover:bg-slate-50`;
  const active = `${btn} bg-violet-600 text-white`;
  const nav =
    "inline-flex items-center justify-center h-9 px-3 rounded-md text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        className={nav}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={p === currentPage ? active : inactive}
          onClick={() => onPageChange(p)}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </button>
      ))}

      <button
        className={nav}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
