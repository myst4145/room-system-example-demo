
$('#slide-submit').click(function () {
    const slideForm = [{
        'name': 'img',
        'formtype': 'file',
        'input': $('#upload-slide'),
        'validate': $('#validate-slide'),
        'msg': 'กรุณาเลือกรูปภาพที่ต้องการอัพโหลด'
    }]
    let emptyCount = 0
    slideForm.forEach((fd) => {
        const {
            formtype,
            input,
            validate,
            msg
        } = fd

        if (formtype == 'text') {
            const val = input.val().trim()
            if (val == '') {
                validateformEmpty(true, validate, msg)
                emptyCount++
            } else {
                validateformEmpty(false, validate, '')
            }
        }


        if (formtype == 'file') {
            const f = input[0].files.length
            if (f == 0) {
                validateformEmpty(true, validate, msg)
                emptyCount++
            } else if (f == 1) {
                validateformEmpty(false, validate, '')
            }
        }

    })

    if (emptyCount == 0) {
        const formData = new FormData()

        formData.append('title', $('#slide-title').val())
        formData.append('descript', $('#slide-desc').val())
        formData.append('slide', $('#upload-slide')[0].files[0])

        axios.post('/slide/insert', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                const result = res.data.result
                if (result) {
                    querySuccess('เพิ่มสำเร็จ')
                }

                if (!result) {
                    queryFail('เพิ่มสไลด์รูปภาพ', 'เกิดข้อผิดพลาด  ไม่สำมารถเพิ่มภาพสไลด์ได้', res.data.err)
                }
            })
            .catch((err) => {
                queryFail('ข้อผิดพลาด', err, '',)
            })
    }
})