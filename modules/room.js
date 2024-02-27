const { createRandom } = require("../src/js/function")


function createRoomSubData(room_sub) {
    room_sub.map((r) => {
        const id = r.room_number_id != '' ? r.room_number_id : `RNB${createRandom()}`
        return {
            'room_number_id': `${id}`,
            'room_number': r.room_number,
            'building': r.building,
            'building_floor': r.building_floor,
            'elc_user_no': r.elc_user_no,
            'wat_user_no': r.wat_user_no,
            'wat_user_reg': r.wat_user_reg,
            'elc_meter_no': r.elc_meter_no,
            'elc_receipt_no': r.elc_receipt_no,
            'elc_acct_no': r.elc_acct_no,
            'soft_delete': r.soft_delete,
            'status': r.status
        }
    })
    return room_sub
}
module.exports = { createRoomSubData }