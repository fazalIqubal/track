import { apiEndpoint } from '../../../services/endpoint';
import { UsersService } from './usersService';
export const usersService = new UsersService(apiEndpoint);
