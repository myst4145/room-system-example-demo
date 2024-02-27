$('[name="payat"]').change(function () {
    currentTotalCheckout()
})

function currentTotalCheckout() {
    const rentalInsuranceCost = parseFloat($('#rentalInsuranceCost').val())
    const rentalDeposit = parseFloat($('#rentalDeposit').val())
    const rentalDamages = parseFloat($('#rentalDamages').val())
    const rentalOverdue = parseFloat($('#rentalOverdue').val())

    let insurance_cost = 0
    let overdue = rentalOverdue
    let damages = !isNaN(rentalDamages) ? rentalDamages : 0
    const payat = $.map($('[name="payat"]').filter(':checked'), (v) => $(v).val())
    let paymore = damages + overdue
    let refund_pay = 0
    let deposit_refund = rentalDeposit

    const expense = damages + overdue
    if (payat.includes('insurance-cost')) {
        if (rentalInsuranceCost >= 0) {
            if (paymore > rentalInsuranceCost) {
                paymore -= rentalInsuranceCost
                insurance_cost = 0
            } else if (paymore <= rentalInsuranceCost) {
                insurance_cost = rentalInsuranceCost - paymore
                paymore = 0
            }

        }
        refund_pay += insurance_cost
    } else {
        refund_pay += rentalInsuranceCost
        insurance_cost = rentalInsuranceCost
    }
    if (payat.includes('deposit')) {
        if (paymore > rentalDeposit) {
            paymore -= rentalDeposit
            deposit_refund = 0
        } else if (paymore <= rentalDeposit) {
            deposit_refund = rentalDeposit - paymore
            paymore = 0

        }
        refund_pay += deposit_refund
    } else {
        deposit_refund = rentalDeposit
        refund_pay += rentalDeposit
    }
    console.log(insurance_cost, deposit_refund)


    const refund_pay_thai_format = currencyThaiFormat(refund_pay)
    const paymore_thai_format = currencyThaiFormat(paymore)
 
  
    $('#rentalDepositRefund').val(deposit_refund)
    $('#rentalInsuranceCostRefund').val(insurance_cost)
    $('#rentalRefundPay').val(getNumberFormat(refund_pay))
    $('#rentalPayMore').val(getNumberFormat(paymore))
    $('#rentalExpense').val(expense)
    $('#rentalPayMoreThaiFormat').val(paymore_thai_format)
    $('#rentalRefundPayThaiFormat').val(refund_pay_thai_format)
}