$('#username').on('input', function () {
    const validateErr = $('#validate-username')
    const username = $(this).val().trim()
    const isPass = ''
    let msg = ''
    let color = ''
    if (username != '') {
        const {
            result,
            textErr
        } = validateUsername(username)

        if (!result) {
            $('#username').attr('data-auth', 'false')
            validateErr.css('color', '#dc3545')
            validateformEmpty(true, validateErr, textErr)
        }
        if (result) {
            axios.post(`/member/auth`, {
                'username': username
            })
                .then((response) => {
                    console.log(response)
                    if (response.data.result) {
                        if (response.data.auth) {
                            $('#username').attr('data-auth', 'true')
                            msg = 'ผู้ใช้งานสามารถใช้งานได้'
                            color = '#28a745'

                        }
                        if (!response.data.auth) {
                            $('#username').attr('data-auth', 'false')
                            msg = 'มีผู้ใช้งานบัญชีนี้แล้ว'
                            color = '#dc3545'
                        }
                        validateErr.css('color', color)
                        validateformEmpty(true, validateErr, msg)
                    }
                    if (!response.data.result) {
                        queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถเข้าถึงข้อมูลได้', '')
                    }
                })
                .catch((err) => {
                    $('#username').attr('data-auth', 'false')
                    queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถเข้าถึงข้อมูลได้', '')
                })
        }

    }
})
$('#register').click(function () {
    const registerForm = [{
        'formtype': 'text',
        'input': $('#memberFname'),
        'validate': $('#validate-fname'),
        'msg': 'กรุณาป้อนชื่อ'
    },
    {
        'formtype': 'text',
        'input': $('#memberLname'),
        'validate': $('#validate-lname'),
        'msg': 'กรุณาป้อนนามสกุล'
    },
    {
        'formtype': 'username',
        'input': $('#username'),
        'validate': $('#validate-username'),
        'msg': 'กรุณาป้อนผู้ใช้งาน'
    },
    {
        'formtype': 'password',
        'input': $('#password'),
        'validate': $('#validate-password'),
        'msg': 'กรุณาป้อนรหัสผ่าน'
    },
    {
        'formtype': 'text',
        'input': $('#phone'),
        'validate': $('#validate-phone'),
        'msg': 'กรุณาป้อนเบอร์ติดต่อ'
    }
    ]
    let valadateCount = 0
    registerForm.forEach((fd) => {
        const {
            input,
            msg,
            validate,
            formtype
        } = fd

        if (formtype == 'text') {
            const val = input.val().trim()
            if (val == '') {
                valadateCount++
                validateformEmpty(true, validate, msg)
            }
            if (val != '') {
                validateformEmpty(false, validate, '')
            }
        }

        if (formtype == 'username') {

            const user = input.val().trim()
            if (user == '') {
                valadateCount++
                validateformEmpty(true, validate, msg)
            }

        }

        if (formtype == 'password') {
            const pass = input.val().trim()
            if (pass == '') {
                valadateCount++
                validateformEmpty(true, validate, msg)
            } else {
                const {
                    result,
                    textErr
                } = validatePassword(pass)

                if (!result) {
                    valadateCount++
                    validateformEmpty(true, validate, textErr)
                }
                if (result) {
                    validateformEmpty(false, validate, '')
                }
            }
        }
    })

    if (valadateCount == 0) {
        const isAuth = $('#username').attr('data-auth') == 'true'
        if (isAuth) {
            const registerModal = $('#registerModal')
            axios.post(`/member/insert`, {
                'username': $('#username').val(),
                'password': $('#password').val(),
                'fname': $('#memberFname').val(),
                'lname': $('#memberLname').val(),
                'phone': $('#phone').val()
            })
                .then((response) => {
                    const {
                        result,
                        isAlreadyUser
                    } = response.data
                    if (result) {
                        success('สร้างบัญชีสำเร็จ')
                        setInterval(() => {
                            location.assign('/login')
                        }, 1000)
                    }
                    if (!result) {

                        let msg = ``
                        let valadateCount = 0
                        if (isAlreadyUser) {
                            msg = `มีชื่อผู้ใช้นี้แล้ว`
                            valadateCount++
                        } else {
                            msg = `เกิดข้อผิดพลาด ไม่สามารถสมัครสมาชิกได้`
                            valadateCount++
                        }
                        if (valadateCount > 0) {
                            $('#registerErr').text(msg)
                            registerModal.modal('show')
                        }
                    }
                })
                .catch((err) => {
                    $('#registerErr').text('เกิดข้อผิดพลาด ไม่สามารถสมัครสมาชิกได้')
                    registerModal.modal('show')
                })
        }

    }
})

