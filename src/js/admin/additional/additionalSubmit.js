$('#additionalCostSubmit').click(function () {
    console.log('ddddddddd')
    const electricityForm = [{
        'input': $('#fname'),
        'validate': $('#validate-fname'),
        'msg': 'กรุณาป้อนชื่อ'
    }, {
        'input': $('#lname'),
        'validate': $('#validate-lname'),
        'msg': 'กรุณาป้อนนามสกุล'
    },
    {
        'input': $('#booking-id'),
        'validate': $('#validate-bookingId'),
        'msg': 'กรุณาป้อนรหัสการเช่าจอง'
    },
    {
        'input': $('#status'),
        'validate': $('#validate-status'),
        'msg': 'กรุณาเลือกสถานะ'
    }
    ]
    let validateCount = 0
    electricityForm.forEach((fd) => {
        const {
            input,
            msg,
            validate
        } = fd

        const val = input.val().trim()
        if (val == '') {
            validateCount++
            validateformEmpty(true, validate, msg)
        }
        if (val != '') {
            validateformEmpty(false, validate, '')
        }
    })
    console.log(validateCount)
    if (validateCount == 0) {
        const act = $('#additionalCostSubmit').attr('data-act')
        const id = $('#additionalCostSubmit').attr('data-id')
        let method = ''
        let url = ''
        switch (act) {
            case 'insert':
                method = 'post'
                url = '/additionalcost/insert'
                break;
            case 'update':
                method = 'put'
                url = `/additionalcost/update/${id}`
                break;
            default:
                break;
        }
        console.log(method, url)
        const data = {
            'status': $('#status').val(),
            'booking_id': $('#booking-id').val(),
            'fname': $('#fname').val(),
            'lname': $('#lname').val(),
        }
        axios({
            method: method,
            url: url,
            data: data
        })
            .then((response) => {
                console.log(response)
                if (response.data.result) {
                    querySuccess("บันทึกเรียบร้อย")
                }
                if (!response.data.result) {
                    let msg = ``
                    let validateCount = 0
                    if (response.data.isValidId == false) {
                        msg = 'คุณได้บันทึกรหัสการจองนี้แล้ว โปรดใช้รหัสหรือ เลขที่จองนี้ค้นหาในระบบ'
                        validateCount++
                    } else {
                        msg = 'ไม่สามารถบันทึกข้อมูลได้'
                        validateCount++
                    }
                    if (validateCount > 0) {
                        queryFail('เกิดข้อผิดพลาด', msg, response.data.err)
                    }
                }
            })
            .catch((err) => {
                console.log(err)
                queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', err)
            })
    }
})