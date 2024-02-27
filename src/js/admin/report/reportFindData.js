$('#reportFindData').click(function () {
    const route = getFindReportData()
    const {
        id,
        name
    } = getIdAndNameParam()
    const result = id || name
    if (route != '') {
        const page = Display.thisPage(window.location.href)
        window.location.assign(`${page}${route}`)
    }
})

function getFindReportData() {
    const rentaltype = getRentalTypeValue().filter(':checked').val()
    const checkin = getCheckinValue().val().trim()
    const checkout = getCheckoutValue().val().trim()
    let isValidate = 0
    let msgStr = ''
    let route = ''

    const rForm = [{
        'value': rentaltype,
        'msg': 'กรุณาเลือกรูปแบบการเช่าพัก'
    }, {
        'value': checkin,
        'msg': 'กรุณาเลือกวันเริ่มต้น'
    }, {
        'value': checkout,
        'msg': 'กรุณาเลือกวันสิ้นสุด'
    }]


    rForm.forEach((f) => {
        const {
            value,
            msg
        } = f

        if (value == '' || !value) {
            if (isValidate > 0) msgStr += ' และ '
            isValidate++
            msgStr += msg
        }
    })
    if (isValidate > 0) queryFail('ค้นหาข้อมูล', msgStr, '')
    if (isValidate == 0) {
        if (checkin != '' && checkout != '') {
            route += `&checkin=${checkin}&checkout=${checkout}`
            route += `&rental_type=${rentaltype}`
        }

    }


    return route
}
