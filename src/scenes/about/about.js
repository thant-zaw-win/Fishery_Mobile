import React from 'react';
import { Text, View } from 'react-native';
import styles from '../../styles';
import { AlertView, SnackBar, showSnackBar, Alert } from '../../components';

export default class About extends React.Component {
  componentDidMount() {
    // showSnackBar({
    //   message:"custom message", 
    //   position:"top", 
    //   duration: 2000,
    //   confirmText: "OK", 
    //   onConfirm: () => {}
    // });
    // Alert({
    //   title:"Alert-Title",
    //   message: "Your custom message will appear here.",
    //   buttons: [
    //     { title: "CANCEL", onPress: () => {} }, 
    //     { title: "OK", onPress: () => {} }
    //   ]
    // });
  }

  openDrawer = () => {
    const { navigation } = this.props;
    navigation.openDrawer();
  };

  render() {
    return (
      <View style={[styles.center, styles.f1]}>
        <Text>About</Text>
        {/* <AlertView id={'Alert_Root_App'} />
        <SnackBar id={'SnackBar_Root_App'} /> */}
      </View>
    );
  }
}
