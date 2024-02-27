function sqlModel(query, sql) {
    let string = sql
    let q_key_length = Object.keys(query).length - 1
    q_key_length -= query.row ? 1 : 0
    q_key_length -= query.page ? 1 : 0
    let i = 0
    if (q_key_length > 0) {
        string += ` WHERE `
        for (const [key, value] of Object.entries(query).
            filter(v => v != 'p' && v != 'row' &&  v != 'page' && v !='checkin_date'
            && v != 'check_is'
            
            )) {
            if (key != 'p' && key != 'row' && key != 'page') {
                string += ` rooms.${key}='${value}'`
                if (q_key_length > 1) {
                    string += ` AND `
                }
                q_key_length--
            }
        }
    }
    return string
}


function getCountAND(sql, count) {
    if (count > 1) {
        count--
        sql = count > 1 ? sql += ' AND ' : ''
    }
    return [sql, count]
}
module.exports = sqlModel