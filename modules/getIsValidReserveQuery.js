function getIsValidReserveQuery(date_stamp, rental_type) {
    let sql = ''
    if (rental_type == 'daily') {
        sql += `SELECT booking_id,total,damages,fname,`
        sql += `lname,room_number_id,room_id,status,`
        sql += `date_stamp,rental_type FROM room_booking `
        sql += ` WHERE rental_type='${rental_type}' `
        sql += ` AND (status ='checkin' OR status='progress' OR status='confirm' ) `
        sql += ` AND (`

        date_stamp.forEach((t, idx) => {
            sql += ` date_stamp LIKE '%${t}%'`
            if (idx < date_stamp.length - 1) sql += ' OR '
        })

        sql += `)`
    } else {
        sql += `SELECT * FROM rooms WHERE rental_type='${rental_type}'`
    }

    return sql
}
module.exports = { getIsValidReserveQuery }