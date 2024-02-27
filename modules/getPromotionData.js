const { getDateisShortThai, getTimeStampByDate, getTimeStampisNow } = require("../src/js/dateFunc")
const { getPromotionTypeFormat } = require("../src/js/func")


function getPromotionData(_price, promotion) {
    let is_promotion = false
    let new_price = 0
    let discount_time_in = ''
    let discount_txt = ''
    let discount = 0
    const { promotion_type } = promotion
    const amount = parseFloat(promotion.amount)
    const now = getTimeStampisNow()
    const date_start = getTimeStampByDate(promotion.date_start)
    const date_end = getTimeStampByDate(promotion.date_end)
    if (date_start <= now && date_end >= now) {
        is_promotion = true
        const typeFormat = getPromotionTypeFormat(promotion_type)
        const date_start_txt = getDateisShortThai(promotion.date_start)
        const date_end_txt = getDateisShortThai(promotion.date_end)
        const price = parseFloat(_price)
        switch (promotion_type) {
            case 'percent':
                discount = (price * amount) / 100
                break;
            case 'currency':
                discount = amount
                break;
            default:
                break;
        }
        if (discount > price) new_price = 0
        if (discount <= price) new_price = price - discount
        discount_time_in = `ตั้งแต่ ${date_start_txt} ถึง ${date_end_txt} `
        discount_txt = `ลด ${promotion.amount} ${typeFormat}`
    }
    return { discount_time_in, new_price, is_promotion, discount_txt, discount }
}

module.exports = { getPromotionData }