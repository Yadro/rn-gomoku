import store from "./store";
import {UserEnum} from "./field";

export const actions = {
  add(field) {
    store.dispatch({type: 'ADD', field});
  },

  fillField(fields) {
    store.dispatch({type: 'FILL', fields});
  },

  clear() {
    store.dispatch({type: 'CLEAR'});
  },

  asClient(room, api) {
    store.dispatch({type: 'SET-PARAM', api, room, user: UserEnum.client});
  },

  asServer(room, api) {
    store.dispatch({type: 'SET-PARAM', api, room, user: UserEnum.server});
  },

  setStatus(status) {
    store.dispatch({type: 'STATUS', status});
  }
};