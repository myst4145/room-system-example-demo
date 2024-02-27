function systemRole(path, _admin_role, _data_role) {

    const middleware = [
        {
            'path': 'booking_report',
            'role': {
                'admin_role': ['finance', 'manager'],
                'data_role': ['report_role']
            }
        },
        {
            'path': 'booking_room',
            'role': {
                'admin_role': ['cashier'],
                'data_role': ['booking_create', 'booking_view'],
                'compare': '&'
            }
        },
        {
            'path': 'cf_pay',
            'role': {
                'admin_role': ['cashier'],
                'data_role': ['booking_edit', 'booking_view'],
                'compare': '&'
            }
        },
        {
            'path': 'checkin',
            'role': {
                'admin_role': ['cashier'],
                'data_role': ['booking_edit', 'booking_view'],
                'compare': '&'
            }
        },
        {
            'path': 'rental_m',
            'role': {
                'admin_role': ['cashier'],
                'data_role': ['booking_role']
            }
        },
        {
            'path': 'rental_dly',
            'role': {
                'admin_role': ['cashier'],
                'data_role': ['booking_role']
            }
        },
        {
            'path': 'rental_mly',
            'role': {
                'admin_role': ['cashier'],
                'data_role': ['booking_role']
            }
        },
        {
            'path': 'building',
            'role': {
                'admin_role': ['administrator'],
                'data_role': ['room_role']
            }
        },
        {
            'path': 'rm_m',
            'role': {
                'admin_role': ['administrator'],
                'data_role': ['room_role']
            }
        },
        {
            'path': 'rm_ins',
            'role': {
                'admin_role': ['administrator'],
                'data_role': ['room_create']
            }
        },
        {
            'path': 'rm_edit',
            'role': {
                'admin_role': ['administrator'],
                'data_role': ['room_edit']
            }
        },
        {
            'path': 'payment',
            'role': {
                'admin_role': ['administrator', 'finance'],
                'data_role': ['basic_info']
            }
        },
        {
            'path': 'qrcode',
            'role': {
                'admin_role': ['administrator', 'finance'],
                'data_role': ['basic_info']
            }
        },
        {
            'path': 'promotion',
            'role': {
                'admin_role': ['administrator', 'finance'],
                'data_role': ['basic_info']
            }
        },
        {
            'path': 'company_contact',
            'role': {
                'admin_role': ['administrator', 'finance'],
                'data_role': ['basic_info']
            }
        },
        {
            'path': 'logo',
            'role': {
                'admin_role': ['website'],
                'data_role': ['web_manage']
            }
        }, {
            'path': 'meta',
            'role': {
                'admin_role': ['website'],
                'data_role': ['web_manage']
            }
        },
        {
            'path': 'room-about',
            'role': {
                'admin_role': ['website'],
                'data_role': ['web_manage']
            }
        },
        {
            'path': 'm_slide',
            'role': {
                'admin_role': ['website'],
                'data_role': ['web_manage']
            }
        },
        {
            'path': 'social_contact',
            'role': {
                'admin_role': ['website'],
                'data_role': ['web_manage']
            }
        },
        {
            'path': 'member',
            'role': {
                'admin_role': ['administrator'],
                'data_role': ['basic_info']
            }
        },
        {
            'path': 'officer_role',
            'role': {
                'admin_role': ['administrator','admin'],
                'data_role': ['basic_info']
            }
        },
        {
            'path': 'officer_m',
            'role': {
                'admin_role': ['administrator','admin'],
                'data_role': ['basic_info']
            }
        }
    ]

    const hasIndexPath = middleware.findIndex((r) => r.path == path)
    console.log('dddd', hasIndexPath)
    let admin_role = false
    let data_role = false
    if (hasIndexPath >= 0) {
        admin_role = middleware[hasIndexPath].role.admin_role.includes(_admin_role)
        const data_role_key = middleware[hasIndexPath].role.data_role
        let is_role_valid = 0
        let is_role = false
        data_role_key.forEach((k) => {
            const has_key = Object.keys(_data_role).indexOf(k)
            if (has_key) is_role = Object.values(_data_role)[has_key]
            if (is_role) is_role_valid++
        })
        const is_compare = middleware[hasIndexPath].role.compare
        const count_valid = data_role_key.length
        data_role = is_compare != '&'
            ? is_role_valid >= 1
            : is_role_valid == count_valid
    }
    return hasIndexPath >= 0 ? admin_role || data_role : true
}
module.exports = systemRole