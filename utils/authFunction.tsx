import api from '../api';
import { loginDto } from '../dto/interface.dto';
import { clearAllStorage } from './userAsyncStorageFunction';

export const NormalLogIn = ( inputs: loginDto ) => {
  return api.post('/auth/login', inputs);
};

export const NormalLogOut = () => {
  clearAllStorage();
  return api.post('/auth/logout');
};
