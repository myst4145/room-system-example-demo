const { db, condb } = require('../modules/DB')
const { errPage } = require('../modules/errPage')
const { getEntriesDataAllBySqlQuery } = require('../modules/getEntriesDataAllBySqlQuery')
const { getPagination } = require('../modules/getPagination')
const getPerPageAndEntryRow = require('../modules/getPerPageAndEntryRow')

const { getCountFullDate, createRandom } = require('../src/js/function')
const notfoundPage = 'errNotfound'

async function index(req, res, responseObject, pageRender) {
    try {
        let sql = `SELECT * FROM building`
        const { index_start, page, row } = getPerPageAndEntryRow(req)
        sql += ` WHERE soft_delete !='true' ORDER BY created DESC`
        const row_all = await getEntriesDataAllBySqlQuery(sql, '*', 'building_id')
        sql += ` LIMIT ?,? `
        const paginate = getPagination(row_all, row, page)
        const query = {}
        condb.execute(sql, [index_start, row], (err, result, fields) => {
            if (err) errPage(res, err)
            if (!err) {
                Object.assign(responseObject, {
                    'entries': result,
                    paginate, query
                })
                res.render(pageRender, responseObject)
            }

        })
    } catch (err) {
        errPage(res, err)
    }

}

function edit(req, res, responseObject, pageRender) {
    const buiding_id = req.query.id
    condb.query("SELECT * FROM building WHERE building_id=?", buiding_id, (err, result, fields) => {
        if (err) {
            res.render(notfoundPage, {
                'msg': err,
                'err_no': err.errno
            })
        }
        if (!err) {
            Object.assign(responseObject, { 'entries': result })
            res.render(pageRender, responseObject)
        }

    })
}

function insert(req, res) {
    const buildingId = `BUID${createRandom()}`


    const dt = getCountFullDate().timestamp
    const created = dt
    const modified = dt

    const sql = 'INSERT INTO building VALUES(?,?,?,?,?,?,?)'
    const data = [
        buildingId,
        req.body.building_name,
        req.body.building_number,
        req.body.floor_count,
        'false',
        created,
        modified,
    ]
    condb.execute(sql, data, (err, results, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true })
    })

}


function update(req, res) {
    const id = req.params.id
    const building_name = req.body.building_name
    const building_number = req.body.building_number
    const number_floor = req.body.number_floor
    const modified = getCountFullDate().timestamp

    let sql = `UPDATE building SET building_name=?,`
    sql += `building_number=?,`
    sql += `floor_count=?,modified=?`
    sql += ` WHERE building_id=?`

    condb.execute(sql, [building_name, building_number, number_floor, modified, id],
        (err, results, fields) => {
            if (err) res.send({ 'result': false, 'err': err.message })
            if (!err) res.send({ 'result': true })
        })

}
function buidingDelete(req, res) {
    const modified = getCountFullDate().timestamp
    const id = req.params.id
    const sql = `UPDATE building SET soft_delete=?,modified=? WHERE building_id=?`
    condb.execute(sql, ['true', modified, id], (err, results, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true })

    })

}
function store(req, res) {
    condb.execute("SELECT * FROM building ", (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.json({ 'result': true, 'entries': result })
    })
}

function createBuildingById(req, res) {
    const id = req.params.id
    const sql = `SELECT * FROM building WHERE building_id=?`
    condb.execute(sql, [id], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true, 'entries': result[0] })

    })
}
function buildingFloor(req, res) {
    const id = req.params.id
    const sql = `SELECT * FROM building WHERE building_id=? `
    condb.query(sql, [id], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) {
            if (result.length == 0) return res.send({ 'result': true, 'entries': [] })
            if (result.length > 0) return res.send({ 'result': true, 'entries': result[0].floor_count })
        }
    })

}
module.exports.BuildingController = {
    index, insert, edit,
    update, buidingDelete, store,
    createBuildingById, buildingFloor
}