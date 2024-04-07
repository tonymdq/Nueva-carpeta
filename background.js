//Receive values from content
console.log("Background start")
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.carHireChargeValue && message.durationValue && message.promotionDiscountValue && message.totalPriceValue) {
      // Convert string values to numbers
      const carHireChargeValue = parseFloat(message.carHireChargeValue);
      const durationValue = parseFloat(message.durationValue);
      const promotionDiscountValue = parseFloat(message.promotionDiscountValue);
      const totalPriceValue = parseFloat(message.totalPriceValue);

      // Adjust calculation based on the value of days
      let result;
      if (days <= 3) {
          result = ((carHireChargeValue - promotionDiscountValue) / durationValue) * 2 + totalPriceValue;
      } else {
          result = ((carHireChargeValue - promotionDiscountValue) / durationValue) * (durationValue - 3) + totalPriceValue;
      }

      // Additional values to be sent to the popup script
      const totalCharge = carHireChargeValue - promotionDiscountValue + totalPriceValue
      const totalRefund = totalCharge - result; 

      // Send the result and additional values to the popup script
      chrome.runtime.sendMessage({
          result: result,
          totalCharge: totalCharge,
          totalRefund: totalRefund            
      });
  }
});
await chrome.runtime.sendMessage({
  result: 15,
  totalCharge: 13,
  totalRefund: 14            
});
console.log("Background end")