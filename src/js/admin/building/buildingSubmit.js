$('#building-submit').click(function () {
    const act = $(this).data('act')
    const id = $(this).data('id')
    let url = ''
    let method = ''
    switch (act) {
        case 'insert':
            url = '/building/insert'
            method = 'post'
            break;
        case 'update':
            url = `/building/update/${id}`
            method = 'put'
            break
        default:
            break;
    }
    console.log(act, id)
    const buildingForm = [{
        'input': $('#buildingName'),
        'validate': $('#validate-buildingname'),
        'msg': 'กรุณาป้อนชื่อตึก'
    },
    {
        'input': $('#floorCount'),
        'validate': $('#validate-floorCount'),
        'msg': 'กรุณากรอกจำนวนชั้น'
    }
    ]

    let emptyCount = 0
    buildingForm.forEach((fd, i) => {
        const {
            validate,
            msg
        } = fd

        const v = $(fd.input).val().trim()
        if (v == '') {
            emptyCount++
            validateformEmpty(true, validate, msg)
        } else if (v != '') {
            validateformEmpty(false, validate, '')
        }

    })

    console.log(emptyCount)
    if (emptyCount == 0) {
        axios({
            url: url,
            method: method,
            data: {
                'building_name': $('#buildingName').val(),
                'building_number': $('#buildingNumber').val().trim(),
                'floor_count': $('#floorCount').val()
            }
        }).then((res) => {
            const result = res.data.result
            if (result) {
                querySuccess('บันทึกสำเร็จ')
            }
            if (!result) {
                queryFail('', res.data.err, '')
            }

        })
            .catch(function (err) {
                queryFail('ข้อผิดพลาด', err, '')
            });

    }

})