function retainRadioValue(element, retain) {
    $.each($(element), (i, opt) => {
        if ($(opt).val() == retain) {
            $(opt).prop('checked', true)
        }
    })
}

function retainOptionValue(element, retain) {
    $.each($(element).children(), (i, opt) => {
        if ($(opt).val() == retain) {
            $(opt).prop('selected', true)
        }
    })
}
function getQueryParams() {
    const query = JSON.parse($('#query').val())
    return query
}