import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { moderateScale } from 'react-native-size-matters';

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
  const [answerData, setAnswerData] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!recordLink)
    {
      return;
    }
  }, [recordLink]);

  const uid = userInfo.hashedUserId;
  const aid = userInfo.hashedAcademyId;

  useEffect(() => {
    const formData: ReadFileParams = {
      uid,
      aid,
      recordLink,
    };

    const fetchData = async () => {
      try
      {
        const response = await readExamRecord( formData );
        setData(response);
        setAnswerData(response.answer);
      }
      catch(error)
      {
        console.error('aaa', error);
      }
      finally
      {
        setLoading(false);
      }
    };
    fetchData();
  }, [aid, uid, recordLink]);

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
          <FlatList
            data={answerData}
            keyExtractor={(item) => item.questionNumber.toString()}
            renderItem={({ item }) => (
              <View style={[styles.infoTitileZone, item.isCorrect ? styles.correct : styles.incorrect]}>
                <Text style={styles.infoTitileText}>{item.question}</Text>
                <View style={styles.infoZone}>
                  <Text style={styles.infoText}>{item.isCorrect ? '⭕ 정답' : '❌ 오답'}</Text>
                  <Text style={styles.infoText}>{item.userAnswer || '미제출'}</Text>
                </View>
              </View>
            )}
          />
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
