import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Records, StackParamList, UserInfo } from '../types.tsx';
import { AxiosError } from 'axios';
import SideDrawer from 'react-native-side-drawer';

import { getUserInfo } from '../utils/userAsyncStorageFunction.tsx';

import { BookData } from '../types.tsx';

import Styles from '../mainStyle.tsx';
import BookScroll from '../Components/bookScroll.tsx';
import BookInfo from '../Components/bookinfo.tsx';
import api from '../api.tsx';
import RM from '../Components/recordModal.tsx';
import DrawerContent from '../Components/infoSideBarComponent.tsx';
import { moderateScale } from 'react-native-size-matters';
import { NormalLogOut } from '../utils/authFunction.tsx';

type MainScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Main'>;

interface MainScreenProps {
  navigation: MainScreenNavigationProp;
}

function Ms({ navigation } : MainScreenProps): React.JSX.Element {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [bookList, setBookList] = useState<BookData[]>();
  const [bookInfo, setBookInfo] = useState<BookData>();
  const [recordList, setRecordList] = useState<Records[]>();
  const [recordCount, setRecordCount] = useState<number>(0);

  const [recordURL, setRecordURL] = useState<string>('');
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);
  //서버에 등록된 허용된 책리스트 불러오기
  const getBookList = useCallback(async () => {
    if (!userInfo) { return null; }
    try
    {
      const response = await api.get('/workbook/list',{
        params : {academyId : userInfo.hashedAcademyId},
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
  //사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try
    {
      const storedUserInfo = await getUserInfo();

      if (storedUserInfo)
      {
        if (storedUserInfo && storedUserInfo.info.hashedAcademyId)
        {
          setUserInfo(storedUserInfo.info);
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
    if(bookInfo)
    {
      if(value === 'record' && recordList)
      {
        navigation.navigate('Record', { RecordList: recordList, bookInfo: bookInfo });
      }
      else if(value === 'exam')
      {
        navigation.navigate('Exam', { ExamBook: bookInfo });
      }
    }
  };
  //시험기록 상세보기 모달창
  const recordDetail = (recordLink: string) => {
    setRecordURL(recordLink);
    setRecordModalVisible(true);
  };
  //햄버거 서랍
  const toggleOpenDrawer = () => {
    setIsOpen(!isOpen);
  };
  const toggleCloseDrawer = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };
  const toggleDrawerContent = (key: string) => {
    console.log(key);
    if(key === 'out')
    {
      console.log(key);
      NormalLogOut();
      navigation.navigate('Home');
    }
  };
  //사용자정보 가져오기
  useEffect(() => {
    fetchUserInfo();
  }, []);
  useEffect(() => {
    getBookList();
  }, [getBookList, userInfo]);

  return (
    <>
      <SafeAreaView style={styles.basic}>
      {isOpen && (
        <View>
          <SideDrawer
            open={isOpen}
            drawerContent={<DrawerContent toggleCloseDrawer={toggleCloseDrawer} toggleDrawerContent={toggleDrawerContent}/>}
            drawerPercentage={35}
            animationTime={500}
            overlay={true}
          />
        </View>
      )}
        <View style={styles.basic}>
            <View style={exclusiveStyles.container}>
            <TouchableOpacity style={exclusiveStyles.burgerButton} onPress={toggleOpenDrawer}>
              <Text style={exclusiveStyles.buergerButtonText}>☰</Text>
            </TouchableOpacity>
          </View>
          {width > 600 ? ( //분할화면
            <View style={styles.splitScreen}>
              { userInfo && bookList &&
                <BookScroll
                  books = {bookList}
                  onSelectCheckBookButton = {selectCheck}
                  userInfo = {userInfo}
                  movePage={movePage}
                />
              }
              { bookInfo && recordList &&
                <BookInfo
                  books = {bookInfo}
                  recordList = {recordList}
                  recordCount = {recordCount}
                  movePage={movePage}
                  recordDetail={recordDetail}
                />
              }
            </View>
          ) : ( //전체화면
            <View style={styles.basic}>
              { userInfo && bookList &&
                <BookScroll
                  books = {bookList}
                  onSelectCheckBookButton = {selectCheck}
                  userInfo = {userInfo}
                  movePage={movePage}
                />
              }
            </View>
          )}
        </View>
      </SafeAreaView>
      {width > 600 && recordModalVisible && userInfo &&
        <RM
          isModalVisible={recordModalVisible}
          onClose={() => setRecordModalVisible(false)}
          recordLink={recordURL}
          userInfo={userInfo}
        />
      }
    </>
  );
}

export default Ms;

const exclusiveStyles = StyleSheet.create({
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
});
