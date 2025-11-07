import React, { useCallback, useEffect, useState } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SideDrawer from 'react-native-side-drawer';

import { BookData, Records, StackParamList, UserInfo } from '../types.tsx';

import Styles from '../mainStyle.tsx';
import BookScroll from '../Components/bookScroll.tsx';
import BookInfo from '../Components/bookinfo.tsx';
import RM from '../Components/recordModal.tsx';
import DrawerContent from '../Components/infoSideBarComponent.tsx';
import OM from '../Components/otherModal.tsx';
import IM from '../Components/other2Modal.tsx';

import { NormalLogOut } from '../utils/authFunction.tsx';
import { requestWorkbookList } from '../utils/handleWorkbookFile.tsx';
import { getUserInfo, syncDownloadedBooks, verifyAndHandleToken } from '../utils/userAsyncStorageFunction.tsx';

import { useBackHandler } from '../utils/customHooks.tsx';

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
  const [isOtherModalOpen, setOtherModalIsOpen] = useState(false);
  const [otherModalKey, setOtherModalKey] = useState<string>('');
  const [isInfoModalOpen, setInfoModalIsOpen] = useState(false);

  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);
  //뒤로가기 핸들러
  useBackHandler(async () => {
    const verifyTokenValue = await verifyAndHandleToken();

    if(verifyTokenValue)
    {
      navigation.navigate('Home');
    }
    else
    {
      navigation.navigate('Login');
    }
    return true;
  });
  //서버에 등록된 허용된 책리스트 불러오기
  const getBookList = useCallback(async () => {
    if (!userInfo) { return null; }
    const bookData = await requestWorkbookList(userInfo.hashedAcademyId);
    if(bookData)
    {
      setBookList(bookData);
    }
    else
    {
      console.log(bookData, '실패');
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
  };
  const toggleOtherModalOpen = () => {
    setOtherModalIsOpen(true);
  };
  const toggleOtherModalClose = () => {
    setOtherModalIsOpen(false);
  };
  const toggleInfoModalOpen = () => {
    setInfoModalIsOpen(true);
  };
  const toggleInfoModalClose = () => {
    setInfoModalIsOpen(false);
  };
  const toggleDrawerContent = (key: string) => {
    if(key === 'out')
    {
      console.log(key);
      NormalLogOut();
      setIsOpen(false);
      navigation.navigate('Home');
    }
    else if(key === 'credits' || key === 'pi' || key === 'legal' || key === 'about')
    {
      setOtherModalKey(key);
      toggleOtherModalOpen();
      setIsOpen(false);
    }
    else if(key === 'info')
    {
      toggleInfoModalOpen();
      setIsOpen(false);
    }
  };
  //사용자정보 가져오기
  useEffect(() => {
    fetchUserInfo();
    syncDownloadedBooks();
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
      {isOtherModalOpen && userInfo &&
        <OM
          isModalVisible={isOtherModalOpen}
          onClose={() => toggleOtherModalClose()}
          userInfo={userInfo}
          modalKey={otherModalKey}
        />
      }
      {isInfoModalOpen && userInfo &&
        <IM
          isModalVisible={isInfoModalOpen}
          onClose={() => toggleInfoModalClose()}
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
