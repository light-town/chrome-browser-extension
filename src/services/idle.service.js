export const QueryState = {
  LOCKED: "locked",
  IDLE: "idle",
  ACTIVE: "active",
};

// export const IDLE_INTERVAL = 60; // 60 seconds
export const IDLE_INTERVAL = 20; // 20 seconds

export default class IdleService {
  constructor() {
    this.idle = chrome.idle;
    this.timer = null;
    this.state = QueryState.ACTIVE;
  }

  init() {
    if (!this.idle) return;

    this.idle.setDetectionInterval(IDLE_INTERVAL);
    this.idle.onStateChanged.addListener(this.onStateChanged);
  }

  onStateChanged(newState) {
    console.log(newState);
  }
}
