function currentTimeAmount(act = '') {
    const rentaltype = $('#rentalType').val()
    let unit_time = rentaltype == 'monthly' ? 'months' : 'days'
    let title = ''
    let msg = ''
    let validateCount = 0

    if (act == 'checkout') getCurrentTimeCountByCheckout()
    if (act == 'count' || act == 'checkin') {
        if (!rentaltype || rentaltype == '') {
            validateCount++
            title += 'ประเภทการเช่า'
            msg += 'โปรดเลือกประเภทการเช่า'
        }
        if (checkin == '') {
            validateCount++
            title += !title.includes('และ') ? ' และ' : ''
            title += 'วันที่เข้าพัก'
            msg += !msg.includes('และ') ? ' และ' : ''
            msg += 'โปรดเลือกวันที่เข้าพัก'
        }
    }
    if (validateCount > 0) {
        $('#timeCount').val('')
        queryFail('', title, msg)
    }

    if (validateCount == 0) currentBookingTime(act)
    $('#unitTime').val(unit_time)
}