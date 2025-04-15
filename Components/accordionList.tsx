import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';

import Styles from '../mainStyle.tsx';
import Mt from './text.tsx';
import RecordItem from './recordItem.tsx';

interface ExamRecord {
  ExamDate: string;
  ProgressRate: string;
  WorkbookName: string;
  examDate: string;
  RecordLink: string;
}

interface ExpandableComponentProps
{
  basicInfo: string;
  onPress: () => void;
  isCollapsed: boolean;
  info: ExamRecord[];
  recordDetail: (recordLink: string) => void;
}

const ExpandableComponent: React.FC<ExpandableComponentProps> = ({ basicInfo, onPress, isCollapsed, info, recordDetail }) => {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);

  if(info === null || undefined)
  {
    return null;
  }

  return (
    <View style={exclusiveStyles.basic}>
      <TouchableOpacity style={exclusiveStyles.container} onPress={onPress}>
        <Mt title={basicInfo} titleStyle={styles.normal}/>
        <Text style={styles.small}>{isCollapsed ? '펼치기 ▼' : '접기 ▲'}</Text>
      </TouchableOpacity>
      <Collapsible style={exclusiveStyles.basic} collapsed={isCollapsed}>
      {info.length > 0 ? (
        info.map((record, index) => (
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
      </Collapsible>
    </View>
  );
};

const exclusiveStyles = StyleSheet.create({
  basic:
  {
    width: '100%',
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

export default ExpandableComponent;
