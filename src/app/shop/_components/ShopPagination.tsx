"use client";

interface ShopPaginationProps {
  totalPages: number;
  activePage: number;
  onPageChange: (page: number) => void;
}

/**
 * Build a page list with ellipsis, e.g. [1, 2, 3, '...', 6]
 * Always shows first, last, and pages around active.
 */
function getPageNumbers(total: number, active: number): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];
  const near = new Set([1, 2, active - 1, active, active + 1, total - 1, total]);

  let prev = 0;
  for (let i = 1; i <= total; i++) {
    if (near.has(i)) {
      if (prev && i - prev > 1) pages.push("...");
      pages.push(i);
      prev = i;
    }
  }
  return pages;
}

export default function ShopPagination({
  totalPages,
  activePage,
  onPageChange,
}: ShopPaginationProps) {
  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (totalPages <= 1) return null;

  const pages = getPageNumbers(totalPages, activePage);

  return (
    <nav className="shop-pagination" aria-label="Pagination">
      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="shop-page-ellipsis">
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            className={`shop-page-btn${activePage === page ? " active" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        )
      )}
      {activePage < totalPages && (
        <button
          className="shop-page-btn shop-page-next"
          onClick={() => handlePageChange(Math.min(activePage + 1, totalPages))}
        >
          Next &rarr;
        </button>
      )}
    </nav>
  );
}
