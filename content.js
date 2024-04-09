function extractData() {

  
  const days = getDays();
  const [carHireCharge, currencyCode] = getCarPrice();
  const promotionDiscount = getPromotion();
  const insurance = getInsurance();
  
  function getCarPrice(){
    const tdElements = document.querySelectorAll('td.main');
    let carHireChargeNumber;
    let currencyCode;
    tdElements.forEach((td, index) => {
      const text = td.textContent.trim();
      // If the current <td> element contains the text "Car Hire Charge:"
      if (text.includes('Car Hire Charge:')) {
          // Check if the subsequent <td> element exists
          const nextTd = tdElements[index + 1];
          if (nextTd) {
              // Extract the number from the subsequent <td> element
              const match = nextTd.textContent.trim().match(/[\d,]+\.\d+|[\d,]+/); 
              if (match) {
                  // Assign the extracted number to the carHireChargeNumber variable
                  carHireChargeNumber = parseFloat(match[0].replace(",", ""));
                  let stringWithCurrency = (match.input)
                  let regex = /\b[A-Z]{3}\b/g;
                  currencyCode = stringWithCurrency.match(regex) 
              }
          }
      }
  });
  console.log(carHireChargeNumber, currencyCode)
  return [carHireChargeNumber, currencyCode]
  }
  
  function getDays(){
    const durationRow = document.getElementById('DurationRow')
    const boldElements = durationRow.querySelectorAll('b');
    // Loop through each <b> element and check if it contains the word "day(s)"
    let days;
    boldElements.forEach(boldElement => {
        const text = boldElement.textContent.trim();
        if (text.includes('day(s)')) {
            // Extract the number from the text using regular expression
            days = parseInt(text.match(/[\d,]+\.\d+|[\d,]+/)[0]);
        }
    });
    console.log(days)
    return days
  }
  
  
  function getPromotion() {
    const tdElements = document.getElementById('PromotionDiscountAmountRow');
    if (tdElements){
      const selectAllTdMain = tdElements.querySelectorAll('td.main');
      var textContent = selectAllTdMain[2].textContent
      var numberRegex = /(\d{1,3}[,.]\d{1,3}(\.\d{1,2})?|\d+)/;
      var match = textContent.match(numberRegex);
      var promotionDiscountNumber = parseFloat(match[0].replace(",", ""));
    }
    else {
        promotionDiscountNumber = 0;
      }
    ;
  console.log(promotionDiscountNumber)
  return promotionDiscountNumber}
  

  function getInsurance() {   
    const locatePreviousid = document.getElementById("PrePaidExtrasHeaderRow")
    if (locatePreviousid) {
      // Get the next sibling element
      let nextSibling = locatePreviousid.nextElementSibling; //Here we will get to class="         "
      let insideTR = nextSibling.querySelectorAll('td.main')
      var textContent = insideTR[1].textContent
      var numberRegex = /(\d{1,3}[,.]\d{1,3}(\.\d{1,2})?|\d+)/;
      var match = textContent.match(numberRegex);
      var insuranceNumber = parseFloat(match[0].replace(",", ""));
    }
    else {
      var insuranceNumber = 0;
     }
  console.log(insuranceNumber)
  return insuranceNumber;
  }

  

  return [days, promotionDiscount, carHireCharge, insurance, currencyCode];
}

 // Call extractData when button pressed

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {  
  if (request.action === "extractData") {
    const [days, promotionDiscount, carHireCharge, insurance, currencyCode] = extractData();
    const carPriceFinal = carHireCharge - promotionDiscount;
    let cancellationFee = 3;
    if (days < 4) {
      cancellationFee = 1
    }; 
    sendResponse({ 
      result : Math.round((carPriceFinal + insurance) * 100) /100,
      totalCharge : Math.round((carPriceFinal / days * cancellationFee) *100) /100,
      totalRefund : Math.round((carPriceFinal / days * (days - cancellationFee) + insurance) * 100) /100,
      currencyCode: currencyCode,
    });
  }
});
