import { usersConstants } from '../constants';
import { usersService } from '../service';
import { Toast } from '../../../wrapperComponents/notificationToast/notificationToast'

export const setUser = userData => ({
  type: usersConstants.SET_USER,
  payload: userData
})

export const fetchUsersListSuccess = usersList => ({
  type: usersConstants.FETCH_USERS_DATA,
  payload: usersList
})

export const fetchUsersList = (searchData) => {
  return dispatch => {
    return usersService.fetchAllUsers(searchData)
      .then(response => {
        dispatch(fetchUsersListSuccess(response));
        return response;
      },
        error => {
        })
  }
}

export const CreateUser  = (user) => {
  return dispatch => {
    return usersService.createUser(user)
      .then(response => {
        dispatch(fetchUsersList())
        Toast(response.type, response.message)
        return response;
      }).catch(err => {
        Toast("error", "Something Went Wrong")
      })
  }
}

export const deleteUser = (user) => {
  return dispatch => {
    return usersService.deleteUser(user)
      .then(response => {
        dispatch(fetchUsersList())
        Toast("success", "Data Successfully Deleted")
        return response;
      }).catch(err => {
        Toast("error", "Something Went Wrong")
      })
  }
}

export const setEditUser = editedUser => ({
  type: usersConstants.SET_EDIT_USER,
  payload: editedUser
})


export const updateUser = (user) => {
  return dispatch => {
    return usersService.updateUser(user)
      .then(response => {
        dispatch(fetchUsersList())
        Toast("success", "Data Successfully Updated")
        return response;
      }).catch(err => {
        Toast("error", "Something Went Wrong")
      })
  }
}
