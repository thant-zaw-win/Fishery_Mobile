import en from './locales/en';
import my from './locales/my';
import i18n from 'i18next';

i18n.init({
  fallbackLng: 'en',
  lng: 'en',
  debug: true,
  resources: {
    en: {
      translation: en
    },
    my: {
      translation: my
    }
  },

  react: {
    wait: false, // set to true if you like to wait for loaded in every translated hoc
    nsMode: 'default' // set it to fallback to let passed namespaces to translated hoc act as fallbacks
  }
});

export default i18n;
