import React from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import { StackParamList } from '../types.tsx';
import Styles from '../mainStyle.tsx';
import RecordItem from '../Components/recordItem.tsx';
import Mt from '../Components/text.tsx';

type RecordScreenRouteProp = RouteProp<StackParamList, 'Record'>;

function CheckRecordScreen()
{
  const { width } = useWindowDimensions();
  const styles = Styles(width);
  const route = useRoute<RecordScreenRouteProp>();
  const { RecordList } = route.params;

  //시험기록 상세보기 모달창(미완)
  const recordDetail = (recordLink: string) => {
    console.log(recordLink);
  };

  return (
    <ScrollView
      style = {styles.scrollContainer}
      contentContainerStyle = {styles.scrollContent1}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.tfContainer}>
        <Mt title="내 시험 기록" titleStyle={styles.normal} />
      </View>
      <View style={exclusiveStyles.basic} >
      {RecordList.length > 0 ? (
        RecordList.map((record, index) => (
          <RecordItem
            key={index}
            examDate={record.examDate}
            progressRate={record.ProgressRate}
            recordLink={record.RecordLink}
            recordDetail={recordDetail}
          />
        ))
      ) : (
        <Text style={exclusiveStyles.infotext}>데이터가 없습니다.</Text>
      )}
      </View>
    </ScrollView>
  );
}

const exclusiveStyles = StyleSheet.create({
  basic:
  {
    flex: 1,
    width: '100%',
    marginTop: 10,
  },
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',

  },
  normal: {
    fontSize: 27,
    textAlign: 'left',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: 'black',
    margin: 0,
    padding: 0,
  },
  small: {
    fontSize: 15,
    textAlign: 'left',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: 'black',
    margin: 0,
    padding: 0,
  },
  infotext: {
    fontSize: 15,
    color: 'black',
    paddingTop: 5,
  },
});

export default CheckRecordScreen;
