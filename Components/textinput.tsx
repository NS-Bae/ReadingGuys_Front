import * as React from 'react';
import { TextStyle, TextInput } from 'react-native';
import { TextInputProps } from 'react-native-paper';

interface TiProps extends TextInputProps {
  style? : TextStyle;
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
