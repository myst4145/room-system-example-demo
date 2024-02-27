const { db, condb } = require('../modules/DB')
const { errPage } = require('../modules/errPage')
const { getDataEntriesCount } = require('../modules/getDataEntriesCount')
const { getPagination } = require('../modules/getPagination')
const getPerPageAndEntryRow = require('../modules/getPerPageAndEntryRow')
const { sumByreduce, getNumberFormat } = require('../src/js/func')

const { getCountFullDate, createRandom } = require('../src/js/function')
const notfoundPage = 'errNotfound'



async function index(req, res, responseObject, pageRender) {
    try {
        const id = req.query.id
        const { index_start, page, row } = getPerPageAndEntryRow(req)
        let sql = "SELECT * FROM additional_cost WHERE soft_delete!='true' "
        if (id) sql += ` AND booking_id='${id}'`
        sql += " ORDER BY created DESC "
        const additionalCostData = await db(getDataEntriesCount(sql, '*', 'additional_id'))
        const row_all = additionalCostData[0].count
        sql += " LIMIT ?,? "
        condb.execute(sql, [index_start, row], (err, result, fields) => {
            if (err) errPage(res, err)

            if (!err) {

                const paginate = getPagination(row_all, row, page)
                Object.assign(responseObject,
                    {
                        'entries': result,
                        paginate,
                        query: { 'id': id ?? '' }
                    })
                res.render(pageRender, responseObject)
            }

        })
    } catch (err) {
        errPage(res, err)
    }
}


async function insert(req, res) {
    try {
        const id = 'EWAT' + createRandom()
        const created = getCountFullDate().timestamp
        const modified = getCountFullDate().timestamp
        const booking_id = req.body.booking_id
        const sql = "INSERT INTO additional_cost VALUES (?,?,?,?,?,?,?,?,?)"
        const data = await db(`SELECT booking_id FROM additional_cost WHERE booking_id='${booking_id}'`)
        if (data.length > 0) res.send({ 'result': false, 'isValidId': false })
        if (data.length == 0) {
            const params = [
                id,
                req.body.booking_id,
                req.body.fname,
                req.body.lname,
                JSON.stringify([]),
                req.body.status,
                created,
                modified,
                'false'
            ]
            condb.execute(sql, params, (err, result, fields) => {
                if (err) res.send({ 'result': false, 'err': err.message })
                if (!err) res.send({ 'result': true, })
            })
        }

    } catch (err) {
        console.log(err)
        res.send({ 'result': false, 'err': err.message })
    }

}

function update(req, res) {
    const id = req.params.id

    const modified = getCountFullDate().timestamp
    let sql = "UPDATE additional_cost SET booking_id=?,fname=?,lname=?,"
    sql += "status=?,modified=? WHERE additional_id=?"
    const params = [
        req.body.booking_id,
        req.body.fname,
        req.body.lname,
        req.body.status,
        modified,
        id
    ]
    console.log(sql, params)
    condb.execute(sql, params, (err, result, fields) => {
        console.log(err.message)
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true, 'entries': result })
    })


}
function getDataById(req, res) {
    const id = req.params.id
    const sql = "SELECT * FROM additional_cost WHERE additional_id=? "
    condb.execute(sql, [id], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true, 'entries': result })
    })
}

async function transaction(req, res, responseObject, pageRender) {

    try {
        const id = req.query.id
        const additional_cost = await db(`SELECT * FROM additional_cost WHERE additional_id='${id}'`)
        const transaction = JSON.parse(additional_cost[0].transaction)
            .map((r) => {
                Object.assign(r, {
                    'display_type': r.type == 'wat' ? 'ค่าน้ำประปา' : 'ค่าไฟฟ้า',
                    'display_status': r.status == 'paid' ? 'ชำระแล้ว' : 'ค้างชำระ',
                    paid_format: getNumberFormat(r.paid),
                    overdue_format: getNumberFormat(r.overdue),
                    total_format: getNumberFormat(r.total)
                })
                return r
            })

        let transactionSortByDate = transaction.map((t) => `${t.date}-${t.type}`).sort()
        let transactionSortIndex = transaction.map((t) => {
            const has_index = transactionSortByDate.indexOf(`${t.date}-${t.type}`)
            return has_index
        })
        let transactionSortList = transaction.map((t) => { })
        transactionSortIndex.forEach((pos, i) => {
            transactionSortList[pos] = transaction[i]
        })
        console.log(transactionSortList)
        additional_cost[0].transaction = transactionSortList
        const booking_id = additional_cost[0].booking_id
        let room_number = ''
        let room_id = ''
        let room_number_id = ''
        let building_name = ''
        let building_floor = ''
        let elc_user_no = ''
        let wat_user_no = ''
        let wat_user_reg = ''
        let elc_meter_no = ''
        let elc_receipt_no = ''
        let elc_acct_no = ''
        let sum_total = getNumberFormat(sumByreduce(transaction.map((t) => t.total)))
        let sum_paid = getNumberFormat(sumByreduce(transaction.map((t) => t.paid)))
        let sum_overdue = getNumberFormat(sumByreduce(transaction.map((t) => t.overdue)))


        let checkin = ''
        let checkout = ''
        let is_booking = false
        if (additional_cost.length > 0 && booking_id != '') {
            const bsql = `SELECT booking_id,room_id,room_number_id,checkin,checkout FROM room_booking WHERE booking_id='${booking_id}'`
            const booking = await db(bsql)
            if (booking.length > 0) {
                is_booking = true
                checkin = booking[0].checkin
                checkout = booking[0].checkout
                room_id = booking[0].room_id
                room_number_id = booking[0].room_number_id
                const rooms = await db(`SELECT room_id,room_sub FROM rooms WHERE room_id='${room_id}' `)
                if (rooms.length > 0) {
                    const room_sub = JSON.parse(rooms[0].room_sub)
                    const sub = room_sub.filter((r) => r.room_number_id == room_number_id)
                    console.log(sub)
                    if (sub.length > 0) {
                        room_number = sub[0].room_number
                        building_floor = sub[0].building_floor
                        elc_user_no = sub[0].elc_user_no
                        wat_user_no = sub[0].wat_user_no
                        wat_user_reg = sub[0].wat_user_reg
                        elc_meter_no = sub[0].elc_meter_no
                        elc_receipt_no = sub[0].elc_receipt_no
                        elc_acct_no = sub[0].elc_acct_no
                        const building_id = sub[0].building
                        const building = await db(`SELECT * FROM building WHERE building_id='${building_id}'`)
                        if (building.length > 0) building_name = building[0].building_name

                    }
                }
            }
        }
        Object.assign(responseObject, {
            is_booking,
            booking_id,
            room_id,
            room_number_id,
            'additional_cost': additional_cost,
            'building_name': building_name,
            building_floor,
            room_number,
            elc_user_no,
            wat_user_no,
            wat_user_reg,
            elc_meter_no,
            elc_receipt_no,
            elc_acct_no,
            sum_overdue,
            sum_paid,
            sum_total,
            checkin,
            checkout
        })
        res.render(pageRender, responseObject)
    } catch (err) {
        errPage(res, err)
    }

}

async function transactionUpdate(req, res) {
    try {
        const { status, month,
            year, type, total,
            paid, overdue
        } = req.body
        const id = req.params.id
        const date = `${req.body.year}-${req.body.month}`
        const additional_cost = await db(`SELECT * FROM additional_cost WHERE additional_id='${id}' `)

        let transaction = JSON.parse(additional_cost[0].transaction)
        const filter = transaction.filter((r) => r.date == date && r.type == type)
        if (filter.length > 0) {
            filter[0].paid = paid
            filter[0].total = total
            filter[0].overdue = overdue
            filter[0].status = status
        }

        if (filter.length == 0) {

            transaction.push({
                'status': status,
                'date': date,
                'type': type,
                'total': total,
                'paid': paid,
                'overdue': overdue
            })
        }

        let sql = "UPDATE additional_cost SET transaction=?,modified=?"
        sql += " WHERE additional_id=?"
        const params = [JSON.stringify(transaction), getCountFullDate().timestamp, id]
        condb.execute(sql, params, (err, result, fields) => {
            if (err) res.send({ 'result': false, 'err': err.message })
            if (!err) res.send({ 'result': true, 'entries': result })
        })
    } catch (err) {
        res.send({ 'result': false, 'err': err.message })
    }
}
function getTransactionById(req, res) {
    const id = req.params.id
    const date = req.params.date
    const type = req.params.type
    const sql = "SELECT * FROM additional_cost WHERE additional_id=? "
    condb.execute(sql, [id], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) {
            const transaction = JSON.parse(result[0].transaction)
                .filter((r) => r.date == date && r.type == type)

            res.send({ 'result': true, 'entries': transaction })
        }
    })
}


function soft_delete(req, res) {
    const id = req.params.id
    let sql = "UPDATE additional_cost SET soft_delete=?,"
    sql += "modified=? WHERE additional_id=?"
    const params = ['true', getCountFullDate().timestamp, id]
    condb.execute(sql, params, (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true, 'entries': result })
    })
}

async function transactionDelete(req, res) {
    try {
        const id = req.params.id
        const date = req.body.date
        const type = req.body.type
        console.log(id, req.body)
        const additional_cost = await db(`SELECT * FROM additional_cost WHERE additional_id='${id}' `)

        let transaction = JSON.parse(additional_cost[0].transaction)
        const hasIndex = transaction
            .findIndex((r) => r.date == date && r.type == type)
        console.log(hasIndex)
        if (hasIndex >= 0) {
            transaction = transaction.filter((r, i) => i != hasIndex)
        }
        let sql = "UPDATE additional_cost SET transaction=?,modified=?"
        sql += " WHERE additional_id=?"
        const params = [JSON.stringify(transaction), getCountFullDate().timestamp, id]
        condb.execute(sql, params, (err, result, fields) => {
            if (err) res.send({ 'result': false, 'err': err.message })
            if (!err) res.send({ 'result': true, 'entries': result })
        })
    } catch (err) {
        res.send({ 'result': false, 'err': err.message })
    }
}
module.exports.AdditionalCostController = {
    index, insert,
    transaction, getDataById, update,
    transactionUpdate, getTransactionById,
    soft_delete, transactionDelete
}