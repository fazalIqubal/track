import { apiEndpoint } from '../../../services/endpoint';
import { DashboardService } from './dashboardService';
export const dashboardService = new DashboardService(apiEndpoint);
