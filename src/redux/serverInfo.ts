

export interface ServerInfo {
  session;
  user;
}

export default (state: ServerInfo, actions): ServerInfo => {
  const newState = Object.assign({}, state);
  switch (actions.type) {
    case 'SET-PARAM':
      newState.session = actions.session;
      newState.user = actions.user;
      return newState;
  }
  return newState;
}