import sendMessage from "~/tools/sendMessage";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import { ItemField } from "~/services/autofill.service";

export default function openAndFillHelper(itemFields: ItemField[]) {
  return sendMessage(MessageTypesEnum.OPEN_AND_FILL_FORM, { itemFields });
}
