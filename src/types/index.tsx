import { Action } from 'redux';

export interface IDictionary<T> {
  [key: string]: T;
}

export interface IAction extends Action {
  payload?: any;
  meta?: any;
}
