import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

interface ExamEndComponentProps
{
  toggleEnd: () => void;
}

const ExamEnd: React.FC<ExamEndComponentProps> = ({ toggleEnd }) => {

  return(
    <View style={exclusiveStyles.basic}>
      <View style={exclusiveStyles.textZone}>
        <Text style={exclusiveStyles.text}>
          마지막 문제까지 다 풀었습니다.
        </Text>
        <Text style={exclusiveStyles.text}>
          종료버튼을 누르면
        </Text>
        <Text style={exclusiveStyles.text}>
          점수가 나옵니다.
        </Text>
      </View>
      <View style={exclusiveStyles.fixedBottomButtonZone}>
        <TouchableOpacity style={exclusiveStyles.letterButton} onPress={toggleEnd}>
          <Text style={exclusiveStyles.letterButtonText}>
            시험 종료
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExamEnd;

const exclusiveStyles = StyleSheet.create({
  basic:
  {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
  },
  textZone: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: moderateScale(30),
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: moderateScale(55),
  },
  fixedBottomButtonZone: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
  },
  letterButton: {
    alignItems: 'center',
  },
  letterButtonText: {
    fontSize: moderateScale(30),
    color: 'black',
    fontWeight: '900',
  },
});
