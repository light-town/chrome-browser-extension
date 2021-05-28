import sendMessage from "~/tools/sendMessage";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import { ItemField } from "~/services/autofill.service";
import postMessage from "~/tools/postMessage";

export default function openAndFillHelper(itemFields: ItemField[]) {
  return postMessage(MessageTypesEnum.OPEN_AND_FILL_FORM, { itemFields });
}
