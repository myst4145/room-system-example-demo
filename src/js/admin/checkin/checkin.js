document.addEventListener('DOMContentLoaded', () => {
    createPaginateOnLoad()
})
$('[name="accept-order"]').click(function () {
    const c = $(this).val() == 'true'
    const is_display = c ? 'none' : 'flex'
    const is_change = !c ? 'none' : 'block'
    $('#refundPayNoAcceptForm').css('display', is_display)
    $('#changeroomDisplay').css('display', is_change)
})


function getCurrentRefundPay() {
    const refund = parseFloat($('#refundPayNoAccept').val())
    const paid = parseFloat($('#paidNoAccept').attr('data-paid'))

    let msg = ``
    let validate = 0
    if (!isNaN(refund) && !isNaN(paid)) {
        if (refund > paid) {
            validate++
            msg = 'ไม่สามารถคืนได้มากกว่าจำนวนเงินที่จ่ายเข้ามา'
            $('#paidNoAccept').val($('#paidNoAccept').attr('data-paid'))
            $('#refundPayNoAccept').val('')
        }
        if (refund <= paid) {
            $('#paidNoAccept').val(paid - refund)
        }

    }
    if (validate > 0) queryFail('แจ้งเตือน', msg, '')
}
$('[name="changeroom"]').change(function () {
    const result = $(this).val()
    const isDisabled = result == 'false'
    const changeroomDisplay = result == 'true' ? 'block' : 'none'
    $('[name="textid"]').prop('disabled', isDisabled)
    $('#getChangeroomData').css('display', changeroomDisplay)
})

$('[name="checkin"]').click(function () {
    const id = $(this).attr('data-id')
    axios.get(`/booking/checkin/${id}`)
        .then((response) => {
            if (response.data.result) {
                const {
                    booking,
                    room_number,
                    building_name,
                    building_floor,

                } = response.data
                const paidNoAccept = booking[0].rental_type == 'daily'
                    ? booking[0].paid
                    : booking[0].deposit

                const data = [
                    booking[0].booking_id,
                    `${building_name} ชั้น ${building_floor}`,
                    room_number,
                    booking[0].checkin,
                    booking[0].checkout,
                    `${booking[0].fname} ${booking[0].lname}`,
                ]
                const checkinInfo = $('.checkin-info')
                for (let i = 0; i < data.length; i++) {
                    $(checkinInfo[i]).text(data[i])
                }

                $('#paid').val(booking[0].paid)
                $('#paidNoAccept').val(paidNoAccept)
                $('#paidNoAccept').attr('data-paid', paidNoAccept)
                $('#remain').val(booking[0].overdue)
                $('#oldTotal').val(booking[0].total)
                $('#checkin').val(booking[0].checkin)
                $('#checkout').val(booking[0].checkout)
                $('#timeCount').val(booking[0].time_count)
                retainOptionValue($('#unitTime'), booking[0].unit_time)
                $('#checkinConfirm').attr('data-id', booking[0].booking_id)
                $('#checkinModal').modal('show')
            }

            if (!response.data.result) {
                queryFail("เกิดข้อผิดพลาด", 'ไม่สามารถโหลดข้อมูลได้', response.data.err)
            }
        })
        .catch((err) => {
            queryFail("เกิดข้อผิดพลาด", 'ไม่สามารถโหลดข้อมูลได้', err)
        })
})
