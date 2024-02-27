$('#booking-submit').click(function () {
    const bookingForm = [{
        'name': 'fname',
        'formtype': 'text',
        'input': $('#fname'),
        'validate': $('#validate-fname'),
        'msg': 'กรุณาป้อนชื่อ'
    },
    {
        'name': 'lname',
        'formtype': 'text',
        'input': $('#lname'),
        'validate': $('#validate-lname'),
        'msg': 'กรุณาป้อนนามสกุล'
    }, {
        'name': 'phone',
        'formtype': 'text',
        'input': $('#phone'),
        'validate': $('#validate-phone'),
        'msg': 'กรุณาป้อนเบอร์ติดต่อ'
    }, {
        'name': 'amoun_people_stay',
        'formtype': 'text',
        'input': $('#amountPeopleStay'),
        'validate': $('#validate-amountPeopleStay'),
        'msg': 'กรุณาป้อนจำนวนคนพัก'
    }, {
        'name': 'checkin',
        'formtype': 'text',
        'input': $('#checkin'),
        'validate': $('#validate-checkin'),
        'msg': 'กรุณาป้อนเวลาเข้าพัก'
    }
    ]
    let emptyCount = 0
    bookingForm.forEach((fd) => {
        const {
            formtype,
            input,
            msg,
            validate
        } = fd


        if (formtype == 'text') {
            const val = input.val().trim()
            if (val == '') {
                validateformEmpty(true, validate, msg)
                emptyCount++
            } else {
                validateformEmpty(false, validate, msg)
            }
        }




    })

    if (emptyCount == 0) {

        const data = {
            'token_link': location.href,
            'room_id': $(this).attr('data-roomid'),
            'room_number_id': $(this).attr('data-number'),
            'fname': $('#fname').val(),
            'lname': $('#lname').val(),
            'phone': $('#phone').val(),
            'amount_people_stay': $('#amountPeopleStay').val(),
            'time_count': $('#timeCount').val(),
            'checkin': $('#checkin').val(),
            'checkout': $('#checkout').val(),
            'total': $('#total').val(),
            'rental_type': $('#rentaltype').val(),
            'deposit': $('#deposit').val(),
            'promotion': $('#promotion').val(),
            'promotion_discount': $('#promotion-discount').val(),
            'is_promotion': $('#is-promotion').val()
        }
        axios
            .post("/booking/member/insert", data)
            .then((res) => {
                console.log(res)
                let msg = ''
                let err = ''
                let is_err = ''
                let validateCount = 0
                const result = res.data.result
                console.log('http://localhost:8080/reserve?rental_type=daily&checkin=2024-01-22&checkout=2024-01-23&count=1')
                const pathname = location.pathname
                const [, , room_id, room_number_id, room_number] = pathname.split('/')
                const token_link = location.href

                const search = location.search
                const params = new URLSearchParams(location.search)
                const rental_type = params.get('rental_type')
                const checkin = params.get('checkin')
                const checkout = params.get('checkout')
                const count = params.get('count')
                console.log(pathname.split('/'), token_link)
                let link = `?rental_type=${rental_type}`
                link += checkin ? `&checkin=${checkin}` : ''
                link += checkout ? `&checkout=${checkout}` : ''
                link += count ? `&count=${count}` : ''
                console.log(link)
                if (result) {
                    success('ลงทะเบียนจองพักสำเร็จ')
                    setInterval(() => {
                        window.location.assign(`/booking/${res.data.booking_id}`)
                    }, 1200)
                } else {
                    const {
                        is_valid,
                        is_token
                    } = res.data


                    if (is_valid == false) {
                        is_err = 'already_is_been_reserved'
                        msg = 'ขออภัย ห้องนี้มีคนจองแล้ว โปรดจองห้องอื่น'
                        validateCount++
                    } else if (is_token == false) {
                        is_err = 'tokenLogin'
                        msg = 'Token is Valid โปรดลงชื่อเข้างานอีกครั้ง '
                        err = res.data.err
                        validateCount++
                    } else {
                        msg = 'เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้งภายหลัง'
                        err = res.data.err
                        validateCount++
                    }
                }
                if (validateCount > 0) {
                    alertMsg('แจ้งเตือน', msg)
                        .then((result) => {
                            if (result.isConfirmed) {
                                if (is_err == 'already_is_been_reserved') {
                                    link = `/reserve${link}`
                                }
                                if (is_err == 'tokenLogin') {
                                    link = `/login${link}`
                                    link += `&room_number=${room_number}`
                                    link += `&id=${room_id}`
                                    link += `&rnid=${room_number_id}`
                                }
                                location.assign(link)
                            }
                        });
                }
            })
            .catch((err) => {
                queryFail('จองห้องพัก', 'เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้งภายหลัง', err)
            });
    }
})