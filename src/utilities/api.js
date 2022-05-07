import axios from 'axios';
import config from './config';

export const get = handleApiCallRN.bind(null, 'GET');
export const post = handleApiCallRN.bind(null, 'POST');
export const put = handleApiCallRN.bind(null, 'PUT');
export const del = handleApiCallRN.bind(null, 'DELETE');

async function handleApiCallRN(method, url, data = {}, otherOptions = {}) {
  const options = {
    method,
    timeout: 5000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    ...otherOptions
  };



  if (method !== 'GET') {
    options.data = data;
  }

  if (url.toLowerCase().indexOf('http') < 0) {
    url = config.SERVER_URL + url;
  }

  options.url = url;
  // console.warn('options', options);
  // return axios(options);
  
  try {
    let response = await axios(options);
    if(response && response.status === 200) {
      response.status = true;
      return response;
    }else{
      response.status = false;
      return response;
    }
  } catch (error) {
    var errorObj = JSON.parse(JSON.stringify(error));
    let response = { };
    response.status = false;
    response.message = errorObj.message //"Something wrong!";
    return response;
    // console.error(error);
  }
}