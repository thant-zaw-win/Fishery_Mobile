
import React, { Component } from 'react';
import { SectionList, View, Alert, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Text } from 'react-native-paper';

import RegionalSurveyItem from './RegionalSurveyItem';
import { Loading, NetworkStatusBanner } from '../../components';
import styles, { COLOR } from '../../styles';
import { Api, config, REGIONAL_SURVEY_DETAIL } from '../../utilities';
import { setRecentRegionalSurveyKey, setRegionalSurveys, cancelToUpdateDatas } from '../../store/actions';
import { ScrollView } from 'react-native-gesture-handler';

class RegionalSurvey extends Component {
  state = {
    data: [],
    isLoading: true,
    // refreshing: false,
  }

  componentWillMount() {
    this.props.navigation.setParams({ goToNewForm: this.goToNewForm });
  }

  willUnmount = false;
  
  componentWillUnmount() {
    this.willUnmount = true
  }

  // wait(timeout) {
  //   return new Promise(resolve => {
  //     setTimeout(()=>this.initialize(false), timeout);
  //   });
  // }

  onRefresh = () => {
    // this.setState({ refreshing: true });
    // this.wait(2000).then(() => this.setState({ refreshing: false }) );
    this.initialize(false)
  }

  goToNewForm = () => {
    this.props.navigation.navigate(REGIONAL_SURVEY_DETAIL, {
      key: null,
      loadData: this.loadData
    })
  }

  async componentDidMount() {
    const { regionalSurveyList, isConnected, toUpdateDatas } = this.props;
    if (regionalSurveyList.length > 0 && !isConnected) {
      this.setState({ data: regionalSurveyList, isLoading: false });
    } else {
      this.initialize(false);
    }
  }
  
  initialize = async (came_back_online) => {
    const { toUpdateDatas } = this.props;
    if(!came_back_online) {
      this.loadData();
    } else {
      if (toUpdateDatas.length > 0) {
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
    const { isConnected, regionalSurveyList } = this.props;
    if (isConnected && prevProps.isConnected != isConnected) {
      this.initialize(true);
    } else if (!isConnected  && prevProps.isConnected != isConnected) {
      if(regionalSurveyList.length > 0) {
        this.setState({ data: regionalSurveyList, isLoading: false });
      }
    }
  }

  loadData = async () => {
    this.setState({ isLoading: true });
    const res = await Api.get('/api/regionalSurvey');
    if (!res.status) return this.setState({ isLoading: false }, () => {
      const { isConnected, regionalSurveyList } = this.props;
      if (regionalSurveyList.length === 0 && isConnected) {
        Alert.alert('Error', res.message);
      }
    });

    res.data.sort((a, b) => { return b.regionalSurveyKey - a.regionalSurveyKey }); // sorting

    this.setState({ data: res.data }, () => {
      this.setState({ isLoading: false });
      this.props.setRegionalSurveys(res.data);
    });
  }

  renderItem = ({ item, index }) => {
    return <RegionalSurveyItem index={index} item={item} loadData={() => this.loadData()} navigation={this.props.navigation} setRecentKey={(key) => this.props.setRecentRegionalSurveyKey(key)} />;
  };

  renderSectionHeader = ({ section: { title } }) => {
    return (
      <View style={{backgroundColor: '#f2f2f2'}}>
        <Text style={[styles.font14, styles.bold, styles.pv12, styles.ph16, styles.cGrey]}>
          {title}
        </Text>
      </View>
    );
  };

  render() {
    if(this.state.isLoading) return <Loading />
    const { recentRegionalSurveyKey, isConnected, isNetworkBannerVisible } = this.props;
    const recent = this.state.data.filter((item) => item.regionalSurveyKey === recentRegionalSurveyKey );
    const data = [
      { title: 'Recent', data: recent },
      { title: 'All', data: this.state.data }
    ];

    return (
      <View style={{flex: 1}} >
        <NetworkStatusBanner
          isConnected={isConnected}
          isVisible={isNetworkBannerVisible}
        />
        <ScrollView 
          refreshControl={
            <RefreshControl 
              // refreshing={this.state.refreshing} 
              onRefresh={this.onRefresh} 
            />
          }
        >
          <SectionList
            renderItem={this.renderItem}
            renderSectionHeader={this.renderSectionHeader}
            sections={data}
            keyExtractor={(item, index) => item + index}
            // ListHeaderComponent={this.renderHeader}
          />
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
    recentRegionalSurveyKey: state.survey.recentRegionalSurveyKey,
    regionalSurveyList: state.survey.regionalSurveyList,
    toUpdateDatas: state.survey.toUpdateDatas,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setRecentRegionalSurveyKey: data => {
      dispatch(setRecentRegionalSurveyKey(data))
    },
    setRegionalSurveys: data => {
      dispatch(setRegionalSurveys(data))
    },
    cancelToUpdateDatas: () => {
      dispatch(cancelToUpdateDatas())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(RegionalSurvey));