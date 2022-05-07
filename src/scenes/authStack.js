import { createStackNavigator } from 'react-navigation';

import Login from './login/login';
import Signup from './signup/signup';
import Welcome from './welcome/welcome';

import { nullHeader } from '../components';
import { WELCOME, LOGIN, SIGN_UP, NavOptions } from '../utilities';

const ROUTE_CONFIG = {
  // [WELCOME]: {
  //   screen: Welcome,
  //   navigationOptions: nullHeader
  // },
  [LOGIN]: {
    screen: Login,
    navigationOptions: nullHeader,
  },
  // [SIGN_UP]: {
  //   screen: Signup,
  //   navigationOptions: NavOptions(SIGN_UP)
  // },
};
const STACK_NAVIGATOR_CONFIG = {
  initialRouteName: LOGIN,
};

export default createStackNavigator(ROUTE_CONFIG, STACK_NAVIGATOR_CONFIG);
