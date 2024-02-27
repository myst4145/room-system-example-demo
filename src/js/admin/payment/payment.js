document.addEventListener('DOMContentLoaded', () => {
    createPaginateOnLoad()
})
$('[name="open-payment-modal"]').click(function () {
    const act = $(this).data('act')
    const id = $(this).data('id')
    switch (act) {
        case 'add':
            $('#bankname').val('')
            $('#bank-branch').val('')
            $('#bank-number').val('')
            $('#account-name').val('')
            $('.empty-validate').css('display', 'none')
            $('#payment-submit').attr('data-id', '')
            $('#payment-submit').attr('data-act', 'insert')
            $('#payment-modal').modal('show')
            break
        case 'edit':
            $('#payment-submit').attr('data-id', id)
            $('#payment-submit').attr('data-act', 'update')
            getPaymentById(id)
            break
        default:
            break;
    }
})

$('.bank-switch').change(function () {
    const id = $(this).val()
    const status = $(this).is(':checked') ? 'on' : 'off'

    axios.patch(`/payment/switch/${id}`, {
        'status': status
    })
        .then((res) => {
            const result = res.data.result
            if (!result) {
                const err = res.data.err
                queryFail('ปิด - เปิด สถานะการชำนะเงิน', 'การอัพเดตล้มเหลว', err)
                $(this).prop('checked', !$(this).is(':checked'))
            }
        })
        .catch((err) => {
            queryFail('ข้อผิดพลาด', err, '')
        })
})


$('[name="payment-delete"]').click(function () {
    const id = $(this).attr('data-id')
    confirm('ลบช่องทางการขำระเงิน', 'คุณต้องการลบรายการนี้ใช่ หรือ ไม่ ?')
        .then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/payment/delete/${id}`)
                    .then((res) => {
                        const result = res.data.result
                        if (result) {
                            querySuccess('ลบเรียบร้อย', 1200)
                        } else if (!result) {
                            const err = res.data.err
                            queryFail('ลบข้อมูลช่องทางการชำระเงิน', 'ลบไม่สำเร็จ', err)
                        }
                    })
                    .catch((err) => {
                        queryFail('ข้อผิดพลาด', err, '')
                    })
            }
        })

})

