import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export const useBackHandler = ( callback: () => boolean | Promise<boolean> ) => {
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      const result = callback();
      if(result instanceof Promise)
      {
        result.then(res => res);
      }
      return true;
    });
    return () => handler.remove();
  }, [callback]);
};

export const useDisableBackHandler = () => {
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => handler.remove();
  }, []);
};
