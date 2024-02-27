function createPaginateOnLoad() {
    const query = JSON.parse($('#query').val())
    const index = parseInt($('#paginate-page').val())
    const count = parseInt($('#paginate-page-all').val())
    const row = parseInt($('#paginate-row').val())
    let route = thisPage(location.href)
    const keys = Object.keys(query)
    const values = Object.values(query)
    keys.forEach((v, i) => {
        if (values[i] != '' && values[i]) {
            route += `&${keys[i]}=${values[i]}`
        }
    })
    const entries = entries_row_query(route, row)
    route += `&row=${row}`
    const page = create_pagination(index, count, route)

    $('#paginate').html(page)
    $('#entries-query').html(entries)
}