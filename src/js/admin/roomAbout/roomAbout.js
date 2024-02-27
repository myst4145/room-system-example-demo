$('[name="open-roomabout-modal"]').click(function () {
    const act = $(this).data('act')
    const id = $(this).data('id')
    switch (act) {
        case 'add':
            $('#room-desc').val('')
            $('#title').val('')
            $('#title').prop('disabled', false)
            $('#about-preview').html(``)
            $('.empty-validate').css('display', 'none')
            $('#aboutSubmit').attr('data-act', 'insert')
            $('#aboutSubmit').attr('data-id', '')
            $('#roomAboutModal').modal('show')
            break;
        case 'edit':
            $('#aboutSubmit').attr('data-act', 'update')
            $('#aboutSubmit').attr('data-id', id)
            getRoomAboutById(id)
        default:
            break;
    }
})




$('.switch-status').change(function () {
    const id = $(this).val()
    const el = $(this)
    const checked = el.is(':checked')
    const status = checked ? 'on' : 'off'
    const data = {
        'status': status
    }
    axios.put(`/about/status/${id}`, data)
        .then((res) => {
            const result = res.data.result
            if (result) success('เปลี่ยนแปลงเรียบร้อย')
            if (!result) {
                el.prop('checked', !checked)
                queryFail('เกิดข้อผิดพลาด', 'อัพเดตสถานะล้มเหลว', res.data.err)
            }

        })
        .catch((err) => {
            queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถอัพเดตสถานะข้อมูลได้', err)
        })
})

$('#img').change(function () {
    const f = $(this)[0].files
    console.log(f.length, f)
    if (f.length > 0) {
        const src = URL.createObjectURL(f[0])
        $('#about-preview').html(`<img src="${src}" >`)
    } else {
        $('#about-preview').html('')
    }
})
$('[name="about-delete"]').click(function () {
    const id = $(this).attr('data-id')
    confirm('ลบข้อมูล', 'ต้องการลบข้อมูลนี้ใช่หรือไม่ ?')
        .then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/about/delete/${id}`)
                    .then((res) => {
                        const result = res.data.result
                        if (result) querySuccess('ลบเรียบร้อย')
                        if (!result) {
                            el.prop('checked', !checked)
                            queryFail('ลบข้อมูลล้มเหลว', 'ไม่สามารถลบข้อมูลได้', res.data.err)
                        }

                    })
                    .catch((err) => {
                        queryFail('ลบข้อมูลล้มเหลว', 'ไม่สามารถลบข้อมูลได้', err)
                    })
            }
        });
})