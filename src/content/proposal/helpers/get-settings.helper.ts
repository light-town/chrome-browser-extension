import * as MessageTypesEnum from "~/enums/message-types.enum";
import postMessage from "~/tools/postMessage";

export default async function getSettingsHelper() {
  const response = await postMessage(MessageTypesEnum.GET_SETTINGS_REQUEST);

  if (response?.type === MessageTypesEnum.ERROR) return;

  return response?.settings;
}
