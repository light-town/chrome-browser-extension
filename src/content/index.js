/* document.addEventListener("DOMContentLoaded", (event) => { */
/* chrome.runtime.onMessage.addListener((msg) => {
    console.log(msg);
  }); */

chrome.extension.onConnect.addListener(function(port) {
  console.log("Connected...");

  port.onMessage.addListener(function(msg) {
    console.log(msg);
  });
});
/* }); */
