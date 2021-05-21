import "core-js/stable";
import "regenerator-runtime/runtime";

import * as MessageTypesEnum from "../enums/message-types.enum";

import Vue from "vue";
import ProposalNotification from "./components/proposal-notification/index.vue";

chrome.runtime.onMessage.addListener(({ type }) => {
  console.log("[Content Script] Message Type: ", type);

  switch (type) {
    case MessageTypesEnum.MAKE_PROPOSAL: {
      const layoutId = "lt-ext-notifs";

      const layout = document.createElement("div");
      layout.setAttribute("id", layoutId);

      document.querySelector("#app").appendChild(layout);

      new Vue({
        el: `#${layoutId}`,
        render: (h) => h(ProposalNotification),
      });
      break;
    }
  }
});

chrome.runtime.sendMessage(chrome.runtime.id, {
  type: MessageTypesEnum.CHECK_PROPOSAL_NEED,
});
