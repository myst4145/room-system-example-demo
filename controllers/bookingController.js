const { db, condb } = require('../modules/DB')
const { errPage } = require('../modules/errPage')
const { getDateStampisDailyQuery, getDateStampisMonthlyQuery } = require('../modules/getChecinAndCheckoutDate')
const { getDataEntriesCount } = require('../modules/getDataEntriesCount')
const { getDateStampAndTransactionMonthly } = require('../modules/getDateStampAandTransaction')
const { getEntriesDataAllBySqlQuery } = require('../modules/getEntriesDataAllBySqlQuery')
const { getIsValidBookingData } = require('../modules/getIsValidBookingData')
const { getIsValidReserveQuery } = require('../modules/getIsValidReserveQuery')
const { getMemberIdBySession } = require('../modules/getMemberData')
const { getPagination } = require('../modules/getPagination')
const getPerPageAndEntryRow = require('../modules/getPerPageAndEntryRow')
const { getTransactionMonthly } = require('../modules/getTransactionMonthly')
const { getThaiMonthByFullDateLocal, getYearByFullDateLocal, getCountDate, getFullYearThai, getThaiMonth } = require('../src/js/dateFunc')
const { display } = require('../src/js/display')
const { getNumberFormat, getUnitTimeDisplay, getRentalTypeDisplay, getRentalStatus } = require('../src/js/func')
const { getCountFullDate, createRandom, totalList } = require('../src/js/function')
const notfoundPage = 'errNotfound'

async function getBookingByRoom(req, res, responseObject, pageRender) {
    try {
        const { row, page } = getPerPageAndEntryRow(req)
        const { rental_type, checkin, checkout, room_type, } = req.query
        const { roomview, bed_type, unit_time, time_count } = req.query
        let sql = ''
        let rooms = []
        let room_number_id_list = []
        const query = {
            checkin,
            checkout,
            rental_type,
            time_count,
            unit_time,
            'room_type': room_type ?? '',
            'bed_type': bed_type ?? '',
            'roomview': roomview ?? '',
        }
        let query_count = Object.keys(req.query).length - 1
        query_count -= req.query.page ? 1 : 0
        query_count -= req.query.row ? 1 : 0
        query_count -= rental_type ? 1 : 0
        query_count -= req.query.checkin ? 1 : 0
        query_count -= req.query.checkout ? 1 : 0
        if (rental_type && checkin && checkout) {

            let date_stamp = rental_type == 'monthly'
                ? getDateStampisMonthlyQuery(checkin, checkout)
                : getDateStampisDailyQuery(checkin, checkout)

            const booking_sql = getIsValidReserveQuery(date_stamp, rental_type)
            const booking = await db(booking_sql)
            room_number_id_list = booking.map((r) => r.room_number_id)
            sql = `SELECT * FROM rooms  WHERE rental_type='${rental_type}' `
            query_count -= time_count ? 1 : 0
            query_count -= unit_time ? 1 : 0



        } else if (rental_type) {
            sql = `SELECT * FROM rooms WHERE rental_type='${rental_type}'`

        } else if (!rental_type || !checkin || !checkout) {
            Object.assign(responseObject, {
                'entries': rooms,
                paginate: {},
                'query': {}
            })
            res.render(pageRender, responseObject)
        }

        if (room_type) sql += ` AND room_type='${room_type}' `
        if (roomview) sql += `AND roomview='${roomview}'`
        if (bed_type) sql += ` AND bed_type='${bed_type}'`
        sql += ` ORDER BY created DESC `


        const results = await db(sql)
        const index_start = (page * row)
        const index_end = (page + 1) * row

        let all = 0
        results.map((r) => {
            Object.assign(r, {
                room_type_display: display.getRoomType(r.room_type),
                bed_type_display: display.getBedType(r.bed_type),
                roomview_display: display.getRoomview(r.roomview)
            })
            let sub = JSON.parse(r.room_sub)
            sub = sub.filter((s) => {
                const has = room_number_id_list.includes(s.room_number_id)
                if (!has && s.soft_delete != 'true') {
                    all += 1
                    return s
                }
            })
            r.room_sub = sub
            return r
        })

        let p = 0
        results.forEach((r, i) => {
            r.room_sub.forEach((s, idx) => {
                let posl = (idx + p)
                if (i > 0 && idx == 0) posl += 1
                p = posl
                if (p >= index_start && p < index_end) {
                    const sub = {
                        room_id: r.room_id,
                        room_type: r.room_type,
                        bed_type: r.bed_type,
                        roomview: r.roomview,
                        price: r.price,
                        room_type_display: r.room_type_display,
                        bed_type_display: r.room_type_display,
                        roomview_display: r.roomview_display,
                        room: s,
                        example_room: r.example_room
                    }
                    if (s.soft_delete != 'true' && s.status != 'unavailable') {
                        rooms.push(sub)
                    }
                }
            })
        })

        const row_all = results
            .map((r) => {
                return r.room_sub.map((s) => s.soft_delete != 'true').length
            })
            .reduce((prev, current) => prev + current, 0)
        const page_all = Math.ceil(row_all / row)

        const paginate = {
            'page_all': page_all,
            'row_all': row_all,
            page,
            row
        }

        Object.assign(responseObject, {
            'entries': rooms,
            paginate,
            'query': query
        })
        res.render(pageRender, responseObject)


    } catch (err) {
        errPage(res, err)
    }

}

function confirm(req, res) {
    const id = req.params.id
    const confirm = req.body.confirm
    const rental_type = req.body.rental_type
    let status = confirm == 'approve' ? 'confirm' : 'progress'
    let pay_status = confirm == 'approve' ? 'paid' : 'unpaid'
    let paid = rental_type == 'daily' ? req.body.paid : 0
    let sql = "UPDATE room_booking SET modified=?"

    let params = [getCountFullDate().timestamp]
    if (confirm == 'approve') {
        if (rental_type == 'daily') {
            sql += `,overdue=?`
            params.push(req.body.overdue)
        }
        params.push(paid)
        sql += ",paid=?"
    }
    if (confirm == 'cancel-approved') {
        status = 'cancel'
        pay_status = 'paid'
        sql += `,overdue=?,total=?,paid=?,deposit=?`
        params.push(...[0, req.body.pay, req.body.pay, 0])

    }

    params.push(...[status, pay_status, id])
    sql += `,status=?,pay_status=? WHERE booking_id=?`

    condb.execute(sql, params, async (err, results, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) {
            if (confirm == 'cancel-approved') {
                const bsql = `SELECT booking_id,room_id,room_number_id FROM room_booking WHERE booking_id='${id}'`
                const booking = await db(bsql)
                if (booking.length > 0) {
                    const room_id = booking[0].room_id
                    const room_number_id = booking[0].room_number_id
                    const rsql = `SELECT room_id,room_sub FROM rooms WHERE room_id='${room_id}'`
                    const room = await db(rsql)
                    if (room.length > 0) {
                        const room_sub = JSON.parse(room[0].room_sub)
                            .map((r) => {
                                if (r.room_number_id == room_number_id) {
                                    r.status = 'available'
                                }
                                return r
                            })
                        console.log(room_sub, room[0].room_sub)
                        const d = [JSON.stringify(room_sub), getCountFullDate().timestamp, room_id]
                        const up = `UPDATE rooms SET room_sub=?,modified=? WHERE room_id=?`
                        condb.execute(up, d, async (err, results, fields) => {
                            if (err) res.send({ 'result': false, 'err': err.message })
                            if (!err) res.send({ 'result': true })
                        })
                    }
                }

            } else {
                res.send({ 'result': true })
            }
        }
    })
}

function cancel(req, res) {
    const { room_id, booking_id, room_number_id } = req.body
    let sql = "UPDATE room_booking SET status='cancel',pay_status='unpaid',"
    sql += `modified='${getCountFullDate().timestamp}' WHERE booking_id='${booking_id}'`

    condb.query(sql, async (err, results, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) {
            condb.execute("SELECT * FROM rooms WHERE room_id=?", room_id, (err, results, fields) => {
                if (err) res.send({ 'result': false, 'err': err.message })
                if (!err) {
                    let roomsub = JSON.parse(results[0].room_sub)
                    roomsub.map((r) => {
                        if (r.room_number_id == room_number_id) {
                            r.status = 'empty'
                        }
                    })
                    const modified = getCountFullDate().timestamp
                    let up = `UPDATE rooms SET room_sub='${JSON.stringify(roomsub)}',`
                    up += `modified='${modified}' WHERE room_id='${room_id}'`
                    condb.query(up, (err, results, fields) => {
                        if (err) res.send({ 'result': false, 'err': err.message })
                        if (!err) res.send({ 'result': true })
                    })
                }
            })
        }
    })

}


async function report(req, res) {
    try {
        const rooms = await db(`SELECT * FROM rooms`)
        let room_number = []
        rooms.forEach((r) => room_number.push(...JSON.parse(r.room_sub)))

        const booking_id = req.params.id

        console.log(booking_id)
        const sql = "SELECT * FROM room_booking WHERE booking_id=?"
        condb.execute(sql, [booking_id], (err, result, fields) => {
            if (err) {
                res.send({ 'result': false, 'err': err.message })
            }

            if (!err) {
                result.map((b) => {
                    const number = room_number.filter((n) => n.room_number_id == b.room_number_id)
                    const n = number.length > 0
                        ? number[0].room_number
                        : 'ไม่พบห้องนี้'

                    Object.assign(b, {
                        'room_number_id': b.room_number,
                        'room_number': n
                    })
                })
                res.send({ 'result': true, 'entries': result })
            }
        })
    } catch (err) {
        res.send({ 'result': false, 'err': err.message })
    }

}


async function addTime(req, res) {
    const id = req.params.id
    const { unit_time, checkout, amount } = req.body
    const data = await db(`SELECT addtime,total,overdue,checkin,room_number_id,transaction FROM room_booking WHERE booking_id='${id}'`)
    const checkin = data[0].checkin
    const room_number_id = data[0].room_number_id

    const rental_type = unit_time == 'hours' || unit_time == 'days' ? 'daily' : 'monthly'
    let { date_stamp, transaction } = getDateStampAndTransactionMonthly(rental_type, checkout, checkout)
    let date_stamp_query = getDateStampAndTransactionMonthly(rental_type, checkin, checkout).date_stamp


    let bsql = `SELECT booking_id,total,damages,fname,`
    bsql += `lname,room_number_id,checkin,checkout,status,`
    bsql += `date_stamp,rental_type FROM room_booking `
    bsql += ` WHERE rental_type='${rental_type}' AND room_number_id='${room_number_id}' `
    bsql += ` AND booking_id !='${id}'`
    bsql += ` AND (status ='checkin' OR status='progress' OR status='confirm' ) `
    bsql += ` AND (`

    date_stamp_query.forEach((t, idx) => {
        bsql += ` date_stamp LIKE '%${t}%'`
        if (idx < date_stamp_query.length - 1) bsql += ' OR '
    })

    bsql += `)`

    const bookingData = await db(bsql)
    if (bookingData.length > 0) {
        res.send({ 'result': false, 'valid': true })
    }
    if (bookingData.length == 0) {

        const paymore = parseFloat(req.body.paymore)
        const total = parseFloat(data[0].total) + paymore
        const overdue = parseFloat(data[0].overdue) + paymore
        const modified = getCountFullDate().timestamp
        const addTimeData = JSON.parse(data[0].addtime)

        const last = {
            'unit_time': unit_time,
            'time_count': req.body.time_count,
            'total': req.body.paymore,
            'last_checkout': checkout,
            'last_checkout_time': req.body.checkout_time,
            'old_checkout': req.body.old_checkout,
            'old_checkout_time': req.body.old_checkout_time,
            'amount': amount
        }
        addTimeData.push(last)
        transaction = transaction.filter((t) => t.date != checkin.substring(0, checkin.lastIndexOf('-')))
        let transactions = JSON.parse(data[0].transaction)
        transactions.push(...transaction)

        const count = rental_type == 'monthly'
            ? transactions.length
            : date_stamp_query.length - 1

        let sql = `UPDATE room_booking SET addtime=?,overdue=?,total=?,`
        sql += `date_stamp=?,checkout_time=?,transaction=?,time_count=?,`
        sql += `checkout=?,modified=? WHERE booking_id=?`
        const params = [
            JSON.stringify(addTimeData),
            overdue, total,
            date_stamp_query.join(','), req.body.checkout_time,
            JSON.stringify(transactions),
            transactions.length,
            checkout,
            modified, id
        ]

        condb.execute(sql, params, (err, result, fields) => {
            if (err) res.send({ 'result': false, 'err': err.message })
            if (!err) res.send({ 'result': true })
        })
    }

}
function calendar(req, res) {
    const timestamp = new Date().valueOf()
    const now = display.setDate(timestamp)
    const rental_type = req.query.rental_type
    const _date = now.split('-')
    const [year, , date] = _date
    const month = req.query.month
    const sumMonth = new Date(year, month, 0).getDate()
    const checkin = `${year}-${month}-01`
    const checkout = `${year}-${month}-${sumMonth}`
    const date_stamp = getDateStampisDailyQuery(checkin, checkout)
    const id = req.params.id

    let sql = `SELECT room_number_id,date_stamp FROM room_booking `
    sql += ` WHERE room_number_id=? `
    sql += ` AND  (  `
    date_stamp.forEach((t, idx) => {
        sql += ` date_stamp LIKE '%${t}%'`
        if (idx < date_stamp.length - 1) sql += ' OR '
    })
    sql += ` ) `

    condb.execute(sql, [id], async (err, results, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) {
            let booking = []
            if (results.length > 0 && rental_type == 'monthly') {
                booking = date_stamp
            } else {
                results.forEach((r) => {
                    booking.push(...r.date_stamp.split(','))
                })
            }
            res.send({ 'result': true, 'entries': booking })
        }
    })
}

async function checkinConfirm(req, res) {
    console.log('dddd')
    const id = req.params.id
    const accept_order = req.body.accept_order
    const { room_id, room_number_id } = req.body
    const total = parseFloat(req.body.total)
    const overdue = parseFloat(req.body.overdue)
    const paid = total - overdue
    const modified = getCountFullDate().timestamp
    const status = accept_order == 'false' ? 'cancel' : 'checkin'
    let params = ['resting', status]
    let sql = `UPDATE room_booking SET itemtype=?,status=?,`
    if (room_id != '' && room_number_id != '' && !isNaN(total) && !isNaN(paid) && !isNaN(overdue)) {
        sql += `total=?,overdue=?,paid=?,room_id=?,room_number_id=?,`
        params.push(...[total, overdue, paid, room_id, room_number_id])
    }



    if (accept_order == 'false') {
        sql += `total=?,paid=?,overdue=?,deposit=?,`
        params.push(...[req.body.paid, req.body.paid, 0, 0])
    }
    sql += `modified=? WHERE booking_id=?`
    params.push(...[modified, id])
    console.log(params, sql)
    condb.execute(sql, params, async (err, results, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) {
            if (accept_order == 'false') {
                const bsql = `SELECT booking_id,room_id,room_number_id FROM room_booking WHERE booking_id='${id}'`
                const booking = await db(bsql)
                if (booking.length > 0) {
                    const room_id = booking[0].room_id
                    const room_number_id = booking[0].room_number_id
                    const rsql = `SELECT room_id,room_sub FROM rooms WHERE room_id='${room_id}'`
                    const room = await db(rsql)
                    if (room.length > 0) {
                        const room_sub = JSON.parse(room[0].room_sub)
                            .map((r) => {
                                if (r.room_number_id == room_number_id) {
                                    r.status = 'available'
                                }
                                return r
                            })
                        const d = [JSON.stringify(room_sub), getCountFullDate().timestamp, room_id]
                        const up = `UPDATE rooms SET room_sub=?,modified=? WHERE room_id=?`
                        condb.execute(up, d, async (err, results, fields) => {
                            if (err) res.send({ 'result': false, 'err': err.message })
                            if (!err) res.send({ 'result': true })
                        })
                    }
                }

            } else {
                res.send({ 'result': true })
            }
        }
    })
}

async function insert(req, res) {
    const { room_number_id, rental_type } = req.body
    const { checkin, checkout } = req.body

    let date_stamp = []
    if (rental_type == 'monthly') date_stamp = getDateStampisMonthlyQuery(checkin, checkout)
    if (rental_type == 'daily') date_stamp = getDateStampisDailyQuery(checkin, checkout)
    if (rental_type == 'daily-no-limit') date_stamp = getDateStampisDailyQuery(checkin, checkin)
    const is_valid_sql = getIsValidReserveQuery(date_stamp, rental_type)

    const bookingData = await db(is_valid_sql)
    const room_number_id_list = getIsValidBookingData(rental_type, bookingData)
    const hasId = room_number_id_list.includes(room_number_id)

    if (hasId) res.send({ 'result': true, is_valid: false })
    if (!hasId) {
        const booking_id = `B${getCountFullDate().r}${createRandom()}`
        const created = getCountFullDate().timestamp
        const modified = getCountFullDate().timestamp
        const transaction = getTransactionMonthly(rental_type, date_stamp)
        const total = parseFloat(req.body.total)
        const paid = parseFloat(req.body.paid)
        const overdue = total - paid

        const sql = "INSERT INTO room_booking VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
        const data = [
            booking_id,
            req.body.room_id,
            req.body.room_number_id,
            req.body.time_count,
            req.body.unit_time,
            req.body.fname,
            req.body.lname,
            req.body.amount_people_stay,
            req.body.phone,
            req.body.checkin,
            created.split(' ')[1],
            req.body.checkout,
            '18:00:00',
            created,
            modified,
            req.body.payment,
            'paid',
            '',
            paid,
            req.body.deposit,
            0,
            total,
            'confirm',
            req.body.over_people_type,
            req.body.itemtype,
            req.body.rental_type,
            req.body.emp_id,
            JSON.stringify(transaction),
            overdue,
            req.body.insurance_cost,
            JSON.stringify([]),
            0,
            0,
            req.body.other,
            0,
            JSON.stringify([]),
            req.body.emp_id,
            'false',
            date_stamp.join(','),
            'false',
            0,
            JSON.stringify([]),
            0
        ]
        console.log(data.length)
        condb.execute(sql, data, async (err, results, fields) => {
            if (err) res.send({ 'result': false, 'err': err.message })
            if (!err) {

                if (rental_type == 'daily') {
                    res.send({ 'result': true })
                }
                if (rental_type != 'daily') {
                    const room_id = req.body.room_id
                    const room_number_id = req.body.room_number_id
                    const rooms = await db(`SELECT room_id,room_sub FROM rooms WHERE room_id='${room_id}'`)
                    const room_sub = JSON.parse(rooms[0].room_sub)
                        .map((s) => {
                            if (s.room_number_id == room_number_id) {
                                s.status = 'unavailable'
                            }
                            return s
                        })
                    const params = [JSON.stringify(room_sub), room_id]
                    const update = `UPDATE rooms SET room_sub=? WHERE room_id=? `
                    condb.execute(update, params, (err, results, fields) => {
                        if (err) res.send({ 'result': false, 'err': err.message })
                        if (!err) res.send({ 'result': true })
                    })
                }
            }
        })
    }



}

async function bookingReport(req, res, responseObject, pageRender) {
    try {
        const { checkin, checkout, rental_type } = req.query
        const { id, name } = req.query
        const { page, row, index_start } = getPerPageAndEntryRow(req)

        if ((checkin && checkout && rental_type) || (id || name)) {
            let date_stamp = rental_type == 'monthly'
                ? getDateStampisMonthlyQuery(checkin, checkout)
                : getDateStampisDailyQuery(checkin, checkout)

            let sql = `SELECT * FROM room_booking `
            sql += ` WHERE rental_type='${rental_type}' `
            sql += ` AND (`


            date_stamp.forEach((t, idx) => {
                sql += ` date_stamp LIKE '%${t}%'`
                if (idx < date_stamp.length - 1) sql += ' OR '
            })

            sql += `)`
            if (id) sql = `SELECT * FROM room_booking WHERE booking_id='${id}'`

            if (name) {
                sql = 'SELECT * FROM room_booking WHERE '
                const name_query = name.split('-')
                for (let i = 0; i < name_query.length; i++) {
                    const n = name_query[i].trim()
                    sql += `( fname LIKE '%${n}%' OR lname LIKE '%${n}%' )`
                    if (i < name_query.length - 1) sql += " OR "
                }
            }

            const row_all = await getEntriesDataAllBySqlQuery(sql, '*', 'booking_id')

            sql += ` ORDER BY created DESC`
            sql += ` LIMIT ${index_start},${row} `

            condb.execute(sql, (err, result, fields) => {
                if (err) errPage(res, err)
                if (!err) {
                    result.map((b) => {
                        Object.assign(b, {
                            'total_display': getNumberFormat(b.total)
                        })
                    })
                    const paginate = getPagination(row_all, row, page)
                    const query = {
                        'checkin': checkin ?? '',
                        'checkout': checkout ?? '',
                        'rental_type': rental_type ?? '',
                        'name': name ? name.replaceAll('-', ' ') : '',
                        'id': id ?? ''
                    }
                    Object.assign(responseObject,
                        {
                            'entries': result,
                            paginate,
                            query
                        })

                    res.render(pageRender, responseObject)
                }
            })
        } else if (!checkin || !checkout || !rental_type) {
            Object.assign(responseObject,
                {
                    'query': {},
                    'paginate': {},
                    'entries': []
                })
            res.render(pageRender, responseObject)
        }



    } catch (err) {
        errPage(res, err)
    }

}


async function rentalManage(req, res, responseObject, pageRender) {
    const { row, page, index_start } = getPerPageAndEntryRow(req)
    const { status, type, id } = req.query
    let sql = "SELECT * FROM room_booking WHERE itemtype='resting'"
    if (status && status != 'all') sql += ` AND status = '${status}' `
    if (type && type != 'all') sql += ` AND rental_type = '${type}' `
    if (id && id != '') sql += ` AND booking_id = '${id}' `
    sql += ` AND soft_delete !='true' ORDER BY created DESC `
    const bookingData = await db(sql.replaceAll('*', `count(booking_id) AS count`))
    const row_all = bookingData[0].count
    sql += " LIMIT ?,?"
    const params = [index_start, row]
    condb.execute(sql, params, (err, results, fields) => {
        if (err) errPage(res, err)
        if (!err) {
            const paginate = getPagination(row_all, row, page)
            results.map((r) => {
                Object.assign(r,
                    {
                        'total_format': getNumberFormat(r.total),
                        'rental_type_display': getRentalTypeDisplay(r.rental_type)
                    })
                return r
            })
            Object.assign(responseObject,
                {
                    'status': status,
                    'entries': results,
                    paginate,
                    query: {
                        'status': status ?? '',
                        'id': id ?? ''
                    }
                })
            res.render(pageRender, responseObject)
        }
    })
}

async function rentalMonthly(req, res, responseObject, pageRender) {
    try {
        const { row, page, index_start } = getPerPageAndEntryRow(req)
        const status = req.query.status ?? 'checkin'
        const { type, id } = req.query
        let sql = `SELECT * FROM room_booking WHERE rental_type='monthly'`
        sql += `AND itemtype='resting' `
        if (status != 'all') sql += ` AND status = '${status}' `
        if (type && type != 'all') sql += ` AND rental_type = '${type}' `
        if (id && id != '') sql += ` AND booking_id = '${id}' `
        sql += ` AND soft_delete !='true' ORDER BY created DESC `
        const bookingData = await db(getDataEntriesCount(sql, '*', 'booking_id'))
        const row_all = bookingData[0].count
        const params = [index_start, row]
        sql += " LIMIT ?,?"
        condb.execute(sql, params, (err, results, fields) => {
            if (err) errPage(res, err)
            if (!err) {
                const paginate = getPagination(row_all, row, page)
                results.map((r) => {
                    Object.assign(r,
                        {
                            'total_format': getNumberFormat(r.total),
                        })
                    return r
                })

                Object.assign(responseObject, {
                    'entries': results,
                    paginate,
                    query: { 'status': status ?? '' }
                })
                res.render(pageRender, responseObject)
            }
        })
    } catch (err) {
        errPage(res, err)
    }

}

async function rentalDaily(req, res, responseObject, pageRender) {
    try {
        const status = req.query.status ?? 'checkin'
        const { type, id } = req.query
        const { index_start, page, row } = getPerPageAndEntryRow(req)
        let sql = "SELECT * FROM room_booking WHERE (rental_type='daily' OR rental_type='daily-no-limit' ) AND itemtype='resting'"
        if (status != 'all') sql += ` AND status = '${status}'`
        if (type && type != 'all') sql += ` AND rental_type = '${type}' `
        if (id && id != '') sql += ` AND booking_id = '${id}' `
        sql += ` AND soft_delete !='true' ORDER BY created DESC `
        const row_all = await getEntriesDataAllBySqlQuery(sql, '*', 'booking_id')
        sql += " LIMIT ?,?"
        const params = [index_start, row]
        condb.execute(sql, params, (err, results, fields) => {
            if (err) errPage(res, err)
            if (!err) {
                results.map((r) => {
                    const rental_data = JSON.stringify({
                        fname: r.fname,
                        lname: r.lname,
                        phone: r.phone
                    })
                    Object.assign(r,
                        {
                            rental_data,
                            'total_format': getNumberFormat(r.total),
                            'rental_type_display': getRentalTypeDisplay(r.rental_type)
                        })
                    return r
                })

                const paginate = getPagination(row_all, row, page)
                Object.assign(responseObject,
                    {
                        'status': status,
                        'entries': results,
                        paginate,
                        'query': { status: status ?? '' }
                    })
                res.render(pageRender, responseObject)
            }
        })
    } catch (err) {
        errPage(res, err)
    }

}

async function getBookingDataAndRoomDataById(req, res) {
    try {
        const id = req.params.id
        const bsql = `SELECT * FROM room_booking WHERE booking_id='${id}'`
        const bookingData = await db(bsql)
        let rooms = []
        let sub = []
        let building = []
        if (bookingData.length > 0) {
            const room_id = bookingData[0].room_id
            const room_number_id = bookingData[0].room_number_id
            rooms = await db(`SELECT * FROM rooms WHERE room_id='${room_id}'`)
            if (rooms.length > 0) {
                const room_sub = rooms[0].room_sub
                price = rooms[0].price
                sub = JSON.parse(room_sub)
                    .filter((s) => s.room_number_id = room_number_id)
                const building_id = sub.length > 0 ? sub[0].building : ''
                building = await db(`SELECT * FROM building WHERE building_id='${building_id}'`)
            }
        }
        res.send({
            'result': true,
            'booking': bookingData,
            'rooms': rooms,
            'room_sub': sub,
            'building': building
        })
    } catch (err) {
        res.send({ 'result': false, 'err': err.message })
    }
}

function getDataById(req, res) {
    const id = req.params.id
    const sql = "SELECT * FROM room_booking WHERE booking_id=?"

    condb.execute(sql, [id], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true, 'entries': result })
    })
}

function getTransactionByDateAndId(req, res) {
    const id = req.params.id
    const sql = "SELECT transaction,deposit FROM room_booking WHERE booking_id=?"

    condb.execute(sql, [id], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': error.message })
        if (!err) {
            const transaction = JSON.parse(result[0].transaction)
            res.send({
                'result': true,
                'transaction': transaction,
                'deposit': result[0].deposit
            })
        }
    })
}

async function payMore(req, res) {
    const id = req.params.id
    const amount = parseFloat(req.body.amount) + parseFloat(req.body.paid)
    const status = req.body.status
    const deduct_deposit = req.body.deposit
    const insert = "SELECT transaction,total,deposit FROM room_booking WHERE booking_id=?"
    condb.execute(insert, [id], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': error.message })
        if (!err) {
            const transaction = JSON.parse(result[0].transaction)
            transaction.map((t) => {
                if (t.date == req.body.date) {
                    t.paid = amount
                    t.pay_at = getCountFullDate().timestamp
                    t.status = status
                }
            })
            const sum_transaction = transaction
                .map((t) => parseFloat(t.paid))
                .reduce((prev, current) => prev + current, 0)
            const total = parseFloat(result[0].total)
            const modified = getCountFullDate().timestamp
            const overdue = parseFloat(result[0].total) - sum_transaction
            const paid = total - overdue
            const deposit = parseFloat(result[0].deposit) - deduct_deposit
            let sql = "UPDATE room_booking SET transaction=?,overdue=?,"
            sql += "paid=?,deposit=?,modified=? WHERE booking_id=?"
            const params = [
                JSON.stringify(transaction),
                overdue, paid, deposit, modified, id
            ]
            condb.execute(sql, params, (err, result, fields) => {
                if (err) res.send({ 'result': false, 'err': err.message })
                if (!err) {
                    res.send(
                        {
                            'result': true, 'overdue': overdue,
                            'paid': paid, 'pay_at': modified,
                            'deposit': deposit, 'amount': amount
                        })
                }
            }
            )
        }
    })
}



async function checkout(req, res) {
    try {
        const id = req.params.id
        const data = await db(`SELECT total FROM room_booking WHERE booking_id='${id}'`)
        const total = parseFloat(data[0].total) ?? 0
        const damages = parseFloat(req.body.damages)
        const overdue = parseFloat(req.body.overdue)
        const paid = overdue
        const insurance_cost_refund = req.body.insurance_cost_refund
        const modified = getCountFullDate().timestamp
        const payat = req.body.payat
        const { checkout, rental_type, checkin, time_count } = req.body
        const insurance_cost_data = payat == 0 ? [] : [{
            'overdue': overdue,
            'damages': damages,
            'total': overdue + damages
        }]

        let params = [
            damages, 0, 0, 'checkout', JSON.stringify(insurance_cost_data),
            insurance_cost_refund, paid
        ]
        let sql = `UPDATE room_booking SET damages=?,deposit=?,`
        sql += `overdue=?,status=?,insurance_cost_data=?,`
        sql += `insurance_cost_refund=?,paid=?,`
        if (rental_type == 'daily-no-limit') {
            const date_stamp = getDateStampisDailyQuery(checkin, checkout)
            sql += `time_count=?,checkout=?,date_stamp=?,total=?,`
            params.push(...[time_count, checkout, date_stamp.join(','), paid + total])
        }
        sql += `modified=? WHERE booking_id=?`
        params.push(...[modified, id])
        condb.execute(sql, params, async (err, result, fields) => {
            if (err) res.send({ 'result': false, 'err': err.message })
            if (!err) {
                if (rental_type == 'daily') {
                    res.send({ 'result': true })
                }
                if (rental_type != 'daily') {
                    const bsql = `SELECT booking_id,room_id,room_number_id FROM room_booking WHERE booking_id='${id}'`
                    const booking = await db(bsql)
                    const { room_id, room_number_id } = booking[0]
                    const rsql = `SELECT room_id,room_sub FROM rooms WHERE room_id='${room_id}'`
                    const rooms = await db(rsql)
                    const roon_sub = JSON.parse(rooms[0].room_sub)
                        .map((s) => {
                            if (s.room_number_id == room_number_id) {
                                s.status = 'available'
                            }
                            return s
                        })
                    const upsql = `UPDATE rooms SET room_sub=?,modified=? WHERE room_id=?`
                    condb.execute(upsql, [JSON.stringify(roon_sub), modified, room_id], (err, result, fields) => {
                        if (err) res.send({ 'result': false, 'err': err.message })
                        if (!err) res.send({ 'result': true })
                    })
                }
            }

        })
    } catch (err) {
        res.send({ 'result': false, 'err': err.message })
    }

}

async function edit(req, res, responseObject, pageRender) {
    try {
        const id = req.query.id
        let booking = await db(`SELECT * FROM room_booking WHERE booking_id='${id}'`)
        booking[0].insurance_cost_data = JSON.parse(booking[0].insurance_cost_data)

        const transaction = JSON.parse(booking[0].transaction).map((t) => {
            const [y, m] = t.date.split('-')
            const month = getThaiMonth(m)
            const year = getFullYearThai(y)
            Object.assign(t, { 'date_thai': `${month} ${year}` })
            return t
        })

        const addtime = JSON.parse(booking[0].addtime).map((t) => {
            Object.assign(t, {
                'unit_display': getUnitTimeDisplay(t.unit_time),
                'last_checkout': t.last_checkout
            })
            return t
        })
        booking[0].addtime = addtime
        booking[0].transaction = transaction
        const room_id = booking[0].room_id
        const room_number_id = booking[0].room_number_id
        let rooms = await db(`SELECT * FROM rooms WHERE room_id='${room_id}'`)
        const room_sub = JSON.parse(rooms[0].room_sub)
        const room = room_sub.filter((r) => r.room_number_id == room_number_id)[0]
        const room_number = rooms.room_number
        const buiding_id = room.building
        let building = await db(`SELECT * FROM building WHERE building_id='${buiding_id}'`)
        Object.assign(responseObject, { 'booking': booking, 'rooms': rooms, 'room': room, 'building': building })
        res.render(pageRender, responseObject)

    } catch (err) {
        errPage(res, err)
    }

}

function update(req, res) {
    const id = req.params.id
    const { rental_type, checkin, checkout } = req.body
    const date_stamp = rental_type == 'monthly'
        ? getDateStampisMonthlyQuery(checkin, checkout)
        : getDateStampisDailyQuery(checkin, checkout)
    const data = [
        req.body.payment,
        req.body.time_count ?? 0, req.body.unit_time,
        req.body.amount_people_stay, req.body.phone,
        req.body.fname, req.body.lname,
        checkin, checkout,
        req.body.paid, req.body.deposit,
        rental_type,
        date_stamp.join(','),
        req.body.emp_id, req.body.total,
        req.body.other, JSON.stringify(req.body.transaction),
        req.body.status, req.body.insurance_cost,
        req.body.insurance_cost_refund, req.body.damages,
        req.body.overdue,
        JSON.stringify(req.body.addtime), req.body.cont_rental_accept,
        getCountFullDate().timestamp, id
    ]


    let sql = "UPDATE room_booking SET payment=?,time_count=?,"
    sql += "unit_time=?,amount_people_stay=?,phone=?,"
    sql += "fname=?,lname=?,checkin=?,checkout=?,"
    sql += "paid=?,deposit=?,rental_type=?,date_stamp=?,"
    sql += "emp_id=?,total=?,other=?,transaction=?,status=?,"
    sql += "insurance_cost=?,insurance_cost_refund=?,damages=?,overdue=?,"
    sql += "addtime=?,cont_rental_accept=?,modified=? WHERE booking_id=?"

    condb.execute(sql, data, (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true })

    })
}

function getDataByDate(req, res) {
    const date = req.params.date
    const start = `${date} 00:00`
    const end = `${date} 23:59`
    let sql = `SELECT * FROM room_booking WHERE `
    sql += ` ((checkin BETWEEN ? AND ?) `
    sql += ` OR  (checkout BETWEEN ? AND ?))`
    sql += ` AND status!=? AND status !=?`
    const params = [start, end, start, end, 'cancel', 'success']

    condb.execute(sql, params, async (error, results, fields) => {
        if (error) res.send({ 'result': false, 'err': error.message })
        if (!error) res.send({ 'result': true, 'entries': results })

    })
}


async function bookingByMember(req, res) {
    try {
        const member_id = await getMemberIdBySession(req)
        const { rental_type, room_number_id } = req.body
        const { checkin, checkout } = req.body

        if (!member_id) {
            res.send(
                {
                    'result': false,
                    'is_token': false,
                    'token_login': req.body.token_link
                })

        } else {
            let date_stamp = []
            if (rental_type == 'daily') date_stamp = getDateStampisDailyQuery(checkin, checkout)
            if (rental_type == 'monthly') date_stamp = getDateStampisMonthlyQuery(checkin, checkout)
            if (rental_type == 'daily-no-limit') date_stamp = getDateStampisDailyQuery(checkin, checkin)

            const is_valid_sql = getIsValidReserveQuery(date_stamp, rental_type)
            const bookingData = await db(is_valid_sql)
            const room_number_id_list = getIsValidBookingData(rental_type, bookingData)
            const hasId = room_number_id_list.includes(room_number_id)
            if (hasId) {
                res.send({ 'result': false, 'is_valid': false })
            }
            if (!hasId) {
                const booking_id = `B${getCountFullDate().r}${createRandom()}`
                const created = getCountFullDate().timestamp
                const modified = getCountFullDate().timestamp
                const transaction = getTransactionMonthly(rental_type, date_stamp)
                const unit_time = rental_type == 'monthly' ? 'months' : 'days'
                const total = rental_type == 'daily-no-limit' ? 0 : req.body.total
                const deposit = rental_type == 'daily' ? 0 : req.body.deposit
                const overdue = total
                const is_promotion = req.body.is_promotion == 'true'
                const promotion_data = is_promotion ? req.body.promotion : JSON.stringify([])
                const sql = "INSERT INTO room_booking VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                const data = [
                    booking_id,
                    req.body.room_id,
                    req.body.room_number_id,
                    req.body.time_count,
                    unit_time,
                    req.body.fname,
                    req.body.lname,
                    req.body.amount_people_stay,
                    req.body.phone,
                    req.body.checkin,
                    created.split(' ')[1],
                    req.body.checkout,
                    '18:00:00',
                    created,
                    modified,
                    '',
                    'unpaid',
                    '',
                    0,
                    deposit,
                    0,
                    total,
                    'progress',
                    "not-calculate",
                    "booking",
                    req.body.rental_type,
                    '',
                    JSON.stringify(transaction),
                    overdue,
                    0,
                    JSON.stringify([]),
                    0,
                    0,
                    '',
                    0,
                    JSON.stringify([]),
                    member_id,
                    'false',
                    date_stamp.join(','),
                    'false',
                    0,
                    promotion_data,
                    req.body.promotion_discount
                ]
                console.log(data)
                const room_id = req.body.room_id
                const room_number_id = req.body.room_number_id
                condb.execute(sql, data, async (err, results, fields) => {
                    if (err) res.send({ 'result': false, 'err': err.message })
                    if (!err) {
                        if (rental_type != 'daily') {
                            const rooms = await db(`SELECT room_id,room_sub FROM rooms WHERE room_id='${room_id}'`)
                            let room_sub = JSON.parse(rooms[0].room_sub)
                                .map((s) => {
                                    if (s.room_number_id == room_number_id) {
                                        s.status = 'unavailable'
                                    }
                                    return s
                                })
                            const params = [JSON.stringify(room_sub), room_id]
                            const update = `UPDATE rooms SET room_sub=? WHERE room_id=? `
                            condb.execute(update, params, async (err, results, fields) => {
                                if (err) res.send({ 'result': false, 'err': err.message })
                            })
                        }
                        const csql = `SELECT * FROM booking_count WHERE room_number_id='${room_number_id}'`
                        const booking_count = await db(csql)
                        let b_up_sql = ``
                        let c_params = []
                        if (booking_count.length == 0) {
                            const cId = 'RNCB' + createRandom()
                            b_up_sql = `INSERT INTO booking_count VALUES (?,?,?,?,?,?)`
                            c_params = [cId, room_id, room_number_id, 1, created, modified]
                        } else if (booking_count.length > 0) {
                            c_params = [parseInt(booking_count[0].count) + 1, modified, room_number_id]
                            b_up_sql = `UPDATE booking_count SET count=?,`
                            b_up_sql += `modified=? WHERE room_number_id=? `
                        }
                        condb.execute(b_up_sql, c_params, (err, rows, fields) => {
                            if (err) res.send({ 'result': false, 'err': err.message })
                            if (!err) {
                                res.send({ 'result': true, 'booking_id': booking_id })
                            }
                        })
                    }
                })
            }
        }
    } catch (err) {
        res.send({ 'result': false, 'err': err.message })
    }
}


async function slip_payment(req, res) {
    try {
        const member_id = await getMemberIdBySession(req)
        if (!member_id) {
            res.send(
                {
                    'result': false,
                    'err': 'TokenLoginIsValid',
                }
            )

        } else {
            const id = req.params.id
            const statement = req.file.filename
            const sql = "UPDATE room_booking SET statement=?,pay_status=? WHERE booking_id=?"
            condb.execute(sql, [statement, 'pending', id], (err, results, fields) => {
                if (err) res.send({ 'result': false, 'err': err.message })
                if (!err) res.send({ 'result': true })
            })
        }

    } catch (err) {
        res.send({ 'result': false, 'err': err.message })
    }

}

async function checkin(req, res, responseObject, pageRender) {
    try {
        const { page, row, index_start } = getPerPageAndEntryRow(req)
        let sql = "SELECT * FROM room_booking WHERE status='confirm' "
        const row_all = await getEntriesDataAllBySqlQuery(sql, '*', 'booking_id')
        const paginate = getPagination(row_all, row, page)
        sql += `LIMIT ?,?`
        condb.execute(sql, [index_start, row], (err, result, fields) => {
            if (err) errPage(res, err)
            if (!err) {
                result.map((r) => {
                    Object.assign(r, { 'rental_type_display': getRentalTypeDisplay(r.rental_type) })
                    return r
                })
                Object.assign(responseObject, { 'entries': result, paginate, query: {} })
                res.render(pageRender, responseObject)
            }
        })
    } catch (err) {
        errPage(res, err)
    }
}

async function confirmPayment(req, res, responseObject, pageRender) {
    try {
        const { index_start, page, row } = getPerPageAndEntryRow(req)
        let sql = "SELECT * FROM room_booking WHERE pay_status='pending'"
        const row_all = await getEntriesDataAllBySqlQuery(sql, '*', 'booking_id')
        sql += `LIMIT ?,?`
        const paginate = getPagination(row_all, row, page)
        const query = {}
        condb.execute(sql, [index_start, row], (err, result, fields) => {
            if (err) errPage(res, err)
            if (!err) {
                Object.assign(responseObject,
                    {
                        'entries': result,
                        paginate,
                        query
                    }
                )
                res.render(pageRender, responseObject)
            }
        })
    } catch (err) {
        errPage(res, err)
    }


}


async function getDataByCheckin(req, res) {
    try {
        const id = req.params.id
        let booking_sql = `SELECT booking_id,room_id,room_number_id,`
        booking_sql += `fname,lname,time_count,unit_time,total,paid,`
        booking_sql += `rental_type,deposit,checkin,checkout,overdue`
        booking_sql += `  FROM room_booking WHERE booking_id='${id}'`

        const booking = await db(booking_sql)
        const room_id = booking[0].room_id
        const room_number_id = booking[0].room_number_id
        const rooms = await db(`SELECT room_id,room_sub FROM rooms WHERE room_id='${room_id}'`)
        const room_sub = JSON.parse(rooms[0].room_sub)
        const sub = room_sub.filter((r) => r.room_number_id == room_number_id)
        const room_number = sub[0].room_number
        const buiding_id = sub[0].building
        const building = await db(`SELECT * FROM building WHERE building_id='${buiding_id}'`)
        const building_floor = sub[0].building_floor
        const building_name = building[0].building_name


        res.send(
            {
                'result': true,
                'booking': booking,
                room_number,
                building_floor,
                building_name,

            })
    } catch (err) {
        res.send({ 'result': false, 'err': err.message })
    }
}

function getDataByRoomIdAndRoomNumberId(req, res) {
    let sql = `SELECT room_id,room_sub,price`
    sql += ` FROM rooms WHERE room_id=?`
    const { room_id, room_number_id } = req.params
    condb.execute(sql, [room_id], (err, results, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) {
            results.map((r) => {
                const room_sub = JSON.parse(r.room_sub)
                const sub = room_sub.filter((s) => s.room_number_id == room_number_id)
                console.log(sub)
                let room_number = ''
                if (sub.length > 0) room_number = sub[0].room_number

                Object.assign(r, {
                    room_number_id,
                    room_number
                })
                return r
            })
            res.send({ 'result': true, 'entries': results })
        }
    })
}



async function isValidBooking(req, res) {
    try {
        const { room_number_id, rental_type } = req.body
        const { checkin, checkout } = req.body

        let date_stamp = []
        if (rental_type == 'monthly') date_stamp = getDateStampisMonthlyQuery(checkin, checkout)
        if (rental_type == 'daily') date_stamp = getDateStampisDailyQuery(checkin, checkout)
        if (rental_type == 'daily-no-limit') date_stamp = getDateStampisDailyQuery(checkin, checkin)
        const is_valid_sql = getIsValidReserveQuery(date_stamp, rental_type)

        const bookingData = await db(is_valid_sql)
        const room_number_id_list = getIsValidBookingData(rental_type, bookingData)
        const hasId = room_number_id_list.includes(room_number_id)

        if (hasId) res.send({ 'result': true, is_valid: false })
        if (!hasId) res.send({ 'result': true, is_valid: true })
    } catch (err) {
        res.send({ 'result': false })
    }

}
async function continous_booking(req, res) {
    const checkin = req.body.checkin
    const checkout = req.body.checkout
    const booking_id = `B${getCountFullDate().r}${createRandom()}`
    const created = getCountFullDate().timestamp
    const modified = getCountFullDate().timestamp
    const rentaltype = req.body.rental_type
    const date_stamp = getDateStampisMonthlyQuery(checkin, checkout)

    let transaction = []
    if (rentaltype == 'monthly') {
        let filter_date_stamp = []
        date_stamp.forEach((r) => {
            const h = r.includes('01')
            if (!h) filter_date_stamp.push(r)
        })

        filter_date_stamp.forEach((t) => {
            const [y, m] = t.split('-')
            transaction.push({
                'date': `${y}-${m}`,
                'paid': 0,
                'pay_at': '',
                'status': 'progress'
            })
        })
    }


    const sql = "INSERT INTO room_booking VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    const data = [
        booking_id,
        req.body.room_id,
        req.body.room_number_id,
        req.body.time_count,
        req.body.unit_time,
        req.body.fname,
        req.body.lname,
        1,
        req.body.phone,
        req.body.checkin,
        created.split(' ')[1],
        req.body.checkout,
        '18:00:00',
        created,
        modified,
        '',
        '',
        req.body.paid,
        req.body.deposit,
        0,
        req.body.total,
        'checkin',
        '',
        'resting',
        req.body.rental_type,
        req.body.emp_id,
        JSON.stringify(transaction),
        req.body.overdue,
        req.body.insurance_cost,
        JSON.stringify([]),
        0,
        0,
        req.body.other,
        0,
        JSON.stringify([]),
        req.body.emp_id,
        'false',
        date_stamp.join(','),
        'false'
    ]
    condb.execute(sql, data, (err, results, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true })

    })
}

module.exports.BookingController = {
    getBookingByRoom, continous_booking,
    rentalManage, confirm, cancel, report, addTime,
    calendar, checkinConfirm, insert,
    bookingReport, checkout, rentalMonthly, getDataById, getDataByDate,
    getTransactionByDateAndId, payMore, rentalDaily, edit, update,
    bookingByMember, slip_payment, checkin, confirmPayment, getDataByCheckin,
    getDataByRoomIdAndRoomNumberId, isValidBooking, getBookingDataAndRoomDataById
}