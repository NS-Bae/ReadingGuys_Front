import * as React from 'react';
import { TextStyle, TextInput } from 'react-native';
import { TextInputProps } from 'react-native-paper';

interface TiProps extends TextInputProps {
  style? : TextStyle; //물음표는 선택적이다 값이 있을수도 없을수도 있다는 의미
  placeholder? : string;
  secureTextEntry? : boolean;
}

const Ti: React.FC<TiProps> = ({placeholder, style, secureTextEntry, ...props}) => {
  return(
      <TextInput
        placeholder={placeholder}
        style = {style}
        secureTextEntry = {secureTextEntry}
        {...props}
        />
  );
};

export default Ti;
