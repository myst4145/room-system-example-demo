function getRoomAboutById(id) {
    axios.get(`/about/${id}`)
        .then((response) => {
            if (!response.data.result) {
                queryFail('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลได้', response.data.err)
            }
            if (response.data.result) {
                const data = response.data.entries
                $('#room-desc').val(data.descript)
                if (data.type_default == 'default') $('#title').prop('disabled', true)
                $('#title').val(data.title)
                if (data.img != '') $('#about-preview').html(`<img src="/src/img/room_about/${data.img}" >`)
                if (data.img == '') $('#about-preview').children().remove()
                $('#roomAboutModal').modal('show')
            }
        })
        .catch((err) => {
            queryFail('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลได้', err)
        })
}