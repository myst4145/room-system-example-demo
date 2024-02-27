const { db, condb } = require('../modules/DB')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { getCountFullDate, createRandom } = require('../src/js/function');
const { errPage } = require('../modules/errPage');
const { getEntriesDataAllBySqlQuery } = require('../modules/getEntriesDataAllBySqlQuery');
const getPerPageAndEntryRow = require('../modules/getPerPageAndEntryRow');
const { getPagination } = require('../modules/getPagination');
const setRole = require('../modules/systems/setRole');
const notfoundPage = 'errNotfound'

async function index(req, res, responseObject, pageRender) {


    if (responseObject.admin_role != 'admin') res.redirect('/system')

    let sql = `SELECT * FROM officer WHERE soft_delete !='true' `
    sql += ` ORDER BY created DESC `
    const { index_start, page, row } = getPerPageAndEntryRow(req)
    const row_all = await getEntriesDataAllBySqlQuery(sql, '*', 'officer_id')
    const paginate = getPagination(row_all, row, page)
    sql += `LIMIT ?,?`
    console.log(responseObject)
    condb.execute(sql, [index_start, row], (err, result, fields) => {
        if (err) errPage(res, err)

        if (!err) {
            Object.assign(
                responseObject, { 'entries': result, paginate, query: {} }
            )
            res.render(pageRender, responseObject)
        }
    })
}


function auth(req, res) {
    const username = req.body.username
    const sql = "SELECT username FROM officer WHERE username=?"
    condb.execute(sql, [username], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })

        if (!err) {
            if (result.length == 0) {
                res.send({ 'result': true, 'auth': true })
            } else {
                res.send({ 'result': true, 'auth': false })
            }

        }
    })
}

function insert(req, res) {
    console.log(req.body)
    const sql = "INSERT INTO officer VALUES (?,?,?,?,?,?,?,?,?,?)"
    const id = "A" + createRandom()
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            condb.execute(sql, [
                id,
                req.body.fname,
                req.body.lname,
                req.body.username,
                hash,
                req.body.role,
                JSON.stringify([]),
                getCountFullDate().timestamp,
                getCountFullDate().timestamp,
                'false'
            ], (err, result, fields) => {
                if (err) res.send({ 'result': false, 'err': err.message })
                if (!err) res.send({ 'result': true })
            })
        })
    })
}


function profile(req, res, responseObject, pageRender) {
    const id = req.query.user
    let sql = "SELECT * FROM officer WHERE officer_id=?"
    condb.execute(sql, [id], (err, result, fields) => {
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


function update(req, res) {
    const id = req.params.id
    let sql = "UPDATE officer SET officer_fname=?,officer_lname=?,"
    sql += "password=?,modified=? WHERE officer_id=?"
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            condb.execute(sql, [
                req.body.fname,
                req.body.lname,
                hash,
                getCountFullDate().timestamp,
                id
            ], (err, result, fields) => {
                if (err) {
                    console.log(err)
                    res.send({ 'result': false, 'err': err.message })
                }

                if (!err) {
                    res.send({ 'result': true })
                }
            })
        })
    })
}

async function role(req, res, responseObject, pageRender) {

    let sql = `SELECT * FROM officer WHERE soft_delete !='true' `
    sql += ` ORDER BY created DESC `
    const { index_start, page, row } = getPerPageAndEntryRow(req)
    const row_all = await getEntriesDataAllBySqlQuery(sql, '*', 'officer_id')
    const paginate = getPagination(row_all, row, page)
    sql += `LIMIT ?,?`
    console.log(responseObject)
    condb.execute(sql, [index_start, row], (err, result, fields) => {
        if (err) errPage(res, err)

        if (!err) {
            result.map((r) => {
                r.data_role = setRole(JSON.parse(r.data_role))
                return r
            })
            Object.assign(
                responseObject, { 'entries': result, paginate, query: {} }
            )
            res.render(pageRender, responseObject)
        }
    })
}


async function roleUpdate(req, res) {
    console.log(req.body)

    try {
        const role = req.body.role
        const accept = req.body.accept
        const act = req.body.act
        const id = req.params.id
        const data = await db(`SELECT officer_id,data_role FROM officer WHERE officer_id='${id}'`)
        let data_role = JSON.parse(data[0].data_role)
        console.log(data_role)
        const findIdx = data_role.findIndex((r) => {
            if (r.role == role && r.act == act) {
                return r
            }
        })

        if (findIdx < 0) {
            data_role.push(req.body)
        }

        if (findIdx >= 0) {
            data_role[findIdx].accept = accept
        }
        console.log('ffff : ', data_role)
        const sql = "UPDATE officer SET data_role=?,modified=? WHERE officer_id=?"
        const params = [JSON.stringify(data_role), getCountFullDate().timestamp, id]
        condb.execute(sql, params, (err, result, fields) => {
            if (err) {
                console.log(err)
                res.send({ 'result': false, 'err': err.message })
            }

            if (!err) {
                res.send({ 'result': true })
            }
        })

    } catch (error) {
        console.log(error)
    }


}
function getDataById(req, res) {
    const sql = `SELECT * FROM officer WHERE officer_id=?`
    condb.execute(sql, [req.params.id], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true, 'entries': result })

    })
}
module.exports.OffocerController = {
    index, auth, insert, profile, update, role, roleUpdate, getDataById
}