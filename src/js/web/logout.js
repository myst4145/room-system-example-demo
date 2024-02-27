$('#logout').click(function () {
    axios.get('/member/logout')
        .then((response) => {
            if (response.data.result) {
                location.assign('/login')
            } else {
                queryFail('ออกจากระบบ', 'ไม่สามารถออกจากระบบได้', '')
            }

        }).catch((err) => {
            queryFail('ข้อผิดพลาด', 'ไม่สามารถออกจากระบบได้', '')
        })
})