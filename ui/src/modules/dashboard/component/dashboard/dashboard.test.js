import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import  AdminDashboard  from './dashboard'
import Adapter from 'enzyme-adapter-react-16';
import { shallowToJson} from 'enzyme-to-json';

const tenentlistall={
    data: [{
        name:'tenant',
        company_name:'xcdify'
    }]
  
}
const tenantList={
    data: [{
        name:'tenant',
        company_name:'xcdify'
    }]
  
}
const lineChartdata = {
    categories:[10,20,30],
    series:[1]
}
const membershipPlanList ={
    data: [{
        name:'tenant',
        company_name:'xcdify'
    }]
}

Enzyme.configure({ adapter: new Adapter() })
describe('when page is rendering', () => {
    let dashboardComponent
    const mockDispatch = jest.fn(); 
    beforeEach(() => {
        dashboardComponent = shallow(<AdminDashboard.WrappedComponent tenantListAll ={{ tenentlistall }} lineChartdata={{lineChartdata}} tenantList={{tenantList}} membershipPlanList={{membershipPlanList}} dispatch={mockDispatch}/>)
    })
    afterEach(() => {
        dashboardComponent = null 
    })
    it('should render the form', ()=> {
        expect(shallowToJson(dashboardComponent)).toMatchSnapshot();
    })
    it('should render  the tenant overview cards', ()=> {
        expect(dashboardComponent.find('.tenant-overview-cards').exists()).toEqual(true)
    })

    it('should render the pie chart', () => {
        expect(dashboardComponent.find('.pie-chart').exists()).toEqual(true)
    });

    it('should render the line-chart', () => {
        expect(dashboardComponent.find('.line-chart').exists()).toEqual(true)
    });

    it('should render the membershipPlan container', () => {
        expect(dashboardComponent.find('.membershipPlan-container').exists()).toEqual(true)
    });

    it('should render the tenants list container', () => {
        expect(dashboardComponent.find('.tenants-list-container').exists()).toEqual(true)
    });

    it('should render the heading text', () => {
        expect(dashboardComponent.find('.sprint-name').text()).toEqual('Tenants Overview')
    })
})




