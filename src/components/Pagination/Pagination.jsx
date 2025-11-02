// CSS
import "./pagination.css";

export const Pagination = ({ page, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    const pages = getPageNumbers();

    return (
        <nav aria-label="pagination_dashboard">
            <ul className="pagination justify-content-center m-0 pb-4">
                {/* Previous */}
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                        className="page-link pagation_items_link"
                        aria-label="Previous"
                        onClick={() => onPageChange(page - 1)}
                    >
                        <span aria-hidden="true">&laquo;</span>
                    </button>
                </li>

                {/* First page + ellipsis */}
                {page > 3 && (
                    <>
                        <li className="page-item">
                            <button
                                className="page-link mx-1 pagation_numbers_link"
                                onClick={() => onPageChange(1)}
                            >
                                1
                            </button>
                        </li>
                        {page > 4 && (
                            <li className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        )}
                    </>
                )}

                {/* Page numbers */}
                {pages.map((num) => (
                    <li
                        key={num}
                        className={`page-item ${page === num ? "active" : ""}`}
                    >
                        <button
                            className="page-link mx-1 pagation_numbers_link"
                            onClick={() => onPageChange(num)}
                        >
                            {num}
                        </button>
                    </li>
                ))}

                {/* Ellipsis + last page */}
                {page < totalPages - 2 && (
                    <>
                        {page < totalPages - 3 && (
                            <li className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        )}
                        <li className="page-item">
                            <button
                                className="page-link mx-1 pagation_numbers_link"
                                onClick={() => onPageChange(totalPages)}
                            >
                                {totalPages}
                            </button>
                        </li>
                    </>
                )}

                {/* Next */}
                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button
                        className="page-link pagation_items_link"
                        aria-label="Next"
                        onClick={() => onPageChange(page + 1)}
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
};