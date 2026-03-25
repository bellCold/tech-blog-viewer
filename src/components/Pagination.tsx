"use client";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(0, page - 2);
  const end = Math.min(totalPages - 1, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30"
      >
        ‹ 이전
      </button>
      {start > 0 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            1
          </button>
          {start > 1 && <span className="px-1 text-gray-300">...</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            p === page
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {p + 1}
        </button>
      ))}
      {end < totalPages - 1 && (
        <>
          {end < totalPages - 2 && (
            <span className="px-1 text-gray-300">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30"
      >
        다음 ›
      </button>
    </div>
  );
}
