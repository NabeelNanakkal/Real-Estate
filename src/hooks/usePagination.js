import { useState, useMemo } from 'react';

export const usePagination = (items = [], pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const setPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return { currentPage, totalPages, paginated, setPage };
};
