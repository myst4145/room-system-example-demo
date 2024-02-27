const { db, condb } = require('../modules/DB')

const { getCountFullDate, createRandom } = require('../src/js/function')
const notfoundPage = 'errNotfound'
const company_name = 'company_info'
function webAboutaPage(req, res, responseObject, pageRender) {
    condb.execute("SELECT * FROM contact WHERE name=?", [company_name], (err, result, fields) => {
        if (err) res.render(notfoundPage, { 'msg': err, 'err_no': err.errno })

        if (!err) {
            Object.assign(responseObject, {
                'company': '',
                'location': '',
                'road_alley': '',
                'sub_district': '',
                'district': '',
                'province': '',
                'postcode': '',
                'contact_number': '',
                'email': '',
                'tax_id': '',
                'shop_logo': ''
            })
            if (result.length > 0) {
                const data = JSON.parse(result[0].data)
                responseObject.company = data.company
                responseObject.location = data.location
                responseObject.road_alley = data.road_alley
                responseObject.sub_district = data.sub_district
                responseObject.district = data.district
                responseObject.province = data.province
                responseObject.postcode = data.postcode
                responseObject.contact_number = data.contact_number
                responseObject.email = data.email
                responseObject.tax_id = data.tax_id
                responseObject.shop_logo = data.shop_logo
            }
            res.render(pageRender, responseObject)
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

function save(req, res) {
    const id = `A${createRandom()}`
    const created = getCountFullDate().timestamp
    const modified = getCountFullDate().timestamp

    condb.execute(`SELECT * FROM contact WHERE name=?`, [company_name],
        (error, results, fields) => {

            if (error) res.send({ 'result': false, 'err': error.message })

            if (!error) {
                let sql = ''
                let params = []
                const data = {
                    'company': req.body.company,
                    'location': req.body.location,
                    'road_alley': req.body.road_alley,
                    'sub_district': req.body.sub_district,
                    'district': req.body.district,
                    'province': req.body.province,
                    'postcode': req.body.postcode,
                    'contact_number': req.body.contact_number,
                    'email': req.body.email,
                    'tax_id': req.body.tax_id,
                    'shop_logo': req.file ? req.file.filename : ''
                }


                console.log(data)
                if (results.length == 0) {
                    params = [id, company_name, JSON.stringify(data), created, modified]
                    sql = "INSERT INTO contact VALUES(?,?,?,?,?)"
                }

                if (results.length == 1) {
                    const logo_collect = req.body.logo_collect
                    const shop_logo_old = JSON.parse(results[0].data).shop_logo
                    if (logo_collect == 'old') data.shop_logo = shop_logo_old
                    sql = `UPDATE contact SET data=?,modified=? WHERE name=?`
                    params = [JSON.stringify(data), modified, company_name]

                }
                console.log(sql, params)
                condb.execute(sql, params, (error, results, fields) => {
                    if (error) res.send({ 'result': false, 'err': error.message })
                    if (!error) res.send({ 'result': true })
                })
            }
        })
}
module.exports.AboutController = { webAboutaPage, keywordPage, save }