import { useEffect, useState } from 'react'
import { usePopularRepos } from './hooks/usePopularRepos'
import RepoTable from './components/RepoTable/RepoTable'
import { PAGE_SIZE } from './constants/config'
import './App.css'
import Pagination from './components/Pagination/Pagination'
import { getPageFromUrl } from './utils/getPageFromUrl'

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

function TableEmpty() {
  return <p>No repositories found.</p>
}

export default function App() {
  const [page, setPage] = useState(getPageFromUrl)

  const { repos, loading, error, hasMoreRepo } = usePopularRepos(
    page,
    PAGE_SIZE
  )
  console.log('loading', loading)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set('page', String(page))
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', url)
  }, [page])

  const renderContent = () => {
    if (loading) return <TableLoading />
    if (error) return <TableError message={error} />
    if (repos.length === 0 && !loading) return <TableEmpty />
    return <RepoTable repos={repos} />
  }

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-header__title">Most Popular GitHub Repositories</h1>
        <p className="page-header__meta">Sorted by total stars</p>
      </header>

      <main>
        <section className="table-section">
          <h2>Repository list</h2>
          <div className="table-section__wrapper">{renderContent()}</div>
          {!loading && !error && (
            <Pagination page={page} setPage={setPage} hasMore={hasMoreRepo} />
          )}
        </section>
      </main>
    </div>
  )
}
