import { membershipPlanConstants } from '../constants';
import { membershipPlanService } from '../service';
import { Toast } from '../../../wrapperComponents/notificationToast/notificationToast'

export const setMembershipPlan = membershipPlanData => ({
  type: membershipPlanConstants.SET_MEMBERSHIPPLAN,
  payload: membershipPlanData || {}
})
export const fetchMembershipPlanListSuccess = membershipPlanList => ({
  type: membershipPlanConstants.FETCH_MEMBERSHIPPLAN_DATA,
  payload: membershipPlanList || []
})
export const setEditMembershipPlan = editedMembershipPlan => ({
  type: membershipPlanConstants.SET_EDIT_MEMBERSHIPPLAN,
  payload: editedMembershipPlan || {}
})

export const createdMembershipPlan = (membershipPlan) => {
  return dispatch => {
    return membershipPlanService.createdMembershipPlan(membershipPlan)
      .then(response => {
        dispatch(fetchMembershipPlan())
        Toast(response.type, response.message)
        return response;
      }).catch(err => {
          Toast("error", "Something Went Wrong")
        })
  }
}

export const fetchMembershipPlan = () => {
  return dispatch => {
    return membershipPlanService.fetchAllMembershipPlan()
      .then(response => {
        dispatch(fetchMembershipPlanListSuccess(response));
        return response;
      },
        error => {
        })
  }
}


export const updateMembershipPlan = (membershipPlan) => {
  return dispatch => {
    return membershipPlanService.updateMembershipPlan(membershipPlan)
      .then(response => {
        dispatch(fetchMembershipPlan())
        Toast(response.type, response.message)
        return response;
      }).catch(err => {
        Toast("error", "Something Went Wrong")
      })
  }
}

export const deleteMembershipPlan = (membershipPlan) => {
  return dispatch => {
    return membershipPlanService.deleteMembershipPlan(membershipPlan)
      .then(response => {
        dispatch(fetchMembershipPlan())
        Toast(response.type, response.message)
        return response;
      }).catch(err => {
        Toast("error", "Something Went Wrong")
      })
  }
}
