const { name } = require("ejs")
const { condb, db } = require("../modules/DB")
const { errPage } = require("../modules/errPage")
const { getSystemConfigField } = require("../modules/getFieldName")
const { getCountFullDate, createRandom } = require("../src/js/function")
const fs = require('fs')
const { getDataEntriesCount } = require("../modules/getDataEntriesCount")
const { getEntriesDataAllBySqlQuery } = require("../modules/getEntriesDataAllBySqlQuery")
const getPerPageAndEntryRow = require("../modules/getPerPageAndEntryRow")
const { getPagination } = require("../modules/getPagination")
async function index(req, res, responseObject, pageRender) {
    try {
        const fonts = await db(`SELECT * FROM fonts`)
        console.log(fonts)
        const name = getSystemConfigField()
        const sql = `SELECT * FROM contact WHERE name=?`
        condb.execute(sql, [name], (err, result, fields) => {
            if (err) errPage(res, err)
            if (!err) {
                let data = JSON.parse(result[0].data)

                result[0] = data

                Object.assign(responseObject,
                    { 'entries': result, 'font_entries': fonts }
                )
                console.log('fffffffffffffff', responseObject)
                res.render(pageRender, responseObject)
            }
        })
    } catch (err) {
        errPage(res, err)
    }

}
function insert(req, res) {
    console.log(req.body)
    const id = `F${createRandom()}`
    const filename = req.file.filename
    const storage = `/src/font/customs/${filename}`

    const params = [
        id,
        req.body.font_name,
        filename,
        storage,
        getCountFullDate().timestamp,
        getCountFullDate().timestamp,
    ]
    const sql = "INSERT INTO fonts VALUES (?,?,?,?,?,?)"
    condb.execute(sql, params, (err, result, fields) => {
        if (err) {
            console.log(err)
            res.send({ 'result': false, 'err': err.message })
        }

        if (!err) {
            res.send({ 'result': true, 'entries': result })
        }
    })
}

function update(req, res) {
    const id = req.params.id

    const old_storage = req.body.storage
    let is_delete = false
    let params = [req.body.font_name]
    let sql = "UPDATE fonts SET font_name=?,"
    if (req.file) {
        const filename = req.file.filename
        const storage = `/src/font/customs/${filename}`
        params.push(...[filename, storage])
        sql += `filename=?,storage=?,`
        is_delete = true
    }
    sql += `modified=? WHERE id=?`
    params.push(...[getCountFullDate().timestamp, id])

    condb.execute(sql, params, (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) {
            if (is_delete) {
                const h = fs.existsSync(old_storage.substring(1))
                if (h) fs.unlinkSync(old_storage.substring(1))
            }
            res.send({ 'result': true, 'entries': result })
        }
    })
}

async function deleteById(req, res) {
    try {
        const id = req.params.id
        const data = await db(`SELECT * FROM fonts WHERE id='${id}'`)
        const sql = `DELETE FROM fonts WHERE id=?`
        condb.execute(sql, [id], (err, result, fields) => {
            if (err) res.send({ 'result': false, 'err': err.message })
            if (!err) {
                const storage = data[0].storage.substring(1)
                const h = fs.existsSync(storage)
                if (h) fs.unlinkSync(storage)
                res.send({ 'result': true, 'entries': result })
            }
        })

    } catch (err) {
        console.log(err)
        res.send({ 'result': false, 'err': err.message })
    }
}
async function config_font(req, res, responseObject, pageRender) {
    console.log('-------------------------------')
    console.log(pageRender, responseObject)
    console.log('-------------------------------')
    let sql = `SELECT * FROM fonts`
    const row_all = await getEntriesDataAllBySqlQuery(sql, '*', 'id')
    sql += ` ORDER BY created DESC LIMIT ?,?`
    const { row, page, index_start } = getPerPageAndEntryRow(req)
    const paginate = getPagination(row_all, row, page)
    condb.execute(sql, [index_start, row], (err, result, fields) => {
        if (err) errPage(res, err)
        if (!err) {
            Object.assign(responseObject, { 'entries': result, paginate, 'query': {} })
            res.render(pageRender, responseObject)
        }
    })

}

async function config_system(req, res) {
    const filename = getSystemConfigField()
    const modified = getCountFullDate().timestamp
    const data = {
        'system_font_1': req.body.system_font_1,
        'system_font_2': req.body.system_font_2,
        'system_custom_font': req.body.system_custom_font,
        'system_font_size': req.body.system_font_size,
        'system_fonttype': req.body.system_fonttype,
        'web_font_1': req.body.web_font_1,
        'web_font_2': req.body.web_font_2,
        'web_custom_font': req.body.web_custom_font,
        'web_font_size': req.body.web_font_size,
        'web_fonttype': req.body.web_fonttype
    }
    console.log(data)
    let params = []
    const sys_config = await db(`SELECT * FROM contact WHERE name='${filename}'`)
    let sql = ``
    if (sys_config.length == 0) {
        params = [
            `A${createRandom()}`,
            filename,
            JSON.stringify(data),
            getCountFullDate().timestamp,
            modified
        ]
        sql = `INSERT INTO contact VALUES (?,?,?,?,?)`
    }
    if (sys_config.length > 0) {
        params = [JSON.stringify(data), modified, filename]
        sql = `UPDATE contact SET data=?,modified=? WHERE name=?`
    }
    condb.execute(sql, params, (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) {
            res.send({ 'result': true })
        }
    })
}

function getFontAll(req, res) {
    const sql = `SELECT * FROM fonts`
    condb.execute(sql, (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) {
            res.send({ 'result': true, 'entries': result })
        }
    })
}

function getDataById(req, res) {
    const sql = `SELECT * FROM fonts WHERE id=?`
    condb.execute(sql, [req.params.id], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) {
            res.send({ 'result': true, 'entries': result })
        }
    })
}

function home(req, res, responseObject, pageRender) {
    res.render(pageRender, responseObject)
}
module.exports.SystemController = {
    insert, config_font, getFontAll,
    config_system, index,
    getDataById, update, deleteById, home
}