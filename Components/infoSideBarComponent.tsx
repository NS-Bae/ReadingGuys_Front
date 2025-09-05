import React from 'react';
import { Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';

interface DrawerContentProps {
  toggleCloseDrawer?: () => void;
}

const DrawerContent: React.FC<DrawerContentProps> = ({ toggleCloseDrawer }) => {
  return (
    <SafeAreaView style={styles.drawerContent}>
      <ScrollView style={styles.topPlace}>
        <TouchableOpacity key="info" onPress={toggleCloseDrawer} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>나의 정보</Text>
        </TouchableOpacity>
        <TouchableOpacity key="credits" onPress={toggleCloseDrawer} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Credits</Text>
        </TouchableOpacity>
        <TouchableOpacity key="legal" onPress={toggleCloseDrawer} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>약관</Text>
        </TouchableOpacity>
      </ScrollView >
      <TouchableOpacity key="close" onPress={toggleCloseDrawer} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>닫기</Text>
      </TouchableOpacity>
    </SafeAreaView >
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    width: '100%',
    backgroundColor: '#333',
    justifyContent: 'space-between',
  },
  topPlace: {

  },
  drawerHeadText: {
    fontSize: 30,
    color: '#fff',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  drawerText: {
    fontSize: moderateScale(20),
    color: '#fff',
    marginLeft: 10,
  },
  closeButtonText: {
    fontSize: moderateScale(20),
    color: '#fff',
    textAlign: 'center',
  },
  contentButton: {
    width: '100%',
    padding: 0,
    backgroundColor: '#555',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  closeButton: {
    width: '100%',
    padding: 0,
    marginBottom: 40,
  },
});
