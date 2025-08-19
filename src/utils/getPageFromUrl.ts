export function getPageFromUrl(): number {
  const params = new URLSearchParams(window.location.search)
  const page = parseInt(params.get('page') || '1', 10)
  return page > 0 ? page : 1
}
