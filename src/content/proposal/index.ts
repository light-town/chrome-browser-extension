import "reflect-metadata";
import "core-js/stable";
import "regenerator-runtime/runtime";
import Vue from "vue";
import PortalVue from "portal-vue";
import i18n from "~/locales/i18n";
import ProposalNotification from "./components/proposal-notification/index.vue";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import LoggerService from "~/services/logger.service";
import container from "~/services/container";
import postMessage from "~/tools/postMessage";
import getSettingsHelper from "./helpers/get-settings.helper";
import { SettingUuidEnum } from "~/services/settings.service";

Vue.use(PortalVue);

let wasRequest = false;

async function bootstrap() {
  container.bind<LoggerService>(LoggerService).toSelf();

  const logger = container.get<LoggerService>(LoggerService);

  const settings = await getSettingsHelper();
  i18n.locale = settings[SettingUuidEnum.LANGUAGE].value.format;

  const response = await postMessage(MessageTypesEnum.CHECK_PROPOSAL_NEED);

  logger.log("Content Script", "Message Type:", response.type, response.data);

  if (response.type !== MessageTypesEnum.MAKE_PROPOSAL) return;

  window.addEventListener("message", function(event) {
    if (event.source !== window) return;

    if (event.data.type === "LT_EXT_AUTH") {
      if (wasRequest) return;

      wasRequest = true;

      const layoutId = "lt-ext-notifs";

      const layout = document.createElement("div");
      layout.setAttribute("id", layoutId);

      document.querySelector("#__layout")?.appendChild(layout);

      new Vue({
        el: `#${layoutId}`,
        i18n,
        render: (h) => h(ProposalNotification),
      });
    }
  });
}

bootstrap();
