function getCheckout() {
    return $('#checkout').val()
}

function getCheckin() {
    return $('#checkin').val()

}

function getYear() {
    return $('#year')
}

function getMonth() {
    return $('#month')
}

function getPaid() {
    return $('#paid')
}

function getTotal() {
    return $('#total')
}

function getOverdue() {
    return $('#overdue')
}

function currentYear() {
    const year = parseInt(getYear().val())
    const _checkin = parseInt(getCheckin())
    const _checkout = parseInt(getCheckout())

    if (!isNaN(year) && year.toString().length == 4) {
        if (!(year >= _checkin && year <= _checkout)) {
            queryFail('แจ้งเตือน', 'กรุณาป้อนวันที่ให้ถูกต้อง', '')
            getYear().val('')
        }
    }
}

function currentPaid() {
    const total = parseFloat(getTotal().val())
    const paid = parseFloat(getPaid().val())
    let overdue = 0
    let msg = ``
    let validateCount = 0
    if (isNaN(total)) {
        msg = 'โปรดป้อนยอดชำระก่อน'
        validateCount++
    } else {
        if (paid > total) {
            msg = 'กรุณาป้อนยอดที่ถูกต้อง'
            validateCount++
        } else {
            overdue = total - paid
        }
    }
    if (validateCount > 0) {
        getPaid().val('')
        queryFail('แจ้งเตือน', msg, '')
    }
    getOverdue().val(overdue)

}

$('#month').change(function () {
    const m = $(this).val()
    const _y = getYear().val()
    let msg = ``
    let validateCount = 0
    if (_y == '') {
        validateCount++
        msg = `โปรดป้อนปีก่อน`

    } else {
        const stamp = getTimeStampByDate(`${_y}-${m}-01`)
        const in_stamp = getTimeStampByDate(getCheckin())
        const out_stamp = getTimeStampByDate(getCheckout())
        if (!(stamp >= in_stamp && stamp <= out_stamp)) {
            validateCount++
            msg = `โปรดเลือกเดือนที่ถูกต้อง`
        }
    }

    if (validateCount > 0) {
        queryFail('แจ้งเตือน', msg, '')
        getMonth().val('')
    }
})
$('[name="additional-trans-delete"]').click(function () {
    const date = $(this).attr('data-date')
    const type = $(this).attr('data-type')
    const id = $(this).attr('data-id')
    confirm('ลบข้อมูล', 'ต้องการลบข้อมูลรายการนี้ ใช่หรือไม่ ?')
        .then((result) => {
            if (result.isConfirmed) {
                const id = $(this).attr('data-id')
                axios.patch(`/additionalcost/transaction/delete/${id}`, {
                    'date': date,
                    'type': type
                })
                    .then((response) => {
                        if (response.data.result) querySuccess('ลบเรียบร้อย')
                        if (!response.data.result) {
                            queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้', response.data.err)
                        }
                    })
                    .catch((err) => {
                        queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้', err)
                    })
            }
        })
})
$('[name="open-additionalCost-modal"]').click(function () {
    $('.empty-validate').css('display', 'none')
    const act = $(this).attr('data-act')
    const id = $(this).attr('data-id')
    const date = $(this).attr('data-date')
    const type = $(this).attr('data-type')
    const is_disabled = act == 'edit'
    formResetValue($('#additionalTransactionForm'))
    clearValidateErr()
    $('[name="type"]').prop('disabled', is_disabled)
    switch (act) {
        case 'add':
            $('#electricityTransactionSubmit').attr('data-id', id)
            $('#additionalCostModal').modal('show')
            break;
        case 'edit':
            $('#electricityTransactionSubmit').attr('data-id', id)
            getTransactionByDate(date, id, type)
            break;
        default:
            break;
    }
})

