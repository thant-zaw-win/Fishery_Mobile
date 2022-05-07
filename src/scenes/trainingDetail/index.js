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
import { Api, config, TRAINING, copyArrayObjByNoRef, dateFormatter, isIos } from '../../utilities';
  import { setDropDownDatas, setTrainingDetail, setToUpdateDatas, cancelToUpdateDatas } from '../../store/actions';

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

class TrainingDetail extends React.Component {
  state = {
    isLoading: false,
    trainingPhotosToDelete: [],
    trainingMaterialsToDelete: [],
    iconSize: 26,
    isEdit: true,

    trainingKey: 0,
    trainingDate: moment().toDate(),
    categoryKey: null,
    trainingCategories: [],
    subCategoryKey: null,
    trainingSubCategories: [],
    recordStatus: "Active",

    title: "",
    purpose: "",
    trainer: "",
    duration: "",
    audience: "",
    attendance: null, // number
    trainingPhotos: [],
    trainingMaterials: [],
  }
  
  componentWillMount() {
    this.props.navigation.setParams({ handleSave: this.handleSave });
  }

  async componentDidMount() {
    const { navigation, isConnected, trainingCategories, trainingSubCategories } = this.props;
    const key = navigation.getParam('key');

    this.setState({
      trainingCategories,
      trainingSubCategories,
    });

    if (key) {
      if (!isConnected) { // setData for offline
        const haveOfflineData = this.setOfflineDatas(key);
        if (!haveOfflineData || trainingCategories.length == 0 || trainingSubCategories.length == 0) {
          Alert.alert('Offline Mode', "There is no memory data in device for offline mode.", undefined, { cancelable: false });
          this.props.navigation.navigate(TRAINING);
        }
      } else {
        this.initialize(false);
      }
    } else {
      if (isConnected) {
        this.setState({ isEdit: false });
        this.initialize(false);
      } else {
        if (trainingCategories.length > 0 && trainingSubCategories.length > 0) {
          this.setState({ isEdit: false });
        } else {
          Alert.alert('Offline Mode', "There is no memory data in device for offline mode.", undefined, { cancelable: false });
          this.props.navigation.navigate(TRAINING);
        }
      }
    }
  }

  setOfflineDatas(key) {
    const { isConnected, trainingDetails
    } = this.props;
    const data = trainingDetails.filter(item => item.trainingKey === key )[0];
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
      let res = await Api.get(`/api/training/${key}`);
      
      if(!res.status) return this.setState({ isLoading: false }, () => {
        const isSetOfflineData = this.setOfflineDatas(key);
        if (!isSetOfflineData) {
          Alert.alert('Error', res.message);
          this.props.navigation.navigate(TRAINING);
        }
      });

      res.data.attendance = res.data.attendance.toString();

      res.data.trainingPhotos = res.data.trainingPhotos ? res.data.trainingPhotos.split(";") : [];
      res.data.trainingMaterials = res.data.trainingMaterials ? res.data.trainingMaterials.split(";") : [];

      res.data.trainingPhotosToDelete = [];
      res.data.trainingMaterialsToDelete = [];

      res.data.trainingDate = res.data.trainingDate || moment(); // default

      this.setState(res.data, () => {
        this.props.setTrainingDetail(res.data);
        this.loadOptions(key);
      });
    } else {
      this.loadOptions(null);
    }
  }

  async loadOptions(key) {
    const trainingCategoryList = await Api.get('/api/trainingcategory/bystatus/active');
    const trainingSubCategoryList = await Api.get('/api/trainingsubcategory/bystatus/active');

    const isHaveTC = trainingCategoryList.data.filter( (item) => item.trainingCategoryKey === this.state.categoryKey);
    const isHaveTSC = trainingSubCategoryList.data.filter( (item) => item.trainingSubCategoryKey === this.state.subCategoryKey);

    const trainingCategories = this.addSelectOptions(trainingCategoryList.data, "trainingCategoryKey", "categoryName", isHaveTC.length > 0 ? undefined : { value: this.state.categoryKey, label: this.state.categoryName }, undefined);
    const trainingSubCategories = this.addSelectOptions(trainingSubCategoryList.data, "trainingSubCategoryKey", "subCategoryName", isHaveTSC.length > 0 ? undefined : { value: this.state.subCategoryKey, label: this.state.subCategoryName }, undefined);
    this.setState({ trainingCategories, trainingSubCategories }, () => {
      // if(key) this.props.setTrainingDetail({ trainingKey: key });
      this.props.setDropDownDatas({ trainingCategories, trainingSubCategories });
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
      trainingPhotosToDelete,
      trainingMaterialsToDelete,
      trainingKey,
      trainingDate,
      title,
      purpose,
      trainer,
      duration,
      audience,
      attendance,
      categoryKey,
      categoryName,
      subCategoryKey,
      subCategoryName,
      trainingPhotos,
      trainingMaterials,
      recordStatus,
      isEdit
    } = this.state;

    let trainingPhotosArray = trainingPhotos.map((img)=> img.indexOf("static/") === -1 ? img.split('base64,')[1] : img );
    let trainingMaterialsArray = trainingMaterials.map((img)=> img.indexOf("static/") === -1 ? img.split('base64,')[1] : img );

    const apiMethod = "post";
    const createdBY = isEdit ? "UpdatedBy" : "CreatedBy";
    const apiPath = isEdit ? "/api/training/UpdateFromMobile" : "/api/training/CreateFromMobile";
    let data = {
      TrainingKey: trainingKey,
      TrainingDate: trainingDate !== null ? moment(trainingDate).format("YYYY/MM/DD HH:mm:ss") : null,
      Title: title, 
      Purpose: purpose,
      Trainer: trainer, 
      Duration: duration, 
      Audience: audience,
      Attendance: Number(attendance),
      CategoryKey: categoryKey,
      CategoryName: categoryName,
      SubCategoryKey: subCategoryKey,
      SubCategoryName: subCategoryName,
      TrainingPhotos: trainingPhotosArray.join(";"), 
      TrainingMaterials: trainingMaterialsArray.join(";"),
      [createdBY]: this.props.loginUser.userID,
      TrainingPhotosToDelete: trainingPhotosToDelete,
      TrainingMaterialsToDelete: trainingMaterialsToDelete,
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
        this.props.setTrainingDetail({
          trainingKey,
          trainingDate,
          categoryKey,
          subCategoryKey,
          title,
          purpose,
          trainer,
          duration,
          audience,
          attendance,
          trainingPhotos,
          trainingMaterials,
        });
      }

      if(this.props.navigation.getParam("loadData") && this.props.isConnected) this.props.navigation.getParam("loadData")();
      this.props.navigation.navigate(TRAINING);
    });
  }

  onSaveValidation() {
    let error = { status: false, message: "" };
    let { trainingDate, title, purpose, trainer, duration, audience, attendance, categoryKey, subCategoryKey } = this.state;
    if (title.trim() === "") {
      error.status = true;
      error.message = `Title cannot be blank.`;
      return error;
    }
    if (title.length > 100) {
      error.status = true;
      error.message = `Title must be maximum lenght of 100.`;
      return error;
    }
    if (trainingDate === null) {
      error.status = true;
      error.message = `Training date is required.`;
      return error;
    }
    if (categoryKey === null) {
      error.status = true;
      error.message = `Category cannot be blank.`;
      return error;
    }
    if (subCategoryKey === null) {
      error.status = true;
      error.message = `Subcategory cannot be blank.`;
      return error;
    }
    if (purpose.trim() === "") {
      error.status = true;
      error.message = `Purpose cannot be blank.`;
      return error;
    }
    if (purpose.length > 500) {
      error.status = true;
      error.message = `Purpose must be maximum lenght of 500.`;
      return error;
    }
    if (trainer.trim() === "") {
      error.status = true;
      error.message = `Trainer cannot be blank.`;
      return error;
    }
    if (trainer.length > 50) {
      error.status = true;
      error.message = `Trainer must be maximum lenght of 50.`;
      return error;
    }
    if (duration.trim() === "") {
      error.status = true;
      error.message = `Duration cannot be blank.`;
      return error;
    }
    if (duration.length > 100) {
      error.status = true;
      error.message = `Duration must be maximum lenght of 100.`;
      return error;
    }
    if (audience.trim() === "") {
      error.status = true;
      error.message = `Audience cannot be blank.`;
      return error;
    }
    if (audience.length > 100) {
      error.status = true;
      error.message = `Audience must be maximum lenght of 100.`;
      return error;
    }
    if (attendance.trim() === "") {
      error.status = true;
      error.message = `Total audience cannot be blank.`;
      return error;
    }
    // if (attendance.length > 100) {
    //   error.status = true;
    //   error.message = `Total audience must be maximum lenght of 100.`;
    //   return error;
    // }
    if (!Number(attendance.trim())) {
      error.status = true;
      error.message = `Total audience must be number.`;
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

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Title'}</Text>
            <Input
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Title'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.title}
              onChangeText={text => {
                this.setState({ title: text });
              }}
              // autoFocus = {true}
              onSubmitEditing={() => this.refpassword1.focus() }
            />

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Date'}</Text>
            <DatePicker
              date={this.state.trainingDate}
              onDateChange={date => this.setState({ trainingDate: date })}
              // minimumDate={new Date()}
              mode={'date'}
              style={[styles.aCenter, styles.jCenter]}
            />
          
            <Text style={[styles.fontMedium18, styles.cApp]}>{'Category'}</Text>
            <Picker
              selectedValue={this.state.categoryKey}
              style={[{width: this.state.inputWidth}, styles.cBlack, styles.h80]}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ categoryKey: itemValue })
              }>
              <Picker.Item label={"Please Select"} value={null} />
              {this.state.trainingCategories.map( (item, i) => 
                <Picker.Item key={i} label={item.label} value={item.value}  />
              )}
            </Picker>

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Sub-Category'}</Text>
            <Picker
              selectedValue={this.state.subCategoryKey}
              enabled={true}
              style={[{width: this.state.inputWidth}, styles.cBlack, styles.h80]}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ subCategoryKey: itemValue })
              }>
              <Picker.Item label={"Please Select"} value={null} />
              {this.state.trainingSubCategories.map( (item, i) => 
                <Picker.Item key={i} label={item.label} value={item.value}  />
              )}
            </Picker>

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Purpose'}</Text>
            <Input
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Purpose'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.purpose}
              onChangeText={text => {
                this.setState({ purpose: text });
              }}
              refInput={(r) => this.refpassword1 = r}
              onSubmitEditing={() => this.refpassword2.focus() }
            />

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Trainer'}</Text>
            <Input
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Trainer'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.trainer}
              onChangeText={text => {
                this.setState({ trainer: text });
              }}
              refInput={(r) => this.refpassword2 = r}
              onSubmitEditing={() => this.refpassword3.focus() }
            />

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Duration'}</Text>
            <Input
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Duration'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.duration}
              onChangeText={text => {
                this.setState({ duration: text });
              }}
              refInput={(r) => this.refpassword3 = r}
              onSubmitEditing={() => this.refpassword4.focus() }
            />

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Audience'}</Text>
            <Input
              width={this.state.inputWidth}
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Audience'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.audience}
              onChangeText={text => {
                this.setState({ audience: text });
              }}
              refInput={(r) => this.refpassword4 = r}
              onSubmitEditing={() => this.refpassword5.focus() }
            />

            <Text style={[styles.fontMedium18, styles.cApp]}>{'Total Audience'}</Text>
            <Input
              width={this.state.inputWidth}
              type="number"
              borderBottomColor={COLOR.GREY}
              inputStyle={[styles.cBlack, styles.fontMedium18]}
              placeholder={'Enter Total Audience'}
              placeholderTextColor={COLOR.GREY}
              value={this.state.attendance}
              onChangeText={text => {
                this.setState({ attendance: text });
              }}
              refInput={(r) => this.refpassword5 = r}
            />
            
            <View style={[styles.flexRow, styles.mv10]}>
              <Text style={[styles.fontMedium18, styles.cApp, styles.mr15]}>{'Training Photos'}</Text>
              <Icon type="AntDesign" name="addfile" size={this.state.iconSize} color={COLOR.GREEN} onPress={()=>this.openImagePicker("trainingPhotos")} />
            </View>
            {this.state.trainingPhotos.length > 0 &&
            <View style={[ styles.f1, styles.flexRow, styles.pv8, { alignSelf: 'stretch' } ]} >
              {this.state.trainingPhotos.map( (image, index) => { 
                image = image.indexOf("static/") === -1 ? image : config.SERVER_URL+image;
                return(
                <View key={index} style={[styles.f1, styles.h115, styles.bgLightGrey, styles.bdRad4, styles.mr5, { alignSelf: 'stretch' }]}>
                  <Image
                    source={ { uri: image } }
                    style={[styles.bdRad4, { resizeMode: 'contain', width: "100%", height: "100%" }]}
                  />
                  <Icon style={styles.rightTop_5} type="AntDesign" name="closecircle" size={this.state.iconSize-5} color={COLOR.RED} onPress={()=>this.removeImage('trainingPhotos', index)} />
                </View>
              )})}
            </View>} 

            <View style={[styles.flexRow, styles.mv10]}>
              <Text style={[styles.fontMedium18, styles.cApp, styles.mr15]}>{'Training Materials'}</Text>
              <Icon type="AntDesign" name="addfile" size={this.state.iconSize} color={COLOR.GREEN} onPress={()=>this.openImagePicker("trainingMaterials")} />
            </View>
            {this.state.trainingMaterials.length > 0 &&
            <View style={[ styles.f1, styles.flexRow, styles.pv8, { alignSelf: 'stretch' } ]} >
            {this.state.trainingMaterials.map( (image, index) => { 
              image = image.indexOf("static/") === -1 ? image : config.SERVER_URL+image;
              return(
              <View key={index} style={[styles.f1, styles.h120, styles.bgLightGrey, styles.bdRad4, styles.mr5, { alignSelf: 'stretch' }]}>
                <Image
                  source={ { uri: image } }
                  style={[styles.bdRad4, { resizeMode: 'contain', width: "100%", height: "100%" }]}
                />
                <Icon style={styles.rightTop_5} type="AntDesign" name="closecircle" size={this.state.iconSize-5} color={COLOR.RED} onPress={()=>this.removeImage('trainingMaterials', index)} />
              </View>
            )})}
            </View>}
            
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
    trainingDetails: state.survey.trainingDetails,
    toUpdateDatas: state.survey.toUpdateDatas,
    trainingCategories: state.survey.trainingCategories,
    trainingSubCategories: state.survey.trainingSubCategories,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setTrainingDetail: data => {
      dispatch(setTrainingDetail(data))
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TrainingDetail));