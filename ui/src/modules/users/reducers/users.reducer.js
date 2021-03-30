import { usersConstants } from '../constants';
import { combineReducers } from 'redux'
import createReducer from '../../../helpers/createReducer'

const getUsersDataReducer = createReducer({})({
  [usersConstants.FETCH_USERS_DATA]: (state, action) => action.payload,
})

const editedUserData = createReducer({})({
  [usersConstants.SET_EDIT_USER]: (state, action) => action.payload,
})

const setOrignalUser = createReducer({})({
  [usersConstants.SET_USER]: (state, action) => action.payload,
})

export default combineReducers({
  usersData: getUsersDataReducer,
  editedUserData: editedUserData,
  setOrignalUser: setOrignalUser
})
