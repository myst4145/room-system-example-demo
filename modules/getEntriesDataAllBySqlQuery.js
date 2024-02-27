const { db } = require("./DB")
const { getDataEntriesCount } = require("./getDataEntriesCount")
async function getEntriesDataAllBySqlQuery(sql, replaceString, field) {
    const data = await db(getDataEntriesCount(sql, replaceString, field))
    const row_all = data[0].count
    return row_all
}
module.exports = {getEntriesDataAllBySqlQuery}