import React from 'react';
import ReactApexChart from 'react-apexcharts';

export class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        chart: {
          toolbar: {
            show: false
          }
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: '',
          align: 'left'
        },
        grid: {
          row: {
            colors: [], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: [],
        },
        noData: {
          text: "No Onboarding Statistics Available For Tenants",
          align: 'center',
          verticalAlign: 'middle',
          offsetX:  0,
          offsetY: 0
        }
      },
      series: [],
    }
  }

  componentDidMount(){
    let {categories, titleText, colors } = this.props
    let { options } = this.state
    if(titleText){
      options.xaxis.categories = categories || []
      options.title.text = titleText
      options.grid.row.colors= colors
      this.setState({ options})
    }
  }

  render() {
    return (
      <div className="lineChart">
        {this.state.options.title.text&&
          <ReactApexChart
          options={this.state.options}
          series={this.props.series} 
          height={350}
          type='line'
        />
        }
    </div> 
    )
  }
}

