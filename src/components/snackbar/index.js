import React, { PureComponent } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Events from 'react-native-simple-events';

const { width } = Dimensions.get('window');

export const showSnackBar = (data = {}) => {
  const {
    message = 'Your custom message',
    textColor = '#FFF',
    position = 'bottom',
    confirmText = '',
    buttonColor = '#03a9f4',
    duration = 4000,
    animationTime = 250,
    backgroundColor = '#323232',
    onConfirm = () => {
    },
    ...otherProps
  } = data;

  Events.trigger('showSnackBar', {
    message,
    textColor, // message text color
    position, // enum(top/bottom).
    confirmText, // button text.
    buttonColor, // default button text color
    duration, // (in ms), duartion for which snackbar is visible.
    animationTime, // time duration in which snackbar will complete its open/close animation.
    backgroundColor, // background color for snackbar
    onConfirm, //  perform some task here on snackbar button press.
    ...otherProps,
  });
};

export class SnackBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      message: 'Had a snack at snackBar.',
      confirmText: null,
      onConfirm: null,
      position: 'bottom',
      show: false,
      animationTime: 250,
      maxHeight: 48,
      textColor: '#FFF',
      buttonColor: '#03a9f4',
      backgroundColor: '#323232',

      top: new Animated.Value(-48),
      bottom: new Animated.Value(-48),

      pan: new Animated.ValueXY(),
    };

    this.animatedValueX = 0;
    const { pan } = this.state;
    pan.x.addListener((data) => {
      this.animatedValueX = data.value;
      return this.animatedValueX;
    });

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        pan.setOffset({ x: this.animatedValueX });
        pan.setValue({ x: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x }]),
      onPanResponderRelease: this.handlePanResponderRelease,
      onPanResponderTerminate: this.handlePanResponderRelease,
    });

    this.timeout = undefined;
  }

  componentDidMount() {
    const { id = null } = this.props;

    Events.on('showSnackBar', id || '123456789', this.onRequest);
  }

  componentWillUnmount() {
    const { id = null } = this.props;

    Events.remove('showSnackBar', id || '123456789');
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  onRequest = (options) => {
    const {
      message,
      confirmText,
      onConfirm,
      position = 'bottom',
      height = 48,
      duration = 4000,
      animationTime = 250,
      show = true,
      ...otherOptions
    } = options;

    if (message) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.setState(
        {
          message,
          confirmText,
          onConfirm,
          position,
          show,
          ...otherOptions,
          top: new Animated.Value(-1 * height),
          bottom: new Animated.Value(-1 * height),
        },
        () => {
          this.setPanValueToZero();

          if (position === 'top') {
            Animated.sequence([
              Animated.timing(this.state.top, {
                toValue: 0,
                duration: animationTime,
              }),
              Animated.delay(duration),
              Animated.timing(this.state.top, {
                toValue: -1 * height,
                duration: animationTime,
              }),
            ]).start();
          }

          if (position === 'bottom') {
            Animated.sequence([
              Animated.timing(this.state.bottom, {
                toValue: 0,
                duration: animationTime,
              }),
              Animated.delay(duration),
              Animated.timing(this.state.bottom, {
                toValue: -1 * height,
                duration: animationTime,
              }),
            ]).start();
          }

          this.timeout = setTimeout(() => {
            this.setPanValueToZero();
            this.setState({ show: false });
          }, duration + 2 * animationTime);
        },
      );
    }
  };

  setPanValueToZero = () => {
    this.state.pan.setOffset({ x: 0 });
    this.state.pan.setValue({ x: 0 });
  };

  hideSnackBar = () => {
    const { position, maxHeight, animationTime } = this.state;
    if (position === 'top') {
      Animated.sequence([
        Animated.timing(this.state.top, {
          toValue: -1 * maxHeight,
          duration: animationTime,
        }),
      ]).start(() => {
        this.setPanValueToZero();
        this.setState({ show: false });
      });
    }

    if (position === 'bottom') {
      Animated.sequence([
        Animated.timing(this.state.bottom, {
          toValue: -1 * maxHeight,
          duration: animationTime,
        }),
      ]).start(() => {
        this.setPanValueToZero();
        this.setState({ show: false });
      });
    }
  };

  handlePanResponderRelease = () => {
    const x = this.animatedValueX;

    if (!(x > width / 2 || x < -1 * width / 2)) {
      Animated.spring(this.state.pan, { toValue: { x: 0, y: 0 } }).start();
    }
  };

  render() {
    const {
      maxHeight,
      show,
      message,
      confirmText,
      position,
      top,
      bottom,
      textColor,
      buttonColor,
      backgroundColor,
      onConfirm = () => {},
      pan,
    } = this.state;

    const animatedOpacity = pan.x.interpolate({
      inputRange: [-1 * width / 2, 0, width / 2],
      outputRange: [0, 1, 0],
    });

    const { left } = pan.getLayout();

    const snackbarStyle = [
      {
        position: 'absolute',
        flexDirection: 'row',
        minHeight: maxHeight,
        maxHeight: 80,
        width,
        backgroundColor,
        paddingHorizontal: 24,
        shadowRadius: 2,
        shadowColor: 'black',
        shadowOffset: { height: 3, width: 1 },
        shadowOpacity: 0.4,
        elevation: 24,
        opacity: animatedOpacity,
        left,
      },
      position === 'top' && { top },
      position === 'bottom' && { bottom },
    ];
    const buttonTextStyle = [
      {
        color: buttonColor,
        textAlign: 'left',
        fontSize: 14,
      },
    ];
    const messageTextStyle = [{ color: textColor, fontSize: 14 }];

    if (show) {
      return (
        <Animated.View
          style={snackbarStyle}
          {...this.panResponder.panHandlers}
        >
          <View style={[{ flex: 10, paddingVertical: 14, justifyContent: 'center' }]}>
            <Text ellipsizeMode="tail" numberOfLines={2} style={messageTextStyle}>
              {message}
            </Text>
          </View>

          {/* confirm text button */}
          {confirmText ? (
            <View style={[{ flex: 2, paddingLeft: 24 }]}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (onConfirm) {
                    onConfirm();
                  }
                  this.hideSnackBar();
                }}
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={buttonTextStyle}>{confirmText.toUpperCase()}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
        </Animated.View>
      );
    }
    return null;
  }
}
