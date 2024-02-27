async function getMemberIdBySession(req) {
    return await req.session.member_id
}
module.exports = { getMemberIdBySession }