import {UserEnum} from "./field";

export interface ServerInfo {
  room;
  user: UserEnum;
}

export default (state: ServerInfo, actions): ServerInfo => {
  const newState = Object.assign({}, state);
  switch (actions.type) {
    case 'SET-PARAM':
      newState.room = actions.room;
      newState.user = actions.user;
      return newState;
  }
  return newState;
}