$('#additionalTransactionSubmit').click(function () {
    const electricityTransactionForm = [{
        'formtype': 'text',
        'input': $('#status'),
        'validate': $('#validate-status'),
        'msg': 'กรุณาเลือกสถานะ'
    },
    {
        'formtype': 'text',
        'input': $('#month'),
        'validate': $('#validate-month'),
        'msg': 'กรุณาเลือกเดือน'
    }, {
        'formtype': 'year',
        'input': $('#year'),
        'validate': $('#validate-year'),
        'msg': 'กรุณาป้อนปี'
    },
    {
        'formtype': 'radio',
        'input': $('[name="type"]'),
        'validate': $('#validate-type'),
        'msg': 'กรุณาเลือกรูปแบบค่าชำระ'
    },
    {
        'formtype': 'number',
        'input': $('#total'),
        'validate': $('#validate-total'),
        'msg': 'กรุณาป้อนยอดรวม'
    },
    {
        'formtype': 'number',
        'input': $('#paid'),
        'validate': $('#validate-paid'),
        'msg': 'กรุณาป้อนยอดที่ชำระ'
    },
    {
        'formtype': 'number',
        'input': $('#overdue'),
        'validate': $('#validate-overdue'),
        'msg': 'กรุณาป้อนยอดค้างชำระ'
    }
    ]
    let validateCount = 0
    electricityTransactionForm.forEach((fd) => {
        let {
            msg,
            input,
            validate,
            formtype
        } = fd
        let is_valid = false
        if (formtype == 'text') {
            const v = input.val().trim()
            if (v == '') {
                validateCount++
                is_valid = true
            }
        }
        if (formtype == 'number') {
            const n = parseFloat(input.val().trim())
            if (isNaN(n)) {
                validateCount++
                is_valid = true
            }
        }
        if (formtype == 'radio') {
            const c = input.filter(':checked').length
            if (c == 0) {
                validateCount++
                is_valid = true
            }
        }
        if (formtype == 'year') {
            const y = input.val().trim()
            if (y == '') {
                validateCount++
                is_valid = true
            } else {
                if (!y.includes('.') || !y.includes(',')) {
                    if (y.length < 4) {
                        validateCount++
                        is_valid = true
                        msg = 'กรุณาป้อนให้ครบ 4 หลัก'
                    } else if (y.length == 4) {
                        let isNum = 0
                        for (let i = 0; i < y.length; i++) {
                            if (isNaN(y[i])) isNum++
                        }
                        if (isNum > 0) {
                            validateCount++
                            is_valid = true
                            msg = 'กรุณาป้อนเป็นตัวเลขทั้ง 4 หลัก'
                        }
                    }
                }
            }
        }
        validateformEmpty(is_valid, validate, msg)
    })

    if (validateCount == 0) {
        const id = $('#electricityTransactionSubmit').attr('data-id')
        const data = {
            'status': $('#status').val(),
            'month': $('#month').val(),
            'year': $('#year').val(),
            'type': $('[name="type"]').filter(':checked').val(),
            'total': $('#total').val(),
            'paid': $('#paid').val(),
            'overdue': $('#overdue').val()
        }
        axios.patch(`/additionalcost/transaction/update/${id}`, data)
            .then((response) => {
                if (response.data.result) querySuccess("บันทึกเรียบร้อย")
                if (!response.data.result) queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', response.data.err)
            })
            .catch((err) => {
                queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', err)
            })
    }
})