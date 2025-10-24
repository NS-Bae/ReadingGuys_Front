import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet, Platform, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { moderateScale } from 'react-native-size-matters';
import RNFS from 'react-native-fs';

import { UserInfo } from '../types';


interface OtherModalComponentProps
{
  isModalVisible: boolean;
  onClose: () => void;
  userInfo: UserInfo;
  modalKey: string;
}

const OtherModal: React.FC<OtherModalComponentProps> = ({ isModalVisible, onClose, userInfo, modalKey }) => {
  const [data, setData] = useState<string | null>('');

  useEffect(() => {
    let fileTag = '';
    switch(modalKey)
    {
      case 'credits': fileTag = 'Credit'; break;
      case 'legal': fileTag = 'Terms'; break;
      case 'pi': fileTag = 'Policy of Handling Personal Information'; break;
      case 'about': fileTag = 'Business Information'; break;
      default : fileTag = ''; break;
    }
    if(fileTag)
    {
      loadTextFile(fileTag);
    }
  }, [modalKey]);
  const loadTextFile = async (fileName: string) => {
    try
    {
      let path = '';
      if(Platform.OS === 'ios')
      {
        path = `${RNFS.MainBundlePath}/${fileName}.txt`;
        const fileData = await RNFS.readFile(path, 'utf8');
        setData(fileData);
      }
      else
      {
        const assetName = `txtfile/${fileName}.txt`;
        const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}.txt`;

        await RNFS.copyFileAssets(assetName, localPath);
        const fileData = await RNFS.readFile(localPath, 'utf8');
        setData(fileData);
      }
    }
    catch(error)
    {
      console.error('파일 읽기 실패:', error);
      setData('파일을 불러올 수 없습니다.');
    }
  };
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
        {data === null ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <ScrollView>
              <Text style={{ fontSize: 16, lineHeight: 24 }}>{data}</Text>
            </ScrollView>
          )}
        </View>
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
  infoTitileZone: {
    flex: 1,
    width: '100%',
    marginVertical: 10,
  },
  correct: {
    backgroundColor: '#d4edda',
  },
  incorrect: {
    backgroundColor: '#f8d7da',
  },
  infoTitileText:
  {
    fontSize: moderateScale(23),
    textAlign: 'center',
    fontWeight: 700,
  },
  infoZone: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  infoText: {
    fontSize: moderateScale(20),
  },
});
