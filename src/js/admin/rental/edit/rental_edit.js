{/* <input type="text" id="retain-over-people" value="<%= booking[0].over_people_type %>">
<input type="text" id="retain-itemtype" value="<%= booking[0].itemtype %>">
<input type="text" id="retain-rental-type" value="<%= booking[0].rental_type %>">
<input type="text" id="retain-payment-type" value="<%= booking[0].payment_type %>">
<input type="text" id="retain-payment" value="<%= booking[0].payment %>">

addEventListener("DOMContentLoaded", (event) => {}); */}
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
    if (rentaltype == 'monthly') {
        console.log('สร้าง table')
        createTracsactionTable()
    }
    $('#total').val(total)

}

function getCurrentTimeCountByCheckout() {
    const checkin = $('#checkin').val()
    const checkout = $('#checkout').val()
    const date_stamp = getDateStampMonthly(checkin, checkout)
    const time_count = date_stamp.length
    $('#timeCount').val(time_count)
}
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

function createTracsactionTable() {
    const rentaltype = $('#rentalType').val()
    const checkin = $('#checkin').val()
    const checkout = $('#checkout').val()

    switch (rentaltype) {
        case 'monthly':
            let transaction = getDateStampMonthly(checkin, checkout)
                .map((t) => {
                    return {
                        'date': `${t}`,
                        'paid': 0,
                        'pay_at': '',
                        'status': 'progress'
                    }
                })

            console.log('trsa', transaction)

            const transactionTotal = transaction
                .map((t) => parseFloat(t.paid))
                .reduce((prev, current) => prev + current, 0)
            $('#paid').val(transactionTotal)
            if (transaction.length > 0) {
                createTransactionByBtn(transaction, $('#transactionTable'))
                $('#transactionOldBefore').html(JSON.stringify(transaction))
                $('#transactionOldAfter').html(JSON.stringify(transaction))
            }

            time_count = transaction.length
            break;
        default:
            break;
    }


}





function currentTransactionPaid() {
    const transactionPaidEl = $('[name="transaction-paid"]')
    const transactionPaid = $.map(transactionPaidEl, (el) => parseFloat($(el).val()))
    const transactionPaidTotal = transactionPaid.reduce((prev, current) => prev + current, 0)
    const totalEl = $('#total')
    const total = parseInt(totalEl.val())
    const overdue = total - transactionPaidTotal
    $('#overdue').val(overdue > 0 ? overdue : 0)
    $('#paid').val(transactionPaidTotal)
}

document.addEventListener('DOMContentLoaded', () => {
    const retainOverPeople = $('#retain-over-people').val()
    const retainItemtype = $('#retain-itemtype').val()
    const retainRentalType = $('#retain-rental-type').val()
    const retainPaymentType = $('#retain-payment-type').val()
    const retainPayment = $('#retain-payment').val()
    const retainRentalAccept = $('#retain-RentalAccept').val()
    const status = $('#status').data('status')


    $('#status').val(status)

    $.each($('[name="overpeople"]'), (idx, el) => {
        if ($(el).val() == retainOverPeople) {
            $(el).prop('checked', true)
        }
    })

    $.each($('[name="itemtype"]'), (idx, el) => {
        if ($(el).val() == retainItemtype) {
            $(el).prop('checked', true)
        }
    })


    $.each($('#rentalType').children(), (idx, el) => {
        if ($(el).val() == retainRentalType) {
            $(el).prop('selected', true)
        }
    })
    $.each($('[name="rental-accept"]'), (idx, el) => {
        if ($(el).val() == retainRentalAccept) {
            $(el).prop('checked', true)
        }
    })
    if (retainRentalType == '') {
        $('#rentalType').prop('disabled', false)
    }
    $.each($('[name="paymenttype"]'), (idx, el) => {
        if ($(el).val() == retainPaymentType) {
            $(el).prop('checked', true)
        }
    })

    $.each($('[name="payment"]'), (idx, el) => {
        if ($(el).val() == retainPayment) {
            $(el).prop('checked', true)
        }
    })


    const unitTime = $('#unitTime').data('unittime')
    console.log(checkin, checkout)

    $('#unitTime').val(unitTime)
})