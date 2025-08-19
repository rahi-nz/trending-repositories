import { describe, it, expect, vi } from 'vitest'
import { STORAGE_KEY } from '../constants/config'
import {
  loadAllStarredRepos,
  saveStarredRepos,
  getStarredReposPage,
} from './starredStorage'
import type { Repo } from '../hooks/usePopularRepos'

const makeRepo = (overrides: Partial<Repo>): Repo => ({
  id: Math.floor(Math.random() * 10_000),
  full_name: 'repo',
  language: 'TypeScript',
  description: 'repo description',
  html_url: 'https://github.com/owner/repo',
  stargazers_count: 0,
  ...overrides,
})

describe('starred storage helpers', () => {
  describe('loadAllStarredRepos', () => {
    it('returns [] when nothing is stored', () => {
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
      expect(loadAllStarredRepos()).toEqual([])
    })

    it('returns parsed list when valid JSON is stored', () => {
      const data = [makeRepo({ id: 1 }), makeRepo({ id: 2 })]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      expect(loadAllStarredRepos()).toEqual(data)
    })

    it('returns [] when JSON is invalid (defensive)', () => {
      localStorage.setItem(STORAGE_KEY, '{not: "json"')
      expect(loadAllStarredRepos()).toEqual([])
    })

    it('returns [] when localStorage.getItem throws', () => {
      const spy = vi
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(() => {
          throw new Error('boom')
        })
      expect(loadAllStarredRepos()).toEqual([])
      spy.mockRestore()
    })
  })

  describe('saveStarredRepos', () => {
    it('serializes and stores by STORAGE_KEY', () => {
      const data = [makeRepo({ id: 1, stargazers_count: 10 })]
      const spy = vi.spyOn(Storage.prototype, 'setItem')
      saveStarredRepos(data)
      expect(spy).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(data))
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(data)
    })
  })
})

describe('getStarredReposPage', () => {
  const sample = [
    makeRepo({ id: 1, language: 'TS', stargazers_count: 5 }),
    makeRepo({ id: 2, language: 'JS', stargazers_count: 50 }),
    makeRepo({ id: 3, language: 'TS', stargazers_count: 15 }),
    makeRepo({ id: 4, language: 'JS', stargazers_count: 1 }),
    makeRepo({ id: 5, language: 'TS', stargazers_count: 100 }),
  ]

  it('sorts by stargazers_count desc before paginating', () => {
    const { starredRepoSlice } = getStarredReposPage(sample, 1, '', 10)
    const scores = starredRepoSlice.map((r) => r.stargazers_count)
    expect(scores).toEqual([100, 50, 15, 5, 1])
  })

  it('filters by language when provided', () => {
    const { starredRepoSlice, totalCount } = getStarredReposPage(
      sample,
      1,
      'TS',
      10
    )
    expect(totalCount).toBe(3)
    expect(starredRepoSlice.every((r) => r.language === 'TS')).toBe(true)

    expect(starredRepoSlice.map((r) => r.stargazers_count)).toEqual([
      100, 15, 5,
    ])
  })

  it('treats empty language as "no filter"', () => {
    const { totalCount } = getStarredReposPage(sample, 1, '')
    expect(totalCount).toBe(sample.length)
  })

  it('paginates with default pageSize=30', () => {
    const { starredRepoSlice, hasMoreStarred, totalCount } =
      getStarredReposPage(sample, 1, '')
    expect(starredRepoSlice.length).toBe(sample.length)
    expect(totalCount).toBe(sample.length)
    expect(hasMoreStarred).toBe(false)
  })

  it('paginates with custom pageSize and computes hasMoreStarred', () => {
    const { starredRepoSlice, hasMoreStarred, totalCount } =
      getStarredReposPage(sample, 1, '', 2)
    expect(totalCount).toBe(5)
    expect(starredRepoSlice.length).toBe(2)
    expect(starredRepoSlice.map((r) => r.stargazers_count)).toEqual([100, 50])
    expect(hasMoreStarred).toBe(true)
  })

  it('returns the correct second page', () => {
    const { starredRepoSlice, hasMoreStarred } = getStarredReposPage(
      sample,
      2,
      '',
      2
    )
    expect(starredRepoSlice.map((r) => r.stargazers_count)).toEqual([15, 5])
    expect(hasMoreStarred).toBe(true)
  })

  it('last page has hasMoreStarred=false', () => {
    const { starredRepoSlice, hasMoreStarred } = getStarredReposPage(
      sample,
      3,
      '',
      2
    )
    expect(starredRepoSlice.map((r) => r.stargazers_count)).toEqual([1])
    expect(hasMoreStarred).toBe(false)
  })

  it('out-of-range page returns empty slice & hasMoreStarred=false', () => {
    const { starredRepoSlice, hasMoreStarred } = getStarredReposPage(
      sample,
      4,
      '',
      2
    )
    expect(starredRepoSlice).toEqual([])
    expect(hasMoreStarred).toBe(false)
  })
})
