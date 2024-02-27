const { display } = require("../src/js/display")
const { condb, db } = require("./DB")
const { getCompanyField, getSocialField, getLogoFieldName, getSystemConfigField } = require("./getFieldName")


async function getDataWeb(res) {
  const company_field = getCompanyField()
  const social_field = getSocialField()
  const logo_field = getLogoFieldName()
  const font_field = getSystemConfigField()
  const contactData = await db(`SELECT name,data FROM contact`)
  const about = contactData.filter((d) => d.name == company_field)
  const social = contactData
    .filter((d) => d.name == social_field)
    .map((d) => JSON.parse(d.data))
  const logo = contactData
    .filter((d) => d.name == logo_field)
    .map((d) => JSON.parse(d.data))
  const fontData = contactData.filter((d) => d.name == font_field)
    .map((d) => JSON.parse(d.data))

  let is_family = false
  let is_fontsize = false
  let add_font = ``
  let font_family = ``
  if (fontData.length > 0) {
    const font_id1 = fontData[0].web_font_1
    const font_id2 = fontData[0].web_font_2
    const web_fonttype = fontData[0].web_fonttype
    const web_custom_font = fontData[0].web_custom_font
    const web_font_size = fontData[0].web_font_size
    let family = ``
    const f = await db(`SELECT * FROM fonts WHERE id IN ('${font_id1}','${font_id2}')`)
    const font_name1 = f.filter((d) => d.id == font_id1)[0].font_name
    const font_name2 = f.filter((d) => d.id == font_id2)[0].font_name

    if (f.length > 0) {
      if (web_font_size != '') {
        is_fontsize = true
        font_family += `font-size:${fontData[0].web_font_size}px;`
      }
      if (web_fonttype == 'custom' && web_custom_font != '') {
        is_family = true
        family += `font-family: ${web_custom_font};`
      } else if (web_fonttype == 'option') {
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
  if (is_font)  font_family = `*{${font_family}}`
  const fonts = {
    is_font,
    'font_config': `<style>${add_font} ${font_family}</style> `
  }
  const meta = await db("SELECT * FROM meta")

  const entries = {
    'social': social.length == 0 ? [] : social[0],
    'about': about,
    'meta': meta,
    'logo': logo,
    'font': fonts
  }
  return entries
}

module.exports.getDataWeb = getDataWeb