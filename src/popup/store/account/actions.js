import * as actionTypes from "./action-types";
import * as mutationTypes from "./mutation-types";

export default {
  [actionTypes.SET_CURRENT_ACCOUNT]({ commit }, payload) {
    commit(mutationTypes.SET_CURRENT_ACCOUNT, { account: payload.account });
  },
};
