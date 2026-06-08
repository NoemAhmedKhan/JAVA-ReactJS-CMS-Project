import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (
      i === currentPage - delta - 1 ||
      i === currentPage + delta + 1
    ) {
      pages.push("...");
    }
  }

  // De-duplicate consecutive "..."
  const dedupedPages = pages.filter(
    (p, i) => !(p === "..." && pages[i - 1] === "...")
  );

  return (
    <div className="pagination-wrap">
      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>
      <div className="pagination-controls">
        <button
          className="pag-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <i className="fas fa-chevron-left" />
        </button>

        {dedupedPages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="pag-ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`pag-btn pag-num ${p === currentPage ? "pag-btn--active" : ""}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className="pag-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
