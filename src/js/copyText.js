function copyText(evt) {
    const target = $(event.target)
    const tagName = $(target).prop('tagName')
    const el = tagName == 'I' ? target.parent() : target
    const copyText = el.data('id');
    navigator.clipboard.writeText(copyText);
    const tooltip = $(el).prev();
    tooltip.text("คัดลอกสำเร็จ")
    tooltip.css('display', 'block')
    outCopyText(tooltip)
}

function outCopyText(tooltip) {
    setInterval(() => {
        $(tooltip).css('display', 'none')
    }, 1500)
}