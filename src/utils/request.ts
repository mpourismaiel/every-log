import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.BASE_URL || 'http://localhost:3001/api',
  headers: {
    authorization: localStorage.getItem('authorization'),
  },
});

export const setToken = (token: string) => {
  localStorage.setItem('authorization', token);
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
};

export default axios;
