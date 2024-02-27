function get_query_params() {
  const url = new URL(location.href)
  const params = url.searchParams
  return params
}