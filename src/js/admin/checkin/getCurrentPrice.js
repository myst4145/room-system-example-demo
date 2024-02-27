function getCurrentPrice() {
    const roomId = $('#roomId').val()
    const roomNumberId = $('#roomNumberId').val()
    if (roomId != '' && roomNumberId != '') {
        axios.get(`/booking/data/room/${roomId}/${roomNumberId}`)
            .then((response) => {
                if (response.data.result) {
                    const count = parseInt($('#timeCount').val())
                    const paid = parseFloat($('#paid').val())
                    let room_number = ''
                    let price = ''
                    let total = ''
                    let refundpay = 0
                    let paymore = 0
                    let overdue = 0
                    const data = response.data.entries
                    if (data.length > 0 && data[0].room_number != '') {
                        price = data[0].price
                        room_number = data[0].room_number
                        total = parseFloat(price) * count
                        if (paid > total) refundpay = paid - total
                        if (paid <= total) paymore = total - paid
                        overdue += paymore
                    }
                    if (data.length == 0 || data[0].room_number == '') {
                        queryFail("เกิดข้อผิดพลาด", 'กรุณาป้อนข้อมูลที่ถูกต้อง', '')
                    }
                    $('#remain').val(overdue)
                    $('#overdue').val(overdue)
                    $('#refundPay').val(refundpay)
                    $('#paymore').val(paymore)
                    $('#roomNumber').val(room_number)
                    $('#price').val(price)
                    $('#total').val(total)
                }
                if (!response.data.result) {
                    queryFail("แจ้งเตือน", 'ไม่สามารถโหลดข้อมูลได้', response.data.err)
                }
            })
            .catch((err) => {
                queryFail("เกิดข้อผิดพลาด", err, '')
            })
    }
}