import { IDictionary, IAction } from 'src/types';

export function createReducer<T>(
  initialState: T,
  config: IDictionary<any>,
): (state: T, action: IAction) => Partial<T> {
  return (state = initialState, action) => {
    if (!config[action.type]) {
      return state;
    }

    return config[action.type](state, action.payload, action.meta);
  };
}
