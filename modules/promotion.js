const { db } = require("./DB");
const { getDateisShortThai, getTimeStampByDate, getTimeStampisNow, getDateIsNow } = require("../src/js/dateFunc")
const { getPromotionTypeFormat } = require("../src/js/func");


async function getIsValidatePromotionByDateStamp(room_number_id, date_stamp) {
    const room_number_id_list = room_number_id.split(',')

    let sql = `SELECT * FROM promotion WHERE soft_delete !='true'`
    sql += `AND ( `
    date_stamp.forEach((d, i) => {
        sql += ` date_stamp LIKE '%${d}%' `
        if (i < date_stamp.length - 1) sql += ` OR `
    })


    sql += ` ) AND  ( `
    room_number_id_list.forEach((r, i) => {
        sql += ` room_number_id LIKE '%${r}%' `
        if (i < room_number_id_list.length - 1) sql += ` OR `
    })

    sql += ` ) ORDER BY created DESC LIMIT 0,5`
    const promotion = await db(sql)
    return promotion.length == 0 ? false : true
}

// async function getPromotionByRoomNumberId(promotions, room_number_id) {
//     let promotion_idx = []
//     let filterPromotion = promotions
//         .filter((p) => {
//             const rnid = p.room_number_id.split(',')
//             const h = rnid.includes(room_number_id)
//             if (h) return p
//         }).map((p) => p.promotion_id)
//     const promotion_id = promotions.map((p) => p.promotion_id)


//     filterPromotion = filterPromotion.map((p) => {

//         const index = promotion_id.indexOf(p)
//         console.log('fffff', index)
//         return index
//     })
//     // console.log(promotion_id)
//     console.log('ddd', filterPromotion)
//     // let promotionList = []
//     // filterPromotion.forEach((p) => {
//     //     const has_promotion = promotions
//     //         .findIndex((s) => {
//     //             if (s.room_number_id
//     //                 .split(',')
//     //                 .includes(room_number_id)) {
//     //                 return p
//     //             }
//     //         })
//     //     promotion_idx.push(has_promotion)
//     //     promotionList = hasNextPromotionData(promotions, has_promotion)
//     //     // hasNextPromotionData(promotions, has_promotion)
//     //     // console.log('las f',promotions)
//     // })
//     // console.log('hhhh', promotion_idx)


//     // return has_promotion
// }
// function hasNextPromotionData(promotion, pos) {
//     console.log('pos', pos)
//     return promotion.filter((p, i) => {
//         if (i != pos) {
//             return p
//         }
//     })
// }

async function getPromotionDataAll() {
    const _date = getDateIsNow()
    let sql = `SELECT * FROM promotion WHERE soft_delete !='true' `
    sql += `AND date_stamp LIKE '%${_date}%'`
    const promotionData = await db(sql)
    return promotionData
}

module.exports = {
    getIsValidatePromotionByDateStamp, getPromotionDataAll
}