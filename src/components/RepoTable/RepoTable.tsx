import type { Repo } from '../../hooks/usePopularRepos'
import './RepoTable.css'

type RepoTableProps = {
  repos: Repo[]
  starredIds: number[]
  onToggleStar: (id: number) => void
}

export default function RepoTable({
  repos,
  starredIds,
  onToggleStar,
}: RepoTableProps) {
  return (
    <table className="repo-table">
      <thead className="repo-table__head">
        <tr className="repo-table__row">
          <th
            scope="col"
            className="repo-table__header-cell repo-table__header-cell--repo"
          >
            Repository
          </th>
          <th scope="col" className="repo-table__header-cell">
            Language
          </th>
          <th scope="col" className="repo-table__header-cell">
            Stars
          </th>
          <th scope="col" className="repo-table__header-cell">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="repo-table__body">
        {repos.map((repo) => {
          const isStarred = starredIds.includes(repo.id)
          return (
            <tr key={repo.id} className="repo-table__row">
              <td className="repo-table__cell repo-table__cell--repo">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-table__link"
                >
                  {repo.full_name}
                </a>
                {repo.description && (
                  <p className="repo-table__description">{repo.description}</p>
                )}
              </td>
              <td className="repo-table__cell">{repo.language ?? '—'}</td>
              <td className="repo-table__cell">
                {repo.stargazers_count.toLocaleString()}
              </td>
              <td className="repo-table__cell">
                <button
                  type="button"
                  className={`repo-table__star-btn ${isStarred ? 'repo-table__star-btn--starred' : ''}`}
                  onClick={() => onToggleStar(repo.id)}
                >
                  <span className="repo-table__star-icon" aria-hidden="true">
                    {isStarred ? '★' : '☆'}
                  </span>
                  <span className="repo-table__star-label">
                    {isStarred ? 'Starred' : 'Star'}
                  </span>
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
