import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';

import Styles from '../mainStyle.tsx';
import Timer from './timerComponent.tsx';
import { moderateScale } from 'react-native-size-matters';

interface ParagraphProps
{
  contents: string;
  render: number;
}

const Paragraph: React.FC<ParagraphProps> = ({ contents, render }) => {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);
  const [isEndReached, setIsEndReached] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  if(contents === undefined || render !== 1)
  {
    return null;
  }

  const handleTimerEnd = () => {
    setIsEndReached(true);
  };

  const toggleRestart = () => {
    setIsEndReached(false);
    setResetKey(prev => prev + 1); // 타이머 리셋
  };

  return (
    <View style={exclusiveStyles.basic}>
      {isEndReached ? (
        <View style={exclusiveStyles.container1}>
          <View style={exclusiveStyles.paragraphZone}>
            <Text style={exclusiveStyles.endText}>끝!</Text>
          </View>
          <TouchableOpacity style={exclusiveStyles.exanButton} onPress={toggleRestart}>
            <Text style={exclusiveStyles.examButtonText}>다시보기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={exclusiveStyles.container}>
          <Timer
            timeSet={60}
            start={!isEndReached}
            onEnd={handleTimerEnd}
            resetTrigger={resetKey}
          />
          <ScrollView
            style={styles.basic}
            contentContainerStyle={exclusiveStyles.scrollContent2}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={exclusiveStyles.paragraphText}>{contents}</Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Paragraph;

const exclusiveStyles = StyleSheet.create({
  basic:
  {
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent2: {
    flexGrow: 1,
    marginHorizontal: 15,
  },
  paragraphZone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  paragraphText: {
    fontSize: moderateScale(30),
    fontWeight: '900',
  },
  endText: {
    fontSize: moderateScale(60),
    fontWeight: '900',
    textAlign: 'center',
    color: 'red',
    marginBottom: 20,
  },
  exanButton: {
    alignItems: 'center',
    verticalAlign: 'middle',
    marginBottom: 20,
  },
  examButtonText: {
    fontSize: moderateScale(30),
    color: 'black',
  },
});
