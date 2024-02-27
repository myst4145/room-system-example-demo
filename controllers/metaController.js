const { db, condb } = require('../modules/DB')
const getPerPageAndEntryRow = require('../modules/getPerPageAndEntryRow')

const { getCountFullDate, createRandom } = require('../src/js/function')
const notfoundPage = 'errNotfound'

async function add(req, res, responseObject, pageRender) {
    const rooms = await db("SELECT * FROM rooms")
    const row = req.query.row ? parseInt(req.query.row) : 5
    const page = req.query.page ? parseInt(req.query.page) : 0
    let sql = "SELECT * FROM meta WHERE soft_delete !='true'"

    if (req.query.room_id) sql += `AND room_id=?`
    sql += ` ORDER BY created DESC`

    const query = { 'room_id': req.query.room_id ?? '' }
    const indexStart = (page * row)
    const booking_count = await db(sql)
    const row_all = booking_count.length

    sql += ` LIMIT ?,? `
    condb.execute(sql,
        [req.query.room_id, indexStart, row],
        (err, result, fields) => {
            if (err) {
                res.render(notfoundPage, {
                    'msg': err,
                    'err_no': err.errno
                })
            }
            if (!err) {
                const paginate = {
                    'page_all': Math.ceil(row_all / row),
                    'row_all': row_all,
                    page,
                    row
                }

                Object.assign(responseObject, { 'room_number': rooms })
                Object.assign(responseObject, {
                    'entries': result,
                    'query': query,
                    paginate
                })
                res.render(pageRender, responseObject)
            }
        })
}

function insert(req, res) {
    const { content, name, room_id } = req.body
    const id = `meta_${createRandom()}`
    const created = getCountFullDate().timestamp
    const modified = getCountFullDate().timestamp

    const data = [
        id,
        room_id,
        name,
        content,
        'false',
        created,
        modified
    ]

    condb.query("INSERT INTO meta VALUES(?,?,?,?,?,?,?)", data, async (error, results, fields) => {
        if (error) {
            res.send({ 'result': false, 'err': error.message })
        }
        if (!error) {
            res.send({ 'result': true, })
        }
    })
}

async function keywordPage(req, res, responseObject, pageRender) {
    const rooms = await db("SELECT * FROM rooms")
    const room_id = req.query.room_id ? req.query.room_id : ''
    const row = req.query.row ? parseInt(req.query.row) : 5
    const page = req.query.page ? parseInt(req.query.page) : 0
    let sql = "SELECT * FROM meta WHERE soft_delete=''"
    let params = []

    if (room_id != '') {
        sql += `AND room_id=?`
        params.push(room_id)
    }
    sql += ` ORDER BY created DESC`


    const query = { 'room_id': req.query.room_id ?? '' }

    const booking_count = await db(sql)
    params.push((page * row), row)
    const row_all = booking_count.length

    sql += ` LIMIT ?,?`
    console.log(sql)
    condb.execute(sql,
        params,
        (err, result, fields) => {
            if (err) {
                res.render(notfoundPage, {
                    'msg': err,
                    'err_no': err.errno
                })
            }
            if (!err) {
                const paginate = {
                    'page_all': Math.ceil(row_all / row),
                    'row_all': row_all,
                    page,
                    row
                }

                Object.assign(responseObject, { 'room_number': rooms })
                Object.assign(responseObject, {
                    'entries': result,
                    'query': query,
                    paginate
                })
                res.render(pageRender, responseObject)
            }
        })
}
async function manage(req, res, responseObject, pageRender) {
    const rooms = await db("SELECT * FROM rooms")
    const room_id = req.query.room_id ? req.query.room_id : ''

    let sql = "SELECT * FROM meta WHERE soft_delete !='true'"
    let params = []

    if (room_id != '') sql += ` AND room_id='${room_id}'`
    sql += ` ORDER BY created DESC`

    const { row, page, index_start } = getPerPageAndEntryRow(req)
    const query = { 'room_id': req.query.room_id ?? '' }

    const booking_count = await db(sql)
    params.push(...[index_start, row])
    const row_all = booking_count.length

    sql += ` LIMIT ?,?`
    condb.execute(sql, params, (err, result, fields) => {
        if (err) {
            res.render(notfoundPage, {
                'msg': err,
                'err_no': err.errno
            })
        }
        if (!err) {
            const paginate = {
                'page_all': Math.ceil(row_all / row),
                'row_all': row_all,
                page,
                row
            }

            Object.assign(responseObject, { 'room_number': rooms })
            Object.assign(responseObject, {
                'entries': result,
                'query': query,
                paginate
            })
            res.render(pageRender, responseObject)
        }
    })
}
function store(req, res) {
    condb.query("SELECT * FROM meta", async (error, results, fields) => {
        if (error) {
            res.send({ 'result': false, 'err': error.message })
        }
        if (!error) {
            res.send({ 'result': true, 'entries': results })
        }
    })
}

function edit(req, res) {
    const id = req.params.id
    console.log(id)
    condb.query("SELECT * FROM meta WHERE meta_id=?", id, async (error, results, fields) => {
        if (error) {
            res.send({ 'result': false, 'err': error.message })
        }
        if (!error) {
            res.send({ 'result': true, 'entries': results })
        }
    })
}
function update(req, res) {
    const meta_id = req.params.id
    const { id, content, name } = req.body
    const modified = getCountFullDate().timestamp
    const sql = `UPDATE meta SET meta_name=?,content=?,modified=? WHERE meta_id=?`
    condb.execute(sql, [name, content, modified, meta_id], async (error, results, fields) => {
        if (error) {
            res.send({ 'result': false, 'err': error.message })
        }
        if (!error) {
            res.send({ 'result': true, })
        }
    })
}

function soft_delete(req, res) {
    const id = req.params.id
    const sql = `UPDATE meta SET soft_delete=?,modified=? WHERE meta_id=?`
    const modified = getCountFullDate().timestamp
    condb.execute(sql, ['true', modified, id], async (error, results, fields) => {
        if (error) {
            res.send({ 'result': false, 'err': error.message })
        }
        if (!error) {
            res.send({ 'result': true, })
        }
    })
}

module.exports.MetaController = {
    add, insert, edit, update, store, soft_delete,
    manage
}