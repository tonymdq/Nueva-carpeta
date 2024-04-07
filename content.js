console.log("Content start");
function extractData() {
  console.log("comienzo funcion extractdata")
/*   const carHireChargeElement = document.querySelector('td.main');
  const durationRow = document.getElementById("DurationRow");
  const promotionDiscountElement = document.getElementById("PromotionDiscountAmountRow");
  const totalPriceElement = document.querySelector("tr.sub-total"); */

  let durationValue = 10; // Declare durationValue outside if statement to make it accessible later
  let carHireChargeValue = 250;
  let promotionDiscountValue = 10;
  let totalPriceValue = 300;

  /*     if (durationRow) {
            // Find the <b> element inside the durationRow
            const durationElement = durationRow.querySelector('b');
            if (durationElement && durationElement?.textContent.includes("day(s)")) {
                // Extract the duration value
                const durationText = durationElement.textContent;
                durationValue = parseInt(durationText); // Assign value to durationValue
            }
        }
    
        if (carHireChargeElement && carHireChargeElement?.textContent.includes("Car Hire Charge:")) {
            // Extract the text content from the element
            const carHireChargeText = carHireChargeElement.nextSibling.textContent.trim();
    
            // Use regular expression to extract the number from the text
            carHireChargeValue = parseFloat(carHireChargeText.match(/[\d\.]+/)); // Assign value to carHireChargeValue
        }
    
        if (promotionDiscountElement) {
            // Find the <td> element inside the promotionDiscountElement
            const tdElements = promotionDiscountElement.querySelectorAll('td');
    
            // Ensure that we have at least one <td> element
            if (tdElements.length > 0) {
                // Extract the text content from the last <td> element
                const promotionDiscountText = tdElements[tdElements.length - 1].textContent;
    
                // Use regular expression to extract the number from the text
                promotionDiscountValue = parseFloat(promotionDiscountText.match(/[\d\.]+/)); // Assign value to promotionDiscountValue
            }
        }
    
        if (totalPriceElement) {
            // Find the <td> element inside the totalPriceElement
            const tdElement = totalPriceElement.querySelector('td.main');
    
            // Check if the <td> element exists
            if (tdElement) {
                // Extract the text content from the <td> element
                const totalPriceText = tdElement.textContent;
    
                // Use regular expression to extract the number from the text
                totalPriceValue = parseFloat(totalPriceText.match(/[\d\.]+/)); // Assign value to totalPriceValue
            }
        } */
  console.log(carHireChargeValue, durationValue, promotionDiscountValue, totalPriceValue) // FOR TEST PURPOSE, CAN DELETE
  // Send the extracted data to the background script
  const data = {
    id: "dummy message",
  };

  chrome.runtime.sendMessage(data, function (response) {
       console.log("Content script received response:", response);
       chrome.runtime.sendMessage(response);
    }
  );
}


 // Call extractData when button pressed
const extractButton = document.getElementById("extractButton");
console.log("button declared");
  
extractButton.addEventListener("click", extractData);
console.log("por lo menos sabes que aca llega")

console.log("Content end")
