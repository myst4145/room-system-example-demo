const { db } = require("../DB")
const { getSystemConfigField } = require("../getFieldName")

async function getSystemFont() {
    const font_field = getSystemConfigField()
    const contactData = await db(`SELECT name,data FROM contact WHERE name='${font_field}'`)
    const fontData = contactData
        .map((d) => JSON.parse(d.data))
    let is_family = false
    let is_fontsize = false
    let add_font = ``
    let font_family = ``
    if (fontData.length > 0) {
        const font_id1 = fontData[0].system_font_1
        const font_id2 = fontData[0].system_font_2
        const fonttype = fontData[0].system_fonttype
        const custom_font = fontData[0].system_custom_font
        const font_size = fontData[0].system_font_size
        let family = ``
        const f = await db(`SELECT * FROM fonts WHERE id IN ('${font_id1}','${font_id2}')`)
        const font_name1 = f.filter((d) => d.id == font_id1)[0].font_name
        const font_name2 = f.filter((d) => d.id == font_id2)[0].font_name

        if (f.length > 0) {
            if (font_size != '') {
                is_fontsize = true
                font_family += `font-size:${font_size}px;`
            }
            if (fonttype == 'custom' && custom_font != '') {
                is_family = true
                family += `font-family: ${custom_font};`
            } else if (fonttype == 'option') {
                is_family = true
                family += `font-family: ${font_name1},${font_name2};`
            }

            if (is_family) font_family += family


            f.forEach((s) => {
                add_font += `@font-face {`
                add_font += `font - family: ${s.font_name};`
                add_font += `src: url("${s.storage}");`
                add_font += `}`

            })
        }
    }
    const is_font = is_family || is_fontsize
    if (is_font) font_family = `*{${font_family}}`
    const fonts = {
        is_font,
        'font_config': `<style>${add_font} ${font_family}</style> `
    }
    return fonts
}
module.exports = { getSystemFont }