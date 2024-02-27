$('#login').click(function () {
    const loginForm = [
        {
            'formtype': 'text',
            'input': $('#username'),
            'validate': $('#validate-username'),
            'msg': 'กรุณาป้อนผู้ใช้งาน'
        },
        {
            'formtype': 'text',
            'input': $('#password'),
            'validate': $('#validate-password'),
            'msg': 'กรุณาป้อนรหัสผ่าน'
        },
    ]
    let validaCount = 0
    loginForm.forEach((fd) => {
        const {
            input,
            msg,
            validate,
            formtype
        } = fd

        if (formtype == 'text') {
            const val = input.val().trim()
            console.log('ff', val)
            if (val == '') {
                validaCount++
                validateformEmpty(true, validate, msg)
            }
            if (val != '') {
                validateformEmpty(false, validate, '')
            }
        }
    })

    if (validaCount == 0) {
        axios.post(`member/login`, {
            'username': $('#username').val(),
            'password': $('#password').val()
        })
            .then((response) => {
                if (response.data.result) {
                    if (response.data.login) {
                        const params = new URLSearchParams(location.search)
                        const id = params.get('id')
                        const rnid = params.get('rnid')
                        const number = params.get('room_number')
                        const checkin = params.get('checkin')
                        const checkout = params.get('checkout')
                        const rental_type = params.get('rental_type')
                        const count = params.get('count')
                        const route = params.get('route')
                        let path = ''
                        if (id && number) {
                            path += `/reserve_r/${id}/${rnid}/${number}?rental_type=${rental_type}`
                            path += checkin ? `&checkin=${checkin}` : ''
                            path += checkout ? `&checkout=${checkout}` : ''
                            path += count ? `&count=${count}` : ``
                        } else if (route) {
                            path = `${atob(route)}`
                        } else {
                            path = '/'
                        }
                        location.assign(path)
                    } else {
                        validateformEmpty(true, $('#validateLogin'), 'รหัสผ่าน หรือ ชื่อผู้ใช้งานไม่ถูกต้อง')
                    }
                }
                if (!response.data.result) {
                    queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถลงชื่อเข้าใช้งานได้', '')
                }
            })
            .catch((err) => {
                queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถลงชื่อเข้าใช้งานได้', '')
            })
    }
})