import IdleService from "../services/idle.service";

function bootstrap() {
  const idleService = new IdleService();

  idleService.init();

  console.log("running");
}
bootstrap();

let storage;

chrome.extension.onConnect.addListener(function(port) {
  console.log("Connected...");

  port.onMessage.addListener(function(msg) {
    console.log(storage);
    storage = msg;
  });
});

/* chrome.runtime.onInstalled.addListener(() => {}); */
