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

  asClient(room) {
    store.dispatch({type: 'SET-PARAM', room, user: UserEnum.client});
  },

  asServer(room) {
    store.dispatch({type: 'SET-PARAM', room, user: UserEnum.server});
  },
};