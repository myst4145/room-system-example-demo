function currencyThaiFormat(num) {
    num = num.toString()
    let bahtText = '';
    let number = ''
    let fraction = ''
    const hasIndex = num.indexOf('.')
    if (hasIndex < 0) {
        number = num
    } else {
        number = num.substring(0, hasIndex)
        fraction = num.substring(hasIndex + 1)
    }

    const n = number != 0 ? readTextToDigit(number) : "ศูนย์"
    const decimal = fraction.length > 1 ? 'จุด' + readDecimal(fraction) : ''
    let thiaFormat = number.length > 16 ? 'The highest value is reached.' : n + decimal
    return thiaFormat += thiaFormat.includes('จุด') ? 'บาท' : 'บาทถ้วน'
}

function readTextToDigit(num) {
    let digitText = ''
    let oneMillion = 1000000
    let oneMillionMillion = 1000000000000

    const txt1 = Math.floor(num / oneMillionMillion).toString()
    const f1 = Math.floor(num % oneMillionMillion)
    const txt2 = Math.floor(f1 / oneMillion).toString()
    const f2 = Math.floor(num % oneMillion)
    const txt3 = txt2 != 0 || txt1 != 0 ? `0${f2}` : f2
    const txtNum1 = covertToDigitText(txt1)
    const txtNum2 = covertToDigitText(txt2)
    const txtNum3 = covertToDigitText(txt3)

    digitText += txtNum1
    digitText += txt1 > 0 ? 'ล้าน' : ''
    digitText += txtNum2
    digitText += txt2 == 0 && txt1 != 0 ? 'ล้าน' : ''
    digitText += txt2 != 0 ? 'ล้าน' : ''

    digitText += txtNum3
    console.log('num3: ', txt1, txt2, txt3)
    return digitText
}

function covertToDigitText(num) {
    const txtNumArr = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า", "สิบ"]
    const txtDigitArr = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน"]
    const countNumber = num.toString().length
    let numText = ''

    for (let i in num.toString()) {
        let digitIndex = ((countNumber - i) % 7)
        const idx = digitIndex < 0 ? 6 : digitIndex - 1
        const n = parseInt(num.toString()[i])
        let text = ''
        if (n != 0) {
            text = `${txtNumArr[n]}${txtDigitArr[idx]} `
            if (n == 1) {
                if (countNumber > 1 && digitIndex == 1) text = 'เอ็ด'
                if (digitIndex == 2) text = 'สิบ'
            }
            if (n == 2 && digitIndex == 2) {
                text = 'ยี่สิบ'
            }
        }
        numText += text
    }
    return numText.replaceAll(' ', '')
}

function readDecimal(decimal) {
    const decimalTxtList = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"]
    let decimalTxt = ''
    for (let i in decimal) {
        const text = decimalTxtList[parseInt(decimal[i])]
        decimalTxt += text
    }
    return decimalTxt
}
module.exports.currencyThaiFormat = currencyThaiFormat