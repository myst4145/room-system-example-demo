$('#logoSubmit').click(function () {
    const validateForm = [{
        'input': $('[name="logo-file-opt"]'),
        'validate': $('#validate-logoOpt'),
        'file': $('#logo-file'),
        'msg': 'โปรดอัพโหลดรูปภาพโลโก้ใหม่',
        'retain': $('#logo-file-old')
    }, {
        'input': $('[name="icon-opt"]'),
        'validate': $('#validate-iconOpt'),
        'file': $('#icon-file'),
        'msg': 'โปรดอัพโหลดรูปภาพไอคอนใหม่',
        'retain': $('#icon-old')
    }]
    let valadateCount = 0
    validateForm.forEach((fd) => {
        const {
            input,
            retain,
            msg,
            validate,
            file
        } = fd
        let is_valid = false
        const c = input.filter(':checked').val()
        if (c == 'new') {
            const length = file[0].files.length
            if (length == 0) {
                is_valid = true
                valadateCount++
            }

        } else if (c == 'old') {
            if (retain.val().trim() == '') {
                is_valid = true
                valadateCount++
            }
        }
        validateformEmpty(is_valid, validate, msg)
    })
    if (valadateCount == 0) {
        const formData = new FormData()
        formData.append('title', $('#title').val())
        formData.append('logo_text', $('#logo-text').val())
        formData.append('icon', $('#icon-file')[0].files[0])
        formData.append('logo', $('#logo-file')[0].files[0])
        formData.append('logo_opt', $('[name="logo-file-opt"]').filter(':checked').val())
        formData.append('icon_opt', $('[name="icon-opt"]').filter(':checked').val())
        axios.post('/logo/insert', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            if (response.data.result) {
                querySuccess('บันทึกสำเร็จ')
            }

            if (!response.data.result) {
                queryFail('แจ้งเตือน', response.data.err, '')
            }
        }).catch((err) => {
            queryFail('ข้อผิดพลาด', err, '')
        })
    }

})