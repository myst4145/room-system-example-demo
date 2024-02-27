function reserveByBtn(link) {
    const params = get_query_params()
    const rental_type_param = params.get('rental_type') ?? ''
    const checkin_param = params.get('checkin') ?? ''
    const checkout_param = params.get('checkout') ?? ''
    const count_param = params.get('count') ?? ''
    const room_type_param = params.get('room_type') ?? ''
    const bed_type_param = params.get('bed_type') ?? ''
    const roomview_param = params.get('roomview') ?? ''
    const max_param = params.get('max') ?? ''
    const min_param = params.get('min') ?? ''

    const roomType = $('#findByRoomType').val()
    const bedType = $('#findByBedType').val()
    const roomView = $('#findByRoomView').val()
    const rentaltype = $('[name="rentaltype"]').filter(':checked').val()
    const timeCount = $('#timeCount').val()
    const min = $('#findByMinPrice').val().trim()
    const max = $('#findByMaxPrice').val().trim()
    const checkin = $('#findByCheckin').val()
    const checkout = $('#findByCheckout').val()

    const queryValidate = [{
        'name': 'checkin',
        'input': checkin,
        'param': checkin_param
    },
    {
        'name': 'checkout',
        'input': checkout,
        'param': checkout_param
    },
    {
        'name': 'rentaltype',
        'input': rentaltype,
        'param': rental_type_param
    },
    {
        'name': 'min',
        'input': min,
        'param': min_param
    },
    {
        'name': 'max',
        'input': max,
        'param': max_param
    },
    {
        'name': 'room_type',
        'input': roomType,
        'param': room_type_param
    },
    {
        'name': 'bed_type',
        'input': bedType,
        'param': bed_type_param
    },
    {
        'name': 'roomView',
        'input': roomView,
        'param': roomview_param
    },
    {
        'name': 'count',
        'input': timeCount,
        'param': count_param
    },
    ]
    let validateCount = 0
    queryValidate.forEach((fd) => {
        const {
            param,
            input,
            name
        } = fd
        if (rentaltype == 'daily-no-limit' &&
            (
                name == 'checkin' ||
                name == 'checkout' ||
                name == 'count')) {
            return
        } else {
            if (param != input) validateCount++
        }
    })
    if (validateCount > 0) queryFail('แจ้งเตือน', 'โปรดกดค้นหาอีกครั้ง', '')
    if (validateCount == 0) window.open(link, '_blank')
}