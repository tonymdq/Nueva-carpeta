function extractData() {

  
  days = getDays();
  carHireCharge = getCarPrice();
  promotionDiscount = getPromotion();
  insurance = getInsurance();
  
  function getCarPrice(){
    const tdElements = document.querySelectorAll('td.main');
    let carHireChargeNumber;
    tdElements.forEach((td, index) => {
      const text = td.textContent.trim();
      // If the current <td> element contains the text "Car Hire Charge:"
      if (text.includes('Car Hire Charge:')) {
          // Check if the subsequent <td> element exists
          const nextTd = tdElements[index + 1];
          if (nextTd) {
              // Extract the number from the subsequent <td> element
              const match = nextTd.textContent.trim().match(/[\d.]+/);
              if (match) {
                  // Assign the extracted number to the carHireChargeNumber variable
                  carHireChargeNumber = parseFloat(match[0]);
              }
          }
      }
  });
  return carHireChargeNumber
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
    return days}
  
  
  function getPromotion() {
    const tdElements = document.querySelectorAll('td.main');
    let promotionDiscountNumber;
    tdElements.forEach((td, index) => {
      const text = td.textContent.trim();
      // If the current <td> element contains the text "Promotion Discount:"
      if (text.includes('Promotion Discount:')) {
          // Check if the subsequent <td> element exists
          const nextTd = tdElements[index + 2];
          if (nextTd) {
              // Extract the number from the subsequent <td> element
              const match = nextTd.textContent.trim().match(/[\d.]+/);
              if (match) {
                  // Assign the extracted number to the promotionDiscountNumber variable
                  promotionDiscountNumber = parseFloat(match[0]);
              }
          }
      }
  });
  return promotionDiscountNumber
  }

  function getInsurance() {
    const tableRows = document.querySelectorAll('tr');
    let targetNumber;
    tableRows.forEach(row => {
      // Check if the <tr> element contains the text "US$ 103.53"
      const textContent = row.textContent.trim();
      if (textContent.includes('US$ 103.53')) {
          // Extract the number from the text using regular expression
          const match = textContent.match(/[\d.]+/);
          if (match) {
              // Assign the extracted number to the targetNumber variable
              targetNumber = parseFloat(match[0]);
          }
      }
  });

  return targetNumber
  }

  

  return [days, promotionDiscount, carHireCharge, insurance];
}


 // Call extractData when button pressed

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {  
  if (request.action === "extractData") {
    const [days, promotionDiscount, carHireCharge, insurance] = extractData();
    console.log(days, promotionDiscount, carHireCharge, insurance);
    const carPriceFinal = carHireCharge - promotionDiscount;
    let cancellationFee = 3;
    if (days < 4) {
      cancellationFee = 1
    }; 
    sendResponse({ 
      result : carPriceFinal + insurance,
      totalCharge : Math.round(carPriceFinal / days * cancellationFee),
      totalRefund : Math.round(carPriceFinal / days * (days - cancellationFee) + insurance), 
    });
  }
});
