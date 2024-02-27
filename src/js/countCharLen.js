function countCharLen(el, alert, len) {
    const value = $(el).val()
    const string = value.substring(0, len)
    const strlen = string.length

    $(alert).text(len - strlen)
    $(el).val(string)
}