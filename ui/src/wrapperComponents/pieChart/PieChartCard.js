import React, { Component } from "react";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";

class PieChartCard extends Component {
  render() {
    return (
        <div className='pieChart'>
         <ReactApexChart id="chartOptions"
          options={
            {
              colors:  this.props.colors,
              title: {
                text: 'Tenants Statistics',
                align: 'left',
              },
              noData: {
                text: "No statistics available for tenants.",
                align: 'center',
                verticalAlign: 'middle',
                },
              chart: {
                width: 280,
                type: 'pie',
              },
              labels: this.props.labels,
              legend: { position: 'bottom', fontSize : '16px' },
              responsive: [{
                breakpoint: 280,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'center'
                  }
                }
              }]
            }
          }
          series={this.props.series}
          type="pie" />
        </div>   
    );
  }
}

export default PieChartCard;