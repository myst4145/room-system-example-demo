function currentTime(act = '') {
    const rentaltype = $('#rentalType').val()
    let unit_time = rentaltype == 'monthly' ? 'months' : 'days'
    let title = ''
    let msg = ''
    let validateCount = 0
    if (validateCount > 0) {
        $('#timeCount').val('')
        queryFail('', title, msg)
    }

    if (validateCount == 0) {
        const checkin = $('#checkin').val()
        const timeCount = parseInt($('#timeCount').val())
        const unitTime = $('#unitTime').val()
        const checkin_stamp = new Date(`${checkin} 00:00:00`)
        const now = getTimeStampisNow()
        let checkout = ''
        let msg = ''
        let validateCount = 0

        switch (act) {
            case 'checkin':
                if (checkin_stamp < now) {
                    validateCount++
                    $('#checkin').val('')
                    $('#timeCount').val('')
                    msg += 'กรุณาเลือกวันที่ที่เป็นวันที่ปัจจุบัน'
                }
                break;
            default:
                break;
        }


        if (!isNaN(timeCount)) {
            let max = rentaltype == 'daily' ? 60 : 12
            const unit = rentaltype == 'daily' ? 'วัน' : 'เดือน'
            if (timeCount > max) {
                $('#timeCount').val('')
                $('#checkout').val('')
                validateCount++
                msg = `สามารถเช่า และพักมากสุด ${max} ${unit}`
            }
        }



        if (validateCount > 0) queryFail('ค้นหาห้องพัก', msg, '')

        if (validateCount == 0) {
            if (checkin != '' && !isNaN(timeCount) && unitTime != '') {
                checkout = getDateCheckout(rentaltype, checkin, timeCount)
            }
        }
        console.log('ddd dDdd d', checkout)
        $('#checkout').val(checkout)
    }
    $('#unitTime').val(unit_time)
}