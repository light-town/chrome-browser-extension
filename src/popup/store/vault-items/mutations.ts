import Vue from "vue";
import * as mutationTypes from "./mutation-types";
import { State } from "./state";

export default {
  [mutationTypes.SET_CURRENT_VAULT_ITEM_UUID](state: State, payload) {
    state.currentVaultItemUuid = payload.uuid;
  },
  [mutationTypes.SET_VAULT_ITEM](state: State, payload) {
    Vue.set(state.all, payload.item.uuid, payload.item);
  },
  [mutationTypes.SET_SUGGESTION](state: State, payload) {
    Vue.set(state.suggestions, payload.suggestion.uuid, payload.suggestion);
  },
  [mutationTypes.CLEAR_VAULT_ITEM_LIST](state: State) {
    state.all = {};
  },
  [mutationTypes.CLEAR_SUGGESTION_LIST](state: State) {
    state.suggestions = {};
  },
  [mutationTypes.SET_SEARCH_QUERY](state: State, payload: { query: string }) {
    state.searchQuery = payload.query;
  },
  [mutationTypes.CLEAR](state: State) {
    state.all = {};
    state.suggestions = {};
    state.searchQuery = "";
    state.currentVaultItemUuid = null;
  },
};
