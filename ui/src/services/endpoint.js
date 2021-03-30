import { environment } from '../helpers/environment';
export const apiEndpoint = environment.isDevelopment() ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_PROD_API_ENDPOINT;
export const apiAuthEndpoint = apiEndpoint + '/auth';
export const apiTenantEndpoint = apiEndpoint + '/tenant/';
export const apiCreatePasswordEndpoint = apiEndpoint + '/user_password/'