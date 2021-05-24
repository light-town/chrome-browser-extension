import * as actionTypes from "./action-types";

export const NAMESPACE = "vaultItems";

export const SET_CURRENT_VAULT_ITEM_UUID = `${NAMESPACE}/${actionTypes.SET_CURRENT_VAULT_ITEM_UUID}`;

export const SET_VAULT_ITEMS = `${NAMESPACE}/${actionTypes.SET_VAULT_ITEMS}`;
export const GET_VAULT_ITEMS = `${NAMESPACE}/${actionTypes.GET_VAULT_ITEMS}`;

export const SET_VAULT_ITEM = `${NAMESPACE}/${actionTypes.SET_VAULT_ITEM}`;
export const GET_VAULT_ITEM = `${NAMESPACE}/${actionTypes.GET_VAULT_ITEM}`;

export const SET_SUGGESTIONS = `${NAMESPACE}/${actionTypes.SET_SUGGESTIONS}`;
export const GET_SUGGESTIONS = `${NAMESPACE}/${actionTypes.GET_SUGGESTIONS}`;
