import { REHYDRATE } from 'redux-persist';
import { createReducer } from './utils';
import { ITransaction } from 'src/pages';
import { IDictionary } from 'src/types';
import { byKey } from 'src/utils/object';
import { IState } from '.';

export type ITransactionsState = IDictionary<ITransaction>;
export const initialState: ITransactionsState = {};

export const ADD_TRANSACTION: string = 'TRANSACTIONS/ADD_TRANSACTION';
export const UPDATE_TRANSACTION: string = 'TRANSACTIONS/UPDATE_TRANSACTION';
export const DELETE_TRANSACTION: string = 'TRANSACTIONS/DELETE_TRANSACTION';
export const TOGGLE_TYPE_TRANSACTION: string =
  'TRANSACTIONS/TOGGLE_TYPE_TRANSACTION';
export const SORT_TRANSACTIONS: string = 'TRANSACTIONS/SORT_TRANSACTIONS';
export const FILL_TRASNASCTIONS: string = 'TRANSACTIONS/FILL_TRASNASCTIONS';

export const addTransaction = (
  transaction: ITransaction,
  meta?: { editingTransactionId: number },
) => dispatch => {
  dispatch({
    type: ADD_TRANSACTION,
    payload: transaction,
    meta,
  });
  dispatch(sortTransactions());
};

export const updateTransaction = (
  transaction: ITransaction,
  id: string,
) => dispatch => {
  dispatch({
    type: UPDATE_TRANSACTION,
    payload: { transaction, id },
  });
  dispatch(sortTransactions());
};

export const deleteTransaction = (id: string) => dispatch => {
  dispatch({
    type: DELETE_TRANSACTION,
    payload: id,
  });
  dispatch(sortTransactions());
};

export const toggleTypeTransaction = (
  id: string,
  type: 'income' | 'outcome',
) => dispatch => {
  dispatch({
    type: TOGGLE_TYPE_TRANSACTION,
    payload: { id, type },
  });
  dispatch(sortTransactions());
};

export const fillTransactions = (
  payload: IDictionary<ITransaction>,
) => dispatch => {
  dispatch({
    type: FILL_TRASNASCTIONS,
    payload,
  });
  dispatch(sortTransactions());
};

export const sortTransactions = () => ({
  type: SORT_TRANSACTIONS,
});

const transactions = createReducer<ITransactionsState>(initialState, {
  [ADD_TRANSACTION]: (
    state,
    payload,
    { editingTransactionId }: { editingTransactionId?: string | number } = {},
  ) => {
    const id = `${Math.random() * 10000000000}`;
    return {
      ...state,
      [id]: {
        _id: id,
        ...payload,
        date: payload.date || Date.now(),
      },
    };
  },
  [UPDATE_TRANSACTION]: (
    state,
    { transaction, id }: { transaction: IDBTransaction; id: string },
  ) => ({
    ...state,
    [id]: transaction,
  }),
  [DELETE_TRANSACTION]: (state, payload) =>
    Object.keys(state)
      .filter(key => key !== payload)
      .reduce((tmp, key) => {
        tmp[key] = state[key];
        return tmp;
      }, {}),
  [TOGGLE_TYPE_TRANSACTION]: (state, { id, type }) => ({
    ...state,
    [id]: {
      ...state[id],
      type,
    },
  }),
  [REHYDRATE]: (state, store: IState = {} as any) =>
    Object.keys(store.transactions)
      .map(key => store.transactions[key])
      .reduce((tmp, transaction: ITransaction) => {
        if (!transaction._id) {
          transaction._id = `${Math.random() * 10000000000}`;
        }

        tmp[transaction._id] = transaction;
        return tmp;
      }, {}),
  [FILL_TRASNASCTIONS]: (state, payload) => ({
    ...payload,
  }),
  [SORT_TRANSACTIONS]: state =>
    byKey(
      Object.keys(state)
        .map(key => state[key])
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
      '_id',
    ),
});

export default transactions;
