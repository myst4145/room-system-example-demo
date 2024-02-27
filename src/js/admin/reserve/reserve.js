

$("#roomReset").click(function () {
  $('[name="rentaltypeFind"]').prop('checked', false)
  $("#timeCountFind").val("");
  $("#unitTimeFind").val("");
  $("#room-type").val("");
  $("#bedtype").val("");
  $("#room-view").val("");
  $('#checkinDateFind').val('')
  $('#checkoutDateFind').val('')
});
$("#roomEntries").click(function () {
  const thisPage = window.location.href;
  const route = !thisPage.includes("&") ?
    thisPage :
    thisPage.substring(0, thisPage.indexOf("&"));
  window.location.assign(route);
});

$("#getDataByQueryForm").click(function () {

  const roomType = $("#findByRoomType").val();
  const bedType = $("#findByBedType").val();
  const roomView = $("#findByRoomView").val();
  const unitTime = getFindByUnitTime().val()
  const checkin = getFindByCheckin().val()
  const timeCount = parseInt(getFindBytimeCount().val())
  const rentaltype = getFindByRentalType().value
  const checkout = getFindByCheckout().val()

  let queryString = ``;
  let route = ``
  if (roomType != "") queryString += `&room_type=${roomType}`;
  if (bedType != "") queryString += `&bed_type=${bedType}`;
  if (roomView != "") queryString += `&roomview=${roomView}`;
  const page = thisPage(window.location.href);
  let validateCount = 0

  if (rentaltype == 'daily') {
    const checkin_stamp = getTimeStampByDate(checkin)
    const checkout_stamp = getTimeStampByDate(checkout)

    if (checkout_stamp <= checkin_stamp) {
      validateCount++
      queryFail('เวลาเข้าพัก', 'โปรดเลือกเวลาที่ถูกต้อง', '')
    }
    if (checkin == '' || checkout == '') {
      validateCount++
      queryFail('เวลาเข้าพัก', 'โปรดเลือกเวลาเข้าพัก', '')
    }

    if (validateCount == 0) {
      if (checkin != '' &&
        checkout != '' &&
        rentaltype && !isNaN(timeCount) &&
        unitTime
      ) {
        queryString += `&checkin=${checkin}`
        queryString += `&checkout=${checkout}`
        queryString += `&rental_type=${rentaltype}&time_count=${timeCount}`
        queryString += `&unit_time=${unitTime}`

        route = queryString = `${page}${queryString}`;
        location.assign(route)
      }
    }
  }
  if (rentaltype != 'daily') {
    route = `${page}${queryString}&rental_type=${rentaltype}`
    location.assign(route)
  }

 
});

document.addEventListener('DOMContentLoaded', function () {
  const query = JSON.parse($('#queryParams').val())
  const {
    bed_type,
    room_type,
    roomview,
    checkin,
    checkout,
    rental_type,
    time_count,
    unit_time,
  } = query


  $('#findByCheckin').val(checkin)
  $('#findByCheckout').val(checkout)
  $("#findByTimeCount").val(time_count)
  retainOptionValue($('#findByRoomType'), room_type)
  retainOptionValue($('#findByBedType'), bed_type)
  retainOptionValue($('#findByRoomView'), roomview)
  retainOptionValue($('#findByUnitTime'), unit_time)
  retainRadioValue($('[name="findByRentalType"]'), rental_type)
  createPaginateOnLoad()
})