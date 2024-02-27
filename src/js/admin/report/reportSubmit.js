$('button[name="report-submit"]').click(function () {
    const act = $(this).attr('data-act')
    const id = $(this).attr('data-id')
    const elcBill = $('[name="elc-bill"]').filter(':checked').val() ?? 'false'
    const watBill = $('[name="wat-bill"]').filter(':checked').val() ?? 'false'
    const customerTaxId = $('#customerTaxId').val()
    const customerName = $('#customerName').val()
    const customerAddress = $('#customerAddress').val()
    const rentaltype = getRentalTypeValue().filter(':checked').val()
    const checkin = getCheckinValue().val().trim()
    const checkout = getCheckoutValue().val().trim()
    const company = $('[name="company"]').filter(':checked').val()
    const logo = $('[name="logo"]').filter(':checked').val()
    const location = $('[name="location"]').filter(':checked').val()
    const contactNumber = $('[name="contact-number"]').filter(':checked').val()
    const email = $('[name="email"]').filter(':checked').val()
    const alignment = $('[name="alignment"]').filter(':checked').val()
    let route = ``

    let isValidate = false
    if (act == 'pdf' || act == 'report') {
        if (checkin != '' && checkout != '' && rentaltype) {
            isValidate = true
            route += `?checkin=${checkin}&checkout=${checkout}`
        }
    }


    route += `&rental_type=${rentaltype}`
    route += `&company=${company}`
    route += `&logo=${logo}`
    route += `&location=${location}`
    route += `&email=${email}`
    route += `&contact_number=${contactNumber}`
    route += `&alignment=${alignment}`

    switch (act) {
        case 'pdf':
            route = `/report/booking${route}`
            break;
        case 'report':
            route = `/admin/report/view${route}`
            break;
        case 'receipt':
            const receiptForm = [{
                'input': customerTaxId,
                'msg': 'กรุณาป้อนเลขประตัวผู้เสียภาษีของลูกค้า',
                'validate': $('#validate-customerTaxId')
            }, {
                'input': customerName,
                'msg': 'กรุณาป้อนชื่อของลูกค้า',
                'validate': $('#validate-customerName')
            }, {
                'input': customerAddress,
                'msg': 'กรุณาป้อนที่อยู่ของลูกค้า',
                'validate': $('#validate-customerAddress')
            }]
            const taxInvice = $('[name="tax-invice"]').filter(':checked').length
            let receiptValidate = 0
            if (taxInvice > 0) {
                receiptForm.forEach((fd) => {
                    if (fd.input == '') {
                        receiptValidate++
                        validateformEmpty(true, fd.validate, fd.msg)
                    } else {
                        validateformEmpty(false, fd.validate, '')
                    }
                })
            } else {
                receiptForm.forEach((fd) => {
                    validateformEmpty(false, fd.validate, '')
                })
            }


            if (act == 'receipt' && elcBill && watBill && id && receiptValidate == 0) {
                console.log('ddddd')
                isValidate = true
                let r = `/admin/receipt/${id}?elc=${elcBill}&wat=${watBill}`
                r += `&customer_tax_id=${customerTaxId}`
                r += `&customer_name=${customerName}`
                r += `&customer_address=${customerAddress}`
                route = `${r}${route}`
            }
            break;
        default:
            break;
    }



    if (isValidate) {
        if (act == 'report' || act == 'receipt') {
            window.open(route, '_blank')
        } else if (act == 'pdf') {
            axios.get(route)
                .then((response) => {
                    console.log(response)
                    if (response.data.result) {
                        const path = response.data.path
                        window.open(`/${path}`, '_blank')
                    }
                    if (!response.data.result) {
                        queryFail('ข้อผิดพลาด', 'ไม่สามารถสร้างไฟล์ PDF ได้', response.data.err)
                    }
                })
                .catch((err) => {
                    queryFail('ข้อผิดพลาด', 'ไม่สามารถสร้างไฟล์ PDF ได้', err)
                })
        }
    }
})