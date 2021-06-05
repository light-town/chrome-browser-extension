import * as actionTypes from "./action-types";
import * as mutationTypes from "./mutation-types";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import postMessage from "~/tools/postMessage";

export default {
  async [actionTypes.GET_SETTINGS]({ commit }) {
    const response = await postMessage(MessageTypesEnum.GET_SETTINGS_REQUEST);

    if (response?.type === MessageTypesEnum.ERROR) return;

    commit(mutationTypes.SET_SETTINGS, { settings: response?.settings });
  },
  async [actionTypes.UPDATE_SETTINGS]({ commit }, payload) {
    const response = await postMessage(
      MessageTypesEnum.UPDATE_SETTINGS_REQUEST,
      { settings: payload.settings }
    );

    if (response?.type === MessageTypesEnum.ERROR) return;

    commit(mutationTypes.SET_SETTINGS, { settings: response?.settings });
  },
};
