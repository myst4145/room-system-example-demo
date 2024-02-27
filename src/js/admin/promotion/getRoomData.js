function getRoomData(act) {
    axios.get('/room/all')
        .then((response) => {
            if (!response.data.result) {
                queryFail('แจ้งเตือน', 'ไม่สามารถโหลดข้อมูลได้', response.data.err)
            }
            if (response.data.result) {
                let roomEl = ``
                const entries = response.data.entries
                roomEl += `<div class="row">`
                entries.forEach((d) => {
                    roomEl += ` <div class="col-md-6">`
                    roomEl += `<div class="d-flex flex-wrap">`
                    d.room_sub.forEach((s) => {
                        roomEl += `<div class="custom-control custom-checkbox m-1">`
                        roomEl += `<input class="custom-control-input" value="${s.room_number_id}" type="checkbox" id="${s.room_number_id}" name="room-number-id">`
                        roomEl += `<label for="${s.room_number_id}" class="custom-control-label">${s.room_number}</label>`
                        roomEl += `</div>`
                    })
                    roomEl += `</div>`
                    roomEl += `</div>`
                })
                roomEl += `</div>`
                $('#roomNumberGroup').html(roomEl)

            }
        }).catch((err) => {
            queryFail('ข้อผิดพลาด', err, '')
        })
}