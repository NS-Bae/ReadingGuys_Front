import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import Subjective from './examSubjectiveComponent.tsx';
import MultipleChoice from './examMultipleChoiceComponent.tsx';
import { UserAnswer, CorrectAnswer } from '../types.tsx';

interface ExamComponentProps
{
  contents: string;
  render: number;
  userAnswers: UserAnswer[];
  saveAnswer: (answer: UserAnswer) => void;
  correctAnswer: CorrectAnswer[];
  saveAnswerSheet: (answer: CorrectAnswer) => void;
}

const Exam: React.FC<ExamComponentProps> = ({ contents, render, userAnswers, saveAnswer, correctAnswer, saveAnswerSheet }) => {
  let question = '';
  let example = '';
  let choices: string[] = [];
  let answer = '';
  let currentTag: 'none' | 'example' | 'choices' = 'none';

  useEffect(() => {
    if(nowQuestionTag === '#주관식')
    {
      saveAnswerSheet({questionType: '#주관식', questionNumber: render, answer: answer});
    }
    else if(nowQuestionTag === '#객관식')
    {
      saveAnswerSheet({questionType: '#객관식', questionNumber: render, answer: answer});
    }
  }, [render]);

  if(contents === undefined || render === 0 || render === 1)
  {
    return null;
  }

  const preprocessing = contents
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
  const nowQuestionTag = preprocessing[0];
  const preprocessing2 = preprocessing.slice(1);

  for(let i = 0; i < preprocessing2.length; i++)
  {
    const line = preprocessing2[i];
    if(line.startsWith('문제 : '))
    {
      question = line.replace('문제 : ', '').trim();
      currentTag = 'none';
    }
    else if(line === '<보기>')
    {
      currentTag = 'example';
    }
    else if(line === '<선택지>')
    {
      currentTag = 'choices';
    }
    else if(line.startsWith('답 : '))
    {
      answer = line.replace('답 : ', '').trim();
      currentTag = 'none';
    }
    else
    {
      if(currentTag === 'example')
      {
        example += (example ? '\n' : '') + line;
      }
      else if(currentTag === 'choices')
      {
        choices.push(line);
      }
    }
  }

  console.log('101010', answer);

  return(
    <View style={styles.basic}>
      { nowQuestionTag === '#주관식' && <Subjective question={question} example={example} render={render} userAnswers={userAnswers} saveAnswer={saveAnswer} correctAnswer={correctAnswer} saveAnswerSheet={saveAnswerSheet} /> }
      { nowQuestionTag === '#객관식' && <MultipleChoice question={question} example={example} choices={choices} render={render} userAnswers={userAnswers} saveAnswer={saveAnswer} correctAnswer={correctAnswer} saveAnswerSheet={saveAnswerSheet} /> }
    </View>
  );
};

export default Exam;

const styles = StyleSheet.create({
  basic: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-around',
  },
});
