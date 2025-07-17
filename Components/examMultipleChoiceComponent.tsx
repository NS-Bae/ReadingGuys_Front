import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CorrectAnswer, UserAnswer } from '../types.tsx';
import { moderateScale } from 'react-native-size-matters';
import { ScrollView } from 'react-native-gesture-handler';

interface MultipleChoiceComponentProps
{
  question: string;
  example: string;
  choices: string[];
  render: number;
  userAnswers: UserAnswer[];
  saveAnswer: (answer: UserAnswer) => void;
  correctAnswer: CorrectAnswer[];
  saveAnswerSheet: (answer: CorrectAnswer) => void;
}

const MultipleChoice: React.FC<MultipleChoiceComponentProps> = ({ question, example, choices, render, userAnswers, saveAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const existing = userAnswers.find(
      ans => ans.questionNumber === render && ans.questionType === '#객관식'
    );
    if(existing && existing.choiceAnswer)
    {
      setSelected(existing.choiceAnswer);
    }
    else
    {
      setSelected(null);
    }
  }, [render, userAnswers]);
  useEffect(() => {
    saveAnswer({questionType: '#주관식', questionNumber: render});
  }, [render]);

  const handleSelect = (choice: string) => {
    setSelected(choice);
    saveAnswer({ questionType: '#객관식', questionNumber: render, choiceAnswer: choice });
  };

  return (
    <View style={styles.basic}>
      <ScrollView contentContainerStyle = {styles.scrollContent} keyboardShouldPersistTaps="handled" >
        <View style={styles.questionZone}>
          <Text style={styles.questionText}>{question}</Text>
        </View>
        { example !== '' &&
          <View style={styles.exampleZone}>
            <Text style={styles.exampleText}>{example}</Text>
          </View>
        }
        <View style={styles.optionZone}>
          {choices.map((choice, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionContainer}
              onPress={() => handleSelect(choice)}
            >
              <View style={styles.radioCircle}>
                {selected === choice && <View style={styles.selectedDot} />}
              </View>
              <Text style={styles.optionText}>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default MultipleChoice;

const styles = StyleSheet.create({
  basic: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  questionZone: {
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
    flexWrap: 'wrap',
  },
  exampleZone: {
    width: '100%',
    flexWrap: 'wrap',
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  exampleText: {
    fontSize: moderateScale(25),
    fontWeight: 600,
    marginBottom: 10,
  },
  optionZone: {
    width: '100%',
    margin: 10,
    justifyContent: 'center',
    alignContent: 'center',
  },
  optionContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  optionTextWrapper: {
    justifyContent: 'center',
  },
  radioCircle: {
    height: 16,
    width: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedDot: {
    height: 8,
    width: 8,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  optionText: {
    textAlignVertical: 'center',
    flexShrink: 1,
    width: '88%',
    fontSize: moderateScale(25),
    lineHeight: moderateScale(35),
    paddingBottom: 5,
  },
});
