/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
/* import messaging from '@react-native-firebase/messaging'; */

/* messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('백그라운드에서 메시지를 처리했습니다:', remoteMessage);
});

messaging().onNotificationOpenedApp(remoteMessage => {
  console.log('앱이 백그라운드에서 푸시 알림을 클릭했을 때:', remoteMessage);
  // 여기서 네비게이션 등을 통해 원하는 화면으로 이동
});

// 앱 종료 상태에서 푸시 알림 클릭 시 처리
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log('앱이 종료된 상태에서 푸시 알림을 클릭했을 때:', remoteMessage);
      // 여기서 네비게이션 등을 통해 원하는 화면으로 이동
    }
  }); */

AppRegistry.registerComponent(appName, () => App);
