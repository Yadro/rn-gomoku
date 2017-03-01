
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
  switch (actions.type) {
    case 'ADD':
      return [
        ...state,
        actions.field
      ];
    case 'FILL':
      return [...actions.fields];
    case 'CLEAR':
      return [];
  }
  return [];
}