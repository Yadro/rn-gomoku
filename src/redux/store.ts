import {createStore} from 'redux';
import field from './field';

let store = createStore(
  field,
  null,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({/* options */})
);

export default store;