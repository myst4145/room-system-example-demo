document.addEventListener('DOMContentLoaded', () => {
    createPaginateOnLoad()
})

$('[name="open-building-modal"]').click(function () {
    const act = $(this).attr('data-act')
    const id = $(this).attr('data-id')

    $('#buildingForm')[0].reset()
    $('.empty-validate').css('display', 'none')
    switch (act) {
        case 'add':
            $('#building-submit').attr('data-act', 'insert')
            $('#building-submit').attr('data-id', '')
            $('#buildingModal').modal('show')
            break;
        case 'edit':
            $('#building-submit').attr('data-act', 'update')
            $('#building-submit').attr('data-id', id)
            getBuildingById(id)
            break
        default:
            break;
    }
})


$('#number-floor').keyup(function () {
    const v = Number.parseInt($(this).val().trim())
    const validate = $('#validate-numberfloor')
    if (isNaN(v) == true) {
        $(this).val('')
        validateformEmpty(true, validate, 'ป้อนข้อมูลที่เป็นตัวเลขเท่านั้น')
    } else {
        validateformEmpty(false, validate, '')
    }
})



$('button[name="building-remove"]').click(function () {
    confirm('ลบข้อมูลอาคาร', 'คุณต้องการลบข้อมูลอาคาร รายการนี้ใช่ หรือไม่').then((result) => {
        if (result.isConfirmed) {
            axios.delete(`/building/delete/${$(this).attr('data-id')}`)
                .then((res) => {
                    const result = res.data.result
                    if (result) {
                        querySuccess('ลบเรียบร้อย', 1000)
                    }
                    if (!result) {
                        queryFail('ลบข้อมูลอาคาร', 'ลบข้อมูลไม่สำเร็จ', res.data.err)
                    }
                })
                .catch((err) => {
                    queryFail('ข้อผิดพลาด', err, '')
                })
        }
    })

})