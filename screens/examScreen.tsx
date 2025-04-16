import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, useWindowDimensions } from 'react-native';
/* import { NativeStackNavigationProp } from '@react-navigation/native-stack';
 */import { StackParamList } from '../types.tsx';
import { RouteProp, useRoute } from '@react-navigation/native';
import { unzip } from 'react-native-zip-archive';
import RNFS, { DocumentDirectoryPath } from 'react-native-fs';

import Styles from '../mainStyle.tsx';
import ExamSplitScreen from '../Components/examSplitScreen.tsx';
import ExamFullScreen from '../Components/examFullScreen.tsx';

/* type ExamScreenNavigationProps = NativeStackNavigationProp<StackParamList, 'Exam'>;
 */type ExamScreenRouteProp = RouteProp<StackParamList, 'Exam'>;
/* type TxtFile = {
  name: string;
  content: string;
}; */
/* interface ExamScreenProps
{
  navigation: ExamScreenNavigationProps;
}
 */
function ExamScreen(/* { navigation } : ExamScreenProps */): React.JSX.Element
{
  const { width } = useWindowDimensions();
  const styles = Styles(width);
  const route = useRoute<ExamScreenRouteProp>();
  const { ExamBook } = route.params;

  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileContents, setFileContents] = useState<string[]>([]);

  async function handleZipFile(filePath: string)
  {
    console.log('b');
    try
    {
      const targetPath = `${DocumentDirectoryPath}/unzipped`;
      const unzippedPath = await unzip(filePath, targetPath);
      const files = await RNFS.readDir(unzippedPath);
      const firstFolder = files.find(item => item.isDirectory());

      if(firstFolder)
      {
        const folderPath = firstFolder.path;
        console.log('폴더 경로a:', folderPath);
        const innerFiles = await RNFS.readDir(folderPath);

        const fileName = innerFiles
          .filter(item => item.isFile() && item.name.endsWith('.txt')) // .txt 파일만
          .map(item => item.name.replace(/\.txt$/, ''));

        setFileNames(fileName);

        const fileContent = innerFiles.map(async item => {
          const content = await RNFS.readFile(item.path, 'utf8');
          return content;
        });
        const tempAllfiles = await Promise.all(fileContent);
        setFileContents(tempAllfiles);
      }
    }
    catch(error)
    {
      console.error('ZIP 처리 중 오류:', error);
    }
  }

  useEffect(() => {
    const filePath = ExamBook.storageLink;
    handleZipFile(filePath);
    console.log('a');
  }, [ExamBook]);

  return (
    <SafeAreaView style={styles.basic}>
      <View style={styles.basic}>
        {width > 600 ? ( //분할화면
          <ExamSplitScreen />
        ) : ( //전체화면
          <ExamFullScreen fileNames={fileNames} fileContents={fileContents}/>
        )}
      </View>
    </SafeAreaView>
  );
}

export default ExamScreen;
