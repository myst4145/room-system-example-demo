
$('#bookingSubmit').click(function () {
    const bookingFormData = [
        {
            'name': 'rental_accept',
            'input': $('[name="rental-accept"]'),
            'validate': $('#validate-rentalAccept'),
            'form_type': 'radio',
            'msg': 'กรุณาเลือกอนุญาติการต่อสัญญาต่อเนื่อง'
        },
        {
            'name': 'payment',
            'input': $('[name="payment"]'),
            'validate': $('#validate-payment'),
            'form_type': 'radio',
            'msg': 'กรุณาเลือกวิธีการชำระเงิน'
        }, {
            'name': 'time_count',
            'input': $('#timeCount'),
            'validate': $('#validate-timeCount'),
            'form_type': 'integer',
            'msg': 'กรุณาป้อนจำนวนเวลาพัก'
        }, {
            'name': 'amount_people_stay',
            'input': $('#amount-people-stay'),
            'validate': $('#validate-amountPeopleStay'),
            'form_type': 'number',
            'msg': 'กรุณาป้อนจำนวนคนเข้าพัก'
        }, {
            'name': 'phone',
            'input': $('#phone'),
            'validate': $('#validate-phone'),
            'form_type': 'text',
            'msg': 'กรุณาป้อนเบอร์ติดต่อ'
        }, {
            'name': 'unit_times',
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
        },
        {
            'name': 'insurance_cost_refund',
            'input': $('#insuranceCostRefund'),
            'validate': $('#validate-insuranceCostRefund'),
            'form_type': 'text',
            'msg': 'กรุณาป้อนจำนวนค่าประกันห้องที่คืน หากไม่มีโปรดใส่ค่าเป็น 0 '
        }, {
            'name': 'damages',
            'input': $('#damages'),
            'validate': $('#validate-damages'),
            'form_type': 'text',
            'msg': 'กรุณาป้อนจำนวนค่าเสียหาย หากไม่มีโปรดใส่ค่าเป็น 0 '
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
        },]
    const rental_type = $('#rentalType').val()
    let addtime = []
    const addTimeTotal = $('[name="addtime-total"]')
    const addtimeCheckout = $('[name="addtime-checkout"]')
    const addTimeUnitTime = $('[name="addtime-unit-time"]')
    for (let i = 0; i < addTimeTotal.length; i++) {
        const total = $(addTimeTotal[i]).val()
        const checkout = $(addtimeCheckout[i]).val().replaceAll('T', ' ')
        const [count, unit] = $(addTimeUnitTime[i]).val().split('-')
        const data = {
            'unit_time': unit,
            'time_count': count,
            'total': total,
            'last_checkout': checkout,
        }
        addtime.push(data)
    }
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
            if (fd.name == 'checkout' && rental_type == 'daily-no-limit') {
                return
            } else {
                const val = $(input).val().trim()
                if (val == '') {
                    console.log('vla')
                    validateformEmpty(true, validate, msg)
                    emptyCount++
                } else {
                    validateformEmpty(false, validate, msg)
                }
            }

        }
    })





    if (emptyCount == 0) {

        const transactions = JSON.parse($('#transactionOldAfter').val())
            .map((t) => {
                return {
                    date: t.date,
                    paid: t.paid,
                    pay_at: t.pay_at,
                    status: t.status
                }
            })
        const booking_id = $('#booking-id').val()
        const fd = {
            'room_number_id': $('#room-number-id').val(),
            'payment': $('[name="payment"]').filter(':checked').val(),
            'time_count': $('#timeCount').val(),
            'unit_time': $('#unitTime').val(),
            'amount_people_stay': $('#amount-people-stay').val(),
            'phone': $('#phone').val(),
            'fname': $('#fname').val(),
            'lname': $('#lname').val(),
            'checkin': $('#checkin').val().trim(),
            'overdue': $('#overdue').val(),
            'checkout': $('#checkout').val().trim(),
            'paid': $('#paid').val(),
            'deposit': $('#deposit').val(),
            'rental_type': $('#rentalType').val(),
            'damages': $('#damages').val(),
            'insurance_cost_refund': $('#insuranceCostRefund').val(),
            'emp_id': $('#employeeId').val(),
            'total': $('#total').val(),
            'insurance_cost': $('#insuranceCost').val(),
            'other': $('#other').val().trim(),
            'transaction': transactions,
            'status': $('#status').val(),
            'addtime': addtime,
            'cont_rental_accept' : $('[name="rental-accept"]').filter(':checked').val()
        }

        axios.put(`/booking/update/${booking_id}`, fd)
            .then((res) => {
                const { result } = res.data
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