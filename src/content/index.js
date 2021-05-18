/* import "core-js/stable";
import "regenerator-runtime/runtime";

document.addEventListener("DOMContentLoaded", async () => {
  debugger;

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];

  const fromPageLocalStore = await chrome.tabs.executeScript(tab.id, {
    code: `localStorage[lastAccountUuid]`,
  });
});
 */

/* import "core-js/stable";
import "regenerator-runtime/runtime";

document.addEventListener("DOMContentLoaded", async (event) => {
  debugger;

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];

  const fromPageLocalStore = await chrome.tabs.executeScript(tab.id, {
    code: `localStorage[lastAccountUuid]`,
  });
}); */
