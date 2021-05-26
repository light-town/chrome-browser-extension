import "reflect-metadata";
import "core-js/stable";
import "regenerator-runtime/runtime";
import Vue from "vue";
import ProposalNotification from "./components/proposal-notification/index.vue";
import sendMessage from "~/tools/sendMessage";
import * as MessageTypesEnum from "../enums/message-types.enum";
import LoggerService from "~/services/logger.service";

async function bootstrap() {
  const logger = new LoggerService();

  const response = await sendMessage(
    MessageTypesEnum.CHECK_PROPOSAL_NEED,
    {},
    {
      fromTab: true,
    }
  );

  logger.log("Content Script", "Message Type:", response.type, response.data);

  if (response.type !== MessageTypesEnum.MAKE_PROPOSAL) return;

  const layoutId = "lt-ext-notifs";

  const layout = document.createElement("div");
  layout.setAttribute("id", layoutId);

  document.querySelector("#app")?.appendChild(layout);

  new Vue({
    el: `#${layoutId}`,
    render: (h) => h(ProposalNotification),
  });
}

bootstrap();
