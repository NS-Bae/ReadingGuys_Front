import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { moderateScale } from 'react-native-size-matters';

import { UserInfo } from '../types';
import { loadTextFile } from '../utils/handleWorkbookFile';


interface OtherModalComponentProps
{
  isModalVisible: boolean;
  onClose: () => void;
  userInfo: UserInfo;
  modalKey: string;
}

const OtherModal: React.FC<OtherModalComponentProps> = ({ isModalVisible, onClose, userInfo, modalKey }) => {
  const [data, setData] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let fileTag = '';
  let modalType = '';

  switch(modalKey)
  {
    case 'credits': fileTag = 'Credit'; modalType = 'normal'; break;
    case 'legal': fileTag = 'Terms'; modalType = 'normal'; break;
    case 'pi': fileTag = 'Policy of Handling Personal Information'; modalType = 'normal'; break;
    case 'about': fileTag = 'Business Information'; modalType = 'normal'; break;
    case 'agree_legal': fileTag = 'Terms'; modalType = 'agreement'; break;
    case 'agree_pi': fileTag = 'Policy of Handling Personal Information'; modalType = 'agreement'; break;
    default : fileTag = ''; break;
  }
  useEffect(() => {
    (async () => {
      if(fileTag === '')
      {
        return;
      }

      try
      {
        setIsLoading(true);
        if(fileTag)
        {
          const fileData = await loadTextFile(fileTag);
          if(fileData !== null)
          {
            setData(fileData);
          }
        }
      }
      catch(error)
      {
        console.error('파일 로드 실패:', error);
      }
      finally
      {
        setIsLoading(false);
      }
    })();
  }, [fileTag]);

  console.log(modalKey, userInfo);
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
            <ScrollView>
              <Text style={styles.infoText}>{data}</Text>
            </ScrollView>
          ) : (
            <Text style={styles.infoText}>불러올 파일이 없습니다.</Text>
          )}
        </View>
        { modalType === 'agreement' && (
          <View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>동의합니다</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>동의하지 않습니다.</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default OtherModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    maxWidth: 1000,
    width: '90%',
    padding: 20,
    borderRadius: 10,
  },
  infoArea: {
    flex: 1,
    width: '96%',
    marginTop: moderateScale(25),
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 10,
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
  infoText: {
    fontSize: moderateScale(20),
  },
});
