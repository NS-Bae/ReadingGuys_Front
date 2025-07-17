import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute } from '@react-navigation/native';

import { MarkingWorkbook } from '../utils/examFunction.tsx';
import { extractZipAndReadTextFiles } from '../utils/handleWorkbookFile.tsx';

import Styles from '../mainStyle.tsx';
import ExamSplitScreen from '../Components/examSplitScreen.tsx';
import ExamFullScreen from '../Components/examFullScreen.tsx';

import { StackParamList, UserAnswer, CorrectAnswer } from '../types.tsx';

type ExamScreenNavigationProps = NativeStackNavigationProp<StackParamList, 'Exam'>;
type ExamScreenRouteProp = RouteProp<StackParamList, 'Exam'>;

interface ExamScreenProps
{
  navigation: ExamScreenNavigationProps;
}

function ExamScreen({ navigation } : ExamScreenProps): React.JSX.Element
{
  const { width } = useWindowDimensions();
  const styles = Styles(width);
  const route = useRoute<ExamScreenRouteProp>();
  const { ExamBook } = route.params;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileContents, setFileContents] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<UserAnswer[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<CorrectAnswer[]>([]);

  async function handleZipFile(filePath: string)
  {
    setIsLoading(true);
    try
    {
      const { textFileNames, textFileContents } = await extractZipAndReadTextFiles(filePath, ExamBook.workbookName);
      setFileNames(textFileNames);
      setFileContents(textFileContents);
    }
    catch(error)
    {
      console.error('ZIP 처리 중 오류:', error);
    }
    finally
    {
      setIsLoading(false);
    }
  }
  function saveAnswer(answer: UserAnswer)
  {
    setUserAnswer(prevUserAnswers => {
      const existingIndex = prevUserAnswers.findIndex(a => a.questionNumber === answer.questionNumber);

      if(existingIndex !== -1)
      {
        const updated = [...prevUserAnswers];
        updated[existingIndex] = answer;
        return updated;
      }
      else
      {
        return [...prevUserAnswers, answer];
      }
    });
  }
  function SaveAnswerSheet(answer: CorrectAnswer)
  {
    setCorrectAnswer(prevCorrectAnswer => {
      const existingIndex = prevCorrectAnswer.findIndex(a => a.questionNumber === answer.questionNumber);

      if(existingIndex !== -1)
      {
        const updated = [...prevCorrectAnswer];
        updated[existingIndex] = answer;
        return updated;
      }
      else
      {
        return [...prevCorrectAnswer, answer];
      }
    });
  }

  useEffect(() => {
    if (!ExamBook || !ExamBook.storageLink)
    {
      console.warn('ExamBook이 아직 로드되지 않았습니다.');
      return;
    }
    const filePath = ExamBook.storageLink;
    handleZipFile(filePath);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ExamBook]);

  const toggleEnd = () => {
    console.log('end', userAnswer, correctAnswer, fileNames);

    const results = MarkingWorkbook(userAnswer, correctAnswer);
    results.forEach((res) => {
      console.log(
        `Q${res.questionNumber}: ${res.isCorrect ? '정답' : '오답'} (내 답: ${res.userAnswer}, 정답: ${res.correctAnswer})`
      );
    });
    navigation.navigate('Result', { ExamResult: results, ExamBook, fileNames });
  };

  return (
    <SafeAreaView style={styles.basic}>
      <View style={styles.basic}>
      {isLoading ? (
        <View style={exclusiveStyles.loadingContainer}>
          <Text>로딩 중...</Text>
        </View>
      ) : (
        width > 600 ? (
        // 분할화면
        <ExamSplitScreen
          fileNames={fileNames} fileContents={fileContents}
          toggleEnd={toggleEnd}
          userAnswers={userAnswer} saveAnswer={saveAnswer}
          correctAnswer={correctAnswer} saveAnswerSheet={SaveAnswerSheet}
        />
      ) : (
        // 전체화면
        <ExamFullScreen
          fileNames={fileNames} fileContents={fileContents}
          toggleEnd={toggleEnd}
          userAnswers={userAnswer} saveAnswer={saveAnswer}
          correctAnswer={correctAnswer} saveAnswerSheet={SaveAnswerSheet}
        />)
      )}
      </View>
    </SafeAreaView>
  );
}

export default ExamScreen;

const exclusiveStyles = StyleSheet.create({
  basic: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
