$('#roomSubmit').click(() => {
  const act = $('#roomSubmit').attr('data-act')
  console.log('dddd', act)
  const formAndValidateData = [{
    name: "rental_type",
    formtype: "radio",
    input: $('[name="rentaltype"]'),
    validate: $("#validate-rentaltype"),
    msg: "กรุณาเลือกรูปแบบเตียง",
  }, {
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
    msg: "กรุณาป้อนราคา",
  },

  {
    name: "cost_expense_time",
    formtype: "number",
    input: $('#cost-expense-time'),
    validate: $("#validate-costExpenseTime"),
    msg: "กรุณาป้อนค่าต่อเวลา",
  },
  {
    name: "deposit",
    formtype: "number",
    input: $('#deposit'),
    validate: $("#validate-deposit"),
    msg: "กรุณาป้อนค่ามัดจำล่วงหน้า",
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
    name: "price_over_people",
    formtype: "number",
    input: $('#priceOverPeople'),
    validate: $("#validate-over-people"),
    msg: "กรุณาป้อนราคาจำนวนคนเกิน",
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
    input: [$('#example-old-value'), $("#room-upload"), $('#example-old-delete')],
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



    if (formtype == 'option') {
      const val = fd.input.val().trim()
      if (val == '') {
        emptyCount++

        validateformEmpty(true, validate, msg);
      } else {

        validateformEmpty(false, validate, '');
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

    if (act == 'update' && formtype == "multi_file") {
      const fileOldValue = fd.input[0].val().trim();
      const fileCount = fd.input[1][0].files.length;

      if (fileOldValue == '' && fileCount == 0) {
        emptyCount++;
        validateformEmpty(true, validate, msg);
      } else {
        validateformEmpty(false, validate, msg);
        if (fileCount > 5) {
          emptyCount++
          queryFail('อัพโหลดรูปภาพ', 'สามารถอัพโหลดรูปภาพได้ครั้งละ 5 ภาพเท่านั้น', '')
        }
      }
    }


    if (act == 'insert' && formtype == 'single_file') {
      const fileCount = fd.input[0].files.length;
      if (fileCount == 0) {
        emptyCount++;
        validateformEmpty(true, validate, msg);
      } else if (fileCount > 0) {
        validateformEmpty(false, validate, '');
        if (fileCount > 5) {
          emptyCount++
          queryFail('อัพโหลดรูปภาพ', 'สามารถอัพโหลดรูปภาพได้ครั้งละ 5 ภาพเท่านั้น', '')
        }
      }
    }

  });




  let specialOptionsText = $.map($('[name="special-options-text"]'), (text, index) => {
    if ($(text).val().trim() != '' && $(text).val() != undefined) {
      return $(text).val().trim()
    }
  }
  )
  const isValid = $('#room-group').attr('data-valid') == 'true'

  if (!isValid) {
    validateformEmpty(true, $("#validate-roomnumber"), 'ไม่สามารถใช้หมายเลขนี้ได้ เนื่องจากอาคารนี้ใช้หมายเลขนี้แล้ว')
  }

  const roomNumberIdList = $.map($('[name="room-number"]'), (element, i) => $(element).attr('data-number'))
  const roomNumberList = $.map($('[name="room-number"]'), (e, i) => ($(e).val().trim()))
  const buildingList = $.map($('[name="building"]'), (e, i) => $(e).val().trim())
  const buildingFloorList = $.map($('[name="buildingfloor"]'), (e, i) => $(e).val().trim())
  const statusList = $.map($('[name="status"]'), (e, i) => ($(e).val().trim()))
  const softDeleteList = $.map($('[name="softdelete"]'), (e, i) => ($(e).val().trim()))
  const wat_user_no = $.map($('[name="wat-user-no"]'), (el) => $(el).val().trim())
  const wat_user_reg = $.map($('[name="wat-user-reg"]'), (el) => $(el).val().trim())
  const elc_user_no = $.map($('[name="elc-user-no"]'), (el) => $(el).val().trim())
  const elc_meter_no = $.map($('[name="elc-meter-no"]'), (el) => $(el).val().trim())
  const elc_receipt_no = $.map($('[name="elc-receipt-no"]'), (el) => $(el).val().trim())
  const elc_acct_no = $.map($('[name="elc-acct-no"]'), (el) => $(el).val().trim())
  let roomDataList = []
console.log(wat_user_no)
console.log(elc_user_no)
  for (let i = 0; i < roomNumberList.length; i++) {
    const n = roomNumberList[i].trim()
    const b = buildingList[i].trim()
    const bf = buildingFloorList[i].trim()

    if (n != '' && b != '' && bf != '') {
      roomDataList.push({
        'room_number_id': roomNumberIdList[i],
        'room_number': n,
        'building': b,
        'building_floor': bf,
        'elc_user_no': elc_user_no[i],
        'wat_user_no': wat_user_no[i],
        'wat_user_reg': wat_user_reg[i],
        'elc_meter_no': elc_meter_no[i],
        'elc_receipt_no': elc_receipt_no[i],
        'elc_acct_no': elc_acct_no[i],
        'status': statusList[i],
        'soft_delete': softDeleteList[i]
      })
    }
  }
  if (roomDataList.length == 0) {
    validateformEmpty(true, $("#validate-roomnumber"), 'กรุณากรอกข้อมูลอย่างน้อย 1 รายการ');
  }
  if (emptyCount == 0) {

    if (isValid && roomDataList.length > 0) {
      const fd = new FormData();

      const fdExampleRoom = $("#room-upload")[0].files
      fd.append('rental_type', $('[name="rentaltype"]').filter(':checked').val())
      fd.append('room_sub', JSON.stringify(roomDataList))
      fd.append("room_type", $('#roomType').val());
      fd.append("bed_type", $('#bedType').val());
      fd.append("room_view", $('#roomView').val());
      fd.append('max_people', $('#maxPeople').val())
      fd.append('bed_amount', $('#bedAmount').val())
      fd.append('toilet_count', $('#toiletCount').val())
      fd.append('damage', $('#damage').val())
      fd.append('deposit', $('#deposit').val())
      fd.append('price', $('#price').val())
      fd.append('tel', $('#tel').val())
      fd.append('cost_people_exceed', $('#cost-people-exceed').val())
      fd.append('cost_expense_time', $('#cost-expense-time').val())
      fd.append('old_example', $('#example-old-value').val())
      fd.append('old_example_delete', $('#example-old-delete').val())
      fd.append('special_options', specialOptionsText)
      fd.append("detail", $('#descript-room').val().trim());

      for (let i = 0; i < fdExampleRoom.length; i++) {
        const example = fdExampleRoom[i];
        fd.append("example", example);
      }
      const id = $('#roomSubmit').attr('data-id')
      let method = ''
      let url = ''
      switch (act) {
        case 'insert':
          method = 'post'
          url = '/room/insert'
          break;
        case 'update':
          method = 'put'
          url = `/room/update/${id}`
          break;
        default:
          break;
      }

      axios({
        method,
        url,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: fd,
      })
        .then((res) => {
          const result = res.data.result
          if (result) querySuccess('บันทึกข้อมูลสำเร็จ')
          if (!result) queryFail('บันทึกข้อมูลห้องพัก', 'เกิดข้อผิดพลาดไม่สามารถบันทึกข้อมูลได้', res.data.err)
        })
        .catch((err) => {
          queryFail('แจ้งเตือน', 'เกิดข้อผิดพลาด', err)
        });
    }
  }
});
