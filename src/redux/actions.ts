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

  asClient(session) {
    store.dispatch({type: 'SET-PARAM', session, user: UserEnum.client});
  },

  asServer(session) {
    store.dispatch({type: 'SET-PARAM', session, user: UserEnum.server});
  },
};