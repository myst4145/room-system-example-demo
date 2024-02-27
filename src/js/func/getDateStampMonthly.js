function getDateStampMonthly(checkin, checkout) {
    let date_stamp = []
    const m_checkin = parseInt(getThaiMonthByFullDateLocal(checkin))
    const m_checkout = parseInt(getThaiMonthByFullDateLocal(checkout))
    let y_checkin = parseInt(getYearByFullDateLocal(checkin))
    const y_checkout = parseInt(getYearByFullDateLocal(checkout))
    const countYear = y_checkout - y_checkin
    let m = m_checkin

    if (countYear == 0) {
        let count_m = m_checkout
        for (let i = m_checkin; i <= count_m; i++) {
            const _m = i
            const _y = y_checkin
            date_stamp.push(`${_y}-${getCountDate(_m)}`)
        }
    }
    if (countYear > 0) {
        for (let p = 0; p <= countYear; p++) {
            let m_count = 0

            if (p == 0) {
                m = m_checkin
                m_count = 12

            } else if (p != 0 && p != countYear) {
                m_count = 12
                m = 1
            } else if (p == countYear) {
                m_count = m_checkout
                m = 1
            }
            for (let i = m; i <= m_count; i++) {
                let year = y_checkin + p
                date_stamp.push(`${year}-${getCountDate(i)}`)
            }
        }
    }

    return date_stamp
}