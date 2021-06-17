import "reflect-metadata";
import "core-js/stable";
import "regenerator-runtime/runtime";

import LoggerService from "~/services/logger.service";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import container from "~/services/container";
import AutoFiller from "./autofiller";
import DOM from "./autofiller/dom";

async function bootstrap() {
  container.bind<LoggerService>(LoggerService).toSelf();
  container.bind<AutoFiller>(AutoFiller).toSelf();
  container.bind<DOM>(DOM).toSelf();

  const logger = container.get<LoggerService>(LoggerService);
  const autofiller = container.get<AutoFiller>(AutoFiller);

  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(async (msg) => {
      const { type, data } = msg;

      logger.log("Content Script", "Message received:", type, data);

      switch (type) {
        case MessageTypesEnum.COLLECT_PAGE_DETAILS_REQUEST: {
          const pageDetails = autofiller.collect(document);

          port.postMessage({
            type: MessageTypesEnum.COLLECT_PAGE_DETAILS_RESPONSE,
            data: {
              details: pageDetails,
            },
          });
          break;
        }
        case MessageTypesEnum.FILL_FORM: {
          autofiller.fill(document, data.fillScript);

          port.postMessage({});
          break;
        }
      }
    });
  });
}

bootstrap();
