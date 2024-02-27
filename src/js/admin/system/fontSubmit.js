$('#fontSubmit').click(function () {
    const act = $(this).attr('data-act')
    const id = $(this).attr('data-id')

    const storagetype = $('[name="storage-type"]').filter(':checked').val()
    const formData = new FormData()
    const fontForm = [{
        'input': $('#fontName'),
        'validate': $('#validate-fontName'),
        'msg': 'กรุณาป้อนชื่อตัวอักษร',
        'formtype': 'text'
    },
    {
        'input': $('#fontUpload'),
        'validate': $('#validate-fontUpload'),
        'msg': 'กรุณาป้อนเลือกไฟล์',
        'formtype': 'file'
    }
    ]
    let validateCount = 0
    fontForm.forEach((fd) => {
        const {
            input,
            msg,
            validate,
            formtype
        } = fd
        let is_valid = false
        if (formtype == 'file') {
            if (storagetype == 'new') {
                const f = input[0].files.length
                if (f == 0) {
                    validateCount++
                    is_valid = true
                }
            } else {
                const retain = $('#storage').val()
                if (retain == '') {
                    validateCount++
                    is_valid = true
                }
            }

        }

        if (formtype == 'text') {
            const v = input.val().trim()
            if (v == '') {
                is_valid = true
                validateCount++
            }
        }
        validateformEmpty(is_valid, validate, msg)

    })
    if (validateCount == 0) {
        let url = ``
        let method = ``
        switch (act) {
            case 'insert':
                url = '/system/font/insert'
                method = 'post'
                break;
            case 'update':
                url = `/system/font/update/${id}`
                method = 'put'
                break;
            default:
                break;
        }
        formData.append('font_name', $('#fontName').val())
        formData.append('storage', $('#storage').val().trim())
        if (storagetype == 'new') {
            formData.append('font_upload', $('#fontUpload')[0].files[0])
        }

        axios({
            url,
            method,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                if (response.data.result) {
                    querySuccess('บันทึกเรียบร้อย')
                }
                if (!response.data.result) {
                    queryFail('แจ้งเตือน', 'เกิดข้อผิดพลาดไม่สามารถบันทึกได้', response.data.err)
                }
            })
            .catch((err) => {
                queryFail('เกิดข้อผิดพลาด', err, '')
            })
    }

})