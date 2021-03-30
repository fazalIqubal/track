import { membershipPlanConstants } from '../constants';
import { combineReducers } from 'redux'
import createReducer from '../../../helpers/createReducer'

const getMembershipPlanListReducer = createReducer([])({
    [membershipPlanConstants.FETCH_MEMBERSHIPPLAN_DATA]: (state, action) => action.payload,
})
const editedMembershipPlanReducer = createReducer({})({
    [membershipPlanConstants.SET_EDIT_MEMBERSHIPPLAN]: (state, action) =>  action.payload,
})
const editMembershipPlanReducer = createReducer({})({
    [membershipPlanConstants.SET_MEMBERSHIPPLAN]: (state, action) =>  action.payload,
})
export default combineReducers({
    membershipPlanList: getMembershipPlanListReducer,
    editedMembershipPlanList: editedMembershipPlanReducer,
    editMembershipPlanList: editMembershipPlanReducer
})