$('#findDataByQueryForm').click(function () {

    let issetPrice = false
    let checkPrice = false


    const validatePrice = $('#validate-price')
    const roomType = $('#findByRoomType').val()
    const bedType = $('#findByBedType').val()
    const roomView = $('#findByRoomView').val()
    const rentaltype = $('[name="rentaltype"]').filter(
        ':checked').val()
    const timeCount = parseInt($('#timeCount').val())
    let queryString = ``
    const minPrice = $('#findByMinPrice').val().trim()
    const maxPrice = $('#findByMaxPrice').val().trim()
    const min = Number.parseFloat(minPrice)
    const max = Number.parseFloat(maxPrice)


    const checkin = $('#findByCheckin').val()
    const checkout = $('#findByCheckout').val()
    let validateCount = 0
    let msg = ''
    if (!rentaltype || rentaltype == '') {
        msg += 'เลือกรูปแบบการเข้าพัก'
        validateCount++
    }
    if (rentaltype == 'daily' && (checkin == '' || checkout ==
        '')) {
        msg += ` เลือกวันเข้าพักก่อน`
        validateCount++
    }



    if (isNaN(timeCount) && rentaltype != 'daily-no-limit') {
        validateCount++
        msg += ` ป้อนจำนวนวันเข้าพัก`
    }

    if (validateCount > 0) queryFail('จองห้องพัก', msg, '')
    if (rentaltype && rentaltype != '') {
        queryString += `?rental_type=${rentaltype}`


        if (rentaltype != 'daily-no-limit' && checkin != '' &&
            checkout != '' && timeCount != '') {
            queryString += `&checkin=${checkin}`
            queryString += `&checkout=${checkout}`

        }

        if (rentaltype != 'daily-no-limit') queryString +=
            `&count=${timeCount}`


        if (roomType != '') queryString +=
            `&room_type=${roomType}`
        if (bedType != '') queryString += `&bed_type=${bedType}`
        if (roomView != '') queryString +=
            `&roomview=${roomView}`
    }



    if (maxPrice != '' || minPrice != '') issetPrice = true
    if (issetPrice) {
        if (isNaN(min) || isNaN(max)) {
            checkPrice == false
            validateformEmpty(true, validatePrice,
                'กรุณาป้อนราคาก่อน')
        }
    }
    if (!issetPrice) {
        issetPrice = true
        checkPrice = true
    }

    if (!isNaN(min) && !isNaN(max)) {
        if (max < min) {
            checkPrice = false
            validateformEmpty(true, validatePrice,
                'กรุณาป้อนข้อมูลที่ถูกต้อง')
        } else {
            checkPrice = true
            validateformEmpty(false, validatePrice, '')
            queryString +=
                `${checkOperator(queryString)}min=${min}&max=${max}`
        }
    }

    if (issetPrice && checkPrice && queryString != '' &&
        validateCount == 0) {
        location.assign(`/reserve${queryString}`)
    }
})
