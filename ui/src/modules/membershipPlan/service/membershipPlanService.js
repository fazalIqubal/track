import {requestGet, requestPost, requestPut, requestDelete} from '../../../services/requests'
import {apiEndpoint} from '../../../services/endpoint';

export class MembershipPlanService {
    constructor(authEndpoint) {
        this.authEndpoint = authEndpoint;
    }
    createdMembershipPlan(membershipPlan) {
        return requestPost(`${apiEndpoint}/membership_plan`, membershipPlan)
    }
    fetchAllMembershipPlan() {
        return requestGet(`${apiEndpoint}/membership_plan`, {})
    }
    fetchMembershipPlanById(id){
        return requestGet(`${apiEndpoint}/membership_plan/`+id)
    }
    updateMembershipPlan(membershipPlan) {
        return requestPut(`${apiEndpoint}/membership_plan/`+membershipPlan.id, membershipPlan)
    }
    deleteMembershipPlan(membershipPlan) {
        return requestDelete(`${apiEndpoint}/membership_plan/`+membershipPlan)
    }
}
