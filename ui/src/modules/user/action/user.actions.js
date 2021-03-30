import { userConstants } from '../constants';
import { userService } from '../service';
import _ from 'lodash';
import { setItem } from '../../../helpers';
import { message } from 'antd';
import {Toast} from '../../../wrapperComponents/notificationToast/notificationToast'

export const fetchLoginRequest = request => ({
  type: userConstants.LOGIN_REQUEST,
  payload: {
    loggingIn: true,
    user: request
  }
})

export const fetchLoginSuccess = request => ({
  type: userConstants.LOGIN_SUCCESS,
  payload: { user: { ...request } }
})

export const fetchLoginFailure = error => ({
  type: userConstants.LOGIN_FAILURE,
  payload: {}
})


export const fetchGraphsDataSuccess = request => ({
  type: userConstants.FETCHDATA,
  payload: request
})


export const fetchGraphsData = () => {
  return dispatch => {
    return userService.fetchGraphsData()
      .then(response => {
        dispatch(fetchGraphsDataSuccess(response));
        return response;
      },
        error => {
          
        })
  }
}
export const login = (user) => {
  return dispatch => {
    dispatch(fetchLoginRequest({ user }));
    return userService.login(user)
      .then(response => {
        setItem('user', response);
        dispatch(fetchLoginSuccess(response));
        return response;
      },
        error => {
          dispatch(fetchLoginFailure(error));
          message.error("Invalid Credentials")
          return error
        })
  }
}
export const setUserNewPassword =(userPassword) =>{
  return dispatch =>{
    dispatch(fetchLoginRequest({userPassword}));
    return userService.setUserNewPassword(userPassword)
    .then(response =>{
      dispatch(fetchLoginSuccess(response));
        Toast("success", "Success! Please login again with the new password")
        return response;    
    },
    )
    .catch(err => {
      Toast("error", "Old Password is Invalid")
    })
  }
}
export const setNewPassword = (user, newPassword) => {
  return dispatch => {
    return userService.setNewPassword(user, newPassword)
      .then(response => {
        response.accesstoken = _.get(response, 'signInUserSession.accessToken.jwtToken');
        var userObj = { username: user.username, accesstoken: response.accesstoken };
        if (response.attributes) {
          userObj["email"] = response.attributes["email"];
          userObj["role"] = response.attributes["custom:role"];
          userObj["tenantName"] = response.attributes["custom:tenantName"];
          userObj["tenantID"] = response.attributes["custom:tenantID"];
          userObj["username"] = response.username;
        }
        if (response.pool && response.pool.userPoolId) {
          userObj["region"] = _.first(response.pool.userPoolId.split('_'));
        }
        setItem('user', userObj);
        dispatch(fetchLoginSuccess(user));
        return response;
      },
        error => {
          dispatch(fetchLoginFailure(error));
          return error
        })
  }
}

export const forgotPasswordSubmit = (username, code, new_password) => {
  return dispatch => {
    return userService.forgotPasswordSubmit(username, code, new_password)
      .then(response => {
        return dispatch(login(username, new_password))
          .then((response) => {
            return response;
          })
      },
        error => {
          dispatch(fetchLoginFailure(error));
          return error
        })
  }
}

export const userlogout = () => ({
  type: userConstants.LOGOUT,
  payload: {}
})


export const logout = () => {
  return dispatch => {
    userService.logout();
    return dispatch(userlogout());
  }
}