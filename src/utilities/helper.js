import { Dimensions } from 'react-native';
import moment from 'moment';

export const widthPercentageToDP = (percent) => {
  const { width } = Dimensions.get('window');
  return width / 100 * percent;
}

export const heightPercentageToDP = (percent) => {
  const { height } = Dimensions.get('window');
  return height / 100 * percent;
}

export function copyArrayObjByNoRef(paramArrObj) { 
  let arrObj = [];
  paramArrObj = paramArrObj || [];
  for (var i = 0; i < paramArrObj.length; i++) {
    arrObj[i] = {};
    for (var prop in paramArrObj[i]) {
      arrObj[i][prop] = paramArrObj[i][prop];
    }
  }
  return arrObj;
}

export function dateFormatter(date) {
  if (date) {
    return moment(date).local().format("DD/MM/YYYY");
  }
  else {
    return '';
  }
}