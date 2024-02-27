const { db, condb } = require('../modules/DB')
const { display } = require('../src/js/display')
const { getCountFullDate, createRandom } = require('../src/js/function')
const notfoundPage = 'errNotfound'
const fs = require('fs')
const path = require('path')
async function manage(req, res, responseObject, pageRender) {
    try {
        const row = req.query.row ? parseInt(req.query.row) : 5
        const page = req.query.page ? parseInt(req.query.page) : 0
        let sql = "SELECT * FROM payment "
        const indexStart = (page * row)
        const payment = await db(sql)
        const row_all = payment.length
        sql += ` ORDER BY created DESC  LIMIT ?,? `
        condb.execute(sql, [indexStart, row], (err, result, fields) => {
            if (err) {
                res.render(notfoundPage, {
                    'msg': err,
                    'err_no': err.errno
                })
            }

            if (!err) {
                let dataObj = []
                result.forEach((r) => {
                    const {
                        payment_id,
                        bank_name,
                        bank_branch,
                        bank_number,
                        account_name,
                        created,
                        modified
                    } = r
                    const display_bank = display.getBank(bank_name)
                    const display_number = display.setBankNumberFormat(bank_number, bank_name)
                    const toggle = r.status
                    const data = {
                        payment_id,
                        bank_name,
                        bank_branch,
                        bank_number,
                        display_number,
                        account_name,
                        created,
                        toggle,
                        modified,
                        display_bank
                    }
                    dataObj.push(data)
                })
                const paginate = {
                    'page_all': Math.ceil(row_all / row),
                    'row_all': row_all,
                    page,
                    row
                }
                Object.assign(responseObject, {
                    'entries': dataObj,
                    paginate,query:{}
                })
                res.render(pageRender, responseObject)
            }
        })
    } catch (error) {
        res.render(notfoundPage, {
            'msg': err,
            'err_no': err.errno
        })
    }

}
function insert(req, res) {
    const {
        bankname,
        bank_branch,
        bank_number,
        account_name
    } = req.body
    const paymentId = `PAY_${createRandom()}`
    const created = getCountFullDate().timestamp
    const modified = getCountFullDate().timestamp
    const dataInsert = [
        paymentId,
        bankname,
        bank_branch,
        bank_number,
        account_name,
        'on',
        created,
        modified
    ]
    const sql = "INSERT INTO payment VALUES(?,?,?,?,?,?,?,?)"
    condb.query(sql, dataInsert, async (error, results, fields) => {
        if (error) {
            res.send({ 'result': false, 'err': error.message })
        }
        if (!error) {
            res.send({ 'result': true })
        }
    })

}

function update(req, res) {
    const id = req.params.id
    const modified = getCountFullDate().timestamp

    let sql = `UPDATE payment SET bank_name=?,`
    sql += `bank_branch=?,`
    sql += `bank_number=?,`
    sql += `account_name=?,`
    sql += `modified=? WHERE payment_id=? `

    condb.execute(sql, [
        req.body.bankname,
        req.body.bank_branch,
        req.body.bank_number,
        req.body.account_name,
        modified,
        id
    ], async (error, results, fields) => {
        if (error) res.send({ 'result': false, 'err': error.message })
        if (!error) res.send({ 'result': true })
    })

}

function paymentDelete(req, res) {
    const id = req.params.id
    const sql = "DELETE FROM payment WHERE payment_id=?"
    condb.execute(sql, [id], async (error, results, fields) => {
        if (error) res.send({ 'result': false, 'err': error.message })
        if (!error) res.send({ 'result': true })
    })

}

function paymentSwitch(req, res) {
    const id = req.params.id
    const status = req.body.status
    const modified = getCountFullDate().timestamp
    const sql = `UPDATE payment SET status=?,modified=? WHERE payment_id=?`
    condb.execute(sql, [
        status, modified, id
    ], async (error, results, fields) => {
        if (error) res.send({ 'result': false, 'err': error.message })
        if (!error) res.send({ 'result': true })
    })

}

function store(req, res) {
    condb.query("SELECT * FROM payment", (err, result, fields) => {
        if (err) {
            res.send(
                {
                    'result': false,
                    'err': err.message
                })
        }
        if (!err) {
            const payment = result.filter((r) => {
                if (r.status == 'on') {
                    return r
                }
            })
            if (payment.length > 0) {
                res.send(
                    {
                        'result': true,
                        'entries': payment
                    })
            }
            if (payment.length == 0) {
                res.send(
                    {
                        'result': true,
                        'entries': result
                    })
            }

        }
    })
}
function edit(req, res) {
    const id = req.params.id
    condb.execute("SELECT * FROM payment WHERE payment_id=?", [id], (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })
        if (!err) res.send({ 'result': true, 'entries': result })
    })
}
function qrcodeCreate(req, res) {
    const { bank, old_qrcode } = req.body
    const qrcode = req.file.filename
    const created = getCountFullDate().timestamp
    const modified = getCountFullDate().timestamp

    condb.execute("SELECT * FROM qrcode", (err, result, fields) => {
        if (err) res.send({ 'result': false, 'err': err.message })

        if (!err) {
            if (result.length == 0) {
                const data = ['qrcode', bank, qrcode, created, modified]
                condb.execute("INSERT INTO qrcode VALUES (?,?,?,?,?)", data, (err, result, fields) => {
                    if (err) res.send({ 'result': false, 'err': err.message })
                    if (!err) res.send({ 'result': true })
                })
            }

            if (result.length == 1) {
                let sql = `UPDATE qrcode SET bank=?,img=?,modified=?`
                condb.execute(sql, [bank, qrcode, modified], (err, result, fields) => {
                    if (err) res.send({ 'result': false, 'err': err.message })
                    if (!err) res.send({ 'result': true })

                })
            }
        }
    })
}
function qrcode(req, res, responseObject, pageRender) {
    condb.query("SELECT * FROM qrcode", (err, result, fields) => {
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
module.exports.PaymentController = {
    manage, insert, edit, paymentDelete,
    paymentSwitch, store, update,
    qrcodeCreate, qrcode
}