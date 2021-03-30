import { ApiOperatorService } from './ApiOperatorService';
import { apiAuthEndpoint, apiOperatorEndpoint } from './endpoint';
import { UserService } from './UserService';

export const userService = new UserService(apiAuthEndpoint);
export const apiOperatorService = new ApiOperatorService(apiOperatorEndpoint);