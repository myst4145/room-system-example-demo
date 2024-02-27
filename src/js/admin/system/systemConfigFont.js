document.addEventListener('DOMContentLoaded', () => {
    createPaginateOnLoad()
})
$('button[name="font-delete"]').click(function () {
    confirm('ลบข้อมูลตัวอักษร', 'ต้องการลบตัวอักษรใช่ หรือ ไม่?')
        .then((result) => {
            if (result.isConfirmed) {
                const id = $(this).attr('data-id')
                axios.delete(`/system/font/delete/${id}`)
                    .then((response) => {
                        if (response.data.result) {
                            querySuccess('ลบเรียบร้อย')
                        }
                        if (!response.data.result) {
                            queryFail('เกิดข้อผิดพลาด', 'ลบข้อมูลไม่สำเร็จ', response.data.err)
                        }
                    })
                    .catch((err) => {
                        queryFail('เกิดข้อผิดพลาด', err, '')
                    })
            }
        });

})


$('button[name="config-font-modal"]').click(function () {
    const act = $(this).attr('data-act')
    const id = $(this).attr('data-id')
    $('#fontForm')[0].reset()

    switch (act) {
        case 'insert':
            retainRadioValue($('[name="storage-type"]'), 'new')
            $('#fontSubmit').attr('data-act', act)
            $('#storageDisplay').css('display', 'none')
            $('#systemConfigFontModal').modal('show')
            break;
        case 'update':
            retainRadioValue($('[name="storage-type"]'), 'old')
            $('#storageDisplay').css('display', 'block')
            $('#fontSubmit').attr('data-act', act).attr('data-id', id)
            getDataById(id)
            break;
        default:
            break;
    }
})
$('#fontUpload').change(function () {
    retainRadioValue($('[name="storage-type"]'), 'new')
})