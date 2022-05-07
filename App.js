import React from 'react';
import { Provider } from 'react-redux';
import { View, StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { I18nextProvider, translate } from 'react-i18next';
import { withNetworkConnectivity } from "react-native-offline";
import { PersistGate } from "redux-persist/integration/react";

import Index from './src/scenes';
import styles, { COLOR } from './src/styles';
import { store, persistor } from './src/store';
import { i18n } from './src/utilities';

const App = withNetworkConnectivity({
  withRedux: true
})(Index);

const AppContainer = createAppContainer(App);

const ReloadAppOnLanguageChange = translate('translation', {
  bindI18n: 'languageChanged',
  bindStore: false
})( () =>
  <View style={styles.f1}>
    <StatusBar 
      // barStyle = "dark-content" 
      hidden = {false} 
      backgroundColor = {COLOR.APP}
      // translucent = {true}
    />
    <AppContainer />
  </View>
);

// The entry point using a react navigation stack navigation
// gets wrapped by the I18nextProvider enabling using translations
// https://github.com/i18next/react-i18next#i18nextprovider
export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <I18nextProvider i18n={ i18n }>
        <ReloadAppOnLanguageChange />
      </I18nextProvider>
    </PersistGate>
  </Provider>
)

// ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
// android: 'Double tap R on your keyboard to reload, \n' + Shake or press menu button for dev menu'