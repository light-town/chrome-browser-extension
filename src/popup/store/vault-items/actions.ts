import * as actionTypes from "./action-types";
import * as mutationTypes from "./mutation-types";
import * as MessageTypesEnum from "~/enums/message-types.enum";

export default {
  [actionTypes.SET_VAULT_ITEMS]({ commit }, payload) {
    for (const item of payload.items)
      commit(mutationTypes.SET_VAULT_ITEM, { item });
  },
  [actionTypes.SET_CURRENT_VAULT_ITEM_UUID]({ commit }, payload) {
    commit(mutationTypes.SET_CURRENT_VAULT_ITEM_UUID, { uuid: payload.uuid });
  },
  [actionTypes.GET_VAULT_ITEM]({ commit }, payload) {
    chrome.runtime.sendMessage({
      type: MessageTypesEnum.GET_VAULT_ITEM_REQUEST,
      data: { uuid: payload.uuid },
    });
  },
  [actionTypes.SET_VAULT_ITEM]({ commit }, payload) {
    commit(mutationTypes.SET_VAULT_ITEM, { item: payload.item });
  },
};
