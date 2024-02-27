document.addEventListener('DOMContentLoaded', () => {
    const query = JSON.parse($('#query').val())
    const {
        bed_type,
        max,
        min,
        room_type,
        time_count,
        roomview,
        rental_type,
        checkin_retain,
        checkout_retain
    } = query

    const unitTime = rental_type == 'monthly' ? 'months' : 'days'
    const index = parseInt($('#paginate-page').val())
    const count = parseInt($('#paginate-page-all').val())
    const row = parseInt($('#paginate-row').val())
    let route = `${getPathByThisPage()}`
    const entries = entries_row_query(route, row)
    route += `?row=${row}`
    route += `&checkin=${checkin_retain}&checkout=${checkout_retain}`
    route += `&rental_type=${rental_type}&count=${time_count}`
    route += bed_type ? `&bed_type=${bed_type}` : ''
    route += room_type ? `&room_type=${room_type}` : ''
    route += roomview ? `&roomview=${roomview}` : ''
    route += max ? `&min=${min}&max=${max}` : ''
    route += room_type ? `&room_type=${room_type}` : ''
    route += roomview ? `&roomview=${roomview}` : ''
    const page = create_pagination(index, count, route)
    $('#paginate').html(page)
    $('#entries-query').html(entries)

    retainOptionValue($('#findByRoomType'), room_type)
    retainOptionValue($('#findByBedType'), bed_type)
    retainOptionValue($('#findByRoomView'), roomview)
    retainOptionValue($('#unitTime'), unitTime)
    retainRadioValue($('[name="rentaltype"]'), rental_type)
})

$('#resetRoomDataBtn').click(function () {
    location.assign('/reserve')
})

$('[name="rentaltype"]').change(function () {
    const timeCount = $('#unitTime')
    const t = $(this).val()
    const unit_time = t != 'monthly' ? 'days' : 'months'
    const isDisabledCount = t == 'daily-no-limit'
    const time_count = !isDisabledCount ? timeCount.val() : ''
    $('#unitTime').val(unit_time)
    $('#timeCount').prop('disabled', isDisabledCount).val(time_count)
    currentBookingTime()
})

function currentBookingTime() {
    const checkin = $('#findByCheckin').val()
    const timeCount = parseInt($("#timeCount").val())
    const unitTime = $('#unitTime').val()
    const rentaltype = $('[name="rentaltype"]').filter(':checked').val()
    let checkout = ''
    console.log(timeCount, rentaltype)

    if (checkin != '' && !isNaN(timeCount) && unitTime != '') {
        console.log('dddddddddd')
        const date = checkin.split('-')
        let m = parseInt(date[1])
        const y = parseInt(date[0])
        const dt = parseInt(date[2])
        const count = m + (timeCount - 1)
        let year_append = 0
        let mcheckout = 0

        switch (rentaltype) {
            case 'monthly':
                year_append = Math.floor(count / 12)
                mcheckout = count % 12
                if (mcheckout == 0) {
                    mcheckout = 12
                    year_append -= 1
                }
                const month = getCountDate(mcheckout)
                const ycheckout = y + year_append
                const sum_month = getCountMonth(ycheckout, mcheckout)
                checkout = `${ycheckout}-${month}-${sum_month}`
                break;
            case 'daily':
                const now = `${y}-${m}-${getCountDate(dt)} 00:00:00`
                const now_stamp = new Date(now).valueOf()
                const currentDay = 1000 * 60 * 60 * 24 * timeCount
                const checkout_stamp = (currentDay + now_stamp)
                checkout = setDate(currentDay + now_stamp)
            default:
                break;
        }
    }
    $('#findByCheckout').val(checkout)
}