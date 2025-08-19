import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Pagination from './Pagination'

describe('Pagination', () => {
  it('disables Prev on first page and ignores clicks', () => {
    const setPage = vi.fn()
    render(<Pagination page={1} setPage={setPage} hasMore />)
    const prevBtn = screen.getByRole('button', { name: /prev/i })
    expect(prevBtn).toBeDisabled()
    fireEvent.click(prevBtn)
    expect(setPage).not.toHaveBeenCalled()
  })

  it('disables Next when hasMore is false and ignores clicks', () => {
    const setPage = vi.fn()
    render(<Pagination page={3} setPage={setPage} hasMore={false} />)
    const nextBtn = screen.getByRole('button', { name: /next/i })
    expect(nextBtn).toBeDisabled()
    fireEvent.click(nextBtn)
    expect(setPage).not.toHaveBeenCalled()
  })

  it('calls setPage with decrement/increment functions when enabled', () => {
    const setPage = vi.fn()
    render(<Pagination page={2} setPage={setPage} hasMore />)

    fireEvent.click(screen.getByRole('button', { name: /prev/i }))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    expect(setPage).toHaveBeenCalledTimes(2)
    const [prevCall, nextCall] = setPage.mock.calls

    const prevUpdater = prevCall[0] as (p: number) => number
    const nextUpdater = nextCall[0] as (p: number) => number

    expect(prevUpdater(2)).toBe(1)
    expect(nextUpdater(2)).toBe(3)
  })

  it('shows the current page indicator', () => {
    const setPage = vi.fn()
    render(<Pagination page={5} setPage={setPage} hasMore />)
    expect(screen.getByText(/page 5/i)).toBeInTheDocument()
  })
})
