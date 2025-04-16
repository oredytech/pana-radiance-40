
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ArticlesPaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const ArticlesPagination = ({
  currentPage,
  totalPages,
  paginate,
}: ArticlesPaginationProps) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    if (totalPages <= 5) {
      // If 5 or fewer pages, show all page numbers
      for (let i = 2; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // For many pages, use a condensed display with ellipsis
      if (currentPage > 3) {
        pageNumbers.push('ellipsis1');
      }
      
      // Show page numbers around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pageNumbers.push(i);
        }
      }
      
      // Add ellipsis if there's a gap before the last page
      if (currentPage < totalPages - 2) {
        pageNumbers.push('ellipsis2');
      }
      
      // Always show last page if we have more than one page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => paginate(currentPage - 1)} 
            className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>
        
        {getPageNumbers().map((pageNumber, index) => (
          typeof pageNumber === 'string' ? (
            <PaginationItem key={pageNumber}>
              <span className="flex h-9 w-9 items-center justify-center">...</span>
            </PaginationItem>
          ) : (
            <PaginationItem key={`page-${pageNumber}`}>
              <PaginationLink 
                isActive={currentPage === pageNumber} 
                onClick={() => paginate(Number(pageNumber))}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        ))}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => paginate(currentPage + 1)} 
            className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ArticlesPagination;
