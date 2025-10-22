import api from '../api';
import { loginDto } from '../dto/interface.dto';

export const NormalLogIn = ( inputs: loginDto ) => {
  console.log(inputs);
  return api.post('/auth/login', inputs);
};
