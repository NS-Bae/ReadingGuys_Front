import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import SideDrawer from 'react-native-side-drawer';

import Styles from '../mainStyle.tsx';
import DrawerContent from './sideBarComponent.tsx';

interface ExamFullScreenProps
{
  fileNames: string[];
  fileContents: string[];
}

const ExamFullScreen: React.FC<ExamFullScreenProps> = ({ fileNames, fileContents }) => {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);

  const [isOpen, setIsOpen] = useState(false);
  const [renderQuestionNumber, setRenderQuestionNumber] = useState<number>(0);

  const toggleOpenDrawer = () => {
    console.log('open');
    setIsOpen(!isOpen);
  };
  const toggleTestDrawer = (i: number) => {
    setRenderQuestionNumber(i);
    setIsOpen(!isOpen);
  };
  const toggleCloseDrawer = () => {
    console.log('close');
    setIsOpen(!isOpen);
  };

  return (
    <ScrollView style={styles.basic}>
      <SideDrawer
        open={!isOpen}
        drawerContent={<DrawerContent toggleTestDrawer={toggleTestDrawer} toggleCloseDrawer={toggleCloseDrawer} fileNames={fileNames} />}
        drawerPercentage={45}
        animationTime={500}
        overlay={true}
      />
      <View style={exclusiveStyles.container}>
        <TouchableOpacity style={exclusiveStyles.burgerButton} onPress={toggleOpenDrawer}>
          <Text style={exclusiveStyles.buergerButtonText}>☰</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.titlecontainer}>
        <Text>
          {fileContents[renderQuestionNumber]}
        </Text>
      </View>
    </ScrollView>
  );
};

export default ExamFullScreen;

const exclusiveStyles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    paddingLeft: 20,
    paddingTop: 10,
  },
  burgerButton: {
    alignItems: 'center',
    width: 40,
    borderRadius: 5,
  },
  buergerButtonText: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    width: 'auto',
  },
});
