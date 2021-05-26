import * as actionTypes from "./action-types";
import * as mutationTypes from "./mutation-types";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import sendMessage from "~/tools/sendMessage";

export default {
  [actionTypes.SET_CURRENT_VAULT_ITEM_UUID]({ commit }, payload) {
    commit(mutationTypes.SET_CURRENT_VAULT_ITEM_UUID, { uuid: payload.uuid });
  },
  async [actionTypes.GET_VAULT_ITEMS]({ commit }) {
    const response = await sendMessage(
      MessageTypesEnum.GET_VAULT_ITEMS_REQUEST
    );
    const items = response?.data?.items ?? [];

    for (const item of items) commit(mutationTypes.SET_VAULT_ITEM, { item });
  },
  async [actionTypes.GET_VAULT_ITEM]({ commit }, payload) {
    const response = await sendMessage(
      MessageTypesEnum.GET_VAULT_ITEM_REQUEST,
      { uuid: payload.uuid }
    );
    const item = response.data.item;

    if (!item) return;

    commit(mutationTypes.SET_VAULT_ITEM, { item });
  },
  async [actionTypes.GET_SUGGESTIONS]({ commit }) {
    const response = await sendMessage(
      MessageTypesEnum.GET_SUGGESTIONS_REQUEST
    );

    const suggestions = response?.data?.suggestions ?? [];

    for (const suggestion of suggestions)
      commit(mutationTypes.SET_SUGGESTION, { suggestion });
  },
};
