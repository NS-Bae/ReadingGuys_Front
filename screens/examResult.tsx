import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { moderateScale } from 'react-native-size-matters';

import { SaveRecordResult, StackParamList, UserInfo } from '../types';

import { getUserInfo, verifyAndHandleToken } from '../utils/userAsyncStorageFunction';
import { saveExamResult } from '../utils/examFunction';
import { useBackHandler } from '../utils/customHooks';

type ExamResultScreenNavigationProps = NativeStackNavigationProp<StackParamList, 'Result'>;
type ExamResultScreenRouteProp = RouteProp<StackParamList, 'Result'>;
interface ExamResultScreenProps
{
  navigation: ExamResultScreenNavigationProps;
}

function ExamResultScreen({ navigation }: ExamResultScreenProps): React.JSX.Element
{
  const [nowInfo, setNowInfo] = useState<UserInfo>();
  const route = useRoute<ExamResultScreenRouteProp>();
  const { ExamResult, ExamBook, fileNames } = route.params;
  //기본 뒤로가기 커스텀
  useBackHandler(async () => {
    const verifyTokenValue = await verifyAndHandleToken();

    if(verifyTokenValue)
    {
      navigation.navigate('Main');
    }
    else
    {
      navigation.navigate('Login');
    }
    return true;
  });

  useEffect(() => {
    const fetchInfo = async () => {
      const info = await getUserInfo();
      setNowInfo(info);
    };
    fetchInfo();
  }, []);
  useEffect(() => {
    if(nowInfo && ExamResult)
    {
      const updatedExamResult: SaveRecordResult[] = ExamResult.map(item => ({
        ...item,
        question: fileNames[item.questionNumber],
      }));
      saveExamResult(nowInfo, updatedExamResult, correctCount, ExamBook);
    }
  });

  const sortedResult = [...ExamResult].sort(
    (a, b) => a.questionNumber - b.questionNumber
  );
  const correctCount = ExamResult.filter(item => item.isCorrect).length;
  const totalCount = ExamResult.length;

  const toggleGoBack = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.basic}>
      <View style={styles.topZone}>
        <Text style={styles.topText}>{ExamBook.workbookName} 시험 결과</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>총 점수: {correctCount} / {totalCount}</Text>
      </View>
      <View style={styles.basic}>
        <FlatList
          data={sortedResult}
          keyExtractor={(item) => item.questionNumber.toString()}
          renderItem={({ item }) => (
            <View style={[styles.infoTitileZone, item.isCorrect ? styles.correct : styles.incorrect]}>
              <Text style={styles.infoTitileText}>{fileNames[item.questionNumber]}</Text>
              <View style={styles.infoZone}>
                <Text style={styles.infoText}>{item.isCorrect ? '⭕ 정답' : '❌ 오답'}</Text>
                <Text style={styles.infoText}>{item.userAnswer || '미제출'}</Text>
              </View>
            </View>
          )}
        />
      </View>
      <View style={styles.fixedBottomButtons}>
        <TouchableOpacity style={styles.examButton} onPress={toggleGoBack}>
          <Text style={styles.examButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ExamResultScreen;

const styles = StyleSheet.create({
  basic: {
    flex: 1,
    width: '100%',
    backgroundColor: 'aliceblue',
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  topZone: {
    width: '100%',
    flexWrap: 'wrap',
    padding: 10,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  topText: {
    fontSize: moderateScale(30),
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  scoreContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  infoTitileZone: {
    flex: 1,
    width: '100%',
    marginVertical: 10,
  },
  correct: {
    backgroundColor: '#d4edda',
  },
  incorrect: {
    backgroundColor: '#f8d7da',
  },
  infoTitileText:
  {
    fontSize: moderateScale(23),
    textAlign: 'center',
    fontWeight: 700,
  },
  infoZone: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  infoText: {
    fontSize: moderateScale(20),
  },
  fixedBottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  examButton: {
    alignItems: 'center',
  },
  examButtonText: {
    fontSize: moderateScale(25),
    fontWeight: 700,
    color: 'black',
  },
});
