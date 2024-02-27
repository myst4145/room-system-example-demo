$('#checkinConfirm').click(function () {
    const id = $(this).attr('data-id')
    const accept_order = $('[name="accept-order"]').filter(':checked').val()
    const is_accept = accept_order == 'true' ? 'accept' : 'decline'
    const changeroom = $('[name="changeroom"]').filter(':checked').val()
    const checkinForm = [{
        'role': 'accept',
        'input': $('#roomNumber'),
        'validate': $("#validate-roomNumber"),
        'msg': 'กรุณาป้อนรหัสข้อมูล และ รหัสห้องพัก เพื่อรับหมายเลขห้องพัก'
    },
    {
        'role': 'accept',
        'input': $('#roomNumberId'),
        'validate': $("#validate-roomNumberId"),
        'msg': 'กรุณาป้อนรหัสห้องพัก'
    },
    {
        'role': 'accept',
        'input': $('#roomId'),
        'validate': $("#validate-roomId"),
        'msg': 'กรุณาป้อนรหัสข้อมูลห้องพัก'
    },
    {
        'role': 'accept',
        'input': $('#total'),
        'validate': $("#validate-total"),
        'msg': 'กรุณาป้อนรหัสข้อมูล และ รหัสห้องพัก เพื่อคำนวณยอดชำระ'
    },
    {
        'role': 'accept',
        'input': $('#pay'),
        'validate': $("#validate-pay"),
        'msg': 'กรุณาป้อนยอดการจ่ายเงิน'
    }, {
        'role': 'decline',
        'input': $('#paidNoAccept'),
        'validate': $("#validate-paidNoAccept"),
        'msg': 'กรุณาป้อนยอดชำระ'
    },
    {
        'role': 'decline',
        'input': $('#refundPayNoAccept'),
        'validate': $("#validate-refundPayNoAccept"),
        'msg': 'กรุณาป้อนจำนวนเงินที่คืน'
    }]
    if (!accept_order || accept_order == '') {
        queryFail('แจ้งเตือน', 'กรุณาเลือกการยืนยัน', '')
    }
    if (accept_order && accept_order != '') {
        let validateCount = 0
        if (accept_order == 'false') {
            checkinForm.filter((f) => f.role == is_accept).forEach((fd) => {
                const {
                    input,
                    validate,
                    msg
                } = fd
                let is_valid = false
                const v = input.val().trim()
                if (v == '') {
                    validateCount++
                    is_valid = true
                }
                validateformEmpty(is_valid, validate, msg)
            })

        }
        if (accept_order == 'true') {
            if (changeroom == '' || !changeroom) {
                validateCount++
                queryFail('แจ้งเตือน', 'กรุณาเลือกการเปลี่ยนห้อง', '')
            }
            if (changeroom && changeroom != '' && changeroom == 'true') {

                console.log(is_accept)


                checkinForm.filter((f) => f.role == is_accept).forEach((fd) => {
                    const {
                        input,
                        validate,
                        msg
                    } = fd
                    let is_valid = false
                    const v = input.val().trim()


                    if (v == '') {
                        validateCount++
                        is_valid = true
                    }


                    validateformEmpty(is_valid, validate, msg)
                })


                console.log(validateCount)


            }

        }


        if (validateCount == 0) {
            confirm('เช็คอิน ลงทะเบียนเข้าพัก', 'คุณต้องการยืนการเช็คอินหรือ ไม่?')
                .then((result) => {
                    if (result.isConfirmed) {

                        axios.patch(`/booking/checkin/confirm/${id}`, {
                            'total': $('#total').val(),
                            'room_id': $('#roomId').val(),
                            'room_number_id': $('#roomNumberId').val(),
                            'overdue': $('#overdue').val(),
                            'paid': $('#paidNoAccept').val(),
                            'accept_order': $('[name="accept-order"]').filter(':checked').val()
                        })
                            .then((response) => {
                                if (response.data.result) {
                                    querySuccess('ทำรายการเรียบร้อย')
                                }
                                if (!response.data.result) {
                                    queryFail('เกิดข้อผิดพลาด', 'ทำรายการล้มเหลว', response.data.err)
                                }
                            })
                            .catch((err) => {
                                queryFail('เกิดข้อผิดพลาด', 'ทำรายการล้มเหลว', err)
                            })
                    }
                });
        }
    }
})