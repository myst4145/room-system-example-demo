function getDataById(id) {
    axios.get(`/promotion/${id}`)
        .then((response) => {
            if (!response.data.result) {
                queryFail('แจ้งเตือน', 'ไม่สามารถโหลดข้อมูลได้', response.data.err)
            }
            if (response.data.result) {
                console.log(response.data.entries[0])
                const {
                    promotion_name,
                    promotion_type,
                    amount,
                    date_start,
                    date_end,
                    room_number_id
                } = response.data.entries[0]
                $('#dateStart').val(date_start)
                $('#dateEnd').val(date_end)
                $('#promotionName').val(promotion_name)
                $('#amount').val(amount)

                $.each($('[name="promotiontype"]'), (i, opt) => {
                    if ($(opt).val() == promotion_type) {
                        $(opt).prop('checked', true)
                    }
                })
                $.each($('[name="room-number-id"]'), (i, opt) => {
                    const h = room_number_id.split(',').includes($(opt).val())
                    if (h) $(opt).prop('checked', true)

                })
                $('#promotionSubmit').attr('data-act', 'update').attr('data-id', id)
                $('#promotionModal').modal('show')
            }
        })
        .catch((err) => {
            queryFail('ข้อผิดพลาด', err, '')
        })
}
