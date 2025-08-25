import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';

import { ReadFileParams, UserInfo } from '../types';
import { readExamRecord } from '../utils/examFunction';

interface RecordModalComponentProps
{
  isModalVisible: boolean;
  recordLink: string;
  onClose: () => void;
  userInfo: UserInfo;
}

const RecordModal: React.FC<RecordModalComponentProps> = ({ isModalVisible, recordLink, onClose, userInfo }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!recordLink)
    {
      return;
    }
  }, [recordLink]);

  const uid = userInfo.id;
  const aid = userInfo.AcademyID;
  const formData: ReadFileParams = {
      uid,
      aid,
      recordLink,
    };
  useEffect(() => {
    const fetchData = async () => {
      try
      {
        const response = await readExamRecord( formData );
        setData(response);
      }
      catch(error)
      {
        console.error(error);
      }
      finally
      {
        setLoading(false);
      }
    };
    fetchData();
  });

  if(loading)
  {
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
            <ActivityIndicator size="large" color="blue" />
          </View>
        </View>
      </Modal>
    );
  }

  if(!data)
  {
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
            <Text>데이터를 불러올 수 없습니다.</Text>
          </View>
        </View>
      </Modal>
    );
  }

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
          <Text>Hello! This is a Modal</Text>
        </View>
      </View>
    </Modal>
  );
};

export default RecordModal;

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
    backgroundColor: 'red',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'black',
  },
});
