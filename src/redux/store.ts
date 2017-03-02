import {createStore, combineReducers} from 'redux';
import field from './field';
import serverInfo from './serverInfo';

let store = createStore(
  combineReducers({
    field,
    serverInfo,
  }),
  {
    field: [],
    serverInfo: {
      session: -1,
      user: -1,
      api: null,
    }
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({/* options */})
);

export default store;