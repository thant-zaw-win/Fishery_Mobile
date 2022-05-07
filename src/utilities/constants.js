
import { width, height } from '../styles';

/* Route Name */
export const AUTH_STACK = 'AuthScreen';
export const APP_STACK = 'AppStack';
export const AUTH_LOADING = 'AuthLoading';
export const WELCOME = 'Welcome';
export const SIGN_UP = 'Signup';
export const LOGIN = 'Login';
export const SURVEY_LIST = 'SurveyList';
export const TAKE_SURVEY = 'TakeSurvey';
export const GOOGLE_MAP = 'GoogleMap';
export const CHANGE_PASSWORD = 'ChangePassword';
export const PROFILE = 'Profile';
export const ABOUT = 'About';
export const SETTING = 'Setting';
export const TRAINING = 'Training';
export const TRAINING_DETAIL = 'TrainingDetail';
export const REGIONAL_SURVEY = 'RegionalSurvey';
export const REGIONAL_SURVEY_DETAIL = 'RegionalSurveyDetail';
export const EVENT = 'Event';
export const EVENT_DETAIL = 'EventDetail';

/* Map Values */
const ASPECT_RATIO = width / height;
export const LATITUDE_DELTA = 0.0322; //0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

/* Table List */
export const SURVEY_STATUSES = [
  {value: "Allocated", label: "Allocated"}, 
  {value: "Collected", label: "Collected"}, 
  {value: "Laboratory", label: "Laboratory"}, 
  {value: "Laboratory & Result", label: "Laboratory & Result"}, 
  {value: "Evaluated", label: "Evaluated"}, 
  {value: "Invalid", label: "Invalid"}
];
export const SURVEY_TYPES = [
  {value: 1, label: "Base Line"},
  {value: 2, label: "First Time"},
  {value: 3, label: "Second Time"},
  {value: 4, label: "Third Time"},
  {value: 5, label: "Fourth Time"},
  {value: 6, label: "Fifth Time"},
  {value: 7, label: "Sixth Time"},
  {value: 8, label: "Seventh Time"},
  {value: 9, label: "Eighth Time"},
  {value: 10, label: "Ninth Time"},
  {value: 11, label: "Tenth Time"},
];

/* Image Source */
export const IMAGES = {
  logo: {
    cLogo: require('../assets/images/dof-logo-en.png'),
  },
  profile: {
    profileAvatar: require('../assets/images/dof-logo-en.png'),
  },
  // profileCover: require('../assets/images/mysap-bg.png'),
}


