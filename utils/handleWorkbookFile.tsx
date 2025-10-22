import { unzip } from 'react-native-zip-archive';
import RNFS, { DocumentDirectoryPath } from 'react-native-fs';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../api.tsx';
import { BookData, LocalBookData } from '../types.tsx';
import { getDownloadedBooks } from './userAsyncStorageFunction.tsx';

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
    console.log('gggggggerww', book);
    const response = await api.post('/workbook/download', book, { responseType: 'blob' });

    const reader = new FileReader();

    return await new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        if (typeof reader.result === 'string')
        {
          try {
            const convertData = reader.result.split(',')[1];
            const localPath = `${RNFS.DocumentDirectoryPath}/${book.workbookId}_${book.workbookName}.zip`;
            await RNFS.writeFile(localPath, convertData, 'base64');

            const savedBooks = await AsyncStorage.getItem('downloadedBooks');
            const booksInStorage: BookData[] = savedBooks ? JSON.parse(savedBooks) : [];

            const isDuplicate = booksInStorage.some(
              (books: BookData) =>
                books.workbookId === book.workbookId &&
                books.workbookName === book.workbookName
            );

            if(!isDuplicate)
            {
              const newBook: LocalBookData = {
                workbookId: book.workbookId,
                Difficulty: book.Difficulty,
                workbookName: book.workbookName,
                storageLink: localPath,
              };

              const updatedBooks = [...booksInStorage, newBook];
              await AsyncStorage.setItem('downloadedBooks', JSON.stringify(updatedBooks));
            }
            else
            {
              console.log('이미 저장된 책입니다.');
            }

            resolve(localPath);
          }
          catch(error)
          {
            console.error('파일 저장 또는 AsyncStorage 처리 오류:', error);
            reject(null);
          }
        }
        else
        {
          Alert.alert('파일 처리 오류', '파일을 변환하는 중 오류가 발생했습니다.');
          reject(null);
        }
      };

      reader.onerror = () => {
        Alert.alert('파일 처리 오류', '파일 읽기 중 오류가 발생했습니다.');
        reject(null);
      };

      reader.readAsDataURL(response.data);
    });
  }
  catch(error)
  {
    Alert.alert('다운로드 실패', '서버에서 오류가 발생했습니다.');
    return null;
  }
};
//압축해제
export const extractZipAndReadTextFiles = async (filePath: string, workbookName: string) => {
  try
  {
    const targetPath = `${DocumentDirectoryPath}/unzipped/${workbookName}`;
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
  }
  catch (error)
  {
    console.error('❌ 파일 처리 중 오류 발생:', error);
    throw error;
  }
};
