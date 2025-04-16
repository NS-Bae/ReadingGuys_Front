import React from 'react';
import { Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

interface DrawerContentProps {
  toggleTestDrawer: (i: number) => void;
  toggleCloseDrawer: () => void;
  fileNames: string[];
}

const DrawerContent: React.FC<DrawerContentProps> = ({ toggleTestDrawer, toggleCloseDrawer, fileNames }) => {
  return (
    <SafeAreaView  style={styles.drawerContent}>
      <ScrollView style={styles.topPlace}>
        <Text style={styles.drawerHeadText}>시험 리스트</Text>
        {Array.from({ length: fileNames.length }, (_, i) => (
          <TouchableOpacity key={i} onPress={() => toggleTestDrawer(i)} style={styles.contentButton}>
            <Text style={styles.drawerText}>{fileNames[i]}</Text>
          </TouchableOpacity>
        ))}
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
    fontSize: 25,
    color: '#fff',
    marginLeft: 10,
  },
  closeButtonText: {
    fontSize: 30,
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
