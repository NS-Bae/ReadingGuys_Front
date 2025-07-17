import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { CorrectAnswer, UserAnswer } from '../types.tsx';
import { moderateScale } from 'react-native-size-matters';

interface SubjectiveComponentProps
{
  question: string;
  example: string;
  render: number;
  userAnswers: UserAnswer[];
  saveAnswer: (answer: UserAnswer) => void;
  correctAnswer: CorrectAnswer[];
  saveAnswerSheet: (answer: CorrectAnswer) => void;
}

const Subjective: React.FC<SubjectiveComponentProps> = ({ question, example, render, userAnswers, saveAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const existing = userAnswers.find(
      ans => ans.questionNumber === render && ans.questionType === '#주관식'
    );
    if(existing && existing.textAnswer)
    {
      setSelected(existing.textAnswer);
    }
    else
    {
      setSelected(null);
    }
  }, [render, userAnswers]);
  useEffect(() => {
    saveAnswer({questionType: '#주관식', questionNumber: render});
  }, [render]);

  const handleInput = (choice: string) => {
    setSelected(choice);
    saveAnswer({ questionType: '#주관식', questionNumber: render, textAnswer: choice });
  };
  return (
    <View style={styles.basic}>
      <View style={styles.questionZone}>
        <Text style={styles.questionText}>{question}</Text>
      </View>
      { example !== '' &&
        <View style={styles.exampleZone}>
          <Text style={styles.exampleText}>{example}</Text>
        </View>
      }
      <View style={styles.answerZone}>
        <TextInput style={styles.answerInput} value={selected ?? ''} onChangeText={handleInput} />
      </View>
    </View>
  );
};

export default Subjective;

const styles = StyleSheet.create({
  basic: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  questionZone: {
    width: '100%',
    padding: 10,
    paddingBottom: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  answerZone: {
    width: '100%',
    padding: 10,
  },
  exampleZone: {
    width: '100%',
    flexWrap: 'wrap',
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  questionText: {
    fontSize: moderateScale(30),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  answerInput: {
    borderWidth: 2,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: moderateScale(20),
  },
  exampleText: {
    fontSize: moderateScale(30),
    fontWeight: 600,
    marginBottom: 10,
  },
});

