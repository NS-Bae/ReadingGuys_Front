import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, View, useWindowDimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../types.tsx';
import { AxiosError } from 'axios';

import { getUserInfo } from '../utils/userAsyncStorageFunction.tsx';

import { BookData } from '../types.tsx';

import Styles from '../mainStyle.tsx';
import BookScroll from '../Components/bookScroll.tsx';
import BookInfo from '../Components/bookinfo.tsx';
import api from '../api.tsx';

type MainScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Main'>;

interface MainScreenProps {
  navigation: MainScreenNavigationProp;
}
interface Records {
  ExamDate: string;
  ProgressRate: string;
  RecordLink: string;
  WorkbookName: string;
  examDate: string;
}

function Ms({ navigation } : MainScreenProps): React.JSX.Element {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [bookList, setBookList] = useState<any>(null);
  const [bookInfo, setBookInfo] = useState<any>(null);
  const [recordList, setRecordList] = useState<any>(null);
  const [recordCount, setRecordCount] = useState<number>(0);

  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);

  const getBookList = useCallback(async () => {
    if (!userInfo) { return null; }
    try
    {
      const response = await api.get('/workbook/list',{
        params : {academyId : userInfo.AcademyID},
      });
      if(response)
      {
        setBookList(response.data);
      }
      else
      {
        console.log(response, '실패');
      }
    }
    catch(error)
    {
      const axiosError = error as AxiosError;
      console.log('b',axiosError);
    }
  }, [userInfo]);
  //
  const fetchUserInfo = async () => {
    try
    {
      const storedUserInfo = await getUserInfo();

      if (storedUserInfo)
      {
        if (storedUserInfo && storedUserInfo.AcademyID)
        {
          setUserInfo(storedUserInfo);
        }
        else
        {
          console.warn('academyId가 없습니다.');
        }
      }
      else
      {
        console.warn('userInfo가 AsyncStorage에 없습니다.');
      }
    }
    catch (error)
    {
      console.error('사용자 정보를 가져오는데 실패했습니다:', error);
    }
  };

  const selectCheck = (bookinfo: BookData, RecordList: Records[], RecordCount: number) => {
    setBookInfo(bookinfo);
    setRecordList(RecordList);
    setRecordCount(RecordCount);
  };
  //화면이동
  const movePage = (value: string) => {
    if(value === 'record')
    {
      navigation.navigate('Record', { RecordList: recordList });
    }
    else if(value === 'exam')
    {
      navigation.navigate('Exam', { ExamBook: bookInfo });
    }
  };
  //시험기록 상세보기 모달창(미완)
  const recordDetail = (recordLink: string) => {
    console.log(recordLink);
  };
  //사용자정보 가져오기
  useEffect(() => {
    fetchUserInfo();
  }, []);
  useEffect(() => {
    getBookList();
  }, [getBookList, userInfo]);

  return (
    <SafeAreaView style={styles.basic}>
      <View style={styles.basic}>
        {width > 600 ? ( //분할화면
          <View style={styles.splitScreen}>
            <BookScroll
              books = {bookList}
              onSelectCheckBookButton = {selectCheck}
              userInfo = {userInfo}
              movePage={movePage}
            />
            <BookInfo
              books = {bookInfo}
              recordList = {recordList}
              recordCount = {recordCount}
              movePage={movePage}
              recordDetail={recordDetail}
            />
          </View>
        ) : ( //전체화면
          <View style={styles.basic}>
            <BookScroll
              books = {bookList}
              onSelectCheckBookButton = {selectCheck}
              userInfo = {userInfo}
              movePage = {movePage}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default Ms;
