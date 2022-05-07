import React from 'react';
import { View, TouchableOpacity, ScrollView, Text, Image, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Input, Loading, NetworkStatusBanner } from '../../components';
import styles, { COLOR } from '../../styles';
import { Api, isIos } from '../../utilities';
import { cancelToUpdateDatas } from '../../store/actions';

class ChangePassword extends React.Component {
  state = {
    isLoading: false,
    errors: {
      oldPasswordError: '',
      newPasswordError: '',
      confirmPasswordError: '',
    },

    oldPassword: '',
    newPassword: '',
    confirmPassword: '',  
  }

  willUnmount = false;
  
  componentWillUnmount() {
    this.willUnmount = true
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleChangePassword: this.handleChangePassword });
    const { toUpdateDatas, isConnected } = this.props;
    if(toUpdateDatas.length > 0 && isConnected) {
      this.initialize(false);
    }
  }

  initialize = async (came_back_online) => {
    const { toUpdateDatas } = this.props;
    if(toUpdateDatas.length > 0) {
      Alert.alert(
        "Reminding", 
        `Do you want to update unsaved datas or cancel.`, 
        [
          { text: 'Cancel', onPress: () => this.props.cancelToUpdateDatas(), style: 'cancel', },
          { text: 'OK', onPress: () => this.saveToUpdateDatas(toUpdateDatas) },
        ],
        { cancelable: false }
      )
    }
  }

  async saveToUpdateDatas(toUpdateDatas) {
    this.setState({ isLoading: true })
    let updateCounts = await toUpdateDatas.map(async item => {
      const res = await Api[item.method](item.apiPath, item.data);
      return res;
    });
    if(toUpdateDatas.length === updateCounts.length) {
      this.props.cancelToUpdateDatas();
      this.setState({ isLoading: false })
      Alert.alert(
        "Success", 
        "Unsaved datas updated successfully.",
        [ { text: 'OK', style: 'cancel', } ],
        { cancelable: true }
      )
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { isConnected } = this.props;
    if (isConnected && prevProps.isConnected != isConnected) {
      this.initialize(true);
    } else if (!isConnected  && prevProps.isConnected != isConnected) {

    }
  }
  
  handleChangePassword = async () => {
    const { oldPassword, newPassword, confirmPassword } = this.state;
    if(this._validate(oldPassword, newPassword, confirmPassword)) return;
    
    this.setState({ isLoading: true });
    const res = await Api.post('/api/user/changePassword', { 
      userKey: this.props.loginUser.userKey, 
      password: oldPassword, 
      newPassword: newPassword,
      updatedBy: this.props.loginUser.userID,
    });
    
    if(!res.data.status) {
      this.setState({
        oldPassword: ''
      }, () => { if(!this.willUnmount) this.setState({ isLoading: false }) } );
      return Alert.alert('Error', res.data.message)
    }

    this.setState({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '' 
    }, () => { if(!this.willUnmount) this.setState({ isLoading: false }) } );
    Alert.alert('Success', "Your password changed successfully.")
  }

  _validate(oldPassword, newPassword, confirmPassword) {
    let errors = { oldPasswordError: '', newPasswordError: '', confirmPasswordError: '' };
    let result = false;
    if(!oldPassword) {
      errors.oldPasswordError = 'Please provide old password.';
      result = true;
    }
    if(!newPassword) {
      errors.newPasswordError = 'Please provide new password.';
      result = true;
    }else if(oldPassword === newPassword){
      errors.newPasswordError = 'Please provide new password must be diffenent from old password.';
      result = true;
    }
    if(!confirmPassword) {
      errors.confirmPasswordError = 'Please provide confirm password.';
      result = true;
    }else if(confirmPassword !== newPassword) {
      errors.confirmPasswordError = 'Please match confirm password with new password.';
      result = true;
    }
    this.setState({ errors });
    return result;
  }

  getNewDimensions = (event) => {
    this.setState({
      inputWidth: event.nativeEvent.layout.width / 100 * 85 // Dynamic Width
    });
  }

  render() {
    const { isConnected, isNetworkBannerVisible } = this.props;
    return (
      <View style={styles.sceneContainer} onLayout={this.getNewDimensions}>
        <NetworkStatusBanner
          isConnected={isConnected}
          isVisible={isNetworkBannerVisible}
        />
        <ScrollView>
          {this.state.isLoading && <Loading />}
          <View style={[{marginTop: isIos() ? 40 : 20}, styles.container]}>
            <Text style={[styles.fontMedium18, styles.cApp]}>{'Old Password'}</Text>
            <Input
              type="password"
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Old Password'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.oldPassword}
              errorMessage={this.state.errors.oldPasswordError}
              onChangeText={text => {
                this.setState({ oldPassword: text })
              }}
            />

            <Text style={[styles.fontMedium18, styles.cApp]}>{'New Password'}</Text>
            <Input
              type="password"
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter New Password'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.newPassword}
              errorMessage={this.state.errors.newPasswordError}
              onChangeText={text => {
                this.setState({ newPassword: text })
              }}
            />

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Confirm Password'}</Text>
            <Input
              type="password"
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Confirm New Password'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.confirmPassword}
              errorMessage={this.state.errors.confirmPasswordError}
              onChangeText={text => {
                this.setState({ confirmPassword: text })
              }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return { 
    loginUser: state.survey.loginUser,
    isConnected: state.network.isConnected,
    isNetworkBannerVisible: state.survey.isNetworkBannerVisible,
    toUpdateDatas: state.survey.toUpdateDatas,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    cancelToUpdateDatas: () => {
      dispatch(cancelToUpdateDatas())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);