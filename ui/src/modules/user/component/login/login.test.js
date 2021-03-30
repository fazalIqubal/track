import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Enzyme from 'enzyme';
import Login from './login'
import Adapter from 'enzyme-adapter-react-16';
import logoImage from '../../../../image/logo1.png'
import banner1 from '../../../../image/banner1.png'
import banner2 from '../../../../image/banner2.png'


Enzyme.configure({ adapter: new Adapter() })
describe('when page is rendering', () => {
    let loginComponent
    const mockDispatch = jest.fn();
    beforeEach(() => {
        loginComponent = shallow(<Login.WrappedComponent data={[]} dispatch={mockDispatch} />)
    })
    afterEach(() => {
        loginComponent = null
    })
    it('should create the snapshot', () => {
        expect(shallowToJson(loginComponent)).toMatchSnapshot()
    })

    it('should contain left banner', () => {
        expect(loginComponent.find('.left-banner').prop('src')).toEqual(banner1)
    })
    it('should contain right banner', () => {
        expect(loginComponent.find('.right-banner').prop('src')).toEqual(banner2)
    })

    it('should contain logo', () => {
        expect(loginComponent.find('.app-logo').find('img').prop("src")).toEqual(logoImage)
    })

    it('should contain login heading text', () => {
        expect(loginComponent.find('.login-text').text()).toBe('Log in to your account');
    })

    it('should contain username input', () => {
        expect(loginComponent.find('#name').exists()).toEqual(true)
    })
    it('should contain password input', () => {
        expect(loginComponent.find('#password').exists()).toEqual(true)
    })
    it('should contain remember checkbox', () => {
        expect(loginComponent.find('#rememberMe')).toHaveLength(1);
    })
    
    it("Forgot Password existence ", () => {
        expect(loginComponent.find('#forgotPassword').exists()).toEqual(true);
    })
    it('should contain a tag in forgotPassword', () => {
        expect(loginComponent.find('.login-form-forgot').find('a').exists()).toEqual(true)
    })
    
    it("register existence Check", () => {
        expect(loginComponent.find('#register').exists()).toEqual(true);
    })
    it("signIn Button existence Check", () => {
        expect(loginComponent.find('#signIn').exists()).toEqual(true);
    })

    it('should contain username input onchange', () => {
        loginComponent.find('#name').simulate('change', { target: { value: 'user123', name: 'username' } });
        expect(loginComponent.find('#name').props().value).toEqual('user123');
    })
    it('should contain Password input onchange', () => {
        loginComponent.find('#password').simulate('change', { target: { name: 'password', value: 'Password@123' } });
        expect(loginComponent.find('#password').props().value).toEqual('Password@123');
    })
    
    it('should contain Err Message on username validation', () => {
        expect(loginComponent.find({ name: 'username' }).first().props().rules[0].message).toEqual('Please input your Username!')
    })
    it('should contain Err Message on Password validation', () => {
        expect(loginComponent.find('#passErr').props().rules[0].message).toEqual('Please input your Password!')
    })
    
    it("remember me text", () => {
        expect(loginComponent.find('#rememberMe').props().children).toEqual('Remember me');
    })
    it("check box simulate", () => {
        loginComponent.find({ name: 'remember' }).simulate('change', { target: { checked: true } });
        expect(loginComponent.find({ name: 'remember' }).props().valuePropName).toBe("checked");
    })

    it("signIn Button existence Check loading", () => {
        expect(loginComponent.find('#signIn').props().loading).toEqual(false);
    })
    
    it("register existence Check span text", () => {
        expect(loginComponent.find('#register').find('span').first().text()).toBe("Don't have an account yet? Register now");
    })
   
    it('should empty local storage', () => {
        const localstore = localStorage.getItem('user')
        expect(localstore).toEqual(null)
    })
    describe('state should be set accordingly', () => {
        it('username check', () => {

            loginComponent.find('#name').simulate('change', { target: { name: 'username', value: 'Admin' } });
            expect(loginComponent.state().user.username).toEqual('Admin');
            expect(loginComponent.find('#name').props().value).toEqual('Admin');
        })
        it('password check', () => {

            loginComponent.find('#password').simulate('change', { target: { name: 'password', value: 'dhami12' } });
            expect(loginComponent.state().user.password).toEqual('dhami12');
            expect(loginComponent.find('#password').props().value).toEqual('dhami12');
        })
    })

    describe('when form is invalid', () => {
        it('username should be undefined', () => {
            loginComponent.find('#signIn').simulate('click');
            expect(loginComponent.state().user.username).toEqual(undefined);
        })
        it('password should be undefined', () => {
            loginComponent.find('#signIn').simulate('click');
            expect(loginComponent.state().user.password).toEqual(undefined);
        })
    })
})
