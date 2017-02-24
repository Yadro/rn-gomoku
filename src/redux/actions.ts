import store from "./store";

export const actions = {
  add(field) {
    store.dispatch({type: 'ADD', field});
  },

  clear() {
    store.dispatch({type: 'CLEAR'});
  },
};