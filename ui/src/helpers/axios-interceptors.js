import { history } from './history';
import _ from "lodash";
import {getItem} from '../helpers/localstore'

/**
 * @returns Unregister callback
*/

const hideShow = (flag) => {
  if (document.getElementById("ui_block")) {
    document.getElementById("ui_block").style.display = flag;
  }
}

const isHandlerLoading = (config = {}) => {
  return config.hasOwnProperty('isLoading') && config.isLoading ?
    true : false
}

export function axiosInterceptors() {
  const axios = require('axios');
  axios.interceptors.request.use(req => {
    if (isHandlerLoading(req)) {
      hideShow('flex')
    }
    var token = JSON.parse(getItem('user'));
    if (token && token.access_token) {
      req.headers.authorization = "Bearer " + token.access_token;
      
    }
    
    return req;
  }, (error) => {
    setTimeout(() => {
      hideShow('none')
    }, 500)
    return Promise.reject(error);
  });
  
  axios.interceptors.response.use((response) => {
    setTimeout(() => {
      hideShow('none')

    }, 500)
    return response;
  }, (error) => {
    setTimeout(() => {
      hideShow('none')
    }, 500)
    if ((error.response && 401 === error.response.status) || (error.response && 422 === error.response.status)) {
      localStorage.clear();
      history.push('/login');
    }
    return Promise.reject(error);
  });
}
