function getMetaById(id) {
    axios.get(`/meta/edit/${id}`)
        .then((res) => {
            const result = res.data.result
            if (result) {
                const {
                    meta_id,
                    meta_name,
                    content,
                    room_id,
                } = res.data.entries[0]

                $('#meta-submit').attr('data-id', meta_id)
                $('#meta-submit').attr('act', 'update')
                $('#meta-text').val(content)
                $('#room-edit').val(room_id)
                const metaEditRadio = $('[name="meta"]')
                const numberRoomEl = $('#room-id').children()
                for (let i = 0; i < numberRoomEl.length; i++) {
                    const m = $(numberRoomEl[i])
                    const v = m.val()

                    if (v == room_id) {
                        m.prop('selected', true)
                    }
                }
                for (let i = 0; i < metaEditRadio.length; i++) {
                    const m = $(metaEditRadio[i])
                    const v = m.val()

                    if (v == meta_name) {
                        m.prop('checked', true)
                    }
                }
                $('#metaModal').modal('show')
            }
            if (!result) {
                queryFail('แจ้งเตือน', 'ไม่สามารถโหลดข้อมูลได้', res.data.err)
            }

        })
        .catch((err) => {
            queryFail('ข้อผิดพลาด', err, '')
        })
}