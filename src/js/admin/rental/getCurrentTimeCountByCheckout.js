function getCurrentTimeCountByCheckout() {
    const checkin = $('#checkin').val()
    const checkout = $('#checkout').val()
    const date_stamp = getDateStampMonthly(checkin, checkout)
    const time_count = date_stamp.length
    $('#timeCount').val(time_count)
}