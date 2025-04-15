// App.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
/* import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { PermissionsAndroid, Alert } from 'react-native';
import notifee, { AndroidImportance, AndroidVisibility, EventType } from '@notifee/react-native';
 */
import HomeScreen from './screens/homeScreen';
import LoginScreen from './screens/loginScreen';
import MainScreen from './screens/mainScreen2';
import CheckRecordScreen from './screens/fullScreen_CheckRecord.tsx';
import ExamScreen from './screens/examScreen';/*
import api from './api'; */

import { StackParamList } from './types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Styles from './mainStyle.tsx';
import { useWindowDimensions } from 'react-native';

const Stack = createNativeStackNavigator<StackParamList>();

/* async function requestNotificationPermission() {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );

  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('Notification permission granted');
  } else {
    console.log('Notification permission denied');
  }
} */

const App: React.FC = () => {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);
  /* useEffect(() => {
    requestNotificationPermission();
    createNotificationChannel();
    requestPermission();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);

      // 포그라운드 상태에서 알림 표시
      await notifee.displayNotification({
        title: `<p style = "color: #4caf50;"><b>${remoteMessage.notification?.title}</b></p>`,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'update_workbook',
        },
      });
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'test',
        },
      });
    });

    return unsubscribe;
  }, []);
  useEffect(() => {
  // 포그라운드에서 푸시 알림을 클릭한 경우
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'update_workbook') {
      console.log('Notification clicked:', detail.notification);
      // 푸시 알림 클릭 시 수행할 작업
    }
  });
  }, []);

  //FCM기기토큰 설정
  const fetchDeviceToken = async () => {
    try
    {
      const deviceToken = await messaging().getToken();
      console.log('FCM Token : ', deviceToken);

      await sendTokenToServer(deviceToken);
    }
    catch(error)
    {
      console.log('FCM 토믄 생성 오류', error);
    }
  };
  //FCM푸시알림권한
  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled)
    {
      console.log('푸시 알림 권한 획득');
      fetchDeviceToken();
    }
    else
    {
      Alert.alert('알림 권한이 필요합니다.');
    }
  };
  // 알림 채널 생성
  const createNotificationChannel = async () => {
    try
    {
      await notifee.createChannelGroup({
        id: 'subscribe',
        name: 'Subscriber',
      });
      await notifee.createChannel({
        id: 'update_workbook',
        name: 'Update Monthly Workbook',
        groupId: 'subscribe',
        importance: AndroidImportance.DEFAULT,  // 중요도 설정
        visibility: AndroidVisibility.PUBLIC,   //알림 보이기 설정
      });
    }
    catch (error)
    {
      console.error('알림 채널 생성 오류', error);
    }
  };
  //FCM토큰 FCM서버전송 위해 Nest서버 토큰전송
  const sendTokenToServer = async (token: string) => {
    try
    {
      await api.post('/fb/tk', {
        token : token,
      });
      console.log('Token sent to server:');
    }
    catch (error)
    {
      console.error('Error sending token to server:', error);
    }
  }; */

  return (
    <GestureHandlerRootView style={styles.basic}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
          <Stack.Screen name="Main" component={MainScreen} initialParams={{ inputs: { ip1: '', ip2: '' } }} options={{headerShown: false}} />
          <Stack.Screen name="Record" component={CheckRecordScreen} options={{headerShown: false}} />
          <Stack.Screen name="Exam" component={ExamScreen} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
