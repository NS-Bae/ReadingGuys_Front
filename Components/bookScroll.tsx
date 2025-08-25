import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { BookData, UserInfo, Records } from '../types.tsx';

import { getDownloadedBooks, syncDownloadedBooks } from '../utils/userAsyncStorageFunction.tsx';
import { downloadWorkbookFile } from '../utils/handleWorkbookFile.tsx';
import { loadExamRecord } from '../utils/examFunction.tsx';

import BookButton from './changedButton';
import Mt from './text.tsx';
import Styles from '../mainStyle.tsx';
import Bs from '../Components/bottomSheet.tsx';

interface BookScrollProps {
  books: BookData[]; //서버에 존재하는 서적
  onSelectCheckBookButton: (bookId: BookData, recordList: Records[], recordCount: number) => void;
  userInfo: UserInfo;
  movePage: (value: string) => void;
}

const BookScroll: React.FC<BookScrollProps> = ({ books, onSelectCheckBookButton, userInfo, movePage }) => {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);

  const [openUpIndex, setOpenUpIndex] = useState<string | null>(null);
  const [openMdIndex, setOpenMdIndex] = useState<string | null>(null);
  const [sK, setSK] = useState<BookData | null>(null);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [existBookList, setExistBookList] = useState<BookData[]>();//저장된 책들
  const [recordList, setRecordList] = useState<Records[]>([]);
  const [recordCount, setRecordCount] = useState<number>(0);
  const [latestPoint, setLatestPoint] = useState<string>('0');

  //문제집 관리 괸련 함수
  const fetchDownloadedBooks = async () => {
    try
    {
      const downBookList = await getDownloadedBooks();
      setExistBookList(downBookList);
    }
    catch(error)
    {
      console.error('다운로드된 책 목록을 가져오는 중 오류 발생:', error);
    }
  };

  const handleServerBook = async (book: BookData) => {
    if (book)
    {
      const localPath = await downloadWorkbookFile(book);
      if(localPath)
      {
        Alert.alert('다운로드 완료', `${book.workbookName} 이(가) 저장되었습니다.`);
      }
      else
      {
        Alert.alert('다운로드 실패', '파일 저장에 실패했습니다.');
      }
    }
    else
    {
      Alert.alert('문제집 정보가 올바르지 않아 다운로드에 실패했습니다.');
    }
    fetchDownloadedBooks();
  };

  const handleDownloadedBook = async (book: BookData) => {
    setLatestPoint('0');
    if(existBookList)
    {
      const nowBookInfo = existBookList.find((bookss: BookData) => bookss.workbookId === book.workbookId);
      console.log(nowBookInfo, 'pqpqpqp');
      if(nowBookInfo !== undefined)
      {
        setSK(nowBookInfo);

        const refineData = {
          userId: userInfo.id,
          userName: userInfo.userName,
          academyId: userInfo.AcademyID,
          workbookId: nowBookInfo.workbookId,
        };
        const RecordList = await loadExamRecord(refineData);
        if(RecordList !== null && RecordList !== undefined)
        {
          setRecordCount(RecordList.length);
          setRecordList(RecordList);
          const latestRecord: string = await extractLatestRecord(RecordList);

          setLatestPoint(latestRecord);
          setOpenMdIndex(openMdIndex === book.workbookId ? null : book.workbookId);
          onSelectCheckBookButton(nowBookInfo, RecordList, RecordList.length);
          handleOpenBottomSheet();
        }
      }
    }

    if (openUpIndex !== null)
    {
      setOpenUpIndex(null);
    }
    if (openMdIndex === book.workbookId)
    {
      handleCloseBottomSheet();
    }
  };

  //일반 스마트폰의 문제집 상세정보 확인 BottomSheetModal
  const handleOpenBottomSheet = () => {
    setBottomSheetVisible(true);
  };
  const handleCloseBottomSheet = () => {
    setBottomSheetVisible(false);
    if (openUpIndex !== null)
    {
      setOpenUpIndex(null);
    }
    if (openMdIndex !== null)
    {
      setOpenMdIndex(null);
    }
  };

  //시험기록 확인 관련 함수
  //가장 최근에 본 시험점수 추출
  async function extractLatestRecord(RecordList: Records[])
  {
    if(RecordList.length === 0)
    {
      return '0';
    }
    else
    {
      const latestItem: Records = RecordList.reduce((latest, current) => {
        return new Date(current.ExamDate) > new Date(latest.ExamDate) ? current : latest;
      }, RecordList[0]);

      return latestItem.ProgressRate;
    }
  }
  //async storage에 저장된 다운로드 된 책 리스트 가져오기
  useEffect(() => {
    fetchDownloadedBooks();
    syncDownloadedBooks();
  }, [books]);

  const filteredDownBooks = useMemo(() => {
    if (!books || !existBookList) { return []; }

    return books.filter(
      (book) =>
        !existBookList.some(
          (dlBook) =>
            dlBook.workbookId === book.workbookId &&
            dlBook.workbookName === book.workbookName
        )
    );
  }, [books, existBookList]);

  return (
    <>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent1}
        keyboardShouldPersistTaps="handled"
      >
        <View style={exclusiveStyles.basic}>
          <View style={styles.tfContainer}>
            <Mt title="다운로드 필요" titleStyle={styles.normal} />
          </View>
          <View style={styles.manyBtnContainer}>
            {filteredDownBooks && filteredDownBooks.length > 0 ? (
              filteredDownBooks.map((book) => (
                (
                  <View key={book.workbookId} style={styles.bTContainer}>
                    <BookButton
                      isOpen={openUpIndex === book.workbookId}
                      onPress={() => handleServerBook(book)}
                      screenWidth={width}
                    />
                    <Mt title={book.workbookName} titleStyle={styles.small} />
                  </View>
                )
              ))
            ) : (
              <Mt title="책이 없습니다" titleStyle={styles.normal} />
            )}
          </View>
          <View style={styles.tfContainer}>
            <Mt title="이용가능한 도서" titleStyle={styles.normal} />
          </View>
          <View style={styles.manyBtnContainer}>
            {existBookList && existBookList.length > 0 ? (
              existBookList.map((book) => (
                <View key={book.workbookId} style={styles.bTContainer}>
                  <BookButton
                    isOpen={openUpIndex === book.workbookId}
                    onPress={() => handleDownloadedBook(book)}
                    screenWidth={width}
                  />
                  <Mt title={book.workbookName} titleStyle={styles.small} />
                </View>
              ))
            ) : (
              <Mt title="책이 없습니다" titleStyle={styles.normal} />
            )}
          </View>
        </View>
      </ScrollView>
      {isBottomSheetVisible && width < 600 &&
        <Bs
          sK={sK}
          isVisible={isBottomSheetVisible}
          onClose={handleCloseBottomSheet}
          recordList={recordList}
          recordCount={recordCount}
          latestPoint={latestPoint}
          movePage={movePage}
        />}
    </>
  );
};

const exclusiveStyles = StyleSheet.create({
  basic:
  {
    flex: 1,
    width: '100%',
  },
});

export default BookScroll;
