function getPerPageAndEntryRow(req) {
    const row = req.query.row ? parseInt(req.query.row) : 10
    const page = req.query.page ? parseInt(req.query.page) : 0
    const index_start = (page * row)
    return { row, page, index_start }
}
module.exports = getPerPageAndEntryRow