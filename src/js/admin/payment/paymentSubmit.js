$('#payment-submit').click(function () {
    const id = $(this).data('id')
    const act = $(this).data('act')

    const paymentForm = [{
        'name': 'bankname',
        'input': $('#bankname'),
        'validate': $('#validate-bankname'),
        'msg': 'เลือกธนาคาร'
    },
    {
        'name': 'bank_branch',
        'input': $('#bank-branch'),
        'validate': $('#validate-bankbranch'),
        'msg': 'ป้อนสาขาธนาคาร'
    }, {
        'name': 'bank_number',
        'input': $('#bank-number'),
        'validate': $('#validate-banknumber'),
        'msg': 'ป้อนหมายเลขบัญชี'
    },
    {
        'name': 'account_name',
        'input': $('#account-name'),
        'validate': $('#validate-accountname'),
        'msg': 'ป้อนชื่อบัญชี'
    }
    ]

    let emptyCount = 0
    paymentForm.forEach((fd) => {
        const {
            name,
            input,
            validate,
            msg
        } = fd

        const v = input.val().trim()
        if (v == '') {
            validateformEmpty(true, validate, msg)
            emptyCount++
        } else {
            validateformEmpty(false, validate, '')
        }

    })

    if (emptyCount == 0) {
        let url = ''
        let method = ''
        switch (act) {
            case 'insert':
                url = '/payment/insert'
                method = 'post'
                break;
            case 'update':
                url = `/payment/update/${id}`
                method = 'put'
            default:
                break;
        }
        const fd = {
            'bankname': $('#bankname').val(),
            'bank_branch': $('#bank-branch').val(),
            'bank_number': $('#bank-number').val(),
            'account_name': $('#account-name').val()
        }
        axios({
            url: url,
            method: method,
            data: fd
        })
            .then((res) => {
                const result = res.data.result
                if (result == true) {
                    querySuccess('บันทึกสำเร็จ')
                } else if (result == false) {
                    const err = res.data.err
                    queryFail('เพิ่มข่องทางการชำระเงิน', 'บันทึกข้อมูลล้มเหลว', err)
                }

            }).catch((err) => {
                queryFail('ข้อผิดพลาด', err, '')
            })
    }
})