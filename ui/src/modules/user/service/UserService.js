import { requestDelete, requestGet, requestPost, requestPut } from '../../../services/requests';
/**
 * Supports all operations exposed by the user controller.
 */
import {apiCreatePasswordEndpoint} from '../../../services/endpoint'

export class UserService {

  constructor(authEndpoint) {
    this.authEndpoint = authEndpoint;
  }


  login(data) {
    const url = this.authUrl('/login');
    return requestPost(url, data);
  }
  
  setUserNewPassword(password){
    const url = apiCreatePasswordEndpoint
    return requestPut(url, password)
  }
  setNewPassword(user, newPassword) {
    return new Promise((resolve, reject) => {
      resolve({})
    });
  }

  forgotPasswordSubmit(username, code, new_password) {
    return new Promise((resolve, reject) => {
      return new Promise((resolve, reject) => {
        resolve({})
      });
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
    localStorage.removeItem('user');
  }

  users() {
    const url = this.authUrl('/users');
    return requestGet(url);
  };

  /**
   * Returns the new user or a string containing the error message.
   */
  createUser(user) {
    const url = this.authUrl('/users');
    return requestPost(url, user);
  };

  /**
   * Returns the updated user or a string containing the error message.
   */
  updateUser(user) {
    const url = this.authUrl('/users/' + user.id);
    return requestPut(url, user);
  };

  /**
   * Returns a string message on success.
   */
  deleteUser(userId) {
    const url = this.authUrl('/users/' + userId);
    return requestDelete(url);
  };

  roles() {
    const url = this.authUrl('/roles');
    return requestGet(url);
  };

  authUrl(append) {
    return this.authEndpoint + append;
  }
}
