document.addEventListener('DOMContentLoaded', () => {
    const query = JSON.parse($('#query').val())
    const id = query.id
    $('#findDataByBookingId').val(id)
    createPaginateOnLoad()
})
$('[name="additional-delete"]').click(function () {
    confirm('ลบข้อมูล', 'ต้องการลบข้อมูลรายการนี้ ใช่หรือไม่ ?')
        .then((result) => {
            if (result.isConfirmed) {
                const id = $(this).attr('data-id')
                axios.delete(`/additionalcost/delete/${id}`)
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
$('[name="open-electricity-modal"]').click(function () {
    $('.empty-validate').css('display', 'none')
    const act = $(this).attr('data-act')
    const id = $(this).attr('data-id')
    const is_disabled = act == 'edit'
    $('#booking-id').prop('disabled',is_disabled)
    switch (act) {
        case 'add':
            $('#booking-id').val('')
            $('#fname').val('')
            $('#lname').val('')
            $('#status').val('')
            $('#additionalCostSubmit')
                .attr('data-act', 'insert')
                .attr('data-id', '')
            $('#electricityModal').modal('show')
            break;
        case 'edit':
            $('#additionalCostSubmit')
                .attr('data-act', 'update')
                .attr('data-id', id)
            getAdditionalCostById(id)
            break;
        default:
            break;
    }
})



$('#findDataByBookingIdBtn').click(function () {
    const id = $('#findDataByBookingId').val().trim()
    const page = thisPage(window.location.href)
    if (id != '') location.assign(`${page}&id=${id}`)
})

$('#getDataAll').click(function () {
    const page = thisPage(window.location.href)
    location.assign(page)
})

function getAdditionalCostById(id) {
    axios.get(`/additionalcost/${id}`)
        .then((response) => {
            if (!response.data.result) {
                queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลได้', response.data.err)
            }
            if (response.data.result) {
                const data = response.data.entries[0]
                $('#booking-id').val(data.booking_id)
                $('#fname').val(data.fname)
                $('#lname').val(data.lname)
                retainOptionValue($('#status'), data.status)
                $('#electricityModal').modal('show')
            }
        })
        .catch((err) => {
            queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลได้', err)
        })
}
