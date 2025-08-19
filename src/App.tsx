import { useEffect, useMemo, useState } from 'react'
import { usePopularRepos, type Repo } from './hooks/usePopularRepos'
import RepoTable from './components/RepoTable/RepoTable'
import { PAGE_SIZE } from './constants/config'
import Pagination from './components/Pagination/Pagination'
import { getPageFromUrl } from './utils/getPageFromUrl'
import Filters from './components/Filters/Filters'
import {
  getStarredReposPage,
  loadAllStarredRepos,
  saveStarredRepos,
} from './utils/starredStorage'
import './App.css'

function TableLoading() {
  return (
    <div className="table-section__message table-section__message--loading">
      Loading…
    </div>
  )
}

function TableError({ message }: { message: string }) {
  return (
    <div
      className="table-section__message table-section__message--error"
      role="alert"
    >
      Error: {message}
    </div>
  )
}

function TableEmpty({
  showStarredOnly,
  page,
}: {
  showStarredOnly: boolean
  page: number
}) {
  const emptyMessage =
    showStarredOnly && page > 1
      ? 'You don’t have any starred repositories on this page. Try the previous page.'
      : 'No repositories found.'
  return <p>{emptyMessage}</p>
}

export default function App() {
  const [page, setPage] = useState(getPageFromUrl)
  const [starredAll, setStarredAll] = useState<Repo[]>(loadAllStarredRepos)
  const [showStarredOnly, setShowStarredOnly] = useState(false)

  const {
    repos: popularRepos,
    loading,
    error,
    hasMoreRepo,
  } = usePopularRepos(page, !showStarredOnly, PAGE_SIZE)

  const { starredRepoSlice: starredRepos, hasMoreStarred } = useMemo(
    () => getStarredReposPage(starredAll, page, PAGE_SIZE),
    [starredAll, page]
  )

  const onToggleStar = (repo: Repo) => {
    setStarredAll((prev) => {
      const exists = prev.some((r) => r.id === repo.id)
      const updated = exists
        ? prev.filter((r) => r.id !== repo.id)
        : [...prev, repo]
      saveStarredRepos(updated)
      return updated
    })
  }

  const handleToggleShowStarred = () => {
    setShowStarredOnly((prev) => !prev)
    setPage(1)
  }

  const handleToggleStar = (id: number) => {
    const repo = visibleRepos.find((r: Repo) => r.id === id)
    if (repo) {
      onToggleStar(repo)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set('page', String(page))
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', url)
  }, [page])

  const visibleRepos = showStarredOnly ? starredRepos : popularRepos

  const hasNextPage = showStarredOnly ? hasMoreStarred : hasMoreRepo

  const starredIds = useMemo(() => starredAll.map((r) => r.id), [starredAll])

  const renderContent = () => {
    if (loading) return <TableLoading />
    if (error) return <TableError message={error} />
    if (visibleRepos.length === 0)
      return <TableEmpty showStarredOnly={showStarredOnly} page={page} />
    return (
      <RepoTable
        repos={visibleRepos}
        starredIds={starredIds}
        onToggleStar={handleToggleStar}
      />
    )
  }

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-header__title">Most Popular GitHub Repositories</h1>
        <p className="page-header__meta">Sorted by total stars</p>
      </header>

      <main>
        <Filters
          showStarredOnly={showStarredOnly}
          onToggleShowStarred={handleToggleShowStarred}
        />
        <section className="table-section">
          <h2>Repository list</h2>
          <div className="table-section__wrapper">{renderContent()}</div>
          {!loading && !error && (
            <Pagination page={page} setPage={setPage} hasMore={hasNextPage} />
          )}
        </section>
      </main>
    </div>
  )
}
