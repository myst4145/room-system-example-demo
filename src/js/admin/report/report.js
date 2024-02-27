document.addEventListener('DOMContentLoaded', () => {
    const query = JSON.parse($('#query').val())
    const rental_type = query.rental_type
    retainRadioValue($('[name="rentaltype"]'), rental_type)
    createPaginateOnLoad()
})

$('button[name="open-report-modal"]').click(function () {
    const act = $(this).attr('data-act')
    const rentaltype = getRentalTypeValue().filter(':checked').val()
    const checkin = getCheckinValue().val().trim()
    const checkout = getCheckoutValue().val().trim()

    const {
        name,
        id
    } = getIdAndNameParam()
    const result = (act == 'receipt' && (name || id)) ?
        true : getFindReportData() != ''

    if (result) {
        const _id = $(this).attr('data-id')
        let dateDisplay = 'flex'
        let billDisplay = 'none'
        let checkin_retain = ''
        let checkout_retain = ''
        let id_retain = ''
        let alignmentDisplay = 'none'
        let receiptDisplay = 'none'
        $('button[name="report-submit"]').css('display', 'none')

        switch (act) {
            case 'pdf':
                alignmentDisplay = 'block'
                checkin_retain = checkin
                checkout_retain = checkout
                break;
            case 'report':
                checkin_retain = checkin
                checkout_retain = checkout
                break;
            case 'receipt':
                id_retain = _id
                receiptDisplay = 'block'
                dateDisplay = 'none'
                billDisplay = 'block'
                $('button[name="report-submit"]')
                    .filter(`[data-act="receipt"]`)
                    .attr('data-id', _id)
                break;
            default:
                break;
        }

        $('#bookingIdReport').val(id_retain)
        $('#startDate').val(checkin_retain)
        $('#endDate').val(checkout_retain)
        $('#receipt').css('display', receiptDisplay)
        $('#date-report').css('display', dateDisplay)
        $('#billReport').css('display', billDisplay)
        $('button[name="report-submit"]')
            .filter(`[data-act="${act}"]`)
            .css('display', 'inline')
        $('#alignment').css('display', alignmentDisplay)
        $('#setReportModal').modal('show')
    }
})

function findReportByParams(params) {
    const q = Object.keys(params)[0]
    const v = Object.values(params)[0]
    const page = thisPage(location.href)
    location.assign(`${page}&${q}=${v}`)
}

$('#findByIdBtn').click(function () {
    const id = $('#findById').val().trim()
    if (id != '') {
        findReportByParams({
            'id': id
        })
    }
})

$('#findById').keyup(function (event) {
    const keyCode = event.keyCode
    const id = $(this).val().trim()
    if ((keyCode == 13) && (id != '')) {
        findReportByParams({
            'id': id
        })
    }
})


function getReportNameQuery(name) {
    return name.replaceAll(' ', '-')
}

$('#findByName').keyup(function (event) {
    const keyCode = event.keyCode
    const name = $(this).val().trim()
    if ((keyCode == 13) && (name != '')) {
        findReportByParams({
            'name': getReportNameQuery(name)
        })
    }
})


$('#findByNameBtn').click(function () {
    const name = $('#findByName').val().trim()
    if (name != '') {
        findReportByParams({
            'name': getReportNameQuery(name)
        })
    }
})
$('#resetReport').click(function () {
    const page = thisPage(window.location.href)
    location.assign(page)
})
$('#resetReportValue').click(function () {
    getRentalTypeValue().prop('checked', false)
    getCheckoutValue().val('')
    getCheckinValue().val('')
})
$('#booking-id').keyup(function (event) {
    $('[name="single-include"]').val('')
    $('[name="multi-include"]').val('')
    if (event.keyCode == 13) {
        const id = $(this).val()
        if (id != '') {
            location.assign(`?p=booking-report&id=${id}`)
        }
    }
})
$('[type="number"]').keyup(function () {
    const v = $(this).val()
    const count = Number.parseInt(v)
    if (isNaN(count)) {
        $(this).val('')
    }
})

function getRentalTypeValue() {
    return $('[name="rentaltype"]')
}

function getCheckoutValue() {
    return $('#checkout')
}

function getCheckinValue() {
    return $('#checkin')
}



function getIdAndNameParam() {
    const params = get_query_params()
    const id = params.get('id')
    const name = params.get('name')
    return {
        id,
        name
    }
}
$('#reportView').click(function () {
    const rentaltype = getRentalTypeValue().filter(':checked').val()
    const checkin = getCheckinValue().val().trim()
    const checkout = getCheckoutValue().val().trim()

    let route = ''

})