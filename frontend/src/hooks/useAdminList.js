import { useCallback, useEffect, useState } from "react";
import { get } from "@/utils/request";

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useAdminList(endpoint, options = {}) {
  const { defaultLimit = 10, extraParams = {} } = options;
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: defaultLimit, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const debouncedSearch = useDebounce(search);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = { page, limit, search: debouncedSearch || undefined, ...extraParams };
    const result = await get(endpoint, params);
    if (result.success && result.data?.success) {
      setData(result.data.data || []);
      setPagination(result.data.pagination || pagination);
    }
    setLoading(false);
  }, [endpoint, page, limit, debouncedSearch, JSON.stringify(extraParams)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, limit]);

  return {
    data,
    pagination,
    loading,
    search,
    setSearch,
    page,
    setPage,
    limit,
    setLimit,
    refresh: fetchData,
  };
}
