function createTransactionByBtn(transaction, table) {
    let transactionTableEl = ''
    transaction.forEach((t, i) => {
        const [y, m] = t.date.split('-')
        const month = getThaiMonth(m)
        const year = getFullYearThai(y)
        const date_thai = `${month} ${year}`
        const paid = t.paid
        transactionTableEl += `
      <tr class="p-0">
        <th class="text-center" scope="col">${i + 1}</th>
            <td class="align-middle pt-0 pb-0">
              <p class="m-0 font-weight-bold">${date_thai}</p>
              <p class="m-0 text-muted">${t.date}</p>
            </td>
            <td class="align-middle text-right pt-0 pb-0">
              <div class="input-group">
                <input type="text" id="${t.date}" disabled name="transaction-status" class="form-control-plaintext font-weight-bold" value="${t.status}">
                  <div class="input-group-append">
                    <button name="paste-status" class="d-none input-group-text btn bg-gradient-light" onclick="pasteData($('#${t.date}'))">
                      <i class="fa-solid fa-paste"></i>
                    </button>
                  </div> 
              </div> 
            </td>
            <td class="align-middle text-right pt-0 pb-0">
              <div class="input-group">
                <input type="number" id="trans-paid-${t.date}" disabled name="transaction-paid" class="text-right font-weight-bold form-control-plaintext m-0" value="${t.paid}" onchange="currentTransactionPaid()" oninput="currentTransactionPaid()">
                <div class="input-group-append">
                  <button name="paste-amount" class="d-none input-group-text btn bg-gradient-light" onclick="setDateInput('#trans-paid-${t.date}  %>')">
                    <i class="fa-solid fa-paste"></i>
                  </button>
                </div>
              </div>
            </td>
            <td class="align-middle text-center pt-0 pb-0" style="width:15% ;">
              <button disabled class="btn btn-sm btn-danger" data-date="${t.date}" name="transaction-delete" onclick="transactionMonthlyDelete(event)">
                ลบ
              </button>
            </td>
        </tr>
      `
    })
    table.html(transactionTableEl)
}
