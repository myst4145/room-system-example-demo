function currentBookingTime(act) {
    const checkinDate = $('#checkin').val()
    const timeCount = parseInt($("#timeCount").val())
    const rentaltype = $('#rentalType').val()
    const date = new Date(`${checkinDate} 00:00:00`)
    let m = date.getMonth() + 1
    const y = date.getFullYear()
    const dt = date.getDate()
    const count = m + (timeCount - 1)
    let year_append = 0
    let mcheckout = 0
    let checkout = ''
    const price = parseFloat($('#price').val())
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
            checkout = setDate(currentDay + now_stamp)
        default:
            break;
    }
    const date_stamp = getDateStampMonthly(checkinDate, checkout)
    let total = 0
    if (act != 'count' && rentaltype == 'monthly') {
        total = date_stamp.length * price
        $('#timeCount').val(date_stamp.length)
    }
    if (act != 'checkout') $('#checkout').val(checkout)
    if (act == 'count') total = price * timeCount
    $('#total').val(total)

}