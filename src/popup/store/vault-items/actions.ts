import * as actionTypes from "./action-types";
import * as mutationTypes from "./mutation-types";

export default {
  [actionTypes.SET_VAULT_ITEMS]({ commit }, payload) {
    for (const item of payload.items)
      commit(mutationTypes.SET_VAULT_ITEM, { item });
  },
  [actionTypes.SET_CURRENT_VAULT_ITEM_UUID]({ commit }, payload) {
    commit(mutationTypes.SET_CURRENT_VAULT_ITEM_UUID, { uuid: payload.uuid });
  },
};
