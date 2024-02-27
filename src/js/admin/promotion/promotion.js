document.addEventListener('DOMContentLoaded', () => {
    createPaginateOnLoad()
})
function getDateStart() {
    return $('#dateStart')
}

function getDateEnd() {
    return $('#dateEnd')
}
$('#dateStart').change(function () {
    const dateStartEl = getDateStart()
    const date_stamp = getTimeStampByDate(dateStartEl.val())
    const now_stamp = getTimeStampByDate(getDateIsNow())

    getDateEnd().val('')
    if (date_stamp < now_stamp) {
        queryFail('แจ้งเตือน', 'โปรดเลือกเวลาเป็นเวลาปัจจุบัน', '')
        dateStartEl.val('')
    }
})

$('#dateEnd').change(function () {
    const dateEndEl = getDateEnd()
    const date_start = getTimeStampByDate(getDateStart().val())
    const date_end = getTimeStampByDate(dateEndEl.val())
    const now_stamp = getTimeStampByDate(getDateIsNow())

    let msg = ``
    let validaCount = 0
    if (date_start > date_end) {
        validaCount++
        msg = 'โปรดเลือกวันที่ให้ถูกต้อง วันสิ้นสุดต้องมากกว่าหรือเท่ากับวันเริ่มต้น'
    } else if (date_end < now_stamp) {
        msg = 'โปรดเลือกเวลาเป็นเวลาปัจจุบัน'
        validaCount++
    }


    if (validaCount > 0) {
        dateEndEl.val('')
        queryFail('แจ้งเตือน', msg, '')
    }
})

$('button[name="promotion-remove"]').click(function () {
    const id = $(this).attr('data-id')
    confirm('ลบข้อมูลโปรโมชั่น', 'คุณต้องการลบข้อมูลรายการนี้ใช่ หรือไม่')
        .then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/promotion/delete/${id}`)
                    .then((res) => {
                        const result = res.data.result
                        if (result) {
                            querySuccess('ลบเรียบร้อย', 1000)
                        }
                        if (!result) {
                            queryFail('ลบข้อมูลอาคาร', 'ไม่สามารถลบข้อมูลได้', res.data.err)
                        }
                    })
                    .catch((err) => {
                        queryFail('แจ้งเตือน', 'เกิดข้อผิดพลาด', err)
                    })
            }
        })

})