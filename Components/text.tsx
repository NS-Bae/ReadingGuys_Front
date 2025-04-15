import * as React from 'react';
import { TextStyle, Text } from 'react-native';

interface MtProps {
  title : string;
  titleStyle? : TextStyle; //물음표는 선택적이다 값이 있을수도 없을수도 있다는 의미
}

const Mt: React.FC<MtProps> = ({ title, titleStyle }) => {
  return(
      <Text style = {titleStyle} numberOfLines={1}> {title} </Text>
  );
};

export default Mt;
