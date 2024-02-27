document.addEventListener('DOMContentLoaded', () => {
    const query = JSON.parse($('#query').val())
    const status = query.status
    const id = query.id
    $('#findDataByBookingId').val(id)
    retainOptionValue($('#findRentalTypeByStatus'), status)
    createPaginateOnLoad()
})


function getDataByPageAndQuery(query, value) {
    const p = get_query_params().get('p')
    if (value != '') location.assign(`?p=${p}&${query}=${value}`)
}

$('#findRentalTypeByStatus').change(function () {
    getDataByPageAndQuery('status', $(this).val().trim())
})

$('#findByRentalType').change(function () {
    getDataByPageAndQuery('type', $(this).val().trim())
})

$('#findDataByBookingIdBtn').click(function () {
    const id = $('#findDataByBookingId').val().trim()
    getDataByPageAndQuery('id', id)
})

$('#getRentalDataAll').click(function () {
    const p = getPageIsSystem(location.search)
    location.assign(p)
})