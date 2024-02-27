function getIsValidBookingData(rental_type, data) {
    let room_number_id_list = []
    if (rental_type == 'daily') {
        room_number_id_list = data.map((r) => r.room_number_id)
    } else {
        data.forEach((r) => {
            const room_sub = JSON.parse(r.room_sub)
            room_sub.forEach((s) => {
                if (s.status == 'unavailable') {
                    room_number_id_list.push(s.room_number_id)
                }
            })
        })
    }
    return room_number_id_list
}
module.exports = { getIsValidBookingData }