import * as mutationTypes from "./mutation-types";

export default {
  [mutationTypes.SET_SETTINGS](state, payload) {
    state.all = payload.settings;
  },
};
