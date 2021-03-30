import React from 'react';
import ReactDOM from 'react-dom';
import {configure, shallow } from 'enzyme';
import { shallowToJson} from 'enzyme-to-json';
import MembershipPlanForm from './membershipPlanForm'
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

const membershipData = {
    name:"Standard",
    description:'6 Month',
    ptice: 299,
    project_limit:8,
    user_limit:6,
    plan_duration:"Six Months"
}
describe('when page is rendering', () => {
    let membershipPlanForm
    const mockDispatch = jest.fn();
    beforeEach(() => {
        membershipPlanForm = shallow(<MembershipPlanForm.WrappedComponent editedMembershipPlanList ={membershipData} dispatch={mockDispatch}/>)
    })
    afterEach(() => {
        membershipPlanForm = null;
    });
    it('should render the form', () => {
        expect(shallowToJson(membershipPlanForm)).toMatchSnapshot()
    });
    it('should render the form lable', () => {
        expect(membershipPlanForm.find('.membershipPlan_name').exists()).toEqual(true);
        expect(membershipPlanForm.find('.description').exists()).toEqual(true);
        expect(membershipPlanForm.find('.price').exists()).toEqual(true);
        expect(membershipPlanForm.find('.project_limit').exists()).toEqual(true);
        expect(membershipPlanForm.find('.user_limit').exists()).toEqual(true);
        expect(membershipPlanForm.find('.plan_duration').exists()).toEqual(true);
    });
    it('should pre fill fields', () => {
        expect(membershipPlanForm.find("#membershipPlan_name").find({name: 'name'}).props().value).toBe(membershipData.name);
        expect(membershipPlanForm.find("#description").find({name: 'description'}).props().value).toBe(membershipData.description);
        expect(membershipPlanForm.find("#price").find({name: 'price'}).props().value).toBe(membershipData.price);
        expect(membershipPlanForm.find("#project_limit").find({name: 'project_limit'}).props().value).toBe(membershipData.project_limit);
        expect(membershipPlanForm.find("#user_limit").find({name: 'user_limit'}).props().value).toBe(membershipData.user_limit);
        expect(membershipPlanForm.find("#plan_duration").find({name: 'plan_duration'}).props().value).toBe(membershipData.plan_duration);
    });
   
});