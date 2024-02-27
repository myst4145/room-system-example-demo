function validatePaidiOverTotal() {
    const total = parseFloat($('#total').val())
    const paid = parseFloat($('#paid').val())
  
    if (isNaN(total)) {
      $('#paid').val('')
      queryFail('ยอดรวม', 'กรุณาเลือกวิธีการชำระเงิน จำนวนคนเข้าพัก และ การคิดจำนวนคนเกิน เพื่อคำนวณยอดชำระ', '')
    }
  
    if (!isNaN(paid) && !isNaN(total)) {
      if (paid > total) {
        $('#paid').val('')
        queryFail('บอดรวม', 'กรุณาป้อนยอดชำระที่ถูกต้อง', '')
      }
    }
  }
  
  
  