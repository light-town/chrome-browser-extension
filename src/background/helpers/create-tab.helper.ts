export default function createTab(options: { url?: string; active?: boolean }) {
  return new Promise((resolve) => {
    chrome.tabs.create(options, (tab) => {
      resolve(tab);
    });
  });
}
