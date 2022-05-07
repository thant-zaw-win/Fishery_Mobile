import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { TouchableRipple, Text } from 'react-native-paper';
import moment from 'moment';

import { Icon, Avatar } from '../../components';
import { EVENT_DETAIL, config } from '../../utilities';

class EventItem extends Component {
  state = {
    iconSize: 24,
  };

  onPressEdit = () => {
    this.props.setRecentKey(this.props.item.eventKey);
    this.props.navigation.navigate(EVENT_DETAIL, {
      key: this.props.item.eventKey,
      loadData: this.props.loadData
    })
  };

  getNewDimensions = (event) => {
    this.setState({
      iconSize: event.nativeEvent.layout.width / 100 * 3 + 15,
    });
  }

  render() {
    let { title, photos, date } = this.props.item;
    photos = (photos !== "" && photos !== null) ? photos.split(";") : [];
    return (
      <TouchableRipple
        onPress={this.onPressEdit}
        rippleColor="skyblue"
        style={ this.props.index % 2 == 0 ? styles.itemBlue : styles.itemWhite }
      >
        <View style={styles.item} onLayout={this.getNewDimensions}>
          <Avatar img={ { uri: config.SERVER_URL+photos[0] } } large={true} />
          <View style={styles.nameView}>
            <Text style={styles.head}>
              {title}
            </Text>
            <Text style={styles.sub}>
              {moment(date).local().format("DD MMM YYYY")}
            </Text>
          </View>
          {/* {surveyStatus === "Allocated" ? <TouchableRipple
            onPress={this.onPressSubmit}
            style={styles.icon}
            rippleColor="lightblue"
          >
            <Icon type="FontAwesome" name={'send'} color={'#0084ff'} size={24} />
          </TouchableRipple> : <View style={{width: 50}}></View>} */}
          <TouchableRipple
            onPress={this.onPressEdit}
            style={styles.icon}
            // rippleColor="skyblue"
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
    width: "13%", //
    justifyContent: 'center',
    // alignItems: 'center'
  }
});

const mapStateToProps = state => {
  return { 
    loginUser: state.survey.loginUser,
  }
}

export default connect(mapStateToProps, undefined)(EventItem);