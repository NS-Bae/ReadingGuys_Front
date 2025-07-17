import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import SideDrawer from 'react-native-side-drawer';

import Styles from '../mainStyle.tsx';
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

const ExamFullScreen: React.FC<ExamFullScreenProps> = ({ fileNames, fileContents, toggleEnd, userAnswers, saveAnswer, correctAnswer, saveAnswerSheet }) => {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);

  const [isOpen, setIsOpen] = useState(false);
  const [renderQuestionNumber, setRenderQuestionNumber] = useState<number>(0);
  const [messgae, setMessage] = useState<string>('');
  const [alertView, setAlertView] = useState<boolean>(false);

  if(fileContents === undefined)
  {
    return null;
  }

  const toggleOpenDrawer = () => {
    setIsOpen(!isOpen);
  };
  const toggleTestDrawer = (i: number) => {
    if(i !== fileContents.length)
    {
      setRenderQuestionNumber(i);
    }
    setIsOpen(!isOpen);
  };
  const toggleCloseDrawer = () => {
    setIsOpen(!isOpen);
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
    <ScrollView
      style={styles.basic}
      contentContainerStyle={styles.scrollContent2}
      keyboardShouldPersistTaps="handled"
    >
      {isOpen && (
        <View>
          <SideDrawer
            open={isOpen}
            drawerContent={<DrawerContent toggleTestDrawer={toggleTestDrawer} toggleCloseDrawer={toggleCloseDrawer} fileNames={fileNames} screenType="full" />}
            drawerPercentage={45}
            animationTime={500}
            overlay={true}
          />
        </View>
      )}
      <View style={exclusiveStyles.container}>
        <TouchableOpacity style={exclusiveStyles.burgerButton} onPress={toggleOpenDrawer}>
          <Text style={exclusiveStyles.buergerButtonText}>☰</Text>
        </TouchableOpacity>
      </View>
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
      {alertView && <Ca title = "시험을 종료 할 수 없습니다." message = {messgae} onConfirm = {confirmAlert} />}
    </ScrollView>
  );
};

export default ExamFullScreen;

const exclusiveStyles = StyleSheet.create({
  basic: {
    width: '100%',
    flex: 1,
  },
  basic1: {
    width: '100%',
    height: 500,
    flex: 1,
  },
  container: {
    justifyContent: 'flex-start',
    paddingLeft: 20,
    paddingTop: 10,
  },
  burgerButton: {
    alignItems: 'center',
    width: 40,
    borderRadius: 5,
  },
  buergerButtonText: {
    color: 'black',
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    width: 'auto',
  },
  fixedBottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  exanButton: {
    alignItems: 'center',
  },
  examButtonText: {
    fontSize: moderateScale(25),
    color: 'black',
  },
});
