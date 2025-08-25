import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

interface RecordModalComponentProps
{
  isModalVisible: boolean;
  recordLink: string;
  onClose: () => void;
}

const RecordModal: React.FC<RecordModalComponentProps> = ({ isModalVisible, recordLink, onClose }) => {

  useEffect(() => {
    if(!recordLink)
    {
      return;
    }

  }, [recordLink]);

  return (
    <Modal
      isVisible={isModalVisible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.5}
      onBackdropPress={onClose}
    >
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>닫기</Text>
      </TouchableOpacity>
      <View style={styles.modalBox}>
        <Text>Hello! This is a Modal</Text>
      </View>
    </Modal>
  );
};

export default RecordModal;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    alignItems: 'flex-end',
    marginEnd: 20,
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'black',
  },
});
