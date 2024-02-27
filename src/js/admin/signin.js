$('#signin-submit').click(function () {
    axios.post('/api/sign-in', {
        'username': $('#username').val(),
        'password': $('#password').val()
    })
        .then((res) => {
            const result = res.data.result
            if (result) {
                querySuccess('เข้าสู่ระบบเรียบร้อย', 1000)
            }
            if (!result) {
                queryFail('ลงชื่อเข้าสู่ระบบ', 'เกิดข้อผิดพลาด ไม่สามารถลงชื่อเข้าสู่ระบบได้ ', '')
            }
        }).catch((err) => {
            queryFail('ข้อผิดพลาด', 'ไม่สามารถลงชื่อเข้าสู่ระบบได้ ', err)
        })
})