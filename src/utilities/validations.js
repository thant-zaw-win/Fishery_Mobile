import { Platform } from 'react-native';
import { i18next } from 'i18next';

export const isAndroid = () => Platform.OS === 'android';

export const isIos = () => Platform.OS === 'ios';

export const isEng = () => i18next.language === 'en';

export function isFunction(func) {
  return func && typeof func === 'function';
}