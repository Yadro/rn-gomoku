
export enum UserEnum {
  server,
  client,
}

export interface FieldItem {
  position: {x, y};
  user: UserEnum;
}

export default (state: FieldItem[], actions): FieldItem[] => {
  state = state || [];
  const newState = state.slice();
  switch (actions.type) {
    case 'ADD':
      newState.push(actions.field);
      return newState;
    case 'FILL':
      newState.push(...actions.fields);
      return newState;
    case 'CLEAR':
      return [];
  }
  return [];
}