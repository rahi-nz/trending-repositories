import React from 'react'
import './Pagination.css'

type PaginationProps = {
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  hasMore: boolean
}

export default function Pagination({
  page,
  setPage,
  hasMore,
}: PaginationProps) {
  const goPrev = () => setPage((p) => Math.max(1, p - 1))
  const goNext = () => setPage((p) => p + 1)

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination__btn pagination__btn--prev"
        onClick={goPrev}
        disabled={page === 1}
      >
        ← Prev
      </button>

      <span
        className="pagination__indicator"
        aria-live="polite"
        aria-atomic="true"
      >
        Page {page}
      </span>

      <button
        type="button"
        className="pagination__btn pagination__btn--next"
        onClick={goNext}
        disabled={!hasMore}
      >
        Next →
      </button>
    </nav>
  )
}
