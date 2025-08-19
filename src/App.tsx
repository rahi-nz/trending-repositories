import { useState } from 'react'
import { usePopularRepos } from './hooks/usePopularRepos'
import RepoTable from './components/RepoTable/RepoTable'
import { PAGE_SIZE } from './constants/config'
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

function TableEmpty() {
  return <p>No repositories found.</p>
}

export default function App() {
  const [page] = useState(1)

  const { repos, loading, error } = usePopularRepos(page, PAGE_SIZE)

  const renderContent = () => {
    if (loading) return <TableLoading />
    if (error) return <TableError message={error} />
    if (repos.length === 0) return <TableEmpty />
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
        </section>
      </main>
    </div>
  )
}
