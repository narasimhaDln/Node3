'use client';
import React from 'react';

interface PaginationProps {
  totalJobs: number;
  jobsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  totalJobs,
  jobsPerPage,
  currentPage,
  onPageChange,
  loading = false,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalJobs / jobsPerPage));

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  // Don't render pagination if there are no pages or only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center mt-8 space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || loading}
        className={`px-4 py-2 rounded-full font-medium transition-colors ${
          currentPage <= 1 || loading
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
        }`}
        aria-label="Go to previous page"
      >
        Previous
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => {
        const isEllipsis = typeof page === 'string';
        const isCurrentPage = page === currentPage;

        return (
          <button
            key={`page-${page}-${index}`}
            onClick={() => !isEllipsis && onPageChange(page as number)}
            disabled={isEllipsis || isCurrentPage || loading}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              isCurrentPage
                ? 'bg-blue-600 text-white cursor-default'
                : !isEllipsis && !loading
                  ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer'
                  : 'text-gray-500 cursor-default'
            }`}
            aria-label={isEllipsis ? 'More pages' : `Go to page ${page}`}
            aria-current={isCurrentPage ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || loading}
        className={`px-4 py-2 rounded-full font-medium transition-colors ${
          currentPage >= totalPages || loading
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
        }`}
        aria-label="Go to next page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;