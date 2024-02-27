$('#rentalMonthlySubmit').click(function () {
    const date = $(this).attr('data-date')
    const id = $(this).attr('data-id')
    console.log('rentalMonthlySubmit : ', id, date)
    const rentalMonthlyAmount = parseFloat($('#rentalMonthlyAmount').val())

    const payAtForm = [{
        'formtype': 'number',
        'input': $('#rentalMonthlyAmount'),
        'validate': $('#validate-rentalMonthlyAmount'),
        'msg': 'กรุณาป้อนยอดชำระ'
    },
    {
        'formtype': 'text',
        'input': $('#rentalMonthlyOptionPay'),
        'validate': $('#validate-optionPay'),
        'msg': 'กรุณาเลือกรูปแบบการชำระ'
    }
    ]
    let validateCount = 0
    payAtForm.forEach((fd) => {
        const {
            input,
            validate,
            msg,
            formtype
        } = fd

        if (formtype == 'text') {

            const v = input.val()
            if (v == '') {
                validateCount++
                validateformEmpty(true, validate, msg)
            }
            if (v != '') {
                validateformEmpty(false, validate, msg)
            }

        }

        if (formtype == 'number') {
            const n = parseFloat(input.val())
            if (isNaN(n)) {
                validateCount++
                validateformEmpty(true, validate, msg)
            }
            if (!isNaN(n)) {
                validateformEmpty(false, validate, msg)
            }
        }
    })

    if (validateCount == 0) {
        const data = {
            'date': date,
            'paid': $('#rentalMonthlyPaid').val(),
            'amount': $('#rentalMonthlyAmount').val(),
            'deposit': $('#rentalMonthlyDeductDeposit').val(),
            'status': $('#rentalMonthlyOptionPay').val()
        }
        payMore(id, data)
    }
})