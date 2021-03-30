import { dashboardConstants } from '../constants';
import { combineReducers } from 'redux'
import createReducer from '../../../helpers/createReducer'

const getIssueListReducer = createReducer([])({
  [dashboardConstants.FETCH_DATA]: (state, action) => action.payload,
})
const getPieChartReducer =createReducer({})({
  [dashboardConstants.FETCH_PIE_CHART]: (state, action) => action.payload,
})
const getCountCardReducer = createReducer([])({
  [dashboardConstants.FETCH_COUNT_CARD_DATA]: (state, action) => action.payload,
})
const getSprintDataReducer = createReducer({})({
  [dashboardConstants.FETCH_SPRINT_GRAPH_DATA]: (state, action) => action.payload,
})
export default combineReducers({
  issueList: getIssueListReducer,
  pieChartData: getPieChartReducer,
  countCard: getCountCardReducer,
  sprintGraphData: getSprintDataReducer,
})
