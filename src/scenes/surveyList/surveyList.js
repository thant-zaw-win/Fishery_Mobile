
import React, { Component } from 'react';
import { SectionList, View, Alert, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Text } from 'react-native-paper';

import SurveyItem from './SurveyItem';
import { Loading, NetworkStatusBanner } from '../../components';
import styles, { COLOR } from '../../styles';
import { Api, config } from '../../utilities';
import { setRecentSurveyKey, setSurveys, cancelToUpdateDatas } from '../../store/actions';
import { ScrollView } from 'react-native-gesture-handler';

class SurveyList extends Component {
  state = {
    data: [],
    isLoading: true
  }

  willUnmount = false;
  
  componentWillUnmount() {
    this.willUnmount = true
  }

  onRefresh = () => {
    this.initialize(false)
  }

  async componentDidMount() {
    const { surveyList, isConnected, toUpdateDatas } = this.props;
    if (surveyList.length > 0 && !isConnected) {
      this.setState({ data: surveyList, isLoading: false });
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
    const { isConnected, surveyList } = this.props;
    if (isConnected && prevProps.isConnected != isConnected) {
      this.initialize(true);
    } else if (!isConnected  && prevProps.isConnected != isConnected) {
      if(surveyList.length > 0) {
        this.setState({ data: surveyList, isLoading: false });
      }
    }
  }

  async loadData() {
    const data = {
      surveyStatus: ['Allocated', 'Collected'],
      userGroupKey: [this.props.loginUser.userGroupKey],
    };
    this.setState({ isLoading: true });
    const res = await Api.post('/api/survey/filterBy', data);
    if (!res.status) return this.setState({ isLoading: false }, () => {
      const { isConnected, surveyList } = this.props;
      if (surveyList.length === 0 && isConnected) {
        Alert.alert('Error', res.message);
      }
    });

    res.data.records.sort((a, b) => { return b.surveyKey - a.surveyKey }); // sorting

    this.setState({ data: res.data.records }, () => {
      this.setState({ isLoading: false });
      this.props.setSurveys(res.data.records);
    });
  }

  renderItem = ({ item, index }) => {
    return <SurveyItem index={index} item={item} loadData={() => this.loadData()} navigation={this.props.navigation} setRecentKey={(key) => this.props.setRecentSurveyKey(key)} />;
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
    const { recentSurveyKey, isConnected, isNetworkBannerVisible } = this.props;
    const recent = this.state.data.filter((item) => item.surveyKey === recentSurveyKey );
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
    recentSurveyKey: state.survey.recentSurveyKey,
    isConnected: state.network.isConnected,
    isNetworkBannerVisible: state.survey.isNetworkBannerVisible,
    surveyList: state.survey.surveyList,
    // surveyDetails: state.survey.surveyDetails,
    toUpdateDatas: state.survey.toUpdateDatas,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setRecentSurveyKey: data => {
      dispatch(setRecentSurveyKey(data))
    },
    setSurveys: data => {
      dispatch(setSurveys(data))
    },
    cancelToUpdateDatas: () => {
      dispatch(cancelToUpdateDatas())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(SurveyList));