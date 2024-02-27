document.addEventListener('DOMContentLoaded', () => {
    createPaginateOnLoad()
})
$('[name="confirm"]').change(function () {
    const v = $(this).val()
    const is_confirm_display = v != 'cancel-approved' ? 'block' : 'none'
    const is_cancel_display = v == 'cancel-approved' ? 'block' : 'none'
    clearValidateErr()
    $('#paymentCancel').css('display', is_cancel_display)
    $('#paymentConfirm').css('display', is_confirm_display)

})
function currentPaid() {
    const total = parseFloat($('#total').val())
    const paid = parseFloat($('#paid').val())

    if (!isNaN(total) && !isNaN(paid)) {
        let overdue = total - paid
        if (overdue < 0) {
            overdue = parseFloat($('#overdue').attr('data-overdue'))
            $('#paid').val('')
            queryFail('ยืนการชำระเงิน', 'โปรดป้อนข้อมูลที่ถูกต้อง', '')
        }
        $('#overdue').val(overdue)
    }

}


$('[name="confirm-payment"]').click(function () {
    const id = $(this).attr('data-id')
    clearValidateErr()
    axios.get(`/booking/data/${id}`)
        .then((response) => {
            if (response.data.result) {

                const entries = response.data.entries
                const paid = entries[0].rental_type == 'daily' ?
                    entries[0].total :
                    entries[0].deposit
                console.log(paid, entries[0].rental_type)
                const overdue = entries[0].overdue
                retainOptionValue($('#rentalType'), entries[0].rental_type)
                $('#total').val(paid)
                $('#overdue').val(paid)
                $('#overdue').attr('data-overdue', overdue)
                $('#confirmPaymentSubmit').attr('data-id', id)
                $('#cancelPaymentSubmit').attr('data-id', id)
                $('#slipPayment').attr('src', `/src/img/slip_payment/${entries[0].statement}`)
                $('#dailyConfirmPaymentModal').modal('show')
            }
            if (!response.data.result) {
                queryFail('แจ้งเตือน', 'เกิดข้อผิดพลาดในการยืนยัน', response.data.err)
            }
        })
        .catch((err) => {
            queryFail('ข้อผิดพลาด', err, '')
        })
})