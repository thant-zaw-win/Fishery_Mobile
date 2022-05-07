import { Dimensions } from 'react-native';
import config from './config';
import * as Api from './api';
import * as Storage from './storage';
import i18n from './i18n/index';
const { width, height } = Dimensions.get('window');
export { width, height, Api, Storage, i18n, config };
export * from './helper';
export * from './validations';
export * from './constants';
export * from './navigationService';



