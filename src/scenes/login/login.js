import React from 'react';
import { Keyboard, Text, Alert, TouchableOpacity, TouchableWithoutFeedback, View, Image, ScrollView, TextInput } from 'react-native';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import i18next from 'i18next';

import { Icon, Input, Loading, NetworkStatusBanner } from '../../components';
import styles, { COLOR } from '../../styles';
import { APP_STACK, Api } from '../../utilities';
import { setLoggedinUser } from '../../store/actions';

class Login extends React.Component {
  state = { 
    isLoading: false,
    errors: {
      usernameError: '',
      passwordError: ''
    },

    username: '', 
    password: '',
  };

  willUnmount = false;
  
  componentWillUnmount() {
    this.willUnmount = true
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
  }

  getNewDimensions = (event) => {
    this.setState({
      inputWidth: event.nativeEvent.layout.width / 100 * 85 // Dynamic Width
    });
  }

  onLogin = async () => {   
    const { username, password } = this.state;
    if(this._validate(username, password)) return;

    this.setState({ isLoading: true });
    const res = await Api.post('/api/user/login', { UserID: username, password });

    if(!res.status) return this.setState({ isLoading: false }, () => Alert.alert('Error', res.message || "User name or Password is incorrect.") );

    this.props.setLoggedinUser(res.data);
    this.setState({ isLoading: false }, () => this.props.navigation.navigate(APP_STACK) );
  };

  _validate(username, password) {
    let errors = { usernameError: '', passwordError: '' };
    let result = false;
    if(!username) {
      errors.usernameError = 'Please provide user name.';
      result = true;
    }
    if(!password) {
      errors.passwordError = 'Please provide password.';
      result = true;
    }
    this.setState({ errors });
    return result;
  }

  render() {
    const { t, isConnected, isNetworkBannerVisible } = this.props;
    return (
      <ScrollView style={[styles.hMax, styles.bgApp]} onLayout={this.getNewDimensions} >
        <NetworkStatusBanner
          isConnected={isConnected}
          isVisible={isNetworkBannerVisible}
        />
        {this.state.isLoading && <Loading />}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.f1, styles.ph20, styles.pv20, styles.flexColumn]}>
            <View style={[styles.mv10, styles.center]}>
              <Text style={[styles.cWhite, styles.font26, styles.bold]}>Fishery Survey</Text>
            </View>
            <View style={[styles.f1, styles.center]}>
              <Image source={require('../../assets/images/dof-logo-en.png')} style={[styles.w250, styles.h250]} />
            </View>
            <View style={[styles.f1]}>
              <Text style={[styles.cWhite, styles.fontMedium18]}>{t('translation:username')}</Text>
              <Input
                type="username"
                width={this.state.inputWidth}
                borderBottomColor={'#FFF'}
                inputStyle={[styles.cWhite, styles.fontMedium20]}
                placeholder={t('translation:username')}
                placeholderTextColor={'rgba(255,255,255,0.5)'}
                errorMessage={this.state.errors.usernameError}
                autoFocus={true}
                onSubmitEditing={() => this.refpassword.focus() }
                onChangeText={text => {
                  this.setState({username: text});
                }}
              />
              <Text style={[styles.cWhite, styles.fontMedium18]}>{t('translation:password')}</Text>
              <Input
                type="password" 
                refInput={(r) => this.refpassword = r}
                width={this.state.inputWidth}
                borderBottomColor={'#FFF'}
                placeholder={t('translation:password')}
                placeholderTextColor={'rgba(255,255,255,0.5)'}
                inputStyle={[styles.cWhite, , styles.fontMedium20]}
                errorMessage={this.state.errors.passwordError}
                onSubmitEditing={this.onLogin}
                onChangeText={text => {
                  this.setState({password: text});
                }}
              />
              {/* <View style={[styles.mv10]}>
                <TouchableOpacity onPress={() => {
                }}>
                  <Text style={[styles.cWhite, styles.font16, styles.bold]}>Forgot password?</Text>
                </TouchableOpacity>
              </View> */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.circle50, styles.bgWhite, styles.shadow2, styles.center, { alignSelf: 'flex-end' }]}
                onPress={this.onLogin}
              >
                <Icon name={'keyboard-arrow-right'} size={30} color={COLOR.APP} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return { 
    loginUser: state.survey.loginUser,
    isConnected: state.network.isConnected,
    isNetworkBannerVisible: state.survey.isNetworkBannerVisible,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLoggedinUser: data => {
      dispatch(setLoggedinUser(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Login));