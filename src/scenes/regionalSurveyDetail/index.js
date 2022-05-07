import React from 'react';
import { View, TouchableOpacity, ScrollView, Text, Image, Alert, Picker } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { Input, Icon, Loading, NetworkStatusBanner } from '../../components';
import styles, { COLOR } from '../../styles';
import { Api, config, REGIONAL_SURVEY, copyArrayObjByNoRef, dateFormatter, isIos } from '../../utilities';
  import { setDropDownDatas, setRegionalSurveyDetail, setToUpdateDatas, cancelToUpdateDatas } from '../../store/actions';

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

class RegionalSurveyDetail extends React.Component {
  state = {
    isLoading: false,
    iconSize: 26,
    isEdit: true,

    regionalSurveyKey: 0,
    surveyTitle: "",
    surveyDate: moment().toDate(), 
    stateKey: null,
    townshipKey: null,   
    surveyDescription: "",
    objective: "",
    conclusion: "",
    surveyImages: [],
    surveyImagesToDelete: [],
    surveyOutcome: "",
    recordStatus: "Active",
    states: [],
    townships: [],
  }
  
  componentWillMount() {
    this.props.navigation.setParams({ handleSave: this.handleSave });
  }

  async componentDidMount() {
    const { navigation, isConnected, states, townships } = this.props;
    const key = navigation.getParam('key');

    this.setState({
      states,
      townships,
    });

    if (key) {
      if (!isConnected) { // setData for offline
        const haveOfflineData = this.setOfflineDatas(key);
        if (!haveOfflineData || states.length == 0 || townships.length == 0) {
          Alert.alert('Offline Mode', "There is no memory data in device for offline mode.", undefined, { cancelable: false });
          this.props.navigation.navigate(REGIONAL_SURVEY);
        }
      } else {
        this.initialize(false);
      }
    } else {
      if (isConnected) {
        this.setState({ isEdit: false });
        this.initialize(false);
      } else {
        if (states.length > 0 && townships.length > 0) {
          this.setState({ isEdit: false });
        } else {
          Alert.alert('Offline Mode', "There is no memory data in device for offline mode.", undefined, { cancelable: false });
          this.props.navigation.navigate(REGIONAL_SURVEY);
        }
      }
    }
  }

  setOfflineDatas(key) {
    const { isConnected, regionalSurveyDetails
    } = this.props;
    const data = regionalSurveyDetails.filter(item => item.regionalSurveyKey === key )[0];
    if (data && !isConnected) {
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
    if (key) {
      let res = await Api.get(`/api/regionalsurvey/${key}`);
      
      if(!res.status) return this.setState({ isLoading: false }, () => {
        const isSetOfflineData = this.setOfflineDatas(key);
        if (!isSetOfflineData) {
          Alert.alert('Error', res.message);
          this.props.navigation.navigate(REGIONAL_SURVEY);
        }
      });

      res.data.surveyImages = res.data.surveyImages ? res.data.surveyImages.split(";") : [];

      res.data.surveyImagesToDelete = [];

      res.data.surveyDate = res.data.surveyDate || moment(); // default

      this.setState(res.data, () => {
        this.props.setRegionalSurveyDetail(res.data);
        this.loadOptions(key);
      });
    } else {
      this.loadOptions(null);
    }
  }

  async loadOptions(key) {
    const stateList = await Api.get('/api/other/state');
    const townshipList = await Api.get('/api/other/township');

    const states = this.addSelectOptions(stateList.data, "sR_Pcode", "state_Region", undefined, undefined);
    const townships = this.addSelectOptions(townshipList.data, "tS_Pcode", "township", undefined, undefined, "sR_Pcode");
    this.setState({ states, townships }, () => {
      this.props.setDropDownDatas({ states, townships });
      this.setState({ isLoading: false });
    });
  }

  addSelectOptions(newOptions = [], key, name, defaultValue = { value: null, label: null }, defaultOptionsValue, parentId) {
    let options = copyArrayObjByNoRef(defaultOptionsValue);    
    if(defaultValue.value !== null && defaultValue.label !== null) options.push(defaultValue);
    let l = options.length;
    for (var i = 0; i < newOptions.length; i++) {
      options[l+i] = {};
      for (var prop in newOptions[i]) {
        switch(prop) {
          case key: options[l+i].value = newOptions[i][prop]; break;
          case name: options[l+i].label = newOptions[i][prop]; break;
          case parentId: options[l+i].parentId = newOptions[i][prop]; break;
        }
      }
    }
    return options;
  }

  setOptionLabel(prop, selectOption) {
    let value = selectOption.filter( v => v.value === this.state[prop])[0];
    return value ? value.label : "";
  }

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

  handleSave = async () => {
    // if(this.state.surveyStatus === "Collected") return Alert.alert('Error Message', "This survey is already collected.");

    let error = this.onSaveValidation();
    if(error.status) return Alert.alert('Error Message', error.message);

    this.setState({ isLoading: true });

    let { 
      regionalSurveyKey,
      surveyTitle,
      surveyDate,
      stateKey,
      townshipKey,
      surveyDescription,
      objective,
      conclusion,
      surveyImages,
      surveyImagesToDelete,
      surveyOutcome,
      recordStatus,
      isEdit
    } = this.state;

    let surveyImagesArray = surveyImages.map((img)=> img.indexOf("static/") === -1 ? img.split('base64,')[1] : img );

    const apiMethod = "post";
    const createdBY = isEdit ? "UpdatedBy" : "CreatedBy";
    const apiPath = isEdit ? "/api/regionalsurvey/UpdateFromMobile" : "/api/regionalsurvey/CreateFromMobile";
    let data = {
      RegionalSurveyKey: regionalSurveyKey,
      SurveyTitle: surveyTitle,
      SurveyDate: surveyDate !== null ? moment(surveyDate).format("YYYY/MM/DD HH:mm:ss") : null,
      SurveyDescription: surveyDescription,
      StateKey: stateKey,
      TownshipKey: townshipKey,
      Objective: objective,
      Conclusion: conclusion,
      SurveyOutcome: surveyOutcome,
      SurveyImages: surveyImagesArray.join(";"), 
      [createdBY]: this.props.loginUser.userID,
      SurveyImagesToDelete: surveyImagesToDelete,
      RecordStatus: recordStatus,
    };
    

    if (this.props.isConnected) {
      const res = await Api[apiMethod](apiPath, data);
      if(!res.status) {
        this.setState({ isLoading: false });
        return Alert.alert('Error', res.message)
      }
    } else {
      this.props.setToUpdateDatas(apiMethod, apiPath, data);
    }

    
    this.setState({ isLoading: false }, () => {
      if(isEdit) {
        this.props.setRegionalSurveyDetail({
          regionalSurveyKey,
          surveyTitle,
          surveyDate,
          stateKey,
          townshipKey,
          surveyDescription,
          objective,
          conclusion,
          surveyOutcome,
          surveyImages,
        });
      }

      if(this.props.navigation.getParam("loadData") && this.props.isConnected) this.props.navigation.getParam("loadData")();
      this.props.navigation.navigate(REGIONAL_SURVEY);
    });
  }

  onSaveValidation() {
    let error = { status: false, message: "" };
    let { regionalSurveyKey,
      surveyTitle,
      surveyDate,
      stateKey,
      townshipKey,
      surveyDescription,
      objective,
      conclusion,
      surveyOutcome,
      surveyImages 
    } = this.state;
    if (surveyTitle.trim() === "") {
      error.status = true;
      error.message = `Title cannot be blank.`;
      return error;
    }
    if (surveyTitle.length > 100) {
      error.status = true;
      error.message = `Title must be maximum lenght of 100.`;
      return error;
    }
    if (surveyDate === null) {
      error.status = true;
      error.message = `Date is required.`;
      return error;
    }
    if (stateKey === null) {
      error.status = true;
      error.message = `State cannot be blank.`;
      return error;
    }
    if (townshipKey === null) {
      error.status = true;
      error.message = `Township cannot be blank.`;
      return error;
    }
    if (surveyDescription.trim() === "") {
      error.status = true;
      error.message = `Description cannot be blank.`;
      return error;
    }
    if (surveyDescription.length > 1000) {
      error.status = true;
      error.message = `Description must be maximum lenght of 1000.`;
      return error;
    }
    if (objective.trim() === "") {
      error.status = true;
      error.message = `Objective cannot be blank.`;
      return error;
    }
    if (objective.length > 100) {
      error.status = true;
      error.message = `Objective must be maximum lenght of 100.`;
      return error;
    }
    if (conclusion.trim() === "") {
      error.status = true;
      error.message = `Conclusion cannot be blank.`;
      return error;
    }
    if (conclusion.length > 100) {
      error.status = true;
      error.message = `Conclusion must be maximum lenght of 100.`;
      return error;
    }
    if (surveyOutcome.trim() === "") {
      error.status = true;
      error.message = `Survey Outcome cannot be blank.`;
      return error;
    }
    if (surveyOutcome.length > 100) {
      error.status = true;
      error.message = `Survey Outcome must be maximum lenght of 100.`;
      return error;
    }
    if (surveyImages.length <= 0) {
      error.status = true;
      error.message = `Survey Images cannot be blank.`;
      return error;
    }
    
    return error;
  }

  render() {
    let filteredTownships = [];
    if(this.state.townships.length > 0)
    filteredTownships = this.state.townships.filter( v => v.parentId === this.state.stateKey) || [];

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

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Title'}</Text>
            <Input
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Title'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.surveyTitle}
              onChangeText={text => {
                this.setState({ surveyTitle: text });
              }}
              // autoFocus = {true}
              onSubmitEditing={() => this.refpassword2.focus() }
            />

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Date'}</Text>
            <DatePicker
              date={this.state.surveyDate}
              onDateChange={date => this.setState({ surveyDate: date })}
              // minimumDate={new Date()}
              mode={'date'}
              style={[styles.aCenter, styles.jCenter]}
            />
          
            <Text style={[styles.fontMedium18, styles.cApp]}>{'State'}</Text>
            <Picker
              selectedValue={this.state.stateKey}
              style={[{width: this.state.inputWidth}, styles.cBlack, styles.h80]}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ stateKey: itemValue, townshipKey: null })
              }>
              <Picker.Item label={"Please Select"} value={null} />
              {this.state.states.map( (item, i) => 
                <Picker.Item key={i} label={item.label} value={item.value} />
              )}
            </Picker>

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Township'}</Text>
            <Picker
              selectedValue={this.state.townshipKey}
              enabled={true}
              style={[{width: this.state.inputWidth}, styles.cBlack, styles.h80]}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ townshipKey: itemValue })
              }>
              <Picker.Item label={"Please Select"} value={null} />
              {filteredTownships.map( (item, i) => 
                <Picker.Item key={i} label={item.label} value={item.value} />
              )}
            </Picker>

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Description'}</Text>
            <Input
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Description'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.surveyDescription}
              onChangeText={text => {
                this.setState({ surveyDescription: text });
              }}
              refInput={(r) => this.refpassword2 = r}
              onSubmitEditing={() => this.refpassword3.focus() }
            />

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Objective'}</Text>
            <Input
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Objective'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.objective}
              onChangeText={text => {
                this.setState({ objective: text });
              }}
              refInput={(r) => this.refpassword3 = r}
              onSubmitEditing={() => this.refpassword4.focus() }
            />

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Conclusion'}</Text>
            <Input
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Conclusion'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.conclusion}
              onChangeText={text => {
                this.setState({ conclusion: text });
              }}
              refInput={(r) => this.refpassword4 = r}
              onSubmitEditing={() => this.refpassword5.focus() }
            />
            
            <View style={[styles.flexRow, styles.mv10]}>
              <Text style={[styles.fontMedium18, styles.cApp, styles.mr15]}>{'Survey Images'}</Text>
              <Icon type="AntDesign" name="addfile" size={this.state.iconSize} color={COLOR.GREEN} onPress={()=>this.openImagePicker("surveyImages")} />
            </View>
            {this.state.surveyImages.length > 0 &&
            <View style={[ styles.f1, styles.flexRow, styles.pv8, { alignSelf: 'stretch' } ]} >
              {this.state.surveyImages.map( (image, index) => { 
                image = image.indexOf("static/") === -1 ? image : config.SERVER_URL+image;
                return(
                <View key={index} style={[styles.f1, styles.h115, styles.bgLightGrey, styles.bdRad4, styles.mr5, { alignSelf: 'stretch' }]}>
                  <Image
                    source={ { uri: image } }
                    style={[styles.bdRad4, { resizeMode: 'contain', width: "100%", height: "100%" }]}
                  />
                  <Icon style={styles.rightTop_5} type="AntDesign" name="closecircle" size={this.state.iconSize-5} color={COLOR.RED} onPress={()=>this.removeImage('surveyImages', index)} />
                </View>
              )})}
            </View>} 

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Survey Outcome'}</Text>
            <Input
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Survey Outcome'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.surveyOutcome}
              onChangeText={text => {
                this.setState({ surveyOutcome: text });
              }}
              refInput={(r) => this.refpassword5 = r}
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
    regionalSurveyDetails: state.survey.regionalSurveyDetails,
    toUpdateDatas: state.survey.toUpdateDatas,
    states: state.survey.states,
    townships: state.survey.townships,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setRegionalSurveyDetail: data => {
      dispatch(setRegionalSurveyDetail(data))
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(RegionalSurveyDetail));