import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import  Users  from './users'
import Adapter from 'enzyme-adapter-react-16';
import { shallowToJson} from 'enzyme-to-json';
import Search from 'antd/lib/input/Search';

Enzyme.configure({ adapter: new Adapter() })
describe('when page is rendering', () => {
    let userDataComponent
    const mockDispatch = jest.fn();
    beforeEach(() => {
        userDataComponent = shallow(<Users.WrappedComponent usersData ={{ data: [] }} dispatch={mockDispatch}/>)
    })
    afterEach(() => {
        userDataComponent = null
    })
    
    it('should render the form', ()=> {
        expect(shallowToJson(userDataComponent)).toMatchSnapshot();
    })
    it('should have a heading text', ()=> {
        expect(userDataComponent.find('h3').text()).toBe('Users');
    })
    it('should have a input box ', ()=> {
        expect(userDataComponent.find('.search-box').exists()).toEqual(true);
    })
    it('should have a input box ', ()=> {
        expect(userDataComponent.find('.search-box').props().placeholder).toBe('Search ');
    })
    it('should have a button', ()=> {
        expect(userDataComponent.find('Button').exists()).toEqual(true);
    })
    it('should have text in button', ()=> {
        expect(userDataComponent.find('Button').text()).toEqual('Create User');
    })
    it('should render the usertable', ()=> {
        expect(userDataComponent.find('.users-table').exists()).toEqual(true);
    })
    it('should render the usertable', ()=> {
        expect(userDataComponent.find('.user-form-container').exists()).toEqual(true);
    })
    
})
