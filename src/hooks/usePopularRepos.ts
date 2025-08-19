import { useEffect, useState } from 'react'
import { PAGE_SIZE } from '../constants/config'

export type Repo = {
  id: number
  language: string | null
  full_name: string
  description: string | null
  stargazers_count: number
  html_url: string
}

type UsePopularReposResult = {
  repos: Repo[]
  loading: boolean
  error: string | null
  totalCount: number
  hasMoreRepo: boolean
}

export function usePopularRepos(
  page: number,
  shouldFetch: boolean,
  pageSize = PAGE_SIZE,
  language: string
): UsePopularReposResult {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMoreRepo, setHasMoreRepo] = useState(false)

  useEffect(() => {
    if (!shouldFetch) {
      setLoading(false)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    const params = new URLSearchParams({
      q: `stars:>1${language ? ` language:${language}` : ''}`,
      sort: 'stars',
      order: 'desc',
      page: String(Math.max(1, page)),
      per_page: String(pageSize),
    })

    const url = `https://api.github.com/search/repositories?${params.toString()}`

    ;(async () => {
      try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.message || `${res.status} ${res.statusText}`)
        }

        const data = await res.json()
        const items: Repo[] = data.items ?? []
        const total = Number(data.total_count ?? 0)
        setRepos(items)
        setTotalCount(total)
        setHasMoreRepo(page * pageSize < total)
        setLoading(false)
        setError(null)
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        const msg =
          err instanceof Error ? err.message : String(err ?? 'Unknown error')
        setError(msg)
        setRepos([])
        setTotalCount(0)
        setHasMoreRepo(false)
        setLoading(false)
      }
    })()

    return () => controller.abort()
  }, [language, page, pageSize, shouldFetch])

  return { repos, loading, error, totalCount, hasMoreRepo }
}
