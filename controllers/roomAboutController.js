const { db, condb } = require('../modules/DB')
const path = require('path')
const fs = require('fs')
const { getCountFullDate, createRandom } = require('../src/js/function')
const { errPage } = require('../modules/errPage')
const notfoundPage = 'errNotfound'

function insert(req, res) {
    const id = createRandom()
    let img = ''
    if (req.file) img = req.file.filename

    let data = [
        id,
        req.body.title,
        req.body.descript,
        img,
        'other',
        'add new',
        'on',
        getCountFullDate().timestamp,
        getCountFullDate().timestamp,
    ]
    const sql = "INSERT INTO room_about VALUES (?,?,?,?,?,?,?,?,?)"
    condb.execute(sql, data, (error, results, fields) => {
        if (error) res.send({ 'result': false, 'err': error.message })
        if (!error) res.send({ 'result': true })

    })
}


function update(req, res) {
    const collect = req.body.collect
    let img = ''
    if (req.file) img = req.file.filename
    const id = req.params.id

    if (!req.file) {
        if (collect != 'collect') {
            condb.execute("SELECT * FROM room_about WHERE id=?",
                [id],
                (err, result, fields) => {
                    if (err) {
                        res.send({ 'result': false, 'err': err.message })
                        return
                    }
                    if (result[0].img != '') {
                        const path_delete = path.join('src/about_room/' + result[0].img)
                        console.log('', path_delete)
                        const has = fs.existsSync(path_delete)
                        if (has) fs.unlinkSync(path_delete)
                    }

                })
        }
    }

    let data = [
        req.body.title,
        req.body.descript,
    ]
    let sql = "UPDATE room_about SET title=?,descript=?,"
    if (img != '') {
        sql += "img=?,"
        data.push(img)
    }
    if (img == '') {
        if (collect != 'collect') {
            sql += "img=?,"
            data.push('')
        }

    }
    sql += `modified=? WHERE id=? `
    data.push(getCountFullDate().timestamp)
    data.push(id)
    condb.execute(sql, data, (error, results, fields) => {
        if (error) res.send({ 'result': false, 'err': error.message })
        if (!error) res.send({ 'result': true })

    })
}
function status(req, res) {
    const id = req.params.id
    const status = req.body.status
    const modified = getCountFullDate().timestamp

    let sql = `UPDATE room_about  SET status=?,`
    sql += `modified=? WHERE id=?`

    condb.execute(sql, [status, modified, id],
        async (error, results, fields) => {
            if (error) {
                res.send({ 'result': false, 'err': error.message })
            }
            if (!error) {
                res.send({ 'result': true })
            }
        })
}


function aboutDelete(req, res) {
    const id = req.params.id
    let img_delete = ''
    condb.execute("SELECT img FROM room_about WHERE id=?",
        [id], (err, result, fields) => {
            if (err) {
                res.send({ 'result': false, 'err': err.message })
                return
            }
            if (!err) img_delete = result[0].img
        })

    const sql = "DELETE FROM room_about WHERE id=?"
    condb.execute(sql, [id],
        (err, result, fields) => {
            if (err) res.send({ 'result': false, 'err': err.message })
            if (!err) {
                const path_delete = path.join('src/about_room/' + img_delete)
                const has = fs.existsSync(path_delete)
                if (has) fs.unlinkSync(path_delete)
                res.send({ 'result': true, 'entries': result })
            }
        })
}
function about(req, res) {
    condb.query("SELECT * FROM about ", "on", async (error, results, fields) => {
        if (error) {
            res.send({ 'result': false, 'err': error.message })
        }
        if (!error) {
            res.send({ 'result': true, 'entries': results })
        }
    })
}

async function manage(req, res, responseObject, pageRender) {
    try {
        const default_about = await db("SELECT * FROM room_about WHERE type_default='default'")
        const about = await db("SELECT * FROM room_about WHERE type_default !='default'")
        Object.assign(responseObject, { 'entries': [default_about, about] })
        res.render(pageRender, responseObject)
    } catch (error) {
        errPage(res, err)
    }


}

function getDataById(req, res) {
    const id = req.params.id
    console.log(id)
    const sql = "SELECT * FROM room_about WHERE id=?"
    condb.execute(sql, [id], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true, 'entries': result[0] })
    })
}
module.exports.RoomAboutController = {
    manage, status,
    about, update, getDataById,
    insert, aboutDelete
}