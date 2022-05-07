import { Dimensions, StyleSheet, PixelRatio } from 'react-native';
import { isIos } from '../utilities';
import { widthPercentageToDP, heightPercentageToDP } from '../utilities';
/* Device Screen Size */
const { width, height } = Dimensions.get('window');
export { height, width };

/* Custom Color */
export const COLOR = {
  WHITE: '#FFF',
  BLACK: '#000',
  RED: '#D50000',
  BLUE: '#2196f3',
  GREEN: '#00ff00',
  LIGHT_BLUE: '#3A9BF3',
  LIGHT_GREY: '#F1F1F1',
  GREY: '#9D9D9D',
  // APP: '#2d2d2d',
  // APP_DARK: '#1d1d1d',
  APP: '#00ccff',
  APP_DARK: '#1d1d1d',
  TRANSPARENT: 'transparent',
};

/* Created Styles */
export default styles = StyleSheet.create({
  sceneContainer: {
    flex: 1,
    backgroundColor: COLOR.LIGHT_GREY,
    // paddingTop: isIos() ? 40 : 20,
  },

  whUndefined: { width: undefined, height: undefined },

  w25: { width: 25 },
  w50: { width: 50 },
  w55: { width: 55 },
  w60: { width: 60 },
  w70: { width: 70 },
  w80: { width: 80 },
  w100: { width: 100 },
  w120: { width: 120 },
  w150: { width: 150 },
  w170: { width: 170 },
  w200: { width: 200 },
  w250: { width: 250 },
  w280: { width: 280 },
  w300: { width: 300 },
  w320: { width: 320 },
  wMax: { width: width - 30 },
  wFull: { width: width },

  h20: { height: 20 },
  h30: { height: 30 },
  h35: { height: 35 },
  h40: { height: 40 },
  h45: { height: 45 },
  h50: { height: 50 },
  h55: { height: 55 },
  h60: { height: 60 },
  h70: { height: 70 },
  h80: { height: 80 },
  h100: { height: 100 },
  h115: { height: 115 },
  h120: { height: 120 },
  h140: { height: 140 },
  h150: { height: 150 },
  h180: { height: 180 },
  h200: { height: 200 },
  h250: { height: 250 },
  h300: { height: 300 },
  h350: { height: 350 },
  h600: { height: 600 },
  hMax: { height: height },

  m0: { margin: 0 },
  m2: { margin: 2 },
  m5: { margin: 5 },
  m10: { margin: 10 },
  m15: { margin: 15 },
  m20: { margin: 20 },
  m25: { margin: 25 },
  m30: { margin: 30 },

  mh0: { marginHorizontal: 0 },
  mh5: { marginHorizontal: 5 },
  mh10: { marginHorizontal: 10 },
  mh15: { marginHorizontal: 15 },
  mh20: { marginHorizontal: 20 },
  mh25: { marginHorizontal: 25 },
  mh30: { marginHorizontal: 30 },

  mv0: { marginVertical: 0 },
  mv1: { marginVertical: 1 },
  mv2: { marginVertical: 2 },
  mv5: { marginVertical: 5 },
  mv8: { marginVertical: 8 },
  mv10: { marginVertical: 10 },
  mv15: { marginVertical: 15 },
  mv20: { marginVertical: 20 },
  mv25: { marginVertical: 25 },
  mv30: { marginVertical: 30 },
  mv35: { marginVertical: 35 },
  mv40: { marginVertical: 40 },
  mv45: { marginVertical: 45 },

  mt0: { marginTop: 0 },
  mt2: { marginTop: 2 },
  mt3: { marginTop: 3 },
  mt5: { marginTop: 5 },
  mt10: { marginTop: 10 },
  mt15: { marginTop: 15 },
  mt20: { marginTop: 20 },
  mt25: { marginTop: 25 },
  mt30: { marginTop: 30 },
  mt35: { marginTop: 35 },
  mt40: { marginTop: 40 },
  mt65: { marginTop: 65 },
  mt100: { marginTop: 100 },

  mb0: { marginBottom: 0 },
  mb2: { marginBottom: 2 },
  mb3: { marginBottom: 3 },
  mb5: { marginBottom: 5 },
  mb10: { marginBottom: 10 },
  mb15: { marginBottom: 15 },
  mb20: { marginBottom: 20 },
  mb25: { marginBottom: 25 },
  mb30: { marginBottom: 30 },
  mb35: { marginBottom: 35 },
  mb40: { marginBottom: 40 },
  mb45: { marginBottom: 45 },

  ml0: { marginLeft: 0 },
  ml5: { marginLeft: 5 },
  ml10: { marginLeft: 10 },
  ml15: { marginLeft: 15 },
  ml20: { marginLeft: 20 },

  mr0: { marginRight: 0 },
  mr5: { marginRight: 5 },
  mr10: { marginRight: 10 },
  mr15: { marginRight: 15 },
  mr20: { marginRight: 20 },

  p0: { padding: 0 },
  p2: { padding: 2 },
  p5: { padding: 5 },
  p8: { padding: 8 },
  p10: { padding: 10 },
  p15: { padding: 15 },
  p20: { padding: 20 },
  p30: { padding: 30 },

  ph0: { paddingHorizontal: 0 },
  ph2: { paddingHorizontal: 2 },
  ph4: { paddingHorizontal: 4 },
  ph5: { paddingHorizontal: 5 },
  ph10: { paddingHorizontal: 10 },
  ph12: { paddingHorizontal: 12 },
  ph15: { paddingHorizontal: 15 },
  ph16: { paddingHorizontal: 16 },
  ph20: { paddingHorizontal: 20 },
  ph24: { paddingHorizontal: 24 },
  ph25: { paddingHorizontal: 25 },
  ph30: { paddingHorizontal: 30 },

  pv0: { paddingVertical: 0 },
  pv2: { paddingVertical: 2 },
  pv5: { paddingVertical: 5 },
  pv8: { paddingVertical: 8 },
  pv10: { paddingVertical: 10 },
  pv12: { paddingVertical: 12 },
  pv15: { paddingVertical: 15 },
  pv16: { paddingVertical: 16 },
  pv20: { paddingVertical: 20 },
  pv24: { paddingVertical: 24 },
  pv25: { paddingVertical: 25 },
  pv30: { paddingVertical: 30 },
  pv35: { paddingVertical: 35 },
  pv40: { paddingVertical: 40 },
  pv45: { paddingVertical: 45 },
  pv50: { paddingVertical: 50 },
  pv55: { paddingVertical: 55 },

  pt0: { paddingTop: 0 },
  pt5: { paddingTop: 5 },
  pt10: { paddingTop: 10 },
  pt15: { paddingTop: 15 },
  pt20: { paddingTop: 20 },
  pt25: { paddingTop: 25 },
  pt30: { paddingTop: 30 },
  pt35: { paddingTop: 35 },
  pt40: { paddingTop: 40 },

  pb0: { paddingBottom: 0 },
  pb5: { paddingBottom: 5 },
  pb2: { paddingBottom: 2 },
  pb10: { paddingBottom: 10 },
  pb15: { paddingBottom: 15 },
  pb25: { paddingBottom: 25 },
  pb30: { paddingBottom: 30 },
  pb32: { paddingBottom: 32 },
  pb35: { paddingBottom: 35 },
  pb40: { paddingBottom: 40 },
  pb45: { paddingBottom: 45 },
  pb50: { paddingBottom: 50 },
  pb70: { paddingBottom: 70 },

  pl0: { paddingLeft: 0 },
  pl5: { paddingLeft: 5 },
  pl10: { paddingLeft: 10 },
  pl15: { paddingLeft: 15 },
  pl20: { paddingLeft: 20 },
  pl25: { paddingLeft: 25 },
  pl30: { paddingLeft: 30 },

  pr0: { paddingRight: 0 },
  pr2: { paddingRight: 2 },
  pr3: { paddingRight: 3 },
  pr5: { paddingRight: 5 },
  pr10: { paddingRight: 10 },
  pr15: { paddingRight: 15 },
  pr20: { paddingRight: 20 },
  pr55: { paddingRight: 55 },

  opacity100: { opacity: 1 },
  opacity95: { opacity: 0.95 },
  opacity90: { opacity: 0.9 },
  opacity40: { opacity: 0.4 },
  opacity0: { opacity: 0 },

  bold: { fontWeight: 'bold' },

  font10: { fontSize: PixelRatio.roundToNearestPixel(10) },
  font12: { fontSize: PixelRatio.roundToNearestPixel(12) },
  font13: { fontSize: PixelRatio.roundToNearestPixel(13) },
  font14: { fontSize: PixelRatio.roundToNearestPixel(14) },
  font16: { fontSize: PixelRatio.roundToNearestPixel(16) },
  font18: { fontSize: PixelRatio.roundToNearestPixel(18) },
  font20: { fontSize: PixelRatio.roundToNearestPixel(20) },
  font24: { fontSize: PixelRatio.roundToNearestPixel(24) },
  font26: { fontSize: PixelRatio.roundToNearestPixel(26) },
  font28: { fontSize: PixelRatio.roundToNearestPixel(28) },

  fontLight8: { fontSize: PixelRatio.roundToNearestPixel(8) },
  fontLight10: { fontSize: PixelRatio.roundToNearestPixel(10) },
  fontLight12: { fontSize: PixelRatio.roundToNearestPixel(12) },
  fontLight14: { fontSize: PixelRatio.roundToNearestPixel(14) },
  fontLight16: { fontSize: PixelRatio.roundToNearestPixel(16) },
  fontLight18: { fontSize: PixelRatio.roundToNearestPixel(18) },
  fontLight20: { fontSize: PixelRatio.roundToNearestPixel(20) },
  fontLight22: { fontSize: PixelRatio.roundToNearestPixel(22) },
  fontLight24: { fontSize: PixelRatio.roundToNearestPixel(24) },
  fontLight26: { fontSize: PixelRatio.roundToNearestPixel(26) },
  fontLight28: { fontSize: PixelRatio.roundToNearestPixel(28) },
  fontLight30: { fontSize: PixelRatio.roundToNearestPixel(30) },

  fontRegular8: { fontSize: PixelRatio.roundToNearestPixel(8) },
  fontRegular10: { fontSize: PixelRatio.roundToNearestPixel(10) },
  fontRegular12: { fontSize: PixelRatio.roundToNearestPixel(12) },
  fontRegular14: { fontSize: PixelRatio.roundToNearestPixel(14) },
  fontRegular16: { fontSize: PixelRatio.roundToNearestPixel(16) },
  fontRegular18: { fontSize: PixelRatio.roundToNearestPixel(18) },
  fontRegular20: { fontSize: PixelRatio.roundToNearestPixel(20) },
  fontRegular22: { fontSize: PixelRatio.roundToNearestPixel(22) },
  fontRegular24: { fontSize: PixelRatio.roundToNearestPixel(24) },
  fontRegular28: { fontSize: PixelRatio.roundToNearestPixel(28) },

  fontMedium8: { fontSize: PixelRatio.roundToNearestPixel(8) },
  fontMedium10: { fontSize: PixelRatio.roundToNearestPixel(10) },
  fontMedium12: { fontSize: PixelRatio.roundToNearestPixel(12) },
  fontMedium14: { fontSize: PixelRatio.roundToNearestPixel(14) },
  fontMedium16: { fontSize: PixelRatio.roundToNearestPixel(16) },
  fontMedium18: { fontSize: PixelRatio.roundToNearestPixel(18) },
  fontMedium20: { fontSize: PixelRatio.roundToNearestPixel(20) },
  fontMedium22: { fontSize: PixelRatio.roundToNearestPixel(22) },
  fontMedium24: { fontSize: PixelRatio.roundToNearestPixel(24) },
  fontMedium26: { fontSize: PixelRatio.roundToNearestPixel(26) },
  fontMedium28: { fontSize: PixelRatio.roundToNearestPixel(28) },
  fontMedium30: { fontSize: PixelRatio.roundToNearestPixel(30) },
  fontMedium32: { fontSize: PixelRatio.roundToNearestPixel(32) },

  f1: { flex: 1 },
  f2: { flex: 2 },
  f3: { flex: 3 },
  f4: { flex: 4 },
  f5: { flex: 5 },
  f6: { flex: 6 },
  f7: { flex: 7 },
  f8: { flex: 8 },
  f9: { flex: 9 },
  f10: { flex: 10 },
  f11: { flex: 11 },
  f12: { flex: 12 },

  cBlack: { color: COLOR.BLACK },
  cBlue: { color: COLOR.BLUE },
  cLightBlue: { color: COLOR.LIGHT_BLUE },
  cWhite: { color: COLOR.WHITE },
  cGrey: { color: COLOR.GREY },
  cGreen: { color: COLOR.GREEN },
  cLightGrey: { color: COLOR.LIGHT_GREY },
  cRed: { color: COLOR.RED },
  cApp: { color: COLOR.APP },
  cAppDark: { color: COLOR.APP_DARK },

  bgTransparent: { backgroundColor: 'transparent' },
  bgWhiteTranslucent: { backgroundColor: 'rgba(255,255,255, 0.3)' },
  bgBlackTranslucent: { backgroundColor: 'rgba(0,0,0, 0.3)' },
  bgWhite: { backgroundColor: COLOR.WHITE },
  bgRed: { backgroundColor: COLOR.RED },
  bgBlue: { backgroundColor: COLOR.BLUE },
  bgLightBlue: { backgroundColor: COLOR.LIGHT_BLUE },
  bgLightGrey: { backgroundColor: COLOR.LIGHT_GREY },
  bgGrey: { backgroundColor: COLOR.GREY },
  bgGreen: { backgroundColor: COLOR.GREEN },
  bgApp: { backgroundColor: COLOR.APP },
  bgAppDark: { backgroundColor: COLOR.APP_DARK },

  textCenter: { textAlign: 'center' },
  textVCenter: { textAlignVertical: 'center' },
  textRight: { textAlign: 'right' },
  textLeft: { textAlign: 'left' },
  textUnderLine: { textDecorationLine: 'underline' },

  center: { justifyContent: 'center', alignItems: 'center' },
  aCenter: { alignItems: 'center' },
  aStart: { alignItems: 'flex-start' },
  aEnd: { alignItems: 'flex-end' },
  aSpace: { justifyContent: 'space-between' },
  jCenter: { justifyContent: 'center' },
  jEnd: { justifyContent: 'flex-end' },
  jStart: { justifyContent: 'flex-start' },
  jSpace: { justifyContent: 'space-between' },
  jSpaceAround: { justifyContent: 'space-around' },
  flexRow: { flexDirection: 'row' },
  flexRowReverse: { flexDirection: 'row-reverse' },
  flexColumn: { flexDirection: 'column' },
  flexColumnReverse: { flexDirection: 'column-reverse' },

  right0: { position: 'absolute', right: 0 },
  right10: { position: 'absolute', right: 10 },
  right15: { position: 'absolute', right: 15 },
  right20: { position: 'absolute', right: 20 },

  rightTop5: { position: 'absolute', right: 5, top: 5 },
  rightTop10: { position: 'absolute', right: 10, top: 10 },
  rightTop15: { position: 'absolute', right: 15, top: 15 },
  rightTop20: { position: 'absolute', right: 20, top: 20 },

  rightTop_2: { position: 'absolute', right: -2, top: -2 },
  rightTop_5: { position: 'absolute', right: -5, top: -5 },
  rightTop_10: { position: 'absolute', right: -10, top: -10 },
  rightTop_15: { position: 'absolute', right: -15, top: -15 },
  rightTop_20: { position: 'absolute', right: -20, top: -20 },

  rightBottom0: { position: 'absolute', right: 0, bottom: 0 },
  rightBottom5: { position: 'absolute', right: 5, bottom: 5 },
  rightBottom10: { position: 'absolute', right: 10, bottom: 10 },
  rightBottom15: { position: 'absolute', right: 15, bottom: 15 },
  rightBottom20: { position: 'absolute', right: 20, bottom: 20 },

  absolute: { position: 'absolute' },

  l0: { left: 0 },
  l10: { left: 10 },
  l15: { left: 15 },
  l20: { left: 20 },
  l30: { left: 30 },
  l40: { left: 40 },

  r0: { right: 0 },
  r10: { right: 10 },
  r20: { right: 20 },
  r30: { right: 30 },
  r40: { right: 40 },

  t0: { top: 0 },
  t3: { top: 3 },
  t5: { top: 5 },
  t10: { top: 10 },
  t20: { top: 20 },
  t30: { top: 30 },
  t40: { top: 40 },
  t_5: { top: -5 },
  t_10: { top: -10 },
  t_15: { top: -15 },
  t_20: { top: -20 },
  t_25: { top: -25 },
  t_30: { top: -30 },
  t_40: { top: -40 },

  b0: { bottom: 0 },
  b10: { bottom: 10 },

  b_5: { bottom: -5 },
  b_10: { bottom: -10 },
  b_15: { bottom: -15 },
  b_20: { bottom: -20 },
  b_25: { bottom: -25 },

  bdRad0: { borderRadius: 0 },
  bdRad2: { borderRadius: 2 },
  bdRad3: { borderRadius: 3 },
  bdRad4: { borderRadius: 4 },
  bdRad5: { borderRadius: 5 },
  bdRad8: { borderRadius: 8 },
  bdRad10: { borderRadius: 10 },
  bdRad15: { borderRadius: 15 },
  bdRad20: { borderRadius: 20 },
  bdRad25: { borderRadius: 25 },
  bdRad30: { borderRadius: 30 },
  bdRad50: { borderRadius: 50 },

  circle12: {
    height: 12,
    width: 12,
    borderRadius: 12 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle14: {
    height: 14,
    width: 14,
    borderRadius: 14 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle16: {
    height: 16,
    width: 16,
    borderRadius: 16 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle18: {
    height: 18,
    width: 18,
    borderRadius: 18 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle20: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle25: {
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle30: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle35: {
    height: 35,
    width: 35,
    borderRadius: 35 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle40: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle45: {
    height: 45,
    width: 45,
    borderRadius: 45 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle50: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle60: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle70: {
    height: 70,
    width: 70,
    borderRadius: 70 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle75: {
    height: 75,
    width: 75,
    borderRadius: 75 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle80: {
    height: 80,
    width: 80,
    borderRadius: 80 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle90: {
    height: 90,
    width: 90,
    borderRadius: 90 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle100: {
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle120: {
    height: 120,
    width: 120,
    borderRadius: 120 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },

  triangleDown10: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 10,
    borderTopColor: COLOR.APP,
    borderLeftWidth: 10 / 2,
    borderLeftColor: 'transparent',
    borderRightWidth: 10 / 2,
    borderRightColor: 'transparent'
  },

  triangleDown20: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 20,
    borderTopColor: COLOR.APP,
    borderLeftWidth: 20 / 2,
    borderLeftColor: 'transparent',
    borderRightWidth: 20 / 2,
    borderRightColor: 'transparent'
  },

  squareUndefined: { width: undefined, height: undefined },
  square10: { width: 10, height: 10 },
  square20: { width: 20, height: 20 },
  square30: { width: 30, height: 30 },
  square40: { width: 40, height: 40 },
  square50: { width: 50, height: 50 },
  square60: { width: 60, height: 60 },
  square70: { width: 70, height: 70 },
  square80: { width: 80, height: 80 },
  square90: { width: 90, height: 90 },
  square100: { width: 100, height: 100 },

  clear: { height: 1, backgroundColor: COLOR.LIGHT_GREY, marginVertical: 2 },

  shadow2: {
    elevation: 2,
    shadowRadius: 1,
    shadowColor: 'black',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2
  },
  shadow4: {
    elevation: 4,
    shadowRadius: 1,
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2
  },

  headerStyle: {
    paddingTop: 15,
    height: 60,
    backgroundColor: COLOR.APP
  },
  headerTitleStyle: {
    color: COLOR.WHITE
  },

  // screen's styles
  loadingContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: COLOR.WHITE,
    alignItems: 'center',
    justifyContent: 'center'
  },

  inputStyle: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 4
  },
  
  btnStyle: {
    backgroundColor: COLOR.APP,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
    width: 280,
    borderRadius: 4
  },

  arrowUp: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: COLOR.TRANSPARENT,
    borderRightWidth: 10,
    borderRightColor: COLOR.TRANSPARENT,
    borderTopWidth: 10,
    borderBottomColor: COLOR.WHITE
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: COLOR.TRANSPARENT,
    borderRightWidth: 10,
    borderRightColor: COLOR.TRANSPARENT,
    borderTopWidth: 10,
    borderTopColor: COLOR.WHITE
  },
  arrowRight: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: COLOR.TRANSPARENT,
    borderBottomWidth: 10,
    borderBottomColor: COLOR.TRANSPARENT,
    borderLeftWidth: 10,
    borderLeftColor: COLOR.WHITE
  },
  arrowLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: COLOR.TRANSPARENT,
    borderBottomWidth: 10,
    borderBottomColor: COLOR.TRANSPARENT,
    borderRightWidth: 10,
    borderRightColor: COLOR.WHITE
  },
  
  // My Style
  profileCover:{
    backgroundColor: COLOR.APP_DARK,
    height:200,
  },

  profileAvatar: {
    width: 165,
    height: 165,
    borderRadius: 165/2,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 20,
    alignSelf:'center',
    position: 'absolute',
    marginTop: 130
  },
  
  // responsiveBox: {
  //   width: widthPercentageToDP(95.5),
  //   flexDirection: 'column',
  //   justifyContent: 'space-around' 
  // },

  container: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 30,
    padding: 15,
    borderRadius: widthPercentageToDP(3),
    backgroundColor: COLOR.WHITE
  },

  mapContainer: {
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  map: {
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
  },

  touchContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    height: 45,
    // flex: 1,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 200,
    borderRadius: 30,
    backgroundColor: COLOR.APP,
  },

});

/* Custom Style Format */
export const sty = (text) => {
  return text.trim().split(" ").map((prop) => styles[prop] );
}