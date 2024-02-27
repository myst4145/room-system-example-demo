document.addEventListener('DOMContentLoaded', () => {
    const params = getQueryParams()
    retainOptionValue($('#roomType'), params.room_type)
    retainOptionValue($('#bedType'), params.bed_type)
    retainOptionValue($('#roomview'), params.roomview)
    createPaginateOnLoad()
})
$('#findDataBtn').click(function () {
    let route = "";
    const rType = $("#roomType").val();
    const bType = $("#bedType").val();
    const rView = $("#roomview").val();

    route += setqueryParams(rType, "room_type");
    route += setqueryParams(bType, "bed_type");
    route += setqueryParams(rView, "roomview");

    if (route != "") {
        const page = thisPage(window.location.href)
        const path = page + route
        location.assign(path)
    }
});



$('#resetRoomQuery').click(function () {
    $('[name="single-filter"]').val("");
    $('[name="multi-filter"]').val("");
});

$('#getRoomDataAll').click(function () {
    const thisPage = window.location.href;
    const route = !thisPage.includes("&") ?
        thisPage :
        thisPage.substring(0, thisPage.indexOf("&"));
    window.location.assign(route);
});
$('#findRoomByIdBtn').click(function () {
    const id = $('#findRoomById').val().trim()
    if (id != '') location.assign(`/admin?p=room_m&id=${id}`)
})
$('[name="room-remove"]').click(function () {
    const id = $(this).attr("data-id");
    confirm("ลบข้อมูลห้องพัก", "ต้องการลบข้อมูลห้องพักรายการนี้ใช่หรือไม่ ? ")
        .then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/room/delete/${id}`).then((res) => {
                    const result = res.data.result;
                    if (result) querySuccess("ลบสำเร็จ", 1000)
                    if (!result) {
                        queryFail(
                            "ลบข้อมูลห้องพัก",
                            "ลบข้อมูลล้มเหลว! โปรดลองใหม่อีกครั้งภายหลัง",
                            res.data.err
                        );
                    }
                });
            }
        })
        .catch((err) => {
            queryFail('ข้อผิดพลาด', err, '')
        });
});