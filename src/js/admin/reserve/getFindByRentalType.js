getFindByRentalType().element.change(function () {
    const t = $(this).val()
    let disabledCheckin = true
    let disabledCheckout = true
    let disabledUnitTime = true
    let disabledTimeCount = true

    const rental = t == 'monthly' ? 'months' : 'days'
    const unit_time = t != 'daily-no-limit' ? rental : ''
    const checkin = t != 'daily-no-limit' ? getFindByCheckin().val() : ''
    const checkout = t != 'daily-no-limit' ? getFindByCheckout().val() : ''
    const time_count = t != 'daily-no-limit' ? getFindBytimeCount().val() : ''
    switch (t) {
        case 'daily':
            disabledCheckin = false
            disabledCheckout = false
            disabledUnitTime = false
            disabledTimeCount = false
        default:
            break;
    }

    console.log(getFindByUnitTime())
    getFindByCheckin().prop('disabled', disabledCheckin).val(checkin)
    getFindByCheckout().prop('disabled', disabledCheckout).val(checkout)
    getFindByUnitTime().prop('disabled', disabledUnitTime).val(unit_time)
    getFindBytimeCount().prop('disabled', disabledTimeCount).val(time_count)
    currentBookingTime('rental')
})