function currentPaidAmount() {
    const total = parseFloat($('#total').val())
    const paid = parseFloat($('#paid').val())
    let overdue = 0
    let msg = ''
    let validateCount = 0
    if (isNaN(total)) {
        msg = 'โปรดป้อนยอดรวมก่อน'
        validateCount++
    }

    if (!isNaN(total)) {
        if (total < paid) {
            msg = 'ยอดที่ชำระต้องไม่มากกว่ายอดรวม โปรดป้อนยอดชำระที่ถูกต้อง'
            validateCount++
        }
        if (total >= paid) {
            overdue = total - paid
        }
    }
    if (validateCount > 0) queryFail('แจ้งเตือน', msg, '')

    $('#overdue').val(overdue)
}