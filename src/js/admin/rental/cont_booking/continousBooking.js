$('#continousBooking').click(function () {
    const bookingFormData = [{
        'name': 'time_count',
        'input': $('#timeCount'),
        'validate': $('#validate-timeCount'),
        'form_type': 'integer',
        'msg': 'กรุณาป้อนจำนวนเวลาพัก'
    }, {
        'name': 'phone',
        'input': $('#phone'),
        'validate': $('#validate-phone'),
        'form_type': 'text',
        'msg': 'กรุณาป้อนเบอร์ติดต่อ'
    }, {
        'name': 'unit_time',
        'input': $('#unitTime'),
        'validate': $('#validate-unitTime'),
        'form_type': 'select',
        'msg': 'กรุณาป้อนเลือกหน่วย'
    }, {
        'name': 'paid',
        'input': $('#paid'),
        'validate': $('#validate-paid'),
        'form_type': 'text',
        'msg': 'กรุณาป้อนยอดชำระ หากไม่มีโปรดใส่ค่าเป็น 0'
    }, {
        'name': 'fname',
        'input': $('#fname'),
        'validate': $('#validate-fname'),
        'form_type': 'text',
        'msg': 'กรุณาป้อนชื่อ'
    }, {
        'name': 'lname',
        'input': $('#lname'),
        'validate': $('#validate-lname'),
        'form_type': 'text',
        'msg': 'กรุณาป้อนนามสกุล'
    }, {
        'name': 'checkin',
        'input': $('#checkin'),
        'validate': $('#validate-checkin'),
        'form_type': 'text',
        'msg': 'กรุณาป้อนวันที่เข้าพัก'
    },

    {
        'name': 'checkout',
        'input': $('#checkout'),
        'validate': $('#validate-checkout'),
        'form_type': 'text',
        'msg': 'กรุณาป้อนวันที่ออก'
    },
    {
        'name': 'emp_id',
        'input': $('#employeeId'),
        'validate': $('#validate-employeeId'),
        'form_type': 'text',
        'msg': 'กรุณาป้อนรหัสพนักงาน'
    }, {
        'name': 'rentalType',
        'input': $('#rentalType'),
        'validate': $('#validate-rentaltype'),
        'form_type': 'text',
        'msg': 'กรุณาเลือกประเภทการเข่า'
    }, {
        'name': 'deposit',
        'input': $('#deposit'),
        'validate': $('#validate-deposit'),
        'form_type': 'text',
        'msg': 'กรุณาป้อนค่ามัดจำล่วงหน้า  หากไม่มีโปรดใส่ค่าเป็น 0'
    }, {
        'name': 'insurance_cost',
        'input': $('#insuranceCost'),
        'validate': $('#validate-insuranceCost'),
        'form_type': 'text',
        'msg': 'กรุณาป้อนค่าประกันห้อง  หากไม่มีโปรดใส่ค่าเป็น 0'
    }, {
        'name': 'total',
        'input': $('#total'),
        'validate': $('#validate-total'),
        'form_type': 'text',
        'msg': 'กรุณาป้อนจำนวนยอดรวม หากไม่มีโปรดใส่ค่าเป็น 0 '
    }, {
        'name': 'overdue',
        'input': $('#overdue'),
        'validate': $('#validate-overdue'),
        'form_type': 'text',
        'msg': 'กรุณาป้อนจำนวนค้างชำระ หากไม่มีโปรดใส่ค่าเป็น 0 '
    }, {
        'name': 'status',
        'input': $('#status'),
        'validate': $('#validate-status'),
        'form_type': 'text',
        'msg': 'กรุณาเลือกสถานะ'
    },
    ]

    let emptyCount = 0
    bookingFormData.forEach((fd) => {
        const {
            input,
            validate,
            msg,
            form_type
        } = fd

        if (form_type == 'radio') {
            const c_empty = $(input).filter(':checked').length
            if (c_empty == 0) {
                console.log('vla')
                validateformEmpty(true, validate, msg)
                emptyCount++
            } else if (c_empty == 1) {
                validateformEmpty(false, validate, msg)
            }

        }
        if (form_type == 'time') {
            let tCount = 0
            $.each(input, (i, t) => {
                if ($(t).val().trim() == '') tCount++
            })

            if (tCount > 0) {
                emptyCount++
                validateformEmpty(true, validate, msg)
            }
            if (tCount == 0) validateformEmpty(false, validate, '')
        }
        if (form_type == 'integer') {
            const n = parseInt($(input).val().trim())
            if (isNaN(n)) {
                console.log('vla')
                validateformEmpty(true, validate, 'ป้อนข้อมูล หรือ ป้อนค่าเป็นตัวเลข')
                emptyCount++
            } else {
                if (n == 0) {
                    validateformEmpty(true, validate, 'ป้อนค่าที่มีมากกว่า 0 ')
                } else {
                    validateformEmpty(false, validate, '')
                }

            }
        }

        if (form_type == 'text' || form_type == 'select' || form_type == 'number') {
            const val = $(input).val().trim()
            if (val == '') {
                validateformEmpty(true, validate, msg)
                emptyCount++
            } else {
                validateformEmpty(false, validate, msg)
            }
        }
    })


    console.log(emptyCount)

    if (emptyCount == 0) {
        const fd = {
            'room_id': $('#room-id').val(),
            'room_number_id': $('#room-number-id').val(),
            'time_count': $('#timeCount').val(),
            'unit_time': $('#unitTime').val(),
            'phone': $('#phone').val(),
            'fname': $('#fname').val(),
            'lname': $('#lname').val(),
            'checkin': $('#checkin').val().trim(),
            'overdue': $('#overdue').val(),
            'checkout': $('#checkout').val().trim(),
            'paid': $('#paid').val(),
            'deposit': $('#deposit').val(),
            'rental_type': $('#rentalType').val(),
            'insurance_cost_refund': $('#insuranceCostRefund').val(),
            'emp_id': $('#employeeId').val(),
            'total': $('#total').val(),
            'insurance_cost': $('#insuranceCost').val(),
            'other': $('#other').val().trim(),
        }

        axios.post(`/booking/continous/insert`, fd)
            .then((res) => {
                const {
                    result
                } = res.data
                if (result) querySuccess('บันทึกข้อมูลสำเร็จ')
                if (!result) {
                    console.log(res.data.err)
                    queryFail('แก้ไขข้อมูลการจอง', 'เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้', res.data.err)
                }

            })
            .catch((err) => {
                queryFail('แก้ไขข้อมูลการจอง', 'เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้', err)
            })
    }

})


$('button[name="continuousBookingModal"]').click(function () {
    $('#continuousBookingModal').modal('show')
})