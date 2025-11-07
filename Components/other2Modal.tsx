import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { moderateScale } from 'react-native-size-matters';
import { useEffect, useState } from 'react';

import { getMyInfo } from '../utils/authFunction';
import { decryptedUserInfo } from '../types';
import InfoTable from './infoTable.tsx';

interface OtherModalComponentProps
{
  isModalVisible: boolean;
  onClose: () => void;
}

const Other2Modal: React.FC<OtherModalComponentProps> = ({ isModalVisible, onClose }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<decryptedUserInfo | null>();

  useEffect(() => {
    (async () => {
      try
      {
        setIsLoading(true);
        const infoData = await getMyInfo();
        if(infoData)
        {
          setData(infoData);
        }
      }
      catch(error)
      {
        console.error('정보 처리 실패:', error);
      }
      finally
      {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <Modal
      isVisible={isModalVisible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.5}
      onBackdropPress={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>닫기</Text>
        </TouchableOpacity>
        <View style={styles.infoArea}>
          {isLoading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : data ? (
            <InfoTable info={data} />
          ) : (
            <Text>불러올 데이터가 없습니다.</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default Other2Modal;

const styles = StyleSheet.create({
  container: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    maxWidth: 1000,
    width: '90%',
    height: 'auto',
    padding: 20,
    borderRadius: 10,
    position: 'relative',
  },
  infoArea: {
    width: '100%',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 9999,
    elevation: 5,
    padding: 4,
  },
  closeButtonText: {
    fontSize: moderateScale(15),
    color: 'black',
  },
  correct: {
    backgroundColor: '#d4edda',
  },
  incorrect: {
    backgroundColor: '#f8d7da',
  },
});
