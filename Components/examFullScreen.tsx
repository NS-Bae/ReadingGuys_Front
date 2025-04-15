import React from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

import Styles from '../mainStyle.tsx';
import Mt from './text';

const ExamFullScreen = () => {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);

  return (
    <ScrollView style={styles.basic}>
      <View style={styles.titlecontainer}>
        <Mt title = "독한 녀석들" titleStyle = {styles.title}/>
      </View>
    </ScrollView>
  );
};

export default ExamFullScreen;
