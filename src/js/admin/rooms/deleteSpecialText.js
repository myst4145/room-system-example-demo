function deleteSpecialText(event) {
    const target = $(event.target);
    const tag =
        target.prop("tagName") == "I" ?
            target.parent().parent().remove() :
            target.parent().remove();
    const specialText = $('[name="special-options-text"]');
    const opt = $('[name="special-options"]');
    const optCheck = opt.filter(":checked").filter((index, el) => {
        if ($(el).val() != "have-special-options") {
            return el;
        }
    });

    if (specialText.length == 0) {
        if (optCheck.length == 0) {
            $.each(opt, (index, el) => {
                if ($(el).val() == "non-special-options") {
                    $(el).prop("checked", true);
                }
                if ($(el).val() != "non-special-options") {
                    $(el).prop("checked", false);
                }
            });
        }
    }
}