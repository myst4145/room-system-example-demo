$('[name="room-detail"]').click(function () {
  const id = $(this).data('id')
  const room_number_id = $(this).data('number')
  axios.get(`/api/room/${id}`)
    .then((response) => {
      if (response.data.result) {
        const detail = response.data.entries[0]
        const sub = JSON.parse(detail.room_sub).filter((s) => s.room_number_id == room_number_id)
        let building_id = ''
        let building_floor = ''

        if (sub.length > 0) {
          building_id = sub[0].building
          building_floor = sub[0].building_floor
        }
        console.log(response.data.entries[0])

        const room_id = detail.room_id

        const room_number = sub[0].room_number
        const bed_amount = detail.bed_amount
        const bed_type = Display.resBed(detail.bed_type)
        const room_type = Display.getRoomtype(detail.room_type)
        const roomview = Display.getRoomview(detail.roomview)
        const rental_type = getRentalTypeDisplay(detail.rental_type)
        const special_options = detail.special_options == '' ? [] : detail.special_options.split(',')

        let specialOptionsEl = special_options.length > 0
          ? special_options.map((sp) => {
            return `<p class="m-0">${Display.resSpecialOptions(sp)}</p>`
          }).join(' ') : '<p class="m-0 p-2">ไม่มี</p>'

        $('#additional-items').html(specialOptionsEl)
        const text_detail = $('.text-detail')
        axios.get(`/api/building/${building_id}`)
          .then((response) => {
            console.log(response.data.entries)
            let { building_name, building_number } = response.data.entries
            const d = [room_number,
              room_type,
              bed_type,
              roomview,
              bed_amount,
              building_name,
              building_floor,
              getNumberFormat(detail.price),
              detail.toilet_count,
              rental_type
            ]
            for (let i = 0; i < d.length; i++) {
              $(text_detail[i]).text(d[i])
            }
            $('#roomId').val(room_id)
            $('#roomNumberId').val(room_number_id)
            $('#room-title').text(room_number)
            $('#room-detail-modal').modal('show')
          })
          .catch((err) => {
            queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลได้', err)
          })
      }

    })
    .catch((err) => {
      console.log(err)
    })






})