import React, { Component } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import { TouchableRipple, Text } from 'react-native-paper';
import { Icon, Avatar } from '../../components';
import { TAKE_SURVEY, config, Api } from '../../utilities';

class SurveyItem extends Component {
  state = {
    iconSize: 26
  }

  onPressEdit = () => {
    this.props.setRecentKey(this.props.item.surveyKey);
    this.props.navigation.navigate(TAKE_SURVEY, {
      key: this.props.item.surveyKey,
      loadData: this.props.loadData
    })
  };

  willUnmount = false;

  componentWillUnmount() {
    this.willUnmount = true
  }

  getNewDimensions = (event) => {
    this.setState({
      iconSize: event.nativeEvent.layout.width / 100 * 3 + 15,
    });
  }

  onPressSubmit = () => {
    Alert.alert(
      "Confirm", 
      `Are you sure you want to submit ${this.props.item.surveyCode}.`, 
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: this.onUpdateStatus},
      ],
      {cancelable: true}
    )
    // Alert({
    //   title: "Submit",
    //   message: "Are you sure you want to submit this survey.",
    //   buttons: [
    //     { title: "CANCEL", onPress: () => {} },
    //     { title: "OK", onPress: () => {} }
    //   ]
    // });
  };

  onUpdateStatus = async () => {
    const data = {
      SurveyKey: this.props.item.surveyKey,
      SurveyStatus: "Collected",
      UpdatedBy: this.props.loginUser.userName,
    };
    
    const res = await Api.post('/api/survey/changeSurveyStatus', data);

    if(!res.status) return this.setState(Alert.alert('Error', res.message) );

    if(res.status) {
      if(!res.data.status) return Alert.alert('Error', res.data.message);
      else this.props.loadData()
    }
  }

  render() {
    let { surveyCode, productName, productFishPhotos, surveyStatus } = this.props.item;
    productFishPhotos = (productFishPhotos !== "" && productFishPhotos !== null) ? productFishPhotos.split(";") : [];
    
    return (
      <TouchableRipple
        onPress={this.onPressEdit}
        rippleColor="skyblue"
        style={ this.props.index % 2 == 0 ? styles.itemBlue : styles.itemWhite }
      >
        <View style={[styles.item, styles.bgGreen]} onLayout={this.getNewDimensions} >
          {/* <AlertView id="alert1" /> */}
          <Avatar img={ { uri: config.SERVER_URL+productFishPhotos[0] } } large={true} />
          <View style={styles.nameView}>
            <Text style={styles.head}>
              {surveyCode}
            </Text>
            <Text style={styles.sub}>{productName}</Text>
          </View>
          {surveyStatus === "Allocated" ? <TouchableRipple
            onPress={this.onPressSubmit}
            style={styles.icon}
            rippleColor="skyblue"
          >
            <Icon type="FontAwesome" name={'send'} color={'#0084ff'} size={this.state.iconSize} />
          </TouchableRipple> : <View style={{width: 50}}></View>}
          <TouchableRipple
            onPress={this.onPressEdit}
            style={styles.icon}
            rippleColor="skyblue"
          >
            <Icon type="AntDesign" name={'form'} color={'#00ed00'} size={this.state.iconSize} />
          </TouchableRipple>
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  itemBlue: {
    backgroundColor: '#f0ffff',
  },
  itemWhite: {
    backgroundColor: 'white',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  nameView: {
    flex: 2,
    paddingHorizontal: 8,
    // justifyContent: 'center'
  },
  head: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left'
  },
  sub: {
    color: 'grey',
    paddingTop: 4
  },
  icon: {
    paddingHorizontal: 10,
    width: '13%', //50,
    justifyContent: 'center',
    // alignItems: 'center'
  }
});

const mapStateToProps = state => {
  return { 
    loginUser: state.survey.loginUser,
  }
}

export default connect(mapStateToProps, undefined)(SurveyItem);