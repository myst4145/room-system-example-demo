function duplicateRoom(event) {
    const selfEl = $(event.target)
    const parent = selfEl.parent().parent()
    const n = selfEl.attr('name')
    let beforeRoom = ''
    let beforeBuilding = ''

    const numberRoom = parent.children(':eq(0)').children().filter('input').val()
    const buildingNameId = parent.children(':eq(1)').children().filter('select').val()

    console.log(numberRoom, buildingNameId)
    const numberInputEl = parent.children(':eq(0)').children()
    const buildingInputEl = parent.children(':eq(1)').children()

    beforeRoom = selfEl.attr('data-before-room')
    beforeBuilding = buildingInputEl.attr('data-building-before')


    if (buildingNameId != '' && numberRoom != '') {
        if (beforeBuilding != beforeBuilding || beforeRoom != numberRoom) {
            axios.post('/room/auth/duplicate', {
                'number_room': numberRoom,
                'building_id': buildingNameId
            })
                .then((res) => {
                    const result = res.data.result
                    if (!result) {
                        $('#room-group').attr('data-valid', 'false')
                        validateformEmpty(true, $(
                            "#validate-roomnumber"),
                            'ไม่สามารถใช้หมายเลขนี้ได้ หมายเลขนี้ถูกใช้งานแล้ว'
                        )
                    }

                    if (result) {

                        $('#room-group').attr('data-valid', 'true')
                        validateformEmpty(false, $(
                            "#validate-roomnumber"), '')
                        isRoomNumberValid(numberRoom, buildingNameId)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    statusErr()
                })
        }

    }
}

function isRoomNumberValid(numberRoom, buildingNameId) {
    const rn = $('[name="room-number"]')
    const b = $('[name="building"]')
    const floor = $('[name="buildingfloor"]')
    const eun = $('[name="electricity-user-number"]')
    const wun = $('[name="water-user-number"]')

    let roomsJson = []

    for (let i = 0; i < rn.length; i++) {
        roomsJson.push({
            'room_number': $(rn[i]).val(),
            'building': $(b[i]).val(),
            'floor': $(floor[i]).val(),
            'electricity_user_number': $(eun[i]).val(),
            'water_user_number': $(wun[i]).val()
        })
    }

    const result = roomsJson.filter((r) => {
        if (r.room_number == numberRoom && r.building == buildingNameId) {
            return r
        }
    })
    if (result.length > 1) {
        $('#room-group').attr('data-valid', 'false')
        validateformEmpty(true, $(
            "#validate-roomnumber"),
            'ไม่สามารถใช้หมายเลขนี้ได้ หมายเลขนี้ถูกใช้งานแล้ว'
        )
    }
}