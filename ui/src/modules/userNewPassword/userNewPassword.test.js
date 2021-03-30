import React from 'react'
import ReactDOM from 'react-dom'
import { shallow, mount } from 'enzyme';
import Enzyme from 'enzyme';
import { shallowToJson, toJson } from 'enzyme-to-json';
import userNewPassword from './userNewPassword';
import Adapter from 'enzyme-adapter-react-16';
import renderer from "react-test-renderer";
Enzyme.configure({ adapter: new Adapter() })
import logoImage from '../../image/logo1.png'

describe("user new Password test Description", () => {
    let userNewPasswordcomponent;
    const mockDispatch = jest.fn();
    beforeEach(() => {
        userNewPasswordcomponent = shallow(<userNewPassword.WrappedComponent data={[]} dispatch={mockDispatch} />)
    })
    afterEach(() => {
        userNewPasswordcomponent = null;
    })

    it('userNewPassword should render correctly', () => {
        expect(shallowToJson(userNewPasswordcomponent)).toMatchSnapshot();
    });
    it('check the form heading text', () => {
        expect(userNewPasswordcomponent.find('.login-text').text()).toBe('Please enter a new password for your account')
    })
    it('should contain logo', () => {
        expect(userNewPasswordcomponent.find(".app-logo").find('img').prop("src")).toEqual(logoImage);
    })
    it("To check temp password field existence ", () => {
        expect(userNewPasswordcomponent.find('#temp_password').exists()).toEqual(true)
    })
    it('To check user_newpassword field existence ', () => {
        expect(userNewPasswordcomponent.find('#user_newpassword').exists()).toEqual(true)
    })
    it('To check user_confirm_password field existence ', () => {
        expect(userNewPasswordcomponent.find('#user_confirm_password').exists()).toEqual(true)
    })
    it('To check submit Button existence ', () => {
        expect(userNewPasswordcomponent.find('#submit').exists()).toEqual(true)
    })
    it('Onchange Temp password Field', () => {
        userNewPasswordcomponent.find('#temp_password').simulate('change', { target: { value: 'temp@123', name: 'temp_password' } });
        expect(userNewPasswordcomponent.find('#temp_password').props().value).toBe('temp@123');
    })
    it('Onchange New password Field', () => {
        userNewPasswordcomponent.find('#user_newpassword').simulate('change', { target: { value: 'Password@123', name: 'user_newpassword' } });
        expect(userNewPasswordcomponent.find('#user_newpassword').props().value).toBe('Password@123');
    })
    it('Onchange confirm password Field', () => {
        userNewPasswordcomponent.find('#user_confirm_password').find({ name: 'user_confirm_password' }).simulate('change', { target: { value: 'comPassword@123', name: 'user_confirm_password' } });
        expect(userNewPasswordcomponent.find('#user_confirm_password').find({ name: 'user_confirm_password' }).props().value).toBe('comPassword@123');
    })
    it('Onchange confirm password Field match with new Password field', () => {
        userNewPasswordcomponent.find('#user_newpassword').simulate('change', { target: { value: 'matchPassword@123', name: 'user_newpassword' } });
        var matchpassword = userNewPasswordcomponent.find('#user_newpassword').props().value
        userNewPasswordcomponent.find('#user_confirm_password').simulate('change', { target: { value: 'matchPassword@123', name: 'user_confirm_password' } });
        expect(userNewPasswordcomponent.find('#user_confirm_password').props().value).toEqual(matchpassword);
    })

    it("error message for user temp password", () => {
        expect(userNewPasswordcomponent.find({ name: 'temp_password' }).first().props().rules[0].message).toBe('Please input your temp password!')
    })
    it("error message for user New password", () => {
        expect(userNewPasswordcomponent.find({ name: 'user_newpassword' }).first().props().rules[0].message).toBe('Please input your New Password!')
    })
    it("error message for user Confirm password", () => {
        expect(userNewPasswordcomponent.find({ name: 'user_confirm_password' }).first().props().rules[0].message).toBe('Please input your Confirm Password!')
    })
    it('submit button text check', () => {
        expect(userNewPasswordcomponent.find('#submit').text()).toEqual('Submit')
    })

})


