document.addEventListener('DOMContentLoaded', () => {
    const query = JSON.parse($('#query').val())
    const index = parseInt($('#paginate-page').val())
    const count = parseInt($('#paginate-page-all').val())
    const row = parseInt($('#paginate-row').val())
    let route = `${getPathByThisPage()}`
    const entries = entries_row_query(route, row)
    route += `?row=${row}`
    const page = create_pagination(index, count, route)
    $('#paginate').html(page)
})
