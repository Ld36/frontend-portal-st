import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const setAuthType = (type: 'interno' | 'externo') => {
  api.defaults.headers.common['user-type'] = type;
};

setAuthType('externo');