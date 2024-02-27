const { db, condb } = require('../modules/DB')
const { getSocialField } = require('../modules/getFieldName')

const { getCountFullDate, createRandom } = require('../src/js/function')
const notfoundPage = 'errNotfound'

function create(req, res, responseObject, pageRender) {
    const fieldname = getSocialField()
    const sql = "SELECT * FROM contact WHERE name=? "
    condb.execute(sql, [fieldname], (err, result, fields) => {
        if (err) {
            res.render(notfoundPage, {
                'msg': err,
                'err_no': err.errno
            })
        }
        if (!err) {
            Object.assign(responseObject,
                {
                    'fb_name': '',
                    'fb_link': '',
                    'twitter_name': '',
                    'twitter_link': '',
                    'ig_name': '',
                    'ig_link': '',
                    'line_id': '',
                    'line_link': '',
                    'tiktok_name': '',
                    'tiktok_link': '',
                    'youtube_name': '',
                    'youtube_link': ''
                })

            if (result.length > 0) {
                const data = JSON.parse(result[0].data)
                responseObject.fb_name = data[0].data
                responseObject.fb_link = data[1].data
                responseObject.ig_name = data[2].data
                responseObject.ig_link = data[3].data
                responseObject.twitter_name = data[4].data
                responseObject.twitter_link = data[5].data
                responseObject.line_id = data[6].data
                responseObject.line_link = data[7].data
                responseObject.tiktok_name = data[8].data
                responseObject.tiktok_link = data[9].data
                responseObject.youtube_id = data[10].data
                responseObject.youtube_link = data[11].data
            }

            Object.assign(responseObject, { 'entries': result })
            res.render(pageRender, responseObject)
        }
    })

}

function update(req, res) {
    const fieldname = getSocialField()
    const id = 'A' + createRandom()
    let data = []
    let sql = ''
    condb.execute("SELECT * FROM contact WHERE name=?", [fieldname],
        (err, result, fields) => {
            if (err) {
                res.send({ 'result': false, 'err': err.message })
                return
            }
            console.log(err)
            if (!err) {
                if (result.length == 0) {
                    data = [
                        id,
                        fieldname,
                        JSON.stringify(req.body),
                        getCountFullDate().timestamp,
                        getCountFullDate().timestamp
                    ]
                    sql = "INSERT INTO contact VALUES (?,?,?,?,?)"
                }
                if (result.length > 0) {
                    sql = "UPDATE contact SET data=?,modified=? WHERE name=?"
                    data = [JSON.stringify(req.body), getCountFullDate().timestamp, fieldname]
                }
                console.log(sql, data)
                condb.execute(sql, data, (err, result, fields) => {
                    console.log(err)
                    if (err) res.send({ 'result': false, 'err': err.message })
                    if (!err) res.send({ 'result': true, 'entries': result })
                })
            }
        })
    console.log(sql)

    // // const { id, social, link } = req.body
    // const created = getCountFullDate().timestamp
    // const modified = getCountFullDate().timestamp
    // console.log(req.body)

    // let params = []

    // condb.query("SELECT * FROM social WHERE id=?", id, async (error, results, fields) => {
    //     if (error) {
    //         res.send({ 'result': false, 'err': error.message })
    //     }
    //     if (!error) {
    //         if (results.length == 0) {
    //             const insert = "INSERT INTO social VALUES(?,?,?,?,?,?)"
    //             const dataInsert = [
    //                 id,
    //                 social,
    //                 link,
    //                 created,
    //                 modified,
    //                 'on'
    //             ]
    //             condb.query(insert, dataInsert, async (error, results, fields) => {
    //                 if (error) {
    //                     res.send({ 'result': false, 'err': error.message })
    //                 }
    //                 if (!error) {
    //                     res.send({ 'result': true })
    //                 }
    //             })
    //         }

    //         if (results.length == 1) {
    //             let up = `UPDATE social SET social='${social}',link='${link}',`
    //             up += `modified='${modified}' WHERE id='${id}'`

    //             condb.query(up, async (error, results, fields) => {
    //                 if (error) {
    //                     res.send({ 'result': false, 'err': error.message })
    //                 }
    //                 if (!error) {
    //                     res.send({ 'result': true })
    //                 }
    //             })
    //         }

    //     }
    // })
}

function store(req, res) {
    condb.query("SELECT * FROM social", (err, result, fields) => {
        if (err) {
            res.send(
                {
                    'result': false,
                    'err': err.message
                })
        }
        if (!err) {
            res.send(
                {
                    'result': true,
                    'entries': result
                })
        }
    })
}

async function switchSocial(req, res) {

    try {
        const { id, status } = req.body
        const count = await db(`SELECT * FROM social WHERE id='${id}'`)
        if (count.length == 0) {
            res.send({ 'result': true, 'is_check': false })
        } else {
            const sql = `UPDATE social SET status='${status}' WHERE id='${id}'`
            condb.query(sql, async (error, results, fields) => {
                if (error) {
                    res.send({ 'result': false, 'err': error.message })
                }
                if (!error) {
                    const is_check = status == 'on' ? true : false
                    res.send({ 'result': true, 'is_check': is_check })
                }
            })
        }
    } catch (error) {
        res.send({ 'result': false, 'err': error.message })
    }



}



module.exports.SocialController = { create, update, store, switchSocial }