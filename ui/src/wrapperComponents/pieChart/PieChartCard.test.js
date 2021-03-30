import React from 'react'
import ReactDOM from 'react-dom'
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import PieChartCard from './PieChartCard.js'
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() })
import renderer from 'react-test-renderer';

const series = [44, 55, 13]
const labelsName = ['Active', 'Inactive', 'Delete']
const colors = ['Green', 'Red', 'Yellow']

describe('When Pie Chart card render', () => {
    var pieCardComponent;
    beforeEach(() => {
        pieCardComponent = shallow(<PieChartCard colors={colors} labels={labelsName} series={series}/>)
    })
    afterEach(() => {
        pieCardComponent = null;
    })
    it('renders correctly ', () => {
        const tree = renderer.create(<PieChartCard colors={colors} labels={labelsName} series={series} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('should check the Div is Exist', () => {
        expect(pieCardComponent.find('.pieChart').exists()).toEqual(true)
    })
    it('should have pieChart card title text', () => {
        expect(pieCardComponent.find('#chartOptions').props().options.title.text).toEqual('Tenants Statistics')
    })
    it('should check Type of Pie Chart', () => {
        expect(pieCardComponent.find('#chartOptions').props().options.chart.type).toEqual('pie')   
    })
    it('should have Piechart color on index at 0 is Green', () => {
        expect(pieCardComponent.find('#chartOptions').props().options.colors[0]).toEqual('Green')
    })
    
    it('Should have Labels array ', () => {
        expect(pieCardComponent.find('#chartOptions').props().options.labels).toEqual(['Active', 'Inactive', 'Delete'])
    })
    it('Should have series array ', () => {
        expect(pieCardComponent.find('#chartOptions').props().series).toEqual([44, 55, 13])
    })
    it('Should have colors array ', () => {
        expect(pieCardComponent.find('#chartOptions').props().options.colors).toEqual(['Green', 'Red', 'Yellow'])
    })
    it('Should have noData text', () => {
        expect(pieCardComponent.find('#chartOptions').props().options.noData.text).toEqual("No statistics available for tenants.")
    })
})


