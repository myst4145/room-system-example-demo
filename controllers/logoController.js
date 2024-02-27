const { db, condb } = require('../modules/DB')
const { errPage } = require('../modules/errPage')
const { getLogoFieldName } = require('../modules/getFieldName')
const fs = require('fs')
const path = require('path')
const { getCountFullDate, createRandom } = require('../src/js/function')
const notfoundPage = 'errNotfound'

function create(req, res, responseObject, pageRender) {
    const sql = `SELECT * FROM contact WHERE name=?`
    const fieldname = getLogoFieldName()
    condb.execute(sql, [fieldname], (err, result, fields) => {
        if (err) {
            errPage(res, err)
        }
        if (!err) {
            const logoDir = 'src/img/logo/'
            let logo_text = ''
            let logo_file = ''
            let title = ''
            let icon = ''
            let icon_opt_checked = ''
            let logo_opt_checked = ''
            if (result.length > 0) {
                const _data = JSON.parse(result[0].data)
                logo_text = _data.logo_text
                title = _data.title
                let has_icon = fs.existsSync(path.join(logoDir, _data.icon))
                let has_logo = fs.existsSync(path.join(logoDir, _data.logo_file))
                if (has_icon) {
                    icon = _data.icon
                    icon_opt_checked = 'checked'
                }
                if (has_logo) {
                    logo_file = _data.logo_file
                    logo_opt_checked = 'checked'
                }

            }


            Object.assign(responseObject, {
                logo_file,
                logo_text,
                title,
                icon,
                icon_opt_checked,
                logo_opt_checked
            })
            console.log(icon, icon_opt_checked)
            res.render(pageRender, responseObject)
        }
    })
}
function logo(req, res) {

    let logo = ''
    let type = ''

    if (req.files.logo) {
        type = 'file'
        logo = req.files.logo[0].filename
    }
    if (req.body.logo) {
        type = 'text'
        logo = req.body.logo
    }

    const created = getCountFullDate().timestamp
    const modified = getCountFullDate().timestamp

    const data = [
        'logo',
        type,
        '',
        logo,
        '',
        created,
        modified
    ]
    condb.query("SELECT * FROM logo WHERE id=? ", "logo", async (error, results, fields) => {
        if (error) {
            res.send({ 'result': false, 'err': error.message })
        }
        if (!error) {
            if (results.length == 0) {
                condb.query("INSERT INTO logo VALUES(?,?,?,?,?,?,?) ", data, async (error, results, fields) => {
                    if (error) {
                        res.send({ 'result': false, 'err': error.message })
                    }
                    if (!error) {
                        res.send({ 'result': true, 'entries': results })
                    }
                })
            }


            if (results.length == 1) {


                let up = `UPDATE logo SET type ='${type}',logo='${logo}',`
                up += `modified='${modified}' WHERE id='logo' `


                condb.query(up, async (error, results, fields) => {
                    if (error) {
                        res.send({ 'result': false, 'err': error.message })
                    }
                    if (!error) {
                        res.send({ 'result': true, 'entries': results })
                    }
                })
            }
        }
    })
}

async function insert(req, res) {
    const id = `A${createRandom()}`
    const fieldname = getLogoFieldName()
    const logo_text = req.body.logo_text
    const title = req.body.title
    const logo_file = req.files.logo ? req.files.logo[0].filename : ''
    const icon = req.files.icon ? req.files.icon[0].filename : ''
    const created = getCountFullDate().timestamp
    const modified = getCountFullDate().timestamp
    let params = []
    let sql = ``
    const logoData = await db(`SELECT * FROM contact WHERE name='${fieldname}'`)
    console.log(logoData.length)
    if (logoData.length == 0) {
        const data = {
            'logo_text': logo_text,
            'logo_file': logo_file,
            'icon': icon,
            'title': title
        }
        params = [
            id,
            fieldname,
            JSON.stringify(data),
            created,
            modified
        ]
        sql = `INSERT INTO contact VALUES (?,?,?,?,?)`
    }
    if (logoData.length > 0) {
        const { icon_opt, logo_opt } = req.body
        let _data = JSON.parse(logoData[0].data)
        _data.title = title
        _data.logo_text = logo_text
        if (icon_opt == 'new') _data.icon = icon
        if (logo_opt == 'new') _data.logo_file = logo_file

        params = [
            JSON.stringify(_data),
            modified,
            fieldname
        ]
        sql = `UPDATE contact SET data=?,modified=? WHERE name=?`
    }
    // const sql = `INSERT INTO contact VALUES (?,?,?,?,?)`



    condb.execute(sql, params, async (err, results, fields) => {
        if (err) {
            res.send({ 'result': false, 'err': err.message })
        }
        if (!err) {
            res.send({ 'result': true, 'entries': results })
        }
    })
}

function icon(req, res) {

    let icon = ''

    if (req.files.icon) {
        icon = req.files.icon[0].filename
    }

    const created = getCountFullDate().timestamp
    const modified = getCountFullDate().timestamp

    const data = [
        'logo',
        '',
        '',
        '',
        icon,
        created,
        modified
    ]
    condb.query("SELECT * FROM logo WHERE id=? ", "logo", async (error, results, fields) => {
        if (error) {
            res.send({ 'result': false, 'err': error.message })
        }
        if (!error) {
            if (results.length == 0) {
                condb.query("INSERT INTO logo VALUES(?,?,?,?,?,?,?) ", data, async (error, results, fields) => {
                    if (error) {
                        res.send({ 'result': false, 'err': error.message })
                    }
                    if (!error) {
                        res.send({ 'result': true, 'entries': results })
                    }
                })
            }


            if (results.length == 1) {

                let up = `UPDATE logo SET icon='${icon}',`
                up += `modified='${modified}' WHERE id='logo'`


                condb.query(up, async (error, results, fields) => {
                    if (error) {
                        res.send({ 'result': false, 'err': error.message })
                    }
                    if (!error) {
                        res.send({ 'result': true, 'entries': results })
                    }
                })
            }
        }
    })
}

function title(req, res) {

    const title = req.body.title
    const created = getCountFullDate().timestamp
    const modified = getCountFullDate().timestamp
    console.log(title)
    const data = [
        'logo',
        '',
        title,
        '',
        '',
        created,
        modified
    ]
    condb.query("SELECT * FROM logo WHERE id=? ", "logo", async (error, results, fields) => {
        if (error) {
            res.send({ 'result': false, 'err': error.message })
        }
        if (!error) {
            if (results.length == 0) {
                condb.query("INSERT INTO logo VALUES(?,?,?,?,?,?,?) ", data, async (error, results, fields) => {
                    if (error) {
                        res.send({ 'result': false, 'err': error.message })
                    }
                    if (!error) {
                        res.send({ 'result': true, 'entries': results })
                    }
                })
            }


            if (results.length == 1) {

                let up = `UPDATE logo SET title ='${title}',`
                up += `modified='${modified}' WHERE id='logo' `



                condb.query(up, async (error, results, fields) => {
                    if (error) {
                        res.send({ 'result': false, 'err': error.message })
                    }
                    if (!error) {
                        res.send({ 'result': true, 'entries': results })
                    }
                })
            }
        }
    })
}

function store(req, res) {
    condb.query("SELECT * FROM logo", async (error, results, fields) => {
        if (error) {
            res.send({ 'result': false, 'err': error.message })
        }
        if (!error) {
            res.send({ 'result': true, 'entries': results })
        }
    })
}
module.exports.LogoController = { create, logo, title, icon, store, insert }