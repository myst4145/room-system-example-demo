const { db, condb } = require('../modules/DB')
const fs = require('fs')
const path = require('path')
const { getCountFullDate, createRandom } = require('../src/js/function')
const notfoundPage = 'errNotfound'

async function manage(req, res, responseObject, pageRender) {
    let sql = "SELECT * FROM slide "
    const row = req.query.row ? parseInt(req.query.row) : 5
    const page = req.query.page ? parseInt(req.query.page) : 0

    const indexStart = (page * row)
    const slide = await db(sql)
    const row_all = slide.length
    sql += ` ORDER BY created DESC`
    sql += ` LIMIT ${indexStart},${row} `

    console.log(sql)
    condb.query(sql, (err, result, fields) => {
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
            Object.assign(responseObject, {
                'entries': result,
                paginate, query: {}
            })
            res.render(pageRender, responseObject)
        }
    })
}

function insert(req, res) {
    const silde = req.file.filename
    const { title, descript } = req.body
    const id = `slide_${createRandom()}`
    const created = getCountFullDate().timestamp
    const modified = getCountFullDate().timestamp

    const data = [
        id,
        title,
        descript,
        silde,
        'off',
        'off',
        'off',
        created,
        modified
    ]


    const sql = "INSERT INTO slide VALUES(?,?,?,?,?,?,?,?,?)"
    condb.query(sql, data, async (error, results, fields) => {
        if (error) {
            res.send({ 'result': false, 'err': error.message })
        }
        if (!error) {
            res.send({ 'result': true })
        }
    })

}

async function slideDelete(req, res) {
    try {
        const id = req.params.id
        const slide = await db(`SELECT src FROM slide WHERE slide_id='${id}'`)
        const src = slide[0].src

        const sql = "DELETE FROM slide WHERE slide_id=?"
        condb.execute(sql, [id], async (error, results, fields) => {
            if (error) res.send({ 'result': false, 'err': error.message })

            if (!error) {
                const path_delete = path.join('src/slide/' + src)
                const has = fs.existsSync(path_delete)
                console.log(has, path_delete)
                if (has) fs.unlinkSync(path_delete)
                res.send({ 'result': true })
            }
        })
    } catch (error) {
        res.send({ 'result': false, 'err': error.message })
        return
    }


}

function title(req, res) {
    const id = req.params.id
    const status = req.body.status
    const modified = getCountFullDate().timestamp
    let sql = `UPDATE slide SET title_status=?,modified=? WHERE slide_id=?`
    condb.execute(sql, [status, modified, id], async (error, results, fields) => {
        if (error) res.send({ 'result': false, 'err': error.message })
        if (!error) res.send({ 'result': true })

    })
}

function descript(req, res) {
    const id = req.params.id
    const status = req.body.status
    const modified = getCountFullDate().timestamp
    let sql = `UPDATE slide SET descript_status=?,modified=? WHERE slide_id=?`
    condb.execute(sql, [status, modified, id], async (error, results, fields) => {
        if (error) res.send({ 'result': false, 'err': error.message })
        if (!error) res.send({ 'result': true })
    })
}

function status(req, res) {
    const id = req.params.id
    const status = req.body.status
    const modified = getCountFullDate().timestamp
    let sql = `UPDATE slide SET status=?, modified=? WHERE slide_id=?`
    condb.execute(sql, [status, modified, id], async (error, results, fields) => {
        if (error) res.send({ 'result': false, 'err': error.message })
        if (!error) res.send({ 'result': true })

    })
}

function store(req, res) {
    const sql = "SELECT * FROM slide WHERE status='on'"
    condb.query(sql, async (error, results, fields) => {
        if (error) {
            res.send({ 'result': false, 'err': error.message })
        }
        if (!error) {
            res.send({ 'result': true, 'entries': results })
        }
    })
}
module.exports.SlideController = { manage, insert, slideDelete, title, descript, status, store }