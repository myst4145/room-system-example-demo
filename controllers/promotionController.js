const { condb, db } = require("../modules/DB")
const { errPage } = require("../modules/errPage")
const { getDateStampisDailyQuery } = require("../modules/getChecinAndCheckoutDate")
const { getDataEntriesCount } = require("../modules/getDataEntriesCount")
const { getEntriesDataAllBySqlQuery } = require("../modules/getEntriesDataAllBySqlQuery")
const { getPagination } = require("../modules/getPagination")
const getPerPageAndEntryRow = require("../modules/getPerPageAndEntryRow")
const { getIsValidatePromotionByDateStamp } = require("../modules/promotion")
const { getTimeStampByDate } = require("../src/js/dateFunc")
const { getCountFullDate } = require("../src/js/function")
async function index(req, res, responseObject, pageRender) {
    try {
        // const building = await db(`SELECT * FROM building`)
        const { page, row, index_start } = getPerPageAndEntryRow(req)
        let sql = `SELECT * FROM promotion WHERE soft_delete !='true' `
        const row_all = await getEntriesDataAllBySqlQuery(sql, '*', 'promotion_id')
        const paginate = getPagination(row_all, row, page)
        sql += ` ORDER BY created DESC LIMIT ?,?`
        condb.execute(sql, [index_start, row], (err, result, fields) => {
            if (err) errPage(res, err)
            if (!err) {
                Object.assign(responseObject,
                    {
                        'entries': result,
                        paginate,
                        query: {}
                    }
                )
                res.render(pageRender, responseObject)
            }

        })
    } catch (err) {
        errPage(res, err)
    }
}

async function insert(req, res) {
    const { date_start, date_end, room_number_id } = req.body
    const date_stamp = getDateStampisDailyQuery(date_start, date_end)
    const is_promotion = await getIsValidatePromotionByDateStamp(room_number_id, date_stamp)

    const sql = `INSERT INTO promotion VALUES (?,?,?,?,?,?,?,?,?,?,?)`
    console.log(date_stamp)
    const params = [
        `PRM${getCountFullDate().r}`,
        req.body.room_number_id,
        req.body.promotion_name,
        req.body.promotion_type,
        req.body.date_start,
        req.body.date_end,
        req.body.amount,
        getCountFullDate().timestamp,
        getCountFullDate().timestamp,
        date_stamp.join(','),
        'false'
    ]

    if (is_promotion) {
        res.send({
            'result': false,
            'is_promotion': is_promotion
        })
    } else {
        if (date_stamp.length > 60) {
            res.send({
                'result': false,
                'date_count': false
            })
        } else {
            condb.execute(sql, params, (err, result, fields) => {
                if (err) res.send({ 'result': false, 'err': err.message })
                if (!err) res.send({ 'result': true })
            })
        }
    }


}

function getDataById(req, res) {
    const id = req.params.id
    const sql = `SELECT * FROM promotion WHERE promotion_id=?`
    condb.execute(sql, [id], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true, 'entries': result })
    })
}

async function update(req, res) {
    try {
        const { date_end, date_start, room_number_id } = req.body
        const id = req.params.id
        const data = await db(`SELECT * FROM promotion WHERE promotion_id='${id}'`)
        const promotionData = data[0]
        const date_stamp = getDateStampisDailyQuery(date_start, date_end)
        const old_room_number_id = data[0].room_number_id.split(',')
        let new_room_number_id = []

        const room_number_id_list = req.body.room_number_id.split(',')
        room_number_id_list.forEach((r) => {
            const h = old_room_number_id.includes(r)
            if (!h) new_room_number_id.push(r)
        })
        let is_promotion = false
        if (new_room_number_id.length > 0) {
            is_promotion = await getIsValidatePromotionByDateStamp(new_room_number_id.join(','), date_stamp)
            console.log(is_promotion)

        }
        if (!is_promotion) {
            const old_date_end = getTimeStampByDate(data[0].date_end)
            const new_date_end = getTimeStampByDate(date_end)
            if (new_date_end > old_date_end) {
                is_promotion = await getIsValidatePromotionByDateStamp(room_number_id, date_stamp)
            }
        }
        
        console.log(is_promotion)
        console.log(new_room_number_id, old_room_number_id)

        if (is_promotion) {
            res.send({
                'result': false,
                'is_promotion': is_promotion
            })
        } else {

            if (date_stamp.length > 60) {
                res.send({
                    'result': false,
                    'date_count': false
                })
            } else {
                let sql = `UPDATE promotion SET room_number_id=?,`
                sql += `promotion_name=?,promotion_type=?,`
                sql += `date_start=?,date_end=?,`
                sql += `amount=?,modified=? WHERE promotion_id=?`
                const params = [
                    req.body.room_number_id,
                    req.body.promotion_name,
                    req.body.promotion_type,
                    req.body.date_start,
                    req.body.date_end,
                    req.body.amount,
                    getCountFullDate().timestamp,
                    id
                ]
                console.log(params)
                // condb.execute(sql, params, (err, result, fields) => {
                //     console.log(err)
                //     if (err) res.send({ 'result': false, 'err': err.message })
                //     if (!err) res.send({ 'result': true })
                // })
            }
        }




    } catch (err) {
        res.send({ 'result': false, 'err': err.message })
    }




}

function soft_delete(req, res) {
    const sql = `UPDATE promotion SET soft_delete=? WHERE promotion_id=?`
    condb.execute(sql, ['true', req.params.id], (err, result, fields) => {
        console.log(err)
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true })
    })
}
module.exports.PromotionController = { index, insert, getDataById, update, soft_delete }