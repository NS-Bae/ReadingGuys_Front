import api from '../api';
import { loginDto } from '../types';
import { clearAllStorage } from './userAsyncStorageFunction';

export const NormalLogIn = ( inputs: loginDto ) => {
  return api.post('/auth/login', inputs);
};

export const NormalLogOut = () => {
  clearAllStorage();
  return api.post('/auth/logout');
};

export const getMyInfo = async () => {
  const response = await api.get('/users/myinfo');
  return response.data;
};
