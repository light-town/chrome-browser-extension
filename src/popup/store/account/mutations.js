import * as mutationTypes from "./mutation-types";

export default {
  [mutationTypes.SET_CURRENT_ACCOUNT](state, payload) {
    state.uuid = payload.account.uuid;
    state.key = payload.account.key;
  },
};
