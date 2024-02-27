function obscureText(el) {
  const is_obscure = $(el).attr('data-obscure') == 'true'
  const type = is_obscure ? 'password' : 'obscureText'
  $(el).attr('data-obscure', !is_obscure)
  $(el).attr('type', type)
}


function validateformEmpty(empty, validate, msg) {
  if (empty == true) {
    validate.text(msg);
    validate.css("display", "block");
  } else {
    validate.text("");
    validate.css("display", "none");
  }
}
function clearValidateErr() {
  $('.empty-validate').css('display', 'none')
}
function formResetValue(form) {
  $(form)[0].reset()
}

function validateUsername(username) {
  let thaiLang = 0
  let textErr = ''
  let result = true
  let num = 0

  if (username.length < 4) {
    result = false
    textErr = 'ชื่อผู้ใช้งานอย่างน้อย 4 ตัว'
  } else {
    for (let i = 0; i < username.length; i++) {
      const text = username[i]
      const thai_letter = /[ก-ฮะ-์]/.test(text)

      if (i == 0) {
        const n = /\d/.test(text)
        if (n) {
          textErr = 'อักษรตัวแรกต้องไม่ขึ้นด้วยตัวเลข'
          result = false
          break
        }
      }
      if (thai_letter) {
        thaiLang++
      }
    }
    if (thaiLang > 0) {
      result = false
      textErr = 'รหัสผ่านต้องใช้เป็นภาษาอังกฤษเท่านั้น'
    }
  }
  return { result, textErr }
}


function validatePassword(pass) {
  let upper = 0
  let lower = 0
  let num = 0
  let thaiLang = 0
  let textErr = ''
  let result = true

  if (pass.length < 8) {
    result = false
    textErr = 'รหัสผ่านต้องมีอักขระอย่างน้อย 8 ตัว'
  } else {
    for (let i = 0; i < pass.length; i++) {
      const text = pass[i]
      const char = /[a-zA-Z]/.test(text)
      const n = /\d/.test(text)
      const thai_letter = /[ก-ฮะ-์]/.test(text)
      if (char) {
        if (text.toUpperCase() == text) {
          upper++
        }
        if (text.toUpperCase() != text) {
          lower++
        }
      }
      if (n) {
        num++
      }
      if (thai_letter) {
        thaiLang++
      }
    }
    if (thaiLang > 0) {
      result = false
      textErr = 'รหัสผ่านต้องใช้เป็นภาษาอังกฤษเท่านั้น'
    } else {
      if (upper < 1 || lower < 1 || num < 1) {
        result = false
        textErr = 'รหัสผ่านต้องประกอบ อักขระตัวพิมพ์เล็ก พิมพ์ใหญ่'
      }
    }
  }
  return { result, textErr }
}