function buildingfloorItems(e) {
    const selfEl = (e.target);
    const building = $(selfEl).val();
    const floorChildren = $(selfEl).parent().next().children().filter('select')
    duplicateRoom(e)
    if (building == '') {
        floorChildren.html(`<option value="">ชั้น</option>`);
        floorChildren.prop('disabled', true)
    } else if (building != '') {
        axios
            .get(`/api/buildingFloor/${building}`)
            .then((res) => {
                const data = res.data;
                if (data.result) {
                    const entries = data.entries;
                    let floorEl = `<option value="" selected>ชั้น</option>`;
                    for (let i = 1; i <= entries; i++) {
                        floorEl += `<option value="${i}">${i}</option>`;
                    }
                    floorChildren.html(floorEl);
                    floorChildren.prop('disabled', false)
                }
                if (!data.result) {
                    queryFail('ข้อผิดพลาด', 'โหลดข้อมูลไม่สำเร็จ', data.err)
                }

            })
            .catch((err) => {
                queryFail('ข้อผิดพลาด', 'โหลดข้อมูลไม่สำเร็จ', err)
            });
    };
}