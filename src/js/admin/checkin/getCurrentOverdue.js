function getCurrentOverdue() {
    const remain = parseFloat($('#remain').val())
    const pay = parseFloat($('#pay').val())
    let overdue = remain
    let pay_retain = ''
    let isPay = true
    if (isNaN(overdue) || isNaN(pay)) {
        isPay = false
        queryFail('ชำระเงิน', 'โปรดป้อนรหัสข้อมูลห้องพัก และ หมายเลขห้องพักก่อน', '')
    }
    if (!isNaN(remain) && !isNaN(pay)) {
        if (pay > remain) {
            isPay = false
            queryFail('ชำระเงิน', 'โปรดชำระเงินตามยอดที่ค้างชำระ', '')
        }
        if (pay <= remain) {
            overdue = remain - pay
        }
    }
    if (!isPay) $('#pay').val('')
    $('#overdue').val(overdue)
}