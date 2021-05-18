import "core-js/stable";
import "regenerator-runtime/runtime";

import IdleService from "../services/idle.service";

function bootstrap() {
  const idleService = new IdleService();

  idleService.init();
}
bootstrap();

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.onActivated.addListener((info) => {
    chrome.tabs.get(info.tabId, (tab) => {
      if (tab.url !== "http://127.0.0.1:3000/sign-in/pwd") return;

      chrome.tabs.executeScript(
        tab.id,
        {
          code: `localStorage.getItem('lastAccountUuid')`,
        },
        (d) => {
          console.log(d);
        }
      );
    });
  });
});
