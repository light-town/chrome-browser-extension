import sendMessage from "~/tools/sendMessage";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import { ItemField } from "~/services/autofill.service";

export default function fillHelper(itemFields: ItemField[]) {
  return sendMessage(MessageTypesEnum.FILL_FORM, { itemFields });
}
