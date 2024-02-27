$('#addCountNumber').click(function () {
  console.log('cllll')
  const roomGroupEl = $('#room-group')
  const roomCount = parseInt(roomGroupEl.attr('data-roomcount'))
  if (roomCount < 12) {
    const rentaltype = $('[name="rentaltype"]').filter(':checked').val()
    const statusDisabled = rentaltype == 'daily' ? 'disabled' : ''
    let roomInputEl = ``
    const count = $("#count-room").val()
    axios.get('/api/building')
      .then((res) => {
        const result = res.data.result
        if (!result) {
          statusErr()
        }
        if (result) {
          const entries = res.data.entries
          let buildingEl
          entries.forEach(e => {
            buildingEl +=
              `<option value="${e.building_id}">${e.building_name}</option>`
          })
          for (let i = 1; i <= count; i++) {
            roomInputEl += `<section class="border p-3 rounded my-2 bg-gradient-white">`
            roomInputEl += `<div class="row my-1 align-items-center justify-content-center">`
            roomInputEl += `<div class="col-lg-4 col-md-6">`
            roomInputEl += `<label>หมายเลขห้อง</label>`
            roomInputEl += `<input type="text" maxlength="45" name="room-number" data-number=""  class="form-control my-1" onkeyup="duplicateRoom(event)" placeholder="หมายเลขห้อง ป้อนไม่เกิน 45 ตัวอักษร">`
            roomInputEl += `</div>`
            roomInputEl += `<div class="col-lg-3 col-md-6">`
            roomInputEl += `<label>อาคาร</label>`
            roomInputEl += `<select class="form-control custom-select my-1" onchange="buildingfloorItems(event)" name ="building">`
            roomInputEl += `<option value="" selected>เลือกอาคาร</option>`
            roomInputEl += `${buildingEl}`
            roomInputEl += `</select>`
            roomInputEl += `</div>`
            roomInputEl += `<div class="col-lg-1 col-md-2">`
            roomInputEl += `<label>ชั้น</label>`
            roomInputEl += `<select class="form-control custom-select my-1" disabled name="buildingfloor">`
            roomInputEl += `<option value="" selected>ชั้น</option>`
            roomInputEl += `</select>`
            roomInputEl += `</div>`
            roomInputEl += `<div class="col-lg-2 col-md-3">`
            roomInputEl += `<label>สถานะ</label>`
            roomInputEl += `<select ${statusDisabled} class="form-control custom-select" name="status">`
            roomInputEl += `<option value="" selected>เลือก</option>`
            roomInputEl += `<option value="available" >ว่าง</option>`
            roomInputEl += `<option value="unavailable">ไมว่าง</option>`
            roomInputEl += `</select>`
            roomInputEl += `</div>`
            roomInputEl += `<div class="col-lg-2 col-md-3">`
            roomInputEl += `<label>การลบข้อมูล</label>`
            roomInputEl += `<select class="form-control custom-select" name="softdelete">`
            roomInputEl += `<option value="" selected>เลือก</option>`
            roomInputEl += `<option value="true">ใช่</option>`
            roomInputEl += `<option value="false">ไม</option>`
            roomInputEl += `</select>`
            roomInputEl += `</div>`
            roomInputEl += `</div>`
            roomInputEl += `<div class="row align-items-center">`
            roomInputEl += `<div class="col-12">`
            roomInputEl += `<div class="form-group row">`
            roomInputEl += `<label class="col-md-3 col-form-label">การประปาส่วนภูมิภาค</label>`
            roomInputEl += `<div class="col-md-5">`
            roomInputEl += `<label class="m-0">เลขที่ผู้ใช้น้ำ</label>`
            roomInputEl += ` <input type="text" class="form-control" placeholder="เลขที่ผู้ใช้น้ำ">`
            roomInputEl += `</div>`
            roomInputEl += `</div>`
            roomInputEl += `<div class="form-group row">`
            roomInputEl += `<label class="col-md-3 col-form-label">การประปานครหลวง</label>`
            roomInputEl += `<div class="col-md-5">`
            roomInputEl += `<label class="m-0">ทะเบียนผู้ใช้น้ำ</label>`
            roomInputEl += `<input type="text" class="form-control" placeholder="ทะเบียนผู้ใช้น้ำ">`
            roomInputEl += `</div>`
            roomInputEl += `</div>`
            roomInputEl += `</div>`
            roomInputEl += `<div class="col-12">`
            roomInputEl += `<div class="form-group row">`
            roomInputEl += `<label class="col-md-3 col-form-label">การไฟฟ้าส่วนภูมิภาค</label>`
            roomInputEl += `<div class="col-md-4">`
            roomInputEl += `<label class="m-0">รหัสเครื่องวัด</label>`
            roomInputEl += `<input type="text" class="form-control" placeholder="รหัสเครื่องวัด">`
            roomInputEl += `</div>`
            roomInputEl += `<div class="col-md-4">`
            roomInputEl += `<label class="m-0">หมายเลขผู้ใช้ไฟฟ้า</label>`
            roomInputEl += `<input type="text" class="form-control" placeholder="หมายเลขผู้ใช้ไฟฟ้า">`
            roomInputEl += `</div>`
            roomInputEl += `</div>`
            roomInputEl += `<div class="form-group row">`
            roomInputEl += `<label class="col-md-3 col-form-label">การไฟฟ้านครหลวง</label>`
            roomInputEl += `<div class="col-md-4">`
            roomInputEl += `<label class="m-0">เลขรับเรื่อง</label>`
            roomInputEl += `<input type="text" class="form-control" placeholder="เลขรับเรื่อง">`
            roomInputEl += `</div>`
            roomInputEl += `<div class="col-md-4">`
            roomInputEl += `<label class="m-0">บัญชีแสดงสัญญา</label>`
            roomInputEl += `<input type="text" class="form-control" placeholder="บัญชีแสดงสัญญา">`
            roomInputEl += `</div>`
            roomInputEl += `</div>`

            roomInputEl += `</div>`
            roomInputEl += `<div class="col-1">`
            roomInputEl += `<button class="my-1 btn bg-gradient-secondary input-room-number" onclick="deleteInputNumber(event)" data-roomId="<%= entries[0].room_id %>" data-number="<%= roomsub[i].room_number_id %>">`
            roomInputEl += `<i class="fa-solid fa-trash-can"></i>`
            roomInputEl += `</button>`
            roomInputEl += `</div>`
            roomInputEl += `</div>`
          }
          roomGroupEl.append(roomInputEl);
          setRoomCount()
        }
      })
      .catch((err) => {
        statusErr()
      })
  }




})

function setRoomCount() {
  const roomGroupEl = $('#room-group')
  const roomCount = roomGroupEl.children().length
  roomGroupEl.attr('data-roomcount', roomCount)
}