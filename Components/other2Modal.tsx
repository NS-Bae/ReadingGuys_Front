import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { moderateScale } from 'react-native-size-matters';

import { UserInfo } from '../types';

interface OtherModalComponentProps
{
  isModalVisible: boolean;
  onClose: () => void;
  userInfo: UserInfo;
}

const Other2Modal: React.FC<OtherModalComponentProps> = ({ isModalVisible, onClose, userInfo }) => {
  console.log(userInfo);
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
};

export default Other2Modal;

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
