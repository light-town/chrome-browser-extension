import sendMessage from "~/tools/sendMessage";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import { ItemField } from "~/services/autofill.service";
import postMessage from "~/tools/postMessage";

export default function fillHelper(itemFields: ItemField[]) {
  return postMessage(MessageTypesEnum.FILL_FORM, { itemFields });
}
