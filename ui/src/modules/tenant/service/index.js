import { apiEndpoint } from '../../../services/endpoint';
import { TenantService } from './tenantService';
export const tenantService = new TenantService(apiEndpoint);