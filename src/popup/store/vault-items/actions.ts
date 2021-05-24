import * as actionTypes from "./action-types";
import * as mutationTypes from "./mutation-types";
import * as MessageTypesEnum from "~/enums/message-types.enum";

export enum FetchStatusEnum {
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export default {
  [actionTypes.SET_CURRENT_VAULT_ITEM_UUID]({ commit }, payload) {
    commit(mutationTypes.SET_CURRENT_VAULT_ITEM_UUID, { uuid: payload.uuid });
  },
  [actionTypes.SET_VAULT_ITEMS]({ commit }, payload) {
    for (const item of payload.items)
      commit(mutationTypes.SET_VAULT_ITEM, { item });

    commit(mutationTypes.SET_FETCH_STATUS, { status: FetchStatusEnum.SUCCESS });
  },
  [actionTypes.GET_VAULT_ITEMS]({ commit }) {
    commit(mutationTypes.CLEAR_VAULT_ITEM_LIST);

    chrome.runtime.sendMessage({
      type: MessageTypesEnum.GET_VAULT_ITEMS_REQUEST,
    });

    commit(mutationTypes.SET_FETCH_STATUS, { status: FetchStatusEnum.LOADING });
  },
  [actionTypes.SET_VAULT_ITEM]({ commit }, payload) {
    commit(mutationTypes.SET_VAULT_ITEM, { item: payload.item });
    commit(mutationTypes.SET_FETCH_STATUS, {
      status: FetchStatusEnum.SUCCESS,
    });
  },
  [actionTypes.GET_VAULT_ITEM]({ commit }, payload) {
    chrome.runtime.sendMessage({
      type: MessageTypesEnum.GET_VAULT_ITEM_REQUEST,
      data: { uuid: payload.uuid },
    });

    commit(mutationTypes.SET_FETCH_STATUS, { status: FetchStatusEnum.LOADING });
  },
  [actionTypes.SET_SUGGESTIONS]({ commit }, payload) {
    for (const item of payload.suggestions)
      commit(mutationTypes.SET_VAULT_ITEM, { item });

    commit(mutationTypes.SET_FETCH_STATUS, { status: FetchStatusEnum.SUCCESS });
  },
  [actionTypes.GET_SUGGESTIONS]({ commit }) {
    commit(mutationTypes.CLEAR_VAULT_ITEM_LIST);

    chrome.runtime.sendMessage({
      type: MessageTypesEnum.GET_SUGGESTIONS_REQUEST,
    });

    commit(mutationTypes.SET_FETCH_STATUS, { status: FetchStatusEnum.LOADING });
  },
};
