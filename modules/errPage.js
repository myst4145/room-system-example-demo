function errPage(res, err) {
    const notfoundPage = 'errNotfound'
    res.render(notfoundPage, {
        'msg': err,
        'err_no': err.errno
    })
}
module.exports = {errPage}