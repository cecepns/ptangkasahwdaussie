import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ pagination, page, setPage, limit, setLimit }) {
  const { totalPages, total } = pagination;
  const pages = [];

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Show</span>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-blue/30"
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span>of {total} entries</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPage(p)}
            className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? "bg-brand-blue text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
