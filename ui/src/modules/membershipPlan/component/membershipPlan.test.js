import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import  MembershipPlansList  from './membershipPlan'
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
Enzyme.configure({ adapter: new Adapter() })

describe('when page is rendering', () => {
    let membershipPlan
    const mockDispatch = jest.fn();
    beforeEach(() => {
        membershipPlan = shallow(<MembershipPlansList.WrappedComponent membershipPlanList ={{ data: [] }} dispatch={mockDispatch}/>)
    })
    afterEach(() => {
        membershipPlan = null
    })
    it('should have a button', ()=> {
        expect(membershipPlan.find('Button')).to.have.length(1);
    })
    it('should render the membershipPlan', ()=> {
        expect(membershipPlan.find('.membershipPlan-table')).to.have.length(1);
    })
    it('should render the membershipPlantable', ()=> {
        expect(membershipPlan.find('.membershipPlan-form-container')).to.have.length(2);
    })
    
})
