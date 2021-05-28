import sendMessage from "~/tools/sendMessage";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import postMessage from "~/tools/postMessage";

export default function acceptProposalHelper() {
  return postMessage(MessageTypesEnum.PROPOSAL_ACCEPTED);
}
