import React from 'react';
import { Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';

interface DrawerContentProps {
  toggleTestDrawer: (i: number) => void;
  toggleCloseDrawer?: () => void;
  fileNames: string[];
  screenType: string;
}

const DrawerContent: React.FC<DrawerContentProps> = ({ toggleTestDrawer, toggleCloseDrawer, fileNames, screenType }) => {
  return (
    <SafeAreaView style={styles.drawerContent}>
      <ScrollView style={styles.topPlace}>
        <Text style={styles.drawerHeadText}>시험 리스트</Text>
        {Array.from({ length: fileNames.length + 1 }, (_, i) => (
          <TouchableOpacity key={i} onPress={() => toggleTestDrawer(i)} style={styles.contentButton}>
            { i < fileNames.length ?
              (<Text style={styles.drawerText}>{fileNames[i]}</Text>) :
              (<Text style={styles.drawerText}>{i + 1}. 시험 종료</Text>)}
          </TouchableOpacity>
        ))}
      </ScrollView >
      { screenType === 'full' &&
        <TouchableOpacity key="close" onPress={toggleCloseDrawer} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>닫기</Text>
        </TouchableOpacity>
      }
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
