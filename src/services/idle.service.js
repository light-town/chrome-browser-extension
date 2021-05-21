export const QueryState = {
  LOCKED: "locked",
  IDLE: "idle",
  ACTIVE: "active",
};

export const IDLE_INTERVAL = 20; // 20 seconds

export default class IdleService {
  constructor() {
    this.idle = chrome.idle;
    this.state = QueryState.ACTIVE;
    this.listeners = new Set();
    this.onStateChanged = {
      addListener: (l) => {
        this.listeners.add(l);
      },
    };
  }

  init() {
    if (!this.idle) return;

    this.idle.setDetectionInterval(IDLE_INTERVAL);
    this.idle.onStateChanged.addListener((newState) => {
      this.listeners.forEach((l) => l(newState));
    });
  }
}
