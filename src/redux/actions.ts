import store from "./store";

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
};