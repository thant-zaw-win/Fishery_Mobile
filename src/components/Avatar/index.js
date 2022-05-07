import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default class Avatar extends Component {
  render() {
    const { img, large } = this.props;
    return (
      <View style={large ? styles.avatarLargeView : styles.avatarView}>
        <Image
          source={ img }
          style={ large ? styles.avatarLarge : styles.avatar }
        />
      </View>
    );
  }
}

Avatar.defultProps = {
  large: false,
  isGroup: false,
  liveEnabled: true
};

Avatar.propTypes = {
  large: PropTypes.bool,
  isGroup: PropTypes.bool,
  uri: PropTypes.string
};

const styles = StyleSheet.create({
  avatarView: {
    flex: 1,
    height: 70,
    backgroundColor: "#F1F1F1", //"#bdc3c7", // light grey
    borderRadius: 3,
  },
  avatar: {
    borderRadius: 3,
    resizeMode: 'contain', 
    width: "100%", 
    height: "100%",
    // overflow: 'hidden'
  },
  avatarLargeView: {
    flex: 1,
    height: 105,
    backgroundColor: "#F1F1F1", //"#bdc3c7", // light grey
    borderRadius: 5
  },
  avatarLarge: {
    left: 0,
    resizeMode: 'contain', 
    width: "100%", 
    height: "100%",
    borderRadius: 5,
    // overflow: 'hidden'
  },
});
