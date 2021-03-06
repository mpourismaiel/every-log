import Axios from 'axios';
import { ITransaction } from '../pages';

const axios = Axios.create({
  baseURL: process.env.BASE_URL || 'http://localhost:3001/api',
  headers: {
    authorization: localStorage.getItem('authorization'),
  },
});

export const setToken = (token: string) => {
  localStorage.setItem('authorization', token);
  localStorage.removeItem('isUsingAuth');
  axios.defaults.headers.authorization = token;
};

export const API = {
  login: (data: { email: string; password: string }) =>
    axios.post('/user/login', data),
  register: (data: {
    email: string;
    password: string;
    passwordConfirm: string;
  }) => axios.post('/user/signup', data),
  fetchTransactions: () => axios.get('/transactions'),
  createTransaction: (data: ITransaction) => axios.post('/transactions', data),
  importTransactions: (data: ITransaction[]) =>
    axios.post('/transactions-import', data),
  updateTransaction: (data: ITransaction) => axios.put('/transactions', data),
  deleteTransaction: (id: string) => axios.delete(`/transactions/${id}`),
};

export default axios;
