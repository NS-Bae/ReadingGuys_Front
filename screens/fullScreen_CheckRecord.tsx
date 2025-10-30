import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { moderateScale } from 'react-native-size-matters';

import { StackParamList, UserInfo } from '../types.tsx';
import Styles from '../mainStyle.tsx';
import RecordItem from '../Components/recordItem.tsx';
import Mt from '../Components/text.tsx';
import RM from '../Components/recordModal.tsx';
import { getUserInfo } from '../utils/userAsyncStorageFunction.tsx';
import { useBackHandler } from '../utils/customHooks.tsx';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RecordScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Record'>;
type RecordScreenRouteProp = RouteProp<StackParamList, 'Record'>;
interface CheckRecordScreenProps
{
  navigation: RecordScreenNavigationProp;
}

function CheckRecordScreen({ navigation } : CheckRecordScreenProps): React.JSX.Element
{
  const { width } = useWindowDimensions();
  const styles = Styles(width);
  const route = useRoute<RecordScreenRouteProp>();
  const { RecordList, bookInfo } = route.params;

  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [recordURL, setRecordURL] = useState<string>('');
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  useBackHandler(async() => {
    navigation.navigate('Main');
    return true;
  });

  const fetchUserInfo = async () => {
    try
    {
      const storedUserInfo = await getUserInfo();

      if (storedUserInfo)
      {
        if (storedUserInfo && storedUserInfo.info.hashedAcademyId)
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
  useEffect(() => {
    fetchUserInfo();
  }, []);

  //시험기록 상세보기 모달창(미완)
  const recordDetail = (recordLink: string) => {
    setRecordURL(recordLink);
    setRecordModalVisible(true);
    console.log(recordModalVisible, recordLink);
  };

  return (
    <ScrollView
      style = {styles.scrollContainer}
      contentContainerStyle = {styles.scrollContent1}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.tfContainer}>
        <Mt title={`${bookInfo.workbookName} 시험 기록`} titleStyle={styles.normal} />
      </View>
      <View style={exclusiveStyles.basic} >
      {RecordList.length > 0 ? (
        RecordList.map((record, index) => (
          <RecordItem
            key={index}
            examDate={record.examDate}
            progressRate={record.ProgressRate}
            recordLink={record.RecordLink}
            recordDetail={recordDetail}
          />
        ))
      ) : (
        <Text style={exclusiveStyles.infotext}>데이터가 없습니다.</Text>
      )}
      </View>
      {width < 600 && recordModalVisible && userInfo &&
        <RM
          isModalVisible={recordModalVisible}
          onClose={() => setRecordModalVisible(false)}
          recordLink={recordURL}
          userInfo={userInfo}
        />
      }
    </ScrollView>
  );
}

const exclusiveStyles = StyleSheet.create({
  basic:
  {
    flex: 1,
    width: '100%',
    marginTop: 10,
  },
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',

  },
  normal: {
    fontSize: moderateScale(30),
    textAlign: 'left',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: 'black',
    margin: 0,
    padding: 0,
  },
  infotext: {
    fontSize: moderateScale(20),
    color: 'black',
    paddingTop: 5,
  },
});

export default CheckRecordScreen;
