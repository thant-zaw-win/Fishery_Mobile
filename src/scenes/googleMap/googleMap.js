import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { connect } from 'react-redux';
import { LATITUDE_DELTA, LONGITUDE_DELTA, TAKE_SURVEY, Api } from '../../utilities';
import { Icon, Loading } from '../../components';
import styles, { height, COLOR } from '../../styles';
import MapView, { Marker, PROVIDER_GOOGLE  } from 'react-native-maps';
import { cancelToUpdateDatas } from '../../store/actions';

class GoogleMap extends React.Component {
  state = {
    region: {
      latitude: 16.79863133189938,
      longitude: 96.14948904141784,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    isLoading: false
  }

  watchID = null;

  componentWillMount() {
    this.props.navigation.setParams({ saveLocation: this.saveLocation });
  }

  componentDidMount() {
    const { navigation, toUpdateDatas, isConnected } = this.props;
    const gpsLocation = navigation.getParam('gpsLocation');
    if(gpsLocation && gpsLocation[0] !== "" && gpsLocation[1] !== "" && !isNaN(gpsLocation[0]) && !isNaN(gpsLocation[1]) ) {
      let { region } = this.state;
      region.latitude = Number(gpsLocation[0]);
      region.longitude = Number(gpsLocation[1]);
      this.setState({ region });
    } else {
      this.getCurrentPosition();
    }
    if(toUpdateDatas.length > 0 && isConnected) {
      this.initialize(false);
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
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

  watchPosition() {
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: this.state.region.latitudeDelta,
          longitudeDelta: this.state.region.longitudeDelta,
        };
        this.setState({ region });
        this.map.animateToRegion(region, 500);
      },
    );
    
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
      position => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: this.state.region.latitudeDelta,
          longitudeDelta: this.state.region.longitudeDelta,
        };
        this.setState({ region });
        this.map.animateToRegion(region, 500);
      },
    (error) => console.log(error.message),
    // { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  changeMarkerPosition(coordinate) {
    this.setState({
      region: {
        ...this.state.region,
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      }
    });
  }

  saveLocation = () => {
    const { navigation } = this.props;
    navigation.getParam("setLocation")(this.state.region);
    navigation.goBack();
  }

  render() {
    if(this.state.isLoading) return <Loading />
    return (
      <View style={styles.mapContainer}>
        <MapView
          ref={map => (this.map = map)}
          provider={ PROVIDER_GOOGLE }
          style={styles.map}
          showsUserLocation={ true }
          followsUserLocation={ true }
          showsMyLocationButton={ false }
          initialRegion={{
            latitude: 16.79863133189938,
            longitude: 96.14948904141784,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          loadingEnabled
          scrollEnabled
          zoomEnabled
          pitchEnabled
          rotateEnabled
          region={ this.state.region }
          onRegionChangeComplete={ region => this.setState({region}) }
          // onPress={(event)=> this.changeMarkerPosition(event.nativeEvent.coordinate)}
        >
          <Marker
            draggable
            coordinate={ this.state.region }
            onDragEnd={(event)=>this.changeMarkerPosition(event.nativeEvent.coordinate)}
          />
        </MapView>

          {/* <TouchableOpacity
            style={[styles.circle60, styles.bgWhite, styles.shadow2, styles.center, styles.m10, { alignSelf: 'flex-end' }]}
            onPress={()=>this.saveLocation()}
          >
            <Text style={[styles.font16, styles.cApp]}>Save</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.circle70, styles.bgWhite, styles.shadow2, styles.center, styles.m10, { alignSelf: 'flex-end' }]}
            onPress={()=>this.getCurrentPosition()}
          >
            <Icon type={'MaterialIcons'} name={'my-location'} size={26} color={COLOR.APP} />
          </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return { 
    loginUser: state.survey.loginUser,
    isConnected: state.network.isConnected,
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

export default connect(mapStateToProps, mapDispatchToProps)(GoogleMap);