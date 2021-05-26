import sendMessage from "~/tools/sendMessage";
import * as actionTypes from "./action-types";
import * as mutationTypes from "./mutation-types";
import * as MessageTypesEnum from "~/enums/message-types.enum";

export default {
  [actionTypes.SET_CURRENT_ACCOUNT]({ commit }, payload) {
    commit(mutationTypes.SET_CURRENT_ACCOUNT, { account: payload.account });
  },
  [actionTypes.SIGN_IN](_, payload) {
    return sendMessage(MessageTypesEnum.CREATE_SESSION_REQUEST, {
      password: payload.password,
    });
  },
};
