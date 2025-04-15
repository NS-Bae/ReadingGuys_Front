import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import Styles from '../mainStyle';

interface BookButtonProps {
  isOpen?: boolean;
  onPress: () => void;
  screenWidth : number;
}

const BookButton: React.FC<BookButtonProps> = ({ isOpen, onPress, screenWidth }) => {
  const styles = Styles(screenWidth);
  const bI = !isOpen ? require('../assets/images/다운로드필요close.png') : require('../assets/images/다운로드필요open.png');

  return(
    <TouchableOpacity onPress = {onPress}>
      <Image source = {bI} style = {styles.imageButtonSet}/>
    </TouchableOpacity>
  );
};

export default BookButton;
