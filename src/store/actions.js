
//import firebase from '../components/firebase';
import { Api } from '../utilities';

export const SET_LOGGEDIN_USER = 'SET_LOGGEDIN_USER';

export const SET_RECENT_SURVEY_KEY = 'SET_RECENT_SURVEY_KEY';
export const SET_SURVEYS = 'SET_SURVEYS';
export const SET_SURVEY_DETAILS = 'SET_SURVEY_DETAILS';

export const SET_RECENT_TRAINING_KEY = 'SET_RECENT_TRAINING_KEY';
export const SET_TRAININGS = 'SET_TRAININGS';
export const SET_TRAINING_DETAILS = 'SET_TRAINING_DETAILS';

export const SET_RECENT_REGIONAL_SURVEY_KEY = 'SET_RECENT_REGIONAL_SURVEY_KEY';
export const SET_REGIONAL_SURVEYS = 'SET_REGIONAL_SURVEYS';
export const SET_REGIONAL_SURVEY_DETAILS = 'SET_REGIONAL_SURVEY_DETAILS';


export const SET_RECENT_EVENT_KEY = 'SET_RECENT_EVENT_KEY';
export const SET_EVENTS = 'SET_EVENTS';
export const SET_EVENT_DETAILS = 'SET_EVENT_DETAILS';

export const SET_TO_UPDATE_DATAS = 'SET_TO_UPDATE_DATAS';
export const CLEAN_TO_UPDATE_DATAS = 'CLEAN_TO_UPDATE_DATAS';

export const SET_DROPDOWN_DATAS = 'SET_DROPDOWN_DATAS';

/* USER */
export function setLoggedinUser(loginUser) {
  return { type: SET_LOGGEDIN_USER, payload: loginUser }
}
/* USER Close */

export function setDropDownDatas(datas) {
  return { type: SET_DROPDOWN_DATAS, payload: datas }
}

/* SURVEY */
export function setRecentSurveyKey(key) {
  return { type: SET_RECENT_SURVEY_KEY, payload: key }
}

export function setSurveys(datas) {
  return { type: SET_SURVEYS, payload: datas }
}

export function setSurveyDetail(dataDetails) {
  return { type: SET_SURVEY_DETAILS, payload: dataDetails }
}
/* SURVEY Close */

/* TRAINING */
export function setRecentTrainingKey(key) {
  return { type: SET_RECENT_TRAINING_KEY, payload: key }
}

export function setTrainings(datas) {
  return { type: SET_TRAININGS, payload: datas }
}

export function setTrainingDetail(dataDetails) {
  return { type: SET_TRAINING_DETAILS, payload: dataDetails }
}
/* TRAINING Close */

/* REGIONAL SURVEY */
export function setRecentRegionalSurveyKey(key) {
  return { type: SET_RECENT_REGIONAL_SURVEY_KEY, payload: key }
}

export function setRegionalSurveys(datas) {
  return { type: SET_REGIONAL_SURVEYS, payload: datas }
}

export function setRegionalSurveyDetail(dataDetails) {
  return { type: SET_REGIONAL_SURVEY_DETAILS, payload: dataDetails }
}
/* REGIONAL SURVEY Close */

/* EVENT */
export function setRecentEventKey(key) {
  return { type: SET_RECENT_EVENT_KEY, payload: key }
}

export function setEvents(datas) {
  return { type: SET_EVENTS, payload: datas }
}

export function setEventDetail(dataDetails) {
  return { type: SET_EVENT_DETAILS, payload: dataDetails }
}
/* EVENT Close */

/* UNSAVED DATA */
export function setToUpdateDatas(method, apiPath, data) {
  return { type: SET_TO_UPDATE_DATAS, payload: { method, apiPath, data } }
}

export function cancelToUpdateDatas() {
  return { type: CLEAN_TO_UPDATE_DATAS }
}
/* UNSAVED DATA Close */
