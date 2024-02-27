$('#rentalAddTimeSubmit').click(function () {
    const id = $(this).attr('data-id')
    const addTimeForm = [
        {
            'name': 'rentaltype',
            ' formtype': 'radio',
            'input': $('[name="rentaltype-addtime"]'),
            'validate': $('#validate-rentaltypeAddTime'),
            'msg': 'กรุณาเลือกรูปแบบการเข้าพัก'
        },
        {
            'name': 'time_count',
            'formtype': 'text',
            'input': $('#timeCount-addTime'),
            'validate': $('#validate-timeCountAddTime'),
            'msg': 'กรุณาป้อนจำนวนเข้าพัก'
        },
        {
            'name': 'paymore',
            'formtype': 'text',
            'input': $('#rentalPayMoreAddTime'),
            'validate': $('#validate-payMoreAddTime'),
            'msg': 'โปรดใส่ข้อมูลให้ครบเพื่อคำนวณยอดชำระ'
        }, {
            'name': 'checkout',
            'formtype': 'text',
            'input': $('#rentalAddTimeLast'),
            'validate': $('#validate-lastAddTime'),
            'msg': 'กรุณาเลือกวันที่เช็คเอ้าท์'
        }

    ]
    let validateCount = 0
    addTimeForm.forEach((fd) => {
        const { validate, msg, input, formtype } = fd

        if (formtype == 'text') {
            const v = input.val().trim()
            if (v == '') {
                validateCount++
                validateformEmpty(true, validate, msg)
            }
            if (v != '') {
                validateformEmpty(false, validate, '')
            }
        }
        if (formtype == 'time') {
            let tCount = 0
            $.each(input, (i, t) => {
                if ($(t).val().trim() == '') tCount++
            })

            if (tCount > 0) {
                validateCount++
                validateformEmpty(true, validate, msg)
            }
            if (tCount == 0) validateformEmpty(false, validate, '')
        }
        if (formtype == 'radio') {
            const c = input.filter(':checked').length
            if (c == 0) {
                validateCount++
                validateformEmpty(true, validate, msg)
            }
            if (c > 0) {
                validateformEmpty(false, validate, '')
            }
        }
    })
    if (validateCount == 0) {
        const unit_time = $('#rentalAddTimeSubmit').attr('data-unittime')
        const amount = unit_time == 'hours'
            ? $('#costExpenseTimeAddTime')
            : $('#priceAddTime')
        const data = {
            'old_checkout': $('#rentalAddTime').val(),
            'old_checkout_time': $('#oldCheckoutTime').val(),
            'checkout': $('#rentalAddTimeLast').val(),
            'checkout_time': $('#lastCheckoutTime').val(),
            'time_count': $('#timeCount-addTime').val(),
            'unit_time': unit_time,
            'paymore': $('#rentalPayMoreAddTime').val(),
            'amount': parseFloat(amount.val())
        }
        console.log(data)
        axios.patch(`/booking/addime/${id}`, data)
            .then((response) => {
                console.log(response)
                if (response.data.result) querySuccess('เพิ่มเวลาพักเรียบร้อย')
                if (!response.data.result) {
                    let msg = response.data.valid ? 'ไม่สามารถเพิ่มเวลาได้เนื่องจากมีคนจอง หรือ กำลังเข้าพักอยู่' : 'ไม่สามารถเพิ่มเวลาได้'
                    queryFail('เพิ่มเวลาพัก', msg, response.data.err)

                }
            }).catch((err) => queryFail('เพิ่มเวลาพัก', 'เกิดข้อผิดพลาด', err))
    }
})