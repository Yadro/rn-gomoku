

export interface ServerInfo {
  session;
  user;
}

export default (state: ServerInfo, actions): ServerInfo => {
  const newState = Object.assign({}, state);
  switch (actions.type) {
    case 'SET-SESSION':
      newState.session = actions.session;
      return newState;
    case 'SET-USER-TYPE':
      newState.user = actions.user;
      return newState;
  }
  return newState;
}