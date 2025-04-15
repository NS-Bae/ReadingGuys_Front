import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';

interface Book {
  Difficulty: string;
  storageLink: string;
  workbookId: string;
  workbookName: string;
}
interface Records {
  ExamDate: string;
  ProgressRate: string;
  RecordLink: string;
  WorkbookName: string;
  examDate: string;
}
interface CustomBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  sK: Book | null;
  recordList: Records[];
  recordCount: number;
  latestPoint: string;
  movePage: (value: string) => void;
}

const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({ isVisible, onClose, sK, recordList, recordCount, latestPoint, movePage }) => {
  const { height } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const initialHeight = height * 0.28;
  const modalRef = useRef<Modalize>(null);

  useEffect(() => {
    if (isVisible) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [isVisible]);
  const handleGoExam = () => {
    const value = 'exam';
    movePage(value);
  };
  const handleRecord = () => {
    console.log('record');
    const value = 'record';
    movePage(value);
  };

  if(!sK)
  {
    return null;
  }

  return (
    <Modalize
      ref={modalRef}
      onClosed={onClose}
      modalHeight={initialHeight}
      modalStyle={exclusiveStyles.modal}
    >
      <View style={exclusiveStyles.basic}>
        <TouchableOpacity style={exclusiveStyles.closeButton} onPress={onClose}>
          <Text style={exclusiveStyles.closeButtonText}>닫기</Text>
        </TouchableOpacity>
        <View style={exclusiveStyles.container}>
          <Text style={exclusiveStyles.text}>책 이름 : {sK.workbookName}</Text>
          <Text style={exclusiveStyles.text}>책 난이도 : {sK.Difficulty}</Text>
          <Text style={exclusiveStyles.text}>가장 최근 점수 : {latestPoint}점</Text>
          <Text style={exclusiveStyles.text}>응시 횟수 : {recordCount}</Text>
        </View>
        <View style={exclusiveStyles.fixedBottomButtons}>
          <TouchableOpacity style={exclusiveStyles.exanButton} onPress={handleGoExam}>
            <Text style={exclusiveStyles.examButtonText}>시험 보러 가기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={exclusiveStyles.exanButton} onPress={handleRecord} disabled={recordList.length === 0} >
            <Text style={exclusiveStyles.examButtonText}>지난 시험 보기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modalize>
  );
};

const exclusiveStyles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  basic: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 22,
    color: 'black',
  },
  closeButton: {
    alignItems: 'flex-end',
    marginEnd: 20,
    marginTop: 10,
  },
  fixedBottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  exanButton: {
    alignItems: 'center',
    fontSize: 20,
  },
  examButtonText: {
    fontSize: 25,
    color: 'black',
  },
  closeButtonText: {
    fontSize: 18,
    color: 'black',
  },
});

export default CustomBottomSheet;
