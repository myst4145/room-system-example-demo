function getFindByRentalType() {
  const el = $('[name="findByRentalType"]')
  return {
    'element': el,
    'value': el.filter(':checked').val(),
  }
}

function getFindByCheckin() {
  return $('#findByCheckin')
}

function getFindByCheckout() {
  return $('#findByCheckout')
}

function getFindBytimeCount() {
  return $('#findByTimeCount')
}

function getFindByUnitTime() {
  return $('#findByUnitTime')
}
function getFindByRoomType() {
  return $("#findByRoomType")
}

function getFindByBedType() {
  return $("#findByBedType")
}

function getFindByRoomView() {
  return $("#findByRoomView")
}


function currentAmount(act) {
  const rentaltype = $('#rentalType').val()
  console.log('fff', rentaltype)
  let total = 0
  let overpeople = $('[name="overpeople"]').filter(':checked').val()
  const price = parseFloat($('#price').val())
  const timeCount = parseInt($('#timeCount').val())
  if (act == 'overpeople') {
    if (overpeople == 'calculate') {
      const amount_people_stay = parseInt($('#amount-people-stay').val())
      if (amount_people_stay == '' || isNaN(amount_people_stay)) {
        overpeople = undefined
        queryFail('จำนวนคนเข้าพัก', 'กรุณาป้อนจำนวนคนที่เข้าก่อน', '')
        $('[name="overpeople"]').prop('checked', false)
      }
    }
  }


  if (act == 'timecount') {
    if (!rentaltype) {
      $('#timeCount').val('')
      queryFail('รูปแบบการเข้าพัก', 'กรุณาเลือกรูปแบบการเข้าพัก', '')
    }
  }

  if (overpeople == 'calculate') {
    const max_people = parseInt($('#max-people').val())
    const amount_people_stay = parseInt($('#amount-people-stay').val())
    const cost_people_exceed = parseFloat($('#cost-people-exceed').val())
    if (amount_people_stay > max_people) {
      total += (amount_people_stay - max_people) * cost_people_exceed
    }
  }
  if (isNaN(timeCount) && rentaltype!='daily-no-limit') {
    $('[name="overpeople"]').prop('checked', false)
    queryFail('แจ้งเตือน', 'โปรดป้อนจำนวนเวลาการเข้าพัก', '')
  }
  console.log('total', total, price, timeCount)
  if (!isNaN(timeCount)) {
    total = total + (price * timeCount)
    $('#total').val(total)
  }

  if (!rentaltype || isNaN(timeCount) || !overpeople) {
    $('#total').val('')
  }
}

function resrtIntegerInput(input) {
  const n = parseInt($(input).val())
  if (isNaN(n)) $(input).val('')
}

function validUnsigned(input, validateEl) {
  const n = parseInt(input.val())
  let isValid = false
  let msg = ''
  if (!isNaN(n)) {
    if (n < 0) {
      input.val('')
      msg = 'ไม่สามารถป้อนค่าติดลบได้ โปรดป้อนค่าที่เป็นจำนวนเต็มบวก'
      isValid = true
    }
    if (n >= 0) {
      msg = ''
      isValid = false
    }
  }
  validateformEmpty(isValid, validateEl, msg)
  return !isValid
}

$('#amount-people-stay').keyup(function () {
  const result = validUnsigned($(this), $('#validate-amountPeopleStay'))
  if (result) currentAmount('people')
})

getFindBytimeCount().keyup(function () {
  const result = validUnsigned($(this), $('#validate-timeCount'))
  if (result) currentAmount('timecount')
})

$('#deposit').keyup(function () {
  validUnsigned($(this), $('#validate-deposit'))
})
$('#paid').keyup(function () {
  validUnsigned($(this), $('#validate-paid'))
})
$('#total').keyup(function () {
  validUnsigned($(this), $('#validate-total'))
})

$('#insurance-cost').keyup(function () {
  validUnsigned($(this), $('#validate-insurance-cost'))
})

$('[name="overpeople"]').change(function () {
  currentAmount('overpeople')
})




function isValidCheckQueryParamsEqualSearchForm() {
  const checkin = getFindByCheckin().val()
  const checkout = getFindByCheckout().val()
  const rental = getFindByRentalType().value
  const unit_time = getFindByUnitTime().val()
  const time_count = getFindBytimeCount().val()
  const roomType = getFindByRoomType().val()
  const roomView = getFindByRoomView().val()
  const bedType = getFindByBedType().val()

  const params = new URLSearchParams(location.search)
  const checkinParam = params.get('checkin')
  const checkoutParam = params.get('checkout')
  const rentalParam = params.get('rental_type')
  const unitTimeParam = params.get('unit_time')
  const timeCountParam = params.get('time_count')
  const roomTypeParam = params.get('room_type') ?? ''
  const bedTypeParam = params.get('bed_type') ?? ''
  const roomViewParam = params.get('roomview') ?? ''
  const queryForm = [
    { 'form': checkin, 'param': checkinParam },
    { 'form': checkout, 'param': checkoutParam },
    { 'form': rental, 'param': rentalParam },
    { 'form': time_count, 'param': timeCountParam },
    { 'form': unit_time, 'param': unitTimeParam },
    { 'form': roomType, 'param': roomTypeParam },
    { 'form': bedType, 'param': bedTypeParam },
    { 'form': roomView, 'param': roomViewParam },
  ]
  let isEqual = 0
  if (rental != 'daily') {
    queryForm.forEach((d, i) => {
      if ((i == 2) && (d.form != d.param)) isEqual++
    })
  } else {
    queryForm.forEach((d) => {
      const { form, param } = d
      if (form != param) isEqual++
    })
  }

  return isEqual == 0 ? true : false
}








function currentBookingTime(act = '') {
  console.log('ddddddddddddd')
  const rentaltype = getFindByRentalType().value
  const checkinDateFind = getFindByCheckin().val()
  const checkoutDateFind = getFindByCheckout().val()
  const timeCountFind = parseInt(getFindBytimeCount().val())
  const unitTimeFind = getFindByUnitTime().val()
  console.log(rentaltype)
  const checkin_stamp = new Date(`${checkinDateFind} 00:00:00`)
  const now = getTimeStampisNow()
  let checkout = ''
  let msg = ''
  let validateCount = 0

  switch (act) {
    case 'checkin':
      if (checkin_stamp < now) {
        validateCount++
        getFindByCheckin().val('')
        getFindBytimeCount().val('')
        msg += 'กรุณาเลือกวันที่ที่เป็นวันที่ปัจจุบัน'
      }
      break;
    case 'checkout':
      if (rentaltype == 'monthly' && checkoutDateFind != '') {
        const [y, m, dt] = checkoutDateFind.split('-')
        const count_m = sumMonth(y, m).toString()
        if (dt != count_m) {
          validateCount++
          msg = 'โปรดเลือกวันสิ้นเดือน'
        }
      }
      break;
    default:
      break;
  }


  if (!isNaN(timeCountFind)) {
    let max = rentaltype == 'daily' ? 60 : 12
    const unit = rentaltype == 'daily' ? 'วัน' : 'เดือน'
    if (timeCountFind > max) {
      getFindBytimeCount().val('')
      getFindByCheckout().val('')
      validateCount++
      msg = `สามารถเช่า และพักมากสุด ${max} ${unit}`
    }
  }



  if (validateCount > 0) queryFail('ค้นหาห้องพัก', msg, '')

  if (validateCount == 0) {
    if (checkinDateFind != '' && !isNaN(timeCountFind) && unitTimeFind != '') {
      checkout = getDateCheckout(rentaltype, checkinDateFind, timeCountFind)
    }
  }
  console.log('ddd dDdd d', checkout)
  getFindByCheckout().val(checkout)
}


