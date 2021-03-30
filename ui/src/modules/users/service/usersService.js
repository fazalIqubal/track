import axios from 'axios';
import {requestGet,requestPost,requestPut,requestDelete} from '../../../services/requests';
import {apiEndpoint} from '../../../services/endpoint';

export class UsersService {
  constructor(authEndpoint) {
    this.authEndpoint = authEndpoint;
  }
 
  createUser(user){
    return requestPost(`${apiEndpoint}/users`,user)
  }

  fetchAllUsers(searchData = ''){
    return requestGet(`${apiEndpoint}/users?searchData=${searchData}`,{})
  }

  deleteUser(user){
    return requestDelete(`${apiEndpoint}/users/`+user)
  }

  updateUser(user) {
    return requestPut(`${apiEndpoint}/users/`+user.id,
    user)
  }

  fetchUserById(id){
    return requestGet(`${apiEndpoint}/users/`+id)
  }
}


