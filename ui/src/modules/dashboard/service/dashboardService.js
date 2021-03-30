export class DashboardService {
  constructor(authEndpoint) {
    this.authEndpoint = authEndpoint;
  }
  fetchPieChartData() {
    return new Promise((resolve, reject) => {
      resolve({
        series: [],
        labels: [],
      })
    })
  }
  fetchIssueList() {
    return new Promise((resolve, reject) => {
      resolve(
        {
          issueList: [
            {
              key: '1',
              issueId: '001',
              title: 'Issue #1',
              issueStatus: 'Open',
              tags: ['Medium'],
              issueType: 'Defect',
              issueReporter: 'Chetan Dhami',
              name: 'John Brown',
            },
            {
              key: '2',
              issueId: '002',
              title: 'Issue #2',
              issueStatus: 'In-Progress',
              tags: ['Low'],
              issueType: 'UI Fix',
              issueReporter: 'Yogesh Dhami',
              name: 'John Brown',
            },
            {
              issueId: '001',
              title: 'Issue #3',
              issueStatus: 'Open',
              tags: ['High'],
              issueType: 'New Feature',
              issueReporter: 'Chetan Dhami',
              name: 'John Brown',
            },
          ],
        
        }
      )
    })
  }
  fetchSprintData(){
    return new Promise((resolve, reject)=>{
      resolve(
        {
          sprintGraphData: {
            titleText: 'Sprint Timeline',
            colors:['#f3f3f3', 'transparent'],
            categories: ['sprint1', 'sprint2', 'sprint3', 'sprint4', 'sprint5', 'sprint6', 'sprint7', 'sprint8', 'sprint9'],
            series: [{
              name: "Issues",
              data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
            }],
          }
        }
      )
    })
  }

  fetchCountCard() {
    return new Promise((resolve, reject) => {
      resolve(
        [
          {
            className: 'active-issue',
            value: '6',
            title: 'Active',
            icon : require("../../../image/active-issues.svg")
          },
          {
            className: 'open-issue',
            value: '3',
            title: 'Open',
            icon : require("../../../image/open-issues.svg")
          },
          {
            className: 'progress-issue',
            value: '2',
            title: 'In progress',
            icon : require("../../../image/progress-issues.svg")
          },
          {
            className: 'resolved-issue',
            value: '2',
            title: 'Resolved',
            icon : require("../../../image/resolved-issues.svg")
          }
        ]
      )
    })
  }
}
