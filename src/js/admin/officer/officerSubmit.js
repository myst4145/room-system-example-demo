$('#officerSubmit').click(function () {
    const act = $(this).attr('data-act')
    const officerForm = [{
        'formtype': 'username',
        'input': $('#username'),
        'validate': $('#validate-username'),
        'msg': 'กรุณาป้อนผู้ใช้'
    },
    {
        'formtype': 'password',
        'input': $('#password'),
        'validate': $('#validate-password'),
        'msg': 'กรุณาป้อนรหัสผ่าน'
    },
    {
        'formtype': 'text',
        'input': $('#fname'),
        'validate': $('#validate-fname'),
        'msg': 'กรุณาป้อนชื่อ'
    },
    {
        'formtype': 'text',
        'input': $('#lname'),
        'validate': $('#validate-lname'),
        'msg': 'กรุณาป้อนนามสกุล'
    },
    {
        'formtype': 'radio',
        'input': $('[name="role"]'),
        'validate': $('#validate-role'),
        'msg': 'กรุณาเลือกบทบาท หน้าที่'
    }
    ]
    let validateCount = 0
    officerForm.forEach((fd) => {
        const {
            formtype,
            input,
            validate,
            msg
        } = fd

        if (formtype == 'radio') {
            const c = input.filter(':checked').length
            if (c == 0) {
                validateCount++
                validateformEmpty(true, validate, msg)
            }
            if (c > 0) {
                validateformEmpty(false, validate, '')
            }
        }

        if (formtype == 'text') {
            const v = input.val().trim()
            if (v == '') {
                validateCount++
                validateformEmpty(true, validate, msg)
            }
            if (v != '') {
                validateformEmpty(false, validate, '')
            }
        }

        if (formtype == 'username') {
            const u = input.val().trim()
            if (u == '') {
                validateCount++
                validateformEmpty(true, validate, msg)
            }
        }
        if (formtype == 'password') {
            const pass = input.val().trim()
            if (pass == '') {
                validateCount++
                validateformEmpty(true, validate, msg)
            }
            if (pass != '') {
                const {
                    result,
                    textErr
                } = validatePassword(pass)
                if (!result) {
                    validateCount++
                    validateformEmpty(true, validate, textErr)
                } else {
                    validateformEmpty(false, validate, '')
                }
            }
        }
    })

    if (validateCount == 0) {
        const act = $('#officerSubmit').attr('data-act')
        const id = $('#officerSubmit').attr('data-id')
        let url = ''
        let method = ''
        switch (act) {
            case 'insert':
                url = `/officer/user/insert`
                method = 'post'
                break;
            case 'update':
                url = `/officer/user/update/${id}`
                method = 'put'
                break;
            default:
                break;
        }
        const isAuth = $('#username').attr('data-auth') == 'true'
        if (isAuth) {
            const data = {
                'username': $('#username').val(),
                'password': $('#password').val(),
                'fname': $('#fname').val(),
                'lname': $('#lname').val(),
                'role': $('[name="role"]').filter(':checked').val()
            }
            axios({
                url,
                method,
                data
            })
                .then((response) => {
                    if (response.data.result) {
                        querySuccess("บันทึกข้อมูลบัญชีผู้ใช้เรียบร้อย")
                    }
                    if (!response.data.result) {
                        queryFail('บัญชีพนักงานและผู้ดูแล', 'เกิดข้อผิดพลาดไม่สามารถสร้างบัญชี', response.data.err)
                    }
                })
                .catch((err) => {
                    queryFail('ข้อผิดพลาด', err, '')
                })
        }
    }
})