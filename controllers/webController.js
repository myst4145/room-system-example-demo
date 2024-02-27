const express = require('express')
const router = express.Router()
const { fetchDataWeb } = require('../src/js/function')
const { display } = require('../src/js/display')
const { condb, db } = require('../modules/DB')
const { getNumberFormat, getUnitTimeDisplay, getRentalTypeDisplay, getPaymentStatus, getPromotionTypeFormat } = require('../src/js/func')
const { getDateTimeisThaiByDateTime, getTimeStampByDate, setDate, getTimeStampisNow, getDateisShortThai, getDateIsNow } = require('../src/js/dateFunc')
const { getDataWeb } = require('../modules/getDataWeb')
const { getDateStampisDailyQuery, getDateStampisMonthlyQuery } = require('../modules/getChecinAndCheckoutDate')
const { getPagination } = require('../modules/getPagination')
const getPerPageAndEntryRow = require('../modules/getPerPageAndEntryRow')
const { getIsValidBookingData } = require('../modules/getIsValidBookingData')
const { getIsValidReserveQuery } = require('../modules/getIsValidReserveQuery')
const { getDataEntriesCount } = require('../modules/getDataEntriesCount')
const { getEntriesDataAllBySqlQuery } = require('../modules/getEntriesDataAllBySqlQuery')
const { getMemberIdBySession } = require('../modules/getMemberData')
const { getPromotionData } = require('../modules/getPromotionData')
const { getPromotionDataAll } = require('../modules/promotion')
const { errPage } = require('../modules/errPage')

const notfoundPage = 'errNotfound'
const bcrypt = require('bcrypt');
const saltRounds = 10;


async function home(req, res) {
    try {

        const member_id = await getMemberIdBySession(req)
        const _date = getDateIsNow()
        const promotionData = await getPromotionDataAll()
        let entries = await getDataWeb()
        const room_about = await db("SELECT * FROM room_about WHERE status='on' ORDER BY modified DESC LIMIT 0,4")
        const slide = await db("SELECT * FROM slide WHERE status='on'")
        let rooms = await db("SELECT * FROM rooms WHERE soft_delete!='true' ORDER BY modified DESC")
        const bookingData = await db(`SELECT count(booking_id) AS count FROM room_booking WHERE status!='cancel'`)
        const bookingCount = bookingData[0].count
        const roomCount = rooms.map((r) => {
            const sub = JSON.parse(r.room_sub).map((s) => s.soft_delete != 'true')
            Object.assign(r, { 'count': sub.length })
            return r.count
        }).reduce((prev, current) => prev + current, 0)
        let roomData = []
        const _promotion = promotionData.map((p) => {
            const _p = getPromotionData(0, p)
            Object.assign(p, _p)
            return p
        })
        console.log(_promotion)
        rooms.forEach((r) => {
            const room_sub = JSON.parse(r.room_sub)
            room_sub.forEach(async (s) => {

                const displayRoom = display.getRoomType(r.room_type)
                const displayBed = display.getBedType(r.bed_type)
                const displayView = display.getRoomview(r.roomview)
                const rentalTypeDisplay = getRentalTypeDisplay(r.rental_type)

                const data = {
                    'room': displayRoom,
                    'bed': displayBed,
                    'view': displayView,
                    'rental_type_display': rentalTypeDisplay,
                    'price_format': getNumberFormat(r.price)
                }
                if (s.soft_delete != 'true') {
                    const has_promotion = promotionData
                        .findIndex((p) => {
                            const room_number_id = p.room_number_id.split(',')
                            const h = room_number_id.includes(s.room_number_id)
                            return h
                        })
                    if (has_promotion >= 0) {
                        const promotion = getPromotionData(r.price, promotionData[has_promotion])
                        const is_promotion = promotion.is_promotion

                        if (is_promotion) {
                            Object.assign(s, {
                                is_promotion,
                                promotion,
                                'new_price': getNumberFormat(promotion.new_price)
                            })
                            Object.assign(s, data)
                            Object.assign(s, r)
                            roomData.push(s)
                        }


                    }

                }

            })


        })
        res.render('web/index',
            {
                'result': true,
                'data': entries,
                'rooms': roomData,
                'room_about': room_about,
                'slide': slide,
                'booking_count': bookingCount,
                'room_count': roomCount,
                promotion: _promotion,
                'member_id': member_id
            })

    } catch (err) {
        errPage(res, err)
    }


}

async function getDataByRoomId(req, res) {

    try {
        const member_id = await getMemberIdBySession(req)
        let data = await getDataWeb()
        const room_number_id = atob(req.params.room_number)
        const room_id = atob(req.params.room_id)
        let entries = {}
        condb.query("SELECT * FROM rooms WHERE room_id=? ", room_id, async (err, result, fields) => {
            if (err) {
                res.render(notfoundPage, {
                    'msg': err,
                    'err_no': err.errno
                })
            }

            if (!err) {
                const fetch_room_db = await db(`SELECT * FROM room_about WHERE title='${display.getRoomType(result[0].room_type)}'`)
                const fetch_bed_db = await db(`SELECT * FROM room_about WHERE title='${display.getBedType(result[0].bed_type)}'`)
                const fetch_view_db = await db(`SELECT * FROM room_about WHERE title='${display.getRoomview(result[0].roomview)}'`)


                const room_descript = fetch_room_db[0] ? fetch_room_db[0].descript : ''
                const bed_descript = fetch_bed_db[0] ? fetch_bed_db[0].descript : ''
                const view_descript = fetch_view_db[0] ? fetch_view_db[0].descript : ''


                result.forEach((r) => {
                    const room_sub = JSON.parse(r.room_sub)
                    const room = display.getRoomType(r.room_type)
                    const bed = display.getBedType(r.bed_type)
                    const view = display.getRoomview(r.roomview)
                    const special_options = r.special_options != '' ? r.special_options.split(',') : []



                    room_sub.forEach((n) => {
                        const {
                            building,
                            building_floor,
                            status } = n
                        const number = n.room_number
                        if (n.room_number_id == room_number_id) {
                            Object.assign(r, {
                                room,
                                'room_descript': room_descript,
                                bed,
                                'bed_descript': bed_descript,
                                view,
                                'view_descript': view_descript,
                                special_options: special_options,
                                'number': n.room_number,
                                'room_number_id': room_number_id,
                                building,
                                building_floor,
                                rental_type_display: getRentalTypeDisplay(r.rental_type),
                                status
                            })

                            Object.assign(entries, r)
                        }

                    })
                })
                res.render('web/room_detail', {
                    'member_id': member_id,
                    'result': true,
                    'data': data,
                    'entries': entries,
                })
            }
        })
    } catch (err) {
        res.render(notfoundPage, {
            'msg': err,
            'err_no': err.errno
        })
    }

}
async function getDataById(req, res) {

    try {
        const id = req.params.id
        const member_id = await getMemberIdBySession(req)
        if (!member_id) {
            res.redirect(`/login?route=${btoa(`/booking/${id}`)}`)
        } else {
            let data = await getDataWeb()
            let paid = 0
            const bookingData = await db(`SELECT * FROM room_booking WHERE booking_id='${id}'`)
            if (bookingData.length > 0) {
                paid = bookingData[0].rental_type == 'daily'
                    ? bookingData[0].total
                    : bookingData[0].deposit
                Object.assign(bookingData[0], {
                    'total_display': getNumberFormat(bookingData[0].total),
                    paid_display: getNumberFormat(paid),
                    'unit_display': getUnitTimeDisplay(bookingData[0].unit_time),
                    'pay_status_display': getPaymentStatus(bookingData[0].pay_status)
                })

            }
            const { room_id, room_number_id } = bookingData[0]
            const roomData = await db(`SELECT room_id,room_sub,example_room FROM rooms WHERE  room_id='${room_id}'`)
            let room_number = ''
            let example_room = []
            if (roomData.length > 0) {
                example_room = roomData[0].example_room.split(',')
                const sub = JSON.parse(roomData[0].room_sub)
                const has_s = sub.findIndex((s) => s.room_number_id == room_number_id)
                if (has_s >= 0) room_number = sub[has_s].room_number
            }
            const is_payment = bookingData[0].pay_status == 'unpaid' || bookingData[0].pay_status == ''
            const payment_display = is_payment ? '' : 'd-none'

            const entries = {
                'member_id': member_id,
                'result': true,
                'data': data,
                'booking': bookingData,
                'rooms': roomData,
                room_number,
                example_room,
                payment_display,
                is_payment
            }

            if (is_payment) {
                const qrcode = await db("SELECT * FROM qrcode")
                let payment = await db("SELECT * FROM payment WHERE status='on' LIMIT 0,4")
                payment = payment.map((p) => {
                    p.bank_number = display.setBankNumberFormat(p.bank_number, p.bank_name)
                    Object.assign(p, { 'bank_display': display.getBank(p.bank_name) })
                    return p
                })
                Object.assign(entries, { qrcode, payment })
            }
            res.render('web/booking_detail', entries)
        }


    } catch (err) {
        res.render(notfoundPage, {
            'msg': err,
            'err_no': err.errno
        })
    }

}

async function store(req, res) {
    const member_id = await getMemberIdBySession(req)
    try {
        const { min, max, room_type, bed_type, roomview, count, rental_type } = req.query
        let sql = ``
        let rooms = []
        let room_number_id_list = []
        let queryCount = Object.keys(req.query).length
        const { row, page } = getPerPageAndEntryRow(req)


        queryCount -= req.query.row ? 1 : 0
        queryCount -= req.query.page ? 1 : 0
        queryCount -= req.query.checkin ? 1 : 0
        queryCount -= req.query.checkout ? 1 : 0
        queryCount -= req.query.count ? 1 : 0
        queryCount -= req.query.rental_type ? 1 : 0

        const checkin = req.query.checkin
        const checkout = req.query.checkout
        const checkin_stamp = getTimeStampByDate(checkin)
        const checkout_stamp = getTimeStampByDate(checkout)
        const now_stamp = getTimeStampByDate(setDate(new Date().valueOf()))

        const isValidDate = (checkin_stamp < now_stamp) || (checkout_stamp < now_stamp)
        if (isValidDate) res.redirect('/reserve')

        if (!isValidDate) {
            const promotion = await getPromotionDataAll()
            let queryParams = {
                'checkin_retain': checkin,
                'checkout_retain': checkout,
                'time_count': count,
                'rental_type': rental_type
            }
            let findQueryCount = 0
            const data = await getDataWeb()
            if (rental_type && rental_type == 'daily' && checkin && checkout) {
                let date_stamp = getDateStampisDailyQuery(checkin, checkout)
                let booking_sql = getIsValidReserveQuery(date_stamp, rental_type)
                const booking = await db(booking_sql)
                room_number_id_list = booking.map((r) => r.room_number_id)
            }

            const indexStart = (page * row)
            const indexEnd = (page + 1) * row
            let row_all = 0


            sql = `SELECT * FROM rooms WHERE  rental_type=? `
            if (queryCount >= 1) sql += ` AND `

            if (room_type) {
                sql += `room_type='${room_type}'`
                queryCount--
                if (queryCount >= 1) {
                    sql += ` AND `
                }
                queryParams = Object.assign(queryParams, {
                    'room_type': room_type,
                    'room_type_retain': display.getRoomType(room_type)
                })
                findQueryCount++
            }

            if (bed_type) {
                sql += `bed_type='${bed_type}'`
                queryCount--
                if (queryCount >= 1) {
                    sql += ` AND `
                }
                queryParams = Object.assign(queryParams, {
                    'bed_type': bed_type,
                    'bed_type_retain': display.getBedType(bed_type)
                })
                findQueryCount++
            }

            if (roomview) {
                sql += `roomview='${roomview}'`
                queryCount--
                if (queryCount >= 1) {
                    sql += ` AND `
                }
                queryParams = Object.assign(queryParams, {
                    'roomview': roomview,
                    'roomview_retain': display.getRoomview(roomview)
                })
                findQueryCount++
            }
            if (max && min) {
                sql += `(price BETWEEN ${min} AND ${max}) `
                queryParams = Object.assign(queryParams, {
                    'min': min,
                    'min_retain': getNumberFormat(min),
                    'max': max,
                    'max_retain': getNumberFormat(max)
                })
                findQueryCount++
            }

            sql += ` ORDER BY modified`
            condb.query(sql, [rental_type], (err, result, fields) => {
                if (err) {
                    res.render(notfoundPage, {
                        'msg': err,
                        'err_no': err.errno
                    })
                }
                if (!err) {
                    result.map((r) => {
                        let sub = JSON.parse(r.room_sub)
                        r.room_sub = sub.forEach((s) => {
                            const has = room_number_id_list.includes(s.room_number_id)
                            const has_promotion = promotion
                                .findIndex((p) => p.room_number_id.split(',').includes(s.room_number_id))

                            let is_promotion = false
                            let discount_time_in, new_price, discount_txt

                            if (has_promotion >= 0) {
                                const promotionData = getPromotionData(parseFloat(r.price), promotion[has_promotion])
                                discount_time_in = promotionData.discount_time_in
                                is_promotion = promotionData.is_promotion
                                new_price = promotionData.new_price
                                discount_txt = promotionData.discount_txt
                            }
                            if (!has && s.soft_delete != 'true' && s.status != 'unavailable') {
                                let reserve_link = `/reserve_r/${btoa(r.room_id)}/${btoa(s.room_number_id)}`
                                reserve_link += `/${s.room_number}?rental_type=${rental_type}`
                                reserve_link += checkin ? `&checkin=${checkin}` : ''
                                reserve_link += checkout ? `&checkout=${checkout}` : ''
                                reserve_link += count ? `&count=${count}` : ''
                                const enc_rmid = btoa(r.room_id)
                                const enc_rnid = btoa(s.room_number_id)
                                const detail_link = `/room/${enc_rmid}/${enc_rnid}?n=${s.room_number}`
                                const rental_type_display = r.rental_type == 'monthly' ? 'เดือน' : 'คืน'
                                Object.assign(s, {
                                    'room_id': r.room_id,
                                    'room_type_display': display.getRoomType(r.room_type),
                                    'bed_type_display': display.getBedType(r.bed_type),
                                    'roomview_display': display.getRoomview(r.roomview),
                                    'price_format': getNumberFormat(r.price),
                                    rental_type_display,
                                    'example_room': r.example_room.split(','),
                                    'toilet_count': r.toilet_count,
                                    reserve_link,
                                    detail_link,
                                    is_promotion,
                                    discount_time_in,
                                    new_price: getNumberFormat(new_price),
                                    discount_txt
                                })
                                rooms.push(s)
                            }
                        })


                    })
                    row_all = rooms.length
                    const paginate = {
                        'page_all': Math.ceil(row_all / row),
                        'row_all': row_all,
                        page,
                        row
                    }

                    rooms = rooms.filter((r, index) => index >= indexStart && index < indexEnd)

                    res.render('web/reserve',
                        {
                            'member_id': member_id,
                            'result': true,
                            'entries': rooms,
                            'query_params': queryParams,
                            'query_count': findQueryCount,
                            paginate,
                            data,
                            checkin,
                            checkout,
                            count, rental_type,
                            'all': row_all
                        })
                }
            })
        }


    } catch (err) {
        console.log(err)
        res.render(notfoundPage, {
            'msg': err,
            'err_no': err.errno
        })
    }
}


async function booking(req, res) {
    try {
        const { checkin, checkout, rental_type, count } = req.query
        const member_id = await getMemberIdBySession(req)
        console.log(member_id)
        if (!member_id) {
            const { room_id, room_number, room_number_id } = req.params
            let r = `/login?room_number=${room_number}`
            r += checkin ? `&checkin=${checkin}` : ``
            r += checkout ? `&checkout=${checkout}` : ``
            r += count ? `&count=${count}` : ``
            r += `&rental_type=${rental_type}&id=${(room_id)}`
            r += `&rnid=${room_number_id}`
            res.redirect(r)
        } else {
            const now = getTimeStampisNow()
            const checkin_stamp = getTimeStampByDate(checkin)
            if (now > checkin_stamp) {
                res.redirect('/reserve')
            } else {
                const { room_number } = req.params
                const room_id = atob(req.params.room_id)

                let is_valid_sql = ``
                if (rental_type != 'daily') {
                    is_valid_sql = `SELECT * FROM rooms WHERE room_id='${room_id}'`
                }
                if (rental_type == 'daily') {
                    const date_stamp = getDateStampisDailyQuery(checkin, checkout)
                    is_valid_sql = getIsValidReserveQuery(date_stamp, rental_type)
                }


                const isValidBookingData = await db(is_valid_sql)
                const room_number_id_list = getIsValidBookingData(rental_type, isValidBookingData)
                const room_number_id = atob(req.params.room_number_id)
                const hasId = room_number_id_list.includes(room_number_id)
                console.log(hasId)
                if (hasId) {
                    res.redirect('/reserve')
                } else {
                    const _date = getDateIsNow()
                    const memberData = await db(`SELECT * FROM member WHERE member_id='${member_id}'`)
                    const data = await getDataWeb()

                    const promotion_sql = `SELECT * FROM promotion WHERE room_number_id LIKE '%${room_number_id}%' AND date_stamp LIKE '%${_date}%'`
                    const promotion = await db(promotion_sql)
                    console.log(promotion)
                    condb.execute("SELECT * FROM rooms WHERE room_id=? ", [room_id], (err, result, fields) => {
                        if (err) {
                            res.render(notfoundPage, {
                                'msg': err,
                                'err_no': err.errno
                            })
                        }
                        if (!err) {
                            let entries = {}
                            const price = parseFloat(result[0].price)
                            console.log(price)
                            result.forEach((r) => {
                                const room_sub = JSON.parse(r.room_sub)
                                const example_room = r.example_room.split(',')
                                const room_type_display = display.getRoomType(r.room_type)
                                const bed_type_display = display.getBedType(r.bed_type)
                                const roomview_display = display.getRoomview(r.roomview)

                                room_sub.forEach(async (n) => {
                                    if (n.room_number_id == room_number_id) {
                                        entries = {
                                            room_id: r.room_id,
                                            room_type: r.room_type,
                                            bed_type: r.bed_type,
                                            roomview: r.roomview,
                                            price_format: getNumberFormat(r.price),
                                            deposit_format: getNumberFormat(r.deposit),
                                            room_type_display,
                                            bed_type_display,
                                            roomview_display,
                                            'example_room': example_room,
                                            'room_number': room_number,
                                            'room_number_id': n.room_number_id,
                                            'deposit': r.deposit,
                                        }
                                    }
                                })
                            })
                            console.log('promotion', promotion)
                            const is_checkout_display = req.query.checkout ? '' : 'd-none'
                            const is_checkout_disbled = checkout ? 'disabled' : ''
                            const is_checkin_disbled = checkin ? 'disabled' : ''
                            let is_count_display = ''
                            let is_unit_display = ''
                            if (!count) {
                                is_count_display = 'd-none'
                                is_unit_display = 'd-none'
                            }
                            let is_promotion = false
                            let promotion_discount = 0
                            let discount_time_in, new_price, discount_txt
                            if (promotion.length > 0) {
                                const _date = getDateIsNow()
                                const promotionCall = promotion
                                    .filter((p) => {
                                        const date_stamp = p.date_stamp.split(',')
                                        const h = date_stamp.indexOf(_date)
                                        if (h >= 0) return p
                                    })
                                const promotionData = getPromotionData(price, promotionCall[0])
                                discount_time_in = promotionData.discount_time_in
                                is_promotion = promotionData.is_promotion
                                new_price = promotionData.new_price
                                discount_txt = promotionData.discount_txt
                                promotion_discount = promotionData.discount
                            }


                            const total = is_promotion
                                ? parseFloat(new_price) * parseInt(count)
                                : price * parseInt(count)
                            console.log(total)
                            const deposit = result[0].deposit
                            const total_format = getNumberFormat(total)
                            const deposit_format = getNumberFormat(deposit)
                            const paid = rental_type == 'daily' ? total : deposit
                            const paid_format = getNumberFormat(paid)
                            const unit_time_txt = rental_type == 'monthly' ? 'เดือน' : 'วัน'
                            res.render('web/reserve_r',
                                {
                                    'member_id': member_id,
                                    'result': true,
                                    'entries': entries,
                                    'data': data,
                                    'member_data': memberData,
                                    is_checkout_display,
                                    checkin, checkout,
                                    rental_type,
                                    count: count ?? 0,
                                    total: total ?? 0,
                                    total_format,
                                    deposit_format,
                                    deposit,
                                    paid_format,
                                    unit_time_txt,
                                    is_checkout_disbled,
                                    is_checkin_disbled,
                                    is_count_display,
                                    is_unit_display,
                                    new_price,
                                    discount_time_in,
                                    discount_txt,
                                    is_promotion,
                                    promotion_discount,
                                    promotion: is_promotion ? JSON.stringify(promotion) : JSON.stringify([])
                                })
                        }

                    })
                }


            }
        }



    } catch (err) {
        res.render(notfoundPage, {
            'msg': err,
            'err_no': err.errno
        })
    }

}

async function register(req, res) {
    try {

        const member_id = await getMemberIdBySession(req)

        const data = await getDataWeb()
        const qrcode = await db("SELECT * FROM qrcode")
        let payment = await db("SELECT * FROM payment WHERE status='on' LIMIT 0,4")
        payment = payment.map((p) => {
            p.bank_number = display.setBankNumberFormat(p.bank_number, p.bank_name)
            Object.assign(p, { 'bank_display': display.getBank(p.bank_name) })
            return p
        })


        res.render('web/register',
            {
                'member_id': member_id,
                'result': true,
                'data': data,
                'payment': payment,
                'qrcode': qrcode,
            })



    } catch (err) {
        console.log(err)
        res.render(notfoundPage, {
            'msg': err,
            'err_no': err.errno
        })
    }


}

async function login(req, res) {
    try {

        const member_id = await getMemberIdBySession(req)
        console.log(member_id)
        if (member_id) {
            res.redirect('/')
        } else {
            const data = await getDataWeb()
            const qrcode = await db("SELECT * FROM qrcode")
            let payment = await db("SELECT * FROM payment WHERE status='on' LIMIT 0,4")
            payment = payment.map((p) => {
                p.bank_number = display.setBankNumberFormat(p.bank_number, p.bank_name)
                Object.assign(p, { 'bank_display': display.getBank(p.bank_name) })
                return p
            })


            res.render('web/login',
                {
                    'result': true,
                    'data': data,
                    'payment': payment,
                    'qrcode': qrcode,
                    'member_id': member_id,

                })


        }


    } catch (err) {
        console.log(err)
        res.render(notfoundPage, {
            'msg': err,
            'err_no': err.errno
        })
    }
}

async function history(req, res) {
    try {
        const member_id = await getMemberIdBySession(req, res)
        const { index_start, row, page } = getPerPageAndEntryRow(req)
        const status = req.query.status
        if (!member_id) {
            let params = `/history?page=${page}&row=${row}`
            params += status ? `&status=${status}` : ``
            let route = `/login?route=${btoa(params)}`
            res.redirect(route)
        } else {
            const params = [member_id]
            const data = await getDataWeb()

            let sql = `SELECT * FROM room_booking WHERE member_id='${member_id}'`
            if (status && status != 'all') sql += ` AND status='${status}'`
            const row_all = await getEntriesDataAllBySqlQuery(getDataEntriesCount(sql, '*', 'booking_id'))
            sql += ` ORDER BY created DESC  LIMIT ?,? `
            const paginate = getPagination(row_all, row, page)
            const roomData = await db(`SELECT room_id,room_sub,example_room FROM rooms`)
            condb.execute(sql, [index_start, row], (err, result, fields) => {
                if (err) {
                    res.render(notfoundPage, {
                        'msg': err,
                        'err_no': err.errno
                    })
                }
                if (!err) {
                    result.map((r) => {
                        let room_number = ''
                        let example_room = []
                        const has_r = roomData.findIndex((s) => s.room_id == r.room_id)
                        if (has_r >= 0) {
                            example_room = roomData[has_r].example_room.split(',')
                            const sub = JSON.parse(roomData[has_r].room_sub)
                            const has_s = sub.findIndex((s) => s.room_number_id == r.room_number_id)
                            if (has_s >= 0) room_number = sub[has_s].room_number
                        }
                        Object.assign(r,
                            {
                                'unit_display': getUnitTimeDisplay(r.unit_time),
                                'total_format': getNumberFormat(r.total),
                                room_number, example_room,

                            }
                        )
                        return r
                    })
                    console.log(result)
                    res.render('web/history',
                        {
                            'member_id': member_id,
                            'result': true,
                            'data': data,
                            'entries': result,
                            paginate,
                            query_params: { 'status': status ?? '' }
                        })
                }
            })
        }







    } catch (err) {
        console.log(err)
        res.render(notfoundPage, {
            'msg': err,
            'err_no': err.errno
        })
    }
}

async function about(req, res) {
    try {
        const member_id = await getMemberIdBySession(req)
        const data = await getDataWeb()
        res.render('web/about', {
            data,
            'member_id': member_id
        })
    } catch (err) {
        res.render(notfoundPage, {
            'msg': err,
            'err_no': err.errno
        })
    }
}

async function payment(req, res) {
    try {
        const member_id = await getMemberIdBySession(req)

        if (!member_id) {
            res.redirect('/login')
        }

        const qrcode = await db("SELECT * FROM qrcode")
        let payment = await db("SELECT * FROM payment WHERE status='on' LIMIT 0,4")
        payment = payment.map((p) => {
            p.bank_number = display.setBankNumberFormat(p.bank_number, p.bank_name)
            Object.assign(p, { 'bank_display': display.getBank(p.bank_name) })
            return p
        })
        const data = await getDataWeb()
        const id = req.params.id
        const sql = "SELECT * FROM room_booking WHERE booking_id=?"
        condb.execute(sql, [id], async (err, result, fields) => {
            if (err) {
                res.render(notfoundPage, {
                    'msg': err,
                    'err_no': err.errno
                })
            }
            if (!err) {
                if (result.length > 0) {
                    result[0].total = getNumberFormat(result[0].total)
                    result[0].created = getDateTimeisThaiByDateTime(result[0].created)
                    result[0].unit_time = getUnitTimeDisplay(result[0].unit_time)
                }
                const room = await db(`SELECT room_id,room_sub,example_room FROM rooms WHERE room_id='${result[0].room_id}'`)
                const room_sub = JSON.parse(room[0].room_sub).filter((r) => r.room_number_id == result[0].room_number_id)
                const room_number = room_sub.length > 0 ? room_sub[0].room_number : 'ไม่พบห้องนี้'
                console.log(room_sub)
                res.render('web/booking_payment', {
                    data,
                    'member_id': member_id,
                    'entries': result,
                    'room_number': room_number,
                    'example_room': room[0].example_room.split(','),
                    'payment': payment,
                    'qrcode': qrcode,
                })
            }
        })

    } catch (err) {
        console.log(err)
        res.render(notfoundPage, {
            'msg': err,
            'err_no': err.errno
        })
    }
}

async function getRoomAboutDataAll(req, res) {
    try {

        const member_id = await getMemberIdBySession(req)
        const data = await getDataWeb()
        let sql = `SELECT * FROM room_about WHERE status='on' ORDER BY modified DESC`
        const roomAboutData = await db(getDataEntriesCount(sql, '*', 'id'))
        const row_all = roomAboutData[0].count
        const { row, page, index_start } = getPerPageAndEntryRow(req)
        const paginate = getPagination(row_all, row, page)
        sql += ` LIMIT ${index_start},${row}`
        const room_about = await db(sql)
        res.render('web/room_about_other', {
            data,
            'member_id': member_id,
            room_about,
            paginate,
            query_params: {}
        })
    } catch (err) {
        errPage(res, err)
    }
}

async function getRoomDataAll(req, res) {
    try {
        const { row, page, index_start } = getPerPageAndEntryRow(req)
        const index_end = row * (page + 1) - 1
        const member_id = await getMemberIdBySession(req)
        const data = await getDataWeb()
        const buildingData = await db(`SELECT * FROM building WHERE soft_delete !='true'`)
        const roomsData = await db("SELECT * FROM rooms WHERE soft_delete !='true'")
        const bookingCountData = await db(`SELECT * FROM booking_count`)
        const promotionData = await db(`SELECT * FROM promotion`)
        console.log(promotionData)
        let rooms = []
        roomsData.forEach((r) => {
            const sub = JSON.parse(r.room_sub)
            sub.forEach((s) => {
                let building_name = ''
                let building_number = ''
                let new_price = 0
                let is_promotion = false
                let discount_txt = ''
                let discount_time_in = ``
                const hasIndex = buildingData.findIndex((b) => (b.building_id == s.building))
                const booking_count = bookingCountData.filter((r) => r.room_number_id == s.room_number_id)
                const count = booking_count.length > 0 ? booking_count[0].count : 0
                const hasPro = promotionData.findIndex((p) => {
                    return p.room_number_id.split(',').includes(s.room_number_id)

                })
                if (hasPro >= 0) {

                    const promotion = promotionData[hasPro]
                    const { promotion_type } = promotion
                    const amount = parseFloat(promotion.amount)
                    const now = getTimeStampisNow()
                    const date_start = getTimeStampByDate(promotion.date_start)
                    const date_end = getTimeStampByDate(promotion.date_end)
                    if (date_start <= now && date_end >= now) {
                        is_promotion = true
                        const typeFormat = getPromotionTypeFormat(promotion_type)
                        const date_start_txt = getDateisShortThai(promotion.date_start)
                        const date_end_txt = getDateisShortThai(promotion.date_end)
                        console.log(promotion_type)
                        const price = parseFloat(r.price)
                        switch (promotion_type) {
                            case 'percent':
                                new_price = price - ((price * amount) / 100)
                                break;
                            case 'currency':
                                new_price = price - amount
                                break;
                            default:
                                break;
                        }

                        discount_time_in = `ตั้งแต่ ${date_start_txt} ถึง ${date_end_txt} `
                        discount_txt = `ลด ${promotion.amount} ${typeFormat}`
                    }




                }

                if (hasIndex >= 0) {
                    building_name = buildingData[hasIndex].building_name
                    building_number = buildingData[hasIndex].building_number
                }
                const discount_display = is_promotion ? '' : 'd-none'
                Object.assign(s,
                    {
                        building_name,
                        building_number,
                        count,
                        is_promotion,
                        discount_txt,
                        new_price: getNumberFormat(new_price),
                        discount_display,
                        discount_time_in
                    }
                )

                Object.assign(s, r)
                rooms.push(s)
            })
        })
        const row_all = rooms.length
        const paginate = getPagination(row_all, row, page)
        rooms = rooms
            .filter((r, i) => i >= index_start && i <= index_end)
            .map((r) => {
                r.example_room = r.example_room.split(',')
                Object.assign(r, {
                    'rental_display': getRentalTypeDisplay(r.rental_type),
                    'room_type_display': display.getRoomType(r.room_type),
                    'bed_type_display': display.getBedType(r.bed_type),
                    'roomview_display': display.getRoomview(r.roomview),
                    'price_format': getNumberFormat(r.price)
                })
                return r
            })
        res.render('web/room', {
            data,
            'member_id': member_id,
            'rooms': rooms,
            paginate,
            query_params: {}
        })
    } catch (err) {
        res.render(notfoundPage, {
            'msg': err,
            'err_no': err.errno
        })
    }
}

async function member(req, res) {
    try {
        const member_id = await getMemberIdBySession(req)
        if (!member_id) {
            let params = `/member`
            let route = `/login?route=${btoa(params)}`
            res.redirect(route)
        } else {
            const sql = `SELECT * FROM member WHERE member_id=?`
            const data = await getDataWeb()
            condb.execute(sql, [member_id], (err, result, fields) => {
                if (err) errPage(res, err)
                if (!err) {
                    res.render('web/member',
                        {
                            'member_id': member_id,
                            'result': true,
                            'data': data,
                            'entries': result,
                        })
                }
            })
        }

    } catch (err) {
        errPage(res, err)
    }

}
function logout(req, res) {
    req.session.member_id = undefined
    const member_id = req.session.member_id
    if (!member_id) {
        res.send({ 'result': true })
    } else {
        res.send({ 'result': false })
    }



}
module.exports.WebController = {
    home, getDataById, store, getDataByRoomId,
    booking, register, login, history, about,
    payment, getRoomAboutDataAll, getRoomDataAll,
    member, logout
}
