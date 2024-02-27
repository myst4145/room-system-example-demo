function getCurrentCountTime(checkin, count, rentaltype) {
    const date = checkin.split('-')
    const y = parseInt(date[0])
    const m = parseInt(date[1])
    const count = m + (timeCountFind - 1)
    let year_append = 0
    let mcheckout = 0
    let checkout = ''
    switch (rentaltype) {
        case 'monthly':
            year_append = Math.floor(count / 12)
            mcheckout = count % 12
            if (mcheckout == 0) {
                mcheckout = 12
                year_append -= 1
            }
            const month = getCountDate(mcheckout)
            const ycheckout = y + year_append
            const sum_month = getCountMonth(ycheckout, mcheckout)
            checkout = `${ycheckout}-${month}-${sum_month}`
            break;
        case 'daily':
            const [ys, ms, ds] = checkinDateFind.split('-')
            const now = `${ys}-${ms}-${getCountDate(ds)} 00:00:00`
            const now_stamp = new Date(now).valueOf()
            const currentDay = 1000 * 60 * 60 * 24 * timeCountFind
            checkout = setDate(currentDay + now_stamp)
        default:
            break;
    }

}