document.addEventListener('DOMContentLoaded', () => {
    createPaginateOnLoad()
})

$('.switch-slide').change(function () {
    const id = $(this).val()
    const status = $(this).is(':checked') ? 'on' : 'off'
    axios.patch(`/slide/status/${id}`, {
        'status': status
    })
        .then((res) => {
            const result = res.data.result
            if (!result) {
                $(this).prop('checked', !$(this).is(':checked'))
                queryFail('อัพเดตสถานะการแสดงผลภาพสไลด์', 'เกิดข้อผิดพลาดในการอัพเดต', res.data.err)
            }
        })
        .catch((err) => {
            queryFail('ข้อผิดพลาด', err, '',)
        })
})
$('.switch-desc').change(function () {
    const id = $(this).val()
    const status = $(this).is(':checked') ? 'on' : 'off'
    axios.patch(`/slide/descript/${id}`, {
        'status': status
    })
        .then((res) => {
            const result = res.data.result
            if (!result) {
                $(this).prop('checked', !$(this).is(':checked'))
                queryFail('อัพเดตสถานะการแสดงผลคำอธิบายภาพสไลด์', 'เกิดข้อผิดพลาดในการอัพเดต', res.data.err)
            }
        })
        .catch((err) => {
            queryFail('ข้อผิดพลาด', err, '',)
        })
})

$('.switch-title').change(function () {
    const id = $(this).val()
    const status = $(this).is(':checked') ? 'on' : 'off'
    axios.patch(`/slide/title/${id}`, {
        'status': status
    })
        .then((res) => {
            const result = res.data.result
            if (!result) {
                $(this).prop('checked', !$(this).is(':checked'))
                queryFail('อัพเดตสถานะการแสดงผล Title', 'เกิดข้อผิดพลาดในการอัพเดต', res.data.err)
            }
        })
        .catch((err) => {
            queryFail('ข้อผิดพลาด', err, '',)
        })
})
$('[name="slide-delete"]').click(function () {
    const id = $(this).attr('data-id')
    const src = $(this).attr('data-src')

    confirm('ลบรูปภาพสไลด์', 'คุณต้องการลบสไลด์นี้ใช่ หรือไม่ ?')
        .then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/slide/delete/${id}`)
                    .then((res) => {
                        const result = res.data.result
                        if (result) {
                            querySuccess('ลบสำเร็จ')
                        }

                        if (!result) {
                            queryFail('ลบรูปภาพสไลด์', 'ลบภาพสไลด์ล้มเหลว', res.data.err)
                        }

                    })
                    .catch((err) => {
                        queryFail('ข้อผิดพลาด', err, '',)
                    })
            }
        })
})


$('#upload-slide').change(function () {
    const file = $(this)[0].files[0]
    if (file) {
        const src = URL.createObjectURL(file)
        $('#preview-slide').html(`<img src="${src}">`).css('border', '0')
    }

    if (file == undefined) {
        $('#preview-slide').css('border', '1px solid gainsboro').children().remove()
    }

})