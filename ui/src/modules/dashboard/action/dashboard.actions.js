import { dashboardConstants } from '../constants';
import { dashboardService } from '../service';

export const fetchIssueListSuccess = request => ({
  type: dashboardConstants.FETCH_DATA,
  payload: request
})

export const fetchIssueList = () => {
  return dispatch => {
    return dashboardService.fetchIssueList()
      .then(response => {
        dispatch(fetchIssueListSuccess(response));
        return response;
      },
        error => {
        })
  }
}

export const fetchPieChartDataSuccess = pieChartData => ({
  type: dashboardConstants.FETCH_PIE_CHART,
  payload: pieChartData
})

export const fetchPieChartData = () => {
  return dispatch => {
    return dashboardService.fetchPieChartData()
      .then(response => {
        dispatch(fetchPieChartDataSuccess(response));
        return response;
      },
        error => {
        })
  }
}

export const fetchCountCardSuccess = request => ({
  type: dashboardConstants.FETCH_COUNT_CARD_DATA,
  payload: request
})

export const fetchCountCard = () => {
  return dispatch => {
    return dashboardService.fetchCountCard()
      .then(response => {
        dispatch(fetchCountCardSuccess(response));
        return response;
      },
        error => {
        })
  }
}

export const fetchSprintDataSuccess = sprintGraphData => ({
  type: dashboardConstants.FETCH_SPRINT_GRAPH_DATA,
  payload: sprintGraphData
})

export const fetchSprintData = () => {
  return dispatch => {
    return dashboardService.fetchSprintData()
      .then(response => {
        dispatch(fetchSprintDataSuccess(response.sprintGraphData));
        return response;
      },
        error => {
        })
  }
}