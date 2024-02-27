function copyData(input, alert) {
    const copyText = input.val();
    navigator.clipboard.writeText(copyText);
    alert.text("คัดลอกสำเร็จ")
    alert.css('display', 'inline-block')
    outCopyText(alert)
}
{/* <div class="position-absolute">
<p id="rentalMonthlyAlert-<%= entries[i].booking_id %>" class="position-relative  tooltop-alert bg-gradient-dark badge"></p>
</div> */}
// function copyText(evt) {
//     const target = $(event.target)
//     const tagName = $(target).prop('tagName')
//     const el = tagName == 'I' ? target.parent() : target
//     const copyText = el.data('id');
//     navigator.clipboard.writeText(copyText);
//     const tooltip = $(el).prev();
//     tooltip.text("คัดลอกสำเร็จ")
//     tooltip.css('display', 'block')
//     outCopyText(tooltip)
// }

let timeOut = 0


function outCopyText(tooltip) {
    setInterval(() => {
        $(tooltip).css('display', 'none')
    }, 1500)
}


function pasteData(input, callback = null) {
    navigator.clipboard
        .readText()
        .then((clipText) => {
            input.val(clipText)
            if (callback) callback()
        })
        ;
}