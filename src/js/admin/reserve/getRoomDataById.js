function getRoomDataById(id, room_number_id, room_number) {
    axios.get(`/api/room/${id}`)
        .then((response) => {
            if (response.data.result) {
                const dataBooking = response.data.entries[0]
                const { price, max_people, cost_people_exceed } = dataBooking

                const p = new URLSearchParams(location.search)
                const checkin = p.get('checkin')
                const checkout = p.get('checkout')
                const rental = p.get('rental_type')
                const time_count = p.get('time_count')
                const unit_time = rental == 'monthly' ? 'months' : 'days'
                console.log(unit_time)
                const disabledCheckin = rental != 'daily'
                const disabledTimeCount = rental == 'monthly'
                $('#checkin').prop('disabled', !disabledCheckin).val(checkin)
                $('#checkout').val(checkout)



                $.each($('#rentalType').children(), (index, el) => {
                    if ($(el).val() == rental) {
                        $(el).prop('selected', true)
                    }
                })


                $("#timeCount").prop('disabled', !disabledTimeCount).val(time_count)
                $('#unitTime').val(unit_time)
                $('#bookingSubmit').attr('data-number-id', room_number_id)
                $('#room-id').val(id)
                $('#room-id').attr('data-number-id', room_number_id)
                $('#room-number').val(room_number)
                $('#price').val(price)
                $('#cost-people-exceed').val(cost_people_exceed)
                $('#max-people').val(max_people)
                $('#booking-room-modal').modal('show')
            }

        })
        .catch((err) => {
            console.log(err)
            queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลได้', err)
        })

}