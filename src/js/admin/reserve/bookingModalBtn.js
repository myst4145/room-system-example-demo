$('button[name="bookingModal"]').click(function () {
    formResetValue($('#booking-form'))
    $('.empty-validate').css('display', 'none')
    const result = isValidCheckQueryParamsEqualSearchForm()

    if (!result) queryFail('ข้อผิดพลาด', 'โปรดกดปุ่มค้นหาเพื่อค้นหาห้องพักก่อน', '')
    if (result) {
        const id = $(this).data('id')
        const room_number_id = $(this).data('number-id')
        const room_number = $(this).data('number')
        const checkin = getFindByCheckin().val()
        const checkout = getFindByCheckout().val()
        const rental = getFindByRentalType().value

        axios.post(`/booking/isvalid/${id}`,
            {
                'room_number_id': room_number_id,
                'rental_type': rental,
                'checkin': checkin,
                checkout
            })
            .then((response) => {
                if (response.data.result) {
                    if (!response.data.is_valid) {
                        Swal.fire({
                            icon: "error",
                            title: "แจ้งเตือน",
                            text: "ห้องพักนี้ไมว่างแล้ว",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload()
                            }
                        });
                    } else {
                        getRoomDataById(id, room_number_id, room_number)
                    }

                } else if (!response.data.resutl) {
                    queryFail('แจ้งเตือน', 'เกิดข้อผิดพลาด', response.data.err)
                }
            }).catch((err) => {
                queryFail('ข้อผิดพลาด', err, '')
            })
    }
})