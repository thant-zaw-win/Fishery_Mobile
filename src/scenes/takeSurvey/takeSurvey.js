import React from 'react';
import { View, TouchableOpacity, ScrollView, Text, Image, Alert } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { Input, Icon, Loading, NetworkStatusBanner } from '../../components';
import styles, { COLOR } from '../../styles';
import { LATITUDE_DELTA, LONGITUDE_DELTA, GOOGLE_MAP,
  Api, config, SURVEY_STATUSES, SURVEY_TYPES, SURVEY_LIST, copyArrayObjByNoRef, dateFormatter, isIos } from '../../utilities';
  import { setSurveyDetail, setToUpdateDatas, cancelToUpdateDatas, setDropDownDatas } from '../../store/actions';

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

class TakeSurvey extends React.Component {
  state = {
    isLoading: false,
    smeBusinessPhotosToDelete: [],
    productPhotosToDelete: [],
    samplePhotosToDelete: [],
    iconSize: 26,

    surveyKey: null,
    surveyCode: "",
    surveyCreatedDate: moment().toDate(),
    surveyStatus: null,
    surveyType: null,
    userGroupKey: null,
    productKey: null,
    productFishPhotos: [],
    projectKey: null,
    stateKey: null,
    townshipKey: null,
    surveyRemark: "",
    recordStatus: "Active",
    
    surveyStatuses: [],
    surveyTypes: [],
    userGroups: [],
    products: [],
    projects: [],
    states: [],
    townships: [],

    userKey: null,
    // users: [],
    collectedDate: moment().toDate(),
    smeBusinessName: "",
    smeBusinessAddress: "",
    gpsLocation: ["", ""],
    contactPerson: "",
    contactPhNo: "",
    smeBusinessPhotos: [], 
    productPhotos: [],
    samplePhotos: [],
    samplingInfo: "",
  }
  
  componentWillMount() {
    this.props.navigation.setParams({ handleSave: this.handleSave });
  }
  
  componentDidMount() {
    const { navigation, isConnected } = this.props;
    const key = navigation.getParam('key');
    if (key) {
      if (!isConnected) { // setData for offline
        let haveOfflineData = this.setOfflineDatas(key);
        if (!haveOfflineData) {
          Alert.alert('Offline Mode', "There is no memory data in device for offline mode.", undefined, { cancelable: false });
          this.props.navigation.navigate(SURVEY_LIST);
        }
      } else {
        this.initialize(false);
      }
    } else {
      this.props.navigation.navigate(SURVEY_LIST);
    }
  }

  setOfflineDatas(key) {
    const { isConnected, surveyDetails,
      // pickers
      surveyStatuses,
      projects,
      products,
      states,
      townships,
      userGroups,
      surveyTypes } = this.props;
    const data = surveyDetails.filter(item => item.surveyKey === key )[0];
    if (data && !isConnected && surveyStatuses.length > 0 && projects.length > 0 && products.length > 0 
      && states.length > 0 && townships.length > 0 && userGroups.length > 0 && surveyTypes.length > 0 ) {
      this.setState({
        surveyStatuses,
        projects,
        products,
        states,
        townships,
        userGroups,
        surveyTypes,
      });
      this.setState(data);
      return true;
    } else {
      return false;
    }
  }

  getNewDimensions = (event) => {
    this.setState({
      inputWidth: event.nativeEvent.layout.width / 100 * 85, // Dynamic input Width
      iconSize: event.nativeEvent.layout.width / 100 * 3 + 15, // Dynamic Icon size
    });
  }

  initialize = async (came_back_online) => {
    const { navigation, toUpdateDatas } = this.props;
    const key = navigation.getParam('key');
    if(!came_back_online) {
      this.loadData(key);
    }
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
        "Unsaved data updated successfully.",
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

  async loadData(key) {
    this.setState({ isLoading: true });
    let res = await Api.get(`/api/survey/${key}`);
    if(!res.status) return this.setState({ isLoading: false }, () => {
      const isSetOfflineData = this.setOfflineDatas(key);
      if (!isSetOfflineData) {
        Alert.alert('Error', res.message);
        this.props.navigation.navigate(SURVEY_LIST);
      }
    });

    res.data.gpsLocation = res.data.gpsLocation ? res.data.gpsLocation.split(";") : ["", ""];
    res.data.smeBusinessPhotos = res.data.smeBusinessPhotos ? res.data.smeBusinessPhotos.split(";") : [];
    res.data.productPhotos = res.data.productPhotos ? res.data.productPhotos.split(";") : [];
    res.data.samplePhotos = res.data.samplePhotos ? res.data.samplePhotos.split(";") : [];
    res.data.smeBusinessPhotosToDelete = [];
    res.data.productPhotosToDelete = [];
    res.data.samplePhotosToDelete = [];
    res.data.productFishPhotos = []; // default
    res.data.collectedDate = res.data.collectedDate || moment(); // default
    this.setState(res.data, () => {
      this.props.setSurveyDetail(res.data);
      this.loadOptions(key);
    });
  }

  async loadOptions(key) {
    const projectList = await Api.get('/api/project/bystatus/all');
    const productList = await Api.get('/api/product/bystatus/all');
    const userGroupList = await Api.get('/api/userGroup/bystatus/all');
    // const userList = await Api.get('/api/user');
    const stateList = await Api.get('/api/other/state');
    const townshipList = await Api.get('/api/other/township');
    const surveyStatusList = SURVEY_STATUSES;
    const surveyTypeList = SURVEY_TYPES;
    
    let productFishPhotos = productList.data.filter(data=> data.productKey === this.state.productKey)[0];
    productFishPhotos = productFishPhotos.productPhotos !== "" ? productFishPhotos.productPhotos.split(";") : [];
    const projects = this.addSelectOptions(projectList.data, "projectKey", "projectCode", undefined, this.state.projects);
    const products = this.addSelectOptions(productList.data, "productKey", "productName", undefined, this.state.products);
    const userGroups = this.addSelectOptions(userGroupList.data, "userGroupKey", "userGroupCode", undefined, this.state.userGroups);
    // const users = this.addSelectOptions(userList, "userKey", "userName", undefined, this.state.users);
    const states = this.addSelectOptions(stateList.data, "sR_Pcode", "state_Region", undefined, this.state.states);
    const townships = this.addSelectOptions(townshipList.data, "tS_Pcode", "township", undefined, this.state.townships);
    const surveyStatuses = this.addSelectOptions(surveyStatusList, "value", "label", undefined, this.state.surveyStatuses);
    const surveyTypes = this.addSelectOptions(surveyTypeList, "value", "label", undefined, this.state.surveyTypes);
    this.setState({ surveyStatuses, projects, products, states, townships, userGroups, surveyTypes, productFishPhotos
    }, () => {
      this.props.setSurveyDetail({ surveyKey: key, productFishPhotos });
      this.props.setDropDownDatas({ surveyStatuses, projects, products, states, townships, userGroups, surveyTypes, });
      this.setState({ isLoading: false });
    });
  }

  addSelectOptions(newOptions = [], key, name, defaultValue = { value: null, label: null }, defaultOptionsValue) {
    let options = copyArrayObjByNoRef(defaultOptionsValue);    
    if(defaultValue.value !== null && defaultValue.label !== null) options.push(defaultValue);
    let l = options.length;
    for (var i = 0; i < newOptions.length; i++) {
      options[l+i] = {};
      for (var prop in newOptions[i]) {
        switch(prop) {
          case key: options[l+i].value = newOptions[i][prop]; break;
          case name: options[l+i].label = newOptions[i][prop]; break;
        }
      }
    }
    return options;
  }

  setOptionLabel(prop, selectOption) {
    let value = selectOption.filter( v => v.value === this.state[prop])[0];
    return value ? value.label : "";
  }

  setLocation(region) {
    let { gpsLocation } = this.state;
    gpsLocation[0] = region.latitude.toString();
    gpsLocation[1] = region.longitude.toString();
    this.setState({ gpsLocation });
  }

  routeToGoogleMap = () => {
    this.props.navigation.navigate(GOOGLE_MAP, {
      gpsLocation: this.state.gpsLocation,
      setLocation: (region) => this.setLocation(region)
    });
  };

  openImagePicker(prop) {
    if(this.state[prop].length >= 3) return Alert.alert('Error Message', "Photo must not upload more than 3.")
    
    ImagePicker.showImagePicker(IMAGE_PICKER_OPTIONS, (response) => {
      console.log('Response = ', response.path);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Error Message', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        // ImageCropPicker.openCropper({
        //   path: response.uri,
        //   width: 640,
        //   height: 640
        // }).then(image => {
        //   this.setState({
        //     shop_images: [...this.state.shop_images, image],
        //   });
        // });
        
        let error = this.onPickImageValidation(prop, response);
        if(error.status) return Alert.alert('Error Message', error.message);

        let images = this.state[prop];
        images.push('data:image/jpeg;base64,' + response.data);
        this.setState({
          [prop]: images
        });
      }
    });
  }

  onPickImageValidation(prop, data) { //validate drop file extensions & limitation
    let error = { status: false, message: "" };
    if((data.type).indexOf("image/") === -1) {
      error.status = true;
      error.message = `File must not upload except image.`;
      return error;
    }
    if(data.fileSize > 5242880) {
      error.status = true;
      error.message = `File size is not allowed greater than 5MB.`;
      return error;
    }
    return error;
  }

  removeImage(prop, index) {
    let imageArray = this.state[prop];
    let imageArrayToDelete = this.state[prop+"ToDelete"];
    let removedImage = imageArray.splice(index, 1).slice()[0];
    if(removedImage.indexOf("static/") !== -1) {
      imageArrayToDelete.push(removedImage);
    }
    this.setState({ [prop]: imageArray.slice(), [prop+"ToDelete"]: imageArrayToDelete.slice() } );
  }

  cleanTempImage(prop, image, index) {
    ImageCropPicker.cleanSingle(image.path).then(() => {
      console.log('removed tmp image from tmp directory');
    }).catch(e => {
      alert(e);
    });
  }

  handleSave = async () => {
    if(this.state.surveyStatus === "Collected") return Alert.alert('Error Message', "This survey is already collected.");

    let error = this.onSaveValidation();
    if(error.status) return Alert.alert('Error Message', error.message);

    this.setState({ isLoading: true });
    let { surveyKey, collectedDate, smeBusinessName, smeBusinessAddress, gpsLocation, contactPerson, 
      contactPhNo, samplingInfo, smeBusinessPhotosToDelete, productPhotosToDelete, samplePhotosToDelete,
      recordStatus, surveyStatus, surveyRemark, surveyType, smeBusinessPhotos, productPhotos, samplePhotos } = this.state;
    let smeBusinessPhotosArray = smeBusinessPhotos.map((img)=> img.indexOf("static/") === -1 ? img.split('base64,')[1] : img );
    let productPhotosArray = productPhotos.map((img)=> img.indexOf("static/") === -1 ? img.split('base64,')[1] : img );
    let samplePhotosArray = samplePhotos.map((img)=> img.indexOf("static/") === -1 ? img.split('base64,')[1] : img );
    let data = {
      SurveyKey: surveyKey,
      UserKey: this.props.loginUser.userKey,
      CollectedDate: collectedDate !== null ? moment(collectedDate).format("YYYY/MM/DD HH:mm:ss") : null,
      SMEBusinessName: smeBusinessName, 
      SMEBusinessAddress: smeBusinessAddress, 
      GPSLocation: gpsLocation.join(";"),
      ContactPerson: contactPerson, 
      ContactPhNo: contactPhNo, 
      SMEBusinessPhotos: smeBusinessPhotosArray.join(";"), 
      ProductPhotos: productPhotosArray.join(";"),
      SamplePhotos: samplePhotosArray.join(";"),
      SamplingInfo: samplingInfo,
      UpdatedBy: this.props.loginUser.userID,
      SMEBusinessPhotosToDelete: smeBusinessPhotosToDelete,
      ProductPhotosToDelete: productPhotosToDelete,
      SamplePhotosToDelete: samplePhotosToDelete,
      SurveyStatus: surveyStatus,
      RecordStatus: recordStatus,
      SurveyRemark: surveyRemark,
      SurveyType: surveyType,
    };

    if (this.props.isConnected) {
      const res = await Api.post('/api/survey/UpdateFromMobile', data);
      if(!res.status) {
        this.setState({ isLoading: false });
        return Alert.alert('Error', res.message)
      }
    } else {
      this.props.setToUpdateDatas('post', '/api/survey/UpdateFromMobile', data);
    }

    this.setState({ isLoading: false }, () => {
      this.props.setSurveyDetail(
        { 
          surveyKey,
          collectedDate,
          smeBusinessName,
          smeBusinessAddress,
          gpsLocation,
          contactPerson,
          contactPhNo,
          smeBusinessPhotos, 
          productPhotos,
          samplePhotos,
          samplingInfo,
        }
      );
      
      if(this.props.navigation.getParam("loadData") && this.props.isConnected) this.props.navigation.getParam("loadData")();
      this.props.navigation.navigate(SURVEY_LIST);
    });
  }

  onSaveValidation() {
    let error = { status: false, message: "" };
    let { collectedDate, smeBusinessName, smeBusinessAddress, gpsLocation, contactPerson, 
      contactPhNo, smeBusinessPhotos, productPhotos, samplePhotos, samplingInfo,
    } = this.state;
    if(collectedDate === null) {
      error.status = true;
      error.message = `Collected date is required.`;
      return error;
    }
    if(smeBusinessName.length > 100) {
      error.status = true;
      error.message = `SME business name must be maximum lenght of 100.`;
      return error;
    }
    if(smeBusinessAddress.length > 1000) {
      error.status = true;
      error.message = `SME business address must be maximum lenght of 1000.`;
      return error;
    }
    if(gpsLocation && gpsLocation[0] !== "" && isNaN(gpsLocation[0]) ) {
      error.status = true;
      error.message = `GPS latitude must be number.`;
      return error;
    }
    if(gpsLocation && gpsLocation[1] !== "" && isNaN(gpsLocation[1]) ) {
      error.status = true;
      error.message = `GPS longitude must be number.`;
      return error;
    }
    if(gpsLocation && gpsLocation.join(";").length > 50 ) {
      error.status = true;
      error.message = `GPS latitude and longitude values are too long.`;
      return error;
    }
    if(contactPerson.length > 100) {
      error.status = true;
      error.message = `Contact person must be maximum lenght of 100.`;
      return error;
    }
    if(contactPhNo.length > 50) {
      error.status = true;
      error.message = `Contact phone number must be maximum lenght of 50.`;
      return error;
    }
    if(smeBusinessPhotos.length > 3) {
      error.status = true;
      error.message = `SME business photos must not upload more than 3.`;
      return error;
    }
    if(productPhotos.length > 3) {
      error.status = true;
      error.message = `Product photos must not upload more than 3.`;
      return error;
    }
    if(samplePhotos.length > 3) {
      error.status = true;
      error.message = `Sample photos must not upload more than 3.`;
      return error;
    }
    if(samplingInfo.length > 1000) {
      error.status = true;
      error.message = `Sampling Info must be maximum lenght of 1000.`;
      return error;
    }
    return error;
  }

  render() {
    if(this.state.isLoading) return <Loading />
    const { isConnected, isNetworkBannerVisible } = this.props;
    return (
      <View style={[styles.sceneContainer]}  >
        <NetworkStatusBanner
          isConnected={isConnected}
          isVisible={isNetworkBannerVisible}
        />
        <ScrollView onLayout={this.getNewDimensions}>
          {/* {this.state.isLoading && <Loading />} */}
          <View style={[{marginTop: isIos() ? 40 : 20}, styles.container]}>
            <View style={[
                styles.f1, 
                // styles.flexRow, 
                // styles.jSpace, 
                styles.jCenter,
                styles.aCenter,
                styles.pb10
              ]}
            >
              <View style={[styles.f1, styles.flexRow, { alignSelf: 'stretch' }]} >
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>{'Project'}</Text></View>
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>: {this.setOptionLabel("projectKey", this.state.projects)}</Text></View>
              </View>
              <View style={[styles.f1, styles.flexRow, { alignSelf: 'stretch' }]} >
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>{'Survey Code'}</Text></View>
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>: {this.state.surveyCode}</Text></View>
              </View>
              <View style={[styles.f1, styles.flexRow, { alignSelf: 'stretch' }]} >
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>{'Survey Type'}</Text></View>
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>: {this.setOptionLabel("surveyType", this.state.surveyTypes)}</Text></View>
              </View>
              <View style={[styles.f1, styles.flexRow, { alignSelf: 'stretch' }]} >
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>{'Product Name'}</Text></View>
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>: {this.setOptionLabel("productKey", this.state.products)}</Text></View>
              </View>
              <View style={[styles.f1, styles.flexRow, { alignSelf: 'stretch' }]} >
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark, styles.w170, styles.h100]}>{'Product Photo'}</Text></View>
                <View style={[styles.f1, styles.bgLightGrey, styles.bdRad4, { alignSelf: 'stretch' }]}>
                  {this.state.productFishPhotos.length > 0 && <Image
                    source={ { uri: config.SERVER_URL+this.state.productFishPhotos[0] } }
                    style={[styles.bdRad4, { resizeMode: 'contain', width: "100%", height: "100%" }]}
                  />}
                </View>
              </View>
              <View style={[styles.f1, styles.flexRow, { alignSelf: 'stretch' }]} >
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>{'Location'}</Text></View>
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>: {this.setOptionLabel("townshipKey", this.state.townships)+", "+this.setOptionLabel("stateKey", this.state.states)}</Text></View>
              </View>
              <View style={[styles.f1, styles.flexRow, { alignSelf: 'stretch' }]} >
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>{'Created Date'}</Text></View>
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>: {dateFormatter(this.state.surveyCreatedDate)}</Text></View>
              </View>
              <View style={[styles.f1, styles.flexRow, { alignSelf: 'stretch' }]} >
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>{'Team'}</Text></View>
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>: {this.setOptionLabel("userGroupKey", this.state.userGroups)}</Text></View>
              </View>
              <View style={[styles.f1, styles.flexRow, { alignSelf: 'stretch' }]} >
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>{'Remark'}</Text></View>
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>: {this.state.surveyRemark}</Text></View>
              </View>    
              <View style={[styles.f1, styles.flexRow, { alignSelf: 'stretch' }]} >
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>{'Collector'}</Text></View>
                <View style={[styles.f1]}><Text style={[styles.fontMedium18, styles.cAppDark]}>: {this.props.loginUser.userName}</Text></View>
              </View>
            </View>

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Collected Date'}</Text>
            <DatePicker
              date={this.state.collectedDate}
              onDateChange={date => this.setState({ collectedDate: date })}
              // minimumDate={new Date()}
              mode={'date'}
              style={[styles.aCenter, styles.jCenter]}
            />

            <Text style={[styles.fontMedium18, styles.cApp]}>{'SME Business Name'}</Text>
            <Input
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter SME Business Name'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.smeBusinessName}
              onChangeText={text => {
                this.setState({ smeBusinessName: text });
              }}
              // autoFocus={true}
              onSubmitEditing={() => this.refpassword1.focus() }
            />

            <Text style={[styles.fontMedium18, styles.cApp]}>{'SME Business Address'}</Text>
            <Input
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Address'}
              value={this.state.smeBusinessAddress}
              placeholderTextColor={COLOR.GREY}
              onChangeText={text => {
                this.setState({ smeBusinessAddress: text });
              }}
              refInput={(r) => this.refpassword1 = r}
              onSubmitEditing={() => this.refpassword2.focus() }
            />

            <View style={[styles.flexRow, styles.mv10]}>
              <Text style={[styles.fontMedium18, styles.cApp, styles.mr15]}>{'GPS Location'}</Text>
              <Icon type="MaterialCommunityIcons" name="google-maps" size={this.state.iconSize} color={COLOR.GREEN} onPress={this.routeToGoogleMap} />
            </View>
            <Input
              type="number"
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Latitude'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.gpsLocation[0]}
              onChangeText={text => {
                let { gpsLocation } = this.state;
                gpsLocation[0] = text;
                this.setState({ gpsLocation: gpsLocation });
              }}
              refInput={(r) => this.refpassword2 = r}
              onSubmitEditing={() => this.refpassword3.focus() }
            />
            <Input
              type="number"
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Longitude'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.gpsLocation[1]}
              onChangeText={text => {
                let { gpsLocation } = this.state;
                gpsLocation[1] = text;
                this.setState({ gpsLocation: gpsLocation });
              }}
              refInput={(r) => this.refpassword3 = r}
              onSubmitEditing={() => this.refpassword4.focus() }
            />

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Contact Person'}</Text>
            <Input
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Contact Person'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.contactPerson}
              onChangeText={text => {
                this.setState({ contactPerson: text });
              }}
              refInput={(r) => this.refpassword4 = r}
              onSubmitEditing={() => this.refpassword5.focus() }
            />

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Contact Phone Number'}</Text>
            <Input
              type="number"
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Contact Phone Number'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.contactPhNo}
              onChangeText={text => {
                this.setState({ contactPhNo: text });
              }}
              refInput={(r) => this.refpassword5 = r}
              onSubmitEditing={() => this.refpassword6.focus() }
            />

            <View style={[styles.flexRow, styles.mv10]}>
              <Text style={[styles.fontMedium18, styles.cApp, styles.mr15]}>{'SME Business Photo'}</Text>
              <Icon type="AntDesign" name="addfile" size={this.state.iconSize} color={COLOR.GREEN} onPress={()=>this.openImagePicker("smeBusinessPhotos")} />
            </View>
            {this.state.smeBusinessPhotos.length > 0 &&
            <View style={[ styles.f1, styles.flexRow, styles.pv8, { alignSelf: 'stretch' } ]} >
              {this.state.smeBusinessPhotos.map( (image, index) => { 
                image = image.indexOf("static/") === -1 ? image : config.SERVER_URL+image;
                return(
                <View key={index} style={[styles.f1, styles.h115, styles.bgLightGrey, styles.bdRad4, styles.mr5, { alignSelf: 'stretch' }]}>
                  <Image
                    source={ { uri: image } }
                    style={[styles.bdRad4, { resizeMode: 'contain', width: "100%", height: "100%" }]}
                  />
                  <Icon style={styles.rightTop_5} type="AntDesign" name="closecircle" size={this.state.iconSize-5} color={COLOR.RED} onPress={()=>this.removeImage('smeBusinessPhotos', index)} />
                </View>
              )})}
            </View>} 

            <View style={[styles.flexRow, styles.mv10]}>
              <Text style={[styles.fontMedium18, styles.cApp, styles.mr15]}>{'Product Photo'}</Text>
              <Icon type="AntDesign" name="addfile" size={this.state.iconSize} color={COLOR.GREEN} onPress={()=>this.openImagePicker("productPhotos")} />
            </View>
            {this.state.productPhotos.length > 0 &&
            <View style={[ styles.f1, styles.flexRow, styles.pv8, { alignSelf: 'stretch' } ]} >
            {this.state.productPhotos.map( (image, index) => { 
              image = image.indexOf("static/") === -1 ? image : config.SERVER_URL+image;
              return(
              <View key={index} style={[styles.f1, styles.h120, styles.bgLightGrey, styles.bdRad4, styles.mr5, { alignSelf: 'stretch' }]}>
                <Image
                  source={ { uri: image } }
                  style={[styles.bdRad4, { resizeMode: 'contain', width: "100%", height: "100%" }]}
                />
                <Icon style={styles.rightTop_5} type="AntDesign" name="closecircle" size={this.state.iconSize-5} color={COLOR.RED} onPress={()=>this.removeImage('productPhotos', index)} />
              </View>
            )})}
            </View>}

            <View style={[styles.flexRow, styles.mv10]}>
              <Text style={[styles.fontMedium18, styles.cApp, styles.mr15]}>{'Sample Photo'}</Text>
              <Icon type="AntDesign" name="addfile" size={this.state.iconSize} color={COLOR.GREEN} onPress={()=>this.openImagePicker("samplePhotos")} />
            </View>
            {this.state.samplePhotos.length > 0 &&
            <View style={[ styles.f1, styles.flexRow, styles.pv8, { alignSelf: 'stretch' } ]} >
            {this.state.samplePhotos.map( (image, index) => { 
              image = image.indexOf("static/") === -1 ? image : config.SERVER_URL+image;
              return(
              <View key={index} style={[styles.f1, styles.h120, styles.bgLightGrey, styles.bdRad4, styles.mr5, { alignSelf: 'stretch' }]}>
                <Image
                  source={ { uri: image } }
                  style={[styles.bdRad4, { resizeMode: 'contain', width: "100%", height: "100%" }]}
                />
                <Icon style={styles.rightTop_5} type="AntDesign" name="closecircle" size={this.state.iconSize-5} color={COLOR.RED} onPress={()=>this.removeImage('samplePhotos', index)} />
              </View>
            )})}
            </View>}

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Sample Info'}</Text>
            <Input
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Sample Info'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.samplingInfo}
              onChangeText={text => {
                this.setState({ samplingInfo: text })
              }}
              refInput={(r) => this.refpassword6 = r}
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
    surveyDetails: state.survey.surveyDetails,
    toUpdateDatas: state.survey.toUpdateDatas,

    surveyStatuses: state.survey.surveyStatuses,
    projects: state.survey.projects,
    products: state.survey.products,
    states: state.survey.states,
    townships: state.survey.townships,
    userGroups: state.survey.userGroups,
    surveyTypes: state.survey.surveyTypes,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setSurveyDetail: data => {
      dispatch(setSurveyDetail(data))
    },
    setDropDownDatas: data => {
      dispatch(setDropDownDatas(data))
    },
    setToUpdateDatas: (method, apiPath, data) => {
      dispatch(setToUpdateDatas(method, apiPath, data))
    },
    cancelToUpdateDatas: () => {
      dispatch(cancelToUpdateDatas())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TakeSurvey));