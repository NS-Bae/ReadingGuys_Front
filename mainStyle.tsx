import { StyleSheet  } from 'react-native';

const styles = (width: number) => StyleSheet.create({
  //기본
  basic: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  scrollContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent1: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent2: {
    flexGrow: 1,
  },
  splitScreen: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },

  //메인 타이틀
  titlecontainer: {
    flexBasis: '40%',
    width: width,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flexBasis: 'auto',
    color: 'black',
    fontSize: width > 600 ? 130 : 75,
    fontFamily: '나눔손글씨 대한민국 열사체',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    margin: 0,
    padding: 0,
  },

  //버튼
  btncontainer: {
    flexBasis: '30%',
    width: width,
    margin: 0,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 100,
    fontFamily: '나눔손글씨 대한민국 열사체',
  },
  startButton: {
    flex: 1,
    width: width > 600 ? width * 0.5 : width * 0.7,
    padding: 0,
    margin: 0,
    backgroundColor: 'rgb(255, 166, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  BBText: {
    fontSize: width > 600 ? 70 : 60,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '나눔손글씨 대한민국 열사체',
    color: 'black',
    margin: 0,
    padding: 0,
  },
  tiContainer: {
    flexBasis: '30%',
    width: width,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  loginTi: {
    flexBasis: '25%',
    width: '50%',
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 10,
    margin: 10,
    padding: 0,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    width: width > 600 ? width * 0.5 : width * 0.7,
    padding: 0,
    margin: 0,
    backgroundColor: 'rgb(255, 166, 0)',
    borderRadius: 20,
  },

  tfContainer:{
    justifyContent: 'center',
    flexBasis: 'auto',
    alignItems: 'flex-start',
    width: '100%',
    height: 'auto',
    padding: 0,
    paddingBottom: 10,
    margin: 0,
    backgroundColor: '#98c9f4',
  },
  normal: {
    fontSize: width > 600 ? 40 : 30,
    textAlign: 'left',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: 'black',
    margin: 0,
    padding: 0,
  },
  small: {
    fontSize: width > 600 ? 25 : 20,
    textAlign: 'center',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    color: 'black',
    margin: 0,
    padding: 0,
  },
  manyBtnContainer: {
    flexBasis: 'auto',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  bTContainer: {
    flexBasis: 'auto',
    alignItems: 'center',
    maxWidth: width * 0.3,
  },
  imageButtonSet: {
    width: 80,
    height: 100,
    margin: 10,
  },

  //분할화면 테스트
  leftPanel: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#d0d0d0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
