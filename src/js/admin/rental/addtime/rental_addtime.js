

$('[name="rentaltype-addtime"]').change(function () {
    const v = $(this).val()
    $('#unitTime-addTime').val(v)
    currentAddTime('rental')
})

function currentAddTime(act) {
    const timeCountAddTime = parseInt($('#timeCount-addTime').val())
    const rentaltype = $('#rentalTypeAddTime').val()
    const unitTime = rentaltype == 'daily'
        ? $('#dailyUnitTimeAddTime')
        : $('#monthlyUnitTimeAddTime')

    let maxCount = 0
    if (unitTime.val() == 'hours') maxCount = 12
    if (unitTime.val() == 'days') maxCount = 60
    if (unitTime.val() == 'months') maxCount = 12
    const unit = rentaltype == 'daily' ? 'days' : 'months'
    if (!isNaN(timeCountAddTime) && unitTime.val() != '') {
        if (timeCountAddTime > maxCount) {
            queryFail('เพิ่มเวลา', `สามารถได้สูงสุด ${maxCount} ${getUnitTimeDisplay(unit)}`, '')
            $('#timeCount-addTime').val(12)
        }
        if (timeCountAddTime <= maxCount) {
            let price = 0
            const checkoutOld = $('#rentalAddTime').val()
            const date = new Date(`${checkoutOld} 00:00:00`)
            const time = $('#oldCheckoutTime').val()
            let m = date.getMonth() + 1
            const y = date.getFullYear()
            const dt = date.getDate()
            const count = m + (timeCountAddTime - 1)
            let year_append = 0
            let mcheckout = 0
            let checkout = ''
            let checkout_time = ''
            const now = `${y}-${getCountDate(m)}-${getCountDate(dt)} ${time}`
            let now_stamp = 0
            let current_stamp = 0


            console.log(m, y, dt)
            switch (unitTime.val()) {
                case 'months':
                    price = parseFloat($('#priceAddTime').val())
                    year_append = Math.floor((count + 1) / 12)
                    mcheckout = (count + 1) % 12

                    if (mcheckout == 0) {
                        mcheckout = 12
                        year_append -= 1
                    }
                    const month = getCountDate(mcheckout)
                    const ycheckout = y + year_append
                    const sum_month = getCountMonth(ycheckout, mcheckout)
                    checkout = `${ycheckout}-${month}-${getCountDate(sum_month)}`
                    current_stamp = new Date(`${checkout} ${time}`).valueOf()
                    break;
                case 'days':
                    price = parseFloat($('#priceAddTime').val())
                    now_stamp = new Date(now).valueOf()
                    current_stamp = (1000 * 60 * 60 * 24 * timeCountAddTime) + now_stamp
                    checkout = setDate(current_stamp)

                    break;
                case 'hours':
                    price = parseFloat($('#costExpenseTimeAddTime').val())
                    now_stamp = new Date(now).valueOf()
                    current_stamp = (1000 * 60 * 60 * timeCountAddTime) + now_stamp
                    checkout = setDate(current_stamp)

                    break;
                default:
                    break;

            }
            checkout_time = getDateAndTimeByTimestamp(current_stamp).split(' ')[1]
            console.log('checkout : ', checkout, checkout_time)
            $('#rentalPayMoreAddTime').val(price * timeCountAddTime)
            $('#rentalAddTimeLast').val(checkout)
            $('#lastCheckoutTime').val(checkout_time)
            $('#rentalAddTimeSubmit').attr('data-unittime', unitTime.val())
        }
    }

}
$('button[name="addtime"]').click(function () {
    $('#rentalAddTimeLast').val('')
    $('#addTimeLastHour').val('')
    $('#addTimeLastMinute').val('')
    $('#timeCount-addTime').val('')
    $('#unitTime-addTime').val('')
    $('[name="rentaltype-addtime"]').prop('checked', false)
    $('#rentalPayMoreAddTime').val('')

    const id = $(this).data('id')
    axios.get(`/booking/data/${id}`)
        .then((response) => {
            const result = response.data.result
            if (!result) {
                queryFail('เกิดข้อผิดพลาดในการโหลดข้อมูล', response.data.err, '')
            }
            if (result) {
                const entries = response.data.entries
                const {
                    booking_id,
                    room_id,
                    room_number_id,
                    rental_type,
                    checkout_time
                } = entries[0]

                const checkoutDisplay = getFullDateisThaiByDate(entries[0].checkout)
                const checkinDisplay = getFullDateisThaiByDate(entries[0].checkin)
                $.each($('#rentalTypeAddTime').children(), (i, opt) => {
                    if ($(opt).val() == rental_type) {
                        $(opt).prop('selected', true)
                    }
                })
                const unitTimeId = rental_type == 'monthly'
                    ? 'monthlyUnitTimeAddTime'
                    : 'dailyUnitTimeAddTime'
                $('[name="unittime"]').css('display', 'none')
                $(`#${unitTimeId}`).css('display', 'block')
                $('.empty-validate').css('display', 'none')

                console.log('fffff ; ', entries[0].checkout)
                const rentalType = getRentalTypeDisplay(rental_type)
                const rentalDailyData = $('.rental-addtime-data')
                const name = `${entries[0].fname} ${entries[0].lname}`
                const time_count = `${entries[0].time_count} ${getUnitTimeDisplay(entries[0].unit_time)}`
                const phone = getNumberPhoneDisplay(entries[0].phone)
                let data = [
                    booking_id, rentalType, '', '',
                    checkinDisplay, checkoutDisplay, name, phone
                ]
                const outDate = entries[0].checkout



                axios.get(`/api/room/${room_id}`)
                    .then((roomData) => {
                        if (!roomData.data.result) {
                            queryFail('เกิดข้อผิดพลาดในการโหลดข้อมูล', roomData.data.err, '')
                        }
                        if (roomData.data.result) {
                            const room_sub = JSON.parse(roomData.data.entries[0].room_sub)
                            const room = room_sub.filter((r) => r.room_number_id == room_number_id)
                            const building_id = room[0].building
                            const { price, cost_expense_time } = roomData.data.entries[0]
                            data[3] = room[0].room_number
                            const building_floor = room[0].building_floor
                            axios.get(`/api/building/${building_id}`)
                                .then((buildingData) => {
                                    if (buildingData.data.result) {
                                        const building = buildingData.data.entries
                                        data[2] = `${building.building_name} ชั้น ${building_floor}`
                                        for (let i = 0; i < rentalDailyData.length; i++) {
                                            $(rentalDailyData[i]).text(data[i])
                                        }
                                        $('#oldCheckoutTime').val(checkout_time)
                                        $('#priceAddTime').val(price)
                                        $('#costExpenseTimeAddTime').val(cost_expense_time)
                                        $('#rentalAddTime').val(outDate)
                                        $('#rentalAddTimeSubmit').attr('data-id', id)
                                        $('#rentalAddTimeModal').modal('show')
                                    }
                                    if (!buildingData.data.result) {
                                        queryFail('โหลดข้อมูลผิดพลาด', buildingData.data.err)
                                    }
                                }).catch((buildingErr) => {
                                    queryFail('เกิดข้อผิดพลาด', buildingErr, '')
                                })
                        }
                    }).catch((err) => {
                        queryFail('เกิดข้อผิดพลาด', err, '')
                    })

            }

        }).catch((bookingErr) => {
            console.log(bookingErr)
            queryFail('เกิดข้อผิดพลาด', bookingErr, '')
        })



})