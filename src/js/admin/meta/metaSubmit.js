$('#meta-submit').click(function () {
    const act = $(this).attr('act')
    const id = $(this).attr('data-id')
    console.log(act, id)
    const metaForm = [{
        'name': 'text',
        'input': $('#room-id'),
        'validate': $('#validate-room-id'),
        'msg': 'กรุณาเลือกหมายเลขห้อง'
    },
    {
        'name': 'text',
        'input': $('#meta-text'),
        'validate': $('#validate-text'),
        'msg': 'กรุณาป้อนข้อความ'
    }, {
        'name': 'name',
        'input': $('[name="meta"]'),
        'validate': $('#validate-name'),
        'msg': 'กรุณาเลือกคุณสมบัติ'
    }
    ]
    let emptyCount = 0
    metaForm.forEach((fd) => {
        const {
            name,
            input,
            validate,
            msg
        } = fd

        if (name == 'text') {
            const v = input.val().trim()
            if (v == '') {
                validateformEmpty(true, validate, msg)
                emptyCount++
            } else {
                validateformEmpty(false, validate, msg)
            }
        }
        if (name == 'name') {
            const checked = input.filter(':checked').length
            if (checked == 0) {
                validateformEmpty(true, validate, msg)
                emptyCount++
            } else {
                validateformEmpty(false, validate, msg)
            }
        }
    })
    let url = ''
    let method = ''
    switch (act) {
        case 'insert':
            url = '/meta/insert'
            method = 'post'
            break
        case 'update':
            url = `/meta/update/${id}`
            method = 'put'
            break
        default:
            break
    }

    if (emptyCount == 0) {

        axios({
            'url': url,
            'method': method,
            'data': {
                'room_id': $('#room-id').val(),
                'content': $('#meta-text').val(),
                'name': $('[name="meta"]').filter(':checked').val()
            }
        }).then((res) => {
            const result = res.data.result
            if (result) {
                querySuccess('เพิ่มสำเร็จ', 1000)
            }
            if (!result) {
                const err = res.data.err
                queryFail('เพิ่ม SEO', 'บันทึกข้อมลล้มเหลว', err)
            }
        })
            .catch((err) => {
                queryFail('ข้อผิดพลาด', err, '')
            })
    }
})