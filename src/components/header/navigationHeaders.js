import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles, { COLOR } from '../../styles';
import Icon from '../icon';

export const nullHeader = { header: null };

export const MenuIcon = ({ navigation }) => {
  return (
    <TouchableOpacity style={[styles.ph16, styles.pv5]} onPress={() => navigation.openDrawer()}>
      <Icon name={'menu'} color={COLOR.WHITE} size={30} />
    </TouchableOpacity>
  );
};

export const BackIcon = ({ navigation }) => {
  return (
    <TouchableOpacity style={[styles.ph16, styles.pv5]} onPress={() => navigation.goBack()}>
      <Icon name={'arrow-back'} color={COLOR.WHITE} size={30} />
    </TouchableOpacity>
  );
};

export const SubmitButton = ({ navigation, text, action }) => {
  // const { params } = navigation.state
  return (
    <TouchableOpacity style={[styles.ph16, styles.pv5]} onPress={navigation.getParam(action)}>
      <Text style={[styles.cWhite, styles.bold, styles.fontLight20]} >{text}</Text>
    </TouchableOpacity>
  );
};

// export const ConfirmText = ({ navigation }) => {
//   return (
//     <TouchableOpacity style={[styles.ph16, styles.pv5]} onPress={() => navigation.goBack()}>
//       <Text style={[styles.cWhite, styles.bold, styles.fontLight20]} >text</Text>
//     </TouchableOpacity>
//   );
// };
