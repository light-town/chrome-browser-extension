import Vue from "vue";
import * as mutationTypes from "./mutation-types";

export default {
  [mutationTypes.SET_VAULT_ITEM](state, payload) {
    Vue.set(state.all, payload.item.uuid, payload.item);
  },
  [mutationTypes.SET_CURRENT_VAULT_ITEM_UUID](state, payload) {
    state.currentVaultItemUuid = payload.uuid;
  },
  [mutationTypes.SET_FETCH_STATUS](state, payload) {
    state.fetchStatus = payload.status;
  },
  [mutationTypes.CLEAR_VAULT_ITEM_LIST](state) {
    state.all = {};
  },
};
