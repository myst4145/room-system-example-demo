$('#promotionSubmit').click(function () {
    const room_number_id = $.map($('[name="room-number-id"]').filter(':checked'), (opt) => {
        return $(opt).val()
    })
    const promotionForm = [{
        'input': $('#promotionName'),
        'validate': $('#validate-promotionName'),
        'formtype': 'text',
        'msg': 'กรุณาป้อนชื่อโปรโมชั่น'
    }, {
        'input': $('#amount'),
        'validate': $('#validate-amount'),
        'formtype': 'integer',
        'msg': 'กรุณาป้อนจำนวน เป็นตัวเลข และค่าที่มากกว่า 0'
    }, {
        'input': $('#dateStart'),
        'validate': $('#validate-dateStart'),
        'formtype': 'text',
        'msg': 'กรุณาป้อนวันเริ่มต้นใช้งาน'
    }, {
        'input': $('#dateEnd'),
        'validate': $('#validate-dateEnd'),
        'formtype': 'text',
        'msg': 'กรุณาป้อนวันสิ้นสุดการใช้งาน'
    }, {
        'input': $('[name="promotiontype"]'),
        'validate': $('#validate-promotiontype'),
        'formtype': 'radio',
        'msg': 'กรุณาเลือกรูปแบบโปรโมชั่น'
    }, {
        'input': $('[name="room-number-id"]'),
        'validate': $('#validate-roomNumber'),
        'formtype': 'radio',
        'msg': 'กรุณาป้อนเลือกหมายเลขห้อง'
    }]
    let validaCount = 0
    promotionForm.forEach((fd) => {
        const {
            validate,
            input,
            msg,
            formtype
        } = fd
        let is_valid = false

        if (formtype == 'radio') {
            const l = input.filter(':checked').length
            if (l == 0) {
                is_valid = true
                validaCount++
            }
        }
        if (formtype == 'text') {
            const v = input.val().trim()
            if (v == '') {
                is_valid = true
                validaCount++
            }
        }
        if (formtype == 'integer') {
            const n = parseInt(input.val())
            if (isNaN(n) || n == 0) {
                is_valid = true
                validaCount++
            }
        }

        validateformEmpty(is_valid, validate, msg)
    })
    if (validaCount == 0) {
        const id = $('#promotionSubmit').attr('data-id')
        const act = $('#promotionSubmit').attr('data-act')
        let method = ''
        let url = ''
        switch (act) {
            case 'insert':
                url = `/promotion/insert`
                method = 'post'
                break;
            case 'update':
                url = `/promotion/update/${id}`
                method = 'put'
                break;
            default:
                break;
        }
        axios({
            url,
            method,
            data: {
                'room_number_id': room_number_id.join(','),
                'date_start': $('#dateStart').val(),
                'date_end': $('#dateEnd').val(),
                'promotion_name': $('#promotionName').val(),
                'promotion_type': $('[name="promotiontype"]').filter(':checked').val(),
                'amount': $('#amount').val()
            }
        }).then((response) => {
            console.log(response)
            if (response.data.result) {
                querySuccess('บันทึกสำเร็จ')
            }
            if (!response.data.result) {
                let msg = ``
                let validaCount = 0
                let err = ``
                const {
                    date_count,
                    is_promotion
                } = response.data

                if (date_count == false) {
                    msg = 'สามารถได้สูงสุด 60 วันเท่านั้น', ''
                    validaCount++
                } else if (is_promotion == true) {
                    validaCount++
                    msg = 'ห้องพักนี้มีโปรโมชั้นแล้ว สามารถเพิ่มได้แค่ 1 โปรโมชั่นต่อ  1 ช่วงเวลาเท่านั้น'
                } else {
                    validaCount++
                    msg = 'เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้'
                    err = response.data.err
                }

                if (validaCount > 0) queryFail('โปรโมชั่น', msg, err)

            }
        }).catch((err) => {
            queryFail('ข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', err)
        })

    }
})