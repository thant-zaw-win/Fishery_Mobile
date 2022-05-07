import React from 'react';
import { TouchableWithoutFeedback, View, Picker, Keyboard, Text, StyleSheet } from 'react-native';
import _ from 'lodash';
import i18next from 'i18next';

import styles, { COLOR } from '../../styles';
import { translate } from 'react-i18next';

class SETTING extends React.Component {
  state = {
    language: i18next.language,
  }

  _onPick(itemValue) {
    const { t } = this.props;
    this.setState({ language: itemValue });
    i18next.changeLanguage(itemValue)
    this.props.navigation.setParams({
      title: t('translation:setting')
    })
  }

  render() {
    const { t } = this.props;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.f1, styles.p10, styles.ph20, styles.flexColumn]}>

            {/* <Text style={[styles.cBlack]}>{t('translation:language')}</Text>
            <Picker
              selectedValue={this.state.language}
              style={[s.pickerStyle]}
              onValueChange={(itemValue, itemIndex) =>
                this._onPick(itemValue)
              }>
              <Picker.Item label={t('translation:english')} value="en" />
              <Picker.Item label={t('translation:myanmar')} value="my" />
            </Picker> */}
          
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const s = StyleSheet.create({
  pickerStyle: {  
    height: 50,  
    width: "60%",  
    color: 'black',  
    justifyContent: 'center',
    marginBottom: 10
  }  
})

export default translate()(SETTING);
