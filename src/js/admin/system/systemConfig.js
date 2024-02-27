document.addEventListener('DOMContentLoaded', () => {
    const systemFontType = $('#systemFontType').val()
    const webFontType = $('#webFontType').val()
    retainRadioValue($('[name="system-fonttype"]'), systemFontType)
    retainRadioValue($('[name="web-fonttype"]'), webFontType)
})
$('#systemConfigSubmit').click(function () {
    const data = {
        'system_font_1': $('#systemFont1').val().trim(),
        'system_font_2': $('#systemFont2').val().trim(),
        'system_custom_font': $('#systemCustomFont').val().trim(),
        'system_font_size': $('#systemFontSize').val(),
        'system_fonttype': $('[name="system-fonttype"]').filter(':checked').val(),
        'web_font_1': $('#webFont1').val().trim(),
        'web_font_2': $('#webFont2').val().trim(),
        'web_custom_font': $('#webCustomFont').val().trim(),
        'web_font_size': $('#webFontSize').val(),
        'web_fonttype': $('[name="web-fonttype"]').filter(':checked').val(),
    }
    axios.post('/system/config/create', data)
        .then((response) => {
            if (response.data.result) {
                querySuccess('บันทึกเรียบร้อย')
            }
            if (!response.data.result) {
                queryFail('แจ้งเตือน', 'เกิดข้อผิดพลาด', response.data.err)
            }
        })
        .catch((err) => {
            queryFail('เกิดข้อผิดพลาด', err, '')
        })
})

function setFontSizeValue(range, id) {
    const v = $(`#${range}`).val()
    $(`#${id}`).val(v)
    console.log($(`${id}`))
}