import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import transactions, { ITransactionsState } from './transactions';

export interface IState {
  transactions: ITransactionsState;
}

const reducers = combineReducers({
  transactions,
});

const persistConfig = {
  key: 'every-log-storage',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk)),
);

export default { store, persistor: persistStore(store) };
