import React, { useEffect } from 'react';
import { SafeAreaView, View, useWindowDimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../types.tsx';
import { RouteProp, useRoute } from '@react-navigation/native';
import { unzip } from 'react-native-zip-archive';
import RNFS, { DocumentDirectoryPath } from 'react-native-fs';

import Styles from '../mainStyle.tsx';
import ExamSplitScreen from '../Components/examSplitScreen.tsx';
import ExamFullScreen from '../Components/examFullScreen.tsx';

type ExamScreenNavigationProps = NativeStackNavigationProp<StackParamList, 'Exam'>;
type ExamScreenRouteProp = RouteProp<StackParamList, 'Exam'>;

interface ExamScreenProps
{
  navigation: ExamScreenNavigationProps;
}

function ExamScreen({ navigation } : ExamScreenProps): React.JSX.Element
{
  const { width } = useWindowDimensions();
  const styles = Styles(width);
  const route = useRoute<ExamScreenRouteProp>();
  const { ExamBook } = route.params;

  console.log(ExamBook.storageLink);

  async function handleZipFile(filePath: string)
  {
    try
    {
      const targetPath = `${DocumentDirectoryPath}/unzipped`;
      const unzippedPath = await unzip(filePath, targetPath);
      const files = await RNFS.readDir(unzippedPath);

      for (const file of files)
      {
        if (file.isFile()) {
          console.log('파일 이름:', file.name);

          const content = await RNFS.readFile(file.path, 'utf8');
          console.log('내용:', content);
        }
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
  }, []);

  return (
    <SafeAreaView style={styles.basic}>
      <View style={styles.basic}>
        {width > 600 ? ( //분할화면
          <ExamSplitScreen />
        ) : ( //전체화면
          <ExamFullScreen />
        )}
      </View>
    </SafeAreaView>
  );
}

export default ExamScreen;
