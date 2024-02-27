const fs = require('fs')
const { errPage } = require('../modules/errPage')
const { condb, db } = require('../modules/DB')
const { getPagination } = require('../modules/getPagination')
const getPerPageAndEntryRow = require('../modules/getPerPageAndEntryRow')
const { getDateTimeisEngByDateTime } = require('../src/js/dateFunc')
async function store(req, res, responseObject, pageRender) {
    try {
        const pdf_dir = `src/pdf`
        const { page, row, index_start } = getPerPageAndEntryRow(req)
        const index_end = (page + 1) * row
        const row_all = fs.readdirSync(pdf_dir).length
        const pdfFileList = fs.readdirSync(pdf_dir).slice(index_start, index_end)
        const pdfFile = pdfFileList
            .sort((a, b) => b.localeCompare(a))
            .map((f) => {
                const _d = f.split('RS')[0]
                console.log(_d)
                const _y = _d.slice(0, 4)
                const _m = _d.slice(4, 6)
                const _dt = _d.slice(6, 8)
                const h = _d.slice(8, 10)
                const minute = _d.slice(10, 12)
                const seconds = _d.slice(12, 14)
                const created = `${_y}-${_m}-${_dt} ${h}:${minute}:${seconds}`
                return {
                    'filename': f,
                    'src': `/src/pdf/${f}`,
                    'created': getDateTimeisEngByDateTime(created)
                }
            })
        const paginate = getPagination(row_all, row, page)
        const query = {}
        Object.assign(responseObject, { 'entries': pdfFile, paginate, query })
        res.render(pageRender, responseObject)
    } catch (err) {
        errPage(res, err)
    }
}

function _delete(req, res) {
    try {
        const files = req.body.file
        const fileCount = files.length
        const err_count = 0
        const dir = `src/pdf`

        files.forEach((f) => {
            const src = `${dir}/${f}`
            const hasFile = fs.existsSync(src)
            if (hasFile) fs.unlinkSync(src)
        })
        res.send({ 'result': true })
    } catch (err) {
        res.send({ 'result': false, 'err': err.message })
    }

}


module.exports.PDFController = { store, _delete }