function extractData() {

  
  const days = getDays();
  const [carHireCharge, currencyCode] = getCarPrice();
  const promotionDiscount = getPromotion();
  const insurance = getInsurance();
  
  
  function standarizeNumber(strg) {
      var strg = strg || "";
      var decimal = '.';
      strg = strg.replace(/[^0-9$.,]/g, '');
      if(strg.indexOf(',') > strg.indexOf('.')) decimal = ',';
      if((strg.match(new RegExp("\\" + decimal,"g")) || []).length > 1) decimal="";
      if (decimal !== "" && (strg.length - strg.indexOf(decimal) - 1 == 3) && strg.indexOf("0" + decimal)!==0) decimal = "";
      strg = strg.replace(new RegExp("[^0-9$" + decimal + "]","g"), "");
      strg = strg.replace(',', '.');
      return parseFloat(strg);
  }   

  
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
              // Extract the number from the subsequent <td> element //
              const match = nextTd.textContent.trim().match(/(\d{1,10}(?:[,.]?\d{3})*(?:[.,]\d{2})?)/);             
              if (match) {
                match[0] = standarizeNumber(match[0])
              };
              // Assign the extracted number to the carHireChargeNumber variable
              carHireChargeNumber = match[0];  
              let stringWithCurrency = (match.input);
              let regex = /\b[A-Z]{3}\b/g;
              currencyCode = stringWithCurrency.match(regex);
          }
      }
    })
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
            days = parseInt(text.match(/\d+/)[0]);
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
      var numberRegex = /(\d{1,10}(?:[,.]?\d{3})*(?:[.,]\d{2})?)/;
      var match = textContent.match(numberRegex);
      if (/\d{1,10},\d{2}\b/.test(match[0])) { // Replace "," for "." if found before 2 last digits
        match[0] = match[0].replace(/(\d{1,10}),(\d{2})\b/, "$1.$2");
      }
      var promotionDiscountNumber = parseFloat(match[0].replace(",", ""));
    }
    else {
        var promotionDiscountNumber = 0;
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
      var numberRegex = /(\d{1,10}(?:[,.]?\d{3})*(?:[.,]\d{2})?)/;
      var match = textContent.match(numberRegex);
      if (match) {
        if (/\d{1,10},\d{2}\b/.test(match[0])) { // Replace "," for "." if found before 2 last digits
          match[0] = match[0].replace(/(\d{1,10}),(\d{2})\b/, "$1.$2");
        }
      }
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
