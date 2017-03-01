import {UserEnum} from "./field";

type GameStatus = 'win' | '';
export interface ServerInfo {
  room;
  user: UserEnum;
  status: GameStatus;
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