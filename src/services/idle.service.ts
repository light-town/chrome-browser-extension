import { injectable } from "inversify";

export const IDLE_INTERVAL = 60; // seconds

@injectable()
export default class IdleService {
  state: chrome.idle.IdleState;
  listeners: Set<(newState: chrome.idle.IdleState) => void>;
  onStateChanged: {
    addListener: (l: (newState: chrome.idle.IdleState) => void) => void;
  };

  constructor() {
    this.state = "active";
    this.listeners = new Set();
    this.onStateChanged = {
      addListener: (l) => {
        this.listeners.add(l);
      },
    };
  }

  start() {
    chrome.idle.setDetectionInterval(IDLE_INTERVAL);
    chrome.idle.onStateChanged.addListener((newState) => {
      this.listeners.forEach((l) => l(newState));
    });
  }
}
