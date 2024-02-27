document.addEventListener('DOMContentLoaded', () => {
    createPaginateOnLoad()
})


$('#username').on('input', function () {
    const user = $(this).val().trim()
    console.log(user)
    if (user != '') {
        axios.post('/officer/user/auth', {
            'username': user
        })
            .then((response) => {
                const validate = $('#validate-username')
                console.log(response)
                if (!response.data.result) {
                    queryFail('ตรวจสอบผู้ใช้ในระบบ', 'ไม่สามารถตรวจสอบได้', response.data.err)
                }
                if (response.data.result) {
                    const auth = response.data.auth
                    let msg = ''
                    let color = ''
                    if (auth) {
                        $('#username').attr('data-auth', 'true')
                        msg = 'ผู้ใช้นี้สามารถใช้งานได้'
                        color = '#28a745'
                    } else {
                        $('#username').attr('data-auth', 'false')
                        msg = 'มีผู้ใช้นี้แล้ว'
                        color = '#dc3545'
                    }
                    validate.css('color', color)
                    validateformEmpty(true, validate, msg)

                }
            })
            .catch((err) => {
                queryFail('ตรวจสอบผู้ใช้ในระบบ', 'เกิดข้อผิดพลาด ไม่สามารถตรวจสอบได้', err)
            })
    }
})
$('[name="open-officer-modal"]').click(function () {
    const id = $(this).attr('data-id')
    const act = $(this).attr('data-act')
    const is_disabled = act == 'edit'
    $('#username').prop('disabled', is_disabled)
    clearValidateErr()
    formResetValue($('#officerForm'))
    switch (act) {
        case 'add':
            $('#officerSubmit').attr('data-act', 'insert')
            $('#officerManageModal').modal('show')
            break;
        case 'edit':
            $('#officerSubmit')
                .attr('data-act', 'update')
                .attr('data-id', id)
            getOfficerDataById(id)
            break;
        default:
            break;
    }
})
