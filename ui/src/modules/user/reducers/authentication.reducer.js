import { userConstants } from '../constants';
import { combineReducers } from 'redux'
import createReducer from '../../../helpers/createReducer'

let user = JSON.parse(localStorage.getItem('user')) || {};
const initialState = { user } || { user: {} };

const authenticationReduser = createReducer(initialState)({
  [userConstants.LOGIN_REQUEST]: (state, action) => action.payload,
  [userConstants.LOGIN_SUCCESS]: (state, action) => action.payload,
  [userConstants.LOGIN_FAILURE]: (state, action) => action.payload,
  [userConstants.LOGOUT]: (state, action) => action.payload,
})


export default authenticationReduser