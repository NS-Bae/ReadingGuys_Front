import React from 'react';
import { SafeAreaView, ScrollView, View, useWindowDimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../types.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

import Bb from '../Components/btn.tsx';
import Styles from '../mainStyle.tsx';
import Mt from '../Components/text.tsx';

type MainScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Home'>;

interface MainScreenProps {
  navigation: MainScreenNavigationProp;
}

function MainScreen({ navigation } : MainScreenProps): React.JSX.Element {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);

  const handleStBt = async () => {
    const isTokenExpired = (token: string): boolean => {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 변환
      return decoded.exp < currentTime; // 만료 여부 확인
    };
    try
    {
      const token = await AsyncStorage.getItem('userToken');

      if (token)
      {
        console.log('토큰이 존재합니다:', token);

        if (!isTokenExpired(token))
        {
          console.log('토큰이 유효합니다.');
          navigation.navigate('Main');
        }
        else
        {
          console.log('토큰이 만료되었습니다.');
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userInfo');
          navigation.navigate('Login');
        }
      }
      else
      {
        console.log('토큰이 없습니다, 로그인 페이지로 이동합니다');
        navigation.navigate('Login');
      }
    }
    catch (error)
    {
      console.error('토큰 검증 중 오류 발생:', error);
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('Login'); // 오류가 발생할 경우 로그인 페이지로 이동
    }
  };

  return (
    <SafeAreaView style = {styles.basic}>
      <ScrollView style = {styles.scrollContainer} contentContainerStyle = {styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.titlecontainer}>
          <Mt title = "독(讀)한 녀석들" titleStyle = {styles.title}/>
        </View>
        <View style={styles.btncontainer}>
          <Bb title = "시작하기" onPress = {handleStBt} btnStyle = {styles.startButton} screenWidth={width}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MainScreen;
