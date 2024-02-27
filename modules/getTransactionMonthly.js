function getTransactionMonthly(rentaltype,date_stamp) {
    let transaction = []
    if (rentaltype == 'monthly') {
        let filter_date_stamp = []
        date_stamp.forEach((r) => {
            const [, , dt] = r.split('-')
            const h = dt.includes('01')
            if (!h) filter_date_stamp.push(r)
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
    return transaction
}

module.exports = { getTransactionMonthly }
