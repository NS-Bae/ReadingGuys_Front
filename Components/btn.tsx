import * as React from 'react';
import { ViewStyle, Pressable, Text, KeyboardAvoidingView } from 'react-native';
import Styles from '../mainStyle.tsx';

interface BbProps {
  title : string;
  onPress : () => void;
  btnStyle? : ViewStyle; //물음표는 선택적이다 값이 있을수도 없을수도 있다는 의미
  screenWidth : number;
}

const Bb: React.FC<BbProps> = ({ title, onPress, btnStyle, screenWidth } ) => {
  const styles = Styles(screenWidth);
  return(
    <KeyboardAvoidingView style = {styles.btncontainer}>
      <Pressable onPress = { onPress } style = {btnStyle}>
        <Text style = {styles.BBText}> {title} </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default Bb;
