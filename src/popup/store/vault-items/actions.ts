import * as actionTypes from "./action-types";
import * as mutationTypes from "./mutation-types";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import sendMessage from "~/tools/sendMessage";
import postMessage from "~/tools/postMessage";

export default {
  [actionTypes.SET_CURRENT_VAULT_ITEM_UUID]({ commit }, payload) {
    commit(mutationTypes.SET_CURRENT_VAULT_ITEM_UUID, { uuid: payload.uuid });
  },
  async [actionTypes.GET_VAULT_ITEMS]({ commit }) {
    const response = await postMessage(
      MessageTypesEnum.GET_VAULT_ITEMS_REQUEST
    );

    if (response?.type !== MessageTypesEnum.GET_VAULT_ITEMS_RESPONSE)
      return response;

    const items = response?.data?.items ?? [];

    for (const item of items) commit(mutationTypes.SET_VAULT_ITEM, { item });
  },
  async [actionTypes.GET_VAULT_ITEM]({ commit }, payload) {
    const response = await postMessage(
      MessageTypesEnum.GET_VAULT_ITEM_REQUEST,
      { uuid: payload.uuid }
    );

    if (response?.type !== MessageTypesEnum.GET_VAULT_ITEM_RESPONSE)
      return response;

    const item = response.data.item;

    if (!item) return;

    commit(mutationTypes.SET_VAULT_ITEM, { item });
  },
  async [actionTypes.GET_SUGGESTIONS]({ commit }) {
    const response = await postMessage(
      MessageTypesEnum.GET_SUGGESTIONS_REQUEST
    );

    if (response?.type !== MessageTypesEnum.GET_SUGGESTIONS_RESPONSE)
      return response;

    const suggestions = response?.data?.suggestions ?? [];

    for (const suggestion of suggestions)
      commit(mutationTypes.SET_SUGGESTION, { suggestion });
  },
  [actionTypes.SET_SEARCH_QUERY]({ commit }, payload) {
    commit(mutationTypes.SET_SEARCH_QUERY, { query: payload.query });
  },
  [actionTypes.CLEAR]({ commit }) {
    commit(mutationTypes.CLEAR);
  },
};
