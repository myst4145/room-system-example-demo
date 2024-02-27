function setRole(data_role_obj) {
    const report_create = data_role_obj.filter((r) => r.role == 'report' && r.act == 'create')
    const report_create_accept = report_create.length > 0 ? report_create[0].accept : false
    const report_create_check = report_create_accept ? 'checked' : ''
    const report_view = data_role_obj.filter((r) => r.role == 'report' && r.act == 'view')
    const report_view_accept = report_view.length > 0 ? report_view[0].accept : false
    const report_view_check = report_view_accept ? 'checked' : ''

    const room_view = data_role_obj.filter((r) => r.role == 'room' && r.act == 'view')
    const room_view_accept = room_view.length > 0 ? room_view[0].accept : false
    const room_view_check = room_view_accept ? 'checked' : ''
    const room_create = data_role_obj.filter((r) => r.role == 'room' && r.act == 'create')
    const room_create_accept = room_create.length > 0 ? room_create[0].accept : false
    const room_create_check = room_create_accept ? 'checked' : ''
    const room_edit = data_role_obj.filter((r) => r.role == 'room' && r.act == 'edit')
    const room_edit_accept = room_edit.length > 0 ? room_edit[0].accept : false
    const room_edit_check = room_edit_accept ? 'checked' : ''
    const room_remove = data_role_obj.filter((r) => r.role == 'room' && r.act == 'remove')
    const room_remove_accept = room_remove.length > 0 ? room_remove[0].accept : false
    const room_remove_check = room_remove_accept ? 'checked' : ''
    const booking_view = data_role_obj.filter((r) => r.role == 'booking' && r.act == 'view')
    const booking_view_accept = booking_view.length > 0 ? booking_view[0].accept : false
    const booking_view_check = booking_view_accept ? 'checked' : ''
    const booking_create = data_role_obj.filter((r) => r.role == 'booking' && r.act == 'create')
    const booking_create_accept = booking_create.length > 0 ? booking_create[0].accept : false
    const booking_create_check = booking_create_accept ? 'checked' : ''
    const booking_edit = data_role_obj.filter((r) => r.role == 'booking' && r.act == 'edit')
    const booking_edit_accept = booking_edit.length > 0 ? booking_edit[0].accept : false
    const booking_edit_check = booking_edit_accept ? 'checked' : ''
    const booking_remove = data_role_obj.filter((r) => r.role == 'booking' && r.act == 'remove')
    const booking_remove_accept = booking_remove.length > 0 ? booking_remove[0].accept : false
    const booking_remove_check = booking_remove_accept ? 'checked' : ''
    const web_manage = data_role_obj.filter((r) => r.role == 'web' && r.act == 'manage')
    const web_manage_accept = web_manage.length > 0 ? web_manage[0].accept : false

    const basic_info = data_role_obj.filter((r) => r.role == 'basicInfo' && r.act == 'manage')
    const basic_info_accept = basic_info.length > 0 ? basic_info[0].accept : false
    const basic_info_check = basic_info_accept ? 'checked' : ''

    const booking_role = booking_view_accept || booking_create_accept
        || booking_edit_accept || booking_remove_accept
    const report_role = report_create_accept && report_view_accept

    const room_role = room_create_accept || room_view_accept ||
        room_edit_accept || room_remove_accept

    const room_manage = report_create_accept && room_edit_accept
        && room_view_accept && room_remove_accept

    const web_manage_check = web_manage_accept ? 'checked' : ''
    const data_role = {
        'report_view': report_view_accept,
        'report_create': report_create_accept,
        'room_view': room_view_accept,
        'room_create': room_create_accept,
        'room_edit': room_edit_accept,
        'room_remove': room_remove_accept,
        'booking_view': booking_view_accept,
        'booking_create': booking_create_accept,
        'booking_edit': booking_edit_accept,
        'booking_remove': booking_remove_accept,
        'web_manage': web_manage_accept,
        'basic_info': basic_info_accept,
        'booking_role': booking_role,
        'report_role': report_role,
        'room_role': room_role,
        'room_manage': room_manage,
        'report_view_check': report_view_check,
        report_create_check,
        report_view_check,
        room_view_check,
        room_create_check,
        room_edit_check,
        room_remove_check,
        booking_view_check,
        booking_create_check,
        booking_edit_check,
        booking_remove_check,
        basic_info_check,
        web_manage_check
    }
    console.log(data_role)
    return data_role
}
module.exports = setRole