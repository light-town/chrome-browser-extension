import * as actionTypes from "./action-types";

export const NAMESPACE = "vaultItems";

export const SET_CURRENT_VAULT_ITEM_UUID = `${NAMESPACE}/${actionTypes.SET_CURRENT_VAULT_ITEM_UUID}`;
export const GET_VAULT_ITEM = `${NAMESPACE}/${actionTypes.GET_VAULT_ITEM}`;
export const GET_VAULT_ITEMS = `${NAMESPACE}/${actionTypes.GET_VAULT_ITEMS}`;
export const GET_SUGGESTIONS = `${NAMESPACE}/${actionTypes.GET_SUGGESTIONS}`;
export const SET_SEARCH_QUERY = `${NAMESPACE}/${actionTypes.SET_SEARCH_QUERY}`;
export const CLEAR = `${NAMESPACE}/${actionTypes.CLEAR}`;
