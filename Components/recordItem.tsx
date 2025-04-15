import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecordItemProps {
  examDate: string;
  progressRate: string;
  recordLink: string;
  recordDetail: (recordLink: string) => void;
}

const RecordItem: React.FC<RecordItemProps> = ({ examDate, progressRate, recordLink, recordDetail }) => {

  return (
    <View style={exclusiveStyles.container}>
      <Text style={exclusiveStyles.infotext}>시험 날짜: {examDate}</Text>
      <Text style={exclusiveStyles.infotext}>점수: {progressRate}점</Text>
      <View style={exclusiveStyles.btncontainer}>
        <TouchableOpacity onPress={() => recordDetail(recordLink)} style={exclusiveStyles.recordcheckbutton}>
          <Text style={exclusiveStyles.btntext}>
            기록 보기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const exclusiveStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    paddingRight: 10,
    paddingLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  infotext: {
    fontSize: 15,
    color: 'black',
  },
  btntext: {
    fontSize: 15,
    color: 'black',
    alignItems: 'center',
  },
  btncontainer: {
    flexDirection: 'column',
    width: '100%',
    paddingRight: 10,
    paddingLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordcheckbutton: {
    backgroundColor: '#98c9f4',
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 5,
    paddingBottom: 5,
    borderRadius: 5,
    fontSize: 15,
    color: 'black',
  },
});

export default RecordItem;
