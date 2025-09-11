import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const api = axios.create({
  baseURL: 'http://10.0.2.2:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async(config) => {
    try
    {
      const credentials = await Keychain.getGenericPassword();

      if(credentials)
      {
        const token = credentials.password;

        if(token && config.headers)
        {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    }
    catch(error)
    {
      console.error('token fetch error', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if(error.response?.status === 401)
    {
      console.log('Token expired or invalied');
    }
    return Promise.reject(error);
  }
);

export default api;
