function getSearchParamsIsPage() {
    const search = new URLSearchParams(location.search)
    return search
}

document.addEventListener("DOMContentLoaded", function () {


    const m = getSearchParamsIsPage().get("month");
    const y = getSearchParamsIsPage().get("year");

    const now = new Date();
    const month = m ? parseInt(m) : now.getMonth() + 1;
    const year = y ?? now.getFullYear();
    let date = new Date();
    console.log(month)
    const day = date.getDate();
    const sum_month = new Date(year, month, 0).getDate();
    const startMonth = new Date(year, month - 1, 1).getDay();

    const colspan = startMonth;
    console.log(startMonth, 'startMonth', colspan)
    const sumWeek = Math.ceil(sum_month / 7);
    let calendar = ``;
    for (let i = 0; i < sumWeek; i++) {
        let r = "";
        if (i == 0) {
            r += `<tr>`;

            for (let p = 0; p < colspan; p++) {
                r += `<td class="cr-date ${p}"></td>`;
            }

            for (let c = 0; c < colspan + 7; c++) {
                if (c + 1 < 7 - colspan + 1) {
                    let t = i + (c + 1);

                    r += `<td class="cr-date" data-date="${year}-${getCountDate(month)}-${getCountDate(t)}">${t}</td>`;
                    d = t;
                }
            }

            r += `</tr>`;
        }
        if (i >= 1 && i < sumWeek - 1) {
            r += `<tr>`;
            let t = 0;
            for (let c = 0; c < 7; c++) {
                t = d + (c + 1);
                r += `<td class="cr-date" data-date="${year}-${getCountDate(month)}-${getCountDate(t)}">${t}</td>`;
            }
            d = t;
            r += `</tr>`;
        }
        if (i == sumWeek - 1) {
            r += `<tr>`;
            let t = 0;
            for (let c = 0; c < 7; c++) {
                if (d + (c + 1) <= sum_month) {
                    t = d + (c + 1);
                    r += `<td class="cr-date" data-date="${year}-${getCountDate(month)}-${getCountDate(t)}">${t}</td>`;
                }
            }
            d = t;
            r += `</tr>`;
            if (d < sum_month) {
                for (let c = 0; c < 7; c++) {
                    if (d + (c + 1) <= sum_month) {
                        t = d + (c + 1);
                        r += `<td class="cr-date" data-date="${year}-${getCountDate(month)}-${getCountDate(t)}">${t}</td>`;
                    }
                }
            }
        }
        calendar += r;
    }
    $("#calendarBody").html(calendar);
    console.log('month ; ', month, y)
    $.each($('#calendar-date').children(), (idx, el) => {
        if ($(el).val() == month) {
            $(el).prop('selected', true)
        }
    })
    const r = location.href
    const path = this.location.pathname.split('/')
    console.log(path)
    const room_number_id = atob(path[path.length - 1])
    const rental_type = $('#meta-rental').attr('content')
    axios
        .get(`/booking/calendar/${room_number_id}?rental_type=${rental_type}&month=${month}&year=${y}`)
        .then((response) => {
            const data = response.data.entries;
            const calendarDateEl = $('.cr-date')
            data.forEach((d) => {
                $.each(calendarDateEl, (i, c) => {
                    if ($(c).attr('data-date') == d) {
                        const text = `
                        <p class="bg-success bg-gradient badge reser-booking m-0 p-2">
                            <i class="fa-solid fa-check"></i>
                           <span class="ms-1">${parseInt(d.split('-')[2])}</span>
                        </p>`
                        $(c).html(text)
                    }

                })

            });
        }).catch((err) => {
            console.log(err);
        });
})
