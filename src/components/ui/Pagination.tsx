import { useState, useMemo } from "react";

export function usePagination<T>(data: T[] = [], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const maxPage = useMemo(
    () => Math.max(1, Math.ceil(data.length / itemsPerPage)),
    [data, itemsPerPage]
  );

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [currentPage, data, itemsPerPage]);

  const next = () => {
    setCurrentPage((p) => Math.min(p + 1, maxPage));
  };

  const prev = () => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  };

  const jump = (page: number) => {
    const sanitized = Math.max(1, Math.min(page, maxPage));
    setCurrentPage(sanitized);
  };

  return {
    currentPage,
    maxPage,
    currentData,
    next,
    prev,
    jump,
  };
}

export default usePagination;
