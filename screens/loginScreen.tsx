import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, useWindowDimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../types.tsx';

import { registTokenAndInfo } from '../utils/userAsyncStorageFunction.tsx';

import Bb from '../Components/btn.tsx';
import Styles from '../mainStyle.tsx';
import Mt from '../Components/text.tsx';
import Ti from '../Components/textinput.tsx';
import Ca from '../Components/alert.tsx';

import { NormalLogIn } from '../utils/authFunction.tsx';

type LoginScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}
interface ErrorResponse {
  message: string;
}

function LoginScreen({ navigation } : LoginScreenProps): React.JSX.Element {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);
  const [sfa, setSfa] = useState(false);
  const [ssa, setSsa] = useState(false);
  const [messgae, setMessage] = useState('');
  const [inputs, setInputs] = useState({
    ip1: '',
    ip2: '',
  });

  const handleAlertConfirm = () => {
    setSfa(false);
  };
  const handleAlertConfirm1 = () => {
    setSsa(false);
    navigation.navigate('Main');
  };
  const handleLogin = async () => {
    if(inputs.ip1.trim() !== '' && inputs.ip2.trim() !== '')
    {
      try
      {
        const response = await NormalLogIn(inputs);
        if(response.status === 201 )
        {
          setSsa(true);
          const token = response.data.accessToken;
          const userInfo = response.data.userInfo;
          await registTokenAndInfo(token, userInfo);
        }
        else
        {
          console.log(inputs, '실패');
          setSfa(true);
        }
      }
      catch (error)
      {
        const axiosError = error as AxiosError;

        if (axiosError.response)
        {
          console.log('Error data:', axiosError.response.data);
          console.log('Error status:', axiosError.response.status);
          console.log('Error headers:', axiosError.response.headers);
          const eMessage = (axiosError.response?.data as ErrorResponse)?.message || '오류발생';
          setMessage(eMessage);
        }
        else if (axiosError.request)
        {
          console.log('No response received:', axiosError.request, inputs);
        }
        else
        {
          console.log('Error:', axiosError.message);
        }
        setSfa(true);
      }
    }
    else
    {
      console.log(inputs, '실패');
      setSfa(true);
    }
  };
  const handleInputText = (key : string, value : string) => {
    setInputs(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <SafeAreaView style = {styles.basic}>
      <ScrollView style = {styles.scrollContainer} contentContainerStyle = {styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.titlecontainer}>
          <Mt title = "독(讀)한 녀석들" titleStyle = {styles.title}/>
        </View>
        <View style = {styles.tiContainer}>
          <Ti value={inputs.ip1}  style = {styles.loginTi} placeholder="id" onChangeText={(text) => handleInputText('ip1', text)} />
          <Ti value={inputs.ip2} style = {styles.loginTi} placeholder="password" secureTextEntry = {true} onChangeText={(text) => handleInputText('ip2', text)} />
        </View>
        <View style={styles.btncontainer}>
          <Bb title = "로그인" onPress = {handleLogin} btnStyle = {styles.loginButton} screenWidth={width}/>
        </View>
      </ScrollView>
      {sfa && <Ca title = "로그인 에러" message = {messgae} onConfirm = {handleAlertConfirm} />}
      {ssa && <Ca title = "로그인 성공" message = "환영합니다!" onConfirm = {handleAlertConfirm1} />}
    </SafeAreaView>
  );
}

export default LoginScreen;
