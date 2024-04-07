// popup.js
document.addEventListener("DOMContentLoaded", function () {
    
    const totalRefundElement = document.getElementById('totalRefund');
    const cancellationFeeElement = document.getElementById('cancellationFee');
    const totalPaidElement = document.getElementById('totalPaid');
    const extractButton = document.getElementById("extractButton");

    if (!extractButton) {
      console.error("Error: Expected DOM elements not found.");
      return;
    }
    
    if (extractButton) {
        extractButton.addEventListener("click", async function () {
  
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          const tab = tabs[0];
  
          if (!tab) {
            // If the content script is not injected into the current tab
            // the error will be logged in the result field.
            console.error("Content script is not injected into the current tab.");
            resultField.value = "Error: Content script not injected.";
            return;
          }
  
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "extractData" },
            function (response) {
              console.log("Received response from content", response);
              const result = response.result;
              const totalCharge = response.totalCharge;
              const totalRefund = response.totalRefund;
              totalRefundElement.value = totalRefund;
              cancellationFeeElement.value = totalCharge;
              totalPaidElement.value = result;
            }
          );
        });
      });
    } else {
      console.error("Element with ID 'calculate' not found.");
    }
  });
