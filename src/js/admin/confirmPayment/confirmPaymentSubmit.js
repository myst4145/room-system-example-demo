$('#confirmPaymentSubmit').click(function () {
    const confirm = $('[name="confirm"]').filter(':checked').val()
    let validateCount = 0
    const confirmPaymentForm = [{
        'formtype': 'number',
        'role': 'confirm',
        'input': $('#total'),
        'validate': $('#validate-total'),
        'msg': 'กรุณาป้อนยอดรวม'
    }, {
        'formtype': 'number',
        'role': 'confirm',
        'input': $('#paid'),
        'validate': $('#validate-paid'),
        'msg': 'กรุณาป้อนยอดชำระ'
    },
    {
        'formtype': 'number',
        'role': 'confirm',
        'input': $('#overdue'),
        'validate': $('#validate-overdue'),
        'msg': 'กรุณาป้อนยอดค้างชำระ'
    },
    {
        'formtype': 'radio',
        'role': 'confirm',
        'input': $('[name="confirm"]'),
        'validate': $('#validate-confirm'),
        'msg': 'กรุณาเลือกอนุมัติ'
    }, {
        'formtype': 'number',
        'role': 'cancel',
        'input': $('#pay'),
        'validate': $('#validate-pay'),
        'msg': 'กรุณาป้อนยอดเงินที่จ่ายเข้ามา'
    }
    ]
    if (!confirm) {
        queryFail('แจ้งเตือน', 'โปรดเลือกการอนุมัติ')
    }
    const is_role = confirm == 'cancel-approved' ? 'cancel' : 'confirm'
    if (confirm) {
        confirmPaymentForm.filter((r) => r.role == is_role).forEach((fd) => {
            const {
                validate,
                input,
                msg,
                formtype
            } = fd
            console.log(input)
            if (formtype == 'number') {
                const n = parseFloat(input.val())
                if (isNaN(n)) {
                    validateCount++
                    validateformEmpty(true, validate, msg)
                }
                if (!isNaN(n)) {
                    validateformEmpty(false, validate, '')
                }
            }

            if (formtype == 'radio') {
                const c = input.filter(':checked').length
                if (c == 0) {
                    validateCount++
                    validateformEmpty(true, validate, msg)
                }
                if (c > 0) {
                    validateformEmpty(false, validate, msg)
                }
            }
        })


        if (validateCount == 0) {

            const id = $('#confirmPaymentSubmit').attr('data-id')
            axios.patch(`/booking/confirm/${id}`, {
                'confirm': $('[name="confirm"]').filter(':checked').val(),
                'total': $('#total').val(),
                'overdue': $('#overdue').val(),
                'paid': $('#paid').val(),
                'rental_type': $('#rentalType').val(),
                'pay': $('#pay').val()
            })
                .then((response) => {
                    if (response.data.result) {
                        querySuccess('ทำรายการเรียบร้อย')
                    }
                    if (!response.data.result) {
                        queryFail('ยืนยันการชำระเงิน และอนุมัติการจอง', 'เกิดข้อผิดพลาดในการยืนยัน', response.data.err)
                    }
                })
                .catch((err) => {
                    queryFail('ยืนยันการชำระเงิน และอนุมัติการจอง', 'เกิดข้อผิดพลาดในการยืนยัน', err)
                })
        }
    }

})