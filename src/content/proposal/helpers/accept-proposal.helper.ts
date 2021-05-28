import sendMessage from "~/tools/sendMessage";
import * as MessageTypesEnum from "~/enums/message-types.enum";

export default function acceptProposalHelper() {
  return sendMessage(MessageTypesEnum.PROPOSAL_ACCEPTED, {}, { fromTab: true });
}
