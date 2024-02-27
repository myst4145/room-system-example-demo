function currentCheckoutAndAmount(checkin, price) {
    const oneday = 1000 * 60 * 60 * 24
    const checkin_stamp = getTimeStampByDate(checkin)
    const now = new Date().valueOf()
    const checkout = setDate(now)
    const checkout_stamp = getTimeStampByDate(checkout)
    const count = (checkout_stamp - checkin_stamp) / oneday
    const amount = parseFloat(price) * count
    console.log('a', amount, price)
    return { count, checkout, amount }
}

function currentChangeCheckoutAmount() {
    const checkout = $('#checkout').val()
    const checkin = $('#checkin').val()
    const checkin_stamp = getTimeStampByDate(checkin)
    const checkout_stamp = getTimeStampByDate(checkout)
    if (checkout_stamp <= checkin_stamp) {
        queryFail('แจ้งเตือน', 'กรุณาเลือกวันให้ถูกต้อง', '')
        $('#checkout').val('')
    }
    if (checkout_stamp > checkin_stamp) {
        const count = (checkout_stamp - checkin_stamp) / (1000 * 60 * 60 * 24)
        const price = parseFloat($('#price').val()) ?? 0
        const amount = count * price
        const overdue = parseFloat($('#rentalOverdue').attr('data-overdue')) ?? 0
        $('#rentalOverdue').val(overdue + amount)
        $('#rentalDamages').val('')
        $('#timeCount').val(count)
    }

}

$('[name="checkout"]').click(function () {
    $('.empty-validate').css('display', 'none')
    $('[name="payat"]').prop('checked', false)
    const id = $(this).data('id')
    axios.get(`/booking/room/data/${id}`)
        .then((response) => {
            const result = response.data.result
            if (!result) {
                queryFail('เกิดข้อผิดพลาดในการโหลดข้อมูล', response.data.err, '')
            }
            if (result) {
                const data = response.data
                const {
                    booking_id, total, overdue, deposit,
                    insurance_cost, rental_type,
                    paid, checkin, amount_people_stay,
                    created, modified, time_count,
                    unit_time, fname, lname, phone
                } = data.booking[0]
                const { building_name } = data.building[0]
                const price = parseFloat(data.rooms[0].price)
                const building_floor = data.room_sub[0].building_floor

                const checkoutTxt = rental_type == 'daily-no-limit'
                    ? 'ไม่ระบุ' : getFullDateisThaiByDate(data.booking[0].checkout)
                const checkinTxt = getFullDateisThaiByDate(checkin)
                const createdTxt = getFullDateTimeisThaiByDateTime(created)
                const modifiedTxt = getFullDateTimeisThaiByDateTime(modified)

                const rentalTypeTxt = getRentalTypeDisplay(rental_type)
                const rentalDailyData = $('.rental-daily-data')
                const nameTxt = `${fname} ${lname}`
                const timeCountTxt = `${time_count} ${getUnitTimeDisplay(unit_time)}`
                const phoneTxt = getNumberPhoneDisplay(phone)
                const paymore_thai_format = currencyThaiFormat(overdue)
                const refund_pay_thai_format = currencyThaiFormat(0)
                const roomNumberTxt = data.room_sub[0].room_number
                const buildingTxt = `${building_name} ชั้น ${building_floor}`
                const info = [
                    booking_id, buildingTxt, roomNumberTxt,
                    rentalTypeTxt, timeCountTxt,
                    checkinTxt, checkoutTxt, nameTxt,
                    phoneTxt, amount_people_stay,
                    createdTxt, modifiedTxt
                ]
                const { count, amount, checkout } = currentCheckoutAndAmount(checkin, price)

                let remain = rental_type == 'daily-no-limit' ? overdue + amount : overdue
                let is_dailynolimit_display = rental_type == 'daily-no-limit' ? 'flex' : 'none'
                
     

                for (let i = 0; i < rentalDailyData.length; i++) {
                    $(rentalDailyData[i]).text(info[i])
                }
                $('#dailyNoLiimitForm').css('display',is_dailynolimit_display)
                $('#timeCount').val(count)
                // $('#checkout').val(checkout)
                $('#checkin').val(checkin)
                $('#price').val(price)
                $('#rentalPayDamages').val(0)
                $('#rentalOverdue').attr('data-overdue', overdue)
                $('#rentalOverdue').val(remain)
                $('#rentalTotal').val(total)
                $('#rentalPaid').val(paid)

                $('#rentalInsuranceCost').val(insurance_cost)
                $('#rentalDeposit').val(deposit)
                $('#rentalRefundPay').val(getNumberFormat(0))
                $('#rentalPayMore').val(getNumberFormat(overdue))
                $('#rentalExpense').val(overdue)
                $('#rentalInsuranceCostRefund').val(insurance_cost)
                $('#rentalDepositRefund').val(deposit)
                $('#rentalPayMoreThaiFormat').val(paymore_thai_format)
                $('#rentalRefundPayThaiFormat').val(refund_pay_thai_format)
                $('#rentalCheckout').attr('data-rentaltype', rental_type)
                $('#rentalCheckout').attr('data-id', id)
                $('#rentalCheckoutModal').modal('show')





            }

        }).catch((bookingErr) => {
            console.log(bookingErr)
            queryFail('เกิดข้อผิดพลาด', bookingErr, '')
        })




})