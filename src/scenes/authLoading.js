import React from 'react';
import { connect } from 'react-redux';
import { APP_STACK, AUTH_STACK } from '../utilities';
import { StatusBar, View } from 'react-native';
import styles from '../styles';
import { Loading } from '../components';

class AuthLoading extends React.Component {
  async componentDidMount() {
    const { navigation } = this.props;
    try {
      // const user = await Storage.get('user');
      const user = this.props.loginUser;

      navigation.navigate(user ? APP_STACK : AUTH_STACK);
    } catch (err) {
      navigation.navigate(AUTH_STACK);
    }
  }

  render() {
    return (
      <View style={styles.f1}>
        <StatusBar barStyle="default" />
        <Loading />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return { loginUser: state.survey.loginUser }
}

export default connect(mapStateToProps, undefined)(AuthLoading);
