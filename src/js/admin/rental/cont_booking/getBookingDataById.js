function getBookingDataById() {
    const id = $('#getDataByBookingId').val()
    axios.get(`/booking/room/data/${id}`)
        .then((response) => {
            if (!response.data.result) {
                $('#getDataByBookingId').val('')
                queryFail('แจ้งเตือน', 'โหลดข้อมูลล้มเหลว', '')
            }
            if (response.data.result) {
                const data = response.data
                const {
                    booking,
                    rooms,
                    room_sub
                } = data
                console.log('ddd', booking)
                const cont_rental_accept = booking[0].cont_rental_accept == 'true'
                const rental_type = booking[0].rental_type
                let msg = ''
                let is_valid = true
                if (rental_type != 'monthly') {
                    is_valid = false
                    msg = 'การต่อสัญญาแบบต่อเนื่องใช้ได้เฉพาะการเช่าที่เป็นแบบรายเดือนเท่านั้น'

                } else {
                    if (!cont_rental_accept) {
                        is_valid = false
                        msg = 'ข้อมูลนี้ไม่ได้รับอนุญาตให้ต่อสัญญา หรือ ยังไม่หมดสัญญาการเช่าพัก'
                    }
                }
                if (!is_valid) {
                    $('#getDataByBookingId').val('')
                    queryFail('แจ้งเตือน', msg, '')
                }


                if (is_valid) {
                    $.each($('#status').children(), (i, opt) => {
                        if (booking[0].status == $(opt).val()) {
                            $(opt).prop('selected', true)
                        }
                    })
                    $.each($('#rentalType').children(), (i, opt) => {
                        if (booking[0].rental_type == $(opt).val()) {
                            $(opt).prop('selected', true)
                        }
                    })

                    $.each($('#unitTime').children(), (i, opt) => {
                        if (booking[0].unit_time == $(opt).val()) {
                            $(opt).prop('selected', true)
                        }
                    })
                    const checkout = booking[0].checkout
                    const checkout_stamp = getTimeStampByDate(checkout) + (60 * 60 * 1000 * 24)
                    const checkin = setDate(checkout_stamp)

                    $('#checkin').val(checkin)
                    $('#room-id').val(rooms[0].room_id)
                    $('#room-number-id').val(room_sub[0].room_number_id)
                    $('#room-number').val(room_sub[0].room_number)
                    $('#fname').val(booking[0].fname)
                    $('#lname').val(booking[0].lname)
                    $('#phone').val(booking[0].phone)
                    $('#price').val(rooms[0].price)
                }


            }
        }).catch((err) => {
            queryFail('ข้อผิดพลาด', 'โหลดข้อมูลล้มเหลว', err)
        })
}