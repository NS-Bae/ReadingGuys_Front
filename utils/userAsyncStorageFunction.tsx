import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import RNFS from 'react-native-fs';
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Keychain from 'react-native-keychain';

import { BookData } from '../types';

export const getUserInfo = async () => {
  try
  {
    const rawUserInfo = await EncryptedStorage.getItem('userInfo');
    if(rawUserInfo !== null)
    {
      const parsedUserInfo = JSON.parse(rawUserInfo);
      console.log(rawUserInfo);
      return parsedUserInfo.info;
    }
    else
    {
      console.log('ℹ️ userInfo 값이 존재하지 않음');
      return null;
    }
  }
  catch (error)
  {
    console.error('❌ EncryptedStorage 값을 가져오는 중 오류 발생:', error);
    return null;
  }
};

export const clearAuthStorage = async () => {
  try
  {
    await Keychain.resetGenericPassword();
    await EncryptedStorage.removeItem('userInfo');
    console.log('🧹 userToken과 userInfo 삭제 완료');
  }
  catch(error)
  {
    console.error('❌ 스토리지 삭제 중 오류 발생:', error);
  }
};

export const verifyAndHandleToken = async (): Promise<boolean> => {
  try
  {
    const rawUserToken = await Keychain.getGenericPassword();
    if(!rawUserToken)
    {
      console.warn('❗️토큰이 존재하지 않음');
      await clearAuthStorage();
      return false;
    }
    const token = rawUserToken.password;
    const decoded: any = jwtDecode(token);
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

  console.log('q', token, info);

  await Keychain.setGenericPassword('jwt', token);

  // 사용자 정보는 EncryptedStorage에 저장
  await EncryptedStorage.setItem(
    'userInfo',
    JSON.stringify({
      info,
    })
  );
};

export const getDownloadedBooks = async (): Promise<BookData[]> => {
  try
  {
    const rawDownloadedBookList = await AsyncStorage.getItem('downloadedBooks');

    if(rawDownloadedBookList !== null)
    {
      const parsedDownloadedBookList = JSON.parse(rawDownloadedBookList);
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

export const clearAllStorage = async () => {
  await clearAuthStorage();
  /* try
  {
    await AsyncStorage.clear();
  }
  catch(error)
  {
    console.error('로그아웃 중 오류 발생:', error);
  } */
};
