// CustomAlert.tsx
import React from 'react';
import { Alert } from 'react-native';

interface CaProps {
  title: string;
  message: string;
  onConfirm: () => void; // 확인 버튼 클릭 시 호출될 함수
}

const Ca: React.FC<CaProps> = ({ title, message, onConfirm }) => {
  const showAlert = () => {
    Alert.alert(
      title,
      message,
      [{ text: 'Ok', onPress: onConfirm }],
      { cancelable: false }
    );
  };

  return (
    <>
      {showAlert()}
    </>
  );
};

export default Ca;
