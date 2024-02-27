document.addEventListener('DOMContentLoaded', () => {
    createPaginateOnLoad()
    const query = JSON.parse($('#query').val())
    const room_id = query.room_id
    $('#room-id-find').val(room_id)
})

$('#room-id-find').change(function () {
    const id = $(this).val()
    if (id != '') {
        location.assign(`?p=meta&room_id=${id}`)
    }

})
$('[name="meta-delete"]').click(function () {
    const id = $(this).attr('data-id')
    confirm('ลบ Meta', 'คุณต้องการลบรายการนี้ ใช่หรือ ไม่ ?')
        .then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/meta/delete/${id}`)
                    .then((res) => {
                        const result = res.data.result
                        if (result) querySuccess('ลบเรียบร้อย', 1000)

                        if (!result) {
                            queryFail('meta', 'เกิดข้อผิดพลาดไม่สามารถลบได้ โปรดลองอีกครั้ง', res.data.err)
                        }
                    })
                    .catch((err) => {
                        queryFail('meta', 'เกิดข้อผิดพลาดไม่สามารถลบได้ โปรดลองอีกครั้ง', err)
                    })
            }
        })
})


$('[name="open-meta-modal"]').click(function () {
    const act = $(this).data('act')
    const id = $(this).data('id')
    switch (act) {
        case 'add':
            $('#meta-submit').attr('act', 'insert')
            $('#meta-text').val('')
            $('#room-id').val('')
            $('.empty-validate').css('display', 'none')
            $.each($('[name="meta"]'), (index, el) => $(el).prop('checked', false))
            $('#metaModal').modal('show')
            break;
        case 'edit':
            $('#meta-submit').attr('act', 'update')
            getMetaById(id)
        default:
            break;
    }
})