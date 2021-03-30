import { apiEndpoint } from '../../../services/endpoint';
import { MembershipPlanService } from './membershipPlanService';
export const membershipPlanService = new MembershipPlanService(apiEndpoint);
