const { getDateStampisDailyQuery, getDateStampisMonthlyQuery } = require("./getChecinAndCheckoutDate")


function getDateStampAndTransactionMonthly(rental_type, checkin, checkout) {
    let date_stamp = rental_type == 'monthly'
        ? getDateStampisMonthlyQuery(checkin, checkout)
        : getDateStampisDailyQuery(checkin, checkout)
    let transaction = []
    if (rental_type == 'monthly') {
        let filter_date_stamp = []
        date_stamp.forEach((r) => {
            const [, , dt] = r.split('-')
            if (dt != '01') filter_date_stamp.push(r)
        })
        filter_date_stamp.forEach((t) => {
            const [y, m] = t.split('-')
            transaction.push({
                'date': `${y}-${m}`,
                'paid': 0,
                'pay_at': '',
                'status': 'progress'
            })
        })
    }
    return { date_stamp, transaction }
}
module.exports = { getDateStampAndTransactionMonthly }