import React from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { TouchableRipple } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Icon, NetworkStatusBanner, Loading } from '../../components';
import styles, { COLOR } from '../../styles';
import { ABOUT, IMAGES, CHANGE_PASSWORD, Api } from '../../utilities';
import { cancelToUpdateDatas } from '../../store/actions';

const IMAGE_PICKER_OPTIONS = {
  title: 'Select Photo',
  takePhotoButtonTitle: 'Make Photo With Camera',
  chooseFromLibraryButtonTitle: 'Choose Photo From Galary',
  cancelButtonTitle: 'Cancel',
  // customButtons: [{ name: 'fb', title: 'Choose Photo From Facebook' }],
  mediaType: 'photo',

  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class Profile extends React.Component {
  state = { isLoading: false }

  onPressChangePassword = () => {
    this.props.navigation.navigate(CHANGE_PASSWORD)
  };

  openImagePicker() {
    ImagePicker.showImagePicker(IMAGE_PICKER_OPTIONS, (response) => {
      console.log('Response = ', response.path);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        // ImageCropPicker.openCropper({
        //   path: response.uri,
        // }).then(image => {
        //   this.setState({
        //     shop_images: [...this.state.shop_images, image],
        //   });
        // });
      }
    });
  }

  componentDidMount() {
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

  render() {
    if(this.state.isLoading) return <Loading />
    const { loginUser, isConnected, isNetworkBannerVisible } = this.props;
    return (
      <View style={styles.sceneContainer}>
        <NetworkStatusBanner
            isConnected={isConnected}
            isVisible={isNetworkBannerVisible}
          />
        <ScrollView>
          <View style={styles.profileCover}>
            {/* <TouchableRipple 
              rippleColor="lightblue" 
              style={[styles.square40, styles.bdRad3, styles.rightBottom10, styles.bgWhite, styles.jCenter, styles.aCenter ]} 
              onPress={()=>this.openImagePicker('sample_images', 1)}
            >
              <Icon type="Entypo" name="camera" size={24} color={COLOR.BLACK} />
            </TouchableRipple> */}
          </View>

          
          <Image style={styles.profileAvatar} source={IMAGES.profile.profileAvatar} />
          <View style={styles.profileAvatar}>
            {/* <TouchableRipple 
              rippleColor="lightblue" 
              style={[styles.circle40, styles.rightBottom0, styles.bgWhite, styles.jCenter, styles.aCenter ]} 
              onPress={()=>this.openImagePicker('sample_images', 1)}
            >
              <Icon type="Entypo" name="camera" size={20} color={COLOR.BLACK} />
            </TouchableRipple> */}
          </View>

          <View style={[styles.container, styles.jCenter, styles.aCenter, styles.mt100, styles.mb10]}>

            <View style={[styles.f1, styles.aCenter]}>
              <Text style={[styles.font28, styles.cAppDark, styles.bold]}>{loginUser.userName}</Text>
              <Text style={[styles.font18, styles.cApp]}>{loginUser.userGroupCode}</Text>
              {/* <Text style={[styles.font16, styles.cBlack, styles.textCenter, styles.mt10]}>
              Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,
              </Text> */}
            </View>
            <View style={[styles.f1, styles.aStart]}>
              <View style={[{ flex: 1 }, styles.flexRow, styles.mv8, styles.ph10]}>
                <Icon name='phone' size={26} STYLE/>
                <View style={{ justifyContent: 'center' }}>
                  <Text verticalAlign={'center'} style={[styles.font16, styles.ph10 ]}>
                    Call Phone <Text style={styles.bold}>{loginUser.phoneNo}</Text>
                  </Text>
                </View>
              </View>
              {/* <View style={[{ flex: 1 }, styles.flexRow, styles.mv8, styles.ph10]}>
                <Icon name='work' size={26} STYLE/>
                <View style={{ justifyContent: 'center' }}>
                  <Text verticalAlign={'center'} style={[styles.font16, styles.ph10 ]}>
                    Works in <Text style={styles.bold}>{loginUser.address}</Text>
                  </Text>
                </View>
              </View> */}
              <View style={[{ flex: 1 }, styles.flexRow, styles.mv8, styles.ph10]}>
                <Icon name='home' size={26} />
                <View style={{ justifyContent: 'center' }}>
                  <Text verticalAlign={'center'} style={[styles.font16, styles.ph10]}>
                    Lives in <Text style={styles.bold}>{loginUser.address}</Text>
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.f1, styles.aCenter]}>
              <TouchableOpacity style={styles.touchContainer} onPress={this.onPressChangePassword}>
                <Text style={styles.font16}>Change Password</Text>
              </TouchableOpacity>
            </View>
            
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Profile));