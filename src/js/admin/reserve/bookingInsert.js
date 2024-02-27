$('#bookingSubmit').click(function () {
  const rentaltype = $('#rentalType').val()
  console.log(rentaltype)
  const bookingFormData = [{
    'name': 'payment',
    'input': $('[name="payment"]'),
    'validate': $('#validate-payment'),
    'form_type': 'radio',
    'msg': 'กรุณาเลือกวิธีการชำระเงิน'
  }, {
    'name': 'timecount',
    'rental_type': 'daily',
    'input': $('#timeCount'),
    'validate': $('#validate-timeCount'),
    'form_type': 'integer',
    'msg': 'กรุณาป้อนจำนวนเวลาพัก'
  }, {
    'name': 'person_count',
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
    'msg': 'กรุณาป้อนยอดชำระ'
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
    'rental_type': 'daily',
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
    'name': 'rentaltype',
    'input': $('#rentalType'),
    'validate': $('#validate-rentaltype'),
    'form_type': 'text',
    'msg': 'กรุณาเลือกประเภทการเช่า'
  }, {
    'name': 'itemtype',
    'input': $('[name="itemtype"]'),
    'validate': $('#validate-itemtype'),
    'form_type': 'radio',
    'msg': 'กรุณาเลือกประเภทรายการ'
  }, {
    'name': 'overpeople',
    'input': $('[name="overpeople"]'),
    'validate': $('#validate-overpeople'),
    'form_type': 'radio',
    'msg': 'กรุณาเลือกรูปแบบคิดค่าจำนวนคนเกิน'
  }, {
    'name': 'deposit',
    'input': $('#deposit'),
    'validate': $('#validate-deposit'),
    'form_type': 'text',
    'msg': 'กรุณาป้อนค่ามัดจำ'
  }, {
    'name': 'insurance_cost',
    'input': $('#insurance-cost'),
    'validate': $('#validate-insurance-cost'),
    'form_type': 'text',
    'msg': 'กรุณาป้อนค่าประกันห้อง'
  }]

  let emptyCount = 0
  bookingFormData.forEach((fd) => {
    const {
      input,
      validate,
      msg,
      form_type,
      name
    } = fd


    if (form_type == 'radio') {
      const c_empty = $(input).filter(':checked').length
      if (c_empty == 0) {
        validateformEmpty(true, validate, msg)
        emptyCount++
      } else if (c_empty == 1) {
        validateformEmpty(false, validate, msg)
      }

    }

    if (form_type == 'integer') {

      const n = parseInt($(input).val().trim())
      if (isNaN(n)) {

        if (name == 'timecount'
          && rentaltype != 'daily-no-limit') {
          emptyCount++
          validateformEmpty(true, validate, 'ป้อนข้อมูล หรือ ป้อนค่าเป็นตัวเลข')
        }

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
      let is_pass = true
      if (val == '') {
        if (name == 'checkout'
          && rentaltype == 'daily-no-limit') {
          is_pass = false
        }
        if (is_pass) {
          validateformEmpty(true, validate, msg)
          emptyCount++
        }


      } else {
        validateformEmpty(false, validate, msg)
      }
    }


  })



  const total = parseFloat($('#total').val())

  if (emptyCount == 0) {
    if (isNaN(total)) {
      queryFail('ยอดรวม', 'กรุณาป้อนข้อมูลเพื่อทราบยอดการชำระเงิน', '')
    }
    const fd = {
      'room_id': $('#room-id').val(),
      'room_number_id': $('#room-id').attr('data-number-id'),
      'payment': $('[name="payment"]').filter(':checked').val(),
      'time_count': $('#timeCount').val(),
      'unit_time': $('#unitTime').val(),
      'amount_people_stay': $('#amount-people-stay').val(),
      'phone': $('#phone').val(),
      'fname': $('#fname').val(),
      'lname': $('#lname').val(),
      'checkin': $('#checkin').val(),
      'checkout': $('#checkout').val(),
      'paid': $('#paid').val(),
      'deposit': $('#deposit').val(),
      'rental_type': $('#rentalType').val(),
      'itemtype': $('[name="itemtype"]').filter(':checked').val(),
      'over_people_type': $('[name="overpeople"]').filter(':checked').val(),
      'emp_id': $('#employeeId').val(),
      'total': $('#total').val(),
      'insurance_cost': $('#insurance-cost').val(),
      'other': $('#other').val()
    }

    axios.post('/booking/insert', fd)
      .then((res) => {
        const { result } = res.data
        console.log(res.data)
        if (result) {
          if (res.data.is_valid == false) {
            Swal.fire({
              icon: "error",
              title: "แจ้งเตือน",
              text: "ห้องนี้มีคนจองแล้ว โปรดจองห้องอื่น",
            }).then((result) => {
              if (result.isConfirmed) {
                location.reload()
              }
            });

          } else {
            querySuccess('จองเรียบร้อย')
          }

        } else {
          queryFail('ลงทะเบียนเข้าพัก', 'เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้งภายหลัง', res.data.err)
        }
      })
      .catch((err) => {
        console.log(err)
        statusErr()
      })
  }
})