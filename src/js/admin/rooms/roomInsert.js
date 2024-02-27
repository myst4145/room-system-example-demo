$('#insert-room').click(() => {


  const formAndValidateData = [
    {
      name: "rental_type",
      formtype: "radio",
      input: $('[name="rentaltype"]'),
      validate: $("#validate-rentaltype"),
      msg: "กรุณาเลือกรูปแบบเตียง",
    },
    {
      name: "number",
      formtype: "text",
      input: [$('[name="room-number"]'), $('[name="building"]'), $('[name="buildingfloor"]')],
      validate: $("#validate-roomnumber"),
      isValidate: false,
      msg: "กรุณากรอกหมายเลขห้อง",
    },
    {
      name: "bed_amount",
      formtype: "number",
      input: $('#bedAmount'),
      validate: $("#validate-bedAmount"),
      msg: "กรุณาป้อนจำนวนเตียง",
    },
    {
      name: "price",
      formtype: "number",
      input: $('#price'),
      validate: $("#validate-price"),
      msg: "กรุณาป้อนราคารายเดือน",
    },

    {
      name: "cost_expense_time",
      formtype: "number",
      input: $('#cost-expense-time'),
      validate: $("#validate-costExpenseTime"),
      msg: "กรุณาป้อนค่าต่อเวลา",
    },
    {
      name: "toilet",
      formtype: "number",
      input: $('#toiletCount'),
      validate: $("#validate-toilet-count"),
      msg: "กรุณาป้อนจำนวนห้องน้ำ",
    },
    {
      name: "damage",
      formtype: "number",
      input: $('#damage'),
      validate: $("#validate-damage"),
      msg: "กรุณาป้อนค่าทรัพย์สินเสียหาย",
    },
    {
      name: "type",
      formtype: "option",
      input: $('#roomType'),
      validate: $("#validate-roomtype"),
      msg: "กรุณาเลือกประเภทห้อง",
    },
    {
      name: "bed",
      formtype: "option",
      input: $('#bedType'),
      validate: $("#validate-bedtype"),
      msg: "กรุณาเลือกประเภทเตียง",
    },
    {
      name: "view",
      formtype: "option",
      input: $('#roomView'),
      validate: $("#validate-roomview"),
      msg: "กรุณาเลือกประเภทวิวห้อง",
    },

    {
      name: "exampleroom",
      formtype: "single_file",
      input: $("#room-upload"),
      validate: $("#validate-roomupload"),
      msg: "กรุณาอัพโหลดรูปภาพตัวอย่างห้อง",
    },
    {
      name: "exampleroom",
      formtype: "multi_file",
      input: $("#room-upload"),
      validate: $("#validate-roomupload"),
      msg: "กรุณาอัพโหลดรูปภาพตัวอย่างห้อง",
    },
  ];

  let emptyCount = 0;
  formAndValidateData.forEach((fd) => {
    const {
      formtype,
      validate,
      msg,
      name,
      input
    } = fd;

    if (name == "number") {
      const [numberroom, building, buildingFloor] = fd.input
      let emptyItem = []
      const mapnumber = $.map(numberroom, (e, i) => $(e).val().trim())
      const mapbuilding = $.map(building, (e, i) => $(e).val().trim())
      const mapbuildingFloor = $.map(buildingFloor, (e, i) => $(e).val().trim())
      for (let i = 0; i < mapnumber.length; i++) {

        const n = mapnumber[i]
        const b = mapbuilding[i]
        const bf = mapbuildingFloor[i]
        if (i == 0) {
          if (n == '' || b == '' || bf == '') {
            emptyItem.push(false)
          } else if (n != '' && b != '' && bf != '') {
            emptyItem.push(true)
          }
        } else {
          if (n == '' && b == '' && bf == '') {
            emptyItem.push(true)
          } else if (n != '' && b != '' && bf != '') {
            emptyItem.push(true)
          } else {
            emptyItem.push(false)
          }
        }

      }
      const issetItemsCount = emptyItem.filter((v, i) => v == true).length

      if (issetItemsCount == 0) {
        fd.isValidate = false
        emptyCount++
        validateformEmpty(true, validate, 'กรุณากรอกข้อมูลอย่างน้อย 1 รายการ');
      }

      if (issetItemsCount >= 1) {
        if (emptyItem.includes(false) == true) {
          fd.isValidate = false
          emptyCount++
          validateformEmpty(true, validate, 'กรุณากรอกข้อมูลให้ครบ');
        } else {
          fd.isValidate = true
          validateformEmpty(false, validate, '');
        }
      }
    }

    if (formtype == 'option') {
      const val = fd.input.val().trim()
      if (val == '') {
        emptyCount++
        validateformEmpty(true, validate, msg);
      } else {
        validateformEmpty(false, validate, '');
      }
    }
    if (formtype == 'number') {
      const n = fd.input.val()
      if (n == '') {
        emptyCount++
        validateformEmpty(true, validate, msg);
      } else {
        if (Number.parseFloat(n) <= 0) {

          emptyCount++
          validateformEmpty(true, validate, 'ป้อนค่าที่มากกว่า 0');
        } else {
          validateformEmpty(false, validate, '');
        }

      }
    }

    if (formtype == 'radio') {
      const c = input.filter(':checked')
      if (c.length == 0) {
        emptyCount++
        validateformEmpty(true, validate, msg);
      }
      if (c.length > 0) {
        validateformEmpty(false, validate, '');
      }
    }

   
  });


  let specialOptionsText = $.map($('[name="special-options-text"]'), (text, index) => {
    if ($(text).val().trim() != '' && $(text).val() != undefined) {
      return $(text).val().trim()
    }
  }
  )
  const electricityUserNumber = $.map($('[name="electricity-user-number"]'), (el) => $(el).val().trim())
  const waterUserNumber = $.map($('[name="water-user-number"]'), (el) => $(el).val().trim())
  const isValid = $('#room-group').attr('data-valid') == 'true'

  if (!isValid) {
    validateformEmpty(true, $("#validate-roomnumber"), 'ไม่สามารถใช้หมายเลขนี้ได้ เนื่องจากอาคารนี้ใช้หมายเลขนี้แล้ว')
  }
  console.log(emptyCount)
  if (emptyCount == 0) {
    if (isValid) {
      const fd = new FormData();
      const mapnumberAppend = $.map($('[name="room-number"]'), function (e, i) {
        if ($(e).val() != '') {
          return $(e).val().trim()
        }
      })
      const mapbuildingAppend = $.map($('[name="building"]'), function (e, i) {
        if ($(e).val() != '') {
          return $(e).val().trim()
        }
      })
      const mapbuildingFloorAppend = $.map($('[name="buildingfloor"]'), function (e, i) {
        if ($(e).val() != '') {
          return $(e).val()
        }
      })

      const fdExampleRoom = $("#room-upload")[0].files

      fd.append('rental_type', $('[name="rentaltype"]').filter(':checked').val())
      fd.append('room_number', JSON.stringify(mapnumberAppend))
      fd.append('building', JSON.stringify(mapbuildingAppend))
      fd.append('building_floor', JSON.stringify(mapbuildingFloorAppend))
      fd.append('electricity_user_number', JSON.stringify(electricityUserNumber))
      fd.append('water_user_number', JSON.stringify(waterUserNumber))
      fd.append("room_type", $('#roomType').val());
      fd.append("bed_type", $('#bedType').val());
      fd.append("room_view", $('#roomView').val());
      fd.append('max_people', $('#maxPeople').val())
      fd.append('bed_amount', $('#bedAmount').val())
      fd.append('toilet_count', $('#toiletCount').val())
      fd.append('price', $('#price').val())
      fd.append('tel', $('#tel').val())
      fd.append('cost_people_exceed', $('#cost-people-exceed').val())
      fd.append('cost_expense_time', $('#cost-expense-time').val())
      fd.append('damage', $('#damage').val())
      fd.append('special_options', specialOptionsText)


      const descript = CKEDITOR.instances['descript-room'].getData().trim()
      fd.append("detail", descript);

      for (let i = 0; i < fdExampleRoom.length; i++) {
        const example = fdExampleRoom[i];
        fd.append("example", example);
      }

      axios({
        method: "post",
        url: "/room/insert",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: fd,
      })
        .then((res) => {
          const result = res.data.result;
          if (result) {
            querySuccess('บันทึกข้อมูลห้องพักสำเร็จ', 1000)
          }

          if (!result) {
            queryFail('บันทึกข้อมูลห้องพัก', 'เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้', res.data.err)
          }
        })
        .catch((err) => {
          statusErr()
        });
    }
  }
});
