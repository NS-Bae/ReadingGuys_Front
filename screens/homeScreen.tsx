import React from 'react';
import { SafeAreaView, ScrollView, View, useWindowDimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../types.tsx';

import { verifyAndHandleToken } from '../utils/userAsyncStorageFunction.tsx';

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
    const isTokenValid = await verifyAndHandleToken();
    console.log(isTokenValid);
    if(!isTokenValid)
    {
      navigation.navigate('Login');
    }
    else
    {
      navigation.navigate('Main');
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
