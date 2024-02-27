async function getSession(req) {
    return await req.session
}
module.exports.getMemberId = { getSession }