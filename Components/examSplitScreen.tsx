import React from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

import Styles from '../mainStyle.tsx';
import Mt from './text';

const ExamSplitScreen = () => {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);

  return (
    <View style={styles.splitScreen}>
      <ScrollView style = {styles.scrollContainer} contentContainerStyle = {styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.titlecontainer}>
          <Mt title = "독(讀)한 녀석들" titleStyle = {styles.title}/>
        </View>
      </ScrollView>
      <ScrollView style = {styles.scrollContainer} contentContainerStyle = {styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.titlecontainer}>
          <Mt title = "독(讀)한 녀석들" titleStyle = {styles.title}/>
        </View>
      </ScrollView>
    </View>
  );
};

export default ExamSplitScreen;
