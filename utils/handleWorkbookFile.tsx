import { unzip } from 'react-native-zip-archive';
import RNFS, { DocumentDirectoryPath } from 'react-native-fs';
import { Alert, Platform } from 'react-native';
import { Buffer } from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../api.tsx';
import { BookData } from '../types.tsx';
import { getDownloadedBooks } from './userAsyncStorageFunction.tsx';
import { AxiosError } from 'axios';

/**
 * ZIP 파일을 해제하고 내부 텍스트 파일 이름 및 내용 반환
 * @param filePath 압축 파일 경로
 * @param workbookName 워크북 이름 (압축 해제 디렉토리 구분용)
 */

//다운로드 완료된 책정보 Async Storage에 추가하기
export const downloadedBook = async (book: BookData): Promise<void> => {
  const currentBooks = await getDownloadedBooks();
  const isDuplicate = currentBooks.some(
    (b) => b.workbookId === book.workbookId && b.workbookName === book.workbookName
  );
  if(!isDuplicate)
  {
    const updatedBooks = [...currentBooks, book];
    await AsyncStorage.setItem('downloadedBooks', JSON.stringify(updatedBooks));
  }
};
//서버에서 다운
export const downloadWorkbookFile = async ( book: BookData ): Promise<string | null> => {
  try
  {
    const response = await api.post('/workbook/download', book, { responseType: 'arraybuffer' });

    const downloadedData = Buffer.from(response.data, 'binary').toString('base64');

    const safeName = book.workbookName.replace(/\s+/g, '_');
    const localPath = `${RNFS.DocumentDirectoryPath}/${book.workbookId}_${safeName}.zip`;
    await RNFS.writeFile(localPath, downloadedData, 'base64');

    const savedBooks = await AsyncStorage.getItem('downloadedBooks');
    const booksInStorage: BookData[] = savedBooks ? JSON.parse(savedBooks) : [];

    const isDuplicate = booksInStorage.some(
      (books: BookData) =>
        books.workbookId === book.workbookId &&
        books.workbookName === book.workbookName
    );

    if(!isDuplicate)
    {
      const newBook: BookData = {
        workbookId: book.workbookId,
        Difficulty: book.Difficulty,
        workbookName: book.workbookName,
        storageLink: localPath,
      };

    const updatedBooks = [...booksInStorage, newBook];
    console.log(updatedBooks);
    await AsyncStorage.setItem('downloadedBooks', JSON.stringify(updatedBooks));
  }
  else
  {
    console.log('이미 저장된 책입니다.');
  }

  return localPath;
  }
  catch(error)
  {
    Alert.alert('다운로드 실패', '서버에서 오류가 발생했습니다.');
    return null;
  }
};
//압축해제
export const extractZipAndReadTextFiles = async (filePath: string, workbookName: string) => {
  const safeName = workbookName.replace(/\s+/g, '_');
  const targetPath = `${DocumentDirectoryPath}/unzipped/${safeName}`;
  const unzippedPath = await unzip(filePath, targetPath);
  const files = await RNFS.readDir(unzippedPath);
  const firstFolder = files.find(item => item.isDirectory());

  if(!firstFolder)
  {
    throw new Error('압축 해제된 폴더가 존재하지 않습니다.');
  }
  const folderPath = firstFolder.path;
  const innerFiles = await RNFS.readDir(folderPath);

  const txtFiles = innerFiles
    .filter(item => item.isFile() && item.name.endsWith('.txt'));
  const textFileNames = txtFiles.map(item => item.name.replace(/\.txt$/, ''));
  const textFileContents = await Promise.all(
    txtFiles.map(item => RNFS.readFile(item.path, 'utf8'))
  );

  return { textFileNames, textFileContents };
};

export const requestWorkbookList = async (hashedData: string): Promise<BookData[] | null> => {
  try
  {
    const bookData = await api.get('/workbook/list', { params: { hashedAcademyId: hashedData } });
    return bookData.data;
  }
  catch(error)
  {
    const axiosError = error as AxiosError;
    console.log('b',axiosError);
    return null;
  }
};

//read txtfile
export const loadTextFile = async (fileName: string): Promise<string | null> => {
  try
  {
    let path = '';
    if(Platform.OS === 'ios')
    {
      path = `${RNFS.MainBundlePath}/${fileName}.txt`;
      const fileData = await RNFS.readFile(path, 'utf8');
      return fileData;
    }
    else
    {
      const assetName = `txtFile/${fileName}.txt`;
      const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}.txt`;

      await RNFS.copyFileAssets(assetName, localPath);
      const fileData = await RNFS.readFile(localPath, 'utf8');
      return fileData;
    }
  }
  catch(error)
  {
    console.error('파일 읽기 실패:', error);
    Alert.alert('파일 오류', `${fileName} 파일을 불러올 수 없습니다.`);
    return null;
  }
};
