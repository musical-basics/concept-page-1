"use client";

interface ShopPaginationProps {
  totalPages: number;
  activePage: number;
  onPageChange: (page: number) => void;
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

  return (
    <nav className="shop-pagination" aria-label="Pagination">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`shop-page-btn${activePage === page ? " active" : ""}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}
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
