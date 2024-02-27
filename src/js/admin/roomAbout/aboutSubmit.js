$('#aboutSubmit').click(function () {
    const id = $(this).data('id')
    const act = $(this).data('act')

    const aboutForm = [{
        'input': $('#title'),
        'validate': $('#validate-title'),
        'msg': 'กรุณาป้อน Title'
    }, {
        'input': $('#room-desc'),
        'validate': $('#validate-desc'),
        'msg': 'กรุณาป้อนคำอธิบาย'
    }]
    let validateCout = 0
    aboutForm.forEach((fd) => {
        const {
            input,
            formtype,
            msg,
            validate
        } = fd

        const v = input.val().trim()
        if (v == '') {
            validateCout++
            validateformEmpty(true, validate, msg)
        }
        if (v != '') {
            validateformEmpty(false, validate, msg)
        }


    })
    if (validateCout == 0) {
        let url = ''
        let medthod = ''
        switch (act) {
            case 'insert':
                url = '/about/insert'
                medthod = 'post'
                break;
            case 'update':
                url = `/about/update/${id}`
                medthod = 'put'
                break;
            default:
                break;
        }
        const formData = new FormData()
        formData.append('title', $('#title').val())
        formData.append('descript', $('#room-desc').val())
        const collect = $('[name="collect"]').filter(':checked').val()
        formData.append('collect', collect)
        const file = $('#img')[0].files
        if (file.length == 1) formData.append('img', file[0])

        axios({
            url: url,
            method: medthod,
            data: formData
        }).then((response) => {
            if (response.data.result) querySuccess('บันทึกสำเร็จ')
            if (!response.data.result) queryFail('ข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', response.data.err)
        }).catch((err) => {
            queryFail('ข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', err)
        })
    }
})