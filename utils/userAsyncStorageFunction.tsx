import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import RNFS from 'react-native-fs';

import { BookData } from '../types';

export const getUserInfo = async () => {
  try
  {
    const rawUserInfo = await AsyncStorage.getItem('userInfo');
    if(rawUserInfo !== null)
    {
      const parsedUserInfo = JSON.parse(rawUserInfo);

      return parsedUserInfo;
    }
    else
    {
      console.log('ℹ️ userInfo 값이 존재하지 않음');
      return null;
    }
  }
  catch (error)
  {
    console.error('❌ AsyncStorage 값을 가져오는 중 오류 발생:', error);
    return null;
  }
};

export const clearAuthStorage = async () => {
  try
  {
    await AsyncStorage.multiRemove(['userToken', 'userInfo']);
    console.log('🧹 userToken과 userInfo 삭제 완료');
  }
  catch(error)
  {
    console.error('❌ 스토리지 삭제 중 오류 발생:', error);
  }
};

export const verifyAndHandleToken = async () => {
  try
  {
    const rawUserToken = await AsyncStorage.getItem('userToken');
    if(!rawUserToken)
    {
      console.warn('❗️토큰이 존재하지 않음');
      await clearAuthStorage();
      return false;
    }
    const decoded: any = jwtDecode(rawUserToken);
    const currentTime = Math.floor(Date.now() / 1000);

    if(decoded.exp < currentTime)
    {
      console.warn('⌛️ 토큰이 만료되었습니다');
      await clearAuthStorage();
      return false;
    }
    console.log('✅ 유효한 토큰입니다');
    return true;
  }
  catch(error)
  {
    console.error('❌ 토큰 검증 중 오류 발생:', error);
    await clearAuthStorage();
    return false;
  }
};

export const registTokenAndInfo = async(token: string, info: string) => {
  await AsyncStorage.setItem('userToken', token);
  await AsyncStorage.setItem('userInfo', JSON.stringify(info));
};

export const getDownloadedBooks = async (): Promise<BookData[]> => {
  try
  {
    const rawDownloadedBookList = await AsyncStorage.getItem('downloadedBooks');

    if(rawDownloadedBookList !== null)
    {
      const parsedDownloadedBookList = JSON.parse(rawDownloadedBookList);
      console.log('qqqqq', parsedDownloadedBookList);
      return parsedDownloadedBookList;
    }
    else
    {
      console.log('ℹ️ DownloadedBookList 값이 존재하지 않습니다');

      return [];
    }
  }
  catch(error)
  {
    console.error('❌ AsyncStorage 값을 가져오는 중 오류 발생:', error);

    return [];
  }
};
//
export const syncDownloadedBooks = async (): Promise<BookData[]> => {
  try
  {
    const downloadedBooks = await getDownloadedBooks();
    const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);

    const existingFileNames = files
      .filter((file) => file.isFile() && file.name.endsWith('.zip'))
      .map((file) => file.name);

    // AsyncStorage에 저장된 책 중, 실제로 존재하는 파일만 필터링
    const syncedBooks = downloadedBooks.filter((book) => {
      const expectedFileName = `${book.workbookId}_${book.workbookName}.zip`;
      return existingFileNames.includes(expectedFileName);
    });

    await AsyncStorage.setItem('downloadedBooks', JSON.stringify(syncedBooks));

    return syncedBooks;
  }
  catch(error)
  {
    console.error('동기화 실패:', error);
    return [];
  }
};
