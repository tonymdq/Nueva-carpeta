// popup.js

// Function to update the popup UI with the received values
console.log("Popup start")
function updatePopupUI(result, totalCharge, totalRefund) {
    // Find the elements for the three fields in the popup HTML
    const totalRefundElement = document.getElementById('totalRefund');
    const cancellationFeeElement = document.getElementById('cancellationFee');
    const totalPaidElement = document.getElementById('totalPaid');

    // Update the value of each field with the received values
    totalRefundElement.value = result;
    cancellationFeeElement.value = totalCharge;
    totalPaidElement.value = totalRefund;
}

// Listen for messages from the background script

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log('received message Popup.js', message);
    if (message.result && message.totalCharge && message.totalRefund) {
        // Call the updatePopupUI function with the received values
        updatePopupUI(message.result, message.totalCharge, message.totalRefund);
    }
});
console.log("Popup.js end")