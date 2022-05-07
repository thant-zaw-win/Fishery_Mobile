import {
  SET_LOGGEDIN_USER,
  SET_RECENT_SURVEY_KEY,
  SET_SURVEYS,
  SET_SURVEY_DETAILS,
  SET_RECENT_TRAINING_KEY,
  SET_TRAININGS,
  SET_TRAINING_DETAILS,
  SET_RECENT_REGIONAL_SURVEY_KEY,
  SET_REGIONAL_SURVEYS,
  SET_REGIONAL_SURVEY_DETAILS,
  SET_RECENT_EVENT_KEY,
  SET_EVENTS,
  SET_EVENT_DETAILS,
  SET_TO_UPDATE_DATAS,
  CLEAN_TO_UPDATE_DATAS,
  SET_DROPDOWN_DATAS,
} from './actions';

import { offlineActionTypes, reducer as network } from "react-native-offline";

const initialState = {
  loginUser: null,
  recentSurveyKey: null,
  recentTrainingKey: null,
  recentRegionalSurveyKey: null,
  recentEventKey: null,
  isNetworkBannerVisible: false,
  surveyList: [],
  surveyDetails: [],
  trainingList: [],
  trainingDetails: [],
  regionalSurveyList: [],
  regionalSurveyDetails: [],
  eventList: [],
  eventDetails: [],
  toUpdateDatas: [],

  // survey picker datas
  surveyStatuses: [],
  projects: [],
  products: [],
  states: [],
  townships: [],
  userGroups: [],
  surveyTypes: [],

  // training picker datas
  trainingCategories: [],
  trainingSubCategories: [],

  // regionalSurvey picker datas
  //
}

export function surveyReducer(state = initialState, action) {
  switch (action.type) {
    /* USER */
    case SET_LOGGEDIN_USER:
      return Object.assign({}, state, {
        loginUser: action.payload
      });
    /* USER Close */
  
    case SET_DROPDOWN_DATAS:
      return Object.assign({}, state, action.payload);

    /* SURVEY */
    case SET_RECENT_SURVEY_KEY:
      return Object.assign({}, state, {
        recentSurveyKey: action.payload
      });
    case SET_SURVEYS:
      return Object.assign({}, state, {
        surveyList: action.payload
      })
    case SET_SURVEY_DETAILS:
      const surveyDetail = state.surveyDetails.filter((item) => item.surveyKey === action.payload.surveyKey);
      if (surveyDetail.length > 0) {
        return Object.assign({}, state, {
          surveyDetails: state.surveyDetails.map((item) => {
            if (item.surveyKey === action.payload.surveyKey) {
              return { ...item, ...action.payload }
            } else {
              return item;
            }
          })
        })
      } else {
        return Object.assign({}, state, {
          surveyDetails: [...state.surveyDetails, action.payload]
        })
      }
    /* SURVEY Close */

    /* TRAINING */
    case SET_RECENT_TRAINING_KEY:
      return Object.assign({}, state, {
        recentTrainingKey: action.payload
      });
    case SET_TRAININGS:
      return Object.assign({}, state, {
        trainingList: action.payload
      });
    case SET_TRAINING_DETAILS:
      const trainingDetail = state.trainingDetails.filter((item) => item.trainingKey === action.payload.trainingKey);
      if (trainingDetail.length > 0) {
        return Object.assign({}, state, {
          trainingDetails: state.trainingDetails.map((item) => {
            if (item.trainingKey === action.payload.trainingKey) {
              return { ...item, ...action.payload }
            } else {
              return item;
            }
          })
        })
      } else {
        return Object.assign({}, state, {
          trainingDetails: [...state.trainingDetails, action.payload]
        })
      }
    /* TRAINING Close */

    /* REGIONAL SURVEY */
    case SET_RECENT_REGIONAL_SURVEY_KEY:
      return Object.assign({}, state, {
        recentRegionalSurveyKey: action.payload
      });
    case SET_REGIONAL_SURVEYS:
      return Object.assign({}, state, {
        regionalSurveyList: action.payload
      })
    case SET_REGIONAL_SURVEY_DETAILS:
      const regionalSurveyDetail = state.regionalSurveyDetails.filter((item) => item.regionalSurveyKey === action.payload.regionalSurveyKey);
      if (regionalSurveyDetail.length > 0) {
        return Object.assign({}, state, {
          regionalSurveyDetails: state.regionalSurveyDetails.map((item) => {
            if (item.regionalSurveyKey === action.payload.regionalSurveyKey) {
              return { ...item, ...action.payload }
            } else {
              return item;
            }
          })
        })
      } else {
        return Object.assign({}, state, {
          regionalSurveyDetails: [...state.regionalSurveyDetails, action.payload]
        })
      }
    /* REGIONAL SURVEY Close */

    /* EVENT */
    case SET_RECENT_EVENT_KEY:
      return Object.assign({}, state, {
        recentEventKey: action.payload
      });
    case SET_EVENTS:
      return Object.assign({}, state, {
        eventList: action.payload
      })
    case SET_EVENT_DETAILS:
      const eventDetail = state.eventDetails.filter((item) => item.eventKey === action.payload.eventKey);
      if (eventDetail.length > 0) {
        return Object.assign({}, state, {
          eventDetails: state.eventDetails.map((item) => {
            if (item.eventKey === action.payload.eventKey) {
              return { ...item, ...action.payload }
            } else {
              return item;
            }
          })
        })
      } else {
        return Object.assign({}, state, {
          eventDetails: [...state.eventDetails, action.payload]
        })
      }
    /* EVENT Close */

    /* UNSAVED DATAS (SAVED OFFLINE DATAS) */ 
    case SET_TO_UPDATE_DATAS:
      let key = '';
      switch (action.payload.apiPath) {
        case '/api/survey/UpdateFromMobile': key = 'SurveyKey'; break;
        case '/api/training/CreateFromMobile': key = 'TrainingKey'; break;
        case '/api/training/UpdateFromMobile': key = 'TrainingKey'; break;
        case '/api/regionalsurvey/CreateFromMobile': key = 'RegionalSurveyKey'; break;
        case '/api/regionalsurvey/UpdateFromMobile': key = 'RegionalSurveyKey'; break;
        case '/api/event/CreateFromMobile': key = 'EventKey'; break;
        case '/api/event/UpdateFromMobile': key = 'EventKey'; break;
      }

      const survey = state.toUpdateDatas.filter((item) => item.data[key] === action.payload.data[key]);
      
      if (survey.length > 0 && action.payload.data[key] !== 0) {
        return Object.assign({}, state, {
          toUpdateDatas: state.toUpdateDatas.map((item) => {
            if (item.data[key] === action.payload.data[key]) {
              return { ...item, ...action.payload }
            } else {
              return item;
            }
          })
        })
      } else {
        return Object.assign({}, state, {
          toUpdateDatas: [...state.toUpdateDatas, action.payload]
        })
      }
    case CLEAN_TO_UPDATE_DATAS: 
      return Object.assign({}, state, {
        toUpdateDatas: []
      })
    case offlineActionTypes.CONNECTION_CHANGE:
      if (network.isConnected != action.payload && !action.payload) {
        return { ...state, isNetworkBannerVisible: true };
      } else {
        return { ...state, isNetworkBannerVisible: false };
      }
    /* UNSAVED DATAS Close */

    default:
      return state
  }
}

