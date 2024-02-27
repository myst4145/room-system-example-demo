function getDataById(id) {
    axios.get(`/system/font/${id}`)
        .then((response) => {
            if (response.data.result) {
                const data = response.data.entries
                $('#fontName').val(data[0].font_name)
                $('#storage').val(data[0].storage)
                $('#systemConfigFontModal').modal('show')
            }
            if (!response.data.result) {
                queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลได้', response.data.err)
            }
        })
        .catch((err) => {
            queryFail('เกิดข้อผิดพลาด', err, '')
        })
}