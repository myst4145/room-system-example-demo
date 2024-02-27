$('button[name="room-info"]').click(function () {
    const id = $(this).attr("data-id");
    axios.get(`/room/info/data/${id}`)
        .then((res) => {
            const data = res.data;
            if (!data.result) {
                queryFail("ข้อมูลห้องพัก", "โหลดข้อมูลล้มเหลว", data.err);
            }

            if (data.result) {
                const roomInfo = $('.room-info')
                const room_sub = data.entries[0].room_sub
                let roomEntries = ``
                let exampleRoom = ``

                room_sub.forEach((s, i) => {
                    const nCol = `<td>${s.room_number}</td>`;
                    const nIdInput = `<input type="text" value="${s.room_number_id}" class="form-control-plaintext" id="${s.room_number_id}" disabled />`
                    const nIdCol = `<td class="align-middle">${nIdInput}</td>`;
                    const buildingCol = `<td class="align-middle">${s.building_name}</td>`;
                    const buildingFloorCol = `<td class="text-center">${s.building_floor}</td>`;

                    let copyBtn = `<button class="input-group-text btn bg-gradient-light" onclick="copyData($('#${s.room_number_id}'), $('#alert-${s.room_number_id}'))">`
                    copyBtn += `<i class="fa-solid fa-copy"></i>`
                    copyBtn += `</button>`

                    let copyAlert = `<div class="position-absolute">`
                    copyAlert += `<p id="alert-${s.room_number_id}" class="position-relative  tooltop-alert bg-gradient-dark badge"></p>`
                    copyAlert += `</div>`

                    const copyCol = `<td class="text-center">${copyAlert}${copyBtn}</td>`;
                    let row = `<tr class="align-middle">`
                    row += `${nIdCol}`
                    row += `${copyCol}`
                    row += `${nCol}`
                    row += `${buildingCol}`
                    row += `${buildingFloorCol}`
                    row += `</tr>`
                    roomEntries += row;
                });
                const entries = data.entries;
                const roomType = Display.getRoomtype(data.entries[0].room_type);
                const bedType = Display.resBed(data.entries[0].bed_type);
                const roomView = Display.getRoomview(data.entries[0].roomview);

                let specialOptions = ``;
                let specialOptionsDisplay = `none`
                if (entries[0].special_options != '') {
                    specialOptionsDisplay = 'block'
                    const special_options = entries[0].special_options.split(',')
                    for (let i = 0; i < special_options.length; i++) {
                        specialOptions += `<li class="m-0">${special_options[i]} </li>`;
                    }
                }

                const room = [
                    roomType, bedType, roomView,
                    entries[0].bed_amount, entries[0].toilet_count,
                    getNumberFormat(entries[0].price),
                    getDateTimeisThaiByDateTime(entries[0].created),
                    getDateTimeisThaiByDateTime(entries[0].modified),
                ]


                for (let i = 0; i < roomInfo.length; i++) {
                    $(roomInfo[i]).html(room[i]);
                }

                entries[0].example_room.split(",").forEach((e) => {
                    let src = `<div class="col-md-6">`
                    src += `<img src = "/src/img/example_room/${e}" class="modal-example-room-items p-2">`
                    src += `</div>`
                    exampleRoom += src
                })

                $('#specialOptions').css('display', specialOptionsDisplay)
                $("#moreOptions").html(specialOptions);
                $("#room-example-preview").html(exampleRoom);
                $("#room-entries").html(roomEntries);
                $("#room-modal").modal("show");
            }
        })
        .catch((err) => {
            queryFail('ข้อผิดพลาด', err, '')
        });
});