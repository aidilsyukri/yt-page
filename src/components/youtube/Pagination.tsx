'use client';

interface PaginationProps {
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ total, currentPage, onPageChange }: PaginationProps) {
  if (total <= 1) return null;

  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(total, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          backgroundColor: '#1A1A1A',
          color: '#F1F1F1',
          border: '1px solid #2A2A2A',
        }}
      >
        ‹ Prev
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-9 h-9 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: '#1A1A1A',
              color: '#F1F1F1',
              border: '1px solid #2A2A2A',
            }}
          >
            1
          </button>
          {start > 2 && (
            <span className="px-1" style={{ color: '#AAAAAA' }}>
              …
            </span>
          )}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className="w-9 h-9 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: currentPage === p ? '#3EA6FF' : '#1A1A1A',
            color: currentPage === p ? '#0F0F0F' : '#F1F1F1',
            border: `1px solid ${currentPage === p ? '#3EA6FF' : '#2A2A2A'}`,
          }}
        >
          {p}
        </button>
      ))}

      {end < total && (
        <>
          {end < total - 1 && (
            <span className="px-1" style={{ color: '#AAAAAA' }}>
              …
            </span>
          )}
          <button
            onClick={() => onPageChange(total)}
            className="w-9 h-9 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: '#1A1A1A',
              color: '#F1F1F1',
              border: '1px solid #2A2A2A',
            }}
          >
            {total}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === total}
        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          backgroundColor: '#1A1A1A',
          color: '#F1F1F1',
          border: '1px solid #2A2A2A',
        }}
      >
        Next ›
      </button>
    </div>
  );
}
