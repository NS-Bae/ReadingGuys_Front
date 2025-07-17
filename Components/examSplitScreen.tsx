import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Ca from './alert.tsx';
import DrawerContent from './sideBarComponent.tsx';
import WordChange from './examWordChangeComponent.tsx';
import Paragraph from './examParagraphComponent.tsx';
import Exam from './examExamComponent.tsx';
import ExamEnd from './examEndComponent.tsx';
import { UserAnswer, CorrectAnswer } from '../types.tsx';
import { moderateScale } from 'react-native-size-matters';

interface ExamFullScreenProps
{
  fileNames: string[];
  fileContents: string[];
  toggleEnd: () => void;
  userAnswers: UserAnswer[];
  saveAnswer: (answer: UserAnswer) => void;
  correctAnswer: CorrectAnswer[];
  saveAnswerSheet: (answer: CorrectAnswer) => void;
}

const ExamSplitScreen: React.FC<ExamFullScreenProps> = ({ fileNames, fileContents, toggleEnd, userAnswers, saveAnswer, correctAnswer, saveAnswerSheet }) => {
  const [renderQuestionNumber, setRenderQuestionNumber] = useState<number>(0);
  const [messgae, setMessage] = useState<string>('');
  const [alertView, setAlertView] = useState<boolean>(false);

  if(fileContents === undefined)
  {
    return null;
  };

  const toggleTestDrawer = (i: number) => {
    if(i !== fileContents.length)
    {
      setRenderQuestionNumber(i);
    }
  };
  const toggleMove = (id: string) => {
    if(id === 'prev')
    {
      setRenderQuestionNumber(renderQuestionNumber - 1);
    }
    else if(id === 'next')
    {
      if(renderQuestionNumber + 1 === fileContents.length && correctAnswer.length + 2 !== fileContents.length )
      {
        setMessage('문제를 다 풀지 않았습니다.');
        setAlertView(true);
      }
      else
      {
        setRenderQuestionNumber(renderQuestionNumber + 1);
      }
    }
  };
  const confirmAlert = () => {
    setAlertView(false);
  };

  return (
    <View style={exclusiveStyles.splitScreen}>
      <View style = {exclusiveStyles.leftScrollContainer}>
        <ScrollView contentContainerStyle = {exclusiveStyles.scrollContent} keyboardShouldPersistTaps="handled">
          <DrawerContent toggleTestDrawer={toggleTestDrawer} fileNames={fileNames} screenType="split" />
        </ScrollView>
      </View>
      <View style = {exclusiveStyles.rightScrollContainer}>
        <ScrollView contentContainerStyle = {exclusiveStyles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={exclusiveStyles.basic1}>
          {renderQuestionNumber === 0 && <WordChange wordContents={fileContents[renderQuestionNumber]} render={renderQuestionNumber} />}
          {renderQuestionNumber === 1 && <Paragraph contents={fileContents[renderQuestionNumber]} render={renderQuestionNumber} />}
          {renderQuestionNumber !== 0 && renderQuestionNumber !== 1 && <Exam contents={fileContents[renderQuestionNumber]} render={renderQuestionNumber} userAnswers={userAnswers} saveAnswer={saveAnswer} correctAnswer={correctAnswer} saveAnswerSheet={saveAnswerSheet} />}
          {renderQuestionNumber === fileNames.length && <ExamEnd toggleEnd={toggleEnd}/>}
        </View>
        { renderQuestionNumber !== fileNames.length &&
          <View style={exclusiveStyles.fixedBottomButtons}>
            <TouchableOpacity style={exclusiveStyles.exanButton} onPress={() => toggleMove('prev')} disabled={renderQuestionNumber === 0} >
              <Text style={exclusiveStyles.examButtonText}>이전</Text>
            </TouchableOpacity>
            <TouchableOpacity style={exclusiveStyles.exanButton} onPress={() => toggleMove('next')} disabled={renderQuestionNumber === fileNames.length}>
              <Text style={exclusiveStyles.examButtonText}>다음</Text>
            </TouchableOpacity>
          </View>
        }
        </ScrollView>
      </View>
      {alertView && <Ca title = "시험을 종료 할 수 없습니다." message = {messgae} onConfirm = {confirmAlert} />}
    </View>
  );
};

export default ExamSplitScreen;

const exclusiveStyles = StyleSheet.create({
  splitScreen: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  leftScrollContainer: {
    flex: 30,
    backgroundColor: 'aliceblue',
  },
  rightScrollContainer: {
    flex: 70,
    backgroundColor: 'aliceblue',
  },
  scrollContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basic1: {
    width: '100%',
    height: 500,
    flex: 1,
  },
  fixedBottomButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  exanButton: {
    alignItems: 'center',
  },
  examButtonText: {
    fontSize: moderateScale(20),
    color: 'black',
  },
});
