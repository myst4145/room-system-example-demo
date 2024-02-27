function getPagination(all, row, page) {
    return {
        'page_all': Math.ceil(all / row),
        'row_all': all,
        page,
        row
    }
}
module.exports.getPagination = getPagination