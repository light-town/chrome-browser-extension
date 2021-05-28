import uuid from "uuid";

export enum ReceiversEnum {
  POPUP = "popup",
  BACKGROUND = "background",
  CONTENT = "content",
}

export default function postMessage(
  type: string,
  data: Record<string, any> = {},
  options: { tab?: any } = {}
): Promise<any> {
  return new Promise((resolve, reject) => {
    let port: chrome.runtime.Port;

    if (options.tab) {
      port = chrome.tabs.connect(options.tab?.id, {
        name: `channel:${uuid.v4()}`,
      });
    } else {
      port = chrome.runtime.connect({
        name: `channel:${uuid.v4()}`,
      });
    }

    if (chrome.runtime.lastError) reject(chrome.runtime.lastError.message);

    port.onMessage.addListener((msg) => {
      port.disconnect();

      if (chrome.runtime.lastError) reject(chrome.runtime.lastError.message);

      resolve(msg);
    });
    port.postMessage({ type, data });

    if (chrome.runtime.lastError) reject(chrome.runtime.lastError.message);
  });
}
