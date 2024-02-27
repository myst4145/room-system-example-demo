function entries_row_query(route, row) {
    let query = `<div>`
    query += `<div class="d-flex align-items-center">`
    query += `<span class="mr-2 font-weight-bold">แสดง</span>`
    query += `<select onchange="pagination_query(event)" class="my-1 custom-select " id="pagination-query">`
    query += `<option value="" selected>0</option>`
    let i = 0
    while (i <= 100) {

        i += 5
        if (i >= 51 && i <= 99) continue
        if (i == 105) break

        query += `<option value="${route}&row=${i}"`
        if (i == row) query += 'selected'
        query += `>${i}</option>`
    }

    query += `</select>`
    query += `<label class="ml-2 font-weight-bold">รายการ</label>`
    query += `</div>`
    query += `</div>`
    return query
}

function create_pagination(index, count, route) {
    const firstDisabled = index == 0 ? 'disabled' : ''
    const lastDisabled = index == count - 1 ? 'disabled' : ''
    const bgActiveFirst = index == 0 ? 'bg-gradient-light' : ''
    const bgActiveLast = index == count - 1 ? 'bg-gradient-light' : ''
    const bgActive = 'bg-gradient-primary'

    pagination = '<nav class="font-weight-bold">';
    pagination += '<ul class="pagination pagination-sm justify-content-end">';
    if (count > 0) {
        pagination += `<li class="page-item ${firstDisabled}">`
        pagination += `<a class="page-link ${bgActiveFirst}" href="${route}&page=0">หน้าแรก</a>`
        pagination += `</li>`
        pagination += `<li class="page-item ${lastDisabled}">`
        pagination += `<a class="page-link ${bgActiveLast}" href="${route}&page=${(count - 1)}">หน้าสุดท้าย</a>`
        pagination += `</li>`
        pagination += '</ul>';
        pagination += '</nav>';

        pagination += '<nav class="font-weight-bold">';
        pagination += '<ul class="pagination pagination-sm justify-content-end border-0">';



        if (index > 0) {
            pagination += '<li class="page-item">';
            pagination += `<a class="page-link" href="${route}&page=${(index - 1)}">`
            pagination += "ก่อนหน้า";
            pagination += '</a>';
            pagination += '</li>';
        }


        if (count <= 5) {
            let link = "";
            for (i = 0; i < 5; i++) {
                if (i < count) {
                    link += '<li class="page-item';
                    link += i == index ? ` active">` : '">';
                    link += `<a href="${route}&page=${i}" class="page-link `
                    link += i == index ? ` ${bgActive} ">` : '">';
                    link += (i + 1);
                    link += "</a></li>";
                }
            }
            pagination += link;
        }

        if (count > 5) {
            if (index < 2) {
                let link = "";
                for (i = 0; i < 5; i++) {
                    if (i <= count) {
                        link += '<li class="page-item ';
                        link += i == index ? ` active">` : '">';
                        link += `<a  href="${route}&page=${i}" class="page-link `
                        link += i == index ? ` ${bgActive} ">` : '">';
                        link += (i + 1);
                        link += "</a></li>";
                    }
                }
                pagination += link;
            }


            if (index >= 2) {
                let link1 = "";
                let link2 = "";
                for (i = index - 4; i <= index - 2; i++) {
                    if (i >= 0) {
                        link1 += '<li class="page-item ';
                        link1 += i == index ? ` active">` : '">';
                        link1 += `<a  href="${route}&page=${i}" class="page-link `
                        link1 += i == index ? ` ${bgActive} ">` : '">';
                        link1 += (i + 1);
                        link1 += "</a></li>";
                    }
                }
                pagination += link1;

                for (i = index; i <= index + 2; i++) {
                    if (i <= count - 1) {
                        link2 += '<li class="page-item ';
                        link2 += i == index ? ` active">` : '">';
                        link2 += `<a  href="${route}&page=${(i)}" class="page-link `
                        link2 += i == index ? ` ${bgActive} ">` : '">';
                        link2 += i + 1
                        link2 += "</a></li>";
                    }
                }
                pagination += link2;
            }
        }

        if (index < count - 1) {
            pagination += '<li class="page-item">';
            pagination += `<a class="page-link" href="${route}&page=${(index + 1)}">`
            pagination += 'ถัดไป';
            pagination += "</a></li>";
        }

        pagination += '</ul>';
        pagination += '</nav>';
    }


    return pagination;
}

function getLocationPage() {
    const href = location.href
    const url = new URL(href)
    const params = url.searchParams
    const page_type = params.get('p')
    return `${location.pathname}?p=${page_type}&page=0`
}

function pagination_query(evt) {
    const value = $(evt.target).val()
    if (value != '') {
        location.assign(value)
    }
}
