import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import Timer from './timerComponent.tsx';
import { moderateScale } from 'react-native-size-matters';

interface WordChangeProps
{
  wordContents: string;
  render: number;
}

const WordChange: React.FC<WordChangeProps> = ({ wordContents, render }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEndReached, setIsEndReached] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  if(wordContents === undefined || render !== 0)
  {
    return null;
  }

  const linesArray = wordContents
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => {
      const cleanedLine = line.replace(/^-/, '').trim();
      const [word, description] = cleanedLine.split(/\s*:\s*/);
      return [word, description];
    });

  const handleTimerEnd = () => {
    if (currentIndex < linesArray.length - 1)
    {
      setCurrentIndex(prev => prev + 1);
      setResetKey(prev => prev + 1); // 타이머 리셋
    }
    else
    {
      setIsEndReached(true);
    }
  };
  const toggleRestart = () => {
    setIsEndReached(false);
    setResetKey(prev => prev + 1); // 타이머 리셋
    setCurrentIndex(0);
  };

  return (
    <View style={exclusiveStyles.basic}>
      {isEndReached ? (
        <View style={exclusiveStyles.container1}>
          <View style={exclusiveStyles.wordZone}>
            <Text style={exclusiveStyles.endText}>끝!</Text>
          </View>
          <TouchableOpacity style={exclusiveStyles.exanButton} onPress={toggleRestart}>
            <Text style={exclusiveStyles.examButtonText}>다시보기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={exclusiveStyles.container}>
          <Timer
            timeSet={5}
            start={!isEndReached}
            onEnd={handleTimerEnd}
            resetTrigger={resetKey}
          />
          <View style={exclusiveStyles.wordZone}>
            <Text style={exclusiveStyles.wordText}>{linesArray[currentIndex][0]}</Text>
          </View>
          <View style={exclusiveStyles.meanZone}>
            <Text style={exclusiveStyles.meanText}>{linesArray[currentIndex][1]}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default WordChange;

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
  wordZone: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  wordText: {
    fontSize: moderateScale(50),
    fontWeight: '900',
    textAlign: 'center',
  },
  meanZone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  meanText: {
    fontSize: moderateScale(50),
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: moderateScale(95),
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
