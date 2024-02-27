
function getMeetingBookingByDate(date) {

    console.log(date)
    axios
        .get(`/api/booking/reservations/${date}`)
        .then((response) => {
            console.log(response);
            const data = response.data.entries;
            console.log(data);
            let el = ``;
            for (let i = 0; i < data.length; i++) {
                const d = data[i];
                const date = `<span class="font-weight-bold">วันที่ใช้</span> ${d.checkin} <span class="font-weight-bold">ถึงวันที่</span> ${d.checkout}`;
                const name = `<span class="font-weight-bold">ผู้ขอใช้</span> ${d.fname} ${d.lname}`;

                const department = `<span class="font-weight-bold">แผนก</span> ${d.use_department}`;
                const colDetail = `<td>${date}</td>`;
                const row = `<tr>${colDetail}</tr>`;
                el += row;
            }
            console.log(el);
            $("#reservatBooking").html(el);
            $("#reservatCalendarModal").modal("show");
        })
        .catch((err) => {
            console.log(err);
        });
}