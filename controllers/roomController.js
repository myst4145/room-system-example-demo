const { db, condb } = require('../modules/DB')
const { errPage } = require('../modules/errPage')
const { getDateStampisMonthlyQuery, getDateStampisDailyQuery } = require('../modules/getChecinAndCheckoutDate')
const { getDataEntriesCount } = require('../modules/getDataEntriesCount')

const { getPagination } = require('../modules/getPagination')
const getPerPageAndEntryRow = require('../modules/getPerPageAndEntryRow')
const { createRoomSubData } = require('../modules/room')
const { getThaiMonthByFullDateLocal, getYearByFullDateLocal, getCountDate, sumMonth } = require('../src/js/dateFunc')
const { display } = require('../src/js/display')
const { getRentalTypeDisplay } = require('../src/js/func')
const { getCountFullDate, createRandom, whereCheck } = require('../src/js/function')
const sqlModel = require('../src/js/setSQL')
const notfoundPage = 'errNotfound'
const fs = require('fs')
const path = require('path')

function auth(req, res) {
    const { number_room, building_id } = req.body
    condb.query("SELECT * FROM rooms", (err, result, fields) => {
        if (err) {
            res.send({ 'result': false, 'err': err.message })
        }
        if (!err) {
            console.log(req.body)
            let duplicate = 0
            let list_room = []
            result.forEach((r) => {
                list_room.push(...JSON.parse(r.room_sub))
            })

            list_room.forEach((rs) => {
                if (rs.room_number == number_room && rs.building == building_id) {
                    duplicate++
                }

            })
            if (duplicate > 0) {
                res.send({ 'result': false })
            } else {
                res.send({ 'result': true })
            }
        }
    })
}
async function add(req, res, responseObject, pageRender) {
    try {
        const building = await db(`SELECT * FROM building`)
        Object.assign(responseObject, { 'building': building })
        res.render(pageRender, responseObject)

    } catch (err) {
        errPage(res, err)
    }
}

function insert(req, res) {
    const exampleInsert = req.files.example.map((e) => e.filename).join(',')
    const created = getCountFullDate().timestamp
    const modified = getCountFullDate().timestamp
    const roomId = `R${getCountFullDate().r}${createRandom()}`

    const sql = 'INSERT INTO rooms VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    let room_sub = createRoomSubData(JSON.parse(req.body.room_sub))
    const data = [
        roomId,
        req.body.room_type,
        req.body.bed_type,
        req.body.room_view,
        req.body.special_options,
        req.body.detail,
        exampleInsert,
        req.body.bed_amount,
        req.body.max_people,
        req.body.toilet_count,
        req.body.damage,
        req.body.deposit,
        req.body.cost_people_exceed,
        req.body.cost_expense_time,
        req.body.price,
        req.body.tel,
        JSON.stringify(room_sub),
        created, modified,
        req.body.rental_type,
        'false'
    ]

    condb.execute(sql, data, (error, results, fields) => {
        if (error) res.send({ 'result': false, 'err': error.message })
        if (!error) res.send({ 'result': true })
    })
}


async function edit(req, res, responseObject, pageRender) {
    try {
        console.log('roomEdit')
        const building = await db(`SELECT * FROM building`)

        condb.query("SELECT * FROM rooms WHERE room_id=? ", req.query.id, (err, result, fields) => {
            if (err) errPage(res, err)

            if (!err) {
                const rooms = []

                result.forEach((r, i) => {
                    console.log('r : ', i, r.room_sub.length)
                    const sub = JSON.parse(r.room_sub)
                    sub.forEach((s) => {
                        const filterB = building.filter((b) => b.building_id == s.building)
                        const floor_count = filterB.length > 0 ? filterB[0].floor_count : undefined

                        Object.assign(s, { 'floor_count': floor_count })
                    })
                    r.room_sub = JSON.stringify(sub)
                    rooms.push(r)
                })

                Object.assign(responseObject,
                    {
                        'building': building,
                        'entries': rooms
                    })
                res.render(pageRender, responseObject)
            }

        })
    } catch (err) {
        errPage(res, err)
    }
}

async function update(req, res) {
    const oldExampleDelete = req.body.old_example_delete
    const room_id = req.params.id
    const modified = getCountFullDate().timestamp
    const room_sub = createRoomSubData(JSON.parse(req.body.room_sub))

    let oldExample = req.body.old_example
    const example = req.files.example ?
        req.files.example
            .map(img => img.filename).join(',')
        : undefined

    let sql = `UPDATE rooms  SET room_type=?,bed_type=?,`
    sql += `roomview=?,special_options=?,detail=?,room_sub=?,`
    sql += `max_people=?,toilet_count=?,damage=?,bed_amount=?,`
    sql += `deposit=?,cost_people_exceed=?,cost_expense_time=?,`
    sql += `price=?,tel=?,rental_type=?,`
    const data = [
        req.body.room_type,
        req.body.bed_type,
        req.body.room_view,
        req.body.special_options,
        req.body.detail,
        JSON.stringify(room_sub),
        req.body.max_people,
        req.body.toilet_count,
        req.body.damage,
        req.body.bed_amount,
        req.body.deposit,
        req.body.cost_people_exceed,
        req.body.cost_expense_time,
        req.body.price,
        req.body.tel,
        req.body.rental_type,
    ]
    console.log(req.body.room_sub)

    if (example) {
        if (oldExample != '') {
            sql += `example_room=?,`
            data.push(`${oldExample},${example}`)
        }

        if (oldExample == '') {
            sql += `example_room=?,`
            data.push(example)
        }
    }
    if (!example) {
        sql += `example_room=?,`
        data.push(oldExample)
    }

    sql += `modified=? WHERE room_id=?`
    data.push(...[modified, room_id])
    console.log(data)
    condb.execute(sql, data, async (error, results, fields) => {
        if (error) {
            res.send({ 'result': false, 'err': error.message })
        }

        if (!error) {
            const fileExample = fs.readdirSync(path.join('src/img/example_room/'))

            if (oldExampleDelete != '') {
                const fileDelete = oldExampleDelete.split(',')
                for (let i = 0; i < fileDelete.length; i++) {
                    const fileDeleteItem = fileDelete[i]
                    const files = path.join('src/img/example_room/') + fileDeleteItem
                    const include = fileExample.includes(fileDeleteItem)
                    if (include == true) {
                        fs.unlinkSync(files)
                    }
                }
            }
            res.send({ 'result': true })
        }
    })
}

async function soft_delete(req, res) {
    const id = req.params.id
    const sql = `UPDATE rooms SET modified=?,soft_delete=? WHERE room_id=?`
    const params = [getCountFullDate().timestamp, 'true', id]

    condb.execute(sql, params, async (err, results, fields) => {
        if (err) res.send({ 'result': false, 'err': error.message })
        if (!err) res.send({ 'result': true })
    })
}

async function manage(req, res, responseObject, pageRender) {
    try {
        const { page, row } = getPerPageAndEntryRow(req)
        const { room_type, bed_type, roomview, id } = req.query
        let query_count = Object.keys(req.query).length - 1
        query_count -= room_type ? 1 : 0
        query_count -= bed_type ? 1 : 0
        query_count -= roomview ? 1 : 0
        const query = {
            'room_type': room_type ?? '',
            'bed_type': bed_type ?? '',
            'roomview': roomview ?? ''
        }

        let sql = "SELECT * FROM rooms WHERE soft_delete !='true'"
        if (id) sql += ` AND room_id='${id}' `
        if (room_type) sql += `AND room_type='${room_type}'`
        if (bed_type) sql += `AND bed_type='${bed_type}'`
        if (roomview) sql += `AND roomview='${roomview}'`
        sql += ` ORDER BY created DESC`
        const indexStart = (page * row)
        const rooms = await db(getDataEntriesCount(sql, '*', 'room_id'))
        const row_all = rooms[0].count
        sql += ` LIMIT ?,? `
        let params = [indexStart, row]
        condb.execute(sql, params, (err, result, fields) => {
            if (err) errPage(res, err)


            if (!err) {
                result.map((r) => {
                    Object.assign(r,
                        { 'rental_type_display': getRentalTypeDisplay(r.rental_type) }
                    )
                    return r
                })
                const paginate = {
                    'page_all': Math.ceil(row_all / row),
                    'row_all': result.length,
                    page,
                    row
                }
                Object.assign(responseObject, {
                    'entries': result,
                    paginate,
                    'query': query
                })
                res.render(pageRender, responseObject)
            }
        })
    } catch (err) {
        errPage(res, err)
    }
}

function getRoomById(req, res) {
    const roomId = req.params.id
    console.log(roomId)
    condb.execute("SELECT * FROM rooms WHERE room_id=? ", [roomId], (err, result, fields) => {
        if (err) {
            console.log(err)
            res.send({ 'result': false, 'err': err.message })
        }

        if (!err) {
            res.send({ 'result': true, 'entries': result })
        }
    })

}

async function roomEditPage(req, res, responseObject, pageRender) {
    try {
        const building = await db(`SELECT * FROM building`)

        condb.query("SELECT * FROM rooms WHERE room_id=? ", req.query.id, (err, result, fields) => {
            if (err) {
                res.render(notfoundPage, {
                    'msg': err,
                    'err_no': err.errno
                })
            }
            if (!err) {
                const rooms = []
                result.forEach((r) => {
                    const sub = JSON.parse(r.room_sub)
                    sub.forEach((s) => {
                        const filterB = building.filter((b) => b.building_id == s.building)
                        const floor_count = filterB.length > 0 ? filterB[0].floor_count : undefined

                        Object.assign(s, { 'floor_count': floor_count })
                    })
                    r.room_sub = JSON.stringify(sub)
                    rooms.push(r)
                })

                Object.assign(responseObject,
                    {
                        'building': building,
                        'entries': rooms
                    })
                console.log(responseObject)
                res.render(pageRender, responseObject)
            }

        })
    } catch (err) {
        res.render(notfoundPage, {
            'msg': err,
            'err_no': err.errno
        })
    }
}



function getRoomNumberById(req, res) {
    const id = req.params.id
    const sql = "SELECT * FROM rooms"
    condb.query(sql, (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true, 'entries': result })
    })
}

function store(req, res) {
    const sql = `SELECT * FROM rooms`
    condb.execute(sql, (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) {
            result.map((r) => {
                const room_sub = JSON.parse(r.room_sub)
                    .filter((s) => s.soft_delete != 'true')
                r.room_sub = room_sub
                return r
            }).filter((r) => r.soft_delete != 'true')
            res.send({ 'result': true, 'entries': result })
        }
    })
}
async function getRoomDataById(req, res) {
    try {
        const id = req.params.id
        const building = await db(`SELECT * FROM building`)
        let rooms = await db(`SELECT * FROM rooms WHERE room_id='${id}'`)
        let room_sub = []
        if (rooms.length > 0) {
            room_sub = JSON.parse(rooms[0].room_sub)
                .map((s) => {
                    let building_name = ''
                    let building_number = ''
                    const has_building = building.findIndex((b) => b.building_id == s.building)
                    if (has_building >= 0) {
                        building_name = building[has_building].building_name
                        building_number = building[has_building].building_number
                    }
                    Object.assign(s, { building_name, building_number })
                    return s
                })
            rooms[0].room_sub = room_sub
        }
        res.send({ 'result': true, 'entries': rooms })
    } catch (err) {
        errPage(res, err)
    }



}
module.exports.RoomController = {
    insert, add, edit,
    update, soft_delete, manage, store,
    getRoomById, roomEditPage, auth, getRoomNumberById,
    getRoomDataById
}