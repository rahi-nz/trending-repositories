import { PAGE_SIZE, STORAGE_KEY } from '../constants/config'
import type { Repo } from '../hooks/usePopularRepos'

export function loadAllStarredRepos(): Repo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveStarredRepos(repos: Repo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(repos))
}

export function getStarredReposPage(
  starredRepo: Repo[],
  page: number,
  pageSize = PAGE_SIZE
): { starredRepoSlice: Repo[]; hasMoreStarred: boolean; totalCount: number } {
  const filtered = starredRepo.sort(
    (a, b) => b.stargazers_count - a.stargazers_count
  )

  const start = (page - 1) * pageSize
  const end = page * pageSize

  return {
    starredRepoSlice: filtered.slice(start, end),
    totalCount: filtered.length,
    hasMoreStarred: end < filtered.length,
  }
}
