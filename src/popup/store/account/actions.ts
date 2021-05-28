import * as actionTypes from "./action-types";
import * as mutationTypes from "./mutation-types";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import sendMessage from "~/tools/sendMessage";
import postMessage from "~/tools/postMessage";

export default {
  async [actionTypes.SIGN_IN](_, payload) {
    const response = await postMessage(
      MessageTypesEnum.CREATE_SESSION_REQUEST,
      {
        password: payload.password,
      }
    );

    if (response?.type !== MessageTypesEnum.CREATE_SESSION_RESPONSE)
      return response;
  },
  async [actionTypes.GET_CURRENT_ACCOUNT]({ commit }) {
    const response = await postMessage(
      MessageTypesEnum.GET_CURRENT_ACCOUNT_REQUEST
    );

    if (response?.type !== MessageTypesEnum.GET_CURRENT_ACCOUNT_RESPONSE)
      return response;

    commit(mutationTypes.SET_CURRENT_ACCOUNT, {
      account: response?.data?.account,
    });
  },
  async [actionTypes.GET_SESSION_TOKEN]() {
    const response = await postMessage(
      MessageTypesEnum.GET_SESSION_TOKEN_REQUEST
    );

    return response?.data?.sessionToken;
  },
};
