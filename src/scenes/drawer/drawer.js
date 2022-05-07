import React from 'react';
import { createDrawerNavigator } from 'react-navigation';

import DrawerSideMenu from './drawerSideMenu';
import { ABOUT, SETTING, PROFILE, SURVEY_LIST, TAKE_SURVEY, GOOGLE_MAP, CHANGE_PASSWORD, 
  TRAINING, TRAINING_DETAIL, REGIONAL_SURVEY, REGIONAL_SURVEY_DETAIL, EVENT, EVENT_DETAIL, width, containerStackNavigator } from '../../utilities';

import SurveyList from '../surveyList/surveyList';
import GoogleMap from '../googleMap/googleMap';
import TakeSurvey from '../takeSurvey/takeSurvey';
import Profile from '../profile/profile';
import About from '../about/about';
import Setting from '../setting/setting';
import ChangePassword from '../changePassword/changePassword';
import Training from '../training';
import TrainingDetail from '../trainingDetail';
import RegionalSurvey from '../regionalSurvey';
import RegionalSurveyDetail from '../regionalSurveyDetail';
import Event from '../event';
import EventDetail from '../eventDetail';

const DRAWER_ROUTES = {
  [SURVEY_LIST]: {
    screen: containerStackNavigator(
      [SurveyList, TakeSurvey, GoogleMap], // component
      [SURVEY_LIST, TAKE_SURVEY, GOOGLE_MAP], // title
      [true, false, false], // isMenu ?
      [null, 'Save', 'Confirm'], // isRightButton ?
      [null, 'handleSave', 'saveLocation'], // isRightButton Action ?
    ),
  },
  [TRAINING]: {
    screen: containerStackNavigator(
      [Training, TrainingDetail], 
      [TRAINING, TRAINING_DETAIL], 
      [true, false],
      ['Create', 'Save'],
      ['goToNewForm', 'handleSave'],
    ),
  },
  [REGIONAL_SURVEY]: {
    screen: containerStackNavigator(
      [RegionalSurvey, RegionalSurveyDetail], 
      [REGIONAL_SURVEY, REGIONAL_SURVEY_DETAIL], 
      [true, false],
      ['Create', 'Save'],
      ['goToNewForm', 'handleSave'],
    ),
  },
  [EVENT]: {
    screen: containerStackNavigator(
      [Event, EventDetail], 
      [EVENT, EVENT_DETAIL], 
      [true, false],
      ['Create', 'Save'],
      ['goToNewForm', 'handleSave'],
    ),
  },
  [PROFILE]: {
    screen: containerStackNavigator(
      [Profile, ChangePassword], 
      [PROFILE, CHANGE_PASSWORD],
      [true, false],
      [null, 'Save'],
      [null, 'handleChangePassword'],
    ),
  },
  // [ABOUT]: {
  //   screen: containerStackNavigator(About, ABOUT),
  // },
  // [SETTING]: {
  //   screen: containerStackNavigator(Setting, SETTING),
  // },
};

const DRAWER_ROUTES_CONFIG = {
  initialRouteName: EVENT,
  drawerWidth: width - 50,
  contentComponent: props => <DrawerSideMenu {...props} />
};

export default createDrawerNavigator(DRAWER_ROUTES, DRAWER_ROUTES_CONFIG);
