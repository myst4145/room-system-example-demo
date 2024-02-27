const { db, condb } = require('../modules/DB');
const { getDataEntriesCount } = require('../modules/getDataEntriesCount');
const { getEntriesDataAllBySqlQuery } = require('../modules/getEntriesDataAllBySqlQuery');
const { getMemberIdBySession } = require('../modules/getMemberData');
const { getPagination } = require('../modules/getPagination');
const getPerPageAndEntryRow = require('../modules/getPerPageAndEntryRow');
const { getCountFullDate, createRandom } = require('../src/js/function')
const notfoundPage = 'errNotfound'
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function auth_password(req, res) {

    const member_id = await getMemberIdBySession(req)
    if (!member_id) {
        res.send({ 'result': false, 'is_login': false })
    } else {
        const password = req.body.password
        console.log(password)
        const data = await db(`SELECT * FROM member WHERE member_id='${member_id}'`)
        if (data.length == 0) res.send({ 'result': false, 'is_password': false })

        if (data.length > 0) {
            await bcrypt.compare(password, data[0].password).then(function (is_password) {
                if (!is_password) res.send({ 'result': false, 'is_password': false })
                if (is_password) res.send({ 'result': true })
            });
        }
    }

}
function auth(req, res) {
    const username = req.body.username
    const sql = "SELECT username FROM member WHERE username=?"
    condb.execute(sql, [username], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) {
            if (result.length == 0) res.send({ 'result': true, 'auth': true })
            if (result.length > 0) res.send({ 'result': true, 'auth': false })
        }
    })
}
async function insert(req, res) {
    const username = req.body.username
    const user = await db(`SELECT * FROM member WHERE username='${username}'`)
    if (user.length > 0) res.send({ 'result': false, 'isAlreadyUser': true })
    if (user.length == 0) {
        const sql = "INSERT INTO member VALUES (?,?,?,?,?,?,?,?,?)"
        const id = "MID" + getCountFullDate().r + createRandom()
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                condb.execute(sql, [
                    id,
                    req.body.username,
                    hash,
                    req.body.fname,
                    req.body.lname,
                    req.body.phone,
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

}
async function update(req, res) {
    let result = []
    const username = req.params.username
    const password = req.body.password
    const data = await db(`SELECT * FROM member WHERE username='${username}'`)
    if (data.length == 0) res.send({ 'result': false, 'is_password': false })

    if (data.length > 0) {

        await bcrypt.compare(password, data[0].password).then(function (is_password) {
            if (!is_password) res.send({ 'result': false, 'is_password': false })
            if (is_password) {
                const id = data[0].member_id
                let sql = "UPDATE member SET fname=?,lname=?,"
                sql += "password=?,phone=?,modified=? WHERE member_id=?"
                bcrypt.genSalt(saltRounds, (err, salt) => {
                    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                        condb.execute(sql, [
                            req.body.fname,
                            req.body.lname,
                            hash,
                            req.body.phone,
                            getCountFullDate().timestamp,
                            id
                        ], (err, result, fields) => {
                            if (err) res.send({ 'result': false, 'err': err.message })
                            if (!err) res.send({ 'result': true })
                        })
                    })
                })
            }
        });
    }

}
async function login(req, res) {
    const { username, password } = req.body
    const sql = `SELECT * FROM member WHERE username='${username}'`
    condb.execute(sql, [username], async (err, result, fields) => {
        if (err) {
            res.send({ 'result': false, 'err': err.message })
        }
        if (!err) {
            if (result.length == 0) {
                res.send({ 'result': true, 'login': false })
            } else {
                await bcrypt.compare(password, result[0].password).then(async function (isLogin) {
                    if (isLogin) {
                        req.session.member_id = result[0].member_id
                        const session = await req.session
                        if (session.member_id) {
                            res.send({ 'result': true, 'login': true })
                        }
                    } else {
                        res.send({ 'result': true, 'login': false })
                    }
                });
            }

        }
    })


}

async function index(req, res, responseObject, pageRender) {
    const { row, page, index_start } = getPerPageAndEntryRow(req)
    let sql = `SELECT * FROM member ORDER BY created DESC`
    const row_all = getEntriesDataAllBySqlQuery(sql, '*', 'member_id')
    sql += ` LIMIT ?,?`
    const paginate = getPagination(row_all, row, page)
    const query = {}
    condb.execute(sql, [index_start, row], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
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

}
function getDataById(req, res) {
    const id = req.params.id
    console.log(id)
    const sql = `SELECT * FROM member WHERE  member_id=?`
    condb.execute(sql, [id], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true, 'entries': result })
    })
}

async function change_password(req, res) {
    try {
        const member_id = await getMemberIdBySession(req)
        if (!member_id) {
            if (err) res.send({ 'result': false, 'is_login': false })
        }
        if (member_id) {
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                    const sql = `UPDATE member SET password=? WHERE member_id=?`
                    condb.execute(sql, [hash, member_id], (err, result, fields) => {
                        if (err) res.send({ 'result': false, 'err': err.message })
                        if (!err) res.send({ 'result': true })
                    })
                })
            })
        }
    } catch (err) {
        res.send({ 'result': false, 'err': err.message })
    }

}
module.exports.MemberController = {
    auth, insert, login, update,
    index, getDataById, auth_password,
    change_password
}