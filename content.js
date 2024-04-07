console.log("Content start");
function extractData() {
  console.log("comienzo funcion extractdata")

  function extractNumbersFromString(str) {
    return str.match(/\d+/g).map(Number);
  }

  // Get elements containing numbers
  const carHireChargeElement = document.querySelector('td.main');
  const promotionDiscountElement = document.querySelector('#PromotionDiscountAmountRow td');
  const durationElement = document.querySelector('#DurationRow td');
  const insuranceElement = document.querySelector('#InsuranceRow td');

  // Extract numbers from the elements
  const carHireCharge = extractNumbersFromString(carHireChargeElement.textContent)[0];
  const promotionDiscount = extractNumbersFromString(promotionDiscountElement.textContent)[0];
  const days = extractNumbersFromString(durationElement.textContent)[0];
  const insurance = extractNumbersFromString(insuranceElement.textContent)[0];

  console.log(days, promotionDiscount, carHireCharge, insurance);// FOR TEST PURPOSE, CAN DELETE
  return [days, promotionDiscount, carHireCharge, insurance];
}


 // Call extractData when button pressed

 chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Content Script Received Message:", request);

  if (request.action === "extractData") {
    const [days, promotionDiscount, carHireCharge, insurance] = extractData();
    const carPriceFinal = carHireCharge - promotionDiscount
    let cancellationFee = 3
    if (days < 4) {
      cancellationFee = 1
    } 
    sendResponse({ 
      result : Math.round(carPriceFinal + insurance),
      totalCharge : Math.round(carPriceFinal / days * cancellationFee),
      totalRefund : Math.round(carPriceFinal / days * (days - cancellationFee)), 
    });
  }
});
console.log("Content end")
