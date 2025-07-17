import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import Styles from '../mainStyle.tsx';
import Mt from './text.tsx';
import Accordion from './accordionList.tsx';

interface Book {
  workbookId: string;
  workbookName: string;
  Difficulty: string;
  storageLink: string;
}
interface Records {
  ExamDate: string;
  ProgressRate: string;
  RecordLink: string;
  WorkbookName: string;
  examDate: string;
}
interface BookInfoProps {
  books: Book;
  recordList: Records[];
  recordCount: number;
  movePage: (value: string) => void;
  recordDetail: (recordLink: string) => void;
}

const BookInfo: React.FC<BookInfoProps> = ({ books, recordList, recordCount, movePage, recordDetail }) => {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);
  const basicInfo = '시험 정보';

  const [collapsed, setCollapsed] = useState(true);

  //books props가 없는(null) 경우 return null
  if(books === null)
  {
    return null;
  }
  //아코디언 컴포넌트 접힘 판단
  const handleAccordion = async () => {
    setCollapsed(!collapsed);
  };
  const handleGoExam = () => {
    const value = 'exam';
    movePage(value);
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent1}
      keyboardShouldPersistTaps="handled"
    >
      <View style={exclusiveStyles.basic}>
        <View style={styles.tfContainer}>
          <Mt title="문제집 정보" titleStyle={styles.normal} />
        </View>
        <View style={exclusiveStyles.container}>
          <Text style={exclusiveStyles.normal}>책 이름 : {books.workbookName}</Text>
          <Text style={exclusiveStyles.normal}>책 난이도 : {books.Difficulty}</Text>
          <Text style={exclusiveStyles.normal}>응시 횟수 : {recordCount}</Text>
        </View>
        <Accordion
          basicInfo={basicInfo}
          onPress={handleAccordion}
          isCollapsed={collapsed}
          info={recordList}
          recordDetail={recordDetail}
          />
        <View style={exclusiveStyles.btncontainer}>
          <TouchableOpacity onPress={handleGoExam} style={exclusiveStyles.gotoexambutton}>
            <Text style={exclusiveStyles.infotext}>
              시험 보러 가기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const exclusiveStyles = StyleSheet.create({
  basic:
  {
    flex: 1,
    width: '100%',
  },
  container: {
    padding: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  normal: {
    fontSize: moderateScale(20),
    textAlign: 'left',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: 'black',
    margin: 0,
    padding: 0,
  },
  infotext: {
    fontSize: moderateScale(20),
    color: 'black',
    fontWeight: 'bold',
  },
  btncontainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  gotoexambutton: {
    width: '80%',
    alignItems: 'center',
    fontSize: moderateScale(20),
  },
});

export default BookInfo;
