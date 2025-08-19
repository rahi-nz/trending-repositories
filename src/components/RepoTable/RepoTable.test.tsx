import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen, within, fireEvent } from '@testing-library/react'
import RepoTable from './RepoTable'
import type { Repo } from '../../hooks/usePopularRepos'

describe('RepoTable (with inline mock data)', () => {
  const repoA: Repo = {
    id: 1,
    full_name: 'repo 1',
    html_url: 'https://example.com/repo/1',
    description: 'repo 1 description',
    language: 'TypeScript',
    stargazers_count: 20000,
  }

  const repoB: Repo = {
    id: 2,
    full_name: 'repo 2',
    html_url: 'https://example.com/repo/2',
    description: 'repo 2 description',
    language: 'JavaScript',
    stargazers_count: 1234,
  }

  const repoNoLang: Repo = {
    id: 3,
    full_name: 'repo 3',
    html_url: 'https://example.com/repo/3',
    description: 'repo 3 description',
    language: null,
    stargazers_count: 50,
  }

  it('renders table headers', () => {
    render(<RepoTable repos={[repoA]} starredIds={[]} onToggleStar={vi.fn()} />)

    const table = screen.getByRole('table')
    const headers = within(table).getAllByRole('columnheader')
    expect(headers.map((h) => h.textContent?.trim())).toEqual([
      'Repository',
      'Language',
      'Stars',
      'Actions',
    ])
  })

  it('renders repo row with link, description, language, and formatted stars', () => {
    render(<RepoTable repos={[repoA]} starredIds={[]} onToggleStar={vi.fn()} />)

    const link = screen.getByRole('link', { name: repoA.full_name })
    expect(link).toHaveAttribute('href', repoA.html_url)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))

    expect(screen.getByText(repoA.description!)).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(
      screen.getByText(repoA.stargazers_count.toLocaleString())
    ).toBeInTheDocument()
  })

  it('shows em dash when language is null/undefined', () => {
    render(
      <RepoTable repos={[repoNoLang]} starredIds={[]} onToggleStar={vi.fn()} />
    )
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('applies starred state class and toggles by clicking', () => {
    const onToggleStar = vi.fn()
    render(
      <RepoTable
        repos={[repoA, repoB]}
        starredIds={[repoA.id]}
        onToggleStar={onToggleStar}
      />
    )

    const starredBtn = screen.getByRole('button', { name: /starred/i })
    const starBtn = screen.getByRole('button', { name: /^star$/i })

    expect(starredBtn).toHaveTextContent('★')
    expect(starBtn).toHaveTextContent('☆')
    expect(starredBtn.className).toMatch(/repo-table__star-btn--starred/)

    fireEvent.click(starBtn)
    expect(onToggleStar).toHaveBeenCalledWith(repoB.id)

    fireEvent.click(starredBtn)
    expect(onToggleStar).toHaveBeenCalledWith(repoA.id)
  })

  it('renders one row per repo', () => {
    render(
      <RepoTable
        repos={[repoA, repoB, repoNoLang]}
        starredIds={[]}
        onToggleStar={vi.fn()}
      />
    )
    const tbody = screen
      .getAllByRole('rowgroup')
      .find((rg) => rg.tagName.toLowerCase() === 'tbody')!
    const rows = within(tbody).getAllByRole('row')
    expect(rows).toHaveLength(3)
  })
})
